# GC-ConsentBanner — banner hỏi consent cookie ở lần đầu (consent-first)
**Changelog** (mới nhất trước)
- 2026-09-28 · v1.1 · claude-opus-5-5 · D-18: `consentId` đi trong header `Idempotency-Key` của API-CON-01 (schema ở SCR-PUB-07 §5).
- 2026-09-27 · v1 · claude (subagent) · khởi tạo.

## 1. Anatomy (CMP con)

Banner không chặn trang (kiểu `overlay`, SYS-NAV §2). Nó hiện trên mọi trang cho tới khi trình duyệt có một lựa chọn hợp lệ. Trước khi user chọn, chỉ cookie `necessary` được dùng: không tải SDK analytics, không có request bên thứ ba (SYS-CONSENT · BR-APP-05).

| CMP con | Thành phần | Nội dung / copy verbatim (en-US) | Ghi chú |
|---|---|---|---|
| `title` | heading, `type.h3` | "Your cookie choices" | |
| `update-note` | 1 câu, chỉ variant `re-ask` | "We've updated how we use cookies, so we're asking again." | nằm trên `body` |
| `body` | đoạn chữ, `type.body-sm`, `color.text` | "We use necessary cookies to make this site work. With your permission, we'd also like to use analytics cookies to understand how the site is used. We don't use marketing cookies yet. Your answers never go to advertisers. You can change your choice anytime in Cookie settings." | "Your answers never go to advertisers." trùng nguyên văn SCR-PUB-01 CMP-06; câu về marketing khớp mô tả nhóm "Marketing" ở SCR-PUB-07 CMP-03 |
| `policy-link` | link trong `body` | "Cookie policy" | → `/legal/cookies` (SCR-PUB-05), push |
| `accept` | nút | "Accept all" | analytics + marketing = granted |
| `reject` | nút | "Reject all" | analytics + marketing = denied |
| `manage` | link dạng nút (điều hướng) | "Manage" | → `/cookie-settings` (SCR-PUB-07), push |
| `live-region` | vùng thông báo ẩn (`aria-live="polite"`) | "Your cookie choices are saved." | đọc cho screen reader sau khi chọn; cùng câu với toast của SCR-PUB-07 |

Khung: nền `color.surface`, viền `color.border`, `shadow.overlay`; ba nút cùng một kiểu (viền, `radius.md`, `type.body-sm`).

## 2. Props / variants

| Variant | Khi dùng | Khác biệt |
|---|---|---|
| `default` | chưa có cookie `tl_consent` hợp lệ trên trình duyệt | đủ CMP con, trừ `update-note` |
| `re-ask` | cookie có version cũ hơn version hiện hành, hoặc đã quá 12 tháng | thêm `update-note`; mặc định vẫn là tắt, không giữ lựa chọn cũ làm sẵn |

| Prop | Kiểu | Mặc định | Ý nghĩa |
|---|---|---|---|
| `consentVersion` | string | version hiện hành (cấu hình build) | so với version ghi trong cookie `tl_consent` |
| `stored` | `{ version, analytics, marketing, decidedAt, consentId }` hoặc null | đọc từ cookie `tl_consent` | null hoặc version cũ → hiện banner |
| `isSensitiveRoute` | boolean | false | true trên route của bài `sensitive` → vẫn lưu lựa chọn nhưng không tải SDK, không bắn event |
| `suppressed` | boolean | true trên SCR-PUB-07 | trang cài đặt cookie tự là giao diện chọn nên không hiện banner |

## 3. States (5) + hover / focus / disabled

| State | Khi nào | Hiển thị / hành vi | Basis |
|---|---|---|---|
| Default | chưa có lựa chọn hợp lệ | banner đủ CMP con | SYS-CONSENT |
| Loading | N/A — banner không chờ mạng: render từ cookie cục bộ; bấm nút thì ghi cookie ngay, API-CON-01 chạy nền | — | SYS-CONSENT |
| Empty | đã có lựa chọn hợp lệ, hoặc đang ở SCR-PUB-07 | không render banner | SYS-CONSENT |
| Error | API-CON-01 lỗi; trình duyệt chặn cookie | API lỗi: không báo gì trên banner, thử lại ngầm ở lần tải trang sau (cùng `consentId`, idempotent). Chặn cookie: lựa chọn chỉ giữ trong bộ nhớ của trang hiện tại; lần tải sau banner hiện lại và không tải gì khi chưa được chọn lại | api-mapping (API-CON-01) · cong-nghe-loi §3 |
| Locked | N/A — banner dành cho mọi người, không có nội dung khoá | — | Q-13 |
| hover | con trỏ trên nút | cả ba nút đổi nền giống hệt nhau (`color.surface-muted`) để giữ ngang hàng | BR-PUB-13 |
| focus | focus bàn phím | `focus.ring` trên nút / link; phần tử đang focus không bị chính banner che (xem §4) | tieu-chuan-chung §5 |
| disabled | ngay sau khi bấm một nút | cả ba nút khoá trong lúc ghi (chống bấm hai lần), rồi banner ẩn | in-house |

## 4. Behavior & rules (BR nếu có)

GC hiện thực BR-APP-05 và các BR của SCR-PUB-07 (BR-PUB-13 · BR-PUB-14) cho lần hỏi đầu.

| Rule | Mô tả | Basis |
|---|---|---|
| Khi nào hiện | chưa có cookie `tl_consent` hợp lệ, hoặc version cũ, hoặc đã quá 12 tháng; ở mọi vùng; mọi route trừ SCR-PUB-07 | Q-13 · SYS-CONSENT · cong-nghe-loi §4 |
| Mặc định tắt | trước khi chọn: chỉ `necessary`; analytics + marketing = denied; không tải SDK; 0 request bên thứ ba | BR-APP-05 · tieu-chuan-chung §9 · §10 · TD-04 |
| Ngang hàng | "Accept all" và "Reject all" cùng kiểu, cùng kích thước, cùng độ đậm, cùng hàng; "Manage" cũng cùng kiểu; không nút nào được tô nổi hơn | BR-PUB-13 · tieu-chuan-chung §10 |
| Không chặn trang | không scrim, không khoá cuộn, không `aria-modal`; trang vẫn dùng bình thường khi banner đang mở | SYS-NAV §2 |
| Không có ✕ | không có nút đóng; bỏ qua banner = chưa đồng ý (vẫn denied), banner hiện lại ở trang sau | in-house |
| "Accept all" | analytics + marketing = granted → ghi cookie `tl_consent` (12 tháng) → ẩn banner → gọi API-CON-01 chạy nền → `AppTracking` tải SDK (nếu route không phải bài `sensitive`) → bắn ft_consent start (`from` = banner) + save (`analytics` = granted, `marketing` = granted) → bắn screen_active cho route hiện tại một lần | BR-PUB-14 · SYS-CONSENT · tracking-events |
| Không đệm event | không gom rồi phát lại event xảy ra trước consent | BR-APP-05 |
| "Reject all" | analytics + marketing = denied → ghi cookie + API-CON-01 → ẩn banner; không SDK, không event nào (kể cả ft_consent) | tracking-events · BR-APP-05 |
| "Manage" | push tới `/cookie-settings`; lưu ở trang đó thì banner hết ở mọi trang | SYS-CONSENT |
| Route bài `sensitive` | vẫn hiện banner nếu chưa chọn; "Accept all" thì lưu lựa chọn nhưng KHÔNG tải SDK và KHÔNG bắn ft_consent trên route này (không hoãn sang route sau) | BR-APP-06 · SYS-CONSENT |
| Lưu trước, đồng bộ sau | cookie ghi ngay nên lựa chọn có hiệu lực tức thì; API-CON-01 gửi `consentId` (UUID client, đi trong header `Idempotency-Key` — 00-quy-uoc-api §5; schema ở SCR-PUB-07 §5), version, lựa chọn, thời điểm, nguồn (`banner`) | API-CON-01 · SYS-CONSENT |
| Thứ tự DOM & focus | banner đặt ở đầu DOM (ngay sau skip link của GC-SiteHeader), `role="region"` + accessible name "Cookie choices"; không tự lấy focus; chọn xong thì focus về đầu `<main>` và `live-region` đọc "Your cookie choices are saved." | tieu-chuan-chung §5 |
| Không che nội dung | khi banner mở, trang chừa khoảng dưới bằng chiều cao banner và đặt `scroll-padding-bottom` tương ứng để phần tử đang focus không bị che; thanh dính đáy của màn (vd SCR-PUB-03 @390) nằm trên banner | tieu-chuan-chung §5 (WCAG 2.2 AA) |
| First-party | banner là code của mình, không dùng CMP bên thứ ba; không tải font / ảnh từ domain khác | TD-04 · tieu-chuan-chung §9 |
| JS tắt | không render banner (không script không-thiết-yếu nào chạy được) | cong-nghe-loi §3 |
| Hỏi lại | đổi nội dung banner / chính sách → tăng version → hiện variant `re-ask` | SYS-CONSENT (Version) |

## 5. Dùng ở màn nào (SCR-IDs)

| SCR-ID | Có hiện? | Ghi chú |
|---|---|---|
| SCR-PUB-01 · SCR-PUB-02 · SCR-PUB-04 · SCR-PUB-05 · SCR-PUB-06 | có, tới khi chọn | — |
| SCR-PUB-03 | có, tới khi chọn | bài `sensitive`: lưu lựa chọn, không tải SDK |
| SCR-PUB-07 | không | trang tự là nơi chọn (CMP-03 … CMP-06) |
| SCR-TEST-01 · SCR-TEST-02 | có, tới khi chọn | bài `sensitive`: không tải SDK, không event (BR-APP-06); ở 390 trang chừa khoảng dưới để banner không che 5 đáp án |
| SCR-PAY-01 · SCR-PAY-02 · SCR-PAY-03 · SCR-PAY-04 | có, tới khi chọn | — |
| SCR-AUTH-01 | có, tới khi chọn | — |
| SCR-APP-01 · SCR-APP-02 · SCR-APP-03 | có, tới khi chọn | SCR-APP-03 của bài `sensitive`: như SCR-PUB-03 |
| SCR-ACC-01 · SCR-ACC-02 | có, tới khi chọn | — |

## 6. Responsive

| Aspect | 390 (gốc) | 768 (`bp.md`) | 1280 (`bp.lg`) |
|---|---|---|---|
| Vị trí | đáy màn, rộng hết màn (SYS-NAV §2, kiểu `overlay`) | góc dưới trái, độ rộng tối đa theo SYS-NAV §2 | như 768 |
| Nút | 3 nút cùng hàng, rộng bằng nhau; nếu chữ phóng to không vừa thì xếp chồng theo thứ tự "Accept all" · "Reject all" · "Manage" | 3 nút cùng hàng | như 768 |
| Khung | viền trên `color.border`, không bo góc | `radius.lg` | như 768 |
| Vùng chạm | mỗi nút đạt `layout.touch-target` (tieu-chuan-chung §5) | như 390 | như 390 |

## 7. Basis (EV / Q)

| Quyết định | Basis |
|---|---|
| Có banner, hỏi trước khi tải bất kỳ thứ gì (đối thủ không có banner, pixel quảng cáo chạy ngay lần đầu) | RS·F-02 · EV-TLW-002 · EV-TLW-015 · Q-13 |
| 0 request bên thứ ba trước consent (đối thủ tải 30 request bên thứ ba) | tieu-chuan-chung §9 · EV-TLW-262 |
| "Reject all" ngang hàng "Accept all" | BR-PUB-13 · tieu-chuan-chung §10 |
| Không pixel quảng cáo; câu trả lời không rời hệ thống (đối thủ bắn pixel theo từng câu) | BR-APP-05 · Q-12 · RS·F-13 · EV-TLW-059 |
| Route bài `sensitive` không tải analytics dù đã consent | BR-APP-06 · Q-06 |
| Lưu cookie 12 tháng + bản ghi server | SYS-CONSENT · cong-nghe-loi §4 · API-CON-01 |
| ft_consent chỉ khi analytics granted | tracking-events |

## 8. AI Notices
- Viết bởi claude (subagent) ở Phase 4 từ spec blueprint + SYS-CONSENT + tracking-events.
- Copy banner là đề xuất. Câu chữ và danh mục cookie phải khớp `go-to-market/legal-consent.md` §2–3 khi file đó được viết (tieu-chuan-chung §10).
- Link "Cookie policy" trong banner là một lối vào SCR-PUB-05 chưa có trong danh sách "Vào" của blueprint. SCR-PUB-05 nên ghi thêm "(+ GC-ConsentBanner 'Cookie policy')".
- "Accept all" ghi cả marketing = granted dù MVP chưa có script marketing nào (Q-12), để khớp nút "Accept all" ở SCR-PUB-07. Trước khi thêm bất kỳ script marketing nào phải tăng version để hỏi lại.
- Giả định: lựa chọn gắn theo trình duyệt (cookie), không đồng bộ theo tài khoản. Chưa owner doc nào nói điều này.
- Đề xuất, chưa áp dụng: tôn trọng tín hiệu Global Privacy Control (có GPC thì marketing luôn denied). Cần human quyết cùng Q-13.
- Font tự host (FND-tokens §2) là điều kiện để giữ 0 request bên thứ ba trước consent (tieu-chuan-chung §9). Đổi sang font CDN sẽ phá quy tắc "First-party" ở §4.
