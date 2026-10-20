(function(root,factory){const a=factory();if(typeof module==='object')module.exports=a;else root.TownSamples=a;})(typeof window==='undefined'?globalThis:window,function(){
return{cards:[
{q:'一项 AI 商业试点应按什么顺序推进？',a:'明确业务问题 → 记录基线 → 小范围试点 → 对照评估',steps:['明确业务问题','记录基线','小范围试点','对照评估'],wrong:[],quote:'本示例采用：先明确业务问题，再记录使用前基线，然后小范围试点，最后对照评估。',locator:'原创教学示例 · 流程',mode:'order'},
{q:'哪些工作属于 AI 商业应用的合理用途？',a:'整理客服反馈；辅助起草；预测需求',answers:['整理客服反馈','辅助起草','预测需求'],wrong:['保证所有结论永远正确','无需任何人工监督'],quote:'AI 可辅助整理反馈、起草文本与预测需求，但仍需验证效果并根据风险设置监督。',mode:'multi',locator:'原创教学示例 · 多选'},
{q:'把试点评估中的材料放进合适的分类。',a:'效率指标：用时、返工时长；质量指标：事实错误率、合格率',categories:[{label:'效率指标',items:['完成任务用时','人工返工时长']},{label:'质量指标',items:['事实错误率','输出合格率']}],quote:'此示例把用时与返工时长归为效率指标，把事实错误率与合格率归为质量指标。',mode:'sort',locator:'原创教学示例 · 分类'},
{q:'计算这次任务的净工时节省。',a:'35 分钟',calculation:{operation:'net-time',before:60,after:10,review:15,unit:'分钟'},quote:'原先用时60分钟；AI生成10分钟，人工复核15分钟；净节省为60−10−15＝35分钟。',mode:'numeric',locator:'原创教学示例 · 计算'},
{q:'客户客服回复草稿涉及现行退款制度，该怎么处理？',a:'核对现行制度、客户情况与措辞，再确认发送。',wrong:['语言流畅就直接发送。','把旧制度视作永远有效。'],context:'你在帮助客服处理退款请求。AI 已写好一段流畅的回复，但引用的制度没有日期。请把合适的处理建议投递给邮差。',quote:'涉及制度的客服草稿应核对版本、适用范围和事实，再由相应人员确认发送。',mode:'scenario',locator:'原创教学示例 · 情境'},
{q:'资料应保留什么，才方便核对回答依据？',a:'可追溯的原文位置',wrong:['只有漂亮的封面','无法识别的匿名结论'],blank:'用于回答问题的资料，应保留___。',quote:'用于回答问题的资料，应保留可追溯的原文位置，并检查使用授权。',mode:'cloze',locator:'原创教学示例 · 填空'}
]};
});
