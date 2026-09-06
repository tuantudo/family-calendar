# APPLICATION ARCHITECTURE BLUEPRINT V2

## 1. Executive Summary
Dự án Gia Tộc Trần Trọng Thu đang dịch chuyển từ Website Tĩnh (Static JSON) sang Hệ thống Thông tin Lưu trữ (Knowledge Application). 
Do hạ tầng NAS Synology DS223j bị giới hạn về phần cứng (RAM 1GB, ARM, không Docker), kiến trúc mục tiêu sẽ là **Hybrid Architecture**: Vercel đảm nhiệm Frontend (CDN), NAS đóng vai trò API Backend (Node.js) & Cơ sở dữ liệu (MariaDB) & Kho lưu trữ hình ảnh lớn.

## 2. Current Architecture & Limitations
- **Current:** SPA Vanilla JS + JSON file.
- **Limitations:** File `genealogy.json` đang phình to. Không thể tìm kiếm Full-text hiệu quả. Không có Entity Backlinks (ví dụ: Story không biết nó đang nhắc đến ai trong Gia phả).

## 3. Domain Model (Lõi Dữ Liệu)
- **Person:** Lõi trung tâm (Họ tên, Năm sinh/mất, FSID, Gender).
- **Relationship:** Quan hệ đồ thị (Cha-Con, Vợ-Chồng).
- **Event:** Các sự kiện (Sinh, Giỗ) - liên kết với Person.
- **Story:** Ký ức / Bài viết - có `Mentions` (Nối với Person).
- **Artifact:** Hình ảnh / Tư liệu cổ - có `Provenance` và `Tagged_Persons`.

## 4. Target Architecture
### 4.1. Frontend Layer (Vercel)
- Vẫn dùng Vanilla JS (hoặc nâng cấp React/Vue sau này).
- **Trách nhiệm:** Trình diễn Art Direction V1, gọi API lấy dữ liệu tĩnh, quản lý UI State (Pan/Zoom Tree).

### 4.2. API Layer (Synology NAS - Node.js v20)
- Framework: Express.js hoặc Hono (nhỏ gọn, nhẹ RAM).
- REST API: 
  - `GET /api/people/:id` (Hồ sơ gốc)
  - `GET /api/people/:id/network` (Gia đình + Bài viết nhắc đến)
  - `GET /api/search?q=` (Tìm kiếm chéo)

### 4.3. Data Layer (Synology NAS)
- **Database:** MariaDB 10. Chứa cấu trúc quan hệ.
- **Media Storage:** Thư mục `/volume1/web/family-genealogy/media/`. Trả ảnh trực tiếp qua Nginx (WebStation) mà không qua Node.js để tiết kiệm RAM.

## 5. Security & Public Boundary
- MariaDB chỉ bind vào `127.0.0.1`.
- Node.js API chạy ở port nội bộ (vd: 3000).
- WebStation làm Reverse Proxy, nhận request HTTPS (443) từ Internet có SSL (Let's Encrypt), định tuyến `/api` vào Node.js và `/media` vào thư mục tĩnh.

## 6. Backup & Recovery
- **Database:** Chạy Cronjob hàng đêm dùng `mysqldump` xuất file SQL lưu sang `/volume1/Backups/`. Synology Hyper Backup đồng bộ file SQL và thư mục `media` lên Cloud (Google Drive/C2).

## 7. Migration Strategy (Incremental)
- Bước 1: Giữ nguyên Production Vercel hiện tại.
- Bước 2: Thiết kế DB Schema và nạp dữ liệu từ `genealogy.json` vào MariaDB.
- Bước 3: Viết API Node.js trả về chuẩn JSON cũ.
- Bước 4: Đổi hàm `fetch('data/genealogy.json')` trên Frontend thành `fetch('https://api.domain.com/people')`.
- Bước 5: Tháo dỡ file JSON tĩnh.
