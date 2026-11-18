# Jet Black / Silver Beige / Mustard Yellow — 웜 블랙·베이지·머스터드

> 이 문서는 content/design-reuse.json·content/analyses와 시안 정의에서 생성합니다. 수정 후 npm run docs:designs를 실행하세요.


웜 블랙이 조합을 잡고, 따뜻한 회베이지와 머스터드가 채도를 나누는 세 색 조합.

상태: **analyzed** · 작성 2026-11-18 · 수정 2026-11-18

참고자료: url / `https://www.pinterest.com/pin/830914200040493825/`

2026-11-18 사용자 제공 Pinterest 묶음의 07번. 공개 대표 이미지의 색감과 조합만 분석했다.

실행 HTML과 연결하지 않은 독립 참고자료입니다.

데이터: [pinterest-jet-black-mustard.json](<../../content/analyses/pinterest-jet-black-mustard.json>) · MCP: `design://analyses/pinterest-jet-black-mustard` · [전체 분석](./README.md)

**분석 범위:** 색감 분석.

## 색감 분석

05번의 차가운 여백과 달리, 세 색이 모두 따뜻한 방향이다. 베이지가 노랑의 채도를 넓은 면과 분리하고 웜 블랙이 명도 기준을 맡는다.

| 역할 | 값 | 확인 수준 | 근거 |

| --- | --- | --- | --- |

| Jet Black · 흑갈색에 가까운 어두운 잉크 | #24221B | confirmed | pin-preview |

| Silver Beige · 저채도 회베이지 여백 | #E4DFD8 | confirmed | pin-preview |

| Mustard Yellow · 따뜻한 유채색 강조 | #F2D04E | confirmed | pin-preview |

### 관찰과 근거

**팔레트와 역할** · `color.palette-roles`

- **회베이지로 쉬고 같은 잉크를 유지함** (confirmed): 베이지와 머스터드 모두 웜 블랙 계열 표기를 사용한다. 어두운 색이 일관되게 읽기를 담당하고 밝은 두 색은 온도·채도로 용도가 갈린다. · 근거: pin-preview

**명도와 대비** · `color.contrast`

- **머스터드와 베이지를 겹치면 명도차가 작음** (confirmed): 표기 HEX 기준 블랙·머스터드 10.54:1, 블랙·베이지 12.01:1, 베이지·머스터드 1.14:1이다. · 근거: pin-preview


### 색감 재사용

- 차분하고 따뜻하게 쓰려면 베이지를 주 바탕, 흑갈색을 잉크, 머스터드를 시선이 필요한 위치에 둔다. 베이지 바탕 위 머스터드만으로 작은 글자나 구획 경계를 만들지 않는다.


## 취향과 디자인 결정

### `bright-yellow-dark-anchor` · `color.palette-roles` · 선호 후보

- **분석자 해석**: 따뜻한 머스터드의 존재감을 유지하면서 웜 블랙이 명도를 맡는 점이 조합의 인상에 기여했을 수 있다.
  - 맥락: 밝은 노랑이 주도하는 포스터·제품 그래픽.
  - 디자인 결정: 밝은 노랑은 강조에, 어두운 잉크는 판독에 쓴다. 따뜻한 인상을 지키고 싶으면 남색 대신 따뜻한 블랙과 베이지를 비교한다.
  - 상충·검수: 밝은 색 둘로만 경계나 상태를 그리지 않는다.
  - 근거: `pin-preview`

### 근거 목록

- **pin-preview** / image / `https://i.pinimg.com/736x/8e/df/40/8edf40a1201d3d9e834ef47453305266.jpg`: 736×922px 공개 JPEG. Jet Black, Silver Beige, Mustard Yellow의 표기 HEX와 대비 방향을 확인했다.
- **swatch-samples** / image / `https://i.pinimg.com/736x/8e/df/40/8edf40a1201d3d9e834ef47453305266.jpg`: 좌상단 원점 중심 (500,219), (500,442), (500,676)의 11×11px RGB 중앙값: #25221B, #E4DFD9, #F2CF4D.


### 한계·미검증

- 표기 스와치 값과 배경 사진의 밝기·재료는 별개다. 사진이나 인쇄 출력의 실제 색을 확인한 것은 아니다.
