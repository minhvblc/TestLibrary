# SYS-ENTITLEMENT — ai được đọc gì
**Changelog** (mới nhất trước)
- 2026-09-28 · v1.1 · claude-opus-5-5 · D-08: thêm job đối soát hết kỳ API-JOB-07; liệt kê đủ điều kiện mất quyền (xoá kết quả, xoá tài khoản, hoàn tiền — hoàn tiền theo Q-18).
- 2026-09-27 · v1 · claude-opus-5-5 · theo Q-02 (freemium minh bạch, human chốt).

## 1. Mục đích

Quyết định ở MỘT nơi (server) ai được xem kết quả tóm tắt, report đầy đủ, PDF, thử thách 30 ngày. Client chỉ hiển thị theo `entitlements` server trả về (BR-APP-01).

## 2. State / rule xuyên màn

| Quyền | Có khi | Mất khi | Màn thể hiện |
|---|---|---|---|
| `result.summary` | là chủ kết quả (token khách hoặc tài khoản) | kết quả khách hết hạn 30 ngày (BR-APP-08) · user xoá kết quả (API-RES-03 · BR-REP-07) · xoá cứng tài khoản (BR-ACC-05) | SCR-TEST-02 |
| `report.full:<resultId>` | đã mua `report.single` cho kết quả đó **hoặc** đang có Plus | mua lẻ: không hết hạn theo thời gian; chỉ mất khi user xoá kết quả đó (BR-REP-07), khi tài khoản bị xoá cứng (BR-ACC-05) hoặc khi giao dịch đó được hoàn tiền (event refund của API-HOOK-01; đề xuất, theo Q-18). Plus: như `plus` | SCR-APP-03 (Locked nếu thiếu) |
| `report.pdf:<resultId>` | như `report.full` | như trên | SCR-APP-03 |
| `plus` | subscription `active` hoặc `canceled` nhưng còn trong kỳ đã trả | hết kỳ sau khi huỷ · thanh toán gia hạn thất bại quá thời gian ân hạn của provider · hoàn tiền toàn phần kỳ đang dùng (event refund; đề xuất, theo Q-18) · xoá cứng tài khoản | SCR-APP-01 (thử thách) · SCR-PAY-03 |
| `challenge` | `plus` | như `plus` | SCR-APP-01 |
| `checkin` | mọi tài khoản (cả Free) | xoá tài khoản | SCR-APP-01 |

| Rule | Mô tả | Basis |
|---|---|---|
| Nguồn sự thật | bảng `entitlements` ở server, chỉ ghi từ webhook đã verify (API-HOOK-01), cộng job đối soát API-JOB-07 (mỗi giờ) chỉ để **thu hồi** quyền đã quá `accessEndsAt` mà webhook kết thúc chưa về; job không bao giờ tự cấp quyền | BR-APP-01 · api-mapping §2 |
| Huỷ | huỷ Plus = `cancel_at_period_end`; quyền còn tới `current_period_end` | BR-APP-04 |
| Mua lẻ khi đang có Plus | ẩn CTA mua lẻ (đã có quyền); không bán trùng | in-house |
| Trạng thái chờ | thanh toán xong nhưng webhook chưa về → quyền `pending` ở SCR-PAY-02 (không mở report) | cong-nghe-loi §3 |

## 3. Màn liên quan

SCR-TEST-02 · SCR-PAY-01 · SCR-PAY-02 · SCR-PAY-03 · SCR-PAY-04 · SCR-APP-01 · SCR-APP-02 · SCR-APP-03.

## 4. Basis

Q-02 (human) · BR-APP-01 · BR-APP-04 · BR-APP-08.

## 5. AI Notices
- Thời gian ân hạn khi gia hạn thất bại theo cấu hình provider (Q-04).
