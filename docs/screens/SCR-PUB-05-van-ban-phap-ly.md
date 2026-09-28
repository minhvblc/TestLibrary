# [SCR-PUB-05] Văn bản pháp lý
**Meta**

| id | module | doc level | platforms | route | access | indexable | viewports | related FLOW | status | design | tracking | api | Evidence / visual basis |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| SCR-PUB-05 | PUB | Short | Web | `/legal/:doc` (`privacy` · `terms` · `subscriptions` · `cookies`) | public | index | 390 · 768 · 1280 | FLOW-quyen-rieng-tu | Draft | (sau design) | `tracking-events.md` → `legal` | không có — nội dung tĩnh (§5) | **EV-TLW-040 · EV-TLW-041 · EV-TLW-043 · EV-TLW-049 · SC-TLW-06 · basis RS·F-12 · F-29 · Q-05** |

**Changelog** (mới nhất trước)
- 2026-09-28 · v1.1 · claude-opus-5-5 · AI Notice cũ: email báo thay đổi điều khoản đã có (API-MAIL-09).
- 2026-09-27 · v1 · claude (subagent) · khởi tạo từ blueprint.

## 1. Purpose

Một template cho bốn văn bản: `privacy` · `terms` · `subscriptions` (gia hạn + hoàn tiền) · `cookies`. Văn bản nào cũng có ngày cập nhật, version, và ghi rõ pháp nhân bán, địa chỉ, email hỗ trợ. Đối thủ để pháp nhân lệch nhau giữa trang Contact và văn bản, người bán chỉ được báo sau khi mua (RS·F-12); văn bản còn mâu thuẫn với marketing về trial và hoàn tiền (RS·F-29). `doc=subscriptions` là đích của mọi link "Subscription & refund terms" / "Refund policy" trên bề mặt tiền, nên nội dung phải khớp GC-RenewalDisclosure (BR-APP-02). · basis RS·F-12 · F-29 · Q-05 · Q-18

## 2. Điều hướng

### 2.1 Vào

| Vào qua | Từ | Trigger |
|---|---|---|
| NAV-PUB-04-4 | SCR-PUB-04 | "Subscription & refund terms" (`doc=subscriptions`) |
| NAV-PUB-06-2 | SCR-PUB-06 | "Refund policy" (`doc=subscriptions`) |
| NAV-PUB-07-1 | SCR-PUB-07 | "Cookie policy" (`doc=cookies`) |
| NAV-TEST-01-7 | SCR-TEST-01 | "Privacy policy" (`doc=privacy`, bước consent bài `sensitive`) |
| NAV-PAY-01-4 | SCR-PAY-01 | "Subscription & refund terms" (`doc=subscriptions`) |
| NAV-AUTH-01-4 | SCR-AUTH-01 | "Terms" (`doc=terms`) |
| NAV-AUTH-01-5 | SCR-AUTH-01 | "Privacy" (`doc=privacy`) |
| NAV-ACC-02-4 | SCR-ACC-02 | "Subscriptions & refunds" (`doc=subscriptions`) |
| footer | mọi trang: "Privacy" · "Terms" · "Subscriptions & refunds" · "Cookie policy" | SYS-NAV §1 |
| entry ngoài | URL trực tiếp · SEO | SYS-NAV §4 |

### 2.2 Ra

| NAV-ID | Tới (SCR-ID · tham số) | Trigger (CMP-ID "nhãn") | Kiểu | URL / history | Animation | Back / đóng → | Guard / điều kiện | Nền tảng | Basis |
|---|---|---|---|---|---|---|---|---|---|
| NAV-PUB-05-1 | SCR-PUB-07 | CMP-04 "Cookie settings" (trong doc `cookies`) | push | `/cookie-settings` (push) | mặc định | back trình duyệt → SCR-PUB-05 | chỉ hiện ở doc `cookies` | Web | SYS-CONSENT |

## 3. Layout & components

- **Bố cục @390 (top→bottom):**
  - header;
  - H1 + dòng "Last updated · Version";
  - mục lục thu gọn dưới nút "Contents";
  - nội dung văn bản;
  - khối pháp nhân;
  - footer.

| CMP-ID | Component | Type / GC- | Behavior & rules | Basis (EV / Q / in-house) |
|---|---|---|---|---|
| CMP-01 | Header | GC-SiteHeader (public) | theo GC | SYS-NAV §1 |
| CMP-02 | Tiêu đề + phiên bản | H1 + dòng meta | H1 theo `doc`: "Privacy policy" · "Terms of service" · "Subscriptions & refunds" · "Cookie policy"; dòng "Last updated: [date] · Version [n]" (ngày dạng "October 12, 2026", tieu-chuan-chung §4) | BR-PUB-11 · EV-TLW-041 |
| CMP-03 | Mục lục | danh sách link anchor | liệt kê heading cấp 2 của văn bản; bấm → cuộn tới `#<mục>` trong cùng trang (đổi hash, không đổi route); @390 thu gọn dưới nút "Contents" | in-house |
| CMP-04 | Nội dung | văn bản tĩnh (build-time) | theo `doc`. `privacy`: dữ liệu nào rời trình duyệt, đi đâu, lưu bao lâu — khớp cong-nghe-loi §4. `subscriptions`: tự gia hạn, chu kỳ, ngày thu, email nhắc (Q-16), huỷ một bước và dùng tới hết kỳ (BR-APP-04), hoàn tiền (Q-18). `cookies`: danh mục necessary · analytics · marketing khớp SYS-CONSENT + link "Cookie settings" (NAV-PUB-05-1). `terms`: điều khoản dùng dịch vụ, nêu rõ bài test là công cụ tự nhìn lại, không phải chẩn đoán (Q-06) | cong-nghe-loi §4 · BR-APP-02 · BR-APP-04 · SYS-CONSENT |
| CMP-05 | Khối pháp nhân | khối địa chỉ | tên pháp nhân bán + địa chỉ đăng ký + email hỗ trợ "support@[domain]" (link `mailto:`); chỉ một pháp nhân, trùng với dòng người bán ở trang mở khoá và ở footer | Q-05 · Q-01 · RS·F-12 (EV-TLW-049 · EV-TLW-043) |
| CMP-06 | Footer | GC-SiteFooter | theo GC; link của văn bản đang mở có `aria-current="page"` | SYS-NAV §1 |

## 4. States

| State | Trigger | Hiển thị | EV / basis |
|---|---|---|---|
| Default | `doc` hợp lệ | đủ CMP-01…06 theo `doc` | EV-TLW-040 |
| Loading | lần tải đầu là SSR/tĩnh nên không có loading; điều hướng client giữa hai văn bản ≥ 300 ms | skeleton tiêu đề + 3 đoạn | tieu-chuan-chung §3 |
| Empty | N/A — mọi `doc` hợp lệ đều có nội dung; `doc` lạ → 404 (xem Error) | — | in-house |
| Error | `doc` không thuộc 4 giá trị → 404; mất mạng khi điều hướng client | 404: "We couldn't find that page." + link "Browse all tests" · mất mạng: "You're offline. Check your connection and try again." | tieu-chuan-chung §2 · §8 |
| Locked | N/A — trang public | — | 00-overview §3 |

## 5. API

Không có API. Bốn văn bản là file tĩnh trong repo web, render lúc build (cách render public route theo Q-09). Đổi nội dung = sửa file + tăng "Version" + deploy (BR-PUB-11).

## 6. Tracking

| Event | Note |
|---|---|
| `screen_active` · `legal` | sau consent; không có param riêng cho `doc` (tracking-events không định nghĩa) |

## 7. Business rules & edge cases

| BR-ID | Rule | Basis |
|---|---|---|
| BR-PUB-11 | Mỗi văn bản có ngày cập nhật + version; thay đổi trọng yếu với subscriber gửi email trước ít nhất 30 ngày (Q-05) | Q-05 · đối thủ ghi mốc báo trước không đồng nhất giữa các văn bản (legal-extract §9 · EV-TLW-041 · EV-TLW-043) |

| EC-xx | Tình huống | Handling | Basis |
|---|---|---|---|
| EC-01 | `doc` lạ (vd `/legal/refund`) | 404 có nội dung + link "Browse all tests" | tieu-chuan-chung §8 |
| EC-02 | Vào từ bước consent của bài `sensitive` (NAV-TEST-01-7) | `/legal/privacy` là route thường (có analytics nếu đã consent), nhưng `AppTracking` không gửi URL / referrer của trang trước vì route làm bài chứa slug bài `sensitive` | BR-APP-05 · BR-APP-06 |
| EC-03 | Mở link có hash (vd `/legal/subscriptions#refunds`) | cuộn tới mục và focus heading của mục đó | in-house |
| EC-04 | JavaScript tắt | đọc đủ văn bản; mục lục là anchor thường; @390 mục lục mở sẵn | cong-nghe-loi §3 |

## 8. Responsive deltas

| Aspect | 390 (gốc) | 768 | 1280 |
|---|---|---|---|
| Mục lục | thu gọn dưới nút "Contents" đầu văn bản | như 390 | cột trái, dính khi cuộn |
| Nội dung | full width, padding 16 | rộng tối đa 720, căn giữa | rộng tối đa 720, nằm cạnh mục lục |
| Khối pháp nhân | cuối văn bản | cuối văn bản | cuối văn bản |

## 9. Keyboard & focus

Bấm một mục trong mục lục thì focus chuyển tới heading đích (`tabindex="-1"`), không chỉ cuộn. Nút "Contents" @390 có `aria-expanded`. Còn lại theo `tieu-chuan-chung §5`.

## 10. AI Notices
- Nội dung văn bản do legal soạn (Q-05 · Q-16 · Q-18 còn mở). File này chỉ quy định khung, meta và những chỗ bắt buộc phải khớp (cong-nghe-loi §4, SYS-CONSENT, GC-RenewalDisclosure).
- Tên pháp nhân, địa chỉ và domain email chưa có (Q-01 · Q-05); CMP-05 dùng placeholder tới khi chốt.
- BR-PUB-11: email "thay đổi điều khoản" đã có ở `api-mapping §2` (API-MAIL-09); job gửi, copy và link chưa đặc tả (FLOW-quan-ly-huy-gia-han §6).
- Mục lục nhảy anchor là thay đổi tại chỗ, chưa có cạnh inline riêng.
