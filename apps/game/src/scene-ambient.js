/* Independent little visitors. Painted water, flowers and buildings stay still.
   Pure markup/CSS: scene replacement removes animation; no timers/listeners. */
'use strict';
const TownAmbient = (() => {
 const scenes = {
  grove: [['butterfly',650,750,66,-26,'#e7c688',13],['butterfly',1055,525,-48,-38,'#becbe1',17]],
  harbor: [['dragonfly',900,660,45,-35,'#b6d6ce',11],['butterfly',650,475,-40,-23,'#e9c798',16]],
  town: [['butterfly',1170,772,-63,-32,'#e6b9a6',14],['butterfly',930,475,16,-27,'#e9d695',19]],
  observatory: [['dragonfly',640,770,77,-31,'#c1d9cb',15],['butterfly',1080,561,53,-28,'#c5c5df',20]]
 };
 const timing = i => `style="--ambient-delay:-${(i * 1.37).toFixed(2)}s;--ambient-duration:${(3.1+i*.43).toFixed(2)}s"`;
 function visitor([kind,x,y,dx,dy,color,duration],i){
  const wings=kind==='dragonfly'
   ? '<ellipse class="visitor-wing" cx="-8" cy="-3" rx="10" ry="3"/><ellipse class="visitor-wing" cx="8" cy="-3" rx="10" ry="3"/><ellipse class="visitor-wing" cx="-7" cy="3" rx="8" ry="2.5"/><ellipse class="visitor-wing" cx="7" cy="3" rx="8" ry="2.5"/><path class="visitor-body" d="M0-5V13"/>'
   : '<path class="visitor-wing" d="M0 0C-7-15-19-11-13-1C-20 9-6 13 0 3Z"/><path class="visitor-wing" d="M0 0C7-15 19-11 13-1C20 9 6 13 0 3Z"/><path class="visitor-body" d="M0-4V7M0-4L-3-7M0-4L3-7"/>';
  return `<g transform="translate(${x} ${y})"><g class="scene-visitor scene-${kind}" style="--visitor-color:${color};--flight-x:${dx}px;--flight-y:${dy}px;--ambient-duration:${duration}s;--ambient-delay:-${i*4.7+2}s"><g class="visitor-hover">${wings}</g></g></g>`;
 }
 function markup(zone) {
  const data=scenes[zone];if(!data)return '';
  return svg(zone,1536,1024,data.map(visitor).join(''));
 }
 function svg(zone,w,h,body){return `<svg class="scene-ambient scene-ambient-${zone}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="${w===1672?'xMidYMid slice':'none'}" aria-hidden="true" focusable="false">${body}</svg>`;}
 function away(zone){
  if(zone==='seaside')return svg(zone,1672,941,
   [[1180,400,-115,23,23],[1270,445,-86,-17,29]].map(([x,y,dx,dy,duration],i)=>`<g transform="translate(${x} ${y})"><g class="scene-visitor scene-gull" style="--flight-x:${dx}px;--flight-y:${dy}px;--ambient-duration:${duration}s;--ambient-delay:-${i*8+3}s;--gull-y-delay:-${i*8+3+duration/4}s"><g class="gull-drift"><g class="visitor-hover"><path class="gull-wing" d="M0 0Q-8-9-19-5"/><path class="gull-wing gull-wing-right" d="M0 0Q8-9 19-5"/></g></g></g></g>`).join(''));
  if(zone==='winter')return svg(zone,1672,941,
   Array.from({length:28},(_,i)=>`<circle class="scene-snow" cx="${(i*193+57)%1672}" cy="${(i*137)%941}" r="${1.3+i%3*.65}" style="--ambient-duration:${8+i%7}s;--ambient-delay:-${i*.83}s"/>`).join('')+
   [[1111,88],[883,409],[1373,553],[902,674],[465,491]].map(([x,y],i)=>`<circle class="scene-lamplight" cx="${x}" cy="${y}" r="${i?8:19}" ${timing(i)}/>`).join(''));
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
