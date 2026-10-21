'use strict';
const C=require('../packages/contracts'),Compiler=require('../packages/course-compiler'),fs=require('node:fs'),path=require('node:path');
const bundle=require('../packages/contracts/fixtures/materials.v1.json'),knowledge=require('../packages/contracts/fixtures/knowledge.v1.json'),plan=require('../packages/contracts/fixtures/learning-plan.v1.json');
C.assertValid(C.validateMaterialBundle(bundle));C.assertValid(C.validateKnowledge(knowledge,bundle));C.assertValid(C.validateLearningPlan(knowledge,plan));
const course=Compiler.compileCourse(knowledge,plan,{materialBundle:bundle});
const at=process.argv.indexOf('--out');if(at>=0){const root=path.resolve(__dirname,'..'),file=path.resolve(root,process.argv[at+1]||'');if(!file.startsWith(path.join(root,'artifacts')+path.sep))throw Error('验收课程只输出到artifacts专用目录');fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,JSON.stringify(course,null,2)+'\n');}
console.log('PASS: v1 material, knowledge and learning fixtures compile to '+course.chapters.length+' playable chapters and '+Compiler.cards(course).length+' questions.');
