/* eslint-disable max-lines-per-function */

import assert from 'assert';
import {parseCode, generateGraphModules} from '../src/js/code-analyzer';

describe('The javascript parser', () => {
    it('is parsing an empty function correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('')),
            '{"type":"Program","body":[],"sourceType":"script","range":[0,0],"loc":{"start":{"line":0,"column":0},"end":{"line":0,"column":0}}}'
        );
    });
});

describe('The code-generator', () => {
    it('is resolving first Example incorrectly - if flow', () => {
        const parsedCode = parseCode('function foo(x, y, z){\n' +
            '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '    \n' +
            '    if (b < z) {\n' +
            '        c = c + 5;\n' +
            '    } else if (b < z * 2) {\n' +
            '        c = c + x + 5;\n' +
            '    } else {\n' +
            '        c = c + z + 5;\n' +
            '    }\n' +
            '    \n' +
            '    return c;\n' +
            '}');
        const parsedArgs = parseCode('1,2,9');
        const result = generateGraphModules(parsedCode, parsedArgs).join('');
        const expected = 'n1 [label="-1-\n' +
            ' let a = x + 1;\n' +
            'let b = a + y;\n' +
            'let c = 0;", shape=rectangle, style = filled, fillcolor = green];\n' +
            'n2 [label="-2-\n' +
            ' b < z", shape=diamond, style = filled, fillcolor = green];\n' +
            'n3 [label="-3-\n' +
            ' b < z * 2", shape=diamond, style = filled, fillcolor = white];\n' +
            'n4 [label="-4-\n' +
            ' c = c + 5", shape=rectangle, style = filled, fillcolor = green];\n' +
            'n5 [label="-5-\n' +
            ' c = c + z + 5", shape=rectangle, style = filled, fillcolor = white];\n' +
            'n6 [label="-6-\n' +
            ' c = c + x + 5", shape=rectangle, style = filled, fillcolor = white];\n' +
            'n0 [label="", shape=circle, style = filled, fillcolor = green];\n' +
            'n7 [label="-7-\n' +
            ' return c;", shape=rectangle, style = filled, fillcolor = green];\n' +
            'n1 -> n2 ;\n' +
            'n2 -> n3 [label="F"];\n' +
            'n2 -> n4 [label="T"];\n' +
            'n3 -> n5 [label="F"];\n' +
            'n3 -> n6 [label="T"];\n' +
            'n4 -> n0 ;\n' +
            'n5 -> n0 ;\n' +
            'n6 -> n0 ;\n' +
            'n0 -> n7 ;\n' +
            '';
        assert.equal(
            result,
            expected
        );
    });

    it('is resolving first Example incorrectly - else if flow', () => {
        const parsedCode = parseCode('function foo(x, y, z){\n' +
            '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '    \n' +
            '    if (b < z) {\n' +
            '        c = c + 5;\n' +
            '    } else if (b < z * 2) {\n' +
            '        c = c + x + 5;\n' +
            '    } else {\n' +
            '        c = c + z + 5;\n' +
            '    }\n' +
            '    \n' +
            '    return c;\n' +
            '}');
        const parsedArgs = parseCode('1,2,3');
        const result = generateGraphModules(parsedCode, parsedArgs).join('');
        const expected = 'n1 [label="-1-\n' +
            ' let a = x + 1;\n' +
            'let b = a + y;\n' +
            'let c = 0;", shape=rectangle, style = filled, fillcolor = green];\n' +
            'n2 [label="-2-\n' +
            ' b < z", shape=diamond, style = filled, fillcolor = green];\n' +
            'n3 [label="-3-\n' +
            ' b < z * 2", shape=diamond, style = filled, fillcolor = green];\n' +
            'n4 [label="-4-\n' +
            ' c = c + 5", shape=rectangle, style = filled, fillcolor = white];\n' +
            'n5 [label="-5-\n' +
            ' c = c + z + 5", shape=rectangle, style = filled, fillcolor = white];\n' +
            'n6 [label="-6-\n' +
            ' c = c + x + 5", shape=rectangle, style = filled, fillcolor = green];\n' +
            'n0 [label="", shape=circle, style = filled, fillcolor = green];\n' +
            'n7 [label="-7-\n' +
            ' return c;", shape=rectangle, style = filled, fillcolor = green];\n' +
            'n1 -> n2 ;\n' +
            'n2 -> n3 [label="F"];\n' +
            'n2 -> n4 [label="T"];\n' +
            'n3 -> n5 [label="F"];\n' +
            'n3 -> n6 [label="T"];\n' +
            'n4 -> n0 ;\n' +
            'n5 -> n0 ;\n' +
            'n6 -> n0 ;\n' +
            'n0 -> n7 ;\n' +
            '';
        assert.equal(
            result,
            expected
        );
    });

    it('is resolving first Example incorrectly - else flow', () => {
        const parsedCode = parseCode('function foo(x, y, z){\n' +
            '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '    \n' +
            '    if (b < z) {\n' +
            '        c = c + 5;\n' +
            '    } else if (b < z * 2) {\n' +
            '        c = c + x + 5;\n' +
            '    } else {\n' +
            '        c = c + z + 5;\n' +
            '    }\n' +
            '    \n' +
            '    return c;\n' +
            '}');
        const parsedArgs = parseCode('1,2,1');
        const result = generateGraphModules(parsedCode, parsedArgs).join('');
        const expected = 'n1 [label="-1-\n' +
            ' let a = x + 1;\n' +
            'let b = a + y;\n' +
            'let c = 0;", shape=rectangle, style = filled, fillcolor = green];\n' +
            'n2 [label="-2-\n' +
            ' b < z", shape=diamond, style = filled, fillcolor = green];\n' +
            'n3 [label="-3-\n' +
            ' b < z * 2", shape=diamond, style = filled, fillcolor = green];\n' +
            'n4 [label="-4-\n' +
            ' c = c + 5", shape=rectangle, style = filled, fillcolor = white];\n' +
            'n5 [label="-5-\n' +
            ' c = c + z + 5", shape=rectangle, style = filled, fillcolor = green];\n' +
            'n6 [label="-6-\n' +
            ' c = c + x + 5", shape=rectangle, style = filled, fillcolor = white];\n' +
            'n0 [label="", shape=circle, style = filled, fillcolor = green];\n' +
            'n7 [label="-7-\n' +
            ' return c;", shape=rectangle, style = filled, fillcolor = green];\n' +
            'n1 -> n2 ;\n' +
            'n2 -> n3 [label="F"];\n' +
            'n2 -> n4 [label="T"];\n' +
            'n3 -> n5 [label="F"];\n' +
            'n3 -> n6 [label="T"];\n' +
            'n4 -> n0 ;\n' +
            'n5 -> n0 ;\n' +
            'n6 -> n0 ;\n' +
            'n0 -> n7 ;\n' +
            '';
        assert.equal(
            result,
            expected
        );
    });

    it('is resolving if without else incorrectly', () => {
        const parsedCode = parseCode('function foo(x, y, z){\n' +
            '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '    if (b < z) {\n' +
            '        c = c + 5;\n' +
            '    } \n' +
            '    return c;\n' +
            '}\n');
        const parsedArgs = parseCode('1,2,3');
        const result = generateGraphModules(parsedCode, parsedArgs).join('');
        const expected = 'n1 [label="-1-\n' +
            ' let a = x + 1;\n' +
            'let b = a + y;\n' +
            'let c = 0;", shape=rectangle, style = filled, fillcolor = green];\n' +
            'n2 [label="-2-\n' +
            ' b < z", shape=diamond, style = filled, fillcolor = green];\n' +
            'n0 [label="", shape=circle, style = filled, fillcolor = green];\n' +
            'n3 [label="-3-\n' +
            ' c = c + 5", shape=rectangle, style = filled, fillcolor = white];\n' +
            'n4 [label="-4-\n' +
            ' return c;", shape=rectangle, style = filled, fillcolor = green];\n' +
            'n1 -> n2 ;\n' +
            'n2 -> n0 [label="F"];\n' +
            'n2 -> n3 [label="T"];\n' +
            'n0 -> n4 ;\n' +
            'n3 -> n0 ;\n' +
            '';
        assert.equal(
            result,
            expected
        );
    });

    it('is resolving if with else-if without else incorrectly - else if flow', () => {
        const parsedCode = parseCode('function foo(x, y, z){\n' +
            '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '    if (b < z) {\n' +
            '        c = c + 5;\n' +
            '    }\n' +
            '    else if(true){\n' +
            '        c=1;\n' +
            '    }\n' +
            '    return c;\n' +
            '}\n');
        const parsedArgs = parseCode('1,2,3');
        const result = generateGraphModules(parsedCode, parsedArgs).join('');
        const expected = 'n1 [label="-1-\n' +
            ' let a = x + 1;\n' +
            'let b = a + y;\n' +
            'let c = 0;", shape=rectangle, style = filled, fillcolor = green];\n' +
            'n2 [label="-2-\n' +
            ' b < z", shape=diamond, style = filled, fillcolor = green];\n' +
            'n3 [label="-3-\n' +
            ' true", shape=diamond, style = filled, fillcolor = green];\n' +
            'n4 [label="-4-\n' +
            ' c = c + 5", shape=rectangle, style = filled, fillcolor = white];\n' +
            'n0 [label="", shape=circle, style = filled, fillcolor = green];\n' +
            'n5 [label="-5-\n' +
            ' c = 1", shape=rectangle, style = filled, fillcolor = green];\n' +
            'n6 [label="-6-\n' +
            ' return c;", shape=rectangle, style = filled, fillcolor = green];\n' +
            'n1 -> n2 ;\n' +
            'n2 -> n3 [label="F"];\n' +
            'n2 -> n4 [label="T"];\n' +
            'n3 -> n0 [label="F"];\n' +
            'n3 -> n5 [label="T"];\n' +
            'n4 -> n0 ;\n' +
            'n0 -> n6 ;\n' +
            'n5 -> n0 ;\n' +
            '';
        assert.equal(
            result,
            expected
        );
    });

    it('is resolving if with else-if without else incorrectly - if flow', () => {
        const parsedCode = parseCode('function foo(x, y, z){\n' +
            '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '    if (b < z) {\n' +
            '        c = c + 5;\n' +
            '    }\n' +
            '    else if(true){\n' +
            '        c=1;\n' +
            '    }\n' +
            '    return c;\n' +
            '}\n');
        const parsedArgs = parseCode('1,2,9');
        const result = generateGraphModules(parsedCode, parsedArgs).join('');
        const expected = 'n1 [label="-1-\n' +
            ' let a = x + 1;\n' +
            'let b = a + y;\n' +
            'let c = 0;", shape=rectangle, style = filled, fillcolor = green];\n' +
            'n2 [label="-2-\n' +
            ' b < z", shape=diamond, style = filled, fillcolor = green];\n' +
            'n3 [label="-3-\n' +
            ' true", shape=diamond, style = filled, fillcolor = white];\n' +
            'n4 [label="-4-\n' +
            ' c = c + 5", shape=rectangle, style = filled, fillcolor = green];\n' +
            'n0 [label="", shape=circle, style = filled, fillcolor = green];\n' +
            'n5 [label="-5-\n' +
            ' c = 1", shape=rectangle, style = filled, fillcolor = white];\n' +
            'n6 [label="-6-\n' +
            ' return c;", shape=rectangle, style = filled, fillcolor = green];\n' +
            'n1 -> n2 ;\n' +
            'n2 -> n3 [label="F"];\n' +
            'n2 -> n4 [label="T"];\n' +
            'n3 -> n0 [label="F"];\n' +
            'n3 -> n5 [label="T"];\n' +
            'n4 -> n0 ;\n' +
            'n0 -> n6 ;\n' +
            'n5 -> n0 ;\n' +
            '';
        assert.equal(
            result,
            expected
        );
    });

    it('is resolving if with else without else incorrectly', () => {
        const parsedCode = parseCode('function foo(x, y, z){\n' +
            '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '    if (b < z) {\n' +
            '        c = c + 5;\n' +
            '    }\n' +
            '    else{\n' +
            '        c=1;\n' +
            '    }\n' +
            '    return c;\n' +
            '}\n');
        const parsedArgs = parseCode('1,2,3');
        const result = generateGraphModules(parsedCode, parsedArgs).join('');
        const expected = 'n1 [label="-1-\n' +
            ' let a = x + 1;\n' +
            'let b = a + y;\n' +
            'let c = 0;", shape=rectangle, style = filled, fillcolor = green];\n' +
            'n2 [label="-2-\n' +
            ' b < z", shape=diamond, style = filled, fillcolor = green];\n' +
            'n3 [label="-3-\n' +
            ' c = 1", shape=rectangle, style = filled, fillcolor = green];\n' +
            'n4 [label="-4-\n' +
            ' c = c + 5", shape=rectangle, style = filled, fillcolor = white];\n' +
            'n0 [label="", shape=circle, style = filled, fillcolor = green];\n' +
            'n5 [label="-5-\n' +
            ' return c;", shape=rectangle, style = filled, fillcolor = green];\n' +
            'n1 -> n2 ;\n' +
            'n2 -> n3 [label="F"];\n' +
            'n2 -> n4 [label="T"];\n' +
            'n3 -> n0 ;\n' +
            'n4 -> n0 ;\n' +
            'n0 -> n5 ;\n' +
            '';
        assert.equal(
            result,
            expected
        );
    });

    it('is resolving if with else without else incorrectly', () => {
        const parsedCode = parseCode('function foo(x, y, z){\n' +
            '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '    if (b < z) {\n' +
            '        c = c + 5;\n' +
            '    }\n' +
            '    else{\n' +
            '        c=1;\n' +
            '    }\n' +
            '    return c;\n' +
            '}\n');
        const parsedArgs = parseCode('1,2,3');
        const result = generateGraphModules(parsedCode, parsedArgs).join('');
        const expected = 'n1 [label="-1-\n' +
            ' let a = x + 1;\n' +
            'let b = a + y;\n' +
            'let c = 0;", shape=rectangle, style = filled, fillcolor = green];\n' +
            'n2 [label="-2-\n' +
            ' b < z", shape=diamond, style = filled, fillcolor = green];\n' +
            'n3 [label="-3-\n' +
            ' c = 1", shape=rectangle, style = filled, fillcolor = green];\n' +
            'n4 [label="-4-\n' +
            ' c = c + 5", shape=rectangle, style = filled, fillcolor = white];\n' +
            'n0 [label="", shape=circle, style = filled, fillcolor = green];\n' +
            'n5 [label="-5-\n' +
            ' return c;", shape=rectangle, style = filled, fillcolor = green];\n' +
            'n1 -> n2 ;\n' +
            'n2 -> n3 [label="F"];\n' +
            'n2 -> n4 [label="T"];\n' +
            'n3 -> n0 ;\n' +
            'n4 -> n0 ;\n' +
            'n0 -> n5 ;\n' +
            '';
        assert.equal(
            result,
            expected
        );
    });

    it('is resolving if with else array incorrectly - if flow', () => {
        const parsedCode = parseCode('function foo(x, y, z){\n' +
            '    let a = [2,3,4];\n' +
            '    let b = x[0];\n' +
            '    let c = a[1];\n' +
            '    if (b < z) {\n' +
            '        c = c + 5;\n' +
            '    } else {\n' +
            '        c = c + z + 5;\n' +
            '    }\n' +
            '    return c;\n' +
            '}\n');
        const parsedArgs = parseCode('[2,3,4],2,9');
        const result = generateGraphModules(parsedCode, parsedArgs).join('');
        const expected = 'n1 [label="-1-\n' +
            ' let a = [2, 3, 4];\n' +
            'let b = x[0];\n' +
            'let c = a[1];", shape=rectangle, style = filled, fillcolor = green];\n' +
            'n2 [label="-2-\n' +
            ' b < z", shape=diamond, style = filled, fillcolor = green];\n' +
            'n3 [label="-3-\n' +
            ' c = c + z + 5", shape=rectangle, style = filled, fillcolor = white];\n' +
            'n4 [label="-4-\n' +
            ' c = c + 5", shape=rectangle, style = filled, fillcolor = green];\n' +
            'n0 [label="", shape=circle, style = filled, fillcolor = green];\n' +
            'n5 [label="-5-\n' +
            ' return c;", shape=rectangle, style = filled, fillcolor = green];\n' +
            'n1 -> n2 ;\n' +
            'n2 -> n3 [label="F"];\n' +
            'n2 -> n4 [label="T"];\n' +
            'n3 -> n0 ;\n' +
            'n4 -> n0 ;\n' +
            'n0 -> n5 ;\n' +
            '';
        assert.equal(
            result,
            expected
        );
    });

    it('is resolving if with else array incorrectly - else flow', () => {
        const parsedCode = parseCode('function foo(x, y, z){\n' +
            '    let a = [2,3,4];\n' +
            '    let b = x[0];\n' +
            '    let c = a[1];\n' +
            '    if (b < z) {\n' +
            '        c = c + 5;\n' +
            '    } else {\n' +
            '        c = c + z + 5;\n' +
            '    }\n' +
            '    return c;\n' +
            '}\n');
        const parsedArgs = parseCode('[9,3,4],2,9');
        const result = generateGraphModules(parsedCode, parsedArgs).join('');
        const expected = 'n1 [label="-1-\n' +
            ' let a = [2, 3, 4];\n' +
            'let b = x[0];\n' +
            'let c = a[1];", shape=rectangle, style = filled, fillcolor = green];\n' +
            'n2 [label="-2-\n' +
            ' b < z", shape=diamond, style = filled, fillcolor = green];\n' +
            'n3 [label="-3-\n' +
            ' c = c + z + 5", shape=rectangle, style = filled, fillcolor = green];\n' +
            'n4 [label="-4-\n' +
            ' c = c + 5", shape=rectangle, style = filled, fillcolor = white];\n' +
            'n0 [label="", shape=circle, style = filled, fillcolor = green];\n' +
            'n5 [label="-5-\n' +
            ' return c;", shape=rectangle, style = filled, fillcolor = green];\n' +
            'n1 -> n2 ;\n' +
            'n2 -> n3 [label="F"];\n' +
            'n2 -> n4 [label="T"];\n' +
            'n3 -> n0 ;\n' +
            'n4 -> n0 ;\n' +
            'n0 -> n5 ;\n' +
            '';
        assert.equal(
            result,
            expected
        );
    });

    it('is resolving while case incorrectly', () => {
        const parsedCode = parseCode('function foo(x, y, z){\n' +
            '   let a = x + 1;\n' +
            '   let b = a + y;\n' +
            '   let c = 0;\n' +
            '   \n' +
            '   while (a < z) {\n' +
            '       c = a + b;\n' +
            '       z = c * 2;\n' +
            '       a++;\n' +
            '   }\n' +
            '   \n' +
            '   return z;\n' +
            '}\n');
        const parsedArgs = parseCode('2,2,3');
        const result = generateGraphModules(parsedCode, parsedArgs).join('');
        const expected = 'n1 [label="-1-\n' +
            ' let a = x + 1;\n' +
            'let b = a + y;\n' +
            'let c = 0;", shape=rectangle, style = filled, fillcolor = green];\n' +
            'n1000 [label="null", shape=rectangle, style = filled, fillcolor = green];\n' +
            'n2 [label="-2-\n' +
            ' a < z", shape=diamond, style = filled, fillcolor = green];\n' +
            'n3 [label="-3-\n' +
            ' return z;", shape=rectangle, style = filled, fillcolor = green];\n' +
            'n4 [label="-4-\n' +
            ' c = a + b\n' +
            'z = c * 2\n' +
            'a++", shape=rectangle, style = filled, fillcolor = white];\n' +
            'n1 -> n1000 ;\n' +
            'n1000 -> n2 ;\n' +
            'n2 -> n3 [label="F"];\n' +
            'n2 -> n4 [label="T"];\n' +
            'n4 -> n1000 ;\n' +
            '';
        assert.equal(
            result,
            expected
        );
    });

    it('is resolving while with if-else case incorrectly - flow while->true if-> else', () => {
        const parsedCode = parseCode('function foo(x){    \n' +
            '\tlet a = x + 1;    \n' +
            '\twhile (x < a) {    \n' +
            '\t\tif (x==2){     \n' +
            '\t\t\tx = a;    \n' +
            '\t\t}    \n' +
            '\t\telse {    \n' +
            '\t\t\tx = x+1;    \n' +
            '\t\t}    \n' +
            '\t}    \t\n' +
            '\treturn a;    \n' +
            '}');
        const parsedArgs = parseCode('1');
        const result = generateGraphModules(parsedCode, parsedArgs).join('');
        const expected = 'n1 [label="-1-\n' +
            ' let a = x + 1;", shape=rectangle, style = filled, fillcolor = green];\n' +
            'n1000 [label="null", shape=rectangle, style = filled, fillcolor = green];\n' +
            'n2 [label="-2-\n' +
            ' x < a", shape=diamond, style = filled, fillcolor = green];\n' +
            'n3 [label="-3-\n' +
            ' return a;", shape=rectangle, style = filled, fillcolor = green];\n' +
            'n4 [label="-4-\n' +
            ' x == 2", shape=diamond, style = filled, fillcolor = green];\n' +
            'n5 [label="-5-\n' +
            ' x = x + 1", shape=rectangle, style = filled, fillcolor = green];\n' +
            'n6 [label="-6-\n' +
            ' x = a", shape=rectangle, style = filled, fillcolor = white];\n' +
            'n1 -> n1000 ;\n' +
            'n1000 -> n2 ;\n' +
            'n2 -> n3 [label="F"];\n' +
            'n2 -> n4 [label="T"];\n' +
            'n4 -> n5 [label="F"];\n' +
            'n4 -> n6 [label="T"];\n' +
            'n5 -> n1000 ;\n' +
            'n6 -> n1000 ;\n' +
            '';
        assert.equal(
            result,
            expected
        );
    });

    it('is resolving while with if-else case incorrectly - flow while->true if-> if', () => {
        const parsedCode = parseCode('function foo(x){    \n' +
            '\tlet a = x + 1;    \n' +
            '\twhile (x < a) {    \n' +
            '\t\tif (x==2){     \n' +
            '\t\t\tx = a;    \n' +
            '\t\t}    \n' +
            '\t\telse {    \n' +
            '\t\t\tx = x+1;    \n' +
            '\t\t}    \n' +
            '\t}    \t\n' +
            '\treturn a;    \n' +
            '}');
        const parsedArgs = parseCode('2');
        const result = generateGraphModules(parsedCode, parsedArgs).join('');
        const expected = 'n1 [label="-1-\n' +
            ' let a = x + 1;", shape=rectangle, style = filled, fillcolor = green];\n' +
            'n1000 [label="null", shape=rectangle, style = filled, fillcolor = green];\n' +
            'n2 [label="-2-\n' +
            ' x < a", shape=diamond, style = filled, fillcolor = green];\n' +
            'n3 [label="-3-\n' +
            ' return a;", shape=rectangle, style = filled, fillcolor = green];\n' +
            'n4 [label="-4-\n' +
            ' x == 2", shape=diamond, style = filled, fillcolor = green];\n' +
            'n5 [label="-5-\n' +
            ' x = x + 1", shape=rectangle, style = filled, fillcolor = white];\n' +
            'n6 [label="-6-\n' +
            ' x = a", shape=rectangle, style = filled, fillcolor = green];\n' +
            'n1 -> n1000 ;\n' +
            'n1000 -> n2 ;\n' +
            'n2 -> n3 [label="F"];\n' +
            'n2 -> n4 [label="T"];\n' +
            'n4 -> n5 [label="F"];\n' +
            'n4 -> n6 [label="T"];\n' +
            'n5 -> n1000 ;\n' +
            'n6 -> n1000 ;\n' +
            '';
        assert.equal(
            result,
            expected
        );
    });

    it('is resolving while with if-else case incorrectly - flow while->false', () => {
        const parsedCode = parseCode('function foo(x){    \n' +
            '\tlet a = x + 1;    \n' +
            '\twhile (x < a) {    \n' +
            '\t\tif (x==2){     \n' +
            '\t\t\tx = a;    \n' +
            '\t\t}    \n' +
            '\t\telse {    \n' +
            '\t\t\tx = x+1;    \n' +
            '\t\t}    \n' +
            '\t}    \t\n' +
            '\treturn a;    \n' +
            '}');
        const parsedArgs = parseCode('2');
        const result = generateGraphModules(parsedCode, parsedArgs).join('');
        const expected = 'n1 [label="-1-\n' +
            ' let a = x + 1;", shape=rectangle, style = filled, fillcolor = green];\n' +
            'n1000 [label="null", shape=rectangle, style = filled, fillcolor = green];\n' +
            'n2 [label="-2-\n' +
            ' x < a", shape=diamond, style = filled, fillcolor = green];\n' +
            'n3 [label="-3-\n' +
            ' return a;", shape=rectangle, style = filled, fillcolor = green];\n' +
            'n4 [label="-4-\n' +
            ' x == 2", shape=diamond, style = filled, fillcolor = green];\n' +
            'n5 [label="-5-\n' +
            ' x = x + 1", shape=rectangle, style = filled, fillcolor = white];\n' +
            'n6 [label="-6-\n' +
            ' x = a", shape=rectangle, style = filled, fillcolor = green];\n' +
            'n1 -> n1000 ;\n' +
            'n1000 -> n2 ;\n' +
            'n2 -> n3 [label="F"];\n' +
            'n2 -> n4 [label="T"];\n' +
            'n4 -> n5 [label="F"];\n' +
            'n4 -> n6 [label="T"];\n' +
            'n5 -> n1000 ;\n' +
            'n6 -> n1000 ;\n' +
            '';
        assert.equal(
            result,
            expected
        );
    });

    it('is resolving strings incorrectly - flow if', () => {
        const parsedCode = parseCode('function foo(x){\n' +
            '    let a = \'hi\';\n' +
            '    if (x === a){\n' +
            '        x = a +\'1\';\n' +
            '    }\n' +
            '    else {\n' +
            '        x = \'ih\';\n' +
            '    }\n' +
            '    return x;\n' +
            '}');
        const parsedArgs = parseCode('\'hi\'');
        const result = generateGraphModules(parsedCode, parsedArgs).join('');
        const expected = 'n1 [label="-1-\n' +
            ' let a = \'hi\';", shape=rectangle, style = filled, fillcolor = green];\n' +
            'n2 [label="-2-\n' +
            ' x === a", shape=diamond, style = filled, fillcolor = green];\n' +
            'n3 [label="-3-\n' +
            ' x = \'ih\'", shape=rectangle, style = filled, fillcolor = white];\n' +
            'n4 [label="-4-\n' +
            ' x = a + \'1\'", shape=rectangle, style = filled, fillcolor = green];\n' +
            'n0 [label="", shape=circle, style = filled, fillcolor = green];\n' +
            'n5 [label="-5-\n' +
            ' return x;", shape=rectangle, style = filled, fillcolor = green];\n' +
            'n1 -> n2 ;\n' +
            'n2 -> n3 [label="F"];\n' +
            'n2 -> n4 [label="T"];\n' +
            'n3 -> n0 ;\n' +
            'n4 -> n0 ;\n' +
            'n0 -> n5 ;\n' +
            '';
        assert.equal(
            result,
            expected
        );
    });

    it('is resolving strings incorrectly - flow else', () => {
        const parsedCode = parseCode('function foo(x){\n' +
            '    let a = \'hi\';\n' +
            '    if (x === a){\n' +
            '        x = a +\'1\';\n' +
            '    }\n' +
            '    else {\n' +
            '        x = \'ih\';\n' +
            '    }\n' +
            '    return x;\n' +
            '}');
        const parsedArgs = parseCode('\'hii\'');
        const result = generateGraphModules(parsedCode, parsedArgs).join('');
        const expected = 'n1 [label="-1-\n' +
            ' let a = \'hi\';", shape=rectangle, style = filled, fillcolor = green];\n' +
            'n2 [label="-2-\n' +
            ' x === a", shape=diamond, style = filled, fillcolor = green];\n' +
            'n3 [label="-3-\n' +
            ' x = \'ih\'", shape=rectangle, style = filled, fillcolor = green];\n' +
            'n4 [label="-4-\n' +
            ' x = a + \'1\'", shape=rectangle, style = filled, fillcolor = white];\n' +
            'n0 [label="", shape=circle, style = filled, fillcolor = green];\n' +
            'n5 [label="-5-\n' +
            ' return x;", shape=rectangle, style = filled, fillcolor = green];\n' +
            'n1 -> n2 ;\n' +
            'n2 -> n3 [label="F"];\n' +
            'n2 -> n4 [label="T"];\n' +
            'n3 -> n0 ;\n' +
            'n4 -> n0 ;\n' +
            'n0 -> n5 ;\n' +
            '';
        assert.equal(
            result,
            expected
        );
    });

    it('is resolving multi returns incorrectly', () => {
        const parsedCode = parseCode('function foo(x){    \n' +
            '\tlet a = \'hi\';    \n' +
            '\tif (x === a){     \n' +
            '\t    return a +\'1\';    \n' +
            '\t}    \n' +
            '\telse {    \n' +
            '\t    return \'ih\';    \n' +
            '\t}  \n' +
            '}');
        const parsedArgs = parseCode('\'hi\'');
        const result = generateGraphModules(parsedCode, parsedArgs).join('');
        const expected = 'n1 [label="-1-\n' +
            ' let a = \'hi\';", shape=rectangle, style = filled, fillcolor = green];\n' +
            'n2 [label="-2-\n' +
            ' x === a", shape=diamond, style = filled, fillcolor = green];\n' +
            'n3 [label="-3-\n' +
            ' return \'ih\';", shape=rectangle, style = filled, fillcolor = white];\n' +
            'n4 [label="-4-\n' +
            ' return a + \'1\';", shape=rectangle, style = filled, fillcolor = green];\n' +
            'n1 -> n2 ;\n' +
            'n2 -> n3 [label="F"];\n' +
            'n2 -> n4 [label="T"];\n' +
            '';
        assert.equal(
            result,
            expected
        );
    });

    it('is resolving member expr', () => {
        const parsedCode = parseCode('function foo(x,y){    \n' +
            '\treturn x[0] === y[1];\n' +
            '}');
        const parsedArgs = parseCode('[1],[2,1]');
        const result = generateGraphModules(parsedCode, parsedArgs).join('');
        const expected = 'n1 [label="-1-\n' +
            ' return x[0] === y[1];", shape=rectangle, style = filled, fillcolor = green];\n' +
            '';
        assert.equal(
            result,
            expected
        );
    });

    it('is resolving member expr assignment', () => {
        const parsedCode = parseCode('function foo(x,y){  \n' +
            'x[0] = y[1]  \n' +
            '\treturn x;\n' +
            '}');
        const parsedArgs = parseCode('[1],[2,1]');
        const result = generateGraphModules(parsedCode, parsedArgs).join('');
        const expected = 'n1 [label="-1-\n' +
            ' x[0] = y[1]", shape=rectangle, style = filled, fillcolor = green];\n' +
            'n2 [label="-2-\n' +
            ' return x;", shape=rectangle, style = filled, fillcolor = green];\n' +
            'n1 -> n2 ;\n' +
            '';
        assert.equal(
            result,
            expected
        );
    });

    it('is array object expr', () => {
        const parsedCode = parseCode('function foo(x,y){  \n' +
            'x[0] = [0,1,2][0];  \n' +
            '\treturn x;\n' +
            '}');
        const parsedArgs = parseCode('[1],[2,1]');
        const result = generateGraphModules(parsedCode, parsedArgs).join('');
        const expected = 'n1 [label="-1-\n' +
            ' x[0] = [0, 1, 2][0]", shape=rectangle, style = filled, fillcolor = green];\n' +
            'n2 [label="-2-\n' +
            ' return x;", shape=rectangle, style = filled, fillcolor = green];\n' +
            'n1 -> n2 ;\n' +
            '';
        assert.equal(
            result,
            expected
        );
    });

    it('is resolving updateExpr incorrectly', () => {
        const parsedCode = parseCode('function foo(x,y){  \n' +
            'x[0] = [0,1,2][0];\n' +
            'y++;  \n' +
            '\treturn x;\n' +
            '}');
        const parsedArgs = parseCode('[1],1');
        const result = generateGraphModules(parsedCode, parsedArgs).join('');
        const expected = 'n1 [label="-1-\n' +
            ' x[0] = [0, 1, 2][0]\n' +
            'y++", shape=rectangle, style = filled, fillcolor = green];\n' +
            'n2 [label="-2-\n' +
            ' return x;", shape=rectangle, style = filled, fillcolor = green];\n' +
            'n1 -> n2 ;\n' +
            '';
        assert.equal(
            result,
            expected
        );
    });

    it('is resolving arrayLabel incorrectly', () => {
        const parsedCode = parseCode('function a(x){\n' +
            'let a =0;\n' +
            'return 0;\n' +
            '}');
        const parsedArgs = parseCode('1');
        const result = generateGraphModules(parsedCode, parsedArgs).join('');
        const expected = 'n1 [label="-1-\n' +
            ' let a = 0;", shape=rectangle, style = filled, fillcolor = green];\n' +
            'n2 [label="-2-\n' +
            ' return 0;", shape=rectangle, style = filled, fillcolor = green];\n' +
            'n1 -> n2 ;\n' +
            '';
        assert.equal(
            result,
            expected
        );
    });

    it('is resolving if going to return statement on false flow', () => {
        const parsedCode = parseCode('function goo(x,y,z){\n' +
            'if(x>y){\n' +
            'x=x+1;\n' +
            '}\n' +
            'if(y>x){\n' +
            'y=y+1;\n' +
            '}\n' +
            'return z;\n' +
            '}');
        const parsedArgs = parseCode('1,2,3');
        const result = generateGraphModules(parsedCode, parsedArgs).join('');
        const expected = 'n1 [label="-1-\n' +
            ' x > y", shape=diamond, style = filled, fillcolor = green];\n' +
            'n2 [label="-2-\n' +
            ' y > x", shape=diamond, style = filled, fillcolor = green];\n' +
            'n3 [label="-3-\n' +
            ' x = x + 1", shape=rectangle, style = filled, fillcolor = white];\n' +
            'n0 [label="", shape=circle, style = filled, fillcolor = green];\n' +
            'n4 [label="-4-\n' +
            ' y = y + 1", shape=rectangle, style = filled, fillcolor = green];\n' +
            'n5 [label="-5-\n' +
            ' return z;", shape=rectangle, style = filled, fillcolor = green];\n' +
            'n1 -> n2 [label="F"];\n' +
            'n1 -> n3 [label="T"];\n' +
            'n2 -> n0 [label="F"];\n' +
            'n2 -> n4 [label="T"];\n' +
            'n3 -> n2 ;\n' +
            'n0 -> n5 ;\n' +
            'n4 -> n0 ;\n' +
            '';
        assert.equal(
            result,
            expected
        );
    });

    it('is resolving if going to return statement on false flow', () => {
        const parsedCode = parseCode('function goo(x,y,z){\n' +
            'if(x>y){\n' +
            'x=x+1;\n' +
            '}\n' +
            'if(y>x){\n' +
            'if(1===2){\n' +
            'return z;\n' +
            '}\n' +
            'z=5\n' +
            '}\n' +
            'return z;\n' +
            '}');
        const parsedArgs = parseCode('1,2,3');
        const result = generateGraphModules(parsedCode, parsedArgs).join('');
        const expected = 'n1 [label="-1-\n' +
            ' x > y", shape=diamond, style = filled, fillcolor = green];\n' +
            'n2 [label="-2-\n' +
            ' y > x", shape=diamond, style = filled, fillcolor = green];\n' +
            'n3 [label="-3-\n' +
            ' x = x + 1", shape=rectangle, style = filled, fillcolor = white];\n' +
            'n0 [label="", shape=circle, style = filled, fillcolor = green];\n' +
            'n4 [label="-4-\n' +
            ' 1 === 2", shape=diamond, style = filled, fillcolor = green];\n' +
            'n5 [label="-5-\n' +
            ' return z;", shape=rectangle, style = filled, fillcolor = green];\n' +
            'n6 [label="-6-\n' +
            ' z = 5", shape=rectangle, style = filled, fillcolor = green];\n' +
            'n7 [label="-7-\n' +
            ' return z;", shape=rectangle, style = filled, fillcolor = white];\n' +
            'n1 -> n2 [label="F"];\n' +
            'n1 -> n3 [label="T"];\n' +
            'n2 -> n0 [label="F"];\n' +
            'n2 -> n4 [label="T"];\n' +
            'n3 -> n2 ;\n' +
            'n0 -> n5 ;\n' +
            'n4 -> n6 [label="F"];\n' +
            'n4 -> n7 [label="T"];\n' +
            'n6 -> n0 ;\n' +
            '';
        assert.equal(
            result,
            expected
        );
    });
});



