const fs = require("node:fs");
const path = require("node:path");
const { spawn } = require("node:child_process");
const puppeteer = require("puppeteer");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const rootDir = path.join(__dirname, "..");
const outDir = path.join(rootDir, "demo_captures_custom");
const rawDir = path.join(outDir, "raw");
const mockupDir = path.join(outDir, "phone_mockups_transparent");
const popupDir = path.join(outDir, "popups");
const port = 4182;
const baseUrl = `http://127.0.0.1:${port}`;

function parseArgs(argv) {
  const args = {
    location: "skenergy",
    preset: "home",
    mode: "page",
    name: "",
    selector: ""
  };

  for (let i = 2; i < argv.length; i += 1) {
    const key = argv[i];
    const value = argv[i + 1];
    if (key === "--help" || key === "-h") {
      args.help = true;
    } else if (key.startsWith("--")) {
      args[key.slice(2)] = value;
      i += 1;
    }
  }

  return args;
}

function printHelp() {
  console.log(`
Usage:
  npm run capture:custom -- --preset result-help-1 --location skenergy --name sk_help_card
  npm run capture:custom -- --preset reason-popup --location baskin --mode both
  npm run capture:custom -- --preset combo-expanded --selector "#detailSheet" --name combo_sheet_only

Options:
  --location  skenergy | baskin | twosome   default: skenergy
  --preset    home | home-minimized | location-sheet | combo | combo-expanded
              reason-popup | pay-first | pay-second | pay-card | result
              result-help-1 | result-help-2 | direct-pay | direct-extra
              settings-benefit | settings-mileage | settings-performance
  --mode      page | element | both          default: page
  --selector  CSS selector to capture as a transparent standalone asset
  --name      output filename base

Outputs:
  demo_captures_custom/raw/
  demo_captures_custom/phone_mockups_transparent/
  demo_captures_custom/popups/
`);
}

function startServer() {
  return spawn("python3", ["-m", "http.server", String(port)], {
    cwd: rootDir,
    stdio: "ignore"
  });
}

function prepareOutput() {
  fs.mkdirSync(rawDir, { recursive: true });
  fs.mkdirSync(mockupDir, { recursive: true });
  fs.mkdirSync(popupDir, { recursive: true });
}

async function click(page, selector, delay = 260) {
  await page.waitForSelector(selector, { visible: true });
  await page.click(selector);
  await sleep(delay);
}

async function waitReady(page) {
  await page.waitForSelector("#whyButton", { visible: true });
  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
  });
  await page.waitForFunction(() => {
    const icon = document.querySelector(".wallet-tab .material-symbols-rounded");
    return icon && getComputedStyle(icon).fontFamily.includes("Material Symbols");
  }, { timeout: 5000 });
  await sleep(420);
}

async function openHome(page) {
  await page.goto(baseUrl, { waitUntil: "networkidle0" });
  await waitReady(page);
}

async function changeLocation(page, locationId) {
  if (locationId === "skenergy") return;
  await click(page, "#changePlaceButton");
  await click(page, `.location-option[data-location='${locationId}']`);
  await click(page, "#applyLocationButton");
}

async function openDetail(page) {
  await click(page, "#whyButton");
}

async function openExpandedDetail(page) {
  await openDetail(page);
  await click(page, "#expandDetailButton");
}

async function advanceUntilPaymentStep(page) {
  for (let i = 0; i < 5; i += 1) {
    const payStep = await page.evaluate(() => document.querySelector(".screen-pay")?.dataset.payStep);
    if (payStep === "payment") return;
    await click(page, "#completeButton", 220);
  }
}

async function completePayment(page) {
  await advanceUntilPaymentStep(page);
  await click(page, "#completeButton", 260);
}

async function setPreset(page, args) {
  await openHome(page);
  await changeLocation(page, args.location);

  switch (args.preset) {
    case "home":
      return;
    case "home-minimized":
      await click(page, "#swapToggleButton");
      return;
    case "location-sheet":
      await click(page, "#changePlaceButton");
      return;
    case "combo":
      await openDetail(page);
      return;
    case "combo-expanded":
      await openExpandedDetail(page);
      return;
    case "reason-popup":
      await openExpandedDetail(page);
      await click(page, "#reasonButton");
      return;
    case "pay-first":
      await openDetail(page);
      await click(page, "#comboPayButton");
      return;
    case "pay-second":
      await openDetail(page);
      await click(page, "#comboPayButton");
      await click(page, "#completeButton");
      return;
    case "pay-card":
      await openDetail(page);
      await click(page, "#comboPayButton");
      await advanceUntilPaymentStep(page);
      return;
    case "result":
      await openDetail(page);
      await click(page, "#comboPayButton");
      await completePayment(page);
      return;
    case "result-help-1":
    case "result-help-2": {
      await openDetail(page);
      await click(page, "#comboPayButton");
      await completePayment(page);
      const index = args.preset === "result-help-1" ? 0 : 1;
      await page.waitForSelector(".result-help", { visible: true });
      await page.evaluate((buttonIndex) => {
        Array.from(document.querySelectorAll(".result-help"))[buttonIndex]?.click();
      }, index);
      await sleep(220);
      return;
    }
    case "direct-pay":
      await click(page, "#walletPayButton");
      return;
    case "direct-extra":
      await click(page, "#walletPayButton");
      await click(page, "#payExtraLauncher");
      if (await page.evaluate(() => !document.querySelector("#payExtraToggle")?.hidden)) {
        await click(page, "#payExtraToggle");
      }
      return;
    case "settings-benefit":
    case "settings-mileage":
    case "settings-performance": {
      const scenario = {
        "settings-benefit": "max_benefit",
        "settings-mileage": "mileage",
        "settings-performance": "performance_fill"
      }[args.preset];
      await click(page, "#settingsButton");
      await click(page, `#settingsSheet .scenario[data-scenario='${scenario}']`);
      return;
    }
    default:
      throw new Error(`Unknown preset: ${args.preset}`);
  }
}

async function captureRaw(page, basename) {
  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
  });
  await sleep(120);
  const file = `${basename}.png`;
  const target = path.join(rawDir, file);
  await page.screenshot({ path: target, fullPage: false });
  return target;
}

async function renderPhoneMockup(browser, rawPath, basename) {
  const page = await browser.newPage();
  await page.setViewport({ width: 380, height: 750, deviceScaleFactor: 2 });
  const src = `data:image/png;base64,${fs.readFileSync(rawPath).toString("base64")}`;
  await page.setContent(`
    <!doctype html>
    <html>
      <head>
        <style>
          html, body { width: 380px; height: 750px; margin: 0; background: transparent; }
          body { display: grid; place-items: center; }
          .mockup { width: 380px; height: 750px; display: grid; place-items: center; background: transparent; }
          .phone {
            position: relative;
            width: 318px;
            height: 690px;
            padding: 6px;
            border-radius: 30px;
            background: linear-gradient(90deg, #252c42 0%, #0a0b10 7%, #020203 15%, #020203 85%, #11141e 94%, #596274 100%);
            box-shadow: none;
          }
          .phone::before {
            content: "";
            position: absolute;
            inset: 2px;
            border: 1px solid rgba(93, 101, 132, 0.86);
            border-radius: 28px;
            box-shadow: inset 0 0 0 1px rgba(255,255,255,0.16), inset 0 0 0 3px rgba(0,0,0,0.84);
            pointer-events: none;
          }
          .phone::after {
            content: "";
            position: absolute;
            left: 50%;
            top: 17px;
            z-index: 4;
            width: 12px;
            height: 12px;
            border: 2px solid #0a0a0b;
            border-radius: 50%;
            background: radial-gradient(circle at 55% 42%, #263f7f 0 14%, #05070d 15% 48%, #111 49% 100%);
            box-shadow: 0 0 0 1px rgba(255,255,255,0.18), inset 1px 1px 2px rgba(111,143,255,0.5);
            transform: translateX(-50%);
          }
          .screen {
            position: relative;
            width: 100%;
            height: 100%;
            overflow: hidden;
            border-radius: 24px;
            background: #f7f7f8;
            box-shadow: 0 0 0 3px #050506, inset 0 0 0 1px rgba(255,255,255,0.06);
          }
          img { display: block; width: 100%; height: 100%; object-fit: cover; }
          .speaker {
            position: absolute;
            left: 50%;
            top: 4px;
            z-index: 5;
            width: 42px;
            height: 2px;
            border-radius: 999px;
            background: rgba(0,0,0,0.34);
            transform: translateX(-50%);
          }
          .antenna { position: absolute; z-index: 3; height: 1px; border-radius: 999px; background: rgba(210,214,221,0.34); }
          .antenna.top-left { left: 80px; top: 2px; width: 18px; }
          .antenna.top-center { left: 50%; top: 2px; width: 20px; transform: translateX(-50%); }
          .antenna.bottom-left { left: 80px; bottom: 2px; width: 19px; }
          .antenna.bottom-center { left: 50%; bottom: 2px; width: 23px; transform: translateX(-50%); }
          .side-button {
            position: absolute;
            right: -1px;
            z-index: 6;
            width: 3px;
            border-radius: 0 999px 999px 0;
            background: linear-gradient(90deg, #303646, #8992a4 60%, #3f4658);
          }
          .side-button.volume { top: 122px; height: 88px; }
          .side-button.power { top: 228px; height: 62px; }
        </style>
      </head>
      <body>
        <div class="mockup" id="mockup">
          <div class="phone">
            <i class="antenna top-left"></i>
            <i class="antenna top-center"></i>
            <i class="antenna bottom-left"></i>
            <i class="antenna bottom-center"></i>
            <i class="side-button volume"></i>
            <i class="side-button power"></i>
            <div class="screen"><img src="${src}" alt=""></div>
            <i class="speaker"></i>
          </div>
        </div>
      </body>
    </html>
  `, { waitUntil: "load" });
  await page.waitForFunction(() => {
    const image = document.querySelector("img");
    return image?.complete && image.naturalWidth > 0;
  });
  const element = await page.$("#mockup");
  const target = path.join(mockupDir, `${basename}_galaxy_transparent.png`);
  await element.screenshot({ path: target, omitBackground: true });
  await page.close();
  return target;
}

async function captureElement(page, selector, basename) {
  await page.waitForSelector(selector, { visible: true });
  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
  });
  await sleep(120);
  const element = await page.$(selector);
  const target = path.join(popupDir, `${basename}_element_transparent.png`);
  await element.screenshot({ path: target, omitBackground: true });
  return target;
}

async function captureTooltipText(browser, text, basename) {
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 220, deviceScaleFactor: 3 });
  await page.setContent(`
    <!doctype html>
    <html>
      <head>
        <style>
          html, body {
            margin: 0;
            background: transparent;
            font-family: "One UI Sans APP VF", "One UI Sans", "SamsungOne", Roboto, "Noto Sans KR", Arial, sans-serif;
          }
          body { padding: 18px; }
          .bubble {
            position: relative;
            width: 300px;
            padding: 11px 13px;
            border: 1px solid #dfe6f2;
            border-radius: 14px;
            background: #fff;
            box-shadow: 0 14px 34px rgba(37, 58, 96, 0.18);
            color: #4f5b70;
            font-size: 12px;
            font-weight: 650;
            line-height: 1.45;
            word-break: keep-all;
          }
          .bubble::after {
            content: "";
            position: absolute;
            right: 22px;
            bottom: -6px;
            width: 11px;
            height: 11px;
            border-right: 1px solid #dfe6f2;
            border-bottom: 1px solid #dfe6f2;
            background: #fff;
            transform: rotate(45deg);
          }
        </style>
      </head>
      <body><div class="bubble" id="bubble">${escapeHtml(text)}</div></body>
    </html>
  `, { waitUntil: "load" });
  const element = await page.$("#bubble");
  const target = path.join(popupDir, `${basename}_tooltip_transparent.png`);
  await element.screenshot({ path: target, omitBackground: true });
  await page.close();
  return target;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.help) {
    printHelp();
    return;
  }

  prepareOutput();
  const basename = args.name || `${args.location}_${args.preset}`;
  const server = startServer();
  await sleep(700);

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
    await setPreset(page, args);

    const outputs = [];
    if (args.mode === "page" || args.mode === "both") {
      const rawPath = await captureRaw(page, basename);
      outputs.push(rawPath);
      outputs.push(await renderPhoneMockup(browser, rawPath, basename));
    }

    if (args.selector || args.mode === "element" || args.mode === "both") {
      if (!args.selector && args.preset.startsWith("result-help")) {
        const text = await page.evaluate(() => document.querySelector(".result-help.is-open")?.dataset.help || "");
        if (!text) throw new Error("No open result help tooltip text found.");
        outputs.push(await captureTooltipText(browser, text, basename));
      } else {
        const selector = args.selector || (args.preset === "reason-popup" ? "#reasonPopover" : ".result-help.is-open");
        outputs.push(await captureElement(page, selector, basename));
      }
    }

    console.log(outputs.join("\n"));
  } finally {
    await browser.close();
    server.kill();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
