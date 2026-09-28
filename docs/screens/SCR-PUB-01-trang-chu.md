# [SCR-PUB-01] Trang chủ
**Meta**

| id | module | doc level | platforms | route | access | indexable | viewports | related FLOW | status | design | tracking | api | Evidence / visual basis |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| SCR-PUB-01 | PUB | Short | Web | `/` | public | index | 390 · 768 · 1280 | FLOW-lam-bai-mien-phi | Draft | (sau design) | `tracking-events.md` → `home` | §5 (inline) | **EV-TLW-013 · EV-TLW-014 · SC-TLW-01 · basis RS·F-03 · F-14 · CS-01** |

**Changelog** (mới nhất trước)
- 2026-09-28 · v1.1 · claude-opus-5-5 · AI Notice "science-based" cập nhật theo Q-07 đã chốt (2026-09-28). Bỏ chữ "SSR" (Q-09: route public render sẵn bằng SSG + revalidate).
- 2026-09-27 · v1 · claude (subagent) · khởi tạo từ blueprint.

## 1. Purpose

Landing cho người mới: nói ngắn sản phẩm là gì (bài test chấm điểm thật, tóm tắt miễn phí, không thu tiền bất ngờ) rồi đưa thẳng vào làm bài miễn phí. Khác đối thủ ở CTA: mọi card "Try now" trên landing của họ dẫn về trang giá, khách không làm được bài nào từ trang chủ (RS·F-03). Ở đây CTA chính dẫn tới thư viện và trang bài; giá chỉ là một khối tóm tắt có link phụ. Khối tin cậy chỉ hứa điều sản phẩm làm thật: câu trả lời không tới bên quảng cáo (BR-APP-05) và có trang giải thích cách chấm điểm (đối thủ trả kết quả không phụ thuộc câu trả lời, RS·F-14). · basis RS·F-03 · F-14 · CS-01 · Q-02

## 2. Điều hướng

### 2.1 Vào

| Vào qua | Từ | Trigger |
|---|---|---|
| NAV-ACC-01-4 | SCR-ACC-01 | "Sign out" |
| NAV-ACC-02-1 | SCR-ACC-02 | hệ thống: xoá tài khoản thành công sau "Delete my account" |
| shell | logo "TestLib" ở header (public · app · funnel) | SYS-NAV §1 |
| entry ngoài | URL trực tiếp · SEO | SYS-NAV §4 |

### 2.2 Ra

| NAV-ID | Tới (SCR-ID · tham số) | Trigger (CMP-ID "nhãn") | Kiểu | URL / history | Animation | Back / đóng → | Guard / điều kiện | Nền tảng | Basis |
|---|---|---|---|---|---|---|---|---|---|
| NAV-PUB-01-1 | SCR-PUB-03 · `slug` | CMP-03 "Start test" | push | route mới `/tests/:slug` (push) | mặc định | back trình duyệt → SCR-PUB-01, giữ vị trí cuộn | — | Web | RS·F-03 |
| NAV-PUB-01-2 | SCR-PUB-02 | CMP-02 "Take a free test" | push | `/tests` (push) | mặc định | back trình duyệt → SCR-PUB-01 | — | Web | RS·F-03 |
| NAV-PUB-01-3 | SCR-PUB-04 | CMP-05 "See pricing" | push | `/pricing` (push) | mặc định | back trình duyệt → SCR-PUB-01 | — | Web | RS·F-05 |
| NAV-PUB-01-4 | SCR-PUB-06 · `#scoring` | CMP-06 "How we score" | push | `/help#scoring` (push) | mặc định | back trình duyệt → SCR-PUB-01 | — | Web | RS·F-14 |
| NAV-PUB-01-5 | SCR-PUB-02 | CMP-08 "Browse all tests" | push | `/tests` (push) | mặc định | back trình duyệt → SCR-PUB-01 | chỉ hiện ở state Empty (0 bài nổi bật) | Web | in-house |

## 3. Layout & components

- **Bố cục @390 (top→bottom):**
  - header;
  - hero (H1 → câu phụ → nút "Take a free test" full width);
  - lưới 6 bài nổi bật, 1 cột;
  - "How it works" (3 bước dọc);
  - khối giá tóm tắt + link "See pricing";
  - khối tin cậy + link "How we score";
  - footer.
  - Không popup, không banner khuyến mãi, không chat tự mở. Banner consent (GC-ConsentBanner) là overlay chung của site, không thuộc màn này.

| CMP-ID | Component | Type / GC- | Behavior & rules | Basis (EV / Q / in-house) |
|---|---|---|---|---|
| CMP-01 | Header | GC-SiteHeader (public) | theo GC | SYS-NAV §1 |
| CMP-02 | Hero | H1 + câu phụ + nút chính | H1 "Understand yourself — with tests that are actually scored" · câu phụ "Free tests, scored from your answers. Every score explained. No surprise charges." · nút "Take a free test" (NAV-PUB-01-2) | RS·F-03 · RS·F-14 |
| CMP-03 | Lưới bài nổi bật | GC-TestCard ×6 | 6 bài `featured` từ API-CAT-01, thứ tự do biên tập; mỗi card: tên bài, 1 câu mô tả, "[n] questions" · "About [m] min", nút "Start test" (cả card bấm được, cùng đích NAV-PUB-01-1); bài `sensitive` có nhãn "Wellbeing · Not a diagnosis" (BR-PUB-03) | EV-TLW-014 · BR-PUB-02 |
| CMP-04 | "How it works" | H2 + 3 bước đánh số | H2 "How it works" · 1 "Answer honestly" · 2 "See your scored summary — free" · 3 "Unlock the full report if you want it" | Q-02 · EV-TLW-014 |
| CMP-05 | Khối giá tóm tắt | đoạn + link | "Free summaries. Pay only for full reports." + link "See pricing" (NAV-PUB-01-3); landing không ghi con số giá nào — giá chỉ hiện ở SCR-PUB-04, nguồn 00-overview §2 | Q-02 · Q-03 |
| CMP-06 | Khối tin cậy | đoạn + link | "Your answers never go to advertisers." + link "How we score" (NAV-PUB-01-4) | BR-APP-05 · RS·F-13 · RS·F-14 |
| CMP-09 | FAQ | accordion (mở nhiều mục được) + JSON-LD `FAQPage` | 5–6 câu hỏi–đáp verbatim theo `go-to-market/landing-copy.md` (mục FAQ); đặt giữa CMP-06 và CMP-07 | tieu-chuan-chung §8 |
| CMP-07 | Footer | GC-SiteFooter | theo GC | SYS-NAV §1 |
| CMP-08 | Link "Browse all tests" | link | chỉ hiện ở state Empty thay cho lưới CMP-03 (NAV-PUB-01-5) | in-house |

## 4. States

| State | Trigger | Hiển thị | EV / basis |
|---|---|---|---|
| Default | API-CAT-01 trả ≥ 1 bài nổi bật | đủ CMP-01…07 | EV-TLW-013 |
| Loading | điều hướng phía client (lần đầu là HTML render sẵn, không có loading) | hero hiện ngay; skeleton 6 card trong CMP-03 | tieu-chuan-chung §3 |
| Empty | API-CAT-01 trả 0 bài nổi bật | ẩn lưới CMP-03, hiện CMP-08 "Browse all tests" (NAV-PUB-01-5) | in-house |
| Error | API-CAT-01 lỗi (mạng / 5xx) | hero vẫn hiện + "We couldn't load tests. Try again." (nút thử lại gọi lại API-CAT-01) | tieu-chuan-chung §2 |
| Locked | N/A — trang public, không có nội dung khoá | — | 00-overview §3 |

## 5. API

| API | Method | When called |
|---|---|---|
| API-CAT-01 | GET | lúc render sẵn trang (SSG + revalidate, Q-09) + điều hướng client; tham số `featured=true` · `limit=6`; trả `slug`, tên, mô tả ngắn, chủ đề, số câu, thời gian median, cờ `sensitive` |

Lỗi riêng: không có. Lỗi mạng / 5xx → state Error. Còn lại theo `00-quy-uoc-api` §4.

## 6. Tracking

| Event | Note |
|---|---|
| `screen_active` · `home` | chỉ bắn sau consent analytics (tieu-chuan-chung §10); `open_from` chỉ ở lần vào đầu phiên (tracking-events) |

## 7. Business rules & edge cases

| BR-ID | Rule | Basis |
|---|---|---|
| BR-PUB-01 | CTA chính của landing dẫn tới làm bài, KHÔNG tới trang giá | RS·F-03 — đối thủ: mọi card "Try now" → `/pricing` `[LIVE:browser · EV-TLW-012]` |
| BR-PUB-02 | Mỗi card hiện số câu + thời gian ước tính thật (tieu-chuan-chung §4) | đối thủ ghi "100 questions · 20 mins" cho gần như mọi bài `[LIVE:browser · EV-TLW-014]` · cùng nguồn số với BR-PUB-05 |

| EC-xx | Tình huống | Handling | Basis |
|---|---|---|---|
| EC-01 | Người đã đăng nhập mở `/` | vẫn hiện landing, không tự chuyển `/app`; header theo GC-SiteHeader | in-house |
| EC-02 | Vào ngay sau khi xoá tài khoản (SCR-ACC-02) | toast (overlay, SYS-NAV §2) "Your account is scheduled for deletion. Sign in within 30 days to restore it."; cờ hiển thị là cờ một lần trong sessionStorage do SCR-ACC-02 đặt, không đưa lên URL | BR-APP-11 |
| EC-03 | Vào sau "Sign out" | header public; các tab khác của site cũng về `/` | tieu-chuan-chung §1 · BR-APP-10 |
| EC-04 | Có bài `sensitive` trong 6 bài nổi bật | card có nhãn "Wellbeing · Not a diagnosis"; không event nào của landing mang slug bài | BR-PUB-03 · BR-APP-05 |
| EC-05 | JavaScript tắt | trang render sẵn đọc được đủ, mọi CTA là link thật | cong-nghe-loi §3 · tieu-chuan-chung §8 |

## 8. Responsive deltas

| Aspect | 390 (gốc) | 768 | 1280 |
|---|---|---|---|
| Hero | xếp chồng: H1 → câu phụ → nút full width | căn trái, nút rộng theo chữ | như 768, container tối đa 1120 |
| Lưới bài nổi bật | 1 cột | 2 cột | 3 cột |
| "How it works" | 3 bước dọc | 3 bước ngang | 3 bước ngang |
| Khối giá + khối tin cậy | xếp chồng | 2 cột cạnh nhau | 2 cột cạnh nhau |

## 9. Keyboard & focus

Không có ngoại lệ so với `tieu-chuan-chung §5`.

## 10. AI Notices
- Copy hero và "How it works" là đề xuất theo blueprint. Khi `go-to-market/landing-copy.md` có bản chốt thì copy ở đó là nguồn, file này cập nhật theo.
- Link "Browse all tests" ở state Empty trỏ `/tests` nhưng chưa có cạnh NAV riêng (cùng đích với NAV-PUB-01-2). Cần thêm cạnh nếu giữ link này.
- Câu phụ hero đã bỏ chữ "science-based" (Q-07 đã chốt: chữ này chỉ dùng cho bài dựng trên thang đã kiểm định như IPIP, không cho bài tự soạn; hero nói về mọi bài nên không dùng) và đổi "Your full results, explained" thành "Every score explained" để không bị hiểu là report trả phí (review go-to-market).
- SEO: meta lấy từ `go-to-market/seo-meta.md` (row `/`); JSON-LD `Organization` (tieu-chuan-chung §8).
