const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const js=fs.readFileSync('public/app.js','utf8');
const fn=js.match(/function validReplyContact\(value\) \{[\s\S]*?\n  \}/)[0];
const valid=vm.runInNewContext('('+fn+')');
for(const value of ['person@example.com','+91 95884 27706','(212) 555-1234'])assert.equal(valid(value),true,value);
for(const value of ['','abc','123','a@','hello world@example.com','1234567890123456'])assert.equal(valid(value),false,value);
for(const page of ['index','about','capabilities','industries','contact']){
 const html=fs.readFileSync('public/'+page+'.html','utf8');
 assert.equal((html.match(/id="quote-result"/g)||[]).length,1);
 assert.equal((html.match(/name="contact"/g)||[]).length,1);
 assert(!html.includes('id="email-enquiry"'));
 assert(!html.includes('id="copy-enquiry"'));
 assert(html.includes('data-endpoint=""'));
}
console.log('Contact validation and submit-only forms passed on all five pages.');
