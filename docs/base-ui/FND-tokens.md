# FND-tokens — foundation (FREEZE trước UI code)
> Nguồn định hướng định tính: `docs/overview/design-language.md` (bối cảnh "tủ phiếu thư mục thư viện"). Đây là nơi DUY NHẤT có hex / px / token.
> **Provenance token:** mọi giá trị do AI chọn (taste mode, không có Figma) và **đã chốt ở Q-17** (Group C, 2026-09-28, human uỷ quyền, không veto). Đổi giá trị = tăng version file này. Contrast tính theo WCAG 2.x; palette chart chạy validator của skill dataviz trên đúng surface của mình.
**Changelog** (mới nhất trước)
- 2026-09-28 · v1.1 · claude-opus-5-5 · Q-17 đã chốt 2026-09-28 (AI · uỷ quyền human): bộ token này là bản chốt; đổi = tăng version.
- 2026-09-27 · v1 · claude-opus-5-5 · bộ token đầu tiên; contrast đã tính, palette chart đã validate (light surface `#FFFCF5`, dark surface `#1B2030`).

## 1. Color (semantic, light + dark)

| Token | Light | Dark | Dùng cho | Contrast (AA?) | Basis |
|---|---|---|---|---|---|
| `color.bg` | `#F5EFE3` | `#12151D` | nền trang (giấy kem / phòng đọc ban đêm) | — | design-language §2 |
| `color.surface` | `#FFFCF5` | `#1B2030` | thẻ phiếu, panel, form | — | design-language §2 |
| `color.surface-muted` | `#ECE4D4` | `#242A3B` | khối phụ, chip nền, hàng xen kẽ | — | design-language §2 |
| `color.text` | `#1B2330` | `#F2EDE3` | chữ chính (mực xanh-đen) | 13.79 trên bg · 15.41 trên surface (light); 15.64 · 13.89 (dark) ✓ | tieu-chuan-chung §5 |
| `color.text-muted` | `#555C69` | `#A7AEBC` | chữ phụ, caption | 5.88 bg · 6.57 surface · 5.32 surface-muted (light); 8.19 · 7.27 · 6.41 (dark) ✓ | tieu-chuan-chung §5 |
| `color.border` | `#D9CFBC` | `#343B4F` | viền trang trí, hairline | 1.51 / 1.45 (trang trí, không mang nghĩa) | design-language §2 |
| `color.border-input` | `#8A806F` | `#6F7894` | viền ô nhập, checkbox, radio | 3.80 trên surface (light) · 3.70 (dark) ✓ (non-text ≥ 3:1) | WCAG 1.4.11 |
| `color.accent` | `#2446A8` | `#9DB4F5` | nút chính, link, thanh điểm mạnh (xanh mực bút máy) | 7.29 bg · 8.14 surface (light); 8.93 · 7.93 (dark) ✓ | design-language §2 |
| `color.accent-hover` | `#1B3785` | `#B8C9F8` | hover/active nút chính | chữ trắng 10.87 (light) ✓ | design-language §4 |
| `color.accent-contrast` | `#FFFFFF` | `#0F1630` | chữ trên nền accent | 8.34 (light) · 8.73 (dark) ✓ | tieu-chuan-chung §5 |
| `color.focus` | `#2446A8` | `#9DB4F5` | vòng focus (xem §5) | ≥ 7 trên bg/surface ✓ | tieu-chuan-chung §5 |
| `color.highlight` | `#F2C14E` | `#7A6224` | tô chữ kiểu bút dạ quang (hiếm) | chữ `color.text` trên highlight 9.41 (light); chữ `#F2EDE3` 5.00 (dark) ✓ | design-language §2 |
| `color.success` | `#1F7A4D` | `#6FCF97` | trạng thái thành công (kèm icon + chữ) | 4.64 bg · 5.19 surface (light); 9.60 bg (dark) ✓ | dataviz status rule |
| `color.warning` | `#8A5A00` | `#F2C14E` | chữ cảnh báo (kèm icon) | 5.18 bg (light); 10.87 (dark) ✓ | dataviz status rule |
| `color.warning-bg` | `#FFF1D6` | `#3A2E12` | nền banner cảnh báo | chữ warning 5.31 (light); 7.92 (dark) ✓ | tieu-chuan-chung §2 |
| `color.danger` | `#B3261E` | `#F08B84` | lỗi, hành động phá huỷ (xoá tài khoản) | 5.71 bg · 6.38 surface (light); 7.59 · 6.74 (dark) ✓; chữ trắng trên danger 6.54 (light) · chữ `#2A0F0D` trên danger 7.45 (dark) | SCR-ACC-02 |
| `color.info` | `#1F5E8C` | `#8CC3EE` | thông tin trung tính (banner offline) | 6.75 surface (light) · 8.61 (dark) ✓ | cong-nghe-loi §3 |
| `color.sensitive-bg` | `#E3ECE4` | `#1F2B26` | khối hỗ trợ bài nhạy cảm (sage dịu, không đỏ) | chữ `color.text` 13.07 (light) · 12.57 (dark) ✓ | GC-SensitiveNotice · Q-06 |
| `color.bar` | `#6E86D0` | `#5F77BF` | thanh điểm thường (một sắc) | 3.42 surface (light) · 3.76 (dark) ✓ (≥ 3:1) | GC-ScoreBars · dataviz (magnitude = một sắc) |
| `color.bar-strong` | `#2446A8` | `#9DB4F5` | thanh điểm của thang cao nhất | 8.14 · 7.93 ✓ | GC-ScoreBars |
| `color.scale-1` | `#8C5A2B` | `#D9A873` | chấm "Strongly disagree" (cực umber) | 5.67 · 7.56 ✓ | GC-ScaleInput · dataviz diverging |
| `color.scale-2` | `#A87C4F` | `#A9825A` | chấm "Disagree" | 3.62 · 4.65 ✓ | GC-ScaleInput |
| `color.scale-3` | `#8E877A` | `#6F7486` | chấm "Neutral" (xám trung tính ở giữa) | 3.48 · 3.49 ✓ | GC-ScaleInput · dataviz diverging |
| `color.scale-4` | `#6680C9` | `#6F86CC` | chấm "Agree" | 3.73 · 4.60 ✓ | GC-ScaleInput |
| `color.scale-5` | `#2446A8` | `#9DB4F5` | chấm "Strongly agree" (cực xanh mực) | 8.14 · 7.93 ✓ | GC-ScaleInput |
| `color.chart-1` | `#2a78d6` | `#3987e5` | chuỗi 1 (chỉ dùng khi ≥ 2 chuỗi cần phân biệt) | validator: PASS (xem ghi chú dưới bảng) | dataviz palette.md |
| `color.chart-2` | `#eb6834` | `#d95926` | chuỗi 2 | như trên | dataviz palette.md |
| `color.chart-3` | `#1baf7a` | `#199e70` | chuỗi 3 | light 2.75 < 3:1 → bắt buộc nhãn trực tiếp / bảng | dataviz palette.md |
| `color.chart-4` | `#eda100` | `#c98500` | chuỗi 4 | light 2.11 < 3:1 → như trên | dataviz palette.md |
| `color.chart-5` | `#e87ba4` | `#d55181` | chuỗi 5 | light 2.63 < 3:1 → như trên | dataviz palette.md |
| `color.chart-6` | `#008300` | `#008300` | chuỗi 6 | PASS | dataviz palette.md |
| `color.chart-7` | `#4a3aa7` | `#9085e9` | chuỗi 7 | PASS | dataviz palette.md |
| `color.chart-8` | `#e34948` | `#e66767` | chuỗi 8 | PASS | dataviz palette.md |

> **Validator dataviz (chạy 2026-09-27):**
> - **Light** (surface `#FFFCF5`): lightness band PASS · chroma PASS · CVD adjacent worst ΔE 9.1 PASS · normal-vision worst ΔE 19.6 PASS · contrast WARN cho slot 3, 4, 5 → **bắt buộc relief** (nhãn trực tiếp hoặc bảng).
> - **Dark** (surface `#1B2030`): mọi check PASS.
> - **Thứ tự slot cố định**, không xoay vòng. Chuỗi thứ 9 gộp vào "Other".
> - Thanh điểm (GC-ScoreBars) mặc định dùng `color.bar` / `color.bar-strong` (một sắc, vì việc cần thể hiện là độ lớn), KHÔNG dùng palette 8 màu.

## 2. Typography

> Font **tự host** (không gọi Google Fonts CDN), vì request font tới bên thứ ba trước consent sẽ làm lộ IP (BR-APP-05 · SYS-CONSENT). Cả ba font đều có license SIL OFL.

| Token | Font / size / weight / line-height | Dùng cho | Basis |
|---|---|---|---|
| `font.display` | "Newsreader" (variable, opsz 6–72, wght 200–800) · fallback `ui-serif, Georgia, serif` | tiêu đề, tên type kết quả, tiêu đề chương report, giá | design-language §2 |
| `font.body` | "Atkinson Hyperlegible Next" (variable, wght 200–800) · fallback `system-ui, -apple-system, "Segoe UI", sans-serif` | mọi chữ nội dung, câu hỏi, form | design-language §2 · tieu-chuan-chung §5 |
| `font.label` | "IBM Plex Mono" (400 · 500 · 600) · fallback `ui-monospace, SFMono-Regular, Menlo, monospace` | nhãn chip, meta, bộ đếm | design-language §2 |
| `type.h1` | display · 300 · 44/46 px @390 · 72/72 px @1280 · letter-spacing −0.02em | H1 trang | extremes: mảnh + rất lớn |
| `type.result` | display · 300 italic · 40/44 @390 · 64/66 @1280 | tên type ở kết quả/report | SCR-TEST-02 · SCR-APP-03 |
| `type.h2` | display · 600 · 28/32 @390 · 40/44 @1280 | tiêu đề section / chương | design-language §3 |
| `type.h3` | body · 700 · 20/26 | tiêu đề thẻ | — |
| `type.question` | body · 600 · 22/30 @390 · 26/34 @1280 | câu hỏi khi làm bài | SCR-TEST-01 |
| `type.body` | body · 400 · 17/26 | chữ nội dung | tieu-chuan-chung §5 |
| `type.body-sm` | body · 400 · 15/22 | chữ phụ | — |
| `type.caption` | body · 400 · 13/18 | chú thích, "Scored with version…" | — |
| `type.label` | label · 500 · 12/16 · UPPERCASE · letter-spacing 0.08em | chip "24 QUESTIONS · 6 MIN" | design-language §2 |
| `type.price` | display · 700 · 40/44 · lining + tabular numerals | giá ở thẻ gói | SCR-PUB-04 · SCR-PAY-01 |

Độ rộng dòng chữ đọc: 60–75 ký tự (`layout.reading-width`).

## 3. Spacing / radius / elevation

| Token | Value | Basis |
|---|---|---|
| `space.1` … `space.12` | 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 · 80 · 96 px | bậc 4 px; section cách nhau `space.10`–`space.12` (khoảng thở kiểu trang sách) |
| `radius.sm` | 4 px | chip, checkbox (góc phiếu thư mục) |
| `radius.md` | 8 px | nút, ô nhập, thẻ nhỏ |
| `radius.lg` | 16 px | thẻ lớn, panel, khối funnel |
| `radius.pill` | 999 px | nhãn trạng thái, toggle |
| `shadow.card` | `0 1px 0 rgba(27,35,48,0.06), 0 8px 24px rgba(27,35,48,0.06)` | phiếu giấy nhấc khỏi bàn |
| `shadow.card-hover` | `0 2px 0 rgba(27,35,48,0.08), 0 14px 32px rgba(27,35,48,0.10)` | hover thẻ ("rút khỏi ngăn") |
| `shadow.overlay` | `0 16px 48px rgba(27,35,48,0.18)` | drawer, toast, banner consent |
| `texture.paper` | hạt giấy SVG inline, opacity 0.03 trên `color.bg`; tắt khi `forced-colors` | backgrounds tạo không khí (visual-taste) |

## 4. Breakpoints & layout

| Token | Value | Basis |
|---|---|---|
| `bp.sm` | 390 px (gốc) | tieu-chuan-chung §6 |
| `bp.md` | 768 px | tieu-chuan-chung §6 |
| `bp.lg` | 1280 px | tieu-chuan-chung §6 |
| `layout.max-width` | 1120 px | tieu-chuan-chung §6 |
| `layout.reading-width` | 680 px | cột chữ report / văn bản pháp lý |
| `layout.gutter` | 16 px @390 · 24 px @768 · 32 px @1280 | tieu-chuan-chung §6 |
| `layout.touch-target` | tối thiểu 44 × 44 px | tieu-chuan-chung §5 |

## 5. Focus ring · motion · iconography

| Token | Value | Basis |
|---|---|---|
| `focus.ring` | khe 2 px `color.bg` + viền 2 px `color.focus` (outline-offset 2 px); luôn hiện với `:focus-visible` | tieu-chuan-chung §5 |
| `motion.fast` | 120 ms | hover, đổi trạng thái nút |
| `motion.base` | 200 ms | chuyển câu hỏi (fade), mở mục lục |
| `motion.slow` | 320 ms | entrance duy nhất ở landing: thẻ phiếu trượt lên theo nhịp 40 ms/thẻ |
| `easing.standard` | `cubic-bezier(0.2, 0, 0, 1)` | — |
| Reduced motion | `prefers-reduced-motion: reduce` → mọi motion = 0 ms, bỏ entrance, bỏ fade chuyển câu | tieu-chuan-chung §5 · SYS-NAV §2 |
| Icon | bộ icon nét (stroke 1.5 px, đầu tròn), SVG tự host; icon luôn đi kèm chữ ở trạng thái (success / warning / danger) | dataviz status rule |

## 6. AI Notices
- Toàn bộ giá trị ở đây đã chốt ở Q-17 (2026-09-28). FND-FREEZE còn cần đo lại contrast trên UI thật; designer có thể thay bằng một version mới.
- Hai font Newsreader và Atkinson Hyperlegible Next cần kiểm tra lại bản variable + subset Latin khi build để giữ ngân sách perf (tieu-chuan-chung §9).
