# BÁO CÁO KHẢO SÁT & ĐỊNH HƯỚNG THỊ GIÁC: MACH VISUAL REFERENCE AUDIT
**Sử dụng ấn phẩm MẠCH làm Visual Reference định hình Design Language cho Cây Gia Phả Dòng Họ Trần Trọng Thu**

- **Tác giả khảo sát**: Editorial & System Design Audit
- **Nguồn khảo sát gốc**: `/Users/tuantq/Projects/Personal/MACH` (`exports/MACH-01.pdf`, `layouts/MACH-01.indd`, `assets/`, `references/`)
- **Website Production đối chiếu**: [https://gionghotrantrongthu.vercel.app/](https://gionghotrantrongthu.vercel.app/)
- **Vị trí tài liệu**: `docs/ux/MACH_VISUAL_REFERENCE_AUDIT.md`

---

## MỞ ĐẦU: BỐI CẢNH & MỤC TIÊU KHẢO SÁT

Dự án **MẠCH** ban đầu được định hình như một ấn phẩm in (publication / tập san lưu trữ) dành riêng cho gia tộc họ Trần Trọng Thu. Mặc dù chưa triển khai in ấn vật lý đại trà, nhưng bản thiết kế gốc của **MẠCH (Tập san Lưu trữ - Số 01/2026: *Dòng họ trong thời hiện đại — Giữ mạch hay chấp nhận tan rã?*)** chứa đựng toàn bộ linh hồn, tinh thần thẩm mỹ, nhịp điệu thị giác (page rhythm), ngôn ngữ hình ảnh và chiều sâu văn hóa mà một nền tảng số hóa của dòng họ cần hướng tới.

> [!IMPORTANT]
> **Tôn chỉ của đợt Audit này:**
> Không phải là "sao chép nguyên xi bản in MACH đưa lên website", mà là **khảo sát chuyên sâu cấu trúc thị giác của MACH**, bóc tách **"phần hồn" (essence)** khỏi **"phương tiện in ấn" (print constraints)**, từ đó thiết lập một **Design Language (Ngôn ngữ Thiết kế) nhất quán** cho toàn bộ hệ sinh thái số của Cây Gia Phả: kết hợp hài hòa giữa **Di sản (Heritage)**, **Báo chí - Kể chuyện (Editorial)**, **Con người (Human)**, **Hiện đại (Contemporary)** và **Tính tiện dụng (Utility)**.

---

## PHẦN 1: KẾT QUẢ KHẢO SÁT THỊ GIÁC TOÀN DIỆN TỪ MACH (FORENSIC FINDINGS)

Khảo sát trực tiếp tập tin xuất bản gốc `exports/MACH-01.pdf` (26 trang khổ đứng), file dàn trang `layouts/MACH-01.indd` và thư mục tư liệu `assets/` cho thấy các đặc trưng thị giác cốt lõi sau:

```
ẤN PHẨM MẠCH (MACH-01) — CẤU TRÚC HỆ THỐNG THỊ GIÁC
├── 1. MĂNG-SÉT & ĐỊNH DANH (Branding & Masthead)
│   ├── Logo MẠCH thư pháp bút lông bay bổng, nội lực mạnh mẽ
│   ├── Định danh phụ: "NẾP NHÀ & KÝ ỨC SỐNG" (Geometric Sans-serif, All-caps)
│   └── Danh xưng: "TẬP SAN LƯU TRỮ — SỐ 01/2026"
│
├── 2. BỐ CỤC & NHỊP ĐIỆU TRANG (Layout, Grid & Rhythm)
│   ├── Grid 2 cột bất đối xứng (Asymmetrical 2-column editorial grid)
│   ├── Running header & Running footer kẹp giữa đường chỉ mảnh (Hairline rules)
│   ├── Trang nghỉ / Trang tuyên ngôn (Statement spreads) dùng khối màu đơn sắc mạnh (Ochre Yellow)
│   └── Độ thoáng lề (Margins & Breathing room) cực lớn, tránh cảm giác ngột ngạt
│
├── 3. HỆ THỐNG TYPOGRAPHY ĐA TẦNG (Typography Hierarchy)
│   ├── Tiêu đề lớn (Display Headings): Cực đậm, chặt chẽ, tạo sức nặng thị giác
│   ├── Thân bài (Prose Body): Serif cổ điển, cỡ chữ vừa vặn, line-height 1.65–1.75
│   ├── Khối trích dẫn (Pull Quotes): Kèm ký tự ngoặc kép lớn đặt trong hình tròn đậm
│   └── Chú thích hình ảnh & Số trang: Sans-serif nhỏ gọn, nghiêng nhẹ, trung tính
│
├── 4. BẢNG MÀU VẬT LIỆU & CẢM XÚC (Color & Material Feeling)
│   ├── Nền giấy dó / Giấy mộc hạt ấm (Parchment, Linen, Textured Cream)
│   ├── Đỏ son / Đỏ sơn mài (Lacquer Red `#9B1B1B`) — Màu của gia tộc, huyết thống
│   ├── Vàng hoàng thổ / Ochre (`#D48806` / `#E5A93B`) — Màu của thời gian và hoài niệm
│   └── Mực mun / Than trầm (`#1A1A1A` / `#2C2C2C`) — Độ tương phản êm dịu, không chói
│
└── 5. MỐI QUAN HỆ GIỮA DỮ LIỆU & HÌNH ẢNH ĐỜI THƯỜNG (Data vs Human Life)
    ├── Phả hệ không chỉ là sơ đồ mà được đặt song song với ảnh tư liệu thật
    ├── Ảnh đời thường: Bữa cơm ngày giỗ, thắp nhang bàn thờ, bao thiệp cưới, quét dọn Tết
    └── Chú thích ảnh (Captions) chuẩn xác: Ghi rõ thời gian, nhân vật, địa điểm, sự kiện
```

### Chi tiết các yếu tố thị giác quan sát được từ 26 trang MẠCH-01:

1. **Bìa & Măng-sét (Cover & Masthead - Trang 1)**:
   - Tên tạp san "MẠCH" dùng chữ thư pháp bút mực phóng khoáng đặt trên nền giấy cổ có vân xơ sợi tự nhiên.
   - Bên dưới là bức ảnh cận cảnh nền bê tông cũ có vệt lá vàng rơi và khung xe đạp — tạo cảm giác hoài niệm, bình dị, đời sống thật chứ không bóng bẩy xa lạ.
   - Câu chủ đề: *"DÒNG HỌ TRONG THỜI HIỆN ĐẠI / Giữ mạch hay chấp nhận tan rã?"* đặt khiêm nhường ở 1/3 dưới trang.

2. **Trang Mục Lục & Cấu trúc Phân mục (TOC - Trang 2)**:
   - Chữ `mục lục` in thường, nét đậm hình học (Geometric Heavy) tạo cảm giác đương đại, không bị "cổ lỗ sĩ".
   - Phân chia mạch lạc 4 khối nội dung: **LỜI MỞ** (01-02), **LUẬN** (03-09), **TƯ LIỆU** (10-13), **GHI CHÚ & CHỈ MỤC** (14).
   - Đánh số bài viết dạng `01 — `, `02 — ` kèm dòng tóm tắt định hướng (sub-lead) dưới từng tiêu đề.

3. **Trang Đọc Văn Xuôi Tinh Khiết (Pure Reading - Trang 3, 10, 16, 24)**:
   - Lề trên và lề dưới rộng rãi, có running header `MẠCH — NẾP NHÀ & KÝ ỨC SỐNG` ở góc trên cùng bên phải.
   - Thân bài dùng font Serif có chân mềm mại, canh lề trái tự nhiên. Khoảng cách giữa các đoạn vừa phải, tạo nhịp đọc tĩnh tại và suy ngẫm.

4. **Trang Chuyển Nhịp & Tuyên Ngôn Thị Giác (Bold Spreads - Trang 6-7, 14, 18, 22)**:
   - **Trang 6-7**: Sử dụng nguyên một mảng màu vàng hoàng thổ (Ochre) rực rỡ, dấu `&` khổng lồ và tiêu đề chữ đậm: `“MẠCH” & “CÂY GIA PHẢ” — Hai hình thức lưu giữ sự tiếp nối trong thời hiện đại`.
   - **Trang 14**: Dùng ảnh chụp bia mộ tổ khắc chữ đá cổ làm nền mờ cho tiêu đề đỏ son cỡ lớn.
   - **Trang 18**: Dùng ảnh thiệp cưới thực tế của thế hệ cháu làm điểm tựa thị giác cho bài *“Những khế ước vô hình của dòng họ”*.
   - **Trang 22**: Dùng ảnh hoa mai hoa đào ngày Tết và cảnh gia đình chơi bài mùng 1 để mở đầu bài *“Vì sao con cháu còn quay về ngày Tết?”*.

5. **Xử lý Tư liệu Phả đồ & Dữ liệu (Genealogy Data Pages - Trang 4, 5, 8, 9, 11, 15)**:
   - Tích hợp trực tiếp các biểu đồ phả hệ (Fan chart, Sibling chart, Descendancy view) như những chứng cứ khoa học / trích lục hồ sơ lưu trữ.
   - Bức vẽ Cây phả hệ sơn dầu nhà ông Thư - bà Sa (Trang 5) với chân dung từng thành viên được đính theo nhánh cây, có phân mã màu thế hệ (F0, F1, F2, F3).
   - Chú thích hình học đánh số rõ ràng: `Hình 2. Sơ đồ phả hệ dạng quạt...`, `Hình 3. Sơ đồ phả hệ của một cá nhân...`.

6. **Khối Trích Dẫn Điểm Nhấn (Pull Quotes - Trang 8, 10, 16, 17, 20, 21, 23, 25)**:
   - Biểu tượng ngoặc kép `“` trắng nằm trong vòng tròn xám than đậm (`#4A5568` / `#2D3748`).
   - Khối nền bo góc mềm mại, chứa đựng những đúc kết triết lý sâu sắc nhất của bài viết, đóng vai trò như những "trạm dừng chân" cho mắt người đọc.

7. **Nhiếp Ảnh Đời Sống Chân Thực (Documentary Photography)**:
   - Không dùng ảnh stock, không dàn dựng tạo dáng giả tạo. Toàn bộ là ảnh chụp thực tế:
     - Giờ đọc kinh giỗ ông Thư tại phòng khách có chiếc quạt trần, cầu thang xoắn và ghế nhựa xanh (Trang 12).
     - Bàn thờ Công giáo với hoa tươi, ảnh ông bà và cuốn lịch treo tường (Trang 13).
     - Mâm cơm đại gia đình với đĩa thịt gà, lon bia và nụ cười của các chú bác thế hệ F1, F2 (Trang 19, 20, 21).
     - Người trẻ tuổi dùng điện thoại hướng dẫn người lớn xem cây gia phả (Trang 15).

---

## PHẦN 2: BÓC TÁCH “ESSENCE” KHỎI “PRINT” (TÁCH HỒN KHỎI XÁC)

Để chuyển thể thành công cảm giác của MẠCH lên nền tảng web hiện đại, chúng ta phải phân loại nghiêm ngặt:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       MA TRẬN PHÂN LOẠI YẾU TỐ THỊ GIÁC                     │
├──────────────────────┬──────────────────────┬───────────────────────────────┤
│ A. NÊN GIỮ NGUYÊN    │ B. CẦN CHUYỂN HÓA    │ C. TUYỆT ĐỐI TRÁNH           │
│    (Core Essence)    │    (Transform to Web)│    (Print Sins on Web)        │
├──────────────────────┼──────────────────────┼───────────────────────────────┤
│ • Triết lý đối trọng │ • 2-column print     │ • Lạm dụng vân giấy nền       │
│   (Cấu trúc vs Sống) │   → 1-column fluid   │   (làm mờ mắt trên màn hình)  │
│ • Cặp font tương phản│ • Trang in cố định   │ • Căn đều 2 bên (Justified)   │
│   (Sans-UI + Serif)  │   → Cuộn mượt mà     │   (gây dãn chữ loang lổ)      │
│ • Bảng màu di sản    │ • Sơ đồ in tĩnh      │ • Bố cục cố định số trang     │
│   (Đỏ son, Vàng đất) │   → Phả đồ tương tác │   (làm đứt đoạn trải nghiệm)  │
│ • Khối Pull Quote    │ • Mục lục số trang   │ • Khung viền hoa văn giả cổ   │
│   điểm nhấn suy ngẫm │   → Thanh điều hướng │   (tạo cảm giác sến, lỗi thời)│
│ • Ảnh đời sống thật  │ • Chú thích ảnh in   │ • Chữ quá nhỏ hoặc dính sát   │
│   có chú thích chuẩn │   → Lightbox gallery │   (vi phạm accessibility)     │
└──────────────────────┴──────────────────────┴───────────────────────────────┘
```

### A. Những giá trị cốt lõi nên GIỮ NGUYÊN (The Essence):
1. **Triết lý nhị nguyên: Cấu trúc & Ký ức**:
   - Website không chỉ là phần mềm quản lý quan hệ họ hàng khô khan (như webtrees/Gramps), mà là nơi **ký ức gia đình được sống lại**.
2. **Sự tương phản có chủ ý giữa Hệ thống & Kể chuyện**:
   - Vận hành/UI dùng Sans-serif hiện đại (`Be Vietnam Pro`); Nội dung tự sự/Tư liệu dùng Serif văn chương (`Source Serif 4`).
3. **Màu sắc mang căn cước văn hóa**:
   - Sự kết hợp giữa Đỏ sơn mài (ấm áp, linh thiêng, gắn kết dòng tộc), Vàng đất (ký ức, thời gian) và Trắng ngà/Giấy mộc (trang trọng, tôn nghiêm).
4. **Nhịp điệu đọc chậm (Slow-reading rhythm)**:
   - Các khoảng trắng chủ động, trích dẫn nổi bật, chữ ký tác giả cuối bài (`Người Giữ Mạch, Sài Gòn, 2026`).
5. **Tính chân thực tuyệt đối của tư liệu ảnh**:
   - Trân trọng từng bức ảnh sinh hoạt bình dị, từng bia mộ, từng bức hoành phi, thiệp cưới gia tộc.

### B. Những yếu tố CẦN CHUYỂN HÓA linh hoạt cho Web (Transform):
1. **Từ Lưới 2 cột in ấn $\rightarrow$ Lưới 1 cột căn giữa chuẩn Web (Measure 680–720px)**:
   - Trên màn hình điện thoại và máy tính, văn bản đọc dài chỉ nên có độ rộng lý tưởng từ 65–75 ký tự mỗi dòng để mắt không bị mỏi khi chuyển dòng.
2. **Từ Trang in ngắt đoạn $\rightarrow$ Dòng chảy liên tục (Continuous Flow)**:
   - Chuyển số trang giấy (`Trang 14 | Tập san lưu trữ...`) thành **Running header tinh gọn**, thanh tiến độ đọc (Reading progress bar) và Breadcrumb điều hướng ngữ cảnh (`MẠCH / Ấn phẩm 01 / Bài 03`).
3. **Từ Biểu đồ gia phả in chết $\rightarrow$ Cây phả hệ số hóa tương tác (Interactive Dynamic Tree)**:
   - Cho phép zoom, kéo thả, chạm vào nút để mở hồ sơ cá nhân/gia đình tức thì.
4. **Từ Khối ảnh tĩnh $\rightarrow$ Ảnh responsive kèm phóng to (Lightbox Zoom)**:
   - Ảnh đời thường trên web có thể chạm vào để xem chi tiết độ phân giải cao và đọc đầy đủ chú thích xuất xứ.

### C. Những yếu tố KHÔNG NÊN mang sang Web (Eliminate):
1. **Không áp hình nền vân giấy (Texture noise/skeuomorphism) tràn lan**:
   - Trên màn hình phát sáng (OLED/Retina), texture giấy dày đặc làm giảm tương phản chữ, gây rối mắt và làm trang web trông như template cổ trang giá rẻ. Thay vào đó, dùng **màu nền phẳng ấm (Flat warm tint `#FAF8F5`)**.
2. **Tuyệt đối không dùng căn đều 2 bên (`text-align: justify`)**:
   - HTML/CSS không có thuật toán tự ngắt từ bẻ chữ (hyphenation) tốt như Adobe InDesign, căn đều trên web sẽ tạo ra những "khoảng trắng rỗng" (text rivers) rất xấu trên mobile.
3. **Không dùng hoa văn, khung viền hoành phi cổ điển trang trí vô nghĩa**:
   - Vẻ đẹp của MẠCH đến từ **khoảng trắng, tỷ lệ chữ và hình ảnh thật**, không đến từ các họa tiết rồng phượng trang trí viền.

---

## PHẦN 3: ĐỐI CHIẾU VỚI CÂY GIA PHẢ PRODUCTION HIỆN TẠI

Kiểm tra đối chiếu thực tế trên `https://gionghotrantrongthu.vercel.app/`:

| Tiêu chí | Ấn phẩm MẠCH gốc | Cây Gia Phả (Hiện tại) | Đánh giá & Khoảng cách cần hoàn thiện |
| :--- | :--- | :--- | :--- |
| **Typography System** | Serif thân bài + Bold Display + Sans chú thích | Đã áp dụng `Be Vietnam Pro` (UI) + `Source Serif 4` (Editorial) | **Rất tốt**: Nền tảng font đã chuẩn xác theo DNA của MACH. |
| **Trang HOME** | Bìa nghệ thuật, tuyên ngôn sâu sắc, dẫn nhập ký ức | Khối Hero chào mừng + 3 Thống kê + 4 Nút điều hướng nhanh | **Cần nâng cấp**: Hiện tại Home còn giống "Dashboard quản trị". Cần bổ sung cảm giác "Lời tựa gia tộc" và dẫn nhập câu chuyện. |
| **Không gian MẠCH** | Bố cục đa dạng: Spreads, Lead text, Pull quotes, Ảnh tư liệu lớn | Danh sách bài viết phẳng + Trang đọc thân bài cơ bản | **Cần bổ sung component**: Chưa có khối Trích dẫn (`Pull quote`) có phong cách MACH, thiếu khối thông tin số phát hành và nhịp ảnh minh họa xen kẽ. |
| **Không gian GIA PHẢ** | Sơ đồ phả hệ cây vẽ tay & fan chart đính kèm ảnh chân dung | Cây tương tác SVG/HTML + Thẻ thế hệ + Bộ lọc thế hệ F0–F4 | **Đúng hướng**: Giữ được tính khoa học, chuẩn xác, tra cứu mượt mà. |
| **Không gian LỊCH** | Gắn với ngày giỗ, Tết, cưới hỏi trong bài viết | Lịch Âm Dương + Lọc sự kiện + Đăng ký vào điện thoại (CALENDAR_02) | **Rất tốt**: Utility-first, rõ ràng, thực tế. |
| **Không gian TƯ LIỆU** | Mục 10–13: Mộ tổ, bia đá, bàn thờ, gia phả viết tay | Chưa tách biệt giao diện chuyên sâu cho Visual Archive | **Cần định hình**: Cần xây dựng không gian trưng bày tư liệu ảnh quét và chứng tích lịch sử. |

---

## PHẦN 4: THIẾT LẬP “CÂY GIA PHẢ VISUAL DNA”

Trả lời câu hỏi trọng tâm: **"Nếu Cây Gia Phả được làm như một ấn phẩm số hóa thì nó nên có cảm giác như thế nào?"**

Cây Gia Phả không phải là một phần mềm SaaS khô cứng, không phải bảng điều khiển kỹ thuật, cũng không phải một website hoài cổ giả tạo. Nó là một **Ấn phẩm Văn hóa Gia tộc Đương đại (A Contemporary Family Cultural Publication)**.

```
                    CÂY GIA PHẢ VISUAL DNA
       ┌────────────────────────────────────────────────┐
       │   HERITAGE      : Gìn giữ cội nguồn & di sản   │
       │   EDITORIAL     : Nhịp điệu & chiều sâu tự sự  │
       │   HUMAN         : Lấy con người & đời sống làm │
       │                   trung tâm                    │
       │   CONTEMPORARY  : Tinh giản, hiện đại, sắc nét │
       │   READABLE      : Êm mắt, dễ đọc trên di động  │
       └────────────────────────────────────────────────┘
```

### 12 Trụ Cột Thiết Kế Cụ Thể (The 12 Pillars):

1. **Khí chất & Cảm xúc (Mood)**:
   - Trang trọng, ấm cúng, tĩnh lặng, tự hào, mang lại cảm giác thân thuộc như đang mở cuốn gia phả và album ảnh gia đình bên bàn trà.
2. **Giọng điệu (Tone of Voice)**:
   - Điềm đạm, khiêm nhường, khảo cứu trung thực, đầy tình cảm gia tộc; không khoa trương, không hoa mỹ rỗng tuếch.
3. **Kiến trúc Typography (Typography)**:
   - **System / UI / Data**: `Be Vietnam Pro` (400, 500, 600, 700, 800) — Rõ ràng, tối ưu hiển thị tiếng Việt, sắc nét trên màn hình nhỏ.
   - **Editorial / Prose / Quotes**: `Source Serif 4` (400, 400i, 600, 700) — Thư thái, nhịp nhàng, mang phẩm chất sách in cao cấp.
4. **Hệ thống Lưới (Grid System)**:
   - Lưới modular linh hoạt: Desktop 12 cột; Tablet 8 cột; Mobile 4 cột.
   - Chiều rộng nội dung đọc (Reading Container): Cố định `max-width: 720px` căn giữa để duy trì tầm nhìn mắt thoải mái nhất.
5. **Khoảng cách & Nhịp thở (Spacing & Rhythm)**:
   - Hệ thống khoảng cách chuẩn 8pt (8px, 16px, 24px, 32px, 48px, 64px).
   - Tăng khoảng trống đầu và cuối mỗi bài viết (padding-block 48px–64px) để tạo sự trang trọng.
6. **Bảng màu Bản sắc (Color Palette)**:
   - **Đỏ Sơn Mài (`--lacquer-red: #9B1B1B`)**: Điểm nhấn nhận diện, huyết thống, ngày lễ trọng, logo.
   - **Vàng Hoàng Thổ (`--ochre: #C27803`)**: Điểm nhấn phụ, thời gian, ngày giỗ, trích dẫn.
   - **Xanh Chàm Đậm (`--ink-slate: #1E293B`)**: Màu chữ chính, tiêu đề trang trọng, viền phả đồ.
   - **Nền Trắng Mộc Ấm (`--bg-warm: #FAF8F5`)**: Nền toàn trang, thay thế cho màu trắng toát chói mắt, tạo cảm giác như trang giấy in mỹ thuật.
   - **Trắng Tinh Khiết (`--surface: #FFFFFF`)**: Nền thẻ, bảng biểu và modal để tạo độ tương phản nổi bật.
7. **Xử lý Hình ảnh & Tư liệu (Image Treatment)**:
   - Tôn trọng tỉ lệ và màu sắc gốc của ảnh tài liệu; bo góc nhẹ (`border-radius: 8px` hoặc `12px`), viền mờ 1px để tách nền tự nhiên.
   - Mọi hình ảnh phải có **Caption chuẩn mực**: Đánh số, tên sự kiện, niên đại và nhân vật xuất hiện trong ảnh.
8. **Triết lý Thẻ & Khối nội dung (Card Philosophy)**:
   - Thiết kế phẳng tinh tế (Flat & Crisp): Viền mảnh 1px màu be ấm (`#E5E0D8`), bóng đổ siêu nhẹ (`box-shadow: 0 1px 3px rgba(0,0,0,0.04)`), không dùng hiệu ứng bóng đổ dày cộm lỗi thời.
9. **Bố cục Tự sự (Editorial Composition)**:
   - Áp dụng các thành phần kinh điển của báo chí cao cấp: Đoạn dẫn nhập (Lead paragraph font lớn hơn), Chữ ký tác giả trang trọng cuối bài, Khối trích dẫn nổi bật (`Pull quote` có icon ngoặc kép tròn).
10. **Triết lý Giao diện Dữ liệu Phả hệ (Data/Genealogy Philosophy)**:
    - Nhẹ nhàng, sắc nét, tối giản hóa đường nối; dùng huy hiệu thế hệ màu sắc dịu mắt (F0 Indigo, F1 Emerald, F2 Amber, F3 Violet).
11. **Tương tác & Chuyển động (Motion & Interaction)**:
    - Chuyển động nhẹ nhàng (Fade-in 200ms, ease-out), không dùng hiệu ứng giật gân, đảm bảo tốc độ phản hồi tức thì.
12. **Triết lý Di động (Mobile-First Philosophy)**:
    - Mọi nút bấm có diện tích chạm $\ge 44\times 44\text{px}$; thanh điều hướng ngón tay cái dễ với tới; không có bảng biểu bị tràn ngang gây vỡ khung hình.

---

## PHẦN 5: NGUYÊN TẮC "ONE FAMILY, MULTIPLE MODES" (PHÂN HÓA 4 KHÔNG GIAN)

Hệ thống thị giác của Cây Gia Phả là **MỘT GIA TỘC (One Family)** nhưng hoạt động dưới **NHIỀU CHẾ ĐỘ (Multiple Modes)** nhằm phục vụ chính xác mục đích của từng không gian:

```
                      MÔ HÌNH 4 CHẾ ĐỘ THỊ GIÁC
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. GIA PHẢ (Tree & Relations)       │ 2. MẠCH (Narrative & Publication)    │
│ • Mode: Information-First           │ • Mode: Editorial-First              │
│ • Trọng tâm: Sạch sẽ, cấu trúc,     │ • Trọng tâm: Chiều sâu, nhịp điệu,   │
│   quan hệ thế hệ, tra cứu nhanh.    │   typography serif, trải nghiệm đọc. │
├─────────────────────────────────────┼──────────────────────────────────────┤
│ 3. LỊCH (Calendar & Events)         │ 4. TƯ LIỆU (Archival & Records)      │
│ • Mode: Utility-First               │ • Mode: Heritage-First               │
│ • Trọng tâm: Tiện dụng, Âm Dương,   │ • Trọng tâm: Trân trọng chứng tích,  │
│   đăng ký 1 chạm vào điện thoại.    │   bản quét nguyên gốc, phân loại kỹ. │
└─────────────────────────────────────┴──────────────────────────────────────┘
```

### 1. Không gian GIA PHẢ (`#/tree`, `#/people`, `#/families`) — *Information Mode*
- **Đặc trưng**: Font `Be Vietnam Pro` chủ đạo. Giao diện dạng sơ đồ và thẻ danh bạ.
- **Yêu cầu thị giác**: Nền trắng sạch, đường kẻ mảnh rõ ràng, phân biệt rành mạch các thế hệ cha con, vợ chồng, anh em. Tuyệt đối không đưa các mảng màu quá rực hay typography uốn lượn vào đây làm rối mắt người tra cứu.

### 2. Không gian MẠCH (`#/mach`) — *Editorial / Publication Mode*
- **Đặc trưng**: Nơi chất ấn phẩm của MACH thăng hoa mạnh mẽ nhất.
- **Yêu cầu thị giác**: Font `Source Serif 4` làm linh hồn cho tiêu đề và thân bài. Sử dụng khối màu Ochre cho banner ấn phẩm, trích dẫn nổi bật kiểu MACH, các bộ sưu tập ảnh ký ức gia đình, ký tên tác giả cuối bài.

### 3. Không gian LỊCH (`#/calendar`) — *Utility Mode*
- **Đặc trưng**: Font `Be Vietnam Pro` số học rõ ràng. Lưới tháng và danh sách sự kiện song song Dương - Âm.
- **Yêu cầu thị giác**: Trực quan, dễ nhìn, các nút đăng ký lịch Apple/Google hiển thị tức thì, hỗ trợ lọc nhanh 4 lớp sự kiện (Sinh nhật, Bổn mạng, Ngày giỗ, Họp mặt).

### 4. Không gian TƯ LIỆU (`#/documents`) — *Archival Mode*
- **Đặc trưng**: Trình bày như một thư viện bảo tàng gia đình số hóa.
- **Yêu cầu thị giác**: Tập trung vào bản scan tư liệu thật (gia phả giấy dó, văn khấn, hình ảnh bia mộ, di chúc, ảnh phục dựng). Đi kèm thông tin thẩm định nguồn gốc và xuất bản phẩm liên quan.

---

## PHẦN 6: LỘ TRÌNH TRIỂN KHAI THỊ GIÁC ĐỀ XUẤT (ROADMAP)

Khuyến nghị chia nhỏ việc nâng cấp diện mạo thị giác theo các bước có trật tự:

```
LỘ TRÌNH NÂNG CẤP THỊ GIÁC (PHASED ROADMAP)
├── Giai đoạn 1: Chuẩn hóa Editorial Components cho MẠCH (Pull quotes, Lead, Captions)
├── Giai đoạn 2: Tái cấu trúc HOME thành "Bìa Ấn phẩm & Lời Tựa Gia Tộc"
├── Giai đoạn 3: Hoàn thiện chế độ hiển thị cho TƯ LIỆU (Visual Archive Viewer)
└── Giai đoạn 4: Đánh bóng Micro-interactions, Dark/Warm themes & Tối ưu in ấn (Print CSS)
```

1. **Giai đoạn 1 (Ưu tiên cao nhất)**: Bổ sung các Editorial Component cho MẠCH (Khối trích dẫn mang phong cách ngoặc kép tròn của MACH, khối Lead paragraph, chữ ký tác giả cuối bài, hiển thị ảnh đời thường kèm caption chuẩn).
2. **Giai đoạn 2**: Tái thiết kế trang HOME để thoát khỏi cảm giác "Dashboard công cụ", chuyển thành một **"Trang Bìa Mở Đầu"** trang nhã với lời tựa về dòng họ, ấn phẩm MẠCH mới nhất và điểm nhấn ngày giỗ/sự kiện gần nhất.
3. **Giai đoạn 3**: Thiết kế giao diện không gian TƯ LIỆU tôn vinh các hiện vật phả hệ và ảnh quét di sản.
4. **Giai đoạn 4**: Tối ưu hóa chế độ in ấn (Print Stylesheet) để khi người dùng in một bài viết từ web ra giấy A4, nó tự động căn chỉnh lề và font chữ đẹp như một trang sách in thực thụ.

---

## PHẦN 7: DESIGN NORTH STAR (KIM CHỈ NAM THIẾT KẾ)

> [!NOTE]
> **7 NGUYÊN TẮC BẮT BUỘC KHI XÂY DỰNG GIAO DIỆN CÂY GIA PHẢ:**
> 
> 1. **DỮ LIỆU LÀ GỐC, KÝ ỨC LÀ HỒN**: Mọi giao diện phả hệ phải tuyệt đối chính xác về dữ liệu; mọi giao diện bài viết phải giàu cảm xúc và nhịp điệu nhân văn.
> 2. **HAI GIỌNG NÓI TYPOGRAPHY NHẤT QUÁN**: Sans-serif (`Be Vietnam Pro`) cho công cụ & điều hướng; Serif (`Source Serif 4`) cho đọc tự sự & tư liệu. Không trộn lẫn tuỳ tiện.
> 3. **KHÔNG GIẢ CỔ RƯỜM RÀ**: Tránh xa các họa tiết rồng phượng trang trí, vân giấy giả cổ quá đà. Vẻ đẹp văn hóa đến từ sự chuẩn mực, khoảng trắng và sự tôn trọng nội dung thật.
> 4. **TÔN TRỌNG TÍNH CHÂN THỰC CỦA HÌNH ẢNH**: Ưu tiên ảnh đời thường thật của gia đình, ảnh chụp bia mộ, di vật thật kèm đầy đủ chú thích thời gian, địa điểm, nhân vật.
> 5. **MỘT GIA TỘC, ĐA CHẾ ĐỘ (ONE FAMILY, MULTIPLE MODES)**: MẠCH đậm chất tạp chí; GIA PHẢ sạch sẽ cấu trúc; LỊCH tối ưu tiện ích; TƯ LIỆU trang trọng lưu trữ.
> 6. **ĐỌC ÊM ÁI TRÊN DI ĐỘNG**: Chiều rộng văn bản $\le 720\text{px}$, canh lề trái tự nhiên, line-height $1.7$, diện tích chạm ngón tay $\ge 44\text{px}$.
> 7. **TĨNH LẶNG & BỀN VỮNG**: Tránh các hiệu ứng chuyển động lòe loẹt, giữ cho website có cảm giác bình yên, vững chãi như một ngôi nhà thờ họ mở rộng trên không gian số.
