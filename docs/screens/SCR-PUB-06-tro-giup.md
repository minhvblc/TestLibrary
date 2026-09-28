# [SCR-PUB-06] Trợ giúp
**Meta**

| id | module | doc level | platforms | route | access | indexable | viewports | related FLOW | status | design | tracking | api | Evidence / visual basis |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| SCR-PUB-06 | PUB | Short | Web | `/help` | public | index | 390 · 768 · 1280 | FLOW-quan-ly-huy-gia-han | Draft | (sau design) | `tracking-events.md` → `help` · ft_contact | §5 (inline) | **EV-TLW-047 · EV-TLW-049 · EV-TLW-046 · SC-TLW-08 · SC-TLW-10 · basis RS·F-11 · F-14 · Q-18 · Q-25 · Q-28** |

**Changelog** (mới nhất trước)
- 2026-09-28 · v1.1 · claude-opus-5-5 · Q-18 · Q-25: thêm NAV-PUB-06-4 + CMP-09 "Cancel or withdraw without signing in" → SCR-PAY-05; vào từ NAV-PAY-05-3 (`#contact`); FAQ nhóm Billing & cancellation dùng câu verbatim đã chốt, cùng chữ với pricing-page §4 (Q-16 · Q-18 · Q-24 · Q-27); Q-28: chủ đề "Privacy request" + BR-PUB-15, `topic` = `privacy_request` ở schema API-HELP-01 (§5) và ft_contact; AI Notices. Xác minh "Privacy request" theo token `tl_guest` / email tài khoản (BR-PUB-15), câu phụ chủ đề không bảo dán link kết quả. EC-07 và §1 ghi đủ trường của SCR-PAY-05 (tên, email, mã đơn).
- 2026-09-27 · v1 · claude (subagent) · khởi tạo từ blueprint.

## 1. Purpose

Một trang gom FAQ, phần giải thích cách chấm điểm (`#scoring`), form liên hệ (`#contact`, có chủ đề "Privacy request" — Q-28) và lối tắt quản lý / huỷ gói, kể cả huỷ hoặc rút không cần đăng nhập. Đối thủ tách FAQ, Contact và trang huỷ thành ba nơi, và huỷ phải qua email + link xác minh (SC-TLW-08 · SC-TLW-10 · SC-TLW-07; RS·F-11). Ở đây "Manage or cancel your plan" dẫn thẳng tới Gói & thanh toán (đăng nhập nếu cần) để huỷ một bước (BR-APP-04); "Cancel or withdraw without signing in" mở `/cancel` (SCR-PAY-05) để huỷ gia hạn hoặc rút trong 14 ngày chỉ bằng tên, email và mã đơn (BR-PAY-18 · BR-APP-14). Mục "How we score" là đích của link giải thích điểm từ trang chủ và trang kết quả (RS·F-14). · basis RS·F-11 · F-14 · BR-APP-04 · BR-APP-14 · Q-25 · Q-28

## 2. Điều hướng

### 2.1 Vào

| Vào qua | Từ | Trigger |
|---|---|---|
| NAV-PUB-01-4 | SCR-PUB-01 | "How we score" (`#scoring`) |
| NAV-TEST-02-6 | SCR-TEST-02 | "How scoring works" (`#scoring`) |
| NAV-PAY-05-3 | SCR-PAY-05 | "Contact support" (`#contact`) |
| shell | "Help" ở header public + drawer @390 | SYS-NAV §1 |
| entry ngoài | URL trực tiếp · SEO | SYS-NAV §4 |

### 2.2 Ra

| NAV-ID | Tới (SCR-ID · tham số) | Trigger (CMP-ID "nhãn") | Kiểu | URL / history | Animation | Back / đóng → | Guard / điều kiện | Nền tảng | Basis |
|---|---|---|---|---|---|---|---|---|---|
| NAV-PUB-06-1 | SCR-PAY-03 | CMP-05 "Manage or cancel your plan" | push | `/account/billing` (push) | mặc định | back trình duyệt → SCR-PUB-06 | chưa đăng nhập → SCR-AUTH-01 (`next=/account/billing`), xong quay lại | Web | BR-APP-04 |
| NAV-PUB-06-2 | SCR-PUB-05 · `doc=subscriptions` | CMP-06 "Refund policy" | push | `/legal/subscriptions` (push) | mặc định | back trình duyệt → SCR-PUB-06 | — | Web | RS·F-29 |
| NAV-PUB-06-3 | (cùng màn) gửi form | CMP-04 "Send message" | inline | không đổi URL | mặc định | — | form hợp lệ | Web | in-house |
| NAV-PUB-06-4 | SCR-PAY-05 | CMP-09 "Cancel or withdraw without signing in" | push | `/cancel` (push) | mặc định | back trình duyệt → SCR-PUB-06 | — (luôn) | Web | BR-PAY-18 · Q-25 |

## 3. Layout & components

- **Bố cục @390 (top→bottom):**
  - header;
  - H1 "Help" + ba liên kết nhanh "Manage or cancel your plan" · "Cancel or withdraw without signing in" · "Refund policy";
  - FAQ 3 nhóm (accordion);
  - mục "How we score" (`#scoring`);
  - form liên hệ (`#contact`);
  - khối liên hệ pháp nhân;
  - footer.
  - Ba liên kết nhanh đặt ngay dưới H1 vì huỷ gói và hoàn tiền là hai việc người vào trang trợ giúp hay tìm nhất (RS·F-11); người mua bằng checkout khách chưa từng đăng nhập dùng link thứ hai mà không cần magic link.

| CMP-ID | Component | Type / GC- | Behavior & rules | Basis (EV / Q / in-house) |
|---|---|---|---|---|
| CMP-01 | Header | GC-SiteHeader (public) | theo GC; mục "Help" ở trạng thái đang chọn | SYS-NAV §1 |
| CMP-02 | FAQ | accordion theo nhóm + JSON-LD `FAQPage` | 3 nhóm "Tests & scoring" · "Billing & cancellation" · "Privacy"; mở được nhiều mục cùng lúc. Câu hỏi: "Is this a diagnosis?" · "How long does a test take?" (Tests & scoring) · "What's free?" · "When will I be charged again?" · "How do I cancel?" · "Can I get a refund?" · "What will I see on my statement?" (Billing & cancellation) · "Who can see my answers?" · "How do I delete my data?" (Privacy). Câu trả lời là văn bản thuần, không ghi con số giá, không hứa gói hay tính năng không có trên trang giá; nhóm Billing & cancellation dùng câu VERBATIM ở bảng dưới; "How do I delete my data?" khớp landing-copy (Q-28): khách tự xoá từng kết quả, tải toàn bộ dữ liệu cần tài khoản miễn phí, hoặc gửi "Privacy request" | EV-TLW-047 · RS·F-06 · tieu-chuan-chung §8 · Q-16 · Q-18 · Q-24 · Q-27 · Q-28 |
| CMP-03 | "How we score" | mục có anchor `#scoring` | H2 "How we score"; nội dung: điểm tính ở server từ chính câu trả lời, có câu đảo chiều, cùng câu trả lời + cùng version thì cùng kết quả, mỗi kết quả ghi "Scored with version [v]"; cách đọc thanh điểm (%) | BR-APP-07 · RS·F-14 · TD-01 |
| CMP-04 | Form liên hệ | form | H2 "Contact us" (anchor `#contact`); "Topic" (select: "Tests & results" · "Billing & cancellation" · "Privacy & data" · "Privacy request" · "Something else", mặc định "Something else"; chọn "Privacy request" thì hiện câu phụ dưới select, gắn `aria-describedby`: "Ask for a copy of your data or for us to delete it. Send this form from the browser you took the test on, or sign in first, so we can find your data. We reply within 30 days.") · "Email" · "Message" (textarea, đếm "[k]/2000") · nút "Send message". Lỗi theo field: "Enter a valid email address." · "Please write at least 20 characters." · "Please keep your message under 2000 characters.". Gửi xong: form được thay bằng "Message sent. We'll reply to [email]." (chủ đề "Privacy request": "Request sent. We'll reply to [email] within 30 days.") | BR-PUB-12 · BR-PUB-15 · EV-TLW-049 |
| CMP-05 | Link quản lý gói | link | "Manage or cancel your plan" → `/account/billing` (NAV-PUB-06-1) | BR-APP-04 · RS·F-11 |
| CMP-06 | Link chính sách hoàn tiền | link | "Refund policy" → `/legal/subscriptions` (NAV-PUB-06-2) | RS·F-29 · Q-18 |
| CMP-07 | Khối liên hệ pháp nhân | khối địa chỉ | tên pháp nhân + địa chỉ + "support@[domain]" (link `mailto:`); cùng dữ liệu với SCR-PUB-05 CMP-05 | Q-05 · RS·F-12 · EV-TLW-049 |
| CMP-08 | Footer | GC-SiteFooter | theo GC | SYS-NAV §1 |
| CMP-09 | Link huỷ / rút không cần đăng nhập | link | "Cancel or withdraw without signing in" → `/cancel` (NAV-PUB-06-4) | BR-PAY-18 · Q-25 |

FAQ nhóm "Billing & cancellation" — câu trả lời VERBATIM (cùng chữ với pricing-page §4; đổi một bên thì sửa cả hai):

| Câu hỏi | Câu trả lời (en-US) | Basis |
|---|---|---|
| "When will I be charged again?" | "Plus renews automatically at the end of each billing period, at the price you signed up for. If our prices change, yours stays the same for as long as your plan continues. We email you before every renewal: 21 days before an annual renewal and 7 days before a monthly one, with the amount, the date and a link to cancel. Your next charge date is always in Account → Plan & billing." | Q-16 · Q-27 · BR-APP-03 · BR-APP-13 |
| "How do I cancel?" | nguyên văn câu trả lời "How do I cancel?" ở pricing-page §4 (có cả cách không cần đăng nhập: "Cancel your plan here" ở cuối mọi trang) | BR-APP-04 · BR-PAY-18 |
| "Can I get a refund?" | "Yes. Withdraw within 14 days of buying a report, starting a Plus plan or an annual renewal, and we'll refund the full amount — no questions asked. Use “Withdraw from contract here” at the bottom of any page, or Account → Plan & billing. Monthly renewals aren't refunded, but you can cancel anytime and keep Plus until the end of the month you've paid for." | Q-18 · Q-25 · BR-APP-14 |
| "What will I see on my statement?" | "Charges will appear as [descriptor] on your statement. Paddle.com is our reseller and the Merchant of Record for all our orders." — [descriptor] = `statementDescriptor` của server, điền lúc build / revalidate | Q-24 · Q-04 · BR-APP-15 |

## 4. States

| State | Trigger | Hiển thị | EV / basis |
|---|---|---|---|
| Default | luôn (nội dung tĩnh) | đủ CMP-01…09, form trống | EV-TLW-047 |
| Loading | đang gửi form (API-HELP-01) | nút "Send message" có spinner + disable; nội dung form giữ nguyên | tieu-chuan-chung §3 |
| Empty | N/A — FAQ tĩnh, luôn có nội dung | — | in-house |
| Error | API-HELP-01 lỗi mạng / 5xx / timeout | "We couldn't send your message. Please try again or email support@[domain]."; form giữ nguyên nội dung | tieu-chuan-chung §2 |
| Locked | N/A — trang public | — | 00-overview §3 |

## 5. API

| API | Method | When called |
|---|---|---|
| API-HELP-01 | POST | bấm "Send message" khi form hợp lệ; body `topic` · `email` · `message`; `Idempotency-Key` = UUID sinh khi form hiện, gửi lại sau lỗi dùng cùng key; đã đăng nhập thì server gắn tài khoản từ `tl_session`, client không gửi id |

| Body field | Type | Required | Meaning | Basis |
|---|---|---|---|---|
| `topic` | enum `tests` · `billing` · `privacy` · `privacy_request` · `other` | có | "Tests & results" · "Billing & cancellation" · "Privacy & data" · "Privacy request" · "Something else". `privacy_request` vào hàng xử lý yêu cầu quyền dữ liệu (bản sao / xoá), hạn trả lời 30 ngày; server gắn bằng chứng sở hữu theo BR-PUB-15 (kết quả của token `tl_guest` trong cookie, hoặc tài khoản của `tl_session`) — client không gửi id | BR-PUB-12 · BR-PUB-15 · Q-28 |
| `email` | string | có | email nhận trả lời | BR-PUB-12 |
| `message` | string, 20–2000 ký tự | có | nội dung; link kết quả dán vào đây không được coi là bằng chứng sở hữu (BR-PUB-15) | BR-PUB-12 · BR-PUB-15 |

Response `data`: `{ messageId: uuid, receivedAt: ISO-8601 }` — client chỉ cần thành công / lỗi để hiện câu xác nhận.

Lỗi riêng: 400 theo field → copy lỗi ở CMP-04; 429 (quá 5 tin/giờ/IP) → "Too many requests. Please wait a moment and try again.". Còn lại theo `00-quy-uoc-api` §4.

## 6. Tracking

| Event | Note |
|---|---|
| `screen_active` · `help` | sau consent |
| ft_contact · start | form liên hệ hiện (lần đầu vào viewport) |
| ft_contact · submit | API-HELP-01 trả về (success / fail); param `topic` = `tests` / `billing` / `privacy` / `privacy_request` / `other`; không gửi email hay nội dung tin |
| (sang SCR-PAY-05) | NAV-PUB-06-4 mang `from` = help qua router state; ft_withdrawal start bắn ở SCR-PAY-05, không bắn ở đây |

## 7. Business rules & edge cases

| BR-ID | Rule | Basis |
|---|---|---|
| BR-PUB-12 | Form: email bắt buộc + hợp lệ; message 20–2000 ký tự; chống spam bằng rate limit (5/giờ/IP), không CAPTCHA bên thứ ba | in-house · tieu-chuan-chung §9 (0 request bên thứ ba trước consent) |
| BR-PUB-15 | Form có chủ đề "Privacy request" (CMP-04) để xin bản sao hoặc xoá dữ liệu; trả lời trong 30 ngày. Xác minh người gửi: (a) khách gửi từ CHÍNH trình duyệt đã làm bài → server tự gắn các kết quả thuộc token `tl_guest` vào yêu cầu (bằng chứng sở hữu), không cần dán link; (b) gửi từ trình duyệt khác → không xác minh được là chủ: hỗ trợ trả lời bằng cách tự làm (mở lại kết quả trên trình duyệt cũ để xoá; kết quả chưa lưu tự xoá sau 30 ngày), không gửi dữ liệu; (c) có tài khoản → xác minh qua email của tài khoản (gửi khi đã đăng nhập, hoặc trả lời từ đúng email đó); tài khoản cũng tự export / xoá được ở SCR-ACC-01. Link kết quả dán trong tin nhắn không phải bằng chứng | Q-28 · BR-APP-11 · BR-APP-08 |

| EC-xx | Tình huống | Handling | Basis |
|---|---|---|---|
| EC-01 | Mở thẳng `/help#scoring` | cuộn tới CMP-03 và focus heading "How we score"; nội dung có sẵn trong SSR | RS·F-14 |
| EC-02 | Bấm "Send message" hai lần / mạng chập chờn | nút disable khi đang gửi; gửi lại dùng cùng `Idempotency-Key` → 409 coi là thành công, không tạo hai tin | 00-quy-uoc-api §4 · §5 |
| EC-03 | Một IP gửi quá 5 tin trong một giờ | 429 + copy của tieu-chuan-chung §2; form giữ nội dung | BR-PUB-12 |
| EC-04 | Khách đã mua nhưng chưa đăng nhập lần nào bấm "Manage or cancel your plan" | guard → `/login?next=/account/billing`; đăng nhập bằng email đã dùng khi thanh toán (tài khoản được tạo từ email đó) | SYS-AUTH · Q-11 |
| EC-05 | Người dùng Free bấm "Manage or cancel your plan" | SCR-PAY-03 hiện trạng thái Free, không lỗi | BR-APP-04 |
| EC-06 | JavaScript tắt | FAQ và "How we score" đọc được (SSR, accordion dùng `<details>`); form cần JS nên hiện "Please enable JavaScript to send a message, or email support@[domain]." | cong-nghe-loi §3 |
| EC-07 | Khách mua bằng checkout khách, chưa từng đăng nhập, muốn huỷ hoặc được hoàn tiền | "Cancel or withdraw without signing in" (NAV-PUB-06-4) → SCR-PAY-05: tên, email + mã đơn, không cần magic link | BR-PAY-18 · BR-APP-14 |
| EC-08 | Mở thẳng `/help#contact` (từ SCR-PAY-05 "Contact support") | cuộn tới CMP-04 và focus heading "Contact us" | NAV-PAY-05-3 |
| EC-09 | "Privacy request" từ khách chưa lưu kết quả | cùng trình duyệt đã làm bài: server gắn kết quả của token `tl_guest`, hỗ trợ xử lý và trả lời trong 30 ngày; trình duyệt khác: trả lời bằng cách tự làm (mở lại kết quả trên trình duyệt cũ để xoá, hoặc chờ tự xoá sau 30 ngày), không gửi dữ liệu (BR-PUB-15) | Q-28 · BR-APP-08 |

## 8. Responsive deltas

| Aspect | 390 (gốc) | 768 | 1280 |
|---|---|---|---|
| Liên kết nhanh (3) | xếp dọc, full width | 1 hàng 3 cột | 1 hàng 3 cột |
| FAQ | 1 cột accordion | 1 cột accordion | 2 cột: danh sách nhóm dính bên trái, câu hỏi bên phải |
| Form liên hệ + khối pháp nhân | xếp chồng, full width | form rộng tối đa 560 | 2 cột: form + khối pháp nhân |

## 9. Keyboard & focus

Mỗi câu hỏi FAQ là `button` có `aria-expanded`; Enter/Space mở hoặc đóng. Submit lỗi → focus ô lỗi đầu tiên. Gửi xong → focus vào dòng xác nhận (`aria-live="polite"`). Còn lại theo `tieu-chuan-chung §5`.

## 10. AI Notices
- Câu hỏi FAQ và các lựa chọn "Topic" do AI viết (chốt theo uỷ quyền 2026-09-28). Câu trả lời về giá, gia hạn, hoàn tiền dùng đúng câu đã chốt (bảng verbatim ở §3, cùng chữ với pricing-page §4) và khớp `doc=subscriptions` + GC-RenewalDisclosure, để khỏi lệch nhau như đối thủ (RS·F-06 · F-29).
- API-HELP-01 chuyển tin tới hộp thư hỗ trợ `support@[domain]`; email giao dịch đi qua Postmark (Q-16). Dùng helpdesk hay không là việc vận hành, không đổi contract.
- "Privacy request": cách xác minh người gửi ở BR-PUB-15 (token `tl_guest` của trình duyệt đã làm bài, hoặc email tài khoản); link kết quả không phải bằng chứng. Kịch bản trả lời của hỗ trợ (cả trường hợp không xác minh được) cần viết trước launch; hạn 30 ngày.
- `[descriptor]` trong FAQ sao kê là chuỗi thật lấy từ giao dịch thử (`bang-quyet-dinh` §2 #3); JSON-LD `FAQPage` phải dùng cùng chuỗi.
- Rate limit 5/giờ/IP có thể chặn nhầm nhiều người dùng chung IP (văn phòng, trường học). Cần theo dõi tỉ lệ 429 sau launch.
