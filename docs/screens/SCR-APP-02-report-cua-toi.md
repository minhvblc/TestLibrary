# [SCR-APP-02] Report của tôi
**Meta**

| id | module | doc level | platforms | route | access | indexable | viewports | related FLOW | status | design | tracking | api | Evidence / visual basis |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| SCR-APP-02 | APP | Short | Web | `/app/reports` | account | noindex | 390 · 768 · 1280 | FLOW-luu-ket-qua-dang-nhap | Draft | (sau design) | `tracking-events.md` → `my_reports` | §5 (inline) | **EV-TLW-241 · SC-TLW-24 · basis RS·F-22 · CS-13** |

**Changelog** (mới nhất trước)
- 2026-09-28 · v1.1 · claude-opus-5-5 · Q-18 đã chốt: thêm EC-07 (rút một khoản trong 14 ngày → `report.full` mất ngay, BR-APP-14); BR-REP-07 bỏ ghi chú hoàn tiền mơ hồ, trỏ quyền rút 14 ngày.
- 2026-09-27 · v1 · claude (subagent) · khởi tạo từ blueprint.

## 1. Purpose

Lịch sử mọi lần làm bài của tài khoản — mỗi lần một dòng, mới nhất trước — để mở lại tóm tắt miễn phí, hoặc đọc report đầy đủ nếu đã có quyền. Trang "Your reports" của đối thủ chỉ đưa bài vừa làm kèm các widget, và member làm bài xong bị chuyển thẳng tới đó (RS·F-22 · EV-TLW-241). Ở đây trạng thái quyền của từng kết quả hiện rõ ("Full report" / "Summary"), còn type của bài `sensitive` bị ẩn. · basis RS·F-22 · CS-13 · SYS-ENTITLEMENT

## 2. Điều hướng

### 2.1 Vào

| Vào qua | Từ | Trigger |
|---|---|---|
| NAV-APP-03-3 | SCR-APP-03 | "Back to My reports" |
| shell | "My reports" ở header app + drawer @390 | SYS-NAV §1 |
| guard | chưa đăng nhập → `/login?next=/app/reports`, đăng nhập xong quay lại | SYS-NAV §4 |

### 2.2 Ra

| NAV-ID | Tới (SCR-ID · tham số) | Trigger (CMP-ID "nhãn") | Kiểu | URL / history | Animation | Back / đóng → | Guard / điều kiện | Nền tảng | Basis |
|---|---|---|---|---|---|---|---|---|---|
| NAV-APP-02-1 | SCR-APP-03 · `reportId` | CMP-03 "Read" | push | `/app/reports/:reportId` (push) | mặc định | back trình duyệt → SCR-APP-02 | có quyền | Web | SYS-ENTITLEMENT |
| NAV-APP-02-2 | SCR-TEST-02 · `resultId` | CMP-03 "View summary" | push | `/results/:resultId` (push) | mặc định | back trình duyệt → SCR-APP-02 | — | Web | CS-13 |
| NAV-APP-02-3 | SCR-PUB-02 | CMP-04 "Take your first test" | push | `/tests` (push) | mặc định | back trình duyệt → SCR-APP-02 | danh sách rỗng | Web | in-house |
| NAV-APP-02-4 | (cùng màn) xoá một kết quả | CMP-05 "Delete" → xác nhận tại dòng "Delete this result and your answers? This can't be undone." · "Delete" / "Cancel" | inline | không đổi URL | mặc định | — | chủ sở hữu kết quả | Web | BR-APP-11 |

## 3. Layout & components

- **Bố cục @390 (top→bottom):**
  - header (app);
  - H1 "My reports";
  - danh sách, mỗi dòng một thẻ: tên bài + ngày → type + trạng thái → nút hành động;
  - (khi rỗng) CMP-04 thay chỗ danh sách;
  - footer của shell app (GC-SiteFooter, SYS-NAV §1).

| CMP-ID | Component | Type / GC- | Behavior & rules | Basis (EV / Q / in-house) |
|---|---|---|---|---|
| CMP-01 | Header | GC-SiteHeader (app) | theo GC; mục "My reports" ở trạng thái đang chọn | SYS-NAV §1 |
| CMP-02 | Tiêu đề | H1 | "My reports" | in-house |
| CMP-03 | Danh sách kết quả | list, mỗi lần làm bài một dòng | mỗi dòng: tên bài · ngày làm (dạng "October 12, 2026", theo timezone tài khoản) · type "[Type]" (ẩn với bài `sensitive`, BR-REP-02) · trạng thái "Full report" (có `report.full`) / "Summary" (chưa có) · hành động "Read" (NAV-APP-02-1) / "View summary" (NAV-APP-02-2). Đang chờ webhook (`reportAccess = pending`): trạng thái "Confirming your payment…", hành động vẫn là "View summary". Tải 20 dòng mỗi lần; còn nữa thì cuối danh sách có nút "Show more" (thêm tại chỗ, không đổi URL) | RS·F-22 · EV-TLW-241 · SYS-ENTITLEMENT |
| CMP-04 | Trạng thái rỗng | empty state | "No results yet." + nút "Take your first test" (NAV-APP-02-3) | tieu-chuan-chung §3 |
| CMP-05 | Hành động "Delete" trên mỗi dòng | nút phụ + xác nhận ngay tại dòng | gọi API-RES-03; xong → dòng biến mất + toast "Result deleted."; report đã mua lẻ của kết quả đó cũng mất (ghi rõ trong câu xác nhận nếu đã mua: "You'll also lose the full report you unlocked for this result.") | BR-APP-11 · SYS-CONSENT |

## 4. States

| State | Trigger | Hiển thị | EV / basis |
|---|---|---|---|
| Default | API-REP-01 trả ≥ 1 dòng | CMP-01…03 | EV-TLW-241 |
| Loading | tải danh sách ≥ 300 ms | skeleton 3 dòng | tieu-chuan-chung §3 |
| Empty | tài khoản chưa có kết quả nào | CMP-04 | in-house |
| Error | API-REP-01 lỗi mạng / 5xx | "You're offline. Check your connection and try again." (mất mạng) hoặc "Something went wrong on our side. Please try again." (5xx), kèm nút thử lại | tieu-chuan-chung §2 |
| Locked | N/A — route `account`, chưa đăng nhập đã redirect ở guard (SYS-NAV §4) | — | SYS-NAV §4 |

## 5. API

| API | Method | When called |
|---|---|---|
| API-REP-01 | GET | mở trang + bấm "Show more"; `page` · `page_size` = 20; mỗi dòng trả `resultId` · `reportId` · `testName` · `takenAt` · `sensitive` · `typeName` (server trả `null` với bài `sensitive`) · `reportAccess` (`none` · `pending` · `full`) — cùng shape với `latestResult` của API-APP-01; sắp xếp `takenAt` giảm dần |
| API-RES-03 | DELETE | xác nhận xoá một dòng (CMP-05); 404 coi như đã xoá; lỗi khác: toast "We couldn't delete this result. Please try again." |

Lỗi riêng: không có. 401 → guard `/login?next=/app/reports` (00-quy-uoc-api §4). Còn lại theo `00-quy-uoc-api` §4.

## 6. Tracking

| Event | Note |
|---|---|
| `screen_active` · `my_reports` | sau consent; không gửi tên bài, type hay số dòng |

## 7. Business rules & edge cases

| BR-ID | Rule | Basis |
|---|---|---|
| BR-REP-01 | Mới nhất trước; mỗi lần làm bài là 1 dòng (làm lại không ghi đè) | BR-APP-07 · CS-13 |
| BR-REP-02 | Bài `sensitive` không hiện type ở danh sách (riêng tư khi chia sẻ màn hình) | Q-06 · BR-APP-06 |
| BR-REP-07 | Xoá một kết quả = xoá cứng kết quả + câu trả lời + report ráp từ nó (ngay, không 30 ngày); với bài `sensitive` đây là cách rút consent; xoá không tự hoàn tiền cho report đã mua — muốn hoàn thì rút trong 14 ngày ở SCR-PAY-05 ("Withdraw from contract here"); xoá kết quả không huỷ quyền rút của khoản mua | BR-APP-11 · SYS-CONSENT · Q-18 · BR-APP-14 |

| EC-xx | Tình huống | Handling | Basis |
|---|---|---|---|
| EC-01 | Vừa đăng nhập, kết quả khách được gộp vào tài khoản | các kết quả đó có trong danh sách ngay lần tải đầu, đúng thứ tự thời gian | SYS-AUTH |
| EC-02 | Tài khoản đang có Plus | mọi dòng "Full report" + "Read" | SYS-ENTITLEMENT |
| EC-03 | Plus hết kỳ sau khi huỷ | dòng chỉ có quyền nhờ Plus quay về "Summary" + "View summary"; dòng đã mua lẻ giữ "Full report" | SYS-ENTITLEMENT · BR-APP-04 |
| EC-04 | Vừa mua lẻ nhưng webhook chưa về | dòng hiện "Confirming your payment…" (không có "Read") tới khi server xác nhận; danh sách không tự poll, tải lại trang thì thấy trạng thái mới; không mở quyền theo tham số URL | BR-APP-01 · cong-nghe-loi §3 |
| EC-05 | Làm lại cùng một bài | thêm dòng mới; dòng cũ giữ nguyên kết quả và quyền của nó | BR-REP-01 · BR-APP-07 |
| EC-06 | Hơn 20 kết quả | "Show more" tải trang kế và nối vào cuối; back từ report giữ số dòng đã tải + vị trí cuộn | 00-quy-uoc-api §8 |
| EC-07 | Một khoản mua được rút trong 14 ngày (API-PAY-08 · SCR-PAY-05) | report lẻ → dòng của kết quả đó về "Summary" + "View summary" ngay khi server nhận yêu cầu rút; Plus (lần thanh toán đầu hoặc gia hạn năm) → mọi dòng chỉ có quyền nhờ Plus về "Summary" ngay, không chờ hết kỳ; dòng đã mua lẻ riêng giữ "Full report". Kết quả và tóm tắt vẫn còn | BR-APP-14 · Q-18 · SYS-ENTITLEMENT |

## 8. Responsive deltas

| Aspect | 390 (gốc) | 768 | 1280 |
|---|---|---|---|
| Dòng kết quả | thẻ xếp chồng: tên + ngày → type + trạng thái → nút full width | một hàng: tên + ngày bên trái · trạng thái + nút bên phải | như 768, danh sách rộng tối đa 880 |
| CMP-04 | căn giữa, nút full width | căn giữa, nút rộng theo chữ | như 768 |

## 9. Keyboard & focus

Mỗi dòng chỉ có một điểm focus là nút hành động (không bọc cả dòng trong link) để tránh focus trùng. Sau "Show more", focus chuyển tới dòng đầu tiên vừa được thêm. Còn lại theo `tieu-chuan-chung §5`.

## 10. AI Notices
- Tên màn là "My reports" nhưng danh sách gồm cả kết quả chỉ có tóm tắt. Đây là chủ ý: user thấy mọi lần làm bài ở một chỗ (CS-13).
- `page_size` = 20 và nút "Show more" là đề xuất (in-house).
