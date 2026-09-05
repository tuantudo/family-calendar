# TYPOGRAPHY_03 — BÁO CÁO ĐÁNH GIÁ FONT IDENTITY SPECIMEN
**Hệ thống Tri thức & Di sản CÂY GIA PHẢ DÒNG HỌ TRẦN TRỌNG THU**

*Ngày thực hiện: 05/09/2026*  
*Môi trường trực tiếp: [https://gionghotrantrongthu.vercel.app/#/typography-specimen](https://gionghotrantrongthu.vercel.app/#/typography-specimen)*  
*Nhánh phát triển: `design/typography-03-font-specimen`*  

---

## 1. TỔNG QUAN VÀ MỤC ĐÍCH

Mục tiêu của mission `TYPOGRAPHY_03` là tạo ra một trang **Typography Specimen tương tác thực tế** ngay trong ứng dụng web tại đường dẫn `#/typography-specimen` để Tuấn có thể trực tiếp quan sát, so sánh và trải nghiệm 3 phương án danh tính font chữ (*Font Identity*) trước khi đưa ra quyết định lựa chọn chính thức.

### Nguyên tắc bất biến đã tuân thủ:
1. **Không thay đổi font toàn website**: Typography hiện hành trên các trang sản xuất (`#/`, `#/tree`, `#/calendar`, `#/mach`, v.v.) được giữ nguyên vẹn 100%.
2. **Không sửa đổi kiến trúc dữ liệu / nghiệp vụ**: Không can thiệp vào GEDCOM, `genealogy.json`, thuật toán sinh lịch ICS, Google Apps Script sync hay mã nguồn MẠCH trên Obsidian.
3. **Nội dung thực nghiệm chuẩn hóa**: Toàn bộ 3 phương án đều được đặt cạnh nhau và sử dụng chung 100% thuật ngữ, dữ liệu gia phả thực (`Giuse Trần Trọng Thu`, `Nguyễn Thị Bảy`, 223 thành viên, 68 gia đình), bộ lọc lịch 4 luồng và đoạn trích lục thực tế từ *MẠCH / Thư gửi Clara*.
4. **Trình bày công bằng**: Cùng cấu trúc phân cấp, cùng cỡ chữ, cùng khoảng cách dòng (line-height), căn trái (Left-aligned, không justified để tránh hiện tượng "rivers" chia cắt văn bản).

---

## 2. BA PHƯƠNG ÁN TYPOGRAPHY ĐƯỢC ĐÁNH GIÁ

| Phương án | Hệ thống UI / Dữ liệu / Gia Phả / Lịch | Không gian Tự sự / Bài viết MẠCH | Triết lý Danh tính (*Identity Thesis*) |
| :--- | :--- | :--- | :--- |
| **Phương án A (NOTO)** | **Noto Sans**<br>`400, 500, 600, 700` | **Noto Serif**<br>`400, 400i, 600, 700` | **Chuẩn mực Quốc tế & Phổ quát Toàn cầu**<br>Được thiết kế bởi Google với mục tiêu "No more tofu", hệ thống Noto đem lại độ bao phủ ký tự và dấu tiếng Việt tuyệt đối, độ tin cậy hiển thị 100% trên mọi nền tảng thiết bị. |
| **Phương án B (BE VIETNAM PRO)** | **Be Vietnam Pro**<br>`400, 500, 600, 700, 800` | **Be Vietnam Pro**<br>`400, 400i, 600, 700` *(100% Sans-serif, không dùng Serif)* | **Bản sắc Bản địa Hiện đại & Mạch lạc**<br>Bộ font do nhà thiết kế typographic Việt Nam sáng tạo riêng cho tiếng Việt. Dấu thanh được tinh chỉnh tối ưu cho cấu trúc ngữ âm Việt, mang vẻ đẹp kỹ thuật số hiện đại, sạch sẽ và tối giản. |
| **Phương án C (BE VIETNAM PRO + SOURCE SERIF 4)** | **Be Vietnam Pro**<br>`400, 500, 600, 700, 800` | **Source Serif 4**<br>`400, 400i, 600, 700` | **Giao thoa Kỹ thuật số & Chiều sâu Di sản Văn hóa**<br>Kết hợp tính chính xác, mật độ thông tin cao của Be Vietnam Pro trong bảng biểu, cây gia phả và lịch phụng vụ với nhịp điệu ấm áp, trang nhã, giàu tính văn chương của Source Serif 4 (Adobe) trong các bài viết dài. |

---

## 3. NGUỒN FONT & CƠ CHẾ TẢI (*FONT LOADING*)

- **Nguồn cấp phát**: Google Fonts CDN chính thống với tham số `display=swap` và hỗ trợ đầy đủ `subset=vietnamese`.
- **Thẻ `<link>` nhúng trong `<head>`**:
  ```html
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,600&family=Noto+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Noto+Serif:ital,wght@0,400;0,600;0,700;1,400;1,700&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400;1,700&display=swap" rel="stylesheet">
  ```
- **Fallback Stack**:
  - Sans-serif: `var(--sp-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`
  - Serif: `var(--sp-serif), Georgia, "Times New Roman", Times, serif`

---

## 4. HỆ THỐNG THỨ BẬC CHỮ & THỬ NGHIỆM DẤU TIẾNG VIỆT (*GLYPH STRESS TEST*)

### 4.1. Bảng thử nghiệm dấu tiếng Việt phức hợp
Mỗi phương án đều được kiểm tra với:
- **Tập nguyên âm mang dấu phức**: `ă â ê ô ơ ư đ` • `á à ả ã ạ` • `ấ ầ ẩ ẫ ậ` • `ế ề ể ễ ệ` • `ố ồ ổ ỗ ộ` • `ờ ở ỡ ợ` • `ứ ừ ử ữ ự`
- **3 câu tiếng Việt tự nhiên mang ngữ cảnh Gia phả**:
  1. *Gia phả & Cội nguồn*: "Trải qua bao thăng trầm dâu bể, cội nguồn dòng họ vẫn sừng sững tựa rặng tre già chở che cho đàn con cháu sum vầy."
  2. *Phụng vụ & Bổn mạng*: "Lễ kính Quan thầy bổn mạng, ngày giỗ tưởng niệm phụ mẫu và các bậc tiền nhân ở xứ đạo thân thương."
  3. *Khảo cứu & Trích lục*: "Khảo cứu gia phả, đối chiếu trích lục sổ rửa tội và ghi chép từng nhánh gia đình qua nhiều thế hệ."

### 4.2. Thang thứ bậc Typographic Scale
- **Display** (36px / 2.25rem, weight 800, line-height 1.15)
- **Heading 1 (H1)** (28px / 1.75rem, weight 700, line-height 1.25)
- **Heading 2 (H2)** (22px / 1.375rem, weight 700, line-height 1.3)
- **Heading 3 (H3)** (18px / 1.125rem, weight 600, line-height 1.35)
- **Body Large / Lead** (17px / 1.0625rem, weight 500, line-height 1.6)
- **Body Regular** (15px / 0.9375rem, weight 400, line-height 1.65)
- **Body Small** (13.5px / 0.84375rem, weight 400, line-height 1.5)
- **Meta / Label** (12.5px / 0.78125rem, weight 600, uppercase, letter-spacing 0.05em)
- **Caption / Footnote** (11.5px / 0.71875rem, italic, line-height normal)
- **Quote / Trích dẫn** (16px / 1rem, italic, line-height 1.7, border-left accent)

---

## 5. KẾT QUẢ QUAN SÁT FORENSIC TRÊN CÁC THIẾT BỊ

### 5.1. Thử nghiệm Đọc bài viết dài trên Mobile (390px / 430px)
- **Căn lề**: 100% Left-aligned, loại bỏ hoàn toàn hiện tượng khoảng trắng bất thường (*rivers*) thường gặp khi dùng text-justify trên màn hình hẹp.
- **Dấu tiếng Việt**:
  - *Noto Sans / Noto Serif*: Dấu rất rõ ràng, tròn trịa, khoảng cách giữa dấu mũ và dấu thanh tách bạch tốt.
  - *Be Vietnam Pro*: Dấu sắc, hỏi, ngã, nặng được vẽ với tỷ lệ rất đẹp, ôm sát thân chữ, không bị đè lên các chữ hoa có dấu (như `Ấ, Ầ, Ẩ, Ễ, Ợ`).
  - *Source Serif 4*: Dấu tiếng Việt trong đoạn văn dài có độ tinh xảo cao, serif chân đế tạo luồng dẫn mắt (*eye-flow*) êm ái khi đọc liên tục trên màn hình điện thoại.
- **Chiều dài dòng (*Line Length*)**: Được khóa tối đa ở `720px` trên desktop và tự co giãn linh hoạt kèm padding `14px` trên mobile, đảm bảo mỗi dòng đạt khoảng 60–75 ký tự (tiêu chuẩn vàng của typography).

---

## 6. MA TRẬN ĐÁNH GIÁ 10 TIÊU CHÍ (THANG ĐIỂM 1 – 5)

> [!NOTE]
> Bảng điểm dưới đây là đánh giá kỹ thuật và trải nghiệm khách quan của AGY để Tuấn tham khảo. Tuấn sẽ là người trực tiếp đưa ra quyết định cuối cùng sau khi xem Specimen trên web.

| Tiêu chí Đánh giá | Phương án A (Noto Sans + Noto Serif) | Phương án B (Be Vietnam Pro 100%) | Phương án C (Be Vietnam Pro + Source Serif 4) | Phân tích Forensic |
| :--- | :---: | :---: | :---: | :--- |
| **1. Độ dễ đọc tổng thể (*Readability*)** | 4.5 / 5 | 4.5 / 5 | **5.0 / 5** | Option C cân bằng tối ưu: Sans cho thông tin ngắn, Serif cho bài đọc dài. |
| **2. Chất lượng dấu Tiếng Việt (*Diacritics*)** | 4.5 / 5 | **5.0 / 5** | **5.0 / 5** | Be Vietnam Pro & Source Serif 4 xử lý dấu tiếng Việt tinh tế hơn Noto. |
| **3. Khả năng đọc trên Mobile (*Mobile 390px*)** | 4.5 / 5 | **4.8 / 5** | 4.7 / 5 | Sans-serif thuần (Option B) rất gọn gàng trên màn hình nhỏ; Option C cũng rất xuất sắc. |
| **4. Độ rõ ràng trong UI / Navigation (*UI Clarity*)** | 4.2 / 5 | **5.0 / 5** | **5.0 / 5** | Be Vietnam Pro có x-height lớn, các nút và thanh điều hướng cực kỳ sắc nét. |
| **5. Mật độ hiển thị Dữ liệu Gia phả (*Data Density*)** | 4.3 / 5 | **4.8 / 5** | **4.8 / 5** | Be Vietnam Pro hiển thị thẻ thành viên, năm sinh năm mất, thế hệ F0–F4 rất gọn. |
| **6. Chiều sâu Tự sự / Văn chương (*Editorial Character*)** | 4.0 / 5 | 3.5 / 5 | **5.0 / 5** | Option B thiếu đi chất "trầm tích thời gian" khi đọc bài dài. Source Serif 4 (Opt C) mang lại cảm giác hoài niệm, trang trọng và lắng đọng sâu sắc. |
| **7. Tính độc đáo & Bản sắc (*Brand Distinctiveness*)** | 3.5 / 5 | 4.3 / 5 | **4.8 / 5** | Noto hơi mang tính phổ thông của hệ điều hành Android; Be Vietnam Pro + Source Serif 4 tạo ra nhận diện văn hóa dòng họ độc bản. |
| **8. Tính nhất quán đa không gian (*Cross-space Consistency*)** | 4.3 / 5 | **4.8 / 5** | 4.7 / 5 | Cả 3 phương án đều kết nối liền mạch giữa Gia Phả — Mạch — Lịch — Tư Liệu. |
| **9. Khả năng tiếp cận (*Accessibility & Contrast*)** | **4.8 / 5** | 4.7 / 5 | 4.8 / 5 | Cả 3 phương án đều đạt chuẩn tương phản WCAG AA+ và hiển thị tốt ở các kích thước chữ nhỏ (11.5px–13.5px). |
| **10. Mức độ phù hợp với CÂY GIA PHẢ (*Identity Fit*)** | 4.0 / 5 | 4.2 / 5 | **5.0 / 5** | Option C phản ánh trọn vẹn tinh thần: một cây gia phả hiện đại về công nghệ tra cứu nhưng thâm trầm, trang nghiêm về chiều sâu gia tộc. |
| **TỔNG ĐIỂM KỸ THUẬT** | **42.6 / 50** | **45.6 / 50** | **48.8 / 50** | |

---

## 7. KHUYẾN NGHỊ KỸ THUẬT CỦA AGY (*AGY RECOMMENDATION*)

> [!IMPORTANT]
> **Khuyến nghị**: AGY đề xuất **Phương Án C (Be Vietnam Pro cho UI/Hệ thống + Source Serif 4 cho Bài viết MẠCH)**.
> 
> **Lý do**:
> 1. **Giải quyết hoàn hảo bài toán lưỡng nguyên**: Hệ thống *CÂY GIA PHẢ* vừa là một ứng dụng tra cứu dữ liệu chính xác (yêu cầu sans-serif hiện đại, gọn gàng, mật độ cao của *Be Vietnam Pro*), vừa là một không gian văn hóa lưu giữ ký ức và khảo cứu dòng họ (yêu cầu nét đẹp văn chương, ấm áp, trang trọng của *Source Serif 4*).
> 2. **Chất lượng dấu tiếng Việt đỉnh cao**: Cả *Be Vietnam Pro* và *Source Serif 4* đều là những bộ font có thiết kế dấu tiếng Việt chuẩn mực nhất hiện nay, không bị lỗi dính dấu hay mất cân đối khoảng cách ký tự.
> 3. **Tách bạch không gian nhận thức**: Người dùng khi chuyển từ giao diện tra cứu cây phả đồ/lịch sang đọc bài viết MẠCH sẽ cảm nhận ngay sự chuyển đổi không gian từ "công cụ làm việc" sang "không gian chiêm nghiệm".

*(Ghi chú: AGY KHÔNG tự ý áp dụng font này cho toàn website. Toàn bộ quyết định thuộc về Tuấn sau khi trực tiếp xem xét Specimen).*

---

## 8. HƯỚNG DẪN TRẢI NGHIỆM TRỰC TIẾP

1. Truy cập đường dẫn: **[https://gionghotrantrongthu.vercel.app/#/typography-specimen](https://gionghotrantrongthu.vercel.app/#/typography-specimen)**
2. Sử dụng thanh nhảy nhanh đầu trang để chuyển đổi giữa 3 phương án:
   - 🅰️ **Phương án A**: Noto (Noto Sans + Noto Serif)
   - 🅱️ **Phương án B**: Be Vietnam Pro (100% Sans)
   - 🅲 **Phương án C**: Be Vietnam Pro + Source Serif 4
3. Thử nghiệm trên các thiết bị:
   - **Màn hình máy tính (Desktop 1440px)**
   - **Máy tính bảng (iPad 768px / 1024px)**
   - **Điện thoại di động (iPhone 390px / 430px)**
