'use strict';
const fs=require('node:fs'),path=require('node:path'),K=require('./');
const root=path.resolve(__dirname,'../..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const inventory=JSON.parse(read('content/knowledge-inventory.json'));
const outline=read('content/sources/AI_Business_Strategist_Outline.md');
const notes=read('content/sources/AIB_C01_Collected_Study_Materials.md');
const out=path.join(__dirname,'generated');fs.mkdirSync(out,{recursive:true});
const write=(name,data)=>fs.writeFileSync(path.join(out,name),JSON.stringify(data,null,2)+'\n');
// A versioned snapshot identifies these explanations as existing teaching supplements,
// not retrieved official pages, uploaded textbook definitions, or newly verified facts.
const snapshot={kind:'existing-teaching-supplement',revision:1,upstreamHash:require('../contracts').digest(read('content/knowledge-inventory.json')),notice:'Original teaching explanations. Listed URLs are reading pointers, not verified quotations. Human bilingual and subject review required.',units:inventory.units};
const supplement=JSON.stringify(snapshot,null,2);
const bundle=K.createMaterialBundle([{id:'outline',name:'User outline',text:outline},{id:'study-notes',name:'User collected study companion',text:notes},{id:'teaching-supplement',name:'Versioned existing teaching supplement (not official lesson text)',text:supplement}],{id:'aib-knowledge-materials',revision:1});
const skills=[...outline.matchAll(/^\+ 技能 (\d+\.\d+\.\d+)： (.+)$/gm)];
const english=require('./objectives-en.cjs');if(english.length!==skills.length)throw Error('Objective translation count mismatch');
const objectives=skills.map(([,skill,title],i)=>({id:'skill-'+skill,title:{zh:title,en:english[i]}}));
const prerequisites={'1.1.5':['1.1.1','1.1.4'],'1.2.1':['1.1.2'],'1.2.2':['1.2.1'],'1.2.3':['1.1.5'],'1.3.2':['1.3.1'],'1.3.3':['1.3.1'],'2.2.3':['2.2.1','2.2.2'],'2.1.3':['2.1.1'],'3.1.2':['3.1.1'],'3.1.4':['3.1.1'],'3.2.4':['3.2.1'],'3.3.1':['3.1.4'],'4.1.4':['4.1.1','4.1.3'],'4.2.2':['4.2.1'],'4.4.5':['4.4.1','3.3.1'],'4.4.6':['4.4.5']};
const first=skill=>inventory.units.find(u=>u.skill===skill)?.id;
const claims=inventory.units.map(u=>({id:u.id,objectiveIds:['skill-'+u.skill],title:{zh:u.term,en:u.en.title},category:{zh:u.category,en:u.en.category||'Teaching supplement'},explanation:{zh:u.definition,en:u.en.body},examples:u.example&&u.en.example?[{zh:u.example,en:u.en.example}]:[],misconceptions:u.boundary&&u.en.boundary?[{zh:u.boundary,en:u.en.boundary}]:[],prerequisiteIds:(prerequisites[u.skill]||[]).map(first).filter(Boolean),status:'needs-review',evidence:[{materialId:'teaching-supplement',locator:'JSON unit '+u.id,quote:JSON.stringify(u.definition).slice(1,-1)}]}));
const result=K.assembleKnowledge(bundle,{objectives,claims},{id:'aib-knowledge',revision:1});
write('materials.v1.json',bundle);write('knowledge.v1.json',result.pack);
write('analysis.v1.json',{...result,pack:undefined,scope:'All supplied 58 skills; supplementary explanations, not a complete mirror of official course bodies.',inputInventoryHash:snapshot.upstreamHash,accessGaps:['Private lesson bodies, videos and official question explanations are absent.','Linked official reading has not been retrieved or freshly verified by this generator.'],prerequisitePolicy:'Conservative authored skill-level suggestions; review before use. Cross-chapter review scheduling belongs to B.',provenance:inventory.units.map(u=>({unitId:u.id,kind:'existing-teaching-supplement',readingPointers:u.references||[],originalSourceLabel:u.source})),summary:{domains:4,tasks:13,skills:skills.length,units:result.pack.units.length}});
if(result.diagnostics.some(d=>d.severity==='error'))throw Error(JSON.stringify(result.diagnostics));
console.log(JSON.stringify({skills:skills.length,units:result.pack.units.length,errors:0,warnings:result.diagnostics.length}));
