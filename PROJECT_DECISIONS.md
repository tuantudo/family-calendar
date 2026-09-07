# PROJECT DECISION REGISTER

| ID | Decision | Status | Reason / Context | Impact |
|---|---|---|---|---|
| D01 | MariaDB là Database Source of Truth | APPROVED | SQLite ban đầu gặp lỗi emoji utf8, đồng thời MariaDB có sẵn trên NAS, chịu tải tốt hơn cho graph relational queries. | Mọi CRUD phải đi vào MariaDB (UTF8MB4). Không dùng LocalStorage/JSON làm DB. |
| D02 | Binary media không lưu trong MariaDB | APPROVED | Tránh phình to DB, tận dụng NAS làm storage lý tưởng. DB chỉ giữ metadata và relative path. | API phải có endpoint serve static files (`express.static`). |
| D03 | Cloudflare Tunnel thay vì mở port NAS | APPROVED | Tránh expose IP thật của mạng nội bộ/NAS ra public internet. Tăng tính bảo mật. | NAS cần cài đặt và chạy connector `cloudflared`. |
| D04 | Admin Web là Control Room (Graph Linking Core) | APPROVED | Admin không phải là dashboard thống kê (Analytics) mà là nơi Ban Biên Tập thao tác nối các Entity (Người - Sự Kiện - Mạch). | Trọng tâm thiết kế UI Admin xoay quanh Typeahead và Edge linking. |
| D05 | Không cạnh tranh tính năng GEDCOM với FamilySearch | APPROVED | Sản phẩm tập trung vào tính tự sự (Narrative) và Di sản, không nhằm tạo một bộ máy dò tìm gia phả phức tạp. | Bỏ qua các module import/export GEDCOM phức tạp. |
| D06 | Maintain "Documentary Intimacy" Visual Language | APPROVED | Tôn trọng giá trị thời gian, không làm giao diện SaaS hiện đại bóng bẩy. | Giữ nguyên font EB Garamond, hairline borders, UI phẳng. |
| D07 | Frontend không giữ Ownership dữ liệu | APPROVED | Để đạt được "Dynamic Web", mọi dữ liệu (người, mạch, media refs, calendar) phải gọi từ API. | Xóa thư mục `data/` và `calendars/` khỏi source code frontend. |

