# legal-consent — TestLib (tên tạm, Q-01) · dữ liệu, cookie, consent, văn bản pháp lý
> Nguồn: `cong-nghe-loi §4` (dữ liệu rời trình duyệt) + `tracking-events.md` (event nào bắn, chỉ sau consent) + SYS-CONSENT. File này là **yêu cầu sản phẩm + khung khai báo**, KHÔNG phải tư vấn pháp lý; mọi văn bản phải qua legal review trước khi ra mắt (Q-05). Đối thủ chỉ được nhắc để nêu điều cần TRÁNH (`research/apps/testlibrary-web/legal-extract.md`).
**Changelog** (mới nhất trước)
- 2026-09-28 · v1.2 · claude-opus-5-5 · D-04: câu banner lấy nguyên văn từ GC-ConsentBanner §1 (nguồn duy nhất). D-07: thời hạn lưu lý do huỷ thống nhất — tách khỏi danh tính sau 90 ngày, xoá luôn nếu tài khoản bị xoá trước đó.
- 2026-09-28 · v1.1 · claude-opus-5-5 · gap cũ đã có lời giải: rút consent từng kết quả (API-RES-03 · BR-REP-07), tuổi tối thiểu (Q-21), nguồn hỗ trợ khủng hoảng (Q-23); trỏ tới research pháp lý 2026-09-28 (Q-24 · Q-25 · Q-26).
- 2026-09-27 · v1 · claude (subagent) · khởi tạo.

## 1. Dữ liệu thu thập

Mirror 1-1 `cong-nghe-loi §4` (16 hàng, cùng thứ tự, cùng giá trị). Muốn đổi thì sửa ở nguồn trước rồi chép sang đây.

| Data | Mục đích | Rời trình duyệt tới đâu | Lưu bao lâu | Căn cứ | Basis |
|---|---|---|---|---|---|
| Câu trả lời đang làm (khách) | chạy bài, resume khi reload / mất mạng | không rời trình duyệt (localStorage) | tới khi nộp; xoá khỏi máy sau khi nộp thành công | không cần consent (không rời máy) | TD-01 |
| Câu trả lời đang làm (đã đăng nhập, autosave) | làm tiếp trên thiết bị khác | server của mình (PostgreSQL, region = Q-05) | tới khi nộp / 30 ngày nếu bỏ dở | hợp đồng (không cần consent) | TD-01 · Q-05 |
| Câu trả lời đã nộp + kết quả | chấm điểm, hiện kết quả, ráp report | server của mình | khách: 30 ngày nếu chưa lưu (BR-APP-08); tài khoản: tới khi xoá | bài `sensitive`: **consent tường minh** trước câu 1 (BR-APP-06); bài thường: hợp đồng | BR-APP-06 · BR-APP-08 · Q-05 |
| Check-in cảm xúc | streak + dải 7 ngày trên dashboard | server của mình | tới khi xoá tài khoản | hợp đồng (không cần consent); coi là dữ liệu nhạy cảm → không gửi analytics | BR-APP-05 |
| Email, tên, timezone (nguồn: form, hoặc hồ sơ Google khi đăng nhập Google) | tài khoản, đăng nhập, email giao dịch, ngày nghiệp vụ | server của mình + vendor email giao dịch (Q-16) | tới khi xoá tài khoản | hợp đồng (không cần consent) | Q-16 |
| Dữ liệu thẻ / thanh toán | thanh toán, hoá đơn, thuế | **chỉ** provider / MoR (Q-04), không qua server mình | theo provider | hợp đồng (không cần consent) | BR-APP-01 · Q-04 |
| Event analytics (không có dữ liệu bài) | đo funnel + chất lượng sản phẩm (tracking-events) | Firebase Analytics (Google) | theo cấu hình retention analytics (đề xuất 14 tháng) | **consent** (analytics) | TD-04 · BR-APP-05 |
| Bản ghi consent cookie | chứng minh lựa chọn + version | server của mình | 12 tháng, sau đó hỏi lại | nghĩa vụ pháp lý (không cần consent) | SYS-CONSENT |
| File PDF report | tải PDF của report đã có quyền | object storage của mình (cùng region) | cache 30 ngày, tạo lại khi cần | không cần consent | TD-03 |
| Log máy chủ / bảo mật (IP, user agent, thời điểm) | bảo mật, chống lạm dụng, rate limit | server của mình (+ CDN/WAF nếu dùng, Q-09) | 30 ngày | lợi ích hợp pháp (không cần consent) | cong-nghe-loi §4 |
| Tin nhắn liên hệ (email, chủ đề, nội dung) | trả lời yêu cầu hỗ trợ | server của mình | 24 tháng sau khi đóng yêu cầu | thực hiện yêu cầu của user | API-HELP-01 |
| Lý do huỷ gia hạn (tuỳ chọn) | cải thiện sản phẩm | server của mình | tách khỏi danh tính sau 90 ngày; xoá luôn nếu tài khoản bị xoá trước mốc đó | tuỳ chọn, user tự nhập | SCR-PAY-04 |
| Đánh giá report (1–5) | chất lượng nội dung report | server của mình | tới khi xoá tài khoản; không gửi analytics | hợp đồng | SCR-APP-03 · BR-APP-05 |
| Bản ghi consent gia hạn (`consent_version`, thời điểm, IP) | chứng minh đồng ý tự gia hạn | server của mình + provider | theo thời hạn chứng từ (Q-05) | nghĩa vụ pháp lý | BR-APP-03 |
| Đơn hàng + event webhook thanh toán | chứng từ, entitlement | server của mình + provider/MoR (Q-04) | theo luật kế toán (Q-05) | hợp đồng + nghĩa vụ pháp lý | API-HOOK-01 · SYS-ENTITLEMENT |
| File export dữ liệu | quyền truy cập dữ liệu | object storage của mình | link + file xoá sau 7 ngày | thực hiện yêu cầu của user | BR-APP-11 |

**Không bao giờ rời hệ thống của mình:** câu trả lời, điểm, type kết quả, giá trị check-in và slug của bài `sensitive` — không tới analytics, không tới quảng cáo, không bán / chia sẻ (BR-APP-05 · Q-12). Khớp `tracking-events.md`: không event nào trước consent, không event nào trên route bài `sensitive`, không param chứa email / tên / câu trả lời.

## 2. Cookie & trackers

| Tên / nhóm | Danh mục | Bên đặt | Cần consent? | Mục đích · thời hạn | Basis |
|---|---|---|---|---|---|
| `tl_session` | necessary | TestLib (first-party · HttpOnly · Secure · SameSite=Lax) | không | phiên đăng nhập · trượt 30 ngày | SYS-AUTH · BR-APP-10 |
| `tl_guest` | necessary | TestLib (first-party · HttpOnly · Secure · SameSite=Lax) | không | token khách gắn attempt / kết quả · 30 ngày | SYS-AUTH · BR-APP-08 |
| `tl_csrf` | necessary | TestLib (first-party · không HttpOnly, double-submit) | không | chống CSRF cho request ghi · thời hạn chưa ghi ở 00-quy-uoc-api §2 (đề xuất: theo phiên) | 00-quy-uoc-api §2 |
| `tl_consent` | necessary | TestLib (first-party) | không | lưu lựa chọn analytics / marketing + version · 12 tháng | SYS-CONSENT · API-CON-01 |
| localStorage tiến độ bài (theo `attemptId`) | necessary (lưu trên máy, không phải cookie) | TestLib | không | chạy bài + resume · xoá sau khi nộp | TD-01 |
| Cookie Google Analytics dạng `_ga` · `_ga_<id>` + IndexedDB của Firebase | analytics | Google, qua SDK Firebase Analytics (cookie nằm trên domain mình) | **có** — chỉ tải SDK sau "Accept all" hoặc bật "Analytics"; không tải trên route bài `sensitive` | đo funnel (tracking-events) · tên + thời hạn theo SDK, verify khi gắn `[INFERRED]` | TD-04 · SYS-CONSENT · BR-APP-06 |
| Marketing | marketing | — (MVP không có) | có, nếu sau này có | nếu Q-12 bật: conversion API phía server cho event mua, chỉ sau consent marketing, không pixel / cookie phía client | Q-12 |
| Trang ngoài: checkout của provider · đăng nhập Google | theo bên đó | provider / MoR (Q-04) · Google (Q-11) | do bên đó quản lý trên domain của họ | chỉ khi user rời sang trang đó; mình không nhúng script của họ vào trang mình | Q-04 · Q-11 |
| Font / CDN / script bên thứ ba khác | — (không dùng) | — | — | self-host font + asset để giữ 0 request bên thứ ba trước consent | tieu-chuan-chung §9 |

## 3. Consent banner (GC-ConsentBanner)

| Vùng áp dụng | Nút | Mặc định | Lưu lựa chọn bao lâu |
|---|---|---|---|
| Mọi vùng (Q-13) | "Accept all" · "Reject all" · "Manage" — cùng kích thước, cùng kiểu nút, cùng hàng (Reject ngang hàng Accept); "Manage" mở `/cookie-settings` (SCR-PUB-07) | analytics + marketing **tắt**; chỉ necessary chạy trước khi chọn; không ô nào tick sẵn | 12 tháng (cookie `tl_consent` + bản ghi server API-CON-01); hỏi lại khi hết hạn hoặc khi đổi version |

| Element | Copy VERBATIM (en) | Basis |
|---|---|---|
| Nội dung | "We use necessary cookies to make this site work. With your permission, we'd also like to use analytics cookies to understand how the site is used. We don't use marketing cookies yet. Your answers never go to advertisers. You can change your choice anytime in Cookie settings." (nguồn: GC-ConsentBanner §1 `body`; sửa ở đó trước rồi chép sang đây) | BR-APP-05 · TD-04 · GC-ConsentBanner |
| Nút | "Accept all" · "Reject all" · "Manage" | Q-13 · SYS-CONSENT |
| Link → `/legal/cookies` | "Cookie policy" | §4 |

| Rule | Mô tả | Basis |
|---|---|---|
| Không cookie wall | trang dùng được khi chưa chọn; banner là `overlay` không chặn nội dung | SYS-NAV §2 · GC-ConsentBanner |
| Chưa chọn = chưa đồng ý | không tải analytics tới khi có "Accept all" hoặc bật "Analytics" ở `/cookie-settings` | SYS-CONSENT · tieu-chuan-chung §10 |
| Rút lại bất kỳ lúc nào | footer "Cookie settings" ở mọi trang → SCR-PUB-07; rút analytics → gỡ SDK + xoá cookie analytics ở lần tải trang kế | SYS-NAV §1 · SYS-CONSENT |
| Route bài `sensitive` | banner vẫn hiện nếu chưa chọn, nhưng dù "Accept all" cũng không tải analytics trên route đó | BR-APP-06 |
| Event consent | ft_consent chỉ bắn khi analytics được cho phép; từ chối thì không có event nào | tracking-events |
| Version | đổi nội dung banner / chính sách → tăng version → hỏi lại | SYS-CONSENT |

## 3b. Consent dữ liệu nhạy cảm (bài `sensitive`)

| Hạng mục | Quy tắc | Copy VERBATIM (en) | Basis |
|---|---|---|---|
| Khi hỏi | bước đầu của SCR-TEST-01, trước câu 1, mỗi lần làm bài `sensitive`; tách khỏi consent cookie | tiêu đề "Before you start" | SYS-CONSENT · BR-APP-06 |
| Nói gì | dữ liệu gì, dùng làm gì, không chia sẻ với quảng cáo | "This test asks about your mood and wellbeing. Your answers are sensitive, so we need your consent to process them. We use them only to score your test and write your report. We never share them with advertisers." | SCR-TEST-01 CMP-03 (verbatim) |
| Disclaimer | luôn hiện ở trang bài, làm bài, kết quả, report | "This is a self-reflection tool, not a diagnosis." | Q-06 · GC-SensitiveNotice |
| Lựa chọn | không có gì chọn sẵn; không đồng ý → quay lại trang bài, không làm bài | "I agree — start the test" · "Not now" · link "Privacy policy" | SYS-CONSENT |
| Lưu bằng chứng | `sensitive_consent_version` + thời điểm gửi trong API-TEST-01, lưu vào attempt | — | BR-APP-06 |
| Tracking | route bài `sensitive` không tải analytics, không bắn event | — | BR-APP-06 · tracking-events |
| Nguồn hỗ trợ | mở trang nguồn hỗ trợ khủng hoảng ở tab mới | "Get support now" | Q-06 · GC-SensitiveNotice |
| Rút consent | xoá từng kết quả ở SCR-APP-02 (NAV-APP-02-4) hoặc SCR-TEST-02 (NAV-TEST-02-10) qua API-RES-03: xoá cứng ngay kết quả + câu trả lời + report ráp từ nó; ngoài ra xoá tài khoản (BR-APP-11) hoặc kết quả khách tự xoá sau 30 ngày (BR-APP-08) | "Delete this result and your answers? This can't be undone." | BR-REP-07 · BR-APP-11 · BR-APP-08 |

## 3c. Công bố gia hạn tự động — checklist yêu cầu sản phẩm

> Mô tả **yêu cầu sản phẩm**, không phải kết luận pháp lý. Quy định về gia hạn tự động khác nhau theo vùng; mức tối thiểu do legal review quyết (Q-05).

| # | Yêu cầu sản phẩm | Hiện thực ở | Đối thủ (điều cần tránh) |
|---|---|---|---|
| 1 | Điều khoản rõ TRƯỚC khi mua: giá gia hạn, chu kỳ, chữ "tự gia hạn", ngày thu kế tiếp, cách huỷ — trên trang giá, trang mở khoá, xác nhận thanh toán, gói & thanh toán, trang huỷ, email | BR-APP-02 · GC-RenewalDisclosure · SCR-PUB-04 · SCR-PAY-01 · SCR-PAY-02 | offer không có chữ nào về gia hạn / subscription / trial — RS·F-17 `[LIVE:browser · EV-TLW-108]`; checkout funnel neo giá "-87%" và không có dòng giá gia hạn — RS·F-18 `[LIVE:browser · EV-TLW-112]` |
| 2 | Đồng ý khẳng định: checkbox mặc định KHÔNG tick, câu consent nêu giá + chu kỳ; nút checkout disable tới khi tick; lưu `consent_version` + thời điểm | BR-APP-03 · API-PAY-02 | checkout funnel không checkbox, chỉ một đoạn "By proceeding…" — RS·F-18 `[LIVE:browser · EV-TLW-111]` |
| 3 | Email xác nhận sau mua: sản phẩm, số tiền, chu kỳ, ngày gia hạn kế tiếp, người bán, cách huỷ | API-MAIL-02 | xác nhận đơn chỉ là "may receive" — legal-extract §9B.5 `[LIVE:browser · EV-TLW-041]` |
| 4 | Email nhắc TRƯỚC mỗi kỳ gia hạn (đề xuất 7 ngày trước kỳ năm, 3 ngày trước kỳ tháng), có số tiền, ngày thu, link huỷ | API-MAIL-03 · API-JOB-01 · Q-16 | văn bản không nêu nhắc trước khi chuyển / gia hạn — RS·F-29 `[LIVE:browser · EV-TLW-041]` |
| 5 | Huỷ online dễ: một nút xác nhận trong tài khoản, không bắt nêu lý do, không bước giữ chân; dùng tới hết kỳ đã trả | BR-APP-04 · SCR-PAY-03 · SCR-PAY-04 | huỷ qua email + link xác minh, "take effect immediately" — RS·F-11 `[LIVE:browser · EV-TLW-046]`; thực tế vẫn dùng được sau huỷ — RS·F-24 |
| 6 | Email xác nhận huỷ gửi ngay khi huỷ | API-MAIL-04 | không cam kết gửi xác nhận huỷ — legal-extract §4.9 `[LIVE:browser · EV-TLW-045]` |
| 7 | Người bán in rõ trước khi mua; điều khoản hoàn tiền giống nhau ở marketing, FAQ và văn bản | Q-05 · Q-18 · pricing-page §4 | pháp nhân chỉ báo sau khi mua — RS·F-12; "30-day satisfaction guarantee" ở offer trong khi văn bản ghi "refunds are not guaranteed" — RS·F-30 `[LIVE:browser · EV-TLW-109 · EV-TLW-041]` |
| 8 | Gia hạn thất bại: báo user (banner + email) để cập nhật thẻ; giữ quyền trong thời gian ân hạn của provider | SYS-ENTITLEMENT · API-MAIL-05 · Q-04 | thu lại "indefinitely" trên mọi phương thức gắn với tài khoản — legal-extract §3.9 `[LIVE:browser · EV-TLW-041]` |

## 4. Trang pháp lý bắt buộc

Mỗi văn bản có dòng "Last updated: [date] · Version [n]" và khối pháp nhân (blueprint SCR-PUB-05).

| Trang | Route | Owner | Status | Nội dung tối thiểu |
|---|---|---|---|---|
| Privacy policy | `/legal/privacy` (SCR-PUB-05) | legal (human) duyệt · PO cấp §1–§3 | chưa có — chặn bởi Q-05 · Q-04 · Q-16 | bảng §1 (+ gap) · bên xử lý: Google (Firebase Analytics), vendor email (Q-16), provider / MoR (Q-04), hosting + region (Q-05) · thời hạn lưu · quyền xem / export / xoá (BR-APP-11) · dữ liệu nhạy cảm + cách rút consent (API-RES-03) · tuổi tối thiểu (Q-21) · liên hệ |
| Terms of service | `/legal/terms` (SCR-PUB-05) | legal (human) | chưa có — Q-05 · Q-07 | mô tả dịch vụ + "not a diagnosis" (Q-06) · pháp nhân + luật áp dụng (Q-05) · nội dung bài + bản quyền (Q-07) · giới hạn trách nhiệm (legal review) |
| Subscriptions & refunds | `/legal/subscriptions` (SCR-PUB-05) | legal (human) + PO | chưa có — Q-03 · Q-04 · Q-16 · Q-18 | giá + chu kỳ cite `00-overview §2` · tự gia hạn · email nhắc (Q-16) · huỷ một bước, dùng tới hết kỳ (BR-APP-04) · hoàn tiền (Q-18) · gia hạn thất bại · báo trước qua email khi đổi giá |
| Cookie policy | `/legal/cookies` (SCR-PUB-05) | PO + dev (bảng §2) | chưa có — Q-12 · Q-13 | bảng §2 (cùng nguồn với banner) · cách đổi lựa chọn (link "Cookie settings" → SCR-PUB-07) |
| Liên hệ + thông tin công ty | `/help` (SCR-PUB-06, khối liên hệ pháp nhân) + footer + khối pháp nhân ở mọi `/legal/:doc` | legal (human) | chưa có — Q-05 · Q-01 | tên pháp nhân bán, địa chỉ đăng ký, email hỗ trợ, form liên hệ; hiện trước khi mua (khác đối thủ — RS·F-12) |

## 5. AI Notices
- KHÔNG phải tư vấn pháp lý. Legal review bắt buộc trước ra mắt cho mọi văn bản ở §4, câu banner §3 và câu consent §3b. Pháp nhân, vùng bán, luật áp dụng = Q-05 (Group A, Mở).
- §3c là yêu cầu sản phẩm rút từ BR-APP-02..04 và đối thủ; không khẳng định đủ hay thiếu so với luật của bất kỳ vùng nào.
- Gap cần owner quyết: 8 loại dữ liệu chưa khai ở `cong-nghe-loi §4` (§1); tuổi tối thiểu (Q-21) và danh sách nguồn hỗ trợ khủng hoảng theo vùng (Q-23) còn Mở; rút consent từng kết quả đã có (API-RES-03 · BR-REP-07, §3b).
- Research pháp lý 2026-09-28 (`research/regulatory-landscape.md` §8, không phải tư vấn pháp lý): mốc nhắc 7 ngày trước kỳ năm ở §3c #4 lệch cửa sổ 15–45 ngày của CA / NY / NYC → Q-26; CA đòi lưu bằng chứng consent gia hạn ≥ 3 năm (hoặc 1 năm sau khi hợp đồng kết thúc) → cột "Lưu bao lâu" của §1 khi Q-05 chốt; EU đòi chức năng rút hợp đồng 14 ngày từ 19/6/2026 → Q-25; tên trên sao kê → Q-24.
- Check-in cảm xúc đang có căn cứ "hợp đồng" trong khi được coi là dữ liệu nhạy cảm (mirror nguồn) → legal review xem có cần consent tường minh như bài `sensitive` không.
- Tên và thời hạn cookie / IndexedDB của Firebase là suy luận `[INFERRED]`; kiểm bằng DevTools khi gắn SDK (pre-launch checklist #8 ở 00-gtm-strategy §6).
