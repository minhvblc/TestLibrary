# [SCR-APP-01] API — Trang chủ member
Refs: `docs/screens/SCR-APP-01-trang-chu-member.md` · FLOW-thoi-quen-hang-ngay · `00-quy-uoc-api.md` (envelope, lỗi chung, idempotency — KHÔNG lặp lại ở đây)
**Changelog** (mới nhất trước)
- 2026-09-27 · v1 · claude (subagent) · khởi tạo từ blueprint.

## 0. Endpoint overview

| ID | Endpoint | Method | When called | Idempotent (key) | Contract status |
|---|---|---|---|---|---|
| API-APP-01 | `/v1/dashboard` | GET | mở SCR-APP-01; "Try again" ở widget lỗi | n/a (GET) | proposal |
| API-APP-02 | `/v1/checkins` | POST | chọn một mức check-in | có — `userId` + ngày nghiệp vụ, server tự suy ra (00-quy-uoc-api §5) | proposal |
| API-APP-03 | `/v1/challenge/days/{day}/complete` | POST | "Mark as done" | có — `userId` + `day` (00-quy-uoc-api §5) | proposal |
| API-ME-01 | `/v1/me` | GET | lời chào (dùng chung với GC-SiteHeader) | n/a (GET) | proposal |
| API-CAT-01 | `/v1/tests` | GET | "Next: [Test]" + 3 thẻ gợi ý | n/a (GET) | proposal |

Mọi endpoint ở đây cần cookie `tl_session`; POST kèm `X-CSRF-Token` (00-quy-uoc-api §2). Riêng API-CAT-01 là endpoint public, nhưng tham số `excludeTaken` chỉ có tác dụng khi có phiên.

## API-APP-01 · GET `/v1/dashboard`

Trả dữ liệu cho 4 widget của dashboard trong một lần gọi. Mỗi khối có `status` (`ok` · `error`): nguồn dữ liệu của một khối lỗi thì chỉ khối đó là `error`, các khối khác vẫn trả đủ, để UI hiện "Try again" theo từng widget. Không side effect. Không có tham số.

| Response `data` field | Type | Meaning | Basis |
|---|---|---|---|
| `progress` | object `{ status, takenCount: int, totalCount: int }` | "[n] of [total] tests taken"; `takenCount` = số bài khác nhau đã làm, `totalCount` = số bài đang phát hành | EV-TLW-209 · CS-12 |
| `latestResult` | object / null `{ status, resultId: uuid, reportId: uuid, testName: string, takenAt: ISO-8601, sensitive: boolean, typeName: string / null, reportAccess: enum none · pending · full }` | thẻ report gần nhất; `typeName` = null khi bài `sensitive`; null khi chưa có kết quả | SYS-ENTITLEMENT · BR-REP-02 |
| `checkin` | object `{ status, today: date, todayValue: int 1–5 / null, streakDays: int, last7: array { date: date, value: int 1–5 / null } }` | widget check-in; `today` là ngày nghiệp vụ theo timezone tài khoản | BR-DASH-01 · BR-APP-09 |
| `challenge` | object `{ status, access: enum locked · no_result · active · completed, doneCount: int, card: object / null }`; `card` = `{ day: int, title: string, body: string, done: boolean }` | widget thử thách; `card` là ngày mở sớm nhất chưa làm (làm bù trước), hoặc ngày hôm nay nếu đã làm hết các ngày đã mở | BR-DASH-02 · BR-DASH-03 · SYS-ENTITLEMENT |

`challenge.access`: `locked` = Free · `no_result` = Plus nhưng chưa có kết quả nào không `sensitive` · `active` = đang làm · `completed` = xong 30/30.

```json
{
  "code": 0, "message": "ok",
  "data": {
    "progress": { "status": "ok", "takenCount": 3, "totalCount": 24 },
    "latestResult": { "status": "ok", "resultId": "9f1c…", "reportId": "3e70…", "testName": "Big Five Personality Test", "takenAt": "2026-09-26T14:02:00Z", "sensitive": false, "typeName": "The Explorer", "reportAccess": "none" },
    "checkin": { "status": "ok", "today": "2026-09-27", "todayValue": null, "streakDays": 4, "last7": [ { "date": "2026-09-26", "value": 4 } ] },
    "challenge": { "status": "ok", "access": "active", "doneCount": 2, "card": { "day": 3, "title": "…", "body": "…", "done": false } }
  }
}
```

| Lỗi RIÊNG màn | When | UI reaction (verbatim) |
|---|---|---|
| khối `status = error` | nguồn dữ liệu của khối đó lỗi | widget đó: "We couldn't load this. Try again." + nút "Try again" |
| 5xx / mất mạng (cả request) | lỗi toàn phần | mọi widget hiện như trên; header vẫn dùng được |

## API-APP-02 · POST `/v1/checkins`

Ghi check-in của ngày nghiệp vụ hiện tại (server tính theo timezone tài khoản, BR-APP-09). Gửi lại trong cùng ngày = cập nhật giá trị, không tạo bản mới. Side effect: tính lại streak. Giá trị check-in là dữ liệu nhạy cảm: chỉ lưu ở server của mình, không gửi analytics (cong-nghe-loi §4 · BR-DASH-04).

| Body field | Type | Required | Meaning | Basis |
|---|---|---|---|---|
| `value` | int 1–5 | có | mức đã chọn (1 = "Not at all" … 5 = "Very", nhãn `emoji5` của GC-ScaleInput) | BR-DASH-01 |

| Response `data` field | Type | Meaning | Basis |
|---|---|---|---|
| `day` | date | ngày nghiệp vụ đã ghi | BR-APP-09 |
| `value` | int 1–5 | giá trị đã lưu | BR-DASH-01 |
| `streakDays` | int | streak sau khi ghi | BR-DASH-01 |
| `last7` | array `{ date: date, value: int 1–5 / null }` | dải 7 ngày cập nhật | BR-DASH-01 |

| Lỗi RIÊNG màn | When | UI reaction (verbatim) |
|---|---|---|
| 422 `invalid_value` | `value` ngoài 1–5 | không có copy (UI chỉ gửi được 1–5) |
| 5xx / mất mạng | lưu thất bại | CMP-05 trả về giá trị đã lưu trước đó + "We couldn't save your check-in." + nút "Try again" (gửi lại mức vừa chọn) |

## API-APP-03 · POST `/v1/challenge/days/{day}/complete`

Đánh dấu hoàn thành một ngày thử thách. Lần đầu hoàn thành ngày 1 thì server ghi ngày bắt đầu (EC-05 của màn). Ngày N chỉ nhận khi đã qua N−1 ngày nghiệp vụ từ ngày bắt đầu; ngày cũ chưa làm vẫn nhận (làm bù). Gọi lặp cùng `day` trả trạng thái hiện tại. Auth: `tl_session` + quyền `challenge` (SYS-ENTITLEMENT). Không có body.

| Path param | Type | Required | Meaning | Basis |
|---|---|---|---|---|
| `day` | int 1–30 | có | ngày thử thách cần đánh dấu | BR-DASH-02 |

| Response `data` field | Type | Meaning | Basis |
|---|---|---|---|
| `day` | int | ngày vừa đánh dấu | BR-DASH-02 |
| `doneCount` | int | "[k] of 30 days done" | BR-DASH-02 |
| `card` | object `{ day: int, title: string, body: string, done: boolean }` | thẻ hiển thị tiếp theo (cùng quy tắc với `challenge.card` của API-APP-01) | BR-DASH-02 |

| Lỗi RIÊNG màn | When | UI reaction (verbatim) |
|---|---|---|
| 403 `plus_required` | Plus vừa hết kỳ | CMP-06 chuyển sang biến thể Free (không phải thông báo lỗi) |
| 422 `day_locked` | ngày chưa mở (đồng hồ client lệch) | tải lại API-APP-01, không copy |
| 5xx / mất mạng | lưu thất bại | "We couldn't save that. Try again." |

## API-ME-01 · GET `/v1/me` (phần màn này dùng)

Schema đầy đủ ở `docs/api/SCR-ACC-01-api.md`. SCR-APP-01 chỉ dùng:

| Response `data` field | Type | Meaning | Basis |
|---|---|---|---|
| `name` | string (có thể rỗng) | lấy từ đầu cho "Hi [first name]"; rỗng → "Hi there" | EV-TLW-246 · in-house |

## API-CAT-01 · GET `/v1/tests` (phần màn này dùng)

Endpoint catalog public (SCR-PUB-01 · SCR-PUB-02 mô tả inline). SCR-APP-01 gọi với tham số dưới đây.

| Query param | Type | Required | Meaning | Basis |
|---|---|---|---|---|
| `limit` | int | có | `3` | in-house |
| `excludeTaken` | boolean | không | `true`: bỏ các bài tài khoản đã làm (cần phiên) | CS-12 |
| `includeSensitive` | boolean | không | `false`: không gợi ý bài `sensitive` | Q-06 · BR-APP-06 |

| Response `data` field | Type | Meaning | Basis |
|---|---|---|---|
| `items` | array `{ slug: string, title: string, description: string, topic: string, questionCount: int, medianMinutes: number / null, sensitive: boolean }` (tên field theo props của GC-TestCard) | 3 thẻ GC-TestCard; phần tử đầu dùng cho "Next: [Test]"; với `includeSensitive=false` thì `sensitive` luôn `false` | BR-PUB-05 · CS-12 |

## Field → UI map

| Response field | Used by (CMP-ID) | Display format |
|---|---|---|
| `name` (API-ME-01) | CMP-02 | "Hi [first name]" |
| `progress.takenCount` · `progress.totalCount` | CMP-03 | "[n] of [total] tests taken" |
| `items[0].title` · `items[0].slug` (API-CAT-01) | CMP-03 · NAV-APP-01-1 | "Next: [Test]" + "Start test" |
| `latestResult.*` | CMP-04 · NAV-APP-01-2 · NAV-APP-01-3 | tên bài · ngày ("October 12, 2026" theo tieu-chuan-chung §4) · type · nút theo `reportAccess` |
| `checkin.todayValue` · `streakDays` · `last7` | CMP-05 | lựa chọn đang chọn · "[n]-day streak" / "New streak starts today." · dải "Last 7 days" |
| `challenge.access` · `card` · `doneCount` | CMP-06 · NAV-APP-01-4 · NAV-APP-01-6 | biến thể Plus / Free · "Day [n] · [action title]" · "[k] of 30 days done" |
| `items[]` (API-CAT-01) | CMP-07 | 3 GC-TestCard: tên · mô tả · "[n] questions" · "About [m] min" |

## AI Notices
- Payload và tên field là SPEC mới. Đối thủ lưu check-in bằng 1 POST first-party (EV-TLW-211), nhưng mình không chép endpoint hay payload của họ.
- Tên tham số `excludeTaken` · `includeSensitive` của API-CAT-01 chưa thống nhất với mô tả inline ở SCR-PUB-01/02; cần chốt một bộ trước API-FREEZE.
- Nội dung ngày thử thách (`title` · `body`) là nội dung biên tập theo type (TD-02); ví dụ để "…" vì chưa có nội dung thật.
