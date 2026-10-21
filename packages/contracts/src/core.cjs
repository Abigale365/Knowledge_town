'use strict';
const crypto=require('node:crypto');
const record=x=>!!x&&typeof x==='object'&&!Array.isArray(x);
const isId=x=>typeof x==='string'&&/^[A-Za-z0-9_.-]{1,80}$/.test(x)&&!['__proto__','constructor','prototype'].includes(x);
const text=x=>typeof x==='string'&&!!x.trim();
const localized=x=>record(x)&&text(x.zh)&&text(x.en);
const list=x=>Array.isArray(x)?x:[];
const refs=x=>Array.isArray(x)&&x.every(isId)&&new Set(x).size===x.length;
const positive=x=>Number.isSafeInteger(x)&&x>0;
const digest=text=>crypto.createHash('sha256').update(text).digest('hex');
function diagnostic(code,path,message,severity='error',sourceId){return{severity,code,path,message,...(sourceId?{sourceId}:{})};}
function base(value,kind){const out=[];if(!record(value))return[diagnostic('shape',kind,'需要对象')];if(value.schemaVersion!==1)out.push(diagnostic('version',kind+'.schemaVersion','只支持契约版本1'));if(!isId(value.id))out.push(diagnostic('id',kind+'.id','需要有效的稳定ID'));if(!positive(value.revision))out.push(diagnostic('revision',kind+'.revision','revision必须为正整数'));return out;}
function unique(items,path,out){const seen=new Set();for(const item of items){if(!record(item)||!isId(item.id)||seen.has(item.id))out.push(diagnostic('duplicate-id',path,'缺少、无效或重复的ID'));seen.add(item?.id);}}
function assertValid(diagnostics){if(diagnostics.some(d=>d.severity==='error')){const error=new Error(diagnostics.filter(d=>d.severity==='error').map(d=>d.code+' '+d.path+': '+d.message).join('\n'));error.code='PIPELINE_CONTRACT_INVALID';error.diagnostics=diagnostics;throw error;}return diagnostics;}
module.exports={record,isId,text,localized,list,refs,positive,digest,diagnostic,base,unique,assertValid};
