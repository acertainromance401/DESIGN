# Gargoyle Gas / Space Cadet / Alice Blue — 레몬 옐로·네이비·아이스 블루

> 이 문서는 content/design-reuse.json·content/analyses와 시안 정의에서 생성합니다. 수정 후 npm run docs:designs를 실행하세요.


밝은 옐로와 차가운 오프화이트를 어두운 네이비로 연결하는 대비. 옐로와 오프화이트끼리는 명도차가 작다.

상태: **analyzed** · 작성 2026-11-18 · 수정 2026-11-18

참고자료: url / `https://www.pinterest.com/pin/720857484151837710/`

2026-11-18 사용자 제공 Pinterest 묶음의 05번. 공개 대표 이미지의 색감과 조합만 분석했다.

실행 HTML과 연결하지 않은 독립 참고자료입니다.

데이터: [pinterest-gargoyle-space-cadet.json](<../../content/analyses/pinterest-gargoyle-space-cadet.json>) · MCP: `design://analyses/pinterest-gargoyle-space-cadet` · [전체 분석](./README.md)

**분석 범위:** 색감 분석.

## 색감 분석

레몬 옐로가 시선을 끌고 네이비가 무게와 판독을 제공한다. 아이스 톤의 Alice Blue는 순백 없이 차가운 여백을 만든다.

| 역할 | 값 | 확인 수준 | 근거 |

| --- | --- | --- | --- |

| Gargoyle Gas · 높은 명도의 강한 노랑 | #FFE14F | confirmed | pin-preview |

| Space Cadet · 어두운 네이비, 읽기와 구분 | #192853 | confirmed | pin-preview |

| Alice Blue · 차가운 밝은 여백 | #ECF4F7 | confirmed | pin-preview |

### 관찰과 근거

**팔레트와 역할** · `color.palette-roles`

- **옐로가 강조하고 네이비가 기준을 잡음** (confirmed): 옐로와 아이스 블루 위의 진한 글씨, 네이비 위의 밝은 글씨가 서로 역할을 바꾼다. 밝은 영역 두 개 사이에 네이비가 들어가 무게를 잡는다. · 근거: pin-preview

**명도와 대비** · `color.contrast`

- **네이비가 두 밝은 색을 모두 분리** (confirmed): 표기 HEX 기준 네이비·옐로는 10.98:1, 네이비·아이스 블루는 12.83:1, 옐로·아이스 블루는 1.17:1이다. · 근거: pin-preview


### 색감 재사용

- 옐로를 강조 면으로, 네이비를 그 위의 글자·아이콘으로, 차가운 밝은 색을 휴식 면으로 쓴다. 밝은 배경에 옐로만으로 필수 아이콘이나 상태를 표시하지 않는다.


## 취향과 디자인 결정

### `bright-yellow-dark-anchor` · `color.palette-roles` · 선호 후보

- **분석자 해석**: 노랑의 높은 명도와 어두운 네이비의 역할 분리가 활기와 판독을 같이 만들었을 수 있다.
  - 맥락: 밝은 노랑이 주도하는 포스터·제품 그래픽.
  - 디자인 결정: 옐로는 시각 강조나 큰 면을, 어두운 잉크는 형태와 판독을 맡기고 밝은 여백은 필요한 경우만 보완한다.
  - 상충·검수: 노랑과 밝은 바탕만으로 상태나 텍스트를 전달하지 않는다.
  - 근거: `pin-preview`

### 근거 목록

- **pin-preview** / image / `https://i.pinimg.com/736x/34/ca/88/34ca88beb18b6c56c69c854fcd20b21d.jpg`: 736×981px 공개 JPEG. 밝은 노랑, 어두운 남색, 차가운 오프화이트 스와치의 표기 HEX와 글자 대비를 확인했다.
- **swatch-samples** / image / `https://i.pinimg.com/736x/34/ca/88/34ca88beb18b6c56c69c854fcd20b21d.jpg`: 좌상단 원점 중심 (522,227), (522,428), (522,673)의 11×11px RGB 중앙값: #FFE250, #1A2954, #ECF4F7.


### 한계·미검증

- HEX는 이미지에 적힌 값이다. 뒤 장면의 빛·물 반사와 실제 텍스트 색의 전체 픽셀 대비는 계산하지 않았다.
