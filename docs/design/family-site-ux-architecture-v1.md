# Gia Tộc Trần Trọng Thu - UX Architecture V1

## 1. Project UX Goal
Xây dựng một "Digital Family Archive" (Lưu trữ số gia đình) dành cho Gia tộc Trần Trọng Thu. Hệ thống không nhằm mô phỏng phần mềm SaaS quản lý nhân sự, mà là một không gian thiêng liêng, trang nghiêm, có tính lịch sử để thế hệ sau tra cứu nguồn cội, đọc lại ký ức và xem các tư liệu gia đình.

## 2. User Types / Context
- **Elderly Family Members (Thế hệ trước):** Cần giao diện rõ ràng, font chữ to, tương phản cao, thao tác lướt đọc mượt mà. (Zoom-friendly).
- **Younger Generation (Thế hệ trẻ):** Cần trải nghiệm tra cứu nhanh, cấu trúc thông tin logic, tìm kiếm dễ dàng qua điện thoại.
- **Context:** Người dùng thường vào xem dịp lễ Tết, giỗ chạp, hoặc khi có thành viên mới sinh/qua đời cần cập nhật phả hệ.

## 3. Information Architecture (IA)
```text
SITE (Gia tộc Trần Trọng Thu)
│
├── TRANG CHỦ (Home) -> Gateway giới thiệu, định hướng 3 trụ cột (Gia Phả, Mạch, Tư Liệu).
│
├── GIA PHẢ (Genealogy Hub)
│   ├── Cây Phả Đồ (Tree) -> Visual node graph
│   ├── Danh Bạ (People) -> A-Z index, Search
│   ├── Hồ Sơ Cá Nhân (Person) -> Archival Hub (Timeline + Relational Nodes)
│   ├── Gia Đình (Families) -> Index of family units
│   ├── Ký Ức (Memories) -> Index of short anecdotes
│   └── Dòng Thời Gian (Timeline) -> Macro historical view
│
├── MẠCH (Editorial / Stories)
│   ├── Bài Viết (Story Detail) -> Long-form reading
│   ├── Chuỗi Bài (Series)
│   └── Tác Giả (Author)
│
├── TƯ LIỆU (Media Archive) -> Gallery of photos/documents
│
└── LỊCH (Calendar) -> Upcoming birthdays, death anniversaries
```

## 4. Site Navigation
- **Global Header:** Minimalist, sticky. Contains main routes: Trang Chủ, Gia Phả, Mạch, Tư Liệu, Lịch, Tìm kiếm.
- **Local/Contextual Navigation:** Sử dụng các đường link text-based rõ ràng bên trong từng view (VD: "Trở về Cây Phả Hệ", "Xem tất cả bài viết").
- **Cross-linking:** Hồ sơ cá nhân (Person) link trực tiếp sang Bài viết (Mạch) nếu người đó là tác giả hoặc nhân vật trong bài.

## 5. Page Models
- **Homepage:** *Orientation Gateway*. Dẫn dắt người dùng bằng các khối giới thiệu súc tích và điều hướng rõ ràng vào các tính năng sâu hơn.
- **Person Detail:** *The Archival Hub*. Phối hợp giữa Hồ sơ lưu trữ (Metadata, Timeline) và Trạm trung chuyển (Navigation Cards trỏ đến họ hàng).
- **Story Detail (Mạch):** *Editorial Article*. Tập trung hoàn toàn vào Reading Flow.
- **Tree/People:** *Data Dashboard/Index*. Tối ưu cho thao tác cuộn, lọc, và quét (scan) lượng dữ liệu lớn.

## 6. User Flows
- **Khám phá huyết thống:** Home -> Gia Phả -> Tìm tên mình -> Mở Person Detail -> Click vào Thân phụ/Thân mẫu -> Khám phá ngược lên cụ Tổ.
- **Đọc câu chuyện:** Home -> Mạch -> Chọn bài viết -> Đọc -> Xem tiểu sử Tác giả.

## 7. Component Architecture
- `GlobalNav`: Điều hướng cấp cao nhất.
- `EntityHeader`: Hiển thị định danh (Avatar + Name + Badge). Dùng chung cho Person, Author, Family.
- `RelationCard`: Card liên kết họ hàng.
- `ArticleCard`: Card đại diện cho một bài viết trong Mạch.
- `DataGrid`: Hiển thị Metadata dạng Key-Value (VD: FSID, Năm sinh).
- `Timeline`: Render danh sách sự kiện theo trình tự thời gian.

## 8. Visual Design Principles
- **Chất liệu lưu trữ (Archival Texture):** Dùng màu nền giấy (Off-white), chữ than (Charcoal), đường viền siêu mảnh.
- **Tính lịch sử:** Dùng Typography (Serif) làm điểm nhấn thị giác thay vì lạm dụng icon hay hình khối hiện đại.
- **Phẳng & Sắc cạnh:** 0px border-radius, không dùng shadow (phá vỡ cảm giác màn hình nổi của SaaS, tạo cảm giác bề mặt in ấn 2D).

## 9. Responsive Principles
- Desktop: Đa cột (Grid-based). Tận dụng khoảng trắng.
- Mobile: Đơn cột (Stacking). Thứ tự ưu tiên: Identity -> Actions -> Main Content -> Secondary Links.
- Font-size: Áp dụng CSS `calc()` với biến `--global-text-scale` xuyên suốt toàn trang.

## 10. Accessibility Principles
- Tỷ lệ tương phản chữ/nền tối thiểu 4.5:1.
- Nút bấm (Button) và Liên kết (Link) phải có state rõ ràng (Hover/Focus).
- Typography không nhỏ hơn 14px trên mobile ở mức scale mặc định.
- Hỗ trợ toàn bộ thao tác thu phóng chữ bằng widget riêng biệt.

## 11. Implementation Architecture (Phase 1)
- Static SPA (Single Page Application).
- **State/Logic:** Vanilla JavaScript (`src/js/app.js`) xử lý Hash Routing (`#/mach`, `#/person/I1`).
- **View/DOM:** Các `<section class="view-section">` trong `index.html`. JS bật tắt class `.active` để render màn hình.
- **Style:** Pure CSS Custom Properties, gom vào một file tập trung (`main.css`) và các file component nếu cần, đảm bảo thống nhất.

## 12. Design → Code Mapping
- `EntityHeader` (Design) = `<header class="entity-header">` (Code).
- `RelationCard` (Design) = `<a class="rel-card">` (Code).
- CSS Variables quản lý toàn bộ Color, Typography, Spacing để tránh hardcode. JS tuyệt đối không tiêm inline-styles.

## 13. Known Issues
- Data hiện tại phụ thuộc hoàn toàn vào file JSON khổng lồ tải 1 lần. Nếu data quá lớn trong tương lai, cần giải pháp chunking (Phase 2).
- Cây phả hệ (Interactive Tree) hiện dùng thư viện D3.js có thể chưa đồng bộ hoàn toàn style với hệ thống Visual mới. Sẽ cần tinh chỉnh CSS nội bộ của SVG.

## 14. Future Evolution
Khi chuyển sang Phase 2 (Dynamic Web), toàn bộ Frontend (HTML/CSS) hiện tại có thể giữ nguyên. Chỉ cần tháo các hàm `fetch('data.json')` trong `app.js` và thay bằng `fetch('/api/persons')`.
