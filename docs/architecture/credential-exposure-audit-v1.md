# CREDENTIAL EXPOSURE AUDIT V1

**Date:** 2026-09-08
**Context:** AIOS/Antigravity CLI Transcript Leak Assessment

## 1. Mức độ & Phạm vi rò rỉ (Exposure Classification)

### 1.1 Cloudflare API Token (Email Routing)
- **Hệ thống bị ảnh hưởng:** Cloudflare API (Scope: Email Routing, Zone Settings).
- **Phân loại:** **COMPROMISED**.
- **Nguyên nhân:** Agent đã truy xuất dữ liệu từ Bitwarden thông qua MCP server (`call_mcp_tool` với `bitwarden:list`), và output của MCP server tự động bị lưu vào `transcript.jsonl` dưới dạng plaintext. Sau đó token tiếp tục được inject vào terminal command (`export CF_API_TOKEN="..."`) nên đã xuất hiện trong command history/log.
- **Vị trí evidence:** File `transcript.jsonl` & `transcript_full.jsonl` của Antigravity CLI.
- **Trạng thái Rotation:** **BLOCKED**. Antigravity CLI chưa có tính năng secret injection an toàn, nên việc tự động gọi API Cloudflare để Roll Token sẽ tiếp tục làm lộ token mới. Đang chờ Owner thao tác thủ công.

### 1.2 MariaDB Password
- **Hệ thống bị ảnh hưởng:** MariaDB (Production Database trên NAS).
- **Phân loại:** **POTENTIALLY COMPROMISED** (Được coi là COMPROMISED trong phạm vi audit).
- **Nguyên nhân:** Agent thực thi lệnh `ssh tuantq@nas "mysql -u tuantq -p... family_archive -e 'DESCRIBE people;'"` để lấy schema của DB. Cú pháp `-p` đính kèm password trực tiếp đã bị hệ thống Antigravity log vào `transcript.jsonl` thông qua argument `CommandLine` của công cụ `run_command`.
- **Vị trí evidence:** File `transcript.jsonl` (Tool Call argument).
- **Trạng thái Rotation:** **BLOCKED**. Do NAS đang offline và Antigravity thiếu an toàn khi inject secret qua terminal, thao tác đổi password không thể thực hiện bởi agent.

## 2. Kết quả kiểm tra Git Repository (Secret Scan)
- **Trạng thái:** **CLEAN**.
- **Evidence:** Quá trình quét toàn bộ tracked và untracked files trong project (không tính thư mục ẩn `.git`, `node_modules` và file phân tích rác) không phát hiện chuỗi token Cloudflare hay mật khẩu MariaDB. Credentials không bị hardcode trong source code (chẳng hạn `server/index.js` đã dùng process.env để lấy DB credential).

## 3. Kiến trúc Secret-Handling của AIOS (Architectural Findings)
Qua audit, xác định một lỗ hổng nghiêm trọng (BLOCKER) trong kiến trúc bảo mật của AIOS (Antigravity CLI):
- **Tool Arguments & MCP Outputs:** Mọi tham số đưa vào `run_command` (CommandLine, Cwd) và toàn bộ output nhận về từ MCP tools (ví dụ Bitwarden SDK) đều được Antigravity ghi lại đầy đủ vào `transcript.jsonl` dưới định dạng plaintext.
- **Thiếu cơ chế Injection An toàn:** Agent không có phương thức native nào (ví dụ tham số `Env` ẩn, secret references, file descriptor redirection) để truyền trực tiếp secret từ Bitwarden sang process của `run_command` hoặc HTTP client mà không qua mặt agent's working memory / LLM context.
- **Đánh giá:** Không thể thực hiện các quy trình quay vòng (rotation) hoặc tự động thiết lập (automation setup) yêu cầu secret bằng Antigravity V1 nếu không chấp nhận việc secret bị ghi vào transcript.

## 4. Hành động yêu cầu từ Owner (Owner Actions)
1. **Cloudflare Token:** Xóa và tạo Token mới (Roll) trên Cloudflare Dashboard cho cấu hình Email Routing.
2. **MariaDB:** Đổi password cho user `tuantq` trên MariaDB (NAS) ngay khi NAS online trở lại.
3. Cập nhật các bản sao lưu (Bitwarden / .env files trên NAS) với mật khẩu mới.
4. Xóa/Rotate file `transcript.jsonl` và `transcript_full.jsonl` của session hiện tại để xoá dấu vết plaintext khỏi máy tính local.

