'use strict';
const C=require('../contracts'),sources=require('./aib-source-additions.v3.json');
function enrichedAib(){
 const inputBundle=require('../knowledge/generated/materials.v3.json'),inputPack=require('../knowledge/generated/knowledge.v3.json');C.assertValid(C.validateKnowledge(inputPack,inputBundle));
 const materialBundle=structuredClone(inputBundle),knowledgePack=structuredClone(inputPack);materialBundle.id='aib-materials-integration';knowledgePack.id='aib-knowledge-integration';knowledgePack.materialBundleId=materialBundle.id;
 const text=sources.map(s=>s.id+'\n'+s.title+'\n'+s.url+'\n'+s.quote+'\nScope: '+s.scope).join('\n\n'),material={id:'integration-evidence-v3',name:'D integration: primary evidence additions',text,contentHash:C.digest(text)};materialBundle.materials.push(material);
 const byId=new Map(knowledgePack.units.map(u=>[u.id,u]));for(const s of sources)for(const id of s.units){const u=byId.get(id);if(!u)throw Error('Unknown evidence target '+id);u.evidence.unshift({materialId:material.id,locator:s.url,quote:s.quote});}
 C.assertValid(C.validateKnowledge(knowledgePack,materialBundle));return {materialBundle,knowledgePack,provenance:{sourceMaterialHash:C.digest(JSON.stringify(inputBundle)),sourceKnowledgeHash:C.digest(JSON.stringify(inputPack)),sourceRevision:3,evidenceAdditions:sources.map(s=>({id:s.id,url:s.url,unitIds:s.units,scope:s.scope}))}};
}
module.exports={enrichedAib};
