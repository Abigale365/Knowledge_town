'use strict';
const C=require('../../contracts');
const {bilingualNumberFindings}=require('./bilingual-numbers.cjs');
function normalized(value){
 if(typeof value!=='string')return '';
 let text=value.normalize('NFKC').replace(/<\/?(?:span|strong|em)\b[^>]*>/gi,'').replace(/<\/?(?:p|div|li|blockquote|br)\b[^>]*>/gi,' ').trim();
 text=text.replace(/^(\*\*|__)(学习目标|学习目的|目标|learning\s+objectives?|objectives?)\s*[:：]\1\s*/i,'');
 for(let i=0;i<4;i++)text=text.replace(/^\s*(?:#{1,6}\s+|>\s*|[-*+]\s+)/,'').replace(/^(\*\*|__|\*|_)([\s\S]*)\1$/,'$2').trim().replace(/^(?:学习目标|学习目的|目标|learning\s+objectives?|objectives?)\s*[:：]\s*/i,'');
 return text.replace(/[\s。.!！?？;；]+$/g,'').replace(/\s+/g,' ').trim();
}
const caseScoped=text=>typeof text==='string'&&/(?:本演练|本案例|本示例|本例|假设|this (?:example|exercise|case|illustration)|hypothetical)/i.test(text);
const universal=text=>typeof text==='string'&&/(?:任何|一律|永远|必定|所有.{0,24}必须|\bevery\b|\balways\b|\bnever\b|\ball\b.{0,60}\bmust\b)/i.test(text);
const empiricalAssertion=text=>typeof text==='string'&&/(?:实际(?:试点|实验|研究|调查|运行|测试)?数据(?:显示|表明|证明)|实测(?:结果|数据)(?:显示|表明|证明)|observed (?:pilot |study |experimental )?data (?:show|demonstrate|confirm)|real[- ]world (?:pilot |study )?data (?:show|demonstrate|confirm))/i.test(text);
/** Extra, opt-in import diagnostics. Does not change frozen validation or the pack. */
function auditImportedKnowledge(pack,bundle){
 const diagnostics=C.validateKnowledge(pack,bundle),candidateGaps=[];
 const goals=new Map((Array.isArray(pack?.objectives)?pack.objectives:[]).filter(o=>o&&typeof o==='object').map(o=>[o.id,o]));
 const materials=new Map((Array.isArray(bundle?.materials)?bundle.materials:[]).filter(m=>m&&typeof m==='object').map(m=>[m.id,m]));
 for(const [i,unit]of (Array.isArray(pack?.units)?pack.units:[]).entries()){
  if(!unit||typeof unit!=='object')continue;
  diagnostics.push(...bilingualNumberFindings(unit,i));
  const unitGoals=(Array.isArray(unit.objectiveIds)?unit.objectiveIds:[]).map(id=>goals.get(id)).filter(Boolean);
  const copiedGoals=unitGoals.filter(o=>['zh','en'].some(lang=>{const explanation=normalized(unit.explanation?.[lang]);return explanation&&explanation===normalized(o.title?.[lang]);}));
  const copiedLanguages=['zh','en'].filter(lang=>{const explanation=normalized(unit.explanation?.[lang]);return explanation&&copiedGoals.some(o=>explanation===normalized(o.title?.[lang]));});
  if(copiedLanguages.length){diagnostics.push({severity:'error',code:'candidate.objective-as-explanation',path:`knowledge.units[${i}].explanation`,message:`${copiedLanguages.join('/')}解释与关联学习目标原样相同；目标陈述不是正文定义，需补可核对的知识解释。`,...(unit.evidence?.[0]?.materialId?{sourceId:unit.evidence[0].materialId}:{})});
   for(const goal of copiedGoals)candidateGaps.push({unitId:unit.id,objectiveId:goal.id,missing:'学习目标被原样用作解释，尚未提供学习内容。',requiredMaterial:'提供定义、原理或步骤正文及对应原文位置，并完成中英审校。'});
  }
  const evidence=Array.isArray(unit.evidence)?unit.evidence:[];
  if(evidence.length&&evidence.every(e=>caseScoped(e?.quote))){
   for(const lang of ['zh','en'])if(universal(unit.explanation?.[lang])&&!caseScoped(unit.explanation?.[lang]))diagnostics.push({severity:'warning',code:'candidate.case-generalization',path:`knowledge.units[${i}].explanation.${lang}`,message:'引用均带案例或假设限定，解释含无案例限定的全称表述；需人工核对是否越过证据范围。此提示不是自动事实裁决。'});
   for(const lang of ['zh','en'])if(empiricalAssertion(unit.explanation?.[lang]))diagnostics.push({severity:'warning',code:'candidate.case-as-observation',path:`knowledge.units[${i}].explanation.${lang}`,message:'检测到实际/实测数据相关措辞，引用均带案例或假设限定；请结合否定、引用及上下文人工核对。若确实声称实际结果，需核对真实记录、方法、样本与测量结果。案例不必然虚构，不自动认定造假。'});
  }
  for(const [j,e]of (Array.isArray(unit.evidence)?unit.evidence:[]).entries()){
   if(typeof e?.locator!=='string'||!/^UTF16:/i.test(e.locator))continue;
   const position=/^UTF16:(\d+)-(\d+)$/i.exec(e.locator);
   if(!position){diagnostics.push({severity:'error',code:'candidate.evidence-offset',path:`knowledge.units[${i}].evidence[${j}].locator`,message:'声明为UTF16的定位器必须使用非负整数的起止偏移。',sourceId:e.materialId});continue;}
   const start=Number(position[1]),end=Number(position[2]),text=materials.get(e.materialId)?.text;
   if(typeof text==='string'&&(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start<0||end<=start||end>text.length||text.slice(start,end)!==e.quote))diagnostics.push({severity:'error',code:'candidate.evidence-offset',path:`knowledge.units[${i}].evidence[${j}].locator`,message:'UTF16位置与所引用原文不一致；仅在全文找到相同句子不能证明该位置正确。',sourceId:e.materialId});
  }
 }
 return {schemaVersion:1,kind:'opt-in-import-audit',materialBundleId:bundle?.id,materialRevision:bundle?.revision,knowledgePackId:pack?.id,knowledgeRevision:pack?.revision,diagnostics,candidateGaps,requiresScopeReview:diagnostics.some(d=>d.code==='candidate.case-generalization'),requiresEmpiricalEvidenceReview:diagnostics.some(d=>d.code==='candidate.case-as-observation'),limitations:['仅识别常见格式包装的原样目标和明确UTF16位置错配；不证明任意改写定义、双语语义或引文蕴含正确。','案例泛化和实测声称仅按显式词语提示人工复核，可能漏报或误报，不改变知识状态；反例可合法反驳全称命题，案例也可能是真实案例。','自由文本locator继续按冻结契约处理，候选不假定它们使用字符偏移。'],readyForSemanticReview:!diagnostics.some(d=>d.severity==='error')};
}
module.exports={auditImportedKnowledge};
if(require.main===module){const fs=require('node:fs');const [packPath,bundlePath]=process.argv.slice(2);if(!packPath||!bundlePath)throw Error('Usage: node candidates/audit-import.cjs <knowledge.json> <materials.json>');const result=auditImportedKnowledge(JSON.parse(fs.readFileSync(packPath,'utf8')),JSON.parse(fs.readFileSync(bundlePath,'utf8')));console.log(JSON.stringify(result,null,2));if(!result.readyForSemanticReview)process.exitCode=1;}
