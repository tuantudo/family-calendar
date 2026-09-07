# EMAIL INFRASTRUCTURE V1

**Date:** 2026-09-08
**Domain:** `giatoctrantrongthu.com`
**Status:** BLOCKED / PENDING OWNER ACTION

## 1. Purpose
Thiết lập hệ thống nhận email (Inbound Email Routing) cho domain chính của gia tộc, tạo ra các địa chỉ email chuyên nghiệp để giao tiếp và nhận thông tin từ các thành viên.

## 2. Current Architecture
- **Identity Layer:** `giatoctrantrongthu.com`
- **Email Routing Layer:** Cloudflare Email Routing (Miễn phí, tích hợp sẵn trên DNS).
- **Destination Mailbox:** Địa chỉ email cá nhân (Gmail/Outlook) của Owner (đóng vai trò Quản trị viên).

Trong kiến trúc V1, không có Mail Server độc lập (ví dụ không dùng NAS MailPlus hay Google Workspace). Các email address không có hộp thư (inbox) riêng biệt mà hoạt động dưới dạng rules chuyển tiếp (forwarding).

## 3. Active Email Addresses (V1)
Dự kiến thiết lập các địa chỉ sau:
- `admin@giatoctrantrongthu.com`: Dành cho các thông báo hệ thống, quản trị server, domain, và security.
- `contact@giatoctrantrongthu.com`: Dành cho giao tiếp chung từ thành viên (hỏi đáp, đóng góp).
- `family@giatoctrantrongthu.com`: Dành cho các cập nhật, thông báo sự kiện, hoặc liên lạc nội bộ gia tộc.

## 4. DNS Dependencies
Để Cloudflare Email Routing hoạt động, hệ thống yêu cầu các DNS records sau:
- **MX Records:** Trỏ về các server nhận mail của Cloudflare (ví dụ: `route1.mx.cloudflare.net`, `route2.mx.cloudflare.net`, `route3.mx.cloudflare.net`).
- **TXT/SPF Record:** `v=spf1 include:_spf.mx.cloudflare.net ~all` để xác thực Cloudflare được quyền xử lý mail.
- **DKIM/DMARC:** Theo hướng dẫn trên Cloudflare Dashboard nếu có.

*Lưu ý: Không thay đổi bất cứ bản ghi A, CNAME, hoặc Cloudflare Tunnel nào hiện đang phục vụ Public Web, API, và Admin.*

## 5. Security Considerations
- Email routing không lưu trữ dữ liệu email trên server của Cloudflare. Toàn bộ mail được forward thẳng đến Destination.
- Cần thận trọng để không tạo Catch-all routing (`*@giatoctrantrongthu.com`) nhằm tránh spam/botnet. Chỉ định tuyến rõ ràng các địa chỉ đã tạo.

## 6. Future Possibilities (OUT OF SCOPE cho V1)
- **Email Sending (SMTP):** Khả năng ứng dụng API gửi email tự động (transactional emails).
- **Notification Engine:** Tự động gửi thư nhắc giỗ chạp cho thành viên.
- **Magic Link Auth:** Đăng nhập vào Admin bằng link gửi qua email.
- **Dedicated Inbox:** Thuê Google Workspace/Microsoft 365 để có mailbox độc lập khi nhu cầu tăng.

## 7. Owner Actions Required
Do AI Agent không có quyền truy cập Cloudflare API Token, công việc thiết lập phải được Owner thao tác trên Cloudflare Dashboard:
1. Đăng nhập Cloudflare, chọn domain `giatoctrantrongthu.com`.
2. Truy cập tab **Email** -> **Email Routing**.
3. Bấm **Get Started / Enable Email Routing**.
4. Cấu hình **Destination Email** là email cá nhân của Owner. Cloudflare sẽ gửi một email xác thực. Owner cần check inbox và bấm Verify.
5. Sau khi verified, tạo 3 Routing Rules:
   - Custom address: `admin` -> Forward to: `[Email của Owner]`
   - Custom address: `contact` -> Forward to: `[Email của Owner]`
   - Custom address: `family` -> Forward to: `[Email của Owner]`
6. Cloudflare sẽ tự động cập nhật các bản ghi DNS cần thiết (MX, SPF). Owner chỉ cần bấm "Add records and enable".
