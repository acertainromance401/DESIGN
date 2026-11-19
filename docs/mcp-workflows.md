# 외부 프로젝트에서 디자인 MCP 활용하기

처음이라면 [요청부터 조회·적용까지 흐름도](./cross-project-design-flow.md)에서 MCP와 저장소의 역할을 먼저 확인하세요.

## 1. 연결과 업데이트

이 업데이트는 로컬 소스·빌드·패키지에 적용됩니다. npm 공개 배포나 이미 실행 중인 MCP 프로세스 교체를 자동 수행하지 않습니다.

저장소에서 `npm run build` 후, MCP 설정에 이 저장소의 **절대 경로**를 사용합니다. 작업 디렉터리가 달라도 콘텐츠는 서버 모듈 위치를 기준으로 읽습니다.

**VS Code의 Copilot 세션에서 여러 작업공간에 공유**하려면 **Chat: Open Customizations → MCP Servers**에서 **Global → Copilot Global** 범위로 등록합니다. 직접 편집할 때는 `~/.copilot/mcp-config.json`(`COPILOT_HOME`을 설정했다면 해당 디렉터리)의 `mcpServers`에 추가합니다. 서버가 이미 등록되어 있으면 중복 등록하지 않습니다.

새 세션에서 도구명을 말하지 않아도 디자인 결정 전에 참고하도록 하려면 [Copilot 사용자 지침](https://code.visualstudio.com/docs/agents/reference/custom-instructions-reference#_user-instructions)에 다음처럼 적습니다. MCP 등록은 조회를 가능하게 하고, 지침은 디자인 요청에서 먼저 조회하도록 안내합니다. 자동 호출을 강제하지는 않습니다.

> UI나 디자인 방향을 요청받으면 분위기만 설명한 경우에도 디자인 주의사항과 관련 선호 분석을 먼저 확인한다. 구현 참고가 필요할 때만 관련 HTML을 조회하고, 어떤 참고자료에서 어떤 원칙을 가져왔는지 설명한다.

**VS Code의 편집기 관리형 MCP 설정**을 사용하는 경우에는 아래의 `servers` 형식을 씁니다.

```json
{
  "servers": {
    "design": {
      "type": "stdio",
      "command": "node",
      "args": ["/absolute/path/to/DESIGN/dist/index.js"]
    }
  }
}
```

Copilot Global은 위 구성이 아닌 [범용 설정 예](../examples/generic-mcp.json)의 `mcpServers` 형식을 사용합니다. 경로를 실제 설치 위치로 바꾸고 새 Copilot 세션을 시작하거나 서버를 재시작해 도구 목록과 최신 기록을 읽습니다. Node.js 22 이상이 필요합니다.

이식 가능한 패키지가 필요하면 `npm run verify:package`를 실행합니다. 생성된 버전별 tgz를 다른 위치에 `npm install /absolute/path/to/package.tgz`로 설치하고 설치본의 실행 파일을 연결할 수 있습니다. 이 검증은 임시 설치본을 만들고 실제 stdio MCP 요청을 실행하며 임시 디렉터리를 정리합니다. 생일 개인 원본과 자산은 패키지에 들어가지 않습니다.

**공개 npm에 같은 버전이 있다고 가정해 `npx ...@latest`로 연결하면 이 로컬 업데이트가 반영되지 않을 수 있습니다.**

## 2. 탐색 순서

1. `design://design-cautions`를 먼저 읽습니다. 모든 새 도구·리소스에도 같은 필수 규칙이 선행합니다.
2. `list_design_categories`의 `visualExamples`에서 8개 유형, 시안에 등록된 14개 기술, 대상 플랫폼과 시안 목록을 봅니다. 별도 `technologyLibrary`에서 시안 근거와 도입 후보를 찾을 수 있습니다. 기존 186개 패턴의 수는 바뀌지 않습니다.
3. `search_design_visuals`에 짧은 목적·기술 검색어를 넣습니다. `family`, `technology`, `platform`을 함께 지정할 수 있습니다.
4. `get_design_visual`에서 **기술의 실제 사용 위치·추출 부분·실행 요구사항·자산 권리·sourceFiles**를 확인합니다.
5. `get_design_technology`로 기술의 웹/Apple/게임별 적용 방법과 사용 시안을, `get_design_platform`으로 대상 API·도구·검수를 조회합니다.
6. 명시적 `visualIds`로 `create_visual_adoption_plan`을 호출합니다. 새 프로젝트/기존 프로젝트와 대상 플랫폼을 구분합니다.
7. 연결된 AI가 대상 프로젝트의 기존 코드·사용자 수정·렌더러·의존성·테스트를 조사한 뒤 실제로 편집하고 빌드·실행·화면 검수를 수행합니다. MCP 서버 자체는 외부 프로젝트를 읽거나 수정하지 않습니다.

### 적용 기술을 먼저 비교하려는 경우

[기술 카탈로그](./technology-catalog.md)나 `design://technologies`에서 분류를 보고 `search_design_technologies`에서 이름·효과·환경으로 후보를 좁힙니다. `status`는 `source-backed`(등록된 시안의 사용 근거)와 `candidate`(추가 검토용)입니다. `query`를 생략하면 범주·플랫폼·종류만으로도 둘러볼 수 있습니다.

```json
{ "tool": "search_design_technologies", "arguments": {
  "query": "도트 하프톤", "platform": "web", "limit": 5
} }
```

`get_design_technology` 또는 `design://technologies/{id}`에서 적합한 상황·필요 조건·제약·검수 기준을 확인합니다. 예를 들어 고정 도트 모션이면 영상이나 Canvas 2D를 먼저 비교하고, 사용자 조작과 실시간 GPU 처리가 필수일 때만 WebGL/WebGPU를 검토합니다. 조회는 로컬 설치나 도구 권한을 감지하지 않으며 Figma·Blender·게임 엔진 등 외부 앱을 연결하거나 실행하지 않습니다.

### 참고 예시 분석을 축적하고 다시 찾기

`list_design_categories.visualExamples.analysisLibrary` 또는 `design://analyses`에서 기록 수와 분석 목록, 요소별 `logs`를 확인합니다. `search_design_analyses`와 `get_design_analysis`에 `axis`를 주면 상위 항목을, `focus: "lighting.shadows"`처럼 `focus`를 주면 태그된 관찰만 조회합니다. 세부 범위는 `design://analysis-scope`에서 확인합니다. 초안은 기본 검색에서 제외되며, 기존 시안 상세의 `referenceAnalyses`와도 연결됩니다.

전체 분석에서는 `analyze_design_character`로 분위기·스타일·느낌·인상과 활용 방안을 기존 관찰에 연결합니다. 기준과 근거 연결은 MCP가 검증하고, 자료 열람·해석과 저장은 연결된 AI가 담당합니다. 저장된 결과는 `search_design_analyses`의 `character`와 `useCase`로 함께 찾을 수 있습니다. [기록 예시와 사용법](./recording-analyses.md#분위기스타일느낌인상과-활용).

새 예시를 받으면 `design://analysis-template`, `design://analysis-schema`, `design://analysis-workflow`를 참고해 분석하고 기본으로 등록합니다. 범위 지정이 없으면 색감·레이아웃·폰트를 나누고, “색감만”처럼 지정하면 그 항목만 분석·저장합니다. 연결된 AI가 JSON을 작성하고 DESIGN 소스 저장소에서 등록 명령을 실행해야 보존됩니다. MCP가 대화·이미지를 자동 저장하거나 원격 저장소에 쓰지는 않습니다. [작성·등록·MCP 재시작 안내](./recording-analyses.md)를 따릅니다. npm 설치본은 기록을 포함한 배포 시점의 스냅샷입니다.

사용자가 제공한 선호 예시를 한 번 등록하면, 개별 보고서와 함께 기록된 [요소별 로그](./analyses/README.md#사용자-제공-레퍼런스-요소별-로그)가 갱신됩니다. 별도 문서에 중복 작성하지 않습니다. MCP에서 모아 보려면 `design://analysis-logs/lighting`처럼 해당 항목의 Markdown 리소스를 읽습니다.

## 3. 바로 실행할 도구 요청 예

### ASCII 캐릭터를 Swift 앱의 Metal 화면에 적용

```json
{ "tool": "search_design_visuals", "arguments": {
  "query": "ASCII 문자", "family": "characters",
  "technology": "ascii-postprocess", "platform": "metal"
} }
```

```json
{ "tool": "get_design_visual", "arguments": {
  "id": "ascii-character", "includeSource": true
} }
```

```json
{ "tool": "get_design_technology", "arguments": { "id": "ascii-postprocess" } }
```

```json
{ "tool": "get_design_platform", "arguments": { "id": "metal" } }
```

```json
{ "tool": "create_visual_adoption_plan", "arguments": {
  "visualIds": ["ascii-character"],
  "platform": "metal", "projectType": "existing"
} }
```

반환된 HTML만 복사하면 완성되지 않습니다. `sourceFiles`에 있는 아래 리소스를 별도로 읽고 선언된 경로로 저장합니다.

- `design://source-files/designs/characters/ascii-character.html`
- `design://source-files/designs/characters/assets/ascii/renderer.js`

Metal에서는 GLSL을 그대로 빌드하지 않습니다. 저해상도 장면 텍스처·문자 아틀라스·합성 패스·SwiftUI 입력을 새로 구현하고 실제 기기에서 측정합니다.

### 개인 홈페이지

```json
{ "tool": "search_design_visuals", "arguments": {
  "query": "포트폴리오", "family": "editorial", "platform": "web"
} }
```

```json
{ "tool": "create_visual_adoption_plan", "arguments": {
  "visualIds": ["black-editorial", "reference-house"],
  "platform": "web", "projectType": "existing"
} }
```

기존 라우터·컴포넌트·색상 토큰을 유지하고 구도·검색·모션 중 필요한 부분만 옮깁니다. 가상의 작업 실적·행사·상점·상품을 실제 사실로 사용하지 않습니다. 사진은 MCP가 바이너리로 전달하지 않으므로 패키지의 공유 자산과 고지를 복사하거나 권리 확인 사진으로 교체합니다.

### Unity·Godot·Unreal·SpriteKit 게임

```json
{ "tool": "get_design_platform", "arguments": { "id": "godot" } }
```

```json
{ "tool": "create_visual_adoption_plan", "arguments": {
  "visualIds": ["ascii-character", "boxing-overhead"],
  "platform": "godot", "projectType": "new"
} }
```

셰이더·배경 레이어·스프라이트로 가져올 부분을 나눕니다. SDF는 메시/본/충돌체가 아니고 SVG 링은 플레이 가능한 경기장 데이터가 아닙니다. `platform`은 `web`, `swiftui`, `metal`, `realitykit`, `spritekit`, `unity`, `godot`, `unreal` 중 하나입니다.

## 4. 리소스 구조와 응답 해석

| URI | 내용 |
| --- | --- |
| `design://visual-examples` | 시안·유형·기술·플랫폼의 짧은 인덱스 |
| `design://reuse-catalog` | 검증된 재사용 메타데이터 전체 |
| `design://families/{id}` | 유형별 시안 |
| `design://technologies/{id}` | 기술 원리·실제 적용 위치·이식 경로 |
| `design://platforms/{id}` | 플랫폼 요구사항·작업 흐름·검수 |
| `design://visual-files/{basename}` | 기존 URI와 호환되는 HTML/동반 문서 |
| `design://source-files/{repository-relative-path}` | 허용 목록에 포함된 HTML·JS·동반 문서의 실제 텍스트 |

- 리소스 응답의 `contents[0]`는 필수 주의 문서입니다. 요청한 파일을 저장할 때는 **요청한 URI와 일치하는 항목**을 선택합니다.
- `includeSource=false`가 기본입니다. 선택한 시안만 `includeSource=true`로 가져와 토큰 사용을 제한합니다.
- `sourceAvailable`은 현재 설치 환경에 실제 원문이 있는지 나타냅니다. `platform` 검색값과 `adoptionPlatforms`는 **이식 안내의 존재**이지 네이티브 구현 여부가 아닙니다.
- 로컬 전용 생일 원문이 빠진 설치본은 `source=null`, `sourceAvailable=false`, `LOCAL_ONLY_SOURCE_UNAVAILABLE` 안내를 반환합니다. 존재하지 않는 원문 리소스를 성공처럼 반환하지 않습니다.
- Blender 최적화·vendor 준비 스크립트는 개인 입력을 포함하지 않는 공개 보조 코드입니다. 별도로 패키지에 포함해 `sourceFiles`와 기술 사용 위치의 `sourceUri`로 조회합니다. 원본 모델·음원·사진이나 개인 앱 모듈이 포함되는 것은 아닙니다.
- 바이너리·임의 경로·외부 URL·대상 프로젝트 파일은 반환하지 않습니다. `source-files`는 메타데이터로 선언한 텍스트 파일만 읽습니다.
- 알려지지 않은 시안/유형/기술/플랫폼은 명시적 오류이며 무관한 시안으로 대체하지 않습니다.
- `start_design_project`, `update_project_design`과 기존 `create_design_adoption_plan`은 종전 패턴 중심 API입니다. 이 API의 `platform`은 계속 `swiftui|web|agnostic`입니다. 8개 플랫폼의 **시안 이식**은 `adopt_visual_design` 프롬프트와 `create_visual_adoption_plan`을 사용합니다.

## 5. 유지보수

- 시안 추가/변경: [시안 정의](../src/visuals.ts)와 [재사용 메타데이터](../content/design-reuse.json)를 함께 갱신합니다.
- 원본은 [유형별 폴더](../designs/)에 저장하고 상대 모듈·자산 경로를 유지합니다. 예전 주소는 이동 안내로 남깁니다.
- `npm run docs:designs`로 인벤토리·유형별 README·HTML 탐색·플랫폼 문서를 재생성합니다.
- `npm test`로 경로·프로토콜·예산·기존 동작을 검사하고 `npm run verify:package`로 개인 자산 제외와 외부 cwd 사용을 확인합니다.
- 웹 화면 검수와 네이티브 기기 검수는 별개입니다. 실행하지 않은 플랫폼의 완료/성능/접근성 인증을 주장하지 않습니다.
