# APPLICATION ARCHITECTURE BLUEPRINT V2.1

## 1. Executive Summary
Website Gia Tộc Trần Trọng Thu chuyển mình từ trang web tĩnh sang **Self-hosted Family Knowledge Application**. Kiến trúc mục tiêu (Target Architecture) dựa trên nguyên tắc **Hybrid**: Vercel xử lý Frontend & Edge CDN, trong khi NAS Synology DS223j giữ vai trò "Application/Data Origin" (Lưu trữ lõi và Logic nghiệp vụ). Kiến trúc này hướng tới việc tạo ra một "Graph of Knowledge" (Đồ thị tri thức) thay vì các bảng dữ liệu rời rạc, thiết lập nền tảng cho Interaction Architecture.

## 2. Conceptual Domain Model (The Knowledge Graph)
Dữ liệu không đơn thuần chuyển từ JSON sang SQL. Chúng phản ánh các thực thể (Entities) và vô số liên kết (Relationships).

### Lõi Thực thể (Core Entities)
- **Person:** Con người. (ID, Name, Birth, Death, Origin).
- **Event:** Biến cố/Sự kiện theo mốc thời gian (vd: Di cư, Kết hôn, Giỗ).
- **Story (Mạch):** Ký ức / Câu chuyện truyền khẩu.
- **Archive Artifact:** Hiện vật, Hình ảnh, Thư từ gốc.

### Mạng lưới Quan hệ (Cardinality & Graph)
- `Person` ↔ `Person`: M:N (Self-referencing Graph: Cha-Con, Vợ-Chồng). 
  - *Lưu ý:* Family/Branch/Generation là các **Derived Structures** (cấu trúc phát sinh) từ mạng lưới Cha-Con, không phải là Entity bị cô lập cứng.
- `Person` ↔ `Story`: M:N. Một bài viết (Story) nhắc đến (Mentions) nhiều Người. Một Người có thể xuất hiện trong nhiều Bài viết.
- `Person` ↔ `Archive Artifact`: M:N. Một bức ảnh tập thể chứa nhiều Người (Tagged). Một Người sở hữu nhiều Hình ảnh.
- `Event` ↔ `Person`: M:N. Sự kiện liên quan đến nhiều người.

*Graph of Knowledge sinh ra từ đây. Người dùng đang xem Person A, click sang Bức ảnh C (Archive), phát hiện thêm Person D trong ảnh, và click sang Person D.*

## 3. Conceptual API Boundaries
API được thiết kế bao bọc (wrap) Domain Model, không phụ thuộc vào thiết kế UI màn hình.

- **Resource APIs:**
  - `GET /api/people/:id` (Thông tin nhân thân cốt lõi)
  - `GET /api/stories/:id` (Nội dung văn bản)
  - `GET /api/artifacts/:id` (Siêu dữ liệu tư liệu)

- **Relationship & Backlink APIs:**
  - `GET /api/people/:id/relationships` (Đồ thị Cha mẹ - Vợ chồng - Con cháu)
  - `GET /api/people/:id/mentions` (Tìm tất cả Stories/Artifacts có nhắc đến người này)
  - `GET /api/events/calendar` (Tổng hợp mốc thời gian vĩ mô)

- **Search API:**
  - `GET /api/search?q={query}` (Tìm kiếm cross-entity: Người, Story, hay Artifact). Hỗ trợ tên tiếng Việt không dấu (Alias searching).

## 4. Media Architecture & Access Control
- **Database (MariaDB):** Chỉ lưu Metadata, Provenance (Nguồn gốc tư liệu), Captions, và Danh sách Tagged Persons.
- **Filesystem (Storage):** NAS lưu trữ các file nhị phân (Binary) chia theo: `original/`, `derivative/`, `thumbnail/`.
- **Media Access Layer (Model B):** Không expose trực tiếp thư mục `media/` ra public Nginx. API Node.js sẽ làm Guard (Gác cổng). Node.js kiểm tra quyền (VD: File này là Public, hay Family_Only?), sau khi xác thực, Node bắn Header `X-Accel-Redirect` (Sendfile) lại cho Nginx. Nginx (WebStation) sẽ stream file tĩnh ra ngoài với tốc độ cao nhất (By-pass Node RAM).

## 5. Security & Public Boundary
- **Vùng Internet (Public):** Giao tiếp chỉ qua Vercel Frontend (Trang hiển thị), và cổng `443 (HTTPS)` của NAS WebStation.
- **Vùng Private (NAS Core):** Database MariaDB (chỉ lắng nghe localhost). Dữ liệu Media Gốc (NAS File System). Toàn bộ Management UI của DSM.

## 6. Backup & Recovery Plan (Disaster Scenarios)
RAID không phải là Backup.
- **Chiến lược:** 
  1. `Database Backup:` Node.js app hoặc NAS Cronjob chạy `mysqldump` hàng ngày vào thư mục `/backups/`.
  2. `Off-site Sync:` Synology Hyper Backup đồng bộ cả thư mục `/media/` và `/backups/` lên Cloud (Google Drive / Synology C2).
- **Disaster Recovery (Khi NAS chết hoàn toàn):**
  - Data an toàn trên Cloud. Vercel tiếp tục báo `Archive Offline` tới người dùng. 
  - Mua NAS mới hoặc dựng tạm VPS, pull Database Backup (RPO ~ 24 giờ), tải lại Media folder, cấp SSL mới. Cập nhật IP trên Vercel. Khôi phục hoàn toàn. (RTO ~ 4-8 giờ).

## 7. Migration Strategy (Tiệm tiến)
Chuyển đổi từng bước, đảm bảo Production chạy liên tục:
1. Giữ nguyên Vercel Static.
2. Dựng Schema MariaDB và viết Python Script đẩy dữ liệu từ `genealogy.json` vào NAS (Test local).
3. Viết Node.js API phục vụ các Endpoints gốc.
4. Cập nhật Vercel Frontend (trong bản release mới) thay đổi điểm gọi Fetch. Xác minh độ ổn định.
5. Triển khai API Relationship & Discovery (Phase 2 thực thụ).
