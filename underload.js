// FROM: https://cdn.rawgit.com/graue/esofiles/7ca16941/underload/underload.html
// Released to the public domain.
var s= {'value': ''};//document.getElementById('stack');
var p='';//document.getElementById('prog');
var p = {'value': 'UNDEFINED: SHOULD BE PASSED AS PARAMETER.'};
var o= {'value': ''};//document.getElementById('op');

var startrun = 'none';//document.getElementById('startrun').style.display="none";
var stoprun='block';//document.getElementById('stoprun').style.display="block";

function pop(s)
{
  if(s.value.indexOf("<>")==-1) {throw("ERROR: Empty stack");}
  var t=s.value.substr(0,s.value.indexOf("<>"));
  s.value=s.value.substr(s.value.indexOf("<>")+2);
  return t;
}
function push(s,t)
{
  s.value=t+"<>"+s.value;
}
function step(lp, p)
{
    s= {'value': ''};//document.getElementById('stack');
    o= {'value': ''};//document.getElementById('op')
try {
  if(lp)
  {

  }

  var c=p.value.substr(0,1);
  if(p.value=="") throw("Program terminated normally.");
  p.value=p.value.substr(1);
  if(c=='S') o.value+=pop(s);
  else if(c=='~') {var t1, t2; t1=pop(s); t2=pop(s); push(s,t1); push(s,t2);}
  else if(c==':') {var t1; t1=pop(s); push(s,t1); push(s,t1);}
  else if(c=='!') pop(s);
  else if(c=='*') {var t1, t2; t1=pop(s); t2=pop(s); push(s,t2+t1);}
  else if(c=='a') {var t1; t1=pop(s); push(s,"("+t1+")");}
  else if(c=='^') p.value=pop(s)+p.value;
  else if(c==')') throw("ERROR: Unmatched )");
  else if(c=='(')
  {
    var t1,i,n;
    i=0; n=1;
    while(n)
    {
      if(p.value.substr(i,1)==')') n--;
      if(p.value.substr(i,1)=='(') n++;
      i++;
      if(i>p.value.length) throw("ERROR: Unmatched (");
    }
    t1=p.value.substr(0,i-1);
    p.value=p.value.substr(i);
    push(s,t1);
  }
  else if(c=='<') throw("Program stopped by user."); // abort of program
  else throw("ERROR: Unrecognized command");
  if(lp) window.setTimeout("step("+lp+")",lp);
}
catch(s)
{
  console.log(s);i
  startrun = 'block';
  stoprun = 'block';
//   document.getElementById('startrun').style.display="block";
//   document.getElementById('stoprun').style.display="none";
}
return {'output': o.value, 'log': s.value.slice(0,-2)};
}
function abortrun()
{
  p.value='<'+p.value;
}
function unl2ul()
{
  var v=new Array();
  var vi=0;
  var o="";
  var c;
  while(p.value!="")
  {
    c=p.value.substr(0,1);
    p.value=p.value.substr(1);
    if(c=='`') v[vi++]=0;
    if(c=='.') {o+='.'; c=p.value.substr(0,1); p.value=p.value.substr(1);}
    else if(c=='`') continue;
    o+=c;
    while(1)
    {
      if(v[vi-1]) {o+='`'; vi--;}
      else {v[vi-1]=1; break;}
    }
  }
  while(vi>0) {o+='`'; vi--;}
  while(o!="")
  {
    c=o.substr(0,1);
    o=o.substr(1);
    if(c=='`') p.value+='~^';
    if(c=='s') p.value+='((:)~*(~)*a(~*(~^)*)*)';
    if(c=='k') p.value+='(a(!)~*)';
    if(c=='i') p.value+='()';
    if(c=='.')
    {
      c=o.substr(0,1);
      o=o.substr(1);
      p.value+='(('+c+')S)';
    }
  }
}

// function step(n, prog) {
//     var curr;
//     while (prog!='') {
//         curr = prog.pop();


//     }
// }


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
        var runner =  step(0, {'value': acc});
        console.log(runner);
        if (line == '' || !/[~:!*()a^S]/.test(line)) {result='';}
        else {result = runner.log;}
        out.innerHTML+=result+'\n';
        o.value = runner.output;
    }
}