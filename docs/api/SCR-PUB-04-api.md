# [SCR-PUB-04] API — Bảng giá
Refs: `docs/screens/SCR-PUB-04-bang-gia.md` · FLOW-dang-ky-plus · `00-quy-uoc-api.md` (envelope, lỗi chung, idempotency, webhook — KHÔNG lặp lại ở đây) · `00-overview.md` §2 (nguồn giá). File này sở hữu schema đầy đủ của API-PAY-01 và API-PAY-02; `SCR-PAY-01-api.md` chỉ ghi phần khác.
**Changelog** (mới nhất trước)
- 2026-09-27 · v1 · claude (subagent) · khởi tạo từ blueprint.

## 0. Endpoint overview

| ID | Endpoint | Method | When called | Idempotent (key) | Contract status |
|---|---|---|---|---|---|
| API-PAY-01 | `/v1/plans` | GET | SSR `/pricing` (không cookie) + client sau hydrate (có cookie); SCR-PAY-01 khi mở trang | n/a (GET) | proposal |
| API-PAY-02 | `/v1/checkout-sessions` | POST | bấm CMP-07 "Continue to secure checkout" (SCR-PUB-04) / CMP-08 (SCR-PAY-01) | có — `Idempotency-Key` = UUID sinh mỗi lần bấm CTA; thử lại do mạng dùng lại key đó | proposal |

## API-PAY-01 · GET `/v1/plans`

Trả các gói đang bán và mọi thứ cần để hiển thị giá trung thực: giá base, giá gia hạn, chu kỳ, câu consent hiện hành, số ngày nhắc trước kỳ thu, khả năng mua ở vùng của người gọi. Giá đọc từ bảng `plans` của server (mỗi planKey map sang price id của provider lúc setup, 00-overview §2); client không tự tính giá. Không side effect. Auth: khách được. Cache: gọi không cookie → `Cache-Control: public, max-age=300`, `purchasable` và `viewer` = null (SSR/CDN cache được); gọi có cookie (`tl_guest` / `tl_session`) → `private, no-store`, đủ mọi field.

| Response `data` field | Type | Meaning | Basis |
|---|---|---|---|
| `currency` | string ISO-4217 | luôn `USD` ở MVP, không đổi theo IP | BR-APP-12 |
| `plans` | array Plan | theo thứ tự hiển thị `plan.free` → `report.single` → `plan.plus.monthly` → `plan.plus.annual` | BR-PUB-07 · 00-overview §2 |
| `plans[].planKey` | enum `plan.free` · `report.single` · `plan.plus.monthly` · `plan.plus.annual` | id ổn định của gói | 00-overview §2 |
| `plans[].name` | string (en-US) | "Free" · "One report" · "Plus" | Q-02 · Q-14 |
| `plans[].kind` | enum `free` · `one_time` · `subscription` | cách hiển thị: không giá · "one-time" · "per [period]" kèm công bố gia hạn | Q-02 · BR-APP-02 |
| `plans[].interval` | enum `month` · `year` / null | chu kỳ gia hạn; null với `free` và `one_time` | Q-03 |
| `plans[].price` | object `{ amount: int, currency: string }` | giá base, số nguyên đơn vị nhỏ nhất; giá chưa chốt → placeholder Q-03 | 00-overview §2 · 00-quy-uoc-api §8 |
| `plans[].renewalPrice` | object như `price` / null | giá mỗi kỳ gia hạn; MVP = `price` (không giá kỳ đầu khác, không trial); null nếu không gia hạn | BR-APP-02 · Q-03 |
| `plans[].features` | array string (en-US) | bullet của thẻ gói, verbatim theo bảng "Quyền → bullet" của GC-PlanCard §4 (nội dung = cột "Giới hạn / quyền" của 00-overview §2) | BR-PUB-07 · GC-PlanCard |
| `plans[].savingsPercent` | int / null | chỉ `plan.plus.annual`: làm tròn xuống của (1 − giá năm ÷ (12 × giá tháng)) × 100; null nếu < 1 | BR-PUB-09 |
| `consent` | object `{ version: string, template: string }` | câu consent Plus hiện hành, chứa chỗ trống `[price]` `[period]`; client điền và hiển thị nguyên văn | BR-APP-03 · BR-PUB-10 |
| `renewalReminderDays` | object `{ month: int, year: int }` | số ngày gửi email nhắc trước kỳ thu, dùng trong GC-RenewalDisclosure | Q-16 · BR-APP-03 |
| `seller` | object `{ legalName: string, supportEmail: string }` | pháp nhân bán + email hỗ trợ (dòng người bán, copy lỗi) | Q-05 · RS·F-12 |
| `purchasable` | boolean / null | false khi provider không bán ở quốc gia của người gọi (server xác định theo IP, chỉ để chặn mua, không đổi currency); null khi gọi không cookie | Q-04 · BR-APP-12 |
| `unavailableReason` | enum `country_not_supported` / null | lý do khi `purchasable = false` | Q-04 |
| `viewer` | object / null | chỉ khi có `tl_session`: `{ planKey: string, subscriptionStatus: enum active · canceled · past_due / null }` (`canceled` = đã lên lịch huỷ, còn trong kỳ) | SYS-ENTITLEMENT |

Ví dụ dưới đây chỉ là shape. Ở response thật, `amount` của gói trả phí là số nguyên đơn vị nhỏ nhất; ở đây để chữ vì giá còn là placeholder (Q-03).

```json
{
  "code": 0, "message": "ok",
  "data": {
    "currency": "USD",
    "plans": [
      { "planKey": "plan.free", "name": "Free", "kind": "free", "interval": null,
        "price": { "amount": 0, "currency": "USD" }, "renewalPrice": null,
        "features": ["Take every test", "A scored summary of every result"], "savingsPercent": null },
      { "planKey": "report.single", "name": "One report", "kind": "one_time", "interval": null,
        "price": { "amount": "<placeholder Q-03>", "currency": "USD" }, "renewalPrice": null,
        "features": ["The full report for one result", "PDF download"], "savingsPercent": null },
      { "planKey": "plan.plus.monthly", "name": "Plus", "kind": "subscription", "interval": "month",
        "price": { "amount": "<placeholder Q-03>", "currency": "USD" },
        "renewalPrice": { "amount": "<placeholder Q-03>", "currency": "USD" },
        "features": ["Full reports for all your results while Plus is active", "30-day challenge"], "savingsPercent": null },
      { "planKey": "plan.plus.annual", "name": "Plus", "kind": "subscription", "interval": "year",
        "price": { "amount": "<placeholder Q-03>", "currency": "USD" },
        "renewalPrice": { "amount": "<placeholder Q-03>", "currency": "USD" },
        "features": ["Full reports for all your results while Plus is active", "30-day challenge"], "savingsPercent": "<placeholder Q-03>" }
    ],
    "consent": { "version": "plus-renewal-v1", "template": "I understand Plus renews automatically at [price] per [period] until I cancel. I can cancel anytime in Account → Plan & billing." },
    "renewalReminderDays": { "month": 3, "year": 7 },
    "seller": { "legalName": "<Q-05>", "supportEmail": "support@<domain>" },
    "purchasable": true, "unavailableReason": null,
    "viewer": null
  }
}
```

| Lỗi RIÊNG màn | When | UI reaction (verbatim) |
|---|---|---|
| 503 `pricing_unavailable` | thiếu một planKey, hoặc planKey chưa map price id của provider | state Error: "We couldn't load prices. Please refresh." |
| 5xx / timeout / offline | lỗi server / mạng | như trên; nếu lỗi ở SSR thì trang vẫn render phần tĩnh (CMP-08 không giá, CMP-09) |

## API-PAY-02 · POST `/v1/checkout-sessions`

Tạo phiên checkout hosted ở provider (Q-04) cho một planKey và trả URL để client chuyển trang cùng tab. Side effect: tạo bản ghi `checkout_sessions` (id, planKey, `resultId`, `origin`, chủ = token `tl_guest` hoặc userId, `consent_version` + thời điểm với gói Plus, idempotency key, trạng thái `open`); tạo phiên ở provider với return URL cho cả nhánh thành công và nhánh huỷ trỏ về `/checkout/return?session=<id>` kèm `returnType` (SYS-NAV §4); email do provider thu. KHÔNG ghi entitlement: quyền chỉ mở qua webhook API-HOOK-01 (BR-APP-01). Auth: khách được (token `tl_guest`) hoặc `tl_session`. Header bắt buộc: `Idempotency-Key`, `X-CSRF-Token` (00-quy-uoc-api §2).

| Body field | Type | Required | Meaning | Basis |
|---|---|---|---|---|
| `planKey` | enum `report.single` · `plan.plus.monthly` · `plan.plus.annual` | có | gói cần mua (`plan.free` → 400) | 00-overview §2 |
| `origin` | enum `pricing` · `unlock` | có | trang bắt đầu mua; SCR-PAY-02 dùng để chọn "Try again" hay "Back to pricing" | NAV-PAY-02-3 · NAV-PAY-02-4 |
| `resultId` | uuid | có nếu `report.single`; tuỳ chọn với Plus mua từ SCR-PAY-01 | kết quả được mở khoá; phải thuộc token `tl_guest` / tài khoản của người gọi | SYS-ENTITLEMENT · BR-APP-08 |
| `displayedPrice` | object `{ amount: int, currency: string }` | có | giá người dùng đang thấy trên màn; khác giá hiện hành của server → 422 `price_changed` | BR-APP-02 · BR-APP-03 |
| `consent` | object `{ version: string, accepted: boolean }` | có nếu `planKey` là Plus | version của câu consent đang hiển thị + đã tick; server lưu kèm thời điểm nhận | BR-APP-03 · BR-PUB-10 · BR-PAY-02 |

| Response `data` field | Type | Meaning | Basis |
|---|---|---|---|
| `sessionId` | string (opaque) | id phiên checkout của mình (không phải id của provider), nằm trên return URL | SYS-NAV §4 · 00-quy-uoc-api §5 |
| `checkoutUrl` | string (https, domain của provider) | client `location.assign` cùng tab | Q-04 |
| `expiresAt` | ISO-8601 | hạn của phiên ở provider; hết hạn thì bấm lại tạo phiên mới | Q-04 |

```json
{
  "code": 0, "message": "ok",
  "data": { "sessionId": "cs_7d2a…", "checkoutUrl": "https://<provider-checkout-host>/…", "expiresAt": "2026-09-27T10:30:00Z" }
}
```

| Lỗi RIÊNG màn | When | UI reaction (verbatim) |
|---|---|---|
| 422 `consent_required` | gói Plus mà thiếu `consent` hoặc `accepted` khác true | bỏ tick, focus checkbox: "Tick the box above to continue." |
| 422 `consent_outdated` | `consent.version` khác version hiện hành | tải lại API-PAY-01, bỏ tick: "Prices or renewal terms have changed. Please review and tick the box again." |
| 422 `price_changed` | `displayedPrice` khác giá hiện hành | như `consent_outdated` |
| 422 `already_entitled` | đã có `plus` (khi mua Plus) hoặc đã có `report.full` cho `resultId` | SCR-PUB-04: CMP-07 thành "Manage plan" · SCR-PAY-01: replace sang report (NAV-PAY-01-5) |
| 422 `purchase_pending` | đã có phiên cùng planKey (+ `resultId`) quay về từ nhánh thành công và đang chờ webhook, trong 30 phút gần nhất | không tạo phiên mới: "Your payment is still processing. We'll email you as soon as your report is unlocked." |
| 403 `country_not_supported` | provider không bán ở quốc gia của người gọi | state Locked: "Purchases aren't available in your country yet." |
| 403 `result_forbidden` | `resultId` không thuộc người gọi | SCR-PAY-01 Locked: "This result isn't available on this device. Sign in if you saved it, or take the test again." |
| 5xx / timeout 10 s | provider hoặc server lỗi | "We couldn't start checkout. Please try again." — thử lại do mạng dùng cùng key |

## Field → UI map

| Response field | Used by (CMP-ID) | Display format |
|---|---|---|
| `plans[].price` · `plans[].interval` | CMP-03 · CMP-04 | "[price] one-time" · "[price] per month" · "[price] per year" (tieu-chuan-chung §4) |
| `plans[].features` | CMP-03 · CMP-08 | danh sách bullet |
| `plans[].savingsPercent` | CMP-04 | "Save [n]%", ẩn khi null |
| `plans[].renewalPrice` · `renewalReminderDays` | CMP-05 | GC-RenewalDisclosure |
| `consent.template` · `consent.version` | CMP-06 | câu consent nguyên văn; `version` gửi lại ở API-PAY-02 |
| `purchasable` · `unavailableReason` | CMP-06 · CMP-07 · state Locked | ẩn checkbox, khoá nút, câu Locked |
| `viewer.planKey` · `viewer.subscriptionStatus` | CMP-06 · CMP-07 · CMP-03 | có Plus → ẩn CMP-06, nút "Manage plan", thẻ One report ghi "Included in your Plus plan." |
| `checkoutUrl` | NAV-PUB-04-2 | chuyển trang cùng tab |

## AI Notices
- Tên field và payload phía provider viết ở mức nghiệp vụ, chờ Q-04. Không lấy endpoint hay field nào từ checkout của đối thủ.
- `purchase_pending` và `displayedPrice` là đề xuất chống mua trùng và chống lệch giá so với câu consent; cần human review cùng Q-18 (hoàn tiền khi mua trùng).
- Money API → human review trước API-FREEZE (api-mapping §1).
