// Three machines, each a real object whose working is the concept. Built with the Anatomy kit,
// recorded into its audit, and moved on the page by translating pre-built groups.
import * as k from '../vendor/anatomy/kit/iso-kit.mjs';
import * as G from '../vendor/anatomy/kit/lathe.mjs';
import * as A from '../vendor/anatomy/kit/audit.mjs';

const ease=(u,a,b)=>{const x=Math.max(0,Math.min(1,(u-a)/(b-a)));return x*x*(3-2*x);};
const bump=(u,a,b,c,d)=>ease(u,a,b)*(1-ease(u,c,d));

// A bench: base plate on feet, a recorder, and part helpers that record their true shapes.
function bench(deck,{width=820,height=480,azimuth=52,elevation=33,high=70,extra=[]}={}){
 const P=k.fitProjection([...k.boxCorners(deck,-14,high),...extra],width,height,{pad:14,azimuth,elevation});const R=A.recorder(P);let count=0;
 const at=p=>k.iso(p,P);
 function put(name,svg,shapes,{piece='',move=[0,0,0],attr='',at:centre}={}){R.put({name,piece:piece||name,move,at:centre,attr,svg,shapes});count++;}
 function slab(name,x,y,w,d,z,h,{tone='mid',piece,move,attr,inner='',bevel=.5,steps=3,ground=false,lit=false}={}){
  const plan={x,y,w,d,r:Math.min(.8,w/4,d/4)};const svg=k.solidSvg(k.slabOf(plan,z,h,P,steps,bevel),{tone,inner,lit});
  put(name,svg,[R.solid(A.slab(plan,z,h,{name,ground},steps))],{piece,move,attr,at:[x+w/2,y+d/2,z+h/2]});
 }
 function cyl(name,cx,cy,r,z,h,{tone='mid',piece,move,attr,steps=24,bevel=0,knurl=0,lit=false,inner=''}={}){
  let svg=k.solidSvg(k.cylinder(cx,cy,r,z,h,P,steps,bevel),{tone,lit,inner});
  if(knurl)svg+=k.lineSvg(k.knurl(cx,cy,r,z,z+h,knurl,P),{tone:'lo'});
  put(name,svg,[R.solid(A.cylinder(cx,cy,r,z,h,{name}))],{piece,move,attr,at:[cx,cy,z+h/2]});
 }
 // A turned part along any axis: o is the start, a the axis, length along it.
 function disc(name,o,a,s0,s1,r,{tone='mid',piece,move,attr,lit=false}={}){
  const F=G.frameAlong(o,a);const svg=k.solidSvg(G.disc(s0,s1,r,F,P),{tone,lit});
  const mid=[o[0]+a[0]*(s0+s1)/2,o[1]+a[1]*(s0+s1)/2,o[2]+a[2]*(s0+s1)/2];
  put(name,svg,[R.solid(A.disc(F,s0,s1,r,{name}))],{piece,move,attr,at:mid});
 }
 // A sheet of paper lying flat, with printed rule lines.
 function paper(name,x,y,z,{w=38,d=24,piece,move,attr='',tone='hi',rules=[6,10,14,18]}={}){
  const lines=k.lineSvg(rules.filter(q=>q<d-3).map((q,i)=>k.lineOnTop([x+5,y+q],[x+w-6-(i%2)*5,y+q],z+1,P)).join(''),{tone:'lo',free:true});
  slab(name,x,y,w,d,z,1,{piece,move,inner:lines,attr,tone,bevel:.25});
 }
 // A sheet standing upright in the x–z plane (thickness along y), with rule lines on its near face.
 function sheet(name,x,y,z,{w=30,h=26,piece,move,attr='',tone='hi'}={}){
  const face=[6,11,16,21].filter(q=>q<h-3).map((q,i)=>k.segment([x+4,y+1.01,z+q],[x+w-5-(i%2)*4,y+1.01,z+q],P)).join('');
  slab(name,x,y,w,1,z,h,{piece,move,attr,tone,bevel:.2,inner:k.lineSvg(face,{tone:'lo',free:true})});
 }
 function dots(points,opts){return k.dotsSvg(points.map(p=>at(p)),opts);}
 function base(){
  for(const [x,y] of k.corners(deck,16))cyl('stand.foot'+x+'.'+y,x,y,6,-14,7,{tone:'lo',steps:20});
  slab('deck',deck.x,deck.y,deck.w,deck.d,-7,7,{tone:'lo',bevel:1,steps:8});
 }
 function finish(label,states,{halo=true}={}){
  A.settle(R,P,{states});R.items.sort((a,b)=>a.key-b.key);A.auditOrExit(R,P,{frames:states,apart:false});
  const svg=k.figureSvg({width,height,label,body:(halo?`<path class="iso-halo" d="${k.haloOf(deck,-14,8,P)}"/>`:'')+R.items.map(item=>`<g data-part="${item.name}" ${item.move.some(Boolean)?`data-mover="${item.piece}"`:''} ${item.attr}>${item.svg}</g>`).join('')});
  return {svg,P,count,vectors:Object.fromEntries(R.items.filter(x=>x.move.some(Boolean)).map(x=>[x.piece,k.axisVector(P,x.move)]))};
 }
 return {P,R,at,put,slab,cyl,disc,paper,sheet,dots,base,finish,get count(){return count;}};
}

// 1. The claims register. A claim card goes into the slot; the register prices it; a receipt
// (the remittance) prints from the top; the drawer opens with the money. Two outputs, one input.
export function registerPose(t){
 const u=((t%16)+16)%16;
 return {shares:{card:ease(u,.6,4.2),receipt:ease(u,6.2,9.4),drawer:ease(u,7.4,10.8)},
  opacity:u<.5?u/.5:u>15.2?(16-u)/.8:1,phase:u<4.5?0:u<6.2?1:u<11.5?2:3};
}
export function register(){
 const b=bench({x:-166,y:-88,w:300,d:186,r:6},{width:820,height:500,azimuth:52,elevation:33,high:58});const {slab,cyl,disc,paper,sheet,at,put,P}=b;
 b.base();
 slab('plate.maker',-150,76,54,10,0,1,{tone:'lo',inner:k.lineSvg([3,5.5,8].map((q,i)=>k.lineOnTop([-146,76+q],[-146+34-(i%2)*10,76+q],1,P)).join(''),{tone:'lo',free:true})});
 // The body: a drawer bay below, a floor that doubles as the card shelf, a slot under the deck, the deck.
 const Y0=-70,YD=108;
 slab('pedestal.left',-150,Y0,4,YD,0,12,{tone:'lo'});slab('pedestal.mid',-104,Y0,4,YD,0,12,{tone:'lo'});
 slab('bay.floor',-62,Y0,174,YD,0,2,{tone:'lo'});slab('bay.left',-62,Y0,4,YD,2,10);slab('bay.right',108,Y0,4,YD,2,10);slab('bay.back',-58,Y0,166,4,2,10);
 slab('body.floor',-150,Y0,262,YD,12,4,{tone:'mid',bevel:.6});
 for(const y of [Y0,Y0+YD-4])slab('tunnel.wall'+y,-62,y,174,4,16,4);
 slab('body.deck',-62,Y0,174,YD,20,6,{tone:'hi',bevel:.9,inner:k.lineSvg(k.sideSeam({x:-62,y:Y0,w:174,d:YD,r:.8},23,P,3),{tone:'faint'})});
 const deckScrews=k.corners({x:-62,y:Y0,w:174,d:YD},5).map(([x,y])=>[x,y,26]);put('deck.screws',b.dots(deckScrews,{size:.5,tone:'lo'}),deckScrews.map(q=>b.R.solid(A.ball(q,.4,{name:'screw'}))),{at:[25,Y0+YD/2,26]});
 for(const y of [Y0+6,Y0+YD-10])slab('shelf.guide'+y,-150,y,88,4,16,5,{tone:'mid'});
 for(const x of [-140,-80])put('shelf.screw'+x,b.dots([[x,Y0+8,21],[x,Y0+YD-8,21]],{size:.45,tone:'lo'}),[b.R.solid(A.ball([x,Y0+8,21],.4,{name:'screw'})),b.R.solid(A.ball([x,Y0+YD-8,21],.4,{name:'screw'}))],{at:[x,-17,21]});
 // Keypad at the near side: four rows of four keys, two function bars to their right.
 for(let i=0;i<4;i++)for(let j=0;j<4;j++)cyl('key.'+i+'.'+j,-46+i*13,-6+j*13,4.6,26,3.4,{tone:'hi',steps:20,bevel:.4});
 for(const y of [8,20])slab('key.bar'+y,6,y,50,8,26,3,{tone:'hi',bevel:.5});
 // Display at the back, raised, with the figure the register shows on its window.
 slab('display.body',-52,Y0+4,100,16,26,12,{tone:'mid',bevel:.6});slab('display.window',-48,Y0+6,92,12,38,1,{tone:'hi',bevel:.3,attr:'data-display'});
 put('display.text',k.faceTextSvg(k.topMatrix([-2,Y0+12],39.2,P,'x'),'ALLOWED  1000.00',{size:4.4,anchor:'middle',tone:'hi'}),[b.R.solid(A.slab({x:-40,y:Y0+9,w:76,d:6,r:.5},39,.2,{name:'display.text'}))],{at:[-2,Y0+12,39]});
 cyl('lamp',54,Y0+12,3,26,2.4,{tone:'hi',steps:16,attr:'data-review-light'});
 // Receipt printer at the back right: cheeks, back, platen, a paper roll on a spindle, the tear bar.
 const PX=60,PY=Y0+4;
 slab('printer.back',PX,PY,48,4,26,28);slab('printer.left',PX,PY+4,4,44,26,28);slab('printer.right',PX+44,PY+4,4,44,26,28);slab('printer.front',PX+4,PY+44,40,4,26,22,{tone:'hi'});
 slab('printer.platen',PX+6,PY+30,36,12,26,8,{tone:'lo'});
 disc('printer.roll',[PX+4,PY+18,41],[1,0,0],0,40,7,{tone:'hi'});disc('printer.spindle.l',[PX-2,PY+18,41],[1,0,0],0,2,2.4,{tone:'lo'});disc('printer.spindle.r',[PX+48,PY+18,41],[1,0,0],0,2,2.4,{tone:'lo'});
 slab('printer.tear',PX+4,PY+43.6,40,5.4,48,2,{tone:'hi',bevel:.3});
 sheet('receipt',PX+8,PY+41.4,34,{w:32,h:28,piece:'receipt',move:[0,0,26],attr:'data-document'});
 // The cash drawer inside the bay, which slides toward the viewer.
 const D=Y0+4,DD=YD-8,M=[0,54,0];
 slab('drawer.floor',-58,D,162,DD-4,2,2,{piece:'drawer',move:M,attr:'data-drawer',tone:'mid'});
 for(const x of [-58,100])slab('drawer.side'+x,x,D,4,DD-4,4,6,{piece:'drawer',move:M,attr:'data-money'});
 slab('drawer.back',-54,D,154,4,4,6,{piece:'drawer',move:M,attr:'data-money'});
 slab('drawer.front',-58,D+DD-4,162,4,2,10,{piece:'drawer',move:M,attr:'data-drawer',tone:'hi',bevel:.5});
 slab('drawer.pull',10,D+DD,26,3,5,3,{piece:'drawer',move:M,attr:'data-drawer',tone:'hi'});
 for(const x of [-10,40])slab('drawer.divider'+x,x,D+4,2,DD-8,4,5,{piece:'drawer',move:M,attr:'data-drawer',tone:'lo'});
 for(let i=0;i<3;i++)paper('drawer.bills'+i,-52+i*0.6,D+10,4+i*1,{w:38,d:26,piece:'drawer',move:M,attr:'data-money',rules:[7,13,19]});
 for(let i=0;i<4;i++)cyl('drawer.coin'+i,56+(i%2)*16,D+22+Math.floor(i/2)*22,5,4,1.2,{tone:'hi',steps:20,piece:'drawer',move:M,attr:'data-money'});
 // The claim card on the shelf, which slides under the deck.
 paper('claim.card',-144,Y0+40,16,{w:40,d:26,piece:'card',move:[128,0,0],attr:'data-document'});
 const states=Array.from({length:33},(_,i)=>({label:'register '+i,shares:registerPose(i*16/32).shares}));
 return b.finish('A claims register on a bench. A claim card slides from a shelf into the slot under the keypad; the display shows the allowed amount; a receipt, the remittance, prints from the top; the cash drawer slides open with the payment.',states);
}

// 2. The claim line. A claim ticket rides a belt through six stations: a scanner (eligibility),
// a stamp press (authorization), a pen (care and documentation), feed rollers (submission),
// a gauge whose pointer slides from billed to allowed (adjudication), and a pay station that
// pushes the money packet onto the belt (payment).
const tri=(p,c,w)=>Math.max(0,1-Math.abs(p-c)/w);
export function linePose(p){
 p=Math.max(0,Math.min(1,p));const sm=x=>x*x*(3-2*x);
 return {shares:{ticket:p,stamp:sm(tri(p,.2,.07)),pen:sm(tri(p,.4,.08)),pointer:ease(p,.74,.86),packet:ease(p,.9,1)},station:Math.round(p*5)};
}
export function claimLine(){
 const b=bench({x:-282,y:-50,w:564,d:100,r:6},{width:1000,height:250,azimuth:77,elevation:27,high:60});const {slab,cyl,disc,paper,put,P}=b;
 b.base();
 // Conveyor: legs on pads, cross braces, side rails, the bed, end rollers on axles, a drive box.
 for(const x of [-214,-72,72,214])for(const y of [-13,13]){cyl('leg.pad'+x+'.'+y,x,y,4.2,0,1.2,{tone:'lo',steps:16});cyl('leg.'+x+'.'+y,x,y,2.6,1.2,16.8,{tone:'mid',steps:16});}
 for(const x of [-214,-72,72,214])slab('brace'+x,x-1.5,-10.4,3,20.8,8,2,{tone:'lo'});
 slab('bed',-232,-15,464,30,18,6,{tone:'lo'});
 slab('rail-19',-231,-19,462,4,18,9,{tone:'mid',bevel:.4});slab('rail15a',-231,15,381,4,18,9,{tone:'mid',bevel:.4});slab('rail15b',200,15,31,4,18,9,{tone:'mid',bevel:.4});
 const ribs=[];for(let x=-226;x<=226;x+=12)ribs.push(k.lineOnTop([x,-14],[x,14],24,P));put('belt.ribs',k.lineSvg(ribs.join(''),{tone:'faint'}),[b.R.solid(A.slab({x:-230,y:-14,w:460,d:28,r:.5},24,.1,{name:'belt.ribs'}))],{at:[0,0,24]});
 for(const x of [-238,238]){for(const y of [-24,19])slab('roller.stand'+x+'.'+y,x-5,y,10,5,0,20.4,{tone:'lo'});disc('roller'+x,[x,-18,22],[0,1,0],0,36,5,{tone:'hi'});disc('axle'+x,[x,-23,22],[0,1,0],0,5,1.6,{tone:'lo'});disc('axle.b'+x,[x,18,22],[0,1,0],0,5,1.6,{tone:'lo'});}
 slab('drive.box',120,21,26,18,0,16,{tone:'mid',bevel:.5});disc('drive.pulley',[133,39,10],[0,1,0],0,2,6,{tone:'hi'});disc('drive.belt',[133,39,10],[0,1,0],2,4,2,{tone:'lo'});
 // Inbox at the start, outbox at the end.
 slab('inbox.tray',-262,28,36,28,0,1.5,{tone:'lo'});for(const y of [28,54.5])slab('inbox.wall'+y,-262,y,36,1.5,1.5,8);
 for(let i=0;i<4;i++)paper('inbox.ticket'+i,-258,33,1.5+i,{w:28,d:18,rules:[5,9,13]});
 slab('outbox.stand',248,-12,22,24,0,8,{tone:'lo'});slab('outbox.tray',244,-16,30,32,8,1.5,{tone:'lo'});slab('outbox.back',272.5,-16,1.5,32,9.5,10);for(const y of [-16,14.5])slab('outbox.wall'+y,244,y,28.5,1.5,9.5,10);
 // Six gantries.
 const SX=[-165,-99,-33,33,99,165];
 for(let i=0;i<6;i++){const x=SX[i];
  for(const y of [-30,26]){slab('station.'+i+'.post'+y,x-3.5,y,7,4,0,52,{tone:'mid'});slab('station.'+i+'.bolt'+y,x-1.5,y+1,3,2,56,1,{tone:'lo'});}
  slab('station.'+i+'.beam',x-3.5,-30,7,60,52,4,{attr:`data-station="${i}"`,tone:'mid',bevel:.4});
  slab('station.'+i+'.lamp',x-2,-6,4,12,56,1.2,{attr:`data-station="${i}"`,tone:'hi'});
 }
 // 1 Scanner: a reader head under the beam with a lit bar facing the belt.
 slab('scanner.head',SX[0]-6,-12,12,24,44,8,{tone:'hi',bevel:.4});slab('scanner.bar',SX[0]-5,-11,10,22,42.6,1.4,{tone:'hi',attr:'data-station="0"'});
 // 2 Stamp press: a plunger through a guide block, a stamp head that drops onto the ticket.
 slab('stamp.guide',SX[1]-6,-6,12,12,44,8,{tone:'mid'});
 cyl('stamp.rod',SX[1],0,3,36,8,{tone:'hi',steps:18,piece:'stamp',move:[0,0,-5.4],attr:'data-tool'});cyl('stamp.head',SX[1],0,6.5,31,5,{tone:'hi',steps:24,bevel:.4,piece:'stamp',move:[0,0,-5.4],attr:'data-tool',knurl:24});
 // 3 Pen: a holder on the beam and a pen that lowers to write.
 slab('pen.holder',SX[2]-4,-4,8,8,46,6,{tone:'mid'});cyl('pen.collar',SX[2],0,2.6,44,2,{tone:'lo',steps:16});
 cyl('pen.body',SX[2],0,1.3,30,14,{tone:'hi',steps:14,piece:'pen',move:[0,0,-4.5],attr:'data-tool'});cyl('pen.tip',SX[2],0,.7,29,1,{tone:'lo',steps:12,piece:'pen',move:[0,0,-4.5],attr:'data-tool'});
 // 4 Feed rollers: two brackets from the beam and a roller just above the ticket.
 for(const y of [-18,14])slab('feed.bracket'+y,SX[3]-4,y,8,4,32,20,{tone:'mid'});
 disc('feed.roller',[SX[3],-14,31],[0,1,0],0,28,4.6,{tone:'hi'});disc('feed.axle.a',[SX[3],-18,31],[0,1,0],0,4,1.5,{tone:'lo'});disc('feed.axle.b',[SX[3],14,31],[0,1,0],0,4,1.5,{tone:'lo'});
 // 5 Gauge: a panel behind the belt with ticks hanging from its top edge and a sliding pointer.
 slab('gauge.panel',SX[4]-22,24,44,2,28,24,{tone:'hi',inner:(()=>{const t=k.sideTicks(SX[4]-18,SX[4]+18,3,4,24,52,[2.2,4.4],P);return k.lineSvg(t.minor,{tone:'lo'})+k.lineSvg(t.major,{tone:'mid'});})()});
 slab('gauge.rail',SX[4]-20,22,40,2,30,2,{tone:'lo'});
 slab('gauge.pointer',SX[4]+14,19.4,2.2,2.6,30,12,{tone:'hi',piece:'pointer',move:[-26,0,0],attr:'data-tool'});
 // 6 Pay station: a pedestal and an open-fronted box beside the belt; the packet slides onto the belt.
 slab('pay.pedestal',SX[5]+8,20,28,30,0,24,{tone:'lo'});slab('pay.back',SX[5]+8,48,28,2,24,18);for(const x of [SX[5]+8,SX[5]+34])slab('pay.side'+x,x,20,2,28,24,18);slab('pay.lid',SX[5]+8,20,28,30,42,2,{tone:'hi',bevel:.4});
 paper('pay.packet',SX[5]+12,24,24,{w:20,d:22,piece:'packet',move:[0,-36,0],attr:'data-money',rules:[6,11,16]});
 // The claim ticket at the start of the belt.
 paper('claim.ticket',-212,-12,24,{w:40,d:24,piece:'ticket',move:[358,0,0],attr:'data-document'});
 const states=Array.from({length:51},(_,i)=>({label:'line '+i,shares:linePose(i/50).shares}));
 return b.finish('A claim ticket rides a conveyor through six stations: a scanner, a stamp press, a pen, feed rollers, a gauge with a sliding pointer and a pay station that pushes a money packet onto the belt.',states);
}

// 3. The cistern. Contribution tokens drop from a feed chute into an open tank; the level rises on
// the sight-glass gauge; claim tokens leave through the outlet spout into the providers' trough;
// a small tap beside the gauge fills the retained cup, with the loss-ratio mark on the gauge.
export function cisternPose(t){
 const u=((t%14)+14)%14;
 const fill=ease(u,.6,4.6),drain=ease(u,6,10.4),tap=ease(u,10.6,12.2);
 return {shares:{token:fill,level:fill*(1-.8*drain),claim:drain,retained:tap},phase:u<4.6?0:u<6?1:u<10.6?2:3};
}
export function cistern(){
 const b=bench({x:-186,y:-96,w:372,d:192,r:6},{width:820,height:470,azimuth:50,elevation:34,high:96});const {slab,cyl,disc,paper,put,P}=b;
 b.base();
 // The tank on four legs: floor, four walls with corner angles and a rivet row, a level plate inside.
 const T={x:-70,y:-62,w:140,d:108};
 for(const [x,y] of k.corners(T,8)){cyl('tank.legfoot'+x+'.'+y,x,y,5.5,0,1.5,{tone:'lo',steps:16});cyl('tank.leg'+x+'.'+y,x,y,4,1.5,20.5,{tone:'mid',steps:16});}
 slab('tank.floor',T.x,T.y,T.w,T.d,22,4,{tone:'lo'});
 slab('tank.back',T.x,T.y,T.w,4,26,46);slab('tank.left',T.x,T.y+4,4,T.d-8,26,46);slab('tank.right',T.x+T.w-4,T.y+4,4,T.d-8,26,46);slab('tank.front',T.x,T.y+T.d-4,T.w,4,26,30,{tone:'hi',inner:k.lineSvg(k.sideSeam({x:T.x,y:T.y+T.d-4,w:T.w,d:4,r:.8},40,P,3),{tone:'faint'})});
 for(const [x,y] of [[T.x,T.y],[T.x+T.w-6,T.y],[T.x,T.y+T.d-6],[T.x+T.w-6,T.y+T.d-6]])slab('tank.angle'+x+'.'+y,x,y,6,6,72,2,{tone:'lo'});
 const rivets=[];for(let x=T.x+10;x<T.x+T.w-6;x+=14)rivets.push([x,T.y+T.d+.01,34]);put('tank.rivets',b.dots(rivets,{size:.45,tone:'lo'}),rivets.map(q=>b.R.solid(A.ball(q,.4,{name:'rivet'}))),{at:[0,T.y+T.d,34]});
 slab('tank.level',T.x+5,T.y+5,T.w-10,T.d-10,26,2.5,{tone:'hi',piece:'level',move:[0,0,34],attr:'data-level'});
 // Feed chute from the left, above the rim: a hopper on a stand, a railed chute, tokens on it.
 slab('hopper.stand',-170,-30,10,10,0,72,{tone:'mid'});slab('hopper.floor',-178,-40,30,30,72,3,{tone:'lo'});
 for(const [x,y,w,d] of [[-178,-40,30,3],[-178,-13,30,3],[-178,-37,3,24]])slab('hopper.wall'+x+'.'+y,x,y,w,d,75,14);
 slab('chute.bed',-148,-34,80,18,72,3,{tone:'lo'});for(const y of [-36,-18])slab('chute.rail'+y,-148,y,80,2,75,5,{tone:'mid'});
 for(let i=0;i<3;i++)cyl('hopper.token'+i,-162,-26,6,75+i*2,2,{tone:'hi',steps:20,attr:'data-money'});
 cyl('token',-140,-25,6,75,2,{tone:'hi',steps:20,piece:'token',move:[96,0,0],attr:'data-money'});
 // Sight glass and gauge on the right wall: fittings on a stay, a glass tube, a rule with ticks, a float on the rule.
 slab('gauge.stay',70,-2,22,4,24,2,{tone:'lo'});slab('gauge.cap',70,-2,22,4,70,2,{tone:'lo'});
 cyl('gauge.fitting.lo',84,0,3.4,26,4,{tone:'lo',steps:16});cyl('gauge.glass',84,0,2.2,30,36,{tone:'hi',steps:16,inner:k.lineSvg([40,50,60].map(z=>k.sideArc(84,0,2.2,z,P,12)).join(''),{tone:'faint'})});cyl('gauge.fitting.hi',84,0,3.4,66,4,{tone:'lo',steps:16});
 slab('gauge.rule',88,-6,2,12,26,44,{tone:'hi'});
 const ticks=[];for(let z=30;z<=66;z+=3)ticks.push(k.segment([90.01,-4,z],[90.01,z%12===6?2:-1,z],P));put('gauge.ticks',k.lineSvg(ticks.join(''),{tone:'lo'})+k.lineSvg(k.segment([90.01,-4,60],[90.01,5,60],P),{tone:'hi'}),[b.R.solid(A.slab({x:90,y:-4,w:.2,d:9,r:.05},30,36,{name:'ticks'}))],{at:[90,0,48]});
 slab('gauge.float',90,-2,4,4,29,3,{tone:'hi',piece:'level',move:[0,0,34],attr:'data-level'});
 // Outlet spout at the front right into the providers' trough, with its valve wheel beside the rail.
 slab('spout.bed',40,46,32,40,22,3,{tone:'lo'});for(const x of [40,64])slab('spout.rail'+x,x,46,2,40,25,5,{tone:'mid'});
 cyl('spout.stem',69,58,1.4,25,6,{tone:'lo',steps:12});cyl('spout.wheel',69,58,4.5,31,2.6,{tone:'hi',steps:20,knurl:20});
 slab('trough.floor',30,86,60,22,10,2,{tone:'lo'});for(const [x,y,w,d] of [[30,86,60,2],[30,106,60,2],[30,88,2,18],[88,88,2,18]])slab('trough.wall'+x+'.'+y,x,y,w,d,12,8);
 for(const x of [34,80])slab('trough.leg'+x,x,92,6,10,0,10,{tone:'mid'});
 cyl('claim',52,52,6,25,2,{tone:'hi',steps:20,piece:'claim',move:[0,40,0],attr:'data-money'});
 // Retained tap at the back right: a short spout from the wall, a token on a pad, a cup on the shelf.
 slab('tap.shelf',70,-46,36,16,42,2,{tone:'lo'});slab('tap.spout',70,-40,14,6,52,4,{tone:'mid'});cyl('tap.wheel',77,-37,3.5,56,2.4,{tone:'hi',steps:16,knurl:16});
 slab('tap.pad',72,-43,10,10,44,1,{tone:'lo'});
 slab('cup.floor',90,-46,16,16,44,1,{tone:'lo'});slab('cup.back',104,-46,2,16,45,8,{tone:'hi'});for(const y of [-46,-32])slab('cup.side'+y,90,y,14,2,45,8,{tone:'hi'});
 cyl('retained',77,-38,4.5,45,1.6,{tone:'hi',steps:16,piece:'retained',move:[21,0,0],attr:'data-money'});
 const states=Array.from({length:29},(_,i)=>({label:'cistern '+i,shares:cisternPose(i*14/28).shares}));
 return b.finish('A riveted cistern on legs with a feed chute, a sight-glass gauge, an outlet spout into a trough and a small retained tap into a cup. Contribution tokens enter from the chute, the level rises on the gauge, claim tokens leave through the spout, and a bounded share goes to the cup.',states);
}
