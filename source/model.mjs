// All amounts in cents. One deterministic model drives every figure, readout and caption.
// It is a teaching model: covered in-network care, no copays, one member, one plan year.

export function allocate({allowed=100000, deductibleRemaining=20000, coinsurance=0.2, oopRemaining=Infinity}={}) {
  if(!Number.isFinite(allowed)||allowed<0||!Number.isFinite(deductibleRemaining)||deductibleRemaining<0||!Number.isFinite(coinsurance)||coinsurance<0||coinsurance>1||oopRemaining<0||Number.isNaN(oopRemaining)) throw new RangeError('Invalid benefit inputs');
  const deductible=Math.min(allowed,Math.round(deductibleRemaining));
  const coinsuranceAmount=Math.round((allowed-deductible)*coinsurance);
  const member=Math.min(allowed,deductible+coinsuranceAmount,oopRemaining);
  return {allowed,deductible,coinsuranceAmount,member,plan:allowed-member};
}

// The persona's plan year. Dates are month indexes (0 = January). Amounts are synthetic.
// Each encounter lists the claims it produces: a professional claim, a facility claim, or both.
export const BENEFITS={deductible:200000,coinsurance:0.2,oopMax:500000};
export const ENCOUNTERS=[
  ...Array.from({length:12},(_,m)=>({id:'therapy'+m,kind:'therapy',month:m,label:'Video therapy',claims:[{form:'837P',who:'Therapist',billed:18000,allowed:12000,administrator:'Behavioral administrator'}]})),
  {id:'mri',kind:'mri',month:2,label:'Scheduled MRI',claims:[{form:'837I',who:'Hospital outpatient department',billed:240000,allowed:75000,administrator:'Medical administrator'},{form:'837P',who:'Radiologist',billed:60000,allowed:25000,administrator:'Medical administrator'}]},
  {id:'er',kind:'er',month:8,label:'Emergency visit',claims:[{form:'837I',who:'Hospital emergency department',billed:620000,allowed:220000,administrator:'Medical administrator'},{form:'837P',who:'Emergency physician',billed:95000,allowed:40000,administrator:'Medical administrator'}]}
];

// Runs the year in date order and returns every claim with its allocation and the running accumulators.
export function planYear({deductible=BENEFITS.deductible,coinsurance=BENEFITS.coinsurance,oopMax=BENEFITS.oopMax,encounters=ENCOUNTERS}={}){
  const order=[...encounters].sort((a,b)=>a.month-b.month||(a.kind==='therapy'?-1:1));
  let deductibleMet=0,oop=0;const rows=[];
  for(const e of order)for(const c of e.claims){
    const r=allocate({allowed:c.allowed,deductibleRemaining:Math.max(0,deductible-deductibleMet),coinsurance,oopRemaining:Math.max(0,oopMax-oop)});
    deductibleMet+=r.deductible;oop+=r.member;
    rows.push({encounter:e.id,kind:e.kind,month:e.month,label:e.label,form:c.form,who:c.who,administrator:c.administrator,billed:c.billed,allowed:c.allowed,writeOff:c.billed-c.allowed,...r,deductibleMet,oop});
  }
  const sum=k=>rows.reduce((t,r)=>t+r[k],0);
  return {rows,totals:{billed:sum('billed'),allowed:sum('allowed'),writeOff:sum('writeOff'),member:sum('member'),plan:sum('plan')},deductibleMet,oop,benefits:{deductible,coinsurance,oopMax}};
}
