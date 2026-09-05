# KIẾN TRÚC ẤN PHẨM SỐ: PUBLICATION ARCHITECTURE_01
**Định nghĩa Nền tảng Digital Magazine & Editorial Architecture cho MẠCH trong Hệ sinh thái Dòng họ Trần Trọng Thu**

- **Tài liệu**: `docs/ux/PUBLICATION_ARCHITECTURE_01.md`
- **Dự án**: Cây Gia Phả & Tạp chí MẠCH (`gionghotrantrongthu.vercel.app`)
- **Visual Reference**: `/Users/tuantq/Projects/Personal/MACH` (Aesthetic, Mood & Tone, Typography, Materiality)
- **Editorial Reference**: BBC News Architecture (Content Hierarchy, Storytelling Formats, Editorial Discipline)
- **Content Source**: `/Users/tuantq/Obsidian/20_PROJECTS/Mach/PROJECTS`
- **Trạng thái**: Kiến trúc & Đặc tả Biên tập (Specification / No Redesign Code)

---

## 1. TỔNG QUAN: PHÂN ĐỊNH KHÔNG GIAN SẢN PHẨM

Hệ sinh thái số `gionghotrantrongthu.vercel.app` được tổ chức theo mô hình **Website Tri thức & Di sản Gia tộc (Family Knowledge & Heritage Platform)** gồm 4 không gian với công năng chuyên biệt:

```
                 HỆ SINH THÁI TRI THỨC GIA TỘC (FAMILY KNOWLEDGE PLATFORM)
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                           DÒNG HỌ TRẦN TRỌNG THU (WEBSITE GỐC)                          │
├──────────────────────────┬────────────────────────────┬─────────────────────────────────┤
│ 🌳 GIA PHẢ               │ 🧵 MẠCH                    │ 📅 LỊCH & 📚 TƯ LIỆU            │
│ (Information Mode)       │ (DIGITAL MAGAZINE MODE)    │ (Utility & Archival Modes)      │
│ • Cấu trúc phả hệ SVG    │ • Tạp chí mạng gia tộc     │ • Tra cứu Lịch Âm - Dương       │
│ • 223 Nhân vật (GEDCOM)  │ • Khảo cứu, Bút ký, Luận   │ • Đăng ký Lịch Apple/Google     │
│ • 68 Gia đình            │ • Tiếng nói trước đời sống │ • Kho bản scan gia phả cổ       │
│ • Quan hệ cha/con/vợ/chồng│ • Nhiếp ảnh đời thường     │ • Tư liệu bia mộ & chứng tích   │
└──────────────────────────┴────────────────────────────┴─────────────────────────────────┘
```

> [!IMPORTANT]
> **RANH GIỚI BẮT BUỘC:**
> 1. **MẠCH là một trang con (Sub-space / Digital Magazine)** nằm trong tổng thể `gionghotrantrongthu.vercel.app`, **không phải** một website độc lập và **không** tách rời khỏi căn tính dòng họ.
> 2. **Không ép toàn bộ website thành tạp chí**: Không gian Gia phả cần thanh thoát, chính xác; Lịch cần nhanh gọn, tiện dụng; Tư liệu cần trang nghiêm lưu trữ. MẠCH là nơi duy nhất áp dụng toàn diện công nghệ biên tập và trải nghiệm đọc tạp chí cao cấp.

---

## 2. ĐỊNH NGHĨA MỚI VỀ MẠCH: DIGITAL MAGAZINE & EDITORIAL VOICE

### 2.1. Bản Chất Của MẠCH
MẠCH không đơn thuần là một mục blog cá nhân hay nơi lưu trữ bài viết gia đình tản mạn.

> **MẠCH là một Digital Magazine của Dòng họ Trần Trọng Thu — nơi dòng họ kể những câu chuyện của mình, suy ngẫm về con người, văn hóa, xã hội và thời đại, và từ đó hình thành một "tiếng nói riêng của dòng họ trước đời sống".**

MẠCH mở rộng biên độ đề tài nhưng luôn neo chặt vào căn tính gia tộc:
- **Con người & Ký ức**: Chân dung tiền nhân, hồi ức các thế hệ F0–F3, những lát cắt đời thường.
- **Nếp nhà & Gia phong**: Nghi lễ, ngày giỗ, Tết, đám cưới, những khế ước vô hình gắn kết dòng tộc.
- **Văn hóa & Xã hội**: Sự chuyển dịch từ đại gia đình truyền thống sang gia đình hạt nhân hiện đại.
- **Thời đại & Công nghệ**: Trí tuệ nhân tạo (AI), giáo dục, sự trôi dạt của các thế hệ trẻ trong thế giới toàn cầu hóa.
- **Tôn giáo & Lịch sử**: Ký ức Công giáo xứ Bắc (Thanh Hóa, Kim Sơn, Phát Diệm) và hành trình lập nghiệp phương Nam.

---

### 2.2. Tam Giác Quy Chiếu Thiết Kế (The Reference Triad)

Để kiến tạo nên MẠCH, chúng ta kết hợp 3 trụ cột quy chiếu mà không sao chép nguyên xi bất kỳ hệ thống nào:

```
                          TAM GIÁC QUY CHIẾU MẠCH
                                     ▲
                                    / \
                                   /   \
                                  /     \
                                 /  MACH \
                                / (Visual) \
                               /____________\
                              ▲              ▲
                             /                \
                            /                  \
             BBC NEWS ARCHITECTURE ──────── CÂY GIA PHẢ HERITAGE
             (Editorial & Storytelling)     (Identity & Lineage)
```

1. **MACH Reference (`/Users/tuantq/Projects/Personal/MACH`)**:
   - Cung cấp: *Mood & Tone, Linh hồn thị giác, Typography (`Source Serif 4`), Bảng màu di sản (Đỏ sơn mài, Vàng đất, Mực than), Chất cảm ấn phẩm, Nhiếp ảnh đời thường chân thực.*
2. **BBC News Reference (Học hỏi Kiến trúc Biên tập)**:
   - Cung cấp: *Kỷ luật phân loại thông tin (Editorial Discipline), Cấu trúc trang chủ đa tầng (Editorial Curation), Các định dạng bài viết đa dạng (Story Formats), và sự phân định rạch ròi giữa Dữ kiện / Phân tích / Quan điểm.*
3. **Cây Gia Phả Context**:
   - Cung cấp: *Căn cước cốt lõi, nguồn dữ liệu phả hệ chuẩn tắc, mối liên kết huyết thống và bối cảnh lịch sử có thực của dòng họ.*

---

## 3. KỶ LUẬT BIÊN TẬP LẤY CẢM HỨNG TỪ BBC (EDITORIAL DISCIPLINE)

Một trong những giá trị quan trọng nhất học hỏi từ BBC là **tính minh bạch về thể loại nội dung**. Giao diện MẠCH không bao giờ để người đọc nhầm lẫn quan điểm cá nhân của một người là "chân lý chính thức của cả dòng họ".

```
                       HỆ THỐNG PHÂN ĐỊNH THỂ LOẠI NỘI DUNG
┌──────────────────┬──────────────────────────────────────────┬────────────────────────┐
│ Thể loại Label   │ Định nghĩa & Bản chất                    │ Badge Hiển thị         │
├──────────────────┼──────────────────────────────────────────┼────────────────────────┤
│ FACT             │ Dữ kiện lịch sử, trích lục hồ sơ,        │ 🏛️ TƯ LIỆU / DỮ KIỆN   │
│ (Dữ kiện)        │ nhật ký, niên biểu có bằng chứng xác thực│ (Màu Chàm `#1E293B`)   │
├──────────────────┼──────────────────────────────────────────┼────────────────────────┤
│ ANALYSIS         │ Phân tích, khảo cứu cấu trúc gia đình,   │ 🔍 KHẢO CỨU / PHÂN TÍCH│
│ (Khảo cứu)       │ sự biến chuyển xã hội qua các thời kỳ    │ (Màu Vàng đất `#C27803`)│
├──────────────────┼──────────────────────────────────────────┼────────────────────────┤
│ OPINION          │ Góc nhìn, suy ngẫm, cảm xúc riêng của    │ ✍️ GÓC NHÌN / Ý KIẾN   │
│ (Quan điểm)      │ một cá nhân (không đại diện cho cả dòng họ)│ (Màu Gỗ mộc `#78350F`) │
├──────────────────┼──────────────────────────────────────────┼────────────────────────┤
│ ESSAY            │ Bút ký, tản văn, văn chương tự sự,       │ 📖 BÚT KÝ / TỰ SỰ      │
│ (Tự sự / Luận)   │ dòng chảy ký ức mang tính triết lý sâu   │ (Màu Đỏ son `#9B1B1B`) │
├──────────────────┼──────────────────────────────────────────┼────────────────────────┤
│ FAMILY VOICE     │ Thông điệp chung, lời hiệu triệu,        │ 🌿 TIẾNG NÓI GIA TỘC   │
│ (Tiếng nói chung)│ kỷ yếu chính thức được hội đồng tán thành│ (Màu Lục bảo `#065F46`)│
└──────────────────┴──────────────────────────────────────────┴────────────────────────┘
```

---

## 4. HỆ THỐNG 10 ĐỊNH DẠNG NỘI DUNG (STORY FORMATS)

MẠCH hỗ trợ 10 định dạng bài viết chuyên biệt, giúp người viết truyền tải trọn vẹn thông điệp mà không bị giới hạn bởi một giao diện đơn điệu:

```
                           10 STORY FORMATS CỦA MẠCH
├── 1. ESSAY / NGHỊ LUẬN       : Khảo cứu nếp nhà, triết lý gia tộc (chữ thanh thoát, drop cap)
├── 2. LONG-FORM / CHUYÊN ĐỀ   : Bài đọc sâu 3000-5000 chữ, chia chương hồi, thanh tiến độ đọc
├── 3. PHOTO ESSAY             : Phóng sự ảnh ngày giỗ, Tết, đám cưới (chuỗi ảnh lớn kèm caption sâu)
├── 4. EPISTOLARY / THƯ TỪ     : Dạng thư gửi thế hệ sau (series "Thư gửi Clara")
├── 5. INTERVIEW / ĐỐI THOẠI   : Ghi chép trò chuyện trực tiếp giữa con cháu và các bậc cao niên
├── 6. HISTORICAL CHRONICLE    : Ký sự lịch sử (hành trình di cư, sự kiện thời chiến, giáo xứ cũ)
├── 7. EXPLAINER / CẨM NANG    : Giải thích phong tục, ý nghĩa ngày giỗ, cách xưng hô trong họ
├── 8. MEMORIAL / TƯỞNG NIỆM   : Bài viết tri ân, khắc họa chân dung người đã khuất
├── 9. CURRENT COMMENTARY      : Suy ngẫm về thời sự, công nghệ, AI dưới lăng kính nếp nhà
└── 10. MIXED MEDIA FEATURE    : Tích hợp văn bản, ảnh scan, trích lục phả hệ và âm thanh
```

---

## 5. BỐ CỤC TRANG CHỦ MẠCH THEO CHUẨN MAGAZINE (HOMEPAGE CURATION)

Lấy cảm hứng từ cấu trúc trang chủ của BBC nhưng thể hiện bằng ngôn ngữ ấn phẩm MACH: trang chủ MẠCH không sắp xếp bài viết theo thứ tự thời gian tuyến tính đơn điệu, mà được **biên tập theo trật tự thị giác và chiều sâu tư tưởng**:

```
                      BỐ CỤC TRANG CHỦ TẠP CHÍ MẠCH (#/mach)
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. MAGAZINE MASTHEAD & CURRENT ISSUE                                        │
│    🌿 MẠCH — NẾP NHÀ & KÝ ỨC SỐNG                                           │
│    Ấn phẩm Lưu trữ — Số 01/2026: "Dòng Họ Trong Thời Hiện Đại"              │
├─────────────────────────────────────────────────────────────────────────────┤
│ 2. HERO FEATURE STORY (Bài Đinh / Tâm Điểm Số Báo)                          │
│    ┌───────────────────────────────────┬──────────────────────────────────┐ │
│    │ [ ẢNH COVER TOÀN KHỔ ĐẬM NÉT ]    │ 📖 BÚT KÝ • BÀI 03               │ │
│    │                                   │ Dòng Họ Trong Thời Hiện Đại      │ │
│    │ Bia mộ tổ Họ Trần tại Thanh Hóa   │ Giữ mạch hay chấp nhận tan rã?   │ │
│    │                                   │ ↳ Đọc bài viết tâm điểm →        │ │
│    └───────────────────────────────────┴──────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────┤
│ 3. SECONDARY EDITORIAL GRID (Các Bài Trọng Điểm Đi Kèm)                    │
│    ┌──────────────────────┐ ┌──────────────────────┐ ┌────────────────────┐ │
│    │ 04. Đạo Lý Đời Sống  │ │ 05. Khế Ước Vô Hình  │ │ 06. Giỗ & Ký Ức    │ │
│    │ [Ảnh minh họa nhỏ]   │ │ [Ảnh thiệp cưới]     │ │ [Ảnh mâm cơm giỗ]  │ │
│    │ Đoạn tóm tắt lead... │ │ Đoạn tóm tắt lead... │ │ Đoạn tóm tắt lead..│ │
│    └──────────────────────┘ └──────────────────────┘ └────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────┤
│ 4. TOPIC SHELVES (Các Kệ Chuyên Mục Chọn Lọc)                               │
│    ├── 🕊️ LỜI MỞ & ĐỊNH HƯỚNG                                               │
│    ├── 🔍 KHẢO CỨU & NẾP NHÀ                                                │
│    └── 🏛️ KHO TƯ LIỆU VÀ DI SẢN                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ 5. SPECIAL SERIES SHOWCASE (Không Gian Series Độc Lập)                      │
│    ✉️ THƯ GỬI CLARA — Dòng chảy suy tưởng gửi thế hệ tương lai               │
│    Tác giả: Tuấn (Người Giữ Mạch) • Tuyển tập 10 lá thư                     │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. CÂN BẰNG THỊ GIÁC & TRẢI NGHIỆM ĐỌC (IMAGE ↔ TEXT RHYTHM)

Nhịp điệu bài đọc trong MẠCH tuân thủ nghiêm ngặt nguyên tắc **"Hình ảnh là một nửa câu chuyện"**:

$$\text{Editorial Cadence} = \text{Lead Deck} \rightarrow \text{Prose (2 đoạn)} \rightarrow \text{Hero/Photo} \rightarrow \text{Rich Caption} \rightarrow \text{Prose} \rightarrow \text{Pull Quote} \rightarrow \text{Prose} \rightarrow \text{Colophon}$$

```
                           NHỊP THỞ BÀI ĐỌC TẠI MẠCH
┌─────────────────────────────────────────────────────────────────────────────┐
│ • LEAD DECK     : Đoạn dẫn nhập 19px, line-height 1.7 (khởi động cảm xúc)   │
│ • PROSE BLOCK 1 : 2 đoạn phân tích bối cảnh                                 │
│ • VISUAL ANCHOR : Ảnh tư liệu thật (bàn thờ, bữa cơm, bao thiệp cưới)       │
│ • RICH CAPTION  : Chú thích xuất xứ rõ ràng (nhân vật, năm, bối cảnh)       │
│ • PROSE BLOCK 2 : Luận giải sâu sắc về nếp nhà                              │
│ • PULL QUOTE    : “ Trích dẫn đắt giá nhất đặt trong khối nổi bật có icon ” │
│ • PROSE BLOCK 3 : Lời kết và gợi mở suy ngẫm cho thế hệ tiếp nối            │
│ • COLOPHON      : Chữ ký tác giả trang trọng (Người Giữ Mạch • Sài Gòn 2026)│
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. ĐA TÁC GIẢ & TIẾNG NÓI TƯƠNG LAI (MULTI-AUTHOR ARCHITECTURE)

Mặc dù hiện tại Tuấn (`Người Giữ Mạch`) là tác giả chính của hầu hết các bài luận và series *Thư gửi Clara*, kiến trúc của MẠCH được thiết kế để **mở rộng cho nhiều thành viên và thế hệ khác trong dòng họ tham gia viết bài**:
- Mỗi bài viết có trường `authorId` trỏ về hồ sơ tác giả chuẩn.
- Hồ sơ tác giả bao gồm: Họ tên, Vai vế thế hệ trong gia phả (ví dụ: *Thế hệ F2 - Nhánh ông Thư*), Bút danh, Địa danh sinh sống và danh sách các bài đã viết.
- Tạo không gian cho con cháu ở nước ngoài, các chú bác cao niên cùng đóng góp hồi ức.

---

## 8. QUY TRÌNH BIÊN TẬP TINH GỌN (OBSIDIAN $\rightarrow$ VERCEL)

Không cần xây dựng CMS hay cơ sở dữ liệu cồng kềnh, MẠCH tận dụng workflow Markdown thanh lịch:

```
┌──────────────────────────┐      ┌──────────────────────────┐      ┌──────────────────────────┐
│ 1. BÀN VIẾT (Authoring)  │      │ 2. BIÊN DỊCH (Build)     │      │ 3. PHÁT HÀNH (Delivery)  │
│    (Obsidian Vault)      │ ───> │    (Python Engine)       │ ───> │    (Vercel Edge CDN)     │
│                          │      │                          │      │                          │
│ • Mach/PROJECTS/         │      │ • scripts/build_mach.py  │      │ • Tải siêu tốc < 1s      │
│ • Soạn thảo Markdown     │      │ • Trích xuất Fact/Opinion│      │ • Deploy toàn cầu        │
│ • Chèn ảnh & chú thích   │      │ • Xuất data/mach.json    │      │ • Hỗ trợ Preview         │
└──────────────────────────┘      └──────────────────────────┘      └──────────────────────────┘
```

---

## 9. MẠCH EDITORIAL NORTH STAR (10 NGUYÊN TẮC KIM CHỈ NAM)

> [!NOTE]
> **10 NGUYÊN TẮC VÀNG CỦA TẠP CHÍ MẠNG MẠCH:**
> 
> 1. **MỤC ĐÍCH TỐI THƯỢNG (PURPOSE)**: MẠCH là tiếng nói văn hóa và sự suy tư của Dòng họ Trần Trọng Thu trước đời sống đương đại; lưu giữ ký ức sống song song với cấu trúc phả hệ.
> 2. **ĐỐI TƯỢNG ĐỘC GIẢ (AUDIENCE)**: Trước hết là con cháu trong gia tộc (đặc biệt là thế hệ trẻ lớn lên xa quê); sau đó là những ai quan tâm đến văn hóa gia đình và sự tiếp nối thế hệ.
> 3. **GIỌNG ĐIỆU BIÊN TẬP (EDITORIAL VOICE)**: Điềm đạm, chân thành, sâu lắng, khảo cứu trung thực, đầy tình cảm nhưng không sáo rỗng, giáo điều.
> 4. **NGUYÊN TẮC NỘI DUNG (CONTENT PRINCIPLES)**: Mọi câu chuyện đều phải có căn cước gia đình; mở rộng sang các vấn đề xã hội/công nghệ nhưng luôn nhìn từ góc độ nếp nhà.
> 5. **ĐA DẠNG HÓA STORY FORMATS**: Sử dụng linh hoạt 10 định dạng (bút ký, phóng sự ảnh, thư từ, đối thoại...) phù hợp với bản chất câu chuyện.
> 6. **HÌNH ẢNH LÀ MỘT NỬA CÂU CHUYỆN**: 100% ảnh tư liệu đời thường thật kèm chú thích niên đại và xuất xứ; tuyệt đối không dùng ảnh stock giả tạo.
> 7. **PHÂN ĐỊNH FACT / ANALYSIS / OPINION**: Minh bạch tuyệt đối giữa dữ kiện lịch sử, phân tích khảo cứu và suy tưởng cá nhân của tác giả.
> 8. **GẮN KẾT CHẶT CHẼ VỚI CĂN TÍNH DÒNG HỌ**: Không biến thành một tờ báo tin tức đại trà; luôn giữ sợi dây liên kết với cội nguồn Phong Ý, Kim Sơn và gia tộc.
> 9. **MỐI QUAN HỆ HỮU CƠ VỚI CÂY GIA PHẢ**: Là không gian tự sự bổ trợ cho dữ liệu gia phả, kết nối 2 chiều với hồ sơ nhân vật và sự kiện lịch gia đình.
> 10. **HỆ THỐNG MỞ VÀ TRƯỜNG TỒN (FUTURE POSSIBILITIES)**: Kiến trúc hỗ trợ nhiều cây bút trong gia đình cùng đóng góp, vận hành tinh gọn qua nhiều thập kỷ.
