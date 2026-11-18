# Five-step Blue — 잉크 네이비부터 아이스 블루까지

> 이 문서는 content/design-reuse.json·content/analyses와 시안 정의에서 생성합니다. 수정 후 npm run docs:designs를 실행하세요.


거의 검은 파랑부터 밝은 아이스 블루까지 한 색계열의 명도를 다섯 층으로 나누고 중간 톤의 채도를 가라앉힌다.

상태: **analyzed** · 작성 2026-11-18 · 수정 2026-11-18

참고자료: url / `https://www.pinterest.com/pin/1035335401839851116/`

2026-11-18 사용자 제공 Pinterest 묶음의 10번. 공개 대표 이미지의 색감과 조합만 분석했다.

실행 HTML과 연결하지 않은 독립 참고자료입니다.

데이터: [pinterest-five-step-blue-ramp.json](<../../content/analyses/pinterest-five-step-blue-ramp.json>) · MCP: `design://analyses/pinterest-five-step-blue-ramp` · [전체 분석](./README.md)

**분석 범위:** 색감 분석.

## 색감 분석

08·09번처럼 일렉트릭 블루 하나를 튀게 두기보다, 밝고 어두운 블루의 연속으로 위계를 만든다. 차분한 중간 톤은 바탕을 잇지만 모든 단계가 흰 글자를 받을 수 있는 것은 아니다.

| 역할 | 값 | 확인 수준 | 근거 |

| --- | --- | --- | --- |

| 잉크 네이비 · 가장 어두운 글자나 면 | #011025 | confirmed | pin-preview |

| 딥 블루 · 짙은 기본 면 | #052659 | confirmed | pin-preview |

| 스틸 블루 · 차분한 중간 층 | #5482B4 | confirmed | pin-preview |

| 더스티 블루 · 중간보다 밝은 보조 면 | #7EA0C5 | confirmed | pin-preview |

| 아이스 블루 · 가장 밝은 면과 역상 | #C2E8FF | confirmed | pin-preview |

### 관찰과 근거

**팔레트와 역할** · `color.palette-roles`

- **색상을 더하지 않고 명도 계단을 만듦** (confirmed): 잉크와 딥 블루로 어두움을 만들고 중간의 회청색 두 단계가 아이스 블루로 이어진다. 보조 단계 사이의 구별은 다른 색상보다 밝기와 채도에 기대고 있다. · 근거: pin-preview

**명도와 대비** · `color.contrast`

- **중간 블루에서 흰 글자를 그대로 쓰면 부족** (confirmed): 표기값 기준 양 끝 대비는 14.77:1이다. 순백을 가정하면 #5482B4 위 4.02:1, #7EA0C5 위 2.72:1로 일반 작은 텍스트에 필요한 4.5:1에 미달한다. #7EA0C5와 #052659의 대비는 5.41:1이다. · 근거: pin-preview


### 색감 재사용

- 제품에서는 잉크 네이비와 아이스 블루에 핵심 판독을 맡기고, 중간 두 톤은 표면과 보조 면에 둔다. 토큰으로 옮길 때 밝은 모드·어두운 모드에서 텍스트와 상태 조합을 따로 검수한다.


### 근거 목록

- **pin-preview** / image / `https://i.pinimg.com/736x/d2/ed/8b/d2ed8bc47f8c3f0467c02777e99d85af.jpg`: 736×920px 공개 JPEG. 다섯 개 스와치의 표기 HEX와 남색 계열 배경을 확인했다.
- **swatch-samples** / image / `https://i.pinimg.com/736x/d2/ed/8b/d2ed8bc47f8c3f0467c02777e99d85af.jpg`: 좌상단 원점 중심 x=515, y=216/322/428/530/653의 11×11px RGB 채널별 중앙값이 각각 #011025, #052659, #5482B4, #7EA0C5, #C2E8FF로 이미지 내 표기와 일치했다.


### 한계·미검증

- 스와치 순서의 명도 방향만 확인했다. 다섯 단계가 지각적으로 등간격이라는 뜻은 아니며 배경 그라데이션의 원본 설정도 확인하지 않았다.
