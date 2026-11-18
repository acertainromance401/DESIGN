# 공간·서점·극장

> 이 문서는 content/design-reuse.json·content/analyses와 시안 정의에서 생성합니다. 수정 후 npm run docs:designs를 실행하세요.


2D SVG 깊이 표현과 실제 WebGL 3D 장면의 차이를 비교한다.

[전체 탐색](../README.md) · [플랫폼별 이식 가이드](<../../docs/platform-adoption.md>)

<a id="slow-bookshop"></a>
## 느린 서가 — 책 목업·독립서점 `slow-bookshop`

SVG 책의 종이 단면·책등·접촉 그림자와 건축 사진을 큰 제호에 겹친 2.5D 편집 시안.

원본: [slow-bookshop.html](<slow-bookshop.html>) · 이전 주소: `docs/slow-bookshop.html` (이동 안내)

별도 색감·레이아웃·폰트 기록은 아직 없습니다. [분석을 추가하는 방법](<../../docs/recording-analyses.md>)

### 실제 적용 기술과 확인 위치

- **SVG 벡터·그라데이션·깊이** `svg-illustration`: 겹친 책의 표지·책등·종이 단면·접촉 그림자를 SVG로 그려 2.5D 깊이를 만든다. 확인: [slow-bookshop.html](<slow-bookshop.html>).
- **사진 크롭·SVG 컷아웃·마스크** `image-masking`: 건축 사진을 책 표지 clipPath와 본문 사진에 재사용한다. 확인: [slow-bookshop.html](<slow-bookshop.html>).
- **시맨틱 컨트롤·검색·상태 관리** `dom-state`: details/summary로 책 소개를 키보드로 펼친다. 확인: [slow-bookshop.html](<slow-bookshop.html>).
- **반응형 편집·유동 타이포** `css-layout`: 대형 Seoga. 제호와 책 목업을 겹친 뒤 좁은 화면에서 재배치한다. 확인: [slow-bookshop.html](<slow-bookshop.html>).


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

원본: [midnight-cinema.html](<midnight-cinema.html>) · 이전 주소: `docs/midnight-cinema.html` (이동 안내)

별도 색감·레이아웃·폰트 기록은 아직 없습니다. [분석을 추가하는 방법](<../../docs/recording-analyses.md>)

### 실제 적용 기술과 확인 위치

- **SVG 벡터·그라데이션·깊이** `svg-illustration`: 오른쪽 계단 위 시점의 객석·머리·광선·먼지를 SVG로 직접 그린다. 확인: [midnight-cinema.html](<midnight-cinema.html>).
- **CSS 상태 기반 조명·막 전환** `css-light-state`: @property --house와 :has(#house-lights:checked)가 막·벽등·제목 상태를 함께 바꾼다. 확인: [midnight-cinema.html](<midnight-cinema.html>).
- **노이즈·종이·절차적 텍스처** `procedural-texture`: 그라데이션·노이즈·마스크로 어두운 좌석과 영사 빛을 표현한다. 확인: [midnight-cinema.html](<midnight-cinema.html>).


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

원본: [midnight-cinema-3d.html](<midnight-cinema-3d.html>) · 이전 주소: `docs/midnight-cinema-3d.html` (이동 안내)

별도 색감·레이아웃·폰트 기록은 아직 없습니다. [분석을 추가하는 방법](<../../docs/recording-analyses.md>)

### 실제 적용 기술과 확인 위치

- **Three.js·PBR 조명·장면** `three-pbr`: 내장 Three.js r187(MIT)의 3D 좌석·머리·스크린·조명·그림자로 SVG 장면을 대체한다. 확인: [midnight-cinema-3d.html](<midnight-cinema-3d.html>).
- **노이즈·종이·절차적 텍스처** `procedural-texture`: 직물·카펫·봉제선과 roughness 맵을 코드로 생성한다. 참고 극장 사진은 런타임 자산이 아니다. 확인: [midnight-cinema-3d.html](<midnight-cinema-3d.html>).
- **모션·포인터·렌더 수명** `motion-lifecycle`: 포인터 시차·프레임 지연 시 해상도 감소·동작 줄이기 정지 화면·SVG 대안을 제공한다. 확인: [midnight-cinema-3d.html](<midnight-cinema-3d.html>).
- **CSS 상태 기반 조명·막 전환** `css-light-state`: 기존 조명 스위치를 실시간 장면의 막과 조명 상태에 연결한다. 확인: [midnight-cinema-3d.html](<midnight-cinema-3d.html>).


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
