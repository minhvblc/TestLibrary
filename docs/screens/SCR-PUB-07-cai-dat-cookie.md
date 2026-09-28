# [SCR-PUB-07] Cài đặt cookie
**Meta**

| id | module | doc level | platforms | route | access | indexable | viewports | related FLOW | status | design | tracking | api | Evidence / visual basis |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| SCR-PUB-07 | PUB | Short | Web | `/cookie-settings` | public | noindex | 390 · 768 · 1280 | FLOW-quyen-rieng-tu | Draft | (sau design) | `tracking-events.md` → `cookie_settings` · ft_consent | §5 (inline) | **EV-TLW-002 · EV-TLW-015 · basis RS·F-02 · Q-13 · Q-20 · SYS-CONSENT** |

**Changelog** (mới nhất trước)
- 2026-09-28 · v1.2 · claude-opus-5-5 · quyết định 2026-09-28 (AI · uỷ quyền human): GPC theo SYS-CONSENT (Q-20) — thêm CMP-09 (câu giải thích GPC), EC-07 · EC-08; §5 schema API-CON-01 có `source` (`banner` · `settings` · `gpc`) + `gpc` + `decidedAt`; ft_consent save thêm `source`; §10: GPC đã quyết, Q-12 đã chốt.
- 2026-09-28 · v1.1 · claude-opus-5-5 · D-05: cho phép analytics lần đầu tại trang này bắn ft_consent start (`from` = cookie_settings) ngay trước save. D-18: API-CON-01 dùng `consentId` làm `Idempotency-Key`; mục §5 sở hữu schema.
- 2026-09-27 · v1 · claude (subagent) · khởi tạo từ blueprint.

## 1. Purpose

Trang để xem và đổi lựa chọn cookie bất kỳ lúc nào: bật/tắt "Analytics" và "Marketing", "Necessary" luôn bật; "Reject all" ngang hàng "Accept all". Đối thủ không có banner hay trang cài đặt nào, pixel quảng cáo chạy ngay từ lần vào đầu (RS·F-02 · EV-TLW-002). Đây là trang có route, không phải dialog, để link được từ footer, banner, văn bản cookie và tài khoản, và đóng được bằng back trình duyệt (00-overview §3). Trình duyệt gửi Global Privacy Control (GPC) thì lựa chọn đã được lưu sẵn là "Reject all"; trang giải thích bằng CMP-09 và vẫn cho bật lại analytics (Q-20 · SYS-CONSENT "GPC"). · basis RS·F-02 · Q-13 · Q-20 · SYS-CONSENT

## 2. Điều hướng

### 2.1 Vào

| Vào qua | Từ | Trigger |
|---|---|---|
| NAV-PUB-05-1 | SCR-PUB-05 | "Cookie settings" (doc `cookies`) |
| NAV-ACC-01-3 | SCR-ACC-01 | "Cookie settings" |
| footer | "Cookie settings" ở mọi trang | SYS-NAV §1 |
| banner | GC-ConsentBanner, nút "Manage" | SYS-CONSENT |

### 2.2 Ra

| NAV-ID | Tới (SCR-ID · tham số) | Trigger (CMP-ID "nhãn") | Kiểu | URL / history | Animation | Back / đóng → | Guard / điều kiện | Nền tảng | Basis |
|---|---|---|---|---|---|---|---|---|---|
| NAV-PUB-07-1 | SCR-PUB-05 · `doc=cookies` | CMP-07 "Cookie policy" | push | `/legal/cookies` (push) | mặc định | back trình duyệt → SCR-PUB-07 | — | Web | SYS-CONSENT |
| NAV-PUB-07-2 | (cùng màn) lưu lựa chọn | CMP-04 "Save choices" / CMP-05 "Reject all" / CMP-06 "Accept all" | overlay | không đổi URL | mặc định | toast tự tắt | — | Web | BR-APP-05 |

## 3. Layout & components

- **Bố cục @390 (top→bottom):**
  - header;
  - H1 + đoạn giới thiệu;
  - (trình duyệt gửi GPC) dòng thông báo GPC;
  - 3 nhóm cookie (tên nhóm · mô tả · switch bên phải);
  - hàng nút: "Reject all" + "Accept all" (hai nút bằng nhau, cùng hàng), dưới là "Save choices" full width;
  - link "Cookie policy";
  - footer.

| CMP-ID | Component | Type / GC- | Behavior & rules | Basis (EV / Q / in-house) |
|---|---|---|---|---|
| CMP-01 | Header | GC-SiteHeader (public) | theo GC | SYS-NAV §1 |
| CMP-02 | Giới thiệu | H1 + đoạn | H1 "Cookie settings" · "Choose which cookies we can use." · "You can change this at any time." | SYS-CONSENT |
| CMP-03 | 3 nhóm cookie | switch ×3 | "Necessary" — luôn bật, khoá: "Keeps you signed in, remembers your choices and protects forms. Always on." · "Analytics" — mặc định tắt: "Helps us see which pages people use. Never includes your answers, scores or results." · "Marketing" — mặc định tắt: "We don't use marketing cookies yet. If we add any, we'll ask you first." Giá trị ban đầu = lựa chọn đã lưu trong `tl_consent`; chưa có thì tắt | SYS-CONSENT · BR-APP-05 · Q-12 |
| CMP-04 | Nút "Save choices" | button chính | lưu đúng trạng thái 3 switch đang hiện; lưu xong → toast "Your cookie choices are saved." (NAV-PUB-07-2) | BR-PUB-14 |
| CMP-05 | Nút "Reject all" | button, cùng cỡ / màu / độ đậm với CMP-06 | analytics = denied · marketing = denied, lưu ngay, cùng toast như CMP-04 | BR-PUB-13 |
| CMP-06 | Nút "Accept all" | button, cùng cỡ / màu / độ đậm với CMP-05 | analytics = granted · marketing = granted, lưu ngay, cùng toast như CMP-04 | BR-PUB-13 |
| CMP-07 | Link "Cookie policy" | link | → `/legal/cookies` (NAV-PUB-07-1) | SYS-CONSENT |
| CMP-08 | Footer | GC-SiteFooter | theo GC | SYS-NAV §1 |
| CMP-09 | Thông báo GPC | đoạn chữ ngay dưới CMP-02, trên CMP-03 | chỉ hiện khi trình duyệt đang gửi GPC VÀ lựa chọn đang lưu do GPC (`source` = `gpc`): "Your browser sent a Global Privacy Control signal, so we've turned off analytics and marketing cookies. You can turn analytics back on below if you want to." Lưu một lựa chọn ở trang này (CMP-04 / 05 / 06) thì ẩn | Q-20 · SYS-CONSENT ("GPC · bật lại") |

## 4. States

| State | Trigger | Hiển thị | EV / basis |
|---|---|---|---|
| Default | luôn | đủ CMP-01…08; switch theo `tl_consent`, chưa có thì tắt. Trình duyệt gửi GPC và lựa chọn đang lưu do GPC → thêm CMP-09, switch "Analytics" / "Marketing" tắt (EC-07) | SYS-CONSENT · Q-20 |
| Loading | đang lưu (API-CON-01) | 3 nút disable; nút vừa bấm có spinner (chỉ khi > 300 ms) | tieu-chuan-chung §3 |
| Empty | N/A — luôn có 3 nhóm | — | SYS-CONSENT |
| Error | API-CON-01 lỗi mạng / 5xx | vẫn ghi cookie `tl_consent` trên trình duyệt và áp dụng ngay; bản ghi server gửi lại ngầm ở lần tải trang kế; toast "Saved on this device." | cong-nghe-loi §4 · in-house |
| Locked | N/A — trang public | — | 00-overview §3 |

## 5. API

| API | Method | When called |
|---|---|---|
| API-CON-01 | POST | bấm CMP-04 / CMP-05 / CMP-06 (trang này gửi `source` = `settings`); `Idempotency-Key` = `consentId` (UUID client mới cho mỗi lần lưu, gửi lại ngầm dùng lại giá trị đó; cùng quy ước với GC-ConsentBanner — 00-quy-uoc-api §5). Mục này là nơi sở hữu schema API-CON-01 (body ở bảng dưới); đã đăng nhập thì server gắn tài khoản từ `tl_session` |

| Body field (API-CON-01) | Type | Required | Meaning | Basis |
|---|---|---|---|---|
| `analytics` | enum `granted` · `denied` | có | lựa chọn nhóm "Analytics" | BR-APP-05 |
| `marketing` | enum `granted` · `denied` | có | lựa chọn nhóm "Marketing" (MVP chưa có script marketing) | Q-12 |
| `consentVersion` | string | có | version banner / chính sách lúc chọn | SYS-CONSENT (Version) |
| `decidedAt` | ISO-8601 | có | thời điểm chọn trên trình duyệt; gửi lại ngầm thì giữ giá trị cũ | GC-ConsentBanner §4 |
| `source` | enum `banner` · `settings` · `gpc` | có | `banner` = GC-ConsentBanner · `settings` = trang này · `gpc` = consent manager tự lưu denied khi trình duyệt gửi GPC, không có thao tác của user | Q-20 · SYS-CONSENT ("GPC · lưu") |
| `gpc` | boolean | có | trình duyệt có gửi GPC lúc lưu (`navigator.globalPrivacyControl`); server đối chiếu header `Sec-GPC` của request | Q-20 · SYS-CONSENT |

Lỗi riêng: không có copy riêng — mọi lỗi đi vào state Error (lưu local trước, gửi server sau). Còn lại theo `00-quy-uoc-api` §4.

## 6. Tracking

| Event | Note |
|---|---|
| `screen_active` · `cookie_settings` | chỉ bắn khi analytics đã granted từ trước lúc mở trang |
| ft_consent · start | mở trang khi analytics đã granted; hoặc, khi cho phép analytics lần đầu tại trang này, bắn ngay sau khi SDK tải và trước save (EC-04). Chỉ bắn được khi analytics đã được cho phép (tracking-events) |
| ft_consent · save | lưu với analytics = granted; param `analytics` · `marketing` · `source` = settings; lưu với analytics = denied thì không có event nào. GPC tự lưu denied cũng không có event (tracking-events) |

## 7. Business rules & edge cases

| BR-ID | Rule | Basis |
|---|---|---|
| BR-PUB-13 | "Reject all" và "Accept all" cùng cấp độ thị giác (legal-consent §3) | tieu-chuan-chung §10 · RS·F-02 |
| BR-PUB-14 | Lưu → API-CON-01 + cookie `tl_consent`; rút analytics → gỡ SDK ở lần tải trang kế (SYS-CONSENT) | SYS-CONSENT · TD-04 |

| EC-xx | Tình huống | Handling | Basis |
|---|---|---|---|
| EC-01 | Đổi switch rồi rời trang mà không bấm lưu | không lưu gì; quay lại thấy giá trị đã lưu trước đó | in-house |
| EC-02 | Chưa trả lời banner, vào trang từ footer | switch mặc định tắt; lưu ở đây coi như đã trả lời banner, banner không hiện lại tới khi đổi version | SYS-CONSENT |
| EC-03 | Rút analytics khi SDK đang chạy | `AppTracking` ngừng gửi ngay lúc lưu; gỡ SDK + xoá cookie analytics ở lần tải trang kế | BR-PUB-14 · SYS-CONSENT |
| EC-04 | Cho phép analytics lần đầu tại trang này | tải SDK ngay, không cần reload, rồi bắn ft_consent start (`from` = cookie_settings) + save; không bắn bù `screen_active` cho trang hiện tại | TD-04 · tracking-events |
| EC-05 | Analytics = granted nhưng user đang ở route bài `sensitive` | vẫn không tải analytics trên route đó | BR-APP-06 |
| EC-06 | Hai tab mở cùng lúc | tab còn lại áp dụng lựa chọn mới ở lần điều hướng kế tiếp (đọc lại `tl_consent`) | in-house |
| EC-07 | Trình duyệt gửi GPC | banner không hiện; lựa chọn đã được lưu sẵn: analytics + marketing = denied, `source` = `gpc` (SYS-CONSENT "GPC"). Mở trang này: CMP-09 hiện, switch "Analytics" / "Marketing" tắt; không `screen_active`, không ft_consent | Q-20 · SYS-CONSENT |
| EC-08 | Có GPC, user bật "Analytics" rồi "Save choices" (hoặc "Accept all") | lựa chọn tường minh thắng GPC: lưu `source` = `settings`, `gpc` = true; tải SDK và bắn ft_consent như EC-04; CMP-09 ẩn. GPC không ghi đè lựa chọn này tới khi đổi version hoặc quá 12 tháng. Marketing: MVP không có script; sau này conversion phía server không chạy khi có GPC (Q-12) | Q-20 · Q-12 · SYS-CONSENT |

## 8. Responsive deltas

| Aspect | 390 (gốc) | 768 | 1280 |
|---|---|---|---|
| Nhóm cookie | xếp dọc, switch bên phải tên nhóm | như 390 | như 390, cột nội dung rộng tối đa 720 |
| Nút | hàng 1: "Reject all" + "Accept all" (2 cột bằng nhau); hàng 2: "Save choices" full width | 3 nút cùng hàng, "Reject all" và "Accept all" cùng độ rộng | như 768 |

## 9. Keyboard & focus

Mỗi nhóm là `role="switch"` (Space bật/tắt; mô tả gắn `aria-describedby`). "Necessary" vẫn nhận focus, đọc "Always on", không đổi được. Toast đọc qua `aria-live="polite"`; focus giữ ở nút vừa bấm. Còn lại theo `tieu-chuan-chung §5`.

## 10. AI Notices
- Nhóm "Marketing" vẫn hiện dù MVP chưa có script marketing: Q-12 (đã chốt) để ngỏ conversion phía server sau này, chỉ sau consent marketing và không khi có GPC. Thêm script marketing = tăng version, hỏi lại.
- Mô tả từng nhóm phải khớp bảng cookie trong `doc=cookies` và `go-to-market/legal-consent.md` §2. Cookie tạm `tl_oauth` của luồng Google (xem `docs/api/SCR-AUTH-01-api.md`) thuộc nhóm "Necessary".
- GPC đã quyết (Q-20, 2026-09-28): rule duy nhất ở SYS-CONSENT; trang này chỉ hiện CMP-09 và nhận lựa chọn tường minh (EC-07 · EC-08). Văn bản đối thủ cũng nhắc GPC (EV-TLW-045). Căn cứ pháp lý `[BK]` chờ verify (`bang-quyet-dinh` §2 #6), kết quả chỉ có thể nới.
