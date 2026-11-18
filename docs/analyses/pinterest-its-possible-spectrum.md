# It’s Possible — 검은 바탕 위의 레드·블루 스펙트럼

> 이 문서는 content/design-reuse.json·content/analyses와 시안 정의에서 생성합니다. 수정 후 npm run docs:designs를 실행하세요.


큰 검은 면 사이에서 레드·오렌지와 전기 블루·시안이 맞선다. 라임·노랑은 일부 전환을 더 밝게 만든다.

상태: **analyzed** · 작성 2026-11-18 · 수정 2026-11-18

참고자료: url / `https://www.pinterest.com/pin/1102819027539573479/`

2026-11-18 사용자가 마음에 드는 색 조합으로 제공했다. 선호와 분석의 범위는 공개 미리보기의 색감으로 한정한다.

실행 HTML과 연결하지 않은 독립 참고자료입니다.

데이터: [pinterest-its-possible-spectrum.json](<../../content/analyses/pinterest-its-possible-spectrum.json>) · MCP: `design://analyses/pinterest-its-possible-spectrum` · [전체 분석](./README.md)

**분석 범위:** 색감 분석.

**사용자가 지정한 선호 범위:** `color.palette-roles`, `color.temperature-saturation`.

## 색감 분석

검정이 넓은 바탕을 맡고 고채도 적색과 청색이 대비된다. 시안·라임·노랑이 일부 경계에서 더 밝게 이어져 단색 스와치보다 빛에 가까운 인상이 난다.

| 역할 | 값 | 확인 수준 | 근거 |

| --- | --- | --- | --- |

| 어두운 바탕 표본 | #000000 | estimated | raster-samples |

| 선명한 레드 표본 | #EC010B | estimated | raster-samples |

| 전기 블루 표본 | #0168E5 | estimated | raster-samples |

| 시안 경계 표본 | #02CDE5 | estimated | raster-samples |

| 라임에서 녹색으로 이어지는 영역의 표본 | #07DD05 | estimated | raster-samples |

### 관찰과 근거

**팔레트와 역할** · `color.palette-roles`

- **넓은 검정과 움직여 보이는 색 띠** (estimated): 검은 영역은 채도가 높은 띠를 서로 분리하는 바탕이다. 레드 #EC010B와 블루 #0168E5는 띠의 일부를 대표하는 표본이며 띠 전체가 단색인 것은 아니다. · 근거: pin-preview, raster-samples

**색온도와 채도** · `color.temperature-saturation`

- **따뜻한 레드·오렌지와 차가운 블루·시안** (confirmed): 시각 중심의 고채도 색은 따뜻한 적색·주황과 차가운 블루·시안으로 갈린다. 시안과 라임·노랑으로 밝아지는 구간은 일부 경계와 우측 상단에서 보인다. · 근거: pin-preview


### 색감 재사용

- 어두운 면을 남겨 두고 검정과 선명한 웜·쿨 색이 만나는 관계를 비교한다. 미리보기의 연속적인 색 변화나 표본 HEX를 모든 면에 고정하지 않는다.


### 근거 목록

- **pin-preview** / image / `https://i.pinimg.com/736x/69/2b/d7/692bd7e6f8ff31e25b4bed1f8bee227a.jpg`: 736×1308px 공개 JPEG. 어두운 면, 레드·블루와 시안·라임이 교차하는 영역을 확인했다.
- **raster-samples** / image / `https://i.pinimg.com/736x/69/2b/d7/692bd7e6f8ff31e25b4bed1f8bee227a.jpg`: 좌상단 원점 기준 (55,20), (706,770), (599,737), (587,142), (660,140) 중심 7×7px의 RGB 채널별 중앙값이다. 공식 스와치가 아니며 전환색은 위치에 따라 달라진다.


### 한계·미검증

- HEX는 JPEG의 국소 표본으로 제작 소스의 팔레트가 아니다. 색감 이외의 요소와 실제 동작은 분석하지 않았고 원본 이미지는 저장하지 않았다.
