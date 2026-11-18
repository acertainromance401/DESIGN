import { posix } from "node:path";
import { AnalysisCatalog, type AnalysisAxis, type AnalysisFinding, analysisLogInfo } from "./analyses.js";
import { type AnalysisFocus, analysisFocusInfo } from "./analysis-focuses.js";

export function renderFindingGroups(findings: readonly AnalysisFinding[]) {
  const grouped = new Map<AnalysisFocus | undefined, AnalysisFinding[]>();
  for (const finding of findings) {
    const group = grouped.get(finding.focus);
    if (group) group.push(finding);
    else grouped.set(finding.focus, [finding]);
  }
  return [...grouped].map(([focus, items]) => [
    focus ? `**${analysisFocusInfo(focus).title}** · \`${focus}\``
      : grouped.size > 1 ? "**기타 관찰**" : "",
    items.map(item =>
      `- **${item.topic}** (${item.certainty}): ${item.observation}${item.evidenceIds.length ? ` · 근거: ${item.evidenceIds.join(", ")}` : ""}`,
    ).join("\n"),
  ].filter(Boolean).join("\n\n")).join("\n\n");
}

export function renderAnalysisLog(catalog: AnalysisCatalog, axis: AnalysisAxis) {
  const { title, anchor, uri, document } = analysisLogInfo(axis);
  const from = posix.dirname(document);
  const entries = catalog.logEntries(axis);
  const tableCell = (value: string) => value.replaceAll("|", "\\|").replaceAll("\n", "<br>");
  return [
    axis === "color" ? "## 사용자 제공 레퍼런스 색감 분석" : `# ${title} 누적 로그`,
    `> 예시별 분석 JSON에서 자동 생성한다. 추가·수정은 [분석 등록 안내](<${posix.relative(from, "docs/recording-analyses.md")}>)를 따른다. MCP: \`${uri}\`.`,
    axis === "color"
      ? "위 8개 비교 시안과 별도로, 사용자가 제공한 예시의 색감 관찰을 모은다. `estimated`는 프레임에서 추출한 표본 등 추정값으로, 원본의 확정 색상은 아니다."
      : "사용자가 제공한 선호 레퍼런스의 확인·추정·미확인 관찰을 모은다. 근거 원문과 다른 분석 항목은 예시별 보고서에서 확인한다.",
    ...entries.map(({ record, section }) => [
      `${axis === "color" ? "###" : "##"} ${record.title}`,
      `수정 ${record.updatedAt} · [상세 분석·근거](<${posix.relative(from, `docs/analyses/${record.id}.md`)}#${anchor}>)`,
      record.preferenceFocuses ? `**사용자가 지정한 선호 범위:** ${record.preferenceFocuses.map(focus => `\`${focus}\``).join(", ")}. 아래의 나머지 특성은 관찰이다.` : "",
      section.summary,
      axis === "color" && record.color ? [
        "| 역할 | 값 | 확인 수준 |", "| --- | --- | --- |",
        ...record.color.palette.map(({ role, value, certainty }) =>
          `| ${tableCell(role)} | ${tableCell(value ?? "미확인")} | ${certainty} |`),
      ].join("\n") : "",
      axis === "typography" && record.typography ? record.typography.fonts.map(font => {
        const family = font.renderedFamily ?? (font.declaredFamilies.join(", ") || "미확인");
        return `- **${font.role}**: ${family} (${font.identification})${font.weight ? ` · ${font.weight}` : ""}`;
      }).join("\n") : "",
      renderFindingGroups(axis === "color" ? section.findings.filter(item => item.focus) : section.findings),
      section.reuse.length ? `**재사용**\n\n${section.reuse.map(rule => `- ${rule}`).join("\n")}` : "",
    ].filter(Boolean).join("\n\n")),
    entries.length ? "" : "아직 등록된 사용자 선호 분석이 없다.",
  ].filter(Boolean).join("\n\n") + "\n";
}
