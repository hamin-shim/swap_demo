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
    await assert(initial.primary === "10% 할인 가능", "primary recommendation CTA mismatch");
    await assert(initial.secondary === "다른 매장이에요", "location CTA mismatch");
    await assert(initial.merchant.includes("GS칼텍스"), "default merchant should be GS Caltex");
    await assert(initial.time === "12:45", "status bar time should match Galaxy mock time");
    await assert(initial.tabs === "혜택,빠른 실행,전체", "wallet bottom tabs mismatch");
    await assert(initial.activeTab === "빠른 실행", "wallet quick launch tab should be active");
    await assert(initial.noticeButtons === 1, "wallet header should include notice action");
    await assert(initial.homeIndicators === 0, "OS home indicator should not be implemented inside the page");
    await assert(initial.bodyOverflowY !== "hidden", "body vertical overflow should not block browser pull-to-refresh");
    await assert(initial.bodyOverscrollY !== "none", "body overscroll should not block browser pull-to-refresh");

    await page.evaluate(() => document.querySelector("#walletPayButton").click());
    await sleep(150);
    const directPay = await page.evaluate(() => ({
      screen: document.querySelector(".screen.is-active").dataset.screen,
      payStep: document.querySelector(".screen-pay").dataset.payStep,
      stepListHidden: getComputedStyle(document.querySelector("#payStackList")).display === "none",
      launcherVisible: !document.querySelector("#payExtraLauncher").hidden,
      launcherText: document.querySelector("#payExtraLauncher").innerText,
      codeCardHidden: document.querySelector("#payCodeCard").hidden
    }));
    await assert(directPay.screen === "pay", "direct card pay should open payment screen");
    await assert(directPay.payStep === "payment", "direct card pay should start directly on NFC payment");
    await assert(directPay.stepListHidden, "direct card pay should not show the SWAP step sequence");
    await assert(directPay.launcherVisible, "direct card pay should expose top coupon membership launcher");
    await assert(directPay.launcherText === "쿠폰/멤버십 사용하기", "direct card pay launcher copy mismatch");
    await assert(directPay.codeCardHidden, "direct card pay should not show barcode before launcher is tapped");

    await page.evaluate(() => document.querySelector("#payExtraLauncher").click());
    await sleep(100);
    const directExtra = await page.evaluate(() => ({
      payStep: document.querySelector(".screen-pay").dataset.payStep,
      top: document.querySelector("#payTabs").innerText,
      steps: Array.from(document.querySelectorAll("#payStackList .pay-step-button")).map((item) => item.innerText.replace(/\n/g, " ")).join(","),
      stepListHidden: getComputedStyle(document.querySelector("#payStackList")).display === "none",
      launcherVisible: !document.querySelector("#payExtraLauncher").hidden,
      codeCardHidden: document.querySelector("#payCodeCard").hidden,
      stepType: document.querySelector("#payStepType").innerText,
      stepValue: document.querySelector("#payStepValue").innerText,
      theme: document.querySelector("#payCodeCard").dataset.extraTheme,
      options: Array.from(document.querySelectorAll("#payExtraList .pay-extra-option")).map((item) => item.innerText.replace(/\n/g, " ")).join(","),
      themes: Array.from(document.querySelectorAll("#payExtraList .pay-extra-option")).map((item) => item.dataset.extraTheme).join(",")
    }));
    await assert(directExtra.payStep === "membership", "direct extra flow should switch to membership step");
    await assert(directExtra.top === "혜택 순서", "direct extra flow should use the same benefit sequence UI");
    await assert(directExtra.steps === "1 적립,2 결제", "direct extra flow should show membership then payment steps");
    await assert(!directExtra.stepListHidden, "direct extra flow should show the step sequence");
    await assert(!directExtra.launcherVisible, "direct extra flow should not keep the floating coupon membership launcher");
    await assert(!directExtra.codeCardHidden, "direct card pay should show barcode after launcher is tapped");
    await assert(directExtra.stepType === "적립", "direct extra flow should show the same membership collection label as benefit pay");
    await assert(directExtra.stepValue.includes("GS&POINT"), "direct card pay should offer default membership before NFC");
    await assert(directExtra.theme === "gspoint", "direct card pay default membership theme mismatch");
    await assert(directExtra.options.includes("D-7"), "direct card pay extra coupon should show remaining days");
    await assert(directExtra.themes.includes("oil") && directExtra.themes.includes("ok"), "direct card pay extra options should expose themed membership and coupon cards");

    await page.evaluate(() => document.querySelector("#completeButton").click());
    await sleep(100);
    const directPaymentStep = await page.evaluate(() => ({
      payStep: document.querySelector(".screen-pay").dataset.payStep,
      launcherVisible: !document.querySelector("#payExtraLauncher").hidden,
      codeCardHidden: document.querySelector("#payCodeCard").hidden,
      steps: Array.from(document.querySelectorAll("#payStackList .pay-step-button")).map((item) => item.innerText.replace(/\n/g, " ")).join(",")
    }));
    await assert(directPaymentStep.payStep === "payment", "direct card pay should stay on NFC payment while using extras");
    await assert(!directPaymentStep.launcherVisible, "direct extra flow should keep the floating launcher hidden on NFC payment");
    await assert(directPaymentStep.codeCardHidden, "direct extra flow should hide barcode during NFC payment");
    await assert(directPaymentStep.steps === "1 적립,2 결제", "direct extra payment should keep the same step sequence visible");
    await page.evaluate(() => document.querySelector("#completeButton").click());
    await sleep(150);
    await page.evaluate(() => document.querySelector("#resultDoneButton").click());
    await sleep(150);

    await page.evaluate(() => document.querySelector("#swapToggleButton").click());
    await sleep(150);
    const minimized = await page.evaluate(() => ({
      minimized: document.querySelector("#swapAssist").classList.contains("is-minimized"),
      expanded: document.querySelector("#swapToggleButton").getAttribute("aria-expanded"),
      text: document.querySelector("#swapMinimizedText").innerText,
      textHeight: Math.round(document.querySelector("#swapMinimizedText").getBoundingClientRect().height),
      pillHeight: Math.round(document.querySelector("#swapAssist").getBoundingClientRect().height),
      poweredVisible: getComputedStyle(document.querySelector(".ai-powered")).display !== "none",
      actionsVisible: getComputedStyle(document.querySelector(".ai-actions")).display !== "none",
      badgeCount: document.querySelectorAll(".card-badge").length,
      hint: document.querySelector("#walletHint").innerText
    }));
    await assert(minimized.minimized, "SWAP assist should enter minimized state");
    await assert(minimized.expanded === "false", "minimized SWAP assist should expose collapsed aria state");
    await assert(minimized.text === "결제 추천 다시 켜기", "minimized SWAP copy mismatch");
    await assert(minimized.textHeight <= 20, "minimized SWAP copy should stay on one line");
    await assert(minimized.pillHeight <= 70, "minimized SWAP assist should stay compact");
    await assert(!minimized.poweredVisible, "minimized SWAP assist should hide attribution to avoid layout breaks");
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
    const gsCombo = await page.evaluate(() => ({
      membership: document.querySelector("#comboMembership").innerText,
      membershipLabelDisplay: getComputedStyle(document.querySelector(".combo-membership-item span")).display,
      membershipValueDisplay: getComputedStyle(document.querySelector("#comboMembership")).display,
      formula: document.querySelector("#benefitFormula").innerText
    }));
    await assert(gsCombo.membership === "GS&POINT 자동 적립 (리터당 2P)", "GS combo membership should be compact and include accrual rate");
    await assert(gsCombo.membershipLabelDisplay === "block" && gsCombo.membershipValueDisplay === "block", "combo membership label and value should stack vertically");
    await assert(!gsCombo.formula.includes("뱅크샐러드 기준"), "GS formula should not say Banksalad 기준");
    await assert(gsCombo.formula.includes("전월 실적을 충족") && gsCombo.formula.includes("27,500원"), "GS formula should explain remaining monthly discount cap");
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
      badge: document.querySelector(".payment-card[data-index='2'] .card-badge")?.innerText,
      insight: document.querySelector("#selectedCard").innerText
    }));
    await assert(selectedCardCta.primary === "정유사 선택 확인", "selected card CTA should summarize its chosen oil-brand condition");
    await assert(selectedCardCta.badge === "선택", "selected non-recommended card badge should show selected state");
    await assert(selectedCardCta.insight.includes("선택 정유사"), "selected Deep Oil card should explain chosen oil-brand matching");

    await page.evaluate(() => document.querySelector("#whyButton").click());
    await sleep(150);
    await page.evaluate(() => document.querySelector("#detailSheet .criteria-pill[data-scenario='max_benefit']").click());
    await sleep(50);

    const criteria = await page.evaluate(() => Array.from(document.querySelectorAll("#detailSheet .criteria-pill")).map((item) => item.innerText));
    await assert(criteria.join(",") === "혜택,마일리지,실적", "detail criteria should be 3 options");

    await page.evaluate(() => document.querySelector("#detailSheet .criteria-pill[data-scenario='performance_fill']").click());
    await sleep(100);
    const performancePreview = await page.evaluate(() => ({
      title: document.querySelector("#criteriaPreviewTitle").innerText,
      text: document.querySelector("#criteriaPreviewText").innerText
    }));
    await assert(performancePreview.title.includes("실적"), "performance preview did not update");
    await assert(performancePreview.text.includes("삼성 iD STATION") && performancePreview.text.includes("388,000원/400,000원"), "performance criteria should recommend the card closest to filling spend");
    await assert(!performancePreview.text.includes("신한 Deep Oil 402,000원/400,000원"), "performance criteria should not recommend an already-filled card");

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
    await assert(baskinState.primary === "M포인트 50% 사용 가능", "Baskin Robbins primary CTA mismatch");
    await assert(baskinState.badge === "추천", "Baskin Robbins recommended card badge mismatch");
    await page.evaluate(() => document.querySelector("#whyButton").click());
    await sleep(150);
    const baskinCombo = await page.evaluate(() => ({
      card: document.querySelector("#comboCard").innerText,
      cardHidden: document.querySelector("#comboCard").closest(".combo-item").hidden,
      coupon: document.querySelector("#comboCoupon").innerText,
      membership: document.querySelector("#comboMembership").innerText,
      benefit: document.querySelector("#benefitText").innerText,
      sheetPowered: !!document.querySelector(".sheet-powered"),
      poweredCount: document.querySelectorAll(".banksalad-brand img").length
    }));
    await assert(baskinCombo.card === "현대카드 M BOOST", "Baskin Robbins combo card mismatch");
    await assert(baskinCombo.cardHidden, "Baskin Robbins combo card row should be hidden");
    await assert(baskinCombo.coupon.includes("M포인트"), "Baskin Robbins combo should include Hyundai M point use");
    await assert(baskinCombo.membership.includes("해피포인트"), "Baskin Robbins combo should include Happy Point");
    await assert(baskinCombo.benefit === "50% 사용", "Baskin Robbins combo benefit mismatch");
    await assert(!baskinCombo.sheetPowered, "combo sheet should not show Banksalad attribution");
    await assert(baskinCombo.poweredCount >= 3, "Banksalad attribution should remain mounted outside combo sheet");
    await page.evaluate(() => document.querySelector("#closeSheet").click());
    await sleep(100);

    await page.evaluate(() => document.querySelector("#comboPayButton").click());
    await sleep(150);
    const payCopy = await page.evaluate(() => ({
      top: document.querySelector("#payTabs").innerText,
      title: document.querySelector("#payStepTitle").innerText,
      button: document.querySelector("#completeButton").innerText,
      stepType: document.querySelector("#payStepType").innerText,
      stepValue: document.querySelector("#payStepValue").innerText,
      stepCode: document.querySelector("#payStepCode").innerText,
      barcodeVisible: getComputedStyle(document.querySelector(".barcode")).display !== "none",
      steps: Array.from(document.querySelectorAll("#payStackList .pay-step-button")).map((item) => item.innerText.replace(/\n/g, " ")).join(","),
      extraButtonVisible: !document.querySelector("#payExtraToggle").hidden,
      extraButtonText: document.querySelector("#payExtraToggle").innerText,
      membershipMentions: document.body.innerText.match(/멤버십 적립/g)?.length || 0,
      overlayVisible: getComputedStyle(document.querySelector(".pay-overlay")).display !== "none",
      activeStepWidth: Math.round(document.querySelector(".pay-step-button.is-active").getBoundingClientRect().width),
      panelWidth: Math.round(document.querySelector("#payFlowPanel").getBoundingClientRect().width),
      titleVisible: getComputedStyle(document.querySelector("#payStepTitle")).display !== "none"
    }));
    await assert(payCopy.top === "혜택 순서", "pay top copy mismatch");
    await assert(payCopy.steps === "1 쿠폰,2 적립,3 결제", "Baskin Robbins should run coupon, membership, payment in order");
    await assert(payCopy.stepType === "쿠폰", "first benefit step should be coupon");
    await assert(payCopy.stepValue.includes("M포인트"), "first benefit step should request M point use");
    await assert(payCopy.stepCode === "직원 또는 키오스크에서 선택", "M point step should show request guidance");
    await assert(!payCopy.barcodeVisible, "M point request step should not show a barcode");
    await assert(payCopy.extraButtonVisible, "coupon step should expose extra coupon membership selector");
    await assert(payCopy.extraButtonText === "다른 쿠폰/멤버십 보기", "extra benefit selector copy mismatch");
    await assert(!payCopy.overlayVisible, "pay overlay should be hidden to avoid duplicated card explanation");
    await assert(!payCopy.titleVisible, "pay step title should be hidden next to progress badge");
    await assert(payCopy.activeStepWidth < payCopy.panelWidth * 0.55, "single pay step should not fill the full panel width");
    await assert(!/이어서|이제/.test(payCopy.title), "pay title should avoid repeated transition words");
    await assert(payCopy.membershipMentions <= 1, "visible membership wording is too repetitive");

    await page.evaluate(() => document.querySelector("#payExtraToggle").click());
    await sleep(100);
    const extraOpen = await page.evaluate(() => ({
      visible: !document.querySelector("#payExtraList").hidden,
      options: Array.from(document.querySelectorAll("#payExtraList .pay-extra-option strong")).map((item) => item.innerText).join(",")
    }));
    await assert(extraOpen.visible, "extra benefit list should open");
    await assert(extraOpen.options.includes("KT 멤버십 VIP"), "extra benefit list should include KT membership");

    await page.evaluate(() => document.querySelector("[data-pay-extra='kt']").click());
    await sleep(100);
    const extraSelected = await page.evaluate(() => ({
      value: document.querySelector("#payStepValue").innerText,
      code: document.querySelector("#payStepCode").innerText,
      guide: document.querySelector("#payGuide").innerText,
      listHidden: document.querySelector("#payExtraList").hidden
    }));
    await assert(extraSelected.value.includes("M포인트"), "coupon step should keep M point request visible after selecting a membership");
    await assert(extraSelected.code === "직원 또는 키오스크에서 선택", "coupon step should keep M point request guidance after selecting a membership");
    await assert(extraSelected.listHidden, "extra benefit list should close after selection");

    await page.evaluate(() => document.querySelector("#completeButton").click());
    await sleep(150);
    const membershipStep = await page.evaluate(() => ({
      payStep: document.querySelector(".screen-pay").dataset.payStep,
      stepType: document.querySelector("#payStepType").innerText,
      stepValue: document.querySelector("#payStepValue").innerText,
      stepCode: document.querySelector("#payStepCode").innerText,
      guide: document.querySelector("#payGuide").innerText
    }));
    await assert(membershipStep.payStep === "membership", "Baskin Robbins should move to membership after coupon step");
    await assert(membershipStep.stepType === "적립", "second step should show membership collection label");
    await assert(membershipStep.stepValue.includes("KT 멤버십 VIP"), "selected extra membership should remain visible on membership step");
    await assert(membershipStep.stepCode === "9000 1485 4927", "membership step should show selected membership barcode");
    await assert(membershipStep.guide.includes("KT 멤버십"), "membership step should keep selected extra guide");

    await page.evaluate(() => document.querySelector("#completeButton").click());
    await sleep(150);
    const paymentReminder = await page.evaluate(() => ({
      payStep: document.querySelector(".screen-pay").dataset.payStep,
      guide: document.querySelector("#payGuide").innerText
    }));
    await assert(paymentReminder.payStep === "payment", "Baskin Robbins should move to payment after membership step");
    await assert(paymentReminder.guide.includes("M포인트 사용을 요청"), "M point use should be reminded during card payment");

    await page.evaluate(() => document.querySelector("#completeButton").click());
    await sleep(150);
    const result = await page.evaluate(() => ({
      screen: document.querySelector(".screen.is-active").dataset.screen,
      rows: Array.from(document.querySelectorAll(".result-status-row")).map((row) => row.innerText),
      summary: document.querySelector("#resultSummary").innerText,
      benefitCardHidden: document.querySelector("#resultBenefitCard").hidden,
      benefitCardDisplay: getComputedStyle(document.querySelector("#resultBenefitCard")).display,
      nextHint: document.querySelector("#resultNextHint").innerText,
      canScroll: document.querySelector(".screen-result").scrollHeight > document.querySelector(".screen-result").clientHeight,
      doneText: document.querySelector("#resultDoneButton").innerText,
      planner: document.querySelector("#plannerButton").innerText,
      note: document.querySelector("#cardAppNote").innerText,
      helpCount: document.querySelectorAll(".result-help").length,
      helpMarkup: document.querySelector(".result-help")?.innerHTML || "",
      rowPairs: Array.from(document.querySelectorAll(".result-status-row")).map((row) => ({
        labelLeft: Math.round(row.querySelector(":scope > span").getBoundingClientRect().left),
        valueLeft: Math.round(row.querySelector("strong").getBoundingClientRect().left)
      })),
      bg: getComputedStyle(document.querySelector(".screen-result")).backgroundImage
    }));
    await assert(result.screen === "result", "result screen did not open");
    await assert(result.rows.length >= 3, "result rows should render from benefit breakdown");
    await assert(!result.rows.join(" ").includes("카드 결제"), "result rows should not duplicate card payment name");
    await assert(result.summary.includes("아꼈어요"), "result should emphasize saved benefit");
    await assert(result.benefitCardHidden, "discount result should hide duplicated expected benefit card");
    await assert(result.benefitCardDisplay === "none", "duplicated expected benefit card should not be visible");
    await assert(result.nextHint.includes("8,000원"), "Baskin Robbins result should show remaining lifestyle performance amount");
    await assert(result.doneText === "완료", "result done button is missing");
    await assert(result.planner === "뱅크샐러드 앱에서 확인", "result confirmation CTA should point to Banksalad");
    await assert(result.note.includes("카드사 확정 금액"), "result note should explain final amount variance");
    await assert(!result.note.includes("*"), "result note should not use an asterisk marker");
    await assert(result.helpCount >= 1, "result rows should expose calculation help buttons");
    await assert(result.helpMarkup.includes('aria-hidden="true"'), "result help button should use the same hidden question mark span pattern");
    await assert(result.rowPairs.every((pair) => pair.valueLeft > pair.labelLeft), "result rows should place value on the right side of the label");
    await assert(!result.bg.includes("0a0a0b"), "result screen should no longer use dark mode background");

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
