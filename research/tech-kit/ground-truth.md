# Tech kit — Ground truth (thư viện test tâm lý · quiz-funnel web)
**Changelog** (mới nhất trước)
- 2026-09-27 · v1 · claude-opus-5-5 · kit đóng băng TRƯỚC lần drive đầu tiên (5 item, answer-pattern + hành vi giữa bài).

> Category: thư viện bài test tính cách / quan hệ / nghề nghiệp, kết quả khoá sau paywall. Capability cần đo là **engine làm test**: flow câu hỏi → chấm điểm → kết quả. Kit ở đây là **quy tắc trả lời** (answer pattern) và **hành vi giữa bài**, không phải file upload.
> **Luật áp dụng:** chạy MỌI item trên **cùng một bài test**, là bài **ngắn nhất trong catalog free** (đếm số câu ở trang test hoặc thanh tiến độ). Đã chọn thì cố định cho cả run. Kit đóng băng: không thêm hay đổi item giữa run.
> **Ranh giới paywall:** kết quả nằm sau paywall ($1.95 theo search, chưa verify). Không có teaser free thì GT-01..03 là `[BLOCKED · behind-paywall]` và KHÔNG có số nào ở downstream. Không trả tiền để đo (`core-tech-web.md §8`).

## 1. Kit
| ID | File | Input (quy tắc trả lời) | Isolates |
|---|---|---|---|
| TK-01 | `TK-01-all-max.md` | Mọi câu chọn phương án **đồng ý mạnh nhất**, tức mép "agree" của thang Likert. Câu dạng A/B/nhiều lựa chọn thì luôn chọn **phương án đầu tiên** | kết quả có phụ thuộc câu trả lời không · có câu đảo chiều (reverse-keyed) không |
| TK-02 | `TK-02-all-min.md` | Mọi câu chọn phương án **phản đối mạnh nhất**. Câu dạng A/B/nhiều lựa chọn thì luôn chọn **phương án cuối** | so với TK-01 → answer-sensitive? |
| TK-03 | `TK-03-all-neutral.md` | Mọi câu chọn phương án **giữa**. Thang chẵn thì chọn phương án ngay phía "disagree" của điểm giữa, ghi rõ | xử lý input không phân hoá: dải giữa hay cảnh báo inconsistency |
| TK-04 | `TK-04-reload-mid-test.md` | Trả lời theo TK-01 tới ≈ 50% số câu, rồi **reload** trang | progress có được lưu không (client storage / server / không lưu) |
| TK-05 | `TK-05-offline-mid-test.md` | Trả lời theo TK-01 tới ≈ 25% số câu, bật **offline**, trả lời câu kế và bấm Next/Continue, rồi online lại | flow câu hỏi chạy trong browser hay gọi server từng câu · degradation contract |

## 2. Ground truth / rubric (đếm được, không cảm tính)
| GT | Áp cho | Rubric đếm được | Kết luận |
|---|---|---|---|
| GT-01 | TK-01 vs TK-02 | số thang (hoặc nhãn type) **khác nhau** giữa hai kết quả | ≥ 1 khác → `answer-sensitive` · 0 khác → `answer-insensitive` (kết quả generic) |
| GT-02 | TK-01 | số thang ở mức max ÷ tổng số thang | = tổng → không có câu đảo chiều (hoặc chấm thô) · < tổng → có reverse-keying |
| GT-03 | TK-03 | kết quả ở dải giữa ("balanced" / "moderate" / điểm ~50%) **hoặc** có cảnh báo trả lời thiếu nhất quán | ghi nhận nhánh nào; không có đáp án đúng duy nhất |
| GT-04 | TK-04 | chỉ số câu hiển thị sau reload và đáp án cũ còn hay mất | `resume` (= câu trước reload) · `restart` (= câu 1) · `partial` |
| GT-05 | TK-05 | số câu trả lời được khi offline, cộng copy lỗi VERBATIM (nếu có) | `client-side flow` (tiếp tục được) · `server-per-question` (lỗi ngay câu kế) · `hang` (treo, không báo) |

## 3. Không đo (ngoài kit, lý do)
| Cái gì | Vì sao |
|---|---|
| Độ "đúng" tâm lý học của kết quả | không có ground truth khách quan cho một người research; chỉ đo được tính nhất quán và tính phụ thuộc câu trả lời |
| Chất lượng report trả phí | behind-paywall, không mua để đo |

## AI Notices
- Kit do agent thiết kế trước drive, dựa trên category đã frame (search `[LIVE:web]`). Paywall trên có thể chặn GT-01..GT-03, nên cần đọc lại sau drive.
