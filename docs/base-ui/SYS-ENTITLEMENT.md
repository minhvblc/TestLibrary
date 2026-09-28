# SYS-ENTITLEMENT — ai được đọc gì
**Changelog** (mới nhất trước)
- 2026-09-28 · v1.2 · claude-opus-5-5 · Q-18 · Q-25: rút trong 14 ngày (API-PAY-08) thu hồi `report.full` / `plus` của khoản đó NGAY, không chờ webhook; hoàn tiền do hỗ trợ tạo trên Paddle → mất quyền khi webhook refund về; Q-18 hết là đề xuất; huỷ cả không cần đăng nhập (API-PAY-09); ân hạn khi gia hạn thất bại theo cấu hình Paddle (Q-04); `checkin` cần consent (Q-22). Thêm rule thu hồi theo từng giao dịch (mua trùng tự hoàn không mất quyền của lần mua đầu — SCR-PAY-01 EC-08).
- 2026-09-28 · v1.1 · claude-opus-5-5 · D-08: thêm job đối soát hết kỳ API-JOB-07; liệt kê đủ điều kiện mất quyền (xoá kết quả, xoá tài khoản, hoàn tiền — hoàn tiền theo Q-18).
- 2026-09-27 · v1 · claude-opus-5-5 · theo Q-02 (freemium minh bạch, human chốt).

## 1. Mục đích

Quyết định ở MỘT nơi (server) ai được xem kết quả tóm tắt, report đầy đủ, PDF, thử thách 30 ngày. Client chỉ hiển thị theo `entitlements` server trả về (BR-APP-01).

## 2. State / rule xuyên màn

| Quyền | Có khi | Mất khi | Màn thể hiện |
|---|---|---|---|
| `result.summary` | là chủ kết quả (token khách hoặc tài khoản) | kết quả khách hết hạn 30 ngày (BR-APP-08) · user xoá kết quả (API-RES-03 · BR-REP-07) · xoá cứng tài khoản (BR-ACC-05) | SCR-TEST-02 |
| `report.full:<resultId>` | đã mua `report.single` cho kết quả đó **hoặc** đang có Plus | mua lẻ: không hết hạn theo thời gian; chỉ mất khi user xoá kết quả đó (BR-REP-07), khi tài khoản bị xoá cứng (BR-ACC-05), khi user rút khoản mua đó trong 14 ngày (API-PAY-08: mất NGAY khi server nhận yêu cầu, không chờ webhook — BR-APP-14), hoặc khi giao dịch đó được hoàn tiền do hỗ trợ tạo trên Paddle (mất khi event refund của API-HOOK-01 về). Đang có Plus thì vẫn đọc được nhờ Plus. Plus: như `plus` | SCR-APP-03 (Locked nếu thiếu) |
| `report.pdf:<resultId>` | như `report.full` | như trên | SCR-APP-03 |
| `plus` | subscription `active` hoặc `canceled` nhưng còn trong kỳ đã trả | hết kỳ sau khi huỷ (trong tài khoản hoặc không cần đăng nhập) · thanh toán gia hạn thất bại quá thời gian ân hạn (cấu hình Paddle) · user rút khoản thanh toán của kỳ đang dùng trong 14 ngày — lần thanh toán đầu hoặc gia hạn năm (API-PAY-08: mất NGAY, gói kết thúc, không gia hạn — BR-APP-14) · hoàn tiền toàn phần kỳ đang dùng do hỗ trợ tạo trên Paddle (mất khi event refund về) · xoá cứng tài khoản | SCR-APP-01 (thử thách) · SCR-PAY-03 · SCR-PAY-05 |
| `challenge` | `plus` | như `plus` | SCR-APP-01 |
| `checkin` | mọi tài khoản (cả Free), sau khi user bật check-in và đồng ý (consent tường minh — Q-22 · BR-DASH-05) | tắt check-in = rút consent, xoá lịch sử (BR-ACC-07) · xoá tài khoản | SCR-APP-01 · SCR-ACC-01 |

| Rule | Mô tả | Basis |
|---|---|---|
| Nguồn sự thật | bảng `entitlements` ở server. **Cấp** quyền chỉ từ webhook đã verify (API-HOOK-01). **Thu hồi** từ webhook, từ job đối soát API-JOB-07 (mỗi giờ, quyền đã quá `accessEndsAt` mà webhook kết thúc chưa về) hoặc từ API-PAY-08 (rút). Job và API-PAY-08 không bao giờ cấp quyền | BR-APP-01 · api-mapping §2 · 00-quy-uoc-api §6 |
| Huỷ | huỷ Plus = `cancel_at_period_end`, trong tài khoản (API-PAY-05) hoặc không cần đăng nhập (API-PAY-09); quyền còn tới `current_period_end`; không hoàn tiền | BR-APP-04 · Q-18 (a) |
| Rút trong 14 ngày | API-PAY-08 thu hồi quyền của khoản đó ngay khi server nhận yêu cầu, rồi mới gọi Paddle hoàn toàn bộ; event refund / adjustment về sau chỉ xác nhận. Report lẻ: mất `report.full` / `report.pdf` của kết quả đó (vẫn đọc được nếu đang có Plus). Plus: mất `plus`, `challenge` và report có nhờ Plus; gói kết thúc ngay trên Paddle. Report mua lẻ khác và tóm tắt free giữ nguyên | BR-APP-14 · Q-18 (b) · Q-25 · 00-quy-uoc-api §6 |
| Hoàn tiền do hỗ trợ | tạo trên Paddle (lỗi phía mình, luật nơi khách sống cho nhiều hơn — Q-18 (c)); quyền của giao dịch đó mất khi webhook refund về | Q-18 · API-HOOK-01 |
| Thu hồi theo từng giao dịch | mỗi quyền ghi kèm giao dịch (hoặc gói Plus) đã cấp nó. Hoàn / rút một giao dịch chỉ huỷ bản ghi quyền của giao dịch đó; quyền vẫn còn nếu còn giao dịch hợp lệ khác, hoặc Plus, cấp cùng quyền. Vd mua trùng `report.single` cho cùng `resultId` (SCR-PAY-01 EC-08): server tự hoàn lần trùng, webhook refund của lần trùng KHÔNG thu hồi `report.full:<resultId>` / `report.pdf:<resultId>` mà lần mua hợp lệ đầu tiên đã cấp | BR-APP-01 · Q-18 · SCR-PAY-01 EC-08 |
| Gia hạn thất bại | `past_due` giữ `plus` trong thời gian ân hạn theo cấu hình Paddle; hết ân hạn mà chưa thu được → mất `plus` | Q-04 · BR-PAY-13 |
| Mua lẻ khi đang có Plus | ẩn CTA mua lẻ (đã có quyền); không bán trùng | in-house |
| Trạng thái chờ | thanh toán xong nhưng webhook chưa về → quyền `pending` ở SCR-PAY-02 (không mở report) | cong-nghe-loi §3 |

## 3. Màn liên quan

SCR-TEST-02 · SCR-PAY-01 · SCR-PAY-02 · SCR-PAY-03 · SCR-PAY-04 · SCR-PAY-05 · SCR-APP-01 · SCR-APP-02 · SCR-APP-03 · SCR-ACC-01.

## 4. Basis

Q-02 (human) · Q-18 · Q-22 · Q-25 (AI · uỷ quyền 2026-09-28) · BR-APP-01 · BR-APP-04 · BR-APP-08 · BR-APP-14.

## 5. AI Notices
- Thời gian ân hạn khi gia hạn thất bại theo cấu hình Paddle (Q-04, đã chốt); con số điền khi mở tài khoản (`bang-quyet-dinh` §2 #3).
- Rút là đường duy nhất ngoài webhook được đổi bảng `entitlements`, và chỉ theo chiều thu hồi (00-quy-uoc-api §6).
