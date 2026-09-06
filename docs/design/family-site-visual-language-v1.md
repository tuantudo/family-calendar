# VISUAL LANGUAGE V1: GIA TỘC TRẦN TRỌNG THU

> "Tính nhất quán của website không nằm ở việc mọi trang trông giống nhau. Nó nằm ở việc những trang khác nhau vẫn nói cùng một ngôn ngữ."

## 1. Purpose
Tài liệu này định nghĩa "Ngôn ngữ thị giác" (Visual Language/Grammar) của dự án. Đây là la bàn cho mọi quyết định UI. Nó tách biệt rõ khái niệm "Sự nhất quán" (Consistency) khỏi "Sự giống hệt nhau" (Sameness).

## 2. Evidence / Source Basis
Dựa trên Mission của dự án (Lưu giữ di sản, Phả hệ, Mạch truyện, Tư liệu gốc) và định hướng của Owner (không phải SaaS, không generic Tailwind). Các quyết định này bắt nguồn từ:
- Tính chất dữ liệu: Ngày tháng, gia phả, ký ức (Data-heavy nhưng mang tính lịch sử).
- Đối tượng: Thành viên trong họ, mọi độ tuổi (Cần sự rõ ràng, nghiêm túc, dễ đọc).

## 3. Visual Character
**"Documentary Intimacy & Archival Restraint" (Lưu trữ trang nghiêm & Thân mật tư liệu)**
- Không phải là một ứng dụng doanh nghiệp (lạnh lẽo).
- Không phải là một blog cá nhân (quá phóng túng).
- Nó giống như một cuốn sổ gia phả được số hóa: nghiêm túc, ngăn nắp, vượt thời gian, nơi những dữ liệu khô khan (Ngày sinh, FSID) đứng chung một cách trân trọng với những mẩu chuyện gia đình.

## 4. Visual Principles
- **Content drives Form:** Hình thức sinh ra để phục vụ nội dung. Bố cục tự biến đổi (co hẹp để đọc chữ, phình to để xem lưới quan hệ) nhưng vẫn giữ chung chất liệu.
- **Flat Surface:** Bề mặt 2D tuyệt đối. Không có độ sâu giả tạo (shadow, bevel, 3D). Mọi thứ nằm trên một mặt phẳng của "giấy".
- **Typographic Wayfinding:** Dùng kích cỡ và trọng lượng chữ để dẫn đường thay vì dùng màu sắc hay hình khối.

## 5. Typography Language
- **Display / Identity (EB Garamond):** Dùng để định danh (Tên cụ tổ, Tựa đề bài viết lớn, Ký ức). Tạo cảm giác lịch sử.
- **Utility / Metadata (Inter):** Dùng cho Navigation, Ngày tháng, FSID, Label. Tạo cảm giác chính xác của dữ liệu khoa học.
- **Hierarchy Grammar:** Tên người ở trang Person (H1) có thể to gấp đôi Tên người ở thẻ Node trong Tree. Dù khác size, chúng đều tuân thủ: *Identity luôn dùng Serif, Meta luôn dùng Sans-serif*.

## 6. Spatial Language
- **Margins & Gutters:** Dùng khoảng trắng lớn (macro-whitespace) để tách biệt các Section (VD: 4rem - 6rem). Không dùng đường kẻ ngang (hr) nếu khoảng trắng đã đủ làm nhiệm vụ chia tách.
- **Reading vs Scanning:** 
  - Khi cần đọc (Mạch): Không gian ép hẹp (max 68ch) vào giữa, lề hai bên rộng.
  - Khi cần quét/scan (Danh bạ, Meta grid): Dàn đều toàn bộ chiều ngang container.

## 7. Color Language
- **Canvas:** `--bg-page` (Giấy ngà/Off-white) - Nền tảng của vạn vật.
- **Surface:** `--bg-surface` (Trắng tinh) - Dùng khi cần nổi bật một mảnh thông tin khỏi canvas (Card).
- **Primary Text:** Đen chì/Than (Charcoal), tuyệt đối không dùng `#000000` gắt.
- **Accent:** Màu Sơn Mài / Hoàng kim chỉ xuất hiện như những "con dấu" (badge, active link), không được dùng làm màu nền diện rộng.

## 8. Image Language
- Hình ảnh là Tư Liệu (Artifacts).
- **Quy tắc:** Viền sắc nét `1px solid border-dark`, không bo tròn (0px radius). 
- **Grayscale/Tone:** Ảnh chân dung người đã khuất (nếu gốc là trắng đen) phải được giữ nguyên. 
- **Provenance:** Dưới/Bên cạnh mỗi bức ảnh luôn đi kèm Metadata (Nguồn gốc: FamilySearch hay Lưu trữ gia đình).

## 9. Divider/Border Language
- Đường kẻ (Lines) đóng vai trò như dòng kẻ trong sổ sách.
- Luôn là hairline (`1px solid`).
- Màu sắc: Xám cực nhạt (`--border-light`) cho chia ô dữ liệu; Xám đậm hơn (`--border-dark`) cho khung chứa (container) hoặc phân định Header/Body.

## 10. Component Language
- **KEEP:** Text link gạch chân, Badge metadata (hình chữ nhật, chữ in hoa nhỏ).
- **MODIFY:** Button/Nav (Gỡ bỏ hình viên thuốc/pill-shape, chuyển về dạng text hoặc hình chữ nhật sắc cạnh).
- **MERGE:** Gom các thẻ Family Relation (Cha/Mẹ/Con) về chung một cấu trúc `Entity Card` chuẩn.

## 11. Pattern Language
Một Pattern là một bộ ngữ pháp.
- **Entity Header Pattern:** `[Avatar vuông] + [Serif Title H1] + [Sans-serif Badges] + [Tabular Metadata]`. Pattern này xuất hiện ở Person, Family, Author.
- **Timeline Pattern:** `[Cột Năm/Sans-serif Đậm] + [Khoảng trắng] + [Cột Sự kiện/Serif]`. Xuất hiện ở Person Detail, History.

## 12. Page-Model Language
- Homepage = Bảng chỉ dẫn (Orientation).
- Tree = Bản đồ (Macro Map).
- Person = Hồ sơ lưu trữ (Micro Record).
- Mạch = Trang sách (Reading).

## 13. Shared vs Variable Matrix
*(Xem chi tiết trong file `family-site-page-model-matrix-v1.md`)*

## 14. Current Inconsistency Audit
*(Xem chi tiết trong file `family-site-visual-consistency-audit-v1.md`)*

## 15. Legacy Conflicts
- Hệ thống CSS variables cũ sinh ra cho một UI dạng SaaS (nhiều lớp bóng đổ, bo tròn 10-24px).
- D3.js SVG Tree tự vẽ các node box bằng code JS độc lập, không kế thừa CSS variables chuẩn.

## 16. Unresolved Decisions
- Nút bấm (CTA): Trong một trang mang tính Lưu trữ (Archival), nút bấm (VD: "Đọc thêm", "Tìm kiếm") nên có dạng Khối (Solid box) hay chỉ nên là Dòng chữ gạch chân đậm (Thick underline text link) để giảm thiểu cảm giác "App"? (Cần Owner review).

## 17. The Visual Grammar (10 Câu)
1. Giao diện là một mặt phẳng giấy lưu trữ 2D, không bóng đổ, không bo góc.
2. Không gian (Space) định hình bố cục, đường kẻ mảnh (Hairline) phân chia dữ liệu.
3. Chữ có chân (Serif) lưu giữ "Linh hồn" (Tên, Tiểu sử); chữ không chân (Sans-serif) định hình "Thể xác" (Ngày tháng, Metadata, Điều hướng).
4. Mọi thông tin nguồn gốc (Metadata, FSID) đều phải hiển thị minh bạch dưới dạng nhãn (Labels) hoặc bảng (Tabular data).
5. Hình ảnh là tư liệu khách quan, phải vuông vức, có viền bảo vệ mỏng và luôn đi kèm nguồn gốc.
6. Màu sắc (Đỏ sơn mài, Vàng đồng) chỉ đóng vai trò đánh dấu (Annotation/Active state), không dùng để trang trí mảng lớn.
7. Trạng thái tương tác (Hover) chỉ phản hồi bằng thay đổi độ đậm viền hoặc đổi màu nền xám tinh tế.
8. Bố cục trang co giãn theo mục đích: hẹp để Đọc, rộng để Tra cứu, nhưng duy trì chung một nhịp điệu khoảng trắng (Rhythm).
9. Mọi Thực thể (Người, Câu chuyện, Bức ảnh) đều được giới thiệu bằng một Header rõ ràng về Định danh và Siêu dữ liệu.
10. Tổng thể đem lại cảm giác trang nghiêm, tĩnh lặng, nơi người dùng chậm rãi đọc và dò tìm gia phả thay vì vội vã thao tác.

## 18. Homepage as Reference Implementation
Homepage không phải là Master Layout để copy số cột. Nó là nơi người dùng nhìn thấy: 
- Nền giấy ngà (`--bg-page`).
- Headline to bằng Serif.
- Nav bar mỏng dính, không viền nổi.
- Nút bấm/Thẻ bài viết phẳng, không shadow.
Từ đó, bộ não người dùng thiết lập kỳ vọng thị giác cho toàn bộ hệ thống.

## 19. How other page models inherit/adapt the language
- **Mạch (Story):** Tuân thủ Grammar 3 (Serif cho nội dung). Kế thừa Grammar 8 (Cần Header định danh tác giả/bài viết). Vứt bỏ Grid rườm rà, áp dụng Grammar 8 (Bố cục co hẹp) để đọc.
- **Tree:** Tuân thủ Grammar 4 (Metadata minh bạch). Các Node không bo tròn (Grammar 1).

## 20. Acceptance Criteria
Visual Language V1 chỉ được coi là hoàn thiện khi bất cứ UI/Frontend Developer nào vào dự án, nếu phải tạo màn hình `Album Hình Ảnh Cũ`, họ sẽ TỰ ĐỘNG:
- Chọn nền trắng/ngà.
- Viền ảnh 1px, vuông góc.
- Viết Caption bằng Sans-serif, Tiêu đề Album bằng Serif.
...mà không cần copy code từ Homepage.
