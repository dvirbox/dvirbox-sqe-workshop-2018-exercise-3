import $ from 'jquery';
import {parseCode, generateGraphModules} from './code-analyzer';

import Viz from 'viz.js';
import {Module, render} from 'viz.js/full.render.js';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        const codeToResolve = $('#codePlaceholder').val();
        const args =  $('#argsPlaceholder').val() ;
        const parsedCode = parseCode(codeToResolve);
        const parsedArgs = parseCode(args);
        const cfgModules = generateGraphModules(parsedCode, parsedArgs); /*This is the module*/
        const dot = `digraph cfg { forcelabels=true\n ${cfgModules.join('')} }`;
        const viz = new Viz({Module, render});

        const graphPlaceHolder = document.getElementById('result');
        viz.renderSVGElement(dot)
            .then(function (element) {
                graphPlaceHolder.innerHTML = '';
                graphPlaceHolder.append(element);
            });
    });
});


