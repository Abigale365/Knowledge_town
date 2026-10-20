'use strict';
const $=id=>document.getElementById(id),E=QuestEngine,J=QuestJourney;
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let packs=[...QUEST_PACKS],pack=packs[0],s=E.fresh(pack.id),j=J.normalize(s),still=matchMedia('(prefers-reduced-motion: reduce)').matches,walkTimer,walkToken=0,walking=null,toastTimer;
const names=['档案馆','维修工坊','试验花园','试炼塔'],roomKeys=J.rooms;
const roomData={map:{name:'森屿学院',art:'academy-map',tip:'点击发光的门进入地点；门锁旁会说明还缺什么。'},tutorial:{name:'新手引导 · 先练一封信',art:'archive',tip:'一次只做一件事。右边会告诉你下一步点哪里。'},archive:{name:'档案馆 · 把委托交给合适的帮手',art:'archive',tip:'点击场景里的资料收集线索，再选择桌上的信。'},workshop:{name:'维修工坊 · 排好步骤再启动',art:'workshop',tip:'检查机器、取出步骤牌、接通权限检查，最后拉下启动杆。'},garden:{name:'试验花园 · 让承诺经得起检查',art:'garden',tip:'先读调查和复核记录，再调节试验台上的开关。'},tower:{name:'试炼塔 · 把方法用到新地方',art:'tower',tip:'读新委托、选择两项行动，再点亮塔灯。'}};
const tools=[{id:'rules',icon:'▦',name:'按表办事的算盘',short:'算盘',desc:'规则已写清，就照着规则计算。',term:'规则自动化'},{id:'predict',icon:'⌁',name:'预测未来的望远镜',short:'望远镜',desc:'从过去的记录，估计未来的数量。',term:'预测模型'},{id:'generate',icon:'✧',name:'起草内容的羽毛笔',short:'羽毛笔',desc:'根据资料，写一段新的内容。',term:'生成式AI'},{id:'agent',icon:'⚒',name:'会用工具的执行员',short:'执行员',desc:'在授权内，调用工具完成多步任务。',term:'AI智能体'}];
const clueNames=['规则清单','历史记录','已批准材料','工具权限'];
const clueText=['条件和处理规则已写清，输入信息完整，可以按固定规则处理。','记录的是过去的观测数据，需要据此估计未来会发生什么。','这里已经有批准的材料，委托要把它写成更容易理解的说明。','维修需要连续操作几个工具，但只能在已经授权的范围内行动。'];
function toast(t){$('toast').textContent=t;$('toast').style.opacity=1;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').style.opacity=0,3800);}
function save(){try{localStorage.setItem('kq:'+pack.id,JSON.stringify(s));}catch{toast('当前浏览器不能保存进度，可以手动保存冒险记录。');}}
function cancelWalk(){walkToken++;clearTimeout(walkTimer);if(walking){walking.cancel();walking=null;}$('player').classList.remove('walking');}
function closeTask(){} // Compatibility for reviewed material imports; gameplay now lives in rooms.
function updatePicker(){}
function load(p){cancelWalk();pack=p;let raw=null;try{raw=localStorage.getItem('kq:'+p.id);}catch{}s=raw?E.restore(raw,p):E.fresh(p.id);j=J.normalize(s);render();showWelcome();}
function showWelcome(){$('welcome').hidden=false;$('game').hidden=true;$('welcomeTitle').textContent=pack.title;if(pack.id==='archive-cn-v3')$('welcomeTitle').innerHTML='失落的<br><em>档案馆</em>';else if(pack.id==='harbor-cn-v3')$('welcomeTitle').innerHTML='港湾的<br><em>未寄来信</em>';const has=j.welcome;$('continue').hidden=!has;$('start').hidden=has;$('restartWelcome').hidden=!has;}
function start(){j.welcome=true;j.room=j.tutorialDone?'map':'tutorial';save();$('welcome').hidden=true;$('game').hidden=false;render();$('game').scrollIntoView({block:'start',behavior:'auto'});}
function continueGame(){$('welcome').hidden=true;$('game').hidden=false;render();$('game').scrollIntoView({block:'start',behavior:'auto'});}
function modal(label,body){cancelWalk();$('modalLabel').textContent=label;$('modalBody').innerHTML=body;if(!$('modal').open)$('modal').showModal();}
function sourceLink(id){const a=pack.sources.find(x=>x.id===id);return a?`<a class="source-link" href="${esc(a.url)}" target="_blank" rel="noopener">查看知识依据 ↗</a>`:'';}
function enterRoom(room){if(!j.tutorialDone&&room!=='tutorial')return toast('先完成这封练习信。菜单里也可以选择跳过教学。');if(!J.enter(s,room))return toast('门还锁着。先完成前一个地点，拿到通行徽章。');cancelWalk();j.feedback=null;render();$('game').scrollIntoView({block:'start',behavior:'auto'});if(!still&&$('transition').animate)$('transition').animate([{opacity:1},{opacity:0}],{duration:500,fill:'forwards'});}
function travel(n){if(n>s.completed.length)return toast('还没有这扇门的通行徽章。先完成前一个地点。');cancelWalk();const token=walkToken,ends=[[23,38],[79,40],[24,70],[84,75]],el=$('player'),end=ends[n];
 const done=()=>{if(token!==walkToken)return;s.pos=end;enterRoom(roomKeys[n]);};
 if(still||!el.animate){done();return;}
 el.classList.add('walking');walking=el.animate([{left:s.pos[0]+'%',top:s.pos[1]+'%'},{left:'50%',top:'55%',offset:.5},{left:end[0]+'%',top:end[1]+'%'}],{duration:750,easing:'ease-in-out',fill:'forwards'});walkTimer=setTimeout(done,760);toast('正在前往'+names[n]+'……');}
function objective(){
 if(j.room==='tutorial')return ['先点击场景里的米拉，听她说发生了什么。','点击桌上的练习信，把需求读一遍。','为这封信选一个帮手，再按“请它试做”。','练习已经成功，点击右侧“进入正式冒险”。'][Math.min(3,j.tutorial)];
 if(j.room==='map')return s.completed.length===4?'四处修复已完成。前往试炼塔领取结局。':'进入'+names[Math.min(s.completed.length,3)]+'，完成下一次修复。';
 if(s.completed.includes(s.stage))return s.stage===3?'塔灯已亮，查看本章结局。':'修复完成，可以前往'+names[Math.min(3,s.stage+1)]+'。';
 if(j.room==='archive'){const n=j.letter;if(s.routes[n]===pack.routes[n].answer){const next=pack.routes.findIndex((r,i)=>s.routes[i]!==r.answer);return next<0?'四封信都处理好了，领取通行徽章。':'选择下一封尚未完成的信。';}return !j.evidence.includes(n)?'检查场景里的“'+clueNames[n]+'”，找到这封信的依据。':!j.chosen?'选择能解决这封委托的帮手。':'按“请它处理委托”，看看实际发生什么。';}
 if(j.room==='workshop')return !j.inspected.includes('machine')?'先检查中间的故障机器。':!j.inspected.includes('tokens')?'点击左侧工具架，取出四块步骤牌。':!j.inspected.includes('lock')?'点击权限开关，确认谁能读资料。':'排好四块步骤牌，然后点击场景中的启动杆。';
 if(j.room==='garden')return !j.inspected.includes('survey')?'先读左侧的使用调查，别直接相信满员使用。':!j.inspected.includes('quality')?'检查右侧的复核记录，看看取消检查会怎样。':'点击中央试验台，调节人数比例与复核开关，再试运行。';
 return !j.inspected.includes('brief')?'先读窗边的新委托，注意使用场景变了。':!j.inspected.includes('plans')?'检查圆桌上的方案，选出恰好两项行动。':'点击桌上的塔灯，接受最后一次检验。';
}
function render(){
 const d=roomData[j.room];$('sceneChapter').textContent=j.room==='tutorial'?'序章 · 没有计分的操作练习':pack.subtitle;$('sceneTitle').textContent=d.name;
 $('rank').textContent=['见习修复师','信使伙伴','机器修复师','试验观察员','学院守望者'][s.completed.length];$('xp').textContent='经验 '+s.xp;$('itemCount').textContent=j.evidence.length+s.completed.length;$('backMap').hidden=['map','tutorial'].includes(j.room);
 if($('sceneArt').dataset.art!==d.art){$('sceneArt').dataset.art=d.art;$('sceneArt').hidden=false;$('sceneCanvas').classList.remove('art-failed');$('sceneArt').src='assets/'+d.art+'.webp';$('sceneArt').alt=d.name+'的可交互场景';}
 $('sceneTip').textContent=d.tip;$('objective').textContent=objective();$('player').hidden=j.room!=='map';$('player').style.left=s.pos[0]+'%';$('player').style.top=s.pos[1]+'%';
 $('worldState').className='world-state '+(s.completed.includes(s.stage)&&j.room!=='map'?'repaired':'')+(j.feedback?.ok===false?' fault':'');
 $('milestones').innerHTML=names.map((name,i)=>`<button data-chapter="${i}" class="${s.completed.includes(i)?'done':s.stage===i?'active':''}">${s.completed.includes(i)?'✓':i+1} ${name}</button>`).join('');
 document.querySelectorAll('[data-chapter]').forEach(e=>e.onclick=()=>j.tutorialDone?(j.room==='map'?travel(+e.dataset.chapter):enterRoom(roomKeys[+e.dataset.chapter])):toast('先完成这封练习信，再进入正式冒险。'));
 renderObjects();renderDock();save();
}
function object(id,label,x,y,icon='✧',active=false){return `<button class="world-object ${active?'target':''}" data-object="${id}" style="left:${x}%;top:${y}%"><span>${icon}</span><b>${label}</b></button>`;}
function npcObject(label,x,y,active){return `<button class="world-person ${active?'target':''}" data-object="mentor" style="left:${x}%;top:${y}%"><i>···</i><svg viewBox="0 0 60 95" aria-hidden="true"><ellipse cx="30" cy="87" rx="19" ry="5" fill="#203f3340"/><path d="M12 80l7-40h22l7 40-18 8z" fill="#9b7656"/><path d="M20 45l-7 22m27-22 7 21" stroke="#ebcaa3" stroke-width="6" stroke-linecap="round"/><circle cx="30" cy="28" r="13" fill="#ebc49a"/><path d="M16 29q-5-23 18-20 15 4 11 30l-7-17-22 7" fill="#765337"/><path d="M22 41l8 10 8-10" fill="#ead7a9"/><circle cx="25" cy="29" r="1.4" fill="#434c36"/><circle cx="35" cy="29" r="1.4" fill="#434c36"/></svg><b>${label}</b></button>`;}
function renderObjects(){let out='';
 if(j.room==='map'){[[23,33],[79,35],[24,65],[84,70]].forEach(([x,y],i)=>out+=object('room'+i,names[i]+(i>s.completed.length?' · 门锁着':s.completed.includes(i)?' · 已修复':' · 可进入'),x,y,s.completed.includes(i)?'✓':'⌂',i===s.completed.length));}
 if(j.room==='tutorial'){out+=npcObject('米拉 · 交谈',28,62,j.tutorial===0)+object('practice','桌上的练习信',50,47,'✉',j.tutorial===1);}
 if(j.room==='archive'){out+=npcObject('米拉 · 交谈',38,68,false);[[12,49],[34,37],[89,50],[85,78]].forEach(([x,y],i)=>out+=object('clue'+i,clueNames[i]+(j.evidence.includes(i)?' ✓':''),x,y,'⌕',i===j.letter&&!j.evidence.includes(i)));out+=object('letters','桌上的四封委托',51,47,'✉',j.evidence.includes(j.letter));}
 if(j.room==='workshop'){out+=(j.inspected.includes('tokens')&&j.inspected.includes('machine')?'':object('machine','检查故障机器',51,40,'⌕',!j.inspected.includes('machine')))+object('tokens','拿取步骤牌',14,78,'▦',j.inspected.includes('machine')&&!j.inspected.includes('tokens'))+object('lock','权限检查开关',60,24,'⚿',j.inspected.includes('tokens')&&!j.inspected.includes('lock'))+object('run','启动机器',91,68,'▶',J.ready(s,1));if(j.inspected.includes('tokens'))out+=s.order.map((v,i)=>`<button class="rune-socket ${j.tile===i?'selected':''}" style="left:${[40.2,47,53.5,60.5][i]}%;top:40%" data-tile="${i}" data-origin="scene" aria-label="第${i+1}步：${esc(pack.steps[v])}，点击与另一块交换"><small>${i+1}</small><b>${['确认权限','读取资料','起草结果','复核批准'][v]}</b></button>`).join('');}
 if(j.room==='garden'){out+=object('survey','阅读使用调查',22,55,'⌕',!j.inspected.includes('survey'))+object('quality','检查复核记录',79,61,'⌕',j.inspected.includes('survey')&&!j.inspected.includes('quality'))+object('crystal','操作试验台',50,43,'◈',j.inspected.includes('survey')&&j.inspected.includes('quality'));}
 if(j.room==='tower'){out+=object('brief','阅读新的委托',48,30,'✉',!j.inspected.includes('brief'))+object('plans','检查四份方案',39,68,'▤',j.inspected.includes('brief')&&!j.inspected.includes('plans'))+object('beacon','点亮塔灯',52,57,'✦',j.inspected.includes('plans'));}
 if(j.room==='garden'&&j.inspected.includes('crystal')){const x=E.calc(pack,s.budget.adoption,s.budget.review);out+=`<div class="scene-readings"><b id="sceneQuality">合格 ${x.quality} / 100 次</b><span id="sceneUsers">预计每100人中 ${s.budget.adoption} 人会用</span></div>`;}$('objects').innerHTML=out;document.querySelectorAll('[data-object]').forEach(b=>b.onclick=()=>{handleObject(b.dataset.object);if(j.room!=='map')focusDock();});
}
function handleObject(id){
 if(j.room==='map')return travel(+id.slice(4));
 if(j.room==='tutorial'){if(id==='mentor'&&j.tutorial===0){j.panel='mentor';j.tutorial=1;}else if(id==='practice'&&j.tutorial>=1){j.panel='practice';j.tutorial=Math.max(2,j.tutorial);}else return toast('先按当前目标做一步。这里不计分，可以放心尝试。');render();return;}
 if(id==='mentor'){j.panel='mentor';j.feedback=null;render();return;}
 if(id==='letters'){j.panel='letters';j.feedback=null;j.chosen=null;render();return;}
 if(id==='run'){if(!J.ready(s,1)){toast('还没检查完整：先看机器、取步骤牌，再检查权限开关。');return;}runStage();return;}
 if(id==='plans'&&!j.inspected.includes('brief'))return toast('先读新委托，才知道这次要解决什么。');
 if(id==='beacon'&&!j.inspected.includes('plans'))return toast('先在圆桌检查方案，选出两项行动。');
 J.inspect(s,id);render();
}
function speaker(name,text){return `<div class="speaker"><span class="speaker-avatar">${name.startsWith('米')?'米':name.startsWith('阿')?'索':'✦'}</span><div><small>正在对你说</small><b>${esc(name)}</b></div></div><p class="dialogue-line">${text}</p>`;}
function button(id,text,cls='primary',disabled=false){return `<button id="${id}" class="${cls}" ${disabled?'disabled':''}>${text}</button>`;}
function focusDock(){if(matchMedia('(max-width: 760px)').matches)$('dock').scrollIntoView({behavior:still?'auto':'smooth',block:'start'});}
function bind(id,fn){if($(id))$(id).onclick=fn;}
function renderDock(){let out='';
 if(j.room==='tutorial'){out=tutorialPanel();}
 else if(j.room==='map'){out=speaker('学院向导',s.completed.length===4?'你已经完成四处修复。前往试炼塔，收好这次冒险的发现。':'你是学院新来的修复师。先进入发光的地点，调查问题，再亲手尝试解决。')+`<div class="next-box"><small>这次要做</small><b>${esc(objective())}</b></div>`+button('enterNext',s.completed.length===4?'回到塔里查看结局 →':'进入'+names[s.completed.length]+' →')+`<div class="room-preview"><b>每处地点都有不同的操作</b><p>档案馆：找资料、派委托。<br>工坊：调换步骤、启动机器。<br>花园：改条件、观察变化。<br>塔：把方法用进新情境。</p></div>`;}
 else if(j.feedback){out=feedbackPanel();}
 else if(s.completed.includes(s.stage)&&j.panel==='arrival'){out=completedPanel();}
 else if(j.room==='archive'){out=archivePanel();}
 else if(j.room==='workshop'){out=workshopPanel();}
 else if(j.room==='garden'){out=gardenPanel();}
 else if(j.room==='tower'){out=towerPanel();}
 $('dockContent').innerHTML=out;bindDock();
}
function tutorialPanel(){
 if(j.tutorial===0)return speaker('米拉 · 守馆人','欢迎，新来的修复师！先在左侧场景里找到我，点一下“米拉”。你不用猜下一步，底部会一直给出当前目标。')+`<div class="tutorial-count">操作教学 · 第1步 / 4</div><div class="instruction">← 点击场景中发光的米拉</div>`;
 if(j.tutorial===1)return speaker('米拉 · 守馆人','我们的帮手接错了任务。你要学会：读清需求、选对帮手、看它是否真的办成。先点桌上的练习信，我们只试一封。')+`<div class="tutorial-count">操作教学 · 第2步 / 4</div><div class="instruction">← 点击“桌上的练习信”</div>`;
 if(j.tutorial===3)return speaker('米拉 · 守馆人','办成了！收费规则已经写清，算盘照表算出了账单。这叫“规则自动化”。刚才是教学，不计入正式表现。')+`<div class="practice-success">✓ 你已经亲手完成<br><small>读需求 → 选帮手 → 执行 → 看结果</small></div>`+button('finishTutorial','我会操作了，进入学院 →');
 return `<div class="tutorial-count">操作教学 · 第3步 / 4</div><div class="letter"><small>练习信 · 收费请求</small><p>收费表已经写清，请按表计算一位访客要付多少钱。</p></div><p class="plain-explain">这次只需照表计算。点一个帮手，再请它试做。</p>${toolOptions(['rules','generate'],j.tutorialChoice)}${j.feedback?`<div class="feedback bad">${esc(j.feedback.text)}</div>`:''}${button('tryPractice','请它试做 →','primary',!j.tutorialChoice)}`;
}
function toolOptions(ids,selected){return `<div class="tool-options">${tools.filter(t=>ids.includes(t.id)).map(t=>`<button class="tool-option ${selected===t.id?'selected':''}" data-tool="${t.id}" aria-pressed="${selected===t.id}"><span>${t.icon}</span><b>${t.name}</b><small>${t.desc}</small></button>`).join('')}</div>`;}
function archivePanel(){const n=j.letter,r=pack.routes[n];
 if(j.panel==='mentor')return speaker(pack.npc1,j.letterAttempts[n]>0&&s.routes[n]!==r.answer?'这封信刚才还没办成。不要只看帮手的名字，重新对照：它做的事情，和委托需要的结果相同吗？':'四封委托不是同一种活。每封信先找到依据，再挑帮手，最后试做。')+button('explainHelpers','这些帮手到底有什么区别？','outline')+button('showLetters','我来看看当前委托 →');
 if(j.panel.startsWith('clue')){const i=+j.panel.slice(-1);return speaker('找到一份资料',esc(clueNames[i]))+`<div class="evidence-card"><span>◇ 已收入行囊</span><p>${clueText[i]}</p></div>`+button('useClue','拿它对照第'+(i+1)+'封委托 →');}
 if(j.panel!=='letters')return speaker(pack.npc1,'四封委托等着处理。先点桌上的信，读清第一封要做什么；再到场景里找对应资料。')+button('showLetters','拿起桌上的委托 →');
 const done=s.routes[n]===r.answer;
 return `<div class="envelopes">${pack.routes.map((r,i)=>`<button data-letter="${i}" class="${i===n?'selected':''}">${s.routes[i]===r.answer?'✓':'✉'} ${i+1}</button>`).join('')}</div><div class="letter"><small>第${n+1}封 · ${esc(r.name)}</small><p>${esc(r.request)}</p></div>${done?`<div class="feedback good">这封委托已经办成了。${esc(r.why)}</div>`+button('nextLetter','看下一封未完成的信 →'):!j.evidence.includes(n)?`<div class="next-box"><small>先找依据</small><b>检查场景里的“${clueNames[n]}”</b><p>找到的资料会进入行囊，不需要背下来。</p></div>`+button('findEvidence','带我找到这份资料 →','outline'):`<div class="evidence-tag">◇ 已找到：${clueNames[n]}</div><p class="plain-explain">谁刚好能解决这件事？</p>${toolOptions(tools.map(t=>t.id),j.chosen)}${button('dispatch','请它处理委托 →','primary',!j.chosen)}`}${pack.routes.every((r,i)=>s.routes[i]===r.answer)?button('finishArchive','四封都完成了，领取通行徽章 →'):''}`;
}
function workshopPanel(){
 if(j.panel==='machine')return speaker('阿索 · 工匠','机器没有坏零件，而是把工作步骤弄乱了。还没确认访客是谁，就可能先读到了不该看的资料。')+`<div class="next-box"><b>要修两件事</b><p>① 排好四个步骤的先后。<br>② 接通读取前的权限检查。</p></div>`+button('findTokens','去左侧取步骤牌 →');
 if(j.panel==='tokens')return `<p class="eyebrow">把步骤装回机器</p><h2>按顺序排好四块牌</h2><p class="plain-explain">先点一块，再点另一块，它们会交换位置。</p><div class="step-machine">${s.order.map((v,i)=>`<button data-tile="${i}" data-origin="dock" class="${j.tile===i?'selected':''}"><span>${i+1}</span><b>${esc(pack.steps[v])}</b></button>`).join('')}</div><div class="small-note">${j.tile===null?'先确认身份，再读取资料。':`已选第${j.tile+1}块，请再点另一块交换。`}</div>${button('checkLock','步骤排好了，去检查权限开关 →','outline')}`;
 if(j.panel==='lock')return speaker('阿索 · 工匠','这个开关决定：读取资料之前，是否先确认对方有权查看。仅仅“写一句不要泄露”不能代替这个检查。')+`<label class="switchline"><input id="guard" type="checkbox" ${s.guard?'checked':''}>读取前检查权限</label><div class="world-message ${s.guard?'good':'bad'}">${s.guard?'✓ 已接通权限检查':'⚠ 未接通，机器可能读取不该看的资料'}</div>`+button('toMachine','准备好了，拉下启动杆 →');
 return speaker('阿索 · 工匠','这台机器把步骤弄乱了。先检查中间的机器，找到故障，再去拿步骤牌。')+button('inspectMachine','检查故障机器 →');
}
function gardenPanel(){const e=pack.economics;
 if(j.panel==='survey')return speaker('调查记录',`每100位可能的使用者中，最多只有${e.adoption}位预计会真正使用。提案却按100人全用计算，这个承诺需要修正。`)+`<div class="evidence-card"><span>◇ 已记录：预计使用上限 ${e.adoption}%</span><p>不是“买了”就等于“会用”。先按调查支持的人数试算。</p></div>`+button('inspectQuality','接着看人工复核记录 →');
 if(j.panel==='quality')return speaker('复核记录',`在这次教学假设中，保留核对时每100次有${e.quality}次合格，要求至少${e.floor}次。核对每天需要${e.review}分钟。`)+`<div class="evidence-card"><span>◇ 已记录：复核需要时间，也有作用</span><p>数字是教学假设，用来观察取舍，不是真实模型性能。</p></div>`+button('openExperiment','去中央试验台动手试试 →');
 if(j.panel==='crystal'){
 if(!['survey','quality'].every(id=>j.inspected.includes(id)))return speaker('试验台','还缺少两份记录。先看使用调查，再看人工复核，才知道该怎样调节。')+button('inspectSurvey','先阅读调查 →');
 const x=E.calc(pack,s.budget.adoption,s.budget.review);
 return `<p class="eyebrow">改变条件，观察后果</p><h2>这份承诺站得住吗？</h2><label class="slider-label" for="adoption">每100人中，预计几人会用？<b id="adoptionValue">${s.budget.adoption}人</b></label><input id="adoption" type="range" min="10" max="100" step="5" value="${s.budget.adoption}"><label class="switchline"><input id="review" type="checkbox" ${s.budget.review?'checked':''}>保留每天${e.review}分钟人工检查</label><div class="experiment-readings"><div><small>每100次中合格</small><b id="qualityValue">${x.quality}次</b></div><div><small>一年估算净价值</small><b id="netValue">${Math.round(x.net).toLocaleString()}美元</b></div></div><div id="budgetMessage" class="world-message">${budgetMessage()}</div><details><summary>这些数字怎么算出来？</summary><p>${e.people}人，每月${e.days}天，每小时${e.hourly}美元；每天初步节省${e.minutes}分钟，检查占${e.review}分钟。初始投入${e.setup}美元，每月运营${e.monthly}美元。先按实际使用人数折算节省时间，再减去投入。它不等于现金收益。</p></details>${button('runExperiment','按当前条件试运行 →')}`;
 }
 return speaker('花园看守','这份提案写得很漂亮。不过，先去读调查和复核记录，再来试验台上改条件，看看承诺能不能兑现。')+button('inspectSurvey','先读左侧的使用调查 →');
}
function towerPanel(){
 if(j.panel==='brief')return speaker('来自邻岛的新委托',esc(pack.transfer))+`<div class="next-box"><b>这次要带走的是方法</b><p>换了地方，原来的条件还成立吗？检查方案时，选出恰好两项行动。</p></div>`+button('inspectPlans','查看圆桌上的四份方案 →');
 if(j.panel==='plans'||j.panel==='beacon')return `<p class="eyebrow">最后一次委托</p><h2>留下两项可靠行动</h2><p class="plain-explain">${esc(pack.transfer)}</p><div class="plan-cards">${pack.boss.map((b,i)=>`<label class="plan-card ${s.boss.includes(i)?'selected':''}"><input type="checkbox" data-plan="${i}" ${s.boss.includes(i)?'checked':''}><span>${esc(b.label)}</span></label>`).join('')}</div><div class="small-note">已经选择 ${s.boss.length} / 2 项；需要恰好两项。</div>${button('testBeacon','用这两项行动点亮塔灯 →','primary',s.boss.length!==2)}`;
 return speaker('守塔人','以前的办法到了新地方，还能照搬吗？先读窗边的新委托，再检查桌上的方案。')+button('readBrief','先读新的委托 →');
}
function feedbackPanel(){const f=j.feedback;return speaker(f.ok?'事情发生了变化':'这次没有办成',esc(f.text))+`<div class="consequence ${f.ok?'good':'bad'}"><b>${f.ok?'✓ 观察到的结果':'⚠ 观察到的后果'}</b><p>${esc(f.detail||'')}</p></div>${f.source?sourceLink(f.source):''}${f.kind==='letter'?button('afterLetter',f.ok?'收好结果，处理下一封 →':'保留线索，换个帮手再试 →'):f.ok?completedPanel(true):button('repairAgain','回到操作，修正后再试 →')}`;}
function completedPanel(short=false){
 if(s.stage===3)return `${short?'':speaker('守塔人','你让塔灯重新亮起来了。你带来的不是一个漂亮承诺，而是经过检查的方法。')}<div class="badge big">✦</div><h2>学院的灯，重新亮起。</h2><p class="plain-explain">四处修复已完成。你学会了分清任务、安排步骤、检查承诺，并在新地方重新判断。</p>${button('showEnding','查看本章结局与学习记录 →')}`;
 return `${short?'':speaker('修复完成','这里已经恢复运转。通行徽章已放进行囊，后面的门打开了。')}<div class="badge">${s.stage===0?'✉':s.stage===1?'⚒':'◈'}</div><h2>获得${['调查','修复','试验'][s.stage]}徽章</h2><p class="plain-explain">它让你可以进入${names[s.stage+1]}。也可以返回地图，重新检查已经修好的地方。</p>${button('goNext','穿过后门，进入'+names[s.stage+1]+' →')}${button('revisit','留在这里，再看看','textbtn')}`;
}
function bindDock(){
 bind('enterNext',()=>s.completed.length===4?enterRoom('tower'):travel(s.completed.length));
 bind('finishTutorial',()=>{j.tutorialDone=true;j.feedback=null;J.log(s,'tutorial','completed');enterRoom('map');});
 document.querySelectorAll('[data-tool]').forEach(el=>el.onclick=()=>{if(j.room==='tutorial'){j.tutorialChoice=el.dataset.tool;j.feedback=null;}else{j.chosen=el.dataset.tool;j.feedback=null;}render();document.querySelectorAll('[data-tool]').forEach(e=>{if(e.dataset.tool===el.dataset.tool)e.focus();});});
 bind('tryPractice',()=>{if(j.tutorialChoice==='rules'){j.tutorial=3;j.feedback=null;}else j.feedback={ok:false,text:'羽毛笔写了一段说明，但访客仍没有拿到账单。规则已经给全了，试试按表计算的帮手。'};render();});
 bind('explainHelpers',openSources);bind('showLetters',()=>{j.panel='letters';j.feedback=null;render();});
 bind('useClue',()=>{j.letter=+j.panel.slice(-1);j.panel='letters';j.chosen=null;render();});
 document.querySelectorAll('[data-letter]').forEach(el=>el.onclick=()=>{j.letter=+el.dataset.letter;j.chosen=null;j.feedback=null;render();});
 bind('findEvidence',()=>handleObject('clue'+j.letter));
 bind('dispatch',dispatch);
 bind('nextLetter',nextLetter);bind('finishArchive',runStage);
 bind('afterLetter',()=>{const ok=j.feedback.ok;j.feedback=null;if(ok)nextLetter();else{j.panel='letters';j.chosen=null;render();}});
 bind('findTokens',()=>handleObject('tokens'));bind('checkLock',()=>handleObject('lock'));bind('inspectMachine',()=>handleObject('machine'));
 document.querySelectorAll('[data-tile]').forEach(el=>el.onclick=()=>{const n=+el.dataset.tile;if(j.tile===null)j.tile=n;else{[s.order[j.tile],s.order[n]]=[s.order[n],s.order[j.tile]];J.log(s,'swapSteps',[j.tile,n]);j.tile=null;}render();document.querySelectorAll('[data-tile]').forEach(e=>{if(e.dataset.tile===el.dataset.tile&&e.dataset.origin===el.dataset.origin)e.focus();});});
 if($('guard'))$('guard').onchange=e=>{s.guard=e.target.checked;render();$('guard').focus();};bind('toMachine',()=>handleObject('run'));
 bind('inspectSurvey',()=>handleObject('survey'));bind('inspectQuality',()=>handleObject('quality'));bind('openExperiment',()=>handleObject('crystal'));
 if($('adoption'))$('adoption').oninput=e=>{s.budget.adoption=+e.target.value;updateBudget();save();};
 if($('review'))$('review').onchange=e=>{s.budget.review=e.target.checked;updateBudget();save();};bind('runExperiment',runStage);
 bind('readBrief',()=>handleObject('brief'));bind('inspectPlans',()=>handleObject('plans'));
 document.querySelectorAll('[data-plan]').forEach(el=>el.onchange=()=>{const n=+el.dataset.plan;s.boss=el.checked?[...new Set([...s.boss,n])]:s.boss.filter(v=>v!==n);render();document.querySelectorAll('[data-plan]')[n].focus();});
 bind('testBeacon',()=>{J.inspect(s,'beacon');runStage();});
 bind('repairAgain',()=>{j.feedback=null;j.panel=['letters','tokens','crystal','plans'][s.stage];render();});
 bind('goNext',()=>enterRoom(roomKeys[s.stage+1]));bind('revisit',()=>{j.feedback=null;j.panel=['letters','tokens','crystal','plans'][s.stage];render();});bind('showEnding',ending);
}
function dispatch(){const n=j.letter,r=pack.routes[n],t=tools.find(x=>x.id===j.chosen),result=J.letter(s,pack);if(result.blocked)return toast('先拿到这封信对应的资料，再选一个帮手。');
 const outcomes=['请求按公开规则得到了统一处理。','团队得到了可与实际数据比较的数量估计。','工作人员拿到了可核对的草稿。','多步工作在授权工具范围内继续推进。'];
 j.feedback={kind:'letter',ok:result.ok,text:result.ok?`“${t.short}”完成了第${n+1}封委托。`:`“${t.short}”做了别的事，这封委托还没有完成。`,detail:result.ok?outcomes[n]+' '+r.why:`它擅长的是：${t.desc} 但这封信需要的结果是：${r.request}`,source:r.source};render();}
function nextLetter(){const next=pack.routes.findIndex((r,i)=>s.routes[i]!==r.answer);j.feedback=null;j.chosen=null;j.panel='letters';if(next<0){runStage();return;}j.letter=next;render();}
function runStage(){const i=s.stage;if(!J.ready(s,i))return toast('还缺少调查步骤。查看底部的“当前目标”，先把资料找齐。');
 if(i===0&&j.letterFirst.some(v=>v===false)&&s.first[0]===null)s.first[0]=false;
 const wasDone=s.completed.includes(i),ok=E.submit(pack,s);let detail='';
 if(i===0)detail=ok?'四个请求都交给了合适的帮手，待办队列清空。':'还有委托没有办成，返回桌上逐封检查。';
 if(i===1)detail=ok?'机器按正确顺序执行，资料访问受到了检查。':!s.guard?'机器没有确认来访者的权限，存在读到受限资料的风险。':`第${s.order.findIndex((v,n)=>v!==n)+1}步放成了“${pack.steps[s.order[s.order.findIndex((v,n)=>v!==n)]]}”。检查它需要先完成什么，修正后再运行。`;
 if(i===2)detail=ok?'这次估算符合调查与质量要求。即使收益为负，也应该如实呈现。':!s.budget.review?'节省时间看起来增加了，但情境质量跌破要求，承诺失效。':`你按${s.budget.adoption}%的人使用来承诺收益，调查最多只支持${pack.economics.adoption}%。`;
 if(i===3){const bad=pack.boss.filter((b,n)=>s.boss.includes(n)&&!b.required);detail=ok?'新场景的证据、权限与业务价值仍然受到检查。':bad.length?bad.map(b=>b.why).join(' '):'这次需要恰好两项行动，而且必须同时回应新场景的限制。';}
 j.feedback={kind:'stage',ok,text:ok?'你的操作让问题得到了解决。':'试运行暴露了问题，可以保留线索后修正。',detail,source:i===0?'D1':i===1?pack.workflowSource:i===2?'D2':null};J.log(s,'stage',{stage:i,correct:ok});if(ok&&!wasDone)toast('获得'+['调查徽章','修复徽章','试验徽章','守望者徽章'][i]+'，新的门已打开。');render();}
function budgetMessage(){const x=E.calc(pack,s.budget.adoption,s.budget.review);return !s.budget.review?'⚠ 检查关掉后，合格次数达不到要求。':s.budget.adoption>pack.economics.adoption?'⚠ 预计使用人数超过了调查支持。':x.net<0?'◇ 如实估算后收益为负；这也是有用的发现。':'✓ 当前条件符合证据；还需要实际验证收益。';}
function updateBudget(){const x=E.calc(pack,s.budget.adoption,s.budget.review);$('adoptionValue').textContent=s.budget.adoption+'人';$('qualityValue').textContent=x.quality+'次';$('netValue').textContent=Math.round(x.net).toLocaleString()+'美元';$('budgetMessage').textContent=budgetMessage();if($('sceneQuality'))$('sceneQuality').textContent='合格 '+x.quality+' / 100 次';if($('sceneUsers'))$('sceneUsers').textContent='预计每100人中 '+s.budget.adoption+' 人会用';$('worldState').className='world-state '+(!s.budget.review?'fault':'');}
function ending(){modal('本章结局',`<div class="badge big">✦</div><p class="eyebrow">森屿学院重新亮起灯</p><h2>你带走的，是会判断的方法。</h2><p>你检查过需求、修复过步骤、试过不漂亮的数字，也在新地方重新检验了承诺。</p><div class="ending-record">${names.map((name,i)=>`<div><b>${name}</b><span>${s.first[i]?'首次通过':'修正后通过'}${s.hints.includes(i)?' · 求助过':''}</span></div>`).join('')}</div><p class="small-note">每封委托的尝试单独保留；教学不计入正式表现。一次过关不代表长期掌握。</p><div class="actions">${button('saveEnding','保存这次的学习记录','outline')}${button('anotherChapter','带着方法挑战下一章 →')}</div>`);bind('saveEnding',exportLog);bind('anotherChapter',()=>{const p=packs.find(p=>p.id!==pack.id)||pack;$('modal').close();load(p);});}
function hint(){if(!j.tutorialDone){toast(objective());return;}if(!s.hints.includes(s.stage))s.hints.push(s.stage);J.log(s,'hint',objective());save();modal('只提示下一步，不直接给答案',`<h2>先做这一件事</h2><p class="large-copy">${esc(objective())}</p><p>不用把所有步骤一次记住。完成这一步后，当前目标会更新。</p>${button('closeHint','好，我回去试试 →')}`);bind('closeHint',()=>$('modal').close());}
function exportLog(){download('知识副本_冒险记录.json',JSON.stringify({title:pack.title,notice:'原创学习练习记录，教学与正式尝试分开，不代表考试成绩或长期掌握。',exported:new Date().toISOString(),state:s,sources:pack.sources},null,2),'application/json');}
function download(name,body,type){const url=URL.createObjectURL(new Blob([body],{type})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function openSources(){modal('知识与词语',`<h2>先用日常语言，再认识名称</h2><div class="glossary">${tools.map(t=>`<div><b>${t.name}</b><p>${t.desc}</p><small>材料中的名称：${t.term}</small></div>`).join('')}<div><b>实际采用率</b><p>有资格使用的人中，真正会使用的比例。不是买了账号就算使用。</p></div><div><b>人工复核</b><p>人在使用结果之前，再核对一次。它需要时间，也可能避免错误。</p></div><div><b>投资回报率</b><p>把收益减去投入，再与投入比较。本游戏的时间折算价值不等于真实现金节省。</p></div></div><details><summary>查看知识来源与展示边界</summary>${pack.sources.map(a=>`<div class="source"><a href="${esc(a.url)}" target="_blank" rel="noopener">${esc(a.title)} ↗</a><p>${esc(a.note)}</p></div>`).join('')}<p>剧情、数字和场景为原创教学情境。本版对话预先编制，没有接入实时AI或任意教材自动生成。</p></details>`);}
function guide(){modal('游戏介绍与玩法',`<h2>你要做什么？</h2><p>你是新来的修复师。学院里的帮手接错任务，机器步骤也错了。你要修好四处地点，最后点亮塔灯。</p><ol class="guide-list"><li><b>先看当前目标。</b>底部只告诉你下一步该做什么。</li><li><b>点击场景物件。</b>资料、机器、调查记录都能检查；发光圈提示当前有用的物件。</li><li><b>读右侧的回应，再动手。</b>选帮手、交换步骤或调节人数，不只是在读文章。</li><li><b>试做，观察结果。</b>选错可修正，线索不会丢，首次尝试仍保留。</li><li><b>拿徽章，开下一扇门。</b>四处地点全部修好就有本章结局。</li></ol><p>不熟悉操作时，建议重新玩一遍不计分的新手教学。它不清空正式进度。</p>${button('replayTutorial','重新体验一步步教学 →')}`);bind('replayTutorial',()=>{$('modal').close();j.welcome=true;j.tutorial=0;j.tutorialChoice=null;j.room='tutorial';j.feedback=null;$('welcome').hidden=true;$('game').hidden=false;render();});}
function inventory(){modal('行囊 · 已发现与已获得',`<h2>线索和徽章都在这里</h2>${j.evidence.length?j.evidence.map(i=>`<div class="source"><b>◇ ${clueNames[i]}</b><p>${clueText[i]}</p></div>`).join(''):'<p>还没有正式线索。去档案馆检查资料，就会收进行囊。</p>'}${s.completed.map(i=>`<div class="inventory-badge">✓ ${['调查徽章 → 可进维修工坊','修复徽章 → 可进试验花园','试验徽章 → 可进试炼塔','守望者徽章 → 本章结局'][i]}</div>`).join('')}`);}
function reset(){modal('重新开始本章',`<h2>要重新调查这座学院吗？</h2><p>会清空当前章节进度，包括正式尝试与教学。另一个章节不受影响。</p><div class="actions">${button('saveBeforeReset','先保存记录','outline')}${button('confirmReset','确认重新开始')}</div>`);bind('saveBeforeReset',exportLog);bind('confirmReset',()=>{cancelWalk();s=E.fresh(pack.id);j=J.normalize(s);save();$('modal').close();showWelcome();render();});}
function menu(){modal('游戏菜单',`<h2>冒险途中，也可以停一停</h2><div class="menu-actions">${button('resumeMenu','回到游戏','outline')}${button('guideMenu','玩法与新手教学','outline')}${button('sourcesMenu','知识与词语','outline')}${button('materialsMenu','更换学习材料','outline')}${button('resetMenu','重新开始本章','outline')}</div><label for="packSelect">切换章节，进度分别保存</label><select id="packSelect">${packs.map(p=>`<option value="${esc(p.id)}" ${p.id===pack.id?'selected':''}>${esc(p.title)}</option>`).join('')}</select>${!j.tutorialDone||j.room==='tutorial'?button('skipTutorial','离开教学，进入正式冒险','textbtn'):''}`);bind('resumeMenu',()=>$('modal').close());bind('guideMenu',guide);bind('sourcesMenu',openSources);bind('materialsMenu',materials);bind('resetMenu',reset);bind('skipTutorial',()=>{j.welcome=true;j.tutorialDone=true;j.feedback=null;J.log(s,'tutorial','skipped');J.enter(s,'map');$('modal').close();$('welcome').hidden=true;$('game').hidden=false;render();});$('packSelect').onchange=e=>{$('modal').close();load(packs.find(p=>p.id===e.target.value));};}
function boot(){
 $('start').onclick=start;$('continue').onclick=continueGame;$('restartWelcome').onclick=reset;$('openingInfo').onclick=guide;$('home').onclick=e=>{e?.preventDefault?.();cancelWalk();showWelcome();};$('guide').onclick=guide;$('book').onclick=openSources;$('menu').onclick=menu;$('satchel').onclick=inventory;$('backMap').onclick=()=>enterRoom('map');$('returnScene').onclick=()=>$('sceneViewport').scrollIntoView({behavior:still?'auto':'smooth',block:'start'});$('hint').onclick=hint;$('export').onclick=exportLog;$('closeModal').onclick=()=>$('modal').close();
 $('motion').onclick=()=>{still=!still;document.body.classList.toggle('still',still);$('motion').textContent=still?'✧ 恢复动效':'✧ 暂停动效';cancelWalk();};
 $('sceneArt').onerror=()=>{$('sceneArt').hidden=true;$('sceneCanvas').classList.add('art-failed');toast('图片暂时没有加载出来，物件与任务仍可继续操作。');};
 document.body.classList.toggle('still',still);$('motion').textContent=still?'✧ 恢复动效':'✧ 暂停动效';load(pack);
}
const QuestApp={boot};
