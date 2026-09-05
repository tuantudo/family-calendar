# KIẾN TRÚC ẤN PHẨM SỐ: PUBLICATION ARCHITECTURE_01
**Định nghĩa Nền tảng Digital Magazine (MẠCH) trong Hệ sinh thái Tri thức Dòng họ Trần Trọng Thu**

- **Tài liệu**: `docs/ux/PUBLICATION_ARCHITECTURE_01.md`
- **Dự án**: Cây Gia Phả & Ấn phẩm MẠCH (`gionghotrantrongthu.vercel.app`)
- **Visual & Editorial Reference**: `/Users/tuantq/Projects/Personal/MACH`
- **Content Source**: `/Users/tuantq/Obsidian/20_PROJECTS/Mach/PROJECTS`
- **Trạng thái**: Kiến trúc & Đặc tả mô hình (Specification / No Redesign Code)

---

## 1. TỔNG QUAN: PHÂN ĐỊNH PHẠM VI HỆ THỐNG

Sau khi đối chiếu và làm rõ với tôn chỉ thiết kế, ranh giới sản phẩm của Cây Gia Phả được xác lập một cách chuẩn xác:

> [!IMPORTANT]
> **ĐỊNH VỊ CHÍNH XÁC (SYSTEM CLARIFICATION):**
> 1. **CÂY GIA PHẢ** là một **Family Knowledge & Heritage Website (Website Tri thức & Di sản Gia tộc)** đa chế độ, không phải mọi ngóc ngách đều bị biến thành bài báo hay tạp chí.
> 2. **MẠCH** chính là **DIGITAL MAGAZINE / ONLINE MAGAZINE (Tạp chí Mạng)** trung tâm của hệ thống — nơi hội tụ trọn vẹn chất lượng xuất bản, ngôn ngữ biên tập, nhiếp ảnh tư liệu và nhịp điệu đọc sâu sắc từ ấn phẩm gốc `/Users/tuantq/Projects/Personal/MACH`.
> 3. Các không gian còn lại giữ trọn công năng riêng biệt:
>    - 🌳 **GIA PHẢ**: Dữ liệu cấu trúc, quan hệ huyết thống, tra cứu thế hệ (*Information / Structured Data*).
>    - 📅 **LỊCH**: Tiện ích thời gian, ngày giỗ, sinh nhật, bổn mạng, đồng bộ điện thoại (*Family Utility*).
>    - 📚 **TƯ LIỆU**: Kho lưu trữ văn tự cổ, bia mộ tổ, di thư, chứng tích (*Archive / Heritage Source*).

```
                 HỆ SINH THÁI TRI THỨC GIA TỘC (FAMILY KNOWLEDGE PLATFORM)
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                           DÒNG HỌ TRẦN TRỌNG THU (WEBSITE GỐC)                          │
├──────────────────────────┬────────────────────────────┬─────────────────────────────────┤
│ 🌳 GIA PHẢ               │ 🧵 MẠCH                    │ 📅 LỊCH & 📚 TƯ LIỆU            │
│ (Information Mode)       │ (DIGITAL MAGAZINE MODE)    │ (Utility & Archival Modes)      │
│ • Sơ đồ thế hệ SVG/Graph │ • Tạp chí trực tuyến       │ • Tra cứu Lịch Âm - Dương       │
│ • 223 Nhân vật (GEDCOM)  │ • Ấn phẩm chuyên đề        │ • Đăng ký Lịch Apple/Google     │
│ • 68 Gia đình            │ • Bút ký, Khảo cứu, Hồi ức │ • Kho bản scan gia phả cổ       │
│ • Quan hệ cha/con/vợ/chồng│ • Nhiếp ảnh đời sống thật │ • Tư liệu bia mộ & di chúc      │
└──────────────────────────┴────────────────────────────┴─────────────────────────────────┘
```

---

## 2. CHƯƠNG ĐẶC BIỆT: MẠCH AS DIGITAL MAGAZINE (TẠP CHÍ MẠNG MẠCH)

Đây là trọng tâm của Publication Engine. MẠCH là nơi biến tinh thần của một ấn phẩm in cao cấp thành một trải nghiệm tạp chí mạng đương đại.

### 2.1. MẠCH Khác Một Blog Cá Nhân Như Thế Nào?

```
┌───────────────────────────────────────┬───────────────────────────────────────┐
│ BLOG CÁ NHÂN THÔNG THƯỜNG             │ MẠCH — DIGITAL MAGAZINE GIA TỘC       │
├───────────────────────────────────────┼───────────────────────────────────────┤
│ • Danh sách bài viết phẳng theo ngày  │ • Biên tập theo Số / Chuyên đề        │
│   (Reverse-chronological post feed)   │   (Curated Issues, Themes & Volumes)  │
│ • Ảnh chỉ là hình minh họa chèn thêm  │ • Nhiếp ảnh tư liệu là một nửa câu    │
│   (Decorative images / stock photos)  │   chuyện (Visual Storytelling)        │
│ • Bố cục một màu đơn điệu             │ • Đa dạng Layout Archetypes tùy nội   │
│   (Single generic article template)   │   dung (Essay, Photo story, Letter)   │
│ • Văn phong tản mạn, thiếu kiểm chứng │ • Khảo cứu điềm đạm, có trích dẫn,    │
│   (Informal rambling)                 │   chú thích nguồn gốc (Provenance)    │
│ • Mục đích cá nhân nhất thời          │ • Lưu trữ văn hóa & nếp nhà dài lâu   │
└───────────────────────────────────────┴───────────────────────────────────────┘
```

### 2.2. Các Editorial Primitives (Thành Phần Biên Tập Cốt Lõi Của Tạp Chí)

Một Digital Magazine thực thụ đòi hỏi một bộ thành phần biên tập giàu biểu cảm:

1. **Cover & Landing Spread**: Bìa số tạp chí với măng-sét MẠCH thư pháp, chủ đề phát hành, hình ảnh biểu tượng và lời tựa.
2. **Featured Story / Hero Story**: Bài viết tâm điểm của số báo với cách xử lý typography cỡ lớn, ảnh toàn khổ và đoạn dẫn nhập (deck lead).
3. **Issue & Volume Taxonomy**: Phân cấp theo Số ấn phẩm (Ví dụ: `MẠCH — Số 01/2026: Dòng Họ Trong Thời Hiện Đại`).
4. **Editorial Sections**: Phân chia các chuyên mục tư tưởng rõ ràng:
   - **Lời mở**: Dẫn nhập, xác lập tâm thế và bối cảnh.
   - **Luận**: Các bài khảo cứu sâu về nếp nhà, biến chuyển thế hệ, nghi lễ, khế ước dòng họ.
   - **Tư liệu & Ký ức**: Kể chuyện qua hiện vật, mộ tổ, bàn thờ, hình bóng tiền nhân.
5. **Photo Essay & Gallery**: Bố cục chuyên biệt tôn vinh phóng sự ảnh đời thường (ngày giỗ, mâm cơm Tết, đám cưới).
6. **Pull Quotes**: Khối trích dẫn điểm nhấn triết lý mang icon ngoặc kép tròn đặc trưng của MẠCH.
7. **Rich Captions**: Chú thích ảnh chuẩn xuất bản (Đánh số hình, nội dung, nhân vật, niên đại, địa điểm).
8. **Author & Editorial Colophon**: Hồ sơ tác giả (`Người Giữ Mạch`), địa danh, ngày tháng và lời kết trang trọng.

---

### 2.3. Cân Bằng Thị Giác Giữa Ảnh & Chữ (Image ↔ Text Balance)

Trong MẠCH, **hình ảnh không phải là vật trang trí lấp chỗ trống**. Hình ảnh và câu chữ cùng hòa nhịp để tạo nên một **Nhịp Điệu Tự Sự (Narrative Rhythm)**:

$$\text{Mạch Reading Rhythm} = \text{Lead Deck} \rightarrow \text{Prose} \rightarrow \text{Documentary Photo} \rightarrow \text{Caption} \rightarrow \text{Prose} \rightarrow \text{Pull Quote} \rightarrow \text{Prose} \rightarrow \text{Signature}$$

```
                          NHỊP ĐIỆU BÀI ĐỌC TẠP CHÍ MẠCH
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. HERO SPREAD      : Ảnh bia mộ / Không gian ký ức + Tiêu đề lớn           │
│ 2. DECK LEAD        : Đoạn văn dẫn nhập đặt vấn đề (Font lớn, line-height cao)│
│ 3. PROSE BLOCK 1    : 2-3 đoạn văn bản phân tích bối cảnh                   │
│ 4. VISUAL ANCHOR    : Ảnh đời thường (bữa cơm gia đình / thiệp cưới)        │
│ 5. RICH CAPTION     : Chú thích xuất xứ và thế hệ có mặt trong ảnh          │
│ 6. PROSE BLOCK 2    : Luận giải sâu sắc về nếp nhà                          │
│ 7. PULL QUOTE       : “ Trích dẫn đắt giá nhất đặt trong khối nổi bật ”     │
│ 8. PROSE BLOCK 3    : Đúc kết và mở ra suy ngẫm cho thế hệ tiếp nối         │
│ 9. COLOPHON         : Chữ ký tác giả (Người Giữ Mạch • Sài Gòn, 2026)       │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 2.4. Hệ Thống Layout Linh Hoạt Cho MẠCH (Article Layout Archetypes)

Không ép mọi bài viết vào một khuôn mẫu cứng nhắc, MẠCH hỗ trợ **8 khuôn mẫu dàn trang (Layout Archetypes)**:

1. **Text-Led Essay (Bút ký / Nghị luận)**:
   - Dành cho các bài suy ngẫm sâu sắc (`01-gioi-thieu`, `04-tu-he-tu-tuong...`).
   - Cột chữ thanh thoát $\le 720\text{px}$, drop cap đầu dòng, ít ảnh nhưng ảnh rất đắt giá.
2. **Image-Led Feature (Bài viết lấy ảnh làm điểm tựa)**:
   - Dành cho các bài gắn với sự kiện thị giác (`08-dam-cuoi...`, `07-mo-to...`).
   - Ảnh Hero tràn khổ, ảnh minh họa chiếm tỷ trọng lớn, chữ bao quanh hoặc chạy so le.
3. **Photo Essay (Phóng sự ảnh / Ký sự hình ảnh)**:
   - Dành cho phóng sự về một ngày giỗ, một dịp Tết hay chuyến về quê thăm mộ.
   - Nhịp điệu chủ đạo là chuỗi ảnh lớn kèm chú thích sâu, văn bản đóng vai trò dẫn chuyện.
4. **Epistolary / Letter (Thư từ / Ký ức riêng tư)**:
   - Dành cho series *Thư gửi Clara*.
   - Khổ hẹp, font nghiêng nhẹ tao nhã, phong cách như một bức thư gửi qua thời gian.
5. **Interview / Conversation (Đối thoại thế hệ)**:
   - Dành cho ghi chép trò chuyện với các bậc cao niên (F1, F2).
   - Phân biệt rõ câu hỏi của người ghi chép và lời kể mộc mạc của ông bà.
6. **Archival Research Essay (Khảo cứu gia phả & tư liệu cổ)**:
   - Trình bày song song giữa trích lục gia phả, ảnh scan văn bản cũ và lời giải nghĩa.
7. **Mixed Media / Interactive Story**:
   - Kết hợp giữa văn bản, ảnh, trích dẫn âm thanh hoặc sơ đồ phả hệ nhánh nhỏ có thể tương tác.

---

### 2.5. Kiến Trúc Trang Bìa / Trang Chủ Của MẠCH (`#/mach`)

Trang chủ của MẠCH không phải là danh sách bài viết liệt kê cơ học (Bài 1, Bài 2, Bài 3...) mà được cấu trúc như **Bìa Tạp Chí & Mục Lục Biên Tập (Magazine Homepage)**:

```
                      BỐ CỤC TRANG CHỦ TẠP CHÍ MẠCH (#/mach)
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. MASTHEAD & CURRENT ISSUE BANNER                                          │
│    🌿 MẠCH — NẾP NHÀ & KÝ ỨC SỐNG                                           │
│    Ấn phẩm Lưu trữ — Số 01/2026: "Dòng Họ Trong Thời Hiện Đại"              │
├─────────────────────────────────────────────────────────────────────────────┤
│ 2. HERO FEATURE STORY (Bài Đinh Của Số)                                     │
│    ┌───────────────────────────────────┬──────────────────────────────────┐ │
│    │ [ ẢNH COVER TÂM ĐIỂM TOÀN KHỔ ]   │ LUẬN • BÀI 03                    │ │
│    │                                   │ Dòng Họ Trong Thời Hiện Đại      │ │
│    │                                   │ Giữ mạch hay chấp nhận tan rã?   │ │
│    │                                   │ ↳ Đọc bài viết chính →           │ │
│    └───────────────────────────────────┴──────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────┤
│ 3. CURATED SECTIONS (Phân Mục Tuyển Chọn)                                   │
│    ┌──────────────────────┐ ┌──────────────────────┐ ┌────────────────────┐ │
│    │ 🕊️ LỜI MỞ            │ │ 📖 LUẬN              │ │ 🏛️ TƯ LIỆU         │ │
│    │ • 01. Giới thiệu     │ │ • 04. Đạo lý đời sống│ │ • 07. Mộ tổ        │ │
│    │ • 02. Cây gia phả... │ │ • 05. Khế ước vô hình│ │ • 10. Bàn thờ...   │ │
│    │                      │ │ • 06. Giỗ & Ký ức    │ │                    │ │
│    └──────────────────────┘ └──────────────────────┘ └────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────┤
│ 4. SPECIAL SERIES SHELF (Kệ Chuyên Đề Độc Lập)                              │
│    ✉️ SERIES: THƯ GỬI CLARA — Những lá thư gửi lại thế hệ tương lai         │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 2.6. Trải Nghiệm Di Động (Mobile-First Editorial)

Trên điện thoại, MẠCH không phải là phiên bản thu nhỏ co rúm của tạp chí desktop:
- **Tỷ lệ chữ & khoảng thở**: Font chữ `Source Serif 4` cỡ 17–18px, line-height 1.75 mang lại trải nghiệm đọc êm ái như ứng dụng đọc sách chuyên nghiệp.
- **Canh lề tự nhiên**: Canh trái tuyệt đối, loại bỏ khoảng hở rỗng của căn đều hai bên.
- **Khối trích dẫn thu gọn tinh tế**: Ký tự ngoặc kép đặt nổi bật, nền ấm bo tròn, không chiếm hết chiều cao màn hình.
- **Thanh điều hướng đọc**: Nút lùi về mục lục MẠCH luôn sẵn sàng, hỗ trợ chuyển nhanh sang bài tiếp theo ở cuối trang.

---

## 3. MỐI QUAN HỆ GIỮA MẠCH VÀ CÁC KHÔNG GIAN KHÁC

```
                      MÔ HÌNH LIÊN KẾT LIÊN KHÔNG GIAN
┌─────────────────────────────────────────────────────────────────────────────┐
│                             CÂY GIA PHẢ WEBSITE                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│       ┌──────────────┐         Cross-Link         ┌──────────────┐          │
│       │   GIA PHẢ    │ <────────────────────────> │     MẠCH     │          │
│       │ (Cấu trúc &  │  Nhân vật xuất hiện trong  │ (Tự sự, Bút  │          │
│       │  Huyết thống)│  bài viết gắn ID @I1@...   │  ký, Ký ức)  │          │
│       └──────────────┘                            └──────────────┘          │
│              │                                           │                  │
│              │ Dẫn nguồn sự kiện                         │ Trích dẫn        │
│              ▼                                           ▼                  │
│       ┌──────────────┐                            ┌──────────────┐          │
│       │     LỊCH     │                            │   TƯ LIỆU    │          │
│       │ (Ngày giỗ,   │                            │ (Bản scan cổ,│          │
│       │  Sinh nhật)  │                            │  Bia mộ tổ)  │          │
│       └──────────────┘                            └──────────────┘          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

- **Từ MẠCH sang GIA PHẢ**: Khi bài viết nhắc đến cụ Thu hay ông Thư, người đọc có thể bấm vào tên để mở ngay hồ sơ phả hệ của nhân vật đó.
- **Từ GIA PHẢ sang MẠCH**: Khi xem hồ sơ của cụ Thu, mục "Ký ức & Bài viết liên quan" sẽ liệt kê các bài viết trong MẠCH có nhắc đến cụ.
- **Từ MẠCH sang LỊCH**: Các bài viết về ngày giỗ hay lễ bổn mạng có thể đính kèm nút "Xem ngày giỗ trên Lịch gia tộc".
- **Từ MẠCH sang TƯ LIỆU**: Các bài khảo cứu về mộ tổ hay gia phả giấy dó có link xem bản scan độ phân giải cao trong kho Tư liệu.

---

## 4. QUY TRÌNH BIÊN TẬP & XUẤT BẢN TINH GỌN (OBSIDIAN $\rightarrow$ VERCEL)

Không cần xây dựng hệ thống CMS cồng kềnh hay hệ quản trị phức tạp. MẠCH tận dụng sức mạnh của Markdown và Git:

```
┌──────────────────────────┐      ┌──────────────────────────┐      ┌──────────────────────────┐
│ 1. BÀN VIẾT (Authoring)  │      │ 2. BIÊN DỊCH (Build)     │      │ 3. PHÁT HÀNH (Delivery)  │
│    (Obsidian Vault)      │ ───> │    (Python Engine)       │ ───> │    (Vercel Edge CDN)     │
│                          │      │                          │      │                          │
│ • Mach/PROJECTS/         │      │ • scripts/build_mach.py  │      │ • Deploy toàn cầu        │
│ • Soạn thảo Markdown     │      │ • Trích xuất YAML        │      │ • Tải siêu tốc < 1s      │
│ • Chèn ảnh & chú thích   │      │ • Xuất data/mach.json    │      │ • Xem trước (Preview)    │
└──────────────────────────┘      └──────────────────────────┘      └──────────────────────────┘
```

---

## 5. MẠCH DIGITAL MAGAZINE NORTH STAR (7 NGUYÊN TẮC VÀNG)

> [!NOTE]
> **7 NGUYÊN TẮC CỐT TỬ CỦA TẠP CHÍ MẠNG MẠCH:**
> 
> 1. **MẠCH LÀ TẠP CHÍ, KHÔNG PHẢI BLOG**: Mọi bài viết đều được tổ chức theo Số ấn phẩm, Chuyên mục tư tưởng và có chất lượng biên tập khắt khe.
> 2. **HÌNH ẢNH LÀ MỘT NỬA CÂU CHUYỆN**: Ảnh tư liệu đời thường, bia mộ, thiệp cưới là chứng tích lịch sử; ảnh và chữ luôn hòa quyện tạo nhịp điệu tự sự.
> 3. **TYPOGRAPHY SERIF LÀM LINH HỒN**: Sử dụng `Source Serif 4` cho toàn bộ không gian đọc để bảo tồn chiều sâu văn chương và sự tĩnh lặng của tâm hồn.
> 4. **TÔN TRỌNG TÍNH CHÂN THỰC (PROVENANCE)**: Mọi bức ảnh và câu chuyện đều có xuất xứ thực tế; tuyệt đối không dùng ảnh stock giả tạo hay bịa đặt chi tiết.
> 5. **ĐA DẠNG HÓA BỐ CỤC (LAYOUT ARCHETYPES)**: Tùy theo tính chất bài viết (bút ký, phóng sự ảnh, thư từ, khảo cứu) mà áp dụng bố cục thị giác phù hợp.
> 6. **TRẢI NGHIỆM ĐỌC DI ĐỘNG TUYỆT HẢO**: Canh trái tự nhiên, khổ chữ $\le 720\text{px}$, nhịp thở line-height $1.75$, không giật lag.
> 7. **HỆ THỐNG VỪA ĐỦ, BỀN VỮNG**: Lấy Obsidian làm bàn viết và Vercel làm bệ phóng; giữ mã nguồn tĩnh gọn gàng, trường tồn cùng thời gian.
