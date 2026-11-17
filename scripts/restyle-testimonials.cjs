const fs = require('fs');
const quotes = [
 ['Clear communication from the first drawing to the finished part.', 'Manufacturing', '01'],
 ['Having cutting, bending and finishing together made coordination easier.', 'Equipment', '02'],
 ['A helpful team to discuss our custom component requirements with.', 'Engineering', '03']
];
const avatar = '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="18" r="8" fill="currentColor"/><path d="M9 43v-5c0-8 7-13 15-13s15 5 15 13v5" fill="currentColor"/></svg>';
const cards = quotes.map(([quote, industry, number]) => `<figure class="quote-card">
<div class="quote-card-top"><span class="quote-glyph" aria-hidden="true">“</span><span class="sample-label">Sample quote</span></div>
<blockquote>${quote}</blockquote>
<figcaption><span class="customer-avatar customer-avatar-${number}">${avatar}</span><span class="customer-identity"><strong>Sample customer ${number}</strong><span>${industry}</span></span></figcaption>
</figure>`).join('\n');
for (const page of ['index','contact']) {
 const path = 'public/' + page + '.html';
 let html = fs.readFileSync(path, 'utf8');
 html = html.replace(/<div class="testimonial-grid">[\s\S]*?<\/div><\/section>/,
 '<div class="testimonial-grid" role="region" aria-label="Sample customer testimonials" tabindex="0">' + cards + '</div></section>');
 html = html.replace('Layout preview · Sample quotes, not real customer feedback.', 'Sample testimonials · Replace with real customer feedback before publishing.');
 fs.writeFileSync(path, html);
}
