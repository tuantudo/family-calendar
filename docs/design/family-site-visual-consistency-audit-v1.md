# VISUAL CONSISTENCY AUDIT V1

## 1. Mục đích
Tài liệu này ghi nhận hiện trạng hệ thống UI sau khi áp dụng các thiết lập Global (Visual Language V1). Nó phân loại các điểm bất nhất (Inconsistency) để đảm bảo không bị nhầm lẫn giữa "lỗi thiết kế cũ sót lại" (Accidental Legacy) và "sự khác biệt có chủ đích" (Valid Page-Specific Difference).

## 2. Page-by-Page Audit

### A. Homepage (`view_home`)
- **Tình trạng:** Các khối Intent Paths (Khám phá phả hệ, Mạch truyện, Tư liệu gốc).
- **Inconsistency:** Một số Nút (Button) "Tìm hiểu thêm" vẫn bị giới hạn chiều rộng cứng (hardcoded width) hoặc có margin không đều.
- **Type:** `TYPE C - Accidental Legacy`.
- **Recommendation:** Chuyển đổi các CTA thành Text link gạch chân dày (Archival style) thay vì nút bấm đóng khung.

### B. Gia Phả - Danh bạ (`view_people`)
- **Tình trạng:** Khung tìm kiếm (Search bar) và Lưới hiển thị danh sách thành viên.
- **Inconsistency:** Khung tìm kiếm có bóng đổ nhẹ và góc bo tròn (box-shadow/border-radius) được code bằng CSS inline (`<input style="...">`), đi ngược với nguyên lý Flat & Sharp.
- **Type:** `TYPE C - Accidental Legacy`.
- **Recommendation:** Refactor cấu trúc HTML, loại bỏ inline style, chuyển quyền quản trị vào `.search-input` trong `main.css`.

### C. Gia Phả - Cây đồ họa (`view_tree`)
- **Tình trạng:** Biểu đồ tổ chức SVG render bằng thư viện D3.js.
- **Inconsistency 1 (SVG Nodes):** SVG render bằng thẻ `<rect rx="8" ...>` (tạo góc bo tròn), không chịu ảnh hưởng của lệnh CSS Global `--radius-md: 0`. 
- **Type:** `TYPE C - Accidental Legacy / Implementation Leak`.
- **Recommendation:** Sửa thuộc tính `rx="0"` trong logic render D3 của `app.js`.
- **Inconsistency 2 (Canvas Background):** Nền SVG đang để trong suốt hoặc xám trơn, không mang màu giấy ngà (`--bg-page`) của hệ thống.
- **Type:** `TYPE B - Valid Page-Specific Difference` (Canvas có thể cần màu xám lạnh để nổi bật Node). Cần Owner quyết định.

### D. Hồ Sơ Cá Nhân (`view_person`)
- **Tình trạng:** Đã được thiết kế lại thành Archival Hub chuẩn.
- **Inconsistency:** Nút "← Cây Phả Hệ" hiện tại đang chìm nghỉm ở góc trên.
- **Type:** `TYPE D - Unresolved Design Decision`.
- **Recommendation:** Cần đưa ra quy chuẩn Back Link cho toàn site (Vị trí, Kích thước, Ký hiệu mũi tên).

### E. Mạch - Bài viết (`view_story`)
- **Tình trạng:** Trang đọc dài (Long-form prose).
- **Inconsistency:** Ảnh trong bài viết đôi khi bị tràn lề (bleed) ra khỏi text container, thiếu caption chuẩn. Thẻ trích dẫn (`<blockquote>`) vẫn dùng border mập mạp của UI cũ.
- **Type:** `TYPE A - True System Inconsistency`.
- **Recommendation:** Chuẩn hóa `.story-content-body img` và `blockquote` vào `main.css`, sử dụng đường viền siêu mảnh `1px solid var(--border-dark)`.

### F. JS Inline Styles Leakage
- **Tình trạng:** Trong `app.js` và `index.html` vẫn còn rải rác các đoạn code: `<div style="padding:10px 14px; background:var(--primary-light); border-radius:8px; border:1px solid #bfdbfe;">` (được tìm thấy trong render Lịch / Dòng thời gian).
- **Type:** `TYPE C - Accidental Legacy`.
- **Recommendation:** Nghiêm cấm JS sinh ra `border-radius`. Sẽ cần một đợt Refactor dọn dẹp mã nguồn JS.

## 3. Tổng kết
Visual Language V1 đã được thiết lập thành công trên bộ xương CSS, tạo ra một tổng thể "Gia phả lưu trữ" (Archival) rõ rệt. Tuy nhiên, sự rò rỉ của "Accidental Legacy" từ các đoạn CSS inline và SVG properties chứng tỏ nguyên lý Separation of Concerns (Tách biệt Data và View) ở Phase 1 chưa triệt để. Đợt Implementation tiếp theo sẽ chỉ tập trung vào việc dọn dẹp (Refactoring) các mầm mống Type C này.
