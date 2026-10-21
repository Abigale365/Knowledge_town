(function(root,factory){const api=factory();if(typeof module==='object')module.exports=api;else root.AwayAdventure=api;})(typeof window==='undefined'?globalThis:window,function(){
'use strict';
const rules={seaside:{items:['pearl','coral','amber'],targets:{pearl:'chime',coral:'chime',amber:'chime'},dials:[1,2,3],sequence:['shell','wave','bird']},winter:{items:['red','green','gold'],targets:{red:'bakery',green:'station',gold:'tree'},sequence:['star','bell','moon']}};
function fresh(){return{v:1,stage:0,bag:[],placed:[],dials:[0,0,0],lights:[true,false,true],sequence:[],moves:0,completed:false};}
function take(s,id,item){if(s.stage!==0||!rules[id]?.items.includes(item)||s.bag.includes(item)||s.placed.includes(item))return false;s.bag.push(item);s.moves++;return true;}
function place(s,id,item,target){if(s.stage!==0||!s.bag.includes(item)||rules[id]?.targets[item]!==target)return false;s.bag=s.bag.filter(x=>x!==item);s.placed.push(item);s.moves++;if(s.placed.length===3)s.stage=1;return true;}
function turn(s,id,index){if(s.stage!==1||id!=='seaside'||!Number.isInteger(index)||index<0||index>2)return false;s.dials[index]=(s.dials[index]+1)%4;s.moves++;return true;}
function toggle(s,id,index){if(s.stage!==1||id!=='winter'||!Number.isInteger(index)||index<0||index>2)return false;for(const i of [[0,1],[1,2],[0,1,2]][index])s.lights[i]=!s.lights[i];s.moves++;return true;}
function check(s,id){if(s.stage!==1||!rules[id])return false;const ok=id==='seaside'?s.dials.every((n,i)=>n===rules[id].dials[i]):s.lights.every(Boolean);if(ok){s.stage=2;s.moves++;}return ok;}
function press(s,id,symbol){if(s.stage!==2||s.sequence.length>=3||!rules[id]?.sequence.includes(symbol))return false;s.sequence.push(symbol);s.moves++;return true;}
function resetSequence(s){if(s.stage!==2)return false;s.sequence=[];return true;}
function finish(s,id){if(s.stage!==2||!rules[id]||s.sequence.join(',')!==rules[id].sequence.join(','))return false;s.stage=3;s.completed=true;s.moves++;return true;}
function validate(s,id){const r=rules[id];return!!r&&!!s&&s.v===1&&Number.isInteger(s.stage)&&s.stage>=0&&s.stage<=3&&Number.isInteger(s.moves)&&s.moves>=0&&typeof s.completed==='boolean'&&s.completed===(s.stage===3)&&['bag','placed'].every(k=>Array.isArray(s[k])&&new Set(s[k]).size===s[k].length&&s[k].every(x=>r.items.includes(x)))&&!s.bag.some(x=>s.placed.includes(x))&&(s.stage===0||s.placed.length===3)&&Array.isArray(s.dials)&&s.dials.length===3&&s.dials.every(n=>Number.isInteger(n)&&n>=0&&n<4)&&Array.isArray(s.lights)&&s.lights.length===3&&s.lights.every(n=>typeof n==='boolean')&&Array.isArray(s.sequence)&&s.sequence.length<=3&&s.sequence.every(x=>r.sequence.includes(x))&&(s.stage<2||(id==='seaside'?s.dials.every((n,i)=>n===r.dials[i]):s.lights.every(Boolean)))&&(s.stage!==3||s.sequence.join(',')===r.sequence.join(','));}
return{rules,fresh,take,place,turn,toggle,check,press,resetSequence,finish,validate};
});
