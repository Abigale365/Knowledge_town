'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),source=path.join(root,'apps/game/src'),shared=path.join(root,'packages/contracts/runtime');
const generated=['chapter-course.js','aib-pack.js','i18n-data.js','aib-practice-pack.json','capacity-report.json'];
const args=process.argv.slice(2),at=args.indexOf('--out'),out=path.resolve(root,at<0?'dist':args[at+1]||'');
if(out!==path.join(root,'dist')&&!out.startsWith(path.join(root,'artifacts')+path.sep))throw Error('输出必须是项目内的专用目录');
const check=args.includes('--check'),sharedNames=fs.readdirSync(shared).filter(n=>n.endsWith('.js')),writes=[];
for(const [dir,names]of [[source,fs.readdirSync(source).filter(n=>/\.(html|js|css)$/.test(n))],[shared,sharedNames]])for(const name of names){let body=fs.readFileSync(path.join(dir,name),'utf8');for(const common of sharedNames)body=body.replaceAll("require('../../../packages/contracts/runtime/"+common+"')","require('./"+common+"')");writes.push([name,body]);}
if(new Set(writes.map(([name])=>name)).size!==writes.length)throw Error('不同模块发布了同名文件');
if(check){for(const[name,body]of writes)if(!fs.existsSync(path.join(out,name))||fs.readFileSync(path.join(out,name),'utf8').replace(/\r\n/g,'\n')!==body.replace(/\r\n/g,'\n'))throw Error('发布文件与源码不一致：'+name);console.log('PASS: '+writes.length+' runtime files match module sources.');process.exit(0);}
fs.mkdirSync(out,{recursive:true});for(const[name,body]of writes)fs.writeFileSync(path.join(out,name),body);
if(out!==path.join(root,'dist')){for(const name of generated)fs.copyFileSync(path.join(root,'dist',name),path.join(out,name));fs.cpSync(path.join(root,'dist/assets'),path.join(out,'assets'),{recursive:true});}
console.log('Published '+writes.length+' runtime files to '+path.relative(root,out)+'. Existing dist entry paths and assets preserved.');
