# [SCR-ACC-02] API — Xoá tài khoản
Refs: `docs/screens/SCR-ACC-02-xoa-tai-khoan.md` · FLOW-quyen-rieng-tu · `00-quy-uoc-api.md` (envelope, lỗi chung, idempotency — KHÔNG lặp lại ở đây)
**Changelog** (mới nhất trước)
- 2026-09-27 · v1 · claude (subagent) · khởi tạo từ blueprint.

## 0. Endpoint overview

| ID | Endpoint | Method | When called | Idempotent (key) | Contract status |
|---|---|---|---|---|---|
| API-ME-04 | `/v1/me` | DELETE | bấm "Delete my account" sau khi gõ đúng "DELETE" | có — `userId` (00-quy-uoc-api §5) | proposal (Money: cần human review) |

## API-ME-04 · DELETE `/v1/me`

Yêu cầu xoá tài khoản đang đăng nhập. Auth: cookie `tl_session` + `X-CSRF-Token`. Endpoint này có tiền (tắt gia hạn), nên theo `api-mapping.md` phải được human review trước API-FREEZE.

Side effect, chạy theo đúng thứ tự; bước nào lỗi thì dừng và không đổi gì ở các bước sau:
1. Nếu có subscription còn gia hạn: tắt gia hạn qua provider (hết kỳ thì dừng, không thu thêm; BR-APP-04). Provider lỗi → trả 502, tài khoản giữ nguyên.
2. Đánh dấu tài khoản "chờ xoá", ghi hạn xoá cứng = thời điểm yêu cầu + 30 ngày.
3. Thu hồi mọi phiên `tl_session` của user trên mọi thiết bị, và xoá cookie phiên trong chính phản hồi này.
4. Đưa API-MAIL-07 vào hàng đợi (xác nhận + cách khôi phục).
5. Tới hạn thì API-JOB-04 xoá cứng. Nếu user đăng nhập lại trước hạn thì tài khoản được khôi phục ở bước tạo phiên (BR-ACC-06).

| Body field | Type | Required | Meaning | Basis |
|---|---|---|---|---|
| `confirm` | string, phải đúng bằng `"DELETE"` | có | server kiểm lại chuỗi xác nhận, chống gọi nhầm | BR-ACC-04 |

Không nhận field lý do: màn không hỏi lý do xoá (BR-APP-04).

| Response `data` field | Type | Meaning | Basis |
|---|---|---|---|
| `status` | enum `scheduled` | tài khoản đã vào trạng thái chờ xoá → client replace `/` + toast | BR-ACC-05 |

```json
{ "code": 0, "message": "ok", "data": { "status": "scheduled" } }
```

| Lỗi RIÊNG màn | When | UI reaction (verbatim) |
|---|---|---|
| 409 | gọi lặp gần như cùng lúc (tài khoản đã ở trạng thái chờ xoá) | coi là thành công (00-quy-uoc-api §4): replace `/` + toast "Your account is scheduled for deletion. Sign in within 30 days to restore it." |
| 422 `confirm_mismatch` (field `confirm`) | chuỗi xác nhận sai | không xảy ra từ UI (nút disable); nếu có thì giữ trang + "We couldn't delete your account right now. Please try again or contact support." |
| 502 `billing_provider_error` | provider không tắt được gia hạn | "We couldn't delete your account right now. Please try again or contact support."; không đổi gì |
| 401 | phiên hết hạn | "Your session expired. Sign in to continue — we kept what you entered." → `/login?next=/account/delete` |
| 5xx / mất mạng | lỗi server | "We couldn't delete your account right now. Please try again or contact support." |

## Field → UI map

| Response field | Used by (CMP-ID) | Display format |
|---|---|---|
| `status = scheduled` | CMP-06 · NAV-ACC-02-1 | đặt cờ một lần trong `sessionStorage` rồi replace `/`; SCR-PUB-01 hiện toast "Your account is scheduled for deletion. Sign in within 30 days to restore it." |

## AI Notices
- Payload là SPEC mới; đối thủ không có xoá tài khoản (EV-TLW-246), không có gì để tham chiếu.
- `confirm` gửi trong body của DELETE (fetch hỗ trợ). Nếu proxy/CDN chặn body của DELETE thì đổi sang header, quyết định lúc làm BE.
- Khôi phục tài khoản xảy ra ở bước tạo phiên (API-AUTH-02 / API-AUTH-04); banner BR-ACC-06 dựa trên cờ `accountRestored` / query `restored=1` đã mô tả ở `SCR-AUTH-01-api.md`.
- Danh sách dữ liệu bị xoá cứng và bản ghi giao dịch phải giữ theo luật: chốt cùng Q-05 ở `legal-consent.md`.
