# [RS-testlibrary] Bằng chứng ngoài site: review, khiếu nại, index, pháp nhân (`[LIVE:web]`)
**Changelog** (mới nhất trước)
- 2026-09-28 · v1.1 · claude-opus-5-5 · §4 hàng huỷ: thêm lời kể human (teardown S16): tài khoản đã huỷ không dùng được khi hết hạn.
- 2026-09-28 · v1 · claude-opus-5-5 · phiên cloud không mở được testlibrary.com (proxy trả 403), nên chỉ dùng WebSearch. Hai lượt search chạy song song: review + khiếu nại + vòng đời (69 query) và index + pháp nhân + claim (96 query). Ngân sách 200 search của phiên đã dùng hết. Lượt pháp lý nằm ở `research/regulatory-landscape.md`.

## 0. Cách đọc file này

| Mục | Ghi nhận |
|---|---|
| Công cụ | WebSearch (chỉ kết quả ở Mỹ). Kết quả gồm tiêu đề, URL và một đoạn tóm tắt do công cụ tự viết. Trích dẫn trong file là **search-summary text**, không phải nguyên văn trang. Một đoạn tóm tắt có thể trộn nhiều kết quả, nên việc gắn nó với một URL chỉ là gần đúng. Tiêu đề trang là phần gần nguyên văn nhất |
| Không mở trang nào | WebFetch trả `EGRESS_BLOCKED` ở testlibrary.com, trustpilot.com, bbb.org, productreview.com.au, thinkitsascam.com, ibisik.com, sensorstechforum.com, test-library.com, web.archive.org |
| Mức tin của từng dòng | **[A]** query giới hạn đúng domain của nguồn · **[B]** query không giới hạn nhưng tóm tắt nêu rõ nguồn · **[C]** tóm tắt trộn nhiều kết quả, chỉ dùng làm manh mối |
| Luật dùng | Mọi dòng là `[LIVE:web]`. **Không** dùng làm mốc giá, **không** dùng cho feature-lock (giữ luật `research/00-applications-list.md` §2). Số nào cần làm căn cứ phải verify bằng browser trước (`next-drive-plan.md` D-11) |
| Chưa làm (hết ngân sách hoặc không tới được) | traffic (Similarweb / Semrush) · query riêng cho các cơ quan truyền thông trong claim "featured in" · query về cơ quan quản lý (FTC, ACM, CMA) · Reddit (công cụ search không tới được reddit.com) |

## 1. Nguồn

| W-ID | Nguồn | URL | Ngày nguồn | Dùng cho |
|---|---|---|---|---|
| W-01 | Trustpilot · testlibrary.com (bản www + uk · au · ca · ie · fr-be) | `trustpilot.com/review/testlibrary.com` | không rõ (nhiều lần crawl) | điểm, số review, phân bố sao, phản hồi của công ty, khiếu nại |
| W-02 | ProductReview.com.au | `productreview.com.au/listings/testlibrary` | — | khiếu nại ở Úc, giá AUD |
| W-03 | BBB · hồ sơ "Test Library" + trang complaints | `bbb.org/us/ga/palmetto/profile/health-medical-general/test-library-0443-91848117` (slug khác: `aura-health-llc-testlibrarycom-0443-91848117`) | hồ sơ mở 2026-04-13 | rating, khiếu nại |
| W-04 | BBB Scam Tracker | `bbb.org/scamtracker/lookupscam/1264754` · `…/1292114` · `…/1338618` | — | khiếu nại cụ thể (gắn entry chỉ gần đúng) |
| W-05 | thinkitsascam.com | `thinkitsascam.com/2026/06/testlibrary-scam.html` | 2026-06 | checkout, giá Lifetime, cách huỷ |
| W-06 | wisdomganga.com | `wisdomganga.com/testlibrary-scam/` | — | khiếu nại, hoàn tiền |
| W-07 | Ibisik (2 bài) | `ibisik.com/testlibrary-scam/` · `ibisik.com/testlibrary-scam-review/` | — | giá ngoài Mỹ, khiếu nại BBB tháng 4/2026 |
| W-08 | SensorsTechForum | `sensorstechforum.com/testlibrary-scam/` | — | khoảng giá, điểm Scam Detector |
| W-09 | MalwareTips | `malwaretips.com/blogs/testlibrary-scam-or-legit-subscription-trap/` | — | trình tự funnel, descriptor |
| W-10 | Điểm tự động | scam-detector.com · scamadviser.com · gridinsoft.com (trang testlibrary.com) | — | chỉ ghi để thấy chúng mâu thuẫn nhau |
| W-11 | Mạng xã hội / diễn đàn | YouTube "Is TestLibrary com Legit Website or Subscription Scam?" · nhóm Facebook "SCAM ALERT: Testlibrary.com" · `signal-arnaques.com/scam/view/934290` | YouTube 2026-06-02 | độ phủ của phàn nàn |
| W-12 | Search index của testlibrary.com | WebSearch `allowed_domains=["testlibrary.com"]`, 56 query | 2026-09-28 | trang nào được index |
| W-13 | Terms trên domain sinh đôi | `testlibrary.us/docs/terms-and-conditions` · `testlibrary.com/docs/*` | Terms "last updated on August 17, 2026" | pháp nhân, index `/docs/*` |
| W-14 | Revuelto S.à r.l. | pappers.lu (B303230) · editus.lu | — | pháp nhân |
| W-15 | Haur B.V. | northdata · drimble · companyinfo (KvK 96442654) | — | pháp nhân |
| W-16 | Haur Media Limited | Companies House 16228603 | — | pháp nhân |
| W-17 | Aura Health LLC | bizapedia (WY) · hồ sơ BBB "Aura Health LLC" (ngành hair care) | — | pháp nhân |
| W-18 | Salo | terms `develop.salo.pages.dev/wl/terms` · Trustpilot salo.health · chargeonmycard.com/salo-health | — | sản phẩm cùng nhóm |
| W-19 | MyTraitsProfile | `mytraitsprofile.com/pricing` · `mytraitsprofile.us/docs/terms-and-conditions` · Trustpilot (ca) · `thinkitsascam.com/2026/08/mytraitsprofile.html` · chargeonmycard.com/mytraitsprofile | blog 2026-08 | sản phẩm cùng nhóm |
| W-20 | Your Novella | `yournovella.com/terms` · Google Play `com.haur.yournovella` | — | sản phẩm cùng nhóm |
| W-21 | NordicaLab | Trustpilot `nordicalab.com` (+ bản ch · at) · `nordicalabs.ca` | — | descriptor thanh toán |
| W-22 | Domain na ná | test-library.com (Trustpilot, Scam Detector) · mytraitprofile.com (không có "s") · persolabs.org · mindprofile.co · testolib.com · testorix.com · personality.cc | — | bối cảnh category |
| W-23 | Số điện thoại | thephoneindex.com (đầu số 507-853) | — | kiểm tra dùng chung số |

## 2. Uy tín và review

| # | Ghi nhận (search-summary text trừ khi ghi "tiêu đề") | W | Mức |
|---|---|---|---|
| 2.1 | Tiêu đề: "Testlibrary is rated "Great" with 4.1 / 5 on Trustpilot" | W-01 | A |
| 2.2 | Phân bố sao: "52% of reviews are 5-star, 26% are 4-star, 12% are 3-star, 2% are 2-star, and 8% are 1-star." | W-01 | A |
| 2.3 | Tổng review theo các lần crawl: 29.137 · "approximately 30,000" · 26.020 · 25.159 · 21.334. Tiêu đề kiểu "3 of 1,037" là **số trang** (khoảng 20 review mỗi trang), không phải số review `[INFERRED]`. Tiêu đề "Testlibrary Reviews 709" (au) và "722" (uk) có lẽ là snapshot cũ `[INFERRED]` | W-01 | A (số) · suy luận (cách đọc) |
| 2.4 | "The company has replied to 98% of negative reviews and typically replies within 1 week." (một tóm tắt ghi 99%) · "hasn't invited customers recently, so reviews may not be representative." | W-01 | A |
| 2.5 | Phản hồi mẫu của công ty: "The subscription terms, including the renewal amount, are disclosed at checkout before payment and in the confirmation email." · "If you'd like to cancel, you can do so anytime at https://testlibrary.com/cancel-sub." · "The plan is account-based, so you can cancel anytime at this URL with no login required." | W-01 | A |
| 2.6 | Phản hồi của công ty: "purchasing a test result automatically creates an account… includes a trial period that converts into the subscription unless it is canceled" | W-01 | B |
| 2.7 | Phản hồi của công ty cho một review tiếng Pháp: "payment is actually required before the test begins, so the pricing page should appear first before the questions." (ngược với funnel đã drive: làm 100 câu trước, offer sau — F-15 · F-17) | W-01 | A |
| 2.8 | Review tích cực: "finding the tests easy to understand and quick to complete, and many appreciate the insightful and specific questions" · "detailed reports, which are often described as enlightening and accurate" | W-01 | A |
| 2.9 | BBB: "not BBB accredited"; rating "F" "due to failure to respond to 18 complaints"; "BBB file … opened on 4/13/2026"; "operates under multiple names including TestLibrary, Aura Health LLC, and Haur B.V."; địa chỉ "9110 Selborne Ln Ste 210, Palmetto, GA 30268" | W-03 | A |
| 2.10 | ProductReview.com.au: "1 out of 5 stars from 17 genuine reviews" (lượt index); lượt review không thấy rating tổng → hai lượt không khớp, cần verify | W-02 | A / chưa chắc |
| 2.11 | Điểm tự động mâu thuẫn nhau: Scam Detector 80,7/100 (trang của họ) nhưng SensorsTechForum trích "15.6 out of 100… Controversial"; Gridinsoft 83 hoặc 79; ScamAdviser vừa "Trust Score of 0" vừa "legit and safe". **Không dùng** | W-08 · W-10 | — |
| 2.12 | Bài viết cảnh báo: thinkitsascam "TestLibrary Scam or Legit? $1.95 Trial, $39.95 Charges & Cancellation" (2026-06) · wisdomganga "The TestLibrary Scam: Navigating the Hidden Subscription Trap" · Ibisik "TestLibrary Scam: I Paid $1.95 and Ended Up With a $39.95 Subscription" · SensorsTechForum "Testlibrary – Is It a Scam?" · MalwareTips "TestLibrary Subscription Review: Trial And Billing" · YouTube (2026-06-02) · nhóm Facebook "SCAM ALERT: Testlibrary.com" · Signal-Arnaques (1 báo cáo). Không thấy báo chí đưa tin | W-05 → W-11 | tiêu đề |
| 2.13 | test-library.com (có gạch nối, domain khác): Trustpilot "Considering 67 reviews, most reviewers were unhappy"; cùng mẫu "$1.95 tests… recurring $39.95"; một report trên đó "credited to "TestLibrary""; không tìm thấy bằng chứng cùng chủ | W-22 | A |

## 3. Khiếu nại: chủ đề và số nguồn

Đếm **số nguồn khác nhau**, không phải số khiếu nại. Mã nguồn: TP1 Trustpilot testlibrary.com · TP2 Trustpilot test-library.com · TP3 Trustpilot nordicalab.com · BBB1 hồ sơ + complaints · BBB2 Scam Tracker · PR ProductReview · SA Signal-Arnaques · TS thinkitsascam · WG wisdomganga · IB Ibisik · STF SensorsTechForum.

| Chủ đề | Số nguồn | Nguồn | Trích tiêu biểu (search-summary) |
|---|---|---|---|
| Bị trừ tiền định kỳ bất ngờ sau khoản nhỏ ban đầu | 11 | TP1 · TP2 · TP3 · BBB1 · BBB2 · PR · SA · TS · WG · IB · STF | "paid $1.95 for an online ADHD assessment … resulting in charges of $39.95 seven days later" (BBB1) |
| Điều khoản nằm ở chữ nhỏ, hoặc chỉ có trong email / biên nhận sau khi mua | 7 (+3 chỉ nói không biết) | TP1 · TP2 · TP3 · BBB1 · BBB2 · WG · IB | "mentioned in confirmation emails but buried at the bottom" (BBB2); "at no point during checkout was it made clear…" (BBB1) |
| Không có nhắc trước khi gia hạn | 2 (+1 chưa chắc) | TP1 · BBB1 | "there are no reminders and very unclear warnings" (TP1) |
| Huỷ khó hoặc rối | 4 (+2 chưa chắc) | TP2 · TP3 · BBB1 · BBB2 | "cancel options that did not appear to function" (BBB1); "told they didn't have a subscription to cancel" (Trustpilot, profile chưa rõ) |
| Hoàn tiền một phần 20 / 25 / 40% | 3 | TP1 · BBB1 · PR | "offered 25% refund, then 40%, then finally agreed to a full refund" (TP1) |
| Từ chối hoàn tiền, hoặc hứa mà không trả | 4 | TP1 · BBB1 · BBB2 · PR | "confirmed the subscription was cancelled but … offered only a 25% refund as a gesture of goodwill" (BBB1) |
| Hoàn đủ chỉ sau khi doạ chargeback / khiếu nại PayPal / nhờ ngân hàng | 3 | TP1 · TP3 · BBB2 | "success in getting refunds through PayPal disputes" (TP3) |
| Hỗ trợ không trả lời | 3 | TP1 · BBB1 · PR | "failure to respond to 18 complaints" (BBB1) |
| Bị trừ trùng / lặp | 3 | TP1 · TP3 · PR | "charged twice for subscriptions they cannot remember agreeing to" (TP1) |
| Tên trên sao kê lạ, nhiều tên công ty | 3 | TP3 · BBB1 · BBB2 | "DBA as TestLibrary… billing through "Nordicalab"" (TP3) |
| "Bài free" rồi paywall sau ~100 câu | 3 | TP1 · BBB2 · WG | "made to answer 100 questions in a supposedly free test" (TP1) |
| Kết quả chung chung, kiểu "horoscope" | 2 | WG · TP2 | "reports often feel AI-generated, extremely generic, or similar to a "horoscope"" (WG) |
| Report ngắn hơn "20-page report" | 0 | — | có một review nói nhận "a 20-page report" (TP2, [C]) |
| Lo ngại riêng tư | 0 | — | không thấy |

## 4. Sau khi trả $1.95: vòng đời theo bên thứ ba

Bù một phần cho PARK "màn sau thanh toán" và "email vòng đời" (teardown §9). Không thay được capture thật.

| Giai đoạn | Bên thứ ba nói gì | W · mức | So với quan sát của mình |
|---|---|---|---|
| Tạo tài khoản | công ty: "purchasing a test result automatically creates an account"; không nguồn nào tả màn đặt mật khẩu | W-01 · B | khớp F-20 và lời kể human (S14) |
| Email xác nhận | "the $39.95 charge was mentioned at the bottom of the confirmation email"; một khiếu nại BBB (4/2026, qua Ibisik): "the recurring charge was only revealed through an email received after the purchase"; khiếu nại khác lại nói "no email confirmation or prior billing notice" | W-04 · W-07 · W-03 · A | văn bản chỉ nói order confirmation "may" có (legal-extract §9B.5); các nguồn mâu thuẫn |
| Nhắc trước khi gia hạn | khiếu nại: "no reminders" (TP1, BBB1); SensorsTechForum lại viết "sends users a reminder before their next billing" (có vẻ nhắc lại lời công ty) | W-01 · W-03 · A · W-08 · B | văn bản không hứa nhắc (F-29) |
| Thời điểm thu | "Seven days after paying $1.95"; "a week later PayPal was charged $39.95" | W-03 · A · W-21 · C | khớp trial 7 ngày (EV-TLW-034) |
| Tên trên sao kê | lần thu gia hạn, nhất là qua PayPal, hiện là **"NordicaLab"** (bản tiếng Đức còn nhắc "Trynourix"); MalwareTips lại nói hiện "TestLibrary" | W-21 · A · W-04 1338618 · A · W-05/W-07 · C · W-09 · B | checkbox ở checkout viết: "Charges will appear as "testlibrary.com" on my billing statement" (EV-TLW-034) |
| Ai thu tiền | "Haur B.V. (in The Netherlands) is involved in collecting the initial €1.95 payment" | W-03 · C | khớp danh sách Payment Processing Entity (legal-extract 1.5–1.8) |
| Phương thức | PayPal (một vụ BBB ngày 2026-07-11), thẻ, Google Wallet | W-03 · A | checkout có Apple Pay, Google Pay, thẻ; dải logo có PayPal (EV-TLW-032 · EV-TLW-033) |
| Huỷ qua `/cancel-sub` | "enter the email associated with your account, complete the verification process"; "cancellation takes effect immediately and premium access ends"; "does not automatically reverse a payment that already processed" | W-05 · C | khớp F-11; phiên 1 thấy tài khoản "Cancelled" vẫn dùng được trong ngày (F-24); human cho biết hết hạn thì không dùng được nữa (teardown S16, `[INFERRED]`) |
| Hoàn tiền | thang **25% → 40% → 100%**, hoàn đủ khi khách nói sẽ khiếu nại ngân hàng / chargeback: "To obtain a 100% refund, users must forcefully reject all partial offers…" | W-01 · W-03 · W-02 · A · W-06 · C | văn bản: "refunds are not guaranteed… case-by-case"; offer: "30-day satisfaction guarantee" (F-30) |

## 5. Giá theo thị trường và thay đổi theo thời gian

Không phải mốc giá (xem §0). Số theo lời người review / blog.

| Thị trường · tiền | Khoản đầu | Gia hạn | W · mức |
|---|---|---|---|
| Mỹ · USD | $1.95 · 7 ngày | $39.95 mỗi 4 tuần | W-05 · A (khớp EV-TLW-025) |
| Anh / Ireland · GBP | £1.95 | £39.95 mỗi 4 tuần | W-01 (uk · ie) · A |
| EU · EUR | 1,95 € (~"2€") | 39,95 € (~"40€/month"; một review Đức ghi "etwa 39,90 €") | W-01 · W-21 · W-11 · A |
| Úc · AUD | $1.95 AUD | **$54.95 AUD** | W-02 · A |
| Hungary · HUF | 710 HUF | 10.930 HUF | W-01 (ie) · A |
| Ba Lan · PLN | — | 2 lần × 119 PLN | Trustpilot, profile chưa rõ · C |
| PayPal (Scam Tracker) | $1.99 | $39.99 | W-04 1338618 · A |
| Gói "Lifetime" | — | **$99.95** một lần, "no recurring monthly fee" (bài 2026-06) | W-05 · A |
| "One Time" | $57 | — | W-05 · A (khớp EV-TLW-025) |

Nhận xét `[INFERRED]`: cùng con số 39.95 cho USD, GBP, EUR; AUD dùng 54.95. Gói Lifetime $99.95 có trong bài tháng 6/2026 và FAQ vẫn nhắc "Lifetime plan", nhưng trang giá ngày 2026-09-27 không có (F-06), nên có thể gói này đã bị gỡ trong khoảng tháng 6 → tháng 9.

## 6. Trang được index (W-12)

| Nhóm | URL được index (ví dụ) | Tiêu đề / search-summary text | Ghi chú |
|---|---|---|---|
| Trang gốc | `/` · `/library/` · `/about/` · `/contact-us` · `/faq/` · `/login` · `/cancel-sub` | "Testlibrary - Discover the Real You" · "Test Library - Explore All Assessments" | khớp site đã drive |
| Funnel trả phí từng bài (root) | `/16personalities-test/` · `/adhd-test/` · `/autism-test/` · `/iq-test/` · `/enneagram-test/` · `/big5-test/` · `/archetype-test/` · `/disc-test/` · `/strengths-finder-test/` · `/career-test/` · `/depression-test/quiz` · `/bpd-test/quiz` · `/ocean-test/quiz` | mẫu tiêu đề "**<X> Test - Get Your Accurate <X> Trait Report**"; "5-minute ADHD test… evaluates your focus, impulsivity, and executive function"; "5-minute depression test… **identify symptoms of clinical low mood**"; enneagram: "based on validated psychological research" | cùng khuôn funnel `/personality-test/` (SC-TLW-15) |
| URL mang tham số chiến dịch | `/adhd-test/?nis=6&ch=1` · `www.testlibrary.com/depression-test/quiz?nis=5&ch=1` · `/fr/adhd-test?nis=5&ch=1` | như trên | tham số kiểu tracking chiến dịch nằm trong URL được index |
| Checkout | `/checkout?from=pricing&product=1` · `/checkout?from=pricing&product=3&sessionId=<32 hex>` | "Secure Checkout \| Test Library" | URL checkout **kèm `sessionId`** nằm trong index; `product=1` là mã chưa thấy ở phiên 1 (phiên 1 thấy `7` · `one-time` · `3`) |
| Giá | `/pricing` | "7-day Full Access trial for $1.95, then $39.95 every 4 weeks" · "Lifetime plan… one-time payment… no recurring monthly fees" | snapshot index còn "Lifetime plan" (xem §5) |
| Văn bản pháp lý | `/docs/subscription-policy` · `/docs/terms-and-conditions` · `/docs/privacy-policy` | Terms "last updated on August 17, 2026"; Privacy: "not intended for individuals under 18" | index giữ đường dẫn `/docs/*`; phiên 1 đọc ở `/legal/*` (cùng ngày cập nhật) |
| Locale | `/de/` · `/de/library` · `/de/faq` · `/de/adhd-test/` · `/fr/` · `/fr/adhd-test` · `/es/personality-test/` · `/es/adhd-test/` · `/es/about` | es ADHD: "tests are designed for personal discovery **and entertainment**" | chỉ thấy **de · fr · es** (it · pt · ja · nl · pl · ru · tr không ra) |
| Domain sinh đôi | `testlibrary.us/docs/terms-and-conditions` | "govern access to and use of testlibrary.us website…"; cùng 2 Platform Operator; "not intended to diagnose, treat, cure, or prevent any disease or condition" | cùng đường dẫn `/docs/` |

**Không thấy trong index** (đã tìm): mọi URL `/free-tests/<slug>` (2 query riêng) · anxiety / social anxiety / burnout / empath / codependency / people-pleaser / introvert-extrovert · `/dashboard` · `/legal/*` · blog. Tên bài có trong tóm tắt nhưng không kèm URL: EQ, spirit animal, attachment style, love style, intimacy, narcissist, sociopath, trauma ("revealing hidden traumas… core emotional wounds"), bipolar, OCD, neurodivergent.

## 7. Pháp nhân và các sản phẩm cùng nhóm

| Thực thể | Ghi nhận (search-summary text trừ khi ghi "tiêu đề") | W | Ngày |
|---|---|---|---|
| Revuelto S.à r.l. (LU, B303230) | "incorporated on December 30, 2025… 'Autre commerce de détail non spécialisé'"; tiêu đề editus.lu "Revuelto Sàrl - Internet - Electronic commerce Luxembourg"; 10 Rue Mathias Hardt là toà văn phòng cho thuê nhiều công ty | W-14 | thành lập 2025-12-30 |
| Haur B.V. (NL, KvK 96442654) | "established on February 13, 2025… employs 1 person… online sales and retail of wellness products and simple household appliances" | W-15 | thành lập 2025-02-13 |
| Haur Media Limited (UK, 16228603) | "active private limited company incorporated on February 4, 2025 with one officer"; ngành: bán lẻ không chuyên, bán lẻ qua mail order / internet; 85 Great Portland Street, London | W-16 | thành lập 2025-02-04 |
| Aura Health LLC (WY) | bản ghi directory "AURA HEALTH LLC in Sheridan, WY"; 30 N Gould St Ste R là địa chỉ nhiều công ty khác cũng dùng; một hồ sơ BBB "Aura Health LLC" xếp ngành hair care | W-17 | — |
| Aura Health LLC → **MyTraitsProfile** | "MyTraitsProfile.com identifies Aura Health in Sheridan, Wyoming as its service provider"; "€1.95 for a seven-day introductory period… €39.95 for each twenty-eight-day period"; có domain sinh đôi `mytraitsprofile.us/docs/terms-and-conditions` (cùng khuôn `/docs/`); Trustpilot (tiêu đề): "Mytraitsprofile is rated "Bad" with 1.5 / 5" | W-19 | blog 2026-08 |
| Aura Health LLC + Haur B.V. → **Salo** (salo.health) | terms: "operated through Aura Health LLC… and Haur B.V. (Chamber of Commerce No. 96442654)"; "renew automatically unless canceled at least 48 hours before renewal"; review: "unauthorized charges and difficulties canceling" | W-18 | — |
| Haur B.V. → **Your Novella** | tiêu đề "Terms of Use — Your Novella (Haur BV)"; app Google Play `com.haur.yournovella`, subscription có trial | W-20 | — |
| **NordicaLab** | Trustpilot nordicalab.com: "operates under multiple names (DBA as TestLibrary), with subscription billing through "Nordicalab" but account cancellation requiring access through the "TestLibrary" site"; "NordicaLabs (aka NordicaLab on Paypal, Trynourix in german, Nordicslabs, and Testlibrary on Youtube)…"; nordicalabs.ca "similar complaint patterns" | W-21 | — |
| Testing Solutions LLC (DE) | chỉ thấy trong Terms của testlibrary.com / testlibrary.us; không có bản ghi, brand hay tin tức khác | W-13 | — |
| Hồ sơ BBB "Test Library" | "The Test Library is under Aura Health, LLC in Wyoming"; ngành health-medical-general; địa chỉ Palmetto, GA | W-03 | — |
| Trùng tên, không liên quan | Aura Health Inc. (aurahealth.io, app thiền), aura.com, aura.care; testing-library.com (framework JS) | — | — |
| Na ná, chưa xác minh quan hệ | mytraitprofile.com (không có "s") dùng đúng tagline "Discover the Real You", tóm tắt nói pháp nhân là "Obsidian Commerce LLC" (Delaware); test-library.com (§2.13); các site cùng mô hình persolabs.org, mindprofile.co, testolib.com, testorix.com, personality.cc | W-22 | — |
| Số điện thoại · email | +1 (507) 853-1222: không thấy brand khác dùng (đầu số Okabena / Jackson County, MN); support@testlibrary.com chỉ ra trang về TestLibrary | W-23 | — |

Không thấy hành động của cơ quan quản lý với các thực thể trên (chưa chạy query riêng, xem §0).

## 8. Claim trên trang offer (SC-TLW-21) so với bên thứ ba

| Claim (EV-TLW-108) | Bên thứ ba | W | Đánh giá |
|---|---|---|---|
| "Rated 4.8/5" | Trustpilot 4,1/5 (§2.1); ProductReview 1/5 (§2.10); BBB rating F (§2.9) | W-01 · W-02 · W-03 | **không khớp** nếu hiểu là Trustpilot |
| "Trusted by 20,000+ people" | số review Trustpilot 21k–30k tuỳ snapshot | W-01 | không mâu thuẫn |
| "Personality tests featured in Harvard · CBS · Stanford · FOX · Cambridge · NBC" | không kết quả nào cho thấy các cơ quan này đưa tin về TestLibrary (chưa chạy query riêng) | — | **không tìm thấy** |
| "30-day satisfaction guarantee" | khiếu nại BBB: trial bị gọi là "non-refundable" trong khi "a 30-day satisfaction guarantee being advertised prominently on the same purchase page" | W-03 | khớp F-30 |

## 9. Findings (tiếp dãy F của RS-testlibrary)

| F-xx | Finding | Bằng chứng | Tag | Confidence |
|---|---|---|---|---|
| F-35 | TestLibrary nằm trong một **nhóm sản phẩm subscription cùng chủ**: Aura Health LLC được nêu là operator / service provider của testlibrary.com, mytraitsprofile.com (cùng mô hình 1,95 → 39,95 mỗi 28 ngày, cùng khuôn domain `.us` + `/docs/`) và salo.health (cùng Haur B.V.); Haur B.V. còn phát hành app Your Novella. mytraitsprofile.com ở `00-applications-list.md` §2 là **site cùng chủ**, không phải đối thủ độc lập | W-13 · W-18 · W-19 · W-20 | `[LIVE:web]` | trung bình |
| F-36 | Các pháp nhân còn rất mới và đăng ký ngành bán lẻ / thương mại điện tử: Haur Media Ltd (2025-02-04), Haur B.V. (2025-02-13, 1 nhân viên), Revuelto S.à r.l. (2025-12-30); địa chỉ công bố là địa chỉ đăng ký hoặc văn phòng cho thuê; BBB ghi thêm một địa chỉ ở Palmetto, GA | W-03 · W-14 · W-15 · W-16 · W-17 | `[LIVE:web]` | trung bình |
| F-37 | **Tên trên sao kê không khớp lời hứa ở checkout**: nhiều nguồn báo khoản gia hạn (nhất là qua PayPal) hiện là "NordicaLab" (có nơi "Trynourix"), trong khi checkbox checkout viết "Charges will appear as "testlibrary.com"" (EV-TLW-034) | W-21 · W-04 · W-05 · W-07 · EV-TLW-034 | `[LIVE:web]` + `[LIVE:browser]` | trung bình (cần sao kê thật để chắc) |
| F-38 | **Giá đặt theo từng thị trường**: £1.95 → £39.95, 1,95 € → 39,95 €, AUD 1.95 → 54.95, HUF 710 → 10.930; biến thể PayPal $1.99 → $39.99; gói Lifetime $99.95 có trong bài tháng 6/2026 nhưng không còn trên trang giá ngày 2026-09-27. Phiên 1 chỉ thấy USD vì không có VPN | W-01 · W-02 · W-04 · W-05 · W-21 | `[LIVE:web]` | thấp–trung bình |
| F-39 | **Bề mặt search thật là các funnel trả phí**: index có root funnel từng bài với tiêu đề "Get Your Accurate <X> Trait Report" (một số kèm tham số chiến dịch `?nis=…&ch=…`), có cả một URL checkout kèm `sessionId`; **không có URL `/free-tests/` nào**; văn bản pháp lý nằm ở `/docs/*`; locale chỉ de · fr · es; có domain sinh đôi testlibrary.us. Sửa cách đọc F-04: 25 trang `/free-tests/` không phải bề mặt SEO đang được index `[INFERRED]` (có thể là trang đích quảng cáo hoặc mới) | W-12 · W-13 | `[LIVE:web]` · `[INFERRED]` (cách đọc) | trung bình |
| F-40 | Tiêu đề và mô tả được index dùng ngôn ngữ chẩn đoán ("Get Your Accurate ADHD / BPD / Depression / Autism Trait Report", "identify symptoms of clinical low mood", "revealing hidden traumas"), trong khi bản tiếng Tây Ban Nha gọi là "entertainment", Terms ghi "not intended to diagnose…", Privacy ghi "not intended for individuals under 18" | W-12 · W-13 | `[LIVE:web]` | trung bình |
| F-41 | Claim trên offer không có chỗ dựa bên thứ ba: "Rated 4.8/5" so với Trustpilot 4,1/5 (khoảng 25–30 nghìn review, 8% một sao, công ty trả lời 98–99% review xấu, "hasn't invited customers recently"); BBB rating F, không accredited, 18 khiếu nại không trả lời (hồ sơ mở 2026-04-13); không thấy báo chí nào trong danh sách "featured in" | W-01 · W-02 · W-03 | `[LIVE:web]` | trung bình |
| F-42 | Mẫu khiếu nại lặp lại ở nhiều nguồn độc lập: bị trừ tiền định kỳ bất ngờ (11 nguồn), điều khoản chỉ ở chữ nhỏ hoặc email sau mua (7), huỷ khó (4), hoàn tiền theo thang **25% → 40% → 100%** và chỉ hoàn đủ khi khách doạ chargeback (3), bị trừ trùng (3). Không nguồn nào phàn nàn về riêng tư hay số trang report | §3 | `[LIVE:web]` | trung bình (đếm nguồn, không phải số ca) |
| F-43 | Lời công ty tự nói công khai: điều khoản gia hạn "disclosed at checkout before payment and in the confirmation email"; mua kết quả "automatically creates an account"; huỷ "no login required" qua `/cancel-sub`; và "payment is actually required before the test begins" (ngược với funnel đã drive, nơi offer đến sau 100 câu) | W-01 | `[LIVE:web]` | trung bình |

## 10. Ảnh hưởng tới research và docs

| Finding | File | Việc |
|---|---|---|
| F-35 | `research/00-applications-list.md` §2 · `research/research-synthesis.md` Fidelity note | đã sửa: mytraitsprofile.com là site cùng chủ; nhánh "quiz-funnel" của category có ít chủ thể độc lập hơn số domain |
| F-37 | `docs/overview/bang-quyet-dinh.md` | đã thêm Q-24 (tên trên sao kê khớp brand ở mọi phương thức thanh toán) |
| F-38 | `bang-quyet-dinh.md` Q-03 · Q-14 | đã thêm vào cột evidence: đối thủ thu theo tiền tệ từng thị trường; quyết định vẫn là của human |
| F-39 · F-40 | `teardown.md` F-04 · `research-synthesis.md` §G | đã ghi chú: bề mặt search là funnel trả phí, không phải `/free-tests/` |
| F-40 | `bang-quyet-dinh.md` Q-21 | đã thêm evidence: Privacy của đối thủ ghi "not intended for individuals under 18" |
| F-41 | `docs/screens/SCR-PUB-04-bang-gia.md` BR-PUB-08 | không cần sửa: BR-PUB-08 đã cấm đồng hồ, "X just bought", logo "featured in" |
| F-42 | `research-synthesis.md` §2 (P-02 · P-03 · P-04) · `bang-quyet-dinh.md` Q-16 · Q-18 | đã thêm `[LIVE:web]` vào bằng chứng pain; evidence cho nhắc trước gia hạn và chính sách hoàn tiền một mức, công bố trước |

## 11. Còn mở sau phiên này

| Việc | Vì sao chưa làm | Ở đâu |
|---|---|---|
| Verify nguyên văn: Trustpilot testlibrary.com + nordicalab.com, trang complaints BBB và Scam Tracker 1264754 · 1292114 · 1338618, ProductReview, bài thinkitsascam (giá Lifetime $99.95, các bước huỷ) | WebFetch bị chặn | `next-drive-plan.md` D-11 |
| Sao kê thật và email vòng đời | cần tài khoản + hộp thư của human | `next-drive-plan.md` D-10 |
| Traffic, kênh (paid social / search) | hết ngân sách search | lần search sau |
| Báo chí "featured in", cơ quan quản lý, Reddit, người điều hành các pháp nhân | hết ngân sách / công cụ không tới được | lần search sau |

## 12. AI Notices
- Không trang nào được mở trực tiếp; mọi trích dẫn là tóm tắt của công cụ search. Có những tóm tắt mâu thuẫn nhau (điểm Scam Detector 80,7 và 15,6; ProductReview "1 out of 5" ở lượt này, không thấy rating ở lượt khác; khiếu nại có email xác nhận và không có). Dòng mức [C] chỉ là manh mối.
- Số ở §3 là số nguồn, không phải số ca khiếu nại. Không suy ra tỉ lệ khách bị ảnh hưởng.
- Các suy luận về quy đổi tỉ giá, gói Lifetime bị gỡ và cách đọc số trang Trustpilot đều là `[INFERRED]`.
- File này không đưa ra kết luận pháp lý về đối thủ.
