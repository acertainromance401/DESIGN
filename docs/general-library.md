# 범용 디자인 라이브러리

WEASHION에 사용됐는지와 무관하게 선택할 수 있는 설계 지침입니다. **22개 카테고리, 138개 패턴**이며 기존 프로젝트 참조 48개와 별도로 관리합니다. 모든 디자인의 완전한 목록이나 배포용 컴포넌트 제품은 아닙니다.

각 패턴은 한국어 설명과 한국어/영어 검색어, 원칙, 사용·회피 조건, 구조, SwiftUI/웹 적용, 접근성, 검증 항목, 주의사항을 갖습니다. 공식 Apple·W3C·MDN 문서를 참고하지만 해당 기관의 승인이나 적합성 인증을 뜻하지 않습니다. 브랜드 이미지·폰트·아이콘 패키지는 복제하지 않습니다.

## 카테고리별 범위

각 JSON 링크에서 패턴별 상세 지침을 볼 수 있습니다. MCP에서는 `list_design_categories`로 ID를 확인하고 `source=general`로 검색합니다. 시각 스타일은 12개, 나머지 카테고리는 각각 6개 패턴입니다.

| 카테고리 | 포함하는 설계 요소 |
| --- | --- |
| [설계 원리·토큰](../content/library/design-foundations.json) | 시각 위계, 의미 토큰, 간격, 밀도, 상태 계약, 점진 공개 |
| [색상·테마](../content/library/color-theming.json) | 테마 우선순위, 대비, 의미색, 데이터 팔레트, 반투명 재질, 브랜드 매핑 |
| [조판·콘텐츠](../content/library/type-content.json) | 유동 타입, 행 길이, 수치·단위, 말줄임, 마이크로카피, RTL·번역 |
| [반응형 구성](../content/library/responsive-systems.json) | 자동 그리드, 컨테이너 쿼리, 목록·상세, 키보드·안전 영역, 벤토, 고정 도구막대 |
| [내비게이션](../content/library/navigation-patterns.json) | 주요 목적지, 탭 패널, 사이드바, 브레드크럼, 직접 링크, 단계형 작업 |
| [오버레이](../content/library/overlays.json) | 모달, 하단 시트, 팝오버, 툴팁, 토스트, 파괴적 행동과 복원 |
| [폼·선택](../content/library/form-patterns.json) | 검증·오류 요약, 체크·라디오·스위치, 콤보박스, 슬라이더, 날짜·시간대, 업로드 |
| [컬렉션](../content/library/collection-patterns.json) | 카드, 표·정렬, 아코디언, 페이지·더 보기, 트리, 타임라인 |
| [검색·발견](../content/library/search-discovery.json) | 로컬 필터, 패싯, 조건 칩, 디바운스·요청 최신성, 명령 팔레트, 관련도·정렬 |
| [데이터 시각화](../content/library/data-visualization.json) | 비교 막대, 시계열, 비율, 분포·산점도, 열지도, KPI·스파크라인 |
| [모션](../content/library/motion-patterns.json) | 동작 줄이기, 스프링·중단, 공유 요소, 스크롤 리빌, 순차 등장, 모핑 |
| [미세 상호작용](../content/library/microinteractions.json) | 눌림·호버·포커스, 햅틱, 드래그 정렬, 스와이프, 복사, 새로고침 |
| [배경·효과](../content/library/background-effects.json) | 그라데이션, 그레인, 그림자·고도, 마스크, 입자, 스포트라이트·블렌드 |
| [미디어](../content/library/media-patterns.json) | 이미지 크롭, 갤러리·확대, 캐러셀, 재생·자막 대안, 아바타·아이콘, 전후 비교 |
| [포용적 설계](../content/library/inclusive-design.json) | 포커스, 시맨틱, 조작 영역, 상태 알림, 큰 글씨·확대, 감각·입력 대안 |
| [상태·복구](../content/library/state-patterns.json) | 진행률, 스켈레톤, 빈 화면, 재시도, 낙관 갱신·롤백, 오프라인·캐시 |
| [시작·통제](../content/library/onboarding.json) | 온보딩, 맥락 도움말, 권한 거부, 인증·복구, 설정, 동의·철회 |
| [커머스](../content/library/commerce.json) | 상품 변형·재고, 가격·구독, 장바구니, 결제 확인, 저장·비교, 주문 상태 |
| [생산성](../content/library/productivity.json) | 칸반, 달력, 일괄 행동, 실행 취소, 저장·충돌, 서식 도구 |
| [공간·3D](../content/library/spatial-design.json) | 제품 뷰어, PBR·조명, 공간 패널, 핫스폿, 카메라·편안함, 품질·정적 대안 |
| [시각 스타일](../content/library/visual-styles.json) | 미니멀, 에디토리얼, 스위스, 브루탈리즘, 글래스모피즘, 뉴모피즘, 스큐어모피즘, 플랫, 레트로, 유기적, 기술적 모노크롬, 시네마틱 |
| [성능·적응](../content/library/performance-design.json) | 점진 향상, 가상화, 모션 예산, 레이아웃 안정성, 비가시 작업 정지, 품질 적응 |

차트·공간 UI·시각 스타일 대부분은 **설계 지침**입니다. 범위에 포함됐다는 이유만으로 Three.js 뷰어·차트 엔진·결제 기능의 실행 구현이 있다고 해석하지 않습니다.

## 대표 코드 예제

### 색 조합 시각 비교

[색 조합 비교 문서](./color-combinations.md)에 여덟 가지 팔레트의 색 코드, 느낌, 용도와 주의점을 정리했다. [HTML 비교 화면](./color-combinations.html)은 같은 산책 기록 화면에 색만 바꿔 적용한다. 주황·라임, 흰색·파랑, 크림·초록, 남색·금색, 분홍·자두색, 먹색·시안, 모래색·청록, 흰색·먹색을 비교할 수 있다.

문서용 시각 예시이며 MCP 카탈로그에 등록된 대표 예제와는 별도다. 아래 패턴·예제 개수에는 포함하지 않는다.

[분위기별 HTML 예시](./mood-examples.html)는 독서·음악·여행·전시·작업 도구·카페의 서로 다른 구성에 배색 선택을 붙였다. 화면별 3가지, 총 18가지 추가 조합의 색 코드와 적용 메모는 [분위기별 배색 문서](./mood-examples.md)에 있다. 기존 8가지를 포함해 문서용 배색 예시는 총 26가지다.

### 화면 효과 시각 비교

화면 효과를 눈으로 비교하려면 [32개 효과 HTML 갤러리](./screen-effects.html)와 [효과 목록·추가 검토 항목](./screen-effects.md)을 참고한다. 기존 배경·모션·조작 지침을 모으고 리플·틸트·뒤집기·시차·쉬머 등의 분류를 보충했다. 실행·초기화·정지·동작 줄이기를 제공하는 문서용 시연이며 MCP 카탈로그 집계와는 별도다.

### MCP에서 제공하는 예제

각 패턴의 `get_design_pattern` 응답에서 `includeSourceExample=true`와 `platform=swiftui` 또는 `web`을 선택합니다. 기본 응답에는 코드를 넣지 않고 예제 유무·요구사항·검증 수준·한계를 반환합니다.

| 패턴 ID | SwiftUI | 웹 |
| --- | --- | --- |
| `responsive.auto-grid` | [적응형 그리드](../content/examples/adaptive-grid.swift) | [CSS Grid](../content/examples/adaptive-grid.html) |
| `overlay.modal-dialog` | [네이티브 시트](../content/examples/modal-dialog.swift) | [네이티브 dialog](../content/examples/modal-dialog.html) |
| `collection.accordion` | [DisclosureGroup](../content/examples/disclosure.swift) | [details/summary](../content/examples/disclosure.html) |
| `form.inline-validation` | [로컬 폼 검증](../content/examples/validated-form.swift) | [연결된 오류·포커스](../content/examples/validated-form.html) |
| `navigation.tab-panels` | [분할 선택과 콘텐츠](../content/examples/tab-panels.swift) | [키보드 탭 패널](../content/examples/tab-panels.html) |
| `theme.translucent-material` | [Material·불투명 대안](../content/examples/material-panel.swift) | [점진적 블러·불투명 대안](../content/examples/material-panel.html) |
| `discovery.local-filter` | [로컬 목록 필터](../content/examples/search-filter.swift) | [검색·결과 없음·초기화](../content/examples/search-filter.html) |
| `chart.comparison-bars` | [텍스트와 막대](../content/examples/comparison-bars.swift) | [공통 척도와 텍스트](../content/examples/comparison-bars.html) |
| `animation.reduced-motion` | [동작 줄이기 분기](../content/examples/reduced-motion.swift) | [정적 기본·모션 점진 향상](../content/examples/reduced-motion.html) |
| `state.progress` | [ProgressView](../content/examples/progress-state.swift) | [네이티브 progress](../content/examples/progress-state.html) |

SwiftUI 파일은 앱 진입점이 아니라 기존 앱/프리뷰에 삽입할 View입니다. 웹 파일은 외부 의존성 없는 HTML/CSS/JavaScript입니다. React/Vue 등의 프레임워크나 특정 제품의 스타일·상태 소유권을 강제하지 않습니다.

폼은 이름이 비어 있지 않은지만 검사하고 **전송·저장하지 않습니다**. 검색은 정적 목록의 부분 문자열 비교입니다. 차트는 고정된 양수 샘플이며 통계·음수 처리 엔진이 아닙니다. 진행률은 사용자가 단계 버튼을 누르는 명시적인 시연이며 실제 업로드나 작업 시간을 흉내 내지 않습니다.

## 예제 검증 범위

2026-11-06 작성 기준:

- `typechecked-macos`: 예제 10개를 함께 `xcrun swiftc -typecheck -swift-version 6`으로 macOS 14 타깃 검사. 플랫폼 SDK가 필요하며 iOS 빌드·프리뷰·런타임 검사를 뜻하지 않습니다.
- `browser-tested`: HTML 10개를 VS Code 통합 Chromium/Electron 브라우저에서 열고 320px/1280px의 가로 넘침과 JavaScript 실행 오류를 검사.
- 그리드는 320px에서 1열, 1280px에서 4열인지 확인.
- 모달은 초기 포커스, Tab 포커스 유지, Escape/닫기 버튼, 호출 버튼 복귀, 열린 상태의 좁은 화면 경계를 확인. 통합 브라우저에서 Escape가 네이티브 닫기 요청을 만들지 않는 경우가 관측돼 명시적 키보드 닫기 처리를 포함.
- 폼은 공백 입력 실패·첫 오류 포커스·오류 연결·수정 후 성공·저장하지 않았다는 결과를 확인.
- 탭은 좌우 방향키·순환·Home/End·선택 상태·단일 표시 패널·패널 포커스를 확인. 아코디언은 Enter 열기/닫기를 확인.
- 필터는 대소문자·공백 처리, 결과 수, 결과 없음, 초기화와 입력 포커스 보존을 확인.
- 재질은 수동 불투명 옵션과 강제 색상에서 블러 제거를 확인. OS의 Reduce Transparency 설정 자체를 실행 검증한 것은 아님.
- 차트는 텍스트 값·장식 막대의 접근성 제외·동일 기준선의 비례를 확인.
- 모션은 `reduce`/`no-preference` 양쪽에서 상태 전환이 유지되고 `reduce`에서 애니메이션이 없는지 확인.
- 진행률은 완료·버튼 비활성화·초기화를 확인.

`npm test`는 브라우저를 실행하지 않습니다. 코드가 바뀌면 위 브라우저 검증을 다시 수행해야 합니다. 브라우저 점검은 스크린리더·음성 제어·기기별 입력·확대의 완전한 검사나 WCAG 적합성 인증이 아닙니다. Safari/Firefox, iOS 기기, 긴 번역·실제 데이터·앱의 네트워크/인증 상태는 대상 프로젝트에서 추가 검증합니다.

## 라이브러리 확장

1. [범용 인덱스](../content/library/index.json)에 카테고리를 추가하거나 기존 [범용 JSON](../content/library/)에 패턴을 추가합니다. 기존 패턴 ID는 보존합니다.
2. [스키마](../src/library.ts)에 맞춰 필수 세부 지침, 서로 다른 플랫폼 적용과 최소 두 개 검증 항목을 작성합니다. 참고 문서는 공개 HTTPS 링크로 식별하고 외부 글이나 자산을 복제하지 않습니다.
3. 실제 예제가 없으면 `examples`를 생략합니다. 빈 파일·가짜 성공·SwiftUI 코드의 웹 라벨 변경으로 예제 유무를 채우지 않습니다.
4. 예제가 있으면 [예제 폴더](../content/examples/)의 `.swift`/`.html` 파일, 요구사항, 실제 검증 수준과 한계를 지정합니다. 플랫폼·확장자·검증 수준이 다르거나 관련 ID가 없으면 서버가 실패합니다.
5. `npm test`, macOS에서 `npm run verify:swift`, 관련 브라우저 검증, `npm run verify:package`를 실행합니다. 기준 개수가 바뀌면 의도한 변경인지 확인하고 테스트·이 문서·버전을 함께 갱신합니다.
6. 로컬 빌드를 참조하는 MCP는 빌드 후 재시작합니다. 배포 tarball은 다시 설치하고 재시작해야 합니다. GitHub 푸시만으로 이미 설치된 패키지가 자동 갱신되지는 않습니다.

WEASHION 원문 갱신은 기존 import 흐름으로 별도 수행합니다. 범용 패턴을 추가하기 위해 원본 스냅샷·해시·원본 코드 블록을 바꾸지 않습니다.
