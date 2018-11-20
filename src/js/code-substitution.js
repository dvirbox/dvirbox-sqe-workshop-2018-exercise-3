import * as escodegen from 'escodegen';

export {substituteCode, substituteFromEnvironment, getGlobals};

function getStringCode(parsedCode, codeString){
    return codeString.substring(parsedCode.range[0],parsedCode.range[1]);
}

function getGlobals(parsedCode, environment, code) {
    let lines = code.split('\n');
    let program = parsedCode.body;
    const reducerVarDeceleration  = (acc, element) => (element.type === 'VariableDeclaration'|| element.type === 'ExpressionStatement') ?
        substitution(element, environment, lines) :
        element;
    program = program.reduce(reducerVarDeceleration, []);
    const reducer = (acc, codeRow) => acc + codeRow + '\n';
    return Array.isArray(program) ? program.reduce(reducer, '') : getStringCode(program, code);
}

let args = []; //TODO: maybe make as argument

function isNesseccaryPreParan(isParanTokenBefore, tokens, i){
    const isRedundentParan = i < tokens.length-1 && (tokens[i+1]==='[');
    return (isParanTokenBefore && !isRedundentParan);
}

function isParenthesisSubToken(tokens, environment, token, i){
    const paranTokens = ['*', '/', '^'];
    const isParanTokenBefore = i > 0 && paranTokens.includes(tokens[i-1]);
    const isParanTokenAfter = i < tokens.length-1 && paranTokens.includes(tokens[i+1]);
    return isNesseccaryPreParan(isParanTokenBefore, tokens, i) || isParanTokenAfter;
}

function getTokenValue(tokens, environment, token, i ,value){
    return isParenthesisSubToken(tokens, environment, token, i) ? ' (' + value + ') ' :  addToken(value);
}

addToken.is = 0;
function addToken(token){
    if(token ==='['){
        addToken.is ++;
    }
    const ans = (addToken.is === 0) ? ' ' + token : token;
    if(token === ']'){
        addToken.is --;
    }
    return ans;
}

function substituteConsiderParenthesis(tokens, environment){
    let acc = '';
    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        try{
            if(token in environment){
                acc += getTokenValue(tokens, environment, token, i , environment[token]);
            } else{
                const tokenValue = eval(chainEnv(environment, token));
                if(tokenValue){
                    const tokenString = JSON.stringify(tokenValue);
                    acc += getTokenValue(tokens, environment, token, i , tokenString);
                }else{ acc += addToken(token);}
            }
        } catch(e){
            acc += addToken(token);
        }
    }
    return acc.trim();
}
function chainEnv(env, token){
    let acc = '';
    Object.keys(env).forEach(function(key) {
        acc += 'let ' + key + '=' + env[key] + ';';
    });
    return acc + token;
}

function substituteFromEnvironment(parsedStatement, environment){
    const statement = resolveExpression(parsedStatement).replace(/\s+/g,' ').trim();
    let tokens = statement.replace(/[(]/g, '( ')
        .replace(/[)]/g, ' )')
        .replace(/[[]/g, ' [ ')
        .replace(/[\]]/g, ' ] ')
        .replace(/[,]/g, ' , ')
        .trim()
        .split(/\s+/g);
    return substituteConsiderParenthesis(tokens, environment);
}

function substituteFunction(parsedFunction, environment, code, initialVector) {
    const reducer = (acc, statement) => {
        args.push(statement.name);
    };
    parsedFunction.params.reduce(reducer, []);
    const body = substitution(parsedFunction.body, environment, code, initialVector);
    args = []; //clear args
    return body;
}

function substituteBlockStatement(parsedBlockStatements, environment, code, initialVector) {
    const blockStatements = parsedBlockStatements.body;
    const reducer = (acc, statement) => {
        code = substitution(statement, environment, code, initialVector);
        return code;
    };
    return blockStatements.reduce(reducer, '');
}

function substituteVariableDeclaration(parsedDeclarations, environment, code) {
    const declarations = parsedDeclarations.declarations;
    declarations.map((declaration) => {
        const name = resolveExpression(declaration.id);
        const init = declaration.init ? substituteFromEnvironment(declaration.init, environment) : 'null';
        environment[name] = init;//Array.isArray(init)? JSON.stringify(init) : init
    });
    const lineIndex = parsedDeclarations.loc.start.line - 1;
    const line = code[lineIndex];
    const pre = line.substring(0,parsedDeclarations.loc.start.column);
    const post = line.substring(parsedDeclarations.loc.end.column);
    code[lineIndex] = pre + post;
    return code;
}

function getKey(name){
    const regex = new RegExp(/^[a-zA-Z0-9_.-]+/);
    const keyArr = name.match(regex);
    return (name.includes('[') && keyArr) ? keyArr[0] : name;
}

function updateEnvironment(name, value, env, key){
    try{
        const evalPreProccess = name + '=' + value + ';' + key;
        const v = eval(chainEnv(env, evalPreProccess));
        env[key] = Array.isArray(v)? JSON.stringify(v) : String(v);
    }catch (e) {
        env[name] = value;
    }
}

function substituteAssignmentExpression(parsedAssignmentExpression, environment, code, initialVector) {
    const name = resolveExpression(parsedAssignmentExpression.left);
    const value = substituteFromEnvironment(parsedAssignmentExpression.right, environment);
    const key = getKey(name);
    (key in initialVector) ?
        updateEnvironment(name, value, initialVector, key) :
        updateEnvironment(name, value, environment, key);

    const isFuncArgument = args.includes(key);
    const lineIndex = parsedAssignmentExpression.loc.start.line - 1;
    const line = code[lineIndex];
    const pre = line.substring(0,parsedAssignmentExpression.right.loc.start.column);
    const post = line.substring(parsedAssignmentExpression.right.loc.end.column);
    code[lineIndex] = isFuncArgument ? pre + value +  post : '';
    return code;
}

function substituteWhileStatement(parsedWhileStatement, environment, code, initialVector) {
    const condition = substituteFromEnvironment(parsedWhileStatement.test, environment);
    const lineIndex = parsedWhileStatement.loc.start.line - 1;
    const line = code[lineIndex];

    const pre = line.substring(0,parsedWhileStatement.test.loc.start.column);
    const post = line.substring(parsedWhileStatement.test.loc.end.column);
    code[lineIndex] = pre + condition +  post;
    const body = substitution(parsedWhileStatement.body, copyEnvironment(environment) , code, initialVector);
    return body;
}

function substituteIfStatement(parsedIfStatement, environment, code, initialVector) {
    const condition = substituteFromEnvironment(parsedIfStatement.test, environment);
    const lineIndex = parsedIfStatement.loc.start.line - 1;
    const line = code[lineIndex];

    const pre = line.substring(0,parsedIfStatement.test.loc.start.column);
    const post = line.substring(parsedIfStatement.test.loc.end.column);
    code[lineIndex] = pre + condition +  post;
    code = substitution(parsedIfStatement.consequent, copyEnvironment(environment), code, initialVector);
    if (parsedIfStatement.alternate) { /**if else statements flow**/
        code = (parsedIfStatement.alternate.type === 'IfStatement') ?
            substituteIfStatement(parsedIfStatement.alternate, copyEnvironment(environment), code, initialVector) :
            substitution(parsedIfStatement.alternate, copyEnvironment(environment), code, initialVector);

    }
    return code;
}

function substituteReturnStatement(parsedReturnStatement, environment, code) {
    if(parsedReturnStatement.argument){
        const retValue = substituteFromEnvironment(parsedReturnStatement.argument, environment);
        const lineIndex = parsedReturnStatement.loc.start.line - 1;
        const line = code[lineIndex];

        const pre = line.substring(0,parsedReturnStatement.argument.loc.start.column);
        const post = line.substring(parsedReturnStatement.argument.loc.end.column);
        code[lineIndex] = pre + retValue +  post;
    }
    return code;
}

function resolveProgram(parsedProgram, environment, code, initialVector){
    return substitution(parsedProgram.body[0], environment, code, initialVector);
}

function substituteExpressionStatement(parsedExpressionStatement, environment, code, initialVector){
    return substitution(parsedExpressionStatement.expression, environment, code, initialVector);
}

function resolveExpression(parsedCode){
    return escodegen.generate(parsedCode); //parsedCode ? escodegen.generate(parsedCode) : ''
    // return parsedCode ? codeString.substring(parsedCode.range[0],parsedCode.range[1]): '';
}

function substitution(parsedCode, environment, code, initialVector){
    const typeToResolverMapping = {
        Program: resolveProgram,
        AssignmentExpression: substituteAssignmentExpression,
        BlockStatement: substituteBlockStatement,
        ExpressionStatement: substituteExpressionStatement,
        FunctionDeclaration: substituteFunction,
        IfStatement: substituteIfStatement,
        ReturnStatement: substituteReturnStatement,
        // UpdateExpression: resolveUpdateExpression,
        VariableDeclaration: substituteVariableDeclaration,
        WhileStatement: substituteWhileStatement,
        DoWhileStatement: substituteWhileStatement };
    let resolver = typeToResolverMapping[parsedCode.type];
    return resolver.call(undefined, parsedCode, environment, code, initialVector); //resolver ? resolver.call(undefined, parsedCode, environment, code) : ''
}

function copyEnvironment(environment){
    return JSON.parse(JSON.stringify(environment));
}

function substituteCode(parsedCode, code, environment, initialVector) {
    Object.keys(environment).forEach(function(key) { //this is for globals
        args.push(key);
    });
    let lines = code.split('\n');
    const reducer = (acc, codeRow) => codeRow.replace(/\s/g, '').trim() !== '' ? acc.concat(codeRow) : acc;
    return substitution(parsedCode, {}, lines, initialVector).reduce(reducer, []);
}