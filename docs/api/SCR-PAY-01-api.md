# [SCR-PAY-01] API — Mở khoá report
Refs: `docs/screens/SCR-PAY-01-mo-khoa-report.md` · FLOW-mo-khoa-report · `00-quy-uoc-api.md` (envelope, lỗi chung, idempotency — KHÔNG lặp lại ở đây) · schema đầy đủ: API-RES-01 ở `docs/api/SCR-TEST-02-api.md`, API-PAY-01 và API-PAY-02 ở `docs/api/SCR-PUB-04-api.md`. File này chỉ ghi phần màn này dùng và phần khác biệt.
**Changelog** (mới nhất trước)
- 2026-09-28 · v1.1 · claude-opus-5-5 · API-PAY-01 phần dùng ở màn này theo quyết định 2026-09-28: `seller.merchantOfRecord` thay `seller.legalName` ở CMP-10 (Q-04), thêm `statementDescriptor` (Q-24) và `monthlyEquivalent`; `renewalReminderDays` = { month: 7, year: 21 } (Q-16); giá hiện hành (Q-03).
- 2026-09-27 · v1 · claude (subagent) · khởi tạo từ blueprint.

## 0. Endpoint overview

| ID | Endpoint | Method | When called | Idempotent (key) | Contract status |
|---|---|---|---|---|---|
| API-RES-01 | `/v1/results/{resultId}` | GET | mở SCR-PAY-01 (`include=excerpt`) | n/a (GET) | proposal |
| API-PAY-01 | `/v1/plans` | GET | mở SCR-PAY-01, song song với API-RES-01, gọi có cookie | n/a (GET) | proposal |
| API-PAY-02 | `/v1/checkout-sessions` | POST | bấm CMP-08 "Continue to secure checkout" | có — `Idempotency-Key` = UUID sinh mỗi lần bấm CTA | proposal |

## API-RES-01 · GET `/v1/results/{resultId}` (phần dùng ở màn này)

Chỉ chủ kết quả gọi được (token `tl_guest` của trình duyệt đã làm bài, hoặc `tl_session` của tài khoản đã gộp kết quả). Không side effect. Màn này đọc `testName`, `sensitive`, `report`, và cần thêm tham số `include=excerpt` để lấy đoạn đầu chương 1 (đề xuất bổ sung cho owner SCR-TEST-02-api).

| Param | Type | Required | Meaning | Basis |
|---|---|---|---|---|
| `resultId` (path) | uuid | có | kết quả cần mở khoá | BR-APP-08 |
| `include` (query) | enum `excerpt` | không | thêm `report.excerpt`; chỉ SCR-PAY-01 dùng | BR-PAY-04 · TD-02 |

| Response `data` field (dùng ở đây) | Type | Meaning | Basis |
|---|---|---|---|
| `resultId` | uuid | như request | BR-APP-08 |
| `testName` | string | "[Test]" trong H1; không đưa vào `<title>` | TD-02 · BR-APP-06 |
| `sensitive` | boolean | bật EC bài `sensitive`: không tải analytics, `<title>` chung | BR-APP-06 · BR-APP-05 |
| `report.reportId` | uuid | đích NAV-PAY-01-5 khi đã có quyền | SYS-ENTITLEMENT |
| `report.access` | enum `none` · `pending` · `full` | `full` → NAV-PAY-01-5 · `pending` → state Locked (2), ẩn nút mua · `none` → Default | SYS-ENTITLEMENT · BR-APP-01 |
| `report.chapters` | array string | tiêu đề chương thật của report ứng với kết quả này | TD-02 · BR-PAY-04 |
| `report.pageCount` | int | số trang PDF thật, đo lúc phát hành nội dung theo (bài × type × `contentVersion`) | TD-03 · BR-PAY-04 · RS·F-23 |
| `report.excerpt` | string (plain text) / null | đoạn đầu chương 1, nguyên văn; chỉ có khi `include=excerpt` và `report.access = none` | BR-PAY-04 · TD-02 |

```json
{
  "code": 0, "message": "ok",
  "data": {
    "resultId": "9f1c…", "testName": "Big Five Personality Test", "sensitive": false,
    "report": {
      "reportId": "3e70…", "access": "none",
      "chapters": ["How you think", "How you connect"], "pageCount": 18,
      "excerpt": "You notice new ideas before most people do…"
    }
  }
}
```

| Lỗi RIÊNG màn | When | UI reaction (verbatim) |
|---|---|---|
| 403 `result_forbidden` · 404 `result_not_found` | không phải chủ kết quả / id lạ (cùng phản hồi để không dò được id) | state Locked (4): "This result isn't available on this device. Sign in if you saved it, or take the test again." |
| 410 `result_expired` | kết quả khách quá 30 ngày chưa lưu | state Error, cùng copy trên |

## API-PAY-01 · GET `/v1/plans` (phần dùng ở màn này)

Schema đầy đủ và cache: `SCR-PUB-04-api.md`. Màn này gọi có cookie (response `private`), bỏ `plan.free`, dùng `report.single` + 2 gói Plus.

| Response `data` field (dùng ở đây) | Type | Meaning | Basis |
|---|---|---|---|
| `plans[]` (3 gói trả phí) | array Plan | giá + chu kỳ cho CMP-04 · CMP-05 (`amount` 999 · 1299 · 6999 — 00-overview §2) | BR-PAY-01 · 00-overview §2 |
| `plans[].savingsPercent` | int / null | "Save [n]%" cạnh "Annual" ở CMP-05 (hiện 55) | BR-PUB-09 |
| `plans[].monthlyEquivalent` | object / null | dòng phụ "[…] per month, billed yearly" của Plus năm ở CMP-04 (583 = $5.83) | BR-PUB-09 · pricing-page §2 |
| `consent` | object `{ version, template }` | câu CMP-07 + version gửi lại ở API-PAY-02 | BR-PAY-02 · BR-APP-03 |
| `renewalReminderDays` | object `{ month: 7, year: 21 }` | CMP-06 (email nhắc 7 ngày trước kỳ tháng, 21 ngày trước kỳ năm) | Q-16 |
| `seller.merchantOfRecord` | string | CMP-10 câu reseller ("Paddle.com") | Q-04 · BR-APP-12 |
| `statementDescriptor` | string / null | CMP-10 "Charges will appear as [descriptor] on your statement."; null → không render câu này | Q-24 · BR-APP-15 |
| `purchasable` · `unavailableReason` | boolean · enum | state Locked (3) | Q-04 |

| Lỗi RIÊNG màn | When | UI reaction (verbatim) |
|---|---|---|
| 503 `pricing_unavailable` / 5xx | thiếu gói hoặc lỗi server | state Error: "We couldn't load prices. Please refresh." |

## API-PAY-02 · POST `/v1/checkout-sessions` (phần khác ở màn này)

Schema, side effect và lỗi chung: `SCR-PUB-04-api.md`. Ở màn này:

| Body field | Type | Required | Meaning | Basis |
|---|---|---|---|---|
| `planKey` | enum `report.single` · `plan.plus.monthly` · `plan.plus.annual` | có | lựa chọn đang chọn; mặc định `report.single` | BR-PAY-03 · 00-overview §2 |
| `origin` | enum | có | luôn `unlock` | NAV-PAY-02-3 |
| `resultId` | uuid | có | kết quả của trang, gửi cả khi mua Plus để SCR-PAY-02 quay lại đúng trang này nếu thất bại | SYS-ENTITLEMENT · NAV-PAY-02-3 |
| `displayedPrice` | object `{ amount, currency }` | có | giá của lựa chọn đang hiện | BR-PAY-01 · BR-APP-02 |
| `consent` | object `{ version, accepted }` | có nếu Plus | version câu CMP-07 + đã tick | BR-PAY-02 · BR-APP-03 |

| Response `data` field | Type | Meaning | Basis |
|---|---|---|---|
| `sessionId` · `checkoutUrl` · `expiresAt` | như `SCR-PUB-04-api.md` | chuyển sang checkout cùng tab | Q-04 |

| Lỗi RIÊNG màn | When | UI reaction (verbatim) |
|---|---|---|
| 422 `already_entitled` | đã có `report.full` cho `resultId` (mua ở tab khác, hoặc Plus) | replace sang report (NAV-PAY-01-5) |
| 422 `purchase_pending` | đã thanh toán cho `resultId` này, webhook chưa về | state Locked (2): "Your payment is still processing. We'll email you as soon as your report is unlocked." |
| 403 `result_forbidden` | `resultId` không thuộc người gọi | state Locked (4), copy như API-RES-01 |
| 5xx / timeout 10 s | provider hoặc server lỗi | "We couldn't start checkout. Please try again." |

## Field → UI map

| Response field | Used by (CMP-ID) | Display format |
|---|---|---|
| `testName` | CMP-02 | "Unlock your full [Test] report" |
| `report.pageCount` | CMP-03 | "About [N] pages" |
| `report.chapters` | CMP-03 | danh sách đánh số |
| `report.excerpt` | CMP-03 | đoạn văn thường, không làm mờ |
| `report.access` · `report.reportId` | NAV-PAY-01-5 · state Locked | `full` → replace sang report · `pending` → câu processing |
| `plans[].price` · `plans[].interval` | CMP-04 · CMP-05 | "[price] one-time" · "[price] per month" · "[price] per year" |
| `plans[].savingsPercent` · `plans[].monthlyEquivalent` | CMP-05 · CMP-04 | "Save [n]%" cạnh "Annual" · dòng phụ "[…] per month, billed yearly" |
| `consent.template` | CMP-07 | câu consent nguyên văn |
| `renewalReminderDays` · `plans[].renewalPrice` | CMP-06 | GC-RenewalDisclosure |
| `seller.merchantOfRecord` · `statementDescriptor` | CMP-10 | câu reseller + "Charges will appear as [descriptor] on your statement." (SCR-PAY-01 §3) |
| `checkoutUrl` | NAV-PAY-01-1 · NAV-PAY-01-2 | chuyển trang cùng tab |

## AI Notices
- `include=excerpt` và `report.excerpt` chưa có trong schema API-RES-01 của `SCR-TEST-02-api.md`; cần owner bổ sung (không phải API mới).
- `report.access = pending` phải được server đặt khi người dùng quay về từ nhánh thành công của checkout (API-PAY-03) và bỏ khi webhook về hoặc sau 30 phút; SCR-TEST-02 dùng cùng giá trị.
- `seller.merchantOfRecord` và `statementDescriptor`: giá trị thật verify khi mở tài khoản Paddle (bang-quyet-dinh §2 #3).
- Money API → human review trước API-FREEZE (api-mapping §1).
