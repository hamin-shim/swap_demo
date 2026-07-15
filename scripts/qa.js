const puppeteer = require("puppeteer");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const baseUrl = process.env.QA_BASE_URL || "http://127.0.0.1:4176";

async function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function main() {
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
      viewport: Math.round(window.visualViewport?.height || window.innerHeight),
      primary: document.querySelector("#whyButton").innerText,
      secondary: document.querySelector("#changePlaceButton").innerText,
      merchant: document.querySelector("#merchantName").innerText,
      activeTab: document.querySelector(".wallet-tab.is-active em").innerText,
      recommendedBadge: document.querySelector(".card-badge")?.innerText,
      recommendedCardIndex: Array.from(document.querySelectorAll("#cardTrack .payment-card"))
        .findIndex((item) => item.querySelector(".card-badge")),
      bodyOverflowY: getComputedStyle(document.body).overflowY,
      bodyOverscrollY: getComputedStyle(document.body).overscrollBehaviorY,
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: document.documentElement.clientWidth,
      bodyWidth: document.body.scrollWidth
    }));
    await assert(initial.appHeight >= initial.viewport, "app shell should cover at least the viewport height");
    await assert(initial.documentWidth <= initial.viewportWidth + 1, "document should not allow horizontal scrolling");
    await assert(initial.bodyWidth <= initial.viewportWidth + 1, "body should not allow horizontal scrolling");
    await assert(initial.primary === "SK에너지 10% 할인 가능", "SK primary recommendation CTA mismatch");
    await assert(initial.secondary === "다른 매장이에요", "location CTA mismatch");
    await assert(initial.merchant.includes("SK엔크린 중앙에너비스 수서지점"), "default merchant should be Suseo SK station");
    await assert(initial.activeTab === "빠른 실행", "wallet quick launch tab should be active");
    await assert(initial.recommendedBadge === "추천", "recommended card badge should be visible");
    await assert(initial.recommendedCardIndex === 2, "Deep Oil should be the default recommended card");
    await assert(initial.bodyOverflowY !== "hidden", "body vertical overflow should not block browser pull-to-refresh");
    await assert(initial.bodyOverscrollY !== "none", "body overscroll should not block browser pull-to-refresh");
    await assert(!/이전 데모|삼평|판교|GS칼텍스|S-OIL|EV 충전/.test(await page.evaluate(() => document.body.innerText)), "initial screen should not leak old demo locations");
    await assert(!/45,000원|10,000원|12,800원|4,500원|5,000P|46P|50P|128P/.test(await page.evaluate(() => document.body.innerText)), "pre-payment wallet should not leak internal payment amounts");

    await page.evaluate(() => document.querySelector("#swapToggleButton").click());
    await sleep(260);
    const minimized = await page.evaluate(() => ({
      minimized: document.querySelector("#swapAssist").classList.contains("is-minimized"),
      expanded: document.querySelector("#swapToggleButton").getAttribute("aria-expanded"),
      text: document.querySelector("#swapMinimizedText").innerText,
      textHeight: Math.round(document.querySelector("#swapMinimizedText").getBoundingClientRect().height),
      pillHeight: Math.round(document.querySelector("#swapAssist").getBoundingClientRect().height),
      poweredVisible: getComputedStyle(document.querySelector(".ai-powered")).display !== "none",
      actionsVisible: getComputedStyle(document.querySelector(".ai-actions")).display !== "none"
    }));
    await assert(minimized.minimized, "SWAP assist should enter minimized state");
    await assert(minimized.expanded === "false", "minimized SWAP assist should expose collapsed aria state");
    await assert(minimized.text === "결제 추천 다시 켜기", "minimized SWAP copy mismatch");
    await assert(minimized.textHeight <= 20, "minimized SWAP copy should stay on one line");
    await assert(minimized.pillHeight <= 70, "minimized SWAP assist should stay compact");
    await assert(!minimized.poweredVisible, "minimized SWAP assist should hide attribution to avoid layout breaks");
    await assert(!minimized.actionsVisible, "recommendation actions should be hidden when minimized");
    await page.evaluate(() => document.querySelector("#swapToggleButton").click());
    await sleep(260);

    await page.evaluate(() => document.querySelector("#whyButton").click());
    await sleep(150);
    const combo = await page.evaluate(() => ({
      card: document.querySelector("#comboCard").innerText,
      cardHidden: document.querySelector("#comboCard").closest(".combo-item").hidden,
      coupon: document.querySelector("#comboCoupon").innerText,
      membership: document.querySelector("#comboMembership").innerText,
      benefit: document.querySelector("#benefitText").innerText,
      formula: document.querySelector("#benefitFormula").innerText,
      sheetPowered: !!document.querySelector(".sheet-powered"),
      poweredCount: document.querySelectorAll(".banksalad-brand img").length
    }));
    await assert(combo.card === "신한 Deep Oil", "combo should recommend Shinhan Deep Oil");
    await assert(combo.cardHidden, "combo card row should stay hidden to avoid duplicated card info");
    await assert(combo.coupon === "SK 주유쿠폰 확인", "combo should include SK fuel coupon check");
    await assert(combo.membership === "OK캐쉬백 리터당 2P 적립", "combo membership row should show OK Cashbag accrual rate");
    await assert(combo.formula.includes("결제금액의 10%"), "Deep Oil formula should explain card discount condition");
    await assert(combo.benefit === "10% 할인 가능", "combo should not estimate pre-payment won amount");
    await assert(combo.formula.includes("선택 정유사가 SK에너지") && combo.formula.includes("150,000원") && combo.formula.includes("92,000원"), "Deep Oil formula should explain selected oil brand and remaining usage cap");
    await assert(!combo.formula.includes("예상 혜택 4,500원"), "pre-payment copy should not estimate a payment amount");
    await assert(!/45,000원|10,000원|12,800원|4,500원|5,000P|46P|50P|128P/.test(await page.evaluate(() => document.querySelector("#detailSheet").innerText)), "pre-payment detail sheet should not leak internal payment amounts");
    await assert(!combo.sheetPowered, "combo sheet should not add a duplicate sheet-powered attribution");
    await assert(combo.poweredCount >= 3, "Banksalad attribution should remain mounted outside combo sheet");

    await page.evaluate(() => document.querySelector("#reasonButton").click());
    await sleep(100);
    const reason = await page.evaluate(() => ({
      open: document.querySelector("#reasonPopover").classList.contains("is-open"),
      text: document.querySelector("#detailText").innerText,
      aiCheck: document.querySelector("#aiCheckText").innerText,
      rows: Array.from(document.querySelectorAll("#reasonDetailList .reason-detail-row")).map((row) => row.innerText)
    }));
    await assert(reason.open, "reason popover should open");
    await assert(reason.text.includes("뱅크샐러드") && reason.text.includes("선택 정유사"), "reason copy should defend the data source and selected oil-brand condition");
    await assert(reason.aiCheck.includes("SK엔크린"), "reason checklist should include the current SK station");
    await assert(reason.rows.join(" ").includes("OK캐쉬백"), "reason rows should include OK Cashbag");
    await page.evaluate(() => document.querySelector("#closeSheet").click());
    await sleep(100);

    await page.evaluate(() => document.querySelector("#settingsButton").click());
    await sleep(150);
    await page.evaluate(() => document.querySelector("#settingsSheet .scenario[data-scenario='performance_fill']").click());
    await sleep(100);
    const performancePreview = await page.evaluate(() => ({
      title: document.querySelector("#settingsPreviewTitle").innerText,
      text: document.querySelector("#settingsPreviewText").innerText,
      disabled: document.querySelector("#applySettingsButton").disabled
    }));
    await assert(performancePreview.title.includes("실적"), "performance preview did not update");
    await assert(performancePreview.text.includes("KB국민 주유패스") && performancePreview.text.includes("489,000원/500,000원"), "performance criteria should recommend the card closest to filling spend");
    await assert(!performancePreview.text.includes("신한 Deep Oil 402,000원/400,000원"), "performance criteria should not recommend an already-filled card");
    await assert(!performancePreview.disabled, "settings apply should be enabled after criteria change");
    await page.evaluate(() => document.querySelector("#closeSettings").click());
    await sleep(100);

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
    await assert(directPay.stepListHidden, "direct card pay should not show the SWAP step sequence until extras are opened");
    await assert(directPay.launcherVisible, "direct card pay should expose coupon membership launcher");
    await assert(directPay.launcherText === "쿠폰/포인트/멤버십 사용하기", "direct card pay launcher copy mismatch");
    await assert(directPay.codeCardHidden, "direct card pay should not show barcode before launcher is tapped");

    await page.evaluate(() => document.querySelector("#payExtraLauncher").click());
    await sleep(100);
    const directExtra = await page.evaluate(() => ({
      payStep: document.querySelector(".screen-pay").dataset.payStep,
      steps: Array.from(document.querySelectorAll("#payStackList .pay-step-button")).map((item) => item.innerText.replace(/\n/g, " ")).join(","),
      stepType: document.querySelector("#payStepType").innerText,
      stepValue: document.querySelector("#payStepValue").innerText,
      theme: document.querySelector("#payCodeCard").dataset.extraTheme,
      options: Array.from(document.querySelectorAll("#payExtraList .pay-extra-option")).map((item) => item.innerText.replace(/\n/g, " ")).join(",")
    }));
    await assert(directExtra.payStep === "coupon", "direct extra flow should start from SK coupon check");
    await assert(directExtra.steps === "1 쿠폰,2 적립,3 결제", "direct extra flow should mirror coupon, membership, payment sequence");
    await assert(directExtra.stepType === "쿠폰", "first SK extra step should be a coupon");
    await assert(directExtra.stepValue === "SK 주유쿠폰 확인", "first SK extra step should show SK fuel coupon check");
    await assert(directExtra.theme === "sk", "SK coupon should use SK coupon theme");
    await assert(directExtra.options.includes("OK캐쉬백"), "extra list should include OK Cashbag");

    await page.evaluate(() => document.querySelector("#completeButton").click());
    await sleep(100);
    const membershipStep = await page.evaluate(() => ({
      payStep: document.querySelector(".screen-pay").dataset.payStep,
      stepType: document.querySelector("#payStepType").innerText,
      stepValue: document.querySelector("#payStepValue").innerText,
      stepCode: document.querySelector("#payStepCode").innerText,
      theme: document.querySelector("#payCodeCard").dataset.extraTheme,
      guide: document.querySelector("#payGuide").innerText
    }));
    await assert(membershipStep.payStep === "membership", "SK flow should move to OK Cashbag membership after coupon");
    await assert(membershipStep.stepType === "적립", "membership step should use collection label");
    await assert(membershipStep.stepValue.includes("OK캐쉬백"), "membership step should show OK Cashbag");
    await assert(membershipStep.stepCode === "2407 1142 3108", "membership step should show OK Cashbag barcode");
    await assert(membershipStep.theme === "ok", "OK Cashbag should use OK theme");
    await assert(membershipStep.guide.includes("OK캐쉬백"), "membership guide should mention OK Cashbag");

    await page.evaluate(() => document.querySelector("#completeButton").click());
    await sleep(100);
    const paymentStep = await page.evaluate(() => ({
      payStep: document.querySelector(".screen-pay").dataset.payStep,
      guide: document.querySelector("#payGuide").innerText,
      card: document.querySelector("#payCard").innerText
    }));
    await assert(paymentStep.payStep === "payment", "SK flow should move to NFC payment after membership");
    await assert(paymentStep.guide.includes("카드 리더기"), "payment step should show NFC guide");
    await assert(paymentStep.card === "신한 Deep Oil", "payment step should use Deep Oil");

    await page.evaluate(() => document.querySelector("#completeButton").click());
    await sleep(150);
    const result = await page.evaluate(() => ({
      screen: document.querySelector(".screen.is-active").dataset.screen,
      rows: Array.from(document.querySelectorAll(".result-status-row")).map((row) => row.innerText),
      summary: document.querySelector("#resultSummary").innerText,
      learning: document.querySelector("#resultLearning").innerText,
      benefitCardHidden: document.querySelector("#resultBenefitCard").hidden,
      planner: document.querySelector("#plannerButton").innerText,
      note: document.querySelector("#cardAppNote").innerText,
      nextHint: document.querySelector("#resultNextHint").innerText,
      helpMarkup: document.querySelector(".result-help")?.innerHTML || "",
      rowPairs: Array.from(document.querySelectorAll(".result-status-row")).map((row) => ({
        labelLeft: Math.round(row.querySelector(":scope > span").getBoundingClientRect().left),
        valueLeft: Math.round(row.querySelector("strong").getBoundingClientRect().left)
      })),
      bg: getComputedStyle(document.querySelector(".screen-result")).backgroundImage
    }));
    await assert(result.screen === "result", "result screen did not open");
    await assert(result.summary === "이번 결제로 4,546원 혜택 받았어요", "result should show total benefit in the hero line");
    await assert(result.learning === "청구할인 4,500원 + OK캐쉬백 46P", "result subtitle should show card discount and point breakdown");
    await assert(!result.summary.includes("승인금액") && !result.learning.includes("승인금액"), "result hero copy should not explain approved amount basis");
    await assert(result.rows.join(" ").includes("결제금액") && result.rows.join(" ").includes("45,000원"), "result should show payment amount row");
    await assert(result.rows.join(" ").includes("OK캐쉬백") && result.rows.join(" ").includes("46P"), "result should show OK Cashbag accrual row");
    await assert(result.rows.join(" ").includes("카드 혜택") && result.rows.join(" ").includes("4,500원"), "result should show card benefit row");
    await assert(result.benefitCardHidden, "duplicated expected benefit card should stay hidden");
    await assert(result.planner === "뱅크샐러드 앱에서 확인", "result confirmation CTA should point to Banksalad");
    await assert(result.note.includes("카드사 확정 금액") && !result.note.includes("*"), "result note should explain variance without asterisk marker");
    await assert(result.nextHint.includes("Deep Oil"), "result progress hint should mention Deep Oil status");
    await assert(result.helpMarkup.includes('aria-hidden="true"'), "result help button should use hidden question mark span pattern");
    await assert(result.rowPairs.every((pair) => pair.valueLeft > pair.labelLeft), "result rows should place value on the right side of the label");
    await assert(!result.bg.includes("0a0a0b"), "result screen should not use dark mode background");
    await page.evaluate(() => document.querySelector("#resultDoneButton").click());
    await sleep(100);

    await page.evaluate(() => document.querySelector("#changePlaceButton").click());
    await sleep(150);
    const locations = await page.evaluate(() => Array.from(document.querySelectorAll(".location-option strong")).map((item) => item.innerText));
    await assert(locations.includes("SK엔크린 중앙에너비스 수서지점"), "location list should include Suseo SK station");
    await assert(locations.includes("배스킨라빈스 강남수서점"), "location list should include Suseo Baskin Robbins");
    await assert(locations.includes("투썸플레이스 강남수서점"), "location list should include Suseo Twosome");
    await assert(!locations.join(" ").match(/이전 데모|삼평|판교|GS칼텍스|S-OIL|EV 충전/), "location list should not expose old demo locations");

    await page.evaluate(() => document.querySelector(".location-option[data-location='baskin']").click());
    await sleep(100);
    await assert(await page.evaluate(() => !document.querySelector("#applyLocationButton").disabled), "location apply should enable for Baskin");
    await page.evaluate(() => document.querySelector("#applyLocationButton").click());
    await sleep(150);
    const baskin = await page.evaluate(() => ({
      merchant: document.querySelector("#merchantName").innerText,
      primary: document.querySelector("#whyButton").innerText,
      badge: document.querySelector(".payment-card[data-index='3'] .card-badge")?.innerText
    }));
    await assert(baskin.merchant.includes("배스킨라빈스 강남수서점"), "Baskin location should apply");
    await assert(baskin.primary === "M포인트 50% 사용 가능", "Baskin primary CTA mismatch");
    await assert(baskin.badge === "추천", "Baskin should recommend Hyundai M BOOST");

    await page.evaluate(() => document.querySelector("#whyButton").click());
    await sleep(100);
    const baskinCombo = await page.evaluate(() => ({
      couponHidden: document.querySelector("#comboCoupon").closest(".combo-item").hidden,
      pointHidden: document.querySelector("#comboPoint").closest(".combo-item").hidden,
      point: document.querySelector("#comboPoint").innerText,
      membership: document.querySelector("#comboMembership").innerText,
      sheetText: document.querySelector("#detailSheet").innerText
    }));
    await assert(baskinCombo.couponHidden, "Baskin M Point should not be rendered as coupon");
    await assert(!baskinCombo.pointHidden && baskinCombo.point.includes("M포인트"), "Baskin should render M Point as a separate point row");
    await assert(baskinCombo.membership.includes("해피포인트") && baskinCombo.membership.includes("0.5%"), "Baskin membership should show Happy Point accrual rate");
    await assert(!baskinCombo.sheetText.includes("멤버십 적립은 별도로 챙겨요"), "awkward membership copy should be removed");
    await page.evaluate(() => document.querySelector("#comboPayButton").click());
    await sleep(120);
    const baskinPay = await page.evaluate(() => ({
      payStep: document.querySelector(".screen-pay").dataset.payStep,
      steps: Array.from(document.querySelectorAll("#payStackList .pay-step-button")).map((item) => item.innerText.replace(/\n/g, " ")).join(","),
      stepType: document.querySelector("#payStepType").innerText,
      stepCode: document.querySelector("#payStepCode").innerText,
      theme: document.querySelector("#payCodeCard").dataset.extraTheme
    }));
    await assert(baskinPay.payStep === "point", "Baskin flow should start from point usage, not coupon");
    await assert(baskinPay.steps === "1 포인트,2 적립,3 결제", "Baskin flow should use point, membership, payment sequence");
    await assert(baskinPay.stepType === "포인트", "M Point step should be labeled point");
    await assert(baskinPay.stepCode.includes("직원") && baskinPay.stepCode.includes("키오스크"), "M Point guide should mention staff or kiosk selection");
    await assert(baskinPay.theme === "point", "M Point step should use point theme");
    await page.evaluate(() => document.querySelector("#completeButton").click());
    await sleep(80);
    await page.evaluate(() => document.querySelector("#completeButton").click());
    await sleep(80);
    await page.evaluate(() => document.querySelector("#completeButton").click());
    await sleep(120);
    const baskinResult = await page.evaluate(() => ({
      screen: document.querySelector(".screen.is-active").dataset.screen,
      summary: document.querySelector("#resultSummary").innerText,
      rows: Array.from(document.querySelectorAll(".result-status-row")).map((row) => row.innerText),
      helpButtons: Array.from(document.querySelectorAll(".result-help")).map((button) => {
        const style = getComputedStyle(button);
        return { width: style.width, height: style.height, bg: style.backgroundColor, radius: style.borderRadius };
      })
    }));
    await assert(baskinResult.screen === "result", "Baskin result screen should open");
    await assert(baskinResult.summary === "이번 결제로 5,050P 혜택 받았어요", "Baskin result hero should show total point benefit");
    await assert(baskinResult.rows.join(" ").includes("포인트") && baskinResult.rows.join(" ").includes("5,000P"), "Baskin result should show M Point as point row");
    await assert(baskinResult.rows.join(" ").includes("해피포인트") && baskinResult.rows.join(" ").includes("50P"), "Baskin result should show Happy Point accrual amount");
    await assert(baskinResult.helpButtons.every((button) => button.width === "18px" && button.height === "18px" && button.radius === "50%"), "result help buttons should stay compact circles");
    await page.evaluate(() => document.querySelector("#resultDoneButton").click());
    await sleep(100);

    await page.evaluate(() => document.querySelector("#changePlaceButton").click());
    await sleep(100);
    await page.evaluate(() => document.querySelector(".location-option[data-location='twosome']").click());
    await sleep(100);
    await page.evaluate(() => document.querySelector("#applyLocationButton").click());
    await sleep(150);
    const twosome = await page.evaluate(() => ({
      merchant: document.querySelector("#merchantName").innerText,
      primary: document.querySelector("#whyButton").innerText,
      badge: document.querySelector(".payment-card[data-index='3'] .card-badge")?.innerText
    }));
    await assert(twosome.merchant.includes("투썸플레이스 강남수서점"), "Twosome location should apply");
    await assert(twosome.primary === "포인트 적립 가능", "Twosome should avoid Deep Oil coffee overclaim");
    await assert(twosome.badge === "추천", "Twosome should recommend the point card");

    console.log("QA passed");
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
