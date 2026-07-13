# Custom Capture Helper

전체 캡쳐를 다시 돌리지 않고 원하는 화면, 버튼 상태, 팝업만 직접 뽑는 스크립트입니다.

## 기본 사용

```bash
npm run capture:custom -- --preset result-help-1 --location skenergy --name sk_result_help_card
```

산출물은 `demo_captures_custom/` 아래에 생깁니다.

- `raw/`: 목업 전 원본 화면
- `phone_mockups_transparent/`: `v4_edit` Galaxy 프레임을 씌운 투명 목업
- `popups/`: CSS selector 또는 열린 말풍선만 단독 캡쳐한 투명 PNG

## 자주 쓸 예시

```bash
# SK 결제 결과 화면
npm run capture:custom -- --preset result --location skenergy --name sk_result

# SK 결제 결과에서 첫 번째 ? 말풍선이 열린 화면 + 말풍선 단독
npm run capture:custom -- --preset result-help-1 --location skenergy --mode both --name sk_result_help_1

# 베라 추천 이유 팝업 화면 + 팝업 단독
npm run capture:custom -- --preset reason-popup --location baskin --mode both --name baskin_reason

# 투썸 조합 상세 바텀시트만 단독 PNG로 뽑기
npm run capture:custom -- --preset combo-expanded --location twosome --mode element --selector "#detailSheet" --name twosome_combo_sheet
```

## 옵션

- `--location`: `skenergy`, `baskin`, `twosome`
- `--preset`: `home`, `home-minimized`, `location-sheet`, `combo`, `combo-expanded`, `reason-popup`, `pay-first`, `pay-second`, `pay-card`, `result`, `result-help-1`, `result-help-2`, `direct-pay`, `direct-extra`, `settings-benefit`, `settings-mileage`, `settings-performance`
- `--mode`: `page`, `element`, `both`
- `--selector`: 단독 캡쳐할 CSS selector
- `--name`: 파일명 앞부분
