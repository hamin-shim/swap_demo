const fs = require("node:fs");
const path = require("node:path");
const { spawn } = require("node:child_process");
const puppeteer = require("puppeteer");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const rootDir = path.join(__dirname, "..");
const outDir = path.join(rootDir, "demo_captures");
const port = 4181;
const baseUrl = `http://127.0.0.1:${port}`;
const shots = [];

function startServer() {
  return spawn("python3", ["-m", "http.server", String(port)], {
    cwd: rootDir,
    stdio: "ignore"
  });
}

function prepareOutput() {
  fs.mkdirSync(outDir, { recursive: true });
}

async function click(page, selector) {
  await page.waitForSelector(selector, { visible: true });
  await page.click(selector);
  await sleep(260);
}

async function waitReady(page) {
  await page.waitForSelector("#whyButton", { visible: true });
  await page.evaluate(async () => {
    if (document.fonts?.ready) {
      await document.fonts.ready;
    }
  });
  await page.waitForFunction(() => {
    const icon = document.querySelector(".wallet-tab .material-symbols-rounded");
    return icon && getComputedStyle(icon).fontFamily.includes("Material Symbols");
  }, { timeout: 5000 });
  await sleep(380);
}

async function capture(page, file, title, description) {
  const target = path.join(outDir, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  await page.evaluate(async () => {
    if (document.fonts?.ready) {
      await document.fonts.ready;
    }
  });
  await sleep(120);
  await page.screenshot({ path: target, fullPage: false });
  shots.push({ file, title, description });
}

async function openHome(page) {
  await page.goto(baseUrl, { waitUntil: "networkidle0" });
  await waitReady(page);
}

async function changeLocation(page, locationId) {
  await click(page, "#changePlaceButton");
  await click(page, `.location-option[data-location='${locationId}']`);
  await click(page, "#applyLocationButton");
}

async function openDetail(page) {
  await click(page, "#whyButton");
}

async function advanceUntilPaymentStep(page) {
  for (let i = 0; i < 4; i += 1) {
    const payStep = await page.evaluate(() => document.querySelector(".screen-pay")?.dataset.payStep);
    if (payStep === "payment") return;
    await click(page, "#completeButton");
  }
}

async function openExpandedDetail(page) {
  await openDetail(page);
  await click(page, "#expandDetailButton");
}

async function captureSettings(page, scenarioKey, file, title, description) {
  await openHome(page);
  await click(page, "#settingsButton");
  await click(page, `#settingsSheet .scenario[data-scenario='${scenarioKey}']`);
  await capture(page, file, title, description);
}

async function captureComboFlow(page, prefix, locationId, scenarioName) {
  await openHome(page);
  if (locationId !== "gscaltex") {
    await changeLocation(page, locationId);
  }
  await capture(
    page,
    `${prefix}_01_home.png`,
    `${scenarioName} 홈`,
    "위치 기반으로 현재 매장에서 기대되는 결제 혜택과 추천 카드를 먼저 보여주는 화면"
  );

  await click(page, "#swapToggleButton");
  await capture(
    page,
    `${prefix}_02_home_minimized.png`,
    `${scenarioName} 추천 접힘`,
    "사용자가 SWAP 추천을 잠시 접고 일반 카드 선택 흐름으로 볼 수 있는 최소화 상태"
  );
  await click(page, "#swapToggleButton");

  await click(page, "#changePlaceButton");
  await capture(
    page,
    `${prefix}_03_location_sheet.png`,
    `${scenarioName} 위치 변경`,
    "매장이 잘못 잡혔을 때 후보 매장을 고르고 적용 전까지 홈 추천을 바꾸지 않는 화면"
  );
  await click(page, "#closeLocationSheet");

  await openDetail(page);
  await capture(
    page,
    `${prefix}_04_combo_sheet.png`,
    `${scenarioName} 추천 조합`,
    "추천 카드, 쿠폰, 멤버십과 예상 혜택을 확인하고 이 조합으로 결제를 시작하는 화면"
  );
  await click(page, "#expandDetailButton");
  await capture(
    page,
    `${prefix}_05_detail_expanded.png`,
    `${scenarioName} 추천 상세`,
    "혜택, 마일리지, 실적 기준을 비교하고 적용 전 변화량을 확인하는 상세 화면"
  );
  await click(page, "#detailSheet .criteria-pill[data-scenario='mileage']");
  await capture(
    page,
    `${prefix}_06_detail_mileage_preview.png`,
    `${scenarioName} 마일리지 기준 미리보기`,
    "다른 추천 기준을 눌렀을 때 결제 조합이 어떻게 달라지는지 적용 전 보여주는 화면"
  );
  await click(page, "#closeSheet");

  await openDetail(page);
  await click(page, "#comboPayButton");
  await capture(
    page,
    `${prefix}_07_pay_benefit_step.png`,
    `${scenarioName} 적립/쿠폰 단계`,
    "카드 결제 전에 필요한 멤버십이나 쿠폰 바코드를 먼저 제시하는 SWAP 결제 1단계"
  );
  await click(page, "#payExtraToggle");
  await capture(
    page,
    `${prefix}_08_pay_extra_options.png`,
    `${scenarioName} 다른 쿠폰/멤버십 보기`,
    "추천 조합 외에 사용자가 직접 추가 쿠폰이나 멤버십을 고를 수 있는 화면"
  );
  await advanceUntilPaymentStep(page);
  await capture(
    page,
    `${prefix}_09_pay_card_step.png`,
    `${scenarioName} 카드 결제 단계`,
    "바코드 사용 후 NFC 카드 결제를 진행하는 SWAP 결제 2단계"
  );
  await click(page, "#completeButton");
  await capture(
    page,
    `${prefix}_10_payment_result.png`,
    `${scenarioName} 결제 결과`,
    "결제 후 예상 혜택, 사용 수단, 실적 진행 금액과 카드사 앱 확인 CTA를 보여주는 화면"
  );
}

async function captureDirectPay(page, prefix, locationId, scenarioName) {
  await openHome(page);
  if (locationId !== "gscaltex") {
    await changeLocation(page, locationId);
  }
  await click(page, "#walletPayButton");
  await capture(
    page,
    `${prefix}_11_direct_card_pay.png`,
    `${scenarioName} 직접 카드 결제`,
    "SWAP 추천 조합을 쓰지 않고 선택한 카드로 바로 NFC 결제를 여는 기본 월렛 흐름"
  );
  await click(page, "#payExtraLauncher");
  await click(page, "#payExtraToggle");
  await capture(
    page,
    `${prefix}_12_direct_extra_overlay.png`,
    `${scenarioName} 직접 결제 중 쿠폰/멤버십`,
    "직접 카드 결제 중에도 기존 삼성월렛처럼 쿠폰과 멤버십 바코드를 추가로 띄우는 화면"
  );
}

function writeReadme() {
  const rows = shots.map((shot) => `| [${shot.file}](./${shot.file}) | ${shot.title} | ${shot.description} |`).join("\n");
  const content = `# SWAP Demo Captures

Galaxy S26 기준 모바일 뷰포트(412 x 915, DPR 3)에서 자동 캡쳐한 데모 화면입니다.

| 파일 | 화면 | 목적 |
| --- | --- | --- |
${rows}
`;
  fs.writeFileSync(path.join(outDir, "README.md"), content);
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
    await captureComboFlow(page, "gs", "gscaltex", "GS칼텍스 삼평주유소");
    await captureDirectPay(page, "gs", "gscaltex", "GS칼텍스 삼평주유소");

    await captureComboFlow(page, "baskin", "baskin", "베스킨라빈스");
    await captureDirectPay(page, "baskin", "baskin", "베스킨라빈스");

    await captureSettings(
      page,
      "max_benefit",
      "settings_01_benefit.png",
      "AI 추천 설정 - 혜택",
      "홈 더보기에서 추천 기준을 혜택 중심으로 선택했을 때의 설정 화면"
    );
    await captureSettings(
      page,
      "mileage",
      "settings_02_mileage.png",
      "AI 추천 설정 - 마일리지",
      "홈 더보기에서 추천 기준을 마일리지 중심으로 선택했을 때의 설정 화면"
    );
    await captureSettings(
      page,
      "performance_fill",
      "settings_03_performance.png",
      "AI 추천 설정 - 실적",
      "홈 더보기에서 추천 기준을 실적 중심으로 선택했을 때의 설정 화면"
    );

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
