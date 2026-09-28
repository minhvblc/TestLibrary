# [SCR-PUB-06] Trợ giúp
**Meta**

| id | module | doc level | platforms | route | access | indexable | viewports | related FLOW | status | design | tracking | api | Evidence / visual basis |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| SCR-PUB-06 | PUB | Short | Web | `/help` | public | index | 390 · 768 · 1280 | FLOW-quan-ly-huy-gia-han | Draft | (sau design) | `tracking-events.md` → `help` · ft_contact | §5 (inline) | **EV-TLW-047 · EV-TLW-049 · EV-TLW-046 · SC-TLW-08 · SC-TLW-10 · basis RS·F-11 · F-14** |

**Changelog** (mới nhất trước)
- 2026-09-27 · v1 · claude (subagent) · khởi tạo từ blueprint.

## 1. Purpose

Một trang gom FAQ, phần giải thích cách chấm điểm (`#scoring`), form liên hệ và lối tắt quản lý / huỷ gói. Đối thủ tách FAQ, Contact và trang huỷ thành ba nơi, và huỷ phải qua email + link xác minh (SC-TLW-08 · SC-TLW-10 · SC-TLW-07; RS·F-11). Ở đây "Manage or cancel your plan" dẫn thẳng tới Gói & thanh toán (đăng nhập nếu cần) để huỷ một bước (BR-APP-04). Mục "How we score" là đích của link giải thích điểm từ trang chủ và trang kết quả (RS·F-14). · basis RS·F-11 · F-14 · BR-APP-04

## 2. Điều hướng

### 2.1 Vào

| Vào qua | Từ | Trigger |
|---|---|---|
| NAV-PUB-01-4 | SCR-PUB-01 | "How we score" (`#scoring`) |
| NAV-TEST-02-6 | SCR-TEST-02 | "How scoring works" (`#scoring`) |
| shell | "Help" ở header public + drawer @390 | SYS-NAV §1 |
| entry ngoài | URL trực tiếp · SEO | SYS-NAV §4 |

### 2.2 Ra

| NAV-ID | Tới (SCR-ID · tham số) | Trigger (CMP-ID "nhãn") | Kiểu | URL / history | Animation | Back / đóng → | Guard / điều kiện | Nền tảng | Basis |
|---|---|---|---|---|---|---|---|---|---|
| NAV-PUB-06-1 | SCR-PAY-03 | CMP-05 "Manage or cancel your plan" | push | `/account/billing` (push) | mặc định | back trình duyệt → SCR-PUB-06 | chưa đăng nhập → SCR-AUTH-01 (`next=/account/billing`), xong quay lại | Web | BR-APP-04 |
| NAV-PUB-06-2 | SCR-PUB-05 · `doc=subscriptions` | CMP-06 "Refund policy" | push | `/legal/subscriptions` (push) | mặc định | back trình duyệt → SCR-PUB-06 | — | Web | RS·F-29 |
| NAV-PUB-06-3 | (cùng màn) gửi form | CMP-04 "Send message" | inline | không đổi URL | mặc định | — | form hợp lệ | Web | in-house |

## 3. Layout & components

- **Bố cục @390 (top→bottom):**
  - header;
  - H1 "Help" + hai liên kết nhanh "Manage or cancel your plan" · "Refund policy";
  - FAQ 3 nhóm (accordion);
  - mục "How we score" (`#scoring`);
  - form liên hệ;
  - khối liên hệ pháp nhân;
  - footer.
  - Hai liên kết nhanh đặt ngay dưới H1 vì huỷ gói và hoàn tiền là hai việc người vào trang trợ giúp hay tìm nhất (RS·F-11).

| CMP-ID | Component | Type / GC- | Behavior & rules | Basis (EV / Q / in-house) |
|---|---|---|---|---|
| CMP-01 | Header | GC-SiteHeader (public) | theo GC; mục "Help" ở trạng thái đang chọn | SYS-NAV §1 |
| CMP-02 | FAQ | accordion theo nhóm + JSON-LD `FAQPage` | 3 nhóm "Tests & scoring" · "Billing & cancellation" · "Privacy"; mở được nhiều mục cùng lúc. Câu hỏi đề xuất: "Is this a diagnosis?" · "How long does a test take?" (Tests & scoring) · "What's free?" · "How does Plus renew?" · "How do I cancel?" · "Can I get a refund?" (Billing & cancellation) · "Who can see my answers?" · "How do I delete my data?" (Privacy). Câu trả lời là văn bản thuần, không ghi con số giá, không hứa gói hay tính năng không có trên trang giá | EV-TLW-047 · RS·F-06 · tieu-chuan-chung §8 |
| CMP-03 | "How we score" | mục có anchor `#scoring` | H2 "How we score"; nội dung: điểm tính ở server từ chính câu trả lời, có câu đảo chiều, cùng câu trả lời + cùng version thì cùng kết quả, mỗi kết quả ghi "Scored with version [v]"; cách đọc thanh điểm (%) | BR-APP-07 · RS·F-14 · TD-01 |
| CMP-04 | Form liên hệ | form | H2 "Contact us"; "Topic" (select: "Tests & results" · "Billing & cancellation" · "Privacy & data" · "Something else", mặc định "Something else") · "Email" · "Message" (textarea, đếm "[k]/2000") · nút "Send message". Lỗi theo field: "Enter a valid email address." · "Please write at least 20 characters." · "Please keep your message under 2000 characters.". Gửi xong: form được thay bằng "Message sent. We'll reply to [email]." | BR-PUB-12 · EV-TLW-049 |
| CMP-05 | Link quản lý gói | link | "Manage or cancel your plan" → `/account/billing` (NAV-PUB-06-1) | BR-APP-04 · RS·F-11 |
| CMP-06 | Link chính sách hoàn tiền | link | "Refund policy" → `/legal/subscriptions` (NAV-PUB-06-2) | RS·F-29 · Q-18 |
| CMP-07 | Khối liên hệ pháp nhân | khối địa chỉ | tên pháp nhân + địa chỉ + "support@[domain]" (link `mailto:`); cùng dữ liệu với SCR-PUB-05 CMP-05 | Q-05 · RS·F-12 · EV-TLW-049 |
| CMP-08 | Footer | GC-SiteFooter | theo GC | SYS-NAV §1 |

## 4. States

| State | Trigger | Hiển thị | EV / basis |
|---|---|---|---|
| Default | luôn (nội dung tĩnh) | đủ CMP-01…08, form trống | EV-TLW-047 |
| Loading | đang gửi form (API-HELP-01) | nút "Send message" có spinner + disable; nội dung form giữ nguyên | tieu-chuan-chung §3 |
| Empty | N/A — FAQ tĩnh, luôn có nội dung | — | in-house |
| Error | API-HELP-01 lỗi mạng / 5xx / timeout | "We couldn't send your message. Please try again or email support@[domain]."; form giữ nguyên nội dung | tieu-chuan-chung §2 |
| Locked | N/A — trang public | — | 00-overview §3 |

## 5. API

| API | Method | When called |
|---|---|---|
| API-HELP-01 | POST | bấm "Send message" khi form hợp lệ; body `topic` · `email` · `message`; `Idempotency-Key` = UUID sinh khi form hiện, gửi lại sau lỗi dùng cùng key; đã đăng nhập thì server gắn tài khoản từ `tl_session`, client không gửi id |

Lỗi riêng: 400 theo field → copy lỗi ở CMP-04; 429 (quá 5 tin/giờ/IP) → "Too many requests. Please wait a moment and try again.". Còn lại theo `00-quy-uoc-api` §4.

## 6. Tracking

| Event | Note |
|---|---|
| `screen_active` · `help` | sau consent |
| ft_contact · start | form liên hệ hiện (lần đầu vào viewport) |
| ft_contact · submit | API-HELP-01 trả về (success / fail); param `topic` = `tests` / `billing` / `privacy` / `other`; không gửi email hay nội dung tin |

## 7. Business rules & edge cases

| BR-ID | Rule | Basis |
|---|---|---|
| BR-PUB-12 | Form: email bắt buộc + hợp lệ; message 20–2000 ký tự; chống spam bằng rate limit (5/giờ/IP), không CAPTCHA bên thứ ba | in-house · tieu-chuan-chung §9 (0 request bên thứ ba trước consent) |

| EC-xx | Tình huống | Handling | Basis |
|---|---|---|---|
| EC-01 | Mở thẳng `/help#scoring` | cuộn tới CMP-03 và focus heading "How we score"; nội dung có sẵn trong SSR | RS·F-14 |
| EC-02 | Bấm "Send message" hai lần / mạng chập chờn | nút disable khi đang gửi; gửi lại dùng cùng `Idempotency-Key` → 409 coi là thành công, không tạo hai tin | 00-quy-uoc-api §4 · §5 |
| EC-03 | Một IP gửi quá 5 tin trong một giờ | 429 + copy của tieu-chuan-chung §2; form giữ nội dung | BR-PUB-12 |
| EC-04 | Khách đã mua nhưng chưa đăng nhập lần nào bấm "Manage or cancel your plan" | guard → `/login?next=/account/billing`; đăng nhập bằng email đã dùng khi thanh toán (tài khoản được tạo từ email đó) | SYS-AUTH · Q-11 |
| EC-05 | Người dùng Free bấm "Manage or cancel your plan" | SCR-PAY-03 hiện trạng thái Free, không lỗi | BR-APP-04 |
| EC-06 | JavaScript tắt | FAQ và "How we score" đọc được (SSR, accordion dùng `<details>`); form cần JS nên hiện "Please enable JavaScript to send a message, or email support@[domain]." | cong-nghe-loi §3 |

## 8. Responsive deltas

| Aspect | 390 (gốc) | 768 | 1280 |
|---|---|---|---|
| Liên kết nhanh | xếp dọc, full width | 2 cột | 2 cột |
| FAQ | 1 cột accordion | 1 cột accordion | 2 cột: danh sách nhóm dính bên trái, câu hỏi bên phải |
| Form liên hệ + khối pháp nhân | xếp chồng, full width | form rộng tối đa 560 | 2 cột: form + khối pháp nhân |

## 9. Keyboard & focus

Mỗi câu hỏi FAQ là `button` có `aria-expanded`; Enter/Space mở hoặc đóng. Submit lỗi → focus ô lỗi đầu tiên. Gửi xong → focus vào dòng xác nhận (`aria-live="polite"`). Còn lại theo `tieu-chuan-chung §5`.

## 10. AI Notices
- Câu hỏi FAQ và các lựa chọn "Topic" là đề xuất. Câu trả lời về giá, gia hạn, hoàn tiền phải lấy từ `doc=subscriptions` + GC-RenewalDisclosure, không viết riêng, để khỏi lệch nhau như đối thủ (RS·F-06 · F-29).
- API-HELP-01 chuyển tin tới hộp thư hỗ trợ. Kênh nhận (vendor email của Q-16 hay một helpdesk) chưa chốt.
- Rate limit 5/giờ/IP có thể chặn nhầm nhiều người dùng chung IP (văn phòng, trường học). Cần theo dõi tỉ lệ 429 sau launch.
