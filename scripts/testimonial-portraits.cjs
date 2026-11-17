const fs=require('fs');
for(const page of ['index','contact']){
 const path='public/'+page+'.html';
 let html=fs.readFileSync(path,'utf8');
 html=html.replace(/<span class="sample-label">Sample quote<\/span>/g,'');
 html=html.replace(/<span class="customer-avatar customer-avatar-0([123])"><svg[\s\S]*?<\/svg><\/span>/g,(_,n)=>'<span class="customer-avatar customer-avatar-0'+n+'"><img src="/assets/avatars/portrait-'+n+'.jpg" alt="Illustrative customer portrait" width="46" height="46" loading="lazy"></span>');
 html=html.replace('Sample testimonials · Replace with real customer feedback before publishing.','Illustrative testimonials and portraits · Replace with real customer feedback before publishing.');
 fs.writeFileSync(path,html);
}
