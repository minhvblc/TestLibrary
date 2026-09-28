# SYS-ENTITLEMENT — ai được đọc gì
**Changelog** (mới nhất trước)
- 2026-09-27 · v1 · claude-opus-5-5 · theo Q-02 (freemium minh bạch, human chốt).

## 1. Mục đích

Quyết định ở MỘT nơi (server) ai được xem kết quả tóm tắt, report đầy đủ, PDF, thử thách 30 ngày. Client chỉ hiển thị theo `entitlements` server trả về (BR-APP-01).

## 2. State / rule xuyên màn

| Quyền | Có khi | Mất khi | Màn thể hiện |
|---|---|---|---|
| `result.summary` | là chủ kết quả (token khách hoặc tài khoản) | kết quả khách hết hạn 30 ngày (BR-APP-08) · xoá tài khoản | SCR-TEST-02 |
| `report.full:<resultId>` | đã mua `report.single` cho kết quả đó **hoặc** đang có Plus | không bao giờ mất với mua lẻ; với Plus: hết kỳ sau khi huỷ | SCR-APP-03 (Locked nếu thiếu) |
| `report.pdf:<resultId>` | như `report.full` | như trên | SCR-APP-03 |
| `plus` | subscription `active` hoặc `canceled` nhưng còn trong kỳ đã trả | hết kỳ sau khi huỷ · thanh toán gia hạn thất bại quá thời gian ân hạn của provider | SCR-APP-01 (thử thách) · SCR-PAY-03 |
| `challenge` | `plus` | như `plus` | SCR-APP-01 |
| `checkin` | mọi tài khoản (cả Free) | xoá tài khoản | SCR-APP-01 |

| Rule | Mô tả | Basis |
|---|---|---|
| Nguồn sự thật | bảng `entitlements` ở server, chỉ ghi từ webhook đã verify (API-HOOK-01) hoặc job hết kỳ | BR-APP-01 |
| Huỷ | huỷ Plus = `cancel_at_period_end`; quyền còn tới `current_period_end` | BR-APP-04 |
| Mua lẻ khi đang có Plus | ẩn CTA mua lẻ (đã có quyền); không bán trùng | in-house |
| Trạng thái chờ | thanh toán xong nhưng webhook chưa về → quyền `pending` ở SCR-PAY-02 (không mở report) | cong-nghe-loi §3 |

## 3. Màn liên quan

SCR-TEST-02 · SCR-PAY-01 · SCR-PAY-02 · SCR-PAY-03 · SCR-PAY-04 · SCR-APP-01 · SCR-APP-02 · SCR-APP-03.

## 4. Basis

Q-02 (human) · BR-APP-01 · BR-APP-04 · BR-APP-08.

## 5. AI Notices
- Thời gian ân hạn khi gia hạn thất bại theo cấu hình provider (Q-04).
