# 인물·피사체 구도 분석 누적 로그

> 예시별 분석 JSON에서 자동 생성한다. 추가·수정은 [분석 등록 안내](<../../recording-analyses.md>)를 따른다. MCP: `design://analysis-logs/subject-composition`.

사용자가 제공한 선호 레퍼런스의 확인·추정·미확인 관찰을 모은다. 근거 원문과 다른 분석 항목은 예시별 보고서에서 확인한다.

## 도트로 만든 두 얼굴 — 밝은 하프톤 모션의 색감·레이아웃·폰트

수정 2026-11-18 · [상세 분석·근거](<../halftone-talking-heads-study.md#subject-composition>)

비슷한 시각적 무게의 얼굴 두 개를 수평으로 병치하고 중앙과 상단 여백을 크게 남긴다.

**위치와 상대 크기** · `subject-composition.position-scale`

- **두 얼굴의 병치** (confirmed): 두 얼굴을 좌우에 따로 두고 테두리나 카드로 둘러싸지 않는다. 방향이 달라져도 상대 위치는 유지된다. · 근거: overview-frames, motion-frames

**프레이밍과 크롭** · `subject-composition.framing`

- **프레임의 여백** (confirmed): 피사체는 화면 가운데 띠에 모이고 상단에는 넓은 여백이 남는다. 화면 녹화에서의 배치이며 원본 광고의 크롭 규칙은 미확인이다. · 근거: overview-frames, detail-frame

**전경·중경·배경** · `subject-composition.depth-layers`

- **피사체와 오버레이** (confirmed): 오른쪽 소셜 아이콘은 별도 오버레이가 피사체 영역에 걸친 예다. · 근거: detail-frame

**재사용**

- 대화와 비교가 목적일 때 수평 병치와 빈 중앙을 활용한다. 피사체 수와 크기는 실제 콘텐츠에 맞춘다.

## Blue Current — 수면을 담은 글자와 앞으로 뻗는 수영선수

수정 2026-11-18 · [상세 분석·근거](<../pinterest-blue-current.md#subject-composition>)

수영선수의 큰 손이 화면 가까이 오고 얼굴은 더 뒤에 있어 깊이가 강하다.

**시점과 원근** · `subject-composition.viewpoint`

- **팔과 얼굴의 원근** (confirmed): 아래쪽 전경의 손이 얼굴보다 크게 보이고 팔이 얼굴에서 관찰자 쪽으로 뻗는다. 사용한 렌즈나 촬영 방식은 미확인이다. · 근거: pin-preview

**재사용**

- 동작을 전달하는 전경이 있다면 시선 방향과 깊이를 강화하되, 중요한 정보 위에 놓지 않는다.

## Kyoto — 큰 지명과 도시 풍경에 우측 안내 띠를 붙인 여행 포스터

수정 2026-11-18 · [상세 분석·근거](<../pinterest-kyoto-travel-poster.md#subject-composition>)

거리의 앞·뒤 차이로 장면의 깊이를 만든다.

**전경·중경·배경** · `subject-composition.depth-layers`

- **골목에서 먼 지붕으로** (confirmed): 전경의 횡단보도와 양쪽 건물 뒤로 좁아지는 도로, 희미한 먼 지붕과 탑의 실루엣이 겹쳐 있다. · 근거: pin-preview

**재사용**

- 공간 기록이 주제라면 건물 실루엣과 길의 원근을 잠식하지 않도록 글자 영역을 나눈다.

## Prompt — 흑백 인물 사진을 지면으로 쓴 패션 포스터

수정 2026-11-18 · [상세 분석·근거](<../pinterest-prompt-monochrome-portrait.md#subject-composition>)

카메라를 향한 정면 클로즈업에서 얼굴과 안경을 중심에 두고, 양쪽 어깨는 화면 밖으로 잘린다.

**프레이밍과 크롭** · `subject-composition.framing`

- **얼굴은 보존하고 어깨를 크롭** (confirmed): 머리 위에는 적은 여백만 있고, 양쪽 어깨는 프레임 밖으로 이어진다. 높은 옷깃이 얼굴 아래에서 목을 감싸 인물의 어두운 실루엣을 넓힌다. · 근거: pin-preview

**재사용**

- 인물 편집이 주제일 때 표정과 얼굴의 주요 특징을 살리고, 가슴과 어깨는 용도에 맞게 크롭한다.

## The Edge — 제목 쪽으로 넘어오는 카누

수정 2026-11-18 · [상세 분석·근거](<../pinterest-the-edge-canoe.md#subject-composition>)

수직 카누의 중심축과 패들의 사선이 수면 장면의 구조를 만든다.

**시점과 원근** · `subject-composition.viewpoint`

- **거의 수직으로 내려다본 구도** (confirmed): 카누의 내부와 패들이 위에서 보이고, 패들 주변의 원형 물결이 중앙 피사체의 양쪽으로 펼쳐진다. · 근거: pin-preview

**재사용**

- 위에서 본 피사체의 실루엣이 명확할 때 이를 지면의 정렬축과 연결해 본다.
