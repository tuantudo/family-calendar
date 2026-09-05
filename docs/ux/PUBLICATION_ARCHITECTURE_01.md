# KIẾN TRÚC ẤN PHẨM SỐ: PUBLICATION ARCHITECTURE_01
**Định nghĩa Nền tảng Digital Publication cho Cây Gia Phả Dòng Họ Trần Trọng Thu**

- **Tài liệu**: `docs/ux/PUBLICATION_ARCHITECTURE_01.md`
- **Dự án**: Cây Gia Phả & Ấn phẩm MẠCH (`gionghotrantrongthu.vercel.app`)
- **Visual & Editorial Reference**: `/Users/tuantq/Projects/Personal/MACH`
- **Content Source**: `/Users/tuantq/Obsidian/20_PROJECTS/Mach/PROJECTS`
- **Trạng thái**: Kiến trúc & Đặc tả mô hình (Specification / No Redesign Code)

---

## 1. TỔNG QUAN: BƯỚC CHUYỂN DỊCH MÔ HÌNH SẢN PHẨM

Sau khi hoàn thành `MACH_VISUAL_REFERENCE_AUDIT`, định hướng sản phẩm của Cây Gia Phả được nâng lên một tầm vóc mới:

> [!IMPORTANT]
> **ĐỊNH NGHĨA SẢN PHẨM (PARADIGM SHIFT):**  
> Cây Gia Phả **không phải là một phần mềm gia phả (genealogy web app) thông thường có gắn thêm mục bài viết**.  
> Cây Gia Phả là một **Ấn phẩm Văn hóa Gia tộc Đương đại (A Contemporary Family Cultural Publication)** trên nền tảng web, trong đó **Phả hệ / Dữ liệu (Genealogy Data)**, **Bài viết Tự sự (Editorial Content)**, **Lịch Trực tuyến (Calendar)** và **Tư liệu Lịch sử (Archive)** là các **Chế độ (Modes)** khác nhau của cùng một hệ thống tri thức gia đình duy nhất.

```
                  KIẾN TRÚC TỔNG THỂ CÂY GIA PHẢ PUBLICATION
┌─────────────────────────────────────────────────────────────────────────────┐
│                    DÒNG HỌ TRẦN TRỌNG THU — PUBLICATION                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  🌳 GIA PHẢ            🧵 MẠCH              📅 LỊCH           📚 TƯ LIỆU     │
│  (Information Mode)   (Editorial Mode)     (Utility Mode)    (Archive Mode) │
│  - Cây phả hệ SVG     - Ấn phẩm chuyên san - Sinh nhật       - Bản scan cổ  │
│  - 223 Nhân vật       - Khảo cứu văn hóa   - Lễ Bổn mạng     - Bia mộ tổ    │
│  - 68 Gia đình        - Ký ức đời sống     - Ngày giỗ Âm/Dương- Di thư/Hồi ký│
│  - Quan hệ thế hệ     - Thư gửi Clara      - Sự kiện gia tộc - Chứng tích   │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  LỚP DỮ LIỆU & QUAN HỆ CHUẨN XÁC (Canonical & Cross-Linked Data Layer)       │
│  - GEDCOM (genealogy.json) ── Cross-Links ── Obsidian Vault (mach.json)     │
├─────────────────────────────────────────────────────────────────────────────┤
│  HẠ TẦNG VẬN HÀNH & PHÂN PHỐI (Build & Delivery Layer)                      │
│  Obsidian Markdown ──> Python Build Engine ──> Static JSON/HTML ──> Vercel  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. CONTENT MODEL TOÀN DIỆN (MÔ HÌNH NỘI DUNG)

Một publication chất lượng cao đòi hỏi sự phân loại rành mạch giữa **Dữ liệu chuẩn tắc (Canonical)**, **Nội dung tự sự (Editorial)**, **Dữ liệu suy diễn (Derived)** và **Tài sản tư liệu (Media)**.

```
                              CONTENT ENTITY MATRIX
┌───────────────┬──────────────┬───────────────────────────────┬──────────────┐
│ Entity        │ Phân loại    │ Nguồn gốc dữ liệu             │ Khả năng     │
│               │              │ (Source of Truth)             │ Cross-Link   │
├───────────────┼──────────────┼───────────────────────────────┼──────────────┤
│ Person        │ Canonical    │ GEDCOM / genealogy.json       │ 2 chiều      │
│ Family        │ Canonical    │ GEDCOM / genealogy.json       │ 2 chiều      │
│ CalendarEvent │ Canonical    │ ICS feeds / Google Sheets     │ 1 chiều      │
│ Document      │ Canonical    │ Tư liệu vật lý / Bản số hóa   │ 2 chiều      │
│ Article       │ Editorial    │ Obsidian / Mach / PROJECTS    │ 2 chiều      │
│ Issue/Series  │ Editorial    │ Obsidian / Tập san lưu trữ    │ 1 chiều (1-N)│
│ Author        │ Editorial    │ Obsidian / Hồ sơ tác giả      │ 1 chiều (1-N)│
│ Topic         │ Editorial    │ Phân loại chủ đề ấn phẩm      │ 1 chiều (N-N)│
│ Memory        │ Editorial    │ Ghi chép ký ức đi kèm nhân vật│ 2 chiều      │
│ Image/Media   │ Media Asset  │ Assets kho lưu trữ hình ảnh   │ N-N          │
│ Generation    │ Derived      │ BFS Graph Engine (từ F0)      │ Tự động      │
└───────────────┴──────────────┴───────────────────────────────┴──────────────┘
```

### Nguyên tắc liên kết (Relationship & Cross-Linking Rules):
1. **Liên kết được phép (Explicit Cross-Links)**:
   - Một **Article** có thể dẫn nguồn tới danh sách các **Person ID** (ví dụ: `@I1@` Giuse Trần Trọng Thu, `@I7@` An-tôn Trần Trọng Thư) và **Family ID** (`@F2@`) khi bài viết trực tiếp đề cập đến họ.
   - Một **Person Profile** có thể hiển thị danh sách các **Article** và **Memory** liên quan đến nhân vật đó.
   - Một **Calendar Event** ngày giỗ có thể bấm để mở trực tiếp hồ sơ người đã khuất.
2. **Nguyên tắc cấm tuyệt đối (Strict Non-Inference Rule)**:
   - **Tuyệt đối không tự suy diễn mối quan hệ họ hàng hoặc sự kiện lịch sử** nếu dữ liệu gốc không có căn cứ.
   - Nếu một bài viết nhắc đến một nhân vật chưa có mã ID trong gia phả, giữ nguyên dưới dạng văn bản tự sự (mention), không tự tiện tạo Person giả mạo trong GEDCOM.

---

## 3. ARTICLE MODEL CHI TIẾT (MÔ HÌNH BÀI VIẾT TỰ SỰ)

Mỗi bài viết trong MẠCH không phải là một bài blog ngẫu hứng mà là một **tiểu phẩm khảo cứu hoặc hồi ức có cấu trúc xuất bản chặt chẽ**:

```json
{
  "id": "art_issue01_03",
  "slug": "03-dong-ho-trong-thoi-hien-dai",
  "order": 3,
  "issue": {
    "id": "ISSUE_01",
    "title": "MẠCH — Số 01/2026",
    "theme": "Dòng họ trong thời hiện đại — Giữ mạch hay chấp nhận tan rã?"
  },
  "section": "Luận",
  "title": "Dòng Họ Trong Thời Hiện Đại: Giữ Mạch Hay Chấp Nhận Tan Rã?",
  "shortTitle": "Dòng họ trong thời hiện đại",
  "subtitle": "Đằng sau những cuộc gặp gỡ là câu hỏi về sự tiếp nối trong đời sống mới.",
  "deckLead": "Những dịp như đám cưới Nam hay buổi họp mặt con cháu ông bà Mục Điền không chỉ đơn thuần là những cuộc gặp gỡ gia đình. Đằng sau đó là câu hỏi lớn hơn mà nhiều người trong thế hệ hôm nay đều đang âm thầm đối diện...",
  "author": {
    "id": "nguoi-giu-mach",
    "name": "Người Giữ Mạch",
    "role": "Biên tập & Khảo cứu gia tộc",
    "location": "Sài Gòn",
    "date": "2026-05-23"
  },
  "topics": ["luan", "the-he", "nghi-le", "ky-uc"],
  "heroMedia": {
    "src": "assets/images/mach/issue_01/Mo-to-ho-Tran.jpg",
    "type": "photograph",
    "alt": "Bia mộ tổ họ Trần tại Phong Ý, Thanh Hóa",
    "caption": "Bia mộ tổ Họ Trần tại Phong Ý, Phong Sơn, Cẩm Thủy, Thanh Hóa.",
    "date": "2024",
    "source": "Tư liệu gia đình"
  },
  "body": "Nội dung bài viết định dạng Markdown/HTML sạch...",
  "pullQuotes": [
    {
      "quote": "Nếu vắng mặt quá lâu, nếu không còn xuất hiện trong các dịp quan trọng... thì mối nối với dòng họ cũng bắt đầu mỏng dần đi theo thời gian.",
      "anchorParagraph": 4
    }
  ],
  "inlineImages": [
    {
      "id": "img_01",
      "src": "assets/images/mach/issue_01/dam-cuoi-nam.jpg",
      "caption": "Hình 12. Thiệp cưới Nam — đích tôn nhánh ông chú Thả.",
      "date": "2026-06",
      "peopleIds": ["@I18@", "@I124@"]
    }
  ],
  "relatedEntities": {
    "people": ["@I1@", "@I7@", "@I9@"],
    "families": ["@F2@"],
    "documents": ["doc_mo_to_phong_y"],
    "articles": ["01-gioi-thieu", "02-cay-gia-pha-va-mach"]
  },
  "publicationStatus": "published",
  "provenance": {
    "sourceVaultFile": "Obsidian/20_PROJECTS/Mach/PROJECTS/ISSUE_01/CANONICAL/03 — DÒNG HỌ TRONG THỜI HIỆN ĐẠI.md",
    "compiledAt": "2026-09-05T19:00:00Z",
    "checksum": "sha256:..."
  }
}
```

---

## 4. MEDIA MODEL & XỬ LÝ TƯ LIỆU HÌNH ẢNH

Publication xử lý hình ảnh theo **7 loại hình chuyên biệt**, đảm bảo tính chân thực và minh bạch lịch sử:

```
                            PHÂN LOẠI MEDIA TƯ LIỆU
├── 1. HERO IMAGE         : Ảnh bìa mở đầu bài viết (khổ rộng, ấn tượng)
├── 2. EDITORIAL IMAGE    : Ảnh sinh hoạt gia đình minh họa bài viết (mâm cơm, ngày giỗ, Tết)
├── 3. PHOTO GALLERY      : Bộ sưu tập ảnh nhiều góc nhìn về một sự kiện/đại hội họ
├── 4. SCANNED DOCUMENT   : Bản scan gia phả cổ, chứng thư rửa tội, văn tự chữ Nôm/Quốc ngữ
├── 5. PORTRAIT           : Ảnh chân dung cá nhân (phục dựng hoặc ảnh thẻ thời xưa)
├── 6. HISTORICAL PHOTO   : Ảnh tư liệu lịch sử qua các thời kỳ (trước 1975, thời di cư)
└── 7. DECORATIVE ASSET   : Logo măng-sét MẠCH, biểu tượng hoa văn di sản
```

### Chuẩn dữ liệu bắt buộc cho từng hình ảnh (Media Metadata Schema):
- `src`: Đường dẫn file tối ưu (WebP/AVIF).
- `raw_src`: Đường dẫn file gốc độ phân giải cao trong kho lưu trữ.
- `alt`: Văn bản mô tả tiếp cận cho người khiếm thị / SEO.
- `caption`: Chú thích đầy đủ (Đánh số hình, nội dung sự kiện, địa điểm).
- `date` / `period`: Niên đại chụp hoặc giai đoạn lịch sử (nếu biết).
- `photographer` / `source`: Người chụp hoặc nguồn lưu trữ.
- `provenance`: Xuất xứ hiện vật (Ví dụ: *Ảnh do bác Hạnh lưu giữ, scan năm 2024*).
- `people_depicted`: Danh sách các mã Person ID có mặt trong ảnh.

---

## 5. RESPONSIVE EDITORIAL COMPOSITION (BỐ CỤC DÀN TRANG SỐ)

Thiết kế giao diện đáp ứng (Responsive) phải giải quyết bài toán: **Desktop mang đẳng cấp tạp chí in, Mobile mang lại trải nghiệm đọc sách điện tử êm ái nhất.**

```
                     DESKTOP COMPOSITION (>= 1024px)
┌─────────────────────────────────────────────────────────────────────────────┐
│  RUNNING HEADER: MẠCH — NẾP NHÀ & KÝ ỨC SỐNG            SỐ 01/2026  ───     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                     [ FULL-WIDTH HERO IMAGE / SPREAD ]                      │
│                                                                             │
│                             TIÊU ĐỀ BÀI VIẾT                                │
│                   Dòng họ trong thời hiện đại (Serif 36px)                  │
│                                                                             │
│          Lời tựa dẫn nhập (Lead Deck) - Source Serif 19px, line-height 1.7   │
│          Người Giữ Mạch • Sài Gòn, 2026 • 8 phút đọc                        │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  ┌───────────────────────────────┐   ┌───────────────────────────────────┐  │
│  │ THÂN BÀI CHÍNH (Max 720px)    │   │ CỘT BÊN / HIGHLIGHT (Optional)    │  │
│  │ • Chữ mở đầu lớn (Drop Cap)   │   │                                   │  │
│  │ • Đoạn văn xuôi căn trái      │   │ ┌───────────────────────────────┐ │  │
│  │                               │   │ │ “ KHỐI TRÍCH DẪN PULL QUOTE   │ │  │
│  │ [ ẢNH MINH HỌA TOÀN KHỔ ]     │   │ │   Vòng tròn ngoặc kép tròn    │ │  │
│  │ Chú thích ảnh chi tiết...     │   │ │   Trích dẫn đắt giá nhất ”    │ │  │
│  │                               │   │ └───────────────────────────────┘ │  │
│  │ • Đoạn luận tiếp theo         │   │                                   │  │
│  │ • Phân đoạn suy ngẫm          │   │ ┌───────────────────────────────┐ │  │
│  │                               │   │ │ 👤 NHÂN VẬT LIÊN QUAN         │ │  │
│  │ Chữ ký tác giả cuối bài       │   │ │ - Giuse Trần Trọng Thu        │ │  │
│  │ ───────────────────────────── │   │ │ - An-tôn Trần Trọng Thư       │ │  │
│  │                               │   │ └───────────────────────────────┘ │  │
│  └───────────────────────────────┘   └───────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘

                      MOBILE COMPOSITION (< 768px)
┌─────────────────────────────────────────┐
│ 🌿 DÒNG HỌ TRẦN TRỌNG THU               │
├─────────────────────────────────────────┤
│ [ HERO IMAGE (Tỷ lệ 16:9 hoặc 4:3) ]    │
│                                         │
│ MẠCH — SỐ 01 • BÀI 03                   │
│ DÒNG HỌ TRONG THỜI HIỆN ĐẠI             │
│                                         │
│ ✍️ Người Giữ Mạch • 2026                 │
│ ─────────────────────────────────────── │
│ Lời tựa dẫn nhập nổi bật...             │
│                                         │
│ Đoạn văn xuôi 1...                      │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ “ KHỐI PULL QUOTE CHUẨN MACH        │ │
│ │   (Canh giữa, nền ấm, icon nổi) ”   │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Đoạn văn xuôi 2...                      │
│                                         │
│ [ ẢNH MINH HỌA ĐỜI THƯỜNG ]             │
│ ↳ Chú thích ảnh đầy đủ niên đại         │
│                                         │
│ Đoạn kết & Chữ ký tác giả...            │
│ ─────────────────────────────────────── │
│ 📚 Bài tiếp theo: 04 — Giỗ và ký ức...   │
└─────────────────────────────────────────┘
```

---

## 6. NHỊP ĐIỆU THỊ GIÁC (VISUAL RHYTHM & CADENCE)

Dựa trên khảo sát 26 trang bản in `MACH-01.pdf`, một bài đọc tiêu chuẩn trên web cần tuân theo công thức nhịp điệu:

$$\text{Rhythm} = \text{Lead} \rightarrow \text{Prose (2-3 đoạn)} \rightarrow \text{Hero/Photo} \rightarrow \text{Prose} \rightarrow \text{Pull Quote} \rightarrow \text{Prose} \rightarrow \text{Signature \& Next}$$

- **Tránh "Bức tường chữ" (Wall of Text)**: Không để quá 4 đoạn văn bản thuần túy mà không có điểm nghỉ mắt (Hình ảnh tư liệu, trích dẫn triết lý, hoặc đề mục nhỏ).
- **Tránh "Trưng bày ảnh hời hợt" (Slideshow clutter)**: Mọi hình ảnh xuất hiện đều phải phục vụ trực tiếp cho câu chuyện đang kể, không chèn ảnh vụn vặt làm loãng mạch cảm xúc.

---

## 7. QUY TRÌNH BIÊN TẬP & PHÂN PHỐI (OBSIDIAN $\rightarrow$ VERCEL)

Tách biệt tuyệt đối 3 tầng công nghệ:

```
┌──────────────────────────┐      ┌──────────────────────────┐      ┌──────────────────────────┐
│ 1. CONTENT SOURCE        │      │ 2. BUILD SYSTEM          │      │ 3. HOSTING & CDN         │
│    (Obsidian Vault)      │ ───> │    (Python Engine)       │ ───> │    (Vercel Edge)         │
│                          │      │                          │      │                          │
│ • Thư mục:               │      │ • scripts/build_mach.py  │      │ • gionghotrantrongthu    │
│   Mach/PROJECTS/         │      │ • Parse YAML frontmatter │      │   .vercel.app            │
│ • Soạn thảo Markdown     │      │ • Validate entity IDs    │      │ • Global Edge Cache      │
│ • Lưu trữ ảnh gốc        │      │ • Xuất data/mach.json    │      │ • Instant Preview        │
└──────────────────────────┘      └──────────────────────────┘      └──────────────────────────┘
```

### Workflow vận hành:
1. **Biên tập (Authoring)**: Tuấn viết và hoàn thiện bài viết trong Obsidian Vault tại `/Users/tuantq/Obsidian/20_PROJECTS/Mach/PROJECTS/`.
2. **Biên dịch & Thẩm định (Build & Verification)**: Chạy script kiểm tra cú pháp, trích xuất metadata, tự động kết nối chéo mã nhân vật gia phả và xuất ra `data/mach.json`.
3. **Phát hành (Deploy)**: Đẩy commit lên GitHub $\rightarrow$ Vercel tự động build và phân phối toàn cầu qua CDN.

---

## 8. CHIẾN LƯỢC TỐI ƯU HÌNH ẢNH (IMAGE ASSET STRATEGY)

Để tải mượt mà trên mạng di động 4G/5G và không làm chậm trình duyệt khi hiển thị ảnh tư liệu lớn:

1. **Định dạng hiện đại (Next-gen Formats)**:
   - Sử dụng định dạng **WebP** và **AVIF** với mức nén chất lượng 82–85% (giảm 70% dung lượng so với JPEG gốc mà mắt thường không phân biệt được).
2. **Kích thước đa tầng (Responsive Sizes)**:
   - `thumb`: $400\text{px}$ (Thẻ danh sách / Avatar).
   - `medium`: $900\text{px}$ (Ảnh minh họa thân bài trên mobile & tablet).
   - `large`: $1600\text{px}$ (Ảnh Hero toàn khổ trên màn hình Retina).
   - `master`: Lưu trữ trong kho gốc phục vụ in ấn khi cần.
3. **Tải thông minh (Lazy Loading & Preload)**:
   - Ảnh Hero trên cùng: gắn `fetchpriority="high"` để hiển thị ngay lập tức.
   - Các ảnh minh họa bên dưới: gắn `loading="lazy"` và `decoding="async"`.
   - Giữ tỷ lệ khung hình cố định (Aspect ratio box) trong CSS để chống giật trang (Cumulative Layout Shift - CLS = 0).

---

## 9. LỘ TRÌNH THỰC HIỆN TỪNG BƯỚC (PRIORITIZED ROADMAP)

```
LỘ TRÌNH THỰC HIỆN
├── BƯỚC 1: Hoàn thiện Component Bài đọc MẠCH (Pull quotes, Lead deck, Captions)
├── BƯỚC 2: Tự động hóa Pipeline trích xuất Obsidian -> data/mach.json
├── BƯỚC 3: Kết nối 2 chiều giữa Bài viết MẠCH và Hồ sơ Nhân vật Cây Gia Phả
├── BƯỚC 4: Xây dựng Giao diện Kho Tư Liệu (Visual Archival Viewer)
└── BƯỚC 5: Tinh chỉnh Trang HOME thành Lời Tựa Gia Tộc mở đầu ấn phẩm
```

---

## 10. PUBLICATION NORTH STAR (7 NGUYÊN TẮC VÀNG CỐT TỬ)

> [!NOTE]
> **7 NGUYÊN TẮC CỐT LÕI CHO HỆ THỐNG DIGITAL PUBLICATION CÂY GIA PHẢ:**
> 
> 1. **MỘT GIA TỘC, ĐA CHẾ ĐỘ (ONE FAMILY, MULTIPLE MODES)**: Gia phả là cấu trúc; Mạch là tự sự; Lịch là tiện ích; Tư liệu là chứng tích. Cùng phụng sự một cội nguồn duy nhất.
> 2. **DỮ LIỆU CHUẨN TẮC, KHÔNG BỊA ĐẶT**: Mọi quan hệ huyết thống và chú thích ảnh phải xuất phát từ sự thật; tuyệt đối không tự suy diễn hư cấu.
> 3. **TYPOGRAPHY LÀ LINH HỒN BIỂU CẢM**: Giữ trọn vẹn cặp font `Be Vietnam Pro` (chính xác, công cụ) và `Source Serif 4` (sâu lắng, văn chương).
> 4. **NHỊP ĐỌC TĨNH TẠI (SLOW READING)**: Bố cục có khoảng thở rộng rãi, trích dẫn điểm nhấn, không nhồi nhét, không biến trang web thành bảng điều khiển ngột ngạt.
> 5. **TÔN TRỌNG TÍNH THỜI GIAN CỦA TƯ LIỆU**: Giữ nguyên vẹn vẻ đẹp mộc mạc của ảnh chụp đời thường, bản scan gia phả cũ và bia mộ tổ.
> 6. **TRẢI NGHIỆM DI ĐỘNG KHÔNG THỎA HIỆP**: Khổ chữ $\le 720\text{px}$, canh trái tự nhiên, chạm vuốt dễ dàng, tải nhanh nhẹ dưới 1 giây.
> 7. **HỆ THỐNG VỪA ĐỦ, KHÔNG XÂY CMS CỒNG KỀNH**: Giữ kiến trúc tĩnh, tinh gọn, bền vững, lấy Obsidian làm bàn viết và Vercel làm bệ phóng.
