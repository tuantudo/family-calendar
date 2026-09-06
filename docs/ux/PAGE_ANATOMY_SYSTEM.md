# HỆ THỐNG GIẢI PHẪU TRANG (PAGE ANATOMY SYSTEM)
## DỰ ÁN: CÂY GIA PHẢ / GIA TỘC TRẦN TRỌNG THU
*Mã tài liệu: `docs/ux/PAGE_ANATOMY_SYSTEM.md` — Trạng thái: Canonical IA Specification*

---

## 1. NGUYÊN TẮC PHÂN ĐỊNH RANH GIỚI (ONTOLOGICAL INTEGRITY)

- `PERSON` != `FAMILY`: Person là một chủ thể sống động qua các mốc thời gian; Family là đơn vị cấu trúc liên kết cặp hôn phối và con cái.
- `FAMILY` != `TREE`: Family là hồ sơ hạt nhân; Tree là không gian điều hướng quan hệ nhiều thế hệ.
- `TREE` != `DATABASE TABLE`: Tree là bản đồ khám phá quan hệ; Danh bạ là công cụ lọc dữ liệu.
- `ARTICLE` != `BLOG CARD`: Article trong MẠCH là ấn phẩm tiểu luận/bút ký có chiều sâu tư tưởng.
- `ARCHIVE ITEM` != `PERSON`: Archive Item là chứng tích vật chất độc lập.

---

## 2. GIẢI PHẪU CÁC LOẠI TRANG CỐT LÕI (P0 PAGES ANATOMY)

### 2.1. `Page_Home` (Cổng Xuất Bản Di Sản)
- **Mục đích:** Thiết lập định vị tinh thần, giải thích dòng họ là ai, dẫn lối 3 Vùng xuất bản và trao truyền ý nghĩa gìn giữ ký ức.
- **Above-the-Fold:** Masthead trang nghiêm (*"GIÒNG HỌ TRẦN TRỌNG THU — HỆ THỐNG XUẤT BẢN DI SẢN & KÝ ỨC GIA TỘC"*), Tôn chỉ (*"Nơi những gì còn nhớ được ở lại..."*), 3 Thẻ Cửa ngõ (Gia Phả, Mạch, Tư Liệu).
- **Khối nội dung chính:**
  1. *Masthead & Định vị tinh thần*
  2. *3 Cửa ngõ Khám phá (3 Territories)*
  3. *Tiêu điểm Chiêm nghiệm (Editorial Quote từ MẠCH)*
  4. *Bối cảnh Di sản (Nguồn cội Thọ Vực -> Bình Châu, 5 thế hệ)*
  5. *Lối rẽ Mục đích (Intent Paths: Người trong họ / Người ngoài dòng họ)*
- **Mobile Behavior:** Xếp chồng 1 cột mượt mà, giữ trọn kích thước font Serif tiêu đề và các khối dẫn hướng.

### 2.2. `Page_Person` (Hồ Sơ Nhân Vật Tiền Nhân / Hậu Duệ)
- **Mục đích:** Gặp gỡ một con người cụ thể qua căn cước, đời sống và các mối liên kết gia tộc.
- **Phân tầng thông tin:**
  1. *Header Định danh:* Thánh danh, Họ tên, Thế hệ (F0–F4), Chi nhánh, ID thực thể (@I1@...).
  2. *Cột mốc Cuộc đời (Life Timeline):* Năm sinh, Năm mất, Địa điểm ghi nhận trong dữ liệu.
  3. *Mạng lưới Gia tộc (Kinship Network):* Thân phụ/Thân mẫu, Hôn phối, Danh sách anh chị em và con cái trực hệ.
  4. *Dấu ấn Ký ức & Tư liệu:* Các bài viết MẠCH nhắc tới, Tư liệu hình ảnh có mặt nhân vật.
- **Empty State Policy:** Nếu chưa có thông tin ngày sinh/ngày mất hoặc tiểu sử -> Hiển thị thông điệp trang trọng: *"Dữ liệu ngày tháng/nơi chốn chưa có bản ghi xác thực trong gia phả hiện tại"*.

### 2.3. `Page_Family` (Hồ Sơ Gia Đình Hạt Nhân)
- **Mục đích:** Thể hiện đơn vị gia đình nhỏ, sự kết hợp giữa 2 dòng họ qua hôn phối và thế hệ con cái sinh ra.
- **Phân tầng thông tin:** Cặp vợ chồng (kèm liên kết sang Person Profile của từng người), Thế hệ của gia đình, Danh sách con cái theo thứ tự, Các sự kiện gia đình chung.

### 2.4. `Page_Tree` (Sơ Đồ Phả Hệ Trực Quan)
- **Mục đích:** Không gian điều hướng và khám phá các mối quan hệ đa thế hệ.
- **Pattern:** Focus-centric Pedigree. Luôn hiển thị Tiền nhân (Cha/Mẹ), Nhân vật trung tâm & Hôn phối, Hậu duệ (Con cái).
- **Thao tác:** Bấm vào bất kỳ thành viên nào để chuyển tiêu điểm ngay trên cây hoặc mở hồ sơ chi tiết.

### 2.5. `Page_Article` (Giao Diện Đọc Ấn Phẩm MẠCH)
- **Mục đích:** Trải nghiệm đọc sâu sắc các bài tiểu luận, bút ký, thư từ chiêm nghiệm.
- **Phân tầng thông tin:** Bìa bài viết, Tiêu đề & Lời dẫn nhập, Tác giả chấp bút, Thân bài Typography cao cấp (Drop-cap, Blockquote, Ghi chú biên tập), Thanh chuyển bài trong Tuyển tập (Series Navigation).

### 2.6. `Page_ArchiveItem` & `Page_ArchiveLanding` (Văn Khố & Tư Liệu)
- **Mục đích:** Lưu giữ và trình bày chứng tích vật chất lịch sử.
- **Phân tầng thông tin:** Khung Facsimile hình ảnh, Mã định danh tư liệu, Xuất xứ (Provenance), Địa bàn thực địa, Mức độ xác thực vật chứng, Các nhân vật liên quan.
- **Empty State Policy:** Khi một chủ đề chưa có tư liệu lập chỉ mục -> Thể hiện trung thực: *"Chưa có tư liệu được lập chỉ mục trong kho số hóa"*.
