const fs = require("node:fs");
const path = require("node:path");
const { spawn } = require("node:child_process");
const puppeteer = require("puppeteer");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const rootDir = path.join(__dirname, "..");
const outDir = path.join(rootDir, "demo_captures");
const cleanOutDir = path.join(rootDir, "demo_captures_galaxy_transparent");
const rawDir = path.join(outDir, "raw");
const mockupDir = path.join(outDir, "phone_mockups");
const popupDir = path.join(outDir, "popups");
const cleanMockupDir = path.join(cleanOutDir, "phone_mockups_transparent");
const cleanPopupDir = path.join(cleanOutDir, "popups");
const port = 4181;
const baseUrl = `http://127.0.0.1:${port}`;
const shots = [];
const rawShots = [];
const popupShots = [];

function startServer() {
  return spawn("python3", ["-m", "http.server", String(port)], {
    cwd: rootDir,
    stdio: "ignore"
  });
}

function prepareOutput() {
  fs.mkdirSync(outDir, { recursive: true });
  for (const entry of fs.readdirSync(outDir)) {
    if (entry === ".gitkeep") continue;
    fs.rmSync(path.join(outDir, entry), { recursive: true, force: true });
  }
  fs.mkdirSync(cleanOutDir, { recursive: true });
  for (const entry of fs.readdirSync(cleanOutDir)) {
    fs.rmSync(path.join(cleanOutDir, entry), { recursive: true, force: true });
  }
  fs.mkdirSync(rawDir, { recursive: true });
  fs.mkdirSync(mockupDir, { recursive: true });
  fs.mkdirSync(popupDir, { recursive: true });
  fs.mkdirSync(cleanMockupDir, { recursive: true });
  fs.mkdirSync(cleanPopupDir, { recursive: true });
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

async function captureRaw(page, file, title, description) {
  const target = path.join(rawDir, file);
  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
  });
  await sleep(120);
  await page.screenshot({ path: target, fullPage: false });
  rawShots.push({ file: `raw/${file}`, title, description });
  return target;
}

async function renderPhoneMockup(browser, rawPath, file, title, description) {
  const page = await browser.newPage();
  await page.setViewport({ width: 380, height: 750, deviceScaleFactor: 2 });
  const src = `data:image/png;base64,${fs.readFileSync(rawPath).toString("base64")}`;
  const cleanFile = file.replace(/\.png$/, "_galaxy_transparent.png");
  await page.setContent(`
    <!doctype html>
    <html>
      <head>
        <style>
          html, body {
            width: 380px;
            height: 750px;
            margin: 0;
            background: transparent;
          }
          body {
            display: grid;
            place-items: center;
          }
          .mockup {
            width: 380px;
            height: 750px;
            display: grid;
            place-items: center;
            background: transparent;
          }
          .phone {
            position: relative;
            width: 318px;
            height: 690px;
            padding: 6px;
            border-radius: 30px;
            background:
              linear-gradient(90deg, #252c42 0%, #0a0b10 7%, #020203 15%, #020203 85%, #11141e 94%, #596274 100%);
            box-shadow: none;
          }
          .phone::before {
            content: "";
            position: absolute;
            inset: 2px;
            border-radius: 28px;
            border: 1px solid rgba(93, 101, 132, 0.86);
            box-shadow:
              inset 0 0 0 1px rgba(255, 255, 255, 0.16),
              inset 0 0 0 3px rgba(0, 0, 0, 0.84);
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
            border-radius: 50%;
            background:
              radial-gradient(circle at 55% 42%, #263f7f 0 14%, #05070d 15% 48%, #111 49% 100%);
            border: 2px solid #0a0a0b;
            box-shadow:
              0 0 0 1px rgba(255, 255, 255, 0.18),
              inset 1px 1px 2px rgba(111, 143, 255, 0.5);
            transform: translateX(-50%);
          }
          .screen {
            position: relative;
            width: 100%;
            height: 100%;
            overflow: hidden;
            border-radius: 24px;
            background: #f7f7f8;
            box-shadow:
              0 0 0 3px #050506,
              inset 0 0 0 1px rgba(255, 255, 255, 0.06);
          }
          img {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .speaker {
            position: absolute;
            left: 50%;
            top: 4px;
            z-index: 5;
            width: 42px;
            height: 2px;
            border-radius: 999px;
            background: rgba(0, 0, 0, 0.34);
            transform: translateX(-50%);
            box-shadow: 0 1px 0 rgba(255, 255, 255, 0.18);
          }
          .antenna {
            position: absolute;
            z-index: 3;
            background: rgba(210, 214, 221, 0.34);
            border-radius: 999px;
          }
          .antenna.top-left {
            left: 80px;
            top: 2px;
            width: 18px;
            height: 1px;
          }
          .antenna.top-center {
            left: 50%;
            top: 2px;
            width: 20px;
            height: 1px;
            transform: translateX(-50%);
          }
          .antenna.bottom-left {
            left: 80px;
            bottom: 2px;
            width: 19px;
            height: 1px;
          }
          .antenna.bottom-center {
            left: 50%;
            bottom: 2px;
            width: 23px;
            height: 1px;
            transform: translateX(-50%);
          }
          .side-button {
            position: absolute;
            right: -1px;
            z-index: 6;
            width: 3px;
            border-radius: 0 999px 999px 0;
            background: linear-gradient(90deg, #2c3344, #9da5b4 58%, #3c4352);
            box-shadow:
              inset 1px 0 0 rgba(255, 255, 255, 0.32);
          }
          .side-button.volume {
            top: 122px;
            height: 88px;
          }
          .side-button.power {
            top: 228px;
            height: 62px;
          }
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
  await sleep(120);
  const element = await page.$("#mockup");
  const target = path.join(mockupDir, file);
  await element.screenshot({ path: target, omitBackground: true });
  await element.screenshot({ path: path.join(cleanMockupDir, cleanFile), omitBackground: true });
  await page.close();
  shots.push({ file: `phone_mockups/${file}`, title, description });
}

async function capturePage(browser, page, file, title, description) {
  const rawPath = await captureRaw(page, file, title, description);
  await renderPhoneMockup(browser, rawPath, file, title, description);
}

async function captureElement(page, selector, file, title, description) {
  await page.waitForSelector(selector, { visible: true });
  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
  });
  await sleep(120);
  const element = await page.$(selector);
  const target = path.join(popupDir, file);
  await element.screenshot({ path: target, omitBackground: true });
  await element.screenshot({ path: path.join(cleanPopupDir, file.replace(/\.png$/, "_transparent.png")), omitBackground: true });
  popupShots.push({ file: `popups/${file}`, title, description });
}

async function captureReasonCard(browser, data, file, title, description) {
  const page = await browser.newPage();
  await page.setViewport({ width: 430, height: 560, deviceScaleFactor: 3 });
  const rows = data.rows.map((row) => `
    <div class="row">
      <span>${escapeHtml(row.label)}</span>
      <strong>${escapeHtml(row.value)}</strong>
      ${row.state ? `<em>${escapeHtml(row.state)}</em>` : ""}
    </div>
  `).join("");
  const alternatives = data.alternatives.map((text) => `<p>${escapeHtml(text)}</p>`).join("");
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
          body {
            padding: 18px;
          }
          .card {
            width: 360px;
            padding: 18px;
            border: 1px solid #dfe6f2;
            border-radius: 22px;
            background: rgba(255, 255, 255, 0.98);
            box-shadow: 0 20px 48px rgba(37, 58, 96, 0.18);
            color: #111;
          }
          h3 {
            margin: 0 0 7px;
            font-size: 18px;
            line-height: 1.25;
            font-weight: 780;
          }
          .lead {
            margin: 0 0 14px;
            color: #657085;
            font-size: 12px;
            font-weight: 620;
            line-height: 1.45;
            word-break: keep-all;
          }
          .rows {
            display: grid;
            gap: 8px;
          }
          .row {
            display: grid;
            grid-template-columns: 72px minmax(0, 1fr) auto;
            gap: 8px;
            align-items: center;
            padding: 10px 11px;
            border-radius: 14px;
            background: #f7f9fc;
          }
          .row span {
            color: #7b8493;
            font-size: 11px;
            font-weight: 700;
          }
          .row strong {
            min-width: 0;
            overflow: hidden;
            color: #111;
            font-size: 13px;
            font-weight: 760;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .row em {
            padding: 5px 7px;
            border-radius: 999px;
            background: #edf4ff;
            color: #2878ff;
            font-size: 10px;
            font-style: normal;
            font-weight: 760;
          }
          .alt {
            margin-top: 12px;
            padding: 12px;
            border-radius: 14px;
            background: #eef4ff;
          }
          .alt span {
            color: #2878ff;
            font-size: 11px;
            font-weight: 780;
          }
          .alt p {
            margin: 6px 0 0;
            color: #536074;
            font-size: 11px;
            font-weight: 650;
            line-height: 1.35;
            word-break: keep-all;
          }
        </style>
      </head>
      <body>
        <section class="card" id="reasonCard">
          <h3>${escapeHtml(data.title)}</h3>
          <p class="lead">${escapeHtml(data.lead)}</p>
          <div class="rows">${rows}</div>
          ${alternatives ? `<div class="alt"><span>다른 카드는?</span>${alternatives}</div>` : ""}
        </section>
      </body>
    </html>
  `, { waitUntil: "load" });
  const target = path.join(popupDir, file);
  const element = await page.$("#reasonCard");
  await element.screenshot({ path: target, omitBackground: true });
  await element.screenshot({ path: path.join(cleanPopupDir, file.replace(/\.png$/, "_transparent.png")), omitBackground: true });
  await page.close();
  popupShots.push({ file: `popups/${file}`, title, description });
}

async function captureTooltipCard(browser, text, file, title, description) {
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
          body {
            padding: 18px;
          }
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
  const target = path.join(popupDir, file);
  const element = await page.$("#bubble");
  await element.screenshot({ path: target, omitBackground: true });
  await element.screenshot({ path: path.join(cleanPopupDir, file.replace(/\.png$/, "_transparent.png")), omitBackground: true });
  await page.close();
  popupShots.push({ file: `popups/${file}`, title, description });
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function openResultHelp(page, index = 0) {
  await page.waitForSelector(".result-help", { visible: true });
  await page.evaluate((buttonIndex) => {
    const buttons = Array.from(document.querySelectorAll(".result-help"));
    buttons[buttonIndex]?.click();
  }, index);
  await sleep(220);
}

async function captureResultHelp(browser, page, prefix, index, label) {
  await openResultHelp(page, index);
  await capturePage(
    browser,
    page,
    `${prefix}_result_help_${index + 1}_${label}.png`,
    `${prefix} 결과 도움말 - ${label}`,
    "사후 결제 페이지에서 ?를 눌렀을 때 계산 근거 말풍선이 열린 화면"
  );
  const text = await page.evaluate((buttonIndex) => {
    const buttons = Array.from(document.querySelectorAll(".result-help"));
    return buttons[buttonIndex]?.dataset.help || "";
  }, index);
  if (text) {
    await captureTooltipCard(
      browser,
      text,
      `${prefix}_tooltip_${index + 1}_${label}.png`,
      `${prefix} 말풍선 단독 - ${label}`,
      "PPT에 휴대폰 테두리 없이 얹기 위한 계산 근거 말풍선 단독 PNG"
    );
  }
  await page.evaluate(() => {
    document.querySelectorAll(".result-help.is-open").forEach((button) => button.classList.remove("is-open"));
  });
  await sleep(120);
}

async function captureAvailableResultHelps(browser, page, prefix) {
  const labels = await page.evaluate(() => Array.from(document.querySelectorAll(".result-help")).map((button, index) => {
    const label = button.getAttribute("aria-label") || `help ${index + 1}`;
    const normalized = label
      .replace(/\s*계산 방식\s*/g, "")
      .replace(/\s+/g, "_")
      .replace(/[^0-9A-Za-z가-힣_]/g, "");
    const dictionary = {
      "OK캐쉬백": "okcashbag",
      "카드_혜택": "card_benefit",
      "포인트": "point",
      "해피포인트": "happy_point",
      "포인트_사용": "point_use"
    };
    return dictionary[normalized] || normalized.toLowerCase();
  }));
  for (let index = 0; index < labels.length; index += 1) {
    await captureResultHelp(browser, page, prefix, index, labels[index] || `help_${index + 1}`);
  }
}

async function captureReasonPopover(browser, page, prefix) {
  await click(page, "#reasonButton");
  await capturePage(
    browser,
    page,
    `${prefix}_reason_popover.png`,
    `${prefix} 추천 이유 팝업`,
    "추천 이유 ?를 눌러 뱅크샐러드 기준과 추천 근거를 확인하는 화면"
  );
  const reasonData = await page.evaluate(() => ({
    title: document.querySelector("#reasonPopover h3")?.innerText || "추천 이유",
    lead: document.querySelector("#reasonPopover p")?.innerText || "",
    rows: Array.from(document.querySelectorAll("#reasonDetailList .reason-detail-row")).map((row) => ({
      label: row.querySelector("span")?.innerText || "",
      value: row.querySelector("strong")?.innerText || "",
      state: row.querySelector("em")?.innerText || ""
    })),
    alternatives: Array.from(document.querySelectorAll("#reasonPopover .reason-alternatives p")).map((row) => row.innerText)
  }));
  await captureReasonCard(
    browser,
    reasonData,
    `${prefix}_reason_popover_only.png`,
    `${prefix} 추천 이유 말풍선 단독`,
    "PPT에 휴대폰 테두리 없이 얹기 위한 추천 이유 팝업 단독 PNG"
  );
  await click(page, "#reasonButton", 120);
}

async function captureComboFlow(browser, page, prefix, locationId, scenarioName) {
  await openHome(page);
  await changeLocation(page, locationId);
  await capturePage(browser, page, `${prefix}_01_home.png`, `${scenarioName} 홈`, "현재 위치 기반 추천 카드와 기본 CTA가 보이는 첫 화면");

  await click(page, "#swapToggleButton");
  await capturePage(browser, page, `${prefix}_02_home_minimized.png`, `${scenarioName} 추천 접힘`, "SWAP 추천을 접은 상태의 홈 화면");
  await click(page, "#swapToggleButton");

  await click(page, "#changePlaceButton");
  await capturePage(browser, page, `${prefix}_03_location_sheet.png`, `${scenarioName} 위치 변경`, "수서 후보 매장 3개 중 실제 결제 매장을 선택하는 화면");
  await click(page, "#closeLocationSheet");

  await openDetail(page);
  await capturePage(browser, page, `${prefix}_04_combo_sheet.png`, `${scenarioName} 추천 조합`, "쿠폰/포인트/멤버십과 적용 조건을 확인하고 조합 결제로 넘어가는 화면");
  await click(page, "#expandDetailButton");
  await capturePage(browser, page, `${prefix}_05_detail_expanded.png`, `${scenarioName} 추천 상세`, "추천 기준과 추천 사유를 확장해서 보는 화면");
  await captureReasonPopover(browser, page, prefix);
  await click(page, "#detailSheet .criteria-pill[data-scenario='mileage']");
  await capturePage(browser, page, `${prefix}_06_detail_mileage_preview.png`, `${scenarioName} 마일리지 기준 미리보기`, "마일리지 기준으로 바꾸면 추천 카드가 어떻게 달라지는지 보는 화면");
  await click(page, "#detailSheet .criteria-pill[data-scenario='performance_fill']");
  await capturePage(browser, page, `${prefix}_07_detail_performance_preview.png`, `${scenarioName} 실적 기준 미리보기`, "실적 기준으로 바꾸면 추천 카드가 어떻게 달라지는지 보는 화면");
  await click(page, "#closeSheet");

  await openDetail(page);
  await click(page, "#comboPayButton");
  await capturePage(browser, page, `${prefix}_08_pay_first_step.png`, `${scenarioName} 결제 전 첫 단계`, "카드 결제 전 쿠폰 또는 포인트를 먼저 처리하는 단계");
  const canOpenExtra = await page.evaluate(() => !document.querySelector("#payExtraToggle")?.hidden);
  if (canOpenExtra) {
    await click(page, "#payExtraToggle");
    await capturePage(browser, page, `${prefix}_09_pay_extra_options.png`, `${scenarioName} 다른 혜택 보기`, "추가 쿠폰/멤버십 후보를 직접 선택하는 화면");
  }
  await click(page, "#completeButton");
  await capturePage(browser, page, `${prefix}_10_pay_second_step.png`, `${scenarioName} 결제 전 두 번째 단계`, "멤버십 적립 또는 다음 혜택 단계를 처리하는 화면");
  const canOpenSecondExtra = await page.evaluate(() => !document.querySelector("#payExtraToggle")?.hidden);
  if (canOpenSecondExtra) {
    await click(page, "#payExtraToggle");
    await capturePage(browser, page, `${prefix}_10b_pay_second_extra_options.png`, `${scenarioName} 두 번째 단계 다른 혜택`, "두 번째 혜택 단계에서 다른 쿠폰/멤버십 후보를 직접 선택하는 화면");
  }
  await advanceUntilPaymentStep(page);
  await capturePage(browser, page, `${prefix}_11_pay_card_step.png`, `${scenarioName} 카드 결제 단계`, "NFC 카드 결제를 진행하는 화면");
  await click(page, "#completeButton");
  await capturePage(browser, page, `${prefix}_12_payment_result.png`, `${scenarioName} 결제 결과`, "결제 후 실제 승인금액 기준 혜택 총합과 breakdown을 보여주는 화면");
  await captureAvailableResultHelps(browser, page, prefix);
}

async function captureDirectPay(browser, page, prefix, locationId, scenarioName) {
  await openHome(page);
  await changeLocation(page, locationId);
  await click(page, "#walletPayButton");
  await capturePage(browser, page, `${prefix}_13_direct_card_pay.png`, `${scenarioName} 직접 카드 결제`, "추천 조합 없이 선택한 카드로 바로 NFC 결제하는 화면");
  await click(page, "#payExtraLauncher");
  const canOpenExtra = await page.evaluate(() => !document.querySelector("#payExtraToggle")?.hidden);
  if (canOpenExtra) await click(page, "#payExtraToggle");
  await capturePage(browser, page, `${prefix}_14_direct_extra_overlay.png`, `${scenarioName} 직접 결제 중 혜택`, "직접 결제 중에도 쿠폰/포인트/멤버십을 추가로 꺼내는 화면");
}

async function captureSettings(browser, page, scenarioKey, file, title, description) {
  await openHome(page);
  await click(page, "#settingsButton");
  await click(page, `#settingsSheet .scenario[data-scenario='${scenarioKey}']`);
  await capturePage(browser, page, file, title, description);
}

function writeReadme() {
  const rows = [...shots, ...popupShots, ...rawShots]
    .map((shot) => `| [${shot.file}](./${shot.file}) | ${shot.title} | ${shot.description} |`)
    .join("\n");
  const content = `# SWAP Demo Captures

수서 SK 주유소 / 배스킨라빈스 / 투썸플레이스 시나리오 기준 자동 캡쳐 산출물입니다.

- \`phone_mockups/\`: 배경 투명 PNG 스마트폰 목업. PPT에 바로 배치하는 용도입니다.
- \`popups/\`: \`?\` 팝업 말풍선만 따로 딴 투명 PNG입니다.
- \`raw/\`: 목업 처리 전 원본 화면 캡쳐입니다.

| 파일 | 화면 | 목적 |
| --- | --- | --- |
${rows}
`;
  fs.writeFileSync(path.join(outDir, "README.md"), content);

  const cleanMockups = fs.readdirSync(cleanMockupDir)
    .filter((file) => file.endsWith(".png"))
    .sort()
    .map((file) => `| [phone_mockups_transparent/${file}](./phone_mockups_transparent/${file}) | Galaxy transparent mockup | 그림자 없는 760x1500 투명 배경 목업 |`)
    .join("\n");
  const cleanPopups = fs.readdirSync(cleanPopupDir)
    .filter((file) => file.endsWith(".png"))
    .sort()
    .map((file) => `| [popups/${file}](./popups/${file}) | Popup transparent asset | PPT에 바로 얹는 말풍선/팝업 단독 PNG |`)
    .join("\n");
  fs.writeFileSync(path.join(cleanOutDir, "README.md"), `# Galaxy Transparent Captures

PPT 배치용 새 산출물 폴더입니다. 기존 \`demo_captures\`와 다른 파일명으로 생성합니다.

- \`phone_mockups_transparent/\`: 그림자 없는 760x1500 Galaxy 스타일 투명 목업
- \`popups/\`: 휴대폰 테두리 없이 쓰는 투명 말풍선/팝업

| 파일 | 종류 | 설명 |
| --- | --- | --- |
${cleanMockups}
${cleanPopups ? `\n${cleanPopups}` : ""}
`);
}

async function main() {
  prepareOutput();
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

    await captureComboFlow(browser, page, "sk", "skenergy", "SK엔크린 중앙에너비스 수서지점");
    await captureDirectPay(browser, page, "sk", "skenergy", "SK엔크린 중앙에너비스 수서지점");

    await captureComboFlow(browser, page, "baskin", "baskin", "배스킨라빈스 강남수서점");
    await captureDirectPay(browser, page, "baskin", "baskin", "배스킨라빈스 강남수서점");

    await captureComboFlow(browser, page, "twosome", "twosome", "투썸플레이스 강남수서점");
    await captureDirectPay(browser, page, "twosome", "twosome", "투썸플레이스 강남수서점");

    await captureSettings(browser, page, "max_benefit", "settings_01_benefit.png", "AI 추천 설정 - 혜택", "추천 기준을 혜택 중심으로 선택하는 설정 화면");
    await captureSettings(browser, page, "mileage", "settings_02_mileage.png", "AI 추천 설정 - 마일리지", "추천 기준을 마일리지 중심으로 선택하는 설정 화면");
    await captureSettings(browser, page, "performance_fill", "settings_03_performance.png", "AI 추천 설정 - 실적", "추천 기준을 실적 중심으로 선택하는 설정 화면");

    writeReadme();
  } finally {
    await browser.close();
    server.kill();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
