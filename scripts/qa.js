const { spawn } = require("node:child_process");
const puppeteer = require("puppeteer");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const port = 4175;
const baseUrl = `http://127.0.0.1:${port}`;

function startServer() {
  const server = spawn("python3", ["-m", "http.server", String(port)], {
    cwd: __dirname + "/..",
    stdio: "ignore"
  });
  return server;
}

async function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function main() {
  const server = startServer();
  await sleep(600);

  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: {
      width: 412,
      height: 915,
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true
    }
  });

  try {
    const page = await browser.newPage();
    await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
    await page.waitForSelector("#whyButton");
    await sleep(300);

    const initial = await page.evaluate(() => ({
      appHeight: Math.round(document.querySelector(".app-shell").getBoundingClientRect().height),
      viewport: window.innerHeight,
      primary: document.querySelector("#whyButton").innerText,
      secondary: document.querySelector("#changePlaceButton").innerText
    }));
    await assert(initial.appHeight === initial.viewport, "S26 viewport height mismatch");
    await assert(initial.primary === "추천 보기", "primary recommendation CTA mismatch");
    await assert(initial.secondary === "다른 매장이에요", "location CTA mismatch");

    await page.evaluate(() => document.querySelector("#whyButton").click());
    await sleep(150);
    const criteria = await page.evaluate(() => Array.from(document.querySelectorAll("#detailSheet .criteria-pill")).map((item) => item.innerText));
    await assert(criteria.join(",") === "혜택,마일리지,실적", "detail criteria should be 3 options");

    await page.evaluate(() => document.querySelector("#detailSheet .criteria-pill[data-scenario='mileage']").click());
    await sleep(100);
    const mileagePreview = await page.evaluate(() => ({
      title: document.querySelector("#criteriaPreviewTitle").innerText,
      text: document.querySelector("#criteriaPreviewText").innerText,
      disabled: document.querySelector("#applyCriteriaButton").disabled
    }));
    await assert(mileagePreview.title.includes("마일리지"), "mileage preview did not update");
    await assert(!mileagePreview.disabled, "criteria apply should be enabled after change");
    await page.evaluate(() => document.querySelector("#applyCriteriaButton").click());
    await sleep(150);
    await assert(await page.evaluate(() => !document.querySelector("#detailSheet").classList.contains("is-open")), "detail sheet did not close after apply");

    await page.evaluate(() => document.querySelector("#changePlaceButton").click());
    await sleep(150);
    await page.evaluate(() => document.querySelector(".location-option[data-location='cu']").click());
    await sleep(100);
    const locationState = await page.evaluate(() => ({
      hasPreview: !!document.querySelector("#locationPreview"),
      disabled: document.querySelector("#applyLocationButton").disabled,
      text: document.querySelector("#applyLocationButton").innerText
    }));
    await assert(!locationState.hasPreview, "location benefit preview should be removed");
    await assert(!locationState.disabled, "location apply should be enabled after selecting CU");
    await assert(locationState.text === "이 매장으로 보기", "location apply copy mismatch");
    await page.evaluate(() => document.querySelector("#applyLocationButton").click());
    await sleep(150);

    await page.evaluate(() => document.querySelector("#comboPayButton").click());
    await sleep(150);
    const payCopy = await page.evaluate(() => ({
      top: document.querySelector("#payTabs").innerText,
      title: document.querySelector("#payStepTitle").innerText,
      button: document.querySelector("#completeButton").innerText,
      membershipMentions: document.body.innerText.match(/멤버십 적립/g)?.length || 0
    }));
    await assert(payCopy.top === "혜택 순서", "pay top copy mismatch");
    await assert(!/이어서|이제/.test(payCopy.title), "pay title should avoid repeated transition words");
    await assert(payCopy.membershipMentions === 0, "visible membership wording is too repetitive");

    await page.evaluate(() => document.querySelector("#completeButton").click());
    await sleep(100);
    await page.evaluate(() => document.querySelector("#completeButton").click());
    await sleep(200);
    const result = await page.evaluate(() => ({
      screen: document.querySelector(".screen.is-active").dataset.screen,
      rows: document.querySelectorAll(".result-status-row").length
    }));
    await assert(result.screen === "result", "result screen did not open");
    await assert(result.rows >= 3, "result rows should render from benefit breakdown");

    console.log("QA passed");
  } finally {
    await browser.close();
    server.kill("SIGTERM");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
