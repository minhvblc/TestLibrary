# [SCR-PAY-05] API — Huỷ hoặc rút
Refs: `docs/screens/SCR-PAY-05-huy-hoac-rut.md` · FLOW-quan-ly-huy-gia-han · `00-quy-uoc-api.md` (envelope, lỗi chung, idempotency §5, rút / hoàn tiền §6 — KHÔNG lặp lại ở đây) · schema đầy đủ của API-PAY-04 ở `docs/api/SCR-PAY-03-api.md`. File này sở hữu schema của API-PAY-08 · API-PAY-09 (api-mapping §1).
**Changelog** (mới nhất trước)
- 2026-09-28 · v1 · claude (subagent) · khởi tạo theo Q-18 · Q-25 (AI · uỷ quyền human 2026-09-28): schema API-PAY-08 (rút trong 14 ngày) · API-PAY-09 (huỷ không cần đăng nhập), quy tắc định danh + tần suất chung; phần API-PAY-04 dùng để điền sẵn. Bổ sung khi viết màn: `name` bắt buộc ở API-PAY-08 · API-PAY-09 và trong bản ghi bằng chứng; cặp email + mã đơn luôn được chấp nhận (chỉ dùng phiên khi email trùng email tài khoản và khoản / gói thuộc tài khoản), thêm `identifiedBy`; `withdrawableUntil` = `paidAt` + 15 ngày. Hạn rút chốt lại: `paidAt` + 15 ngày + 1 giờ (không ngắn hơn hạn luật kể cả khi đổi giờ mùa); "until [date]" hiện ngày của mốc lùi 1 ngày (không hứa quá mốc server nhận).

## 0. Endpoint overview

| ID | Endpoint | Method | When called | Idempotent (key) | Contract status |
|---|---|---|---|---|---|
| API-PAY-04 | `/v1/billing/subscription` | GET | mở SCR-PAY-05 khi có phiên (điền sẵn mã đơn) | n/a (GET) | proposal |
| API-PAY-08 | `/v1/billing/withdrawals` | POST | bấm CMP-08 "Confirm withdrawal" (bước 2) | có — `Idempotency-Key` = UUID cho mỗi thao tác mới (bấm lại sau lỗi dùng lại khoá đó); server kiểm trạng thái: khoản đã rút → 200 kết quả cũ (00-quy-uoc-api §5) | proposal (Money: cần human review) |
| API-PAY-09 | `/v1/billing/cancellations` | POST | bấm CMP-08 "Cancel renewal now" (bước 2) | có — như API-PAY-05: UUID cho mỗi thao tác mới + server kiểm trạng thái (00-quy-uoc-api §5) | proposal (Money: cần human review) |

Phiên: màn không gọi thêm API để biết có phiên hay không. Dùng kết quả API-ME-01 mà GC-SiteHeader đã gọi: 200 → có phiên (lấy `name` · `email` điền sẵn CMP-02 · CMP-03); 401 → không phiên.

## Định danh, tần suất, bằng chứng (chung cho API-PAY-08 · API-PAY-09)

| Hạng mục | Quy định | Basis |
|---|---|---|
| Đường phiên | có `tl_session` hợp lệ, `email` gửi lên trùng email tài khoản, và khoản (API-PAY-08) / gói (API-PAY-09) thuộc tài khoản đó → server dùng phiên (`identifiedBy` = `session`). API-PAY-09 theo đường này không cần `orderNumber` | api-mapping §1 · BR-PAY-18 |
| Đường cặp email + mã đơn | mọi trường hợp còn lại: không phiên; hoặc có phiên nhưng email khác email tài khoản, hoặc khoản / gói không thuộc tài khoản → cặp `email` + `orderNumber` phải khớp một đơn: `email` là email nhận biên nhận của đơn, hoặc email của tài khoản sở hữu đơn (`identifiedBy` = `order`). Luôn được chấp nhận, kể cả khi đang đăng nhập tài khoản khác | api-mapping §1 · BR-PAY-18 |
| Tên (`name`) | bắt buộc ở cả API-PAY-08 và API-PAY-09, 1–100 ký tự sau khi bỏ khoảng trắng đầu / cuối. Không dùng để khớp đơn; ghi vào bản ghi yêu cầu và in lại trong email xác nhận (API-MAIL-04 · API-MAIL-11) | Q-25 (a) · regulatory-landscape §3 (Art. 11a CRD · §312k BGB) |
| Chuẩn hoá | `email`: bỏ khoảng trắng đầu / cuối, viết thường; `orderNumber`: bỏ khoảng trắng và dấu gạch, viết hoa trước khi so (response trả mã đúng dạng in trên biên nhận) | in-house |
| Không lộ tài khoản | sai email, sai mã, hay email không tồn tại → cùng 404 `not_found`, cùng thông điệp, thời gian phản hồi tương đương | BR-PAY-22 |
| Tần suất (đường cặp) | 5 request / giờ / IP và 5 request / giờ / email đã chuẩn hoá, tính chung API-PAY-08 + API-PAY-09, kể cả request thành công và kể cả khi có phiên mà đi đường cặp; quá → 429 + `Retry-After` | api-mapping §1 · BR-PAY-22 |
| Tần suất (đường phiên) | giới hạn chung của API (tieu-chuan-chung §2) | in-house |
| `orderNumber` | mã đơn in trên email biên nhận (API-MAIL-02), cùng giá trị với `orderNumber` của API-PAY-03 · API-PAY-04. Server của mình sinh, ngẫu nhiên, không tuần tự (không dùng số hoá đơn của Paddle), để không đoán được. Định dạng: tiền tố brand + 8 ký tự Crockford base32 (không có I, L, O, U), nhóm 4-4, vd `TL-4F7Q-K2M9` (tiền tố theo brand — Q-01) | BR-PAY-22 · in-house |
| Hạn rút (`withdrawableUntil`) | = `paidAt` + 15 ngày + 1 giờ, tính tuyệt đối (UTC), không phụ thuộc timezone. Hạn luật là cuối ngày thứ 14 sau ngày thanh toán theo lịch nơi khách ở; ở mọi múi giờ, kể cả khi có một lần lùi giờ mùa trong khoảng đó (ngày dài 25 giờ), mốc luật không muộn hơn `paidAt` + 15 ngày + 1 giờ, nên quy tắc này không ngắn hơn luật. **Ngày hiển thị** "until [date]": [date] = ngày của `withdrawableUntil` theo timezone người xem (tài khoản; khách: trình duyệt; email: timezone tài khoản) **lùi 1 ngày** — luôn bằng hoặc muộn hơn ngày cuối theo luật, và không bao giờ hứa quá mốc server còn nhận (vd trả 2026-09-27 09:00 UTC → mốc 2026-10-12T10:00:00Z → người xem ở UTC thấy "until October 11, 2026"). Một hàm dùng chung cho API-PAY-03 · API-PAY-04 · API-PAY-08; null khi khoản không rút được (kỳ gia hạn tháng) hoặc đã rút / đã hoàn | BR-APP-14 · BR-PAY-20 |
| Header | `Idempotency-Key` · `X-CSRF-Token` | 00-quy-uoc-api §2 · §5 |
| Bằng chứng | mỗi yêu cầu được nhận lưu `receivedAt` (giờ server, UTC), việc (`withdrawal` / `cancellation`), tên, mã đơn, email, kênh (`account` / `no_login`, theo `identifiedBy`), IP; giữ như đơn hàng (7 năm), cả khi tài khoản bị xoá | cong-nghe-loi §4 · Q-05 (f) · Q-25 |

## API-PAY-04 · GET `/v1/billing/subscription` (phần dùng ở màn này)

Schema, nguồn dữ liệu và auth: `SCR-PAY-03-api.md`. Chỉ gọi khi có phiên. Màn này chỉ dùng để điền sẵn CMP-04 (SCR-PAY-05 §5.1).

| Response `data` field (dùng ở đây) | Type | Meaning | Basis |
|---|---|---|---|
| `subscription.currentPeriodPayment.orderNumber` · `.withdrawableUntil` | string · ISO-8601 / null | khoản thanh toán của kỳ Plus hiện tại; còn hạn rút khi `withdrawableUntil` > now | BR-PAY-18 · BR-APP-14 |
| `purchases[].orderNumber` · `purchases[].withdrawableUntil` · `purchases[].refundedAt` | string · ISO-8601 / null · ISO-8601 / null | report lẻ; còn hạn rút khi chưa hoàn và `withdrawableUntil` > now | BR-PAY-18 · BR-APP-14 |
| `planKey` | enum | `plan_key` cho ft_subscription start khi có phiên | ft_subscription |

| Lỗi RIÊNG màn | When | UI reaction (verbatim) |
|---|---|---|
| 401 | phiên vừa hết hạn | coi như không phiên: CMP-03 · CMP-04 để trống, nhập tay; intro dùng câu không phiên |
| 5xx / timeout 10 s / offline | lỗi server / mạng | không có state lỗi riêng: tên + email vẫn lấy từ API-ME-01, CMP-04 để trống cho nhập tay |

## API-PAY-08 · POST `/v1/billing/withdrawals`

Rút một khoản trong 14 ngày: hoàn toàn bộ qua Paddle và thu hồi quyền của khoản đó ngay (BR-APP-14 · BR-PAY-20). Auth: `tl_session` không bắt buộc (định danh theo bảng chung). Header: `Idempotency-Key`, `X-CSRF-Token`. Không có field lý do (BR-PAY-19).

Side effect, theo đúng thứ tự:
1. Định danh + tần suất (bảng chung). Không khớp → 404 `not_found`. Quá tần suất → 429.
2. Kiểm trạng thái: khoản đã rút → 200 với kết quả cũ (`alreadyWithdrawn` = true); không hoàn lần hai, không gửi email lần hai.
3. Kiểm điều kiện (BR-PAY-20): khoản là một lần mua report lẻ, lần thanh toán đầu của một gói Plus, hoặc một lần gia hạn gói năm; now ≤ `withdrawableUntil`; chưa được hoàn qua kênh khác. Không đạt → 422 `not_eligible`.
4. Trong một transaction DB: ghi yêu cầu rút với `receivedAt` (bảng chung) → thu hồi quyền ngay, không chờ webhook (SYS-ENTITLEMENT · 00-quy-uoc-api §6): report lẻ → `report.full:<resultId>` + `report.pdf:<resultId>` có từ khoản này (vẫn đọc được nếu đang có Plus); Plus → `plus`, `challenge` và `report.full` có nhờ Plus, bản sao subscription = đã kết thúc → xếp hàng (outbox) 3 việc: kết thúc gói ngay trên Paddle (Plus; không gia hạn, không thu lại) · hoàn toàn bộ giao dịch đó ở Paddle · API-MAIL-11.
5. Worker gọi Paddle và gửi email, tự thử lại khi lỗi; event refund / adjustment về qua API-HOOK-01 chỉ xác nhận (`refundStatus` → `completed`). API-MAIL-11 gửi ≤ 5 phút tới `confirmationEmail`: tên người yêu cầu, ngày giờ nhận yêu cầu, khoản, số tiền hoàn, thời gian tiền về, quyền đã kết thúc (BR-PAY-21).
Lỗi trước bước 4 → không đổi gì (client thử lại cùng key). Rút Plus không gửi thêm API-MAIL-04: API-MAIL-11 đã nói gói kết thúc, không gia hạn.

| Body field | Type | Required | Meaning | Basis |
|---|---|---|---|---|
| `name` | string, 1–100 ký tự | có | tên người yêu cầu; không dùng để khớp đơn, chỉ ghi vào bản ghi yêu cầu và in lại trong API-MAIL-11 | Q-25 (a) · BR-PAY-18 |
| `orderNumber` | string | có | mã đơn của khoản cần rút | BR-PAY-18 |
| `email` | string | có (có phiên thì client điền sẵn email tài khoản, user sửa được) | email nhận biên nhận; quyết định đường phiên hay đường cặp (bảng chung) | BR-PAY-18 · api-mapping §1 |

| Response `data` field | Type | Meaning | Basis |
|---|---|---|---|
| `withdrawal.id` | uuid | id yêu cầu rút | — |
| `withdrawal.orderNumber` | string | mã đơn đã rút | BR-PAY-20 |
| `withdrawal.receivedAt` | ISO-8601 | lúc server nhận yêu cầu → "[date] at [time]" | BR-PAY-21 · Q-25 |
| `withdrawal.productType` | enum `report` · `plus` | loại khoản → câu quyền ở CMP-11 | BR-PAY-20 |
| `withdrawal.planKey` | enum `report.single` · `plan.plus.monthly` · `plan.plus.annual` | `plan_key` cho ft_withdrawal confirm | tracking-events |
| `withdrawal.refund` | object `{ amount: int, currency: string }` | toàn bộ số đã trả cho khoản đó (gồm thuế) → [amount] | BR-APP-14 |
| `withdrawal.refundStatus` | enum `pending` · `completed` | `pending` tới khi webhook refund của Paddle về | 00-quy-uoc-api §6 |
| `withdrawal.accessEndedAt` | ISO-8601 | lúc quyền của khoản kết thúc (= `receivedAt`) | SYS-ENTITLEMENT |
| `withdrawal.coveredByPlus` | boolean | report lẻ vẫn đọc được vì đang có Plus | SYS-ENTITLEMENT |
| `confirmationEmail` | string | địa chỉ nhận API-MAIL-11 → [email] | BR-PAY-21 |
| `alreadyWithdrawn` | boolean | true khi khoản đã rút từ trước (trả kết quả cũ) | 00-quy-uoc-api §5 |
| `identifiedBy` | enum `session` · `order` | server định danh bằng đường nào → `channel` của tracking (account / no_login) | BR-PAY-18 · tracking-events |

Ví dụ: số tiền = giá `report.single` ở 00-overview §2, đơn không có thuế; `orderNumber` là giá trị minh hoạ.

```json
{
  "code": 0, "message": "ok",
  "data": {
    "withdrawal": {
      "id": "7c2e…", "orderNumber": "TL-4F7Q-K2M9", "receivedAt": "2026-09-28T12:05:00Z",
      "productType": "report", "planKey": "report.single",
      "refund": { "amount": 999, "currency": "USD" }, "refundStatus": "pending",
      "accessEndedAt": "2026-09-28T12:05:00Z", "coveredByPlus": false
    },
    "confirmationEmail": "sam@example.com", "alreadyWithdrawn": false, "identifiedBy": "order"
  }
}
```

| Lỗi RIÊNG màn | When | UI reaction (verbatim) |
|---|---|---|
| 400 `invalid_name` (field `name`) · `invalid_email` (field `email`) · `invalid_order_number` (field `orderNumber`) | thiếu / sai định dạng | lỗi theo field: "Enter your full name." · "Enter a valid email address." · "Enter the order number from your receipt." |
| 404 `not_found` | không đi được đường phiên và cặp email + mã đơn không khớp đơn nào | về bước 1, CMP-10: không phiên "We couldn't find a purchase with this email address and order number. Check your receipt email, or sign in to manage your plan." · có phiên "We couldn't find a purchase with this email address and order number. Check your receipt email and use the email address it was sent to." |
| 422 `not_eligible` | `errors[0].code` = `window_closed` (quá 14 ngày) · `monthly_renewal` (kỳ gia hạn tháng) · `already_refunded` (đã hoàn qua kênh khác); `errors[0].canCancelRenewal` (boolean) = còn gói đang tự gia hạn để huỷ | về bước 1, CMP-10: "This purchase is more than 14 days old, so it can't be withdrawn. You can still cancel renewal to stop future charges." · "Monthly renewals can't be withdrawn. You can still cancel renewal to stop future charges and keep Plus until the end of the month you've paid for." · "This purchase has already been refunded." — câu "You can still cancel renewal…" chỉ khi `canCancelRenewal` = true |
| 409 | lặp cùng `Idempotency-Key` | coi là thành công, dùng `data` trả về (bản gốc) → Done |
| 429 | quá tần suất (bảng chung) | "Too many requests. Please wait a moment and try again." — khoá CMP-08 tới hết `Retry-After` |
| 5xx / timeout 10 s | lỗi server | ở lại bước 2: "We couldn't send your withdrawal right now. Please try again, or email support@[domain]." — giữ dữ liệu, thử lại cùng key |

## API-PAY-09 · POST `/v1/billing/cancellations`

Huỷ gia hạn cuối kỳ, không cần đăng nhập. Hiệu lực như API-PAY-05 (`SCR-PAY-04-api.md`): Plus còn tới hết kỳ đã trả, không thu kỳ sau, không hoàn tiền (Q-18 (a)); muốn hoàn trong 14 ngày thì rút (API-PAY-08). Auth: `tl_session` không bắt buộc. Header: `Idempotency-Key`, `X-CSRF-Token`. Không có field lý do (BR-PAY-19).

Side effect, theo đúng thứ tự:
1. Định danh + tần suất (bảng chung): đường phiên → gói của tài khoản; đường cặp → `email` + `orderNumber` của bất kỳ đơn nào thuộc gói (lần thanh toán đầu hoặc một lần gia hạn). Không khớp → 404 `not_found`.
2. Kiểm trạng thái: gói đã lên lịch huỷ → 200 trạng thái hiện tại (`alreadyCanceled` = true), không gọi Paddle, không gửi email lần hai (như API-PAY-05). Không có gói đang tự gia hạn (Free, gói đã hết kỳ, hoặc mã đơn là report lẻ không thuộc gói nào) → 422 `no_active_plan`.
3. Gọi Paddle đặt huỷ cuối kỳ (đồng bộ, như API-PAY-05). Paddle lỗi → 5xx, không đổi gì. Thành công → bản sao DB `status = canceled`, `cancelAtPeriodEnd = true`, `nextCharge = null`; `plus` giữ tới `accessEndsAt` (SYS-ENTITLEMENT). Gói `past_due` vẫn huỷ được, Paddle ngừng thu lại (SCR-PAY-04 EC-05).
4. Ghi yêu cầu với `receivedAt` (bảng chung).
5. Xếp hàng API-MAIL-04 (≤ 5 phút) tới email của gói: tên người yêu cầu, ngày giờ nhận yêu cầu, ngày mất quyền. Huỷ theo đường cặp (`identifiedBy` = `order`) thì thêm link "Resume renewal" → `/account/billing` (SCR-PAY-03; chưa đăng nhập thì qua `/login?next=/account/billing`), để chủ gói hoàn tác nếu không phải mình yêu cầu (api-mapping §2 · BR-PAY-21).

| Body field | Type | Required | Meaning | Basis |
|---|---|---|---|---|
| `name` | string, 1–100 ký tự | có | tên người yêu cầu; không dùng để khớp đơn, chỉ ghi vào bản ghi yêu cầu và in lại trong API-MAIL-04 | Q-25 (a) · BR-PAY-18 |
| `email` | string | có (có phiên thì client điền sẵn email tài khoản, user sửa được) | email nhận biên nhận; quyết định đường phiên hay đường cặp (bảng chung) | BR-PAY-18 |
| `orderNumber` | string | có, trừ khi đi đường phiên (email trùng email tài khoản) — khi đó server dùng gói của tài khoản | mã một đơn bất kỳ của gói | BR-PAY-18 · api-mapping §1 |

Không trả object `subscription` đầy đủ như API-PAY-05 (người gọi có thể không đăng nhập): chỉ trả đủ để hiện kết quả.

| Response `data` field | Type | Meaning | Basis |
|---|---|---|---|
| `cancellation.receivedAt` | ISO-8601 | lúc server nhận yêu cầu (`alreadyCanceled` thì là lần huỷ trước) → "[date] at [time]" | BR-PAY-21 |
| `cancellation.planKey` | enum `plan.plus.monthly` · `plan.plus.annual` | `plan_key` cho ft_subscription cancel_confirm | tracking-events |
| `cancellation.accessEndsAt` | ISO-8601 | [date] trong "You'll keep Plus until [date]." | BR-APP-04 · SYS-ENTITLEMENT |
| `confirmationEmail` | string | địa chỉ nhận API-MAIL-04 → [email] | BR-PAY-21 |
| `alreadyCanceled` | boolean | true khi gói đã lên lịch huỷ từ trước | 00-quy-uoc-api §5 |
| `identifiedBy` | enum `session` · `order` | server định danh bằng đường nào → `channel` của tracking (account / no_login); `order` thì API-MAIL-04 có link "Resume renewal" | BR-PAY-18 · BR-PAY-21 |

```json
{
  "code": 0, "message": "ok",
  "data": {
    "cancellation": { "receivedAt": "2026-09-28T12:07:00Z", "planKey": "plan.plus.monthly", "accessEndsAt": "2026-10-20T09:00:00Z" },
    "confirmationEmail": "sam@example.com", "alreadyCanceled": false, "identifiedBy": "order"
  }
}
```

| Lỗi RIÊNG màn | When | UI reaction (verbatim) |
|---|---|---|
| 400 `invalid_name` · `invalid_email` · `invalid_order_number` | thiếu / sai định dạng | lỗi theo field: "Enter your full name." · "Enter a valid email address." · "Enter the order number from your receipt." |
| 404 `not_found` | như API-PAY-08 | cùng câu không khớp như API-PAY-08 (không phiên / có phiên) |
| 422 `no_active_plan` | không có gói đang tự gia hạn cho đơn / tài khoản này | về bước 1, CMP-10: request có mã đơn "There's no Plus renewal to cancel for this order. If you have Plus, use the order number from a Plus receipt." · request không có mã đơn (đường phiên) "You don't have an active renewal." |
| 409 | lặp cùng `Idempotency-Key` | coi là thành công, dùng `data` trả về (bản gốc) → Done |
| 429 | quá tần suất | "Too many requests. Please wait a moment and try again." — khoá CMP-08 tới hết `Retry-After` |
| 5xx / timeout 10 s | Paddle hoặc server lỗi | ở lại bước 2: "We couldn't cancel right now. Please try again, or email support@[domain]." — giữ dữ liệu, thử lại cùng key |

## Field → UI map

| Response field | Used by (CMP-ID) | Display format |
|---|---|---|
| API-ME-01 `name` · `email` (qua GC-SiteHeader) | CMP-02 · CMP-03 | "You're signed in as [email]. …" + điền sẵn "Full name" (nếu có) và "Email", cả hai sửa được |
| `identifiedBy` | tracking | `channel` = account (`session`) · no_login (`order`) |
| API-PAY-04 `subscription.currentPeriodPayment` · `purchases[]` | CMP-04 | mã đơn điền sẵn theo SCR-PAY-05 §5.1 |
| `withdrawal.receivedAt` · `cancellation.receivedAt` | CMP-11 | "[date] at [time]": "October 12, 2026" + "2:05 PM CEST", timezone tài khoản (có phiên) hoặc trình duyệt |
| `withdrawal.refund` | CMP-11 | [amount] Intl en-US + currency (tieu-chuan-chung §4) |
| `withdrawal.productType` · `withdrawal.coveredByPlus` | CMP-11 | "Your access to this report has ended." · "You can still read this report while your Plus plan is active." · "Your Plus plan has ended and won't renew." |
| `cancellation.accessEndsAt` · `alreadyCanceled` | CMP-11 | "Your renewal is canceled. You'll keep Plus until [date]. …" · "Your renewal was already canceled. You'll keep Plus until [date]." |
| `confirmationEmail` | CMP-11 | [email] |
| `errors[0].code` · `errors[0].canCancelRenewal` | CMP-10 | copy theo SCR-PAY-05 §5.2 |

## AI Notices
- Money API → human review trước API-FREEZE (api-mapping §1).
- Schema viết ở mức nghiệp vụ. Cách Paddle hoàn tiền (refund / adjustment, có cần duyệt không), thời gian tiền về và cách kết thúc gói ngay: map vào API thật của Paddle khi mở tài khoản (`bang-quyet-dinh` §2 #3).
- Định dạng `orderNumber` phải khớp API-PAY-03 (`SCR-PAY-02-api.md`) và email biên nhận API-MAIL-02; giá trị trong ví dụ chỉ để minh hoạ.
- Huỷ / rút không phiên dựa trên cặp email + mã đơn, không xác minh qua email (khác đối thủ, F-43). Người khác biết cặp này chỉ tắt được gia hạn cuối kỳ (chủ gói có "Resume renewal") hoặc rút một khoản (tiền về phương thức thanh toán gốc). Nếu số liệu cho thấy bị lạm dụng thì cần một quyết định mới trong bảng quyết định.
- Hạn rút (chốt 2026-09-28): `withdrawableUntil` = `paidAt` + 15 ngày + 1 giờ, để một lần lùi giờ mùa trong 15 ngày cũng không làm hạn ngắn hơn luật; ngày hiện cho user lùi 1 ngày so với ngày của mốc, để trang không hứa còn trọn một ngày mà server chỉ nhận tới giữa ngày đó.
