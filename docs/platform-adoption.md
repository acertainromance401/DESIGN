# 플랫폼별 기술 활용·이식 가이드

> 이 문서는 content/design-reuse.json·content/analyses와 시안 정의에서 생성합니다. 수정 후 npm run docs:designs를 실행하세요.


현재 실행 구현은 웹 시안입니다. 이 문서는 목적에 맞게 원리·자산·상태를 선택하는 지침이며 자동 포팅 도구가 아닙니다. 대상 프로젝트의 SDK·OS·렌더 파이프라인·입력·자산 권리를 먼저 확인합니다.

이 문서의 대상 플랫폼 외 프레임워크·저작 도구·검수 환경은 [기술 카탈로그](<technology-catalog.md>)에서 확인합니다.

## 선택 기준

- 일반 앱 UI/개인 홈페이지: 활자·배색·상태와 시맨틱 조작을 먼저 이전합니다. 단순 편집 화면에 Metal을 추가할 필요는 없습니다.

- SVG 일러스트: Shape/Canvas 또는 PDF/PNG로 변환합니다. 2D 목업이 회전 가능한 3D 모델은 아닙니다.

- 절차적 ASCII/광학 유리: Metal 다중 패스 또는 엔진 후처리로 재작성합니다. CSS backdrop-filter와 진짜 굴절을 구분합니다.

- 케이크·극장 3D: RealityKit/게임 scene graph로 이전합니다. 모델·조명·색 관리·오디오·화면 상태는 따로 검수합니다.

<a id="web"></a>
## 웹·개인 홈페이지 `web`

### 필요 요소

- 정적 HTTP 서버와 시맨틱 HTML/CSS/ES 모듈
- GPU 시안은 WebGL 2 기능 검사와 실패 안내
- 생일 마이크는 HTTPS 또는 localhost 및 사용자 권한·제스처 필요


### 통합 순서

- 구도·팔레트·상태 로직 중 필요한 부분만 기존 컴포넌트에 통합한다.
- sourceFiles의 상대 경로를 유지하고 assets의 라이선스·배포 상태를 확인한다.
- 개인 홈페이지의 실제 소개·작업 데이터로 교체하고 가상 실적·주문 기능을 그대로 사용하지 않는다.
- 정적 콘텐츠와 키보드 조작을 먼저 연결하고 GPU·모션은 점진 향상으로 추가한다.


### 확인할 결과

- 360px·태블릿·데스크톱에서 넘침·확대·읽기 순서 확인
- 키보드·터치·포커스·동작 줄이기·GPU 미지원 확인
- Network에서 로컬 모듈·폰트·이미지의 404 및 외부 요청 확인


### 제약

- HTML 반환은 브라우저 실행이나 배포 완료가 아니다.
- JS 모듈 시안은 file://에서 실행하지 않는다.


### 공식 참고

- [https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API)
- [https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)


<a id="swiftui"></a>
## Swift·SwiftUI 앱 `swiftui`

### 필요 요소

- Xcode 프로젝트, 대상 OS와 지원 기기 범위 결정
- Text·Layout·Shape·Canvas·네이티브 Control 우선
- SwiftUI Metal shader 효과는 iOS 17/macOS 14 이상 분기, Liquid Glass는 iOS/macOS 26 이상 분기


### 통합 순서

- CSS 값을 의미 Color·Font·Spacing 토큰으로 매핑하고 Dynamic Type·안전 영역을 반영한다.
- DOM 상태를 Observable 모델과 Button·Toggle·Picker·DisclosureGroup 등 네이티브 조작에 연결한다.
- 2D 그래픽은 Shape/Canvas로 다시 그리고 복잡한 필터만 layerEffect/distortionEffect로 분리한다.
- 공간 장면은 RealityKit, 다중 패스 후처리는 MTKView로 분리한다. WKWebView는 웹을 유지하는 별도 선택이지 네이티브 변환이 아니다.


### 확인할 결과

- VoiceOver·Dynamic Type 최대 크기·키보드·Reduce Motion·Reduce Transparency 확인
- 최소 OS에서 availability 분기·정적 재질 대안 확인
- 실기기에서 Instruments로 CPU/GPU·메모리·스크롤 측정


### 제약

- 시안 HTML을 SwiftUI 코드로 자동 변환하지 않는다.
- SwiftUI layerEffect는 전달된 래스터 레이어를 샘플링하며 임의의 뒤쪽 네이티브 뷰나 3D 장면을 자동 캡처하지 않는다.


### 공식 참고

- [https://developer.apple.com/documentation/swiftui](https://developer.apple.com/documentation/swiftui)
- [https://developer.apple.com/documentation/swiftui/view/layereffect(_:maxsampleoffset:isenabled:)](https://developer.apple.com/documentation/swiftui/view/layereffect(_:maxsampleoffset:isenabled:))
- [https://developer.apple.com/documentation/swiftui/applying-liquid-glass-to-custom-views](https://developer.apple.com/documentation/swiftui/applying-liquid-glass-to-custom-views)


<a id="metal"></a>
## Apple Metal·MetalKit `metal`

### 필요 요소

- Metal 지원 기기와 MTLDevice 생성 실패 처리
- MTKView·MTKViewDelegate·command queue·pipeline state
- GLSL ES를 MSL로 재작성하고 render target·uniform·sampler 수명 설계


### 통합 순서

- SwiftUI에서는 UIViewRepresentable/NSViewRepresentable로 MTKView를 호스팅하고 조작 UI는 네이티브로 유지한다.
- ASCII는 저해상도 장면 텍스처 → 문자 아틀라스 합성으로 두 패스를 명시한다.
- 유리는 뒤 배경 텍스처·물체 rect/shape uniform → 광학 fragment 패스로 재구성한다.
- 픽셀 좌표·UV Y축·열 우선 행렬·정렬/padding·색 공간·premultiplied alpha를 비교한다.
- 화면 숨김·scenePhase 비활성·Reduce Motion에서 draw를 중단하고 drawable 크기 변경과 자원 해제를 처리한다.


### 확인할 결과

- Metal API Validation·GPU Frame Capture로 패스 의존·texture usage·경계 검사
- 16.7ms/60fps 또는 33.3ms/30fps 중 목표를 정해 실기기 측정
- 저전력·열·메모리 압박·GPU 불가 시 정적 대안 확인


### 제약

- 현재 저장소에는 이 시안들의 .metal 구현이 없다. 제공하는 것은 이식 설계다.
- Metal 4 전용 기능은 필요 조건이 아니다. 실제 사용 기능에 맞는 SDK·OS·GPU family를 선택한다.


### 공식 참고

- [https://developer.apple.com/documentation/metal](https://developer.apple.com/documentation/metal)
- [https://developer.apple.com/documentation/metalkit/mtkview](https://developer.apple.com/documentation/metalkit/mtkview)


<a id="realitykit"></a>
## RealityKit·공간/3D 앱 `realitykit`

### 필요 요소

- RealityKit과 대상 OS에서 지원하는 RealityView 또는 ARView 선택
- 권리가 확인된 USD/USDZ 모델과 PBR 텍스처
- Reality Composer Pro 등 현재 Xcode 도구에서 변환·재질 호환성 확인


### 통합 순서

- Three.js scene graph를 Entity·ModelEntity·카메라·조명으로 다시 구성한다.
- GLB를 그대로 네이티브 자산으로 취급하지 않고 USDZ 변환 후 축·단위·roughness·normal·alpha를 검수한다.
- 책 목업·극장 좌석은 실제 메시가 없으므로 원본 SVG에서 모델링 또는 2D 평면 방식을 선택한다.
- SwiftUI overlay로 목록·설명·상태와 접근 가능한 조작을 제공한다.


### 확인할 결과

- 실기기에서 모델 크기·원점·피벗·재질·광원과 로드 실패 확인
- 공간 이동·재중심화·가림·정적 대안·멀미 확인
- 자산 크기·LOD·텍스처·엔티티 수 예산 측정


### 제약

- WebGL ShaderMaterial·레이마칭은 RealityKit 재질로 자동 이전되지 않는다.
- AR 카메라 기능을 실제로 사용하는 경우에만 카메라 권한과 AR 세션을 추가한다.


### 공식 참고

- [https://developer.apple.com/documentation/realitykit](https://developer.apple.com/documentation/realitykit)
- [https://developer.apple.com/documentation/usd](https://developer.apple.com/documentation/usd)


<a id="spritekit"></a>
## SpriteKit·2D 게임 에셋 `spritekit`

### 필요 요소

- SpriteKit scene·노드·터치/키보드 입력
- PNG/텍스처 아틀라스 또는 SKShader로 변환
- 폰트·사운드·원화의 게임 재배포 권리


### 통합 순서

- SVG 도형·마스크를 목표 배율 PNG로 래스터화하고 알파·패딩·피벗을 정의한다.
- 텍스트는 SKLabelNode/SwiftUI로 분리해 번역·접근성 경로를 유지한다.
- 입자·등불·비는 SKEmitterNode 또는 SKShader로 재작성한다. UI 상태는 게임 상태와 분리한다.


### 확인할 결과

- 2x/3x 배율과 아틀라스 가장자리 번짐·premultiplied alpha 확인
- 노드 수·draw call·텍스처 메모리·프레임 시간 측정
- 오디오 중단·일시정지·앱 백그라운드 전환 확인


### 제약

- SDF 캐릭터는 메시·본·스프라이트 시트가 아니다. 프레임 캡처/베이크 또는 셰이더 이식이 필요하다.


### 공식 참고

- [https://developer.apple.com/documentation/spritekit](https://developer.apple.com/documentation/spritekit)


<a id="unity"></a>
## Unity 게임·UI·셰이더 `unity`

### 필요 요소

- 프로젝트 Unity 버전과 Built-in/URP/HDRP 렌더 파이프라인 확정
- UI Toolkit 또는 uGUI와 별도 게임 상태 모델
- 권리 확인 자산·HLSL/Shader Graph·RenderTexture


### 통합 순서

- 지면은 UI Toolkit/uGUI로 재구성하고 도형은 Sprite/메시로 추출한다.
- ASCII는 scene RenderTexture와 glyph atlas를 fullscreen pass로 연결한다. URP/HDRP별 확장 지점이 다르므로 기존 파이프라인을 따른다.
- 유리 굴절에는 배경 color texture와 투명 오브젝트 정렬을 설계한다.
- GLB는 승인된 importer 또는 DCC 변환 경로를 선정하고 단위·재질·텍스처를 검수한다.


### 확인할 결과

- 목표 플랫폼 빌드에서 shader variant·색 공간·깊이/투명 정렬 확인
- Profiler·Frame Debugger로 CPU/GPU·draw call·메모리 측정
- 패드·키보드·터치·UI 포커스·일시정지 확인


### 제약

- WebGL/GLSL 코드는 Unity 셰이더가 아니다. 렌더 파이프라인별 재작성이 필요하다.


### 공식 참고

- [https://docs.unity3d.com/Manual/Shaders.html](https://docs.unity3d.com/Manual/Shaders.html)
- [https://docs.unity3d.com/Manual/UIElements.html](https://docs.unity3d.com/Manual/UIElements.html)


<a id="godot"></a>
## Godot 게임·그래픽 `godot`

### 필요 요소

- Godot 버전·Forward+/Mobile/Compatibility 렌더러 결정
- Control/Theme·SubViewport·ShaderMaterial
- 재배포 가능한 glTF·PNG·폰트·오디오


### 통합 순서

- 지면은 Control Container와 Theme로, 2D 효과는 canvas_item shader로 분리한다.
- ASCII는 SubViewport 장면 → ViewportTexture → 문자 아틀라스 후처리로 구성한다.
- 유리는 screen texture의 복사 시점·BackBufferCopy와 렌더러 제약을 확인한다.
- 3D는 glTF를 가져와 재질·광원·카메라를 Godot 장면으로 다시 연결한다.


### 확인할 결과

- 선택 렌더러와 내보내기 대상에서 screen/depth texture 지원 확인
- 늘어난 창·고해상도·입력 포커스와 GPU 시간을 측정
- 리소스 import 오류와 오디오/권한 실패를 표시


### 제약

- GLSL과 유사해도 Godot shader의 내장 변수·샘플러·좌표 규약으로 변경해야 한다.


### 공식 참고

- [https://docs.godotengine.org/en/stable/tutorials/shaders/index.html](https://docs.godotengine.org/en/stable/tutorials/shaders/index.html)
- [https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/importing_3d_scenes/index.html](https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/importing_3d_scenes/index.html)


<a id="unreal"></a>
## Unreal Engine 게임·재질 `unreal`

### 필요 요소

- 프로젝트 엔진 버전·대상 RHI·모바일/데스크톱 렌더 경로 결정
- UMG/Slate·Material Editor·Post Process Material
- 검증된 메시/텍스처/사운드 import 경로와 권리


### 통합 순서

- 지면을 UMG 위젯과 스타일로 재구성하고 SVG는 지원 플러그인 확인 또는 PNG/메시로 변환한다.
- ASCII는 SceneCapture2D/RenderTarget 또는 Post Process 입력과 glyph atlas를 결합한다.
- 유리는 Translucency/Refraction 재질로 다시 설계하고 모바일에서 대체 재질을 제공한다.
- 캐릭터 SDF를 Skeletal Mesh로 오해하지 말고 shader·베이크 sprite·신규 모델링 중 선택한다.


### 확인할 결과

- 패키지 빌드에서 재질 compile·렌더 경로·투명도·Lumen 설정 차이 확인
- GPU Visualizer/Unreal Insights로 GPU·메모리·프레임 예산 측정
- UMG 포커스·게임패드·해상도 스케일·정적 대안 확인


### 제약

- Three.js 조명/물성·웹 애니메이션을 Blueprint나 Material로 자동 변환하지 않는다.


### 공식 참고

- [https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-motion-graphics-ui-designer-umg](https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-motion-graphics-ui-designer-umg)
- [https://dev.epicgames.com/documentation/en-us/unreal-engine/post-process-materials-in-unreal-engine](https://dev.epicgames.com/documentation/en-us/unreal-engine/post-process-materials-in-unreal-engine)


## 기술별 변환 경로

<a id="css-layout"></a>
### 반응형 편집·유동 타이포 `css-layout`

Grid/Flex·상대 단위·clamp와 미디어 쿼리로 활자·이미지의 위계와 재배치를 만든다.

- 웹: 색·간격·타입을 토큰으로 추출하고 실제 문구 길이에 맞게 breakpoint를 다시 정한다.
- Apple: SwiftUI Layout/Grid/ViewThatFits·Text·Dynamic Type으로 재구성한다. 픽셀 고정 크기를 그대로 이식하지 않는다.
- 게임: UI Toolkit/uGUI·Godot Control·UMG 또는 SpriteKit 노드에 앵커·해상도 스케일·폰트 메트릭을 다시 정의한다.

- 긴 한국어·번역·큰 글씨·좁은 화면에서 겹침과 잘림 확인

적용 시안: [slow-bookshop](./design-inventory.md#slow-bookshop), [reference-house](./design-inventory.md#reference-house), [reference-exhibition](./design-inventory.md#reference-exhibition), [reference-sport](./design-inventory.md#reference-sport), [sports-collage](./design-inventory.md#sports-collage), [black-editorial](./design-inventory.md#black-editorial), [black-minimal](./design-inventory.md#black-minimal), [aesthetic-notes](./design-inventory.md#aesthetic-notes), [high-energy](./design-inventory.md#high-energy)

- [공식 참고](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout)

<a id="svg-illustration"></a>
### SVG 벡터·그라데이션·깊이 `svg-illustration`

path·gradient·pattern·그룹 변환으로 제품과 공간을 2D에서 직접 그린다. 실제 3D 메시와 다르다.

- 웹: viewBox와 ID 참조를 유지하고 symbol로 추출할 때 gradient/filter ID 충돌을 방지한다.
- Apple: 단순 path는 Shape/Canvas로 재작성하거나 PDF/PNG 자산으로 변환한다. SVG 필터의 Asset Catalog 지원을 가정하지 않는다.
- 게임: 목표 해상도 PNG·sprite atlas 또는 메시로 변환한다. 그림자·빛은 베이크할 부분과 실시간 재질을 분리한다.

- 뷰박스·스케일·stroke·투명도·필터 잘림·대체 설명 확인

적용 시안: [slow-bookshop](./design-inventory.md#slow-bookshop), [midnight-cinema](./design-inventory.md#midnight-cinema), [reference-object](./design-inventory.md#reference-object), [boxing-overhead](./design-inventory.md#boxing-overhead), [boxing-vintage](./design-inventory.md#boxing-vintage), [boxing-arena](./design-inventory.md#boxing-arena)

- [공식 참고](https://developer.mozilla.org/en-US/docs/Web/SVG)

<a id="image-masking"></a>
### 사진 크롭·SVG 컷아웃·마스크 `image-masking`

동일 사진을 다른 크기로 재사용하고 clipPath와 전경 마스크로 활자 앞뒤를 나눈다.

- 웹: 원본 사진·크롭 위치·마스크 path를 함께 추출한다. 수동 윤곽을 자동 배경 제거로 설명하지 않는다.
- Apple: Image의 scaledToFill·clipped·mask/Shape를 사용하고 화면 비율별 크롭을 조정한다.
- 게임: 알파 PNG 또는 mask texture로 베이크하고 atlas padding·alpha blending을 확인한다.

- 원본 해상도·크롭·초상권·상표권·사진 라이선스와 편집 고지 확인

적용 시안: [slow-bookshop](./design-inventory.md#slow-bookshop), [reference-house](./design-inventory.md#reference-house), [reference-exhibition](./design-inventory.md#reference-exhibition), [reference-sport](./design-inventory.md#reference-sport), [sports-collage](./design-inventory.md#sports-collage)

- [공식 참고](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/clipPath)

<a id="procedural-texture"></a>
### 노이즈·종이·절차적 텍스처 `procedural-texture`

SVG feTurbulence·blend·반복 패턴 또는 Canvas로 종이·직물·카펫의 미세 변화를 만든다.

- 웹: 노이즈의 seed·scale·opacity를 분리하고 읽기 대비와 필터 비용을 제한한다.
- Apple: 정적 텍스처를 베이크하거나 Canvas/Metal noise로 재작성한다. 앱 전체에 실시간 필터를 무조건 적용하지 않는다.
- 게임: tileable texture·normal/roughness map으로 분리하고 mipmap·색 공간·타일 반복을 검수한다.

- 축소 모아레·움직임·대비·텍스처 메모리 확인

적용 시안: [midnight-cinema](./design-inventory.md#midnight-cinema), [midnight-cinema-3d](./design-inventory.md#midnight-cinema-3d), [reference-object](./design-inventory.md#reference-object), [reference-exhibition](./design-inventory.md#reference-exhibition), [reference-sport](./design-inventory.md#reference-sport), [boxing-overhead](./design-inventory.md#boxing-overhead), [boxing-vintage](./design-inventory.md#boxing-vintage), [screen-effects](./design-inventory.md#screen-effects)

- [공식 참고](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feTurbulence)

<a id="design-tokens"></a>
### 의미 색상 토큰·배색 전환 `design-tokens`

배경·본문·보조색·강조색을 CSS custom property로 분리하고 동일한 역할에 팔레트를 바꿔 적용한다.

- 웹: 변수를 프로젝트 토큰으로 매핑한다. 분위기 전환 UI와 실제 설정 저장 기능은 별개다.
- Apple: Color asset/의미 Color 집합으로 구성하고 다크 모드·고대비·시스템 테마 우선순위를 결정한다.
- 게임: Theme/ScriptableObject/Data Asset 등 프로젝트의 팔레트 데이터로 저장하고 상태색은 별도로 유지한다.

- 본문·보조 정보·포커스·선택·오류의 대비와 비색상 단서 확인

적용 시안: [reference-object](./design-inventory.md#reference-object), [high-energy](./design-inventory.md#high-energy), [color-combinations](./design-inventory.md#color-combinations), [mood-examples](./design-inventory.md#mood-examples)

- [공식 참고](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)

<a id="dom-state"></a>
### 시맨틱 컨트롤·검색·상태 관리 `dom-state`

네이티브 HTML 조작과 JS 상태를 연결해 검색·선택·펼침·탭·모달을 시연한다.

- 웹: ARIA와 실제 상태·포커스를 동기화하고 데모 데이터·메모리 상태를 제품 저장 기능으로 오해하지 않는다.
- Apple: Observable 상태와 Button·Toggle·Picker·List·DisclosureGroup·sheet를 연결한다. DOM 이벤트를 직접 번역하지 않는다.
- 게임: UI 이벤트를 게임 상태 모델로 연결하고 포커스·패드 탐색·pause 중 입력 정책을 정한다.

- 키보드·포커스 복귀·빈 결과·중복 동작·상태 전환 확인

적용 시안: [liquid-glass](./design-inventory.md#liquid-glass), [slow-bookshop](./design-inventory.md#slow-bookshop), [birthday](./design-inventory.md#birthday), [black-editorial](./design-inventory.md#black-editorial), [black-minimal](./design-inventory.md#black-minimal), [mood-examples](./design-inventory.md#mood-examples), [screen-effects](./design-inventory.md#screen-effects)

- [공식 참고](https://www.w3.org/WAI/ARIA/apg/)

<a id="motion-lifecycle"></a>
### 모션·포인터·렌더 수명 `motion-lifecycle`

CSS/WAAPI/requestAnimationFrame과 사용자 모션 설정·가시성·정지 제어를 연결한다. 시안마다 지원 범위가 다르다.

- 웹: 초기 내용은 보존하고 visibility/IntersectionObserver·일시정지·dispose를 필요한 렌더러에 연결한다.
- Apple: withAnimation·TimelineView·scenePhase·accessibilityReduceMotion을 사용하고 상태 변경과 장식 모션을 분리한다.
- 게임: 엔진 update/tween·pause·노드 수명으로 이전하고 장면 종료 시 타이머·입자·오디오를 해제한다.

- 중간 중단·재개·숨김 탭·백그라운드·큰 delta time·Reduce Motion 확인

적용 시안: [ascii-character](./design-inventory.md#ascii-character), [liquid-glass](./design-inventory.md#liquid-glass), [midnight-cinema-3d](./design-inventory.md#midnight-cinema-3d), [birthday](./design-inventory.md#birthday), [black-editorial](./design-inventory.md#black-editorial), [screen-effects](./design-inventory.md#screen-effects)

- [공식 참고](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)

<a id="css-light-state"></a>
### CSS 상태 기반 조명·막 전환 `css-light-state`

@property --house와 :has(#house-lights:checked)로 하나의 수치가 SVG 광원·막·제목 상태를 함께 바꾼다.

- 웹: 조명 상태를 하나의 토큰으로 유지하고 미지원 브라우저의 즉시 전환·기본 장면을 확인한다.
- Apple: Observable lightProgress와 Animatable Shape/Canvas로 상태를 공유한다. 실제 3D 조명은 RealityKit/Metal로 별도 구현한다.
- 게임: 하나의 animation/tween parameter로 light intensity·curtain transform·UI alpha를 동기화한다.

- 빠른 토글·중간 역전·모션 감소·제목 읽기 가능성 확인

적용 시안: [midnight-cinema](./design-inventory.md#midnight-cinema), [midnight-cinema-3d](./design-inventory.md#midnight-cinema-3d)

- [공식 참고](https://developer.mozilla.org/en-US/docs/Web/CSS/@property)
- [공식 참고](https://developer.mozilla.org/en-US/docs/Web/CSS/:has)

<a id="webgl-sdf"></a>
### WebGL 2·SDF 레이마칭 `webgl-sdf`

GLSL ES 3.00 fragment shader에서 거리 함수와 광선 진행으로 픽셀을 생성한다. 메시·본·물리 정보가 없다.

- 웹: scene 거리 함수·카메라·uniform·step budget을 추출하고 WebGL 2·shader compile 실패를 표시한다.
- Apple: MSL float 타입·sampler·texture·uniform 레이아웃으로 다시 작성하고 MTKView 패스를 구성한다.
- 게임: Unity HLSL·Godot shader·Unreal Material/Custom 노드로 재작성한다. 충돌·리깅은 별도 모델이 필요하다.

- ray step·해상도·precision·윤곽 aliasing·GPU 시간·컨텍스트 손실 확인

적용 시안: [ascii-character](./design-inventory.md#ascii-character), [liquid-glass](./design-inventory.md#liquid-glass)

- [공식 참고](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext)
- [공식 참고](https://developer.apple.com/documentation/metal)

<a id="ascii-postprocess"></a>
### 저해상도 FBO·ASCII 문자 아틀라스 `ascii-postprocess`

저해상도 장면의 밝기를 계산해 Canvas로 실제 커버리지를 정렬한 glyph atlas를 셀마다 샘플링한다.

- 웹: SCENE_SHADER → framebuffer texture → ASCII_SHADER의 두 패스를 유지한다. 문자 크기와 DPR은 분리한다.
- Apple: MTLTexture 저해상도 render target과 glyph atlas를 두 번째 fragment 패스에 전달한다. CoreText/CoreGraphics 또는 미리 베이크한 atlas를 사용한다.
- 게임: RenderTexture/SubViewport/RenderTarget과 후처리 재질로 분리한다. atlas는 nearest sampling과 명시적 셀 종횡비를 쓴다.

- 격자 320×180·총 36,000셀 이하, 출력 DPR 최대 1.5·2048×1536 상한 보존
- 실제 폰트가 달라지면 glyph 커버리지를 다시 정렬

적용 시안: [ascii-character](./design-inventory.md#ascii-character)

- [공식 참고](https://developer.apple.com/documentation/metal/mtltexture)

<a id="optical-glass"></a>
### 굴절·Fresnel·흡수·유리 재질 `optical-glass`

SDF 형태의 입사·출사 굴절, Fresnel 반사와 투과 흡수로 유리 표면을 합성한다. CSS blur만의 효과가 아니다.

- 웹: DOM rect/shape를 uniform으로 측정해 canvas 재질과 실제 HTML 컨트롤을 정렬한다. CSS 대안을 유지한다.
- Apple: 시스템 조작은 iOS/macOS 26+ glassEffect를 우선 검토한다. 동일 광학 연구는 배경 텍스처를 입력하는 Metal 패스로 별도 재작성한다.
- 게임: 배경 color texture·normal·두께·IOR·roughness를 가진 굴절 재질로 재설계한다. 투명 정렬·모바일 비용을 확인한다.

- 밝고 어두운 배경에서 글자 대비·포커스 확인
- 굴절 품질과 시스템 Liquid Glass의 동등성을 주장하지 않음

적용 시안: [liquid-glass](./design-inventory.md#liquid-glass)

- [공식 참고](https://developer.apple.com/documentation/swiftui/applying-liquid-glass-to-custom-views)

<a id="three-pbr"></a>
### Three.js·PBR 조명·장면 `three-pbr`

scene graph·카메라·재질·광원으로 실제 3D 장면을 렌더링한다. 생일 r180과 극장 내장 r187은 별도 런타임이다.

- 웹: 버전별 엔진·loader를 혼합하지 않는다. 색 공간·tone mapping·shadow·dispose·품질 조절을 함께 이전한다.
- Apple: RealityKit Entity/재질/광원으로 재구성하거나 필요 시 직접 Metal을 선택한다. Three.js 코드는 Swift API가 아니다.
- 게임: 엔진 재질·광원 단위·노출·그림자 품질을 다시 맞춘다. 웹 렌더와 완전 동일한 화면을 보장하지 않는다.

- 로드 실패·메모리·shader compile·GPU 미지원·정적 대안 확인

적용 시안: [midnight-cinema-3d](./design-inventory.md#midnight-cinema-3d), [birthday](./design-inventory.md#birthday)

- [공식 참고](https://threejs.org/docs/)
- [공식 참고](https://developer.apple.com/documentation/realitykit)

<a id="gltf-assets"></a>
### Blender→GLB·모바일 자산 최적화 `gltf-assets`

원본 모델을 보존하고 메시 decimation·텍스처 축소·JPEG 압축으로 모바일 GLB를 만든다.

- 웹: GLTFLoader와 상대 texture 경로를 유지한다. 현재 cake-mobile.glb는 텍스처 포함 GLB다.
- Apple: 권리 확인 뒤 USDZ로 변환하고 축·단위·PBR 채널·법선을 검수한다. GLB가 RealityKit에서 그대로 로드된다고 가정하지 않는다.
- 게임: 엔진 importer/변환 경로를 선택하고 LOD·collision·피벗·scale·mipmap·압축 포맷을 별도로 만든다.

- 기존 모델 예산 46,000 triangles·4MiB 이내; 기록된 실제 값 44,999 triangles·2,530,632 bytes
- base color 최대 2048, 나머지 최대 1024; 원본 SHA-256 보존

적용 시안: [birthday](./design-inventory.md#birthday)

- [공식 참고](https://registry.khronos.org/glTF/)
- [공식 참고](https://developer.apple.com/documentation/usd)

<a id="web-audio"></a>
### Web Audio·호흡 분석·재생 정책 `web-audio`

RMS와 700–9000Hz 에너지 비율로 호흡을 추정하고 사용자 제스처에서 음악·박수 재생을 준비한다.

- 웹: getUserMedia·AudioContext의 권한/자동재생 실패를 알리고 버튼 대안을 유지한다. 측정 데이터는 녹음·업로드하지 않는다.
- Apple: AVAudioEngine input tap과 Accelerate/vDSP 분석, AVAudioSession·현재 권한 API·NSMicrophoneUsageDescription을 구성한다. 앱별 audio session 정책·인터럽트를 처리한다.
- 게임: 엔진 microphone buffer의 RMS/FFT와 상태 모델을 연결하고 기기별 noise floor를 재보정한다. 마이크 없이 버튼으로 진행할 수 있게 한다.

- 700ms 보정, noise×2.8와 0.03 중 큰 RMS 문턱·airRatio>0.06·400ms 유지의 현재 로직 확인
- 권한 거부·잡음·박수 오탐·재생 실패·장면 종료 시 트랙/오디오 해제

적용 시안: [birthday](./design-inventory.md#birthday)

- [공식 참고](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [공식 참고](https://developer.apple.com/documentation/avfaudio/avaudioengine)

## Swift 앱에서 특히 빠뜨리지 않을 요소

- 2D SwiftUI Shader: .metal stitchable 함수의 signature·maxSampleOffset·래스터 레이어 경계를 지킵니다. layerEffect는 임의의 뒤쪽 네이티브 화면을 읽는 API가 아닙니다.

- MTKView: command buffer 완료 전 재사용하는 uniform buffer를 동기화하고 render target 크기·usage·pixel format·색 공간을 명시합니다. ASCII는 장면 텍스처와 문자 아틀라스 합성 텍스처를 구분합니다.

- glTF/GLB → USDZ: 변환 도구의 현재 지원을 확인하고 축·미터 단위·피벗·법선·sRGB base color와 linear data texture를 검사합니다. 모델의 collision/LOD/rig는 별도 작업입니다.

- 마이크: NSMicrophoneUsageDescription·현재 대상 OS의 권한 API·AVAudioSession·AVAudioEngine tap·vDSP FFT를 연결합니다. 권한 거부 시 버튼 대안, 인터럽트/백그라운드 시 엔진과 입력 해제가 필요합니다.

- 시스템 Liquid Glass는 iOS/macOS 26+ availability 분기로 적용하고 이전 OS는 Material/단색 대안을 둡니다. 단지 사용자가 Metal을 언급했다고 Metal 4 전용 기능을 필수로 만들지 않습니다.

- 이 안내는 API 선택 근거입니다. 실제 Xcode 프로젝트·MSL·USDZ·엔진 패키지는 아직 제공하지 않습니다.
