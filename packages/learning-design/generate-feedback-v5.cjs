'use strict';
const fs=require('node:fs'),path=require('node:path'),C=require('../contracts');
const {buildFeedbackCatalog,buildReplacementRegister}=require('./feedback-catalog.v5.cjs'),hash=x=>C.digest(JSON.stringify(x));
function prepareFeedback(){
 const {knowledgePack:pack}=require('../course-compiler/enrich-aib.cjs').enrichedAib(),base=require('./generated/aib-manifest.v5.json');
 const blueprint=require('./generated/aib-blueprint.v5.json'),logic=require('./generated/teaching-logic.v5.json'),legacy=require('./generated/legacy-teaching-logic.v5.json'),audits=require('./generated/unit-teaching-audit.v5.json');
 for(const [actual,expected]of [[hash(pack),base.input.hash],[hash(blueprint),base.blueprintHash],[hash(logic),base.logicHash],[hash(legacy),base.legacyHash],[hash(audits),base.unitAuditHash]])if(actual!==expected)throw Error('B5 feedback base binding changed');
 const feedback=buildFeedbackCatalog(pack,logic,legacy),replacements=buildReplacementRegister(blueprint,audits,legacy);
 const manifest={schemaVersion:1,revision:5,format:'b-c-feedback-manifest',baseManifestHash:hash(base),knowledgeHash:hash(pack),planHash:base.output.hash,feedbackHash:hash(feedback),replacementHash:hash(replacements),diagnosticRuntimeHash:C.digest(fs.readFileSync(path.join(__dirname,'teaching-logic.v5.cjs'),'utf8')),activeRounds:feedback.activeEntries.length,archivedRounds:feedback.archivedEntries.length,replacedAibUnits:replacements.aib.length,replacedLegacySections:replacements.legacy.length};
 return {feedback,replacements,manifest};
}
function generateFeedback({reviewed=false}={}){
 const r=prepareFeedback();
 if(reviewed){const review=require('./authored/feedback-review.v5.json');if(review.accepted!==true||hash(review.binding)!==hash(r.manifest))throw Error('Feedback review binding differs');}
 const dir=path.join(__dirname,reviewed?'candidates/feedback-v5/reviewed':'candidates/feedback-v5');fs.mkdirSync(dir,{recursive:true});
 for(const [key,name]of Object.entries({feedback:'item-feedback.v5.json',replacements:'replacement-register.v5.json',manifest:'feedback-manifest.v5.json'}))fs.writeFileSync(path.join(dir,name),JSON.stringify(r[key],null,2)+'\n');
 console.log(JSON.stringify(r.manifest,null,2));return r;
}
if(require.main===module){try{generateFeedback({reviewed:process.argv.includes('--reviewed')});}catch(e){console.error(e.message);process.exitCode=1;}}
module.exports={prepareFeedback,generateFeedback};
