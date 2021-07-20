var langs = {
    "bf": "interpBF",
    "brainfuck": "interpBF",
    "slashes": "interpSlashes",
    "js": "interpJS",
    "javascript": "interpJS",
    "calc": "interpJS",
}

var interp;

function init() {
    var def = "interpBF"; // default interpreter
    interp = eval(langs[window.location.hash.slice(1)] || def);
    interp(document.getElementById("input").value);
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