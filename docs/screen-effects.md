# 앱 화면 효과 목록과 시각 예시

[HTML 갤러리](./screen-effects.html)에 **32개 시연**을 넣었다. 기존 배경·모션·조작 지침에 흩어진 항목을 모으고, 페이드·슬라이드·리플·카드 뒤집기·포인터 틸트·시차 스크롤·고정 헤더·쉬머처럼 이름으로 찾기 쉬운 항목도 추가했다.

화면 효과는 계속 조합하고 새로 만들 수 있어 완전한 목록은 아니다. 아래는 앱에서 자주 검토하는 범위다. 시각 효과, 기능 상태, 실제 입력 동작을 구분해서 기록했다.

## 보는 방법

- 처음에는 자동으로 움직이지 않는다. 각 표본의 **실행 / 전환**을 누른다. **초기화**는 내용과 순서까지 기본 상태로 돌린다.
- **효과 사용**을 끄면 전체를 기본 상태로 초기화한다. 모달·시트는 효과가 없어도 열리고 닫힌다.
- **동작 줄이기** 또는 OS의 Reduce Motion이 켜지면 이동·입자·회전 애니메이션 없이 결과 상태를 표시한다. 정적 그림자·색·블러는 별도의 시각 표현이다.
- **움직임 정지**는 애니메이션과 포인터 추적을 멈추고 결과 상태를 남긴다. 다시 실행하면 해당 표본만 재개한다. 숨김 탭에서도 움직임을 정지한다.
- 스크롤 표본은 안쪽 영역을 직접 스크롤할 수 있다. 실행 버튼도 같은 구획으로 이동한다. 드래그·스와이프에는 실행 버튼 대안이 있다.
- 모달과 시트는 실제 네이티브 `dialog`로 열린다. Escape·닫기 버튼으로 닫고 실행 버튼에 포커스를 돌려준다. 팝오버는 표본 안에 배치한 비모달 안내다.
- JavaScript가 없으면 시연 대신 문서 링크와 안내를 표시한다. 외부 폰트·이미지·라이브러리는 없다. 그레인은 직접 정의한 인라인 SVG 질감이다.

## 시각화한 32개

기존 ID는 MCP 지침과의 연결이다. **보충 항목**은 이번 문서에 추가한 분류이며 새 MCP 패턴 ID가 아니다. 같은 기존 지침에서 둘 이상의 시각 예시를 만들기도 했다.

| 효과 | 시연 내용 | 기존 지침 또는 보충 분류 | 적용할 때 |
| --- | --- | --- | --- |
| [그라데이션](./screen-effects.html#gradient) | 방사형 색면 겹침 | `effect.gradient-fields` | 본문 뒤는 안정된 불투명 면을 둔다. |
| [그레인](./screen-effects.html#grain) | 정적 종이 질감 | `effect.noise-grain` | 작은 글자·입력칸에 강한 노이즈를 깔지 않는다. |
| [그림자·고도](./screen-effects.html#shadow) | 다층 그림자 켜기 | `effect.layered-shadows` | 경계와 배경 차이도 남긴다. |
| [반투명·블러](./screen-effects.html#glass) | 배경 재질 비교 | `theme.translucent-material` | 실제 기기의 투명도 줄이기·GPU 비용은 별도 확인한다. |
| [클립·컷아웃](./screen-effects.html#mask) | 도형 윤곽 자르기 | `effect.masks-clipping` | 핵심 이미지와 포커스를 자르지 않는다. |
| [스포트라이트](./screen-effects.html#spotlight) | 고정 빛·포인터 추적 | `effect.spotlight-blend` | 터치·키보드에서는 고정 빛만으로도 같은 정보를 제공한다. |
| [컨페티](./screen-effects.html#confetti) | 입자 16개, 850ms | `effect.particles` | 실제 완료 뒤에 짧게 쓰고 반복하지 않는다. |
| [글로우](./screen-effects.html#glow) | 표면 바깥 빛 번짐 | 보충 항목 | 글자·포커스를 빛 번짐에 의존하지 않게 한다. |
| [페이드](./screen-effects.html#fade) | 450ms 투명도 변화 | 보충 항목 | 콘텐츠를 애니메이션 성공까지 숨기지 않는다. |
| [슬라이드](./screen-effects.html#slide) | 30px 이동 | 보충 항목 | 정보 관계를 설명하는 작은 거리부터 검토한다. |
| [순차 등장](./screen-effects.html#stagger) | 3행, 최대 지연 140ms | `animation.stagger-budget` | 긴 목록에서 지연을 무한 누적하지 않는다. |
| [탄성 이동](./screen-effects.html#spring) | 작은 오버슈트 | `animation.spring-interruption` | 이번 예시는 키프레임 근사다. 물리 스프링과 중간 속도 보존은 구현하지 않았다. |
| [형태 모핑](./screen-effects.html#morph) | 사각형 ↔ 원 | `animation.path-and-morph` | 상태 이름은 모양과 별도로 전달한다. |
| [선 그리기](./screen-effects.html#stroke) | SVG 경로 드러내기 | `animation.path-and-morph` | 선을 실제 저장 성공으로 오인시키지 않는다. |
| [카드 → 상세](./screen-effects.html#shared) | 동일 요소의 위치·크기 변화 | `animation.shared-element` | 이번 예시는 로컬 FLIP 전환이다. 라우팅·복제 화면이 아니다. |
| [카드 뒤집기](./screen-effects.html#flip) | 회전과 표면색 변경 | 보충 항목 | 실제 앞·뒷면 콘텐츠가 있다면 숨겨진 면의 포커스도 관리한다. |
| [눌림 피드백](./screen-effects.html#press) | 표본 크기 축소 | `interaction.press-hover-focus` | 실제 실행 버튼의 hit area는 유지한다. |
| [리플](./screen-effects.html#ripple) | 원이 한 번 퍼짐 | 보충 항목 | 터치 결과의 보조 신호이며 성공 보장은 아니다. |
| [선택 표시 이동](./screen-effects.html#indicator) | 좌우 표시 이동 | 보충 항목 | 실제 탭에는 키보드 탐색·선택 의미·패널 연결도 필요하다. |
| [포인터 틸트](./screen-effects.html#tilt) | 제한된 3D 기울기 | 보충 항목 | 커서 숨김·큰 회전 없이 장식으로만 사용한다. |
| [드래그 정렬](./screen-effects.html#drag) | 첫 행을 맨 뒤로 이동 | `interaction.drag-drop` | 시연은 첫 행만 드래그 가능하다. 버튼 대안과 DOM 순서를 유지한다. |
| [스와이프 노출](./screen-effects.html#swipe) | 행 아래 보조 영역 표시 | `interaction.swipe-actions` | 이 예시는 행동 노출만 시연한다. 실제 삭제·복구는 없다. |
| [스크롤 리빌](./screen-effects.html#reveal) | 다음 구획 등장 | `animation.scroll-reveal-general` | 기본 상태에서도 내용이 보인다. |
| [시차 스크롤](./screen-effects.html#parallax) | 배경만 느리게 이동 | 기존 WEASHION `motion.cover-parallax` 참조·범용 보충 | 이동을 60px로 제한하고 동작 줄이기에서는 고정한다. |
| [고정 헤더](./screen-effects.html#sticky) | 로컬 헤더 sticky | 보충 항목 | 확대·좁은 화면에서 내용을 과도하게 가리지 않게 한다. |
| [스켈레톤](./screen-effects.html#skeleton) | 자리표시자 ↔ 콘텐츠 | `state.skeleton` | 실제 준비 상태에 연결하고 오류·빈 결과도 구분한다. |
| [쉬머](./screen-effects.html#shimmer) | 빛이 한 번 지나감 | `state.skeleton`의 보충 표현 | 로딩을 과장하거나 끝없이 반복하지 않는다. |
| [진행률](./screen-effects.html#progress) | 버튼마다 25% 증가 | `state.progress` | 이 수치는 수동 시연이다. 앱에서는 실제 측정값이나 불확정 상태를 쓴다. |
| [토스트](./screen-effects.html#toast) | 비차단 시연 알림 | `overlay.toast` | 결과는 한 번 알리고 자동 만료에 중요한 행동을 가두지 않는다. |
| [모달](./screen-effects.html#modal) | 중앙 dialog | `overlay.modal-dialog` | 초기 포커스·포커스 유지·닫기·호출자 복귀를 관리한다. |
| [하단 시트](./screen-effects.html#sheet) | 하단 dialog | `overlay.bottom-sheet` | 이번 예시에 네이티브 높이 단계·시트 드래그는 없다. |
| [앵커 팝오버](./screen-effects.html#popover) | 비모달 보조 설명 | `overlay.popover` | 트리거 연결·Escape·좁은 화면 경계를 확인한다. |

## 함께 알아둘 다른 종류

아래도 화면 효과를 설계할 때 검토할 수 있다. **문서에 추가한 항목이며 위 갤러리에 실행 시연이 있는 것은 아니다.** 구현 난도나 네이티브 동작을 짧은 CSS 표본으로 숨기지 않았다.

| 종류 | 목적·사용 조건 | 구현과 한계 |
| --- | --- | --- |
| 공유 축·줌 스루 전환 | 단계의 앞뒤 관계, 목록 ↔ 세부 구분 | 큰 확대·카메라 이동은 Reduce Motion에서 즉시 전환한다. |
| 크로스페이드·디졸브 | 이미지·배경 교체 | 두 화면이 겹치는 중간 상태의 대비와 중복 접근성 노드를 확인한다. |
| 인터랙티브 뒤로가기 | 손가락 이동에 따라 화면 복귀 | 취소·완료·내비게이션 데이터와 네이티브 제스처 충돌을 관리한다. |
| 패럴랙스 헤더·대형 제목 축소 | 스크롤에 따른 정보 밀도 변경 | 고정 헤더와 별개다. 스크롤마다 큰 레이아웃 재계산을 피한다. |
| 스크롤 스냅·페이지 전환 | 캐러셀·페이지형 탐색 | 키보드 이동, 현재 페이지, 확대 상태와 강제 스냅 충돌을 검토한다. |
| 당겨서 새로고침·러버밴드 | 갱신 제스처와 경계 도달 피드백 | 기존 `interaction.pull-refresh`. 네트워크 결과와 연결하고 갱신 버튼도 둔다. |
| 마그네틱 포인터·커서 트레일 | 포인터 주변 장식 반응 | 기본 커서·버튼 위치는 유지한다. 터치·키보드에 필수 정보를 숨기지 않는다. |
| 메시·오로라·유동 그라데이션 | 복잡한 색면 흐름 | 정적 CSS 겹침과 진짜 메시 보간은 다르다. 움직이는 배경은 정지·불투명 대안이 필요하다. |
| 블렌드·색수차·듀오톤 | 사진·표지 분위기 | 본문·상태 영역과 분리한다. 색수차·왜곡은 짧고 선택적으로 사용한다. |
| 디스플레이스먼트·물결·굴절 | 물·유리 같은 이미지 왜곡 | SVG 필터·Canvas·셰이더 구현이 필요하다. 개인정보 가리기 기능이 아니다. |
| 소프트 양각·음각 | 눌린 표면이나 재질감 | 기존 `style.neumorphism`. 낮은 대비의 그림자만으로 조작 경계를 만들지 않는다. |
| 스크림·포커스 디밍 | 중요 영역 밖의 배경 어둡게 하기 | modal backdrop과 비모달 안내를 구분한다. 숨겨진 조작 가능 요소의 포커스를 관리한다. |
| 오류 흔들기·성공 아이콘 전환 | 실제 실패·완료의 보조 신호 | 문구·복구 경로가 먼저다. 반복 흔들기나 실패 전 성공 모션을 피한다. |
| 낙관적 갱신·롤백 | 서버 대기 중 즉시 반영 | 기존 `state.optimistic-update`. 실패 시 데이터와 화면을 함께 복원한다. 단순 애니메이션이 아니다. |
| 숫자 카운트업·차트 전환 | 값 변화와 비교 관계 | 실제 값은 즉시 접근 가능하게 한다. 금융·진행 값에 의미 없는 탄성이나 가짜 상승을 넣지 않는다. |
| 복사 피드백 | 복사 결과 확인 | 기존 `interaction.copy-feedback`. Clipboard API 성공 후에만 복사됨을 표시한다. |
| 툴팁·맥락 도움말 | 보조 설명 | 기존 `overlay.tooltip`. hover뿐 아니라 focus·터치 대안·닫기 정책이 필요하다. |
| 햅틱·사운드 | 촉각·청각 보조 피드백 | 기존 `interaction.haptic-semantics`. 웹 진동은 Apple 햅틱과 다르며 장치 지원도 제한된다. 소리도 명시적 선택을 존중한다. |
| 3D 조명·재질·피사계 심도 | 제품·공간 보기 | 기존 공간·3D 지침 참고. CSS 틸트는 3D 렌더 엔진이 아니며 실제 기기 품질·발열을 검사한다. |

## 적용·검증

- 2026-11-07, 통합 Chromium 브라우저에서 32개 표본의 실행·초기화와 JavaScript 오류 없음을 확인했다. 320px·390px·768px·1440px의 가로 넘침, 진행률 100% 상한·초기화, 드래그 이동 미리보기·DOM 순서, 분류 전환 시 숨긴 표본 초기화, 팝오버의 연결·Escape를 확인했다.
- 페이지와 OS의 동작 줄이기 양쪽에서 활성 애니메이션이 0개인지 확인했다. 컨페티는 16개 생성·정지 시 제거, 전체 정지는 활성 애니메이션 0개를 확인했다. 320px에서 모달·시트의 초기 포커스·Tab 유지·Escape 닫기·호출 버튼 복귀를 확인했다.
- `node --test test/screen-effects.test.mjs`는 스크립트 구문, 32개 시연과 문서 연결, 기존 패턴 ID·문서 링크를 검사한다. 브라우저를 실행하는 테스트는 아니므로 효과를 바꾸면 위 브라우저 점검을 다시 수행한다. 모든 효과의 실기기 품질·고대비·스크린리더 검증을 수행한 것은 아니다.
- 애니메이션은 사용자 실행으로만 시작하고 대부분 180–850ms 안에 끝난다. 쉬머·입자는 자동 반복하지 않는다. 정지는 애니메이션을 취소하고 목표 상태를 남긴다. 재실행은 이전 애니메이션을 취소하는 방식이며 물리적 중간 속도를 보존하는 엔진은 아니다.
- OS의 동작 줄이기 설정을 사용자가 이 페이지에서 해제할 수 없게 했다. 페이지 체크박스는 추가로 줄이는 선택이다.
- 실제 앱에서는 포커스·키보드·터치·확대·고대비·투명도 줄이기, 숨김 탭, 느린 기기, 데이터 실패와 빠른 반복 입력을 검사한다. 이번 예시는 전체 접근성 적합성이나 FPS 인증이 아니다.
- MCP 0.3.0부터 `search_design_visuals`와 `get_design_visual`의 `id=screen-effects`로 이 갤러리와 문서를 조회한다. `includeSource=true`로 HTML을 받는다. 기존 패턴 186개·대표 코드 예제와 별도의 시각 자료이며, 추가 검토 19종이 실행 구현으로 바뀐 것은 아니다.

관련 원칙: [배경·효과](../content/library/background-effects.json), [모션](../content/library/motion-patterns.json), [미세 상호작용](../content/library/microinteractions.json), [오버레이](../content/library/overlays.json), [상태·복구](../content/library/state-patterns.json), [공간·3D](../content/library/spatial-design.json).

구현 참고: [MDN Web Animations](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API), [MDN dialog](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog), [MDN prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion), [W3C 드래그 대안](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html).
