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

    it('is parsing a simple variable declaration incorrectly', () => {
        assert.equal(
            JSON.stringify(parseCode('let a = 1;')),
            '{"type":"Program","body":[{"type":"VariableDeclaration","declarations":[{"type":"VariableDeclarator","id":{"type":"Identifier","name":"a","range":[4,5],"loc":{"start":{"line":1,"column":4},"end":{"line":1,"column":5}}},"init":{"type":"Literal","value":1,"raw":"1","range":[8,9],"loc":{"start":{"line":1,"column":8},"end":{"line":1,"column":9}}},"range":[4,9],"loc":{"start":{"line":1,"column":4},"end":{"line":1,"column":9}}}],"kind":"let","range":[0,10],"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":10}}}],"sourceType":"script","range":[0,10],"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":10}}}'
        );
    });

    it('is parsing assignment example incorrectly', () => {
        assert.equal(
            JSON.stringify(parseCode('function binarySearch(X, V, n){\n' +
                '    let low, high, mid;\n' +
                '    low = 0;\n' +
                '    high = n - 1;\n' +
                '    while (low <= high) {\n' +
                '        mid = (low + high)/2;\n' +
                '        if (X < V[mid])\n' +
                '            high = mid - 1;\n' +
                '        else if (X > V[mid])\n' +
                '            low = mid + 1;\n' +
                '        else\n' +
                '            return mid;\n' +
                '    }\n' +
                '    return -1;\n' +
                '}')),
            '{"type":"Program","body":[{"type":"FunctionDeclaration","id":{"type":"Identifier","name":"binarySearch","range":[9,21],"loc":{"start":{"line":1,"column":9},"end":{"line":1,"column":21}}},"params":[{"type":"Identifier","name":"X","range":[22,23],"loc":{"start":{"line":1,"column":22},"end":{"line":1,"column":23}}},{"type":"Identifier","name":"V","range":[25,26],"loc":{"start":{"line":1,"column":25},"end":{"line":1,"column":26}}},{"type":"Identifier","name":"n","range":[28,29],"loc":{"start":{"line":1,"column":28},"end":{"line":1,"column":29}}}],"body":{"type":"BlockStatement","body":[{"type":"VariableDeclaration","declarations":[{"type":"VariableDeclarator","id":{"type":"Identifier","name":"low","range":[40,43],"loc":{"start":{"line":2,"column":8},"end":{"line":2,"column":11}}},"init":null,"range":[40,43],"loc":{"start":{"line":2,"column":8},"end":{"line":2,"column":11}}},{"type":"VariableDeclarator","id":{"type":"Identifier","name":"high","range":[45,49],"loc":{"start":{"line":2,"column":13},"end":{"line":2,"column":17}}},"init":null,"range":[45,49],"loc":{"start":{"line":2,"column":13},"end":{"line":2,"column":17}}},{"type":"VariableDeclarator","id":{"type":"Identifier","name":"mid","range":[51,54],"loc":{"start":{"line":2,"column":19},"end":{"line":2,"column":22}}},"init":null,"range":[51,54],"loc":{"start":{"line":2,"column":19},"end":{"line":2,"column":22}}}],"kind":"let","range":[36,55],"loc":{"start":{"line":2,"column":4},"end":{"line":2,"column":23}}},{"type":"ExpressionStatement","expression":{"type":"AssignmentExpression","operator":"=","left":{"type":"Identifier","name":"low","range":[60,63],"loc":{"start":{"line":3,"column":4},"end":{"line":3,"column":7}}},"right":{"type":"Literal","value":0,"raw":"0","range":[66,67],"loc":{"start":{"line":3,"column":10},"end":{"line":3,"column":11}}},"range":[60,67],"loc":{"start":{"line":3,"column":4},"end":{"line":3,"column":11}}},"range":[60,68],"loc":{"start":{"line":3,"column":4},"end":{"line":3,"column":12}}},{"type":"ExpressionStatement","expression":{"type":"AssignmentExpression","operator":"=","left":{"type":"Identifier","name":"high","range":[73,77],"loc":{"start":{"line":4,"column":4},"end":{"line":4,"column":8}}},"right":{"type":"BinaryExpression","operator":"-","left":{"type":"Identifier","name":"n","range":[80,81],"loc":{"start":{"line":4,"column":11},"end":{"line":4,"column":12}}},"right":{"type":"Literal","value":1,"raw":"1","range":[84,85],"loc":{"start":{"line":4,"column":15},"end":{"line":4,"column":16}}},"range":[80,85],"loc":{"start":{"line":4,"column":11},"end":{"line":4,"column":16}}},"range":[73,85],"loc":{"start":{"line":4,"column":4},"end":{"line":4,"column":16}}},"range":[73,86],"loc":{"start":{"line":4,"column":4},"end":{"line":4,"column":17}}},{"type":"WhileStatement","test":{"type":"BinaryExpression","operator":"<=","left":{"type":"Identifier","name":"low","range":[98,101],"loc":{"start":{"line":5,"column":11},"end":{"line":5,"column":14}}},"right":{"type":"Identifier","name":"high","range":[105,109],"loc":{"start":{"line":5,"column":18},"end":{"line":5,"column":22}}},"range":[98,109],"loc":{"start":{"line":5,"column":11},"end":{"line":5,"column":22}}},"body":{"type":"BlockStatement","body":[{"type":"ExpressionStatement","expression":{"type":"AssignmentExpression","operator":"=","left":{"type":"Identifier","name":"mid","range":[121,124],"loc":{"start":{"line":6,"column":8},"end":{"line":6,"column":11}}},"right":{"type":"BinaryExpression","operator":"/","left":{"type":"BinaryExpression","operator":"+","left":{"type":"Identifier","name":"low","range":[128,131],"loc":{"start":{"line":6,"column":15},"end":{"line":6,"column":18}}},"right":{"type":"Identifier","name":"high","range":[134,138],"loc":{"start":{"line":6,"column":21},"end":{"line":6,"column":25}}},"range":[128,138],"loc":{"start":{"line":6,"column":15},"end":{"line":6,"column":25}}},"right":{"type":"Literal","value":2,"raw":"2","range":[140,141],"loc":{"start":{"line":6,"column":27},"end":{"line":6,"column":28}}},"range":[127,141],"loc":{"start":{"line":6,"column":14},"end":{"line":6,"column":28}}},"range":[121,141],"loc":{"start":{"line":6,"column":8},"end":{"line":6,"column":28}}},"range":[121,142],"loc":{"start":{"line":6,"column":8},"end":{"line":6,"column":29}}},{"type":"IfStatement","test":{"type":"BinaryExpression","operator":"<","left":{"type":"Identifier","name":"X","range":[155,156],"loc":{"start":{"line":7,"column":12},"end":{"line":7,"column":13}}},"right":{"type":"MemberExpression","computed":true,"object":{"type":"Identifier","name":"V","range":[159,160],"loc":{"start":{"line":7,"column":16},"end":{"line":7,"column":17}}},"property":{"type":"Identifier","name":"mid","range":[161,164],"loc":{"start":{"line":7,"column":18},"end":{"line":7,"column":21}}},"range":[159,165],"loc":{"start":{"line":7,"column":16},"end":{"line":7,"column":22}}},"range":[155,165],"loc":{"start":{"line":7,"column":12},"end":{"line":7,"column":22}}},"consequent":{"type":"ExpressionStatement","expression":{"type":"AssignmentExpression","operator":"=","left":{"type":"Identifier","name":"high","range":[179,183],"loc":{"start":{"line":8,"column":12},"end":{"line":8,"column":16}}},"right":{"type":"BinaryExpression","operator":"-","left":{"type":"Identifier","name":"mid","range":[186,189],"loc":{"start":{"line":8,"column":19},"end":{"line":8,"column":22}}},"right":{"type":"Literal","value":1,"raw":"1","range":[192,193],"loc":{"start":{"line":8,"column":25},"end":{"line":8,"column":26}}},"range":[186,193],"loc":{"start":{"line":8,"column":19},"end":{"line":8,"column":26}}},"range":[179,193],"loc":{"start":{"line":8,"column":12},"end":{"line":8,"column":26}}},"range":[179,194],"loc":{"start":{"line":8,"column":12},"end":{"line":8,"column":27}}},"alternate":{"type":"IfStatement","test":{"type":"BinaryExpression","operator":">","left":{"type":"Identifier","name":"X","range":[212,213],"loc":{"start":{"line":9,"column":17},"end":{"line":9,"column":18}}},"right":{"type":"MemberExpression","computed":true,"object":{"type":"Identifier","name":"V","range":[216,217],"loc":{"start":{"line":9,"column":21},"end":{"line":9,"column":22}}},"property":{"type":"Identifier","name":"mid","range":[218,221],"loc":{"start":{"line":9,"column":23},"end":{"line":9,"column":26}}},"range":[216,222],"loc":{"start":{"line":9,"column":21},"end":{"line":9,"column":27}}},"range":[212,222],"loc":{"start":{"line":9,"column":17},"end":{"line":9,"column":27}}},"consequent":{"type":"ExpressionStatement","expression":{"type":"AssignmentExpression","operator":"=","left":{"type":"Identifier","name":"low","range":[236,239],"loc":{"start":{"line":10,"column":12},"end":{"line":10,"column":15}}},"right":{"type":"BinaryExpression","operator":"+","left":{"type":"Identifier","name":"mid","range":[242,245],"loc":{"start":{"line":10,"column":18},"end":{"line":10,"column":21}}},"right":{"type":"Literal","value":1,"raw":"1","range":[248,249],"loc":{"start":{"line":10,"column":24},"end":{"line":10,"column":25}}},"range":[242,249],"loc":{"start":{"line":10,"column":18},"end":{"line":10,"column":25}}},"range":[236,249],"loc":{"start":{"line":10,"column":12},"end":{"line":10,"column":25}}},"range":[236,250],"loc":{"start":{"line":10,"column":12},"end":{"line":10,"column":26}}},"alternate":{"type":"ReturnStatement","argument":{"type":"Identifier","name":"mid","range":[283,286],"loc":{"start":{"line":12,"column":19},"end":{"line":12,"column":22}}},"range":[276,287],"loc":{"start":{"line":12,"column":12},"end":{"line":12,"column":23}}},"range":[208,287],"loc":{"start":{"line":9,"column":13},"end":{"line":12,"column":23}}},"range":[151,287],"loc":{"start":{"line":7,"column":8},"end":{"line":12,"column":23}}}],"range":[111,293],"loc":{"start":{"line":5,"column":24},"end":{"line":13,"column":5}}},"range":[91,293],"loc":{"start":{"line":5,"column":4},"end":{"line":13,"column":5}}},{"type":"ReturnStatement","argument":{"type":"UnaryExpression","operator":"-","argument":{"type":"Literal","value":1,"raw":"1","range":[306,307],"loc":{"start":{"line":14,"column":12},"end":{"line":14,"column":13}}},"prefix":true,"range":[305,307],"loc":{"start":{"line":14,"column":11},"end":{"line":14,"column":13}}},"range":[298,308],"loc":{"start":{"line":14,"column":4},"end":{"line":14,"column":14}}}],"range":[30,310],"loc":{"start":{"line":1,"column":30},"end":{"line":15,"column":1}}},"generator":false,"expression":false,"async":false,"range":[0,310],"loc":{"start":{"line":1,"column":0},"end":{"line":15,"column":1}}}],"sourceType":"script","range":[0,310],"loc":{"start":{"line":1,"column":0},"end":{"line":15,"column":1}}}'
        );
    });
});

describe('The resolver', () => {
    it('is resolving an basic function with single return statement incorrectly', () => {
        let code = 'function binarySearch(X, V, n){\n' +
            'return \'\';\n' +
            '}';
        assert.equal(
            JSON.stringify(resolveCode(code)),
            '[{"line":1,"type":"FunctionDeclaration","name":"binarySearch","condition":"","value":""},{"line":1,"type":"VariableDeclaration","name":"X","condition":"","value":""},{"line":1,"type":"VariableDeclaration","name":"V","condition":"","value":""},{"line":1,"type":"VariableDeclaration","name":"n","condition":"","value":""},{"line":2,"type":"ReturnStatement","name":"","condition":"","value":"\'\'"}]'
        );
    });

    it('is resolving the assignment example input incorrectly', () => {
        let code = 'function binarySearch(X, V, n){\n' +
            '    let low, high, mid;\n' +
            '    low = 0;\n' +
            '    high = n - 1;\n' +
            '    while (low <= high) {\n' +
            '        mid = (low + high)/2;\n' +
            '        if (X < V[mid])\n' +
            '            high = mid - 1;\n' +
            '        else if (X > V[mid])\n' +
            '            low = mid + 1;\n' +
            '        else\n' +
            '            return mid;\n' +
            '    }\n' +
            '    return -1;\n' +
            '}';
        assert.equal(
            JSON.stringify(resolveCode(code)),
            '[{"line":1,"type":"FunctionDeclaration","name":"binarySearch","condition":"","value":""},{"line":1,"type":"VariableDeclaration","name":"X","condition":"","value":""},{"line":1,"type":"VariableDeclaration","name":"V","condition":"","value":""},{"line":1,"type":"VariableDeclaration","name":"n","condition":"","value":""},{"line":2,"type":"VariableDeclaration","name":"low","condition":"","value":""},{"line":2,"type":"VariableDeclaration","name":"high","condition":"","value":""},{"line":2,"type":"VariableDeclaration","name":"mid","condition":"","value":""},{"line":3,"type":"AssignmentExpression","name":"low","condition":"","value":"0"},{"line":4,"type":"AssignmentExpression","name":"high","condition":"","value":"n - 1"},{"line":5,"type":"WhileStatement","name":"","condition":"low <= high","value":""},{"line":6,"type":"AssignmentExpression","name":"mid","condition":"","value":"(low + high) / 2"},{"line":7,"type":"IfStatement","name":"","condition":"X < V[mid]","value":""},{"line":8,"type":"AssignmentExpression","name":"high","condition":"","value":"mid - 1"},{"line":9,"type":"ElseIfStatement","name":"","condition":"X > V[mid]","value":""},{"line":10,"type":"AssignmentExpression","name":"low","condition":"","value":"mid + 1"},{"line":12,"type":"ReturnStatement","name":"","condition":"","value":"mid"},{"line":14,"type":"ReturnStatement","name":"","condition":"","value":"-1"}]'
        );
    });

    it('is resolving an function with if without else statement incorrectly', () => {
        let code = 'function binarySearch(X, V, n){\n' +
            'if (X < V[mid])\n' +
            'return high = mid - 1;\n' +
            '}';
        assert.equal(
            JSON.stringify(resolveCode(code)),
            '[{"line":1,"type":"FunctionDeclaration","name":"binarySearch","condition":"","value":""},{"line":1,"type":"VariableDeclaration","name":"X","condition":"","value":""},{"line":1,"type":"VariableDeclaration","name":"V","condition":"","value":""},{"line":1,"type":"VariableDeclaration","name":"n","condition":"","value":""},{"line":2,"type":"IfStatement","name":"","condition":"X < V[mid]","value":""},{"line":3,"type":"ReturnStatement","name":"","condition":"","value":"high = mid - 1"}]'
        );
    });

    it('is resolving an function with if-else statement incorrectly', () => {
        let code = 'function binarySearch(X, V, n){\n' +
            'if (X < V[mid])\n' +
            'return high = mid - 1;\n' +
            'else{\n' +
            'return 3;\n' +
            '}\n' +
            '}';
        assert.equal(
            JSON.stringify(resolveCode(code)),
            '[{"line":1,"type":"FunctionDeclaration","name":"binarySearch","condition":"","value":""},{"line":1,"type":"VariableDeclaration","name":"X","condition":"","value":""},{"line":1,"type":"VariableDeclaration","name":"V","condition":"","value":""},{"line":1,"type":"VariableDeclaration","name":"n","condition":"","value":""},{"line":2,"type":"IfStatement","name":"","condition":"X < V[mid]","value":""},{"line":3,"type":"ReturnStatement","name":"","condition":"","value":"high = mid - 1"},{"line":5,"type":"ReturnStatement","name":"","condition":"","value":"3"}]'
        );
    });

    it('is resolving an function with if-elseif without else statement incorrectly', () => {
        let code = 'function binarySearch(X, V, n){\n' +
            'if (X < V[mid])\n' +
            'return high = mid - 1;\n' +
            'else if(true){\n' +
            'return 3;\n' +
            '}\n' +
            'return 1;\n' +
            '}';
        assert.equal(
            JSON.stringify(resolveCode(code)),
            '[{"line":1,"type":"FunctionDeclaration","name":"binarySearch","condition":"","value":""},{"line":1,"type":"VariableDeclaration","name":"X","condition":"","value":""},{"line":1,"type":"VariableDeclaration","name":"V","condition":"","value":""},{"line":1,"type":"VariableDeclaration","name":"n","condition":"","value":""},{"line":2,"type":"IfStatement","name":"","condition":"X < V[mid]","value":""},{"line":3,"type":"ReturnStatement","name":"","condition":"","value":"high = mid - 1"},{"line":4,"type":"ElseIfStatement","name":"","condition":"true","value":""},{"line":5,"type":"ReturnStatement","name":"","condition":"","value":"3"},{"line":7,"type":"ReturnStatement","name":"","condition":"","value":"1"}]'
        );
    });

    it('is resolving an function with if-elseif-else statement incorrectly', () => {
        let code = 'function binarySearch(X, V, n){\n' +
            'if (X < V[mid])\n' +
            'return high = mid - 1;\n' +
            'else if(true){\n' +
            'return 3;\n' +
            '}\n' +
            'else{\n' +
            'return 1;\n' +
            '}\n' +
            '}';
        assert.equal(
            JSON.stringify(resolveCode(code)),
            '[{"line":1,"type":"FunctionDeclaration","name":"binarySearch","condition":"","value":""},{"line":1,"type":"VariableDeclaration","name":"X","condition":"","value":""},{"line":1,"type":"VariableDeclaration","name":"V","condition":"","value":""},{"line":1,"type":"VariableDeclaration","name":"n","condition":"","value":""},{"line":2,"type":"IfStatement","name":"","condition":"X < V[mid]","value":""},{"line":3,"type":"ReturnStatement","name":"","condition":"","value":"high = mid - 1"},{"line":4,"type":"ElseIfStatement","name":"","condition":"true","value":""},{"line":5,"type":"ReturnStatement","name":"","condition":"","value":"3"},{"line":8,"type":"ReturnStatement","name":"","condition":"","value":"1"}]'
        );
    });

    it('is resolving an function with .this statement incorrectly', () => {
        let code = 'function binarySearch(X, V, n){\n' +
            'let low, high, mid;\n' +
            'low = 0;\n' +
            'high = n - 1;\n' +
            'while (low <= high) {\n' +
            'mid = (low + high)/2;\n' +
            'if (X < V[mid])\n' +
            'high = mid - 1;\n' +
            'else if (X > V[mid])\n' +
            'low = mid + 1;\n' +
            'else\n' +
            'return this.mid;\n' +
            '}\n' +
            'return -1;\n' +
            '}';
        assert.equal(
            JSON.stringify(resolveCode(code)),
            '[{"line":1,"type":"FunctionDeclaration","name":"binarySearch","condition":"","value":""},{"line":1,"type":"VariableDeclaration","name":"X","condition":"","value":""},{"line":1,"type":"VariableDeclaration","name":"V","condition":"","value":""},{"line":1,"type":"VariableDeclaration","name":"n","condition":"","value":""},{"line":2,"type":"VariableDeclaration","name":"low","condition":"","value":""},{"line":2,"type":"VariableDeclaration","name":"high","condition":"","value":""},{"line":2,"type":"VariableDeclaration","name":"mid","condition":"","value":""},{"line":3,"type":"AssignmentExpression","name":"low","condition":"","value":"0"},{"line":4,"type":"AssignmentExpression","name":"high","condition":"","value":"n - 1"},{"line":5,"type":"WhileStatement","name":"","condition":"low <= high","value":""},{"line":6,"type":"AssignmentExpression","name":"mid","condition":"","value":"(low + high) / 2"},{"line":7,"type":"IfStatement","name":"","condition":"X < V[mid]","value":""},{"line":8,"type":"AssignmentExpression","name":"high","condition":"","value":"mid - 1"},{"line":9,"type":"ElseIfStatement","name":"","condition":"X > V[mid]","value":""},{"line":10,"type":"AssignmentExpression","name":"low","condition":"","value":"mid + 1"},{"line":12,"type":"ReturnStatement","name":"","condition":"","value":"this.mid"},{"line":14,"type":"ReturnStatement","name":"","condition":"","value":"-1"}]'
        );
    });

    it('is resolving invalid input incorrectly', () => {
        assert.equal(
            JSON.stringify(resolveCode('{type: \'notExistingType\'}')),
            '[""]'
        );
    });

    it('is resolving for loop with (assignment expression) update incorrectly', () => {
        assert.equal(
            JSON.stringify(resolveCode('function test(){\n' +
                'let x = 3;\n' +
                'for(i=0;i<=5;i=i+1){\n' +
                'x = x+i;\n' +
                '}\n' +
                'return x;\n' +
                '}')),
            '[{"line":1,"type":"FunctionDeclaration","name":"test","condition":"","value":""},{"line":2,"type":"VariableDeclaration","name":"x","condition":"","value":"3"},{"line":3,"type":"ForStatement","name":"","condition":"i = 0; i <= 5; i = i + 1","value":""},{"line":4,"type":"AssignmentExpression","name":"x","condition":"","value":"x + i"},{"line":6,"type":"ReturnStatement","name":"","condition":"","value":"x"}]'
        );
    });

    it('is resolving for loop with prefix (i++) update incorrectly', () => {
        let code = 'function test(){\n' +
            'let x = 3;\n' +
            'for(i=0;i<=5;i++){\n' +
            'x = x+i;\n' +
            '}\n' +
            'return x;\n' +
            '}';
        assert.equal(
            JSON.stringify(resolveCode(code)),
            '[{"line":1,"type":"FunctionDeclaration","name":"test","condition":"","value":""},{"line":2,"type":"VariableDeclaration","name":"x","condition":"","value":"3"},{"line":3,"type":"ForStatement","name":"","condition":"i = 0; i <= 5; i++","value":""},{"line":4,"type":"AssignmentExpression","name":"x","condition":"","value":"x + i"},{"line":6,"type":"ReturnStatement","name":"","condition":"","value":"x"}]'
        );
    });

    it('is resolving for loop with infix (++i) update incorrectly', () => {
        let code = 'function test(){\n' +
            'let x = 3;\n' +
            'for(i=0;i<=5;++i){\n' +
            'x = x+i;\n' +
            '}\n' +
            'return x;\n' +
            '}';
        assert.equal(
            JSON.stringify(resolveCode(code)),
            '[{"line":1,"type":"FunctionDeclaration","name":"test","condition":"","value":""},{"line":2,"type":"VariableDeclaration","name":"x","condition":"","value":"3"},{"line":3,"type":"ForStatement","name":"","condition":"i = 0; i <= 5; ++i","value":""},{"line":4,"type":"AssignmentExpression","name":"x","condition":"","value":"x + i"},{"line":6,"type":"ReturnStatement","name":"","condition":"","value":"x"}]'
        );
    });

    it('is resolving for loop with (var in array) update notation incorrectly', () => {
        let code = 'function test(){\n' +
            'let x = 3;\n' +
            'for(x in low){\n' +
            'x = x+i;\n' +
            '}\n' +
            'return x;\n' +
            '}';
        assert.equal(
            JSON.stringify(resolveCode(code)),
            '[{"line":1,"type":"FunctionDeclaration","name":"test","condition":"","value":""},{"line":2,"type":"VariableDeclaration","name":"x","condition":"","value":"3"},{"line":3,"type":"ForInStatement","name":"","condition":"x in low","value":""},{"line":4,"type":"AssignmentExpression","name":"x","condition":"","value":"x + i"},{"line":6,"type":"ReturnStatement","name":"","condition":"","value":"x"}]'
        );
    });

    it('is resolving for loop with (;;) condition notation incorrectly', () => {
        let code = 'function test(){\n' +
            'let x = 3;\n' +
            'for(;;){\n' +
            'x = x+i;\n' +
            '}\n' +
            'return x;\n' +
            '}';
        assert.equal(
            JSON.stringify(resolveCode(code)),
            '[{"line":1,"type":"FunctionDeclaration","name":"test","condition":"","value":""},{"line":2,"type":"VariableDeclaration","name":"x","condition":"","value":"3"},{"line":3,"type":"ForStatement","name":"","condition":"; ; ","value":""},{"line":4,"type":"AssignmentExpression","name":"x","condition":"","value":"x + i"},{"line":6,"type":"ReturnStatement","name":"","condition":"","value":"x"}]'
        );
    });

    it('is resolving for loop with (; condition) condition notation incorrectly', () => {
        let code = 'function binarySearch(X, V, n){\n' +
            'let i = 0;\n' +
            'let len = cars.length;\n' +
            'for (; i < len; ) { \n' +
            'i++;\n' +
            '}\n' +
            'return i;\n' +
            '}';
        assert.equal(
            JSON.stringify(resolveCode(code)),
            '[{"line":1,"type":"FunctionDeclaration","name":"binarySearch","condition":"","value":""},{"line":1,"type":"VariableDeclaration","name":"X","condition":"","value":""},{"line":1,"type":"VariableDeclaration","name":"V","condition":"","value":""},{"line":1,"type":"VariableDeclaration","name":"n","condition":"","value":""},{"line":2,"type":"VariableDeclaration","name":"i","condition":"","value":"0"},{"line":3,"type":"VariableDeclaration","name":"len","condition":"","value":"cars.length"},{"line":4,"type":"ForStatement","name":"","condition":"; i < len; ","value":""},{"line":5,"type":"AssignmentExpression","name":"","condition":"","value":"i++"},{"line":7,"type":"ReturnStatement","name":"","condition":"","value":"i"}]'
        );
    });

});
