'use strict';
const C=require('../contracts');
function createMaterialBundle(materials,{id='materials',revision=1}={}){const bundle={schemaVersion:1,id,revision,materials:materials.map((m,i)=>({id:m.id||'material-'+(i+1),name:m.name,text:m.text,contentHash:C.digest(m.text)}))};C.assertValid(C.validateMaterialBundle(bundle));return bundle;}
async function buildKnowledge(bundle,{extract,signal}={}){C.assertValid(C.validateMaterialBundle(bundle));if(typeof extract!=='function')throw Error('需要提供知识提取适配器 extract；模型调用和密钥由服务模块注入。');signal?.throwIfAborted();const pack=await extract(structuredClone(bundle),{signal});signal?.throwIfAborted();try{C.assertValid(C.validateKnowledge(pack,bundle));}catch(error){error.candidate=pack;throw error;}return pack;}
module.exports={createMaterialBundle,buildKnowledge,validateKnowledge:C.validateKnowledge,...require('./prompts.cjs')};
