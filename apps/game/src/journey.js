(function(root){
'use strict';
const rooms=['archive','workshop','garden','tower'];
function fresh(){return {v:1,welcome:false,tutorialDone:false,tutorial:0,tutorialChoice:null,room:'map',panel:'arrival',letter:0,chosen:null,evidence:[],letterAttempts:[0,0,0,0],letterFirst:[null,null,null,null],inspected:[],tile:null,events:[],feedback:null};}
function normalize(s){const j=s.journey;
 if(!j||j.v!==1||!['arrival','mentor','practice','letters','clue0','clue1','clue2','clue3','machine','tokens','lock','survey','quality','crystal','brief','plans','beacon'].includes(j.panel)||typeof j.welcome!=='boolean'||typeof j.tutorialDone!=='boolean'||!Number.isInteger(j.tutorial)||j.tutorial<0||j.tutorial>4||!['map','tutorial',...rooms].includes(j.room)||!Number.isInteger(j.letter)||j.letter<0||j.letter>3||!Array.isArray(j.evidence)||j.evidence.some(v=>!Number.isInteger(v)||v<0||v>3)||!Array.isArray(j.inspected)||!Array.isArray(j.letterAttempts)||j.letterAttempts.length!==4||j.letterAttempts.some(v=>!Number.isInteger(v)||v<0)||!Array.isArray(j.letterFirst)||j.letterFirst.length!==4||j.letterFirst.some(v=>v!==null&&typeof v!=='boolean')||!Array.isArray(j.events)||new Set(j.evidence).size!==j.evidence.length)s.journey=fresh();
 if(rooms.indexOf(s.journey.room)>s.completed.length)s.journey.room='map';
 if(s.journey.feedback&&(typeof s.journey.feedback!=='object'||typeof s.journey.feedback.ok!=='boolean'||typeof s.journey.feedback.text!=='string'))s.journey.feedback=null;
 s.journey.events=s.journey.events.slice(-400);
 if(!['rules','predict','generate','agent',null].includes(s.journey.chosen))s.journey.chosen=null;
 if(!Number.isInteger(s.journey.tile)||s.journey.tile<0||s.journey.tile>3)s.journey.tile=null;
 return s.journey;
}
function log(s,kind,value){s.journey.events.push({kind,value,time:new Date().toISOString()});if(s.journey.events.length>400)s.journey.events.shift();}
function canEnter(s,room){return room==='map'||room==='tutorial'||(rooms.includes(room)&&rooms.indexOf(room)<=s.completed.length);}
function enter(s,room){if(!canEnter(s,room))return false;s.journey.room=room;s.journey.panel='arrival';s.journey.feedback=null;s.journey.tile=null;if(rooms.includes(room))s.stage=rooms.indexOf(room);log(s,'enter',room);return true;}
function inspect(s,id){const legal={archive:['clue0','clue1','clue2','clue3'],workshop:['machine','tokens','lock'],garden:['survey','quality','crystal'],tower:['brief','plans','beacon']};const j=s.journey;if(!(legal[j.room]||[]).includes(id))return false;
 if(!j.inspected.includes(id))j.inspected.push(id);if(id.startsWith('clue')){const n=Number(id.slice(-1));if(!j.evidence.includes(n))j.evidence.push(n);}j.panel=id;j.feedback=null;log(s,'inspect',id);return true;
}
function letter(s,p){const j=s.journey,n=j.letter;
 if(j.room!=='archive'||!j.evidence.includes(n)||!['rules','predict','generate','agent'].includes(j.chosen))return {ok:false,blocked:true};
 const ok=j.chosen===p.routes[n].answer;j.letterAttempts[n]++;if(j.letterFirst[n]===null)j.letterFirst[n]=ok;
 if(ok)s.routes[n]=j.chosen;else delete s.routes[n];log(s,'letter',{index:n,choice:j.chosen,correct:ok});return {ok,blocked:false};
}
function ready(s,stage){const j=s.journey;if(stage===0)return j.evidence.length===4;if(stage===1)return ['machine','tokens','lock'].every(x=>j.inspected.includes(x));if(stage===2)return ['survey','quality','crystal'].every(x=>j.inspected.includes(x));if(stage===3)return ['brief','plans','beacon'].every(x=>j.inspected.includes(x));return false;}
const api={rooms,fresh,normalize,canEnter,enter,inspect,letter,ready,log};if(typeof module!=='undefined')module.exports=api;else root.QuestJourney=api;
})(typeof window==='undefined'?globalThis:window);
