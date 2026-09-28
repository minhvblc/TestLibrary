# api-mapping — API ↔ screen matrix
> Registry API-ID (định nghĩa DUY NHẤT ở đây). Chi tiết schema ở `SCR-*-api.md`; quy ước chung ở `00-quy-uoc-api.md`.
**Changelog** (mới nhất trước)
- 2026-09-27 · v1 · claude-opus-5-5 · khởi tạo (proposal).

## 1. Matrix

| API ID | Endpoint | Method | Screens dùng (SCR-ID) | Idempotent? | Money? | BE status | Contract status |
|---|---|---|---|---|---|---|---|
| API-CAT-01 | `/v1/tests` | GET | SCR-PUB-01 · SCR-PUB-02 · SCR-APP-01 | n/a (GET) | không | todo | proposal |
| API-CAT-02 | `/v1/tests/{slug}` | GET | SCR-PUB-03 · SCR-TEST-01 | n/a (GET) | không | todo | proposal |
| API-TEST-01 | `/v1/attempts` | POST | SCR-TEST-01 | có (`attemptId`) | không | todo | proposal |
| API-TEST-02 | `/v1/attempts/{attemptId}/answers` | PUT | SCR-TEST-01 | có (PUT theo chỉ số câu) | không | todo | proposal |
| API-TEST-03 | `/v1/attempts/{attemptId}/submit` | POST | SCR-TEST-01 | có (`attemptId`) | không | todo | proposal |
| API-RES-01 | `/v1/results/{resultId}` | GET | SCR-TEST-02 · SCR-PAY-01 | n/a (GET) | không | todo | proposal |
| API-RES-02 | `/v1/results/{resultId}/claim` | POST | SCR-TEST-02 | có (`resultId` + email) | không | todo | proposal |
| API-RES-03 | `/v1/results/{resultId}` | DELETE | SCR-APP-02 · SCR-TEST-02 | có (xoá lặp → 404 coi như xong) | không | todo | proposal |
| API-PAY-01 | `/v1/plans` | GET | SCR-PUB-04 · SCR-PAY-01 | n/a (GET) | **có** (hiển thị giá) | todo | proposal |
| API-PAY-02 | `/v1/checkout-sessions` | POST | SCR-PUB-04 · SCR-PAY-01 | có (UUID mỗi lần bấm) | **có** | todo | proposal |
| API-PAY-03 | `/v1/checkout-sessions/{sessionId}` | GET | SCR-PAY-02 | n/a (GET) | **có** | todo | proposal |
| API-PAY-04 | `/v1/billing/subscription` | GET | SCR-PAY-03 · SCR-PAY-04 | n/a (GET) | **có** | todo | proposal |
| API-PAY-05 | `/v1/billing/subscription/cancel` | POST | SCR-PAY-04 | có (`subscriptionId` + cancel) | **có** | todo | proposal |
| API-PAY-06 | `/v1/billing/subscription/resume` | POST | SCR-PAY-03 | có (`subscriptionId` + resume) | **có** | todo | proposal |
| API-PAY-07 | `/v1/billing/portal-sessions` | POST | SCR-PAY-03 | có (UUID mỗi lần bấm) | **có** | todo | proposal |
| API-AUTH-01 | `/v1/auth/magic-links` | POST | SCR-AUTH-01 · SCR-TEST-02 (qua API-RES-02) | có (email chuẩn hoá + bộ đếm `resend`; tối đa 3 lần/giờ/email, 20 lần/giờ/IP) | không | todo | proposal |
| API-AUTH-02 | `/v1/auth/magic-links/verify` | POST | SCR-AUTH-01 | token dùng 1 lần | không | todo | proposal |
| API-AUTH-03 | `/v1/auth/google/start` | GET (redirect) | SCR-AUTH-01 | n/a | không | todo | proposal |
| API-AUTH-04 | `/v1/auth/google/callback` | GET | SCR-AUTH-01 (system) | `state` dùng 1 lần | không | todo | proposal |
| API-AUTH-05 | `/v1/auth/logout` | POST | SCR-ACC-01 · GC-SiteHeader | an toàn khi lặp | không | todo | proposal |
| API-ME-01 | `/v1/me` | GET | SCR-APP-01 · SCR-ACC-01 · GC-SiteHeader | n/a (GET) | không | todo | proposal |
| API-ME-02 | `/v1/me` | PATCH | SCR-ACC-01 | có (theo giá trị) | không | todo | proposal |
| API-ME-03 | `/v1/me/data-exports` | POST | SCR-ACC-01 | có (`userId` + ngày) | không | todo | proposal |
| API-ME-04 | `/v1/me` | DELETE | SCR-ACC-02 | có (`userId`) | **có** (huỷ gia hạn kèm theo) | todo | proposal |
| API-APP-01 | `/v1/dashboard` | GET | SCR-APP-01 | n/a (GET) | không | todo | proposal |
| API-APP-02 | `/v1/checkins` | POST | SCR-APP-01 | có (`userId` + ngày) | không | todo | proposal |
| API-APP-03 | `/v1/challenge/days/{day}/complete` | POST | SCR-APP-01 | có (`userId` + `day`) | không | todo | proposal |
| API-REP-01 | `/v1/reports` | GET | SCR-APP-02 | n/a (GET) | không | todo | proposal |
| API-REP-02 | `/v1/reports/{reportId}` | GET | SCR-APP-03 | n/a (GET) | không | todo | proposal |
| API-REP-03 | `/v1/reports/{reportId}/pdf` | POST | SCR-APP-03 | có (`reportId` + `contentVersion` + locale) | không | todo | proposal |
| API-REP-04 | `/v1/reports/{reportId}/pdf` | GET | SCR-APP-03 | n/a (GET) | không | todo | proposal |
| API-REP-05 | `/v1/reports/{reportId}/rating` | PUT | SCR-APP-03 | có (PUT theo `userId` + `reportId`, ghi đè) | không | todo | proposal |
| API-CON-01 | `/v1/consents` | POST | SCR-PUB-07 · GC-ConsentBanner | có (UUID client) | không | todo | proposal |
| API-HELP-01 | `/v1/contact-messages` | POST | SCR-PUB-06 | có (UUID client) | không | todo | proposal |

> Row **Money = có** → phải có **human review** trước API-FREEZE.
>
> **API-CAT-01 — bộ tham số hợp nhất** (mỗi màn dùng một tập con): `topic` (SCR-PUB-02) · `featured` + `limit` (SCR-PUB-01) · `limit` + `excludeTaken` + `includeSensitive=false` (SCR-APP-01, gợi ý bài). Mặc định `includeSensitive=true`. Item trả về: `slug` · `title` · `description` · `topic` · `questionCount` · `medianMinutes` · `sensitive` (props của GC-TestCard); `meta.total`.

## 2. Outside screens (không gắn màn)

| API / Hook | Loại | Mục đích | BE status |
|---|---|---|---|
| API-HOOK-01 | payment webhook `POST /v1/webhooks/payments` | nhận event provider (checkout completed · subscription created/updated/canceled/renewed · payment failed · refund) → cập nhật entitlement (BR-APP-01) | todo |
| API-JOB-01 | cron hằng ngày | gửi email nhắc gia hạn theo mốc Q-16 (BR-APP-03) | todo |
| API-JOB-02 | cron hằng ngày | xoá kết quả khách quá 30 ngày chưa lưu (BR-APP-08) | todo |
| API-JOB-03 | queue | dựng file export dữ liệu, gửi link (BR-APP-11) | todo |
| API-JOB-04 | cron hằng ngày | xoá cứng tài khoản quá 30 ngày sau yêu cầu xoá (BR-APP-11) | todo |
| API-JOB-05 | queue | worker render PDF bằng Playwright (TD-03) | todo |
| API-MAIL-01 | email giao dịch | magic link đăng nhập / lưu kết quả | todo |
| API-MAIL-02 | email giao dịch | biên nhận + "report đã mở khoá" (link SCR-APP-03) | todo |
| API-MAIL-03 | email giao dịch | nhắc gia hạn (link SCR-PAY-04 + SCR-PAY-03) | todo |
| API-MAIL-04 | email giao dịch | xác nhận huỷ gia hạn (BR-APP-04) | todo |
| API-MAIL-05 | email giao dịch | thanh toán gia hạn thất bại (link cập nhật thẻ) | todo |
| API-MAIL-06 | email giao dịch | file export dữ liệu sẵn sàng | todo |
| API-MAIL-07 | email giao dịch | xác nhận đã lên lịch xoá tài khoản + cách khôi phục | todo |
| API-MAIL-08 | email giao dịch | PDF sẵn sàng (khi tạo quá 10 s, cong-nghe-loi §3) | todo |
| API-JOB-06 | cron hằng tuần | gửi nhắc check-in hằng tuần cho user bật tuỳ chọn "Weekly check-in reminder" (SCR-ACC-01) | todo |
| API-MAIL-10 | email giao dịch | nhắc check-in hằng tuần (chỉ khi user bật; link tới SCR-APP-01) | todo |
| API-MAIL-09 | email giao dịch | báo trước ≥ 30 ngày khi điều khoản/giá thay đổi trọng yếu, gửi subscriber đang active (BR-PUB-11) | todo |

## 3. AI Notices
- Mọi contract ở trạng thái proposal. API-PAY-* và API-ME-04 cần human review (Money).
- Tên provider/vendor email chưa chốt (Q-04 · Q-16), nên schema webhook viết ở mức trường nghiệp vụ, chưa theo payload của một provider cụ thể.
