# CÂY GIA PHẢ — DATA CONTRACT SPECIFICATION

Tài liệu này định nghĩa cấu trúc dữ liệu JSON (`data/genealogy.json`) làm chuẩn giao tiếp giữa Generator và Frontend Web App.

## 1. Cấu Trúc Tổng Thể (Root Object)
- `publication` (string): Tên trích lục xuất bản gia phả.
- `rootAnchor` (string): ID cá nhân làm trọng tâm phả đồ (ví dụ: `@I1@`).
- `generatedAt` (string): Dấu thời gian xuất dữ liệu định dạng ISO 8601.
- `stats` (object):
  - `individuals` (number): Tổng số cá nhân.
  - `families` (number): Tổng số gia đình / nhánh hôn phối.
  - `memories` (number): Tổng số ký ức / giai thoại gia tộc.
- `people` (object): Từ điển ánh xạ `ID` -> Thông tin chi tiết của cá nhân.
- `families` (object): Từ điển ánh xạ `FID` -> Thông tin gia đình.
- `timeline` (array): Danh sách các sự kiện lịch sử sắp xếp theo năm tăng dần.
- `memories` (array): Danh sách các mẩu chuyện, giai thoại truyền khẩu.

## 2. Thực Thể Cá Nhân (Person Entity)
```json
{
  "id": "@I1@",
  "fsid": "G5X4-48S",
  "name": "Giuse Trần Trọng Thu",
  "raw_name": "Trọng Thu /Giuse Trần/",
  "sex": "M",
  "birth": { "date": "1872", "place": "Thanh Hóa, Việt Nam" },
  "death": { "date": "15/08/1969", "place": "Thanh Hóa, Việt Nam" },
  "baptism": null,
  "parents": ["@I5@", "@I4@"],
  "spouses": ["@I8@"],
  "children": ["@I6@", "@I18@", "@I7@", "@I9@", "@I2@", "@I3@"],
  "siblings": ["@I15@"],
  "fams": ["@F2@"],
  "famc": ["@F1@"],
  "memory": null
}
```
