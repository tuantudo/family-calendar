# BÁO CÁO TRIỂN KHAI & ĐƯA LÊN ONLINE: KHÔNG GIAN MẠCH (MACH_01)
## HỆ THỐNG TRI THỨC DÒNG HỌ TRẦN TRỌNG THU (`family-calendar`)
### STATUS: PRODUCTION DEPLOYED — READY FOR USER EXPERIENCE
*Tài liệu Báo cáo Triển khai Không Gian Tự Sự & Kỷ Yếu Dòng Họ (MACH_01)*  
*Ngày triển khai: 05/09/2026*  
*Workspace: `/Users/tuantq/Projects/Personal/family-calendar`*  
*Production Identity: `gionghotrantrongthu.vercel.app`*  
*GitHub: `tuantudo/family-calendar` (Branch: `main`)*  

---

## A. CONTENT INVENTORY (KIỂM TOÁN TƯ LIỆU NGUỒN THẬT)

Đã nhập liệu và đồng bộ 100% nội dung thật từ nguồn Obsidian (`/Users/tuantq/Obsidian/20_PROJECTS/Mach`):

```text
TỔNG QUAN TƯ LIỆU MẠCH ĐÃ ĐỒNG BỘ:
├── Series 1: "Thư gửi Clara" (Tác giả: Tuấn TQ)
│   ├── Thư gửi Clara - Số 01 (Ngày 22/07/2026) ── Khởi thủy, Bí tích Rửa tội, AI & Điểm tựa đầu đời
│   ├── Thư gửi Clara - Số 02 (Ngày 28/07/2026) ── Dòng chảy liên thế hệ, Phước đức & Móng nhà vô hình
│   ├── Thư gửi Clara - Số 03 (Ngày 02/08/2026) ── Sinh nhật đứt gãy, Cảm thức cộng đồng & Cây gia phả
│   ├── Thư gửi Clara - Số 04 (Ngày 09/08/2026) ── Khái niệm hóa vai trò, Đối diện cái chết & Nếp sống
│   ├── Thư gửi Clara - Số 05 (Ngày 15/08/2026) ── Tự vấn cấu trúc thân tộc, Đích tôn & Cơ chế tự hành
│   ├── Thư gửi Clara - Số 06 (Ngày 22/08/2026) ── Thể diện gia đình & Trưởng thành nội tâm
│   └── Thư gửi Clara, Rina, Tina, Tin và Tito - Số 07 (Ngày 04/09/2026) ── Mùa hội ngộ & Tình thân
│   └── Thư mục Images: 8 tệp ảnh tư liệu di sản thật (001.png -> 007.jpg)
│
└── Series 2: "Khảo Cứu Nhận Thức & Di Sản" (Ban Biên Tập)
    ├── NGOẠI HÓA NHẬN THỨC (Khảo cứu triết học văn minh & di sản lưu trữ)
    └── NHỮNG ĐIỀU CÒN GIỮ CON NGƯỜI Ở LẠI VỚI NHAU (Khảo cứu sự gắn kết thân tộc)
```

---

## B. CONTENT MAPPING (ÁNH XẠ THỰC THỂ DỮ LIỆU)

* **Author Model**: Hỗ trợ mô hình Đa tác giả (Multi-Author) không hard-code giao diện.
  * `tuan-tq`: Tuấn TQ (Chấp bút Series *Thư gửi Clara*).
  * `mach-editorial`: MẠCH Tạp chí / Ban Biên tập Di sản.
* **Series Model**: Gom nhóm tác phẩm theo tuyến tự sự dài hạn (`thu-gui-clara`, `khao-cuu-nhan-thuc`).
* **Topic Taxonomy**: 5 chủ đề tộc ước tự nhiên (#GiaPhong, #NhanThuc, #DiCu, #NiemTin, #TheHe).
* **Cross-References**: Tự động nhận diện và gắn thẻ thực thể tiền nhân (ví dụ: Cụ Giuse Trần Trọng Thu F0 `G5X4-48S`) từ văn bản sang Cây gia phả.

---

## C. CONTENT PIPELINE (QUY TRÌNH XỬ LÝ DỮ LIỆU TỰ ĐỘNG)

Thiết lập pipeline tự động biên dịch từ Markdown sang dữ liệu JSON có cấu trúc độc lập:
$$\text{Obsidian Markdown} \longrightarrow \text{content/mach/} \longrightarrow \text{scripts/build_mach.py} \longrightarrow \text{data/mach.json} \longrightarrow \text{Web App}$$

* **Tách Biệt Tuyệt Đối**: GEDCOM gốc và `genealogy.json` không bị pha tạp nội dung bài viết.
* **Tự Động Trích Xuất**: Tự động parse frontmatter, ngày tháng, tiêu đề, trích đoạn tóm tắt (excerpt) và chuẩn hóa đường dẫn hình ảnh cho web.

---

## D. ROUTE IMPLEMENTATION (DANH MỤC TUYẾN ĐƯỜNG ĐÃ TRIỂN KHAI)

Hệ thống điều hướng Hash Routing tĩnh (`#/`) hoạt động thông suốt:
* `#/mach`: Trang chủ Không gian MẠCH (Tab Tất cả bài viết, Tuyển tập, Tác giả).
* `#/mach/bai-viet/:slug`: Trang đọc bài viết tự sự (ví dụ: `#/mach/bai-viet/thu-gui-clara-001`).
* `#/mach/series/:slug`: Trang tuyển tập và mục lục chương (ví dụ: `#/mach/series/thu-gui-clara`).
* `#/mach/tac-gia/:id`: Trang hồ sơ tác giả và tác phẩm đã đóng góp (ví dụ: `#/mach/tac-gia/tuan-tq`).
* *Tương thích ngược*: `#/memories` tự động chuyển tiếp liền mạch vào `#/mach`.

---

## E. UX IMPLEMENTATION & VISUAL DIRECTION (TRẢI NGHIỆM ĐỌC)

1. **Phong Cách Thị Giác (Modern Archival)**:
   * Giữ màu nền Giấy Dó / Archival Linen (`#F7F5F0`), thẻ bài viết trắng sạch viền parchment (`#E5E0D6`).
   * Điểm xuyết huy hiệu đỏ Sơn Mài (`#881337`) và đồng cổ Hoàng Kim (`#B45309`).
2. **Typography Trọng Tâm Cho Trải Nghiệm Đọc**:
   * Tiêu đề và nội dung bài viết sử dụng phông cổ điển trang trọng **EB Garamond** (cỡ chữ $19\text{px}$, chiều cao dòng $1.85$, căn đều văn bản tự nhiên).
   * Giao diện điều hướng, nhãn hệ thống và thông tin tác giả dùng phông hiện đại **Plus Jakarta Sans**.
3. **Thanh Chuyển Hướng Bài Viết (Series Navigation)**:
   * Chân mỗi bài viết có nút điều hướng nhanh sang *Bài trước* và *Bài tiếp theo* trong cùng Series.
   * Thẻ hồ sơ tác giả và liên kết ngược về Series hiển thị trang trọng ở cuối bài.

---

## F. CROSS-NAVIGATION (ĐIỀU HƯỚNG LIÊN KHÔNG GIAN)

* **Story $\rightarrow$ Person**: Các bài viết nhắc đến "ông nội", "Cụ Thu" được gắn chip liên kết ngữ cảnh `Giuse Trần Trọng Thu (F0)` $\rightarrow$ click trực tiếp mở ngay Hồ sơ cá nhân và vị trí trên Cây phả hệ.
* **Global Search**: Ô tìm kiếm toàn cục trên thanh Navbar chính đã lập chỉ mục toàn bộ các bài viết trong MẠCH. Gõ từ khóa (ví dụ: "Clara", "Rửa tội", "Nhận thức") sẽ dẫn trực tiếp vào bài đọc.

---

## G. KẾT QUẢ KIỂM THỬ GIAO DIỆN & RESPONSIVE

Đã kiểm thử thực tế bằng Playwright trên các độ phân giải:
* **Desktop ($1440\text{px}$ & $1280\text{px}$)**: Lưới 3 cột bài viết thông thoáng, độ rộng khung đọc tối ưu ở $820\text{px}$ giúp mắt không bị mỏi.
* **Tablet ($768\text{px}$ & $1024\text{px}$)**: Tự động co giãn thành 2 cột, hình ảnh minh họa căn giữa cân đối.
* **Mobile ($390\text{px}$ & $430\text{px}$)**: Lưới 1 cột dọc mượt mà, cỡ chữ điều chỉnh tự động xuống $17.5\text{px}$ đảm bảo trải nghiệm đọc trên điện thoại thoải mái nhất.

---

## H. KIỂM TOÁN TÍNH TOÀN VẸN DỮ LIỆU (DATA INTEGRITY GATE)

```text
KIỂM TOÁN HỆ THỐNG TOÀN DIỆN:
├── GEDCOM Source of Truth: BẢO TOÀN NGUYÊN BẢN (Không bị chỉnh sửa)
├── ICS Feeds (4 Tệp Lịch):
│   ├── CAL_01_BIRTHDAYS.ics     = 118 events (Bảo toàn 100%)
│   ├── CAL_02_PATRON_FEASTS.ics  = 115 events (Bảo toàn 100%)
│   ├── CAL_03_MEMORIALS.ics      =  28 events (Bảo toàn 100%)
│   ├── CAL_04_FAMILY_MILESTONES  =   4 events (Bảo toàn 100%)
│   └── TỔNG CỘNG SỰ KIỆN LỊCH    = 265 events (Chính xác)
├── Phả hệ (data/genealogy.json):  223 cá nhân, 68 gia đình
└── MẠCH (data/mach.json):         9 bài viết thật, 2 series, 2 tác giả, 5 chủ đề
```

---

## I. PRODUCTION URL & DEPLOYMENT DETAILS

* **Production URL Chính Thức**: [https://gionghotrantrongthu.vercel.app/#/mach](https://gionghotrantrongthu.vercel.app/#/mach)
* **Vercel Project**: `gionghotrantrongthu` (Deployment ID: `dpl_9KF4ooUWTWxq8M5xgLkf4aHh6dfA`)
* **GitHub Repository**: `tuantudo/family-calendar` (Commit: `3cf3f57` trên nhánh `main`)

---

## J. CÁC HẠN CHẾ ĐÃ GHI NHẬN (KNOWN LIMITATIONS)

1. **Trình diễn hình ảnh trong Markdown**: Hiện tại parser chuyển đổi ảnh cơ bản với caption bên dưới; các bố cục phức tạp (hai ảnh song song dạng spread như sách in) sẽ được tối ưu trong các vòng UX tiếp theo.
2. **Bộ lọc Chủ đề (Topic Filtering)**: Các nhãn chủ đề đã sẵn sàng trong dữ liệu nhưng chưa gắn thanh filter chips riêng trên giao diện trang chủ MẠCH.
3. **Mục lục bài viết dài (Table of Contents)**: Các bài khảo cứu dài (như Ngoại Hóa Nhận Thức) chưa có thanh mục lục cố định bên cạnh để nhảy nhanh đến từng mục.

---

## K. KHUYẾN NGHỊ CHO VÒNG UX TIẾP THEO

* Để Tuấn trực tiếp mở điện thoại / máy tính truy cập [https://gionghotrantrongthu.vercel.app/#/mach](https://gionghotrantrongthu.vercel.app/#/mach) để trải nghiệm đọc thực tế các lá thư và đóng góp phản hồi về nhịp điệu thị giác, khoảng cách dòng và điều hướng.
