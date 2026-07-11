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

- `gscaltex`: GS칼텍스 삼평주유소
- `skenergy`: SK에너지 판교셀프
- `soil`: S-OIL 판교충전소
- `evcharge`: EV 충전소

### Text fields per recommendation

Each card recommendation has these editable fields.

- `reason`: why this card is recommended or not recommended
- `benefit`: blue benefit/remaining/performance value
- `coupon`: coupon step text
- `membership`: point/reward step text
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

- 예상 혜택 4,500원
- 남은 주유 한도 19,000원
- 항공 마일리지 45마일 적립 예상
- 실적 388,000원/400,000원 달성 예상
- 다음 주유 실적 충족까지 12,000원 남음
- 혜택 확인 필요
- 실적 확인 필요

### Tone issues likely worth revising

- `~했어요` endings are repeated too often.
- `실적`, `혜택`, `기준` appear close together and can feel mechanical.
- `혜택 확인 필요`, `실적 확인 필요` are safer than hard exclusion labels, but still worth reviewing for tone.
- Benefit values and recommendation reasons are currently mixed together; it may read cleaner if `benefit` is only the measurable value and `reason` carries the explanation.
