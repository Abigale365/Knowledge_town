'use strict';
const {base,list,unique,record,isId,text,localized,refs,positive,diagnostic}=require('./core.cjs');
const {validateMaterialBundle}=require('./materials.cjs');
function validateKnowledge(pack,bundle){
 const out=base(pack,'knowledge'),units=list(pack?.units),objectives=list(pack?.objectives);
 if(!units.length||units.length>1000)out.push(diagnostic('knowledge.units','knowledge.units','需1至1000个知识单元'));
 if(!objectives.length)out.push(diagnostic('knowledge.objectives','knowledge.objectives','需要明确学习目标'));
 unique(units,'knowledge.units',out);unique(objectives,'knowledge.objectives',out);
 const byUnit=new Map(units.filter(record).map(u=>[u.id,u])),byGoal=new Map(objectives.filter(record).map(o=>[o.id,o]));
 const materials=new Map(list(bundle?.materials).filter(record).map(m=>[m.id,m]));
 if(!isId(pack?.materialBundleId)||!positive(pack?.materialRevision))out.push(diagnostic('knowledge.bundle','knowledge.materialRevision','缺少有效资料包ID或正整数来源版本'));
 if(bundle){out.push(...validateMaterialBundle(bundle));if(pack?.materialBundleId!==bundle.id||pack?.materialRevision!==bundle.revision)out.push(diagnostic('knowledge.stale','knowledge','资料版本与知识包不对应'));}
 for(const [i,u]of units.entries()){
  const p='knowledge.units['+i+']';if(!record(u)){out.push(diagnostic('shape',p,'知识单元必须是对象'));continue;}
  for(const key of ['title','explanation','category'])if(!localized(u[key]))out.push(diagnostic('knowledge.translation',p+'.'+key,'需要完整中英文'));
  if(localized(u.title)&&(u.title.zh.length>150||u.title.en.length>150)||localized(u.explanation)&&(u.explanation.zh.length>4000||u.explanation.en.length>4000))out.push(diagnostic('knowledge.length',p,'标题最多150字，单元解释最多4000字'));
  for(const key of ['examples','misconceptions'])if(!Array.isArray(u[key])||!u[key].every(localized)||['zh','en'].some(lang=>list(u[key]).filter(localized).map(v=>v[lang]).join('\n').length>1500))out.push(diagnostic('knowledge.details',p+'.'+key,'需双语数组，每种语言合计最多1500字'));
  if(!refs(u.objectiveIds)||!u.objectiveIds.length||u.objectiveIds.some(id=>!byGoal.has(id)||!list(byGoal.get(id).unitIds).includes(u.id)))out.push(diagnostic('knowledge.mapping',p+'.objectiveIds','知识与目标必须双向对应'));
  if(!refs(u.prerequisiteIds)||u.prerequisiteIds.some(id=>id===u.id||!byUnit.has(id)))out.push(diagnostic('knowledge.prerequisite',p+'.prerequisiteIds','先修知识不存在、重复或引用自身'));
  if(!['supported','gap','needs-review'].includes(u.status))out.push(diagnostic('knowledge.status',p+'.status','知识状态无效'));
  if(u.status==='gap')out.push(diagnostic('knowledge.gap',p,'知识缺口尚未补齐'));
  if(u.status==='needs-review')out.push(diagnostic('knowledge.review',p,'教学内容仍需人工审阅','warning'));
  if(!Array.isArray(u.evidence)||!u.evidence.length)out.push(diagnostic('knowledge.evidence',p+'.evidence','每个单元必须有原文依据'));
  for(const [j,e]of list(u.evidence).entries()){
   const ep=p+'.evidence['+j+']';if(!record(e)||!isId(e.materialId)||!text(e.locator)||!text(e.quote)||e.quote.length<6||e.quote.length>4000){out.push(diagnostic('knowledge.evidence',ep,'引用需包含资料ID、位置和6至4000字原文'));continue;}
   if(bundle&&!materials.get(e.materialId)?.text?.includes?.(e.quote))out.push(diagnostic('knowledge.quote',ep,'引用无法在对应资料逐字核对','error',e.materialId));
  }
 }
 for(const [i,o]of objectives.entries())if(!record(o)||!localized(o.title)||!refs(o.unitIds)||!o.unitIds.length||o.unitIds.some(id=>!byUnit.has(id)||!list(byUnit.get(id).objectiveIds).includes(o.id)))out.push(diagnostic('knowledge.coverage','knowledge.objectives['+i+']','目标未被知识完整、双向覆盖'));
 const active=new Set(),done=new Set();
 function visit(id){if(active.has(id))return true;if(done.has(id))return false;active.add(id);for(const next of list(byUnit.get(id)?.prerequisiteIds))if(byUnit.has(next)&&visit(next))return true;active.delete(id);done.add(id);return false;}
 if([...byUnit.keys()].some(visit))out.push(diagnostic('knowledge.cycle','knowledge.units','先修关系不能形成循环'));
 if(!Array.isArray(pack?.gaps))out.push(diagnostic('knowledge.gaps','knowledge.gaps','需要明确缺口清单'));else if(pack.gaps.length)out.push(diagnostic('knowledge.gap','knowledge.gaps','资料仍有未解决缺口，不能编译课程'));
 return out;
}
module.exports={validateKnowledge};
