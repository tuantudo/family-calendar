# DEPLOYMENT TOPOLOGY V1.1

Kiến trúc triển khai Hybrid (Phân tán Frontend và Backend) được áp dụng nhằm tối ưu hóa tải cho NAS cục bộ và đảm bảo tính sẵn sàng (Availability) cho luồng tương tác cơ bản của người dùng.

## 1. Network Topology (Hybrid Model)

```text
[ PUBLIC BOUNDARY ] 
        │
        ├── (1) VERCEL EDGE NETWORK (Frontend & CDN)
        │       - URL: https://giatoctrantrongthu.vercel.app
        │       - Role: Giao diện tĩnh, Routing, UI State, Static Assets (CSS/JS/Icons).
        │       - Fallback: Trưng bày thông báo "Archive Offline" nếu mất kết nối về NAS.
        │
        └── (2) SYNOLOGY NAS (Self-hosted Application/Data Origin)
                - URL: https://api.giatoctrantrongthu.com (Thông qua DDNS & Reverse Proxy)
                │
 [ PRIVATE BOUNDARY / NAS INTERNAL ]
                │
                ├── WebStation (Nginx Reverse Proxy)
                │    │
                │    ├── NODE.JS APPLICATION LAYER (API Server)
                │    │    - Port: 3000 (Internal)
                │    │    - Role: Xử lý Domain Logic, Media Access Control (ACL).
                │    │
                │    └── MEDIA STORAGE FILESYSTEM
                │         - Path: /volume1/web/family-genealogy/media/
                │         - Access: Chỉ có thể truy xuất thông qua API/Application Layer, không expose trực tiếp.
                │
                └── MARIADB 10 (Database)
                     - Port: 3306 (Bind 127.0.0.1 ONLY)
                     - Role: Relational Data, Search Index.
```

## 2. Failure Scenarios & Resilience

NAS không phải là hệ thống duy nhất bảo đảm availability của toàn bộ website.
- **NAS Failure / Mất điện / Mạng nhà rớt:** Vercel Frontend vẫn sống. Người dùng vẫn truy cập được trang chủ, đọc được UI, nhưng dữ liệu Động (Cây phả hệ chi tiết, Nội dung Mạch) sẽ không load được. Ứng dụng sẽ hiển thị trạng thái *"Kết nối đến Kho Lưu Trữ Dòng Họ đang gián đoạn"* một cách có chủ đích, thay vì sập toàn bộ (White screen).
- **Vercel Failure:** Rất hiếm xảy ra do kiến trúc Global Edge. Nếu xảy ra, toàn bộ giao diện ngừng hoạt động.
- **Database Corruption:** Hệ thống API sẽ tự động kích hoạt Maintenance Mode, trả HTTP 503 cho Frontend để ngăn lỗi lan truyền. Dữ liệu sẽ được phục hồi từ Daily Cloud Backup.
