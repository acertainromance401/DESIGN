import { readFile } from "node:fs/promises";
import { z } from "zod";
import { DesignError } from "./catalog.js";

export const visualSearchShape = {
  query: z.string().trim().min(1).max(200).describe("Korean/English visual example keywords, e.g. 배색, 독서, ripple, 시트"),
  limit: z.number().int().min(1).max(10).default(5),
  offset: z.number().int().min(0).max(1000).default(0),
};
export const visualGetShape = {
  id: z.string().regex(/^[a-z][a-z0-9-]*$/u),
  includeSource: z.boolean().default(false).describe("Opt in to full HTML/CSS/JavaScript source. Check limitations for required local assets. Default returns metadata and available guidance."),
};
const definitionSchema = z.strictObject({
  id: z.string().regex(/^[a-z][a-z0-9-]*$/u),
  title: z.string().min(1),
  summary: z.string().min(1),
  keywords: z.array(z.string().min(1)).min(1),
  html: z.string().regex(/^[a-z][a-z0-9-]*\.html$/u),
  guide: z.string().regex(/^[a-z][a-z0-9-]*\.md$/u).optional(),
  limitations: z.array(z.string().min(1)).min(1),
});
type Definition = z.infer<typeof definitionSchema>;
type VisualFile = { file: string; text: string; mimeType: "text/html" | "text/markdown" };
const definitions: Definition[] = [
  {
    id: "boxing-overhead", title: "위에서 본 복싱 링",
    summary: "붉은 로프·청회색 매트·비스듬한 한글 제목·작은 인물로 구성한 오버헤드 복싱 지면.",
    keywords: ["복싱", "링", "오버헤드", "포스터", "레퍼런스", "boxing", "ring", "overhead"],
    html: "boxing-overhead.html", guide: "boxing-references.md",
    limitations: ["원본 사진 대신 독자적인 SVG로 그린 가상 연습회이며 실제 모집 기능은 없다."],
  },
  {
    id: "boxing-vintage", title: "종이 질감의 복싱 포스터",
    summary: "종이색·붉은 대형 글자·가드 자세의 SVG 인물·고정 노이즈로 구성한 가상 훈련 기록 표지.",
    keywords: ["복싱", "빈티지", "종이", "그레인", "포스터", "boxing", "vintage", "grain", "paper"],
    html: "boxing-vintage.html", guide: "boxing-references.md",
    limitations: ["원본 사진 대신 독자적인 SVG를 사용했다. 실제 훈련 처방이 아니며 하단 막대는 스캔 가능한 바코드가 아니다."],
  },
  {
    id: "boxing-arena", title: "조명 아래 복싱 뒷모습",
    summary: "청록 스포트라이트·깊은 검정·흰 제목과 두 팔을 든 SVG 인물을 겹친 세로 단편 표지.",
    keywords: ["복싱", "조명", "청록", "아레나", "포스터", "boxing", "arena", "spotlight"],
    html: "boxing-arena.html", guide: "boxing-references.md",
    limitations: ["원본 사진 대신 조명·군중·인물을 SVG로 그린 정적 가상 작품이며 실제 선수·영화 홍보물이 아니다."],
  },
  {
    id: "sports-collage", title: "스포츠 사진 콜라주",
    summary: "흰 여백·사진 구획·얼굴 확대·프레임을 넘는 인물의 가상 스포츠 지면. CC0 사진을 크롭하고 SVG 윤곽으로 겹친다.",
    keywords: ["스포츠", "사진", "콜라주", "포스터", "인물", "축구", "sports", "collage", "photo", "cutout"],
    html: "sports-collage.html", guide: "sports-collage.md",
    limitations: ["HTML과 패키지의 docs/assets/sports-soccer-cc0.jpg를 함께 보관해야 한다. MCP HTML 조회는 사진 바이너리를 전달하지 않는다.", "참고 핀 원본은 저장하지 않았다. 사용 사진은 CC0지만 초상권·상표권까지 허가하지 않으며 실제 팀 홍보물이 아니다.", "인물 마스크는 수동 SVG 윤곽으로 정밀한 머리카락 제거가 아니다."],
  },
  {
    id: "black-editorial", title: "검정 포스터형 포트폴리오",
    summary: "큰 번호·얇은 타이포·열린 수평 구획·붉은 빛의 포트폴리오. 짧은 진입·펼침·호버와 포인터 반응, 효과 끄기·모션 감소를 지원한다.",
    keywords: ["검정", "레퍼런스", "포트폴리오", "포스터", "에디토리얼", "타이포", "번호", "모션", "호버", "black", "editorial", "portfolio", "reference", "motion"],
    html: "black-editorial.html",
    limitations: ["가상 스튜디오·작업이며 실제 실적이 아니다.", "정적 참조 이미지의 구성 원리만 해석했다. 원본 자산·문구와 사이트 동작은 복제하지 않았다."],
  },
  {
    id: "black-minimal", title: "검정 미니멀 작업 보관함",
    summary: "검정·차콜·회색으로 구성한 모던 파일 목록과 상세 패널. 검색·선택·페이지 내 고정을 시연한다.",
    keywords: ["검정", "블랙", "다크", "모던", "심플", "미니멀", "파일", "black", "dark", "modern", "minimal"],
    html: "black-minimal.html",
    limitations: ["고정은 페이지 메모리에만 반영되며 파일 접근·영구 저장·전송은 없다.", "미리보기는 실제 파일 렌더링이 아닌 CSS 도형이다."],
  },
  {
    id: "aesthetic-notes", title: "개인 디자인 작업 노트",
    summary: "한국어 글자·간격 표본과 비정형 편집의 개인 미감 시안.",
    keywords: ["미감", "작업", "노트", "타이포", "여백", "aesthetic", "typography"],
    html: "aesthetic.html", limitations: ["확정된 개인 취향이나 모든 프로젝트의 스타일 규칙이 아니다."],
  },
  {
    id: "high-energy", title: "강렬한 러닝 이벤트 화면",
    summary: "주황·먹색·라임, 큰 10K 숫자와 CSS 트랙으로 만든 야간 러닝 이벤트.",
    keywords: ["강렬", "에너지", "주황", "라임", "러닝", "운동", "energy", "orange", "running"],
    html: "high-energy.html", limitations: ["가상 이벤트이며 실제 모집·신청·저장 기능은 없다."],
  },
  {
    id: "color-combinations", title: "같은 화면의 8가지 색 조합",
    summary: "산책 기록 화면에 여덟 팔레트를 적용해 색감·분위기와 용도를 비교한다.",
    keywords: ["색감", "배색", "색상", "팔레트", "조합", "color", "palette", "contrast"],
    html: "color-combinations.html", guide: "color-combinations.md",
    limitations: ["고정 시연 데이터이며 색의 인상은 문화·서체·면적에 따라 달라진다."],
  },
  {
    id: "mood-examples", title: "분위기별 6개 화면·18가지 배색",
    summary: "독서·음악·여행·전시·작업 도구·카페 화면별로 세 배색을 선택한다. 기존 8개와 합쳐 26개.",
    keywords: ["분위기", "배색", "색감", "독서", "음악", "여행", "전시", "작업", "카페", "mood", "palette", "music", "cafe"],
    html: "mood-examples.html", guide: "mood-examples.md",
    limitations: ["색 변경만 작동한다. 재생·기록·예약·주문 기능은 없다.", "서로 다른 화면의 차이를 색만의 효과로 해석하지 않는다."],
  },
  {
    id: "screen-effects", title: "32개 앱 화면 효과 갤러리",
    summary: "배경·재질, 등장·전환, 조작, 스크롤, 상태·오버레이를 수동 실행·초기화·정지한다. 추가 검토 효과 19종은 문서에 별도 정리.",
    keywords: ["효과", "화면", "모션", "리플", "틸트", "블러", "그레인", "스프링", "시트", "모달", "effect", "animation", "ripple", "glass", "scroll", "shimmer"],
    html: "screen-effects.html", guide: "screen-effects.md",
    limitations: ["네이티브 햅틱·재질·물리 스프링과 같은 품질을 보장하지 않는다.", "추가 검토 19종 모두에 실행 시연이 있는 것은 아니다.", "실제 서버 작업·저장·업로드는 없다."],
  },
];
const uriFor = (file: string) => `design://visual-files/${file}`;
const tokens = (text: string) => [...new Set(text.normalize("NFKC").toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [])];

export class VisualCatalog {
  constructor(
    public readonly entries: readonly Definition[],
    public readonly files: ReadonlyMap<string, VisualFile>,
  ) {}

  private summary(entry: Definition) {
    return {
      id: entry.id, title: entry.title, summary: entry.summary,
      platform: "web", sourceKind: "visual-example",
      htmlUri: uriFor(entry.html), guideUri: entry.guide ? uriFor(entry.guide) : null,
      sourceAvailable: true,
    };
  }

  list() {
    return {
      exampleCount: this.entries.length, fileCount: this.files.size,
      uri: "design://visual-examples",
      examples: this.entries.map(entry => ({ ...this.summary(entry), keywords: entry.keywords })),
      guidance: "Separate visual examples, not additions to the 186 pattern catalog. Search with search_design_visuals; fetch with get_design_visual. HTML source is not rendered by MCP; save it as an HTML file and open it in a browser.",
    };
  }

  search(input: unknown) {
    const args = z.object(visualSearchShape).parse(input);
    const query = tokens(args.query);
    const ranked = this.entries.map(entry => {
      const primary = `${entry.id} ${entry.title} ${entry.summary} ${entry.keywords.join(" ")}`.normalize("NFKC").toLowerCase();
      const guide = entry.guide ? this.files.get(entry.guide)!.text.normalize("NFKC").toLowerCase() : "";
      const score = query.reduce((sum, token) => sum + (primary.includes(token) ? 5 : guide.includes(token) ? 1 : 0), 0);
      return { entry, score };
    }).filter(({ score }) => score > 0).sort((a, b) => b.score - a.score || a.entry.id.localeCompare(b.entry.id));
    const end = args.offset + args.limit;
    return {
      query: args.query, total: ranked.length, offset: args.offset,
      nextOffset: end < ranked.length ? end : null,
      results: ranked.slice(args.offset, end).map(({ entry }) => this.summary(entry)),
      matching: "Deterministic keyword search over metadata and bundled guidance, not semantic search.",
    };
  }

  get(input: unknown) {
    const { id, includeSource } = z.object(visualGetShape).parse(input);
    const entry = this.entries.find(candidate => candidate.id === id);
    if (!entry) throw new DesignError("UNKNOWN_VISUAL", `Unknown visual "${id}". Call search_design_visuals.`);
    return {
      ...this.summary(entry), limitations: entry.limitations,
      requirements: "Modern browser. No external dependencies. Save the HTML source to a file to render it; MCP only returns text.",
      validation: "Documented browser checks, not native-device, cross-browser or accessibility certification.",
      guide: entry.guide ? this.readFile(entry.guide).text : null,
      source: includeSource ? this.files.get(entry.html)!.text : null,
      sourceNotice: includeSource ? "Educational HTML/CSS/JavaScript. Check limitations for required local assets; source does not include asset binaries. Relative documentation links are not bundled inside the HTML; use guideUri or the original repository." : "Source omitted; set includeSource=true or read htmlUri.",
    };
  }

  readFile(file: string) {
    const entry = this.files.get(file);
    if (!entry) throw new DesignError("UNKNOWN_VISUAL_FILE", `Unknown bundled visual file "${file}".`);
    if (entry.mimeType === "text/html") return entry;
    const text = entry.text.replace(/\]\((\.\.?\/[^)]+)\)/gu, (_, target: string) => {
      const resolved = new URL(target, "https://github.com/acertainromance401/DESIGN/blob/main/docs/");
      const name = resolved.pathname.split("/").at(-1)!;
      return this.files.has(name)
        ? `](${uriFor(name)})`
        : `](${resolved.href})`;
    });
    return { ...entry, text };
  }
}

export async function loadVisualCatalog(root = new URL("../docs/", import.meta.url)): Promise<VisualCatalog> {
  const entries = z.array(definitionSchema).parse(definitions);
  if (new Set(entries.map(entry => entry.id)).size !== entries.length) throw new Error("Duplicate visual example ID.");
  const files = new Map<string, VisualFile>();
  for (const entry of entries) {
    for (const file of [entry.html, ...(entry.guide ? [entry.guide] : [])]) {
      if (files.has(file)) {
        if (file === entry.guide) continue;
        throw new Error(`Duplicate visual file: ${file}`);
      }
      const text = await readFile(new URL(file, root), "utf8");
      if (file.endsWith(".html") ? !/^<!doctype html>/iu.test(text) : !/^# /u.test(text)) {
        throw new Error(`Invalid or empty visual file: ${file}`);
      }
      files.set(file, { file, text, mimeType: file.endsWith(".html") ? "text/html" : "text/markdown" });
    }
  }
  return new VisualCatalog(entries, files);
}
