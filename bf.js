/*

BF should work within a loop
It should not freeze
And it should print the values of the loop the first time around

*/

/*
Input in upper left corner
Output in upper right corner

window.location.hash.slice(1)
There could be a feature to toggle where when you ouput
it makes a little bubble to the left of that line with the output text in it
*/



/*
You can set it to not print anything by defualt
You can toggle whether it prints with #
eg if it's a commnet nad you hav # it prints
if it's turned ouff by defualt and you have 3 inc doe, it turns  on
*/


function logBFWithHTML(tape, ptr) {
    var asterisk = true;
    var num =  5;
    var debug = '';
    var curr;
    for (var i = 0; i < num; i++) {
        curr = tape[i].toString().padStart(3, ' ');
        if (tape[i] == 0) { curr = "<span class='zero'>"+curr+"</span>"; }
        if (i == ptr) { curr = "<span class='ptr'>"+curr+(asterisk?'*':' ')+"</span>"; }
        else { curr += ' '; }
        debug += curr + '    ';
    }
    return debug;
}

function logBF(tape, ptr) {
    var debug = '';
    var curr;
    for (var i = 0; i < 5; i++) {
        curr = tape[i].toString().padStart(3, ' ');
        if (i == ptr) { curr += '*'; }
        else { curr += ' '; }
        if (curr=="  0 ") { curr = '  _ '; }
        if (curr=="  0*") { curr = '  _*'; }
        debug += curr + '    ';
    }
    return debug;
}

function bf(code, input) {
    var tape = new Array(30000).fill(0); 
    var ptr = 0; var inputIndex = 0;
    var output = '';

    var bf2js = "function compile() {"
    for (const c of code) {
        if (c == "+") { bf2js += "tape[ptr]++;"; }
        if (c == "-") { bf2js += "tape[ptr]--;"; }
        if (c == ">") { bf2js += "ptr++;"; }
        if (c == "<") { bf2js += "ptr--;"; }
        if (c == ",") { bf2js += "tape[ptr] = input.codePointAt(inputIndex);"; }
        if (c == ".") { bf2js += "output += String.fromCodePoint(tape[ptr]);"; }
        if (c == "[") { bf2js += "while (tape[ptr]) {"; }
        if (c == "]") { bf2js += "}"; }
        bf2js += "tape[ptr]=(tape[ptr]+256)%256;";
    }
    bf2js += "return [output, logBF(tape, ptr)];} compile();"
    return eval(bf2js);
}


function interpBF(input) {
        
    var inp = document.getElementById('input').value;
    var out = document.getElementById('output');
    var o = document.getElementById('progOut');

    var stdin = document.getElementById("progInp").value;
    
    var lines = input.split('\n');
    var acc = "";
    var result;
    for (line of lines) {
        acc += line;
        var [output, state] =  bf(acc, stdin);
        if (line == '' || line.includes('\\') || !/[\+\-\.\>\<\,\[\]\#]/.test(line)) {result='';}
        else {result = state;}
        out.innerHTML+=result+'\n';
        o.value = output;
        
    }
}
