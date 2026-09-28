# [testlib] — Công nghệ cốt lõi (research, web)
> Mọi số đo trên **free tier**, cùng một test kit (`tech-kit/`), trong Chrome research. Không mua, không replay API, không đọc bundle, không bắt payload (`core-tech-web.md §8–9`). TC-02 chỉ **quan sát** trên tài khoản trial human đã trả trước phiên, không benchmark.
**Changelog** (mới nhất trước)
- 2026-09-28 · v1.1 · claude-opus-5-5 · spike §9 #2 đã chạy (SPK-02).
- 2026-09-27 · v1 · claude-opus-5-5 · 1 site (testlibrary.com) theo scope của user; TC-01 measured (L0–L5), TC-02 behind-paywall (chỉ quan sát L0 + L4).

## 1. Capability cốt lõi của category

| TC-xx | Capability | Vì sao sống-còn | Site nào cũng có? |
|---|---|---|---|
| TC-01 | Engine làm test: flow câu hỏi · lưu tiến độ · chấm điểm → kết quả | kết quả không đáng tin (hoặc không phụ thuộc câu trả lời) thì sản phẩm mất lý do tồn tại, và dễ thành rủi ro "misrepresentation" | có (1/1) |
| TC-02 | Sinh report dài theo kết quả + export PDF | report là thứ khách trả tiền mua ("20-page report") | có (1/1, sau paywall) |

> Không có capability "nặng" kiểu AI/WASM: đây là category **nội dung + funnel**. Hai TC trên nhẹ về tính toán nhưng quyết định chất lượng và pháp lý, nên vẫn giữ (không phải padding). Rủi ro kỹ thuật thật nằm ở tracking/consent và thanh toán, không nằm ở compute.

## 2. Ma trận TC × site

| TC-xx | testlibrary.com | Consensus |
|---|---|---|
| TC-01 | bài free: `in-browser` (flow + chấm điểm, không upload câu trả lời, chạy offline, resume từ localStorage); member: `hybrid` (flow client, kết quả POST lưu server) · `[LIVE:browser]` quan sát / `[INFERRED]` class · EV-TLW-059 · EV-TLW-077 · EV-TLW-242 | n=1, chưa có consensus |
| TC-02 | `server` `[INFERRED]` (PDF `Skia/PDF m128`, Creator UA Linux) · `[BLOCKED · behind-paywall]` cho mọi so sánh chất lượng · EV-TLW-261 | n=1 |

## 3. Benchmark (cùng `TK-xx`, bài `/free-tests/personality-test`, 19 câu)

| Site | TK-xx | Rubric / lỗi vs ground truth | Median latency | Streaming? | Offline | Giới hạn free | Tag | EV |
|---|---|---|---|---|---|---|---|---|
| testlibrary.com | TK-01 all-max | GT-02: 2/9 thang ở mức cao nhất (95%) | 2.690 ms (câu cuối → kết quả, n=3, 2.085–2.759) | không | có (TK-05) | không có quota | `[LIVE:browser]` | EV-TLW-076 · EV-TLW-181 |
| testlibrary.com | TK-02 all-min | GT-01: **0/9 thang khác TK-01** → `answer-insensitive` | trong median trên | không | — | — | `[LIVE:browser]` | EV-TLW-138 |
| testlibrary.com | TK-03 all-neutral | GT-03: y hệt TK-01, không cảnh báo | trong median trên | không | — | — | `[LIVE:browser]` | EV-TLW-159 |
| testlibrary.com | TK-04 reload @10/19 | GT-04: `resume` | — | — | — | — | `[LIVE:browser]` | EV-TLW-065 |
| testlibrary.com | TK-05 offline @5/19 | GT-05: `client-side flow` (2 câu offline, không lỗi) | — | — | có | — | `[LIVE:browser]` | EV-TLW-060 · EV-TLW-061 |

## 4. Tech coverage ledger

| Site | TC-01 | TC-02 |
|---|---|---|
| testlibrary.com | measured | behind-paywall |

(TC-02: chỉ quan sát post-checkout: report ~3.120 chữ, PDF 11 trang. Không chạy kit, không đo chất lượng, không có số so sánh nào ở downstream.)

## 5. Fingerprint → suy luận (tách bạch)

| Quan sát (fact + EV) | Suy luận về *class* triển khai | Tag | Q-xx |
|---|---|---|---|
| DOM marker `nuxt` (EV-TLW-015) | front end Vue/Nuxt, SSR hoặc SPA | `[INFERRED]` | — (không ảnh hưởng quyết định của mình; framework của mình = Q-09) |
| 403 `cf-mitigated: challenge` với curl (EV-TLW-001) | Cloudflare bot management trước origin, cho nên crawler không chạy JS cũng có thể bị chặn (sitemap 403) | `[INFERRED]` | Q-09 |
| host `*.supabase.co` + cookie `sb-…-auth-token` (EV-TLW-254) | auth + DB là backend-as-a-service kiểu Supabase | `[INFERRED]` | — |
| 0 request first-party mang câu trả lời ở bài free (EV-TLW-059 · EV-TLW-077) | chấm điểm bài free chạy trong browser (logic lộ ra client) | `[INFERRED]` | Q-10 |
| 1 POST first-party khi member "Get My Results" (EV-TLW-242) | kết quả member lưu server | `[INFERRED]` | Q-10 |
| PDF `/Producer Skia/PDF m128` · `/Creator` UA X11 Linux · `/Title about:blank` (EV-TLW-261) | HTML → PDF bằng headless Chromium phía server | `[INFERRED]` | Q-08 |
| cookie `FPLC`/`FPAU`/`FPGSID` + `data.`/`load.data.` subdomain (EV-TLW-015) | Google tag gateway / server-side tagging first-party | `[INFERRED]` | Q-12 |
| ~2 POST Meta `/tr/` mỗi câu trả lời, 20 conversion Google Ads mỗi bài 100 câu (EV-TLW-059 · EV-TLW-104) | sự kiện quảng cáo gắn với từng câu hỏi (nội dung payload không biết) | `[LIVE:browser]` (số request) · `[INFERRED]` (nội dung) | Q-12 |
| logo "stripe" trong dải trust, không "Powered by" (EV-TLW-033) | PSP có thể là Stripe | `[INFERRED]` | — (PSP của mình = Q-04) |

## 6. Page weight (perf ×3, median, cold cache, wifi VN)

| Site | Trang | LCP | CLS | Requests | Bytes | JS bytes | Tag | EV |
|---|---|---|---|---|---|---|---|---|
| testlibrary.com | `/` | 492 ms | 0,006 | 88 | 1,8 MB | 1.021 KB | `[LIVE:browser]` | EV-TLW-262 |
| testlibrary.com | `/free-tests/personality-test` | 600 ms | 0 | 56 | 1,1 MB | 989 KB | `[LIVE:browser]` | EV-TLW-263 |

## 7. Build vs buy cho MÌNH

| TC-xx | Option | Chất lượng kỳ vọng | Latency | Offline | Cost/op | Rủi ro | Đề xuất | Q-xx |
|---|---|---|---|---|---|---|---|---|
| TC-01 | A · in-browser hoàn toàn (như đối thủ) | tuỳ scoring; logic + đáp án lộ ra client | < 100 ms `[INFERRED]` | có | ~0 | bị sửa kết quả, lộ key chấm điểm | không | Q-10 |
| TC-01 | B · **hybrid**: flow + progress ở client (localStorage cho khách, autosave server khi có tài khoản), chấm điểm ở server khi nộp bài | chấm điểm thật, versioned, test được bằng kit | 1 round-trip (mục tiêu p50 ≤ 1 s, đối thủ 2,69 s) | flow chạy offline, nộp bài cần mạng (xếp hàng, gửi lại) | ~0 (CPU) `[INFERRED]` | cần hàng đợi nộp bài khi rớt mạng | **đề xuất** | Q-10 |
| TC-01 | C · form builder SaaS (Typeform / Tally…) | không kiểm soát scoring/UX; khó làm report | — | không | phí gói tháng | vendor lock, dữ liệu nhạy cảm nằm ở bên thứ ba | không | — |
| TC-02 | A · **report viết sẵn theo type/dải điểm** (soạn offline có biên tập, ráp theo rule lúc chạy) | ổn định, duyệt được trước khi phát hành, an toàn với chủ đề nhạy cảm | < 200 ms `[INFERRED]` | đọc được sau khi tải | ~0 | tốn công soạn nội dung ban đầu | **đề xuất MVP** | Q-08 |
| TC-02 | B · LLM cá nhân hoá lúc chạy | cá nhân hoá sâu hơn nhưng khó kiểm soát | vài giây `[INFERRED]` | không | token × đơn giá vendor `[INFERRED]` | gửi câu trả lời nhạy cảm cho vendor AI (DPA, consent), ảo giác nội dung | để sau (v1.x) | Q-08 · Q-19 |
| TC-02 (PDF) | A · headless Chromium (Playwright) phía server, cache theo phiên bản report | giống bản web (đối thủ làm vậy, F-34) | 1–3 s/PDF `[INFERRED]` | — | CPU/RAM container `[INFERRED]` | thêm hạ tầng Chromium | đề xuất (spike) | Q-08 · Q-19 |
| TC-02 (PDF) | B · print stylesheet + `window.print()` | tuỳ trình duyệt | tức thì | có | 0 | UX "Save as PDF" kém trên mobile | fallback | Q-08 |

## 8. Cost model (option server)

| TC-xx | Đơn giá nguồn public | Ops/user/tháng (ước) | COGS/user | Trần giá gói bị ép tới đâu | `[INFERRED]` → Q-xx Group A |
|---|---|---|---|---|---|
| TC-01 (B) | CPU server, không vendor | ~10 lần nộp bài `[INFERRED]` | ≈ 0 | không ép | Q-19 |
| TC-02 (A report viết sẵn) | 0 lúc chạy (chi phí soạn nội dung là one-off) | ~10 report | ≈ 0 | không ép | Q-19 |
| TC-02 (B LLM) | cần báo giá vendor lúc chốt; KHÔNG dùng giá nhớ | ~10 report | chưa biết | có thể ép gói rẻ | **Q-19 · Q-08 (Group A)** |
| TC-02 (PDF A) | container Chromium | ~2 PDF | nhỏ `[INFERRED]` | không ép | Q-19 |

## 9. Rủi ro & spike

| # | Rủi ro | Spike (≤ 1 ngày, code CỦA MÌNH) | Chặn gate nào |
|---|---|---|---|
| 1 | Scoring thang đo không chuẩn → kết quả vô nghĩa | chạy lại kit TK-01..03 trên engine của mình: GT-01 phải `answer-sensitive`, GT-02 phải có reverse-keying | G-tech-feasible (TD-01) |
| 2 | PDF server nặng/chậm | Playwright render 1 report 20 trang: đo thời gian + RAM. **Đã chạy 2026-09-28** (`research/spikes/SPK-02-pdf-render.md`): engine 0,2–0,75 s / PDF 22–40 trang, ~0,42 GB RAM / job → không nặng; rủi ro còn lại là ảnh bitmap nặng và route in thật | TD-02 · Q-08 |
| 3 | Nộp bài khi rớt mạng mất dữ liệu | hàng đợi nộp bài + retry idempotent (key = attempt id) | API-FREEZE |
| 4 | Pixel quảng cáo làm rò dữ liệu nhạy cảm | tracking plan không gửi câu trả lời, chỉ event funnel sau consent | legal-consent · Q-12 |

## 10. Chưa đo được (PARK)

| Cái gì | Vì sao |
|---|---|
| Report trả phí của đối thủ có phụ thuộc câu trả lời không | luật free tier (không chạy kit trên bề mặt trả phí) |
| Đối thủ sinh report bằng template hay LLM | không có dấu hiệu công khai |
| Hành vi consent/tracking của đối thủ với IP EU | `[BLOCKED · geo]` |
| Site khác trong category | ngoài scope (user chọn 1 site) |

## 11. AI Notices
- n = 1 site → mọi "consensus" chỉ là quan sát một đối thủ. Đừng dùng làm chuẩn thị trường.
- Latency/cost của các option của mình là `[INFERRED]`, phải đo bằng spike §9 trước khi FREEZE.
