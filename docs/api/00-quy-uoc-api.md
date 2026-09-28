# Quy ước API chung (web client)
> BE: NestJS + TypeORM, PostgreSQL `postgres:16-alpine`, một schema `public`; migration sinh bằng `typeorm migration:generate` (basis in-house). Endpoint ở đây là SPEC MỚI của mình, không lấy từ network log của đối thủ.
**Changelog** (mới nhất trước)
- 2026-09-27 · v1 · claude-opus-5-5 · khởi tạo (proposal).

## 1. Base URL & environments

| env | base URL | Ghi chú |
|---|---|---|
| local | `http://localhost:<port>/v1` | port theo compose của repo (không mặc định 3000/5432) |
| dev | `https://api.dev.<domain>/v1` | domain = Q-01 |
| prod | `https://api.<domain>/v1` | domain = Q-01 |

Versioning: tiền tố `/v1`; thay đổi phá vỡ → `/v2`, giữ `/v1` ít nhất 90 ngày.

## 2. Auth & headers

| Cơ chế / header | Required | Meaning |
|---|---|---|
| Cookie `tl_session` (HttpOnly · Secure · SameSite=Lax) | route `account` / `entitled` | phiên đăng nhập (SYS-AUTH) |
| Cookie `tl_guest` (HttpOnly · Secure · SameSite=Lax) | route `guest` | token khách gắn với kết quả (BR-APP-08) |
| `X-CSRF-Token` | mọi POST/PUT/PATCH/DELETE có cookie | double-submit: giá trị trùng cookie `tl_csrf` (không HttpOnly) |
| Cookie `tl_oauth` (HttpOnly · Secure · SameSite=Lax · 10 phút) | luồng Google (API-AUTH-03 → API-AUTH-04) | lưu `state` + `next` của OAuth, xoá ngay sau callback |
| `Idempotency-Key` | mọi POST ghi tiền / nộp bài / tạo phiên (§5) | UUID v4 do client sinh, sống 24 giờ phía server |
| `Accept-Language` | không | locale nội dung (en-US mặc định, Q-14) |
| CORS | — | chỉ origin của web app; `credentials: include`; không dùng `*` |

## 3. Response envelope

- Thành công: `{ "code": 0, "message": "ok", "data": { … } }`
- Lỗi: `{ "code": <int>, "message": "<en-US>", "errors": [ { "field": "email", "code": "invalid_email", "message": "…" } ] }`
- File API từng màn CHỈ mô tả schema `data` và lỗi riêng màn.

## 4. Common error codes

| HTTP | When | Default UI reaction |
|---|---|---|
| 400 | body/params sai định dạng | hiện lỗi theo field; không mất dữ liệu đã nhập |
| 401 | chưa đăng nhập / phiên hết hạn | chuyển `/login?next=<route>` (tieu-chuan-chung §1) |
| 403 | không có quyền (report chưa mở khoá, kết quả không thuộc token) | state **Locked** của màn |
| 404 | không tồn tại | trang 404 có link về `/tests` |
| 409 | request trùng `Idempotency-Key` đã xử lý | coi là **thành công**, dùng `data` trả về (bản gốc) |
| 410 | kết quả khách đã hết hạn (BR-APP-08) | copy "This result isn't available on this device…" (cong-nghe-loi §3) |
| 413 | payload quá lớn (nộp bài > 32 KB) | lỗi chung + log |
| 422 | vi phạm rule nghiệp vụ (vd huỷ gói đã huỷ) | copy riêng màn |
| 429 | quá rate limit | chờ `Retry-After` (tieu-chuan-chung §2) |
| 5xx | lỗi server | tieu-chuan-chung §2; request ghi có key thì được thử lại |

## 5. Idempotency

| Action | Idempotency key | Ghi chú |
|---|---|---|
| Bắt đầu attempt (API-TEST-01) | `attemptId` (UUID client sinh khi mở bài) | mở lại cùng attempt không tạo bản mới |
| Nộp bài (API-TEST-03) | `attemptId` | nộp lặp → 409 → trả `resultId` cũ |
| Lưu kết quả bằng email (API-RES-02) | `resultId` + email chuẩn hoá | gửi lại magic link tối đa 3 lần/giờ |
| Tạo phiên checkout (API-PAY-02) | UUID sinh mỗi lần bấm CTA | bấm 2 lần → cùng phiên checkout |
| Huỷ / tiếp tục gia hạn (API-PAY-05 · API-PAY-06) | `subscriptionId` + hành động | lặp → trạng thái hiện tại |
| Check-in (API-APP-02) | `userId` + ngày nghiệp vụ (BR-APP-09) | mỗi ngày tối đa 1 bản; gửi lại = cập nhật giá trị |
| Hoàn thành ngày thử thách (API-APP-03) | `userId` + `day` | |
| Tạo PDF (API-REP-03) | `reportId` + `contentVersion` + locale | trả job/URL đã có |
| Export dữ liệu (API-ME-03) | `userId` + ngày | tối đa 1 export/ngày |
| Xoá tài khoản (API-ME-04) | `userId` | |
| Webhook thanh toán (API-HOOK-01) | `event.id` của provider | bảng `payment_events` unique theo `event_id` |

## 6. Payment webhook

| Hạng mục | Quy định |
|---|---|
| Provider | Q-04 (MoR ưu tiên) |
| Verify | kiểm chữ ký bằng secret của provider TRƯỚC khi đọc payload; sai chữ ký → 400, không ghi gì |
| Idempotent | theo `event.id`; đã xử lý → 200 ngay |
| Entitlement | **server quyết** (BR-APP-01): chỉ webhook `checkout completed` / `subscription active` mới mở quyền; client không tự mở |
| Thứ tự | event đến lộn xộn → đọc lại trạng thái subscription từ provider trước khi cập nhật; không lùi trạng thái theo event cũ hơn |
| Retry | trả 2xx trong 5 s; xử lý nặng đẩy sang queue; provider retry thì nhờ idempotency nên an toàn |
| Consent | lưu `consent_version` của câu công bố gia hạn (BR-APP-03) kèm phiên checkout |

## 7. Streaming

Không có. Không capability nào stream. Tạo PDF là job + hỏi trạng thái (API-REP-04), không dùng SSE/WebSocket.

## 8. Data formats

Thời gian ISO-8601 UTC · "ngày" nghiệp vụ = timezone tài khoản (BR-APP-09) · tiền = số nguyên đơn vị nhỏ nhất + `currency` (vd `{"amount": 1200, "currency": "USD"}`, số ví dụ, không phải giá) · phân trang `page` / `page_size` + `meta.total`.

## 9. Contract status

proposal → reviewed → FROZEN. Theo dõi ở `api-mapping.md`. Toàn bộ hiện ở **proposal**.

## 10. AI Notices
- Chưa FREEZE: phụ thuộc Q-04 (provider), Q-11 (auth), Q-10 (scoring). Money API (API-PAY-*) cần human review trước FREEZE.
