# YInMn Blue / Old Lace / Red — 블루·크림·선홍

> 이 문서는 content/design-reuse.json·content/analyses와 시안 정의에서 생성합니다. 수정 후 npm run docs:designs를 실행하세요.


묵직한 중저명도 블루와 높은 채도의 선홍 사이에 따뜻한 크림을 두어 대비를 분리한다.

상태: **analyzed** · 작성 2026-11-18 · 수정 2026-11-18

참고자료: url / `https://www.pinterest.com/pin/716635359498137705/`

2026-11-18 사용자 제공 Pinterest 묶음의 04번. 공개 대표 이미지의 표기 HEX와 색 관계만 분석했다.

실행 HTML과 연결하지 않은 독립 참고자료입니다.

데이터: [pinterest-yinmn-lace-red.json](<../../content/analyses/pinterest-yinmn-lace-red.json>) · MCP: `design://analyses/pinterest-yinmn-lace-red` · [전체 분석](./README.md)

**분석 범위:** 색감 분석.

## 색감 분석

블루와 선홍이 각각 따뜻함·차가움의 축을 맡되, 강한 유채색을 직접 겹치기보다는 밝은 크림을 사이에 넣을 때 정보와 조형의 역할이 더 잘 갈린다.

| 역할 | 값 | 확인 수준 | 근거 |

| --- | --- | --- | --- |

| YInMn Blue · 안정적인 중저명도 블루 | #2E4C8C | confirmed | pin-preview |

| Old Lace · 밝고 따뜻한 완충 면 | #FFF3E1 | confirmed | pin-preview |

| Red · 고채도 선홍색 강조 | #FA2D1A | confirmed | pin-preview |

### 관찰과 근거

**색 면적과 분포** · `color.distribution`

- **밝은 크림이 두 유채색 사이에 놓임** (confirmed): 비슷한 크기의 세 시연 스와치 중 크림이 중간을 차지한다. 뒤 사진에는 따뜻한 회색과 초록도 있어 표기 팔레트와 배경 전체의 색을 구분해야 한다. · 근거: pin-preview

**명도와 대비** · `color.contrast`

- **색상 대비와 문자 대비는 다르다** (confirmed): 표기값의 sRGB 대비는 파랑·선홍 2.16:1, 파랑·크림 7.58:1, 선홍·크림 3.51:1이다. 파랑 위 선홍은 색 차이가 선명해 보여도 작은 일반 글자에 부족하다. · 근거: pin-preview


### 색감 재사용

- 크림을 읽기 면, 블루를 글자나 고정 면, 선홍을 짧은 강조로 나눈다. 이 배색에서 선홍을 바로 블루 위에 작은 라벨로 얹지 않는다.


### 근거 목록

- **pin-preview** / image / `https://i.pinimg.com/736x/30/8c/ca/308cca4834573d7102dad49adc15d51b.jpg`: 736×1308px 공개 JPEG. YInMn Blue, Old Lace, Red 스와치의 표기 HEX와 각 스와치의 글자색 관계를 확인했다.
- **swatch-samples** / image / `https://i.pinimg.com/736x/30/8c/ca/308cca4834573d7102dad49adc15d51b.jpg`: 좌상단 원점 중심 (507,431), (507,654), (507,850)의 11×11px RGB 중앙값: #2E4C8C, #FFF4E2, #FA2D1A.


### 한계·미검증

- 이미지 표기 HEX의 단색 대비만 계산했다. 배경 이미지의 색이나 원본 작업 파일은 확인하지 않았다.
