'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const digest=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
function verify(root,profile,read=(file)=>fs.readFileSync(file)){
 if(profile?.schemaVersion!==1||profile.selection!=='reviewed-extension-1'||!/^[a-f0-9]{64}$/.test(profile.reviewHash)||!/^[a-f0-9]{64}$/.test(profile.baseEngineHash))throw Error('Invalid concept-game release profile');
 const base=path.join(root,'packages/learning-design/candidates/concept-games'),directory=path.join(base,'staging'),reviewBytes=read(path.join(directory,'review.json'));
 if(digest(reviewBytes)!==profile.reviewHash)throw Error('Concept-game review changed; a new handoff is required');
 const review=JSON.parse(reviewBytes);if(review.accepted!==true||!review.reviewerModel||!review.hashes||!['engine.js','catalog.json','learning-methods.js','content-workshops.js'].every(name=>review.hashes[name]))throw Error('Concept-game extension is not reviewed');
 for(const [name,hash]of Object.entries(review.hashes)){
  if(path.basename(name)!==name||!/^[a-f0-9]{64}$/.test(hash)||digest(read(path.join(directory,name)))!==hash)throw Error('Reviewed concept-game bytes changed: '+name);
 }
 if(digest(read(path.join(base,'engine.js')))!==profile.baseEngineHash)throw Error('Concept-game base engine changed; a new handoff is required');
 return {directory,reviewHash:profile.reviewHash};
}
function load(root){const file=path.join(root,'apps/game/concept-game-release.json');return fs.existsSync(file)?verify(root,JSON.parse(fs.readFileSync(file,'utf8'))):null;}
function verifyCourses(catalog,courses){
 const hash=value=>digest(JSON.stringify(value)),matched=new Set();let count=0;
 const entries=courses.map(course=>({course,hash:hash(course)}));
 for(const game of catalog.games)for(const binding of game.bindings){
  const entry=entries.find(e=>e.course.id===binding.courseId&&e.hash===binding.courseHash),lesson=entry?.course.chapters.flatMap(c=>c.sections.flatMap(s=>s.lessons)).find(l=>l.id===binding.lessonId);
  if(!lesson||lesson.sourceUnitId!==binding.sourceUnitId||hash(lesson)!==binding.lessonHash)throw Error('Concept-game course binding changed; a new handoff is required: '+game.id+'/'+binding.lessonId);
  matched.add(entry);count++;
 }
 if(entries.some(entry=>!matched.has(entry)))throw Error('A published course lost its reviewed concept-game bindings');
 return count;
}
module.exports={load,verify,verifyCourses};
