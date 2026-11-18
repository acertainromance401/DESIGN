# 시안·실전 디자인 기술 카탈로그

> content/technology-options.json과 content/design-reuse.json에서 생성합니다. 등록 데이터를 편집한 뒤 `npm run docs:designs`를 실행하세요.

**10개 영역 · 103개 항목**: 시안 사용 근거 14개, 추가 도입 후보 89개.

MCP: `design://technologies` · `search_design_technologies` · `get_design_technology` · [플랫폼별 이식 가이드](<platform-adoption.md>)

- `source-backed`: 저장소의 독립 시안 또는 그 제작 스크립트에 등록된 사용 위치가 있다. 대상 프로젝트 설치, 실기기 성능, 현재 브라우저 지원을 보증하지 않는다. 로컬 전용 소스는 배포본에 없을 수 있다.

- `candidate`: 도입 판단용 문서다. 이 카탈로그에 연결된 독립 시안의 근거는 없고, 별도의 교육 예제나 실제 세션 설치 여부까지 부정하는 것은 아니다.

- `platforms`: 사용하거나 제작·검수에 쓰는 환경을 찾기 위한 태그다. 에디터의 호스트 OS와 최종 내보내기 대상은 다를 수 있으며 버전·SDK·기기는 별도로 확인한다.

## 목적에 맞게 고르는 순서

1. 현재 프로젝트의 스택과 산출물부터 확인한다. 디자인 구현의 일부인 요청만 조회하고, 기존 스택이 충분하면 교체하거나 의존성을 늘리지 않는다.

2. 고정 모션은 [영상](#technology-web-video)이나 [사전 렌더](#technology-baked-3d), 실시간 2D는 [SVG](#technology-svg-illustration)·[Canvas](#technology-canvas-2d), 회전·조명·대량 입자는 [Three.js](#technology-three-pbr)·[WebGL](#technology-webgl-sdf)·[WebGPU](#technology-webgpu) 순으로 요구에 맞춰 비교한다. 기술 이름보다 필요한 조작과 예산으로 결정한다.

3. Figma·Blender·게임 엔진 등의 직접 실행은 해당 앱, 프로젝트 접근 권한, 세션의 도구 또는 별도 연동이 있어야 한다. 조회만으로 설치·실행·파일 생성·배포를 하지 않는다.

4. 성능 목표, 모바일·저사양 대안, 접근 가능한 의미와 입력, 에셋 권리를 먼저 정하고 실제 기기와 화면에서 검수한다.

## 분야별 바로가기

- [웹 UI·앱 구조](#category-web-ui) — 9개

- [레이아웃·색·타이포·디자인 시스템](#category-styling) — 9개

- [2D 그래픽·합성](#category-graphics-2d) — 9개

- [3D·셰이더·공간/XR](#category-graphics-3d) — 12개

- [모션·영상·오디오](#category-motion-media) — 15개

- [데이터 시각화·지도](#category-data-visualization) — 7개

- [네이티브·크로스플랫폼 UI](#category-native-cross-platform) — 13개

- [게임·인터랙티브 엔진](#category-game-engines) — 6개

- [시안·디자인 자산 제작](#category-asset-authoring) — 15개

- [미리보기·품질·접근성 검수](#category-verification) — 8개

<a id="category-web-ui"></a>
## 웹 UI·앱 구조

<a id="technology-dom-state"></a>
### 시맨틱 컨트롤·검색·상태 관리

`dom-state` · `source-backed` · `technique` · web

네이티브 HTML 조작과 JS 상태를 연결해 검색·선택·펼침·탭·모달을 시연한다.

- 실제 사용: [liquid-glass](<design-inventory.md#liquid-glass>), [slow-bookshop](<design-inventory.md#slow-bookshop>), [birthday](<design-inventory.md#birthday>), [black-editorial](<design-inventory.md#black-editorial>), [black-minimal](<design-inventory.md#black-minimal>), [mood-examples](<design-inventory.md#mood-examples>), [screen-effects](<design-inventory.md#screen-effects>)

- [플랫폼별 적용·검수·공식 문서](<platform-adoption.md#dom-state>)

<a id="technology-static-html"></a>
### HTML/CSS 독립 시안

`static-html` · `candidate` · `workflow` · web

별도 프레임워크 없이 실제 문구와 시맨틱 HTML로 화면을 만든다.

- **쓸 때:** 포스터·랜딩의 구도, 배색, 반응형을 빠르게 비교할 때.
- **필요 조건:** 브라우저와 필요시 정적 HTTP 서버.
- **제약:** 공유 상태·라우팅·데이터 연동이 많아지면 구조를 다시 잡는다.
- **검수:** 모듈 경로, 여러 뷰포트, 읽기 순서와 키보드 조작.
- [공식 참고](https://developer.mozilla.org/en-US/docs/Web/HTML)

<a id="technology-react"></a>
### React

`react` · `candidate` · `library` · web

컴포넌트와 상태로 상호작용 제품 UI를 구성한다.

- **쓸 때:** 이미 React를 쓰거나 반복 컴포넌트와 상태 조합이 많은 웹 UI.
- **필요 조건:** 프로젝트의 React·빌드·라우팅 규칙.
- **제약:** 간단한 단일 시안에는 빌드와 런타임이 과할 수 있다.
- **검수:** 상태 경계, 키 안정성, 리렌더, 비동기 및 키보드 동작.
- [공식 참고](https://react.dev/learn)

<a id="technology-nextjs"></a>
### Next.js

`nextjs` · `candidate` · `framework` · web

React에 라우팅·서버 렌더링·정적 생성 경로를 제공한다.

- **쓸 때:** 서버 데이터나 검색 노출이 중요한 다중 페이지 React 사이트.
- **필요 조건:** 선택한 배포 런타임 및 서버/클라이언트 경계.
- **제약:** 프레임워크 캐시 정책과 배포 구성이 추가된다.
- **검수:** 초기 HTML, 하이드레이션, 로딩·실패·이전 경로.
- [공식 참고](https://nextjs.org/docs)

<a id="technology-vue"></a>
### Vue

`vue` · `candidate` · `framework` · web

템플릿과 반응형 상태로 UI를 만든다.

- **쓸 때:** 이미 Vue인 제품, 또는 템플릿 중심으로 상태를 점진 도입할 때.
- **필요 조건:** 프로젝트의 Vue·빌드·스타일 구성.
- **제약:** React 등 기존 UI를 바꿀 이유는 아니다.
- **검수:** 폼·슬롯·입력 상태, 키보드 및 렌더링 비용.
- [공식 참고](https://vuejs.org/guide/introduction.html)

<a id="technology-nuxt"></a>
### Nuxt

`nuxt` · `candidate` · `framework` · web

Vue 앱의 파일 기반 라우팅과 서버/정적 렌더링을 구성한다.

- **쓸 때:** 콘텐츠와 제품을 함께 배포하는 다중 페이지 Vue 프로젝트.
- **필요 조건:** 선택한 Nuxt·Nitro 배포 환경.
- **제약:** 단일 페이지 데모에는 라우팅·런타임 계층이 불필요할 수 있다.
- **검수:** SSR/CSR 환경 분기, 직접 접근, 캐시와 오류 상태.
- [공식 참고](https://nuxt.com/docs)

<a id="technology-sveltekit"></a>
### SvelteKit

`sveltekit` · `candidate` · `framework` · web

Svelte UI에 라우팅, 데이터 로드, 폼과 배포 어댑터를 묶는다.

- **쓸 때:** Svelte 스택에서 편집 사이트와 상호작용 앱을 제작할 때.
- **필요 조건:** 배포 대상에 맞는 어댑터와 기존 Svelte 버전.
- **제약:** 다른 플랫폼으로 옮길 때 컴포넌트 변환이 필요하다.
- **검수:** JS가 늦게 로드될 때 폼, 데이터 실패와 라우트 전환.
- [공식 참고](https://svelte.dev/docs/kit)

<a id="technology-astro"></a>
### Astro

`astro` · `candidate` · `framework` · web

정적 콘텐츠를 기본으로 하면서 필요한 컴포넌트만 클라이언트에서 실행한다.

- **쓸 때:** 읽기 중심 포트폴리오·서적·문서와 일부 상호작용.
- **필요 조건:** 콘텐츠 빌드와 동작이 필요한 아일랜드 구분.
- **제약:** 화면 전체가 공유 상태인 앱에는 아일랜드 경계가 불편할 수 있다.
- **검수:** 정적 링크, 지연 로드된 조작, 초기 JS·이미지 크기.
- [공식 참고](https://docs.astro.build/)

<a id="technology-web-components"></a>
### Web Components

`web-components` · `candidate` · `api` · web

커스텀 요소·템플릿·선택적 Shadow DOM으로 재사용 가능한 위젯 경계를 만든다.

- **쓸 때:** 여러 호스트 웹 스택에 동일 위젯을 넣어야 할 때.
- **필요 조건:** 기능을 지원하는 브라우저와 통합 시 이벤트·스타일 계약.
- **제약:** Shadow DOM은 외부 스타일·폼·포커스 연동을 별도로 설계해야 한다.
- **검수:** 키보드·레이블, 스타일 토큰 노출, 생성·제거 수명.
- [공식 참고](https://developer.mozilla.org/en-US/docs/Web/API/Web_components)

<a id="category-styling"></a>
## 레이아웃·색·타이포·디자인 시스템

<a id="technology-css-layout"></a>
### 반응형 편집·유동 타이포

`css-layout` · `source-backed` · `technique` · web

Grid/Flex·상대 단위·clamp와 미디어 쿼리로 활자·이미지의 위계와 재배치를 만든다.

- 실제 사용: [slow-bookshop](<design-inventory.md#slow-bookshop>), [reference-house](<design-inventory.md#reference-house>), [reference-exhibition](<design-inventory.md#reference-exhibition>), [reference-sport](<design-inventory.md#reference-sport>), [sports-collage](<design-inventory.md#sports-collage>), [black-editorial](<design-inventory.md#black-editorial>), [black-minimal](<design-inventory.md#black-minimal>), [aesthetic-notes](<design-inventory.md#aesthetic-notes>), [high-energy](<design-inventory.md#high-energy>)

- [플랫폼별 적용·검수·공식 문서](<platform-adoption.md#css-layout>)

<a id="technology-design-tokens"></a>
### 의미 색상 토큰·배색 전환

`design-tokens` · `source-backed` · `technique` · web

배경·본문·보조색·강조색을 CSS custom property로 분리하고 동일한 역할에 팔레트를 바꿔 적용한다.

- 실제 사용: [reference-object](<design-inventory.md#reference-object>), [high-energy](<design-inventory.md#high-energy>), [color-combinations](<design-inventory.md#color-combinations>), [mood-examples](<design-inventory.md#mood-examples>)

- [플랫폼별 적용·검수·공식 문서](<platform-adoption.md#design-tokens>)

<a id="technology-tailwind-css"></a>
### Tailwind CSS

`tailwind-css` · `candidate` · `framework` · web

토큰 기반 유틸리티를 생성해 마크업에 스타일을 조합한다.

- **쓸 때:** 프로젝트가 이미 같은 유틸리티 체계와 빌드를 사용하는 경우.
- **필요 조건:** 콘텐츠 탐지·테마 구성과 기존 컴포넌트 규칙.
- **제약:** 유틸리티가 사용자의 스타일이나 컴포넌트 위계를 결정하지는 않는다.
- **검수:** 최종 CSS에 상태 클래스가 생성되는지와 기존 스타일 충돌.
- [공식 참고](https://tailwindcss.com/docs)

<a id="technology-css-container-queries"></a>
### CSS 컨테이너 쿼리

`css-container-queries` · `candidate` · `api` · web

뷰포트가 아니라 컴포넌트가 놓인 컨테이너 폭에 맞춰 스타일을 적용한다.

- **쓸 때:** 같은 컴포넌트가 본문·사이드바에서 다른 폭으로 쓰일 때.
- **필요 조건:** 컨테이너 유형 선언과 대상 브라우저의 쿼리 지원.
- **제약:** 컨테이너 지정은 크기 계산과 레이아웃에 영향을 줄 수 있다.
- **검수:** 좁은 컨테이너, 번역·글자 확대, 기본 스타일.
- [공식 참고](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries)

<a id="technology-css-subgrid"></a>
### CSS Subgrid

`css-subgrid` · `candidate` · `api` · web

중첩 요소가 상위 그리드의 열이나 행을 공유한다.

- **쓸 때:** 여러 정보 묶음의 제목·텍스트·수치 기준선을 맞춰야 할 때.
- **필요 조건:** 상위 그리드와 지원 브라우저.
- **제약:** 무관한 항목까지 높이와 구조를 통일할 필요는 없다.
- **검수:** 여러 줄 콘텐츠, 글자 확대와 기본 그리드 대안.
- [공식 참고](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Subgrid)

<a id="technology-css-color-spaces"></a>
### OKLCH·Display P3·색상 혼합

`css-color-spaces` · `candidate` · `technique` · web

밝기·채도·색상 역할을 조절하고 지원 환경에서 넓은 색역을 사용한다.

- **쓸 때:** 테마 단계를 재사용하거나 강한 색의 지각적 차이를 조정할 때.
- **필요 조건:** CSS 함수 지원과 sRGB 대체 값.
- **제약:** 같은 OKLCH 밝기라도 실제 대비와 디스플레이 색이 동일한 것은 아니다.
- **검수:** 색역 밖 값, 단말별 클리핑과 텍스트 대비.
- [공식 참고](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value)

<a id="technology-variable-fonts"></a>
### Variable Fonts·OpenType

`variable-fonts` · `candidate` · `technique` · web, ios, macos, android, windows, linux

폰트가 제공하는 굵기·너비·옵티컬 사이즈 축으로 조판을 조절한다.

- **쓸 때:** 웨이트를 연속 조정하거나 한 계열로 다양한 정보 위계를 만들 때.
- **필요 조건:** 해당 축·글리프를 가진 라이선스 확인 폰트와 플랫폼 지원.
- **제약:** 가변 파일이 항상 작지는 않으며 한글 fallback은 따로 검수한다.
- **검수:** 브라우저 실제 렌더링 서체, 축 범위, 한글·영문 혼용과 FOIT.
- [공식 참고](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_fonts/Variable_fonts_guide)

<a id="technology-style-dictionary"></a>
### Style Dictionary

`style-dictionary` · `candidate` · `tool` · macos, windows, linux

공통 토큰 원본을 CSS·Apple·Android 프로젝트용 출력으로 변환한다.

- **쓸 때:** 여러 플랫폼이 뜻이 같은 색·간격 토큰을 공유해야 할 때.
- **필요 조건:** 토큰 스키마, 변환 규칙과 Node 기반 빌드 파이프라인.
- **제약:** 시안 하나에는 동기화 시스템이 과하며 플랫폼 의미 차이는 직접 모델링한다.
- **검수:** 토큰 별칭 순환, 테마 누락, 재현 가능한 생성 결과.
- [공식 참고](https://styledictionary.com/)

<a id="technology-radix-primitives"></a>
### Radix Primitives

`radix-primitives` · `candidate` · `library` · web

스타일이 정해지지 않은 React 조작 요소에서 키보드·상태·포커스 관리를 제공한다.

- **쓸 때:** 시각 디자인은 새로 만들되 대화상자나 메뉴의 기본 동작을 재사용할 때.
- **필요 조건:** React와 기존 컴포넌트·상태 규칙.
- **제약:** 프리미티브만 쓴다고 화면 전체 접근성이 보장되는 것은 아니다.
- **검수:** 레이블과 이름, 포커스 복귀, 오류 상태, 스크린리더.
- [공식 참고](https://www.radix-ui.com/primitives/docs/overview/introduction)

<a id="category-graphics-2d"></a>
## 2D 그래픽·합성

<a id="technology-svg-illustration"></a>
### SVG 벡터·그라데이션·깊이

`svg-illustration` · `source-backed` · `format` · web

path·gradient·pattern·그룹 변환으로 제품과 공간을 2D에서 직접 그린다. 실제 3D 메시와 다르다.

- 실제 사용: [slow-bookshop](<design-inventory.md#slow-bookshop>), [midnight-cinema](<design-inventory.md#midnight-cinema>), [reference-object](<design-inventory.md#reference-object>), [boxing-overhead](<design-inventory.md#boxing-overhead>), [boxing-vintage](<design-inventory.md#boxing-vintage>), [boxing-arena](<design-inventory.md#boxing-arena>)

- [플랫폼별 적용·검수·공식 문서](<platform-adoption.md#svg-illustration>)

<a id="technology-image-masking"></a>
### 사진 크롭·SVG 컷아웃·마스크

`image-masking` · `source-backed` · `technique` · web

동일 사진을 다른 크기로 재사용하고 clipPath와 전경 마스크로 활자 앞뒤를 나눈다.

- 실제 사용: [slow-bookshop](<design-inventory.md#slow-bookshop>), [reference-house](<design-inventory.md#reference-house>), [reference-exhibition](<design-inventory.md#reference-exhibition>), [reference-sport](<design-inventory.md#reference-sport>), [sports-collage](<design-inventory.md#sports-collage>)

- [플랫폼별 적용·검수·공식 문서](<platform-adoption.md#image-masking>)

<a id="technology-procedural-texture"></a>
### 노이즈·종이·절차적 텍스처

`procedural-texture` · `source-backed` · `technique` · web

SVG feTurbulence·blend·반복 패턴 또는 Canvas로 종이·직물·카펫의 미세 변화를 만든다.

- 실제 사용: [midnight-cinema](<design-inventory.md#midnight-cinema>), [midnight-cinema-3d](<design-inventory.md#midnight-cinema-3d>), [reference-object](<design-inventory.md#reference-object>), [reference-exhibition](<design-inventory.md#reference-exhibition>), [reference-sport](<design-inventory.md#reference-sport>), [boxing-overhead](<design-inventory.md#boxing-overhead>), [boxing-vintage](<design-inventory.md#boxing-vintage>), [screen-effects](<design-inventory.md#screen-effects>)

- [플랫폼별 적용·검수·공식 문서](<platform-adoption.md#procedural-texture>)

<a id="technology-canvas-2d"></a>
### Canvas 2D

`canvas-2d` · `candidate` · `api` · web

픽셀과 도형을 그려 2D 레이어, 도트, 반복되는 입자와 간단한 합성을 표현한다.

- **쓸 때:** 표식이 많아 DOM 요소가 부담되지만 카메라·공간 조명이 필요 없을 때.
- **필요 조건:** Canvas 지원, 원본 자산 권한 및 픽셀 읽기 시 적절한 CORS.
- **제약:** 그림 내부가 시맨틱 요소가 아니므로 실제 버튼·상태는 DOM에 둔다.
- **검수:** 고해상도 화면, 리사이즈, 프레임 비용, 정적 대안.
- [공식 참고](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

<a id="technology-offscreen-canvas"></a>
### OffscreenCanvas·Worker

`offscreen-canvas` · `candidate` · `api` · web

지원되는 렌더 작업을 워커로 옮긴다.

- **쓸 때:** 측정상 메인 스레드 렌더가 클릭·스크롤을 막을 때.
- **필요 조건:** 워커·OffscreenCanvas 및 사용하는 컨텍스트의 지원 확인.
- **제약:** 이벤트·사이즈·자원 동기화와 미지원 대안이 추가된다.
- **검수:** 워커 오류, 컨텍스트 수명, 인풋 지연 전후 비교.
- [공식 참고](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas)

<a id="technology-pixijs"></a>
### PixiJS

`pixijs` · `candidate` · `library` · web

스프라이트 장면과 텍스처를 2D GPU 렌더러로 관리한다.

- **쓸 때:** 입자·다층 스프라이트가 많고 UI보다 그래픽 효과가 중심일 때.
- **필요 조건:** 지원 GPU 렌더 백엔드, 번들·텍스처 예산.
- **제약:** 읽기·조작 정보는 별도 접근 가능한 UI가 필요하다.
- **검수:** 스프라이트 수, 텍스처 메모리, 프레임 제한과 자원 해제.
- [공식 참고](https://pixijs.com/)

<a id="technology-konva"></a>
### Konva

`konva` · `candidate` · `library` · web

Canvas 도형을 레이어·히트 영역·드래그 노드로 관리한다.

- **쓸 때:** 사용자가 배치·그리기·선택을 하는 2D 편집 화면.
- **필요 조건:** Canvas 및 별도 키보드·접근성 경로.
- **제약:** 단순 이미지에는 편집기용 상태와 히트 캔버스가 과할 수 있다.
- **검수:** 줌·드래그 좌표, 터치, 실행 취소, 고해상도 내보내기.
- [공식 참고](https://konvajs.org/)

<a id="technology-p5js"></a>
### p5.js

`p5js` · `candidate` · `library` · web

그리기·입력·프레임 루프를 단순화해 생성 그래픽을 빠르게 실험한다.

- **쓸 때:** 색·입자·타이포의 규칙을 코드 스케치로 비교할 때.
- **필요 조건:** p5.js 및 대상 렌더 모드.
- **제약:** 다수의 스케치나 제품 번들에 넣을 때 성능·의존성을 다시 본다.
- **검수:** 시드 재현, 픽셀 밀도, resize와 작업 종료 시 루프 정지.
- [공식 참고](https://p5js.org/reference/)

<a id="technology-css-compositing"></a>
### CSS 필터·블렌드·마스크 합성

`css-compositing` · `candidate` · `technique` · web

이미지·색·불투명도를 겹쳐 2D에서 질감과 흐림을 만든다.

- **쓸 때:** 실제 굴절·3D 조명 없이 인쇄 질감이나 겹침 인상이 필요한 경우.
- **필요 조건:** 합성 기능 지원과 기본 색·이미지 대안.
- **제약:** 큰 영역의 blur나 다층 합성은 비용이 크며 배경에 따라 가독성이 변한다.
- **검수:** isolation, 색상 대비, 스크롤 비용과 약한 기기.
- [공식 참고](https://developer.mozilla.org/en-US/docs/Web/CSS/mix-blend-mode)

<a id="category-graphics-3d"></a>
## 3D·셰이더·공간/XR

<a id="technology-webgl-sdf"></a>
### WebGL 2·SDF 레이마칭

`webgl-sdf` · `source-backed` · `api` · web

GLSL ES 3.00 fragment shader에서 거리 함수와 광선 진행으로 픽셀을 생성한다. 메시·본·물리 정보가 없다.

- 실제 사용: [ascii-character](<design-inventory.md#ascii-character>), [liquid-glass](<design-inventory.md#liquid-glass>)

- [플랫폼별 적용·검수·공식 문서](<platform-adoption.md#webgl-sdf>)

<a id="technology-ascii-postprocess"></a>
### 저해상도 FBO·ASCII 문자 아틀라스

`ascii-postprocess` · `source-backed` · `technique` · web

저해상도 장면의 밝기를 계산해 Canvas로 실제 커버리지를 정렬한 glyph atlas를 셀마다 샘플링한다.

- 실제 사용: [ascii-character](<design-inventory.md#ascii-character>)

- [플랫폼별 적용·검수·공식 문서](<platform-adoption.md#ascii-postprocess>)

<a id="technology-optical-glass"></a>
### 굴절·Fresnel·흡수·유리 재질

`optical-glass` · `source-backed` · `technique` · web

SDF 형태의 입사·출사 굴절, Fresnel 반사와 투과 흡수로 유리 표면을 합성한다. CSS blur만의 효과가 아니다.

- 실제 사용: [liquid-glass](<design-inventory.md#liquid-glass>)

- [플랫폼별 적용·검수·공식 문서](<platform-adoption.md#optical-glass>)

<a id="technology-three-pbr"></a>
### Three.js·PBR 조명·장면

`three-pbr` · `source-backed` · `library` · web

scene graph·카메라·재질·광원으로 실제 3D 장면을 렌더링한다. 생일 r180과 극장 내장 r187은 별도 런타임이다.

- 실제 사용: [midnight-cinema-3d](<design-inventory.md#midnight-cinema-3d>), [birthday](<design-inventory.md#birthday>)

- [플랫폼별 적용·검수·공식 문서](<platform-adoption.md#three-pbr>)

<a id="technology-webgpu"></a>
### WebGPU·WGSL

`webgpu` · `candidate` · `api` · web

브라우저의 GPU 렌더·컴퓨트 패스를 직접 구성한다.

- **쓸 때:** 대량 입자 시뮬레이션이나 GPU 컴퓨트가 핵심이며 대상 환경이 지원할 때.
- **필요 조건:** 안전한 컨텍스트, 지원 브라우저·어댑터·디바이스와 기능 검사.
- **제약:** Canvas/SVG 또는 WebGL보다 구현·디버깅과 호환성 확인 부담이 크다.
- **검수:** 어댑터 부재, 기능 한도, 디바이스 손실, 정적 대안.
- [공식 참고](https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API)

<a id="technology-baked-3d"></a>
### 사전 렌더 3D·영상·이미지 시퀀스

`baked-3d` · `candidate` · `workflow` · web, ios, macos, android, windows, linux

복잡한 모델·조명을 미리 계산해 이미지나 영상으로 출력한다.

- **쓸 때:** 고정된 구도·카메라·모션만 필요하고 사용자 조작은 없는 경우.
- **필요 조건:** 권리 확인 자산, 오프라인 렌더러·인코더, 대상 포맷.
- **제약:** 실시간 회전·조명 변경은 불가능하며 영상 전송량을 관리해야 한다.
- **검수:** 장면 이음새, 프레임 대비, 정지 poster, 모바일 디코딩.
- [공식 참고](https://docs.blender.org/manual/en/latest/render/)

<a id="technology-react-three-fiber"></a>
### React Three Fiber

`react-three-fiber` · `candidate` · `library` · web

React 컴포넌트 구조로 Three.js 장면을 구성한다.

- **쓸 때:** React 상태와 3D 장면을 연결하는 제품 뷰어·공간화면.
- **필요 조건:** 호환되는 React·Three·R3F 버전, GPU 환경과 모델.
- **제약:** 고정된 제품 컷에는 사전 렌더가 더 단순하다.
- **검수:** 프레임 루프·렌더 호출, 모델 로더, dispose, DOM 접근성.
- [공식 참고](https://r3f.docs.pmnd.rs/)

<a id="technology-babylonjs"></a>
### Babylon.js

`babylonjs` · `candidate` · `engine` · web

웹 3D 장면·재질·자산 로딩과 렌더 파이프라인을 제공한다.

- **쓸 때:** 웹 3D 씬과 엔진 기능이 여러 요구를 한 번에 충족할 때.
- **필요 조건:** 선택한 렌더 백엔드 지원과 실제 자산.
- **제약:** 간단한 3D 한 요소에는 엔진 번들과 상태 관리가 과할 수 있다.
- **검수:** 기기별 백엔드, 모델·색 관리, 텍스처와 화면 우선순위.
- [공식 참고](https://doc.babylonjs.com/)

<a id="technology-model-viewer"></a>
### &lt;model-viewer&gt;

`model-viewer` · `candidate` · `library` · web

표준 모델 자산을 DOM에서 조작 가능한 3D 뷰어로 보여준다.

- **쓸 때:** 제품 회전·줌이 필요하지만 커스텀 렌더러가 주제는 아닐 때.
- **필요 조건:** 유효한 GLB/glTF, 뷰어 라이브러리 및 AR은 대상별 자산·기기.
- **제약:** 특수 셰이더나 장면 상태의 자유도는 전용 3D 엔진보다 낮다.
- **검수:** 포스터, 모델 오류, 터치-스크롤 충돌과 접근 가능한 설명.
- [공식 참고](https://modelviewer.dev/)

<a id="technology-webxr"></a>
### WebXR

`webxr` · `candidate` · `api` · web

지원 브라우저에서 몰입형 AR/VR 세션·시점·입력을 제공한다.

- **쓸 때:** 기기에서 공간 위치·시선·손/컨트롤러 입력까지 필요한 웹 경험.
- **필요 조건:** 브라우저·기기·세션 모드 지원, 안전한 컨텍스트와 사용자 제스처.
- **제약:** 모바일과 헤드셋 간 기능 차이가 커 2D 대안이 필요하다.
- **검수:** 권한 거부, 세션 종료·복귀, 입력 경계와 멀미 요인.
- [공식 참고](https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API)

<a id="technology-metal-api"></a>
### Metal·MetalKit·MSL

`metal-api` · `candidate` · `api` · ios, macos, visionos

Apple 기기에서 GPU 패스·컴퓨트·텍스처를 직접 제어한다.

- **쓸 때:** Apple 앱에서 커스텀 셰이더·다중 패스 후처리가 핵심일 때.
- **필요 조건:** Xcode와 대상 GPU·OS 기능, MSL 구현.
- **제약:** GLSL/WGSL을 그대로 복사하지 않으며 구현·유지 비용이 높다.
- **검수:** Metal API Validation, 프레임 캡처, GPU 시간과 장치 생성 실패.
- [공식 참고](https://developer.apple.com/documentation/metal)

<a id="technology-realitykit"></a>
### RealityKit·Reality Composer Pro

`realitykit` · `candidate` · `framework` · ios, macos, visionos

Apple 장면·엔티티·재질을 구성하고 대상 기기의 공간 기능에 연결한다.

- **쓸 때:** Apple 기기에서 실제 장면 모델과 조명·공간 상호작용을 구성할 때.
- **필요 조건:** 지원 Xcode·OS·기기, 호환되는 3D 자산과 기능별 API.
- **제약:** 플랫폼별 공간 API가 다르며 웹 GLB 장면이 그대로 이식되지는 않는다.
- **검수:** 모델 단위·축·피벗, 실제 기기 입력, 조명과 접근성.
- [공식 참고](https://developer.apple.com/documentation/realitykit)

<a id="category-motion-media"></a>
## 모션·영상·오디오

<a id="technology-motion-lifecycle"></a>
### 모션·포인터·렌더 수명

`motion-lifecycle` · `source-backed` · `technique` · web

CSS/WAAPI/requestAnimationFrame과 사용자 모션 설정·가시성·정지 제어를 연결한다. 시안마다 지원 범위가 다르다.

- 실제 사용: [ascii-character](<design-inventory.md#ascii-character>), [liquid-glass](<design-inventory.md#liquid-glass>), [midnight-cinema-3d](<design-inventory.md#midnight-cinema-3d>), [birthday](<design-inventory.md#birthday>), [black-editorial](<design-inventory.md#black-editorial>), [screen-effects](<design-inventory.md#screen-effects>)

- [플랫폼별 적용·검수·공식 문서](<platform-adoption.md#motion-lifecycle>)

<a id="technology-css-light-state"></a>
### CSS 상태 기반 조명·막 전환

`css-light-state` · `source-backed` · `technique` · web

@property --house와 :has(#house-lights:checked)로 하나의 수치가 SVG 광원·막·제목 상태를 함께 바꾼다.

- 실제 사용: [midnight-cinema](<design-inventory.md#midnight-cinema>), [midnight-cinema-3d](<design-inventory.md#midnight-cinema-3d>)

- [플랫폼별 적용·검수·공식 문서](<platform-adoption.md#css-light-state>)

<a id="technology-web-audio"></a>
### Web Audio·호흡 분석·재생 정책

`web-audio` · `source-backed` · `api` · web

RMS와 700–9000Hz 에너지 비율로 호흡을 추정하고 사용자 제스처에서 음악·박수 재생을 준비한다.

- 실제 사용: [birthday](<design-inventory.md#birthday>)

- [플랫폼별 적용·검수·공식 문서](<platform-adoption.md#web-audio>)

<a id="technology-css-animations"></a>
### CSS 전환·키프레임

`css-animations` · `candidate` · `api` · web

상태별 스타일 변화와 단순 타임라인을 CSS에서 정의한다.

- **쓸 때:** 호버, 포커스, 선택 피드백과 짧은 등장에 별도 JS가 불필요할 때.
- **필요 조건:** 의미 있는 시작·끝 상태와 동작 줄이기 규칙.
- **제약:** 여러 요소의 중단·역전·진행 제어는 코드 기반 타임라인이 유리하다.
- **검수:** 전환 중 빠른 재입력, 모션 감소, 레이아웃 유발 속성.
- [공식 참고](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations)

<a id="technology-web-animations-api"></a>
### Web Animations API

`web-animations-api` · `candidate` · `api` · web

브라우저 애니메이션을 JavaScript에서 생성·정지·역재생한다.

- **쓸 때:** 브라우저 기본 기능으로 단계별 상태에 맞춰 움직임을 제어할 때.
- **필요 조건:** 지원 브라우저와 대상 노드의 수명 관리.
- **제약:** 복잡한 다중 트랙은 라이브러리보다 직접 설계할 부분이 많다.
- **검수:** cancel·finish·reverse, 보이는 상태, 전환 중 제거.
- [공식 참고](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)

<a id="technology-view-transitions"></a>
### View Transition API

`view-transitions` · `candidate` · `api` · web

뷰의 전후 상태를 브라우저 캡처로 이어 시각적 연속성을 만든다.

- **쓸 때:** 목록→상세처럼 같은 항목의 맥락을 보존할 때.
- **필요 조건:** 전환 유형별 브라우저 지원과 즉시 변경 대안.
- **제약:** 캡처와 레이어 처리에 비용이 있으며 불필요한 이동에는 쓰지 않는다.
- **검수:** 키보드 포커스, 같은 이름 충돌, 뒤로 가기와 동작 줄이기.
- [공식 참고](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API)

<a id="technology-scroll-animations"></a>
### CSS Scroll-driven Animations

`scroll-animations` · `candidate` · `api` · web

스크롤 위치 또는 뷰의 등장 범위를 움직임에 매핑한다.

- **쓸 때:** 스크롤을 빼앗지 않고 장식이나 진행 표식을 연결할 때.
- **필요 조건:** 대상 브라우저의 해당 타임라인 지원과 움직임 없는 상태.
- **제약:** 콘텐츠가 진입 애니메이션에 의해 가려지면 읽기와 조작이 깨진다.
- **검수:** 급한 스크롤, 감소 모드, 키보드 점프, 지원 실패.
- [공식 참고](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll-driven_animations)

<a id="technology-motion"></a>
### Motion

`motion` · `candidate` · `library` · web

React 등의 상태를 제스처·스프링·입장/퇴장 모션과 연결한다.

- **쓸 때:** 여러 컴포넌트의 레이아웃·제스처 전환이 서로 맞물릴 때.
- **필요 조건:** 호환되는 Motion 패키지와 UI 스택.
- **제약:** 단순 hover에는 기본 CSS가 더 가볍다.
- **검수:** 중단과 재입력, Reduced Motion, 터치와 포커스.
- [공식 참고](https://motion.dev/docs)

<a id="technology-gsap"></a>
### GSAP

`gsap` · `candidate` · `library` · web

여러 요소와 수치의 타임라인·이징을 코드로 조정한다.

- **쓸 때:** 연출이 정교한 시퀀스에서 동기화·중단 제어가 필요할 때.
- **필요 조건:** 프로젝트 의존성과 사용하는 플러그인·조건 확인.
- **제약:** 효과 중심 구조가 화면 읽기와 사용자 제어를 침범하지 않아야 한다.
- **검수:** 정리·언마운트, 키보드, 모바일 스크롤, 중간 상태.
- [공식 참고](https://gsap.com/docs/v3/)

<a id="technology-lottie"></a>
### Lottie

`lottie` · `candidate` · `format` · web, ios, android

호환되는 벡터·레이어 동작을 지정된 런타임에서 재생한다.

- **쓸 때:** 편집 도구에서 만든 아이콘·전환 모션을 여러 클라이언트에서 재생할 때.
- **필요 조건:** 호환되는 JSON 내보내기와 플랫폼 플레이어.
- **제약:** 저작 도구의 모든 효과·폰트·표현식이 내보내지는 것은 아니다.
- **검수:** 루프 끝, 텍스트·마스크 지원, Reduce Motion과 정적 대안.
- [공식 참고](https://lottiefiles.com/what-is-lottie)

<a id="technology-rive"></a>
### Rive

`rive` · `candidate` · `tool` · web, ios, macos, android, windows, linux

그래픽 에디터의 상태 머신과 벡터 애니메이션을 런타임 입력에 연결한다.

- **쓸 때:** 캐릭터나 컨트롤의 동작이 선택·입력 이벤트와 연동되어야 할 때.
- **필요 조건:** 편집 접근, .riv 자산, 대상 런타임·렌더러와 배포 조건.
- **제약:** 복잡한 상태 머신을 코드 상태와 이중 관리하지 않게 분리해야 한다.
- **검수:** 재진입·전환 취소, 런타임 폰트·이미지, 정적 대안.
- [공식 참고](https://rive.app/docs/)

<a id="technology-web-video"></a>
### HTML Video·사전 제작 모션

`web-video` · `candidate` · `api` · web

미리 만든 반복 애니메이션을 비디오와 정지 포스터로 제시한다.

- **쓸 때:** 사용자가 카메라나 재질을 바꿀 필요가 없는 고정 모션.
- **필요 조건:** 권리 확인 영상, 호환 코덱과 브라우저 재생 정책.
- **제약:** 고해상도 파일은 네트워크·디코딩 비용이 들며 모바일 자동 재생은 조건부다.
- **검수:** 자막, 정지·재개, 움직임 감소, 로딩 실패와 루프 이음새.
- [공식 참고](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video)

<a id="technology-webcodecs"></a>
### WebCodecs

`webcodecs` · `candidate` · `api` · web

영상·오디오 프레임과 인코더/디코더를 낮은 수준에서 다룬다.

- **쓸 때:** 브라우저 영상 편집기나 프레임별 합성·내보내기가 필요할 때.
- **필요 조건:** 지원 코덱·브라우저와 파일 컨테이너를 파싱하거나 조립할 경로.
- **제약:** 일반 재생에는 HTML Video가 단순하며 프레임 수명을 직접 관리한다.
- **검수:** 코덱 지원, 타임스탬프, 큐 역압과 VideoFrame 해제.
- [공식 참고](https://developer.mozilla.org/en-US/docs/Web/API/WebCodecs_API)

<a id="technology-remotion"></a>
### Remotion

`remotion` · `candidate` · `framework` · macos, windows, linux

React 구성의 프레임을 오프라인 영상으로 렌더링한다.

- **쓸 때:** 카피나 데이터를 바꾸며 여러 버전의 모션 그래픽을 만들 때.
- **필요 조건:** 호환 Node·브라우저 렌더 환경, 폰트·미디어와 사용 조건 확인.
- **제약:** 웹 시안의 런타임 모션과 달리 출력 영상은 상호작용하지 않는다.
- **검수:** 폰트 로드, 프레임 결정성, 음성 싱크, 재생 파일 크기.
- [공식 참고](https://www.remotion.dev/docs/)

<a id="technology-ffmpeg"></a>
### FFmpeg

`ffmpeg` · `candidate` · `tool` · macos, windows, linux

미디어 메타데이터를 검사하고 프레임 추출·크롭·인코딩을 수행한다.

- **쓸 때:** 검수 표본 또는 여러 출력 크기·코덱을 반복 생성할 때.
- **필요 조건:** 로컬 실행 파일, 코덱 빌드 옵션과 자료 편집 권리.
- **제약:** 변환 시 색 공간·음량·정밀도를 잃을 수 있다.
- **검수:** 출력 비율·색 범위, 프레임률, 자막·오디오 싱크.
- [공식 참고](https://ffmpeg.org/documentation.html)

<a id="category-data-visualization"></a>
## 데이터 시각화·지도

<a id="technology-d3"></a>
### D3

`d3` · `candidate` · `library` · web

데이터 스케일·축·레이아웃·도형 생성을 조합한다.

- **쓸 때:** 표준 차트로 표현하기 어려운 차트나 사용자 정의 에디토리얼 그래픽.
- **필요 조건:** 데이터 모델, 출력(SVG·Canvas 등)과 범례 설계.
- **제약:** 완성 컴포넌트보다 제어는 많지만 탐색과 접근성을 직접 구성한다.
- **검수:** 축·단위·누락값, 키보드 경로, 요약이나 표 대안.
- [공식 참고](https://d3js.org/)

<a id="technology-observable-plot"></a>
### Observable Plot

`observable-plot` · `candidate` · `library` · web

마크·스케일·패싯 조합으로 비교 가능한 그래프를 만든다.

- **쓸 때:** 데이터 분포나 여러 그룹의 시각 비교를 빠르게 확인할 때.
- **필요 조건:** 정리된 데이터와 명시적 단위·누락 처리.
- **제약:** 복잡한 사용자 정의 조작은 따로 보완한다.
- **검수:** 동일 비교 축, 누락값, 차트를 읽을 수 없는 사용자의 대안.
- [공식 참고](https://observablehq.com/plot/)

<a id="technology-vega-lite"></a>
### Vega-Lite

`vega-lite` · `candidate` · `library` · web

데이터·마크·인코딩·선택을 선언형 스펙으로 표현한다.

- **쓸 때:** 여러 차트를 설정 데이터로 버전 관리하거나 재생성할 때.
- **필요 조건:** 호환 스펙·런타임과 사내 데이터 정책.
- **제약:** 스펙으로 표현하기 곤란한 화면은 커스텀 코드를 요구한다.
- **검수:** 통계 집계, 축 도메인, 범례·키보드·데이터 대안.
- [공식 참고](https://vega.github.io/vega-lite/)

<a id="technology-echarts"></a>
### Apache ECharts

`echarts` · `candidate` · `library` · web

여러 표준 차트 유형과 상호작용 옵션을 제공한다.

- **쓸 때:** 범례·줌·툴팁을 갖춘 여러 차트가 제품에 필요할 때.
- **필요 조건:** 차트 모듈과 대상 렌더러 선택, 입력 데이터 처리.
- **제약:** 기본 테마·툴팁은 제품 기준과 밀도에 맞춰 조정한다.
- **검수:** 리사이즈, 대량 데이터, 마우스 없이 읽을 요약.
- [공식 참고](https://echarts.apache.org/en/index.html)

<a id="technology-chartjs"></a>
### Chart.js

`chartjs` · `candidate` · `library` · web

Canvas로 표준 막대·선·버블 등 차트를 구성한다.

- **쓸 때:** 일반 제품 지표를 표준 차트로 제공할 때.
- **필요 조건:** Canvas와 차트 데이터·스케일의 명시적 설정.
- **제약:** Canvas가 데이터 포인트의 접근성을 자체 제공하지 않는다.
- **검수:** 축의 기준선·중복 레이블, 리사이즈, 읽을 수 있는 표 대안.
- [공식 참고](https://www.chartjs.org/docs/latest/)

<a id="technology-maplibre"></a>
### MapLibre GL JS

`maplibre` · `candidate` · `library` · web

지도 타일·스타일·라벨과 상호작용 레이어를 렌더링한다.

- **쓸 때:** 지리 위치와 줌 단계에 따라 콘텐츠를 탐색할 때.
- **필요 조건:** GPU와 권한 있는 타일·스타일·폰트·출처 표기.
- **제약:** 비공개 지도 타일이나 주소를 승인 없이 외부 서버에 보내지 않는다.
- **검수:** 타일 실패, 표기, 키보드 조작, 위치 목록 등의 대안.
- [공식 참고](https://maplibre.org/maplibre-gl-js/docs/)

<a id="technology-deckgl"></a>
### deck.gl

`deckgl` · `candidate` · `library` · web

대량 데이터의 점·경로·집계를 GPU 레이어로 그린다.

- **쓸 때:** 대규모 지리·공간 데이터를 표준 지도 레이어로 감당하기 어려울 때.
- **필요 조건:** 지원 GPU, 올바른 좌표계와 선택한 지도 연동.
- **제약:** 단순 지도나 소규모 마커에는 비용이 과할 수 있다.
- **검수:** 히트 테스트, 레이어 수, 좌표계와 재사용 가능한 데이터 요약.
- [공식 참고](https://deck.gl/docs)

<a id="category-native-cross-platform"></a>
## 네이티브·크로스플랫폼 UI

<a id="technology-swiftui"></a>
### SwiftUI

`swiftui` · `candidate` · `framework` · ios, macos, visionos

Apple 플랫폼에서 선언형 구성과 접근성 통합 네이티브 컨트롤을 제공한다.

- **쓸 때:** 기존 SwiftUI 앱이나 Apple 운영체제의 입력·레이아웃에 맞는 새 화면.
- **필요 조건:** Xcode와 최소 OS에 맞춘 API 분기 및 시뮬레이터/기기.
- **제약:** 웹의 좌표·글꼴 크기를 그대로 이식하지 않으며 동작별 OS 제약이 있다.
- **검수:** Dynamic Type, VoiceOver, 안전 영역, 다양한 창 크기와 접근성.
- [공식 참고](https://developer.apple.com/documentation/swiftui)

<a id="technology-uikit"></a>
### UIKit

`uikit` · `candidate` · `framework` · ios

Apple 모바일 앱 뷰·입력·뷰컨트롤러를 직접 구성한다.

- **쓸 때:** UIKit 기존 화면/컴포넌트를 보존하거나 구체적인 UIKit 제어가 필요할 때.
- **필요 조건:** Xcode, 최소 OS, 기존 화면·상태·레이아웃 계약.
- **제약:** SwiftUI Host 사용 시 상태와 크기 전달 경계가 생긴다.
- **검수:** 회전과 안전 영역, VoiceOver, 포커스·재사용 셀.
- [공식 참고](https://developer.apple.com/documentation/uikit)

<a id="technology-appkit"></a>
### AppKit

`appkit` · `candidate` · `framework` · macos

macOS의 창·메뉴·텍스트·문서와 데스크톱 입력을 구성한다.

- **쓸 때:** 기존 Mac 앱을 확장하거나 복잡한 데스크톱 조작이 필요할 때.
- **필요 조건:** Xcode와 최소 macOS, 메뉴·리사이즈·다중 창 정의.
- **제약:** 모바일 터치 화면으로 기계적으로 이전할 수 없다.
- **검수:** 키보드 메뉴, 탭·창 상태, Retina와 창 최소 폭.
- [공식 참고](https://developer.apple.com/documentation/appkit)

<a id="technology-jetpack-compose"></a>
### Jetpack Compose

`jetpack-compose` · `candidate` · `framework` · android

Kotlin으로 Android UI와 상태·동작을 선언적으로 구성한다.

- **쓸 때:** Compose 앱 또는 Android 환경을 보존한 화면 제작.
- **필요 조건:** Android SDK, Gradle·Compose 호환 버전과 에뮬레이터/기기.
- **제약:** 기존 View 화면과 혼용하면 상태·포커스·전환 경계를 설계한다.
- **검수:** 폰트 스케일, TalkBack, 회전, 인셋과 화면 크기.
- [공식 참고](https://developer.android.com/develop/ui/compose)

<a id="technology-compose-multiplatform"></a>
### Compose Multiplatform

`compose-multiplatform` · `candidate` · `framework` · android, ios, macos, windows, linux, web

Kotlin 공용 모듈의 Compose UI를 여러 대상에 구성한다.

- **쓸 때:** Kotlin 팀이 공유 UI를 쓰되 대상별 기능을 분리할 때.
- **필요 조건:** 대상별 SDK·빌드 환경과 선택 버전의 지원 상태 확인.
- **제약:** 플랫폼별 입력·폰트·라이브러리 차이는 남는다.
- **검수:** 각 대상 빌드·키보드·접근성·폴백 폰트.
- [공식 참고](https://www.jetbrains.com/compose-multiplatform/)

<a id="technology-flutter"></a>
### Flutter

`flutter` · `candidate` · `framework` · ios, android, web, macos, windows, linux

Dart 위젯과 커스텀 드로잉으로 여러 플랫폼의 UI를 제작한다.

- **쓸 때:** 대상 사이에 브랜드 UI와 로직을 많이 공유할 때.
- **필요 조건:** Flutter SDK, 대상 툴체인, 기기와 플러그인 지원 확인.
- **제약:** 모든 OS의 관례나 네이티브 통합이 동일해지는 것은 아니다.
- **검수:** 폰트와 의미 트리, 데스크톱 키보드, 플랫폼별 성능.
- [공식 참고](https://docs.flutter.dev/)

<a id="technology-react-native"></a>
### React Native

`react-native` · `candidate` · `framework` · ios, android

React 모델과 모바일 네이티브 컴포넌트를 연결한다.

- **쓸 때:** React 팀이 iOS·Android UI를 공유하되 OS 입력 관례를 유지할 때.
- **필요 조건:** Node·호환 React Native 및 플랫폼 빌드 도구.
- **제약:** DOM/CSS 전체를 가져올 수 없고 네이티브 모듈은 따로 의존한다.
- **검수:** 실기기 입력·글자 확대·목록 성능과 네이티브 기능 실패.
- [공식 참고](https://reactnative.dev/docs/getting-started)

<a id="technology-expo"></a>
### Expo

`expo` · `candidate` · `framework` · ios, android, web

React Native 앱 개발·프리뷰·플랫폼 모듈 구성 경로를 제공한다.

- **쓸 때:** 모바일 시안을 기기에서 반복 검토하거나 이미 Expo를 쓰는 프로젝트.
- **필요 조건:** 지원 SDK·라이브러리, 기기와 필요시 개발 빌드.
- **제약:** Expo Go에서 모든 네이티브 모듈이 실행되지는 않는다.
- **검수:** 기기 권한, 개발 빌드와 배포 빌드 차이, 네비게이션.
- [공식 참고](https://docs.expo.dev/)

<a id="technology-electron"></a>
### Electron

`electron` · `candidate` · `framework` · macos, windows, linux

웹 기반 앱을 데스크톱 창과 OS 통합으로 제공한다.

- **쓸 때:** 기존 웹 UI를 유지하며 데스크톱 기능을 추가할 때.
- **필요 조건:** 대상 패키징·서명, 명확한 앱/렌더러 메시지 경계.
- **제약:** 번들과 메모리 비용이 있으며 데스크톱 단축키·메뉴는 재설계한다.
- **검수:** 여러 창, 오프라인, 키보드·메뉴와 최신 지원 런타임.
- [공식 참고](https://www.electronjs.org/docs/latest/)

<a id="technology-tauri"></a>
### Tauri

`tauri` · `candidate` · `framework` · macos, windows, linux, ios, android

웹 UI와 Rust 호스트를 연결하고 플랫폼 WebView를 사용한다.

- **쓸 때:** 기존 웹 UI를 소형 데스크톱 패키지 후보로 평가할 때.
- **필요 조건:** Rust·시스템 WebView·플랫폼 SDK와 권한 범위.
- **제약:** OS별 WebView 차이와 기능 플러그인을 검수해야 한다.
- **검수:** 폰트·렌더링 차이, 다중 창, 권한 거부와 설치본.
- [공식 참고](https://v2.tauri.app/)

<a id="technology-dotnet-maui"></a>
### .NET MAUI

`dotnet-maui` · `candidate` · `framework` · ios, android, macos, windows

공유 .NET UI와 각 플랫폼의 핸들러를 구성한다.

- **쓸 때:** .NET 팀이 모바일 및 데스크톱의 UI와 로직을 재사용할 때.
- **필요 조건:** 지원 .NET 워크로드 및 대상 SDK. iOS 빌드 환경을 별도로 확인.
- **제약:** 세부 입력·그리기 동작은 대상별로 다를 수 있다.
- **검수:** 폰트, 화면 이동, 접근성과 핸들러별 동작.
- [공식 참고](https://learn.microsoft.com/dotnet/maui/)

<a id="technology-winui"></a>
### WinUI 3

`winui` · `candidate` · `framework` · windows

Windows 앱 SDK에서 데스크톱용 네이티브 스타일과 컨트롤을 제공한다.

- **쓸 때:** Windows 전용 앱과 Fluent 기반 경험이 필요할 때.
- **필요 조건:** Windows App SDK·Visual Studio·대상 Windows와 패키징 설정.
- **제약:** 타 OS에 그대로 이전할 수 없으며 창과 입력 정책을 점검한다.
- **검수:** 고대비, 배율, 키보드, 여러 모니터와 설치 경로.
- [공식 참고](https://learn.microsoft.com/windows/apps/winui/)

<a id="technology-qt-quick"></a>
### Qt Quick·QML

`qt-quick` · `candidate` · `framework` · macos, windows, linux, android, ios

QML로 상태·애니메이션을 갖춘 UI와 네이티브 코드를 구성한다.

- **쓸 때:** Qt 제품의 데스크톱·임베디드 화면 또는 장시간 작동 UI.
- **필요 조건:** 지원 Qt 빌드·대상 GPU·배포 라이선스.
- **제약:** 텍스트·접근성·입력을 기기 유형별로 설계한다.
- **검수:** 그래픽 백엔드, 한글 폰트, 기기 성능, 터치와 키보드.
- [공식 참고](https://doc.qt.io/qt-6/qtquick-index.html)

<a id="category-game-engines"></a>
## 게임·인터랙티브 엔진

<a id="technology-unity"></a>
### Unity·UI Toolkit·URP

`unity` · `candidate` · `engine` · macos, windows, linux

장면·재질·입력과 게임 UI를 엔진에서 조합한다.

- **쓸 때:** 기존 Unity 월드·게임에 메뉴나 HUD·3D 효과를 통합할 때.
- **필요 조건:** 대상 빌드 모듈, 프로젝트의 렌더 파이프라인과 에디터.
- **제약:** 웹 그래픽이나 GLSL을 그대로 복제하지 않는다.
- **검수:** 플랫폼 빌드, 패드 포커스, 프레임 예산, 에셋 임포트.
- [공식 참고](https://docs.unity3d.com/)

<a id="technology-godot"></a>
### Godot·Control·CanvasItem

`godot` · `candidate` · `engine` · macos, windows, linux

노드·Control UI·2D/3D 재질과 입력 액션을 조합한다.

- **쓸 때:** 가벼운 시뮬레이션이나 기존 Godot 게임에 조작 UI를 적용할 때.
- **필요 조건:** 엔진과 선택 렌더러, 대상 플랫폼의 내보내기 템플릿.
- **제약:** 렌더러·플랫폼별 기능 차이가 있으며 웹 CSS가 이식되는 건 아니다.
- **검수:** 컨테이너 크기, 포커스, 입력 재매핑, 내보낸 빌드.
- [공식 참고](https://docs.godotengine.org/)

<a id="technology-unreal"></a>
### Unreal Engine·UMG·Niagara

`unreal` · `candidate` · `engine` · macos, windows, linux

실시간 장면·재질·입자·연출과 UMG 게임 UI를 구성한다.

- **쓸 때:** Unreal 기반 게임이나 실시간 시네마틱 장면과 UI가 연동될 때.
- **필요 조건:** 엔진 버전·SDK·기기 GPU와 타깃 렌더 설정.
- **제약:** 에디터 프리뷰의 결과와 최소 기기·내보낸 빌드는 다를 수 있다.
- **검수:** 텍스처·셰이더 컴파일, 낮은 품질 단계, UI 포커스와 입력.
- [공식 참고](https://dev.epicgames.com/documentation/en-us/unreal-engine)

<a id="technology-spritekit"></a>
### SpriteKit

`spritekit` · `candidate` · `framework` · ios, macos

Apple 플랫폼에서 2D 노드·액션·입자·물리를 구성한다.

- **쓸 때:** Apple 앱 내부에서 경량 2D 게임이나 장면이 필요한 경우.
- **필요 조건:** Xcode, 대상 OS와 장면 호스팅.
- **제약:** 일반 텍스트·폼 같은 앱 UI는 별도 네이티브 컨트롤이 적합하다.
- **검수:** 텍스처 크기, scene lifecycle, 터치와 좌표 변화.
- [공식 참고](https://developer.apple.com/documentation/spritekit)

<a id="technology-phaser"></a>
### Phaser

`phaser` · `candidate` · `engine` · web

브라우저에서 2D 장면·입력·텍스처·게임 루프를 구성한다.

- **쓸 때:** HTML 화면에 게임 수준의 관리되는 장면과 입력이 필요할 때.
- **필요 조건:** 브라우저 렌더러와 게임 자산·로딩 상태.
- **제약:** 단순한 2D 연출은 Canvas나 CSS로 충분할 수 있다.
- **검수:** 일시정지, 리사이즈, 터치, DOM으로 제공할 조작 대안.
- [공식 참고](https://docs.phaser.io/)

<a id="technology-playcanvas"></a>
### PlayCanvas

`playcanvas` · `candidate` · `engine` · web

웹 대상 실시간 3D 장면·모델·재질·입력을 구성한다.

- **쓸 때:** 상호작용 3D 웹 콘텐츠에 엔진과 장면 편집 환경이 필요한 경우.
- **필요 조건:** 그래픽 지원, 에셋 접근 권한과 사용하는 에디터 환경.
- **제약:** 단순 뷰어보다 씬 구조·프로젝트 운용과 번들 추가 비용이 있다.
- **검수:** 자산 로딩 실패, 모바일 입력, 저사양 렌더 예산.
- [공식 참고](https://developer.playcanvas.com/)

<a id="category-asset-authoring"></a>
## 시안·디자인 자산 제작

<a id="technology-gltf-assets"></a>
### Blender→GLB·모바일 자산 최적화

`gltf-assets` · `source-backed` · `workflow` · web, macos, windows, linux

원본 모델을 보존하고 메시 decimation·텍스처 축소·JPEG 압축으로 모바일 GLB를 만든다.

- 실제 사용: [birthday](<design-inventory.md#birthday>)

- [플랫폼별 적용·검수·공식 문서](<platform-adoption.md#gltf-assets>)

<a id="technology-figma"></a>
### Figma Design·Dev Mode

`figma` · `candidate` · `service` · web, macos, windows

레이아웃·컴포넌트·상태와 클릭 프로토타입을 협업 편집한다.

- **쓸 때:** 레이아웃·디자인 시스템을 비교하거나 팀에서 핸드오프할 때.
- **필요 조건:** 문서와 계정 권한. 직접 자동화는 별도 연동·지원 범위를 확인.
- **제약:** Figma 값·내보내기 결과가 제품 동작·반응형을 검증하지는 않는다.
- **검수:** 변수/변형, 긴 카피, 대상 브레이크포인트와 보낼 에셋 범위.
- [공식 참고](https://help.figma.com/)

<a id="technology-penpot"></a>
### Penpot

`penpot` · `candidate` · `service` · web

브라우저에서 벡터 UI·컴포넌트·프로토타입·검사값을 공유한다.

- **쓸 때:** 브라우저 협업이나 자체 호스팅을 고려하는 디자인 작업.
- **필요 조건:** 접근 권한과 서비스 또는 호스팅 환경.
- **제약:** 다른 디자인 앱 파일을 항상 완전히 가져오는 것은 아니다.
- **검수:** 폰트 권리, 프로토타입 흐름, SVG 출력과 프레임 일치.
- [공식 참고](https://help.penpot.app/)

<a id="technology-sketch"></a>
### Sketch

`sketch` · `candidate` · `tool` · macos

macOS에서 벡터 UI, 심볼과 라이브러리를 편집한다.

- **쓸 때:** Sketch 문서·컴포넌트 라이브러리가 프로젝트 원본일 때.
- **필요 조건:** macOS 앱, 파일·라이브러리 접근 및 폰트.
- **제약:** 도구 간 심볼·제약이 손실 없이 변환된다고 가정하지 않는다.
- **검수:** 심볼 재정의, 글꼴, 대상 스케일과 승인된 내보내기.
- [공식 참고](https://www.sketch.com/docs/)

<a id="technology-photoshop"></a>
### Photoshop

`photoshop` · `candidate` · `tool` · macos, windows

사진 컷아웃·보정·레이어 합성으로 피사체와 배경을 편집한다.

- **쓸 때:** 촬영 이미지와 조명·재질의 세밀한 편집이 핵심일 때.
- **필요 조건:** 설치·사용 권한과 편집 허용 원본·색 프로파일.
- **제약:** 레이어를 보존하는 원본과 제품용 압축 출력을 분리한다.
- **검수:** 마스크 가장자리, 절반 화면·크롭, 색역과 원본 권리.
- [공식 참고](https://helpx.adobe.com/photoshop/user-guide.html)

<a id="technology-illustrator"></a>
### Illustrator

`illustrator` · `candidate` · `tool` · macos, windows

로고·패스·포스터 등 벡터와 인쇄용 자산을 제작한다.

- **쓸 때:** 다양한 크기와 인쇄·디지털 출력에 쓰는 원본 선이 필요할 때.
- **필요 조건:** 설치 권한, 폰트·원본과 출력 규격.
- **제약:** 복잡한 편집 효과가 웹 SVG에서 동일하게 유지되지 않을 수 있다.
- **검수:** 뷰박스, 폰트 처리, 소형 크기·채널·출력 규격.
- [공식 참고](https://helpx.adobe.com/illustrator/user-guide.html)

<a id="technology-inkscape"></a>
### Inkscape

`inkscape` · `candidate` · `tool` · macos, windows, linux

SVG 기반으로 그림·도형·타이포그래피를 편집한다.

- **쓸 때:** 웹·앱의 아이콘과 벡터 원본을 별도 앱에서 제작할 때.
- **필요 조건:** 로컬 앱 또는 CLI 및 폰트·자산.
- **제약:** 편집기 전용 데이터와 일부 필터가 렌더러에서 다를 수 있다.
- **검수:** 플레인 SVG·PNG 출력, 패스 단순화·뷰박스와 파일 크기.
- [공식 참고](https://inkscape.org/learn/)

<a id="technology-blender"></a>
### Blender·Cycles·EEVEE

`blender` · `candidate` · `tool` · macos, windows, linux

모델·재질·리그·렌더링을 만들고 이미지·영상·모델을 출력한다.

- **쓸 때:** 제품·캐릭터·공간의 3D 원본이나 고정 조명 컷이 필요할 때.
- **필요 조건:** Blender 환경·스크립트 접근·권리 확인 자산과 렌더 예산.
- **제약:** 고품질 EEVEE/Cycles 장면이 브라우저·게임에서 그대로 나오지 않는다.
- **검수:** 메시·재질 Bake, 단위·축, 애니메이션, 모델 파일과 출력 용량.
- [공식 참고](https://docs.blender.org/manual/en/latest/)

<a id="technology-houdini"></a>
### Houdini

`houdini` · `candidate` · `tool` · macos, windows, linux

노드 기반으로 반복 가능한 모델링·입자·시뮬레이션을 구성한다.

- **쓸 때:** 여러 변형의 절차적 장면이나 시뮬레이션을 자산으로 내보낼 때.
- **필요 조건:** 지원 설치·라이선스와 시뮬레이션 메모리/캐시 예산.
- **제약:** 단발 자산에는 복잡하며 출력 사용 조건·플러그인 경계가 있다.
- **검수:** 시드와 버전 고정, 캐시 크기·축, 런타임 포맷.
- [공식 참고](https://www.sidefx.com/docs/houdini/)

<a id="technology-touchdesigner"></a>
### TouchDesigner

`touchdesigner` · `candidate` · `tool` · macos, windows

노드 기반으로 영상·그래픽과 센서·오디오 입력을 연결한다.

- **쓸 때:** 전시나 라이브 쇼처럼 현장에서 입력에 반응하는 그래픽.
- **필요 조건:** 설치·라이선스, 지원 GPU와 인터페이스·장비 접근.
- **제약:** 설치 작업물은 일반 브라우저로 직접 옮겨지지 않는다.
- **검수:** 실제 장비 입출력, 프레임 예산, 신호 끊김 후 복구.
- [공식 참고](https://docs.derivative.ca/)

<a id="technology-after-effects"></a>
### After Effects

`after-effects` · `candidate` · `tool` · macos, windows

키프레임·합성·효과를 편집하고 영상 또는 호환 벡터 동작을 출력한다.

- **쓸 때:** 타이포·제품 연출의 정확한 타이밍과 오프라인 합성이 필요할 때.
- **필요 조건:** 편집 앱·폰트·플러그인 권리 및 라운드트립 지원 확인.
- **제약:** 모든 효과가 Lottie 등 런타임 포맷에 대응하지 않는다.
- **검수:** 프레임·색상·알파, 자막과 웹/앱 출력 비교.
- [공식 참고](https://helpx.adobe.com/after-effects/user-guide.html)

<a id="technology-davinci-resolve"></a>
### DaVinci Resolve·Fusion

`davinci-resolve` · `candidate` · `tool` · macos, windows, linux

영상 편집·색보정·합성과 마스터 출력에 사용한다.

- **쓸 때:** 실사 레퍼런스를 재자산화하거나 시안용 영상을 제작할 때.
- **필요 조건:** 실행 앱, 지원 GPU/코덱과 편집 권리.
- **제약:** 최종 마스터와 웹용 용량·색 설정은 별개다.
- **검수:** 색 관리, 자막 타임코드, 용량·지원 포맷.
- [공식 참고](https://www.blackmagicdesign.com/products/davinciresolve)

<a id="technology-image-formats"></a>
### AVIF·WebP·PNG·반응형 이미지

`image-formats` · `candidate` · `workflow` · web, macos, windows, linux

화면과 이미지 유형에 맞춰 해상도와 압축 포맷을 내보낸다.

- **쓸 때:** 사진·그레인·투명 자산의 선명도와 전송량을 최적화할 때.
- **필요 조건:** 인코더·권한 있는 원본, 지원 포맷/색과 대체 경로.
- **제약:** 강한 압축은 미세 표식·텍스처와 반투명 경계를 뭉갠다.
- **검수:** 작은 화면 크롭·픽셀 밀도, LCP, 알파·색상과 대체 루트.
- [공식 참고](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Image_types)

<a id="technology-svgo"></a>
### SVGO

`svgo` · `candidate` · `tool` · macos, windows, linux

SVG의 불필요한 메타데이터·정밀도·속성을 변환한다.

- **쓸 때:** 반복해서 쓰는 아이콘과 벡터를 빌드에서 정리할 때.
- **필요 조건:** 지원 Node와 SVGO 플러그인 구성.
- **제약:** 공격적 최적화가 ID 참조·제목·경계까지 제거할 수 있다.
- **검수:** 그라데이션/마스크 ID, title, viewBox를 유지하며 전후 픽셀 비교.
- [공식 참고](https://svgo.dev/)

<a id="technology-openusd"></a>
### OpenUSD·USDZ

`openusd` · `candidate` · `format` · macos, windows, linux, ios, visionos

3D 장면 구성·재질·변형과 패키지 자산을 교환한다.

- **쓸 때:** 여러 도구에서 장면을 조립하거나 USDZ를 요구하는 뷰어에 맞출 때.
- **필요 조건:** 대상 로더·도구가 지원하는 스키마와 텍스처 포함 방식.
- **제약:** 모든 재질·셰이더·리그가 도구 간 같게 출력되지 않을 수 있다.
- **검수:** 스케일·축·피벗, 텍스처 경로, 대상 앱 렌더 비교.
- [공식 참고](https://openusd.org/release/)

<a id="category-verification"></a>
## 미리보기·품질·접근성 검수

<a id="technology-playwright"></a>
### Playwright

`playwright` · `candidate` · `tool` · macos, windows, linux

브라우저에서 실제 조작을 재현하고 스크린샷·결과를 확인한다.

- **쓸 때:** 시안과 통합 화면의 뷰포트·상태·브라우저 차이를 반복 확인할 때.
- **필요 조건:** 브라우저 전용 패키지/도구, 대상 접속, 알려진 테스트 데이터와 폰트.
- **제약:** 에뮬레이션은 실기기를 대체하지 않으며 픽셀 비교는 환경차의 영향을 받는다.
- **검수:** 포커스와 실패 상태 테스트, 애니메이션 안정화, 스크린샷 기준 재현.
- [공식 참고](https://playwright.dev/docs/intro)

<a id="technology-storybook"></a>
### Storybook

`storybook` · `candidate` · `tool` · macos, windows, linux, web

독립 컴포넌트의 변형·상태를 격리해 확인한다.

- **쓸 때:** 재사용 UI의 긴 문구·오류·로딩·선택 사례를 팀이 비교할 때.
- **필요 조건:** 프로젝트 프레임워크에 맞는 빌더·스토리와 실제 스타일 로딩.
- **제약:** 격리 검수는 라우팅·서비스 데이터·페이지 문맥을 대신하지 않는다.
- **검수:** 키보드, 큰 글씨, 반응형, 페이지 통합 결과와 차이.
- [공식 참고](https://storybook.js.org/docs)

<a id="technology-axe-core"></a>
### axe-core

`axe-core` · `candidate` · `library` · web

브라우저 DOM에서 자동 판별 가능한 접근성 규칙을 검사한다.

- **쓸 때:** 접근성 기본 위반을 회귀 방지할 때.
- **필요 조건:** 렌더된 상태와 규칙 버전·검사 범위.
- **제약:** 자동 검사가 모든 문맥·키보드·보조 기술 경험을 보증하지 않는다.
- **검수:** 모달·오류·입력 상태마다 실행하고 직접 조작 결과와 대조.
- [공식 참고](https://www.deque.com/axe/)

<a id="technology-lighthouse"></a>
### Lighthouse

`lighthouse` · `candidate` · `tool` · macos, windows, linux

제어된 브라우저 조건에서 페이지 로딩·접근성 등을 점검한다.

- **쓸 때:** 웹 시안이 자산·폰트·모션을 추가한 전후의 성능을 비교할 때.
- **필요 조건:** 지원 Chromium 환경, 통제된 프로필과 실행 서버.
- **제약:** 한 번 측정한 실험실 점수는 실제 사용자 데이터가 아니다.
- **검수:** 같은 조건 반복·중앙값, 경로별 측정과 접근성 수동 확인.
- [공식 참고](https://developer.chrome.com/docs/lighthouse/overview/)

<a id="technology-browser-devtools"></a>
### 브라우저 DevTools·렌더링 추적

`browser-devtools` · `candidate` · `tool` · macos, windows, linux

실제 렌더링 폰트·레이아웃·페인트·요청·프레임 시간의 근거를 본다.

- **쓸 때:** 원인과 비용을 코드 선언이 아니라 실제 실행에서 확인할 때.
- **필요 조건:** 브라우저와 비교할 환경·뷰포트·테스트 콘텐츠.
- **제약:** DevTools가 켜진 환경의 추적만으로 실기기 성능을 단정하지 않는다.
- **검수:** 긴 작업, 자산 404, 글리프 fallback, 전후 프레임 비용.
- [공식 참고](https://developer.chrome.com/docs/devtools/)

<a id="technology-assistive-tech"></a>
### 키보드·VoiceOver·TalkBack·NVDA 검수

`assistive-tech` · `candidate` · `workflow` · web, ios, android, macos, windows, linux

보조 기술과 다양한 입력으로 목표 작업을 끝까지 검수한다.

- **쓸 때:** 웹과 앱의 핵심 흐름·모달·폼·미디어를 실제로 출시하기 전.
- **필요 조건:** 대상 조합의 기기·OS·브라우저·보조 기술 접근.
- **제약:** 한 가지 스크린리더 결과를 모든 조합의 보증으로 삼지 않는다.
- **검수:** 레이블·역할·읽기 순서·초점 복귀·오류 알림·다시 시도.
- [공식 참고](https://www.w3.org/WAI/test-evaluate/)

<a id="technology-xcode-instruments"></a>
### Xcode Instruments·GPU Frame Capture

`xcode-instruments` · `candidate` · `tool` · macos

Apple 대상 앱을 프로파일링하고 GPU 패스·리소스를 살펴본다.

- **쓸 때:** 실기기 앱의 프레임 저하·열·메모리와 렌더 비용을 구분할 때.
- **필요 조건:** Xcode, 실행 빌드, 대상 기기와 재현 시나리오.
- **제약:** 시뮬레이터와 개발 빌드의 수치를 출시 성능으로 대신하지 않는다.
- **검수:** 동일 장면 반복, 메모리 해제, 백그라운드와 저전력.
- [공식 참고](https://developer.apple.com/documentation/xcode/improving-your-app-s-performance)

<a id="technology-android-studio-inspection"></a>
### Android Studio Layout Inspector·Profiler

`android-studio-inspection` · `candidate` · `tool` · macos, windows, linux

Android UI 트리·상태와 렌더링 자원 사용을 확인한다.

- **쓸 때:** 한 화면의 잘림·재구성과 실제 앱 성능을 진단할 때.
- **필요 조건:** Android Studio, 계측 가능한 빌드, 디바이스/에뮬레이터.
- **제약:** 디버그 도구 오버헤드와 배포 빌드의 차이를 고려한다.
- **검수:** 폰트 배율, 재구성·메모리, 회전과 실기기 프레임.
- [공식 참고](https://developer.android.com/studio/debug/layout-inspector)
