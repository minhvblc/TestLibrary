# GC-ScoreBars — thanh điểm theo từng thang (kết quả tóm tắt + report)
**Changelog** (mới nhất trước)
- 2026-09-27 · v1 · claude (subagent) · khởi tạo.

## 1. Anatomy (CMP con)

Mỗi thang của bài là một hàng: tên thang, một thanh ngang và số phần trăm, xếp giảm dần. Khối được render bằng `<table>` thật, nên screen reader đọc được theo hàng và bản in / PDF giữ đủ số mà không cần bản sao ẩn.

| CMP con | Thành phần | Nội dung / copy verbatim (en-US) | Ghi chú |
|---|---|---|---|
| `caption` | `<caption>` của bảng | "Your scores" | cấp heading của khối do màn quyết |
| `row` × n | 1 hàng cho 1 thang | `label` + `bar` + `value` | xếp giảm dần theo điểm |
| `label` | `<th scope="row">`, `type.body-sm` | tên thang từ API (theo định nghĩa bài) | viết đầy đủ, không viết tắt |
| `bar` | track `color.surface-muted` + phần tô `color.bar`; thang cao nhất tô `color.bar-strong` | độ dài phần tô = điểm 0–100% | `aria-hidden`, chỉ để minh hoạ; `radius.pill` |
| `value` | trong `<td>`, `type.label` | "[x]%" | số nguyên; chữ luôn hiện và nằm NGOÀI thanh |
| `scale-note` | 1 dòng dưới bảng, `type.caption`, `color.text-muted` | "Each bar shows your score on that scale, from 0% to 100%. It's not a comparison with other people." | để không bị đọc nhầm thành percentile |

## 2. Props / variants

| Variant | Khi dùng | Khác biệt |
|---|---|---|
| `default` | SCR-TEST-02 CMP-03 · SCR-APP-03 CMP-04 trên màn hình | như §1 |
| `print` | SCR-APP-03 khi render bản in (`?print=1`) để tạo PDF (TD-03) | màu in an toàn, không bóng, bảng không bị cắt ngang giữa hai trang; `value` luôn in |

| Prop | Kiểu | Mặc định | Ý nghĩa |
|---|---|---|---|
| `scales` | danh sách `{ id, label, percent, order }` | bắt buộc | từ API-RES-01 (SCR-TEST-02) hoặc API-REP-02 (SCR-APP-03); `percent` do server tính |
| `order` (trong mỗi thang) | integer | bắt buộc | thứ tự chuẩn của thang trong định nghĩa bài; dùng để phá hoà khi sắp xếp |
| `sort` | `desc` | `desc` | giảm dần theo `percent` chưa làm tròn; bằng nhau thì theo `order` |
| `variant` | `default` · `print` | `default` | |
| `headingLevel` | 2 · 3 | 2 | cho heading đi kèm khối |

## 3. States (5) + hover / focus / disabled

| State | Khi nào | Hiển thị / hành vi | Basis |
|---|---|---|---|
| Default | có từ 1 thang trở lên | bảng đủ hàng, xếp giảm dần | EV-TLW-079 |
| Loading | kết quả / report đang tải từ 300 ms trở lên | skeleton n hàng (n = số thang của bài nếu đã biết, không thì 5) | tieu-chuan-chung §3 |
| Empty | N/A — kết quả luôn có ít nhất 1 thang; 0 thang là lỗi dữ liệu, màn chuyển sang Error | — | BR-APP-07 |
| Error | N/A ở GC — lỗi tải (410, mạng) do màn hiện theo cong-nghe-loi §3; GC không render | — | cong-nghe-loi §3 |
| Locked | N/A — điểm luôn miễn phí; kể cả state Locked của SCR-APP-03 (chưa mở report) vẫn hiện điểm | — | BR-TEST-07 · BR-REP-06 |
| hover | N/A — khối không tương tác, không tooltip; số đã hiện sẵn | — | in-house |
| focus | N/A — không có phần tử focus được; screen reader duyệt bằng phím điều hướng bảng | — | tieu-chuan-chung §5 |
| disabled | N/A — không có control | — | in-house |

## 4. Behavior & rules (BR nếu có)

GC không có BR riêng. Quy tắc cite BR của SCR-TEST-02 / SCR-APP-03 và BR-APP.

| Rule | Mô tả | Basis |
|---|---|---|
| Số từ server | GC chỉ hiển thị `percent` server đã chấm theo `scoring_version`; client không tính lại | BR-APP-07 · TD-01 |
| Đủ mọi thang, miễn phí | không ẩn, không làm mờ, không khoá thang nào để ép mua | BR-TEST-07 · P-04 · RS·F-14 |
| Làm tròn | hiện số nguyên (làm tròn chuẩn: .5 lên); sắp xếp theo giá trị chưa làm tròn | in-house |
| Màu một sắc (độ lớn) | mọi thanh tô `color.bar`; thang có điểm cao nhất (hàng đầu sau khi sắp; bằng điểm thì mọi hàng hoà ở đầu) tô `color.bar-strong`; không dùng palette `color.chart-1` … `color.chart-8`, vì thứ cần so là độ lớn chứ không phải nhóm; tên thang là thứ phân biệt, không dựa vào màu | FND-tokens §1 · tieu-chuan-chung §5 |
| Tương phản | `color.bar` và `color.bar-strong` đạt tương phản cho thành phần đồ hoạ trên nền sáng lẫn tối (FND-tokens §1); chữ đạt tương phản chữ (tieu-chuan-chung §5) | FND-tokens §1 · tieu-chuan-chung §5 |
| Không animation "đang phân tích" | thanh hiện ngay giá trị cuối, không chạy tăng dần | RS·F-16 · tieu-chuan-chung §3 |
| Text thay biểu đồ | bảng thật (`caption` + `th` + `td`); thanh là trang trí `aria-hidden`, screen reader đọc "[label], [x]%" theo từng hàng | tieu-chuan-chung §5 |
| Cùng kết quả, cùng hiển thị | SCR-TEST-02 và SCR-APP-03 của cùng một kết quả cho cùng thứ tự và cùng số | BR-REP-03 · BR-APP-07 |
| Chỉ thang một chiều | MVP chỉ hỗ trợ thang 0–100% một chiều; thang hai cực (A ↔ B) nằm ngoài scope | in-house |
| Bài `sensitive` | hiện như bài thường cho chính người làm; route không bắn event | BR-APP-06 |
| Tracking | GC không bắn event | tracking-events |

## 5. Dùng ở màn nào (SCR-IDs)

| SCR-ID | Variant | CMP ở màn | Ghi chú |
|---|---|---|---|
| SCR-TEST-02 | `default` | CMP-03 | mọi thang, %, xếp giảm dần (BR-TEST-07) |
| SCR-APP-03 | `default` · `print` | CMP-04 | cùng số và thứ tự với SCR-TEST-02 của cùng kết quả; có trong PDF (BR-REP-04) |

## 6. Responsive

| Aspect | 390 (gốc) | 768 (`bp.md`) | 1280 (`bp.lg`) |
|---|---|---|---|
| Hàng | `label` ở dòng trên; `bar` + `value` ở dòng dưới, `value` ở cuối thanh | như 390 | 1 dòng: cột `label` bên trái · `bar` · `value` |
| Tên thang dài | xuống dòng, không cắt | như 390 | xuống dòng trong cột `label` |
| Bản in (`print`) | không áp dụng (PDF render theo bố cục in) | không áp dụng | bố cục 1 dòng như 1280, bảng không cắt ngang trang |

## 7. Basis (EV / Q)

| Quyết định | Basis |
|---|---|
| Một thanh ngang cho mỗi thang, có %, xếp từ cao xuống thấp (đối thủ: 9 thanh màu pastel, % trong vòng tròn ở đầu thanh) | EV-TLW-079 · design-report §3 · CS-07 |
| Kết quả phải phụ thuộc câu trả lời (đối thủ cho cùng điểm với mọi kiểu trả lời) | RS·F-14 · EV-TLW-138 · EV-TLW-076 · BR-APP-07 |
| Report dùng lại cùng khối điểm (đối thủ: khối "Your Scores" của report giống kết quả free) | EV-TLW-243 · EV-TLW-244 · CS-14 |
| % đặt ngoài thanh, luôn là chữ | tieu-chuan-chung §5 · in-house |
| PDF có đủ điểm | TD-03 · BR-REP-04 |
| Không làm mờ / khoá điểm để ép mua (đối thủ làm mờ bản report minh hoạ ở trang bài và trang offer) | BR-TEST-07 · P-04 · EV-TLW-053 · EV-TLW-108 |

## 8. AI Notices
- Viết bởi claude (subagent) ở Phase 4 từ spec blueprint (SCR-TEST-02 · SCR-APP-03).
- `percent` được hiểu là điểm quy về 0–100% trên khoảng của thang, không phải percentile (chưa có dữ liệu chuẩn hoá / norms). Nếu sau này có norms thì cần copy mới và variant mới. Server phải trả đúng định nghĩa này.
- `scale-note` và `caption` là copy đề xuất.
- Thang hai cực nằm ngoài scope MVP. Bài nào cần kiểu này phải thêm variant trước khi phát hành.
- Lệch so với brief: brief yêu cầu mỗi thang một màu (theo gợi ý đối thủ, EV-TLW-079). FND-tokens §1 (owner của token) đã chốt thanh điểm dùng một sắc `color.bar` / `color.bar-strong` và KHÔNG dùng palette 8 màu (ở nền sáng, `color.chart-3` … `color.chart-5` dưới 3:1). GC theo FND-tokens. Nếu human vẫn muốn mỗi thang một màu thì đổi rule "Màu một sắc" sang `color.chart-1` … `color.chart-8` theo `order`, và bắt buộc giữ nhãn trực tiếp + bảng.
- Bố cục responsive theo SCR-TEST-02 §9 (nhãn ở trên tới 768, cùng hàng từ 1280).
