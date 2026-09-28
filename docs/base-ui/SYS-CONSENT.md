# SYS-CONSENT — consent cookie + consent dữ liệu nhạy cảm
**Changelog** (mới nhất trước)
- 2026-09-27 · v1 · claude-opus-5-5 · theo Q-06 (human) + đề xuất Q-12 · Q-13.

## 1. Mục đích

Hai loại consent tách biệt:
1. **Consent cookie/tracking** (analytics, marketing) cho mọi user, mọi vùng (Q-13).
2. **Consent dữ liệu nhạy cảm** cho từng lần làm bài `sensitive` (Q-06).

Không có tracking không-thiết-yếu nào chạy trước consent. Câu trả lời không bao giờ rời hệ thống của mình (BR-APP-05).

## 2. State / rule xuyên màn

| Consent | Hỏi ở đâu | Lựa chọn | Mặc định | Lưu | Basis |
|---|---|---|---|---|---|
| Cookie `necessary` | không hỏi (luôn bật) | — | bật | — | legal-consent §2 |
| Cookie `analytics` | GC-ConsentBanner lần đầu + SCR-PUB-07 | Accept all · Reject all · Manage | **tắt** | cookie `tl_consent` 12 tháng + bản ghi server (API-CON-01) | BR-APP-05 · Q-13 |
| Cookie `marketing` | như trên | như trên | **tắt**; MVP chưa có script marketing (Q-12) | như trên | Q-12 |
| Dữ liệu nhạy cảm (bài `sensitive`) | bước đầu của SCR-TEST-01, trước câu 1 | "I agree — start the test" / "Not now" | không tick sẵn; không đồng ý thì không làm bài | lưu `sensitive_consent_version` + thời điểm vào attempt (API-TEST-01) | BR-APP-06 · Q-06 |

| Rule | Mô tả | Basis |
|---|---|---|
| Tải script | `AppTracking` chỉ tải SDK analytics khi `analytics = granted` VÀ route không phải bài `sensitive` | TD-04 · BR-APP-06 |
| Rút consent | đổi ở SCR-PUB-07 bất kỳ lúc nào; rút analytics → gỡ SDK, xoá cookie analytics ở lần tải trang kế | legal-consent §3 |
| Rút consent dữ liệu nhạy cảm | xoá kết quả đó (kèm câu trả lời) bằng API-RES-03 từ SCR-APP-02 hoặc SCR-TEST-02; không cần xoá tài khoản | BR-APP-11 |
| Version | đổi nội dung banner/chính sách → tăng version → hỏi lại | in-house |

## 3. Màn liên quan

SCR-PUB-07 · SCR-TEST-01 · SCR-PUB-03 · SCR-TEST-02 · SCR-APP-03 · GC-ConsentBanner · GC-SensitiveNotice.

## 4. Basis

Q-06 (human) · Q-12 · Q-13 · TD-04 · RS·F-02 · RS·F-13.

## 5. AI Notices
- Hỏi consent ở mọi vùng là lựa chọn an toàn nhất (Q-13), có thể làm giảm dữ liệu analytics. Human có thể đổi sang chỉ EU/UK.
