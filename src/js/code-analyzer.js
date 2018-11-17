
import * as esprima from 'esprima';

export {parseCode, resolveCode};

const parseCode = (codeToParse) => {
    return esprima.parseScript(codeToParse,{ loc: true ,range: true});
};

function generateResolvedElement(line, type, name='', condition='', value=''){
    return { line: line, type: type, name: name, condition: condition, value: value };
}

function resolveFunction(parsedFunction) {
    const line = parsedFunction.loc.start.line;
    const type ='FunctionDeclaration';
    const name = resolveExpression(parsedFunction.id);
    const funcDeclaration = generateResolvedElement(line, type, name);
    const paramRes = resolveParams(parsedFunction.params);
    const bodyRes = resolveElements(parsedFunction.body);
    return [].concat(funcDeclaration, paramRes, bodyRes);
}

function resolveParams(params) {
    return params.map((param) => {
        const line = param.loc.start.line;
        const type = 'VariableDeclaration';
        const name = resolveExpression(param);
        return generateResolvedElement(line, type, name);});
}

function resolveBlockStatement(parsedBlockStatements) {
    const blockStatements = parsedBlockStatements.body;
    const reducer = (acc, statement) => acc.concat(resolveElements(statement));
    return blockStatements.reduce(reducer,[]);
}

function resolveVariableDeclaration(parsedDeclarations) {
    const declarations = parsedDeclarations.declarations;
    return declarations.map((declaration) => {
        const line = declaration.loc.start.line;
        const type = 'VariableDeclaration';
        const name = resolveExpression(declaration.id);
        const init = declaration.init ? resolveExpression(declaration.init) : '';
        return generateResolvedElement(line, type, name, undefined, init);});
}

function resolveAssignmentExpression(parsedAssignmentExpression) {
    const line = parsedAssignmentExpression.loc.start.line;
    const type = 'AssignmentExpression';
    const name = resolveExpression(parsedAssignmentExpression.left);
    const value = resolveExpression(parsedAssignmentExpression.right);
    return generateResolvedElement(line, type, name, undefined, value);
}

function resolveWhileStatement(parsedWhileStatement) {
    const line = parsedWhileStatement.loc.start.line;
    const type = 'WhileStatement';
    const condition = resolveExpression(parsedWhileStatement.test);
    const whileStatement = generateResolvedElement(line, type, undefined, condition);
    const body = resolveElements(parsedWhileStatement.body);
    return [].concat(whileStatement,body);
}

function resolveIfStatement(parsedIfStatement, isElseIf=false) {
    const generateIfType = (isElseIf) => isElseIf ? 'ElseIfStatement' : 'IfStatement';
    const line = parsedIfStatement.loc.start.line;
    const type = generateIfType(isElseIf);
    const condition = resolveExpression(parsedIfStatement.test);
    const ifStatement = generateResolvedElement(line, type, undefined, condition);
    const body = resolveElements(parsedIfStatement.consequent);
    if (parsedIfStatement.alternate) { /**if else statements flow**/
        const alternate = (parsedIfStatement.alternate.type === 'IfStatement') ?
            resolveIfStatement(parsedIfStatement.alternate, /*isElseIf*/ true) :
            resolveElements(parsedIfStatement.alternate);
        return [].concat(ifStatement,body,alternate);
    }
    return [].concat(ifStatement,body); /**if statement flow**/
}

function resolveReturnStatement(parsedReturnStatement) {
    const line = parsedReturnStatement.loc.start.line;
    const value = resolveExpression(parsedReturnStatement.argument);
    const type ='ReturnStatement';
    return generateResolvedElement(line, type, undefined, undefined, value);
}

function resolveProgram(parsedProgram){
    return resolveElements(parsedProgram.body[0]);
}

function resolveExpressionStatement(parsedExpressionStatement){
    return resolveElements(parsedExpressionStatement.expression);
}

function resolveForStatement(parsedForStatement){
    const line = parsedForStatement.loc.start.line;
    const type = 'ForStatement';
    const body = resolveElements(parsedForStatement.body);
    const init = resolveExpression(parsedForStatement.init);
    const test = resolveExpression(parsedForStatement.test);
    const update = resolveExpression(parsedForStatement.update);
    const condition = init + '; '+ test + '; ' + update;
    const forStatement = generateResolvedElement(line, type, undefined, condition);
    return [].concat(forStatement, body);
}

// function resolveIdentifier(parsedIdentifier) {
//     return parsedIdentifier.name;
// }
//
// function resolveLiteral(parsedLiteral) {
//     return parsedLiteral.value;
// }
//
// function resolveMemberExpression(parsedMemberExpression) {
//     const object = resolveExpression(parsedMemberExpression.object);
//     const property = resolveExpression(parsedMemberExpression.property);
//     switch (parsedMemberExpression.object.type){
//         case 'Identifier':
//             return object + '[' + property + ']';
//         case 'ThisExpression':
//             return resolveThisExpression() + property;
//     }
// }
//
// function resolveUnaryExpression(parsedUnaryExpression) {
//     const value = resolveExpression(parsedUnaryExpression.argument);
//     const operator = parsedUnaryExpression.operator;
//     return operator + ' ' + value;
// }
//
// function resolveThisExpression() {
//     return 'this.';
// }

// function resolveBinaryExpression(parsedBinaryExpression) {
//     const operator = parsedBinaryExpression.operator ;
//     const left = resolveExpression(parsedBinaryExpression.left);
//     const right = resolveExpression(parsedBinaryExpression.right);
//     return '' + left + ' ' + operator + ' ' + right;
// }

//
function resolveUpdateExpression(parsedUpdateExpression){
    const line = parsedUpdateExpression.loc.start.line;
    const type = 'AssignmentExpression';
    const value = resolveExpression(parsedUpdateExpression);
    return generateResolvedElement(line, type, undefined, undefined, value);
}
//
// function resolveConditionalExpression(parsedConditionalExpression){
//     const test = resolveExpression(parsedConditionalExpression.test);
//     const consequent = resolveExpression(parsedConditionalExpression.consequent);
//     const alternate = resolveExpression(parsedConditionalExpression.alternate);
//     return test + ' ? ' + consequent + ' : ' + alternate;
// }
//
// function resolveVariableDeclarationExpression(parsedDeclarationExpressions){
//     const kind = parsedDeclarationExpressions.kind;
//     const reducer = (acc, decelerator) => {return acc + kind + ' ' + resolveExpression(decelerator.id) + ' = ' + resolveExpression(decelerator.init) + ', ';};
//     const decelerations = parsedDeclarationExpressions.declarations.reduce(reducer,'');
//     return decelerations.slice(0, -2);
// }


function resolveExpression(parsedCode){
    return parsedCode ? codeString.substring(parsedCode.range[0],parsedCode.range[1]): '';
}
// const typeToResolverMapping = {
//     BinaryExpression: resolveBinaryExpression,
//     ConditionalExpression : resolveConditionalExpression,
//     Identifier: resolveIdentifier,
//     Literal: resolveLiteral,
//     MemberExpression: resolveMemberExpression,
//     ThisExpression: resolveThisExpression,
//     UnaryExpression: resolveUnaryExpression,
//     UpdateExpression: resolveUpdateExpression,
//     LogicalExpression: resolveBinaryExpression,
//     AssignmentExpression: resolveBinaryExpression,
//     VariableDeclaration: resolveVariableDeclarationExpression};
// let resolver = typeToResolverMapping[parsedCode.type];
// return resolver ? resolver.call(undefined, parsedCode) : '';
function resolveForInStatement(parsedForInStatement) {
    const line = parsedForInStatement.loc.start.line;
    const type = 'ForInStatement';
    const body = resolveElements(parsedForInStatement.body);
    const left = resolveExpression(parsedForInStatement.left);
    const right = resolveExpression(parsedForInStatement.right);
    const condition = left + ' in ' + right;
    const forStatement = generateResolvedElement(line, type, undefined, condition);
    return [].concat(forStatement, body);
}

function resolveElements(parsedCode){
    const typeToResolverMapping = {
        Program: resolveProgram,
        AssignmentExpression: resolveAssignmentExpression,
        BlockStatement: resolveBlockStatement,
        ExpressionStatement: resolveExpressionStatement,
        ForStatement: resolveForStatement,
        FunctionDeclaration: resolveFunction,
        IfStatement: resolveIfStatement,
        ReturnStatement: resolveReturnStatement,
        UpdateExpression: resolveUpdateExpression,
        VariableDeclaration: resolveVariableDeclaration,
        WhileStatement: resolveWhileStatement,
        ForInStatement: resolveForInStatement };
    let resolver = typeToResolverMapping[parsedCode.type];
    return resolver ? resolver.call(undefined, parsedCode) : '';
}

let codeString = '';

function resolveCode(code){
    codeString = code;
    return resolveElements(parseCode(code));
}