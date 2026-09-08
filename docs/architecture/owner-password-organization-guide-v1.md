# AIOS — PASSWORD & SECRET ORGANIZATION GUIDE

Đây là Cẩm nang Tổ chức Secret (Mật khẩu, Token, Key) dành cho Owner trong hệ sinh thái AIOS.

## 1. Trả lời nhanh "Lưu cái này ở đâu?"

1. **Password mới tạo thì lưu ở đâu?** -> **Bitwarden** (Folder tương ứng, Type: Login).
2. **API token mới thì lưu ở đâu?** -> **Bitwarden** (Type: Secure Note hoặc Login; giấu token vào Custom Field dạng Hidden).
3. **SSH key thì sao?** -> **Bitwarden** (Type: Secure Note; đính kèm file hoặc lưu text vào Hidden field).
4. **Recovery code?** -> **Bitwarden** (Notes hoặc file đính kèm trong item gốc).
5. **Database credential?** -> **Bitwarden** (Folder `08 - Databases`).
6. **Cloudflare?** -> **Bitwarden** (Folder `03 - Cloud & Hosting` hoặc `04 - Domains & DNS`).
7. **Vercel?** -> **Bitwarden** (Folder `03 - Cloud & Hosting`).
8. **GitHub?** -> **Bitwarden** (Folder `06 - Development`).
9. **Apple Account?** -> **Bitwarden** (Folder `01 - Identity`).
10. **Gmail?** -> **Bitwarden** (Folder `01 - Identity`).
11. **Nếu một credential phục vụ nhiều project?** -> Lưu ở Folder của loại hạ tầng đó (ví dụ `02 - Infrastructure`), và dùng tính năng gắn Tag/Collections hoặc ghi vào phần Notes: "Dùng cho Project X, Y".
12. **Khi nào tạo folder mới?** -> Khi có một loại hạ tầng/concept hoàn toàn mới không thuộc 10 nhóm chuẩn mực (rất hiếm). Đừng tạo folder cho từng Project nhỏ.
13. **Đặt tên item thế nào?** -> Theo format: `SERVICE — ENVIRONMENT — PURPOSE`. (Ví dụ: `MariaDB — Production — Application DB`).
14. **Khi nào rotate (đổi password)?** -> Khi nghi ngờ lộ lọt (compromised), hoặc tài khoản quá cũ, hoặc nhân sự nghỉ việc. Không cần đổi định kỳ nếu password dài và dùng 2FA.
15. **Khi nào archive?** -> Khi dự án dừng, credential không còn dùng nhưng có thể cần tra cứu lại. Di chuyển vào thư mục `99 - Archive`.
16. **Khi nào delete?** -> Khi hệ thống đích đã bị xoá vĩnh viễn và key không còn bất kỳ giá trị lịch sử nào.
17. **Apple Notes dùng cho gì?** -> Ghi chú kiến trúc, luồng xử lý (procedures), hướng dẫn (how-to). Tuyệt đối **không** dùng để lưu plaintext password.
18. **Nếu lỡ paste password vào chat thì làm gì?** -> Coi như mật khẩu đó đã COMPROMISED. Rotate (đổi) ngay lập tức trên hệ thống đích.
19. **Nếu agent đọc được secret thì làm gì?** -> Tương tự, nếu agent in nó ra transcript/log, secret đó bị đánh dấu POTENTIALLY COMPROMISED. Cần có kế hoạch rotate.
20. **Khi nghi ngờ compromise thì làm gì?** -> Khóa hệ thống (nếu có thể) -> Generate secret mới -> Update Bitwarden -> Update hệ thống -> Update code/env -> Verify.

## 2. Naming Convention (Quy tắc đặt tên)
Hãy luôn dùng:
`[SERVICE] — [ENVIRONMENT] — [PURPOSE]`

- ❌ Sai: `Cloudflare`
- ❌ Sai: `Server`
- ❌ Sai: `Token`
- ✅ Đúng: `Cloudflare — Production — Email Routing API Token`
- ✅ Đúng: `NAS — Production — SSH (tuantq)`
- ✅ Đúng: `GitHub — Personal — Account`

Điều này giúp Agent có thể tìm đúng item bằng API mà không lấy nhầm.

## 3. Bitwarden Target Structure (Cấu trúc thư mục)
- `01 — Identity`
- `02 — Infrastructure`
- `03 — Cloud & Hosting`
- `04 — Domains & DNS`
- `05 — Email`
- `06 — AI & APIs`
- `07 — Development`
- `08 — Databases`
- `09 — Projects`
- `10 — Finance & Services`
- `11 — Recovery`
- `99 — Archive`
