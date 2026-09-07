# PROJECT ARCHITECTURE

## 1. Top-Level Topology

```text
[ Browser / Client ]
        │
        ├── (Frontend Route)
        │       ↓
        │   [ VERCEL EDGE NETWORK ]
        │       - Phục vụ file tĩnh: Public Web (index.html, JS, CSS) & Admin Web (/admin).
        │       - Trách nhiệm: UI Rendering, Routing, State Management (chỉ runtime).
        │       - KHÔNG lưu trữ dữ liệu nguồn.
        │
        └── (API Route)
                ↓
            [ CLOUDFLARE TUNNEL ]
                ↓
            [ SYNOLOGY NAS (Origin) ]
                ├── [ NODE.JS API SERVER (Port 3000) ]
                │       - Phục vụ qua route `/api/*` và `/assets/images/*`.
                │       - Trách nhiệm: Business Logic, DB Queries, Media Serving, Security boundary.
                │
                ├── [ NAS FILESYSTEM ]
                │       - Đường dẫn: `/volume1/web/family-api/assets/images/`
                │       - Trách nhiệm: Lưu trữ Image/Media Binaries.
                │       - Chỉ truy cập thông qua API Node.js.
                │
                └── [ MARIADB 10 (Port 3306) ]
                        - Trách nhiệm: Lưu trữ Entity (People, Stories, Events), Graph Edges, Media Metadata.
```

## 2. Responsibilities Boundary

- **Frontend Responsibility:** Trình bày dữ liệu trực quan dựa trên Design System (Visual Language V1). Không chứa dữ liệu cứng (hardcoded data). Xử lý UX/UI transition.
- **Admin Responsibility:** (Control Room). Là giao diện CRUD và Graph Linking cho Ban Biên Tập. Gọi trực tiếp API.
- **API Responsibility:** Cầu nối duy nhất giữa Client và Database/Filesystem. Trả dữ liệu JSON sạch. Thực thi quyền truy cập.
- **Database Responsibility:** (MariaDB). Đảm bảo toàn vẹn dữ liệu quan hệ (Relational Integrity). Lưu trữ Entity ID và Edges.
- **NAS Filesystem Responsibility:** Lưu file vật lý nặng (Ảnh, PDF).
- **Deployment Responsibility:** (Git/GitHub/Vercel). Vercel tự động build Public/Admin web từ nhánh `main`. Mã nguồn Node.js/DB Schema được push thủ công lên NAS (thông qua ssh/rsync).

## 3. Media Architecture
- Binary Files nằm ở NAS (không Base64 trong DB).
- `media` table trong MariaDB giữ metadata (`id`, `kind`, `mimeType`, `file` path, `provenance`).
- `person_media` table hoặc `edges` định nghĩa liên kết (Image <-> Person/Story).
- API `/api/media.json` tự động map relative path thành absolute URL (`https://api.giatoctrantrongthu.com/assets/...`) khi trả về frontend.
