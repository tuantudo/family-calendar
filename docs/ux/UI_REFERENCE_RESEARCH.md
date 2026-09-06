# KHẢO SÁT & NGHIÊN CỨU THỰC NGHIỆM CHUẨN MỰC UI/UX (UI REFERENCE RESEARCH)
## DỰ ÁN: CÂY GIA PHẢ / GIA TỘC TRẦN TRỌNG THU
*Mã tài liệu: `docs/ux/UI_REFERENCE_RESEARCH.md` — Trạng thái: Canonical Research Artifact*

---

## 1. PHÂN BIỆT 4 TẦNG THIẾT KẾ (DESIGN TAXONOMY)

Để đảm bảo nghiên cứu có chiều sâu và không sao chép hình thức bề ngoài:
1. **VISUAL STYLE:** Màu sắc, bề mặt giấy (paper tone), phông chữ, bo góc, bóng đổ.
2. **UX PATTERN:** Phương thức giải quyết bài toán tương tác (ví dụ: Focus-centric Tree, Epistemic Badging, Inline Footnotes).
3. **INFORMATION ARCHITECTURE (IA):** Cấu trúc phân cấp thông tin, lộ trình từ Tổng quan đến Chi tiết.
4. **CONTENT MODEL:** Mối quan hệ thực tế giữa các thực thể (Person, Family, Story, Source, Media).

---

## 2. NHÓM 1: HỆ THỐNG PHẢ HỆ & GIA TỘC (GENEALOGY SYSTEMS)

### 2.1. FamilySearch (familysearch.org)
- **Màn hình nghiên cứu:** *Person Page (Details / Time Line / Sources / Collaborate)* & *Pedigree Tree View*.
- **Mục đích trang (Page Purpose):** Thiết lập một chân dung toàn diện về một cá nhân trong lịch sử, kết nối họ với dòng họ và các chứng cứ xác thực.
- **Phân tầng thông tin (Information Hierarchy):**
  1. *Header:* Họ tên đầy đủ, Thánh danh (nếu có), ID định danh, Năm sinh - Năm mất, Nút chuyển nhanh sang Tree View.
  2. *Life Sketch:* Tóm tắt cuộc đời ngắn gọn.
  3. *Vitals (Sự kiện cốt lõi):* Sinh, Rửa tội, Kết hôn, Tạ thế, An táng (kèm địa điểm cụ thể).
  4. *Family Members (Cấu trúc gia đình):* Cha mẹ & Anh chị em song song với Vợ/chồng & Con cái.
  5. *Sources & Notes:* Danh mục tài liệu lưu trữ chứng minh cho từng mốc thông tin.
- **Interaction & Navigation Model:** Bấm vào bất kỳ người thân nào sẽ mở Preview Drawer hoặc chuyển tiêu điểm; Tree view sử dụng cơ chế kéo thả mượt mà quanh một Focal Person.
- **Responsive Behavior:** Trên Mobile, Tree View chuyển thành danh sách phả hệ phân cấp dọc (Collapsible Ancestor List), Person Page chuyển các Tab ngang thành Dropdown hoặc cuộn dọc có Sticky Anchor.
- **Pattern đáng học:** Focus-centric Pedigree, cấu trúc Vitals phân minh với Family Relationships, tách biệt rõ giữa Thông tin cốt lõi và Nguồn chứng cứ.
- **Pattern KHÔNG nên lấy:** Quá nhiều form nhập liệu và tính năng cộng tác phức tạp của một nền tảng crowdsourcing toàn cầu, làm mất đi tính trang trọng của một gia tộc cụ thể.
- **Áp dụng vào Cây Gia Phả:** Áp dụng mô hình **Person Profile 4 Khối** (Identity -> Vitals/Timeline -> Kinship -> Evidence & Stories).

### 2.2. MyHeritage (myheritage.com)
- **Màn hình nghiên cứu:** *Family Tree View (Classic & Modern Style)* & *Discoveries Card*.
- **Mục đích trang:** Trực quan hóa cây gia phả sống động, làm nổi bật các nhánh gia đình và sự kiện quan trọng.
- **Pattern đáng học:** Phân biệt trực quan rõ ràng giữa Nam / Nữ qua đường viền/avatar nhẹ nhàng; hiển thị nút mở rộng nhánh con (Expand descendants) trực tiếp tại thẻ cha mẹ.
- **Pattern KHÔNG nên lấy:** Quá nhiều banner kêu gọi đăng ký thuê bao / Premium subscription và giao diện đóng khung cứng nhắc.

---

## 3. NHÓM 2: BẢO TÀNG SỐ & VĂN KHỐ VĂN HÓA (CULTURAL & ARCHIVE SYSTEMS)

### 3.1. National Museums Scotland (nms.ac.uk) & Tate Digital Collections (tate.org.uk)
- **Màn hình nghiên cứu:** *Object / Archive Record Page* & *Story / Curated Collection*.
- **Mục đích trang:** Giới thiệu hiện vật/tư liệu lịch sử kèm bối cảnh văn hóa và xuất xứ khoa học.
- **Phân tầng thông tin:**
  1. *Hero Facsimile:* Hình ảnh hiện vật độ phân giải cao ở trung tâm với khung xem chi tiết.
  2. *Curatorial Context (Bối cảnh giám tuyển):* Câu chuyện đằng sau hiện vật được viết bằng ngôn ngữ tự sự trang trọng.
  3. *Object Data / Metadata:* Mã số, Niên đại, Địa điểm tìm thấy/lưu giữ, Chất liệu, Xuất xứ (Provenance).
  4. *Related Entities:* Nghệ nhân, Nhân vật liên quan, Các sự kiện lịch sử gắn liền.
- **Pattern đáng học:** Đặt Facsimile ở vị trí trang trọng; thông tin Provenance được trình bày rõ ràng, minh bạch về tính xác thực; kết nối đa chiều giữa Hiện vật và Câu chuyện.
- **Pattern KHÔNG nên lấy:** Bảng thuật ngữ chuyên ngành khảo cổ/bảo tàng quá phức tạp đối với bạn đọc phổ thông trong gia đình.
- **Áp dụng vào Cây Gia Phả:** Dùng cho **Page_ArchiveItem** và **Tư Liệu Khảo Chứng**, thể hiện rõ xuất xứ của các di ảnh, bản scan thiệp cưới, thực địa mộ tổ.

---

## 4. NHÓM 3: ẤN PHẨM BÚT KÝ & BÁO CHÍ ĐỘC LẬP (EDITORIAL & LONG-FORM)

### 4.1. The Atlantic / NYT Magazine / Substack Longform
- **Màn hình nghiên cứu:** *Editorial Essay View* & *Series Index Page*.
- **Mục đích trang:** Đem lại trải nghiệm đọc tập trung tối đa, thấu cảm và thẩm mỹ cao cho các bài tiểu luận, hồi ký và thư từ.
- **Phân tầng thông tin:**
  1. *Deck & Attribution:* Tiêu đề trang nhã, Lời dẫn nhập (Deck/Subtitle), Tác giả & Ngày công bố.
  2. *Editorial Typography:* Nền giấy ấm, Phông Serif chuẩn mực, Drop-cap mở đầu, ngắt đoạn thoáng đãng, Blockquotes dẫn chứng xúc động.
  3. *Context Callouts:* Các ghi chú bên lề về bối cảnh thời đại hoặc nhân vật được nhắc tới.
  4. *Series Progress:* Thanh điều hướng tập san / các lá thư kế tiếp.
- **Pattern đáng học:** Typographic Authority, Reading Progress, Footnotes & Contextual Mentions (kết nối trực tiếp tên người trong bài với Hồ sơ phả hệ).
- **Pattern KHÔNG nên lấy:** Banner quảng cáo, thanh mạng xã hội trôi nổi che khuất nội dung đọc.
- **Áp dụng vào Cây Gia Phả:** Áp dụng trọn vẹn cho **Vùng MẠCH (Tập san Số 01 và chuỗi Thư gửi Clara)**.
