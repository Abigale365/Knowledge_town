'use strict';
const C=require('../contracts');
const {createDesignAdapter}=require('./designer.cjs');
function createAibDesignAdapter({revision=1}={}){
 if(![1,3,4,5].includes(revision))throw Error('Unsupported reviewed AIB revision');
 const blueprint=require('./generated/aib-blueprint.v'+revision+'.json'),manifest=require('./generated/aib-manifest.v'+revision+'.json');
 const design=createDesignAdapter(blueprint);
 return async(pack,options={})=>{
  options.signal?.throwIfAborted();
  if(pack.id!==manifest.input.id||pack.revision!==manifest.input.revision||C.digest(JSON.stringify(pack))!==manifest.input.hash)
   throw Error('AIB knowledge snapshot changed; regenerate and review the teaching blueprint.');
  const plan=await design(pack,options);
  if(revision===4)require('./authored/section-designs.v4.cjs').decorate(plan);
  if(revision===5)require('./authored/section-designs.v5.cjs').decorate(plan,require('./generated/unit-teaching-audit.v5.json'));
  if(C.digest(JSON.stringify(plan))!==manifest.output.hash)
   throw Error('Teaching blueprint differs from the reviewed output manifest; regenerate and review artifacts together.');
  return plan;
 };
}
module.exports={createAibDesignAdapter};
