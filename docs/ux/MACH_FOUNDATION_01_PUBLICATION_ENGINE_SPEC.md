# ĐẶC TẢ HẠ TẦNG XUẤT BẢN: MACH_FOUNDATION_01
**Khóa Publication Engine Contract cho Tạp chí MẠCH trong Hệ sinh thái Dòng họ Trần Trọng Thu**

- **Tài liệu**: `docs/ux/MACH_FOUNDATION_01_PUBLICATION_ENGINE_SPEC.md`
- **Mã nhiệm vụ**: `MACH_FOUNDATION_01`
- **Phạm vi áp dụng**: Không gian Tạp chí MẠCH (`#/mach`, `#/mach/bai-viet/*`, `#/mach/series/*`, `#/mach/tac-gia/*`)
- **Visual Reference**: `/Users/tuantq/Projects/Personal/MACH` (Ấn phẩm MẠCH — Số 01/2026)
- **Editorial Reference**: BBC News Architecture (Editorial Curation, Story Formats, Content Discipline)
- **Context**: Cây Gia Phả Dòng Họ Trần Trọng Thu (`gionghotrantrongthu.vercel.app`)
- **Trạng thái**: SPECIFICATION & CONTRACT (Không deploy visual/code trong mission này)

---

## 1. AUDIT HIỆN TRẠNG KỸ THUẬT (CURRENT ARCHITECTURE AUDIT)

Khảo sát đối chiếu toàn bộ mã nguồn và dữ liệu thực tế tại `/Users/tuantq/Projects/Personal/family-calendar`:

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                               MA TRẬN AUDIT CODEBASE MẠCH                                │
├────────────────────────────┬──────────────┬──────────────────────────────────────────────┤
│ Thành phần                 │ Trạng thái   │ Nhận định thực tế                            │
├────────────────────────────┼──────────────┼──────────────────────────────────────────────┤
│ `content/mach/issue-01/`   │ WHAT EXISTS  │ 13 file Markdown chuẩn (00 đến 12) từ        │
│                            │              │ Obsidian CANONICAL.                          │
├────────────────────────────┼──────────────┼──────────────────────────────────────────────┤
│ `data/mach.json`           │ WHAT EXISTS  │ JSON v2.0 chứa authors, series, topics,      │
│                            │              │ stories kèm `contentMarkdown` thô.           │
├────────────────────────────┼──────────────┼──────────────────────────────────────────────┤
│ `scripts/build_mach.py`    │ PARTIAL      │ Parser cơ bản, chưa bóc tách Blocks, chưa    │
│ `rebuild_mach_issue01.py`  │              │ trích xuất Rich Captions và Pull Quotes.     │
├────────────────────────────┼──────────────┼──────────────────────────────────────────────┤
│ `assets/images/mach/`      │ PARTIAL      │ Mới có ảnh series `thu-gui-clara`, chưa copy │
│                            │              │ bộ ảnh tư liệu của `ISSUE_01` từ repo MACH.  │
├────────────────────────────┼──────────────┼──────────────────────────────────────────────┤
│ `src/js/app.js` (MẠCH)     │ PARTIAL      │ Render danh sách phẳng, Markdown parse thô;  │
│                            │              │ chưa hỗ trợ Block-based và Curation layouts. │
├────────────────────────────┼──────────────┼──────────────────────────────────────────────┤
│ `src/css/main.css` (MẠCH)  │ PARTIAL      │ Đã có font Option C (`Source Serif 4`);      │
│                            │              │ thiếu styles cho Pull Quotes, Galleries...   │
├────────────────────────────┼──────────────┼──────────────────────────────────────────────┤
│ Global Search (MẠCH)       │ PARTIAL      │ Mới search theo tiêu đề/excerpt cơ bản;      │
│                            │              │ chưa tìm theo nội dung, tác giả, chuyên mục. │
├────────────────────────────┼──────────────┼──────────────────────────────────────────────┤
│ Cross-linking              │ MISSING      │ Chưa có liên kết 2 chiều giữa Article và     │
│                            │              │ Person ID (@I1@...) trong gia phả.           │
├────────────────────────────┼──────────────┼──────────────────────────────────────────────┤
│ Responsive Media Pipeline  │ MISSING      │ Chưa có WebP converter và srcset/sizes.      │
├────────────────────────────┼──────────────┼──────────────────────────────────────────────┤
│ Vercel Hosting & Delivery  │ DO NOT TOUCH │ Phân phối CDN tĩnh tối ưu, giữ nguyên 100%.  │
└────────────────────────────┴──────────────┴──────────────────────────────────────────────┘
```

---

## 2. CONTENT MODEL CONTRACT (MÔ HÌNH DỮ LIỆU CHUẨN TẮC)

Hệ thống phân định nghiêm ngặt 5 tầng dữ liệu:

```
                            CONTENT DATA TAXONOMY
┌────────────────────┬─────────────────────────────────────────────────────────────────────┐
│ 1. CANONICAL DATA  │ Dữ liệu gốc bất biến: Person ID (@I1@), Family ID (@F2@),           │
│                    │ Calendar Events, Văn tự cổ (Tư liệu gốc).                           │
├────────────────────┼─────────────────────────────────────────────────────────────────────┤
│ 2. EDITORIAL DATA  │ Nội dung do con người biên tập: Articles, Series, Topics, Authors,  │
│                    │ Subtitles, Decks, Pull quotes, Editorial selections.                │
├────────────────────┼─────────────────────────────────────────────────────────────────────┤
│ 3. DERIVED DATA    │ Dữ liệu tự động tính toán: Thời gian đọc, số bài viết, liên kết     │
│                    │ chéo nhân vật, bảng chỉ mục tìm kiếm, thế hệ phả hệ.                │
├────────────────────┼─────────────────────────────────────────────────────────────────────┤
│ 4. MEDIA ASSETS    │ Tài nguyên hình ảnh, bản scan, ảnh phục dựng kèm metadata xuất xứ.  │
├────────────────────┼─────────────────────────────────────────────────────────────────────┤
│ 5. PROVENANCE      │ Dấu vết nguồn gốc: File Obsidian nguồn, checksum, ngày xuất bản.    │
└────────────────────┴─────────────────────────────────────────────────────────────────────┘
```

### Chi tiết Schema Contract (JSON Definition):

```typescript
// 1. ARTICLE ENTITY
interface Article {
  id: string;                      // Unique ID: 'art_issue01_03'
  slug: string;                    // URL route: '03-khi-su-gan-gui-khong-con-tu-nhien'
  title: string;                   // Tiêu đề bài viết
  shortTitle?: string;             // Tiêu đề ngắn cho thanh điều hướng
  subtitle?: string;              // Tiêu đề phụ
  deckLead: string;                // Đoạn dẫn nhập (Editorial Deck)
  articleType: ArticleType;        // Thể loại định dạng (xem phần 3)
  editorialVoice: EditorialVoice;  // Phân loại tiếng nói (FACT | ANALYSIS | OPINION | ESSAY | FAMILY_VOICE)
  status: 'draft' | 'review' | 'ready' | 'published' | 'archived';
  featured: boolean;               // Có hiển thị ở Hero trang chủ hay không
  editorialOrder: number;          // Thứ tự ưu tiên hiển thị
  publishedAt: string;             // ISO-8601 string
  updatedAt: string;               // ISO-8601 string
  authorId: string;                // FK -> Author.id
  seriesId?: string;               // FK -> Series.id
  seriesOrder?: number;            // Thứ tự trong Series (ví dụ: Bài 03)
  section?: string;                // Lời mở | Luận | Tư liệu
  topicIds: string[];              // FK[] -> Topic.id
  heroMedia?: MediaRef;            // Ảnh Hero đầu bài
  contentBlocks: ContentBlock[];   // Danh sách các khối nội dung (xem phần 4)
  relatedEntities: {
    peopleIds: string[];           // Explicit links to Person IDs (@I1@...)
    familyIds: string[];           // Explicit links to Family IDs (@F2@...)
    documentIds: string[];         // Explicit links to Archive Documents
    articleSlugs: string[];        // Explicit links to Related Articles
  };
  provenance: {
    sourceFile: string;            // 'Mach/PROJECTS/ISSUE_01/CANONICAL/03.md'
    checksum: string;              // SHA-256 hash
  };
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;
  };
}

// 2. SERIES ENTITY
interface Series {
  id: string;                      // 'issue-01' | 'thu-gui-clara'
  slug: string;
  title: string;                   // 'MẠCH — Số 01: Dòng Họ Trong Đời Sống Đương Đại'
  subtitle?: string;
  description: string;
  authorIds: string[];
  coverImage?: MediaRef;
  articleSlugs: string[];
  type: 'issue' | 'themed_collection' | 'open_series';
}

// 3. AUTHOR ENTITY
interface Author {
  id: string;                      // 'nguoi-giu-mach'
  name: string;                    // 'Người giữ mạch'
  role: string;                    // 'Chấp bút & Khảo cứu MẠCH'
  bio: string;
  avatar: string;                  // Emoji hoặc URL ảnh chân dung
  personId?: string;               // Link tới Person ID nếu tác giả là thành viên phả hệ
  location?: string;               // 'Sài Gòn'
}

// 4. TOPIC ENTITY
interface Topic {
  id: string;                      // 'luan' | 'ky-uc' | 'nghi-le'
  slug: string;
  name: string;
  description: string;
}
```

---

## 3. ARTICLE TYPE: HỆ THỐNG 10 THỂ LOẠI BÀI VIẾT

Thay vì tạo 10 template giao diện cứng nhắc, MẠCH sử dụng **MỘT KHUNG BÀI VIẾT LINH HOẠT (One Flexible Article Composition)** kết hợp cùng các **Content Blocks**:

```
                              10 ARTICLE TYPES
┌───────────────────────────┬──────────────────────────────────────────────────────────────┐
│ Article Type              │ Đặc trưng cấu tạo khối (Block Composition)                   │
├───────────────────────────┼──────────────────────────────────────────────────────────────┤
│ 1. Essay (Bút ký)         │ Lead + Drop cap + Prose + 1 Hero + 1 Pull Quote + Signature  │
├───────────────────────────┼──────────────────────────────────────────────────────────────┤
│ 2. Long-form (Chuyên đề)  │ Hero Spreads + Chương mục (Sections) + Progress + Multi-media│
├───────────────────────────┼──────────────────────────────────────────────────────────────┤
│ 3. Photo Essay (Phóng sự) │ Image-first + Rich Captions + Short Narrative intros         │
├───────────────────────────┼──────────────────────────────────────────────────────────────┤
│ 4. Epistolary (Thư từ)    │ Salutation ("Clara thân mến,") + Italic Prose + Sign-off     │
├───────────────────────────┼──────────────────────────────────────────────────────────────┤
│ 5. Interview (Đối thoại)  │ Q&A Blocks (Người hỏi / Người đáp) + Audio excerpt (nếu có) │
├───────────────────────────┼──────────────────────────────────────────────────────────────┤
│ 6. Historical Chronicle   │ Niên biểu Timeline + Bản đồ di cư + Bản scan văn tự cổ       │
├───────────────────────────┼──────────────────────────────────────────────────────────────┤
│ 7. Explainer (Cẩm nang)   │ Danh mục bước (Step list) + Callout giải thích thuật ngữ     │
├───────────────────────────┼──────────────────────────────────────────────────────────────┤
│ 8. Memorial (Tưởng niệm)  │ Chân dung đen trắng + Lời tri ân + Niên biểu sinh mất        │
├───────────────────────────┼──────────────────────────────────────────────────────────────┤
│ 9. Current Commentary     │ Nhận định thời sự/công nghệ/AI dưới góc nhìn nếp nhà         │
├───────────────────────────┼──────────────────────────────────────────────────────────────┤
│ 10. Mixed Media Feature   │ Văn bản + Ảnh phóng to + Trích lục phả hệ nhánh thu nhỏ      │
└───────────────────────────┴──────────────────────────────────────────────────────────────┘
```

---

## 4. CONTENT BLOCK MODEL (MÔ HÌNH KHỐI BIÊN TẬP CỐT LÕI)

Trọng tâm kỹ thuật của MẠCH là tổ chức thân bài dưới dạng các khối biên tập có thể lắp ghép tự do:

```
                            HỆ THỐNG CONTENT BLOCKS
┌───────────────────────┬──────────────────────────────────────────────────────────────────┐
│ Block Type            │ Payload Schema                                                   │
├───────────────────────┼──────────────────────────────────────────────────────────────────┤
│ `lead_deck`           │ `{ text: string, emphasis?: boolean }`                           │
├───────────────────────┼──────────────────────────────────────────────────────────────────┤
│ `prose`               │ `{ markdown: string, hasDropCap?: boolean }`                     │
├───────────────────────┼──────────────────────────────────────────────────────────────────┤
│ `editorial_image`     │ `{ mediaId: string, size: 'normal'|'wide'|'full', caption: str }`│
├───────────────────────┼──────────────────────────────────────────────────────────────────┤
│ `pull_quote`          │ `{ quote: string, author?: string, anchorRef?: string }`         │
├───────────────────────┼──────────────────────────────────────────────────────────────────┤
│ `photo_gallery`       │ `{ mediaIds: string[], layout: 'grid_2'|'grid_3'|'carousel' }`   │
├───────────────────────┼──────────────────────────────────────────────────────────────────┤
│ `section_heading`     │ `{ level: 2 | 3, text: string, numPrefix?: string }`             │
├───────────────────────┼──────────────────────────────────────────────────────────────────┤
│ `callout_box`         │ `{ tone: 'heritage'|'archive'|'note', title?: str, body: str }` │
├───────────────────────┼──────────────────────────────────────────────────────────────────┤
│ `person_ref_card`     │ `{ personId: string, customNote?: string }`                      │
├───────────────────────┼──────────────────────────────────────────────────────────────────┤
│ `document_ref_card`   │ `{ documentId: string, thumbnail?: string, caption: string }`    │
├───────────────────────┼──────────────────────────────────────────────────────────────────┤
│ `timeline_block`      │ `{ items: Array<{ year: string, title: string, desc: string }> }`│
├───────────────────────┼──────────────────────────────────────────────────────────────────┤
│ `colophon_signature`  │ `{ authorId: string, location: string, date: string }`           │
└───────────────────────┴──────────────────────────────────────────────────────────────────┘
```

---

## 5. MEDIA MODEL (QUẢN TRỊ TƯ LIỆU HÌNH ẢNH HẠNG NHẤT)

Mỗi bức ảnh là một thực thể tư liệu có giá trị bảo tồn, được gắn đầy đủ ngữ cảnh xuất xứ:

```typescript
interface MediaAsset {
  id: string;                      // 'img_issue01_dam_cuoi_nam'
  src: string;                     // 'assets/images/mach/issue-01/dam-cuoi-nam.webp'
  rawSrc: string;                  // 'assets/images/mach/issue-01/raw/dam-cuoi-nam.jpg'
  mediaType: 'hero' | 'editorial' | 'portrait' | 'gallery' | 'historical_photo' | 'document_scan';
  alt: string;                     // Văn bản trợ năng
  caption: string;                 // 'Hình 12. Thiệp cưới Nam — đích tôn nhánh ông chú Thả'
  date?: string;                   // '07/06/2026' hoặc 'Khoảng năm 1980'
  location?: string;               // 'Bình Tiên, Bình Châu, TP. HCM'
  credit?: string;                 // 'Ảnh do gia đình cung cấp'
  provenance?: string;             // 'Bản scan thiệp cưới gốc lưu trữ tại gia'
  peopleDepicted?: string[];       // Mã Person ID (@I18@...) nếu xác định chắc chắn
  dimensions: { width: number; height: number; aspectRatio: string };
  variants: {
    thumb: string;                 // 400px
    medium: string;                // 900px
    large: string;                 // 1600px
  };
}
```

> [!CAUTION]
> **QUY TẮC BẤT DI BẤT DỊCH VỀ METADATA ẢNH:**
> Tuyệt đối không tự suy diễn ngày chụp, địa điểm hoặc nhân vật trong ảnh nếu không có ghi chép xác thực từ gia đình. Trường nào chưa rõ phải để `null`.

---

## 6. RESPONSIVE IMAGE PIPELINE (CHO STACK TĨNH & VERCEL)

Kiến trúc xử lý hình ảnh tối ưu tải trang trên mạng di động mà không cần migrate framework:

```
                            RESPONSIVE MEDIA PIPELINE
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ 1. CHUẨN BỊ BUILD (Build-time Asset Optimization)                                        │
│    • Script Python chuyển đổi tự động ảnh gốc JPG/PNG -> WebP (Quality 82–85%).          │
│    • Tạo sẵn 3 kích cỡ chuẩn: `_thumb.webp` (400px), `_med.webp` (900px), `_lg.webp`.    │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ 2. TỐI ƯU TRÌNH DUYỆT (Browser Execution)                                                │
│    • Thẻ `<picture>` với `srcset` & `sizes="(max-width: 768px) 100vw, 720px"`.          │
│    • Ảnh Hero đầu bài: `loading="eager"` + `fetchpriority="high"`.                       │
│    • Ảnh trong thân bài: `loading="lazy"` + `decoding="async"`.                          │
│    • Khung giữ tỷ lệ CSS `aspect-ratio: 16/9;` ngăn ngừa hoàn toàn giật trang (CLS = 0). │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ 3. PHÂN PHỐI CDN (Vercel Edge Delivery)                                                  │
│    • Cấu hình Cache-Control: `public, max-age=31536000, immutable` cho ảnh đã hash tên. │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. MẠCH HOMEPAGE ARCHITECTURE (TRANG CHỦ TẠP CHÍ BIÊN TẬP)

Trang chủ MẠCH (`#/mach`) được thiết kế theo cấu trúc biên tập đa tầng:

```
                      MẠCH HOMEPAGE CURATION ARCHITECTURE
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ 1. MAGAZINE MASTHEAD                                                                     │
│    Logo MẠCH thư pháp • Danh xưng "NẾP NHÀ & KÝ ỨC SỐNG" • Bộ lọc chuyên mục             │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ 2. HERO FEATURE (Bài Đinh Số Báo)                                                        │
│    Ảnh lớn toàn khổ + Nhãn thể loại (`📖 BÚT KÝ`) + Tiêu đề lớn + Đoạn dẫn deck         │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ 3. EDITORIAL GRID (3 Bài Trọng Điểm Đi Kèm)                                              │
│    Card có ảnh minh họa + Tiêu đề + Trích đoạn súc tích + Tác giả                        │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ 4. TOPIC SHELVES (Kệ Tuyển Tập Theo Chủ Đề)                                              │
│    ├── 🕊️ LỜI MỞ & ĐỊNH HƯỚNG                                                            │
│    ├── 🔍 KHẢO CỨU & NẾP NHÀ (Nghi lễ, Giỗ, Mộ tổ, Khế ước)                              │
│    └── 🏛️ KHO TƯ LIỆU VÀ CHỨNG TÍCH                                                      │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ 5. SERIES SHOWCASE                                                                       │
│    Banner riêng biệt cho series dài kỳ: ✉️ THƯ GỬI CLARA                                 │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 8. PHÂN ĐỊNH EDITORIAL VOICE (5 CẤP ĐỘ TIẾNG NÓI)

Giao diện bài viết hiển thị huy hiệu (Badge) rõ ràng để minh bạch về tính chất nội dung:

1. 🏛️ **FACT (Dữ kiện / Tư liệu)**: Tư liệu lịch sử, văn tự, bia mộ, chứng cứ xác thực.
2. 🔍 **ANALYSIS (Khảo cứu)**: Bài phân tích cấu trúc, văn hóa và nếp nhà.
3. ✍️ **OPINION (Quan điểm)**: Góc nhìn cá nhân của tác giả.
4. 📖 **ESSAY (Bút ký / Tự sự)**: Khảo luận nhân văn, dòng chảy ký ức.
5. 🌿 **FAMILY VOICE (Tiếng nói Gia tộc)**: Chỉ dùng cho thông cáo chung hoặc kỷ yếu chính thức được gia tộc tán thành.

---

## 9. CROSS-LINKING ENGINE (LIÊN KẾT LIÊN KHÔNG GIAN)

Hệ thống cho phép kết nối ngữ cảnh 2 chiều giữa Tạp chí và Cây Gia Phả:

```
                            CROSS-LINKING RULES
┌───────────────────────┬───────────────────────┬──────────────────────────────────────────┐
│ Điểm xuất phát        │ Đích đến              │ Hành vi giao diện                        │
├───────────────────────┼───────────────────────┼──────────────────────────────────────────┤
│ Tên nhân vật trong bài│ Hồ sơ Gia phả         │ Mở Modal Person Profile (`openPerson`)   │
├───────────────────────┼───────────────────────┼──────────────────────────────────────────┤
│ Bài viết về ngày giỗ  │ Lịch Gia Đình         │ Chuyển sang `#/calendar` lọc mục Ngày giỗ│
├───────────────────────┼───────────────────────┼──────────────────────────────────────────┤
│ Hồ sơ Cụ Thu trong cây│ Bài viết liên quan    │ Hiện danh sách bài viết nhắc đến Cụ Thu  │
├───────────────────────┼───────────────────────┼──────────────────────────────────────────┤
│ Bài viết về mộ tổ     │ Kho Tư Liệu           │ Mở bản scan hình ảnh bia mộ gốc          │
└───────────────────────┴───────────────────────┴──────────────────────────────────────────┘
```

---

## 10. QUY TRÌNH BIÊN TẬP VÀ XUẤT BẢN (PUBLISHING WORKFLOW)

Quy trình biên tập giữ vững nguyên tắc: **Obsidian là bàn viết duy nhất, không xây dựng CMS phức tạp**:

```
                       PUBLISHING LIFECYCLE (VÒNG ĐỜI BÀI VIẾT)
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ 1. DRAFT     │ ──> │ 2. REVIEW    │ ──> │ 3. READY     │ ──> │ 4. PUBLISHED │
│ Viết bài tại │     │ Rà soát fact,│     │ Đủ metadata, │     │ Build script │
│ Obsidian     │     │ chính tả     │     │ ảnh & blocks │     │ xuất JSON    │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
                                                                      │
                                                                      ▼
                                                               ┌──────────────┐
                                                               │ 5. VERCEL    │
                                                               │ Deploy CDN   │
                                                               └──────────────┘
```

---

## 11. PHÂN ĐỊNH PHẠM VI (NOW VS LATER)

```
┌─────────────────────────────────────────┬────────────────────────────────────────┐
│ BẮT BUỘC LÀM TRƯỚC (FOUNDATION NOW)     │ ĐỂ DÀNH TƯƠNG LAI (LATER / FUTURE)     │
├─────────────────────────────────────────┼────────────────────────────────────────┤
│ • Block Model Parser trong Build Script │ • Hệ thống quản trị nội dung (CMS web) │
│ • Pull Quote, Rich Caption, Lead Deck   │ • Bình luận / Phản hồi của độc giả     │
│ • Curation Layout cho MẠCH Homepage     │ • Bản tin Newsletter tự động gửi Email │
│ • 5 Editorial Voice Badges              │ • Video streaming / Nền tảng Podcast   │
│ • Pipeline tối ưu ảnh WebP cơ bản       │ • Đa ngôn ngữ (Anh / Pháp)             │
│ • Cross-link Person ID 2 chiều          │ • Thuật toán gợi ý cá nhân hóa nâng cao│
└─────────────────────────────────────────┴────────────────────────────────────────┘
```

---

## 12. RỦI RO KỸ THUẬT & BIỆN PHÁP PHÒNG NGỪA

1. **Rủi ro lệch đồng bộ dữ liệu (Drift Risk)**: File Markdown trong Obsidian sửa nhưng quên chạy build script $\rightarrow$ *Khắc phục: Tạo lệnh build kiểm tra checksum tự động trước mỗi commit.*
2. **Rủi ro quá tải dung lượng ảnh (Image Bloat)**: Đưa ảnh RAW 15MB vào web $\rightarrow$ *Khắc phục: Script build tự động nén và resize ảnh trước khi lưu vào assets production.*
3. **Rủi ro phá vỡ tính chính xác gia phả (Genealogy Contamination)**: Bị nhầm lẫn giữa lời văn suy tưởng và sự thật phả hệ $\rightarrow$ *Khắc phục: Bắt buộc dùng nhãn phân loại Fact/Opinion rõ ràng.*

---

## 13. MẠCH PUBLICATION ENGINE CONTRACT (BẢN KHÓA NGUYÊN TẮC KỸ THUẬT)

> [!IMPORTANT]
> **ĐIỀU KHOẢN HỢP ĐỒNG BẮT BUỘC DÀNH CHO DEVELOPER & AI AGENT:**
> 
> 1. **KHÔNG BIẾN TOÀN BỘ WEBSITE THÀNH BÁO CHÍ**: Cây Gia Phả là nền tảng tri thức gia tộc; MẠCH là Tạp chí Mạng nằm bên trong nó.
> 2. **CẤU TRÚC BLOCK-BASED**: Mọi bài viết MẠCH phải được biểu diễn qua các Content Blocks (Lead, Prose, Pull Quote, Editorial Image, Caption, Gallery, Signature).
> 3. **HÌNH ẢNH LÀ TƯ LIỆU CÓ NGUỒN GỐC**: Mọi ảnh xuất bản phải có Caption, Niên đại (nếu biết), và không được tự ý bịa đặt thông tin.
> 4. **MINH BẠCH 5 TIẾNG NÓI**: Gán đúng nhãn `FACT`, `ANALYSIS`, `OPINION`, `ESSAY`, `FAMILY_VOICE`.
> 5. **TYPOGRAPHY ĐÚNG GIỌNG**: UI luôn là `Be Vietnam Pro`; Thân bài và trích dẫn MẠCH luôn là `Source Serif 4`. Khổ chữ đọc $\le 720\text{px}$.
> 6. **KHÔNG XÂY CMS CỒNG KỀNH**: Nguồn sự thật duy nhất của bài viết là Obsidian `/Mach/PROJECTS/`; build ra JSON tĩnh và phân phối qua Vercel CDN.
> 7. **CHỈ LIÊN KẾT KHI CÓ CĂN CỨ**: Không tự ý tạo quan hệ phả hệ ảo nếu bài viết chỉ nhắc thoáng qua một cái tên.
