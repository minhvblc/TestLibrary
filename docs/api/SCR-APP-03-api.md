# [SCR-APP-03] API — Report chi tiết
Refs: `docs/screens/SCR-APP-03-report-chi-tiet.md` · FLOW-mo-khoa-report · `00-quy-uoc-api.md` (envelope, lỗi chung, idempotency — KHÔNG lặp lại ở đây)
**Changelog** (mới nhất trước)
- 2026-09-27 · v1 · claude (subagent) · khởi tạo từ blueprint.

## 0. Endpoint overview

| ID | Endpoint | Method | When called | Idempotent (key) | Contract status |
|---|---|---|---|---|---|
| API-REP-02 | `/v1/reports/{reportId}` | GET | mở SCR-APP-03; tải lại khi `access = pending`; "Try again" | n/a (GET) | proposal |
| API-REP-03 | `/v1/reports/{reportId}/pdf` | POST | bấm "Download PDF" | có — `reportId` + `contentVersion` + locale, server tự suy ra (00-quy-uoc-api §5) | proposal |
| API-REP-04 | `/v1/reports/{reportId}/pdf` | GET | hỏi trạng thái job PDF; lấy signed URL mới | n/a (GET) | proposal |

Auth chung: cookie `tl_session`, HOẶC cookie `tl_guest` sở hữu kết quả của report (BR-REP-05). Không có cả hai → 401 → client chuyển `/login?next=/app/reports/:reportId` (tieu-chuan-chung §1).

## API-REP-02 · GET `/v1/reports/{reportId}`

Trả report của một kết quả. Mỗi kết quả có đúng một `reportId`, sinh cùng lúc với kết quả. Nội dung chương chỉ được ráp (từ `report_blocks`, theo `contentVersion` đã ghim) khi người xem có `report.full`. Khi chưa có quyền, server vẫn trả hero, điểm và tên chương để dựng state Locked, nhưng `blocks` là null: nội dung không rời server. Không side effect.

| Path param | Type | Required | Meaning | Basis |
|---|---|---|---|---|
| `reportId` | uuid | có | id report (1–1 với `resultId`) | TD-02 |

| Response `data` field | Type | Meaning | Basis |
|---|---|---|---|
| `reportId` | uuid | như request | TD-02 |
| `resultId` | uuid | dùng cho "Unlock full report" (NAV-APP-03-2) | BR-APP-01 |
| `testName` | string | hero "[Test name] · [date]" | in-house |
| `takenAt` | ISO-8601 | ngày trong hero, hiển thị theo timezone tài khoản | tieu-chuan-chung §4 · BR-APP-09 |
| `sensitive` | boolean | hiện CMP-07, tắt mọi event analytics | BR-APP-06 · Q-06 |
| `type` | object `{ name: string, summary: string }` | H1 + 1 câu mô tả | TD-02 |
| `scales` | array `{ key: string, name: string, percent: int 0–100, band: string }`, đã xếp giảm dần | GC-ScoreBars | BR-TEST-07 |
| `scoringVersion` | string | "Scored with version [v]" | BR-APP-07 |
| `contentVersion` | string | version nội dung đã ghim ở kết quả; khoá cache PDF | BR-REP-03 · TD-03 |
| `access` | enum `full` · `pending` · `locked` | Default · chờ webhook · Locked | SYS-ENTITLEMENT · BR-REP-06 |
| `chapters` | array `{ index: int, title: string, blocks: array / null }`; `blocks` = array `{ kind: enum paragraph · list · callout, text: string }`, null khi `access` khác `full` | mục lục + nội dung chương | TD-02 · BR-REP-06 |
| `pdf` | object `{ status: enum none · generating · ready, pageCount: int / null }` | nhãn nút CMP-03; `pageCount` chỉ có khi file đã render | BR-REP-04 · TD-03 |
| `viewerSignedIn` | boolean | chọn header (app / tối giản) và ẩn/hiện CMP-10 | BR-REP-05 · SYS-NAV §4 |

```json
{
  "code": 0, "message": "ok",
  "data": {
    "reportId": "3e70…", "resultId": "9f1c…", "testName": "Big Five Personality Test", "takenAt": "2026-09-26T14:02:00Z",
    "sensitive": false,
    "type": { "name": "The Explorer", "summary": "You look for new ideas and new experiences." },
    "scales": [ { "key": "openness", "name": "Openness", "percent": 82, "band": "high" } ],
    "scoringVersion": "big5-ipip-1.2", "contentVersion": "c7",
    "access": "full",
    "chapters": [ { "index": 1, "title": "How you think", "blocks": [ { "kind": "paragraph", "text": "…" } ] } ],
    "pdf": { "status": "ready", "pageCount": 18 },
    "viewerSignedIn": true
  }
}
```

| Lỗi RIÊNG màn | When | UI reaction (verbatim) |
|---|---|---|
| 401 | không có phiên và không có token sở hữu | chuyển `/login?next=/app/reports/:reportId` |
| 404 `report_not_found` | id không tồn tại hoặc không thuộc người xem | trang 404 chung (00-quy-uoc-api §4); không hiện Locked |
| 5xx / report rỗng | lỗi server hoặc lỗi cấu hình nội dung | "Something went wrong on our side. Please try again." |

Không dùng 403 cho trường hợp chưa mở khoá: state Locked cần tiêu đề chương và điểm, nên server trả 200 với `access = locked`.

## API-REP-03 · POST `/v1/reports/{reportId}/pdf`

Tạo, hoặc trả lại, job PDF cho (`reportId`, `contentVersion`, locale). File đã có trong cache thì trả `ready` + URL ngay. Chưa có thì đẩy job vào hàng đợi worker Playwright (API-JOB-05). Worker render route `?print=1` bằng token nội bộ ngắn hạn, không dùng cookie của user. Nếu job xong sau hơn 10 s kể từ lúc yêu cầu, server gửi API-MAIL-08 kèm link. Auth: như API-REP-02, cộng thêm quyền `report.pdf` (SYS-ENTITLEMENT).

| Body field | Type | Required | Meaning | Basis |
|---|---|---|---|---|
| `locale` | string | không | mặc định `en-US` | Q-14 |

| Response `data` field | Type | Meaning | Basis |
|---|---|---|---|
| `status` | enum `ready` · `generating` · `failed` | trạng thái job | TD-03 |
| `url` | string / null | signed URL tải file, sống 10 phút; chỉ có khi `ready` | TD-03 |
| `pageCount` | int / null | số trang của file thật; chỉ có khi `ready` | BR-REP-04 |

```json
{ "code": 0, "message": "ok", "data": { "status": "generating", "url": null, "pageCount": null } }
```

| Lỗi RIÊNG màn | When | UI reaction (verbatim) |
|---|---|---|
| 403 `pdf_forbidden` | vừa mất quyền (vd Plus hết kỳ) | tải lại API-REP-02 → state Locked |
| 429 | bấm dồn quá nhanh | "Too many requests. Please wait a moment and try again." |
| 5xx / `status = failed` | render lỗi | "Your PDF is taking longer than usual. We'll email it to you — or use Print → Save as PDF." |

## API-REP-04 · GET `/v1/reports/{reportId}/pdf`

Trả trạng thái PDF mới nhất cho (`reportId`, `contentVersion`, locale). Mỗi lần gọi khi file `ready` sẽ ký một URL mới (sống 10 phút). Client hỏi mỗi 1 s, tối đa 10 s, sau API-REP-03. Auth: như API-REP-03.

| Query param | Type | Required | Meaning | Basis |
|---|---|---|---|---|
| `locale` | string | không | mặc định `en-US` | Q-14 |

| Response `data` field | Type | Meaning | Basis |
|---|---|---|---|
| `status` | enum `none` · `generating` · `ready` · `failed` | `none` = chưa có job | TD-03 |
| `url` | string / null | signed URL mới, 10 phút | TD-03 |
| `pageCount` | int / null | số trang thật | BR-REP-04 |

| Lỗi RIÊNG màn | When | UI reaction (verbatim) |
|---|---|---|
| 403 `pdf_forbidden` | mất quyền | tải lại API-REP-02 → state Locked |
| mất mạng khi đang hỏi | — | dừng hỏi, hiện copy PDF chậm của cong-nghe-loi §3; email vẫn tới khi job xong |

## Field → UI map

| Response field | Used by (CMP-ID) | Display format |
|---|---|---|
| `testName` · `takenAt` · `type` · `scoringVersion` | CMP-02 | "[Test name] · [date]" · H1 "[Type]" · 1 câu · "Scored with version [v]" |
| `pdf.status` · `pdf.pageCount` · `url` · `pageCount` (API-REP-03 / 04) | CMP-03 · NAV-APP-03-1 | "Download PDF ([N] pages)" / "Download PDF" / "Preparing your PDF…" |
| `scales[]` | CMP-04 | GC-ScoreBars |
| `chapters[].title` · `index` | CMP-05 · NAV-APP-03-4 | mục lục, link `#chapter-<n>` |
| `chapters[].blocks` | CMP-06 | đoạn văn · danh sách · khung nhấn |
| `sensitive` | CMP-07 · §11 Tracking | hiện thông báo, tắt analytics |
| `access` · `resultId` | CMP-09 · NAV-APP-03-2 | "Unlock the full report to read every chapter." + "Unlock full report" / "Confirming your payment…" |
| `viewerSignedIn` | CMP-01 · CMP-10 · NAV-APP-03-3 | header app hoặc tối giản; ẩn/hiện "Back to My reports" |

## AI Notices
- Payload và tên field là SPEC mới, không lấy từ đối thủ. Đối thủ render PDF từ HTML bằng headless Chromium (RS·F-34), mình chỉ cùng hướng kỹ thuật (TD-03).
- `pdf.pageCount` và `pageCount` luôn là số trang của file thật. Đối thủ hứa "20-page report" nhưng file có 11 trang (RS·F-23); mình không được lệch như vậy.
- Chưa có API ghi feedback cho CMP-08 ("Was this report useful?"); cần thêm vào `api-mapping.md`.
