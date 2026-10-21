'use strict';
const C=require('../contracts'),K=require('./');
const required=(value,label)=>{if(typeof value!=='string'||!value.trim())throw Error('Missing review field: '+label);return value;};
function buildReviewedCorpus({baselineBundle,baselinePack,inventory,reviews,inputInventoryHash,expectedInventoryHash,baselineMaterialRevision=1,baselineKnowledgeRevision=1}){
 if(inputInventoryHash!==expectedInventoryHash)throw Error('Review inventory hash is stale');
 C.assertValid(C.validateMaterialBundle(baselineBundle));
 if(baselineBundle.revision!==baselineMaterialRevision||baselinePack.revision!==baselineKnowledgeRevision)throw Error('Baseline revision mismatch with review manifest');
 C.assertValid(C.validateKnowledge(baselinePack,baselineBundle).filter(d=>d.code!=='knowledge.gap'));
 const rows=reviews.flatMap(r=>r.units),sources=reviews.flatMap(r=>r.sources),byId=new Map(),bySource=new Map();
 for(const row of rows){if(byId.has(row.unitId))throw Error('Duplicate review: '+row.unitId);byId.set(row.unitId,row);}
 if(rows.length!==inventory.units.length||inventory.units.some(u=>!byId.has(u.id)))throw Error('Review must cover every inventory unit exactly once');
 for(const s of sources){if(bySource.has(s.id))throw Error('Duplicate source: '+s.id);for(const key of ['id','title','url','excerpt','verifiedAt'])required(s[key],s.id+'.'+key);if(!/^https:\/\//.test(s.url))throw Error('Source needs HTTPS URL');bySource.set(s.id,s);}
 let primaryText='# Independently checked primary-source excerpts\n\nOnly short quotations are reproduced. Explanations and examples are separately authored.\n';
 const nextRevision=baselineBundle.revision+1;
 const primaryMaterialId=baselineBundle.materials.some(m=>m.id==='reviewed-primary-sources')?'reviewed-primary-sources-r'+nextRevision:'reviewed-primary-sources';
 const teachingMaterialId=baselineBundle.materials.some(m=>m.id==='reviewed-teaching-explanations')?'reviewed-teaching-explanations-r'+nextRevision:'reviewed-teaching-explanations';
 const sourcePositions=new Map();
 for(const s of sources){primaryText+=`\n## ${s.id}: ${s.title}\nURL: ${s.url}\nChecked: ${s.verifiedAt}\n\n`;sourcePositions.set(s.id,primaryText.length);primaryText+=s.excerpt+'\n';}
 const originalById=new Map(inventory.units.map(u=>[u.id,u]));
 const claims=[],audit=[];
 for(const unit of baselinePack.units){const row=byId.get(unit.id),original=originalById.get(unit.id);
  if(!row)throw Error('Missing baseline unit review: '+unit.id);
  for(const key of ['rationale','prerequisiteRationale'])required(row[key],unit.id+'.'+key);
  if(!Array.isArray(row.prerequisiteIds))throw Error('Explicit reviewed prerequisites required');
  for(const key of ['explanation'])for(const lang of ['zh','en'])required(row[key]?.[lang],unit.id+'.'+key+'.'+lang);
  for(const key of ['examples','misconceptions']){if(!Array.isArray(row[key]))throw Error('Reviewed bilingual arrays required');for(const x of row[key])for(const lang of ['zh','en'])required(x[lang],unit.id+'.'+key+'.'+lang);}
  if(original.example&&!row.examples.length)throw Error('Original example silently dropped: '+unit.id);
  if(original.boundary&&!row.misconceptions.length)throw Error('Original boundary silently dropped: '+unit.id);
  if(!['supported','needs-review','gap'].includes(row.status))throw Error('Invalid review status');
  if(!Array.isArray(row.missing)||!Array.isArray(row.requiredMaterial)||!Array.isArray(row.evidence))throw Error('Explicit gap and evidence arrays required');
  if(row.status==='supported'&&(row.missing.length||!row.evidence.length))throw Error('Supported unit needs independent evidence and no unresolved core gaps: '+unit.id);
  if(row.status!=='supported'&&(!row.missing.length||!row.requiredMaterial.length))throw Error('Unresolved unit needs an actionable gap: '+unit.id);
  const evidence=row.evidence.map(e=>{const s=bySource.get(e.sourceId);if(!s||typeof e.quote!=='string'||e.quote.length<6||!s.excerpt.includes(e.quote))throw Error('Review source mismatch: '+unit.id);const start=sourcePositions.get(s.id)+s.excerpt.indexOf(e.quote);return {materialId:primaryMaterialId,locator:`UTF16:${start}-${start+e.quote.length}`,quote:e.quote};});
  claims.push({...unit,title:row.title||unit.title,explanation:row.explanation,examples:row.examples,misconceptions:row.misconceptions,prerequisiteIds:row.prerequisiteIds,status:row.status,evidence});
  audit.push({...row,originalStatus:unit.status,changedFields:['title','explanation','examples','misconceptions','prerequisiteIds','status'].filter(k=>JSON.stringify(unit[k])!==JSON.stringify(claims.at(-1)[k])),originalPrerequisiteIds:unit.prerequisiteIds,originalReferences:original.references||[],exampleProvenance:'Authored teaching illustrations, not quotations from external sources.',reviewType:'AI domain and bilingual review; no claim of human certification.'});
 }
 let teachingText='# Revised bilingual teaching explanations\nOriginal teaching examples; not official question text.\n';
 for(const u of claims){teachingText+=`\n## ${u.id}\nZH: ${u.explanation.zh}\nEN: ${u.explanation.en}\n`;if(!u.evidence.length){const start=teachingText.indexOf(u.explanation.zh,teachingText.lastIndexOf('## '+u.id));u.evidence=[{materialId:teachingMaterialId,locator:`UTF16:${start}-${start+u.explanation.zh.length}`,quote:u.explanation.zh}];}}
 const bundle=K.createMaterialBundle([...baselineBundle.materials,{id:primaryMaterialId,name:'Primary-source excerpts with URLs and check dates',text:primaryText},{id:teachingMaterialId,name:'Reviewed bilingual teaching explanations (authored)',text:teachingText}],{id:baselineBundle.id,revision:nextRevision});
 const result=K.assembleKnowledge(bundle,{objectives:baselinePack.objectives,claims},{id:baselinePack.id,revision:baselinePack.revision+1});
 if(result.pack.units.length!==rows.length)throw Error('Reviewed unit IDs must remain one-to-one; unexpected deduplication');
 if(result.pack.units.some(u=>u.status!==byId.get(u.id).status))throw Error('Review statuses conflict with assembly diagnostics');
 // A mapped objective can still have substantively unsupported units. Do not hide these
 // gaps merely because every objective has at least one unit ID.
 result.pack.gaps=audit.filter(r=>r.status!=='supported').map(r=>({objectiveId:baselinePack.units.find(u=>u.id===r.unitId).objectiveIds[0],missing:r.unitId+': '+r.missing.join('；'),requiredMaterial:r.requiredMaterial.join('；')}));
 result.diagnostics=C.validateKnowledge(result.pack,bundle);
 const statusCounts=Object.fromEntries(['supported','needs-review','gap'].map(s=>[s,result.pack.units.filter(u=>u.status===s).length]));
 const coverage=result.pack.objectives.map(o=>{const units=result.pack.units.filter(u=>o.unitIds.includes(u.id));return {objectiveId:o.id,unitIds:o.unitIds,supported:units.filter(u=>u.status==='supported').length,unresolved:units.filter(u=>u.status!=='supported').map(u=>u.id),status:units.every(u=>u.status==='supported')?'supported':units.some(u=>u.status==='supported')?'partial':'gap'};});
 return {bundle,pack:result.pack,analysis:{schemaVersion:1,inputInventoryHash,materialRevision:bundle.revision,knowledgeRevision:result.pack.revision,summary:{units:claims.length,objectives:baselinePack.objectives.length,sources:sources.length,...statusCounts,gaps:result.pack.gaps.length},sources,audit,diagnostics:result.diagnostics,coverage,accessLimitations:['No private AWS course bodies, official question explanations or full paid standards were obtained.','Primary sources support individual assertions; they do not certify complete official syllabus coverage.','Supported means AI-reviewed core explanation with primary-source support, not human approval or official endorsement.']}};
}
function writeReviewedCorpus(result,out){const fs=require('node:fs'),path=require('node:path');
 const unexpected=C.validateKnowledge(result.pack,result.bundle).filter(d=>d.severity==='error'&&d.code!=='knowledge.gap');C.assertValid(unexpected);
 const suffix='v'+result.pack.revision;
 for(const [name,data]of [['materials',result.bundle],['knowledge',result.pack],['analysis',result.analysis]])fs.writeFileSync(path.join(out,name+'.'+suffix+'.json'),JSON.stringify(data,null,2)+'\n');
 const byId=new Map(result.pack.units.map(u=>[u.id,u])),bySource=new Map(result.analysis.sources.map(s=>[s.id,s]));
 fs.writeFileSync(path.join(out,'gaps.'+suffix+'.json'),JSON.stringify(result.analysis.audit.filter(r=>r.status!=='supported').map(r=>({unitId:r.unitId,status:r.status,missing:r.missing,requiredMaterial:r.requiredMaterial})),null,2)+'\n');
 const markdown=[`# A 全量知识单元领域与双语审校（revision ${result.pack.revision}）`,'',JSON.stringify(result.analysis.summary),'','本文件由审校记录生成。supported 表示核心解释有一手资料支持并经 AI 双语审校，不等于官方背书或人工认证。例子均为教学例示。未决缺口阻断完整课程编译。',''];
 for(const row of result.analysis.audit){const u=byId.get(row.unitId);markdown.push(`## ${u.id} · ${u.title.zh} / ${u.title.en}`,'',`状态：${u.status}`,``,u.explanation.zh,'',u.explanation.en,'',...u.examples.map(x=>`例子（教学例示）：${x.zh}\n\nExample (authored illustration): ${x.en}\n`),...u.misconceptions.map(x=>`易混边界：${x.zh}\n\nBoundary: ${x.en}\n`),`审校：${row.rationale}`,'',`先修：${u.prerequisiteIds.join(', ')||'无硬性先修'}；${row.prerequisiteRationale}`,'',...row.evidence.map(e=>{const s=bySource.get(e.sourceId);return `- 来源：[${s.title}](${s.url})；摘录键 ${s.id}（原文见 materials.${suffix} / analysis.${suffix}，不重复摘录）。`;}),'',...row.missing.map(m=>'- 缺口：'+m),...row.requiredMaterial.map(m=>'- 所需材料：'+m),'');}
 fs.writeFileSync(path.join(out,'review.'+suffix+'.md'),markdown.join('\n')+'\n');
}
module.exports={buildReviewedCorpus,writeReviewedCorpus};
if(require.main===module){const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'../..'),read=p=>JSON.parse(fs.readFileSync(p,'utf8')),out=path.join(__dirname,'generated'),reviewDir=path.join(__dirname,'review');
 const raw=fs.readFileSync(path.join(root,'content/knowledge-inventory.json'),'utf8'),manifest=read(path.join(reviewDir,'manifest.json'));
 const result=buildReviewedCorpus({baselineBundle:read(path.join(out,'materials.v1.json')),baselinePack:read(path.join(out,'knowledge.v1.json')),inventory:JSON.parse(raw),inputInventoryHash:C.digest(raw),expectedInventoryHash:manifest.inputInventoryHash,baselineMaterialRevision:manifest.baselineMaterialRevision,baselineKnowledgeRevision:manifest.baselineKnowledgeRevision,reviews:['domain1.json','domain2.json','domain34.json'].map(f=>read(path.join(reviewDir,f)))});
 writeReviewedCorpus(result,out);console.log(JSON.stringify(result.analysis.summary));
}
