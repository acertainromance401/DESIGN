# 팔레트·분위기 비교

> 이 문서는 content/design-reuse.json·content/analyses와 시안 정의에서 생성합니다. 수정 후 npm run docs:designs를 실행하세요.


8개 고정 배색과 6개 화면의 18개 전환 배색. 총 26개 조합.

[전체 탐색](../README.md) · [플랫폼별 이식 가이드](<../../docs/platform-adoption.md>)

<a id="color-combinations"></a>
## 같은 화면의 8가지 색 조합 `color-combinations`

산책 기록 화면에 여덟 팔레트를 적용해 색감·분위기와 용도를 비교한다.

원본: [color-combinations.html](<color-combinations.html>) · 이전 주소: `docs/color-combinations.html` (이동 안내)

동반 문서: [color-combinations.md](<color-combinations.md>)

별도 색감·레이아웃·폰트 기록은 아직 없습니다. [분석을 추가하는 방법](<../../docs/recording-analyses.md>)

### 실제 적용 기술과 확인 위치

- **의미 색상 토큰·배색 전환** `design-tokens`: 같은 산책 기록 화면을 8개 팔레트로 반복해 색 역할·면적의 차이를 비교한다. 확인: [color-combinations.html](<color-combinations.html>).


### 추출 가능한 부분

- 8개 역할 기반 팔레트
- 같은 콘텐츠로 테마를 비교하는 방법


### Swift·SwiftUI·Metal·RealityKit

배색을 의미 Color 집합으로 옮기고 시스템 테마·고대비 변형을 추가한다.


### 게임 에셋·게임 UI

레벨/메뉴 테마 데이터로 추출하되 경고·성공 상태색은 구분한다.


### 실행 요구사항

- 정적 HTML/CSS; 색 코드와 용도는 동반 문서


### 검수와 한계

- 보조 글자·포커스·기능색의 대비 재측정
- 고정 시연 데이터이며 색의 인상은 문화·서체·면적에 따라 달라진다.


### 자산

별도 바이너리 자산이 없는 시안입니다. 시스템 폰트·내장 엔진의 고지는 원본에서 확인합니다.


<a id="mood-examples"></a>
## 분위기별 6개 화면·18가지 배색 `mood-examples`

독서·음악·여행·전시·작업 도구·카페 화면별로 세 배색을 선택한다. 기존 8개와 합쳐 26개.

원본: [mood-examples.html](<mood-examples.html>) · 이전 주소: `docs/mood-examples.html` (이동 안내)

동반 문서: [mood-examples.md](<mood-examples.md>)

별도 색감·레이아웃·폰트 기록은 아직 없습니다. [분석을 추가하는 방법](<../../docs/recording-analyses.md>)

### 실제 적용 기술과 확인 위치

- **의미 색상 토큰·배색 전환** `design-tokens`: 독서·음악·여행·전시·도구·카페 6개 화면마다 3개 팔레트를 선택한다. 확인: [mood-examples.html](<mood-examples.html>).
- **시맨틱 컨트롤·검색·상태 관리** `dom-state`: 색 선택 UI만 상태를 바꾸며 재생·예약·주문은 구현하지 않는다. 확인: [mood-examples.html](<mood-examples.html>).


### 추출 가능한 부분

- 18개 배색과 화면 목적에 따른 역할 배분
- 설정/테마 미리보기


### Swift·SwiftUI·Metal·RealityKit

Picker와 테마 상태를 연결하고 실제 음악/주문 동작은 별도 서비스에 연결한다.


### 게임 에셋·게임 UI

바이옴/메뉴 분위기 팔레트로 사용하고 단순 색 교체와 장면 구조 차이를 구분한다.


### 실행 요구사항

- 인라인 JS; 데이터·저장 백엔드 없음


### 검수와 한계

- 선택 상태의 비색상 단서·각 화면별 대비 확인
- 색 변경만 작동한다. 재생·기록·예약·주문 기능은 없다.
- 서로 다른 화면의 차이를 색만의 효과로 해석하지 않는다.


### 자산

별도 바이너리 자산이 없는 시안입니다. 시스템 폰트·내장 엔진의 고지는 원본에서 확인합니다.
