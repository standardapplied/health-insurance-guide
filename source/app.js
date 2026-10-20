const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const still=matchMedia('(prefers-reduced-motion:reduce)');
const sourceLinks=ids=>ids.map(id=>`<a href="${DATA.sources[id][2]}" target="_blank" rel="noopener">${DATA.sources[id][0]} ↗</a>`).join(' ');
const money=c=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(c/100);
const MONTHS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],FULL=['January','February','March','April','May','June','July','August','September','October','November','December'];
const press=(sel,on)=>$$(sel).forEach(b=>b.setAttribute('aria-pressed',String(on(b))));

// Definitions in context: the first use of a glossary term on each page opens a popover.
const TERM_SKIP=new Set(['Claim','Provider','Member / enrollee','Group','Insurer / carrier','HMO / PPO / EPO / POS','Subscriber / dependent']);
const TERMS=DATA.terms.map(([term,desc,source],i)=>{const names=term.split(' / ').map(t=>t.trim());const aliases={'Plan administrator':['administrator'],'ERA / remittance':['remittance','remittance advice','ERA'],'Self-funded / self-insured':['self-funded','self-insured','self-fund'],'Copay / coinsurance':['coinsurance','copay'],'BlueCard Home / Host':['BlueCard'],'Payer / payor':['payer','payor'],'TPA / ASO':['TPA','ASO','administrative services'],'Summary plan description / SBC':['summary plan description','SBC','summary of benefits and coverage'],'BIN / PCN':['BIN','PCN'],'Days in A/R':['days in A/R','accounts receivable'],'Out-of-pocket maximum':['out-of-pocket maximum','out-of-pocket'],'Prior authorization':['prior authorization','authorization'],'Medical loss ratio':['medical loss ratio','loss ratio','loss-ratio'],'Coordination of benefits':['coordination of benefits'],'Place of service':['place of service'],'Good-faith estimate':['good-faith estimate'],'Star ratings':['Star ratings','Star rating'],'Covered entity':['covered entity','covered entities'],'Business associate':['business associate'],'Behavioral administrator':['behavioral administrator'],'Integrated system':['integrated system'],'Professional claim':['professional claim'],'Institutional claim':['institutional claim','facility claim'],'Contractual adjustment':['contractual adjustment','write-off','written off'],'Allowed amount':['allowed amount'],'Billed charge':['billed charge','billed amount'],'Fee schedule':['fee schedule'],'Facility fee':['facility fee'],'Observation status':['observation status','observation'],'Risk adjustment':['risk adjustment','risk-adjusted'],'Encounter data':['encounter data'],'Payer ID':['payer ID'],'Plan sponsor':['plan sponsor','sponsor'],'Group health plan':['group health plan'],'Provider network':['provider network','network'],'Carve-out':['carve-out','carved out','carves'],'Stop loss':['stop loss','stop-loss'],'Fully insured':['fully insured'],'Accumulator':['accumulators','accumulator']}[term]||names;return {i,term,desc,source,names:aliases.filter(a=>!TERM_SKIP.has(term))};}).filter(t=>t.names.length);
const TERM_RX=TERMS.flatMap(t=>t.names.map(n=>({t,rx:new RegExp('(^|[^\\w-])('+n.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'s?)(?![\\w-])','i')})));
function markTerms(root,{scope,skip}={}){
 if(!root)return;const page=root.closest('.book-page');if(!page||page.id==='sources')return;
 if(page.id==='language'&&!scope)return;const holder=scope||page;const seen=holder._terms||(holder._terms=new Set());if(skip!=null)seen.add(skip);
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:n=>{const el=n.parentElement;if(!el||el.closest('h1,h2,h3,h4,button,label,a,.term,.section-label,.eyebrow,.source-line,.id-card,.figure-top,.map-kind,.map-edge-label,svg,dialog,.year-month,.lob th,.reads,.step-index,.key-hint'))return NodeFilter.FILTER_REJECT;return n.nodeValue.trim().length>3?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;}});
 const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
 for(const node of nodes){let text=node.nodeValue;const frag=document.createDocumentFragment();let changed=false;
  for(let guard=0;guard<6;guard++){let best=null;for(const {t,rx}of TERM_RX){if(seen.has(t.i))continue;const m=rx.exec(text);if(m&&(!best||m.index<best.m.index))best={t,m};}
   if(!best)break;const {t,m}=best;const start=m.index+m[1].length;frag.appendChild(document.createTextNode(text.slice(0,start)));const b=document.createElement('span');b.className='term';b.setAttribute('role','button');b.tabIndex=0;b.dataset.term=t.i;b.textContent=m[2];frag.appendChild(b);text=text.slice(start+m[2].length);seen.add(t.i);changed=true;}
  if(changed){frag.appendChild(document.createTextNode(text));node.replaceWith(frag);}}
}
const pop=$('#term-pop');
function showPop(anchor,key,title,body,link){$('#term-pop-title').textContent=title;$('#term-pop-body').textContent=body;const l=$('#term-pop-link');l.hidden=!link;if(link)l.innerHTML=link;pop.hidden=false;
 const r=anchor.getBoundingClientRect(),w=Math.min(340,innerWidth-24);pop.style.width=w+'px';let x=Math.max(12,Math.min(r.left,innerWidth-w-12)),y=r.bottom+8;if(y+pop.offsetHeight>innerHeight-12)y=Math.max(12,r.top-pop.offsetHeight-8);pop.style.left=x+'px';pop.style.top=y+'px';pop.dataset.for=key;}
function showTerm(btn){const t=TERMS.find(x=>x.i===Number(btn.dataset.term));if(!t)return;showPop(btn,'term:'+btn.dataset.term,t.term,t.desc,`${sourceLinks([t.source])} <span>· all terms →</span>`);}
function showEncounterInfo(btn){const e=DATA.encounters[encounter];showPop(btn,'encounter:'+encounter,e.title,e.summary,'');}
function popToggle(b,key,show){if(!pop.hidden&&pop.dataset.for===key){pop.hidden=true;return;}show(b);}
document.addEventListener('click',e=>{const b=e.target.closest('.term');if(b){e.preventDefault();popToggle(b,'term:'+b.dataset.term,showTerm);return;}const i=e.target.closest('#encounter-info');if(i){popToggle(i,'encounter:'+encounter,showEncounterInfo);return;}if(!e.target.closest('#term-pop'))pop.hidden=true;});
document.addEventListener('keydown',e=>{if(e.key==='Escape')pop.hidden=true;const b=e.target.closest&&e.target.closest('.term');if(b&&(e.key==='Enter'||e.key===' ')){e.preventDefault();showTerm(b);}});
$('#term-pop-close').addEventListener('click',()=>pop.hidden=true);
addEventListener('hashchange',()=>pop.hidden=true);
$$('.book-page').forEach(p=>markTerms(p));
// Glossary entries cross-link: each definition marks the other terms it uses.
$$('#glossary details').forEach(d=>{const own=TERMS.find(t=>t.term===d.querySelector('summary').textContent.trim());markTerms(d.querySelector('p'),{scope:d,skip:own?own.i:null});});

// § 02 Cost sharing: one claim, one slider.
function oneClaim(){const d=Number($('#one-deductible').value)*100;const r=allocate({allowed:100000,deductibleRemaining:d});$('#one-deductible-value').value=money(d);$('#one-member').textContent=money(r.member);$('#one-plan').textContent=money(r.plan);$('#one-member-math').textContent=`${money(r.deductible)} deductible + ${money(r.coinsuranceAmount)} coinsurance`;$('#one-member-bar').style.width=(r.member/1000)+'%';$('#one-plan-bar').style.width=(r.plan/1000)+'%';$('.split-bar.big').setAttribute('aria-label',`Maya pays ${money(r.member)}. The plan pays ${money(r.plan)}.`);
 $('#one-explainer').textContent=r.deductible===100000?'The whole allowed amount falls inside the deductible, so Maya pays all $1,000 and the plan pays nothing.':r.deductible===0?'The deductible is met, so Maya pays 20% coinsurance, $200, and the plan pays $800.':`Maya pays the ${money(r.deductible)} of deductible still open, then 20% of the ${money(100000-r.deductible)} that remains. The plan pays the other 80%.`;}
$('#one-deductible').addEventListener('input',oneClaim);oneClaim();

// § 01 The card
function chooseField(id){
 const f=DATA.card.find(x=>x[0]===id);if(!f)return;
 $$('#id-card .field').forEach(el=>el.classList.toggle('on',el.dataset.field===id));
 $('#card-reading').innerHTML=`<span class="eyebrow">${f[1]}</span><h3>${f[2]}</h3><p>${f[3]}</p><p class="reads">Read by: ${f[4]}</p><p class="tech"><span>Builder’s detail</span>${DATA.cardTech[id]}</p><p class="source-line">${sourceLinks(f.slice(5))}</p>`;markTerms($('#card-reading'));
}
$$('#id-card .field').forEach(el=>{el.addEventListener('click',()=>chooseField(el.dataset.field));el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();chooseField(el.dataset.field);}});});
chooseField('brand');

// § 02 The plan year. One model drives the months, the meters, the totals and the counter tray.
let mriMonth=2,funding='self';
function yearModel(){
 const encounters=DATA.encounterList.map(e=>e.kind==='mri'?{...e,month:mriMonth}:e);
 return planYear({deductible:Number($('#deductible').value)*100,encounters});
}
function renderYear(){
 const y=yearModel();
 $('#deductible-value').value=money(y.benefits.deductible);
 $('#year-benefits').textContent=`DEDUCTIBLE ${money(y.benefits.deductible)} · COINSURANCE 20% · OOP MAX ${money(y.benefits.oopMax)}`;
 const byMonth=MONTHS.map((_,m)=>y.rows.filter(r=>r.month===m));
 $('#year-months').innerHTML=byMonth.map((rows,m)=>{const member=rows.reduce((t,r)=>t+r.member,0),plan=rows.reduce((t,r)=>t+r.plan,0);const kinds=[...new Set(rows.map(r=>r.kind))];
  return `<div class="year-month" role="listitem" aria-label="${MONTHS[m]}: Maya pays ${money(member)}, the plan pays ${money(plan)}"><small>${MONTHS[m].toUpperCase()}</small>${kinds.map(k=>`<span class="mark ${k}" title="${k}"></span>`).join('')}<span class="pay">${money(member)}</span><span class="pay plan">${plan?money(plan):''}</span></div>`;}).join('');
 $('#legend-mri').textContent=FULL[mriMonth];
 $('#meter-deductible').textContent=`${money(y.deductibleMet)} of ${money(y.benefits.deductible)}`;
 $('#bar-deductible').style.width=(y.benefits.deductible?Math.min(100,y.deductibleMet/y.benefits.deductible*100):100)+'%';
 $('#meter-oop').textContent=`${money(y.oop)} of ${money(y.benefits.oopMax)}`;
 $('#bar-oop').style.width=Math.min(100,y.oop/y.benefits.oopMax*100)+'%';
 $('#total-billed').textContent=money(y.totals.billed);$('#total-allowed').textContent=money(y.totals.allowed);$('#total-member').textContent=money(y.totals.member);$('#total-plan').textContent=money(y.totals.plan);
 const mri=y.rows.filter(r=>r.kind==='mri');const r={allowed:mri.reduce((t,x)=>t+x.allowed,0),member:mri.reduce((t,x)=>t+x.member,0),plan:mri.reduce((t,x)=>t+x.plan,0),deductible:mri.reduce((t,x)=>t+x.deductible,0),coinsuranceAmount:mri.reduce((t,x)=>t+x.coinsuranceAmount,0)};
 $('#member-amount').textContent=money(r.member);$('#plan-amount').textContent=money(r.plan);
 $('#member-math').textContent=`${money(r.deductible)} deductible + ${money(r.coinsuranceAmount)} coinsurance`;
 $('#funding-label').textContent=funding==='insured'?'THE INSURER PAYS':'THE EMPLOYER PLAN PAYS';$('#plan-math').textContent=funding==='insured'?'Paid from insurer funds':'Funded by the employer plan';
 const before=y.rows.filter(x=>x.month<mriMonth||(x.month===mriMonth&&x.kind==='therapy')).reduce((t,x)=>t+x.deductible,0);
 $('#calculation').textContent=r.deductible===r.allowed?`In ${FULL[mriMonth]}, ${money(y.benefits.deductible-before)} of the deductible remains, so the whole $1,000 is Maya’s.`:r.deductible===0?`By ${FULL[mriMonth]} the deductible is met. Maya pays 20% coinsurance, ${money(r.member)}; the plan pays ${money(r.plan)}.`:`In ${FULL[mriMonth]}, ${money(r.deductible)} of deductible remains. Maya pays that plus 20% of the rest: ${money(r.member)}.`;
 document.dispatchEvent(new CustomEvent('allocation-change',{detail:r}));
 renderBill(y);
}
$('#deductible').addEventListener('input',renderYear);
$$('[data-mri]').forEach(b=>b.addEventListener('click',()=>{mriMonth=Number(b.dataset.mri);press('[data-mri]',x=>x===b);renderYear();}));

// § 04 The bill: billed, allowed, member, plan, write-off for one encounter.
let billEncounter='mri';
function renderBill(y=yearModel()){
 const rows=y.rows.filter(r=>r.kind===billEncounter);const first=billEncounter==='therapy'?[rows[0]]:rows;
 const sum=k=>first.reduce((t,r)=>t+r[k],0);const billed=sum('billed'),allowed=sum('allowed'),member=sum('member'),plan=sum('plan'),write=billed-allowed;
 const bars=[['Billed charge',billed,''],['Allowed amount',allowed,''],['Maya pays',member,'member'],['Plan pays',plan,'plan'],['Write-off',write,'write']];
 $('#waterfall').innerHTML=bars.map(([l,v,c])=>`<div><span class="amount">${money(v)}</span><div class="bar ${c}" style="height:${Math.max(2,v/billed*100)}%"></div><span class="lab">${l}</span></div>`).join('');
 $('#waterfall').setAttribute('aria-label',bars.map(([l,v])=>`${l} ${money(v)}`).join('. '));
 const label={therapy:'one January therapy session',mri:`the ${FULL[mriMonth]} MRI, facility and radiologist together`,er:'the September emergency visit, facility and physician together'}[billEncounter];
 $('#bill-explainer').textContent=`For ${label}: providers billed ${money(billed)}, the plan allowed ${money(allowed)}, Maya owes ${money(member)} and the plan pays ${money(plan)}. The remaining ${money(write)} is a contractual adjustment that nobody pays.`;
}
$$('[data-bill]').forEach(b=>b.addEventListener('click',()=>{billEncounter=b.dataset.bill;press('[data-bill]',x=>x===b);renderBill();}));

// § 05 Four seats
const seatCopy={member:['Member + employer','Pays premium contributions in and cost sharing out; receives care, the card and an explanation of benefits. The employer behind the member holds the contract with the payer and, when self-funded, the money.'],payer:['Payer / administrator','Receives premium or an administrative fee and every claim; sends eligibility answers, authorizations, remittances and, when it bears the risk, the funds.'],provider:['Providers','Send eligibility inquiries, authorization requests and claims; receive remittances, funds and the patient’s cost sharing. Three shapes: a practice, a hospital and a therapist on a video call.'],exchange:['The claim','The artifact that crosses every contract. Information travels one way (claim, remittance, EOB) and money the other (premium, funds, cost sharing).']};
function chooseSeat(id){
 $$('.seats-figure [data-seat]').forEach(g=>g.classList.toggle('on',g.dataset.seat===id));
 $$('.seats-figure [data-edge]').forEach(e=>e.classList.toggle('on',id==='exchange'||e.dataset.edge.split('-').includes(id)));
 $('#seat-name').textContent=seatCopy[id][0].toUpperCase();$('#seat-copy').textContent=seatCopy[id][1];markTerms($('#seat-copy'));
}
$$('.seats-figure [data-seat]').forEach(g=>{g.addEventListener('click',()=>chooseSeat(g.dataset.seat));g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();chooseSeat(g.dataset.seat);}});});
chooseSeat('exchange');

// Funding switch: used on the member page and the money loop.
function chooseFunding(id){funding=id;
 press('button[data-funding]',b=>b.dataset.funding===id);
 $$('.cover-instrument,.pool-figure').forEach(el=>el.dataset.funding=id);
 if($('#risk-name')){$('#risk-name').textContent=id==='insured'?'The insurer':'The employer plan';$('#risk-copy').textContent=id==='insured'?'The employer buys a policy. The insurer keeps the premium and bears the covered claims risk, within the medical loss ratio rules.':'The employer keeps the money and pays claims itself, hiring the administrator for a fee and buying stop-loss insurance for the largest claims. Maya’s plan works this way.';}
 document.dispatchEvent(new CustomEvent('funding-change',{detail:id}));
 renderYear();
}
$$('button[data-funding]').forEach(b=>b.addEventListener('click',()=>chooseFunding(b.dataset.funding)));

// § 12 Coverage routes
function chooseCoverage(id){
 const c=DATA.coverage.find(x=>x.id===id);
 press('[data-coverage]',b=>b.dataset.coverage===id);
 $('#coverage-panel').innerHTML=`<div><span class="eyebrow">${c.tag}</span><h3>${c.heading}</h3><p>${c.text}</p><p class="source-line">${sourceLinks(c.source)}</p></div><div class="route">${c.route.map((s,i)=>`<div class="route-item"><span>0${i+1}</span><span>${s}</span></div>`).join('')}<small>${c.detail}</small></div>`;markTerms($('#coverage-panel'));
}
$$('[data-coverage]').forEach(b=>b.addEventListener('click',()=>chooseCoverage(b.dataset.coverage)));chooseCoverage('employer');

// § 15 Organizations
function chooseMap(id){
 const m=DATA.maps.find(x=>x.id===id);
 press('[data-map]',b=>b.dataset.map===id);
 $('#map-title').textContent=m.title;$('#map-intro').textContent=m.intro;$('#map-details-intro').textContent=m.intro;
 $('#map-diagram').innerHTML=DATA.diagrams[id];
 const svg=$('#map-diagram svg');svg.setAttribute('role','img');
 svg.setAttribute('aria-label',m.title+'. '+m.edges.map(([a,b,label])=>m.nodes.find(n=>n[0]===a)[1].replaceAll('<br>',' ')+' '+label+' '+m.nodes.find(n=>n[0]===b)[1].replaceAll('<br>',' ')).join('. '));
 const typeNames={license:'Trademark licenses',portfolio:'Business portfolios',service:'Service agreements',ownership:'Ownership'};
 const types=[...new Set(m.edges.map(e=>e[3]))];
 $('#map-filters').innerHTML=types.length>1?['all',...types].map(type=>`<button type="button" data-relation="${type}" aria-pressed="${type==='all'}">${type==='all'?'All relationships':typeNames[type]}</button>`).join(''):'';
 const node=id=>m.nodes.find(n=>n[0]===id);
 $('#mobile-relationships').innerHTML=`<p class="mobile-map-date">Public filings and company websites, checked October 19, 2026.</p>`+m.edges.map(([a,b,label,type])=>`<div class="relationship" data-relation-type="${type}"><span>${node(a)[1].replaceAll('<br>',' ')}<em>${node(a)[2]}</em></span><small>↓ ${label}</small><span>${node(b)[1].replaceAll('<br>',' ')}<em>${node(b)[2]}</em></span></div>`).join('');
 function filterRelationships(type){
  const connected=new Set();let count=0;
  m.edges.forEach(([a,b,label,t],i)=>{const on=type==='all'||t===type;if(on){connected.add(a);connected.add(b);count++;}const edge=svg.querySelector(`[data-cell-id="edge${i}"]`);if(edge)edge.style.opacity=on?'1':'.12';});
  m.nodes.forEach(([id])=>{const n=svg.querySelector(`[data-cell-id="${id}"]`);if(n)n.style.opacity=connected.has(id)?'1':'.25';});
  $$('#mobile-relationships [data-relation-type]').forEach(row=>row.hidden=type!=='all'&&row.dataset.relationType!==type);
  press('[data-relation]',b=>b.dataset.relation===type);
  $('#map-filter-status').textContent=`${count} ${count===1?'relationship':'relationships'}${type==='all'?' shown':' · '+typeNames[type].toLowerCase()}`;
 }
 $$('[data-relation]').forEach(b=>b.addEventListener('click',()=>filterRelationships(b.dataset.relation)));filterRelationships('all');
 $('#map-legend').textContent=m.legend;
 $('#map-facts').innerHTML=m.facts.map(([title,text,...src])=>`<div><h4>${title}</h4><p>${text}</p><p class="source-line">${sourceLinks(src)}</p></div>`).join('');
 $('#map-sources').innerHTML=sourceLinks(m.source);
 $('#map-diagram').scrollLeft=0;markTerms($('#map-facts'));markTerms($('#map-intro'));
}
$$('[data-map]').forEach(b=>b.addEventListener('click',()=>chooseMap(b.dataset.map)));chooseMap('blues');

// § 03 One claim path, three encounters
let step=0,encounter='mri';
function chooseEncounter(id){encounter=id;press('[data-encounter]',b=>b.dataset.encounter===id);$('#encounter-summary').textContent=DATA.encounters[id].summary;pop.hidden=true;chooseStep(step);}
function chooseStep(i){
 step=Math.min(DATA.steps.length-1,Math.max(0,i));const s=DATA.encounters[encounter].steps[step];
 press('[data-step]',b=>Number(b.dataset.step)===step);
 $('#step-index').textContent=`STEP ${String(step+1).padStart(2,'0')} / 06`;
 $('#claim-artifact').textContent=s.artifact;$('#claim-title-live').textContent=DATA.steps[step];$('#claim-copy').textContent=s.text;
 $('#claim-source').innerHTML=sourceLinks(DATA.stepSources[step]);$('#tx-from').textContent=s.from;$('#tx-to').textContent=s.to;$('#tx-artifact').textContent=s.artifact;
 $('.transaction-rail>span').textContent=step<2?'↕':'↓';$('#technical-code').textContent=s.code;$('#technical-copy').textContent=`Transaction or workflow for this stage: ${s.code}.`;markTerms($('.claim-story'));
 document.dispatchEvent(new CustomEvent('claim-stage',{detail:step}));
 $('#previous').disabled=step===0;$('#next').disabled=step===DATA.steps.length-1;
}
$$('[data-encounter]').forEach(b=>b.addEventListener('click',()=>chooseEncounter(b.dataset.encounter)));
$$('[data-step]').forEach(b=>b.addEventListener('click',()=>chooseStep(Number(b.dataset.step))));
$('#previous').addEventListener('click',()=>chooseStep(step-1));$('#next').addEventListener('click',()=>chooseStep(step+1));
function technical(){const on=$('#technical').checked;$('#technical-panel').hidden=!on;document.documentElement.classList.toggle('builder-detail',on);}
$('#technical').addEventListener('change',technical);chooseEncounter('mri');technical();

// § 16 The seams
function chooseSeam(id){
 const s=DATA.seams.find(x=>x.id===id);press('[data-seam]',b=>b.dataset.seam===id);
 $('#seam-panel').innerHTML=`<div><span class="eyebrow">SEAM ${String(DATA.seams.indexOf(s)+1).padStart(2,'0')}</span><h3>${s.label}</h3><p>${s.text}</p><p class="source-line">${sourceLinks(s.sources)}</p></div><dl class="seam-facts"><div><dt>Who buys</dt><dd>${s.buyer}</dd></div><div><dt>Measure</dt><dd>${s.measure}</dd></div><div><dt>Standard</dt><dd>${s.standard}</dd></div><div><dt>Rule</dt><dd>${s.rule}</dd></div></dl>`;markTerms($('#seam-panel'));
}
$$('[data-seam]').forEach(b=>b.addEventListener('click',()=>chooseSeam(b.dataset.seam)));chooseSeam('enroll');

// § 20 Terms
function filterTerms(){
 const q=$('#term-search').value.trim().toLowerCase();let n=0;
 $$('#glossary details').forEach(d=>{const on=!q||d.textContent.toLowerCase().includes(q);d.hidden=!on;if(on)n++;});
 $('#term-count').textContent=`${n} ${n===1?'term':'terms'}`;$('#no-terms').hidden=n>0;
}
$('#term-search').addEventListener('input',filterTerms);filterTerms();
chooseFunding('self');
