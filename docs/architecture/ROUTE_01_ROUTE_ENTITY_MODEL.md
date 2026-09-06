# ĐẶC TẢ TUYẾN ĐƯỜNG & MÔ HÌNH THỰC THỂ: CÂY GIA PHẢ (ROUTE_01B)
## HỆ THỐNG TRI THỨC DÒNG HỌ TRẦN TRỌNG THU (`family-calendar`)
### STATUS: PROPOSED ROUTE & ENTITY SPECIFICATION — PENDING REVIEW
*Tài liệu Đặc tả Kỹ thuật Tuyến đường & Mô hình Thực thể (Forensic Correction)*  
*Ngày cập nhật: 05/09/2026*  
*Workspace: `/Users/tuantq/Projects/Personal/family-calendar`*  
*Vercel Production Identity: `giatoctrantrongthu.vercel.app`*  
*GitHub: `tuantudo/family-calendar`*  

---

## A. EXECUTIVE SUMMARY (TỔNG QUAN ĐIỀU HÀNH)

Tài liệu này là bản hiệu chỉnh pháp y (forensic correction) cho `docs/architecture/ROUTE_01_ROUTE_ENTITY_MODEL.md` nhằm chuẩn hóa chính xác mô hình tuyến đường (Routing) và thực thể (Entity Model) theo đúng Baseline Information Architecture (IA) đã được phê duyệt trong `SITEMAP_01_INFORMATION_ARCHITECTURE.md`.

### Các Nguyên Tắc Điều Chỉnh Trọng Tâm:
1. **Không Tự Phát Minh Thực Thể / Dữ Liệu**: Loại bỏ mọi giả định dữ liệu thực tế (factual assertions). Các định danh chưa có trong dữ liệu gốc phải được ghi rõ là `<placeholder-id>` hoặc đánh dấu `EXAMPLE ONLY`.
2. **Tách Bạch Route Đích vs Trạng Thái Ngữ Cảnh**:
   * Tuyến đường (Route) chỉ đại diện cho: **Information Destination**, **Entity Detail**, hoặc một **Capability thực sự cần deep-link/bookmark/chia sẻ**.
   * Không tạo route cho: modal, drawer, filter toggle, action tiện ích (như đăng ký lịch), hoặc display mode tạm thời.
3. **Phân Định Rõ 3 Nhánh Trong Gia Phả**:
   * Baseline IA xác lập `🌳 GIA PHẢ` gồm: `Cây gia phả`, `Người`, `Gia đình`.
   * Các chế độ (Toàn cảnh, Tổ tiên, Hậu duệ, Hourglass, Quan hệ) là **Graph Modes / Capabilities**, được điều khiển bằng Query Parameters/State, không phải sitemap destination độc lập.
4. **Chuẩn Hóa Mô Hình MẠCH Đa Tác Giả**:
   * `🧵 MẠCH` là cơ quan tự sự chung của dòng họ (Multi-author).
   * *"Thư gửi Clara"* là một Tuyển tập (Series). Mối quan hệ tác giả cụ thể được đưa vào danh mục câu hỏi mở (Open Question) chờ Tuấn xác nhận, không coi là sự thật kiến trúc mặc định.
5. **Đúng Bản Chất Tư Liệu**:
   * Giữ 3 nhánh: `Tài liệu`, `Hình ảnh & Media`, `Nguồn`. Không dùng thuật ngữ cường điệu như "Evidence Vault". Phân biệt rành mạch Source vs Document vs Media.

---

## B. BẢN ĐỒ TUYẾN ĐƯỜNG ĐỀ XUẤT (PROPOSED ROUTE MAP)

```text
┌──────────────────────────────┬────────────────────────┬─────────────────────┬──────────────────────────────────────────┐
│ Tuyến Đường (Route)          │ Không Gian Tri Thức    │ Phân Loại Tuyến     │ Bản Chất / Vai Trò Ngữ Cảnh              │
├──────────────────────────────┼────────────────────────┼─────────────────────┼──────────────────────────────────────────┤
│ #/                           │ 0.0 TRANG CHỦ          │ Gateway / Portal    │ Cổng tổng quan định hướng di sản         │
├──────────────────────────────┼────────────────────────┼─────────────────────┼──────────────────────────────────────────┤
│ #/gia-pha                    │ 1.0 🌳 GIA PHẢ         │ Space Default       │ Mặc định trỏ vào Cây phả hệ              │
│ #/gia-pha/cay                │ 1.0 🌳 GIA PHẢ         │ Graph View          │ Cây đồ họa tương tác (?focus=PID&mode=.) │
│ #/gia-pha/nguoi              │ 1.0 🌳 GIA PHẢ         │ Directory View      │ Danh bạ 223 thành viên (?gen=0..4&q=.)   │
│ #/gia-pha/gia-dinh           │ 1.0 🌳 GIA PHẢ         │ Directory View      │ Danh bạ 68 gia đình hạt nhân (?gen=0..4) │
│ #/nguoi/:id                  │ 1.0 🌳 GIA PHẢ         │ Entity Detail Route │ Hồ sơ chi tiết cá nhân (GEDCOM INDI ID)  │
│ #/gia-dinh/:id               │ 1.0 🌳 GIA PHẢ         │ Entity Detail Route │ Hồ sơ chi tiết gia đình (GEDCOM FAM ID)  │
├──────────────────────────────┼────────────────────────┼─────────────────────┼──────────────────────────────────────────┤
│ #/mach                       │ 2.0 🧵 MẠCH            │ Space Default       │ Mục lục tự sự dòng họ & bài mới          │
│ #/mach/bai-viet              │ 2.0 🧵 MẠCH            │ List View           │ Danh sách toàn bộ bài viết / ký ức       │
│ #/mach/bai-viet/:slug        │ 2.0 🧵 MẠCH            │ Entity Detail Route │ Trang đọc bài viết tự sự chi tiết        │
│ #/mach/series                │ 2.0 🧵 MẠCH            │ List View           │ Danh mục các tuyển tập / series          │
│ #/mach/series/:slug          │ 2.0 🧵 MẠCH            │ Entity Detail Route │ Tuyển tập chuyên đề (vd: thu-gui-clara)  │
│ #/mach/tac-gia               │ 2.0 🧵 MẠCH            │ List View           │ Danh sách tác giả & nhân chứng đóng góp  │
│ #/mach/tac-gia/:id           │ 2.0 🧵 MẠCH            │ Entity Detail Route │ Hồ sơ tác giả & danh sách tác phẩm       │
│ #/mach/chu-de                │ 2.0 🧵 MẠCH            │ List View           │ Danh mục chủ đề tộc ước                  │
│ #/mach/chu-de/:slug          │ 2.0 🧵 MẠCH            │ Filtered View       │ Lọc bài viết theo chủ đề tộc ước         │
├──────────────────────────────┼────────────────────────┼─────────────────────┼──────────────────────────────────────────┤
│ #/lich                       │ 3.0 📅 LỊCH            │ Space Default       │ Lịch tổng hợp (?view=month|agenda&m=..)  │
│ #/lich/su-kien/:id           │ 3.0 📅 LỊCH            │ Entity Detail Route │ Chi tiết sự kiện / Lễ Giỗ / Bổn mạng     │
├──────────────────────────────┼────────────────────────┼─────────────────────┼──────────────────────────────────────────┤
│ #/tu-lieu                    │ 4.0 📚 TƯ LIỆU         │ Space Default       │ Không gian lưu trữ tư liệu di sản        │
│ #/tu-lieu/tai-lieu           │ 4.0 📚 TƯ LIỆU         │ Directory View      │ Danh mục văn bản lịch sử, hộ tịch        │
│ #/tu-lieu/tai-lieu/:id       │ 4.0 📚 TƯ LIỆU         │ Entity Detail Route │ Chi tiết văn bản trích lục lịch sử       │
│ #/tu-lieu/media              │ 4.0 📚 TƯ LIỆU         │ Directory View      │ Thư viện ảnh cổ & tài sản đa phương tiện │
│ #/tu-lieu/media/:id          │ 4.0 📚 TƯ LIỆU         │ Entity Detail Route │ Chi tiết hiện vật hình ảnh / media       │
│ #/tu-lieu/nguon              │ 4.0 📚 TƯ LIỆU         │ Provenance View     │ Danh mục nguồn cấp (GEDCOM, lưu trữ)     │
│ #/tu-lieu/nguon/:id          │ 4.0 📚 TƯ LIỆU         │ Entity Detail Route │ Chi tiết nguồn gốc dữ liệu & kiểm định   │
└──────────────────────────────┴────────────────────────┴─────────────────────┴──────────────────────────────────────────┘
```

> [!NOTE]
> **Xử Lý Tuyến Đường Kỹ Thuật (Utility Capabilities)**:
> * `Relationship Finder` (Tìm quan hệ) là một **Graph Mode / Contextual Capability** bên trong `#/gia-pha/cay?mode=relationship&from=PID1&to=PID2`. Nếu cần URL ngắn cho deep-link tiện ích, có thể hỗ trợ alias `#/gia-pha/quan-he` như một *Implementation Shortcut*, nhưng không coi là một node sitemap ngang hàng với Cây/Người/Nhà.
> * `Đăng ký Lịch` (Subscription) là một **Action / Contextual Modal**, không phải Information Destination. Mở qua modal/drawer tại `#/lich`.

---

## C. TUYẾN ĐƯỜNG CHI TIẾT THỰC THỂ (ENTITY DETAIL ROUTES)

| Thực Thể (Entity) | Cú Pháp Tuyến Đường (Route Pattern) | Kiểu Định Danh (ID Type) | Ví Dụ Định Danh (Ký Hiệu Placeholder) | Mô Tả Trải Nghiệm |
| :--- | :--- | :--- | :--- | :--- |
| **Person** (Cá nhân) | `#/nguoi/:id` | GEDCOM INDI ID | `#/nguoi/G5X4-48S` *(Actual)* | Trang hồ sơ cá nhân đầy đủ (Thánh danh, facts, phả hệ) |
| **Family** (Gia đình) | `#/gia-dinh/:id` | GEDCOM FAM ID | `#/gia-dinh/F2` *(Actual)* | Trang hồ sơ gia đình hạt nhân (Vợ chồng, con cái) |
| **Story** (Bài viết) | `#/mach/bai-viet/:slug` | Kebab-case Slug | `#/mach/bai-viet/<story-slug>` *(Proposed)* | Trang đọc bài viết tự sự (Typography Serif trang trọng) |
| **Series** (Tuyển tập) | `#/mach/series/:slug` | Kebab-case Slug | `#/mach/series/<series-slug>` *(Proposed)* | Mục lục và các chương trong tuyển tập |
| **Author** (Tác giả) | `#/mach/tac-gia/:id` | Author Slug/ID | `#/mach/tac-gia/<author-id>` *(Proposed)* | Tiểu sử tác giả và danh sách bài viết đóng góp |
| **Event** (Sự kiện) | `#/lich/su-kien/:id` | ICS UID | `#/lich/su-kien/<event-uid>` *(Proposed)* | Chi tiết ngày lễ giỗ (Âm lịch), bổn mạng, sinh nhật |
| **Document** (Tài liệu)| `#/tu-lieu/tai-lieu/:id` | Document ID | `#/tu-lieu/tai-lieu/<document-id>` *(Proposed)*| Văn bản trích lục, bản dịch nghĩa, phiên âm |
| **Media** (Hình ảnh) | `#/tu-lieu/media/:id` | Media Asset ID | `#/tu-lieu/media/<media-id>` *(Proposed)* | Khung xem ảnh/scan di sản chất lượng cao |
| **Source** (Nguồn cấp)| `#/tu-lieu/nguon/:id` | Source ID | `#/tu-lieu/nguon/<source-id>` *(Proposed)* | Thông tin nguồn gốc lưu trữ và kiểm định dữ liệu |

---

## D. MÔ HÌNH THỰC THỂ TỪNG KHÔNG GIAN (ENTITY MODELS)

### D.1. Không Gian 🌳 GIA PHẢ
* **Canonical Entities (Thực thể gốc từ GEDCOM)**:
  * `Person` (INDI): 223 thành viên. Lưu họ tên, thánh danh, giới tính, mốc sinh/tử, quan hệ cha mẹ và hôn phối. Khóa chính: GEDCOM INDI ID (vd: `G5X4-48S`).
  * `Family` (FAM): 68 gia đình hạt nhân. Lưu chồng, vợ, ngày hôn phối, danh sách con. Khóa chính: GEDCOM FAM ID (vd: `F2`).
* **Derived Concepts (Khái niệm tính toán - Không phải Content Entity)**:
  * `Generation` (Thế hệ F0–F4): Tính toán động bằng thuật toán BFS từ Anchor Cụ Thu (`G5X4-48S`).
  * `Branch` (Nhánh): Góc nhìn phả hệ xuất phát từ các con đời F1 của Cụ Thu. Ontology hiện tại không có canonical branch entity độc lập.
  * `Relationship` (Quan hệ họ hàng): Kết quả tính đường đi ngắn nhất giữa 2 Person nodes. Là Capability/Công cụ tính toán, không phải Content Entity.

### D.2. Không Gian 🧵 MẠCH
* **Editorial Entities (Thực thể biên tập & tự sự)**:
  * `Story`: Bài viết, ký ức, giai thoại. Chứa tiêu đề, nội dung Markdown, ngày sáng tác, tác giả.
  * `Series`: Tuyển tập chuyên đề (ví dụ: *"Thư gửi Clara"*). Gom nhóm các Story theo mạch chủ đề dài hạn.
  * `Author`: Người đóng góp bài viết (hỗ trợ mô hình đa tác giả). Có thể liên kết với một `Person` trong phả hệ nếu là thành viên gia tộc.
  * `Topic`: Phân loại chủ đề (#GiaPhong, #DiCu1954, #BonMang...).

### D.3. Không Gian 📅 LỊCH
* **Temporal Projections (Bản chiếu thời gian)**:
  * `Event`: Sự kiện lịch được trích xuất từ facts ngày sinh, ngày bổn mạng, ngày mất. Khóa chính: ICS UID.
* **Export Artifacts & UI Layers**:
  * `Calendar Feeds`: 4 tệp ICS chuẩn quốc tế (`CAL_01` đến `CAL_04`) là sản phẩm xuất bản/phân phối, không phải 4 database độc lập.
  * `Calendar Layers`: 4 Checkbox bộ lọc giao diện (Sinh nhật, Bổn mạng, Giỗ, Sự kiện).
  * `Calendar Views`: Lưới Tháng (Month Grid) và Sổ Sự Kiện (Agenda View).

### D.4. Không Gian 📚 TƯ LIỆU
* **Archival Entities (Thực thể lưu trữ di sản)**:
  * `Source`: Nơi lưu trữ / tệp gốc xác thực (ví dụ: File GEDCOM gốc, Sổ Rửa Tội Bùi Chu).
  * `Document`: Văn bản lịch sử trích lục, hộ tịch, bản dịch chữ Hán Nôm.
  * `Media`: Tệp hình ảnh, scan chứng từ, bản ghi âm nhân chứng.

---

## E. MA TRẬN ĐIỀU HƯỚNG CHÉO (CROSS-NAVIGATION MATRIX)

| Thực Thể Đi (From) | Thực Thể Đến (To) | Loại Liên Kết | Tầng Dữ Liệu | Trạng Thái Hỗ Trợ | Ý Nghĩa Ngữ Cảnh & Ranh Giới |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Person** | **Family** | `belongs_to` | Canonical | **SUPPORTED** | Xem gia đình gốc (làm con) hoặc gia đình hôn phối (làm cha/mẹ). |
| **Person** | **Story** | `referenced_in` | Editorial Link | **SUPPORTED** | Danh sách bài viết trong Mạch có gắn thẻ nhân vật này. |
| **Person** | **Event** | `has_milestone` | Derived Projection| **SUPPORTED** | Xem ngày Sinh nhật, Lễ Bổn mạng, Ngày giỗ trên Lịch. |
| **Person** | **Source** | `cited_by` | Provenance Link | **SUPPORTED** | Xem văn bản/nguồn trích lục xác thực thông tin nhân vật. |
| **Person** | **Media** | `depicted_in` | Archival Link | **SUPPORTED** | Xem ảnh chân dung hoặc ảnh kỷ niệm liên quan. |
| **Family** | **Person** | `has_members` | Canonical | **SUPPORTED** | Xem vợ chồng và danh sách các con trực hệ. |
| **Family** | **Story** | `referenced_in` | Editorial Link | **SUPPORTED** | Các bài viết về nếp nhà của nhánh gia đình này. |
| **Story** | **Person** | `mentions_person`| Editorial Tag | **SUPPORTED** | Gắn thẻ nhân vật để người đọc click nhảy sang Cây/Hồ sơ. |
| **Story** | **Family** | `mentions_family`| Editorial Tag | **SUPPORTED** | Gắn thẻ nhánh gia đình để click nhảy sang Family Profile. |
| **Story** | **Series** | `belongs_to` | Editorial Hierarchy| **SUPPORTED** | Điều hướng bài trước / bài sau trong cùng Tuyển tập. |
| **Story** | **Author** | `written_by` | Editorial Meta | **SUPPORTED** | Xem thông tin tác giả chấp bút. |
| **Story** | **Source** | `cites_source` | Evidence Link | **SUPPORTED** | Dẫn nguồn văn bản Hán Nôm / tư liệu chứng thực lịch sử. |
| **Story** | **Media** | `illustrates` | Archival Link | **SUPPORTED** | Ảnh di sản minh họa cho bài viết. |
| **Event** | **Person** | `commemorates` | Derived Link | **SUPPORTED** | Từ sự kiện trên Lịch click về xem Hồ sơ và vị trí trên Cây. |
| **Document** | **Person** | `records_person` | Provenance Link | **SUPPORTED** | Văn bản ghi nhận thông tin của nhân vật nào. |
| **Document** | **Source** | `part_of_source` | Archival Link | **SUPPORTED** | Văn bản thuộc tệp lưu trữ / nguồn tư liệu nào. |
| **Media** | **Person** | `depicts_person` | Archival Link | **SUPPORTED** | Ảnh chụp nhân vật nào trong phả hệ. |
| **Event** | **Story** | `elaborated_in` | Contextual Link | *NOT CURRENTLY MODELED* | *Chưa mô hình hóa liên kết trực tiếp từ Event sang Story.* |
| **Document** | **Family** | `records_family` | Provenance Link | *NOT CURRENTLY MODELED* | *Chưa hỗ trợ gắn Document trực tiếp cho cấp Family.* |

> [!CAUTION]
> **Ranh Giới Bất Biến**: Không được suy diễn quan hệ phả hệ (Genealogy Kinship) từ các mối liên kết trong Story hay Document. Quan hệ phả hệ chỉ có giá trị pháp lý gia tộc khi được định nghĩa trong file GEDCOM gốc.

---

## F. KẾ HOẠCH CHUYỂN ĐỔI TUYẾN ĐƯỜNG CŨ (LEGACY ROUTE MIGRATION)

| Tuyến Đường Cũ (Legacy Route) | Trạng Thái (Status) | Tuyến Đường Mới Chuẩn Hóa | Phân Tích Pháp Y & Chiến Lược Chuyển Đổi |
| :--- | :--- | :--- | :--- |
| `#/` | **RETAINED** | `#/` | Giữ nguyên vai trò Cổng Tổng Quan (Portal Gateway). |
| `#/tree` | **MIGRATED** | `#/gia-pha/cay` | Redirect tự động sang Cây Gia Phả trực quan. |
| `#/people` | **MIGRATED** | `#/gia-pha/nguoi` | Redirect tự động sang Danh Bạ Thành Viên. |
| `#/families` | **MIGRATED** | `#/gia-pha/gia-dinh` | Redirect tự động sang Danh Sách Gia Đình. |
| `#/timeline` | **OPEN QUESTION** | `#/gia-pha` (View) / `#/lich` | *Timeline hiện tại là danh sách mốc năm tăng dần. Cần quyết định tích hợp vào công cụ phân tích trong Gia Phả hay chuyển đổi vào Lịch/Agenda.* |
| `#/memories` | **DEPRECATED** | `#/mach` & `#/tu-lieu` | Bãi bỏ route cũ; chuyển nội dung tự sự vào `#/mach` và tư liệu vào `#/tu-lieu`. |
| `#/calendar` | **MIGRATED** | `#/lich` | Redirect tự động sang Không Gian Lịch. |
| `#/person/:id` | **MIGRATED** | `#/nguoi/:id` | Redirect tự động giữ nguyên ID (vd: `#/person/G5X4-48S` $\rightarrow$ `#/nguoi/G5X4-48S`). |
| `#/family/:id` | **MIGRATED** | `#/gia-dinh/:id` | Redirect tự động giữ nguyên ID (vd: `#/family/F2` $\rightarrow$ `#/gia-dinh/F2`). |

---

## G. CHIẾN LƯỢC ĐỊNH DANH BỀN VỮNG (STABLE IDENTIFIERS)

```text
┌─────────────────┬─────────────────────────────┬─────────────────────────────────┬──────────────────────────────────────────┐
│ Thực Thể        │ Loại Khóa (Key Type)        │ Quy Tắc Sinh Mã (Format Rule)   │ Trạng Thái / Ví Dụ                       │
├─────────────────┼─────────────────────────────┼─────────────────────────────────┼──────────────────────────────────────────┤
│ **Person**      │ GEDCOM INDI ID              │ Base32 ID từ file GEDCOM        │ `G5X4-48S`, `G5X4-ZNG` *(Actual)*        │
│ **Family**      │ GEDCOM FAM ID               │ Chuỗi FAM số hóa                │ `F2`, `F12`, `F68` *(Actual)*            │
│ **Event**       │ ICS UID                     │ Tiền tố Feed + Loại + Person ID │ `CAL03_MEMORIAL_G5X4_48S` *(Actual)*     │
│ **Story**       │ Kebab-case Slug             │ Viết thường, không dấu, nối '-' │ `<story-slug>` *(Proposed Schema)*       │
│ **Series**      │ Kebab-case Slug             │ Viết thường, không dấu, nối '-' │ `<series-slug>` *(Proposed Schema)*      │
│ **Author**      │ Kebab-case ID               │ Viết thường, không dấu, nối '-' │ `<author-id>` *(Proposed Schema)*        │
│ **Topic**       │ Kebab-case Slug             │ Viết thường, không dấu, nối '-' │ `<topic-slug>` *(Proposed Schema)*       │
│ **Document**    │ Semantic Kebab ID           │ Tiền tố `doc-` + mô tả          │ `<document-id>` *(Proposed Schema)*      │
│ **Media**       │ Semantic Kebab ID           │ Tiền tố `med-` + mô tả          │ `<media-id>` *(Proposed Schema)*         │
│ **Source**      │ Semantic Kebab ID           │ Tiền tố `src-` + mô tả          │ `<source-id>` *(Proposed Schema)*        │
└─────────────────┴─────────────────────────────┴─────────────────────────────────┴──────────────────────────────────────────┘
```

---

## H. CHIẾN LƯỢC ĐIỀU HƯỚNG TĨNH (STATIC ROUTING STRATEGY)

* **Quyết Định Tương Thích Hiện Tại (Current Implementation Decision)**: Tiếp tục duy trì **Client-side Hash Routing (`#/`)**.
* **Đánh Giá Kỹ Thuật**:
  * Đảm bảo tính khả chuyển 100% trên cả Vercel (`giatoctrantrongthu.vercel.app`) và GitHub Pages fallback (`tuantudo.github.io/family-calendar`).
  * Không gây lỗi 404 khi người dùng tải lại trang (reload) hoặc bookmark trên GitHub Pages tĩnh (vốn không có server rewrites).
  * **Lưu ý**: Hash Routing là quyết định tương thích kỹ thuật trong giai đoạn hiện tại, không phải là kiến trúc URL bị khóa vĩnh viễn. Khi toàn bộ ứng dụng chuyển hẳn sang Vercel độc lập, có thể cấu hình rewrites để nâng cấp lên Clean URLs.

---

## I. DECIDED (NHỮNG ĐIỂM ĐÃ ĐƯỢC CHỐT)

1. **4 Không Gian Tri Thức + Cổng Tổng Quan**:
   * Cổng chính: `0.0 TRANG CHỦ` (`#/`).
   * 4 Không gian: `🌳 GIA PHẢ` (`#/gia-pha`), `🧵 MẠCH` (`#/mach`), `📅 LỊCH` (`#/lich`), `📚 TƯ LIỆU` (`#/tu-lieu`).
2. **Không Gian Gia Phả**: Gồm 3 nhánh chính: `Cây gia phả` (`#/gia-pha/cay`), `Người` (`#/gia-pha/nguoi`), `Gia đình` (`#/gia-pha/gia-dinh`).
3. **MẠCH là Đa Tác Giả (Multi-Author)**: Mọi thành viên trong dòng tộc đều có thể đóng góp bài viết; *"Thư gửi Clara"* là một Series.
4. **Lịch Vận Hành Trên 4 Feeds ICS**: 4 loại sự kiện là các lớp chiếu (Layers/Filters), không phải 4 database độc lập.
5. **Không Gian Tư Liệu Gồm 3 Nhánh**: `Tài liệu` (`#/tu-lieu/tai-lieu`), `Hình ảnh & Media` (`#/tu-lieu/media`), `Nguồn` (`#/tu-lieu/nguon`).
6. **Khóa Chính Bất Biến**:
   * Person dùng GEDCOM INDI ID (`#/nguoi/:id`).
   * Family dùng GEDCOM FAM ID (`#/gia-dinh/:id`).
   * Event dùng ICS UID (`#/lich/su-kien/:id`).
7. **Bảo Toàn Hash Routing**: Duy trì cơ chế Client Hash Routing (`#/`) trong giai đoạn hiện tại để tương thích song hành Vercel & GitHub Pages.

---

## J. RECOMMENDED (NHỮNG ĐIỂM ĐỀ XUẤT)

1. **Ngôn Ngữ Tuyến Đường**: Sử dụng đường dẫn **Tiếng Việt không dấu** (`#/gia-pha/cay`, `#/nguoi/:id`, `#/mach/bai-viet/:slug`, `#/lich`, `#/tu-lieu`) vì tính tôn nghiêm, thuần Việt và gần gũi với mọi thế hệ trong gia tộc.
2. **Xử Lý Relationship Finder**: Coi Relationship Finder là một **Graph Mode / Contextual Capability** với URL dạng `#/gia-pha/cay?mode=relationship&from=PID1&to=PID2` (hỗ trợ alias `#/gia-pha/quan-he` cho deep-link).
3. **Xử Lý Đăng Ký Lịch**: Coi Đăng ký Lịch là một **Contextual Action Modal / Drawer** tại `#/lich`, không tạo route tĩnh riêng.
4. **Cơ Chế Lưu Trữ MẠCH**: Lưu các bài viết dưới dạng tệp Markdown `.md` độc lập trong thư mục `content/mach/`, dùng script build để sinh dữ liệu JSON khi deploy nhằm dễ dàng biên tập qua Git.

---

## K. OPEN QUESTIONS (NHỮNG CÂU HỎI MỞ CHỜ TUẤN CHỈ ĐẠO)

1. **Xử lý Tuyến đường Dòng thời gian cũ (`#/timeline`)**:
   * *Phương án A*: Tích hợp thành một chế độ hiển thị biên niên sử bên trong không gian Gia Phả (`#/gia-pha/cay?mode=timeline`).
   * *Phương án B*: Chuyển đổi hòa nhập vào Sổ Sự Kiện (Agenda View) của Lịch (`#/lich?view=agenda`).
   * *Phương án C*: Bãi bỏ (Deprecated) vì phả hệ và lịch đã bao hàm trọn vẹn các mốc sinh/tử/cưới.
   * $\rightarrow$ **Chờ Tuấn quyết định.**
2. **Xác lập Tác giả chính thức cho Series *"Thư gửi Clara"***:
   * Có chính thức xác lập Tuấn TQ là Author entity (`tuan-tq`) gắn liền với Series *"Thư gửi Clara"* trong metadata xuất bản hay không?
   * $\rightarrow$ **Chờ Tuấn quyết định.**
3. **Cơ chế Điều hướng khi Click vào Cá nhân trên Cây Phả Hệ**:
   * Ưu tiên mở **Side Inspector Drawer (Ngăn kéo trượt bên phải)** để người dùng không rời khỏi ngữ cảnh Cây, hay chuyển thẳng toàn màn hình sang **`#/nguoi/:id`**?
   * $\rightarrow$ **Chờ Tuấn quyết định.**

---

## L. EXAMPLES / PLACEHOLDERS (DANH MỤC KÝ HIỆU MINH HỌA)

Bảng phân định rõ các định danh thực tế trong dữ liệu hiện hữu vs các ký hiệu minh họa trong tài liệu:

| Ký Hiệu / Định Danh | Trạng Thái Dữ Liệu | Giải Thích |
| :--- | :--- | :--- |
| `G5X4-48S`, `G5X4-ZNG` | **ACTUAL DATA** | ID cá nhân thực tế từ file GEDCOM `GIADINHONGTHU.ged` (Cụ Thu, Cụ Thư). |
| `F2`, `F12`, `F68` | **ACTUAL DATA** | ID gia đình thực tế từ file GEDCOM `GIADINHONGTHU.ged`. |
| `CAL03_MEMORIAL_G5X4_48S` | **ACTUAL DATA** | ICS Event UID thực tế được sinh từ bộ sinh lịch `generate_calendars.py`. |
| `<story-slug>` | **PROPOSED PLACEHOLDER** | Đại diện cho slug bài viết trong Mạch (chưa có trong dữ liệu hiện tại). |
| `<series-slug>` | **PROPOSED PLACEHOLDER** | Đại diện cho slug tuyển tập (ví dụ đề xuất: `thu-gui-clara`). |
| `<author-id>` | **PROPOSED PLACEHOLDER** | Đại diện cho mã định danh tác giả (chưa có bảng tác giả canonical). |
| `<topic-slug>` | **PROPOSED PLACEHOLDER** | Đại diện cho slug chủ đề tộc ước (chưa có taxonomy canonical). |
| `<document-id>` | **PROPOSED PLACEHOLDER** | Đại diện cho ID văn bản lịch sử trích lục (chưa có trong JSON). |
| `<media-id>` | **PROPOSED PLACEHOLDER** | Đại diện cho ID hình ảnh/hiện vật di sản (chưa có trong JSON). |
| `<source-id>` | **PROPOSED PLACEHOLDER** | Đại diện cho ID nguồn cấp lưu trữ (chưa có trong JSON). |
