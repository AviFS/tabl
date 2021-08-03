async function tio(prog, inp) {
    var lang = "slashes";
    return TIO.run(prog, inp, lang);
}

async function interpTIO(input) {
        
    var inp = document.getElementById('input').value;
    var out = document.getElementById('output');
    var o = document.getElementById('progOut');

    var stdin = document.getElementById("progInp").value;
    
    var lines = input.split('\n');
    var acc = "";
    var result;
    for (line of lines) {
        acc += line;
        var runner =  await tio(acc, stdin);
        if (line == '') {result='';}
        else {result = runner.log;}
        out.innerHTML+=result+'\n';
        o.value = runner.output;
    }
}