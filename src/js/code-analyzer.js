
import * as esprima from 'esprima';
import {initEnvironment, resolveParams, generateGraph, generateDotGraph} from './graph-generator';

export {parseCode, generateGraphModules};

const parseCode = (codeToParse) => {
    return esprima.parseScript(codeToParse,{ loc: true ,range: true});
};

function generateGraphModules(parsedCode, parsedArgs){
    let environment = {};
    const paramsValues = resolveParams(parsedArgs, environment);
    environment = initEnvironment(parsedCode, paramsValues, environment);
    const dotModules = generateDotGraph(generateGraph(parsedCode, environment));
    return dotModules;
}
