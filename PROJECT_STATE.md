# PROJECT STATE

## AGENT HANDOFF

Chào mừng Agent mới. Đây là **Project Memory** cập nhật nhất. BẮT BUỘC ĐỌC KỸ TRƯỚC KHI BẮT ĐẦU.

1. **Tôi đang đứng ở đâu?**
   Bạn đang ở repository `family-calendar`, dự án "Gia Tộc Trần Trọng Thu". Dự án vừa trải qua đợt migration lớn từ tĩnh (static JSON) sang động (API + MariaDB).

2. **Product này là gì?**
   Đây là hệ thống xuất bản di sản & ký ức gia tộc. Bao gồm: Public Web (cho gia đình xem), Admin Control Room (cho Ban Biên Tập quản lý dữ liệu), API (nối giữa Web và DB).

3. **Architecture hiện tại là gì?**
   - **Frontend:** Single Page Application tĩnh, host trên Vercel.
   - **Tunnel:** Cloudflare Tunnel bảo mật kết nối từ Public Domain về NAS.
   - **Backend (API):** Node.js Express server chạy trên Synology NAS (port 3000).
   - **Database:** MariaDB 10 chạy trên NAS, lưu relational data và metadata.
   - **Media:** File binary lưu trực tiếp trên NAS filesystem, API serve tĩnh qua `/assets/images/`. Không lưu binary vào DB.

4. **Source of truth nằm ở đâu?**
   - **Code/Schema:** Git repository này.
   - **Data (Runtime):** MariaDB trên NAS.
   - **Media:** Filesystem NAS `/volume1/web/family-api/assets/images`.
   - **Deployment/DNS/Vercel/CF:** Không can thiệp trừ khi được yêu cầu.

5. **Những gì đã hoàn thành?**
   - Public Web đã lấy dữ liệu động từ API/MariaDB (Gia phả, Mạch, Media).
   - Module Media đã hoàn tất migration (203 ảnh).
   - Admin Control Room: Đã hoàn tất slice đầu tiên là `Events` (đã có CRUD, Publish lifecycle, và nối với `People`).

6. **Những gì tuyệt đối không được phá?**
   - Không phá vỡ kiến trúc (Vercel -> CF Tunnel -> Node API -> MariaDB).
   - Không upscale/enhance media nếu không có yêu cầu.
   - Không được quay lại dùng mockData.js hay JSON tĩnh làm data source of truth.
   - Không làm mất Visual Language V1 (Documentary Intimacy / Archival Restraint).

7. **Đang có blocker nào?**
   - Không có blocker kỹ thuật.

8. **Mission gần nhất là gì?**
   - Migration `Events` module sang MariaDB cho Admin UI.
   - Current commit: `d95a77f` (vừa fix alias route `#/eventsgiat` cho module Events).

9. **Trước khi sửa code phải đọc tài liệu nào?**
   - Đọc các file `PROJECT_*.md` ở root.
   - Khi cần thiết kế: Đọc `Domain Model V1.1`, `Visual Language V1`, `Editorial/Admin Model V1` trong thư mục `docs/`.

10. **Khi nào phải hỏi Owner thay vì tự quyết?**
    - Thay đổi DNS, Vercel, Cloudflare.
    - Chạy các câu lệnh phá hủy (DROP TABLE, xóa file trên NAS).
    - Thay đổi Visual Architecture (UI/UX paradigm) hoặc Data Modeling (Domain Model).

---

## CURRENT PROJECT STATE

- **Project identity:** Hệ thống di sản Gia tộc Trần Trọng Thu.
- **Product purpose:** Lưu giữ và trình diễn Gia phả, Câu chuyện (Mạch), Tư liệu (Archive), Sự kiện (Events).
- **Current architecture:** Hybrid Edge (Vercel Frontend + Cloudflare Tunnel + NAS Node.js API + NAS MariaDB).
- **Current deployment topology:** `giatoctrantrongthu.com` (Vercel) | `api.giatoctrantrongthu.com` (NAS API via CF Tunnel).
- **Current data ownership:** MariaDB holds all domain entities (People, Stories, Events, Media Metadata). NAS FS holds image binaries.
- **Current production state:** Online, stable.
- **Current Admin state:** Admin UI nằm tại `/admin`. Đã có Events slice hoạt động E2E.
- **Current media state:** 203 media assets reconciled. Binary served statically via NAS API.
- **Current known blockers:** None.
- **Current next action:** Clean up remaining mock data implementations in Admin (People, Stories, Inbox).

### COMPLETED
- Static to Dynamic Migration (JSON -> MariaDB).
- Media Migration (Local assets -> NAS filesystem + MariaDB metadata).
- API deployment via Cloudflare Tunnel.
- UI Layout Rescue (Restored Visual Language V1).
- Admin Control Room: `Events` vertical slice (CRUD, Linking, Publishing status).

### IN PROGRESS
- Admin Control Room (People, Stories, Inbox modules remain to be fully wired up to DB, though API routes for some exist).

### BLOCKED
- N/A

### NOT STARTED
- Inbox / Community submissions module.
- Quality Enhancement of Media (Phase sau).
- Authentication/Authorization phức tạp cho Admin.

### CURRENT COMMITS
- `d95a77f` - fix(admin): add #/eventsgiat alias to events router
- `722c5fa` - feat(admin): build Events vertical slice for Control Room
- `0a6f1e8` - feat(media): deploy image serving + fix API media URLs

### OWNER DECISIONS
- MariaDB là single source of truth cho data runtime.
- Binary media KHÔNG đưa vào MariaDB.
- Frontend không giữ data/state tĩnh.
- Admin UI là Control Room, không phải phân tích dữ liệu. Core UX là Graph Linking.

### NEXT MISSION
- Hoàn thiện Vertical Slice cho module `People` hoặc `Stories` trong Admin Control Room, loại bỏ mock data hoàn toàn.
