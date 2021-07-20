
function onInput() {

var inp = document.getElementById('input').value;
var out = document.getElementById('output');
    //out.innerHTML=interp(inp);
    out.innerHTML='';
    interp(inp);

}

/*
function interp(input) {
    
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

*/