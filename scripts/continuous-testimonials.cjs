const fs=require('fs');
for(const page of ['index','contact']){
 const path='public/'+page+'.html';
 let html=fs.readFileSync(path,'utf8');
 html=html.replace(/<p class="sample-disclosure">[\s\S]*?<\/p>/,'');
 html=html.replace(/<div class="testimonial-controls">[\s\S]*?<\/button><\/div>/,'');
 fs.writeFileSync(path,html);
}
let js=fs.readFileSync('public/app.js','utf8');
const start=js.lastIndexOf("(() => {\n  const preference = matchMedia('(prefers-reduced-motion: reduce)');");
if(start<0)throw Error('Carousel script not found');
js=js.slice(0,start)+`(() => {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const update = () => document.querySelectorAll('.testimonial-carousel').forEach(carousel => {
    carousel.classList.toggle('is-animated', !preference.matches);
  });
  preference.addEventListener('change', update);
  update();
})();
`;
fs.writeFileSync('public/app.js',js);
let css=fs.readFileSync('public/styles.css','utf8');
css=css.replace(/\.testimonial-carousel\.is-paused \.testimonial-track,\.testimonial-carousel \.testimonial-viewport:focus-within \.testimonial-track\{animation-play-state:paused\}/,'');
css=css.replace('@media(hover:hover){.testimonial-viewport:hover .testimonial-track{animation-play-state:paused}}','');
fs.writeFileSync('public/styles.css',css);
