# [SCR-AUTH-01] API — Đăng nhập
Refs: `docs/screens/SCR-AUTH-01-dang-nhap.md` · FLOW-luu-ket-qua-dang-nhap · SYS-AUTH · `00-quy-uoc-api.md` (envelope, lỗi chung, idempotency — KHÔNG lặp lại ở đây)
**Changelog** (mới nhất trước)
- 2026-09-28 · v1.1 · claude-opus-5-5 · Q-11 · Q-16 đã chốt 2026-09-28: API-MAIL-01 gửi qua Postmark; bỏ notice "Chưa FREEZE". Notice cũ về khoá idempotent sửa theo `api-mapping` §1.
- 2026-09-27 · v1 · claude (subagent) · khởi tạo từ blueprint.

## 0. Endpoint overview

| ID | Endpoint | Method | When called | Idempotent (key) | Contract status |
|---|---|---|---|---|---|
| API-AUTH-01 | `/v1/auth/magic-links` | POST | bấm "Email me a sign-in link" / "Resend link" | có — email chuẩn hoá + phút (request có `resend` bỏ qua cửa sổ này); rate limit theo email + IP | proposal |
| API-AUTH-02 | `/v1/auth/magic-links/verify` | POST | trang `/login/callback?token=…` mở ra | token dùng 1 lần | proposal |
| API-AUTH-03 | `/v1/auth/google/start` | GET (redirect) | bấm "Continue with Google" | n/a | proposal |
| API-AUTH-04 | `/v1/auth/google/callback` | GET | Google chuyển về sau khi user chọn tài khoản | `state` dùng 1 lần | proposal |

## API-AUTH-01 · POST `/v1/auth/magic-links`

Tạo token đăng nhập dùng một lần (server chỉ lưu hash, hết hạn 15 phút) gắn với email và `next` đã kiểm, rồi gửi email API-MAIL-01 (Postmark, message stream giao dịch — Q-16) chứa link `/login/callback?token=<token>`. **Không tạo tài khoản** ở bước này: tài khoản chỉ được tạo khi link được xác minh (API-AUTH-02). Luôn trả thành công khi email đúng định dạng, dù email đã có tài khoản hay chưa (BR-AUTH-03). Gọi lặp cùng email trong cùng một phút mà không có `resend` → trả như lần đầu, không gửi email thứ hai. Auth: không cần phiên; cần `X-CSRF-Token` (00-quy-uoc-api §2).

| Body field | Type | Required | Meaning | Basis |
|---|---|---|---|---|
| `email` | string (tối đa 254 ký tự) | có | email đăng nhập; server trim + lowercase trước khi dùng | BR-AUTH-03 · 00-quy-uoc-api §5 |
| `next` | string | không | path quay lại sau đăng nhập; chỉ nhận path tương đối cùng origin, sai thì bỏ qua (không báo lỗi) | BR-AUTH-02 |
| `resend` | boolean | không | `true` khi bấm "Resend link": bỏ qua cửa sổ idempotent theo phút, vẫn tính vào giới hạn gửi lại | BR-AUTH-01 · SYS-AUTH |
| `locale` | string | không | ngôn ngữ email, mặc định `en-US` | Q-14 |

| Response `data` field | Type | Meaning | Basis |
|---|---|---|---|
| `sent` | boolean | luôn `true` khi request hợp lệ | BR-AUTH-03 |
| `expiresInSec` | int | `900` → "It expires in 15 minutes." | BR-AUTH-01 |
| `resendAfterSec` | int | `30` → mở nút "Resend link" | in-house |

```json
{
  "code": 0, "message": "ok",
  "data": { "sent": true, "expiresInSec": 900, "resendAfterSec": 30 }
}
```

| Lỗi RIÊNG màn | When | UI reaction (verbatim) |
|---|---|---|
| 400 `invalid_email` | email sai định dạng | dưới ô Email: "Enter a valid email address." |
| 429 `too_many_requests` | vượt giới hạn gửi lại của SYS-AUTH cho một email, hoặc vượt ngưỡng theo IP (đề xuất 20 request mỗi giờ, in-house) | "Too many requests. Please wait a moment and try again."; CMP-06 giữ nguyên, "Resend link" khoá theo `Retry-After` |

## API-AUTH-02 · POST `/v1/auth/magic-links/verify`

Xác minh token từ link email. Endpoint này xác minh cả link sinh từ API-AUTH-01 lẫn link "lưu kết quả" sinh từ API-RES-02 (SCR-TEST-02) — cùng một loại token. Thành công thì: đánh dấu token đã dùng; tạo tài khoản nếu email chưa có (timezone = `timeZone` gửi kèm, BR-APP-09); tạo phiên `tl_session` (trượt 30 ngày, BR-APP-10); gộp vào tài khoản mọi kết quả của (a) token khách lưu kèm link khi link sinh từ API-RES-02 và (b) `tl_guest` của trình duyệt đang xác minh (SYS-AUTH); tài khoản đang chờ xoá thì khôi phục (BR-APP-11). Trang callback gọi endpoint này bằng POST từ JS, nên request GET của trình quét link trong hộp thư không tiêu token. Auth: không cần phiên; cần `X-CSRF-Token`.

| Body field | Type | Required | Meaning | Basis |
|---|---|---|---|---|
| `token` | string | có | giá trị `token` trên URL callback | BR-AUTH-01 |
| `timeZone` | string (IANA, vd `Asia/Ho_Chi_Minh`) | không | timezone trình duyệt; chỉ dùng khi tài khoản được tạo lần đầu | BR-APP-09 |

| Response `data` field | Type | Meaning | Basis |
|---|---|---|---|
| `next` | string | đích đã kiểm (BR-AUTH-02); không có `next` hợp lệ thì là `/app` | BR-AUTH-02 · SYS-AUTH |
| `accountRestored` | boolean | `true` khi tài khoản vừa được khôi phục khỏi trạng thái chờ xoá | BR-APP-11 |

```json
{
  "code": 0, "message": "ok",
  "data": { "next": "/account/billing", "accountRestored": false }
}
```

| Lỗi RIÊNG màn | When | UI reaction (verbatim) |
|---|---|---|
| 410 `link_expired` | token quá 15 phút, hoặc đã dùng mà request không mang phiên của cùng tài khoản | server tự gửi link mới tới email của token (tính vào giới hạn gửi lại) → `/login?error=link_expired` (replace): "This link has expired. We've sent you a new one." (không kèm địa chỉ email) |
| 400 `invalid_token` | token không tồn tại / sai định dạng | `/login?error=invalid_link` (replace): "This sign-in link isn't valid. Enter your email to get a new one." |
| 429 `too_many_requests` | link hết hạn nhưng email đã hết lượt gửi lại | `/login?error=rate_limited` (replace): "Too many requests. Please wait a moment and try again." |
| 200 (trường hợp đặc biệt) | token đã dùng nhưng request mang phiên hợp lệ của đúng tài khoản đó (user bấm link hai lần) | coi là thành công, trả `next` như bình thường |

## API-AUTH-03 · GET `/v1/auth/google/start`

Trình duyệt điều hướng thẳng tới endpoint (không phải fetch). Server kiểm `next` (BR-AUTH-02), sinh `state` ngẫu nhiên dùng một lần + PKCE `code_verifier`, lưu cùng `next` và `tz` vào cookie tạm `tl_oauth` (HttpOnly · Secure · SameSite=Lax · sống 10 phút), rồi 302 tới trang đồng ý của Google (scope `openid email profile`). Không trả envelope JSON. Auth: không cần.

| Query param | Type | Required | Meaning | Basis |
|---|---|---|---|---|
| `next` | string | không | như `next` của API-AUTH-01 | BR-AUTH-02 |
| `tz` | string (IANA) | không | timezone trình duyệt, dùng khi tạo tài khoản mới | BR-APP-09 |

| Kết quả (302) | When | UI reaction (verbatim) |
|---|---|---|
| → trang đồng ý của Google | bình thường | trình duyệt rời domain (NAV-AUTH-01-2) |
| → `/login?error=google_unavailable` | Google chưa cấu hình / lỗi server | "Google sign-in isn't available right now. Use your email instead." |

## API-AUTH-04 · GET `/v1/auth/google/callback`

Google chuyển về kèm `code` + `state`. Server so `state` với cookie `tl_oauth` (dùng một lần, xoá ngay), đổi `code` lấy token (PKCE), xác minh ID token và bắt buộc `email_verified = true`. Tìm tài khoản theo email: đã có thì đăng nhập vào tài khoản đó (gộp Google vào, SYS-AUTH); chưa có thì tạo mới (timezone = `tz` trong `tl_oauth`). Sau đó tạo `tl_session`, gộp kết quả `tl_guest`, khôi phục tài khoản chờ xoá — giống API-AUTH-02. Cuối cùng 302 về `/login/callback?provider=google&next=<next đã kiểm>` (thêm `&restored=1` khi vừa khôi phục). Không có UI riêng. Auth: không cần.

| Query param (từ Google) | Type | Required | Meaning | Basis |
|---|---|---|---|---|
| `code` | string | có khi thành công | mã uỷ quyền để đổi token | Q-11 |
| `state` | string | có | phải trùng `state` trong `tl_oauth` | in-house |
| `error` | string | không | Google trả khi user huỷ hoặc có lỗi | Q-11 |

| Kết quả (302) | When | UI reaction (verbatim) |
|---|---|---|
| → `/login/callback?provider=google&next=…` | thành công | trang callback kiểm lại `next` (BR-AUTH-02), bắn ft_auth login (`method` = `google`), rồi replace tới `next` hoặc `/app` (NAV-AUTH-01-3) |
| → `/login?error=google_canceled` | user huỷ ở Google (`error=access_denied`) | không hiện lỗi; form như state Default |
| → `/login?error=google_failed` | `state` sai / hết hạn / đã dùng; đổi `code` lỗi | "Google sign-in didn't complete. Try again or use your email instead." |
| → `/login?error=google_unverified` | email Google chưa xác minh | "Your Google email isn't verified. Use your email to get a sign-in link instead." |

## Field → UI map

| Response field | Used by (CMP-ID) | Display format |
|---|---|---|
| `sent` (API-AUTH-01) | CMP-06 | panel "Check your inbox" thay chỗ form |
| `expiresInSec` | CMP-06 | "It expires in 15 minutes." |
| `resendAfterSec` | CMP-06 | "Resend link" bấm được sau 30 s |
| `next` (API-AUTH-02) · query `next` (redirect của API-AUTH-04) | NAV-AUTH-01-3 | điều hướng replace tới đích |
| `accountRestored` · query `restored` | trang đích sau đăng nhập | banner "Welcome back — your account has been restored." |
| query `error` trên `/login` | CMP-03 · CMP-04 · CMP-05 | dòng lỗi phía trên form; đọc xong thì xoá `error` khỏi URL (replace) |

## AI Notices
- Payload và tên field là SPEC mới, không lấy từ đối thủ (đối thủ đăng nhập bằng email + mật khẩu, không có social login, RS·F-20 · EV-TLW-006).
- Token magic link: 32 byte ngẫu nhiên, server chỉ lưu hash. Trang `/login/callback` gửi `Referrer-Policy: no-referrer` và xoá `token` khỏi URL ngay khi đọc.
- Cookie tạm `tl_oauth` là cookie mới (nhóm necessary), chưa có trong `00-quy-uoc-api` §2 và danh mục cookie — cần bổ sung.
- Khoá idempotent của API-AUTH-01: email chuẩn hoá + cửa sổ 1 phút; "Resend link" (mở sau 30 s) gửi `resend` nên không bị cửa sổ đó nuốt, vẫn tính vào giới hạn 3 lần / giờ / email. `api-mapping` §1 ghi cùng cơ chế ("email chuẩn hoá + bộ đếm `resend`").
- Q-11 (mô hình auth) và Q-16 (Postmark gửi API-MAIL-01) đã chốt 2026-09-28; contract vẫn ở trạng thái proposal tới API-FREEZE.
