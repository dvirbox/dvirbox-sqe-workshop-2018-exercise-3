/* eslint-disable max-lines-per-function */

import assert from 'assert';
import {parseCode, resolveCode} from '../src/js/code-analyzer';


describe('The javascript parser', () => {
    it('is parsing an empty function correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('')),
            '{"type":"Program","body":[],"sourceType":"script","range":[0,0],"loc":{"start":{"line":0,"column":0},"end":{"line":0,"column":0}}}'
        );
    });
});

describe('The resolver', () => {
    it('is resolving an assignment example 1 incorrectly', () => {
        let code = 'function foo(x, y, z){\n' +
            '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '    \n' +
            '    if (b < z) {\n' +
            '        c = c + 5;\n' +
            '        return x + y + z + c;\n' +
            '    } else if (b < z * 2) {\n' +
            '        c = c + x + 5;\n' +
            '        return x + y + z + c;\n' +
            '    } else {\n' +
            '        c = c + z + 5;\n' +
            '        return x + y + z + c;\n' +
            '    }\n' +
            '}\n';
        assert.equal(
            JSON.stringify(resolveCode(code, '1,2,3')),
            '["function foo(x, y, z){","<span style=\\"background-color: #ff5733\\">    if (x + 1 + y < z) {</span>","        return x + y + z + 0 + 5;","<span style=\\"background-color: #b6ff33\\">    } else if (x + 1 + y < z * 2) {</span>","        return x + y + z + 0 + x + 5;","    } else {","        return x + y + z + 0 + z + 5;","    }","}"]'
        );
    });

    it('is resolving an error example - not immediate interpreting', () => {
        let code = 'function foo(x, y, z){    \n' +
            '    let a = x + 1;    \n' +
            '    let b = a + y;    \n' +
            '    let c = 0;    \n' +
            '    while (c++ < 10) {    \n' +
            '    a = x * y;    \n' +
            '    z = a * b * c;    \n' +
            '    }    \n' +
            '    return z;    \n' +
            '}';
        assert.equal(
            JSON.stringify(resolveCode(code, '1,2,3')),
            '["function foo(x, y, z){    ","    while (c++ < 10) {    ","    z = (x * y)  * (x + 1 + y)  * (0);    ","    }    ","    return z;    ","}"]'
        );
    });

    it('is resolving an assignment example 2 incorrectly', () => {
        let code = 'function foo(x, y, z){\n' +
            '\tlet a = x + 1;\n' +
            '\tlet b = a + y;\n' +
            '\tlet c = 0;\n' +
            '\n' +
            '\twhile (a < z) {\n' +
            '\t\tc = a + b;\n' +
            '\t\tz = c * 2;\n' +
            '\t}\n' +
            '\n' +
            '\treturn z;\n' +
            '}';
        assert.equal(
            JSON.stringify(resolveCode(code, '1,2,3')),
            '["function foo(x, y, z){","\\twhile (x + 1 < z) {","\\t\\tz = (x + 1 + x + 1 + y)  * 2;","\\t}","\\treturn z;","}"]'
        );
    });

    it('is resolving an assignment example 4 (coloring) incorrectly', () => {
        let code = 'function foo(x, y, z){\n' +
            '\tlet a = x + 1;\n' +
            '\tlet b = a + y;\n' +
            '\tlet c = 0;\n' +
            '\n' +
            '\tif (b < z) {\n' +
            '\t\tc = c + 5;\n' +
            '\t\treturn x + y + z + c;\n' +
            '\t} else if (b < z * 2) {\n' +
            '\t\tc = c + x + 5;\n' +
            '\t\treturn x + y + z + c;\n' +
            '\t} else {\n' +
            '\t\tc = c + z + 5;\n' +
            '\t\treturn x + y + z + c;\n' +
            '\t}\n' +
            '}\n';
        assert.equal(
            JSON.stringify(resolveCode(code, '1,2,3')),
            '["function foo(x, y, z){","<span style=\\"background-color: #ff5733\\">\\tif (x + 1 + y < z) {</span>","\\t\\treturn x + y + z + 0 + 5;","<span style=\\"background-color: #b6ff33\\">\\t} else if (x + 1 + y < z * 2) {</span>","\\t\\treturn x + y + z + 0 + x + 5;","\\t} else {","\\t\\treturn x + y + z + 0 + z + 5;","\\t}","}"]'
        );
    });

    it('is resolving if with brackets and without else incorrectly', () => {
        let code = 'function foo(x, y, z){\n' +
            '\tlet a = x + 1;\n' +
            '\tlet b = a + y;\n' +
            '\tlet c = 0;\n' +
            '\n' +
            '\tif (b < z) {\n' +
            '\t\tc = c + 5;\n' +
            '\t\treturn x + y + z + c;\n' +
            '\t}\n' +
            'return z;\n' +
            '}\n';
        assert.equal(
            JSON.stringify(resolveCode(code, '1,2,3')),
            '["function foo(x, y, z){","<span style=\\"background-color: #ff5733\\">\\tif (x + 1 + y < z) {</span>","\\t\\treturn x + y + z + 0 + 5;","\\t}","return z;","}"]'
        );
    });

    it('is resolving if with brackets and with else incorrectly', () => {
        let code = 'function foo(x, y, z){\n' +
            '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '\n' +
            '    if (b < z) {\n' +
            '        c = c + 5;\n' +
            '        return x + y + z + c;\n' +
            '    }\n' +
            '    else{\n' +
            '        return z;\n' +
            '    }\n' +
            '}';
        assert.equal(
            JSON.stringify(resolveCode(code, '1,2,3')),
            '["function foo(x, y, z){","<span style=\\"background-color: #ff5733\\">    if (x + 1 + y < z) {</span>","        return x + y + z + 0 + 5;","    }","    else{","        return z;","    }","}"]'
        );
    });

    it('is resolving an function with if-elseif without else statement incorrectly', () => {
        let code = 'function foo(x, y, z){\n' +
            '\tlet a = x + 1;\n' +
            '\tlet b = a + y;\n' +
            '\tlet c = 0;\n' +
            '\n' +
            '\tif (b < z) {\n' +
            '\t\tc = c + 5;\n' +
            '\t\treturn x + y + z + c;\n' +
            '\t}\n' +
            'else if(true){\n' +
            'return z;\n' +
            '}\n' +
            '}\n';
        assert.equal(
            JSON.stringify(resolveCode(code, '1,2,3')),
            '["function foo(x, y, z){","<span style=\\"background-color: #ff5733\\">\\tif (x + 1 + y < z) {</span>","\\t\\treturn x + y + z + 0 + 5;","\\t}","<span style=\\"background-color: #b6ff33\\">else if(true){</span>","return z;","}","}"]'
        );
    });

    it('is resolving if with brackets and without else without return statement in else incorrectly', () => {
        let code = 'function foo(x, y, z){    \n' +
            'let a = x + 1;    \n' +
            'let b = a + y;    \n' +
            'let c = 0;    \n' +
            '\t\n' +
            'if (b < z) {    \n' +
            'c += 5;    \n' +
            'x=-x;    \n' +
            'return x + y + z + c;    \n' +
            '}    \n' +
            '\t\n' +
            '}';
        assert.equal(
            JSON.stringify(resolveCode(code, '1,2,3')),
            '["function foo(x, y, z){    ","<span style=\\"background-color: #b6ff33\\">if (x + 1 + y < z) {    </span>","x=-x;    ","return x + y + z + 5;    ","}    ","}"]'
        );
    });

    it('is resolving if without return statement incorrectly', () => {
        let code = 'function foo(x, y, z){\n' +
            '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '\n' +
            '    if (b < z) {\n' +
            '        c += 5;\n' +
            '    }\n' +
            '    else {\n' +
            '        return 3;\n' +
            '    }\n' +
            '}';
        assert.equal(
            JSON.stringify(resolveCode(code, '1,2,3')),
            '["function foo(x, y, z){","<span style=\\"background-color: #ff5733\\">    if (x + 1 + y < z) {</span>","    }","    else {","        return 3;","    }","}"]'
        );
    });


    it('is resolving void function with single return incorrectly', () => {
        let code = 'function foo(x, y, z){\n' +
            'return;\n' +
            '}\n';
        assert.equal(
            JSON.stringify(resolveCode(code, '1,2,3')),
            '["function foo(x, y, z){","return;","}"]'
        );
    });

    it('is resolving void function with if with return without else incorrectly', () => {
        let code = 'function foo(x, y, z){\n' +
            'if(x){\n' +
            'return;\n' +
            '}\n' +
            '}\n';
        assert.equal(
            JSON.stringify(resolveCode(code, '1,2,3')),
            '["function foo(x, y, z){","<span style=\\"background-color: #b6ff33\\">if(x){</span>","return;","}","}"]'
        );
    });

    it('is resolving an function with if (without brackets) without else statement incorrectly', () => {
        let code = 'function binarySearch(X, V, n){\n' +
            '    let mid = 0;\n' +
            '    if (X < V[mid])\n' +
            '        return high = mid - 1;\n' +
            '}';
        assert.equal(
            JSON.stringify(resolveCode(code, '1,[2],3')),
            '["function binarySearch(X, V, n){","<span style=\\"background-color: #b6ff33\\">    if (X < V[0])</span>","        return high = 0 - 1;","}"]'
        );
    });

    it('is resolving an function with global variables before and after', () => {
        let code = 'let d = 3;    \n' +
            'function foo(x, y, z){    \n' +
            '\tlet a = x + 1;    \n' +
            '\tlet b = a + y;    \n' +
            '\tlet c = 0;    \n' +
            '\t\n' +
            '\tif (b < z) {    \n' +
            '\t\tc = c + 5;    \n' +
            '\t\treturn x + y + z + c;    \n' +
            '\t} else if (b < z * 2) {    \n' +
            '\t\tc = c + x + 5;    \n' +
            '\t\treturn x + y + z + c +d+w;    \n' +
            '\t} else {    \n' +
            '\t\tc = c + z + 5;    \n' +
            '\t\treturn x + y + z + c;    \n' +
            '\t}    \n' +
            '}    \n' +
            'let w = 8;';
        assert.equal(
            JSON.stringify(resolveCode(code, '1,2,3')),
            '["function foo(x, y, z){    ","<span style=\\"background-color: #ff5733\\">\\tif (x + 1 + y < z) {    </span>","\\t\\treturn x + y + z + 0 + 5;    ","<span style=\\"background-color: #b6ff33\\">\\t} else if (x + 1 + y < z * 2) {    </span>","\\t\\treturn x + y + z + 0 + x + 5 + d + w;    ","\\t} else {    ","\\t\\treturn x + y + z + 0 + z + 5;    ","\\t}    ","}    "]'
        );
    });

    it('is resolving an with local array variable incorrectly', () => {
        let code = 'function binarySearch(X, V, n){\n' +
            '    let c = [1,2,3]\n' +
            '    let mid = 0;\n' +
            '    if (X < V[mid])\n' +
            '        return high = mid - 1 + c[0];\n' +
            '}';
        assert.equal(
            JSON.stringify(resolveCode(code, '1,[2],3')),
            '["function binarySearch(X, V, n){","<span style=\\"background-color: #b6ff33\\">    if (X < V[0])</span>","        return high = 0 - 1 + [1,2,3][0];","}"]'
        );
    });

    it('is resolving an with global array variable incorrectly', () => {
        let code = 'let c = [6,2,3]    \n' +
            'function binarySearch(X, V, n){    \n' +
            '\tlet mid = 0;    \n' +
            '\tif (X < V[mid])    \n' +
            '\t\treturn high = mid - 1 + c[0];    \n' +
            '}';
        assert.equal(
            JSON.stringify(resolveCode(code, '1,[2],3')),
            '["function binarySearch(X, V, n){    ","<span style=\\"background-color: #b6ff33\\">\\tif (X < V[0])    </span>","\\t\\treturn high = 0 - 1 + c[0];    ","}"]'
        );
    });

    it('is resolving an uninitialized local incorrectly', () => {
        let code = 'let c = [6,2,3]    \n' +
            'function binarySearch(X, V, n){    \n' +
            '\tlet mid;    \n' +
            '\tmid = 0;    \n' +
            '\tif (X < V[mid])    \n' +
            '\t\treturn high = mid - 1 + c[0];    \n' +
            '}';
        assert.equal(
            JSON.stringify(resolveCode(code, '1,[2],3')),
            '["function binarySearch(X, V, n){    ","<span style=\\"background-color: #b6ff33\\">\\tif (X < V[0])    </span>","\\t\\treturn high = 0 - 1 + c[0];    ","}"]'
        );
    });

    it('is resolving an uninitialized local incorrectly', () => {
        let code = 'function binarySearch(X, V, n){    \n' +
            'let c = [0,2,[0]]       \n' +
            '\tlet mid = 0;        \n' +
            '\tif (X < c[0] +  [1,2][0] + c[2][0])        \n' +
            '\t\treturn high = mid - 1 + c[2][0];        \n' +
            '}';
        assert.equal(
            JSON.stringify(resolveCode(code, '1,[2],3')),
            '["function binarySearch(X, V, n){    ","<span style=\\"background-color: #ff5733\\">\\tif (X < [0,2,[0]][0] +[1,2][0] + [0,2,[0]][2][0])        </span>","\\t\\treturn high = 0 - 1 + [0,2,[0]][2][0];        ","}"]'
        );
    });

    it('is resolving an uninitialized local incorrectly', () => {
        let code = 'function binarySearch(x, y, z){\n' +
            'let c = \'Dvir\';\n' +
            'let d = \'dvir\'; \n' +
            '    if(c === z){\n' +
            '        return [1,2,3,4];\n' +
            '    }\n' +
            '    if(d === z){\n' +
            '        return [1,2,3,c];\n' +
            '    }          \n' +
            '    if(y){\n' +
            '        return [y,c,x,d];\n' +
            '    }\n' +
            '    if(x){\n' +
            '        return 4;\n' +
            '    }\n' +
            '    if(0){\n' +
            '        return 5;\n' +
            '    }\n' +
            '}';
        assert.equal(
            JSON.stringify(resolveCode(code, 'undefined,false,\'Dvir\'')),
            '["function binarySearch(x, y, z){","<span style=\\"background-color: #b6ff33\\">    if(\\"Dvir\\" === z){</span>","        return [1,2,3,4];","    }","<span style=\\"background-color: #ff5733\\">    if(\\"dvir\\" === z){</span>","        return [1,2,3,\\"Dvir\\"];","    }          ","<span style=\\"background-color: #ff5733\\">    if(y){</span>","        return [y,\\"Dvir\\",x,\\"dvir\\"];","    }","<span style=\\"background-color: #ff5733\\">    if(x){</span>","        return 4;","    }","<span style=\\"background-color: #ff5733\\">    if(0){</span>","        return 5;","    }","}"]'
        );
    });

    it('is resolving array stuff incorreclty', () => {
        let code = 'function foo(x, y, z){\n' +
            '    let c=[1,2,3];\n' +
            '    c = x;\n' +
            '    c[0] = 6;    \n' +
            '    x[0]=-x[0];\n' +
            '    if(y === 2){\n' +
            '        return 4;\n' +
            '    }    \n' +
            '    if(x[0] === -1){\n' +
            '        return x + y + z + c;    \n' +
            '    }    \n' +
            '}';
        assert.equal(
            JSON.stringify(resolveCode(code, '[1,2,3],2,3')),
            '["function foo(x, y, z){","    x[0]=-x[0];","<span style=\\"background-color: #b6ff33\\">    if(y === 2){</span>","        return 4;","    }    ","<span style=\\"background-color: #b6ff33\\">    if(x[0] === -1){</span>","        return x + y + z + x;    ","    }    ","}"]'
        );
    });
});