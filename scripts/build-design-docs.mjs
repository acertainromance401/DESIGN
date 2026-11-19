import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { loadVisualCatalog } from "../dist/visuals.js";
import { z } from "zod";
import { analysisAxes, analysisLogInfo, analysisSchema, elementAxes, getAnalysisSection } from "../dist/analyses.js";
import { renderAnalysisLog, renderFindingGroups } from "../dist/analysis-logs.js";
import { analysisFocuses, analysisScopeDocument, analysisScopeUri } from "../dist/analysis-focuses.js";
import { characterDimensions, characterRubric, characterUri } from "../dist/analysis-character.js";
import { preferenceDocument, preferenceUri } from "../dist/analysis-preferences.js";
import { technologyDocument, technologyIndexUri } from "../dist/technologies.js";

const root = new URL("../", import.meta.url);
const catalog = await loadVisualCatalog(root);
const { reuse, entries } = catalog;
const check = process.argv.includes("--check");
const link = (from, target, label = path.posix.basename(target)) =>
  `[${label}](<${path.posix.relative(path.posix.dirname(from), target)}>)`;
const bullets = values => values.map(value => `- ${value}`).join("\n");
const heading = (title, values) => `### ${title}\n\n${bullets(values)}\n`;
const html = value => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const banner = "> 이 문서는 content/design-reuse.json·content/analyses와 시안 정의에서 생성합니다. 수정 후 npm run docs:designs를 실행하세요.\n";
const outputs = new Map();

function designSection(entry, document) {
  const details = catalog.get({ id: entry.id });
  return [
    `<a id="${entry.id}"></a>\n## ${entry.title} \`${entry.id}\``,
    entry.summary,
    entry.distribution === "local-only"
      ? `**로컬 전용**: \`${entry.path}\`. 개인 원문·모듈·자산은 GitHub와 npm에서 제외합니다. 공개 저장소와 설치본에는 이 분석만 제공합니다.`
      : `원본: ${link(document, entry.path)} · 이전 주소: \`${entry.legacyPath}\` (이동 안내)`,
    entry.guide ? `동반 문서: ${link(document, reuse.guidePaths[entry.guide])}` : "",
    details.referenceAnalyses.length
      ? heading("색감·레이아웃·폰트 누적 분석", details.referenceAnalyses.map(item =>
        `${link(document, item.document, item.title)} — ${item.status}, ${item.updatedAt}`))
      : `별도 색감·레이아웃·폰트 기록은 아직 없습니다. ${link(document, "docs/recording-analyses.md", "분석을 추가하는 방법")}`,
    heading("실제 적용 기술과 확인 위치", entry.technologies.map(usage => {
      const technology = reuse.technologies.find(item => item.id === usage.id);
      return `**${technology.title}** \`${usage.id}\`: ${usage.application} 확인: ${
        entry.distribution === "local-only" ? `\`${usage.location}\`` : link(document, usage.location)
      }.`;
    })),
    heading("추출 가능한 부분", entry.reusableParts),
    `### Swift·SwiftUI·Metal·RealityKit\n\n${entry.native}\n`,
    `### 게임 에셋·게임 UI\n\n${entry.game}\n`,
    heading("실행 요구사항", entry.requirements),
    heading("검수와 한계", [...entry.checks, ...entry.limitations]),
    details.assets.length
      ? heading("자산·권리·교체", details.assets.map(asset =>
        `\`${asset.id}\` / **${asset.distribution}**: ${asset.rights} ${asset.replacement}\n${asset.paths.map(file => `  - \`${file}\``).join("\n")}`))
      : "### 자산\n\n별도 바이너리 자산이 없는 시안입니다. 시스템 폰트·내장 엔진의 고지는 원본에서 확인합니다.\n",
    entry.sourceFiles.length ? heading("HTML 외에 함께 가져올 모듈", entry.sourceFiles.map(file =>
      entry.distribution === "local-only" ? `\`${file}\` (로컬 전용)` : link(document, file))) : "",
  ].filter(Boolean).join("\n\n");
}

const inventory = "docs/design-inventory.md";
const technologyLibrary = catalog.technologies.index();
outputs.set(inventory, [
  "# 전체 시안 기술 분석·재사용 인벤토리", banner,
  "## 분석 범위와 구현 수준",
  `현재 작업공간의 **${entries.length}개 독립 HTML 시안 / ${reuse.families.length}개 유형 / ${reuse.technologies.length}개 기술 / ${reuse.platforms.length}개 대상 플랫폼**을 분류했습니다. MCP의 기존 186개 패턴과 대표 웹 10개·SwiftUI 10개 예제는 별도 집계합니다.`,
  `시안에서 확인한 기술 외에 사용할 수 있는 프레임워크·렌더러·제작 앱·검수 도구는 ${link(inventory, technologyDocument, "설계·구현 기술 카탈로그")}에서 비교합니다. 후보는 시안에서 구현된 기술 수에 포함하지 않습니다.`,
  "HTML·로컬 JS·CSS/SVG·자산 메타데이터·테스트·전처리/패키징 스크립트와 기존 지침을 근거로 정리했습니다. node_modules·dist·과거 tgz는 의존성/생성물로 구분하며 별도 시안으로 세지 않습니다. 외부 에디터의 읽기 전용 첨부 스냅샷은 원본으로 이동·수정하지 않았습니다.",
  "**구현됨**은 현재 웹 소스의 존재를 뜻합니다. SwiftUI/Metal/RealityKit/게임 안내는 이식 설계이며 해당 시안의 네이티브 코드·컴파일·기기 검증을 뜻하지 않습니다. SVG 원근 그림, SDF 함수, 실제 메시를 혼동하지 않습니다.",
  `색감·레이아웃·폰트의 독립 분석은 별도 누적합니다. 현재 **${catalog.analyses.entries.length}건**이며 모든 시안을 세 축으로 재분석한 것은 아닙니다. ${link(inventory, "docs/analyses/README.md", "누적 분석 목록")} · ${link(inventory, "docs/recording-analyses.md", "새 분석 작성·등록")}`,
  "## 유형별 바로가기",
  ...reuse.families.map(family =>
    `- ${link(inventory, `designs/${family.id}/README.md`, family.title)} — ${entries.filter(entry => entry.family === family.id).length}개. ${family.summary}`),
  "## 시안별 기술 요약",
  "| 시안 ID | 유형 | 주요 기술 | 배포 |", "| --- | --- | --- | --- |",
  ...entries.map(entry => `| [${entry.id}](#${entry.id}) | ${entry.family} | ${entry.technologies.map(item => item.id).join(", ")} | ${entry.distribution} |`),
  ...entries.map(entry => designSection(entry, inventory)),
  "## 배포 경계",
  "MIT는 저장소 자체 코드에 적용되는 기본 라이선스이며 사진·서체·음원·모델의 권리를 일괄 허락하지 않습니다. 개인 생일 시안과 reference 원본 자료는 GitHub와 npm에서 제외합니다. 원문이 없는 MCP는 생일 분석을 제공하되 sourceAvailable=false와 명시적인 안내를 반환합니다.",
  "원본 Blender/사진/음원은 reference/private/birthday, 극장 참고 자료 두 세트는 reference/cinema/originals와 reference/cinema/studies에 보존했습니다. 중복으로 보이는 원본도 삭제하지 않았습니다.",
  `다음: ${link(inventory, "docs/platform-adoption.md")} · ${link(inventory, "docs/mcp-workflows.md")} · ${link(inventory, "docs/workspace-map.md")}`,
].join("\n\n") + "\n");

const analysisIndex = "docs/analyses/README.md";
const preferenceProfile = catalog.analyses.preferences();
const weights = { explicit: "명시적 피드백", recurring: "반복된 해석", tentative: "단일 출처의 가설" };
const directions = { prefer: "선호 후보", avoid: "피할 선택" };
const renderSignal = (signal) => [
  `- **${signal.basis === "explicit" ? "사용자 명시" : "분석자 해석"}**: ${signal.interpretation}`,
  `  - 맥락: ${signal.context}`,
  `  - 디자인 결정: ${signal.application}`,
  ...(signal.tradeoff ? [`  - 상충·검수: ${signal.tradeoff}`] : []),
  ...(signal.userNote ? [`  - 사용자 피드백: ${signal.userNote}`] : []),
  `  - 근거: ${signal.evidenceIds.map(id => `\`${id}\``).join(", ")}`,
].join("\n");
outputs.set(preferenceDocument, [
  "# 디자인 취향 프로필", banner,
  `MCP: \`${preferenceUri}\` · \`get_design_preferences\` · ${link(preferenceDocument, "docs/recording-analyses.md", "저장·적용 방법")}`,
  "현재 요청과 사용성·접근성 제약 안에서만 적용한다. 관련 있는 명시적 피드백 → 독립 예시에서 반복된 해석 → 단일 출처에서 나온 가설 순서로 참고한다. 전체 디자인 선호는 모든 개별 요소의 선호를 뜻하지 않는다.",
  ...preferenceProfile.principles.map(item => [
    `## \`${item.key}\``,
    `**${directions[item.direction]}** · ${weights[item.weight]} · 독립 출처 ${item.sourceCount}개 · \`${item.focus}\` · \`${item.contextKey}\``,
    ...item.references.map(ref => [
      `### ${link(preferenceDocument, `docs/analyses/${ref.analysisId}.md#근거-목록`, ref.analysisId)}`,
      renderSignal(ref),
    ].join("\n\n")),
  ].join("\n\n")),
  ...(preferenceProfile.principles.length ? [] : ["아직 취향 판단에 쓸 근거가 없다. 현재 요청을 기준으로 진행한다."]),
].join("\n\n") + "\n");
const paletteGuide = analysisLogInfo("color").document;
const tableText = value => String(value).replaceAll("|", "\\|").replaceAll("\n", "<br>");
const paletteStart = "<!-- preference-colors:start -->";
const paletteEnd = "<!-- preference-colors:end -->";
const paletteSource = await readFile(new URL(paletteGuide, root), "utf8");
const [paletteBefore, paletteSection, ...extraStarts] = paletteSource.split(paletteStart);
const [, paletteAfter, ...extraEnds] = (paletteSection ?? "").split(paletteEnd);
if (paletteAfter === undefined || paletteBefore.includes(paletteEnd) || extraStarts.length || extraEnds.length) {
  throw new Error(`Expected exactly one ordered preference-colors marker pair in ${paletteGuide}.`);
}
for (const axis of analysisAxes) {
  const { document } = analysisLogInfo(axis);
  const log = renderAnalysisLog(catalog.analyses, axis);
  outputs.set(document, axis === "color"
    ? `${paletteBefore}${paletteStart}\n\n${log}\n${paletteEnd}${paletteAfter}` : log);
}
outputs.set(analysisScopeDocument, [
  "# 디자인 분석 세부 기준",
  `> 분류 정의에서 자동 생성한다. ${link(analysisScopeDocument, "docs/recording-analyses.md", "저장·분류 방법")} · MCP: \`${analysisScopeUri}\`.`,
  "필요한 항목에만 근거를 기록한다. 각 관찰은 하나의 `focus`를 선택하고 여러 주제가 섞이면 관찰을 나눈다. 근거가 없는 항목을 채우기 위해 추정하지 않는다.",
  "관찰 중 실제 선택을 바꾸는 것은 `preferenceSignals`에 효과·맥락·적용 결정·상충/검수로 연결한다. 예: 모션이 제목을 읽는 데 방해가 된다면 시선 유도만 남기고 정지 상태의 가독성을 확인한다.",
  ...analysisAxes.flatMap(axis => {
    const { title, document, documentAnchor } = analysisLogInfo(axis);
    return [
      `## ${title}`,
      link(analysisScopeDocument, `${document}${documentAnchor}`, "누적 로그"),
      ["| `focus` | 세부 기준 | 관찰할 내용 |", "| --- | --- | --- |",
        ...analysisFocuses.filter(item => item.axis === axis).map(item =>
          `| \`${item.id}\` | ${tableText(item.title)} | ${tableText(item.guide)} |`),
      ].join("\n"),
    ];
  }),
].join("\n\n") + "\n");

outputs.set("content/analysis.schema.json", `${JSON.stringify(z.toJSONSchema(analysisSchema), null, 2)}\n`);
outputs.set(analysisIndex, [
  "# 디자인 요소별 누적 분석", banner,
  "새 참고 예시의 관찰 결과를 예시별로 보존합니다. 앞으로 사용자가 제공하는 예시는 마음에 드는 디자인으로 받아들여 선호 레퍼런스로 축적합니다. 색감·레이아웃·폰트를 나누는 것은 선호를 유보하기 위해서가 아니라 구성과 재사용 원리를 추출하기 위해서입니다. AI가 고른 연구·재현 시안은 구분하고, 전체 디자인 선호와 추론한 요소별 선호 이유·공통 경향도 구분합니다. 이후 디자인에서는 관련 선호 기록을 먼저 찾아 활용합니다.",
  `디자인 결정을 할 때는 ${link(analysisIndex, preferenceDocument, "디자인 취향 프로필")}에서 관련 기준과 근거의 강도를 먼저 확인합니다.`,
  `${link(analysisIndex, "docs/recording-analyses.md", "작성·등록·MCP 조회 방법")} · ${link(analysisIndex, analysisScopeDocument, "세부 분석 기준")} · ${link(analysisIndex, "content/analysis-template.json", "JSON 작성 양식")} · ${link(analysisIndex, inventory, "기존 시안 기술 인벤토리")}`,
  "## 사용자 제공 레퍼런스 요소별 로그",
  "| 항목별 문서 | 기록 수 | MCP 리소스 |", "| --- | ---: | --- |",
  ...catalog.analyses.list().logs.map(({ title, document, documentAnchor, entryCount, uri }) =>
    `| ${link(analysisIndex, `${document}${documentAnchor}`, title)} | ${entryCount} | \`${uri}\` |`),
  "## 분위기·스타일·느낌·인상과 활용",
  `${link(analysisIndex, "docs/recording-analyses.md#분위기스타일느낌인상과-활용", "분석·검증 방법")} · MCP: \`${characterUri}\``,
  ...catalog.analyses.entries.filter(item => item.status === "analyzed" && item.character).map(item =>
    `- ${link(analysisIndex, `docs/analyses/${item.id}.md#design-character`, item.title)}`),
  "## 예시별 상세 보고서",
  `전체 ${catalog.analyses.entries.length}건 / 분석 ${catalog.analyses.list().analyzedCount}건 / 초안 ${catalog.analyses.list().draftCount}건. 초안은 MCP 기본 검색에서 제외됩니다. 분석 상태도 개별 근거 밖의 렌더링·폰트 확인을 뜻하지 않습니다.`,
  "| 예시 | 상태 | 수정일 | 연결 시안 |", "| --- | --- | --- | --- |",
  ...catalog.analyses.entries.map(item => `| ${link(analysisIndex, `docs/analyses/${item.id}.md`, tableText(item.title))} | ${item.status} | ${item.updatedAt} | ${item.visualId ?? "외부/독립 참고"} |`),
  "데이터와 보고서는 npm 배포 대상입니다. 개인 자산·기밀 원문·인증 URL을 넣지 않습니다.",
].join("\n\n") + "\n");
for (const record of catalog.analyses.entries) {
  const document = `docs/analyses/${record.id}.md`;
  const observations = axis => axis.findings.length ? `### 관찰과 근거\n\n${renderFindingGroups(axis.findings)}\n` : "";
  outputs.set(document, [
    `# ${record.title}`, banner, record.summary,
    `상태: **${record.status}** · 작성 ${record.createdAt} · 수정 ${record.updatedAt}`,
    `참고자료: ${record.source.type} / \`${record.source.location}\`\n\n${record.source.description}`,
    record.visualId ? `연결 시안: ${link(document, `${inventory}#${record.visualId}`, record.visualId)}` : "실행 HTML과 연결하지 않은 독립 참고자료입니다.",
    `데이터: ${link(document, `content/analyses/${record.id}.json`)} · MCP: \`design://analyses/${record.id}\` · [전체 분석](./README.md)`,
    record.status === "draft" ? "**초안**: 미완료 기록입니다. 미검증 관찰을 완성된 분석으로 사용하지 않습니다. 사용자가 제공한 예시의 전체 디자인 선호와 분석의 완성 여부는 별개입니다." : "",
    record.analysisScope ? `**분석 범위:** ${record.analysisScope.map(axis => analysisLogInfo(axis).title).join(", ")}.` : "",
    record.preferenceFocuses ? `**사용자가 지정한 선호 범위:** ${record.preferenceFocuses.map(focus => `\`${focus}\``).join(", ")}.` : "",
    ...(record.color ? [
      "## 색감 분석", record.color.summary,
      "| 역할 | 값 | 확인 수준 | 근거 |", "| --- | --- | --- | --- |",
      ...record.color.palette.map(item => `| ${tableText(item.role)} | ${tableText(item.value ?? "미확인")} | ${item.certainty} | ${item.evidenceIds.join(", ") || "없음"} |`),
      observations(record.color), heading("색감 재사용", record.color.reuse),
    ] : []),
    ...(record.layout ? [
      "## 레이아웃 분석", record.layout.summary,
      observations(record.layout), heading("레이아웃 재사용", record.layout.reuse),
    ] : []),
    ...(record.typography ? [
      "## 폰트 분석", record.typography.summary,
      ...record.typography.fonts.map(font => [
        `### ${font.role}`,
        `- 선언된 스택: ${font.declaredFamilies.join(", ") || "미확인"}\n- 실제 렌더링 서체: ${font.renderedFamily ?? "미확인"}\n- 식별 수준: ${font.identification}\n- 굵기: ${font.weight ?? "미확인"}\n- 근거: ${font.evidenceIds.join(", ") || "없음·미확인"}`,
        font.notes, `출처·라이선스: ${font.license}`,
      ].join("\n\n")),
      observations(record.typography), heading("폰트 재사용", record.typography.reuse),
    ] : []),
    ...elementAxes.flatMap(axis => {
      const element = getAnalysisSection(record, axis);
      if (!element) return [];
      const { title, anchor } = analysisLogInfo(axis);
      return [`<a id="${anchor}"></a>\n\n## ${title}`, element.summary,
        observations(element), ...(element.reuse.length ? [heading("재사용", element.reuse)] : [])];
    }),
    ...(record.character ? [
      '<a id="design-character"></a>\n\n## 분위기·스타일·느낌·인상',
      `**확인 범위:** ${record.character.viewedState}`,
      ...characterDimensions.map(dimension => {
        const { title } = characterRubric[dimension];
        const item = record.character[dimension];
        if (item.certainty === "unknown") return `### ${title}\n\n**미확인:** ${item.reason}`;
        const sources = item.observations.map(({ axis, topic }) => {
          const finding = getAnalysisSection(record, axis).findings.find(item => item.topic === topic);
          const { anchor } = analysisLogInfo(axis);
          return `[${topic}](#${anchor}) · 근거: ${finding.evidenceIds.join(", ")}`;
        });
        return `### ${title}\n\n**해석: ${item.label}**\n\n${item.reasoning}\n\n${bullets(sources)}`;
      }),
      ...(record.character.useCases.length ? [
        "## 활용 방안",
        ...record.character.useCases.map(item => `### ${item.context}\n\n${bullets([
          `연결한 해석: ${item.dimensions.map(dimension => characterRubric[dimension].title).join(", ")}`,
          `목표: ${item.goal}`, `유지할 것: ${item.preserve}`, `바꿔도 되는 것: ${item.adapt}`,
          `피할 조건: ${item.avoidWhen}`, `검수: ${item.verify}`,
        ])}`),
      ] : []),
    ] : []),
    ...(record.preferenceSignals?.length ? [
      "## 취향과 디자인 결정",
      ...record.preferenceSignals.map(signal => [
        `### \`${signal.key}\` · \`${signal.focus}\` · ${directions[signal.direction]}`,
        renderSignal(signal),
      ].join("\n\n")),
    ] : []),
    heading("근거 목록", record.evidence.map(item => {
      const source = catalog.sources.get(item.location.split("#")[0]);
      const location = source?.distribution === "bundled" ? link(document, item.location) : `\`${item.location}\``;
      return `**${item.id}** / ${item.kind} / ${location}: ${item.description}`;
    })),
    heading("한계·미검증", record.limitations),
  ].filter(Boolean).join("\n\n") + "\n");
}

const platformDoc = "docs/platform-adoption.md";
outputs.set(technologyDocument, [
  "# 시안·실전 디자인 기술 카탈로그",
  "> content/technology-options.json과 content/design-reuse.json에서 생성합니다. 등록 데이터를 편집한 뒤 `npm run docs:designs`를 실행하세요.",
  `**${technologyLibrary.categories.length}개 영역 · ${technologyLibrary.count}개 항목**: 시안 사용 근거 ${technologyLibrary.sourceBackedCount}개, 추가 도입 후보 ${technologyLibrary.candidateCount}개.`,
  `MCP: \`${technologyIndexUri}\` · \`search_design_technologies\` · \`get_design_technology\` · ${link(technologyDocument, platformDoc, "플랫폼별 이식 가이드")}`,
  "- `source-backed`: 저장소의 독립 시안 또는 그 제작 스크립트에 등록된 사용 위치가 있다. 대상 프로젝트 설치, 실기기 성능, 현재 브라우저 지원을 보증하지 않는다. 로컬 전용 소스는 배포본에 없을 수 있다.",
  "- `candidate`: 도입 판단용 문서다. 이 카탈로그에 연결된 독립 시안의 근거는 없고, 별도의 교육 예제나 실제 세션 설치 여부까지 부정하는 것은 아니다.",
  "- `platforms`: 사용하거나 제작·검수에 쓰는 환경을 찾기 위한 태그다. 에디터의 호스트 OS와 최종 내보내기 대상은 다를 수 있으며 버전·SDK·기기는 별도로 확인한다.",
  "## 목적에 맞게 고르는 순서",
  "1. 현재 프로젝트의 스택과 산출물부터 확인한다. 디자인 구현의 일부인 요청만 조회하고, 기존 스택이 충분하면 교체하거나 의존성을 늘리지 않는다.",
  "2. 고정 모션은 [영상](#technology-web-video)이나 [사전 렌더](#technology-baked-3d), 실시간 2D는 [SVG](#technology-svg-illustration)·[Canvas](#technology-canvas-2d), 회전·조명·대량 입자는 [Three.js](#technology-three-pbr)·[WebGL](#technology-webgl-sdf)·[WebGPU](#technology-webgpu) 순으로 요구에 맞춰 비교한다. 기술 이름보다 필요한 조작과 예산으로 결정한다.",
  "3. Figma·Blender·게임 엔진 등의 직접 실행은 해당 앱, 프로젝트 접근 권한, 세션의 도구 또는 별도 연동이 있어야 한다. 조회만으로 설치·실행·파일 생성·배포를 하지 않는다.",
  "4. 성능 목표, 모바일·저사양 대안, 접근 가능한 의미와 입력, 에셋 권리를 먼저 정하고 실제 기기와 화면에서 검수한다.",
  "## 분야별 바로가기",
  ...technologyLibrary.categories.map(({ id, title, count }) => `- [${title}](#category-${id}) — ${count}개`),
  ...technologyLibrary.categories.flatMap(({ id, title }) => [
    `<a id="category-${id}"></a>\n## ${title}`,
    ...catalog.technologies.entries.filter(item => item.category === id).map(item => {
      const base = [
        `<a id="technology-${item.id}"></a>\n### ${html(item.title)}`,
        `\`${item.id}\` · \`${item.status}\` · \`${item.kind}\` · ${item.platforms.join(", ")}`,
        item.what,
      ];
      if (item.status === "source-backed") {
        return [
          ...base,
          `- 실제 사용: ${entries.filter(entry => entry.technologies.some(usage => usage.id === item.id))
            .map(entry => link(technologyDocument, `${inventory}#${entry.id}`, entry.id)).join(", ")}`,
          `- ${link(technologyDocument, `${platformDoc}#${item.id}`, "플랫폼별 적용·검수·공식 문서")}`,
        ].join("\n\n");
      }
      return [...base, bullets([
        `**쓸 때:** ${item.useWhen}`, `**필요 조건:** ${item.requires}`, `**제약:** ${item.tradeoff}`,
        `**검수:** ${item.check}`, `[공식 참고](${item.reference})`,
      ])].join("\n\n");
    }),
  ]),
].join("\n\n") + "\n");
outputs.set(platformDoc, [
  "# 플랫폼별 기술 활용·이식 가이드", banner,
  "현재 실행 구현은 웹 시안입니다. 이 문서는 목적에 맞게 원리·자산·상태를 선택하는 지침이며 자동 포팅 도구가 아닙니다. 대상 프로젝트의 SDK·OS·렌더 파이프라인·입력·자산 권리를 먼저 확인합니다.",
  `이 문서의 대상 플랫폼 외 프레임워크·저작 도구·검수 환경은 ${link(platformDoc, technologyDocument, "기술 카탈로그")}에서 확인합니다.`,
  "## 선택 기준",
  "- 일반 앱 UI/개인 홈페이지: 활자·배색·상태와 시맨틱 조작을 먼저 이전합니다. 단순 편집 화면에 Metal을 추가할 필요는 없습니다.",
  "- SVG 일러스트: Shape/Canvas 또는 PDF/PNG로 변환합니다. 2D 목업이 회전 가능한 3D 모델은 아닙니다.",
  "- 절차적 ASCII/광학 유리: Metal 다중 패스 또는 엔진 후처리로 재작성합니다. CSS backdrop-filter와 진짜 굴절을 구분합니다.",
  "- 케이크·극장 3D: RealityKit/게임 scene graph로 이전합니다. 모델·조명·색 관리·오디오·화면 상태는 따로 검수합니다.",
  ...reuse.platforms.map(platform => [
    `<a id="${platform.id}"></a>\n## ${platform.title} \`${platform.id}\``,
    heading("필요 요소", platform.requirements),
    heading("통합 순서", platform.workflow),
    heading("확인할 결과", platform.validation),
    heading("제약", platform.limits),
    heading("공식 참고", platform.references.map(url => `[${url}](${url})`)),
  ].join("\n\n")),
  "## 기술별 변환 경로",
  ...reuse.technologies.map(technology => [
    `<a id="${technology.id}"></a>\n### ${technology.title} \`${technology.id}\``,
    technology.what,
    `- 웹: ${technology.web}\n- Apple: ${technology.apple}\n- 게임: ${technology.game}`,
    bullets(technology.checks),
    `적용 시안: ${entries.filter(entry => entry.technologies.some(item => item.id === technology.id)).map(entry => `[${entry.id}](./design-inventory.md#${entry.id})`).join(", ")}`,
    bullets(technology.references.map(url => `[공식 참고](${url})`)),
  ].join("\n\n")),
  "## Swift 앱에서 특히 빠뜨리지 않을 요소",
  "- 2D SwiftUI Shader: .metal stitchable 함수의 signature·maxSampleOffset·래스터 레이어 경계를 지킵니다. layerEffect는 임의의 뒤쪽 네이티브 화면을 읽는 API가 아닙니다.",
  "- MTKView: command buffer 완료 전 재사용하는 uniform buffer를 동기화하고 render target 크기·usage·pixel format·색 공간을 명시합니다. ASCII는 장면 텍스처와 문자 아틀라스 합성 텍스처를 구분합니다.",
  "- glTF/GLB → USDZ: 변환 도구의 현재 지원을 확인하고 축·미터 단위·피벗·법선·sRGB base color와 linear data texture를 검사합니다. 모델의 collision/LOD/rig는 별도 작업입니다.",
  "- 마이크: NSMicrophoneUsageDescription·현재 대상 OS의 권한 API·AVAudioSession·AVAudioEngine tap·vDSP FFT를 연결합니다. 권한 거부 시 버튼 대안, 인터럽트/백그라운드 시 엔진과 입력 해제가 필요합니다.",
  "- 시스템 Liquid Glass는 iOS/macOS 26+ availability 분기로 적용하고 이전 OS는 Material/단색 대안을 둡니다. 단지 사용자가 Metal을 언급했다고 Metal 4 전용 기능을 필수로 만들지 않습니다.",
  "- 이 안내는 API 선택 근거입니다. 실제 Xcode 프로젝트·MSL·USDZ·엔진 패키지는 아직 제공하지 않습니다.",
].join("\n\n") + "\n");

outputs.set("designs/README.md", [
  "# 종류별 시안 탐색", banner,
  "저장소 루트에서 정적 HTTP 서버를 실행하고 [탐색 화면](./index.html)을 엽니다. 예: `python3 -m http.server 4173 --bind 127.0.0.1` → `http://127.0.0.1:4173/designs/`.",
  "이전 루트/docs HTML은 이동 안내이며 원본은 아래 폴더에 한 번만 보관합니다. 원본 주소의 query/hash도 유지합니다.",
  ...reuse.families.map(family =>
    `- [${family.title}](./${family.id}/README.md) — ${family.summary}`),
  "- shared/assets: 시안이 공통 사용하는 사진·서체·고지. 출처와 각 라이선스를 유지합니다.",
  `분석: ${link("designs/README.md", inventory)} · ${link("designs/README.md", technologyDocument)} · ${link("designs/README.md", platformDoc)} · ${link("designs/README.md", "docs/mcp-workflows.md")}`,
  `색감·레이아웃·폰트: ${link("designs/README.md", analysisIndex, "누적 분석 목록")} · ${link("designs/README.md", "docs/recording-analyses.md", "분석 추가")}`,
  "생일 원문·모듈·개인 자산은 로컬 전용입니다. npm 설치본에서는 분석만 보며 원본 경로를 사용할 수 없습니다.",
].join("\n\n") + "\n");
for (const family of reuse.families) {
  const file = `designs/${family.id}/README.md`;
  outputs.set(file, [
    `# ${family.title}`, banner, family.summary,
    `[전체 탐색](../README.md) · ${link(file, platformDoc, "플랫폼별 이식 가이드")}`,
    ...entries.filter(entry => entry.family === family.id).map(entry => designSection(entry, file)),
  ].join("\n\n") + "\n");
}
outputs.set("designs/index.html", `<!doctype html>
<html lang="ko">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>시안·기술 탐색</title>
<style>
:root{color-scheme:light dark;font-family:system-ui,sans-serif}
body{max-width:76rem;margin:auto;padding:2rem;line-height:1.75}h1{font-size:clamp(2rem,6vw,4rem);line-height:1.15}
a{color:inherit;text-underline-offset:.25em}a:focus-visible,input:focus-visible,select:focus-visible{outline:2px solid currentColor;outline-offset:4px}
nav,form{display:flex;flex-wrap:wrap;gap:1rem;margin-block:2rem}input,select{font:inherit;padding:.45rem;max-width:100%}
section{margin-block:4rem}li{padding-block:1.2rem;border-bottom:1px solid #8886}ul{padding:0;list-style:none}p{max-width:65ch}
[hidden]{display:none!important}.meta{font-size:.875rem;opacity:.8}
@media(max-width:600px){body{padding:1rem}form{display:grid}}
</style></head>
<body><header><h1>시안과 구현 기술</h1><p>${entries.length}개 웹 시안을 목적·기술별로 찾고, Apple 앱과 게임으로 옮길 부분을 선택합니다. 네이티브·게임 코드는 자동 생성되지 않습니다.</p>
<nav><a href="../docs/design-inventory.md">시안 기술 분석</a><a href="../${technologyDocument}">기술 카탈로그</a><a href="../docs/analyses/README.md">색감·레이아웃·폰트 누적 분석</a><a href="../docs/recording-analyses.md">분석 추가</a><a href="../docs/platform-adoption.md">플랫폼 가이드</a><a href="../docs/mcp-workflows.md">외부 MCP 활용</a></nav></header>
<form role="search"><label>검색 <input id="query" type="search" placeholder="ASCII, 굴절, 사진, 케이크"></label>
<label>유형 <select id="family"><option value="">전체</option>${reuse.families.map(item => `<option value="${item.id}">${html(item.title)}</option>`).join("")}</select></label>
<label>기술 <select id="technology"><option value="">전체</option>${reuse.technologies.map(item => `<option value="${item.id}">${html(item.title)}</option>`).join("")}</select></label></form>
<p id="count" role="status">${entries.length}개 시안</p><main>${reuse.families.map(family => `<section data-family="${family.id}"><h2>${html(family.title)}</h2><p>${html(family.summary)}</p><ul>${entries.filter(entry => entry.family === family.id).map(entry => {
    const technologyText = entry.technologies.map(usage => reuse.technologies.find(item => item.id === usage.id)).map(tech => `${tech.title} ${tech.keywords.join(" ")}`).join(" ");
    const search = `${entry.id} ${entry.title} ${entry.summary} ${entry.keywords.join(" ")} ${technologyText} ${catalog.analyses.searchText(entry.id)}`.normalize("NFKC").toLowerCase();
    return `<li data-search="${html(search)}" data-tech="${entry.technologies.map(item => item.id).join(" ")}"><h3><a href="${entry.distribution === "local-only" ? `../docs/design-inventory.md#${entry.id}` : html(entry.path.replace(/^designs\//u, ""))}">${html(entry.title)}</a></h3><p>${html(entry.summary)}</p><p class="meta">${html(entry.technologies.map(item => item.id).join(" · "))}</p><a href="../docs/design-inventory.md#${entry.id}">구현 위치·자산·이식 방법</a>${entry.distribution === "local-only" ? " · 개인 원본은 로컬 전용" : ""}</li>`;
  }).join("")}</ul></section>`).join("")}</main>
<script>
const form=document.querySelector("form"),query=document.getElementById("query"),family=document.getElementById("family"),technology=document.getElementById("technology");
function filter(){let count=0;const words=query.value.normalize("NFKC").toLowerCase().trim().split(/\\s+/u).filter(Boolean);for(const section of document.querySelectorAll("section[data-family]")){let visible=0;for(const item of section.querySelectorAll("li")){const match=(!family.value||section.dataset.family===family.value)&&(!technology.value||item.dataset.tech.split(" ").includes(technology.value))&&words.every(word=>item.dataset.search.includes(word));item.hidden=!match;if(match)visible++;}section.hidden=!visible;count+=visible;}document.getElementById("count").textContent=count+"개 시안";}
form.addEventListener("submit",event=>event.preventDefault());form.addEventListener("input",filter);form.addEventListener("change",filter);
</script></body></html>
`);

for (const [file, text] of outputs) {
  const url = new URL(file, root);
  const content = file.endsWith(".md") ? `${text.trimEnd()}\n` : text;
  if (check) {
    if (await readFile(url, "utf8") !== content) throw new Error(`Generated documentation is stale: ${file}. Run npm run docs:designs.`);
  } else {
    await mkdir(new URL("./", url), { recursive: true });
    await writeFile(url, content);
  }
}
console.log(`${check ? "Verified" : "Generated"} ${outputs.size} catalog documents and navigation pages.`);
