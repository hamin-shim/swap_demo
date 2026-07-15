const { spawn } = require("node:child_process");
const puppeteer = require("puppeteer");

const port = 4177;
const baseUrl = `http://127.0.0.1:${port}`;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const viewports = [
  { name: "iphone-se-visible", width: 375, height: 667, scale: 1 },
  { name: "iphone-standard", width: 390, height: 844, scale: 1 },
  { name: "iphone-standard-large-text", width: 390, height: 844, scale: 1.25 },
  { name: "galaxy-standard", width: 412, height: 915, scale: 1 },
  { name: "galaxy-browser-short", width: 412, height: 760, scale: 1.2 },
  { name: "narrow-android", width: 360, height: 740, scale: 1.2 }
];

function startServer() {
  return spawn("python3", ["-m", "http.server", String(port)], {
    cwd: __dirname + "/..",
    stdio: "ignore"
  });
}

async function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function inspectLayout(page) {
  return page.evaluate(() => {
    const viewportHeight = Math.round(window.visualViewport?.height || window.innerHeight);
    const viewportWidth = document.documentElement.clientWidth;
    const rect = (selector) => {
      const node = document.querySelector(selector);
      const box = node.getBoundingClientRect();
      return {
        top: Math.round(box.top),
        right: Math.round(box.right),
        bottom: Math.round(box.bottom),
        left: Math.round(box.left),
        width: Math.round(box.width),
        height: Math.round(box.height)
      };
    };

    return {
      viewportHeight,
      viewportWidth,
      scrollX: window.scrollX,
      documentWidth: document.documentElement.scrollWidth,
      bodyWidth: document.body.scrollWidth,
      walletPay: rect("#walletPayButton"),
      tabbar: rect(".wallet-tabbar"),
      detailSheet: rect("#detailSheet"),
      benefitFormula: rect("#benefitFormula"),
      selectedCard: rect("#selectedCard"),
      criteriaPreview: rect("#criteriaPreview"),
      reasonButton: rect("#reasonButton"),
      applyCriteriaButton: rect("#applyCriteriaButton"),
      comboStackDisplay: getComputedStyle(document.querySelector("#detailSheet .combo-stack")).display
    };
  });
}

function overlap(a, b) {
  return a.bottom > b.top - 1 && a.top < b.bottom - 1;
}

async function main() {
  const server = startServer();
  await sleep(600);
  const browser = await puppeteer.launch({ headless: true });

  try {
    for (const viewport of viewports) {
      const page = await browser.newPage();
      await page.setCacheEnabled(false);
      await page.setViewport({
        width: viewport.width,
        height: viewport.height,
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true
      });
      await page.goto(`${baseUrl}/?qa=${Date.now()}`, { waitUntil: "networkidle0" });
      await page.addStyleTag({
        content: `.bottom-sheet, .bottom-sheet * { font-size: calc(1em * ${viewport.scale}); }`
      });
      await sleep(250);

      await page.evaluate(() => window.scrollTo(9999, 0));
      await sleep(50);
      let layout = await inspectLayout(page);
      await assert(layout.scrollX === 0, `${viewport.name}: page drifted horizontally`);
      await assert(layout.documentWidth <= layout.viewportWidth + 1, `${viewport.name}: document has horizontal overflow`);
      await assert(layout.bodyWidth <= layout.viewportWidth + 1, `${viewport.name}: body has horizontal overflow`);
      await assert(layout.walletPay.bottom <= layout.viewportHeight + 1, `${viewport.name}: wallet pay button is clipped`);
      await assert(layout.tabbar.bottom <= layout.viewportHeight + 1, `${viewport.name}: tabbar is clipped`);

      await page.evaluate(() => {
        window.scrollTo(0, 0);
        document.querySelector("#whyButton").click();
      });
      await sleep(100);
      await page.evaluate(() => document.querySelector("#expandDetailButton").click());
      await sleep(150);
      layout = await inspectLayout(page);

      await assert(layout.comboStackDisplay === "none", `${viewport.name}: expanded detail sheet should hide combo stack`);
      await assert(layout.detailSheet.top >= 0, `${viewport.name}: detail sheet starts above viewport`);
      await assert(layout.detailSheet.bottom <= layout.viewportHeight + 1, `${viewport.name}: detail sheet extends below viewport`);
      await assert(!overlap(layout.benefitFormula, layout.selectedCard), `${viewport.name}: benefit formula overlaps selected card text`);
      await assert(!overlap(layout.selectedCard, layout.criteriaPreview), `${viewport.name}: selected card overlaps criteria preview`);
      await assert(!overlap(layout.criteriaPreview, layout.reasonButton), `${viewport.name}: criteria preview overlaps reason button`);
      await assert(!overlap(layout.reasonButton, layout.applyCriteriaButton), `${viewport.name}: reason button overlaps apply button`);
      await assert(layout.applyCriteriaButton.bottom <= layout.viewportHeight + 1, `${viewport.name}: criteria apply button is clipped`);

      await page.close();
    }
  } finally {
    await browser.close();
    server.kill();
  }

  console.log("Mobile layout QA passed");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
