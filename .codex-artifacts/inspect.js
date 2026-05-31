const { chromium } = require('playwright');

(async () => {
  const url = process.argv[2] || 'http://localhost:3005';
  const width = parseInt(process.argv[3] || '1280', 10);
  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  const h1 = page.locator('h1').first();
  const h1style = await h1.evaluate((el) => {
    const cs = getComputedStyle(el);
    return { fontFamily: cs.fontFamily, fontSize: cs.fontSize, fontWeight: cs.fontWeight, letterSpacing: cs.letterSpacing, lineHeight: cs.lineHeight, color: cs.color };
  });
  const h1text = (await h1.innerText()).replace(/\n/g, ' | ');

  const logo = page.locator('header nav img[alt="Liftyra"]').first();
  const logoStyle = await logo.evaluate((el) => ({ src: el.getAttribute('src'), w: el.clientWidth, h: el.clientHeight }));

  const visual = page.locator('.hero-visual').first();
  const before = await visual.evaluate((el) => getComputedStyle(el, '::before').backgroundImage);

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);

  console.log('viewport:', width);
  console.log('H1 text:', h1text);
  console.log('H1 style:', JSON.stringify(h1style));
  console.log('Logo:', JSON.stringify(logoStyle));
  console.log('hero-visual ::before bg:', before.slice(0, 90));
  console.log('horizontal overflow:', overflow);

  await browser.close();
})();
