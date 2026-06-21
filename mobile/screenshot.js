const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

  await page.goto('http://localhost:4300/tabs/tab2', { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.waitForTimeout(3500);
  await page.screenshot({ path: 'C:/tmp/tab2-new.png' });

  // Klik na prvu kartu — detalji usluge
  const cards = await page.$$('ion-card.usluga-card');
  console.log('cards found:', cards.length);
  if (cards.length > 0) {
    await cards[0].click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'C:/tmp/usluga-detalj.png' });

    // Klik na volonter row ili dugme
    const volRow = await page.$('.volonter-row');
    if (volRow) {
      await volRow.click();
      await page.waitForTimeout(2500); // ceka API
      await page.screenshot({ path: 'C:/tmp/volonter-profil.png' });

      // Scroll da vidimo recenzije
      const profilSheet = await page.$('.profil-sheet');
      if (profilSheet) {
        await page.evaluate(el => el.scrollTop = 300, profilSheet);
        await page.waitForTimeout(500);
        await page.screenshot({ path: 'C:/tmp/volonter-recenzije.png' });
      }
    }
  }

  await browser.close();
  console.log('done');
})().catch(e => { console.error(e.message); process.exit(1); });
