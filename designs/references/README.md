# 레퍼런스 구성 연구

> 이 문서는 content/design-reuse.json·content/analyses와 시안 정의에서 생성합니다. 수정 후 npm run docs:designs를 실행하세요.


건축·제품·전시·스포츠의 구도와 재질을 연구한 최소 완성도 비교 시안.

[전체 탐색](../README.md) · [플랫폼별 이식 가이드](<../../docs/platform-adoption.md>)

<a id="reference-house"></a>
## Forma — 건축 사진과 활자 스터디 `reference-house`

Hotle의 가는 초대형 영문 제목·건축 사진 중첩·작은 설명의 비율을 연구한 지면. 실제 판스워스 하우스 사진을 대체 자산으로 사용.

원본: [reference-house.html](<reference-house.html>) · 이전 주소: `docs/reference-house.html` (이동 안내)

동반 문서: [reference-studies.md](<reference-studies.md>)

별도 색감·레이아웃·폰트 기록은 아직 없습니다. [분석을 추가하는 방법](<../../docs/recording-analyses.md>)

### 실제 적용 기술과 확인 위치

- **반응형 편집·유동 타이포** `css-layout`: 가는 초대형 영문 제목·작은 설명·여백 비율을 만든다. 확인: [reference-house.html](<reference-house.html>).
- **사진 크롭·SVG 컷아웃·마스크** `image-masking`: 건축 사진 크롭과 전경 마스크를 제목 앞뒤로 겹친다. 확인: [reference-house.html](<reference-house.html>).


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

원본: [reference-object.html](<reference-object.html>) · 이전 주소: `docs/reference-object.html` (이동 안내)

동반 문서: [reference-studies.md](<reference-studies.md>)

별도 색감·레이아웃·폰트 기록은 아직 없습니다. [분석을 추가하는 방법](<../../docs/recording-analyses.md>)

### 실제 적용 기술과 확인 위치

- **SVG 벡터·그라데이션·깊이** `svg-illustration`: SVG 도형·그라데이션·clipPath로 큰 조명 제품의 비례와 반사를 그린다. 확인: [reference-object.html](<reference-object.html>).
- **노이즈·종이·절차적 텍스처** `procedural-texture`: feTurbulence로 재질의 미세 변화를 보조한다. 확인: [reference-object.html](<reference-object.html>).
- **의미 색상 토큰·배색 전환** `design-tokens`: 주황 동계색의 명도 차이로 제품과 작은 흰 제목을 구분한다. 확인: [reference-object.html](<reference-object.html>).


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

원본: [reference-exhibition.html](<reference-exhibition.html>) · 이전 주소: `docs/reference-exhibition.html` (이동 안내)

동반 문서: [reference-studies.md](<reference-studies.md>)

별도 색감·레이아웃·폰트 기록은 아직 없습니다. [분석을 추가하는 방법](<../../docs/recording-analyses.md>)

### 실제 적용 기술과 확인 위치

- **반응형 편집·유동 타이포** `css-layout`: 반반 이미지/활자와 대형 목록에 로컬 Be Vietnam Pro 900 @font-face를 적용한다. 확인: [reference-exhibition.html](<reference-exhibition.html>).
- **사진 크롭·SVG 컷아웃·마스크** `image-masking`: 기존 축구 사진을 크게 크롭해 대체 인물 이미지로 사용한다. 확인: [reference-exhibition.html](<reference-exhibition.html>).
- **노이즈·종이·절차적 텍스처** `procedural-texture`: SVG 노이즈·명암으로 은색 재질 이미지를 만든다. 확인: [reference-exhibition.html](<reference-exhibition.html>).


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

원본: [reference-sport.html](<reference-sport.html>) · 이전 주소: `docs/reference-sport.html` (이동 안내)

동반 문서: [reference-studies.md](<reference-studies.md>)

별도 색감·레이아웃·폰트 기록은 아직 없습니다. [분석을 추가하는 방법](<../../docs/recording-analyses.md>)

### 실제 적용 기술과 확인 위치

- **사진 크롭·SVG 컷아웃·마스크** `image-masking`: player/ball clipPath로 사진 속 인물과 공을 큰 적색 활자 앞에 겹친다. 확인: [reference-sport.html](<reference-sport.html>).
- **노이즈·종이·절차적 텍스처** `procedural-texture`: 종이색·노이즈·blend로 포스터 질감을 만든다. 확인: [reference-sport.html](<reference-sport.html>).
- **반응형 편집·유동 타이포** `css-layout`: 로컬 Impact 계열로 세로 포스터의 압축 활자를 근사한다. 확인: [reference-sport.html](<reference-sport.html>).


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
