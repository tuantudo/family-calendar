# FRONTEND EXPERIENCE SYSTEM — DESIGN SPEC & REFERENCE BENCHMARK
## CÂY GIA PHẢ / GIÒNG HỌ TRẦN TRỌNG THU
*Tài liệu Đặc tả Thiết kế Trải nghiệm Độc lập & Khảo sát Chuẩn mực Quốc tế*
*Ngày lập: 05/09/2026 — Trạng thái: Phase 1 Baseline*

---

## 1. NGUYÊN TẮC CỐT LÕI: DATA DOES NOT DICTATE PRESENTATION

Mô hình kiến trúc trải nghiệm độc lập được thiết lập:
```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND EXPERIENCE                      │
│ (Trải nghiệm đọc, cảm xúc, phân tầng thông tin, nhịp điệu)   │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                     INTEGRATION LAYER                       │
│      (Ánh xạ đối tượng, bù đắp trường khuyết, lọc ngữ cảnh)  │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                     EXISTING SUBSTRATE                      │
│   (Genealogy Graph, Mach Editorial Engine, Cal 4-Feeds)     │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. REFERENCE RESEARCH & BENCHMARK FORENSIC

### 2.1. Genealogy Systems (FamilySearch, MyHeritage, Ancestry)
- **Problem it solves:** Khám phá mối quan hệ gia tộc phức tạp qua nhiều thế hệ mà không gây quá tải nhận thức.
- **Why it works:** Sử dụng **Focus-centric Navigation** kết hợp **Generation Bands**. Thay vì render cùng lúc toàn bộ đồ thị (223+ người), hệ thống luôn lấy một nhân vật làm tâm điểm, hiển thị rõ 3 thế hệ (Cha Mẹ, Vợ/Chồng & Anh Chị Em, Con Cái).
- **What we adopt:**
  - *Pedigree Tree View* xoay quanh tiêu điểm được chọn, nhấp đúp hoặc bấm nút để chuyển tâm điểm mượt mà.
  - *Person Profile* chia 4 phân vùng rõ ràng: **Căn cước định danh** -> **Cột mốc cuộc đời** -> **Mạng lưới gia tộc** -> **Tư liệu & Ký ức liên quan**.
  - *Epistemic Certainty Badges* (Xác thực, Khẩu truyền, Khảo cứu).
- **What we reject:** Bảng biểu dữ liệu hành chính xám xịt, form nhập liệu khô khan kiểu quản lý hồ sơ nhân khẩu.

### 2.2. Digital Archive & Museum (Tate, Europeana, National Museums Scotland)
- **Problem it solves:** Trình bày hiện vật, tư liệu lịch sử có bối cảnh văn hóa sâu sắc, minh bạch về xuất xứ và quyền tác giả.
- **Why it works:** Đặt hình ảnh chất lượng cao (Facsimile) ở trung tâm, bố trí thông tin xuất xứ (Provenance), niên đại, tình trạng bảo tồn (Archival State) và các nhân vật liên quan song song một cách trang trọng.
- **What we adopt:**
  - Khung hiển thị tư liệu độc lập với khả năng xem chi tiết, phóng to, trích yếu lịch sử.
  - Dẫn chiếu trực tiếp từ tư liệu sang các nhân vật trong Gia Phả và các bài tiểu luận trong MẠCH.

### 2.3. Editorial & Cultural Publication (NYT Magazine, The Atlantic, Substack)
- **Problem it solves:** Trải nghiệm đọc tiểu luận, bút ký, thư từ chiêm nghiệm sâu lắng, không mỏi mắt, giàu chất tự sự.
- **Why it works:** Sử dụng phông chữ có chân (Serif) cao cấp, độ dài dòng chuẩn (65–75 ký tự), chữ hoa đầu dòng (Drop-cap), khối trích dẫn sâu sắc (Blockquotes), ghi chú chân trang (Footnotes) và điều hướng chương liền mạch.
- **What we adopt:**
  - Thiết kế ấn phẩm MẠCH (Tập san Số 01 và chuỗi Thư gửi Clara) như một tạp chí văn hóa di sản cao cấp.
  - Tách biệt rõ ràng giữa Tiếng nói cá nhân tự sự và Sự thật khách quan lịch sử.

---

## 3. HỆ THỐNG 15 PAGE TYPES & CẤU TRÚC PHÂN TẦNG TRẢI NGHIỆM

| Nhóm Không Gian | Loại Trang | Vai Trò Trải Nghiệm | Cấu Trúc Khối Chính |
| :--- | :--- | :--- | :--- |
| **0. Global & Portal** | `Page_Home` | Cổng dẫn nhập di sản, định vị tinh thần dòng họ | Masthead -> 3 Cửa ngõ (Gia Phả, Mạch, Tư Liệu) -> Trích dẫn tâm điểm -> Chỉ số di sản -> Lối rẽ mục đích |
| | `Page_AboutFamily` | Kể lại bối cảnh, nguồn cội đất Thọ Vực -> Bình Châu | Di cư ký, dòng chảy lịch sử, truyền thống gia phong |
| | `Page_AboutProject` | Giải thích phương pháp, tôn chỉ giữ gìn ký ức | Tôn chỉ bảo tồn, 7 bậc xác tín, danh sách đóng góp |
| **1. Gia Phả (Heritage)** | `Page_Tree` | Khám phá không gian phả hệ trực quan | Băng phân tầng thế hệ F0-F4, Focus Node, Quick Inspector |
| | `Page_Person` | Hồ sơ chân dung một tiền nhân / hậu duệ | Căn cước, Cột mốc đời người, Thân tộc 3 đời, Tư liệu & Ký ức |
| | `Page_Family` | Hồ sơ gia đình hạt nhân | Cặp hôn phối, chứng hôn, con cái trực hệ, biến thiên |
| | `Page_Directory` | Tra cứu danh bạ thành viên đa chiều | Bộ lọc thế hệ/chi nhánh/nơi sống, Thẻ cá nhân, Nút định vị cây |
| **2. Mạch (Narrative)** | `Page_Article` | Đọc tiểu luận, bút ký, thư từ sâu lắng | Bìa chuyên đề, Typographic Reader, Thân tộc nhắc đến, Chú thích |
| | `Page_Series` | Tuyển tập chuyên đề (Thư gửi Clara, Tập san) | Tôn chỉ tuyển tập, Danh mục bài viết, Lộ trình đọc |
| | `Page_Author` | Chân dung người giữ mạch / tác giả | Giới thiệu, Lời ngỏ, Các ấn phẩm đã chấp bút |
| **3. Tư Liệu (Archive)** | `Page_ArchiveItem` | Xem chứng tích, di ảnh, tư liệu Hán Nôm | Facsimile Viewer, Xuất xứ (Provenance), Độ xác tín, Nhân vật |
| | `Page_Collection` | Bộ sưu tập hiện vật theo chủ đề | Kho tư liệu ảnh, Giấy tờ cổ, Sổ rửa tội, Kỷ vật |
| **4. Capabilities** | `Page_Calendar` | Lịch gia tộc đồng bộ Âm - Dương 4 nguồn | Lễ giỗ, Bổn mạng, Sự kiện thế hệ, Đồng bộ Google Cal |

---

## 4. BẢNG ĐỐI CHIẾU KHỚP NỐI & KHOẢNG TRỐNG BACKEND (BACKEND FIT & DATA GAP MAP)

1. **Về Hình ảnh Nhân vật:** Backend `genealogy.json` hiện chưa có trường ảnh đại diện trực tiếp cho từng cá nhân -> *Frontend dùng hệ thống biểu tượng tôn nghiêm + liên kết qua `media` trong `mach.json`*.
2. **Về Thước đo Độ xác tín:** Backend mới lưu dữ liệu GEDCOM chuẩn -> *Integration Layer bổ sung Metadata xác tín 7 mức cho từng sự kiện*.
3. **Về Quan hệ Đa chiều:** Cần liên kết 2 chiều giữa Entity người với Bài viết MẠCH nhắc đến họ -> *Integration Layer thiết lập Reverse Indexing*.
