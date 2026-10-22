/* Preserve decorative CSS animation time across a same-scene interface redraw. */
(function(root,factory){const api=factory();if(typeof module==='object')module.exports=api;else root.SceneMotion=api;})(typeof globalThis==='undefined'?this:globalThis,function(){
 'use strict';
 function animations(root){return [...(root?.querySelectorAll?.('.scene-ambient, .away-weather')||[])].flatMap(layer=>layer.getAnimations?.({subtree:true})||[]);}
 function capture(root,scene){const seen=new Map();return {scene,items:animations(root).flatMap(a=>{const name=a.animationName;if(typeof name!=='string')return [];const index=seen.get(name)||0;seen.set(name,index+1);if(!Number.isFinite(a.currentTime))return [];return [{name,index,time:a.currentTime,rate:a.playbackRate}];})};}
 function restore(root,snapshot,scene){if(!snapshot||snapshot.scene!==scene)return;const seen=new Map(),records=new Map(snapshot.items.map(x=>[x.name+':'+x.index,x]));for(const a of animations(root)){const name=a.animationName,index=seen.get(name)||0;seen.set(name,index+1);const saved=records.get(name+':'+index);if(!saved)continue;try{a.currentTime=saved.time;if(Number.isFinite(saved.rate))a.playbackRate=saved.rate;}catch{/* A removed or unsupported animation must not interrupt play. */}}}
 return {capture,restore};
});
