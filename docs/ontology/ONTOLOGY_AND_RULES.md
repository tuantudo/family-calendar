# CÂY GIA PHẢ — BẢN THỂ LUẬN & QUY TẮC TRI THỨC (ONTOLOGY & KNOWLEDGE RULES)
## Hệ Thống Tri Thức Dòng Họ Trần Trọng Thu (`family-calendar`)
### STATUS: WORKING ONTOLOGY SPECIFICATION (v1.0)
*Tài liệu Đặc tả Bản thể luận & Quy tắc Tri thức*  
*Ngày cập nhật: 05/09/2026*  

---

## 1. PHÂN BIỆT 3 TẦNG BẢN THỂ LUẬN (THREE ONTOLOGIES DISTINCTION)

Nhằm tránh việc trộn lẫn giữa thực tại khách quan, tri thức ghi nhận và hình thức truyền tải, hệ thống phân định rõ:

```
┌────────────────────────────────────────────────────────────────────────┐
│ A. ENTITY ONTOLOGY (Những gì tồn tại trong thực tại dòng họ)          │
│    • Person (Cá nhân / Thành viên)                                     │
│    • Family (Đơn vị gia đình hạt nhân)                                │
│    • Branch (Nhánh chi phái trong dòng tộc)                           │
│    • Generation (Thế hệ F0, F1, F2, F3, F4...)                         │
│    • Place (Địa danh cư trú, quê quán, nghĩa trang, nhà thờ)           │
│    • Event (Mốc sự kiện: sinh, tử, hôn phối, rửa tội, giỗ chạp)       │
│    • Document (Văn bản, hồ sơ, giấy tờ, gia bạ)                       │
│    • Artifact (Di vật, ảnh cổ, kỷ vật vật thể)                        │
├────────────────────────────────────────────────────────────────────────┤
│ B. KNOWLEDGE ONTOLOGY (Những gì được hệ thống hóa & ghi nhận)          │
│    • Lineage & Kinship (Thế thứ, quan hệ phả hệ)                      │
│    • Biography (Tiểu sử, hành trạng nhân vật)                         │
│    • Family History (Biên niên sử biến thiên dòng họ)                 │
│    • Family Rule & Ethos (Gia quy, gia huấn, nếp nhà)                 │
│    • Memory (Giai thoại, ký ức truyền miệng)                           │
│    • Archival Evidence & Source Citation (Dẫn chứng nguồn gốc tư liệu)│
│    • Epistemic Certainty Level (Mức độ xác tín của thông tin)         │
├────────────────────────────────────────────────────────────────────────┤
│ C. EXPRESSION ONTOLOGY (Phương thức diễn đạt, kể chuyện & xuất bản)   │
│    • Story (Mẩu chuyện tự sự)                                         │
│    • Essay (Tiểu luận, khảo cứu nếp nhà)                              │
│    • Epistolary Letter (Thư từ gửi thế hệ sau — "Thư gửi Clara")      │
│    • Series (Tuyển tập chuyên đề)                                     │
│    • Editorial Voice (Góc nhìn biên tập, tiếng nói tác giả)           │
│    • Curated Exhibition (Trưng bày bộ sưu tập tư liệu số)             │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. QUY TẮC 7 TẦNG MỨC ĐỘ XÁC TÍN (EPISTEMIC CERTAINTY RULES)

Mọi thông tin trong hệ thống đều phải tuân thủ nguyên tắc: **"Giữ lại trước khi diễn giải"** và được gắn nhãn độ tin cậy:

| Mức Độ Xác Tín | Nhãn Hệ Thống | Tiêu Chuẩn Chứng Cứ & Nguồn Gốc | Hành Xử Của Hệ Thống |
| :--- | :--- | :--- | :--- |
| **1. Confirmed Fact** | `CONFIRMED` | Có văn bản gốc đối chiếu (giấy khai sinh, hộ tịch, sổ rửa tội Bùi Chu, bia mộ). | Dữ liệu chuẩn xác thực, làm mốc quy chiếu. |
| **2. Retold Tradition**| `ORAL_TRADITION`| Lời kể truyền khẩu của bậc cao niên F0, F1, chưa có văn bản chứng minh. | Ghi nhận trung thực kèm tên người truyền ngôn. |
| **3. Personal Memory** | `MEMORY` | Hồi ức riêng tư của một cá nhân về biến cố hoặc đời sống thường nhật. | Lưu trữ trong MẠCH / Ký Ức, ghi rõ tác giả. |
| **4. Interpretation** | `INTERPRETATION`| Suy tưởng, phân tích văn hóa, luận đề triết lý của người chấp bút. | Thuộc lớp MẠCH, không được đồng nhất với Fact. |
| **5. Unverified** | `UNVERIFIED` | Dữ liệu mới tiếp nhận, chưa hoàn thành đối chiếu phả hệ. | Hiển thị cờ chú ý, kêu gọi đóng góp xác minh. |
| **6. Disputed** | `DISPUTED` | Tồn tại 2 hoặc nhiều dị bản mâu thuẫn nhau về ngày tháng, nhân vật. | Lưu song song các dị bản, không tự ý chọn một. |
| **7. Unknown** | `UNKNOWN` | Chưa có bất kỳ thông tin nào về đối tượng/sự kiện. | Để trống trung thực, tuyệt đối không bịa đặt. |

---

## 3. QUY TẮC NĂNG LỰC CHỨC NĂNG (CAPABILITY RULES)

Các công cụ tương tác không phải là các thực thể hay thương hiệu độc lập, mà là năng lực chức năng (*Capabilities*) phục vụ khai thác dữ liệu:

1. **Lịch Gia Đình & 4 Luồng iCalendar Feeds (`CAL_01` – `CAL_04`):**
   - Là **bản chiếu thời gian (Temporal Projection)** của các sự kiện phả hệ trong Gia Phả.
   - 4 feeds chuẩn RFC 5545:
     - `CAL_01_BIRTHDAYS.ics`: Sinh nhật thành viên.
     - `CAL_02_PATRON_FEASTS.ics`: Bổn mạng theo Tên Thánh Công Giáo.
     - `CAL_03_MEMORIALS.ics`: Ngày giỗ tưởng niệm theo Âm lịch truyền thống.
     - `CAL_04_FAMILY_MILESTONES.ics`: Sự kiện & ngày họp mặt gia đình.
   - **Tính ổn định UID:** UID phải gắn liền với Person FSID và năm mốc (`memorial-{FSID}-{YEAR}`).
   - **Thuật toán Âm lịch:** Sử dụng thuật toán thiên văn học GS. Hồ Ngọc Đức, múi giờ GMT+7 (`Asia/Ho_Chi_Minh`).

2. **Tra Cứu Toàn Cục (Universal Search):**
   - Tìm kiếm liên hợp đa miền (*Federated Search*) xuyên suốt Person, Family, Mạch Stories, Tư liệu Archive, Địa danh.

3. **Tính Quan Hệ Họ Hàng (Kinship Finder):**
   - Thuật toán BFS đồ thị huyết thống xác định danh xưng chính xác theo văn hóa Việt Nam (ví dụ: *Chú họ, Bác ruột, Cô F1, Cháu F3*).

---

## 4. QUY TẮC BẢO MẬT & QUYỀN RIÊNG TƯ (STEWARDSHIP RULES)

1. **Ranh giới Người Sống & Tiền Nhân:**
   - Dữ liệu của tiền nhân (đã qua đời) được công bố minh bạch cho toàn bộ gia tộc phục vụ tưởng niệm và khảo cứu.
   - Dữ liệu của thành viên đương đại (còn sống, đặc biệt thế hệ F3, F4 vị thành niên) được bảo vệ quyền riêng tư, hạn chế công khai các thông tin nhạy cảm.
2. **Kỷ luật Dữ liệu Gốc:**
   - File GEDCOM gốc (`GIADINHONGTHU.ged`) là Private Source of Truth, không commit public.
   - Mọi thông tin cập nhật phải qua bước kiểm định tính toàn vẹn trước khi xuất bản sang `data/genealogy.json`.
