# Thunderstorm — 블랙·차콜·옐로·앰버

> 이 문서는 content/design-reuse.json·content/analyses와 시안 정의에서 생성합니다. 수정 후 npm run docs:designs를 실행하세요.


세 단계 무채색에서 고명도 옐로와 앰버로 전환한다. 밝은 색을 얇은 포인트에만 두지 않고 스와치 면의 절반 넘게 쓴다.

상태: **analyzed** · 작성 2026-11-18 · 수정 2026-11-18

참고자료: url / `https://www.pinterest.com/pin/317503842486013547/`

2026-11-18 사용자 제공 Pinterest 묶음의 06번. 공개 팔레트 이미지의 색감과 조합만 분석했다.

실행 HTML과 연결하지 않은 독립 참고자료입니다.

데이터: [pinterest-thunderstorm-palette.json](<../../content/analyses/pinterest-thunderstorm-palette.json>) · MCP: `design://analyses/pinterest-thunderstorm-palette` · [전체 분석](./README.md)

**분석 범위:** 색감 분석.

## 색감 분석

블랙과 두 차콜은 무채색의 깊이를 만들고 채도 높은 옐로·앰버가 한 번에 온도를 올린다. 두 따뜻한 색은 서로를 구분하기보다 큰 밝은 덩어리 안에서 변주한다.

| 역할 | 값 | 확인 수준 | 근거 |

| --- | --- | --- | --- |

| Black · 가장 깊은 무채색 면과 잉크 | #000000 | confirmed | pin-preview |

| Charcoal · 어두운 보조 면 | #262626 | confirmed | pin-preview |

| Gray · 밝은 쪽의 차콜 변형 | #383838 | confirmed | pin-preview |

| Yellow · 명도가 높은 전환색 | #FFC812 | confirmed | pin-preview |

| Amber · 넓고 따뜻한 밝은 면 | #FAB23D | confirmed | pin-preview |

### 관찰과 근거

**색 면적과 분포** · `color.distribution`

- **시연 면적의 절반 이상이 밝은 색** (estimated): 동일 너비의 띠만 보면 옐로와 앰버가 합계 약 53%를 차지하고, 그중 앰버가 더 넓다. 바깥 회색 배경과 하단 표기는 이 비율에 넣지 않았다. · 근거: swatch-samples

**명도와 대비** · `color.contrast`

- **따뜻한 두 띠는 판독용으로만 보면 비슷함** (confirmed): 표기값의 sRGB 대비는 옐로·앰버 1.18:1, 블랙·옐로 13.52:1, 블랙·앰버 11.50:1이다. 옐로와 앰버는 배경 변주로 쓰고 정보는 어두운 잉크로 분리하기 좋다. · 근거: pin-preview

**팔레트와 역할** · `color.palette-roles`

- **따뜻한 면과 어두운 잉크** (confirmed): 밝은 두 스와치는 어두운 표기를, 어두운 스와치들은 밝은 표기를 쓴다. 두 옐로의 차이보다 밝은 면과 어두운 잉크의 차이가 읽기를 만든다. · 근거: pin-preview


### 색감 재사용

- 차콜 단계는 깊이와 보조 면에, 블랙은 노랑과 앰버 위의 정보색에 사용한다. 포스터처럼 노랑을 큰 면적에 쓸 수도 있지만 제품 UI에서는 정보의 우선순위에 맞게 면적을 조정한다.


## 취향과 디자인 결정

### `bright-yellow-dark-anchor` · `color.palette-roles` · 선호 후보

- **분석자 해석**: 노랑과 앰버를 큰 면으로 쓰고 무채색 잉크가 형태와 읽기를 맡기는 점이 선명한 인상에 기여했을 수 있다.
  - 맥락: 밝은 노랑이 주도하는 포스터·제품 그래픽.
  - 디자인 결정: 옐로 계열과 검정을 분리한다. 두 노랑은 기능 상태의 짝이 아니라 밝은 면의 변주로 사용한다.
  - 상충·검수: 앰버도 높은 주목도를 가지므로 중요도가 낮은 콘텐츠에 넓게 쓰면 위계가 뒤집힐 수 있다.
  - 근거: `pin-preview`

### 근거 목록

- **pin-preview** / image / `https://i.pinimg.com/736x/27/e1/66/27e1665fafcf7c0036a2ff296a5f69a1.jpg`: 736×1172px 공개 JPEG. 다섯 가로 띠의 표기 HEX를 확인했다.
- **swatch-samples** / image / `https://i.pinimg.com/736x/27/e1/66/27e1665fafcf7c0036a2ff296a5f69a1.jpg`: 좌상단 원점 중심 x=456, y=175/345/421/521/738의 11×11px RGB 중앙값: #000000, #262626, #383838, #FFC813, #FAB23C. 중앙 부근 x=450에서 스와치 상단 y≈45, 옐로 시작 y≈459, 앰버 시작 y≈582, 하단 y≈932를 읽었다.


### 한계·미검증

- 스와치 표기값을 보존했다. 면적 비율은 JPEG 팔레트 본체의 중앙 단면 추정이며 디자인 전반에 적용할 공식 비율이 아니다.
