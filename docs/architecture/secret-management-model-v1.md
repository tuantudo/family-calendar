# SECRET MANAGEMENT MODEL V1 (PROPOSAL)

## 1. Information Architecture (Target State)
Việc phân chia ranh giới lưu trữ bí mật và kiến thức là tối quan trọng:
- **Bitwarden:** CHỈ dành cho Secret, Credential, Authentication Material (API Key, Mật khẩu, Token, SSH Keys).
- **Apple Notes:** CHỈ dành cho Context, Knowledge, Procedure, Documentation. Tuyệt đối không chứa plaintext secret.
- **GitHub:** Code, cấu trúc, documentation công khai (không secret).

### 1.1 Bitwarden Target Structure
Đề xuất tổ chức thư mục Bitwarden để tránh nhầm lẫn và dễ cấp quyền:
- `01 - Identity & Accounts` (Tài khoản cá nhân, Google, Apple)
- `02 - Infrastructure` (NAS, DSM, SSH, Network)
- `03 - Cloud & Hosting` (Cloudflare, Vercel)
- `04 - Domains & DNS` (Registrar)
- `05 - AI & Agents` (Gemini, OpenAI, MCP Tokens)
- `06 - Development` (GitHub Tokens, NPM)
- `07 - Databases` (MariaDB, PostgreSQL)
- `08 - Email` (SMTP, Forwarding)
- `09 - Projects` (Gia Tộc Trần Trọng Thu)
- `10 - Recovery & Emergency`

**Naming Convention:** `<SERVICE> — <ENVIRONMENT> — <PURPOSE>`
Ví dụ: `Cloudflare — Production — API Token (Email Routing)`

### 1.2 Apple Notes Target Structure
- `00 — START HERE`
- `01 — OPERATIONS`
- `02 — INFRASTRUCTURE`
- `03 — PROJECTS`
- `04 — ARCHITECTURE`
- `05 — PROCEDURES`
- `06 — RECOVERY`
- `99 — ARCHIVE`
*Khuyến nghị dùng Tag (`#cloudflare`, `#infra`) để cross-reference.*

## 2. Agent Secret-Handling Architecture Blocker
- **Current State:** AIOS (Antigravity CLI) ghi toàn bộ `CommandLine`, `Cwd`, `Tool Arguments`, và Output của các MCP Tools vào file `transcript.jsonl` và `transcript_full.jsonl`. 
- **Lỗ hổng:** Không có cơ chế *Opaque Secret* (biến môi trường ẩn) để truyền từ Bitwarden sang process của shell/agent.
- **Hệ quả:** Bất cứ thao tác nào sử dụng CLI flag chứa secret (`curl -H "Authorization: ..."`, `mysql -p...`, `export TOKEN=...`) đều sẽ bị lưu plaintext vào ổ cứng (log). 
- **Giải pháp yêu cầu:** Antigravity cần một native tool (ví dụ: `inject_secret_to_env` ẩn) hoặc MCP server cần hỗ trợ transparent proxy request không trả secret về agent.

## 3. Historical Log Retention Policy
- Các file `transcript*.jsonl` chứa secret lộ lọt cần được xác định và xoá/quarantine thủ công bởi Owner.
- Mặc định không nên xoá toàn bộ log vì mất context forensic. 
- Chỉ purge cụ thể file có UUID chứa secret theo danh sách từ đợt Audit V1.
