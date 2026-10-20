// The same document supports a desktop reader and a normal scrolling article.
const allPages=$$('.book-page');let route='full';let pages=allPages;
const nameOf=p=>p.dataset.pageTitle||p.querySelector('h1,h2').textContent;let pageNames=pages.map(nameOf);
const desktop=matchMedia('(min-width:1100px) and (min-height:680px)');
const contents=$('#contents-dialog');
let pageIndex=0;
// History is unavailable in some embedded previews (about:srcdoc); navigation still works without it.
function pushHash(id){try{history.pushState(null,'','#'+id);}catch{}}
function targetPage(hash){const target=document.getElementById(decodeURIComponent(hash.replace(/^#/,'')))||pages[0];const page=target.closest('.book-page')||pages[0];if(route==='short'&&!page.dataset.short)setRoute('full');return Math.max(0,pages.indexOf(page));}
function setRoute(r){route=r;pages=r==='short'?allPages.filter(p=>p.dataset.short):allPages;pageNames=pages.map(nameOf);document.documentElement.classList.toggle('short-route',r==='short');$('#book-route').hidden=r!=='short';buildContents();}
function buildContents(){$('#contents-list').innerHTML=allPages.map((p,i)=>`<a href="#${p.id}" ${route==='short'&&!p.dataset.short?'class="off-route"':''}><span>${String(i+1).padStart(2,'0')}</span>${nameOf(p)}${p.dataset.short?'<i class="short-mark" title="On the short route">short route</i>':''}</a>`).join('');$('#route-short').setAttribute('aria-pressed',String(route==='short'));$('#route-full').setAttribute('aria-pressed',String(route==='full'));}
function showPage(index,{push=false,focus=false}={}){
 pageIndex=Math.max(0,Math.min(pages.length-1,index));
 allPages.forEach(p=>{const i=pages.indexOf(p);p.classList.toggle('active',i===pageIndex);p.inert=desktop.matches&&i!==pageIndex;});
 $('#book-page-number').textContent=`${String(pageIndex+1).padStart(2,'0')} / ${String(pages.length).padStart(2,'0')}`;
 $('#book-page-name').textContent=pageNames[pageIndex];$('#book-prev').disabled=pageIndex===0;$('#book-next').disabled=pageIndex===pages.length-1;
 $('.book-progress span').style.width=`${(pageIndex+1)/pages.length*100}%`;
 $$('#contents-list a').forEach(a=>{if(a.getAttribute('href')==='#'+pages[pageIndex].id)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
 if(push){pushHash(pages[pageIndex].id);pages[pageIndex].scrollTop=0;}
 moreCue(pages[pageIndex]);
 if(focus&&desktop.matches){const h=pages[pageIndex].querySelector('h1,h2');h.tabIndex=-1;h.focus({preventScroll:true});}
 if(push&&!desktop.matches)pages[pageIndex].scrollIntoView({behavior:still.matches?'instant':'smooth'});
}
buildContents();
$('#route-short').addEventListener('click',()=>{setRoute('short');contents.close();showPage(0,{push:true,focus:true});});
$('#route-full').addEventListener('click',()=>{setRoute('full');contents.close();showPage(targetPage(location.hash));});
$$('[data-route=short]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();setRoute('short');showPage(0,{push:true,focus:true});}));
// A cue when a page has more below the fold in the reader.
allPages.forEach(p=>{const cue=document.createElement('div');cue.className='more-cue';cue.innerHTML='<span>More below ↓</span>';p.appendChild(cue);p.addEventListener('scroll',()=>moreCue(p));});
function moreCue(p){if(!desktop.matches){p.classList.remove('has-more');return;}requestAnimationFrame(()=>p.classList.toggle('has-more',p.scrollHeight>p.clientHeight+24&&p.scrollTop+p.clientHeight<p.scrollHeight-40));}
addEventListener('resize',()=>moreCue(pages[pageIndex]));
function openContents(){contents.showModal();}
$('#contents-open').addEventListener('click',openContents);$('#book-position').addEventListener('click',openContents);
$('#contents-close').addEventListener('click',()=>contents.close());contents.addEventListener('click',e=>{if(e.target===contents){const r=contents.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)contents.close();}});
$('#book-prev').addEventListener('click',()=>showPage(pageIndex-1,{push:true,focus:true}));$('#book-next').addEventListener('click',()=>showPage(pageIndex+1,{push:true,focus:true}));
document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(!a)return;const hash=a.getAttribute('href');if(!document.getElementById(hash.slice(1)))return;if(contents.open)contents.close();if(desktop.matches){e.preventDefault();showPage(targetPage(hash),{push:true,focus:true});if(hash.startsWith('#source-')){$('#sources details').open=true;document.querySelector(hash).scrollIntoView({block:'center'});}}});
function syncHash(){showPage(targetPage(location.hash));if(location.hash.startsWith('#source-')){$('#sources details').open=true;document.querySelector(location.hash)?.scrollIntoView({block:'center'});}}
addEventListener('hashchange',syncHash);addEventListener('popstate',syncHash);
function layoutMode(){const wasDesktop=document.documentElement.classList.contains('reader-mode');document.documentElement.classList.toggle('reader-mode',desktop.matches);showPage(targetPage(location.hash));moreCue(pages[pageIndex]);if(wasDesktop&&!desktop.matches)requestAnimationFrame(()=>pages[pageIndex].scrollIntoView({behavior:'instant'}));}
desktop.addEventListener('change',layoutMode);layoutMode();
async function toggleFullscreen(){try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{ $('#fullscreen').title='Fullscreen is unavailable in this browser. Use the browser’s fullscreen command.'; }}
$('#fullscreen').addEventListener('click',toggleFullscreen);document.addEventListener('fullscreenchange',()=>{$('#fullscreen').innerHTML=document.fullscreenElement?'Exit fullscreen <span aria-hidden="true">⛶</span>':'Fullscreen <span aria-hidden="true">⛶</span>';$('#fullscreen').setAttribute('aria-label',document.fullscreenElement?'Exit fullscreen':'Enter fullscreen');});
if(!document.fullscreenEnabled)$('#fullscreen').hidden=true;
document.addEventListener('keydown',e=>{if(!desktop.matches||document.querySelector('dialog[open]')||e.altKey||e.ctrlKey||e.metaKey||e.target.closest('input,textarea,select,button,summary,[contenteditable=true]'))return;if(['ArrowRight','PageDown','ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();showPage(pageIndex+(['ArrowRight','PageDown'].includes(e.key)?1:-1),{push:true,focus:true});}else if(e.key==='Home'){e.preventDefault();showPage(0,{push:true,focus:true});}else if(e.key==='End'){e.preventDefault();showPage(pages.length-1,{push:true,focus:true});}else if(e.key.toLowerCase()==='f'){e.preventDefault();toggleFullscreen();}});
$('#map-expand').addEventListener('click',()=>{$('#map-zoom-title').textContent=$('#map-title').textContent;$('#map-zoom-art').innerHTML=$('#map-diagram').innerHTML;$('#map-zoom-legend').textContent=$('#map-legend').textContent;$('#map-zoom').showModal();});$('#map-zoom-close').addEventListener('click',()=>$('#map-zoom').close());
