// Renders an organization map as SVG. Boxes size themselves to their wrapped text; edges follow
// org-chart routing (parent → bus → child drop) so no two edges share a label position.
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const W=196,PAD=12,CX=236,X0=20,Y0=20,GAP=50;
const TITLE=13,KIND=9,TITLE_CH=7.2,KIND_CH=5.9;
export function wrap(text,maxPx,perChar){
 const out=[];for(const para of String(text).split('<br>')){const words=para.split(' ');let line='';for(const w of words){const next=line?line+' '+w:w;if(next.length*perChar>maxPx&&line){out.push(line);line=w;}else line=next;}if(line)out.push(line);}return out;
}
export function measure(n){const title=wrap(n[1],W-PAD*2,TITLE_CH),kind=wrap(n[2],W-PAD*2,KIND_CH);return {title,kind,h:PAD+title.length*(TITLE+2)+4+kind.length*(KIND+2)+PAD-2};}
export function mapSvg(m){
 const byId=Object.fromEntries(m.nodes.map(n=>[n[0],n]));
 const sized=Object.fromEntries(m.nodes.map(n=>[n[0],measure(n)]));
 const rows=Math.max(...m.nodes.map(n=>n[4]))+1,cols=Math.max(...m.nodes.map(n=>n[3]))+1;
 const rowH=Array.from({length:rows},(_,r)=>Math.max(...m.nodes.filter(n=>n[4]===r).map(n=>sized[n[0]].h)));
 const rowY=[];let y=Y0;for(let r=0;r<rows;r++){rowY.push(y);y+=rowH[r]+GAP;}
 const pos=id=>{const n=byId[id];return {x:X0+n[3]*CX,y:rowY[n[4]],w:W,h:sized[id].h,cx:X0+n[3]*CX+W/2};};
 const width=X0*2+(cols-1)*CX+W,height=y-GAP+Y0;
 const label=(x,yy,text,anchor='middle')=>{const tw=text.length*6.2+10;const lx=anchor==='middle'?x-tw/2:anchor==='start'?x:x-tw;return `<rect x="${lx}" y="${yy-8}" width="${tw}" height="15" rx="2" fill="var(--paper)"/><text x="${x}" y="${yy+3}" text-anchor="${anchor}" class="map-edge-label">${esc(text)}</text>`;};
 const edges=m.edges.map(([a,b,text,type],i)=>{
  const A=pos(a),B=pos(b);const dashed=type==='service'||type==='license';const cls=`map-edge ${dashed?'dashed':''}`;
  let d,lab;
  if(A.y===B.y){const right=B.x>A.x;const x1=right?A.x+W:A.x,x2=right?B.x:B.x+W;const yy=A.y+Math.min(A.h,B.h)/2;d=`M${x1} ${yy} L${x2} ${yy}`;lab=text==='business'?'':label((x1+x2)/2,yy-12,text);}
  else{const down=B.y>A.y;const y1=down?A.y+A.h:A.y;const y2=down?B.y:B.y+B.h;const bus=down?y1+GAP/2:y1-GAP/2;d=A.cx===B.cx?`M${A.cx} ${y1} L${B.cx} ${y2}`:`M${A.cx} ${y1} L${A.cx} ${bus} L${B.cx} ${bus} L${B.cx} ${y2}`;lab=text==='business'?'':label(B.cx,down?y2-12:y2+12,text);}
  return `<g data-cell-id="edge${i}" data-type="${type}"><path class="${cls}" d="${d}" marker-end="url(#${dashed?'map-arrow-signal':'map-arrow'})"/>${lab}</g>`;
 }).join('');
 const nodes=m.nodes.map(n=>{const p=pos(n[0]),s=sized[n[0]];let ty=p.y+PAD+TITLE-2;
  const title=s.title.map((t,i)=>`<text class="map-title" x="${p.x+PAD}" y="${ty+i*(TITLE+2)}">${esc(t)}</text>`).join('');ty+=s.title.length*(TITLE+2)+2;
  const kind=s.kind.map((t,i)=>`<text class="map-kind" x="${p.x+PAD}" y="${ty+i*(KIND+2)}">${esc(t)}</text>`).join('');
  return `<g data-cell-id="${n[0]}"><rect class="map-box" x="${p.x}" y="${p.y}" width="${W}" height="${s.h}" rx="2"/>${title}${kind}</g>`;}).join('');
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" class="orgmap"><defs><marker id="map-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="#8a9198"/></marker><marker id="map-arrow-signal" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="oklch(0.58 0.20 30)"/></marker></defs>${edges}${nodes}</svg>`;
}
// A small labeled-box diagram (used by the seat chapters). Boxes size to their text.
export function miniSvg({width=520,boxes,wires,label}){
 const sized=boxes.map(b=>({...b,...measure(['',b.title,b.kind]),w:b.w||170}));
 for(const b of sized){b.title=wrap(b.title,b.w-PAD*2,TITLE_CH);b.kind=wrap(b.kind,b.w-PAD*2,KIND_CH);b.h=PAD+b.title.length*(TITLE+2)+4+b.kind.length*(KIND+2)+PAD-2;}
 const height=Math.max(...sized.map(b=>b.y+b.h))+16;
 const byId=Object.fromEntries(sized.map(b=>[b.id,b]));
 const port=(b,side)=>side==='r'?[b.x+b.w,b.y+b.h/2]:side==='l'?[b.x,b.y+b.h/2]:side==='t'?[b.x+b.w/2,b.y]:[b.x+b.w/2,b.y+b.h];
 const ws=wires.map(([a,sa,b,sb,cls=''])=>{const [x1,y1]=port(byId[a],sa),[x2,y2]=port(byId[b],sb);const mx=(x1+x2)/2;const d=sa==='r'||sa==='l'?`M${x1} ${y1} C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`:`M${x1} ${y1} L${x2} ${y2}`;return `<path class="map-edge ${cls}" d="${d}" marker-end="url(#${cls.includes('dashed')?'map-arrow-signal':'map-arrow'})"/>`;}).join('');
 const bs=sized.map(b=>{let ty=b.y+PAD+TITLE-2;const t=b.title.map((l,i)=>`<text class="map-title" x="${b.x+PAD}" y="${ty+i*(TITLE+2)}">${esc(l)}</text>`).join('');ty+=b.title.length*(TITLE+2)+2;const k=b.kind.map((l,i)=>`<text class="map-kind" x="${b.x+PAD}" y="${ty+i*(KIND+2)}">${esc(l)}</text>`).join('');return `<g><rect class="map-box ${b.on?'on':''}" x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="2"/>${t}${k}</g>`;}).join('');
 return `<svg class="mini orgmap" viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(label)}"><defs><marker id="map-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#8a9198"/></marker><marker id="map-arrow-signal" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="oklch(0.58 0.20 30)"/></marker></defs>${ws}${bs}</svg>`;
}
