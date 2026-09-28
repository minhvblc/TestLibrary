TestLib (tên tạm, Q-01) — file web cho go-to-market
Chép từ skeleton của xteam-research-docs-web rồi điền theo docs/go-to-market/seo-meta.md + 00-gtm-strategy.md.
KHÔNG soạn copy trong các file này: sửa file .md nguồn trước, rồi chép sang.

1. File nào đặt ở đâu (monorepo webApp/)
  robots.txt            -> webApp/public/robots.txt             (giữ đúng tên file)
  sitemap.xml           -> webApp/public/sitemap.xml            (giữ đúng tên; các URL /tests/<slug> sinh lúc build)
  manifest.webmanifest  -> webApp/public/manifest.webmanifest   (giữ đúng tên)
  head-meta.html        -> <head> của route "/" (index.html hoặc layout SSR); mỗi route index khác có block riêng lấy từ seo-meta.md §1
  icon                  -> webApp/public/icons/icon-192.png, icon-512.png, icon-512-maskable.png; webApp/public/favicon.ico
  ảnh OG                -> webApp/public/og/: home.png, tests.png, pricing.png, legal.png, help.png, tests/<slug>.png (1200x630 mỗi ảnh)

2. Placeholder phải thay trước khi ra mắt
  <domain>                  -> domain thật (Q-01) trong robots.txt, head-meta.html.
                               Trong sitemap.xml placeholder được escape thành &lt;domain&gt; (XML không cho < > trong <loc>) — thay cả dạng này.
  "TestLib"                 -> tên sản phẩm chốt (Q-01) trong manifest.webmanifest (name, short_name ≤ 12 ký tự) và head-meta.html
  #FFFFFF                   -> màu theme / nền từ base-ui/FND-tokens.md (Q-17)
  legalName, support@...    -> pháp nhân + email hỗ trợ (Q-05)
  URL bài trong sitemap     -> mỗi bài published một <url> (API-CAT-01); hai dòng ví dụ trong comment chỉ để minh hoạ

3. Luật phải giữ sau khi thay
  - robots.txt Disallow chỉ là gợi ý crawl; thẻ noindex / header X-Robots-Tag trên từng route riêng tư mới giữ route khỏi kết quả tìm kiếm (seo-meta.md §4).
  - Không bao giờ đưa route noindex vào sitemap.xml.
  - Route public phải render phía server hoặc prerender để crawler không chạy JS thấy meta riêng từng route (Q-09).
  - Không thẻ analytics / quảng cáo trong head-meta.html: Firebase Analytics chỉ tải sau consent qua AppTracking (TD-04).
  - Q-03 đã chốt (2026-09-28). Giá trong meta / OG / JSON-LD (nếu có) phải khớp docs/overview/00-overview.md §2 và lấy từ cùng nguồn với API-PAY-01, không gõ tay.
  - /cancel (SCR-PAY-05) là route index, có trong sitemap.xml; biến thể ?mode= / ?order= không đưa vào sitemap (canonical về /cancel).
