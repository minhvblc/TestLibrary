# Tiêu chuẩn chung — TestLib (web)
> Viết một lần ở đây; SCR chỉ ghi **ngoại lệ**. Copy UI là en-US (Q-14).
**Changelog** (mới nhất trước)
- 2026-09-28 · v1.2 · claude-opus-5-5 · Rendering: `/tests?topic=` render theo request + cache CDN theo `topic` (Q-09).
- 2026-09-28 · v1.1 · claude-opus-5-5 · Q-09 (Next.js SSG + revalidate) và Q-20 (GPC = "Reject all") đã chốt 2026-09-28 (AI · uỷ quyền human).
- 2026-09-27 · v1 · claude-opus-5-5 · baseline web từ cong-nghe-loi §2–4 + research (perf đối thủ, consent).

## 1. Session & auth

| Tình huống | Hành vi | Basis |
|---|---|---|
| Khách (guest) | làm bài, xem kết quả tóm tắt, mở trang mở khoá, thanh toán — không cần tài khoản; quyền với kết quả gắn token cookie HttpOnly `tl_guest` | BR-APP-08 · SYS-AUTH |
| Route `account` / `entitled` khi chưa đăng nhập | 302 → `/login?next=<route đầy đủ>`; đăng nhập xong quay lại đúng route | SYS-AUTH · BR-APP-10 |
| Phiên hết hạn giữa form | giữ dữ liệu form trong bộ nhớ; hiện "Your session expired. Sign in to continue — we kept what you entered." rồi mở `/login?next=` trong cùng tab | in-house |
| 401 từ API | xoá trạng thái đăng nhập ở client, chuyển `/login?next=` | 00-quy-uoc-api §4 |
| 403 (không có quyền với report) | state **Locked** của màn (không phải trang lỗi) | SYS-ENTITLEMENT |
| Đăng xuất | xoá phiên thiết bị hiện tại; tab khác nhận sự kiện `storage` và chuyển về `/` | BR-APP-10 |

## 2. Network error & offline

| Tình huống | Hành vi mặc định | Copy VERBATIM (en-US) |
|---|---|---|
| Request GET lỗi mạng | giữ nội dung đang có, hiện banner đầu trang, nút thử lại | "You're offline. Check your connection and try again." |
| Mất mạng khi làm bài / nộp bài / thanh toán / PDF | theo degradation contract | cite `cong-nghe-loi §3` (không định nghĩa lại) |
| 5xx | thông báo + nút thử lại; không lộ chi tiết lỗi | "Something went wrong on our side. Please try again." |
| 429 | chờ theo `Retry-After`, không tự lặp | "Too many requests. Please wait a moment and try again." |
| Request đang chạy khi rớt mạng | request ghi (POST/PUT) có idempotency key thì được gửi lại một lần khi online; request đọc thì huỷ và tải lại | 00-quy-uoc-api §5 |

## 3. Loading / empty / error mặc định

| State | Mặc định | Copy |
|---|---|---|
| Loading < 300 ms | không hiện gì (tránh nhấp nháy) | — |
| Loading ≥ 300 ms | skeleton theo đúng bố cục nội dung; spinner chỉ dùng trong nút | — |
| Empty | minh hoạ nhỏ + 1 câu + 1 CTA chính | theo màn |
| Error | nói chuyện gì xảy ra + làm gì tiếp; giữ dữ liệu user | theo màn / §2 |
| Không có loader "giả" | cấm hiệu ứng "đang phân tích" kéo dài để tạo cảm giác (đối thủ: RS·F-16) | — |

## 4. Formatting

| Hạng mục | Quy tắc |
|---|---|
| Số | dấu phân cách theo locale (en-US) |
| Tiền | currency theo planKey (USD); luôn kèm chu kỳ ("per month", "per year", "one-time"); giá gia hạn hiện đầy đủ, không làm nhỏ hơn giá kỳ đầu (BR-APP-02) |
| Ngày | ISO-8601 ở API; UI hiện kiểu "October 12, 2026" theo timezone tài khoản (BR-APP-09) |
| Thời lượng bài | ghi số câu thật + thời gian ước tính thật (median nội bộ), không làm tròn xuống cho hấp dẫn |
| Locale | en-US (Q-14); mọi chuỗi qua i18n key |

## 5. Accessibility baseline — WCAG 2.2 AA

| Hạng mục | Yêu cầu |
|---|---|
| Bàn phím | đi hết mọi luồng bằng bàn phím; câu hỏi Likert chọn được bằng phím 1–5 và mũi tên; focus không bị kẹt |
| Focus | vòng focus nhìn thấy (token `focus.ring`, FND-tokens §5) |
| Contrast | chữ ≥ 4.5:1, chữ lớn/icon ≥ 3:1 |
| Zoom | 200% không vỡ, không cuộn ngang |
| Motion | tôn trọng `prefers-reduced-motion` (tắt chuyển động không cần thiết) |
| Screen reader | landmark (header/main/footer), heading theo thứ tự; tiến độ bài đọc "Question 5 of 24"; kết quả điểm có text thay biểu đồ |
| Target | vùng chạm ≥ 44×44 px ở 390 |
| Form | label luôn hiện; lỗi gắn `aria-describedby`; không chỉ dùng màu để báo lỗi |

## 6. Responsive

| Breakpoint | Giá trị | Ghi chú |
|---|---|---|
| gốc | 390 | thiết kế mobile trước |
| md | 768 | 2 cột cho trang giá, trang mở khoá |
| lg | 1280 | container tối đa 1120 px, căn giữa |
| — | — | KHÔNG cuộn ngang ở mọi width; touch target ≥ 44 px ở 390 |

## 7. Trình duyệt hỗ trợ

Chrome · Safari (macOS + iOS) · Edge · Firefox, 2 bản gần nhất. Tính năng cần fallback: `localStorage` (private mode → bộ nhớ, cong-nghe-loi §3) · `navigator.onLine` + sự kiện online/offline · print CSS cho fallback PDF.

## 8. SEO mặc định

| Hạng mục | Quy tắc |
|---|---|
| title | `<Tên trang> · TestLib` (≤ 60 ký tự) |
| description | ≤ 155 ký tự, viết thật, không hứa hẹn chẩn đoán |
| canonical | URL tuyệt đối không có query theo dõi |
| noindex | mọi route `guest` / `account` / `entitled` + `/cookie-settings` + `/login` |
| OG | title / description / ảnh 1200×630 cho mọi route indexable |
| hreflang | chỉ khi có locale thứ hai (Q-14) |
| JSON-LD | `Organization` (trang chủ) · `FAQPage` (trợ giúp, trang bài) · `Quiz` (trang bài) |
| Rendering | route public render sẵn bằng Next.js (SSG + revalidate, Q-09); riêng `/tests?topic=` render theo request, CDN cache theo `topic`; crawler không chạy JS vẫn đọc được meta + nội dung |
| 404 / 500 | trang có nội dung + link về thư viện bài |

## 9. Performance budget

| Chỉ số | Budget | Basis |
|---|---|---|
| LCP (390, 4G) | ≤ 2,5 s | Core Web Vitals "good"; đối thủ 492 ms trên wifi `[LIVE:browser · EV-TLW-262 · 2026-09-27]` |
| CLS | ≤ 0,05 | đối thủ 0,006 `[LIVE:browser · EV-TLW-262 · 2026-09-27]` |
| INP | ≤ 200 ms | Core Web Vitals "good" (basis in-house) |
| JS tải ban đầu (gzip) | ≤ 200 KB cho route public · ≤ 300 KB cho trang làm bài | đối thủ tải khoảng 1 MB JS (1021 KB) `[LIVE:browser · EV-TLW-262 · 2026-09-27]` |
| Request bên thứ ba trước consent | 0 | BR-APP-05 · đối thủ 30 `[LIVE:browser · EV-TLW-262 · 2026-09-27]` |

## 10. Consent & tracking

- Không bắn analytics/ads nào trước consent (mọi vùng, Q-13). Chỉ cookie `necessary` chạy trước khi user chọn.
- Danh mục cookie + nút ở banner: cite `go-to-market/legal-consent.md` §2–3. Nút "Reject all" ngang hàng "Accept all".
- Route của bài `sensitive` không tải analytics ngay cả khi đã consent (BR-APP-06).
- `AppTracking` che URL trước khi gửi: bỏ query string, thay id bằng `[id]`, thay slug bài `sensitive` bằng `[sensitive]` ở cả `page_location` lẫn `page_referrer` (tracking-events). Header `Referrer-Policy: strict-origin-when-cross-origin` cho mọi trang.
- Tín hiệu Global Privacy Control của trình duyệt = "Reject all": không hiện banner, không tải analytics; user vẫn tự bật lại được ở SCR-PUB-07 (Q-20 · rule ở SYS-CONSENT).
- Event: chỉ hai loại `screen_active` + `ft_*` (cite `tracking/tracking-events.md`).

## 11. AI Notices
- Budget JS/LCP là mục tiêu của mình (basis in-house), neo vào số đối thủ đo được. Đo lại trên staging trước FND/API-FREEZE.
