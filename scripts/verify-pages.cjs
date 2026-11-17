const fs=require('fs'),path=require('path');
const pages=['index','about','capabilities','industries','contact'];let failures=[];
for(const page of pages){
 const html=fs.readFileSync('public/'+page+'.html','utf8');
 if((html.match(/<h1\b/g)||[]).length!==1)failures.push(page+': heading');
 for(const m of html.matchAll(/(?:href|src)="([^"]+)"/g)){
 const url=m[1];if(!url.startsWith('/')||url.startsWith('//'))continue;
 const [file,hash]=url.split('#');const target='public/'+(file==='/'?'index.html':file.slice(1));
 if(!fs.existsSync(target))failures.push(page+': missing '+url);
 else if(hash&&!fs.readFileSync(target,'utf8').includes('id="'+hash+'"'))failures.push(page+': anchor '+url);
 }
 for(const id of ['quote-dialog','industry-dialog','quote-form','mobile-menu'])if(!html.includes('id="'+id+'"'))failures.push(page+': '+id);
}
if(failures.length){console.error(failures);process.exit(1)}
console.log('Verified all five pages: local links, assets, section anchors, primary headings and shared dialogs.');
