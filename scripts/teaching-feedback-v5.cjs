'use strict';
const fs=require('node:fs'),C=require('../packages/contracts');
const hash=x=>C.digest(JSON.stringify(x));
function feedbackCatalog(){
 const root='../packages/learning-design/',read=p=>require(root+p),base=read('generated/aib-manifest.v5.json'),manifest=read('candidates/feedback-v5/reviewed/feedback-manifest.v5.json'),review=read('authored/feedback-review.v5.json'),data=read('candidates/feedback-v5/reviewed/item-feedback.v5.json'),replacement=read('candidates/feedback-v5/reviewed/replacement-register.v5.json');
 if(!review.accepted||hash(review.binding)!==hash(manifest)||manifest.baseManifestHash!==hash(base)||manifest.knowledgeHash!==base.input.hash||manifest.planHash!==base.output.hash||manifest.feedbackHash!==hash(data)||manifest.replacementHash!==hash(replacement)||manifest.diagnosticRuntimeHash!==C.digest(fs.readFileSync(require.resolve(root+'teaching-logic.v5.cjs'),'utf8')))throw Error('Unreviewed B5 feedback binding');
 const logic=read('generated/teaching-logic.v5.json'),legacy=read('generated/legacy-teaching-logic.v5.json'),rounds={};
 for(const s of logic.sections)for(const e of [s.guidedPractice,...s.independentApplication.rounds])rounds['aib/'+s.id+'/'+e.stage+'/'+e.id]=e.round;
 for(const s of legacy.chapters.flatMap(c=>c.sections))for(const r of s.independentActivity.rounds)rounds['legacy/'+s.id+'/'+r.id]=r;
 const entries={},hashes={};
 for(const e of data.activeEntries){const round=rounds[e.key];if(!round||e.archiveOnly||e.roundHash!==hash(round)||e.roundId!==round.id)throw Error('Feedback round binding: '+e.key);entries[e.key]={round,feedback:e};hashes[JSON.stringify(round)]=e.roundHash;}
 if(Object.keys(entries).length!==manifest.activeRounds||Object.keys(rounds).length!==manifest.activeRounds)throw Error('Incomplete B5 feedback');
 return {entries,hashes};
}
module.exports={feedbackCatalog};
