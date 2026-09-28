# testlib — Research synthesis (web)
**Changelog** (mới nhất trước)
- 2026-09-28 · v1.1 · claude-opus-5-5 · thêm bằng chứng `[LIVE:web]` từ `apps/testlibrary-web/web-evidence.md` (F-35–F-43): pain P-02 · P-03 · P-04 có thêm lời người dùng; §4 giá theo thị trường; §G bề mặt search, uy tín bên thứ ba, nhóm sản phẩm cùng chủ; thêm Q-24. Không có quan sát browser mới (egress chặn).
- 2026-09-27 · v1 · claude-opus-5-5 · tổng hợp từ RS-testlibrary (teardown · tech-probe · legal-extract · design-report), `core-tech.md`, và `[LIVE:web]` (search review). n = 1 site.

## Provenance legend

| Tag | Nghĩa |
|---|---|
| `[LIVE:browser]` | drive thật trong Chrome research (EV-TLW-*, EV-KIT-*) |
| `[LIVE:web]` | review / bài viết bên thứ ba qua web search (không drive) |
| `[LIVE:user]` | capture human đưa (không có trong bộ này) |
| `[INFERRED]` | suy luận → PARK thành Q-xx khi có quyết định dựa vào |
| `[BLOCKED]` | login · paywall · bot · geo · payment |

## Fidelity note (đọc trước khi dùng)

| Mục | Mức |
|---|---|
| Site | **1** (testlibrary.com), đúng theo quyết định của user. Nhánh freemium / mua lẻ của category (16personalities, truity…) chưa được drive |
| Độ sâu | ẩn danh đầy đủ + member area bằng tài khoản trial của human (**post-checkout, human trả trước phiên**, Plan = Cancelled) |
| Giá | `[LIVE:browser]`, USD, en-US, IP VN, logged-out; không thấy thuế; không có biến thể theo vùng vì không VPN |
| Bị chặn | consent ở IP EU (`geo`), màn sau thanh toán + email vòng đời (`payment` / `login`), chất lượng report trả phí (free-tier rule) |
| Safety wall | không nhập email/thẻ ở checkout, không bấm huỷ, không mua |
| Phiên 2 (2026-09-28) | không drive được (container cloud bị egress chặn). Chỉ thêm `[LIVE:web]`: tóm tắt của công cụ search về review, khiếu nại, search index, pháp nhân (`web-evidence.md`). Không trang nào được mở trực tiếp; số liệu không dùng làm mốc |

## §1 Product overview & core functions

| # | Function | Mô tả | Tag · EV |
|---|---|---|---|
| 1 | Catalog test | 30 bài (personality, quan hệ, nghề nghiệp, IQ, "mental health") | `[LIVE:browser · EV-TLW-014]` |
| 2 | Funnel SEO free | 25 trang `/free-tests/<slug>`, 19 câu, "kết quả" tức thì | `[LIVE:browser · EV-TLW-052 · EV-TLW-079]` |
| 3 | Funnel trả phí | bài 100 câu → offer → checkout $1.95 → subscription $39.95/4 tuần | `[LIVE:browser · EV-TLW-083 · EV-TLW-108 · EV-TLW-112]` |
| 4 | Report + PDF | report dài theo type, PDF 11 trang | `[LIVE:browser · EV-TLW-245 · EV-TLW-261]` (post-checkout) |
| 5 | Dashboard giữ chân | check-in + streak, thử thách 30 ngày, insight + poll tuần | `[LIVE:browser · EV-TLW-209–214]` (post-checkout) |
| 6 | Tài khoản & huỷ | profile, plan details, huỷ qua email | `[LIVE:browser · EV-TLW-046 · EV-TLW-247]` |

## §2 Actors + pain points

Actors: **khách ẩn danh** (từ SEO/ads) · **người trả trial** · **member** · **người muốn huỷ** · (phía mình) **biên tập viên nội dung**.

| P-xx | Pain | Bằng chứng (EV / nguồn) | Tag | Site |
|---|---|---|---|---|
| P-01 | Muốn hiểu bản thân (tính cách, quan hệ, nghề nghiệp) nhanh, rõ, không jargon | positioning "The tests that reveal the Real You", "No waiting and no confusing jargon" (EV-TLW-014 · EV-TLW-025); category tồn tại với nhiều site cùng mô hình (§2 applications-list) | `[LIVE:browser]` + `[INFERRED]` (nhu cầu) | testlibrary |
| P-02 | Bị trừ tiền định kỳ bất ngờ sau khoản $1.95 | review: phàn nàn phí ẩn, bị ghi danh gói ~$39–55+/tháng (S13); 11 nguồn độc lập kể cùng mẫu "trả $1.95 → bị trừ $39.95 sau 7 ngày", 7 nguồn nói điều khoản chỉ ở chữ nhỏ hoặc trong email sau khi mua, 2 nguồn nói không có email nhắc (F-42); tên lạ "NordicaLab" trên sao kê (F-37); offer không có chữ nào về gia hạn (F-17); checkout funnel không checkbox (F-18) | `[LIVE:web]` + `[LIVE:browser]` | testlibrary |
| P-03 | Khó huỷ, khó được hoàn tiền | review: email huỷ/hoàn không được trả lời (S13); hoàn tiền theo thang 25% → 40% → 100%, hoàn đủ khi doạ chargeback (3 nguồn); huỷ rối hoặc "không có subscription để huỷ" (4 nguồn); BBB rating F vì 18 khiếu nại không trả lời (F-41 · F-42); huỷ qua link xác minh email, huỷ có hiệu lực ngay (F-11); hoàn tiền tuỳ ý (F-29) | `[LIVE:web]` + `[LIVE:browser]` | testlibrary |
| P-04 | Kết quả chung chung, không phản ánh câu trả lời | kết quả free cố định với mọi pattern (F-14); 2 nguồn review gọi report là "generic", "horoscope" (F-42) | `[LIVE:browser]` + `[LIVE:web]` | testlibrary |
| P-05 | Lo ngại riêng tư khi trả lời câu hỏi nhạy cảm (sức khoẻ tinh thần, tình dục, chính trị) | pixel quảng cáo bắn theo từng câu (F-13); văn bản coi câu trả lời là dữ liệu nhạy cảm, đồng ý ngay khi gửi (F-29) | `[LIVE:browser]` (hành vi) · `[INFERRED]` (pain của user) | testlibrary |
| P-06 | Bài dài (100 câu, "20 mins") dễ bỏ ngang | bài đầy đủ 20 trang (F-15); bài free chỉ 19 câu | `[INFERRED]` | testlibrary |
| P-07 | Muốn biến kết quả thành hành động/thói quen, không chỉ đọc report | đối thủ đầu tư thử thách 30 ngày + check-in (F-21) | `[INFERRED]` | testlibrary |

## §3 Feature-union matrix

| Journey | Feature | testlibrary | P (priority) | Our-gap |
|---|---|---|---|---|
| Acquisition | Trang SEO cho từng bài test | ✅ `[LIVE:browser]` (25 trang, F-04) | Must | cần làm tốt hơn (OG, hreflang, JSON-LD — F-27) |
| Acquisition | Landing + catalog | ✅ `[LIVE:browser]` | Must | — |
| Activation | Làm bài không cần tài khoản | ✅ `[LIVE:browser]` (F-13) | Must | — |
| Activation | Resume sau reload / offline | ✅ `[LIVE:browser]` (TK-04/05) | Common | — |
| Activation | Kết quả tóm tắt free | ⚠️ `[LIVE:browser]` có nhưng không phụ thuộc câu trả lời (F-14) | Must | **làm thật** |
| Money | Offer / paywall sau khi làm bài | ✅ `[LIVE:browser]` (F-17) | Must | minh bạch gia hạn |
| Money | Pricing page | ✅ `[LIVE:browser]` (F-05) | Must | — |
| Money | Checkout có consent gia hạn rõ | ⚠️ `[LIVE:browser]` có ở pricing, thiếu ở funnel (F-08 · F-18) | Must | consent mọi checkout |
| Money | Nhắc trước khi trial chuyển | ❌ `[LIVE:browser]` văn bản không nêu (F-29) | Must (luật) | **khác biệt** |
| Money | Huỷ tự phục vụ 1 bước | ⚠️ `[LIVE:browser]` qua email + link xác minh (F-11) | Must (luật) | **khác biệt** |
| Core | Report dài theo type | ✅ `[LIVE:browser]` post-checkout (F-23) | Must | — |
| Core | Export PDF | ✅ `[LIVE:browser]` post-checkout (F-23) | Common | — |
| Core | Nhiều dạng câu hỏi (Likert 1/màn, 5/trang, câu đố có giờ) | ✅ `[LIVE:browser]` (F-25) | Common | — |
| Retention | Daily check-in + streak | ✅ `[LIVE:browser]` post-checkout (F-21) | Common | — |
| Retention | Thử thách 30 ngày | ✅ `[LIVE:browser]` post-checkout (F-21) | Differentiator | — |
| Retention | Insight + poll cộng đồng tuần | ✅ `[LIVE:browser]` post-checkout (F-21) | Differentiator | — |
| Retention | Lịch sử report | ✅ `[LIVE:browser]` (F-22) | Must | — |
| Trust | Disclaimer y tế + hỗ trợ khủng hoảng | ⚠️ disclaimer có, không có thông tin hỗ trợ khủng hoảng (legal-extract §8) | Must (với bài sức khoẻ tinh thần) | **khác biệt** |
| Trust | Consent banner + tracking theo consent | ❌ `[LIVE:browser]` không banner ở IP VN (F-02) | Must (EU) | **khác biệt** |
| Account | Xoá tài khoản / export dữ liệu | ❌ `[LIVE:browser]` profile không có (EV-TLW-246) | Must (GDPR) | **khác biệt** |
| i18n | Nhiều ngôn ngữ | ⚠️ ≥ 11 nhưng điều khoản giá không dịch (F-07) | Common | — |

## §4 Per-site pricing + monetization consensus

**testlibrary.com** — pricing profile: `mixed` (trial trả phí → subscription 4 tuần + one-time 1 bài) · tiers `multi` · billing 4 tuần (13 kỳ/năm) · trial `card-required` 7 ngày $1.95 · offer `intro` (neo "$15.00 · -87%") · không gói free · không enterprise · USD không bản địa hoá · không dòng thuế `[LIVE:browser · EV-TLW-025 · EV-TLW-112]`.

| Gói (VERBATIM) | Giá | Chu kỳ | Locale / region | Tag · EV |
|---|---|---|---|---|
| One Time | "$57.00" · "One test with its full report. No subscription." | một lần | en-US · VN | `[LIVE:browser · EV-TLW-025 · 2026-09-27]` |
| 7-day Full Access | "$1.95" · "then $39.95 every 4 weeks." | 7 ngày → 4 tuần | en-US · VN | `[LIVE:browser · EV-TLW-025 · 2026-09-27]` |
| 28-day Full Access | "$39.95" · "then $39.95 every 4 weeks." | 4 tuần | en-US · VN | `[LIVE:browser · EV-TLW-025 · 2026-09-27]` |
| Premium Personality Report (funnel) | "$15.00" · "Discount (-87%)" · "Total: $1.95" → "$39.95 every 4 weeks" | 7 ngày → 4 tuần | en-US · VN | `[LIVE:browser · EV-TLW-112 · 2026-09-27]` |

Paywall surfaces: `pricing-page` (soft) · `upgrade-cta` ở kết quả free (soft) · `onboarding-plan-picker` = offer (**hard**, bẫy back) · `checkout` ×2 biến thể · `billing-settings` (teardown §4.5).
Checkout: first-party, Apple Pay + Google Pay + thẻ; không "Powered by" `[LIVE:browser · EV-TLW-033]`.
Giá theo thị trường (`[LIVE:web]`, không phải mốc giá): người review kể £1.95 → £39.95, 1,95 € → 39,95 €, AUD 1.95 → 54.95, HUF 710 → 10.930; biến thể PayPal $1.99 → $39.99; bài blog tháng 6/2026 còn ghi gói Lifetime $99.95. Khoản gia hạn nhiều khi hiện tên "NordicaLab" trên sao kê (web-evidence F-37 · F-38).
**Consensus (n=1):** subscription tự gia hạn là nguồn thu; paywall đặt **sau khi user đã đầu tư công làm bài** (sunk cost); trial cần thẻ.

## §G Mặt tiền & phân phối

| Hạng mục | Quan sát | Tag · EV |
|---|---|---|
| First visit | không cookie banner, không popup, không chat (IP VN) | `[LIVE:browser · EV-TLW-002]` |
| Landing | hero → carousel test → chủ đề → 3 bước → lợi ích → FAQ → footer; mọi CTA card → pricing | `[LIVE:browser · EV-TLW-013]` |
| SEO | 25 trang `/free-tests/<slug>` nhắm từ khoá lâm sàng; không OG / hreflang / JSON-LD; sitemap 403 với crawler không-JS | `[LIVE:browser · EV-TLW-052 · EV-TLW-015 · EV-TLW-001]` |
| Search index | không URL `/free-tests/` nào được index; bề mặt được index là root funnel trả phí từng bài ("<X> Test - Get Your Accurate <X> Trait Report"), vài URL mang tham số chiến dịch, một URL checkout kèm `sessionId`; locale trong index chỉ de · fr · es; có domain sinh đôi testlibrary.us | `[LIVE:web]` · web-evidence F-39 · F-40 |
| Uy tín bên thứ ba | Trustpilot 4,1/5 (khoảng 25–30 nghìn review, 8% một sao, công ty trả lời 98–99% review xấu); BBB rating F, không accredited; ProductReview 1/5; nhiều blog "scam or legit" từ 6/2026; offer lại ghi "Rated 4.8/5" | `[LIVE:web]` · web-evidence F-41 |
| Nhóm sản phẩm cùng chủ | Aura Health LLC đứng tên ở testlibrary.com, mytraitsprofile.com (cùng mô hình giá) và salo.health; Haur B.V. có app Your Novella; các pháp nhân thành lập 2025 | `[LIVE:web]` · web-evidence F-35 · F-36 |
| Kênh trả phí | Meta Pixel · Bing UET · Google Ads conversion chạy từ lần đầu → có chạy quảng cáo | `[LIVE:browser]` (pixel) · `[INFERRED]` (chạy ads) |
| Kênh khác | không app store badge, không extension, không blog | `[LIVE:browser · EV-TLW-014]` |

## §S Screen inventory (union)

**Onboarding lead-block (scorecard):**

| Axis | testlibrary |
|---|---|
| gate-order | SEO page → giới tính → test → analyzing → offer → checkout (email + thẻ) → đặt mật khẩu (lời kể) → dashboard |
| account-gate | `required-before-value` cho report thật; bài free không cần |
| auth-methods | email + password |
| personalization | `light` (giới tính → avatar) |
| time-to-value | free: 1 + 19 câu (median 2,69 s tới kết quả); report thật: 100 câu + trả tiền |
| monetization-first-seen | `landing-pricing` (site gốc) · `post-onboarding` (funnel) |
| permission-timing | không có soft-ask / prompt |

| CS-xx | Screen | canonical-state | testlibrary (SC · EV) | Fidelity |
|---|---|---|---|---|
| CS-01 | Landing | default | SC-TLW-01 · EV-TLW-013 | LIVE-full |
| CS-02 | Catalog / thư viện test | default | SC-TLW-11 · EV-TLW-050 · SC-TLW-23 · EV-TLW-215 | LIVE-full |
| CS-03 | Giới thiệu bài test (bắt đầu) | default | SC-TLW-12 · EV-TLW-053 · SC-TLW-15 · SC-TLW-17 · EV-TLW-082 | LIVE-full |
| CS-04 | Câu hỏi 1/màn | default · offline · resume | SC-TLW-13 · EV-TLW-054 · EV-TLW-060 · EV-TLW-065 | LIVE-full |
| CS-05 | Trang nhiều câu / câu đố có giờ | default | SC-TLW-18 · EV-TLW-083 · SC-TLW-28 · EV-TLW-252 | LIVE-full |
| CS-06 | Loader / "đang phân tích" | loading | SC-TLW-16 · SC-TLW-20 · EV-TLW-081 · EV-TLW-106 | LIVE-full |
| CS-07 | Kết quả tóm tắt (free) | default | SC-TLW-14 · EV-TLW-079 | LIVE-full |
| CS-08 | Offer / paywall sau bài | locked | SC-TLW-21 · EV-TLW-108 | LIVE-full |
| CS-09 | Pricing | default | SC-TLW-04 · EV-TLW-024 | LIVE-full |
| CS-10 | Checkout | default (không nhập) | SC-TLW-05 · SC-TLW-22 · EV-TLW-033 · EV-TLW-111 | partial (observe-only) |
| CS-11 | Đăng nhập | default | SC-TLW-02 · EV-TLW-006 | LIVE-full |
| CS-12 | Dashboard | empty · success | SC-TLW-03 · EV-TLW-209 · EV-TLW-210 | LIVE-full (post-checkout) |
| CS-13 | Danh sách report | default | SC-TLW-24 · EV-TLW-241 | LIVE-full (post-checkout) |
| CS-14 | Report chi tiết + PDF | default | SC-TLW-25 · EV-TLW-244 · EV-TLW-261 | LIVE-full (post-checkout) |
| CS-15 | Profile | default | SC-TLW-26 · EV-TLW-246 | LIVE-full (post-checkout) |
| CS-16 | Gói & thanh toán | cancelled | SC-TLW-27 · EV-TLW-247 | partial (không thấy trạng thái active) |
| CS-17 | Huỷ gói | default | SC-TLW-07 · EV-TLW-046 | partial (không bấm) |
| CS-18 | Văn bản pháp lý | default | SC-TLW-06 · EV-TLW-040 | LIVE-full |
| CS-19 | FAQ · About · Contact | default | SC-TLW-08 · SC-TLW-09 · SC-TLW-10 · EV-TLW-047–049 | LIVE-full |
| CS-20 | Xác nhận hoàn thành bài | success | SC-TLW-19 · EV-TLW-105 | LIVE-full |
| CS-21 | Sau thanh toán (đặt mật khẩu / xác nhận đơn) | — | không quan sát | `[BLOCKED · payment]` |

## §N Điều hướng — pattern

| Pattern | testlibrary (SC · #log teardown §4.2(c)) | Consensus | Tag |
|---|---|---|---|
| Khung @1280 vs @390 | nav ngang ↔ hamburger; không bottom nav (SC-TLW-01 · SC-TLW-03) | n=1 | `[LIVE:browser]` |
| #click landing → giá trị đầu tiên | site gốc: không có (mọi CTA → pricing); qua footer "Free Tests": 2 click + giới tính + 19 câu; từ SEO: giới tính + 19 câu (#15–#18) | n=1 | `[LIVE:browser]` |
| Vào core loop | trang mới (push), URL giữ nguyên trong bài free (#16–#17), URL đổi theo trang ở bài 100 câu (#23) | n=1 | `[LIVE:browser]` |
| Paywall | trang riêng (offer) + checkout trang riêng, URL đổi (#26–#27) | n=1 | `[LIVE:browser]` |
| Back trình duyệt | từ offer bị kéo lại offer (bẫy back, #26) | n=1 | `[LIVE:browser]` |
| Link chia sẻ / mở thẳng URL | trang free resume theo localStorage (EV-TLW-117); offer mở lại được trong cùng context; context khác chưa thử | n=1 | `[LIVE:browser]` |
| Member | tab ở header (Home · Test library · Your reports); làm test member đi qua funnel page chung, "Get My Results" → thẳng Your reports (#29–#32) | n=1 | `[LIVE:browser]` |

## §R Responsive consensus

390: nav vào hamburger; card test thành carousel một thẻ; khối 2 cột (pricing, offer, checkout, free test intro) xếp chồng; đồng hồ offer giữ ở header; không tràn ngang trên các trang đã chụp `[LIVE:browser · EV-TLW-203–207 · EV-TLW-255–258]`.

## §U Personas (`[INFERRED]` từ catalog + copy)

| Persona | Mô tả | Test quan tâm | Nhạy cảm |
|---|---|---|---|
| U1 · Người tò mò | 18–35, vào từ search/social, muốn kết quả nhanh và chia sẻ được | personality, love style, soulmate, spirit animal | thấp |
| U2 · Người đang tìm lời giải | nghi ngờ bản thân có ADHD/trầm cảm/…, cần hiểu và cần hướng đi tiếp | mental health, neurodivergent | **cao** (cần disclaimer, hướng dẫn hỗ trợ) |
| U3 · Người phát triển sự nghiệp | muốn biết điểm mạnh, nghề phù hợp | career, strengths, DISC | trung bình |

## §K Scenarios

| # | Loại | Kịch bản |
|---|---|---|
| K1 | Happy | U1 vào trang SEO bài tính cách → làm 20–30 câu → thấy kết quả tóm tắt thật → mua report đầy đủ → đọc + tải PDF |
| K2 | Happy | U3 dùng thử miễn phí → làm 3 bài → nâng cấp gói để mở mọi report |
| K3 | Edge | rớt mạng giữa bài → vẫn làm tiếp, nộp khi có mạng |
| K4 | Edge | trial sắp hết → nhận email nhắc 2 ngày trước → huỷ trong tài khoản 1 bước, vẫn dùng tới hết kỳ |
| K5 | Edge | U2 làm bài "mood" với điểm cao → thấy disclaimer + nguồn hỗ trợ, không bị bắn pixel quảng cáo |
| K6 | Edge | mở link kết quả được bạn chia sẻ → thấy bản chia sẻ công khai (không lộ câu trả lời) |

## Open questions (harvest → `docs/overview/bang-quyet-dinh.md`)

| Q-xx | Câu hỏi | Nguồn | Group |
|---|---|---|---|
| Q-01 | Tên sản phẩm, brand, domain | — | B |
| Q-02 | Mô hình kiếm tiền (trial → subscription minh bạch / freemium + mua lẻ / chỉ subscription) | F-05 · F-17 · P-02 | A |
| Q-03 | Bảng giá, chu kỳ (tháng vs 4 tuần), trial (có phí? cần thẻ?) | F-05 | A |
| Q-04 | Payment provider / merchant-of-record | F-10 | A |
| Q-05 | Pháp nhân, vùng bán, luật áp dụng | F-12 · F-29 | A |
| Q-06 | Có đưa bài chủ đề sức khoẻ tinh thần vào MVP không | F-04 · P-05 | B |
| Q-07 | Nguồn nội dung test + bản quyền/thương hiệu (tên MBTI/16P/Enneagram/StrengthsFinder/DISC…) | F-04 | B |
| Q-08 | Cách sinh report (viết sẵn theo type / LLM / hybrid) + cách xuất PDF | F-23 · F-34 | A |
| Q-09 | Rendering public routes (SSR / prerender / static) + framework | F-27 | B |
| Q-10 | Chấm điểm client hay server | F-31 · F-14 | B |
| Q-11 | Mô hình tài khoản & auth (guest, email trước/sau kết quả, magic link / Google) | F-20 | B |
| Q-12 | Pixel quảng cáo / conversion API | F-13 · F-02 | B |
| Q-13 | Phạm vi vùng hiện consent banner | F-02 | B |
| Q-14 | Locale ra mắt | F-07 | B |
| Q-15 | Tính năng retention trong MVP | F-21 | B |
| Q-16 | Email vòng đời + vendor | F-29 | B |
| Q-17 | FND tokens (màu, font) | design-report | C |
| Q-18 | Chính sách hoàn tiền & huỷ | F-11 · F-29 · F-30 | A |
| Q-19 | COGS / op (LLM, PDF, hosting) | core-tech §8 | A |
| Q-24 | Tên hiện trên sao kê (billing descriptor) cho mọi phương thức thanh toán | web-evidence F-37 · P-02 | B |

## AI Notices
- Mọi pattern ở §N/§R là n=1, không phải chuẩn thị trường.
- P-05/P-06/P-07 là suy luận từ hành vi đối thủ, không có lời người dùng trực tiếp. Lượt search 2026-09-28 không thấy nguồn nào phàn nàn về riêng tư (P-05); một số review có nhắc phải trả lời "100 questions" trước khi thấy kết quả, gần với P-06 (`web-evidence.md` §3).
- Bằng chứng `[LIVE:web]` của phiên 2 là tóm tắt do công cụ search viết, có chỗ mâu thuẫn nhau; đếm theo số nguồn, không phải số ca (`web-evidence.md` §0 · §12).
