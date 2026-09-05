# BÁO CÁO MACH_02 — FIX PUBLICATION SOURCE & REBUILD MẠCH FROM ISSUE_01

**Workspace:** `/Users/tuantq/Projects/Personal/family-calendar`  
**Production Identity:** `https://gionghotrantrongthu.vercel.app/`  
**Git Branch:** `design/mach-02-publication` → `main`  
**Thời gian hoàn thành:** 05/09/2026  

---

## 1. SOURCE OF TRUTH CHÍNH THỨC CHO PUBLICATION

- **Publication Root Source duy nhất:**  
  `/Users/tuantq/Obsidian/20_PROJECTS/Mach/PROJECTS`
- **Quy tắc biên tập:**  
  Tuyệt đối không lấy toàn bộ thư mục `/Mach/*` làm nguồn xuất bản. Chỉ những nội dung nằm trong cấu trúc `/Mach/PROJECTS` mới đủ điều kiện xuất bản lên không gian MẠCH của website.

---

## 2. DANH SÁCH BÀI ĐÃ LOẠI KHỎI PUBLICATION DATASET

Toàn bộ 9 bài viết thuộc các thư mục nằm ngoài `/Mach/PROJECTS` đã được **loại bỏ 100%** khỏi dataset xuất bản (`data/mach.json`, `content/mach/`), menu điều hướng, danh sách gợi ý và bộ chỉ mục tìm kiếm (Global Search):

| STT | Mã Slug đã loại | Tên tác phẩm cũ | Thư mục nguồn ngoài phạm vi | Ghi chú |
| :--- | :--- | :--- | :--- | :--- |
| 1 | `thu-gui-clara-001` | Thư gửi Clara — Số 01 | `/Mach/Thư gửi Clara/` | Đã gỡ khỏi website |
| 2 | `thu-gui-clara-002` | Thư gửi Clara — Số 02 | `/Mach/Thư gửi Clara/` | Đã gỡ khỏi website |
| 3 | `thu-gui-clara-003` | Thư gửi Clara — Số 03 | `/Mach/Thư gửi Clara/` | Đã gỡ khỏi website |
| 4 | `thu-gui-clara-004` | Thư gửi Clara — Số 04 | `/Mach/Thư gửi Clara/` | Đã gỡ khỏi website |
| 5 | `thu-gui-clara-005` | Thư gửi Clara — Số 05 | `/Mach/Thư gửi Clara/` | Đã gỡ khỏi website |
| 6 | `thu-gui-clara-006` | Thư gửi Clara — Số 06 | `/Mach/Thư gửi Clara/` | Đã gỡ khỏi website |
| 7 | `thu-gui-clara-007` | Thư gửi Clara — Số 07 | `/Mach/Thư gửi Clara/` | Đã gỡ khỏi website |
| 8 | `ngoai-hoa-nhan-thuc` | Ngoại hóa nhận thức | `/Mach/OUTPUTS/CANONICAL_ARTICLES/` | Đã gỡ khỏi website |
| 9 | `nhung-dieu-con-giu-con-nguoi-o-lai` | Những điều còn giữ con người ở lại với nhau | `/Mach/OUTPUTS/CANONICAL_ARTICLES/` | Đã gỡ khỏi website |

*Ghi chú: Toàn bộ file gốc trong Obsidian của tác giả được bảo toàn nguyên vẹn, không bị xóa khỏi máy.*

---

## 3. DANH SÁCH BÀI ĐÃ THÊM TỪ ISSUE_01 (PUBLICATION DATASET MỚI)

Toàn bộ 12 bài viết chính thức thuộc **ISSUE_01** từ `/Users/tuantq/Obsidian/20_PROJECTS/Mach/PROJECTS/ISSUE_01/CANONICAL/` đã được nhập nguyên văn vào dataset:

| STT | File nguồn Obsidian | Slug bài viết | Tiêu đề chính thức | Phân mục | Tác giả |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | `01 — GIỚI THIỆU.md` | `01-gioi-thieu` | **Giới Thiệu: MẠCH được bắt đầu như thế nào?** | Lời mở | Người giữ mạch |
| 2 | `02 — CÂY GIA PHẢ & MẠCH.md` | `02-cay-gia-pha-va-mach` | **Cây Gia Phả & Mạch** | Lời mở | Người giữ mạch |
| 3 | `03 — KHI SỰ GẦN GŨI KHÔNG CÒN TỰ NHIÊN.md` | `03-khi-su-gan-gui-khong-con-tu-nhien` | **Khi Sự Gần Gũi Không Còn Tự Nhiên** | Luận | Người giữ mạch |
| 4 | `04 — TỪ HỆ TƯ TƯỞNG ĐẾN ĐẠO LÝ ĐỜI SỐNG.md` | `04-tu-he-tu-tuong-den-dao-ly-doi-song` | **Từ Hệ Tư Tưởng Đến Đạo Lý Đời Sống** | Luận | Người giữ mạch |
| 5 | `05 — NHỮNG KHẾ ƯỚC VÔ HÌNH CỦA DÒNG HỌ.md` | `05-nhung-khe-uoc-vo-hinh-cua-dong-ho` | **Những Khế Ước Vô Hình Của Dòng Họ** | Luận | Người giữ mạch |
| 6 | `06 — GIỖ VÀ KÝ ỨC GIA ĐÌNH.md` | `06-gio-va-ky-uc-gia-dinh` | **Giỗ Và Ký Ức Gia Đình** | Luận | Người giữ mạch |
| 7 | `07 — MỘ TỔ VÀ CẢM THỨC QUAY VỀ.md` | `07-mo-to-va-cam-thuc-quay-ve` | **Mộ Tổ Và Cảm Thức Quay Về** | Luận | Người giữ mạch |
| 8 | `08 — ĐÁM CƯỚI NHƯ MỘT DẤU CHUYỂN THẾ HỆ.md` | `08-dam-cuoi-nhu-mot-dau-chuyen-the-he` | **Đám Cưới Như Một Dấu Chuyển Thế Hệ** | Luận | Người giữ mạch |
| 9 | `09 — VÌ SAO CON CHÁU CÒN QUAY VỀ NGÀY TẾT?.md` | `09-vi-sao-con-chau-con-quay-ve-ngay-tet` | **Vì Sao Con Cháu Còn Quay Về Ngày Tết?** | Luận | Người giữ mạch |
| 10 | `10 — GIA ĐÌNH HẠT NHÂN VÀ SỰ CHUYỂN ĐỔI...md` | `10-gia-dinh-hat-nhan-va-su-chuyen-doi` | **Gia Đình Hạt Nhân Và Sự Chuyển Đổi Của Đại Gia Đình** | Luận | Người giữ mạch |
| 11 | `11 — NHỮNG NGƯỜI KHÔNG CÒN QUAY VỀ NỮA.md` | `11-nhung-nguoi-khong-con-quay-ve-nua` | **Những Người Không Còn Quay Về Nữa** | Luận | Người giữ mạch |
| 12 | `12 — GHI CHÚ & CHÚ GIẢI.md` | `12-ghi-chu-va-chu-giai` | **Ghi Chú & Chú Giải** | Tư liệu | Ban Biên Tập MẠCH |

- **Các item ISSUE_01 không tìm được source:** `0` (Không có, đầy đủ 100% 12/12 bài viết + mục lục tổng quan).

---

## 4. CẤU TRÚC ENTITY SAU KHI REBUILD

### A. Tuyển tập & Series
- **`issue-01`**: **MẠCH — Số 01: Dòng Họ Trong Đời Sống Đương Đại**  
  *Phụ đề:* Giữ mạch hay chấp nhận tan rã?  
  *Số lượng tác phẩm:* 12 bài viết  
  *Chủ biên / Chấp bút:* Người giữ mạch  

### B. Tác giả (Authors)
1. **`nguoi-giu-mach` (Người giữ mạch)** — 11 bài viết khảo cứu.
2. **`mach-editorial` (Ban Biên Tập MẠCH)** — 1 bài ghi chú biên tập & phụ lục.

### C. Chủ đề & Luận đề (Topics)
- `loi-mo`: Lời Mở & Định Vị (2 bài)
- `luan`: Luận Đề & Biến Chuyển (9 bài)
- `nghi-le`: Nghi Lễ & Gặp Gỡ (4 bài)
- `ky-uc`: Ký Ức & Sự Tiếp Nối (4 bài)
- `the-he`: Thế Hệ & Tiếp Nối (3 bài)
- `gia-phong`: Gia Phong & Đạo Lý (1 bài)
- `tu-lieu`: Tư Liệu & Ghi Chú (1 bài)

---

## 5. TÌNH TRẠNG ISSUE_02

- **Trạng thái:** **DEFERRED / NOT PROCESSED** (Theo đúng chỉ đạo tại yêu cầu số 4).
- Không nhập bất kỳ nội dung nào từ `ISSUE_02`.
- Không thay đổi ontology hệ thống dựa trên `ISSUE_02`.

---

## 6. DANH SÁCH ROUTES THAY ĐỔI

### A. Routes mới hợp lệ
- `#/mach/series/issue-01` (Trang chuyên đề Số 01)
- `#/mach/tac-gia/nguoi-giu-mach` (Trang tác giả Người giữ mạch)
- `#/mach/tac-gia/mach-editorial` (Trang tác giả Ban Biên Tập)
- `#/mach/bai-viet/01-gioi-thieu`
- `#/mach/bai-viet/02-cay-gia-pha-va-mach`
- `#/mach/bai-viet/03-khi-su-gan-gui-khong-con-tu-nhien`
- `#/mach/bai-viet/04-tu-he-tu-tuong-den-dao-ly-doi-song`
- `#/mach/bai-viet/05-nhung-khe-uoc-vo-hinh-cua-dong-ho`
- `#/mach/bai-viet/06-gio-va-ky-uc-gia-dinh`
- `#/mach/bai-viet/07-mo-to-va-cam-thuc-quay-ve`
- `#/mach/bai-viet/08-dam-cuoi-nhu-mot-dau-chuyen-the-he`
- `#/mach/bai-viet/09-vi-sao-con-chau-con-quay-ve-ngay-tet`
- `#/mach/bai-viet/10-gia-dinh-hat-nhan-va-su-chuyen-doi`
- `#/mach/bai-viet/11-nhung-nguoi-khong-con-quay-ve-nua`
- `#/mach/bai-viet/12-ghi-chu-va-chu-giai`

### B. Routes cũ đã xóa sạch
- `#/mach/series/thu-gui-clara`
- `#/mach/series/khao-cuu-nhan-thuc`
- `#/mach/bai-viet/thu-gui-clara-*` (001 – 007)
- `#/mach/bai-viet/ngoai-hoa-nhan-thuc`
- `#/mach/bai-viet/nhung-dieu-con-giu-con-nguoi-o-lai`

---

## 7. KNOWN LIMITATIONS

1. **Chỉ dẫn phân trang in (Spreads & Directives):** Các khối chỉ dẫn biên tập gốc trong bản thảo Obsidian của tác giả (`<span style="color:red">[SPREAD 01 — ...]</span>`, `[IMAGE]`, `[CAPTION]`) được giữ nguyên văn theo đúng nguyên tắc không can thiệp nội dung nguồn.
2. **Hình ảnh trong bài viết:** Các bài trong ISSUE_01 hiện là văn bản thuần túy (chưa nhúng ảnh đính kèm cục bộ như bộ thư cũ), tuân thủ trung thực 100% bản thảo CANONICAL.

---

## 8. KẾT LUẬN & TRẠNG THÁI TRIỂN KHAI

- **Pipeline MẠCH đã đồng bộ chuẩn xác với `/Mach/PROJECTS`**.
- Đã kiểm tra liên kết chéo, nút chuyển tiếp bài trước / bài tiếp, phân loại tác giả và tìm kiếm toàn cục.
- Sẵn sàng bàn giao cho Tuấn trải nghiệm trực tiếp trên Production.
