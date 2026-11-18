# Cotton White / Cherry Red / Deep Maroon / Noir Black

> 이 문서는 content/design-reuse.json·content/analyses와 시안 정의에서 생성합니다. 수정 후 npm run docs:designs를 실행하세요.


체리 레드에서 마룬과 붉은 기가 남은 블랙으로 깊어지고, 따뜻한 백색이 어두운 색들을 분리한다.

상태: **analyzed** · 작성 2026-11-18 · 수정 2026-11-18

참고자료: url / `https://www.pinterest.com/pin/22306960651087661/`

2026-11-18 사용자 제공 Pinterest 묶음의 03번. 공개 대표 이미지의 스와치와 배경 사진의 색 관계만 분석했다.

실행 HTML과 연결하지 않은 독립 참고자료입니다.

데이터: [pinterest-cherry-maroon-noir.json](<../../content/analyses/pinterest-cherry-maroon-noir.json>) · MCP: `design://analyses/pinterest-cherry-maroon-noir` · [전체 분석](./README.md)

**분석 범위:** 색감 분석.

## 색감 분석

따뜻한 옅은 백색과 낮은 명도의 적색·블랙을 맞세운 팔레트다. 적색 두 개는 기능적으로 높은 대비를 내기보다 짙은 면 안에서 깊이를 더한다.

| 역할 | 값 | 확인 수준 | 근거 |

| --- | --- | --- | --- |

| Cotton White · 따뜻한 광점과 정보색 | #EDEBDD | confirmed | pin-preview |

| Cherry Red · 주된 적색 | #810100 | confirmed | pin-preview |

| Deep Maroon · 그림자 쪽 적색 | #630000 | confirmed | pin-preview |

| Noir Black · 적색기가 남은 어두운 축 | #1B1717 | confirmed | pin-preview |

### 관찰과 근거

**팔레트와 역할** · `color.palette-roles`

- **사진과 팔레트의 역할이 대응함** (confirmed): 사진에서 붉은 배경과 장미, 옅은 꽃, 검은 의상이 적색·밝은 중립·어두운 중립의 역할을 보여준다. 사진 자체가 표기 HEX로 칠해졌다는 뜻은 아니다. · 근거: pin-preview

**명도와 대비** · `color.contrast`

- **두 적색은 층위, 백색은 판독** (confirmed): 표기 HEX 기준 체리·마룬은 1.27:1이다. 코튼 화이트는 체리에 9.05:1, 마룬에 11.45:1, 블랙에 14.84:1이다. 진한 적색 둘을 상태색으로 구분하기보다 백색으로 정보를 분리하는 편이 명확하다. · 근거: pin-preview


### 색감 재사용

- 체리와 마룬은 색상이 다른 두 강조색으로 쓰지 않고, 주 적색과 짙은 변형으로 나눈다. 작은 글자나 필수 상태는 코튼 화이트나 충분히 밝은 바탕으로 분리한다.


## 취향과 디자인 결정

### `deep-red-light-neutral-contrast` · `color.contrast` · 선호 후보

- **분석자 해석**: 깊은 적색 두 층과 블랙을 유지하면서 따뜻한 백색으로 밝기를 분리한 점이 조합의 인상에 기여했을 수 있다.
  - 맥락: 적색과 검은 면적이 큰 패션·브랜드 그래픽.
  - 디자인 결정: 낮은 명도의 적색은 깊이를 만들고 코튼 계열 중립색은 시각적 기준과 읽기를 맡긴다.
  - 상충·검수: 적색 계열끼리는 작은 글자와 상태를 구분하는 데 쓰지 않는다.
  - 근거: `pin-preview`

### 근거 목록

- **pin-preview** / image / `https://i.pinimg.com/736x/1f/07/97/1f0797e378012c9ce57f364fa46a3e00.jpg`: 720×909px 공개 JPEG. 왼쪽부터 Cotton White, Cherry Red, Deep Maroon, Noir Black의 표기 HEX를 확인했다.
- **swatch-samples** / image / `https://i.pinimg.com/736x/1f/07/97/1f0797e378012c9ce57f364fa46a3e00.jpg`: 좌상단 원점 중심 (144,481), (288,481), (432,481), (576,481)의 11×11px RGB 채널별 중앙값: #EDEBDE, #820203, #630100, #1D1717.


### 한계·미검증

- HEX는 미리보기 표기값이다. RGB와 함께 쓰인 CMYK는 출력 프로파일 없이 인쇄 기준으로 확정하지 않는다.
