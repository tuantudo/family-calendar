# Tương lai: Dynamic Web Architecture (Phase 2)

Tài liệu này mô tả lộ trình tiến hóa của website Gia Tộc Trần Trọng Thu từ kiến trúc tĩnh (Static Web - Phase 1) lên kiến trúc động (Dynamic Web - Phase 2). 

## 1. Kiến trúc hiện tại (Phase 1: Static Web)
Mô hình hiện tại hoàn toàn chạy trên Client-side (Trình duyệt của người dùng):
```
Browser (User)
  ↓ Request URL
Vercel CDN (Static Hosting)
  ↓ Trả về index.html, CSS, JS
Browser thực thi `app.js`
  ↓ fetch()
Tải cục bộ `data/genealogy.json` và `data/mach.json`
  ↓
JS Render giao diện
```
**Ưu điểm:** Cực kỳ nhanh, hosting miễn phí, không tốn công quản trị server.
**Nhược điểm:** File JSON tải toàn bộ 1 lần. Nếu gia tộc có 100,000 người, file JSON sẽ quá nặng. Không có hệ thống Admin để nhập liệu (phải sửa code JSON bằng tay). Không bảo mật dữ liệu nhạy cảm.

## 2. Kiến trúc tương lai (Phase 2: Dynamic Web)
Phase 2 sẽ tách biệt Frontend và Backend, đưa dữ liệu vào Database thực thụ.

```
Browser (User)
  ↓ (1) Tải giao diện
Frontend (Next.js / React / Vanilla SPA) 
  ↓ (2) Gọi API lấy thông tin (VD: /api/person/I1)
Application Server (Node.js / Python / Go)
  ↓ (3) Truy vấn dữ liệu
Database (PostgreSQL / MongoDB)
  &
NAS (Network Attached Storage - Chứa hình ảnh, video nặng)
```

## 3. Các thành phần sẽ thay đổi
- **Giao diện (UI/UX) & Frontend Code (HTML/CSS):** Giữ nguyên 100%. Đây là lý do Phase 1 tập trung xây dựng Design System và tách bạch Data/Logic/View.
- **`app.js`:** Thay vì tải toàn bộ `genealogy.json`, hàm `openPersonProfile(pid)` sẽ gọi API `fetch('/api/person/' + pid)` để chỉ lấy đúng dữ liệu của người đó.
- **Database:** Xóa bỏ file `data/genealogy.json`. Data sẽ được migrate vào hệ quản trị CSDL. Postgres rất phù hợp để lưu trữ quan hệ gia phả (Relational Data / Graph Data).
- **NAS (Network Attached Storage):** Thay vì upload ảnh lên thư mục `/assets` của code, NAS nội bộ gia đình sẽ chứa hàng Terabyte ảnh/video lịch sử, và trả về qua API.

## 4. Bảo mật & Quản trị (Authentication)
- Bổ sung tầng Security: Các dữ liệu nhạy cảm (số điện thoại, địa chỉ nhà) sẽ bị ẩn với khách vãng lai.
- Thành viên gia đình có tài khoản đăng nhập (OAuth / Email) để xem Full Data.
- Role-based Access: Có tài khoản "Trưởng họ / Ban biên tập" để vào màn hình Admin thêm/sửa/xóa người trực tiếp trên giao diện web, thay vì phải dùng Github/VSCode.

## Tóm lại
Phase 1 xây dựng "lớp vỏ" vững chắc và định hình trải nghiệm người dùng (UX/UI). Khi Phase 1 hoàn hảo, Phase 2 chỉ đơn thuần là việc "rút ruột" file JSON ra và cắm đường ống API từ Server vào, mà người dùng cuối không hề nhận ra sự gián đoạn.
