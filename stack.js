function stack(prog) {
    var curr;
    var stack = [];
    function monadic(op) {
        var a = stack.pop();
        stack.push(op(a));
    }
    function dyadic(op) {
        var a = stack.pop();
        var b = stack.pop()
        stack.push(op(a,b));
    }
    while (prog!='') {
        curr = prog.slice(0,1);
        prog = prog.slice(1);
        if ('0123456789'.includes(curr)) { stack.push(Number(curr)); }
        if (curr == '+') { dyadic((a,b)=>a+b)}
        if (curr == '-') { dyadic((a,b)=>a-b)}
        if (curr == '*') { dyadic((a,b)=>a*b)}
        if (curr == '/') { dyadic((a,b)=>a/b)}
        if (curr == '_') { monadic((a)=>-a)}
    }     
    console.log(stack.join(','));
    return stack.reverse().join(' ');//{out': '', 'log': Array(stack).join(' ')};
}

function interpStack(input) {
    
    var inp = document.getElementById('input').value;
    var out = document.getElementById('output');
    
    lines = input.split('\n');

    var stdin = document.getElementById("progInp").value;

    var acc = "";
    var result;
    for (line of lines) {
        acc += line;
        if (line=="") { result = ""; }
        else { result = stack(acc+stdin); }
        out.innerHTML+=result+'\n';
    }
}