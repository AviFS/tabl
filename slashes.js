function slash(prog) {
    var all = "<span class='inputPost'>Input:</span> <span class='input'>"+prog+'</span><br>';
    var res = "";
    var print = "";
    var state = 0;
    var pattern = "";
    var replacement = "";

    function doSomething() {
        curr = prog[0];
        if (state == 0) { print += curr; }
        if (state == 1) { pattern += curr; }
        if (state == 2) { replacement += curr; }
    }

    function logPrint() {
        // all += "<span class='printPost'>Print:<span> " + print + "<br>";
    }

    function logApply() {
        // all += "<span class='applyPost'>Apply:</span> " + 
        //         "<span class='slash'>/</span>"          + "<span class='pattern'>"     +   pattern   + "</span>" +
        //         "<span class='slash'>/</span>"          + "<span class='replacement'>" + replacement + "</span>" + 
        //         "<span class = 'slash'>/</span>"        + prog + "<br>";
    }

    while (prog) {
        console.log(prog);
    var curr = prog[0];
    // all += prog + '\n';
        // console.log(pattern);
        // Just for displaying
        if (state == 1 && print!="") { logPrint(); res += print; print = ""; }
        if (state == 3) {
            var isVerbose = false;
            while (prog.includes(pattern)) {
            prog = prog? prog.replace(pattern, replacement) : prog;
            // Just `prog = prog.replace(pat, rep);` might be good enough
            // Was trying to get rid of the null character that was printing
            // Thought maybe the replacement with an empty string pattern was undefined
            if (isVerbose) { logApply(); }
            }
            if (!isVerbose) { logApply(); }
            pattern = ""; replacement = "";
            state = 0;
            console.log(curr);
        }
        else {
            if (curr == '\\') { prog = prog.slice(1); doSomething(); }
            else if (curr == '/') { state++; }
            else { doSomething(); }
            prog = prog.slice(1);
        }
    }
    // In case program ended in state 0 and there's still stuff to be printed
    if (print!="") { logPrint(); res += print; print = ""; }
    return res;

}



function interp(input) {
    
    var inp = document.getElementById('input').value;
    var out = document.getElementById('output');
    
    lines = input.split('\n');

    var stdin = document.getElementById("progInp").value;

    var acc = "";
    var result;
    for (line of lines) {
        acc += line;
        if (line=="") { result = ""; }
        else { result = slash(acc+stdin); }
        out.innerHTML+=result+'\n';
    }
}