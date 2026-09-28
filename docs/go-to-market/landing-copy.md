# landing-copy — TestLib (tên tạm, Q-01) · copy VERBATIM trang chủ `/` (SCR-PUB-01)
> Thứ tự section theo `00-gtm-strategy.md` §4. Copy en-US (Q-14); chuỗi trùng blueprint SCR-PUB-01 giữ nguyên từng chữ. `[n]` / `[m]` / `[...]` = giá trị lấy từ API hoặc quyết định còn mở, không hard-code. Claim chỉ dùng khi có basis (§2).
**Changelog** (mới nhất trước)
- 2026-09-27 · v1.1 · claude-opus-5-5 · đồng bộ câu phụ hero với SCR-PUB-01 (bỏ "science-based").
- 2026-09-27 · v1 · claude (subagent) · khởi tạo.

## 1. Copy theo section

| Section | Element | Copy VERBATIM (en) | Basis (§1 value prop · RS·F) |
|---|---|---|---|
| Hero · CMP-02 | H1 | "Understand yourself — with tests that are actually scored" | §1 #1 · RS·F-14 · BR-APP-07 (trùng blueprint) |
| Hero · CMP-02 | Sub | "Free tests, scored from your answers. Every score explained. No surprise charges." | §1 #1 · #2 · #3 · RS·F-14 (đổi từ bản blueprint: bỏ "science-based" tới khi Q-07 chốt nguồn thang đo; "Every score explained" thay "Your full results, explained" để không bị hiểu là report trả phí) |
| Hero · CMP-02 | CTA chính → `/tests` | "Take a free test" | §1 #2 · RS·F-03 (đối thủ: mọi CTA thẻ bài dẫn tới `/pricing` `[LIVE:browser · EV-TLW-012]`) |
| Hero · CMP-02 | Ghi chú dưới CTA | "No sign-up needed." | Q-11 · SYS-AUTH (khách làm bài + xem tóm tắt không cần tài khoản) |
| Featured tests · CMP-03 | Heading | "Featured tests" | §1 #6 (không dùng "Popular" / "Most taken" khi chưa có số liệu) |
| Featured tests · CMP-03 | Sub | "Every test shows its real length before you start." | §1 #6 · RS·F-15 · P-06 (đối thủ ghi "100 questions · 20 mins" cho gần như mọi bài `[LIVE:browser · EV-TLW-014]`) |
| Featured tests · CMP-03 | Meta trên thẻ | "[n] questions" · "About [m] min" · "Free summary" | §1 #6 · số từ API-CAT-01 (median thời gian thật — tieu-chuan-chung §4) |
| Featured tests · CMP-03 | Nhãn thẻ bài `sensitive` | "Wellbeing · Not a diagnosis" | §1 #8 · Q-06 |
| Featured tests · CMP-03 | Nút trên thẻ | "Start test" | §1 #2 (trùng blueprint) |
| Featured tests · CMP-03 | Empty | "Browse all tests" | SCR-PUB-01 §4 Empty (trùng blueprint) |
| Featured tests · CMP-03 | Error | "We couldn't load tests. Try again." | SCR-PUB-01 §4 Error · API-CAT-01 (trùng blueprint) |
| How it works · CMP-04 | Heading | "How it works" | §1 #1 · #2 |
| How it works · CMP-04 | Bước 1 | "Answer honestly" | §1 #1 (trùng blueprint) |
| How it works · CMP-04 | Bước 1 — mô tả | "One question at a time. Your progress is saved on this device, even if you go offline." | §1 #6 · TD-01 · cong-nghe-loi §3 |
| How it works · CMP-04 | Bước 2 | "See your scored summary — free" | §1 #1 · #2 (trùng blueprint) |
| How it works · CMP-04 | Bước 2 — mô tả | "Every score, with a short explanation of why you got it." | §1 #1 · RS·F-14 · P-04 |
| How it works · CMP-04 | Bước 3 | "Unlock the full report if you want it" | §1 #2 · Q-02 (trùng blueprint) |
| How it works · CMP-04 | Bước 3 — mô tả | "Pay once for one report, or choose Plus for all of them. You'll see the full price and renewal terms before you pay." | §1 #3 · BR-APP-02 · RS·F-17 |
| Pricing teaser · CMP-05 | Heading | "Free summaries. Pay only for full reports." | §1 #2 · Q-02 (trùng blueprint) |
| Pricing teaser · CMP-05 | Text | "Plus renews automatically, and we email you before it does. Cancel in one step, anytime." | §1 #3 · #4 · BR-APP-03 · BR-APP-04 · mốc nhắc theo Q-16 |
| Pricing teaser · CMP-05 | Giá | — (landing không hiện giá; placeholder — Q-03) | 00-overview §2 · nếu sau này hiện giá thì lấy từ API-PAY-01, không hard-code |
| Pricing teaser · CMP-05 | Link → `/pricing` | "See pricing" | §1 #2 (trùng blueprint) |
| Trust block · CMP-06 | Heading | "What you can count on" | §1 #5 |
| Trust block · CMP-06 | Dòng 1 | "Your answers never go to advertisers." | §1 #5 · BR-APP-05 · TD-04 (trùng blueprint) · đối thủ bắn ~2 event Meta Pixel mỗi câu trả lời — RS·F-13 `[LIVE:browser · EV-TLW-059]` |
| Trust block · CMP-06 | Dòng 2 | "No ad pixels. Analytics only if you say yes." | §1 #5 · Q-12 · SYS-CONSENT — đúng khi Q-12 giữ đề xuất "không pixel phía client" |
| Trust block · CMP-06 | Dòng 3 | "Scores come from your answers, using a fixed method you can read." | §1 #1 · BR-APP-07 |
| Trust block · CMP-06 | Dòng 4 | "Download or delete your data anytime." | §1 #5 · BR-APP-11 |
| Trust block · CMP-06 | Dòng 5 | "Wellbeing tests are for self-reflection, not diagnosis, and show where to get support." | §1 #8 · Q-06 · BR-APP-06 |
| Trust block · CMP-06 | Link → `/help#scoring` | "How we score" | §1 #1 · RS·F-14 (trùng blueprint) |
| FAQ (đề xuất — chưa có CMP) | Heading | "Questions, answered" | 00-gtm-strategy §4 #6 |
| FAQ | Q1 | "Is it really free?" | §1 #2 |
| FAQ | A1 | "Yes. Every test and its scored summary are free. You only pay if you want a full report — once for a single result, or with a Plus subscription." | §1 #2 · Q-02 · 00-overview §2 |
| FAQ | Q2 | "How are the tests scored?" | §1 #1 |
| FAQ | A2 | "Your answers are scored on our servers with a fixed, versioned method, so the same answers always give the same result. Each score comes with a short explanation." | §1 #1 · BR-APP-07 · TD-01 |
| FAQ | Q3 | "Can a test tell me if I have a mental health condition?" | §1 #8 |
| FAQ | A3 | "No. Our tests are for self-reflection and learning, not diagnosis. Wellbeing tests show where to get support, and if you're worried about how you feel, please talk to a health professional." | §1 #8 · Q-06 · BR-APP-06 |
| FAQ | Q4 | "Do I need an account?" | Q-11 |
| FAQ | A4 | "No. You can take tests and see your summary without signing up. To keep a result, save it with your email and we'll send you a sign-in link. Unsaved results are deleted after 30 days." | Q-11 · SYS-AUTH · BR-APP-08 (30 ngày = đề xuất Q-05) |
| FAQ | Q5 | "What happens to my answers?" | §1 #5 |
| FAQ | A5 | "We store them to score your test and show your results. We never send them to advertisers or analytics tools, and you can download or delete your data anytime." | §1 #5 · BR-APP-05 · BR-APP-11 · cong-nghe-loi §4 |
| FAQ | Q6 | "How do renewals and cancellation work?" | §1 #3 · #4 |
| FAQ | A6 | "Plus renews automatically at the price shown before you buy. We email you before each renewal, and you can cancel in one step from your account. You keep Plus until the end of the period you paid for." | §1 #3 · #4 · BR-APP-02 · BR-APP-03 · BR-APP-04 · Q-16 — khớp pricing-page §4 |
| Footer · CMP-07 | Link | "Privacy" · "Terms" · "Subscriptions & refunds" · "Cookie policy" · "Cookie settings" · "Help" | trùng GC-SiteFooter (variant `full`) · SYS-NAV §1 |
| Footer · CMP-07 | Disclaimer | "Our tests are for self-reflection and education. They are not a medical or psychological diagnosis." | trùng GC-SiteFooter · §1 #8 · Q-06 · tránh mâu thuẫn kiểu đối thủ: disclaimer "not clinical" nhưng landing dùng copy lâm sàng (legal-extract §9.12 `[LIVE:browser · EV-TLW-014]`) |
| Footer · CMP-07 | Dòng pháp nhân | "© [year] [legal entity] · [registered address] · support@[domain]" | trùng GC-SiteFooter · Q-05 · Q-01 · khác đối thủ chỉ ghi tên thương hiệu, pháp nhân phân tán (RS·F-12) |

## 2. Quy tắc claim — không viết

| Không viết | Vì sao | Basis |
|---|---|---|
| "science-backed" · "scientifically proven" · "science-based" khi chưa có basis | cần nguồn thang đo đã kiểm định cho đúng bài đó; basis ghi cạnh copy | Q-07 |
| "clinically validated" · "diagnose" · "detect [condition]" · "find out if you have …" | sản phẩm không chẩn đoán; marketing phải khớp disclaimer | Q-06 · legal-extract §9.12 (đối thủ: copy lâm sàng ở landing cạnh câu "not clinical tools" `[LIVE:browser · EV-TLW-014 · EV-TLW-043]`) |
| "most accurate" · "100% accurate" | không có số đo độ chính xác | in-house |
| "Trusted by [N] users" · "Rated [x] out of 5" · logo "featured in" · testimonial gắn nhãn "VERIFIED" | không có số liệu / không kiểm chứng được | RS·F-16 · F-17 `[LIVE:browser · EV-TLW-106 · EV-TLW-109]` |
| "[N]-page report" khi chưa đo PDF thật | đối thủ hứa "20-page report", PDF thật 11 trang | RS·F-23 `[LIVE:browser · EV-TLW-109 · EV-TLW-261]` |
| đồng hồ đếm ngược · "Offer ends soon" · "[Name] just bought" | gấp giả, social proof không kiểm chứng | RS·F-17 · final-features §4 |
| "free results" / "free report" cho thứ phải trả tiền | chỉ nói "free test" · "free summary"; report đầy đủ là trả phí | Q-02 · đối thủ: "kết quả" free rồi upsell "Start Complete Test — $1.95" `[LIVE:browser · EV-TLW-079]` |
| "Analyzing your profile…" và mọi loader giả | labor illusion | RS·F-16 · tieu-chuan-chung §3 |
| tên thương hiệu bên thứ ba ("MBTI", "16Personalities", "CliftonStrengths", "DiSC", "5 Love Languages") | thương hiệu của bên khác | Q-07 · 00-gtm-strategy §3 |

## 3. AI Notices
- Chuỗi MỚI so với blueprint SCR-PUB-01 (writer SCR-PUB-01 phải thêm vào bảng component): ghi chú dưới CTA, heading + sub của bài nổi bật, meta + nhãn `sensitive` trên thẻ, mô tả 3 bước, text của giá tóm tắt, heading + dòng 2–5 của khối tin cậy, toàn bộ FAQ (cần CMP mới). Footer lấy nguyên văn GC-SiteFooter (có link "Help" mà SYS-NAV §1 chưa liệt kê ở footer → SYS-NAV cần bổ sung).
- Câu phụ hero đã đổi theo đề xuất review: bỏ "science-based" (chờ Q-07) và "Your full results, explained" → "Every score explained" (đã đồng bộ với SCR-PUB-01 CMP-02).
- A4 ("30 days") theo BR-APP-08 (đề xuất Q-05); A6 và text giá tóm tắt phụ thuộc Q-16. Landing không nói về hoàn tiền vì Q-18 còn mở.
- Dòng 2 khối tin cậy ("No ad pixels…") phải sửa nếu Q-12 thêm bất kỳ script quảng cáo nào phía client.
