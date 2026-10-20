import json,re,pathlib,collections
root=pathlib.Path(__file__).resolve().parents[1]
source=(root/'research/sources/AIB_C01_Collected_Study_Materials.md').read_text()
units=[]
for line in (root/'research/aib-concepts.tsv').read_text().splitlines():
 task,term,q,a,w1,w2,why=line.split('|');units.append(dict(task=task,term=term,q=q,a=a,wrong=[w1,w2],why=why))
titles={'1.1':'AI概念与数据','1.2':'选择合适方案','1.3':'生成式AI技术','2.1':'战略与项目取舍','2.2':'价值与收益','2.3':'竞争与商业模式','3.1':'负责任的决策','3.2':'治理与访问权限','3.3':'风险处置','4.1':'组织准备度','4.2':'数据与基础设施','4.3':'团队与变革','4.4':'从试点到规模化'}
sections={k:re.search(r'### '+re.escape(k)+r' .*?(?=\n### |\n## |\Z)',source,re.S).group(0) for k in ['7.1','7.2','7.3','7.4','7.5','7.6','7.7']}
mapsec={'1.1':'7.1','1.2':'7.1','1.3':'7.2','2.1':'7.3','2.2':'7.3','2.3':'7.3','3.1':'7.5','3.2':'7.5','3.3':'7.5','4.1':'7.6','4.2':'7.6','4.3':'7.6','4.4':'7.6'}
cards=[]
def add(task,q,a,mode,**kw):
 sec=mapsec[task];cards.append(dict(q=q,a=a,mode=mode,topic='Task '+task+' · '+titles[task],source='AIB-C01 用户学习资料 · 原创练习',locator='Task '+task+' / 离线笔记 '+sec,quote=sections[sec][:3900]));cards[-1].update(kw)
for u in units:
 t=u['task'];add(t,u['q'],u['a'],'scenario',context='考试练习 · '+u['term']+'。阅读业务情境，找到合适的处理建议。',wrong=u['wrong'])
 add(t,'为「'+u['term']+'」找到可以同时成立的行动与依据。',u['a']+'；'+u['why'],'evidence',context=u['q'],answers=[u['a'],u['why']],wrong=u['wrong'])
for t,title in titles.items():
 us=[u for u in units if u['task']==t];p=us[:4]
 add(t,title+'：把概念与对应判断配起来。','；'.join(u['term']+'：'+u['a'] for u in p),'pair',pairs=[dict(left=u['term'],right=u['a']) for u in p])
 add(t,title+'：选择本组工作可以保留的做法。','；'.join(u['a'] for u in p[:3]),'multi',answers=[u['a'] for u in p[:3]],wrong=[p[0]['wrong'][0],p[1]['wrong'][1]])
 u=us[-1];add(t,'「'+u['term']+'」的做法复盘：填上关键行动。',u['a'],'cloze',blank=title+'的复盘结论是：___。',wrong=u['wrong'])
 add(t,'评审桌上的提议是“'+us[0]['wrong'][0]+'”。应当怎样修正？',us[0]['a'],'scenario',context='在'+title+'的项目会上，一名同事提出这项方案。请选择能回应其核心问题的修改意见。',wrong=[us[0]['wrong'][1],us[-1]['wrong'][0]])
flows=[('2.1','项目立项',['说明业务问题','记录当前流程问题','比较可行替代方案','定义验证指标']),('2.2','价值核验',['明确比较范围','记录可比基线','计入完整成本','比较实际结果']),('3.3','可靠性异常处置',['识别异常表现','限制受影响用途','调查数据与模型原因','验证纠正结果']),('4.4','迭代转型',['构想','实验','发布','规模化']),('4.2','共享资料准备',['识别所需资料','明确数据责任人','核对权限与质量','安排持续维护']),('4.3','培训设计',['识别岗位任务','评估能力差距','安排适用训练','收集使用反馈']),('3.2','权限审查',['明确业务用途','识别资料访问范围','执行相应访问控制','检查并记录使用情况']),('1.3','检索回答核验',['明确问题','检索获授权的相关资料','结合资料形成回答','核对答案与原文'])]
for t,name,steps in flows:add(t,'按本题给定的演练顺序完成「'+name+'」。',' → '.join(steps),'order',steps=steps,quote='本题规定的练习流程：'+' → '.join(steps)+'。这是按学习资料设计的演练顺序，不是所有情境唯一的行业流程。',locator='Task '+t+' / 原创流程演练')
for i in range(24):
 cost=[40,60,80,100,120,160][i%6];benefit=cost*([.75,1.25,1.5,2][i//6]);v=round((benefit-cost)/cost*100,2)
 add('2.2',f'收益账本 {i+1}：同一期间成本{cost}万元、收益{benefit:g}万元，简单ROI是多少？',f'{v:g} %','roi',calculation=dict(operation='roi',costs=cost,benefits=benefit,unit='%'),quote='ROI = (benefits − costs) / costs。\n本题原创算例：同一期间完整成本'+str(cost)+'万元，收益'+str(benefit)+'万元。成本已包含题设期间的部署、运行、培训及复核；答案为'+f'{v:g}%'+ '。',locator='Task 2.2 / 7.4 Understand simple financial reasoning / 原创算例')
assert len(cards)==200,len(cards)
pack=dict(id='aib-c01-study-v1',version=2,title='AIB-C01 · 考试探险',notice='依据用户提供学习资料编写的中文原创练习；不是AWS官方题库，不代表完整官方课程或全部可能考点。',concepts=len(units),questions=len(cards),tasks=[dict(id=t,title=n,domain=int(t[0]),count=sum(c['topic'].startswith('Task '+t+' ·') for c in cards)) for t,n in titles.items()],cards=cards)
(root/'dist/aib-pack.js').write_text('/* Chinese original practice derived from the supplied study companion. */\nconst AIBStudyPack='+json.dumps(pack,ensure_ascii=False,separators=(',',':'))+';\nif(typeof module!=="undefined")module.exports=AIBStudyPack;\n')
(root/'dist/aib-practice-pack.json').write_text(json.dumps(pack,ensure_ascii=False,indent=2))
print(json.dumps(dict(questions=len(cards),concepts=len(units),tasks=len(titles),modes=dict(collections.Counter(c['mode'] for c in cards))),ensure_ascii=False))
