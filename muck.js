

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
    bf2js += "return [output, debugType? logMods(tape, ptr): logMuck(tape, ptr)];} compile();"
    return eval(bf2js);
}

function altmuck(code, input) {
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

    var tape = new Array(30000).fill(0); 
    var mods = new Array(30000).fill(0); 
    var ptr = 0; var inputIndex = 0;
    var output = '';
    var bracks = [];
    var logType = false;
    currLoopIterations = 0;
    for (var i = 0; i < code.length; i++) {
        var c = code[i];
        if (c == "+") { tape[ptr]++; }
        if (c == "-") { tape[ptr]--; }
        if (c == ">") { ptr++; }
        if (c == "<") { ptr--; }
        if (c == ",") { output += input.codePointAt(inputIndex); inputIndex++; }
        if (c == ".") { output += String.fromCodePoint(tape[ptr]); }
        if (c == "^") { mods[ptr]++; }
        if (c == "v") { mods[ptr]--; }
        if (c == "!") { logType ^= true; }
        if (c == "[") { bracks.push(i); }
        if (c == "]") {
            if (bracks.length == 0) { console.log("Mismatched brackets: Unmatched ']' at index "+i+"."); }
            else {
                if (tape[ptr] == 0) {
                    currLoopIterations = 0;
                    bracks.pop();
                }
                // One less than a multiple of 256. It's 256*5-1
                // That way, a loop like [<+>] won't change the state. It'll just loop back around
                else if (currLoopIterations > 1279) {
                    currLoopIterations = 0;
                    bracks.pop();
                    console.log(`You passed 1279 iterations at index ${i}. Exiting to prevent infinite loop.`)
                }
                else {
                    i = bracks.pop()-1; // i = ...-1 makes up for the i++ in the for loop
                    currLoopIterations++;
                }
            }
        }

        tape[ptr]+=256; tape[ptr]%=256; // takes care of negatives, eg -1 -> 255
    }

    // for (const b of bracks) { console.log("Mismatched brackets: Unmatched '[' at index "+i+"."); }
    return {"output": output, "tape": tape, "ptr": ptr, "log": logType? logMods(): logMuck()};
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
        var runner =  altmuck(acc, stdin);
        if (line == '' || line.includes('\\') || !/[\+\-\.\>\<\,\[\]\#\^v\!]/.test(line)) {result='';}
        else {result = runner.log;}
        out.innerHTML+=result+'\n';
        o.value = runner.output;
        
    }
}