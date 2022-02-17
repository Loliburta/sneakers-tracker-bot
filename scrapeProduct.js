const puppeteer = require("puppeteer-extra");
const pluginStealth = require("puppeteer-extra-plugin-stealth");

module.exports = scrapeProduct = async (url) => {
  puppeteer.use(pluginStealth());
  const browser = await puppeteer.launch({ headless: 0 });
  const page = await browser.newPage();
  try {
    await page.goto(url, { timeout: 4000 });
  } catch (err) {
    console.log(
      "ignore this one because browser will loads many things that u do not need"
    );
  }
  const content = await page.evaluate(() => {
    const divs = [
      ...document.querySelectorAll(
        "#buyTools > div:nth-child(1) > fieldset > div > div"
      ),
    ];
    const shoes = divs.map((div) => {
      return {
        size: div.textContent.trim().match(/(\d+\.\d+)|(\d+)/g)[0],
        isAvailable: !div.querySelector("input").disabled,
      };
    });
    const price = document
      .querySelector(".product-price")
      .textContent.trim()
      .match(/(\d+\,\d+)|(\d+)/g)[0]
      .replace(",", ".");
    return { shoes, price };
  });
  await browser.close();
  return content;
};
