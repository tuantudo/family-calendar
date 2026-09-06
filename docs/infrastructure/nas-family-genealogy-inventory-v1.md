# NAS INVENTORY: FAMILY GENEALOGY (V1)

## 1. System Overview
- **Platform:** Synology DSM
- **OS Version:** DSM 7.3.2-86009 (AArch64)
- **Hardware Model:** Synology DS223j (Realtek RTD1619B, ARMv8)
- **RAM:** 1GB (MemTotal: 991,740 kB)
- **Storage:** 7.0T total, 2.6T available on `/volume1`

## 2. Platform Capabilities & Packages
- **Docker / Container Manager:** `NOT INSTALLED` (DS223j officially lacks native Docker support due to 1GB RAM and ARM architecture).
- **WebStation:** Installed (Nginx/Apache proxy manager).
- **Node.js:** Installed (`Node.js_v20`).
- **PHP:** Installed (`PHP8.2`).
- **Python:** Built-in (`Python 3.8.15`) and `Python2` package.
- **Database:** Installed (`MariaDB10`, `phpMyAdmin`).

## 3. Storage & Directory Convention
- **Web Root:** `/volume1/web/` (Managed by `http:http` group).
- **Proposed Project Location:** `/volume1/web/family-genealogy/`
  - `/volume1/web/family-genealogy/api/` (API Server codebase)
  - `/volume1/web/family-genealogy/media/` (Original Media & Artifacts)
  - `/volume1/web/family-genealogy/thumbnails/` (Derivative Images)

## 4. Security Boundary
- **Internal Services:** MariaDB 10 must remain strictly bound to `localhost` (127.0.0.1) or LAN. Do not expose port 3306.
- **Public Services:** Node.js API should run internally and be reverse-proxied via WebStation with SSL.
