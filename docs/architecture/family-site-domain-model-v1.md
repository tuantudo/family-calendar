# Family Site Domain Model V1

## 1. Purpose
Tài liệu này xác định các khái niệm lõi (Core Concepts), các thực thể (Entities), và mạng lưới quan hệ (Relationships) tạo nên "Graph of Knowledge" của Gia tộc Trần Trọng Thu. Đây là nền tảng khái niệm độc lập với Database Schema và Implementation, phục vụ làm móng cho Architecture V2.

## 2. Domain Concept Classification
Để tránh nhầm lẫn khi triển khai, các khái niệm được phân loại nghiêm ngặt:

- **Entity (Thực thể có Identity độc lập):** Person, Story, Author, Archive Artifact, Image (Digital Asset), Event, Source.
- **Relationship (Mối quan hệ/Cạnh của đồ thị):** Union (Hôn phối/Tạo gia đình), Mention (Nhắc đến), Annotation (Chú thích).
- **Value / Metadata (Thông tin mô tả):** Place, Provenance Metadata, Confidence Level.
- **Derived / Grouping (Khái niệm phái sinh/gom nhóm):** Family, Generation, Branch, Calendar Event.

---

## 3. Entity Definitions

### 3.1. Person
- **Identity:** `PersonID` (Hiện dùng FSID hoặc ký hiệu `@I...`).
- **Core Attributes:** Name, Sex, Aliases (Tên gọi khác).
- **Lifecycle:** Tồn tại vĩnh viễn trong phả hệ.
- **Visibility:** Public (thông tin cơ bản) / Family-only (thông tin nhạy cảm/người còn sống).
- **Evidence:** Bắt buộc. Hiện diện trong `genealogy.json/people`.

### 3.2. Story
- **Identity:** `StorySlug` hoặc `StoryID`.
- **Core Attributes:** Title, Body, Published Date.
- **Evidence:** Có trong `mach.json/articles`.

### 3.3. Author
- **Identity:** `AuthorSlug`.
- **Core Attributes:** Pen Name, Bio, Avatar.
- **Evidence:** Có trong `mach.json/authors`. (Một Author có thể link 1:1 với một Person qua `personId`).

### 3.4. Archive Artifact
- **Identity:** `ArtifactID`. Khái niệm đại diện cho *hiện vật vật lý hoặc logic* (VD: Cuốn sổ gia bạ năm 1945, Bức thư viết tay).
- **Core Attributes:** Title, Medium (Loại hình), Original Date, Description.
- **Evidence:** Yêu cầu từ Page Model (Archive).

### 3.5. Image (Digital Asset)
- **Identity:** `AssetID`. Bản số hóa của Artifact hoặc Person.
- **Core Attributes:** File path, Format, Resolution.
- **Cardinality:** 1 `Archive Artifact` có thể gồm NHIỀU `Image` (VD: Sổ gia bạ có 50 trang scan).
- **Evidence:** Yêu cầu phân tách rõ giữa Hiện vật (Artifact) và File ảnh số hóa.

### 3.6. Event
- **Identity:** `EventID`.
- **Core Attributes:** Event Type (Birth, Death, Marriage, Migration), Date.
- **Evidence:** Trong `genealogy.json` hiện đang gộp `birth/death` vào Person, nhưng về mặt Domain, chúng là Event.

### 3.7. Source
- **Identity:** `SourceID`. Nguồn gốc xuất xứ của thông tin.
- **Core Attributes:** Tên nguồn (VD: "Gia phả giấy năm 1990", "Tài khoản FamilySearch").

---

## 4. Relationship Definitions (The Graph Edges)

### 4.1. Union (Thay thế cho khái niệm Family cứng)
- **Bản chất:** Thay vì lưu "Family" như một thực thể tĩnh, ta mô hình hóa nó như một Relationship Node (Nút giao).
- `Person A` (Husband) ↔ `Union` ↔ `Person B` (Wife).
- `Union` ↔ `Parent Of` ↔ `Person C` (Child).
- **Lợi ích:** Giải quyết triệt để bài toán đa thê, tái giá, con nuôi, con chung/con riêng.

### 4.2. Mention
- **Bản chất:** Mối liên kết N:M giữa Story và Person/Place/Event.
- **Metadata đi kèm:** Role (Nhân vật chính/Phụ), Context.
- `Story` ↔ `Mention` ↔ `Person`.

### 4.3. Annotation
- **Bản chất:** Mối liên kết N:M giữa Image và Person (Tag khuôn mặt).
- **Metadata đi kèm:** X, Y coordinates (Future capability).

---

## 5. Derived & Value Concepts

### 5.1. Derived: Family, Branch, Generation, Calendar Event
- **Family:** Không phải Entity. Là góc nhìn UI (View) nhóm từ mạng lưới `Union`.
- **Generation (Đời/Thế hệ):** Tính toán (Derived) bằng thuật toán duyệt đồ thị đo khoảng cách từ Root Anchor (`@I1@`).
- **Branch (Chi/Phái):** Gom nhóm (Grouping) dựa trên hậu duệ của một Node tổ tiên cụ thể.
- **Calendar Event:** Projection (Hình chiếu) của các `Event` có thật lặp lại hàng năm (VD: Ngày giỗ, Sinh nhật). Không lưu vào database như một bảng riêng.

### 5.2. Value: Place
- Hiện tại, Địa danh chỉ là chuỗi văn bản (String) gắn vào Event hoặc Story. (Chưa cần tọa độ GIS hay Identity riêng cho Phase 1).

### 5.3. Value: Provenance & Confidence
- **Provenance:** Gắn liền với bất kỳ Fact hoặc Relationship nào. Trả lời câu hỏi: "Ai đã xác nhận thông tin này, dựa trên Source nào, vào lúc nào?".
- **Confidence:** Metadata đánh giá mức độ tin cậy (Certain / Probable / Unresolved).

---

## 6. The Graph of Knowledge

Mô hình Domain này tạo ra mạng lưới liên kết vô hạn, phục vụ trực tiếp cho Interaction Architecture (Mọi trang đều mở ra khám phá tiếp):

1. `Person` ↔ `Union` ↔ `Person` (Khám phá Phả hệ)
2. `Person` ↔ `Mention` ↔ `Story` (Từ Hồ sơ nhảy sang Bài viết có nhắc đến họ)
3. `Person` ↔ `Appearance` ↔ `Archive Artifact` ↔ `Image` (Từ Hồ sơ xem được các di vật/ảnh chụp có mặt họ)
4. `Story` ↔ `Source` ↔ `Provenance` (Xác thực nguồn gốc bài viết)
5. `Event` ↔ `Place` (Nhóm các sự kiện xảy ra cùng một địa điểm)

---

## 7. Unresolved Domain Questions (Ambiguities)
1. **Alias Identity:** Một người có tên khai sinh, tên Thánh, bí danh. Alias nên là Value mảng string đơn giản trong Person, hay phải là Entity riêng có thời gian áp dụng? (Đề xuất ban đầu: Value mảng String).
2. **Relationship Uncertainty:** Nếu gia phả ghi nhận "Có khả năng A là con B nhưng chưa chắc chắn", có nên lưu cờ `Confidence = Probable` ngay tại cạnh (edge) `Union` không?
3. **Event Granularity:** Sự kiện Di cư (Migration) có nên model thành Event lõi ngang hàng với Sinh/Tử không?

---

## 8. Legacy Data Mapping (Conceptual)
- `genealogy.json/people` → **Person Entity** + **Event Entities (Birth/Death)**.
- `genealogy.json/families` → **Union Relationships**.
- `mach.json/articles` → **Story Entity** + **Mention Relationships**.
- `mach.json/authors` → **Author Entity** + **Person Link**.

## 9. DOMAIN MODEL GATE
**TRẠNG THÁI: READY FOR OWNER REVIEW**
