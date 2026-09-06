# Family Site Product Survey V1

## 1. Executive Summary
Báo cáo này khảo sát nền tảng "Gia Phả Tộc Nguyễn Văn Pro-Beta 2026" để rút ra định hướng phát triển sản phẩm thực tiễn cho dự án Gia Tộc Trần Trọng Thu. Khảo sát chứng minh rằng: Một website gia tộc thành công không phải là một cơ sở dữ liệu học thuật khô khan, mà phải là một **"Mạng xã hội di sản thu nhỏ"** — nơi dữ liệu phả hệ được kết hợp với trải nghiệm thẩm mỹ bản địa và sự tương tác của những thành viên đang sống.

## 2. Website Survey (Dựa trên Snapshot UI thực tế)

### 2.1 Navigation
Hệ thống điều hướng cực kỳ thực dụng, nhắm thẳng vào nhu cầu của người dùng trong họ:
- SƠ ĐỒ GIA TỘC (Tree)
- KỶ YẾU KỸ THUẬT SỐ (Stories / Archive)
- THÔNG BÁO GIỖ CHẠP (Calendar)
- TÌM KIẾM CHIÁ NHÁNH (People Index)
- SAO LƯU GIA PHẢ (Data Safety)

### 2.2 Main User Flows
- **Explore Flow:** Vào trang chủ -> Chọn giao diện Mỹ thuật (Đông Hồ/Sơn Mài) -> Mở Tree -> Bấm "Mở rộng" node -> Xem Profile chi tiết.
- **Contribution Flow:** Đọc Profile một người -> Bấm "Viết kỷ niệm" -> Gửi hồi ký -> Hiện lên dưới dạng bài viết có Like/Comment.
- **Identity Flow:** Tìm thấy Node của chính mình -> Bấm "Xác nhận đây là tôi" để Claim profile.

### 2.3 Feature Inventory
| Feature | Có/Không | Giá trị đối với cộng đồng gia tộc | Nhận xét |
|---|---|---|---|
| Đổi Theme Mỹ thuật (Đông Hồ, Sơn Mài...) | Có | Rất Cao (Tạo bản sắc, rũ bỏ giao diện "phần mềm" nhàm chán) | Tính năng xuất sắc, đánh mạnh vào cảm xúc. |
| Cây phả hệ Interactive | Có | Bắt buộc (Tính năng lõi) | Node có nút "Thêm con/Nối cha mẹ" rất trực quan. |
| Xác nhận đây là tôi (Claim Profile) | Có | Rất Cao (Biến Data thành User) | Giúp kết nối người sống với dữ liệu quá khứ. |
| Kỷ niệm / Kỷ yếu (Memories) | Có | Rất Cao (Tạo nội dung sống động) | Giống feed MXH mini ngay trong hồ sơ phả hệ. |
| Thông báo Giỗ chạp | Có | Cao (Nhu cầu thực tế lớn nhất) | Đưa người dùng quay lại website hàng tháng. |

### 2.4 UX Strengths
- **Tính hành động (Call to Action):** Hồ sơ không chỉ để đọc. Các nút "Xác nhận đây là tôi", "Cập nhật tin tức", "Viết kỷ niệm" thúc đẩy người dùng đóng góp nội dung.
- **Thẩm mỹ cục bộ (Localized Aesthetics):** Tôn vinh "Đất Tổ Bắc Bộ", "Sơn Mài", tạo cảm giác thiêng liêng và truyền thống mà không bị sến.

### 2.5 UX Frictions
- Cây phả hệ (Tree) với quá nhiều nút thao tác (Mở rộng, Thêm con, Đặt làm gốc) trên mỗi Node có thể gây rối mắt trên màn hình di động nhỏ.

### 2.6 Mobile / Responsive & 2.7 Accessibility
- Mật độ thông tin trên Card khá dày (có cả Icon, Nút, Text nhỏ). Cần tối ưu khoảng trống (Spacing) nếu áp dụng vào Mobile.

## 3. FamilySearch Comparison

| Capability | FamilySearch | Website Khảo sát | Nhận xét |
|---|---|---|---|
| **Mục tiêu cốt lõi** | Tìm tổ tiên thất lạc qua hàng tỷ tỷ record toàn cầu. | Gắn kết các thành viên dòng họ đã biết với nhau. | FamilySearch là Thư viện. Web này là Ngôi nhà. |
| **Giao diện / Cảm xúc** | Sterile, phong cách doanh nghiệp (Xanh/Trắng). | Mang đậm bản sắc dân tộc, có tùy biến mỹ thuật. | Gia tộc cần "chất riêng" (Art Direction). |
| **Người đang sống** | Khóa chặt vì lý do bảo mật (Privacy lockdown). Rất khó tương tác. | Trọng tâm là người đang sống ("Xác nhận đây là tôi", Like, Comment). | FS không giải quyết được nhu cầu kết nối gia đình hiện tại. |
| **Hồi ký / Kỷ yếu** | Có tính năng Memories nhưng mang tính chất lưu trữ tĩnh. | Memories được trình bày như một câu chuyện sống động, có tương tác. | Website gia tộc cần chú trọng Oral History (Truyền khẩu). |

## 4. Product Opportunity

### 4.1 Không cần cạnh tranh
- **Global Database Search & DNA:** Tuyệt đối không tự làm. Gia tộc Trần Trọng Thu có thể lưu `FSID` của FamilySearch để ai muốn nghiên cứu sâu thì tự sang đó.
- **GEDCOM Import/Export:** Không cần làm ở V1. Dùng app thứ 3 tạo dữ liệu rồi export JSON là đủ.

### 4.2 Nên học
- **Nút "Viết kỷ niệm" (Write a Memory):** Đặt ngay trên Profile của các vị tiền bối.
- **Layout Hồ Sơ (Micro Record):** Chia cột "Cột mốc cuộc đời" (Timeline) và "Gia đình hạt nhân" rất rõ ràng.
- **Định danh thẩm mỹ:** Tiếp tục theo đuổi *The Living Chronicle* và *Red Seal* đã đề ra ở Visual Language V1.

### 4.3 Khoảng trống
- Cả hai website đều chưa có một hệ thống **Graph of Knowledge** đủ mạnh để nối "Hiện vật (Sổ gia bạ)" với "Câu chuyện (Mạch)" và "Con người" một cách xuyên suốt. Đây là cơ hội của chúng ta.

### 4.4 Cơ hội riêng của Gia tộc Trần Trọng Thu
- Kết hợp sự chặt chẽ về dữ liệu (Data Foundation) của FamilySearch với Trải nghiệm tương tác, truyền khẩu (Editorial/Memories) của website khảo sát.

## 5. Recommended V1

### MUST HAVE (Để launch thành công)
1. Cây Phả hệ (Node Tree) đơn giản, tập trung vào điều hướng.
2. Trang Person Profile hiển thị rạch ròi 2 luồng: SỰ KIỆN (Sinh/Tử/Di cư) và QUAN HỆ (Vợ/Chồng/Con).
3. Trang Story (Mạch) để đăng tải các bài Kỷ yếu.
4. Block "Liên kết chéo" (Mention/Backlink): Đang đọc Kỷ yếu có thể bấm sang Person.
5. Form hoặc Nút "Gửi kỷ niệm / Báo cáo sai sót" (Chuyển hướng qua Email/Zalo admin nếu chưa có backend).

### NICE TO HAVE (Có thì xuất sắc)
1. Lịch Giỗ chạp (Tự động nội suy từ ngày mất và chuyển sang Âm lịch).
2. Thư viện Ảnh / Hiện vật (Archive).

### LATER (Chưa cần vội)
1. Tính năng Đăng nhập và "Xác nhận đây là tôi".
2. Hệ thống Like/Comment trực tiếp trên web. (Giai đoạn đầu có thể mượn Zalo Family Group để bàn luận).

### DO NOT BUILD
1. Import/Export GEDCOM.
2. Matching người dùng / AI dò tìm tổ tiên.
3. Chat nội bộ.

## 6. Recommended Core User Journey
1. **Khám phá:** User vào trang chủ, thấy ấn tượng bởi thiết kế "Biên niên sử".
2. **Tìm rễ:** Bấm vào Cây phả hệ, tìm về Chi/Phái của mình.
3. **Chạm vào ký ức:** Bấm vào ông nội, không chỉ thấy ngày sinh/mất khô khan, mà thấy một bài viết (Story) "Ký ức về thầy đồ..." do bác trưởng nam viết.
4. **Kêu gọi hành động:** Dưới bài viết có dòng chữ "Gia đình đang thu thập thêm kỷ vật về Cụ. Bấm vào đây để đóng góp hình ảnh."

## 7. Product Principle
1. **Kết nối quan trọng hơn Dữ liệu:** Phả hệ chỉ là cái cớ, sự gắn kết của người đang sống mới là mục đích.
2. **Cảm xúc đi trước, Logic theo sau:** Visual Language phải gợi lên sự linh thiêng, truyền thống trước khi user kịp xem cấu trúc Tree.
3. **Mọi Hồ sơ đều là Lời kêu gọi:** Luôn có "Nút" để user đang sống thấy họ có thể đóng góp (Viết kỷ niệm, sửa lỗi).

## 8. Evidence / Sources
- Khảo sát thực tế Snapshot UI từ URL: `https://gia-ph-vi-t-977519161602.asia-southeast1.run.app/` (Ngày 06/09/2026).
- So sánh đối chiếu với UX mặc định của `FamilySearch.org`.

## 9. Owner Review
Báo cáo Product Survey đã hoàn tất. 
**SURVEY COMPLETE — STOP FOR OWNER REVIEW**
