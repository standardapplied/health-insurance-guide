// Opens the built guide in headless Chromium and checks the model, the interactions, navigation
// and layout at desktop and phone widths. Run with `bun run check` after `bun run build`.
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));const file=root+'index.html';const shots=root+'qa/shots/';mkdirSync(shots,{recursive:true});
const b=await chromium.launch(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{});const errors=[],checks=[];
// The check is hermetic: no request leaves the machine, so the guide runs on its embedded fonts and the system fallback for Switzer.
const offline=async page=>{await page.route(/^https?:/,r=>r.abort());return page;};
try{
const p=await offline(await b.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'}));p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error'&&!m.text().startsWith('Failed to load resource'))errors.push(m.text());});
await p.goto('file://'+file);await p.evaluate(()=>document.fonts.ready);
assert.equal(await p.locator('.book-page').count(),23);assert.equal(await p.locator('.book-page:visible').count(),1);
const cents=s=>Math.round(Number(s.replace(/[^0-9.]/g,''))*100);
// Plan year: conservation across deductibles and MRI months; the tray matches the MRI split.
await p.evaluate(()=>location.hash='year');let n=0;
for(const m of ['2','6','10']){await p.locator(`[data-mri="${m}"]`).click();for(const d of ['0','500','2000','4000']){await p.locator('#deductible').fill(d);const [allowed,member,plan]=await Promise.all(['#total-allowed','#total-member','#total-plan'].map(s=>p.locator(s).textContent()));assert.equal(cents(allowed),cents(member)+cents(plan),`conservation ${m}/${d}`);assert.ok(cents(member)<=500000,'out-of-pocket cap');const mm=cents(await p.locator('#member-amount').textContent()),mp=cents(await p.locator('#plan-amount').textContent());assert.equal(mm+mp,100000);assert.equal(await p.locator('[data-counter][data-owner=member]').count(),Math.round(mm/2000));n++;}}
checks.push(`${n} plan-year scenarios conserve allowed = member + plan and cap the member at the out-of-pocket maximum; the counter tray matches the MRI split.`);
await p.locator('[data-mri="10"]').click();await p.locator('#deductible').fill('2000');assert.equal(await p.locator('#member-amount').textContent(),'$200');await p.locator('[data-mri="2"]').click();assert.equal(await p.locator('#member-amount').textContent(),'$1,000');checks.push('The MRI costs the member $1,000 in March and $200 in November with a $2,000 deductible.');
// One claim and the bill waterfall
await p.evaluate(()=>location.hash='cost');for(const d of ['0','200','1000','2000']){await p.locator('#one-deductible').fill(d);assert.equal(cents(await p.locator('#one-member').textContent())+cents(await p.locator('#one-plan').textContent()),100000);}
await p.evaluate(()=>location.hash='bill');for(const e of ['therapy','mri','er']){await p.locator(`[data-bill="${e}"]`).click();const [billed,allowed,member,plan,write]=(await p.locator('#waterfall .amount').allTextContents()).map(cents);assert.equal(billed,allowed+write);assert.equal(allowed,member+plan);}checks.push('The one-claim slider and the bill waterfall conserve every dollar.');
// Interactions
await p.evaluate(()=>location.hash='card');for(const f of ['member','group','rx','payer','behavioral','foot']){await p.locator(`#id-card [data-field="${f}"]`).click();assert.ok((await p.locator('#card-reading h3').textContent()).length>3);}
await p.evaluate(()=>location.hash='seats');for(const s of ['member','payer','provider','exchange']){await p.locator(`[data-seat="${s}"]`).click();assert.ok((await p.locator('#seat-copy').textContent()).length>20);}
await p.evaluate(()=>location.hash='claim');for(const e of ['therapy','mri','er']){await p.locator(`[data-encounter="${e}"]`).click();for(let i=0;i<6;i++){await p.locator(`[data-step="${i}"]`).click();assert.ok((await p.locator('#claim-copy').textContent()).length>40);}}
await p.evaluate(()=>location.hash='seams');for(let i=0;i<9;i++){await p.locator('[data-seam]').nth(i).click();assert.ok((await p.locator('#seam-panel h3').textContent()).length>3);}
await p.evaluate(()=>location.hash='organizations');for(const m of ['blues','uhg','elevance']){await p.locator(`[data-map="${m}"]`).click();assert.ok(await p.locator('#map-diagram svg').count());}await p.locator('[data-relation=license]').click();assert.match(await p.locator('#map-filter-status').textContent(),/^1 relationship/);
await p.evaluate(()=>location.hash='member');await p.locator('#member [data-funding=insured]').click();assert.equal(await p.locator('#risk-name').textContent(),'The insurer');await p.locator('#member [data-funding=self]').click();
await p.evaluate(()=>location.hash='language');await p.locator('#term-search').fill('superbill');assert.equal(await p.locator('#glossary details:visible').count(),1);await p.locator('#term-search').fill('');assert.ok(await p.locator('#glossary .term').count()>20,'glossary cross-links');
checks.push('Card fields, seats, three encounters × six stages, nine seams, three maps with filters, the funding switch and the glossary pass.');
// Definitions, builder's detail, short route, scroll cue
const termCount=await p.locator('.term').count();assert.ok(termCount>60);await p.evaluate(()=>location.hash='cost');await p.locator('#cost .term').first().click();assert.ok(await p.locator('#term-pop').isVisible());await p.keyboard.press('Escape');assert.ok(!(await p.locator('#term-pop').isVisible()));
await p.evaluate(()=>location.hash='card');await p.locator('#technical').check();assert.ok(await p.locator('#card .tech').first().isVisible());await p.evaluate(()=>location.hash='bill');assert.ok(await p.locator('#bill .tech').isVisible());await p.locator('#technical').uncheck();
await p.evaluate(()=>location.hash='cover');await p.locator('[data-route=short]').click();assert.equal(await p.locator('.book-page.active').getAttribute('id'),'card');assert.match(await p.locator('#book-page-number').textContent(),/01 \/ 06/);for(const id of ['cost','year','bill','seats','seams']){await p.locator('#book-next').click();assert.equal(await p.locator('.book-page.active').getAttribute('id'),id);}await p.locator('#contents-open').click();await p.locator('#route-full').click();assert.match(await p.locator('#book-page-number').textContent(),/\/ 23/);
await p.evaluate(()=>location.hash='claim');await p.waitForTimeout(150);assert.ok(await p.locator('#claim').evaluate(e=>e.classList.contains('has-more')));
checks.push(`${termCount} in-context definitions; Builder’s detail is global; the short route runs six pages in order; the more-below cue appears on a scrolling page.`);
// Navigation and layout
await p.evaluate(()=>location.hash='cover');await p.locator('#book-next').click();assert.equal(await p.locator('.book-page.active').getAttribute('id'),'card');await p.keyboard.press('ArrowRight');assert.equal(await p.locator('.book-page.active').getAttribute('id'),'cost');await p.goBack();assert.equal(await p.locator('.book-page.active').getAttribute('id'),'card');await p.locator('#contents-open').click();assert.equal(await p.locator('#contents-list a').count(),23);await p.keyboard.press('Escape');
const layouts=[];for(const id of await p.$$eval('.book-page',els=>els.map(e=>e.id))){await p.evaluate(id=>location.hash=id,id);await p.waitForTimeout(60);const d=await p.locator('#'+id).evaluate(e=>({id:e.id,h:e.clientHeight,scroll:e.scrollHeight,overflowX:e.scrollWidth>e.clientWidth+1}));assert.equal(d.overflowX,false,'overflow '+id);layouts.push(d);await p.screenshot({path:`${shots}desktop-${id}.png`});}
for(const [w,h] of [[1280,720],[1024,768],[834,1194]]){await p.setViewportSize({width:w,height:h});await p.goto('file://'+file);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`overflow at ${w}`);}
await p.setViewportSize({width:390,height:844});await p.goto('file://'+file);await p.evaluate(()=>document.fonts.ready);assert.equal(await p.locator('.book-page:visible').count(),23);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);for(const id of ['card','year','seats','money']){await p.locator('#'+id).screenshot({path:`${shots}phone-${id}.png`});}
await p.setViewportSize({width:320,height:780});assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
checks.push('Reader navigation, browser Back and the contents pass; no horizontal overflow from 320 to 1440 pixels wide.');
assert.deepEqual(errors,[]);
// Share image
const s=await offline(await b.newPage({viewport:{width:1200,height:630},deviceScaleFactor:2}));await s.goto('file://'+root+'share-image.html');await s.evaluate(()=>document.fonts.ready);await s.screenshot({path:root+'share-image.png'});
writeFileSync(root+'qa/checks.json',JSON.stringify({passed:true,checks,layouts},null,2));console.log(checks.map(c=>'✓ '+c).join('\n'));
}finally{await b.close();}
