'use strict';
/** Visible digit tokens only; this is not unit, translation, or arithmetic validation. */
function digitValues(text){
 if(typeof text!=='string')return [];
 const result=[],source=text.normalize('NFKC').replace(/−/g,'-');
 const re=/(-?\d+(?:,\d{3})*(?:\.\d+)?)\s*(万亿|亿|万|million\b|billion\b|trillion\b|thousand\b)?\s*(%)?/gi;
 for(const match of source.matchAll(re)){
  const scale=({'万亿':1e12,'亿':1e8,'万':1e4,million:1e6,billion:1e9,trillion:1e12,thousand:1e3})[match[2]?.toLowerCase()]||1;
  const value=Number(match[1].replace(/,/g,''))*scale;
  if(Number.isFinite(value))result.push((match[3]?'percent:':'number:')+Number(value.toPrecision(14)));
 }
 return result.sort();
}
function bilingualNumberFindings(unit,index){
 const fields=[['explanation',unit.explanation],...(Array.isArray(unit.examples)?unit.examples:[]).map((v,i)=>[`examples[${i}]`,v]),...(Array.isArray(unit.misconceptions)?unit.misconceptions:[]).map((v,i)=>[`misconceptions[${i}]`,v])];
 return fields.flatMap(([path,value])=>{if(typeof value?.zh!=='string'||typeof value?.en!=='string')return [];const zh=digitValues(value.zh),en=digitValues(value.en);return JSON.stringify(zh)===JSON.stringify(en)?[]:[{severity:'warning',code:'candidate.bilingual-number',path:`knowledge.units[${index}].${path}`,message:'双语可见数字经常见分隔符/量级归一化后仍不一致；请核对数值、量纲、数词写法和例示是否等义。此提示不自动判断哪种语言正确。'}];});
}
module.exports={digitValues,bilingualNumberFindings};
