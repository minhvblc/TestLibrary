# [SCR-PAY-02] API — Xác nhận thanh toán
Refs: `docs/screens/SCR-PAY-02-xac-nhan-thanh-toan.md` · FLOW-mo-khoa-report · FLOW-dang-ky-plus · `00-quy-uoc-api.md` (envelope, lỗi chung, idempotency, webhook — KHÔNG lặp lại ở đây)
**Changelog** (mới nhất trước)
- 2026-09-27 · v1 · claude (subagent) · khởi tạo từ blueprint.

## 0. Endpoint overview

| ID | Endpoint | Method | When called | Idempotent (key) | Contract status |
|---|---|---|---|---|---|
| API-PAY-03 | `/v1/checkout-sessions/{sessionId}` | GET | mở SCR-PAY-02; poll mỗi 2 s tới 30 s khi `pending`; reload | n/a (GET) | proposal |

## API-PAY-03 · GET `/v1/checkout-sessions/{sessionId}`

Đọc trạng thái phiên checkout do API-PAY-02 tạo. Nguồn sự thật: bảng `checkout_sessions` + `payment_events`, cập nhật bởi webhook đã verify chữ ký (API-HOOK-01). `paid` CHỈ được trả khi webhook đã xác nhận và entitlement đã ghi (BR-APP-01). Khi chưa có webhook: nếu `returnType = cancel` và provider cho biết phiên chưa hoàn tất hoặc đã hết hạn thì trả `canceled`; còn lại trả `pending`. Thông tin hỏi từ provider (nếu có) chỉ dùng để nhận biết huỷ / hết hạn, KHÔNG bao giờ mở quyền. Side effect nhẹ: lần gọi đầu có `returnType = success` đánh dấu phiên "đã quay về, chờ webhook"; trong 30 phút hoặc tới khi webhook về, API-RES-01 trả `report.access = pending` cho `resultId` của phiên và API-PAY-02 trả 422 `purchase_pending` (chống mua trùng). Auth: chủ phiên — token `tl_guest` đã tạo phiên hoặc tài khoản sở hữu phiên. Rate limit: tối thiểu 1 s giữa 2 lần gọi cùng phiên.

| Param | Type | Required | Meaning | Basis |
|---|---|---|---|---|
| `sessionId` (path) | string | có | id phiên của mình (từ API-PAY-02, nằm trên return URL) | 00-quy-uoc-api §5 · SYS-NAV §4 |
| `returnType` (query) | enum `success` · `cancel` | không | provider trả về theo nhánh nào; chỉ là gợi ý để phân biệt `pending` với `canceled`, không bao giờ mở quyền | BR-PAY-07 · Q-04 |

| Response `data` field | Type | Meaning | Basis |
|---|---|---|---|
| `sessionId` | string | như request | 00-quy-uoc-api §5 |
| `status` | enum `pending` · `paid` · `failed` · `canceled` | trạng thái do server quyết | BR-PAY-07 · BR-APP-01 |
| `planKey` | enum `report.single` · `plan.plus.monthly` · `plan.plus.annual` | gói đã mua | 00-overview §2 |
| `productName` | string (en-US) | tên sản phẩm ở CMP-03 (vd "Full report · [Test]", "Plus · Monthly") | BR-APP-02 |
| `origin` | enum `pricing` · `unlock` | chọn nút CMP-05 | NAV-PAY-02-3 · NAV-PAY-02-4 |
| `resultId` | uuid / null | đích "Try again" | NAV-PAY-02-3 |
| `reportId` | uuid / null | có khi `paid` và gói mở report của `resultId` | NAV-PAY-02-1 · SYS-ENTITLEMENT |
| `amountPaid` | object `{ amount: int, currency: string }` / null | tổng provider đã thu (đã gồm thuế); chỉ khi `paid` | BR-APP-12 · Q-04 |
| `taxAmount` | object như trên / null | phần thuế nếu provider tách riêng | BR-APP-12 · Q-04 |
| `interval` | enum `month` · `year` / null | chỉ Plus | Q-03 |
| `renewalPrice` | object `{ amount: int, currency: string }` / null | chỉ Plus: giá mỗi kỳ gia hạn | BR-PAY-09 · BR-APP-02 |
| `nextRenewalAt` | ISO-8601 / null | chỉ Plus: ngày thu kế tiếp | BR-PAY-09 |
| `renewalReminderDays` | int / null | chỉ Plus: số ngày gửi email nhắc trước kỳ thu | Q-16 |
| `seller` | object `{ legalName: string }` | dòng "Sold by" | Q-05 · RS·F-12 |
| `receiptEmailMasked` | string / null | email biên nhận đã che một phần (vd `m•••@example.com`); chỉ khi `paid` | SYS-AUTH · in-house (riêng tư khi chia sẻ màn hình) |
| `viewerSignedIn` | boolean | hiện CMP-06; khách mua Plus sẽ qua guard khi vào `/app` | SYS-AUTH |
| `pollAfterMs` | int | nhịp poll gợi ý, mặc định 2000 | BR-PAY-08 |

Ví dụ: số tiền do provider trả về theo từng giao dịch; ở đây để chữ vì giá còn là placeholder (Q-03).

```json
{
  "code": 0, "message": "ok",
  "data": {
    "sessionId": "cs_7d2a…", "status": "paid", "planKey": "plan.plus.monthly",
    "productName": "Plus · Monthly", "origin": "pricing", "resultId": null, "reportId": null,
    "amountPaid": { "amount": "<placeholder Q-03>", "currency": "USD" }, "taxAmount": null,
    "interval": "month", "renewalPrice": { "amount": "<placeholder Q-03>", "currency": "USD" },
    "nextRenewalAt": "2026-10-27T09:00:00Z", "renewalReminderDays": 3,
    "seller": { "legalName": "<Q-05>" }, "receiptEmailMasked": "m•••@example.com",
    "viewerSignedIn": false, "pollAfterMs": 2000
  }
}
```

| Lỗi RIÊNG màn | When | UI reaction (verbatim) |
|---|---|---|
| 403 `not_linked` | phiên tồn tại nhưng không thuộc token / tài khoản của trình duyệt này | state Locked: "This checkout isn't linked to this browser. Check your email for your receipt." |
| 404 `session_not_found` | id lạ | state Error (session lạ), cùng copy với Locked |
| 429 | poll dày hơn 1 lần mỗi giây | chờ `Retry-After` rồi poll tiếp |
| 5xx / timeout / offline | lỗi server / mạng | giữ `pending`, thử ở nhịp sau; hết 30 s → "Your payment is still processing. We'll email you as soon as your report is unlocked." |

Phản hồi 403/404 không kèm sản phẩm, số tiền hay email.

## Field → UI map

| Response field | Used by (CMP-ID) | Display format |
|---|---|---|
| `status` | CMP-02 · CMP-04 · CMP-05 | câu trạng thái tương ứng (SCR-PAY-02 §3) |
| `productName` | CMP-03 | "Product" |
| `amountPaid` · `taxAmount` | CMP-03 | "Total paid" theo currency (tieu-chuan-chung §4) |
| `interval` · `nextRenewalAt` · `renewalPrice` · `renewalReminderDays` | CMP-03 | "Billing period" · "Next charge" · GC-RenewalDisclosure |
| `seller.legalName` | CMP-03 | "Sold by" |
| `receiptEmailMasked` | CMP-03 | "A receipt is on its way to [email]." |
| `reportId` | NAV-PAY-02-1 | replace sang `/app/reports/:reportId` |
| `origin` · `resultId` | CMP-05 | "Try again" (có `resultId`) hoặc "Back to pricing" |
| `viewerSignedIn` | CMP-06 | ghi chú cho khách |
| `pollAfterMs` | poll | nhịp gọi lại |

## AI Notices
- Provider = Q-04: cách nhận biết `failed` / `canceled` (webhook hay hỏi trạng thái phiên) phụ thuộc provider; schema viết ở mức nghiệp vụ.
- Không có dữ liệu đối thủ cho bước này (CS-21 `[BLOCKED · payment]`); toàn bộ là SPEC mới.
- Money API → human review trước API-FREEZE (api-mapping §1).
