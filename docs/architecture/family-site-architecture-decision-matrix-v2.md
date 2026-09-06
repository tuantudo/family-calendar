# ARCHITECTURE DECISION MATRIX V2

## 1. Database Selection
| Lựa chọn | Khả năng tương thích (DS223j) | Ưu điểm | Nhược điểm | Đánh giá |
|---|---|---|---|---|
| **MariaDB 10** | **Tốt (Native Synology Package)** | Sẵn có, ổn định, tiết kiệm RAM. Quan hệ (Relational) phù hợp lưu phả hệ. | Cần thiết kế bảng cẩn thận cho Graph (Cha-Con-Vợ-Chồng). | **RECOMMENDED**. Giải pháp thực tế nhất trên nền tảng hiện tại. |
| **PostgreSQL** | Yếu (Không có Docker) | Graph query tốt, JSON support mạnh. | Không có native package trên DS223j. Build từ source rất rủi ro. | **REJECTED**. Vượt quá khả năng đáp ứng của NAS hiện tại. |
| **SQLite** | Tốt (Local file) | Không cần service chạy ngầm, file-based dễ backup. | Concurrency kém, không tận dụng được tài nguyên CSDL chuyên dụng. | **BACKUP OPTION**. Dùng nếu MariaDB gặp sự cố. |
| **Neo4j** | Không thể (Cần Docker / Java) | Hoàn hảo cho Genealogy Graph. | RAM 1GB không thể gánh nổi JVM của Neo4j. | **REJECTED**. |

## 2. API Runtime Selection
| Lựa chọn | Khả năng tương thích | Ưu điểm | Nhược điểm | Đánh giá |
|---|---|---|---|---|
| **Node.js v20** | **Tốt (Native Package)** | Async non-blocking, chia sẻ chung ngôn ngữ JS với Frontend, nhẹ. | Cần PM2 để quản lý process. | **RECOMMENDED**. Cân bằng giữa tốc độ code và hiệu năng NAS. |
| **Python 3.8 / FastAPI** | Tốt (Built-in) | Cú pháp gọn, thư viện mạnh. | Phiên bản 3.8 hơi cũ, thiết lập ASGI server trên NAS phức tạp. | **ALTERNATE**. Khả thi nhưng không tối ưu bằng Node.js sẵn có. |
| **PHP 8.2** | Tốt (Native Package + WebStation) | Tích hợp hoàn hảo 100% với WebStation, không cần quản lý process. | Hệ sinh thái cũ, khó viết Real-time API hơn Node.js. | **STRONG ALTERNATE**. Phương án an toàn nhất về vận hành NAS. |

## 3. Deployment Architecture
| Phương án | Trải nghiệm | Cấu hình mạng | Đánh giá |
|---|---|---|---|
| **Option A (Hybrid: Vercel FE + NAS BE)** | Load trang tĩnh siêu nhanh nhờ CDN, truy xuất DB tại nhà. | Cần cấu hình DDNS và HTTPS cho API trên NAS. Mở port 443 cho WebStation. | **RECOMMENDED**. Giảm tải tuyệt đối cho NAS 1GB RAM. |
| **Option B (All-in-NAS)** | Toàn quyền kiểm soát, không phụ thuộc Vercel. | Băng thông upload của nhà mạng cá nhân trở thành điểm nghẽn. NAS quá tải xử lý ảnh tĩnh. | **REJECTED**. NAS DS223j yếu, không nên gánh Frontend assets. |
