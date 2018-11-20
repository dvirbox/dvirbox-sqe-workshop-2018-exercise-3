// import * as escodegen from 'escodegen';
import {substituteFromEnvironment} from './code-substitution';
export {evaluateCode};

function evalFunction(parsedFunction, environment, code) {
    return evalPaths(parsedFunction.body, environment, code);
}

function evalBlockStatement(parsedBlockStatements, environment, code) {
    const blockStatements = parsedBlockStatements.body;
    const reducer = (acc, statement) => {
        code = evalPaths(statement, environment, code);
        return code;
    };
    return blockStatements.reduce(reducer, '');
}

function evalWhileStatement(parsedWhileStatement, environment, code) {
    return evalPaths(parsedWhileStatement.body, copyEnvironment(environment) , code);
}

function evalIfStatement(parsedIfStatement, environment, code) {
    const condition = substituteFromEnvironment(parsedIfStatement.test, environment);
    const condValue = eval(condition);
    const lineIndex = parsedIfStatement.loc.start.line - 1;
    if(condValue){
        code[lineIndex] = `<span style="background-color: #b6ff33">${code[lineIndex]}</span>`;
        code = evalPaths(parsedIfStatement.consequent, copyEnvironment(environment), code);
    }else{
        code[lineIndex] = `<span style="background-color: #ff5733">${code[lineIndex]}</span>`;
        if (parsedIfStatement.alternate) { /**if else statements flow**/
            code = (parsedIfStatement.alternate.type === 'IfStatement') ?
                evalIfStatement(parsedIfStatement.alternate, copyEnvironment(environment), code) :
                evalPaths(parsedIfStatement.alternate, copyEnvironment(environment), code);
        }
    }
    return code;
}

function evalProgram(parsedProgram, environment, code){
    return evalPaths(parsedProgram.body[0], environment, code);
}

function evalExpressionStatement(parsedExpressionStatement, environment, code){
    return evalPaths(parsedExpressionStatement.expression, environment, code);
}

/** return the indexes of true and false paths **/
function evalPaths(parsedCode, environment, code){
    const typeToEvaluatorMapping = {
        Program: evalProgram,
        AssignmentExpression: ignoreEval,
        BlockStatement: evalBlockStatement,
        ExpressionStatement: evalExpressionStatement,
        FunctionDeclaration: evalFunction,
        IfStatement: evalIfStatement,
        ReturnStatement: ignoreEval,
        WhileStatement: evalWhileStatement,
        DoWhileStatement: evalWhileStatement
    };
    let evaluator = typeToEvaluatorMapping[parsedCode.type];
    return evaluator.call(undefined, parsedCode, environment, code);
}

function copyEnvironment(environment){
    return JSON.parse(JSON.stringify(environment));
}

function evaluateCode(parsedCode, lines, initialVector){
    return evalPaths(parsedCode, initialVector, lines);
}

function ignoreEval(parsedReturnStatement, environment, code) {
    return code;
}
