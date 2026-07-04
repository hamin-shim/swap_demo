const cards = [
  {
    issuer: "KB",
    name: "NEED Pay",
    displayName: "KB국민 NEED Pay",
    bg: "linear-gradient(135deg, #f9d923 0%, #fff36d 100%)",
    image: "./2964card_1.png"
  },
  {
    issuer: "SAMSUNG",
    name: "SELECT",
    displayName: "삼성카드 SELECT",
    bg: "linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)",
    image: "./2885card_1.png"
  },
  {
    issuer: "WOORI",
    name: "카드의정석",
    displayName: "우리 카드의정석",
    bg: "linear-gradient(135deg, #1251f5 0%, #1988ff 100%)",
    image: "./2848card_2.png"
  },
  {
    issuer: "LOTTE",
    name: "Daily Card",
    displayName: "롯데 Daily Card",
    bg: "linear-gradient(135deg, #7c2d12 0%, #f97316 100%)"
  }
];

const scenarios = {
  oliveyoung: {
    merchant: "Olive Young",
    confidence: "매장 인식 82%",
    recommendedIndex: 0,
    type: "예상 할인",
    detail: "하민님의 할인 선호와 보유 쿠폰을 함께 보고 추천했어요. 추천 기준은 언제든 AI 추천 설정에서 바꿀 수 있어요.",
    combinations: [
      {
        reason: "KB국민카드 + 3천원 쿠폰 + CJ ONE 조합으로 5천원 혜택 예상",
        benefit: "예상 혜택 5,000원",
        coupon: "올리브영 3천원 쿠폰",
        membership: "CJ ONE 적립",
        insight: "하민님의 할인 선호에 맞춰 추천했어요"
      },
      {
        reason: "월렛머니 + 매장 쿠폰 조합으로 4천원 적립 예상",
        benefit: "예상 혜택 4,000원",
        coupon: "월렛머니 2천원 리워드",
        membership: "CJ ONE 적립",
        insight: "하민님의 적립 선호에 맞춰 추천했어요"
      },
      {
        reason: "현대카드는 실적 2.8만원 부족. 이 결제로 혜택 유지에 도움",
        benefit: "실적 72% 달성 예상",
        coupon: "보유 쿠폰 없음",
        membership: "CJ ONE 적립",
        insight: "이번 달 실적 관리에 맞춰 추천했어요"
      },
      {
        reason: "롯데카드 + 멤버십 적립 조합으로 기본 적립 예상",
        benefit: "예상 혜택 1,000원",
        coupon: "적용 쿠폰 없음",
        membership: "CJ ONE 적립",
        insight: "평소 사용 패턴에 맞춰 추천했어요"
      }
    ]
  },
  cu: {
    merchant: "CU",
    confidence: "매장 인식 76%",
    recommendedIndex: 2,
    type: "실적 관리",
    detail: "이번 달 실적이 조금 남아 있어요. 다음 달 혜택을 이어갈 수 있도록 실적 관리와 쿠폰을 함께 고려했어요.",
    combinations: [
      {
        reason: "KB국민카드는 소액 결제 기준 기본 적립만 예상돼요",
        benefit: "기본 적립",
        coupon: "적용 쿠폰 없음",
        membership: "CU 멤버십 적립",
        insight: "현재 조합에서는 추가 혜택이 적어요"
      },
      {
        reason: "월렛머니 + 편의점 리워드 조합으로 1,200원 적립 예상",
        benefit: "예상 혜택 1,200원",
        coupon: "월렛머니 편의점 리워드",
        membership: "CU 멤버십 적립",
        insight: "하민님의 적립 선호에 맞춰 추천했어요"
      },
      {
        reason: "현대카드 실적 2.8만원 부족. 이 결제로 다음 달 혜택 조건에 가까워져요",
        benefit: "실적 72% 달성 예상",
        coupon: "CU 1천원 쿠폰",
        membership: "CU 멤버십 적립",
        insight: "실적 관리와 쿠폰을 함께 고려했어요"
      },
      {
        reason: "롯데카드 + CU 멤버십 조합으로 5% 적립 가능",
        benefit: "예상 혜택 600원",
        coupon: "적용 쿠폰 없음",
        membership: "CU 멤버십 적립",
        insight: "멤버십 적립을 놓치지 않게 추천했어요"
      }
    ]
  },
  mall: {
    merchant: "뷰티/드럭스토어 후보",
    confidence: "업종 기준",
    recommendedIndex: 1,
    type: "위치 Fallback",
    detail: "정확한 매장이 아직 확실하지 않아 업종 기준으로 추천했어요. 매장이 확인되면 조합이 달라질 수 있어요.",
    combinations: [
      {
        reason: "뷰티 업종 기준 KB국민카드 캐시백 가능성이 있어요",
        benefit: "예상 혜택 3,000원",
        coupon: "업종 쿠폰 후보",
        membership: "브랜드 확인 필요",
        insight: "매장 확인 전이라 업종 기준으로 추천했어요"
      },
      {
        reason: "월렛머니 + 업종 리워드 조합으로 4천원 적립 예상",
        benefit: "예상 혜택 4,000원",
        coupon: "월렛머니 업종 리워드",
        membership: "브랜드 확인 필요",
        insight: "정확한 매장 대신 업종 혜택으로 추천했어요"
      },
      {
        reason: "현대카드는 실적 관리에는 도움되지만 매장 확인이 필요해요",
        benefit: "실적 관리",
        coupon: "업종 쿠폰 후보",
        membership: "브랜드 확인 필요",
        insight: "실적 관리에 맞춰 추천했어요"
      },
      {
        reason: "롯데카드는 업종 기본 적립만 예상돼요",
        benefit: "예상 혜택 800원",
        coupon: "적용 쿠폰 없음",
        membership: "브랜드 확인 필요",
        insight: "평소 사용 패턴에 맞춰 추천했어요"
      }
    ]
  }
};

let currentScenario = "oliveyoung";
let currentCardIndex = scenarios[currentScenario].recommendedIndex;
let currentPayStep = 0;
let currentPayMode = "combo";
let dragStartX = 0;
let dragCurrentX = 0;
let isDragging = false;
let didDrag = false;
let nfcTimerId = null;
let nfcRemaining = 50;
let nfcWasPaymentStep = false;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const fields = {
  merchantName: $("#merchantName"),
  proposalText: $("#proposalText"),
  reasonText: $("#reasonText"),
  comboCard: $("#comboCard"),
  comboCoupon: $("#comboCoupon"),
  comboMembership: $("#comboMembership"),
  selectedCard: $("#selectedCard"),
  benefitText: $("#benefitText"),
  walletPayButton: $("#walletPayButton"),
  payCard: $("#payCard"),
  payReason: $("#payReason"),
  payBrand: $("#payBrand"),
  payCardVisualName: $("#payCardVisualName"),
  payCardImage: $("#payCardImage"),
  payTabs: $("#payTabs"),
  payFlowPanel: $("#payFlowPanel"),
  payStackList: $("#payStackList"),
  payCodeCard: $("#payCodeCard"),
  payStepLabel: $("#payStepLabel"),
  payStepTitle: $("#payStepTitle"),
  payStepType: $("#payStepType"),
  payStepValue: $("#payStepValue"),
  payStepCode: $("#payStepCode"),
  payGuide: $("#payGuide"),
  payTimerBox: $("#payTimerBox"),
  payTimer: $("#payTimer"),
  nfcStatus: $("#nfcStatus"),
  completeButton: $("#completeButton"),
  resultSummary: $("#resultSummary"),
  resultBenefitAmount: $("#resultBenefitAmount"),
  resultLearning: $("#resultLearning"),
  resultStatusList: $("#resultStatusList"),
  resultProgressLabel: $("#resultProgressLabel"),
  resultProgressValue: $("#resultProgressValue"),
  resultProgressBar: $("#resultProgressBar"),
  resultNextHint: $("#resultNextHint"),
  resultCard: $("#resultCard"),
  resultType: $("#resultType"),
  detailText: $("#detailText")
};

function formatBenefitCallout(benefit) {
  const amount = benefit.match(/[0-9,]+원/)?.[0];
  if (amount) return `${amount} 혜택을 받으세요`;
  if (benefit.includes("실적")) return "실적 조건에 가까워져요";
  return benefit;
}

function currentData() {
  const scenario = scenarios[currentScenario];
  const card = cards[currentCardIndex];
  const combo = scenario.combinations[currentCardIndex];
  return { scenario, card, combo };
}

function hasUsableAsset(value) {
  return value && !/(없음|필요|후보)/.test(value);
}

function updateNfcTimer() {
  fields.payTimer.textContent = String(nfcRemaining);
  fields.payTimerBox.classList.toggle("is-expired", nfcRemaining <= 0);
  fields.nfcStatus.textContent = nfcRemaining > 0 ? "NFC 활성화" : "NFC 만료";
}

function stopNfcTimer() {
  if (nfcTimerId) {
    window.clearInterval(nfcTimerId);
    nfcTimerId = null;
  }
  nfcWasPaymentStep = false;
}

function startNfcTimer() {
  stopNfcTimer();
  nfcRemaining = 50;
  updateNfcTimer();
  nfcTimerId = window.setInterval(() => {
    nfcRemaining = Math.max(0, nfcRemaining - 1);
    updateNfcTimer();
    if (nfcRemaining === 0) {
      window.clearInterval(nfcTimerId);
      nfcTimerId = null;
      fields.payGuide.textContent = "NFC가 만료됐어요. 다시 활성화해 주세요.";
      fields.completeButton.textContent = "다시 활성화";
    }
  }, 1000);
}

function buildPaySteps(mode = currentPayMode) {
  const { card, combo } = currentData();
  const steps = [];

  if (mode === "card") {
    return [{
      type: "payment",
      label: "결제",
      title: "이 카드로 결제하세요",
      value: card.displayName,
      code: "NFC 결제 대기 중",
      guide: "폰의 뒷면을 카드 리더기에 대세요.",
      button: "결제 완료"
    }];
  }

  if (hasUsableAsset(combo.coupon)) {
    steps.push({
      type: "coupon",
      label: "매장쿠폰",
      title: "먼저 쿠폰 바코드를 보여주세요",
      value: combo.coupon,
      code: "8801 0427 3000",
      guide: "아직 결제 전이에요.",
      button: "쿠폰 사용 완료"
    });
  }

  if (hasUsableAsset(combo.membership)) {
    steps.push({
      type: "membership",
      label: "멤버십",
      title: "이어서 멤버십을 적립해주세요",
      value: combo.membership,
      code: "3108 2407 1142",
      guide: "이후 카드 결제로 넘어가요.",
      button: "멤버십 적립 완료"
    });
  }

  steps.push({
    type: "payment",
    label: "결제",
    title: "이제 카드로 결제하세요",
    value: card.displayName,
    code: "NFC 결제 대기 중",
    guide: "폰의 뒷면을 카드 리더기에 대세요.",
    button: "결제 완료"
  });

  return steps;
}

function renderPayStep() {
  const steps = buildPaySteps();
  currentPayStep = Math.min(currentPayStep, steps.length - 1);
  const step = steps[currentPayStep];
  const isPayment = step.type === "payment";

  fields.payTabs.textContent = currentPayMode === "card" ? "카드 결제" : "추천 조합 준비됨";
  fields.payFlowPanel.style.setProperty("--pay-step-count", steps.length);
  fields.payStackList.innerHTML = steps.map((item, index) => {
    const state = index < currentPayStep ? "is-done" : index === currentPayStep ? "is-active" : "";
    return `
      <button type="button" class="pay-step-button ${state}" data-step-index="${index}">
        <em>${index + 1}</em>
        ${item.label}
      </button>
    `;
  }).join("");
  $$("#payStackList .pay-step-button").forEach((button) => {
    button.addEventListener("click", () => {
      currentPayStep = Number(button.dataset.stepIndex);
      renderPayStep();
    });
  });
  fields.payStepLabel.textContent = `${currentPayStep + 1}/${steps.length}`;
  fields.payStepTitle.textContent = step.title;
  fields.payStepType.textContent = step.label;
  fields.payStepValue.textContent = step.value;
  fields.payStepCode.textContent = step.code;
  fields.payGuide.textContent = step.guide;
  fields.completeButton.textContent = step.button;
  fields.payFlowPanel.classList.toggle("is-payment-step", isPayment);
  fields.payCodeCard.hidden = isPayment;
  $(".screen-pay").dataset.payStep = step.type;
  $(".screen-pay").dataset.payMode = currentPayMode;

  if (isPayment && !nfcWasPaymentStep) {
    startNfcTimer();
    nfcWasPaymentStep = true;
  } else if (!isPayment && nfcWasPaymentStep) {
    stopNfcTimer();
  }
}

function renderCards() {
  const track = $("#cardTrack");
  const dots = $("#cardDots");
  const recommendedIndex = scenarios[currentScenario].recommendedIndex;

  track.innerHTML = cards.map((card, index) => `
    <article class="payment-card ${card.image ? "has-card-image" : ""}" style="--card-bg: ${card.bg}" data-index="${index}">
      ${card.image ? `<img class="card-asset" src="${card.image}" alt="${card.displayName} 카드" draggable="false">` : `
        <div class="card-sheen"></div>
        <div class="card-content">
          <span class="brand">${card.issuer}</span>
          <div class="chip"></div>
          <div class="card-name">${card.name}</div>
          <div class="sfc">PAY</div>
          <div class="mastercard"><span></span><span></span></div>
        </div>
      `}
      ${index === currentCardIndex ? `<span class="card-badge">${index === recommendedIndex ? "추천" : "선택"}</span>` : ""}
    </article>
  `).join("");

  dots.innerHTML = cards.map((_, index) => `<span class="${index === currentCardIndex ? "is-active" : ""}"></span>`).join("");

  $$("#cardTrack .payment-card").forEach((cardEl) => {
    cardEl.addEventListener("click", () => {
      if (didDrag) return;
      setCard(Number(cardEl.dataset.index));
    });
  });

  updateCardPosition();
}

function updateCardPosition(offset = 0) {
  const carousel = $(".card-carousel");
  const firstCard = $("#cardTrack .payment-card");
  if (!carousel || !firstCard) return;

  const itemWidth = firstCard.getBoundingClientRect().width + 24;
  const startOffset = (carousel.getBoundingClientRect().width - itemWidth) / 2;
  $("#cardTrack").style.transform = `translateX(${startOffset - currentCardIndex * itemWidth + offset}px)`;
}

function setCard(index) {
  currentCardIndex = Math.max(0, Math.min(cards.length - 1, index));
  render();
}

function render() {
  const { scenario, card, combo } = currentData();

  fields.merchantName.textContent = `${scenario.merchant}에서 결제하시나요?`;
  fields.proposalText.textContent = `${card.displayName} 조합으로 ${formatBenefitCallout(combo.benefit)}`;
  fields.reasonText.textContent = combo.reason;
  fields.comboCard.textContent = card.displayName;
  fields.comboCoupon.textContent = combo.coupon;
  fields.comboMembership.textContent = combo.membership;
  fields.selectedCard.textContent = combo.insight;
  fields.benefitText.textContent = combo.benefit;
  fields.payCard.textContent = card.displayName;
  fields.payReason.textContent = combo.reason;
  fields.payBrand.textContent = card.issuer;
  fields.payCardVisualName.textContent = card.name;
  fields.payCardImage.src = card.image || "";
  fields.payCardImage.alt = `${card.displayName} 카드`;
  fields.payCardImage.hidden = !card.image;
  fields.detailText.textContent = scenario.detail;

  document.documentElement.style.setProperty("--active-card-bg", card.bg);
  renderCards();
  renderPayStep();
}

function setScreen(name) {
  $(".phone").scrollTop = 0;
  if (name !== "pay") stopNfcTimer();
  $$(".screen").forEach((screen) => {
    screen.classList.toggle("is-active", screen.dataset.screen === name);
    screen.scrollTop = 0;
  });
  closeSheet();
  closeSettings();
  window.requestAnimationFrame(() => {
    $(".phone").scrollTop = 0;
  });
}

function setResultForMode(mode) {
  const { scenario, card, combo } = currentData();
  if (mode === "card") {
    fields.resultSummary.textContent = `${card.displayName}로 결제했어요`;
    fields.resultBenefitAmount.textContent = "기본 결제";
    fields.resultLearning.textContent = "추천 조합 없이 선택한 카드로 결제했어요";
    fields.resultStatusList.innerHTML = renderResultRows([
      { label: "카드 결제", value: card.displayName, state: "완료" },
      { label: "쿠폰", value: "사용 안 함", state: "건너뜀" },
      { label: "멤버십", value: "사용 안 함", state: "건너뜀" }
    ]);
    fields.resultProgressLabel.textContent = "이번 달 카드 실적";
    fields.resultProgressValue.textContent = "68%";
    fields.resultProgressBar.style.width = "68%";
    fields.resultNextHint.textContent = "추천 기준을 켜면 다음 혜택 구간을 함께 확인할 수 있어요";
    fields.resultCard.textContent = card.displayName;
    fields.resultType.textContent = "카드 단독 결제";
    return;
  }

  const benefitAmount = combo.benefit.match(/[0-9,]+원/)?.[0] || combo.benefit;
  const progress = scenario.type.includes("실적") ? 72 : 84;
  const nextAmount = scenario.type.includes("실적") ? "28,000원" : "16,000원";

  fields.resultSummary.textContent = `${combo.benefit}을 적용했어요`;
  fields.resultBenefitAmount.textContent = benefitAmount;
  fields.resultLearning.textContent = "이번 결과를 다음 추천에 반영했어요";
  fields.resultStatusList.innerHTML = renderResultRows([
    { label: "쿠폰", value: combo.coupon, state: hasUsableAsset(combo.coupon) ? "적용 완료" : "없음" },
    { label: "멤버십", value: combo.membership, state: hasUsableAsset(combo.membership) ? "확인 중" : "없음" },
    { label: "카드 혜택", value: combo.benefit, state: "예상" }
  ].filter((item) => item.state !== "없음"));
  fields.resultProgressLabel.textContent = "이번 달 카드 실적";
  fields.resultProgressValue.textContent = `${progress}%`;
  fields.resultProgressBar.style.width = `${progress}%`;
  fields.resultNextHint.textContent = `다음 혜택 구간까지 ${nextAmount} 남았어요`;
  fields.resultCard.textContent = `${card.displayName} + ${combo.membership}`;
  fields.resultType.textContent = scenario.type;
}

function renderResultRows(items) {
  return items.map((item) => `
    <div class="result-status-row">
      <div>
        <span>${item.label}</span>
        <strong>${item.value}</strong>
      </div>
      <em>${item.state}</em>
    </div>
  `).join("");
}

function startPaymentFlow(mode = "combo") {
  currentPayMode = mode;
  currentPayStep = 0;
  setResultForMode(mode);
  renderPayStep();
  setScreen("pay");
}

function advancePaymentFlow() {
  const steps = buildPaySteps();
  const step = steps[currentPayStep];
  if (step.type === "payment" && nfcRemaining === 0) {
    fields.payGuide.textContent = step.guide;
    fields.completeButton.textContent = step.button;
    startNfcTimer();
    nfcWasPaymentStep = true;
    return;
  }

  if (currentPayStep < steps.length - 1) {
    currentPayStep += 1;
    renderPayStep();
    $(".phone").scrollTop = 0;
    return;
  }

  setScreen("result");
}

function closeSheet() {
  $("#detailSheet").classList.remove("is-open");
  $("#detailSheet").setAttribute("aria-hidden", "true");
  updateScrim();
}

function openSheet() {
  closeSettings();
  closeReason();
  $("#detailSheet").classList.add("is-open");
  $("#detailSheet").setAttribute("aria-hidden", "false");
  updateScrim();
}

function closeSettings() {
  $("#settingsSheet").classList.remove("is-open");
  $("#settingsSheet").setAttribute("aria-hidden", "true");
  updateScrim();
}

function openSettings() {
  closeSheet();
  closeReason();
  $("#settingsSheet").classList.add("is-open");
  $("#settingsSheet").setAttribute("aria-hidden", "false");
  updateScrim();
}

function closeReason() {
  $("#reasonPopover").classList.remove("is-open");
  $("#reasonPopover").setAttribute("aria-hidden", "true");
  updateScrim();
}

function openReason() {
  $("#reasonPopover").classList.add("is-open");
  $("#reasonPopover").setAttribute("aria-hidden", "false");
  updateScrim();
}

function updateScrim() {
  const isAnyOpen = $("#detailSheet").classList.contains("is-open")
    || $("#settingsSheet").classList.contains("is-open")
    || $("#reasonPopover").classList.contains("is-open");
  $("#scrim").classList.toggle("is-open", isAnyOpen);
}

function closeOverlays() {
  $("#detailSheet").classList.remove("is-open");
  $("#detailSheet").setAttribute("aria-hidden", "true");
  $("#settingsSheet").classList.remove("is-open");
  $("#settingsSheet").setAttribute("aria-hidden", "true");
  $("#reasonPopover").classList.remove("is-open");
  $("#reasonPopover").setAttribute("aria-hidden", "true");
  updateScrim();
}

$$(".scenario").forEach((button) => {
  button.addEventListener("click", () => {
    currentScenario = button.dataset.scenario;
    currentCardIndex = scenarios[currentScenario].recommendedIndex;
    $$(".scenario").forEach((item) => item.classList.toggle("is-selected", item === button));
    render();
    closeSettings();
  });
});

function attachSwipe() {
  const carousel = $(".card-carousel");

  carousel.addEventListener("pointerdown", (event) => {
    isDragging = true;
    didDrag = false;
    dragStartX = event.clientX;
    dragCurrentX = 0;
    carousel.setPointerCapture(event.pointerId);
  });

  carousel.addEventListener("pointermove", (event) => {
    if (!isDragging) return;
    dragCurrentX = event.clientX - dragStartX;
    if (Math.abs(dragCurrentX) > 6) didDrag = true;
    updateCardPosition(dragCurrentX);
  });

  carousel.addEventListener("pointerup", () => {
    if (!isDragging) return;
    isDragging = false;
    if (dragCurrentX < -42) setCard(currentCardIndex + 1);
    else if (dragCurrentX > 42) setCard(currentCardIndex - 1);
    else updateCardPosition();
    window.setTimeout(() => {
      didDrag = false;
    }, 120);
  });

  carousel.addEventListener("pointercancel", () => {
    isDragging = false;
    didDrag = false;
    updateCardPosition();
  });

  carousel.addEventListener("dragstart", (event) => {
    event.preventDefault();
  });
}

$("#whyButton").addEventListener("click", openSheet);
$("#closeSheet").addEventListener("click", closeSheet);
$("#reasonButton").addEventListener("click", openReason);
$("#reasonPopover").addEventListener("click", (event) => {
  if (event.target === $("#reasonPopover")) closeReason();
});
$("#scrim").addEventListener("click", closeOverlays);
$("#settingsButton").addEventListener("click", openSettings);
$("#closeSettings").addEventListener("click", closeSettings);
$("#openSettingsFromReason").addEventListener("click", openSettings);
$("#walletPayButton").addEventListener("click", () => startPaymentFlow("card"));
$("#comboPayButton").addEventListener("click", () => startPaymentFlow("combo"));
$("#completeButton").addEventListener("click", advancePaymentFlow);
$("#resetButton").addEventListener("click", () => setScreen("wallet"));
$("#plannerButton").addEventListener("click", () => setScreen("wallet"));
window.addEventListener("resize", () => updateCardPosition());

attachSwipe();
render();
