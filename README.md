# DESIGN MCP

새 프로젝트를 만들거나 기존 프로젝트를 업데이트할 때, 필요한 디자인 패턴을 찾아 적용하도록 돕는 **읽기 전용 MCP 서버**입니다. 범용 UI/UX·시각 스타일·모션·차트·3D 설계 지침, 대표 SwiftUI/웹 예제, WEASHION 프로젝트 참조를 구분합니다.

**필수 주의 문서 → 카테고리 → 짧은 검색 결과 → 선택한 패턴 → 적용 가이드** 순서로 가져옵니다. 주의 문서는 모든 조회에 선행하며, 패턴 상세와 원본 코드 발췌는 필요한 경우에만 조회합니다.

## 시안·기술·플랫폼별 탐색

**21개 시안을 8개 유형으로 정리하고, 14개 사용 기술과 8개 대상 플랫폼의 활용 경로를 연결했습니다.** 웹 구현과 네이티브·게임 이식 지침은 구분합니다.

- [종류별 시안 폴더](./designs/README.md) · [검색 가능한 HTML 탐색](./designs/index.html)
- [시안별 기술 분석·구현 위치·자산·재사용 단위](./docs/design-inventory.md)
- [시안·실전 디자인 기술 카탈로그](./docs/technology-catalog.md): 웹·그래픽·모션·네이티브·게임·자산 제작·검수 후보. `search_design_technologies`로 이름이나 목적을 검색하고 `get_design_technology`로 필요 조건과 제약을 확인합니다.
- [SwiftUI·Metal·RealityKit·SpriteKit·Unity·Godot·Unreal 활용 가이드](./docs/platform-adoption.md)
- [외부 프로젝트의 MCP 연결·도구 호출 예](./docs/mcp-workflows.md)
- [작업공간 전체 구조와 파일 역할](./docs/workspace-map.md)

원본은 `designs/{유형}/`에 한 번만 보관하며 이전 HTML 주소는 새 위치로 연결합니다. `search_design_visuals`에 `family`, `technology`, `platform`을 지정하고, `get_design_technology`, `get_design_platform`, `create_visual_adoption_plan`으로 구체화합니다. HTML 외 모듈은 `sourceFiles` 리소스로 별도 조회합니다.

기술 카탈로그의 `source-backed`는 시안의 실제 사용 근거, `candidate`는 별도 도입 검토용입니다. MCP 조회로 프레임워크가 설치되거나 외부 앱이 실행되지는 않습니다. 현재 프로젝트의 스택·SDK·GPU·도구 접근과 권한을 연결된 클라이언트가 확인합니다.

생일 원문·사진·음원·모델과 개인 내용을 확인하는 로컬 테스트는 **로컬 전용**으로 보존하고 GitHub와 npm에서 제외합니다. 공개 저장소와 설치본에는 분석·교체 가이드만 제공합니다. 이 업데이트는 Swift/Metal/게임 코드를 자동 생성하거나 외부 프로젝트를 수정하지 않습니다. 로컬 빌드 또는 새 tarball로 교체한 뒤 MCP 서버를 재시작해야 새 도구가 보입니다.

## 색감·레이아웃·폰트 분석 축적

새 참고 예시의 분석은 별도 요청 없이 [예시별 JSON](./content/analyses/)에 저장합니다. 기본 범위는 색감·레이아웃·폰트와 해당 요소이며, “색감만”처럼 범위를 지정하면 요청한 항목만 저장합니다. 예시별 보고서와 사용자 선호 예시의 [요소별 로그](./docs/analyses/README.md#사용자-제공-레퍼런스-요소별-로그)는 자동 생성되며, MCP에서도 항목별로 조회할 수 있습니다. HTML이 없는 URL·이미지 참고도 [작성 양식](./content/analysis-template.json)과 [등록·수정·조회 안내](./docs/recording-analyses.md)를 사용해 저장합니다.

[디자인 취향 프로필](./docs/analyses/elements/design-preferences.md)은 관찰과 별도로 명시 피드백·반복 관찰·단일 예시의 해석을 구분합니다. `get_design_preferences` 또는 `design://design-preferences`를 먼저 확인해 모호한 분위기 요청을 구체적인 선택으로 바꾸고, 구현 예제가 필요한 경우에만 HTML을 조회합니다.

```sh
npm run analysis:new -- my-reference
# 생성된 JSON 편집 후
npm run docs:designs
npm run analysis:check
```

MCP는 `search_design_analyses`와 `get_design_analysis`로 근거·추정·실제 서체 미확인을 구분해 조회합니다. 기존 시안 상세와도 연결될 수 있지만 기술 인벤토리와 선호 레퍼런스는 별개입니다. **대화만으로 자동 저장하지 않으며**, 클라이언트가 파일을 등록하고 MCP를 재시작해야 합니다. JSON과 보고서는 npm 배포 대상이므로 비공개 원문을 넣지 않습니다.

**앞으로 사용자가 제공하는 예시는 마음에 드는 디자인으로 받아들입니다.** 색감·레이아웃·폰트를 분리해 선호 레퍼런스로 축적하고, 이후 디자인에서 관련 기록과 반복되는 특징을 활용합니다. 전체 디자인 선호는 확인된 사실로, AI가 추론한 요소별 선호 이유·공통 경향은 해석으로 구분합니다. 비선호·비교용 등 별도 설명은 우선하며 AI가 고른 연구 시안까지 사용자 승인으로 확대하지 않습니다.

## 모든 프로젝트에 항상 적용하는 AI 티 방지 규칙

**[AI 티가 나지 않는 디자인을 위한 공통 규칙](./content/design-cautions.md)은 선택적 참고 자료가 아니라 모든 프로젝트의 디자인 요소에 항상 적용하는 작업 기준입니다.** 신규·기존, 웹·앱을 가리지 않고 화면·컴포넌트·그래픽·모션의 선택부터 수정·검수까지 적용합니다. 박스형 디자인, 박스 좌측의 세로줄 포인트, 장식용 대각선 화살표의 장식적 사용을 금지합니다. 기계적인 카드 세 칸, 의미 없는 영문 슬로건·배지, 습관적인 효과 등 요소별 규칙과 대안·검수 기준도 정리했습니다.

구조체·사물·인물을 시각적 피사체로 배치할 때는 [실사 피사체 제작 지침](./content/design-cautions.md#실사-피사체-제작과-디자인-취향)에 따라 Blender 또는 WebGL로 제작합니다. 이 제작 기준은 사용자 명시 지침이며, 레퍼런스에서 추론한 취향과 구분합니다.

다른 프로젝트에서 사용할 때도 **주의 문서 → 대상 프로젝트 조사 → 검색 → 선택적 적용 → 실제 화면 검수** 순서를 따릅니다. MCP 리소스 URI는 `design://design-cautions`입니다.

- 서버 초기 안내에 선행 열람·적용을 명시합니다.
- 모든 도구는 결과의 첫 필드 `designCautions`로 주의 문서 전문을 제공합니다. 개별 패턴·시각 예제·적용 계획·누적 분석부터 요청해도 포함됩니다.
- 모든 리소스 조회는 `contents[0]`에 주의 문서를, `contents[1]`에 요청한 원본을 반환합니다. 주의 문서 자체 조회는 한 항목입니다. 원본 JSON·Markdown·HTML은 변경하지 않으며, 파일 저장 시 요청한 URI의 항목을 선택합니다.
- 신규·기존 작업 프롬프트에서도 주의 문서 전문이 작업 지시보다 먼저 나옵니다.

서버가 문서를 먼저 전달하는 것은 보장하지만, 연결된 AI의 실제 이해·준수나 대상 화면 검수까지 강제하지는 않습니다. 기존 예제가 금지 패턴을 포함하더라도 새 디자인에 그대로 복제할 근거가 되지 않습니다.

## 디자인 메모

너무 반듯한 소개 페이지보다는 작업 노트에 가깝게.

![한국어 글자와 간격 표본 옆에 수정 메모를 둔 화면. 같은 크기의 카드나 영문 슬로건 없이 구성했다.](./designs/shared/assets/aesthetic-preview.png)

영문 슬로건과 세 칸짜리 원칙은 뺐다. 한국어 글자, 간격 표본, 옆에 붙인 메모로 다시 만들었다. 배치를 조금 풀되 읽는 순서는 유지했다.

[HTML/CSS 소스](./designs/editorial/aesthetic.html)를 내려받아 브라우저에서 열 수 있다. 외부 폰트나 스크립트는 쓰지 않았다. GitHub README에서는 CSS가 적용되지 않아 PNG로 올렸다.

색과 서체는 아직 시안이다. 라이브러리 전체의 스타일을 정한 것은 아니다. 페이지를 수정하면 1440px 너비에서 전체를 캡처해 미리보기도 갱신한다.

[느린 서가 / 독립서점 시안](./designs/spatial/slow-bookshop.html)은 공간을 주제로 한 가상의 월간 도서 큐레이션 화면이다. 종이색·와인색 지면에서 큰 `Seoga.` 제호 앞에 두 권의 사진집을 겹쳤다. 직접 그린 SVG 목업에 책등·종이 단면·접촉 그림자를 표현하고, 기존 판스워스 하우스 사진을 표지와 본문에 사용했다. HTML 안에 CSS를 포함하며 `designs/shared/assets/reference-farnsworth-house.jpg`를 함께 보관한다. 사진 출처·CC BY-SA 4.0·편집 고지는 화면 하단에 있다. 외부 폰트·스크립트 없이 열리고 책 소개는 키보드로 펼칠 수 있다. 실제 매장·판매 도서가 아니며 MCP 시각 예제에 등록되며 186개 패턴과 별도로 집계한다.

[극장 여운 / 심야 영화관 시안](./designs/spatial/midnight-cinema.html)은 가상의 단관극장이 여는 11월 토요일 심야 상영 안내 화면이다. 오른쪽 계단 통로 맨 위에서 본 객석을 SVG로 직접 그렸다. 영사기 빛과 먼지, 스크린 빛에 가장자리만 밝은 좌석과 뒷머리, 호박색 통로등, 초록 비상구 표시등까지 실제 상영관의 광원만으로 화면을 밝힌다. 영화 제목은 스크린 안에 놓인다. `객석 조명` 스위치를 켜면 CSS `@property`와 `:has()`만으로 막이 닫히고 벽등이 켜진다. 상영작 목록, 좌석 배치도, 1분 단위 장면 색 띠로 만든 조명 시간표가 이어진다. HTML 하나에 CSS와 SVG를 모두 담았고 외부 이미지·폰트·스크립트를 쓰지 않는다. 극장·영화·감독·일정은 모두 가상이며 MCP 시각 예제에 등록되며 186개 패턴과 별도로 집계한다.

[극장 여운 3D 시안](./designs/spatial/midnight-cinema-3d.html)은 같은 화면의 객석 장면을 three.js r187(MIT)로 다시 만든 비교 시안이다. 스크린을 면광원으로 두고 영사 방향 스포트라이트의 그림자로 좌석과 뒷머리가 실제로 가려지게 했다. 영사기 빛은 필름 색을 따라 연기 속을 레이마칭한다. 제공된 실제 극장 사진을 참고해 좌석의 두툼한 패딩·봉제선, 천으로 감싼 팔걸이와 컵홀더, 직물의 미세 요철과 부분별 거칠기, 마모된 통로 카펫과 황동 테두리를 보완했다. 사진 자체는 포함하지 않고 재질 맵을 코드로 생성한다. 벨벳의 결 반사와 포인터를 따라 움직이는 시차도 있다. 객석 조명 스위치는 막과 조명을 실시간으로 바꾼다. 프레임이 밀리면 해상도를 자동으로 낮추고, 동작 줄이기 설정에서는 정지 화면만 그린다. WebGL2를 쓸 수 없으면 SVG 그림을 그대로 보여 준다. three.js를 HTML 안에 넣어 약 1MB이며 외부 요청은 없다.

[강한 색감의 화면 예시](./designs/posters/high-energy.html)도 따로 만들었다. 가상의 야간 러닝 이벤트를 주황·먹색·라임, 큰 숫자와 트랙 그래픽으로 구성한 HTML/CSS 페이지다. 실제 모집 페이지는 아니다.

색에 따른 분위기를 비교하려면 [색 조합 문서](./designs/palettes/color-combinations.md)와 [HTML 비교 화면](./designs/palettes/color-combinations.html)을 보면 된다. 같은 화면에 여덟 가지 팔레트를 적용했고 색 코드·용도·주의점을 함께 적었다. 186개 패턴과 별도로 집계하는 MCP 시각 예제다.

[분위기별 화면 모음](./designs/palettes/mood-examples.html)에는 독서·음악·여행·전시·작업 도구·카페 예시를 추가했다. 각 화면에서 세 가지 배색을 선택할 수 있다. [추가 배색 18가지](./designs/palettes/mood-examples.md)를 포함해 총 26가지 색 조합을 비교한다.

### ASCII 캐릭터 시안

[작은 방랑자](./designs/characters/ascii-character.html)는 후드·망토·등불을 가진 오리지널 캐릭터를 WebGL 2로 생성하는 웹 시안입니다. 낮은 해상도로 입체 형태를 그린 다음, 밝기별로 정렬한 실제 ASCII 문자 아틀라스로 변환합니다. 대기·제자리 걷기, 드래그·방향키 회전, 문자 크기, 백색·인광 색상, 비와 일시정지를 조절할 수 있습니다. 외부 이미지·모델·CDN 의존성은 없으며 기존 시안과 분리되어 있습니다.

저장소 루트에서 `python3 -m http.server 4173 --bind 127.0.0.1` 실행 후 `http://127.0.0.1:4173/ascii-character.html`을 엽니다. ES 모듈을 사용하므로 `file://` 대신 HTTP로 열어야 합니다. WebGL 2 미지원·셰이더 오류·그래픽 연결 해제는 화면에 표시합니다. OS 동작 줄이기 설정에서는 정지 화면으로 시작하며, 숨겨진 탭에서는 렌더링을 멈춥니다. 관련 단위 테스트는 `node --test test/ascii-character.test.mjs`로 실행합니다.

## 제공 범위

[검정 미니멀 예시](./designs/editorial/black-minimal.html)는 검정·차콜·회색의 파일 보관함 화면이다. 검색·파일 선택·페이지 내 고정이 작동하며 실제 파일 접근이나 영구 저장은 없다. MCP에서는 `get_design_visual`의 `id=black-minimal`로 조회한다.

[검정 포스터형 시안](./designs/editorial/black-editorial.html)은 공유한 레퍼런스의 큰 번호·얇은 타이포·수평 구획·붉은 빛을 참고해 별도로 만들었다. 작업 설명은 아코디언으로 열 수 있다. 220–480ms의 진입·펼침, 작은 호버 이동, 마우스에 반응하는 빛(가로 최대 14px·세로 10px)을 적용했다. 상단에서 효과를 끌 수 있고 OS 모션 감소 설정을 우선하며, 숨겨진 탭에서는 중지한다. 반복 재생·스크롤 강제 이동은 없으며 JavaScript 없이도 내용과 아코디언을 사용할 수 있다. 원본 자산이나 문구를 복제하지 않은 가상 포트폴리오이며 MCP ID는 `black-editorial`이다.

[스포츠 사진 콜라주](./designs/posters/sports-collage.html)는 흰 여백·가로 사진 구획·얼굴 확대·프레임을 넘는 인물을 조합한 가상 지면이다. CC0 사진과 수동 SVG 윤곽을 사용하며 대각선 화살표는 없다. 참고 원본은 권한 미확인으로 링크만 기록했다. [사진 출처·사용 조건](./designs/posters/sports-collage.md)을 확인하고 HTML과 `designs/shared/assets/sports-soccer-cc0.jpg`를 함께 보관한다. MCP ID는 `sports-collage`이며 사진 바이너리는 HTML 조회로 전달하지 않는다.

[복싱 레퍼런스별 시안](./designs/posters/boxing-references.md)은 [위에서 본 링](./designs/posters/boxing-overhead.html), [종이 질감 포스터](./designs/posters/boxing-vintage.html), [조명 아래 뒷모습](./designs/posters/boxing-arena.html) 세 가지다. 각 링크의 구성·색을 독자적인 SVG 일러스트로 해석했다. 외부 자산·원본 사진·대각선 화살표 없이 열린다. MCP ID는 `boxing-overhead`, `boxing-vintage`, `boxing-arena`이다.

[레퍼런스 10개 분석과 네 가지 시안](./designs/references/reference-studies.md)은 초기의 느슨한 조합을 수정해 각 주 기준의 활자 크기·이미지 비율·위치·중첩을 더 가깝게 맞췄다. [Forma / 건축](./designs/references/reference-house.html), [담 / 조명](./designs/references/reference-object.html), [Fold / 편집](./designs/references/reference-exhibition.html), [후반전 / 스포츠](./designs/references/reference-sport.html)를 상단 링크로 오가며 비교한다. Fold는 공개 SwissBrut에서 확인한 Be Vietnam Pro 900을 포함하며 다른 원본 서체는 미확인이다. CSS·SVG는 HTML 내부에 있고 사진·폰트는 패키지의 상대 경로 자산을 사용한다. MCP ID는 각각 `reference-house`, `reference-object`, `reference-exhibition`, `reference-sport`다. 핀의 사진·브랜드·문구를 복제한 동일본이 아니며 분석을 사용자의 확정 취향으로 간주하지 않는다. [원본과의 차이·자산별 라이선스](./designs/references/reference-studies.md#assets)를 확인한다.

화면 효과는 [HTML 갤러리](./designs/effects/screen-effects.html)에서 32개를 직접 실행·초기화·정지하며 비교할 수 있다. [효과 목록 문서](./designs/effects/screen-effects.md)에는 기존 패턴 연결, 보충한 효과 종류, 웹에서 재현하지 않은 네이티브·3D 항목의 한계도 적었다. 아래 MCP 집계와는 별도의 문서용 자료다.

- **36개 카테고리, 186개 패턴**: 범용 지침 22개 카테고리·138개 패턴 + 기존 WEASHION 14개 카테고리·48개 패턴.
- 기존 원본 코드 블록 **57개 보존** + 대표 패턴 10종의 **SwiftUI 10개·웹 10개 예제**.
- 한국어·영어 키워드 검색, 카테고리·출처·플랫폼별 예제 유무 필터와 페이지 단위 조회.
- 패턴별 범용 원칙, 플랫폼별 적용 지침, 원본 의존성·구현 상태·주의사항·검증 기준.
- 신규 프로젝트 설계와 기존 프로젝트 개선을 구분한 적용 가이드.
- MCP Tools **13개**, Prompts **3개**. 패턴·가이드·시안·기술·플랫폼·소스·누적 분석·취향 프로필 리소스를 제공하며 원문 리소스 수는 로컬 전용 파일 가용성과 분석 기록 수에 따라 다릅니다.
- 별도 시각 예시 **21종**: 기존 15종에 서점·극장 SVG/3D·ASCII 캐릭터·광학 유리·로컬 전용 생일 분석을 추가했습니다. `search_design_visuals`와 `get_design_visual`로 유형·기술·자산을 조회합니다.
- 원본 저장소나 개발자 컴퓨터의 절대 경로가 필요 없는 패키지.
- 런타임 외부 API·LLM·검색 서비스·벡터 DB·API 키 없이 로컬 실행.

**이 서버는 대상 프로젝트를 읽거나 수정하지 않습니다.** 연결된 AI가 대상 코드를 조사하고, 지침을 선택적으로 적용하고, 테스트합니다. MCP가 반환한 계획은 실제 분석·수정·검증 완료를 의미하지 않습니다.

전체 범용 카테고리와 대표 예제 목록은 [범용 라이브러리 안내](./docs/general-library.md)에 있습니다. 모든 디자인을 망라한 사전이나 완제품 UI 킷은 아닙니다. 패턴별로 **사용·피해야 할 상황, 구조, SwiftUI/웹 적용, 접근성, 검증, 주의사항**을 제공합니다.

### SwiftUI와 웹의 차이

| 대상 | 제공하는 것 | 제공하지 않는 것 |
| --- | --- | --- |
| `swiftui` | 전체 원칙·지침, 선택한 범용 예제, 기존 프로젝트 발췌 | 완제품 컴포넌트 킷, iOS 앱·실기기 실행 보장 |
| `web` | 전체 원칙·지침, 선택한 HTML/CSS/JavaScript 예제 | React/Next.js 통합, SwiftUI 자동 변환 (독립 Three.js 시안은 별도 제공) |
| `agnostic` | 플랫폼에 종속되지 않은 원칙과 검증 기준 | 플랫폼 공통 실행 코드 |

예를 들어 **700pt는 원본 프로젝트의 열 전환 기준**이지 모든 앱이나 웹에서 사용할 규칙이 아닙니다. 대상의 콘텐츠, 글씨 크기, 기존 토큰과 테스트를 기준으로 다시 결정합니다. 버건디·서체·타이밍·브랜드 자산도 강제하지 않습니다.

## 빠른 시작

Node.js **22 이상**과 npm이 필요합니다.

```bash
npm ci
npm test
```

테스트 과정에서 빌드도 수행합니다. 개발 시에는 다음 명령을 개별 실행할 수 있습니다.

```bash
npm run build
npm run typecheck
```

MCP 실행 진입점은 빌드된 `dist/index.js`입니다. 터미널에서 직접 실행하면 stdin/stdout 프로토콜 요청을 기다리므로 일반 CLI처럼 결과를 바로 출력하지 않습니다. **MCP 클라이언트가 프로세스를 실행하도록 연결**합니다.

`npm start`도 개발용으로 사용할 수 있지만, MCP 설정에는 npm의 부가 출력을 피할 수 있는 `node` 진입점 또는 설치된 `design-mcp` 명령을 권장합니다.

## 여러 프로젝트에서 사용하기

### 권장: 패키지 한 번 설치 후 사용자 범위에 등록

이 방식은 각 프로젝트에 DESIGN이나 WEASHION을 복사하지 않아도 됩니다.

1. 이 저장소에서 패키지의 설치·실행까지 검증합니다.

   ```bash
   npm run verify:package
   ```

   생성 결과는 `acertainromance401-design-mcp-0.4.0.tgz`입니다. 별도 임시 디렉터리에 설치한 뒤 실제 stdio MCP 요청으로 범용 웹 예제와 20개 공개 시안의 HTML·JS와 생일 분석 조회까지 확인합니다. 임시 설치는 검증 후 정리합니다.

2. 검증한 패키지를 한 번 설치합니다. 경로는 실제 생성 위치로 바꿉니다.

   ```bash
   npm install --global /absolute/path/to/acertainromance401-design-mcp-0.4.0.tgz
   ```

3. VS Code 명령 팔레트에서 **MCP: Add Server → Command (stdio)**를 선택하고 `design-mcp`를 등록합니다. 현재 VS Code에서 제공하는 **Global/사용자 범위** 저장 위치를 선택하면 여러 프로젝트에서 공유할 수 있습니다.

4. 서버 시작·신뢰 확인 후 도구 목록에서 `list_design_categories`를 호출해 36개 카테고리와 출처별 패턴 수(WEASHION 48, 범용 138)가 반환되는지 확인합니다.

이 패키지는 **npm 레지스트리에 게시하지 않았습니다.** 아직 공개 패키지명을 이용한 `npx` 설치를 전제로 하지 않습니다. 위 tarball을 다른 컴퓨터에 전달해 설치할 수 있으며, 최초 설치에는 선언된 npm 의존성을 받기 위한 네트워크 연결이 필요할 수 있습니다. 서버 실행 중에는 네트워크를 사용하지 않습니다.

전역 설치 명령을 VS Code가 찾지 못하면 GUI 프로세스의 PATH를 확인하거나 아래의 직접 실행 방식을 사용합니다. 패키지를 교체한 뒤에는 MCP 서버를 재시작합니다.

### 개발용: 로컬 빌드를 직접 연결

VS Code의 사용자 범위 MCP 설정 또는 대상 프로젝트의 `.vscode/mcp.json`에 추가할 수 있습니다. 기존 설정이 있으면 `servers` 항목을 병합하고 덮어쓰지 않습니다.

```json
{
  "servers": {
    "design": {
      "type": "stdio",
      "command": "node",
      "args": ["/absolute/path/to/DESIGN/dist/index.js"]
    }
  }
}
```

이 경로는 **DESIGN의 빌드 진입점**이며 WEASHION의 경로가 아닙니다. 작업 디렉터리가 어떤 프로젝트이든 지식은 패키지 위치를 기준으로 읽습니다.

- VS Code 입력 변수 방식: [설정 예제](./examples/vscode-mcp.json)
- `mcpServers` 형식을 사용하는 다른 클라이언트: [일반 클라이언트 예제](./examples/generic-mcp.json)

다른 클라이언트에서는 해당 제품이 요구하는 MCP 설정 형식에 맞춥니다. 서버는 표준 stdio MCP를 사용하며 특정 AI 서비스에 종속되지 않습니다.

## 도구 계약

### 시각 예시 조회 (0.3.0 추가)

기존 패턴 검색과 구분해 모든 시안·효과 갤러리를 조회합니다. `list_design_categories`의 `visualExamples`와 `design://visual-examples`에서 21종의 ID·유형·기술·리소스 URI·원문 가용성을 확인합니다. `family`, `technology`, `platform` 필터는 이식 가이드 탐색용이며 네이티브 코드 유무 필터가 아닙니다.

```json
{"query":"배색 카페","limit":5,"offset":0}
```

위 인자로 `search_design_visuals`를 호출합니다. `query`는 공백 제외 1~200자, `limit`은 1~10(기본 5), `offset`은 0~1000입니다. 결과는 `total`, `nextOffset`, `results`이며 메타데이터와 문서의 결정적 키워드 검색입니다. HTML 전체는 검색 결과에 넣지 않습니다.

```json
{"id":"screen-effects","includeSource":true}
```

위 인자로 `get_design_visual`을 호출합니다. 기본 `includeSource=false`는 요약·한계·문서·리소스 링크만 반환하며, `true`는 HTML/CSS/JavaScript 소스를 추가합니다. 지원 ID는 `boxing-overhead`, `boxing-vintage`, `boxing-arena`, `sports-collage`, `black-editorial`, `black-minimal`, `aesthetic-notes`, `high-energy`, `color-combinations`, `mood-examples`, `screen-effects`입니다. 스포츠 콜라주는 패키지에 포함된 사진 파일도 함께 필요합니다.

`htmlUri`와 `guideUri`는 `design://visual-files/<파일명>` 리소스입니다. 문서의 로컬 링크는 등록된 시각 파일 리소스 또는 원본 GitHub 링크로 변환됩니다. **MCP는 HTML 텍스트를 반환할 뿐 실행·렌더링하지 않습니다.** 브라우저에서 보려면 HTML을 파일로 저장해 엽니다. HTML 내부의 상대 문서 링크까지 사용할 때는 원본 저장소 구조를 유지하거나 MCP의 문서 리소스로 조회합니다.

로컬 빌드를 사용하는 MCP는 빌드 후 재시작합니다. 설치된 패키지를 사용하는 MCP는 0.4.0 tarball로 교체한 뒤 재시작합니다. 이 시각 예시는 웹 데모이며 네이티브 앱 컴포넌트나 햅틱·실기기 품질 보장이 아닙니다.

### `list_design_categories`

입력은 빈 객체 `{}`입니다. 카테고리 ID·제목·키워드·패턴 수·`sourceKind`·리소스 URI, `sources`와 `sourceCounts`를 반환합니다. 기존 `source` 필드는 WEASHION 기준을 유지합니다. 전체 문서와 코드를 한 번에 반환하지 않습니다.

### `search_design_patterns`

```json
{
  "query": "모달 dialog",
  "category": "overlays",
  "platform": "web",
  "source": "general",
  "hasExample": true,
  "limit": 4,
  "offset": 0
}
```

- `query`: 공백 제외 1~200자. 짧은 한국어·영어 키워드를 권장합니다.
- `category`: 선택한 카테고리 ID. 생략하면 전체에서 찾습니다.
- `platform`: `swiftui` / `web` / `agnostic`. 기본 `swiftui`.
- `source`: `all`(기본) / `weashion` / `general`. 기존 참조만 필요하면 `weashion`.
- `hasExample`: 선택 사항. `true`는 선택한 플랫폼의 코드가 실제 있는 패턴만, `false`는 없는 패턴만 조회합니다. `agnostic`에는 실행 예제가 없습니다.
- `limit`: 1~10, 기본 6. `offset`: 0~1000, 기본 0.
- 결과: `results`, `total`, `offset`, `nextOffset`. 각 결과는 안정적인 `id`, 원칙, 출처 종류, 구현 상태, 예제 유무와 URI를 포함합니다. 모든 필터는 정렬·페이지 분할 전에 적용됩니다.

검색은 **가중 키워드 검색**입니다. ID·제목·패턴 키워드, 원칙·카테고리, 본문 순으로 가중치를 부여하고 하나 이상의 단어가 일치하는 결과를 정렬합니다. 벡터·의미 검색이나 신뢰도 점수가 아닙니다. 무관한 요청에는 빈 결과를 반환하며 임의 패턴으로 대체하지 않습니다.

### `get_design_pattern`

```json
{
  "id": "overlay.modal-dialog",
  "platform": "web",
  "includeSourceExample": true
}
```

- `id`: 검색으로 찾은 패턴 ID. 원문 번호나 파일 위치가 바뀌어도 ID는 가능한 한 유지합니다.
- `includeSourceExample`: 기본 `false`. 요약·원칙·의존성·검증 기준만 먼저 조회해 컨텍스트를 줄입니다.
- 범용 패턴은 `guidance`에 사용·회피 조건, 구조, 접근성, 관련 패턴을 제공합니다.
- `true`이면 선택한 플랫폼의 범용 예제가 있을 때 코드를 제공합니다. `example`에는 요구사항·검증 수준·한계가 표시됩니다.
- WEASHION 발췌는 기존처럼 SwiftUI 대상으로만 제공합니다. 웹 코드로 이름을 바꾸지 않습니다.
- `agnostic` 또는 해당 플랫폼 예제가 없는 패턴은 코드를 생략하고 `sourceExampleNotice`에 이유를 명시합니다.

WEASHION의 `sourceImplementationStatus`는 `documented`, `documented-with-limitations`, `defined-not-connected`, `reference`, `inventory` 중 하나입니다. **원문이 기록한 상태**이지 앱을 새로 실행해 확인한 상태가 아닙니다. 범용 패턴은 `guidance`이며 예제의 유무·검증 수준은 별도 필드입니다.

원본 08번의 문자 교체는 `defined-not-connected`로, 접근성 분기 한계가 있는 실행 스플래시는 `documented-with-limitations`로 구분합니다. 코드를 복사하기 전에 `sourceDependencies`, `cautions`, `validationChecklist`를 확인합니다.

### `create_design_adoption_plan`

```json
{
  "objective": "기존 앱에서 큰 글씨와 좁은 화면의 배치를 개선",
  "projectType": "existing",
  "platform": "swiftui",
  "patternIds": ["layout.content-width", "input.focus-and-validation"]
}
```

- `objective`: 공백 제외 1~1000자.
- `projectType`: `new` 또는 `existing`.
- `patternIds`: 선택 사항, 최대 8개. 검색 후 명시적으로 선택하는 방식을 권장합니다.
- `categoryIds`: 선택 사항, 최대 6개. 명시한 패턴과 충돌하면 오류입니다.
- `source`: 검색과 같은 출처 필터. 명시한 `patternIds`와 충돌하면 `SOURCE_CONFLICT` 오류입니다.
- 패턴 ID를 생략하면 목적 전체를 키워드 검색한 뒤 카테고리 필터 내 최대 6개를 선택합니다.
- 결과가 없으면 명시적 오류를 반환합니다. 다른 카테고리의 패턴을 임의로 넣지 않습니다.

기존 프로젝트는 **현재 토큰·컴포넌트·상태·테스트와 사용자 변경 조사 → 보존할 동작 확인 → 선택적 매핑 → 구현·검증** 순서를 따릅니다. 신규 프로젝트는 먼저 화면 목적·주요 행동·최소 플랫폼·접근성을 정합니다.

모든 도구는 읽기 전용이며, 결과는 MCP 텍스트와 `structuredContent`로 제공합니다. 잘못된 입력은 스키마 오류로, 알 수 없는 패턴·카테고리나 충돌은 `isError: true`와 오류 코드로 전달합니다.

## 실제 요청 예

연결한 AI에 다음과 같이 요청합니다.

**새 SwiftUI 프로젝트**

> DESIGN MCP에서 색상·서체·반응형 패턴을 찾아줘. 내 앱 목적에 맞게 원칙을 선택하고 신규 프로젝트 적용 가이드를 만든 뒤 구현해줘. WEASHION의 색상과 700pt를 그대로 강제하지 말고 접근성 테스트도 해줘.

**기존 SwiftUI 프로젝트**

> 기존 컴포넌트와 토큰을 먼저 확인해줘. DESIGN MCP의 입력 오류·저장 피드백 패턴을 참고하되 기존 동작을 유지하면서 개선하고 실제 성공·실패·취소 상태를 검증해줘.

**웹 프로젝트**

> DESIGN MCP에서 source=general, platform=web으로 반응형과 모션을 찾아줘. 실제 코드가 필요하면 hasExample=true로 검색하고 선택한 예제의 요구사항과 한계를 확인해줘. 우리 프로젝트의 컴포넌트 체계를 유지하면서 키보드 접근·확대·동작 줄이기를 검증해줘.

MCP 연결만으로 자동 적용을 보장하지는 않습니다. 클라이언트에서 서버와 도구가 활성화돼 있어야 하며, 실제 도구 호출과 프로젝트 변경은 연결된 AI가 수행합니다.

## Resources와 Prompts

| 종류 | 이름·URI | 용도 |
| --- | --- | --- |
| 필수 주의 문서 | `design://design-cautions` | 모든 디자인 조회·적용보다 먼저 읽는 금지 패턴·경계 사항·검수 기준 |
| 카탈로그 | `design://catalog` | 요약·카테고리·재사용 계약 |
| 패턴 186개 | `design://patterns/{id}` | 기본 SwiftUI 대상 상세·참조·해당 예제 |
| 기존 문서 15개 | `design://guides/{category}` 및 `design://guides/README` | 원본 상세 문서 스냅샷 |
| 범용 가이드 22개 | `design://guides/general-{category}` | 범용 패턴 전체의 사용 조건·구조·접근성·검증 |
| 시각 예시 인덱스 | `design://visual-examples` | 시각 예시 21종의 유형·기술·플랫폼·원문 가용성 |
| 시각 파일 최대 27개 | `design://visual-files/{filename}` | HTML 21개와 동반 문서 6개. 생일 원문은 로컬에서만 제공 |
| 재사용 분석 | `design://reuse-catalog` | 유형·기술·플랫폼·구현 위치·자산 배포 정책 |
| 유형·기술·플랫폼 | `design://families/{id}`, `design://technologies/{id}`, `design://platforms/{id}` | 목적별/기술별/대상별 탐색 |
| 개별 소스 | `design://source-files/{path}` | 허용 목록의 HTML·JS·동반 문서. 바이너리/임의 파일은 반환하지 않음 |
| 신규 프롬프트 | `start_design_project` | `objective`, 선택적 `platform`을 받아 조회→적용→검증 흐름 제공 |
| 기존 프롬프트 | `update_project_design` | 기존 동작과 디자인 시스템을 보존하는 개선 흐름 제공 |
| 시안 이식 프롬프트 | `adopt_visual_design` | `objective`, 8개 대상 `platform`, `projectType`으로 기술·자산·이식 계획 탐색 |

패턴 리소스의 기본 대상은 SwiftUI이며 플랫폼 자동 변환본이 아닙니다. 웹 예제는 `get_design_pattern`에 `platform=web`을 지정해 조회합니다.

가이드의 `design://` 링크는 브라우저 웹 주소가 아니라 **MCP 리소스 URI**입니다. `WEASHION:weashion/Views/...#L224` 표기는 원본 저장소 내부의 출처 식별자이며 이 컴퓨터에 파일이 있다는 뜻이 아닙니다.

## 지식 구성과 원문 갱신

| 파일·폴더 | 책임 |
| --- | --- |
| [content/design-cautions.md](./content/design-cautions.md) | 모든 조회에서 먼저 전달하는 디자인 작업 기준 |
| [content/manifest.json](./content/manifest.json) | 안정적인 패턴 ID, 공통 원칙, 플랫폼 적용 지침, 의존성과 한계 |
| [content/guides/](./content/guides/) | 15개 상세 문서의 독립 사용 가능한 스냅샷 |
| [content/provenance.json](./content/provenance.json) | 원문·패키지 문서·코드 블록의 SHA-256과 기준 정보 |
| [content/library/](./content/library/) | 범용 카테고리 22개와 패턴별 상세 지침 |
| [content/examples/](./content/examples/) | 범용 대표 패턴 10종의 SwiftUI/HTML 코드 |
| [src/library.ts](./src/library.ts) | 범용 스키마·예제 플랫폼·경로·중복 검증과 가이드 렌더링 |
| [src/catalog.ts](./src/catalog.ts) | 검증·색인·검색·패턴·적용 가이드 |
| [src/server.ts](./src/server.ts) | 도구·리소스·프롬프트 등록 |
| [content/design-reuse.json](./content/design-reuse.json) | 시안별 기술 사용·유형·자산 권리·플랫폼 이식 데이터 |
| [src/reuse.ts](./src/reuse.ts) | 재사용 데이터의 타입·경로·참조 검증 |
| [designs/](./designs/) | 유형별 시안 원본·동반 문서·공유 자산 |
| [src/visuals.ts](./src/visuals.ts) | 별도 시각 예시 등록·파일 검증·검색·소스와 문서 조회 |
| [scripts/import-guides.mjs](./scripts/import-guides.mjs) | 명시적으로 선택한 원본 문서에서 스냅샷 재생성 |
| [test/](./test/) | 데이터 보존·오류·플랫폼 구분·실제 MCP 통신 검증 |

초기 원문 기준은 **2026-11-02 WEASHION 작업 트리 설명**입니다. 특정 커밋이나 실기기 검수 결과로 표시하지 않습니다. 서버 시작 시 내용 해시·코드 블록·항목 대응을 검증하며 불일치하면 오류로 종료합니다.

원문 변경을 반영할 때만 개발자가 명시적으로 실행합니다. 서버 사용자는 원본을 설치할 필요가 없습니다.

```bash
npm run import:guides -- /absolute/path/to/Weashion/docs/ui-ux-code-guide
npm test
npm run verify:package
```

가져오기 과정은 상대 문서 링크를 MCP URI로 바꾸고, 원본 코드·리소스 경로를 출처 식별자로 바꿉니다. 이미지 미리보기는 자산을 복제하지 않고 미포함 표시와 출처로 바꿉니다. **Swift·SVG 코드 블록 내용은 그대로 보존**합니다.

현재 가져오기는 선언된 48개 항목·57개 코드 블록을 가진 기준 문서를 대상으로 합니다. 원문 항목·코드 수를 변경할 때는 가져오기 검증 조건과 테스트를 검토하고, 패턴 메타데이터·출처 기준·패키지 버전을 함께 갱신합니다. 자동 실시간 동기화나 앱 소스 검증은 하지 않습니다.

범용 지침은 [라이브러리 인덱스](./content/library/index.json)의 별도 기준과 원문 링크를 사용합니다. WEASHION 해시 목록에 범용 문서를 섞지 않습니다. 범용 JSON은 엄격한 스키마·ID 중복·관련 패턴·예제 경로·파일과 플랫폼의 대응을 검사하지만, 원본 스냅샷처럼 별도의 SHA-256 목록을 제공하지는 않습니다.

범용 지침/예제의 추가·갱신 절차는 [라이브러리 확장 안내](./docs/general-library.md#라이브러리-확장)에 있습니다. 예제를 추가할 때는 실제 코드와 요구사항·검증·한계를 함께 기록하고 실행 검증을 수행합니다.

### 포함하지 않는 것

- 원본 앱 전체 소스, 이미지·로고·서체 파일, 3D 메시와 상품 리소스.
- API 키, 대상 프로젝트 경로, 파일 수정 기능.
- 원격 HTTP 서버, 인증·멀티테넌트 서비스, npm 레지스트리 게시.
- 모든 스니펫의 독립 실행 보장, 브랜드 정답 사이즈·실기기 품질·FPS 보장.

외부 디자인 레퍼런스와 원본 자산을 사용할 권리는 별도로 확인해야 합니다. 별도 시각 스터디에는 명시적으로 허용된 자산만 포함합니다. [자산별 출처·사용 조건](./designs/references/reference-studies.md#assets)의 판스워스 하우스 사진 및 그 편집 표현은 **CC BY-SA 4.0**, Be Vietnam Pro 폰트는 **SIL OFL 1.1**, 축구 사진은 **CC0**입니다. 이 자산들에 저장소의 MIT 라이선스를 대신 적용하지 않습니다.

## 검증

```bash
npm test
npm run verify:swift
npm run verify:package
```

- 기존 14개 카테고리·48개 패턴·57개 코드 블록 보존과 출처 무결성.
- 전체 36개 카테고리·186개 패턴, 범용 지침·예제 20개와 별도 시안 21종·기술 14개·플랫폼 8개. 리소스 수는 로컬 전용 원문 가용성에 따라 다릅니다.
- 모든 내부 MCP 링크, 한국어·영어 검색, 필터·페이지·입력 한계.
- 웹 응답의 실제 HTML 예제, 플랫폼 공통/예제 없는 패턴의 코드 생략, 출처·예제 유무 필터.
- 신규·기존 적용 흐름, 알 수 없는 ID·무관한 검색·카테고리 충돌 오류.
- 원본 문서가 없는 다른 작업 디렉터리에서 실제 stdio 초기화·도구·리소스·프롬프트 호출.
- tarball의 별도 설치 후 실제 MCP 조회. 개발 디렉터리의 `node_modules`나 작업 경로를 실행 경로로 사용하지 않음.

`npm test`는 빌드·카탈로그·JavaScript 구문·실제 MCP 프로토콜을 검사하며 브라우저 UI 테스트를 자동 실행하지는 않습니다. `verify:swift`는 macOS/Xcode에서만 실행합니다. 대표 HTML 10개는 통합 Chromium 브라우저에서 320/1280px, 주요 상태와 키보드, 동작 줄이기를 별도 검증했습니다. 상세 검증 범위는 [예제 검증 기록](./docs/general-library.md#예제-검증-범위)에 있습니다.

이 검증은 WEASHION 앱이나 적용 대상 앱의 빌드·UI 테스트를 실행한 결과가 아닙니다. iOS 실기기·Safari/Firefox·스크린리더 검수와 접근성 적합성 인증은 포함하지 않습니다.

## 별도 실험: 모바일 생일 페이지

[birthday.html](./designs/celebration/birthday.html)은 로컬 전용 정적 웹 시안입니다. 로컬 실행에는 이 HTML과 [생일 자산 폴더](./designs/celebration/assets/birthday/)를 함께 사용합니다. MCP에서 구현 분석·기술 이식 가이드를 조회할 수 있으나 개인 원문·모듈·자산은 npm 패키지에 포함하지 않습니다.

첫 화면·케이크·편지·엔딩·버튼의 글꼴은 모두 Pretendard Variable 1.3.9로 통일합니다. [로컬 WOFF2 글꼴](./designs/celebration/assets/birthday/fonts/pretendard-variable.woff2)을 미리 불러오고 `font-display: swap`을 사용하므로 외부 CDN 요청 없이 표시하며, 로딩 중에도 기본 글꼴로 내용을 읽을 수 있습니다. 원본은 [Pretendard 공식 배포본](https://github.com/orioncactus/pretendard/tree/v1.3.9)이며 [SIL Open Font License 1.1](./designs/celebration/assets/birthday/fonts/OFL.txt)을 함께 포함합니다.

공개 배포 주소는 **https://acertainromance401.github.io/DESIGN/** 입니다. GitHub Pages는 `gh-pages` 브랜치의 루트(`/`)를 사용하며, 이 브랜치에는 동일한 내용의 `index.html`·`birthday.html`, 실행에 필요한 `assets/birthday/`, `.nojekyll`만 게시합니다. `main`의 MCP 작업이나 원본 Blender 등 작업용 자료는 배포하지 않습니다. 생일 화면을 수정하면 `gh-pages`의 정적 사본도 갱신해야 합니다. 편지와 엔딩은 각각 `#letter`·`#ending` 직접 링크도 지원합니다.

```bash
python3 -m http.server 8000 --bind 127.0.0.1
# http://localhost:8000/birthday.html
```

시작 버튼을 누르면 모바일용 GLB와 로컬 Three.js 모듈을 불러옵니다. 촛불은 마이크 입김 감지 또는 터치 버튼으로 끌 수 있으며, 꺼진 뒤 컨페티와 다시 켜기 기능을 제공합니다. 마이크는 사용자 버튼과 권한 허용 후에만 켜고 소리를 저장·전송하지 않습니다. 화면을 벗어나거나 촛불을 끄면 마이크를 해제합니다. 마이크는 HTTPS(GitHub Pages) 또는 localhost가 필요하며, 권한 거부·미지원 환경에서도 터치 기능을 사용할 수 있습니다. `file://`로 직접 열면 브라우저의 모듈 보안 정책 때문에 3D 화면을 사용할 수 없습니다.

촛불이 켜지면 전체 배경을 어둡게 하고 각 촛불 위치의 따뜻한 점광원으로 케이크를 비춥니다. 배경의 빛 중심은 실제 촛불 투영 위치를 따라가며, 촛불을 끄면 약 1.1초 동안 배경과 3D 기본 조명이 원래 밝기로 돌아오면서 컨페티가 나옵니다. 다시 켜기·처음으로 이동·로딩 실패에서도 조명 상태를 함께 갱신하며, 동작 줄이기를 설정하면 밝기는 즉시 전환합니다.

제공받은 [생일 음악](./designs/celebration/assets/birthday/leberch-happy-birthday-581704.mp3)을 페이지 진입부터 자동·반복 재생하며, 별도의 끄기 버튼은 제공하지 않습니다. 진입 즉시 “휴대폰 소리를 키워 주세요” 팝업을 표시하고, 모바일 브라우저가 자동재생을 차단하면 **확인** 버튼을 누르는 동작에서 음악을 시작합니다. 첫 터치 또는 Enter/Space 조작도 지원하며, 다운로드 오류는 안내를 표시한 뒤 다음 터치에서 다시 시도합니다. 케이크 등장·촛불 끄기·다시 켜기·처음으로 이동할 때 음악을 재시작하지 않습니다. 마이크에는 음악의 스피커 피드백을 줄이도록 에코 제거를 요청하되 입김 감지를 위해 잡음 제거와 자동 게인은 끕니다. 실제 스피커·마이크 조합에 따른 감도는 실기기 확인이 필요합니다.

마이크 또는 터치로 촛불을 끄면 제공받은 [박수 효과음](./designs/celebration/assets/birthday/pwlpl-applause-sound-effect-521104.mp3)을 컨페티와 함께 한 번 재생합니다. 약 5초의 효과음은 반복하지 않으며 배경 음악은 계속 이어집니다. 모바일의 소리 재생 제한에 대비해 축하 시작 등의 버튼 조작에서 별도의 Web Audio 컨텍스트를 준비합니다. 다시 촛불을 켰다가 끄면 처음부터 재생하며, 다시 켜기·처음으로 이동·화면 숨김·3D 오류에서는 진행 중이거나 대기 중인 박수를 취소합니다. 동작 줄이기 설정은 박수 소리를 끄지 않습니다.

촛불을 끈 뒤 나타나는 **편지 읽기** 버튼은 별도의 편지 화면(`#letter`)으로 이동합니다. 새로고침 없는 화면 전환이므로 배경 음악과 재생 중인 박수는 이어지며, 편지 화면에서는 3D 렌더링을 멈춥니다. 케이크로 돌아가기(`#cake`)·처음으로·브라우저 뒤로/앞으로 이동과 직접 링크를 지원합니다. 제공된 세로 편지지는 비율을 유지해 표시하고 AVIF와 WebP 대체 이미지를 함께 제공합니다. 제공받은 편지 본문은 [birthday.html](./designs/celebration/birthday.html)의 `#letter-message` 안에 원문의 줄바꿈과 문단 구분을 유지해 넣었습니다. 긴 본문은 편지지 안에서 스크롤할 수 있습니다.

편지 아래의 **엔딩 보기** 버튼은 엔딩 화면(`#ending`)으로 이동합니다. 화면 전체를 검정으로 바꾸고 흰 글씨의 “남은 생일 잘 보내~~ 행복해~~~!!”와 그 아래의 [엔딩 사진](./designs/celebration/assets/birthday/ending-photo.jpg)을 한 묶음으로 약 8초 동안 아래에서 위로 올린 뒤 중앙에 남깁니다. 사진은 자르지 않고 원래 비율을 유지하며 화면 높이에 맞춰 표시하고, 메타데이터를 제거한 약 211 KiB의 로컬 JPEG를 사용합니다. 사진을 불러오지 못하면 재확인 안내를 표시합니다. 반복 재생하지 않으며, 동작 줄이기를 설정하면 글과 사진을 움직임 없이 바로 표시합니다. 배경 음악은 계속 이어지고, 편지로 돌아가기·처음으로·브라우저 탐색 시 배경색과 테마도 해당 화면에 맞게 복원됩니다.

모델은 Blender에서 2,094,270개 삼각형을 44,999개로 줄이고, 텍스처를 8K/4K/4K에서 2K/1K/1K로 축소한 약 2.4 MiB GLB입니다. [내보내기 측정값](./designs/celebration/assets/birthday/cake.meta.json)에 원본 해시와 실제 용량을 기록합니다. 216 MB 원본 Blender 파일은 수정하지 않으며 GitHub 업로드 제한 때문에 Git에서 제외합니다.

정적 배포에는 Node.js나 Blender가 필요하지 않습니다. 자산을 다시 만들 때만 다음 명령을 사용합니다. 모델 재생성에는 `reference/private/birthday/`의 원본 `.blend` 파일이 필요합니다.

```bash
npm run prepare:birthday
npm run prepare:birthday-model
node --test test/birthday.test.mjs
```

Blender 기본 경로는 `/Applications/Blender.app/Contents/MacOS/Blender`이며 다른 설치 경로는 `BLENDER_BIN` 환경 변수로 지정합니다. 라이브러리는 Three.js 0.180.0을 사용하며 [MIT 라이선스](./designs/celebration/assets/birthday/vendor/LICENSE)를 함께 둡니다. 카운트다운은 아직 추가하지 않았습니다.
