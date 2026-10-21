'use strict';
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const root=path.resolve(__dirname,'..');
function run(args){const result=cp.spawnSync(process.execPath,args,{cwd:root,stdio:'inherit',env:{...process.env,TOWN_NO_REPORT:'1'}});if(result.error)throw result.error;if(result.status!==0)process.exit(result.status||1);}
run(['scripts/build-game.cjs','--check']);
run(['scripts/check-repository.cjs']);
run(['scripts/check-contracts.cjs']);
for(const module of ['knowledge','design','game'])run(['scripts/test-module.cjs',module]);
const unit=fs.readdirSync(path.join(root,'tests')).filter(name=>name.endsWith('.test.cjs')).sort().map(name=>'tests/'+name);
run(['--test',...unit]);
for(const name of ['aib-integration-ui.cjs','old-save-ui.cjs','integrated-pipeline-ui.cjs','bilingual-ui.cjs','phase-import-ui.cjs','workshops-ui.cjs','knowledge-ui.cjs','chapter-ui.cjs','adventures-ui.cjs','exploration-ui.cjs','game-guide.cjs','learning-interactions.cjs','scene-learning.cjs','ui-smoke.cjs','expedition-ui.cjs','hunt-ui.cjs'])run(['tests/'+name]);
console.log('PASS: current logic, current UI flows and all three classic-game regressions.');
