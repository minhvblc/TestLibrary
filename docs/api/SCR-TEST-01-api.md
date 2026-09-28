# [SCR-TEST-01] API — Làm bài
Refs: `docs/screens/SCR-TEST-01-lam-bai.md` · FLOW-lam-bai-mien-phi · `00-quy-uoc-api.md` (envelope, lỗi chung, idempotency — KHÔNG lặp lại ở đây)
**Changelog** (mới nhất trước)
- 2026-09-28 · v1.1 · claude-opus-5-5 · quyết định 2026-09-28 (AI · uỷ quyền human): API-TEST-01 thêm `ageConfirmed` (bắt buộc true với bài `sensitive`, lưu vào attempt cùng consent) + lỗi 422 `age_confirmation_required`; 422 của bài `sensitive` không tạo attempt (Q-21 · BR-TEST-11); Q-10 đã chốt.
- 2026-09-27 · v1 · claude-opus-5-5 · khởi tạo (proposal, exemplar API).

## 0. Endpoint overview

| ID | Endpoint | Method | When called | Idempotent (key) | Contract status |
|---|---|---|---|---|---|
| API-TEST-01 | `/v1/attempts` | POST | mở SCR-TEST-01: tạo hoặc tiếp tục attempt | có — `Idempotency-Key` = `attemptId` | proposal |
| API-TEST-02 | `/v1/attempts/{attemptId}/answers` | PUT | autosave (chỉ khi đã đăng nhập) | có — PUT theo `index` | proposal |
| API-TEST-03 | `/v1/attempts/{attemptId}/submit` | POST | chọn đáp án câu cuối / thử lại từ hàng đợi | có — `Idempotency-Key` = `attemptId` | proposal |

## API-TEST-01 · POST `/v1/attempts`

Tạo attempt mới, hoặc trả attempt đang dở nếu `attemptId` đã tồn tại và thuộc cùng chủ (token khách / tài khoản). Side effect: gắn attempt với `tl_guest` (tạo cookie nếu chưa có) hoặc với user; bài `sensitive`: lưu `sensitiveConsent` (version + thời điểm) và `ageConfirmed` vào attempt làm bằng chứng consent (SYS-CONSENT). Auth: khách được.

| Body field | Type | Required | Meaning | Basis |
|---|---|---|---|---|
| `attemptId` | uuid | có | client sinh khi mở bài, lưu localStorage | 00-quy-uoc-api §5 · TD-01 |
| `testSlug` | string | có | bài cần làm | API-CAT-02 |
| `locale` | string | không | mặc định `en-US` | Q-14 |
| `sensitiveConsent` | object `{ version: string, grantedAt: ISO-8601 }` | có nếu bài `sensitive` | consent dữ liệu nhạy cảm (CMP-03) | BR-TEST-04 · BR-APP-06 |
| `ageConfirmed` | boolean | có nếu bài `sensitive` (phải là `true`); bài thường bỏ qua | ô "I'm 18 or older." ở CMP-03 đã tick; không có ngày sinh | BR-TEST-11 · Q-21 |

| Response `data` field | Type | Meaning | Basis |
|---|---|---|---|
| `attemptId` | uuid | như request | TD-01 |
| `status` | enum `in_progress` · `submitted` | `submitted` → client chuyển sang kết quả | BR-TEST-06 |
| `resultId` | uuid / null | có khi `status = submitted` | BR-TEST-06 |
| `scoringVersion` | string | ghim lúc bắt đầu | BR-APP-07 |
| `contentVersion` | string | ghim thứ tự + nội dung câu | BR-APP-07 |
| `sensitive` | boolean | điều khiển CMP-03 · CMP-09 | Q-06 |
| `questionCount` | int | tổng số câu | BR-PUB-05 |
| `items` | array `{ index: int, id: string, text: string, scale: "likert5" }` | danh sách câu theo thứ tự | TD-01 |
| `answers` | array `{ index: int, value: 1–5 }` | đáp án đã lưu ở server (tài khoản) để resume | BR-TEST-02 |

```json
{
  "code": 0, "message": "ok",
  "data": {
    "attemptId": "5b8d…", "status": "in_progress", "resultId": null,
    "scoringVersion": "big5-ipip-1.2", "contentVersion": "c7", "sensitive": false,
    "questionCount": 24,
    "items": [ { "index": 1, "id": "q_o1", "text": "I enjoy trying new things.", "scale": "likert5" } ],
    "answers": []
  }
}
```

| Lỗi RIÊNG màn | When | UI reaction (verbatim) |
|---|---|---|
| 403 `region_blocked` | bài bị tắt theo vùng | state Locked: "This test isn't available in your region." |
| 422 `consent_required` | bài `sensitive` mà thiếu `sensitiveConsent`; không tạo attempt | hiện CMP-03 (không phải lỗi hiển thị) |
| 422 `age_confirmation_required` | bài `sensitive` mà `ageConfirmed` không phải `true`; không tạo attempt | giữ CMP-03, focus ô "I'm 18 or older." + "Tick the box to confirm you're 18 or older." (chỉ gặp khi client bị qua mặt, vì nút đã khoá) |
| 404 `test_not_found` | slug sai / bài gỡ | state Empty: "This test is being updated. Try another test." |

## API-TEST-02 · PUT `/v1/attempts/{attemptId}/answers`

Autosave cho tài khoản đã đăng nhập (khách chỉ lưu local). Ghi đè theo `index`. Auth: `tl_session` bắt buộc.

| Body field | Type | Required | Meaning | Basis |
|---|---|---|---|---|
| `answers` | array `{ index: int, value: 1–5, answeredAt: ISO-8601 }` (≤ 10 phần tử) | có | các câu mới/sửa từ lần autosave trước | BR-TEST-02 |

| Response `data` field | Type | Meaning | Basis |
|---|---|---|---|
| `savedCount` | int | số câu đã lưu | BR-TEST-02 |
| `lastIndex` | int | câu lớn nhất đã có đáp án | BR-TEST-02 |

| Lỗi RIÊNG màn | When | UI reaction (verbatim) |
|---|---|---|
| 409 `already_submitted` | attempt đã nộp ở tab khác | chuyển sang kết quả (replace) — EC-01 |
| lỗi mạng | autosave thất bại | im lặng, giữ local, thử lại lần sau (không làm phiền user) |

## API-TEST-03 · POST `/v1/attempts/{attemptId}/submit`

Nộp toàn bộ đáp án. Server chấm điểm theo `scoringVersion` của attempt (BR-APP-07 · Q-10) và tạo `result`. Side effect: attempt → `submitted`; kết quả gắn chủ; bài `sensitive` lưu cờ trên result (không vào analytics). Auth: khách được.

| Body field | Type | Required | Meaning | Basis |
|---|---|---|---|---|
| `answers` | array `{ index: int, value: 1–5 }` đủ `questionCount` phần tử | có | toàn bộ đáp án | TD-01 |
| `durationMs` | int | không | thời gian làm (median nội bộ cho BR-PUB-05) | BR-PUB-05 |
| `offlineQueued` | boolean | không | nộp từ hàng đợi offline | ft_test |

| Response `data` field | Type | Meaning | Basis |
|---|---|---|---|
| `resultId` | uuid | id kết quả | BR-APP-08 |
| `resultUrl` | string | `/results/{resultId}` | NAV-TEST-01-1 |
| `scoringVersion` | string | để hiển thị ở SCR-TEST-02 | BR-APP-07 |

| Lỗi RIÊNG màn | When | UI reaction (verbatim) |
|---|---|---|
| 409 `already_submitted` | nộp lặp (cùng `Idempotency-Key`) | coi là thành công, dùng `resultId` trả về |
| 400 `incomplete_answers` | thiếu/thừa câu | về câu thiếu đầu tiên: "Please answer this question to finish." |
| 5xx / timeout 10 s / offline | lỗi server / mạng | xếp hàng, CMP-08: "We couldn't submit your answers yet. We'll retry automatically — your answers are safe on this device." |

## Field → UI map

| Response field | Used by (CMP-ID) | Display format |
|---|---|---|
| `items[].text` | CMP-04 | chữ to, căn trái |
| `questionCount` · vị trí hiện tại | CMP-02 | "Question [k] of [n]" |
| `sensitive` | CMP-03 · CMP-09 | hiện bước consent + thông báo |
| `answers[]` | CMP-05 | đánh dấu đáp án đã chọn khi resume |
| `resultId` | NAV-TEST-01-1 | điều hướng replace |

## AI Notices
- Payload và tên field là SPEC mới, không lấy từ đối thủ (đối thủ không gửi câu trả lời lên server ở bài free, RS·F-31).
- Kích thước nộp tối đa 32 KB (00-quy-uoc-api §4 · 413).
