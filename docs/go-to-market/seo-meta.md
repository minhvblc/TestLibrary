# seo-meta — TestLib (tên tạm, Q-01) · mỗi route indexable một dòng
> Nguồn head meta cho mọi route public (`web/head-meta.html` chép dòng `/`). Copy dịch từ `00-gtm-strategy.md` §1 · §3; title theo mẫu `<Tên trang> · TestLib` (tieu-chuan-chung §8). Domain = `https://<domain>` (Q-01). Độ dài đã đếm theo ký tự (title ≤ 60 · description ≤ 155); dòng có `[n]` / `[m]` tính với số ≤ 2 chữ số.
**Changelog** (mới nhất trước)
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
| `/tests/anxiety-test` (ví dụ bài `sensitive`) | SCR-PUB-03 | "Anxiety Test · Free Self-Check, Not a Diagnosis · TestLib" | "A self-check on how anxious you've felt lately. [n] questions, about [m] min. Not a diagnosis, with support resources on the page if you need them." | `https://<domain>/tests/anxiety-test` | index — tên trung thực (Q-06); **không chạy ads** (00-gtm-strategy §3) | "Anxiety self-check (not a diagnosis)" / "A self-reflection check. Not a diagnosis. Support resources included." / `/og/tests/anxiety-test.png` (ảnh trung tính, không điểm số) | `Quiz` + `FAQPage`; không dùng type y khoa (`MedicalWebPage`, `MedicalCondition`) — đề xuất in-house | — |
| `/pricing` | SCR-PUB-04 | "Pricing: Free Summaries, Full Reports & Plus · TestLib" | "Every test and scored summary is free. Unlock one full report or get Plus. See the renewal price, billing date and how to cancel before you pay." | `https://<domain>/pricing` | index | "Simple, honest pricing" / "Every test and summary is free. Pay only if you want the full report." / `/og/pricing.png` | `FAQPage` (FAQ ở pricing-page §4); không `Offer` tới khi Q-03 chốt, sau đó giá phải khớp giá hiển thị (placeholder — Q-03) | — |
| `/legal/privacy` | SCR-PUB-05 | "Privacy Policy · TestLib" | "What we collect, why, where it goes and how long we keep it. We never send your test answers to advertisers. Download or delete your data anytime." | `https://<domain>/legal/privacy` | index | "Privacy Policy" / "What we collect and why. Your test answers never go to advertisers." / `/og/legal.png` | không | — |
| `/legal/terms` | SCR-PUB-05 | "Terms of Service · TestLib" | "The terms for using TestLib: free tests, one-time report purchases and the Plus subscription, in plain language, with the seller named." | `https://<domain>/legal/terms` | index | "Terms of Service" / "The terms for using TestLib, in plain language." / `/og/legal.png` | không | — |
| `/legal/subscriptions` | SCR-PUB-05 | "Subscriptions & Refunds · TestLib" | "How Plus renews, when we remind you, how to cancel in one step and how refunds work. Read this before you subscribe." | `https://<domain>/legal/subscriptions` | index | "Subscriptions & Refunds" / "How Plus renews, reminders, one-step cancellation and refunds." / `/og/legal.png` | không | — |
| `/legal/cookies` | SCR-PUB-05 | "Cookie Policy · TestLib" | "Which cookies we use and why. Only necessary cookies run until you choose, and you can change your choice anytime in Cookie settings." | `https://<domain>/legal/cookies` | index | "Cookie Policy" / "Only necessary cookies run until you choose." / `/og/legal.png` | không | — |
| `/help` | SCR-PUB-06 | "Help: Scoring, Billing & Privacy · TestLib" | "How our tests are scored, how billing and cancellation work, and how we protect your privacy. Can't find an answer? Send us a message." | `https://<domain>/help` | index | "Help" / "Scoring, billing, cancellation and privacy, answered." / `/og/help.png` | `FAQPage` | — |

## 2. Quy tắc chung

| Hạng mục | Quy tắc | Basis |
|---|---|---|
| Query | `?topic=` là trang chủ đề, giữ trong canonical (SCR-PUB-02 EC-04); `topic` lạ → URL sửa về `/tests` (SCR-PUB-02 EC-01); `utm_*` và tham số theo dõi khác không vào canonical | tieu-chuan-chung §8 · SCR-PUB-02 |
| Trailing slash | một dạng duy nhất (không slash cuối, trừ `/`); dạng còn lại 301 về dạng chuẩn | in-house |
| OG chung | `og:type` website · `og:site_name` "TestLib" · `og:locale` en_US · `twitter:card` summary_large_image | tieu-chuan-chung §8 |
| Ảnh OG | 1200×630, chữ lớn đọc được ở thumbnail; bài `sensitive`: nền trung tính, có "Not a diagnosis", không hiện điểm / kết quả | Q-06 · BR-APP-06 |
| Giá trong meta / OG / JSON-LD | không có tới khi Q-03 chốt; sau đó phải bằng `00-overview §2` (kèm chu kỳ) | placeholder — Q-03 |
| Bài `unpublished` / bị tắt theo vùng | `unpublished` → `noindex`; bài tắt theo vùng giữ index (nội dung vẫn đúng ở vùng khác) | SCR-PUB-03 §4 · cong-nghe-loi §6 |
| 404 / 500 | đúng HTTP status (không soft-404), `noindex`, có link về thư viện bài | tieu-chuan-chung §8 |
| Tên thương hiệu bên thứ ba | không xuất hiện trong title / description / OG / slug | Q-07 · 00-gtm-strategy §3 |

## 3. Rendering cho crawler

> **Q-09 (Mở, Group B).** Nếu route public chỉ render phía client (SPA), crawler không chạy JS chỉ thấy head của `index.html` → mọi route chung một title / description / OG, và bảng §1 vô tác dụng. Đề xuất đang ghi ở Q-09: SSR / SSG cho `/`, `/tests`, `/tests/:slug`, `/pricing`, `/legal/:doc`, `/help`; route app render phía client. Bảng §1 viết theo đề xuất đó nhưng **không coi là đã chốt**; kiểm bằng pre-launch checklist #3 (00-gtm-strategy §6).

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
- `FAQPage`: theo hiểu biết của AI (cần verify), từ 2023 Google chỉ hiện rich result FAQ cho một số site chính phủ / y tế có thẩm quyền → markup vẫn hợp lệ nhưng không kỳ vọng rich result. `Quiz` là type mô tả theo tieu-chuan-chung §8, không kỳ vọng rich result `[INFERRED]`.
- Hai dòng ví dụ dùng slug giả định; catalog và tên bài chốt ở Q-07. Route bài `sensitive` không có analytics (BR-APP-06) → hiệu quả SEO của chúng đo bằng Search Console.
- "TestLib" và `<domain>` đổi theo Q-01 → cập nhật mọi title, canonical, OG và file trong `web/`.
- SCR-PUB-04 §10 ghi ví dụ title "Pricing · TestLib"; nguồn là dòng `/pricing` ở §1 (cùng mẫu `<Tên trang> · TestLib`) → SCR-PUB-04 cần sửa cho khớp.
