# GC-SiteHeader — thanh đầu trang của site (`public` · `app` · `minimal`)
**Changelog** (mới nhất trước)
- 2026-09-27 · v1 · claude (subagent) · khởi tạo.

## 1. Anatomy (CMP con)

Header là landmark `<header>` (banner) ở đầu mọi trang có shell `public`, `app` hoặc funnel (SYS-NAV §4). Nhãn, thứ tự và đích của từng mục lấy nguyên từ SYS-NAV §1. GC này chỉ quy định cách hiển thị, trạng thái và hành vi.

| CMP con | Thành phần | Nội dung / copy verbatim (en-US) | Ghi chú |
|---|---|---|---|
| `skip-link` | link ẩn, chỉ hiện khi được focus | "Skip to main content" | phần tử focus được đầu tiên của trang; nhảy tới `<main>` |
| `logo` | link wordmark | "TestLib" (tên tạm, Q-01) · accessible name "TestLib home" | luôn tới `/` (SCR-PUB-01) ở cả 3 variant |
| `primary-nav` | `<nav>` accessible name "Main" | `public`: "Tests" · "Pricing" · "Help" · `app`: "Home" · "Tests" · "My reports" | mục của route hiện tại có `aria-current="page"` |
| `auth-action` | slot bên phải | `public`: link dạng nút viền "Sign in" · `app`: `avatar-menu` | slot giữ chỗ cố định để header không nhảy layout khi API-ME-01 trả về |
| `avatar-menu` | nút tròn + menu thả | nút: chữ cái đầu của tên (không có tên thì của email) · accessible name "Account menu" · dòng đầu menu (không bấm được): tên hoặc email · mục: "Account" · "Plan & billing" · "Sign out" | "Account" → SCR-ACC-01 · "Plan & billing" → SCR-PAY-03 · "Sign out" là hành động (API-AUTH-05), không phải link |
| `menu-toggle` | nút ☰, chỉ dưới `bp.md` | accessible name "Open menu" / "Close menu" | `aria-expanded` + `aria-controls` trỏ tới `drawer` |
| `drawer` | panel điều hướng, chỉ dưới `bp.md` | `public`: "Tests" · "Pricing" · "Help" · "Sign in" · `app`: "Home" · "Tests" · "My reports" · (đường ngăn) · "Account" · "Plan & billing" · "Sign out" | thứ tự theo SYS-NAV §1; "Sign out" thêm ở cuối nhóm tài khoản |
| `back-link` | link chữ, tuỳ chọn, chỉ ở `minimal` | nhãn do màn truyền — SCR-PAY-01: "Back to your result" | không truyền thì `minimal` chỉ có logo |

Style: nền `color.surface`, viền dưới `color.border`, nhãn `type.body-sm` màu `color.text`, không đổ bóng. Chiều ngang nội dung giới hạn trong `layout.max-width`, lề `layout.gutter`.

## 2. Props / variants

| Variant | Khi dùng | Nội dung | Ghi chú |
|---|---|---|---|
| `public` | route shell `public` (SYS-NAV §4) khi chưa có phiên | `logo` · "Tests" · "Pricing" · "Help" · "Sign in"; dưới `bp.md`: `logo` + ☰ | "Sign in" → `/login` (xem §4) |
| `app` | route shell `app`; route shell `public` khi đã có phiên | `logo` · "Home" · "Tests" · "My reports" · `avatar-menu`; dưới `bp.md`: `logo` + ☰ | cần API-ME-01 để hiện chữ cái đầu / tên |
| `minimal` | trang funnel: SCR-AUTH-01 · SCR-TEST-02 · SCR-PAY-01 · SCR-PAY-02; SCR-APP-03 khi người xem là khách | chỉ `logo` (+ `back-link` nếu màn truyền) | không nav, không avatar, không ☰, kể cả khi đã có phiên, để funnel không bị phân tâm |

| Prop | Kiểu | Mặc định | Ý nghĩa |
|---|---|---|---|
| `variant` | `public` · `app` · `minimal` | do shell chọn theo §4 | màn không tự đổi, trừ SCR-APP-03 (khách → `minimal`) |
| `currentPath` | string | path hiện tại | tính `aria-current` và tham số `next` của "Sign in" |
| `me` | `{ name, email }` từ API-ME-01, hoặc null | null | null khi đang tải hoặc lỗi → avatar hiện icon người chung |
| `backLink` | `{ label, href }` hoặc không có | không có | chỉ `minimal`; SCR-PAY-01 truyền "Back to your result" → `/results/:resultId` |

## 3. States (5) + hover / focus / disabled

| State | Khi nào | Hiển thị / hành vi | Basis |
|---|---|---|---|
| Default | đã biết là khách hoặc có phiên | đủ CMP con theo variant | SYS-NAV §1 |
| Loading | API-ME-01 đang chạy | nav hiện ngay theo variant của shell; `auth-action` giữ chỗ cố định, sau 300 ms mới hiện skeleton tròn; không nhảy layout | tieu-chuan-chung §3 · §9 (CLS) |
| Empty | N/A — header luôn có ít nhất `logo`; khách không có avatar là Default của `public` | — | SYS-NAV §1 |
| Error | API-ME-01 lỗi mạng / 5xx; API-AUTH-05 lỗi | route public: hiện `public` (nếu thật ra đã đăng nhập thì bấm "Sign in" sẽ được SCR-AUTH-01 tự chuyển tiếp); route `app`: giữ nav `app`, avatar icon chung, menu vẫn dùng được; "Sign out" lỗi: menu giữ mở + toast "You're offline. Check your connection and try again." hoặc "Something went wrong on our side. Please try again." | tieu-chuan-chung §2 |
| Locked | N/A — header không chứa nội dung khoá; mục cần tài khoản chỉ có ở variant `app` | — | SYS-ENTITLEMENT |
| hover | con trỏ trên link / nút (thiết bị có hover) | chữ đổi `color.accent` + gạch chân; chuyển `motion.fast` · `easing.standard` | in-house |
| focus | focus bàn phím | `focus.ring` trên mọi link / nút; `skip-link` hiện ra khi được focus | tieu-chuan-chung §5 |
| disabled | N/A — không mục nào bị disable; mục của trang hiện tại vẫn là link (`aria-current`) | — | tieu-chuan-chung §5 |

## 4. Behavior & rules (BR nếu có)

GC không có BR riêng. Các quy tắc dưới đây cite BR / SYS đã có.

| Rule | Mô tả | Basis |
|---|---|---|
| Chọn variant | shell `public` + khách → `public`; shell `public` + có phiên → `app`; shell `app` → `app`; shell funnel → `minimal`; SCR-APP-03: có phiên → `app`, khách (token + quyền mua) → `minimal` | SYS-NAV §4 · SYS-AUTH · BR-REP-05 |
| Nhãn & thứ tự | đúng SYS-NAV §1, không thêm mục; không có thanh trên cùng (số điện thoại, "Contacts"), không có bộ chọn ngôn ngữ | SYS-NAV §1 · Q-14 |
| Logo | luôn → `/` (push) ở mọi variant | SYS-NAV §1 |
| Mục đang mở | `aria-current="page"` + gạch chân `color.accent`; "Tests" active ở `/tests` và `/tests/:slug`; "My reports" active ở `/app/reports` và `/app/reports/:reportId`; "Plan & billing" active ở `/account/billing` và `/account/billing/cancel` | tieu-chuan-chung §5 |
| "Sign in" | → `/login` (push); từ route public khác `/` thì thêm `?next=<path hiện tại>` để quay lại đúng trang; truyền `from=header` qua history state (không đặt lên URL) để SCR-AUTH-01 bắn ft_auth start với `from` = header | BR-AUTH-02 · tracking-events |
| Phiên (API-ME-01) | gọi 1 lần mỗi lần tải trang đầy đủ, cache trong bộ nhớ cho điều hướng phía client; 200 → có phiên; 401 → khách (không phải lỗi trên route public; route `account` / `entitled` xử lý theo tieu-chuan-chung §1) | API-ME-01 · tieu-chuan-chung §1 |
| "Sign out" | gọi API-AUTH-05 → xoá cache `me` → ghi một khoá localStorage để tab khác nhận sự kiện `storage` và về `/` → replace sang `/` (back không quay lại trang tài khoản); ft_auth logout bắn khi API-AUTH-05 xong | BR-APP-10 · tieu-chuan-chung §1 · tracking-events |
| Drawer | mở: focus vào mục đầu, phần còn lại của trang `inert`, khoá cuộn nền, có scrim; đóng bằng ✕ / Esc / chạm scrim / back trình duyệt; đóng xong focus trả về ☰ | SYS-NAV §1 |
| Drawer & history | mở drawer = thêm 1 entry history cùng URL (URL không đổi); back khi drawer đang mở → đóng drawer, không rời trang; đóng bằng ✕ / Esc / scrim → gỡ entry đó; bấm mục trong drawer → điều hướng bằng replace chính entry đó để không để lại entry thừa | SYS-NAV §1 · §2 |
| Avatar menu | nút có `aria-haspopup="menu"` + `aria-expanded`; ↑ / ↓ di chuyển giữa các mục, Enter chọn, Esc đóng và trả focus về nút; click ra ngoài thì đóng; menu dùng `shadow.overlay` · `radius.md` | tieu-chuan-chung §5 |
| Không dính | header không sticky ở mọi viewport, vì màn đã có thanh dính riêng (nút "Start test" dính đáy @390 ở SCR-PUB-03, mục lục dính @1280 ở SCR-APP-03) | in-house |
| Banner offline | banner "You're offline. Check your connection and try again." nằm ngay dưới header, không thuộc GC | tieu-chuan-chung §2 |
| Tracking | GC không bắn event điều hướng (screen_active do route bắn); chỉ có ft_auth logout ở "Sign out" | tracking-events |

## 5. Dùng ở màn nào (SCR-IDs)

| SCR-ID | Variant | CMP ở màn | Ghi chú |
|---|---|---|---|
| SCR-PUB-01 | `public` (có phiên → `app`) | CMP-01 | — |
| SCR-PUB-02 | `public` (có phiên → `app`) | CMP-01 | — |
| SCR-PUB-03 | `public` (có phiên → `app`) | CMP-01 | — |
| SCR-PUB-04 | `public` (có phiên → `app`) | CMP-01 | — |
| SCR-PUB-05 | `public` (có phiên → `app`) | CMP-01 | — |
| SCR-PUB-06 | `public` (có phiên → `app`) | CMP-01 | — |
| SCR-PUB-07 | `public` (có phiên → `app`) | CMP-01 | — |
| SCR-AUTH-01 | `minimal` | CMP-01 | đã đăng nhập thì màn tự chuyển tiếp (state Locked của màn) |
| SCR-TEST-02 | `minimal` | CMP-01 | logo → `/` |
| SCR-PAY-01 | `minimal` + `back-link` "Back to your result" | CMP-01 | — |
| SCR-PAY-02 | `minimal` | CMP-01 | — |
| SCR-PAY-03 | `app` | CMP-01 | — |
| SCR-PAY-04 | `app` | CMP-01 | — |
| SCR-APP-01 | `app` | CMP-01 | — |
| SCR-APP-02 | `app` | CMP-01 | — |
| SCR-APP-03 | `app`; khách → `minimal` | CMP-01 | khách đọc được nhờ token + quyền mua (BR-REP-05) |
| SCR-ACC-01 | `app` | CMP-01 | — |
| SCR-ACC-02 | `app` | CMP-01 | — |
| SCR-TEST-01 | không dùng | — | màn làm bài có thanh trên riêng ("Exit" + tiến độ), không có header site (SCR-TEST-01 §3) |

## 6. Responsive

| Aspect | 390 (gốc) | 768 (`bp.md`) | 1280 (`bp.lg`) |
|---|---|---|---|
| `public` | `logo` trái · ☰ phải → `drawer` | `logo` trái · "Tests" · "Pricing" · "Help" · "Sign in" phải | như 768, trong `layout.max-width`, căn giữa |
| `app` | `logo` trái · ☰ phải → `drawer` (có cả nhóm tài khoản) | `logo` · "Home" · "Tests" · "My reports" · `avatar-menu` | như 768 |
| `minimal` | `logo` trái · `back-link` phải (nếu có) | như 390 | như 390, trong `layout.max-width` |
| `drawer` | panel từ cạnh phải, cao toàn màn, có scrim; hiện / ẩn bằng `motion.base` · `easing.standard`; `prefers-reduced-motion` → hiện ngay, không trượt | không có drawer | không có drawer |
| Vùng chạm | mọi mục đạt `layout.touch-target` (tieu-chuan-chung §5) | như 390 | như 390 |

## 7. Basis (EV / Q)

| Quyết định | Basis |
|---|---|
| Nhãn, thứ tự, đích từng mục; drawer dưới `bp.md`, không bottom nav | SYS-NAV §1 · RS·F-27 · EV-TLW-203 · EV-TLW-258 |
| Bỏ thanh trên cùng có số điện thoại và bộ chọn ngôn ngữ của đối thủ (MVP chỉ en-US) | EV-TLW-002 · EV-TLW-012 · Q-14 |
| Header member chỉ khi có phiên (đối thủ hiện header member cả cho khách ở trang kết quả free) | EV-TLW-079 · design-report §7 |
| Funnel dùng `minimal` (đối thủ: trang funnel chỉ có logo) | EV-TLW-053 · EV-TLW-083 |
| Header member 3 mục + avatar (đối thủ: "Home" · "Test library" · "Your reports" + icon profile) | EV-TLW-208 |
| Phiên, đăng xuất, đồng bộ tab | BR-APP-10 · SYS-AUTH · API-ME-01 · API-AUTH-05 |

## 8. AI Notices
- Viết bởi claude (subagent) ở Phase 4 từ spec blueprint + SYS-NAV §1. Không sửa SYS-NAV.
- Quy tắc "shell `public` + có phiên → `app`" lấp chỗ SYS-NAV §1 chưa nói tới. Cần thêm một dòng ghi chú ở SYS-NAV §1 khi owner cập nhật.
- Trang public render tĩnh (Q-09) không biết phiên lúc build. Người đã đăng nhập sẽ thấy nhãn header đổi từ `public` sang `app` khi API-ME-01 về (chiều cao giữ nguyên nên không CLS). Muốn bỏ hiện tượng này thì dùng một cookie gợi ý không-HttpOnly (chỉ báo "có phiên", không chứa bí mật) để chọn variant ngay khi tải. Việc này phải thêm vào 00-quy-uoc-api §2 và danh mục cookie; chưa làm.
- "Sign out" trong drawer là bổ sung: SYS-NAV §1 chỉ liệt kê mục điều hướng, còn đăng xuất là hành động.
- Accessible name ("Skip to main content", "TestLib home", "Main", "Account menu", "Open menu", "Close menu") là copy đề xuất, cần đưa vào i18n key.
