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
for(const name of ['concept-stage-host.cjs','concept-game-integration-ui.cjs','found-complete-ui.cjs','concept-stage-integration-ui.cjs','concept-cluster-integration-ui.cjs','concept-sample-integration-ui.cjs','concept-image-integration-ui.cjs','knowledge-display-ui.cjs','knowledge-back-ui.cjs','legacy-repair-ui.cjs'])run(['tests/'+name]);
for(const name of ['b5-chapter-assessment-ui.cjs','b5-backup-ui.cjs','course-diagnostics-ui.cjs','teaching-v5-ui.cjs','b5-micro-ui.cjs','b5-item-feedback-ui.cjs','teaching-v4-ui.cjs','aib-integration-ui.cjs','old-save-ui.cjs','integrated-pipeline-ui.cjs','bilingual-ui.cjs','phase-import-ui.cjs','workshops-ui.cjs','knowledge-ui.cjs','chapter-ui.cjs','adventures-ui.cjs','exploration-ui.cjs','game-guide.cjs','learning-interactions.cjs','scene-learning.cjs','ui-smoke.cjs','expedition-ui.cjs','hunt-ui.cjs'])run(['tests/'+name]);
console.log('PASS: current logic, current UI flows and all three classic-game regressions.');
