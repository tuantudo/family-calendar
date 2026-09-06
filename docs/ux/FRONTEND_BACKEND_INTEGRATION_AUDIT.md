# BÁO CÁO TOÀN DIỆN: FRONTEND ↔ BACKEND INTEGRATION AUDIT
## DỰ ÁN: CÂY GIA PHẢ / GIA TỘC TRẦN TRỌNG THU
*Mã tài liệu: `docs/ux/FRONTEND_BACKEND_INTEGRATION_AUDIT.md` — Trạng thái: Canonical Architecture & Contract Baseline*

---

## I. TỔNG QUAN KIẾN TRÚC & KẾT LUẬN ĐIỀU HÀNH (EXECUTIVE CONCLUSION)

1. **Substrate Backend đã rất vững chắc và phong phú:**
   - Đồ thị huyết thống `data/genealogy.json` gồm **223 cá nhân, 68 gia đình hạt nhân, 2 ký ức nguyên bản**.
   - Thuật toán BFS đa chiều `deriveFamilyGraphGenerations()` tính toán chính xác thế hệ (F0–F4) và đường dẫn huyết thống trực hệ (`derivedPaths`) từ Anchor `@I1@`.
   - Nền tảng biên tập `data/mach.json` (MachPublicationEngine v3.0) hoàn chỉnh với **19 bài viết/tiểu luận**, 2 tuyển tập (*Tập san MẠCH Số 01* & *Thư gửi Clara*), 3 tác giả và hệ thống chủ đề (topics).
   - Hệ thống Lịch 4 Feeds (`CAL_01` – `CAL_04`) đồng bộ Âm - Dương qua thuật toán `LunarCal` và `IcsParser`.
   - Động cơ tìm kiếm toàn cục đa thực thể `handleGlobalSearch` và `runSearchPage` đã lập chỉ mục chéo: Person, Story, Series, Author, Memory.

2. **Điểm giao thoa (Integration Gap) cốt lõi giữa Frontend và Backend:**
   - **Về Dữ liệu Tư Liệu (Archive Records):** Hiện tại chưa có kho lưu trữ số hóa hiện vật độc lập trong backend (`data/mach.json` chỉ có ảnh minh họa editorial). Do đó, Vùng Tư Liệu phải ở trạng thái **DESIGN-ONLY (Honest Empty State / Sẵn sàng tiếp nhận)**, tuyệt đối không được bịa đặt danh mục hiện vật giả.
   - **Về Thang Xác Tín (Epistemic Certainty):** Backend lưu trữ GEDCOM chuẩn chưa có trường 7 bậc xác tín explicit. Frontend cần **Adapter** để gán nhãn `CONFIRMED` cho dữ liệu đã trích lục.
   - **Về Cross-linking 2 Chiều:** Cần tầng Reverse Indexing để từ một Person trong Gia Phả có thể liệt kê tự động các bài viết MẠCH nhắc tới họ.

---

## II. DANH MỤC KHẢ NĂNG BACKEND HIỆN CÓ (EXISTING BACKEND CAPABILITY INVENTORY)

| Phân hệ / Capability | Nguồn Dữ Liệu (Substrate) | Hàm / Engine Thực Thi Hiện Có | Khả năng Cung Cấp Cho Frontend |
| :--- | :--- | :--- | :--- |
| **Genealogy Graph BFS Engine** | `data/genealogy.json` | `deriveFamilyGraphGenerations(rootId)` | Tính toán phân tầng thế hệ F0–F4, tìm đường dẫn huyết thống trực hệ từ gốc |
| **Focus Pedigree Tree** | `data/genealogy.json` | `renderFocusPedigreeTree(centerId)`, `focusGraphPerson(pid)` | Dựng cây phả hệ 3 tầng (Phụ mẫu -> Focus & Hôn phối -> Hậu duệ) |
| **Person Profile Dossier** | `data/genealogy.json` | `openPersonProfile(pid)` (`#/person/{id}`) | Căn cước, Vitals (Sinh, Tử, Rửa tội), Thân tộc 3 đời, Ký ức đi kèm |
| **Family Profile Dossier** | `data/genealogy.json` | `openFamilyProfile(fid)` (`#/family/{id}`) | Cặp vợ chồng, ngày cưới, danh sách con cái trực hệ |
| **Directories (Danh bạ)** | `data/genealogy.json` | `renderPeopleDirectory()`, `renderFamiliesDirectory()` | Danh bạ lọc theo thế hệ (F0..F4), thống kê số lượng |
| **Mạch Publication Engine** | `data/mach.json` | `renderMachModule()`, `openStoryDetail(slug)`, `openSeriesDetail(slug)` | Render bài viết, drop-cap, blockquote, chú thích biên tập, điều hướng tuyển tập |
| **Calendar 4-Feeds Engine** | `calendars/CAL_*.ics` | `loadCalendarFeeds()`, `renderMonthGrid()`, `renderAgendaList()` | Lịch Lễ giỗ, Bổn mạng, Sinh nhật, đồng bộ Âm - Dương |
| **Timeline Engine** | `data/genealogy.json` | `renderTimeline()` | Niên biểu sự kiện sắp xếp theo năm |
| **Global Search Engine** | `genealogy.json` + `mach.json` | `handleGlobalSearch()`, `runSearchPage()` | Tìm kiếm phân loại đa thực thể: Người, Bài viết, Tuyển tập, Tác giả, Ký ức |

---

## III. MA TRẬN KHỚP NỐI & HỢP ĐỒNG TÍCH HỢP (FRONTEND ↔ BACKEND FIT MATRIX)

```
┌─────────────────────────┬───────────────────────────────┬─────────────────────────────────┬──────────────────────┐
│ LOẠI TRANG (PAGE TYPE)  │ CONTENT CONTRACT (FRONTEND)   │ BACKEND SOURCE & HANDLER        │ READINESS & ADAPTER  │
├─────────────────────────┼───────────────────────────────┼─────────────────────────────────┼──────────────────────┤
│ P0. Page_Home           │ Masthead, 3 Territories,      │ appData.stats, rootPerson,      │ READY WITH ADAPTER   │
│                         │ Spotlight, Editorial Quote    │ machData.articles[1], BFS gen   │                      │
├─────────────────────────┼───────────────────────────────┼─────────────────────────────────┼──────────────────────┤
│ P0. Page_Person         │ Identity, Vitals, Kinship,    │ appData.people[pid],            │ READY                │
│                         │ Memories, Sources             │ openPersonProfile()             │                      │
├─────────────────────────┼───────────────────────────────┼─────────────────────────────────┼──────────────────────┤
│ P0. Page_FamilyTree     │ Focus Node, 3-Tier Pedigree,  │ renderFocusPedigreeTree(),      │ READY                │
│                         │ Lineage Path Breadcrumbs      │ derivedPaths[pid]               │                      │
├─────────────────────────┼───────────────────────────────┼─────────────────────────────────┼──────────────────────┤
│ P0. Page_Article        │ Editorial Reader, Drop-caps,  │ machData.articles (slug),       │ READY                │
│                         │ Contextual Notes, Series Nav  │ openStoryDetail()               │                      │
├─────────────────────────┼───────────────────────────────┼─────────────────────────────────┼──────────────────────┤
│ P0. Page_GiaPhaLanding  │ Overview, Stats, Tree Entry,  │ appData.stats, people, families │ READY WITH ADAPTER   │
│                         │ Directories, Timeline         │                                 │                      │
├─────────────────────────┼───────────────────────────────┼─────────────────────────────────┼──────────────────────┤
│ P1. Page_Family         │ Husb/Wife, Marriage, Children │ appData.families[fid],          │ READY                │
│                         │ Generation meta               │ openFamilyProfile()             │                      │
├─────────────────────────┼───────────────────────────────┼─────────────────────────────────┼──────────────────────┤
│ P1. Page_MachLanding    │ Featured Series, Topics,      │ machData.series, topics,        │ READY                │
│                         │ Author Roster, Article List   │ renderMachModule()              │                      │
├─────────────────────────┼───────────────────────────────┼─────────────────────────────────┼──────────────────────┤
│ P1. Page_TuLieuLanding  │ Archive Territory Purpose,    │ machData.archiveIndex           │ DESIGN-ONLY          │
│                         │ Honest Empty State            │ renderTuLieuModule()            │ (Honest Empty State) │
├─────────────────────────┼───────────────────────────────┼─────────────────────────────────┼──────────────────────┤
│ P1. Page_ArchiveItem    │ Facsimile, Provenance,        │ Chưa có kho tư liệu riêng trong │ DESIGN-ONLY          │
│                         │ Archival State, Related People│ backend                         │ (Schema Blueprint)   │
├─────────────────────────┼───────────────────────────────┼─────────────────────────────────┼──────────────────────┤
│ P1. Page_SearchResults  │ Categorized Result Cards      │ runSearchPage(),                │ READY                │
│                         │ (People, Story, Series, Mem)  │ handleGlobalSearch()            │                      │
├─────────────────────────┼───────────────────────────────┼─────────────────────────────────┼──────────────────────┤
│ P2. Page_Calendar       │ Month Grid, Agenda, 4 Layers, │ loadCalendarFeeds(),            │ READY                │
│                         │ Lunar/Solar Conversion        │ LunarCal, IcsParser             │                      │
├─────────────────────────┼───────────────────────────────┼─────────────────────────────────┼──────────────────────┤
│ P2. Page_Timeline       │ Chronological Life Events     │ appData.timeline,               │ READY                │
│                         │                               │ renderTimeline()                │                      │
├─────────────────────────┼───────────────────────────────┼─────────────────────────────────┼──────────────────────┤
│ P2. Page_Memory         │ Oral Traditions & Stories     │ appData.memories,               │ READY                │
│                         │                               │ renderMemories()                │                      │
├─────────────────────────┼───────────────────────────────┼─────────────────────────────────┼──────────────────────┤
│ P2. Page_AboutFamily    │ Origins, Migration History,   │ docs/architecture/              │ READY WITH ADAPTER   │
│                         │ Cultural Traditions           │ ARCHITECTURE.md                 │                      │
├─────────────────────────┼───────────────────────────────┼─────────────────────────────────┼──────────────────────┤
│ P2. Page_AboutProject   │ Methodology, 7 Certainty Lvs, │ docs/ontology/                  │ READY WITH ADAPTER   │
│                         │ Stewardship Policy            │ ONTOLOGY_AND_RULES.md           │                      │
└─────────────────────────┴───────────────────────────────┴─────────────────────────────────┴──────────────────────┘
```

---

## IV. KIỂM TOÁN TẠP NHIỄM DỮ LIỆU TRÊN PROTOTYPE (DATA CONTAMINATION AUDIT)

Kiểm toán từng nội dung hiển thị trên `prototype/index.html`:

| Khối nội dung / Claim | Backend Source & Khóa | Trạng thái Kiểm toán | Đánh giá & Rủi ro |
| :--- | :--- | :--- | :--- |
| **Cụ Giuse Trần Trọng Thu** (1872–1969) | `genealogy.json` -> `@I1@` | `SUPPORTED` | Hoàn toàn chính xác theo phả đồ gốc. |
| **Nguyễn Thị Xuân - Út** (1888–1929) | `genealogy.json` -> `@I8@` | `SUPPORTED` | Hôn phối chính thức của Cụ Thu trong dữ liệu. |
| **Trần Thị Thi** (1917–1989) | `genealogy.json` -> `@I6@` | `SUPPORTED` | Con gái cả (F1) của Cụ Thu và Cụ Xuân. |
| **An-tôn Trần Trọng Thư** (1918–1991) | `genealogy.json` -> `@I18@` | `SUPPORTED` | Con trai (F1) của Cụ Thu. |
| **Gioan Trần Trọng Thả** (1929) | `genealogy.json` -> `@I9@` | `SUPPORTED` | Con trai (F1) của Cụ Thu. |
| **Bà Cử - hai & Bà Định - thứ tư** | `genealogy.json` -> `@I2@`, `@I3@` | `SUPPORTED` | Đúng tên trong dữ liệu, chưa có ngày sinh/mất (đã để empty state). |
| **Quy mô 223 người / 68 gia đình** | `genealogy.json` -> `stats` | `SUPPORTED` | Khớp 100% với thống kê GEDCOM. |
| **Bài viết "Cây Gia Phả & Mạch"** | `mach.json` -> `art_issue01_02` | `SUPPORTED` | Đúng toàn văn bài tiểu luận của tác giả Người giữ mạch. |
| **Ảnh "Mộ tổ họ Trần"** | `mach.json` -> `med_issue01_mo_to` | `SUPPORTED BUT MISREPRESENTED` | Ảnh này là tư liệu minh họa trong `mach.json`, chưa phải là một Record chính thức của Vùng Tư Liệu. Cần ghi rõ là ảnh khảo sát thực địa nếp nhà. |
| **Badges "Xác thực lịch sử" (CONFIRMED)** | Chưa có trường explicit trong JSON | `SUPPORTED WITH ADAPTER` | Dữ liệu đời F0-F1 có nguồn gốc trích lục rõ ràng nên adapter gán mức CONFIRMED là hợp lệ về mặt kiến trúc. |

---

## V. CÁC KHOẢNG TRỐNG BACKEND & YÊU CẦU ADAPTER (GAPS & ADAPTERS)

1. **Adapter 1: Epistemic Certainty Adapter (`CertaintyAdapter`)**
   - *Yêu cầu:* Bổ sung nhãn xác tín (7 mức) cho từng sự kiện/quan hệ khi xuất dữ liệu ra giao diện hiển thị. Mặc định `CONFIRMED` cho các bản ghi trích lục từ sổ gia phả nhà ông Trần Trọng Thu.
2. **Adapter 2: Cross-Entity Reverse Indexing (`ReverseIndexAdapter`)**
   - *Yêu cầu:* Tự động quét `relatedEntities.peopleIds` trong `mach.json` khi nạp trang để tạo liên kết ngược từ Person Profile sang các bài viết MẠCH.
3. **Backend Gap 1: Vùng Tư Liệu Khảo Chứng (Archival Records)**
   - *Thực trạng:* Hiện chưa có schema riêng lưu trữ văn khố hiện vật (Facsimile metadata, archival box, provenance log).
   - *Giải pháp:* Thiết kế Vùng Tư Liệu ở trạng thái **Honest Empty State** ("Đang tiếp nhận & lập chỉ mục tư liệu gia tộc"), không được tạo bản ghi giả lập.

---

## VI. LỘ TRÌNH ĐẤU NỐI THỰC THI (RECOMMENDED IMPLEMENTATION SEQUENCE)

Khi Owner phê duyệt tiến hành đấu nối:
1. **Bước 1 (Foundation):** Thiết lập `IntegrationLayer` trong `src/js/` chứa các Adapters (Certainty, ReverseIndex, ViewModels).
2. **Bước 2 (P0 - Gia Phả & Mạch):** Đấu nối `Page_Person`, `Page_Family`, `Page_FamilyTree` và `Page_Article` vào DOM template mới dựa trên anatomy đã duyệt.
3. **Bước 3 (P0 - Home):** Tái cấu trúc `Page_Home` theo đúng 3 Cửa ngõ Khám phá và Spotlight chiêm nghiệm, loại bỏ hoàn toàn các card dashboard thừa thãi.
4. **Bước 4 (P1 - Capabilities & Empty States):** Hoàn thiện `Page_SearchResults`, `Page_Calendar` và các Honest Empty States cho `Page_TuLieuLanding`.
5. **DANH SÁCH TUYỆT ĐỐI CHƯA BUILD (DO NOT BUILD YET):**
   - Không build trình quản lý upload tư liệu cho người dùng khi chưa có Backend DB/Auth.
   - Không build chức năng biên tập cây gia phả trực tiếp (CMS mode) — hệ thống duy trì cơ chế xuất bản tĩnh trích lục từ GEDCOM.
