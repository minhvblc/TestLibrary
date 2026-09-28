# GC-ScaleInput — thang chọn 5 mức (`likert5` · `emoji5`)
**Changelog** (mới nhất trước)
- 2026-09-27 · v1 · claude (subagent) · khởi tạo.

## 1. Anatomy (CMP con)

Một nhóm 5 lựa chọn có thứ tự, ngữ nghĩa radio group, trả về giá trị 1–5. GC chỉ hiển thị và báo giá trị được chọn (`onCommit`). Việc lưu, chuyển câu hay gọi API là của màn.

| CMP con | Thành phần | Nội dung / copy verbatim (en-US) | Ghi chú |
|---|---|---|---|
| `group` | radiogroup | accessible name = nội dung câu hỏi (`aria-labelledby`) | câu hỏi do màn render (SCR-TEST-01 CMP-04 · SCR-APP-01 CMP-05) |
| `option` × 5 | radio, roving tabindex | `likert5`: "Strongly disagree" · "Disagree" · "Neutral" · "Agree" · "Strongly agree" · `emoji5`: "Not at all" · "A little" · "Somewhat" · "Fairly" · "Very" | giá trị 1–5 theo thứ tự trên; nhãn chữ LUÔN hiện, `type.body` |
| `intensity-mark` | `likert5`: vòng tròn · `emoji5`: icon mặt SVG | không có chữ (`aria-hidden`) | `likert5`: vòng to nhất ở hai đầu, nhỏ nhất ở giữa; màu `color.scale-1` … `color.scale-5` |
| `key-hint` | số nhỏ "1" … "5", `type.label`, chỉ `likert5` @1280 | "1" · "2" · "3" · "4" · "5" | mỗi option có `aria-keyshortcuts` tương ứng |
| `error-slot` | dòng lỗi dưới nhóm, chỉ `emoji5` | copy do màn truyền — SCR-APP-01: "We couldn't save your check-in." + nút "Try again" | gắn `aria-describedby` vào `group` |

Option: nền `color.surface`, viền `color.border`, `radius.md`, đệm `space.3`; khoảng cách giữa option `space.2`.

## 2. Props / variants

| Variant | Khi dùng | Bố cục | Commit |
|---|---|---|---|
| `likert5` | SCR-TEST-01 CMP-05: mọi câu Likert | 5 hàng dọc rộng hết khối, từ trên xuống: 1 "Strongly disagree" → 5 "Strongly agree" | chọn = commit; màn lưu và sang câu kế sau 150 ms (BR-TEST-01) |
| `emoji5` | SCR-APP-01 CMP-05: check-in "How focused do you feel today?" | 5 ô cùng hàng, icon trên nhãn | chọn = commit (màn gọi API-APP-02); sửa được trong cùng ngày nghiệp vụ (BR-DASH-01); không chuyển trang |

| Prop | Kiểu | Mặc định | Ý nghĩa |
|---|---|---|---|
| `variant` | `likert5` · `emoji5` | bắt buộc | |
| `labelledBy` | id | bắt buộc | id của phần tử chứa câu hỏi |
| `value` | 1–5 hoặc null | null | đáp án đã lưu (resume câu cũ / check-in hôm nay); không bao giờ chọn sẵn khi chưa có |
| `labels` | 5 chuỗi | bộ nhãn mặc định theo variant (§1) | màn đổi câu hỏi check-in thì truyền bộ nhãn mới |
| `onCommit` | hàm nhận giá trị 1–5 | bắt buộc | GC không tự lưu, không tự gọi API |
| `keyboardScope` | `page` · `group` | `likert5`: `page` · `emoji5`: `group` | phạm vi nghe phím 1–5 (xem §4) |
| `showKeyHints` | boolean | `likert5` từ `bp.lg`: true | hiện `key-hint` |
| `disabled` | boolean | false | khoá nhập (đang chuyển câu, đang nộp bài) |

## 3. States (5) + hover / focus / disabled

| State | Khi nào | Hiển thị / hành vi | Basis |
|---|---|---|---|
| Default | có câu hỏi | 5 option; chưa chọn, hoặc đang chọn giá trị đã lưu | EV-TLW-054 |
| Loading | câu hỏi / widget đang tải từ 300 ms trở lên | skeleton 5 hàng (`likert5`) hoặc 5 ô (`emoji5`) | tieu-chuan-chung §3 · SCR-TEST-01 §4 |
| Empty | N/A — luôn đủ 5 option; thiếu nhãn là lỗi cấu hình, màn xử lý (SCR-TEST-01 state Empty) | — | SCR-TEST-01 §4 |
| Error | `likert5`: N/A (đáp án lưu local trước, lỗi mạng do màn xử lý); `emoji5`: API-APP-02 lỗi | `emoji5`: trả về giá trị trước đó, `error-slot` hiện "We couldn't save your check-in." + nút "Try again" (gửi lại đúng mức vừa chọn) | cong-nghe-loi §3 · SCR-APP-01 |
| Locked | N/A — `likert5` không render khi bài `sensitive` chưa có consent (BR-TEST-04); `emoji5` có cho mọi tài khoản (quyền `checkin`) | — | BR-TEST-04 · SYS-ENTITLEMENT |
| hover | con trỏ trên option | nền `color.surface-muted`, viền đậm hơn một bậc; `motion.fast` | in-house |
| focus | option đang giữ focus | `focus.ring` quanh cả hàng / ô | tieu-chuan-chung §5 |
| disabled | `disabled = true`, hoặc trong 150 ms chuyển câu | không nhận input, `aria-disabled="true"`; giao diện giữ nguyên, không nhấp nháy | BR-TEST-01 |
| selected | option trùng `value` | vòng tròn / icon tô đặc + icon check + viền `color.accent`, `aria-checked="true"`; không chỉ dựa vào màu | tieu-chuan-chung §5 |

## 4. Behavior & rules (BR nếu có)

GC không có BR riêng. Quy tắc cite BR của SCR-TEST-01 và SCR-APP-01.

| Rule | Mô tả | Basis |
|---|---|---|
| Ngữ nghĩa radio | `role="radiogroup"` + 5 `role="radio"` (hoặc input radio gốc); `aria-checked` theo `value`; tên nhóm = câu hỏi | tieu-chuan-chung §5 |
| Bàn phím | Tab vào nhóm (focus vào option đang chọn, chưa chọn thì option 1); ↑ / ↓ (và ← / →) chỉ di chuyển focus, KHÔNG commit; Space / Enter commit option đang focus; phím 1–5 commit thẳng (1 = "Strongly disagree" hoặc "Not at all") | tieu-chuan-chung §5 · SCR-TEST-01 §5.1 |
| Vì sao mũi tên không commit | ở `likert5`, commit = lưu + sang câu kế; nếu mũi tên commit như radio chuẩn thì mỗi lần bấm mũi tên sẽ nhảy sang câu mới | BR-TEST-01 |
| Phạm vi phím số | `page`: nghe cả trang khi GC đang hiển thị và focus không nằm trong ô nhập chữ (màn làm bài không có ô chữ); `group`: chỉ khi focus nằm trong nhóm (dashboard còn widget khác) | in-house |
| Chống bấm dồn | sau commit, GC khoá nhập tới khi màn đổi câu (150 ms ở SCR-TEST-01); mỗi câu chỉ nhận đúng 1 commit | SCR-TEST-01 §8 · BR-TEST-01 |
| Không chọn sẵn | không option nào được chọn mặc định; khi resume thì hiện đúng đáp án đã lưu | BR-APP-07 · BR-TEST-02 |
| Thứ tự cố định | không đảo thứ tự option giữa các câu; câu đảo chiều do server xử lý khi chấm, GC luôn trả 1–5 theo thứ tự hiển thị | TD-01 · BR-APP-07 |
| Màu không mang nghĩa đúng / sai | dùng `color.scale-1` … `color.scale-5` (thang trung tính), không đỏ ↔ xanh lá; màu chỉ bổ trợ, nhãn chữ mới là nguồn nghĩa | tieu-chuan-chung §5 · EV-TLW-083 |
| Icon `emoji5` | icon SVG của mình (`aria-hidden`), không dùng emoji hệ thống: emoji hiện khác nhau theo OS và screen reader đọc thêm tên emoji | tieu-chuan-chung §5 · in-house |
| Focus sau khi sang câu (`likert5`) | màn chuyển focus vào `group` của câu mới để screen reader đọc câu hỏi + option; tiến độ đọc bằng `aria-live` của màn | tieu-chuan-chung §5 · SCR-TEST-01 §12 |
| `emoji5` lạc quan | hiện lựa chọn ngay khi bấm; API-APP-02 lỗi thì trả về giá trị cũ; bấm lại giá trị khác trong ngày = cập nhật (idempotent theo `userId` + ngày) | BR-DASH-01 · 00-quy-uoc-api §5 |
| Dữ liệu cảm xúc không đi analytics | giá trị của `emoji5` chỉ gửi API-APP-02; ft_checkin chỉ mang `streak_days` | BR-DASH-04 · BR-APP-05 · tracking-events |
| Không event theo từng câu | `likert5` không bắn event cho từng câu | tracking-events · RS·F-13 |

## 5. Dùng ở màn nào (SCR-IDs)

| SCR-ID | Variant | CMP ở màn | Ghi chú |
|---|---|---|---|
| SCR-TEST-01 | `likert5` | CMP-05 | phím 1–5 phạm vi `page`; gợi ý phím @1280 |
| SCR-APP-01 | `emoji5` | CMP-05 | câu "How focused do you feel today?"; 1 lần mỗi ngày nghiệp vụ, sửa được trong ngày (BR-DASH-01) |

## 6. Responsive

| Aspect | 390 (gốc) | 768 (`bp.md`) | 1280 (`bp.lg`) |
|---|---|---|---|
| `likert5` | 5 hàng dọc rộng hết khối, mỗi hàng đạt `layout.touch-target` (tieu-chuan-chung §5) | dọc, trong thẻ câu hỏi có độ rộng tối đa của SCR-TEST-01 | dọc + `key-hint` 1–5 cạnh mỗi hàng |
| `emoji5` | 5 ô cùng hàng chia đều, icon trên nhãn; nhãn dài thì xuống 2 dòng | như 390 | như 390, ô rộng hơn |
| Phóng to chữ 200% | hàng / ô cao lên, không cuộn ngang; `emoji5` chuyển thành 5 hàng dọc nếu không đủ chỗ | như 390 | như 390 |

## 7. Basis (EV / Q)

| Quyết định | Basis |
|---|---|
| Một câu mỗi màn, chọn là sang câu (không nút "Next") | EV-TLW-054 · BR-TEST-01 · CS-04 |
| Dấu cường độ to ở hai đầu, nhỏ ở giữa; nhưng có nhãn chữ cho cả 5 mức (đối thủ chỉ ghi nhãn ở hai đầu và dùng đỏ / xanh lá cho hai cực) | EV-TLW-083 · CS-05 · tieu-chuan-chung §5 |
| Phím 1–5 + mũi tên | tieu-chuan-chung §5 · SCR-TEST-01 §5.1 |
| Check-in 5 lựa chọn một lần mỗi ngày | EV-TLW-209 · EV-TLW-210 · RS·F-21 · Q-15 · CS-12 |
| Giá trị cảm xúc không đi analytics | BR-DASH-04 · BR-APP-05 |

## 8. AI Notices
- Viết bởi claude (subagent) ở Phase 4 từ spec blueprint + SCR-TEST-01 (§3 · §5 · §8).
- Mũi tên chỉ di chuyển focus (không commit) là lệch khỏi hành vi radio mặc định của WAI-ARIA APG, nơi mũi tên vừa di chuyển vừa chọn. Lý do ở §4. Cần test với VoiceOver + NVDA trước FREEZE.
- Bộ nhãn `emoji5` là đề xuất cho câu "How focused do you feel today?" (khác bộ nhãn của đối thủ); SCR-APP-01 CMP-05 đã dùng đúng bộ này. Nếu sau này SCR-APP-01 đổi câu hỏi hay nhãn thì màn là nguồn copy, bảng này cập nhật theo.
- SCR-APP-03 CMP-08 ("Was this report useful?" 1–5) có thể dùng GC này nếu thêm một variant đánh giá; chưa nằm trong scope.
