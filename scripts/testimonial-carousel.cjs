const fs=require('fs');
const entries=[
['Arjun Mehta','Manufacturing','Clear communication from the first drawing to the finished part.'],
['Priya Shah','Equipment','Having cutting, bending and finishing together made coordination easier.'],
['Rohan Deshmukh','Engineering','A helpful team to discuss our custom component requirements with.'],
['Vikram Rao','Fabrication','The team helped us work through the details of our custom metal parts.'],
['Ananya Kulkarni','Product development','It was easy to discuss the material, finish and next steps for our project.'],
['Sameer Patil','Industrial equipment','One point of contact made planning our components straightforward.']
];
const cards=entries.map(([name,industry,quote],i)=>`<figure class="quote-card"><div class="quote-card-top"><span class="quote-glyph" aria-hidden="true">“</span></div><blockquote>${quote}</blockquote><figcaption><span class="customer-avatar"><img src="/assets/avatars/portrait-${i+1}.jpg" alt="" width="46" height="46" loading="lazy"></span><span class="customer-identity"><strong>${name}</strong><span>${industry}</span></span></figcaption></figure>`).join('');
for(const page of ['index','contact']){
 const path='public/'+page+'.html';
 let html=fs.readFileSync(path,'utf8');
 html=html.replace(/<div class="testimonial-grid"[^>]*>[\s\S]*?<\/div><\/section>/,`<div class="testimonial-carousel"><div class="testimonial-controls"><span>6 customer stories</span><button type="button" class="testimonial-pause" aria-pressed="false" aria-controls="testimonial-viewport" hidden>Pause scrolling</button></div><div id="testimonial-viewport" class="testimonial-viewport" tabindex="0" role="region" aria-label="Illustrative testimonials"><div class="testimonial-grid testimonial-track"><div class="testimonial-set">${cards}</div><div class="testimonial-set testimonial-copy" aria-hidden="true" inert>${cards}</div></div></div></div></section>`);
 html=html.replace('Illustrative testimonials and portraits · Replace with real customer feedback before publishing.','Illustrative names, quotes and portraits · Replace with real customer feedback before publishing.');
 fs.writeFileSync(path,html);
}
