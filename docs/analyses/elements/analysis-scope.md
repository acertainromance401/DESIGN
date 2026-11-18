# 디자인 분석 세부 기준

> 분류 정의에서 자동 생성한다. [저장·분류 방법](<../../recording-analyses.md>) · MCP: `design://analysis-scope`.

필요한 항목에만 근거를 기록한다. 각 관찰은 하나의 `focus`를 선택하고 여러 주제가 섞이면 관찰을 나눈다. 근거가 없는 항목을 채우기 위해 추정하지 않는다.

관찰 중 실제 선택을 바꾸는 것은 `preferenceSignals`에 효과·맥락·적용 결정·상충/검수로 연결한다. 예: 모션이 제목을 읽는 데 방해가 된다면 시선 유도만 남기고 정지 상태의 가독성을 확인한다.

## 색감 분석

[누적 로그](<../../../designs/palettes/color-combinations.md#사용자-제공-레퍼런스-색감-분석>)

| `focus` | 세부 기준 | 관찰할 내용 |
| --- | --- | --- |
| `color.palette-roles` | 팔레트와 역할 | 배경·본문·표면·강조·상태 색을 구분하고 코드의 출처를 기록한다. |
| `color.emphasis` | 강조색과 시선 | 강조색이 어디에 얼마나 쓰이며 어느 요소에 먼저 주목하게 하는지 본다. |
| `color.distribution` | 색 면적과 분포 | 주조색·보조색의 면적과 위치를 본다. 측정하지 않은 비율은 추정으로 남긴다. |
| `color.contrast` | 명도와 대비 | 배경과 글자·아이콘의 대비를 구분한다. 시각 인상과 측정한 대비율을 혼용하지 않는다. |
| `color.temperature-saturation` | 색온도와 채도 | 따뜻함·차가움, 선명함·탁함, 중립색의 균형을 본다. |

## 레이아웃 분석

[누적 로그](<layout.md>)

| `focus` | 세부 기준 | 관찰할 내용 |
| --- | --- | --- |
| `layout.grid` | 프레임과 그리드 | 화면 비율, 열, 컨테이너 폭과 배치 기준선을 본다. |
| `layout.spacing` | 간격과 여백 | 외곽 여백, 묶음 안팎의 간격과 의도적으로 비운 영역을 본다. |
| `layout.hierarchy` | 영역 위계와 흐름 | 주 영역·보조 영역 및 화면을 읽는 순서를 구분한다. |
| `layout.layering` | 레이어와 겹침 | 앞뒤 순서, 가림, 오버레이와 오버플로를 본다. |
| `layout.responsive` | 크기 변화와 안전 영역 | 화면 폭·방향·글자 확대에 따른 배치 변화를 확인 범위 안에서 기록한다. |
| `layout.density` | 편집 밀도와 생략 | 첫 화면에 무엇을 남기고 덜었는지, 비교 기준 없이 화면이 단순하다고 일반화하지 않는다. |
| `layout.rhythm` | 반복과 변화의 리듬 | 묶음의 반복, 크기·간격의 변화가 읽는 속도와 강조에 주는 영향을 본다. |

## 폰트 분석

[누적 로그](<typography.md>)

| `focus` | 세부 기준 | 관찰할 내용 |
| --- | --- | --- |
| `typography.family` | 서체 패밀리 | 선언 서체·실제 적용 서체·시각적 추정을 구분한다. |
| `typography.weight-style` | 굵기와 스타일 | 웨이트, 기울기, 제목과 본문의 스타일 차이를 본다. |
| `typography.glyphs` | 글리프 형태 | 자형·숫자·기호의 특징과 실제 문자 여부를 본다. |
| `typography.fallback` | 언어 조합과 대체 서체 | 한글·영문 혼용과 글리프별 fallback을 확인한다. |
| `typography.license` | 출처와 사용 권리 | 시스템·외부 서체의 출처와 포함·재배포 가능 여부를 구분한다. |

## 글자 배치 분석

[누적 로그](<text-placement.md>)

| `focus` | 세부 기준 | 관찰할 내용 |
| --- | --- | --- |
| `text-placement.alignment` | 텍스트 위치와 정렬 | 제목·본문·자막의 앵커, 기준선과 정렬을 본다. |
| `text-placement.hierarchy` | 텍스트 위계와 강조 | 내용의 역할별 크기·굵기·강조와 읽는 순서를 본다. |
| `text-placement.line-breaks` | 줄바꿈과 폭 | 제목의 끊는 위치, 문장 폭, 행 수와 잘림을 본다. |
| `text-placement.spacing` | 자간과 행간 | 독해에 영향을 주는 글자·줄·문단 간격을 서체 이름과 분리해 기록한다. |
| `text-placement.readability` | 가독성과 가림 | 배경 대비, 긴 문장, 자막과 조작 요소의 겹침을 확인한다. |
| `text-placement.image-balance` | 글과 이미지의 역할 분담 | 글과 이미지 중 무엇이 먼저 보이고 각각 어떤 내용을 전달하는지 본다. |

## 인물·피사체 구도 분석

[누적 로그](<subject-composition.md>)

| `focus` | 세부 기준 | 관찰할 내용 |
| --- | --- | --- |
| `subject-composition.position-scale` | 위치와 상대 크기 | 화면에서 피사체가 차지하는 위치와 상대적 시각 무게를 본다. |
| `subject-composition.framing` | 프레이밍과 크롭 | 어디까지 보이도록 자르는지, 화면 가장자리와 여백을 본다. |
| `subject-composition.viewpoint` | 시점과 원근 | 정면·측면·상하 시점과 원근 인상을 확인 가능한 범위에서 기록한다. |
| `subject-composition.depth-layers` | 전경·중경·배경 | 피사체와 배경의 분리, 깊이 단서와 가림 순서를 본다. |
| `subject-composition.direction-gesture` | 방향과 자세 | 고개·몸·시선·손짓의 방향과 상대 피사체와의 관계를 본다. |
| `subject-composition.balance` | 시각적 무게와 초점 | 대칭·비대칭, 밝기·크기·빈 공간의 균형과 시선이 머무는 곳을 본다. |

## 조명 분석

[누적 로그](<lighting.md>)

| `focus` | 세부 기준 | 관찰할 내용 |
| --- | --- | --- |
| `lighting.source-direction` | 광원의 위치와 방향 | 보이는 빛의 출발점·방향과 추정하는 실제 광원을 구분한다. |
| `lighting.quality` | 빛의 강약과 경계 | 빛의 부드러움, 감쇠, 경계 폭과 확산 인상을 본다. |
| `lighting.highlights` | 하이라이트와 반사 | 표면에서 밝아지는 위치와 범위를 기록한다. |
| `lighting.shadows` | 그림자와 국소 명암 | 표면 명암과 투영 그림자를 구분하고 확인되지 않은 광원은 확정하지 않는다. |
| `lighting.atmosphere` | 안개·광선의 공간감 | 안개·광선·공기 원근이 명암과 깊이를 만드는 방식을 본다. |

## 모션 분석

[누적 로그](<motion.md>)

| `focus` | 세부 기준 | 관찰할 내용 |
| --- | --- | --- |
| `motion.movement` | 움직이는 대상과 경로 | 무엇이 어디로 얼마나 움직이고 무엇이 고정되는지 본다. |
| `motion.timing` | 시간·주기·속도 | 시점, 지속시간, 이징과 반복을 측정 또는 추정으로 구분한다. |
| `motion.transition` | 등장·전환·사라짐 | 상태가 바뀌는 순서와 화면 전환이 정보 구조에 미치는 영향을 본다. |
| `motion.feedback` | 입력 반응과 동기 | 터치·포인터·음성 등 입력과 동작의 관계를 실제로 검증했는지 구분한다. |
| `motion.accessibility` | 정지와 동작 줄이기 | 정지 수단과 동작 줄이기 상태를 확인한다. 녹화만으로 동작 지원을 단정하지 않는다. |

## 질감 분석

[누적 로그](<texture.md>)

| `focus` | 세부 기준 | 관찰할 내용 |
| --- | --- | --- |
| `texture.material` | 표면과 재질 | 매트·광택·종이·금속 등의 인상과 실제 구현을 구분한다. |
| `texture.pattern` | 반복 단위와 규칙 | 점·선·획·타일 등 표식과 배열을 본다. |
| `texture.density` | 크기·간격·밀도 | 표식이 조밀하거나 드문 위치와 형태를 드러내는 차이를 본다. |
| `texture.edges` | 경계와 소실 | 실루엣·번짐·크롭·디졸브의 경계 표현을 본다. |
| `texture.grain` | 노이즈와 입자감 | 의도된 그레인과 녹화·압축에서 생긴 노이즈를 구분한다. |

## 상호작용 분석

[누적 로그](<interaction.md>)

| `focus` | 세부 기준 | 관찰할 내용 |
| --- | --- | --- |
| `interaction.affordance` | 조작 가능성의 단서 | 무엇을 누르거나 움직일 수 있고 주요 행동이 분명한지 확인한다. |
| `interaction.states` | 상태와 결과 | 선택·로딩·빈 상태·실패·완료를 구분하며 실제 확인한 상태만 기록한다. |
| `interaction.navigation` | 탐색 흐름과 복귀 | 화면의 진입·이탈, 뒤로 가기, 포커스와 작업 맥락의 보존을 본다. |
| `interaction.accessibility` | 입력과 접근성 | 키보드·터치·보조 기술·글자 확대의 동작을 검증 범위와 함께 기록한다. |
| `interaction.recovery` | 실수와 복구 | 취소·되돌리기·재시도, 오류가 났을 때 입력이 보존되는지 확인한다. |
