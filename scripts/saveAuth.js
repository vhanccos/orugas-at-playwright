const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page    = await context.newPage();

  await page.goto('https://teammatesv4.appspot.com/login?nextUrl=/web/instructor/home');


  await page.waitForURL('**/instructor/home', { timeout: 0 });
  await context.storageState({ path: 'auth/storageState.json' });

  console.log('Sesion guardada en auth/storageState.json');
  await browser.close();

})();
