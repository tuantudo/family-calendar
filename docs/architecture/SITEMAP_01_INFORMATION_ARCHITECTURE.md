# KIẾN TRÚC THÔNG TIN & SITEMAP: CÂY GIA PHẢ
## HỆ THỐNG TRI THỨC DÒNG HỌ TRẦN TRỌNG THU (`family-calendar`)
### STATUS: PROPOSED INFORMATION ARCHITECTURE (v2.0) — ALIGNED WITH FOUNDATIONAL ARCHITECTURE
*Tài liệu Đặc tả Kiến trúc Thông tin & Sitemap Chuẩn hóa*  
*Ngày cập nhật: 05/09/2026*  
*Workspace: `/Users/tuantq/Projects/Personal/family-calendar`*  

---

## 1. TỔNG QUAN ĐIỀU HÀNH (EXECUTIVE SUMMARY)

Tài liệu này xác lập cấu trúc thông tin (Information Architecture — IA) của hệ thống xuất bản DÒNG HỌ TRẦN TRỌNG THU, chuyển dịch từ giai đoạn Research sang Architecture dựa trên nguyên tắc cốt lõi: **"Giữ lại trước khi diễn giải"**.

Hệ thống được tổ chức xoay quanh **3 trục nội dung chính (3 Core Content Axes)**:
1. **GIA PHẢ** (*Structured Heritage*): Ghi nhận dòng họ là ai và những gì có thể xác định được về dòng họ.
2. **MẠCH** (*Expressed Memory & Editorial Voice*): Nơi con cháu trong dòng họ kể, nhớ, suy nghĩ và diễn giải.
3. **TƯ LIỆU** (*Archival Records & Evidence*): Kho lưu giữ những vật chứng đời sống còn sót lại (ảnh, giấy tờ, văn bản, âm thanh, video).

Cùng hai không gian bối cảnh:
- **VỀ DÒNG HỌ** (*Heritage Overview*): Lịch sử, nguồn gốc, nơi chốn và những điều còn lại.
- **VỀ DỰ ÁN** (*Project & Stewardship*): Lý do tồn tại, phương pháp khảo cứu, nguồn gốc xác tín và cơ chế truyền thừa.

Các công cụ như **Lịch gia đình** và **Tìm kiếm toàn cục** được định vị là **Capabilities (Năng lực chức năng)** phục vụ việc khai thác 3 trục nội dung, không phải các sub-brand độc lập.

---

## 2. SITEMAP CÔNG KHAI TỔNG THỂ (PROPOSED PUBLIC SITEMAP)

```text
SITEMAP — DÒNG HỌ TRẦN TRỌNG THU
│
├── 0.0 TRANG CHỦ (Home)
│   ├── 0.1 Lời giới thiệu ấn phẩm & Lý do tồn tại của Cây Gia Phả
│   ├── 0.2 Cửa ngõ 3 trục chính: Gia Phả, Mạch, Tư Liệu
│   ├── 0.3 Tổng hợp những gì đang được ghi nhận
│   └── 0.4 Phương pháp ghi chép & Khả năng tiếp tục của thế hệ sau
│
├── 1.0 GIA PHẢ (Structured Lineage & Heritage System)
│   ├── 1.1 Tổng quan (Phả ký & Khởi nguyên)
│   ├── 1.2 Phả đồ (Family Graph — Trực hệ Focus & Toàn cảnh Explore Bands)
│   ├── 1.3 Thế hệ (Phân tầng thế hệ F0–F4)
│   ├── 1.4 Người (Danh bạ 223 thành viên & Hồ sơ nhân vật chi tiết)
│   ├── 1.5 Gia đình (Danh bạ 68 gia đình hạt nhân)
│   ├── 1.6 Chi / Nhánh (Phân nhánh dòng tộc)
│   ├── 1.7 Địa danh (Thọ Vực, Bình Châu, Bình Triệu, Sài Gòn...)
│   └── 1.8 Dòng thời gian (Biên niên sử sự kiện phả hệ & Mốc thời gian)
│
├── 2.0 MẠCH (Editorial Voice & Family Narratives)
│   ├── 2.1 Tất cả bài viết (Mục lục tự sự tổng hợp)
│   ├── 2.2 Chuyện (Giai thoại, mẩu chuyện đời thường)
│   ├── 2.3 Ký ức (Hồi ức tiền nhân, các thế hệ F0–F2)
│   ├── 2.4 Suy tưởng (Tiểu luận, góc nhìn nếp nhà & thời đại)
│   ├── 2.5 Thư (Thư từ trao gửi thế hệ sau — Tiêu biểu: "Thư gửi Clara")
│   ├── 2.6 Tuyển tập (Series chuyên đề dòng họ)
│   └── 2.7 Tác giả (Hồ sơ những người chấp bút & nhân chứng đóng góp)
│
├── 3.0 TƯ LIỆU (Archival Records & Evidence Vault)
│   ├── 3.1 Tất cả tư liệu (Kho lưu trữ số tổng hợp)
│   ├── 3.2 Hình ảnh (Ảnh cổ di sản, ảnh chân dung, ảnh sinh hoạt)
│   ├── 3.3 Văn bản (Trích lục gia bạ, văn bản Hán Nôm)
│   ├── 3.4 Giấy tờ (Hộ tịch, sổ rửa tội Bùi Chu, thư tay, chứng từ)
│   ├── 3.5 Âm thanh (Audio thu âm giọng nói, lời kể tiền nhân)
│   ├── 3.6 Video (Thước phim tư liệu gia đình)
│   └── 3.7 Bộ sưu tập (Tư liệu nhóm theo chủ đề / giai đoạn biến cố)
│
├── 4.0 VỀ DÒNG HỌ (Heritage Context)
│   ├── 4.1 Lịch sử dòng họ
│   ├── 4.2 Nguồn gốc & Tiền nhân
│   ├── 4.3 Những nơi chốn đã đi qua
│   └── 4.4 Những điều còn lại
│
├── 5.0 VỀ DỰ ÁN (Stewardship & Governance)
│   ├── 5.1 Vì sao có Cây Gia Phả
│   ├── 5.2 Phương pháp khảo cứu & ghi chép
│   ├── 5.3 Nguồn gốc & Thang 7 mức độ xác tín
│   ├── 5.4 Đóng góp tư liệu & Hiệu đính
│   └── 5.5 Liên hệ & Kế thừa hệ thống
│
└── [GLOBAL CAPABILITIES] (Năng lực & Công cụ dùng chung)
    ├── 🔍 Universal Search (Tìm kiếm liên hợp đa miền)
    └── 📅 Temporal Engine (Lịch gia đình Âm/Dương, Bổn mạng, Ngày giỗ & 4 feeds ICS)
```

---

## 3. PHÂN ĐỊNH TAXONOMY VÀ UI INTERACTION

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 1. SITEMAP TAXONOMY (Cấu Trúc Thông Tin Thực Tế)                                       │
│    • Gia Phả, Mạch, Tư Liệu, Về Dòng Họ, Về Dự Án.                                     │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 2. PROJECTIONS & VIEW MODES (Góc Nhìn Dữ Liệu)                                         │
│    • Trong Gia Phả: Focus Graph View vs Explore Bands View vs Directory View.          │
│    • Trong Sự Kiện: Lưới Tháng vs Sổ Sự Kiện (Agenda).                                 │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 3. CAPABILITIES (Công Cụ Phân Tích & Khai Thác)                                        │
│    • Tra cứu quan hệ (Kinship Calculator), Bộ lọc lớp lịch (Layer Toggles).            │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 4. UI MECHANICS (Thành Phần Giao Diện Tạm Thời)                                        │
│    • Side Drawer, Day Bottom Sheet, Search Modal Inset, Zoom/Pan Canvas.               │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. MÔ HÌNH ĐIỀU HƯỚNG CHÉO NGỮ NGHĨA (CROSS-NAVIGATION)

```text
[GIA PHẢ: HỒ SƠ CỐ THU]
       │
       ├── (Xem bài viết liên quan) ───────────────> [MẠCH: Thư gửi Clara #01]
       ├── (Xem chứng từ lịch sử) ─────────────────> [TƯ LIỆU: Bản trích lục Hán Nôm]
       └── (Xem ngày giỗ tưởng niệm) ──────────────> [CAPABILITY LỊCH: Giỗ 10-10 Âm lịch]

[MẠCH: BÀI LUẬN VỀ CỤ BÀ SA]
       │
       ├── (Gắn thẻ nhân vật) ─────────────────────> [GIA PHẢ: Focus vào Node Cụ Sa trên Cây]
       └── (Xem ảnh tư liệu dẫn chứng) ────────────> [TƯ LIỆU: Ảnh chân dung Cụ Sa]

[TƯ LIỆU: SỔ RỬA TỘI BÙI CHU]
       │
       └── (Nhân vật được chứng thực) ─────────────> [GIA PHẢ: Hồ sơ thành viên F0, F1]
```
