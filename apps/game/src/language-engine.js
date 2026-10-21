(function(root,factory){const api=factory();if(typeof module==='object')module.exports=api;else root.TownLocale=api;})(typeof window==='undefined'?globalThis:window,function(){
'use strict';
let sortedPairs=null;
const modes=['zh','en','bi'],forward=new Map(),reverse=new Map();
function mode(value){return modes.includes(value)?value:'zh';}
function register(zh,en){if(typeof zh!=='string'||typeof en!=='string'||!zh.trim()||!en.trim()||zh===en)return;if(forward.get(zh)!==en){forward.set(zh,en);reverse.set(en,zh);sortedPairs=null;}}
function text(zh,en,language){zh=typeof zh==='string'?zh:'';en=typeof en==='string'?en:'';register(zh,en);return mode(language)==='en'?(en||zh):(zh||en);}
function pair(value,translate){if(typeof value!=='string'||!value.trim())return null;const trimmed=value.trim();if(forward.has(trimmed))return{zh:trimmed,en:forward.get(trimmed)};if(reverse.has(trimmed))return{zh:reverse.get(trimmed),en:trimmed};if(!/[\u3400-\u9fff]/.test(value))return null;let translated=typeof translate==='function'?translate(value):value;if(/[\u3400-\u9fff]/.test(translated)){sortedPairs??=[...forward].sort((a,b)=>b[0].length-a[0].length);for(const[zh,en]of sortedPairs)if(zh.length>1&&translated.includes(zh))translated=translated.split(zh).join(en);}if(/[\u3400-\u9fff]/.test(translated))return null;return translated&&translated!==value?{zh:value,en:translated}:null;}
function registerObject(value){if(!value||typeof value!=='object')return;if(typeof value.zh==='string'&&typeof value.en==='string')register(value.zh,value.en);for(const child of Object.values(value))if(child&&typeof child==='object')registerObject(child);}
return{modes,mode,register,text,pair,registerObject};
});
