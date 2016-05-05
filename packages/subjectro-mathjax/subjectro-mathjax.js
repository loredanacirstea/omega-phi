// Write your package code here!

// Variables exported by this module can be imported by other packages and
// applications. See subjectro-mathjax-tests.js for an example of importing.
export const name = 'subjectroMathjax';

subjectroMathjax = {}
var marked, renderer, ans, out, pos2=0;
var editor, edit1, edit2, preview1, preview2, edit, preview

Template.subjectroMathjaxEditor.onRendered(function() {
  $('head').append('<script src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-MML-AM_SVG"></script>')
  $('head').append('<script src="ASCIIMathML.js"></script>')
  $('head').append("<script type='text/x-mathjax-config'>MathJax.Hub.Config({asciimath2jax: {delimiters: [['`','`']]}});MathJax.Hub.Typeset();</script>");

  preview1 = document.getElementById("preview1")
  preview2 = document.getElementById("preview2")
  edit1= document.getElementById("editor1")
  edit2 = document.getElementById("editor2")

  
  edit1.onkeyup= function(e){
    preview1.innerHTML=  "`"+edit1.value+"`";
    MathJax.Hub.Typeset();
    edit1.focus();
    edit = edit1
    preview = preview1
  }
  edit1.onclick = function(e) {
    edit = edit1
    preview = preview1
  }
  edit2.onclick = function(e) {
    edit = edit2
    preview = preview2
  }
  edit2.onkeyup= function(e){
    preview2.innerHTML=  "`"+edit2.value+"`";
    MathJax.Hub.Typeset();
    edit2.focus();
    edit = edit2
    preview = preview2
  }

  $('#mathjaxEditorHiddenIni').on('change', function(e) {
    var t = $(e.currentTarget)
    var msy = t.data('msy')
    var mfr = t.data('mfr')
    $('#editor1').val(msy)
    $('#editor2').val(mfr)
    preview1.innerHTML=  "`"+msy+"`";
    preview2.innerHTML=  "`"+mfr+"`";
    MathJax.Hub.Typeset();
    edit2.focus();
    edit = edit2
    preview = preview2
  })

  show_keys("keys")
})

Template.subjectroMathjaxEditor.events({
    'click #subjectroMathjaxEditorSave': function(e) {
        $('#mathjaxEditorHidden').data('msy', edit1.value)
        $('#mathjaxEditorHidden').data('mfr', edit2.value)
        $('#mathjaxEditorHidden').trigger('change')
    }
})


function reset(){
    editor.setValue("")
    pos2=0
    preview1.innerHTML=  ""
    preview2.innerHTML=  ""

    MathJax.Hub.Typeset();
    editor.focus();
}

function insertAtCursor(myField, myValue) {
    //IE support
    if (document.selection) {
        myField.focus();
        sel = document.selection.createRange();
        sel.text = myValue;
    }
    //MOZILLA and others
    else if (myField.selectionStart || myField.selectionStart == '0') {
        var startPos = myField.selectionStart;
        var endPos = myField.selectionEnd;
        myField.value = myField.value.substring(0, startPos)
            + myValue
            + myField.value.substring(endPos, myField.value.length);
        myField.selectionStart = startPos + myValue.length;
        myField.selectionEnd = startPos + myValue.length;
    } else {
        myField.value += myValue;
    }
}



var keys = {
    operations: [
        {label: "+", code: " + ", code2: " + ", vars: []},
        {label: "-", code: " - ", code2: " - ",vars: []},
        {label: "*", code: " * ", code2: ' \\cdot ',vars: []},
        {label: "/", code: " {}/{} ", code2: ' \\frac {}{} ',vars: []},
        {label: "**", code: " ** ", code2: " * ",vars: []},
        {label: "***", code: " *** ", code2: " \\star ",vars: []},
        {label: "//", code: " // ", code2: ' \\diagup ', vars: []},
        {label: "\\", code: " \\ ", code2: ' \\diagdown ', vars: []},
        {label: "xx", code: " xx ", code2: " \\times ",vars: []},
        {label: "-:", code: " -: ", code2: " \\div ",vars: []},
        {label: "@", code: " @ ", code2: " \\circ ",vars: []},
        {label: "o+", code: " o+ ", code2: " \\oplus ",vars: []},
        {label: "ox", code: " ox ", code2: " \\otimes ",vars: []},
        {label: "o.", code: " o. ", code2: " \\odot ",vars: []},
        {label: "sum", code: " sum_{i=1}^{n} ", code2: " \\sum_{i=1}^{n} ",vars: []},
        {label: "prod", code: " prod_{i=1}^{n} ", code2: " \\prod_{i=1}^{n} ",vars: []},
        {label: "^^", code: " ^^ ", code2: " \\wedge ",vars: []},
        {label: "^^^", code: " ^^^ ", code2: " \\bigwedge ",vars: []},
        {label: "vv", code: " vv ", code2: " \\vee ",vars: []},
        {label: "vvv", code: " vvv ", code2: " \\bigvee ",vars: []},
        {label: "nn", code: " nn ", code2: " \\cap ",vars: []},
        {label: "nnn", code: " nnn ", code2: " \\bigcap ",vars: []},
        {label: "uu", code: " uu ", code2: " \\cup ",vars: []},
        {label: "uuu", code: " uuu ", code2: " \\bigcup ",vars: []}
        
    ],
    symbols: [
        {label: "int", code: " int {:d x:} ", code2: " \\int ",vars: []},
        {label: "int_{a}^{b}", code:" int_{a}^{b}  {:d x:} ", code2: " \\int_{a}^{b} ", vars:[]},
        {label: "oint", code: " oint ", code2: " \\oint ",vars: []}, 
        {label: "oint_{a}^{b}", code: " oint ", code2: " \\oint_{a}^{b} ",vars: []},
        {label: "del", code: " del ", code2: " \\partial ",vars: []},
        {label: "grad", code: " grad ", code2: " \\triangledown ",vars: []},
        {label: "+-", code: " +- ", code2: " \\pm ",vars: []},
        {label: "O/", code: " O/ ", code2: " \\varnothing ",vars: []},
        {label: "oo", code: " oo ", code2: " \\infty ",vars: []},
        {label: "aleph", code: " aleph ", code2: " \\aleph ",vars: []},
        {label: "/_", code: " /_ ", code2: " \\angle ",vars: []},
        {label: ":.", code: " :. ", code2: " \\therefore ",vars: []},
        {label: ".:", code: " because ", code2: " \\because ",vars: []},
        {label: "...", code: " ... ", code2: " ... ",vars: []},
        {label: "cdots", code: " cdots ", code2: " \\cdots ",vars: []},
        {label: "vdots", code: " vdots ", code2: " \\vdots ",vars: []},
        {label: "ddots", code: " ddots ", code2: " \\ddots ",vars: []},
        {label: "\ ", code: " \  ", code2: " \  ",vars: []},
        {label: "quad", code: " quad ", code2: " \\quad ",vars: []},
        {label: "triangle", code: " triangle ", code2: " \\triangle ",vars: []},
        {label: "square", code: " square ", code2: " \\square ",vars: []},
        {label: "diamond", code: " diamond ", code2: " \\diamond ",vars: []},
        {label: "|__", code: " |__ ", code2: " \\lfloor ",vars: []},
        {label: "__|", code: " __| ", code2: " \\rfloor ",vars: []},
        {label: "|~", code: " |~ ", code2: " \\lceil ",vars: []},
        {label: "~|", code: " ~| ", code2: " \\rceil ",vars: []},
        {label: "CC", code: " CC ", code2: " \\mathbb{C} ",vars: []},
        {label: "NN", code: " NN ", code2: " \\mathbb{N} ",vars: []},
        {label: "QQ", code: " QQ ", code2: " \\mathbb{Q} ",vars: []},
        {label: "RR", code: " RR ", code2: " \\mathbb{R} ",vars: []},
        {label: "ZZ", code: " ZZ ", code2: " \\mathbb{Z} ",vars: []},
    ],
    relation: [
        {label: "=", code: " = ", code2: " = ",vars: []},
        {label: "!=", code: " != ", code2: " \\ne ",vars: []},
        {label: "&lt;", code: " &lt; ", code2: " &lt; ",vars: []},
        {label: "&gt;", code: " &gt; ", code2: " &gt; ",vars: []},
        {label: "&lt;=", code: " &lt;= ", code2: " \\leq ",vars: []},
        {label: "&gt;=", code: " &gt;= ", code2: " \\geq ",vars: []},
        {label: "-&lt;", code: " -&lt; ", code2: " \\prec ",vars: []},
        {label: "&gt;-", code: " &gt;- ", code2: " \\succ ",vars: []},
        {label: "in", code: " in ", code2: " \\in ",vars: []},
        {label: "!in", code: " !in ", code2: " \\notin ",vars: []},
        {label: "sub", code: " sub ", code2: " \\subset ",vars: []},
        {label: "sup", code: " sup ", code2: " \\supset ",vars: []},
        {label: "sube", code: " sube ", code2: " \\subseteq ",vars: []},
        {label: "supe", code: " supe ", code2: " \\supseteq ",vars: []},
        {label: "-=", code: " -= ", code2: " \\equiv ",vars: []},
        {label: "~=", code: " ~= ", code2: " \\cong ",vars: []},
        {label: "~~", code: " ~~ ", code2: " \\approx ",vars: []},
        {label: "prop", code: " prop ", code2: " \\propto ",vars: []},
        {label: "stackrel(+)(->)", code: " stackrel(+)(->) ", code2: " \\stackrel{+}{\\rightarrow}  ",vars: []}
    ],
    greek: [
        {label: "alpha", code: " alpha ", code2: " \\alpha ",vars: []},
        {label: "beta", code: " beta ", code2: " \\beta ",vars: []},
        {label: "chi", code: " chi ", code2: " \\chi ",vars: []},
        {label: "delta", code: " delta ", code2: " \\delta ",vars: []},
        {label: "epsilon", code: " epsilon ", code2: " \\epsilon ",vars: []},
        {label: "varepsilon", code: " varepsilon ", code2: " \\varepsilon ",vars: []},
        {label: "eta", code: " eta ", code2: " \\eta ",vars: []},
        {label: "gamma", code: " gamma ", code2: " \\gamma ",vars: []},
        {label: "iota", code: " iota ", code2: " \\iota ",vars: []},
        {label: "kappa", code: " kappa ", code2: " \\kappa ",vars: []},
        {label: "lambda", code: " lambda ", code2: " \\lambda ",vars: []},
        {label: "mu", code: " mu ", code2: " \\mu ",vars: []},
        {label: "nu", code: " nu ", code2: " \\nu ",vars: []},
        {label: "omega", code: " omega ", code2: " \\omega ",vars: []},
        {label: "phi", code: " phi ", code2: " \\phi ",vars: []},
        {label: "varphi", code: " varphi ", code2: " \\varphi ",vars: []},
        {label: "pi", code: " pi ", code2: " \\pi ",vars: []},
        {label: "psi", code: " psi ", code2: " \\psi ",vars: []},
        {label: "rho", code: " rho ", code2: " \\rho ",vars: []},
        {label: "sigma", code: " sigma ", code2: " \\sigma ",vars: []},
        {label: "tau", code: " tau ", code2: " \\tau ",vars: []},
        {label: "theta", code: " theta ", code2: " \\theta ",vars: []},
        {label: "vartheta", code: " vartheta ", code2: " \\vartheta ",vars: []},
        {label: "upsilon", code: " upsilon ", code2: " \\upsilon ",vars: []},
        {label: "xi", code: " xi ", code2: " \\xi ",vars: []},
        {label: "zeta", code: " zeta ", code2: " \\zeta ",vars: []},

    //],
    //greekCaps: [
        {label: "Delta", code: " Delta ", code2: " \\Delta ",vars: []},
        {label: "Gamma", code: " Gamma ", code2: " \\Gamma ",vars: []},
        {label: "Lambda", code: " Lambda ", code2: " \\Lambda ",vars: []},
        {label: "Omega", code: " Omega ", code2: " \\Omega ",vars: []},
        {label: "Phi", code: " Phi ", code2: " \\Phi ",vars: []},
        {label: "Pi", code: " Pi ", code2: " \\Pi ",vars: []},
        {label: "Psi", code: " Psi ", code2: " \\Psi ",vars: []},
        {label: "Sigma", code: " Sigma ", code2: " \\Sigma ",vars: []},
        {label: "Theta", code: " Theta ", code2: " \\Theta ",vars: []},
        {label: "Xi", code: " Xi ", code2: " \\Xi ",vars: []}
    ],
    logical: [
        {label: "and", code: " and ", code2: " \\& ",vars: []},
        {label: "or", code: " or ", code2: " \\| ",vars: []},
        {label: "not", code: " not ", code2: " \\neg ",vars: []},
        {label: "=&gt;", code: " =&gt; ", code2: " \\Rightarrow ",vars: []},
        {label: "if", code: " if ", code2: " if ",vars: []},
        {label: "iff", code: " iff ", code2: " \\iff ",vars: []},
        {label: "AA", code: " AA ", code2: " \\forall ",vars: []},
        {label: "EE", code: " EE ", code2: " \\exists ",vars: []},
        {label: "_|_", code: " _|_ ", code2: " \\bot ",vars: []},
        {label: "TT", code: " TT ", code2: " \\intercal ",vars: []},
        {label: "preceq", code: " preceq ", code2: " \\preceq ",vars: []},
        {label: "approx", code: " approx ", code2: " \\approx ",vars: []},
        {label: "cong", code: " cong ", code2: " \\cong ",vars: []},
        {label: "equiv", code: " equiv ", code2: " \\equiv ",vars: []},
        {label: "propto", code: " propto ", code2: " \\propto ",vars: []},
        
        {label: "prec", code: " prec ", code2: " \\prec ",vars: []},
        {label: "succ", code: " succ ", code2: " \\succ ",vars: []},
        {label: "succeq", code: " succeq ", code2: " \\succeq ",vars: []},
        {label: "|--", code: " |-- ", code2: " * ",vars: []},
        {label: "|==", code: " |== ", code2: " * ",vars: []},
    //],
    //brackets: [
        {label: "(", code: " ( ", code2: " \\left( ",vars: []},
        {label: ")", code: " ) ", code2: " \\right) ",vars: []},
        {label: "[", code: " [ ", code2: " \\left[ ",vars: []},
        {label: "]", code: " ] ", code2: " \\right] ",vars: []},
        {label: "{", code: " { ", code2: " \\left\\{ ",vars: []},
        {label: "}", code: " } ", code2: " \\right\\} ",vars: []},
        {label: "(:", code: " (: ", code2: " \\langle ",vars: []},
        {label: ":)", code: " :) ", code2: " \\rangle ",vars: []},
        {label: "{:", code: " {: ", code2: " * ",vars: []},
        {label: ":}", code: " :} ", code2: " * ",vars: []}
    ],
    arrows: [
        {label: "uarr", code: " uarr ", code2: " \\uparrow ",vars: []},
        {label: "darr", code: " darr ", code2: " \\downarrow ",vars: []},
        {label: "rarr", code: " rarr ", code2: " \\rightarrow ",vars: []},
        {label: "-&gt;", code: " -&gt; ", code2: " \\rightarrow ",vars: []},
        {label: "|-&gt;", code: " |-&gt; ", code2: " \\mapsto ",vars: []},
        {label: "larr", code: " larr ", code2: " \\leftarrow ",vars: []},
        {label: "harr", code: " harr ", code2: " \\leftrightarrow ",vars: []},
        {label: "rArr", code: " rArr ", code2: " \\Rightarrow ",vars: []},
        {label: "lArr", code: " lArr ", code2: " \\Leftarrow ",vars: []},
        {label: "hArr", code: " hArr ", code2: " \\Leftrightarrow ",vars: []}
    ],
    trigonometry: [
        {label: "sin", code: " sin ", code2: " \\sin ",vars: []},
        {label: "cos", code: " cos ", code2: " \\cos ",vars: []},
        {label: "tan", code: " tan ", code2: " \\tan ",vars: []},
        {label: "csc", code: " csc ", code2: " \\csc ",vars: []},
        {label: "sec", code: " sec ", code2: " \\sec ",vars: []},
        {label: "cot", code: " cot ", code2: " \\cot ",vars: []},
        {label: "arcsin", code: " arcsin ", code2: " \\arcsin ",vars: []},
        {label: "sinh", code: " sinh ", code2: " \\sinh ",vars: []},
        {label: "arccos", code: " arccos ", code2: " \\arccos ",vars: []},
        {label: "cosh", code: " cosh ", code2: " \\cosh ",vars: []},
        {label: "arctan", code: " arctan ", code2: " \\arctan ",vars: []},
        {label: "tanh", code: " tanh ", code2: " \\tanh ",vars: []},
        {label: "sech", code: " sech ", code2: " * ",vars: []},
        {label: "csch", code: " csch ", code2: " * ",vars: []},
        {label: "coth", code: " coth ", code2: " \\coth ",vars: []},
    ],
    functions: [
        {label: "log", code: " log_{10} x ", code2: " \\log_{10}{x} ",vars: []},
        {label: "ln", code: " ln ", code2: " \\ln  ",vars: []},
        {label: "det", code: " det ", code2: " \\det  ",vars: []},
        {label: "dim", code: " dim ", code2: " \\dim ",vars: []},
        {label: "lim", code: " lim_{x -&gt; oo} ", code2: " \\lim_{x \\rightarrow \\infty } ",vars: []},
        {label: "mod", code: " mod ", code2: " \\bmod ",vars: []},
        {label: "gcd", code: " gcd ", code2: " \\gcd ",vars: []},
        {label: "lcm", code: " lcm ", code2: " * ",vars: []},
        {label: "min", code: " min ", code2: " \\min ",vars: []},
        {label: "max", code: " max ", code2: " \\max ",vars: []},
        {label: "lub", code: " lub ", code2: " * ",vars: []},
        {label: "glb", code: " glb ", code2: " * ",vars: []},
        {label: "sqrt(x)", code: " sqrt{} ", code2: " \\sqrt{} ",vars: []},
        {label: "root(n)(x)", code: " root(n)(x) ", code2: " \\sqrt[n]{x} ",vars: []},
        {label: "abs(x)", code: " abs(x) ", code2: " | x | ",vars: []},
    ],
    constants: [
        {label: "pi", code: " pi ", code2: " \\pi ",vars: []},
        {label: "c", code: " c ", code2: " c ",vars: []},
        {label: "e", code: " e ", code2: " e ",vars: []},
        {label: "barh", code: " bar h ", code2: " \\hbar ",vars: []},
        {label: "lambda", code: " lambda ", code2: " \\lambda ",vars: []},
        {label: "mu", code: " mu ", code2: " \\mu ",vars: []},
    //],
    //accents: [
        {label: "hat x", code: " hat ", code2: " \\hat ",vars: [{x: "x"}]},
        {label: "bar x", code: " bar ", code2: " \\bar ",vars: []},
        {label: "ul x", code: " ul ", code2: " \\ul ",vars: []},
        {label: "vec x", code: " vec ", code2: " \\vec ",vars: []},
        {label: "tilde x", code: " tilde ", code2: " \\tilde ",vars: []},
        {label: "dot x", code: " dot ", code2: " \\dot ",vars: []},
        {label: "ddot x", code: " ddot ", code2: " \\ddot ",vars: []}
        
    ],
    construct: [
        {label: "[[a,b],[c,d]]", code: " [[a,b],[c,d]] ", code2: " \\begin{bmatrix}a_{11}&a_{12}\\\\a_{21}&a_{22}\\end{bmatrix}  ",vars: []},
        {label: "((1,0),(0,1))", code: " ((1,0),(0,1)) ", code2: " \\begin{pmatrix}a_{11}&a_{12}\\\\a_{21}&a_{22}\\end{pmatrix}  ",vars: []},
        {label: "x_2", code: " x_2 ", code2: " x_2 ",vars: []},
        {label: "x^2", code: " x^2 ", code2: " x^2 ",vars: []},
        {label: "{:d x:}", code: " {:d x:} ", code2: " {\\mathrm{d} x} ",vars: []},
        {label: "{d}/{dx}", code: " {d}/{dx} ", code2: " \\frac{\\text{d}}{\\text{dx}} ",vars: []},
        {label: "{d^2}/{dx^2}", code: " {d^2}/{dx^2} ", code2: " \\frac{d^2}{dx^2} ",vars: []},
        
        {label: "{partial }/{partial x}", code: " {partial }/{partial x} ", code2: " \\frac{\\partial }{\\partial x} ",vars: []},
        {label: "bowtie", code: " bowtie ", code2: " \\bowtie ",vars: []},
        {label: "langle", code: " langle ", code2: " \\langle ",vars: []},
        {label: "rangle", code: " rangle ", code2: " \\rangle ",vars: []},
        
    ],
    
    fonts: [
        {label: 'bb "Text"', code: ' bb "Text" ', code2: " \\bf Text ",vars: [{txt:"Text"}]},
        {label: 'bbb "Text"', code: ' bbb "Text" ', code2: " * ",vars: [{txt:"Text"}]},
        {label: 'cc "Text"', code: ' cc "Text" ', code2: " \\mathcc{Text} ",vars: [{txt:"Text"}]},
        {label: 'tt "Text"', code: ' tt "Text" ', code2: " * ",vars: [{txt:"Text"}]},
        {label: 'fr "Text"', code: ' fr "Text" ', code2: " * ",vars: [{txt:"Text"}]},
        {label: 'sf "Text"', code: ' sf "Text" ', code2: " * ",vars: [{txt:"Text"}]}
    ],
    design: [
        {label: "color{#050}{x}", code: " color{#050}{x} ", code2: " \\color{#050}{x} ",vars: []},
        {label: "color{maroon}{x}", code: " color{maroon}{x} ", code2: " \\color{maroon}{x} ",vars: []},
        
    ]
        
}

function show_keys(el_id){
    var el = document.getElementById(el_id)
    var out=""
    for (ndx in keys){
        for (ndx2 in keys[ndx]){
            out = out+"<button style='font-size:large' onclick=\"subjectroMathjax.oper('"+ndx+"',"+ndx2+")\">`"+keys[ndx][ndx2].label+"`</button>"
        }
        out=out+"<br>"
    }
    el.innerHTML = out
}

subjectroMathjax.oper = function oper(ndx1,ndx2){
    //if (edit2.matches(":focus")) {
        insertAtCursor(edit, keys[ndx1][ndx2].code.substring(1))
        //pos2 = pos2+keys[ndx1][ndx2].code2.length -1
   // } else {
        //editor.insert(keys[ndx1][ndx2].code.substring(1))
        //if (document.getElementById("sync").checked) edit2.value=edit2.value+keys[ndx1][ndx2].code2.substring(1)
    //}
    
    preview.innerHTML=  "`"+edit.value+"`";
    MathJax.Hub.Typeset();
    edit.focus();
}

