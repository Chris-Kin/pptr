import puppeteer from 'puppeteer-core';
import lighthouse from 'lighthouse';
import { URL } from 'node:url';
import fs from 'node:fs';
import dotenv from 'dotenv';

dotenv.config();

(async () => {
  // 启动 Puppeteer
  const browser = await puppeteer.launch({
    headless: true, // 设置为 false 以便看到浏览器的操作
    args: ['--remote-debugging-port=9222'], // 启用远程调试
    executablePath: process.env.CHROMIUM
  });

  // 获取 Puppeteer 的 webSocketDebuggerUrl
  const browserWSEndpoint = await browser.wsEndpoint();

  // 使用 Lighthouse 进行分析
  const url = process.env.URL;
  const { report } = await lighthouse(url, {
    port: new URL(browserWSEndpoint).port,
    output: 'html', // 生成 HTML 报告
    logLevel: 'info',
    emulatedFormFactor: 'mobile',
    disableDeviceEmulation: false,
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
  });

  // 将 Lighthouse 报告保存到文件
  fs.writeFileSync('./output/lighthouse-report.html', report);

  // 关闭浏览器
  await browser.close();

  console.log('Lighthouse analysis complete. Report saved as lighthouse-report.html.');
})();
