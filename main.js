var langs = {
    "bf": "interpBF",
    "brainfuck": "interpBF",
    "slashes": "interpSlashes",
    "js": "interpJS",
    "javascript": "interpJS",
    "calc": "interpJS",
    "muck": "interpMuck",
    "underload": "interpUnderload",
    "stack": "interpStack",
    "tio": "interpTIO",
}

var interp;

function defaultInterp(lang) {
    console.error(`Lang [${lang}] in hash not found. Defaulting to brainfuck.`);
    return "interpBF";
}

function setInterp(lang) {
    interp = eval(langs[lang] || defaultInterp(lang));
    document.getElementById('output').innerHTML = '';
    interp(document.getElementById("input").value);
    // Commenting/Uncommenting this line toggles whether to display a title
    // document.getElementById("title").innerHTML = langs[lang] || defaultInterp(lang);
}

function init() {
    lang = window.location.hash.slice(1);
    setInterp(lang);
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