# [testlib] Bối cảnh pháp lý 2026: gia hạn tự động, huỷ / rút hợp đồng, dữ liệu sức khoẻ, tín hiệu consent, người chưa thành niên
> Research đầu vào cho legal review (Q-05) và cho các quyết định Q-16 · Q-18 · Q-20 · Q-21 · Q-22. **Không phải tư vấn pháp lý.** Không kết luận gì về tính hợp pháp của đối thủ.
**Changelog** (mới nhất trước)
- 2026-09-28 · v1 · claude-opus-5-5 · một lượt WebSearch (34 query, hết ngân sách 200 search của phiên); WebFetch bị chặn ở ftc.gov, eur-lex.europa.eu, leginfo.legislature.ca.gov, legislation.gov.uk.

## 0. Cách đọc

| Nhãn | Nghĩa | Dùng được tới đâu |
|---|---|---|
| `[LIVE:web]` | có trong kết quả search của phiên này (tóm tắt do công cụ viết, kèm URL nguồn). §1–§3 | làm căn cứ để **đặt câu hỏi** và đề xuất; vẫn cần legal review trước khi chốt |
| `[INFERRED · BK-H/M/L]` | kiến thức nền của model (tới khoảng giữa 2026), **chưa verify** trong phiên này; H/M/L = mức tin cao / vừa / thấp. §4–§7 và một số ô ở §1–§3 | chỉ là manh mối; KHÔNG dùng làm căn cứ quyết định trước khi verify (§10) |

Ngày trạng thái: 2026-09-28. Luật đổi nhanh; re-verify trước launch.

## 1. Mỹ — liên bang

| Quy định / vụ việc | Nội dung chính | Hiệu lực | Trạng thái 2026-09 | Nguồn | Nhãn |
|---|---|---|---|---|---|
| FTC Negative Option Rule sửa đổi ("click-to-cancel", 2024) | consent riêng cho tính năng tự gia hạn "via a checkbox or similar affirmative act"; "a simple 'click-to-cancel' mechanism for all online subscriptions" | dự kiến 14/7/2025 | **bị Toà phúc thẩm khu vực 8 huỷ toàn bộ ngày 8/7/2025** (FTC không làm phân tích sơ bộ theo Section 22). Rule gốc 1973 (16 CFR 425) vẫn còn `[BK-H]` | cooley.com (2025-07-11) · lw.com (2025-07) | `[LIVE:web]` |
| FTC ANPRM mới về negative option | chưa có dự thảo; hỏi có cần rule mới không; có thể dùng lại một phần rule đã bị huỷ; trọng tâm: công bố điều khoản, consent có hiểu biết, không cản trở huỷ | ban hành 11/3/2026, đăng Federal Register 13/3/2026, hết góp ý 13/4/2026 | **đang đề xuất, giai đoạn sớm** (chưa thấy NPRM) | federalregister.gov 2026-04952 · ftc.gov (2026-01, 2026-03) · cov.com | `[LIVE:web]` |
| ROSCA (luật liên bang về subscription online) | công bố rõ mọi điều khoản trước khi thu thông tin thanh toán; consent có hiểu biết; cách huỷ đơn giản | 2010 | **đang hiệu lực**, là căn cứ của các vụ dưới | goodwinlaw.com (2026-02) · arnoldporter.com (2026-02) | `[LIVE:web]` |
| Amazon Prime | $2,5 tỉ (1 tỉ phạt + 1,5 tỉ hoàn tiền) vì dark pattern khi đăng ký / huỷ Prime | 25/9/2025 | đã dàn xếp | ftc.gov · katten.com | `[LIVE:web]` |
| Match Group · Chegg · Instacart · Shutterstock | $14M (8/2025) · $7,5M (2025) · $60M hoàn tiền (18/12/2025, trial chuyển sang gói năm thiếu công bố) · $35M (13/5/2026, trial chuyển gói năm thiếu báo trước) | 2025–2026 | đã dàn xếp | ftc.gov · dglaw.com · cnbc.com · globalpolicywatch.com · proskauer.com | `[LIVE:web]` |
| Uber One · JustAnswer | FTC + các bang kiện Uber One (toà cho phần lớn claim đi tiếp, 4/2026); JustAnswer: offer "$1 or $5" dẫn tới subscription "$28–$125" mỗi tháng (kiện 1/2026) | — | **đang kiện** | ftc.gov · allaboutadvertisinglaw.com | `[LIVE:web]` |
| **Genesis Tech et al.** (gần nhất với category) | sản phẩm gồm Wisey ("an ADHD/productivity self-help course"); cáo buộc mô hình "lure consumers with a free or low-cost offer, build commitment through quizzes or personalization, obscure auto-renewal terms, impose unexpected recurring charges, and make cancellation difficult"; FTC xem xét cả funnel "quizzes, personalization claims, pricing displays, and payment overlays to post-purchase upsells and cancellation flows" | đơn kiện 2/6/2026 | **đang kiện** | ftc.gov (2026-06) · consumerfinancemonitor.com (2026-07-01) · sigmalawgroup.com (2026-07-07) | `[LIVE:web]` |
| Báo cáo FTC "Bringing Dark Patterns to Light" | nêu các chiêu phổ biến, gồm "making it difficult to cancel subscriptions or charges" | 14/9/2022 | hướng dẫn, không ràng buộc | ftc.gov PDF | `[LIVE:web]` |
| Rà soát dark pattern FTC + ICPEN + GPEN | 642 site / app subscription, "nearly 76%" có ít nhất một dark pattern | 7/2024 | thông tin | ftc.gov (2024-07) | `[LIVE:web]` |

## 2. Mỹ — luật gia hạn tự động theo bang (ARL)

| Bang | Yêu cầu chính (theo tóm tắt search) | Hiệu lực | Trạng thái | Nguồn | Nhãn |
|---|---|---|---|---|---|
| **California** (ARL sửa bởi AB 2863) | (a) "express affirmative consent" là **một bước riêng**, không gộp vào chấp nhận Terms, không ô tick sẵn · (b) lưu bằng chứng consent **≥ 3 năm hoặc 1 năm sau khi hợp đồng kết thúc, lấy mốc dài hơn** · (c) trial / giá khuyến mãi: báo **3–21 ngày** trước khi hết (áp cho trial / khuyến mãi > 31 ngày `[BK-M]`) · (d) kỳ đầu ≥ 1 năm: báo **15–45 ngày** trước gia hạn · (e) **nhắc hằng năm**: sản phẩm, tần suất và số tiền, cách huỷ · (f) đổi giá: báo **7–30 ngày** trước · (g) huỷ bằng cùng kênh đã đăng ký; offer giữ chân online chỉ được kèm nút "click to cancel" hiện liên tục | 1/7/2025 (hợp đồng ký / sửa / gia hạn từ ngày đó) | **đang hiệu lực** | leginfo.legislature.ca.gov AB 2863 · cooley.com (2025-06-04) · dtolaw.com (2025-08) | `[LIVE:web]` |
| **New York** (GBL §527-a sửa 2025–26) | huỷ "as easy to use as the mechanism that the consumer used to provide consent", cùng kênh · kỳ đầu ≥ 1 năm gia hạn ≥ 6 tháng: báo 15–45 ngày trước hạn huỷ · thay đổi quan trọng: 5–30 ngày · trial > 1 tháng: 3–21 ngày · **tăng giá: phải có consent trước, hoặc cho huỷ trong ít nhất 14 ngày sau lần thu kèm hoàn tiền** | 5/11/2025 | **đang hiệu lực** | advertisinglaw.fkks.com · perkinscoie.com · nysenate.gov | `[LIVE:web]` |
| **New York City** (DCWP "Click-to-Cancel" Rule) | công bố trước, consent trước khi thu, huỷ dễ như đăng ký; kỳ ≥ 1 năm: báo 15–45 ngày; trial > 1 tháng: 3–21 ngày; thay đổi (kể cả tăng giá): 5 ngày làm việc – 30 ngày; phạt $525–$3.500 mỗi vi phạm + hoàn tiền các lần thu sau lần cố huỷ đầu tiên | thông qua 10/7/2026; **hiệu lực 1/10/2026** | **đã thông qua, 3 ngày nữa có hiệu lực** | nyc.gov · rules.cityofnewyork.us · dlapiper.com (2026-07) · skadden.com (2026-09) | `[LIVE:web]` |
| **Minnesota** (§325G.56+) | cho huỷ online; dịch vụ liên tục: báo **ít nhất mỗi năm một lần**; trial > 30 ngày: 5–30 ngày; tự gia hạn: báo 5–30 ngày trước hạn huỷ cuối (chưa rõ có áp cho gói tháng không); offer giữ chân chỉ khi khách đồng ý nghe, hỏi một lần; thiếu báo thì khách huỷ bằng mọi cách hợp lý, miễn phí | 1/1/2025 | **đang hiệu lực** | revisor.mn.gov · faegredrinker.com (2025-01) | `[LIVE:web]` |
| **Colorado** (SB25-145) | ai đăng ký online thì "always be allowed to cancel online via a one-step cancellation link" | 16/2/2026 | **đang hiệu lực** | perkinscoie.com · leg.colorado.gov | `[LIVE:web]` |
| **Virginia** (HB 1022 / SB 493) | huỷ "at least as easy to use as the method the consumer used to sign up"; không ép nói chuyện với nhân viên; nhắc cho trial > 30 ngày và gia hạn > 12 tháng (cửa sổ ngày chưa lấy được) | 1/7/2026 | **đang hiệu lực** | gtlaw.com (2026-05) · lis.virginia.gov | `[LIVE:web]` |
| **Connecticut** (SB 3, PA 25-44) | **nhắc hằng năm cho mọi hợp đồng tự gia hạn, bất kể kỳ**; huỷ qua link / nút nổi bật, email trả lời hoặc số điện thoại | 1/7/2026 | **đang hiệu lực** | cga.ct.gov · portal.ct.gov (2026) · ctmirror.org (2026-07-16) | `[LIVE:web]` |
| **Massachusetts** (940 CMR 38.05) | tính năng tự gia hạn > 31 ngày: báo 5–30 ngày trước hạn huỷ; công bố ngày hạn huỷ; huỷ dễ như đăng ký | 2/9/2025 (một tóm tắt ghi 3/2025) | **đang hiệu lực** | law.cornell.edu · mass.gov · advertisinglaw.fkks.com | `[LIVE:web]` |
| **Maryland** (SB 49 / HB 107) | trial / giảm giá > 14 ngày: báo 3–21 ngày trước gia hạn; cửa sổ báo gia hạn theo kỳ (chưa lấy được); huỷ "cost-effective, timely and easy to use" | 1/6/2026 | **đang hiệu lực** | mgaleg.maryland.gov · subscriptioninsider.com | `[LIVE:web]` |
| **Maine** (SP 650) | có vẻ yêu cầu consent riêng cho điều khoản tự gia hạn | hợp đồng từ 1/1/2026 | **đang hiệu lực** | zwillgen.com (2025) | `[LIVE:web]` |
| **Louisiana** (HB 750, Act 830/2026) | công bố, consent, huỷ dễ; miễn cho doanh nghiệp < 50 nhân viên hoặc < $5M doanh thu | 1/1/2027 | **đã ban hành, chưa hiệu lực** | legis.la.gov · kelleydrye.com (2026) | `[LIVE:web]` |

## 3. EU

| Quy định | Nội dung chính | Hiệu lực | Trạng thái 2026-09 | Nguồn | Nhãn |
|---|---|---|---|---|---|
| **Directive (EU) 2023/2673 — "withdrawal function"** (Điều 11a mới của Consumer Rights Directive) | mọi hợp đồng ký qua website / app, kể cả subscription và nội dung số; chức năng ghi "withdraw from contract here" (hoặc tương đương), nổi bật, luôn truy cập được suốt thời hạn rút; bước 1: tên, định danh hợp đồng, email nhận xác nhận; bước 2: nút "confirm withdrawal" riêng; sau đó gửi xác nhận trên durable medium kèm ngày giờ nhận | chuyển hoá trước 19/12/2025, **áp dụng từ 19/6/2026** | **đang áp dụng** (Ireland bị thư cảnh báo vì chậm; Bỉ chưa chuyển hoá tới 1/6/2026; Pháp, Đức, Ý đã chuyển hoá) | williamfry.com (2026-03) · crowell.com · legal500.com · rdj.ie · eur-lex (bị chặn) | `[LIVE:web]` |
| Đức §356a BGB (chuyển hoá chức năng rút) | nhãn "Vertrag widerrufen" và "Widerruf bestätigen"; xác nhận trên durable medium có nội dung + ngày giờ nhận | 19/6/2026 | **đang hiệu lực** | noerr.com · freshfields.com | `[LIVE:web]` |
| Quyền rút 14 ngày — **nội dung số tải về** (≈ "mở khoá report") | mất quyền rút nếu khách "expressly agrees to immediate access and acknowledges that they will lose the right to withdraw" (Điều 16(m), diễn giải hẹp); người bán phải xác nhận lại trên durable medium (Điều 8(7)) `[BK-H]` | CRD 13/6/2014; sửa đổi Omnibus 28/5/2022 `[BK-H]` | **đang hiệu lực** | insideprivacy.com (2026) | `[LIVE:web]` + `[BK-H]` |
| Quyền rút 14 ngày — **dịch vụ số / subscription** (≈ "Plus") | không thuộc danh sách ngoại lệ → vẫn có 14 ngày; nếu khách yêu cầu bắt đầu ngay thì được thu "a proportional amount" theo số ngày đã dùng (Điều 14(3)); án *Sky Österreich* (C-234/25) coi subscription streaming là "digital service", tiêu đề Lexology: khách "Cannot Waive Their 14-Day Right of Withdrawal" | án ngày 9/7/2026 (chưa đối chiếu) | **đang hiệu lực** | insideprivacy.com · lexology.com · williamfry.com | `[LIVE:web]` |
| Đức §312k BGB — **nút huỷ ("Kündigungsbutton")** | hợp đồng dài hạn ký online phải có nút huỷ ghi rõ (vd "Verträge hier kündigen") dẫn thẳng tới trang xác nhận; nút phải "constantly visible and immediately accessible … **without requiring users to enter access data**"; BGH (I ZR 161/24, 22/5/2025) áp cả hợp đồng có thời hạn trả một lần; một phán quyết BGH (chưa lấy số án) nói trang xác nhận chỉ được có thông tin bắt buộc và nút xác nhận (không offer "tạm dừng") | 1/7/2022 | **đang hiệu lực** | noerr.com · twobirds.com (2025) · natlawreview.com · technologyslegaledge.com | `[LIVE:web]` |
| Digital Fairness Act (đề xuất) | subscription trap (huỷ dễ, nhắc, consent khi trial chuyển), dark pattern, thiết kế gây nghiện, cá nhân hoá, trẻ em | đề xuất dự kiến nửa cuối 2026 `[BK-L]` | **chưa rõ** | — | `[BK-M/L]` |

## 4. Anh (chưa search được — toàn bộ `[BK]`)

| Quy định | Nội dung chính | Hiệu lực | Trạng thái | Nhãn |
|---|---|---|---|---|
| DMCC Act 2024, Phần 4 Chương 1 (thực tiễn thương mại không lành mạnh) | CMA tự xử phạt tới 10% doanh thu toàn cầu; dark pattern thuộc diện | 6/4/2025 | đang hiệu lực | `[BK-H]` |
| DMCC Act 2024, Phần 4 Chương 2 (chế độ hợp đồng subscription) | thông tin chính trước khi đăng ký; nhắc trước khi hết trial / giảm giá, trước gia hạn, và định kỳ (~6 tháng) với kỳ ngắn; cooling-off 14 ngày đầu + 14 ngày sau khi trial chuyển hoặc gia hạn kỳ ≥ 12 tháng; huỷ bằng một lần liên hệ, online nếu ký online | ban đầu "không sớm hơn mùa xuân 2026", sau có tin lùi sang mùa thu 2026 `[BK-L]` | **chưa rõ đã có văn bản khởi hiệu chưa** | `[BK-M/L]` |
| Consumer Contracts Regulations 2013 | quyền huỷ 14 ngày; nội dung số tải về mất quyền nếu khách đồng ý + xác nhận; dịch vụ bắt đầu sớm thì trả phần tương ứng | 13/6/2014 | đang hiệu lực | `[BK-H]` |

## 5. Dữ liệu sức khoẻ / nhạy cảm và pixel quảng cáo (phần lớn `[BK]`)

| Quy định / vụ việc | Nội dung chính | Hiệu lực | Nhãn |
|---|---|---|---|
| FTC Health Breach Notification Rule (sửa 2024) | áp cho "personal health record" ngoài HIPAA, gồm app và website sức khoẻ; "breach" gồm cả **tiết lộ không được phép** (vd cho nền tảng quảng cáo); chỉ áp nếu đạt điều kiện "draw information from multiple sources" | 29/7/2024 | `[BK-H]` |
| Các lệnh của FTC về dữ liệu sức khoẻ + pixel | GoodRx (2/2023) · BetterHelp (3/2023: câu trả lời intake sức khoẻ tâm thần gửi Facebook, Snapchat, Criteo, Pinterest) · Premom (5/2023) · Cerebral (4/2024: dữ liệu sức khoẻ tâm thần qua pixel + claim ROSCA về huỷ) · Monument (4/2024) — đều cấm chia sẻ dữ liệu sức khoẻ cho quảng cáo | 2023–2024 | `[BK-H/M]` |
| Washington My Health My Data Act | "consumer health data" gồm tình trạng, chẩn đoán, can thiệp tâm lý / hành vi, suy luận từ dữ liệu khác; consent để thu ngoài mức cần cho dịch vụ, consent riêng để chia sẻ; chính sách riêng link từ trang chủ; khách được tự kiện | 31/3/2024 | `[BK-H]` |
| Nevada SB 370 · Connecticut (CTDPA, dữ liệu sức khoẻ) · luật bang khác (VA, CO, CT, TX, OR…) · Maryland MODPA | dữ liệu sức khoẻ tâm thần là "sensitive", cần opt-in; MODPA chỉ cho xử lý khi "strictly necessary" và cấm bán | 2023–2026 | `[BK-H/M]` |
| GDPR Điều 9 + án CJEU | dữ liệu sức khoẻ là dữ liệu đặc biệt, căn cứ thường là consent tường minh; C-252/21 (*Meta v Bundeskartellamt*): dữ liệu thu qua pixel / SDK trên site chủ đề nhạy cảm có thể tự nó là dữ liệu đặc biệt | 25/5/2018 | `[BK-H]` |
| Thực thi 2025–2026 với site quiz / test | chỉ thấy vụ Genesis Tech (§1), theo luật subscription, không phải luật riêng tư | — | `[LIVE:web]` |

## 6. Tín hiệu consent (toàn bộ `[BK]`)

| Quy định / vụ việc | Nội dung chính | Nhãn |
|---|---|---|
| California (CCPA regs §7025 · §7004) | GPC là yêu cầu opt-out hợp lệ khỏi bán / chia sẻ; lựa chọn phải cân xứng (opt-out không nhiều bước hơn opt-in) | `[BK-H]` |
| Các bang khác bắt buộc tôn trọng tín hiệu opt-out chung | CO (1/7/2024) · CT · TX (1/1/2025) · OR · DE (1/1/2026) và một số bang khác (MT, NH, NE, NJ, MN, MD — mức tin vừa); theo ngưỡng quy mô của từng luật | `[BK-H/M]` |
| Thực thi | Sephora ($1,2M, 2022, bỏ qua GPC) · Honda (CPPA 3/2025) · Todd Snyder (CPPA 5/2025) · Healthline (CA AG 7/2025, gồm chia sẻ tiêu đề bài gợi ý chẩn đoán cho quảng cáo) · Tractor Supply (CPPA 9/2025) | `[BK-M/H]` |
| EU: ePrivacy 5(3) + *Planet49* + EDPB | cookie không thiết yếu cần consent trước; ô tick sẵn vô hiệu; đa số cơ quan coi thiếu nút "reject" ở lớp đầu là vi phạm (báo cáo taskforce 17/1/2023); CNIL: từ chối phải dễ như chấp nhận | `[BK-H]` |

## 7. Người chưa thành niên (toàn bộ `[BK]`)

| Quy định | Nội dung chính | Nhãn |
|---|---|---|
| COPPA (sửa 2025) | trẻ dưới 13; site đối tượng chung nên có màn hỏi tuổi trung tính; hạn tuân thủ bản sửa 22/4/2026 | `[BK-H]` |
| GDPR Điều 8 | tuổi tự consent 13–16 tuỳ nước (mặc định 16); UK 13 | `[BK-M]` |
| Quy định cho 16–17 tuổi | CA (opt-in để bán / chia sẻ dữ liệu dưới 16), CO, CT, MD MODPA (không quảng cáo nhắm mục tiêu / bán dữ liệu của người dưới 18), UK Children's Code (mặc định riêng tư cao, DPIA) | `[BK-H/M]` |
| Luật mạng xã hội / thiết kế phù hợp tuổi | nhắm "social media platforms"; thư viện bài test không có nội dung người dùng đăng có lẽ ngoài phạm vi `[INFERRED]` | `[BK-M]` |

## 8. Đối chiếu với cam kết sản phẩm hiện có trong docs

"Siết" = quy định đòi hơn docs đang viết; "xác nhận" = docs đã đủ theo nguồn tìm được; "nới" = có phần docs làm dư so với luật (vẫn có thể giữ vì lý do sản phẩm).

| # | Cam kết trong docs | Ảnh hưởng | Căn cứ | Nhãn | Việc đề xuất |
|---|---|---|---|---|---|
| 1 | Email nhắc **7 ngày trước kỳ năm** (Q-16, API-JOB-01) | **siết**: CA, NY, NYC đòi 15–45 ngày trước gia hạn / hạn huỷ với kỳ ≥ 1 năm; MA, MN giới hạn 5–30 ngày → 7 ngày **không đạt** CA / NY / NYC | §2 | `[LIVE:web]` | đổi mốc nhắc gói năm sang khoảng **21–30 ngày** trước kỳ (lọt mọi cửa sổ đã verify); có thể giữ thêm email 7 ngày. Ghi ở Q-26 (Group D) |
| 2 | Email nhắc **3 ngày trước kỳ tháng** (Q-16) | **nới một phần + thêm email**: không nguồn đã verify bắt buộc nhắc mỗi kỳ tháng (chưa rõ MN); nhưng CA, CT, MN đòi **nhắc hằng năm** cho cả gói tháng; CA, NY, NYC đòi **báo đổi giá** 5/7–30 ngày trước; NY đòi consent khi tăng giá hoặc cho huỷ + hoàn trong 14 ngày | §2 | `[LIVE:web]` | thêm email "nhắc hằng năm" cho gói tháng; mốc báo đổi giá 14–21 ngày; nếu giữ nhắc mỗi kỳ tháng thì ≥ 5 ngày cho an toàn với MN |
| 3 | Checkbox consent không tick sẵn + `consent_version` + thời điểm (BR-APP-03) | **xác nhận + siết thời hạn lưu**: CA đòi consent là bước riêng và lưu bằng chứng ≥ 3 năm hoặc 1 năm sau khi kết thúc hợp đồng (mốc dài hơn); Maine đòi consent riêng | §2 | `[LIVE:web]` | lưu `consent_version`, thời điểm, giá + câu gia hạn đã hiện, plan, kênh; giữ qua cả khi xoá tài khoản trong thời hạn đó (căn cứ nghĩa vụ pháp lý) — cập nhật `legal-consent.md` §1 khi Q-05 chốt |
| 4 | Công bố gia hạn ở mọi bề mặt tiền (BR-APP-02) | **xác nhận**: vụ FTC Genesis Tech nhắm đúng dạng funnel quiz → cá nhân hoá → paywall, xem cả upsell sau kết quả; không trial nên các nghĩa vụ báo trước khi trial chuyển không áp | §1 | `[LIVE:web]` | giữ; không bao giờ chọn sẵn Plus khi mua report lẻ; nếu sau này có giá giới thiệu thì phát sinh nghĩa vụ báo 3–21 ngày (CA) |
| 5 | Huỷ một bước trong tài khoản, dùng tới hết kỳ (BR-APP-04) | **xác nhận ở Mỹ; siết ở Đức**: §312k đòi nút huỷ dùng được **không cần đăng nhập**, trang xác nhận chỉ có thông tin bắt buộc + nút; offer giữ chân ở CA chỉ được kèm nút "click to cancel" | §2 · §3 | `[LIVE:web]` | nếu bán ở Đức (Q-05): thêm trang huỷ không cần đăng nhập (định danh bằng email / mã đơn); giữ luật "không offer giữ chân" |
| 6 | Không có quy trình rút hợp đồng 14 ngày | **mới**: từ 19/6/2026 khách EU phải có chức năng rút hai bước trong 14 ngày; rút = hoàn tiền (trừ phần đã dùng nếu khách xin bắt đầu ngay), khác với "huỷ gia hạn dùng tới hết kỳ"; report lẻ chỉ mất quyền rút nếu khách đồng ý truy cập ngay + xác nhận mất quyền, gửi lại qua email; Plus không từ bỏ được (*Sky Österreich*) | §3 | `[LIVE:web]` | Q-25 (mới): chức năng rút cho khách EU + câu đồng ý truy cập ngay ở SCR-PAY-01 |
| 7 | Không pixel trên route bài `sensitive`, không gửi câu trả lời (BR-APP-05 · BR-APP-06) | **xác nhận, có thể siết** | §5 | `[BK]` | che slug / tiêu đề bài `sensitive` khỏi analytics ở mọi route, referrer và UTM (tracking-events đã che URL); coi conversion API phía server như pixel |
| 8 | Tôn trọng GPC (Q-20, đang "đề xuất") | **siết thành yêu cầu** ở nhiều bang Mỹ (theo ngưỡng) | §6 | `[BK]` | verify danh sách bang rồi chuyển Q-20 từ "đề xuất" thành yêu cầu |
| 9 | Tuổi tối thiểu 16+, 18+ cho bài `sensitive`, tự khai (Q-21) | **xác nhận 16+**; 16–17 vẫn là người chưa thành niên ở vài luật | §7 | `[BK]` | giữ; mặc định riêng tư cao, không quảng cáo nhắm mục tiêu (MVP đã không có) |
| 10 | Check-in cảm xúc coi là dữ liệu nhạy cảm (Q-22) | **xác nhận**: có thể là "consumer health data" (WA, NV, CT) và dữ liệu đặc biệt (GDPR Điều 9) | §5 | `[BK]` | nghiêng về consent tường minh riêng khi bật check-in (option đang đề xuất ở Q-22) |

## 9. Ghi vào bảng quyết định

| Q | Việc |
|---|---|
| Q-16 | thêm evidence §8 #1–#2; option hiện tại (7 ngày trước kỳ năm) lệch CA / NY / NYC → Q-26 |
| Q-18 | thêm evidence §8 #6 (quyền rút EU) |
| Q-20 | thêm evidence §8 #8 (`[BK]`, cần verify) |
| Q-21 · Q-22 | thêm evidence §8 #9 · #10 (`[BK]`) |
| Q-25 (mới) | chức năng rút hợp đồng cho khách EU + waiver cho report lẻ |
| Q-26 (mới, Group D) | mốc nhắc gói năm trong docs (7 ngày) lệch cửa sổ 15–45 ngày của CA / NY / NYC |

## 10. Còn phải verify (hết ngân sách search)

- Văn bản khởi hiệu chế độ subscription của DMCC (UK) · ngày đề xuất Digital Fairness Act
- Thực thi của FTC về dữ liệu sức khoẻ / breach rule 2025–2026 · thực thi My Health My Data 2026 · NY S929 đã ký hay bị phủ quyết
- Danh sách bang bắt buộc GPC năm 2026 · các quyết định CPPA 2026 · ngày tuân thủ COPPA · tình trạng *NetChoice v. Bonta*
- Tuổi theo GDPR Điều 8 từng nước · MN 5–30 ngày có áp cho gói tháng không · cửa sổ ngày của Maryland và Virginia
- Ngày án *Sky Österreich* và số án BGH về trang xác nhận huỷ

## 11. AI Notices
- Không phải tư vấn pháp lý. Mọi dòng `[BK]` là trí nhớ của model, có thể sai hoặc cũ; không dùng làm căn cứ trước khi verify.
- Các cửa sổ ngày ở §2 lấy từ tóm tắt search của bài phân tích luật, chưa đối chiếu nguyên văn luật (WebFetch bị chặn).
- Đối thủ (testlibrary.com) có funnel cùng dạng với mô tả trong vụ Genesis Tech (F-15 · F-17 · F-18 · F-19), nhưng file này không kết luận gì về tính hợp pháp của đối thủ.
