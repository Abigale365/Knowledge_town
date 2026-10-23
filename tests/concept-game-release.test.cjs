'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),R=require('../scripts/concept-game-release.cjs');
const root=path.resolve(__dirname,'..'),base=path.join(root,'packages/learning-design/candidates/concept-games'),digest=x=>crypto.createHash('sha256').update(x).digest('hex');
const profile=()=>({schemaVersion:1,selection:'reviewed-extension-1',reviewHash:digest(fs.readFileSync(path.join(base,'staging/review.json'))),baseEngineHash:digest(fs.readFileSync(path.join(base,'engine.js')))});
test('release selects only the exact accepted B handoff without modifying B files',()=>{const result=R.verify(root,profile());assert.equal(result.directory,path.join(base,'staging'));});
test('a changed review or runtime file requires a new handoff instead of silently entering the build',()=>{
 assert.throws(()=>R.verify(root,{...profile(),reviewHash:'0'.repeat(64)}),/review changed/);
 assert.throws(()=>R.verify(root,profile(),file=>file===path.join(base,'staging/engine.js')?Buffer.from('unreviewed change'):fs.readFileSync(file)),/bytes changed/);
 assert.throws(()=>R.verify(root,profile(),file=>file===path.join(base,'engine.js')?Buffer.from('changed base'):fs.readFileSync(file)),/base engine changed/);
});
test('publishing cannot silently lose reviewed games after a course or lesson revision',()=>{
 const catalog=require('../packages/learning-design/candidates/concept-games/staging/catalog.json'),courses=require('../packages/learning-design/candidates/concept-games/bindings.cjs').catalogSources().map(source=>source.course);
 assert.equal(R.verifyCourses(catalog,courses),92);
 const changed=structuredClone(courses);changed[0].title+=' revised';assert.throws(()=>R.verifyCourses(catalog,changed),/binding changed/);
 assert.throws(()=>R.verifyCourses(catalog,courses.slice(1)),/binding changed/);
 const extra=structuredClone(courses[0]);extra.id='unreviewed-edition';assert.throws(()=>R.verifyCourses(catalog,[...courses,extra]),/lost its reviewed/);
});
