# Quantus Palette — 일렉트릭 바이올렛과 노랑

> 이 문서는 content/design-reuse.json·content/analyses와 시안 정의에서 생성합니다. 수정 후 npm run docs:designs를 실행하세요.


선명한 바이올렛과 노랑을 비슷한 크기로 맞세우고, 흑보라와 라벤더 백색으로 밝고 어두운 두 중립 톤을 연결한다.

상태: **analyzed** · 작성 2026-11-18 · 수정 2026-11-18

참고자료: url / `https://www.pinterest.com/pin/1102819027539646274/`

2026-11-18 사용자가 마음에 드는 색 조합으로 제공했다. 선호와 분석의 범위는 공개 팔레트 이미지의 색감으로 한정한다.

실행 HTML과 연결하지 않은 독립 참고자료입니다.

데이터: [pinterest-quantus-palette.json](<../../content/analyses/pinterest-quantus-palette.json>) · MCP: `design://analyses/pinterest-quantus-palette` · [전체 분석](./README.md)

**분석 범위:** 색감 분석.

**사용자가 지정한 선호 범위:** `color.palette-roles`, `color.distribution`, `color.emphasis`.

## 색감 분석

밝은 노랑이 먼저 튀지만 바이올렛도 동등한 크기의 주조색이다. 흑보라와 살짝 보랏빛이 도는 백색이 두 강한 색에 명도 양끝을 더한다.

| 역할 | 값 | 확인 수준 | 근거 |

| --- | --- | --- | --- |

| Electric Violet · 선명한 보라 | #834DFB | confirmed | pin-preview |

| Turbo · 밝은 노랑 | #F0E100 | confirmed | pin-preview |

| Haiti · 짙은 흑보라 | #18102B | confirmed | pin-preview |

| Blue Chalk · 라벤더 기운의 백색 | #F5F3FF | confirmed | pin-preview |

### 관찰과 근거

**팔레트와 역할** · `color.palette-roles`

- **포스터에서 명시한 색** (confirmed): 스와치에 일렉트릭 바이올렛 #834DFB, 노랑 #F0E100, 흑보라 #18102B, 라벤더 백색 #F5F3FF가 표기되어 있다. 픽셀 표본이 아니라 이미지의 선언값이다. · 근거: pin-preview

**색 면적과 분포** · `color.distribution`

- **비슷한 면적의 네 색** (estimated): 네 스와치의 면적은 시각상 거의 같다. 바이올렛과 노랑은 둘 다 작은 포인트가 아니라 넓은 색면이다. 정확한 면적은 측정하지 않았다. · 근거: pin-preview

**강조색과 시선** · `color.emphasis`

- **노랑의 시각적 무게** (estimated): 비슷한 면적에서도 밝은 고채도 노랑이 먼저 튀어 보인다. 보라 계열 세 톤은 같은 색 기운으로 연결되어 인상을 절제한다. · 근거: pin-preview


### 색감 재사용

- 선명한 색 두 개를 맞세울 때 밝고 어두운 중립에 한쪽 색의 기운을 조금 남기는 조합을 비교한다. 실제 프로젝트의 색 면적과 글자 대비는 따로 확인한다.


### 근거 목록

- **pin-preview** / image / `https://i.pinimg.com/736x/61/40/d7/6140d7dd10f0075014bcdc119ace88cd.jpg`: Pinterest 공개 팔레트 JPEG. Electric Violet, Turbo, Haiti, Blue Chalk 네 스와치의 표기 HEX와 보이는 색 면적을 확인했다.


### 한계·미검증

- 공개 미리보기의 표기값과 보이는 조합만 확인했다. 색감 이외의 요소는 요청 범위에 포함되지 않으며 원본 이미지는 저장하지 않았다.
