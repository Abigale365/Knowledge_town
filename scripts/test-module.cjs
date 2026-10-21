'use strict';
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),root=path.resolve(__dirname,'..');
const name=process.argv[2],folders={knowledge:'packages/knowledge/tests',design:'packages/learning-design/tests',game:'apps/game/tests'};
if(!folders[name])throw Error('模块应为 knowledge、design 或 game');
const env={...process.env,TOWN_NO_REPORT:'1'};
function run(args){const result=cp.spawnSync(process.execPath,args,{cwd:root,env,stdio:'inherit'});if(result.error)throw result.error;if(result.status!==0)process.exit(result.status||1);}
if(name==='game'){run(['scripts/build-game.cjs','--out','artifacts/previews/game-C']);env.TOWN_TEST_DIST=path.join(root,'artifacts/previews/game-C');}
const files=fs.readdirSync(path.join(root,folders[name])).filter(n=>n.endsWith('.test.cjs')).map(n=>folders[name]+'/'+n);if(!files.length)throw Error('模块缺少验收测试');run(['--test',...files]);
