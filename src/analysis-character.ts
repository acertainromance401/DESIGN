import { z } from "zod";

export const characterUri = "design://analysis-character";
export const characterDimensions = ["mood", "style", "feel", "impression"] as const;
export type CharacterDimension = typeof characterDimensions[number];
export const characterRubric: Record<CharacterDimension, { title: string; question: string; boundary: string }> = {
  mood: {
    title: "분위기",
    question: "장면 전체의 정서·공기와 긴장을 만드는 요소의 조합은 무엇인가?",
    boundary: "어두운 색 하나로 우울함을 확정하지 않는다. 주된 정서와 이를 누르거나 뒤집는 요소를 구분한다.",
  },
  style: {
    title: "스타일",
    question: "어떤 조형 규칙(형태·그리드·조판·이미지 처리 등)이 반복되고 어떤 양식과 닮았는가?",
    boundary: "양식명은 닮은 점과 어긋나는 점을 설명할 수 있을 때만 붙인다. 시대·장르·제작 기법·작가의 의도를 외형으로 확인하지 않는다.",
  },
  feel: {
    title: "느낌",
    question: "표면·무게·거리·시선 이동·템포가 어떤 감각적 인상을 주는가?",
    boundary: "만졌을 때의 물성이나 실제 동작이 아니라 보이는 단서를 해석한다. 정지 이미지에서 촉감·실제 속도·조작감을 확정하지 않는다.",
  },
  impression: {
    title: "인상",
    question: "해당 뷰나 프레임에서 먼저 들어오는 것은 무엇이고, 이어 무엇이 읽히며 어떤 이미지가 남을 법한가?",
    boundary: "제시된 화면의 위계를 근거로 시선 순서를 추정한다. 실제 관람자의 시선·반응이나 브랜드 의도를 측정한 것처럼 쓰지 않는다.",
  },
};

const label = z.string().trim().min(1).max(80);
const detail = z.string().trim().min(1).max(600);
const assessment = <Axis extends string>(axes: readonly [Axis, ...Axis[]]) => z.discriminatedUnion("certainty", [
  z.strictObject({
    certainty: z.literal("estimated"),
    label,
    reasoning: detail,
    observations: z.array(z.strictObject({ axis: z.enum(axes), topic: detail })).min(1).max(8),
  }),
  z.strictObject({ certainty: z.literal("unknown"), reason: detail }),
]);

export function designCharacterSchema<Axis extends string>(axes: readonly [Axis, ...Axis[]]) {
  const dimension = assessment(axes);
  return z.strictObject({
    viewedState: detail.describe("Inspected frame, viewport, or interaction state; not a claim about unseen views."),
    mood: dimension, style: dimension, feel: dimension, impression: dimension,
    useCases: z.array(z.strictObject({
      dimensions: z.array(z.enum(characterDimensions)).min(1).max(characterDimensions.length),
      context: detail, goal: detail, preserve: detail, adapt: detail, avoidWhen: detail, verify: detail,
    })).max(5),
  });
}

export const characterMethod = [
  "대상 자료를 직접 열고 범위를 명시한다. 요소별 분석에서 본 것(관찰), 그것이 어떻게 작용하는지(해석), 다른 작업에서 무엇을 시도할지(활용)를 분리한다.",
  "estimated에는 인상 요약(label), 요소 사이의 관계를 설명하는 reasoning, 사전에 기록한 관찰의 axis와 topic을 붙인다. 같은 사진이라도 서로 다른 관찰을 연결할 수 있다. 분위기에는 두 개 이상의 다른 관찰을 쓴다.",
  "판단할 수 없는 차원은 unknown과 이유만 남긴다. 근거가 없는 강도 점수, 확인하지 않은 모션·저자 의도, 감상자의 실제 반응을 만들어내지 않는다.",
  "활용은 차원과 연결하고 맥락·목표·유지할 관계·바꿀 표현·피할 조건·검수를 명시한다. 원본 스타일 전체나 특정 자산을 복제하라는 뜻이 아니다.",
  "전체 레퍼런스 선호나 이 분석의 해석을 사용자의 개별 분위기 선호로 승격하지 않는다.",
];

export function characterGuide() {
  return {
    rubric: characterRubric, method: characterMethod, rubricUri: characterUri,
    schemaUri: "design://analysis-schema", workflowUri: "design://analysis-workflow",
    notice: "The client inspects the design and authors interpretations. This tool verifies observation links and structure, not the truth of visual claims. It does not open URLs, run vision, or save records.",
  };
}
