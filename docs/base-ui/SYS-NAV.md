# SYS-NAV — hệ điều hướng · route table · sơ đồ màn theo nền tảng
> Owner: CẠNH (`NAV-…`) định nghĩa ở SCR §2.2 của màn NGUỒN; route ở SCR meta. File này sở hữu KHUNG (§1), TỪ VỰNG (§2–3), ROUTE TABLE (§4). §5–7 là bản SINH (`navmap.py . write`), không sửa tay. Sản phẩm chỉ có **Web**; iOS / Android ngoài scope.
**Changelog** (mới nhất trước)
- 2026-09-28 · v1.4 · claude-opus-5-5 · route SCR-PAY-05: thêm lối vào từ email nhắc gia hạn (API-MAIL-03, `?order=`).
- 2026-09-28 · v1.3 · claude-opus-5-5 · route table: SCR-APP-01 vào từ email nhắc check-in hằng tuần (API-MAIL-10) và `/app#checkin` (Q-22).
- 2026-09-28 · v1.2 · claude-opus-5-5 · footer: link huỷ / rút có ở mọi trang có footer; SCR-TEST-01 (runner) không có footer theo thiết kế, là ngoại lệ có chủ đích. SCR-PUB-02 `?topic=` render theo request (Q-09).
- 2026-09-28 · v1.1 · claude-opus-5-5 · Q-18 · Q-25 (chốt 2026-09-28, AI · uỷ quyền human): footer thêm "Cancel your plan here" · "Withdraw from contract here" → SCR-PAY-05; route table thêm SCR-PAY-05 `/cancel`.
- 2026-09-27 · v1 · claude-opus-5-5 · khởi tạo từ `00-overview §3` + `final-features §7`.

## 1. Khung theo nền tảng / viewport

| Nền tảng | Vùng | Mục (nhãn verbatim · thứ tự) | Root SCR | Luật back ở root | Basis |
|---|---|---|---|---|---|
| Web | Header public @≥768 | logo "TestLib" | SCR-PUB-01 | back trình duyệt → trang trước trong history (có thể rời site) | in-house |
| Web | Header public @≥768 | "Tests" | SCR-PUB-02 | back trình duyệt → trang trước | in-house |
| Web | Header public @≥768 | "Pricing" | SCR-PUB-04 | back trình duyệt → trang trước | in-house |
| Web | Header public @≥768 | "Help" | SCR-PUB-06 | back trình duyệt → trang trước | in-house |
| Web | Header public @≥768 | "Sign in" | SCR-AUTH-01 | back trình duyệt → trang trước | in-house |
| Web | Drawer public @390 | ☰ → "Tests" · "Pricing" · "Help" · "Sign in" (cùng thứ tự) | SCR-PUB-02 · SCR-PUB-04 · SCR-PUB-06 · SCR-AUTH-01 | drawer đóng bằng ✕ / Esc / chạm scrim; back trình duyệt khi drawer mở → đóng drawer trước | RS·F-27 (đối thủ: hamburger @390, EV-TLW-203) |
| Web | Footer (mọi trang public + app) | "Privacy" · "Terms" · "Subscriptions & refunds" · "Cookie policy" | SCR-PUB-05 | back trình duyệt → trang trước | in-house |
| Web | Footer (mọi trang public + app) | "Help" | SCR-PUB-06 | back trình duyệt → trang trước | GC-SiteFooter |
| Web | Footer (mọi trang) | "Cookie settings" | SCR-PUB-07 | back trình duyệt → trang trước | SYS-CONSENT |
| Web | Footer (mọi trang có footer, cả `compact` của funnel; SCR-TEST-01 không có footer nên không có link này — từ đó vẫn tới được qua mọi trang khác và email biên nhận) | "Cancel your plan here" → `/cancel` · "Withdraw from contract here" → `/cancel?mode=withdraw` | SCR-PAY-05 | back trình duyệt → trang trước | BR-APP-04 · BR-APP-14 · Q-25 |
| Web | Header app @≥768 | "Home" | SCR-APP-01 | back trình duyệt → trang trước | in-house |
| Web | Header app @≥768 | "Tests" | SCR-PUB-02 | back trình duyệt → trang trước | in-house |
| Web | Header app @≥768 | "My reports" | SCR-APP-02 | back trình duyệt → trang trước | in-house |
| Web | Menu avatar (header app) | "Account" | SCR-ACC-01 | back trình duyệt → trang trước | in-house |
| Web | Menu avatar (header app) | "Plan & billing" | SCR-PAY-03 | back trình duyệt → trang trước | in-house |
| Web | Drawer app @390 | ☰ → "Home" · "Tests" · "My reports" · "Account" · "Plan & billing" | SCR-APP-01 · SCR-PUB-02 · SCR-APP-02 · SCR-ACC-01 · SCR-PAY-03 | như drawer public | RS·F-27 (đối thủ: hamburger member @390, EV-TLW-258) |

> Không có bottom nav: sản phẩm là "đọc + làm bài" nên các mục không cần chạm liên tục (đối thủ cũng không có bottom nav ở 390, EV-TLW-203 · EV-TLW-258).

## 2. Kiểu chuyển → hành vi

| Kiểu | Dùng khi | Web @390 | Web @≥768 | URL / history mặc định | Back / đóng mặc định | Animation mặc định | Basis |
|---|---|---|---|---|---|---|---|
| `push` | sang trang mới | route mới, cuộn về đầu | như 390 | route mới (push) | back trình duyệt → trang trước, khôi phục vị trí cuộn | none (không animation giữa trang) | navigation-guide §4.2 |
| `replace` | sau hành động hoàn tất (nộp bài → kết quả, huỷ gói xong, đăng nhập xong) | route mới | như 390 | **replace** (không để lại entry) | back trình duyệt KHÔNG quay lại trang cũ | none | navigation-guide §4.2 · tránh bẫy back (RS·F-19) |
| `tab` | mục header / drawer | route mới | như 390 | route mới (push) | back trình duyệt → mục trước | none | navigation-guide §4.2 |
| `inline` | nội dung trong cùng trang đổi (câu hỏi kế tiếp, lọc, mở mục lục) | cập nhật tại chỗ | như 390 | không đổi URL, hoặc `?query` (replace) nếu cần chia sẻ | — | fade ≤ 150 ms (tắt khi `prefers-reduced-motion`) | in-house |
| `overlay` | toast / banner không chặn (consent banner, "Saved") | đáy màn, full width | góc dưới trái, tối đa 480 px | không đổi URL | tự tắt (toast 4 s) / nút đóng | fade | in-house |
| `external` | checkout của provider · Google OAuth · tải PDF · link nguồn hỗ trợ · mở email | cùng tab (checkout, OAuth) / tab mới (nguồn hỗ trợ) / tải file | như 390 | rời domain hoặc tải file | back trình duyệt quay lại trang nguồn | — | in-house |
| `modal` · `sheet` · `dialog` | **không dùng trong MVP**: luồng xác nhận là trang riêng có route (00-overview §3) | — | — | — | — | — | in-house |

## 3. Animation preset — chỉ khi lệch `mặc định`

| Preset | Người dùng thấy gì | Web | Thời lượng · easing | `prefers-reduced-motion` → | Basis |
|---|---|---|---|---|---|
| — | không có preset riêng trong MVP; mọi cạnh dùng `mặc định` hoặc `none` | — | — | — | in-house |

## 4. Route table

| SCR-ID | route | access | redirect khi thiếu quyền | indexable | layout / shell | vào từ ngoài (deep link: email · share · SEO) | Notes |
|---|---|---|---|---|---|---|---|
| SCR-PUB-01 | `/` | public | — | index | public | — | root |
| SCR-PUB-02 | `/tests` · `/tests?topic=<topic>` | public | — | index | public | — | root; `?topic=` render theo request, CDN cache theo `topic` (Q-09) |
| SCR-PUB-03 | `/tests/:slug` | public | — | index | public | SEO (trang đích tìm kiếm cho từng bài) · link chia sẻ | bài `sensitive`: không script analytics (BR-APP-06) |
| SCR-PUB-04 | `/pricing` | public | — | index | public | SEO | root |
| SCR-PUB-05 | `/legal/:doc` (`privacy` · `terms` · `subscriptions` · `cookies`) | public | — | index | public | — | từ footer |
| SCR-PUB-06 | `/help` | public | — | index | public | SEO | root |
| SCR-PUB-07 | `/cookie-settings` | public | — | noindex | public | — | từ footer + GC-ConsentBanner |
| SCR-TEST-01 | `/tests/:slug/take` | guest | — (khách được); attempt của người khác → bắt đầu attempt mới | noindex | funnel (chỉ logo + ✕) | — | |
| SCR-TEST-02 | `/results/:resultId` | guest | token không khớp / hết hạn → trang 410 thân thiện (cong-nghe-loi §3) | noindex | funnel | email "View your results" (API-MAIL-01) | chủ sở hữu: token `tl_guest` hoặc tài khoản |
| SCR-PAY-01 | `/unlock/:resultId` | guest | như SCR-TEST-02 | noindex | funnel | — | |
| SCR-PAY-02 | `/checkout/return?session=<id>` | guest | phiên checkout không thuộc trình duyệt/tài khoản → state Locked tại chỗ (không redirect); thiếu `session` → `/` | noindex | funnel | provider return URL (sau checkout) | |
| SCR-PAY-03 | `/account/billing` | account | `/login?next=/account/billing` | noindex | app | email nhắc gia hạn / thanh toán thất bại | root (menu avatar) |
| SCR-PAY-04 | `/account/billing/cancel` | account | `/login?next=/account/billing/cancel` | noindex | app | email nhắc gia hạn "Cancel renewal" (API-MAIL-03) | |
| SCR-PAY-05 | `/cancel` · `/cancel?order=<orderNumber>` · `/cancel?mode=withdraw` · `/cancel?mode=withdraw&order=<orderNumber>` | public | — (không cần đăng nhập; có phiên thì điền sẵn email + mã đơn) | index | public | email biên nhận "Withdraw from contract here" (API-MAIL-02) · email nhắc gia hạn "Cancel without signing in" (API-MAIL-03, `/cancel?order=<orderNumber>`) · SEO ("cancel [brand]") | BR-PAY-18 · Q-25 |
| SCR-AUTH-01 | `/login` · `/login?next=<route>` · `/login?error=<code>` · `/login/callback?token=…` · `/login/callback?provider=google&next=…` | public | đã đăng nhập → `next` hoặc `/app` | noindex | minimal (logo) | email magic link (API-MAIL-01) | callback không có UI riêng; lỗi callback → `/login?error=` |
| SCR-APP-01 | `/app` · `/app#checkin` | account | `/login?next=/app` | noindex | app | email nhắc check-in hằng tuần (API-MAIL-10) · `/app#checkin` từ SCR-ACC-01 (NAV-ACC-01-8) | root; `#checkin` mở sẵn bước bật check-in khi chưa bật (Q-22) |
| SCR-APP-02 | `/app/reports` | account | `/login?next=/app/reports` | noindex | app | — | root |
| SCR-APP-03 | `/app/reports/:reportId` (+ `?print=1` cho render PDF) | entitled | không có phiên VÀ không có token khách sở hữu kết quả → `/login?next=…`; có quyền xem nhưng chưa mở khoá → state Locked (không redirect) | noindex | app (khách: header `minimal`) | email "Your report is unlocked" (API-MAIL-02) | khách đã mua trên trình duyệt này đọc được không cần đăng nhập (SYS-AUTH) |
| SCR-ACC-01 | `/account` | account | `/login?next=/account` | noindex | app | — | root |
| SCR-ACC-02 | `/account/delete` | account | `/login?next=/account/delete` | noindex | app | — | |

## 5. Bảng cạnh (SINH)

<!-- navmap:table -->
<!-- /navmap -->

## 6. Sơ đồ màn — mind map (SINH)

### Web
<!-- navmap:mindmap web -->
<!-- /navmap -->

## 7. Sơ đồ điều hướng — graph (SINH)

### Web
<!-- navmap:flowchart web -->
<!-- /navmap -->

## 8. AI Notices
- iOS/Android: ngoài scope (G-scope), không có sơ đồ.
- §5–7 được sinh lại bằng `python3 "$XTRD/scripts/prov/navmap.py" . write` mỗi khi SCR §2.2 đổi.
