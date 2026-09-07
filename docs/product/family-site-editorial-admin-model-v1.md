# Family Site Editorial & Admin Model V1

## 1. Executive Summary
Tài liệu này định nghĩa mô hình Vận hành, Quy trình biên tập (Editorial Workflow), và Trải nghiệm quản trị (Admin UX) cho Gia tộc Trần Trọng Thu. 

Admin Web không phải là một phiên bản "copy" của WordPress, cũng không phải là một "website thứ hai". Nó được thiết kế thuần túy như một **Control Room (Phòng Điều Khiển)** — nơi Ban biên tập xử lý thông tin đầu vào (từ thành viên dòng họ), tinh chỉnh, kết nối các mảnh dữ liệu lại với nhau tạo thành Đồ thị Tri thức, và quyết định xuất bản lên Public Web.

## 2. Editorial Philosophy (Triết lý Biên tập)
1. **Curation over Mass Production:** Gia phả là lịch sử, không chạy theo số lượng. Ưu tiên sự chính xác và tính trọn vẹn của từng hồ sơ/câu chuyện.
2. **Connection is the Core:** Việc nhập text (văn bản) chỉ chiếm 30% công sức. 70% công sức của Ban biên tập là tạo Liên kết chéo (Gắn người vào chuyện, gắn ảnh vào sự kiện). Admin UX phải tối ưu cho việc "Gắn kết" (Linking).
3. **Inbox-Driven Operation:** Hoạt động của Admin trong giai đoạn V1 chủ yếu xoay quanh việc xử lý các đóng góp/báo cáo từ người dùng bên ngoài gửi vào Hộp thư.

## 3. Actors / Roles (Ai vận hành hệ thống?)
Ở V1, hệ thống không cần phân cấp quyền lực phức tạp vì số lượng người vận hành ít. Không cần tạo tài khoản cho người dùng phổ thông (Người trong họ).

- **Ban Biên Tập (Editor / Administrator):** Có toàn quyền tạo nội dung, chỉnh sửa, duyệt bài, xuất bản và xử lý Hộp thư. V1 có thể gộp chung Editor và Admin làm một role duy nhất để tránh over-engineer.
- **Người Đóng Góp (Public Submitter - Không có tài khoản):** Thành viên dòng họ truy cập Public Web. Sử dụng biểu mẫu (Forms) để Gửi báo lỗi, Gửi kỷ niệm, Gửi hình ảnh. Thông tin chạy thẳng vào Inbox của Ban biên tập.

## 4. Admin Information Architecture (Điều hướng)
Mục tiêu: Mở Admin ra là biết ngay công việc phải làm.

```text
🏠 Dashboard (Bảng điều khiển & Hàng đợi công việc)

📥 Hộp thư Cộng đồng (Inbox)
 ├── 🔴 Báo cáo sai sót (3 mới)
 └── 🟡 Kỷ niệm / Tư liệu gửi về (1 chờ duyệt)

📚 Kho Tri Thức (Graph Editor)
 ├── 👤 Nhân sự (Người / Hồ sơ)
 ├── 📖 Mạch (Bài viết / Chuyện kể)
 ├── 🏺 Di sản (Hiện vật / Hình ảnh)
 └── 🗓 Sự kiện (Ngày sinh, mất, cột mốc)

⚙️ Hệ thống (Cấu hình cơ bản)
```

## 5. Dashboard / Work Queue (Hàng đợi công việc)
Dashboard không dùng để xem Analytics (Có bao nhiêu view/traffic). Dashboard V1 là một **Work Queue (Hàng đợi)** trả lời câu hỏi: "Tôi cần làm gì hôm nay?".

Các widget trên Dashboard:
- **Cần Xử Lý Ngay:** 3 báo cáo sai sót thông tin (Bấm vào để xem chi tiết người gửi và lỗi).
- **Đóng Góp Mới:** 2 mẩu chuyện kỷ niệm vừa được gửi về.
- **Đang Soạn Thảo (Drafts):** 4 bài viết / hồ sơ đang viết dở, chưa xuất bản.
- **Vừa Xuất Bản:** Lịch sử hoạt động gần nhất (để các Editor biết nhau vừa làm gì).

## 6. Editorial Workflow (Quy trình biên tập thực tế)

### Case 1 — Bổ sung một Người mới vào phả hệ
1. Mở Kho Tri Thức > Nhân sự > **Tạo mới**.
2. Nhập thông tin cơ bản: Tên, Năm sinh, Giới tính, Tình trạng (Sống/Mất).
3. Chuyển sang Tab "Gia đình": Dùng tính năng *Typeahead Search* gõ tên người Cha/Mẹ đã có sẵn để nối quan hệ. Hoặc gõ tên Vợ/Chồng.
4. Bấm **Lưu Nháp** để kiểm tra lại giao diện.
5. Bấm **Xuất bản** (Publish) lên Tree.

### Case 2 — Viết một "Mạch" (Story)
1. Mở Kho Tri Thức > Mạch > **Viết bài**.
2. Soạn thảo nội dung (Rich text).
3. Ở khung bên phải (Sidebar), có mục **"Nhân vật trong bài"**. Gõ tìm tên "Trần Trọng A" -> Click chọn để tag nhân vật này vào bài.
4. Ở mục **"Hình ảnh"**, tải ảnh lên hoặc chọn ảnh có sẵn trong Kho Di Sản.
5. Bấm **Xuất bản**. (Bài viết sẽ tự động hiện trên Public Web, và đồng thời hiện trong trang Profile của "Trần Trọng A").

### Case 3 — Xử lý Báo cáo Sai Sót từ Hộp Thư
1. Người trong họ đang xem Public Web, thấy ngày mất của ông nội bị sai -> Bấm "Báo lỗi".
2. Hệ thống gửi form này vào **Hộp thư Cộng đồng**.
3. Admin nhận được form ghi: *"Tôi là Trần B, ngày mất của ông Trần A bị sai, phải là 12/10/1990"*.
4. Màn hình Inbox chia 2 nửa: Nửa trái là Form báo cáo, Nửa phải là nút tắt mở nhanh Hồ sơ ông "Trần A" để sửa.
5. Sửa xong, Admin đổi status của thư thành **"Đã giải quyết" (Resolved)**.

### Case 4 — Tiếp nhận một Câu chuyện/Kỷ niệm
1. Người dùng bấm "Gửi kỷ niệm" trên Public Web, gõ nội dung và gửi.
2. Thư rơi vào Hộp thư Cộng đồng (Loại: Kỷ niệm).
3. Admin mở thư, đọc và thấy nội dung rất tốt.
4. Admin bấm nút **"Chuyển thành Bài viết (Convert to Story)"**.
5. Nội dung form tự động đổ vào trình soạn thảo bài viết. Admin sửa lại chính tả, gắn (tag) người dùng, thêm ảnh, rồi bấm Xuất bản. Đánh dấu thư là "Đã duyệt".

## 7. Relation / Linking Workflow (Giao diện Kết nối)
Linking là sức mạnh của Đồ thị tri thức. UX của Admin phải giải quyết việc này cực kỳ mượt mà.

- **Dạng Tagging (Typeahead):** Bất cứ khi nào cần link (Gắn Vợ, Gắn Con, Gắn Nhân vật vào Bài viết), Admin chỉ cần gõ ký tự vào thanh tìm kiếm nội bộ, hệ thống đổ xuống danh sách gợi ý kèm theo ID hoặc Năm sinh để chống trùng lặp (VD: "Trần Trọng Thu (1915)" và "Trần Trọng Thu (1980)"). Bấm chọn là xong.
- **Gắn Ảnh (Face Annotation):** Khi upload một ảnh tập thể, Admin kéo một vùng chọn (Box) lên khuôn mặt, gõ tìm tên người -> Lưu. Hệ thống tự động tạo quan hệ giữa Ảnh và Người đó.
- **Unlink:** Kế bên mỗi liên kết (Ví dụ: Thẻ tên vợ) có dấu `[X]`. Bấm vào để ngắt liên kết.

## 8. Content Lifecycle (Vòng đời Nội dung)
Mọi content (Person, Story, Artifact) đều tuân theo lifecycle tối giản:
- **Draft (Bản nháp):** Đang soạn, lưu nội bộ, Public không nhìn thấy.
- **Published (Đã xuất bản):** Công khai trên Public Web.
- **Hidden / Archived (Đã ẩn):** Rút xuống khỏi Public Web (dành cho các bài viết lỗi, hoặc hồ sơ người sống không muốn lộ diện), nhưng không bị xóa khỏi Database.

## 9. Phân loại V1 vs. LATER

### MUST HAVE V1 (Bắt buộc để Launch)
1. **Core CRUD:** Tạo/Sửa/Ẩn Person, Story, Image, Event.
2. **Graph Linking UX:** UI tìm kiếm và tag người (Typeahead search) để nối Cha-Con, Vợ-Chồng, Người-Bài viết.
3. **Public Inbox:** Hàng đợi nhận Form (Báo lỗi, Kỷ niệm) từ Public Web. Trạng thái cơ bản: New, Resolved.
4. **Content Status:** Draft, Published.

### NICE TO HAVE (Có thể trì hoãn nếu không kịp)
1. **Face Annotation (Tag mặt vào ảnh):** Rất tốt cho Archive nhưng code UX vùng chọn hình ảnh (Bounding box) tốn thời gian. Có thể chỉ cần Tag tên chung chung vào ảnh trước.
2. **Email Notification:** Báo qua email cho Admin khi có submission mới (tạm thời Admin chủ động vào xem Hộp thư).

### LATER (Khi hệ thống có quy mô lớn hơn)
1. User Accounts / Authentication cho người dùng Public.
2. Phân quyền Editor vs Contributor nội bộ.
3. Version History / Audit Log (Xem lại ai đã sửa cái gì).
4. Automated Scheduled Publishing (Hẹn giờ lên bài).

### DO NOT BUILD NOW (Hoặc không bao giờ)
1. Analytics dashboard (Lượng truy cập, bounce rate). Dùng Google Analytics bên ngoài.
2. Advanced Comment Moderation.
3. Bulk Editing (Sửa hàng loạt). Gia phả cần sự cẩn trọng từng hồ sơ.
4. GEDCOM Import/Export Tool trong Admin. (Import làm bằng script độc lập là đủ).

## 10. Key Product Decisions & Mở rộng
1. **Quyết định 1 - Không User Account ở V1:** Đây là quyết định lớn nhất, giúp cắt giảm 50% khối lượng code không cần thiết. Trải nghiệm người dùng cực kỳ nhẹ nhàng (Gửi form ẩn danh hoặc kèm tên/SĐT -> Admin lo phần còn lại).
2. **Quyết định 2 - Inbox-Driven:** Mọi tương tác của dòng họ biến thành Work Task của Admin. Quá trình kiểm duyệt (Curation) được giữ chặt chẽ 100%.

## 11. Open Questions (Chờ Owner Quyết Định)
- Workflow **"Gắn mặt vào ảnh" (Face annotation)** có phải ưu tiên tiên quyết cho Launch V1 không, hay chỉ cần tag tên (Text-based linking) là đủ?
- Hiện tại V1 gộp Admin và Editor làm 1 Role (Ban biên tập). Gia tộc có nhu cầu chia 2 cấp duyệt bài không? (VD: Cháu viết, Trưởng họ duyệt mới được lên).

## 12. Owner Review Checklist
- [ ] Product Workflow này đã đáp ứng đúng nhu cầu vận hành thực tế chưa?
- [ ] Các quyết định loại bỏ (Do Not Build) có đi ngược ý định của Owner không?
- [ ] Tính năng Inbox cho Public Submission có giải quyết bài toán giao tiếp không?

> **TÌNH TRẠNG: READY FOR OWNER REVIEW**
