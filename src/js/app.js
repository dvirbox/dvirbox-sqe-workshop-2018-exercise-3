

import $ from 'jquery';
import {resolveCode} from './code-analyzer';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToResolve = $('#codePlaceholder').val();
        let resolvedCode = resolveCode(codeToResolve); /*This is the module*/
        let html = generateTableHeader();

        for (let i = 0; i < resolvedCode.length; i++) {
            const codeElement = resolvedCode[i];
            html += generateRow(codeElement.line, codeElement.type, codeElement.name, codeElement.condition, codeElement.value);
        }
        html+='</table>';
        document.getElementById('myTable').innerHTML = html;
    });
});

function generateRow(line,type,name,cond,val){
    return `<tr><td>${line}</td><td>${type}</td><td>${name}</td><td>${fixString(cond)}</td><td>${fixString(val)}</td></tr>`;
}

function generateTableHeader(){
    return '<table border=1 id="result" width="600">' +
        '<col width="60">' +
        '<col width="180">' +
        '<tr>' +
        '<th>Line</th>' +
        '<th>Type</th>' +
        '<th>Name</th>' +
        '<th>Condition</th>' +
        '<th>Value</th>' +
        '</tr>';
}

function fixString(str){
    return str.replace(/[&]|[&&]|[<>]/g,
        function (m) {
            return {
                '&': '&amp',
                '&&': '&amp&amp',
                '<' : '&lt',
                '>' : '&gt',
            }[m];
        });
}
