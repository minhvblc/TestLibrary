# [SCR-TEST-02] API — Kết quả
Refs: `docs/screens/SCR-TEST-02-ket-qua.md` · FLOW-lam-bai-mien-phi · FLOW-luu-ket-qua-dang-nhap · `00-quy-uoc-api.md` (envelope, lỗi chung, idempotency — KHÔNG lặp lại ở đây)
**Changelog** (mới nhất trước)
- 2026-09-28 · v1.1 · claude-opus-5-5 · quyết định 2026-09-28 (AI · uỷ quyền human): API-RES-03 là cách khách tự xoá dữ liệu (Q-28); Q-07 · Q-11 đã chốt ở AI Notices.
- 2026-09-27 · v1 · claude (subagent) · khởi tạo từ blueprint.

## 0. Endpoint overview

| ID | Endpoint | Method | When called | Idempotent (key) | Contract status |
|---|---|---|---|---|---|
| API-RES-01 | `/v1/results/{resultId}` | GET | mở SCR-TEST-02; tải lại khi `report.access = pending` hoặc sau khi lưu; SCR-PAY-01 gọi kèm `include=excerpt` | n/a (GET) | proposal |
| API-RES-02 | `/v1/results/{resultId}/claim` | POST | "Email me a link" · "Resend link" · "Save to my account" | có — `resultId` + email chuẩn hoá (00-quy-uoc-api §5), cửa sổ 1 phút trừ khi `resend = true` | proposal |
| API-RES-03 | `/v1/results/{resultId}` | DELETE | xác nhận "Delete" ở CMP-13 | có — xoá lặp trả 404, UI coi như đã xoá | proposal |

## API-RES-01 · GET `/v1/results/{resultId}`

Trả kết quả tóm tắt nếu người gọi là chủ: token `tl_guest` của trình duyệt đã làm bài, hoặc tài khoản đã gộp kết quả. Không side effect. Auth: khách được (cookie `tl_guest`) hoặc `tl_session`. File này sở hữu schema của API-RES-01. SCR-PAY-01 dùng cùng endpoint nhưng chỉ đọc `testName`, `sensitive` và `report` (kèm `report.excerpt`).

| Param | Type | Required | Meaning | Basis |
|---|---|---|---|---|
| `resultId` (path) | uuid | có | id kết quả do API-TEST-03 trả về | BR-APP-08 |
| `include` (query) | string, chỉ nhận `excerpt` | không | thêm `report.excerpt` (đoạn đầu chương 1) cho khối xem trước ở SCR-PAY-01 | SCR-PAY-01 (CMP-03) · RS·F-23 |

| Response `data` field | Type | Meaning | Basis |
|---|---|---|---|
| `resultId` | uuid | như request | BR-APP-08 |
| `testSlug` | string | tạo route "Retake test" | API-CAT-02 · BR-APP-07 |
| `testName` | string | tên bài; không đưa vào `<title>` | in-house |
| `sensitive` | boolean | bật CMP-09, tắt mọi event analytics | BR-APP-06 · Q-06 |
| `type` | object `{ key: string, name: string, summary: string }` | [Type] + 1 câu mô tả; bài không có type thì `name` là tên dải của thang chính | TD-02 · BR-TEST-07 |
| `scales` | array `{ key: string, name: string, percent: int 0–100, band: string }`, server đã xếp giảm dần theo `percent` | GC-ScoreBars | BR-TEST-07 · TD-01 |
| `explanations` | array `{ scaleKey: string, text: string }` | "Why you got this result", ráp từ `report_blocks` loại tóm tắt | BR-TEST-07 · TD-02 |
| `scoringVersion` | string | chú thích CMP-10 | BR-APP-07 |
| `contentVersion` | string | ghim nội dung tóm tắt + report của kết quả này | BR-APP-07 · BR-REP-03 |
| `report` | object `{ reportId: uuid, chapters: array string, pageCount: int, access: enum none · pending · full, excerpt: string / null }` | khối CMP-05; `pageCount` đo từ PDF thật của (bài × type, `contentVersion`) lúc phát hành nội dung; `excerpt` chỉ có khi gọi với `include=excerpt` | BR-TEST-08 · SYS-ENTITLEMENT · TD-03 |
| `claimed` | boolean | kết quả đã gắn tài khoản hay chưa | BR-TEST-09 |
| `viewerSignedIn` | boolean | chọn biến thể CMP-06 (khách / đã đăng nhập); header `minimal` của màn funnel không gọi API-ME-01 | SYS-AUTH |
| `expiresAt` | ISO-8601 / null | ngày tự xoá nếu chưa lưu; null khi `claimed = true` | BR-TEST-10 · BR-APP-08 |

```json
{
  "code": 0, "message": "ok",
  "data": {
    "resultId": "9f1c…", "testSlug": "big-five-personality", "testName": "Big Five Personality Test",
    "sensitive": false,
    "type": { "key": "explorer", "name": "The Explorer", "summary": "You look for new ideas and new experiences." },
    "scales": [ { "key": "openness", "name": "Openness", "percent": 82, "band": "high" } ],
    "explanations": [ { "scaleKey": "openness", "text": "Your Openness score is in the high range…" } ],
    "scoringVersion": "big5-ipip-1.2", "contentVersion": "c7",
    "report": { "reportId": "3e70…", "chapters": ["How you think", "How you connect"], "pageCount": 18, "access": "none", "excerpt": null },
    "claimed": false, "viewerSignedIn": false, "expiresAt": "2026-10-27T09:00:00Z"
  }
}
```

| Lỗi RIÊNG màn | When | UI reaction (verbatim) |
|---|---|---|
| 403 `result_forbidden` | token/phiên không phải chủ kết quả | state Locked: "This result isn't available on this device. Sign in if you saved it, or take the test again." |
| 404 `result_not_found` | id không tồn tại | y hệt 403 (cùng copy) để không dò được id |
| 410 `result_expired` | kết quả khách quá 30 ngày chưa lưu, đã bị API-JOB-02 xoá | state Error, cùng copy với 403 |

Phản hồi 403/404/410 không kèm tên bài, type hay điểm trong `message` (bảo vệ bài `sensitive`).

## API-RES-02 · POST `/v1/results/{resultId}/claim`

Lưu kết quả vào tài khoản. Khách: tạo token đăng nhập dùng một lần (cùng loại token với API-AUTH-01, hết hạn 15 phút, `next=/results/{resultId}`), lưu kèm token khách đã gửi yêu cầu, rồi gửi API-MAIL-01 chứa link `/login/callback?token=<token>`. Bấm link thì API-AUTH-02 tạo hoặc đăng nhập tài khoản với email đó, gộp kết quả của token khách lưu kèm link và của `tl_guest` trên trình duyệt mở link (SYS-AUTH), rồi đưa về `next`. Có phiên `tl_session`: gộp ngay vào tài khoản đang đăng nhập, không gửi mail. Phản hồi giống nhau dù email đã có tài khoản hay chưa. Gọi lặp với cùng `resultId` + email trong 1 phút mà không có `resend` thì trả như lần đầu, không gửi thêm mail. Giới hạn gửi lại 3 lần/giờ cho mỗi email (BR-TEST-09). Auth: khách được (phải là chủ kết quả); cần `X-CSRF-Token`.

| Body field | Type | Required | Meaning | Basis |
|---|---|---|---|---|
| `email` | string (≤ 254 ký tự; server trim + lowercase) | có khi không có phiên; bỏ qua khi có phiên | email nhận link | BR-TEST-09 · Q-11 |
| `resend` | boolean | không | `true` khi bấm "Resend link": bỏ qua cửa sổ idempotent 1 phút, vẫn tính vào giới hạn 3 lần/giờ | BR-TEST-09 · SYS-AUTH |

| Response `data` field | Type | Meaning | Basis |
|---|---|---|---|
| `status` | enum `link_sent` · `claimed` | `link_sent`: đã gửi mail · `claimed`: đã gộp ngay vào tài khoản đang đăng nhập | BR-TEST-09 · SYS-AUTH |
| `email` | string / null | email đã chuẩn hoá, dùng trong "We sent a link to [email]."; null khi `claimed` | BR-TEST-09 |
| `expiresInSec` | int | `900` → "Open it within 15 minutes …" | BR-APP-10 |
| `resendAfterSec` | int | `30` → hiện "Resend link" | in-house |

```json
{
  "code": 0, "message": "ok",
  "data": { "status": "link_sent", "email": "sam@example.com", "expiresInSec": 900, "resendAfterSec": 30 }
}
```

| Lỗi RIÊNG màn | When | UI reaction (verbatim) |
|---|---|---|
| 400 `invalid_email` (field `email`) | email sai định dạng | dưới ô "Email": "Enter a valid email address." |
| 422 `already_claimed` | kết quả đã gắn một tài khoản (vd tab khác vừa lưu) | "This result is already saved to an account. Sign in to see it." |
| 429 `too_many_requests` | quá 3 lần/giờ cho email này | "Too many requests. Please wait a moment and try again."; "Resend link" khoá theo `Retry-After` |
| 403 · 404 · 410 | như API-RES-01 | như API-RES-01 |

## API-RES-03 · DELETE `/v1/results/{resultId}`

Xoá cứng kết quả + câu trả lời + report ráp từ kết quả đó (BR-REP-07). Với bài `sensitive` đây là cách rút consent (SYS-CONSENT); với khách đây là cách tự xoá dữ liệu, không cần tài khoản (Q-28). Auth: chủ sở hữu (token `tl_guest` hoặc phiên); không có body.

| Response `data` field | Type | Meaning | Basis |
|---|---|---|---|
| `deleted` | boolean | luôn `true` khi thành công | BR-APP-11 |
| `lostFullReport` | boolean | kết quả này từng được mở khoá lẻ → UI đã cảnh báo trước khi xoá | BR-REP-07 · Q-18 |

| Lỗi RIÊNG màn | When | UI reaction (verbatim) |
|---|---|---|
| 404 | đã xoá trước đó / id lạ | coi như đã xoá: "Result deleted." |
| 403 | không phải chủ sở hữu | state Locked (copy 403 của màn) |
| 5xx / mạng | lỗi server | toast "We couldn't delete this result. Please try again." |

## Field → UI map

| Response field | Used by (CMP-ID) | Display format |
|---|---|---|
| `type.name` · `type.summary` | CMP-02 | "Your result: [Type]" + 1 câu |
| `scales[]` | CMP-03 | thanh + "[n]%", giữ thứ tự server trả |
| `explanations[]` | CMP-04 | mỗi thang một đoạn |
| `report.chapters` · `report.pageCount` | CMP-05 | danh sách chương + "About [N] pages" |
| `report.access` · `report.reportId` | CMP-05 · NAV-TEST-02-1 · NAV-TEST-02-2 | chọn nút "Unlock full report" / "Read full report" / dòng "Confirming your payment…" |
| `claimed` · `viewerSignedIn` · `expiresAt` | CMP-06 | form khách + "Saved on this device until [date]" · nút "Save to my account" · "Saved to your account." |
| `testSlug` | CMP-07 · NAV-TEST-02-3 | route `/tests/:slug/take` |
| `sensitive` | CMP-09 · §11 Tracking | hiện thông báo, tắt analytics |
| `scoringVersion` | CMP-10 | "Scored with version [v] of this test." |
| `report.excerpt` | SCR-PAY-01 (xem trước) | đoạn đầu chương 1; màn này không dùng |
| `status` · `email` · `expiresInSec` · `resendAfterSec` (API-RES-02) | CMP-06 | "Check your inbox" + "We sent a link to [email]. …" + "Resend link" |

## AI Notices
- Payload và tên field là SPEC mới, không lấy từ đối thủ (đối thủ không có bước lưu kết quả bằng email trước checkout, RS·F-20).
- `report.pageCount` phải đo từ PDF render thật (TD-03), không ước lượng. UI ghi "About [N] pages" vì report của từng người có thể lệch vài trang so với bản đo.
- Shape phản hồi của API-RES-02 (`expiresInSec` · `resendAfterSec`, lỗi 400/429) theo cùng mẫu với API-AUTH-01 (`SCR-AUTH-01-api.md`) vì hai endpoint cùng gửi một loại link.
- Nhánh "có phiên → gộp ngay" của API-RES-02 chỉ dùng cho trường hợp hiếm (EC-07 của màn), vì đăng nhập đã gộp kết quả `tl_guest` của trình duyệt (SCR-AUTH-01). Đây là chi tiết in-house theo Q-11 (đã chốt).
- `testName` · `type` trong ví dụ là dữ liệu minh hoạ. Tên bài và tên type thật do nội dung tự đặt theo Q-07 (đã chốt: không nhãn chẩn đoán, không tên thương hiệu bên khác), chờ legal review (`bang-quyet-dinh` §2 #5).
