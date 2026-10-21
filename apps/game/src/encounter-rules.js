(function(root,factory){const C=typeof module==='object'?require('../../../packages/contracts/runtime/material-compiler.js'):root.MaterialCompiler;const api=factory(C);if(typeof module==='object')module.exports=api;else root.EncounterRules=api;})(typeof window==='undefined'?globalThis:window,function(C){
'use strict';
function create(card){
 const task=C.compile(card,0,[]),numeric=['numeric','roi'].includes(task.mode);
 return{task,placed:[],groups:{},value:'',assisted:false,mistakes:0,numeric};
}
function move(e,key,category){
 const p=e.task.pieces.find(p=>p.key===key);if(!p||e.numeric)return false;
 if(e.task.categories&&(!Number.isInteger(category)||category<0||category>=e.task.categories.length))return false;
 if(e.task.categories){if(e.groups[key]===category){delete e.groups[key];e.placed=e.placed.filter(k=>k!==key);}else{e.groups[key]=category;if(!e.placed.includes(key))e.placed.push(key);}return true;}
 if(e.placed.includes(key)){e.placed=e.placed.filter(k=>k!==key);return true;}
 if(!['multi','order'].includes(e.task.mode))e.placed=[];
 e.placed.push(key);return true;
}
function check(e){
 const q=e.task;
 if(e.numeric){if(typeof e.value!=='string'||!e.value.trim())return{ok:false,incomplete:true,message:'先填写计算结果，零也需要明确输入。'};
 const n=Number(e.value);if(Number.isFinite(n)&&Math.abs(n-q.expected)<.011)return{ok:true};
 e.mistakes++;e.assisted=true;return{ok:false,message:'结果还不匹配。核对题目中的数值、单位和计算过程后再试。'};}
 const selected=e.placed.map(k=>q.pieces.find(p=>p.key===k));
 if(selected.length<q.target)return{ok:false,incomplete:true,message:'还需要 '+(q.target-selected.length)+' 份答案。'};
 const ok=selected.length===q.target&&selected.every(p=>p?.correct)&&(q.mode!=='order'||selected.every((p,i)=>p.order===i))&&(!q.categories||selected.every(p=>e.groups[p.key]===p.category));
 if(ok)return{ok:true};e.mistakes++;e.assisted=true;
 return{ok:false,message:q.mode==='order'?'顺序还不匹配。点一下已放入的步骤可以取回，再重新排列。':q.categories?'有些材料还没有放到对应的位置。可以点已放入的材料取回，再重新配对。':'这组答案还不完整或含有不符合题目的内容。点已选材料可以取消。'};
}
function summary(e){const q=e.task;if(e.numeric)return[String(q.expected)+(q.calculation?.unit||'')];const pieces=q.pieces.filter(p=>p.correct).sort((a,b)=>(a.order??a.category??0)-(b.order??b.category??0));return pieces.map(p=>(q.categories?q.categories[p.category]+'：':'')+p.text);}
return{create,move,check,summary};
});
