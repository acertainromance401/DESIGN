# 디자인 요소별 누적 분석

> 이 문서는 content/design-reuse.json·content/analyses와 시안 정의에서 생성합니다. 수정 후 npm run docs:designs를 실행하세요.


새 참고 예시의 관찰 결과를 예시별로 보존합니다. 앞으로 사용자가 제공하는 예시는 마음에 드는 디자인으로 받아들여 선호 레퍼런스로 축적합니다. 색감·레이아웃·폰트를 나누는 것은 선호를 유보하기 위해서가 아니라 구성과 재사용 원리를 추출하기 위해서입니다. AI가 고른 연구·재현 시안은 구분하고, 전체 디자인 선호와 추론한 요소별 선호 이유·공통 경향도 구분합니다. 이후 디자인에서는 관련 선호 기록을 먼저 찾아 활용합니다.

디자인 결정을 할 때는 [디자인 취향 프로필](<elements/design-preferences.md>)에서 관련 기준과 근거의 강도를 먼저 확인합니다.

[작성·등록·MCP 조회 방법](<../recording-analyses.md>) · [세부 분석 기준](<elements/analysis-scope.md>) · [JSON 작성 양식](<../../content/analysis-template.json>) · [기존 시안 기술 인벤토리](<../design-inventory.md>)

## 사용자 제공 레퍼런스 요소별 로그

| 항목별 문서 | 기록 수 | MCP 리소스 |

| --- | ---: | --- |

| [색감 분석](<../../designs/palettes/color-combinations.md#사용자-제공-레퍼런스-색감-분석>) | 11 | `design://analysis-logs/color` |

| [레이아웃 분석](<elements/layout.md>) | 7 | `design://analysis-logs/layout` |

| [폰트 분석](<elements/typography.md>) | 7 | `design://analysis-logs/typography` |

| [글자 배치 분석](<elements/text-placement.md>) | 7 | `design://analysis-logs/text-placement` |

| [인물·피사체 구도 분석](<elements/subject-composition.md>) | 5 | `design://analysis-logs/subject-composition` |

| [조명 분석](<elements/lighting.md>) | 4 | `design://analysis-logs/lighting` |

| [모션 분석](<elements/motion.md>) | 1 | `design://analysis-logs/motion` |

| [질감 분석](<elements/texture.md>) | 4 | `design://analysis-logs/texture` |

| [상호작용 분석](<elements/interaction.md>) | 0 | `design://analysis-logs/interaction` |

## 예시별 상세 보고서

전체 11건 / 분석 11건 / 초안 0건. 초안은 MCP 기본 검색에서 제외됩니다. 분석 상태도 개별 근거 밖의 렌더링·폰트 확인을 뜻하지 않습니다.

| 예시 | 상태 | 수정일 | 연결 시안 |

| --- | --- | --- | --- |

| [도트로 만든 두 얼굴 — 밝은 하프톤 모션의 색감·레이아웃·폰트](<halftone-talking-heads-study.md>) | analyzed | 2026-11-18 | 외부/독립 참고 |

| [Batica — 세 가지 바탕에서 반복한 타이포 스페시먼](<pinterest-batica-specimen.md>) | analyzed | 2026-11-18 | 외부/독립 참고 |

| [Blue Current — 수면을 담은 글자와 앞으로 뻗는 수영선수](<pinterest-blue-current.md>) | analyzed | 2026-11-18 | 외부/독립 참고 |

| [Bordo / Green / Cream — 보르도·짙은 청록·피치 크림](<pinterest-bordo-green-cream.md>) | analyzed | 2026-11-18 | 외부/독립 참고 |

| [Caesar Palette — 검정·버건디·흰색](<pinterest-caesar-burgundy.md>) | analyzed | 2026-11-18 | 외부/독립 참고 |

| [Coliner / Beyond — 블루 위에서 화면을 채우는 노란 글자](<pinterest-coliner-beyond.md>) | analyzed | 2026-11-18 | 외부/독립 참고 |

| [It’s Possible — 검은 바탕 위의 레드·블루 스펙트럼](<pinterest-its-possible-spectrum.md>) | analyzed | 2026-11-18 | 외부/독립 참고 |

| [Kyoto — 큰 지명과 도시 풍경에 우측 안내 띠를 붙인 여행 포스터](<pinterest-kyoto-travel-poster.md>) | analyzed | 2026-11-18 | 외부/독립 참고 |

| [Prompt — 흑백 인물 사진을 지면으로 쓴 패션 포스터](<pinterest-prompt-monochrome-portrait.md>) | analyzed | 2026-11-18 | 외부/독립 참고 |

| [Quantus Palette — 일렉트릭 바이올렛과 노랑](<pinterest-quantus-palette.md>) | analyzed | 2026-11-18 | 외부/독립 참고 |

| [The Edge — 제목 쪽으로 넘어오는 카누](<pinterest-the-edge-canoe.md>) | analyzed | 2026-11-18 | 외부/독립 참고 |

데이터와 보고서는 npm 배포 대상입니다. 개인 자산·기밀 원문·인증 URL을 넣지 않습니다.
