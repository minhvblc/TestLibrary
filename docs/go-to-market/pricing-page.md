# pricing-page — TestLib (tên tạm, Q-01) · trang giá `/pricing` (SCR-PUB-04)
> Giá CITE `00-overview §2` (Q-03: `report.single` $9.99 · `plan.plus.monthly` $12.99 / month · `plan.plus.annual` $69.99 / year; USD, chưa gồm thuế), không định nghĩa lại ở đây. Copy dùng token `[price]`, màn lấy số từ API-PAY-01; số trong ngoặc "(= …)" chỉ để người đọc đối chiếu. Copy en-US verbatim (Q-14); chuỗi đã có ở SCR-PUB-04 giữ nguyên từng chữ. FAQ §4 phải khớp landing-copy (FAQ A6) · FAQ `/help` (SCR-PUB-06) · legal-consent §3c · `/legal/subscriptions`.
**Changelog** (mới nhất trước)
- 2026-09-28 · v1.3 · claude-opus-5-5 · theo quyết định 2026-09-28: giá thật cite 00-overview §2 (Q-03), "Save 55%" + dòng phụ quy đổi tháng, bỏ "Priority support"; câu reseller Paddle (Q-04), dòng tên trên sao kê (Q-24), dòng rút 14 ngày (Q-18 · Q-25); FAQ theo Q-16 · Q-18 · Q-24 · Q-27 (thêm "What will I see on my statement?", "How do I cancel?" thêm huỷ không cần đăng nhập); cột Trạng thái ghi basis đã chốt.
- 2026-09-28 · v1.2 · claude-opus-5-5 · D-09: câu công bố gia hạn trước khi mua lấy nguyên văn GC-RenewalDisclosure §2 `pre-purchase` · Plus.
- 2026-09-28 · v1.1 · claude-opus-5-5 · AI Notice: FAQ gia hạn lệch luật CA / NY (Q-26) và quy tắc đổi giá.
- 2026-09-27 · v1 · claude (subagent) · khởi tạo.

## 1. Plan cards

Đầu trang (trùng SCR-PUB-04 CMP-02): H1 "Simple, honest pricing" · sub "Every test and summary is free. Pay only if you want the full report." Thứ tự thẻ Free → One report → Plus ở mọi viewport; không thẻ nào được làm nổi hơn thẻ khác (GC-PlanCard).

| Plan (planKey) | Headline | Bullet (feature thật) | CTA VERBATIM | Badge |
|---|---|---|---|---|
| Free (`plan.free`) | "Free" · dòng giá "No payment needed" (giá 0 · basis Q-02 · 00-overview §2) | "Take every test" · "A scored summary for every test, with every score explained" · "Save your results with your email" · "Daily check-in and streak with a free account" | "Take a free test" → `/tests` | — |
| One report (`report.single`) | "One report" · "[price] one-time" (= $9.99 · 00-overview §2) | một dòng thay bullet: "Full report and PDF for one test result. Never renews." · khi đã có Plus thêm: "Included in your Plus plan." | "Take a test to unlock" → `/tests` (mua ở SCR-PAY-01, gắn với một kết quả) | — |
| Plus (`plan.plus.monthly` · `plan.plus.annual`) | "Plus" · "[price] per month" (= $12.99) hoặc "[price] per year" (= $69.99, kèm dòng phụ ở §2) theo toggle §2 (00-overview §2) | "Full reports and PDFs for every test you take, while your plan is active" · "A 30-day challenge built from your results" | chưa có Plus: "Continue to secure checkout" (khoá tới khi tick consent — BR-APP-03) · đã có Plus: "Manage plan" → `/account/billing` | — |

Badge: không thẻ nào có badge ("Most popular", "Best value", "-X%"…) — ba thẻ ngang hàng; việc Plus tự gia hạn được nói bằng GC-RenewalDisclosure, không bằng nhãn (SCR-PUB-04 · RS·F-18).

Dưới thẻ Plus và cuối trang:

| Element | Copy VERBATIM (en) | Basis |
|---|---|---|
| Công bố gia hạn (GC-RenewalDisclosure `pre-purchase` · Plus, nguyên văn — sửa ở GC trước) | "Plus renews automatically at [price] per [period] until you cancel." · "If you subscribe today, your next payment will be on [date]." · "Cancel anytime in Account → Plan & billing. You'll keep Plus until the end of the period you've paid for." · "We'll email you a reminder [n] days before each renewal." | BR-APP-02 · Q-16 (`[n]` = 7 với gói tháng, 21 với gói năm) · giá 00-overview §2 · GC-RenewalDisclosure §2 |
| Checkbox consent (mặc định KHÔNG tick) | "I understand Plus renews automatically at [price] per [period] until I cancel. I can cancel anytime in Account → Plan & billing." | BR-APP-03 (trùng SCR-PUB-04 CMP-06; `consent_version` gửi trong API-PAY-02) |
| Gợi ý khi chưa tick | "Tick the box above to continue." | BR-APP-03 (trùng SCR-PUB-04 CMP-07) |
| Dòng rút 14 ngày (ngay dưới nút "Continue to secure checkout") | "Changed your mind? Withdraw within 14 days for a full refund." | Q-18 · Q-25 · BR-APP-14 (trùng SCR-PUB-04 CMP-11 · SCR-PAY-01 CMP-11) |
| Dòng người bán (dưới nhóm thẻ) | "Our order process is conducted by our online reseller [merchantOfRecord]. [merchantOfRecord] is the Merchant of Record for all our orders. Taxes calculated at checkout." (`[merchantOfRecord]` = `seller.merchantOfRecord` của API-PAY-01, "Paddle.com") | Q-04 · Q-05 · BR-APP-12 (trùng SCR-PUB-04 CMP-12 · SCR-PAY-01 CMP-10) |
| Dòng sao kê (ngay sau dòng người bán) | "Charges will appear as [descriptor] on your statement." (`[descriptor]` = `statementDescriptor` của API-PAY-01; chưa cấu hình thì không hiện dòng này) | Q-24 · BR-APP-15 (trùng SCR-PUB-04 CMP-12 · SCR-PAY-01 CMP-10) |
| Link → `/legal/subscriptions` | "Subscription & refund terms" | RS·F-29 · F-30 |
| KHÔNG có trên trang | đồng hồ đếm ngược · "[Name] just bought" · giá gạch hoặc neo kiểu "-87%" · "Most popular" / "Best value" · logo "featured in" · testimonial không kiểm chứng · gói trả phí được chọn sẵn | RS·F-17 · F-18 `[LIVE:browser · EV-TLW-108 · EV-TLW-112]` |

## 2. Toggle chu kỳ

| Hạng mục | Quy tắc | Basis |
|---|---|---|
| Nhãn | "Monthly" · "Annual" — chỉ đổi thẻ Plus | SCR-PUB-04 CMP-04 |
| Mặc định | "Monthly" chọn sẵn (không mặc định cam kết dài hơn) | in-house · P-02 |
| Hiển thị giá năm | dòng chính là số tiền thật sẽ thu: "[price] per year" (= $69.99); quy đổi theo tháng chỉ là dòng phụ, nhỏ hơn: "[annual price ÷ 12] per month, billed yearly" (= "$5.83 per month, billed yearly"). Số quy đổi do server trả (`monthlyEquivalent` của API-PAY-01, làm tròn tới cent gần nhất), client không tự chia (BR-PUB-07) | tieu-chuan-chung §4 · BR-APP-02 · 00-overview §2 |
| Tiết kiệm của gói năm | nhãn "Save [n]%" cạnh "Annual", với n = làm tròn XUỐNG của (1 − giá năm ÷ (12 × giá tháng)) × 100; giá hiện hành: 1 − $69.99 ÷ $155.88 ≈ 0,551 → "Save 55%". Server tính (`savingsPercent`); n < 1 thì ẩn; không kèm giá gạch | 00-overview §2 · Q-03 · BR-PUB-09 · RS·F-18 |
| Khi đổi toggle | cập nhật giá, GC-RenewalDisclosure và câu consent theo chu kỳ mới; **bỏ tick** checkbox nếu đang tick (consent gắn với đúng một giá + chu kỳ) | BR-APP-03 |
| Đối thủ | chỉ một chu kỳ 4 tuần (13 kỳ/năm), không toggle, không gói năm | RS·F-05 `[LIVE:browser · EV-TLW-025 · 2026-09-27]` |

## 3. Bảng so sánh

Nhãn hàng trùng SCR-PUB-04 CMP-08 (đã đồng bộ, gồm cả hàng "Save results with your email", "Price" và cụm "while your plan is active").

| Feature | Free | One report | Plus |
|---|---|---|---|
| "Take every test" | ✓ | ✓ | ✓ |
| "Scored summary of every result" | ✓ | ✓ | ✓ |
| "Save results with your email" | ✓ | ✓ | ✓ |
| "Full report and PDF" | — | "One result" | "Every result, while your plan is active" |
| "30-day challenge" | — | — | ✓ |
| "Daily check-in and streak" | "With a free account" | "With a free account" | ✓ |
| "Renews automatically" | "No" | "No" | "Yes, until you cancel" |
| "Price" | "Free" | "[price] one-time" (= $9.99) | "[price] per month or [price] per year" (= $12.99 · $69.99 — 00-overview §2) |

Basis: quyền từng gói ở `00-overview §2` · SYS-ENTITLEMENT (`report.full`, `report.pdf`, `plus`, `challenge`, `checkin`).

## 4. FAQ (VERBATIM)

Tám câu, cùng thứ tự ở SCR-PUB-04 CMP-09. Cột "Trạng thái" ghi quyết định đã chốt mà câu trả lời dựa vào.

| Câu hỏi | Trả lời | Basis | Trạng thái |
|---|---|---|---|
| "How do I cancel?" | "Go to Account → Plan & billing and choose Cancel renewal. It's one step, and you don't have to tell us why. Not signed in? Use “Cancel your plan here” at the bottom of any page, with the email address and order number from your receipt. Either way, you keep Plus until the end of the period you've paid for, and we email you a confirmation right away." | BR-APP-04 · API-MAIL-04 · SCR-PAY-05 (API-PAY-09) | chốt — Q-18 (a) · Q-25 (d) · BR-APP-04 |
| "Can I get a refund?" | "Yes. Withdraw within 14 days of buying a report, starting a Plus plan or an annual renewal, and we'll refund the full amount — no questions asked. Use “Withdraw from contract here” at the bottom of any page, or Account → Plan & billing. Monthly renewals aren't refunded, but you can cancel anytime and keep Plus until the end of the month you've paid for." | BR-APP-14 · SCR-PAY-05 (API-PAY-08) · API-MAIL-11 | chốt — Q-18 · Q-25 · BR-APP-14 |
| "Are taxes included?" | "Prices are shown in US dollars before tax. Our reseller, Paddle, adds any sales tax or VAT that applies where you live and shows the total before you pay." | BR-APP-12 | chốt — Q-03 · Q-04 (giá chưa gồm thuế, Paddle tính ở checkout) |
| "When will I be charged again?" | "Plus renews automatically at the end of each billing period, at the price you signed up for. If our prices change, yours stays the same for as long as your plan continues. We email you before every renewal: 21 days before an annual renewal and 7 days before a monthly one, with the amount, the date and a link to cancel. Your next charge date is always in Account → Plan & billing." | BR-APP-02 · BR-APP-03 · API-MAIL-03 | chốt — Q-16 · Q-27 · BR-APP-13 |
| "What will I see on my statement?" | "Charges will appear as [descriptor] on your statement. Paddle.com is our reseller and the Merchant of Record for all our orders." | BR-APP-15 · Q-04 · `[descriptor]` = `statementDescriptor` (API-PAY-01) | chốt — Q-24 · BR-APP-15; chuỗi thật lấy từ giao dịch thử khi mở tài khoản Paddle (bang-quyet-dinh §2 #3) |
| "What happens to my reports if I cancel?" | "Reports you unlocked one at a time are yours to keep. Reports you read with Plus stay available until your plan ends; after that, you can unlock any of them individually. Your test summaries always stay free." | SYS-ENTITLEMENT · BR-APP-04 | theo SYS-ENTITLEMENT |
| "Is there a free trial?" | "There's no trial, because every test and its scored summary are already free. You can see what a full report includes before you buy." | Q-03 | chốt — Q-03 (không trial) |
| "What if a renewal payment fails?" | "We'll email you and show a notice in Plan & billing so you can update your payment method. You keep Plus during a short grace period." | SYS-ENTITLEMENT · API-MAIL-05 | chốt — Q-04; thời gian ân hạn theo cấu hình Paddle, verify khi mở tài khoản (bang-quyet-dinh §2 #3) |

Link cuối FAQ: "Subscription & refund terms" → `/legal/subscriptions`. Đổi một trong Q-03 · Q-04 · Q-16 · Q-18 · Q-24 · Q-25 · Q-27 → sửa cùng lúc bảng này, landing-copy FAQ A6, FAQ `/help` (SCR-PUB-06), legal-consent §3c và `/legal/subscriptions`.

## 5. AI Notices
- Giá hiện hành ở `00-overview §2` (Q-03, chốt 2026-09-28). Copy chỉ dùng token `[price]` điền từ API-PAY-01; số "(= …)" ở §1–§3 để người đọc đối chiếu, không hard-code. Neo đối thủ chỉ để tham chiếu, không dùng trong copy: "One Time $57.00" · "$39.95 every 4 weeks" `[LIVE:browser · EV-TLW-025 · 2026-09-27]`.
- Câu reseller (dòng người bán) lấy theo câu Paddle yêu cầu: verify nguyên văn khi mở tài khoản Paddle. Chuỗi trên sao kê (`[descriptor]`) lấy từ giao dịch thử bằng thẻ, PayPal và ví; phí Paddle và thời gian ân hạn khi gia hạn thất bại cũng lấy từ tài khoản thật (bang-quyet-dinh §2 #3).
- Câu trả lời "How do I cancel?" thêm đường huỷ không cần đăng nhập (Q-18 (a) · Q-25 (d)); câu này do AI viết, FAQ `/help` (SCR-PUB-06) và `/legal/subscriptions` phải nói cùng ý.
