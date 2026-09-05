# BÁO CÁO THIẾT LẬP HẠ TẦNG XUẤT BẢN: MACH_ENGINE_01
**Xây dựng Nền tảng Publication Engine Chuẩn tắc cho Tạp chí MẠCH**

- **Dự án**: Cây Gia Phả Dòng Họ Trần Trọng Thu — Không gian Tạp chí Số MẠCH
- **Mã nhiệm vụ**: `MACH_ENGINE_01 — BUILD THE PUBLICATION ENGINE`
- **Tài liệu tham chiếu**: `MACH_FOUNDATION_01` & `MACH_FOUNDATION_02`
- **Ngày hoàn thành**: 05/09/2026
- **Trạng thái**: Hoàn tất Triển khai & Đã Kiểm thử Toàn diện (Production-Ready)

---

## 1. Tổng quan & Mục tiêu Đã Đạt được

Nhiệm vụ `MACH_ENGINE_01` đã chuyển đổi thành công nền tảng MẠCH từ **đặc tả kiến trúc (Specification)** sang **hệ thống vận hành thực tế (Production Implementation)**:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        PUBLICATION ENGINE PIPELINE (v3.0)                              │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                        │
│   [ Obsidian Markdown ] ──┐                                                            │
│   [ Media Assets RAW  ] ──┼──> [ scripts/build_mach.py ] ──> [ data/mach.json (v3.0) ]  │
│   [ Entity Registries ] ──┘          (Build-Time)            ├── Articles (19)         │
│                                                              ├── Series (2)            │
│                                                              ├── Authors (3)           │
│                                                              ├── Topics (9)            │
│                                                              └── Media Registry (12)   │
│                                                                        │               │
│                                                                        ▼               │
│                              [ src/js/app.js Composition Engine ]                      │
│                              (Agnostic Pure Renderer / No series-hacks)                │
│                                        │                                               │
│                        ┌───────────────┼───────────────┐                               │
│                        ▼               ▼               ▼                               │
│                  [ Header/Deck ]  [ Block Tree ]  [ Media Picture ]                    │
│                                                                                        │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Các Trụ cột Kiến trúc Đã Triển khai

### 2.1. Normalized Content Model (Mô hình Dữ liệu Chuẩn tắc)
Triển khai toàn diện 5 mô hình thực thể tại `data/mach.json`:
- **Article Entity**: `id`, `slug`, `title`, `shortTitle`, `subtitle`, `deckLead`, `articleType`, `editorialVoice`, `presentationVariant`, `status`, `featured`, `editorialOrder`, `publishedAt`, `updatedAt`, `authorIds`, `seriesIds`, `seriesOrder`, `section`, `topicIds`, `heroMediaId`, `blocks: ContentBlock[]`, `footnotes[]`, `relatedContent`, `relatedEntities: { peopleIds, familyIds, documentIds }`, `source`, `seo`.
- **Series Entity**: `id`, `slug`, `title`, `shortTitle`, `subtitle`, `description`, `seriesType`, `audience`, `editorialVoice`, `authorIds`, `coverMediaId`, `articleIds: string[]`.
- **Author Entity**: `id`, `slug`, `name`, `role`, `bio`, `avatarEmoji`, `personId`, `location`.
- **Topic Entity**: `id`, `slug`, `name`, `description`, `icon`, `count`.
- **Media Asset Entity**: `id`, `src`, `rawSrc`, `type`, `dimensions: { width, height, aspectRatio }`, `alt`, `caption`, `credit`, `source`, `provenance`, `date`, `location`, `peopleIds`, `rights`, `variants: { thumb, medium, large }`.

### 2.2. Content Block Engine (`ContentBlock[]`)
Không còn lưu trữ hay render văn bản dưới dạng HTML thô đặc quánh. Toàn bộ 19 bài viết đã được biên dịch thành **501 Content Blocks độc lập**:
- `lead`: Đoạn mở đầu cô đọng (Deck lead).
- `paragraph`: Đoạn văn chuẩn typography (`hasDropCap: true` cho đoạn mở đầu thể loại essay).
- `heading`: Tiêu đề cấp bậc (`level: 2 | 3 | 4`, kèm slug `anchorId` ổn định).
- `media`: Khối hình ảnh tham chiếu qua `mediaId` (hỗ trợ bố cục `normal`, `wide`, `full`).
- `quote`: Trích dẫn văn học / tư liệu kèm `author` và `source`.
- `pull_quote`: Câu đinh nổi bật trang báo (Pull quote) đóng khung vàng kim.
- `divider`: Vết cắt nhịp chuyển cảnh (`section_break` với họa tiết hoa văn ❦).
- `list`: Danh sách có hoặc không có thứ tự (`ordered: boolean`).
- `callout`: Khung ghi chú biên tập / lưu trữ chuyên đề (`tone: 'heritage' | 'archive' | 'note'`).
- `signature`: Khối chữ ký cuối bài (Tác giả, địa danh, ngày viết).

### 2.3. Build-Time Markdown Ingestion Pipeline (`scripts/build_mach.py`)
- Tự động tách lọc YAML Frontmatter, Obsidian `# ARTICLE DNA`, `# ARTICLE ORCHESTRATION NOTES`, `# TYPOGRAPHY NOTES` đưa vào metadata mà không làm rác khung đọc.
- Bóc tách Footnotes `[^1]: ...` thành danh mục chú thích tư liệu có liên kết hai chiều `<sup class="story-footnote-ref">`.
- Chuyển đổi chỉ dẫn dàn trang `[SPREAD ...]` và `[CAPTION]` thành cấu trúc bài viết tinh tế.
- Tự động phát hiện và đăng ký hình ảnh vào **Media Registry**.

### 2.4. Article Composition Engine (Bộ Dựng Bài Viết Độc Lập)
- **Tuyệt đối không sử dụng điều kiện rẽ nhánh theo tên chuỗi**: Không còn `if (isClara)` hay `if (seriesSlug === ...)` bên trong renderer bài viết.
- Renderer hoạt động như một hàm thuần túy (Pure Renderer):
  $$\text{Render}(Article, MediaRegistry, AuthorsRegistry, SeriesRegistry) \rightarrow \text{DOM Component Tree}$$
- Phân định phong cách trình bày dựa trên `articleType` (`essay`, `letter`, `research`, `historical`) và `presentationVariant` (`essay`, `letter`, `long-form`, `text-led`, `image-led`).

### 2.5. First-Class Media Registry
Đăng ký 12 tài nguyên hình ảnh di sản chuẩn mực (7 ảnh Thư gửi Clara + 5 ảnh tư liệu Tập san MẠCH: Mộ tổ họ Trần, Thiệp cưới di sản, Hậu duệ cụ Thu cụ Sa, Bản vẽ Cây gia phả, Bìa MẠCH Số 01).

### 2.6. Đồng bộ Tìm kiếm & Liên kết Phả hệ
Hệ thống Global Search nhận diện đầy đủ 4 nhóm thực thể:
1. `PERSON`: Nhân vật phả hệ (`@I...`).
2. `STORY`: 19 bài viết/lá thư kèm tiền tố nhận diện (`✉️ Thư gửi Clara` / `📖 Tập san MẠCH`).
3. `SERIES`: 2 chuỗi series song song.
4. `AUTHOR`: 3 tác giả / cơ quan xuất bản.

---

## 3. Thống kê Dữ liệu Xuất bản (v3.0)

| Chỉ số | Giá trị | Ghi chú |
|:---|:---:|:---|
| **Tổng số bài viết (Articles)** | **19** | 12 bài Tập san MẠCH + 7 lá Thư gửi Clara |
| **Tổng số Series** | **2** | `issue-01` (Tập san MẠCH) & `thu-gui-clara` |
| **Tổng số Tác giả (Authors)** | **3** | Người giữ mạch, Tuấn (F2), Ban Biên Tập MẠCH |
| **Tổng số Chuyên mục (Topics)** | **9** | Lời mở, Luận, Nghi lễ, Ký ức, Thế hệ, Gia phong, Thư từ, Đức tin, Tư liệu |
| **Tổng số Media Assets** | **12** | Đăng ký đầy đủ provenance, date, dimensions, variants |
| **Tổng số Content Blocks** | **501** | Trung bình 26.4 blocks/bài |

---

## 4. Bảo toàn Kiến trúc & Tính tương thích ngược

- **Cây Gia Phả & GEDCOM**: 100% nguyên vẹn, parser BFS thế hệ và sơ đồ đồ thị giữ nguyên.
- **Hệ thống Lịch & Âm Dương**: 100% nguyên vẹn, ICS feeds và đăng ký lịch hoạt động bình thường.
- **Route URLs**: Toàn bộ đường dẫn `#/mach/bai-viet/:slug`, `#/mach/series/:slug`, `#/mach/tac-gia/:id` được duy trì tuyệt đối ổn định.
