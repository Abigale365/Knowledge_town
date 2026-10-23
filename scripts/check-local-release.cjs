'use strict';
const fs=require('node:fs'),path=require('node:path'),{gameIdentity}=require('../apps/server/identity.cjs');
const root=path.resolve(__dirname,'..'),runtime=path.join(root,'dist');
function freshCachePolicy(header){
 const parts=[];let part='',quoted=false,escaped=false;
 for(const char of String(header||'')){
  if(escaped){part+=char;escaped=false;continue;}
  if(quoted&&char==='\\'){part+=char;escaped=true;continue;}
  if(char==='"')quoted=!quoted;
  if(char===','&&!quoted){parts.push(part);part='';}else part+=char;
 }
 if(quoted||escaped)return false;parts.push(part);
 return parts.some(value=>['no-cache','no-store'].includes(value.trim().toLowerCase()));
}
async function checkLocalRelease(port=8782){
 if(!Number.isInteger(port)||port<1024||port>65535)throw Error('Invalid local game port');
 const origin='http://127.0.0.1:'+port,expected=gameIdentity(root),entries=['index.html','adventure.html','expedition.html','short-hunt.html'],resources=new Map();
 const get=async url=>{const response=await fetch(url,{redirect:'error',signal:AbortSignal.timeout(5000)});if(!response.ok)throw Error('Local resource failed: '+url+' ('+response.status+')');return response;};
 const identity=await (await get(origin+'/api/game-info')).json();
 if(['app','projectId','buildId'].some(key=>identity[key]!==expected[key]))throw Error('The running server is from a different checkout or an older build');
 resources.set('/',path.join(runtime,'index.html'));
 for(const entry of entries){
  const html=fs.readFileSync(path.join(runtime,entry),'utf8');resources.set('/'+entry,path.join(runtime,entry));
  if(entry==='index.html')for(const required of ['concept-games-next.js','concept-game-catalog.js','concept-game-records.js','concept-game-host.js','concept-games-ui.js','concept-game-integration.js','knowledge-display.js','scene-ambient.js'])if(!html.includes('src="'+required))throw Error('Published index is missing this update: '+required);
  for(const match of html.matchAll(/(?:src|href)="([^"]+)"/g)){
   const url=new URL(match[1],origin+'/'+entry);if(url.origin!==origin)continue;
   const name=decodeURIComponent(url.pathname),file=path.resolve(runtime,'.'+name);
   if(!file.startsWith(runtime+path.sep))throw Error('Unexpected local resource path');
   resources.set(url.pathname+url.search,file);
  }
 }
 // Scene backgrounds and sprite atlases are loaded through CSS/data, rather
 // than direct HTML tags. Check their actual HTTP responses as well.
 for(const asset of fs.readdirSync(path.join(runtime,'assets'),{withFileTypes:true}).filter(entry=>entry.isFile()))resources.set('/assets/'+encodeURIComponent(asset.name),path.join(runtime,'assets',asset.name));
 for(const [url,file]of resources){
  if(!fs.existsSync(file)||!fs.statSync(file).isFile())throw Error('Published file is missing: '+file);
  const response=await get(origin+url),actual=Buffer.from(await response.arrayBuffer());
  if(!actual.equals(fs.readFileSync(file)))throw Error('HTTP response differs from the published file: '+url);
  const imageType={'.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml'}[path.extname(file).toLowerCase()];
  if(imageType&&response.headers.get('content-type')?.split(';')[0].trim().toLowerCase()!==imageType)throw Error('Image response has an unexpected content type: '+url);
  if(!freshCachePolicy(response.headers.get('cache-control')))throw Error('Local response may remain stale in the browser cache: '+url);
 }
 return {port,buildId:identity.buildId,entries:entries.length,resources:resources.size};
}
module.exports={checkLocalRelease,freshCachePolicy};
if(require.main===module)checkLocalRelease(process.argv[2]===undefined?8782:Number(process.argv[2])).then(result=>console.log('PASS: verified local game identity and exact published HTTP resources '+JSON.stringify(result))).catch(error=>{console.error(error.message);process.exitCode=1;});
