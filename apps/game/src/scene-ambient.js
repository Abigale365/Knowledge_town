/* Small independent visitors; the painted landscape never moves.
   Deterministic SVG/CSS only: no timers, listeners or per-frame DOM work. */
'use strict';
const TownAmbient = (() => {
 const scenes={
  grove:[['leaf',650,750,48,-24,15],['leaf',1055,510,-35,-28,19],['mote',690,703,18,-20,9],['leaf',1020,475,22,-18,23],['mote',1080,475,14,-18,12]],
  harbor:[['paperboat',1225,810,40,-6,21],['gull',650,475,-32,-18,22],['gull',650,565,24,-16,27],['mote',946,706,12,-12,11]],
  town:[['bee',1170,772,-45,-23,13],['petal',930,475,16,-27,19],['petal',971,491,17,-22,23],['bee',1310,767,-28,-14,17],['petal',1015,470,12,-20,16]],
  observatory:[['seed',640,770,60,-24,19],['seed',1080,561,38,-20,25],['seed',678,780,28,-25,23],['glint',1040,85,0,0,7],['glint',1135,205,0,0,11]]
 };
 const drawings={
  leaf:'<path fill="var(--leaf-color,#9eae71)" stroke="#6e8058" stroke-width=".7" d="M-12 5Q-11-10 12-6Q9 9-12 5Z"/><path fill="#e0cf91" fill-opacity=".27" d="M-12 5L12-6Q9 9-12 5Z"/><path stroke="#d9d5a0" stroke-width=".8" d="M-12 5L10-5M-3 1L-5-4M2-1L5 3"/>',
  petal:'<path fill="var(--petal-color,#e4b3ac)" stroke="#bd8c87" stroke-width=".6" d="M-7 1Q-12-9-2-9Q9-10 7-2Q4 8-7 1Z"/><path stroke="#f4d3bc" stroke-width=".7" d="M-6 0Q0-4 4-5"/>',
  bee:'<g class="little-wings"><ellipse fill="#f5eee0" fill-opacity=".8" stroke="#b2c2b1" stroke-width=".6" cx="-3" cy="-7" rx="6" ry="4"/><ellipse fill="#f5eee0" fill-opacity=".7" stroke="#b2c2b1" stroke-width=".6" cx="5" cy="-7" rx="6" ry="4"/></g><ellipse fill="#d9b967" stroke="#786b4f" stroke-width=".8" rx="9" ry="5"/><path stroke="#f4d99b" stroke-width=".8" d="M-5-2Q0-4 5-2"/><path stroke="#786b4f" stroke-width="2" d="M-2-4V4M3-4V4"/><circle fill="#665d49" cx="-9" cy="-1" r="3"/><path stroke="#665d49" stroke-width=".7" d="M-10-3L-12-6M-6 5L-8 7M2 5V7"/>',
  seed:'<path stroke="#b5a47f" stroke-width=".9" d="M0 0L7 15"/><ellipse fill="#967e57" cx="7" cy="15" rx="1.7" ry="3"/><path stroke="#fff4d7" stroke-opacity=".85" stroke-width=".9" d="M0 0L-9-5M0 0L-5-9M0 0V-11M0 0L5-9M0 0L9-5M0 0L-10 0M0 0L10 0"/>',
  gull:'<g class="little-wings"><path class="gull-wing-far" fill="#bbc4b7" stroke="#8b998f" stroke-width=".65" d="M-2 0Q0-12 13-17Q10-8 5 1Z"/><g class="gull-wing-near"><path fill="#eee7d3" stroke="#8b998f" stroke-width=".7" d="M0 1Q4-18 18-18L25-14Q14-14 8-3L4 3Z"/><path stroke="#fff6df" stroke-width=".8" d="M5-4Q11-14 21-15"/></g></g><path fill="#f7edda" stroke="#8b998f" stroke-width=".65" d="M-10 1Q-8-4-3-2L10 1L18 0L13 6L8 4Q-5 8-10 1Z"/><circle fill="#f7edda" stroke="#8b998f" stroke-width=".5" cx="-9" cy="-2" r="3.2"/><path fill="#bd965f" d="M-12-3L-17-1L-12 0Z"/><circle fill="#646b60" cx="-10" cy="-2.5" r=".65"/><path stroke="#d6cdb8" stroke-width=".65" d="M-3 4Q3 6 9 3"/>',
  paperboat:'<g class="boat-wake"><path stroke="#d4e3d4" stroke-opacity=".55" stroke-width="1.2" d="M-20 8Q-9 11-3 9M6 10Q15 12 22 9"/></g><g class="boat-hull"><path fill="#e5d7b0" stroke="#8a8e73" stroke-width=".7" d="M-17 0L17 0L9 8H-9Z"/><path fill="#f5e9c9" stroke="#8a8e73" stroke-width=".7" d="M-13 0L2-14L12 0ZM2-14V0"/></g>',
  crab:'<ellipse fill="#9b785b" fill-opacity=".16" cx="0" cy="7" rx="14" ry="3"/><g class="crab-legs crab-legs-a"><path stroke="#ad795c" stroke-width="1.5" d="M-6 2L-12 4L-15 8M6 4L9 7L10 10"/></g><g class="crab-legs crab-legs-b"><path stroke="#ad795c" stroke-width="1.5" d="M-6 4L-9 7L-10 10M6 2L12 4L15 8"/></g><path fill="#c48b68" stroke="#906d54" stroke-width=".7" d="M-9 0Q-8-7 0-6Q8-7 9 0L6 5H-6Z"/><path stroke="#aa7456" stroke-width="1.4" d="M-8 0L-13-4M8 0L13-4M-3-5L-4-8M3-5L4-8"/><path fill="#d49d78" stroke="#aa7456" stroke-width=".7" d="M-13-3Q-20-4-17-10L-14-7L-12-11Q-8-6-13-3ZM13-3Q20-4 17-10L14-7L12-11Q8-6 13-3Z"/><circle fill="#695c4b" cx="-4" cy="-8" r="1.2"/><circle fill="#695c4b" cx="4" cy="-8" r="1.2"/><path stroke="#e5bd91" stroke-width=".8" d="M-4-2Q0-4 4-2"/>',
  steam:'<path stroke="#d6dce5" stroke-opacity=".6" stroke-width="2.1" d="M-3 0C-12-9 11-16 2-29"/><path stroke="#d6dce5" stroke-opacity=".3" stroke-width="1.3" d="M3-5C12-14-4-19 5-28"/>',
  mote:'<circle fill="#f5e2ab" fill-opacity=".75" r="2.1"/><circle fill="#fff3ce" fill-opacity=".35" r="4"/>',
  glint:'<path stroke="#f5dda3" stroke-width="1.1" d="M-5 0H5M0-5V5"/><circle fill="#fff1c7" r="1.5"/>'
 };
 function item([kind,x,y,dx,dy,duration],i){
  // Bounds include the drawing, hover/tilt and the entire two-axis route.
  const pad=kind==='gull'?30:kind==='paperboat'?26:kind==='seed'?23:kind==='mote'?7:kind==='crab'?23:kind==='steam'?38:18;
  const bounds=[x+Math.min(0,dx)-pad,y-Math.abs(dy)-pad,x+Math.max(0,dx)+pad,y+Math.abs(dy)+pad];
  const delay=i*3.73+2;
  const heading=kind==='gull'&&dx>0?-1:1;
  // Wind curves stay inside the original route rectangle; smaller silhouettes
  // add depth without expanding collision/label envelopes or creating new nodes.
  const windborne=['leaf','petal','seed'].includes(kind),variant=i%3;
  const scale=windborne?(0.9+variant*.05).toFixed(2):'1';
  const palette=`--leaf-color:${i%2?'#b8a276':'#98a576'};--petal-color:${i%2?'#e4b3ac':'#efd0b2'};--heading:${heading};--figure-scale:${scale};--wind-first:${[.18,.35,.22][variant]};--wind-mid:${[.68,.55,.7][variant]};--wind-late:${[.6,.82,.78][variant]};--detail-duration:${(3.3+i*.71).toFixed(2)}s;`;
  return `<g data-effect="${kind}" data-bounds="${bounds.join(' ')}" transform="translate(${x} ${y})"><g class="little-route little-${kind}" style="${palette}--flight-x:${dx}px;--flight-y:${dy}px;--ambient-duration:${duration}s;--ambient-delay:-${delay.toFixed(2)}s;--vertical-delay:-${(delay+duration/4).toFixed(2)}s"><g class="little-drift"><g class="little-facing"><g class="little-body">${drawings[kind]}</g></g></g></g></g>`;
 }
 function svg(zone,w,h,body){return `<svg fill="none" class="scene-ambient scene-ambient-${zone}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="${w===1672?'xMidYMid slice':'none'}" aria-hidden="true" focusable="false">${body}</svg>`;}
 function markup(zone){return scenes[zone]?svg(zone,1536,1024,scenes[zone].map(item).join('')):'';}
 function snow(i){
  // Sparse foreground flakes travel faster; distant flakes stay small and quiet.
  const near=i%4===0,variant=i%3;
  const radius=near?2.1+variant*.25:.9+variant*.2;
  const duration=near?8+variant:14+i%7;
  const drift=near?40+i%5*6:12+i%5*3;
  const fall=near?240+variant*18:150+variant*12;
  const peak=near?.62:.32+variant*.035;
  return `<circle class="scene-snow" data-depth="${near?'near':'far'}" cx="${(i*193+57)%1672}" cy="${(i*137)%941}" r="${radius.toFixed(2)}" style="--ambient-duration:${duration}s;--ambient-delay:-${i*.83}s;--snow-drift:${drift}px;--snow-fall:${fall}px;--snow-peak:${peak.toFixed(2)}"/>`;
 }
 function away(zone){
  if(zone==='seaside')return svg(zone,1672,941,[['gull',940,400,-70,18,25],['gull',1160,445,-55,16,31],['gull',1090,365,45,12,29],['crab',650,400,28,2,18]].map(item).join(''));
  if(zone==='winter')return svg(zone,1672,941,
   '<defs><radialGradient id="ambient-winter-glow"><stop stop-color="#ffda8d" stop-opacity=".65"/><stop offset="1" stop-color="#ffcf73" stop-opacity="0"/></radialGradient></defs>'+
   Array.from({length:28},(_,i)=>snow(i)).join('')+
   [['steam',1328,151,16,-22,11],['steam',1328,151,22,-28,13]].map(item).join('')+
   [[1111,88],[883,409],[1373,553],[902,674],[465,491]].map(([x,y],i)=>`<circle class="scene-lamplight" cx="${x}" cy="${y}" r="${i?18:25}" style="--ambient-duration:${3.1+i*.43}s;--ambient-delay:-${i*1.37}s"/>`).join(''));
  return '';
 }
 function render(zone,world,existing){
  const layer=existing||document.createElement('div');
  if(!existing){layer.id='ambientScene';layer.setAttribute?.('aria-hidden','true');world.appendChild(layer);}
  if(layer.dataset.zone===zone)return;
  layer.dataset.zone=zone;layer.innerHTML=markup(zone);
 }
 return {markup,away,render};
})();
if(typeof module!=='undefined')module.exports=TownAmbient;
