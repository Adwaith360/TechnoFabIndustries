const fs=require('fs');
for(const page of ['index','about','capabilities','industries','contact']){
 let html=fs.readFileSync('public/'+page+'.html','utf8');
 html=html.replace(/<label>Reply email \(optional\)[\s\S]*?<\/label>/,'');
 html=html.replace('<form id="quote-form">','<form id="quote-form" data-endpoint="">');
 html=html.replace(/<div class="quick-form-footer">[\s\S]*?<\/form>/,`<div class="contact-reply-field"><label for="reply-contact">How can we reach you? *</label><input id="reply-contact" name="contact" type="text" required maxlength="150" placeholder="Phone number or email" aria-describedby="reply-contact-help" autocapitalize="none" spellcheck="false"><p id="reply-contact-help">Enter either one so our team can follow up.</p></div><div class="quick-form-footer"><button type="submit" class="button">Submit <span aria-hidden="true">↗</span></button><p class="form-note">We’ll use your contact details to respond to this enquiry.</p><p id="submit-status" role="status" aria-live="polite"></p></div></form>`);
 html=html.replace(/<div id="quote-result" hidden>[\s\S]*?<\/div><\/div><\/dialog>/,'<div id="quote-result" hidden tabindex="-1"><h3>Thank you for your enquiry.</h3><p>Our team will contact you using the details you provided.</p></div></div></dialog>');
 html=html.replace('Choose a process. Add your file in email. Send.','Choose a process. Leave your number or email. We’ll follow up.');
 fs.writeFileSync('public/'+page+'.html',html);
}
let js=fs.readFileSync('public/app.js','utf8');
const begin=js.indexOf("  let enquiry = '';");
const end=js.indexOf("  $('#year').textContent",begin);
if(begin<0||end<0)throw Error('Submission handler not found');
js=js.slice(0,begin)+`  const contactInput = form.elements.contact;
  function validReplyContact(value) {
    const text = value.trim();
    if (text.includes('@')) return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(text);
    const digits = text.replace(/\\D/g, '');
    return /^\\+?[\\d\\s().-]+$/.test(text) && digits.length >= 7 && digits.length <= 15;
  }
  contactInput.addEventListener('input', () => {
    contactInput.setCustomValidity('');
    $('#submit-status').textContent = '';
  });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    contactInput.setCustomValidity(validReplyContact(contactInput.value) ? '' : 'Enter a valid phone number or email address.');
    if (!form.reportValidity()) return;
    const status = $('#submit-status');
    const endpoint = form.dataset.endpoint;
    if (!endpoint) {
      status.textContent = 'Preview only: enquiries are not being sent yet. Your details have not been submitted.';
      return;
    }
    const button = $('button[type="submit"]', form);
    if (button.disabled) return;
    button.disabled = true;
    button.textContent = 'Submitting…';
    status.textContent = '';
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
        signal: AbortSignal.timeout(15000)
      });
      if (!response.ok) throw new Error('Submission failed');
      const result = await response.json();
      if (result.success !== true) throw new Error('Submission not confirmed');
      form.hidden = true;
      $('#quote-result').hidden = false;
      $('#quote-result').focus();
      quoteDialog.scrollTop = 0;
      form.reset();
    } catch {
      status.textContent = 'We couldn’t confirm your enquiry was received. Your details are still here. Please try again.';
    } finally {
      button.disabled = false;
      button.textContent = 'Submit';
    }
  });
`+js.slice(end);
fs.writeFileSync('public/app.js',js);
