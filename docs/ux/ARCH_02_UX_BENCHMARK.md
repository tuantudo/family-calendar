# CÂY GIA PHẢ — UX/UI BENCHMARK & FORENSIC AUDIT (ARCH_02)

## 1. Vấn Đề Thực Tế Của UI Hiện Tại (Current UI Forensic)
1. **Lịch Tháng (Calendar Month View)**:
   - Cột Thứ Bảy (Saturday) ở mép phải có xu hướng bị clipping hoặc tràn khung trên màn hình nhỏ nếu không xử lý min-width.
   - Khi một ngày có nhiều sự kiện (> 3 sự kiện), chỉ hiển thị preview ngắn và nút `+N sự kiện` nhỏ khiến thông tin bị nén, người dùng không nắm bắt được toàn bộ bối cảnh nếu không nhấp.
   - Tên sự kiện dài bị cắt bằng dấu `...` (CSS text-overflow ellipsis) gây mất thông tin ngữ nghĩa quan trọng.
2. **Thiếu Chế Độ Xem Danh Sách / Agenda Chuyên Sâu**:
   - Agenda view hiện tại quá đơn giản, chưa làm nổi bật nhóm ngày tháng và sự kiện Âm lịch tương ứng.
3. **Cây Phả Đồ (Family Tree)**:
   - Dạng block dọc 3 tầng còn đơn sơ, chưa thể hiện rõ các nhánh hôn phối phức tạp hoặc tương tác mở rộng thế hệ linh hoạt.
4. **Hồ Sơ Cá Nhân & Gia Đình (Person & Family Profiles)**:
   - Bố cục thẻ thông tin còn phẳng, thiếu sự phân tầng thị giác (Visual Hierarchy) giữa thông tin căn cước, quan hệ huyết thống, cột mốc cuộc đời và ký ức truyền khẩu.
5. **Hệ Thống Thị Giác (Visual System)**:
   - Màu sắc và phong cách còn mang tính generic dashboard, chưa tạo được cảm giác trang trọng, ấm cúng và mang tính lưu trữ tri thức gia tộc (Archival & Editorial Heritage).

---

## 2. Nghiên Cứu Benchmark UX

### A. Google Calendar (Benchmark Tương Tác & Lịch)
- **Month Grid Pattern**:
  - Ô ngày có chiều cao cố định, cân đối tỷ lệ 7 cột `1fr`.
  - Giới hạn hiển thị preview dạng badge nhỏ gọn; nút `+N sự kiện khác` nổi bật, nhấp vào kích hoạt trực tiếp Day Detail Drawer/Popover.
  - Phân định rõ ràng: *Lưới tháng là Overview (Tổng quan)* $\rightarrow$ *Day Detail & Agenda là Full Information (Thông tin đầy đủ)*.
- **Agenda / Schedule Pattern**:
  - Cuộn dọc vô tận (Vertical Stream), nhóm theo từng ngày với ngày tháng dương lịch to rõ và âm lịch bổ trợ.
  - Mỗi thẻ sự kiện hiển thị trọn vẹn tiêu đề, không cắt xén, có phân loại màu sắc sắc nét.

### B. webtrees & Gramps Web (Benchmark Phả Hệ Gia Tộc)
- **Pedigree & Family Graph**:
  - Trọng tâm phả đồ (Root Person Focus) với điều hướng 2 chiều: Đi lên tiền nhân (Ancestors) và đi xuống hậu duệ (Descendants).
  - Thẻ cá nhân hiển thị: Tên Thánh + Họ Tên, năm sinh - mất, mã định danh gia phả (FSID).
- **Life Journey / Timeline**:
  - Kết hợp dòng thời gian sinh - tử - bí tích vào trực tiếp hồ sơ cá nhân.
- **Deep Linking**:
  - Mọi sự kiện trên lịch hay dòng thời gian đều có liên kết dẫn thẳng về hồ sơ cá nhân (`#/person/ID`) và hồ sơ gia đình (`#/family/FID`).

---

## 3. Các Pattern Áp Dụng Cho CÂY GIA PHẢ

| Pattern | Nguồn Benchmark | Cách Áp Dụng Trong CÂY GIA PHẢ |
| :--- | :--- | :--- |
| **Overflow-Safe Month Grid** | Google Calendar | Tỷ lệ 7 cột CSS Grid với `table-layout` logic, đảm bảo không clipping mép phải trên mọi viewport. |
| **Day Detail Drawer** | Google Calendar | Panel trượt (Slide-in trên Desktop, Bottom Sheet trên Mobile) hiển thị danh sách đầy đủ sự kiện của ngày được chọn kèm Âm lịch chi tiết. |
| **Grouped Agenda View** | Google Calendar | Hiển thị toàn bộ sự kiện theo dòng thời gian ngày tháng, không cắt chữ, tích hợp bộ lọc đa tầng. |
| **Archival Typography & Visuals** | Editorial / Heritage | Tông màu ấm cúng (Navy Blue `#1e3a8a`, Amber Gold `#92400e`, giấy ngà `#f8fafc`), phông chữ sắc nét, độ tương phản chuẩn WCAG AA. |
| **Bidirectional Entity Graph** | webtrees / Gramps | Điều hướng thông suốt: Lịch $\leftrightarrow$ Hồ sơ thành viên $\leftrightarrow$ Gia đình $\leftrightarrow$ Cây phả đồ $\leftrightarrow$ Ký ức. |

---

## 4. Các Pattern KHÔNG Áp Dụng & Lý Do
- **Không áp dụng Week View theo khung giờ (Hourly Time-grid)**: Các sự kiện gia phả (sinh nhật, ngày giỗ, bổn mạng) là sự kiện trọn ngày (All-day events), không có giờ bắt đầu/kết thúc trong ngày, việc chia cột 24 giờ là thừa thãi và rối mắt.
- **Không áp dụng Drag-and-drop chỉnh sửa sự kiện**: Ứng dụng là Public Read-only, Source of Truth là GEDCOM tĩnh.
