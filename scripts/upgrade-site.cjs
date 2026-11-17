const fs = require('fs');
const source=fs.readFileSync('public/index.html','utf8');
fs.writeFileSync('scripts/site-template.html',source);
const sections=Object.fromEntries([...source.matchAll(/<section\b[^>]*id="([^"]+)"[^>]*>[\s\S]*?<\/section>/g)].map(m=>[m[1],m[0]]));
const routes={home:'/',about:'/about.html',services:'/capabilities.html',materials:'/capabilities.html#materials',process:'/about.html#process',industries:'/industries.html',contact:'/contact.html'};
const pages=[
['index','Home',['home']],
['about','About us',['about','process']],
['capabilities','Capabilities',['services','materials']],
['industries','Industries',['industries']],
['contact','Contact',['contact']]
];
const intros={about:'Meet your manufacturing partner in Nashik.',capabilities:'Explore the processes and materials behind your next component.',industries:'Find metalwork for your application.',contact:'Bring your drawing. Let’s discuss the details.'};
for(const [slug,title,ids] of pages){
 let content=ids.map(id=>sections[id]).join('\n');
 if(slug==='index') content += '<section class="page-directory section-pad"><p class="mono orange">EXPLORE TECHNO FAB</p><h2 class="display">FROM IDEA TO FINISHED PART.</h2><div class="page-cards">'+pages.slice(1).map(([s,t],i)=>'<a class="page-card" href="/'+s+'.html"><span class="mono">0'+(i+1)+' / EXPLORE</span><h3>'+t+' <span aria-hidden="true">↗</span></h3><p>'+intros[s]+'</p></a>').join('')+'</div></section>';
 else content='<section class="page-intro section-pad"><a class="text-link" href="/">Home ↗</a><p class="mono orange">TECHNO FAB INDUSTRIES / '+title.toUpperCase()+'</p><h1 class="display">'+title.toUpperCase()+'</h1><p>'+intros[slug]+'</p></section>'+content;
 let html=source.replace(/(<main id="main">)[\s\S]*?(<\/main>)/,'$1'+content+'$2');
 html=html.replace(/href="#([^"]+)"/g,(m,id)=>id==='main'?m:'href="'+(routes[id]||'#'+id)+'"');
 html=html.replace(/<nav class="desktop-nav" aria-label="Main navigation">/,'<nav class="desktop-nav" aria-label="Main navigation"><a href="/">Home</a>');
 html=html.replace(/(<nav id="mobile-menu"[^>]*>)/,'$1<a href="/">Home <span>00</span></a>');
 const current=slug==='index'?'/':'/'+slug+'.html';
 html=html.replaceAll('href="'+current+'"','href="'+current+'" aria-current="page"');
 html=html.replace(/<title>.*?<\/title>/,'<title>'+title+' | Techno Fab Industries, Nashik</title>');
 html=html.replace('href="/" aria-current="page">BACK TO TOP','href="#main">BACK TO TOP').replace('href="/">BACK TO TOP','href="#main">BACK TO TOP');
 fs.writeFileSync('public/'+slug+'.html',html);
}
let css=fs.readFileSync('public/styles.css','utf8');
css=css.replace(/font-size:(\d+(?:\.\d+)?)px/g,(m,n)=>Number(n)<16?'font-size:16px':m);
css += `
/* Comfortable reading at default zoom across every page. */
body{font-size:18px;line-height:1.7}
p,li{overflow-wrap:break-word}
.desktop-nav{gap:24px}.desktop-nav a{font-size:17px}
[aria-current="page"]{text-decoration:underline;text-underline-offset:7px;text-decoration-color:var(--orange)}
.brand[aria-current]{text-decoration:none}
.section-heading>p,.about-copy>p:not(.lead),.service-panel>p,.material-row p,.process-step p,.card-summary,.contact-location p,.dialog-intro{font-size:18px;line-height:1.75}
.mono,.section-kicker.mono,.card-meta.mono,.footer-bottom.mono{font-size:14px;line-height:1.7}
.tags{flex-wrap:wrap}.tags>span{font-size:15px}
.about-copy,.process-step p{max-width:65ch}
.outline-dark{-webkit-text-stroke:0;color:var(--ink)}
.page-intro{padding-top:155px;padding-bottom:65px;background:var(--ink);border-bottom:1px solid var(--line)}
.page-intro .mono{margin:35px 0 15px}
.page-intro h1{font-size:clamp(60px,9vw,140px);line-height:1}
.page-intro>p:last-child{font-size:21px;max-width:55ch;margin-top:25px;color:#d1d4cc}
.page-directory{background:var(--paper);color:var(--ink)}
.page-directory h2{font-size:clamp(42px,5vw,80px);margin:20px 0 40px}
.page-cards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px}
.page-card{padding:35px;border:1px solid #a1a59b;transition:background .25s,transform .25s;display:block}
.page-card h3{font-size:32px;margin:20px 0 10px;display:flex;justify-content:space-between}
.page-card p{max-width:42ch;font-size:18px}
.page-card:hover{background:#fff;transform:translateY(-5px)}
.page-card:focus-visible{outline:3px solid #b13d17}
.contact-email{overflow-wrap:anywhere}
.form-grid label,.form-grid input,.form-grid select,.form-grid textarea{font-size:17px}
.section-kicker{flex-wrap:wrap}
@media(max-width:1100px){.desktop-nav{gap:15px}.desktop-nav a{font-size:16px}}
@media(max-width:800px){body{font-size:17px}.page-cards{grid-template-columns:1fr}.page-intro{padding-top:125px}.page-card{padding:25px}.about-foot{gap:18px}.hero-topline{flex-wrap:wrap}.hero-caption{max-width:65%}.people-grid{grid-template-columns:1fr}.material-row p{font-size:17px}.section-heading>p{margin-top:20px}.section-kicker{letter-spacing:0}}
@media(prefers-reduced-motion:no-preference){
.page-intro h1{animation:page-arrive .8s both}
.page-intro>p:last-child{animation:page-arrive .8s .12s both}
@keyframes page-arrive{from{opacity:.25;transform:translateY(24px)}to{opacity:1;transform:none}}
}
`;
fs.writeFileSync('public/styles.css',css);
let js=fs.readFileSync('public/app.js','utf8');
js=js.replace("gsap.timeline({ defaults:", "if ($('.hero')) gsap.timeline({ defaults:");
js=js.replace("gsap.to('.hero-photo > img'", "if ($('.hero')) gsap.to('.hero-photo > img'");
js=js.replace("gsap.from('.part-diagram path", "if ($('.part-diagram')) gsap.from('.part-diagram path");
js += `
(() => {
 const preference=matchMedia('(prefers-reduced-motion: reduce)');
 const animations=new Set();
 const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
   if(!entry.isIntersecting)return;
   observer.unobserve(entry.target);
   if(preference.matches)return;
   const animation=entry.target.animate([{opacity:.3,transform:'translateY(24px)'},{opacity:1,transform:'translateY(0)'}],{duration:650,easing:'cubic-bezier(.2,.7,.2,1)'});
   animations.add(animation);animation.finished.catch(()=>{}).finally(()=>animations.delete(animation));
  });
 },{threshold:.12});
 document.querySelectorAll('.page-card,.material-row,.contact-details,.about-foot').forEach(el=>observer.observe(el));
 preference.addEventListener('change',()=>{if(preference.matches)animations.forEach(a=>a.cancel())});
 document.addEventListener('visibilitychange',()=>animations.forEach(a=>document.hidden?a.pause():a.play()));
})();
`;
fs.writeFileSync('public/app.js',js);
