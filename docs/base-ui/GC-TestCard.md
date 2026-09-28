# GC-TestCard — thẻ bài test trong lưới và khối gợi ý
**Changelog** (mới nhất trước)
- 2026-09-27 · v1 · claude (subagent) · khởi tạo.

## 1. Anatomy (CMP con)

Một thẻ = một bài test, bọc trong `<article>`. Thẻ nói thật bài đo gì, dài bao nhiêu câu, mất khoảng bao lâu, và dẫn vào trang bài (SCR-PUB-03). Dữ liệu lấy từ API-CAT-01.

| CMP con | Thành phần | Nội dung / copy verbatim (en-US) | Ghi chú |
|---|---|---|---|
| `topic` | nhãn chữ nhỏ `type.label`, không phải link | "Personality" · "Relationships" · "Career" · "Wellbeing" | cùng bộ nhãn với chip lọc của SCR-PUB-02 CMP-03; bài `sensitive` dùng `sensitive-label` thay chỗ này |
| `sensitive-label` | nhãn `type.body-sm`, nền `color.sensitive-bg`, chữ `color.text`, `radius.sm` | "Wellbeing · Not a diagnosis" | chỉ bài `sensitive` (BR-PUB-03) |
| `title` | heading, cấp do màn truyền | tên bài từ API-CAT-01 | `type.h3`; tên đúng chủ đề (BR-PUB-06); không dùng tên thương hiệu của bên khác (Q-07) |
| `description` | 1 câu | mô tả ngắn từ API-CAT-01 | `type.body-sm`, `color.text-muted`; hiển thị tối đa 2 dòng, quá thì cắt "…" (nội dung gốc không đổi) |
| `meta` | 2 chip `radius.pill` | "[n] questions" · "About [m] min" | `type.label`; số thật (xem §4) |
| `cta` | link dạng nút | "Start test" | → `/tests/:slug` (SCR-PUB-03), push; accessible name "Start test: [title]" (phần sau dấu hai chấm ẩn thị giác) |

Thẻ: nền `color.surface`, viền `color.border`, `radius.lg`, đệm `space.4`, khoảng cách giữa các phần `space.2`.

## 2. Props / variants

| Variant | Khi dùng | Khác biệt |
|---|---|---|
| `standard` | bài không có cờ `sensitive` | `topic` · `title` · `description` · `meta` · `cta` |
| `sensitive` | bài có cờ `sensitive` (Q-06) | `sensitive-label` thay `topic`; phần còn lại giống `standard`; CTA không đổi màu, không icon cảnh báo đỏ |

| Prop | Kiểu | Mặc định | Ý nghĩa |
|---|---|---|---|
| `slug` | string | bắt buộc | tạo href `/tests/:slug` |
| `title` | string | bắt buộc | tên bài |
| `description` | string | bắt buộc | 1 câu mô tả |
| `topic` | `personality` · `relationships` · `career` · `wellbeing` | bắt buộc | nhãn `topic` (i18n key) |
| `questionCount` | integer | bắt buộc | số câu của `contentVersion` đang phát hành |
| `medianMinutes` | number hoặc null | null | median thời gian làm thật (đo nội bộ); hiển thị làm tròn LÊN phút nguyên |
| `sensitive` | boolean | false | chọn variant |
| `headingLevel` | 2 · 3 | 3 | giữ thứ tự heading đúng theo trang |

## 3. States (5) + hover / focus / disabled

| State | Khi nào | Hiển thị / hành vi | Basis |
|---|---|---|---|
| Default | có dữ liệu bài | đủ CMP con theo variant | EV-TLW-013 |
| Loading | danh sách đang tải từ 300 ms trở lên | skeleton cùng kích thước thẻ: 1 thanh tiêu đề, 1 dòng mô tả, 2 chip, 1 nút; màn quyết số thẻ skeleton (SCR-PUB-01: 6) | tieu-chuan-chung §3 |
| Empty | thẻ thiếu `questionCount` hoặc `medianMinutes` (lỗi cấu hình nội dung) | ẩn chip bị thiếu, không đoán số; thẻ vẫn hiện; ghi log lỗi nội dung. Danh sách rỗng là state Empty của MÀN (SCR-PUB-01 · SCR-PUB-02), không phải của thẻ | BR-PUB-05 |
| Error | N/A — thẻ không tự gọi API; lỗi tải danh sách do màn xử lý | — | API-CAT-01 |
| Locked | N/A — mọi bài đều làm miễn phí; bài bị tắt theo vùng không có trong kết quả API-CAT-01 | — | Q-02 · cong-nghe-loi §6 |
| hover | con trỏ trên thẻ | viền `color.accent`, `shadow.card-hover`, CTA gạch chân; chuyển `motion.fast` · `easing.standard` | in-house |
| focus | focus bàn phím vào `cta` | `focus.ring` quanh CTA; viền thẻ đổi `color.accent` (`:focus-within`) | tieu-chuan-chung §5 |
| disabled | N/A — không có thẻ disable; bài không làm được thì không được liệt kê | — | API-CAT-01 |

## 4. Behavior & rules (BR nếu có)

| Rule | Mô tả | Basis |
|---|---|---|
| Số thật | `questionCount` = số câu thật của bản đang phát hành; thời gian = median nội bộ, làm tròn lên (vd median 7.2 phút → "About 8 min"), không bao giờ làm tròn xuống cho hấp dẫn; thiếu số liệu thì ẩn chip, không đoán | BR-PUB-02 · BR-PUB-05 · tieu-chuan-chung §4 · đối thủ ghi "100 questions" · "20 mins" cho gần như mọi thẻ `[LIVE:browser · EV-TLW-014]` |
| Số nhiều | "[n] questions" dùng plural ICU (1 → "1 question") | tieu-chuan-chung §4 (i18n key) |
| CTA dẫn tới trang bài, không tới trang giá | "Start test" → SCR-PUB-03; thẻ không có giá, không badge "Premium" (mọi bài làm miễn phí) | BR-PUB-01 · RS·F-03 · EV-TLW-012 · Q-02 |
| Một điểm dừng tab | cả thẻ bấm được (click ở vùng thẻ chuyển tiếp tới `cta`, bỏ qua khi người dùng đang bôi chọn chữ) nhưng chỉ `cta` nhận focus; `topic` không phải link (lọc nằm ở SCR-PUB-02 CMP-03) | tieu-chuan-chung §5 |
| Nhãn khớp chữ nhìn thấy | accessible name của CTA bắt đầu bằng đúng chữ "Start test" để điều khiển bằng giọng nói gọi được | tieu-chuan-chung §5 (WCAG 2.2 AA) |
| Không social proof giả | không "X people took this", không sao đánh giá, không "Popular" / "New" khi không có dữ liệu thật | RS·F-17 |
| Nhãn nhạy cảm | bài `sensitive` luôn có "Wellbeing · Not a diagnosis"; màu bình tĩnh (`color.sensitive-bg`), không dùng `color.danger` | BR-PUB-03 · Q-06 |
| Tên trung thực | tên hiển thị nói đúng chủ đề, không đặt tên "mềm" để che từ khoá lâm sàng | BR-PUB-06 · RS·F-04 · EV-TLW-052 |
| Thứ tự trong lưới | do màn / API quyết (bài nổi bật, lọc theo chủ đề); GC không tự sắp xếp | API-CAT-01 |
| Tracking | GC không bắn event; không đưa slug bài `sensitive` vào analytics | BR-APP-05 · tracking-events |

## 5. Dùng ở màn nào (SCR-IDs)

| SCR-ID | Variant | CMP ở màn | Ghi chú |
|---|---|---|---|
| SCR-PUB-01 | `standard` · `sensitive` | CMP-03 (6 bài nổi bật) | skeleton 6 thẻ khi tải |
| SCR-PUB-02 | `standard` · `sensitive` | CMP-04 (lưới theo chủ đề) | lọc `?topic=` do màn xử lý (BR-PUB-04) |
| SCR-APP-01 | `standard` | CMP-07 (3 bài gợi ý) | màn bỏ bài `sensitive` khỏi gợi ý nên chỉ dùng `standard` |

## 6. Responsive

| Aspect | 390 (gốc) | 768 (`bp.md`) | 1280 (`bp.lg`) |
|---|---|---|---|
| Lưới (màn quyết) | 1 cột, không carousel | 2 cột | 3 cột |
| Bên trong thẻ | xếp dọc; CTA rộng hết chiều ngang thẻ | xếp dọc; CTA rộng theo nhãn, ghim ở đáy thẻ | như 768; các thẻ cùng hàng cao bằng nhau |
| `description` | tối đa 2 dòng | tối đa 2 dòng | tối đa 2 dòng |
| Vùng chạm | CTA đạt `layout.touch-target` (tieu-chuan-chung §5) | như 390 | như 390 |

## 7. Basis (EV / Q)

| Quyết định | Basis |
|---|---|
| Cấu trúc thẻ: tên · mô tả · chip · CTA (đối thủ: tên · mô tả · độ khó · số câu · phút · "Try now") | EV-TLW-013 · EV-TLW-050 · EV-TLW-215 · CS-02 |
| Bỏ chip độ khó; giữ số câu và thời gian nhưng phải là số thật | EV-TLW-014 · BR-PUB-02 · BR-PUB-05 |
| CTA dẫn vào bài chứ không vào trang giá (đối thủ: mọi "Try now" → `/pricing`) | RS·F-03 · EV-TLW-012 · BR-PUB-01 |
| Tên trung thực + nhãn "Not a diagnosis" cho bài nhạy cảm | RS·F-04 · EV-TLW-052 · BR-PUB-03 · BR-PUB-06 · Q-06 |
| Lưới 1 cột ở 390 thay vì carousel 1 thẻ như đối thủ (screen reader đọc hết, không ẩn thẻ ngoài khung) | EV-TLW-203 · tieu-chuan-chung §5 |
| Tên bài không dùng thương hiệu bên khác | Q-07 |

## 8. AI Notices
- Viết bởi claude (subagent) ở Phase 4 từ spec blueprint (SCR-PUB-01 · SCR-PUB-02 · SCR-APP-01) + SCR-PUB-03.
- Bộ nhãn chủ đề giả định đúng 4 chủ đề của chip lọc SCR-PUB-02 CMP-03. Thêm chủ đề thì thêm i18n key.
- Giả định mọi bài `sensitive` thuộc chủ đề "Wellbeing", vì nhãn của BR-PUB-03 cố định là "Wellbeing · Not a diagnosis". Nếu có bài `sensitive` ở chủ đề khác thì phải chốt lại copy nhãn.
- Chưa có quy tắc từ bao nhiêu lượt làm thật thì median thật thay cho số đo nội bộ. Cần content / data chốt; tới lúc đó dùng số đo nội bộ (tieu-chuan-chung §4).
- Ví dụ "7.2 phút → About 8 min" chỉ minh hoạ quy tắc làm tròn, không phải số của bài nào.
