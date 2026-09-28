# GC-SiteFooter — chân trang: link pháp lý, cài đặt cookie, pháp nhân (`full` · `compact`)
**Changelog** (mới nhất trước)
- 2026-09-27 · v1 · claude (subagent) · khởi tạo.

## 1. Anatomy (CMP con)

Footer là landmark `<footer>` (contentinfo) ở cuối trang. Nội dung tĩnh, render cùng trang, không gọi API. Nhãn link lấy từ SYS-NAV §1.

| CMP con | Thành phần | Nội dung / copy verbatim (en-US) | Ghi chú |
|---|---|---|---|
| `links` | `<nav>` accessible name "Legal and help" | `full`: "Privacy" · "Terms" · "Subscriptions & refunds" · "Cookie policy" · "Cookie settings" · "Help" · `compact`: "Privacy" · "Terms" · "Subscriptions & refunds" · "Cookie settings" · "Help" | đích ở §4; `type.body-sm`, `color.text-muted` |
| `disclaimer` | 1 câu, chỉ ở `full` | "Our tests are for self-reflection and education. They are not a medical or psychological diagnosis." | `type.caption`, `color.text-muted`; câu đề xuất, cần review pháp lý cùng Q-05 |
| `company-line` | 1 dòng | `full`: "© [year] [legal entity] · [registered address] · support@[domain]" · `compact`: "© [year] [legal entity] · [registered address]" | **placeholder — Q-05** (tên pháp nhân, địa chỉ) · `[domain]` theo Q-01 |

Nền `color.surface-muted`, viền trên `color.border`. Chữ `color.text-muted` vẫn phải đạt tương phản chữ tối thiểu của tieu-chuan-chung §5.

## 2. Props / variants

| Variant | Khi dùng | Nội dung | Bố cục |
|---|---|---|---|
| `full` | mọi trang có shell `public` hoặc `app` (SYS-NAV §4) | 6 link + `disclaimer` + `company-line` đầy đủ | nhiều dòng |
| `compact` | trang funnel: SCR-AUTH-01 · SCR-TEST-02 · SCR-PAY-01 · SCR-PAY-02; SCR-APP-03 khi người xem là khách | 5 link (bỏ "Cookie policy", vẫn tới được qua "Cookie settings") + `company-line` rút gọn | 1 dòng link (tự xuống dòng khi hẹp) + 1 dòng pháp nhân; không phải "footer site" `full` — là dải tối thiểu để giữ "Cookie settings" ở mọi trang (SYS-NAV §1) |

| Prop | Kiểu | Mặc định | Ý nghĩa |
|---|---|---|---|
| `variant` | `full` · `compact` | do shell chọn, cùng quy tắc với GC-SiteHeader (`minimal` ↔ `compact`) | màn không tự đổi |
| `currentPath` | string | path hiện tại | link trùng route hiện tại có `aria-current="page"` |
| `legalEntity` | `{ name, address, supportEmail }` | cấu hình build (Q-05) | MỘT nguồn cấu hình dùng chung với SCR-PUB-05 CMP-05 và dòng người bán SCR-PAY-01 CMP-10 |

## 3. States (5) + hover / focus / disabled

| State | Khi nào | Hiển thị / hành vi | Basis |
|---|---|---|---|
| Default | luôn luôn | nội dung tĩnh theo variant | SYS-NAV §1 |
| Loading | N/A — nội dung tĩnh render cùng trang (SSR / build), không có request | — | Q-09 |
| Empty | N/A — luôn có link; thiếu cấu hình pháp nhân là lỗi build, không render dòng rỗng | — | Q-05 |
| Error | N/A — không có request; link trỏ route sai là lỗi build (bắt bằng test link) | — | in-house |
| Locked | N/A — nội dung công khai cho mọi người | — | SYS-NAV §1 |
| hover | con trỏ trên link | gạch chân, chữ chuyển `color.text`; `motion.fast` | in-house |
| focus | focus bàn phím | `focus.ring` | tieu-chuan-chung §5 |
| disabled | N/A — không link nào bị disable; link của trang hiện tại vẫn bấm được (`aria-current`) | — | tieu-chuan-chung §5 |

## 4. Behavior & rules (BR nếu có)

GC không có BR riêng.

| Rule | Mô tả | Basis |
|---|---|---|
| Đích link | "Privacy" → `/legal/privacy` · "Terms" → `/legal/terms` · "Subscriptions & refunds" → `/legal/subscriptions` · "Cookie policy" → `/legal/cookies` (cả bốn là SCR-PUB-05) · "Cookie settings" → `/cookie-settings` (SCR-PUB-07) · "Help" → `/help` (SCR-PUB-06); tất cả push, cùng tab | SYS-NAV §1 · §2 |
| "Cookie settings" là trang | mở trang `/cookie-settings`, không mở modal (MVP không dùng modal) | SYS-NAV §2 · SYS-CONSENT |
| Rút consent dễ như lúc cho | "Cookie settings" có ở cả hai variant, tức là ở mọi trang có footer | SYS-CONSENT (rút consent) · BR-APP-05 |
| Pháp nhân hiện rõ | tên pháp nhân + địa chỉ có ở cả hai variant, kể cả trên trang thanh toán; lấy từ cấu hình chung (xem prop `legalEntity`) | RS·F-12 · Q-05 |
| Không ship placeholder | "[legal entity]", "[registered address]", "[domain]" phải được thay trước go-live; đề xuất build báo lỗi nếu còn chuỗi placeholder | Q-01 · Q-05 |
| Trang hiện tại | link trùng route hiện tại có `aria-current="page"`, vẫn bấm được | tieu-chuan-chung §5 |
| Không giấu nội dung ở footer | không đặt danh sách bài test / trang SEO chỉ lộ ra ở footer | RS·F-04 · EV-TLW-052 |
| Tracking | click link không bắn event | tracking-events |

## 5. Dùng ở màn nào (SCR-IDs)

| SCR-ID | Variant | CMP ở màn | Ghi chú |
|---|---|---|---|
| SCR-PUB-01 | `full` | CMP-07 | — |
| SCR-PUB-02 | `full` | CMP-05 | — |
| SCR-PUB-03 | `full` | CMP-09 | — |
| SCR-PUB-04 | `full` | CMP-10 | — |
| SCR-PUB-05 | `full` | CMP-06 | link của văn bản đang mở có `aria-current` |
| SCR-PUB-06 | `full` | CMP-08 | — |
| SCR-PUB-07 | `full` | CMP-08 | "Cookie settings" có `aria-current` |
| SCR-PAY-03 · SCR-PAY-04 · SCR-APP-01 · SCR-APP-02 · SCR-ACC-01 · SCR-ACC-02 | `full` | theo shell (blueprint chưa ghi CMP) | SYS-NAV §1: footer có ở mọi trang public + app |
| SCR-APP-03 | `full` khi đã đăng nhập · `compact` khi là khách | theo shell | đi cùng variant của GC-SiteHeader |
| SCR-AUTH-01 · SCR-TEST-02 · SCR-PAY-01 · SCR-PAY-02 | `compact` | theo shell | funnel; các màn này ghi "không footer site", hiểu là không có `full` (xem §8) |
| SCR-TEST-01 | không dùng | — | màn làm bài không có footer để giảm phân tâm (SCR-TEST-01 §3) |

## 6. Responsive

| Aspect | 390 (gốc) | 768 (`bp.md`) | 1280 (`bp.lg`) |
|---|---|---|---|
| `full` · `links` | lưới 2 cột, mỗi link đạt `layout.touch-target` (tieu-chuan-chung §5) | 1 hàng, tự xuống dòng khi thiếu chỗ | 1 hàng trong `layout.max-width` |
| `full` · `disclaimer` + `company-line` | xếp chồng dưới `links` | dưới `links` | 2 dòng dưới hàng link |
| `compact` | link tự xuống dòng, căn giữa; `company-line` dòng dưới | như 390 | như 390, trong `layout.max-width` |

## 7. Basis (EV / Q)

| Quyết định | Basis |
|---|---|
| Bộ link và nhãn | SYS-NAV §1 |
| "Cookie settings" ở mọi trang (đối thủ không có banner, không có chỗ đổi lựa chọn cookie) | SYS-CONSENT · BR-APP-05 · RS·F-02 · EV-TLW-002 |
| Hiện tên pháp nhân + địa chỉ ở mọi trang (đối thủ: pháp nhân phân tán, người bán chỉ báo sau khi mua) | RS·F-12 · Q-05 · EV-TLW-049 · EV-TLW-043 |
| Câu disclaimer không-chẩn-đoán (đối thủ có câu "informational and educational" ở footer) | legal-extract §8 · EV-TLW-014 · tieu-chuan-chung §8 |
| Không có link "Cancel Subscription" riêng ở footer như đối thủ: huỷ nằm trong tài khoản, lối vào từ "Help" → "Manage or cancel your plan" (SCR-PUB-06) | BR-APP-04 · EV-TLW-014 · EV-TLW-046 · RS·F-11 |

## 8. AI Notices
- Viết bởi claude (subagent) ở Phase 4 từ spec blueprint + SYS-NAV §1.
- Blueprint chỉ liệt kê footer trong bảng CMP của các màn PUB. Các màn app / account / funnel dùng footer theo shell (SYS-NAV §1: "mọi trang public + app"). Người viết SCR các màn đó nên ghi một dòng "footer theo shell (GC-SiteFooter)" để không bị hiểu là màn không có footer.
- **Cần owner xác nhận:** SCR-AUTH-01, SCR-TEST-02 và SCR-PAY-01 ghi "không footer site". GC này dùng `compact` ở các màn funnel vì SYS-NAV §1 đặt "Cookie settings" ở footer của mọi trang. Cách đọc ở đây: "không footer site" = không có `full`. Nếu owner muốn funnel không có dải link nào thì phải bỏ `compact` và sửa SYS-NAV §1 cho khớp.
- SCR-TEST-01 là ngoại lệ không có footer, nên "Cookie settings" không có trên màn làm bài.
- Đề xuất, chưa áp dụng: thêm link "Manage or cancel your plan" vào footer để việc huỷ dễ tìm như lúc mua (đối thủ có "Cancel Subscription" ở footer, EV-TLW-014). Cần human quyết và SYS-NAV §1 thêm hàng.
- `disclaimer` và `company-line` là copy đề xuất. Pháp nhân / địa chỉ là placeholder tới khi Q-05 chốt, domain theo Q-01.
