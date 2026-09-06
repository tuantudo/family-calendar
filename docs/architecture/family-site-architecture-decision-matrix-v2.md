# ARCHITECTURE DECISION MATRIX V2.1

Bảng quyết định dựa trên các bằng chứng (Evidence) từ phần cứng NAS Synology DS223j hiện tại, và định hướng "Self-hosted Family Knowledge Application".

## 1. Vercel + NAS Integration
| Phương án | Phân tích & Bằng chứng | Đánh giá / Quyết định |
|---|---|---|
| **Option A (Hybrid: Vercel FE + NAS Data Origin)** | **Evidence:** DS223j (1GB RAM) không mạnh về network throughput đồng thời và xử lý asset tĩnh số lượng lớn. Vercel cung cấp Edge CDN miễn phí, chịu tải giao diện hoàn hảo.<br>**Security:** Giảm thiểu surface attack vào NAS.<br>**Resilience:** Khi NAS sập, FE vẫn báo lỗi gracefully. | **PREFERRED**. Kết hợp tốt nhất giữa sức mạnh Cloud và chủ quyền Data cục bộ. |
| **Option B (All-in-NAS)** | NAS phải gánh toàn bộ lượt truy cập tĩnh và động. Phụ thuộc 100% vào băng thông upload của mạng gia đình. | **REJECTED**. Gây quá tải cho NAS J-series. |

## 2. Database Selection
| Lựa chọn | Khảo sát thực tế | Đánh giá / Quyết định |
|---|---|---|
| **MariaDB 10** | **Version:** 10.3 (có sẵn trên DSM 7).<br>**Tính năng:** Hỗ trợ InnoDB (Relational Integrity), Full-Text Search cơ bản.<br>**Bảo trì:** Native package của DSM, tự update tự động, tương thích Hyper Backup natively. | **PREFERRED CURRENT OPTION**. Phù hợp với mô hình dữ liệu quan hệ, dễ vận hành trên NAS hiện tại. |
| **PostgreSQL** | Không có package native chính thức từ Synology cho DSM 7+. Buộc phải cài qua Entware (không an toàn cho Data gốc). | **REJECTED**. Rủi ro bảo trì quá cao. |
| **SQLite** | Local file DB. Cú pháp yếu hơn MariaDB, không hỗ trợ Full-Text Search mạnh bằng MySQL/MariaDB dialects. Backup dễ nhưng dễ dính write-lock (Database locked). | **FALLBACK**. |

## 3. Media Access Model (Public Boundary)
| Lựa chọn | Phân tích Security & Provenance | Đánh giá / Quyết định |
|---|---|---|
| **Model A (Direct WebStation Exposure)** | Expose thẳng thư mục `/volume1/web/media` qua Nginx. Nhanh, nhẹ, không tốn RAM Node.js. Nhưng mất hoàn toàn kiểm soát truy cập (Access Control) trong tương lai. | **REJECTED**. Phá vỡ kiến trúc bảo mật tương lai (Ví dụ: Tư liệu nhạy cảm chỉ cho người trong họ). |
| **Model B (Controlled Media Layer)** | WebStation Nginx nhận request, kiểm tra Access Token qua luồng phụ của Node.js (auth_request) hoặc Node.js trực tiếp parse request, xác thực quyền, rồi dùng `X-Accel-Redirect` đưa Nginx serve file tĩnh. | **PREFERRED**. Đảm bảo cả hai: Kiểm soát bảo mật (tương lai) VÀ Tốc độ (Nginx vẫn là người phục vụ byte thực tế, Node không bị ngốn RAM). |

## 4. Search Architecture
| Lựa chọn | Đánh giá |
|---|---|
| **MariaDB Full-Text Search + Node.js** | Tận dụng bộ chỉ mục FTS của InnoDB (chọn Collation hỗ trợ tiếng Việt cơ bản: `utf8mb4_unicode_ci`). Đủ dùng cho < 100,000 records. Nhẹ tài nguyên. | **PREFERRED**. |
| **Elasticsearch / Meilisearch** | Chạy Java/Rust ngầm. Ngốn >500MB RAM mặc định. | **REJECTED**. Vượt RAM budget. |
