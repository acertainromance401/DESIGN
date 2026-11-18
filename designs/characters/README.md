# 절차적 캐릭터·ASCII

> 이 문서는 content/design-reuse.json·content/analyses와 시안 정의에서 생성합니다. 수정 후 npm run docs:designs를 실행하세요.


SDF 입체 생성과 문자 아틀라스 후처리의 두 패스 렌더링.

[전체 탐색](../README.md) · [플랫폼별 이식 가이드](<../../docs/platform-adoption.md>)

<a id="ascii-character"></a>
## 작은 방랑자 — ASCII 캐릭터 `ascii-character`

SDF로 생성한 입체 캐릭터를 저해상도 장면과 실제 문자 아틀라스의 두 패스로 문자화한다.

원본: [ascii-character.html](<ascii-character.html>) · 이전 주소: `ascii-character.html` (이동 안내)

별도 색감·레이아웃·폰트 기록은 아직 없습니다. [분석을 추가하는 방법](<../../docs/recording-analyses.md>)

### 실제 적용 기술과 확인 위치

- **WebGL 2·SDF 레이마칭** `webgl-sdf`: SCENE_SHADER의 ellipsoid/box/capsule·scene·normalAt가 후드·망토·등불을 생성하고 최대 88 step으로 레이마칭한다. 확인: [renderer.js](<assets/ascii/renderer.js>).
- **저해상도 FBO·ASCII 문자 아틀라스** `ascii-postprocess`: makeAtlas가 문자 픽셀 커버리지를 정렬하고 ASCII_SHADER가 FBO 장면 밝기·문자 크기·팔레트·빗금 글리프를 합성한다. 확인: [renderer.js](<assets/ascii/renderer.js>).
- **모션·포인터·렌더 수명** `motion-lifecycle`: AnimationClock·가시성·ResizeObserver·dispose/컨텍스트 손실로 정지/재개·출력 예산을 관리한다. 확인: [renderer.js](<assets/ascii/renderer.js>).


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

- [renderer.js](<assets/ascii/renderer.js>)
