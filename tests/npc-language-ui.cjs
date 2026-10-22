'use strict';
const assert=require('node:assert/strict'),harness=require('./town-harness.cjs');
(async()=>{
 const h=await harness(new Map(),{entrySchedule:true});
 for(const [zh,en]of [['导入与归档','Import and archive'],['回想与练习','Recall and practice'],['合成与交换','Craft and exchange'],['种植与成长','Plant and grow'],['章节与课程','Chapters and courses'],['复习与错题','Review and mistakes'],['本节知识装置','Section learning device']]){
  assert.equal(h.run(`translateTownText(${JSON.stringify(zh)})`),en);
  assert.equal(h.run(`TownLocale.pair(${JSON.stringify(zh)},translateTownText).en`),en);
 }
 console.log('PASS: complete NPC role phrases register bilingual pairs without mixed-language fragments. Simulated DOM only.');
})().catch(e=>{console.error(e);process.exitCode=1;});
