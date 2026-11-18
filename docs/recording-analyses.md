# 디자인 레퍼런스를 취향 판단에 쓰는 방법

목표는 예시를 많이 모으는 것이 아니라 **“차분하지만 밋밋하지 않게” 같은 요청을 구체적인 디자인 결정으로 바꾸는 것**입니다. 무엇이 보였는지, 사용자가 무엇을 좋거나 싫다고 했는지, 분석자가 어떤 이유를 추론했는지를 분리합니다.

## 저장 구조

- **원본 데이터**: [content/analyses/](../content/analyses/)의 `고유-id.json`. 하나의 예시마다 하나의 파일로 추가합니다.
- **사람이 읽는 문서**: [분석 목록](./analyses/README.md)과 예시별 Markdown 보고서를 같은 데이터에서 자동 생성합니다.
- **요소별 로그**: [`분석 목록`의 요소별 로그](./analyses/README.md#사용자-제공-레퍼런스-요소별-로그)에 색감·레이아웃·폰트·글자 배치·인물/피사체 구도·조명·모션·질감·상호작용 문서와 MCP 리소스를 모았습니다. `analyzed` 상태이고 `사용자 선호 레퍼런스`로 표시된 예시가 해당 요소를 기록했을 때만 자동으로 반영됩니다. 색감은 [색 조합 비교](../designs/palettes/color-combinations.md#사용자-제공-레퍼런스-색감-분석)의 기존 8가지 시안 아래에 붙습니다. 로그에 직접 쓰지 않고 원본 JSON을 수정합니다. 내부 연구는 상세 분석과 MCP 검색에는 남지만 선호 로그와 섞지 않습니다.
- **취향 프로필**: 같은 JSON의 `preferenceSignals`에서 [디자인 취향 프로필](./analyses/elements/design-preferences.md)을 생성합니다. 요소별 로그는 관찰을, 프로필은 그 관찰을 적용할 조건과 디자인 결정의 후보를 보여줍니다.
- **작성 양식**: [analysis-template.json](../content/analysis-template.json). 실제 기록과 섞이지 않는 별도 초안입니다.
- **기계 검증**: [analysis.schema.json](../content/analysis.schema.json)과 [서버 스키마](../src/analyses.ts). 필드 간 근거·폰트 확인 수준·날짜 검증은 등록 명령에서도 수행합니다.

기존 [design-reuse.json](../content/design-reuse.json)은 구현 기술·이식 지침을, 분석 JSON은 **디자인 요소별 관찰 결과**를 맡습니다. 기존 HTML 시안은 선택적 `visualId`로 연결합니다. URL·이미지 참고자료는 HTML을 억지로 만들지 않고 별도 기록으로 저장합니다. 첨부를 읽고 관찰을 작성하는 것은 AI의 역할이며, 등록·검증과 Markdown 로그 분배는 작업 도구가 수행합니다. MCP 서버는 URL이나 이미지를 직접 다운로드하거나 분석하지 않습니다.

## 새 예시를 받았을 때

**2026-11-18부터 사용자가 직접 제공하는 예시는 마음에 드는 디자인으로 받아들입니다.** 비선호·비교용 등 다른 목적을 명시한 경우를 제외하고, 선호 여부를 다시 묻지 않습니다. AI가 임의로 선택한 예시나 만든 재현 시안은 별도로 구분합니다.

분석 후 등록은 별도 저장 요청 없이 진행합니다. “색감만”처럼 범위를 지정해도 분석한 항목은 해당 로그에 누적합니다. 사용자가 저장하지 말라고 명시한 경우는 제외합니다.

1. 예시를 확인하고 **색감 분석 → 레이아웃 분석 → 폰트 분석**을 각각 작성합니다. 이어 `elements`에 관련된 글자 배치, 피사체 구도, 조명, 모션, 질감, 상호작용을 기록합니다. 조작 피드백·실패와 복구·접근성은 실제로 확인한 상태만 기록합니다. 관련 없는 초안 슬롯은 제거하고, 중요하지만 확인할 수 없는 사항은 `unknown`으로 기록합니다. 기존 세 축만 있던 기록도 유효합니다.
2. 확인한 근거를 `evidence`에 등록합니다. 소스 위치, 선택자·줄, 이미지 파일명, 관찰 환경·화면 크기 등을 적습니다. 원본과 재현 시안을 구분합니다.
3. 분석 문장은 `confirmed` / `estimated` / `unknown`으로 구분하고 근거 ID를 연결합니다. 확인·추정에는 근거가 필수입니다. 모르는 색은 `null`을 사용합니다.
4. 폰트의 CSS 선언 `declaredFamilies`와 실제 사용 서체 `renderedFamily`를 구분합니다. 실제 서체는 브라우저 관찰 근거가 있는 `rendered-confirmed`일 때만 기록합니다. CSS만 있으면 `declared-only`, 이미지 유추는 `estimated`로 두고 실제 서체는 `null`로 둡니다. 추정 후보·유사 대안은 `notes`에 명시합니다. 한글/영문 fallback, 웨이트·역할·출처·라이선스와 미확인 사항도 기록합니다.
5. 각 축의 `reuse`에 독립적으로 가져갈 원칙을 적습니다. **실제로 선택을 바꾸는 관찰**만 `preferenceSignals`로 연결합니다. `limitations`에는 미검증 항목을 남깁니다.
6. 작업 중에는 `draft`, 요청 범위의 관찰을 검토한 뒤에는 `analyzed`로 저장합니다. `analyzed`라도 개별 항목은 미확인일 수 있으며, 상태가 실제 렌더링 검증 완료를 뜻하지 않습니다. 초안 여부·폰트 미확인과 사용자의 전체 디자인 선호는 별개입니다.

범위를 지정하지 않으면 기본 세 축을 작성합니다. 일부 항목만 분석할 때는 `analysisScope`에 분석한 상위 `axis`만 적습니다. 예를 들어 색감만 검토했으면 `"analysisScope": ["color"]`와 `color`를 남기고 `layout`, `typography`, `elements`는 제외합니다. 완료한 색감 기록은 그대로 `analyzed`로 저장할 수 있고, 색감 로그에만 들어갑니다. `analysisScope`는 분석 범위이고, `preferenceFocuses`는 사용자가 좋다고 지정한 세부 선호 범위입니다.

### 관찰을 세부 항목으로 나누기

[세부 분석 기준표](./analyses/elements/analysis-scope.md)에서 각 관찰에 해당하는 `focus`를 선택합니다. 예를 들어 글자의 **줄바꿈**(`text-placement.line-breaks`)과 **자간·행간**(`text-placement.spacing`), 조명의 **방향**(`lighting.source-direction`)과 **그림자·국소 명암**(`lighting.shadows`)은 서로 다른 관찰입니다. 섞여 있으면 분리하고 각각의 근거를 연결합니다. `focus`는 자기 상위 항목 안에서만 사용할 수 있습니다.

세부 항목은 체크리스트이지 필수 데이터가 아닙니다. 해당하지 않는 항목은 넣지 않고, 자료에 중요하지만 확인할 수 없는 특성만 `unknown`으로 기록합니다. 세부 분류가 없는 기존 관찰은 그대로 유효하며 상위 `axis`에서 조회합니다. 색상값과 서체 식별 정보는 각각 기존 `palette`, `fonts`에 따로 보존합니다.

사용자가 제공한 선호 예시에는 `keywords`에 `사용자 선호 레퍼런스`를 넣고, `source.description`에 사용자 제공일·선호 범위를 기록합니다. 특정 요소만 좋다고 했으면 `preferenceFocuses`에 해당 `focus`만 넣습니다. 그 밖의 요소는 사실로 관찰할 수 있으나 긍정 선호 근거로 삼지 않습니다. AI의 내부 연구에는 이 키워드를 붙이지 않습니다. 사용자가 분석 제외를 요청한 시안은 분석 원본·보고서·색인에서 빼고 [재등록 제외 목록](../content/analysis-exclusions.json)에만 식별자를 남깁니다. 작품 하나의 거절을 소재·색·기법 전체에 대한 비선호로 해석하지 않습니다.

### 관찰을 디자인 결정으로 바꾸기

- **효과와 요소 간 관계:** “여백이 넓다”에서 끝내지 말고 무엇이 더 잘 읽히는지, 반대로 글과 이미지 또는 제목과 모션이 충돌하는지 설명합니다. 사진·영상·편집 화면에 보이는 표현과 실제 제품의 조작을 구분합니다.
- **남길 것과 바꿔도 되는 것:** `application`에 가져갈 관계와 바꿔도 되는 구현을 적습니다. 예를 들어 배경과 포인트의 면적 관계는 남기고, 정확한 HEX·이미지·서체는 맥락에 맞게 바꿉니다. `context`에는 효과가 성립하는 조건과 적용하지 않을 상황, `tradeoff`에는 희생하는 것과 검수 방법을 적습니다.
- **근거와 피드백:** 같은 `focus`의 확인·추정 관찰에 연결된 `evidenceIds`를 사용합니다. “예시 전체가 좋다”만으로는 요소별 `basis`를 `explicit`로 할 수 없습니다. 요소를 직접 지정한 피드백이 있을 때만 `explicit`와 `userNote`를 쓰고, 의도를 추론한 건 `inferred`로 구분합니다. `avoid`는 사용자가 명시한 특성과 범위만 기록하며 비교용·비선호 예시에 `사용자 선호 레퍼런스`를 붙일 필요는 없습니다.
- **반복 판단:** 의미가 같은 특성·맥락에만 같은 `key`·`contextKey`를 재사용합니다. 두 개 이상의 독립 출처가 같은 `focus`·`key`·`contextKey`·`direction`을 뒷받침할 때 `recurring`으로 표시됩니다. 동일 자료의 다른 프레임은 한 출처입니다. 크롭·재게시처럼 같은 디자인에 서로 다른 경로가 있으면 모든 관련 기록에 같은 `source.referenceGroup`을 넣습니다. 비슷해 보여도 맥락이 다르거나 피드백이 충돌하면 별도로 남깁니다.

새 디자인 요청에서는 **현재 요청·프로젝트 기능·접근성 → 관련 명시 피드백 → 반복 관찰 → 단일 예시 가설** 순서로 판단합니다. 예를 들어 “따뜻하지만 장식적이지 않게”라면 하프톤 예시의 밝고 따뜻한 바탕과 좁은 저채도 포인트만 시도할 수 있습니다. 도트나 얼굴까지 가져올 이유는 없고, 본문과 버튼의 대비는 별도로 검수합니다. 첫 근거가 약하면 되돌리기 쉬운 선택으로 시작하고, 결과 또는 후속 피드백으로 기준을 보완합니다. 이는 학습 모델이 아니라 근거가 쌓일 때 우선순위를 다시 계산하는 규칙입니다.

날짜는 `YYYY-MM-DD`입니다. `createdAt`은 처음 작성일, `updatedAt`은 실제 수정일입니다. `id`는 영문 소문자로 시작하며 영문 소문자·숫자·하이픈만 사용합니다.

## 작성·등록 명령 — DESIGN 소스 저장소에서

새 초안을 영구 파일로 만듭니다. 기존 ID는 덮어쓰지 않습니다.

```sh
npm run analysis:new -- my-reference
```

생성된 `content/analyses/my-reference.json`을 분석 내용으로 편집하고, 보고서·탐색 링크를 갱신합니다.

```sh
npm run docs:designs
npm run analysis:check
```

외부에서 작성한 JSON을 등록할 수도 있습니다. 입력 파일은 삭제하지 않습니다.

```sh
npm run analysis:save -- /absolute/path/to/new-reference.json
```

기존 ID를 의도적으로 수정할 때만 아래 옵션을 사용합니다. 생성일은 유지하고 수정일을 갱신합니다. 교체 전 이전 기록을 남기려면 Git 등에 먼저 보존합니다. 별도 버전 이력을 자동 생성하지는 않습니다.

```sh
npm run analysis:save -- /absolute/path/to/revised-reference.json --replace
```

등록 명령은 스키마·근거 ID·연결 시안·기존 ID를 확인한 후 임시 파일을 거쳐 저장하고 문서 생성을 실행합니다. 잘못된 입력이나 중복 ID는 오류와 종료 코드로 알립니다. 저장 후 문서 생성만 실패했다면 오류를 수정하고 `npm run docs:designs`를 다시 실행합니다. 직접 편집한 파일도 `analysis:check`로 전체 데이터와 문서 최신성을 검사합니다.

## MCP에서 조회

- `get_design_preferences` 또는 `design://design-preferences`: 취향 프로필. 도구는 `focus` 또는 `contextKey`로 좁힐 수 있습니다. 프로필은 선택의 근거를 제공하며 현재 요청에 맞는지는 연결된 AI가 판단합니다.
- `search_design_analyses`: 저장된 예시 검색. 디자인 취향을 찾을 때는 `scope: "preferred"`를 사용합니다. `axis`(요소별 로그의 상위 항목), `focus`(태그가 붙은 관찰의 제목·내용), `status`(`analyzed | draft | all`), `visualId`, `limit`(최대 10), `offset`으로 범위를 좁힙니다.
- `get_design_analysis`: `id`만 주면 전체 분석, `axis`는 해당 상위 항목, `focus`는 태그가 붙은 관찰과 그 근거만 반환합니다. 관찰이 없는 경우 `ANALYSIS_AXIS_NOT_RECORDED` 또는 `ANALYSIS_FOCUS_NOT_RECORDED`로 알려줍니다. `focus`만으로 상위 항목을 알 수 있으므로 `axis`를 생략할 수 있습니다.
- `design://analyses`: 저장 기록 목록과 초안/분석 수, 요소별 `logs` 목록.
- `design://analysis-scope`: 세부 기준 ID와 관찰 기준 목록.
- `design://analysis-logs/{axis}`: 해당 요소의 사용자 선호 Markdown 로그. 예: `design://analysis-logs/lighting`. 색감 리소스는 8가지 비교표가 아닌, 그 아래의 누적 구역을 반환합니다.
- `design://analyses/{id}`: 개별 분석 JSON.
- `design://analysis-template`, `design://analysis-schema`, `design://analysis-workflow`: 작성 양식·스키마·이 안내.
- `get_design_visual`의 `referenceAnalyses`: 기존 시안에 연결된 분석 링크. 시안 검색에도 **분석 상태의** 요소별 관찰이 반영됩니다.

```json
{ "tool": "search_design_analyses", "arguments": {
  "query": "오프화이트 로즈", "axis": "color", "scope": "preferred", "limit": 5
} }
```

```json
{ "tool": "get_design_analysis", "arguments": { "id": "halftone-talking-heads-study", "focus": "lighting.shadows" } }
```

초안은 기본 검색에서 제외됩니다. 찾아보려면 `status: "draft"` 또는 `"all"`을 명시합니다. 검색은 키워드 기반이며 이미지 유사도·자동 색상 추출·벡터 검색이 아닙니다.

**MCP는 읽기 전용입니다.** 연결된 AI가 분석 결과를 작성하고 파일/터미널 도구로 위 명령을 실행해야 영구 저장됩니다. 대화에만 적은 내용이 자동 저장되지는 않습니다. 소스 저장소에 접근할 수 없는 외부 환경에서는 JSON을 내보낸 뒤 DESIGN 저장소에서 등록합니다.

시작 시 데이터를 메모리로 읽으므로 추가·수정 뒤 **MCP 프로세스를 재시작**해야 조회에 반영됩니다. npm 설치본은 배포 시점의 스냅샷입니다. 새 기록을 옮기려면 새 tarball을 만들고 재설치해야 하며 공개 npm에 자동 반영되지 않습니다.

## 배포·개인정보

**content/analyses의 JSON과 생성 보고서는 npm 패키지에 포함됩니다.** 비공개 표시만 붙인다고 제외되지 않습니다. 개인 사진·편지·음원·폰트 파일·인증 URL·비밀키·기밀 원문을 복사해 넣지 않습니다. URL에 민감한 토큰이 있으면 안전한 참고 식별자로 대체하고 `type: "other"`로 설명합니다. 비공개 분석은 이 배포 대상 폴더 밖에서 관리합니다.

저장하는 것은 재사용을 위한 자체 관찰·근거 위치·권리 메모와 사용자가 제공한 선호 레퍼런스입니다. 사용자의 명시적 기준에 따라 앞으로 제공하는 예시는 좋아하는 디자인으로 기록합니다. 다만 전체 디자인 선호와 AI가 추론한 요소별 선호 이유·공통 경향은 구분합니다. 외부 원본이나 서체 파일을 재배포할 권리를 자동으로 얻는 것은 아닙니다.
