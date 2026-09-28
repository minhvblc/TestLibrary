# Công nghệ cốt lõi — TestLib (web)
> Basis: `research/core-tech.md` (TC-01 · TC-02). Đây là SPEC: nêu đích danh framework / vendor. Số nào chưa chốt → `Q-xx`, KHÔNG ghi như đã quyết. Stack BE theo chuẩn team: NestJS + TypeORM + PostgreSQL `postgres:16-alpine`, một schema `public` (basis in-house).
**Changelog** (mới nhất trước)
- 2026-09-28 · v1.5 · claude-opus-5-5 · làm rõ khi lan quyết định: `/tests?topic=` render theo request + CloudFront cache theo `topic` (Q-09); CDN không còn dùng header nước cho GC-SensitiveNotice (Q-23: không định vị).
- 2026-09-28 · v1.4 · claude-opus-5-5 · quyết định 2026-09-28 (AI · uỷ quyền human): thêm §1b nền tảng (Next.js · AWS eu-central-1 · Paddle · Postmark — Q-04 · Q-09 · Q-16 · Q-19); TD-01 · TD-04 đã chốt (Q-10 · Q-12 · Q-13 · Q-20); §4 check-in đổi căn cứ sang consent (Q-22), thêm 2 loại dữ liệu (xác nhận 18+ — Q-21; yêu cầu huỷ / rút — Q-25), thời hạn lưu consent gia hạn và chứng từ (Q-05 (f)); §5 · §8 theo Q-19.
- 2026-09-28 · v1.3 · claude-opus-5-5 · Spike #2 (PDF) đã chạy: cập nhật §2 · §5 · §7.
- 2026-09-28 · v1.2 · claude-opus-5-5 · D-07: thời hạn lưu lý do huỷ thống nhất — tách khỏi danh tính sau 90 ngày, xoá luôn nếu tài khoản bị xoá trước đó. D-19: thêm 3 hàng lỗi cho gói & thanh toán (§3) mà SCR-PAY-03 / SCR-PAY-04 đang trích.
- 2026-09-27 · v1.1 · claude-opus-5-5 · §4 thêm 7 loại dữ liệu (log, liên hệ, lý do huỷ, đánh giá report, consent gia hạn, đơn hàng/webhook, file export) theo review của writer go-to-market.
- 2026-09-27 · v1 · claude-opus-5-5 · TD-01..TD-04 từ core-tech §7 + quyết định Q-08 (human).

## 1. Capability → lựa chọn

| TD-xx | Capability (TC-xx) | Cách làm | Vì sao (so với đối thủ đo được) | Basis (TC-xx · EV / Q-xx) | Status |
|---|---|---|---|---|---|
| TD-01 | Engine làm test (TC-01) | **Hybrid.** Flow câu hỏi + tiến độ chạy ở client (localStorage theo `attemptId` cho khách; autosave lên server khi đã đăng nhập). **Chấm điểm ở server** khi nộp bài (NestJS service `ScoringService`, thang đo versioned trong DB). Nộp bài idempotent theo `attemptId`; có hàng đợi nộp lại khi rớt mạng | Đối thủ chấm ở client và kết quả không phụ thuộc câu trả lời (RS·F-14 · F-31). Mình giữ ưu điểm offline/resume của họ (TK-04 · TK-05), còn chấm điểm thì phải thật và không bị sửa được | TC-01 · EV-TLW-138 · EV-TLW-061 · EV-TLW-065 · Q-10 | Đã chốt (Q-10) |
| TD-02 | Report (TC-02) | **Nội dung viết sẵn** theo (bài × type/dải điểm × thang con), lưu versioned trong DB (`report_blocks`). Server ráp report theo rule khi user có quyền. Biên tập trước khi phát hành. Không gọi LLM lúc chạy | Q-08 (human chốt). Đối thủ có report 9 chương (RS·F-23), nhưng không kiểm chứng được mức cá nhân hoá | TC-02 · EV-TLW-245 · Q-08 | Đã chốt |
| TD-03 | Export PDF (TC-02) | **Playwright (Chromium headless) phía server** render route in của report (`/app/reports/:reportId?print=1`) → PDF. Cache ở object storage theo (`reportId`, `contentVersion`, `locale`), tải bằng signed URL 10 phút. Fallback: nút "Print / Save as PDF" dùng print stylesheet | Đối thủ render bằng Skia/PDF headless (RS·F-34); PDF của họ 11 trang trong khi hứa 20 (RS·F-23). Mình ghi đúng số trang thật ở trang mở khoá | TC-02 · EV-TLW-261 · Q-08 · Q-19 | Đã chốt (cách làm) · spike §7 #2 |
| TD-04 | Tracking & consent | Consent manager first-party (GC-ConsentBanner · SYS-CONSENT) quyết định việc tải script. Analytics: Firebase Analytics (web) qua cổng `AppTracking` duy nhất (chuẩn xteam-tracking), **chỉ sau consent analytics**. **Không pixel quảng cáo phía client** trong MVP. Route của bài `sensitive` không tải analytics. Trình duyệt gửi GPC → coi như "Reject all" (Q-20). Không gửi câu trả lời/điểm/type kết quả | Đối thủ bắn ~2 event Meta Pixel mỗi câu trả lời, không có cookie banner (RS·F-13 · F-02) | EV-TLW-059 · EV-TLW-002 · Q-12 · Q-13 · Q-20 | Đã chốt (Q-12 · Q-13 · Q-20) |

## 1b. Nền tảng (chốt 2026-09-28)

| Thành phần | Chọn | Basis |
|---|---|---|
| Web | Next.js (App Router, TypeScript); route public SSG + revalidate, riêng `/tests?topic=` render theo request và CloudFront cache theo tham số `topic` (trang SSG không đọc được query); funnel / app render phía client; route in `?print=1` render phía server cho worker PDF | Q-09 |
| API | NestJS + TypeORM (chuẩn team) | in-house |
| DB | PostgreSQL 16 (RDS), AWS `eu-central-1` (Frankfurt) | Q-05 (d) · Q-19 |
| Chạy app | container trên ECS Fargate: web, API, worker PDF (Playwright, 1 vCPU / 1 GB, tối đa 2 job — SPK-02) | Q-19 · TD-03 |
| File (PDF, export) | S3 cùng region, signed URL | TD-03 · BR-APP-11 |
| CDN / WAF | CloudFront + AWS WAF; không dùng header nước (GC-SensitiveNotice không định vị người dùng, Q-23) | Q-09 · Q-23 |
| Thanh toán | Paddle Billing, merchant of record | Q-04 |
| Email giao dịch | Postmark (message stream giao dịch) | Q-16 |
| Analytics | Firebase Analytics (web), chỉ sau consent, không khi có GPC | TD-04 · Q-20 |

Nếu team đã có cloud khác có region EU thì dùng cloud đó; ràng buộc thật là dữ liệu ở EU (Q-19). Giá vendor điền lúc setup (`bang-quyet-dinh` §2 #3).

## 2. Ngân sách phi chức năng

| TD-xx | Latency mục tiêu (p50 / p95) | Streaming? | Input tối đa | Batch tối đa | Ngôn ngữ | Trình duyệt tối thiểu | Neo đối thủ (core-tech §3) |
|---|---|---|---|---|---|---|---|
| TD-01 | nộp bài → kết quả hiện: p50 ≤ 800 ms · p95 ≤ 2 s (basis in-house) | không | 1 attempt ≤ 200 câu; payload nộp ≤ 32 KB | autosave gom ≤ 10 câu/lần | en-US (Q-14) | 2 bản gần nhất của Chrome · Safari · Edge · Firefox; cần localStorage (thiếu thì chạy trong bộ nhớ) | 2690 ms median câu cuối → kết quả `[LIVE:browser · EV-TLW-181 · 2026-09-27]` |
| TD-02 | mở report: p50 ≤ 1 s · p95 ≤ 2,5 s (basis in-house) | không | — | — | en-US | như trên | không đo (behind-paywall) |
| TD-03 | tạo PDF: p95 ≤ 10 s (lần đầu) · ≤ 1 s khi đã cache (basis in-house · spike §7 #2). Spike 2026-09-28: riêng engine render 22–40 trang mất 0,2–0,75 s kể cả mở Chromium mới (`research/spikes/SPK-02-pdf-render.md`); phần còn lại của ngân sách dành cho route in thật + upload | không (job + trạng thái) | report ≤ 40 trang | 1 PDF / user / lần | en-US | như trên | PDF đối thủ 11 trang `[LIVE:browser · EV-TLW-261 · 2026-09-27]` |
| TD-04 | không chặn render: script analytics tải sau `load` và sau consent | không | — | — | — | như trên | trang đối thủ tải 30 request bên thứ ba `[LIVE:browser · EV-TLW-262 · 2026-09-27]` |

## 3. Degradation contract

| Tình huống | App làm gì | Copy VERBATIM (en-US) | Retry? | SCR / FLOW hiện thực |
|---|---|---|---|---|
| Mất mạng khi đang trả lời | vẫn trả lời tiếp (client); hiện banner offline; tiến độ lưu local | "You're offline. Keep going — we'll save your answers and submit when you're back online." | tự động khi online | SCR-TEST-01 · FLOW-lam-bai-mien-phi (case rớt mạng) |
| Mất mạng / timeout khi nộp bài (> 10 s) | giữ câu trả lời, đưa bài nộp vào hàng đợi, tự gửi lại với cùng `attemptId` | "We couldn't submit your answers yet. We'll retry automatically — your answers are safe on this device." + nút "Retry now" | có (idempotent) | SCR-TEST-01 |
| Server chấm điểm lỗi (5xx) | như trên + ghi log; sau 3 lần hiện nút liên hệ | "Something went wrong while scoring. Your answers are saved. Please try again." | có | SCR-TEST-01 |
| Trình duyệt chặn localStorage (private mode) | chạy trong bộ nhớ; cảnh báo nhẹ trước câu 1 | "Private browsing is on, so your progress won't be saved if you close this tab." | không | SCR-TEST-01 |
| Kết quả đã hết hạn / token không khớp (khách đổi trình duyệt) | 404 thân thiện + CTA làm lại / đăng nhập | "This result isn't available on this device. Sign in if you saved it, or take the test again." | không | SCR-TEST-02 |
| Chưa có quyền đọc report | state Locked + CTA mở khoá | "Unlock the full report to read every chapter." | không | SCR-APP-03 · SCR-PAY-01 |
| Webhook thanh toán chưa về | màn chờ; hỏi lại trạng thái 2 s/lần trong 30 s, sau đó báo sẽ gửi email | "Confirming your payment…" → mua lẻ: "Your payment is still processing. We'll email you as soon as your report is unlocked." · Plus: "Your payment is still processing. We'll email you as soon as your Plus plan is active." | có (poll) | SCR-PAY-02 · FLOW-mo-khoa-report · FLOW-dang-ky-plus (case pending) |
| Thanh toán thất bại / huỷ ở provider | quay về với lỗi + nút thử lại, không mở quyền | "Your payment didn't go through. You haven't been charged." | có (user bấm) | SCR-PAY-02 |
| Không tải được gói & thanh toán (API-PAY-04 lỗi / timeout / 5xx) | state Error, không đoán trạng thái gói ở client | "We couldn't load your plan. Please refresh." | user tải lại | SCR-PAY-03 · SCR-PAY-04 |
| Huỷ gia hạn lỗi (API-PAY-05 lỗi / timeout 10 s / 5xx) | ở lại trang, giữ lý do đã gõ, mở lại nút; gia hạn giữ nguyên | "We couldn't cancel right now. Please try again, or email support@[domain]." | có (user bấm lại; dùng lại `Idempotency-Key` của lần lỗi, server còn kiểm trạng thái) | SCR-PAY-04 · FLOW-quan-ly-huy-gia-han |
| Tiếp tục gia hạn / mở cổng provider lỗi (API-PAY-06 · API-PAY-07 lỗi / 5xx) | giữ trạng thái cũ; với cổng provider thì đóng tab trống vừa mở | "Something went wrong on our side. Please try again." | có (user bấm) | SCR-PAY-03 · FLOW-quan-ly-huy-gia-han |
| Tạo PDF lỗi / quá 10 s | chuyển sang trạng thái "đang tạo" + email link khi xong; fallback in trình duyệt | "Your PDF is taking longer than usual. We'll email it to you — or use Print → Save as PDF." | có | SCR-APP-03 |
| JavaScript tắt | trang public (SSR) vẫn đọc được; trang làm bài báo cần JS | "Please enable JavaScript to take this test." | không | SCR-PUB-03 · SCR-TEST-01 |
| Quá rate limit (429) | báo chờ, không thử lại liên tục | "Too many requests. Please wait a moment and try again." | sau `Retry-After` | mọi màn (tieu-chuan-chung §2) |

## 4. Luồng dữ liệu & riêng tư

| Dữ liệu | Rời trình duyệt? | Đi đâu (vendor · region) | Lưu bao lâu | Cần consent? | Khai báo ở | Basis |
|---|---|---|---|---|---|---|
| Câu trả lời đang làm (khách) | không (localStorage) | — | tới khi nộp; xoá khỏi máy sau khi nộp thành công | không | legal-consent §1 | TD-01 |
| Câu trả lời đang làm (đã đăng nhập, autosave) | có | server của mình (PostgreSQL, AWS `eu-central-1` — Q-05 · Q-19) | tới khi nộp / 30 ngày nếu bỏ dở | không (hợp đồng) | legal-consent §1 | TD-01 · Q-05 |
| Câu trả lời đã nộp + kết quả | có | server của mình | khách: 30 ngày nếu chưa lưu (BR-APP-08); tài khoản: tới khi xoá | bài `sensitive`: **consent tường minh** trước câu 1 (BR-APP-06); bài thường: hợp đồng | legal-consent §1 | BR-APP-06 · BR-APP-08 · Q-05 |
| Xác nhận 18+ (bài `sensitive`) | có | server của mình (cùng attempt) | như câu trả lời của attempt đó | đi kèm consent bài `sensitive`; chỉ là ô tự xác nhận, không thu ngày sinh | legal-consent §1 | Q-21 · BR-TEST-11 |
| Check-in cảm xúc | có | server của mình | tới khi user tắt check-in (xoá cứng ngay) hoặc xoá tài khoản | **consent tường minh** lần đầu bật (lưu `checkin_consent_version` + thời điểm); dữ liệu nhạy cảm → không gửi analytics | legal-consent §1 | Q-22 · BR-DASH-05 · BR-ACC-07 · BR-APP-05 |
| Email, tên, timezone (nguồn: form, hoặc hồ sơ Google khi đăng nhập Google) | có | server của mình + Postmark (Mỹ, có DPA — Q-16) | tới khi xoá tài khoản | không (hợp đồng) | legal-consent §1 | Q-16 · Q-11 |
| Dữ liệu thẻ / thanh toán | có | **chỉ Paddle** (MoR, Q-04), không qua server mình | theo provider | không (hợp đồng) | legal-consent §1 | BR-APP-01 · Q-04 |
| Event analytics (không có dữ liệu bài) | có | Firebase Analytics (Google) | theo cấu hình retention analytics (đề xuất 14 tháng) | **có** (analytics) | legal-consent §2 · tracking-events | TD-04 · BR-APP-05 |
| Bản ghi consent cookie (gồm `source` = banner / settings / gpc) | có | server của mình | 12 tháng, sau đó hỏi lại | không (nghĩa vụ pháp lý) | legal-consent §3 | SYS-CONSENT |
| File PDF report | có | object storage của mình (cùng region) | cache 30 ngày, tạo lại khi cần | không | legal-consent §1 | TD-03 |
| Log máy chủ / bảo mật (IP, user agent, thời điểm) | có | server của mình + CloudFront / WAF (Q-09 · Q-19) | 30 ngày | không (lợi ích hợp pháp: bảo mật, chống lạm dụng, rate limit) | legal-consent §1 | in-house |
| Tin nhắn liên hệ (email, chủ đề, nội dung) | có | server của mình | 24 tháng sau khi đóng yêu cầu | không (trả lời yêu cầu của user) | legal-consent §1 | API-HELP-01 |
| Lý do huỷ gia hạn (tuỳ chọn, chữ tự do) | có | server của mình | tách khỏi danh tính sau 90 ngày; xoá luôn nếu tài khoản bị xoá trước mốc đó | không (tuỳ chọn) | legal-consent §1 | SCR-PAY-04 |
| Đánh giá report (1–5) | có | server của mình | tới khi xoá tài khoản; không gửi analytics | không | legal-consent §1 | SCR-APP-03 · BR-APP-05 |
| Bản ghi consent gia hạn (`consent_version`, thời điểm, IP, giá + câu gia hạn đã hiện, planKey) | có | server của mình + Paddle | 3 năm, hoặc 1 năm sau khi hợp đồng kết thúc (lấy mốc dài hơn); giữ cả khi xoá tài khoản (Q-05 (f)) | không (nghĩa vụ pháp lý: chứng minh đồng ý tự gia hạn) | legal-consent §1 | BR-APP-03 |
| Đơn hàng + event webhook thanh toán (email, planKey, số tiền, trạng thái, mã đơn) | có | server của mình + Paddle (Q-04) | 7 năm, tới khi kế toán nơi đăng ký xác nhận mốc khác (Q-05 (f)) | không (hợp đồng + nghĩa vụ pháp lý) | legal-consent §1 | API-HOOK-01 · SYS-ENTITLEMENT |
| Yêu cầu huỷ / rút (email, mã đơn, việc chọn, thời điểm nhận, IP) | có | server của mình + Paddle (khi hoàn tiền) | như đơn hàng (7 năm) | không (nghĩa vụ pháp lý: bằng chứng đã nhận yêu cầu rút / huỷ) | legal-consent §1 | Q-25 · BR-APP-14 · API-PAY-08 · API-PAY-09 |
| File export dữ liệu | có | object storage của mình | link + file xoá sau 7 ngày | không | legal-consent §1 | BR-APP-11 |

> Bảng này là nguồn của `go-to-market/legal-consent.md` và tài liệu BE. Sai ở đây thì khai báo pháp lý cũng sai.

## 5. Chi phí vận hành

| TD-xx | Đơn giá / op | Op / user / tháng (ước) | COGS / user | Ràng buộc lên bậc giá (`overview §2`) | Q-xx Group A |
|---|---|---|---|---|---|
| TD-01 | CPU server, không vendor (`[INFERRED]`) | ~10 lần nộp | ≈ 0 | không | Q-19 |
| TD-02 | 0 lúc chạy; soạn nội dung là chi phí một lần (`[INFERRED]`) | ~10 report | ≈ 0 | không | Q-19 |
| TD-03 | container Chromium: ~0,25–0,6 s CPU mỗi PDF, ~0,42 GB RAM cho 1 job, ~0,8–1 GB cho 4 job song song (đo ở spike §7 #2 — `research/spikes/SPK-02-pdf-render.md`); worker ECS Fargate 1 vCPU / 1 GB (Q-19), giá AWS điền lúc setup | ~2 PDF | ~1 s CPU / user / tháng | không | Q-19 |
| TD-04 | Firebase Analytics gói miễn phí (`[INFERRED]`) | — | 0 | không | Q-19 |

## 6. Rủi ro & fallback

| # | Rủi ro | Fallback | Trigger để đổi |
|---|---|---|---|
| 1 | Thang đo tự soạn không phân hoá (kết quả dồn một type) | dùng item bank public domain đã kiểm định (Q-07); chạy kit TK-01..03 trong CI | kit báo GT-01 `answer-insensitive` hoặc > 60% kết quả cùng một type sau 1000 lượt |
| 2 | Chromium trên server tốn RAM / chậm | hàng đợi job + giới hạn song song; fallback print stylesheet | p95 tạo PDF > 10 s hoặc RAM > 1 GB/job |
| 3 | Bị coi là "health app" ở một số vùng | tắt bài `sensitive` theo vùng bằng feature flag | yêu cầu pháp lý (Q-05) |
| 4 | Webhook provider trễ / lặp | idempotent theo event id; màn chờ + email | tỉ lệ pending > 30 s vượt 1% |

## 7. Spike phải làm trước FREEZE

| # | Câu hỏi | Cách đo (code của mình) | Chặn gate nào |
|---|---|---|---|
| 1 | Scoring có `answer-sensitive` + reverse-keying đúng không | chạy TK-01..03 (research/tech-kit) trên API chấm điểm của mình; GT-01 phải ≥ 1 thang khác, GT-02 < tổng số thang | G-tech-feasible (TD-01) · API-FREEZE |
| 2 | PDF 20+ trang tạo trong bao lâu, tốn bao nhiêu RAM | Playwright render 1 report mẫu 5 lần, ghi p50/p95 + peak RAM. **Đã chạy 2026-09-28** (`research/spikes/SPK-02-pdf-render.md`): 22 trang warm p50 211 ms / cold p50 316 ms; 40 trang cold p95 430 ms; có 1,8 MB ảnh bitmap: cold p95 747 ms; RAM đỉnh ~0,42 GB / job. Chưa đo route in thật của app | TD-03 · Q-19 · economy-FREEZE |
| 3 | Hàng đợi nộp bài khi rớt mạng | bật offline giữa bài (giống TK-05), nộp, online → đúng 1 kết quả | API-FREEZE |

## 8. AI Notices
- Latency/chi phí ở §2 và §5 là mục tiêu `[INFERRED]` (basis in-house). Phải thay bằng số đo của spike §7 trước FREEZE. Spike #2 (PDF) đã có số đo engine (`research/spikes/SPK-02-pdf-render.md`); spike #1 và #3 cần code của mình.
- Không dùng tên vendor của đối thủ làm lý do. Lựa chọn vendor của mình ghi ở §1b với basis riêng (chốt 2026-09-28, AI · uỷ quyền human).
- Chi phí biến đổi (§5) rất nhỏ so với giá thấp nhất $9.99 (`00-overview §2`), nên giá vendor chỉ ảnh hưởng chi phí cố định; điền từ bảng giá thật lúc setup (Q-19), không dùng số nhớ.
