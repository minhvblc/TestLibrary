# [SCR-PUB-03] Trang bài test
**Meta**

| id | module | doc level | platforms | route | access | indexable | viewports | related FLOW | status | design | tracking | api | Evidence / visual basis |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| SCR-PUB-03 | PUB | Short | Web | `/tests/:slug` | public | index | 390 · 768 · 1280 | FLOW-lam-bai-mien-phi | Draft | (sau design) | `tracking-events.md` → `test_page` | §5 (inline) | **EV-TLW-053 · EV-TLW-052 · EV-TLW-014 · SC-TLW-12 · basis RS·F-04 · F-27 · CS-03** |

**Changelog** (mới nhất trước)
- 2026-09-27 · v1 · claude-opus-5-5 · khởi tạo (exemplar SCR short).

## 1. Purpose

Trang đích SEO của từng bài: nói thật bài đo gì, dài bao lâu, chấm điểm thế nào, và nhận được gì miễn phí hay trả phí. Sau đó đưa người dùng vào làm bài bằng một nút. Khác đối thủ ở hai điểm: tên bài trung thực với chủ đề (đối thủ đặt tên "mềm" để che từ khoá lâm sàng, RS·F-04), và số câu/thời gian là số thật. · basis RS·F-04 · F-27 · Q-06

## 2. Điều hướng

### 2.1 Vào

| Vào qua | Từ | Trigger |
|---|---|---|
| NAV-PUB-01-1 | SCR-PUB-01 | thẻ bài "Start test" |
| NAV-PUB-02-1 | SCR-PUB-02 | thẻ bài "Start test" |
| NAV-TEST-01-2 | SCR-TEST-01 | "Exit" |
| NAV-TEST-01-5 | SCR-TEST-01 | "Not now" (bước consent bài `sensitive`) |
| NAV-APP-01-1 | SCR-APP-01 | "Start test" / thẻ gợi ý |
| entry ngoài | SEO · link chia sẻ · URL trực tiếp | SYS-NAV §4 |

### 2.2 Ra

| NAV-ID | Tới (SCR-ID · tham số) | Trigger (CMP-ID "nhãn") | Kiểu | URL / history | Animation | Back / đóng → | Guard / điều kiện | Nền tảng | Basis |
|---|---|---|---|---|---|---|---|---|---|
| NAV-PUB-03-1 | SCR-TEST-01 · `slug` | CMP-03 "Start test" | push | route mới `/tests/:slug/take` (push) | mặc định | back trình duyệt → SCR-PUB-03 | bài `sensitive`: SCR-TEST-01 mở ở bước consent (BR-TEST-04) | Web | RS·F-13 |
| NAV-PUB-03-2 | SCR-TEST-01 · `slug`, resume | CMP-08 "Continue where you left off" | push | `/tests/:slug/take` (push) | mặc định | back trình duyệt → SCR-PUB-03 | có tiến độ chưa nộp trên thiết bị | Web | TK-04 (EV-TLW-065) |
| NAV-PUB-03-3 | SCR-TEST-02 · `resultId` | CMP-08 "See your latest result" | push | `/results/:resultId` (push) | mặc định | back trình duyệt → SCR-PUB-03 | có kết quả gần nhất của bài này trên thiết bị / tài khoản | Web | BR-APP-08 |
| NAV-PUB-03-4 | SCR-PUB-04 | CMP-04 "See pricing" | push | `/pricing` (push) | mặc định | back trình duyệt → SCR-PUB-03 | — | Web | Q-02 |
| NAV-PUB-03-5 | external: trang nguồn hỗ trợ khủng hoảng | CMP-06 "Get support now" | external | tab mới | mặc định | đóng tab → SCR-PUB-03 | chỉ bài `sensitive` | Web | Q-06 |
| NAV-PUB-03-6 | SCR-PUB-02 | CMP-10 "Browse all tests" | push | `/tests` (push) | mặc định | back trình duyệt → SCR-PUB-03 | chỉ ở state Empty / Error / Locked | Web | in-house |

## 3. Layout & components

- **Bố cục @390 (top→bottom):**
  - header;
  - hero (tên bài H1 → 1 câu mô tả → 3 chip meta → nút "Start test" full width);
  - GC-SensitiveNotice (chỉ bài `sensitive`, NẰM TRƯỚC nút);
  - khối "Continue / latest result" (nếu có);
  - "What you'll get";
  - "How scoring works";
  - FAQ;
  - footer.
  - Khi cuộn qua hero thì hiện thanh dính đáy "Start test".

| CMP-ID | Component | Type / GC- | Behavior & rules | Basis (EV / Q / in-house) |
|---|---|---|---|---|
| CMP-01 | Header | GC-SiteHeader (public) | theo GC | SYS-NAV §1 |
| CMP-02 | Hero bài | H1 + mô tả + chip | chip: "[n] questions" · "About [m] min" · "Free summary"; số từ API-CAT-02 (BR-PUB-05) | EV-TLW-053 · EV-TLW-014 |
| CMP-03 | Nút "Start test" | button chính | bắt đầu attempt mới; nếu có attempt dở thì CMP-08 hiện trên nút | RS·F-13 |
| CMP-04 | "What you'll get" | 2 cột: "Free summary" / "Full report" + link "See pricing" | free: điểm mọi thang + type + giải thích ngắn; full: danh sách chương thật + "About [N] pages" (số thật, TD-02) | RS·F-14 · F-23 |
| CMP-05 | "How scoring works" | đoạn + danh sách | nêu thang đo, có câu đảo chiều, "Scored with version [v]" | BR-APP-07 · RS·F-14 |
| CMP-06 | Thông báo bài nhạy cảm | GC-SensitiveNotice | "This is a self-reflection tool, not a diagnosis." + "Get support now" | Q-06 |
| CMP-07 | FAQ | accordion (mở nhiều mục được) + JSON-LD `FAQPage` | câu hỏi về thời gian, riêng tư, giá | tieu-chuan-chung §8 |
| CMP-08 | Tiếp tục / kết quả gần nhất | thẻ phụ | "Continue where you left off · Question [k] of [n]" hoặc "See your latest result · [date]" | TK-04 · BR-APP-08 |
| CMP-09 | Footer | GC-SiteFooter | theo GC | SYS-NAV §1 |
| CMP-10 | Link "Browse all tests" | link | hiện ở state Empty / Error (404) / Locked (NAV-PUB-03-6) | in-house |

## 4. States

| State | Trigger | Hiển thị | EV / basis |
|---|---|---|---|
| Default | API-CAT-02 trả bài `published` | đủ CMP-01…09 theo loại bài | EV-TLW-053 |
| Loading | điều hướng phía client (lần đầu SSR, không có loading) | skeleton hero + 2 khối | tieu-chuan-chung §3 |
| Empty | bài `unpublished` (đang cập nhật) | "This test is being updated. Try another test." + link "Browse all tests" | in-house |
| Error | slug không tồn tại → 404; API lỗi khi điều hướng client | 404: "We couldn't find that test." + "Browse all tests" · lỗi mạng: "Couldn't load this test. Try again." | tieu-chuan-chung §2 |
| Locked | bài bị tắt theo vùng (cong-nghe-loi §6 #3) | "This test isn't available in your region." + "Browse all tests"; ẩn CMP-03 | cong-nghe-loi §6 |

## 5. API

| API | Method | When called |
|---|---|---|
| API-CAT-02 | GET | render (SSR) + điều hướng client; trả tên, mô tả, số câu, thời gian median, cờ `sensitive`, trạng thái, danh sách chương report, số trang report, FAQ |

Lỗi riêng: 404 → state Error (404). Còn lại theo `00-quy-uoc-api` §4.

## 6. Tracking

| Event | Note |
|---|---|
| `screen_active` · `test_page` | chỉ bắn sau consent; **không bắn** với bài `sensitive` (BR-APP-06) |

## 7. Business rules & edge cases

| BR-ID | Rule | Basis |
|---|---|---|
| BR-PUB-05 | Số câu + thời gian hiển thị lấy từ dữ liệu bài (median thời gian làm thật), không làm tròn xuống | đối thủ ghi "5-minute" cho bài "100 questions · 20 mins" `[LIVE:browser · EV-TLW-014]` |
| BR-PUB-06 | Bài `sensitive`: route không tải analytics (BR-APP-06); GC-SensitiveNotice hiện ở màn đầu, trước nút "Start test"; tên bài nói đúng chủ đề kèm "Not a diagnosis", không đặt tên "mềm" để che từ khoá | Q-06 · RS·F-04 |

| EC-xx | Tình huống | Handling | Basis |
|---|---|---|---|
| EC-01 | Có attempt dở của bài này ở tab khác | CMP-08 dùng tiến độ mới nhất trong localStorage (theo `attemptId`) | TD-01 |
| EC-02 | Khách mở link chia sẻ từ người khác | trang public bình thường; không hiện kết quả của người khác | BR-APP-08 |
| EC-03 | Bài đổi phiên bản thang đo khi user đang làm dở | CMP-08 vẫn tiếp tục attempt cũ (version ghim lúc bắt đầu) | BR-APP-07 |

## 8. Responsive deltas

| Aspect | 390 (gốc) | 768 | 1280 |
|---|---|---|---|
| Hero | 1 cột, nút full width | 2 cột: chữ + khối "What you'll get" | như 768, container tối đa 1120 |
| Nút bắt đầu | thanh dính đáy sau khi cuộn qua hero | không dính | không dính |
| FAQ | accordion | accordion | 2 cột |

## 9. Keyboard & focus

Không có ngoại lệ so với `tieu-chuan-chung §5`.

## 10. AI Notices
- Nội dung "What you'll get" (chương, số trang) phụ thuộc nội dung report TD-02 của từng bài; số trang phải đo từ PDF thật, không ước lượng.
