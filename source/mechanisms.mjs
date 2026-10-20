import * as k from '../vendor/anatomy/kit/iso-kit.mjs';
import * as A from '../vendor/anatomy/kit/audit.mjs';

// The allocation tray: fifty counters worth twenty dollars each, built with the Anatomy kit and
// recorded into its geometry audit. The other machines live in machines.mjs.
function rig(id,deck,{width=800,height=480,azimuth=28,elevation=36,high=70,fastenerZ=0}={}){
 const P=k.fitProjection(k.boxCorners(deck,-14,high),width,height,{pad:28,azimuth,elevation});const R=A.recorder(P);let count=0;
 function slab(name,x,y,w,d,z,h,{tone='mid',piece='',move=[0,0,0],attr='',inner='',bevel=.5}={}){
  const plan={x,y,w,d,r:.7};const svg=k.solidSvg(k.slabOf(plan,z,h,P,3,bevel),{tone,inner});
  R.put({name,piece:piece||name,move,at:[x+w/2,y+d/2,z+h/2],attr,svg,shapes:[R.solid(A.slab(plan,z,h,{name,ground:name.startsWith('foot.')}))]});count++;
 }
 function paper(name,x,y,z,{piece='',move=[0,0,0],w=38,d=24,attr=''}={}){
  const lines=k.lineSvg([6,10,14,18].filter(q=>q<d-3).map((q,i)=>k.lineOnTop([x+5,y+q],[x+w-6-(i%2)*5,y+q],z+1,P)).join(''),{tone:'lo',free:true});
  slab(name,x,y,w,d,z,1,{piece,move,inner:lines,attr,tone:'hi',bevel:.25});
 }
 for(const x of [deck.x+10,deck.x+deck.w-20])for(const y of [deck.y+10,deck.y+deck.d-20])slab('foot.'+x+'.'+y,x,y,10,10,-14,7,{tone:'lo'});
 slab('deck',deck.x,deck.y,deck.w,deck.d,-7,7,{tone:'lo',bevel:1});
 for(const x of [deck.x+6,deck.x+deck.w-10])for(const y of [deck.y+6,deck.y+deck.d-10])slab('fastener.'+x+'.'+y,x,y,4,4,fastenerZ,.8,{tone:'lo'});
 return {P,R,slab,paper,finish(label,states=[0,.5,1]){
  A.settle(R,P,{states});R.items.sort((a,b)=>a.key-b.key);A.auditOrExit(R,P,{frames:states,apart:false});
  const svg=k.figureSvg({width,height,label,body:`<path class="iso-halo" d="${k.haloOf(deck,-14,8,P)}"/>`+R.items.map(item=>`<g data-part="${item.name}" ${item.move.some(Boolean)?`data-mover="${item.piece}"`:''} ${item.attr}>${item.svg}</g>`).join('')});
  return {svg,P,count,vectors:Object.fromEntries(R.items.filter(x=>x.move.some(Boolean)).map(x=>[x.piece,k.axisVector(P,x.move)]))};
 }};
}
export function allocationTray(){
 const r=rig('allocation',{x:-135,y:-91,w:270,d:182,r:5},{width:600,height:350,azimuth:62,elevation:43,high:20,fastenerZ:6});const {slab:s}=r;
 for(const y of [-85,81])s('rim.y'+y,-129,y,258,4,0,6);
 for(const x of [-129,125])s('rim.x'+x,x,-81,4,162,0,6);
 // Fifty $20 counters. Each has two seated positions within its row.
 for(let i=0;i<50;i++){const col=i%10,row=Math.floor(i/10);s('counter.'+i,-118+col*24,-74+row*30,18,20,0,7,{piece:'counter'+i,move:[0,8,0],attr:`data-counter="${i}" data-owner="${i<18?'member':'plan'}"`,tone:'hi',bevel:1});}
 const states=[0,.5,1,...[0,10,18,30,40,50].map(n=>({label:'member '+n,shares:Object.fromEntries(Array.from({length:50},(_,i)=>['counter'+i,i<n?1:0]))}))];
 return r.finish('An allocation tray containing fifty counters worth twenty dollars each. Moving the deductible changes how many counters belong to the member and the plan.',states);
}
