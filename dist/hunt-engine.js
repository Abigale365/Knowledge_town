(function(root,factory){const api=factory();if(typeof module==='object')module.exports=api;else root.HuntEngine=api;})(typeof window==='undefined'?globalThis:window,function(){
 const types=['envelope','book','key','scroll','map','bottle','abacus','purse','watch','ledger','glass','quill'];
 const names=['封蜡信件','蓝皮书','黄铜钥匙','绿绳卷轴','折叠地图','翡翠药瓶','木算盘','红色钱袋','怀表','摊开的账本','放大镜','羽毛笔'];
 const source='https://docs.aws.amazon.com/aws-certification/latest/ai-business-strategist-01/ai-business-strategist-01-domain1.html';
 const source2='https://docs.aws.amazon.com/aws-certification/latest/ai-business-strategist-01/ai-business-strategist-01-domain2.html';
 const anchors=[[9,24],[25,22],[42,19],[62,20],[80,25],[91,38],[12,43],[31,42],[49,40],[69,42],[83,53],[10,64],[27,62],[45,61],[64,64],[89,73],[18,83],[39,81],[60,82],[78,86]];
 function rng(seed){let a=seed>>>0;return()=>{a+=0x6D2B79F5;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};}
 function shuffle(a,r){a=[...a];for(let i=a.length-1;i>0;i--){let j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
 function make(seed,round){const r=rng((seed+round*9127)>>>0),dept=r()>.5?'温室部':'航运部',month=r()>.5?'九月':'十月',period=r()>.5?6:12;
 const templates=[
 {title:'给新同事找对资料',scene:'archive',tag:'知识来源',request:`${dept}的新同事要查询${month}正在执行的制度。请找到三份能共同确认“适用、有效、已审核”的材料。`,principle:'资料能找到，还要确认适用范围、有效期与审核状态。检索得到的文字不自动等于可靠答案。',url:source,goals:[
 ['部门说明','book',`${dept}的制度目录`,`适用部门：${dept}。目录明确列出了本部门的制度范围。`,'全院宣传手册','介绍学院历史与建筑，没有说明本部门执行的制度。',`要确认适用部门，介绍学院历史的书不能替代${dept}的制度目录。`],
 ['生效记录','scroll',`${month}生效记录`,`生效月份：${month}；状态：现行。`,'上月废止的制度','状态：已废止；仅供历史查阅。','历史版本可以参考，但不能作为当前执行依据。'],
 ['审核凭证','envelope','馆长的审核回函','审核结论：已核对原始制度；批准用于本次答复。','未核实的匿名便条','便条写着“听说是这样”，没有来源，也没有审核人。','来源不明的说法需要核实，不能当作审核通过的证据。']]},
 {title:'为预测找到真证据',scene:'garden',tag:'数据与任务',request:`为${dept}预测下一月需求。委托要求使用本部门连续${period}个月的数据，并保留一部分历史结果验证。`,principle:'预测需要与目标相关的历史数据，并用未参与拟合的数据验证。漂亮的承诺与单次印象不能替代证据。',url:source,goals:[
 ['范围匹配','map',`${dept}业务范围图`,`范围：${dept}。统计口径与本次预测一致。`,'另一部门的范围图',`范围：${dept==='温室部'?'航运部':'温室部'}。业务对象与本次委托不同。`,'数据必须与要解决的问题相关。另一部门的业务范围不能直接代表本部门。'],
 ['连续历史','ledger',`${period}个月需求账本`,`部门：${dept}；连续${period}个月；每月记录实际需求量。`,'一次观察的小记','只有昨天一次观察，没有连续需求记录。',`一次观察不满足连续${period}个月的要求，也无法说明需求随时间的变化。`],
 ['验证方案','watch','封存月份的验证记录','留出最近一段历史，不参与拟合；用其实际需求检验预测误差。','百分百准确的保证','只有“保证百分百准确”的广告，没有验证结果。','预测要验证误差，不能用宣传承诺替代测试。']]},
 {title:'算清这笔投入',scene:'archive',tag:'投入与价值',request:`${dept}准备试用助手。请为成本评估收齐初次投入、每月支出和包含人工复核的工时证据。`,principle:'评估价值要计算持续费用与人工复核，收益应来自可检查的试点记录。这些金额只是本局的教学假设。',url:source2,goals:[
 ['初次投入','purse','部署费用清单',`初次配置与培训：${1000+Math.floor(r()*5)*500}金币；不含月费。`,'免费的口头承诺','只写“完全免费”，没有配置、培训或合同明细。','“免费”的承诺无法说明实际部署与培训投入。'],
 ['持续支出','abacus','月度费用算盘','每月列出调用、维护与人工复核成本，三项分别核算。','只算第一次的算盘','只列一次性购买费用，没有后续费用。','一次性费用无法替代持续使用时的月度支出。'],
 ['工时证据','ledger','试点复核账本','记录使用前工时、使用后工时，并计入人工复核耗时。','只记生成速度的账本','只记录生成有多快，没有计算人工复核时间。','生成快不等于净节省同样多；复核时间也要算进去。']]}
 ];
 const t=templates[round];if(!t)throw Error('无效轮次');let items=[];
 t.goals.forEach((g,i)=>{for(let v=0;v<2;v++)items.push({id:`g${i}-${v}`,type:g[1],name:g[v?4:2],text:g[v?5:3],goal:i,valid:!v,why:g[6]});});
 const used=t.goals.map(g=>g[1]);shuffle(types.filter(x=>!used.includes(x)),r).slice(0,6).forEach((type,i)=>items.push({id:'d'+i,type,name:names[types.indexOf(type)],text:'这是一件日常陈设。它没有提供本次委托要求的证据。',goal:-1,valid:false,why:'先对照委托中的三项要求，再判断它是否提供相关信息。'}));
 const positions=shuffle(anchors,r);items=shuffle(items,r).map((x,i)=>({...x,x:positions[i][0],y:positions[i][1],angle:Math.round(r()*22-11),sprite:types.indexOf(x.type)}));
 return{...t,goals:t.goals.map(g=>({label:g[0],type:g[1],sprite:types.indexOf(g[1])})),items,seed,round};
 }
 function fresh(seed){return{v:1,seed:seed>>>0,round:0,accepted:[],rejected:[],seen:[],mistakes:0,hints:0,done:[],started:false};}
 function decide(state,id,collect){const t=make(state.seed,state.round),item=t.items.find(x=>x.id===id);if(!item)return{ok:false,message:'找不到这个物件。'};if(state.accepted.includes(id)||state.rejected.includes(id))return{ok:false,message:'这件物品已经检查过。'};
 if(!state.seen.includes(id))state.seen.push(id);const correct=collect===item.valid;if(!correct){state.mistakes++;return{ok:false,message:item.valid?'这份材料符合委托中的一项要求。再对照它的内容检查一下。':item.why};}
 (collect?state.accepted:state.rejected).push(id);return{ok:true,message:collect?'已收进证据袋。':'已排除，继续寻找。',complete:state.accepted.length===3};}
 function next(s){if(s.accepted.length!==3)return false;if(s.round===2)return false;s.done.push({round:s.round});s.round++;s.accepted=[];s.rejected=[];s.seen=[];return true;}
 function restore(raw){try{const s=JSON.parse(raw);if(s.v!==1||!Number.isInteger(s.seed)||s.seed<0||s.seed>4294967295||!Number.isInteger(s.round)||s.round<0||s.round>2)throw 0;const items=make(s.seed,s.round).items;for(const k of ['accepted','rejected','seen'])if(!Array.isArray(s[k])||new Set(s[k]).size!==s[k].length||s[k].some(id=>!items.some(x=>x.id===id)))throw 0;if(s.accepted.some(id=>!items.find(x=>x.id===id).valid)||s.rejected.some(id=>items.find(x=>x.id===id).valid)||![s.mistakes,s.hints].every(n=>Number.isInteger(n)&&n>=0)||!Array.isArray(s.done)||s.done.length!==s.round||typeof s.started!=='boolean')throw 0;return s;}catch{return null;}}
 return{make,fresh,decide,next,restore,types,names,anchors};
});
