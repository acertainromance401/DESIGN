# Caesar Palette — 검정·버건디·흰색

> 이 문서는 content/design-reuse.json·content/analyses와 시안 정의에서 생성합니다. 수정 후 npm run docs:designs를 실행하세요.


검정과 낮은 명도의 버건디를 붙여 어두운 덩어리를 만들고, 흰색에서 밝기를 크게 끌어올린다.

상태: **analyzed** · 작성 2026-11-18 · 수정 2026-11-18

참고자료: url / `https://www.pinterest.com/pin/1102819027539646280/`

2026-11-18 사용자가 마음에 드는 색 조합으로 제공했다. 선호와 분석의 범위는 공개 팔레트 이미지의 색감으로 한정한다.

실행 HTML과 연결하지 않은 독립 참고자료입니다.

데이터: [pinterest-caesar-burgundy.json](<../../content/analyses/pinterest-caesar-burgundy.json>) · MCP: `design://analyses/pinterest-caesar-burgundy` · [전체 분석](./README.md)

**분석 범위:** 색감 분석.

**사용자가 지정한 선호 범위:** `color.palette-roles`, `color.distribution`, `color.contrast`.

## 색감 분석

상단 단색 영역에서 검정이 약 절반, 버건디와 흰색이 약 4분의 1씩을 차지한다. 버건디는 검정과 명도가 가깝고 흰색과 강한 명도 대비를 만든다.

| 역할 | 값 | 확인 수준 | 근거 |

| --- | --- | --- | --- |

| 검정 · 이미지 표기 | #000000 | confirmed | pin-preview |

| 검정 영역 · 공개 JPEG 표본 | #111111 | estimated | pin-preview |

| 버건디 · 이미지 표기 | #6D001A | confirmed | pin-preview |

| 흰색 · 이미지 표기 | #FFFFFF | confirmed | pin-preview |

### 관찰과 근거

**팔레트와 역할** · `color.palette-roles`

- **표기값과 래스터 표본의 구분** (confirmed): 검정 #000000, 버건디 #6D001A, 흰색 #FFFFFF는 견본 표기다. 보이는 검정의 단일 픽셀 표본 #111111은 원본 선언으로 바꾸어 쓰지 않는다. · 근거: pin-preview

**색 면적과 분포** · `color.distribution`

- **검정이 넓고 버건디·백색이 나뉨** (estimated): 상단 색면의 폭만 보면 검정·버건디·흰색이 약 2:1:1이다. 아래 이미지까지 포함한 전체 픽셀 면적 비율은 아니다. · 근거: pin-preview

**명도와 대비** · `color.contrast`

- **어두운 버건디와 밝은 중립** (confirmed): 표기 HEX의 sRGB 상대 명도 대비는 검정·버건디 약 1.67:1, 버건디·흰색 약 12.61:1이다. 검정과 버건디의 차이는 색상에서, 흰색과의 차이는 명도에서 더 크게 드러난다. · 근거: pin-preview


### 색감 재사용

- 버건디를 밝은 빨강 포인트로 바꾸지 않고 낮은 명도로 유지하는 조합을 비교한다. 검정과 버건디처럼 명도가 가까운 쌍만으로 필수 텍스트나 상태를 구분하지 않는다.


## 취향과 디자인 결정

### `deep-red-light-neutral-contrast` · `color.contrast` · 선호 후보

- **분석자 해석**: 채도가 아니라 낮은 명도에 무게를 둔 버건디와 밝은 중립의 대비가 조합의 인상에 기여했을 수 있다.
  - 맥락: 깊은 적색을 넓은 면 또는 주조색 중 하나로 쓰는 그래픽.
  - 디자인 결정: 진한 적색과 밝은 중립 사이의 명도차를 유지한다. 순백·검정이나 예시의 배치 비율은 고정하지 않는다.
  - 상충·검수: 다른 어두운 색과 맞닿을 때 색만으로 구분해야 하는 내용이 없는지 확인한다.
  - 근거: `pin-preview`

### 근거 목록

- **pin-preview** / image / `https://i.pinimg.com/736x/f5/e2/3a/f5e23ac15427843a93c281e9db307d22.jpg`: 736×917px 공개 JPEG. 상단 세 단색 견본의 표기 HEX를 읽었다. 좌상단 원점 기준 픽셀 (185,150)에서 보이는 검정은 #111111로 샘플링됐다.


### 한계·미검증

- 대비율은 표기 스와치 사이를 계산한 값이지 실제 UI 텍스트 검증이 아니다. 색감 이외의 요소는 분석하지 않았고 원본 이미지는 저장하지 않았다.
