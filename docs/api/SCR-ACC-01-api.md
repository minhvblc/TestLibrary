# [SCR-ACC-01] API — Tài khoản & quyền riêng tư
Refs: `docs/screens/SCR-ACC-01-tai-khoan.md` · FLOW-quyen-rieng-tu · `00-quy-uoc-api.md` (envelope, lỗi chung, idempotency — KHÔNG lặp lại ở đây)
**Changelog** (mới nhất trước)
- 2026-09-28 · v1.1 · claude-opus-5-5 · AI Notice cũ: API-JOB-06 · API-MAIL-10 đã có.
- 2026-09-27 · v1 · claude (subagent) · khởi tạo từ blueprint.

## 0. Endpoint overview

| ID | Endpoint | Method | When called | Idempotent (key) | Contract status |
|---|---|---|---|---|---|
| API-ME-01 | `/v1/me` | GET | mở SCR-ACC-01 (cũng dùng ở SCR-APP-01 và GC-SiteHeader) | n/a (GET) | proposal |
| API-ME-02 | `/v1/me` | PATCH | "Save changes" | có — theo giá trị (gửi lại cùng giá trị cho cùng kết quả) | proposal |
| API-ME-03 | `/v1/me/data-exports` | POST | "Download my data" | có — `userId` + ngày nghiệp vụ (00-quy-uoc-api §5) | proposal |
| API-AUTH-05 | `/v1/auth/logout` | POST | "Sign out" | an toàn khi lặp | proposal |

Mọi endpoint cần cookie `tl_session`; PATCH/POST kèm `X-CSRF-Token` (00-quy-uoc-api §2).

## API-ME-01 · GET `/v1/me`

Hồ sơ của tài khoản đang đăng nhập. Đây là schema đầy đủ; SCR-APP-01 chỉ dùng `name`. Không side effect.

| Response `data` field | Type | Meaning | Basis |
|---|---|---|---|
| `name` | string (≤ 80 ký tự, có thể rỗng) | ô "Name"; lời chào ở SCR-APP-01 | EV-TLW-246 · in-house |
| `email` | string | email đăng nhập, chỉ đọc | SYS-AUTH |
| `timezone` | string (tên IANA) | timezone đang áp dụng cho ngày nghiệp vụ | BR-APP-09 |
| `pendingTimezone` | object / null `{ timezone: string, effectiveOn: date }` | timezone mới đang chờ hiệu lực → "Your new time zone applies from [date]." | BR-ACC-03 |
| `emailPrefs` | object `{ productUpdates: boolean, weeklyCheckinReminder: boolean }` | 2 toggle; mặc định cả hai `false` | BR-ACC-01 |
| `lastExportRequestedAt` | ISO-8601 / null | disable "Download my data" trong cùng ngày nghiệp vụ + ngày trong copy giới hạn | BR-ACC-02 |

```json
{
  "code": 0, "message": "ok",
  "data": {
    "name": "Sam Lee", "email": "sam@example.com",
    "timezone": "Asia/Ho_Chi_Minh", "pendingTimezone": null,
    "emailPrefs": { "productUpdates": false, "weeklyCheckinReminder": false },
    "lastExportRequestedAt": null
  }
}
```

| Lỗi RIÊNG màn | When | UI reaction (verbatim) |
|---|---|---|
| 401 | phiên hết hạn | chuyển `/login?next=/account` (tieu-chuan-chung §1) |

## API-ME-02 · PATCH `/v1/me`

Cập nhật một phần hồ sơ; chỉ gửi field đã đổi. Không có field `email` (không đổi được trong MVP), cũng không có tuỳ chọn cho email giao dịch/gia hạn (luôn gửi, BR-ACC-01). Server bỏ qua field lạ. Side effect: đổi `timezone` không ghi đè ngay mà tạo `pendingTimezone` có hiệu lực từ ngày nghiệp vụ kế tiếp, tính theo timezone cũ; đổi lần nữa trong cùng ngày thì thay giá trị đang chờ.

| Body field | Type | Required | Meaning | Basis |
|---|---|---|---|---|
| `name` | string (≤ 80 ký tự; trim; chỉ khoảng trắng → rỗng) | không | tên hiển thị | in-house |
| `timezone` | string (tên IANA) | không | timezone mới | BR-ACC-03 · BR-APP-09 |
| `emailPrefs` | object, có 1 hoặc cả 2 key `productUpdates` · `weeklyCheckinReminder` (boolean) | không | tuỳ chọn email không-thiết-yếu | BR-ACC-01 |

Response `data`: cùng schema với API-ME-01, sau khi cập nhật.

| Lỗi RIÊNG màn | When | UI reaction (verbatim) |
|---|---|---|
| 422 `invalid_name` (field `name`) | quá 80 ký tự | "Name must be 80 characters or fewer." |
| 422 `invalid_timezone` (field `timezone`) | không phải tên IANA hợp lệ | "Choose a time zone from the list." |
| 5xx / mất mạng | lưu thất bại | "We couldn't save your changes. Please try again." (giữ dữ liệu đã nhập) |

## API-ME-03 · POST `/v1/me/data-exports`

Yêu cầu bản sao dữ liệu. Side effect: tạo job API-JOB-03 dựng file JSON gồm hồ sơ, kết quả, câu trả lời, check-in và giao dịch (không có dữ liệu thẻ, vì thẻ chỉ nằm ở provider). Job xong thì gửi API-MAIL-06 với link ký tên hết hạn sau 7 ngày. Tối đa 1 yêu cầu mỗi ngày nghiệp vụ: gọi lặp trong ngày trả 409 kèm export đã có (409 = thành công, 00-quy-uoc-api §4). Không có body.

| Response `data` field | Type | Meaning | Basis |
|---|---|---|---|
| `exportId` | uuid | id yêu cầu export | BR-ACC-02 |
| `status` | enum `queued` · `ready` · `failed` | trạng thái job | BR-ACC-02 |
| `requestedAt` | ISO-8601 | "Your last request: [date]." | BR-ACC-02 |

```json
{ "code": 0, "message": "ok", "data": { "exportId": "a41b…", "status": "queued", "requestedAt": "2026-09-27T08:15:00Z" } }
```

| Lỗi RIÊNG màn | When | UI reaction (verbatim) |
|---|---|---|
| 409 | đã yêu cầu trong ngày nghiệp vụ này | "You can request one export per day. Your last request: [date]." |
| 5xx / mất mạng | không tạo được job | "We couldn't start your export. Please try again." |

## API-AUTH-05 · POST `/v1/auth/logout`

Xoá phiên của thiết bị hiện tại (BR-APP-10): huỷ phiên ở server, xoá cookie `tl_session` và `tl_csrf`. Không đụng tới phiên trên thiết bị khác. Không có body; response `data` rỗng (`{}`). Sau khi nhận phản hồi, client ghi một khoá vào `localStorage` để các tab khác nhận sự kiện `storage` và chuyển về `/` (tieu-chuan-chung §1).

| Lỗi RIÊNG màn | When | UI reaction (verbatim) |
|---|---|---|
| 401 | phiên đã hết hạn từ trước | coi như đã đăng xuất → replace `/` |
| 5xx / mất mạng | server không nhận | vẫn xoá trạng thái đăng nhập ở client, replace `/`; phiên ở server tự hết hạn theo thời gian trượt 30 ngày |

## Field → UI map

| Response field | Used by (CMP-ID) | Display format |
|---|---|---|
| `name` | CMP-02 (ô "Name") | chuỗi, có thể rỗng |
| `email` | CMP-02 · CMP-05 | ô chỉ đọc · "[email]" trong copy export |
| `timezone` · `pendingTimezone` | CMP-02 | giá trị được chọn · "Your new time zone applies from [date]." |
| `emailPrefs.*` | CMP-04 | 2 toggle |
| `lastExportRequestedAt` · `requestedAt` · `status` (API-ME-03) | CMP-05 · NAV-ACC-01-5 | disable nút + "Your last request: [date]." · "We're preparing your file. …" |
| (API-AUTH-05 thành công) | CMP-09 · NAV-ACC-01-4 | replace `/` |

## AI Notices
- Payload và tên field là SPEC mới. Profile của đối thủ chỉ có Name · Email · Change password (EV-TLW-246); mình không có mật khẩu (SYS-AUTH).
- Toggle `weeklyCheckinReminder`: job + email đã có ở `api-mapping.md` §2 (API-JOB-06 · API-MAIL-10).
- Nội dung chi tiết file export (danh sách field JSON) chưa được đặc tả; cần viết cùng tài liệu BE và `legal-consent.md` §1.
