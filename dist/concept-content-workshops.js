(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.ConceptContentWorkshops=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const kinds=['model-flow','inventory-sim','data-cleaner','text-extractor','image-inspector'];
  const copy=x=>JSON.parse(JSON.stringify(x));
  const msg=(zh,en)=>({zh,en});
  function init(d){if(!kinds.includes(d.kind))throw Error('Unknown workshop');return {answers:{},runs:[],stock:null,revealed:false};}
  function step(d,input,a){
    const data=copy(input), c=d.config, feedback=[];
    const tell=(id,correct,good,bad)=>feedback.push({itemId:id,correct,message:correct?good:bad,knowledgeIds:[d.sourceUnitId]});
    if(!a||typeof a.type!=='string')return {data,feedback,passed:false};
    if(d.kind==='model-flow'){
      if(a.type==='feed')data.feed=a.choice;
      if(a.type==='execute'){
        const row=c.inputs.find(x=>x.id===a.inputId);
        if(row&&data.feed===c.observationId){data.runs.push({inputId:row.id,input:row.value,output:row.value*c.multiplier});tell(row.id,true,msg('固定映射已执行；参数未改变。','The fixed mapping ran; parameters did not change.'),null);}
        else tell('feed',false,null,msg('先选择来自记录的真实观测，再运行；愿望或模型估计不能冒充观测。','Select recorded observations first; wishes and estimates are not observations.'));
      }
      if(a.type==='judge')data.answers[a.itemId]=a.choice;
      if(a.type==='check')for(const q of c.judgments)tell(q.id,data.answers[q.id]===q.expected,q.explanation,msg('请区分输入记录、模型估计与人的后续行动。','Distinguish recorded inputs, model estimates and subsequent human actions.'));
      return {data,feedback,passed:c.inputs.every(x=>data.runs.some(r=>r.inputId===x.id))&&c.judgments.every(q=>data.answers[q.id]===q.expected)};
    }
    if(d.kind==='inventory-sim'){
      if(a.type==='stock'&&!data.revealed&&Number.isInteger(a.value)&&a.value>=0&&a.value<=c.maxStock)data.stock=a.value;
      if(a.type==='reveal'&&data.stock!==null)data.revealed=true;
      if(a.type==='answer')data.answers[a.itemId]=a.value;
      const target={shortage:Math.max(0,c.actual-data.stock),excess:Math.max(0,data.stock-c.actual),meaning:'estimate'};
      if(a.type==='check')for(const id of ['shortage','excess','meaning'])tell(id,data.revealed&&data.answers[id]===target[id],c.feedback[id],msg('根据你先前的备货和揭示后的实际需求核算；预测在揭示前只是估计。','Calculate from your committed stock and revealed demand; before reveal, the forecast was an estimate.'));
      return {data,feedback,passed:data.revealed&&Object.keys(target).every(id=>data.answers[id]===target[id])};
    }
    if(d.kind==='data-cleaner'){
      if(a.type==='mark'&&c.rows.some(r=>r.id===a.rowId))data.answers[a.rowId]=a.choice;
      if(a.type==='subtotal')data.answers.subtotal=a.value;
      if(a.type==='conclude')data.answers.conclusion=a.choice;
      if(a.type==='check'){
        for(const r of c.rows)tell(r.id,data.answers[r.id]===r.expected,r.explanation,msg('比较订单标识和来源：同数量并不证明重复；缺失须保留未知。','Compare record identifiers and provenance: equal quantities do not prove duplication; missing values remain unknown.'));
        tell('subtotal',data.answers.subtotal===c.knownSubtotal,msg('这是已知有效记录的小计，未知值仍待核验，不能称完整总量。','This is the known valid subtotal; unknown values still need verification, so it is not the complete total.'),msg('仅累计保留记录中的已知值，不计重复副本，不将未知填成零。','Sum known values of retained records only; exclude copies and do not replace unknown values with zero.'));
        if(c.conclusion)tell('conclusion',data.answers.conclusion===c.conclusion.expected,c.conclusion.explanation,msg('回看本题用途、来源和缺失信息，勿把表格整齐或换模型当作质量核验。','Review purpose, provenance and missing information; neat tables or model replacement do not establish quality.'));
      }
      return {data,feedback,passed:c.rows.every(r=>data.answers[r.id]===r.expected)&&data.answers.subtotal===c.knownSubtotal&&(!c.conclusion||data.answers.conclusion===c.conclusion.expected)};
    }
    if(d.kind==='text-extractor'){
      if(a.type==='extract'&&c.fields.some(f=>f.id===a.fieldId))data.answers[a.fieldId]={value:a.value,evidenceId:a.evidenceId};
      const valid=f=>{const v=data.answers[f.id];return !!v&&v.value===f.expected&&v.evidenceId===f.evidenceId;};
      if(a.type==='check')for(const f of c.fields)tell(f.id,valid(f),f.explanation,msg('字段值必须由对应原文支持；原文未给的信息应标“未提供”，不能猜补。','Support each field with its source passage; mark unstated information as not provided rather than guessing.'));
      return {data,feedback,passed:c.fields.every(valid)};
    }
    if(d.kind==='image-inspector'){
      if(a.type==='inspect'&&c.regions.some(r=>r.id===a.regionId))data.answers.region=a.regionId;
      if(a.type==='conclude')data.answers.conclusion=a.choice;
      if(a.type==='check'){
        tell('region',data.answers.region===c.suspectRegion,msg('该区域的可见线条不连续，已定位待检查位置。','The visible line is interrupted in this region; its location needs inspection.'),msg('逐格比较图中的轮廓连续性，定位可见异常，不能按文字标签猜。','Compare contour continuity across the grid; locate the visible anomaly rather than guessing a label.'));
        tell('conclusion',data.answers.conclusion==='needs-investigation',msg('定位是图像证据；故障原因仍需额外调查。','Location is image evidence; the cause still requires investigation.'),msg('照片只能支持可见区域异常，不能单凭它断言机器故障或操作者责任。','The image supports a visible regional anomaly, not a machine-failure cause or operator responsibility.'));
      }
      return {data,feedback,passed:data.answers.region===c.suspectRegion&&data.answers.conclusion==='needs-investigation'};
    }
    return {data,feedback,passed:false};
  }
  return {kinds,init,step};
});
