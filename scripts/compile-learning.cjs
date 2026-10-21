'use strict';
const fs=require('node:fs'),path=require('node:path'),{compilePreparedCourse}=require('../apps/server/pipeline.cjs');
const [materials,knowledge,plan,output]=process.argv.slice(2),root=path.resolve(__dirname,'..');
(async()=>{
 if(!materials||!knowledge||!plan||!output)throw Error('Usage: node scripts/compile-learning.cjs materials.json knowledge.json plan.json artifacts/course.json');
 const out=path.resolve(root,output);if(!out.startsWith(path.join(root,'artifacts')+path.sep))throw Error('Output must be inside artifacts; publication belongs to D.');
 const read=p=>JSON.parse(fs.readFileSync(path.resolve(root,p),'utf8'));
 const result=await compilePreparedCourse({materialBundle:read(materials),knowledgePack:read(knowledge),learningPlan:read(plan)});
 fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,JSON.stringify(result.course,null,2));
 console.log('PASS: compiled '+result.course.chapters.length+' chapters; '+result.diagnostics.length+' review warnings. '+out);
})().catch(e=>{console.error(e.message);if(e.diagnostics)console.error(JSON.stringify(e.diagnostics));process.exitCode=1;});
