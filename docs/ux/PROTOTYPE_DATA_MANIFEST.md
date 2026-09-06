# PROTOTYPE DATA MANIFEST (KIỂM TOÁN DỮ LIỆU NGUỒN PROTOTYPE)
## DỰ ÁN: CÂY GIA PHẢ / GIA TỘC TRẦN TRỌNG THU
*Mã tài liệu: `docs/ux/PROTOTYPE_DATA_MANIFEST.md` — Trạng thái: Canonical Audit Gate*

---

> [!IMPORTANT]
> **QUY TẮC BẢO TOÀN DỮ LIỆU:** Mọi dữ liệu hiển thị trên Prototype phải được đối chiếu trực tiếp từ `data/genealogy.json` và `data/mach.json`. Tuyệt đối không tự suy diễn hoặc tạo dựng dữ liệu giả.

---

## BẢNG ĐỐI CHIẾU DỮ LIỆU NGUỒN CHO PROTOTYPE

| Nội dung hiển thị trong Prototype | Nguồn dữ liệu (Source) | Đường dẫn / Khóa dữ liệu | Thang bậc xác tín (Certainty) | Trạng thái (Status) |
| :--- | :--- | :--- | :--- | :--- |
| **Cụ Giuse Trần Trọng Thu** (1872 – 15/08/1969) | `data/genealogy.json` | `people["@I1@"].name`, `.birth`, `.death` | CONFIRMED | `CONFIRMED` |
| **Thân mẫu Cụ Thu:** Cụ Nguyễn Thị An | `data/genealogy.json` | `people["@I4@"].name` | CONFIRMED | `CONFIRMED` |
| **Thân phụ Cụ Thu:** Cụ Trần (Cha Ông cố Thu) | `data/genealogy.json` | `people["@I5@"].name` | CONFIRMED | `CONFIRMED` |
| **Hôn phối Cụ Thu:** Cụ Nguyễn Thị Xuân - Út | `data/genealogy.json` | `people["@I8@"].name`, `.birth`, `.death` | CONFIRMED | `CONFIRMED` |
| **Trưởng nữ:** Trần Thị Thi (1917–1989) | `data/genealogy.json` | `people["@I6@"].name`, `.birth`, `.death` | CONFIRMED | `CONFIRMED` |
| **Con gái:** Catarina Trần Thị Vị (1929–2009) | `data/genealogy.json` | `people["@I7@"].name`, `.birth`, `.death` | CONFIRMED | `CONFIRMED` |
| **Con trai:** Gioan Trần Trọng Thả (1929) | `data/genealogy.json` | `people["@I9@"].name`, `.birth` | CONFIRMED | `CONFIRMED` |
| **Con trai:** An-tôn Trần Trọng Thư (1918–1991) | `data/genealogy.json` | `people["@I18@"].name`, `.birth`, `.death` | CONFIRMED | `CONFIRMED` |
| **Con gái:** Bà Cử - hai (Chưa rõ năm) | `data/genealogy.json` | `people["@I2@"].name` | CONFIRMED | `CONFIRMED` |
| **Con gái:** Bà Định - thứ tư (Chưa rõ năm) | `data/genealogy.json` | `people["@I3@"].name` | CONFIRMED | `CONFIRMED` |
| **Thống kê tổng thể:** 223 Người, 68 Gia đình | `data/genealogy.json` | `stats.individuals`, `stats.families` | CONFIRMED | `CONFIRMED` |
| **Bài viết:** *Cây Gia Phả & Mạch* | `data/mach.json` | `articles[1].title`, `.blocks` | INTERPRETATION | `CONFIRMED` |
| **Tư liệu thực địa:** Mộ tổ Dòng họ Trần | `data/mach.json` | `media["med_issue01_mo_to"]` | CONFIRMED | `CONFIRMED` |
| **Địa bàn di cư:** Thọ Vực ➔ Bình Châu | `data/genealogy.json` & `docs/architecture` | `birth.place` & `docs/architecture/ARCHITECTURE.md` | CONFIRMED | `CONFIRMED` |
| **Empty state trường khuyết:** Ngày sinh/mất @I2@, @I3@ | `data/genealogy.json` | `birth: null`, `death.date: ""` | UNKNOWN | `HONEST_EMPTY_STATE` |
