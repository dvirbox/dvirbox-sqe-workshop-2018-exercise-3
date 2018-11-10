/* eslint-disable max-lines-per-function,complexity */
import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {resolveElements} from './code-analyzer';

$(document).ready(function () {

    $('#codeSubmissionButton').click(() => {

        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        let resolvedCode = resolveElements(parsedCode); /*this is the module!*/
        var html =
            '<table border=1 id="result" width="600">' +
                '<col width="60">' +
                '<col width="180">' +
                '<tr>' +
                    '<th>Line</th>' +
                    '<th>Type</th>' +
                    '<th>Name</th>' +
                    '<th>Condition</th>' +
                    '<th>Value</th>' +
                '</tr>';
        for (var i = 0; i < resolvedCode.length; i++) {
            const codeElement = resolvedCode[i];
            html += generateRow(codeElement.line, codeElement.type, codeElement.name, codeElement.condition, codeElement.value);
        }
        html+='</table>' + generateStyle();
        document.getElementById('myTable').innerHTML = html;
    });
});
function generateRow(line,type,name,cond,val){
    return `<tr><td>${line}</td><td>${type}</td><td>${name}</td><td>${cond}</td><td>${val}</td></tr>`;
}
function generateStyle(){
    return `<style>
        #result {
            font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
            border-collapse: collapse;
            width: 100%;
        }

        #result td, #result th {
            border: 1px solid #ddd;
            padding: 8px;
        }

        #result tr:nth-child(even) {
            background-color: #f2f2f2;
        }

        #result tr:hover {
            background-color: #ddd;
        }
        #result tr td:nth-child(1),
        tr td:nth-child(3),
        tr td:nth-child(4),
        tr td:nth-child(5)
         { /* I don't think they are 0 based */
            text-align: center;
        }
        #result th {
            padding-top: 12px;
            padding-bottom: 12px;
            text-align: center;
            background-color: #008faf;
            color: white;
        }</style>`;
}
