# SYS-CONSENT — consent cookie + consent dữ liệu nhạy cảm
**Changelog** (mới nhất trước)
- 2026-09-28 · v1.1 · claude-opus-5-5 · quyết định 2026-09-28 (AI · uỷ quyền human): thêm rule GPC — nơi định nghĩa duy nhất (Q-20, giải quyết D-03); consent bài `sensitive` thêm xác nhận 18+ (Q-21 · BR-TEST-11); thêm consent check-in, cách rút và rule đổi version (major hỏi lại, minor không) (Q-22 · BR-DASH-05 · BR-ACC-07); Q-12 · Q-13 đã chốt, bỏ notice "đổi sang chỉ EU/UK".
- 2026-09-27 · v1 · claude-opus-5-5 · theo Q-06 (human) + đề xuất Q-12 · Q-13.

## 1. Mục đích

Ba loại consent tách biệt:
1. **Consent cookie/tracking** (analytics, marketing) cho mọi user, mọi vùng (Q-13). Trình duyệt gửi Global Privacy Control (GPC) thì coi như "Reject all" (Q-20, rule "GPC" ở §2).
2. **Consent dữ liệu nhạy cảm** cho từng lần làm bài `sensitive` (Q-06), kèm ô xác nhận 18+ (Q-21).
3. **Consent check-in cảm xúc**, hỏi khi bật check-in (Q-22).

Không có tracking không-thiết-yếu nào chạy trước consent. Câu trả lời và giá trị check-in không bao giờ rời hệ thống của mình (BR-APP-05).

## 2. State / rule xuyên màn

| Consent | Hỏi ở đâu | Lựa chọn | Mặc định | Lưu | Basis |
|---|---|---|---|---|---|
| Cookie `necessary` | không hỏi (luôn bật) | — | bật | — | legal-consent §2 |
| Cookie `analytics` | GC-ConsentBanner lần đầu + SCR-PUB-07; trình duyệt gửi GPC thì không hỏi (rule "GPC") | Accept all · Reject all · Manage | **tắt** | cookie `tl_consent` 12 tháng (lựa chọn · version · `source` · `gpc`) + bản ghi server (API-CON-01, `source` = `banner` · `settings` · `gpc`) | BR-APP-05 · Q-13 · Q-20 |
| Cookie `marketing` | như trên | như trên | **tắt**; MVP chưa có script marketing (Q-12) | như trên | Q-12 |
| Dữ liệu nhạy cảm (bài `sensitive`) | bước đầu của SCR-TEST-01, trước câu 1 | "I agree — start the test" / "Not now" | không tick sẵn; không đồng ý thì không làm bài | lưu `sensitive_consent_version` + thời điểm vào attempt (API-TEST-01) | BR-APP-06 · Q-06 |
| Xác nhận 18+ (bài `sensitive`) | cùng bước consent của SCR-TEST-01 (CMP-03) | ô bắt buộc "I'm 18 or older." | không tick sẵn; chưa tick thì "I agree — start the test" khoá; không thu ngày sinh. Bài thường không có cổng tuổi (16+ ghi trong Terms) | `ageConfirmed` = true lưu vào attempt cùng consent (API-TEST-01) | Q-21 · BR-TEST-11 |
| Check-in cảm xúc | bước "Turn on daily check-ins?" ở SCR-APP-01 khi bật check-in lần đầu (hoặc bật lại sau khi tắt) | "Turn on check-ins" / "Not now" | tắt; không đồng ý thì không check-in (widget thành thẻ mời bật, streak ẩn), phần còn lại của dashboard dùng bình thường | `checkin_consent_version` + thời điểm (API-ME-02, trường `checkins`) | Q-22 · BR-DASH-05 |

| Rule | Mô tả | Basis |
|---|---|---|
| Tải script | `AppTracking` chỉ tải SDK analytics khi `analytics = granted` VÀ route không phải bài `sensitive` | TD-04 · BR-APP-06 |
| GPC · tín hiệu | trình duyệt có `navigator.globalPrivacyControl` = true hoặc gửi header `Sec-GPC: 1`. Consent manager đọc `navigator.globalPrivacyControl` trên trình duyệt (route public là trang render sẵn, Q-09); server đọc `Sec-GPC` ở request API-CON-01 | Q-20 |
| GPC · hiệu lực | coi như "Reject all": analytics + marketing = denied; không hiện GC-ConsentBanner (kể cả variant `re-ask`); không tải SDK; không event nào, kể cả ft_consent | Q-20 · tracking-events |
| GPC · lưu | consent manager tự ghi `tl_consent` (`source` = `gpc`, `gpc` = true) rồi gọi API-CON-01 với `source` = `gpc`, chạy nền. Gọi một lần khi áp dụng (chưa có lựa chọn, ghi đè, đổi version, quá 12 tháng), không gọi lại ở mỗi trang | Q-20 · API-CON-01 |
| GPC · ghi đè | lựa chọn đang lưu được chọn khi trình duyệt chưa gửi GPC (`tl_consent` có `gpc` = false), kể cả "granted", bị thay bằng denied ở lần tải trang đầu tiên có GPC; SDK + cookie analytics gỡ như khi rút consent | Q-20 |
| GPC · bật lại | lựa chọn tường minh trên site thắng GPC: SCR-PUB-07 hiện câu giải thích (CMP-09) và vẫn cho bật "Analytics"; lưu ở đó → `source` = `settings`, `gpc` = true. GPC không ghi đè lựa chọn này tới khi đổi version hoặc quá 12 tháng; khi đó GPC áp dụng lại, không hỏi bằng banner | Q-20 · SCR-PUB-07 |
| GPC · marketing | MVP không có script marketing (Q-12). Khi có: conversion phía server không bao giờ chạy cho trình duyệt gửi GPC, kể cả khi đã lưu marketing = granted | Q-12 · Q-20 |
| GPC · tắt tín hiệu | trình duyệt ngừng gửi GPC: không tự đổi gì; lựa chọn đang lưu giữ nguyên tới khi user đổi ở SCR-PUB-07, đổi version hoặc quá 12 tháng | Q-20 · in-house |
| Rút consent | đổi ở SCR-PUB-07 bất kỳ lúc nào; rút analytics → gỡ SDK, xoá cookie analytics ở lần tải trang kế | legal-consent §3 |
| Rút consent dữ liệu nhạy cảm | xoá kết quả đó (kèm câu trả lời) bằng API-RES-03 từ SCR-APP-02 hoặc SCR-TEST-02; không cần xoá tài khoản | BR-APP-11 |
| Rút consent check-in | tắt toggle "Daily check-ins" ở SCR-ACC-01 → xác nhận "Turn off check-ins and delete your check-in history? Your streak will reset. This can't be undone." → "Turn off and delete" (NAV-ACC-01-7): xoá cứng ngay toàn bộ lịch sử check-in, streak về 0 ("Keep check-ins" thì không đổi gì). Bật lại chỉ ở SCR-APP-01 (NAV-ACC-01-8 → `/app#checkin`), qua bước consent như lần đầu | BR-ACC-07 · Q-22 |
| Version | đổi nội dung banner/chính sách → tăng version → hỏi lại (trình duyệt gửi GPC: không hỏi, GPC áp dụng lại — "GPC · lưu") | in-house · Q-20 |
| Version consent check-in | `checkin_consent_version` dạng `major.minor`. Đổi lớn (mục đích dùng hoặc nơi dữ liệu đi mở rộng) → tăng major → lần vào SCR-APP-01 kế tiếp hiện lại bước "Turn on daily check-ins?"; chưa đồng ý lại thì tạm dừng check-in mới, lịch sử cũ giữ nguyên tới khi user tắt ở SCR-ACC-01 (tắt = xoá). Đổi nhỏ (chỉ sửa câu chữ cho rõ, không đổi mục đích / nơi đi) → tăng minor, không hỏi lại | Q-22 · in-house |

## 3. Màn liên quan

SCR-PUB-07 · SCR-TEST-01 · SCR-PUB-03 · SCR-TEST-02 · SCR-APP-03 · SCR-APP-01 · SCR-ACC-01 · GC-ConsentBanner · GC-SensitiveNotice.

## 4. Basis

Q-06 (human) · Q-12 · Q-13 · Q-20 · Q-21 · Q-22 · TD-04 · RS·F-02 · RS·F-13.

## 5. AI Notices
- Hỏi consent ở mọi vùng (Q-13) và coi GPC là "Reject all" (Q-20) làm giảm dữ liệu analytics. Tỉ lệ đồng ý chỉ tính được ở server từ bản ghi API-CON-01 (theo `source`).
- Trường `gpc` trong `tl_consent` và API-CON-01 dùng để tách lựa chọn lưu khi chưa có GPC (bị GPC ghi đè) với lựa chọn tường minh lưu khi đang có GPC (thắng GPC).
- Căn cứ pháp lý của GPC, tuổi và check-in là kiến thức nền chưa verify (`[BK]`, `bang-quyet-dinh` §2 #6). Các rule ở đây chọn phương án chặt hơn, nên kết quả verify chỉ có thể nới.
- Rule "Version" áp cho banner / chính sách cookie. Consent bài `sensitive` luôn dùng version hiện hành vì hỏi ở mỗi lần làm bài. Consent check-in theo rule "Version consent check-in" (major hỏi lại, minor không; orchestrator chốt 2026-09-28).
