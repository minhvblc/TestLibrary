# legal-consent — TestLib (tên tạm, Q-01) · dữ liệu, cookie, consent, văn bản pháp lý
> Nguồn: `cong-nghe-loi §4` (dữ liệu rời trình duyệt) + `tracking-events.md` (event nào bắn, chỉ sau consent) + SYS-CONSENT. File này là **yêu cầu sản phẩm + khung khai báo**, KHÔNG phải tư vấn pháp lý; mọi văn bản phải qua legal review trước khi ra mắt (Q-05). Đối thủ chỉ được nhắc để nêu điều cần TRÁNH (`research/apps/testlibrary-web/legal-extract.md`).
**Changelog** (mới nhất trước)
- 2026-09-28 · v1.5 · claude-opus-5-5 · §1 mirror `cong-nghe-loi` §4 (19 hàng): thêm bản ghi consent check-in; file export còn hạn bị xoá ngay khi user xoá dữ liệu có trong file.
- 2026-09-28 · v1.4 · claude-opus-5-5 · khớp docs đã lan quyết định: `tl_consent` có trường `gpc` (SYS-CONSENT); bằng chứng consent bài `sensitive` gồm `ageConfirmed` (Q-21).
- 2026-09-28 · v1.3 · claude-opus-5-5 · quyết định 2026-09-28 (AI · uỷ quyền human): §1 mirror lại `cong-nghe-loi` §4 (18 hàng: thêm xác nhận 18+ và yêu cầu huỷ / rút; check-in sang consent — Q-22; thời hạn consent gia hạn + chứng từ — Q-05 (f); Paddle · Postmark · AWS `eu-central-1`); §2 · §3 GPC (Q-20); §3b ô 18+ (Q-21); thêm §3d consent check-in; §3c mốc nhắc 21 / 7 ngày (Q-16), huỷ không cần đăng nhập, thêm #9–#11 (rút 14 ngày, sao kê, khoá giá); §4 · §5 theo các Q đã chốt.
- 2026-09-28 · v1.2 · claude-opus-5-5 · D-04: câu banner lấy nguyên văn từ GC-ConsentBanner §1 (nguồn duy nhất). D-07: thời hạn lưu lý do huỷ thống nhất — tách khỏi danh tính sau 90 ngày, xoá luôn nếu tài khoản bị xoá trước đó.
- 2026-09-28 · v1.1 · claude-opus-5-5 · gap cũ đã có lời giải: rút consent từng kết quả (API-RES-03 · BR-REP-07), tuổi tối thiểu (Q-21), nguồn hỗ trợ khủng hoảng (Q-23); trỏ tới research pháp lý 2026-09-28 (Q-24 · Q-25 · Q-26).
- 2026-09-27 · v1 · claude (subagent) · khởi tạo.

## 1. Dữ liệu thu thập

Mirror 1-1 `cong-nghe-loi §4` (19 hàng, cùng thứ tự, cùng giá trị). Muốn đổi thì sửa ở nguồn trước rồi chép sang đây.

| Data | Mục đích | Rời trình duyệt tới đâu | Lưu bao lâu | Căn cứ | Basis |
|---|---|---|---|---|---|
| Câu trả lời đang làm (khách) | chạy bài, resume khi reload / mất mạng | không rời trình duyệt (localStorage) | tới khi nộp; xoá khỏi máy sau khi nộp thành công | không cần consent (không rời máy) | TD-01 |
| Câu trả lời đang làm (đã đăng nhập, autosave) | làm tiếp trên thiết bị khác | server của mình (PostgreSQL, AWS `eu-central-1` — Q-05 · Q-19) | tới khi nộp / 30 ngày nếu bỏ dở | hợp đồng (không cần consent) | TD-01 · Q-05 |
| Câu trả lời đã nộp + kết quả | chấm điểm, hiện kết quả, ráp report | server của mình | khách: 30 ngày nếu chưa lưu (BR-APP-08); tài khoản: tới khi xoá | bài `sensitive`: **consent tường minh** trước câu 1 (BR-APP-06); bài thường: hợp đồng | BR-APP-06 · BR-APP-08 · Q-05 |
| Xác nhận 18+ (bài `sensitive`) | chỉ cho người lớn làm bài `sensitive` | server của mình (cùng attempt) | như câu trả lời của attempt đó | đi kèm consent bài `sensitive`; chỉ là ô tự xác nhận, không thu ngày sinh | Q-21 · BR-TEST-11 |
| Bản ghi consent check-in (version, thời điểm bật / tắt; không có giá trị check-in) | chứng minh consent check-in | server của mình | tới khi xoá tài khoản (kể cả sau khi đã tắt) | nghĩa vụ pháp lý | Q-22 · SYS-CONSENT |
| Check-in cảm xúc | streak + dải 7 ngày trên dashboard | server của mình | tới khi user tắt check-in (xoá cứng ngay) hoặc xoá tài khoản | **consent tường minh** lần đầu bật (lưu `checkin_consent_version` + thời điểm); dữ liệu nhạy cảm → không gửi analytics | Q-22 · BR-DASH-05 · BR-ACC-07 · BR-APP-05 |
| Email, tên, timezone (nguồn: form, hoặc hồ sơ Google khi đăng nhập Google) | tài khoản, đăng nhập, email giao dịch, ngày nghiệp vụ | server của mình + Postmark (Mỹ, có DPA — Q-16) | tới khi xoá tài khoản | hợp đồng (không cần consent) | Q-16 · Q-11 |
| Dữ liệu thẻ / thanh toán | thanh toán, hoá đơn, thuế | **chỉ** Paddle (MoR, Q-04), không qua server mình | theo provider | hợp đồng (không cần consent) | BR-APP-01 · Q-04 |
| Event analytics (không có dữ liệu bài) | đo funnel + chất lượng sản phẩm (tracking-events) | Firebase Analytics (Google) | theo cấu hình retention analytics (đề xuất 14 tháng) | **consent** (analytics) | TD-04 · BR-APP-05 |
| Bản ghi consent cookie (gồm `source` = banner / settings / gpc) | chứng minh lựa chọn + version | server của mình | 12 tháng, sau đó hỏi lại | nghĩa vụ pháp lý (không cần consent) | SYS-CONSENT |
| File PDF report | tải PDF của report đã có quyền | object storage của mình (cùng region) | cache 30 ngày, tạo lại khi cần | không cần consent | TD-03 |
| Log máy chủ / bảo mật (IP, user agent, thời điểm) | bảo mật, chống lạm dụng, rate limit | server của mình + CloudFront / WAF (Q-09 · Q-19) | 30 ngày | lợi ích hợp pháp (không cần consent) | cong-nghe-loi §4 |
| Tin nhắn liên hệ (email, chủ đề, nội dung) | trả lời yêu cầu hỗ trợ | server của mình | 24 tháng sau khi đóng yêu cầu | thực hiện yêu cầu của user | API-HELP-01 |
| Lý do huỷ gia hạn (tuỳ chọn) | cải thiện sản phẩm | server của mình | tách khỏi danh tính sau 90 ngày; xoá luôn nếu tài khoản bị xoá trước mốc đó | tuỳ chọn, user tự nhập | SCR-PAY-04 |
| Đánh giá report (1–5) | chất lượng nội dung report | server của mình | tới khi xoá tài khoản; không gửi analytics | hợp đồng | SCR-APP-03 · BR-APP-05 |
| Bản ghi consent gia hạn (`consent_version`, thời điểm, IP, giá + câu gia hạn đã hiện, planKey) | chứng minh đồng ý tự gia hạn | server của mình + Paddle | 3 năm, hoặc 1 năm sau khi hợp đồng kết thúc (lấy mốc dài hơn); giữ cả khi xoá tài khoản | nghĩa vụ pháp lý | BR-APP-03 · Q-05 (f) |
| Đơn hàng + event webhook thanh toán (gồm mã đơn) | chứng từ, entitlement | server của mình + Paddle (Q-04) | 7 năm, tới khi kế toán nơi đăng ký xác nhận mốc khác (Q-05 (f)) | hợp đồng + nghĩa vụ pháp lý | API-HOOK-01 · SYS-ENTITLEMENT |
| Yêu cầu huỷ / rút (email, mã đơn, việc chọn, thời điểm nhận, IP) | xử lý và chứng minh đã nhận yêu cầu huỷ / rút | server của mình + Paddle (khi hoàn tiền) | như đơn hàng (7 năm) | nghĩa vụ pháp lý | Q-25 · BR-APP-14 · API-PAY-08 · API-PAY-09 |
| File export dữ liệu | quyền truy cập dữ liệu | object storage của mình | link + file xoá sau 7 ngày, hoặc ngay khi user xoá dữ liệu có trong file (tắt check-in, xoá kết quả, xoá tài khoản) | thực hiện yêu cầu của user | BR-APP-11 |

**Không bao giờ rời hệ thống của mình:** câu trả lời, điểm, type kết quả, giá trị check-in và slug của bài `sensitive` — không tới analytics, không tới quảng cáo, không bán / chia sẻ (BR-APP-05 · Q-12). Khớp `tracking-events.md`: không event nào trước consent, không event nào trên route bài `sensitive`, không param chứa email / tên / câu trả lời.

## 2. Cookie & trackers

| Tên / nhóm | Danh mục | Bên đặt | Cần consent? | Mục đích · thời hạn | Basis |
|---|---|---|---|---|---|
| `tl_session` | necessary | TestLib (first-party · HttpOnly · Secure · SameSite=Lax) | không | phiên đăng nhập · trượt 30 ngày | SYS-AUTH · BR-APP-10 |
| `tl_guest` | necessary | TestLib (first-party · HttpOnly · Secure · SameSite=Lax) | không | token khách gắn attempt / kết quả · 30 ngày | SYS-AUTH · BR-APP-08 |
| `tl_csrf` | necessary | TestLib (first-party · không HttpOnly, double-submit) | không | chống CSRF cho request ghi · thời hạn chưa ghi ở 00-quy-uoc-api §2 (đề xuất: theo phiên) | 00-quy-uoc-api §2 |
| `tl_consent` | necessary | TestLib (first-party) | không | lưu lựa chọn analytics / marketing + version + `source` + `gpc` (có GPC → lưu denied, `source = gpc`; `gpc` = true khi lựa chọn được lưu lúc trình duyệt đang gửi GPC) · 12 tháng | SYS-CONSENT · API-CON-01 · Q-20 |
| localStorage tiến độ bài (theo `attemptId`) | necessary (lưu trên máy, không phải cookie) | TestLib | không | chạy bài + resume · xoá sau khi nộp | TD-01 |
| Cookie Google Analytics dạng `_ga` · `_ga_<id>` + IndexedDB của Firebase | analytics | Google, qua SDK Firebase Analytics (cookie nằm trên domain mình) | **có** — chỉ tải SDK sau "Accept all" hoặc bật "Analytics"; không tải trên route bài `sensitive` | đo funnel (tracking-events) · tên + thời hạn theo SDK, verify khi gắn `[INFERRED]` | TD-04 · SYS-CONSENT · BR-APP-06 |
| Marketing | marketing | — (MVP không có, Q-12) | có, nếu sau này có | nếu sau này chạy ads: conversion API phía server cho event mua, chỉ sau consent marketing, không khi có GPC, không pixel / cookie phía client | Q-12 · Q-20 |
| Trang ngoài: checkout của Paddle · đăng nhập Google | theo bên đó | Paddle (MoR, Q-04) · Google (Q-11) | do bên đó quản lý trên domain của họ | chỉ khi user rời sang trang đó; mình không nhúng script của họ vào trang mình | Q-04 · Q-11 |
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
| GPC | trình duyệt gửi Global Privacy Control → coi như "Reject all": không hiện banner, analytics + marketing denied, lưu bản ghi `source = gpc`; ghi đè lựa chọn "granted" cũ; user vẫn tự bật lại được ở SCR-PUB-07 | Q-20 · SYS-CONSENT |
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
| Tuổi | ô bắt buộc, không tick sẵn; chưa tick thì nút bắt đầu disable; không thu ngày sinh | "I'm 18 or older." | Q-21 · BR-TEST-11 |
| Lưu bằng chứng | `sensitive_consent_version` + thời điểm + `ageConfirmed` gửi trong API-TEST-01, lưu vào attempt | — | BR-APP-06 · BR-TEST-11 |
| Tracking | route bài `sensitive` không tải analytics, không bắn event | — | BR-APP-06 · tracking-events |
| Nguồn hỗ trợ | mở trang nguồn hỗ trợ khủng hoảng ở tab mới | "Get support now" | Q-06 · GC-SensitiveNotice |
| Rút consent | xoá từng kết quả ở SCR-APP-02 (NAV-APP-02-4) hoặc SCR-TEST-02 (NAV-TEST-02-10) qua API-RES-03: xoá cứng ngay kết quả + câu trả lời + report ráp từ nó; ngoài ra xoá tài khoản (BR-APP-11) hoặc kết quả khách tự xoá sau 30 ngày (BR-APP-08) | "Delete this result and your answers? This can't be undone." | BR-REP-07 · BR-APP-11 · BR-APP-08 |

## 3c. Công bố gia hạn tự động — checklist yêu cầu sản phẩm

> Mô tả **yêu cầu sản phẩm**, không phải kết luận pháp lý. Quy định về gia hạn tự động khác nhau theo vùng; mức tối thiểu do legal review quyết (Q-05).

| # | Yêu cầu sản phẩm | Hiện thực ở | Đối thủ (điều cần tránh) |
|---|---|---|---|
| 1 | Điều khoản rõ TRƯỚC khi mua: giá gia hạn, chu kỳ, chữ "tự gia hạn", ngày thu kế tiếp, cách huỷ — trên trang giá, trang mở khoá, xác nhận thanh toán, gói & thanh toán, trang huỷ, email | BR-APP-02 · GC-RenewalDisclosure · SCR-PUB-04 · SCR-PAY-01 · SCR-PAY-02 | offer không có chữ nào về gia hạn / subscription / trial — RS·F-17 `[LIVE:browser · EV-TLW-108]`; checkout funnel neo giá "-87%" và không có dòng giá gia hạn — RS·F-18 `[LIVE:browser · EV-TLW-112]` |
| 2 | Đồng ý khẳng định: checkbox mặc định KHÔNG tick, câu consent nêu giá + chu kỳ; nút checkout disable tới khi tick; lưu `consent_version` + thời điểm | BR-APP-03 · API-PAY-02 | checkout funnel không checkbox, chỉ một đoạn "By proceeding…" — RS·F-18 `[LIVE:browser · EV-TLW-111]` |
| 3 | Email xác nhận sau mua: sản phẩm, số tiền, chu kỳ, ngày gia hạn kế tiếp, bên bán (Paddle, reseller) + pháp nhân cung cấp dịch vụ, mã đơn, tên trên sao kê, cách huỷ, hạn rút 14 ngày + link "Withdraw from contract here" | API-MAIL-02 · BR-APP-14 · BR-APP-15 | xác nhận đơn chỉ là "may receive" — legal-extract §9B.5 `[LIVE:browser · EV-TLW-041]` |
| 4 | Email nhắc TRƯỚC mỗi kỳ gia hạn: **21 ngày trước kỳ năm, 7 ngày trước mỗi kỳ tháng**; có tên gói, chu kỳ, số tiền, ngày thu, tên trên sao kê, link huỷ (đủ nội dung nhắc hằng năm cho gói tháng) | API-MAIL-03 · API-JOB-01 · Q-16 | văn bản không nêu nhắc trước khi chuyển / gia hạn — RS·F-29 `[LIVE:browser · EV-TLW-041]` |
| 5 | Huỷ online dễ: một nút xác nhận trong tài khoản, hoặc không cần đăng nhập ở `/cancel` (email + mã đơn, link ở footer mọi trang); không bắt nêu lý do, không bước giữ chân; dùng tới hết kỳ đã trả | BR-APP-04 · SCR-PAY-03 · SCR-PAY-04 · SCR-PAY-05 | huỷ qua email + link xác minh, "take effect immediately" — RS·F-11 `[LIVE:browser · EV-TLW-046]`; thực tế vẫn dùng được tới khi hết hạn rồi mới mất — RS·F-24 (lời kể human, teardown S16) |
| 6 | Email xác nhận huỷ gửi ngay khi huỷ | API-MAIL-04 | không cam kết gửi xác nhận huỷ — legal-extract §4.9 `[LIVE:browser · EV-TLW-045]` |
| 7 | Bên bán (Paddle, câu reseller) và pháp nhân cung cấp dịch vụ in rõ trước khi mua; điều khoản hoàn tiền (rút 14 ngày) giống nhau ở marketing, FAQ và văn bản | Q-04 · Q-05 · Q-18 · pricing-page §4 | pháp nhân chỉ báo sau khi mua — RS·F-12; "30-day satisfaction guarantee" ở offer trong khi văn bản ghi "refunds are not guaranteed" — RS·F-30 `[LIVE:browser · EV-TLW-109 · EV-TLW-041]` |
| 8 | Gia hạn thất bại: báo user (banner + email) để cập nhật thẻ; giữ quyền trong thời gian ân hạn của Paddle | SYS-ENTITLEMENT · API-MAIL-05 · Q-04 | thu lại "indefinitely" trên mọi phương thức gắn với tài khoản — legal-extract §3.9 `[LIVE:browser · EV-TLW-041]` |
| 9 | Rút trong 14 ngày = hoàn toàn bộ, không hỏi lý do (report lẻ · lần thanh toán đầu của Plus · mỗi lần gia hạn năm); chức năng rút hai bước "Withdraw from contract here"; email xác nhận có ngày giờ nhận yêu cầu | BR-APP-14 · SCR-PAY-05 · API-PAY-08 · API-MAIL-11 · Q-18 · Q-25 | hoàn tiền tuỳ ý, thang 25% → 40% → 100%; phí trial "generally non-refundable" — web-evidence F-42 `[LIVE:web]` · RS·F-29 |
| 10 | Nói đúng tên trên sao kê, trước và sau khi mua | BR-APP-15 · Q-24 | checkout hứa "testlibrary.com", khách thấy "NordicaLab" — web-evidence F-37 `[LIVE:web]` |
| 11 | Khoá giá: subscriber giữ giá lúc mua; tăng giá chỉ khi user đồng ý, báo 28 ngày trước (cửa sổ 21–30) | BR-APP-13 · Q-27 · API-MAIL-09 | — |

## 3d. Consent check-in cảm xúc

| Hạng mục | Quy tắc | Copy VERBATIM (en) | Basis |
|---|---|---|---|
| Khi hỏi | lần đầu bật check-in ở SCR-APP-01 (hoặc bật lại sau khi đã tắt); tách khỏi consent cookie | tiêu đề "Turn on daily check-ins?" | Q-22 · BR-DASH-05 |
| Nói gì | dữ liệu gì, dùng làm gì, không chia sẻ, tắt ở đâu | "Check-ins are a quick note about your mood. Because this is about your wellbeing, we treat it as sensitive data: we use it only to show your streak and your last 7 days, and we never share it with advertisers or analytics. You can turn check-ins off and delete them anytime in Account." | Q-22 |
| Lựa chọn | không chọn sẵn; "Not now" → không check-in, phần còn lại của dashboard dùng bình thường | "Turn on check-ins" · "Not now" | BR-DASH-05 |
| Lưu bằng chứng | `checkin_consent_version` + thời điểm (API-ME-02) | — | Q-22 |
| Rút consent | tắt "Daily check-ins" ở SCR-ACC-01 → xoá cứng lịch sử check-in ngay, streak về 0 | "Turn off check-ins and delete your check-in history? Your streak will reset. This can't be undone." | BR-ACC-07 |

## 4. Trang pháp lý bắt buộc

Mỗi văn bản có dòng "Last updated: [date] · Version [n]" và khối pháp nhân (blueprint SCR-PUB-05).

| Trang | Route | Owner | Status | Nội dung tối thiểu |
|---|---|---|---|---|
| Privacy policy | `/legal/privacy` (SCR-PUB-05) | legal (human) duyệt · PO cấp §1–§3 | chưa có văn bản — Q-04 · Q-05 · Q-16 đã chốt; chờ pháp nhân + legal review (`bang-quyet-dinh` §2 #2) | bảng §1 · bên xử lý: Google (Firebase Analytics), Postmark (email), Paddle (MoR), AWS `eu-central-1` (hosting) · thời hạn lưu · quyền xem / export / xoá (BR-APP-11); khách: tự xoá kết quả, tải dữ liệu cần tài khoản miễn phí hoặc gửi "Privacy request" ở `/help` (Q-28 · BR-PUB-15) · dữ liệu nhạy cảm + cách rút consent (API-RES-03; check-in: §3d) · GPC (Q-20) · tuổi: 16+, bài `sensitive` 18+ (Q-21) · liên hệ |
| Terms of service | `/legal/terms` (SCR-PUB-05) | legal (human) | chưa có văn bản — Q-05 · Q-07 đã chốt; chờ pháp nhân + legal review | mô tả dịch vụ + "not a diagnosis" (Q-06) · 16+ (Q-21) · pháp nhân + luật áp dụng: nơi đăng ký pháp nhân, không bớt quyền người tiêu dùng bắt buộc nơi khách sống (Q-05) · nội dung bài + bản quyền (Q-07) · Paddle là reseller / MoR (Q-04) · giới hạn trách nhiệm (legal review) |
| Subscriptions & refunds | `/legal/subscriptions` (SCR-PUB-05) | legal (human) + PO | chưa có văn bản — Q-03 · Q-04 · Q-16 · Q-18 · Q-25 · Q-27 đã chốt; chờ legal review | giá + chu kỳ cite `00-overview §2` · tự gia hạn · email nhắc 21 / 7 ngày (Q-16) · huỷ một bước, cả không cần đăng nhập, dùng tới hết kỳ (BR-APP-04) · rút 14 ngày = hoàn toàn bộ + chức năng rút (BR-APP-14) · khoá giá, tăng giá chỉ khi đồng ý (BR-APP-13) · báo thay đổi điều khoản 28 ngày trước (BR-PUB-11) · tên trên sao kê (BR-APP-15) · gia hạn thất bại · Paddle là reseller / MoR |
| Cookie policy | `/legal/cookies` (SCR-PUB-05) | PO + dev (bảng §2) | chưa có văn bản — Q-12 · Q-13 · Q-20 đã chốt | bảng §2 (cùng nguồn với banner) · GPC (Q-20) · cách đổi lựa chọn (link "Cookie settings" → SCR-PUB-07) |
| Liên hệ + thông tin công ty | `/help` (SCR-PUB-06, khối liên hệ pháp nhân) + footer + khối pháp nhân ở mọi `/legal/:doc` | legal (human) | chưa có — Q-05 · Q-01 đã chốt; tên pháp nhân, địa chỉ, domain là dữ liệu setup (`bang-quyet-dinh` §2 #1 · #2) | tên pháp nhân cung cấp dịch vụ, địa chỉ đăng ký, email hỗ trợ, form liên hệ (có chủ đề "Privacy request"); hiện trước khi mua (khác đối thủ — RS·F-12) |

## 5. AI Notices
- KHÔNG phải tư vấn pháp lý. Legal review bắt buộc trước ra mắt cho mọi văn bản ở §4, câu banner §3 và câu consent §3b · §3d. Vùng bán, luật áp dụng, thời hạn lưu = Q-05 (chốt 2026-09-28, AI · uỷ quyền human); tên pháp nhân là dữ liệu setup.
- §3c là yêu cầu sản phẩm rút từ BR-APP-02..04 và đối thủ; không khẳng định đủ hay thiếu so với luật của bất kỳ vùng nào.
- Tuổi tối thiểu (Q-21) và danh sách nguồn hỗ trợ khủng hoảng (Q-23) đã chốt; số điện thoại / website của Q-23 còn phải verify + clinical review trước launch (`bang-quyet-dinh` §2 #4). Rút consent từng kết quả đã có (API-RES-03 · BR-REP-07, §3b).
- Research pháp lý 2026-09-28 (`research/regulatory-landscape.md` §8, không phải tư vấn pháp lý) đã được đưa vào: mốc nhắc 21 / 7 ngày (Q-16 · Q-26), thời hạn lưu bằng chứng consent gia hạn (Q-05 (f), §1), chức năng rút 14 ngày (Q-25, §3c #9), tên trên sao kê (Q-24, §3c #10), khoá giá (Q-27, §3c #11).
- Check-in cảm xúc chuyển sang consent tường minh (Q-22, §3d); legal review xác nhận câu chữ.
- Tên và thời hạn cookie / IndexedDB của Firebase là suy luận `[INFERRED]`; kiểm bằng DevTools khi gắn SDK (pre-launch checklist #8 ở 00-gtm-strategy §6).
