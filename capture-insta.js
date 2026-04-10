const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 1 });

  const posts = [
    { html: 'insta-post-1.html', png: 'insta/post-1.png' },
    { html: 'insta-post-2.html', png: 'insta/post-2.png' },
    { html: 'insta-post-3.html', png: 'insta/post-3.png' },
  ];

  for (const { html, png } of posts) {
    const filePath = 'file://' + path.resolve(__dirname, html).replace(/\\/g, '/');
    await page.goto(filePath, { waitUntil: 'networkidle0', timeout: 30000 });
    await page.waitForFunction(() => document.fonts.ready);
    await new Promise(r => setTimeout(r, 1000));

    const card = await page.$('.card');
    if (card) {
      await card.screenshot({ path: path.resolve(__dirname, png), type: 'png' });
    } else {
      await page.screenshot({ path: path.resolve(__dirname, png), type: 'png', clip: { x: 0, y: 0, width: 1080, height: 1080 } });
    }
    console.log(`✅ ${png} saved`);
  }

  await browser.close();
  console.log('Done!');
})();
