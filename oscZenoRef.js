
var strNaN = "NaN";
var strInf = "Infinity";
var oscError; "ERROR";
var strEmpty = "";
var strMore = '&#9660;';
var strLess = '&#9650;';
// input string length limit
var maxLength = 14;

// ****** GLOBAL VAR *********************************************************
// operation code
var opCode = 0;
// stack memory register
var stackVal = 0;
// user memory register
var memVal = 0;
// flag to clear input box on data pre-entry
var boolClear = true;
// calculator state: normal or expanded
var oscExtState = false;

// manual
var oscManual = "http://www.examiner.com/online-learning-in-new-york/zeno";
var delOpen = 5000;
function InitRefPage() { tmrOnLoad = setTimeout(StartWindowOpen, delOpen); }
function StartWindowOpen() {
    window.open(oscManual, 'oscManualPage', 'fullscreen=1, scrollbars=1'); self.focus();
}
window.onload = InitRefPage;

// doc
var oscDoc = "http://www.examiner.com/online-learning-in-new-york/zeno-doc";
var BM = 2; // button middle
var BR = 3; // button right
function mouseDown(e) {
    try { if (event.button == BM || event.button == BR) { return false; } }
    catch (e) { if (e.which == BR) { return false; } }
}
document.oncontextmenu = function () {
    window.open(oscDoc, 'oscDocPage', 'fullscreen=1, scrollbars=1'); return false;
} 
document.onmousedown = mouseDown;

// ***********************************************************************************