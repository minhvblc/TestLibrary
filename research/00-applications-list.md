# [testlib] — Danh sách web app khảo sát
> Scope: thư viện bài test tâm lý / tính cách, dạng quiz-funnel · thị trường mục tiêu `en-US` (XTW_LANG) · region quan sát: VN (IP, Cloudflare POP SIN) · **full** · 2026-09-27 · mode `full-mvp`. Mọi site phải **mở được trong Chrome research** (không mở được thì ngoài scope, ghi lý do).
**Changelog** (mới nhất trước)
- 2026-09-27 · v1 · claude-opus-5-5 · theo quyết định của user: chỉ drive **testlibrary.com**. Các site cùng category chỉ ghi nhận ở §2 (nguồn web search, không drive).

## 1. Sites để drive

| # | Product | Công ty | URL (marketing · app) | Reachability (`wtech.sh l0` · EV) | Mô hình kiếm tiền (giá thấy trên pricing page) | Feature nổi bật | Cần tài khoản? | Priority | Teardown |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Testlibrary | Revuelto Sàrl (Contact) · Aura Health LLC / Testing Solutions LLC (văn bản) | `https://testlibrary.com/` (marketing + app cùng host) | curl: **403 Cloudflare challenge** (`bot-blocked` với client không phải browser); Chrome research qua được im lặng → reachable · EV-TLW-001 · EV-TLW-002 | trial trả phí → subscription: "$1.95 then $39.95 every 4 weeks." · "28-day Full Access $39.95" · "One Time $57.00" (USD, en-US, IP VN) · EV-TLW-025 | 30 bài test (có nhóm sức khoẻ tinh thần), 25 funnel SEO free, report dài + PDF, dashboard giữ chân | report thật: có (tài khoản sinh sau checkout); bài free: không | P0 deep | `apps/testlibrary-web/teardown.md` |

## 2. Ngoài scope

| Site | Vì sao | Bằng chứng |
|---|---|---|
| mytraitsprofile.com | user chọn chỉ drive testlibrary.com (Phase 0). Theo search summary: cùng mô hình $1.95 → $39.95/4 tuần | web search 2026-09-27 `[LIVE:web]` (không drive) |
| personality.co | như trên (search summary: 7 ngày → $39.95/4 tuần) | web search 2026-09-27 `[LIVE:web]` |
| mypersonality.net | như trên (search summary: $1.99 trial 7 ngày → $27.88/tháng) | web search 2026-09-27 `[LIVE:web]` |
| 16personalities.com · truity.com | như trên (leader category, mô hình freemium/mua lẻ) | web search 2026-09-27 `[LIVE:web]` |

> Số trong §2 là `[LIVE:web]`: không được dùng làm mốc giá, không được dùng cho feature-lock.

## 3. Coverage ledger

| Site | first-visit | onboarding | core | unlock/paywall | limits/quota | billing/settings | responsive |
|---|---|---|---|---|---|---|---|
| testlibrary.com | LIVE-full | partial | LIVE-full | LIVE-full | absent | partial | LIVE-full |

Ghi chú từng ô (theo thứ tự cột):
- first-visit: fresh context, frame đầu trước mọi click; không có banner/popup ở IP VN (EV-TLW-002). Hành vi IP EU = `[BLOCKED · geo]`.
- onboarding: funnel (giới tính → loader → hướng dẫn → 100 câu → analyzing → offer) LIVE-full (EV-TLW-080–108). Onboarding sau thanh toán (đặt mật khẩu) của tài khoản này đã qua trước phiên, chỉ có lời kể human (`one-shot-burned` cho phần đó).
- core: bài free + bài 100 câu + làm test member + report (EV-TLW-053–079 · 215–245).
- unlock/paywall: mọi surface đã gặp đều đã capture: pricing (chỉ có 1 chu kỳ), 3 checkout pricing, upsell kết quả free, offer, checkout funnel, plan details (EV-TLW-023–039 · 079 · 108–113 · 247).
- limits/quota: không có quota nào trên free tier (bài free làm lại không giới hạn, 5 run). Trial không hiện meter.
- billing/settings: Plan details đã xem (Type "Cancelled"). Luồng huỷ trong tài khoản là thao tác của human, và gói đã huỷ nên không thấy trạng thái gói đang active.
- responsive: 390 cho landing, pricing, offer, checkout funnel, free test, dashboard, report, library (EV-TLW-203–207 · 255–258).

Coverage = 4/7 ô LIVE-full ≈ 57%.

## 4. Kết luận sơ bộ

Chỉ một site nên không có "archetype so sánh". Testlibrary đại diện nhánh **quiz-funnel trial→subscription** của category (theo search, nhánh này có nhiều site na ná). Nhánh **freemium/mua lẻ** (16personalities, truity) chưa được drive → mọi nhận định "thị trường" chỉ đúng cho nhánh funnel. Đây là giới hạn chính của bộ research này (xem `research-synthesis.md` Fidelity note).

## 5. AI Notices
- Scope 1 site là quyết định của user (Phase 0). Template "full" khuyến nghị 6–10 site, nên đây là độ lệch có chủ đích, được ghi lại ở đây.
- Giá ở §2 đến từ tóm tắt của công cụ search, không phải capture.
