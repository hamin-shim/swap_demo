# SWAP Demo Copy Guide

## Where to edit

- Main recommendation data: `script.js` -> `locationScenarioSets`
- Nearby location chips: `script.js` -> `locationOptions`
- UI-generated labels: `script.js` -> `formatSheetTitle`, `formatBenefitLabel`, `formatPrimaryAction`, `formatBenefitHighlight`
- Button labels in markup: `index.html`

## Current copy groups

### Recommendation criteria

- `max_benefit`: 혜택
- `mileage`: 마일리지
- `performance_fill`: 실적

### Location scenarios

- `starbucks`: Starbucks
- `cu`: CU
- `oliveyoung`: Olive Young
- `department`: 신세계백화점

### Text fields per recommendation

Each card recommendation has these editable fields.

- `reason`: why this card is recommended or not recommended
- `benefit`: blue benefit/remaining/performance value
- `coupon`: coupon step text
- `membership`: membership step text
- `insight`: one-line explanation under recommendation criteria

## Current phrase types to review

### Sheet titles

- 혜택이 좋은 조합이에요
- 항공 마일리지로 적립해요
- 이번 결제가 실적에 도움돼요

### Primary action button

- 추천 보기
- 실적 보기

### Blue benefit label

- 예상 혜택
- 마일리지
- 이번 달 실적

### Benefit examples

- 예상 혜택 2,500원
- 남은 한도 300원
- 카페 혜택 1회 남음
- 편의점 혜택 2회 남음
- 항공 마일리지 12마일 적립 예상
- 실적 360,000원/500,000원 달성 예상
- 혜택 확인 필요
- 실적 확인 필요

### Tone issues likely worth revising

- `~했어요` endings are repeated too often.
- `실적`, `혜택`, `기준` appear close together and can feel mechanical.
- `혜택 확인 필요`, `실적 확인 필요` are safer than hard exclusion labels, but still worth reviewing for tone.
- Benefit values and recommendation reasons are currently mixed together; it may read cleaner if `benefit` is only the measurable value and `reason` carries the explanation.
