# GC-SensitiveNotice — disclaimer không-chẩn-đoán + nguồn hỗ trợ cho bài `sensitive`
**Changelog** (mới nhất trước)
- 2026-09-28 · v1.1 · claude-opus-5-5 · quyết định 2026-09-28 (AI · uỷ quyền human): danh sách §4 là bản ra mắt (Q-23), trạng thái từng hàng "chờ verify số + clinical review trước launch" (`bang-quyet-dinh` §2 #4); **không định vị người dùng**: `full` luôn hiện đủ danh sách, `cta` trỏ danh bạ quốc tế (bỏ prop `country` và `region-note`), để trang render sẵn (SSG, Q-09) và bản in / PDF giống nhau ở mọi nơi; SCR-TEST-01 dùng link `cta` cho dòng phụ 18+ (Q-21); AI Notices cập nhật.
- 2026-09-27 · v1 · claude (subagent) · khởi tạo.

## 1. Anatomy (CMP con)

Khối thông báo bình tĩnh, luôn hiện trên mọi bề mặt của bài có cờ `sensitive` (BR-APP-06, Q-06). Khối này làm hai việc: nói rõ đây không phải chẩn đoán, và chỉ đường tới hỗ trợ khẩn cấp. Không định vị người dùng: khối giống nhau ở mọi nơi (Q-23).

| CMP con | Thành phần | Nội dung / copy verbatim (en-US) | Ghi chú |
|---|---|---|---|
| `disclaimer` | câu đầu, `type.body`, đậm vừa | "This is a self-reflection tool, not a diagnosis." | trùng câu ở bước consent SCR-TEST-01 CMP-03 |
| `support-prompt` | câu thứ hai (chỉ `full`) | "If you're struggling or thinking about harming yourself, please reach out now." | |
| `emergency-line` | câu thứ ba (chỉ `full`) | "If you're in immediate danger, call your local emergency number." | không ghi số cụ thể vì mỗi nước một số |
| `resources` | danh sách đủ các nguồn ở §4, theo thứ tự bảng (chỉ `full`) | mỗi dòng: tên nước + tên tổ chức + cách liên hệ (`tel:` / `sms:`) + link website; dòng cuối: "Outside these countries? Find a helpline in your country." → danh bạ quốc tế | dữ liệu tĩnh build-time, có version; bản ra mắt ở §4 (Q-23); **chờ verify số + clinical review trước launch** (`bang-quyet-dinh` §2 #4) |
| `cta` | link dạng nút, external, tab mới | "Get support now" | → danh bạ quốc tế (Find A Helpline), vì không định vị người dùng. Cùng đích với link "get support now" trong dòng phụ 18+ của SCR-TEST-01 CMP-03 (BR-TEST-11) |
| `compact-line` | 1 dòng (chỉ `compact`) | "Not a diagnosis · Get support now" | "Get support now" là link external giống `cta` |

Khung: nền `color.sensitive-bg`, chữ `color.text`, `radius.md`, đệm `space.4`. Không dùng `color.danger`, không màu đỏ, không icon cảnh báo.

## 2. Props / variants

| Variant | Khi dùng | Nội dung |
|---|---|---|
| `full` | SCR-PUB-03 (trước nút "Start test") · SCR-TEST-02 · SCR-APP-03 (cả bản in / PDF) | `disclaimer` · `support-prompt` · `emergency-line` · `resources` · `cta` |
| `compact` | SCR-TEST-01, ngay dưới thanh trên, phía trên câu hỏi | `compact-line`: "Not a diagnosis · Get support now" |

| Prop | Kiểu | Mặc định | Ý nghĩa |
|---|---|---|---|
| `variant` | `full` · `compact` | `full` | |
| `resourcesVersion` | string | theo build | phiên bản danh sách nguồn đã được review |
| `printMode` | boolean | false | true khi render bản in / PDF (`?print=1`, TD-03) → in URL và số điện thoại dạng chữ |

## 3. States (5) + hover / focus / disabled

| State | Khi nào | Hiển thị / hành vi | Basis |
|---|---|---|---|
| Default | bài `sensitive` | đủ CMP con theo variant, cùng một nội dung ở mọi nơi | BR-APP-06 · Q-23 |
| Loading | N/A — không có request: danh sách nguồn đóng gói lúc build; khối hiện ngay cả khi offline | — | cong-nghe-loi §3 |
| Empty | một nguồn chưa qua review (chưa được phép ship) | bỏ dòng đó khỏi `resources`; danh bạ quốc tế và các câu chữ luôn còn | Q-06 · Q-23 |
| Error | N/A — trang ngoài không vào được thì nằm ngoài kiểm soát của mình; câu chữ và `emergency-line` vẫn luôn hiện | — | BR-APP-06 |
| Locked | N/A — nội dung an toàn không bao giờ bị khoá: hiện cho khách, Free, Plus, và cả trong state Locked của SCR-APP-03 | — | BR-APP-06 · BR-REP-06 |
| hover | con trỏ trên link / nút | gạch chân; nền nút đậm hơn một bậc; `motion.fast` | in-house |
| focus | focus bàn phím | `focus.ring` | tieu-chuan-chung §5 |
| disabled | N/A — không có control nào bị disable | — | in-house |

## 4. Behavior & rules (BR nếu có)

GC hiện thực BR-APP-06 và BR-PUB-06; không có BR riêng.

| Rule | Mô tả | Basis |
|---|---|---|
| Luôn hiện trên bài `sensitive` | có trên trang bài, trang làm bài, kết quả, report và PDF; `full` không đóng được, không thu gọn được | BR-APP-06 · BR-PUB-06 · Q-06 |
| Vị trí | nằm trong màn hình đầu tiên, TRƯỚC nút "Start test" và mọi CTA mua; không đặt dưới khối mở khoá | BR-PUB-06 · in-house |
| Chỉ bài `sensitive` | không hiện ở bài thường để người dùng không nhờn cảnh báo | BR-APP-06 |
| Không phụ thuộc mạng | danh sách nguồn là dữ liệu tĩnh build-time, không gọi API, vẫn hiện khi offline (SCR-TEST-01) | cong-nghe-loi §3 · in-house |
| Không định vị | không dùng IP, header nước của CDN, locale hay timezone để chọn nguồn: `full` luôn hiện đủ danh sách §4 (ngắn, 5 dòng) theo cùng thứ tự, `cta` trỏ danh bạ quốc tế. Nhờ vậy trang render sẵn (SSG, Q-09), route render phía client, bản in / PDF và bản offline giống hệt nhau, không lộ vị trí, không hiện nhầm đường dây của nước khác vì đoán sai | Q-23 · Q-09 · BR-APP-05 |
| Link external | mở tab mới với `rel="noopener noreferrer"` + `referrerpolicy="no-referrer"` để trang ngoài không thấy URL bài `sensitive`; nhãn có icon external + chữ ẩn "(opens in a new tab)"; số điện thoại dùng `tel:` / `sms:` | BR-APP-05 · BR-APP-06 · tieu-chuan-chung §5 |
| Không tracking | route `sensitive` không tải analytics; bấm "Get support now" không ghi log phía client | BR-APP-06 · tracking-events |
| Không theo điểm | nội dung như nhau bất kể điểm hay type (MVP); không suy đoán tình trạng của người dùng | Q-06 |
| Bản in / PDF | `printMode` hiện đủ câu chữ và in URL + số dạng chữ (link không bấm được trên giấy) | TD-03 · BR-REP-04 |
| Đổi câu chữ / nguồn | chỉ khi có clinical/legal review; mỗi nguồn ghi ngày review; đổi thì tăng `resourcesVersion` | Q-06 · Q-23 |

Danh sách nguồn bản ra mắt (Q-23, đã chốt) — **từng số / website chưa xác minh; KHÔNG ship trước khi verify + clinical review** (`bang-quyet-dinh` §2 #4). Tên, số và website dưới đây là thông tin phổ biến; chưa có nguồn nào trong research xác nhận.

| Vùng (mã nước) | Nguồn | Liên hệ hiển thị (en-US) | Website | Trạng thái |
|---|---|---|---|---|
| US | 988 Suicide & Crisis Lifeline | "Call or text 988" | 988lifeline.org | chờ verify số + clinical review trước launch |
| CA | 9-8-8 Suicide Crisis Helpline | "Call or text 988" | 988.ca | chờ verify số + clinical review trước launch |
| GB · IE | Samaritans | "Call 116 123" | samaritans.org | chờ verify số + clinical review trước launch |
| AU | Lifeline Australia | "Call 13 11 14" | lifeline.org.au | chờ verify số + clinical review trước launch |
| mọi vùng khác / không xác định | Find A Helpline (danh bạ quốc tế) | "Find a helpline in your country" | findahelpline.com | chờ verify (đơn vị vận hành, phạm vi, điều khoản dẫn link) + clinical review trước launch |

## 5. Dùng ở màn nào (SCR-IDs)

| SCR-ID | Variant | CMP ở màn | Ghi chú |
|---|---|---|---|
| SCR-PUB-03 | `full` | CMP-06 | trước CMP-03 "Start test" (BR-PUB-06) |
| SCR-TEST-01 | `compact` | CMP-09 | dưới thanh trên; bước consent CMP-03 đã có đủ câu disclaimer, và dòng phụ 18+ của CMP-03 dùng cùng link với `cta` (BR-TEST-11) |
| SCR-TEST-02 | `full` | CMP-09 | ngay dưới thanh trên, trước kết quả và trước khối mở khoá CMP-05; @1280 trải ngang trên cả hai cột |
| SCR-APP-03 | `full` | CMP-07 | ngay dưới header; có cả ở state Locked, và bản in / PDF vẫn giữ khối này |

## 6. Responsive

| Aspect | 390 (gốc) | 768 (`bp.md`) | 1280 (`bp.lg`) |
|---|---|---|---|
| `full` | xếp dọc: câu chữ → nguồn → `cta` rộng hết khối | câu chữ + nguồn bên trái, `cta` bên phải | như 768, rộng theo cột nội dung |
| `compact` | 1 dòng, tự xuống dòng khi hẹp; link đạt `layout.touch-target` (tieu-chuan-chung §5) | 1 dòng | 1 dòng |
| Bản in | — | — | xếp dọc, in đủ URL / số (theo `printMode`) |

## 7. Basis (EV / Q)

| Quyết định | Basis |
|---|---|
| Có bài sức khoẻ tinh thần, kèm bảo vệ | Q-06 (human chốt) · BR-APP-06 |
| Đối thủ không có nguồn hỗ trợ khủng hoảng nào (0 kết quả cho "crisis", "988", "hotline" trong mọi văn bản đã capture) | legal-extract §8 · EV-TLW-043 |
| Tên bài trung thực, không đặt tên "mềm" để che slug lâm sàng như đối thủ | RS·F-04 · EV-TLW-052 · BR-PUB-06 |
| Disclaimer đặt ngay trên bề mặt bài (đối thủ chỉ ghi trong FAQ / Terms) | EV-TLW-019 · EV-TLW-043 |
| Nhóm người dùng nhạy cảm cần disclaimer + hướng dẫn hỗ trợ | P-05 · research-synthesis §U |
| Không gửi dữ liệu bài `sensitive` cho bên thứ ba, kể cả qua referrer | BR-APP-05 · RS·F-13 |
| Danh sách ra mắt (US · CA · GB/IE · AU · còn lại Find A Helpline), hiện đủ ở mọi nơi, không định vị | Q-23 |

## 8. AI Notices
- Viết bởi claude (subagent) ở Phase 4 từ spec blueprint + BR-APP-06 + SYS-CONSENT.
- **Danh sách §4 là bản ra mắt (Q-23), nhưng số và website CHƯA được xác minh.** Mọi hàng "chờ verify số + clinical review trước launch"; không ship bài `sensitive` trước khi xong `bang-quyet-dinh` §2 #4. Số và tên tổ chức có thể đổi theo thời gian: cần chu kỳ review định kỳ, đặt cùng lần clinical review.
- Câu "If you're in immediate danger, call your local emergency number." là bổ sung theo hướng dẫn safe messaging thông dụng, cần clinical review cùng các câu khác.
- Không định vị (Q-23, orchestrator chốt 2026-09-28 sau khi thấy cách lấy vùng qua header CDN xung đột với trang render sẵn SSG của SCR-PUB-03 và cần thêm field ở 3 API). Nếu sau này thêm nhiều nước, cân nhắc lại: danh sách dài quá thì mới cần chọn theo vùng.
- Câu hỏi cho clinical review (Q-06): có nên nhấn mạnh hơn khi điểm cao (vd bài về tâm trạng) không. MVP không làm.
- Link tới từng nguồn (`tel:`, `sms:`, website) thuộc cùng loại cạnh external "trang nguồn hỗ trợ khủng hoảng" đã khai ở §2.2 của các màn dùng GC.
