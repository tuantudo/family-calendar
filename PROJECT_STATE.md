# PROJECT_STATE

**Bối cảnh:** Dự án chuyển đổi trang phả hệ "Gia Tộc Trần Trọng Thu" từ mô hình Static (JSON tĩnh) sang Dynamic (Admin Control Room -> API -> MariaDB/NAS -> Public Web). 
**Tình trạng:** Khung hạ tầng cơ bản (Domain, Vercel, CF Tunnel, NAS MariaDB/Node) đã thông suốt. Bắt đầu giai đoạn chứng minh "True Control Loop" từ Admin.

## AUDIT HIỆN TRẠNG (E2E CONTROL LOOP)

*Ghi chú: E2E PASS nghĩa là Admin có thể thay đổi dữ liệu, ghi vào DB, và Public Web phản ánh đúng dữ liệu đó.*

| Domain | Admin UI | API | DB | Public API | Public UI | E2E Status |
|---|---|---|---|---|---|---|
| Người | YES | YES | YES | YES | YES | FAIL (Lưu mất metadata trong `payload` JSON) |
| Quan hệ | YES | YES | YES | YES | YES | FAIL (Lưu vào bảng `edges` nhưng Public đọc từ `payload/families`) |
| Mạch | YES | YES | YES | YES | YES | FAIL (Lưu mất metadata trong `payload` JSON) |
| Tư liệu | NO | NO | YES | YES | YES | NOT STARTED |
| Hình ảnh | NO | NO | YES | YES | YES | NOT STARTED |
| Sự kiện | YES | YES | YES | YES | YES | PASS |
| Inbox | NO | NO | NO | NO | NO | NOT STARTED |
| Publishing | YES | YES | YES | YES | YES | PARTIAL (Mới hỗ trợ Events) |

## PHÂN TÍCH TỪNG DOMAIN

**1. SỰ KIỆN (EVENTS) - PASS**
- Hoàn thành. E2E hoàn hảo. DB bảng `calendar_events` lưu metadata, API ICS lấy đúng sự kiện có `status = 'PUBLISHED'`.
- Routing `#eventsgiat` đã hoạt động mượt mà.

**2. NGƯỜI & MẠCH (PEOPLE / STORIES) - FAIL (CẦN SỬA)**
- DB đang có 2 phần: cột quan hệ (name, birthYear...) và cột `payload` (chứa toàn bộ metadata cũ dạng JSON).
- Public Web (`/api/genealogy.json`) đang merge 2 thứ lại, nhưng rất phụ thuộc vào `payload`.
- Admin API hiện tại dùng `REPLACE INTO` chỉ ghi đè các cột cơ bản, làm **xoá trắng cột `payload`**. Kết quả là trên Public Web bị mất hết metadata (cha mẹ, vợ chồng, ngày sinh chi tiết, tiểu sử...). 
- Cần sửa API backend để khi Admin save, nó update cả cột dữ liệu lẫn JSON `payload`.

**3. QUAN HỆ (GRAPH) - FAIL (KIẾN TRÚC LỆCH)**
- Admin UI và API đã lưu quan hệ (Tag nhân vật) vào bảng `edges`.
- Nhưng Public API (`genealogy.json`) hoàn toàn không đọc bảng `edges`! Nó vẫn đọc từ bảng `families` và `payload`. Cần đồng bộ luồng đọc/ghi này.

## SECURITY
- **Admin Control Room V1 chưa có Authentication.** Đây là một Public Endpoint được che dấu bằng URL bí mật.

## NEXT ACTION
- Đợi Owner quyết định sửa E2E cho People/Stories trước hay xử lý Media/Inbox.

