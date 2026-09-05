# TYPOGRAPHY_04 + CALENDAR_02 IMPLEMENTATION REPORT
**Dòng họ Trần Trọng Thu — Nền tảng Tri thức & Phả hệ Gia tộc**

**Production URL**: [https://gionghotrantrongthu.vercel.app/](https://gionghotrantrongthu.vercel.app/)  
**Review Target Routes**:
- Lịch & Đăng ký: `#/calendar`
- Mạch & Narrative: `#/mach/bai-viet/01-gioi-thieu`
- Gia phả & Hệ thống: `#/tree`, `#/people`, `#/families`

---

## 1. TYPOGRAPHY OPTION C ROLLOUT

Đã áp dụng phương án **Option C (Be Vietnam Pro + Source Serif 4)** nhất quán trên toàn bộ hệ thống sản phẩm.

### Font Stacks
1. **System & Operational Font (Sans-serif)**:
   - Font family: `'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
   - Weights: `400` (Regular), `500` (Medium), `600` (Semi-bold), `700` (Bold), `800` (Extra-bold).
   - Scope áp dụng: Toàn bộ UI hệ thống, Brand Title, Navigation, Thanh tìm kiếm, Nút bấm & Badge, Bảng phả đồ cây gia phả (Tree Graph), Thẻ danh sách Người/Gia đình, Số liệu thống kê, Grid tháng/ngày & Chi tiết sự kiện Lịch.

2. **Narrative & Editorial Font (Serif)**:
   - Font family: `'Source Serif 4', 'Newsreader', Georgia, serif`
   - Weights: `400` (Regular), `400i` (Italic), `600` (Semi-bold), `700` (Bold).
   - Scope áp dụng: Tiêu đề bài viết MẠCH (`.story-title`), Lời mở đầu (`.story-subtitle`), Thân bài đọc dài (`.story-content-body`), Khối trích dẫn (`blockquote`), Hồi ức và tư liệu văn bản có tính tự sự.

### Quy chuẩn căn chỉnh & Đọc trên thiết bị di động
- Thân bài văn xuôi (Long-form Prose): Canh lề trái tự nhiên (`text-align: left`), tuyệt đối không dùng `justify` (canh đều 2 bên) nhằm loại bỏ hiện tượng dãn chữ/khoảng trắng không đều ("text rivers") trên màn hình hẹp.
- Độ rộng đọc tối ưu: Cột văn bản giới hạn ở `max-width: 720px`, căn giữa màn hình, lề an toàn hai bên 16px - 20px trên mobile.
- Nhịp đọc (Line height): `1.7` - `1.75` cho thân bài MẠCH, `1.4` - `1.5` cho UI hệ thống; `letter-spacing: -0.01em` cho tiêu đề lớn.

---

## 2. CALENDAR_02 — ELEVATED CALENDAR SUBSCRIPTION UX

Khôi phục và nâng cấp toàn diện tính năng **"Đăng ký Lịch Gia Đình vào điện thoại & máy tính"** theo mô hình phân tầng trải nghiệm theo hệ điều hành (Platform-segmented UX).

### 4 Nguồn Lịch Gia Tộc (Live ICS Feeds)
1. 🎂 **Lịch Sinh nhật Gia Đình** (`CAL_01_BIRTHDAYS.ics` — 118 sự kiện)
2. 🕊️ **Lịch Bổn mạng Gia Đình** (`CAL_02_PATRON_FEASTS.ics` — 44 sự kiện)
3. 🕯️ **Lịch Tưởng niệm Gia Đình** (`CAL_03_MEMORIALS.ics` — 61 sự kiện giỗ Âm & Dương lịch)
4. 🌟 **Lịch Sự kiện Gia Đình** (`CAL_04_FAMILY_MILESTONES.ics` — 8 sự kiện họp mặt/kỷ niệm)

### Cơ chế phân luồng thiết bị (Device Tabs)
- **Tự động nhận diện thiết bị**: Khi người dùng mở hộp thoại trên iPhone/iPad/Mac, hệ thống tự động ưu tiên tab **🍎 iPhone / Mac (Apple)**. Trên Android, tự động chọn tab **🌐 Google Calendar**.
- **Tab 1: 🍎 iPhone / Mac (Apple Calendar)**:
  - Hành động chính: Nút bấm **"🍎 Thêm vào Apple Calendar"** gắn deep-link giao thức `webcal://...`.
  - Trải nghiệm: 1-click mở trực tiếp ứng dụng Lịch (Apple Calendar) của iOS/macOS để người dùng chỉ cần nhấn "Đăng ký" (Subscribe) và chọn tần suất tự động làm mới.
  - Hành động phụ: Nút "📋 Sao chép URL" để người dùng dán thủ công nếu muốn.
- **Tab 2: 🌐 Google Calendar (Android & Máy tính)**:
  - Giải thích rõ ràng giới hạn kỹ thuật của Google: Ứng dụng Google Calendar trên điện thoại không hỗ trợ tính năng thêm lịch qua URL; người dùng cần thực hiện thêm URL 1 lần duy nhất trên giao diện web máy tính/trình duyệt `calendar.google.com`, lịch sau đó sẽ tự động đồng bộ về ứng dụng trên điện thoại.
  - Nút chính: **"📋 Sao chép URL lịch"** (Copy 1-click kèm phản hồi trực quan "✅ Đã sao chép!").
  - Nút phụ: **"🌐 Mở Google Calendar Web ↗"** dẫn thẳng tới trang quản lý lịch của Google.
- **Tab 3: 💻 Ứng dụng khác (Microsoft Outlook, Thunderbird...)**:
  - Hướng dẫn ngắn gọn cách dán link dạng *Subscribe from web / Add Calendar*.

---

## 3. RESPONSIVE QA MATRIX

Đã kiểm thử giao diện và hành vi trên các độ phân giải:
- **390px / 430px (iPhone 14, 15, Pro Max)**: Các nút bấm lớn, dễ chạm ngón tay (touch target > 44px), khoảng cách lề chuẩn xác, tab chuyển đổi mượt mà.
- **768px / 834px (iPad & Tablet)**: Bố cục hiển thị cân đối, danh sách card lịch co dãn hợp lý.
- **1024px / 1440px (Desktop & Laptop)**: Hộp thoại modal căn giữa, đường dẫn URL hiển thị trực quan và hỗ trợ thao tác nhanh.

---

## 4. CHECKLIST DÀNH CHO NGƯỜI DÙNG THỰC TẾ

### A. Kiểm tra trên iPhone / iPad (Apple Calendar)
1. Mở trang: `https://gionghotrantrongthu.vercel.app/#/calendar`
2. Bấm nút **"📲 Đăng ký Lịch Gia Đình"**.
3. Tab **🍎 iPhone / Mac (Apple)** được chọn mặc định.
4. Bấm **"🍎 Thêm vào Apple Calendar"** ở một nguồn lịch (ví dụ: *Lịch Sinh nhật*).
5. Ứng dụng Lịch của iPhone tự động mở thông báo hỏi: *"Bạn có muốn đăng ký lịch này không?"* -> Bấm **Đăng ký (Subscribe)** -> Xong!

### B. Kiểm tra trên Điện thoại Android / Máy tính (Google Calendar)
1. Mở trang: `https://gionghotrantrongthu.vercel.app/#/calendar`
2. Bấm nút **"📲 Đăng ký Lịch Gia Đình"** -> Chuyển sang tab **🌐 Google Calendar**.
3. Bấm **"📋 Sao chép URL lịch"** -> Nhận thông báo *"✅ Đã sao chép!"*.
4. Mở [calendar.google.com](https://calendar.google.com) trên trình duyệt.
5. Ở cột bên trái, mục **"Lịch khác" (+)** -> chọn **"Từ URL"** -> Dán link và bấm **"Thêm lịch"**.
6. Mở app Google Calendar trên điện thoại -> Bật hiển thị lịch vừa thêm để đồng bộ trọn đời.
