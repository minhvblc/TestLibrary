# pricing-page — TestLib (tên tạm, Q-01) · trang giá `/pricing` (SCR-PUB-04)
> Giá CITE `00-overview §2` (placeholder — Q-03), không định nghĩa lại ở đây; màn lấy giá từ API-PAY-01. Copy en-US verbatim (Q-14); chuỗi đã có ở SCR-PUB-04 giữ nguyên từng chữ. FAQ §4 phải khớp landing-copy (FAQ A6) · legal-consent §3c · `/legal/subscriptions`.
**Changelog** (mới nhất trước)
- 2026-09-28 · v1.1 · claude-opus-5-5 · AI Notice: FAQ gia hạn lệch luật CA / NY (Q-26) và quy tắc đổi giá.
- 2026-09-27 · v1 · claude (subagent) · khởi tạo.

## 1. Plan cards

Đầu trang (trùng SCR-PUB-04 CMP-02): H1 "Simple, honest pricing" · sub "Every test and summary is free. Pay only if you want the full report." Thứ tự thẻ Free → One report → Plus ở mọi viewport; không thẻ nào được làm nổi hơn thẻ khác (GC-PlanCard).

| Plan (planKey) | Headline | Bullet (feature thật) | CTA VERBATIM | Badge |
|---|---|---|---|---|
| Free (`plan.free`) | "Free" · dòng giá "No payment needed" (giá 0 · basis Q-02 · 00-overview §2) | "Take every test" · "A scored summary for every test, with every score explained" · "Save your results with your email" · "Daily check-in and streak with a free account" | "Take a free test" → `/tests` | — |
| One report (`report.single`) | "One report" · "[price] one-time" (placeholder — Q-03 · 00-overview §2) | một dòng thay bullet: "Full report and PDF for one test result. Never renews." · khi đã có Plus thêm: "Included in your Plus plan." | "Take a test to unlock" → `/tests` (mua ở SCR-PAY-01, gắn với một kết quả) | — |
| Plus (`plan.plus.monthly` · `plan.plus.annual`) | "Plus" · "[price] per month" hoặc "[price] per year" theo toggle §2 (placeholder — Q-03 · 00-overview §2) | "Full reports and PDFs for every test you take, while your plan is active" · "A 30-day challenge built from your results" · "Priority support" | chưa có Plus: "Continue to secure checkout" (khoá tới khi tick consent — BR-APP-03) · đã có Plus: "Manage plan" → `/account/billing` | — |

Badge: không thẻ nào có badge ("Most popular", "Best value", "-X%"…) — ba thẻ ngang hàng; việc Plus tự gia hạn được nói bằng GC-RenewalDisclosure, không bằng nhãn (SCR-PUB-04 · RS·F-18).

Dưới thẻ Plus và cuối trang:

| Element | Copy VERBATIM (en) | Basis |
|---|---|---|
| Công bố gia hạn (GC-RenewalDisclosure, bản trước khi mua) | "Renews automatically at [price] per [period] until you cancel. If you subscribe today, your next charge is on [date]. We'll email you before every renewal. Cancel anytime in Account → Plan & billing." | BR-APP-02 · Q-16 · giá placeholder — Q-03 |
| Checkbox consent (mặc định KHÔNG tick) | "I understand Plus renews automatically at [price] per [period] until I cancel. I can cancel anytime in Account → Plan & billing." | BR-APP-03 (trùng SCR-PUB-04 CMP-06; `consent_version` gửi trong API-PAY-02) |
| Gợi ý khi chưa tick | "Tick the box above to continue." | BR-APP-03 (trùng SCR-PUB-04 CMP-07) |
| Dòng người bán | "Sold by [legal entity]. Taxes calculated at checkout." | Q-05 · Q-04 · BR-APP-12 (trùng blueprint SCR-PAY-01 CMP-10) |
| Link → `/legal/subscriptions` | "Subscription & refund terms" | RS·F-29 · F-30 |
| KHÔNG có trên trang | đồng hồ đếm ngược · "[Name] just bought" · giá gạch hoặc neo kiểu "-87%" · "Most popular" / "Best value" · logo "featured in" · testimonial không kiểm chứng · gói trả phí được chọn sẵn | RS·F-17 · F-18 `[LIVE:browser · EV-TLW-108 · EV-TLW-112]` |

## 2. Toggle chu kỳ

| Hạng mục | Quy tắc | Basis |
|---|---|---|
| Nhãn | "Monthly" · "Annual" — chỉ đổi thẻ Plus | SCR-PUB-04 CMP-04 |
| Mặc định | "Monthly" chọn sẵn (không mặc định cam kết dài hơn) | in-house · P-02 |
| Hiển thị giá năm | dòng chính là số tiền thật sẽ thu: "[price] per year"; quy đổi theo tháng chỉ là dòng phụ, nhỏ hơn: "[annual price ÷ 12] per month, billed yearly" | tieu-chuan-chung §4 · BR-APP-02 |
| Tiết kiệm của gói năm | nhãn "Save [n]%" cạnh "Annual", với n = làm tròn XUỐNG của (1 − giá năm ÷ (12 × giá tháng)) × 100; chỉ hiện khi Q-03 đã có cả hai giá và n ≥ 1; không kèm giá gạch | placeholder — Q-03 (00-overview §2) · RS·F-18 |
| Khi đổi toggle | cập nhật giá, GC-RenewalDisclosure và câu consent theo chu kỳ mới; **bỏ tick** checkbox nếu đang tick (consent gắn với đúng một giá + chu kỳ) | BR-APP-03 |
| Đối thủ | chỉ một chu kỳ 4 tuần (13 kỳ/năm), không toggle, không gói năm | RS·F-05 `[LIVE:browser · EV-TLW-025 · 2026-09-27]` |

## 3. Bảng so sánh

Nhãn hàng trùng SCR-PUB-04 CMP-08; hàng "Save results with your email", "Priority support", "Price" và cụm "while your plan is active" là bổ sung của file này (SCR-PUB-04 cần thêm).

| Feature | Free | One report | Plus |
|---|---|---|---|
| "Take every test" | ✓ | ✓ | ✓ |
| "Scored summary of every result" | ✓ | ✓ | ✓ |
| "Save results with your email" | ✓ | ✓ | ✓ |
| "Full report and PDF" | — | "One result" | "Every result, while your plan is active" |
| "30-day challenge" | — | — | ✓ |
| "Daily check-in and streak" | "With a free account" | "With a free account" | ✓ |
| "Priority support" | — | — | ✓ |
| "Renews automatically" | "No" | "No" | "Yes, until you cancel" |
| "Price" | "Free" | "[price] one-time" | "[price] per month or [price] per year" (placeholder — Q-03) |

Basis: quyền từng gói ở `00-overview §2` · SYS-ENTITLEMENT (`report.full`, `report.pdf`, `plus`, `challenge`, `checkin`).

## 4. FAQ (VERBATIM)

Bốn câu đầu trùng câu hỏi ở SCR-PUB-04 CMP-09; ba câu sau là bổ sung (SCR-PUB-04 cần thêm).

| Câu hỏi | Trả lời | Basis | Trạng thái |
|---|---|---|---|
| "How do I cancel?" | "Go to Account → Plan & billing and choose Cancel renewal. It's one step, and you don't have to tell us why. You keep Plus until the end of the period you've paid for, and we email you a confirmation right away." | BR-APP-04 · API-MAIL-04 | theo BR-APP-04 |
| "Can I get a refund?" | "Yes, on your first purchase: ask within 14 days and we'll refund it. Consumer laws where you live may give you more rights. See Subscription & refund terms for details." | Q-18 (đề xuất, Group A) · Q-04 | **draft — chờ Q-18 + MoR (Q-04)** |
| "Are taxes included?" | "Prices are shown in US dollars. If sales tax or VAT applies where you live, it's calculated at checkout and shown before you pay." | BR-APP-12 · Q-04 | chờ Q-04 (tuỳ MoR, giá có thể phải hiển thị đã gồm thuế ở một số vùng) |
| "When will I be charged again?" | "Plus renews automatically at the end of each billing period, at the price shown before you bought. We email you before every renewal: 7 days before an annual renewal and 3 days before a monthly one, with the amount, the date and a link to cancel. Your next charge date is always in Account → Plan & billing." | BR-APP-02 · BR-APP-03 · Q-16 · API-MAIL-03 | chờ Q-16 (mốc 7 / 3 ngày là đề xuất) |
| "What happens to my reports if I cancel?" | "Reports you unlocked one at a time are yours to keep. Reports you read with Plus stay available until your plan ends; after that, you can unlock any of them individually. Your test summaries always stay free." | SYS-ENTITLEMENT · BR-APP-04 | theo SYS-ENTITLEMENT |
| "Is there a free trial?" | "There's no trial, because every test and its scored summary are already free. You can see what a full report includes before you buy." | Q-03 (đề xuất: không trial) | chờ Q-03 |
| "What if a renewal payment fails?" | "We'll email you and show a notice in Plan & billing so you can update your payment method. You keep Plus during a short grace period." | SYS-ENTITLEMENT · API-MAIL-05 | chờ Q-04 (thời gian ân hạn theo provider) |

Link cuối FAQ: "Subscription & refund terms" → `/legal/subscriptions`. Đổi Q-03 / Q-04 / Q-16 / Q-18 → sửa cùng lúc bảng này, landing-copy FAQ, legal-consent §3c và `/legal/subscriptions`.

## 5. AI Notices
- Giá của mình là placeholder (Q-03, Group A) — không có con số nào ở file này. Neo đối thủ chỉ để tham chiếu, không dùng trong copy: "One Time $57.00" · "$39.95 every 4 weeks" `[LIVE:browser · EV-TLW-025 · 2026-09-27]`.
- FAQ hoàn tiền là draft theo đề xuất Q-18; FAQ thuế phụ thuộc MoR (Q-04); FAQ gia hạn phụ thuộc Q-16. Chưa được dùng làm cam kết trước khi các Q này chốt.
- FAQ "When will I be charged again?" hứa "7 days before an annual renewal": mốc này lệch cửa sổ 15–45 ngày của CA / NY / NYC (Q-26, Group D, `research/regulatory-landscape.md` §8). Câu "at the price shown before you bought" cũng cần khớp quy tắc báo đổi giá BR-PUB-11 · API-MAIL-09 (FLOW-quan-ly-huy-gia-han §6). Sửa copy khi human duyệt Q-26 / Q-03.
- "Priority support" (theo `00-overview §2`) chưa có định nghĩa vận hành (vd mục tiêu thời gian phản hồi) → cần định nghĩa ở `/help` hoặc bỏ bullet, vì bullet chỉ được ghi feature thật.
- SCR-PUB-04 cần đồng bộ: thêm 3 câu FAQ cuối (§4) và các hàng / cụm bổ sung ở bảng so sánh (§3); ghi "Save [n]%" như §2.
