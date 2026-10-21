/* Keep the world explorable while foundations are learned through tangible finds. */
'use strict';
const DiscoveryProps=[
 {name:'咔哒齿轮匣',art:11,mode:'assemble',verb:'拼装'},
 {name:'玻璃小苗圃',art:4,mode:'grow',verb:'培育'},
 {name:'露珠放大镜',art:3,mode:'lens',verb:'观察'},
 {name:'三折风来信',art:6,mode:'letter',verb:'展开'},
 {name:'口袋旅行图',art:22,mode:'map',verb:'探路'},
 {name:'萤火星轨瓶',art:29,mode:'stars',verb:'点亮'},
 {name:'潮汐小罗盘',art:24,mode:'map',verb:'探路'},
 {name:'时光沙漏',art:9,mode:'assemble',verb:'拼装'},
 {name:'调色小药瓶',art:12,mode:'lens',verb:'观察'},
 {name:'月光小灯笼',art:13,mode:'stars',verb:'点亮'},
 {name:'木匠的工具包',art:28,mode:'assemble',verb:'拼装'},
 {name:'纸鹤邮包',art:15,mode:'letter',verb:'展开'}
];
function discoveryProp(lesson){const sec=currentCourse().chapters.flatMap(ch=>ch.sections).find(sec=>sec.lessons.some(l=>l.id===lesson.id)),i=sec.lessons.findIndex(l=>l.id===lesson.id),t=lesson.title;let n=/算法|规则/.test(t)?0:/训练|培养|成长/.test(t)?1:/预测|监督|监控|观察/.test(t)?2:/数据质量|可靠|检验/.test(t)?8:/路线|迁移|转型/.test(t)?6:/时间|成本|收益|投资/.test(t)?7:/权限|责任|治理/.test(t)?3:/团队|组织|能力/.test(t)?10:i%DiscoveryProps.length;return DiscoveryProps[n];}
function discoveryFlags(lesson){state.discoveryRead??={};const bank=state.discoveryRead[state.selected]??={};if(!bank[lesson.id])bank[lesson.id]=studyState().read.includes(lesson.id)?[0,1,2]:[];return bank[lesson.id];}
let discoveryOpenLesson=null;
function discoveryFacts(l){return[{name:'藏着的概念',text:l.body},{name:'带到业务里',text:l.example||'把这份知识放回本节的业务目标中理解：'+l.title},{name:'来处与学习目标',text:l.quote}];}
function discoveryActivity(l,p,flags){const labels={assemble:['装上主齿轮','接上业务部件','安好标记牌'],grow:['种下概念种子','浇一勺业务雨水','照亮学习目标'],lens:['观察概念纹路','看业务现场','看来源刻痕'],letter:['揭开第一折','打开第二折','摊开最后一折'],map:['概念营地','业务小径','目标路标'],stars:['点亮概念星','连上业务星','找到目标星']},icons={assemble:['⚙','⌑','✧'],grow:['🌱','💧','☀'],lens:['◉','⌕','✦'],letter:['✉','✉','✉'],map:['⌖','⌖','⌖'],stars:['✦','✦','✦']};return `<div class="discovery-activity discovery-${p.mode}"><div class="discovery-toy" id="discoveryToy">${sprites(p.art)}<span>${p.verb}中 · ${flags.length}/3 处发现</span></div>${p.mode==='lens'?'<label class="discovery-focus">推动镜片，逐层看清藏着的知识<input id="discoveryFocus" type="range" min="0" max="100" value="0" aria-label="调整观察镜片"></label>':''}<div class="discovery-parts">${[0,1,2].map(i=>`<button data-discover-part="${i}" ${p.mode==='assemble'?'draggable="true"':''} class="${flags.includes(i)?'opened':''}"><b>${icons[p.mode][i]}</b><span>${labels[p.mode][i]}</span></button>`).join('')}</div>${p.mode==='assemble'?'<div class="discovery-assembly" id="discoveryAssembly" data-drop="discovery-assembly">把三个部件拖进这里，或逐个点击装上。每个部件都会带出一块知识。</div>':''}</div>`;}
function revealDiscovery(id,index){const l=currentCourse().chapters.flatMap(ch=>ch.sections.flatMap(s=>s.lessons)).find(l=>l.id===id);if(!l||![0,1,2].includes(index))return;const flags=discoveryFlags(l);if(!flags.includes(index))flags.push(index);save();updateDiscovery(l);}
function updateDiscovery(l){const flags=discoveryFlags(l),p=discoveryProp(l);if($('discoveryToy')){$('discoveryToy').innerHTML=sprites(p.mode==='grow'&&flags.length>=2?21:p.art)+`<span>${p.verb}中 · ${flags.length}/3 处发现</span>`;$('discoveryToy').style.setProperty('--discovery-progress',flags.length);$('discoveryToy').classList.toggle('finished',flags.length===3);}document.querySelectorAll('[data-discover-part]').forEach(el=>el.classList.toggle('opened',flags.includes(+el.dataset.discoverPart)));document.querySelectorAll('[data-discovery-fact]').forEach(el=>el.hidden=!flags.includes(+el.dataset.discoveryFact));if($('discoveryStatus'))$('discoveryStatus').textContent=flags.length===3?'三处发现已展开，可以把这个知识物件带走了。':'已发现 '+flags.length+'/3 · 继续操作这个小物件，看看另外藏着什么。';if($('collectLesson'))$('collectLesson').disabled=flags.length<3;}
const explorationLesson=openStudyLesson;
openStudyLesson=function(id,reference=false){if(reference){explorationLesson(id,true);return;}const l=studySection().lessons.find(l=>l.id===id);if(!l){studyLocked();return;}const p=discoveryProp(l),flags=discoveryFlags(l);discoveryOpenLesson=id;modal(`<span class="eyebrow">在场景里发现 · ${p.verb}这件小东西</span><h2 id="dialogTitle">${esc(p.name)}</h2><p class="device-learning-caption">带着的知识 · ${esc(l.title)}</p>${discoveryActivity(l,p,flags)}<div class="discovery-facts">${discoveryFacts(l).map((f,i)=>`<section data-discovery-fact="${i}" ${flags.includes(i)?'':'hidden'}><h3>${f.name}</h3><div class="lesson-explanation">${studyText(f.text)}</div></section>`).join('')}</div><p class="discovery-status" id="discoveryStatus"></p><details class="source-detail"><summary>来源说明</summary><p>${esc(l.source)}</p><p>${esc(l.provenance)}</p></details><div class="actions"><button id="leaveLesson">先留在这里</button><button id="collectLesson" class="primary" ${flags.length===3?'':'disabled'}>把${esc(p.name)}收进知识背包</button></div>`);
 $('leaveLesson').onclick=close;document.querySelectorAll('[data-discover-part]').forEach(el=>{el.onclick=()=>revealDiscovery(id,+el.dataset.discoverPart);if(p.mode==='assemble')bindDraggable(el,{discovery:id,part:+el.dataset.discoverPart});});if($('discoveryAssembly'))bindDrop($('discoveryAssembly'),'discovery-assembly');if($('discoveryFocus'))$('discoveryFocus').oninput=()=>{const value=+$('discoveryFocus').value;for(let i=0;i<3;i++)if(value>=[20,55,85][i])revealDiscovery(id,i);};$('collectLesson').onclick=()=>{if(discoveryFlags(l).length<3)return;CS.read(studyState(),currentCourse(),id);if(CS.collect(studyState(),currentCourse(),id)){heldFruit=id;close();render();save();toast('收下了'+p.name+'，里面带着「'+l.title+'」。送去'+studyTheme().container+'整理吧。');}};updateDiscovery(l);
};
fruitArt=function(l){const lesson=l||studySection().lessons[0];return `<i class="study-material-art">${sprites(discoveryProp(lesson).art)}</i>`;};
function dormantPreview(o,station=false){const ready=basicsReady(),name=station?o[1]:o.name,type=station?o[0]:o.type,targets=station?Object.keys(A.recipes[type]||{}).map(t=>A.types[t]?.[0]).filter(Boolean):zoneInfo().stations.filter(st=>A.recipes[st[0]]?.[type]).map(st=>st[1]);modal(`<span class="eyebrow">${ready?'场景物件':'暂未开始 · 可以先查看'}</span><h2 id="dialogTitle">${esc(name)}</h2><div class="dormant-preview-art">${sprites(station?({book:31,mailbox:6,machine:11,sorter:15,ledger:9,chest:35,pot:4,bridge:10,lamp:13,tea:26,map:22,desk:14})[type]:o.art??A.types[type]?.[1]??3)}</div><p>${ready?'这件物品已经可以参与当前课程的场景交互。':'它还在这里，等你把本章基础知识整理好。现在可以观察用途；交付本章基础后，才开启收集和使用。'}</p><p>${targets.length?'以后可以搭配：'+esc(targets.join('、'))+'。':'它会参与之后的物件探索和学习委托。'}</p><div class="actions"><button id="dormantBack">回到场景</button><button id="dormantTask">看看现在能做什么</button></div>`);$('dormantBack').onclick=close;$('dormantTask').onclick=()=>{close();if(studyState().mode==='learn')openStudyBasket();else questDetail();};}
const explorationInspect=inspectObject;
inspectObject=function(id){if(currentCourse()&&!basicsReady()){const o=CAT.objects(state.zone).find(o=>o.id===id);if(o)dormantPreview(o);return;}explorationInspect(id);};
const explorationLoot=renderLoot;
renderLoot=function(){explorationLoot();if(!currentCourse()||studyState().mode!=='learn')return;
 // Future tools and event triggers enter only after the foundation round.
 $('features').innerHTML='';
 document.querySelectorAll('[data-study-fruit]').forEach(el=>{const l=studySection().lessons.find(l=>l.id===el.dataset.studyFruit);if(l)el.title=discoveryProp(l).name+' · 带着「'+l.title+'」';});
};

const explorationDrag=applyDrag;
applyDrag=function(data,kind,category){if(data?.discovery){if(kind==='discovery-assembly'&&data.discovery===discoveryOpenLesson)revealDiscovery(data.discovery,data.part);return;}explorationDrag(data,kind,category);};
function classicGames(){return `<section class="classic-games"><span class="eyebrow">同一个世界，还有别的玩法</span><h3>经典冒险都在这里</h3><div>${[['adventure.html','失落的档案馆','调查线索、修复机关，走完有结局的故事。'],['expedition.html','星叶群岛','八站探险、三种寻物方式、星星与收藏册。'],['short-hunt.html','林间寻物社','在场景里找证据，完成三份小委托。']].map(([url,title,body],i)=>`<a href="${url}"><b>${['⌑','✦','⌕'][i]} ${title}</b><span>${body}</span><small>进入这个游戏 →</small></a>`).join('')}</div><p>每套玩法保留原有进度；页面左上角可回到拾知小镇。</p></section>`;}
function showClassicGames(){modal(`<span class="eyebrow">小镇游戏匣</span><h2 id="dialogTitle">选一种你喜欢的冒险</h2>${classicGames()}<div class="actions"><button id="classicBack">回到当前游戏</button></div>`,true);$('classicBack').onclick=close;}
const explorationMap=showChapterMap;
showChapterMap=function(){explorationMap();const box=document.createElement('div');box.innerHTML=classicGames();$('dialogBody').appendChild(box);};
$('classicGames').onclick=showClassicGames;
const discoveryRestore=L.restore;
L.restore=function(raw){const s=discoveryRestore(raw);if(!s)return null;try{if(s.discoveryRead!==undefined){if(!s.discoveryRead||typeof s.discoveryRead!=='object'||Array.isArray(s.discoveryRead))return null;for(const[bid,entries]of Object.entries(s.discoveryRead)){const bank=s.banks.find(b=>b.id===bid),course=bank?.syllabus||(bid===EXAM_ID?StrategistCourse:null);if(!course||!entries||typeof entries!=='object'||Array.isArray(entries))return null;const ids=new Set(course.chapters.flatMap(ch=>ch.sections.flatMap(sec=>sec.lessons.map(l=>l.id))));for(const[id,flags]of Object.entries(entries))if(!ids.has(id)||!Array.isArray(flags)||flags.length>3||new Set(flags).size!==flags.length||flags.some(n=>![0,1,2].includes(n)))return null;}}return s;}catch{return null;}};
