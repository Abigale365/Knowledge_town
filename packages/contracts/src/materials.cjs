'use strict';
const {base,list,unique,text,digest,diagnostic}=require('./core.cjs');
function validateMaterialBundle(bundle){
 const out=base(bundle,'materials'),materials=list(bundle?.materials);
 if(!materials.length||materials.length>50)out.push(diagnostic('materials.count','materials','资料数量需为1至50'));
 unique(materials,'materials',out);let bytes=0;
 for(const [i,m]of materials.entries()){
  const p='materials['+i+']';
  if(!text(m?.name)||!text(m?.text))out.push(diagnostic('materials.empty',p,'文件名和正文不能为空'));
  else{bytes+=Buffer.byteLength(m.text);if(m.contentHash!==digest(m.text))out.push(diagnostic('materials.hash',p+'.contentHash','资料哈希与正文不一致'));}
 }
 if(bytes>7*1024*1024)out.push(diagnostic('materials.limit','materials','资料总量超过7MB'));return out;
}
module.exports={validateMaterialBundle};
