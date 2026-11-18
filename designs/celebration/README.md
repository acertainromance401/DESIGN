# 이벤트·오디오·상태 흐름

> 이 문서는 content/design-reuse.json·content/analyses와 시안 정의에서 생성합니다. 수정 후 npm run docs:designs를 실행하세요.


3D 케이크, 호흡 입력, 효과음과 편지·엔딩 전환. 개인 자산은 로컬 전용.

[전체 탐색](../README.md) · [플랫폼별 이식 가이드](<../../docs/platform-adoption.md>)

<a id="birthday"></a>
## 생일 — 케이크·호흡·편지 흐름 `birthday`

3D 케이크·호흡 감지·오디오·화면 상태 전환을 연결한 로컬 전용 이벤트 시안.

**로컬 전용**: `designs/celebration/birthday.html`. 개인 원문·모듈·자산은 GitHub와 npm에서 제외합니다. 공개 저장소와 설치본에는 이 분석만 제공합니다.

별도 색감·레이아웃·폰트 기록은 아직 없습니다. [분석을 추가하는 방법](<../../docs/recording-analyses.md>)

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
