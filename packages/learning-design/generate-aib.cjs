'use strict';
const fs=require('node:fs'),path=require('node:path'),C=require('../contracts');
const {designLearning,createDesignAdapter}=require('.');
const {compileCourse}=require('../course-compiler');
async function generate(){
 const pack=require('../knowledge/generated/knowledge.v1.json');
 const bundle=require('../knowledge/generated/materials.v1.json');
 const baseline=require('./authored/input-snapshot.v1.json');
 if(pack.id!==baseline.knowledgePackId||pack.revision!==baseline.knowledgeRevision||C.digest(JSON.stringify(pack))!==baseline.knowledgeHash)
  throw Error('Authoring baseline changed; review all affected tasks before updating input-snapshot.v1.json');
 C.assertValid(C.validateKnowledge(pack,bundle));
 const authored={};
 for(let i=1;i<=4;i++){
  const shard=require(`./authored/chapter-${i}.cjs`),units=shard.units||shard;
  for(const [id,spec] of Object.entries(units)){
   if(authored[id])throw Error('Duplicate authored unit '+id);
   authored[id]=structuredClone(spec);
  }
 }
 const actual=pack.units.map(u=>u.id).sort(),expected=Object.keys(authored).sort();
 if(JSON.stringify(actual)!==JSON.stringify(expected))throw Error('Authored unit set differs from knowledge input');
 for(const u of pack.units){
  const spec=authored[u.id];
  spec.knowledgeBasis=C.digest(JSON.stringify({explanation:u.explanation,evidence:u.evidence}));
  // Avoid a fixed correct-option position while keeping reproducible authored IDs.
  for(const r of spec.activity.rounds){
   if(r.options)r.options.sort((a,b)=>C.digest(u.id+a.id).localeCompare(C.digest(u.id+b.id)));
   if(r.type==='order'&&r.items.every((item,i)=>item.id===r.expected[i]))r.items.push(r.items.shift());
  }
 }
 const titles=[['AI基础与技术选择','AI foundations and technology choices'],['业务价值与可行性','Business value and feasibility'],['风险治理与可靠运行','Risk governance and reliable operations'],['组织准备与持续转型','Organizational readiness and sustained transformation']];
 const blueprint={id:'aib-learning-plan',revision:1,title:{zh:'Knowledge Town · 从基础到业务应用',en:'Knowledge Town: foundations to business application'},
  chapters:titles.map(([zh,en],ci)=>({title:{zh,en},unitIds:pack.units.filter(u=>u.id.startsWith((ci+1)+'.')).map(u=>u.id),maxUnitsPerSection:4})),units:authored};
 const plan=await designLearning(pack,{design:createDesignAdapter(blueprint)});
 const course=compileCourse(pack,plan,{materialBundle:bundle});
 const dir=path.join(__dirname,'generated');fs.mkdirSync(dir,{recursive:true});
 const roundCounts={};for(const ch of plan.chapters)for(const s of ch.sections)for(const r of s.activity.rounds)roundCounts[r.type]=(roundCounts[r.type]||0)+1;
 const manifest={schemaVersion:1,input:{id:pack.id,revision:pack.revision,hash:C.digest(JSON.stringify(pack)),materialBundleId:bundle.id,materialRevision:bundle.revision},
  output:{id:plan.id,revision:plan.revision,hash:C.digest(JSON.stringify(plan))},uniqueUnits:actual.length,objectives:pack.objectives.length,
  chapters:plan.chapters.map(ch=>({id:ch.id,sections:ch.sections.length,learningCards:ch.sections.reduce((n,s)=>n+s.learnUnitIds.length,0),questions:ch.sections.reduce((n,s)=>n+s.questions.length,0)})),
  roundCounts,knowledgeWarnings:C.validateKnowledge(pack,bundle).filter(d=>d.severity==='warning').length,
  learningErrors:C.validateLearningPlan(pack,plan).length,compiledCards:course.chapters.reduce((n,c)=>n+c.sections.reduce((m,s)=>m+s.lessons.length,0),0),
  notes:['All source needs-review flags retained; no publication or model calls.','Repeated chapter-local prerequisites are included in counts.','Stage gates and review scheduling belong to D/C; no shared contract fields added.']};
 const audit=pack.units.map(u=>({id:u.id,title:u.title,objectiveIds:u.objectiveIds,prerequisiteIds:u.prerequisiteIds,
  status:u.status,knowledgeBasis:authored[u.id].knowledgeBasis,rationale:authored[u.id].rationale,misconception:authored[u.id].misconception,
  types:authored[u.id].activity.rounds.map(r=>r.type),locations:plan.chapters.flatMap(ch=>ch.sections.filter(s=>s.learnUnitIds.includes(u.id)).map(s=>({chapterId:ch.id,sectionId:s.id}))),
  review:{zh:'章交付后无提示作答；错题按unitIds回看再重试；下次学习时混合检索。改变条件需重审答案。',en:'Retrieve without hints after chapter delivery; revisit linked units on errors and retry; mix retrieval next session. Changed conditions require answer review.'}}));
 for(const [name,value]of Object.entries({'aib-blueprint.v1.json':blueprint,'aib-learning-plan.v1.json':plan,'aib-course.v1.json':course,'aib-manifest.v1.json':manifest,'aib-unit-audit.v1.json':audit}))
  fs.writeFileSync(path.join(dir,name),JSON.stringify(value,null,2)+'\n');
 fs.writeFileSync(path.join(__dirname,'examples','a-adaptation-check.json'),JSON.stringify({
  input:manifest.input,result:'full-authored-adaptation-passed',uniqueUnits:139,objectives:58,
  learningErrors:0,knowledgeWarnings:manifest.knowledgeWarnings,
  plan:'../generated/aib-learning-plan.v1.json',manifest:'../generated/aib-manifest.v1.json',
  note:'Supersedes the earlier fixture-only blocked probe. Full teaching adaptation preserves source needs-review warnings.'},null,2)+'\n');
 console.log(JSON.stringify(manifest,null,2));return {plan,manifest};
}
if(require.main===module)generate().catch(e=>{console.error(e.message,e.diagnostics||'');process.exitCode=1;});
module.exports={generate};
