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

const locationOptions = [
  {
    id: "starbucks",
    name: "Starbucks",
    distance: "현재 위치",
    confidence: "88%",
    hint: "카페 혜택 + 스타벅스 리워드",
    criterion: "max_benefit"
  },
  {
    id: "cu",
    name: "CU",
    distance: "약 18m",
    confidence: "74%",
    hint: "편의점 혜택 + CU 멤버십",
    criterion: "remaining_cap"
  },
  {
    id: "oliveyoung",
    name: "Olive Young",
    distance: "약 32m",
    confidence: "68%",
    hint: "드럭스토어 혜택 + CJ ONE",
    criterion: "max_benefit"
  },
  {
    id: "department",
    name: "신세계백화점",
    distance: "약 55m",
    confidence: "61%",
    hint: "백화점 결제일 할인 후보",
    criterion: "max_benefit"
  }
];

const locationScenarioSets = {
  starbucks: {
  max_benefit: {
    merchant: "Starbucks",
    confidence: "매장 인식 88%",
    recommendedIndex: 1,
    type: "혜택 큰 순",
    detail: "지금 매장에서 가장 크게 받을 수 있는 카드 혜택과 멤버십을 먼저 봤어요. 쿠폰이 없어도 카드사 혜택과 리워드 적립을 함께 계산합니다.",
    combinations: [
      {
        reason: "KB국민카드는 카페 할인보다 삼성카드 혜택이 더 커요",
        benefit: "예상 혜택 700원",
        coupon: "적용 쿠폰 없음",
        membership: "스타벅스 리워드 적립",
        insight: "이번 결제에서는 다른 카드가 더 유리해요"
      },
      {
        reason: "삼성카드 SELECT 카페 청구할인 + 스타벅스 리워드 적립 가능",
        benefit: "예상 혜택 2,500원",
        coupon: "적용 쿠폰 없음",
        membership: "스타벅스 리워드 적립",
        insight: "오늘 이 매장에서 예상 혜택이 가장 커요"
      },
      {
        reason: "우리카드는 실적에는 도움되지만 카페 혜택은 제한적이에요",
        benefit: "실적 반영 예상",
        coupon: "보유 쿠폰 없음",
        membership: "스타벅스 리워드 적립",
        insight: "실적 우선이면 대체 선택할 수 있어요"
      },
      {
        reason: "롯데 Daily Card는 조건 없이 기본 적립돼요",
        benefit: "조건 없이 0.5% 적립",
        coupon: "적용 쿠폰 없음",
        membership: "스타벅스 리워드 적립",
        insight: "복잡한 조건 없이 빠르게 결제할 수 있어요"
      }
    ]
  },
  remaining_cap: {
    merchant: "Starbucks",
    confidence: "매장 인식 88%",
    recommendedIndex: 1,
    type: "한도 남은 혜택",
    detail: "할인율만 보지 않고 이번 달에 아직 쓸 수 있는 할인 한도와 남은 횟수를 먼저 봤어요.",
    combinations: [
      {
        reason: "KB국민카드는 카페 할인 한도를 이미 거의 사용했어요",
        benefit: "남은 한도 300원",
        coupon: "적용 쿠폰 없음",
        membership: "스타벅스 리워드 적립",
        insight: "남은 한도가 작아 우선순위가 낮아요"
      },
      {
        reason: "삼성카드 SELECT 카페 청구할인 1회가 아직 남아 있어요",
        benefit: "카페 혜택 1회 남음",
        coupon: "적용 쿠폰 없음",
        membership: "스타벅스 리워드 적립",
        insight: "아직 남은 혜택을 먼저 쓰는 게 좋아요"
      },
      {
        reason: "우리카드는 이번 달 편의점 한도는 남았지만 카페 대상이 아니에요",
        benefit: "대상 업종 아님",
        coupon: "적용 쿠폰 없음",
        membership: "스타벅스 리워드 적립",
        insight: "혜택 대상 업종이 맞지 않아요"
      },
      {
        reason: "롯데 Daily Card는 한도 조건 없이 기본 적립돼요",
        benefit: "조건 없이 0.5% 적립",
        coupon: "적용 쿠폰 없음",
        membership: "스타벅스 리워드 적립",
        insight: "한도 혜택이 없을 때 안정적인 선택이에요"
      }
    ]
  },
  performance_fill: {
    merchant: "Starbucks",
    confidence: "매장 인식 88%",
    recommendedIndex: 2,
    type: "실적 채우기",
    detail: "당장 할인액이 가장 크지 않아도 다음 달 혜택을 유지하는 데 도움이 되는 결제인지 먼저 봤어요.",
    combinations: [
      {
        reason: "KB국민카드는 이번 결제가 실적에 반영되지만 목표까지 아직 멀어요",
        benefit: "실적 58% 달성 예상",
        coupon: "적용 쿠폰 없음",
        membership: "스타벅스 리워드 적립",
        insight: "실적 관리 효과가 크지 않아요"
      },
      {
        reason: "삼성카드 SELECT는 혜택은 크지만 이번 결제 실적 효과는 보통이에요",
        benefit: "예상 혜택 2,500원",
        coupon: "적용 쿠폰 없음",
        membership: "스타벅스 리워드 적립",
        insight: "혜택 큰 순 기준에서는 좋은 선택이에요"
      },
      {
        reason: "우리 카드의정석 실적 2.8만원 부족. 이 결제로 다음 달 혜택 조건에 가까워져요",
        benefit: "실적 72% 달성 예상",
        coupon: "적용 쿠폰 없음",
        membership: "스타벅스 리워드 적립",
        insight: "다음 달 혜택 유지를 우선하면 이 카드가 좋아요"
      },
      {
        reason: "롯데 Daily Card는 실적 조건이 없어 관리할 필요가 적어요",
        benefit: "조건 없이 0.5% 적립",
        coupon: "적용 쿠폰 없음",
        membership: "스타벅스 리워드 적립",
        insight: "실적을 채우려는 목적에는 맞지 않아요"
      }
    ]
  },
  no_condition: {
    merchant: "Starbucks",
    confidence: "매장 인식 88%",
    recommendedIndex: 3,
    type: "조건 없는 혜택",
    detail: "전월실적, 업종, 월 한도 조건을 따지지 않고 어디서나 받을 수 있는 기본 적립을 우선했어요.",
    combinations: [
      {
        reason: "KB국민카드는 카페 혜택 조건을 확인해야 해요",
        benefit: "조건 확인 필요",
        coupon: "적용 쿠폰 없음",
        membership: "스타벅스 리워드 적립",
        insight: "조건 없는 선택지는 아니에요"
      },
      {
        reason: "삼성카드 SELECT는 카페 혜택이 크지만 월 한도 조건이 있어요",
        benefit: "카페 혜택 1회 남음",
        coupon: "적용 쿠폰 없음",
        membership: "스타벅스 리워드 적립",
        insight: "조건 없는 혜택 기준에서는 뒤로 밀려요"
      },
      {
        reason: "우리카드는 실적 관리 목적이면 선택할 수 있어요",
        benefit: "실적 반영 예상",
        coupon: "적용 쿠폰 없음",
        membership: "스타벅스 리워드 적립",
        insight: "실적 우선 사용자에게만 의미가 있어요"
      },
      {
        reason: "롯데 Daily Card 전월실적 없이 어디서나 0.5% 적립",
        benefit: "조건 없이 0.5% 적립",
        coupon: "적용 쿠폰 없음",
        membership: "스타벅스 리워드 적립",
        insight: "혜택 차이가 작을 땐 조건 없는 카드가 편해요"
      }
    ]
  }
  },
  cu: {
    max_benefit: {
      merchant: "CU",
      confidence: "매장 인식 74%",
      recommendedIndex: 2,
      type: "혜택 큰 순",
      detail: "편의점 결제에서 적용 가능한 카드 혜택과 CU 멤버십을 함께 봤어요.",
      combinations: [
        { reason: "KB국민카드는 편의점 혜택이 작아요", benefit: "예상 혜택 300원", coupon: "적용 쿠폰 없음", membership: "CU 멤버십 적립", insight: "이번 결제에서는 편의점 특화 카드가 더 좋아요" },
        { reason: "삼성카드는 카페 혜택이 강하지만 CU 대상은 아니에요", benefit: "대상 업종 아님", coupon: "적용 쿠폰 없음", membership: "CU 멤버십 적립", insight: "현재 매장과 혜택 업종이 맞지 않아요" },
        { reason: "우리 카드의정석 편의점 할인 + CU 멤버십 적립 가능", benefit: "예상 혜택 1,200원", coupon: "적용 쿠폰 없음", membership: "CU 멤버십 적립", insight: "편의점 결제에서 예상 혜택이 가장 커요" },
        { reason: "롯데 Daily Card 조건 없이 기본 적립", benefit: "조건 없이 0.5% 적립", coupon: "적용 쿠폰 없음", membership: "CU 멤버십 적립", insight: "조건 없는 선택지로는 안정적이에요" }
      ]
    },
    remaining_cap: {
      merchant: "CU",
      confidence: "매장 인식 74%",
      recommendedIndex: 2,
      type: "한도 남은 혜택",
      detail: "이번 달 편의점 할인 한도와 남은 횟수를 기준으로 다시 골랐어요.",
      combinations: [
        { reason: "KB국민카드는 편의점 한도를 이미 사용했어요", benefit: "남은 한도 없음", coupon: "적용 쿠폰 없음", membership: "CU 멤버십 적립", insight: "남은 혜택이 없어 뒤로 밀려요" },
        { reason: "삼성카드는 CU 대상 한도가 없어요", benefit: "대상 업종 아님", coupon: "적용 쿠폰 없음", membership: "CU 멤버십 적립", insight: "카페 혜택 카드라 이번 매장에는 맞지 않아요" },
        { reason: "우리 카드의정석 편의점 할인 한도 2회가 남아 있어요", benefit: "편의점 혜택 2회 남음", coupon: "적용 쿠폰 없음", membership: "CU 멤버십 적립", insight: "아직 남은 편의점 혜택을 먼저 쓰는 게 좋아요" },
        { reason: "롯데 Daily Card는 한도 조건 없이 기본 적립돼요", benefit: "조건 없이 0.5% 적립", coupon: "적용 쿠폰 없음", membership: "CU 멤버십 적립", insight: "한도 혜택이 없을 때 대안이에요" }
      ]
    },
    performance_fill: {
      merchant: "CU",
      confidence: "매장 인식 74%",
      recommendedIndex: 2,
      type: "실적 채우기",
      detail: "편의점 소액 결제도 실적에 산입되는지 기준으로 봤어요.",
      combinations: [
        { reason: "KB국민카드는 이번 결제가 실적에 반영돼요", benefit: "실적 58% 달성 예상", coupon: "적용 쿠폰 없음", membership: "CU 멤버십 적립", insight: "실적 효과는 있지만 혜택은 작아요" },
        { reason: "삼성카드는 이번 결제 실적 효과가 보통이에요", benefit: "실적 반영 예상", coupon: "적용 쿠폰 없음", membership: "CU 멤버십 적립", insight: "실적 우선 기준에서는 강하지 않아요" },
        { reason: "우리 카드의정석 실적 2.8만원 부족. 이 결제로 다음 달 조건에 가까워져요", benefit: "실적 72% 달성 예상", coupon: "적용 쿠폰 없음", membership: "CU 멤버십 적립", insight: "실적 채우기 기준에서 가장 좋아요" },
        { reason: "롯데 Daily Card는 실적 조건이 없어 관리할 필요가 적어요", benefit: "조건 없이 0.5% 적립", coupon: "적용 쿠폰 없음", membership: "CU 멤버십 적립", insight: "실적을 채우려는 목적에는 맞지 않아요" }
      ]
    },
    no_condition: {
      merchant: "CU",
      confidence: "매장 인식 74%",
      recommendedIndex: 3,
      type: "조건 없는 혜택",
      detail: "전월실적이나 편의점 한도를 따지지 않는 상시 적립을 우선했어요.",
      combinations: [
        { reason: "KB국민카드는 조건 확인이 필요해요", benefit: "조건 확인 필요", coupon: "적용 쿠폰 없음", membership: "CU 멤버십 적립", insight: "조건 없는 선택지는 아니에요" },
        { reason: "삼성카드는 업종 조건이 맞지 않아요", benefit: "대상 업종 아님", coupon: "적용 쿠폰 없음", membership: "CU 멤버십 적립", insight: "이번 매장에서는 추천하지 않아요" },
        { reason: "우리카드는 편의점 혜택이 있지만 실적 조건이 있어요", benefit: "실적 조건 필요", coupon: "적용 쿠폰 없음", membership: "CU 멤버십 적립", insight: "조건 없는 혜택 기준에서는 뒤로 밀려요" },
        { reason: "롯데 Daily Card 전월실적 없이 어디서나 0.5% 적립", benefit: "조건 없이 0.5% 적립", coupon: "적용 쿠폰 없음", membership: "CU 멤버십 적립", insight: "조건 없는 결제 기준에서 가장 편해요" }
      ]
    }
  },
  oliveyoung: {
    max_benefit: {
      merchant: "Olive Young",
      confidence: "매장 인식 68%",
      recommendedIndex: 0,
      type: "혜택 큰 순",
      detail: "드럭스토어 결제에서 카드 혜택, 보유 쿠폰, CJ ONE 적립을 함께 봤어요.",
      combinations: [
        { reason: "KB국민카드 드럭스토어 청구할인 + CJ ONE 적립 가능", benefit: "예상 혜택 2,000원", coupon: "적용 쿠폰 없음", membership: "CJ ONE 적립", insight: "현재 매장에서 예상 혜택이 가장 커요" },
        { reason: "삼성카드 SELECT는 카페 혜택 중심이라 올리브영 혜택은 약해요", benefit: "예상 혜택 500원", coupon: "적용 쿠폰 없음", membership: "CJ ONE 적립", insight: "카페 결제라면 더 좋아요" },
        { reason: "우리카드는 실적에는 도움되지만 드럭스토어 할인은 제한적이에요", benefit: "실적 반영 예상", coupon: "적용 쿠폰 없음", membership: "CJ ONE 적립", insight: "실적 우선이면 선택할 수 있어요" },
        { reason: "롯데 Daily Card 조건 없이 기본 적립", benefit: "조건 없이 0.5% 적립", coupon: "적용 쿠폰 없음", membership: "CJ ONE 적립", insight: "조건 없는 결제 기준에서 안정적이에요" }
      ]
    },
    remaining_cap: null,
    performance_fill: null,
    no_condition: null
  },
  department: {
    max_benefit: {
      merchant: "신세계백화점",
      confidence: "매장 인식 61%",
      recommendedIndex: 0,
      type: "혜택 큰 순",
      detail: "백화점 결제일 할인과 남은 월 한도를 우선 확인했어요.",
      combinations: [
        { reason: "KB국민카드 백화점 결제일 할인 한도가 남아 있어요", benefit: "예상 혜택 8,000원", coupon: "적용 쿠폰 없음", membership: "신세계포인트 적립", insight: "백화점 결제에서는 할인 한도가 가장 중요해요" },
        { reason: "삼성카드는 카페 혜택 중심이라 백화점 혜택이 약해요", benefit: "대상 업종 아님", coupon: "적용 쿠폰 없음", membership: "신세계포인트 적립", insight: "현재 매장과 혜택 업종이 맞지 않아요" },
        { reason: "우리카드는 실적 관리에는 도움이 돼요", benefit: "실적 반영 예상", coupon: "적용 쿠폰 없음", membership: "신세계포인트 적립", insight: "실적 기준이면 대체 선택 가능해요" },
        { reason: "롯데 Daily Card 조건 없이 기본 적립", benefit: "조건 없이 0.5% 적립", coupon: "적용 쿠폰 없음", membership: "신세계포인트 적립", insight: "조건 없는 선택지로는 안정적이에요" }
      ]
    },
    remaining_cap: null,
    performance_fill: null,
    no_condition: null
  }
};

["oliveyoung", "department"].forEach((locationId) => {
  ["remaining_cap", "performance_fill", "no_condition"].forEach((criterion) => {
    locationScenarioSets[locationId][criterion] = locationScenarioSets[locationId].max_benefit;
  });
});

let currentLocation = "starbucks";
let scenarios = locationScenarioSets[currentLocation];

let currentScenario = "max_benefit";
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
let detailDragStartY = 0;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const fields = {
  merchantName: $("#merchantName"),
  whyButton: $("#whyButton"),
  changePlaceButton: $("#changePlaceButton"),
  detailSheetTitle: $("#detailSheetTitle"),
  reasonText: $("#reasonText"),
  benefitHighlight: $("#benefitHighlight"),
  benefitLabel: $("#benefitLabel"),
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
  plannerButton: $("#plannerButton"),
  cardAppNote: $("#cardAppNote"),
  aiCheckText: $("#aiCheckText"),
  detailText: $("#detailText")
};

function formatBenefitCallout(benefit) {
  const amount = benefit.match(/[0-9,]+원/)?.[0];
  if (amount) return `${amount} 혜택을 받으세요`;
  if (benefit.includes("실적")) return "실적 조건에 가까워져요";
  return benefit;
}

function formatSheetTitle(type) {
  if (type.includes("한도")) return "남은 한도를 먼저 봤어요";
  if (type.includes("실적")) return "실적을 채우기 좋게 골랐어요";
  if (type.includes("조건 없는")) return "조건 없는 혜택으로 골랐어요";
  return "혜택이 큰 순서로 골랐어요";
}

function formatBenefitAmount(benefit) {
  return benefit.match(/[0-9,]+원/)?.[0] || benefit.replace(/^예상 혜택\s*/, "");
}

function formatBenefitLabel(type) {
  if (type.includes("조건 없는")) return "조건 없는 혜택";
  if (type.includes("한도")) return "남은 혜택";
  if (type.includes("실적")) return "실적 관리 효과";
  return "예상 혜택";
}

function formatBenefitHighlight(type, benefitAmount) {
  if (type.includes("실적") || type.includes("조건 없는") || type.includes("한도")) return benefitAmount;
  return benefitAmount.includes("혜택") ? benefitAmount : `${benefitAmount} 혜택`;
}

function formatReasonLead(reason) {
  const lead = reason
    .replace(/\s*[0-9,]+원\s*(캐시백|적립|혜택)?\s*예상$/, "")
    .replace(/\s*[0-9]+천원\s*(캐시백|적립|혜택)?\s*예상$/, "")
    .replace(/\s*조건 없이 기본 적립$/, "")
    .trim();
  return lead || reason;
}

function formatPrimaryAction(benefitAmount) {
  if (benefitAmount.match(/[0-9,]+원/)) return `${benefitAmount} 혜택 받기`;
  return "추천 혜택 받기";
}

function currentData() {
  const scenario = scenarios[currentScenario];
  const card = cards[currentCardIndex];
  const combo = scenario.combinations[currentCardIndex];
  return { scenario, card, combo };
}

function currentLocationOption() {
  return locationOptions.find((option) => option.id === currentLocation) || locationOptions[0];
}

function cardAppName(card) {
  if (card.issuer === "SAMSUNG") return "삼성카드 앱";
  if (card.issuer === "KB") return "KB Pay";
  if (card.issuer === "WOORI") return "우리WON카드 앱";
  if (card.issuer === "LOTTE") return "디지로카 앱";
  return "카드사 앱";
}

function hasUsableAsset(value) {
  return value && !/(없음|필요|후보|사용 안 함)/.test(value);
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
  const benefitAmount = formatBenefitAmount(combo.benefit);
  const location = currentLocationOption();

  fields.merchantName.textContent = `${scenario.merchant}에서 결제하시나요?`;
  fields.whyButton.textContent = formatPrimaryAction(benefitAmount);
  fields.changePlaceButton.textContent = location.id === "starbucks" ? "아니요, 다른 곳이에요" : "다른 매장이에요";
  fields.detailSheetTitle.textContent = formatSheetTitle(scenario.type);
  fields.reasonText.textContent = formatReasonLead(combo.reason);
  fields.benefitHighlight.textContent = formatBenefitHighlight(scenario.type, benefitAmount);
  fields.benefitLabel.textContent = formatBenefitLabel(scenario.type);
  fields.comboCard.textContent = card.displayName;
  fields.comboCoupon.textContent = combo.coupon;
  fields.comboMembership.textContent = combo.membership;
  fields.comboCoupon.closest(".combo-item").hidden = !hasUsableAsset(combo.coupon);
  fields.comboMembership.closest(".combo-item").hidden = !hasUsableAsset(combo.membership);
  fields.selectedCard.textContent = combo.insight;
  fields.benefitText.textContent = benefitAmount;
  fields.payCard.textContent = card.displayName;
  fields.payReason.textContent = combo.reason;
  fields.payBrand.textContent = card.issuer;
  fields.payCardVisualName.textContent = card.name;
  fields.payCardImage.src = card.image || "";
  fields.payCardImage.alt = `${card.displayName} 카드`;
  fields.payCardImage.hidden = !card.image;
  fields.detailText.textContent = scenario.detail;
  fields.aiCheckText.textContent = `${scenario.merchant}, 등록 카드, 멤버십 기준`;

  document.documentElement.style.setProperty("--active-card-bg", card.bg);
  renderCards();
  renderLocationList();
  renderPayStep();
  syncScenarioControls();
}

function renderLocationList() {
  const list = $("#locationList");
  list.innerHTML = locationOptions.map((option) => {
    const isCurrent = option.id === currentLocation;
    return `
      <button type="button" class="location-option ${isCurrent ? "is-selected" : ""}" data-location="${option.id}">
        <div>
          <strong>${option.name}</strong>
          <span>${option.distance} · 인식 ${option.confidence}</span>
        </div>
        <em>${isCurrent ? "현재 선택" : option.hint}</em>
      </button>
    `;
  }).join("");
  $$("#locationList .location-option").forEach((button) => {
    button.addEventListener("click", () => {
      selectLocation(button.dataset.location);
    });
  });
}

function selectLocation(locationId) {
  const option = locationOptions.find((item) => item.id === locationId);
  if (!option) return;
  currentLocation = locationId;
  scenarios = locationScenarioSets[currentLocation];
  currentScenario = option.criterion;
  currentCardIndex = scenarios[currentScenario].recommendedIndex;
  render();
  closeLocationSheet();
}

function syncScenarioControls() {
  $$("[data-scenario]").forEach((item) => {
    item.classList.toggle("is-selected", item.dataset.scenario === currentScenario);
  });
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
  closeLocationSheet();
  window.requestAnimationFrame(() => {
    $(".phone").scrollTop = 0;
  });
}

function setResultForMode(mode) {
  const { scenario, card, combo } = currentData();
  const appName = cardAppName(card);
  fields.plannerButton.textContent = `${appName}에서 확인`;
  fields.cardAppNote.textContent = `${appName}에서 청구할인 반영, 남은 한도, 실적 산입 여부를 확인할 수 있어요.`;
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
  if (scenario.type.includes("조건 없는")) {
    fields.resultSummary.textContent = `${card.displayName}로 빠르게 결제했어요`;
    fields.resultBenefitAmount.textContent = combo.benefit;
    fields.resultLearning.textContent = "조건 없는 혜택 선호를 다음 추천에 반영했어요";
    fields.resultStatusList.innerHTML = renderResultRows([
      { label: "카드 결제", value: card.displayName, state: "완료" },
      { label: "카드 혜택", value: combo.benefit, state: "예상" }
    ]);
    fields.resultProgressLabel.textContent = "추천 기준";
    fields.resultProgressValue.textContent = "조건 없음";
    fields.resultProgressBar.style.width = "100%";
    fields.resultNextHint.textContent = "이번 결제는 업종/실적 조건 없이 받을 수 있는 혜택을 우선했어요";
    fields.resultCard.textContent = card.displayName;
    fields.resultType.textContent = scenario.type;
    return;
  }

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
  $("#detailSheet").classList.remove("is-expanded");
  $("#detailSheet").setAttribute("aria-hidden", "true");
  updateScrim();
}

function openSheet() {
  closeSettings();
  closeLocationSheet();
  closeReason();
  $("#detailSheet").classList.remove("is-expanded");
  $("#detailSheet").classList.add("is-open");
  $("#detailSheet").setAttribute("aria-hidden", "false");
  updateScrim();
}

function expandDetailSheet() {
  $("#detailSheet").classList.add("is-expanded");
}

function closeSettings() {
  $("#settingsSheet").classList.remove("is-open");
  $("#settingsSheet").setAttribute("aria-hidden", "true");
  updateScrim();
}

function openSettings() {
  closeSheet();
  closeLocationSheet();
  closeReason();
  $("#settingsSheet").classList.add("is-open");
  $("#settingsSheet").setAttribute("aria-hidden", "false");
  updateScrim();
}

function closeLocationSheet() {
  $("#locationSheet").classList.remove("is-open");
  $("#locationSheet").setAttribute("aria-hidden", "true");
  updateScrim();
}

function openLocationSheet() {
  closeSheet();
  closeSettings();
  closeReason();
  renderLocationList();
  $("#locationSheet").classList.add("is-open");
  $("#locationSheet").setAttribute("aria-hidden", "false");
  updateScrim();
}

function closeReason() {
  $("#reasonPopover").classList.remove("is-open");
  $("#reasonPopover").setAttribute("aria-hidden", "true");
  $("#reasonButton").setAttribute("aria-expanded", "false");
}

function openReason() {
  const shouldOpen = !$("#reasonPopover").classList.contains("is-open");
  $("#reasonPopover").classList.toggle("is-open", shouldOpen);
  $("#reasonPopover").setAttribute("aria-hidden", String(!shouldOpen));
  $("#reasonButton").setAttribute("aria-expanded", String(shouldOpen));
}

function updateScrim() {
  const isAnyOpen = $("#detailSheet").classList.contains("is-open")
    || $("#settingsSheet").classList.contains("is-open")
    || $("#locationSheet").classList.contains("is-open");
  $("#scrim").classList.toggle("is-open", isAnyOpen);
}

function closeOverlays() {
  $("#detailSheet").classList.remove("is-open");
  $("#detailSheet").classList.remove("is-expanded");
  $("#detailSheet").setAttribute("aria-hidden", "true");
  $("#settingsSheet").classList.remove("is-open");
  $("#settingsSheet").setAttribute("aria-hidden", "true");
  $("#locationSheet").classList.remove("is-open");
  $("#locationSheet").setAttribute("aria-hidden", "true");
  $("#reasonPopover").classList.remove("is-open");
  $("#reasonPopover").setAttribute("aria-hidden", "true");
  updateScrim();
}

$$("[data-scenario]").forEach((button) => {
  button.addEventListener("click", () => {
    currentScenario = button.dataset.scenario;
    currentCardIndex = scenarios[currentScenario].recommendedIndex;
    render();
    if (button.classList.contains("scenario")) closeSettings();
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
$("#changePlaceButton").addEventListener("click", openLocationSheet);
$("#closeSheet").addEventListener("click", closeSheet);
$("#expandDetailButton").addEventListener("click", expandDetailSheet);
$("#detailSheet .sheet-handle").addEventListener("click", expandDetailSheet);
$("#detailSheet .sheet-handle").addEventListener("pointerdown", (event) => {
  detailDragStartY = event.clientY;
  event.currentTarget.setPointerCapture(event.pointerId);
});
$("#detailSheet .sheet-handle").addEventListener("pointerup", (event) => {
  if (detailDragStartY - event.clientY > 24) expandDetailSheet();
  detailDragStartY = 0;
});
$("#reasonButton").addEventListener("click", openReason);
$("#reasonPopover").addEventListener("click", (event) => event.stopPropagation());
$("#scrim").addEventListener("click", closeOverlays);
$("#settingsButton").addEventListener("click", openSettings);
$("#closeSettings").addEventListener("click", closeSettings);
$("#closeLocationSheet").addEventListener("click", closeLocationSheet);
$("#walletPayButton").addEventListener("click", () => startPaymentFlow("card"));
$("#comboPayButton").addEventListener("click", () => startPaymentFlow("combo"));
$("#completeButton").addEventListener("click", advancePaymentFlow);
$("#resetButton").addEventListener("click", () => setScreen("wallet"));
$("#plannerButton").addEventListener("click", () => setScreen("wallet"));
window.addEventListener("resize", () => updateCardPosition());

attachSwipe();
render();
