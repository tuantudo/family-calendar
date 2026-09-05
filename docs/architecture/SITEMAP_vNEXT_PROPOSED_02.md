# SITEMAP vNEXT — PROPOSED / REFINEMENT 02
## DỰ ÁN CÂY GIA PHẢ / GIÒNG HỌ TRẦN TRỌNG THU

---

## 1. TRẠNG THÁI TÀI LIỆU (STATUS)

- **Mã tài liệu**: `SITEMAP_vNEXT_PROPOSED_02`
- **Phân loại**: Information Architecture & Sitemap Refinement Document
- **Trạng thái hiện tại**: **PROPOSED (ĐỀ XUẤT REFINEMENT 02) — CHỜ SIGN-OFF CỦA CHỦ DỰ ÁN**
- **Trạng thái trước đó**: `SITEMAP_REORGANIZATION_01`
- **Thời điểm lập**: 2026-09-05
- **Quy tắc trạng thái**: Tài liệu này **CHƯA PHẢI LÀ LOCKED**. Trạng thái `LOCKED` chỉ được thiết lập sau khi có phê duyệt chính thức (formal sign-off) từ Chủ dự án đối với toàn bộ cấu trúc sitemap và các open questions.

---

## 2. PHẠM VI (SCOPE)

1. Xác định cấu trúc sitemap đề xuất cho hệ thống Giòng họ Trần Trọng Thu dựa trên kết quả khảo sát toàn diện (forensic audit) từ website hiện hữu và Publication Model v1.
2. Thiết lập ranh giới khái niệm giữa **Information Architecture**, **Sitemap**, **Navigation**, và **Cross-system Capabilities**.
3. Bảo toàn 100% tính năng, công cụ, bộ lọc, thuật toán đồ thị và dữ liệu hiện có trong website mà không làm mất mát bất kỳ năng lực nào.
4. **Phạm vi loại trừ (Out of Scope)**:
   - Không can thiệp mã nguồn (zero code changes).
   - Không sửa đổi giao diện, kiểu dáng hoặc thành phần hiển thị (zero UI/CSS/JS changes).
   - Không thay đổi các tuyến đường production (zero production route changes).
   - Không thiết kế chi tiết layout đồ họa cho các thanh menu (UI visual layout deferred).

---

## 3. RANH GIỚI KHÁI NIỆM & KIẾN TRÚC (ARCHITECTURE BOUNDARIES)

Để tránh tình trạng sitemap trở thành một tài liệu hỗn tạp chứa lẫn mọi tầng kiến trúc, hệ thống xác lập rõ 4 ranh giới khái niệm:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 1. INFORMATION ARCHITECTURE (IA)                                                       │
│    • Mô hình tổ chức tổng thể tri thức, bao gồm:                                      │
│      - Content / Knowledge Model (Thực thể, Thuộc tính, Cấp độ nhận thức)              │
│      - Entity / Relationship Model (Huyết thống, Hôn phối, Tham chiếu)                 │
│      - Taxonomy & Classification (Thế hệ, Chi nhánh, Thể loại bài viết)                │
│      - Navigation Model (Cấu trúc đường dẫn và luồng di chuyển)                        │
│      - Capability Model (Các năng lực tính toán và phục vụ xuyên suốt)                 │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 2. SITEMAP                                                                             │
│    • Biểu diễn cấu trúc phân cấp các điểm đến (destinations / canonical pages)         │
│      trong hệ thống xuất bản.                                                          │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 3. NAVIGATION (CẤU TRÚC ĐIỀU HƯỚNG)                                                    │
│    • Cấu trúc logic mà người dùng sử dụng để truy cập các điểm đến (Top-level,         │
│      Contextual Sub-nav, Breadcrumbs, Footer).                                         │
│    • Phân biệt: Cấu trúc điều hướng (Structural) ≠ Thành phần giao diện (UI Visual).   │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 4. CAPABILITY (NĂNG LỰC HỆ THỐNG)                                                      │
│    • Chức năng hoạt động xuyên suốt hệ thống (Lịch âm/dương, Tìm kiếm, Đồ thị),        │
│      không nhất thiết phải là một territory nội dung hay một mục menu độc lập.        │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

> **Ghi chú về Annotation**: Các nhãn `Page Type` (ví dụ: `Page_Person`, `Page_Article`) và `Capability` xuất hiện trong sitemap dưới đây là **chú giải kỹ thuật (technical annotations)** nhằm phục vụ việc đối chiếu với Publication Model, không phải là các thực thể cùng cấp với URL destination.

---

## 4. SITEMAP vNEXT ĐỀ XUẤT (PROPOSED SITEMAP SPECIFICATION)

Cấu trúc sitemap chuẩn hóa sử dụng định danh trung tính, mô tả đúng chức năng:

```
SITEMAP vNEXT (GIÒNG HỌ TRẦN TRỌNG THU)
│
├── [/] — Trang chủ: Giới thiệu dự án và điều hướng đến các phần nội dung chính
│   └── (Annotation: Page_Home)
│
├── [/gia-pha] — Lãnh thổ Gia Phả: Dữ liệu phả hệ, thế thứ, nhân vật và gia đình
│   ├── [/gia-pha] — Tổng quan Gia Phả & Phả đồ tương tác
│   │   └── (Annotation: Page_SectionLanding [Gia Phả] + Lineage Graph View)
│   ├── [/gia-pha/nhan-vat] — Danh bạ thành viên dòng họ
│   │   └── (Annotation: People Directory View)
│   ├── [/gia-pha/gia-dinh] — Danh bạ các đơn vị gia đình
│   │   └── (Annotation: Families Directory View)
│   ├── [/gia-pha/dong-thoi-gian] — Dòng thời gian lịch sử dòng họ
│   │   └── (Annotation: Chronological Timeline View)
│   ├── [/gia-pha/ky-uc] — Danh mục ký ức và lời kể truyền khẩu (Điểm hiển thị / tra cứu)
│   │   └── (Annotation: Memory Objects Directory View)
│   ├── [/gia-pha/nhan-vat/:slug] — Hồ sơ thành viên chi tiết
│   │   └── (Annotation: Page_Person)
│   ├── [/gia-pha/gia-dinh/:id] — Hồ sơ gia đình hạt nhân
│   │   └── (Annotation: Page_Family)
│   ├── [/gia-pha/chi-nhanh/:slug] — Hồ sơ chi / phái
│   │   └── (Annotation: Page_Branch)
│   ├── [/gia-pha/the-he/:level] — Danh mục nhân vật theo thế hệ (F0..F4)
│   │   └── (Annotation: Page_Generation)
│   └── [/gia-pha/dia-danh/:slug] — Địa danh liên quan đến dòng họ
│       └── (Annotation: Page_Place)
│
├── [/mach] — Lãnh thổ Mạch: Các bài viết khảo cứu, tự sự và chuyên đề dòng họ
│   ├── [/mach] — Tổng quan ấn phẩm Mạch (Danh sách bài viết, chuyên đề, tác giả)
│   │   └── (Annotation: Page_SectionLanding [Mạch])
│   ├── [/mach/bai-viet/:slug] — Chi tiết bài viết
│   │   └── (Annotation: Page_Article)
│   ├── [/mach/chuyen-de/:slug] — Chi tiết chuyên đề / tuyển tập bài viết
│   │   └── (Annotation: Page_Series)
│   └── [/mach/tac-gia/:id] — Hồ sơ tác giả / người chấp bút
│       └── (Annotation: Page_Author)
│
├── [/tu-lieu] — Lãnh thổ Tư Liệu: Hồ sơ hiện vật, tài liệu chứng cứ và hình ảnh gốc
│   ├── [/tu-lieu] — Tổng quan kho tư liệu lưu trữ
│   │   └── (Annotation: Page_SectionLanding [Tư Liệu])
│   ├── [/tu-lieu/hien-vat/:slug] — Chi tiết hiện vật / tài liệu chứng cứ gốc
│   │   └── (Annotation: Page_ArchiveItem)
│   └── [/tu-lieu/bo-suu-tap/:slug] — Bộ sưu tập tư liệu theo chủ đề
│       └── (Annotation: Page_Collection)
│
├── [/ve-dong-ho] — Giới thiệu lịch sử, nguồn gốc và thông tin dòng họ
│   └── (Annotation: Page_AboutFamily)
│
├── [/ve-du-an] — Giới thiệu phương pháp khảo cứu, nguyên tắc quản trị và thông tin dự án
│   ├── [/ve-du-an] — Nội dung giới thiệu dự án
│   │   └── (Annotation: Page_AboutProject)
│   └── [/ve-du-an/typography-specimen] — Bảng đánh giá và so sánh phương án font chữ nội bộ
│       └── (Annotation: Internal Utility Specimen)
│
└── [HỆ THỐNG NĂNG LỰC / CAPABILITIES]
    ├── [/lich] — Lịch dòng họ: Tra cứu ngày kỷ niệm, ngày giỗ, sinh nhật theo Dương & Âm lịch
    │   └── (Annotation: Capability_Calendar)
    └── [/tim-kiem] — Tìm kiếm toàn cục: Tra cứu đồng thời nhân vật, bài viết, tư liệu và sự kiện
        └── (Annotation: Capability_Search)
```

---

## 5. PHÂN ĐỊNH SITEMAP, IA, NAVIGATION VÀ CAPABILITY

| Khái niệm | Định nghĩa trong dự án | Ví dụ thực tế |
| :--- | :--- | :--- |
| **Information Architecture (IA)** | Cấu trúc toàn diện của toàn bộ dữ liệu, quan hệ, phân loại và luồng truy xuất tri thức. | Mô hình quan hệ giữa `Person` (Gia Phả), `Memory` (Tri thức), `ArchiveItem` (Tư liệu) và `Article` (Mạch). |
| **Sitemap** | Danh mục có cấu trúc của các địa chỉ trang (URLs / destinations) phục vụ việc xuất bản và định tuyến. | `/gia-pha/nhan-vat/:slug`, `/mach/bai-viet/:slug`, `/lich`. |
| **Navigation** | Cấu trúc điều hướng logic hỗ trợ người dùng chuyển đổi giữa các điểm đến. | Top Global Nav, Sub-nav Tabs trong từng Lãnh thổ, Breadcrumbs phả hệ, Footer links. |
| **Capability** | Năng lực xử lý hoặc công cụ chức năng xuyên suốt hệ thống. | Bộ chuyển đổi Âm — Dương lịch (`lunar-engine.js`), Thuật toán đồ thị BFS (`deriveFamilyGraphGenerations`), Bộ tìm kiếm toàn cục. |

---

## 6. MA TRẬN ÁNH XẠ CHUYỂN ĐỔI (CURRENT → PROPOSED MAPPING)

| TT | Thành phần / Route hiện tại | Thao tác | Điểm đến đề xuất (Proposed Destination) | Phân loại trong IA | Ghi chú bảo toàn |
| :---: | :--- | :---: | :--- | :--- | :--- |
| **01** | `#/` (`view_home`) | Chuyển section | `/` | Page (`Page_Home`) | Giữ nguyên khối thống kê, lối vào 3 lãnh thổ, widget tóm tắt sự kiện. |
| **02** | `#/tree` (`view_tree`) | Chuyển section | `/gia-pha` | Page View (`Page_SectionLanding`) | Giữ nguyên 100% 2 chế độ Phả đồ Focus Tree 3 tầng và Explore Bands, Canvas Pan/Zoom, gestures. |
| **03** | `#/people` (`view_people`) | Chuyển section | `/gia-pha/nhan-vat` | Directory View | Giữ nguyên bộ lọc thế hệ F0–F4 tức thời, thẻ thành viên, liên kết xem phả đồ & hồ sơ. |
| **04** | `#/families` (`view_families`) | Chuyển section | `/gia-pha/gia-dinh` | Directory View | Giữ nguyên bộ lọc thế hệ gia đình F0–F4, thông tin hôn phối, danh sách con cái. |
| **05** | `#/person/:id` (`view_person`) | Chuyển page type | `/gia-pha/nhan-vat/:slug` | Page (`Page_Person`) | Hồ sơ cá nhân chi tiết, sự kiện bản thân, mạng lưới thân tộc, khối Ký ức thực thể, nhãn Epistemic Certainty. |
| **06** | `#/family/:id` (`view_family`) | Chuyển page type | `/gia-pha/gia-dinh/:id` | Page (`Page_Family`) | Hồ sơ đơn vị gia đình hạt nhân, thông tin hôn phối, liên kết cha/mẹ và con cái. |
| **07** | `#/timeline` (`view_timeline`) | Chuyển thành View | `/gia-pha/dong-thoi-gian` | Representation View | Dòng thời gian lịch sử toàn họ theo trục năm. |
| **08** | `#/memories` (`view_memories`) | Chuyển thành Knowledge View | `/gia-pha/ky-uc` | Presentation / Discovery View | Danh mục hiển thị và tra cứu các Knowledge Object ký ức/lời kể. |
| **09** | `#/mach` (`view_mach`) | Chuyển section | `/mach` | Page (`Page_SectionLanding`) | 3 tab (Bài viết, Chuyên đề, Tác giả), featured series spotlights. |
| **10** | `#/mach/bai-viet/:slug` (`view_story`) | Chuyển page type | `/mach/bai-viet/:slug` | Page (`Page_Article`) | Trình đọc Markdown semantic, drop-caps, figures, captions/credits, footnotes `[^N]`, mentions bar, prev/next. |
| **11** | `#/mach/series/:slug` (`view_series_detail`) | Chuyển page type | `/mach/chuyen-de/:slug` | Page (`Page_Series`) | Danh mục bài viết trong chuyên đề, thông tin chủ biên, phân loại tập san/thư từ. |
| **12** | `#/mach/tac-gia/:id` (`view_author_detail`) | Chuyển page type | `/mach/tac-gia/:id` | Page (`Page_Author`) | Hồ sơ tác giả, tiểu sử, danh mục bài viết đã chấp bút. |
| **13** | `#/calendar` (`view_calendar`) | Chuyển thành Capability | `/lich` | System Capability (`Capability_Calendar`) | Lưới tháng, Lịch biểu, bộ lọc 4 layer sự kiện, công cụ tính âm lịch chuẩn xác. |
| **14** | Ngăn kéo ngày `#dayDrawer` | Giữ nguyên Capability | Drawer trên `/lich` và toàn trang | Capability Component | Danh sách sự kiện dương/âm trong ngày và liên kết sang hồ sơ. |
| **15** | Modal sự kiện `#eventModal` | Giữ nguyên Capability | Modal trên `/lich` và toàn trang | Capability Component | Chi tiết sự kiện và nút liên kết ngược sang hồ sơ gia phả. |
| **16** | Đăng ký lịch `#calendarSubscribeModal` | Giữ nguyên Capability | Modal trên `/lich` | Capability Component | Đồng bộ Apple Calendar (`webcal://`), Google Calendar, Outlook `.ics`. |
| **17** | Tìm kiếm `globalSearchInput` | Chuyển thành Capability | `/tim-kiem` + Search Dropdown | System Capability (`Capability_Search`) | Tìm kiếm tức thời đa thực thể (Nhân vật, Bài viết, Chuyên đề, Tác giả, Ký ức). |
| **18** | Bảng Typography `#/typography-specimen` | Chuyển thành Internal Utility | `/ve-du-an/typography-specimen` | Internal Specimen | Công cụ đánh giá font chữ nội bộ. |
| **19** | Generator / Build Scripts (`generator/`, `scripts/`) | Giữ nguyên Stewardship | Lớp Quản trị / Build Tools | Stewardship Pipeline | Script Python trích xuất và chuẩn hóa dữ liệu. |

---

## 7. VỊ TRÍ & BẢN CHẤT CỦA KÝ ỨC (MEMORY PLACEMENT DECISION)

### 7.1. Phân định Ontology vs Presentation
- **Về mặt Ontology (Bản thể học)**:
  - `Memory` (Ký ức / Lời kể / Giai thoại) là một **Knowledge Object** độc lập thuộc Knowledge Layer.
  - `Memory` không bị đồng hóa vào `Article` (Mạch) và không bị sở hữu độc quyền bởi `Person` (Gia Phả).
  - Một `Memory` có thể liên kết đồng thời với:
    - Một hoặc nhiều `Person` (Nhân vật được kể).
    - Một `Family` (Gia đình liên quan).
    - Một `Event` (Biến cố lịch sử hoặc sự kiện đời sống).
    - Một `Place` (Địa danh diễn ra câu chuyện).
    - Một `ArchiveItem` (Hiện vật chứng minh).
    - Được một hoặc nhiều bài viết trong `MẠCH` dẫn chiếu, trích đoạn hoặc phân tích.
- **Về mặt Presentation (Điểm hiển thị trên Sitemap)**:
  - Tuyến đường `/gia-pha/ky-uc` được xác định là **Điểm khám phá & hiển thị (Presentation / Discovery Location)** giúp người dùng tra cứu toàn bộ các mẩu ký ức đã thu thập.
  - **Quy tắc ghi nhận**: Quyết định đặt tại `/gia-pha/ky-uc` là một quyết định thuộc tầng **Presentation / IA**, hoàn toàn **KHÔNG CÓ NGHĨA LÀ Memory thuộc quyền sở hữu của Gia Phả về mặt Ontology**.
  - Vị trí hiển thị này sẽ được rà soát và tinh chỉnh thêm sau khi hoàn tất giai đoạn Content Model chi tiết.

---

## 8. PHÂN BIỆT LÃNH THỔ VÀ MỨC ĐỘ SẴN SÀNG CỦA TƯ LIỆU (TƯ LIỆU TERRITORY & READINESS)

1. **Về mặt Kiến trúc (Architectural Designation)**:
   - `TƯ LIỆU` (`/tu-lieu`) được xác lập là một trong **3 Lãnh thổ Xuất bản chính thức (Publication Territory)** bên cạnh *Gia Phả* và *Mạch*, đảm nhiệm vai trò lưu trữ và trưng bày các hiện vật, văn bản, chứng từ và hình ảnh gốc.
2. **Về mức độ sẵn sàng triển khai (Implementation & Content Readiness)**:
   - **Tuyên bố minh bạch**: Ở giai đoạn hiện tại, Lãnh thổ Tư Liệu **mới chỉ được xác lập ở cấp độ Kiến trúc (Architectural Destination)**.
   - Hệ thống hiện tại **chưa xây dựng đầy đủ**: Content Model cho hiện vật, Archival Metadata Standards (Dublin Core / MODS), Quy trình tiếp nhận & số hóa (Ingestion Pipeline), Chính sách quyền riêng tư của tư liệu (Access Policy), và Quy trình bảo tồn lâu dài (Digital Preservation Workflow).
   - Các mô hình nội dung và quy trình lưu trữ chi tiết cho Lãnh thổ Tư Liệu sẽ được thiết kế đầy đủ tại các phase chuyên biệt tiếp theo trước khi đưa vào vận hành thực tế.

---

## 9. CẤU TRÚC ĐIỀU HƯỚNG LOGIC (NAVIGATION STRUCTURE)

Quy định cấu trúc điều hướng ở mức **Logic & Cấu trúc (Structural)**, chưa khóa thiết kế giao diện chi tiết (UI visual design deferred):

```
[STRUCTURAL NAVIGATION MODEL]
│
├── 1. PRIMARY DESTINATIONS (Điểm đến chính)
│   ├── Trang Chủ (/)
│   ├── Gia Phả (/gia-pha)
│   ├── Mạch (/mach)
│   ├── Tư Liệu (/tu-lieu)
│   ├── Về Dòng Họ (/ve-dong-ho)
│   └── Về Dự Án (/ve-du-an)
│
├── 2. SYSTEM CAPABILITIES ACCESS (Lối truy cập năng lực hệ thống)
│   ├── Lịch Dòng Họ (/lich)
│   └── Tìm Kiếm Toàn Cục (/tim-kiem)
│
├── 3. CONTEXTUAL NAVIGATION (Điều hướng theo ngữ cảnh từng Lãnh thổ)
│   ├── Trong Lãnh thổ GIA PHẢ:
│   │   ├── Phả đồ tương tác (Cây phả hệ)
│   │   ├── Danh bạ thành viên (Kèm lọc thế hệ)
│   │   ├── Danh bạ gia đình (Kèm lọc thế hệ)
│   │   ├── Dòng thời gian lịch sử
│   │   └── Danh mục ký ức
│   └── Trong Lãnh thổ MẠCH:
│       ├── Danh sách bài viết
│       ├── Danh mục chuyên đề / tuyển tập
│       └── Danh mục tác giả
│
├── 4. BREADCRUMBS & RELATIONSHIP PATHS (Tuyến liên kết quan hệ)
│   ├── Tuyến phả hệ trực hệ: Cố Thu (F0) → F1 → F2 → F3 → F4 (trên Cây và Hồ sơ)
│   ├── Tuyến cấu trúc bài viết: Mạch → Chuyên đề → Bài viết
│   └── Điều hướng tuyến tính: Bài trước / Bài tiếp theo trong cùng chuyên đề
│
└── 5. FOOTER STRUCTURE (Cấu trúc chân trang)
    ├── Nhóm thông tin giới thiệu dòng họ
    ├── Nhóm liên kết các phân vùng chính
    └── Nhóm thông tin phương pháp khảo cứu và quản trị tri thức
```

---

## 10. KIỂM TOÁN BẢO TOÀN TÍNH NĂNG (FEATURE PRESERVATION AUDIT)

Bảng đối chiếu xác nhận bảo toàn tuyệt đối 100% (24/24 tính năng và thành phần):

| TT | Tính năng / Thành phần hiện có | Trạng thái bảo toàn | Vị trí / Năng lực sở hữu trong Kiến trúc mới |
| :---: | :--- | :---: | :--- |
| 1 | **BFS Graph Derivation Engine** | ✅ Bảo toàn 100% | Lớp tri thức ngầm, tính toán thế hệ cho `/gia-pha`. |
| 2 | **Dual-mode Tree (Focus & Explore)** | ✅ Bảo toàn 100% | Giao diện phả đồ tại `/gia-pha`. |
| 3 | **Tree Canvas Pan / Zoom / Pinch / Gestures / History / Home** | ✅ Bảo toàn 100% | Bộ công cụ điều khiển Canvas tại `/gia-pha`. |
| 4 | **Breadcrumb Relationship Path** | ✅ Bảo toàn 100% | Thanh tuyến phả hệ trực hệ trên Phả đồ và Hồ sơ nhân vật. |
| 5 | **Sub-branch Expansion Badge (`grand-badge`)** | ✅ Bảo toàn 100% | Chỉ báo mở rộng nhánh con cháu trên các node cây. |
| 6 | **Generation Filters (F0–F4)** | ✅ Bảo toàn 100% | Bộ lọc Pill buttons tại Danh bạ thành viên và Danh bạ gia đình. |
| 7 | **Person Profile** | ✅ Bảo toàn 100% | Hồ sơ cá nhân tại `/gia-pha/nhan-vat/:slug`. |
| 8 | **Family Profile** | ✅ Bảo toàn 100% | Hồ sơ đơn vị gia đình tại `/gia-pha/gia-dinh/:id`. |
| 9 | **Solar / Lunar Calendar Engine** | ✅ Bảo toàn 100% | Công cụ tính âm/dương lịch tại `/lich` & Capability. |
| 10 | **Can Chi / Leap Month Calculations** | ✅ Bảo toàn 100% | Tích hợp trong `Capability_Calendar`. |
| 11 | **Event Layers (Sinh nhật, Bổn mạng, Ngày giỗ, Sự kiện)** | ✅ Bảo toàn 100% | Bộ lọc 4 layer tại `/lich`. |
| 12 | **Day Drawer (#dayDrawer)** | ✅ Bảo toàn 100% | Ngăn kéo chi tiết ngày trượt từ cạnh phải. |
| 13 | **Event Modal + Deep-link to Person** | ✅ Bảo toàn 100% | Modal sự kiện có liên kết ngược sang Hồ sơ nhân vật gia phả. |
| 14 | **Apple Calendar Webcal Subscription (`webcal://`)** | ✅ Bảo toàn 100% | Tích hợp trong trình đăng ký lịch di động. |
| 15 | **Google Calendar Web Subscription Guide** | ✅ Bảo toàn 100% | Tích hợp trong trình đăng ký lịch di động. |
| 16 | **Outlook .ics Calendar Feeds** | ✅ Bảo toàn 100% | 4 file feed tại `calendars/*.ics`. |
| 17 | **Mạch Markdown Parser (Semantic HTML)** | ✅ Bảo toàn 100% | Trình phân tích cú pháp bài viết tại `/mach/bai-viet/:slug`. |
| 18 | **Drop Caps (Chữ hoa đầu dòng)** | ✅ Bảo toàn 100% | Định dạng khối chữ trong `Page_Article`. |
| 19 | **Media Figures / Captions / Credits** | ✅ Bảo toàn 100% | Khối ảnh tư liệu có chú thích và bản quyền trong `Page_Article`. |
| 20 | **Footnotes Engine (`[^N]`)** | ✅ Bảo toàn 100% | Chú thích cuối trang có anchor link 2 chiều. |
| 21 | **Entity Mentions Bar** | ✅ Bảo toàn 100% | Thanh liên kết nhân vật liên quan trong bài viết. |
| 22 | **Series / Chuyên đề** | ✅ Bảo toàn 100% | Danh mục chuyên đề tại `/mach/chuyen-de/:slug`. |
| 23 | **Author Profile & Attribution** | ✅ Bảo toàn 100% | Hồ sơ tác giả tại `/mach/tac-gia/:id`. |
| 24 | **Universal Search Engine** | ✅ Bảo toàn 100% | Tìm kiếm tức thời đa thực thể tại `/tim-kiem` & Search Bar. |
| 25 | **Chronological Timeline** | ✅ Bảo toàn 100% | Dòng thời gian lịch sử tại `/gia-pha/dong-thoi-gian`. |
| 26 | **Memories Repository** | ✅ Bảo toàn 100% | Danh mục ký ức độc lập tại `/gia-pha/ky-uc`. |
| 27 | **Typography Specimen Module** | ✅ Bảo toàn 100% | Bảng đánh giá font chữ nội bộ tại `/ve-du-an/typography-specimen`. |
| 28 | **Python Build & Offline Generator Pipeline** | ✅ Bảo toàn 100% | Bộ script xử lý dữ liệu trong `generator/` và `scripts/`. |

---

## 11. CÁC ĐIỂM CẦN DUYỆT & CÂU HỎI MỞ (OPEN QUESTIONS)

Các vấn đề dưới đây được đánh dấu rõ ràng là **OPEN QUESTIONS / CHỜ QUYẾT ĐỊNH CỦA CHỦ DỰ ÁN**, không tự ý kết luận sớm:

1. **[OPEN QUESTION 1] Điểm hiển thị danh mục Ký Ức (`Memory`)**:
   - *Hiện trạng đề xuất*: Đặt tại `/gia-pha/ky-uc` dưới dạng một View trong Lãnh thổ Gia Phả.
   - *Điểm cần quyết định*: Giữ vị trí `/gia-pha/ky-uc` như một presentation lens tạm thời, hay chuyển thành một mục tra cứu thuộc kho Tri thức chung khi thiết kế Content Model?
2. **[OPEN QUESTION 2] Thời điểm hiển thị Lãnh thổ TƯ LIỆU (`/tu-lieu`) trên thanh điều hướng**:
   - *Điểm cần quyết định*: Đưa `/tu-lieu` lên thanh điều hướng chính ngay từ v1 với thông báo "Đang số hóa tư liệu", hay chỉ mở khi đã hoàn thiện Content Model và số hóa tối thiểu một bộ sưu tập ban đầu?
3. **[OPEN QUESTION 3] Chuẩn hóa Slug cho Tuyển tập MẠCH**:
   - *Điểm cần quyết định*: Thống nhất chuyển đổi sang slug `/mach/chuyen-de/:slug` hay duy trì `/mach/series/:slug` để giữ tương thích trực tiếp với dữ liệu JSON hiện tại?

---

## 12. ĐIỀU KIỆN ĐỂ CHUYỂN SANG TRẠNG THÁI LOCKED (CONDITIONS FOR LOCKED STATUS)

Tài liệu này chỉ được nâng cấp từ trạng thái `PROPOSED` lên **`LOCKED`** khi thỏa mãn đầy đủ 3 điều kiện sau:

1. **Phê duyệt chính thức (Formal Sign-off)** từ Chủ dự án đối với cấu trúc Sitemap vNext và 3 Lãnh thổ xuất bản.
2. **Chốt câu trả lời dứt khoát** cho 3 Open Questions tại Mục 11.
3. **Hoàn tất bước chuyển tiếp sang Content Model & Data Contract**, bảo đảm không còn bất kỳ sự xung đột nào giữa cấu trúc URL và lược đồ dữ liệu vật lý.
