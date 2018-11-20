

import $ from 'jquery';
import {resolveCode} from './code-analyzer';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        const codeToResolve = $('#codePlaceholder').val();
        const args =  $('#argsPlaceholder').val() ;
        const resolvedCode = resolveCode(codeToResolve, args); /*This is the module*/
        const html = handleModules(resolvedCode);
        document.getElementById('result').innerHTML = html;
    });
});

function handleModules(modules){
    const reducer = (acc, codeRow) => {
        return acc.concat(codeRow) + '<br>';
    };
    return modules.reduce(reducer, []);
}
//
// function fixRowSpaces(rowStr){
//     return rowStr.replace(/(\()+\s/g, '(')
//         .replace(/( \))+\s/g, ')')
//         .replace(/(\[)+\s/g, '[')
//         .replace(/( ])+\s/g, ']');
//     // .replace(/,+\s+/g, ', ');
//     // return rowStr
//     //     .replace(/]\s+\[/g, '][') //remove spaces between brackets
//     //     .replace(/,+\s+/g, ', ') // remove space between elements in array
//     //     .replace(/\s+\]/g, ']') // remove spaces before close bracket
//     //     .replace(/\[+?\s+/g, '['); // remove spaces before open bracket
// }



