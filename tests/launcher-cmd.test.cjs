'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),cp=require('node:child_process'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),windows=process.platform==='win32';
function check(file,node){const result=cp.spawnSync(process.env.ComSpec||'cmd.exe',['/d','/c',file+' --check-runtime'],{cwd:root,env:{...process.env,PATH:process.env.SystemRoot+'\\System32;'+process.env.SystemRoot,KNOWLEDGE_TOWN_NODE:node},encoding:'utf8',timeout:10000,windowsHide:true});assert.equal(result.status,0,result.stdout+'\n'+result.stderr);assert.match(result.stdout,/Using Node\.js:/);assert.match(result.stdout,/v\d+\./);}
test('double-click entry resolves an explicit existing runtime without a Node PATH', {skip:!windows},()=>{check('start-game.cmd',process.execPath);check('开始游戏.cmd',process.execPath);});
const bundled=path.join(process.env.USERPROFILE||'','/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe');
test('bundled local runtime is found when Explorer cannot find node', {skip:!windows||!fs.existsSync(bundled)},()=>{check('开始游戏.cmd',path.join(root,'does-not-exist','node.exe'));});
