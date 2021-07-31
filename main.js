var langs = {
    "bf": "interpBF",
    "brainfuck": "interpBF",
    "slashes": "interpSlashes",
    "js": "interpJS",
    "javascript": "interpJS",
    "calc": "interpJS",
    "muck": "interpMuck",
    "underload": "interpUnderload",
}

var interp;

function defaultInterp(lang) {
    console.error(`Lang [${lang}] in hash not found. Defaulting to brainfuck.`);
    return "interpBF";
}

function init() {
    langHash = window.location.hash.slice(1);
    interp = eval(langs[langHash] || defaultInterp(langHash));
    interp(document.getElementById("input").value);
    document.getElementById("title").innerHTML = langs[langHash] || defaultInterp(langHash);
}

function onInput() {

var inp = document.getElementById('input').value;
var out = document.getElementById('output');
    //out.innerHTML=interp(inp);
    out.innerHTML='';
    interp(inp);

}

function interpJS(input) {
    
var inp = document.getElementById('input').value;
var out = document.getElementById('output');

    lines = input.split('\n');
    // console.log(lines);
    var result;
    for (line of lines) {
        try {
            result=eval(line);
        }
        catch (err) {
            result='?';
        }
        console.log(result);
        if (result == undefined) result='';
        out.innerHTML+=result+'\n';
    }
}