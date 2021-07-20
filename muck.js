

function muck(code, input) {
    console.log(code);
    var tape = new Array(30000).fill(0); 
    var mods = new Array(30000).fill(0); 
    var ptr = 0; var inputIndex = 0;
    var output = '';

    function logMuck() {
        var debug = '';
        var curr;
        for (var i = 0; i < 5; i++) {
            var subZero = (n,s)=>n? n:s;
            var modIt = n=>n%256;
            var toPad = subZero(modIt(tape[i]), '_');
            curr = String(toPad).padStart(3, ' ');
            if (i == ptr) { curr += '*'; }
            else { curr += ' '; }
            debug += curr + '    ';
            // debug += subZero(mods[i], ' ')+' '+curr + '    ';
        }
        return debug;
    }

    function logMods() {
        var debug = '';
        var curr;
        for (var i = 0; i < 5; i++) {
            var subZero = (n,s)=>n? n:s;
            var modIt = n=>n%256;
            var toPad = subZero(modIt(mods[i]), '_');
            curr = String(toPad).padStart(3, ' ');
            if (i == ptr) { curr += '%'; }
            else { curr += ' '; }
            debug += curr + '    ';
        }
        return debug; 
    }


    function logMuckWithHTML() {
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
        
    function modCell(cell) {
        var modZero = mods[ptr]?mods[ptr]:256;
        return (cell+modZero)%modZero;
    }
    
    // false = tape; true = mods
    var debugType = false;
    var bf2js = "function compile() {"
    for (const c of code) {
        if (c == "+") { bf2js += "tape[ptr]++;"; }
        if (c == "-") { bf2js += "tape[ptr]--;"; }
        if (c == ">") { bf2js += "ptr++;"; }
        if (c == "<") { bf2js += "ptr--;"; }
        if (c == ",") { bf2js += "tape[ptr] = input.codePointAt(inputIndex);"; }
        if (c == ".") { bf2js += "output += String.fromCodePoint(tape[ptr]);"; }
        if (c == "[") { bf2js += "while (modCell(tape[ptr])) {"; }
        if (c == "]") { bf2js += "}"; }
        if (c == "^" || c=="∧") { bf2js += "mods[ptr]++;"; }
        if (c == "v" || c=="∨") { bf2js += "mods[ptr]--;"; }
        if (c =="!") { bf2js += "debugType ^= true;" }
    }
    bf2js += "return [output, debugType? logMods(): logMuck()];} compile();"
    return eval(bf2js);
}


function interpMuck(input) {
        
    var inp = document.getElementById('input').value;
    var out = document.getElementById('output');
    var o = document.getElementById('progOut');

    var stdin = document.getElementById("progInp").value;
    
    var lines = input.split('\n');
    // console.log(lines);
    var acc = "";
    var result;
    for (line of lines) {
        acc += line;
        var [output, state] =  muck(acc, stdin);
        if (line == '' || line.includes('\\') || !/[\+\-\.\>\<\,\[\]\#\^v\!]/.test(line)) {result='';}
        else {result = state;}
        out.innerHTML+=result+'\n';
        o.value = output;
        
    }
}