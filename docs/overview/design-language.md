# Design language — TestLib (register ĐỊNH TÍNH, KHÔNG hex / px / token)
> Chuyển look & feel quan sát được thành hướng đi của MÌNH. Cite `research/apps/testlibrary-web/design-report.md`. Giá trị cụ thể nằm ở `base-ui/FND-tokens.md` (Group C, Q-17: AI chọn, đã chốt 2026-09-28).
**Changelog** (mới nhất trước)
- 2026-09-28 · v1.1 · claude-opus-5-5 · Q-17 đã chốt 2026-09-28 (AI · uỷ quyền human).
- 2026-09-27 · v1 · claude-opus-5-5 · hướng "tủ phiếu thư mục thư viện" (taste mode, không có Figma).

## 1. Mood & tông

| Thuộc tính | Đối thủ (cite design-report) | Hướng của mình |
|---|---|---|
| Bối cảnh hình ảnh | "wellness SaaS" sạch sẽ nhưng na ná: nền trắng, một nút xanh lá, chữ nhấn xanh dương, thanh điểm pastel nhiều màu (design-report §1) | **Tủ phiếu thư mục thư viện giữa thế kỷ.** Mỗi bài test là một tấm phiếu màu kem, nhãn đánh máy, chữ in như sách của nhà xuất bản đại học, mực bút máy xanh. Cảm giác: tra cứu nghiêm túc, không phải game |
| Cảm xúc chủ đạo | dịu nhẹ ở trang chính; gấp gáp và áp lực ở offer (đồng hồ, ticker, logo báo chí — design-report §3 Offer) | **bình tĩnh, được tôn trọng**. Không chỗ nào tạo gấp gáp giả; trang tiền cũng yên như trang đọc |
| Giọng | "Real You", hứa hẹn lớn | thẳng thắn, cụ thể: số câu thật, thời gian thật, "không phải chẩn đoán" |
| Độ "tin cậy" | nhờ testimonial "VERIFIED" và logo đại học | nhờ **minh bạch có thể kiểm chứng**: cách chấm điểm, phiên bản thang đo, điều khoản gia hạn ghi rõ |

## 2. Màu & kiểu chữ ở mức cảm giác

- **Màu:**
  - **Nền giấy kem ấm** chiếm phần lớn bề mặt (màu chủ đạo); thẻ nội dung là giấy sáng hơn một chút, như tấm phiếu đặt trên bàn gỗ.
  - Chữ là **mực xanh-đen** (không đen tuyền).
  - **Một accent duy nhất: xanh mực bút máy**, dùng cho hành động chính và link. Mỗi màn chỉ nên có tối đa 1–2 chỗ đậm màu accent.
  - Màu **vàng bút dạ quang** rất hiếm, chỉ để tô vài chữ quan trọng trong phần "vì sao bạn ra kết quả này".
  - Bài nhạy cảm có khối **xanh lá xám dịu** (sage) mang tính hỗ trợ; không dùng đỏ cảnh báo.
- **Chữ:**
  - Tiêu đề dùng **serif kiểu biên tập** (sách học thuật), cực nhẹ ở cỡ lớn để tạo không khí.
  - Nội dung dùng **sans siêu dễ đọc**, được thiết kế cho người thị lực kém; phù hợp với lời hứa "rõ ràng, tiếp cận được".
  - Nhãn kiểu **máy đánh chữ** (mono, chữ hoa, giãn chữ) cho các chip "24 QUESTIONS · 6 MIN", như nhãn trên phiếu thư mục.
- **Tương phản mạnh:** tiêu đề rất lớn và rất mảnh, đặt cạnh nhãn nhỏ, đậm, đánh máy. Không có tầng chữ "trung bình nhạt".
- **Biểu đồ điểm:** dùng một sắc xanh mực, thang mạnh nhất tô đậm, các thang còn lại nhạt hơn. Độ dài thanh là thứ kể chuyện, không cần 9 màu cầu vồng như đối thủ (design-report §3 Kết quả free). Palette nhiều màu chỉ dùng khi thật sự có nhiều chuỗi dữ liệu cần phân biệt.

## 3. Nhịp điệu, khoảng thở, mật độ

- **Landing & trang bài:** thoáng, nhiều khoảng trắng như trang sách; mỗi section một ý, không xếp chồng banner.
- **Làm bài:** tối giản tuyệt đối. Không header/footer site. Một câu, năm lựa chọn, tiến độ. Không có gì chạy nhảy.
- **Report:** như đọc một chương sách: cột chữ vừa mắt, mục lục cạnh bên ở màn rộng, tiêu đề chương là serif.
- **Độ "thương mại":** tối đa **một** lời mời trả tiền trên mỗi màn không phải màn tiền (khối "Full report" ở kết quả). Không badge "most popular", không ticker, không đồng hồ, không giá gạch (RS·F-17 · F-18). Trang giá và trang mở khoá được phép dày thông tin, nhưng thông tin phải là **điều khoản**, không phải áp lực.

## 4. Responsive · hover / focus · link vs button

- **390 là gốc:** mọi thứ một cột. Nút chính full width ở màn làm bài và trang tiền. Menu vào drawer (không bottom nav).
- **768 / 1280:** thêm cột phụ (mục lục report, khối "What you'll get") và giới hạn độ rộng dòng chữ cho dễ đọc; không kéo dãn nội dung ra hết màn.
- **Hover:** thẻ phiếu nhấc nhẹ lên như được rút khỏi ngăn. **Focus:** vòng rõ ràng quanh phần tử, luôn thấy được trên nền kem lẫn nền xanh.
- **Link vs button:**
  - Hành động (bắt đầu, mua, lưu, huỷ) là **button**. Đi đâu đó để đọc là **link** gạch chân.
  - Nút huỷ gói cũng trông như một nút thật, không bị làm mờ để khó thấy (khác dark pattern).

## 5. Nguyên tắc: học gì, tránh gì

| Học từ đối thủ | Tránh |
|---|---|
| Câu hỏi 1/màn, chọn là sang câu (design-report §7) | Đồng hồ đếm ngược, ticker "vừa mua", logo "featured in" không kiểm chứng (RS·F-17) |
| Avatar minh hoạ tạo cảm giác "kết quả của tôi" | Report mờ + khoá để ép mua; kết quả free giả (RS·F-14) |
| Dashboard giữ chân nhẹ nhàng: check-in, thử thách ngày (design-report §3 Dashboard) | Cookie wall không có nút Reject; dark pattern ở trang huỷ gói (RS·F-11 · F-02) |
| Nền funnel tách khỏi site để tập trung | Loader "đang phân tích" kéo dài giả (RS·F-16); bẫy back ở offer (RS·F-19) |

## 6. Chuyển giao → FND-tokens

| Mục (§2–§4) | Token ở FND-tokens |
|---|---|
| Nền giấy kem / thẻ giấy sáng / nền phụ | `color.bg` · `color.surface` · `color.surface-muted` |
| Mực xanh-đen / chữ phụ / viền | `color.text` · `color.text-muted` · `color.border` · `color.border-input` |
| Xanh mực bút máy (hành động, link) | `color.accent` · `color.accent-hover` · `color.accent-contrast` |
| Vàng dạ quang (tô chữ) | `color.highlight` |
| Khối hỗ trợ bài nhạy cảm | `color.sensitive-bg` |
| Thanh điểm một sắc | `color.bar` · `color.bar-strong` |
| Palette nhiều chuỗi (hiếm) | `color.chart-1` … `color.chart-8` |
| Serif biên tập / sans dễ đọc / nhãn đánh máy | `font.display` · `font.body` · `font.label` · `type.*` |
| Khoảng thở, bo góc phiếu, độ nhấc | `space.*` · `radius.*` · `shadow.card` |
| Thẻ trượt vào ngăn, chuyển câu hỏi | `motion.*` · `easing.standard` |
| Vòng focus | `focus.ring` · `color.focus` |

## 7. AI Notices
- Hướng thẩm mỹ do AI chọn (không có designer/Figma) và đã chốt ở Q-17 (human uỷ quyền 2026-09-28). Đổi hướng sau này thì chỉ sửa FND-tokens (tăng version); các SCR cite token theo tên nên không phải sửa.
