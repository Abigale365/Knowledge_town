(function(root){
'use strict';
const safeText=(v,n=500)=>typeof v==='string'&&v.trim().length>0&&v.length<=n;
function validate(p){
 const errors=[]; if(!p||typeof p!=='object'||Array.isArray(p))return ['内容包必须是一个结构化对象。'];
 for(const k of ['id','title','subtitle','brief','npc1','npc2','hint','transfer'])if(!safeText(p[k],1800))errors.push('缺少或填写无效的字段：'+({id:'内容包编号',title:'标题',subtitle:'章节',brief:'剧情简介',npc1:'第一位角色',npc2:'第二位角色',hint:'提示',transfer:'迁移挑战'}[k]));
 if(!Array.isArray(p.sources)||p.sources.length<1||p.sources.length>10)errors.push('请提供1至10条来源。');
 else p.sources.forEach((s,i)=>{if(!s||!safeText(s.id,30)||!safeText(s.title)||!safeText(s.note,1500)||!/^https:\/\//.test(s.url||''))errors.push('来源格式无效，序号：'+i);});
 const ids=new Set((Array.isArray(p.sources)?p.sources:[]).map(s=>s&&s.id));
 if(!Array.isArray(p.routes)||p.routes.length!==4)errors.push('需要恰好四封能力派送委托。');
 else p.routes.forEach((r,i)=>{if(!r||!safeText(r.name)||!safeText(r.request,900)||!['rules','predict','generate','agent'].includes(r.answer)||!safeText(r.why,900)||!ids.has(r.source))errors.push('委托内容或答案依据无效，序号：'+i);});
 if(!Array.isArray(p.steps)||p.steps.length!==4||new Set(p.steps).size!==4||p.steps.some(s=>!safeText(s,140)))errors.push('需要四个不重复、按正确顺序填写的流程步骤。');
 if(!safeText(p.workflow,900)||!safeText(p.workflowWhy,1200)||!ids.has(p.workflowSource))errors.push('流程的说明或来源无效。');
 const e=p.economics;
 if(!e||!['baseline','minutes','people','days','hourly','setup','monthly','review','quality','floor','adoption'].every(k=>Number.isFinite(e[k])))errors.push('试算参数必须齐全，并且都是有限数值。');
 else if(e.minutes<=0||e.people<=0||e.days<=0||e.hourly<=0||e.setup<0||e.monthly<0||e.review<0||e.review>=e.minutes||e.baseline<=e.minutes||e.quality<0||e.quality>100||e.floor<0||e.floor>100||e.adoption<10||e.adoption>100||e.quality<e.floor||e.setup+12*e.monthly<=0||!Number.isFinite(e.people*e.minutes*e.days*e.hourly*12))errors.push('试算参数不合理：请检查时间、采用率、质量底线和成本。');
 if(!Array.isArray(p.boss)||p.boss.length!==4||p.boss.some(b=>!b||!safeText(b.label)||!safeText(b.why,900)||typeof b.required!=='boolean'||!ids.has(b.source))||p.boss.filter(b=>b.required).length!==2)errors.push('最终试炼需要四项行动，每项有来源，且恰好两项正确。');
 return errors;
}
function fresh(id){return {version:1,pack:id,stage:0,clues:[],routes:{},attempts:[0,0,0,0],first:[null,null,null,null],hints:[],completed:[],xp:0,log:[],order:[3,1,0,2],guard:false,budget:{adoption:50,review:true},boss:[],pos:[50,55]};}
function calc(p,a,review){const e=p.economics;const benefit=e.people*(a/100)*(e.minutes-(review?e.review:0))/60*e.days*12*e.hourly;const cost=e.setup+12*e.monthly;return {benefit,cost,roi:cost?100*(benefit-cost)/cost:0,net:benefit-cost,quality:review?e.quality:Math.max(0,e.floor-12)};}
function checkRoutes(p,s){return p.routes.every((r,i)=>s.routes[i]===r.answer);}
function checkWorkflow(p,s){return s.order.every((v,i)=>v===i)&&s.guard;}
function checkBudget(p,s){const x=calc(p,s.budget.adoption,s.budget.review);return s.budget.review&&s.budget.adoption<=p.economics.adoption&&x.quality>=p.economics.floor;}
function checkBoss(p,s){return p.boss.every((b,i)=>s.boss.includes(i)===b.required);}
function evaluate(p,s){return [checkRoutes,checkWorkflow,checkBudget,checkBoss][s.stage](p,s);}
function submit(p,s){if(s.stage<0||s.stage>3||s.stage>s.completed.length)return false;const i=s.stage;const ok=evaluate(p,s);s.attempts[i]++;if(s.first[i]===null)s.first[i]=ok;s.log.push({stage:i,correct:ok,time:new Date().toISOString(),response:JSON.parse(JSON.stringify(i===0?s.routes:i===1?{order:s.order,guard:s.guard}:i===2?s.budget:s.boss))});if(ok&&!s.completed.includes(i)){s.completed.push(i);s.xp+=s.first[i]===true&&s.attempts[i]===1&&!s.hints.includes(i)?100:65;}return ok;}
function restore(raw,p){try{const s=JSON.parse(raw);if(s.version!==1||s.pack!==p.id||!Number.isInteger(s.stage)||s.stage<0||s.stage>4||!Array.isArray(s.completed)||s.completed.some(v=>!Number.isInteger(v)||v<0||v>3)||new Set(s.completed).size!==s.completed.length||s.completed.some((v,i)=>v!==i)||s.stage>s.completed.length||!Array.isArray(s.order)||[...s.order].sort().join()!=='0,1,2,3'||!Array.isArray(s.first)||s.first.length!==4||s.first.some(v=>v!==null&&typeof v!=='boolean')||!Array.isArray(s.attempts)||s.attempts.length!==4||s.attempts.some(v=>!Number.isInteger(v)||v<0)||!Array.isArray(s.hints)||!Array.isArray(s.clues)||!Array.isArray(s.boss)||!Array.isArray(s.log)||!s.budget||!Number.isFinite(s.budget.adoption)||typeof s.budget.review!=='boolean'||typeof s.guard!=='boolean'||(s.stage===4&&s.completed.length!==4)||s.clues.some(v=>![0,1].includes(v))||s.hints.some(v=>![0,1,2,3].includes(v))||s.boss.some(v=>![0,1,2,3].includes(v))||s.budget.adoption<10||s.budget.adoption>100||!Number.isFinite(s.xp)||s.xp<0||s.xp>400||!s.routes||!Array.isArray(s.pos)||s.pos.length!==2||s.pos.some(v=>!Number.isFinite(v)||v<0||v>100))return fresh(p.id);return s;}catch{return fresh(p.id);}}
const api={validate,fresh,calc,evaluate,submit,restore};if(typeof module!=='undefined')module.exports=api;else root.QuestEngine=api;
})(typeof window==='undefined'?globalThis:window);
