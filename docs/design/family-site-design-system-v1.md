# Gia Tộc Trần Trọng Thu - Design System V1

Hệ thống thiết kế (Design System) này đóng vai trò là "Ngôn ngữ thị giác" (Visual Language) cho toàn bộ nền tảng. Nó kết hợp sự trang nghiêm của không gian lưu trữ lịch sử (Archival/Museum) với sự rõ ràng, dễ dùng của một ứng dụng web (App Utility).

## 1. Tôn Chỉ Thiết Kế (Design Tenets)
- **Content is King:** Nội dung (tên người, câu chuyện, ngày tháng) là nhân vật chính. Giao diện phải lùi lại làm nền.
- **Flat & Sharp:** Phẳng và sắc bén. Nói không với bo góc (border-radius: 0) và bóng đổ (box-shadow). Giao diện là một bề mặt báo in/giấy phẳng.
- **Typographic Scale:** Điều hướng mắt người xem bằng kích thước chữ, thay vì dùng các mảng màu chói lóa.

## 2. Typography
**Typefaces:**
- **Serif (Display / Story):** `EB Garamond` (Hoặc `Source Serif 4` fallback). Dùng cho Tiêu đề lớn (H1, H2), Tên nhân vật, và Nội dung bài viết dài (Mạch). Tạo cảm giác lịch sử, trang trọng.
- **Sans-Serif (Utility / UI):** `Inter` (Hoặc `Noto Sans` fallback). Dùng cho Navigation, Nút bấm, Metadata (FSID, Ngày tháng), Thẻ tag. Tạo sự gãy gọn, dễ đọc khi ở kích thước nhỏ.

**Type Scale (Mặc định):**
- Heading 1 (Tên nhân vật/Hero): `3rem - 4rem` (Serif)
- Heading 2 (Tên phân mục): `2rem` (Serif)
- Heading 3 (Tên nhóm họ hàng): `0.85rem` (Sans-serif, Uppercase, Tracking rộng)
- Body Text (Bài viết): `1.15rem` (Serif)
- UI Text (Menu, Link): `0.9rem` (Sans-serif)
- Metadata (Badge, Note): `0.75rem` (Sans-serif)

## 3. Color Palette
Sử dụng bảng màu cực kỳ hạn chế, mô phỏng chất liệu giấy cổ và mực in.
- **Surfaces (Nền):**
  - `--bg-page: #FCFBF8;` (Trắng ngà/Off-white, nền chính của trang)
  - `--bg-surface: #FFFFFF;` (Trắng tinh, dùng cho các Card/Box nổi lên)
  - `--bg-hover: #F2F0E9;` (Xám ấm, dùng khi hover)
- **Text (Chữ):**
  - `--text-primary: #1A1A1B;` (Đen chì, không dùng `#000` để giảm độ gắt)
  - `--text-secondary: #5C5B5A;` (Xám đậm, dùng cho mô tả)
  - `--text-meta: #8F8D8A;` (Xám nhạt, dùng cho metadata, ngày tháng phụ)
- **Borders (Đường viền):**
  - `--border-light: #E8E6DF;` (Đường kẻ siêu mỏng chia khu vực)
  - `--border-dark: #CFCBC2;` (Đường viền Card, đường viền ảnh)
- **Accent (Điểm nhấn):**
  - `--accent-primary: #8A2D23;` (Đỏ đô/Brown-red, màu mực con dấu cổ. Dùng cho Text quan trọng hoặc mốc thời gian đặc biệt).

## 4. Spacing & Grid
- **Grid:** Cấu trúc 12 cột linh hoạt. Chiều rộng tối đa của container chứa nội dung là `1200px`.
- **Spacing Scale:** Dùng đơn vị `rem` và `em` tương đối.
  - `--sp-xs: 0.25rem;`
  - `--sp-sm: 0.5rem;`
  - `--sp-md: 1rem;`
  - `--sp-lg: 2rem;`
  - `--sp-xl: 4rem;`
- Giữa các Section lớn, dùng khoảng cách `4rem` để tạo "điểm nghỉ" cho mắt.

## 5. Components Core

### 5.1. Navigations & Links
- Text link thông thường: Chữ Sans-serif, gạch chân nét đứt, hover chuyển nét liền đậm.
- Button: Nút hình chữ nhật sắc cạnh, viền `1px solid var(--border-dark)`. Hover đảo màu nền (Đen/Trắng). Không bo góc.

### 5.2. Badges & Tags
- Thẻ nhỏ hiển thị thông tin như "Đời 1", "Nam".
- Sans-serif, chữ in hoa, font-size rất nhỏ (`0.7rem`), padding `0.2em 0.5em`, viền mảnh. Không nền (trong suốt).

### 5.3. Entity Cards (Relational Cards, Story Cards)
- Khung chữ nhật bao quanh thông tin.
- Viền `1px solid var(--border-light)`. 
- Nền trắng `var(--bg-surface)`.
- Khi Hover: Đổi nền sang `var(--bg-hover)`, viền chuyển thành `var(--border-dark)`, con trỏ biến thành pointer. 
- Layout trong Card ưu tiên sự gọn gàng: Ảnh Thumbnail bên trái (vuông vức), Tên bên phải.

### 5.4. Image Treatment
- Hình ảnh/Chân dung: Khung viền `1px solid var(--border-dark)`.
- Chân dung không có ảnh thật (Fallback): Một khung xám sáng với 1 ký tự chữ cái đầu tiên (Typographic Initial) viết bằng font Serif khổng lồ. Tuyệt đối không dùng Icon User ẩn danh kiểu phần mềm.

## 6. Responsive Rules
- Mọi đơn vị kích thước chữ đều nhân với `var(--global-text-scale)`.
- **Mobile First Approach cho Layout:** Mặc định các thành phần xếp chồng dọc (Stacked). Khi màn hình lớn hơn `768px`, bắt đầu dàn thành Grid 2 cột hoặc 3 cột.
- Typography tự động scale xuống khoảng 15-20% trên màn hình nhỏ để tránh vỡ chữ.
