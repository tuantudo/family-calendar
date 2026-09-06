# NAS RUNTIME READINESS V1

## 1. Mục đích
Tài liệu này kiểm kê và đánh giá sự sẵn sàng của hạ tầng NAS Synology DS223j để triển khai kiến trúc Application/Data Origin (Hybrid Vercel). Mọi thông tin được thu thập qua read-only audit.

## 2. Resource Baseline
- **Platform:** Synology DSM 7.3.2 (AArch64)
- **Total RAM:** 968 MB (~1GB)
- **Used RAM (Idle Baseline):** 487 MB
- **Available RAM:** ~235 MB (Free) + 345 MB (Buff/Cache) -> Headroom thực tế: ~300-400 MB.
- **CPU Load (Idle):** ~1-2%
- **Swap:** Đang sử dụng 649 MB (Dấu hiệu cho thấy RAM 1GB thường xuyên phải swap).
- **Disk:** /volume1 còn trống 2.6TB.

## 3. Current Runtime Inventory
- **Node.js:** Present (`Node.js_v20` package installed). Không nằm trong default PATH của user root.
- **Python:** Present (Python 3.8.15 built-in).
- **MariaDB:** Present (`MariaDB10`). Tiêu thụ ~13MB RAM (rất tối ưu khi idle).
- **WebStation (Nginx):** Present. Tiêu thụ ~150MB RAM.
- **Process Supervisor:** `systemd` (version 219) có sẵn trên DSM 7.
- **Git:** Missing (Command not found).

## 4. Capability Matrix
| Capability | Requirement | Status | Note |
|---|---|---|---|
| Node.js Runtime | REQUIRED NOW | PRESENT | Cần setup đường dẫn tuyệt đối hoặc symlink. |
| MariaDB Engine | REQUIRED NOW | PRESENT | Rất nhẹ, phù hợp với RAM budget hiện tại. |
| Process Manager | REQUIRED NOW | PRESENT | `systemd` có sẵn, đủ khả năng daemonize Node.js app. |
| Web Server (Nginx) | REQUIRED NOW | PRESENT | WebStation đủ để làm Reverse Proxy và stream media. |
| Python (Migration) | REQUIRED LATER | PRESENT | Python 3.8.15 đủ để viết script chuyển đổi JSON sang SQL. |
| Git | OPTIONAL | MISSING | Cần thiết nếu muốn tự động hóa deployment (pull từ GitHub trực tiếp trên NAS). |

## 5. Security Readiness
- **Private:** MariaDB an toàn (không expose). SSH an toàn (chỉ nội bộ/Tailscale).
- **Public:** WebStation sẵn sàng mở port 443 (HTTPS) với chứng chỉ (Certificate) tích hợp của DSM để hứng request.

## 6. Backup Readiness
- Khả năng cài đặt `Hyper Backup` (hoặc đang có sẵn) để đẩy file dump SQL và thư mục Media lên Off-site Storage (Cloud). Chức năng này thuộc cấp độ Native của Synology nên tương thích 100%.

## 7. Network Readiness
- **LAN IP:** 192.168.0.103
- Khả năng tạo Reverse Proxy: WebStation có GUI tích hợp để map `https://api.domain.com` -> `localhost:3000` (Node.js).

## 8. Resource Risk
**RESOURCE CONSTRAINT (Cảnh báo Đỏ):**
- RAM khả dụng thực tế chỉ còn khoảng 300-400MB trước khi bị ép vào Swap. Nếu Node.js App bị memory leak, NAS sẽ treo.

## 9. Installation Gap List
### A. KHÔNG CẦN CÀI
- Docker / Container Manager (Kiến trúc đã by-pass).
- PM2 (Bởi vì `systemd` đã có sẵn và chạy native ở level OS, không tốn thêm RAM như PM2).
- Elasticsearch (Vượt quá RAM).
- Redis (Chưa cần thiết, có thể dùng memory cache trong Node.js giới hạn dung lượng).

### B. CÓ THỂ CẦN CÀI SAU
- **Git (SynoCommunity Git):**
  - *Why:* Để developer pull code thẳng từ GitHub xuống NAS thay vì copy file thủ công.
  - *RAM impact:* 0MB (chỉ chạy khi pull).
  - *Security impact:* Cần setup Deploy Key.
  - *Alternative:* Dùng rsync hoặc FTP copy code từ máy dev sang NAS.

### C. CẦN OWNER QUYẾT ĐỊNH
- **Cấu hình Swap / Tuning MariaDB:** Cần quyết định giới hạn cứng (hard limit) `innodb_buffer_pool_size` của MariaDB xuống mức an toàn (~64MB) để tránh OS kill process khi cạn RAM.
