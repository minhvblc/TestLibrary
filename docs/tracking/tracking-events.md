# Tracking events — TestLib (web)
> MỘT file. Chỉ 2 loại event: `screen_active` + `ft_<feature>`. Gửi qua một cổng duy nhất `AppTracking` (Firebase Analytics web, chuẩn xteam-tracking). Params chung khai báo 1 lần ở bảng đầu. Status: Chưa gắn → Đã gắn → Đã verify.
> **Consent:** không event nào bắn trước khi user đồng ý analytics (mọi vùng, Q-13; BR-APP-05). Trình duyệt gửi GPC thì analytics = denied (Q-20), nên không có event nào trừ khi user tự bật lại ở SCR-PUB-07. Route của bài `sensitive` (SCR-PUB-03 · SCR-TEST-01 · SCR-TEST-02 · SCR-PAY-01 · SCR-PAY-02 · SCR-APP-03 khi kết quả/report thuộc bài `sensitive`) **không bắn event nào** (BR-APP-06). **Cấm** gửi câu trả lời, điểm, type kết quả, email, tên.
> **Che URL:** `AppTracking` tự đặt `page_location` / `page_referrer` về dạng không có id và che slug bài `sensitive` (vd `/tests/[sensitive]`, `/results/[id]`); không gửi query string. Nhờ đó trang kế tiếp sau một bài nhạy cảm không làm lộ slug qua referrer.
**Changelog** (mới nhất trước)
- 2026-09-28 · v1.4 · claude-opus-5-5 · `channel` của cancel_confirm ở SCR-PAY-05 lấy từ `identifiedBy` của API-PAY-09 (`session` → account, `order` → no_login).
- 2026-09-28 · v1.3 · claude-opus-5-5 · ft_subscription / ft_withdrawal: `from` thêm `direct` (vào thẳng `/cancel` hoặc từ tìm kiếm) và `email` cho email nhắc; `cancel_confirm` thêm status `no_active_plan`.
- 2026-09-28 · v1.2 · claude-opus-5-5 · quyết định 2026-09-28 (AI · uỷ quyền human): thêm màn SCR-PAY-05 (`cancel_or_withdraw`) + feature ft_withdrawal (Q-18 · Q-25); ft_subscription thêm huỷ không cần đăng nhập (API-PAY-09); ft_checkin thêm enable / disable (consent check-in, Q-22); ft_consent: GPC không bắn event và `source` (Q-20); ft_contact thêm chủ đề `privacy_request` (Q-28).
- 2026-09-28 · v1.1 · claude-opus-5-5 · ft_consent start: thêm trường hợp cho phép lần đầu ở SCR-PUB-07 (bắn ngay trước save). D-14: `from` của ft_test start (app_home mang qua SCR-PUB-03) và ft_report start (thêm app_home · billing).
- 2026-09-27 · v1 · claude-opus-5-5 · khởi tạo.

## Params chung

| Param | Ý nghĩa |
|---|---|
| `platform` | luôn `web` |
| `screen_id` | SCR-ID của màn hiện tại |
| `user_id` | id nội bộ ngẫu nhiên (không phải email) — chỉ khi đã đăng nhập |
| `app_version` | phiên bản web build |
| `session_id` | id phiên analytics |
| `viewport_class` | `390` / `768` / `1280` (theo breakpoint gần nhất) |
| `locale` | `en-US` |

## screen_active — điều hướng (bắn khi route đổi, kể cả client-side)

| action_type | action_name | other param | Fires when | Status |
|---|---|---|---|---|
| screen | theo map bên dưới | `open_from` = direct / organic / utm / referral / email / share (CHỈ lần vào đầu phiên) | route mới hiển thị (sau consent; không bắn trên route bài `sensitive`) | Chưa gắn |
| dialog | — | — | MVP không có dialog có nội dung riêng (các luồng xác nhận là trang riêng) | Chưa gắn |

### SCR-ID → action_name map

| SCR-ID | route | action_name |
|---|---|---|
| SCR-PUB-01 | `/` | `home` |
| SCR-PUB-02 | `/tests` | `test_library` |
| SCR-PUB-03 | `/tests/:slug` | `test_page` (bài `sensitive`: KHÔNG bắn) |
| SCR-PUB-04 | `/pricing` | `pricing` |
| SCR-PUB-05 | `/legal/:doc` | `legal` |
| SCR-PUB-06 | `/help` | `help` |
| SCR-PUB-07 | `/cookie-settings` | `cookie_settings` |
| SCR-TEST-01 | `/tests/:slug/take` | `test_take` (bài `sensitive`: KHÔNG bắn) |
| SCR-TEST-02 | `/results/:resultId` | `result` (bài `sensitive`: KHÔNG bắn) |
| SCR-PAY-01 | `/unlock/:resultId` | `unlock` |
| SCR-PAY-02 | `/checkout/return` | `checkout_return` |
| SCR-PAY-03 | `/account/billing` | `billing` |
| SCR-PAY-04 | `/account/billing/cancel` | `cancel_renewal` |
| SCR-PAY-05 | `/cancel` | `cancel_or_withdraw` |
| SCR-AUTH-01 | `/login` | `login` |
| SCR-APP-01 | `/app` | `app_home` |
| SCR-APP-02 | `/app/reports` | `my_reports` |
| SCR-APP-03 | `/app/reports/:reportId` | `report` (bài `sensitive`: KHÔNG bắn) |
| SCR-ACC-01 | `/account` | `account` |
| SCR-ACC-02 | `/account/delete` | `delete_account` |

## ft_<feature>

> Mỗi feature: 1 `start` + ≥ 1 `action`; đúng 1 action `feature_target=TRUE` (goal). `test_slug` chỉ gửi cho bài KHÔNG `sensitive`.

#### ft_test
| action_type | action_name | feature_target | status | from | Fires when | Extra param | Status |
|---|---|---|---|---|---|---|---|
| start | — | — | — | test_page / app_home / result (làm lại) — `app_home` được router state mang qua SCR-PUB-03 khi vào bằng NAV-APP-01-1 (không đưa lên URL) | attempt mới được tạo (API-TEST-01 OK) | `test_slug` · `question_count` | Chưa gắn |
| action | resume | FALSE | null | reload / return | mở lại bài đang dở từ tiến độ lưu | `test_slug` · `answered_count` | Chưa gắn |
| action | submit | TRUE | success / fail | — | API-TEST-03 trả kết quả hoặc hết lượt thử lại | `test_slug` · `duration_ms` · `offline_queued` (true/false) | Chưa gắn |

#### ft_result
| action_type | action_name | feature_target | status | from | Fires when | Extra param | Status |
|---|---|---|---|---|---|---|---|
| start | — | — | — | test_take / email / my_reports / test_page / unlock | màn kết quả hiện | `test_slug` | Chưa gắn |
| action | save_email | TRUE | success / fail | — | API-RES-02 trả về | — | Chưa gắn |
| action | unlock_click | FALSE | null | — | bấm CTA mở khoá | — | Chưa gắn |
| action | retake | FALSE | null | — | bấm "Retake test" | `test_slug` | Chưa gắn |

#### ft_unlock
| action_type | action_name | feature_target | status | from | Fires when | Extra param | Status |
|---|---|---|---|---|---|---|---|
| start | — | — | — | pricing / unlock / report_locked / app_home | bề mặt mua hiện | `surface` | Chưa gắn |
| action | checkout_open | FALSE | null | — | API-PAY-02 trả URL, chuyển sang provider | `plan_key` | Chưa gắn |
| action | purchase | TRUE | success / fail / pending | — | SCR-PAY-02 nhận trạng thái cuối từ API-PAY-03 (server đã xác nhận qua webhook) | `plan_key` | Chưa gắn |

#### ft_subscription
| action_type | action_name | feature_target | status | from | Fires when | Extra param | Status |
|---|---|---|---|---|---|---|---|
| start | — | — | — | billing / email / cancel_page / direct (vào thẳng `/cancel` hoặc từ tìm kiếm) | SCR-PAY-03 hoặc SCR-PAY-04 hiện, hoặc SCR-PAY-05 ở chế độ huỷ (chọn "Cancel Plus renewal") | `plan_key` (SCR-PAY-05 khi chưa đăng nhập: không có) | Chưa gắn |
| action | cancel_open | FALSE | null | billing / email | mở SCR-PAY-04 | — | Chưa gắn |
| action | cancel_confirm | TRUE | success / fail / not_found / no_active_plan | — | API-PAY-05 (SCR-PAY-04) hoặc API-PAY-09 (SCR-PAY-05) trả về | `plan_key` · `channel` = account / no_login (SCR-PAY-05: theo `identifiedBy` của API-PAY-09 — `session` → account, `order` → no_login) | Chưa gắn |
| action | resume | FALSE | success / fail | — | API-PAY-06 trả về | `plan_key` | Chưa gắn |
| action | portal_open | FALSE | null | — | API-PAY-07 trả URL | — | Chưa gắn |

#### ft_auth
| action_type | action_name | feature_target | status | from | Fires when | Extra param | Status |
|---|---|---|---|---|---|---|---|
| start | — | — | — | header / guard / result | SCR-AUTH-01 hiện | `has_next` | Chưa gắn |
| action | magic_link_sent | FALSE | success / fail | — | API-AUTH-01 trả về | — | Chưa gắn |
| action | login | TRUE | success / fail | — | phiên tạo xong (API-AUTH-02 / API-AUTH-04) | `method` = magic_link / google | Chưa gắn |
| action | logout | FALSE | null | — | API-AUTH-05 xong | — | Chưa gắn |

#### ft_checkin
| action_type | action_name | feature_target | status | from | Fires when | Extra param | Status |
|---|---|---|---|---|---|---|---|
| start | — | — | — | app_home | widget check-in hiện và hôm nay chưa check-in (hoặc bước bật check-in hiện, khi chưa đồng ý — Q-22) | — | Chưa gắn |
| action | enable | FALSE | success / declined | — | bước bật check-in: "Turn on check-ins" (API-ME-02 OK) hoặc "Not now" | — | Chưa gắn |
| action | submit | TRUE | success / fail | — | API-APP-02 trả về | `streak_days` (KHÔNG gửi giá trị cảm xúc) | Chưa gắn |
| action | disable | FALSE | success / fail | account | tắt check-in + xoá lịch sử ở SCR-ACC-01 (API-ME-02 trả về) | — | Chưa gắn |

#### ft_challenge
| action_type | action_name | feature_target | status | from | Fires when | Extra param | Status |
|---|---|---|---|---|---|---|---|
| start | — | — | — | app_home | thẻ ngày thử thách hiện | `day` | Chưa gắn |
| action | day_complete | TRUE | success / fail | — | API-APP-03 trả về | `day` | Chưa gắn |

#### ft_report
| action_type | action_name | feature_target | status | from | Fires when | Extra param | Status |
|---|---|---|---|---|---|---|---|
| start | — | — | — | my_reports / email / result / checkout_return / app_home (NAV-APP-01-2) / billing (NAV-PAY-03-5) | report hiện (không bắn cho bài `sensitive`) | — | Chưa gắn |
| action | pdf_download | TRUE | success / fail / queued | — | file PDF bắt đầu tải hoặc chuyển sang gửi email | `duration_ms` | Chưa gắn |
| action | rate | FALSE | success / fail | — | API-REP-05 trả về (KHÔNG bắn với bài `sensitive`) | `rating` (1–5) | Chưa gắn |

#### ft_data_export
| action_type | action_name | feature_target | status | from | Fires when | Extra param | Status |
|---|---|---|---|---|---|---|---|
| start | — | — | — | account | mục "Your data" hiện | — | Chưa gắn |
| action | request | TRUE | success / fail | — | API-ME-03 trả về | — | Chưa gắn |

#### ft_account_delete
| action_type | action_name | feature_target | status | from | Fires when | Extra param | Status |
|---|---|---|---|---|---|---|---|
| start | — | — | — | account | SCR-ACC-02 hiện | — | Chưa gắn |
| action | confirm | TRUE | success / fail | — | API-ME-04 trả về (bắn TRƯỚC khi xoá phiên) | — | Chưa gắn |

#### ft_consent
| action_type | action_name | feature_target | status | from | Fires when | Extra param | Status |
|---|---|---|---|---|---|---|---|
| start | — | — | — | banner / cookie_settings | chỉ bắn được khi analytics đã được cho phép: mở SCR-PUB-07 khi đã granted, hoặc ngay sau khi SDK tải do vừa cho phép (banner "Accept all" · lưu lần đầu ở SCR-PUB-07), luôn trước save | — | Chưa gắn |
| action | save | TRUE | success | — | lưu lựa chọn có analytics = granted (từ chối, hoặc GPC tự lưu denied, thì không có event nào) | `analytics` · `marketing` (granted / denied) · `source` = banner / settings | Chưa gắn |

#### ft_contact
| action_type | action_name | feature_target | status | from | Fires when | Extra param | Status |
|---|---|---|---|---|---|---|---|
| start | — | — | — | help | form liên hệ hiện | — | Chưa gắn |
| action | submit | TRUE | success / fail | — | API-HELP-01 trả về | `topic` (gồm `privacy_request` — Q-28) | Chưa gắn |

#### ft_withdrawal
| action_type | action_name | feature_target | status | from | Fires when | Extra param | Status |
|---|---|---|---|---|---|---|---|
| start | — | — | — | footer / help / billing / checkout_return / email / direct (vào thẳng hoặc từ tìm kiếm) | SCR-PAY-05 hiện ở chế độ rút (vào bằng `mode=withdraw` hoặc chọn "Withdraw from a purchase") | — | Chưa gắn |
| action | confirm | TRUE | success / fail / not_eligible / not_found | — | API-PAY-08 trả về sau bước 2 "Confirm withdrawal" | `plan_key` (chỉ khi success) | Chưa gắn |

## Event index

| Event | Kind | Related screens | Status |
|---|---|---|---|
| `screen_active` | navigation | tất cả (trừ route bài `sensitive`) | Chưa gắn |
| ft_test | feature | SCR-TEST-01 | Chưa gắn |
| ft_result | feature | SCR-TEST-02 | Chưa gắn |
| ft_unlock | feature | SCR-PUB-04 · SCR-PAY-01 · SCR-PAY-02 · SCR-APP-03 · SCR-APP-01 | Chưa gắn |
| ft_subscription | feature | SCR-PAY-03 · SCR-PAY-04 · SCR-PAY-05 | Chưa gắn |
| ft_withdrawal | feature | SCR-PAY-05 | Chưa gắn |
| ft_auth | feature | SCR-AUTH-01 · SCR-ACC-01 | Chưa gắn |
| ft_checkin | feature | SCR-APP-01 · SCR-ACC-01 | Chưa gắn |
| ft_challenge | feature | SCR-APP-01 | Chưa gắn |
| ft_report | feature | SCR-APP-03 | Chưa gắn |
| ft_data_export | feature | SCR-ACC-01 | Chưa gắn |
| ft_account_delete | feature | SCR-ACC-02 | Chưa gắn |
| ft_consent | feature | SCR-PUB-07 · GC-ConsentBanner | Chưa gắn |
| ft_contact | feature | SCR-PUB-06 | Chưa gắn |

**North-star funnel:** ft_test start → ft_test submit (success) → ft_result start → ft_result unlock_click → ft_unlock checkout_open → ft_unlock purchase (success). Bài `sensitive` không vào funnel analytics. Doanh thu từ bài đó chỉ đếm ở server (bảng đơn hàng), không qua analytics.

## AI Notices
- Không có event per-question (đối thủ bắn event theo từng câu, RS·F-13). Tỉ lệ bỏ dở đo ở server từ bảng attempt (số câu đã trả lời), không qua analytics.
- Pixel quảng cáo không có trong MVP (Q-12, chốt 2026-09-28). Nếu chạy ads thì chỉ gửi conversion "purchase" phía server, sau consent marketing, không khi có GPC, không kèm sản phẩm khi report thuộc bài `sensitive`.
- Rút tiền và huỷ gia hạn đếm chính xác ở server (bảng đơn hàng, event webhook). ft_withdrawal / ft_subscription chỉ đo trải nghiệm trên trang, có thể thiếu vì consent.
