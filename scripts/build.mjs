import { cp, mkdir, readdir, stat } from 'node:fs/promises';
await mkdir('dist', { recursive: true });
await cp('public', 'dist', { recursive: true });
async function total(dir) { let n = 0; for (const name of await readdir(dir)) { const p = `${dir}/${name}`; const s = await stat(p); n += s.isDirectory() ? await total(p) : s.size; } return n; }
console.log(`Built static site in dist/ (${(await total('dist') / 1024 / 1024).toFixed(1)} MB including brochure).`);
