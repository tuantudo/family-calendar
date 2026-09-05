# BÁO CÁO FORENSIC UI BENCHMARK & VISUAL DIRECTION: CÂY GIA PHẢ (DESIGN_01A)

*Tài liệu Khảo sát Thực nghiệm Visual Reference & Định hướng Thiết kế Web App*
*Dự án: Hệ Thống Tri Thức DÒNG HỌ TRẦN TRỌNG THU (`family-calendar`)*
*Ngày thực hiện: 05/09/2026*
*Workspace: `/Users/tuantq/Projects/Personal/family-calendar`*

---

## 1. TỔNG QUAN KHẢO SÁT (EXECUTIVE FINDINGS)

### 1.1. Đối Tượng Khảo Sát
* **Trang Tham Chiếu (Reference Site)**: `https://gia-ph-vi-t-977519161602.asia-southeast1.run.app/`
* **Công cụ Khảo sát**: Headless Chromium & Playwright Engine trực tiếp (DOM inspection, computed CSS evaluation, multi-viewport capture).
* **Các Viewport Thực Nghiệm**:
  1. `Desktop Wide` (1440px × 900px)
  2. `Desktop Standard` (1280px × 800px)
  3. `Tablet Portrait` (768px × 1024px)
  4. `Mobile Large` (430px × 932px — iPhone 15 Pro Max)
  5. `Mobile Standard` (390px × 844px — iPhone 13/14)

### 1.2. Nhận Định Cốt Lõi
Trang tham chiếu mang lại cảm giác **tươi mới, trang nhã, đậm chất văn hóa dân tộc nhưng vẫn hiện đại (contemporary Vietnamese heritage)**. Nó giải quyết triệt để cảm giác "khô cứng, dữ liệu hành chính" của các phần mềm gia phả cổ điển (GEDCOM raw viewers, webtrees sơ khai) nhờ kết hợp hài hòa giữa:
1. **Chất liệu Sơn mài & Di sản văn hóa** (Màu đỏ đỗ, vàng hoàng kim, họa tiết Trống đồng, gia huấn thư pháp).
2. **Ngôn ngữ thiết kế giao diện hiện đại (Modern Web UI)**: Thẻ bo góc mềm mại (`rounded-2xl`), phân lớp bóng tinh tế (`shadow-sm` / `shadow-md`), hệ thống phân cấp phông chữ rõ ràng, thanh điều hướng dạng viên thuốc (pill tabs) linh hoạt.
3. **Cấu trúc thông tin phân tầng (Hierarchical Information Architecture)**: Tách biệt rõ giữa Sơ đồ cây (Visual Tree), Kỷ yếu truyền thống (Editorial Yearbook), Lịch giỗ chạp (Event Calendar), và Danh bạ tra cứu (Directory Search).

---

## 2. GIẢI PHẪU THỊ GIÁC TRANG THAM CHIẾU (VISUAL ANATOMY)

```text
┌──────────────────────────────────────────────────────────────────────────────────┐
│  💮 Đất Tổ Bắc Bộ • Truyền thống Lạc Hồng         [Tông Mỹ thuật ▾]  [🌐 ENGLISH]│
├──────────────────────────────────────────────────────────────────────────────────┤
│  [Logo] GIA PHẢ TỘC NGUYỄN VĂN [PRO-BETA 2026]         [👤 Đăng nhập Quản trị]  │
│         Nền tảng Quản trị Gia phả số & Kỷ yếu...                                 │
├──────────────────────────────────────────────────────────────────────────────────┤
│  (🔘 Sơ đồ) (📖 Kỷ yếu) (📅 Giỗ chạp) (🔍 Tra cứu) (💾 Sao lưu) (🚀 Cá nhân hóa) │
├──────────────────────────────────────────────────────────────────────────────────┤
│  🥁 TỔN KÍNH GIA HUẤN: "Uống Nước Nhớ Nguồn • Khai Sáng Tiền Nhân..."             │
├───────────────────────────────────────────────────────┬──────────────────────────┤
│  CÂY PHẢ HỆ GIA HỆ TRỰC QUAN                          │  INSPECTOR PANEL         │
│  [Style Pills]                         [Tổng: 17 ng]  │  ┌────────────────────┐  │
│  ┌─────────────────────────────────────────────────┐  │  │ Nguyễn Văn Thành   │  │
│  │ [Legend: Nam/Nữ/Tâm] [🔍 Tìm] [🔍-][🔍+][⛶ Center] │  │  │ ĐỜI F1      [X] │  │
│  │                                                 │  │  ├────────────────────┤  │
│  │     ┌─────────┐   ♥   ┌─────────┐               │  │  │ (Cập nhật) (Viết kỷ)│  │
│  │     │ G1-1: TH│───────│G1-1-SP:T│               │  │  ├────────────────────┤  │
│  │     └────┬────┘       └─────────┘               │  │  │ 📅 CỘT MỐC CUỘC ĐỜI│  │
│  │          └───────────────┐                      │  │  │ • 1915: Chào đời   │  │
│  │     ┌─────────┐     ┌────┴────┐     ┌─────────┐ │  │  │ • 1995: Tạ thế     │  │
│  │     │ G2-1: QU│     │ G2-2: LA│     │ G2-3: DŨ│ │  │  ├────────────────────┤  │
│  │     └─────────┘     └─────────┘     └─────────┘ │  │  │ 👨‍👩‍👧 GIA ĐÌNH HẠT NHÂN│  │
│  └─────────────────────────────────────────────────┘  │  │ 📜 TIỂU SỬ TÓM TẮT │  │
│                                                       │  └────────────────────┘  │
└───────────────────────────────────────────────────────┴──────────────────────────┘
```

### 2.1. Hệ Thống Typography
* **Sans-serif (Giao diện UI & Thao tác)**:
  * Font-family: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
  * Body text: `13px` – `14px`, `line-height: 1.5`, màu Slate-700 (`oklch(0.37 0.03 260)`).
  * Micro-copy & Badges: `9px` – `11px`, `font-semibold` / `font-bold`, `letter-spacing: 0.025em`.
* **Serif (Tiêu đề, Kỷ yếu & Gia huấn)**:
  * Tiêu đề Kỷ yếu: `font-serif`, `32px` – `40px`, `font-bold`, uppercase, màu đỏ son (`text-red-950`).
  * Khẩu hiệu / Gia huấn: `font-serif`, `13px` – `15px`, `font-bold`, `italic`, `tracking-wide`.
  * Drop-cap (Chữ cái mở đầu): Kích thước lớn 3x phông chữ đoạn văn, font serif cổ kính.
* **Monospace (Phiên bản & Tọa độ kỹ thuật)**:
  * Badges phiên bản `PRO-BETA 2026`, ID đối tượng (`G1-1`, `G2-1`), khoảng cách GPS (`~0 km`).

### 2.2. Bảng Màu & Sắc Độ (Color Palette)
* **Màu Nền Chủ Đạo (Backgrounds & Canvas)**:
  * Nền tổng thể: `bg-stone-50` (`#F8FAF8` / `#FAF9F6`) tạo cảm giác giấy dó / vải mộc ấm áp, tránh độ chói lóa của màu trắng thuần (`#FFFFFF`).
  * Nền thẻ nội dung (Card Surfaces): `bg-white` với viền nhẹ `border-slate-200/80` và đổ bóng mềm `shadow-sm`.
* **Màu Điểm Nhấn Sơn Mài & Tông Di Sản (Heritage Lacquer & Gold)**:
  * Đỏ Sơn mài (Lacquer Red): `oklch(0.258 0.092 26.042)` / `#7F1D1D` -> Thể hiện sự tôn nghiêm, truyền thống tổ tiên.
  * Vàng Hoàng kim (Imperial Amber/Gold): `oklch(0.795 0.184 86.047)` / `#D97706` -> Khắc họa ánh sáng vĩnh cửu, phúc lộc dòng họ.
  * Đen Nhánh / Xám Đá Đậm (Slate-900 / Jet Black): Nút CTA chính và header detail panel (`bg-slate-900`).
* **Màu Ngữ Nghĩa Thực Thể (Semantic Colors)**:
  * Nam (Male): Viền xanh dương thanh nhã (`border-blue-200`, avatar `bg-blue-50 text-blue-700`).
  * Nữ (Female): Viền hồng phấn dịu nhẹ (`border-pink-200`, avatar `bg-pink-50 text-pink-700`).
  * Tâm điểm (Focus / Anchor Node): Viền vàng hổ phách nổi bật kèm vầng sáng (`ring-2 ring-amber-400 border-amber-500 bg-amber-50/20`).
  * Sự kiện Giỗ tổ: Tag đỏ son (`bg-red-50 text-red-700 border-red-200`).
  * Họp mặt / Sinh nhật: Tag vàng mật ong (`bg-amber-50 text-amber-800 border-amber-200`).
  * Ngày Âm lịch: Tag trăng khuyết (`🌙 bg-amber-50 text-amber-800`).

### 2.3. Cấu Trúc Khối & Không Gian (Surfaces, Radii & Spacing)
* **Corner Radii**:
  * Thẻ lớn & Containers: `rounded-2xl` (16px).
  * Nút bấm & Thẻ cá nhân: `rounded-xl` (12px).
  * Badges & Micro-tags: `rounded-full` (9999px) hoặc `rounded-md` (6px).
* **Elevation & Shadows**:
  * Tầng 0 (Canvas): Phẳng, không đổ bóng.
  * Tầng 1 (Cards & Toolbars): `shadow-sm` (`0 1px 2px 0 rgba(0,0,0,0.05)`).
  * Tầng 2 (Hover / Active Node / Dropdown): `shadow-md` kèm hiệu ứng `scale-[1.02]`.
  * Tầng 3 (Floating Inspector / Modals): `shadow-xl` (`0 20px 25px -5px rgba(0,0,0,0.1)`).

---

## 3. PHÂN TÍCH CHUYÊN SÂU TỪNG PHÂN HỆ (MODULE BREAKDOWN)

### 3.1. Module 1: Sơ Đồ Gia Tộc (Visual Family Tree & Inspector)
* **Trải Nghiệm Tương Tác**:
  * Canvas cây phả hệ dạng đồ họa hộp (Box-and-Line Tree) với các đường kết nối SVG thanh mảnh màu đồng cổ (`#B45309`).
  * Đơn vị Hôn phối (Family Union): Cặp vợ chồng xếp song song, nối nhau bằng điểm giao thoa có biểu tượng trái tim nhỏ màu hồng phấn nằm ngay giữa đường nối.
  * Thao tác trên nút (Node Interactions):
    * Bấm vào thẻ cá nhân -> Kích hoạt Focus và mở ngay **Thanh Kiểm Tra Hồ Sơ (Side Inspector Drawer)** ở cột phải trên Desktop hoặc Bottom Sheet trên Mobile.
    * Nút `Mở rộng` / `Thu gọn` cho từng nhánh con để tránh quá tải thị giác khi cây lớn.
  * Thanh công cụ nổi (Floating Control Bar):
    * Tích hợp ngay trong góc canvas: Legend chú giải, ô tìm kiếm nhanh, Zoom In/Out, và nút `Căn giữa` (Reset Viewport).
* **Side Inspector Panel**:
  * Header tối màu sang trọng (`bg-slate-900 text-white`) hiển thị Avatar, Họ tên, Thế hệ (`ĐỜI F1`), và nút đóng `(X)`.
  * Chuỗi Cột Mốc Cuộc Đời dạng Timeline đứng: Chào đời -> Học vấn/Nghề nghiệp -> Nơi cư ngụ -> Tạ thế (Tảo di).
  * Danh sách Con cái nối dõi dạng chips bấm nhanh để chuyển tiêu điểm.
  * Trích dẫn tiểu sử / ký ức xúc động trong khung trích dẫn màu ấm.

### 3.2. Module 2: Kỷ Yếu Kỹ Thuật Số (Digital Yearbook / Kỷ Yếu)
* **Trải Nghiệm Tương Tác**:
  * Trình bày như một **Cuốn Kỷ Yếu Bìa Cứng Cao Cấp** kỹ thuật số.
  * Khung viền trang trí cổ điển kép (`double decorative frame`).
  * Phông chữ tiêu đề Serif cỡ lớn, trang nghiêm, đi kèm câu đối / danh ngôn gia tộc.
  * Bố cục bài viết có chữ cái đầu thụt dòng (Drop-Cap), phân chia chương mục rõ ràng (`Lời Nói Đầu` -> `Tổng Hợp Gia Phả Quý Ký` -> `Ký Ức Tiền Nhân`).
  * Hành động: Yêu cầu xuất in ấn PDF, Chia sẻ Zalo, Chia sẻ Facebook.

### 3.3. Module 3: Thông Báo Giỗ Chạp & Lịch Gia Tộc (Memorials & Gatherings)
* **Trải Nghiệm Tương Tác**:
  * Bố cục 2 cột (Left: Event Feed, Right: Notification Channels & Dispatch Simulator).
  * Thẻ Sự Kiện (Event Card):
    * Đường viền dọc bên trái tạo điểm nhấn phân loại (Đỏ = Giỗ tổ, Vàng cam = Họp mặt).
    * Hiển thị song song Ngày Âm lịch (`🌙 10-10 Âm lịch`) và Ngày Dương lịch tương ứng (`Lần tới: 2026-11-20`).
    * Thông tin chi tiết: Địa điểm tổ chức kèm icon vị trí, Người chủ trì / Đề cử tế lễ, Mục đích nghi lễ.

### 3.4. Module 4: Tìm Kiếm & Lọc Thành Viên Nâng Cao (Directory & Discovery)
* **Trải Nghiệm Tương Tác**:
  * Cột trái: Bộ lọc đa chiều (Từ khóa họ tên/tiểu sử, Địa lý/Khu vực cư ngụ, Nghề nghiệp/Học vị, Trạng thái Hiện diện/Đã mất).
  * Cột phải: Grid thẻ cá nhân dạng danh bạ:
    * Thẻ cá nhân gọn gàng, hiển thị Avatar, Họ tên, Đời thế hệ (`ĐỜI THỨ F1...F4`), Nghề nghiệp, Địa phương cư trú.
    * Nút hành động trực tiếp: `Tìm trên bản đồ cây ->` -> Tự động chuyển tab sang Sơ đồ cây và zoom/focus vào đúng vị trí của người đó.

### 3.5. Module 5: Cá Nhân Hóa & Biểu Tượng Gia Huy (Clan Branding & Crest)
* **Trải Nghiệm Tương Tác**:
  * Cho phép tùy chọn Biểu tượng Gia huy (Trống Đồng Đông Sơn, Chim Lạc Việt, Hoa Sen Vàng, Khuê Văn Các, Nhành Mai, Tràng Đào).
  * Xem trước Hoành Phi / Biển Đồng Gia Tộc 3D giả lập trực quan theo thời gian thực.
  * Soạn thảo và hiển thị Gia huấn / Câu đối mẫu của dòng họ.

---

## 4. MA TRẬN PHÂN LOẠI: ADOPT / ADAPT / REJECT

Dựa trên nguyên tắc bảo toàn Ontology, cấu trúc dữ liệu `genealogy.json`, và bản sắc riêng của **DÒNG HỌ TRẦN TRỌNG THU**, chúng ta phân loại các pattern như sau:

| STT | Pattern / Thành Phần | Phân Loại | Rationale & Hướng Xử Lý |
| :---: | :--- | :---: | :--- |
| **1** | **Chất liệu Sơn Mài & Màu Nền Giấy Dó (`bg-stone-50`)** | `[ADOPT]` | Rất thành công trong việc tạo cảm giác trang trọng, ấm áp, thoát ly hoàn toàn khỏi vẻ lạnh lẽo của dashboard quản trị SaaS. |
| **2** | **Thanh Điều Hướng Dạng Viên Thuốc (Pill Tabs Navigation)** | `[ADOPT]` | Gọn gàng, hiện đại, thể hiện trạng thái active rõ ràng, chuyển đổi mượt mà giữa các không gian chức năng. |
| **3** | **Bảng Kiểm Tra Hồ Sơ Nổi (Side Inspector Panel) 2 Cột** | `[ADOPT]` | Trải nghiệm tương tác vượt trội: bấm vào nút trên Cây là mở ngay Drawer chi tiết bên phải mà không che khuất toàn bộ sơ đồ phả hệ. |
| **4** | **Thẻ Sự Kiện Giỗ Chạp với Huy Hiệu Âm Lịch (`🌙`) & Viền Màu** | `[ADOPT]` | Thể hiện đúng bản sắc văn hóa giỗ tết Việt Nam, kết nối trực quan giữa ngày Âm lịch cổ truyền và ngày Dương lịch hiện đại. |
| **5** | **Điều Hướng Ngữ Cảnh: Bấm từ Danh Bạ -> Focus trên Cây** | `[ADOPT]` | Tạo luồng trải nghiệm liền mạch từ Danh sách gia đình/cá nhân nhảy thẳng vào vị trí trên Bản đồ thế hệ. |
| **6** | **Hệ Thống Phối Màu Thế Hệ F0–F4 (Generation Color Coding)** | `[ADAPT]` | Trang mẫu chỉ dùng viền Hồng/Xanh theo giới tính. CÂY GIA PHẢ cần **giữ vững Generation Semantic F0–F4** (F0 Anchor, F1, F2, F3, F4) nhưng áp dụng theo phong cách tinh tế (viền thẻ, badge thế hệ, thanh accent) thay vì làm cả thẻ sặc sỡ. |
| **7** | **Đơn Vị Hôn Phối (Family Union Pairing) với Biểu Tượng Nối** | `[ADAPT]` | Áp dụng cách ghép cặp vợ chồng nằm cạnh nhau trên cùng một bậc thế hệ với điểm kết nối thanh nhã, phù hợp với ontology 68 gia đình hạt nhân của Cụ Thu. |
| **8** | **Ngôn Ngữ & Thuật Ngữ Bản Sắc Công Giáo (Catholic Heritage)** | `[ADAPT]` | Trang mẫu dùng thuật ngữ dân gian chung chung. CÂY GIA PHẢ cần thể hiện chuẩn xác: Thánh danh (Giuse, Maria, Têrêsa...), Bổn mạng (Patron Feast), Ngày Rửa tội, Ngày Tạ thế / Lễ Giỗ, Cầu hồn. |
| **9** | **Trang Bìa & Khung Kỷ Yếu (Digital Yearbook / Kỷ Yếu Điện Tử)** | `[ADAPT]` | Tích hợp vào phân hệ Kỷ Yếu / Kỷ Niệm của Dòng Họ Trần Trọng Thu với lời tựa trang trọng, lưu giữ tiểu sử ông Cố Thu và ký ức các chi ngành. |
| **10** | **Tọa Độ GPS Giả Lập & Đo Khoảng Cách Địa Lý** | `[REJECT]` | Dữ liệu `genealogy.json` của Cụ Thu là dữ liệu phả hệ thật và lịch sử, không chứa tọa độ GPS realtime của 223 cá nhân. Không đưa tính năng giả lập gây nhiễu. |
| **11** | **Logs Truyền Thông Mô Phỏng & Giả Lập Bắn Tin Nhắn Zalo** | `[REJECT]` | CÂY GIA PHẢ đã có giải pháp thật: 4 Feeds ICS chuẩn quốc tế cho phép người dùng đăng ký trực tiếp vào Apple Calendar / Google Calendar / Outlook. Không cần giả lập chat logs. |
| **12** | **Bộ Đổi Tông Mỹ Thuật Vùng Miền Đa Phong Cách (Multi-Theme Dropdown)** | `[REJECT]` | Không biến Web App thành công cụ demo theme đa năng. CÂY GIA PHẢ cần một **Định Danh Thị Giác Duy Nhất, Nhất Quán và Độc Bản** dành riêng cho Dòng Họ Trần Trọng Thu. |

---

## 5. SO SÁNH BENCHMARK ĐA HỆ THỐNG (CROSS-BENCHMARK)

```text
┌─────────────────┬───────────────────┬───────────────────┬───────────────────┬───────────────────┐
│ Tiêu Chí        │ Reference App     │ Gramps Web        │ webtrees          │ CÂY GIA PHẢ (Mục tiêu)│
├─────────────────┼───────────────────┼───────────────────┼───────────────────┼───────────────────┤
│ Thẩm Mỹ Tổng Thể│ Di sản hiện đại   │ Clean Material UI │ Cổ điển, nhiều text│ Archival Heritage  │
│                 │ (Sơn mài + Gỗ)    │ Hiện đại nhưng khô│ Bảng biểu cũ kỹ   │ Tôn nghiêm, ấm áp │
├─────────────────┼───────────────────┼───────────────────┼───────────────────┼───────────────────┤
│ Family Graph    │ Box-and-line gọn  │ Đồ thị tương tác  │ Cây phả hệ HTML   │ Dynamic Visual    │
│                 │ Ghép đôi vợ chồng │ Pan/Zoom mượt     │ Nặng về text link │ Graph + Pan/Zoom  │
├─────────────────┼───────────────────┼───────────────────┼───────────────────┼───────────────────┤
│ Side Inspector  │ Có (Rất tốt)      │ Drawer bên phải   │ Chuyển trang mới  │ Có (Tích hợp sâu) │
├─────────────────┼───────────────────┼───────────────────┼───────────────────┼───────────────────┤
│ Sự Kiện / Lịch  │ Thẻ sự kiện + Âm  │ Timeline danh sách│ Lịch tháng cơ bản │ 4 ICS Feeds Chuẩn │
│                 │ Lịch trực quan    │ Không có Âm lịch  │ Rất ít visual     │ + Âm Dương Đồng Bộ│
├─────────────────┼───────────────────┼───────────────────┼───────────────────┼───────────────────┤
│ Mobile UX       │ Stack dọc tốt     │ Responsive chuẩn  │ Rất khó dùng      │ Adaptive Canvas   │
│                 │ Drawer linh hoạt  │                   │                   │ + Bottom Sheet    │
└─────────────────┴───────────────────┴───────────────────┴───────────────────┴───────────────────┘
```

---

## 6. ĐỀ XUẤT ĐỊNH HƯỚNG THỊ GIÁC CHO CÂY GIA PHẢ (VISUAL DIRECTION)

### 6.1. Định Danh Cốt Lõi: ARCHIVAL + HUMAN + CONTEMPORARY + PREMIUM
* **Archival (Tính Lưu Trữ / Bách Niên Tôn Nghiêm)**:
  * Nền màu giấy dó / ngà ấm (`#FBFBF9`), tạo cảm giác như đang lật giở một cuốn gia phả bọc da truyền đời.
  * Điểm xuyết gam màu Đỏ Son Sơn Mài (`#881337` / `#7F1D1D`) và Viền Vàng Hoàng Kim (`#D97706`) ở tiêu đề, huy hiệu mốc thời gian và huân chương thế hệ.
* **Human (Tính Tình Thân & Con Người)**:
  * Thẻ cá nhân hiển thị ảnh chân dung hoặc avatar chữ lồng trang nhã, Thánh danh nổi bật, năm sinh - năm mất được ghi nhận trân trọng.
  * Tích hợp trích dẫn ký ức, tiểu sử tóm tắt và danh sách anh chị em ruột thịt.
* **Contemporary (Tính Đương Đại & Công Nghệ Cao)**:
  * Hệ thống thẻ bo góc chuẩn mực (12px – 16px), đổ bóng mờ nhiều lớp, tương tác hover/focus mượt mà với hiệu ứng micro-animations 200ms.
  * Thanh điều hướng Pill tabs hiện đại, chuyển tab tức thời không tải lại trang.
* **Premium (Tính Cao Cấp & Tinh Tế)**:
  * Không lạm dụng màu sắc sặc sỡ (tránh "rainbow UI").
  * Màu thế hệ (F0: Hoàng kim, F1: Xanh ngọc bích, F2: Xanh lam sâu, F3: Tím hoàng gia, F4: Hổ phách) được thể hiện như **những dải ruy-băng danh dự (Accent Ribbons & Badges)** thanh lịch ở góc thẻ hoặc viền trên, giữ cho thân thẻ luôn trắng sáng, dễ đọc.

---

## 7. KẾ HOẠCH TRIỂN KHAI CHO MISSION TIẾP THEO (DESIGN_01B PLAN)

Sau khi báo cáo khảo sát này được thông qua, giai đoạn triển khai thực tế (DESIGN_01B) sẽ thực hiện tuần tự các bước sau mà không làm xáo trộn kiến trúc và dữ liệu:

1. **Bước 1: Tinh Chỉnh Hệ Thống Token Màu Sắc & Typography CSS (`src/css/main.css`)**:
   * Cập nhật CSS variables: Bổ sung màu nền giấy dó `stone-50`, màu sơn mài trầm `lacquer-red`, màu vàng hoàng kim `heritage-gold`, và chuẩn hóa typography Serif cho tiêu đề.
2. **Bước 2: Nâng Cấp Header & Global Navigation**:
   * Áp dụng thanh Header trang nhã với định danh chính thức: **DÒNG HỌ TRẦN TRỌNG THU**, huy hiệu phiên bản, và cụm Pill Navigation thống nhất.
3. **Bước 3: Tái Cấu Trúc Trực Quan Cho Cây Phả Hệ (Family Graph Canvas)**:
   * Áp dụng kiểu dáng Node Card tinh tế từ Reference App (ghép đôi hôn phối, avatar chữ cái lồng, badge thế hệ F0–F4 thanh lịch).
   * Tích hợp Floating Toolbar chuẩn (Zoom In/Out, Fit/Center Viewport, Search Filter).
4. **Bước 4: Nâng Cấp Thống Nhất Cho Trang Danh Sách Gia Đình & Danh Bạ Cá Nhân**:
   * Đồng bộ hóa visual language giữa Family Directory, Person Cards và Event Cards.
5. **Bước 5: Hoàn Thiện Bảng Kiểm Tra Chi Tiết Hồ Sơ (Profile Inspector Drawer)**:
   * Thiết kế Inspector Drawer 2 cột trên Desktop và Bottom Sheet trên Mobile để hiển thị Thánh danh, tiểu sử, thân phụ mẫu, hôn phối, con cái và kỷ niệm.
6. **Bước 6: Visual QA Đa Thiết Bị & Kiểm Định Toàn Vẹn Hệ Thống**.

---

## 8. KẾT LUẬN & CAM KẾT KIẾN TRÚC
* Toàn bộ dữ liệu gốc `GIADINHONGTHU.ged`, hợp đồng dữ liệu `genealogy.json`, bộ tạo `generator/`, 4 feeds ICS và cơ chế đồng bộ GAS-ICS-Sync được **bảo toàn nguyên vẹn 100%**.
* Tài liệu khảo sát này là căn cứ chuẩn mực định hướng cho toàn bộ giao diện của CÂY GIA PHẢ trong các giai đoạn phát triển tiếp theo.
