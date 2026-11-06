(function(){
  var KEY="todo-items-v1",tasks=[],filter="all",editing=null;
  try{tasks=JSON.parse(localStorage.getItem(KEY))||[]}catch(e){tasks=[]}
  var $=function(id){return document.getElementById(id)};
  function save(){try{localStorage.setItem(KEY,JSON.stringify(tasks))}catch(e){}}
  function render(){
    var list=$("list");list.innerHTML="";
    var shown=tasks.filter(function(t){return filter==="all"||(filter==="done")===t.done});
    if(!shown.length){
      var li=document.createElement("li");li.className="empty";
      li.textContent=tasks.length?"Nothing in this view.":"No tasks yet. Add your first one above.";
      list.appendChild(li);
    }
    shown.forEach(function(t){
      var li=document.createElement("li");if(t.done)li.className="done";
      var cb=document.createElement("input");cb.type="checkbox";cb.checked=t.done;
      cb.setAttribute("aria-label","Mark “"+t.text+"” done");
      cb.onchange=function(){t.done=cb.checked;save();render()};
      li.appendChild(cb);
      if(editing===t.id){
        var ed=document.createElement("input");ed.type="text";ed.className="edit";ed.value=t.text;ed.maxLength=200;
        var fin=function(ok){if(editing!==t.id)return;editing=null;var v=ed.value.trim();if(ok&&v)t.text=v;save();render()};
        ed.onkeydown=function(e){if(e.key==="Enter")fin(true);if(e.key==="Escape")fin(false)};
        ed.onblur=function(){fin(true)};
        li.appendChild(ed);setTimeout(function(){ed.focus();ed.select()},0);
      }else{
        var s=document.createElement("span");s.className="t";s.textContent=t.text;s.title="Double-click to edit";
        s.ondblclick=function(){editing=t.id;render()};
        li.appendChild(s);
      }
      var d=document.createElement("button");d.className="del";d.innerHTML="&times;";
      d.setAttribute("aria-label","Delete “"+t.text+"”");
      d.onclick=function(){tasks=tasks.filter(function(x){return x.id!==t.id});save();render()};
      li.appendChild(d);list.appendChild(li);
    });
    var left=tasks.filter(function(t){return!t.done}).length,doneN=tasks.length-left;
    $("count").textContent=left+(left===1?" task left":" tasks left");
    $("sub").textContent=tasks.length?(doneN+" of "+tasks.length+" done"):"Your list is empty.";
    $("clear").style.visibility=doneN?"visible":"hidden";
  }
  $("f").onsubmit=function(e){
    e.preventDefault();var v=$("in").value.trim();if(!v)return;
    tasks.unshift({id:Date.now()+Math.random(),text:v,done:false});
    $("in").value="";save();render();
  };
  $("clear").onclick=function(){tasks=tasks.filter(function(t){return!t.done});save();render()};
  document.querySelectorAll(".filters button").forEach(function(b){
    b.onclick=function(){
      filter=b.dataset.f;
      document.querySelectorAll(".filters button").forEach(function(x){x.setAttribute("aria-pressed",x===b)});
      render();
    };
  });
  render();
})();
