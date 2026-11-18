# 글자 배치 분석 누적 로그

> 예시별 분석 JSON에서 자동 생성한다. 추가·수정은 [분석 등록 안내](<../../recording-analyses.md>)를 따른다. MCP: `design://analysis-logs/text-placement`.

사용자가 제공한 선호 레퍼런스의 확인·추정·미확인 관찰을 모은다. 근거 원문과 다른 분석 항목은 예시별 보고서에서 확인한다.

## 도트로 만든 두 얼굴 — 밝은 하프톤 모션의 색감·레이아웃·폰트

수정 2026-11-18 · [상세 분석·근거](<../halftone-talking-heads-study.md#text-placement>)

중앙 그래픽 위에 제목을 두지 않고, 문장 정보는 화면 하단의 작은 영문 자막으로 내려 보낸다.

**텍스트 위치와 정렬** · `text-placement.alignment`

- **자막의 위치** (confirmed): 문장 자막은 화면 하단의 별도 줄에 있다. 중앙의 얼굴 위에 본문을 두지 않는다. · 근거: detail-frame, overview-frames

**줄바꿈과 폭** · `text-placement.line-breaks`

- **자막의 단위** (confirmed): 하단 자막은 짧은 줄로 이어진다. 원본 자막 폭이나 줄바꿈 규칙은 확인하지 않았다. · 근거: detail-frame

**텍스트 위계와 강조** · `text-placement.hierarchy`

- **단어 강조** (confirmed): 하단 문장 일부에서 단어만 다른 색으로 강조된다. · 근거: overview-frames

**가독성과 가림** · `text-placement.readability`

- **앱 오버레이와의 중첩** (confirmed): 계정명과 광고 UI가 자막 일부를 가린다. 원본 광고도 같은 위치에서 가리도록 설계됐는지는 확인할 수 없다. · 근거: detail-frame

**재사용**

- 작은 자막은 피사체 및 조작 영역과 분리하고, 긴 문장에서도 읽을 수 있는 여백과 대비를 확보한다.

## Batica — 세 가지 바탕에서 반복한 타이포 스페시먼

수정 2026-11-18 · [상세 분석·근거](<../pinterest-batica-specimen.md#text-placement>)

상단의 정보를 분산하고 주 제목과 크레디트는 중앙축으로 되돌린다.

**텍스트 위치와 정렬** · `text-placement.alignment`

- **보조 정보의 정렬** (confirmed): 상단의 마크와 라벨은 가로로 분산되고, 제목과 크레디트는 서로 다른 높이에서 중앙에 놓인다. · 근거: pin-preview

**재사용**

- 상단의 보조 정보가 제목과 경쟁하지 않도록 역할에 맞는 정렬과 크기를 선택한다.

## Blue Current — 수면을 담은 글자와 앞으로 뻗는 수영선수

수정 2026-11-18 · [상세 분석·근거](<../pinterest-blue-current.md#text-placement>)

그래픽 제목이 일부 가려져도 오른쪽에 읽을 수 있는 제목이 별도로 있다.

**가독성과 가림** · `text-placement.readability`

- **핵심 제목의 별도 표기** (confirmed): 대형 글자는 세 단으로 나뉘고 피사체에 일부 가려진다. 우측의 작은 정보 열에는 전체 제목이 다시 읽을 수 있게 제시된다. · 근거: pin-preview

**재사용**

- 가려지거나 분절되는 장식적 제목이 유일한 제목이 되지 않게 한다.

## Coliner / Beyond — 블루 위에서 화면을 채우는 노란 글자

수정 2026-11-18 · [상세 분석·근거](<../pinterest-coliner-beyond.md#text-placement>)

단어를 중간에서 끊고 일부 글자 가장자리를 지면 밖으로 보낸다.

**줄바꿈과 폭** · `text-placement.line-breaks`

- **be / yond 분절** (confirmed): beyond는 be와 yond로 나뉘며 첫 줄의 오른쪽 빈 곳에 부제와 설명이 들어간다. · 근거: pin-preview

**재사용**

- 의미 있는 줄 나눔만 남기고 단어·문자 의미가 깨지는 분절은 표지에서도 다시 확인한다.

## Kyoto — 큰 지명과 도시 풍경에 우측 안내 띠를 붙인 여행 포스터

수정 2026-11-18 · [상세 분석·근거](<../pinterest-kyoto-travel-poster.md#text-placement>)

가로 지명과 우측에 따로 세로로 놓인 일본어가 서로 다른 정보 층을 이룬다.

**텍스트 위치와 정렬** · `text-placement.alignment`

- **오른쪽 안내 열의 세로 조판** (confirmed): 일본어 문구는 안내 띠 위쪽에 세로로 놓이고, 작은 영문과 지도·좌표는 같은 열의 다른 높이에 정렬된다. · 근거: pin-preview

**재사용**

- 해당 문자 체계에 자연스러운 조판 방향을 쓴다. 세로 조판을 정보와 무관한 장식으로 옮기지 않는다.

## Prompt — 흑백 인물 사진을 지면으로 쓴 패션 포스터

수정 2026-11-18 · [상세 분석·근거](<../pinterest-prompt-monochrome-portrait.md#text-placement>)

흰 제목과 설명이 검은 의상 위에 직접 놓이고, 모서리의 검은 표기는 밝은 바탕에 남는다.

**글과 이미지의 역할 분담** · `text-placement.image-balance`

- **검은 옷이 글자 자리까지 맡음** (confirmed): 제목과 설명은 하단의 어두운 의상 위에 놓여 얼굴과 렌즈를 가리지 않는다. 글자만을 위한 별도 상자나 단색 배너는 보이지 않는다. · 근거: pin-preview

**가독성과 가림** · `text-placement.readability`

- **작은 하단 카피의 한계** (estimated): 큰 흰 단어보다 아래의 여러 줄 설명은 훨씬 작다. 축소해 읽을 때 판독이 먼저 어려워질 수 있다. · 근거: pin-preview

**재사용**

- 사진에 이미 안정적인 명도 영역이 있으면 그 위에 글자를 두고, 크롭을 바꿀 때도 얼굴의 가림과 글자 대비를 다시 확인한다.

## The Edge — 제목 쪽으로 넘어오는 카누

수정 2026-11-18 · [상세 분석·근거](<../pinterest-the-edge-canoe.md#text-placement>)

보트가 중심부 작은 카피를 실제로 가리는 편집이다.

**가독성과 가림** · `text-placement.readability`

- **카피의 국소 가림** (confirmed): 제목은 전체 단어를 알아볼 수 있지만, 제목 아래의 작은 카피는 선수가 앞을 지나며 줄 중간이 끊긴다. · 근거: pin-preview

**재사용**

- 필수 카피는 가려지지 않는 별도 영역에 둔다.
