# [SCR-PUB-05] Văn bản pháp lý
**Meta**

| id | module | doc level | platforms | route | access | indexable | viewports | related FLOW | status | design | tracking | api | Evidence / visual basis |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| SCR-PUB-05 | PUB | Short | Web | `/legal/:doc` (`privacy` · `terms` · `subscriptions` · `cookies`) | public | index | 390 · 768 · 1280 | FLOW-quyen-rieng-tu | Draft | (sau design) | `tracking-events.md` → `legal` | không có — nội dung tĩnh (§5) | **EV-TLW-040 · EV-TLW-041 · EV-TLW-043 · EV-TLW-049 · SC-TLW-06 · basis RS·F-12 · F-29 · Q-04 · Q-05 · Q-18 · Q-27** |

**Changelog** (mới nhất trước)
- 2026-09-28 · v1.2 · claude-opus-5-5 · Q-27: BR-PUB-11 báo 28 ngày trước ngày áp dụng (cửa sổ 21–30), bỏ "ít nhất 30 ngày"; không tăng giá subscriber (khoá giá BR-APP-13, ngoại lệ phải có consent). CMP-04 ghi nội dung tối thiểu của `subscriptions` · `privacy` · `terms` · `cookies` theo Q-04 · Q-16 · Q-18 · Q-20 · Q-21 · Q-22 · Q-25 · Q-28; CMP-05 tách pháp nhân cung cấp dịch vụ với bên bán Paddle (Q-04 · Q-05); vào từ NAV-PAY-05-2; AI Notices theo các Q đã chốt.
- 2026-09-28 · v1.1 · claude-opus-5-5 · AI Notice cũ: email báo thay đổi điều khoản đã có (API-MAIL-09).
- 2026-09-27 · v1 · claude (subagent) · khởi tạo từ blueprint.

## 1. Purpose

Một template cho bốn văn bản: `privacy` · `terms` · `subscriptions` (gia hạn + hoàn tiền) · `cookies`. Văn bản nào cũng có ngày cập nhật, version, và ghi rõ pháp nhân cung cấp dịch vụ, địa chỉ đăng ký, email hỗ trợ; bên bán trên hoá đơn là Paddle (reseller, Merchant of Record — Q-04). Đối thủ để pháp nhân lệch nhau giữa trang Contact và văn bản, người bán chỉ được báo sau khi mua (RS·F-12); văn bản còn mâu thuẫn với marketing về trial và hoàn tiền (RS·F-29). `doc=subscriptions` là đích của mọi link "Subscription & refund terms" / "Refund policy" trên bề mặt tiền (kể cả trang huỷ / rút SCR-PAY-05), nên nội dung phải khớp GC-RenewalDisclosure (BR-APP-02) và quy tắc rút 14 ngày (BR-APP-14). · basis RS·F-12 · F-29 · Q-04 · Q-05 · Q-18 · Q-25 · Q-27 · legal-consent §4

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
| NAV-PAY-05-2 | SCR-PAY-05 | "Subscription & refund terms" (`doc=subscriptions`) |
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
| CMP-04 | Nội dung | văn bản tĩnh (build-time) | theo `doc`; nội dung tối thiểu = `legal-consent` §4. `privacy`: dữ liệu nào rời trình duyệt, đi đâu, lưu bao lâu — khớp cong-nghe-loi §4; bên xử lý: Paddle (MoR, thanh toán), Postmark (email giao dịch), Google Firebase Analytics (chỉ sau consent), AWS `eu-central-1` (Frankfurt: hosting + dữ liệu); GPC = từ chối analytics + marketing (Q-20); tuổi: 16+ mọi bài, 18+ bài `sensitive` (Q-21); check-in chỉ khi user đồng ý, tắt = xoá lịch sử (Q-22); quyền dữ liệu (BR-APP-11), khách: tự xoá kết quả, tải toàn bộ dữ liệu cần tài khoản miễn phí hoặc gửi "Privacy request" ở `/help` (Q-28 · BR-PUB-15); thời hạn lưu (Q-05 (e) (f)). `subscriptions`: giá + chu kỳ (00-overview §2); tự gia hạn; giá khoá cho subscriber (BR-APP-13); email nhắc 21 ngày trước kỳ năm, 7 ngày trước mỗi kỳ tháng (Q-16); huỷ một bước trong tài khoản hoặc không cần đăng nhập ở `/cancel`, dùng tới hết kỳ (BR-APP-04); rút trong 14 ngày = hoàn toàn bộ, không hỏi lý do (report lẻ · lần thanh toán đầu của Plus · mỗi lần gia hạn năm; kỳ gia hạn tháng không hoàn), chức năng "Withdraw from contract here" và email xác nhận có ngày giờ (BR-APP-14 · Q-25); tên trên sao kê (BR-APP-15); Paddle là reseller / Merchant of Record (câu reseller, Q-04); gia hạn thất bại; báo thay đổi 28 ngày trước (BR-PUB-11). `cookies`: danh mục necessary · analytics · marketing khớp SYS-CONSENT, GPC (Q-20) + link "Cookie settings" (NAV-PUB-05-1). `terms`: điều khoản dùng dịch vụ, nêu rõ bài test là công cụ tự nhìn lại, không phải chẩn đoán (Q-06); 16+ (Q-21); pháp nhân + luật áp dụng (Q-05 (c)); Paddle là reseller / MoR (Q-04) | legal-consent §4 · cong-nghe-loi §4 · BR-APP-02 · BR-APP-04 · BR-APP-13 · BR-APP-14 · BR-APP-15 · SYS-CONSENT |
| CMP-05 | Khối pháp nhân | khối địa chỉ | tên pháp nhân cung cấp dịch vụ + địa chỉ đăng ký + email hỗ trợ "support@[domain]" (link `mailto:`); chỉ một pháp nhân, cùng cấu hình `legalEntity` với `company-line` của footer (GC-SiteFooter). Bên bán trên hoá đơn là Paddle: văn bản nói bằng câu reseller, không thay tên pháp nhân | Q-05 · Q-01 · Q-04 · RS·F-12 (EV-TLW-049 · EV-TLW-043) |
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

Không có API. Bốn văn bản là file tĩnh trong repo web, render lúc build (SSG + revalidate, Q-09 đã chốt). Đổi nội dung = sửa file + tăng "Version" + deploy (BR-PUB-11).

## 6. Tracking

| Event | Note |
|---|---|
| `screen_active` · `legal` | sau consent; không có param riêng cho `doc` (tracking-events không định nghĩa) |

## 7. Business rules & edge cases

| BR-ID | Rule | Basis |
|---|---|---|
| BR-PUB-11 | Mỗi văn bản có ngày cập nhật + version. Thay đổi trọng yếu với subscriber đang active: gửi email (API-MAIL-09) 28 ngày trước ngày áp dụng (cửa sổ 21–30). Không dùng để tăng giá subscriber đang có: giá khoá theo BR-APP-13; ngoại lệ buộc tăng giá cũng báo 28 ngày trước và chỉ thu giá mới khi user bấm đồng ý, không đồng ý thì gói kết thúc cuối kỳ | Q-27 · Q-05 · BR-APP-13 · regulatory-landscape §2 (CA 7–30, NY 5–30, NYC 5 ngày làm việc–30) · đối thủ ghi mốc báo trước không đồng nhất giữa các văn bản (legal-extract §9 · EV-TLW-041 · EV-TLW-043) |

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
- Nội dung văn bản do legal soạn và review (`bang-quyet-dinh` §2 #2); các quyết định nền (Q-04 · Q-05 · Q-16 · Q-18 · Q-20 · Q-21 · Q-22 · Q-25 · Q-27 · Q-28) đã chốt 2026-09-28. File này chỉ quy định khung, meta, nội dung tối thiểu (CMP-04, theo `legal-consent` §4) và những chỗ bắt buộc phải khớp (cong-nghe-loi §4, SYS-CONSENT, GC-RenewalDisclosure, SCR-PAY-05).
- Q-01 · Q-05 đã chốt; tên pháp nhân, địa chỉ đăng ký và domain là dữ liệu setup (`bang-quyet-dinh` §2 #1 · #2). CMP-05 dùng placeholder tới khi có.
- BR-PUB-11: email báo thay đổi (API-MAIL-09, 28 ngày trước) đã có ở `api-mapping` §2; job gửi, copy và link tới văn bản mới chưa đặc tả (FLOW-quan-ly-huy-gia-han §6). Luồng ngoại lệ tăng giá (nút đồng ý) không có trong MVP.
- Câu reseller trong văn bản lấy đúng câu Paddle yêu cầu khi mở tài khoản (`bang-quyet-dinh` §2 #3).
- Mục lục nhảy anchor là thay đổi tại chỗ, chưa có cạnh inline riêng.
