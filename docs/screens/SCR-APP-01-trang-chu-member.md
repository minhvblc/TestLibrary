# [SCR-APP-01] Trang chủ member
**Meta**

| id | module | doc level | platforms | route | access | indexable | viewports | related FLOW | status | design | tracking | api | Evidence / visual basis |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| SCR-APP-01 | APP | Short | Web | `/app` | account | noindex | 390 · 768 · 1280 | FLOW-thoi-quen-hang-ngay | Draft | (sau design) | `tracking-events.md` → `app_home` · ft_checkin · ft_challenge · ft_unlock | `docs/api/SCR-APP-01-api.md` | **EV-TLW-209 · EV-TLW-210 · EV-TLW-212 · EV-TLW-213 · EV-TLW-214 · SC-TLW-03 · basis RS·F-21 · Q-15** |

**Changelog** (mới nhất trước)
- 2026-09-27 · v1 · claude (subagent) · khởi tạo từ blueprint.

## 1. Purpose

Trang chủ sau khi đăng nhập, gồm tiến độ trong thư viện, report gần nhất, check-in mỗi ngày kèm streak, thử thách 30 ngày (Plus) và gợi ý bài. Màn giữ vòng giữ chân của đối thủ: check-in + streak và thử thách mở từng ngày (RS·F-21 · EV-TLW-210 · EV-TLW-213). Có hai chỗ khác. Thứ nhất, thử thách lấy nội dung theo type của kết quả thật; đối thủ ghi "built from your results" nhưng tài khoản chưa có kết quả nào vẫn nhận nội dung chung (EV-TLW-213). Thứ hai, không có poll cộng đồng (Q-15; đối thủ có, EV-TLW-212). Giá trị check-in không bao giờ gửi analytics (BR-DASH-04). · basis RS·F-21 · Q-15 · P-07

## 2. Điều hướng

### 2.1 Vào

| Vào qua | Từ | Trigger |
|---|---|---|
| NAV-AUTH-01-3 | SCR-AUTH-01 | hệ thống: đăng nhập xong, không có `next` (replace) |
| NAV-PAY-02-2 | SCR-PAY-02 | "Go to your dashboard" (replace) |
| entry ngoài | shell "Home" (header app · drawer @390) · URL trực tiếp; chưa đăng nhập → `/login?next=/app` | SYS-NAV §1 · SYS-NAV §4 |

### 2.2 Ra

| NAV-ID | Tới (SCR-ID · tham số) | Trigger (CMP-ID "nhãn") | Kiểu | URL / history | Animation | Back / đóng → | Guard / điều kiện | Nền tảng | Basis |
|---|---|---|---|---|---|---|---|---|---|
| NAV-APP-01-1 | SCR-PUB-03 · `slug` | CMP-03 "Start test" / CMP-07 thẻ bài | push | `/tests/:slug` (push) | mặc định | back trình duyệt → SCR-APP-01 | — | Web | CS-12 |
| NAV-APP-01-2 | SCR-APP-03 · `reportId` | CMP-04 "Read report" | push | `/app/reports/:reportId` (push) | mặc định | back trình duyệt → SCR-APP-01 | có quyền | Web | SYS-ENTITLEMENT |
| NAV-APP-01-3 | SCR-PAY-01 · `resultId` | CMP-04 "Unlock report" | push | `/unlock/:resultId` (push) | mặc định | back trình duyệt → SCR-APP-01 | chưa có quyền | Web | Q-02 |
| NAV-APP-01-4 | SCR-PUB-04 | CMP-06 "Unlock with Plus" | push | `/pricing` (push) | mặc định | back trình duyệt → SCR-APP-01 | Free | Web | Q-02 |
| NAV-APP-01-5 | (cùng màn) check-in hôm nay | CMP-05 chọn mức | inline | không đổi URL | mặc định | — | chưa check-in hôm nay (sửa được trong ngày) | Web | RS·F-21 |
| NAV-APP-01-6 | (cùng màn) hoàn thành ngày thử thách | CMP-06 "Mark as done" | inline | không đổi URL | mặc định | — | `plus` | Web | RS·F-21 |

## 3. Layout & components

- **Bố cục @390 (top→bottom, ưu tiên):**
  - header app;
  - lời chào "Hi [first name]";
  - widget check-in: câu hỏi → 5 lựa chọn trên một hàng → streak + dải 7 ngày (đặt cao vì đây là thao tác 1 chạm mỗi ngày);
  - thẻ tiến độ + nút "Start test";
  - thẻ report gần nhất;
  - widget thử thách 30 ngày;
  - 3 thẻ gợi ý bài xếp dọc.
  - Không popup, không banner bán hàng. Free chỉ thấy thẻ thử thách khoá ngay tại chỗ (BR-DASH-03).

| CMP-ID | Component | Type / GC- | Behavior & rules | Basis (EV / Q / in-house) |
|---|---|---|---|---|
| CMP-01 | Header | GC-SiteHeader (app) | theo GC; mục "Home" đang chọn | SYS-NAV §1 |
| CMP-02 | Lời chào | H1 | "Hi [first name]"; [first name] là từ đầu của "Name" (API-ME-01); tên trống → "Hi there" | EV-TLW-209 |
| CMP-03 | Thẻ tiến độ | thẻ + nút chính | "[n] of [total] tests taken" · "Next: [Test]" · nút "Start test"; [n] = số bài khác nhau đã làm, [total] = số bài đang phát hành; 0 bài → tiêu đề đổi thành "Take your first test" | EV-TLW-209 · CS-12 |
| CMP-04 | Report gần nhất | thẻ | tên bài · ngày làm · type (ẩn với bài `sensitive`, như BR-REP-02) · nút "Read report" (có `report.full`) / "Unlock report" (chưa có) / dòng "Confirming your payment…" (đang chờ webhook, không nút); chưa có kết quả → ẩn thẻ | SYS-ENTITLEMENT · BR-REP-02 |
| CMP-05 | Check-in hằng ngày | GC-ScaleInput (biến thể `emoji5`) | câu "How focused do you feel today?" · 5 lựa chọn theo nhãn mặc định của `emoji5`: "Not at all" · "A little" · "Somewhat" · "Fairly" · "Very" (icon mặt SVG chỉ để trang trí, nhãn chữ luôn hiện) · "[n]-day streak" · dải "Last 7 days"; chọn là lưu (API-APP-02) → "Checked in for today. You can change it until the day ends."; `streakDays = 0` → "New streak starts today." · lưu lỗi: trả về giá trị đã lưu trước đó + "We couldn't save your check-in." + nút "Try again" | RS·F-21 · EV-TLW-210 · BR-DASH-01 |
| CMP-06 | Thử thách 30 ngày | thẻ, 2 biến thể | Plus: "Day [n] · [action title]" + nội dung hành động + nút "Mark as done" → "Done" + "[k] of 30 days done"; ngày chưa mở chỉ hiện ổ khoá · Plus chưa có kết quả: "Your challenge is built from your latest result. Take a test to start." · xong 30 ngày: "You finished the 30-day challenge." · Free: thẻ khoá + "One small action a day for 30 days, based on your latest test result. Included with Plus." + nút "Unlock with Plus" | RS·F-21 · EV-TLW-213 · EV-TLW-214 · BR-DASH-02 · BR-DASH-03 |
| CMP-07 | Gợi ý bài | GC-TestCard ×3 | bài chưa làm, không gồm bài `sensitive`; mỗi thẻ có nút "Start test" | CS-12 · Q-06 |

## 4. States

| State | Trigger | Hiển thị | EV / basis |
|---|---|---|---|
| Default | API-APP-01 trả đủ các khối | CMP-01…07 theo quyền (Free / Plus) | EV-TLW-209 |
| Loading | lần đầu vào `/app` (render phía client) | skeleton từng widget theo đúng bố cục | tieu-chuan-chung §3 |
| Empty | tài khoản mới, 0 bài | CMP-03 thành "Take your first test" + "Next: [Test]" + "Start test"; ẩn CMP-04; CMP-05 vẫn hiện (check-in không cần kết quả); CMP-06 Plus → "Your challenge is built from your latest result. Take a test to start."; CMP-07 hiện | EV-TLW-209 (đối thủ: "0 of 30 tests completed") |
| Error | API-APP-01 lỗi toàn phần hoặc một khối lỗi · API-APP-02 lỗi | mỗi widget lỗi hiện "We couldn't load this. Try again." + nút "Try again" (gọi lại API-APP-01); widget khác vẫn dùng được · lưu check-in lỗi: CMP-05 trả về giá trị trước đó + "We couldn't save your check-in." + nút "Try again" | tieu-chuan-chung §2 · GC-ScaleInput |
| Locked | Free: thử thách khoá (CMP-06 biến thể Free) · chưa đăng nhập: guard redirect `/login?next=/app`, không render | thẻ khoá + mô tả thật + "Unlock with Plus" | EV-TLW-213 · BR-DASH-03 · SYS-NAV §4 |

## 5. API

| API | Method | When called |
|---|---|---|
| API-APP-01 | GET | mở màn; nút "Try again" của widget lỗi |
| API-APP-02 | POST | chọn một mức check-in (tạo mới hoặc sửa trong ngày) |
| API-APP-03 | POST | "Mark as done" |
| API-ME-01 | GET | lời chào (dùng chung với GC-SiteHeader) |
| API-CAT-01 | GET | "Next: [Test]" (CMP-03) + 3 thẻ gợi ý (CMP-07) |

Chi tiết schema và lỗi riêng màn → `docs/api/SCR-APP-01-api.md`.

## 6. Tracking

| Event | Note |
|---|---|
| `screen_active` · `app_home` | route hiện |
| ft_checkin start / submit | start khi widget hiện và hôm nay chưa check-in · submit khi API-APP-02 trả về, chỉ gửi `streak_days`, KHÔNG gửi mức đã chọn (BR-DASH-04) |
| ft_challenge start / day_complete | start khi thẻ ngày thử thách hiện (Plus), param `day` · day_complete khi API-APP-03 trả về |
| ft_unlock start | `surface=app_home`; bắn khi CMP-04 ở dạng "Unlock report" hoặc CMP-06 ở dạng Free hiện lần đầu trong phiên |

## 7. Business rules & edge cases

| BR-ID | Rule | Basis |
|---|---|---|
| BR-DASH-01 | Check-in 1 lần/ngày nghiệp vụ (BR-APP-09), sửa được trong ngày; streak = số ngày liên tiếp có check-in; lỡ 1 ngày → streak về 0 với copy trung tính "New streak starts today." | RS·F-21 · BR-APP-09 · EV-TLW-210 |
| BR-DASH-02 | Thử thách: mở ngày N khi đã qua N−1 ngày nghiệp vụ từ ngày bắt đầu; làm bù được; nội dung theo type của kết quả gần nhất (TD-02) | RS·F-21 · TD-02 · EV-TLW-213 |
| BR-DASH-03 | Free thấy thẻ thử thách khoá kèm mô tả thật, không popup | Q-15 · SYS-ENTITLEMENT · RS·F-17 |
| BR-DASH-04 | Giá trị check-in không gửi analytics (BR-APP-05) | BR-APP-05 · cong-nghe-loi §4 |

| EC-xx | Tình huống | Handling | Basis |
|---|---|---|---|
| EC-01 | Check-in sát lúc chuyển ngày | server tính ngày nghiệp vụ theo timezone tài khoản lúc nhận request; widget cập nhật theo phản hồi | BR-APP-09 |
| EC-02 | Vừa đổi timezone ở SCR-ACC-01 | áp dụng từ ngày nghiệp vụ kế tiếp; streak hôm nay không đổi | BR-ACC-03 |
| EC-03 | Hai tab cùng check-in | idempotent theo `userId` + ngày; lần sau ghi đè giá trị lần trước | 00-quy-uoc-api §5 |
| EC-04 | Mất mạng khi chọn mức check-in | lựa chọn hiện ngay rồi trả về giá trị đã lưu khi request lỗi; hiện "We couldn't save your check-in." + "Try again" (gửi lại mức vừa chọn, không tạo bản trùng) | GC-ScaleInput · 00-quy-uoc-api §5 |
| EC-05 | Ngày bắt đầu thử thách | là ngày nghiệp vụ user bấm "Mark as done" ngày 1 lần đầu; trước đó chỉ ngày 1 mở | BR-DASH-02 · EV-TLW-213 |
| EC-06 | Làm bài mới giữa thử thách | ngày chưa mở lấy nội dung theo kết quả mới nhất; ngày đã mở giữ nguyên nội dung | BR-DASH-02 · TD-02 |
| EC-07 | Kết quả gần nhất là bài `sensitive` | thử thách lấy từ kết quả gần nhất KHÔNG `sensitive`; CMP-04 không hiện type | Q-06 · BR-REP-02 |
| EC-08 | Plus hết kỳ giữa thử thách | CMP-06 về biến thể Free, tiến độ giữ nguyên; có Plus lại thì làm tiếp từ ngày đang dở | SYS-ENTITLEMENT |
| EC-09 | Xong 30/30 ngày | "You finished the 30-day challenge."; MVP không có vòng mới | in-house |
| EC-10 | Đã thanh toán nhưng webhook chưa về | CMP-04 hiện "Confirming your payment…", không có nút mua để tránh mua trùng | SYS-ENTITLEMENT · cong-nghe-loi §3 |
| EC-11 | Vào ngay sau khi đăng nhập đã khôi phục tài khoản chờ xoá (`accountRestored` / `restored=1`) | hiện một lần overlay "Welcome back — your account has been restored." (kiểu `overlay`, SYS-NAV §2), không chặn thao tác | BR-ACC-06 · SYS-AUTH |

## 8. Responsive deltas

| Aspect | 390 (gốc) | 768 | 1280 |
|---|---|---|---|
| Lưới widget | 1 cột theo thứ tự ở §3 | 2 cột: check-in · tiến độ / report · thử thách | như 768, container `layout.max-width` |
| Check-in 5 lựa chọn | 1 hàng, mỗi ô ≥ 44 px, nhãn chữ dưới icon; phóng to 200% thì thành 5 hàng dọc (GC-ScaleInput) | như 390 | như 390, ô rộng hơn |
| Gợi ý bài | 3 thẻ xếp dọc | 2 cột (thẻ thứ 3 xuống hàng) | 3 cột |

## 9. Keyboard & focus

Nhóm check-in theo GC-ScaleInput `emoji5`: là `radiogroup`, mũi tên chỉ di chuyển focus, `Space`/`Enter` chọn (chọn = lưu). Phím số 1–5 chỉ có tác dụng khi focus đang nằm trong nhóm (`keyboardScope = group`, khác SCR-TEST-01), để không lưu nhầm khi đang thao tác widget khác. Sau "Mark as done", trạng thái "Done" được đọc qua `aria-live="polite"`, focus giữ trên thẻ. Còn lại theo `tieu-chuan-chung §5`.

## 10. AI Notices
- Câu hỏi check-in cố định trong MVP, dùng bộ nhãn mặc định của GC-ScaleInput `emoji5`. Đổi câu hỏi theo ngày nằm ngoài scope.
- GC-TestCard §5 ghi SCR-APP-01 dùng cả variant `sensitive`, nhưng màn này bỏ bài `sensitive` khỏi gợi ý nên thực tế chỉ dùng `standard`.
- Bỏ bài `sensitive` khỏi gợi ý (CMP-03 "Next", CMP-07) và khỏi nguồn nội dung thử thách là đề xuất in-house theo Q-06, cần duyệt.
- Poll cộng đồng ngoài scope MVP (Q-15 · final-features §8).
- Tên tham số lọc của API-CAT-01 dùng ở đây (`excludeTaken` · `includeSensitive`) chưa thống nhất với SCR-PUB-01/02 (mô tả API inline); cần chốt một bộ.
