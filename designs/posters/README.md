# 포스터·스포츠 그래픽

> 이 문서는 content/design-reuse.json·content/analyses와 시안 정의에서 생성합니다. 수정 후 npm run docs:designs를 실행하세요.


SVG 일러스트, 사진 컷아웃, 종이 질감, 강한 활자와 조명을 조합한다.

[전체 탐색](../README.md) · [플랫폼별 이식 가이드](<../../docs/platform-adoption.md>)

<a id="boxing-overhead"></a>
## 위에서 본 복싱 링 `boxing-overhead`

붉은 로프·청회색 매트·비스듬한 한글 제목·작은 인물로 구성한 오버헤드 복싱 지면.

원본: [boxing-overhead.html](<boxing-overhead.html>) · 이전 주소: `docs/boxing-overhead.html` (이동 안내)

동반 문서: [boxing-references.md](<boxing-references.md>)

별도 색감·레이아웃·폰트 기록은 아직 없습니다. [분석을 추가하는 방법](<../../docs/recording-analyses.md>)

### 실제 적용 기술과 확인 위치

- **SVG 벡터·그라데이션·깊이** `svg-illustration`: 붉은 로프·청회색 매트·작은 인물을 오버헤드 SVG 구도로 그린다. 확인: [boxing-overhead.html](<boxing-overhead.html>).
- **노이즈·종이·절차적 텍스처** `procedural-texture`: 고정 SVG turbulence로 매트/인쇄 질감을 보조한다. 확인: [boxing-overhead.html](<boxing-overhead.html>).


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

원본: [boxing-vintage.html](<boxing-vintage.html>) · 이전 주소: `docs/boxing-vintage.html` (이동 안내)

동반 문서: [boxing-references.md](<boxing-references.md>)

별도 색감·레이아웃·폰트 기록은 아직 없습니다. [분석을 추가하는 방법](<../../docs/recording-analyses.md>)

### 실제 적용 기술과 확인 위치

- **SVG 벡터·그라데이션·깊이** `svg-illustration`: 가드 자세 인물과 붉은 대형 글자를 독자적인 SVG로 구성한다. 확인: [boxing-vintage.html](<boxing-vintage.html>).
- **노이즈·종이·절차적 텍스처** `procedural-texture`: 종이색·고정 turbulence·blend로 인쇄 질감을 만든다. 확인: [boxing-vintage.html](<boxing-vintage.html>).


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

원본: [boxing-arena.html](<boxing-arena.html>) · 이전 주소: `docs/boxing-arena.html` (이동 안내)

동반 문서: [boxing-references.md](<boxing-references.md>)

별도 색감·레이아웃·폰트 기록은 아직 없습니다. [분석을 추가하는 방법](<../../docs/recording-analyses.md>)

### 실제 적용 기술과 확인 위치

- **SVG 벡터·그라데이션·깊이** `svg-illustration`: 군중·팔을 든 인물·청록 스포트라이트를 SVG 명암 레이어로 겹친다. 확인: [boxing-arena.html](<boxing-arena.html>).


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

원본: [sports-collage.html](<sports-collage.html>) · 이전 주소: `docs/sports-collage.html` (이동 안내)

동반 문서: [sports-collage.md](<sports-collage.md>)

별도 색감·레이아웃·폰트 기록은 아직 없습니다. [분석을 추가하는 방법](<../../docs/recording-analyses.md>)

### 실제 적용 기술과 확인 위치

- **사진 크롭·SVG 컷아웃·마스크** `image-masking`: 같은 사진을 전체·얼굴·인물 윤곽으로 재사용하고 수동 SVG clipPath로 프레임 밖 인물을 만든다. 확인: [sports-collage.html](<sports-collage.html>).
- **반응형 편집·유동 타이포** `css-layout`: 흰 여백과 사진 구획의 크기 차이로 스포츠 지면을 편집한다. 확인: [sports-collage.html](<sports-collage.html>).


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


<a id="high-energy"></a>
## 강렬한 러닝 이벤트 화면 `high-energy`

주황·먹색·라임, 큰 10K 숫자와 CSS 트랙으로 만든 야간 러닝 이벤트.

원본: [high-energy.html](<high-energy.html>) · 이전 주소: `docs/high-energy.html` (이동 안내)

별도 색감·레이아웃·폰트 기록은 아직 없습니다. [분석을 추가하는 방법](<../../docs/recording-analyses.md>)

### 실제 적용 기술과 확인 위치

- **반응형 편집·유동 타이포** `css-layout`: 초대형 10K 숫자·수평 구획·CSS 트랙 도형으로 야간 러닝 이벤트를 구성한다. 확인: [high-energy.html](<high-energy.html>).
- **의미 색상 토큰·배색 전환** `design-tokens`: 주황·먹색·라임을 역할별 면과 글자에 배분한다. 확인: [high-energy.html](<high-energy.html>).


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
