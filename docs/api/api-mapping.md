# api-mapping — API ↔ screen matrix
> Registry API-ID (định nghĩa DUY NHẤT ở đây). Chi tiết schema ở `SCR-*-api.md`; quy ước chung ở `00-quy-uoc-api.md`.
**Changelog** (mới nhất trước)
- 2026-09-28 · v1.4 · claude-opus-5-5 · API-JOB-06 · API-MAIL-10 chỉ gửi khi check-in đang chạy (BR-ACC-08, Q-22).
- 2026-09-28 · v1.3 · claude-opus-5-5 · API-MAIL-02 ghi rõ nội dung: câu đổi ý có hạn rút + link "Withdraw from contract here", câu tên trên sao kê, mã đơn, và với Plus thêm câu công bố gia hạn GC-RenewalDisclosure `post-purchase`.
- 2026-09-28 · v1.2 · claude-opus-5-5 · quyết định 2026-09-28 (AI · uỷ quyền human): thêm API-PAY-08 (rút trong 14 ngày) · API-PAY-09 (huỷ không cần đăng nhập) · API-MAIL-11 (xác nhận rút); API-JOB-01 theo mốc 21 / 7 ngày (Q-16); API-MAIL-02 · 03 · 04 · 09 theo Q-24 · Q-25 · Q-27; API-ME-02 thêm SCR-APP-01 (bật check-in có consent, Q-22); API-PAY-04 thêm SCR-PAY-05; API-CON-01 thêm `source` (GPC, Q-20); provider = Paddle, vendor email = Postmark.
- 2026-09-28 · v1.1 · claude-opus-5-5 · D-06: khoá idempotency của huỷ / tiếp tục gia hạn = UUID cho mỗi thao tác mới + server kiểm trạng thái hiện tại (thay khoá cố định `subscriptionId` + hành động). D-08: thêm API-JOB-07 (đối soát quyền hết kỳ). D-18: API-CON-01 dùng `consentId`, schema ở SCR-PUB-07 §5.
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
| API-PAY-04 | `/v1/billing/subscription` | GET | SCR-PAY-03 · SCR-PAY-04 · SCR-PAY-05 (điền sẵn khi đã đăng nhập) | n/a (GET) | **có** | todo | proposal |
| API-PAY-05 | `/v1/billing/subscription/cancel` | POST | SCR-PAY-04 | có (UUID cho mỗi thao tác mới + kiểm trạng thái) | **có** | todo | proposal |
| API-PAY-06 | `/v1/billing/subscription/resume` | POST | SCR-PAY-03 | có (UUID cho mỗi thao tác mới + kiểm trạng thái) | **có** | todo | proposal |
| API-PAY-07 | `/v1/billing/portal-sessions` | POST | SCR-PAY-03 | có (UUID mỗi lần bấm) | **có** | todo | proposal |
| API-PAY-08 | `/v1/billing/withdrawals` | POST | SCR-PAY-05 | có (UUID cho mỗi thao tác mới + kiểm trạng thái: khoản đã rút → trả kết quả cũ) | **có** (hoàn toàn bộ qua Paddle + thu hồi quyền ngay) | todo | proposal |
| API-PAY-09 | `/v1/billing/cancellations` | POST | SCR-PAY-05 | có (UUID cho mỗi thao tác mới + kiểm trạng thái, như API-PAY-05) | **có** (huỷ gia hạn cuối kỳ, không cần đăng nhập) | todo | proposal |
| API-AUTH-01 | `/v1/auth/magic-links` | POST | SCR-AUTH-01 · SCR-TEST-02 (qua API-RES-02) | có (email chuẩn hoá + bộ đếm `resend`; tối đa 3 lần/giờ/email, 20 lần/giờ/IP) | không | todo | proposal |
| API-AUTH-02 | `/v1/auth/magic-links/verify` | POST | SCR-AUTH-01 | token dùng 1 lần | không | todo | proposal |
| API-AUTH-03 | `/v1/auth/google/start` | GET (redirect) | SCR-AUTH-01 | n/a | không | todo | proposal |
| API-AUTH-04 | `/v1/auth/google/callback` | GET | SCR-AUTH-01 (system) | `state` dùng 1 lần | không | todo | proposal |
| API-AUTH-05 | `/v1/auth/logout` | POST | SCR-ACC-01 · GC-SiteHeader | an toàn khi lặp | không | todo | proposal |
| API-ME-01 | `/v1/me` | GET | SCR-APP-01 · SCR-ACC-01 · GC-SiteHeader | n/a (GET) | không | todo | proposal |
| API-ME-02 | `/v1/me` | PATCH | SCR-ACC-01 · SCR-APP-01 (bật check-in lần đầu kèm consent, Q-22) | có (theo giá trị) | không | todo | proposal |
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
| API-CON-01 | `/v1/consents` | POST | SCR-PUB-07 · GC-ConsentBanner | có (`consentId` UUID client; schema ở SCR-PUB-07 §5; `source` = `banner` · `settings` · `gpc` — Q-20) | không | todo | proposal |
| API-HELP-01 | `/v1/contact-messages` | POST | SCR-PUB-06 | có (UUID client) | không | todo | proposal |

> Row **Money = có** → phải có **human review** trước API-FREEZE.
>
> **API-PAY-08 · API-PAY-09 — định danh:** có phiên thì khoản / gói phải thuộc tài khoản đó; không có phiên thì cần `email` + `orderNumber` (mã đơn in trên email biên nhận), giới hạn 5 lần / giờ / IP và 5 lần / giờ / email. Schema ở `SCR-PAY-05-api.md`.
>
> **API-CAT-01 — bộ tham số hợp nhất** (mỗi màn dùng một tập con): `topic` (SCR-PUB-02) · `featured` + `limit` (SCR-PUB-01) · `limit` + `excludeTaken` + `includeSensitive=false` (SCR-APP-01, gợi ý bài). Mặc định `includeSensitive=true`. Item trả về: `slug` · `title` · `description` · `topic` · `questionCount` · `medianMinutes` · `sensitive` (props của GC-TestCard); `meta.total`.

## 2. Outside screens (không gắn màn)

| API / Hook | Loại | Mục đích | BE status |
|---|---|---|---|
| API-HOOK-01 | payment webhook `POST /v1/webhooks/payments` | nhận event của Paddle (checkout completed · subscription created/updated/canceled/renewed · payment failed · refund / adjustment) → cập nhật entitlement (BR-APP-01) | todo |
| API-JOB-01 | cron hằng ngày | gửi API-MAIL-03 **21 ngày trước kỳ năm** và **7 ngày trước mỗi kỳ tháng** (BR-APP-03 · Q-16) | todo |
| API-JOB-02 | cron hằng ngày | xoá kết quả khách quá 30 ngày chưa lưu (BR-APP-08) | todo |
| API-JOB-03 | queue | dựng file export dữ liệu, gửi link (BR-APP-11) | todo |
| API-JOB-04 | cron hằng ngày | xoá cứng tài khoản quá 30 ngày sau yêu cầu xoá (BR-APP-11) | todo |
| API-JOB-05 | queue | worker render PDF bằng Playwright (TD-03) | todo |
| API-MAIL-01 | email giao dịch | magic link đăng nhập / lưu kết quả | todo |
| API-MAIL-02 | email giao dịch | biên nhận + "report đã mở khoá" (link SCR-APP-03); mã đơn ("Order number"); "Charges will appear as [descriptor] on your statement." (BR-APP-15); "Changed your mind? You can withdraw until [date] for a full refund." + link "Withdraw from contract here" → SCR-PAY-05 `?mode=withdraw&order=<orderNumber>` (BR-APP-14); mua Plus: thêm 4 câu GC-RenewalDisclosure `post-purchase` (BR-APP-02) | todo |
| API-MAIL-03 | email giao dịch | nhắc gia hạn: tên gói, chu kỳ, số tiền, ngày thu, tên trên sao kê, link huỷ (link SCR-PAY-04 + SCR-PAY-03) — đủ nội dung nhắc hằng năm (Q-16) | todo |
| API-MAIL-04 | email giao dịch | xác nhận huỷ gia hạn (BR-APP-04); huỷ không cần đăng nhập (API-PAY-09) thêm link "Resume renewal" để chủ gói hoàn tác nếu không phải mình yêu cầu | todo |
| API-MAIL-05 | email giao dịch | thanh toán gia hạn thất bại (link cập nhật thẻ) | todo |
| API-MAIL-06 | email giao dịch | file export dữ liệu sẵn sàng | todo |
| API-MAIL-07 | email giao dịch | xác nhận đã lên lịch xoá tài khoản + cách khôi phục | todo |
| API-MAIL-08 | email giao dịch | PDF sẵn sàng (khi tạo quá 10 s, cong-nghe-loi §3) | todo |
| API-JOB-06 | cron hằng tuần | gửi nhắc check-in hằng tuần cho user bật tuỳ chọn "Weekly check-in reminder" (SCR-ACC-01), chỉ khi check-in đang chạy (đã đồng ý, không chờ đồng ý lại — BR-ACC-08 · Q-22) | todo |
| API-MAIL-10 | email giao dịch | nhắc check-in hằng tuần (chỉ khi user bật tuỳ chọn và check-in đang chạy — BR-ACC-08; link tới SCR-APP-01) | todo |
| API-MAIL-09 | email giao dịch | báo thay đổi trọng yếu của điều khoản **28 ngày trước ngày áp dụng** (cửa sổ 21–30), gửi subscriber đang active (BR-PUB-11). Không dùng để tăng giá subscriber đang có (khoá giá, BR-APP-13); ngoại lệ tăng giá phải kèm nút đồng ý, chưa đặc tả vì không có trong MVP | todo |
| API-MAIL-11 | email giao dịch | xác nhận rút hợp đồng, gửi ngay (≤ 5 phút): ngày giờ nhận yêu cầu, khoản đã rút, số tiền hoàn, thời gian tiền về, quyền đã kết thúc (BR-APP-14 · Q-25) | todo |
| API-JOB-07 | cron mỗi giờ | đối soát quyền hết kỳ: `plus` / `challenge` / `report.full` có nhờ Plus mà `accessEndsAt` đã qua nhưng chưa nhận webhook kết thúc → thu hồi + ghi log để theo dõi webhook trễ; không bao giờ cấp quyền (SYS-ENTITLEMENT · BR-APP-01) | todo |

## 3. AI Notices
- Mọi contract ở trạng thái proposal. API-PAY-* và API-ME-04 cần human review (Money).
- Provider = Paddle Billing (Q-04), vendor email = Postmark (Q-16), chốt 2026-09-28 (AI · uỷ quyền human). Schema webhook vẫn viết ở mức trường nghiệp vụ; map sang payload thật của Paddle khi mở tài khoản (`bang-quyet-dinh` §2 #3).
