const puppeteer = require('puppeteer');
const PuppeteerHar = require('puppeteer-har');
const fs = require('fs');
require('dotenv').config();

(async () => {
    const browser = await puppeteer.launch({
        headless: true,
        executablePath: process.env.CHROMIUM
    });
    const page = await browser.newPage();

    const har = new PuppeteerHar(page);
    await har.start({ path: './output/network-report.har' });
    // 导航到目标网页
    await page.goto(process.env.URL, { waitUntil: 'networkidle0' });

    await har.stop();
    await browser.close();

    console.log('Network logs have been saved to networkLogs.har');
  })();