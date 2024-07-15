import puppeteer from "puppeteer-core";
import dotenv from 'dotenv';

dotenv.config();

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env.CHROMIUM
  });

  const page = await browser.newPage();

  await page.tracing.start({
    path: './output/performance-report.json',
    screenshots: true,
  });

  await page.goto(process.env.URL, { waitUntil: 'networkidle0' });

  await new Promise(resolve => setTimeout(resolve, 500));

  // 停止性能跟踪
  await page.tracing.stop();

  // 关闭浏览器
  await browser.close();

  console.log('Performance tracing complete. Trace file saved as trace.json.');
})();