import {readFileSync,writeFileSync} from 'node:fs';
import {register,registerPose} from './machines.mjs';
const base=new URL('../',import.meta.url);
const page=readFileSync(new URL('index.html',base),'utf8');
const css=page.match(/<style>([\s\S]*?)<\/style>/)[1];
let figure=page.match(/<div class="iso-stage">([\s\S]*?)<\/div><div class="flow-key"/)[1];
// Pose the register mid-cycle: receipt printed, drawer open.
const pose=registerPose(9.6),vectors=register().vectors;for(const [id,[x,y]] of Object.entries(vectors)){const p=pose.shares[id]||0;figure=figure.replaceAll('data-mover="'+id+'"','data-mover="'+id+'" transform="translate('+(x*p).toFixed(2)+' '+(y*p).toFixed(2)+')"');}
const logo=page.match(/<svg class="brand-mark"[\s\S]*?<\/svg>/)[0];
writeFileSync(new URL('share-image.html',base),`<!doctype html><html lang="en"><meta charset="utf-8"><title>US health insurance · Share image</title><style>${css}
html,body{width:1200px;height:630px;overflow:hidden}body{position:relative;padding:48px 54px;background:var(--paper)}.brand{font-size:11px}.share-copy{position:absolute;left:54px;top:147px;width:400px}.share-copy h1{font-size:78px;line-height:1.02}.share-copy h1 em{color:var(--flare)}.share-copy>p{font-size:19px;line-height:1.5;max-width:320px;margin-top:30px}.share-figure{position:absolute;left:445px;top:100px;width:735px}.share-figure .iso-svg{width:735px;height:490px}.share-note{position:absolute;left:54px;bottom:44px;font:11px var(--mono);letter-spacing:.06em;color:var(--graphite);border-top:1px solid var(--rule);padding-top:19px;width:1092px}.share-note span{float:right;color:var(--flare)}
</style><div class="brand">${logo}STANDARD APPLIED</div><div class="share-copy"><h1>US health<br><em>insurance.</em></h1><p>An interactive field guide for people building healthcare software.</p></div><div class="share-figure iso" data-theme="light" data-funding="self">${figure}</div><div class="share-note">ONE VISIT · THREE SEATS · THE MONEY LOOP · WHERE SOFTWARE ATTACHES<span>EXPLORE THE INTERACTIVE GUIDE ↗</span></div></html>`);
console.log('Built share-image.html');
