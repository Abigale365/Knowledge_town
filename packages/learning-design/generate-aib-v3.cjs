'use strict';
const fs=require('node:fs'),path=require('node:path'),C=require('../contracts'),{designLearning,createDesignAdapter}=require('.'),{compileCourse}=require('../course-compiler');
async function generate({reviewed=false}={}){
 const {knowledgePack:pack,materialBundle:bundle,provenance}=require('../course-compiler/enrich-aib.cjs').enrichedAib(),original=require('./generated/aib-blueprint.v1.json');
 C.assertValid(C.validateKnowledge(pack,bundle));const blueprint=structuredClone(original);blueprint.revision=3;
 const canonical=require('../../dist/chapter-course.js').chapters;
 blueprint.chapters.forEach((ch,i)=>ch.title={zh:canonical[i].title,en:canonical[i].english});
 for(const u of pack.units){const spec=blueprint.units[u.id];if(!spec)throw Error('Missing authored unit '+u.id);
  spec.knowledgeBasis=C.digest(JSON.stringify({explanation:u.explanation,evidence:u.evidence}));
  const preferred={'3.1.2-unit-1':1,'3.3-lesson-2':2,'3.3.1-unit-1':4,'3.3.2-unit-1':1,'4.1-lesson-4':1,'4.2.1-unit-1':2,'4.2.2-unit-1':3,'4.2.3-unit-1':4,'4.3-lesson-2':1,'4.3-lesson-3':2,'4.3-lesson-4':3,'4.3-lesson-5':1,'4.3-lesson-6':2,'4.3.3-unit-1':2,'4.3.4-unit-1':1,'4.3.5-unit-1':1,'4.3.6-unit-1':2,'4.4-lesson-1':1,'4.4-lesson-4':1,'4.4.1-unit-1':1,'4.4.5-unit-1':2,'4.4.6-unit-1':2};
  const evidence=u.evidence[0].materialId==='integration-evidence-v3'?u.evidence[0]:u.evidence[preferred[u.id]||0];if(!evidence)throw Error('Missing selected evidence '+u.id);
  for(const q of spec.questions)q.quote=evidence.quote;
 }
 require('./authored/adaptations.v3.cjs').apply(blueprint);
 const dir=path.join(__dirname,'generated');fs.mkdirSync(dir,{recursive:true});
 if(!reviewed){const preview=path.resolve(__dirname,'../../artifacts/runtime');fs.mkdirSync(preview,{recursive:true});fs.writeFileSync(path.join(preview,'aib-blueprint.v3.candidate.json'),JSON.stringify(blueprint,null,2)+'\n');return;}
 const audit=require('./authored/review-v3.json');if(audit.knowledgeHash!==C.digest(JSON.stringify(pack))||audit.blueprintHash!==C.digest(JSON.stringify(blueprint))||audit.decisions.length!==pack.units.length||pack.units.some(u=>audit.decisions.filter(d=>d.unitId===u.id&&d.accepted===true).length!==1))throw Error('Every v3 teaching unit requires semantic review tied to knowledge and blueprint hashes.');
 const plan=await designLearning(pack,{design:createDesignAdapter(blueprint)}),course=compileCourse(pack,plan,{materialBundle:bundle});
 const types={};for(const ch of plan.chapters)for(const s of ch.sections)for(const r of s.activity.rounds)types[r.type]=(types[r.type]||0)+1;
 const manifest={schemaVersion:1,provenance,input:{id:pack.id,revision:pack.revision,hash:C.digest(JSON.stringify(pack)),materialBundleId:bundle.id,materialRevision:bundle.revision},output:{id:plan.id,revision:plan.revision,hash:C.digest(JSON.stringify(plan))},uniqueUnits:pack.units.length,objectives:pack.objectives.length,chapters:plan.chapters.map(ch=>({id:ch.id,sections:ch.sections.length,learningCards:ch.sections.reduce((n,s)=>n+s.learnUnitIds.length,0)})),roundCounts:types,knowledgeWarnings:0};
 for(const[name,value]of Object.entries({'aib-blueprint.v3.json':blueprint,'aib-learning-plan.v3.json':plan,'aib-course.v3.json':course,'aib-manifest.v3.json':manifest}))fs.writeFileSync(path.join(dir,name),JSON.stringify(value,null,2)+'\n');
 console.log(JSON.stringify(manifest));return {plan,manifest};
}
if(require.main===module)generate({reviewed:process.argv.includes('--reviewed')}).catch(e=>{console.error(e.message,e.diagnostics||'');process.exitCode=1;});
module.exports={generate};
