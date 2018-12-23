/* eslint-disable max-lines-per-function */

import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';
import {initEnvironment, resolveParams, generateGraph, generateDotGraph, resolveElements} from '../src/js/graph-generator';

describe('The resolveElements ', () => {
    it('is resolving an unknown statement incorrectly', () => {
        const parsedCode = parseCode('[-1,1,2]');
        const environment = {};
        const result = resolveElements(parsedCode, environment);
        const expected = '';
        assert.equal(
            result,
            expected
        );
    });

    it('is resolving an UnaryExpression incorrectly', () => {
        const parsedCode = parseCode('-1').body[0].expression;
        const environment = {};
        const result = resolveElements(parsedCode, environment);
        const expected = '-1';
        assert.equal(
            result,
            expected
        );
    });

    it('is resolving an updateExpression incorrectly', () => {
        const parsedCode = parseCode('c++').body[0].expression;
        const environment = {c:1};
        const result = resolveElements(parsedCode, environment);
        const expected = true;
        assert.equal(
            result,
            expected
        );
    });

    it('is resolving an updateExpression with memberExpr incorrectly', () => {
        const parsedCode = parseCode('c[0]++').body[0].expression;
        const environment = {c: [1]};
        const result = resolveElements(parsedCode, environment);
        const expected = true;
        assert.equal(
            result,
            expected
        );
    });

    it('is resolving an BlockStatment incorrectly', () => {
        const parsedCode = parseCode('function a(x){\n' +
            'let x;\n' +
            'return 0;\n' +
            '}').body[0].body;
        const environment = {c: [1]};
        const result = resolveElements(parsedCode, environment);
        const expected = true;
        assert.equal(
            result,
            expected
        );
    });
});

describe('The generateGraph and generateDotGraph ', () => {
    it('is resolving an empty function correctly', () => {
        const parsedCode = parseCode('function foo(){    \n' +
            '\treturn 3;\n' +
            '}');
        const environment = {};
        const result = generateDotGraph(generateGraph(parsedCode, environment)).join('');
        const expected = 'n1 [label="-1-\n' +
            ' return 3;", shape=rectangle, style = filled, fillcolor = green];\n' +
            '';
        assert.equal(
            result,
            expected
        );
    });
});

describe('The generateGraph and generateDotGraph unaryStatment', () => {
    it('is resolving an empty function correctly', () => {
        const parsedCode = parseCode('function foo(){    \n' +
            '\treturn -3;\n' +
            '}');
        const environment = {};
        const result = generateDotGraph(generateGraph(parsedCode, environment)).join('');
        const expected = 'n1 [label="-1-\n' +
            ' return -3;", shape=rectangle, style = filled, fillcolor = green];\n' +
            '';
        assert.equal(
            result,
            expected
        );
    });
});

describe('The initEnvironment ', () => {
    it('is resolving an empty function correctly', () => {
        const parsedCode = parseCode('function foo(){    \n' +
            '\treturn 3;\n' +
            '}');
        const paramValues = [];
        const environment = {};
        const result = JSON.stringify(initEnvironment(parsedCode, paramValues, environment));
        const expected = '{}';
        assert.equal(
            result,
            expected
        );
    });

    it('is resolving an function with single param correctly', () => {
        const parsedCode = parseCode('function foo(x){    \n' +
            '\treturn 3;\n' +
            '}');
        const paramValues = [3];
        const environment = {};
        const result = JSON.stringify(initEnvironment(parsedCode, paramValues, environment));
        const expected = JSON.stringify({x:3});
        assert.equal(
            result,
            expected
        );
    });

    it('is resolving an function with multi params correctly', () => {
        const parsedCode = parseCode('function foo(x,y){    \n' +
            '\treturn 3;\n' +
            '}');
        const paramValues = [3,2];
        const environment = {};
        const result = JSON.stringify(initEnvironment(parsedCode, paramValues, environment));
        const expected = JSON.stringify({x:3, y:2});
        assert.equal(
            result,
            expected
        );
    });
});

describe('The resolveParams ', () => {
    it('is resolving an empty function correctly', () => {
        const parsedArgs = parseCode('1,2,3');
        const environment = {};
        const result = JSON.stringify(resolveParams(parsedArgs, environment));
        const expected = '[1,2,3]';
        assert.equal(
            result,
            expected
        );
    });

    it('is resolving an empty function correctly', () => {
        const parsedArgs = parseCode('');
        const environment = {};
        const result = JSON.stringify(resolveParams(parsedArgs, environment));
        const expected = '[]';
        assert.equal(
            result,
            expected
        );
    });

    it('is resolving an empty function correctly', () => {
        const parsedArgs = parseCode('1');
        const environment = {};
        const result = JSON.stringify(resolveParams(parsedArgs, environment));
        const expected = '[1]';
        assert.equal(
            result,
            expected
        );
    });


});