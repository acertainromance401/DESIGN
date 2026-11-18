# Wine Red / Light Sand — 와인 레드·라이트 샌드

> 이 문서는 content/design-reuse.json·content/analyses와 시안 정의에서 생성합니다. 수정 후 npm run docs:designs를 실행하세요.


짙은 와인색과 밝은 황기 베이지를 약 반씩 나누고 배경과 글자 색을 서로 뒤집는 2색 조합.

상태: **analyzed** · 작성 2026-11-18 · 수정 2026-11-18

참고자료: url / `https://www.pinterest.com/pin/1071012355146797580/`

2026-11-18 사용자 제공 Pinterest 묶음의 01번. 공개 대표 이미지의 색감과 조합만 분석했다.

실행 HTML과 연결하지 않은 독립 참고자료입니다.

데이터: [pinterest-wine-red-light-sand.json](<../../content/analyses/pinterest-wine-red-light-sand.json>) · MCP: `design://analyses/pinterest-wine-red-light-sand` · [전체 분석](./README.md)

**분석 범위:** 색감 분석.

## 색감 분석

두 색 모두 따뜻한 방향이지만 명도가 크게 다르다. 와인은 깊이를, 라이트 샌드는 순백보다 부드러운 빛을 맡는다. 어느 쪽도 작은 장식색에 그치지 않는다.

| 역할 | 값 | 확인 수준 | 근거 |

| --- | --- | --- | --- |

| Wine Red · 깊은 바탕 또는 어두운 글자 | #7F011F | confirmed | pin-preview |

| Light Sand · 넓은 밝은 바탕 또는 역상 글자 | #F5EBD0 | confirmed | pin-preview |

### 관찰과 근거

**색 면적과 분포** · `color.distribution`

- **반반 배분과 역할 반전** (confirmed): 거의 중앙에서 면이 갈린다. 위는 와인 바탕에 샌드 글자, 아래는 샌드 바탕에 와인 글자다. · 근거: pin-preview

**명도와 대비** · `color.contrast`

- **온도 차보다 큰 명도차** (confirmed): 이미지의 표기 HEX로 계산한 sRGB 상대 명도 대비는 9.18:1이다. 두 색이 비슷하게 따뜻해도 배경과 글자 역할을 바꿀 수 있을 정도로 명도가 갈린다. · 근거: pin-preview


### 색감 재사용

- 브랜드 면은 와인으로, 긴 문단이나 제품 목록은 샌드로 두고 같은 두 색을 반전해 화면 성격을 연결한다. 반반 비율은 단일 포스터 선택이지 제품 화면의 고정 규칙이 아니다.


## 취향과 디자인 결정

### `deep-red-light-neutral-contrast` · `color.contrast` · 선호 후보

- **분석자 해석**: 채도가 남은 깊은 적색을 밝고 따뜻한 중립색과 분리한 점이 조합의 인상에 기여했을 수 있다.
  - 맥락: 진한 적색을 브랜드 면 또는 제목으로 쓰는 색 중심 그래픽.
  - 디자인 결정: 진한 적색과 밝은 비백색의 명도 관계를 유지하고 정확한 색상과 면적은 프로젝트에 맞춘다.
  - 상충·검수: 버튼·본문·포커스는 실제 바탕에서 다시 검수한다.
  - 근거: `pin-preview`

### 근거 목록

- **pin-preview** / image / `https://i.pinimg.com/736x/8d/e4/d2/8de4d24b29c2edb0eb0423236988af00.jpg`: 736×920px 공개 JPEG. 이미지에 인쇄된 HEX와 상하 반전 배색을 확인했다.
- **swatch-samples** / image / `https://i.pinimg.com/736x/8d/e4/d2/8de4d24b29c2edb0eb0423236988af00.jpg`: 좌상단 원점 중심 (662,349), (662,726)의 11×11px RGB 채널별 중앙값은 순서대로 #7F0220, #F6EAD0이다. 팔레트는 이 표본 대신 이미지에 적힌 HEX를 사용한다.


### 한계·미검증

- HEX는 이미지의 표기값으로 확인했다. 픽셀 표본·인쇄색·원본 디자인 파일과는 구분한다. 단색 간 계산값은 실제 화면의 모든 문자가 읽힌다는 보증이 아니다.
