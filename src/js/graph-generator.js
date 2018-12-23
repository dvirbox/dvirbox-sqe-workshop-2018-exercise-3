import * as escodegen from 'escodegen';
import * as esgraph from 'esgraph';
import {parseCode} from './code-analyzer';

export {initEnvironment, resolveParams, generateGraph, generateDotGraph, resolveElements};
// resolveAssignmentExpression, resolveBinaryExpression ,resolveIdentifier,
// resolveLiteral, resolveMemberExpression, chainEnv, resolveUpdateExpression,
// resolveVariableDeclaration,resolveProgram,resolveExpressionStatement,resolveSequenceExpression,
// resolveBlockStatement,getKey,isTruePathAndValid, markPath,generateNodes,initArrayNodes,
// initReturnNodeContext,initWhileNodeContext,resolveUnaryExpression, resolveElements,
// resolveExpression,getShape,pushNode,shouldHandleNeighbor,pushEdge};

function resolveArrayExpression(parsedArrExpr, environment) {
    return eval('[' +
        parsedArrExpr.elements.map(element =>
            JSON.stringify(resolveElements(element, environment))).join(',') +
        ']');
}

function resolveAssignmentExpression(parsedAssExpr, environment) {
    const left = parsedAssExpr.left;
    const right = parsedAssExpr.right;
    let key = getKey(left);
    if (left.type === 'MemberExpression') {
        environment[key][left.property.value]= resolveElements(right, environment);
    }else{
        environment[key] = resolveElements(right, environment);
    }
    return true;
}

function resolveBinaryExpression(parsedBinaryExpression, environment) {
    const left = resolveElements(parsedBinaryExpression.left, environment);
    const right = resolveElements(parsedBinaryExpression.right, environment);
    const op = parsedBinaryExpression.operator;
    return eval(JSON.stringify(left) + op + JSON.stringify(right));
}

function resolveIdentifier(parsedIdentifier, environment) {
    return environment[parsedIdentifier.name];
}

function resolveLiteral(parsedLiteral) {
    return parsedLiteral.value;
}

function resolveMemberExpression(parsedMemberExpression, environment) {
    const objectName = parsedMemberExpression.object.name;
    if(!(objectName in environment)){
        return eval(resolveExpression(parsedMemberExpression));
    }else{
        const name = environment[parsedMemberExpression.object.name];
        const property = parsedMemberExpression.property.value;
        return eval(JSON.stringify(name) + '[' + property + ']');
    }
}

function chainEnv(token, env, argument){
    let acc = '';
    Object.keys(env).forEach(function(key) {
        acc += 'let ' + key + '=' + JSON.stringify(env[key]) + ';';
    });
    return argument ? acc + token + ';' + argument : acc + token;
}

function resolveUpdateExpression(parsedUpdateExpression, environment){
    const argument = parsedUpdateExpression.argument;
    const value = eval(chainEnv(resolveExpression(parsedUpdateExpression), environment, resolveExpression(argument)));
    let key = getKey(argument);
    if (argument.type === 'MemberExpression') {
        environment[key][argument.property.value] = value;
    }else{
        environment[key] = value;
    }
    return true;
}

function resolveVariableDeclaration(parsedDeclarations, environment) {
    const declarations = parsedDeclarations.declarations;
    declarations.map((declaration) => {
        const name = resolveExpression(declaration.id);
        const init = declaration.init ? resolveElements(declaration.init, environment) : 'null';
        environment[name] = init;
    });
    return true;
}

function resolveProgram(parsedProgram, environment){
    return resolveElements(parsedProgram.body, environment);
}

function resolveExpressionStatement(parsedExpressionStatement, environment){
    return resolveElements(parsedExpressionStatement.expression, environment);
}

function resolveSequenceExpression(parsedSequenceExpression, environment){
    const expressions = parsedSequenceExpression.expressions;
    return expressions.map(expression => resolveElements(expression, environment));
}

function resolveBlockStatement(parsedBlockStatements, environment) {
    const blockStatements = parsedBlockStatements.body;
    blockStatements.forEach(function(statement){
        resolveElements(statement, environment);
    });
    return true;
}

function resolveParams(parsedArgs, environment) {
    let params = [];
    if (parsedArgs.body.length > 0) {
        const resolvedParams = resolveElements(parsedArgs.body[0], environment);
        return Array.isArray(resolvedParams) ? resolvedParams : [resolvedParams];
    }
    return params;
}

function getKey(parsedElement){
    const key = (parsedElement.type === 'ArrayExpression' || parsedElement.type === 'MemberExpression') ?
        parsedElement.object.name :
        parsedElement.name;
    return key;
}

function initEnvironment(parsedCode, paramsValues, environment) {
    const program = parsedCode.body[0];
    let params = program.params;
    for (let i = 0; i < params.length; i++) {
        const key = getKey(params[i]);
        environment[key] = paramsValues[i];
    }
    return environment;
}
function isTruePathAndValid(parsedLabel,environment){//}, curr){
    return resolveElements(parsedLabel, environment);
    // return !(curr.green && curr.parent.type === 'WhileStatement') && resolveElements(parsedLabel, environment);
}

function markPath(nodesArray, environment){
    let curr = nodesArray[0];
    const isNotLastNode = curr => curr.normal || curr.true || curr.false;
    while (isNotLastNode(curr)) {
        const parsedLabel = parseCode(curr.label);
        curr.green = true;
        if (curr.normal) {
            parsedLabel.body.map(element => resolveElements(element, environment));
            //Array.isArray(parsedLabel.body) ? parsedLabel.body.map(element => resolveElements(element, environment)) : resolveElements(parsedLabel, environment);
            curr = curr.normal;
        }
        else if (isTruePathAndValid(parsedLabel.body[0],environment, curr)) {
            curr = curr.true;
        } else {

            curr = curr.false;
        }
    }
    curr.green = true;
}
function generateGraph(parsedCode, environment) {
    const functionProgram = parsedCode.body[0];
    const functionBody = functionProgram.body;
    const nodesArray = generateNodes(functionBody);
    markPath(nodesArray, environment);
    return nodesArray;
}

function generateNodes(parsedFunction) {
    const checkNodeSpecialCases = currNode => !currNode.normal.circle && !currNode.normal.isWhile;
    const checkNodeBasicCases = currNode => currNode.normal && currNode.normal.normal && currNode.normal.next.length > 0;
    let nodesArray = initArrayNodes(parsedFunction);
    for (let i = 0; i < nodesArray.length; i++) {
        let currNode = nodesArray[i];
        if (checkNodeBasicCases(currNode) && checkNodeSpecialCases(currNode)){
            nodesArray.splice(nodesArray.indexOf(currNode.normal), 1);
            currNode.label = currNode.label + '\n' + currNode.normal.label;
            currNode.next = currNode.normal.next;
            currNode.normal = currNode.normal.normal;
            i--;
        }
    }
    return nodesArray;
}

function initArrayNodes(parsedFunction){
    const nodesIndex = 2;
    const firstNode = 0;
    let nodesArray = esgraph(parsedFunction)[nodesIndex];
    nodesArray = nodesArray.slice(1, nodesArray.length - 1); // remove entry and exit nodes
    nodesArray[firstNode].prev = []; //set first node
    initReturnNodeContext(nodesArray);
    initWhileNodeContext(nodesArray);
    nodesArray.map(node => node.label= resolveExpression(node.astNode));
    return nodesArray;
}

function initReturnNodeContext(nodesArray){
    const returnNodes = nodesArray.filter(node => node.astNode.type === 'ReturnStatement');
    const updateFalse = (pred, retNode, emptyNode) =>{pred.false = emptyNode;};
    // const updateTrue = (pred, retNode, emptyNode) => pred.true === retNode ? pred.true = emptyNode : false;
    const updateNormal = (pred, retNode, emptyNode) => pred.normal === retNode ? pred.normal = emptyNode : false;
    returnNodes.forEach(node => {
        node.next = [];
        delete node.normal;
        if(node.prev.length > 1){
            const emptyNode = {astNode: { type: 'Literal', value: '', raw: ''}, next: [node], normal: node, parent: node.parent, prev: node.prev ,circle: true};
            node.prev = emptyNode;
            emptyNode.prev.forEach(predecessor => {
                predecessor.next[predecessor.next.indexOf(node)] = emptyNode;
                updateNormal(predecessor, node, emptyNode) || updateFalse(predecessor, node, emptyNode);// ||  updateTrue(predecessor, node, emptyNode);
            });
            nodesArray.push(emptyNode);
        }
    });
}

function initWhileNodeContext(nodesArray){
    const returnNodes = nodesArray.filter(node => node.parent.type === 'WhileStatement');
    returnNodes.forEach(node => {
        const nullNode = {astNode: { type: 'Literal', value: null, raw: ''}, label: 'NULL', next: [node], normal: node, parent: node.parent, prev: node.prev ,isWhile: true};
        node.prev = nullNode;
        nullNode.prev.forEach(predecessor => {predecessor.next[predecessor.next.indexOf(node)] = nullNode; predecessor.normal = nullNode;});
        nodesArray.push(nullNode);
    });
}

function resolveUnaryExpression(parsedUnaryExpression, environment) {
    return eval(chainEnv(resolveExpression(parsedUnaryExpression), environment));
}

function resolveElements(parsedCode, environment){
    const typeToResolverMapping = {
        Program: resolveProgram,
        AssignmentExpression: resolveAssignmentExpression,
        BinaryExpression: resolveBinaryExpression,
        VariableDeclaration: resolveVariableDeclaration,
        BlockStatement: resolveBlockStatement,
        ExpressionStatement: resolveExpressionStatement,
        LogicalExpression: resolveBinaryExpression,
        ArrayExpression: resolveArrayExpression,
        Identifier: resolveIdentifier,
        Literal: resolveLiteral,
        MemberExpression: resolveMemberExpression,
        UpdateExpression: resolveUpdateExpression,
        SequenceExpression: resolveSequenceExpression,
        UnaryExpression: resolveUnaryExpression,
    };
    let resolver = typeToResolverMapping[parsedCode.type];
    return resolver ? resolver.call(undefined, parsedCode, environment) : '';
}

function resolveExpression(parsedCode){
    return escodegen.generate(parsedCode).trim()
        .replace(/\n/g, '')
        .replace(/\s\s+/g, ' ')
        .replace(/\[\s+/g, '[');
}


//**   this part is used for creating dot graph   **//
function getShape(currSubject) {
    let ans;
    if (currSubject.true || currSubject.false) {
        ans = 'diamond';
    }else if(currSubject.circle){
        ans = 'circle';
    }else{
        ans = 'rectangle';
    }
    return ans;
}

function pushNode(nodes, currSubject) {
    const label = (currSubject.circle) ? 'label=""' :
        (currSubject.isWhile) ? `label="${currSubject.label}"` :
            `label="-${currSubject.index}-\n ${currSubject.label}"`; //, xlabel = ${currSubject.index}`;
    const shape = getShape(currSubject);
    const color = (currSubject.green) ? 'green' : 'white';
    nodes.push(`n${currSubject.index} [${label}, shape=${shape}, style = filled, fillcolor = ${color}];\n`);
}

function shouldHandleNeighbor(neighbor, toCheck){
    return !neighbor.handeld && !toCheck.includes(neighbor);
}

function pushEdge(edges, currSubject, toCheck, n) {
    const setNeighborIndex = neighbor => neighbor.circle ? 0 : neighbor.isWhile ? (1000) : ++n;
    const types = ['normal', 'false', 'true'];
    for (const type of types) {
        const neighbor = currSubject[type];
        if (!neighbor){
            continue;
        }
        if(shouldHandleNeighbor(neighbor, toCheck)){
            toCheck.push(neighbor);
            neighbor.index = setNeighborIndex(neighbor);
        }
        const label = (['false', 'true'].includes(type)) ? `[label="${type.charAt(0).toUpperCase()}"]` : '';
        edges.push(`n${currSubject.index} -> n${neighbor.index} ${label};\n`);
    }
    return n;
}

function generateDotGraph(graphNodes){
    let edges = [];
    let nodes = [];
    // if(graphNodes.length > 0){
    let toCheck =[graphNodes[0]];
    let currSubject = toCheck[0];
    let n = 1;
    currSubject.index = n;
    while(toCheck.length > 0) {
        currSubject = toCheck.shift();
        currSubject.handeld = true;
        pushNode(nodes, currSubject);
        n = pushEdge(edges, currSubject, toCheck, n);
    }
    // }
    return nodes.concat(edges);
}

//**   this part is used for creating dot graph   **//