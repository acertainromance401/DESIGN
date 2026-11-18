# SwissBrut — 큰 활자와 프로젝트 이미지로 짠 스튜디오 포트폴리오

> 이 문서는 content/design-reuse.json·content/analyses와 시안 정의에서 생성합니다. 수정 후 npm run docs:designs를 실행하세요.


흰 지면과 검은 대형 활자가 기준을 잡는다. 따뜻한 얼굴 클로즈업과 차가운 은회색 작업 이미지가 색과 질감을 맡고, 서비스 목록과 작업 과정은 같은 지면 안에서 다른 크기와 밀도로 편집된다.

상태: **analyzed** · 작성 2026-11-18 · 수정 2026-11-18

참고자료: url / `https://www.pinterest.com/pin/1102819027539015009/`

2026-11-18 사용자가 '좋은 디자인'이라고 명시한 전체 디자인 선호 레퍼런스. Pinterest의 세로 합성 미리보기를 기준으로 분석했으며, Swiss Themes의 원페이지 Framer 데모는 서체 검증에 별도로 사용했다. 공유 초대 파라미터는 기록하지 않았다.

실행 HTML과 연결하지 않은 독립 참고자료입니다.

데이터: [pinterest-swissbrut-portfolio.json](<../../content/analyses/pinterest-swissbrut-portfolio.json>) · MCP: `design://analyses/pinterest-swissbrut-portfolio` · [전체 분석](./README.md)

## 색감 분석

흰 배경과 검은 글자가 사이트의 뼈대를 만들고, 연회색이 서비스 이름들의 시각적 무게를 낮춘다. 따뜻한 갈색·자주빛과 차가운 은회색은 UI 포인트가 아니라 작업 이미지 속에 있다.

| 역할 | 값 | 확인 수준 | 근거 |

| --- | --- | --- | --- |

| 첫 화면 오른쪽 흰 지면 | #FFFFFF | estimated | raster-samples |

| 큰 검은 제목 | #000000 | estimated | raster-samples |

| 서비스 목록의 옅은 글자 | #EDEDED | estimated | raster-samples |

| 얼굴의 따뜻한 중간 톤 | #946D54 | estimated | raster-samples |

| 얼굴 이미지의 자줏빛 그림자 | #58333D | estimated | raster-samples |

| 두 번째 작업 이미지의 밝은 은회색 | #B3B3B3 | estimated | raster-samples |

### 관찰과 근거

**색 면적과 분포** · `color.distribution`

- **색은 작업 이미지에 남김** (confirmed): 흰 지면과 검은 타이포그래피가 여러 구간을 이어준다. 첫 이미지의 갈색·자주빛은 UI에 반복되지 않고, 다음 작업 이미지가 은회색으로 바뀌어 분위기를 전환한다. · 근거: pin-preview

**명도와 대비** · `color.contrast`

- **같은 크기의 서비스 이름을 명도로 구분** (confirmed): 보이는 서비스 목록에서는 Design이 검고 나머지 큰 이름은 흰 배경에 가까운 연회색이다. 이 차이가 실제 데모의 어떤 상태를 뜻하는지는 미리보기만으로 확정할 수 없다. · 근거: pin-preview, raster-samples


### 색감 재사용

- 프로젝트 이미지 자체에 색과 재질의 차이가 충분하다면 바탕과 UI에 또 다른 포인트색을 강제하지 않는다.
- 주목할 항목은 대비로 구분할 수 있지만, 필수 정보나 조작 가능한 항목을 흰색에 가까운 회색으로 흐리지 않는다.


## 레이아웃 분석

첫 화면을 인물 이미지와 흰 지면으로 거의 반씩 나누고, 작은 보조 정보와 하단의 큰 제목을 같은 그리드에 얹는다. 이후 화면을 채우는 작업 이미지, 활자 목록, 얇은 선을 기준으로 정렬된 작업 과정으로 밀도가 바뀐다.

### 관찰과 근거

**프레임과 그리드** · `layout.grid`

- **반반 분할과 정렬 축** (confirmed): 첫 화면 왼쪽 약 절반은 얼굴 사진이고, 오른쪽은 흰색이다. 오른쪽의 내비게이션, 스튜디오 표기, 대형 제목 시작점이 같은 쪽 정렬 축을 공유한다. · 근거: pin-preview

**영역 위계와 흐름** · `layout.hierarchy`

- **큰 제목과 작은 보조 정보** (confirmed): 오른쪽 흰 면의 바닥에 Brut이 가장 크게 놓이고, 메뉴와 스튜디오 정보는 작게 떨어져 있다. 서비스 구간에서는 큰 활자 자체가 이미지를 대신한다. · 근거: pin-preview

**반복과 변화의 리듬** · `layout.rhythm`

- **이미지·활자·행 단위 그리드의 전환** (confirmed): 반반으로 나뉜 첫 화면 다음은 지면 전체를 쓰는 이미지, 그 다음은 큰 활자 네 줄이다. 이어지는 작업 과정은 얇은 가로줄로 나뉘고 큰 순번·이름·설명·작은 이미지가 각자 열을 갖는다. · 근거: pin-preview


### 레이아웃 재사용

- 탐색과 설명을 공통 정렬선에 두고, 제목과 작업 이미지에는 목적에 필요한 면적을 따로 할당한다.
- 작업 이미지·서비스 이름·과정 설명을 모두 같은 카드로 처리하지 않고, 정보 역할에 따라 전면 이미지·활자 목록·행 단위 그리드를 쓴다.


## 폰트 분석

굵은 대형 산세리프와 작은 보조 활자가 같은 패밀리를 쓴다. 별도의 장식용 서체를 추가하지 않고 크기·웨이트·자간으로 구분한 사례다.

### Brut과 Design 대형 제목

- 선언된 스택: Be Vietnam Pro, sans-serif
- 실제 렌더링 서체: Be Vietnam Pro Black
- 식별 수준: rendered-confirmed
- 굵기: 900
- 근거: demo-fonts, font-license

영문 샘플을 본 데스크톱 데모 값. 비슷한 굵기의 한글 서체를 쓰더라도 자간과 줄 높이는 다시 조정해야 한다.

출처·라이선스: 공개 배포본: SIL Open Font License 1.1

### Work 내비게이션과 첫 작업 과정 설명

- 선언된 스택: Be Vietnam Pro, Be Vietnam Pro Placeholder, sans-serif
- 실제 렌더링 서체: Be Vietnam Pro SemiBold
- 식별 수준: rendered-confirmed
- 굵기: 600
- 근거: demo-fonts, font-license

측정한 영문 노드에서는 Placeholder 대신 실제 웹폰트를 사용했다. 다른 언어의 글리프나 대체 서체는 검증하지 않았다.

출처·라이선스: 공개 배포본: SIL Open Font License 1.1

### 관찰과 근거

**굵기와 스타일** · `typography.weight-style`

- **한 패밀리에서 900과 600으로 역할 분리** (confirmed): 데스크톱 데모의 대형 제목 두 개는 900, 메뉴와 과정 설명 표본은 600이다. 제목은 약 291px로 재고, 두 보조 표본은 15px로 확인했다. · 근거: demo-fonts


### 폰트 재사용

- 서체를 추가하기 전에 하나의 패밀리에서 제목과 정보의 크기·무게 차이만으로 위계가 잡히는지 확인한다.
- 영문 초대형 제목의 자간을 한글이나 긴 제목에 그대로 이식하지 말고, 좁은 화면과 긴 문구에서 읽히는지 검수한다.


<a id="text-placement"></a>

## 글자 배치 분석

큰 제목을 지면 아래쪽에 붙이고 가운데 여백을 남긴다. 서비스 목록은 좌측 시작선을 유지한다.

### 관찰과 근거

**텍스트 위치와 정렬** · `text-placement.alignment`

- **제목을 아래에 두고 시작선을 유지** (confirmed): Brut은 오른쪽 흰 면의 아래와 왼쪽 경계 가까이에 놓인다. 서비스 이름들의 글자 수가 달라도 왼쪽 시작 위치는 같다. · 근거: pin-preview

**자간과 행간** · `text-placement.spacing`

- **큰 영문 제목에서만 강한 음의 자간** (confirmed): 1440px 데스크톱에서 확인한 제목 두 개는 자간이 약 -0.055em이고, 15px 메뉴·설명 표본은 -0.032em이다. · 근거: demo-fonts


### 재사용

- 큰 글자 주변의 여백과 시작선을 우선 설계하고, 제목과 작은 정보가 동일한 조판 수치를 쓰게 하지 않는다.


<a id="subject-composition"></a>

## 인물·피사체 구도 분석

첫 작업은 얼굴을 크게 자르고, 두 번째 작업은 반사되는 표면을 사선 방향으로 확대한 이미지다.

### 관찰과 근거

**프레이밍과 크롭** · `subject-composition.framing`

- **인물 전체 대신 얼굴이 지면을 채움** (confirmed): 첫 이미지는 얼굴의 윤곽 전체가 아니라 눈·코·입을 가까이 보여 준다. 좌우 여백을 두고 인물을 세우는 대신 얼굴이 이미지 영역 밖까지 이어진다. · 근거: pin-preview


### 재사용

- 작업의 인상을 전달하는 부분을 크게 잘라 쓰되, 모바일 크롭에서도 구분에 필요한 표정이나 특징을 보존한다.


<a id="texture"></a>

## 질감 분석

질감은 사이트 전체에 덧씌우지 않고 작업 이미지 내부에서 구분된다.

### 관찰과 근거

**반복 단위와 규칙** · `texture.pattern`

- **인물의 가는 결, 은회색 표면의 입자감** (confirmed): 얼굴 이미지에는 가는 수평 결이 보이고, 두 번째 은회색 이미지에는 길게 이어지는 반사와 미세한 입자가 보인다. 재질이나 제작 기법 자체는 미리보기로 판별할 수 없다. · 근거: pin-preview


### 재사용

- 프로젝트별 이미지의 질감을 살리고, 설명과 탐색이 놓이는 지면까지 같은 노이즈로 덮지 않는다.


## 취향과 디자인 결정

### `oversized-type-on-aligned-grid` · `layout.hierarchy` · 선호 후보

- **분석자 해석**: 큰 활자와 작은 메뉴·설명의 차이가 크면서도 정렬선이 반복되어, 강한 첫인상과 정돈된 정보가 공존한 점이 선호에 기여했을 수 있다.
  - 맥락: 작업 제목이나 서비스 이름이 짧고 실제로 전달할 내용이 있는 포트폴리오·브랜드 페이지.
  - 디자인 결정: 큰 제목은 필요한 곳에만 배치하고, 메뉴·캡션·설명은 공통 정렬선에 남긴다. 정확한 크기나 반반 분할을 고정하지 않는다.
  - 상충·검수: 작은 화면에서는 제목이나 메뉴를 자르거나 겹쳐 강조하지 않는다.
  - 근거: `pin-preview`

### `imagery-carries-accent-color` · `color.distribution` · 선호 후보

- **분석자 해석**: 지면의 색은 절제하고 작업 이미지에 색과 질감을 맡긴 선택이, 사이트보다 작업물을 먼저 보게 했을 수 있다.
  - 맥락: 작업 간 색온도와 재질 차이가 뚜렷한 이미지 중심 포트폴리오.
  - 디자인 결정: 정보용 바탕과 글자는 대비가 있는 중립색으로 두고, 색은 우선 작업 이미지에서 가져온다.
  - 상충·검수: 작업 이미지나 페이지 상태가 변해도 내비게이션과 설명의 대비를 확인한다.
  - 근거: `pin-preview`

### 근거 목록

- **pin-preview** / image / `https://i.pinimg.com/736x/e5/b1/ee/e5b1ee50861923f50e9a0b98ae0e2b0f.jpg`: 736×1785px 공개 JPEG. 이미지와 흰 면이 반씩 놓인 첫 화면, 은회색 작업 이미지, 서비스 활자 목록, 번호가 큰 작업 과정이 보인다.
- **raster-samples** / image / `https://i.pinimg.com/736x/e5/b1/ee/e5b1ee50861923f50e9a0b98ae0e2b0f.jpg`: 좌상단 원점 기준 (680,250), (383,350), (26,901), (343,157), (30,325), (89,689) 중심 7×7px의 sRGB 채널별 중앙값. 미리보기 좌표의 국소 표본으로, 공식 팔레트나 색 면적 비율이 아니다.
- **demo-fonts** / browser-render / `https://swissbrut.framer.website/`: macOS Chrome, 데스크톱 1440×900. 계산 스타일과 Chrome DevTools의 실제 사용 글꼴을 함께 확인했다. Brut·Design은 Be Vietnam Pro Black 900(291.2px, 자간 -16.016px), Work와 첫 작업 과정 설명은 Be Vietnam Pro SemiBold 600(15px, 자간 -0.48px). 표본은 영문 노드이며 모바일 값이나 전체 사이트 서체를 뜻하지 않는다.
- **template-attribution** / external-reference / `https://onepagelove.com/swissbrut`: Swiss Themes가 제작한 Framer 포트폴리오 템플릿으로 소개하며 공식 데모를 연결한다.
- **font-license** / external-reference / `https://github.com/google/fonts/blob/main/ofl/bevietnampro/OFL.txt`: Be Vietnam Pro 공개 배포본의 SIL Open Font License 1.1 원문.


### 한계·미검증

- 레이아웃과 색감은 정적 Pinterest 미리보기에서 관찰했다. 여러 화면을 이어 붙인 이미지이므로 실제 스크롤 순서·고정 여부·서비스 항목의 호버 또는 활성 전환을 단정하지 않는다.
- 실제 데모는 1440×900 Chrome에서 일부 영문 서체만 검증했다. 모바일 레이아웃, 키보드 조작, 모션은 검증 범위가 아니다.
- 사용자가 전체 디자인을 좋다고 평가했다. 특정 색·크기·웹 기술이 선호의 이유라는 해석은 확인된 피드백이 아니다.
- 공개 글꼴 라이선스는 원본 사진·영상·템플릿의 재배포 권리를 뜻하지 않는다.
