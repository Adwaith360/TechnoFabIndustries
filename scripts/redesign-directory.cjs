const fs=require('fs');
let html=fs.readFileSync('public/index.html','utf8');
const section=`<section class="page-directory section-pad" aria-labelledby="explore-title">
<div class="directory-heading"><div><p class="mono directory-eyebrow"><span></span> EXPLORE TECHNO FAB</p><h2 class="display" id="explore-title">YOUR NEXT PART.<br><span>STARTS HERE.</span></h2></div><p>Get to know our processes, explore applications, or bring us a drawing. We’ll help you take the next step.</p></div>
<div class="page-cards">
<a class="page-card directory-feature" href="/capabilities.html">
<div class="directory-image"><img src="/assets/laser-cutting.webp" alt="Laser cutting a metal plate" loading="lazy" width="1536" height="1024"><span class="directory-image-label mono">CUT / FORM / FABRICATE / FINISH</span></div>
<div class="directory-copy"><span class="mono directory-number">01 / WHAT WE DO</span><h3>Made to your drawing.<span class="directory-arrow" aria-hidden="true">↗</span></h3><p>From precise cuts to finished assemblies. Explore four processes that bring your component to life.</p><span class="directory-link">Explore capabilities <span aria-hidden="true">→</span></span></div>
</a>
<a class="page-card directory-side" href="/about.html"><div class="directory-copy"><span class="mono directory-number">02 / WHO WE ARE</span><h3>Your manufacturing partner.<span class="directory-arrow" aria-hidden="true">↗</span></h3><p>Based in Nashik. Built around your requirements, from raw metal to ready.</p><span class="directory-link">Meet Techno Fab <span aria-hidden="true">→</span></span></div><div class="directory-thumb"><img src="/assets/fabrication.webp" alt="Fabricated steel brackets" width="1536" height="1024" loading="lazy"></div></a>
<a class="page-card directory-side" href="/industries.html"><div class="directory-copy"><span class="mono directory-number">03 / WHERE IT FITS</span><h3>Parts with a purpose.<span class="directory-arrow" aria-hidden="true">↗</span></h3><p>Metalwork for equipment, electrical systems, architecture and more.</p><span class="directory-link">Explore industries <span aria-hidden="true">→</span></span></div><div class="directory-thumb"><img src="/assets/automation.webp" alt="Metal components for automation equipment" width="1536" height="1024" loading="lazy"></div></a>
<a class="page-card directory-contact" href="/contact.html"><span class="mono">04 / LET’S BUILD</span><div><h3>Have a drawing? Let’s talk.</h3><p>Share your material, quantity and requirements to get started.</p></div><span class="directory-contact-link">Start a conversation <span class="directory-arrow" aria-hidden="true">↗</span></span></a>
</div><p class="directory-footnote">CUSTOM METAL MANUFACTURING <span aria-hidden="true">+</span> NASHIK, INDIA</p>
</section>`;
html=html.replace(/<section class="page-directory section-pad">[\s\S]*?<\/section>/,section);
fs.writeFileSync('public/index.html',html);
