const fs=require('fs');
const fields=`<div class="form-grid">
<label>Your name *<input name="name" autocomplete="name" required maxlength="100" placeholder="Full name"></label>
<label>What do you need?<select name="service"><option>Multiple services / not sure</option><option>Fabrication &amp; assembly</option><option>Laser cutting</option><option>CNC bending</option><option>Coating</option></select></label>
<label>Material<select name="material"><option value="">Not sure yet</option><option>Mild steel</option><option>Stainless steel</option><option>Aluminium</option><option>Galvanized iron</option><option>Brass / copper</option><option>Other / mixed</option></select></label>
<label>How many parts?<select name="quantity"><option value="">Not sure yet</option><option>1 prototype</option><option>2–10 parts</option><option>11–50 parts</option><option>51–100 parts</option><option>100+ parts</option><option>Ongoing production</option></select></label>
</div>
<details class="optional-enquiry"><summary>Add a note or drawing details <span>Optional</span></summary><div class="form-grid">
<label class="full-width">Anything we should know?<textarea name="details" rows="2" maxlength="4000" placeholder="Part, thickness, deadline… or tell us in your email."></textarea></label>
<label>Company<input name="company" autocomplete="organization" maxlength="150" placeholder="Company name"></label>
<label>Reply email (optional)<input name="email" type="email" autocomplete="email" maxlength="150" placeholder="If different from your sending address"></label>
</div></details>
<div class="quick-form-footer"><button type="submit" class="button">Continue in email <span aria-hidden="true">↗</span></button><p class="form-note">Attach drawings in your email app, then send.</p></div>`;
const testimonials=`<section class="sample-testimonials section-pad" aria-labelledby="testimonial-title"><div class="testimonial-heading"><div><p class="mono">CUSTOMER STORIES</p><h2 class="display" id="testimonial-title">GOOD WORK. IN THEIR WORDS.</h2></div><p class="sample-disclosure">Layout preview · Sample quotes, not real customer feedback.</p></div><div class="testimonial-grid"><figure><span class="sample-label">SAMPLE — REPLACE BEFORE PUBLISHING</span><blockquote>“Clear communication from the first drawing to the finished part.”</blockquote><figcaption>Sample customer · Manufacturing</figcaption></figure><figure><span class="sample-label">SAMPLE — REPLACE BEFORE PUBLISHING</span><blockquote>“Having cutting, bending and finishing together made coordination easier.”</blockquote><figcaption>Sample customer · Equipment</figcaption></figure><figure><span class="sample-label">SAMPLE — REPLACE BEFORE PUBLISHING</span><blockquote>“A helpful team to discuss our custom component requirements with.”</blockquote><figcaption>Sample customer · Engineering</figcaption></figure></div></section>`;
for(const file of ['index','about','capabilities','industries','contact']){
 let html=fs.readFileSync('public/'+file+'.html','utf8');
 html=html.replace(/<form id="quote-form">[\s\S]*?<\/form>/,'<form id="quote-form">'+fields+'</form>');
 html=html.replace(/<div class="section-kicker mono orange">[^<]*<\/div><h2 id="quote-title"[\s\S]*?<p class="dialog-intro">[\s\S]*?<\/p>/,`<div class="quick-quote-heading"><img src="/assets/fabrication.webp" width="96" height="80" alt="Custom metal brackets"><div><h2 id="quote-title" class="display">LET’S MAKE YOUR PART.</h2><p class="dialog-intro">A few details. We’ll take it from there.</p></div></div>`);
 html=html.replace('Your enquiry is ready.','Your email draft is ready.').replace('Open it in your email app, attach your drawing or CAD file, and send it to our team.','Attach your drawing and send. If your email app didn’t open, use the options below.');
 if(file==='index'||file==='contact')html=html.replace('</main>',testimonials+'</main>');
 if(file==='contact'){
 html=html.replace(/<div class="quote-checklist">[\s\S]*?<\/ol><\/div>/,'<div class="quote-checklist quick-checklist"><img src="/assets/cnc-bending.webp" width="1536" height="1024" alt="Sheet metal bending" loading="lazy"><div><span class="mono">GOT A DRAWING?</span><p>Choose a process. Add your file in email. Send.</p><button class="button" data-quote>Start enquiry ↗</button></div></div>');
 html=html.replace('<p>Bring your drawing. Let’s discuss the details.</p>','<p>One part or a production run. Let’s talk.</p><div class="contact-fast-actions"><button class="button" data-quote>Start enquiry ↗</button><a class="text-link" href="tel:+919588427706">Call our team ↗</a></div>');
 }
 fs.writeFileSync('public/'+file+'.html',html);
}
let js=fs.readFileSync('public/app.js','utf8');
js=js.replace("${data.email.trim()}","${data.email.trim() || 'Reply to the sending email address'}");
js=js.replace("${data.details.trim()}","${data.details.trim() || 'Please help me confirm the requirements.'}");
js=js.replace("I will attach the drawing / DXF / CAD file and revision where available.","Drawing / CAD file: to be attached if available.");
js=js.replace("$('#email-enquiry').focus();","$('#email-enquiry').focus();\n    $('#email-enquiry').click();");
js=js.replace("if (!form.elements.details.value.trim()) form.elements.details.value = `Application: ${title}\\n`;","if (!form.elements.details.value.trim()) form.elements.details.value = `Application: ${title}\\n`;\n    $('.optional-enquiry').open = true;");
fs.writeFileSync('public/app.js',js);
