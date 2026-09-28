# [SCR-PUB-02] Thư viện bài test
**Meta**

| id | module | doc level | platforms | route | access | indexable | viewports | related FLOW | status | design | tracking | api | Evidence / visual basis |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| SCR-PUB-02 | PUB | Short | Web | `/tests` · `/tests?topic=<topic>` | public | index | 390 · 768 · 1280 | FLOW-lam-bai-mien-phi | Draft | (sau design) | `tracking-events.md` → `test_library` | §5 (inline) | **EV-TLW-050 · EV-TLW-051 · EV-TLW-052 · SC-TLW-11 · basis RS·F-03 · F-04 · CS-02** |

**Changelog** (mới nhất trước)
- 2026-09-28 · v1.1 · claude-opus-5-5 · quyết định 2026-09-28 (AI · uỷ quyền human): AI Notice chủ đề theo nguồn nội dung đã chốt (Q-07); thêm notice trang chủ đề `?topic=` với route render sẵn (Q-09). Không đổi hành vi.
- 2026-09-27 · v1 · claude (subagent) · khởi tạo từ blueprint.

## 1. Purpose

Danh sách mọi bài đang phát hành, lọc theo chủ đề. Mỗi bài dẫn tới trang bài (SCR-PUB-03) để bắt đầu làm ngay, không đi qua trang giá. Đối thủ làm ngược lại: thư viện ở site gốc dẫn về pricing (RS·F-03), còn các bài free chỉ lộ ra qua nút "Free Tests" ở footer (RS·F-04). Ở đây mọi bài nằm chung một lưới, số câu và thời gian là số thật. · basis RS·F-03 · F-04 · CS-02

## 2. Điều hướng

### 2.1 Vào

| Vào qua | Từ | Trigger |
|---|---|---|
| NAV-PUB-01-2 | SCR-PUB-01 | "Take a free test" |
| NAV-PUB-04-1 | SCR-PUB-04 | "Take a free test" (thẻ Free) |
| NAV-PUB-04-5 | SCR-PUB-04 | "Take a test to unlock" (thẻ One report) |
| NAV-TEST-02-4 | SCR-TEST-02 | "Take another test" |
| NAV-APP-02-3 | SCR-APP-02 | "Take your first test" |
| NAV-PUB-01-5 | SCR-PUB-01 | "Browse all tests" (state Empty) |
| NAV-PUB-03-6 | SCR-PUB-03 | "Browse all tests" (state Empty / Error / Locked) |
| NAV-TEST-01-8 | SCR-TEST-01 | "Browse all tests" (state Empty / Locked) |
| NAV-TEST-02-9 | SCR-TEST-02 | "Browse all tests" (state Error / Locked) |
| shell | "Tests" ở header public / app + drawer @390 | SYS-NAV §1 |
| entry ngoài | URL trực tiếp (kể cả `?topic=`) · SEO | SYS-NAV §4 |

### 2.2 Ra

| NAV-ID | Tới (SCR-ID · tham số) | Trigger (CMP-ID "nhãn") | Kiểu | URL / history | Animation | Back / đóng → | Guard / điều kiện | Nền tảng | Basis |
|---|---|---|---|---|---|---|---|---|---|
| NAV-PUB-02-1 | SCR-PUB-03 · `slug` | CMP-04 "Start test" | push | `/tests/:slug` (push) | mặc định | back trình duyệt → SCR-PUB-02 (giữ bộ lọc + vị trí cuộn) | — | Web | CS-02 |
| NAV-PUB-02-2 | (cùng màn) lọc theo chủ đề | CMP-03 chip ("All" · "Personality" · "Relationships" · "Career" · "Wellbeing") | inline | `?topic=<topic>` (replace) | mặc định | — | — | Web | in-house |

## 3. Layout & components

- **Bố cục @390 (top→bottom):**
  - header;
  - H1 "All tests" + dòng đếm số bài;
  - hàng chip chủ đề (xuống dòng khi thiếu chỗ);
  - lưới card, 1 cột;
  - footer.

| CMP-ID | Component | Type / GC- | Behavior & rules | Basis (EV / Q / in-house) |
|---|---|---|---|---|
| CMP-01 | Header | GC-SiteHeader (public) | theo GC; mục "Tests" ở trạng thái đang chọn | SYS-NAV §1 |
| CMP-02 | Tiêu đề + số bài | H1 + dòng đếm | "All tests" + "[n] tests" (số ít: "1 test"); n là số bài `published` thật theo bộ lọc đang chọn, ví dụ "24 tests"; không làm tròn, không thổi phồng | EV-TLW-051 · in-house |
| CMP-03 | Chip lọc chủ đề | nhóm chip chọn một (radio) | "All" · "Personality" · "Relationships" · "Career" · "Wellbeing"; mặc định "All"; chọn chip → lọc tại chỗ + ghi `?topic=` (replace) (BR-PUB-04) | in-house |
| CMP-04 | Lưới bài | GC-TestCard | mỗi card: tên bài, 1 câu mô tả, "[n] questions" · "About [m] min", nút "Start test" (cả card bấm được, cùng đích NAV-PUB-02-1); bài `sensitive` có nhãn "Wellbeing · Not a diagnosis" (BR-PUB-03); thứ tự do biên tập (API-CAT-01) | EV-TLW-051 · EV-TLW-052 · BR-PUB-05 |
| CMP-05 | Footer | GC-SiteFooter | theo GC | SYS-NAV §1 |

## 4. States

| State | Trigger | Hiển thị | EV / basis |
|---|---|---|---|
| Default | API-CAT-01 trả ≥ 1 bài theo bộ lọc | đủ CMP-01…05 | EV-TLW-050 |
| Loading | điều hướng phía client hoặc đổi chip (lần đầu SSR, không có loading) | skeleton card trong CMP-04; chip vẫn bấm được | tieu-chuan-chung §3 |
| Empty | chủ đề đang chọn chưa có bài | "No tests in this topic yet." + nút "Show all tests" (= chọn chip "All", NAV-PUB-02-2) | in-house |
| Error | API-CAT-01 lỗi khi điều hướng client / đổi chip | giữ lưới đang có + banner "You're offline. Check your connection and try again." (mất mạng) hoặc "Something went wrong on our side. Please try again." (5xx), kèm nút thử lại | tieu-chuan-chung §2 |
| Locked | N/A — trang public, không có nội dung khoá | — | 00-overview §3 |

## 5. API

| API | Method | When called |
|---|---|---|
| API-CAT-01 | GET | render (SSR) + điều hướng client + đổi chip; tham số `topic` (bỏ trống = tất cả); trả mọi bài `published` của chủ đề + `meta.total` (số hiện ở CMP-02); MVP không phân trang giao diện |

Lỗi riêng: `topic` không hợp lệ → server xử lý như "All" (EC-01). Còn lại theo `00-quy-uoc-api` §4.

## 6. Tracking

| Event | Note |
|---|---|
| `screen_active` · `test_library` | bắn khi vào route, sau consent; đổi chip (`?topic=`, replace) không bắn lại |

## 7. Business rules & edge cases

| BR-ID | Rule | Basis |
|---|---|---|
| BR-PUB-03 | Bài `sensitive` hiện nhãn "Wellbeing · Not a diagnosis" trên card (Q-06) | Q-06 · BR-APP-06 |
| BR-PUB-04 | Bộ lọc giữ trên URL `?topic=` để chia sẻ/refresh được | in-house |

| EC-xx | Tình huống | Handling | Basis |
|---|---|---|---|
| EC-01 | `?topic=` lạ hoặc sai chính tả | hiện như "All"; URL sửa về `/tests` (replace) | in-house |
| EC-02 | Back từ trang bài (NAV-PUB-02-1) | về đúng chip đang chọn + vị trí cuộn | CS-02 · SYS-NAV §2 |
| EC-03 | JavaScript tắt | SSR render lưới theo `?topic=`; chip là link thường `?topic=<topic>` | cong-nghe-loi §3 · tieu-chuan-chung §8 |
| EC-04 | Canonical của trang đã lọc | `topic` không phải query theo dõi nên giữ trong canonical; query khác (utm…) bị bỏ | tieu-chuan-chung §8 |

## 8. Responsive deltas

| Aspect | 390 (gốc) | 768 | 1280 |
|---|---|---|---|
| Tiêu đề + số bài | xếp chồng | cùng hàng, số bài bên phải | như 768 |
| Chip chủ đề | xuống dòng khi thiếu chỗ, không cuộn ngang | một hàng | một hàng |
| Lưới bài | 1 cột | 2 cột | 3 cột, container tối đa 1120 |

## 9. Keyboard & focus

Nhóm chip là `role="radiogroup"`: Tab vào nhóm, ←/→ đổi chip và lọc ngay. Sau khi lọc, dòng "[n] tests" được đọc qua `aria-live="polite"`. Còn lại theo `tieu-chuan-chung §5`.

## 10. AI Notices
- Bốn chủ đề (cộng chip "All") khớp nguồn nội dung đã chốt ở Q-07: "Personality" (IPIP) · "Career" (RIASEC tự soạn) · "Relationships" (tự soạn) · "Wellbeing" (bài `sensitive`). Nguồn thật vẫn là trường `topic` của từng bài; thêm chủ đề = thêm chip, không đổi layout.
- Q-09 chốt route public render sẵn (SSG + revalidate), nhưng trang chủ đề `?topic=` có title / canonical riêng (seo-meta §1) và EC-03 cần HTML đúng theo `topic`; Next.js render theo request khi trang đọc query. Cách làm chờ owner Q-09 / seo-meta xác nhận (seo-meta §5).
- Thứ tự bài lấy theo thứ tự biên tập mà API-CAT-01 trả về; MVP chưa có sắp xếp nào khác.
