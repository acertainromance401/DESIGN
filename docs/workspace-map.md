# 작업공간 파일 구조·분석 범위

## 분류 원칙

원본 시안은 [designs](../designs/)에, 분석·활용법은 [docs](./)에, MCP가 읽는 검증 가능한 지식 데이터는 [content](../content/)에 둡니다. 코드·도구·테스트를 시각적 종류에 따라 섞어 이동하지 않습니다.

기존 루트와 docs의 HTML 21개는 이전 주소 호환용 이동 페이지입니다. 개인 자산을 포함한 원문은 한 군데에 보존하며 복제·삭제하지 않았습니다. 이전 주소의 query/hash도 새 주소에 전달합니다.

## 전체 영역별 역할

| 파일/폴더 | 분석 결과·관리 방식 |
| --- | --- |
| [designs/editorial](../designs/editorial/) | 작업 노트·검정 포트폴리오·파일 보관함. CSS 편집과 검색/선택/펼침 상태 |
| [designs/references](../designs/references/) | 건축·조명 제품·전시·스포츠 4종. 사진·서체·SVG 재질의 비율 연구와 출처 문서 |
| [designs/posters](../designs/posters/) | 복싱 3종·스포츠 콜라주·러닝. 도형/인물/빛 레이어, 수동 마스크와 노이즈 |
| [designs/palettes](../designs/palettes/) | 배색 8개와 분위기별 18개, 역할 기반 색 토큰과 선택 UI |
| [designs/effects](../designs/effects/) | 32개 수동 실행 효과·광학 유리. CSS/WAAPI와 실제 GPU 굴절을 구분 |
| [designs/spatial](../designs/spatial/) | 서점 SVG 목업·극장 SVG·극장 WebGL. 2D 깊이 표현과 실제 scene graph 구분 |
| [designs/characters](../designs/characters/) | ASCII HTML와 외부 renderer 모듈. SDF 장면 → FBO → glyph atlas 합성 |
| [designs/celebration](../designs/celebration/) | 생일 HTML·6개 앱 모듈·vendor·폰트·모델·이미지·오디오는 로컬 전용. GitHub와 npm에는 분석 가이드만 포함 |
| [designs/shared/assets](../designs/shared/assets/) | 공통 건축/축구 사진·Be Vietnam Pro·OFL·작업 노트 미리보기 PNG. 각 출처/라이선스 유지 |
| `reference/cinema/` | 제공된 극장 참고 이미지. originals/studies로 로컬 보존하고 GitHub·npm에서 제외. 런타임 텍스처 아님 |
| `reference/private/birthday/` | 원본 Blender·사진·바다거북 그림·편지지·음원. 로컬 보존, GitHub·npm 제외 |
| [content/design-cautions.md](../content/design-cautions.md) | 모든 디자인 조회에 선행하는 공통 규칙. 시안 자체보다 우선 |
| [content/design-reuse.json](../content/design-reuse.json) | 21개 시안의 유형·실제 기술 사용 위치·8개 플랫폼·권리/자산·추출 단위의 단일 기술 데이터 |
| [content/technology-options.json](../content/technology-options.json) / [기술 카탈로그](./technology-catalog.md) | 시안 기술 분류와 별도 도입 후보 데이터, 목적별 적용·제약·검수 |
| [content/analyses](../content/analyses/) | 예시별 색감·레이아웃·폰트 관찰·근거·불확실성·재사용 원칙. 기존 시안 연결은 선택적 |
| [content/analysis-template.json](../content/analysis-template.json) / [JSON Schema](../content/analysis.schema.json) | 별도 초안 양식과 자동 생성 검증 스키마 |
| [docs/analyses](./analyses/) / [작성 안내](./recording-analyses.md) | JSON에서 생성하는 누적 분석 보고서와 저장·검색·배포 경계 |
| [content/manifest.json](../content/manifest.json) / [provenance](../content/provenance.json) | 기존 WEASHION 48개 참조와 원문 해시. 이번 폴더 정리로 원본 문서/해시를 변경하지 않음 |
| [content/guides](../content/guides/) | 기존 프로젝트의 지침 스냅샷. 외부 앱이 현재 해당 경로에 존재한다는 뜻이 아님 |
| [content/library](../content/library/) | 범용 22개 카테고리·138개 설계 지침. 플랫폼 이식 데이터와 별개 |
| [content/examples](../content/examples/) | 기존 대표 웹 10개·SwiftUI 10개 실행/교육 예제. 독립 시안 21개와 중복 집계하지 않음 |
| [examples](../examples/) | VS Code/일반 클라이언트 MCP 연결 예. 디자인 시안 폴더와 구분 |
| [src/index.ts](../src/index.ts) | cwd와 무관하게 카탈로그를 로드하는 stdio 실행 진입점 |
| [src/server.ts](../src/server.ts) | 읽기 전용 도구·리소스·프롬프트 등록, 공통 규칙 선행 전달과 도메인 오류 응답 |
| [src/catalog.ts](../src/catalog.ts) | 기존 패턴 검색·상세·적용 계획·provenance 검증 |
| [src/library.ts](../src/library.ts) | 범용 패턴·플랫폼 예제 로더와 검증 |
| [src/visuals.ts](../src/visuals.ts) | 시안 정의·검색·상세·소스 허용 목록·기술/플랫폼/시안 적용 계획 |
| [src/reuse.ts](../src/reuse.ts) | 재사용 데이터의 타입·스키마·중복·참조·경로 검증 |
| [src/technologies.ts](../src/technologies.ts) | 시안의 실제 사용 기록과 도입 후보를 상태별로 분리해 조회·검색 |
| [src/analyses.ts](../src/analyses.ts) | 색감·레이아웃·폰트 분석 스키마·참조 무결성·초안 구분·검색·상세 |
| [scripts/manage-analysis.mjs](../scripts/manage-analysis.mjs) | 분석 초안 생성·외부 JSON 등록·명시적 교체·원자적 파일 저장·검증 |
| [scripts/import-guides.mjs](../scripts/import-guides.mjs) | 기존 프로젝트 지침을 검토한 스냅샷으로 가져오는 도구 |
| [scripts/prepare-birthday-model.mjs](../scripts/prepare-birthday-model.mjs) | Blender를 읽기 전용 원본으로 열어 decimation·텍스처 축소·GLB 내보내기·예산/원본 해시 확인 |
| [scripts/prepare-birthday-vendor.mjs](../scripts/prepare-birthday-vendor.mjs) | 설치된 Three.js r180에서 로컬 엔진·loader·MIT 고지를 복사 |
| [scripts/build-design-docs.mjs](../scripts/build-design-docs.mjs) | 메타데이터에서 시안 분석·플랫폼 문서·유형별 README·검색 HTML 생성, --check로 최신성 검증 |
| [scripts/verify-package.mjs](../scripts/verify-package.mjs) | 배포 파일·권리 경계·독립 설치·실제 MCP 요청 검증 |
| [scripts/verify-swift.mjs](../scripts/verify-swift.mjs) | 기존 SwiftUI 대표 예제의 SDK 검증 도구. 새 시안 네이티브 포팅을 검증하는 것은 아님 |
| [test](../test/) | 기존 패턴·문서 무결성·MCP 프로토콜·효과·모션·ASCII 예산·생일 오디오/호흡/GLB 검증 + 재사용/경로/패키징 회귀 테스트 |
| [package.json](../package.json) / [package-lock.json](../package-lock.json) | npm 실행·배포 허용 목록과 재현 가능한 의존성. Three.js devDependency는 생일 r180 준비용, 극장 r187은 HTML 내장 |
| [tsconfig.json](../tsconfig.json) | strict TypeScript·NodeNext·선언 파일 출력 |
| [README](../README.md) / [LICENSE](../LICENSE) / [.gitignore](../.gitignore) | 사용 진입점·코드 라이선스·생성물/대형 원본 제외 규칙 |
| `DESIGN.code-workspace` | 로컬 에디터 작업공간 설정. GitHub·배포 런타임에서 제외 |

`node_modules/`는 설치된 의존성, `dist/`는 TypeScript 빌드 출력, `*.tgz`는 버전별 패키지 결과물, `.git/`는 버전 관리 데이터입니다. 내용 전체를 새로운 시안으로 분석하거나 재배포하지 않습니다. 과거 패키지는 이번 정리에서 삭제하지 않았습니다.

## 깊이 읽을 순서

1. [기술·시안별 상세 분석](./design-inventory.md): 시안마다 사용 위치, 역할, 추출 요소, 플랫폼 대응, 자산/한계.
2. [유형별 HTML 탐색](../designs/index.html): 목적·유형·기술로 필터.
3. [플랫폼별 이식](./platform-adoption.md): SwiftUI/Metal/RealityKit/SpriteKit/Unity/Godot/Unreal API와 검수.
4. [외부 MCP 활용](./mcp-workflows.md): 연결·선택적 소스 조회·계획·대상 프로젝트 적용.
5. [누적 분석](./analyses/README.md): 색감·레이아웃·폰트별 관찰과 근거. [새 분석 등록](./recording-analyses.md).

실제 렌더링 검증 범위와 네이티브 빌드 검증 여부는 작업 결과 보고를 기준으로 확인합니다. 문서에 기술 이름이 있다는 이유로 그 플랫폼의 구현이 완료됐다고 보지 않습니다.
