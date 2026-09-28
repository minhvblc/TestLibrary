# seo-meta — TestLib (tên tạm, Q-01) · mỗi route indexable một dòng
> Nguồn head meta cho mọi route public (`web/head-meta.html` chép dòng `/`). Copy dịch từ `00-gtm-strategy.md` §1 · §3; title theo mẫu `<Tên trang> · TestLib` (tieu-chuan-chung §8). Domain = `https://<domain>` (Q-01). Độ dài đã đếm theo ký tự (title ≤ 60 · description ≤ 155); dòng có `[n]` / `[m]` tính với số ≤ 2 chữ số.
**Changelog** (mới nhất trước)
- 2026-09-28 · v1.1 · claude-opus-5-5 · quyết định 2026-09-28 (AI · uỷ quyền human): `/legal/privacy` không hứa export cho khách (Q-28); thêm dòng `/cancel` (SCR-PAY-05, Q-18 · Q-25); §3 Q-09 đã chốt (Next.js SSG + revalidate); giá chỉ ở JSON-LD `Offer` của `/pricing`, lấy từ API-PAY-01 (Q-03, hết placeholder); Q-01 · Q-07 · Q-14 đã chốt; AI Notices cập nhật (trang chủ đề `?topic=` cần xác nhận cách render).
- 2026-09-27 · v1 · claude (subagent) · khởi tạo.

## 1. Route indexable

Danh sách route lấy từ `00-overview §3` (Indexable = index) và SYS-NAV §4.

| Route | SCR-ID | title (≤ 60) | meta description (≤ 155) | canonical | index / noindex | OG title / description / image (1200×630) | JSON-LD type | hreflang |
|---|---|---|---|---|---|---|---|---|
| `/` | SCR-PUB-01 | "Free Psychology Tests, Actually Scored · TestLib" | "Free personality, relationship and career tests, scored from your answers. Every score explained. Clear prices. Your answers never go to advertisers." | `https://<domain>/` | index | "Free psychology tests, actually scored" / "Take a free test and see every score explained. Clear prices, no surprise charges." / `/og/home.png` | `Organization` | — (chỉ en-US, Q-14) |
| `/tests` | SCR-PUB-02 | "All Tests: Personality, Relationships & Career · TestLib" | "Browse every test in the library. Each one shows its real number of questions and time before you start, and every scored summary is free." | `https://<domain>/tests` | index | "All tests" / "Every test shows its real length. Every scored summary is free." / `/og/tests.png` | không (tieu-chuan-chung §8 không yêu cầu) | — |
| `/tests?topic=[topic]` (**mẫu** — trang chủ đề) | SCR-PUB-02 | theo chip: "Personality Tests: Free and Scored · TestLib" · "Relationship Tests: Free and Scored · TestLib" · "Career Tests: Free and Scored · TestLib" · "Wellbeing Self-Checks, Not a Diagnosis · TestLib" | chủ đề thường: "Free [topic] tests, each showing its real number of questions and time before you start. Every scored summary is free." · Wellbeing: "Wellbeing self-checks that show their real length before you start. Not a diagnosis, with support resources on every test page." | `https://<domain>/tests?topic=[topic]` (tự canonical — SCR-PUB-02 EC-04) | index; chủ đề chưa có bài → noindex | "[Topic] tests" / câu mô tả như cột description / `/og/tests.png` | không | — |
| `/tests/:slug` (**mẫu**) | SCR-PUB-03 | bài thường: "[Test name] · Free, [n] Questions · TestLib" (tên ≤ 29 ký tự; dài hơn → "[Test name] · TestLib") · bài `sensitive`: "[Test name] · Free Self-Check, Not a Diagnosis · TestLib" (tên ≤ 15 ký tự; dài hơn → "[Test name] · Not a Diagnosis · TestLib") | bài thường: "[One-line description, ≤ 79 chars] [n] questions, about [m] min. Free scored summary with every score explained." · bài `sensitive`: "[One-line description, ≤ 57 chars] [n] questions, about [m] min. Not a diagnosis, with support resources on the page if you need them." | `https://<domain>/tests/[slug]` | index (bài `unpublished` → noindex; slug lạ → HTTP 404) | "[Test name]" / câu mô tả ngắn + "Free scored summary." (bài `sensitive`: + "Not a diagnosis.") / `/og/tests/[slug].png` sinh lúc build | `Quiz` + `FAQPage` | — |
| `/tests/big-five-personality-test` (ví dụ bài thường) | SCR-PUB-03 | "Big Five Personality Test · Free, [n] Questions · TestLib" | "See where you land on the five broad personality traits, from openness to emotional stability. [n] questions, about [m] min. Free scored summary." | `https://<domain>/tests/big-five-personality-test` | index | "Big Five Personality Test" / "Five traits, every score explained. Free scored summary." / `/og/tests/big-five-personality-test.png` | `Quiz` + `FAQPage` | — |
| `/tests/anxiety-test` (ví dụ bài `sensitive`) | SCR-PUB-03 | "Anxiety Test · Free Self-Check, Not a Diagnosis · TestLib" | "A self-check on how anxious you've felt lately. [n] questions, about [m] min. Not a diagnosis, with support resources on the page if you need them." | `https://<domain>/tests/anxiety-test` | index — tên trung thực (Q-06); **không chạy ads** (00-gtm-strategy §3) | "Anxiety self-check (not a diagnosis)" / "A self-reflection check. Not a diagnosis. Support resources included." / `/og/tests/anxiety-test.png` (ảnh trung tính, không điểm số) | `Quiz` + `FAQPage`; không dùng type y khoa (`MedicalWebPage`, `MedicalCondition`) — in-house, khớp Q-07 (không nhãn chẩn đoán) | — |
| `/pricing` | SCR-PUB-04 | "Pricing: Free Summaries, Full Reports & Plus · TestLib" | "Every test and scored summary is free. Unlock one full report or get Plus. See the renewal price, billing date and how to cancel before you pay." | `https://<domain>/pricing` | index | "Simple, honest pricing" / "Every test and summary is free. Pay only if you want the full report." / `/og/pricing.png` | `FAQPage` (FAQ ở pricing-page §4) + `Offer` cho 3 planKey trả phí: `price` · `priceCurrency` (USD) lấy từ API-PAY-01 lúc build + revalidate, cùng nguồn với giá hiển thị ($9.99 · $12.99 / month · $69.99 / year, chưa gồm thuế — `00-overview §2`, Q-03) | — |
| `/legal/privacy` | SCR-PUB-05 | "Privacy Policy · TestLib" | "What we collect, why and for how long. Your answers never go to advertisers. Delete your results anytime. Download all your data with a free account." | `https://<domain>/legal/privacy` | index | "Privacy Policy" / "What we collect and why. Your test answers never go to advertisers." / `/og/legal.png` | không | — |
| `/legal/terms` | SCR-PUB-05 | "Terms of Service · TestLib" | "The terms for using TestLib: free tests, one-time report purchases and the Plus subscription, in plain language, with the seller named." | `https://<domain>/legal/terms` | index | "Terms of Service" / "The terms for using TestLib, in plain language." / `/og/legal.png` | không | — |
| `/legal/subscriptions` | SCR-PUB-05 | "Subscriptions & Refunds · TestLib" | "How Plus renews, when we remind you, how to cancel in one step and how refunds work. Read this before you subscribe." | `https://<domain>/legal/subscriptions` | index | "Subscriptions & Refunds" / "How Plus renews, reminders, one-step cancellation and refunds." / `/og/legal.png` | không | — |
| `/legal/cookies` | SCR-PUB-05 | "Cookie Policy · TestLib" | "Which cookies we use and why. Only necessary cookies run until you choose, and you can change your choice anytime in Cookie settings." | `https://<domain>/legal/cookies` | index | "Cookie Policy" / "Only necessary cookies run until you choose." / `/og/legal.png` | không | — |
| `/help` | SCR-PUB-06 | "Help: Scoring, Billing & Privacy · TestLib" | "How our tests are scored, how billing and cancellation work, and how we protect your privacy. Can't find an answer? Send us a message." | `https://<domain>/help` | index | "Help" / "Scoring, billing, cancellation and privacy, answered." / `/og/help.png` | `FAQPage` | — |
| `/cancel` (+ `?mode=withdraw` · `&order=`) | SCR-PAY-05 | "Cancel Your Plan or Withdraw from a Purchase · TestLib" | "Cancel Plus renewal or withdraw from a purchase made in the last 14 days for a full refund. No sign-in needed: just your email and order number." | `https://<domain>/cancel` (bỏ `mode` · `order`) | index — để người muốn huỷ tìm được từ search (SYS-NAV §4) | "Cancel your plan or withdraw from a purchase" / "No sign-in needed. Cancel renewal anytime, or withdraw within 14 days for a full refund." / `/og/legal.png` | không | — |

## 2. Quy tắc chung

| Hạng mục | Quy tắc | Basis |
|---|---|---|
| Query | `?topic=` là trang chủ đề, giữ trong canonical (SCR-PUB-02 EC-04); `topic` lạ → URL sửa về `/tests` (SCR-PUB-02 EC-01); `utm_*` và tham số theo dõi khác không vào canonical | tieu-chuan-chung §8 · SCR-PUB-02 |
| `/cancel` | canonical luôn `https://<domain>/cancel`: `mode` · `order` không vào canonical; `order` (mã đơn) chỉ để điền sẵn phía client, không vào title / OG / analytics | SCR-PAY-05 · SYS-NAV §4 · tracking-events (Che URL) |
| Trailing slash | một dạng duy nhất (không slash cuối, trừ `/`); dạng còn lại 301 về dạng chuẩn | in-house |
| OG chung | `og:type` website · `og:site_name` "TestLib" · `og:locale` en_US · `twitter:card` summary_large_image | tieu-chuan-chung §8 |
| Ảnh OG | 1200×630, chữ lớn đọc được ở thumbnail; bài `sensitive`: nền trung tính, có "Not a diagnosis", không hiện điểm / kết quả | Q-06 · BR-APP-06 |
| Giá trong meta / OG / JSON-LD | chỉ trong JSON-LD `Offer` của `/pricing`, lấy từ API-PAY-01 lúc build + revalidate, bằng `00-overview §2` kèm chu kỳ; title / description / OG không ghi số giá (đổi giá không phải sửa meta) | Q-03 · Q-09 · `00-overview §2` |
| Bài `unpublished` / bị tắt theo vùng | `unpublished` → `noindex`; bài tắt theo vùng giữ index (nội dung vẫn đúng ở vùng khác) | SCR-PUB-03 §4 · cong-nghe-loi §6 |
| 404 / 500 | đúng HTTP status (không soft-404), `noindex`, có link về thư viện bài | tieu-chuan-chung §8 |
| Tên thương hiệu bên thứ ba | không xuất hiện trong title / description / OG / slug | Q-07 · 00-gtm-strategy §3 |

## 3. Rendering cho crawler

> **Q-09 (đã chốt): Next.js App Router, route public render sẵn (SSG + revalidate)** — `/`, `/tests`, `/tests/:slug`, `/pricing`, `/legal/:doc`, `/help`, `/cancel`; route funnel / app render phía client sau guard (đều noindex, §4). Crawler không chạy JS vẫn đọc đủ head + nội dung của mọi dòng §1; `/pricing` lấy giá từ API-PAY-01 lúc build + revalidate. Kiểm bằng pre-launch checklist #3 (00-gtm-strategy §6). Chỗ cần xác nhận: trang chủ đề `/tests?topic=` (AI Notices).

## 4. Route noindex

Mọi route dưới đây: `<meta name="robots" content="noindex">` + header `X-Robots-Tag: noindex`, KHÔNG có trong sitemap, và bị `Disallow` trong `web/robots.txt`.

| Route | SCR-ID | Access | Ghi chú |
|---|---|---|---|
| `/tests/:slug/take` | SCR-TEST-01 | guest | robots `Disallow: /tests/*/take` |
| `/results/:resultId` | SCR-TEST-02 | guest | dữ liệu cá nhân; chỉ chủ token / tài khoản xem được |
| `/unlock/:resultId` | SCR-PAY-01 | guest | trang tiền gắn một kết quả |
| `/checkout/return` | SCR-PAY-02 | guest | return URL của provider |
| `/account/billing` | SCR-PAY-03 | account | — |
| `/account/billing/cancel` | SCR-PAY-04 | account | vào từ email nhắc gia hạn |
| `/login` (+ `/login/callback`) | SCR-AUTH-01 | public | — |
| `/app` | SCR-APP-01 | account | — |
| `/app/reports` | SCR-APP-02 | account | — |
| `/app/reports/:reportId` (+ `?print=1`) | SCR-APP-03 | entitled | file PDF (signed URL, TD-03) cũng trả `X-Robots-Tag: noindex` |
| `/account` | SCR-ACC-01 | account | — |
| `/account/delete` | SCR-ACC-02 | account | — |
| `/cookie-settings` | SCR-PUB-07 | public | trang tiện ích, không có giá trị tìm kiếm |

> robots `Disallow` chặn crawl nên crawler không đọc được thẻ `noindex`; một URL riêng tư bị dán công khai vẫn có thể hiện dạng URL trần (không nội dung). Chấp nhận được vì nội dung riêng tư không bị crawl; cần gỡ hẳn thì dùng công cụ gỡ URL của Search Console.

## 5. AI Notices
- Độ dài title / description đếm theo ký tự; Google cắt theo độ rộng pixel nên có thể cắt sớm hơn.
- Description của `/legal/privacy` theo Q-28: khách tự xoá kết quả, tải toàn bộ dữ liệu cần tài khoản miễn phí; không hứa export cho khách. Hai câu cuối trùng nguyên văn dòng tin cậy ở landing-copy.
- `FAQPage`: theo hiểu biết của AI (cần verify), từ 2023 Google chỉ hiện rich result FAQ cho một số site chính phủ / y tế có thẩm quyền → markup vẫn hợp lệ nhưng không kỳ vọng rich result. `Quiz` là type mô tả theo tieu-chuan-chung §8, không kỳ vọng rich result `[INFERRED]`.
- Hai dòng ví dụ dùng slug giả định. Nguồn nội dung và quy tắc tên đã chốt ở Q-07 (không tên thương hiệu bên khác trong title / slug / tên type); catalog và tên bài thật chờ legal review (`bang-quyet-dinh` §2 #5). Route bài `sensitive` không có analytics (BR-APP-06) → hiệu quả SEO của chúng đo bằng Search Console.
- "TestLib" chỉ là tên làm việc (Q-01). Khi human chọn brand và domain (`bang-quyet-dinh` §2 #1) thì thay chuỗi ở mọi title, canonical, OG và file trong `web/`.
- Trang chủ đề `/tests?topic=[topic]` có title / canonical riêng theo query, nhưng Next.js App Router render theo request (không SSG) khi trang đọc `searchParams`. Cần owner (Q-09 · SYS-NAV §4 · SCR-PUB-02) chọn: render theo request + cache CloudFront theo `topic`, hoặc chuyển trang chủ đề sang route path. Chưa đổi gì ở file này.
- SCR-PUB-04 §10 ghi ví dụ title "Pricing · TestLib"; nguồn là dòng `/pricing` ở §1 (cùng mẫu `<Tên trang> · TestLib`) → SCR-PUB-04 cần sửa cho khớp.
