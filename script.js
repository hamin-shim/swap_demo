const cards = [
  {
    issuer: "SHINHAN",
    name: "Deep Benefit",
    displayName: "신한 Deep Benefit",
    bg: "linear-gradient(135deg, #1657c8 0%, #4c8dff 100%)"
  },
  {
    issuer: "SAMSUNG",
    name: "Wallet Money",
    displayName: "Samsung Wallet Money",
    bg: "linear-gradient(135deg, #20242b 0%, #747b86 100%)"
  },
  {
    issuer: "HYUNDAI",
    name: "M Card",
    displayName: "현대 M Card",
    bg: "linear-gradient(135deg, #0f766e 0%, #33c7b6 100%)"
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
        reason: "신한카드 + 3천원 쿠폰 + CJ ONE 조합으로 5천원 혜택 예상",
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
        reason: "신한카드는 소액 결제 기준 기본 적립만 예상돼요",
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
        reason: "뷰티 업종 기준 신한카드 캐시백 가능성이 있어요",
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
let dragStartX = 0;
let dragCurrentX = 0;
let isDragging = false;

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
  payCard: $("#payCard"),
  payReason: $("#payReason"),
  payBrand: $("#payBrand"),
  payCardVisualName: $("#payCardVisualName"),
  resultSummary: $("#resultSummary"),
  resultCard: $("#resultCard"),
  resultType: $("#resultType"),
  resultCombo: $("#resultCombo"),
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

function renderCards() {
  const track = $("#cardTrack");
  const dots = $("#cardDots");
  const recommendedIndex = scenarios[currentScenario].recommendedIndex;

  track.innerHTML = cards.map((card, index) => `
    <article class="payment-card" style="--card-bg: ${card.bg}" data-index="${index}">
      <div class="card-sheen"></div>
      <div class="card-content">
        <span class="brand">${card.issuer}</span>
        <div class="chip"></div>
        <div class="card-name">${card.name}</div>
        <div class="sfc">PAY</div>
        <div class="mastercard"><span></span><span></span></div>
      </div>
      ${index === currentCardIndex ? `<span class="card-badge">${index === recommendedIndex ? "추천" : "선택"}</span>` : ""}
    </article>
  `).join("");

  dots.innerHTML = cards.map((_, index) => `<span class="${index === currentCardIndex ? "is-active" : ""}"></span>`).join("");

  $$("#cardTrack .payment-card").forEach((cardEl) => {
    cardEl.addEventListener("click", () => setCard(Number(cardEl.dataset.index)));
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
  fields.resultSummary.textContent = `${combo.benefit}을 적용했어요`;
  fields.resultCard.textContent = `${card.displayName} + ${combo.membership}`;
  fields.resultType.textContent = scenario.type;
  fields.resultCombo.textContent = `${card.name} + ${combo.coupon} + ${combo.membership}`;
  fields.detailText.textContent = scenario.detail;

  document.documentElement.style.setProperty("--active-card-bg", card.bg);
  renderCards();
}

function setScreen(name) {
  $$(".screen").forEach((screen) => {
    screen.classList.toggle("is-active", screen.dataset.screen === name);
  });
  closeSheet();
  closeSettings();
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
    dragStartX = event.clientX;
    dragCurrentX = 0;
    carousel.setPointerCapture(event.pointerId);
  });

  carousel.addEventListener("pointermove", (event) => {
    if (!isDragging) return;
    dragCurrentX = event.clientX - dragStartX;
    updateCardPosition(dragCurrentX);
  });

  carousel.addEventListener("pointerup", () => {
    if (!isDragging) return;
    isDragging = false;
    if (dragCurrentX < -42) setCard(currentCardIndex + 1);
    else if (dragCurrentX > 42) setCard(currentCardIndex - 1);
    else updateCardPosition();
  });

  carousel.addEventListener("pointercancel", () => {
    isDragging = false;
    updateCardPosition();
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
$("#comboPayButton").addEventListener("click", () => setScreen("pay"));
$("#completeButton").addEventListener("click", () => setScreen("result"));
$("#resetButton").addEventListener("click", () => setScreen("wallet"));
window.addEventListener("resize", () => updateCardPosition());

attachSwipe();
render();
