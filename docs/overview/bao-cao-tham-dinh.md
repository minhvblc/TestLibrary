# Báo cáo thẩm định — TestLib (tên tạm, web)
> Kiểm chéo bộ `docs/` với chính nó và với `research/` sau phiên 2026-09-28. Mục đích: biết docs đã đủ chưa, chỗ nào lệch nhau, cái gì đã sửa, cái gì còn chờ quyết định, gate nào còn bị chặn. Không thay thế review của human hay legal review (Q-05).
**Changelog** (mới nhất trước)
- 2026-09-28 · v1 · claude-opus-5-5 · khởi tạo (file đã có trong index `00-overview` §8 nhưng chưa tồn tại).

## 1. Cách thẩm định

| # | Cách | Phạm vi | Kết quả ở |
|---|---|---|---|
| 1 | Script lint ID: lấy định nghĩa (cột đầu của bảng trong file sở hữu, hoặc registry) rồi so với mọi tham chiếu | NAV · BR · API · Q · F · EV · SCR · TD · TC · CS · P · GC / SYS / FND · FLOW, trên `docs/` + `research/` | §3 |
| 2 | Parse mọi khối mermaid bằng mermaid 11 | `docs/flow/*` · `docs/screens/*` · `SYS-NAV` | §3 |
| 3 | Đọc chéo khi viết 3 FLOW còn thiếu: SCR §2.2 / §7, file API, GC, SYS, tracking-events, overview | 19 SCR, 13 file API, 14 file base-ui | §4 · §5 |
| 4 | Kiểm lại bằng grep mọi chỗ lệch mà bước 3 báo, trước khi ghi vào đây | — | cột "Đã kiểm" ở §5 |
| 5 | Đối chiếu với research mới: `research/apps/testlibrary-web/web-evidence.md` (`[LIVE:web]`) và `research/regulatory-landscape.md` | cam kết tiền, huỷ, dữ liệu | §5 · §6 |

## 2. Độ đủ của bộ docs (so với index `00-overview` §8)

| Thư mục | Theo index | Hiện có | Ghi chú |
|---|---|---|---|
| `docs/overview/` | 6 | 6 | file này là file cuối cùng còn thiếu |
| `docs/flow/` | 8 | 8 | FLOW-quan-ly-huy-gia-han · FLOW-thoi-quen-hang-ngay · FLOW-quyen-rieng-tu viết ngày 2026-09-28 |
| `docs/screens/` | 19 SCR | 19 | 11 Full · 8 Short |
| `docs/api/` | quy ước + mapping + màn có API ghi | 2 + 12 | SCR-PUB-06 · SCR-PUB-07 · SCR-APP-02 để API ở §5 của màn (inline) |
| `docs/tracking/` | 1 | 1 | — |
| `docs/base-ui/` | FND + SYS + GC | 1 + 4 + 9 | — |
| `docs/go-to-market/` | 5 + `web/` | 5 + `web/` | ảnh OG và icon trong `web/README.txt` là asset dự kiến, chưa tạo |

## 3. Kiểm tự động

| Kiểm | Kết quả |
|---|---|
| Tham chiếu ID gãy | **0**. Hai ca báo nhầm có chủ đích: `FND-FREEZE` (tên gate, không phải file) và `EV-TLW-264` (số EV dự kiến cho phiên drive tới, `next-drive-plan.md`) |
| Số định nghĩa | NAV 88 · BR 73 · API 51 · Q 26 · F 43 · EV 269 (263 TLW + 6 KIT) · SCR 19 · FLOW 7 + sơ đồ tổng |
| NAV có mặt ở sơ đồ tổng `00-so-do-luong-tong` | 79 / 88 → **88 / 88** sau khi vẽ thêm 7 cạnh push và thêm 2 cạnh inline vào danh sách không vẽ (§4 #1) |
| Mermaid | mọi khối ở `docs/flow/*`, `docs/screens/*` và `SYS-NAV` parse được |
| Trường "FLOW" ở meta của SCR | chỉ ghi flow chính của màn, không ghi mọi flow đi qua màn đó (vd SCR-PUB-05 chỉ ghi FLOW-quyen-rieng-tu). Không coi là lỗi; cần chốt quy ước nếu muốn dùng trường này để tra ngược |

## 4. Đã sửa trong phiên 2026-09-28

Toàn bộ là chỗ lệch máy móc hoặc AI Notice đã cũ vì docs mới hơn đã có lời giải. Mỗi file sửa có dòng changelog riêng.

| # | File | Lệch | Đã sửa |
|---|---|---|---|
| 1 | `docs/flow/00-so-do-luong-tong.md` | thiếu NAV-PUB-01-5 · NAV-PUB-03-6 · NAV-TEST-01-8 · NAV-TEST-02-8 · NAV-TEST-02-9 · NAV-AUTH-01-5 · NAV-ACC-02-4 (push) và NAV-APP-02-4 · NAV-TEST-02-10 (inline); ghi "SCR-AUTH-01 không có NAV nào tới" trong khi có NAV-TEST-02-8 | vẽ thêm cạnh, cập nhật bảng cạnh, danh sách inline, ghi chú; index của FLOW-quyen-rieng-tu thêm nhánh phụ SCR-APP-02 · SCR-TEST-02 |
| 2 | `docs/flow/FLOW-dang-ky-plus.md` | 3 gap đã có lời giải: copy pending cho Plus (`cong-nghe-loi` §3), chặn Plus trùng (422 `already_entitled`, SCR-PUB-04 EC-06), khách mua Plus vào `/app` (SYS-AUTH "Phiên sau checkout khách" · SCR-PAY-02 EC-07) | sửa KB-2, 3 hàng cover-case và §6; phần còn hở (`purchase_pending` chỉ chặn cùng planKey) giữ lại |
| 3 | `docs/flow/FLOW-mo-khoa-report.md` | gap "khách mua Plus" | như #2 |
| 4 | `docs/flow/FLOW-luu-ket-qua-dang-nhap.md` | gap "không có lối đăng nhập từ SCR-TEST-02" | đã có NAV-TEST-02-8 |
| 5 | `docs/screens/SCR-ACC-01-tai-khoan.md` · `docs/api/SCR-ACC-01-api.md` | "chưa có job + email nhắc check-in hằng tuần" | đã có API-JOB-06 · API-MAIL-10 |
| 6 | `docs/screens/SCR-AUTH-01-dang-nhap.md` | "link Privacy chưa có NAV" | đã có NAV-AUTH-01-5 |
| 7 | `docs/screens/SCR-PUB-05-van-ban-phap-ly.md` | "chưa có email báo đổi điều khoản" | đã có API-MAIL-09 |
| 8 | `docs/api/SCR-APP-03-api.md` | "chưa có API ghi feedback" | đã có API-REP-05 |
| 9 | `docs/screens/SCR-TEST-02-ket-qua.md` | "ft_result start thiếu `from`" | tracking-events đã có `test_page` · `unlock` |
| 10 | `docs/api/SCR-PAY-04-api.md` | ngày viết "October 27 2026" | "October 27, 2026" (tieu-chuan-chung §4) |
| 11 | `docs/screens/SCR-PAY-02-xac-nhan-thanh-toan.md` | CMP-02 ghi copy Plus là "đề xuất" dù `cong-nghe-loi` §3 đã có; AI Notice nói khách mua Plus luôn phải qua magic link, trái EC-07 | bỏ chữ "đề xuất", sửa AI Notice theo EC-07 |
| 12 | `docs/go-to-market/legal-consent.md` | §3b "Rút consent" còn ghi gap; §4 · §5 ghi "tuổi tối thiểu chưa có Q", "nguồn hỗ trợ khủng hoảng chưa có" | trỏ tới API-RES-03 · BR-REP-07, Q-21, Q-23; thêm trỏ tới research pháp lý |
| 13 | `docs/go-to-market/pricing-page.md` | FAQ gia hạn hứa mốc 7 ngày trước kỳ năm | chỉ thêm AI Notice trỏ Q-26; copy giữ nguyên tới khi human duyệt |

## 5. Conflict còn mở

"Đã kiểm" = đã grep lại nguồn và thấy đúng như mô tả. "Ai xử lý": **human** = quyết định sản phẩm / tiền / pháp lý; **AI** = một lượt sửa docs có chủ đích (không cần quyết định mới, nhưng đụng nhiều file nên chưa làm trong phiên này).

| D-xx | Lệch | Ở đâu | Đã kiểm | Ai xử lý | Đề xuất | Q |
|---|---|---|---|---|---|---|
| D-01 | Mốc nhắc gói năm 7 ngày, trong khi CA, NY, NYC đòi 15–45 ngày cho kỳ ≥ 1 năm; CA, CT, MN còn đòi nhắc hằng năm cho gói tháng | Q-16 · `pricing-page` §4 (FAQ) · `legal-consent` §3c #4 · FLOW-quan-ly-huy-gia-han · API-JOB-01 | có | human | 21–30 ngày trước kỳ năm (lọt mọi cửa sổ đã verify), thêm email nhắc hằng năm cho gói tháng | **Q-26** |
| D-02 | Đổi giá với subscriber đang có: FAQ hứa "at the price shown before you bought", trong khi BR-PUB-11 + API-MAIL-09 mô tả báo trước ≥ 30 ngày; NY đòi consent khi tăng giá hoặc cho huỷ + hoàn trong 14 ngày | `pricing-page` §4 · SCR-PUB-05 BR-PUB-11 · FLOW-quan-ly-huy-gia-han KB-10 · `regulatory-landscape` §2 | có | human (tiền) | chọn một: giữ giá cũ cho subscriber hiện tại, hoặc báo trước + xin đồng ý lại | Q-03 · Q-05 (chưa có Q riêng) |
| D-03 | GPC: Q-20 đề xuất "Reject all" cho analytics + marketing, không hiện banner; GC-ConsentBanner §8 ghi "chưa áp dụng" và chỉ nói marketing; SCR-PUB-07 §10 ghi chưa quyết; SYS-CONSENT không có rule | Q-20 · GC-ConsentBanner · SCR-PUB-07 · SYS-CONSENT | có | human chốt Q-20, rồi AI gom về một rule ở SYS-CONSENT | research: GPC là bắt buộc ở CA và nhiều bang (`[BK]`, cần verify) | Q-20 |
| D-04 | Câu banner consent: `body` của GC-ConsentBanner khác câu "verbatim" ở `legal-consent` §3 | GC-ConsentBanner §2 · `legal-consent` §3 | có | AI | lấy GC làm nguồn, `legal-consent` trích lại | — |
| D-05 | ft_consent: "Accept all" ở banner bắn start + save + `screen_active`; cho phép lần đầu ở SCR-PUB-07 chỉ bắn save → funnel có save mà không có start | GC-ConsentBanner §4 · SCR-PUB-07 EC-04 · tracking-events | có | AI | SCR-PUB-07 bắn start (`from` = cookie_settings) khi lần đầu grant | — |
| D-06 | Khoá idempotency: `00-quy-uoc-api` §2 định nghĩa UUID v4 sống 24 giờ; §5 + SCR-PAY-03-api / SCR-PAY-04-api dùng khoá cố định `subscriptionId` + hành động → huỷ → tiếp tục → huỷ lại trong 24 giờ bị coi là lặp | `00-quy-uoc-api` §2 · §5 · SCR-PAY-03-api · SCR-PAY-04-api | có | AI + dev | UUID mỗi lần bấm, server kiểm trạng thái hiện tại | — |
| D-07 | Lý do huỷ gia hạn: `cong-nghe-loi` §4 ghi "tách khỏi danh tính sau 90 ngày", SCR-PAY-04 §13 ghi "xoá cùng tài khoản" | `cong-nghe-loi` §4 · SCR-PAY-04 · SCR-PAY-04-api | có | AI | tách danh tính sau 90 ngày, và xoá luôn nếu tài khoản bị xoá trước mốc đó | — |
| D-08 | SYS-ENTITLEMENT: nhắc "job hết kỳ" không có trong `api-mapping`; `report.full` mua lẻ "không bao giờ mất" trong khi BR-REP-07 (xoá kết quả) và xoá tài khoản làm mất; refund không nằm trong điều kiện mất quyền | SYS-ENTITLEMENT §1 · §2 · `api-mapping` §2 · BR-REP-07 · SCR-ACC-02 | có | AI | thêm job hoặc ghi rõ thu hồi qua webhook; liệt kê refund, xoá kết quả, xoá tài khoản | — |
| D-09 | Câu công bố gia hạn ở `pricing-page` §1 khác GC-RenewalDisclosure `pre-purchase` · Plus (GC bắt buộc dùng nguyên văn ở mọi bề mặt tiền) | `pricing-page` §1 · GC-RenewalDisclosure §2 | có | AI | lấy nguyên câu của GC | — |
| D-10 | SCR-PUB-04 EC-01 dùng "GC-PlanCard `status`" cho nhãn "Current plan", nhưng GC-PlanCard không có phần `status` | SCR-PUB-04 EC-01 · GC-PlanCard | có | AI | thêm `status` vào GC-PlanCard | — |
| D-11 | Lời hứa với khách: landing-copy "Download or delete your data anytime." và mô tả `/legal/privacy` ở seo-meta, trong khi khách không có export tự phục vụ | `landing-copy` · `seo-meta` · FLOW-quyen-rieng-tu KB-11 | có | human | sửa copy cho đúng phạm vi (member), hoặc thêm quy trình yêu cầu qua form | — |
| D-12 | Check-in cảm xúc: Q-22 đề xuất consent tường minh, nhưng `cong-nghe-loi` §4 và `legal-consent` §1 ghi căn cứ "hợp đồng", SCR-APP-01 chưa có bước consent | Q-22 · SCR-APP-01 · API-APP-02 | có | human | research nghiêng về consent tường minh (`[BK]`) | Q-22 |
| D-13 | Tuổi tối thiểu: Q-21 đề xuất checkbox tự khai trước bài `sensitive`, SCR-TEST-01 chưa có | Q-21 · SCR-TEST-01 CMP-03 | có | human | — | Q-21 |
| D-14 | tracking `from`: ft_test start `from` = app_home không xảy ra trực tiếp (NAV-APP-01-1 tới SCR-PUB-03); ft_report start thiếu `from` cho lối vào từ dashboard và trang gói | tracking-events · FLOW-thoi-quen-hang-ngay §6 · FLOW-quan-ly-huy-gia-han §6 | có | AI | thêm giá trị, hoặc mang `from` qua SCR-PUB-03 | — |
| D-15 | SCR-PAY-03: người từng có Plus mà không mua lẻ khớp cả Default ("Free") lẫn Empty (không có "View invoices") | SCR-PAY-03 §4 | có | AI | Default cho mọi tài khoản có lịch sử thanh toán | — |
| D-16 | SCR-TEST-02: guard của NAV-TEST-02-9 ghi "chỉ Error / Locked" nhưng CMP-12 cũng hiện sau khi xoá; xác nhận xoá (CMP-13) thiếu câu "You'll also lose the full report you unlocked for this result." mà API-RES-03 `lostFullReport` giả định đã có | SCR-TEST-02 · SCR-APP-02 CMP-05 · API-RES-03 | có | AI | — | — |
| D-17 | SYS-AUTH: dòng khôi phục chỉ nhắc `restored=1`, không nhắc `accountRestored`; hứa overlay "Welcome back" ở trang đích bất kỳ, nhưng chỉ SCR-APP-01 EC-11 có | SYS-AUTH · SCR-APP-01 · API-AUTH-02 | có | AI | — | — |
| D-18 | `00-quy-uoc-api` §5 thiếu hàng cho API-CON-01 và API-RES-03; chưa file API nào sở hữu schema API-CON-01; tên khoá idempotency khác nhau (header ở SCR-PUB-07, `consentId` ở GC-ConsentBanner) | `00-quy-uoc-api` · SCR-PUB-07 · GC-ConsentBanner | có | AI | — | — |
| D-19 | `cong-nghe-loi` §3 không có hàng lỗi cho gói & thanh toán, trong khi SCR-PAY-04 §4 và EC-06 trích nó | `cong-nghe-loi` §3 · SCR-PAY-04 | có | AI | thêm hàng "huỷ / tiếp tục gia hạn / cổng provider lỗi" | — |

Gap nội bộ của từng flow (chưa có spec, chưa phải mâu thuẫn) nằm ở §6 của FLOW-quan-ly-huy-gia-han, FLOW-thoi-quen-hang-ngay và FLOW-quyen-rieng-tu, không chép lại đây.

## 6. Research mới ảnh hưởng tới docs

| Nguồn | Ghi nhận | Docs / Q |
|---|---|---|
| web-evidence F-37 | đối thủ hứa tên "testlibrary.com" trên sao kê, khách thấy "NordicaLab" | Q-24 (mới) |
| web-evidence F-38 | đối thủ thu theo tiền từng thị trường (GBP, EUR, AUD…) | evidence ở Q-03 · Q-14 |
| web-evidence F-41 · F-42 | "Rated 4.8/5" không khớp Trustpilot 4,1; khiếu nại lặp lại về gia hạn bất ngờ, không nhắc, hoàn tiền 25% → 40% → 100% | xác nhận BR-PUB-08 · BR-APP-02..04; evidence ở Q-16 · Q-18 |
| regulatory-landscape §2 | cửa sổ nhắc 15–45 ngày cho kỳ ≥ 1 năm (CA, NY, NYC); lưu bằng chứng consent ≥ 3 năm (CA) | Q-26 (mới) · `legal-consent` §1 khi Q-05 chốt |
| regulatory-landscape §3 | EU: chức năng rút hợp đồng 14 ngày từ 19/6/2026; Đức: nút huỷ không cần đăng nhập | Q-25 (mới) |
| regulatory-landscape §5–§7 | GPC, dữ liệu sức khoẻ, tuổi — **chưa verify** (`[BK]`) | evidence ở Q-20 · Q-21 · Q-22 |

## 7. Trạng thái gate

| Gate | Bị chặn bởi | Trạng thái 2026-09-28 |
|---|---|---|
| feature-lock | — | **đạt** (`research/final-features.md` v2, 2026-09-27) |
| economy-FREEZE | Group A mở: Q-03 · Q-04 · Q-05 · Q-18 · Q-19 · Q-25 | chưa |
| FND-FREEZE | Q-17 (Group C, chờ human veto) | chưa |
| API-FREEZE | Group B mở (Q-10 · Q-11 · Q-16 · Q-24 …); money API cần human review (`api-mapping` §1); D-06 · D-18 | chưa |
| G-lint-PASS | Group D: Q-26 và D-01…D-19 ở §5 | chưa (lint ID tự động đã sạch) |
| Research freshness | `teardown.md` ghi re-verify by 2026-12-27; phần drive còn PARK ở `next-drive-plan.md` | còn hạn |

## 8. AI Notices
- Mọi dòng D-01…D-19 đều đã được grep lại ở nguồn trước khi ghi (cột "Đã kiểm").
- Không sửa copy nào có tính cam kết với người dùng (FAQ gia hạn, banner consent, lời hứa về dữ liệu) khi chưa có quyết định: các chỗ đó chỉ được ghi ở §5.
- Evidence `[INFERRED · BK]` của `regulatory-landscape` là kiến thức nền chưa verify; không dùng để chốt Q-20 · Q-21 · Q-22.
- Chạy lại thẩm định sau mỗi đợt sửa lớn: script lint ID, parse mermaid, và so NAV giữa §2.2 của từng màn với sơ đồ tổng.
