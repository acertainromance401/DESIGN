# Bordo / Green / Cream — 보르도·짙은 청록·피치 크림

> 이 문서는 content/design-reuse.json·content/analyses와 시안 정의에서 생성합니다. 수정 후 npm run docs:designs를 실행하세요.


명도가 거의 같은 두 어두운 색을 보르도와 청록으로 나누고, 피치 크림으로 밝기와 온기를 더한다.

상태: **analyzed** · 작성 2026-11-18 · 수정 2026-11-18

참고자료: url / `https://www.pinterest.com/pin/1102819027539646269/`

2026-11-18 사용자가 마음에 드는 색 조합으로 제공했다. 선호와 분석의 범위는 공개 팔레트 이미지의 색감으로 한정한다.

실행 HTML과 연결하지 않은 독립 참고자료입니다.

데이터: [pinterest-bordo-green-cream.json](<../../content/analyses/pinterest-bordo-green-cream.json>) · MCP: `design://analyses/pinterest-bordo-green-cream` · [전체 분석](./README.md)

**분석 범위:** 색감 분석.

**사용자가 지정한 선호 범위:** `color.palette-roles`, `color.contrast`, `color.temperature-saturation`.

## 색감 분석

보르도와 깊은 청록은 색온도가 갈리지만 비슷한 명도로 무게를 나눈다. 피치 크림은 밝기를 끌어올리되 순백보다 따뜻하게 보인다.

| 역할 | 값 | 확인 수준 | 근거 |

| --- | --- | --- | --- |

| Bordo · 짙은 보르도 | #6C151E | confirmed | pin-preview |

| Green · 짙은 청록 기운의 녹색 | #0F3D3A | confirmed | pin-preview |

| Cream · 따뜻한 피치 크림 | #F5DABF | confirmed | pin-preview |

### 관찰과 근거

**팔레트와 역할** · `color.palette-roles`

- **세 스와치의 선언값** (confirmed): 미리보기 자체에 Bordo #6C151E, Green #0F3D3A, Cream #F5DABF가 표기되어 있다. · 근거: pin-preview

**명도와 대비** · `color.contrast`

- **두 어두운 색과 크림의 명도** (confirmed): 표기 HEX의 sRGB 상대 명도 대비는 보르도·청록 1.01:1, 보르도·크림 8.88:1, 청록·크림 8.96:1이다. 크림이 두 어두운 색 모두를 밝게 분리한다. · 근거: pin-preview

**색온도와 채도** · `color.temperature-saturation`

- **따뜻하고 차가운 어둠** (confirmed): 따뜻한 적색과 차가운 청록이 서로 다른 색 방향을 만들고, 밝은 영역에는 흰색 대신 복숭아빛이 도는 크림을 쓴다. · 근거: pin-preview


### 색감 재사용

- 비슷하게 어두운 두 색에 동등한 무게를 줄 때 색온도를 달리하고, 판독에 필요한 명도 차이는 밝은 중립색에서 확보한다.


## 취향과 디자인 결정

### `deep-red-light-neutral-contrast` · `color.contrast` · 선호 후보

- **분석자 해석**: 진한 보르도를 유지하면서 밝은 크림으로 밝기 차이를 만드는 점이 조합의 인상에 기여했을 수 있다.
  - 맥락: 낮은 명도의 적색과 깊이가 비슷한 보조색을 함께 쓰는 그래픽.
  - 디자인 결정: 진한 적색과 밝은 중립 사이의 명도차를 남긴다. 차가운 어두운 보조색과 따뜻한 크림은 문맥에 맞게 고른다.
  - 상충·검수: 보르도와 청록이 맞닿는 영역은 색상만 다르므로 작은 필수 글자나 상태 표시에 쓰지 않는다.
  - 근거: `pin-preview`

### 근거 목록

- **pin-preview** / image / `https://i.pinimg.com/736x/bc/5e/69/bc5e6911779742713941ee6fece3eee8.jpg`: Pinterest 공개 JPEG. Bordo, Green, Cream 세 스와치의 표기 HEX와 색 관계를 확인했다.


### 한계·미검증

- 대비율은 표기 스와치 사이를 계산한 값이다. 색감 이외의 요소는 분석하지 않았고 원본 이미지는 저장하지 않았다.
