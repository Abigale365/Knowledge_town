'use strict';
const http=require('node:http'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const Schema=require('../../packages/course-compiler');
const PROJECT_ROOT=path.resolve(__dirname,'../..'),ROOT=path.join(PROJECT_ROOT,'dist');
const {INVENTORY_PROMPT}=require('../../packages/knowledge/prompts.cjs');
const {PROMPT,ACTIVITY_PROMPT}=require('../../packages/learning-design/prompts.cjs');
function configuration(env=process.env){
 const base=(env.API_BASE_URL||'').trim(),model=(env.API_MODEL||'').trim(),key=(env.API_KEY||'').trim();
 let endpoint='';if(base){const u=new URL(base);if(u.protocol!=='https:'&&!(u.protocol==='http:'&&['127.0.0.1','localhost','[::1]'].includes(u.hostname)))throw Error('API地址需要HTTPS，或本机HTTP地址。');if(u.username||u.password||u.search||u.hash)throw Error('API地址不能包含用户名、密码或查询参数。');endpoint=base.replace(/\/+$/,'');if(!endpoint.endsWith('/chat/completions'))endpoint+='/chat/completions';}
 return{endpoint,model,key,configured:!!(endpoint&&model&&key),chunkChars:Math.max(2000,Math.min(30000,Number(env.API_CHUNK_CHARS)||12000)),maxChunks:Math.max(1,Math.min(100,Number(env.API_MAX_CHUNKS)||40)),outputTokens:Math.max(1000,Math.min(32000,Number(env.API_MAX_OUTPUT_TOKENS)||6000)),jsonMode:env.API_JSON_MODE!=='false',tokenParameter:env.API_TOKEN_PARAMETER==='max_completion_tokens'?'max_completion_tokens':'max_tokens',timeout:Math.max(1000,Math.min(180000,Number(env.API_TIMEOUT_MS)||90000))};
}
function chunks(materials,size){const out=[];for(const m of materials){let start=0;while(start<m.text.length){let end=Math.min(m.text.length,start+size);if(end<m.text.length){const br=m.text.lastIndexOf('\n',end);if(br>start+size*.5)end=br+1;}out.push({name:m.name,offset:start,text:m.text.slice(start,end)});start=end;}}return out;}
function mergeOutputs(outputs,title){const chapters=[1,2,3,4].map(id=>({id:String(id),title:'',sections:[]})),questions=new Set();
 for(const output of outputs){if(!Array.isArray(output.chapters))throw Error('API结果缺少章节列表。');for(const ch of output.chapters){const i=Number(ch.id)-1;if(!Number.isInteger(i)||i<0||i>3)throw Error('API章节编号需要为1至4。');const target=chapters[i];target.title=target.title||ch.title;target.english=target.english||ch.english;if(!Array.isArray(ch.sections))throw Error('API章节缺少小节。');for(const sec of ch.sections){let found=target.sections.find(x=>x.title===sec.title);if(!found){found={title:sec.title,english:sec.english,lessons:[],questions:[],activity:sec.activity};target.sections.push(found);}else if(sec.activity){if(!found.activity)found.activity=sec.activity;else for(const round of sec.activity.rounds||[])if(!found.activity.rounds.some(r=>r.id===round.id&&r.prompt?.zh===round.prompt?.zh))found.activity.rounds.push({...round,id:'merged-'+found.activity.rounds.length+'-'+round.id});}for(const l of sec.lessons||[])if(!found.lessons.some(x=>x.title===l.title&&x.body===l.body))found.lessons.push(l);for(const q of sec.questions||[]){const key=(q.q||q.question)+'\n'+(q.a||q.answer);if(!questions.has(key)){questions.add(key);found.questions.push(q);}}}}}
 return{title,chapters};
}
async function modelChunk(config,chunk,overview,signal,prompt=PROMPT){
 const timeout=AbortSignal.timeout(config.timeout),combined=AbortSignal.any([signal,timeout]);
 const body={model:config.model,messages:[{role:'system',content:prompt},{role:'user',content:JSON.stringify({courseOverview:overview,material:chunk})}],[config.tokenParameter]:config.outputTokens};if(config.jsonMode)body.response_format={type:'json_object'};
 let r;try{r=await fetch(config.endpoint,{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+config.key},body:JSON.stringify(body),signal:combined,redirect:'error'});}catch(error){if(signal.aborted)throw Error('任务已取消。');if(timeout.aborted)throw Error('API调用超时，请缩小分片或检查服务。');throw Error('无法连接配置的API服务，请检查地址与网络。');}
 if(!r.ok)throw Error('API服务返回 HTTP '+r.status+'。请检查密钥、模型权限、额度及服务设置。');
 const data=await r.json();if(data.choices?.[0]?.finish_reason==='length')throw Error('API输出达到长度限制。请减小API_CHUNK_CHARS或增大API_MAX_OUTPUT_TOKENS后重试。');
 const content=data.choices?.[0]?.message?.content;if(typeof content!=='string')throw Error('API没有返回可解析的课程文字。');
 try{return JSON.parse(content.trim().replace(/^```(?:json)?\s*/,'').replace(/\s*```$/,''));}catch{throw Error('API返回的课程不是有效JSON。请启用JSON模式，或换用支持结构化输出的模型。');}
}
async function generate(config,materials,title,job){const parts=chunks(materials,config.chunkChars);if(parts.length>config.maxChunks)throw Error('材料需要'+parts.length+'次分片调用，超过当前'+config.maxChunks+'次限制。请按课程拆分，或调整API_MAX_CHUNKS。');job.total=parts.length*2;job.phase='inventory';const outputs=[],inventories=[],overview=materials.map(m=>m.name+'\n'+m.text.slice(0,1500)).join('\n').slice(0,6000);
 const clean=s=>s.replace(/\s+/g,' ').trim();
 for(const part of parts){if(job.controller.signal.aborted)throw Error('任务已取消。');const inventory=await modelChunk(config,part,overview,job.controller.signal,INVENTORY_PROMPT);if(!Array.isArray(inventory.units)||!Array.isArray(inventory.gaps)||inventory.units.length>1000)throw Error('知识库抽取结果不完整，请补充定义与材料后重试。');for(const u of inventory.units){if(!u||typeof u.title!=='string'||!u.title.trim()||typeof u.body!=='string'||!u.body.trim()||!u.en||typeof u.en.title!=='string'||!u.en.title.trim()||typeof u.en.body!=='string'||!u.en.body.trim()||typeof u.quote!=='string'||clean(u.quote).length<6||!clean(part.text).includes(clean(u.quote)))throw Error('知识库条目缺少定义或其出处无法在原文中核对。');}inventories.push(inventory);job.done++;}
 const gaps=[...new Set(inventories.flatMap(i=>i.gaps).filter(x=>typeof x==='string'&&x.trim()))];if(gaps.length)throw Error('资料尚不足以形成完整知识库，请补充：'+gaps.slice(0,12).join('；'));
 if(!inventories.some(i=>i.units.length))throw Error('材料没有可学习的知识条目，请补充定义、原理或示例。');
 job.phase='course';for(let i=0;i<parts.length;i++){const part=parts[i],inventory=inventories[i];outputs.push(await modelChunk(config,{...part,knowledgeInventory:inventory.units},overview,job.controller.signal,PROMPT+ACTIVITY_PROMPT+'先使用已核实知识库组织章节。每个知识条目必须有学习卡，不遗漏条目。学习卡保留知识条目的title、body、quote、source、en、interaction；题目只能基于知识库。'));job.done++;}
 const merged=mergeOutputs(outputs,title);for(const ch of merged.chapters)for(const sec of ch.sections)for(const q of sec.questions)if(!q.en?.q||!q.en?.a||!Array.isArray(q.en.wrong)||q.en.wrong.length!==q.wrong?.length)throw Error('生成题目缺少与原选项一一对应的英文版本，请重试。');if(merged.chapters.some(ch=>ch.sections.some(sec=>!sec.activity)))throw Error('课程缺少按知识目标设计的交互方案，请重新生成。');const activityTypes=new Set(merged.chapters.flatMap(ch=>ch.sections.flatMap(sec=>sec.activity.rounds?.map(r=>r.type)||[])));if(activityTypes.size<3)throw Error('课程交互过于单一，请按知识目标设计至少三类不同操作。');const course=Schema.normalize(merged,materials),all=course.chapters.flatMap(c=>c.sections.flatMap(s=>s.lessons));for(const u of inventories.flatMap(i=>i.units))if(!all.some(l=>l.title===u.title&&clean(l.body)===clean(u.body)&&clean(l.en?.body||'')===clean(u.en?.body||'')&&clean(l.quote)===clean(u.quote)))throw Error('课程遗漏知识库条目「'+u.title+'」，请重新生成或拆分材料。');course.knowledgeInventory={units:inventories.flatMap(i=>i.units),gaps:[],coverage:all.map(l=>({id:l.id,title:l.title,source:l.source}))};return course;
}
function json(res,status,data){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(data));}
async function readBody(req){let size=0;const parts=[];for await(const part of req){size+=part.length;if(size>8*1024*1024)throw Error('单次上传最多8MB，请拆分材料。');parts.push(part);}try{return JSON.parse(Buffer.concat(parts).toString('utf8'));}catch{throw Error('请求内容格式错误。');}}
function createApp(config=configuration()){
 const jobs=new Map();return http.createServer(async(req,res)=>{try{
 const hostname=(req.headers.host||'').split(':')[0];if(!['127.0.0.1','localhost'].includes(hostname)){json(res,403,{error:'仅接受本机访问。'});return;}
 const url=new URL(req.url,'http://'+req.headers.host);
 if(url.pathname.startsWith('/api/')){
  if(req.headers.origin&&req.headers.origin!=='http://'+req.headers.host){json(res,403,{error:'不允许跨站请求。'});return;}
  if(req.method==='GET'&&url.pathname==='/api/config'){json(res,200,{configured:config.configured,model:config.model,service:config.endpoint?new URL(config.endpoint).origin:'',chunkChars:config.chunkChars,maxChunks:config.maxChunks});return;}
  if(req.method==='GET'&&url.pathname==='/api/aib-course'){
   const result=await require('./pipeline.cjs').compilePreparedCourse({...require('../../packages/course-compiler/enrich-aib.cjs').enrichedAib(),learningPlan:require('../../packages/learning-design/generated/aib-learning-plan.v3.json')});json(res,200,result);return;
  }
  if(req.method==='POST'&&url.pathname==='/api/compile-course'){
   if(!req.headers['content-type']?.startsWith('application/json')){json(res,415,{error:'需要JSON格式的资料包、知识包和学习方案。'});return;}
   try{const body=await readBody(req),result=await require('./pipeline.cjs').compilePreparedCourse(body);json(res,200,result);}catch(error){json(res,400,{error:error.message,diagnostics:error.diagnostics||[]});}return;
  }
  if(req.method==='POST'&&url.pathname==='/api/course-jobs'){
   if(!config.configured){json(res,503,{error:'尚未配置API。请在本机.env中填写API_BASE_URL、API_MODEL和API_KEY，再重启服务。'});return;}
   if(!req.headers['content-type']?.startsWith('application/json')){json(res,415,{error:'请使用JSON上传文字材料。'});return;}
   for(const[id,j]of jobs)if(Date.now()-j.created>3600000)jobs.delete(id);
   if([...jobs.values()].filter(j=>j.status==='running').length>=2||jobs.size>=20){json(res,429,{error:'已有生成任务，请等待完成或取消后再试。'});return;}
   const body=await readBody(req);if(!Array.isArray(body.materials)||!body.materials.length||body.materials.length>50||body.materials.some(m=>!m||typeof m.text!=='string'||!m.text.trim()||typeof m.name!=='string')){json(res,400,{error:'需要1至50份非空文字材料。'});return;}
   const id=crypto.randomUUID(),job={id,status:'running',created:Date.now(),done:0,total:0,controller:new AbortController()};jobs.set(id,job);
   generate(config,body.materials,String(body.title||'我的学习课程').slice(0,150),job).then(course=>{if(job.controller.signal.aborted)return;job.course=course;job.status='done';}).catch(error=>{job.error=error.message;job.status=job.controller.signal.aborted?'cancelled':'failed';});json(res,202,{id});return;
  }
  const match=url.pathname.match(/^\/api\/course-jobs\/([a-f0-9-]+)$/);
  if(match){const job=jobs.get(match[1]);if(!job){json(res,404,{error:'任务不存在或已过期，请重新生成。'});return;}if(req.method==='DELETE'){job.controller.abort();job.status='cancelled';delete job.course;json(res,200,{status:job.status});return;}if(req.method==='GET'){json(res,200,{id:job.id,status:job.status,phase:job.phase,done:job.done,total:job.total,error:job.error,course:job.course});return;}}
  json(res,404,{error:'接口不存在。'});return;
 }
 if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return;}
 const relative=decodeURIComponent(url.pathname==='/'?'index.html':url.pathname.slice(1)),file=path.resolve(ROOT,relative);if(!file.startsWith(ROOT+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end('Not found');return;}
 const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml'};res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});if(req.method==='HEAD')res.end();else fs.createReadStream(file).pipe(res);
 }catch(error){json(res,400,{error:error.message});}});
}
function start(){try{if(fs.existsSync(path.join(PROJECT_ROOT,'.env')))process.loadEnvFile(path.join(PROJECT_ROOT,'.env'));const app=createApp(),port=Number(process.env.PORT)||8766;app.listen(port,'127.0.0.1',()=>console.log('拾知小镇: http://127.0.0.1:'+port+' · API '+(configuration().configured?'已配置':'未配置，基础课程仍可离线游玩')));return app;}catch(error){console.error(error.message);process.exitCode=1;}}
if(require.main===module)start();
module.exports={configuration,chunks,mergeOutputs,generate,createApp,start};
