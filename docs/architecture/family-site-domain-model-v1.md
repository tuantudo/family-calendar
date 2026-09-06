# Family Site Domain Model V1

## 1. Purpose
Tài liệu này xác định các khái niệm lõi (Core Concepts), các thực thể (Entities), và mạng lưới quan hệ (Relationships) thực sự tồn tại trong không gian tri thức của Gia tộc Trần Trọng Thu. Đây là nền tảng khái niệm độc lập với hệ quản trị cơ sở dữ liệu (Database Engine) và độc lập với giao diện hiển thị (UI Layer).

## 2. Domain Boundaries
Hệ sinh thái tri thức gia tộc được chia thành các ranh giới khái niệm (Domain Boundaries) sau:
- **Genealogy Domain:** Quản lý danh tính, phả hệ, và quan hệ huyết thống/hôn nhân.
- **Narrative Domain (Mạch):** Quản lý câu chuyện, ký ức, và các trước tác truyền khẩu.
- **Archive Domain:** Quản lý di sản vật chất, hình ảnh, thư từ, và hiện vật.
- **Temporal Domain:** Quản lý các biến cố, sự kiện, dòng thời gian.

## 3. Domain Concepts
Dựa trên dữ liệu thực tế (`genealogy.json`, `mach.json`), hệ thống bao gồm các khái niệm:
- **Person:** Con người mang huyết thống hoặc có quan hệ hôn nhân.
- **Family / Union:** Khái niệm nối kết giữa các Person tạo thành gia đình.
- **Story:** Bài viết, lá thư, hồi ký.
- **Author:** Người chấp bút (có thể là một Person trong gia phả hoặc người ngoài/bút danh).
- **Archive Artifact:** Hiện vật lưu trữ (ví dụ: Bản gốc sổ gia bạ).
- **Image Asset:** File ảnh kỹ thuật số chụp lại Artifact hoặc Person.
- **Event:** Một mốc thời gian có thực (Sinh, Mất, Kết hôn).
- **Place:** Địa danh gắn với Event hoặc Story.
- **Provenance:** Chứng tích nguồn gốc (Ví dụ: "FamilySearch", "Sổ gia bạ cụ X").
- **Mention:** Khái niệm một Person được nhắc đến trong một Story.

## 4. Entity Definitions

### Entity: Person
- **Purpose:** Biểu diễn một cá nhân trong dòng họ.
- **Identity:** `ID` duy nhất (hiện là FSID hoặc chuỗi ký hiệu nội bộ `@I...@`).
- **Core Attributes:** Name, Sex, Tên gọi khác (Alias).
- **Metadata:** Thuộc Generation nào (có thể tính toán được).
- **Relationships:** Tham gia vào Family (với tư cách Con, Chồng, hoặc Vợ), xuất hiện trong Archive, được nhắc đến trong Story.
- **Cardinality:** Liên kết N:M với Story, Archive.
- **Lifecycle:** Tồn tại vĩnh viễn (kể cả khi đã mất).
- **Evidence:** Có sẵn trong `genealogy.json` (`people`).

### Entity: Story
- **Purpose:** Biểu diễn một đơn vị văn bản ký ức (Lá thư, Hồi ký, Khảo cứu).
- **Identity:** `Slug` hoặc `StoryID`.
- **Core Attributes:** Title, Content/Body, Publish Date.
- **Metadata:** Tags, Category (Series).
- **Relationships:** Có Author, chứa Mentions (nhắc đến Person).
- **Cardinality:** 1 Story có 1 Author. 1 Story nhắc đến N Persons.
- **Evidence:** Có sẵn trong `mach.json` (`articles` / `series`).

### Entity: Author
- **Purpose:** Biểu diễn người viết bài trên hệ thống Mạch.
- **Identity:** `AuthorID` (ví dụ: `tuan`, `nguoi-giu-mach`).
- **Core Attributes:** Pen Name, Bio, Avatar.
- **Relationships:** Gắn với 1 Person thực tế trong phả hệ (Optional, qua `personId`), sở hữu N Stories.
- **Evidence:** Có sẵn trong `mach.json` (`authors`), ví dụ tác giả `tuan` link tới `@I18@`.

### Entity: Archive Artifact
- **Purpose:** Biểu diễn một đối tượng vật lý hoặc di sản lịch sử (Sổ gia bạ, Kỷ vật).
- **Identity:** `ArtifactID`.
- **Core Attributes:** Tiêu đề, Mô tả, Loại hình (Văn bản, Đồ vật).
- **Provenance:** Nguồn gốc thu thập, Tình trạng bảo quản.
- **Relationships:** Gắn với Image Assets (Bản số hóa), gắn với Persons (Người liên quan/sở hữu).
- **Evidence:** Require theo định hướng Archive Domain (hiện chưa có dữ liệu JSON cụ thể, nhưng là requirement của Product).

## 5. Relationship Model
Gia phả là một đồ thị (Graph), không phải bảng phẳng.
- `Person` → **child_of** → `Union/Family`
- `Person` → **spouse_in** → `Union/Family`
- `Story` → **mentions** → `Person`
- `Story` → **authored_by** → `Author`
- `Author` → **is_literally** → `Person` (Optional)
- `Archive Artifact` → **features** → `Person`

## 6. Person Model
Phải phân biệt rạch ròi giữa **Sự kiện (Facts)** và **Quan hệ (Relationships)** của một cá nhân:
- `Ngày sinh 1872` không phải là một thuộc tính bất biến của Person, mà là một **Event (Birth)** gắn với Person đó. Tuy nhiên, để tối ưu hệ thống ban đầu, Birth/Death có thể được coi là Value Objects (Struct) nhúng trong Person, nhưng về mặt Domain Concept nó là Event.
- Cấu trúc Person không chứa trực tiếp mảng `children_ids`. Thay vào đó, Person nối với thực thể `Union`, và `Union` đó có quan hệ `parent_of` với các Person khác. Điều này giải quyết bài toán đa thê / tái giá.

## 7. Story Model
Một Story không phải là text tĩnh. Nó là một **Narrative Node**.
- Subject: Ai là nhân vật chính?
- Mentions: Ai được nhắc đến thoáng qua?
*Dữ liệu thực tế cho thấy:* Story cần một danh sách các Entity References (Mentions) để tạo thành mạng lưới Backlinks.

## 8. Archive Model
Phân biệt rõ:
- **Archive Artifact (Hiện vật):** Khái niệm lịch sử (Ví dụ: "Lá thư cụ Thu gửi cụ Kỷ năm 1945").
- **Image Asset (Tài sản số):** File nhị phân (Ví dụ: `thu-cu-thu-trang-1.jpg`, `thu-cu-thu-trang-2.jpg`).
Một Artifact có thể được số hóa thành nhiều Image Assets (nhiều trang, nhiều góc chụp).

## 9. Event / Calendar Model
- **Event:** Là một Domain Entity (Sự kiện Xảy ra ở Quá khứ: Sinh, Mất, Đám cưới).
- **Calendar Event:** Là một Derived Concept (Khái niệm phái sinh). Không có thực thể "Ngày Giỗ Cụ Thu năm 2026", mà UI tự tính toán (Project) từ "Death Event của Cụ Thu" kết hợp với logic Âm Lịch.
*Quyết định Domain:* KHÔNG tạo entity Calendar Event. Chỉ tạo Event.

## 10. Place Model
- Trong dữ liệu hiện tại (`genealogy.json`), Place chỉ là một chuỗi văn bản (VD: "Thanh Hóa, Việt Nam").
- *Quyết định Domain:* Ở giai đoạn V1, Place được coi là một **Value Object** (Text String), chưa cần trở thành một Entity độc lập có ID riêng trừ khi có nhu cầu ghim bản đồ địa lý.

## 11. Source / Provenance Model
- **Source:** Trả lời "Dữ liệu này lấy từ đâu?" (VD: FamilySearch ID `G5X4-48S`).
- **Provenance:** Trả lời "Lịch sử xác minh của dữ liệu này ra sao?".
- *Quyết định Domain:* Được gắn như là Metadata nhúng bên trong Person hoặc Artifact. Chưa cần tách thành Entity độc lập.

## 12. Mention / Annotation Model
- **Mention:** Là mối quan hệ (Edge) có mang siêu dữ liệu giữa Story và Person. (Ví dụ: Story A nhắc đến Person B với vai trò "Main Character").
- **Annotation:** Tương lai áp dụng cho Archive (Khoanh vùng tọa độ X,Y trên ảnh để tag khuôn mặt Person). Hiện tại đánh dấu là *Future Domain Capability*.

## 13. Graph of Knowledge
Khái niệm vĩ mô của hệ thống sẽ là:
```text
[Author: Tuấn] ──is──> [Person: Tuấn] ──child_of──> [Union: F2]
      │
  writes
      │
      v
[Story: Thư gửi Clara] ──mentions──> [Person: Giuse Thu]
                                         │
                                     featured_in
                                         │
                                         v
                               [Archive Artifact: Ảnh 1950]
```
Mô hình này cho phép Interaction Architecture thỏa mãn yêu cầu: "Đang đọc Thư gửi Clara -> Nhấp vào tên Cụ Thu -> Thấy Ảnh 1950 -> Xem Profile cụ Thu".

## 14. Legacy Data Mapping
Bản đồ đối chiếu khái niệm từ `genealogy.json` và `mach.json` sang Domain Model:
- `genealogy.json/people` -> **Entity: Person** (Giữ nguyên).
- `genealogy.json/families` -> **Entity: Union / Family** (Nút trung chuyển quan hệ).
- `mach.json/articles` -> **Entity: Story** (Giữ nguyên).
- `mach.json/authors` -> **Entity: Author** (Có mapping sang Person qua `personId`).
- `birth/death` (trong json) -> **Value Object: Event** nhúng trong Person.

## 15. Traceability
- *Quyết định không tạo table Calendar:* Trace về requirement "Calendar Event có cần persistence không?". Vì giỗ tính theo năm âm lặp lại, lưu persistence sẽ sinh ra dữ liệu rác vô hạn. Phải là Derived Logic.
- *Quyết định tách Artifact và Image Asset:* Trace về requirement lưu trữ tài liệu dài nhiều trang. Một cuốn Sổ gia bạ không thể bị ép vào 1 trường `image_url`.

## 16. Unresolved Domain Questions
- Một Person có thể có nhiều tên (Tên khai sinh, Tên Thánh, Tên gọi ở nhà, Bí danh hoạt động)? Hiện tại dữ liệu `genealogy.json` chỉ có `name` và `raw_name`. Cần xác định Alias có phải là Entity độc lập không.
- Generation (Thế hệ) có nên lưu cứng (Stored) hay tính toán động (Derived) dựa trên khoảng cách (Depth) tới Thủy Tổ (Root Anchor `@I1@`)?
- Quan hệ nuôi dưỡng (Con nuôi) và huyết thống xử lý khác nhau thế nào trong Union?

## 17. Recommended Data Model Direction
Hướng tới một mô hình Cơ sở Dữ liệu Quan hệ (Relational Database) có tính Đồ thị (Graph-like schema). Sử dụng các bảng trung gian (Pivot tables) cho mọi quan hệ N:M (như Mentions, Archive_Tags) và dùng bảng `Union` để kết nối Person-Person thay vì trỏ khóa ngoại (Foreign Key) trực tiếp lên bảng Person.

## 18. DOMAIN MODEL GATE
**TRẠNG THÁI: READY FOR OWNER REVIEW**
