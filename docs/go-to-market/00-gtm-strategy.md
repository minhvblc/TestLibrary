# 00-gtm-strategy — TestLib (tên tạm, Q-01) · nguồn nội dung cho mọi copy web
> Mọi copy ở `seo-meta.md` · `landing-copy.md` · `pricing-page.md` · `legal-consent.md` · `web/` được **dịch từ file này**, không soạn thẳng ở đó. Copy UI là en-US (Q-14), viết verbatim trong ngoặc kép. Giá không nằm ở đây: cite `00-overview §2` (Q-03). Nguồn: `research/final-features.md` §1 · §4–5 · `research/research-synthesis.md` §G · §U · `research/apps/testlibrary-web/teardown.md` §4.0.
**Changelog** (mới nhất trước)
- 2026-09-28 · v1.1 · claude-opus-5-5 · quyết định 2026-09-28 (AI · uỷ quyền human): giá đã chốt (Q-03); value prop #4 thêm huỷ không cần đăng nhập, #5 theo Q-28, thêm #9 rút 14 ngày (Q-18 · Q-25); keyword theo Q-07 và route `/cancel`; ads theo Q-12 · Q-20; footer có link huỷ / rút; checklist §6 thêm #12–#14 (rút / huỷ không đăng nhập, GPC, nguồn hỗ trợ).
- 2026-09-27 · v1 · claude (subagent) · khởi tạo.

## 1. Positioning & messaging

**Pitch.** Thư viện bài test tâm lý minh bạch. Kết quả được chấm thật theo câu trả lời và có giải thích. Tóm tắt có điểm luôn miễn phí, chỉ trả tiền khi muốn đọc report đầy đủ. Giá và điều khoản gia hạn nói rõ trước khi trả, có email nhắc trước khi thu, huỷ một bước. Câu trả lời không đi tới quảng cáo. · basis final-features §1 · Q-02

| Thông điệp gốc | Copy VERBATIM (en) | Dùng ở | Basis |
|---|---|---|---|
| Tagline | "Tests that are actually scored." | OG title `/` (biến thể) · hero H1 (biến thể) | value prop #1 |
| One-liner | "Free personality, relationship and career tests, scored from your answers and explained — with clear prices, and answers that never go to advertisers." | meta description `/` (bản rút gọn) · `description` của `web/manifest.webmanifest` (nửa đầu) | value prop #1 · #2 · #3 · #5 |

| # | Value prop | Dùng ở |
|---|---|---|
| 1 | **Kết quả chấm thật, có giải thích.** Điểm là hàm của câu trả lời (cùng input → cùng output, lưu `scoring_version`), kèm "vì sao bạn ra kết quả này". Copy neo: "tests that are actually scored" · basis RS·F-14 · P-04 · BR-APP-07 · TD-01 | hero H1 · khối tin cậy · OG `/` · meta `/tests/:slug` · FAQ "How are the tests scored?" |
| 2 | **Tóm tắt luôn miễn phí, trả tiền là tuỳ chọn.** Làm mọi bài và xem điểm mọi thang miễn phí; chỉ trả khi muốn report đầy đủ (mua lẻ `report.single` hoặc Plus). Copy neo: "Free summaries. Pay only for full reports." · basis Q-02 · RS·F-03 · F-15 | hero sub · khối giá tóm tắt · H1/sub trang giá · meta `/` · `/pricing` |
| 3 | **Không có khoản thu bất ngờ.** Giá gia hạn, chu kỳ, ngày thu hiện ở mọi bề mặt tiền; checkbox consent không tick sẵn; email nhắc trước khi gia hạn. Copy neo: "No surprise charges." · basis RS·F-17 · F-18 · F-29 · BR-APP-02 · BR-APP-03 · Q-16 | hero sub · trang giá (GC-RenewalDisclosure, checkbox) · FAQ · email nhắc API-MAIL-03 |
| 4 | **Huỷ một bước, dùng tới hết kỳ.** Nút huỷ trong tài khoản, hoặc không cần đăng nhập ở `/cancel` (link ở footer mọi trang); không bắt nêu lý do, email xác nhận ngay. Copy neo: "Cancel in one step, anytime." · basis RS·F-11 · F-24 · P-03 · BR-APP-04 · Q-25 | khối giá tóm tắt · FAQ trang giá · `/help` · meta `/legal/subscriptions` |
| 5 | **Câu trả lời riêng tư.** Không pixel quảng cáo; analytics chỉ sau consent; câu trả lời, điểm, type kết quả không bao giờ tới analytics hay quảng cáo; tự xoá kết quả bất kỳ lúc nào, tải toàn bộ dữ liệu khi có tài khoản miễn phí (Q-28). Copy neo: "Your answers never go to advertisers." · basis RS·F-02 · F-13 · P-05 · BR-APP-05 · BR-APP-11 · TD-04 · Q-28 | khối tin cậy · consent banner · meta `/` · `/legal/privacy` · FAQ |
| 6 | **Độ dài thật.** Bài 20–40 câu, ghi đúng số câu + thời gian median thật trước khi bắt đầu. Copy neo: "Every test shows its real length before you start." · basis RS·F-15 · P-06 · final-features §1 | lưới bài nổi bật · thẻ bài · meta `/tests` · title `/tests/:slug` |
| 7 | **Từ kết quả tới thói quen.** Check-in hằng ngày + streak (mọi tài khoản); thử thách 30 ngày theo kết quả (Plus). Copy neo: "A 30-day challenge built from your results." · basis RS·F-21 · P-07 · Q-15 | thẻ Plus + bảng so sánh ở trang giá · dashboard |
| 8 | **Bài sức khoẻ tinh thần có bảo vệ.** Tên bài trung thực + "Not a diagnosis", consent riêng trước câu 1, nguồn hỗ trợ, không analytics trên route đó. Copy neo: "This is a self-reflection tool, not a diagnosis." · basis Q-06 · BR-APP-06 · RS·F-04 · final-features §5 | trang bài `sensitive` · FAQ · disclaimer footer. **Không** dùng làm thông điệp quảng cáo hay OG của landing (§2) |
| 9 | **Đổi ý thì được hoàn tiền.** Rút trong 14 ngày được hoàn toàn bộ, không hỏi lý do (report lẻ, lần thanh toán đầu của Plus, mỗi lần gia hạn năm); link "Withdraw from contract here" ở mọi trang. Copy neo: "Changed your mind? Withdraw within 14 days for a full refund." · basis Q-18 · Q-25 · BR-APP-14 · web-evidence F-42 | trang giá (gần nút mua) · trang mở khoá · FAQ "Can I get a refund?" · email biên nhận |

## 2. ICP & kênh

| ICP (research-synthesis §U) | Muốn gì | Bài dẫn vào | Kênh | Quy tắc |
|---|---|---|---|---|
| U1 · Người tò mò `[INFERRED]` | hiểu bản thân nhanh, rõ, chia sẻ được (P-01) | tính cách (Big Five) · kiểu gắn bó · love style | SEO trang bài → chia sẻ link trang bài | ICP chính lúc ra mắt |
| U3 · Người phát triển sự nghiệp `[INFERRED]` | biết điểm mạnh, nghề hợp | sở thích nghề nghiệp · điểm mạnh | SEO trang bài | chỉ từ khoá chung, không thương hiệu bên thứ ba (Q-07) |
| U2 · Người đang tìm lời giải `[INFERRED]` | hiểu điều mình đang trải qua + hướng đi tiếp; nhạy cảm cao | bài wellbeing (`sensitive`) | CHỈ organic (SEO với tên bài trung thực) | không ads, không retarget, không dùng việc đã làm bài `sensitive` làm tín hiệu marketing (BR-APP-05 · BR-APP-06 · Q-06) |

| Kênh | Giai đoạn | Vì sao | Ràng buộc | Neo đối thủ (RS·F) |
|---|---|---|---|---|
| SEO — trang từng bài `/tests/:slug` (SCR-PUB-03) + `/tests` + `/help` | Ra mắt · ưu tiên số 1 | U1 / U3 vào từ search; mỗi bài một trang đích có tên + số câu thật; SEO kỹ thuật của đối thủ yếu → khoảng trống | route public render phía server / tĩnh (Q-09); tên bài trung thực (Q-06); không thương hiệu bên thứ ba (Q-07); đo kênh bằng `open_from` của `screen_active` (chỉ sau consent, không đo route `sensitive`) | 25 trang `/free-tests/<slug>`, không OG / hreflang / JSON-LD, sitemap 403 với crawler không-JS — RS·F-04 · F-27 `[LIVE:browser · EV-TLW-052 · EV-TLW-015 · EV-TLW-001]` |
| Chia sẻ link (organic social) | Sau ra mắt | ảnh OG 1200×630 cho mọi route index (`seo-meta.md`) giúp link trang bài hiển thị tốt khi chia sẻ | chỉ chia sẻ trang bài; trang kết quả công khai ngoài scope MVP (final-features §8); không chia sẻ điểm / câu trả lời | đối thủ không có OG `[LIVE:browser · EV-TLW-015]` |
| Email vòng đời | Sau khi user có tài khoản | email giao dịch (API-MAIL-01…08) luôn gửi; email sản phẩm mặc định tắt (SCR-ACC-01) | không nhắm nội dung theo kết quả bài `sensitive`; không email marketing khi user chưa bật | dấu vết công cụ email marketing `[INFERRED]` · EV-TLW-254 |
| Quảng cáo trả phí (search / social) | Không có trong MVP (Q-12); chỉ xét sau khi đã có số funnel organic | tăng tốc khi đã biết tỉ lệ chuyển đổi thật | (a) không pixel phía client; nếu có thì conversion API phía server chỉ cho event mua, không kèm thông tin bài, chỉ sau consent marketing, không khi có GPC (Q-12 · Q-20 · TD-04); (b) KHÔNG nhắm theo tình trạng sức khoẻ, KHÔNG mua từ khoá hay chạy ads cho bài `sensitive`, copy ads không được ngụ ý biết thuộc tính cá nhân của người xem; (c) chính sách quảng cáo về sức khoẻ / dữ liệu nhạy cảm của từng nền tảng là **ràng buộc vận hành** — đọc bản hiện hành trước mỗi chiến dịch; tài liệu này không đưa kết luận pháp lý | Meta Pixel · Bing UET · Google Ads conversion chạy từ lần đầu, ~2 event Meta Pixel mỗi câu trả lời, không cookie banner — RS·F-02 · F-13 `[LIVE:browser · EV-TLW-002 · EV-TLW-059]` |
| Launch site / cộng đồng (vd Product Hunt) | Tuỳ chọn, một lần, sau khi §6 đạt | phản hồi sớm + backlink `[INFERRED]` | không dùng claim "science-backed" / "clinically validated" (landing-copy §2) | không quan sát (n = 1) |
| App store | N/A — sản phẩm chỉ có web; app iOS / Android sau PMF (final-features §8) | — | — | đối thủ không có app `[LIVE:browser · EV-TLW-014]` |

## 3. Keyword clusters

> Priority = thứ tự đề xuất theo persona + catalog đối thủ; **chưa có số liệu search volume / độ khó** `[INFERRED]`. Slug là ví dụ; catalog bài chốt ở Q-07.

| Cluster | Keyword | Intent | Route đích | Evidence (RS·F) | Priority |
|---|---|---|---|---|---|
| Personality | "big five personality test" | transactional (làm bài ngay) | `/tests/big-five-personality-test` | đối thủ có "Big 5 Test" + "OCEAN Test" `[LIVE:browser · EV-TLW-051]`; item bank public domain (IPIP) theo Q-07 | P0 |
| Personality | "free personality test" | transactional | `/tests/big-five-personality-test` (phụ: `/`) | U1 · research-synthesis §U `[INFERRED]`; đối thủ dùng chữ "free" ở funnel SEO — RS·F-04 | P0 |
| Personality | "big five personality traits explained" | informational | `/tests/big-five-personality-test` (FAQ + "How scoring works") | kết quả có giải thích là khác biệt — RS·F-14 · P-04 | P1 |
| Relationships | "attachment style test" | transactional | `/tests/attachment-style-test` | "Attachment Style Test" `[LIVE:browser · EV-TLW-051]` | P0 |
| Relationships | "love style test" | transactional | `/tests/love-style-test` | "Love Style Test" `[LIVE:browser · EV-TLW-051]`; KHÔNG dùng "love language(s)" (Q-07) | P1 |
| Career | "career interest test" | transactional | `/tests/career-interest-test` | "Career Test" `[LIVE:browser · EV-TLW-051]`; RIASEC tự soạn, O*NET chỉ khi license cho phép (Q-07) | P0 |
| Career | "holland code test" · "riasec test" | transactional | `/tests/career-interest-test` | cùng bài, thuật ngữ học thuật chung; license (Q-07) | P1 |
| Career | "strengths test" | transactional | `/tests/strengths-test` | đối thủ đặt tên "Strengths Finder Test" `[LIVE:browser · EV-TLW-051]` — sát thương hiệu bên thứ ba; mình dùng từ chung (Q-07) | P1 |
| Emotional skills | "emotional intelligence test" | transactional | `/tests/emotional-intelligence-test` | "EQ test" `[LIVE:browser · EV-TLW-051]`; thang tự soạn (Q-07) | P2 |
| Library hub | "personality tests" · "relationship tests" · "career tests" | commercial (duyệt nhiều bài) | `/tests?topic=[topic]` (trang chủ đề, seo-meta §1) | đối thủ gom chủ đề "Personality" · "Career" · "Love Styles" trên landing `[LIVE:browser · EV-TLW-014]` | P1 |
| Wellbeing (`sensitive`) | "anxiety test" | self-check / informational | `/tests/anxiety-test` | đối thủ nhắm từ khoá lâm sàng bằng slug nhưng tên hiển thị "mềm" — RS·F-04 `[LIVE:browser · EV-TLW-052]`; mình: tên trung thực + "Not a diagnosis" (Q-06) | P1 · **sensitive — không chạy ads** |
| Wellbeing (`sensitive`) | "depression test" | self-check / informational | `/tests/depression-test` | như trên; thang tự phản chiếu tự soạn, clinician review, không PHQ-9, không nhãn chẩn đoán (Q-07) | P2 · **sensitive — không chạy ads** |
| Wellbeing (`sensitive`) | "stress level test" · "burnout test" | self-check | `/tests/stress-level-test` · `/tests/burnout-test` | như trên; U2 · research-synthesis §U `[INFERRED]` | P2 · **sensitive — không chạy ads** |
| Brand | "[brand]" (Q-01: "TestLib" chỉ là tên làm việc; brand thật do human chọn) | navigational | `/` | Q-01 | P0 (sau khi có brand) |
| Brand · hỗ trợ | "[brand] cancel subscription" · "[brand] refund" | navigational | `/cancel` (SCR-PAY-05, index: huỷ / rút không cần đăng nhập) + `/help` + `/legal/subscriptions` | người dùng đối thủ phàn nàn khó huỷ / khó hoàn tiền — P-03 · RS·F-11 · web-evidence F-42; mình cho huỷ / rút ngay trên trang đích | P1 |
| Brand · giá | "TestLib pricing" | commercial | `/pricing` | Q-02 · Q-03 | P1 |

**Không nhắm** (negative list — áp cho SEO, copy và ads):

| Loại | Ví dụ | Vì sao | Basis |
|---|---|---|---|
| Thương hiệu bên thứ ba | "MBTI" · "Myers-Briggs" · "16Personalities" · "CliftonStrengths" · "StrengthsFinder" · "DiSC" · "5 Love Languages" · tên type Enneagram hệ Riso-Hudson (vd "The Reformer") | không dùng ở title, meta, slug, copy, từ khoá ads — kể cả dạng "… alternative" / "free …"; riêng chữ "Enneagram" chung để legal review quyết | Q-07 |
| Nhãn rối loạn nhân cách / gắn nhãn người khác | "narcissist test" · "sociopath test" · "bpd test" · "is my partner a narcissist" | dễ thành tự chẩn đoán hoặc gắn nhãn người thứ ba; ngoài catalog MVP | đối thủ nhắm `narcissist-test` · `bpd-test` · `sociopath-test` — RS·F-04 `[LIVE:browser · EV-TLW-052]` · Q-06 |
| Hứa chẩn đoán | "do I have [condition]" · "diagnose [condition] online" | sản phẩm không chẩn đoán; copy phải khớp disclaimer | Q-06 · legal-extract §9.12 |
| Ngoài scope | "IQ test" | engine khác, rủi ro "IQ" | final-features §8 · RS·F-25 |

## 4. Landing structure

Thứ tự neo consensus đối thủ (hero → carousel bài → chủ đề → 3 bước → lợi ích → FAQ → footer — research-synthesis §G `[LIVE:browser · EV-TLW-013]`), nhưng mọi CTA dẫn tới làm bài thay vì trang giá (RS·F-03). Header là shell chung (SYS-NAV §1), không liệt kê ở đây.

| # | Section | Mục đích | Copy source |
|---|---|---|---|
| 1 | Hero — SCR-PUB-01 CMP-02 | nói giá trị cốt lõi trong một màn hình; CTA chính "Take a free test" → `/tests` (không tới trang giá) | §1 #1 · #2 · #3 → landing-copy "Hero" |
| 2 | Bài nổi bật — CMP-03 | 6 thẻ với số câu + thời gian thật; nhãn "Wellbeing · Not a diagnosis" cho bài `sensitive` | §1 #6 · #8 → landing-copy "Featured tests" |
| 3 | How it works — CMP-04 | 3 bước; bước 3 nói rõ trả phí là tuỳ chọn | §1 #1 · #2 → landing-copy "How it works" |
| 4 | Giá tóm tắt — CMP-05 | nói free vs trả phí + gia hạn / huỷ trước khi user phải hỏi; link "See pricing" | §1 #2 · #3 · #4 → landing-copy "Pricing teaser" |
| 5 | Khối tin cậy — CMP-06 | riêng tư + cách chấm điểm; link "How we score" → `/help#scoring` | §1 #1 · #5 · #8 → landing-copy "Trust block" |
| 6 | FAQ — **chưa có CMP ở SCR-PUB-01 (đề xuất chèn giữa CMP-06 và CMP-07)** | trả lời 6 câu hay hỏi: free? · chấm điểm? · chẩn đoán? · tài khoản? · dữ liệu? · gia hạn / huỷ? | §1 #1 · #2 · #3 · #4 · #5 · #8 → landing-copy "FAQ" |
| 7 | Footer — CMP-07 | link pháp lý + "Cookie settings" + "Cancel your plan here" · "Withdraw from contract here" (BR-APP-04 · BR-APP-14), disclaimer không-chẩn-đoán, pháp nhân (Q-05) | §1 #8 → landing-copy "Footer" · legal-consent §4 |

## 5. Locales

| Locale | Có trang riêng? (hreflang) | Ghi chú |
|---|---|---|
| en-US | locale duy nhất ở MVP; URL không prefix; **không** thẻ hreflang (chỉ cần khi có locale thứ hai) | Q-14 · tieu-chuan-chung §8 · tiền USD theo planKey (BR-APP-12) |
| Locale thứ hai (xét sau 60 ngày có dữ liệu, Q-14) | khi thêm: path prefix (vd `/de/`) + hreflang đủ cặp + `x-default` → en-US; sitemap thêm alternate cho từng URL | điều khoản giá, gia hạn, huỷ và tên gói PHẢI dịch cùng UI (đối thủ để dòng gia hạn + tên gói tiếng Anh ở `/de/pricing` — RS·F-07 `[LIVE:browser · EV-TLW-028]`); không đổi currency theo IP ở client (BR-APP-12); văn bản pháp lý dịch có legal review (Q-05) |

## 6. Pre-launch checklist

| # | Hạng mục | Đạt khi | Nguồn / chặn bởi |
|---|---|---|---|
| 1 | Domain + HTTPS | tên + domain đã chốt; HTTPS mọi route, HTTP → 301 sang HTTPS, bật HSTS; canonical + sitemap dùng đúng domain | Q-01 |
| 2 | Robots / sitemap submit | `web/robots.txt` + `web/sitemap.xml` đã thay `<domain>`; sitemap chỉ chứa route index (`seo-meta.md`); đã submit ở Google Search Console + Bing Webmaster Tools; fetch không-JS trả 200 (đối thủ trả 403 — RS·F-27) | `seo-meta.md` · `web/README.txt` |
| 3 | Render cho crawler | `curl` (không JS) mọi route index thấy đủ title / description / canonical / OG + nội dung chính | Q-09 · tieu-chuan-chung §8 |
| 4 | OG preview test | mọi route index có ảnh 1200×630; kiểm bằng công cụ xem trước chia sẻ của các mạng xã hội; bài `sensitive` dùng ảnh trung tính, không hiện điểm | `seo-meta.md` §2 |
| 5 | 404 / 500 | đúng HTTP status (không soft-404), có nội dung + link về thư viện bài, `noindex` | tieu-chuan-chung §8 |
| 6 | Favicon + manifest | favicon + icon 192 / 512 (+ maskable) đúng đường dẫn; `manifest.webmanifest` đã thay tên (Q-01) + màu (FND-tokens · Q-17) | `web/README.txt` |
| 7 | Consent banner | hiện ở mọi vùng; "Reject all" ngang hàng "Accept all"; mặc định tắt; không chặn nội dung | legal-consent §3 · GC-ConsentBanner · Q-13 |
| 8 | Analytics sau consent | trước khi chọn và sau "Reject all": 0 request bên thứ ba, không cookie `_ga*`, không IndexedDB Firebase; route bài `sensitive`: 0 kể cả khi đã "Accept all" | tieu-chuan-chung §9–10 · BR-APP-05 · BR-APP-06 · TD-04 |
| 9 | Perf budget | trên staging: LCP ≤ 2,5 s (390, 4G) · CLS ≤ 0,05 · INP ≤ 200 ms · JS ban đầu ≤ 200 KB cho route public | tieu-chuan-chung §9 |
| 10 | Văn bản pháp lý + pháp nhân | 4 trang `/legal/:doc` + khối liên hệ pháp nhân đã legal review, có ngày cập nhật + version | legal-consent §4 · Q-05 · Q-18 |
| 11 | Giá thật | giá đã chốt ở `00-overview §2` (Q-03); price id Paddle điền cho cả 3 planKey; checkout thử thật thấy đúng giá, thuế, câu reseller và chuỗi trên sao kê; trang giá không còn "[price]" lộ ra | Q-03 · Q-04 · Q-24 · `bang-quyet-dinh` §2 #3 |
| 12 | Huỷ / rút không cần đăng nhập | `/cancel` chạy với email + mã đơn thật (sandbox Paddle): huỷ cuối kỳ, rút → hoàn toàn bộ + mất quyền ngay; email xác nhận có ngày giờ; link ở footer mọi trang, kể cả funnel | BR-APP-04 · BR-APP-14 · Q-25 |
| 13 | GPC | trình duyệt bật GPC: không banner, 0 request analytics, bản ghi consent `source = gpc` | Q-20 · SYS-CONSENT |
| 14 | Nguồn hỗ trợ khủng hoảng | từng số / website ở GC-SensitiveNotice §4 đã verify + clinical review ký | Q-23 · `bang-quyet-dinh` §2 #4 |

## 7. AI Notices
- Priority ở §3 không dựa trên số liệu search volume / độ khó (chưa đo) `[INFERRED]`; phải chạy keyword research trước khi viết nội dung. Slug là ví dụ, catalog chốt ở Q-07.
- ICP §2 là persona suy luận `[INFERRED]` (research-synthesis §U); n = 1 đối thủ; nhánh freemium dẫn đầu category chưa được drive (00-applications-list §2, `[LIVE:web]`).
- Từ khoá wellbeing: trang kết quả tìm kiếm thường do tổ chức y tế chiếm và nội dung sức khoẻ bị soi chất lượng kỹ hơn `[INFERRED]` → cần chuyên gia duyệt nội dung. Route `sensitive` không có analytics (BR-APP-06) nên hiệu quả SEO của nhóm này chỉ đo được bằng Search Console (số liệu gộp).
- Nội dung về chính sách quảng cáo ở §2 là hiểu biết của AI, không phải kết luận pháp lý; verify bản hiện hành của từng nền tảng trước khi chạy ads.
- "science-based" trong hero: Q-07 đã chốt nguồn (IPIP cho Big Five); chỉ dùng chữ này cho bài dựng trên thang đã kiểm định, không cho bài tự soạn (xem landing-copy §1).
- FAQ landing (§4 #6) chưa có CMP trong blueprint SCR-PUB-01 → writer SCR-PUB-01 cần thêm.
