# Access Control & Data Visibility Audit V1

## 1. Executive Summary

- **Thực trạng (FACT):** Việc Public Web không hiển thị dữ liệu không phải là một "security boundary" được cấu hình chủ đích. Nguyên nhân trực tiếp là do API Backend đang chết (lỗi kết nối MariaDB chưa được giải quyết từ incident trước) và sự bất đồng bộ trong kiến trúc đọc/ghi giữa Admin API và Public API.
- **Đánh giá Security:** Hiện tại hệ thống (Backend API) **hoàn toàn không có Authentication lẫn Authorization**. Bất kỳ ai cũng có thể gọi `POST` hoặc `DELETE` để sửa/xoá cây gia phả.
- **Mục tiêu:** Đề xuất một mô hình Access Control (V1) kết hợp Role-Based (RBAC) và Attribute-Based (ABAC) để bảo vệ API và phân quyền hiển thị dữ liệu (Data Visibility).

## 2. Current E2E Data Flow

Luồng dữ liệu hiện tại:
`Browser` → `Vercel (Static Frontend)` → `GET https://api.giatoctrantrongthu.com/api/genealogy.json` → `Node.js API (NAS)` → `MariaDB`

## 3. Why Public Data Is Currently Missing

Đây là các **FACTS** và **EVIDENCE** đã được xác minh:

1. **API Crashing (Lỗi hạ tầng):** 
   - *Nguyên nhân:* Backend process `node index.js` trên NAS đang bị crash do `ECONNREFUSED 127.0.0.1:3306` (Hệ quả của việc đổi mật khẩu MariaDB chưa hoàn tất).
   - *Evidence:* Gọi `curl https://api.giatoctrantrongthu.com/api/genealogy.json` trả về HTTP 530 (Cloudflare Error 1033).
2. **Data Mismatch - Graph / Families:**
   - *Nguyên nhân:* Admin UI thêm quan hệ qua `POST /api/edges` (ghi vào bảng `edges`). Nhưng Public API (`genealogy.json`) lại chỉ đọc `SELECT * FROM families` và bỏ qua bảng `edges`. Dữ liệu có trong DB nhưng API đọc sai chỗ.
   - *Evidence:* Source code `server/index.js` dòng 245 và 182.
3. **Data Mismatch - Stories / Mạch:**
   - *Nguyên nhân:* Admin UI tạo bài viết qua `POST /api/stories` ghi vào các cột quan hệ (`title`, `author`, `content`). Nhưng Public API (`mach.json`) lại map từ cột `payload` (`r.payload`), vốn đang rỗng (`NULL`).
   - *Evidence:* Source code `server/index.js` dòng 156 và 272.
4. **API Chủ động Filter (Publishing Logic):**
   - *Nguyên nhân:* Mặc định Admin lưu Person với `status = 'DRAFT'`. API `genealogy.json` filter cứng `WHERE status = 'PUBLISHED'`. Nếu Admin chưa click nút "Xuất bản", dữ liệu sẽ không bao giờ ra Public Web.
   - *Evidence:* Source code `server/index.js` dòng 231.

## 4. Current Public API Exposure

Tất cả các endpoint sau đều đang public 100%:
- `GET /api/genealogy.json` (Dump toàn bộ cột `payload` JSON của những người đã PUBLISHED).
- `GET /api/mach.json` (Expose stories, authors, series).
- `GET /api/events` (Expose toàn bộ sự kiện).
- `POST /api/people`, `POST /api/stories`, `POST /api/edges`, `DELETE /api/edges` (Cho phép mọi quyền Ghi/Xoá mà không cần kiểm tra).

## 5. Current Authentication State

- **NONE (KHÔNG TỒN TẠI).**
- Frontend không có form Login/Token.
- Backend không kiểm tra bất kỳ Header, Session, hay JWT nào.

## 6. Current Authorization State

- **NONE.**
- Vì không có Authentication nên không có định danh người dùng. Phân quyền hoàn toàn phụ thuộc vào việc ẩn UI trên Frontend (Security by Obscurity), trong khi Backend API hoàn toàn mở.

## 7. Current Data Visibility State

- Việc ẩn/hiện dữ liệu hiện tại chỉ dựa trên một cờ duy nhất là `status` (`PUBLISHED` hoặc `DRAFT`).
- Khi dữ liệu đã `PUBLISHED`, nó hiển thị với mọi người dùng ẩn danh trên toàn cầu (kể cả các trường nhạy cảm nếu có nằm trong `payload`).

## 8. Proposed Access Model V1

Mô hình đề xuất kết hợp Identity, Relationship và Resource Visibility:

| Actor | Relationship | Resource | Action | Decision | Visibility |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Public (Guest)** | Không có | Person / Story / Event | Read | Cho phép nếu `visibility = 'PUBLIC'` | Thông tin cơ bản, tiểu sử mở, sự kiện chung. |
| **Member** | Đã đăng nhập | Person / Story / Event | Read | Cho phép nếu `visibility IN ('PUBLIC', 'MEMBER')` | Thông tin gia phả đầy đủ, hình ảnh nội bộ. |
| **Family** | Thuộc cùng 1 nhánh | Person (Trong nhánh) | Read | Cho phép | Thông tin chi tiết, tài liệu gia đình. |
| **Self** | Chính là User đó | Hồ sơ cá nhân (Own Profile) | Read / Update | Cho phép | Thông tin tuyệt mật (SĐT, địa chỉ, y tế). |
| **Admin** | Ban Biên Tập | Tất cả | CRUD | Cho phép | Toàn quyền kiểm soát, nhưng log lại Audit Trail. |

## 9. Public / Member / Family / Self / Admin Matrix

| Loại Dữ liệu (Resource) | Public | Member | Family | Self | Admin |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Danh tính cơ bản (Tên, Năm Sinh) | Đọc | Đọc | Đọc | Đọc | Đọc / Ghi |
| Quan hệ gia phả (Vợ/Chồng/Con) | Đọc | Đọc | Đọc | Đọc | Đọc / Ghi |
| Liên hệ riêng tư (SĐT, Địa chỉ) | ❌ Chặn | ❌ Chặn | Đọc | Đọc / Ghi | Đọc / Ghi |
| Bài viết (Story) nội bộ | ❌ Chặn | Đọc | Đọc | Đọc | Đọc / Ghi |
| Bản nháp (Drafts) | ❌ Chặn | ❌ Chặn | ❌ Chặn | Tác giả | Đọc / Ghi |

## 10. Resource Visibility Model

**RECOMMENDATION:**
- Backend API KHÔNG ĐƯỢC dump toàn bộ JSON `payload` từ DB xuống Frontend.
- Trước khi response, API phải chạy qua một hàm `sanitizeData(payload, currentUserRole)`.
- Các trường nhạy cảm như `payload.contact`, `payload.private_notes` phải bị xoá khỏi JSON object nếu user là Guest.

## 11. Required Architecture Changes

1. **Authentication Layer:** Tích hợp một hệ thống Identity (ví dụ: NextAuth, Firebase, hoặc custom JWT) để cấp Session/Token.
2. **API Protection:** Áp dụng Middleware kiểm tra Auth Token cho mọi endpoint `POST`, `PUT`, `DELETE`.
3. **Data Resolvers:** Sửa lại các hàm query trong Backend (`server/index.js`) để đồng nhất logic giữa Admin (ghi) và Public (đọc) (nhất là bảng `edges` và `stories`).
4. **Sanitization Logic:** Thiết lập bộ lọc JSON Payload ở cấp Backend.

## 12. Domain Model Impact

- Domain Model V1.1 (JSON schema) hiện tại là đủ nền tảng.
- *Đề xuất thêm:*
  - Thực thể `Person` cần thêm field `identity_id` để link tới Account đăng nhập.
  - Các Object lớn cần thêm thuộc tính `visibility: 'PUBLIC' | 'MEMBER' | 'FAMILY' | 'PRIVATE'`.

## 13. Security Risks

- **CRITICAL RISK:** Hiện tại bất kỳ ai biết URL `https://api.giatoctrantrongthu.com/api/people` đều có thể gửi `POST` request để xoá, sửa, hoặc thêm dữ liệu rác vào Database gia tộc.
- **CRITICAL RISK:** Lộ dữ liệu cấu trúc (Data Exposure) do API trả về toàn bộ RAW JSON Payload.

## 14. Recommended Implementation Order

1. **(Emergency) Hardcode Auth Headers:** Tạm thời đặt API Key tĩnh (Static Token) trên các endpoint `POST/DELETE` để chặn tấn công từ bên ngoài trong lúc phát triển.
2. **Fix Read/Write Desync:** Sửa lại logic đọc `families` và `stories` để Public Web có thể lấy đúng dữ liệu Admin đã lưu.
3. **Khôi phục Database Connection:** Hoàn thành việc Rotate MariaDB Password (từ mission trước) để API sống lại.
4. **Xây dựng hệ thống Đăng nhập (Auth).**
5. **Thêm Field-level Visibility Filtering.**

## 15. OPEN DECISIONS FOR OWNER

- **Chiến lược Cấp Account:** Anh muốn mọi người tự đăng ký (Register) rồi chờ Admin duyệt, hay Admin sẽ tự cấp tài khoản (Invite-only) cho từng người trong gia tộc?
- **Mức độ Public mặc định:** Anh muốn mặc định cây gia phả (Tên, quan hệ) là ai trên mạng cũng xem được, hay bắt buộc phải Đăng nhập mới nhìn thấy cây?
