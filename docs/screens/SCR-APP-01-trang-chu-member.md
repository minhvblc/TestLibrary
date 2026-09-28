# [SCR-APP-01] Trang chủ member
**Meta**

| id | module | doc level | platforms | route | access | indexable | viewports | related FLOW | status | design | tracking | api | Evidence / visual basis |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| SCR-APP-01 | APP | Short | Web | `/app` | account | noindex | 390 · 768 · 1280 | FLOW-thoi-quen-hang-ngay | Draft | (sau design) | `tracking-events.md` → `app_home` · ft_checkin · ft_challenge · ft_unlock | `docs/api/SCR-APP-01-api.md` | **EV-TLW-209 · EV-TLW-210 · EV-TLW-212 · EV-TLW-213 · EV-TLW-214 · SC-TLW-03 · basis RS·F-21 · Q-15 · Q-22** |

**Changelog** (mới nhất trước)
- 2026-09-28 · v1.2 · claude-opus-5-5 · Q-22 (consent check-in, giải quyết D-12): thêm bước bật check-in CMP-08 ("Turn on daily check-ins?") + thẻ mời bật CMP-09, NAV-APP-01-7 · 8 · 9, BR-DASH-05 · BR-DASH-06 (đổi version câu đồng ý: major hỏi lại + tạm dừng, minor không), EC-12…20, tracking ft_checkin enable; API-APP-02 chỉ nhận khi đã bật (422 `consent_required`); vào từ NAV-ACC-01-8 (`/app#checkin`) + email API-MAIL-10; EC-08 thêm rút Plus 14 ngày (Q-18). Notice cũ về tham số API-CAT-01 sửa theo `api-mapping` §1 (đã hợp nhất).
- 2026-09-28 · v1.1 · claude-opus-5-5 · D-17: overlay khôi phục tài khoản do shell app hiện, trang đích nào cũng có (SYS-AUTH).
- 2026-09-27 · v1 · claude (subagent) · khởi tạo từ blueprint.

## 1. Purpose

Trang chủ sau khi đăng nhập, gồm tiến độ trong thư viện, report gần nhất, check-in mỗi ngày kèm streak, thử thách 30 ngày (Plus) và gợi ý bài. Màn giữ vòng giữ chân của đối thủ: check-in + streak và thử thách mở từng ngày (RS·F-21 · EV-TLW-210 · EV-TLW-213). Có hai chỗ khác. Thứ nhất, thử thách lấy nội dung theo type của kết quả thật; đối thủ ghi "built from your results" nhưng tài khoản chưa có kết quả nào vẫn nhận nội dung chung (EV-TLW-213). Thứ hai, không có poll cộng đồng (Q-15; đối thủ có, EV-TLW-212). Check-in là dữ liệu về tâm trạng nên chỉ chạy sau bước đồng ý riêng (consent tường minh, Q-22): lần đầu, chỗ widget check-in là bước "Turn on daily check-ins?"; chọn "Not now" thì chỗ đó thành thẻ mời bật, phần còn lại của dashboard vẫn dùng bình thường (BR-DASH-05). Giá trị check-in không bao giờ gửi analytics (BR-DASH-04). · basis RS·F-21 · Q-15 · Q-22 · P-07

## 2. Điều hướng

### 2.1 Vào

| Vào qua | Từ | Trigger |
|---|---|---|
| NAV-AUTH-01-3 | SCR-AUTH-01 | hệ thống: đăng nhập xong, không có `next` (replace) |
| NAV-PAY-02-2 | SCR-PAY-02 | "Go to your dashboard" (replace) |
| NAV-ACC-01-8 | SCR-ACC-01 | "Turn them on from your dashboard" (check-in đang tắt) → `/app#checkin`, CMP-08 mở sẵn (EC-18) |
| entry ngoài | shell "Home" (header app · drawer @390) · URL trực tiếp · email nhắc check-in hằng tuần API-MAIL-10 (chỉ gửi khi check-in đang bật, BR-ACC-08); chưa đăng nhập → `/login?next=/app` | SYS-NAV §1 · SYS-NAV §4 · api-mapping §2 |

### 2.2 Ra

| NAV-ID | Tới (SCR-ID · tham số) | Trigger (CMP-ID "nhãn") | Kiểu | URL / history | Animation | Back / đóng → | Guard / điều kiện | Nền tảng | Basis |
|---|---|---|---|---|---|---|---|---|---|
| NAV-APP-01-1 | SCR-PUB-03 · `slug` | CMP-03 "Start test" / CMP-07 thẻ bài | push | `/tests/:slug` (push) | mặc định | back trình duyệt → SCR-APP-01 | — | Web | CS-12 |
| NAV-APP-01-2 | SCR-APP-03 · `reportId` | CMP-04 "Read report" | push | `/app/reports/:reportId` (push) | mặc định | back trình duyệt → SCR-APP-01 | có quyền | Web | SYS-ENTITLEMENT |
| NAV-APP-01-3 | SCR-PAY-01 · `resultId` | CMP-04 "Unlock report" | push | `/unlock/:resultId` (push) | mặc định | back trình duyệt → SCR-APP-01 | chưa có quyền | Web | Q-02 |
| NAV-APP-01-4 | SCR-PUB-04 | CMP-06 "Unlock with Plus" | push | `/pricing` (push) | mặc định | back trình duyệt → SCR-APP-01 | Free | Web | Q-02 |
| NAV-APP-01-5 | (cùng màn) check-in hôm nay | CMP-05 chọn mức | inline | không đổi URL | mặc định | — | check-in đã bật (BR-DASH-05); chưa check-in hôm nay (sửa được trong ngày) | Web | RS·F-21 · BR-DASH-05 |
| NAV-APP-01-6 | (cùng màn) hoàn thành ngày thử thách | CMP-06 "Mark as done" | inline | không đổi URL | mặc định | — | `plus` | Web | RS·F-21 |
| NAV-APP-01-7 | (cùng màn) bật check-in → CMP-05 | CMP-08 "Turn on check-ins" | inline | không đổi URL | mặc định | — | CMP-08 đang hiện (chưa bật, hoặc chờ đồng ý bản mới); API-ME-02 lưu consent OK | Web | Q-22 · BR-DASH-05 · BR-DASH-06 |
| NAV-APP-01-8 | (cùng màn) thẻ mời bật CMP-09 | CMP-08 "Not now" | inline | không đổi URL | mặc định | — | CMP-08 đang hiện | Web | Q-22 · BR-DASH-05 · BR-DASH-06 |
| NAV-APP-01-9 | (cùng màn) mở lại bước bật check-in CMP-08 | CMP-09 "Turn on daily check-ins" | inline | không đổi URL | mặc định | — | `checkin.state` = `off` · `paused` | Web | BR-DASH-05 · BR-DASH-06 · BR-ACC-07 |

## 3. Layout & components

- **Bố cục @390 (top→bottom, ưu tiên):**
  - header app;
  - lời chào "Hi [first name]";
  - widget check-in: câu hỏi → 5 lựa chọn trên một hàng → streak + dải 7 ngày (đặt cao vì đây là thao tác 1 chạm mỗi ngày); check-in chưa bật thì cùng chỗ này là bước bật check-in (CMP-08) hoặc thẻ mời bật (CMP-09);
  - thẻ tiến độ + nút "Start test";
  - thẻ report gần nhất;
  - widget thử thách 30 ngày;
  - 3 thẻ gợi ý bài xếp dọc.
  - Không popup, không banner bán hàng. Free chỉ thấy thẻ thử thách khoá ngay tại chỗ (BR-DASH-03). Bước bật check-in cũng nằm trong widget, không phải popup (BR-DASH-05).

| CMP-ID | Component | Type / GC- | Behavior & rules | Basis (EV / Q / in-house) |
|---|---|---|---|---|
| CMP-01 | Header | GC-SiteHeader (app) | theo GC; mục "Home" đang chọn | SYS-NAV §1 |
| CMP-02 | Lời chào | H1 | "Hi [first name]"; [first name] là từ đầu của "Name" (API-ME-01); tên trống → "Hi there" | EV-TLW-209 |
| CMP-03 | Thẻ tiến độ | thẻ + nút chính | "[n] of [total] tests taken" · "Next: [Test]" · nút "Start test"; [n] = số bài khác nhau đã làm, [total] = số bài đang phát hành; 0 bài → tiêu đề đổi thành "Take your first test" | EV-TLW-209 · CS-12 |
| CMP-04 | Report gần nhất | thẻ | tên bài · ngày làm · type (ẩn với bài `sensitive`, như BR-REP-02) · nút "Read report" (có `report.full`) / "Unlock report" (chưa có) / dòng "Confirming your payment…" (đang chờ webhook, không nút); chưa có kết quả → ẩn thẻ | SYS-ENTITLEMENT · BR-REP-02 |
| CMP-05 | Check-in hằng ngày | GC-ScaleInput (biến thể `emoji5`) | chỉ khi check-in đã bật (`checkin.state` = `on`): câu "How focused do you feel today?" · 5 lựa chọn theo nhãn mặc định của `emoji5`: "Not at all" · "A little" · "Somewhat" · "Fairly" · "Very" (icon mặt SVG chỉ để trang trí, nhãn chữ luôn hiện) · "[n]-day streak" · dải "Last 7 days"; chọn là lưu (API-APP-02) → "Checked in for today. You can change it until the day ends."; `streakDays = 0` → "New streak starts today." · lưu lỗi: trả về giá trị đã lưu trước đó + "We couldn't save your check-in." + nút "Try again" | RS·F-21 · EV-TLW-210 · BR-DASH-01 · BR-DASH-05 |
| CMP-06 | Thử thách 30 ngày | thẻ, 2 biến thể | Plus: "Day [n] · [action title]" + nội dung hành động + nút "Mark as done" → "Done" + "[k] of 30 days done"; ngày chưa mở chỉ hiện ổ khoá · Plus chưa có kết quả: "Your challenge is built from your latest result. Take a test to start." · xong 30 ngày: "You finished the 30-day challenge." · Free: thẻ khoá + "One small action a day for 30 days, based on your latest test result. Included with Plus." + nút "Unlock with Plus" | RS·F-21 · EV-TLW-213 · EV-TLW-214 · BR-DASH-02 · BR-DASH-03 |
| CMP-07 | Gợi ý bài | GC-TestCard ×3 | bài chưa làm, không gồm bài `sensitive`; mỗi thẻ có nút "Start test" | CS-12 · Q-06 |
| CMP-08 | Bước bật check-in (consent) | thẻ, thay chỗ CMP-05 | hiện khi `checkin.state` = `ask` (chưa trả lời lần nào) hoặc `reask` (câu đồng ý vừa đổi major, BR-DASH-06), hoặc khi mở từ CMP-09 / `/app#checkin` · `reask` thêm dòng đầu "We've updated how we use check-ins. To keep checking in, review the changes below." · tiêu đề H2 "Turn on daily check-ins?" · thân "Check-ins are a quick note about your mood. Because this is about your wellbeing, we treat it as sensitive data: we use it only to show your streak and your last 7 days, and we never share it with advertisers or analytics. You can turn check-ins off and delete them anytime in Account." · nút chính "Turn on check-ins" · nút phụ cùng cỡ "Not now"; không có lựa chọn mức, không streak · "Turn on check-ins" → API-ME-02 `checkins: { enabled: true, consentVersion }` → tải lại API-APP-01 → CMP-05 hiện tại chỗ (bật lần đầu: "New streak starts today.") (NAV-APP-01-7) · đang gửi: spinner trong nút, hai nút disable · lỗi: giữ thẻ + "We couldn't turn on check-ins. Please try again." · "Not now" → API-ME-02 `checkins: { dismissed: true, consentVersion }` (khi CMP-08 tự hiện) → CMP-09 (NAV-APP-01-8) | Q-22 · BR-DASH-05 · BR-DASH-06 · legal-consent §3d |
| CMP-09 | Thẻ mời bật check-in | thẻ gọn, thay chỗ CMP-05 | `checkin.state` = `off` (đã chọn "Not now", hoặc đã tắt ở SCR-ACC-01): "Daily check-ins are off." · `paused` (đã chọn "Not now" khi được hỏi lại sau đổi major; lịch sử còn): "Daily check-ins are paused." + "Your past check-ins are kept until you turn check-ins off in Account." · cả hai: nút phụ "Turn on daily check-ins" → CMP-08 mở tại chỗ (NAV-APP-01-9); không streak, không dải "Last 7 days"; không tự mở lại CMP-08 | BR-DASH-05 · BR-DASH-06 · BR-ACC-07 |

## 4. States

| State | Trigger | Hiển thị | EV / basis |
|---|---|---|---|
| Default | API-APP-01 trả đủ các khối | CMP-01…07 theo quyền (Free / Plus); chỗ check-in theo `checkin.state`: `on` → CMP-05 · `ask` / `reask` → CMP-08 · `off` / `paused` → CMP-09 (BR-DASH-05 · BR-DASH-06) | EV-TLW-209 · Q-22 |
| Loading | lần đầu vào `/app` (render phía client) | skeleton từng widget theo đúng bố cục | tieu-chuan-chung §3 |
| Empty | tài khoản mới, 0 bài | CMP-03 thành "Take your first test" + "Next: [Test]" + "Start test"; ẩn CMP-04; chỗ check-in vẫn hiện theo `checkin.state` (check-in không cần kết quả; tài khoản mới chưa trả lời → CMP-08); CMP-06 Plus → "Your challenge is built from your latest result. Take a test to start."; CMP-07 hiện | EV-TLW-209 (đối thủ: "0 of 30 tests completed") |
| Error | API-APP-01 lỗi toàn phần hoặc một khối lỗi · API-APP-02 lỗi · API-ME-02 lỗi khi bật check-in | mỗi widget lỗi hiện "We couldn't load this. Try again." + nút "Try again" (gọi lại API-APP-01); widget khác vẫn dùng được · lưu check-in lỗi: CMP-05 trả về giá trị trước đó + "We couldn't save your check-in." + nút "Try again" · bật check-in lỗi: CMP-08 giữ nguyên + "We couldn't turn on check-ins. Please try again." | tieu-chuan-chung §2 · GC-ScaleInput |
| Locked | Free: thử thách khoá (CMP-06 biến thể Free) · chưa đăng nhập: guard redirect `/login?next=/app`, không render | thẻ khoá + mô tả thật + "Unlock with Plus" | EV-TLW-213 · BR-DASH-03 · SYS-NAV §4 |

## 5. API

| API | Method | When called |
|---|---|---|
| API-APP-01 | GET | mở màn; nút "Try again" của widget lỗi |
| API-APP-02 | POST | chọn một mức check-in (tạo mới hoặc sửa trong ngày); chỉ khi check-in đã bật, chưa bật → 422 `consent_required` |
| API-APP-03 | POST | "Mark as done" |
| API-ME-01 | GET | lời chào (dùng chung với GC-SiteHeader) |
| API-ME-02 | PATCH | CMP-08 "Turn on check-ins" (`checkins: { enabled: true, consentVersion }`) · "Not now" khi CMP-08 tự hiện (`ask` / `reask`: `checkins: { dismissed: true, consentVersion }`); schema ở `docs/api/SCR-ACC-01-api.md` |
| API-CAT-01 | GET | "Next: [Test]" (CMP-03) + 3 thẻ gợi ý (CMP-07) |

Chi tiết schema và lỗi riêng màn → `docs/api/SCR-APP-01-api.md`.

## 6. Tracking

| Event | Note |
|---|---|
| `screen_active` · `app_home` | route hiện |
| ft_checkin start / enable / submit | start khi CMP-05 hiện và hôm nay chưa check-in, hoặc khi CMP-08 hiện (tự hiện lần đầu, hỏi lại khi câu đồng ý đổi major, mở từ CMP-09 hay `/app#checkin`); CMP-09 không bắn · enable khi bấm ở CMP-08: "Turn on check-ins" + API-ME-02 OK → `success`, "Not now" → `declined` · submit khi API-APP-02 trả về, chỉ gửi `streak_days`, KHÔNG gửi mức đã chọn (BR-DASH-04) |
| ft_challenge start / day_complete | start khi thẻ ngày thử thách hiện (Plus), param `day` · day_complete khi API-APP-03 trả về |
| ft_unlock start | `surface=app_home`; bắn khi CMP-04 ở dạng "Unlock report" hoặc CMP-06 ở dạng Free hiện lần đầu trong phiên |

## 7. Business rules & edge cases

| BR-ID | Rule | Basis |
|---|---|---|
| BR-DASH-01 | Check-in 1 lần/ngày nghiệp vụ (BR-APP-09), sửa được trong ngày; streak = số ngày liên tiếp có check-in; lỡ 1 ngày → streak về 0 với copy trung tính "New streak starts today." | RS·F-21 · BR-APP-09 · EV-TLW-210 |
| BR-DASH-02 | Thử thách: mở ngày N khi đã qua N−1 ngày nghiệp vụ từ ngày bắt đầu; làm bù được; nội dung theo type của kết quả gần nhất (TD-02) | RS·F-21 · TD-02 · EV-TLW-213 |
| BR-DASH-03 | Free thấy thẻ thử thách khoá kèm mô tả thật, không popup | Q-15 · SYS-ENTITLEMENT · RS·F-17 |
| BR-DASH-04 | Giá trị check-in không gửi analytics (BR-APP-05) | BR-APP-05 · cong-nghe-loi §4 |
| BR-DASH-05 | Check-in cần consent tường minh. CMP-08 (bước bật check-in "Turn on daily check-ins?", copy nguyên văn ở `legal-consent` §3d) tự hiện khi tài khoản chưa trả lời lần nào, và là bước bắt buộc mỗi lần bật lại sau khi đã tắt ở SCR-ACC-01 (mở từ CMP-09 hoặc `/app#checkin`). "Turn on check-ins" → API-ME-02 `checkins: { enabled: true, consentVersion }` (server lưu `checkin_consent_version` + thời điểm) rồi mới có CMP-05; chưa bật thì API-APP-02 trả 422 `consent_required`. "Not now" → API-ME-02 `checkins: { dismissed: true, consentVersion }` → CMP-09 (thẻ mời bật): streak + dải "Last 7 days" ẩn, phần còn lại của dashboard dùng bình thường. Không popup; CMP-08 không tự mở lại sau khi user đã trả lời (trừ một lần khi câu đồng ý đổi major, BR-DASH-06) | Q-22 · legal-consent §3d · SYS-CONSENT |
| BR-DASH-06 | Đổi câu đồng ý check-in (`checkinConsentVersion`, dạng `major.minor`). Đổi lớn (mục đích hoặc nơi dữ liệu đi mở rộng) → tăng major → lần vào kế tiếp, tài khoản đang bật với major cũ được hỏi lại bằng CMP-08 (`checkin.state` = `reask`); chưa đồng ý lại thì tạm dừng check-in mới (API-APP-02 422 `consent_required`), lịch sử cũ giữ nguyên tới khi user tắt ở SCR-ACC-01 (tắt là xoá); "Not now" lúc đó → CMP-09 biến thể tạm dừng (`paused`), không hỏi lặp. Đổi nhỏ (chỉ sửa câu chữ cho rõ) → tăng minor, không hỏi lại; server nhận `consentVersion` cùng major (khác minor vẫn nhận) | SYS-CONSENT · Q-22 |

| EC-xx | Tình huống | Handling | Basis |
|---|---|---|---|
| EC-01 | Check-in sát lúc chuyển ngày | server tính ngày nghiệp vụ theo timezone tài khoản lúc nhận request; widget cập nhật theo phản hồi | BR-APP-09 |
| EC-02 | Vừa đổi timezone ở SCR-ACC-01 | áp dụng từ ngày nghiệp vụ kế tiếp; streak hôm nay không đổi | BR-ACC-03 |
| EC-03 | Hai tab cùng check-in | idempotent theo `userId` + ngày; lần sau ghi đè giá trị lần trước | 00-quy-uoc-api §5 |
| EC-04 | Mất mạng khi chọn mức check-in | lựa chọn hiện ngay rồi trả về giá trị đã lưu khi request lỗi; hiện "We couldn't save your check-in." + "Try again" (gửi lại mức vừa chọn, không tạo bản trùng) | GC-ScaleInput · 00-quy-uoc-api §5 |
| EC-05 | Ngày bắt đầu thử thách | là ngày nghiệp vụ user bấm "Mark as done" ngày 1 lần đầu; trước đó chỉ ngày 1 mở | BR-DASH-02 · EV-TLW-213 |
| EC-06 | Làm bài mới giữa thử thách | ngày chưa mở lấy nội dung theo kết quả mới nhất; ngày đã mở giữ nguyên nội dung | BR-DASH-02 · TD-02 |
| EC-07 | Kết quả gần nhất là bài `sensitive` | thử thách lấy từ kết quả gần nhất KHÔNG `sensitive`; CMP-04 không hiện type | Q-06 · BR-REP-02 |
| EC-08 | Plus hết kỳ giữa thử thách, hoặc Plus được rút trong 14 ngày (quyền kết thúc ngay, BR-APP-14) | CMP-06 về biến thể Free, tiến độ giữ nguyên; có Plus lại thì làm tiếp từ ngày đang dở | SYS-ENTITLEMENT · BR-APP-14 |
| EC-09 | Xong 30/30 ngày | "You finished the 30-day challenge."; MVP không có vòng mới | in-house |
| EC-10 | Đã thanh toán nhưng webhook chưa về | CMP-04 hiện "Confirming your payment…", không có nút mua để tránh mua trùng | SYS-ENTITLEMENT · cong-nghe-loi §3 |
| EC-11 | Vào ngay sau khi đăng nhập đã khôi phục tài khoản chờ xoá (`accountRestored` / `restored=1`) | hiện một lần overlay "Welcome back — your account has been restored." (kiểu `overlay`, SYS-NAV §2), không chặn thao tác; overlay do shell app hiện nên trang đích khác (khi có `next`) cũng có (SYS-AUTH) | BR-ACC-06 · SYS-AUTH |
| EC-12 | Tài khoản chưa trả lời bước bật check-in (`checkin.state` = `ask`, gồm mọi tài khoản mới) | CMP-08 thay chỗ CMP-05, không popup, widget khác vẫn dùng được; chỉ sau "Turn on check-ins" (API-ME-02 OK) mới có CMP-05 | Q-22 · BR-DASH-05 |
| EC-13 | "Not now" | CMP-09 thay chỗ; streak + dải 7 ngày ẩn; API-ME-02 `checkins: { dismissed: true, consentVersion }` ghi lại câu trả lời (không đổi dữ liệu) để lần sau không tự mở CMP-08 (CMP-08 mở từ CMP-09 thì "Not now" không gọi API); API-ME-02 lỗi → vẫn CMP-09, không copy lỗi, lần tải sau có thể hiện lại CMP-08 | BR-DASH-05 |
| EC-14 | "Turn on check-ins" lỗi (mất mạng / 5xx) | CMP-08 giữ nguyên + "We couldn't turn on check-ins. Please try again."; bấm lại an toàn (API-ME-02 idempotent theo giá trị) | 00-quy-uoc-api §5 · tieu-chuan-chung §2 |
| EC-15 | Câu đồng ý đổi major khi CMP-08 đang mở (trang mở từ trước) | API-ME-02 422 `consent_outdated` → tải lại trang, CMP-08 hiện bản mới + "This notice has changed. Please review it and try again."; chưa bật. Chỉ đổi minor thì server vẫn nhận, không lỗi | BR-DASH-06 · SCR-ACC-01-api |
| EC-16 | Check-in vừa bị tắt ở SCR-ACC-01 (tab khác) rồi chọn mức ở tab dashboard cũ | API-APP-02 422 `consent_required` → tải lại API-APP-01 → CMP-09; mức vừa chọn không được lưu | BR-ACC-07 · BR-DASH-05 |
| EC-17 | Bật lại sau khi đã tắt (từ CMP-09 hoặc `/app#checkin`) | CMP-08 như lần đầu, lưu version + thời điểm mới; streak bắt đầu từ 0 ("New streak starts today."), dải "Last 7 days" trống vì lịch sử đã xoá cứng | BR-ACC-07 · BR-DASH-01 |
| EC-18 | Mở `/app#checkin` (NAV-ACC-01-8) | check-in chưa chạy (`ask` · `off` · `reask` · `paused`) → CMP-08 mở sẵn, cuộn tới và focus vào tiêu đề, ft_checkin start bắn; đang chạy (`on`) → chỉ cuộn tới CMP-05 | BR-ACC-07 · BR-DASH-05 |
| EC-19 | Câu đồng ý đổi major khi tài khoản đang bật (`reask`) | lần vào kế tiếp: CMP-08 bản mới + dòng "We've updated how we use check-ins. To keep checking in, review the changes below." thay chỗ CMP-05; check-in mới tạm dừng (API-APP-02 422 `consent_required`), lịch sử giữ nguyên; "Turn on check-ins" → API-ME-02 lưu version mới → tải lại API-APP-01 → CMP-05 với lịch sử cũ (ngày tạm dừng tính như ngày không check-in, BR-DASH-01) | BR-DASH-06 |
| EC-20 | "Not now" khi được hỏi lại (`paused`) | API-ME-02 `checkins: { dismissed: true, consentVersion }` → CMP-09 biến thể tạm dừng ("Daily check-ins are paused." + "Your past check-ins are kept until you turn check-ins off in Account."); không hỏi lặp, không email nhắc (BR-ACC-08); lịch sử giữ tới khi user tắt ở SCR-ACC-01 (tắt là xoá) hoặc đồng ý bản mới từ CMP-09 | BR-DASH-06 · BR-ACC-07 |

## 8. Responsive deltas

| Aspect | 390 (gốc) | 768 | 1280 |
|---|---|---|---|
| Lưới widget | 1 cột theo thứ tự ở §3 | 2 cột: check-in · tiến độ / report · thử thách | như 768, container `layout.max-width` |
| Check-in 5 lựa chọn | 1 hàng, mỗi ô ≥ 44 px, nhãn chữ dưới icon; phóng to 200% thì thành 5 hàng dọc (GC-ScaleInput) | như 390 | như 390, ô rộng hơn |
| CMP-08 · CMP-09 | 2 nút xếp dọc, full width ("Turn on check-ins" trên); CMP-09 một dòng chữ + nút full width | 2 nút cùng hàng, rộng theo chữ | như 768 |
| Gợi ý bài | 3 thẻ xếp dọc | 2 cột (thẻ thứ 3 xuống hàng) | 3 cột |

## 9. Keyboard & focus

Nhóm check-in theo GC-ScaleInput `emoji5`: là `radiogroup`, mũi tên chỉ di chuyển focus, `Space`/`Enter` chọn (chọn = lưu). Phím số 1–5 chỉ có tác dụng khi focus đang nằm trong nhóm (`keyboardScope = group`, khác SCR-TEST-01), để không lưu nhầm khi đang thao tác widget khác. Sau "Mark as done", trạng thái "Done" được đọc qua `aria-live="polite"`, focus giữ trên thẻ. CMP-08 tự hiện lần đầu thì không cướp focus; mở từ CMP-09 hoặc `/app#checkin` thì cuộn tới và focus vào tiêu đề "Turn on daily check-ins?" (`tabindex="-1"`). Bật xong → focus vào nhóm check-in của CMP-05 (nhãn nhóm là câu hỏi); "Not now" → focus vào nút "Turn on daily check-ins" của CMP-09. Còn lại theo `tieu-chuan-chung §5`.

## 10. AI Notices
- Câu hỏi check-in cố định trong MVP, dùng bộ nhãn mặc định của GC-ScaleInput `emoji5`. Đổi câu hỏi theo ngày nằm ngoài scope.
- GC-TestCard §5 ghi SCR-APP-01 dùng cả variant `sensitive`, nhưng màn này bỏ bài `sensitive` khỏi gợi ý nên thực tế chỉ dùng `standard`.
- Bỏ bài `sensitive` khỏi gợi ý (CMP-03 "Next", CMP-07) và khỏi nguồn nội dung thử thách là đề xuất in-house theo Q-06, cần duyệt.
- Poll cộng đồng ngoài scope MVP (Q-15 · final-features §8).
- Consent check-in (Q-22) đã chốt 2026-09-28, giải quyết D-12. Tiêu đề, thân và 2 nút của CMP-08 lấy nguyên văn ở `legal-consent` §3d. "Daily check-ins are off." · "Daily check-ins are paused." · "Your past check-ins are kept until you turn check-ins off in Account." · "Turn on daily check-ins" · "We've updated how we use check-ins. To keep checking in, review the changes below." · "We couldn't turn on check-ins. Please try again." · "This notice has changed. Please review it and try again." là copy mới, cần review cùng câu đồng ý.
- CMP-08 chỉ tự mở khi tài khoản chưa trả lời lần nào, hoặc một lần khi câu đồng ý đổi major (BR-DASH-06). Sau "Not now" hoặc sau khi tắt ở SCR-ACC-01, user tự mở lại từ CMP-09 hoặc từ link ở SCR-ACC-01: không hỏi lặp.
- Rule đổi version câu đồng ý check-in (major: hỏi lại + tạm dừng check-in mới, giữ lịch sử; minor: không hỏi lại) ghi ở SYS-CONSENT; BR-DASH-06 là phần áp vào màn này. `checkin.state` = `reask` / `paused` cần server so major của version đã lưu với bản hiện hành.
- Tham số lọc của API-CAT-01 dùng ở đây (`excludeTaken` · `includeSensitive`) theo bộ tham số hợp nhất ở `api-mapping` §1.
