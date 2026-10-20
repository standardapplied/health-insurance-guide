// Builds the data-driven HTML fragments for page.html from guide.mjs.
import * as g from './guide.mjs';
import {miniSvg,wrap} from './mapsvg.mjs';
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const em=([a,b,c])=>`${a}${b}${c}`;
export function fragments(links){
 const seatPages=g.seats.map((s,i)=>{
  const extra=s.id==='member'?`<div class="funding-row"><div><span class="eyebrow">WHO FUNDS THE CLAIMS</span><div class="segmented small" role="group" aria-label="Funding arrangement"><button type="button" data-funding="insured" aria-pressed="false">Fully insured</button><button type="button" data-funding="self" aria-pressed="true">Self-funded</button></div></div><div class="funding-summary compact" aria-live="polite"><h3 id="risk-name"></h3><p id="risk-copy"></p></div></div>`
   :s.id==='hospital'?twoClaims():s.id==='behavioral'?carveOut():s.id==='payer'?linesOfBusiness():'';
  return `<section class="chapter book-page seat-page" id="${s.id}" data-page-title="${esc(s.label)}" aria-labelledby="${s.id}-title">
 <div class="part-label">PART II · WHO IS AT THE TABLE</div>
 <div class="spread-grid wide">
  <div class="spread-copy"><h2 id="${s.id}-title">${em(s.headline)}</h2><p class="spread-lede">${s.lede}</p>
   <p class="builder"><span>For builders</span>${s.builder}</p>
   <details class="evidence"><summary>Sources</summary><p class="source-line">${links(s.sources)}</p></details>
  </div>
  <div class="spread-instrument"><div class="six">${s.six.map(([q,a])=>`<div><h4>${q}</h4><p>${a}</p></div>`).join('')}</div>${extra?`<div class="seat-extra">${extra}</div>`:''}</div>
 </div>
</section>`;}).join('\n');
 const incentives=g.incentives.items.map(([t,p,...src])=>`<article><h3>${t}</h3><p>${p}</p><p class="source-line">${links(src)}</p></article>`).join('');
 const layers=g.shape.history.layers.map(([y,t,p,...src])=>`<li><span>${y}</span><div><b>${t}</b> ${p} <span class="source-line inline">${links(src)}</span></div></li>`).join('');
 const shares=`<div class="bar" role="img" aria-label="${g.shape.coverage.shares.map(([l,v])=>`${l} ${v} percent`).join(', ')}">${g.shape.coverage.shares.map(([l,v,c])=>`<span style="flex:${v};background:${c}${c==='#fafbfc'?';border-left:1px solid var(--rule)':''}" title="${l} ${v}%"></span>`).join('')}</div><div class="legend">${g.shape.coverage.shares.map(([l,v,c])=>`<span><i style="background:${c};${c==='#fafbfc'?'border:1px solid var(--rule)':''}"></i>${l}<b>${v}%</b></span>`).join('')}</div><p class="footnote">${g.shape.coverage.note}</p>`;
 const seamButtons=g.seams.items.map((s,i)=>`<button type="button" data-seam="${s.id}" aria-pressed="${i===0}"><span>0${i+1}</span><br>${s.label}</button>`).join('');
 const buyerRows=g.buyers.rows.map(([a,b,c])=>`<tr><td>${a}</td><td>${b}</td><td>${c}</td></tr>`).join('');
 const calendar=g.buyers.calendar.map(([t,p])=>`<div><b>${t}</b>${p}</div>`).join('');
 const privacy=g.privacy.items.map(([t,p,src])=>`<div><h4>${t}</h4><p>${p}</p><p class="source-line">${links([src])}</p></div>`).join('');
 const integration=g.integration.items.map(([t,p],i)=>`<li><span>0${i+1}</span><div><h3>${t}</h3><p>${p}</p></div></li>`).join('');
 const card=`<div class="brand-line"><b class="field" data-field="brand">${g.card.brand}</b><span class="plan-name field" data-field="network">${g.card.plan}</span></div><div class="fields">${g.card.fields.filter(f=>!['brand','network','foot'].includes(f[0])).map(([id,label,value])=>`<div class="field" data-field="${id}" tabindex="0" role="button"><small>${label}</small><span>${value}</span></div>`).join('')}</div><div class="card-foot field" data-field="foot" tabindex="0" role="button"><span>${g.card.fields.find(f=>f[0]==='foot')[2]}</span></div>`;
 const moneyFigures=g.shape.money.figures.map(([n,t,src])=>`<div><strong>${n}</strong><small>${t} ${links([src])}</small></div>`).join('');
 const orgCards=g.organizations.cards.map(([t,p,src])=>`<div><h4>${t}</h4><p>${p}</p><p class="source-line">${links([src])}</p></div>`).join('');
 const encounterButtons=Object.entries(g.encounterSteps).map(([id,e],i)=>`<button type="button" data-encounter="${id}" aria-pressed="${i===1}">${e.title}</button>`).join('');
 return {SEAT_PAGES:seatPages,INCENTIVES:incentives,INCENTIVES_LEDE:g.incentives.lede,LAYERS:layers,SHARES:shares,SEAM_BUTTONS:seamButtons,BUYER_ROWS:buyerRows,CALENDAR:calendar,PRIVACY:privacy,INTEGRATION:integration,CARD:card,MONEY_FIGURES:moneyFigures,ORG_CARDS:orgCards,ENCOUNTER_BUTTONS:encounterButtons,SEATS_FIGURE:seatsFigure(),
  PERSONA_INTRO:`${g.persona.full} is ${g.persona.age}, a ${g.persona.role} at ${g.persona.employer}. ${g.persona.plan}`,PERSONA_YEAR:g.persona.year,COST_SOURCES:links(['glossary','eob','eligibility','payment','funding']),
  YEAR_HEADLINE:em(g.year.headline),YEAR_LEDE:g.year.lede,YEAR_LEDE2:g.year.lede2,YEAR_BUILDER:g.year.builder,YEAR_SOURCES:links(g.year.sources),
  WATERFALL_HEADLINE:em(g.waterfall.headline),WATERFALL_LEDE:g.waterfall.lede,WATERFALL_LEDE2:g.waterfall.lede2,WATERFALL_BUILDER:g.waterfall.builder,WATERFALL_SOURCES:links(g.waterfall.sources),
  COVERAGE_HEADLINE:em(g.shape.coverage.headline),COVERAGE_LEDE:g.shape.coverage.lede,COVERAGE_BUILDER:g.shape.coverage.builder,COVERAGE_NOTE:g.shape.coverage.note,COVERAGE_SOURCES:links(g.shape.coverage.sources),
  HISTORY_HEADLINE:em(g.shape.history.headline),HISTORY_LEDE:g.shape.history.lede,HISTORY_BUILDER:g.shape.history.builder,HISTORY_SOURCES:links(g.shape.history.sources),
  MONEY_HEADLINE:em(g.shape.money.headline),MONEY_LEDE:g.shape.money.lede,MONEY_LEDE2:g.shape.money.lede2,MONEY_BUILDER:g.shape.money.builder,MONEY_SOURCES:links(g.shape.money.sources),
  ORG_LEDE:g.organizations.lede,ORG_BUILDER:g.organizations.builder,SEAMS_LEDE:g.seams.lede,SEAMS_BUILDER:g.seams.builder,
  BUYERS_LEDE:g.buyers.lede,BUYERS_BUILDER:g.buyers.builder,BUYERS_SOURCES:links(g.buyers.sources),
  PRIVACY_LEDE:g.privacy.lede,PRIVACY_BUILDER:g.privacy.builder,PRIVACY_SOURCES:links(g.privacy.sources),
  INTEGRATION_LEDE:g.integration.lede,INTEGRATION_SOURCES:links(g.integration.sources),
  CARD_SOURCES:links(['kff','funding','ncpdpcard','identifiers'])};
}
// Four seats around the claim exchange. Edges carry a contract label; the live script highlights a seat.
function seatsFigure(){
 const W=640,H=372,BW=200;
 const box=(id,x,y,w,title,kind,on)=>{const ks=wrap(kind,w-24,5.9);const h=46+ks.length*11;return {id,x,y,w,h,svg:`<g data-seat="${id}" tabindex="0" role="button" aria-label="${title}"><rect class="map-box ${on?'on':''}" x="${x}" y="${y}" width="${w}" height="${h}" rx="2"/><text class="map-title" x="${x+12}" y="${y+22}">${title}</text>${ks.map((l,i)=>`<text class="map-kind" x="${x+12}" y="${y+38+i*11}">${l}</text>`).join('')}</g>`};};
 const member=box('member',24,26,BW,'Member + employer','THE COVERED PERSON · THE SPONSOR');
 const payer=box('payer',416,26,BW,'Payer / administrator','INSURER · ASO · PBM');
 const providers=box('provider',220,286,BW,'Providers','PRACTICE · HOSPITAL · THERAPIST');
 const claim=box('exchange',248,152,144,'The claim','INFORMATION · MONEY');
 const my=member.y+member.h/2;
 const wires=[
  ['member-payer',`M${member.x+BW} ${my} L${payer.x} ${my}`],
  ['payer-provider',`M${payer.x+BW/2} ${payer.y+payer.h} C${payer.x+BW/2} 200 ${providers.x+BW-30} 200 ${providers.x+BW-30} ${providers.y}`],
  ['member-provider',`M${member.x+BW/2} ${member.y+member.h} C${member.x+BW/2} 200 ${providers.x+30} 200 ${providers.x+30} ${providers.y}`]];
 const label=(edge,x,y,anchor,text)=>{const tw=text.length*6.2+10;const lx=anchor==='middle'?x-tw/2:anchor==='start'?x:x-tw;return `<rect x="${lx}" y="${y-9}" width="${tw}" height="15" rx="2" fill="var(--paper)"/><text class="map-edge-label" data-edge="${edge}" x="${x}" y="${y+2}" text-anchor="${anchor}">${text}</text>`;};
 const labels=[label('member-payer',320,my-12,'middle','premium · contribution →'),label('member-payer',320,my+14,'middle','← card · EOB'),
  label('payer-provider',498,186,'start','claims ↑'),label('payer-provider',498,202,'start','remittance · funds ↓'),
  label('member-provider',142,186,'end','care ↑'),label('member-provider',142,202,'end','cost sharing ↓')].join('');
 return `<svg viewBox="0 0 ${W} ${H}" class="orgmap" role="group" aria-label="Three seats around the claim: member and employer, payer and administrator, providers"><defs><marker id="seat-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="#8a9198"/></marker></defs>${wires.map(([id,d])=>`<path class="map-edge" data-edge="${id}" d="${d}"/>`).join('')}${labels}${member.svg}${payer.svg}${providers.svg}${claim.svg}</svg>`;
}
function twoClaims(){
 return miniSvg({label:'One hospital visit produces a facility claim from the hospital and a professional claim from the clinician, both sent to the same administrator',
  boxes:[{id:'visit',x:10,y:46,w:130,title:'One visit',kind:'MRI · EMERGENCY'},{id:'fac',x:190,y:6,w:170,title:'Facility claim',kind:'HOSPITAL · UB-04 / 837I',on:true},{id:'pro',x:190,y:92,w:170,title:'Professional claim',kind:'CLINICIAN · CMS-1500 / 837P'},{id:'adm',x:400,y:46,w:112,title:'Administrator',kind:'TWO REMITTANCES'}],
  wires:[['visit','r','fac','l'],['visit','r','pro','l'],['fac','r','adm','l'],['pro','r','adm','l']]});
}
function carveOut(){
 return miniSvg({label:'The card carries one brand; medical claims go to the medical administrator and behavioral claims go to a separate behavioral administrator, each with its own network',
  boxes:[{id:'card',x:10,y:46,w:120,title:'One card',kind:'ONE BRAND'},{id:'med',x:180,y:6,w:170,title:'Medical administrator',kind:'DOCTOR · HOSPITAL · PAYER ID A'},{id:'beh',x:180,y:92,w:170,title:'Behavioral administrator',kind:'THERAPIST · PAYER ID B',on:true},{id:'mn',x:400,y:6,w:112,title:'Medical network',kind:'CONTRACT A'},{id:'bn',x:400,y:92,w:112,title:'Behavioral network',kind:'CONTRACT B'}],
  wires:[['card','r','med','l'],['card','r','beh','l','dashed'],['med','r','mn','l'],['beh','r','bn','l','dashed']]});
}
function linesOfBusiness(){
 const rows=[['Commercial, fully insured','Premium from the employer or individual','Keeps premium, bears claims risk, bound by the loss ratio','State insurance departments; CMS for ACA rules'],['Commercial, self-funded','Administrative fee per member from the employer','Administers; the employer bears risk','DOL under ERISA'],['Medicare Advantage','Risk-adjusted payment per member from CMS','Bears risk; earns Star rating bonuses','CMS'],['Medicaid managed care','Capitation per member from the state','Bears risk under the state contract','The state Medicaid agency; CMS'],['Marketplace individual','Premium plus federal subsidies','Keeps premium, bears risk, bound by the loss ratio','CMS and state Marketplaces']];
 return `<table class="lob"><thead><tr><th>Line of business</th><th>How it is paid</th><th>Role</th><th>Regulator</th></tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
}
