# NAS INVENTORY & RESOURCE BUDGET (V1.1)

## 1. System Overview
- **Platform:** Synology DSM
- **OS Version:** DSM 7.3.2-86009 (AArch64)
- **Hardware Model:** Synology DS223j (Realtek RTD1619B, ARMv8)
- **RAM:** 1GB (MemTotal: 991,740 kB) - *Constraint Cốt lõi*
- **Storage:** 7.0T total, 2.6T available trên `/volume1`

## 2. Platform Capabilities & Packages
- **Containerization:** `NOT INSTALLED` (DS223j không hỗ trợ Docker/Container Manager do giới hạn RAM).
- **Web/Proxy:** WebStation (Nginx/Apache proxy manager) - Có sẵn.
- **Runtime JS:** Node.js v20 - Có sẵn.
- **Runtime Scripting:** Python 3.8.15 - Có sẵn.
- **Database:** MariaDB 10 - Có sẵn.

## 3. Storage Boundary & Permissions
- **Web Root:** `/volume1/web/`
- **Application Directory (Dự kiến):** `/volume1/web/family-genealogy/`
  - `app/` (Code API Node.js)
  - `media/` (Thư mục gốc chứa ảnh/tư liệu, chia theo original/thumbnail/derivative)
  - `backups/` (Local dump SQL trước khi sync Cloud)
- **Permissions:** Giới hạn cho group `http` và user chạy service. Không cấp quyền read/write global.

## 4. Resource Budget (1GB RAM Constraint)
Dự án không được giả định tài nguyên vô hạn. Cần áp đặt ngân sách RAM cứng:
- **DSM System & Base Services:** ~400MB
- **MariaDB 10:** Giới hạn buffer pool size tối đa ~128MB.
- **WebStation (Nginx):** ~50MB.
- **Node.js API Process (PM2):** Giới hạn `--max-old-space-size=256` (~256MB).
- **Dư địa (Headroom):** ~150MB cho OS cache và File I/O.
*Khuyến nghị: Không xử lý nén/resize ảnh dung lượng lớn (>10MB) trực tiếp bằng Node.js trên NAS khi có request, phải pre-process offline hoặc dùng batch job chạy nền với limit.*
