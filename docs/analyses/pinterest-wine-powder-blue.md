# Wine / Blue — 짙은 와인·파우더 블루

> 이 문서는 content/design-reuse.json·content/analyses와 시안 정의에서 생성합니다. 수정 후 npm run docs:designs를 실행하세요.


거의 검은 와인색과 밝은 푸른색을 큰 두 면으로 맞세운 명도·온도 대비.

상태: **analyzed** · 작성 2026-11-18 · 수정 2026-11-18

참고자료: url / `https://www.pinterest.com/pin/710583647507651742/`

2026-11-18 사용자 제공 Pinterest 묶음의 02번. 공개 대표 이미지의 색감과 조합만 분석했다. 조명이나 실내 재료의 실제 색상은 확인하지 않았다.

실행 HTML과 연결하지 않은 독립 참고자료입니다.

데이터: [pinterest-wine-powder-blue.json](<../../content/analyses/pinterest-wine-powder-blue.json>) · MCP: `design://analyses/pinterest-wine-powder-blue` · [전체 분석](./README.md)

**분석 범위:** 색감 분석.

## 색감 분석

따뜻한 적색은 명도를 낮춰 무게를 만들고 차가운 파랑은 밝기를 올려 맞선다. 01번과 달리 밝은 색도 색상이 뚜렷해 온도 차가 더 선명하다.

| 역할 | 값 | 확인 수준 | 근거 |

| --- | --- | --- | --- |

| Wine · 어둡고 따뜻한 축 | #51000F | confirmed | pin-preview |

| Blue · 밝고 차가운 축 | #87B3FE | confirmed | pin-preview |

### 관찰과 근거

**색온도와 채도** · `color.temperature-saturation`

- **두 유채색에 다른 온도와 무게 배분** (confirmed): 상단 스와치의 깊은 와인과 하단의 맑은 밝은 파랑은 명도와 색온도가 함께 다르다. 배경의 적색 벽과 창가의 청색 면도 같은 색 방향을 반복한다. · 근거: pin-preview

**명도와 대비** · `color.contrast`

- **두 색을 잉크와 배경으로 교체** (confirmed): 표기 HEX 간 상대 명도 대비는 7.30:1이다. 두 스와치는 상대색으로 이름을 적어, 흰색을 제3의 텍스트색으로 더하지 않고 명도차를 쓴다. · 근거: pin-preview


### 색감 재사용

- 크림보다 차가운 인상이 필요하면 깊은 와인에 명도가 충분히 높은 블루를 짝짓는다. 두 색을 같은 명도로 맞추면 여기서 관찰된 분리감은 약해진다.


### 근거 목록

- **pin-preview** / image / `https://i.pinimg.com/736x/e8/ba/dd/e8badda71cc79c7f27957df8f351719e.jpg`: 736×1307px 공개 JPEG. 배경의 좌우 적색·청색 영역과 그 위에 놓인 WINE·BLUE 스와치의 표기 HEX를 확인했다.
- **swatch-samples** / image / `https://i.pinimg.com/736x/e8/ba/dd/e8badda71cc79c7f27957df8f351719e.jpg`: 좌상단 원점 중심 (507,431), (507,751)의 11×11px RGB 채널별 중앙값 #52000F, #88B4FF. 사진 조명과 벽면의 색은 샘플링 대상에서 제외했다.


### 한계·미검증

- 대표 이미지에 표기된 HEX를 사용했다. 실내 배경의 조명과 그라데이션, 실제 바탕 위 글자 렌더링은 별도 검수 대상이다.
