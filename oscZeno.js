
$(document).ready(function () {

    // ON LOAD ********************************************
    $("div.oscExtControl").fadeTo(1000, 0.25,
    function () { $("div.oscExtControl").fadeTo(1000, 1.00); });
    //
    $("div.oscExtPanel").slideToggle("fast");
    $("div.oscStackRegister").slideToggle("normal");

    // SHOW STACK REGISTER CONTENT and OpCode *********************************
    $("div.oscStackControl").mouseover(function () {
        var ctl = $("div.oscStackRegister");
        var op = "";
        if (opCode == 1) op = " +";
        else if (opCode == 2) op = " -";
        else if (opCode == 3) op = " *";
        else if (opCode == 4) op = " /";
        ctl.html(stackVal + op);
        ctl.show(300);
    })
    .mouseout(function () { $("div.oscStackRegister").hide(); })
    .mouseleave(function () { $("div.oscStackRegister").hide(); });

    // close stack register div
    $("div.oscStackRegister").click(function ()
    { $("div.oscStackRegister").hide(); });
    $(this).click(function () { $("div.oscStackRegister").hide(); });

    // CLEAR MEM ON CLICK
    $("div.oscMemLabel").click(function ()
    { $(keyPad_Mem).val(strEmpty); memVal = 0; });

    // TOGGLE EXT PANEL ON CLICK
    $("div.oscExtControl").click(function () {
        var ctl = $(this);
        $("div.oscExtPanel").slideToggle("fast", function () {
            oscExtState = !oscExtState;
            if (oscExtState) ctl.html(strLess); else ctl.html(strMore);
        });
    });

    //************************************************************************
    // DATA ENTRY: NUMERIC KEYS
    $("div#keyPad button.keyPad_btnNumeric").click(function () {
        var btnVal = $(this).html();
        var inBox = $(keyPad_UserInput);

        // clear input box if flag set
        if (boolClear) { inBox.val(strEmpty); boolClear = false; }
        var str = inBox.val();

        // limit the input length
        if (str.length > maxLength) return;

        // prevent duplicate dot entry
        if (this.id == "keyPad_btnDot" && str.indexOf('.') >= 0) return;
        inBox.val(str + btnVal);
        inBox.focus();
    });

    // CONST DATA ENTRY *******************************************************
    $("button.keyPad_btnConst").click(function () {
        var retVal = strEmpty;
        switch (this.id) {
            // PI                                    
            case 'keyPad_btnPi': retVal = Math.PI; break;
            // PI/2                                    
            case 'keyPad_btnPiDiv2': retVal = Math.PI / 2; break;
            // PI/3                                    
            case 'keyPad_btnPiDiv3': retVal = Math.PI / 3; break;
            // PI/4                                    
            case 'keyPad_btnPiDiv4': retVal = Math.PI / 4; break;
            // PI/6                                    
            case 'keyPad_btnPiDiv6': retVal = Math.PI / 6; break;
            // e                                    
            case 'keyPad_btnE': retVal = Math.E; break;
            // 1/e                                    
            case 'keyPad_btnInvE': retVal = 1 / Math.E; break;
            // SQRT(2)                                    
            case 'keyPad_btnSqrt2': retVal = Math.SQRT2; break;
            // SQRT(3)                                    
            case 'keyPad_btnSqrt3': retVal = Math.sqrt(3); break;
            // CUBE ROOT OF(3)                                    
            case 'keyPad_btnCubeRoot2': retVal = Math.pow(2, 1 / 3); break;
            // Ln(10)                                    
            case 'keyPad_btnLn10': retVal = Math.LN10; break;
            // base10: Log(e)                                    
            case 'keyPad_btnLgE': retVal = Math.LOG10E; break;
            // Sigmas: defects probability: on scale 0...1                                     
            // 1 Sigma                                    
            case 'keyPad_btnSigma': retVal = 0.69; break;
            // 3 Sigma                                     
            case 'keyPad_btnSigma3': retVal = 0.007; break;
            // 6 Sigma                                     
            case 'keyPad_btnSigma6': retVal = 3.4 * Math.pow(10, -6); break;
            default: break;
        }
        boolClear = true;
        $(keyPad_UserInput).val(retVal);
        inputBox.focus();
    });

    // BINARY OPERATION KEY ***************************************************
    $("div#keyPad button.keyPad_btnBinaryOp").click(function () {
        var inBox = $(keyPad_UserInput);
        var newOpCode = 0;

        // validate: string cannot start w/operation symbol
        if (inBox.val().indexOf('-') >= 0) return;
        if (inBox.val().indexOf('+') >= 0) return;
        if (inBox.val().indexOf('*') >= 0) return;
        if (inBox.val().indexOf('÷') >= 0) return;

        switch (this.id) {
            case 'keyPad_btnPlus': newOpCode = 1; break;
            case 'keyPad_btnMinus': newOpCode = 2; break;
            case 'keyPad_btnMult': newOpCode = 3; break;
            case 'keyPad_btnDiv': newOpCode = 4; break;
            case 'keyPad_btnYpowX': newOpCode = 5; break;
            case 'keyPad_btnPercent':
                if (opCode == 1 || opCode == 2)
                { inBox.val(stackVal * parseFloat(inBox.val()) / 100); }
                else if (opCode == 3 || opCode == 4)
                { inBox.val(parseFloat(inBox.val()) / 100); }
                else return;
                break;
            default: break;
        }
        if (opCode) { oscBinaryOperation(); }
        else { stackVal = parseFloat(inBox.val()); boolClear = true; }
        opCode = newOpCode;
        inBox.focus();
    });

    // BINARY COMPUTATION *****************************************************
    function oscBinaryOperation() {
        var inBox = $(keyPad_UserInput);
        var x2 = parseFloat(inBox.val());

        switch (opCode) {
            case 1: stackVal += x2; break;
            case 2: stackVal -= x2; break;
            case 3: stackVal *= x2; break;
            case 4: stackVal /= x2; break;
            // stack power inputBox              
            case 5: stackVal = Math.pow(stackVal, x2); break;
            default: break;
        }
        inBox.val(stackVal);
        boolClear = true;
        inBox.focus();
    }

    // UNARY OPERATIONS *******************************************************
    $("button.keyPad_btnUnaryOp").click(function () {
        var inputBox = $(keyPad_UserInput);
        var x = parseFloat(inputBox.val());
        var retVal = oscError;

        switch (this.id) {
            // +/-                                 
            case 'keyPad_btnInverseSign': retVal = -x; break;
            // 1/X                                 
            case 'keyPad_btnInverse': retVal = 1 / x; break;
            // X^2                                 
            case 'keyPad_btnSquare': retVal = x * x; break;
            // SQRT(X)                                 
            case 'keyPad_btnSquareRoot': retVal = Math.sqrt(x); break;
            // X^3                                 
            case 'keyPad_btnCube': retVal = x * x * x; break;
            // POW (X, 1/3)                                 
            case 'keyPad_btnCubeRoot': retVal = Math.pow(x, 1 / 3); break;
            // NATURAL LOG                                 
            case 'keyPad_btnLn': retVal = Math.log(x); break;
            // LOG BASE 10                                 
            case 'keyPad_btnLg': retVal = Math.log(x) / Math.LN10; break;
            // E^(X)                                 
            case 'keyPad_btnExp': retVal = Math.exp(x); break;
            // SIN                                 
            case 'keyPad_btnSin': retVal = Math.sin(x); break;
            // COS                                 
            case 'keyPad_btnCosin': retVal = Math.cos(x); break;
            // TAN                                 
            case 'keyPad_btnTg': retVal = Math.tan(x); break;
            // CTG                                 
            case 'keyPad_btnCtg': retVal = 1 / Math.tan(x); break;

            // Arcsin                                
            case 'keyPad_btnAsin': retVal = Math.asin(x); break;
            // Arccos                                
            case 'keyPad_btnAcos': retVal = Math.acos(x); break;
            // Arctag                                
            case 'keyPad_btnAtan': retVal = Math.atan(x); break;

            // Secant                                
            case 'keyPad_btnSec': retVal = 1 / Math.cos(x); break;
            // Cosecant                                
            case 'keyPad_btnCosec': retVal = 1 / Math.sin(x); break;

            // sinh                                  
            case 'keyPad_btnSinH':
                retVal = (Math.pow(Math.E, x) - Math.pow(Math.E, -x)) / 2; break;
            // cosh                                  
            case 'keyPad_btnCosinH':
                retVal = (Math.pow(Math.E, x) + Math.pow(Math.E, -x)) / 2; break;
            // coth                                  
            case 'keyPad_btnTgH':
                retVal = (Math.pow(Math.E, x) - Math.pow(Math.E, -x));
                retVal /= (Math.pow(Math.E, x) + Math.pow(Math.E, -x));
                break;
            // Secant hyperbolic                                 
            case 'keyPad_btnSecH':
                retVal = 2 / (Math.pow(Math.E, x) + Math.pow(Math.E, -x)); break;
            // Cosecant hyperbolic                                 
            case 'keyPad_btnCosecH':
                retVal = 2 / (Math.pow(Math.E, x) - Math.pow(Math.E, -x)); ; break;
            // 1+x                                
            case 'keyPad_btnOnePlusX': retVal = 1 + x; break;
            // 1-x                                
            case 'keyPad_btnOneMinusX': retVal = 1 - x; break;
            default: break;
        }
        boolClear = true;
        inputBox.val(retVal);
        inputBox.focus();
    });


    // ************************************************************************
    // COMMAND BUTTONS: BACKSPACE, CLEAR AND ALL CLEAR
    $("div#keyPad button.keyPad_btnCommand").click(function () {
        var inBox = $(keyPad_UserInput);
        var mem = $(keyPad_Mem);
        var strInput = inBox.val();
        switch (this.id) {
            // on enter calculate the result, clear opCode                 
            case 'keyPad_btnEnter':
                inBox.val(oscBinaryOperation()); opCode = 0; inBox.focus(); return;
                // clear input box (if not empty) or opCode          
            case 'keyPad_btnClr':
                if (strInput == strEmpty) { opCode = 0; boolClear = false; }
                else { inBox.val(strEmpty); }
                break;
            // clear the last char if input box is not empty                         
            case 'keyPad_btnBack': if (strInput.length > 0) {
                    inBox.val(strInput.substring(0, strInput.length - 1)); break;
                }
                // clear all          
            case 'keyPad_btnAllClr':
                inBox.val(strEmpty);
                stackVal = strEmpty;
                mem.val(strEmpty);
                opCode = 0;
                break;
            default: break;
        }
    });

    // MEMORY OPERATIONS ****************************************************************
    $("div#keyPad button.keyPad_btnMemOp").click(function () {
        var inBox = $(keyPad_UserInput);
        var mem = $(keyPad_Mem);

        try {
            memValNumeric = parseFloat(mem.val());
        }
        catch (ex)
        { memVal = strEmpty; mem.val(strEmpty); return; }


        switch (this.id) {
            // move to mem and clear input box                         
            case 'keyPad_btnToMem': mem.val(inBox.val()); inBox.val(strEmpty); break;
            // copy to input box, but do not clear ithe memory                         
            case 'keyPad_btnFromMem': inBox.val(mem.val()); break;
            // add to mem     
            case 'keyPad_btnMemPlus':
                memVal += parseFloat(inBox.val()); mem.val(memVal); boolClear = true; break;
            // subtract from mem      
            case 'keyPad_btnMemMinus':
                memVal -= parseFloat(inBox.val()); mem.val(memVal); boolClear = true; break;
            default: break;
        }
    });

    // CLEAR MEM BOX BY CLICKING ON IT
    $("div#keyPad input.keyPad_TextBox").click(function () {
        var inBox = $(keyPad_UserInput);
        var mem = $(keyPad_Mem);

        switch (this.id) {
            //case 'keyPad_UserInput': $(keyPad_UserInput).val(strEmpty); break;               
            case 'keyPad_Mem': $(keyPad_Mem).val(strEmpty); memVal = 0; break;
            default: break;
        }
    });
})
// ***********************************************************************************