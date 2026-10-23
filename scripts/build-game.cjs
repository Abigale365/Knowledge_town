'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),source=path.join(root,'apps/game/src'),shared=path.join(root,'packages/contracts/runtime');
const generated=['chapter-course.js','aib-pack.js','i18n-data.js','aib-practice-pack.json','capacity-report.json'];
const args=process.argv.slice(2),at=args.indexOf('--out'),out=path.resolve(root,at<0?'dist':args[at+1]||'');
if(out!==path.join(root,'dist')&&!out.startsWith(path.join(root,'artifacts')+path.sep))throw Error('输出必须是项目内的专用目录');
const check=args.includes('--check'),sharedNames=fs.readdirSync(shared).filter(n=>n.endsWith('.js')),writes=[];
const conceptStage=args.includes('--concept-stage');
if(conceptStage&&out===path.join(root,'dist'))throw Error('未验概念扩展只允许专属预览');
const conceptRelease=conceptStage?null:require('./concept-game-release.cjs').load(root);
for(const [dir,names]of [[source,fs.readdirSync(source).filter(n=>/\.(html|js|css)$/.test(n))],[shared,sharedNames]])for(const name of names){let body=fs.readFileSync(path.join(dir,name),'utf8');for(const common of sharedNames)body=body.replaceAll("require('../../../packages/contracts/runtime/"+common+"')","require('./"+common+"')");writes.push([name,body]);}
if(new Set(writes.map(([name])=>name)).size!==writes.length)throw Error('不同模块发布了同名文件');
writes.push(['playtest-decision-task.js',fs.readFileSync(path.join(root,'packages/learning-design/candidates/playtest-fix/decision-task.js'),'utf8')]);
// Concept-game sidecars remain separate from frozen course/assessment data.
const conceptDir=path.join(root,'packages/learning-design/candidates/concept-games');
writes.push(['knowledge-display-data.js','const KnowledgeDisplayErrata='+fs.readFileSync(path.join(root,'packages/knowledge/candidates/concept-games/display-errata.v1.json'),'utf8').trim()+';\n']);
const displayEntry=writes.find(x=>x[0]==='index.html');displayEntry[1]=displayEntry[1].replace('<script src="concept-game-host.js">','<script src="knowledge-display-data.js"></script><script src="knowledge-display.js"></script><script src="concept-game-host.js">');
if(fs.existsSync(path.join(conceptDir,'catalog.json'))){
 writes.push(['concept-games-engine.js',fs.readFileSync(path.join(conceptDir,'engine.js'),'utf8')]);
 writes.push(['concept-game-catalog.js','const ConceptGameCatalog='+fs.readFileSync(path.join(conceptDir,'catalog.json'),'utf8').trim()+';\n']);
 if(conceptStage||conceptRelease){
  const stage=conceptRelease?.directory||path.join(conceptDir,'staging'),catalog=writes.find(x=>x[0]==='concept-game-catalog.js');catalog[1]='const ConceptGameCatalog='+fs.readFileSync(path.join(stage,'catalog.json'),'utf8').trim()+';\n';
  for(const [src,dst]of [['learning-methods.js','concept-learning-methods.js'],['content-workshops.js','concept-content-workshops.js'],['engine.js','concept-games-next.js']]){
   let body=fs.readFileSync(path.join(stage,src),'utf8').replaceAll("require('../engine.js')","require('./concept-games-engine.js')").replaceAll("require('./learning-methods.js')","require('./concept-learning-methods.js')").replaceAll("require('./content-workshops.js')","require('./concept-content-workshops.js')");writes.push([dst,body]);
  }
  const entry=writes.find(x=>x[0]==='index.html');entry[1]=entry[1].replace('<script src="concept-game-host.js">','<script src="concept-learning-methods.js"></script><script src="concept-content-workshops.js"></script><script src="concept-games-next.js"></script><script src="concept-game-host.js">');
 }
}
const teaching=require('./teaching-catalog.cjs').catalog();
writes.push(['teaching-catalog.js','/* Reviewed B4 data; older courses remain separate. */\nconst TeachingCatalog='+JSON.stringify(teaching)+';\n']);
const staged=require('./teaching-catalog-v5.cjs').catalog(),B5=require('../packages/learning-design/teaching-logic.v5.cjs');
const selectedConceptCatalog=conceptStage||conceptRelease?path.join(conceptRelease?.directory||path.join(conceptDir,'staging'),'catalog.json'):path.join(conceptDir,'catalog.json');
if(fs.existsSync(selectedConceptCatalog))require('./concept-game-release.cjs').verifyCourses(JSON.parse(fs.readFileSync(selectedConceptCatalog,'utf8')),[...Object.values(teaching),...Object.values(staged)].map(entry=>entry.course));
writes.push(['teaching-catalog-v5.js','const TeachingCatalogV5='+JSON.stringify(staged)+';\n']);
const precise=require('./teaching-feedback-v5.cjs').feedbackCatalog();
writes.push(['teaching-diagnostics.js','const TeachingDiagnostics=(()=>{const catalog='+JSON.stringify(precise)+';const hash=r=>catalog.hashes[JSON.stringify(r)];const W=TaskWorkshop,L=(zh,en)=>({zh,en});\n'+B5.initialAnswer.toString()+'\n'+B5.gradeStage.toString()+'\n'+B5.diagnoseRound.toString()+'\nreturn {initialAnswer,gradeStage,diagnoseRound,feedbackEntries:catalog.entries};})();\n']);
if(check){for(const[name,body]of writes)if(!fs.existsSync(path.join(out,name))||fs.readFileSync(path.join(out,name),'utf8').replace(/\r\n/g,'\n')!==body.replace(/\r\n/g,'\n'))throw Error('发布文件与源码不一致：'+name);console.log('PASS: '+writes.length+' runtime files match module sources.');process.exit(0);}
fs.mkdirSync(out,{recursive:true});for(const[name,body]of writes)fs.writeFileSync(path.join(out,name),body);
if(out!==path.join(root,'dist')){for(const name of generated)fs.copyFileSync(path.join(root,'dist',name),path.join(out,name));fs.cpSync(path.join(root,'dist/assets'),path.join(out,'assets'),{recursive:true});}
console.log('Published '+writes.length+' runtime files to '+path.relative(root,out)+'. Existing dist entry paths and assets preserved.');
