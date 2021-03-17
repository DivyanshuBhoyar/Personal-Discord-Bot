const puppeteer = require("puppeteer");

const chromeOptions = {
  headless: true,
  defaultViewport: null,
  args: ["--incognito", "--no-sandbox", "--single-process", "--no-zygote"],
};

async function scrapeObject(url) {
  const browser = await puppeteer.launch(chromeOptions);
  const page = await browser.newPage();
  await page.goto(url);
  const [ele] = await page.$x('//*[@id="qimage_100618"]');
  const srcText = await (await ele.getProperty("src")).jsonValue();
  console.log(srcText);
  return srcText;
}

module.exports = scrapeObject;
