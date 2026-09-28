# GC-RenewalDisclosure — công bố gia hạn dùng chung cho mọi bề mặt tiền và email
**Changelog** (mới nhất trước)
- 2026-09-28 · v1.1 · claude-opus-5-5 · `reminderDays` = 7 (tháng) / 21 (năm) theo Q-16, bỏ 3 / 7 cũ; variant `email` thêm câu tên trên sao kê (Q-24) để đủ nội dung nhắc hằng năm; giá thật cite 00-overview §2 (Q-03); gỡ notice thuế (Q-04: giá chưa gồm thuế) và notice Q-16 đang mở.
- 2026-09-27 · v1 · claude (subagent) · khởi tạo.

## 1. Anatomy (CMP con)

Một khối chữ nói rõ: giá, chu kỳ, việc tự gia hạn, ngày thu kế tiếp, cách huỷ và email nhắc. Đây là component duy nhất mà BR-APP-02 chỉ định. Mọi bề mặt tiền dùng đúng câu chữ ở §2, không viết lại.

| CMP con | Thành phần | Ghi chú |
|---|---|---|
| `status` | nhãn trạng thái `radius.pill`, chỉ variant `billing` | "Active" · "Cancels on [date]" · "Free" (cùng nhãn với SCR-PAY-03 CMP-03) |
| `terms` | 1–4 câu, `type.body`, màu `color.text` | không dùng `type.caption`, không dùng màu nhạt, không in nghiêng |
| `next-charge` | dòng số tiền + ngày | thiếu số liệu thì ẩn cả dòng; màn đã có dòng "Next charge" riêng thì tắt bằng `showNextCharge` |
| `cancel-how` | câu chỉ đường huỷ | trên web là chữ chỉ dẫn, không phải link (xem §4) |
| `reminder` | câu về email nhắc | `[n]` lấy từ `renewalReminderDays` (API-PAY-01; `post-purchase`: API-PAY-03): 7 với gói tháng, 21 với gói năm (Q-16) |

Placeholder trong copy: `[price]` / `[amount]` = số tiền định dạng Intl en-US + currency của planKey; `[period]` = "month" hoặc "year"; `[date]` = kiểu "October 12, 2026" theo timezone tài khoản (khách: timezone trình duyệt); `[n]` = số ngày nhắc trước (7 với gói tháng, 21 với gói năm — Q-16); `[descriptor]` = chuỗi trên sao kê (`statementDescriptor`, Q-24). Giá hiện hành ở 00-overview §2 (Plus: $12.99 per month · $69.99 per year — Q-03); copy luôn điền số từ API.

## 2. Props / variants

Copy dưới đây là verbatim (en-US). Số thứ tự chỉ để đếm câu, không hiển thị.

| Variant | Khi dùng | Copy verbatim (en-US) |
|---|---|---|
| `pre-purchase` · Plus | SCR-PUB-04 (trong thẻ Plus) · SCR-PAY-01 (khi chọn Plus); luôn nằm ngay trên checkbox consent | 1 "Plus renews automatically at [price] per [period] until you cancel." · 2 "If you subscribe today, your next payment will be on [date]." · 3 "Cancel anytime in Account → Plan & billing. You'll keep Plus until the end of the period you've paid for." · 4 "We'll email you a reminder [n] days before each renewal." |
| `pre-purchase` · một lần | SCR-PAY-01 khi chọn "This report" (nếu màn muốn hiện) | "One-time payment. No subscription — nothing renews." |
| `post-purchase` | SCR-PAY-02 ở trạng thái paid, khi mua Plus (`[n]` = `renewalReminderDays` của API-PAY-03: 7 / 21) | 1 "Plus renews automatically every [period]." · 2 "Next charge: [amount] on [date]." · 3 "We'll email you a reminder [n] days before." · 4 "Cancel anytime in Account → Plan & billing. You'll keep Plus until the end of the period you've paid for." |
| `billing` · Active | SCR-PAY-03 CMP-03 khi Plus đang tự gia hạn · SCR-PAY-04 CMP-03 (lần thu này sẽ dừng nếu huỷ) | nhãn "Active" · "Next charge: [amount] on [date]." · "Plus renews automatically every [period] until you cancel." |
| `billing` · Cancels on | SCR-PAY-03 CMP-03 khi đã lên lịch huỷ, còn trong kỳ | nhãn "Cancels on [date]" · "No upcoming charges" · "You'll keep Plus until [date]. After that, you won't be charged again." |
| `billing` · Free | SCR-PAY-03 CMP-03 khi không có gói trả phí | nhãn "Free" · "No upcoming charges" |
| `email` · nhắc gia hạn | API-MAIL-03, gửi 21 ngày trước kỳ năm và 7 ngày trước mỗi kỳ tháng (Q-16); đủ nội dung nhắc hằng năm: tên gói, chu kỳ, số tiền, ngày thu, tên trên sao kê, cách huỷ | tiêu đề "Your Plus plan renews on [date]" · 1 "Your Plus plan renews automatically on [date]." · 2 "We'll charge [amount] for another [period]." · 3 "Charges will appear as [descriptor] on your statement." · 4 "Don't want to renew? Cancel renewal — you'll keep Plus until [date]." (link "Cancel renewal" → `/account/billing/cancel`, SCR-PAY-04) · 5 link "Manage your plan" → `/account/billing` (SCR-PAY-03) |

| Prop | Kiểu | Mặc định | Ý nghĩa |
|---|---|---|---|
| `variant` | `pre-purchase` · `post-purchase` · `billing` · `email` | bắt buộc | |
| `planKey` | `report.single` · `plan.plus.monthly` · `plan.plus.annual` | bắt buộc | quyết định câu một lần hay câu gia hạn, và giá trị `[period]` |
| `price` | `{ amount, currency }` | bắt buộc | `pre-purchase`: `plans[].renewalPrice` của API-PAY-01 · `post-purchase`: API-PAY-03 · `billing`: API-PAY-04 |
| `nextChargeDate` | ISO-8601 hoặc null | null | `post-purchase` / `billing`: ngày của provider qua API-PAY-03 / API-PAY-04; `pre-purchase`: hôm nay + 1 kỳ, tính lúc render theo timezone của người xem; null → ẩn dòng có ngày |
| `showNextCharge` | boolean | true | false khi màn đã có dòng "Next charge" riêng (SCR-PAY-02 CMP-03) |
| `subscriptionStatus` | `active` · `canceled` · `past_due` · `none` | `none` | chỉ `billing`; `canceled` = đã lên lịch huỷ, còn trong kỳ |
| `periodEnd` | ISO-8601 hoặc null | null | ngày hết quyền khi đã huỷ (dùng cho "Cancels on [date]") |
| `reminderDays` | integer | theo `renewalReminderDays` của API-PAY-01 (`month` · `year`); `post-purchase` theo API-PAY-03 | 7 với gói tháng, 21 với gói năm (Q-16) |
| `id` | string | tự sinh | để checkbox consent của màn trỏ `aria-describedby` vào |

## 3. States (5) + hover / focus / disabled

| State | Khi nào | Hiển thị / hành vi | Basis |
|---|---|---|---|
| Default | đủ số liệu | câu theo variant | BR-APP-02 |
| Loading | giá / ngày đang tải | skeleton đúng số dòng; màn phải disable checkbox consent + nút mua (không cho đồng ý một câu còn thiếu số) | BR-PUB-10 · BR-PAY-02 |
| Empty | không có khoản tự gia hạn để công bố: `billing` với Free · `pre-purchase` với `report.single` | Free: "No upcoming charges"; mua một lần: "One-time payment. No subscription — nothing renews." (đối thủ gắn câu huỷ subscription cho cả gói One Time) | RS·F-09 · EV-TLW-037 |
| Error | thiếu giá hoặc ngày | KHÔNG render câu có chỗ trống. `pre-purchase`: ẩn disclosure và khoá mua, màn hiện "We couldn't load prices. Please refresh."; `post-purchase` / `billing` thiếu ngày: ẩn dòng `next-charge`, giữ các câu còn lại | BR-APP-02 |
| Locked | N/A — thông tin gia hạn không bao giờ bị khoá; khách, Free, Plus đều thấy như nhau | — | BR-APP-02 |
| hover | N/A — trên web GC chỉ có chữ, không có phần tử tương tác | — | in-house |
| focus | N/A trên web — không có phần tử focus được; screen reader đọc khối này qua `aria-describedby` khi focus vào checkbox consent | — | tieu-chuan-chung §5 |
| disabled | N/A — không có control | — | in-house |

## 4. Behavior & rules (BR nếu có)

GC hiện thực BR-APP-02 và BR-APP-03; không có BR riêng.

| Rule | Mô tả | Basis |
|---|---|---|
| Một nguồn câu chữ | trang giá, trang mở khoá, xác nhận thanh toán, gói & thanh toán, trang huỷ và email đều dùng câu ở §2 | BR-APP-02 |
| Nguồn số | `[price]` / `[amount]` / ngày của provider lấy từ server (API-PAY-01 · API-PAY-03 · API-PAY-04); ngoại lệ duy nhất là ngày ở câu 2 của `pre-purchase` (hôm nay + 1 kỳ, chỉ để báo trước) — sau khi mua, ngày của provider ở `post-purchase` là ngày đúng | BR-APP-01 · BR-PUB-07 · BR-PAY-01 · BR-PAY-09 · BR-PAY-11 |
| Khớp câu consent | câu consent của màn lấy từ `consent.template` của API-PAY-01 ("I understand Plus renews automatically at [price] per [period] until I cancel. I can cancel anytime in Account → Plan & billing.") và điền từ CÙNG object giá với disclosure; checkbox trỏ `aria-describedby` tới `id` của disclosure | BR-APP-03 · BR-PUB-10 · BR-PAY-02 |
| Đổi gói / chu kỳ | đổi "Monthly" ↔ "Annual" hoặc đổi gói thì disclosure cập nhật ngay; nếu checkbox đã tick thì màn phải bỏ tick | BR-APP-03 |
| Version | đổi câu chữ disclosure hoặc câu consent → tăng `consent.version` gửi trong API-PAY-02; server trả 422 `consent_outdated` thì màn tải lại API-PAY-01, bỏ tick và hiện "Prices or renewal terms have changed. Please review and tick the box again." | BR-APP-03 · 00-quy-uoc-api §6 |
| Hiện rõ, không phải chữ nhỏ | luôn hiện đủ, không accordion, tooltip hay "Read more"; `type.body` + `color.text`; đặt NGAY sau giá và TRƯỚC checkbox / nút mua, không đặt dưới nút | BR-APP-02 · tieu-chuan-chung §4 · RS·F-17 · F-18 |
| Không link trong GC (web) | "Account → Plan & billing" là chữ chỉ đường; màn tự đặt nút / link của mình, để không sinh cạnh điều hướng chưa khai ở SCR §2.2. Riêng email thì có link (API-MAIL-03 → SCR-PAY-04 và SCR-PAY-03) | SYS-NAV §2 · api-mapping §2 |
| Huỷ đúng như BR | câu huỷ khớp BR-APP-04: một bước, giữ quyền tới hết kỳ đã trả (khác đối thủ: "take effect immediately") | BR-APP-04 · Q-18 · RS·F-11 |
| Email nhắc | `[n]` = 7 ngày với gói tháng, 21 ngày với gói năm (Q-16); job API-JOB-01 gửi API-MAIL-03 qua Postmark; email có tên gói, chu kỳ, số tiền, ngày thu, tên trên sao kê và link huỷ (variant `email`); vào từ email khi chưa đăng nhập thì đăng nhập bằng magic link rồi quay lại đúng trang | BR-APP-03 · Q-16 · Q-24 · API-JOB-01 · BR-PAY-16 |
| `past_due` | gia hạn thất bại, còn thời gian ân hạn: nhãn vẫn "Active", ẩn `next-charge` (lịch thu lại tuỳ provider); banner CMP-08 của SCR-PAY-03 giải thích | BR-PAY-13 · Q-04 |
| Định dạng | tiền Intl en-US + currency của planKey; ngày kiểu "October 12, 2026" theo timezone tài khoản (khách: timezone trình duyệt) | tieu-chuan-chung §4 · BR-APP-09 · BR-APP-12 |
| Không marketing | không "Best value", "Save", giảm giá hay emoji bên trong disclosure | RS·F-18 |
| Dịch cùng UI | khi thêm locale, disclosure được dịch cùng lúc với UI (đối thủ để dòng gia hạn không dịch ở `/de/pricing`) | Q-14 · RS·F-07 · EV-TLW-028 |
| Tracking | GC không bắn event | tracking-events |

## 5. Dùng ở màn nào (SCR-IDs)

| Nơi dùng | Variant | CMP | Ghi chú |
|---|---|---|---|
| SCR-PUB-04 | `pre-purchase` · Plus | CMP-05 | trong thẻ Plus, dưới giá, trên checkbox CMP-06; đổi theo toggle "Monthly" / "Annual" |
| SCR-PAY-01 | `pre-purchase` · Plus | CMP-06 | chỉ khi chọn Plus; trên checkbox CMP-07 |
| SCR-PAY-02 | `post-purchase` với `showNextCharge = false` | CMP-03 | chỉ khi paid + Plus (BR-PAY-09); dòng "Next charge" đã có trong tóm tắt đơn |
| SCR-PAY-03 | `billing` (Active · Cancels on · Free) | CMP-03 | theo trạng thái subscription (BR-PAY-11) |
| SCR-PAY-04 | `billing` · Active | CMP-03 (gộp trong khối hệ quả) | cho thấy lần thu kế tiếp, là lần thu sẽ dừng nếu huỷ (BR-APP-02) |
| API-MAIL-03 | `email` | — | link "Cancel renewal" → SCR-PAY-04, "Manage your plan" → SCR-PAY-03 |
| API-MAIL-02 · API-MAIL-04 | `post-purchase` (biên nhận Plus) · `billing` · Cancels on (xác nhận huỷ) | — | BR-APP-02 ghi "và email"; xác nhận khi viết template email |

## 6. Responsive

| Aspect | 390 (gốc) | 768 (`bp.md`) | 1280 (`bp.lg`) |
|---|---|---|---|
| Bố cục | rộng hết khối chứa; câu tự xuống dòng, không cắt | như 390 | như 390, rộng theo thẻ / khối chứa |
| Cỡ chữ | `type.body` ở mọi viewport (không thu nhỏ trên mobile) | như 390 | như 390 |
| Email | một cột, chữ thường; bản plain-text có đủ mọi câu của variant và URL đầy đủ | như 390 | như 390 |

## 7. Basis (EV / Q)

| Quyết định | Basis |
|---|---|
| Một component cho mọi bề mặt tiền + email | BR-APP-02 |
| Disclosure ngay cạnh checkbox consent (đối thủ có 2 checkbox ở checkout từ pricing: giữ cách này; bỏ kiểu checkout funnel không có checkbox) | RS·F-08 · EV-TLW-033 · EV-TLW-034 · RS·F-18 · EV-TLW-112 · CS-10 |
| Trang mua phải có chữ về gia hạn (trang offer của đối thủ không có chữ nào) | RS·F-17 · EV-TLW-108 · EV-TLW-109 |
| Dòng gia hạn không được là chữ nhỏ (đối thủ để dòng gia hạn cùng cỡ chữ mô tả ngay dưới giá) | EV-TLW-024 · tieu-chuan-chung §4 |
| Email nhắc trước gia hạn (văn bản của đối thủ không nêu) | RS·F-29 · EV-TLW-041 · Q-16 |
| Trạng thái trong billing (đối thủ: Plan details ghi "Cancelled" nhưng vẫn dùng được) | EV-TLW-247 · RS·F-24 · CS-16 |
| Huỷ giữ quyền tới hết kỳ | BR-APP-04 · Q-18 · RS·F-11 · EV-TLW-046 |

## 8. AI Notices
- Viết bởi claude (subagent) ở Phase 4 từ spec blueprint + BR-APP-02 · BR-APP-03, rồi chỉnh cho khớp `docs/api/SCR-PUB-04-api.md` (`renewalPrice`, `consent`, `renewalReminderDays`) và CMP của SCR-PUB-04 · SCR-PAY-01 · SCR-PAY-02 · SCR-PAY-03 · SCR-PAY-04.
- Câu chữ do AI viết. Q-05 · Q-16 · Q-18 đã chốt (một bộ bảo vệ cho mọi khách) nhưng vẫn cần legal review trước launch (bang-quyet-dinh §2 #2). Mỗi lần đổi câu phải tăng `consent.version`.
- Ngày ở câu 2 của `pre-purchase` là ước tính phía client (hôm nay + 1 kỳ). Cuối tháng provider có thể lùi về ngày cuối của tháng sau, nên ngày đúng là ngày ở `post-purchase`. Nếu legal muốn tránh mọi sai lệch thì bỏ câu 2 hoặc để API-PAY-01 trả ngày.
- `[price]` là giá trước thuế (Q-03 · Q-04); "Taxes calculated at checkout." nằm trong câu reseller của màn (SCR-PUB-04 CMP-12 · SCR-PAY-01 CMP-10).
- `[descriptor]` ở variant `email` lấy từ giao dịch thử thật; verify khi mở tài khoản Paddle (bang-quyet-dinh §2 #3).
- Template email API-MAIL-02 / API-MAIL-04 chưa ghi là dùng GC này. Đây là gap so với BR-APP-02.
