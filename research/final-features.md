# [testlib] FINAL — Chốt tính năng (web)
> Locked từ Phase 1 evidence (RS-testlibrary · core-tech · research-synthesis). `docs/` chỉ được viết khi mọi row §3 = Đã chốt (hoặc gắn Q-xx).
**Changelog** (mới nhất trước)
- 2026-09-27 · v2 · claude-opus-5-5 · human chốt Q-02 = freemium minh bạch · Q-06 = CÓ bài sức khoẻ tinh thần kèm bảo vệ · Q-08 = report viết sẵn theo type · Q-15 = check-in + streak và thử thách 30 ngày (poll → v1.x). Mọi row §3 → Đã chốt; tham số còn mở nằm ở Q-xx.
- 2026-09-27 · v1 · claude-opus-5-5 · đề xuất MVP + mint SCR-ID (§7).

## 1. Positioning

**Pitch.** Thư viện bài test tâm lý **minh bạch**. Kết quả được chấm thật theo câu trả lời và có giải thích. Giá và điều khoản gia hạn nói rõ ngay từ đầu, có nhắc trước khi thu tiền, huỷ bằng một bước. Câu trả lời riêng tư, không bị gửi cho quảng cáo. Kết quả được biến thành thói quen nhỏ mỗi ngày.

| # | Pain (P-xx) | Đối thủ làm | Mình làm | Chi phí build thêm | Basis |
|---|---|---|---|---|---|
| 1 | P-04 kết quả chung chung | kết quả free cố định với mọi câu trả lời (F-14) | chấm điểm thật ở server, deterministic, có mục "vì sao bạn ra kết quả này" | thấp (TD-01) | RS·F-14 · TK-01..03 |
| 2 | P-02 gia hạn bất ngờ | offer không nói gia hạn, checkout funnel không checkbox (F-17 · F-18) | mọi bề mặt tiền hiện giá gia hạn + chu kỳ + ngày thu; checkbox consent; email nhắc trước khi thu | thấp | RS·F-17 · F-18 · F-29 |
| 3 | P-03 khó huỷ | huỷ qua link email, mất quyền ngay (F-11) | huỷ 1 bước trong tài khoản, dùng tới hết kỳ đã trả, email xác nhận | thấp | RS·F-11 · F-24 |
| 4 | P-05 riêng tư | pixel quảng cáo theo từng câu trả lời, không banner (F-13 · F-02) | consent-first; không gửi câu trả lời cho bên thứ ba; export/xoá dữ liệu | trung bình (TD-04) | RS·F-02 · F-13 |
| 5 | P-07 kết quả → hành động | thử thách 30 ngày + check-in (F-21) | giữ, và cá nhân hoá theo kết quả thật | trung bình (nội dung) | RS·F-21 |
| 6 | P-06 bài dài | 100 câu / "20 mins" (F-15) | bài 20–40 câu, ghi đúng số câu + thời gian thật | thấp (nội dung) | RS·F-15 · F-19 |

## 2. Feature × site matrix

| Feature | testlibrary | Tier | Tag đa số |
|---|---|---|---|
| Trang SEO từng bài test | ✅ | Must-have | `[LIVE:browser]` |
| Làm bài không cần tài khoản | ✅ | Must-have | `[LIVE:browser]` |
| Resume / offline khi làm bài | ✅ | Common | `[LIVE:browser]` |
| Kết quả tóm tắt free | ⚠️ (không phụ thuộc câu trả lời) | Must-have | `[LIVE:browser]` |
| Paywall sau khi làm bài | ✅ | Must-have | `[LIVE:browser]` |
| Pricing page | ✅ | Must-have | `[LIVE:browser]` |
| Report dài theo type | ✅ | Must-have | `[LIVE:browser]` |
| Export PDF | ✅ | Common | `[LIVE:browser]` |
| Daily check-in + streak | ✅ | Common | `[LIVE:browser]` |
| Thử thách 30 ngày | ✅ | Differentiator | `[LIVE:browser]` |
| Poll cộng đồng tuần | ✅ | Differentiator | `[LIVE:browser]` |
| Nhắc trước gia hạn · huỷ 1 bước · export/xoá dữ liệu · consent banner | ❌ | Differentiator (của mình) | `[LIVE:browser]` |

## 3. MVP feature list

| Module | Feature | Mô tả 1 dòng | Basis | Tag | Feasibility (TC-xx · in-browser / server / none · rủi ro) | Scope | Status |
|---|---|---|---|---|---|---|---|
| PUB | Landing | giới thiệu, bài nổi bật, CTA "làm bài miễn phí" (không dẫn thẳng pricing) | RS·F-03 (tránh) · CS-01 | `[LIVE:browser]` | none · thấp | MVP | Đã chốt |
| PUB | Thư viện bài test | lưới bài + lọc chủ đề, số câu/thời gian thật | CS-02 · RS·F-19 | `[LIVE:browser]` | none · thấp | MVP | Đã chốt |
| PUB | Trang SEO từng bài | mô tả, cách chấm, FAQ, nút bắt đầu; OG/JSON-LD/hreflang | RS·F-04 · F-27 · Q-09 | `[LIVE:browser]` | none · rendering = Q-09 | MVP | Đã chốt |
| PUB | Pricing minh bạch | giá, chu kỳ, gia hạn, huỷ, hoàn tiền hiện đầy đủ | RS·F-05 · F-17 · Q-02 · Q-03 | `[LIVE:browser]` | none · giá = Q-03 | MVP | Đã chốt |
| PUB | Văn bản pháp lý + trợ giúp | privacy · terms · subscription & refund · cookie; FAQ + form liên hệ | RS·F-12 · F-29 · Q-05 | `[LIVE:browser]` | none · pháp lý = Q-05 | MVP | Đã chốt |
| TEST | Làm bài (guest) | 1 câu/màn Likert, progress local + resume, chạy offline, nộp khi có mạng | RS·F-13 · TK-04 · TK-05 | `[LIVE:browser]` | TC-01 · TD-01 hybrid (flow client) · thấp | MVP | Đã chốt |
| TEST | Chấm điểm thật | server, deterministic, versioned, có reverse-keying; kiểm bằng kit | RS·F-14 (tránh) · F-31 · Q-10 | `[LIVE:browser]` | TC-01 · TD-01 server scoring · trung bình (thang đo — spike core-tech §9 #1) | MVP | Đã chốt |
| TEST | Kết quả tóm tắt free | type/điểm + "vì sao" ngắn, không mờ/giấu | RS·F-14 · P-04 | `[LIVE:browser]` | TC-01/TC-02 · TD-01 · TD-02 · thấp | MVP | Đã chốt |
| TEST | Lưu kết quả bằng email | magic link, không bắt buộc để xem tóm tắt | RS·F-20 · Q-11 | `[LIVE:browser]` | none · thấp | MVP | Đã chốt |
| PAY | Mở khoá report | trang unlock: nội dung report, giá, chu kỳ, gia hạn, ngày thu | RS·F-17 · F-18 (tránh) · Q-02 | `[LIVE:browser]` | none · giá = Q-03 | MVP | Đã chốt |
| PAY | Checkout hosted + consent | checkout của provider, checkbox consent gia hạn, entitlement do webhook | RS·F-08 · Q-04 | `[LIVE:browser]` | server (webhook) · provider = Q-04 | MVP | Đã chốt |
| PAY | Quản lý gói | gói hiện tại, ngày thu kế tiếp, huỷ 1 bước (dùng tới hết kỳ), hoá đơn | RS·F-11 · F-24 · Q-18 | `[LIVE:browser]` | server · thấp | MVP | Đã chốt |
| PAY | Email nhắc gia hạn + xác nhận huỷ | nhắc trước khi trial/kỳ chuyển sang trả phí; xác nhận huỷ | RS·F-29 · Q-16 | `[LIVE:browser]` | server (email) · vendor = Q-16 | MVP | Đã chốt |
| AUTH | Đăng nhập | magic link email + Google | RS·F-20 · Q-11 | `[LIVE:browser]` | server · thấp | MVP | Đã chốt |
| APP | Dashboard member | tiến độ thư viện, bài kế, report gần nhất | RS·F-21 | `[LIVE:browser]` | none · thấp | MVP | Đã chốt |
| APP | Daily check-in + streak | 1 câu/ngày, streak, 7 ngày gần nhất | RS·F-21 · Q-15 | `[LIVE:browser]` | server · thấp | MVP | Đã chốt |
| APP | Thử thách 30 ngày | 1 hành động/ngày theo kết quả, mở từng ngày | RS·F-21 · Q-15 | `[LIVE:browser]` | TC-02 · TD-02 (nội dung) · trung bình (nội dung) | MVP | Đã chốt |
| APP | Report của tôi + report chi tiết | danh sách + report chương, mục lục | RS·F-22 · F-23 · Q-08 | `[LIVE:browser]` | TC-02 · TD-02 · trung bình (nội dung) | MVP | Đã chốt |
| APP | Tải PDF | PDF đúng số trang như mô tả | RS·F-23 · F-34 · Q-08 | `[LIVE:browser]` | TC-02 · TD-03 server · trung bình (spike core-tech §9 #2) | MVP | Đã chốt |
| ACC | Tài khoản & quyền riêng tư | hồ sơ, tuỳ chọn email, export dữ liệu, xoá tài khoản | research-synthesis §3 (❌ đối thủ) · Q-05 | `[LIVE:browser]` | server · thấp | MVP | Đã chốt |
| TRUST | Consent banner + tracking consent-first | Reject ngang Accept; không gửi câu trả lời cho bên thứ ba | RS·F-02 · F-13 · Q-12 · Q-13 | `[LIVE:browser]` | TD-04 · thấp | MVP | Đã chốt |
| TRUST | Bảo vệ bài nhạy cảm | disclaimer không-chẩn-đoán; nguồn hỗ trợ khủng hoảng theo vùng; consent riêng cho dữ liệu nhạy cảm trước câu hỏi đầu tiên; KHÔNG pixel quảng cáo trên mọi route của bài nhạy cảm | legal-extract §7–8 · RS·F-13 · Q-06 (human: CÓ, kèm bảo vệ) | `[LIVE:browser]` | none · pháp lý | MVP | Đã chốt |
| CONTENT | Bộ bài MVP | tính cách · quan hệ · nghề nghiệp · một số bài sức khoẻ tinh thần (gắn cờ `sensitive`, tên hiển thị trung thực — không che từ khoá); nội dung + bản quyền Q-07 | RS·F-04 · Q-06 · Q-07 | `[LIVE:browser]` | TC-01 · nội dung · trung bình | MVP | Đã chốt |
| I18N | Ngôn ngữ ra mắt | en-US; điều khoản giá luôn dịch cùng UI | RS·F-07 · Q-14 | `[LIVE:browser]` | none · thấp | MVP | Đã chốt |

## 4. Đối thủ CÓ — mình KHÔNG build

| Feature | Ai có (RS) | Lý do bỏ |
|---|---|---|
| Đồng hồ "Results saved for" | RS-testlibrary · F-17 | tạo gấp giả (chỉ chạy khi trang mở) |
| Ticker "<Tên> just bought" | RS-testlibrary · F-17 | social proof không kiểm chứng |
| Logo "featured in" | RS-testlibrary · F-17 | không có căn cứ |
| Bẫy back ở offer | RS-testlibrary · F-19 | dark pattern |
| Checkout không checkbox / neo giá "-87%" | RS-testlibrary · F-18 | thiếu consent, neo giá không có thật |
| Kết quả free cố định | RS-testlibrary · F-14 | misrepresentation |
| Loader "labor illusion" (Preparing… / Analyzing…) | RS-testlibrary · F-16 | kéo dài giả; chỉ loading thật |
| Pixel quảng cáo theo từng câu | RS-testlibrary · F-13 | dữ liệu nhạy cảm |
| Trang SEO tên "mềm" che từ khoá lâm sàng | RS-testlibrary · F-04 | bài nhạy cảm của mình dùng tên trung thực + disclaimer (Q-06) |
| Poll cộng đồng tuần | RS-testlibrary · F-21 | để v1.x (Q-15) |
| IQ test có giờ | RS-testlibrary · F-25 | để sau |

## 5. Mình CÓ — đối thủ KHÔNG

| Feature (in-house) | Giá trị | Rủi ro |
|---|---|---|
| "Vì sao bạn ra kết quả này" (giải thích điểm) | tin tưởng, khác biệt P-04 | cần nội dung cho từng thang |
| Email nhắc trước gia hạn + huỷ 1 bước | tuân thủ auto-renew, giảm chargeback | có thể giảm doanh thu gia hạn ngắn hạn |
| Export / xoá dữ liệu | GDPR, niềm tin | thêm luồng BE |
| Consent banner đúng chuẩn | EU, niềm tin | ít dữ liệu marketing hơn |
| Nguồn hỗ trợ khủng hoảng ở bài nhạy cảm | an toàn người dùng | cần danh sách theo vùng |

## 6. Monetization (LOCKED structure — Q-02 Đã chốt: freemium minh bạch)

| Nguồn thu | Cơ chế | Basis | Note |
|---|---|---|---|
| Report đầy đủ | mở khoá theo bài (một lần) và/hoặc qua subscription | RS·F-05 (One Time $57, n=1) · Q-02 · Q-03 | giá ở `overview §2` sau khi chốt |
| Subscription "Full access" | truy cập mọi report + thử thách; chu kỳ tháng/năm (không 4 tuần) | RS·F-05 · Q-03 | trial: có/không, cần thẻ? = Q-03 |

## 7. Feature → planned screens (SCR-ID gán VĨNH VIỄN tại đây)

| Feature (MVP) | SCR-ID | Route dự kiến | Access | Indexable? | Doc level | Basis (CS-xx · SC · EV) |
|---|---|---|---|---|---|---|
| Landing | SCR-PUB-01 | `/` | public | index | short | CS-01 · SC-TLW-01 · EV-TLW-013 |
| Thư viện bài test | SCR-PUB-02 | `/tests` | public | index | short | CS-02 · SC-TLW-11 · EV-TLW-050 |
| Trang SEO từng bài | SCR-PUB-03 | `/tests/:slug` | public | index | short | CS-03 · SC-TLW-12 · EV-TLW-053 |
| Pricing minh bạch | SCR-PUB-04 | `/pricing` | public | index | full | CS-09 · SC-TLW-04 · EV-TLW-024 |
| Văn bản pháp lý | SCR-PUB-05 | `/legal/:doc` | public | index | short | CS-18 · SC-TLW-06 · EV-TLW-040 |
| Trợ giúp (FAQ + liên hệ) | SCR-PUB-06 | `/help` | public | index | short | CS-19 · SC-TLW-08 · EV-TLW-047 |
| Làm bài | SCR-TEST-01 | `/tests/:slug/take` | guest | noindex | full | CS-04 · SC-TLW-13 · EV-TLW-054 |
| Kết quả tóm tắt + lưu bằng email | SCR-TEST-02 | `/results/:resultId` | guest | noindex | full | CS-07 · SC-TLW-14 · EV-TLW-079 |
| Mở khoá report | SCR-PAY-01 | `/unlock/:resultId` | guest | noindex | full | CS-08 · SC-TLW-21 · EV-TLW-108 |
| Kết quả thanh toán (return) | SCR-PAY-02 | `/checkout/return` | guest | noindex | full | CS-10 · SC-TLW-22 · EV-TLW-111 (in-house: trạng thái chờ webhook) |
| Quản lý gói | SCR-PAY-03 | `/account/billing` | account | noindex | full | CS-16 · SC-TLW-27 · EV-TLW-247 |
| Đăng nhập | SCR-AUTH-01 | `/login` | public | noindex | short | CS-11 · SC-TLW-02 · EV-TLW-006 |
| Dashboard (check-in + thử thách) | SCR-APP-01 | `/app` | account | noindex | short | CS-12 · SC-TLW-03 · EV-TLW-209 |
| Report của tôi | SCR-APP-02 | `/app/reports` | account | noindex | short | CS-13 · SC-TLW-24 · EV-TLW-241 |
| Report chi tiết + PDF | SCR-APP-03 | `/app/reports/:reportId` | entitled | noindex | full | CS-14 · SC-TLW-25 · EV-TLW-244 · EV-TLW-261 |
| Tài khoản & quyền riêng tư | SCR-ACC-01 | `/account` | account | noindex | full | CS-15 · SC-TLW-26 · EV-TLW-246 (export/xoá: in-house) |

## 8. Out of scope

| Không build | Lý do | Revisit khi |
|---|---|---|
| Trang kết quả chia sẻ công khai | ưu tiên funnel cốt lõi | sau khi đo tỉ lệ chia sẻ mong muốn (v1.x) |
| Poll cộng đồng tuần | cần vận hành nội dung hàng tuần | v1.x (Q-15) |
| LLM cá nhân hoá report | chi phí + dữ liệu nhạy cảm | Q-08 · Q-19 |
| IQ test có giờ, câu đố | engine khác, rủi ro "IQ" | sau MVP |
| App iOS/Android | web trước | sau PMF |

## 9. Open questions → Q-xx

| Câu hỏi | Chặn Q-xx nào | Cách trả lời |
|---|---|---|
| Mô hình kiếm tiền | Q-02 (A) | **Đã chốt**: freemium minh bạch |
| Giá, chu kỳ, trial | Q-03 (A) | human điền trước economy-FREEZE |
| Bài sức khoẻ tinh thần trong MVP | Q-06 (B) | **Đã chốt**: có, kèm bảo vệ |
| Cách sinh report | Q-08 (A) | **Đã chốt**: viết sẵn theo type (PDF server — spike core-tech §9 #2) |
| Retention MVP | Q-15 (B) | **Đã chốt**: check-in + streak, thử thách 30 ngày |
| Còn lại (Q-01, Q-04, Q-05, Q-07, Q-09–Q-14, Q-16–Q-19) | xem `bang-quyet-dinh` | AI đề xuất default, human duyệt |

## 10. AI Notices
- n = 1 đối thủ, nên tier Must/Common/Differentiator dựa trên một site cộng suy luận category. Cần xem lại khi có thêm site.
- SCR-ID ở §7 là vĩnh viễn; route có thể đổi (sửa ở SCR meta rồi SYS-NAV).
