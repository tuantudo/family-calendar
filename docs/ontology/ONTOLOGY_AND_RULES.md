# CÂY GIA PHẢ — ONTOLOGY & BUSINESS RULES

## 1. Bốn Luồng Lịch Gia Đình (4 Canonical Calendar Feeds)
1. `CAL_01_BIRTHDAYS.ics`: Lịch ngày sinh nhật của các thành viên gia tộc (còn sống hoặc được lưu niệm).
2. `CAL_02_PATRON_FEASTS.ics`: Lịch lễ bổn mạng / quan thầy Công Giáo theo Tên Thánh.
3. `CAL_03_MEMORIALS.ics`: Lịch ngày giỗ tưởng niệm tiền nhân theo đúng thứ bậc trực hệ và thế hệ.
4. `CAL_04_FAMILY_MILESTONES.ics`: Các mốc biến cố lịch sử và sự kiện gia đình trọng đại.

## 2. Quy Tắc Sinh UID & Tính Ổn Định
- Mọi VEVENT phải có UID cấu trúc duy nhất gắn liền với mã định danh phả hệ:
  - Sinh nhật: `birthday-{FSID}-{YEAR}`
  - Bổn mạng: `patron-{FSID}-{NAME}`
  - Ngày giỗ: `memorial-{FSID}-{ORIGIN_YEAR}`
- Tuyệt đối không thay đổi cấu trúc UID này để tránh trùng lặp sự kiện trên ứng dụng lịch của người dùng.

## 3. Quy Tắc Tính Âm Lịch (Vietnamese Lunar Algorithm)
- Sử dụng thuật toán thiên văn học chính xác của GS. Hồ Ngọc Đức.
- Múi giờ chuẩn: GMT+7 (`Asia/Ho_Chi_Minh`).
- Tính toán trực tiếp ngày Sóc và độ dài quỹ đạo mặt trăng/mặt trời để xác định tháng nhuận và can chi chính xác.
