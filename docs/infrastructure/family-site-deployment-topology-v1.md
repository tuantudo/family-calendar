# DEPLOYMENT TOPOLOGY V1

Dựa trên thực tế hạ tầng (NAS Synology DS223j, cấu hình thấp, không Docker) và ưu thế của Vercel (Global CDN, Serverless), kiến trúc kết hợp (Hybrid) là phương án tối ưu nhất.

## 1. Network Topology (Hybrid Model)

```text
INTERNET (Public Users)
   │
   ├── [Vercel Edge Network] ───────────────> (STATIC ASSETS & FRONTEND ROUTING)
   │     - https://giatoctrantrongthu.vercel.app
   │
   └── [Synology NAS Reverse Proxy] ────────> (DYNAMIC API & MEDIA)
         - https://api.giatoctrantrongthu.com (Custom Domain hoặc DDNS Synology)
         │
         ├── [WebStation Proxy]
         │     │
         │     ├── API Layer (Node.js v20 / PM2)
         │     │     └── Đọc/Ghi Database
         │     │
         │     └── Media Storage (`/volume1/web/family-genealogy/media/`)
         │           └── Phân phối ảnh/tư liệu tĩnh qua Nginx
         │
         └── [MariaDB 10] (Isolated, Localhost ONLY)
```

## 2. CI/CD Pipeline (GitHub-driven)

```text
LOCAL WORKSPACE (Developer)
   │
   ├── (Push Frontend Changes) ─────> [GitHub Main] ───> [Vercel CI/CD] ──> PRODUCTION FRONTEND
   │
   └── (Push Backend Changes) ──────> [GitHub Main] ───> [Manual/Script Pull on NAS] ──> PRODUCTION API
```
*Ghi chú: Việc deploy backend API lên NAS DS223j sẽ dùng Bash script pull từ GitHub, vì DS223j không chạy GitHub Actions Runner.*
