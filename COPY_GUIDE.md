# SWAP Demo Copy Guide

## Where to edit

- Main recommendation data: `script.js` -> `locationScenarioSets`
- Nearby location chips: `script.js` -> `locationOptions`
- UI-generated labels: `script.js` -> `formatSheetTitle`, `formatBenefitLabel`, `formatPrimaryAction`, `formatBenefitHighlight`
- Button labels in markup: `index.html`

## Current copy groups

### Recommendation criteria

- `max_benefit`: 혜택 큰 순
- `remaining_cap`: 할인 한도 기반
- `performance_fill`: 실적 채우기
- `no_condition`: 조건 없음

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

- 혜택이 큰 순서로 골랐어요
- 남은 한도를 먼저 봤어요
- 실적 채우기 좋은 카드예요
- 조건 없는 혜택으로 골랐어요

### Primary action button

- `{금액} 혜택 받기`
- 실적 채우기
- 추천 혜택 받기

### Blue benefit label

- 예상 혜택
- 남은 혜택
- 이번 달 실적
- 조건 없는 혜택

### Benefit examples

- 예상 혜택 2,500원
- 남은 한도 300원
- 카페 혜택 1회 남음
- 편의점 혜택 2회 남음
- 실적 360,000원/500,000원 달성 예상
- 조건 없이 0.5% 적립
- 대상 업종 아님
- 조건 확인 필요

### Tone issues likely worth revising

- `~했어요` endings are repeated too often.
- `실적`, `혜택`, `기준` appear close together and can feel mechanical.
- `대상 업종 아님`, `조건 확인 필요` are too system-like for user-facing copy.
- Benefit values and recommendation reasons are currently mixed together; it may read cleaner if `benefit` is only the measurable value and `reason` carries the explanation.
