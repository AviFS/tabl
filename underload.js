/* FROM: https://esolangs.org/wiki/Underload
~ : (x) (y) — (y) (x)
    Swap the top two elements of the stack.
: : (x) — (x) (x)
    Duplicate the top element of the stack.
! : (x) —
    Discard the top element of the stack.
* : (x) (y) — (xy)
    Concatenate the top element of the stack to the end of the second element of the stack.
(x) : — (x)
    Push everything between the ( and the matching ) on top of the stack.
a : (x) — ((x))
    Enclose the top element of the stack in a pair of parentheses.
^ : (x) — x
    When the ^ command is called, include the top element of the stack into the program rather than the stack, immediately after the ^ command, ready to be run next; this effectively pops the stack.
S : (x) —
    Output the top element of the stack, popping it.
*/

function underload(prog) {
    var errors = 0;
    function checkPop(n) {
      if (stack.length >= n) { return true; }
      console.log(`Error: Tried to pop ${n} elems from stack with ${stack.length} elems`)
      errors++;
      return false;
    }
  
    prog = Array.from(prog);
    var curr;
    var out = '';
    var stack = [];

    const MAX_ITERS = 2560;
    var iters = 0;

    while (prog!='') {
        iters++;
        if (iters > 2560) { console.log("Exceeded MAX_ITERS: " + MAX_ITERS + "."); errors++; return 0; }
        // I think prog is just being shifted/unshifted. Maybe reverse it and use pop/push instead?
        curr = prog.shift();
        console.log(curr);
        if (curr=='~') { if (checkPop(2)) { console.log(1999); var a = stack.pop(); var b = stack.pop(); stack.push(a); stack.push(b); }}
        if (curr==':') { if (checkPop(1)) { var a = stack.pop(); stack.push(a); stack.push(a); }}
        if (curr=='!') { if (checkPop(1)) { stack.pop(); }}
        if (curr=='*') { if (checkPop(2)) { var a = stack.pop(); var b = stack.pop(); stack.push(String(a)+String(b)); }} // a+b or b+a?
        if (curr=='a') { if (checkPop(1)) { var a = stack.pop(); stack.push("("+String(a)+")"); }}
        if (curr=='^') { if (checkPop(1)) { var a = stack.pop(); prog.unshift(a); }}
        if (curr=='S') { if (checkPop(1)) { var a = stack.pop(); out+=a; }}
        if (curr==')') { console.log("Error: Unmatched ')'"); errors++; }
        if (curr=='(') {
          // FROM: https://github.com/graue/esofiles/blob/master/underload/underload.html
            var t1,i,n;
            i=0; n=1;
            prog = prog.join('');
            console.log(prog);
            while(n) {
              if(prog.substr(i,1)==')') n--;
              if(prog.substr(i,1)=='(') n++;
              i++;
              if(i>prog.length) { prog = ''; break; /*console.log("Error: Unmatched (");*/ }
            }
            t1=prog.substr(0,i-1);
            prog=prog.substr(i);
            stack.push(t1);
          }
          prog = Array.from(prog);
        // ORIGINAL: haven't gotten it to work
        // assumes they haven't finished typing yet, so we don't want to start throwing errors
        // eg while typing (abcd) or (String) you'd get errors or weird output for the 'a' and 'S' which would be intepreted literally
        //   if (!prog.includes(')')) { break; } 
        //   else {
        //     console.log(323);
        //     var parens = ''; // string in parens
        //     var nesting = 1; // nesting level
        //     // TODO: This won't output errors for something like `(sd(sd)`
        //     while (prog!='' || parens[parens.length-1]!=')' && nesting <= 0) {
        //       parens += prog.shift();console.log(parens);
        //       if (parens[parens.length-1]==')') { nesting--; }
        //       if (parens[parens.length-1]=='(') { nesting++; }
        //     }
        //     stack.push(parens.slice(0,-1));
        //   }
        // }
    }
    function logStack() {
      // Pretty print list
      /*
      var log = '["';
      while (stack.length>1) { log+=stack.pop(); log+='", "'; }
      log+=stack.pop(); log += '"]';
      */
      var log = '';
      while (stack.length>1) { log+=stack.pop(); log+=' '; }
      if (stack.length>0) { log+=stack.pop(); }
      // Add '?' for errors
      log = errors==0? log: ('?'.repeat(errors)) + ' ' + log;
      return log;
    }
    
    return {'output': out, 'log': logStack()};
}


function interpUnderload(input) {

    var inp = document.getElementById('input').value;
    var out = document.getElementById('output');
    var o = document.getElementById('progOut');

    var stdin = document.getElementById("progInp").value;

    var lines = input.split('\n');

    var acc = "";
    var result;
    for (line of lines) {
        acc += line;
        var runner =  underload(acc);
        console.log(runner);
        if (line == '' || !/[~:!*()a^S]/.test(line)) {result='';}
        else {result = runner.log;}
        out.innerHTML+=result+'\n';
        o.value = runner.output;
    }
}