# CÂY GIA PHẢ — GIA TỘC TRẦN TRỌNG THU

Hệ thống xuất bản di sản & ký ức gia tộc: Gia Phả (cấu trúc dòng họ), Mạch (bài viết, câu chuyện), Tư Liệu (vật chứng còn lại).

- **Website entity**: GIA TỘC TRẦN TRỌNG THU — `TỪ 1872 ĐẾN CHÚNG TA`
- **Production**: https://giatoctrantrongthu.vercel.app
- **Source of Truth**: `docs/architecture/ARCHITECTURE.md`
- **Documentation index**: `docs/README.md`
- **Kiến trúc**: Static-first Single Page Application (Vercel CDN; GitHub Pages fallback).

---

## Hướng Dẫn Phát Triển Cục Bộ (Local Development)

### 1. Dữ liệu nguồn & Trình tạo (Source & Generator)
- **Source of Truth**: `GIADINHONGTHU.ged` (Lưu trữ bảo mật cục bộ trên máy tác giả, không commit lên GitHub).
- **Trình xuất JSON gia phả**:
  ```bash
  python3 generator/export_genealogy_json.py
  ```
- **Trình xuất 4 luồng lịch ICS**:
  ```bash
  python3 generator/generate_calendar_feeds.py
  ```

### 2. Kiểm định tính toàn vẹn dữ liệu (Data Integrity Validation)
Trước khi commit hoặc deploy, chạy script kiểm tra:
```bash
python3 generator/validate_integrity.py
```
Nếu script trả về `OVERALL RESULT: ALL INTEGRITY GATES PASSED [OK]`, dữ liệu đã hợp lệ và an toàn để triển khai.

### 3. Xem trước ứng dụng (Preview Local)
Khởi chạy web server tĩnh chuẩn:
```bash
python3 -m http.server 8080
```
Mở trình duyệt tại: `http://localhost:8080`

---

## Cấu Trúc Thư Mục Repository
```
family-calendar/
├── .github/workflows/          # CI/CD Workflows (Validation & Instant Sync)
├── src/
│   ├── css/main.css            # Stylesheet phân tách module
│   └── js/
│       ├── core/               # Lunar Engine & RFC 5545 Parser
│       └── app.js              # Application Runtime Controller
├── data/
│   └── genealogy.json          # Knowledge Graph JSON Dataset
├── calendars/
│   ├── CAL_01_BIRTHDAYS.ics    # Luồng sinh nhật
│   ├── CAL_02_PATRON_FEASTS.ics# Luồng bổn mạng
│   ├── CAL_03_MEMORIALS.ics    # Luồng ngày giỗ tưởng niệm
│   └── CAL_04_FAMILY_MILESTONES.ics # Luồng sự kiện lịch sử
├── generator/                  # Scripts sinh dữ liệu & kiểm định
├── docs/                       # Tài liệu kiến trúc, data contract & ontology
├── index.html                  # Shell giao diện chính
├── robots.txt                  # Chặn crawler lập chỉ mục
└── README.md                   # Hướng dẫn sử dụng
```
