'use strict';
// Locate literal CommonJS calls, excluding comments and authored/template strings.
// Dynamic imports and template interpolation are outside this lightweight audit.
function staticRequires(source){
 const found=[];let i=0;
 function quoted(start){const quote=source[start];let end=start+1;for(;end<source.length;end++){if(source[end]==='\\'){end++;continue;}if(source[end]===quote)return end+1;}return source.length;}
 function trivia(at){while(at<source.length){if(/\s/.test(source[at])){at++;continue;}if(source.startsWith('//',at)){const end=source.indexOf('\n',at+2);at=end<0?source.length:end+1;continue;}if(source.startsWith('/*',at)){const end=source.indexOf('*/',at+2);at=end<0?source.length:end+2;continue;}break;}return at;}
 while(i<source.length){
  if(source.startsWith('//',i)){const end=source.indexOf('\n',i+2);i=end<0?source.length:end+1;continue;}
  if(source.startsWith('/*',i)){const end=source.indexOf('*/',i+2);i=end<0?source.length:end+2;continue;}
  if(['"',"'",'`'].includes(source[i])){i=quoted(i);continue;}
  if(source.slice(i,i+7)==='require'&&!/[\w$]/.test(source[i-1]||'')&&!/[\w$]/.test(source[i+7]||'')){
   let at=trivia(i+7);
   if(source[at]==='('){at=trivia(at+1);
    if(source[at]==='"'||source[at]==="'"){const end=quoted(at),literal=source.slice(at+1,end-1),close=trivia(end);
     if(source[close]===')'&&literal.startsWith('.')&&!literal.includes('\\'))found.push(literal);
    }
   }
   i+=7;continue;
  }
  i++;
 }
 return found;
}
module.exports={staticRequires};
