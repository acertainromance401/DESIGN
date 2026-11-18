# 편집·포트폴리오·작업 도구

> 이 문서는 content/design-reuse.json·content/analyses와 시안 정의에서 생성합니다. 수정 후 npm run docs:designs를 실행하세요.


활자 위계, 열린 지면, 검색과 목록·상세 상태를 분리해 활용한다.

[전체 탐색](../README.md) · [플랫폼별 이식 가이드](<../../docs/platform-adoption.md>)

<a id="black-editorial"></a>
## 검정 포스터형 포트폴리오 `black-editorial`

큰 번호·얇은 타이포·열린 수평 구획·붉은 빛의 포트폴리오. 짧은 진입·펼침·호버와 포인터 반응, 효과 끄기·모션 감소를 지원한다.

원본: [black-editorial.html](<black-editorial.html>) · 이전 주소: `docs/black-editorial.html` (이동 안내)

별도 색감·레이아웃·폰트 기록은 아직 없습니다. [분석을 추가하는 방법](<../../docs/recording-analyses.md>)

### 실제 적용 기술과 확인 위치

- **반응형 편집·유동 타이포** `css-layout`: 큰 번호·가는 제목·수평 구획으로 포트폴리오의 작업 순서를 만든다. 확인: [black-editorial.html](<black-editorial.html>).
- **시맨틱 컨트롤·검색·상태 관리** `dom-state`: details/summary로 작업 설명을 펼친다. 확인: [black-editorial.html](<black-editorial.html>).
- **모션·포인터·렌더 수명** `motion-lifecycle`: WAAPI 진입·펼침, 포인터 반응과 효과 끄기·가시성·동작 줄이기를 연결한다. 확인: [black-editorial.html](<black-editorial.html>).


### 추출 가능한 부분

- 개인 포트폴리오의 목록·작업 설명
- 효과 설정과 포인터 반응 수명 관리


### Swift·SwiftUI·Metal·RealityKit

List 또는 ScrollView의 열린 행과 DisclosureGroup으로 재구성한다. Pointer hover는 보조 기능으로 두고 Reduce Motion에서 정적 상태를 유지한다.


### 게임 에셋·게임 UI

작업/퀘스트 목록·크레디트에 위계를 활용하고 hover 대신 패드 focus 상태를 동등하게 제공한다.


### 실행 요구사항

- 정적 HTML과 인라인 JS; 외부 의존성 없음


### 검수와 한계

- 효과 끄기·숨김·모션 감소 시 실행 중 애니메이션 취소 확인
- 가상 스튜디오·작업이며 실제 실적이 아니다.
- 정적 참조 이미지의 구성 원리만 해석했다. 원본 자산·문구와 사이트 동작은 복제하지 않았다.


### 자산

별도 바이너리 자산이 없는 시안입니다. 시스템 폰트·내장 엔진의 고지는 원본에서 확인합니다.


<a id="black-minimal"></a>
## 검정 미니멀 작업 보관함 `black-minimal`

검정·차콜·회색으로 구성한 모던 파일 목록과 상세 패널. 검색·선택·페이지 내 고정을 시연한다.

원본: [black-minimal.html](<black-minimal.html>) · 이전 주소: `docs/black-minimal.html` (이동 안내)

별도 색감·레이아웃·폰트 기록은 아직 없습니다. [분석을 추가하는 방법](<../../docs/recording-analyses.md>)

### 실제 적용 기술과 확인 위치

- **반응형 편집·유동 타이포** `css-layout`: 차콜 계층과 목록·상세 패널로 파일 보관함을 구성한다. 확인: [black-minimal.html](<black-minimal.html>).
- **시맨틱 컨트롤·검색·상태 관리** `dom-state`: 검색·선택·페이지 내 고정을 메모리 상태로 시연하며 미리보기는 CSS 도형이다. 확인: [black-minimal.html](<black-minimal.html>).


### 추출 가능한 부분

- 검색 → 선택 → 상세의 상태 분리
- 개인 홈페이지의 작업 자료 탐색 UI


### Swift·SwiftUI·Metal·RealityKit

NavigationSplitView/List와 검색 상태를 연결하고 실제 파일 접근은 FileImporter·보안 범위 URL 등 별도 요구사항으로 구현한다.


### 게임 에셋·게임 UI

인벤토리/에셋 브라우저의 목록·상세 패턴으로 사용하고 게임 저장 데이터는 별도로 연결한다.


### 실행 요구사항

- HTML/CSS와 인라인 JS; 서버·파일 시스템 접근 없음


### 검수와 한계

- 검색 빈 결과·선택 변경·고정 해제·좁은 화면 확인
- 고정은 페이지 메모리에만 반영되며 파일 접근·영구 저장·전송은 없다.
- 미리보기는 실제 파일 렌더링이 아닌 CSS 도형이다.


### 자산

별도 바이너리 자산이 없는 시안입니다. 시스템 폰트·내장 엔진의 고지는 원본에서 확인합니다.


<a id="aesthetic-notes"></a>
## 개인 디자인 작업 노트 `aesthetic-notes`

한국어 글자·간격 표본과 비정형 편집의 개인 미감 시안.

원본: [aesthetic.html](<aesthetic.html>) · 이전 주소: `docs/aesthetic.html` (이동 안내)

별도 색감·레이아웃·폰트 기록은 아직 없습니다. [분석을 추가하는 방법](<../../docs/recording-analyses.md>)

### 실제 적용 기술과 확인 위치

- **반응형 편집·유동 타이포** `css-layout`: 한국어 활자·간격 표본과 수정 메모를 비정형 지면으로 배치한다. JS 없는 정적 화면이다. 확인: [aesthetic.html](<aesthetic.html>).


### 추출 가능한 부분

- 작업 노트의 읽기 순서·글자 크기·간격 표본
- 개인 홈페이지의 작업 과정 소개 구도


### Swift·SwiftUI·Metal·RealityKit

SwiftUI Text와 Layout으로 메모와 표본을 구성한다. 원문과 사용자 언어를 보존하고 고정 픽셀을 Dynamic Type 크기로 바꾼다.


### 게임 에셋·게임 UI

게임 내 개발 일지·크레디트 UI의 활자 위계로 활용한다. 텍스트를 이미지로 굳히지 않는다.


### 실행 요구사항

- 외부 폰트·스크립트 없는 정적 HTML/CSS


### 검수와 한계

- 긴 한국어와 200% 확대에서 메모·표본 순서 확인
- 확정된 개인 취향이나 모든 프로젝트의 스타일 규칙이 아니다.


### 자산

별도 바이너리 자산이 없는 시안입니다. 시스템 폰트·내장 엔진의 고지는 원본에서 확인합니다.
