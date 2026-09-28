# SYS-AUTH — khách, tài khoản, phiên
**Changelog** (mới nhất trước)
- 2026-09-28 · v1.1 · claude-opus-5-5 · D-17: banner khôi phục do shell app hiện ở trang đích đầu tiên (mọi `next`), dựa trên `accountRestored` (API-AUTH-02) hoặc `restored=1` (API-AUTH-04).
- 2026-09-27 · v1 · claude-opus-5-5 · theo đề xuất Q-11 (magic link + Google, checkout khách được).

## 1. Mục đích

Một cơ chế thống nhất cho **khách** (guest: làm bài, xem tóm tắt, mua mà không cần tài khoản) và **tài khoản** (lưu lịch sử, đọc report, Plus, dashboard). Không có mật khẩu: đăng nhập bằng magic link email hoặc Google (Q-11). Cách này tránh luồng "đặt mật khẩu sau thanh toán" mà đối thủ dùng (RS·F-20).

## 2. State / rule xuyên màn

| Khái niệm | Rule | Basis |
|---|---|---|
| Token khách `tl_guest` | tạo ở lần đầu bắt đầu bài; cookie HttpOnly 30 ngày; mọi attempt/result của khách gắn token này | BR-APP-08 |
| Lưu kết quả bằng email | SCR-TEST-02 gọi API-RES-02 → gửi magic link (API-MAIL-01); bấm link = tạo/đăng nhập tài khoản với email đó + **gộp** mọi kết quả của token hiện tại vào tài khoản | BR-APP-08 · Q-11 |
| Checkout khách | provider thu email; webhook (API-HOOK-01) tạo tài khoản với email đó nếu chưa có, gắn quyền mua; SCR-PAY-02 trên cùng trình duyệt đọc được report ngay nhờ token khách; email biên nhận có magic link để đăng nhập ở thiết bị khác | BR-APP-01 · Q-11 |
| Phiên sau checkout khách | webhook xác nhận + email **chưa có tài khoản** → tài khoản mới tạo cho lần mua này; SCR-PAY-02 trên CÙNG trình duyệt (có token khách + phiên checkout) được cấp phiên đăng nhập ngay. Email **đã có tài khoản** → KHÔNG tự đăng nhập (tránh chiếm tài khoản bằng cách gõ email người khác), gửi magic link, SCR-PAY-02 hiện "Check your email to sign in and open your purchase." | BR-APP-01 · Q-11 |
| Magic link | hết hạn 15 phút, dùng 1 lần; gửi lại tối đa 3 lần/giờ/email | BR-APP-10 |
| Google | OAuth (API-AUTH-03 · API-AUTH-04); email đã tồn tại thì gộp vào tài khoản đó | Q-11 |
| Phiên | cookie `tl_session` trượt 30 ngày; đăng xuất xoá phiên của thiết bị hiện tại | BR-APP-10 |
| Guard | route `account`/`entitled` khi chưa có phiên → `/login?next=<route>` (tieu-chuan-chung §1) | SYS-NAV §4 |
| Khôi phục tài khoản | đăng nhập trong 30 ngày sau yêu cầu xoá → huỷ lịch xoá; trang đích ĐẦU TIÊN sau đăng nhập (bất kể `next`) hiện một lần overlay "Welcome back — your account has been restored." — do shell app hiện (SYS-NAV §1 · §2 kiểu `overlay`), không phải từng màn; cờ `accountRestored` từ API-AUTH-02 (magic link) hoặc query `restored=1` từ API-AUTH-04 (Google). SCR-APP-01 EC-11 là trường hợp không có `next` | BR-APP-11 |

## 3. Màn liên quan

SCR-AUTH-01 · SCR-TEST-02 · SCR-PAY-02 · SCR-ACC-01 · SCR-ACC-02 · GC-SiteHeader.

## 4. Basis

Q-11 (đề xuất AI) · BR-APP-08 · BR-APP-10 · RS·F-20.

## 5. AI Notices
- Nếu human chọn mật khẩu thay magic link (Q-11), cần thêm màn đặt/đổi mật khẩu và chính sách mật khẩu.
