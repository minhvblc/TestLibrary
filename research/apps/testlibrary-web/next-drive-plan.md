# [RS-testlibrary] Kế hoạch drive tiếp — phiên browser thật
**Changelog** (mới nhất trước)
- 2026-09-28 · v1.1 · claude-opus-5-5 · D-10 · D-11 cụ thể hoá theo `web-evidence.md` (NordicaLab, thang hoàn tiền, Lifetime $99.95); log phiên này đã dùng # 52–57 nên phiên drive tiếp bắt đầu từ # 58.
- 2026-09-28 · v1 · claude-opus-5-5 · soạn khi phiên cloud không mở được testlibrary.com (egress policy của container chặn host). Dùng làm brief cho phiên chạy trên máy của human (Claude in Chrome, hoặc bộ công cụ drive của phiên 2026-09-27).

## 0. Vì sao có file này

| Mục | Ghi nhận |
|---|---|
| Phiên 2026-09-28 | chạy trong container cloud. Proxy trả **403 cho CONNECT** tới `testlibrary.com`, `www.trustpilot.com`, `web.archive.org`, `ipinfo.io`, `www.cloudflare.com`. WebFetch cũng bị chặn ở các host này. Chỉ **WebSearch** chạy được, nên phiên này chỉ thêm được bằng chứng `[LIVE:web]` (xem `web-evidence.md`) |
| Vì sao cần browser thật | curl bị Cloudflare challenge (F-01). Chrome thật của human qua được im lặng ở phiên 2026-09-27. Chromium headless từ IP datacenter có thể vẫn bị challenge |
| Cách mở phiên | Claude Code CLI `claude --chrome` trong thư mục repo, hoặc Claude Desktop (tab Code, Environment = Local), trên branch `claude/blissful-shannon-aky18v`. Bảo agent: *"đọc `research/apps/testlibrary-web/next-drive-plan.md` và drive theo đó"* |

## 1. Quy ước khi drive

| Mục | Quy ước |
|---|---|
| Đọc trước | `notes.md` (log phiên 1) · `teardown.md` §4.2 + §9 · `tech-probe.md` §9 · `web-evidence.md` · `tech-kit/ground-truth.md` |
| Đánh số | EV tiếp từ **EV-TLW-264** (lấy số kế tiếp trong `research/evidence.tsv`) · ảnh tiếp từ `screenshots/115-…` · màn mới tiếp từ **SC-TLW-29** · finding tiếp sau số F lớn nhất đang có ở `teardown.md`, `tech-probe.md` và `web-evidence.md` |
| Context | `main` = ẩn danh. Mỗi run kit cần **fresh context**: profile Chrome riêng (như profile `testlib` của phiên 1), hoặc xoá site data của `testlibrary.com` (cookie + localStorage) trước mỗi run. Ghi rõ đã dùng cách nào |
| Kit | `tech-kit/` **đóng băng**: không thêm, không đổi item. Chạy kit trên bài khác thì ghi "run 2", "run 3" và tên bài; rubric GT-01..05 giữ nguyên |
| Capture mỗi bước | ảnh (1280×800; 390×844 khi cần) + innerText khi có copy quan trọng + URL. Ghi vào `notes.md` (bảng mới "Phiên 3", # tiếp từ 58) và `evidence.tsv` |
| Provenance | quan sát trong browser = `[LIVE:browser]` · ảnh/email human đưa = `[LIVE:user]` · suy luận = `[INFERRED]` |

## 2. Safety walls (giữ nguyên phiên 1)

- Không nhập email, thẻ, tên ở bất kỳ checkout nào. Không bấm Apple Pay / Google Pay. Không mua.
- Không submit `/cancel-sub`, không bấm "Cancel subscription", không gửi form Contact, không đổi tên hay mật khẩu.
- Không đọc payload request, không replay API, không đọc bundle (`core-tech-web.md` §8–9). Network chỉ ghi **host + class + số lượng**.
- Tải file chỉ khi human cho phép từng file.
- Đăng nhập do human tự làm. Agent không gõ credential.
- Thao tác gây hiệu ứng bên ngoài (gửi email, link xác minh, vote, check-in mới) phải hỏi human trước.

## 3. Việc cần drive

| # | Mục tiêu (nguồn PARK / Q) | Trang | Thao tác | Ghi nhận cần có | Ưu tiên |
|---|---|---|---|---|---|
| D-01 | Danh mục URL đầy đủ (F-04 · F-27; sitemap 403 với curl) | `/sitemap.xml` | mở trong browser | tổng số URL; số `/free-tests/<slug>`; funnel trả phí (`/<test>/`); locale prefix; trang lạ (blog, landing ads). So với danh sách index ở `web-evidence.md` §2 | P0 |
| D-02 | F-14 có đúng với bài nhạy cảm không; bài nhạy cảm có disclaimer / nguồn hỗ trợ không (Q-06 · Q-23 · P-05) | `/free-tests/depression-test` (hoặc bài mental-health ngắn nhất trong D-01) | kit **run 2**: TK-01 rồi TK-02, mỗi run fresh context; TK-03 nếu còn thời gian | số câu; kết quả VERBATIM cả hai run; GT-01; có câu "not a diagnosis" / số điện thoại hỗ trợ không; **số** request `facebook.com/tr` + `bat.bing.com` trong lúc làm (không đọc payload) | P0 |
| D-03 | Tính phụ thuộc câu trả lời ở một bài không phải personality | 1 bài free khác (vd `adhd-test` hoặc bài love style trong D-01) | kit **run 3**: TK-01 vs TK-02 | như D-02 | P1 |
| D-04 | Link kết quả mở ở context khác (PARK teardown §9) | `/free-tests/<slug>/result` từ D-02 | copy URL → mở ở fresh context | trang hiện gì (kết quả, trang trống, redirect về câu 1) | P1 |
| D-05 | PSP thật (F-10 `[INFERRED]` · Q-04) | `/checkout?from=pricing&product=7` | mở, **không nhập gì**; liệt kê host network + `src` của iframe | có `js.stripe.com` / `*.stripe.network` / host PSP khác không; ô thẻ là input first-party hay iframe | P0 |
| D-06 | Đồng hồ "Results saved for: 15:00" hết giờ thì sao (F-17) | offer `/personality-test/offer?…` | làm bài 100 câu ẩn danh tới offer (TK-01) → để trang mở > 15 phút | ảnh lúc 00:00 và 1 phút sau: giá đổi không, "report" còn không, có modal / redirect không | P1 |
| D-07 | Locale khác (F-07) | `/fr/pricing` · `/es/pricing` · `/ja/pricing` · `/ar/pricing` | goto từng trang | currency; dòng "then $39.95 every 4 weeks." có dịch không; RTL ở `/ar/`; `hreflang` / OG trên trang locale | P2 |
| D-08 | Funnel trả phí của bài khác có cùng cấu trúc / giá / checkout không (A/B, F-18) | `/iq-test/` hoặc funnel khác trong D-01, ẩn danh | đi tới offer (nếu bài ngắn) hoặc tới trang đầu tiên có giá | giá; tên checkout (`checkout-2-bubbles` hay biến thể khác); có checkbox consent không | P1 |
| D-09 | Tài khoản "Cancelled" còn quyền tới khi nào (F-24) | `/dashboard` · `/reports/personality-test` · `/profile/plan-details` | chỉ khi Chrome của human còn đăng nhập tài khoản research; chỉ xem | còn làm test / xem report không; Plan details đổi gì. **Làm lại sau 2026-10-04** (hết 7 ngày trial) để thấy trạng thái sau trial | P0 (theo mốc ngày) |
| D-10 | Email vòng đời (PARK `[BLOCKED · login]`; legal-consent §3c #3 · #4 · #6) | hộp thư research của human | **human** chụp / xuất các email từ testlibrary (xác nhận đơn, đặt mật khẩu, email có nhắc subscription, xác nhận huỷ, nhắc trước gia hạn nếu có), che email / tên | tiêu đề, người gửi, ngày, số tiền, câu về gia hạn / huỷ (VERBATIM), pháp nhân bán trong order confirmation (legal-extract 1.3); **tên hiện trên sao kê** của khoản $1.95 ("testlibrary.com" hay "NordicaLab", F-37); điều khoản gia hạn có nằm cuối email xác nhận như khiếu nại kể không (web-evidence §4) | P0 (việc của human) |
| D-11 | Chốt số liệu review đang lệch giữa các nguồn search (`web-evidence.md` §1) | `trustpilot.com/review/testlibrary.com` · hồ sơ BBB | goto, chỉ đọc | TrustScore, tổng review, phân bố sao, tỉ lệ company reply (VERBATIM, ngày xem); trang `nordicalab.com` trên Trustpilot (quan hệ "DBA as TestLibrary"); trang complaints BBB + Scam Tracker 1264754 · 1292114 · 1338618; ProductReview.com.au; bài thinkitsascam 2026-06 (gói Lifetime $99.95, các bước `/cancel-sub`). Xem `web-evidence.md` §11 | P1 |
| D-12 | *(tuỳ chọn, cần human cho phép vượt `core-tech-web.md` §8)* report trả phí có phụ thuộc câu trả lời không (tech-probe §9) | member: Personality Test | làm lại bài 100 câu theo TK-02 | "Your Scores" so với lần trước (Reformer 95 · 8 type 87) | P2 |
| D-13 | *(tuỳ chọn, cần VPN của human)* first visit từ IP EU / UK / US (F-02 · Q-13) | `/` · `/pricing` | fresh context qua VPN | có cookie banner không, có nút Reject không; currency và giá có đổi không | P2 |

## 4. Sau khi drive: cập nhật ở đâu

| File | Cập nhật |
|---|---|
| `notes.md` | bảng "Phiên 3" theo thứ tự drive (# từ 58) |
| `research/evidence.tsv` → `evidence-index.md` | EV mới (sinh lại index) |
| `teardown.md` | §2 nguồn · §4.x liên quan · §5 finding mới · §9 PARK (đánh dấu mục đã làm) |
| `tech-probe.md` | §3 / §4 / §9 cho D-02 · D-03 · D-05 · D-12 |
| `research/research-synthesis.md` · `research/00-applications-list.md` | pain / matrix nếu đổi · coverage ledger |
| `docs/overview/bang-quyet-dinh.md` + docs bị ảnh hưởng | chỉ khi finding làm đổi một quyết định (vd D-05 → Q-04, D-13 → Q-13) |

## 5. AI Notices
- D-09 và D-10 phụ thuộc tài khoản và hộp thư của human; D-12 và D-13 cần human cho phép. Không làm các mục này nếu human chưa đồng ý.
- Nếu Cloudflare chặn cả browser thật (challenge không tự qua), dừng lại và báo human, không tìm cách vượt.
