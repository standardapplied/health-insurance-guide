import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {sources,coverage,maps,glossary} from './source/data.mjs';
import * as guide from './source/guide.mjs';
import {allocate,planYear,BENEFITS,ENCOUNTERS} from './source/model.mjs';
import {allocationTray} from './source/mechanisms.mjs';
import {register,claimLine,cistern,registerPose,linePose,cisternPose} from './source/machines.mjs';
import {mapSvg} from './source/mapsvg.mjs';
import {fragments} from './source/render.mjs';
const read=p=>readFileSync(new URL(p,import.meta.url),'utf8');
const missing=new Set();
const links=ids=>ids.map(id=>{if(!sources[id]){missing.add(id);return '';}return `<a href="${sources[id][2]}" target="_blank" rel="noopener">${sources[id][0]} ↗</a>`;}).join(' ');
const f=register(),allocationFigure=allocationTray(),claimFigure=claimLine(),poolFigure=cistern();
// Newsreader and JetBrains Mono are embedded (SIL Open Font License, see assets/fonts). Switzer is
// loaded from standardapplied.com at runtime and falls back to the system sans; its license does not
// permit redistributing the files.
const SITE='https://standardapplied.com/guides/us-health-insurance/';
const fonts=[['Newsreader','assets/fonts/newsreader-latin-wght-normal.woff2','100 900'],['JetBrains Mono','assets/fonts/jetbrains-mono-latin-wght-normal.woff2','100 800']].map(([name,path,weight])=>`@font-face{font-family:'${name}';src:url(data:font/woff2;base64,${readFileSync(new URL(path,import.meta.url)).toString('base64')}) format('woff2');font-weight:${weight};font-style:normal;font-display:swap}`).join('')+[400,500].map(w=>`@font-face{font-family:'Switzer';src:url(https://standardapplied.com/fonts/switzer-${w}.woff2) format('woff2');font-weight:${w};font-style:normal;font-display:swap}`).join('');
const meta=`<link rel="canonical" href="${SITE}"><link rel="icon" type="image/svg+xml" href="https://standardapplied.com/favicon.svg"><link rel="icon" type="image/png" sizes="32x32" href="https://standardapplied.com/favicon-32.png"><link rel="apple-touch-icon" href="https://standardapplied.com/apple-touch-icon.png"><script defer src="https://cloud.umami.is/script.js" data-website-id="d841a4ff-11a3-4680-afff-fb797bdf3505" data-domains="standardapplied.com"></script><meta property="og:type" content="website"><meta property="og:title" content="US health insurance · a field guide for people building healthcare software"><meta property="og:description" content="Follow one member through a plan year, sit in each seat at the table, and find where your product attaches. Open source."><meta property="og:url" content="${SITE}"><meta property="og:image" content="${SITE}share-image.png"><meta property="og:image:width" content="2400"><meta property="og:image:height" content="1260"><meta property="og:image:alt" content="US health insurance: an interactive field guide for people building healthcare software"><meta name="twitter:card" content="summary_large_image">`;
const diagrams=Object.fromEntries(maps.map(m=>[m.id,mapSvg(m)]));
mkdirSync(new URL('diagrams/',import.meta.url),{recursive:true});mkdirSync(new URL('qa/',import.meta.url),{recursive:true});
for(const m of maps)writeFileSync(new URL(`diagrams/${m.id}.svg`,import.meta.url),diagrams[m.id]);
const steps=['Eligibility','Authorization','Care','Claim','Adjudication','Payment'];
const stepSources=[['eligibility','enrollment'],['authorization','priorauth','api'],['provider','cms1500'],['claims','status','ub04'],['payment','eob','nsa'],['payment','eob','idr']];
const termData=glossary.map(([term,cat,desc,source])=>[term,desc,source]);
const data={sources,coverage,maps,steps,stepSources,terms:termData,cardTech:guide.cardTech,encounters:guide.encounterSteps,card:guide.card.fields,seats:guide.seats.map(s=>({id:s.id,label:s.label,short:s.short,lede:s.lede})),seams:guide.seams.items,benefits:BENEFITS,encounterList:ENCOUNTERS,mechanisms:{cover:f.vectors,allocation:allocationFigure.vectors,claim:claimFigure.vectors,pool:poolFigure.vectors},diagrams};
const buttons=(arr,attr)=>arr.map((c,i)=>`<button type="button" data-${attr}="${c.id??i}" aria-pressed="${i===0}">${c.label??c.title}</button>`).join('');
const terms=glossary.map(([term,cat,desc,source])=>`<details><summary>${term}</summary><span class="term-category">${cat}</span><p>${desc}</p><p class="source-line">${links([source])}</p></details>`).join('');
const refs=Object.entries(sources).map(([id,[who,title,url]])=>`<li id="source-${id}"><a href="${url}" target="_blank" rel="noopener">${title}</a><span>${who}</span></li>`).join('');
let page=read('source/page.html');
const replacements={...fragments(links),META:meta,CSS:read('vendor/anatomy/kit/iso.css')+'\n'+read('source/style.css').replace('__FONTS__',fonts),FIGURE:f.svg,ALLOCATION_FIGURE:allocationFigure.svg,CLAIM_FIGURE:claimFigure.svg,POOL_FIGURE:poolFigure.svg,COVERAGE_BUTTONS:buttons(coverage,'coverage'),MAP_BUTTONS:buttons(maps,'map'),STEP_BUTTONS:steps.map((s,i)=>`<button type="button" data-step="${i}" aria-pressed="${i===0}"><span>0${i+1}</span>${s}<small>${['the scanner','the stamp press','the pen','the feed rollers','the gauge','the pay station'][i]}</small></button>`).join(''),GLOSSARY:terms,SOURCES:refs,BLUECARD_SOURCE:links(['bluecard']),CLAIM_DETAIL_SOURCES:links(['claims','dol','denials']),DATA:'const DATA='+JSON.stringify(data).replaceAll('</script','<\\/script')+';\nconst BENEFITS=DATA.benefits,ENCOUNTERS=DATA.encounterList;\n'+allocate.toString()+'\n'+planYear.toString()+'\n'+registerPose.toString()+'\n'+linePose.toString()+'\n'+cisternPose.toString()+'\nconst ease=(u,a,b)=>{const x=Math.max(0,Math.min(1,(u-a)/(b-a)));return x*x*(3-2*x);};const tri=(p,c,w)=>Math.max(0,1-Math.abs(p-c)/w);',APP:read('source/app.js')+'\n'+read('source/reader.js')+'\n'+read('source/animation.js')};
for(const [key,value]of Object.entries(replacements))page=page.replaceAll('__'+key+'__',()=>value);
if(missing.size)throw new Error('Missing sources: '+[...missing].join(', '));
const unresolved=page.match(/__[A-Z_0-9]+__/g);if(unresolved)throw new Error('Unresolved template markers: '+[...new Set(unresolved)].join(', '));
writeFileSync(new URL('index.html',import.meta.url),page);
const pages=(page.match(/class="[^"]*book-page/g)||[]).length;
writeFileSync(new URL('qa/build.json',import.meta.url),JSON.stringify({figureParts:{cover:f.count,allocation:allocationFigure.count,claim:claimFigure.count,pool:poolFigure.count},pages,bytes:Buffer.byteLength(page),sources:Object.keys(sources).length,terms:glossary.length},null,2));
console.log(`Built index.html: ${pages} pages, ${f.count+allocationFigure.count+claimFigure.count+poolFigure.count} physical parts, ${Object.keys(sources).length} sources, ${glossary.length} terms, ${Buffer.byteLength(page)} bytes.`);
