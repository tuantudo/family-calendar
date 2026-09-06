# Family Site Domain Model V1.1

## 1. Purpose & Canonical Taxonomy
Tài liệu này xác định các khái niệm cốt lõi tạo nên "Graph of Knowledge" (Đồ thị tri thức) của Gia tộc Trần Trọng Thu. Đây là lớp Khái niệm (Domain Model), tuân thủ nguyên tắc: **Domain Model → Logical Data Model → Database → API → Implementation**.

Để bảo đảm tính nhất quán và giải quyết tính phức tạp của Dữ liệu Lịch sử (nơi thông tin thường mâu thuẫn và cần chứng minh), toàn bộ từ vựng được phân loại vào 4 nhóm Canonical sau:

1. **Entity (Thực thể có Identity độc lập):** 
   - `Person`, `Story`, `Author`, `Archive Artifact`, `Image`, `Event`, `Source`, `Claim/Assertion` (Nhận định), `Union` (Hôn phối - được nâng cấp thành Node).
2. **Reified Relationship / Edge (Cạnh có Identity):** Mối liên kết có cấu trúc, có vòng đời và có thể đính kèm siêu dữ liệu.
   - `Descent` (Hậu duệ), `Mention` (Nhắc đến), `Annotation` (Chú thích), `Evidence` (Bằng chứng), `Representation` (Đại diện kỹ thuật số).
3. **Value Object / Metadata (Giá trị / Siêu dữ liệu):** Không có Identity độc lập, dùng để mô tả Entity hoặc Edge.
   - `DateValue`, `Place`, `Provenance`, `Confidence`.
4. **Derived / Projection (Phái sinh / Hình chiếu):** Không lưu trữ tĩnh mà nội suy từ Đồ thị.
   - `Family`, `Generation`, `Branch`, `Calendar Event`.

---

## 2. Abstraction của Sự Thật (Truth & Proof Abstraction)

### 2.1. Claim / Assertion (Entity)
- **Classification:** `Claim` là một **First-class Entity**, không phải Value Object.
- **Tại sao:** "Sinh năm 1920" hay "Ông A là cha bà B" không phải là chân lý tuyệt đối. Nó là một `Claim`. Vì nó có thể bị tranh cãi, cần được chứng minh, và có vòng đời độc lập, nó buộc phải có Identity.
- **Semantics:** Mọi thuộc tính quan trọng hoặc mối quan hệ huyết thống đều mang bản chất của một `Claim`.

### 2.2. Evidence (Relationship/Edge)
- **Classification:** `Evidence` là một **Edge** nối liền `Claim` ↔ `Source`.
- **Semantics:** Thể hiện việc một `Source` cụ thể đang củng cố (support) hoặc bác bỏ (refute) một `Claim`.

### 2.3. Provenance (Metadata)
- **Classification:** `Provenance` là **Metadata** gắn trên cạnh `Evidence`.
- **Semantics:** Giải thích bối cảnh của bằng chứng. Trả lời: "Ai đã trích xuất Evidence này từ Source, vào lúc nào, phương pháp gì (dịch thuật/sao chép)?".

### 2.4. Confidence (Metadata)
- **Classification:** `Confidence` là **Metadata** gắn trên `Claim`.
- **Semantics:** Đánh giá mức độ tin cậy tổng thể của Claim sau khi tổng hợp các Evidence (Ví dụ: `Certain`, `Probable`, `Disputed`).

---

## 3. Entity Definitions (Thực thể độc lập)

### 3.1. Person
- **Identity:** `PersonID`. Tồn tại vĩnh viễn trong Graph. Dữ liệu có thể bị ẩn (Visibility: Private) nhưng không bị xóa.
- **Attributes:** Name, Aliases (Mảng String). `Living Status`.

### 3.2. Union (Được nâng cấp thành Entity Node)
- **Classification:** `Union` là một **Entity (Relationship Node)** thay vì chỉ là Edge đơn thuần.
- **Tại sao:** Một cuộc Hôn phối có thời gian (Date), địa điểm (Place), và có thể có Evidence/Claim riêng (VD: Giấy đăng ký kết hôn). Nó hoạt động như một Hub nối các Person.

### 3.3. Story & Author
- **Story:** Bài viết (Title, Body, Publish Date).
- **Author:** Người viết. Tách biệt với Person vì có thể là người ngoài họ.

### 3.4. Archive Artifact & Image
- **Archive Artifact:** Khái niệm lịch sử (Cuốn gia bạ, Kỷ vật).
- **Image:** File kỹ thuật số (Scan, Photo).
- **Quy tắc:** 1 Artifact ↔ N Images. Một Image có thể độc lập không gắn với Artifact nào.

### 3.5. Event
- Biến cố lịch sử (Sinh, Mất, Di cư). Có DateValue, Place.

### 3.6. Source
- Nguồn tham khảo (Gia phả giấy, FamilySearch).

---

## 4. Reified Relationship Model (Cạnh có Identity)
Bởi vì Phả hệ là Lịch sử, các Cạnh (Edges) cũng có thể bị tranh cãi và cần được chứng minh. Do đó chúng là *Reified Relationships* (Cạnh mang Identity).

### 4.1. Descent (Hậu duệ)
- `Person` (Child) ↔ `Descent` ↔ `Union` (Parents).
- **Semantics:** Mang metadata `Role` (Biological, Adopted, Step). Được đối xử như một `Claim` (có Confidence và Evidence).

### 4.2. Mention
- `Story` ↔ `Mention` ↔ `Person/Event`.
- **Semantics:** Trích dẫn. Có metadata `Context`.

### 4.3. Annotation
- `Image` ↔ `Annotation` ↔ `Person`.
- **Semantics:** Tag khuôn mặt. Có tọa độ X, Y.

### 4.4. Representation
- `Archive Artifact` ↔ `Representation` ↔ `Image`.
- **Semantics:** Bản số hóa của hiện vật.

---

## 5. Derived / Computed Projections (Khái niệm Phái sinh)
Không lưu cứng (Hardcode). Chỉ tính toán (Project).

- **Family:** Góc nhìn gộp `Union` + `Spouses` + `Children`.
- **Generation:** Khoảng cách ngắn nhất đến Root Anchor `@I1@`.
- **Branch:** Tập hợp Node là hậu duệ của một Node.
- **Calendar Event:** Projection từ `Event` + thuật toán Lịch.

---

## 6. Graph of Knowledge (Canonical Paths)
Mọi Assertion trong hệ thống tuân theo mô hình thống nhất:
1. `Person/Event/Relationship` được định hình bởi các `Claim`.
2. `Claim` có `Confidence` nội tại.
3. `Claim` liên kết với `Source` qua cạnh `Evidence`.
4. Cạnh `Evidence` mang siêu dữ liệu `Provenance`.

Các luồng xuyên chéo:
- Từ `Person` → `Union` → `Person` (Khám phá Phả hệ)
- Từ `Person` → `Mention` → `Story` (Khám phá Ký ức)
- Từ `Person` → `Annotation` → `Image` → `Representation` → `Archive Artifact` (Khám phá Di sản)

---

## 7. DOMAIN MODEL V1.1 GATE
**Trạng thái:** READY FOR OWNER REVIEW

**Explicit statement:** Domain Model V1.1 chưa phải Database Schema. Khái niệm "First-Class Entity" hay "Reified Edge" ở đây nhằm phục vụ *ngữ nghĩa (semantics)* của Graph of Knowledge. Khi chuyển sang Logical Data Model, các khái niệm này sẽ được tối ưu hóa thành Tables hoặc JSONB tùy theo năng lực của MariaDB.
