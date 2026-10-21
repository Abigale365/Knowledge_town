'use strict';
const C=require('../contracts');
const hash=s=>C.digest(s).slice(0,20);
const normalize=s=>s.normalize('NFKC').replace(/\s+/g,' ').trim();
function segmentMaterials(bundle,{maxChars=2400}={}){
 C.assertValid(C.validateMaterialBundle(bundle));
 if(!Number.isInteger(maxChars)||maxChars<32)throw Error('maxChars must be an integer >=32');
 const segments=[];
 for(const m of bundle.materials){let heading='';let start=0;
  for(const line of m.text.matchAll(/[^\n]+(?:\n|$)|\n/g)){
   const text=line[0];if(/^#{1,6}\s/.test(text))heading=text.trim();
   for(let offset=0;offset<text.length;offset+=maxChars){const body=text.slice(offset,offset+maxChars);if(!body.trim())continue;
    start=line.index+offset;segments.push({id:'seg-'+hash(m.id+':'+start),materialId:m.id,heading,start,end:start+body.length,text:body,locator:`UTF16:${start}-${start+body.length}`});}
  }
 }
 return segments;
}
// Annotation format is private to A; output remains the frozen KnowledgePack v1.
function assembleKnowledge(bundle,{objectives,claims},{id='knowledge',revision=1}={}){
 C.assertValid(C.validateMaterialBundle(bundle));claims=structuredClone(claims);
 const units=[],byKey=new Map(),aliases=new Map(),diagnostics=[];
 const goals=objectives.map(o=>({id:o.id,title:o.title,unitIds:[]}));
 for(const claim of claims){
  const key=normalize(claim.title.zh)+'|'+normalize(claim.explanation.zh)+'|'+normalize(claim.explanation.en);
  if(byKey.has(key)){const u=byKey.get(key);aliases.set(claim.id,u.id);u.objectiveIds=[...new Set([...u.objectiveIds,...claim.objectiveIds])];u.evidence.push(...claim.evidence);u.examples.push(...(claim.examples||[]));u.misconceptions.push(...(claim.misconceptions||[]));u.prerequisiteIds.push(...(claim.prerequisiteIds||[]));if(claim.status!=='supported')u.status='needs-review';continue;}
  const u={...claim,examples:claim.examples||[],misconceptions:claim.misconceptions||[],prerequisiteIds:claim.prerequisiteIds||[],status:claim.status||'needs-review'};
  units.push(u);byKey.set(key,u);aliases.set(u.id,u.id);
 }
 for(const u of units){u.prerequisiteIds=[...new Set(u.prerequisiteIds.filter(x=>x===u.id||(aliases.get(x)||x)!==u.id).map(x=>aliases.get(x)||x))];for(const key of ['examples','misconceptions','evidence'])u[key]=[...new Map(u[key].map(e=>[JSON.stringify(e),e])).values()];
  for(const e of u.evidence){const m=bundle.materials.find(m=>m.id===e.materialId),position=/^UTF16:(\d+)-(\d+)$/.exec(e.locator||'');if(position&&m?.text.slice(Number(position[1]),Number(position[2]))===e.quote)continue;const offset=m?.text.indexOf(e.quote)??-1;if(offset>=0)e.locator=`UTF16:${offset}-${offset+e.quote.length}`;}
  for(const goal of goals)if(u.objectiveIds.includes(goal.id))goal.unitIds.push(u.id);
 }
 // Differing accounts of the same title are retained for review, never silently overwritten.
 for(const u of units)if(units.some(v=>v.id!==u.id&&normalize(v.title.zh)===normalize(u.title.zh))){u.status='needs-review';diagnostics.push({severity:'warning',code:'knowledge.possible-conflict',path:u.id,message:'同名解释不同，需核对适用范围与来源；不能自动裁决。'});}
 const gaps=goals.filter(o=>!o.unitIds.length).map(o=>({objectiveId:o.id,missing:o.title.zh,requiredMaterial:'提供该目标的正文、双语解释和可定位依据；不能使用目标自身作为定义。'}));
 const pack={schemaVersion:1,id,revision,materialBundleId:bundle.id,materialRevision:bundle.revision,objectives:goals,units,gaps};
 return {pack,diagnostics:[...diagnostics,...C.validateKnowledge(pack,bundle)],coverage:goals.map(o=>({objectiveId:o.id,unitIds:o.unitIds,status:o.unitIds.length?'mapped':'gap'}))};
}
function createExtractionAdapter({identify,extractSegment,onAnalysis=()=>{},maxChars=2400}={}){
 if(typeof identify!=='function'||typeof extractSegment!=='function')throw Error('identify and extractSegment callbacks are required');
 return async(bundle,{signal}={})=>{
  signal?.throwIfAborted();const segments=segmentMaterials(bundle,{maxChars});
  const objectives=await identify(structuredClone(segments),{signal});signal?.throwIfAborted();const claims=[];
  for(const segment of segments){signal?.throwIfAborted();const found=await extractSegment(structuredClone(segment),{objectives:structuredClone(objectives),signal});signal?.throwIfAborted();
   for(const claim of found){if(!claim.evidence?.length||claim.evidence.some(e=>e.materialId!==segment.materialId||!segment.text.includes(e.quote)))throw Object.assign(Error('Evidence must belong to the supplied segment'),{code:'KNOWLEDGE_SOURCE_MISMATCH',candidate:claim});for(const e of claim.evidence){const start=segment.start+segment.text.indexOf(e.quote);e.locator=`UTF16:${start}-${start+e.quote.length}`;}claims.push(claim);}
  }
  const result=assembleKnowledge(bundle,{objectives,claims});onAnalysis(structuredClone(result));return result.pack;
 };
}
module.exports={segmentMaterials,assembleKnowledge,createExtractionAdapter};
