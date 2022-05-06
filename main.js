function generateOutputFunction(pre) {
  return function outf(text) {
      pre.innerHTML = pre.innerHTML + text;
  }
}
function builtinRead(x) {
    if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
            throw "File not found: '" + x + "'";
    return Sk.builtinFiles["files"][x];
}

function showAlert(element, type, text) {
       var div = document.createElement('div');
       div.innerHTML = `<div class="alert alert-${type} alert-dismissible" role="alert">${text}<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`;
       element.append(div);
}
function runit(holder) {
   var prog = holder.querySelector(".code-editor").value;
   var mypre = holder.querySelector(".output");
   var canvas = holder.querySelector(".turtle");
   mypre.innerHTML = '';
   Sk.pre = mypre;
   Sk.configure({output:generateOutputFunction(mypre), read:builtinRead});
   (Sk.TurtleGraphics || (Sk.TurtleGraphics = {})).target = canvas;
   var myPromise = Sk.misceval.asyncToPromise(function() {
       return Sk.importMainWithBody("<stdin>", false, prog, true);
   });
   myPromise.then(function(mod) {
       //showAlert(holder.querySelector(".alert-holder"), 'success', 'Code complete!')
   },
   function(err) {
       holder.querySelector(".error-message").innerHTML = "<b>Error Message:</b> " + err.toString();
       holder.querySelector(".error-display").classList.remove("hidden");
   });
}

function clearOutput(holder) {
  holder.querySelector(".output").innerHTML = '';
  holder.querySelector(".turtle").innerHTML = '';
  holder.querySelector(".error-display").classList.add("hidden");

}

function transformCodeBlock(code) {
  let code_text = code.innerHTML;
  code.outerHTML = `
<div class="code-component">
<div class="code-holder">
<textarea class="code-editor"
     spellcheck="false">
${code_text}
</textarea>
</div>

<button type="button" class="btn btn-secondary" onclick="clearOutput(this.parentElement)">
<i class="bi-trash"></i>
Clear
</button>
<button type="button" class="btn btn-primary" onclick="runit(this.parentElement)">
<i class="bi-play"></i>
Run</button>
<div class="btn-group error-display hidden">
  <button type="button" class="btn btn-danger dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
    Code Error
  </button>
  <p class="dropdown-menu p-2 error-message" style="min-width: 200px;"></p>
</div>
<div class="btn alert-holder"></div>
<br/>
<br/>
<div class="output-holder">
  <pre class="output"></pre>
  <div class="turtle"></div>
</div>
</div>

`;
}


document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll("code")
    .forEach(c => transformCodeBlock(c));
  document.querySelectorAll('textarea')
    .forEach(ta => {
        let cm = CodeMirror.fromTextArea(ta, {
            lineNumbers: true,
            theme: "material-darker"
        });

        //mirror changes back to the textarea
        cm.on('change', function(instance, obj) { instance.save(); });
    });
});
