const { chromium } = require('C:/Users/adwai/AppData/Local/OpenAI/Codex/runtimes/cua_node/9c26d707817e90a7/bin/node_modules/playwright');
const fs = require('node:fs/promises');
const assert = require('node:assert/strict');

(async () => {
  await fs.mkdir('tmp/qa', { recursive: true });
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('response', r => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
  await page.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'tmp/qa/desktop-hero.png' });
  assert.equal(await page.evaluate(() => typeof gsap), 'object');
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  for (const id of ['about', 'services', 'materials', 'process', 'industries', 'contact']) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    await page.waitForTimeout(900);
    await page.screenshot({ path: `tmp/qa/desktop-${id}.png` });
  }
  for (const id of ['laser','bending','coating','fabrication']) {
    await page.locator(`#trigger-${id}`).click();
    assert.equal(await page.locator(`#trigger-${id}`).getAttribute('aria-expanded'), 'true');
    assert.equal(await page.locator('.service-item.active').count(), 1);
  }
  await page.locator('[data-filter="equipment"]').click();
  assert.equal(await page.locator('.industry-card:visible').count(), 4);
  await page.locator('[data-filter="structural"]').click();
  assert.equal(await page.locator('.industry-card:visible').count(), 2);
  await page.locator('[data-filter="all"]').click();
  assert.equal(await page.locator('.industry-card:visible').count(), 6);
  await page.locator('[data-industry="electrical"]').click();
  assert.equal(await page.locator('#industry-dialog').evaluate(d => d.open), true);
  assert.match(await page.locator('#industry-title').textContent(), /Electrical/);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#industry-dialog').evaluate(d => d.open), false);
  await page.locator('.header-actions [data-quote]').click();
  await page.locator('[name="name"]').fill('Test Customer');
  await page.locator('[name="email"]').fill('customer@example.com');
  await page.locator('[name="service"]').selectOption('Laser cutting');
  await page.locator('[name="material"]').fill('Mild steel, 3 mm');
  await page.locator('[name="quantity"]').fill('50');
  await page.locator('[name="details"]').fill('Test quotation for a laser-cut mounting bracket. Delivery to Nashik.');
  await page.locator('#quote-form [type="submit"]').click();
  assert.equal(await page.locator('#quote-result').isVisible(), true);
  assert.match(await page.locator('#email-enquiry').getAttribute('href'), /^mailto:technofabindustriesnashik@gmail.com\?/);
  assert.match(decodeURIComponent(await page.locator('#email-enquiry').getAttribute('href')), /Mild steel, 3 mm/);
  await page.screenshot({ path: 'tmp/qa/enquiry.png' });
  await page.locator('#edit-enquiry').click();
  assert.equal(await page.locator('[name="name"]').inputValue(), 'Test Customer');
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('body').evaluate(el => el.classList.contains('dialog-open')), false);
  const brochure = await page.request.get('http://127.0.0.1:5173/assets/Techno-Fab-Industries-Brochure.pdf');
  assert.equal(brochure.status(), 200);
  assert.equal(brochure.headers()['content-type'], 'application/pdf');
  const broken = await page.evaluate(() => [...document.images].filter(i => i.src && i.complete && i.naturalWidth === 0).map(i => i.src));
  assert.deepEqual(broken, []);
  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  mobile.on('pageerror', e => errors.push(e.message));
  await mobile.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle' });
  await mobile.waitForTimeout(1500);
  await mobile.screenshot({ path: 'tmp/qa/mobile-hero.png' });
  assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  await mobile.locator('.menu-toggle').click();
  assert.equal(await mobile.locator('.menu-toggle').getAttribute('aria-expanded'), 'true');
  await mobile.locator('#mobile-menu a[href="#services"]').click();
  assert.equal(await mobile.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');
  await mobile.waitForTimeout(1000);
  await mobile.screenshot({ path: 'tmp/qa/mobile-services.png' });
  await mobile.locator('#trigger-bending').click();
  assert.equal(await mobile.locator('#service-bending').isVisible(), true);
  await mobile.locator('.header-actions [data-quote]').click();
  await mobile.screenshot({ path: 'tmp/qa/mobile-enquiry.png' });
  await mobile.locator('#quote-dialog [data-close]').click();
  await mobile.emulateMedia({ reducedMotion: 'reduce' });
  await mobile.reload({ waitUntil: 'networkidle' });
  for (const id of ['about', 'industries', 'contact']) { await mobile.locator(`#${id}`).scrollIntoViewIfNeeded(); await mobile.screenshot({ path: `tmp/qa/mobile-${id}.png` }); }
  assert.equal(await mobile.locator('#hero-title').evaluate(el => getComputedStyle(el).opacity), '1');
  for (const width of [320, 540, 768, 1024, 1920]) { await page.setViewportSize({ width, height: 900 }); assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `Overflow at ${width}px`); }
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({result:'PASS',checks:['GSAP loaded','desktop/mobile layouts','320–1920px no overflow','four service panels','application filters','application dialog','quote validation and prepared email','edit enquiry','modal Escape and scroll restoration','mobile navigation','reduced motion','brochure download','all images loaded','no browser errors']},null,2));
  await browser.close();
})().catch(err => { console.error(err); process.exit(1); });
