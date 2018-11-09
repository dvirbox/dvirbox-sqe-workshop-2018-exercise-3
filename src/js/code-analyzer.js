import * as esprima from 'esprima';

const parseCode = (codeToParse) => {
    console.log(esprima.parseScript(codeToParse));
    return esprima.parseScript(codeToParse);
};

export {parseCode};
