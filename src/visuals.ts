import { readFile } from "node:fs/promises";
import { z } from "zod";
import { DesignError } from "./catalog.js";
import { loadReuseData, reusePlatformSchema, visualPlanShape } from "./reuse.js";
import type { ReuseData, ReuseDesign } from "./reuse.js";
import { loadAnalysisCatalog } from "./analyses.js";
import type { AnalysisCatalog } from "./analyses.js";
import { loadTechnologyCatalog, searchTerms, type TechnologyCatalog } from "./technologies.js";

export const visualSearchShape = {
  query: z.string().trim().min(1).max(200).describe("Korean/English visual example keywords, e.g. 배색, 독서, ripple, 시트"),
  limit: z.number().int().min(1).max(10).default(5),
  offset: z.number().int().min(0).max(1000).default(0),
  family: z.string().regex(/^[a-z][a-z0-9-]*$/u).optional(),
  technology: z.string().regex(/^[a-z][a-z0-9-]*$/u).optional(),
  platform: reusePlatformSchema.optional().describe("Filter by documented adoption guidance, not native source availability"),
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
type VisualEntry = Definition & ReuseDesign;
type VisualFile = { file: string; path: string; text: string | null; mimeType: string; distribution: "bundled" | "local-only" };
const definitions: Definition[] = [
  {
    id: "ascii-character", title: "작은 방랑자 — ASCII 캐릭터",
    summary: "SDF로 생성한 입체 캐릭터를 저해상도 장면과 실제 문자 아틀라스의 두 패스로 문자화한다.",
    keywords: ["ascii", "캐릭터", "문자", "sdf", "webgl", "metal", "shader", "비", "게임"],
    html: "ascii-character.html",
    limitations: ["메시·본·스프라이트 시트가 아니라 GLSL 거리 함수다. Swift/게임 엔진에는 셰이더 재작성 또는 베이크가 필요하다.", "HTML뿐 아니라 renderer.js를 같은 상대 경로에 저장해야 한다."],
  },
  {
    id: "liquid-glass", title: "Liquid Glass — 광학 유리 컨트롤",
    summary: "SDF 곡면·굴절·Fresnel 반사와 실제 HTML 조작을 분리한 WebGL 2 유리 재질 연구.",
    keywords: ["유리", "굴절", "glass", "liquid", "fresnel", "webgl", "metal", "shader"],
    html: "liquid-glass.html",
    limitations: ["Apple 시스템 Liquid Glass의 구현이나 동등 품질 인증이 아니다.", "실제 서비스 동작이 아닌 재질·컨트롤 상태 시연이다. GPU 실패 시 CSS preview를 사용한다."],
  },
  {
    id: "slow-bookshop", title: "느린 서가 — 책 목업·독립서점",
    summary: "SVG 책의 종이 단면·책등·접촉 그림자와 건축 사진을 큰 제호에 겹친 2.5D 편집 시안.",
    keywords: ["서점", "책", "공간", "book", "svg", "종이", "개인 홈페이지"],
    html: "slow-bookshop.html",
    limitations: ["책은 2D SVG이며 회전 가능한 3D 모델이 아니다.", "공유 건축 사진은 CC BY-SA 4.0을 따른다. 실제 도서·판매 기능은 없다."],
  },
  {
    id: "midnight-cinema", title: "극장 여운 — SVG 객석",
    summary: "SVG 객석·광선·먼지와 CSS @property/:has 상태로 조명과 막을 전환하는 심야 극장.",
    keywords: ["극장", "객석", "영화", "조명", "cinema", "svg", "curtain"],
    html: "midnight-cinema.html",
    limitations: ["깊이와 광선은 2D 표현이다. 극장·영화·일정은 가상이며 예매 기능은 없다."],
  },
  {
    id: "midnight-cinema-3d", title: "극장 여운 — WebGL 3D 객석",
    summary: "내장 Three.js r187의 PBR 좌석·조명·그림자·연무 광선과 절차적 직물 재질, SVG 대안.",
    keywords: ["극장", "객석", "cinema", "three", "pbr", "3d", "조명", "roughness"],
    html: "midnight-cinema-3d.html",
    limitations: ["약 1MB HTML에 Three.js가 내장되어 있다. 엔진 MIT 고지를 유지한다.", "참고 사진은 런타임 자산이 아니며 네이티브/게임 장면으로 자동 변환되지 않는다."],
  },
  {
    id: "birthday", title: "생일 — 케이크·호흡·편지 흐름",
    summary: "3D 케이크·호흡 감지·오디오·화면 상태 전환을 연결한 로컬 전용 이벤트 시안.",
    keywords: ["생일", "케이크", "호흡", "마이크", "음악", "birthday", "audio", "gltf", "blender"],
    html: "birthday.html",
    limitations: ["개인 HTML·모듈·사진·음원·모델은 로컬 전용이며 npm에서 제외한다. 설치본에는 분석과 교체 가이드만 제공한다.", "권리 미확인 자산을 MIT로 재배포하지 않는다. 마이크 기능은 권한과 보안 컨텍스트가 필요하다."],
  },
  {
    id: "reference-house", title: "Forma — 건축 사진과 활자 스터디",
    summary: "Hotle의 가는 초대형 영문 제목·건축 사진 중첩·작은 설명의 비율을 연구한 지면. 실제 판스워스 하우스 사진을 대체 자산으로 사용.",
    keywords: ["레퍼런스", "조합", "미감", "건축", "공간", "여백", "중성색", "reference", "architecture", "editorial"],
    html: "reference-house.html", guide: "reference-studies.md",
    limitations: ["designs/shared/assets/reference-farnsworth-house.jpg와 출처 문서를 함께 보관해야 한다. Paul R. Burley의 CC BY-SA 4.0 사진 및 크롭·채도·전경 마스크 편집에 해당 라이선스가 적용된다. MCP는 사진 바이너리를 반환하지 않는다.", "가상의 편집 브랜드이며 사진 속 실제 건물은 미스 반 데어 로에의 설계다. Hotle 원본의 사진·서체·검정 외벽·저녁 조명을 재현한 것은 아니다."],
  },
  {
    id: "reference-object", title: "담 — 동계색 조명 제품 시안",
    summary: "주황색 제품 화면을 기준으로 작은 흰색 산세리프 제목·중앙의 큰 조명·오른쪽 제품 메모와 동계색 명암을 맞춘 지면.",
    keywords: ["레퍼런스", "조합", "미감", "제품", "조명", "주황", "동계색", "재질", "reference", "product", "tonal", "lamp"],
    html: "reference-object.html", guide: "reference-studies.md",
    limitations: ["제품은 독자적인 SVG 비례·재질 연구이며 실제 판매품이나 제조 사양이 아니다. 구매·주문 기능은 없다.", "원본 패딩·브랜드·카피를 사용하지 않았다. 원본 서체는 미확인으로 Arial 계열을 사용하며 확정된 개인 취향을 나타내지 않는다."],
  },
  {
    id: "reference-exhibition", title: "Fold — 무채색 편집 스튜디오 시안",
    summary: "SwissBrut의 반반 인물/활자 구도·넓은 은색 재질 이미지·회색/검정 대형 활자 목록. 원본에서 확인한 Be Vietnam Pro 900을 사용.",
    keywords: ["레퍼런스", "조합", "미감", "시각", "전시", "타이포", "무채색", "편집", "reference", "exhibition", "typography", "swissbrut"],
    html: "reference-exhibition.html", guide: "reference-studies.md",
    limitations: ["가상의 편집 스튜디오다. 원본 인물·사진·브랜드·문구는 사용하지 않았다. 사진은 기존 CC0 축구 사진의 확대 크롭이며 초상권·상표권을 보장하지 않는다.", "designs/shared/assets/sports-soccer-cc0.jpg, be-vietnam-pro-black.ttf, be-vietnam-pro-OFL.txt를 함께 보관한다. 폰트는 SIL OFL 1.1이다. MCP는 사진·폰트 바이너리를 반환하지 않는다."],
  },
  {
    id: "reference-sport", title: "후반전 — 적색 활자와 인물 컷아웃 포스터",
    summary: "복싱 포스터의 세로 비율·길고 큰 적색 압축 활자·그 앞에 겹친 인물 컷아웃·따뜻한 종이 질감을 연구한 축구 포스터.",
    keywords: ["레퍼런스", "조합", "미감", "스포츠", "편집", "포스터", "적색", "종이", "reference", "sports", "paper", "red"],
    html: "reference-sport.html", guide: "reference-studies.md",
    limitations: ["HTML과 패키지의 designs/shared/assets/sports-soccer-cc0.jpg를 함께 보관해야 한다. MCP HTML 조회는 사진 바이너리를 전달하지 않는다.", "원본 서체는 미확인으로 로컬 Impact를 근사 사용한다. 미설치 환경은 인상이 다르다. 기존 CC0 축구 사진의 수동 마스크이며 초상권·상표권이나 실제 팀·선수의 후원·추천을 보장하지 않는다."],
  },
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
    limitations: ["HTML과 패키지의 designs/shared/assets/sports-soccer-cc0.jpg를 함께 보관해야 한다. MCP HTML 조회는 사진 바이너리를 전달하지 않는다.", "참고 핀 원본은 저장하지 않았다. 사용 사진은 CC0지만 초상권·상표권까지 허가하지 않으며 실제 팀 홍보물이 아니다.", "인물 마스크는 수동 SVG 윤곽으로 정밀한 머리카락 제거가 아니다."],
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
export class VisualCatalog {
  constructor(
    public readonly entries: readonly VisualEntry[],
    public readonly files: ReadonlyMap<string, VisualFile>,
    public readonly reuse: ReuseData,
    public readonly sources: ReadonlyMap<string, VisualFile>,
    public readonly analyses: AnalysisCatalog,
    public readonly technologies: TechnologyCatalog,
  ) {}

  private evidence(usage: ReuseDesign["technologies"][number]) {
    return {
      ...usage,
      sourceUri: this.sources.get(usage.location)?.text ? `design://source-files/${usage.location}` : null,
    };
  }

  private summary(entry: VisualEntry) {
    return {
      id: entry.id, title: entry.title, summary: entry.summary,
      platform: "web", sourceKind: "visual-example",
      family: entry.family, path: entry.path, legacyPath: entry.legacyPath,
      technologies: entry.technologies.map(item => item.id),
      adoptionPlatforms: this.reuse.platforms.map(item => item.id),
      htmlUri: this.files.get(entry.html)?.text ? uriFor(entry.html) : null,
      guideUri: entry.guide ? uriFor(entry.guide) : null,
      sourceAvailable: this.files.get(entry.html)?.text !== null,
      distribution: entry.distribution,
      analysisCount: this.analyses.forVisual(entry.id).length,
    };
  }

  list() {
    return {
      exampleCount: this.entries.length, fileCount: this.files.size,
      uri: "design://visual-examples",
      examples: this.entries.map(entry => ({ ...this.summary(entry), keywords: entry.keywords })),
      families: this.reuse.families.map(family => ({
        ...family, count: this.entries.filter(entry => entry.family === family.id).length,
        uri: `design://families/${family.id}`,
      })),
      technologies: this.reuse.technologies.map(({ id, title, keywords }) => ({ id, title, keywords, uri: `design://technologies/${id}` })),
      technologyLibrary: this.technologies.index(),
      platforms: this.reuse.platforms.map(({ id, title }) => ({ id, title, uri: `design://platforms/${id}` })),
      reuseUri: "design://reuse-catalog",
      analysisLibrary: this.analyses.list(),
      guidance: "Separate visual examples, not additions to the 186 pattern catalog. Search with search_design_visuals; fetch with get_design_visual. HTML source is not rendered by MCP; save it as an HTML file and open it in a browser.",
    };
  }

  search(input: unknown) {
    const args = z.object(visualSearchShape).parse(input);
    if (args.family && !this.reuse.families.some(item => item.id === args.family)) {
      throw new DesignError("UNKNOWN_FAMILY", `Unknown family "${args.family}". Call list_design_categories.`);
    }
    if (args.technology) this.getTechnology(args.technology);
    const query = searchTerms(args.query);
    const ranked = this.entries.filter(entry =>
      (!args.family || entry.family === args.family) &&
      (!args.technology || entry.technologies.some(item => item.id === args.technology)),
    ).map(entry => {
      const technologyText = entry.technologies.map(usage => {
        const technology = this.reuse.technologies.find(item => item.id === usage.id)!;
        return `${technology.title} ${technology.keywords.join(" ")} ${usage.application}`;
      }).join(" ");
      const primary = `${entry.id} ${entry.title} ${entry.summary} ${entry.keywords.join(" ")} ${entry.technologies.map(item => item.application).join(" ")} ${entry.reusableParts.join(" ")}`.normalize("NFKC").toLowerCase();
      const related = technologyText.normalize("NFKC").toLowerCase();
      const analysis = this.analyses.searchText(entry.id).normalize("NFKC").toLowerCase();
      const guide = entry.guide ? this.files.get(entry.guide)!.text!.normalize("NFKC").toLowerCase() : "";
      const score = query.reduce((sum, token) => sum + (primary.includes(token) ? 5 : guide.includes(token) || analysis.includes(token) ? 2 : related.includes(token) ? 1 : 0), 0);
      return { entry, score };
    }).filter(({ score }) => score > 0).sort((a, b) => b.score - a.score || a.entry.id.localeCompare(b.entry.id));
    const end = args.offset + args.limit;
    return {
      query: args.query, total: ranked.length, offset: args.offset,
      targetPlatform: args.platform ?? null,
      platformMeaning: "Documented adoption guidance only. Executable visual sources are web implementations, not native components.",
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
      requirements: entry.requirements,
      technologies: entry.technologies.map(usage => ({ ...this.evidence(usage), uri: `design://technologies/${usage.id}` })),
      reusableParts: entry.reusableParts,
      referenceAnalyses: this.analyses.forVisual(entry.id).map(record => this.analyses.summary(record)),
      adaptation: { apple: entry.native, game: entry.game },
      assets: this.reuse.assets.filter(asset => entry.assetIds.includes(asset.id)),
      sourceFiles: [...new Set([entry.path, ...entry.sourceFiles, ...entry.technologies.map(usage => usage.location)])].map(file => {
        const source = this.sources.get(file)!;
        return { path: file, available: source.text !== null, distribution: source.distribution, uri: source.text === null ? null : `design://source-files/${file}` };
      }),
      validation: { level: "Source analysis and repository tests; not native-device, cross-browser or accessibility certification.", checks: entry.checks },
      guide: entry.guide ? this.readFile(entry.guide).text : null,
      source: includeSource ? this.files.get(entry.html)!.text : null,
      sourceNotice: this.files.get(entry.html)!.text === null
        ? "LOCAL_ONLY_SOURCE_UNAVAILABLE: This package includes analysis only. Personal source and assets are intentionally excluded; replace them with authorized project assets."
        : includeSource ? "Save HTML at path and fetch sourceFiles at their declared paths, preserving relative imports. Binary assets are not returned by MCP; use authorized bundled files or replacements. Do not copy only HTML for multi-file examples." : "Source omitted; set includeSource=true or read htmlUri. Fetch declared modules separately.",
    };
  }

  getTechnology(id: string) {
    const technology = this.technologies.get(id);
    if (technology.status === "candidate") return {
      ...technology, examples: [], references: [technology.reference],
      implementationStatus: "Candidate guidance only. No declared visual sample, environment inspection or tool execution.",
    };
    return {
      ...technology,
      examples: this.entries.filter(entry => entry.technologies.some(item => item.id === id))
        .map(entry => ({ ...this.summary(entry), usage: this.evidence(entry.technologies.find(item => item.id === id)!) })),
      implementationStatus: "Web evidence and porting guidance. Native/game code is not supplied.",
    };
  }

  getPlatform(id: string) {
    const platform = this.reuse.platforms.find(item => item.id === id);
    if (!platform) throw new DesignError("UNKNOWN_PLATFORM", `Unknown adoption platform "${id}".`);
    return { ...platform, uri: `design://platforms/${id}`, implementationStatus: "Adoption guidance, not a compiled or tested native/game implementation." };
  }

  getFamily(id: string) {
    const family = this.reuse.families.find(item => item.id === id);
    if (!family) throw new DesignError("UNKNOWN_FAMILY", `Unknown family "${id}".`);
    return { ...family, examples: this.entries.filter(entry => entry.family === id).map(entry => this.summary(entry)) };
  }

  plan(input: unknown) {
    const args = z.object(visualPlanShape).parse(input);
    const platform = this.getPlatform(args.platform);
    const apple = ["swiftui", "metal", "realitykit"].includes(args.platform);
    return {
      projectType: args.projectType, targetPlatform: args.platform, platform,
      targetInspection: "Not performed. The connected client must inspect, implement and test the external project.",
      preservation: args.projectType === "existing"
        ? "Inspect existing tokens, renderer, assets, state, tests and user edits; preserve behavior and apply only selected parts."
        : "Choose purpose, target OS/engine, key actions, asset rights and performance budget before implementation.",
      selections: args.visualIds.map(id => {
        const entry = this.entries.find(item => item.id === id);
        if (!entry) throw new DesignError("UNKNOWN_VISUAL", `Unknown visual "${id}". Call search_design_visuals.`);
        return {
          ...this.get({ id }),
          targetAdaptation: args.platform === "web" ? "Reuse selected source parts and replace fictional content; preserve declared file paths and dependencies." : apple ? entry.native : entry.game,
          technologySteps: entry.technologies.map(usage => {
            const technology = this.getTechnology(usage.id);
            if (technology.status !== "source-backed") throw new Error(`Missing implementation evidence: ${usage.id}`);
            return { id: usage.id, evidence: usage, action: technology[args.platform === "web" ? "web" : apple ? "apple" : "game"], checks: technology.checks };
          }),
        };
      }),
      completion: ["Read linked referenceAnalyses for independent color, layout and typography evidence; drafts are not completed analyses.",
        "Resolve sourceFiles and asset distribution before copying.", ...platform.workflow, ...platform.validation,
        "Report actual edits, executed checks, visual verification and unresolved rights/API assumptions separately."],
      limitations: ["No target files were read, written or validated.", "Native and game mappings are guidance only; HTML is not an automatically converted component."],
    };
  }

  readSource(file: string) {
    const source = this.sources.get(file);
    if (!source) throw new DesignError("UNKNOWN_SOURCE_FILE", `Unknown allowlisted source file "${file}".`);
    if (source.text === null) throw new DesignError("LOCAL_ONLY_SOURCE_UNAVAILABLE", `Local-only source "${file}" is not included in this package.`);
    return { ...source, text: source.text };
  }

  readFile(file: string) {
    const entry = this.files.get(file);
    if (!entry) throw new DesignError("UNKNOWN_VISUAL_FILE", `Unknown bundled visual file "${file}".`);
    if (entry.text === null) throw new DesignError("LOCAL_ONLY_SOURCE_UNAVAILABLE", `Local-only visual "${file}" is not included in this package.`);
    if (entry.mimeType === "text/html") return { ...entry, text: entry.text };
    const text = entry.text.replace(/\]\((\.\.?\/[^)]+)\)/gu, (_, target: string) => {
      const resolved = new URL(target, `https://github.com/acertainromance401/DESIGN/blob/main/${entry.path}`);
      const name = resolved.pathname.split("/").at(-1)!;
      return this.files.has(name)
        ? `](${uriFor(name)})`
        : `](${resolved.href})`;
    });
    return { ...entry, text };
  }
}

export async function loadVisualCatalog(root = new URL("../", import.meta.url)): Promise<VisualCatalog> {
  const reuse = await loadReuseData(root);
  const entries = z.array(definitionSchema).parse(definitions).map(entry => {
    const mapping = reuse.designs.find(item => item.id === entry.id);
    if (!mapping) throw new Error(`Missing reuse mapping: ${entry.id}`);
    if (mapping.path.split("/").at(-1) !== entry.html) throw new Error(`Visual filename mismatch: ${entry.id}`);
    return { ...entry, ...mapping };
  });
  if (new Set(entries.map(entry => entry.id)).size !== entries.length) throw new Error("Duplicate visual example ID.");
  if (entries.length !== reuse.designs.length) throw new Error("Unregistered reuse design.");
  const files = new Map<string, VisualFile>();
  const sources = new Map<string, VisualFile>();
  async function load(file: string, distribution: VisualFile["distribution"]): Promise<VisualFile> {
    const existing = sources.get(file);
    if (existing) return existing;
    let text: string | null;
    try {
      text = await readFile(new URL(file, root), "utf8");
    } catch (error) {
      if (distribution !== "local-only" || !(error instanceof Error) || !("code" in error) || error.code !== "ENOENT") throw error;
      text = null;
    }
    if (text !== null && (!text.trim() ||
      (file.endsWith(".html") && !/^<!doctype html>/iu.test(text)) ||
      (file.endsWith(".md") && !/^# /u.test(text)))) throw new Error(`Invalid or empty visual file: ${file}`);
    const mimeType = file.endsWith(".html") ? "text/html" : file.endsWith(".md") ? "text/markdown" : "text/javascript";
    const source = { file, path: file, text, mimeType, distribution };
    sources.set(file, source);
    return source;
  }
  for (const file of reuse.supportFiles) await load(file, "bundled");
  for (const entry of entries) {
    for (const file of [entry.html, ...(entry.guide ? [entry.guide] : [])]) {
      if (files.has(file)) {
        if (file === entry.guide) continue;
        throw new Error(`Duplicate visual file: ${file}`);
      }
      const sourcePath = file === entry.html ? entry.path : reuse.guidePaths[file];
      if (!sourcePath) throw new Error(`Missing guide path: ${file}`);
      const source = await load(sourcePath, file === entry.html ? entry.distribution : "bundled");
      files.set(file, { ...source, file });
    }
    for (const file of entry.sourceFiles) await load(file, entry.distribution);
  }
  const analyses = await loadAnalysisCatalog(root, new Set(entries.map(entry => entry.id)));
  const technologies = await loadTechnologyCatalog(root, reuse);
  return new VisualCatalog(entries, files, reuse, sources, analyses, technologies);
}
