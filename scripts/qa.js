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
      secondary: document.querySelector("#changePlaceButton").innerText,
      merchant: document.querySelector("#merchantName").innerText,
      time: document.querySelector(".status-left strong").innerText,
      tabs: Array.from(document.querySelectorAll(".wallet-tab em")).map((item) => item.innerText).join(","),
      activeTab: document.querySelector(".wallet-tab.is-active em").innerText,
      noticeButtons: document.querySelectorAll(".notice-button").length,
      homeIndicators: document.querySelectorAll(".home-indicator").length,
      bodyOverflowY: getComputedStyle(document.body).overflowY,
      bodyOverscrollY: getComputedStyle(document.body).overscrollBehaviorY
    }));
    await assert(initial.appHeight === initial.viewport, "S26 viewport height mismatch");
    await assert(initial.primary === "4,500원 할인 예상", "primary recommendation CTA mismatch");
    await assert(initial.secondary === "다른 매장이에요", "location CTA mismatch");
    await assert(initial.merchant.includes("GS칼텍스"), "default merchant should be GS Caltex");
    await assert(initial.time === "12:45", "status bar time should match Galaxy mock time");
    await assert(initial.tabs === "혜택,빠른 실행,전체", "wallet bottom tabs mismatch");
    await assert(initial.activeTab === "빠른 실행", "wallet quick launch tab should be active");
    await assert(initial.noticeButtons === 1, "wallet header should include notice action");
    await assert(initial.homeIndicators === 0, "OS home indicator should not be implemented inside the page");
    await assert(initial.bodyOverflowY !== "hidden", "body vertical overflow should not block browser pull-to-refresh");
    await assert(initial.bodyOverscrollY !== "none", "body overscroll should not block browser pull-to-refresh");

    await page.evaluate(() => document.querySelector("#swapToggleButton").click());
    await sleep(150);
    const minimized = await page.evaluate(() => ({
      minimized: document.querySelector("#swapAssist").classList.contains("is-minimized"),
      expanded: document.querySelector("#swapToggleButton").getAttribute("aria-expanded"),
      text: document.querySelector("#swapMinimizedText").innerText,
      actionsVisible: getComputedStyle(document.querySelector(".ai-actions")).display !== "none",
      badgeCount: document.querySelectorAll(".card-badge").length,
      hint: document.querySelector("#walletHint").innerText
    }));
    await assert(minimized.minimized, "SWAP assist should enter minimized state");
    await assert(minimized.expanded === "false", "minimized SWAP assist should expose collapsed aria state");
    await assert(minimized.text === "결제 추천 다시 켜기", "minimized SWAP copy mismatch");
    await assert(!minimized.actionsVisible, "recommendation actions should be hidden when minimized");
    await assert(minimized.badgeCount === 0, "card recommendation badge should be hidden when minimized");
    await assert(minimized.hint === "추천 없이 선택한 카드로 결제할 수 있어요", "minimized wallet hint mismatch");
    await page.evaluate(() => document.querySelector("#swapToggleButton").click());
    await sleep(150);

    await page.evaluate(() => document.querySelector("#settingsButton").click());
    await sleep(150);
    const dragState = await page.evaluate(() => {
      const handle = document.querySelector("#settingsSheet .sheet-handle");
      const box = handle.getBoundingClientRect();
      const x = box.left + box.width / 2;
      const y = box.top + box.height / 2;
      handle.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, cancelable: true, pointerId: 1, clientX: x, clientY: y }));
      window.dispatchEvent(new PointerEvent("pointermove", { bubbles: true, cancelable: true, pointerId: 1, clientX: x, clientY: y + 150 }));
      const transformDuringDrag = getComputedStyle(document.querySelector("#settingsSheet")).transform;
      window.dispatchEvent(new PointerEvent("pointerup", { bubbles: true, cancelable: true, pointerId: 1, clientX: x, clientY: y + 150 }));
      return { transformDuringDrag };
    });
    await sleep(250);
    const settingsClosedByDrag = await page.evaluate(() => !document.querySelector("#settingsSheet").classList.contains("is-open"));
    await assert(dragState.transformDuringDrag !== "matrix(1, 0, 0, 1, 0, 0)", "settings sheet should follow the drag before closing");
    await assert(settingsClosedByDrag, "settings sheet should close when dragged down from handle");

    await page.evaluate(() => document.querySelector("#whyButton").click());
    await sleep(150);
    const expandedByDrag = await page.evaluate(() => {
      const sheet = document.querySelector("#detailSheet");
      const handle = sheet.querySelector(".sheet-handle");
      const box = handle.getBoundingClientRect();
      const x = box.left + box.width / 2;
      const y = box.top + box.height / 2;
      handle.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, cancelable: true, pointerId: 2, clientX: x, clientY: y }));
      window.dispatchEvent(new PointerEvent("pointermove", { bubbles: true, cancelable: true, pointerId: 2, clientX: x, clientY: y - 100 }));
      const transformDuringDrag = getComputedStyle(sheet).transform;
      window.dispatchEvent(new PointerEvent("pointerup", { bubbles: true, cancelable: true, pointerId: 2, clientX: x, clientY: y - 100 }));
      return {
        transformDuringDrag,
        expanded: sheet.classList.contains("is-expanded")
      };
    });
    await assert(expandedByDrag.transformDuringDrag !== "matrix(1, 0, 0, 1, 0, 0)", "detail sheet should follow upward handle drag");
    await assert(expandedByDrag.expanded, "detail sheet should expand when dragged up from handle");

    await page.evaluate(() => document.querySelector("#closeSheet").click());
    await sleep(100);
    await page.evaluate(() => document.querySelector(".payment-card[data-index='2']").click());
    await sleep(100);
    const selectedCardCta = await page.evaluate(() => ({
      primary: document.querySelector("#whyButton").innerText,
      badge: document.querySelector(".payment-card[data-index='2'] .card-badge")?.innerText
    }));
    await assert(selectedCardCta.primary === "정유사 확인", "selected card CTA should summarize its benefit condition");
    await assert(selectedCardCta.badge === "선택", "selected non-recommended card badge should show selected state");

    await page.evaluate(() => document.querySelector("#whyButton").click());
    await sleep(150);
    await page.evaluate(() => document.querySelector("#detailSheet .criteria-pill[data-scenario='max_benefit']").click());
    await sleep(50);

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
    await page.evaluate(() => document.querySelector(".location-option[data-location='skenergy']").click());
    await sleep(100);
    const locationState = await page.evaluate(() => ({
      hasPreview: !!document.querySelector("#locationPreview"),
      disabled: document.querySelector("#applyLocationButton").disabled,
      text: document.querySelector("#applyLocationButton").innerText
    }));
    await assert(!locationState.hasPreview, "location benefit preview should be removed");
    await assert(!locationState.disabled, "location apply should be enabled after selecting SK Energy");
    await assert(locationState.text === "이 매장으로 보기", "location apply copy mismatch");
    await page.evaluate(() => document.querySelector("#applyLocationButton").click());
    await sleep(150);

    await page.evaluate(() => document.querySelector("#changePlaceButton").click());
    await sleep(150);
    await page.evaluate(() => document.querySelector(".location-option[data-location='baskin']").click());
    await sleep(100);
    await page.evaluate(() => document.querySelector("#applyLocationButton").click());
    await sleep(150);
    const baskinState = await page.evaluate(() => ({
      merchant: document.querySelector("#merchantName").innerText,
      primary: document.querySelector("#whyButton").innerText,
      badge: document.querySelector(".payment-card[data-index='3'] .card-badge")?.innerText
    }));
    await assert(baskinState.merchant.includes("배스킨라빈스"), "Baskin Robbins merchant should render after location change");
    await assert(baskinState.primary === "7,300원 할인 예상", "Baskin Robbins primary CTA mismatch");
    await assert(baskinState.badge === "추천", "Baskin Robbins recommended card badge mismatch");
    await page.evaluate(() => document.querySelector("#whyButton").click());
    await sleep(150);
    const baskinCombo = await page.evaluate(() => ({
      card: document.querySelector("#comboCard").innerText,
      coupon: document.querySelector("#comboCoupon").innerText,
      membership: document.querySelector("#comboMembership").innerText,
      benefit: document.querySelector("#benefitText").innerText
    }));
    await assert(baskinCombo.card === "현대카드 M BOOST", "Baskin Robbins combo card mismatch");
    await assert(baskinCombo.coupon.includes("M포인트"), "Baskin Robbins combo should include Hyundai M point use");
    await assert(baskinCombo.membership === "해피포인트", "Baskin Robbins combo should include Happy Point");
    await assert(baskinCombo.benefit === "7,300원", "Baskin Robbins combo benefit mismatch");
    await page.evaluate(() => document.querySelector("#closeSheet").click());
    await sleep(100);

    await page.evaluate(() => document.querySelector("#comboPayButton").click());
    await sleep(150);
    const payCopy = await page.evaluate(() => ({
      top: document.querySelector("#payTabs").innerText,
      title: document.querySelector("#payStepTitle").innerText,
      button: document.querySelector("#completeButton").innerText,
      stepType: document.querySelector("#payStepType").innerText,
      stepCode: document.querySelector("#payStepCode").innerText,
      barcodeVisible: getComputedStyle(document.querySelector(".barcode")).display !== "none",
      steps: Array.from(document.querySelectorAll("#payStackList .pay-step-button")).map((item) => item.innerText.replace(/\n/g, " ")).join(","),
      membershipMentions: document.body.innerText.match(/멤버십 적립/g)?.length || 0,
      overlayVisible: getComputedStyle(document.querySelector(".pay-overlay")).display !== "none",
      activeStepWidth: Math.round(document.querySelector(".pay-step-button.is-active").getBoundingClientRect().width),
      panelWidth: Math.round(document.querySelector("#payFlowPanel").getBoundingClientRect().width),
      titleVisible: getComputedStyle(document.querySelector("#payStepTitle")).display !== "none"
    }));
    await assert(payCopy.top === "혜택 순서", "pay top copy mismatch");
    await assert(payCopy.steps === "1 적립/쿠폰,2 결제", "Baskin Robbins should combine coupon and membership before payment");
    await assert(payCopy.stepType === "적립/쿠폰", "combined benefit step should be labeled as coupon and membership use");
    await assert(payCopy.stepCode === "3108 2407 1142", "combined benefit step should show Happy Point barcode number");
    await assert(payCopy.barcodeVisible, "combined benefit step should show a barcode");
    await assert(!payCopy.overlayVisible, "pay overlay should be hidden to avoid duplicated card explanation");
    await assert(!payCopy.titleVisible, "pay step title should be hidden next to progress badge");
    await assert(payCopy.activeStepWidth < payCopy.panelWidth * 0.55, "single pay step should not fill the full panel width");
    await assert(!/이어서|이제/.test(payCopy.title), "pay title should avoid repeated transition words");
    await assert(payCopy.membershipMentions === 0, "visible membership wording is too repetitive");

    for (let i = 0; i < 2; i += 1) {
      await page.evaluate(() => document.querySelector("#completeButton").click());
      await sleep(150);
    }
    const result = await page.evaluate(() => ({
      screen: document.querySelector(".screen.is-active").dataset.screen,
      rows: document.querySelectorAll(".result-status-row").length,
      summary: document.querySelector("#resultSummary").innerText,
      nextHint: document.querySelector("#resultNextHint").innerText,
      canScroll: document.querySelector(".screen-result").scrollHeight > document.querySelector(".screen-result").clientHeight,
      doneText: document.querySelector("#resultDoneButton").innerText
    }));
    await assert(result.screen === "result", "result screen did not open");
    await assert(result.rows >= 3, "result rows should render from benefit breakdown");
    await assert(result.summary.includes("아꼈어요"), "result should emphasize saved benefit");
    await assert(result.nextHint.includes("8,000원"), "Baskin Robbins result should show remaining lifestyle performance amount");
    await assert(result.doneText === "완료", "result done button is missing");

    await page.evaluate(() => {
      const resultScreen = document.querySelector(".screen-result");
      resultScreen.scrollTop = resultScreen.scrollHeight;
    });
    await sleep(100);
    const scrolled = await page.evaluate(() => document.querySelector(".screen-result").scrollTop > 0);
    await assert(scrolled || !result.canScroll, "result screen should scroll when content is taller than viewport");

    await page.evaluate(() => document.querySelector("#resultDoneButton").click());
    await sleep(100);
    const backToWallet = await page.evaluate(() => document.querySelector(".screen.is-active").dataset.screen);
    await assert(backToWallet === "wallet", "result done button should return to wallet");

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
