const fs=require('fs');
let html=fs.readFileSync('public/index.html','utf8');
const cards=[
['01','Capabilities','Cut. Bend. Build. Finish.','capabilities','laser-cutting','Laser cutting a metal plate'],
['02','About us','Your partner in Nashik.','about','fabrication','Custom fabricated metal brackets'],
['03','Industries','Parts for your application.','industries','automation','Metal components for automation'],
['04','Let’s talk','Bring your next idea.','contact','cnc-bending','Sheet metal being formed']
];
const section=`<section class="page-directory section-pad reveal-directory" aria-labelledby="explore-title">
<div class="directory-heading"><div><p class="mono directory-eyebrow"><span></span> EXPLORE TECHNO FAB</p><h2 class="display" id="explore-title">YOUR NEXT PART.<br><span>STARTS HERE.</span></h2></div></div>
<div class="page-cards">${cards.map(([n,title,line,route,img,alt])=>`<a class="page-card explore-card" href="/${route}.html" aria-label="${route==='contact'?'Contact Techno Fab':'Explore '+title}">
<div class="explore-photo"><img src="/assets/${img}.webp" alt="${alt}" width="1536" height="1024" loading="lazy"></div>
<div class="explore-top"><span class="mono">${n} / TECHNO FAB</span><span class="explore-plus" aria-hidden="true">↗</span></div>
<div class="explore-bottom"><div><h3>${title}</h3><p>${line}</p></div><span class="explore-cta">${route==='contact'?'Let’s talk':'Explore'} <span aria-hidden="true">↗</span></span></div>
</a>`).join('\n')}</div>
</section>`;
const original=html;
html=html.replace(/<section class="page-directory section-pad" aria-labelledby="explore-title">[\s\S]*?<\/section>/,section);
if(html===original)throw Error('Directory not found');
fs.writeFileSync('public/index.html',html);
