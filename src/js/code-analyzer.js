
import * as esprima from 'esprima';
import {substituteCode, getGlobals, substituteFromEnvironment} from './code-substitution';
import {evaluateCode} from './code-evaluator';
export {parseCode, resolveCode};

const parseCode = (codeToParse) => {
    return esprima.parseScript(codeToParse,{ loc: true ,range: true});
};

function resolveCode(code, args){
    /** Handle global variables - add global variables to environment**/
    let environment = {};
    code = getGlobals(parseCode(code), environment, code);

    /** substitute code - replace and remove all local variables **/
    const parsedCode = parseCode(code);
    let initialVector = getInitialVector(parsedCode, args, environment);
    const  substitutedCode = substituteCode(parsedCode, code, environment, initialVector);

    /** evaluate code - evaluate all expression and paint paths of code by the evaluated result **/
    const strReducer = (acc, codeRow) => acc + codeRow + '\n';
    const parsedSubCode = parseCode(substitutedCode.reduce(strReducer, ''));
    return evaluateCode(parsedSubCode, substitutedCode, initialVector);
}

function getInitialVector(parsedCode, args, environment){
    let parsedFunc = parsedCode.body[0];
    args = splitArgs(args);
    for (let i =0; i < parsedFunc.params.length; i++){
        const name = parsedFunc.params[i].name;
        const  parsedArg = parseCode(args[i]).body[0].expression;
        const value = substituteFromEnvironment(parsedArg, environment);
        environment[name] = value;
    }
    return  environment;
}


function push(result , item) {
    result.push(item);
    return '';
}
function updateDepth(c, depth){
    if (c === '[')
        depth++;
    else if (c === ']')
        depth--;
    return depth;
}

function splitArgs(str) {
    let result = [], item = '', depth = 0;
    for (let i = 0, c; c = str[i], i < str.length; i++) {
        if (!depth && c === ',')
            item = push(result, item);
        else {
            item += c;
            depth = updateDepth(c, depth);
        }
    }
    push(result, item);
    return result;
}