# 화면 효과·광학 재질

> 이 문서는 content/design-reuse.json·content/analyses와 시안 정의에서 생성합니다. 수정 후 npm run docs:designs를 실행하세요.


32개 수동 실행 효과와 WebGL 광학 유리 컨트롤을 구분한다.

[전체 탐색](../README.md) · [플랫폼별 이식 가이드](<../../docs/platform-adoption.md>)

<a id="liquid-glass"></a>
## Liquid Glass — 광학 유리 컨트롤 `liquid-glass`

SDF 곡면·굴절·Fresnel 반사와 실제 HTML 조작을 분리한 WebGL 2 유리 재질 연구.

원본: [liquid-glass.html](<liquid-glass.html>) · 이전 주소: `liquid-glass.html` (이동 안내)

별도 색감·레이아웃·폰트 기록은 아직 없습니다. [분석을 추가하는 방법](<../../docs/recording-analyses.md>)

### 실제 적용 기술과 확인 위치

- **WebGL 2·SDF 레이마칭** `webgl-sdf`: fragmentSource의 roundRect·곡면과 12개 물체 uniform으로 유리 형상을 계산한다. 확인: [liquid-glass.html](<liquid-glass.html>).
- **굴절·Fresnel·흡수·유리 재질** `optical-glass`: 굴절률 1.51, Fresnel 반사·출사 굴절·흡수와 접촉 그림자를 합성한다. 확인: [liquid-glass.html](<liquid-glass.html>).
- **시맨틱 컨트롤·검색·상태 관리** `dom-state`: canvas는 장식이고 실제 button/input/switch/tab이 조작과 접근성을 담당한다. 확인: [liquid-glass.html](<liquid-glass.html>).
- **모션·포인터·렌더 수명** `motion-lifecycle`: DOM rect 측정·ResizeObserver·IntersectionObserver·포인터 상태로 필요한 프레임만 렌더한다. 확인: [liquid-glass.html](<liquid-glass.html>).


### 추출 가능한 부분

- DOM 조작과 GPU 재질의 분리
- SDF 곡면·굴절·반사 함수
- CSS 재질 대안·에러 상태


### Swift·SwiftUI·Metal·RealityKit

일반 앱 조작은 glassEffect와 네이티브 컨트롤을 우선한다. 광학 비교 연구는 MTKView에 배경 텍스처·rect/shape·hover/press uniform을 전달해 MSL로 재구현한다.


### 게임 에셋·게임 UI

게임 UI 재질로 가져갈 때 배경 color texture를 명시하고 투명 정렬·두께·굴절 비용을 측정한다.


### 실행 요구사항

- WebGL 2, CSS fallback; 외부 의존성 없음
- 시연 select/switch/tab 외 버튼·입력은 실제 서비스 기능 아님


### 검수와 한계

- GPU 실패 시 CSS preview와 상태 안내·키보드 조작 유지
- 스크롤/리사이즈 후 DOM과 유리 정렬 확인
- Apple 시스템 Liquid Glass의 구현이나 동등 품질 인증이 아니다.
- 실제 서비스 동작이 아닌 재질·컨트롤 상태 시연이다. GPU 실패 시 CSS preview를 사용한다.


### 자산

별도 바이너리 자산이 없는 시안입니다. 시스템 폰트·내장 엔진의 고지는 원본에서 확인합니다.


<a id="screen-effects"></a>
## 32개 앱 화면 효과 갤러리 `screen-effects`

배경·재질, 등장·전환, 조작, 스크롤, 상태·오버레이를 수동 실행·초기화·정지한다. 추가 검토 효과 19종은 문서에 별도 정리.

원본: [screen-effects.html](<screen-effects.html>) · 이전 주소: `docs/screen-effects.html` (이동 안내)

동반 문서: [screen-effects.md](<screen-effects.md>)

별도 색감·레이아웃·폰트 기록은 아직 없습니다. [분석을 추가하는 방법](<../../docs/recording-analyses.md>)

### 실제 적용 기술과 확인 위치

- **모션·포인터·렌더 수명** `motion-lifecycle`: 32개 demos를 수동 실행·초기화·정지하며 리플·틸트·스프링 근사·쉬머를 비교한다. 확인: [screen-effects.html](<screen-effects.html>).
- **시맨틱 컨트롤·검색·상태 관리** `dom-state`: dialog.showModal과 실행 컨트롤·상태 안내를 제공한다. 확인: [screen-effects.html](<screen-effects.html>).
- **노이즈·종이·절차적 텍스처** `procedural-texture`: SVG noise와 CSS backdrop-filter 등 배경·재질 효과를 비교한다. 확인: [screen-effects.html](<screen-effects.html>).


### 추출 가능한 부분

- 효과별 작은 실행 단위와 중단/초기화 계약
- 32개 구현과 문서상 추가 19개 검토 항목의 구분


### Swift·SwiftUI·Metal·RealityKit

네이티브 transition·spring·sheet·Material을 먼저 사용한다. 2D 필터만 SwiftUI Shader로 분리하고 햅틱은 지원 기기에서 별도 구현한다.


### 게임 에셋·게임 UI

상태 변화·피드백에 필요한 효과만 tween/particle/shader로 재작성한다.


### 실행 요구사항

- 32개 효과만 실행 시연; 추가 19종 전체 구현 아님


### 검수와 한계

- 반복 실행·중단·초기화·모달 포커스·동작 줄이기 확인
- 네이티브 햅틱·재질·물리 스프링과 같은 품질을 보장하지 않는다.
- 추가 검토 19종 모두에 실행 시연이 있는 것은 아니다.
- 실제 서버 작업·저장·업로드는 없다.


### 자산

별도 바이너리 자산이 없는 시안입니다. 시스템 폰트·내장 엔진의 고지는 원본에서 확인합니다.
