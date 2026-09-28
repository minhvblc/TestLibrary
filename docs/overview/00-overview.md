# 00-overview — TestLib (tên tạm, web)
**Changelog** (mới nhất trước)
- 2026-09-28 · v1.5 · claude-opus-5-5 · BR-APP-14: hạn rút = thanh toán + 15 ngày + 1 giờ (kể cả khi đổi giờ mùa); ngày hiện cho user lùi 1 ngày so với mốc.
- 2026-09-28 · v1.4 · claude-opus-5-5 · BR-APP-14: hạn rút = thời điểm thanh toán + 15 ngày (không ngắn hơn 14 ngày theo lịch ở bất kỳ múi giờ nào); bước 1 của chức năng rút có tên.
- 2026-09-28 · v1.3 · claude-opus-5-5 · BR-APP-11: file export còn hạn bị xoá ngay khi user xoá dữ liệu có trong file (tắt check-in, xoá kết quả, xoá tài khoản).
- 2026-09-28 · v1.2 · claude-opus-5-5 · BR-APP-04 · BR-APP-14: link huỷ / rút ở footer của mọi trang có footer (SCR-TEST-01 không có footer theo thiết kế). §3: tên SCR-PAY-05 rút gọn thành "Huỷ hoặc rút" cho khớp FLOW và sơ đồ.
- 2026-09-28 · v1.1 · claude-opus-5-5 · chốt giá (Q-03), MoR Paddle (Q-04), vùng bán + pháp nhân (Q-05), hoàn tiền / rút 14 ngày (Q-18 · Q-25), mốc nhắc (Q-16), khoá giá (Q-27), tên trên sao kê (Q-24) — AI chốt theo uỷ quyền của human 2026-09-28. §2 có giá thật; §3 thêm SCR-PAY-05 `/cancel`; §5 sửa BR-APP-03 · 04 · 08 · 12, thêm BR-APP-13 · 14 · 15.
- 2026-09-27 · v1 · claude-opus-5-5 · khởi tạo từ `research/final-features.md` v2 (Q-02 · Q-06 · Q-08 · Q-15 đã chốt).

## 1. Product description

TestLib là thư viện bài test tâm lý trên web: tính cách, quan hệ, nghề nghiệp, và một số bài về sức khoẻ tinh thần (có bảo vệ riêng). Ai cũng làm bài và xem **kết quả tóm tắt chấm thật** miễn phí. Muốn đọc **report đầy đủ + PDF** thì mở khoá từng kết quả, hoặc đăng ký **Plus** (mọi report + thử thách 30 ngày). Giá và điều khoản gia hạn hiện rõ ở mọi bề mặt tiền, có email nhắc trước khi thu, huỷ bằng một bước (cả khi không đăng nhập), và rút trong 14 ngày được hoàn toàn bộ. · basis `research/final-features.md` §1 · Q-02 · Q-18

## 2. Plans & pricing (BUSINESS SOURCE OF TRUTH)

> Mọi SCR / api / pricing-page / go-to-market **cite về bảng này**. Giá chốt ngày 2026-09-28 (Q-03, AI · uỷ quyền human). Copy trên màn vẫn dùng token `[price]` và lấy số từ API-PAY-01, không hard-code. Đổi giá = sửa bảng này + price trên Paddle; subscriber đang có giữ giá cũ (BR-APP-13). Economy-FREEZE còn chờ dữ liệu setup (`bang-quyet-dinh` §2 #3).

| Plan | planKey | Chu kỳ | Giá base (currency · thuế) | Giới hạn / quyền | Trial (có cần thẻ?) | Provider price id (điền khi setup) | Neo đối thủ (RS·F · EV · Tag) |
|---|---|---|---|---|---|---|---|
| Free | `plan.free` | — | 0 · basis Q-02 | làm mọi bài; kết quả tóm tắt chấm thật; lưu lịch sử khi có tài khoản; daily check-in + streak | không áp dụng | không có | kết quả free của đối thủ không phụ thuộc câu trả lời · RS·F-14 `[LIVE:browser · EV-TLW-138 · 2026-09-27]` |
| Mở khoá 1 report | `report.single` | một lần, gắn 1 kết quả | **$9.99** (USD, chưa gồm thuế; Paddle tính thuế ở checkout — Q-03 · Q-04) | report đầy đủ + PDF của đúng kết quả đó, vĩnh viễn; rút trong 14 ngày được hoàn toàn bộ (BR-APP-14) | không | Paddle price id, điền khi setup (Q-04) | "One Time $57.00 · One test with its full report" `[LIVE:browser · EV-TLW-025 · 2026-09-27]` |
| Plus tháng | `plan.plus.monthly` | 1 tháng, tự gia hạn | **$12.99 / tháng** (USD, chưa gồm thuế — Q-03 · Q-04) | mọi report + PDF; thử thách 30 ngày; rút trong 14 ngày từ lần thanh toán đầu được hoàn toàn bộ (BR-APP-14) | không (freemium thay trial — Q-03) | Paddle price id, điền khi setup (Q-04) | "$39.95 every 4 weeks" (13 kỳ/năm) `[LIVE:browser · EV-TLW-025 · 2026-09-27]` |
| Plus năm | `plan.plus.annual` | 12 tháng, tự gia hạn | **$69.99 / năm** (USD, chưa gồm thuế; khoảng $5.83 / tháng; "Save 55%" so với 12 × $12.99 — Q-03) | như Plus tháng; rút trong 14 ngày từ lần thanh toán đầu và từ mỗi lần gia hạn năm được hoàn toàn bộ (BR-APP-14) | không | Paddle price id, điền khi setup (Q-04) | đối thủ không có gói năm `[LIVE:browser · EV-TLW-025 · 2026-09-27]` |

## 3. Screen inventory

| SCR-ID | Tên | Route | Access | Indexable? | Feature phục vụ | Money path? | Doc level |
|---|---|---|---|---|---|---|---|
| SCR-PUB-01 | Trang chủ | `/` | public | index | Landing | không | short |
| SCR-PUB-02 | Thư viện bài test | `/tests` | public | index | Thư viện bài test | không | short |
| SCR-PUB-03 | Trang bài test | `/tests/:slug` | public | index | Trang SEO từng bài | không | short |
| SCR-PUB-04 | Bảng giá | `/pricing` | public | index | Pricing minh bạch | có | full |
| SCR-PUB-05 | Văn bản pháp lý | `/legal/:doc` | public | index | Văn bản pháp lý | không | short |
| SCR-PUB-06 | Trợ giúp | `/help` | public | index | Trợ giúp (FAQ + liên hệ) | không | short |
| SCR-PUB-07 | Cài đặt cookie | `/cookie-settings` | public | noindex | Consent banner + tracking consent-first | không | short |
| SCR-TEST-01 | Làm bài | `/tests/:slug/take` | guest | noindex | Làm bài (guest) · Chấm điểm thật · Bảo vệ bài nhạy cảm | không | full |
| SCR-TEST-02 | Kết quả | `/results/:resultId` | guest | noindex | Kết quả tóm tắt free · Lưu kết quả bằng email | không | full |
| SCR-PAY-01 | Mở khoá report | `/unlock/:resultId` | guest | noindex | Mở khoá report · Checkout hosted + consent | có | full |
| SCR-PAY-02 | Xác nhận thanh toán | `/checkout/return` | guest | noindex | Checkout hosted + consent | có | full |
| SCR-PAY-03 | Gói & thanh toán | `/account/billing` | account | noindex | Quản lý gói | có | full |
| SCR-PAY-04 | Huỷ gia hạn | `/account/billing/cancel` | account | noindex | Quản lý gói · Email nhắc gia hạn + xác nhận huỷ | có | full |
| SCR-PAY-05 | Huỷ hoặc rút | `/cancel` | public | index | Quản lý gói · Rút hợp đồng 14 ngày (Q-18 · Q-25) | có | full |
| SCR-AUTH-01 | Đăng nhập | `/login` | public | noindex | Đăng nhập | không | short |
| SCR-APP-01 | Trang chủ member | `/app` | account | noindex | Dashboard · Daily check-in + streak · Thử thách 30 ngày | không | short |
| SCR-APP-02 | Report của tôi | `/app/reports` | account | noindex | Report của tôi | không | short |
| SCR-APP-03 | Report chi tiết | `/app/reports/:reportId` | entitled | noindex | Report chi tiết · Tải PDF | không | full |
| SCR-ACC-01 | Tài khoản & quyền riêng tư | `/account` | account | noindex | Tài khoản & quyền riêng tư | không | full |
| SCR-ACC-02 | Xoá tài khoản | `/account/delete` | account | noindex | Tài khoản & quyền riêng tư | không | full |

> SCR-PUB-07, SCR-PAY-04, SCR-PAY-05 và SCR-ACC-02 là **trang riêng có route** chứ không phải dialog. Lý do: link được từ email (nhắc gia hạn → trang huỷ), đóng được bằng back trình duyệt, a11y tốt hơn · basis `navigation-guide.md` §4 · in-house.

## 4. Screen map

Sơ đồ màn (mind map) + graph điều hướng cho **Web**: `docs/base-ui/SYS-NAV.md` §6–7, sinh bằng `navmap.py . write`. Không vẽ lại ở đây. Sản phẩm chỉ có Web (iOS/Android ngoài scope).

## 5. App-wide rules

| BR-APP-xx | Rule | Basis |
|---|---|---|
| BR-APP-01 | **Entitlement do server quyết.** Quyền đọc report / Plus chỉ mở khi server nhận webhook thanh toán đã verify chữ ký; client không tự mở khoá, không tin tham số URL | RS·F-08 · `00-quy-uoc-api` §6 · in-house |
| BR-APP-02 | **Công bố gia hạn ở mọi bề mặt tiền.** Pricing, trang mở khoá, xác nhận thanh toán, gói & thanh toán, trang huỷ và email đều hiện đủ: giá (theo §2), chu kỳ, "tự gia hạn", ngày thu kế tiếp (nếu có), cách huỷ. Nội dung lấy từ một component chung (GC-RenewalDisclosure) | RS·F-17 · F-18 (đối thủ giấu gia hạn ở offer) |
| BR-APP-03 | **Consent gia hạn tường minh + email nhắc.** Mua gói tự gia hạn phải tick một checkbox mặc định **không tick** có câu công bố gia hạn; server lưu `consent_version` + thời điểm (giữ theo Q-05 (f)). Email nhắc gửi **21 ngày trước kỳ năm** và **7 ngày trước mỗi kỳ tháng**, có tên gói, chu kỳ, số tiền, ngày thu, tên trên sao kê và link huỷ | RS·F-08 · F-29 · Q-16 · Q-26 |
| BR-APP-04 | **Huỷ một bước, dùng tới hết kỳ.** Huỷ trong tài khoản (SCR-PAY-04) hoặc không cần đăng nhập ở `/cancel` (SCR-PAY-05, link ở footer của mọi trang có footer) bằng một nút xác nhận, không bắt nêu lý do, không chặn giữ chân. Quyền dùng giữ tới hết kỳ đã trả; gửi email xác nhận huỷ ngay | RS·F-11 · F-24 · Q-18 · Q-25 |
| BR-APP-05 | **Không có dữ liệu bài test ở bên thứ ba.** Câu trả lời, điểm, type kết quả và slug của bài `sensitive` KHÔNG bao giờ gửi tới analytics/ads. Mọi tracking không-thiết-yếu chỉ bắn sau consent | RS·F-13 · F-02 · Q-12 · TD-04 |
| BR-APP-06 | **Bảo vệ bài `sensitive`.** Trước câu 1 phải có consent riêng cho dữ liệu nhạy cảm (lưu version). Trang bài, trang làm bài, kết quả và report của bài `sensitive` luôn hiện disclaimer + nguồn hỗ trợ (GC-SensitiveNotice). Các route đó (kể cả trang mở khoá và xác nhận thanh toán của kết quả thuộc bài `sensitive`) không tải script analytics/ads | Q-06 (human) · legal-extract §7–8 |
| BR-APP-07 | **Kết quả là hàm của câu trả lời.** Kết quả = f(câu trả lời, `scoring_version`); cùng input thì cùng output; lưu `scoring_version` cùng kết quả; không hiện kết quả mẫu/giả | RS·F-14 · TK-01..03 · TD-01 |
| BR-APP-08 | **Kết quả của khách.** Kết quả gắn với token trong cookie HttpOnly của trình duyệt đã làm bài. Khách chưa lưu bằng email thì kết quả tự xoá sau 30 ngày (Q-05). Lưu bằng email thì gắn vào tài khoản | Q-05 · Q-11 |
| BR-APP-09 | **Ngày nghiệp vụ theo timezone tài khoản.** Streak, ngày thử thách và email nhắc tính theo timezone của tài khoản (mặc định là timezone trình duyệt lúc tạo tài khoản, đổi được ở SCR-ACC-01) | in-house |
| BR-APP-10 | **Phiên đăng nhập.** Magic link hết hạn sau 15 phút và chỉ dùng được 1 lần; phiên trượt 30 ngày; đăng xuất xoá phiên ở thiết bị hiện tại | Q-11 · SYS-AUTH |
| BR-APP-11 | **Quyền với dữ liệu.** User tự export dữ liệu (JSON, gửi link qua email), tự **xoá từng kết quả** (kèm câu trả lời; với bài `sensitive` đây là cách rút consent — API-RES-03) và tự xoá tài khoản. Xoá tài khoản sẽ huỷ gia hạn và xoá cứng dữ liệu sau 30 ngày (trong thời gian đó có thể khôi phục bằng cách đăng nhập lại). File export còn hạn bị xoá ngay khi user xoá dữ liệu có trong file (tắt check-in, xoá kết quả, xoá tài khoản) | research-synthesis §3 · Q-05 |
| BR-APP-12 | **Tiền.** Giá hiển thị theo currency của planKey (USD cho MVP); thuế do Paddle (MoR) tính và hiện ở checkout trước khi trả; trang tiền nói rõ bên bán trên hoá đơn là Paddle (câu reseller, Q-04); không đổi currency theo IP ở client | RS·F-07 · Q-04 |
| BR-APP-13 | **Khoá giá cho subscriber.** Subscriber giữ đúng giá lúc mua chừng nào gói còn chạy liên tục; giá mới chỉ áp cho đăng ký mới hoặc đăng ký lại sau khi gói kết thúc. Ngoại lệ phải tăng giá: email 28 ngày trước (cửa sổ 21–30) và chỉ thu giá mới khi user bấm đồng ý; không đồng ý thì gói kết thúc cuối kỳ | Q-27 · regulatory-landscape §2 |
| BR-APP-14 | **Rút trong 14 ngày = hoàn toàn bộ.** Áp cho mọi khách, mọi nước, không hỏi lý do: mỗi lần mua report lẻ, lần thanh toán đầu của một gói Plus, mỗi lần gia hạn gói năm. Hạn rút tính bằng thời điểm thanh toán + 15 ngày + 1 giờ, để không bao giờ ngắn hơn hạn 14 ngày theo lịch ở bất kỳ múi giờ nào, kể cả khi đổi giờ mùa; ngày hiện cho user ("until [date]") lùi 1 ngày so với mốc, để không hứa quá mốc server nhận. Rút xong thì quyền của khoản đó kết thúc ngay. Kỳ gia hạn tháng không hoàn (huỷ bất kỳ lúc nào). Chức năng rút hai bước "Withdraw from contract here" (bước 1: tên, email, mã đơn) có ở footer của mọi trang có footer (trang làm bài SCR-TEST-01 không có footer), Gói & thanh toán, trang xác nhận thanh toán và email biên nhận → SCR-PAY-05; email xác nhận có ngày giờ nhận yêu cầu (API-MAIL-11) | Q-18 · Q-25 · RS·F-30 · web-evidence F-42 |
| BR-APP-15 | **Nói đúng tên trên sao kê.** Chuỗi khách sẽ thấy trên sao kê (`statementDescriptor`, lấy từ giao dịch thử thật với thẻ, PayPal, ví) hiện nguyên văn trước khi mua (trang giá, trang mở khoá), sau khi mua (xác nhận thanh toán, email biên nhận), ở email nhắc gia hạn, Gói & thanh toán và FAQ `/help` | Q-24 · web-evidence F-37 |

## 6. Provenance legend

| Form | Nghĩa | Dùng ở đâu |
|---|---|---|
| TAG `[LIVE:browser]` / `[LIVE:web]` / `[INFERRED]` / `[BLOCKED]` | provenance quan sát (đối thủ) | mọi doc `research/` + ô "Neo đối thủ" |
| BASIS cite `RS·F-xx` / `Q-xx` / brief / in-house | vì sao một quyết định của mình tồn tại | mọi doc `docs/` |

## 7. Liên kết

Design language: `design-language.md` (định tính) → `base-ui/FND-tokens.md` (cụ thể). Công nghệ cốt lõi: `cong-nghe-loi.md` (TD-01..TD-04; giá ở §2 không được mâu thuẫn COGS ở đó). Go-to-market: `go-to-market/00-gtm-strategy.md`.

## 8. File index

| Thư mục | File |
|---|---|
| `docs/overview/` | 00-overview · design-language · cong-nghe-loi · tieu-chuan-chung · bang-quyet-dinh · bao-cao-tham-dinh |
| `docs/flow/` | 00-so-do-luong-tong · FLOW-lam-bai-mien-phi · FLOW-luu-ket-qua-dang-nhap · FLOW-mo-khoa-report · FLOW-dang-ky-plus · FLOW-quan-ly-huy-gia-han · FLOW-thoi-quen-hang-ngay · FLOW-quyen-rieng-tu |
| `docs/screens/` | SCR-PUB-01…07 · SCR-TEST-01…02 · SCR-PAY-01…05 · SCR-AUTH-01 · SCR-APP-01…03 · SCR-ACC-01…02 |
| `docs/api/` | 00-quy-uoc-api · api-mapping · SCR-*-api (màn có API ghi) |
| `docs/tracking/` | tracking-events |
| `docs/base-ui/` | FND-tokens · SYS-NAV · SYS-AUTH · SYS-ENTITLEMENT · SYS-CONSENT · GC-* |
| `docs/go-to-market/` | 00-gtm-strategy · seo-meta · landing-copy · pricing-page · legal-consent · `web/` |

## 9. AI Notices
- Giá ở §2 do AI chốt theo uỷ quyền của human (Q-03, 2026-09-28). Price id, phí Paddle và chuỗi trên sao kê điền khi mở tài khoản (`bang-quyet-dinh` §2 #3).
- Access `guest` = không cần tài khoản nhưng bị ràng buộc theo token của trình duyệt (BR-APP-08). `entitled` = có quyền đọc report đó (mua lẻ hoặc Plus).
