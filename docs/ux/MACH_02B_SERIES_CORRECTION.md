# BÁO CÁO MACH_02B: HIỆU CHỈNH TAXONOMY & PHỤC HỒI CHUỖI “THƯ GỬI CLARA”

**Dự án**: Cây Gia Phả Dòng Họ Trần Trọng Thu — Nền tảng Tạp chí Số MẠCH  
**Mã nhiệm vụ**: `MACH_02B — RESTORE & CORRECT SERIES TAXONOMY`  
**Ngày thực hiện**: 05/09/2026  
**Trạng thái**: Hoàn tất & Sẵn sàng Deploy Production  

---

## 1. Bối cảnh & Vấn đề Đã Phát hiện (Root Cause)

Trên phiên bản trước của MẠCH, đã xuất hiện một lỗi nhận thức và cấu trúc taxonomy:
- Toàn bộ tab **MẠCH** bị gộp thành một ấn phẩm duy nhất: *“MẠCH — Số 01: Dòng Họ Trong Đời Sống Đương Đại”*.
- Khiến “Tập san Mạch” trở thành publication/series trung tâm duy nhất nuốt chửng các nội dung khác.
- Chuỗi bài **“Thư gửi Clara”** (những lá thư chiêm nghiệm thân mật của Tuấn gửi cháu gái và thế hệ sau) bị hiểu nhầm hoặc bỏ sót không đưa vào cấu trúc song song ngang hàng.

**Hiệu chỉnh Taxonomy chuẩn**:
1. **MẠCH** là Digital Magazine / Editorial Platform tổng thể bên trong website Cây Gia Phả.
2. Bên trong MẠCH có **nhiều Series song song ngang hàng**:
   - **Series 01: `issue-01` (Tập san MẠCH)**: Tiếng nói tập thể, khảo cứu, tư liệu văn hóa gia tộc (12 bài viết).
   - **Series 02: `thu-gui-clara` (Thư gửi Clara)**: Tiếng nói cá nhân, tâm tình, đối thoại thế hệ của Tuấn (7 lá thư).
3. Tuyệt đối tôn trọng tính nguyên bản của nguồn tư liệu Obsidian (`/Users/tuantq/Obsidian/20_PROJECTS/Mach/Thư gửi Clara`).

---

## 2. Các Thay đổi Kỹ thuật & Xây dựng Dữ liệu

### 2.1. Compilation Engine (`scripts/build_mach.py`)
- Nâng cấp script build để tự động ingest 2 thư mục nội dung:
  - `Mach/PROJECTS/ISSUE_01/CANONICAL` → `content/mach/issue-01/` (12 bài).
  - `Mach/Thư gửi Clara` → `content/mach/thu-gui-clara/` (7 lá thư).
- Ánh xạ hình ảnh chuẩn từ `Images/00X.png` sang `assets/images/mach/thu-gui-clara/00X.png`.
- Tách biệt `editorialVoice`:
  - `collective-editorial` / tác giả `nguoi-giu-mach` cho Tập san Mạch.
  - `personal` / tác giả `tuan` (Tuấn - Người Giữ Mạch) cho Thư gửi Clara.
- Xuất dữ liệu biên mục thống nhất `data/mach.json` gồm 19 câu chuyện, 2 chuỗi series, 3 tác giả, 7 chủ đề.

### 2.2. Frontend & Routing Engine (`src/js/app.js` & `index.html`)
1. **Dual-Series Showcase trên `#/mach`**:
   - Khối tiêu điểm: Hero banner Tập san MẠCH (12 bài) & Thư gửi Clara (7 lá thư) hiển thị song song, rõ ràng bản sắc.
2. **Dedicated Series Routes**:
   - `#/mach/series/thu-gui-clara`: Danh mục 7 lá thư với metadata ngày viết, trích dẫn, ảnh bìa và tác giả.
   - `#/mach/series/issue-01`: Danh mục 12 bài viết của Số 01.
3. **Article Detail View (`#/mach/bai-viet/:slug`)**:
   - Breadcrumb phân cấp chính xác: `MẠCH > THƯ GỬI CLARA > LÁ THƯ SỐ 01` (hoặc `TẬP SAN MẠCH > BÀI 01`).
   - Tác giả hiển thị đúng (`Tuấn (Người Giữ Mạch)` hoặc `Người giữ mạch`).
   - Điều hướng *Trước / Tiếp theo* (Prev/Next) tự động khoanh vùng trong nội bộ từng Series.
   - Strip sạch sẽ YAML frontmatter metadata thô khỏi khung đọc.
   - Giữ nhịp typography Source Serif 4 trang nhã, giàu tính tự sự.
4. **Global Search Integration**:
   - Tìm kiếm toàn hệ thống nhận diện tức thì cả Nhân vật gia phả lẫn bài viết của cả 2 Series (`✉️ Thư gửi Clara` & `📖 Tập san MẠCH`).

---

## 3. Danh mục 7 Lá Thư Đã Phục Hồi

| Số | Slug | Tiêu đề | Ngày viết |
|---|---|---|---|
| **01** | `clara-001` | **Thư gửi Clara — Số 01: Điểm Tựa Cuộc Đời** | 22/07/2026 |
| **02** | `clara-002` | **Thư gửi Clara — Số 02: Quyết Định Chuyển Dời** | 30/07/2026 |
| **03** | `clara-003` | **Thư gửi Clara — Số 03: Cảm Thức Cộng Đồng** | 16/08/2026 |
| **04** | `clara-004` | **Thư gửi Clara — Số 04: Cái Tôi Khái Niệm Hóa** | 22/08/2026 |
| **05** | `clara-005` | **Thư gửi Clara — Số 05: Vai Trò Nội Tâm Hóa** | 27/08/2026 |
| **06** | `clara-006` | **Thư gửi Clara — Số 06: Tự Do Trước Quá Khứ** | 27/08/2026 |
| **07** | `clara-007` | **Thư gửi Clara — Số 07: Thể Diện, Sĩ Diện & Tự Do** | 03/09/2026 |

---

## 4. Kiểm thử & Đảm bảo Chất lượng (QA Verification)

- **Mobile Viewports (390px, 430px)**: Header, navigation, thẻ bài viết, hình ảnh và nhịp đọc hiển thị cân đối, không tràn layout ngang, touch target nút điều hướng đạt chuẩn.
- **Desktop (1440px)**: Dual series banner bố trí trực quan, chuyển đổi mượt mà giữa Gia Phả, Mạch, và Lịch.
- **Search Testing**: Truy vấn từ khóa `"Clara"` lập tức gợi ý nhân vật Maria Trần An Nhã (Clara - F4) kèm danh sách 7 lá thư liên quan.
