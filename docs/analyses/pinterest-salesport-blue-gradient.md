# SalesPort — 프러시안 블루·일렉트릭 블루·앨리스 블루

> 이 문서는 content/design-reuse.json·content/analyses와 시안 정의에서 생성합니다. 수정 후 npm run docs:designs를 실행하세요.


거의 검은 청색 바탕에 고채도 파랑을 빛처럼 제한하고, 밝은 오프화이트가 읽기를 맡는 조합.

상태: **analyzed** · 작성 2026-11-18 · 수정 2026-11-18

참고자료: url / `https://www.pinterest.com/pin/300756081389776863/`

2026-11-18 사용자 제공 Pinterest 묶음의 09번. 공개 대표 이미지의 색감과 조합을 확인했다. 그라데이션의 실제 색상 정지점이나 구현은 알 수 없다.

실행 HTML과 연결하지 않은 독립 참고자료입니다.

데이터: [pinterest-salesport-blue-gradient.json](<../../content/analyses/pinterest-salesport-blue-gradient.json>) · MCP: `design://analyses/pinterest-salesport-blue-gradient` · [전체 분석](./README.md)

**분석 범위:** 색감 분석.

## 색감 분석

가장 어두운 청색이 바탕의 넓은 부분을 맡고, 생생한 파랑은 광역 면색보다 부분적인 빛과 상징에 쓰인다. 밝은 글자를 배경과 분리해 광택과 읽기를 나눈다.

| 역할 | 값 | 확인 수준 | 근거 |

| --- | --- | --- | --- |

| Prussian Blue · 깊은 어두운 면 | #031130 | confirmed | pin-preview |

| SalesPort Blue · 브랜드 강조 | #185DF1 | confirmed | pin-preview |

| Alice Blue · 밝은 정보색과 역상 | #F3F7FE | confirmed | pin-preview |

### 관찰과 근거

**팔레트와 역할** · `color.palette-roles`

- **깊은 면·집중된 파랑·밝은 글자** (confirmed): 로고를 둘러싼 어두운 면 위로 파란 띠가 번지고, 밝은 단어가 그 면과 분리된다. 브랜드 블루 단색과 사진처럼 보이는 그라데이션은 동일한 색값으로 보지 않는다. · 근거: pin-preview

**명도와 대비** · `color.contrast`

- **강한 파랑은 흰색보다 어두운 면에 덜 밝게 대비** (confirmed): 표기값으로 계산하면 프러시안·앨리스는 17.35:1, 프러시안·SalesPort 블루는 3.44:1, SalesPort 블루·앨리스는 5.04:1이다. 이 값은 단색 쌍만 대상으로 한다. · 근거: pin-preview


### 색감 재사용

- 파란 빛은 초점 주변에 남기고, 작은 본문은 밝은 색과 안정된 어두운 바탕으로 분리한다. 그라데이션 위에서 글자가 놓일 수 있는 모든 위치의 가장 낮은 대비를 확인한다.


## 취향과 디자인 결정

### `deep-blue-electric-light-roles` · `color.palette-roles` · 선호 후보

- **분석자 해석**: 강한 블루를 빛과 로고에 나누어 쓰고 밝은 색은 판독에 남긴 점이 다크 블루의 인상에 기여했을 수 있다.
  - 맥락: 블루가 정체성을 만드는 브랜드 그래픽과 디지털 화면.
  - 디자인 결정: 저명도 바탕과 국소 고채도 포인트, 밝은 정보색을 분리한다. 그라데이션은 내용과 대비를 해치지 않을 때만 쓴다.
  - 상충·검수: 광택을 모든 표면에 반복하지 않고 가장 밝은 구간 위 글자 대비를 확인한다.
  - 근거: `pin-preview`

### 근거 목록

- **pin-preview** / image / `https://i.pinimg.com/736x/24/d6/ae/24d6aebb22827c611fbd8e4d3d64cb1d.jpg`: 736×1104px 공개 JPEG. 세 표기 HEX, 로고 주변의 집중된 파란 빛, 별도의 그라데이션 예시를 확인했다.
- **swatch-samples** / image / `https://i.pinimg.com/736x/24/d6/ae/24d6aebb22827c611fbd8e4d3d64cb1d.jpg`: 좌상단 원점 중심 (132,966), (368,966), (596,966)의 11×11px RGB 중앙값은 #041131, #195CF1, #F4F7FE. 중단 그라데이션 예시의 (353,664), (353,788)은 #010103, #020AA8이며 공식 정지점이 아닌 국소 표본이다.


### 한계·미검증

- 겉으로 보이는 그라데이션의 정지점·합성 방식은 미확인이다. 대비 계산은 표기된 단색 값에 한정한다.
