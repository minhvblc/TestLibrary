# [RS-testlibrary] Tech probe — Testlibrary · engine làm test + report
**Changelog** (mới nhất trước)
- 2026-09-27 · v1 · claude-opus-5-5 · L0–L5 cho TC-01 trên free tier (kit TK-01..05); TC-02 chỉ quan sát post-checkout (tài khoản trial của human, không mua thêm).

## 0. Meta

| Site · ngày | Browser · viewport · locale · mạng | Tài khoản | Quota free (VERBATIM) | Ladder chạy tới |
|---|---|---|---|---|
| testlibrary.com · 2026-09-27 | Chrome 153 · 1280×800 · en-US · wifi văn phòng, IP VN (Cloudflare POP `SIN`) | TC-01: ẩn danh (free) · TC-02: research account trial của human (post-checkout) | không có câu quota nào; bài free làm lại được nhiều lần (5 run, 5 fresh context) | L0–L5 (TC-01) · L0 + L4 (TC-02) |

## 1. Capability đo

| TC-xx | Capability | Vì sao là cốt lõi của category |
|---|---|---|
| TC-01 | Engine làm test: flow câu hỏi · lưu tiến độ · chấm điểm → kết quả | kết quả sai/không đáng tin → sản phẩm mất lý do tồn tại |
| TC-02 | Sinh report dài theo kết quả + export PDF | report là thứ khách trả tiền mua |

## 2. L0 — Bề mặt công khai

| Nguồn | Ghi nhận VERBATIM | Tag | EV |
|---|---|---|---|
| headers `/` (curl) | `HTTP/2 403` · `cf-mitigated: challenge` · `server: cloudflare` · `cf-ray: …-SIN` · CSP của trang challenge chỉ cho `challenges.cloudflare.com` | `[LIVE:browser]` | EV-TLW-001 |
| robots / sitemap / security.txt / llms.txt | robots `User-Agent: *` `Disallow:` · sitemap.xml **403** · security.txt 404 · llms.txt 404 | `[LIVE:browser]` | EV-TLW-001 |
| fingerprint landing | DOM marker `nuxt` · globals `dataLayer` · `fbq` · `uetq` · host 1st-party `testlibrary.com`, `img.testlibrary.com`, `load.data.testlibrary.com`, `data.testlibrary.com` · 3rd-party: doubleclick, bat.bing.com, connect.facebook.net, googleadservices, cloudflareinsights, analytics.google.com · không manifest · không service worker | `[LIVE:browser]` | EV-TLW-015 |
| cookie / storage (tên) | cookie `_ga`, `_fbp`, `FPLC`, `FPAU`, `FPGSID`, `_gcl_au`, `_uetsid`, `_uetvid`, `locale` · local `quiz-free-personality-test`, `lastExternalReferrer`, `_uetvid`… · session `user-country`, `country-fetched`, `_cltk` | `[LIVE:browser]` | EV-TLW-015 · EV-TLW-066 |
| fingerprint app shell (member) | host `vyynofnoabzsywbgmfal.supabase.co` (class backend-as-a-service) · cookie `sb-vyynofnoabzsywbgmfal-auth-token` · `__kla_id` · `_conv_v`/`_conv_s` · local `quiz-personality-test`, `quiz-sid-personality-test`, `iq-test-progress`, `iq-test-sid`, `klaviyoOnsite`, `__kl_key` | `[LIVE:browser]` | EV-TLW-254 |
| checkout | script `applepay.cdn-apple.com` · `pay.google.com` (iframe Google Pay) · ô thẻ là textbox first-party (không iframe PSP thấy được) · không "Powered by" · logo "stripe" trong dải trust | `[LIVE:browser]` | EV-TLW-035 · EV-TLW-113 · EV-TLW-033 |
| Suy vendor | Nuxt (framework) · Cloudflare (CDN + bot) · Supabase (auth/DB) · server-side tag gateway Google (cookie `FPLC`/`FPAU`/`FPGSID` + `data.` subdomain) · Klaviyo (email) · Convert (A/B) · Stripe (PSP?) | `[INFERRED]` | — |

> Tên vendor chỉ là suy từ dấu vết; không có trang nào tự công bố.

## 3. L1 + L5 — Chạy test kit (free flow, bài `/free-tests/personality-test`, 19 câu, chọn "Male")

| TK-xx | Input | Kết quả (VERBATIM) | Rubric vs `tech-kit/ground-truth.md` | Thời gian | Tag | EV |
|---|---|---|---|---|---|---|
| TK-01 | mọi câu "Strongly Agree" | "The Reformer" · 95 Reformer · 95 Helper · 63 Individualist · 63 Investigator · 63 Loyalist · 63 Enthusiast · 63 Challenger · 63 Peacemaker · 32 Achiever | GT-02: 2/9 thang ở mức cao nhất (95) — không phải "tất cả max" | 1.948 ms (câu cuối → kết quả) | `[LIVE:browser]` | EV-TLW-076 |
| TK-02 | mọi câu "Strongly Disagree" (fresh context) | **y hệt TK-01** | GT-01: **0/9 thang khác** → `answer-insensitive` | 2.690 ms | `[LIVE:browser]` | EV-TLW-138 |
| TK-03 | mọi câu "Neutral" (fresh context) | **y hệt TK-01**, không cảnh báo | GT-03: không ra dải giữa, không cảnh báo inconsistency | 2.759 ms | `[LIVE:browser]` | EV-TLW-159 |
| TK-04 | TK-01 tới câu 10/19 → reload | vẫn ở "10/19" | GT-04: `resume` | — | `[LIVE:browser]` | EV-TLW-065 |
| TK-05 | TK-01 tới câu 5/19 → offline → trả lời 2 câu → online | 2 câu đều sang câu kế bình thường, không có thông báo lỗi | GT-05: `client-side flow` (2 câu offline) | — | `[LIVE:browser]` | EV-TLW-060 · EV-TLW-061 |
| TK-01 (chạy lại) | như TK-01, fresh context | y hệt | lặp lại được (deterministic) | 2.085 ms | `[LIVE:browser]` | EV-TLW-180 |
| ngoài kit | "Female" + mọi câu "Strongly Agree" | y hệt (chỉ avatar đổi) | kết quả không phụ thuộc giới tính | — | `[LIVE:browser]` | EV-TLW-202 |

## 4. L2 — Network-class + offline

| Thao tác | Request trong lúc chạy (host · class · upload? · stream?) | Offline → kết quả | Copy lỗi VERBATIM | Kết luận | Tag | EV |
|---|---|---|---|---|---|---|
| Trả lời câu 1–4 (free) | 8 POST `www.facebook.com/tr/` (~3 KB mỗi cái) + 1 POST `bat.bing.com/p/conversions/c/h`; **0 request first-party** | trả lời tiếp được | không có | flow in-browser | `[LIVE:browser]` (quan sát) · `[INFERRED]` (in-browser) | EV-TLW-059 · EV-TLW-061 |
| Trả lời câu 10–19 + mở kết quả (free) | first-party: 28 script chunk GET + 1 GET `data.testlibrary.com` + 2 ảnh avatar; 3rd-party: 22 Facebook, 7 Bing, 1 Google Ads, 2 google.com.vn conversion; **không upload câu trả lời lên first-party** | không thử | — | chấm điểm in-browser | `[LIVE:browser]` · `[INFERRED]` | EV-TLW-077 |
| Làm bài 100 câu (ẩn danh, 19 trang) | 274 Facebook (`/tr/`), 79 Bing, 80 Cloudflare RUM, 20 Google Ads conversion (1/trang), 41 google.com.vn 1p-conversion, 21 GET `data.testlibrary.com`; first-party chỉ script/stylesheet | không thử | — | câu trả lời giữ phía client tới cuối | `[LIVE:browser]` · `[INFERRED]` | EV-TLW-104 |
| "Get My Results" (member) | 1 POST first-party (endpoint class "lưu kết quả", 1,78 s) → redirect `/dashboard/reports` | không thử | — | kết quả member lưu server | `[LIVE:browser]` · `[INFERRED]` | EV-TLW-242 |
| Daily check-in (member) | 1 POST first-party 51 B (class "check-in") | không thử | — | lưu server | `[LIVE:browser]` | EV-TLW-211 |

> Endpoint chỉ ghi ở mức class ("có endpoint lưu kết quả"), không chép path vào `api/`, không gọi lại.

## 5. L3 — Latency + page weight

| Thao tác | Run 1 | Run 2 | Run 3 | Median | Range | Điều kiện mạng | Tag | EV |
|---|---|---|---|---|---|---|---|---|
| free: câu cuối → kết quả hiện (`free-personality last-answer→result`) | 2.690 ms (TK-02) | 2.759 ms (TK-03) | 2.085 ms (TK-01 rerun) | **2.690 ms** | 2.085–2.759 | wifi VN | `[LIVE:browser]` | EV-TLW-181 |
| bài 100 câu: "Next" trang 20 → "Well done!" | 1.294 ms | — | — | n=1 (không median) | — | wifi VN | `[LIVE:browser]` | EV-TLW-181 |

| Trang (perf ×3, cold cache) | TTFB | LCP | CLS | Requests | Bytes | JS bytes | Tag | EV |
|---|---|---|---|---|---|---|---|---|
| `/` (ẩn danh) | xem file | 492 ms | 0,006 | 88 | 1,8 MB | 1.021 KB | `[LIVE:browser]` | EV-TLW-262 |
| `/free-tests/personality-test` | xem file | 600 ms | 0 | 56 | 1,1 MB | 989 KB | `[LIVE:browser]` | EV-TLW-263 |

> Timing "complete analyzing-loader duration" ghi 0 ms (settle none) vì loader đã xong trước khi bước đo bắt đầu → **không hợp lệ, không dùng**.

## 6. L4 — Artifact forensics

| File (artifacts/) | Size | `/Producer` · `/Creator` | Text layer? | Trang · DPI · kích thước | Watermark | Tag | EV |
|---|---|---|---|---|---|---|---|
| `personality-test-report.pdf` (post-checkout, human cho phép 1 file) | 4.689.518 B | `Skia/PDF m128` · `Mozilla/5.0 (X11; Linux x86_64…` · `/Title about:blank` | có (32 font ref) | **11 trang** | không kiểm | `[LIVE:browser]` (bytes) · `[INFERRED]` (render bằng headless Chromium phía server) | EV-TLW-261 |

## 7. Giới hạn free chạm phải

| Giới hạn | Chạm ở bước nào | Phần probe bị chặn |
|---|---|---|
| Không có report thật nếu chưa trả: offer là hard paywall | sau bài 100 câu | TC-02 trên free tier (report, PDF) → chỉ quan sát bằng tài khoản trial có sẵn của human |
| Kết quả free cố định | mọi run | không có |

## 8. Findings (tiếp dãy F của RS-testlibrary)

| F-xx | Finding | Bằng chứng (EV) | Tag | Confidence |
|---|---|---|---|---|
| F-31 | Bài free không gửi câu trả lời lên first-party trong suốt 19 câu + lúc ra kết quả; chỉ tải thêm script chunk → chấm điểm in-browser | EV-TLW-059 · EV-TLW-077 | `[LIVE:browser]` (quan sát) · `[INFERRED]` (class) | cao |
| F-32 | Câu cuối → kết quả free: median 2.690 ms (2.085–2.759, n=3, wifi VN); chủ yếu là tải script chunk lười | EV-TLW-181 · EV-TLW-077 | `[LIVE:browser]` | cao |
| F-33 | Kết quả member được lưu qua 1 POST first-party (1,78 s) rồi redirect sang Your reports; storage có `quiz-sid-<test>` / `iq-test-sid` (id phiên làm bài) | EV-TLW-242 · EV-TLW-254 | `[LIVE:browser]` | cao |
| F-34 | PDF report 11 trang, 4,69 MB, `Skia/PDF m128`, Creator là UA Linux, Title `about:blank` → render HTML → PDF bằng headless Chromium phía server | EV-TLW-261 | `[LIVE:browser]` · `[INFERRED]` | trung bình (attribution) |

(F-13, F-14, F-23, F-28 ở teardown cũng thuộc phần tech.)

## 9. Chưa đo được (PARK)

| Cái gì | Vì sao |
|---|---|
| Report trả phí có phụ thuộc câu trả lời không (TK-02/03 trên bài 100 câu) | luật core-tech chỉ probe free tier, không chạy kit trên bề mặt trả phí |
| Report sinh bằng template theo type hay LLM | không có dấu hiệu công khai; không đọc bundle/payload |
| Thời gian sinh PDF | không đo (1 lần tải duy nhất, human cho phép) |
| Offline/reload cho bài 100 câu và member | không thử (đủ thông tin từ bài free) |
| PSP thật sự | không "Powered by" |

## 10. AI Notices
- Mọi số đo ở free tier trừ TC-02 (quan sát trên tài khoản trial human trả trước phiên, không mua thêm, không chạy kit).
- Kết luận "in-browser" dựa trên việc không thấy request mang câu trả lời. Pixel quảng cáo có thể chứa dữ liệu câu trả lời trong payload, nhưng không đọc payload nên không biết (luật `core-tech-web.md §9`).
