# [SCR-AUTH-01] Đăng nhập
**Meta**

| id | module | doc level | platforms | route | access | indexable | viewports | related FLOW | status | design | tracking | api | Evidence / visual basis |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| SCR-AUTH-01 | AUTH | Short | Web | `/login` · `/login?next=<route>` · `/login/callback?token=…` | public | noindex | 390 · 768 · 1280 | FLOW-luu-ket-qua-dang-nhap | Draft | (sau design) | `tracking-events.md` → `login` · ft_auth | `docs/api/SCR-AUTH-01-api.md` | **EV-TLW-006 · SC-TLW-02 · basis RS·F-20 · Q-11 · SYS-AUTH** |

**Changelog** (mới nhất trước)
- 2026-09-28 · v1.2 · claude-opus-5-5 · Q-11 (magic link + Google, không mật khẩu) và Q-16 (Postmark gửi API-MAIL-01) đã chốt 2026-09-28: bỏ notice "Chưa FREEZE", ghi vendor email ở §1. Notice cũ về SYS-NAV §4 sửa (đã ghi cả hai biến thể callback).
- 2026-09-28 · v1.1 · claude-opus-5-5 · AI Notice cũ: link "Privacy" đã có NAV-AUTH-01-5.
- 2026-09-27 · v1 · claude (subagent) · khởi tạo từ blueprint.

## 1. Purpose

Đăng nhập không mật khẩu: magic link qua email (API-MAIL-01, gửi bằng Postmark — Q-16) hoặc Google (Q-11). Một màn dùng cho cả người mới (tài khoản được tạo khi link được xác minh) lẫn người quay lại, kể cả khi guard chuyển tới kèm `?next=`. Đối thủ dùng email + mật khẩu, không có social login, tài khoản chỉ sinh ra sau khi thanh toán (RS·F-20 · EV-TLW-006). Trang `/login/callback` thuộc màn này và không có UI riêng ngoài trạng thái đang xác thực. · basis RS·F-20 · Q-11 · SYS-AUTH

## 2. Điều hướng

### 2.1 Vào

Một cạnh NAV tới màn này; các đường vào còn lại là shell, guard hoặc link ngoài:

| Vào qua | Từ | Trigger |
|---|---|---|
| NAV-TEST-02-8 | SCR-TEST-02 | "Sign in" (state Error / Locked, `next=/results/:resultId`) |
| shell | mọi trang public | "Sign in" ở header public / drawer @390 (SYS-NAV §1) |
| guard | route `account` / `entitled` khi chưa có phiên | redirect `/login?next=<route>` (tieu-chuan-chung §1 · SYS-AUTH) |
| email | link trong email API-MAIL-01: đăng nhập, hoặc "View your results" khi lưu kết quả ở SCR-TEST-02 | mở `/login/callback?token=…` (SYS-NAV §4) |
| Google | quay về từ Google sau "Continue with Google" | API-AUTH-04 chuyển tới `/login/callback` |

### 2.2 Ra

| NAV-ID | Tới (SCR-ID · tham số) | Trigger (CMP-ID "nhãn") | Kiểu | URL / history | Animation | Back / đóng → | Guard / điều kiện | Nền tảng | Basis |
|---|---|---|---|---|---|---|---|---|---|
| NAV-AUTH-01-1 | (cùng màn) trạng thái đã gửi link | CMP-04 "Email me a sign-in link" | inline | không đổi URL | mặc định | — | email hợp lệ | Web | BR-APP-10 |
| NAV-AUTH-01-2 | external: trang đăng nhập Google | CMP-05 "Continue with Google" | external | rời domain, cùng tab | mặc định | back trình duyệt → SCR-AUTH-01 | — | Web | Q-11 |
| NAV-AUTH-01-3 | SCR-APP-01 | hệ thống: callback thành công (magic link / Google), không có `next` | replace | `/login/callback` → `/app` (replace) | mặc định | back trình duyệt → trang trước login | có `next` hợp lệ (cùng origin) → chuyển tới `next` thay vì SCR-APP-01 | Web | SYS-AUTH |
| NAV-AUTH-01-4 | SCR-PUB-05 · `doc=terms` | CMP-07 "Terms" | push | `/legal/terms` (push) | mặc định | back trình duyệt → SCR-AUTH-01 | — | Web | in-house |
| NAV-AUTH-01-5 | SCR-PUB-05 · `doc=privacy` | CMP-07 "Privacy" | push | `/legal/privacy` (push) | mặc định | back trình duyệt → SCR-AUTH-01 | — | Web | in-house |

## 3. Layout & components

- **Bố cục @390 (top→bottom):**
  - header tối giản (chỉ logo);
  - H1 + câu phụ;
  - ô "Email" → nút "Email me a sign-in link" (full width);
  - dải "or";
  - nút "Continue with Google" (full width);
  - ghi chú pháp lý + link "Terms" · "Privacy".
  - Sau khi gửi link: panel "Check your inbox" (CMP-06) thay chỗ form.
  - Không nav, không footer site (layout `minimal`, SYS-NAV §4).

| CMP-ID | Component | Type / GC- | Behavior & rules | Basis (EV / Q / in-house) |
|---|---|---|---|---|
| CMP-01 | Header tối giản | logo | chỉ logo "TestLib" → `/` (shell, SYS-NAV §1); không menu | SYS-NAV §4 |
| CMP-02 | Tiêu đề | H1 + câu phụ | "Sign in to TestLib" · "No password needed — we'll email you a link." | Q-11 |
| CMP-03 | Ô "Email" | input `type="email"`, `autocomplete="email"` | label "Email" luôn hiện; kiểm định dạng khi submit (và khi blur nếu đang báo lỗi): "Enter a valid email address."; trim + lowercase trước khi gửi | tieu-chuan-chung §5 · BR-AUTH-03 |
| CMP-04 | Nút "Email me a sign-in link" | button chính | gọi API-AUTH-01 kèm `next`; đang gửi → spinner + disable; xong → CMP-06 (NAV-AUTH-01-1) | BR-APP-10 · BR-AUTH-03 |
| CMP-05 | Nút "Continue with Google" | button phụ, dưới dải "or" | điều hướng trình duyệt tới API-AUTH-03 kèm `next` (NAV-AUTH-01-2) | Q-11 |
| CMP-06 | Trạng thái đã gửi | panel thay form | "Check your inbox" · "We sent a sign-in link to [email]. It expires in 15 minutes." · "Can't find it? Check your spam folder." · nút "Resend link" (bấm được sau 30 s; trước đó hiện "Resend link in [s]s") · link "Use a different email" (về lại form, không đổi URL) | BR-AUTH-01 · BR-AUTH-03 |
| CMP-07 | Ghi chú pháp lý | đoạn nhỏ + 2 link | "By continuing, you agree to our Terms." — "Terms" là link (NAV-AUTH-01-4); link thứ hai "Privacy" (NAV-AUTH-01-5) | in-house |

## 4. States

| State | Trigger | Hiển thị | EV / basis |
|---|---|---|---|
| Default | chưa có phiên | CMP-01…05 + CMP-07 | EV-TLW-006 |
| Loading | đang gửi link (API-AUTH-01) · đang xác thực ở `/login/callback` (API-AUTH-02, hoặc vừa quay về từ Google) | nút CMP-04 có spinner + disable · callback: "Signing you in…" (chỉ hiện khi > 300 ms) | tieu-chuan-chung §3 |
| Empty | N/A — form luôn có | — | in-house |
| Error | email sai định dạng · link hết hạn / đã dùng · 429 | "Enter a valid email address." · "This link has expired. We've sent you a new one." (panel CMP-06, không kèm địa chỉ email) · "Too many requests. Please wait a moment and try again."; lỗi Google và link không hợp lệ: xem `docs/api/SCR-AUTH-01-api.md` | BR-AUTH-01 · tieu-chuan-chung §2 |
| Locked | đã đăng nhập | không render form: replace tới `next` hợp lệ hoặc `/app` | SYS-NAV §4 · BR-AUTH-02 |

## 5. API

| API | Method | When called |
|---|---|---|
| API-AUTH-01 | POST | bấm CMP-04 hoặc "Resend link" |
| API-AUTH-02 | POST | `/login/callback?token=…` mở ra; JS gọi ngay (không phải GET) |
| API-AUTH-03 | GET (redirect) | bấm CMP-05; trình duyệt điều hướng tới endpoint, không phải fetch |
| API-AUTH-04 | GET | Google trả về; server xử lý rồi chuyển về `/login/callback` |

Chi tiết schema và lỗi riêng → `docs/api/SCR-AUTH-01-api.md`.

## 6. Tracking

| Event | Note |
|---|---|
| `screen_active` · `login` | sau consent; `/login/callback` không bắn `screen_active` riêng |
| ft_auth · start | SCR-AUTH-01 hiện; `has_next` = true / false; `from` = header / guard / result |
| ft_auth · magic_link_sent | API-AUTH-01 trả về (success / fail), kể cả khi bấm "Resend link" |
| ft_auth · login | phiên tạo xong ở `/login/callback` (API-AUTH-02 hoặc sau API-AUTH-04), trước khi replace; `method` = `magic_link` / `google` |

## 7. Business rules & edge cases

| BR-ID | Rule | Basis |
|---|---|---|
| BR-AUTH-01 | Magic link hết hạn 15 phút, 1 lần (BR-APP-10) | BR-APP-10 · SYS-AUTH |
| BR-AUTH-02 | `next` chỉ nhận đường dẫn cùng origin (chống open redirect) | in-house · SYS-AUTH |
| BR-AUTH-03 | Không tiết lộ email có tồn tại hay không — luôn "Check your inbox" | in-house · Q-11 |

| EC-xx | Tình huống | Handling | Basis |
|---|---|---|---|
| EC-01 | `next` không hợp lệ (có scheme, bắt đầu bằng `//` hoặc `\`, khác origin) | bỏ `next`; đăng nhập xong về `/app` | BR-AUTH-02 |
| EC-02 | User bấm link ở tab khác, tab gốc còn ở CMP-06 | tab gốc nhận tín hiệu đăng nhập (sự kiện `storage`) và tự replace tới `next` hoặc `/app` | tieu-chuan-chung §1 |
| EC-03 | Mở link trên thiết bị / trình duyệt khác | đăng nhập ở nơi mở link; `next` lưu kèm token ở server nên vẫn về đúng trang; tab gốc không đổi | SYS-AUTH |
| EC-04 | Link hết hạn hoặc đã dùng ở nơi khác | server gửi link mới (tính vào giới hạn gửi lại của SYS-AUTH) → `/login?error=link_expired` (replace) hiện "This link has expired. We've sent you a new one." trong panel CMP-06, không kèm địa chỉ email | BR-AUTH-01 · SYS-AUTH |
| EC-05 | Bấm lại link đã dùng trên chính trình duyệt đang đăng nhập bằng link đó | coi là thành công, về `next` hoặc `/app` | in-house |
| EC-06 | Trình quét link của hộp thư mở link trước user | token chỉ bị tiêu khi `/login/callback` gọi API-AUTH-02 bằng POST từ JS; request GET của trình quét không tiêu token | in-house |
| EC-07 | Có kết quả khách chưa gắn tài khoản | khi phiên được tạo, gộp vào tài khoản mọi kết quả của `tl_guest` trên trình duyệt đang đăng nhập; link "lưu kết quả" của SCR-TEST-02 thì gộp thêm token khách đã gửi yêu cầu (lưu kèm link) | SYS-AUTH · BR-APP-08 |
| EC-08 | Email Google trùng email của tài khoản đã có | gộp vào tài khoản đó, không tạo tài khoản thứ hai | SYS-AUTH |
| EC-09 | Tài khoản đang trong 30 ngày chờ xoá | đăng nhập = khôi phục; trang đích hiện banner "Welcome back — your account has been restored." | BR-APP-11 |
| EC-10 | Token nằm trên URL callback | trang callback gửi `Referrer-Policy: no-referrer`, xoá `token` khỏi URL (replace) ngay khi đọc, không tải analytics trước khi xoá | in-house · BR-APP-05 |

## 8. Responsive deltas

| Aspect | 390 (gốc) | 768 | 1280 |
|---|---|---|---|
| Khối form | full width, padding 16, nút ≥ 44 px | thẻ căn giữa, rộng tối đa 400 | như 768 |
| Header | chỉ logo | chỉ logo | chỉ logo |

## 9. Keyboard & focus

Mở trang thì focus sẵn ở ô "Email" (trang chỉ có một việc). Enter trong ô Email = bấm CMP-04. Sau khi gửi, focus chuyển tới tiêu đề "Check your inbox" (`tabindex="-1"`, đọc qua `aria-live="polite"`); "Resend link" khi còn khoá dùng `aria-disabled` và đọc số giây còn lại. Còn lại theo `tieu-chuan-chung §5`.

## 10. AI Notices
- Link "Privacy" ở CMP-07 đã có cạnh NAV-AUTH-01-5 (→ SCR-PUB-05 `doc=privacy`); sơ đồ tổng `00-so-do-luong-tong` cập nhật 2026-09-28.
- Rủi ro: link mở trong trình duyệt nhúng của app email thì phiên nằm ở trình duyệt đó, không phải trình duyệt gốc. Nếu đo thấy nhiều, cân nhắc thêm mã đăng nhập 6 số (cần một quyết định mới trong bảng quyết định).
- Luồng Google quay về `/login/callback?provider=google…` (chi tiết ở file API); SYS-NAV §4 ghi cả hai biến thể của callback.
- Q-11 (mô hình auth) và Q-16 (Postmark gửi API-MAIL-01) đã chốt 2026-09-28; màn không còn chờ quyết định. Magic link hết hạn sau 15 phút nên đăng nhập phụ thuộc email tới nhanh: theo dõi độ trễ giao email của Postmark như một chỉ số vận hành (SYS-AUTH).
