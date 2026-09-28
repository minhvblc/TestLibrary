# GC-PlanCard — thẻ gói trên trang giá và trang mở khoá report
**Changelog** (mới nhất trước)
- 2026-09-27 · v1 · claude (subagent) · khởi tạo.

## 1. Anatomy (CMP con)

Một thẻ = một lựa chọn mua (hoặc gói Free), bọc trong `<section>` có heading. Giá, chu kỳ, bullet và số tiết kiệm đều đến từ API-PAY-01 theo `planKey` (schema ở `docs/api/SCR-PUB-04-api.md`); nguồn nghiệp vụ là 00-overview §2. Mọi giá trong docs là **placeholder — Q-03** cho tới khi human chốt.

| CMP con | Thành phần | Nội dung / copy verbatim (en-US) | Ghi chú |
|---|---|---|---|
| `name` | heading thẻ, `type.h3` | SCR-PUB-04: "Free" · "One report" · "Plus" · SCR-PAY-01: "This report" · "Plus" | nhãn do màn truyền |
| `cycle-toggle` | slot do màn đặt, chỉ thẻ Plus ở SCR-PUB-04 | "Monthly" · "Annual" (+ "Save [n]%" cạnh "Annual") | là SCR-PUB-04 CMP-04, nằm trên `price`; ở SCR-PAY-01 toggle (CMP-05) nằm ngoài thẻ, ngay dưới thẻ Plus |
| `price` | giá, `type.price` | `kind` = `free`: "No payment needed" (không hiện số) · `one_time`: "[price] one-time" · `subscription`: "[price] per month" hoặc "[price] per year" | `[price]` định dạng Intl en-US theo currency của planKey (USD); giá thật = placeholder — Q-03 |
| `summary` | 1 câu, `type.body`, tuỳ chọn | do màn truyền — SCR-PUB-04 "One report": "Full report and PDF for one test result. Never renews." · SCR-PAY-01 "This report": "Full report and PDF for this result. Never renews." · SCR-PAY-01 "Plus": "Every full report and PDF, plus the 30-day challenge. Renews automatically until you cancel." | |
| `features` | danh sách bullet, `type.body`, luôn mở | lấy nguyên từ `plans[].features` của API-PAY-01 | nội dung = cột "Giới hạn / quyền" của 00-overview §2; SCR-PUB-04 dùng cho "Free" và "Plus" |
| `select-control` | radio, chỉ variant `selectable` | accessible name = `name` + chữ trong `price` | cả thẻ là vùng chọn |
| `footer` | slot do màn đặt | SCR-PUB-04: nút của thẻ ("Take a free test" · "Take a test to unlock"); thẻ Plus: GC-RenewalDisclosure → checkbox consent → "Continue to secure checkout" (hoặc "Manage plan" khi đã có Plus) | checkbox và nút là CMP của màn (BR-PUB-10 · BR-PAY-02); GC không tự tạo nút mua |

Thẻ: nền `color.surface`, viền `color.border`, `radius.lg`, đệm `space.6`. Không nền gradient, không làm một thẻ nổi hơn các thẻ khác.

## 2. Props / variants

| Variant | Khi dùng | Hành vi |
|---|---|---|
| `action` | SCR-PUB-04 (3 thẻ: "Free" · "One report" · "Plus") | mỗi thẻ có nút riêng trong `footer`; không có trạng thái chọn |
| `selectable` | SCR-PAY-01 (2 thẻ: "This report" · "Plus") | các thẻ là radio trong một radiogroup; "This report" được chọn sẵn (BR-PAY-03); nút chung "Continue to secure checkout" nằm ngoài thẻ (SCR-PAY-01 CMP-08); thẻ chỉ có `price` + `summary` |

| Prop | Kiểu | Mặc định | Ý nghĩa |
|---|---|---|---|
| `variant` | `action` · `selectable` | `action` | |
| `planKey` | `plan.free` · `report.single` · `plan.plus.monthly` · `plan.plus.annual` | bắt buộc | khoá tra trong API-PAY-01 (00-overview §2) |
| `kind` | `free` · `one_time` · `subscription` | từ `plans[].kind` | quyết định cách hiện `price` |
| `price` | `{ amount, currency }` từ `plans[].price` | bắt buộc với `one_time` và `subscription` | tiền là số nguyên đơn vị nhỏ nhất (00-quy-uoc-api §8) |
| `billingCycle` | `monthly` · `annual` | `monthly` | chỉ thẻ Plus; toggle của màn điều khiển, đổi `planKey` giữa `plan.plus.monthly` và `plan.plus.annual` |
| `summary` | string hoặc không có | không có | 1 câu do màn truyền |
| `features` | danh sách string từ `plans[].features` | rỗng | rỗng thì không render danh sách |
| `selected` | boolean | `report.single` = true ở SCR-PAY-01 | chỉ `selectable` |
| `purchasable` | boolean | true | false khi quốc gia của người mua chưa được provider hỗ trợ (state Locked) |

## 3. States (5) + hover / focus / disabled

| State | Khi nào | Hiển thị / hành vi | Basis |
|---|---|---|---|
| Default | API-PAY-01 trả đủ planKey | `name` · `price` · `summary` / `features` · `footer` | BR-PUB-07 · BR-PAY-01 |
| Loading | API-PAY-01 đang chạy từ 300 ms trở lên | skeleton cho tên, giá và 3 dòng; nút trong `footer` disable; không bao giờ hiện giá tạm hay giá cũ | tieu-chuan-chung §3 · BR-PUB-07 |
| Empty | N/A — planKey không có trong API-PAY-01 là lỗi cấu hình, xử lý như Error | — | 00-overview §2 |
| Error | API-PAY-01 lỗi | thẻ trả phí ẩn `price`, nút mua disable; màn hiện "We couldn't load prices. Please refresh."; thẻ Free vẫn dùng được "Take a free test" | BR-PUB-07 |
| Locked | `purchasable = false` (quốc gia chưa hỗ trợ) | vẫn hiện giá; nút mua disable; màn hiện "Purchases aren't available in your country yet." | BR-APP-12 · Q-04 |
| hover | con trỏ trên thẻ `selectable` | viền `color.accent`, `shadow.card-hover`; variant `action` thì chỉ nút có hover | in-house |
| focus | focus bàn phím | `selectable`: `focus.ring` quanh cả thẻ; `action`: `focus.ring` trên nút | tieu-chuan-chung §5 |
| disabled | nút mua chưa dùng được (Loading · Error · Locked · Plus chưa tick consent) | `aria-disabled="true"` thay vì `disabled` để nút vẫn focus được và được đọc; nếu lý do là consent thì màn hiện "Tick the box above to continue." (SCR-PUB-04 CMP-07 · SCR-PAY-01 CMP-08) và bấm nút chuyển focus tới checkbox | BR-PUB-10 · BR-PAY-02 · tieu-chuan-chung §5 |
| selected | thẻ `selectable` đang được chọn | viền dày `color.accent` + icon check + `aria-checked="true"`; không chỉ dựa vào màu | tieu-chuan-chung §5 |

## 4. Behavior & rules (BR nếu có)

GC không có BR riêng. Quy tắc cite BR của SCR-PUB-04 / SCR-PAY-01 và BR-APP.

| Rule | Mô tả | Basis |
|---|---|---|
| Giá từ API | giá, chu kỳ, `features`, `savingsPercent` lấy từ API-PAY-01 theo `planKey`, không hard-code; tài liệu ghi placeholder tới khi Q-03 chốt | BR-PUB-07 · BR-PAY-01 · 00-overview §2 · Q-03 |
| Định dạng tiền | Intl en-US theo currency của planKey (USD); không đổi currency theo IP; không làm tròn; luôn kèm chu kỳ ("one-time" · "per month" · "per year") | BR-APP-12 · tieu-chuan-chung §4 |
| Gói năm | số chính = số tiền thu mỗi năm; nếu có hiện quy đổi theo tháng thì chỉ là dòng phụ, không bao giờ thay số chính | tieu-chuan-chung §4 · BR-APP-02 |
| Tiết kiệm | "Save [n]%" nằm cạnh "Annual" trên toggle của màn, không nằm trong thẻ; n = `plans[].savingsPercent` do server tính (làm tròn xuống, null thì ẩn) — client không tự tính | BR-PUB-09 |
| Không dark pattern | không giá gạch / giá neo / "% off" giả, không đồng hồ đếm ngược, không "X just bought", không testimonial chưa kiểm chứng, không logo "featured in" | BR-PUB-08 · BR-PAY-05 · RS·F-17 · F-18 |
| Badge "Most popular" | MVP không có. Chỉ thêm khi có số liệu mua thật và human duyệt câu chữ (ghi vào bang-quyet-dinh trước) | RS·F-17 · in-house |
| Không chọn sẵn gói tự gia hạn | `selectable`: mặc định chọn "This report" (một lần); Plus chỉ được chọn khi user bấm | BR-PAY-03 · P-02 |
| Thứ tự thẻ | SCR-PUB-04: Free → One report → Plus ở mọi viewport; SCR-PAY-01: This report → Plus | BR-PAY-03 · in-house |
| Tính năng thật | `features` khớp quyền ở SYS-ENTITLEMENT; không "unlimited", "lifetime", "full access" nếu không đúng; danh sách luôn mở ở mọi viewport (không accordion) | RS·F-06 · F-29 · SYS-ENTITLEMENT |
| Đã có quyền | đang có Plus: nút mua của thẻ Plus đổi thành "Manage plan" (SCR-PUB-04 CMP-07); không bán trùng mua lẻ khi đang có Plus | SYS-ENTITLEMENT |
| Radio (`selectable`) | radiogroup chuẩn: Tab vào nhóm, ↑ / ↓ / ← / → đổi lựa chọn (không submit), Space chọn; đổi lựa chọn chỉ cập nhật tại chỗ (toggle, GC-RenewalDisclosure, checkbox consent của màn hiện hoặc ẩn), không đổi URL | tieu-chuan-chung §5 · SYS-NAV §2 |
| Đổi gói / chu kỳ sau khi đã tick consent | màn phải bỏ tick checkbox, vì câu consent phải khớp đúng giá + chu kỳ đang chọn | BR-APP-03 |
| Thuế | GC không tự cộng thuế; dòng "Taxes calculated at checkout." do màn đặt (SCR-PAY-01 CMP-10) | BR-APP-12 · Q-04 |
| Tracking | GC không bắn event; ft_unlock start / checkout_open do màn bắn | tracking-events |

## 5. Dùng ở màn nào (SCR-IDs)

| SCR-ID | Variant | CMP ở màn | Ghi chú |
|---|---|---|---|
| SCR-PUB-04 | `action` × 3 ("Free" · "One report" · "Plus") | CMP-03 | thẻ Plus chứa CMP-04 (toggle) ở trên giá, và CMP-05 (GC-RenewalDisclosure) · CMP-06 (checkbox) · CMP-07 (nút) trong `footer` |
| SCR-PAY-01 | `selectable` × 2 ("This report" · "Plus") | CMP-04 | toggle CMP-05, disclosure CMP-06, checkbox CMP-07 chỉ hiện khi chọn Plus |

## 6. Responsive

| Aspect | 390 (gốc) | 768 (`bp.md`) | 1280 (`bp.lg`) |
|---|---|---|---|
| SCR-PUB-04 | xếp chồng theo thứ tự Free → One report → Plus | 2 + 1: Free · One report ở hàng trên, Plus rộng hết hàng dưới | 3 cột bằng nhau, cùng chiều cao |
| SCR-PAY-01 | xếp chồng: This report → Plus | xếp chồng trong cột phải của màn | như 768 (cột phải dính khi cuộn, theo SCR-PAY-01) |
| Nội dung thẻ | bullet luôn mở, không cắt; `price` giữ `type.price` (không thu nhỏ trên mobile) | như 390 | như 390 |
| Vùng chạm | cả thẻ `selectable` và nút đạt `layout.touch-target` | như 390 | như 390 |

## 7. Basis (EV / Q)

| Quyết định | Basis |
|---|---|
| Mô hình Free + mua lẻ + Plus | Q-02 · 00-overview §2 |
| Chu kỳ tháng + năm thay vì 4 tuần như đối thủ | Q-03 · RS·F-05 · EV-TLW-025 |
| Không làm nổi một gói bằng nút tô đặc hay badge (đối thủ nhấn gói trial bằng nút tô đặc ở cột giữa) | EV-TLW-024 · CS-09 |
| Không giá gạch, không "-87%" | RS·F-18 · EV-TLW-111 · EV-TLW-112 |
| Không đồng hồ, không ticker "just bought", không logo báo chí | RS·F-17 · EV-TLW-108 · EV-TLW-109 · CS-08 |
| Không hứa gói không tồn tại ("Lifetime plan" chỉ có trong FAQ của đối thủ) | RS·F-06 · EV-TLW-021 |
| Chọn sẵn mua một lần, không chọn sẵn gói tự gia hạn | BR-PAY-03 · P-02 |
| Xếp chồng ở 390 | EV-TLW-204 · tieu-chuan-chung §6 |
| Tiền tệ, thuế | BR-APP-12 · Q-04 |

## 8. AI Notices
- Viết bởi claude (subagent) ở Phase 4 từ spec blueprint (SCR-PUB-04 · SCR-PAY-01), rồi chỉnh cho khớp `docs/api/SCR-PUB-04-api.md` (`kind`, `features`, `savingsPercent`) và CMP của hai màn đó.
- Copy bullet nằm ở `plans[].features` (server). Khi viết `go-to-market/pricing-page.md` §1 thì dữ liệu này phải khớp file đó; GC không giữ bản copy riêng.
- 00-overview §2 ghi Plus có "ưu tiên hỗ trợ" nhưng `features` của API không có bullet này. Giữ như vậy cho tới khi có định nghĩa vận hành (vd thời gian phản hồi cam kết).
- Không chắc giá hiển thị đã gồm thuế hay chưa: việc này phụ thuộc cấu hình MoR (Q-04), và một số vùng yêu cầu hiện giá đã gồm thuế cho người tiêu dùng. Cần chốt cùng Q-04 trước economy-FREEZE.
