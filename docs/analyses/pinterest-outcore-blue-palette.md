# Outcore — 딥 네이비·로열 블루·전기 블루·아이스 시안

> 이 문서는 content/design-reuse.json·content/analyses와 시안 정의에서 생성합니다. 수정 후 npm run docs:designs를 실행하세요.


한 계열의 블루를 깊은 면·브랜드 면·고채도 강조·밝은 역상으로 나눠 낮과 밤에 가까운 대비를 만든다.

상태: **analyzed** · 작성 2026-11-18 · 수정 2026-11-18

참고자료: url / `https://www.pinterest.com/pin/3870349675895741/`

2026-11-18 사용자 제공 Pinterest 묶음의 08번. 핀의 제목은 일반 문구이고 대표 이미지에 적힌 Outcore를 분석 제목으로 사용했다. 색감과 조합만 검토했다.

실행 HTML과 연결하지 않은 독립 참고자료입니다.

데이터: [pinterest-outcore-blue-palette.json](<../../content/analyses/pinterest-outcore-blue-palette.json>) · MCP: `design://analyses/pinterest-outcore-blue-palette` · [전체 분석](./README.md)

**분석 범위:** 색감 분석.

## 색감 분석

깊은 남색과 로열 블루는 바탕을, 맑고 강한 블루는 에너지를, 아주 밝은 시안은 로고와 밝은 구역을 맡는다. 모든 색을 같은 명도·채도로 유지하지 않는다.

| 역할 | 값 | 확인 수준 | 근거 |

| --- | --- | --- | --- |

| 딥 네이비 · 가장 깊은 스와치 | #050A34 | confirmed | pin-preview |

| 로열 블루 · 브랜드 바탕 | #092676 | confirmed | pin-preview |

| 일렉트릭 블루 · 고채도 강조 | #085CF0 | confirmed | pin-preview |

| 아이스 시안 · 밝은 역상과 스와치 | #AFE9FD | confirmed | pin-preview |

| 옅은 청색 · 표기 없는 중단 배경의 픽셀 표본 | #E4F7FD | estimated | swatch-samples |

### 관찰과 근거

**팔레트와 역할** · `color.palette-roles`

- **파랑 안에서 역할의 강도를 분리** (confirmed): 윗면은 어두운 블루와 옅은 시안, 가운데는 밝은 면과 네 스와치, 아랫면은 검정과 강한 블루가 중심이다. 같은 계열이지만 명도·채도의 역할이 다르다. · 근거: pin-preview

**명도와 대비** · `color.contrast`

- **밝은 시안도 올라가는 배경에 따라 다름** (estimated): 로열 블루·아이스 시안은 표기값으로 10.25:1, 딥 네이비·일렉트릭 블루는 3.46:1이다. 가운데 배경 표본과 아이스 시안은 약 1.20:1이라 상세 정보용 조합으로는 부족하다. · 근거: pin-preview, swatch-samples


### 색감 재사용

- 딥 블루로 깊은 바탕을 만들고, 고채도 블루를 상징·그래픽에 제한한다. 옅은 블루를 밝은 바탕에서 작은 제목으로 반복하는 대신 그 자리에는 잉크색 블루를 사용한다.


## 취향과 디자인 결정

### `deep-blue-electric-light-roles` · `color.palette-roles` · 선호 후보

- **분석자 해석**: 블루 안에서도 짙은 바탕, 전기 블루 강조, 옅은 읽기색의 역할이 또렷한 점이 인상에 기여했을 수 있다.
  - 맥락: 블루가 정체성을 만드는 브랜드 그래픽과 디지털 화면.
  - 디자인 결정: 낮은 명도 면과 강한 브랜드색, 밝은 정보색을 분리한다. 포인트의 정확한 HEX나 광택 표현은 고정하지 않는다.
  - 상충·검수: 강한 블루를 작은 글자에 쓸 때 배경에 따라 대비가 크게 달라진다.
  - 근거: `pin-preview`

### 근거 목록

- **pin-preview** / image / `https://i.pinimg.com/736x/68/3f/70/683f702f103e6ad65afaa363dc3a6fd5.jpg`: 736×1177px 공개 JPEG. Outcore 이미지의 네 원형 스와치를 확대해 표기 HEX를 읽고 상단 밝은 글자, 중단의 창백한 배경, 하단의 블루와 검정을 관찰했다.
- **swatch-samples** / image / `https://i.pinimg.com/736x/68/3f/70/683f702f103e6ad65afaa363dc3a6fd5.jpg`: 좌상단 원점 중심 (169,650), (345,650), (460,650), (610,659), (677,762)의 11×11px RGB 중앙값: #070C36, #0B2878, #085CF0, #B0E9FD, #E4F7FD. 마지막 값은 표기 없는 중단 배경 표본이다.


### 한계·미검증

- 네 스와치만 이미지에 적혀 있다. 중단 배경 표본은 추정이며 로고의 원본 색 선언이나 하단 렌더링 기술은 확인하지 않았다.
