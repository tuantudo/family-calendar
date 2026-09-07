# PROJECT ROADMAP

## DONE
- [x] Thiết lập Visual Language V1 (Documentary Intimacy).
- [x] Định hình kiến trúc Vercel Frontend + NAS API + NAS DB.
- [x] Migration dữ liệu tĩnh (JSON) sang MariaDB (Dynamic Migration).
- [x] Migration hình ảnh/media: Di chuyển files lên NAS, lưu metadata vào DB.
- [x] Public API endpoints (Gia phả, Sự kiện, Media, Mạch).
- [x] Admin Control Room: Vertical Slice cho module `Events` (CRUD, Publish Status, Linking).

## IN PROGRESS
- [ ] Xây dựng Admin Control Room: Đưa các module còn lại (`People`, `Stories`, `Inbox`) vào trạng thái Dynamic (bỏ hoàn toàn mockData.js).

## NEXT
- [ ] Admin: Module `People` (Thêm/Sửa/Xóa Nhân sự, quản lý quan hệ gia đình).
- [ ] Admin: Module `Stories` (Viết bài, tag nhân vật, quản lý media gắn với bài viết).
- [ ] Admin: Graph Linking UI nâng cao (Nối Entity mượt mà hơn).

## LATER
- [ ] Nâng cấp chất lượng hình ảnh (AI Enhancement/Upscale).
- [ ] Module `Inbox`: Nhận đóng góp (Community Submissions) từ người dùng Public Web.
- [ ] Authentication / RBAC: Quản lý phân quyền chi tiết cho Ban Biên Tập (nếu cần thiết).

## DO NOT BUILD / OUT OF SCOPE
- ❌ Import / Export GEDCOM.
- ❌ Cây phả hệ dạng tương tác 3D phức tạp.
- ❌ Analytics Dashboard / Thống kê người truy cập trong Admin.
- ❌ Chat nội bộ.

