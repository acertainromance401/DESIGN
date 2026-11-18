# 종류별 시안 탐색

> 이 문서는 content/design-reuse.json·content/analyses와 시안 정의에서 생성합니다. 수정 후 npm run docs:designs를 실행하세요.


저장소 루트에서 정적 HTTP 서버를 실행하고 [탐색 화면](./index.html)을 엽니다. 예: `python3 -m http.server 4173 --bind 127.0.0.1` → `http://127.0.0.1:4173/designs/`.

이전 루트/docs HTML은 이동 안내이며 원본은 아래 폴더에 한 번만 보관합니다. 원본 주소의 query/hash도 유지합니다.

- [편집·포트폴리오·작업 도구](./editorial/README.md) — 활자 위계, 열린 지면, 검색과 목록·상세 상태를 분리해 활용한다.

- [레퍼런스 구성 연구](./references/README.md) — 건축·제품·전시·스포츠의 구도와 재질을 연구한 최소 완성도 비교 시안.

- [포스터·스포츠 그래픽](./posters/README.md) — SVG 일러스트, 사진 컷아웃, 종이 질감, 강한 활자와 조명을 조합한다.

- [팔레트·분위기 비교](./palettes/README.md) — 8개 고정 배색과 6개 화면의 18개 전환 배색. 총 26개 조합.

- [화면 효과·광학 재질](./effects/README.md) — 32개 수동 실행 효과와 WebGL 광학 유리 컨트롤을 구분한다.

- [공간·서점·극장](./spatial/README.md) — 2D SVG 깊이 표현과 실제 WebGL 3D 장면의 차이를 비교한다.

- [절차적 캐릭터·ASCII](./characters/README.md) — SDF 입체 생성과 문자 아틀라스 후처리의 두 패스 렌더링.

- [이벤트·오디오·상태 흐름](./celebration/README.md) — 3D 케이크, 호흡 입력, 효과음과 편지·엔딩 전환. 개인 자산은 로컬 전용.

- shared/assets: 시안이 공통 사용하는 사진·서체·고지. 출처와 각 라이선스를 유지합니다.

분석: [design-inventory.md](<../docs/design-inventory.md>) · [technology-catalog.md](<../docs/technology-catalog.md>) · [platform-adoption.md](<../docs/platform-adoption.md>) · [mcp-workflows.md](<../docs/mcp-workflows.md>)

색감·레이아웃·폰트: [누적 분석 목록](<../docs/analyses/README.md>) · [분석 추가](<../docs/recording-analyses.md>)

생일 원문·모듈·개인 자산은 로컬 전용입니다. npm 설치본에서는 분석만 보며 원본 경로를 사용할 수 없습니다.
