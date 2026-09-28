# [SCR-PAY-03] API — Gói & thanh toán
Refs: `docs/screens/SCR-PAY-03-goi-va-thanh-toan.md` · FLOW-quan-ly-huy-gia-han · `00-quy-uoc-api.md` (envelope, lỗi chung, idempotency, webhook — KHÔNG lặp lại ở đây). File này sở hữu schema đầy đủ của API-PAY-04; `SCR-PAY-04-api.md` chỉ ghi phần dùng ở màn huỷ.
**Changelog** (mới nhất trước)
- 2026-09-27 · v1 · claude (subagent) · khởi tạo từ blueprint.

## 0. Endpoint overview

| ID | Endpoint | Method | When called | Idempotent (key) | Contract status |
|---|---|---|---|---|---|
| API-PAY-04 | `/v1/billing/subscription` | GET | mở SCR-PAY-03; quay lại tab sau khi dùng cổng provider; sau API-PAY-06 | n/a (GET) | proposal |
| API-PAY-06 | `/v1/billing/subscription/resume` | POST | bấm CMP-04 "Resume renewal" | có — `Idempotency-Key` = `subscriptionId` + `resume` | proposal |
| API-PAY-07 | `/v1/billing/portal-sessions` | POST | bấm CMP-05 "Update payment method" / CMP-06 "View invoices" | có — `Idempotency-Key` = UUID sinh mỗi lần bấm | proposal |

## API-PAY-04 · GET `/v1/billing/subscription`

Trả gói hiện tại, subscription (nếu có) và các report mua lẻ của tài khoản, đọc từ bản sao trong DB (bảng `subscriptions`, `purchases`) do webhook API-HOOK-01 cập nhật. Không gọi provider mỗi lần tải trang, để nhanh và luôn khớp entitlement. Không side effect. Auth: `tl_session` bắt buộc (401 → `/login?next=/account/billing`).

| Response `data` field | Type | Meaning | Basis |
|---|---|---|---|
| `planKey` | enum `plan.free` · `plan.plus.monthly` · `plan.plus.annual` | gói hiện tại | SYS-ENTITLEMENT · 00-overview §2 |
| `subscription` | object / null | null khi Free hoặc subscription đã kết thúc | BR-PAY-11 |
| `subscription.id` | string | id subscription của mình; dùng làm idempotency key cho API-PAY-05 · API-PAY-06 | 00-quy-uoc-api §5 |
| `subscription.status` | enum `active` · `canceled` · `past_due` | `canceled` = đã lên lịch huỷ, còn trong kỳ (hết kỳ thì `subscription = null`); "Active" · "Cancels on [date]" · banner CMP-08 | SYS-ENTITLEMENT · BR-PAY-13 · GC-RenewalDisclosure |
| `subscription.cancelAtPeriodEnd` | boolean | đã lên lịch huỷ cuối kỳ | BR-APP-04 |
| `subscription.currentPeriodEnd` | ISO-8601 | hết kỳ đã trả; "Cancels on [date]" | BR-APP-04 · SYS-ENTITLEMENT |
| `subscription.accessEndsAt` | ISO-8601 | ngày mất quyền thực tế (tính cả ân hạn khi `past_due`); [date] ở trang huỷ | SYS-ENTITLEMENT · Q-04 |
| `subscription.interval` | enum `month` · `year` | chu kỳ | Q-03 |
| `subscription.renewalPrice` | object `{ amount: int, currency: string }` | giá mỗi kỳ gia hạn | BR-APP-02 · BR-PAY-11 |
| `subscription.nextCharge` | object `{ amount: int, currency: string, date: ISO-8601 }` / null | lần thu kế tiếp; null khi đã lên lịch huỷ | BR-PAY-11 |
| `subscription.paymentMethod` | object `{ brand: string, last4: string }` / null | từ webhook của provider; server không lưu số thẻ | BR-APP-01 · cong-nghe-loi §4 |
| `subscription.graceEndsAt` | ISO-8601 / null | hết ân hạn khi `past_due` | BR-PAY-13 · Q-04 |
| `subscription.canResume` | boolean | true khi `canceled` và còn trước `currentPeriodEnd` | BR-PAY-12 |
| `purchases` | array `{ reportId: uuid, resultId: uuid, testName: string, purchasedAt: ISO-8601 }` | report mua lẻ, mới nhất trước | SYS-ENTITLEMENT |
| `hasBillingHistory` | boolean | có ít nhất 1 giao dịch → hiện CMP-06 | Q-04 |
| `renewalReminderDays` | int / null | số ngày gửi email nhắc trước kỳ thu kế tiếp (GC-RenewalDisclosure) | Q-16 · BR-APP-03 |
| `consent` | object `{ version: string, template: string }` | câu công bố gia hạn hiện hành, dùng khi "Resume renewal" | BR-APP-03 |

Ví dụ: số tiền để chữ vì giá còn là placeholder (Q-03).

```json
{
  "code": 0, "message": "ok",
  "data": {
    "planKey": "plan.plus.annual",
    "subscription": {
      "id": "sub_41c9…", "status": "active", "cancelAtPeriodEnd": false,
      "currentPeriodEnd": "2027-09-27T09:00:00Z", "accessEndsAt": "2027-09-27T09:00:00Z",
      "interval": "year", "renewalPrice": { "amount": "<placeholder Q-03>", "currency": "USD" },
      "nextCharge": { "amount": "<placeholder Q-03>", "currency": "USD", "date": "2027-09-27T09:00:00Z" },
      "paymentMethod": { "brand": "Visa", "last4": "0000" }, "graceEndsAt": null, "canResume": false
    },
    "purchases": [ { "reportId": "3e70…", "resultId": "9f1c…", "testName": "Big Five Personality Test", "purchasedAt": "2026-09-27T09:00:00Z" } ],
    "hasBillingHistory": true, "renewalReminderDays": 7,
    "consent": { "version": "plus-renewal-v1", "template": "I understand Plus renews automatically at [price] per [period] until I cancel. I can cancel anytime in Account → Plan & billing." }
  }
}
```

| Lỗi RIÊNG màn | When | UI reaction (verbatim) |
|---|---|---|
| 5xx / timeout / offline | lỗi server / mạng | state Error: "We couldn't load your plan. Please refresh." |

## API-PAY-06 · POST `/v1/billing/subscription/resume`

Bỏ lịch huỷ cuối kỳ của subscription đang `canceled` (còn trong kỳ). Side effect: gọi provider để tiếp tục gia hạn (ở mức nghiệp vụ, Q-04); cập nhật bản sao DB theo phản hồi của provider, webhook đến sau chỉ xác nhận lại (idempotent); lưu `consent_version` + thời điểm như một lần đồng ý gia hạn lại (BR-APP-03). Entitlement không đổi (vẫn `plus`). Auth: `tl_session` bắt buộc. Header: `Idempotency-Key` = `subscriptionId` + `resume`, `X-CSRF-Token`.

| Body field | Type | Required | Meaning | Basis |
|---|---|---|---|---|
| `subscriptionId` | string | có | subscription cần tiếp tục | 00-quy-uoc-api §5 |
| `consent` | object `{ version: string, accepted: boolean }` | có | version câu công bố đang hiện cạnh nút; bấm nút = đồng ý | BR-APP-03 · BR-APP-02 |

| Response `data` field | Type | Meaning | Basis |
|---|---|---|---|
| `subscription` | object (như API-PAY-04) | trạng thái mới: `active`, `cancelAtPeriodEnd = false`, có `nextCharge` | BR-PAY-12 · BR-APP-04 |

| Lỗi RIÊNG màn | When | UI reaction (verbatim) |
|---|---|---|
| 422 `not_resumable` | không ở `canceled` hoặc đã qua `currentPeriodEnd` | tải lại API-PAY-04, hiện trạng thái thật (không toast lỗi riêng) |
| 422 `consent_outdated` | `consent.version` khác version hiện hành | tải lại API-PAY-04: "Renewal terms have changed. Please review them and try again." |
| 409 | lặp cùng `Idempotency-Key` | coi là thành công, dùng `data` trả về (00-quy-uoc-api §4) |
| 5xx / timeout 10 s | provider hoặc server lỗi | "Something went wrong on our side. Please try again." (tieu-chuan-chung §2) |

## API-PAY-07 · POST `/v1/billing/portal-sessions`

Tạo phiên cổng khách hàng của provider (cập nhật thẻ, xem hoá đơn) và trả URL. Return URL do server đặt cố định là `/account/billing`, không nhận URL từ client (chống open redirect). Side effect: không ghi gì vào entitlement; thay đổi trong cổng về qua webhook API-HOOK-01. Auth: `tl_session` bắt buộc. Header: `Idempotency-Key` (UUID mỗi lần bấm), `X-CSRF-Token`.

| Body field | Type | Required | Meaning | Basis |
|---|---|---|---|---|
| `purpose` | enum `payment_method` · `invoices` | có | mở đúng mục của cổng nếu provider hỗ trợ; không hỗ trợ thì mở trang chính của cổng | Q-04 |

| Response `data` field | Type | Meaning | Basis |
|---|---|---|---|
| `portalUrl` | string (https, domain của provider) | gán cho tab đã mở sẵn | Q-04 |
| `expiresAt` | ISO-8601 | hạn của URL | Q-04 |

| Lỗi RIÊNG màn | When | UI reaction (verbatim) |
|---|---|---|
| 404 `no_billing_account` | tài khoản chưa từng giao dịch | đóng tab trống, ẩn CMP-05 · CMP-06 |
| 5xx / timeout 10 s | provider hoặc server lỗi | đóng tab trống: "Something went wrong on our side. Please try again." |

## Field → UI map

| Response field | Used by (CMP-ID) | Display format |
|---|---|---|
| `planKey` · `subscription.status` · `subscription.currentPeriodEnd` | CMP-03 | "Plus" / "Free" · "Active" / "Cancels on [date]" / "Free" |
| `subscription.renewalPrice` · `subscription.interval` | CMP-03 | "[price] per month" · "[price] per year" |
| `subscription.nextCharge` | CMP-03 | "Next charge: [amount] on [date]" hoặc "No upcoming charges" |
| `subscription.paymentMethod` | CMP-03 | "[Brand] ending in [last4]" |
| `renewalReminderDays` · `consent` | CMP-03 | GC-RenewalDisclosure |
| `subscription.canResume` · `subscription.status` | CMP-04 | "Cancel renewal" · "Resume renewal" · "Upgrade to Plus" |
| `subscription.status = past_due` · `subscription.graceEndsAt` | CMP-08 · CMP-05 | banner + nút cập nhật thẻ trong banner |
| `hasBillingHistory` | CMP-06 | hiện / ẩn "View invoices" |
| `purchases[]` | CMP-07 | tên bài · ngày mua · "Read" (NAV-PAY-03-5) |
| `portalUrl` | NAV-PAY-03-4 | mở trong tab mới đã mở sẵn |

## AI Notices
- Thời gian ân hạn, cách thu lại và các mục trong cổng khách hàng theo provider (Q-04); cổng phải tắt đổi gói để mọi gói tự gia hạn đều đi qua consent (BR-APP-03).
- Ví dụ `paymentMethod` là dữ liệu minh hoạ, không phải thẻ thật.
- Money API → human review trước API-FREEZE (api-mapping §1).
