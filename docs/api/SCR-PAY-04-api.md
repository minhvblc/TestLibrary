# [SCR-PAY-04] API — Huỷ gia hạn
Refs: `docs/screens/SCR-PAY-04-huy-gia-han.md` · FLOW-quan-ly-huy-gia-han · `00-quy-uoc-api.md` (envelope, lỗi chung, idempotency — KHÔNG lặp lại ở đây) · schema đầy đủ của API-PAY-04 ở `docs/api/SCR-PAY-03-api.md`.
**Changelog** (mới nhất trước)
- 2026-09-28 · v1.1 · claude-opus-5-5 · định dạng ngày theo tieu-chuan-chung §4 ("October 27, 2026").
- 2026-09-27 · v1 · claude (subagent) · khởi tạo từ blueprint.

## 0. Endpoint overview

| ID | Endpoint | Method | When called | Idempotent (key) | Contract status |
|---|---|---|---|---|---|
| API-PAY-04 | `/v1/billing/subscription` | GET | mở SCR-PAY-04 | n/a (GET) | proposal |
| API-PAY-05 | `/v1/billing/subscription/cancel` | POST | bấm CMP-04 "Cancel renewal" | có — `Idempotency-Key` = `subscriptionId` + `cancel` | proposal |

## API-PAY-04 · GET `/v1/billing/subscription` (phần dùng ở màn này)

Schema, nguồn dữ liệu và auth: `SCR-PAY-03-api.md`. Màn này chỉ quyết định Default / Empty và điền câu hệ quả.

| Response `data` field (dùng ở đây) | Type | Meaning | Basis |
|---|---|---|---|
| `subscription` | object / null | null → state Empty | BR-PAY-17 |
| `subscription.id` | string | gửi lại ở API-PAY-05 + làm idempotency key | 00-quy-uoc-api §5 |
| `subscription.status` · `subscription.cancelAtPeriodEnd` | enum · boolean | `active` / `past_due` và chưa lên lịch huỷ → Default; còn lại → Empty | BR-PAY-17 · BR-APP-04 |
| `subscription.accessEndsAt` | ISO-8601 | [date] trong "Your Plus plan stays active until [date]…" | BR-APP-04 · SYS-ENTITLEMENT |
| `subscription.nextCharge` | object `{ amount, currency, date }` / null | lần thu kế tiếp, sẽ bị dừng nếu huỷ (GC-RenewalDisclosure `billing` · Active trong CMP-03) | BR-APP-02 |
| `subscription.renewalPrice` · `subscription.interval` | object · enum | giá + chu kỳ trong GC-RenewalDisclosure | BR-APP-02 |
| `planKey` | enum | `plan_key` cho ft_subscription cancel_confirm | ft_subscription |

| Lỗi RIÊNG màn | When | UI reaction (verbatim) |
|---|---|---|
| 5xx / timeout / offline | lỗi server / mạng | state Error: "We couldn't load your plan. Please refresh." |

## API-PAY-05 · POST `/v1/billing/subscription/cancel`

Huỷ gia hạn cuối kỳ bằng một request. Side effect: gọi provider đặt huỷ cuối kỳ (mức nghiệp vụ, Q-04); bản sao DB → `cancelAtPeriodEnd = true`, `status = canceled`; entitlement `plus` giữ tới `accessEndsAt` (SYS-ENTITLEMENT); đưa email xác nhận API-MAIL-04 vào hàng đợi, gửi trong 5 phút (BR-PAY-15); lưu `reason` nội bộ (không gửi analytics, xoá cùng tài khoản theo BR-APP-11). Không hoàn tiền tự động (Q-18). Gọi lại khi đã `canceled` → 200 với trạng thái hiện tại, không gửi email lần hai. Auth: `tl_session` bắt buộc (401 → `/login?next=/account/billing/cancel`). Header: `Idempotency-Key`, `X-CSRF-Token`.

| Body field | Type | Required | Meaning | Basis |
|---|---|---|---|---|
| `subscriptionId` | string | có | subscription cần huỷ gia hạn | 00-quy-uoc-api §5 |
| `reason` | string (≤ 500 ký tự) | không | lý do tuỳ chọn từ CMP-06; dài hơn thì server cắt, rỗng hay thiếu đều hợp lệ, không bao giờ làm request thất bại | BR-PAY-14 · BR-APP-04 |

| Response `data` field | Type | Meaning | Basis |
|---|---|---|---|
| `subscription` | object (như API-PAY-04) | trạng thái mới: `status = canceled`, `cancelAtPeriodEnd = true`, `nextCharge = null`, `accessEndsAt` | BR-APP-04 · BR-PAY-15 |

```json
{
  "code": 0, "message": "ok",
  "data": {
    "subscription": {
      "id": "sub_41c9…", "status": "canceled", "cancelAtPeriodEnd": true,
      "currentPeriodEnd": "2026-10-27T09:00:00Z", "accessEndsAt": "2026-10-27T09:00:00Z",
      "interval": "month", "renewalPrice": { "amount": "<placeholder Q-03>", "currency": "USD" },
      "nextCharge": null, "canResume": true
    }
  }
}
```

| Lỗi RIÊNG màn | When | UI reaction (verbatim) |
|---|---|---|
| 422 `not_active` | không có gia hạn đang chạy (Free, đã hết kỳ) | state Empty: "You don't have an active renewal." |
| 409 | lặp cùng `Idempotency-Key` | coi là thành công, replace sang SCR-PAY-03 (NAV-PAY-04-1) |
| 5xx / timeout 10 s | provider hoặc server lỗi | state Error: "We couldn't cancel right now. Please try again, or email support@[domain]." — giữ lý do đã gõ, thử lại cùng key |

## Field → UI map

| Response field | Used by (CMP-ID) | Display format |
|---|---|---|
| `subscription.accessEndsAt` | CMP-03 · toast ở SCR-PAY-03 | "[date]" dạng "October 27, 2026" theo timezone tài khoản (tieu-chuan-chung §4) |
| `subscription.nextCharge` · `subscription.renewalPrice` · `subscription.interval` | CMP-03 | GC-RenewalDisclosure `billing` · Active: "Next charge: [amount] on [date]." + câu gia hạn |
| `subscription` = null / không active | CMP-05 · state Empty | "You don't have an active renewal." + "Plan & billing" |
| `subscription.status = canceled` (sau API-PAY-05) | NAV-PAY-04-1 | replace sang `/account/billing` + toast "Your plan won't renew. You have Plus until [date]." |

## AI Notices
- Hoàn tiền khi huỷ theo Q-18 (đang Mở); API này không hoàn tiền.
- Hành vi với subscription `past_due` khi huỷ (dừng thu lại, ngày mất quyền) theo provider (Q-04); `accessEndsAt` do server tính.
- Money API → human review trước API-FREEZE (api-mapping §1).
