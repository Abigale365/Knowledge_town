/* Public-view renderer. The concept-game engine and host own validation and persistence. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.ConceptGamesUI=api;})(typeof globalThis==='undefined'?this:globalThis,function(){
'use strict';
const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const mode=value=>['zh','en','bi'].includes(value)?value:'zh';
function text(value,language='zh'){
 const p=typeof value==='string'?{zh:value,en:value}:value||{},zh=typeof p.zh==='string'?p.zh:'',en=typeof p.en==='string'?p.en:zh;
 return mode(language)==='bi'&&zh!==en?`<span lang="zh-CN">${escape(zh)}</span><span class="cg-secondary" lang="en">${escape(en)}</span>`:escape(mode(language)==='en'?en:zh||en);
}
const copy=(zh,en,language)=>text({zh,en},language);
function itemButton(item,language,extra=''){return `<button type="button" class="cg-item" data-cg-item="${escape(item.id)}" ${extra}>${text(item.text||item.label,language)}</button>`;}
function sortView(view,draft,language){
 const placed=draft.placements||{};
 return `<div class="cg-items">${(view.items||[]).filter(item=>!placed[item.id]).map(item=>itemButton(item,language,`aria-pressed="${draft.selected===item.id}"`)).join('')}</div><div class="cg-bins">${(view.bins||[]).map(bin=>`<section class="cg-bin"><button type="button" data-cg-bin="${escape(bin.id)}">${text(bin.text||bin.label,language)}</button><div class="cg-items">${(view.items||[]).filter(item=>placed[item.id]===bin.id).map(item=>itemButton(item,language,`aria-pressed="${draft.selected===item.id}"`)).join('')}</div></section>`).join('')}</div>`;
}
function orderView(view,draft,language){
 const order=Array.isArray(draft.order)?draft.order:[],items=view.items||[];
 return `<div class="cg-track">${order.map((id,index)=>{const item=items.find(item=>item.id===id);return item?`<section class="cg-track-slot"><span>${index+1}</span><p>${text(item.text||item.label,language)}</p><div class="cg-move"><button type="button" data-cg-move="${escape(id)}" data-cg-delta="-1" ${index===0?'disabled':''} aria-label="${escape(language==='en'?'Move earlier':'向前移动')}">←</button><button type="button" data-cg-move="${escape(id)}" data-cg-delta="1" ${index===order.length-1?'disabled':''} aria-label="${escape(language==='en'?'Move later':'向后移动')}">→</button><button type="button" data-cg-remove="${escape(id)}" aria-label="${escape(language==='en'?'Return this piece':'放回部件')}">×</button></div></section>`:'';}).join('')}</div><div class="cg-items">${items.filter(item=>!order.includes(item.id)).map(item=>itemButton(item,language)).join('')}</div>`;
}
function chooseView(view,draft,language){const selected=Array.isArray(draft.selected)?draft.selected:[];return `<div class="cg-options">${(view.options||view.items||[]).map(item=>`<button type="button" class="cg-item" data-cg-choice="${escape(item.id)}" aria-pressed="${selected.includes(item.id)}">${text(item.text||item.label,language)}</button>`).join('')}</div>`;}
function fieldsView(view,draft,language){return `<div class="cg-fields">${(view.fields||[]).map(field=>`<label class="cg-field"><span>${text(field.label,language)}</span><input data-cg-field="${escape(field.id)}" type="${field.inputType==='text'?'text':'number'}" ${field.inputType==='text'?'maxlength="200"':'step="any"'} value="${escape(draft.values?.[field.id]??'')}"></label>`).join('')}</div>`;}
function matrixView(view,draft,language){const selected=Array.isArray(draft.selected)?draft.selected:[];return `<div class="cg-matrix-wrap"><table class="cg-matrix"><thead><tr><th>${copy('项目','Item',language)}</th>${(view.columns||[]).map(col=>`<th scope="col">${text(col.text||col.label,language)}</th>`).join('')}</tr></thead><tbody>${(view.rows||[]).map(row=>`<tr><th scope="row">${text(row.text||row.label,language)}</th>${(view.columns||[]).map(col=>{const id=row.id+':'+col.id;return `<td><button type="button" data-cg-choice="${escape(id)}" aria-pressed="${selected.includes(id)}" aria-label="${escape([row.text?.[language]||row.label?.[language]||row.id,col.text?.[language]||col.label?.[language]||col.id].join(' · '))}">${selected.includes(id)?'✓':'＋'}</button></td>`;}).join('')}</tr>`).join('')}</tbody></table></div>`;}
function controls(view={},draft={},language='zh'){
 const renderers={sort:sortView,order:orderView,choose:chooseView,number:fieldsView,edit:fieldsView,matrix:matrixView};
 const renderer=renderers[view.type];
 return renderer?renderer(view,draft,mode(language)):`<p class="cg-error" role="status">${copy('此操作暂不支持，请保留进度并返回。','This interaction is not supported yet. Keep your progress and return.',language)}</p>`;
}
function feedback(checks,language='zh'){
 return `<section class="cg-feedback" aria-live="polite"><ul>${(Array.isArray(checks)?checks:[]).map((check,index)=>`<li class="${check.correct===true?'cg-correct':'cg-review'}"><strong>${text(check.label||{zh:'项目 '+(index+1),en:'Item '+(index+1)},language)}</strong><p>${text(check.message,language)}</p></li>`).join('')}</ul></section>`;
}
const clone=value=>JSON.parse(JSON.stringify(value));
const supported=d=>['rule-runner','parameter-lab','evidence-board','sample-trainer','cluster-builder','reward-path','model-flow','inventory-sim','data-cleaner','text-extractor','image-inspector'].includes(d?.kind);
const plain=(value,language)=>{const p=typeof value==='string'?{zh:value,en:value}:value||{};return mode(language)==='bi'?[p.zh,p.en].filter(Boolean).join(' / '):p[mode(language)]||p.zh||p.en||'';};
function optionText(options,id,language){const item=options.find(item=>item.id===id);return item?text(item.text,language):copy('未先判断','No prediction',language);}
function ruleView(d,s,language,inputRaw){
 const data=s.data,c=d.config,last=data.runs[data.runs.length-1];
 return `<div class="cg-machine"><section class="cg-machine-port"><label for="cgInput">${copy('输入整数','Integer input',language)}</label><input id="cgInput" type="number" step="1" min="${escape(c.minInput)}" max="${escape(c.maxInput)}" value="${escape(inputRaw)}"><p>${copy('先选预计动作，再运行并观察。','Predict the action, then run and observe.',language)}</p></section><section class="cg-machine-port"><strong>${copy('固定规则版本','Fixed rule version',language)} ${escape(c.ruleVersion)}</strong><div class="cg-options">${c.outputs.map((o,i)=>`<button type="button" id="cgPredict${i}" data-cg-predict="${i}" aria-pressed="${data.prediction===o.id}">${text(o.text,language)}</button>`).join('')}</div><button id="cgRun" type="button" class="primary">${copy('运行一次','Run once',language)}</button></section><section class="cg-machine-port"><strong>${copy('本次输出','Latest output',language)}</strong><p>${last?optionText(c.outputs,last.output,language):copy('运行后观察结果','Run to observe a result',language)}</p></section></div><h3>${copy('观察记录','Observation log',language)}</h3><div class="cg-log">${data.runs.map((r,i)=>`<p><strong>${i+1}</strong> · ${copy('输入','Input',language)} ${escape(r.input)} · ${escape(r.ruleVersion)}<br>${copy('预计','Predicted',language)}: ${optionText(c.outputs,r.prediction,language)}<br>${copy('实际输出','Observed output',language)}: ${optionText(c.outputs,r.output,language)}</p>`).join('')||`<p>${copy('还没有运行记录。重跑会保留此前的观察。','No runs yet. Repeating a run keeps earlier observations.',language)}</p>`}</div><h3>${copy('根据记录解释观察','Explain your observations',language)}</h3><div class="cg-options">${c.conclusions.map((o,i)=>`<button type="button" id="cgConclude${i}" data-cg-conclude="${i}" aria-pressed="${data.conclusion===o.id}">${text(o.text,language)}</button>`).join('')}</div>`;
}
function parameterView(d,s,language,inputRaw){
 const data=s.data,c=d.config;
 return `<div class="cg-machine"><section class="cg-machine-port"><label for="cgInput">${copy('本次使用的输入','Input to use',language)}</label><input id="cgInput" type="number" step="1" min="${escape(c.minInput)}" max="${escape(c.maxInput)}" value="${escape(inputRaw)}"><p>${copy('当前参数','Current parameter',language)}: <strong>${escape(data.weight)}</strong></p></section><section class="cg-machine-port"><button id="cgInfer" type="button" class="primary">${text(c.operationLabels.infer,language)}</button><button id="cgTrain" type="button">${text(c.operationLabels.train,language)}</button><button id="cgResetModel" type="button">${text(c.operationLabels.resetModel,language)}</button></section><section class="cg-machine-port"><strong>${copy('给定的核验样本','Given verified example',language)}</strong><p>${copy('输入','Input',language)} ${escape(c.sample.input)} → ${copy('核验结果','Verified outcome',language)} ${escape(c.sample.target)}</p></section></div><h3>${copy('检视实际操作记录','Inspect the operations',language)}</h3><div class="cg-log">${data.operations.map((op,i)=>`<section class="cg-operation" data-cg-operation="${i}"><h4>${copy('第 '+(i+1)+' 次操作','Operation '+(i+1),language)}</h4><p>${copy('输入','Input',language)} ${escape(op.input)} → ${copy('输出','Output',language)} ${escape(op.output)}<br>${copy('参数前后','Parameter before and after',language)} ${escape(op.before)} → ${escape(op.after)}</p><div class="cg-options">${c.judgmentOptions.map((o,j)=>`<button type="button" id="cgClassify${i}_${j}" data-cg-event="${i}" data-cg-decision="${j}" aria-pressed="${data.classifications[op.id]===o.id}">${text(o.text,language)}</button>`).join('')}</div></section>`).join('')||`<p>${copy('先操作模型，再对实际记录作判断。','Operate the model, then judge the resulting records.',language)}</p>`}</div>`;
}
function act(label,a,language,selected=false){return '<button type="button" data-cg-action="'+escape(JSON.stringify(a))+'" aria-pressed="'+selected+'">'+text(label,language)+'</button>';}
function clusterView(d,s,language,ui){
 const c=d.config,n=s.data,selected=ui.local?.point;
 const point=p=>'<button type="button" draggable="'+(s.phase==='playing')+'" data-cg-point="'+escape(p.id)+'" aria-pressed="'+(selected===p.id)+'">'+copy('数值点','Numeric point',language)+' <strong>'+escape(p.value)+'</strong></button>';
 return '<p>'+copy('单击一个数值点，再单击目标组；也可拖入组内。Tab选择按钮，Enter或空格确认。','Select a numeric point, then its target group, or drag it into a group. Use Tab and Enter or Space for the same operation.',language)+'</p><p>'+copy('每组至少','Minimum per group',language)+' '+escape(c.minimumPerGroup)+' · '+copy('最大数值差','Maximum range',language)+' '+escape(c.maximumRange)+'</p><section class="cg-point-tray"><h3>'+copy('尚未分组','Ungrouped',language)+'</h3>'+c.points.filter(p=>!n.placements[p.id]).map(point).join('')+'</section><div class="cg-cluster-board">'+c.groups.map(g=>'<section class="cg-cluster-group" data-cg-drop-group="'+escape(g.id)+'"><h3>'+text(g.label,language)+'</h3><button type="button" data-cg-place-selected="'+escape(g.id)+'">'+copy('将选中点放入本组','Place selected point here',language)+'</button><div class="cg-point-tray">'+c.points.filter(p=>n.placements[p.id]===g.id).map(point).join('')+'</div></section>').join('')+'</div>'+act(c.actions.check,{type:'check'},language)+c.descriptions.map(v=>act(v.label,{type:'describe',decision:v.id},language,n.description===v.id)).join('')+'<details class="cg-cluster-shortcuts"><summary>'+copy('直接选择点与组的键盘快捷操作','Direct point-and-group keyboard shortcuts',language)+'</summary>'+c.groups.map(g=>'<section><h4>'+text(g.label,language)+'</h4>'+c.points.map(p=>act(String(p.value),{type:'place',pointId:p.id,groupId:g.id},language,n.placements[p.id]===g.id)).join('')+'</section>').join('')+'</details>';
}
function samplePlot(d,s,language){
 const c=d.config,n=s.data,known=c.samples.filter(v=>typeof v.x==='number'&&typeof v.y==='number'),unknown=c.samples.filter(v=>v.y===null);
 if(!known.length)return '';
 const maxX=Math.max(1,...known.map(v=>v.x)),maxY=Math.max(1,...known.map(v=>v.y)),px=x=>40+240*x/maxX,py=y=>150-110*y/maxY;
 const description=plain({zh:'仅显示给定训练样本的输入与目标。描边加粗表示已选样本。',en:'Only given training inputs and targets are plotted. A thicker outline marks a selected sample.'},language)+' '+known.map(v=>'x='+v.x+', y='+v.y).join('; ');
 return '<section class="cg-sample-observation" data-cg-sample-observation="true"><h3>'+copy('公开训练样本','Public training examples',language)+'</h3><svg class="cg-sample-plot" viewBox="0 0 330 190" role="img" aria-label="'+escape(description)+'"><path d="M40 25 V150 H305" fill="none" stroke="#778d6c" stroke-width="2"/><text x="6" y="18">'+escape(plain({zh:'目标 y',en:'Target y'},language))+'</text><text x="235" y="183">'+escape(plain({zh:'输入 x',en:'Input x'},language))+'</text>'+known.map(v=>'<g data-cg-sample-point="'+escape(v.id)+'" class="'+(n.selected.includes(v.id)?'cg-sample-chosen':'cg-sample-available')+'"><circle cx="'+px(v.x)+'" cy="'+py(v.y)+'" r="8"/><text x="'+px(v.x)+'" y="'+(py(v.y)-15)+'" text-anchor="middle">('+escape(v.x)+', '+escape(v.y)+')</text></g>').join('')+'</svg><p>'+copy('粗边点是已选训练样本；下面的样本按钮控制选择。','Thick outlines mark selected examples; use the sample buttons below to choose.',language)+'</p>'+unknown.map(v=>'<p class="cg-sample-unlabeled">'+copy('未画在目标轴上：输入','Not plotted on the target axis: input',language)+' '+escape(v.x)+' · '+copy('无目标','No target',language)+'</p>').join('')+(n.k!==null?'<p class="cg-sample-fit" data-cg-fitted-parameter="'+escape(n.k)+'">'+copy('实际拟合记录中的参数 k','Parameter k from the actual fit',language)+': <strong>'+escape(n.k)+'</strong> · '+copy('图中仍只有公开训练点；新输入的预测由你完成。','The plot still contains only public training points; predict the new input yourself.',language)+'</p>':'<p>'+copy('还没有实际拟合记录。','No fit has been recorded yet.',language)+'</p>')+'</section>';
}
function evidenceReferences(c,n,q,local,language){
 const selected=local[q.id]||n.selectedEvidence[q.id]||[];
 if(!selected.length)return '';
 return '<details class="cg-reference-list" open><summary id="cgReferences-'+escape(encodeURIComponent(q.id))+'">'+copy('本判断已选引用','References selected for this judgment',language)+' ('+selected.length+')</summary>'+c.evidence.filter(e=>selected.includes(e.id)).map(e=>{const index=c.evidence.indexOf(e)+1;return '<section class="cg-reference"><h4>'+copy('证据 '+index,'Evidence '+index,language)+'</h4>'+(n.opened.includes(e.id)?'<p>'+text(e.text,language)+'</p>':'<p>'+copy('这条记录尚未打开，请到上方同序号的证据卡检查原文，再重新作判断。','This record has not been opened. Inspect the source card with the same number above, then make your judgment again.',language)+'</p>')+'</section>';}).join('')+'</details>';
}
function modelFlowView(d,s,language,ui){
 const c=d.config,n=s.data,button=(label,a,selected)=>act(label,a,language,selected);
 return '<div class="cg-options">'+c.feeds.map(v=>button(v.label,{type:'feed',choice:v.id},n.feed===v.id)).join('')+'</div><div class="cg-model-paths">'+c.inputs.map(v=>{const runs=n.runs.filter(r=>r.inputId===v.id),last=runs[runs.length-1];return '<section class="cg-model-lane '+(ui.motion?.inputId===v.id?'cg-model-motion':'')+'" data-cg-model-input="'+escape(v.id)+'"><section class="cg-model-port"><span>'+text(v.label,language)+'</span><strong>'+escape(v.value)+'</strong>'+button({zh:'执行映射',en:'Execute mapping'},{type:'execute',inputId:v.id})+'</section><span class="cg-process-link" aria-hidden="true"><i></i>→</span><section class="cg-model-port"><span>'+copy('本题固定映射','Fixed mapping in this exercise',language)+'</span><strong>× '+escape(c.multiplier)+'</strong></section><span class="cg-process-link cg-process-link-out" aria-hidden="true"><i></i>→</span><section class="cg-model-port"><span>'+copy('实际运行的输出','Output from an actual run',language)+'</span><strong data-cg-model-output="'+escape(v.id)+'">'+(last?escape(last.output):copy('等待实际运行','Awaiting an actual run',language))+'</strong>'+(last?'<p>'+copy('已运行输入','Input actually run',language)+' '+escape(last.input)+'</p>':'')+'</section>'+(runs.length>1?'<details class="cg-model-history"><summary id="cgModelHistory-'+escape(encodeURIComponent(v.id))+'">'+copy('本输入运行记录','Run history for this input',language)+' ('+runs.length+')</summary>'+runs.map(r=>'<p>'+escape(r.input)+' → '+escape(r.output)+'</p>').join('')+'</details>':'')+'</section>';}).join('')+'</div>'+c.judgments.map(q=>'<section class="cg-operation"><h3>'+text(q.label,language)+'</h3>'+q.options.map(o=>button(o.label,{type:'judge',itemId:q.id,choice:o.id},n.answers[q.id]===o.id)).join('')+'</section>').join('')+button({zh:'检查解释',en:'Check explanation'},{type:'check'});
}
function cleanerView(d,s,language,ui){
 const c=d.config,n=s.data,l=ui.local||{},button=(label,a,selected)=>act(label,a,language,selected);
 return '<div id="cgLedgerScroll" class="cg-ledger-scroll" tabindex="0" role="region" aria-label="'+escape(plain({zh:'原始记录对照账页，可横向滚动',en:'Source-record ledger; scroll horizontally if needed'},language))+'"><table class="cg-ledger"><caption>'+copy('逐行对照原始记录与来源，再作处理决定。','Compare original records and provenance row by row before deciding.',language)+'</caption><thead><tr>'+c.columns.map(label=>'<th scope="col">'+text(label,language)+'</th>').join('')+'<th scope="col">'+copy('你的处理决定','Your decision',language)+'</th></tr></thead><tbody>'+c.rows.map(r=>'<tr><th scope="row">'+escape(r.orderId)+'</th><td class="cg-ledger-quantity">'+(r.quantity===null?copy('未知','Unknown',language):escape(r.quantity))+'</td><td class="cg-ledger-source">'+text(r.source,language)+'</td><td class="cg-ledger-decision"><div class="cg-options">'+c.options.map(o=>button(o.label,{type:'mark',rowId:r.id,choice:o.id},n.answers[r.id]===o.id)).join('')+'</div></td></tr>').join('')+'</tbody></table></div><section class="cg-operation"><label>'+text(c.subtotalLabel,language)+'<input type="number" data-cg-local="subtotal" value="'+escape(l.subtotal??n.answers.subtotal??'')+'"></label><button type="button" id="cgSubtotal">'+copy('记录小计','Record subtotal',language)+'</button></section>'+(c.conclusion?'<section class="cg-operation"><h3>'+text(c.conclusion.label,language)+'</h3>'+c.conclusion.options.map(o=>button(o.label,{type:'conclude',choice:o.id},n.answers.conclusion===o.id)).join('')+'</section>':'')+button({zh:'核验资料',en:'Verify records'},{type:'check'});
}
function extendedView(d,s,language,ui){
 const c=d.config,n=s.data,l=ui.local||{},button=(label,a,selected)=>act(label,a,language,selected);
 if(d.kind==='evidence-board')return '<div class="cg-evidence">'+c.evidence.map((e,i)=>'<section><h3>'+copy('证据 '+(i+1),'Evidence '+(i+1),language)+'</h3>'+button({zh:'打开证据 '+(i+1),en:'Inspect evidence '+(i+1)},{type:'inspect',evidenceId:e.id},n.opened.includes(e.id))+(n.opened.includes(e.id)?'<p>'+text(e.text,language)+'</p>':'')+'</section>').join('')+'</div>'+c.claims.map(q=>'<section class="cg-operation"><h3>'+text(q.text,language)+'</h3><p>'+copy('选择支撑记录，再作判断。','Select supporting records, then make a judgment.',language)+'</p>'+c.evidence.map((e,i)=>'<button type="button" data-cg-evidence="'+escape(q.id)+'" data-cg-evidence-id="'+escape(e.id)+'" aria-pressed="'+(l[q.id]||n.selectedEvidence[q.id]||[]).includes(e.id)+'">'+copy('证据 '+(i+1),'Evidence '+(i+1),language)+'</button>').join('')+evidenceReferences(c,n,q,l,language)+c.verdictOptions.map(o=>button(o.text,{type:'judge',claimId:q.id,decision:o.id,evidenceIds:l[q.id]||n.selectedEvidence[q.id]||[]},n.judgments[q.id]===o.id)).join('')+'</section>').join('');
 if(d.kind==='sample-trainer')return samplePlot(d,s,language)+'<p>'+text(c.fitRule,language)+'</p><div class="cg-machine">'+c.samples.map((v,i)=>'<section class="cg-machine-port">'+copy('输入','Input',language)+' '+escape(v.x)+' → '+(v.y===null?copy('无目标','No target',language):escape(v.y))+button({zh:'选取样本 '+(i+1),en:'Select sample '+(i+1)},{type:'select',sampleId:v.id},n.selected.includes(v.id))+'</section>').join('')+'</div>'+button(c.actions.fit,{type:'fit'})+'<p>'+copy('当前 k','Current k',language)+': '+escape(n.k??'—')+' · '+copy('保留输入','Held-out input',language)+' '+escape(c.holdout.x)+'</p>'+c.predictionOptions.map(v=>button(String(v),{type:'predict',value:v},n.prediction===v)).join('')+button(c.actions.test,{type:'test'});
 if(d.kind==='cluster-builder')return clusterView(d,s,language,ui);
 if(d.kind==='reward-path')return '<div class="cg-machine">'+c.paths.map(p=>'<section class="cg-machine-port"><h3>'+text(p.label,language)+'</h3>'+button(c.actions.advance,{type:'advance',pathId:p.id})+'<p>'+copy('已观察的逐步奖励','Observed step rewards',language)+': '+(n.visits[p.id]||[]).map(escape).join(' → ')+'</p><label>'+copy('累计回报','Cumulative return',language)+'<input type="number" data-cg-local="'+escape(p.id)+'" value="'+escape(l[p.id]??'')+'"></label>'+button(c.actions.policy,{type:'policy',pathId:p.id},n.policy===p.id)+'</section>').join('')+'</div><button type="button" id="cgCompare">'+text(c.actions.compare,language)+'</button>';

 if(d.kind==='model-flow')return modelFlowView(d,s,language,ui);
 if(d.kind==='inventory-sim')return '<p>'+copy('模型预测','Model forecast',language)+': '+escape(c.forecast)+'</p><label>'+text(c.stockLabel,language)+'<input type="number" data-cg-local="stock" min="0" max="'+escape(c.maxStock)+'" value="'+escape(l.stock??n.stock??'')+'" '+(n.revealed?'disabled':'')+'></label><button type="button" id="cgStock" '+(n.revealed?'disabled':'')+'>'+copy('确认备货','Commit stock',language)+'</button>'+button(c.revealLabel,{type:'reveal'})+'<p>'+copy('已备货','Committed stock',language)+': '+escape(n.stock??'—')+(n.revealed?' · '+copy('实际需求','Actual demand',language)+': '+escape(c.actual):'')+'</p>'+(n.revealed?c.answerFields.map(f=>'<section class="cg-operation"><h3>'+text(f.label,language)+'</h3>'+(f.options?f.options.map(o=>button(o.label,{type:'answer',itemId:f.id,value:o.id},n.answers[f.id]===o.id)).join(''):'<input type="number" data-cg-local="'+escape(f.id)+'" value="'+escape(l[f.id]??n.answers[f.id]??'')+'"><button type="button" data-cg-number="'+escape(f.id)+'">'+copy('记录核算','Record calculation',language)+'</button>')+'</section>').join('')+button({zh:'核对后果',en:'Check consequences'},{type:'check'}):'');
 if(d.kind==='data-cleaner')return cleanerView(d,s,language,ui);
 if(d.kind==='text-extractor')return c.passages.map((p,i)=>'<section class="cg-operation"><h3>'+copy('片段 '+(i+1),'Passage '+(i+1),language)+'</h3><p>'+text(p.text,language)+'</p></section>').join('')+c.fields.map(f=>{const answer=l[f.id]||n.answers[f.id]||{};return '<section class="cg-operation"><h3>'+text(f.label,language)+'</h3>'+f.options.map(o=>'<button type="button" data-cg-extract-field="'+escape(f.id)+'" data-cg-extract-key="value" data-cg-extract-value="'+escape(o.id)+'" aria-pressed="'+(answer.value===o.id)+'">'+text(o.label,language)+'</button>').join('')+'<p>'+copy('依据','Evidence',language)+'</p>'+c.evidenceOptions.map(o=>'<button type="button" data-cg-extract-field="'+escape(f.id)+'" data-cg-extract-key="evidenceId" data-cg-extract-value="'+escape(o.id)+'" aria-pressed="'+(answer.evidenceId===o.id)+'">'+text(o.label,language)+'</button>').join('')+'<button type="button" data-cg-extract-submit="'+escape(f.id)+'">'+copy('提交本字段','Submit field',language)+'</button></section>';}).join('')+button({zh:'核对原文',en:'Check against text'},{type:'check'});
 if(d.kind==='image-inspector')return '<svg class="cg-inspection-image" viewBox="0 0 '+escape(c.image.width)+' '+escape(c.image.height)+'" role="group" aria-label="'+escape(plain({zh:'横向轮廓图。坐标原点在左上角；M表示移动到坐标，L表示直线到坐标。请比较线段与各区域的坐标范围。',en:'Contour diagram. The origin is at the top left; M moves to a coordinate and L draws a line to a coordinate. Compare the segments with each region’s coordinate bounds.'},language)+' '+c.image.paths.map(p=>p.d).join('; ')+' '+c.regions.map(r=>plain(r.label,language)+': x='+r.x+'…'+(r.x+r.width)+', y='+r.y+'…'+(r.y+r.height)).join('; '))+'"><rect width="100%" height="100%" fill="'+escape(c.image.background)+'"/>'+c.image.paths.map(p=>'<path d="'+escape(p.d)+'" fill="none" stroke="'+escape(p.stroke)+'" stroke-width="'+escape(p.strokeWidth)+'"/>').join('')+c.regions.map(r=>'<rect data-cg-region="'+escape(r.id)+'" role="button" tabindex="'+(ui.inert?'-1':'0')+'" aria-disabled="'+(ui.inert===true)+'" aria-label="'+escape(plain(r.label,language)+': x='+r.x+'…'+(r.x+r.width)+', y='+r.y+'…'+(r.y+r.height))+'" aria-pressed="'+(n.answers.region===r.id)+'" x="'+escape(r.x)+'" y="'+escape(r.y)+'" width="'+escape(r.width)+'" height="'+escape(r.height)+'" fill="transparent" stroke="'+(n.answers.region===r.id?'#345f49':'#879870')+'" stroke-width="'+(n.answers.region===r.id?'3':'1')+'"/>').join('')+'</svg><div class="cg-options">'+c.regions.map(r=>button(r.label,{type:'inspect',regionId:r.id},n.answers.region===r.id)).join('')+'</div>'+c.conclusions.map(o=>button(o.label,{type:'conclude',choice:o.id},n.answers.conclusion===o.id)).join('')+button({zh:'检查图像证据',en:'Check image evidence'},{type:'check'});
 return '';
}
function rewardProcess(d,s,language,motion){
 const visits=s.data.visits;
 return '<section class="cg-process cg-reward-process" data-cg-process="reward"><h3>'+copy('已经走过的路线','Paths already explored',language)+'</h3><p>'+copy('只记录亲自走过的步骤；累计与下一轮路线由你判断。','Only steps you have taken appear here. Calculate returns and choose the next route yourself.',language)+'</p>'+d.config.paths.map(p=>{const seen=visits[p.id]||[];return '<section class="cg-reward-lane"><h4>'+text(p.label,language)+'</h4>'+(seen.length?'<ol class="cg-reward-trail">'+seen.map((value,i)=>'<li class="cg-reward-step '+(motion?.pathId===p.id&&i===seen.length-1?'cg-reward-new':'')+'"><span class="cg-reward-marker" aria-hidden="true">'+(i+1)+'</span><span>'+copy('第 '+(i+1)+' 步已观察奖励','Observed reward at step '+(i+1),language)+'</span><strong>'+escape(value)+'</strong></li>').join('')+'</ol>':'<p class="cg-reward-unknown">'+copy('尚未探索：奖励未知。','Not explored: rewards are unknown.',language)+'</p>')+'</section>';}).join('')+'</section>';
}
function inventoryProcess(d,s,language,motion){
 const n=s.data,c=d.config;
 if(n.stock===null)return '<section class="cg-process cg-process-empty"><p>'+copy('先决定并提交备货量，再揭示需求进行对照。','Commit a stock quantity before revealing demand for comparison.',language)+'</p></section>';
 if(!n.revealed)return '<section class="cg-process cg-inventory-wait"><p>'+copy('备货已锁定为','Stock is committed at',language)+' <strong>'+escape(n.stock)+'</strong> · '+copy('需求尚未揭示。','Demand has not been revealed.',language)+'</p></section>';
 const scale=Math.max(1,Math.ceil(Math.max(n.stock,c.actual)/12)),slots=Math.ceil(Math.max(n.stock,c.actual)/scale);
 const row=(count,other,kind)=>'<div class="cg-stock-row" data-cg-stock-row="'+kind+'">'+Array.from({length:slots},(_,i)=>{const amount=Math.max(0,Math.min(scale,count-i*scale)),paired=Math.max(0,Math.min(amount,other-i*scale));return '<span class="cg-cargo-slot '+(amount?'cg-cargo-present':'cg-cargo-empty')+' '+(amount>paired?'cg-cargo-unpaired':'')+'" style="--cg-cargo-index:'+i+'"><i aria-hidden="true"></i><span>'+escape(amount)+'</span></span>';}).join('')+'</div>';
 return '<section class="cg-process cg-inventory-process '+(motion?'cg-inventory-motion':'')+'" data-cg-process="inventory"><h3>'+copy('已揭示：把备货与需求排在同一刻度','Revealed: align stock and demand on the same scale',language)+'</h3><p>'+copy('同列方格对应同一段数量；比较没有配对的部分，再完成下方核算。','Cells in the same column cover the same quantity interval. Compare unmatched parts, then complete the calculations below.',language)+'</p><p>'+copy('每格最多','Each cell holds up to',language)+' '+escape(scale)+' · '+copy('格内数字为该格数量，空格为0。','Cell numbers give their quantity; empty cells are zero.',language)+'</p><strong>'+copy('已提交备货','Committed stock',language)+' '+escape(n.stock)+'</strong>'+row(n.stock,c.actual,'stock')+'<strong>'+copy('引擎已揭示需求','Demand revealed by the engine',language)+' '+escape(c.actual)+'</strong>'+row(c.actual,n.stock,'demand')+'<p>'+copy('金色边框标出需要比较的未配对部分；缺货与多备的数值仍由你核算。','Gold borders mark unmatched portions to compare; calculate shortage and excess yourself.',language)+'</p></section>';
}
// This observation strip only depicts engine-produced records. Animation is ephemeral UI state.
function processView(d,s,language,motion){
 if(d.kind==='inventory-sim')return inventoryProcess(d,s,language,motion);
 if(d.kind==='reward-path')return rewardProcess(d,s,language,motion);
 const rows=d.kind==='rule-runner'?s.data.runs:d.kind==='parameter-lab'?s.data.operations:null;
 if(!rows)return '';const last=rows[rows.length-1];
 if(!last)return '<section class="cg-process cg-process-empty"><p>'+copy('操作后，实际输入、处理与输出会在这里连接起来。','After an operation, the observed input, processing and output will connect here.',language)+'</p></section>';
 const isRule=d.kind==='rule-runner',changed=!isRule&&last.before!==last.after;
 const middle=isRule?escape(last.ruleVersion):'<span class="cg-parameter-before">'+escape(last.before)+'</span><span aria-hidden="true"> → </span><span class="cg-parameter-after">'+escape(last.after)+'</span>';
 const output=isRule?optionText(d.config.outputs,last.output,language):escape(last.output);
 const note=isRule?copy('此轨迹来自最近一次实际运行；重复运行仍使用记录中的规则版本。','This trace is the latest actual run; repeated runs use the recorded rule version.',language):changed?copy('这次操作的记录显示参数改变；对照输入与输出，再判断发生了什么。','This operation records a parameter change. Compare input and output, then interpret what happened.',language):copy('这次操作的记录显示参数保持不变；输出已经产生。','This operation records unchanged parameters and a produced output.',language);
 return '<section class="cg-process '+(motion?'cg-process-motion ':'')+(changed?'cg-process-changed':'cg-process-fixed')+'" data-cg-process="'+(isRule?'rule':'parameter')+'"><h3>'+copy('最近一次实际过程','Latest observed process',language)+'</h3><div class="cg-process-lane"><section><span>'+copy('记录中的输入','Recorded input',language)+'</span><strong>'+escape(last.input)+'</strong></section><span class="cg-process-link" aria-hidden="true"><i></i>→</span><section><span>'+copy(isRule?'规则版本':'参数前后',isRule?'Rule version':'Parameter before and after',language)+'</span><strong>'+middle+'</strong></section><span class="cg-process-link cg-process-link-out" aria-hidden="true"><i></i>→</span><section><span>'+copy('已观察到的输出','Observed output',language)+'</span><strong>'+output+'</strong></section></div><p>'+note+'</p></section>';
}
function render(d,s,options={}){
 const language=mode(options.language),ui=options.ui||{},busy=options.busy===true||options.exiting===true;
 const reading=s.phase==='teaching'||ui.reading===true;
 const teaching=reading?`<section class="cg-teaching"><h3>${text(d.teaching.title,language)}</h3><p>${text(d.teaching.explanation,language)}</p><p>${text(d.teaching.example,language)}</p><p>${text(d.boundary,language)}</p></section>`:'';
 const passed=s.phase==='passed'&&s.passed===true;
 const play=s.phase==='teaching'?'':`<section class="cg-workbench"><fieldset ${passed||busy?'disabled':''}>${processView(d,s,language,options.motion)}${d.kind==='rule-runner'?ruleView(d,s,language,ui.inputRaw??s.data.input):d.kind==='parameter-lab'?parameterView(d,s,language,ui.inputRaw??s.data.input):extendedView(d,s,language,{...ui,inert:busy||passed,motion:options.motion})}</fieldset></section>`;
 const errors={save:['草稿暂未保存，当前操作仍保留。请重试保存后再返回。','The draft has not been saved. Your work is retained. Retry saving before returning.'],input:['请输入本题范围内的整数；原操作记录保留。','Enter an integer within the exercise range. Earlier operations are retained.'],action:['这次操作未被引擎接受；当前进度保留。','The engine did not accept this action. Your progress is retained.'],handoff:['尚未返回物件，当前小游戏进度保留，请重试。','The return to the object did not finish. Your game progress is retained; retry.']};
 const error=errors[options.error];
 return `<section id="conceptGameRoot" class="concept-game" data-locale-fixed="true"><span class="eyebrow">${copy('物件内概念实验','Concept experiment inside the object',language)}</span><h2 id="dialogTitle">${text(d.title,language)}</h2><div class="cg-intro"><p class="cg-goal">${text(d.goal,language)}</p><p>${text(d.instructions,language)}</p></div><div class="cg-progress"><span class="${s.phase==='teaching'?'cg-current':''}">${copy('先理解','Understand',language)}</span><span class="${s.phase==='playing'?'cg-current':''}">${copy('亲自操作与观察','Operate and observe',language)}</span><span class="${passed?'cg-current':''}">${copy('通过后回到物件','Return after passing',language)}</span></div>${teaching}${play}${s.feedback?.length?feedback(s.feedback,language):''}${passed?`<p class="cg-success" role="status">${copy('概念实验已通过。返回后可尝试收藏；尚未自动收藏，也不代表本节应用或整章正式测验通过。','The concept experiment is complete. Return to try collecting; this has not collected the object or passed section applications or the formal chapter assessment.',language)}</p>`:''}${error?`<p class="cg-error" role="status">${copy(...error,language)}</p>`:''}<div class="cg-actions"><button type="button" id="cgBack" ${busy?'disabled':''}>${copy('保留进度，返回物件','Keep progress and return',language)}</button>${s.phase==='teaching'?`<button type="button" id="cgStart" class="primary" ${busy?'disabled':''}>${copy('开始亲自操作','Start operating',language)}</button>`:`<button type="button" id="cgRead" ${busy?'disabled':''}>${copy(reading?'收起概念说明':'回看概念说明',reading?'Hide concept explanation':'Review concept explanation',language)}</button>`}${options.error==='save'?`<button type="button" id="cgRetrySave">${copy('重试保存','Retry saving',language)}</button>`:''}${passed?`<button type="button" id="cgFinish" class="primary" ${busy||options.saved!==true?'disabled':''}>${copy('返回物件，尝试收藏','Return to the object to try collecting',language)}</button>`:''}</div></section>`;
}
// Gesture isolation, not authentication: gameplay authority stays with host replay.
const dragInstance=typeof globalThis.crypto?.randomUUID==='function'?globalThis.crypto.randomUUID():String(Date.now())+'-'+Math.random().toString(36).slice(2)+'-'+Math.random().toString(36).slice(2);
let active=null,dragSequence=0;
function open(knowledgeContext,handlers={}){
 if(active)active.dispose();
 const dragSession=dragInstance+':'+(++dragSequence),dragType='application/x-knowledge-town-concept-point';
 const ctx=knowledgeContext||{},engine=ctx.engine,doc=ctx.document||globalThis.document;
 if(!doc)throw Error('ConceptGamesUI requires a document');
 const body=ctx.body||handlers.getRoot?.()||doc.getElementById('dialogBody'),dialog=ctx.dialog||doc.getElementById('dialog');
 if(!body)throw Error('ConceptGamesUI requires a dialog body');
 const show=ctx.show||handlers.render||globalThis.modal,hide=ctx.close||globalThis.close;
 let d,c,engineState=null,fatal=false,disposed=false,busy=false,exiting=false,error=null,queue=Promise.resolve(),revision=0,savedRevision=-1,savedDraft=null,delivering=false,rawQueued=false,motion=null;
 let language=mode(ctx.language),ui={reading:false,inputRaw:'',local:{}};
 const own=()=>active===controller&&!disposed&&!!doc.getElementById('conceptGameRoot');
 const current=()=>active===controller&&!disposed&&(typeof handlers.isCurrent!=='function'||handlers.isCurrent()===true);
 const payload=()=>({serialized:engine.serialize(engineState),ui:{reading:ui.reading===true,inputRaw:String(ui.inputRaw).slice(0,50),local:clone(ui.local)}});
 const notifyError=cause=>{try{handlers.onError?.(cause);}catch{}};
 function locate(id){return doc.getElementById(id);}
 function paint(first=false){
  if(disposed||active!==controller||!first&&(!own()||!current()))return;
  const focus=doc.activeElement,id=focus?.id,selection=[focus?.selectionStart,focus?.selectionEnd],bodyTop=body.scrollTop||0,dialogTop=dialog?.scrollTop||0,ledger=!first&&own()?locate('cgLedgerScroll'):null,ledgerLeft=ledger?.scrollLeft||0;
  const html=fatal?`<section id="conceptGameRoot" class="concept-game" data-locale-fixed="true"><h2 id="dialogTitle">${copy('小游戏暂不可用','Concept game unavailable',language)}</h2><p class="cg-error">${copy('当前知识、游戏或保存进度无法核验。原记录保留，请返回检查。','The knowledge, game or saved progress could not be verified. Keep the original record and return.',language)}</p><button type="button" id="cgBack">${copy('返回物件','Return to the object',language)}</button></section>`:render(d,engineState,{language,ui,busy,exiting,error,saved:savedRevision===revision,motion});
  motion=null;
  if(first&&typeof show==='function')show(html,true);else body.innerHTML=html;
  bind();body.scrollTop=bodyTop;if(dialog)dialog.scrollTop=dialogTop;if(d?.kind==='data-cleaner'&&ledger&&locate('cgLedgerScroll'))locate('cgLedgerScroll').scrollLeft=ledgerLeft;
  if(id&&locate(id)){locate(id).focus?.({preventScroll:true});if(typeof locate(id).setSelectionRange==='function'&&selection.every(Number.isInteger))try{locate(id).setSelectionRange(...selection);}catch{}}
 }
 async function persist(){
  if(!current())return false;
  const draft=payload(),at=revision;
  try{const accepted=await handlers.onDraft?.(clone(draft));if(accepted===false)throw Error('Draft rejected');if(!current())return false;savedRevision=at;savedDraft=clone(draft);return true;}catch(cause){if(current()){error='save';notifyError(cause);}return false;}
 }
 function schedule(work,visible=true){
  queue=queue.then(async()=>{if(!current())return false;if(visible){busy=true;paint();}try{return await work();}catch(cause){if(current()){error='action';notifyError(cause);}return false;}finally{busy=false;if(current()&&visible)paint();}});
  return queue;
 }
 function inputValue(raw){if(typeof raw!=='string'||!raw.trim())throw Error('Empty input');const value=Number(raw);if(!Number.isInteger(value)||value<d.config.minInput||value>d.config.maxInput)throw Error('Invalid input');return value;}
 function setInput(raw){const value=inputValue(raw);if(value!==engineState.data.input){engineState=engine.dispatch(d,c,engineState,{type:'setInput',value});revision++;}}
 function action(a,flush=false){if(exiting||busy)return Promise.resolve(false);const raw=String(ui.inputRaw);return schedule(async()=>{if(engineState.phase==='passed')return false;error=null;try{if(flush)setInput(raw);const before=engineState;engineState=engine.dispatch(d,c,engineState,a);if(d.kind==='rule-runner'&&engineState.data.runs.length>before.data.runs.length||d.kind==='parameter-lab'&&engineState.data.operations.length>before.data.operations.length||d.kind==='inventory-sim'&&!before.data.revealed&&engineState.data.revealed)motion=true;if(d.kind==='reward-path'&&a.type==='advance'&&(engineState.data.visits[a.pathId]||[]).length>(before.data.visits[a.pathId]||[]).length)motion={pathId:a.pathId};if(d.kind==='model-flow'&&a.type==='execute'&&engineState.data.runs.length>before.data.runs.length)motion={inputId:a.inputId};revision++;}catch(cause){error=flush&&(!raw.trim()||!Number.isInteger(Number(raw))||Number(raw)<d.config.minInput||Number(raw)>d.config.maxInput)?'input':'action';notifyError(cause);await persist();return false;}await persist();return true;});}
 function saveRaw(){
  if(rawQueued)return;rawQueued=true;
  schedule(async()=>{const at=revision;await persist();rawQueued=false;if(at!==revision&&current())saveRaw();if(error&&own())paint();},false);
 }
 async function exit(complete=false,alreadyClosed=false){
  if(!current()){const closeOwn=own();controller.dispose();if(closeOwn&&typeof hide==='function')hide();return false;}
  if(fatal){const closeOwn=own();controller.dispose();if(closeOwn&&!alreadyClosed&&typeof hide==='function')hide();try{await handlers.onBack?.(ctx.draft??null);return true;}catch(cause){notifyError(cause);return false;}}
  if(exiting)return queue;
  exiting=true;paint();
  return schedule(async()=>{
   try{
   if(delivering)return false;
   if(complete){const checked=engine.restore(d,c,engine.serialize(engineState));if(checked.phase!=='passed'||checked.passed!==true)return false;}
   if(!await persist()||savedRevision!==revision){
    error='save';exiting=false;
    if(alreadyClosed&&current()&&own()){paint(true);doc.body?.classList?.add('dialog-open');locate('cgRetrySave')?.focus?.();}
    return false;
   }
   delivering=true;
   try{
    const result=await (complete?handlers.onComplete:handlers.onBack)?.(clone(savedDraft));
    if(result===false)throw Error('Return declined');
    const closeOwn=own();controller.dispose();if(closeOwn&&!alreadyClosed&&typeof hide==='function')hide();return true;
   }catch(cause){delivering=false;if(current()){error='handoff';notifyError(cause);}return false;}
   }finally{exiting=false;}
  });
 }
 function bind(){
  locate('cgBack').onclick=()=>exit();if(fatal)return;
  if(locate('cgStart'))locate('cgStart').onclick=()=>action({type:'acknowledge'});
  if(locate('cgRead'))locate('cgRead').onclick=()=>{if(exiting||busy)return;return schedule(async()=>{ui.reading=!ui.reading;revision++;await persist();});};
  if(locate('cgRetrySave'))locate('cgRetrySave').onclick=()=>schedule(async()=>{error=null;return persist();});
  if(locate('cgFinish'))locate('cgFinish').onclick=()=>exit(true);
  const input=locate('cgInput');
  if(input){input.oninput=()=>{if(exiting||busy||engineState.phase==='passed')return;ui.inputRaw=String(input.value).slice(0,50);revision++;saveRaw();};input.onchange=()=>{if(exiting||busy||engineState.phase==='passed')return;const raw=String(input.value);ui.inputRaw=raw;return schedule(async()=>{if(engineState.phase==='passed')return false;error=null;try{setInput(raw);}catch(cause){error='input';notifyError(cause);}await persist();});};}
  const all=q=>[...body.querySelectorAll(q)];
  // Stable semantic IDs survive repaint, locale changes and evolving evidence lists.
  const stable=(selector,key)=>all(selector).forEach(el=>{if(!el.id)el.id='cgControl-'+encodeURIComponent(key(el));});
  stable('[data-cg-action]',el=>{const a=JSON.parse(el.dataset.cgAction);delete a.evidenceIds;return 'action:'+JSON.stringify(a);});
  stable('[data-cg-evidence]',el=>'evidence:'+JSON.stringify([el.dataset.cgEvidence,el.dataset.cgEvidenceId]));
  stable('[data-cg-local]',el=>'local:'+el.dataset.cgLocal);
  stable('[data-cg-number]',el=>'number:'+el.dataset.cgNumber);
  stable('[data-cg-extract-field]',el=>'extract:'+JSON.stringify([el.dataset.cgExtractField,el.dataset.cgExtractKey,el.dataset.cgExtractValue]));
  stable('[data-cg-extract-submit]',el=>'extract-submit:'+el.dataset.cgExtractSubmit);
  stable('[data-cg-region]',el=>'region:'+el.dataset.cgRegion);
  all('[data-cg-region]').forEach(el=>{el.onclick=()=>action({type:'inspect',regionId:el.dataset.cgRegion});el.onkeydown=event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault?.();return el.onclick();}};});
  stable('[data-cg-point]',el=>'point:'+el.dataset.cgPoint);
  stable('[data-cg-place-selected]',el=>'place-selected:'+el.dataset.cgPlaceSelected);
  const editable=()=>current()&&own()&&!busy&&!exiting&&!fatal&&engineState.phase==='playing';
  all('[data-cg-point]').forEach(el=>{
   el.onclick=()=>{if(!editable())return;return schedule(async()=>{ui.local.point=el.dataset.cgPoint;revision++;await persist();});};
   el.ondragstart=event=>{if(!editable()||!event.dataTransfer){event.preventDefault?.();return;}event.dataTransfer.setData(dragType,JSON.stringify({session:dragSession,pointId:el.dataset.cgPoint}));event.dataTransfer.effectAllowed='move';};
  });
  all('[data-cg-place-selected]').forEach(el=>el.onclick=()=>{if(!editable()||!d.config.points.some(p=>p.id===ui.local.point))return;return action({type:'place',pointId:ui.local.point,groupId:el.dataset.cgPlaceSelected});});
  all('[data-cg-drop-group]').forEach(el=>{
   el.ondragover=event=>{if(editable()&&Array.from(event.dataTransfer?.types||[]).includes(dragType)){event.preventDefault?.();event.dataTransfer.dropEffect='move';}};
   el.ondrop=event=>{if(!editable())return;let value;try{value=JSON.parse(event.dataTransfer?.getData(dragType)||'');}catch{return;}if(value.session!==dragSession||!d.config.points.some(p=>p.id===value.pointId)||!d.config.groups.some(g=>g.id===el.dataset.cgDropGroup))return;event.preventDefault?.();return action({type:'place',pointId:value.pointId,groupId:el.dataset.cgDropGroup});};
  });
  all('[data-cg-action]').forEach(el=>el.onclick=()=>action(JSON.parse(el.dataset.cgAction)));
  all('[data-cg-evidence]').forEach(el=>el.onclick=()=>{if(exiting||busy||engineState.phase==='passed')return;const claim=el.dataset.cgEvidence,id=el.dataset.cgEvidenceId;return schedule(async()=>{const values=[...(ui.local[claim]||engineState.data.selectedEvidence[claim]||[])];ui.local[claim]=values.includes(id)?values.filter(v=>v!==id):[...values,id];revision++;await persist();});});
  all('[data-cg-local]').forEach(el=>el.oninput=()=>{if(exiting||busy||engineState.phase==='passed')return;ui.local[el.dataset.cgLocal]=String(el.value).slice(0,50);revision++;saveRaw();});
  if(locate('cgCompare'))locate('cgCompare').onclick=()=>action({type:'compare',totals:Object.fromEntries(d.config.paths.map(p=>[p.id,ui.local[p.id]!==undefined&&String(ui.local[p.id]).trim()!==''?Number(ui.local[p.id]):null]))});
  const numeric=key=>{const raw=ui.local[key];return typeof raw==='string'&&raw.trim()!==''&&Number.isFinite(Number(raw))?Number(raw):null;};
  if(locate('cgStock'))locate('cgStock').onclick=()=>action({type:'stock',value:numeric('stock')});
  if(locate('cgSubtotal'))locate('cgSubtotal').onclick=()=>action({type:'subtotal',value:numeric('subtotal')});
  all('[data-cg-number]').forEach(el=>el.onclick=()=>action({type:'answer',itemId:el.dataset.cgNumber,value:numeric(el.dataset.cgNumber)}));
  all('[data-cg-extract-field]').forEach(el=>el.onclick=()=>{if(exiting||busy||engineState.phase==='passed')return;return schedule(async()=>{const id=el.dataset.cgExtractField;ui.local[id]={...(ui.local[id]||engineState.data.answers[id]||{}),[el.dataset.cgExtractKey]:el.dataset.cgExtractValue};revision++;await persist();});});
  all('[data-cg-extract-submit]').forEach(el=>el.onclick=()=>{const id=el.dataset.cgExtractSubmit,v=ui.local[id]||engineState.data.answers[id]||{};return action({type:'extract',fieldId:id,value:v.value??null,evidenceId:v.evidenceId??null});});
  all('[data-cg-predict]').forEach(el=>el.onclick=()=>{const o=d.config.outputs[+el.dataset.cgPredict];if(o)action({type:'predict',decision:o.id},true);});
  all('[data-cg-conclude]').forEach(el=>el.onclick=()=>{const o=d.config.conclusions[+el.dataset.cgConclude];if(o)action({type:'conclude',decision:o.id});});
  all('[data-cg-event]').forEach(el=>el.onclick=()=>{const op=engineState.data.operations[+el.dataset.cgEvent],o=d.config.judgmentOptions[+el.dataset.cgDecision];if(op&&o)action({type:'classify',eventId:op.id,decision:o.id});});
  if(locate('cgRun'))locate('cgRun').onclick=()=>action({type:'run'},true);
  if(locate('cgInfer'))locate('cgInfer').onclick=()=>action({type:'infer'},true);
  if(locate('cgTrain'))locate('cgTrain').onclick=()=>action({type:'train'});
  if(locate('cgResetModel'))locate('cgResetModel').onclick=()=>action({type:'resetModel'});
 }
 function closeRequest(event){if(!own())return;event.preventDefault?.();event.stopImmediatePropagation?.();doc.body?.classList?.add('dialog-open');exit();}
 function nativeClosed(){if(own())exit(false,true);}
 const closeButton=doc.getElementById('close');
 const controller={
  getDraft:()=>engineState?clone(payload()):ctx.draft??null,
  whenIdle:async()=>{let last;do{last=queue;await last;}while(last!==queue);},
  setLanguage:value=>{if(!current())return;const next=mode(value);if(next===language)return;language=next;if(own())paint();},
  back:()=>exit(),
  dispose:()=>{if(disposed)return;disposed=true;dialog?.removeEventListener?.('cancel',closeRequest);dialog?.removeEventListener?.('close',nativeClosed);closeButton?.removeEventListener?.('click',closeRequest,true);if(active===controller)active=null;}
 };
 active=controller;
 try{
  if(!supported(ctx.descriptor)||!engine||!['fresh','dispatch','restore','serialize'].every(key=>typeof engine[key]==='function'))throw Error('Unsupported concept-game context');
  d=clone(ctx.descriptor);c=clone(ctx.context);
  const restored=ctx.draft?.serialized??ctx.draft;
  engineState=restored==null?engine.fresh(d,c):engine.restore(d,c,restored);
  if(restored!=null)savedRevision=0;
  ui={reading:ctx.draft?.ui?.reading===true,inputRaw:typeof ctx.draft?.ui?.inputRaw==='string'?ctx.draft.ui.inputRaw.slice(0,50):String(engineState.data.input??''),local:{}};
  const local=ctx.draft?.ui?.local;if(local&&typeof local==='object'&&!Array.isArray(local)){if(d.kind==='cluster-builder'&&d.config.points.some(p=>p.id===local.point))ui.local.point=local.point;if(d.kind==='evidence-board')for(const q of d.config.claims){if(Array.isArray(local[q.id]))ui.local[q.id]=[...new Set(local[q.id].filter(id=>d.config.evidence.some(e=>e.id===id)))].slice(0,d.config.evidence.length);}if(d.kind==='reward-path')for(const p of d.config.paths)if(typeof local[p.id]==='string')ui.local[p.id]=local[p.id].slice(0,50);if(['inventory-sim','data-cleaner'].includes(d.kind))for(const key of ['stock','shortage','excess','subtotal'])if(typeof local[key]==='string')ui.local[key]=local[key].slice(0,50);if(d.kind==='text-extractor')for(const f of d.config.fields){const v=local[f.id];if(v&&typeof v==='object'){ui.local[f.id]={};if(f.options.some(o=>o.id===v.value))ui.local[f.id].value=v.value;if(d.config.evidenceOptions.some(o=>o.id===v.evidenceId))ui.local[f.id].evidenceId=v.evidenceId;}}}
 }catch(cause){fatal=true;notifyError(cause);}
 paint(true);dialog?.addEventListener('cancel',closeRequest);dialog?.addEventListener('close',nativeClosed);closeButton?.addEventListener('click',closeRequest,true);
 return Object.freeze(controller);
}
function setLanguage(value){active?.setLanguage(value);}
// Integrate the existing language picker without owning the host's language or save state.
if(typeof globalThis.changeTownLanguage==='function'){
 const prior=globalThis.changeTownLanguage;
 globalThis.changeTownLanguage=function(...args){const result=prior(...args);if(active)setLanguage(typeof state!=='undefined'?state.language:args[0]);return result;};
}
return Object.freeze({version:1,open,setLanguage,render,controls,feedback,text});
});
