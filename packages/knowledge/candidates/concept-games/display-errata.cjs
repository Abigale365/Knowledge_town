'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),C=require('../../../contracts');
const hash=value=>C.digest(JSON.stringify(value));
const specs=[
 {id:'prediction-underestimate-example',unitId:'1.1-lesson-5',field:'example',before:'Overestimating demand can increase excess inventory.',reason:{zh:'英文例示缺少中文已有的低估/缺货分支；保留可能性，不新增实测结论。',en:'The English example omits the existing Chinese underestimation/stockout branch; preserve uncertainty without adding an empirical claim.'}},
 {id:'data-quality-model-limit',unitId:'1.1-lesson-11',field:'body',before:'The fitness of data for its intended use, including accuracy, completeness, consistency, timeliness and relevance.',reason:{zh:'英文定义遗漏中文与冻结审校英文中的更大模型不能自动补救所有数据缺陷的边界。',en:'The English definition omits the Chinese and reviewed-English limit that a larger model cannot automatically repair every data defect.'}},
 {id:'framework-accuracy-limit',unitId:'1.1-lesson-14',field:'body',before:'Consistent definitions help teams distinguish models, algorithms, training and inference when making decisions.',reason:{zh:'英文定义遗漏中文与冻结审校英文中的框架不保证准确率的限制。',en:'The English definition omits the Chinese and reviewed-English limit that frameworks do not guarantee accuracy.'}}
];
function reviewedText(unit,field,lang){return field==='body'?unit.explanation[lang]:unit.examples.map(x=>x[lang]).join('\n').replace(/^(?:Teaching example: |教学例示：)/,'');}
function buildDisplayErrata(pack,analysis,catalogs){
 if(hash(pack)!=='f28f8ca8e808bb7eb8f135b3a761a2bdd9b86a37e4ce1c47f8f69de5fccb19ce'||hash(analysis)!=='9431ea7d0fac0b495f3ca1e59d754336f94ade1025b5bde48a65fc3b7bc45236')throw Error('Reviewed source changed; re-review required');
 const units=new Map(pack.units.map(u=>[u.id,u])),corrections=[],checkedRoutes=[];
 for(const route of catalogs){const course=route.course,courseHash=hash(course);checkedRoutes.push({catalogKey:route.key,courseId:course.id,courseHash,teachingRevision:route.revision});
  for(const spec of specs){const unit=units.get(spec.unitId),after=reviewedText(unit,spec.field,'en'),matches=course.chapters.flatMap(ch=>ch.sections.flatMap(s=>s.lessons.filter(l=>l.sourceUnitId===spec.unitId).map(lesson=>({sectionId:s.id,lesson}))));
   if(!matches.length)throw Error('Actual lesson missing: '+route.key+':'+spec.unitId);
   for(const {sectionId,lesson}of matches){
    if(route.kind==='aib'){if(reviewedText(unit,spec.field,'en')!==(lesson.en?.[spec.field]||'').replace(/^Teaching example: /,''))throw Error('AIB selected field differs from reviewed text; inspect before adding correction');continue;}
    if(lesson.en?.[spec.field]!==spec.before||lesson[spec.field]!==reviewedText(unit,spec.field,'zh'))throw Error('Legacy display baseline changed: '+route.key+':'+spec.unitId);
    const audit=analysis.audit.find(a=>a.unitId===spec.unitId);
    corrections.push({issueId:spec.id,sourceUnitId:unit.id,unitHash:hash(unit),field:'en.'+spec.field,before:spec.before,after,correspondingChinese:lesson[spec.field],reason:structuredClone(spec.reason),binding:{catalogKey:route.key,courseId:course.id,courseHash,teachingRevision:route.revision,lessonId:lesson.id,lessonHash:hash(lesson),sectionId},reviewedUnitEvidence:structuredClone(unit.evidence),sourceIds:[...new Set(audit.evidence.map(e=>e.sourceId))]});
   }
  }
 }
 return {schemaVersion:1,kind:'knowledge-display-errata',candidateRevision:1,status:'proposed-not-applied',displayOnly:true,changesFrozenKnowledge:false,changesCourseOrGameBindings:false,integrated:false,knowledge:{id:pack.id,revision:pack.revision,hash:hash(pack)},sourceAnalysisHash:hash(analysis),checkedRoutes,corrections,sources:[...new Set(corrections.flatMap(c=>c.sourceIds))].map(id=>structuredClone(analysis.sources.find(s=>s.id===id))),integrationNote:'Project a display copy only. Course/lesson hashes and saved game contexts must continue to use the original reviewed course objects. Rebinding or replacing B data is outside this candidate.'};
}
function projectDisplay(course,lesson,errata){
 const matches=errata.corrections.filter(c=>c.binding.courseId===course.id&&c.binding.lessonId===lesson.id);
 if(!matches.length)return null;
 if(matches.some(c=>c.binding.courseHash!==hash(course)||c.binding.lessonHash!==hash(lesson)||c.sourceUnitId!==lesson.sourceUnitId||lesson.en?.[c.field.split('.')[1]]!==c.before))return null;
 const copy=structuredClone(lesson);for(const c of matches)copy.en[c.field.split('.')[1]]=c.after;return copy;
}
function readInputs(){const root=path.resolve(__dirname,'../../../..'),json=f=>JSON.parse(fs.readFileSync(path.join(root,f),'utf8')),catalog=(f,name)=>vm.runInNewContext(fs.readFileSync(path.join(root,'dist',f),'utf8')+';'+name),v4=catalog('teaching-catalog.js','TeachingCatalog'),v5=catalog('teaching-catalog-v5.js','TeachingCatalogV5');return [json('packages/knowledge/generated/knowledge.v3.json'),json('packages/knowledge/generated/analysis.v3.json'),[{key:'legacy4',kind:'legacy',revision:4,course:v4.legacy.course},{key:'legacy5',kind:'legacy',revision:5,course:v5.legacy.course},{key:'aib4',kind:'aib',revision:4,course:v4.aib.course},{key:'aib5',kind:'aib',revision:5,course:v5.aib.course}]];}
module.exports={buildDisplayErrata,projectDisplay,readInputs};
if(require.main===module){const result=buildDisplayErrata(...readInputs());fs.writeFileSync(path.join(__dirname,'display-errata.v1.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({issues:new Set(result.corrections.map(c=>c.issueId)).size,bindings:result.corrections.length,checkedRoutes:result.checkedRoutes.length,displayOnly:true,integrated:false}));}
