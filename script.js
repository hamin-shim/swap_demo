const cards = [
  {
    issuer: "KB",
    name: "주유패스",
    displayName: "KB국민 주유패스",
    bg: "linear-gradient(135deg, #f9d923 0%, #fff36d 100%)",
    image: "./assets/card/Kb%20need%20pay.png"
  },
  {
    issuer: "SAMSUNG",
    name: "iD STATION",
    displayName: "삼성 iD STATION",
    bg: "linear-gradient(135deg, #f8fafc 0%, #dbeafe 48%, #1d4ed8 100%)",
    image: "./assets/card/samsung%20gs.png"
  },
  {
    issuer: "SHINHAN",
    name: "Deep Oil",
    displayName: "신한 Deep Oil",
    bg: "linear-gradient(135deg, #1251f5 0%, #1988ff 100%)",
    image: "./assets/card/Sinhan%20oil.png"
  },
  {
    issuer: "HYUNDAI",
    name: "M BOOST",
    displayName: "현대카드 M BOOST",
    bg: "linear-gradient(135deg, #111827 0%, #4b5563 100%)",
    image: "./assets/card/mboost.png"
  }
];

const locationOptions = [
  {
    id: "gscaltex",
    name: "GS칼텍스 삼평주유소",
    distance: "현재 위치",
    confidence: "91%",
    hint: "주유 할인 · GS&POINT",
    criterion: "max_benefit"
  },
  {
    id: "skenergy",
    name: "SK에너지 판교셀프",
    distance: "약 140m",
    confidence: "72%",
    hint: "리터당 할인 · OK캐쉬백",
    criterion: "max_benefit"
  },
  {
    id: "soil",
    name: "S-OIL 판교충전소",
    distance: "약 260m",
    confidence: "64%",
    hint: "주유 할인 · 포인트",
    criterion: "max_benefit"
  },
  {
    id: "evcharge",
    name: "EV 충전소",
    distance: "약 320m",
    confidence: "58%",
    hint: "충전 혜택 확인",
    criterion: "max_benefit"
  },
  {
    id: "baskin",
    name: "배스킨라빈스 판교역점",
    distance: "약 180m",
    confidence: "78%",
    hint: "KT 멤버십 · 해피포인트",
    criterion: "max_benefit"
  }
];

const locationScenarioSets = {
  gscaltex: {
  max_benefit: {
    merchant: "GS칼텍스 삼평주유소",
    confidence: "주유소 인식 91%",
    recommendedIndex: 1,
    type: "혜택",
    detail: "GS칼텍스, 주유 금액, 남은 월 한도, 전월 실적 조건을 함께 보고 계산했어요.",
    combinations: [
      {
        reason: "KB국민 주유패스는 리터당 할인은 있지만 이번 주유 금액에서는 한도가 작아요",
        benefit: "예상 혜택 2,800원",
        coupon: "적용 쿠폰 없음",
        membership: "주유 포인트 적립",
        insight: "남은 한도가 작아 이번에는 뒤로 보냈어요"
      },
      {
        reason: "삼성 iD STATION은 GS칼텍스 10% 결제일할인과 GS&POINT 자동 적립을 함께 받을 수 있어요",
        benefit: "예상 혜택 4,500원",
        coupon: "적용 쿠폰 없음",
        membership: "GS&POINT 자동 적립",
        insight: "이번 주유에서 가장 직관적인 할인 조합이에요"
      },
      {
        reason: "신한 Deep Oil은 주유 특화 카드지만 선택 정유사를 먼저 확인해야 해요",
        benefit: "선택 정유사 확인",
        coupon: "보유 쿠폰 없음",
        membership: "GS&POINT 적립",
        insight: "혜택은 크지만 이번 매장 조건은 확인이 필요해요"
      },
      {
        reason: "현대카드 M BOOST는 기본 적립은 가능하지만 주유 특화 할인은 약해요",
        benefit: "예상 혜택 900원",
        coupon: "적용 쿠폰 없음",
        membership: "GS&POINT 적립",
        insight: "마일리지나 포인트를 모을 때 선택할 수 있어요"
      }
    ]
  },
  remaining_cap: {
    merchant: "GS칼텍스 삼평주유소",
    confidence: "주유소 인식 91%",
    recommendedIndex: 1,
    type: "혜택",
    detail: "이번 달에 아직 남은 주유 할인 한도와 횟수를 먼저 봤어요.",
    combinations: [
      {
        reason: "KB국민 주유패스는 이번 달 주유 한도를 거의 사용했어요",
        benefit: "남은 한도 1,200원",
        coupon: "적용 쿠폰 없음",
        membership: "주유 포인트 적립",
        insight: "남은 한도가 작아 우선순위가 낮아요"
      },
      {
        reason: "삼성 iD STATION은 이번 달 GS칼텍스 할인 한도가 19,000원 남아 있어요",
        benefit: "남은 주유 한도 19,000원",
        coupon: "적용 쿠폰 없음",
        membership: "GS&POINT 자동 적립",
        insight: "오늘 주유에 적용해도 다음 주유 여유가 남아요"
      },
      {
        reason: "신한 Deep Oil은 이번 달 선택 정유사와 한도를 먼저 확인해야 해요",
        benefit: "주유 조건 확인",
        coupon: "적용 쿠폰 없음",
        membership: "GS&POINT 적립",
        insight: "선택 정유사와 한도 조건이 맞는지 확인해야 해요"
      },
      {
        reason: "현대카드 M BOOST는 주유 특화 한도보다 기본 적립 중심이에요",
        benefit: "예상 혜택 900원",
        coupon: "적용 쿠폰 없음",
        membership: "GS&POINT 적립",
        insight: "남은 주유 한도 관점에서는 약해요"
      }
    ]
  },
  performance_fill: {
    merchant: "GS칼텍스 삼평주유소",
    confidence: "주유소 인식 91%",
    recommendedIndex: 2,
    type: "실적",
    detail: "오늘 주유가 다음 달 주유 할인 조건을 채우는 데 얼마나 도움이 되는지 봤어요.",
    combinations: [
      {
        reason: "KB국민 주유패스는 이번 결제가 실적에 포함되지만 목표까지 아직 멀어요",
        benefit: "실적 318,000원/500,000원",
        coupon: "적용 쿠폰 없음",
        membership: "주유 포인트 적립",
        insight: "실적 관리 목적만으로는 아쉬워요"
      },
      {
        reason: "삼성 iD STATION은 이번 결제 후 다음 주유 혜택 조건까지 12,000원 남아요",
        benefit: "실적 388,000원/400,000원",
        coupon: "적용 쿠폰 없음",
        membership: "GS&POINT 자동 적립",
        insight: "할인도 크고 실적 조건에도 가까워져요"
      },
      {
        reason: "신한 Deep Oil은 이번 결제로 실적 조건은 채우지만 GS칼텍스 할인 확정이 필요해요",
        benefit: "실적 402,000원/400,000원",
        coupon: "적용 쿠폰 없음",
        membership: "GS&POINT 적립",
        insight: "실적만 보면 좋지만 할인 조건은 다시 봐야 해요"
      },
      {
        reason: "현대카드 M BOOST는 실적 관리 부담은 낮지만 주유 할인 금액이 작아요",
        benefit: "실적 조건 확인",
        coupon: "적용 쿠폰 없음",
        membership: "GS&POINT 적립",
        insight: "혜택 조건을 채우는 데는 우선순위가 낮은 선택이에요"
      }
    ]
  },
  no_condition: {
    merchant: "GS칼텍스 삼평주유소",
    confidence: "주유소 인식 91%",
    recommendedIndex: 3,
    type: "혜택",
    detail: "복잡한 주유 조건을 제외하고 바로 확인 가능한 기본 혜택만 봤어요.",
    combinations: [
      {
        reason: "KB국민 주유패스는 전월 실적 조건을 먼저 확인해야 해요",
        benefit: "실적 조건 확인",
        coupon: "적용 쿠폰 없음",
        membership: "주유 포인트 적립",
        insight: "주유 조건이 맞는지 확인해야 해요"
      },
      {
        reason: "삼성 iD STATION은 GS칼텍스 제휴 혜택이라 조건이 가장 명확해요",
        benefit: "예상 혜택 4,500원",
        coupon: "적용 쿠폰 없음",
        membership: "GS&POINT 자동 적립",
        insight: "GS칼텍스에서는 가장 설명하기 쉬운 조합이에요"
      },
      {
        reason: "신한 Deep Oil은 조건이 맞으면 좋지만 선택 정유사 확인이 필요해요",
        benefit: "실적 조건 확인",
        coupon: "적용 쿠폰 없음",
        membership: "GS&POINT 적립",
        insight: "결제 전 확인할 조건이 더 많아요"
      },
      {
        reason: "현대카드 M BOOST는 기본 포인트 적립 중심이에요",
        benefit: "예상 혜택 900원",
        coupon: "적용 쿠폰 없음",
        membership: "GS&POINT 적립",
        insight: "할인보다 포인트 적립을 원할 때 선택할 수 있어요"
      }
    ]
  }
  },
  skenergy: {
    max_benefit: {
      merchant: "SK에너지 판교셀프",
      confidence: "주유소 인식 72%",
      recommendedIndex: 2,
      type: "혜택",
      detail: "SK에너지 주유 할인과 남은 한도를 기준으로 다시 봤어요.",
      combinations: [
        { reason: "KB국민 주유패스는 리터당 할인 한도가 남아 있어요", benefit: "예상 혜택 3,100원", coupon: "적용 쿠폰 없음", membership: "OK캐쉬백 적립", insight: "SK에너지에서는 안정적인 선택이에요" },
        { reason: "삼성 iD STATION GS칼텍스형은 SK에너지 제휴가 아니에요", benefit: "제휴 매장 확인", coupon: "적용 쿠폰 없음", membership: "OK캐쉬백 적립", insight: "GS칼텍스에서 더 좋아요" },
        { reason: "신한 Deep Oil은 SK에너지 선택 시 리터당 할인이 커요", benefit: "예상 혜택 4,200원", coupon: "적용 쿠폰 없음", membership: "OK캐쉬백 적립", insight: "이 매장에서는 신한 카드가 더 유리해요" },
        { reason: "현대카드 M BOOST는 기본 포인트 적립 중심이에요", benefit: "예상 혜택 900원", coupon: "적용 쿠폰 없음", membership: "OK캐쉬백 적립", insight: "할인 금액는 작아요" }
      ]
    },
    remaining_cap: {
      merchant: "SK에너지 판교셀프",
      confidence: "주유소 인식 72%",
      recommendedIndex: 2,
      type: "혜택",
      detail: "SK에너지에서 남은 주유 한도를 먼저 확인했어요.",
      combinations: [
        { reason: "KB국민 주유패스는 한도 8,000원이 남아 있어요", benefit: "남은 주유 한도 8,000원", coupon: "적용 쿠폰 없음", membership: "OK캐쉬백 적립", insight: "아직 쓸 수 있는 한도가 있어요" },
        { reason: "삼성 iD STATION GS칼텍스형은 SK에너지에서는 제휴 혜택을 받을 수 없어요", benefit: "제휴 매장 확인", coupon: "적용 쿠폰 없음", membership: "OK캐쉬백 적립", insight: "현재 매장에는 맞지 않아요" },
        { reason: "신한 Deep Oil은 선택 정유사 조건이 맞으면 한도가 남아 있어요", benefit: "남은 주유 한도 12,000원", coupon: "적용 쿠폰 없음", membership: "OK캐쉬백 적립", insight: "이번 위치에서는 한도 여유가 커요" },
        { reason: "현대카드 M BOOST는 기본 적립 중심이에요", benefit: "예상 혜택 900원", coupon: "적용 쿠폰 없음", membership: "OK캐쉬백 적립", insight: "할인 한도형 추천은 아니에요" }
      ]
    },
    performance_fill: {
      merchant: "SK에너지 판교셀프",
      confidence: "주유소 인식 72%",
      recommendedIndex: 2,
      type: "실적",
      detail: "SK에너지 주유가 다음 달 혜택 조건에 포함되는지 봤어요.",
      combinations: [
        { reason: "KB국민 주유패스는 이번 결제가 실적에 포함돼요", benefit: "실적 318,000원/500,000원", coupon: "적용 쿠폰 없음", membership: "OK캐쉬백 적립", insight: "아직 목표까지 거리가 있어요" },
        { reason: "삼성 iD STATION은 GS칼텍스에서 실적과 혜택을 함께 보기 좋아요", benefit: "실적 조건 확인", coupon: "적용 쿠폰 없음", membership: "OK캐쉬백 적립", insight: "이 매장에서는 할인 조건이 맞지 않아요" },
        { reason: "신한 Deep Oil은 실적 조건을 채우면서 주유 혜택도 노릴 수 있어요", benefit: "실적 402,000원/400,000원", coupon: "적용 쿠폰 없음", membership: "OK캐쉬백 적립", insight: "실적 기준에서는 가장 좋아요" },
        { reason: "현대카드 M BOOST는 실적 관리 부담은 낮지만 주유 할인은 약해요", benefit: "실적 조건 확인", coupon: "적용 쿠폰 없음", membership: "OK캐쉬백 적립", insight: "실적 기준에서는 우선순위가 낮아요" }
      ]
    },
    no_condition: {
      merchant: "SK에너지 판교셀프",
      confidence: "주유소 인식 72%",
      recommendedIndex: 2,
      type: "혜택",
      detail: "확인할 조건이 적은 혜택을 우선했어요.",
      combinations: []
    }
  },
  soil: {
    max_benefit: {
      merchant: "S-OIL 판교충전소",
      confidence: "주유소 인식 64%",
      recommendedIndex: 0,
      type: "혜택",
      detail: "S-OIL에서 받을 수 있는 주유 혜택을 확인했어요.",
      combinations: [
        { reason: "KB국민 주유패스는 S-OIL에서도 리터당 할인을 받을 수 있어요", benefit: "예상 혜택 3,300원", coupon: "적용 쿠폰 없음", membership: "S-OIL 포인트 적립", insight: "이 위치에서는 KB 카드가 안정적이에요" },
        { reason: "삼성 iD STATION GS칼텍스형은 S-OIL 제휴가 아니에요", benefit: "제휴 매장 확인", coupon: "적용 쿠폰 없음", membership: "S-OIL 포인트 적립", insight: "GS칼텍스에서 더 좋아요" },
        { reason: "신한 Deep Oil은 선택 정유사를 먼저 확인해야 해요", benefit: "선택 정유사 확인", coupon: "적용 쿠폰 없음", membership: "S-OIL 포인트 적립", insight: "조건이 맞으면 선택할 수 있어요" },
        { reason: "현대카드 M BOOST는 기본 적립 중심이에요", benefit: "예상 혜택 900원", coupon: "적용 쿠폰 없음", membership: "S-OIL 포인트 적립", insight: "할인 금액는 작아요" }
      ]
    },
    remaining_cap: null,
    performance_fill: null,
    no_condition: null
  },
  evcharge: {
    max_benefit: {
      merchant: "EV 충전소",
      confidence: "충전소 인식 58%",
      recommendedIndex: 3,
      type: "혜택",
      detail: "전기차 충전에 맞는 혜택을 확인했어요.",
      combinations: [
        { reason: "KB국민 주유패스는 주유 혜택 중심이에요", benefit: "충전 혜택 확인", coupon: "적용 쿠폰 없음", membership: "충전 포인트 적립", insight: "주유소에서 더 적합해요" },
        { reason: "삼성 iD STATION은 주유소 혜택 중심이에요", benefit: "충전 혜택 확인", coupon: "적용 쿠폰 없음", membership: "충전 포인트 적립", insight: "GS칼텍스 주유에서 더 좋아요" },
        { reason: "신한 Deep Oil은 주유 할인 중심이에요", benefit: "충전 혜택 확인", coupon: "적용 쿠폰 없음", membership: "충전 포인트 적립", insight: "충전소 혜택은 별도 확인이 필요해요" },
        { reason: "현대카드 M BOOST는 기본 포인트 적립이 가능해요", benefit: "예상 혜택 1,100원", coupon: "적용 쿠폰 없음", membership: "충전 포인트 적립", insight: "충전소에서는 기본 적립이 가장 단순해요" }
      ]
    },
    remaining_cap: null,
    performance_fill: null,
    no_condition: null
  },
  baskin: {
    max_benefit: {
      merchant: "배스킨라빈스 판교역점",
      confidence: "매장 인식 78%",
      recommendedIndex: 3,
      type: "혜택",
      detail: "배스킨라빈스 제휴 혜택, 통신사 쿠폰, 카드 포인트 사용, 해피포인트 적립 가능성을 함께 봤어요.",
      combinations: [
        { reason: "KB국민 주유패스는 배스킨라빈스 직접 할인보다 기본 결제 중심이에요", benefit: "예상 혜택 300원", coupon: "적용 쿠폰 없음", membership: "해피포인트 적립", insight: "이번 매장에서는 할인 금액이 작아요" },
        { reason: "삼성카드는 LINK 쿠폰 연결 시 배스킨라빈스에서 2,000원 할인을 받을 수 있어요", benefit: "예상 혜택 2,000원", coupon: "삼성카드 LINK 2,000원 OFF", membership: "해피포인트 적립", insight: "LINK 쿠폰을 이미 연결했다면 안정적인 선택이에요" },
        { reason: "신한 Deep Oil은 주유 특화 카드라 배스킨라빈스 직접 혜택이 약해요", benefit: "업종 혜택 확인", coupon: "보유 쿠폰 없음", membership: "해피포인트 적립", insight: "주유소 결제에 더 적합해요" },
        { reason: "현대카드 M BOOST는 M포인트 50% 사용 혜택을 적용하기 좋아요", benefit: "예상 혜택 7,300원", coupon: "현대카드 M포인트 50% 사용", membership: "해피포인트 적립", insight: "포인트 사용까지 포함하면 가장 큰 혜택이에요" }
      ]
    },
    remaining_cap: {
      merchant: "배스킨라빈스 판교역점",
      confidence: "매장 인식 78%",
      recommendedIndex: 1,
      type: "혜택",
      detail: "지금 바로 적용 가능한 쿠폰과 포인트 사용 한도를 먼저 확인했어요.",
      combinations: [
        { reason: "KB국민 주유패스는 배스킨라빈스 쿠폰이 없어요", benefit: "예상 혜택 300원", coupon: "적용 쿠폰 없음", membership: "해피포인트 적립", insight: "기본 적립만 기대할 수 있어요" },
        { reason: "삼성카드 LINK 쿠폰은 18,500원 이상 결제 시 2,000원 OFF 조건이 명확해요", benefit: "남은 쿠폰 2,000원", coupon: "삼성카드 LINK 2,000원 OFF", membership: "해피포인트 적립", insight: "쿠폰 조건이 가장 단순해요" },
        { reason: "신한 Deep Oil은 배스킨라빈스 쿠폰이 없어요", benefit: "업종 혜택 확인", coupon: "보유 쿠폰 없음", membership: "해피포인트 적립", insight: "이번 업종에는 맞지 않아요" },
        { reason: "현대카드 M포인트는 보유 포인트가 충분하면 50% 사용이 가능해요", benefit: "남은 포인트 7,300원", coupon: "현대카드 M포인트 50% 사용", membership: "해피포인트 적립", insight: "포인트 잔액이 충분할 때 좋아요" }
      ]
    },
    performance_fill: {
      merchant: "배스킨라빈스 판교역점",
      confidence: "매장 인식 78%",
      recommendedIndex: 1,
      type: "실적",
      detail: "오늘 결제가 다음 달 생활/F&B 혜택 조건을 채우는 데 얼마나 도움이 되는지 봤어요.",
      combinations: [
        { reason: "KB국민 주유패스는 이번 결제가 실적에 포함되지만 배스킨라빈스 혜택은 약해요", benefit: "실적 322,000원/500,000원", coupon: "적용 쿠폰 없음", membership: "해피포인트 적립", insight: "실적 관리 목적만으로는 아쉬워요" },
        { reason: "삼성카드는 LINK 쿠폰을 쓰면서 다음 혜택 조건에도 가까워져요", benefit: "실적 392,000원/400,000원", coupon: "삼성카드 LINK 2,000원 OFF", membership: "해피포인트 적립", insight: "실적과 쿠폰을 함께 챙기기 좋아요" },
        { reason: "신한 Deep Oil은 실적에는 포함될 수 있지만 배스킨라빈스 혜택은 약해요", benefit: "실적 404,000원/400,000원", coupon: "보유 쿠폰 없음", membership: "해피포인트 적립", insight: "실적만 보면 가능하지만 혜택은 약해요" },
        { reason: "현대카드 M BOOST는 포인트 사용 혜택은 크지만 실적 기준에서는 우선순위가 낮아요", benefit: "실적 조건 확인", coupon: "현대카드 M포인트 50% 사용", membership: "해피포인트 적립", insight: "혜택 기준에서는 좋지만 실적 기준에서는 밀려요" }
      ]
    },
    no_condition: {
      merchant: "배스킨라빈스 판교역점",
      confidence: "매장 인식 78%",
      recommendedIndex: 1,
      type: "혜택",
      detail: "복잡한 통신사 조건을 제외하고 카드에서 바로 확인 가능한 혜택을 우선했어요.",
      combinations: [
        { reason: "KB국민 주유패스는 배스킨라빈스 직접 혜택이 작아요", benefit: "예상 혜택 300원", coupon: "적용 쿠폰 없음", membership: "해피포인트 적립", insight: "기본 결제에 가까워요" },
        { reason: "삼성카드 LINK는 쿠폰 연결만 되어 있으면 조건이 비교적 명확해요", benefit: "예상 혜택 2,000원", coupon: "삼성카드 LINK 2,000원 OFF", membership: "해피포인트 적립", insight: "확인할 조건이 적은 편이에요" },
        { reason: "신한 Deep Oil은 주유 혜택 중심이라 배스킨라빈스 혜택은 약해요", benefit: "업종 혜택 확인", coupon: "보유 쿠폰 없음", membership: "해피포인트 적립", insight: "이번 업종에는 적합하지 않아요" },
        { reason: "현대카드 M포인트는 잔액 조건이 맞아야 혜택이 커져요", benefit: "포인트 잔액 확인", coupon: "현대카드 M포인트 50% 사용", membership: "해피포인트 적립", insight: "포인트 잔액 확인이 필요해요" }
      ]
    }
  }
};

["soil", "evcharge"].forEach((locationId) => {
  ["remaining_cap", "performance_fill", "no_condition"].forEach((criterion) => {
    locationScenarioSets[locationId][criterion] = locationScenarioSets[locationId].max_benefit;
  });
});

locationScenarioSets.skenergy.no_condition = locationScenarioSets.skenergy.max_benefit;

Object.entries(locationScenarioSets).forEach(([locationId, scenarioSet]) => {
  scenarioSet.mileage = createMileageScenario(locationId, scenarioSet);
});

let currentLocation = "gscaltex";
let scenarios = locationScenarioSets[currentLocation];

let currentScenario = "max_benefit";
let currentCardIndex = recommendedCardIndex(scenarios[currentScenario]);
let previewScenario = currentScenario;
let previewLocation = currentLocation;
let isSwapMinimized = false;
let currentPayStep = 0;
let currentPayMode = "combo";
let selectedPayExtra = null;
let isPayExtraListOpen = false;
let isDirectPayExtraOpen = false;
let dragStartX = 0;
let dragCurrentX = 0;
let isDragging = false;
let didDrag = false;
let nfcTimerId = null;
let nfcRemaining = 50;
let nfcWasPaymentStep = false;
let sheetDrag = null;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const fields = {
  merchantName: $("#merchantName"),
  swapAssist: $("#swapAssist"),
  swapToggleButton: $("#swapToggleButton"),
  swapMinimizedText: $("#swapMinimizedText"),
  whyButton: $("#whyButton"),
  changePlaceButton: $("#changePlaceButton"),
  walletHint: $("#walletHint"),
  detailSheetTitle: $("#detailSheetTitle"),
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
  payExtraLauncher: $("#payExtraLauncher"),
  payStepLabel: $("#payStepLabel"),
  payStepTitle: $("#payStepTitle"),
  payStepType: $("#payStepType"),
  payStepValue: $("#payStepValue"),
  payStepCode: $("#payStepCode"),
  payExtraToggle: $("#payExtraToggle"),
  payExtraList: $("#payExtraList"),
  payGuide: $("#payGuide"),
  payTimerBox: $("#payTimerBox"),
  payTimer: $("#payTimer"),
  nfcStatus: $("#nfcStatus"),
  completeButton: $("#completeButton"),
  resultSummary: $("#resultSummary"),
  resultBenefitLabel: $("#resultBenefitLabel"),
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
  detailText: $("#detailText"),
  criteriaPreviewTitle: $("#criteriaPreviewTitle"),
  criteriaPreviewText: $("#criteriaPreviewText"),
  settingsPreviewTitle: $("#settingsPreviewTitle"),
  settingsPreviewText: $("#settingsPreviewText"),
  applyCriteriaButton: $("#applyCriteriaButton"),
  applySettingsButton: $("#applySettingsButton"),
  applyLocationButton: $("#applyLocationButton"),
  reasonDetailList: $("#reasonDetailList")
};

function formatBenefitCallout(benefit) {
  const amount = benefit.match(/[0-9,]+원/)?.[0];
  if (amount) return `${amount} 혜택을 받으세요`;
  if (benefit.includes("실적")) return "실적을 채워요";
  if (benefit.includes("마일")) return "마일리지 적립";
  return benefit;
}

function formatSheetTitle(type) {
  if (type.includes("마일")) return "항공 마일리지로 적립해요";
  if (type.includes("실적")) return "이번 결제가 실적에 도움돼요";
  return "혜택이 좋은 조합이에요";
}

function formatBenefitAmount(benefit) {
  return benefit.match(/[0-9,]+원\/[0-9,]+원/)?.[0]
    || benefit.match(/[0-9,]+원/)?.[0]
    || benefit.replace(/^예상 혜택\s*/, "");
}

function formatBenefitLabel(type) {
  if (type.includes("마일")) return "마일리지";
  if (type.includes("실적")) return "이번 달 실적";
  return "예상 혜택";
}

function formatBenefitHighlight(type, benefitAmount) {
  if (type.includes("실적") || type.includes("마일")) return benefitAmount;
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

function formatCardBenefitCta(scenario, combo) {
  if (!combo) return "혜택 조건 확인";
  if (scenario.type.includes("마일")) return combo.benefit.includes("마일") ? combo.benefit.replace(" 적립 예상", "") : "마일리지 조건 확인";
  if (scenario.type.includes("실적")) {
    if (combo.benefit.includes("388,000원/400,000원")) return "실적 12,000원 남음";
    if (combo.benefit.includes("/")) return formatBenefitDisplay(formatBenefitAmount(combo.benefit));
    return "실적 조건 확인";
  }
  if (combo.benefit.includes("정유사")) return "정유사 확인";
  if (combo.benefit.includes("업종")) return "업종 혜택 확인";
  if (combo.benefit.includes("충전")) return "충전 혜택 확인";
  if (combo.benefit.includes("제휴")) return "제휴 매장 확인";
  if (combo.benefit.includes("실적")) return "실적 조건 확인";
  if (combo.benefit.includes("포인트 잔액")) return "포인트 잔액 확인";
  if (combo.benefit.includes("조건") || combo.benefit.includes("확인")) return "혜택 조건 확인";
  if (combo.benefit.includes("남은 주유 한도")) return combo.benefit.replace("남은 주유 한도 ", "한도 ");
  if (combo.benefit.includes("남은 한도")) return combo.benefit.replace("남은 한도 ", "한도 ");
  const amount = formatBenefitAmount(combo.benefit);
  return amount.match(/[0-9,]+원/) ? `${amount} 할인 예상` : "혜택 조건 확인";
}

function formatPrimaryAction(scenario, combo) {
  return formatCardBenefitCta(scenario, combo);
}

function syncSwapAssistState() {
  const icon = fields.swapToggleButton.querySelector(".material-symbols-rounded");
  fields.swapAssist.classList.toggle("is-minimized", isSwapMinimized);
  fields.swapToggleButton.setAttribute("aria-expanded", String(!isSwapMinimized));
  fields.swapToggleButton.setAttribute("aria-label", isSwapMinimized ? "SWAP 추천 펼치기" : "SWAP 추천 접기");
  icon.textContent = isSwapMinimized ? "keyboard_arrow_down" : "keyboard_arrow_up";
}

function formatBenefitDisplay(benefitAmount) {
  return benefitAmount.replace("360,000원/500,000원", "36만원 / 50만원")
    .replace("290,000원/500,000원", "29만원 / 50만원")
    .replace("420,000원/500,000원", "42만원 / 50만원")
    .replace("340,000원/500,000원", "34만원 / 50만원");
}

function parseWon(value) {
  const amount = value.match(/([0-9,]+)원/)?.[1];
  return amount ? Number(amount.replace(/,/g, "")) : 0;
}

function parseMiles(value) {
  const amount = value.match(/([0-9,]+)마일/)?.[1];
  return amount ? Number(amount.replace(/,/g, "")) : 0;
}

function parsePerformanceValue(value) {
  const amount = value.match(/([0-9,]+)원\/[0-9,]+원/)?.[1];
  return amount ? Number(amount.replace(/,/g, "")) : 0;
}

function expectedBenefit({ paymentAmount = 25000, rate = 0, remainingCap = Infinity, fixedAmount = 0 }) {
  const calculated = fixedAmount || Math.round(paymentAmount * rate);
  return Math.max(0, Math.min(calculated, remainingCap));
}

function scoreCombo(scenario, combo) {
  if (!combo || /(없음|필요|낮음|아님)/.test(combo.benefit)) return -1;
  if (scenario.type.includes("마일")) return parseMiles(combo.benefit);
  if (scenario.type.includes("실적")) return parsePerformanceValue(combo.benefit) || (combo.benefit.includes("실적") ? 1 : 0);
  return expectedBenefit({ fixedAmount: parseWon(combo.benefit) });
}

function recommendedCardIndex(scenario) {
  return scenario.combinations.reduce((bestIndex, combo, index) => {
    const currentScore = scoreCombo(scenario, combo);
    const bestScore = scoreCombo(scenario, scenario.combinations[bestIndex]);
    return currentScore > bestScore ? index : bestIndex;
  }, scenario.recommendedIndex || 0);
}

function currentData() {
  const scenario = scenarios[currentScenario];
  const card = cards[currentCardIndex];
  const combo = scenario.combinations[currentCardIndex];
  return { scenario, card, combo };
}

function createMileageScenario(locationId, scenarioSet) {
  const base = scenarioSet.no_condition || scenarioSet.max_benefit;
  const merchant = base.merchant;
  const confidence = base.confidence;
  const membershipByLocation = {
    gscaltex: "GS&POINT 자동 적립",
    skenergy: "OK캐쉬백 적립",
    soil: "S-OIL 포인트 적립",
    evcharge: "충전 포인트 적립",
    baskin: "해피포인트 적립"
  };
  const milesByLocation = {
    gscaltex: "항공 마일리지 45마일",
    skenergy: "항공 마일리지 42마일",
    soil: "항공 마일리지 40마일",
    evcharge: "항공 마일리지 18마일",
    baskin: "항공 마일리지 32마일"
  };
  const displayMerchant = {
    gscaltex: "GS칼텍스",
    skenergy: "SK에너지",
    soil: "S-OIL",
    evcharge: "충전소",
    baskin: "배스킨라빈스"
  };

  return {
    merchant,
    confidence,
    recommendedIndex: 3,
    type: "마일리지",
    detail: "현금 할인보다 항공 마일리지 적립을 우선해서 골랐어요.",
    combinations: cards.map((card, index) => {
      const isRecommended = index === 3;
      return {
        reason: isRecommended
          ? `${card.displayName}은 ${displayMerchant[locationId]} 결제도 항공 마일리지로 쌓을 수 있어요`
          : `${card.displayName}은 이번 결제에서 마일리지 적립 효율이 낮아요`,
        benefit: isRecommended ? `${milesByLocation[locationId]} 적립 예상` : "마일리지 혜택 작음",
        coupon: "적용 쿠폰 없음",
        membership: membershipByLocation[locationId],
        insight: isRecommended ? "항공권 적립을 우선하면 이 카드가 적합해요" : "혜택 우선 기준에서는 선택할 수 있어요"
      };
    })
  };
}

function getDataFor(scenarioKey = currentScenario, locationId = currentLocation) {
  const scenarioSet = locationScenarioSets[locationId] || scenarios;
  const scenario = scenarioSet[scenarioKey] || scenarioSet.max_benefit;
  const cardIndex = recommendedCardIndex(scenario);
  const card = cards[cardIndex];
  const combo = scenario.combinations[cardIndex];
  return { scenario, card, combo, cardIndex };
}

function currentLocationOption() {
  return locationOptions.find((option) => option.id === currentLocation) || locationOptions[0];
}

function getLocationOption(locationId) {
  return locationOptions.find((option) => option.id === locationId) || locationOptions[0];
}

function cardAppName(card) {
  if (card.issuer === "SAMSUNG") return "삼성카드 앱";
  if (card.issuer === "KB") return "KB Pay";
  if (card.issuer === "SHINHAN") return "신한 SOL페이";
  if (card.issuer === "HYUNDAI") return "현대카드 앱";
  return "카드사 앱";
}

function hasUsableAsset(value) {
  return value && !/(없음|필요|추가 혜택 없음)/.test(value);
}

function displayAsset(value) {
  return value
    .replace(/\s*멤버십\s*/g, " ")
    .replace(/\s*적립\s*$/g, "")
    .trim();
}

function compactCopy(value) {
  return value
    .replace(/\s*\+\s*GS&POINT\s*자동\s*적립/g, "")
    .replace(/GS&POINT 자동 적립/g, "GS&POINT")
    .replace(/OK캐쉬백 적립/g, "OK캐쉬백")
    .replace(/S-OIL 포인트 적립/g, "S-OIL 포인트")
    .replace(/해피포인트 적립/g, "해피포인트")
    .replace(/멤버십/g, "적립")
    .trim();
}

function benefitTypeFor(scenario, combo) {
  if (scenario.type.includes("마일")) return "mileage";
  if (scenario.type.includes("실적") || combo.benefit.includes("/")) return "performance";
  if (combo.benefit.includes("캐시백")) return "cashback";
  if (combo.benefit.includes("포인트")) return "point";
  return "discount";
}

function buildBenefitBreakdown(scenario, card, combo) {
  const type = benefitTypeFor(scenario, combo);
  const rows = [
    { label: "카드 결제", value: card.displayName, state: "완료", benefitType: "payment" }
  ];

  if (hasUsableAsset(combo.coupon)) {
    rows.push({ label: "쿠폰", value: combo.coupon, state: "사용 예정", benefitType: "coupon" });
  }

  if (hasUsableAsset(combo.membership)) {
    rows.push({ label: "적립", value: displayAsset(combo.membership), state: "적립 예정", benefitType: "membership" });
  }

  const benefitLabel = type === "mileage" ? "마일리지" : type === "performance" ? "실적" : "카드 혜택";
  const benefitState = type === "performance" ? "실적 포함 예정" : type === "mileage" ? "적립 예정" : "청구할인 예정";
  rows.push({ label: benefitLabel, value: combo.benefit, state: benefitState, benefitType: type });

  return rows;
}

function resultBenefitFor(scenario, combo, progress) {
  if (scenario.type.includes("실적")) return progress.value;
  return formatBenefitAmount(combo.benefit);
}

function progressReportFor(scenario) {
  const isBaskin = scenario.merchant.includes("배스킨라빈스");
  if (scenario.type.includes("마일")) {
    return {
      label: "추천 기준",
      value: "마일리지",
      width: "100%",
      hint: "항공 마일리지는 카드사 확정 후 적립돼요"
    };
  }
  if (scenario.type.includes("실적")) {
    return {
      label: "이번 달 카드 실적",
      value: isBaskin ? "392,000원/400,000원" : "388,000원/400,000원",
      width: isBaskin ? "98%" : "97%",
      hint: isBaskin ? "다음 생활 혜택 조건까지 8,000원 남았어요" : "다음 주유 실적 충족까지 12,000원 남았어요"
    };
  }
  return {
    label: "이번 달 카드 실적",
    value: isBaskin ? "392,000원/400,000원" : "388,000원/400,000원",
    width: isBaskin ? "98%" : "97%",
    hint: isBaskin ? "다음 생활 혜택 조건까지 8,000원 남았어요" : "다음 주유 실적 충족까지 12,000원 남았어요"
  };
}

function renderReasonDetails(scenario, card, combo) {
  const breakdown = buildBenefitBreakdown(scenario, card, combo)
    .filter((item) => item.benefitType !== "payment")
    .slice(0, 3);
  const alternatives = cards
    .map((candidate, index) => ({ candidate, index, combo: scenario.combinations[index] }))
    .filter((item) => item.index !== currentCardIndex && item.combo)
    .slice(0, 2);

  fields.reasonDetailList.innerHTML = `
    ${breakdown.map((item) => `
      <div class="reason-detail-row">
        <span>${item.label}</span>
        <strong>${item.value}</strong>
        <em>${item.state}</em>
      </div>
    `).join("")}
    ${alternatives.length ? `
      <div class="reason-alternatives">
        <span>다른 카드는?</span>
        ${alternatives.map((item) => `
          <p><strong>${item.candidate.displayName}</strong> ${item.combo.insight}</p>
        `).join("")}
      </div>
    ` : ""}
  `;
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

function benefitStepLabel(value) {
  if (value.includes("M포인트")) return "포인트";
  if (value.includes("멤버십")) return "멤버십";
  if (value.includes("LINK")) return "카드쿠폰";
  return "매장쿠폰";
}

function buildCouponStep(value) {
  if (value.includes("M포인트")) {
    return {
      type: "point",
      label: "포인트",
      title: "M포인트 사용을 요청하세요",
      value,
      code: "직원 또는 키오스크에서 선택",
      guide: "결제 전 M포인트 사용을 요청한 뒤 카드 결제로 넘어가요.",
      button: "요청 완료"
    };
  }

  return {
    type: "coupon",
    label: benefitStepLabel(value),
    title: "먼저 쿠폰 바코드를 보여주세요",
    value,
    code: "8801 0427 3000",
    guide: "아직 결제 전이에요.",
    button: "쿠폰 사용 완료"
  };
}

function buildCombinedBenefitStep(combo) {
  const extra = selectedPayExtra || defaultPayExtraOption();
  const baseItems = [
    hasUsableAsset(combo.coupon) ? compactCopy(combo.coupon) : "",
    extra?.value || (hasUsableAsset(combo.membership) ? displayAsset(combo.membership) : "")
  ].filter(Boolean);

  return {
    type: "benefit",
    label: "적립/쿠폰",
    title: "적립과 쿠폰을 먼저 확인하세요",
    value: baseItems.join(" + ") || "추가 혜택 선택",
    code: extra?.code || "3108 2407 1142",
    guide: extra?.guide || "필요한 쿠폰이나 멤버십을 보여준 뒤 카드 결제로 넘어가요.",
    button: "적립/쿠폰 사용 완료"
  };
}

function payExtraOptions() {
  const { scenario } = currentData();
  if (scenario.merchant.includes("배스킨라빈스")) {
    return [
      {
        id: "happy",
        type: "멤버십",
        value: "해피포인트",
        meta: "기본 적립",
        code: "3108 2407 1142",
        theme: "happy",
        guide: "M포인트 사용을 요청하고 해피포인트 바코드를 스캔해요."
      },
      {
        id: "kt",
        type: "멤버십",
        value: "KT 멤버십 VIP",
        meta: "VIP 혜택",
        code: "9000 1485 4927",
        theme: "kt",
        guide: "KT 멤버십 바코드를 먼저 보여주고 M포인트 사용을 요청해요."
      },
      {
        id: "baskin-coupon",
        type: "매장쿠폰",
        value: "배스킨 모바일쿠폰",
        meta: "D-3",
        code: "9350 1669 2404 4324",
        theme: "baskin",
        guide: "모바일쿠폰 바코드를 스캔한 뒤 M포인트 사용 여부를 확인해요."
      }
    ];
  }

  if (scenario.merchant.includes("SK에너지")) {
    return [
      {
        id: "okcashbag",
        type: "멤버십",
        value: "OK캐쉬백",
        meta: "포인트 적립",
        code: "2407 1142 3108",
        theme: "ok",
        guide: "OK캐쉬백 바코드를 스캔하고 카드 결제로 넘어가요."
      },
      {
        id: "sk-coupon",
        type: "매장쿠폰",
        value: "SK 주유쿠폰",
        meta: "D-5",
        code: "8801 2407 4500",
        theme: "sk",
        guide: "SK 주유쿠폰 바코드를 먼저 보여준 뒤 카드 결제로 넘어가요."
      },
      {
        id: "gs-point",
        type: "멤버십",
        value: "GS&POINT",
        meta: "보유 멤버십",
        code: "3108 2407 1142",
        theme: "gspoint",
        guide: "GS&POINT 바코드를 스캔하고 카드 결제로 넘어가요."
      }
    ];
  }

  if (scenario.merchant.includes("S-OIL")) {
    return [
      {
        id: "soil-point",
        type: "멤버십",
        value: "S-OIL 포인트",
        meta: "포인트 적립",
        code: "5012 2407 1142",
        theme: "soil",
        guide: "S-OIL 포인트 바코드를 스캔하고 카드 결제로 넘어가요."
      },
      {
        id: "soil-coupon",
        type: "매장쿠폰",
        value: "S-OIL 주유쿠폰",
        meta: "D-6",
        code: "8801 5012 3000",
        theme: "soil-coupon",
        guide: "S-OIL 주유쿠폰 바코드를 먼저 보여준 뒤 카드 결제로 넘어가요."
      },
      {
        id: "okcashbag",
        type: "멤버십",
        value: "OK캐쉬백",
        meta: "보유 멤버십",
        code: "2407 1142 3108",
        theme: "ok",
        guide: "OK캐쉬백 바코드를 스캔하고 카드 결제로 넘어가요."
      }
    ];
  }

  if (scenario.merchant.includes("EV")) {
    return [
      {
        id: "charge-point",
        type: "멤버십",
        value: "충전 포인트",
        meta: "포인트 적립",
        code: "7070 2407 1142",
        theme: "charge",
        guide: "충전 포인트 바코드를 스캔하고 카드 결제로 넘어가요."
      },
      {
        id: "charge-coupon",
        type: "매장쿠폰",
        value: "충전 1천원 쿠폰",
        meta: "D-4",
        code: "8801 7070 1000",
        theme: "charge-coupon",
        guide: "충전 쿠폰 바코드를 먼저 보여준 뒤 카드 결제로 넘어가요."
      }
    ];
  }

  return [
    {
      id: "gs-point",
      type: "멤버십",
      value: "GS&POINT",
      meta: "자동 적립",
      code: "3108 2407 1142",
      theme: "gspoint",
      guide: "GS&POINT 바코드를 스캔하고 카드 결제로 넘어가요."
    },
    {
      id: "oil-coupon",
      type: "매장쿠폰",
      value: "주유 2천원 쿠폰",
      meta: "D-7",
      code: "8801 0427 3000",
      theme: "oil",
      guide: "주유 쿠폰 바코드를 먼저 보여준 뒤 카드 결제로 넘어가요."
    },
    {
      id: "okcashbag",
      type: "멤버십",
      value: "OK캐쉬백",
      meta: "포인트 적립",
      code: "2407 1142 3108",
      theme: "ok",
      guide: "OK캐쉬백 바코드를 스캔하고 카드 결제로 넘어가요."
    }
  ];
}

function defaultPayExtraOption() {
  return payExtraOptions()[0] || null;
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
      title: `${card.displayName}`,
      value: card.displayName,
      code: "NFC 결제 대기 중",
      guide: "폰의 뒷면을 카드 리더기에 대세요.",
      button: "결제 완료"
    }];
  }

  steps.push(buildCombinedBenefitStep(combo));

  steps.push({
    type: "payment",
    label: "결제",
    title: `${card.displayName}`,
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

  fields.payTabs.textContent = currentPayMode === "card" ? "카드 결제" : "혜택 순서";
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
  const directExtra = currentPayMode === "card" && isPayment ? (selectedPayExtra || defaultPayExtraOption()) : null;
  fields.payStepType.textContent = directExtra?.type || step.label;
  fields.payStepValue.textContent = directExtra?.value || step.value;
  fields.payStepCode.textContent = directExtra?.code || step.code;
  fields.payGuide.textContent = step.guide;
  fields.completeButton.textContent = step.button;
  fields.payCodeCard.dataset.extraTheme = (directExtra || selectedPayExtra || defaultPayExtraOption())?.theme || "default";
  fields.payFlowPanel.classList.toggle("is-payment-step", isPayment);
  fields.payFlowPanel.classList.toggle("is-direct-card-pay", currentPayMode === "card");
  fields.payCodeCard.hidden = currentPayMode === "card" ? !isDirectPayExtraOpen : isPayment;
  $(".screen-pay").dataset.payStep = step.type;
  $(".screen-pay").dataset.payMode = currentPayMode;
  renderPayExtraControls(step, isPayment);

  if (isPayment && !nfcWasPaymentStep) {
    startNfcTimer();
    nfcWasPaymentStep = true;
  } else if (!isPayment && nfcWasPaymentStep) {
    stopNfcTimer();
  }
}

function renderPayExtraControls(step, isPayment) {
  const options = payExtraOptions();
  const isDirectCardPayment = currentPayMode === "card" && isPayment;
  const canChooseExtra = (isDirectCardPayment || (!isPayment && step.type === "benefit")) && options.length > 1;
  fields.payExtraLauncher.hidden = !isDirectCardPayment;
  fields.payExtraLauncher.classList.toggle("is-open", isDirectPayExtraOpen);
  fields.payExtraLauncher.textContent = isDirectPayExtraOpen ? "쿠폰/멤버십 닫기" : "쿠폰/멤버십 사용하기";
  fields.payExtraToggle.hidden = !canChooseExtra;
  fields.payExtraToggle.textContent = isDirectCardPayment ? "다른 쿠폰/멤버십 보기" : "다른 쿠폰/멤버십 보기";
  fields.payExtraList.hidden = !canChooseExtra || !isPayExtraListOpen;
  fields.payExtraToggle.setAttribute("aria-expanded", String(canChooseExtra && isPayExtraListOpen));

  if (!canChooseExtra) {
    fields.payExtraList.innerHTML = "";
    return;
  }

  const selectedId = (selectedPayExtra || defaultPayExtraOption())?.id;
  fields.payExtraList.innerHTML = options.map((option) => `
    <button type="button" class="pay-extra-option ${option.id === selectedId ? "is-selected" : ""}" data-pay-extra="${option.id}" data-extra-theme="${option.theme}">
      <i aria-hidden="true">${option.type === "매장쿠폰" ? "C" : "M"}</i>
      <span>${option.type}</span>
      <strong>${option.value}</strong>
      <em>${option.meta}</em>
    </button>
  `).join("");

  $$("#payExtraList .pay-extra-option").forEach((button) => {
    button.addEventListener("click", () => {
      selectedPayExtra = options.find((option) => option.id === button.dataset.payExtra) || null;
      isPayExtraListOpen = false;
      renderPayStep();
    });
  });
}

function renderCards() {
  const track = $("#cardTrack");
  const dots = $("#cardDots");
  const recommendedIndex = recommendedCardIndex(scenarios[currentScenario]);

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
      ${!isSwapMinimized && index === currentCardIndex ? `<span class="card-badge">${index === recommendedIndex ? "추천" : "선택"}</span>` : ""}
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

function toggleSwapAssist() {
  isSwapMinimized = !isSwapMinimized;
  render();
}

function render() {
  const { scenario, card, combo } = currentData();
  const benefitAmount = formatBenefitAmount(combo.benefit);
  const location = currentLocationOption();

  fields.merchantName.textContent = `${scenario.merchant}에서 결제하시나요?`;
  fields.swapMinimizedText.textContent = "결제 추천 다시 켜기";
  fields.whyButton.textContent = formatPrimaryAction(scenario, combo);
  fields.changePlaceButton.textContent = "다른 매장이에요";
  fields.walletHint.textContent = isSwapMinimized ? "추천 없이 선택한 카드로 결제할 수 있어요" : "혜택은 결제 전에 한 번 더 확인할 수 있어요";
  fields.detailSheetTitle.textContent = formatSheetTitle(scenario.type);
  fields.benefitLabel.textContent = formatBenefitLabel(scenario.type);
  fields.comboCard.textContent = card.displayName;
  fields.comboCoupon.textContent = combo.coupon;
  fields.comboMembership.textContent = combo.membership;
  fields.comboCoupon.closest(".combo-item").hidden = !hasUsableAsset(combo.coupon);
  fields.comboMembership.closest(".combo-item").hidden = !hasUsableAsset(combo.membership);
  fields.selectedCard.textContent = combo.insight;
  fields.benefitText.textContent = formatBenefitDisplay(benefitAmount);
  fields.payCard.textContent = card.displayName;
  fields.payReason.textContent = compactCopy(combo.reason);
  fields.payBrand.textContent = card.issuer;
  fields.payCardVisualName.textContent = card.name;
  fields.payCardImage.src = card.image || "";
  fields.payCardImage.alt = `${card.displayName} 카드`;
  fields.payCardImage.hidden = !card.image;
  fields.detailText.textContent = scenario.detail;
  fields.comboMembership.textContent = displayAsset(combo.membership);
  fields.aiCheckText.textContent = `${scenario.merchant}, 등록 카드, 적립 정보`;
  renderReasonDetails(scenario, card, combo);

  document.documentElement.style.setProperty("--active-card-bg", card.bg);
  renderCards();
  renderLocationList();
  renderPayStep();
  syncScenarioControls();
  syncSwapAssistState();
}

function renderLocationList() {
  const list = $("#locationList");
  list.innerHTML = locationOptions.map((option) => {
    const isCurrent = option.id === currentLocation;
    const isPreview = option.id === previewLocation;
    return `
      <button type="button" class="location-option ${isPreview ? "is-selected" : ""}" data-location="${option.id}">
        <div>
          <strong>${option.name}</strong>
          <span>${option.distance} · ${option.hint}</span>
        </div>
        <em>${isCurrent ? "현재 선택" : isPreview ? "선택됨" : "선택"}</em>
      </button>
    `;
  }).join("");
  $$("#locationList .location-option").forEach((button) => {
    button.addEventListener("click", () => {
      previewLocationChange(button.dataset.location);
    });
  });
}

function previewLocationChange(locationId) {
  const option = locationOptions.find((item) => item.id === locationId);
  if (!option) return;
  previewLocation = locationId;
  renderLocationList();
  updateLocationApplyState();
}

function applyLocationChange() {
  const option = locationOptions.find((item) => item.id === previewLocation);
  if (!option) return;
  const locationId = previewLocation;
  currentLocation = locationId;
  scenarios = locationScenarioSets[currentLocation];
  currentScenario = option.criterion;
  currentCardIndex = recommendedCardIndex(scenarios[currentScenario]);
  previewScenario = currentScenario;
  render();
  closeLocationSheet();
}

function previewScenarioChange(scenarioKey) {
  if (!scenarios[scenarioKey]) return;
  previewScenario = scenarioKey;
  renderScenarioPreview();
  syncScenarioControls();
}

function applyScenarioChange() {
  if (!scenarios[previewScenario]) return;
  currentScenario = previewScenario;
  currentCardIndex = recommendedCardIndex(scenarios[currentScenario]);
  render();
  closeSheet();
  closeSettings();
}

function syncScenarioControls() {
  $$("[data-scenario]").forEach((item) => {
    item.classList.toggle("is-selected", item.dataset.scenario === previewScenario);
  });
}

function renderScenarioPreview() {
  const next = getDataFor(previewScenario);
  const current = currentData();
  const nextBenefit = formatBenefitDisplay(formatBenefitAmount(next.combo.benefit));
  const currentBenefit = formatBenefitDisplay(formatBenefitAmount(current.combo.benefit));
  const isSame = previewScenario === currentScenario;
  const title = isSame ? "현재 추천을 유지하고 있어요" : `${next.scenario.type} 기준으로 보면`;
  const text = isSame
    ? `${current.card.displayName} · ${currentBenefit}`
    : `${current.card.displayName} ${currentBenefit} → ${next.card.displayName} ${nextBenefit}`;

  fields.criteriaPreviewTitle.textContent = title;
  fields.criteriaPreviewText.textContent = text;
  fields.settingsPreviewTitle.textContent = title;
  fields.settingsPreviewText.textContent = text;
  fields.applyCriteriaButton.disabled = isSame;
  fields.applySettingsButton.disabled = isSame;
}

function updateLocationApplyState() {
  const isSame = previewLocation === currentLocation;
  fields.applyLocationButton.disabled = isSame;
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
  fields.cardAppNote.textContent = `${appName}에서 청구할인, 남은 한도, 실적 포함 여부를 최종 확인할 수 있어요.`;
  if (mode === "card") {
    fields.resultSummary.textContent = `${card.displayName}로 결제했어요`;
    fields.resultBenefitLabel.textContent = "이번 결제 방식";
    fields.resultBenefitAmount.textContent = "기본 결제";
    fields.resultLearning.textContent = "추천 조합 없이 선택한 카드로 결제했어요";
    fields.resultStatusList.innerHTML = renderResultRows([
      { label: "카드 결제", value: card.displayName, state: "완료" },
      { label: "쿠폰", value: "추가 혜택 없음", state: "해당 없음" },
      { label: "적립", value: "추가 혜택 없음", state: "해당 없음" }
    ]);
    fields.resultProgressLabel.textContent = "이번 달 카드 실적";
    fields.resultProgressValue.textContent = "340,000원/500,000원";
    fields.resultProgressBar.style.width = "68%";
    fields.resultNextHint.textContent = "추천 기준을 켜면 다음 혜택 구간을 함께 확인할 수 있어요";
    fields.resultCard.textContent = card.displayName;
    fields.resultType.textContent = "카드 단독 결제";
    return;
  }

  const progress = progressReportFor(scenario);
  const benefitAmount = resultBenefitFor(scenario, combo, progress);
  fields.resultBenefitLabel.textContent = scenario.type.includes("실적") ? "이번 결제 후 실적" : "이번 결제 예상 혜택";
  fields.resultSummary.textContent = scenario.type.includes("실적")
    ? "다음 혜택 조건에 가까워졌어요"
    : `방금 결제로 ${benefitAmount} 아꼈어요`;
  fields.resultBenefitAmount.textContent = benefitAmount;
  fields.resultLearning.textContent = "카드사 기준에 따라 실제 적용 금액은 달라질 수 있어요";
  fields.resultStatusList.innerHTML = renderResultRows(buildBenefitBreakdown(scenario, card, combo));
  fields.resultProgressLabel.textContent = progress.label;
  fields.resultProgressValue.textContent = progress.value;
  fields.resultProgressBar.style.width = progress.width;
  fields.resultNextHint.textContent = progress.hint;
  fields.resultCard.textContent = `${card.displayName} + ${displayAsset(combo.membership)}`;
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
  selectedPayExtra = null;
  isPayExtraListOpen = false;
  isDirectPayExtraOpen = false;
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
  const sheet = $("#detailSheet");
  resetSheetDrag(sheet);
  sheet.classList.remove("is-open");
  sheet.classList.remove("is-expanded");
  sheet.setAttribute("aria-hidden", "true");
  updateScrim();
}

function openSheet() {
  closeSettings();
  closeLocationSheet();
  closeReason();
  previewScenario = currentScenario;
  renderScenarioPreview();
  syncScenarioControls();
  const sheet = $("#detailSheet");
  resetSheetDrag(sheet);
  sheet.classList.remove("is-expanded");
  sheet.classList.add("is-open");
  sheet.setAttribute("aria-hidden", "false");
  updateScrim();
}

function expandDetailSheet() {
  $("#detailSheet").classList.add("is-expanded");
}

function closeSettings() {
  const sheet = $("#settingsSheet");
  resetSheetDrag(sheet);
  sheet.classList.remove("is-open");
  sheet.setAttribute("aria-hidden", "true");
  updateScrim();
}

function openSettings() {
  closeSheet();
  closeLocationSheet();
  closeReason();
  previewScenario = currentScenario;
  renderScenarioPreview();
  syncScenarioControls();
  const sheet = $("#settingsSheet");
  resetSheetDrag(sheet);
  sheet.classList.add("is-open");
  sheet.setAttribute("aria-hidden", "false");
  updateScrim();
}

function closeLocationSheet() {
  const sheet = $("#locationSheet");
  resetSheetDrag(sheet);
  sheet.classList.remove("is-open");
  sheet.setAttribute("aria-hidden", "true");
  updateScrim();
}

function openLocationSheet() {
  closeSheet();
  closeSettings();
  closeReason();
  previewLocation = currentLocation;
  renderLocationList();
  updateLocationApplyState();
  const sheet = $("#locationSheet");
  resetSheetDrag(sheet);
  sheet.classList.add("is-open");
  sheet.setAttribute("aria-hidden", "false");
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
  [$("#detailSheet"), $("#settingsSheet"), $("#locationSheet")].forEach((sheet) => resetSheetDrag(sheet));
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

function resetSheetDrag(sheet) {
  if (!sheet) return;
  sheet.classList.remove("is-dragging");
  sheet.style.removeProperty("--sheet-drag-y");
  $("#scrim").style.removeProperty("opacity");
}

function closeSheetByElement(sheet) {
  if (sheet.id === "detailSheet") closeSheet();
  else if (sheet.id === "settingsSheet") closeSettings();
  else if (sheet.id === "locationSheet") closeLocationSheet();
}

function startSheetDrag(sheet, handle, event) {
  if (!sheet.classList.contains("is-open")) return;
  if (sheetDrag) return;
  event.preventDefault();
  const point = event.touches?.[0] || event;
  sheetDrag = {
    sheet,
    startY: point.clientY,
    lastY: point.clientY,
    startedAt: performance.now()
  };
  sheet.classList.add("is-dragging");
  try {
    if (event.pointerId !== undefined) handle.setPointerCapture(event.pointerId);
  } catch {
    // Some synthetic QA events do not support pointer capture.
  }
}

function moveSheetDrag(event) {
  if (!sheetDrag) return;
  event.preventDefault();
  const point = event.touches?.[0] || event;
  const rawDeltaY = point.clientY - sheetDrag.startY;
  const deltaY = sheetDrag.sheet.id === "detailSheet"
    ? Math.max(-170, rawDeltaY)
    : Math.max(0, rawDeltaY);
  sheetDrag.lastY = point.clientY;
  sheetDrag.sheet.style.setProperty("--sheet-drag-y", `${deltaY}px`);
  const progress = Math.min(Math.max(deltaY, 0) / 240, 1);
  $("#scrim").style.opacity = String(1 - progress * 0.65);
}

function endSheetDrag(event) {
  if (!sheetDrag) return;
  event.preventDefault();
  const point = event.changedTouches?.[0] || event;
  const deltaY = point.clientY - sheetDrag.startY;
  const elapsed = Math.max(performance.now() - sheetDrag.startedAt, 1);
  const downVelocity = Math.max(deltaY, 0) / elapsed;
  const shouldExpand = sheetDrag.sheet.id === "detailSheet" && deltaY < -48;
  const shouldClose = deltaY > 90 || downVelocity > 0.65;
  const { sheet } = sheetDrag;
  sheetDrag = null;

  sheet.classList.remove("is-dragging");
  if (shouldExpand) {
    sheet.classList.add("is-expanded");
    resetSheetDrag(sheet);
    return;
  }

  if (shouldClose) {
    sheet.style.setProperty("--sheet-drag-y", "105%");
    window.setTimeout(() => closeSheetByElement(sheet), 120);
    return;
  }

  resetSheetDrag(sheet);
}

function attachSheetDrag() {
  $$(".bottom-sheet").forEach((sheet) => {
    const handle = sheet.querySelector(".sheet-handle");
    if (!handle) return;
    handle.addEventListener("pointerdown", (event) => startSheetDrag(sheet, handle, event));
    handle.addEventListener("mousedown", (event) => startSheetDrag(sheet, handle, event));
    handle.addEventListener("touchstart", (event) => startSheetDrag(sheet, handle, event), { passive: false });
  });
  window.addEventListener("pointermove", moveSheetDrag, { passive: false });
  window.addEventListener("pointerup", endSheetDrag, { passive: false });
  window.addEventListener("pointercancel", endSheetDrag, { passive: false });
  window.addEventListener("mousemove", moveSheetDrag, { passive: false });
  window.addEventListener("mouseup", endSheetDrag, { passive: false });
  window.addEventListener("touchmove", moveSheetDrag, { passive: false });
  window.addEventListener("touchend", endSheetDrag, { passive: false });
  window.addEventListener("touchcancel", endSheetDrag, { passive: false });
}

$$("[data-scenario]").forEach((button) => {
  button.addEventListener("click", () => {
    previewScenarioChange(button.dataset.scenario);
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
$("#swapToggleButton").addEventListener("click", toggleSwapAssist);
$("#closeSheet").addEventListener("click", closeSheet);
$("#expandDetailButton").addEventListener("click", expandDetailSheet);
$("#reasonButton").addEventListener("click", openReason);
$("#reasonPopover").addEventListener("click", (event) => event.stopPropagation());
$("#scrim").addEventListener("click", closeOverlays);
$("#settingsButton").addEventListener("click", openSettings);
$("#closeSettings").addEventListener("click", closeSettings);
$("#closeLocationSheet").addEventListener("click", closeLocationSheet);
$("#applyCriteriaButton").addEventListener("click", applyScenarioChange);
$("#applySettingsButton").addEventListener("click", applyScenarioChange);
$("#applyLocationButton").addEventListener("click", applyLocationChange);
$("#walletPayButton").addEventListener("click", () => startPaymentFlow("card"));
$("#comboPayButton").addEventListener("click", () => startPaymentFlow("combo"));
$("#completeButton").addEventListener("click", advancePaymentFlow);
$("#payExtraLauncher").addEventListener("click", () => {
  isDirectPayExtraOpen = !isDirectPayExtraOpen;
  isPayExtraListOpen = isDirectPayExtraOpen;
  renderPayStep();
});
$("#payExtraToggle").addEventListener("click", () => {
  isPayExtraListOpen = !isPayExtraListOpen;
  renderPayStep();
});
$("#resetButton").addEventListener("click", () => setScreen("wallet"));
$("#resultDoneButton").addEventListener("click", () => setScreen("wallet"));
$("#plannerButton").addEventListener("click", () => setScreen("wallet"));
window.addEventListener("resize", () => updateCardPosition());

attachSwipe();
attachSheetDrag();
render();
