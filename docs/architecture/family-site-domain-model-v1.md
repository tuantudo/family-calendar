# Family Site Domain Model V1.1

## 1. Purpose & Canonical Taxonomy
Tài liệu này xác định các khái niệm cốt lõi tạo nên "Graph of Knowledge" (Đồ thị tri thức) của Gia tộc Trần Trọng Thu. Đây là lớp Khái niệm (Domain Model), tuân thủ nguyên tắc: **Domain Model → Logical Data Model → Database → API → Implementation**. Không chứa thiết kế SQL hay API.

Để bảo đảm tính nhất quán (Consistency), toàn bộ từ vựng (Vocabulary) được phân loại vào 4 nhóm Canonical sau:

1. **Entity (Thực thể):** Có Identity độc lập. 
   - `Person`, `Story`, `Author`, `Archive Artifact`, `Image`, `Event`, `Source`.
2. **Relationship / Edge (Cạnh đồ thị):** Mối liên kết có cấu trúc giữa 2 Entities.
   - `Union` (Hôn phối), `Descent` (Hậu duệ/Con cái), `Mention` (Nhắc đến), `Annotation` (Chú thích), `Representation` (Đại diện kỹ thuật số).
3. **Value Object / Metadata (Giá trị / Siêu dữ liệu):** Không có Identity độc lập, dùng để mô tả Entity hoặc Relationship.
   - `Claim/Assertion` (Nhận định/Sự kiện thông tin), `DateValue`, `Place`, `Provenance`, `Confidence`.
4. **Derived / Projection (Phái sinh / Hình chiếu):** Các khái niệm không được lưu trữ tĩnh mà được tính toán/nội suy từ Đồ thị.
   - `Family`, `Generation`, `Branch`, `Calendar Event`.

*(Ghi chú: Từ vựng "Appearance", "Fact" đã bị loại bỏ/thay thế để đảm bảo tính nhất quán của Taxonomy).*

---

## 2. Value Objects & Metadata (Cốt lõi của Tính chính xác)

### 2.1. Claim / Assertion (Thay thế cho "Fact")
- **Vấn đề:** Trong phả hệ, thông tin thường xuyên mâu thuẫn. "Sinh năm 1920" không phải là một Chân lý (Absolute Truth) mà là một Nhận định (Claim).
- **Semantics:** Mọi thuộc tính quan trọng (Ngày sinh, Ngày mất) hoặc Cạnh đồ thị (Quan hệ cha con) đều là một `Claim`. Mỗi `Claim` có thể đi kèm với `Provenance` và `Confidence`.

### 2.2. Source, Provenance & Evidence
- **Source:** Thực thể gốc cung cấp thông tin (VD: "Sổ gia bạ ông A", "Tài khoản FamilySearch").
- **Evidence:** Sự liên kết (Link) mang tính trích dẫn giữa một `Source` và một `Claim`. Một `Source` có thể support nhiều `Claim`. Một `Claim` có thể được chứng minh bằng nhiều `Source`.
- **Provenance:** Siêu dữ liệu của Evidence, trả lời câu hỏi: "Ai đã trích xuất thông tin này từ Source, vào lúc nào, thông qua phương pháp gì?".
- **Confidence:** Đánh giá mức độ tin cậy của Claim: `Certain` (Chắc chắn), `Probable` (Có khả năng), `Disputed` (Tranh cãi), `Unresolved` (Chưa rõ).

### 2.3. DateValue
- Phải xử lý được sự không chắc chắn và lịch pháp: Exact Date (Ngày chính xác), Approximate (Khoảng/Circa), Range (Từ năm - Đến năm), Lunar (Âm lịch), Solar (Dương lịch).

### 2.4. Place
- Hiện tại là một Text Value (Chuỗi văn bản). (Chưa nâng cấp thành Entity vì chưa có Use Case quản lý tọa độ GIS độc lập).

---

## 3. Entity Definitions (Thực thể độc lập)

### 3.1. Person
- **Identity:** `PersonID`.
- **Lifecycle & Visibility:** `Person` tồn tại vĩnh viễn về mặt Identity (Identity permanence). Dữ liệu có thể bị merge (nếu trùng) hoặc đánh dấu ẩn (Visiblity: Private) nếu người đó còn sống và không muốn công khai, nhưng Node không bao giờ bị xóa khỏi Graph để giữ tính toàn vẹn của huyết thống. 
- **Attributes:** Name, Aliases (Mảng String). `Living Status` (Sống/Mất).

### 3.2. Story & Author
- **Story:** Bài viết (Title, Body, Publish Date).
- **Author:** Người viết (Pen Name, Bio). (Tách biệt với Person vì một bài viết có thể do người ngoài họ chấp bút).

### 3.3. Archive Artifact & Image
- **Vấn đề giải quyết:** Tách bạch giữa Vật lý và Kỹ thuật số.
- **Archive Artifact:** Một hiện vật vật lý hoặc logic (Sổ gia bạ, Kỷ vật).
- **Image:** Một file kỹ thuật số (Scan, Photo).
- **Lifecycle:** Một `Image` có thể đại diện (Representation) cho một `Artifact` (1 Artifact ↔ N Images). Nhưng một `Image` cũng có thể đứng độc lập (VD: Ảnh chụp chân dung hiện đại của một Person mà không gắn với Artifact lịch sử nào).

### 3.4. Event
- **Semantics:** Một biến cố xảy ra trong không gian/thời gian.
- **Attributes:** Event Type, DateValue, Place, N Participants (liên kết tới Person). Một Event có thể có Provenance riêng.

### 3.5. Source
- Nguồn tham khảo (Tên nguồn, Tác giả nguồn, URL hoặc Vị trí lưu trữ).

---

## 4. Relationship / Edge Model (Mạng lưới Liên kết)

### 4.1. Union (Hôn phối / Đối tác)
- `Person A` ↔ `Union` ↔ `Person B`.
- **Semantics:** Giải quyết triệt để đa thê, tái giá, không kết hôn nhưng có con chung. Một Person có thể tham gia N `Union`.

### 4.2. Descent (Hậu duệ / Con cái)
- `Person` (Child) ↔ `Descent` ↔ `Union` (Parents).
- **Semantics:** Cạnh này chứa Metadata `Role` để phân biệt: Biological (Huyết thống), Adopted (Con nuôi), Step (Con riêng), Foster/Guardian (Nuôi dưỡng/Bảo hộ). Cạnh này cũng mang `Confidence` (VD: "Có khả năng là con ông A" -> Confidence: Probable).

### 4.3. Mention
- `Story` ↔ `Mention` ↔ `Person/Event`.
- **Semantics:** Nhắc đến. Có metadata `Context` (Đoạn trích dẫn).

### 4.4. Annotation
- `Image` ↔ `Annotation` ↔ `Person`.
- **Semantics:** Đánh dấu (Tag) một người xuất hiện trong một bức ảnh kỹ thuật số. Cạnh này thay thế hoàn toàn cho khái niệm "Appearance" mơ hồ trước đó.

---

## 5. Derived / Computed Projections (Khái niệm Phái sinh)

Đây là các Computed Views, tuyệt đối KHÔNG lưu cứng (Hardcode) thành cấu trúc bảng độc lập nếu hệ thống có thể tính toán được theo thời gian thực (hoặc caching).

### 5.1. Generation (Đời / Thế hệ)
- **Semantics:** Độ dài đường đi ngắn nhất (Shortest Path) qua các cạnh `Descent` tính từ Root Anchor (`@I1@`).
- **Edge cases:** Nếu Node bị đứt gãy (Missing parent) hoặc thuộc Root khác (Người ngoài họ kết hôn vào), Generation = `Undefined` hoặc tính theo Root phụ.

### 5.2. Branch (Chi / Phái)
- **Semantics:** Tập hợp tất cả các Node là hậu duệ của một `Person` cụ thể (Người đứng đầu Chi). Là kết quả của Graph Traversal, không phải một Entity độc lập.

### 5.3. Family
- **Semantics:** Góc nhìn (UI Projection) bao gồm `Union` + 2 Spouses + Danh sách Children (qua cạnh `Descent`).

### 5.4. Calendar Event
- **Semantics:** Là Projection (Hình chiếu) của các `Event` có thật lặp lại hàng năm (VD: Death Event -> Lịch Giỗ).
- **Lưu ý Lịch pháp:** Hệ thống lấy `DateValue` của Event gốc, áp dụng luật Âm/Dương lịch để project ra danh sách ngày tháng của năm hiện tại. Không tồn tại Entity `Calendar Event`.

---

## 6. Graph of Knowledge (Canonical Paths)
Sử dụng chính xác 100% Vocabulary đã định nghĩa:

1. Phả hệ: `Person` ↔ `Union` ↔ `Person`
2. Hậu duệ: `Person` ↔ `Descent` ↔ `Union`
3. Trích dẫn: `Story` ↔ `Mention` ↔ `Person`
4. Hình ảnh: `Image` ↔ `Annotation` ↔ `Person`
5. Hiện vật: `Archive Artifact` ↔ `Representation` ↔ `Image`
6. Sự kiện: `Person` ↔ (Tham gia) ↔ `Event`
7. Nguồn gốc: `Claim` (Thuộc tính hoặc Cạnh) ↔ `Evidence` ↔ `Source`

---

## 7. Consistency with Page Model & Architecture
Đối chiếu chéo (Cross-check) với Interaction Model: INTENT → ACTION → RESPONSE → NEXT POSSIBILITY.

- **Home:** View tổng hợp từ các Node (Story, Archive Artifact) nổi bật.
- **Tree:** Render trực tiếp từ tập hợp các cạnh `Union` và `Descent`.
- **People:** Query danh sách `Person`, filter theo `Living Status` hoặc `Generation`.
- **Person (Micro Record):** Dùng `PersonID` để fetch: Life Events (`Event`), Family (`Union`, `Descent`), Backlinks (`Mention`, `Annotation`). -> Hoàn toàn đáp ứng khả năng cross-linking.
- **Story:** Fetch `Story`, lấy ra mảng `Mention` để tạo hyperlink tương tác.
- **Archive:** Fetch `Archive Artifact`, lấy `Representation` ra `Image`, từ Image lấy `Annotation` ra `Person`.
- **Calendar:** Tính toán projection từ mảng `Event` có `DateValue`.

Mô hình này hoàn toàn tương thích và đủ dữ liệu hỗ trợ cấu trúc UI của *The Living Chronicle*.

---

## 8. DOMAIN MODEL V1.1 GATE

**Trạng thái:** READY FOR OWNER REVIEW

**1. Những điểm đã sửa:**
- Loại bỏ từ vựng "Appearance" và "Fact", thay bằng Canonical Vocabulary: `Annotation` và `Claim/Assertion`.
- Thay đổi cấu trúc Huyết thống: Tách biệt `Union` (Hôn phối) và `Descent` (Hậu duệ) để xử lý mọi edge-case (Con nuôi, Con riêng, Tái giá).
- Làm rõ cấu trúc Lịch sử: Tách `Source`, `Evidence`, `Provenance`, `Confidence`.

**2. Những contradiction đã giải quyết:**
- Giải quyết mâu thuẫn "Person có trong Ảnh nhưng không có Artifact" bằng cách tách Image thành Entity độc lập, nối với Artifact qua cạnh `Representation`.

**3. Những concept đã bị loại/giữ/thêm:**
- **Loại:** `Family`, `Calendar Event` (chuyển sang Derived Views).
- **Thêm:** `Descent` (Relationship), `Claim`, `DateValue` (Value Objects).

**4. Những ambiguity còn lại:**
- Định dạng (Formatting) chính xác của `DateValue` để cover cả ngày tháng Âm lịch truyền thống Việt Nam và Ngày Dương lịch phương Tây chưa được mô hình hóa ở mức độ Data Structure (Sẽ giải quyết ở Data Model).

**5. Những vấn đề mà Database Design sau này phải tôn trọng:**
- Dữ liệu có tính Đồ thị (Graph) rất mạnh. Rất nhiều mối quan hệ M:N.
- Khái niệm `Claim` đòi hỏi cấu trúc Database phải hỗ trợ lưu Metadata (Provenance/Confidence) ngay trên các Bảng nối (Pivot Tables / Edges).

**6. Explicit statement:**
> "Domain Model V1.1 chưa phải Database Schema. Đây hoàn toàn là lưới khái niệm (Conceptual Framework) làm tiền đề cho thiết kế Logical Data Model."
