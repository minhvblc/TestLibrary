# [SPK-02] Spike render PDF report bằng Playwright — thời gian + RAM
> Trả lời spike #2 của `docs/overview/cong-nghe-loi.md` §7 (= `research/core-tech.md` §9 #2): "PDF 20+ trang tạo trong bao lâu, tốn bao nhiêu RAM". Chặn TD-03 · Q-19 · economy-FREEZE. Đây là số đo **engine render** trên report mẫu, chưa phải số của app thật.
**Changelog** (mới nhất trước)
- 2026-09-28 · v1 · claude-opus-5-5 · chạy trong container cloud của phiên; script + số liệu thô ở `pdf-render/`.

## 1. Môi trường

| Mục | Giá trị |
|---|---|
| Máy | container cloud: 4 vCPU Intel Xeon 2,8 GHz · 16 GB RAM (không phải cấu hình production) |
| Phần mềm | Node v22.22.2 · Playwright 1.56.1 · Chromium headless shell 141.0.7390.37 |
| Font | tự host, đúng FND-tokens: Newsreader (variable) · Atkinson Hyperlegible Next (variable) · IBM Plex Mono 400 — gói `@fontsource` 5.3.0, nạp qua `file://` |
| Tuỳ chọn PDF | A4 · `printBackground` · `preferCSSPageSize` · footer số trang "n / N" |

## 2. Report mẫu

Dựng theo khung in của SCR-APP-03 (`/app/reports/:reportId?print=1`, TD-03): hero (tên bài, ngày, `scoringVersion` · `contentVersion`, tên type, mô tả), "Your scores" 9 thang (SVG, kiểu GC-ScoreBars), mục lục, mỗi chương sang trang mới với 7 đoạn, 1 câu trích, 1 minh hoạ vector (~40 path), khối "Try this". Chữ sinh từ một danh sách từ cố định bằng PRNG có seed — không phải nội dung thật.

| Biến thể | Nguồn | Trang PDF | Dung lượng PDF |
|---|---|---|---|
| A · 22 trang | 10 chương · 7.156 từ | 22 | 197 KB |
| B · 40 trang (trần TD-03) | 19 chương · 13.771 từ | 40 | 269 KB |
| C · A + 10 ảnh bitmap | như A, thay minh hoạ vector bằng 10 PNG 1200×800 (tổng 1,8 MB) | 32 | 2,8 MB |
| D · A trên 1 CPU | như A, cả Node lẫn Chromium bị ghim vào 1 CPU (`taskset -c 0`) | 22 | 197 KB |

## 3. Cách đo

| Kiểu | Làm gì | Lặp |
|---|---|---|
| Cold | mở Chromium → tải trang + chờ `document.fonts.ready` → `page.pdf()` → đóng Chromium | 5 |
| Warm | một Chromium dùng lại (có 1 lần khởi động làm nóng), mỗi PDF một context mới | 5 |
| Song song | cùng một Chromium ấm, 4 trang render cùng lúc (D: 2), tổng 12 PDF (D: 8) | 1 |
| RAM | cộng VmRSS của mọi process Chromium, lấy mẫu mỗi 25 ms, ghi đỉnh | mọi lần |

Với n = 5, cột p95 bằng giá trị lớn nhất.

## 4. Kết quả

| Biến thể | Cold p50 / p95 (ms) | Mở Chromium p50 (ms) | Warm p50 / p95 (ms) | Riêng `page.pdf()` warm p50 (ms) | Đỉnh RAM Chromium 1 job (MB) | Song song |
|---|---|---|---|---|---|---|
| A · 22 trang | 316 / 347 | 51 | 211 / 264 | 106 | ~415 | c = 4: 12 PDF trong 1,18 s (≈ 609 PDF/phút) · mỗi job p50 315 ms · đỉnh RAM 785 MB |
| B · 40 trang | 392 / 430 | 62 | 257 / 264 | 144 | ~419 | — |
| C · 32 trang + ảnh | 723 / 747 | 54 | 579 / 728 | 493 | ~469 | c = 4: 12 PDF trong 3,10 s (≈ 232 PDF/phút) · mỗi job p50 791 ms · đỉnh RAM 976 MB |
| D · 22 trang, 1 CPU | 478 / 574 | 109 | 246 / 272 | 104 | ~413 | c = 2: 8 PDF trong 2,25 s (≈ 214 PDF/phút) · đỉnh RAM 541 MB |

Số thô: `pdf-render/results/*.json`.

## 5. Kết luận

| Câu hỏi | Trả lời | Nhãn |
|---|---|---|
| Engine có kịp ngân sách TD-03 (p95 ≤ 10 s lần đầu, ≤ 40 trang) không? | có, dư nhiều: mọi biến thể dưới 0,75 s kể cả mở Chromium mới; trần 40 trang chỉ tốn thêm ~40 ms so với 22 trang | đo |
| Cái gì làm chậm nhất? | ảnh bitmap: 1,8 MB ảnh làm `page.pdf()` chậm gần 5 lần (106 → 493 ms) và PDF nặng 14 lần (197 KB → 2,8 MB). Minh hoạ nên là vector (SVG); PDF của đối thủ nặng 4,69 MB cho 11 trang (F-34) | đo |
| Cần pool Chromium không? | chưa cần ở MVP: mở Chromium mới chỉ tốn 50–110 ms; dùng lại browser tiết kiệm ~100–250 ms mỗi PDF | đo |
| RAM cho worker | ~0,42 GB cho 1 job; ~0,8–1 GB cho 4 job song song. Đề xuất worker 1 vCPU / 1 GB chạy tối đa 2 job, hoặc 2 vCPU / 2 GB chạy 4 job | đo (RAM) · `[INFERRED]` (cỡ worker) |
| Chi phí mỗi PDF (Q-19) | khoảng 0,25–0,6 s CPU mỗi PDF. Với ~2 PDF / user / tháng (`cong-nghe-loi` §5) là ~1 giây CPU / user / tháng → phần tính toán gần như bằng 0. Chi phí thật nằm ở worker luôn chạy (nếu có) và object storage, cần giá vendor (Q-19) | đo (CPU) · `[INFERRED]` (quy ra tiền: chưa làm) |
| Số trang cho nút "Download PDF ([N] pages)" (BR-REP-04) | đọc được chính xác từ file vừa tạo (pdf-lib `getPageCount`); lưu `pageCount` cùng file cache | đo |

## 6. Chưa đo (cần app thật)

| Mục | Vì sao quan trọng |
|---|---|
| Route in thật `/app/reports/:reportId?print=1` (SSR / hydrate, gọi API-REP-02, xác thực cho worker) | đây mới là phần có thể ăn phần lớn ngân sách 10 s; spike chỉ đo trang tĩnh `file://` |
| Tải font / ảnh qua HTTP, CDN | spike nạp font từ đĩa |
| Khởi động lạnh của container worker (nếu serverless) | có thể thêm vài giây ở lần đầu |
| Upload object storage + signed URL (API-REP-04) | ảnh hưởng thời gian tới lúc tải được |
| PDF có tag (a11y), bookmark theo chương | chưa kiểm tuỳ chọn của Chromium / Playwright |
| Ngôn ngữ khác (font CJK, RTL) | MVP chỉ en-US (Q-14) |

## 7. Chạy lại

```bash
cd research/spikes/pdf-render
npm install                      # font @fontsource + pdf-lib (Playwright dùng bản đã cài sẵn)
node make-report.cjs 10 report-10.html && node make-report.cjs 19 report-19.html
node spike.cjs report-10.html 5 --concurrency 4 --jobs 12 --label "22 trang"
node spike.cjs report-19.html 5 --label "40 trang"
taskset -c 0 node spike.cjs report-10.html 5 --concurrency 2 --jobs 8 --label "22 trang, 1 CPU"
```

Biến thể C:

```bash
node make-image-variant.cjs report-10.html report-10-img.html   # 10 PNG 1200×800 thay minh hoạ vector
node spike.cjs report-10-img.html 5 --concurrency 4 --jobs 12 --label "22 trang + 10 ảnh bitmap"
```

## 8. AI Notices
- Số đo trên container 4 vCPU của phiên cloud, n = 5, không phải production. Dùng để chốt hướng (engine đủ nhanh, cỡ RAM), không dùng làm SLA.
- Report mẫu có cấu trúc và độ dài giống report thật nhưng chữ là chữ sinh ngẫu nhiên; report thật có thể có nhiều ảnh hơn (biến thể C là trường hợp nặng).
- Chưa quy ra tiền: giá hạ tầng phải lấy từ vendor lúc chốt (Q-19), không dùng số nhớ.
