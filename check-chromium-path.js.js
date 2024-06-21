const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const browserWSEndpoint = browser.wsEndpoint();
  const browserProcess = browser.process();
  
  console.log(`Chromium version: ${await browser.version()}`);
  console.log(`Chromium executable path: ${browserProcess.spawnfile}`);
  
  await browser.close();
})();
