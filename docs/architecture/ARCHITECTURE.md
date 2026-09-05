# CÂY GIA PHẢ — KIẾN TRÚC HỆ THỐNG (SYSTEM ARCHITECTURE)

## 1. Nguyên Tắc Cốt Lõi
- **Source of Truth duy nhất**: `GIADINHONGTHU.ged` (GEDCOM 5.5.1 UTF-8), lưu trữ bảo mật cục bộ, tuyệt đối không commit lên public repository.
- **Tầng Projection (Hình chiếu)**: `data/genealogy.json` và `calendars/CAL_01..04.ics` được sinh ra tự động từ GEDCOM qua các generator scripts.
- **Tầng Presentation (Giao diện)**: Web App tĩnh (HTML5 + CSS3 + Vanilla JavaScript) chạy trực tiếp trên GitHub Pages, liên kết dữ liệu động 100% (Zero Hard-code).

## 2. Luồng Dữ Liệu (Data Flow)
```
[GIADINHONGTHU.ged] (Source of Truth - Private)
       │
       ├──────────────────────────────────────────┐
       ▼ (generator/export_genealogy_json.py)    ▼ (generator/generate_calendar_feeds.py)
[data/genealogy.json]                     [calendars/CAL_01..04.ics]
       │                                          │
       └────────────────────┬─────────────────────┘
                            ▼
              (generator/validate_integrity.py)
                            │ [PASS]
                            ▼
       [GitHub Repository (main) -> GitHub Pages CDN]
                            │
                            ▼
             [Browser Client-side Web App]
```

## 3. Cấu Trúc Thư Mục Chuẩn
- `.github/workflows/`: Chứa CI workflows kiểm định dữ liệu và webhook đồng bộ.
- `generator/`: Các công cụ sinh dữ liệu JSON, lịch ICS và script kiểm tra tính toàn vẹn.
- `data/`: Chứa file hình chiếu `genealogy.json`.
- `calendars/`: Chứa 4 luồng lịch công khai RFC 5545.
- `src/`: Mã nguồn giao diện gồm CSS và các module JavaScript.
- `docs/`: Tài liệu kiến trúc, data contract và quy tắc nghiệp vụ gia phả.
