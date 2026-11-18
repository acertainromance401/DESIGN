# 전체 시안 기술 분석·재사용 인벤토리

> 이 문서는 content/design-reuse.json·content/analyses와 시안 정의에서 생성합니다. 수정 후 npm run docs:designs를 실행하세요.


## 분석 범위와 구현 수준

현재 작업공간의 **21개 독립 HTML 시안 / 8개 유형 / 14개 기술 / 8개 대상 플랫폼**을 분류했습니다. MCP의 기존 186개 패턴과 대표 웹 10개·SwiftUI 10개 예제는 별도 집계합니다.

시안에서 확인한 기술 외에 사용할 수 있는 프레임워크·렌더러·제작 앱·검수 도구는 [설계·구현 기술 카탈로그](<technology-catalog.md>)에서 비교합니다. 후보는 시안에서 구현된 기술 수에 포함하지 않습니다.

HTML·로컬 JS·CSS/SVG·자산 메타데이터·테스트·전처리/패키징 스크립트와 기존 지침을 근거로 정리했습니다. node_modules·dist·과거 tgz는 의존성/생성물로 구분하며 별도 시안으로 세지 않습니다. 외부 에디터의 읽기 전용 첨부 스냅샷은 원본으로 이동·수정하지 않았습니다.

**구현됨**은 현재 웹 소스의 존재를 뜻합니다. SwiftUI/Metal/RealityKit/게임 안내는 이식 설계이며 해당 시안의 네이티브 코드·컴파일·기기 검증을 뜻하지 않습니다. SVG 원근 그림, SDF 함수, 실제 메시를 혼동하지 않습니다.

색감·레이아웃·폰트의 독립 분석은 별도 누적합니다. 현재 **34건**이며 모든 시안을 세 축으로 재분석한 것은 아닙니다. [누적 분석 목록](<analyses/README.md>) · [새 분석 작성·등록](<recording-analyses.md>)

## 유형별 바로가기

- [편집·포트폴리오·작업 도구](<../designs/editorial/README.md>) — 3개. 활자 위계, 열린 지면, 검색과 목록·상세 상태를 분리해 활용한다.

- [레퍼런스 구성 연구](<../designs/references/README.md>) — 4개. 건축·제품·전시·스포츠의 구도와 재질을 연구한 최소 완성도 비교 시안.

- [포스터·스포츠 그래픽](<../designs/posters/README.md>) — 5개. SVG 일러스트, 사진 컷아웃, 종이 질감, 강한 활자와 조명을 조합한다.

- [팔레트·분위기 비교](<../designs/palettes/README.md>) — 2개. 8개 고정 배색과 6개 화면의 18개 전환 배색. 총 26개 조합.

- [화면 효과·광학 재질](<../designs/effects/README.md>) — 2개. 32개 수동 실행 효과와 WebGL 광학 유리 컨트롤을 구분한다.

- [공간·서점·극장](<../designs/spatial/README.md>) — 3개. 2D SVG 깊이 표현과 실제 WebGL 3D 장면의 차이를 비교한다.

- [절차적 캐릭터·ASCII](<../designs/characters/README.md>) — 1개. SDF 입체 생성과 문자 아틀라스 후처리의 두 패스 렌더링.

- [이벤트·오디오·상태 흐름](<../designs/celebration/README.md>) — 1개. 3D 케이크, 호흡 입력, 효과음과 편지·엔딩 전환. 개인 자산은 로컬 전용.

## 시안별 기술 요약

| 시안 ID | 유형 | 주요 기술 | 배포 |

| --- | --- | --- | --- |

| [ascii-character](#ascii-character) | characters | webgl-sdf, ascii-postprocess, motion-lifecycle | bundled |

| [liquid-glass](#liquid-glass) | effects | webgl-sdf, optical-glass, dom-state, motion-lifecycle | bundled |

| [slow-bookshop](#slow-bookshop) | spatial | svg-illustration, image-masking, dom-state, css-layout | bundled |

| [midnight-cinema](#midnight-cinema) | spatial | svg-illustration, css-light-state, procedural-texture | bundled |

| [midnight-cinema-3d](#midnight-cinema-3d) | spatial | three-pbr, procedural-texture, motion-lifecycle, css-light-state | bundled |

| [birthday](#birthday) | celebration | three-pbr, gltf-assets, web-audio, dom-state, motion-lifecycle | local-only |

| [reference-house](#reference-house) | references | css-layout, image-masking | bundled |

| [reference-object](#reference-object) | references | svg-illustration, procedural-texture, design-tokens | bundled |

| [reference-exhibition](#reference-exhibition) | references | css-layout, image-masking, procedural-texture | bundled |

| [reference-sport](#reference-sport) | references | image-masking, procedural-texture, css-layout | bundled |

| [boxing-overhead](#boxing-overhead) | posters | svg-illustration, procedural-texture | bundled |

| [boxing-vintage](#boxing-vintage) | posters | svg-illustration, procedural-texture | bundled |

| [boxing-arena](#boxing-arena) | posters | svg-illustration | bundled |

| [sports-collage](#sports-collage) | posters | image-masking, css-layout | bundled |

| [black-editorial](#black-editorial) | editorial | css-layout, dom-state, motion-lifecycle | bundled |

| [black-minimal](#black-minimal) | editorial | css-layout, dom-state | bundled |

| [aesthetic-notes](#aesthetic-notes) | editorial | css-layout | bundled |

| [high-energy](#high-energy) | posters | css-layout, design-tokens | bundled |

| [color-combinations](#color-combinations) | palettes | design-tokens | bundled |

| [mood-examples](#mood-examples) | palettes | design-tokens, dom-state | bundled |

| [screen-effects](#screen-effects) | effects | motion-lifecycle, dom-state, procedural-texture | bundled |

<a id="ascii-character"></a>
## 작은 방랑자 — ASCII 캐릭터 `ascii-character`

SDF로 생성한 입체 캐릭터를 저해상도 장면과 실제 문자 아틀라스의 두 패스로 문자화한다.

원본: [ascii-character.html](<../designs/characters/ascii-character.html>) · 이전 주소: `ascii-character.html` (이동 안내)

별도 색감·레이아웃·폰트 기록은 아직 없습니다. [분석을 추가하는 방법](<recording-analyses.md>)

### 실제 적용 기술과 확인 위치

- **WebGL 2·SDF 레이마칭** `webgl-sdf`: SCENE_SHADER의 ellipsoid/box/capsule·scene·normalAt가 후드·망토·등불을 생성하고 최대 88 step으로 레이마칭한다. 확인: [renderer.js](<../designs/characters/assets/ascii/renderer.js>).
- **저해상도 FBO·ASCII 문자 아틀라스** `ascii-postprocess`: makeAtlas가 문자 픽셀 커버리지를 정렬하고 ASCII_SHADER가 FBO 장면 밝기·문자 크기·팔레트·빗금 글리프를 합성한다. 확인: [renderer.js](<../designs/characters/assets/ascii/renderer.js>).
- **모션·포인터·렌더 수명** `motion-lifecycle`: AnimationClock·가시성·ResizeObserver·dispose/컨텍스트 손실로 정지/재개·출력 예산을 관리한다. 확인: [renderer.js](<../designs/characters/assets/ascii/renderer.js>).


### 추출 가능한 부분

- 절차적 캐릭터 거리 함수
- 2패스 문자화 렌더 파이프라인
- 드래그/키보드 회전·비·걷기·문자 크기 제어


### Swift·SwiftUI·Metal·RealityKit

MTKView에서 저해상도 MTLTexture 장면과 glyph atlas 합성 패스를 구현하고 SwiftUI 컨트롤로 uniform을 전달한다. 모델 파일은 존재하지 않는다.


### 게임 에셋·게임 UI

캐릭터 shader 자체 또는 장면 전체 ASCII 후처리로 분리해 활용한다. 리깅/충돌이 필요하면 별도 메시를 만들거나 프레임을 베이크한다.


### 실행 요구사항

- HTTP·ES 모듈·WebGL 2; 외부 이미지·모델·CDN 없음


### 검수와 한계

- 최대 36,000셀·출력 상한·DPR 독립 격자·pause/visibility 시 시간 점프 방지
- GL 오류와 키보드·터치 대안 확인
- 메시·본·스프라이트 시트가 아니라 GLSL 거리 함수다. Swift/게임 엔진에는 셰이더 재작성 또는 베이크가 필요하다.
- HTML뿐 아니라 renderer.js를 같은 상대 경로에 저장해야 한다.


### 자산

별도 바이너리 자산이 없는 시안입니다. 시스템 폰트·내장 엔진의 고지는 원본에서 확인합니다.


### HTML 외에 함께 가져올 모듈

- [renderer.js](<../designs/characters/assets/ascii/renderer.js>)


<a id="liquid-glass"></a>
## Liquid Glass — 광학 유리 컨트롤 `liquid-glass`

SDF 곡면·굴절·Fresnel 반사와 실제 HTML 조작을 분리한 WebGL 2 유리 재질 연구.

원본: [liquid-glass.html](<../designs/effects/liquid-glass.html>) · 이전 주소: `liquid-glass.html` (이동 안내)

별도 색감·레이아웃·폰트 기록은 아직 없습니다. [분석을 추가하는 방법](<recording-analyses.md>)

### 실제 적용 기술과 확인 위치

- **WebGL 2·SDF 레이마칭** `webgl-sdf`: fragmentSource의 roundRect·곡면과 12개 물체 uniform으로 유리 형상을 계산한다. 확인: [liquid-glass.html](<../designs/effects/liquid-glass.html>).
- **굴절·Fresnel·흡수·유리 재질** `optical-glass`: 굴절률 1.51, Fresnel 반사·출사 굴절·흡수와 접촉 그림자를 합성한다. 확인: [liquid-glass.html](<../designs/effects/liquid-glass.html>).
- **시맨틱 컨트롤·검색·상태 관리** `dom-state`: canvas는 장식이고 실제 button/input/switch/tab이 조작과 접근성을 담당한다. 확인: [liquid-glass.html](<../designs/effects/liquid-glass.html>).
- **모션·포인터·렌더 수명** `motion-lifecycle`: DOM rect 측정·ResizeObserver·IntersectionObserver·포인터 상태로 필요한 프레임만 렌더한다. 확인: [liquid-glass.html](<../designs/effects/liquid-glass.html>).


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


<a id="slow-bookshop"></a>
## 느린 서가 — 책 목업·독립서점 `slow-bookshop`

SVG 책의 종이 단면·책등·접촉 그림자와 건축 사진을 큰 제호에 겹친 2.5D 편집 시안.

원본: [slow-bookshop.html](<../designs/spatial/slow-bookshop.html>) · 이전 주소: `docs/slow-bookshop.html` (이동 안내)

별도 색감·레이아웃·폰트 기록은 아직 없습니다. [분석을 추가하는 방법](<recording-analyses.md>)

### 실제 적용 기술과 확인 위치

- **SVG 벡터·그라데이션·깊이** `svg-illustration`: 겹친 책의 표지·책등·종이 단면·접촉 그림자를 SVG로 그려 2.5D 깊이를 만든다. 확인: [slow-bookshop.html](<../designs/spatial/slow-bookshop.html>).
- **사진 크롭·SVG 컷아웃·마스크** `image-masking`: 건축 사진을 책 표지 clipPath와 본문 사진에 재사용한다. 확인: [slow-bookshop.html](<../designs/spatial/slow-bookshop.html>).
- **시맨틱 컨트롤·검색·상태 관리** `dom-state`: details/summary로 책 소개를 키보드로 펼친다. 확인: [slow-bookshop.html](<../designs/spatial/slow-bookshop.html>).
- **반응형 편집·유동 타이포** `css-layout`: 대형 Seoga. 제호와 책 목업을 겹친 뒤 좁은 화면에서 재배치한다. 확인: [slow-bookshop.html](<../designs/spatial/slow-bookshop.html>).


### 추출 가능한 부분

- 책/앨범 목업의 종이·접촉 그림자 레이어
- 서점·개인 독서 홈페이지의 큐레이션 구성


### Swift·SwiftUI·Metal·RealityKit

2D는 SwiftUI ZStack/Canvas로, 회전 가능한 책은 별도 모델링한 RealityKit 엔티티로 구현한다.


### 게임 에셋·게임 UI

책 아이템 아이콘·도감 UI로 베이크하거나 표지 텍스처와 신규 책 메시로 분리한다.


### 실행 요구사항

- 공유 건축 사진; 인라인 CSS/SVG; JS 없음


### 검수와 한계

- 책/제호 중첩·모바일 순서·사진 라이선스 확인
- 책은 2D SVG이며 회전 가능한 3D 모델이 아니다.
- 공유 건축 사진은 CC BY-SA 4.0을 따른다. 실제 도서·판매 기능은 없다.


### 자산·권리·교체

- `house-photo` / **bundled**: Paul R. Burley, CC BY-SA 4.0. 크롭·채도·전경 마스크 편집에 해당 라이선스와 표시·동일조건 의무를 검토한다. 프로젝트 코드 전체가 자동으로 같은 라이선스가 된다는 뜻은 아니다. 동일조건 공유가 맞지 않는 프로젝트는 권리가 확인된 자체 건축 사진으로 교체한다.
  - `designs/shared/assets/reference-farnsworth-house.jpg`


<a id="midnight-cinema"></a>
## 극장 여운 — SVG 객석 `midnight-cinema`

SVG 객석·광선·먼지와 CSS @property/:has 상태로 조명과 막을 전환하는 심야 극장.

원본: [midnight-cinema.html](<../designs/spatial/midnight-cinema.html>) · 이전 주소: `docs/midnight-cinema.html` (이동 안내)

별도 색감·레이아웃·폰트 기록은 아직 없습니다. [분석을 추가하는 방법](<recording-analyses.md>)

### 실제 적용 기술과 확인 위치

- **SVG 벡터·그라데이션·깊이** `svg-illustration`: 오른쪽 계단 위 시점의 객석·머리·광선·먼지를 SVG로 직접 그린다. 확인: [midnight-cinema.html](<../designs/spatial/midnight-cinema.html>).
- **CSS 상태 기반 조명·막 전환** `css-light-state`: @property --house와 :has(#house-lights:checked)가 막·벽등·제목 상태를 함께 바꾼다. 확인: [midnight-cinema.html](<../designs/spatial/midnight-cinema.html>).
- **노이즈·종이·절차적 텍스처** `procedural-texture`: 그라데이션·노이즈·마스크로 어두운 좌석과 영사 빛을 표현한다. 확인: [midnight-cinema.html](<../designs/spatial/midnight-cinema.html>).


### 추출 가능한 부분

- 하나의 조명 진행도로 연결한 화면 상태
- 객석·스크린·비상구·통로등의 실제 광원 위계


### Swift·SwiftUI·Metal·RealityKit

SwiftUI state 하나로 Canvas의 조명·막·제목을 동기화한다. 상영 목록과 좌석 정보는 네이티브 텍스트로 유지한다.


### 게임 에셋·게임 UI

2D 극장 배경을 레이어로 베이크하고 조명/막 상태를 tween으로 연결한다.


### 실행 요구사항

- 외부 이미지·폰트·스크립트 없음; 현대 CSS 지원


### 검수와 한계

- 조명 토글·모션 감소·작은 일정/좌석 텍스트 확인
- 깊이와 광선은 2D 표현이다. 극장·영화·일정은 가상이며 예매 기능은 없다.


### 자산

별도 바이너리 자산이 없는 시안입니다. 시스템 폰트·내장 엔진의 고지는 원본에서 확인합니다.


<a id="midnight-cinema-3d"></a>
## 극장 여운 — WebGL 3D 객석 `midnight-cinema-3d`

내장 Three.js r187의 PBR 좌석·조명·그림자·연무 광선과 절차적 직물 재질, SVG 대안.

원본: [midnight-cinema-3d.html](<../designs/spatial/midnight-cinema-3d.html>) · 이전 주소: `docs/midnight-cinema-3d.html` (이동 안내)

별도 색감·레이아웃·폰트 기록은 아직 없습니다. [분석을 추가하는 방법](<recording-analyses.md>)

### 실제 적용 기술과 확인 위치

- **Three.js·PBR 조명·장면** `three-pbr`: 내장 Three.js r187(MIT)의 3D 좌석·머리·스크린·조명·그림자로 SVG 장면을 대체한다. 확인: [midnight-cinema-3d.html](<../designs/spatial/midnight-cinema-3d.html>).
- **노이즈·종이·절차적 텍스처** `procedural-texture`: 직물·카펫·봉제선과 roughness 맵을 코드로 생성한다. 참고 극장 사진은 런타임 자산이 아니다. 확인: [midnight-cinema-3d.html](<../designs/spatial/midnight-cinema-3d.html>).
- **모션·포인터·렌더 수명** `motion-lifecycle`: 포인터 시차·프레임 지연 시 해상도 감소·동작 줄이기 정지 화면·SVG 대안을 제공한다. 확인: [midnight-cinema-3d.html](<../designs/spatial/midnight-cinema-3d.html>).
- **CSS 상태 기반 조명·막 전환** `css-light-state`: 기존 조명 스위치를 실시간 장면의 막과 조명 상태에 연결한다. 확인: [midnight-cinema-3d.html](<../designs/spatial/midnight-cinema-3d.html>).


### 추출 가능한 부분

- 실제 광원 기준의 극장 장면 구성
- 연기 속 영사 빛 레이마칭·직물 재질
- 적응 해상도와 SVG fallback


### Swift·SwiftUI·Metal·RealityKit

장면은 RealityKit으로 다시 모델링한다. 레이마칭 연무와 후처리의 동일 재현이 필요하면 별도 Metal 렌더 경로를 설계한다.


### 게임 에셋·게임 UI

좌석/관객 반복 인스턴스·직물 roughness·volumetric beam을 목표 엔진에 맞게 구현하고 조명 단위와 노출을 다시 맞춘다.


### 실행 요구사항

- WebGL 2; 엔진이 HTML에 포함되어 외부 요청 없음
- 생일 시안의 r180 loader와 혼합하지 않음


### 검수와 한계

- SVG fallback·조명 전환·GPU frame time·해상도 하향 확인
- 약 1MB HTML에 Three.js가 내장되어 있다. 엔진 MIT 고지를 유지한다.
- 참고 사진은 런타임 자산이 아니며 네이티브/게임 장면으로 자동 변환되지 않는다.


### 자산

별도 바이너리 자산이 없는 시안입니다. 시스템 폰트·내장 엔진의 고지는 원본에서 확인합니다.


<a id="birthday"></a>
## 생일 — 케이크·호흡·편지 흐름 `birthday`

3D 케이크·호흡 감지·오디오·화면 상태 전환을 연결한 로컬 전용 이벤트 시안.

**로컬 전용**: `designs/celebration/birthday.html`. 개인 원문·모듈·자산은 GitHub와 npm에서 제외합니다. 공개 저장소와 설치본에는 이 분석만 제공합니다.

별도 색감·레이아웃·폰트 기록은 아직 없습니다. [분석을 추가하는 방법](<recording-analyses.md>)

### 실제 적용 기술과 확인 위치

- **Three.js·PBR 조명·장면** `three-pbr`: r180 GLTFLoader·PBR·ACES tone mapping과 모델 표면 raycast로 케이크 위 촛불 세 개를 배치한다. 확인: `designs/celebration/assets/birthday/cake-scene.js`.
- **Blender→GLB·모바일 자산 최적화** `gltf-assets`: Blender 원본은 보존하고 GLB를 44,999 triangles·약 2.41MiB로 최적화한다. 확인: `scripts/prepare-birthday-model.mjs`.
- **Web Audio·호흡 분석·재생 정책** `web-audio`: analyzeBreath/BlowDetector가 RMS·대역 에너지·잡음 보정·유지 시간으로 촛불 끄기를 판단한다. 확인: `designs/celebration/assets/birthday/blow-detector.js`.
- **시맨틱 컨트롤·검색·상태 관리** `dom-state`: 인트로 → 케이크 → 편지 → 엔딩 상태와 재시도·history·포커스·권한 오류를 관리한다. 확인: `designs/celebration/assets/birthday/celebration.js`.
- **모션·포인터·렌더 수명** `motion-lifecycle`: Canvas confetti·렌더/오디오·마이크 수명을 장면 상태와 연결한다. 확인: `designs/celebration/assets/birthday/celebration.js`.


### 추출 가능한 부분

- 호흡 감지의 보정/유지 시간 알고리즘
- 버튼 대안이 있는 권한 기반 이벤트 흐름
- GLB 최적화 파이프라인·촛불 조명 상태
- 음악 자동재생 실패 안내·박수 재생 수명


### Swift·SwiftUI·Metal·RealityKit

RealityKit 케이크/촛불과 SwiftUI 화면 상태를 연결하고 AVAudioEngine/vDSP로 호흡을 분석한다. 마이크 권한·거부·오디오 인터럽트·백그라운드 해제를 구현한다.


### 게임 에셋·게임 UI

권리 확인 모델·음원을 먼저 교체하고 엔진 오디오 분석·입자·장면 상태로 이식한다. 마이크 없이 버튼으로 진행할 경로를 유지한다.


### 실행 요구사항

- 로컬 시안 전용: 개인 HTML·모듈·모델·사진·음원·폰트·vendor 전체 npm 제외
- 로컬 HTTP/HTTPS·WebGL 2·import map; 마이크는 secure context와 사용자 권한 필요


### 검수와 한계

- 권한 거부·마이크 해제·잡음 오탐·중복 클릭·후발 비동기 결과 확인
- GLB·편지지·사진 예산과 화면 흐름 기존 테스트 유지
- 개인 이름·편지·사진·음원·모델의 외부 배포 전 교체/허락 확인
- 개인 HTML·모듈·사진·음원·모델은 로컬 전용이며 npm에서 제외한다. 설치본에는 분석과 교체 가이드만 제공한다.
- 권리 미확인 자산을 MIT로 재배포하지 않는다. 마이크 기능은 권한과 보안 컨텍스트가 필요하다.


### 자산·권리·교체

- `birthday-private` / **local-only**: 사용자 제공 사진·원화·편지지·음원·Meshy 모델의 재배포 권리 미확인. 로컬에 보존하며 npm에 포함하지 않는다. MIT 저장소 라이선스를 적용하지 않는다. 자체 모델·사진·음원으로 교체하고 원본 권리와 파생물 배포 조건을 확인한다. 개인 편지·이름도 배포 전에 교체한다.
  - `designs/celebration/assets/birthday/cake-mobile.glb`
  - `designs/celebration/assets/birthday/sea-turtle.webp`
  - `designs/celebration/assets/birthday/ending-photo.jpg`
  - `designs/celebration/assets/birthday/letter-paper.webp`
  - `designs/celebration/assets/birthday/letter-paper.avif`
  - `designs/celebration/assets/birthday/leberch-happy-birthday-581704.mp3`
  - `designs/celebration/assets/birthday/pwlpl-applause-sound-effect-521104.mp3`
- `birthday-runtime` / **local-only**: Three.js r180은 MIT, Pretendard는 포함된 SIL OFL 고지를 따른다. 개인 시안 폴더와 함께 npm 제외하며 재사용 시 각 고지를 별도 보관한다. 외부 프로젝트에서 승인된 Three.js 버전·loader 또는 네이티브 렌더러와 라이선스 확인 폰트를 사용한다.
  - `designs/celebration/assets/birthday/vendor/LICENSE`
  - `designs/celebration/assets/birthday/fonts/OFL.txt`
  - `designs/celebration/assets/birthday/fonts/pretendard-variable.woff2`


### HTML 외에 함께 가져올 모듈

- `designs/celebration/assets/birthday/cake-scene.js` (로컬 전용)
- `designs/celebration/assets/birthday/candle-lighting.js` (로컬 전용)
- `designs/celebration/assets/birthday/blow-detector.js` (로컬 전용)
- `designs/celebration/assets/birthday/celebration.js` (로컬 전용)
- `designs/celebration/assets/birthday/background-music.js` (로컬 전용)
- `designs/celebration/assets/birthday/applause.js` (로컬 전용)


<a id="reference-house"></a>
## Forma — 건축 사진과 활자 스터디 `reference-house`

Hotle의 가는 초대형 영문 제목·건축 사진 중첩·작은 설명의 비율을 연구한 지면. 실제 판스워스 하우스 사진을 대체 자산으로 사용.

원본: [reference-house.html](<../designs/references/reference-house.html>) · 이전 주소: `docs/reference-house.html` (이동 안내)

동반 문서: [reference-studies.md](<../designs/references/reference-studies.md>)

별도 색감·레이아웃·폰트 기록은 아직 없습니다. [분석을 추가하는 방법](<recording-analyses.md>)

### 실제 적용 기술과 확인 위치

- **반응형 편집·유동 타이포** `css-layout`: 가는 초대형 영문 제목·작은 설명·여백 비율을 만든다. 확인: [reference-house.html](<../designs/references/reference-house.html>).
- **사진 크롭·SVG 컷아웃·마스크** `image-masking`: 건축 사진 크롭과 전경 마스크를 제목 앞뒤로 겹친다. 확인: [reference-house.html](<../designs/references/reference-house.html>).


### 추출 가능한 부분

- 공간 소개·개인 건축 포트폴리오의 사진/활자 중첩
- 전경·후경 분리 구도


### Swift·SwiftUI·Metal·RealityKit

ZStack의 Image/Text/마스크로 구성하고 사진 편집 라이선스를 유지한다. 실제 3D 공간이 필요한 경우 별도 모델을 준비한다.


### 게임 에셋·게임 UI

메뉴 배경의 parallax 레이어로 추출할 수 있다. 사진이 게임 환경 메시가 되지는 않는다.


### 실행 요구사항

- 공유 건축 사진과 출처 문서


### 검수와 한계

- 제목과 피사체의 가림·모바일 크롭·출처 고지 확인
- designs/shared/assets/reference-farnsworth-house.jpg와 출처 문서를 함께 보관해야 한다. Paul R. Burley의 CC BY-SA 4.0 사진 및 크롭·채도·전경 마스크 편집에 해당 라이선스가 적용된다. MCP는 사진 바이너리를 반환하지 않는다.
- 가상의 편집 브랜드이며 사진 속 실제 건물은 미스 반 데어 로에의 설계다. Hotle 원본의 사진·서체·검정 외벽·저녁 조명을 재현한 것은 아니다.


### 자산·권리·교체

- `house-photo` / **bundled**: Paul R. Burley, CC BY-SA 4.0. 크롭·채도·전경 마스크 편집에 해당 라이선스와 표시·동일조건 의무를 검토한다. 프로젝트 코드 전체가 자동으로 같은 라이선스가 된다는 뜻은 아니다. 동일조건 공유가 맞지 않는 프로젝트는 권리가 확인된 자체 건축 사진으로 교체한다.
  - `designs/shared/assets/reference-farnsworth-house.jpg`


<a id="reference-object"></a>
## 담 — 동계색 조명 제품 시안 `reference-object`

주황색 제품 화면을 기준으로 작은 흰색 산세리프 제목·중앙의 큰 조명·오른쪽 제품 메모와 동계색 명암을 맞춘 지면.

원본: [reference-object.html](<../designs/references/reference-object.html>) · 이전 주소: `docs/reference-object.html` (이동 안내)

동반 문서: [reference-studies.md](<../designs/references/reference-studies.md>)

별도 색감·레이아웃·폰트 기록은 아직 없습니다. [분석을 추가하는 방법](<recording-analyses.md>)

### 실제 적용 기술과 확인 위치

- **SVG 벡터·그라데이션·깊이** `svg-illustration`: SVG 도형·그라데이션·clipPath로 큰 조명 제품의 비례와 반사를 그린다. 확인: [reference-object.html](<../designs/references/reference-object.html>).
- **노이즈·종이·절차적 텍스처** `procedural-texture`: feTurbulence로 재질의 미세 변화를 보조한다. 확인: [reference-object.html](<../designs/references/reference-object.html>).
- **의미 색상 토큰·배색 전환** `design-tokens`: 주황 동계색의 명도 차이로 제품과 작은 흰 제목을 구분한다. 확인: [reference-object.html](<../designs/references/reference-object.html>).


### 추출 가능한 부분

- 제품 실루엣·동계색 명암
- 제품 소개/아이템 상세 배치


### Swift·SwiftUI·Metal·RealityKit

2D는 Canvas/Shape 또는 베이크 이미지로 사용한다. 회전 가능한 조명은 RealityKit 메시와 실제 PBR 재질을 새로 만든다.


### 게임 에셋·게임 UI

아이템 아이콘·상점 배경으로 PNG를 베이크하거나 모델링 후 엔진 재질로 재구성한다.


### 실행 요구사항

- 외부 자산 없는 인라인 SVG; 제조·판매 기능 없음


### 검수와 한계

- 작은 제목 대비·그라데이션 banding·필터 잘림 확인
- 제품은 독자적인 SVG 비례·재질 연구이며 실제 판매품이나 제조 사양이 아니다. 구매·주문 기능은 없다.
- 원본 패딩·브랜드·카피를 사용하지 않았다. 원본 서체는 미확인으로 Arial 계열을 사용하며 확정된 개인 취향을 나타내지 않는다.


### 자산

별도 바이너리 자산이 없는 시안입니다. 시스템 폰트·내장 엔진의 고지는 원본에서 확인합니다.


<a id="reference-exhibition"></a>
## Fold — 무채색 편집 스튜디오 시안 `reference-exhibition`

SwissBrut의 반반 인물/활자 구도·넓은 은색 재질 이미지·회색/검정 대형 활자 목록. 원본에서 확인한 Be Vietnam Pro 900을 사용.

원본: [reference-exhibition.html](<../designs/references/reference-exhibition.html>) · 이전 주소: `docs/reference-exhibition.html` (이동 안내)

동반 문서: [reference-studies.md](<../designs/references/reference-studies.md>)

별도 색감·레이아웃·폰트 기록은 아직 없습니다. [분석을 추가하는 방법](<recording-analyses.md>)

### 실제 적용 기술과 확인 위치

- **반응형 편집·유동 타이포** `css-layout`: 반반 이미지/활자와 대형 목록에 로컬 Be Vietnam Pro 900 @font-face를 적용한다. 확인: [reference-exhibition.html](<../designs/references/reference-exhibition.html>).
- **사진 크롭·SVG 컷아웃·마스크** `image-masking`: 기존 축구 사진을 크게 크롭해 대체 인물 이미지로 사용한다. 확인: [reference-exhibition.html](<../designs/references/reference-exhibition.html>).
- **노이즈·종이·절차적 텍스처** `procedural-texture`: SVG 노이즈·명암으로 은색 재질 이미지를 만든다. 확인: [reference-exhibition.html](<../designs/references/reference-exhibition.html>).


### 추출 가능한 부분

- 전시/편집 스튜디오 홈페이지의 이미지·목록 비율
- 로컬 서체와 저작권 고지 패키징


### Swift·SwiftUI·Metal·RealityKit

폰트를 앱에 등록하고 Font.custom과 크기 조정 기준을 정한다. 은색 재질은 2D 이미지 또는 Canvas로 추출한다.


### 게임 에셋·게임 UI

크레디트·챕터 선택 UI의 대형 타입을 활용하고 폰트 임베딩 고지를 포함한다.


### 실행 요구사항

- 공유 사진·TTF·OFL 고지


### 검수와 한계

- 폰트 로드 실패·긴 목록·줄바꿈·사진 권리 확인
- 가상의 편집 스튜디오다. 원본 인물·사진·브랜드·문구는 사용하지 않았다. 사진은 기존 CC0 축구 사진의 확대 크롭이며 초상권·상표권을 보장하지 않는다.
- designs/shared/assets/sports-soccer-cc0.jpg, be-vietnam-pro-black.ttf, be-vietnam-pro-OFL.txt를 함께 보관한다. 폰트는 SIL OFL 1.1이다. MCP는 사진·폰트 바이너리를 반환하지 않는다.


### 자산·권리·교체

- `sports-photo` / **bundled**: 기존 출처 문서상 CC0. 초상권·상표권·팀/선수의 후원 허락까지 보장하지 않는다. 제품·광고에 사용하려면 모델 릴리스와 상표를 확인하거나 자체 이미지로 교체한다.
  - `designs/shared/assets/sports-soccer-cc0.jpg`
- `exhibition-font` / **bundled**: Be Vietnam Pro 900, SIL OFL 1.1. 폰트와 라이선스 고지를 함께 배포한다. 대체 폰트 사용 시 행 길이·두께·줄바꿈을 다시 조정한다.
  - `designs/shared/assets/be-vietnam-pro-black.ttf`
  - `designs/shared/assets/be-vietnam-pro-OFL.txt`


<a id="reference-sport"></a>
## 후반전 — 적색 활자와 인물 컷아웃 포스터 `reference-sport`

복싱 포스터의 세로 비율·길고 큰 적색 압축 활자·그 앞에 겹친 인물 컷아웃·따뜻한 종이 질감을 연구한 축구 포스터.

원본: [reference-sport.html](<../designs/references/reference-sport.html>) · 이전 주소: `docs/reference-sport.html` (이동 안내)

동반 문서: [reference-studies.md](<../designs/references/reference-studies.md>)

별도 색감·레이아웃·폰트 기록은 아직 없습니다. [분석을 추가하는 방법](<recording-analyses.md>)

### 실제 적용 기술과 확인 위치

- **사진 크롭·SVG 컷아웃·마스크** `image-masking`: player/ball clipPath로 사진 속 인물과 공을 큰 적색 활자 앞에 겹친다. 확인: [reference-sport.html](<../designs/references/reference-sport.html>).
- **노이즈·종이·절차적 텍스처** `procedural-texture`: 종이색·노이즈·blend로 포스터 질감을 만든다. 확인: [reference-sport.html](<../designs/references/reference-sport.html>).
- **반응형 편집·유동 타이포** `css-layout`: 로컬 Impact 계열로 세로 포스터의 압축 활자를 근사한다. 확인: [reference-sport.html](<../designs/references/reference-sport.html>).


### 추출 가능한 부분

- 스포츠 포스터의 제목·인물·배경 레이어
- 챕터/경기 소개용 세로 지면


### Swift·SwiftUI·Metal·RealityKit

레이어를 ZStack으로 옮기고 Impact 미설치·대체 폰트의 폭 차이를 검수한다.


### 게임 에셋·게임 UI

텍스트 없는 배경·알파 인물·타이틀을 분리한 atlas/위젯으로 만든다.


### 실행 요구사항

- 공유 CC0 사진; 로컬 서체에 따라 인상 차이


### 검수와 한계

- 수동 마스크 경계·작은 출처·제목 잘림 확인
- HTML과 패키지의 designs/shared/assets/sports-soccer-cc0.jpg를 함께 보관해야 한다. MCP HTML 조회는 사진 바이너리를 전달하지 않는다.
- 원본 서체는 미확인으로 로컬 Impact를 근사 사용한다. 미설치 환경은 인상이 다르다. 기존 CC0 축구 사진의 수동 마스크이며 초상권·상표권이나 실제 팀·선수의 후원·추천을 보장하지 않는다.


### 자산·권리·교체

- `sports-photo` / **bundled**: 기존 출처 문서상 CC0. 초상권·상표권·팀/선수의 후원 허락까지 보장하지 않는다. 제품·광고에 사용하려면 모델 릴리스와 상표를 확인하거나 자체 이미지로 교체한다.
  - `designs/shared/assets/sports-soccer-cc0.jpg`


<a id="boxing-overhead"></a>
## 위에서 본 복싱 링 `boxing-overhead`

붉은 로프·청회색 매트·비스듬한 한글 제목·작은 인물로 구성한 오버헤드 복싱 지면.

원본: [boxing-overhead.html](<../designs/posters/boxing-overhead.html>) · 이전 주소: `docs/boxing-overhead.html` (이동 안내)

동반 문서: [boxing-references.md](<../designs/posters/boxing-references.md>)

별도 색감·레이아웃·폰트 기록은 아직 없습니다. [분석을 추가하는 방법](<recording-analyses.md>)

### 실제 적용 기술과 확인 위치

- **SVG 벡터·그라데이션·깊이** `svg-illustration`: 붉은 로프·청회색 매트·작은 인물을 오버헤드 SVG 구도로 그린다. 확인: [boxing-overhead.html](<../designs/posters/boxing-overhead.html>).
- **노이즈·종이·절차적 텍스처** `procedural-texture`: 고정 SVG turbulence로 매트/인쇄 질감을 보조한다. 확인: [boxing-overhead.html](<../designs/posters/boxing-overhead.html>).


### 추출 가능한 부분

- 탑다운 경기장 배경
- 원근·작은 인물과 큰 활자의 대비


### Swift·SwiftUI·Metal·RealityKit

Canvas 또는 PDF/PNG 지면으로 사용한다. 상호작용 링은 좌표·충돌 모델을 별도 정의한다.


### 게임 에셋·게임 UI

탑다운 링을 바닥/로프/인물로 분리해 스프라이트화한다. 그림의 경계가 충돌체는 아니다.


### 실행 요구사항

- 외부 사진 없는 SVG 시안


### 검수와 한계

- 뷰박스·로프/인물 레이어·작은 문자 확인
- 원본 사진 대신 독자적인 SVG로 그린 가상 연습회이며 실제 모집 기능은 없다.


### 자산

별도 바이너리 자산이 없는 시안입니다. 시스템 폰트·내장 엔진의 고지는 원본에서 확인합니다.


<a id="boxing-vintage"></a>
## 종이 질감의 복싱 포스터 `boxing-vintage`

종이색·붉은 대형 글자·가드 자세의 SVG 인물·고정 노이즈로 구성한 가상 훈련 기록 표지.

원본: [boxing-vintage.html](<../designs/posters/boxing-vintage.html>) · 이전 주소: `docs/boxing-vintage.html` (이동 안내)

동반 문서: [boxing-references.md](<../designs/posters/boxing-references.md>)

별도 색감·레이아웃·폰트 기록은 아직 없습니다. [분석을 추가하는 방법](<recording-analyses.md>)

### 실제 적용 기술과 확인 위치

- **SVG 벡터·그라데이션·깊이** `svg-illustration`: 가드 자세 인물과 붉은 대형 글자를 독자적인 SVG로 구성한다. 확인: [boxing-vintage.html](<../designs/posters/boxing-vintage.html>).
- **노이즈·종이·절차적 텍스처** `procedural-texture`: 종이색·고정 turbulence·blend로 인쇄 질감을 만든다. 확인: [boxing-vintage.html](<../designs/posters/boxing-vintage.html>).


### 추출 가능한 부분

- 빈티지 메뉴/타이틀 배경
- 인물 실루엣과 제한 팔레트


### Swift·SwiftUI·Metal·RealityKit

Canvas 또는 배경 이미지로 쓰고 정보 텍스트를 네이티브로 분리한다.


### 게임 에셋·게임 UI

표지·아이템 카드의 종이 텍스처로 베이크한다. 인물 애니메이션은 별도 제작한다.


### 실행 요구사항

- 정적 SVG; 하단 막대는 스캔 바코드 아님


### 검수와 한계

- 질감이 본문 대비를 낮추지 않는지 확인
- 원본 사진 대신 독자적인 SVG를 사용했다. 실제 훈련 처방이 아니며 하단 막대는 스캔 가능한 바코드가 아니다.


### 자산

별도 바이너리 자산이 없는 시안입니다. 시스템 폰트·내장 엔진의 고지는 원본에서 확인합니다.


<a id="boxing-arena"></a>
## 조명 아래 복싱 뒷모습 `boxing-arena`

청록 스포트라이트·깊은 검정·흰 제목과 두 팔을 든 SVG 인물을 겹친 세로 단편 표지.

원본: [boxing-arena.html](<../designs/posters/boxing-arena.html>) · 이전 주소: `docs/boxing-arena.html` (이동 안내)

동반 문서: [boxing-references.md](<../designs/posters/boxing-references.md>)

별도 색감·레이아웃·폰트 기록은 아직 없습니다. [분석을 추가하는 방법](<recording-analyses.md>)

### 실제 적용 기술과 확인 위치

- **SVG 벡터·그라데이션·깊이** `svg-illustration`: 군중·팔을 든 인물·청록 스포트라이트를 SVG 명암 레이어로 겹친다. 확인: [boxing-arena.html](<../designs/posters/boxing-arena.html>).


### 추출 가능한 부분

- 승리/결과 화면의 실루엣·빛 구도
- 어두운 세로 포스터


### Swift·SwiftUI·Metal·RealityKit

ZStack/Canvas에서 빛과 인물을 분리한다. 실제 볼류메트릭 광원이 아니다.


### 게임 에셋·게임 UI

승리 장면의 레이어 배경으로 사용하거나 신규 3D 장면의 조명 레퍼런스로 활용한다.


### 실행 요구사항

- 외부 자산 없는 정적 SVG


### 검수와 한계

- 암부에서 인물/제목 식별·좁은 화면 확인
- 원본 사진 대신 조명·군중·인물을 SVG로 그린 정적 가상 작품이며 실제 선수·영화 홍보물이 아니다.


### 자산

별도 바이너리 자산이 없는 시안입니다. 시스템 폰트·내장 엔진의 고지는 원본에서 확인합니다.


<a id="sports-collage"></a>
## 스포츠 사진 콜라주 `sports-collage`

흰 여백·사진 구획·얼굴 확대·프레임을 넘는 인물의 가상 스포츠 지면. CC0 사진을 크롭하고 SVG 윤곽으로 겹친다.

원본: [sports-collage.html](<../designs/posters/sports-collage.html>) · 이전 주소: `docs/sports-collage.html` (이동 안내)

동반 문서: [sports-collage.md](<../designs/posters/sports-collage.md>)

별도 색감·레이아웃·폰트 기록은 아직 없습니다. [분석을 추가하는 방법](<recording-analyses.md>)

### 실제 적용 기술과 확인 위치

- **사진 크롭·SVG 컷아웃·마스크** `image-masking`: 같은 사진을 전체·얼굴·인물 윤곽으로 재사용하고 수동 SVG clipPath로 프레임 밖 인물을 만든다. 확인: [sports-collage.html](<../designs/posters/sports-collage.html>).
- **반응형 편집·유동 타이포** `css-layout`: 흰 여백과 사진 구획의 크기 차이로 스포츠 지면을 편집한다. 확인: [sports-collage.html](<../designs/posters/sports-collage.html>).


### 추출 가능한 부분

- 사진 기반 개인 홈페이지의 콜라주
- 경기 로딩/소개 화면의 분할 구도


### Swift·SwiftUI·Metal·RealityKit

Image 크롭과 Shape mask로 재구성하거나 투명 PNG를 제작한다.


### 게임 에셋·게임 UI

크롭된 사진/인물 레이어를 atlas로 묶고 UI 텍스트는 분리한다.


### 실행 요구사항

- 공유 CC0 사진과 출처 문서


### 검수와 한계

- 인물 윤곽·과도한 확대·초상권/상표권 확인
- HTML과 패키지의 designs/shared/assets/sports-soccer-cc0.jpg를 함께 보관해야 한다. MCP HTML 조회는 사진 바이너리를 전달하지 않는다.
- 참고 핀 원본은 저장하지 않았다. 사용 사진은 CC0지만 초상권·상표권까지 허가하지 않으며 실제 팀 홍보물이 아니다.
- 인물 마스크는 수동 SVG 윤곽으로 정밀한 머리카락 제거가 아니다.


### 자산·권리·교체

- `sports-photo` / **bundled**: 기존 출처 문서상 CC0. 초상권·상표권·팀/선수의 후원 허락까지 보장하지 않는다. 제품·광고에 사용하려면 모델 릴리스와 상표를 확인하거나 자체 이미지로 교체한다.
  - `designs/shared/assets/sports-soccer-cc0.jpg`


<a id="black-editorial"></a>
## 검정 포스터형 포트폴리오 `black-editorial`

큰 번호·얇은 타이포·열린 수평 구획·붉은 빛의 포트폴리오. 짧은 진입·펼침·호버와 포인터 반응, 효과 끄기·모션 감소를 지원한다.

원본: [black-editorial.html](<../designs/editorial/black-editorial.html>) · 이전 주소: `docs/black-editorial.html` (이동 안내)

별도 색감·레이아웃·폰트 기록은 아직 없습니다. [분석을 추가하는 방법](<recording-analyses.md>)

### 실제 적용 기술과 확인 위치

- **반응형 편집·유동 타이포** `css-layout`: 큰 번호·가는 제목·수평 구획으로 포트폴리오의 작업 순서를 만든다. 확인: [black-editorial.html](<../designs/editorial/black-editorial.html>).
- **시맨틱 컨트롤·검색·상태 관리** `dom-state`: details/summary로 작업 설명을 펼친다. 확인: [black-editorial.html](<../designs/editorial/black-editorial.html>).
- **모션·포인터·렌더 수명** `motion-lifecycle`: WAAPI 진입·펼침, 포인터 반응과 효과 끄기·가시성·동작 줄이기를 연결한다. 확인: [black-editorial.html](<../designs/editorial/black-editorial.html>).


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

원본: [black-minimal.html](<../designs/editorial/black-minimal.html>) · 이전 주소: `docs/black-minimal.html` (이동 안내)

별도 색감·레이아웃·폰트 기록은 아직 없습니다. [분석을 추가하는 방법](<recording-analyses.md>)

### 실제 적용 기술과 확인 위치

- **반응형 편집·유동 타이포** `css-layout`: 차콜 계층과 목록·상세 패널로 파일 보관함을 구성한다. 확인: [black-minimal.html](<../designs/editorial/black-minimal.html>).
- **시맨틱 컨트롤·검색·상태 관리** `dom-state`: 검색·선택·페이지 내 고정을 메모리 상태로 시연하며 미리보기는 CSS 도형이다. 확인: [black-minimal.html](<../designs/editorial/black-minimal.html>).


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

원본: [aesthetic.html](<../designs/editorial/aesthetic.html>) · 이전 주소: `docs/aesthetic.html` (이동 안내)

별도 색감·레이아웃·폰트 기록은 아직 없습니다. [분석을 추가하는 방법](<recording-analyses.md>)

### 실제 적용 기술과 확인 위치

- **반응형 편집·유동 타이포** `css-layout`: 한국어 활자·간격 표본과 수정 메모를 비정형 지면으로 배치한다. JS 없는 정적 화면이다. 확인: [aesthetic.html](<../designs/editorial/aesthetic.html>).


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


<a id="high-energy"></a>
## 강렬한 러닝 이벤트 화면 `high-energy`

주황·먹색·라임, 큰 10K 숫자와 CSS 트랙으로 만든 야간 러닝 이벤트.

원본: [high-energy.html](<../designs/posters/high-energy.html>) · 이전 주소: `docs/high-energy.html` (이동 안내)

별도 색감·레이아웃·폰트 기록은 아직 없습니다. [분석을 추가하는 방법](<recording-analyses.md>)

### 실제 적용 기술과 확인 위치

- **반응형 편집·유동 타이포** `css-layout`: 초대형 10K 숫자·수평 구획·CSS 트랙 도형으로 야간 러닝 이벤트를 구성한다. 확인: [high-energy.html](<../designs/posters/high-energy.html>).
- **의미 색상 토큰·배색 전환** `design-tokens`: 주황·먹색·라임을 역할별 면과 글자에 배분한다. 확인: [high-energy.html](<../designs/posters/high-energy.html>).


### 추출 가능한 부분

- 이벤트 랜딩의 숫자 위계
- 트랙 모티프·제한 팔레트


### Swift·SwiftUI·Metal·RealityKit

Text와 Shape/Canvas로 트랙을 만들고 실제 참가 신청 상태는 별도 구현한다.


### 게임 에셋·게임 UI

레이싱/스포츠 타이틀 UI에 색·트랙 모티프를 적용한다.


### 실행 요구사항

- 정적 HTML/CSS; 가상 행사


### 검수와 한계

- 강조색 대비·숫자 잘림·실제 모집 정보와 구분
- 가상 이벤트이며 실제 모집·신청·저장 기능은 없다.


### 자산

별도 바이너리 자산이 없는 시안입니다. 시스템 폰트·내장 엔진의 고지는 원본에서 확인합니다.


<a id="color-combinations"></a>
## 같은 화면의 8가지 색 조합 `color-combinations`

산책 기록 화면에 여덟 팔레트를 적용해 색감·분위기와 용도를 비교한다.

원본: [color-combinations.html](<../designs/palettes/color-combinations.html>) · 이전 주소: `docs/color-combinations.html` (이동 안내)

동반 문서: [color-combinations.md](<../designs/palettes/color-combinations.md>)

별도 색감·레이아웃·폰트 기록은 아직 없습니다. [분석을 추가하는 방법](<recording-analyses.md>)

### 실제 적용 기술과 확인 위치

- **의미 색상 토큰·배색 전환** `design-tokens`: 같은 산책 기록 화면을 8개 팔레트로 반복해 색 역할·면적의 차이를 비교한다. 확인: [color-combinations.html](<../designs/palettes/color-combinations.html>).


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

원본: [mood-examples.html](<../designs/palettes/mood-examples.html>) · 이전 주소: `docs/mood-examples.html` (이동 안내)

동반 문서: [mood-examples.md](<../designs/palettes/mood-examples.md>)

별도 색감·레이아웃·폰트 기록은 아직 없습니다. [분석을 추가하는 방법](<recording-analyses.md>)

### 실제 적용 기술과 확인 위치

- **의미 색상 토큰·배색 전환** `design-tokens`: 독서·음악·여행·전시·도구·카페 6개 화면마다 3개 팔레트를 선택한다. 확인: [mood-examples.html](<../designs/palettes/mood-examples.html>).
- **시맨틱 컨트롤·검색·상태 관리** `dom-state`: 색 선택 UI만 상태를 바꾸며 재생·예약·주문은 구현하지 않는다. 확인: [mood-examples.html](<../designs/palettes/mood-examples.html>).


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


<a id="screen-effects"></a>
## 32개 앱 화면 효과 갤러리 `screen-effects`

배경·재질, 등장·전환, 조작, 스크롤, 상태·오버레이를 수동 실행·초기화·정지한다. 추가 검토 효과 19종은 문서에 별도 정리.

원본: [screen-effects.html](<../designs/effects/screen-effects.html>) · 이전 주소: `docs/screen-effects.html` (이동 안내)

동반 문서: [screen-effects.md](<../designs/effects/screen-effects.md>)

별도 색감·레이아웃·폰트 기록은 아직 없습니다. [분석을 추가하는 방법](<recording-analyses.md>)

### 실제 적용 기술과 확인 위치

- **모션·포인터·렌더 수명** `motion-lifecycle`: 32개 demos를 수동 실행·초기화·정지하며 리플·틸트·스프링 근사·쉬머를 비교한다. 확인: [screen-effects.html](<../designs/effects/screen-effects.html>).
- **시맨틱 컨트롤·검색·상태 관리** `dom-state`: dialog.showModal과 실행 컨트롤·상태 안내를 제공한다. 확인: [screen-effects.html](<../designs/effects/screen-effects.html>).
- **노이즈·종이·절차적 텍스처** `procedural-texture`: SVG noise와 CSS backdrop-filter 등 배경·재질 효과를 비교한다. 확인: [screen-effects.html](<../designs/effects/screen-effects.html>).


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


## 배포 경계

MIT는 저장소 자체 코드에 적용되는 기본 라이선스이며 사진·서체·음원·모델의 권리를 일괄 허락하지 않습니다. 개인 생일 시안과 reference 원본 자료는 GitHub와 npm에서 제외합니다. 원문이 없는 MCP는 생일 분석을 제공하되 sourceAvailable=false와 명시적인 안내를 반환합니다.

원본 Blender/사진/음원은 reference/private/birthday, 극장 참고 자료 두 세트는 reference/cinema/originals와 reference/cinema/studies에 보존했습니다. 중복으로 보이는 원본도 삭제하지 않았습니다.

다음: [platform-adoption.md](<platform-adoption.md>) · [mcp-workflows.md](<mcp-workflows.md>) · [workspace-map.md](<workspace-map.md>)
