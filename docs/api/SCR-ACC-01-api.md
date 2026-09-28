# [SCR-ACC-01] API — Tài khoản & quyền riêng tư
Refs: `docs/screens/SCR-ACC-01-tai-khoan.md` · FLOW-quyen-rieng-tu · FLOW-thoi-quen-hang-ngay · `00-quy-uoc-api.md` (envelope, lỗi chung, idempotency — KHÔNG lặp lại ở đây)
**Changelog** (mới nhất trước)
- 2026-09-28 · v1.2 · claude-opus-5-5 · Q-22 (consent check-in): API-ME-01 thêm `checkins`; API-ME-02 thêm body `checkins` (`enabled: true` + `consentVersion` = bật; `enabled: false` = tắt, xoá cứng lịch sử + tắt nhắc trong cùng transaction; `dismissed: true` + `consentVersion` = "Not now", không đổi dữ liệu) và rule version `checkinConsentVersion` (major hỏi lại + tạm dừng, minor không), lỗi 400 `invalid_checkins` · 422 `consent_outdated`; `weeklyCheckinReminder` chỉ khi check-in đang bật (BR-ACC-08). `enabled: false` xoá luôn file export còn hạn (BR-APP-11).
- 2026-09-28 · v1.1 · claude-opus-5-5 · AI Notice cũ: API-JOB-06 · API-MAIL-10 đã có.
- 2026-09-27 · v1 · claude (subagent) · khởi tạo từ blueprint.

## 0. Endpoint overview

| ID | Endpoint | Method | When called | Idempotent (key) | Contract status |
|---|---|---|---|---|---|
| API-ME-01 | `/v1/me` | GET | mở SCR-ACC-01 (cũng dùng ở SCR-APP-01 và GC-SiteHeader) | n/a (GET) | proposal |
| API-ME-02 | `/v1/me` | PATCH | "Save changes" · "Turn off and delete" (CMP-10); SCR-APP-01 gửi `checkins` ở bước bật check-in | có — theo giá trị (gửi lại cùng giá trị cho cùng kết quả; tắt check-in lặp → 200, không xoá lần hai) | proposal |
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
| `emailPrefs` | object `{ productUpdates: boolean, weeklyCheckinReminder: boolean }` | 2 toggle; mặc định cả hai `false`; `weeklyCheckinReminder` luôn `false` khi check-in đang tắt, và chỉ hiện khi check-in đang bật | BR-ACC-01 · BR-ACC-08 |
| `checkins` | object `{ enabled: boolean, consentVersion: string / null, consentedAt: ISO-8601 / null }` | CMP-10: bật → toggle "Daily check-ins", tắt → "Check-ins are off." + link; `consentVersion` + `consentedAt` là version câu đồng ý (`checkinConsentVersion`, dạng `major.minor`) và thời điểm đồng ý đang hiệu lực, null khi đang tắt (không hiện trên UI); đang bật mà version cũ hơn major hiện hành (chờ đồng ý lại ở SCR-APP-01) thì vẫn `enabled = true`, lịch sử còn | Q-22 · BR-ACC-07 · BR-DASH-06 |
| `lastExportRequestedAt` | ISO-8601 / null | disable "Download my data" trong cùng ngày nghiệp vụ + ngày trong copy giới hạn | BR-ACC-02 |

```json
{
  "code": 0, "message": "ok",
  "data": {
    "name": "Sam Lee", "email": "sam@example.com",
    "timezone": "Asia/Ho_Chi_Minh", "pendingTimezone": null,
    "emailPrefs": { "productUpdates": false, "weeklyCheckinReminder": false },
    "checkins": { "enabled": true, "consentVersion": "1.0", "consentedAt": "2026-09-27T08:10:00Z" },
    "lastExportRequestedAt": null
  }
}
```

| Lỗi RIÊNG màn | When | UI reaction (verbatim) |
|---|---|---|
| 401 | phiên hết hạn | chuyển `/login?next=/account` (tieu-chuan-chung §1) |

## API-ME-02 · PATCH `/v1/me`

Cập nhật một phần hồ sơ; chỉ gửi field đã đổi. Không có field `email` (không đổi được trong MVP), cũng không có tuỳ chọn cho email giao dịch/gia hạn (luôn gửi, BR-ACC-01). Server bỏ qua field lạ. Side effect: đổi `timezone` không ghi đè ngay mà tạo `pendingTimezone` có hiệu lực từ ngày nghiệp vụ kế tiếp, tính theo timezone cũ; đổi lần nữa trong cùng ngày thì thay giá trị đang chờ.

Field `checkins` bật / tắt check-in cảm xúc (consent tường minh, Q-22). Client gửi riêng, không gộp với "Save changes". Mỗi request có đúng một trong `enabled` / `dismissed`:
- `{ enabled: true, consentVersion }`: "Turn on check-ins" ở bước bật check-in của SCR-APP-01 (CMP-08) — lần đầu, bật lại, hoặc đồng ý bản mới. Server nhận `consentVersion` cùng major với câu đồng ý hiện hành (khác minor vẫn nhận, lưu đúng bản client đã hiện), lưu `checkin_consent_version` + thời điểm đồng ý (UTC) rồi cho check-in chạy (BR-DASH-05); lịch sử cũ (khi đang chờ đồng ý lại) giữ nguyên. Đã chạy với cùng major → 200 trạng thái hiện tại, không ghi lại.
- `{ enabled: false }`: "Turn off and delete" ở SCR-ACC-01 = rút consent (BR-ACC-07). Trong cùng một transaction: xoá cứng mọi check-in của tài khoản (streak tính từ đó nên về 0), đặt `emailPrefs.weeklyCheckinReminder = false` (BR-ACC-08), ghi thời điểm tắt vào bản ghi consent, xoá file export còn hạn của tài khoản (có chứa check-in — BR-APP-11). Không khoảng chờ, không khôi phục. Đang tắt → 200, không làm gì thêm.
- `{ dismissed: true, consentVersion }`: "Not now" ở CMP-08 khi bước này tự hiện. Không đổi dữ liệu, không đổi `enabled`; server chỉ ghi lại câu trả lời cho major đó để SCR-APP-01 không tự mở lại: chưa bật → API-APP-01 `checkin.state = off`; đang bật với major cũ → `paused` (check-in mới vẫn tạm dừng, lịch sử giữ nguyên).
- Version `checkinConsentVersion` (dạng `major.minor`, rule ở SYS-CONSENT): đổi lớn (mục đích hoặc nơi dữ liệu đi mở rộng) → tăng major → tài khoản đang bật với major cũ chuyển sang chờ đồng ý lại (`checkin.state = reask`): check-in mới tạm dừng (API-APP-02 422 `consent_required`), lịch sử giữ nguyên tới khi user tắt ở SCR-ACC-01; đổi nhỏ (chỉ sửa câu chữ cho rõ) → tăng minor, không hỏi lại (BR-DASH-06).
- `emailPrefs.weeklyCheckinReminder = true` khi check-in đang tắt → server giữ `false` (BR-ACC-08).

| Body field | Type | Required | Meaning | Basis |
|---|---|---|---|---|
| `name` | string (≤ 80 ký tự; trim; chỉ khoảng trắng → rỗng) | không | tên hiển thị | in-house |
| `timezone` | string (tên IANA) | không | timezone mới | BR-ACC-03 · BR-APP-09 |
| `emailPrefs` | object, có 1 hoặc cả 2 key `productUpdates` · `weeklyCheckinReminder` (boolean) | không | tuỳ chọn email không-thiết-yếu | BR-ACC-01 · BR-ACC-08 |
| `checkins` | object `{ enabled?: boolean, dismissed?: true, consentVersion?: string }`; đúng một trong `enabled` / `dismissed`; `consentVersion` bắt buộc khi `enabled = true` hoặc `dismissed = true` | không | bật check-in (consent tường minh; version câu đồng ý client vừa hiện), tắt (rút consent, xoá lịch sử) hoặc ghi "Not now" | Q-22 · BR-DASH-05 · BR-DASH-06 · BR-ACC-07 |

Response `data`: cùng schema với API-ME-01, sau khi cập nhật.

| Lỗi RIÊNG màn | When | UI reaction (verbatim) |
|---|---|---|
| 422 `invalid_name` (field `name`) | quá 80 ký tự | "Name must be 80 characters or fewer." |
| 422 `invalid_timezone` (field `timezone`) | không phải tên IANA hợp lệ | "Choose a time zone from the list." |
| 400 `invalid_checkins` (field `checkins`) | thiếu cả `enabled` lẫn `dismissed`, có cả hai, hoặc thiếu `consentVersion` khi cần | không có copy (UI luôn gửi đúng) |
| 422 `consent_outdated` (field `checkins.consentVersion`) | `enabled = true` với version khác major của câu đồng ý hiện hành (trang mở từ trước khi đổi major) | SCR-APP-01: tải lại trang, bước bật check-in hiện bản mới + "This notice has changed. Please review it and try again."; chưa bật |
| 5xx / mất mạng ("Save changes") | lưu thất bại | "We couldn't save your changes. Please try again." (giữ dữ liệu đã nhập) |
| 5xx / mất mạng khi gửi `checkins` | không lưu; transaction không nửa vời (tắt lỗi thì lịch sử còn nguyên) | tắt (SCR-ACC-01): "We couldn't turn off check-ins. Please try again." (toggle giữ bật) · bật (SCR-APP-01): "We couldn't turn on check-ins. Please try again." · "Not now" (SCR-APP-01): không copy |

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
| `emailPrefs.*` | CMP-04 | 2 toggle ("Weekly check-in reminder" chỉ khi `checkins.enabled = true`) |
| `checkins.enabled` | CMP-10 · CMP-04 · NAV-ACC-01-7 · NAV-ACC-01-8 | bật: toggle "Daily check-ins" + ghi chú · tắt: "Check-ins are off." + link "Turn them on from your dashboard" |
| `lastExportRequestedAt` · `requestedAt` · `status` (API-ME-03) | CMP-05 · NAV-ACC-01-5 | disable nút + "Your last request: [date]." · "We're preparing your file. …" |
| (API-AUTH-05 thành công) | CMP-09 · NAV-ACC-01-4 | replace `/` |

## AI Notices
- Payload và tên field là SPEC mới. Profile của đối thủ chỉ có Name · Email · Change password (EV-TLW-246); mình không có mật khẩu (SYS-AUTH).
- Toggle `weeklyCheckinReminder`: job + email đã có ở `api-mapping.md` §2 (API-JOB-06 · API-MAIL-10); chỉ gửi khi `checkins.enabled = true` (BR-ACC-08) — registry chưa ghi điều kiện này.
- `checkins` (Q-22, chốt 2026-09-28): file này là owner schema của API-ME-02; SCR-APP-01-api chỉ cite. Cột DB `checkin_consent_version` + thời điểm theo `cong-nghe-loi` §4. `consentVersion` = `checkinConsentVersion` (`major.minor`) của câu đồng ý CMP-08 mà client đang hiện — hằng số build (như `consentVersion` của GC-ConsentBanner); server giữ version hiện hành trong cấu hình. Field `dismissed` là phần thêm vào `checkins: { enabled, consentVersion }` của quyết định: "Not now" không được gửi `enabled: false`, vì lệnh đó xoá lịch sử, sai với rule giữ lịch sử khi đang chờ đồng ý lại.
- Bản ghi bật / tắt consent check-in (version, thời điểm; không chứa giá trị check-in) được giữ làm bằng chứng; thời hạn giữ chưa có hàng riêng ở `cong-nghe-loi` §4.
- Nội dung chi tiết file export (danh sách field JSON) chưa được đặc tả; cần viết cùng tài liệu BE và `legal-consent.md` §1.
