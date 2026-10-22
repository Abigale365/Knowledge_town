'use strict';
// Authored by topic, not a fixed card count. These are alternate entry points to
// already reviewed guided exercises, not additional exams or extra required rounds.
const legacyGroups={
 '1.1':['1.1','1.3','1.4','1.5','1.2','1.6'],
 '1.2':['1.7','1.8','1.9'],'1.3':['1.10','1.11','1.12'],
 '2.1':['2.1','2.2'],'2.2':['2.3','2.4','2.5','2.6'],'2.3':['2.7','2.8'],
 '3.1':['3.1','3.2'],'3.2':['3.3','3.4'],'3.3':['3.5','3.6','3.7'],
 '4.1':['4.1','4.2'],'4.2':['4.3','4.4'],'4.3':['4.5','4.6','4.7'],
 '4.4':['4.8','4.9','4.10','4.11']
};
function buildMicroCheckpoints(pack,logic,legacy){
 const byId=new Map(pack.units.map(u=>[u.id,u]));
 const needed=ids=>{const out=[],seen=new Set();function visit(id){if(seen.has(id))return;seen.add(id);const u=byId.get(id);if(!u)throw Error('Unknown micro-practice knowledge '+id);u.prerequisiteIds.forEach(visit);out.push(id);}ids.forEach(visit);return out;};
 const reference=s=>({id:'micro-'+s.compiledSectionId.replace('.','-'),sourceSectionId:s.id,compiledSectionId:s.compiledSectionId,
  exerciseRef:{artifact:'teaching-logic.v5.json',sectionId:s.id,field:'guidedPractice'},
  topicKnowledgeIds:[...s.guidedPractice.round.unitIds],requiredReviewedKnowledgeIds:needed(s.guidedPractice.round.unitIds),
  label:{zh:'学完这一组，轻松试一试',en:'After this topic, try a short practice'},
  learningDecision:s.guidedPractice.learnerDecision,countsAsMastery:false,countsAsCollection:false,
  availability:'after-listed-knowledge-reviewed; before-whole-section-reading-is-finished',
  interaction:'reuse-guided-exercise-once; retain-draft-and-show-linked-knowledge',
  consequence:'no-score-penalty-no-life-loss-no-collection-gate',requiredForFormalUnlock:false,
  feedback:'diagnoseRound; reveal reasoning on request; assisted-correction-never-independent-credit'});
 return {schemaVersion:1,format:'b-c-micro-checkpoints',revision:5,binding:structuredClone(logic.binding),
  policy:{basis:'topic-dependencies-not-every-N-cards',review:'knowledge-and-source-always-readable',
   sameExercise:'One guided exercise may be entered early or from the later guided panel; never require a duplicate attempt.',
   sequence:'knowledge-before-judgment; independent-application-after-section-foundations; whole-chapter-formal-90-percent',
   existingFinding:'Retain real discovery, optional favorites, filing and material-box review. Micro practice does not replace them.'},
  aib:logic.sections.map(s=>({sectionId:s.id,compiledSectionId:s.compiledSectionId,checkpoints:[reference(s)]})),
  legacy:legacy.chapters.flatMap(c=>c.sections).map(s=>({sectionId:s.id,checkpoints:legacyGroups[s.id].map(id=>{
   const item=reference(logic.sections.find(x=>x.compiledSectionId===id));
   if(item.topicKnowledgeIds.some(id=>!s.necessaryKnowledgeIds.includes(id)))throw Error('Micro topic outside legacy section '+s.id);
   return item;
  })}))};
}
function canOfferMicro(checkpoint,{reviewedUnitIds=[]}={}){return checkpoint.requiredReviewedKnowledgeIds.every(id=>reviewedUnitIds.includes(id));}
module.exports={buildMicroCheckpoints,canOfferMicro};
