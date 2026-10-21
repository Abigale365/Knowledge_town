'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),runtime=path.join(root,'dist');
const read=file=>fs.readFileSync(file,'utf8');
function exists(relative){assert.ok(fs.existsSync(path.resolve(root,relative)),'Missing repository file: '+relative);}
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(path.join(dir,entry.name)):[path.join(dir,entry.name)]);}
function localLink(base,link){link=link.split('#')[0].split('?')[0];if(!link||/^(?:[a-z]+:|\/\/)/i.test(link)||link.includes('${'))return;assert.ok(fs.existsSync(path.resolve(base,decodeURIComponent(link))),'Broken reference: '+path.relative(root,base)+' -> '+link);}
for(const file of ['README.md','docs/GAME_GUIDE.md','docs/REPOSITORY.md','docs/TESTING.md','content/README.md','content/aib-concepts.tsv','content/sources/AI_Business_Strategist_Outline.md','content/sources/AIB_C01_Collected_Study_Materials.md','scripts/build-chapter-course.py','scripts/build-aib-pack.py','server.cjs','.env.example','archive/file-moves.json'])exists(file);
const entries=['index.html','adventure.html','expedition.html','short-hunt.html'];
for(const entry of entries){const file=path.join(runtime,entry);for(const match of read(file).matchAll(/(?:src|href)="([^"]+)"/g))localLink(path.dirname(file),match[1]);}
const runtimeFiles=walk(runtime).filter(file=>/\.(?:html|js|css)$/.test(file)),combined=runtimeFiles.map(read).join('\n');
for(const file of runtimeFiles){const text=read(file);for(const match of text.matchAll(/assets\/[A-Za-z0-9_./-]+\.(?:png|webp|svg|jpg)/g))exists('dist/'+match[0]);}
for(const file of [...runtimeFiles.filter(file=>file.endsWith('.js')),...walk(path.join(root,'tests')).filter(file=>file.endsWith('.cjs')),...walk(path.join(root,'scripts')).filter(file=>file.endsWith('.cjs'))])for(const match of read(file).matchAll(/require\(['"](\.[^'"]+)['"]\)/g))localLink(path.dirname(file),match[1]);
for(const file of ['README.md','docs/GAME_GUIDE.md','docs/REPOSITORY.md','docs/TESTING.md','content/README.md','tests/README.md','archive/README.md'])for(const match of read(path.join(root,file)).matchAll(/\[[^\]]*\]\(([^)]+)\)/g))localLink(path.dirname(path.join(root,file)),match[1]);
for(const file of ['dist/aib-practice-pack.json','dist/capacity-report.json'])JSON.parse(read(path.join(root,file)));
const manifest=JSON.parse(read(path.join(root,'archive/file-moves.json')));for(const entry of manifest.moves)if(entry.mode!=='local-artifact-untracked')exists(entry.to);
const sceneIds=Object.keys(require('../dist/expedition-engine.js').places),zoneIds=Object.keys(require('../dist/world-catalog.js').zones);
const dynamicAssets=new Set([...sceneIds.flatMap(id=>[id+'.webp',id+'-thumb.webp']),...zoneIds.map(id=>'world-'+id+'.webp'),...['','2','3'].map(suffix=>'world-props'+suffix+'.webp')]);
for(const name of dynamicAssets)exists('dist/assets/'+name);
const assets=fs.readdirSync(path.join(runtime,'assets'));const unclassified=assets.filter(name=>!combined.includes(name)&&!dynamicAssets.has(name));
assert.deepEqual(unclassified,[],'Assets need a runtime reference or an explicit documented purpose');
const pkg=JSON.parse(read(path.join(root,'package.json')));for(const command of Object.values(pkg.scripts))for(const match of command.matchAll(/(?:scripts|tests)\/[A-Za-z0-9_./-]+\.(?:cjs|py)/g))exists(match[0]);
assert.ok(!fs.existsSync(path.join(runtime,'world-v06.html')),'Historical v0.6 entry should live in archive');
console.log(`PASS: ${entries.length} playable entry pages, ${assets.length} classified runtime assets, current docs, build sources, dependencies and test commands.`);
