# Family Site UI Reference Library V1

## 1. Purpose
Tài liệu này tổng hợp các Design Patterns (Mẫu thiết kế) và Reference Sites (Trang tham khảo) từ các lĩnh vực: bảo tàng, lưu trữ lịch sử, phả hệ và báo chí. Mục tiêu là xây dựng một "thư viện bánh xe có sẵn" để không phải phát minh lại các cấu trúc UX/UI đã được chứng minh tính hiệu quả, đồng thời chuẩn bị nguyên liệu thiết kế cho Family Knowledge Application.

## 2. Research Principle
**REFERENCE → DECONSTRUCT → ADAPT → REBUILD**
Không copy nguyên theme. Tách bóc các pattern hữu ích, đánh giá độ tương thích với *Visual Language V1 (The Living Chronicle)*, và tái thiết kế (rebuild) bằng Vanilla HTML/CSS.

## 3. Reference Sources
Nguồn khảo sát bao gồm:
- Nền tảng phả hệ: FamilySearch, Ancestry.
- Viện bảo tàng/Lưu trữ: Rijksmuseum, The Met, National Archives (UK).
- Báo chí/Editorial: NYT, Medium, Typology (WordPress).
- Open-Source/Tools: TimelineJS, Webtrees, Omeka.

---

## 4. Home References (Orientation)

### Ref 1: Rijksstudio (Rijksmuseum)
- **Nguồn:** rijksmuseum.nl/en/rijksstudio
- **Loại:** Museum Digital Archive
- **What is Good:** Lối vào (Entry point) bằng hình ảnh chất lượng cao. Masonry grid chia collection.
- **Why:** Giải quyết bài toán "Làm sao để người dùng choáng ngợp và muốn khám phá kho lưu trữ ngay lập tức".
- **Adaptation:**
  - KEEP: Masonry grid cho Featured Archives.
  - MODIFY: Đổi sang typography phong cách Ledger/Biên niên sử thay vì Sans-serif hiện đại.
- **UX: 5 | Visual: 5 | Adaptability: 3 | Archival: 5 | Complexity: 4**

### Ref 2: NYT Digital Archive
- **Loại:** Editorial Archive
- **What is Good:** Phân cấp thông tin cực mạnh bằng Typography (Headline size, column width).
- **Why:** Giúp định hướng người đọc đâu là Story chính (Featured Mạch), đâu là tin vắn.
- **Adaptation:** Rất phù hợp với *Visual Language V1*. Rebuild lại cách chia cột lưới (Grid) 3-column.

### Ref 3: Ozeum (WP Theme)
- **Nguồn:** ThemeForest
- **Loại:** Exhibition/Museum Theme
- **What is Good:** Header navigation dạng trong suốt, exhibition cards có ngày tháng lớn.
- **Adaptation:** Áp dụng cho khối "Sự kiện sắp tới" (Giỗ, Họp họ) trên trang chủ.

---

## 5. Tree References (Macro Map)

### Ref 1: FamilySearch (Landscape Pedigree)
- **Nguồn:** familysearch.org
- **Loại:** Interactive Genealogy
- **What is Good:** Node dạng thẻ (Card), hiển thị Tên + Năm Sinh/Mất + Avatar nhỏ. Nút expand (+) ở các node có con cháu.
- **Why:** Đây là standard pattern giúp user không bị lạc khi tree mở rộng quá lớn.
- **Adaptation:** KEEP toàn bộ logic UX. MODIFY visual style (bỏ bo tròn, dùng border sắc nét của V1).
- **UX: 5 | Visual: 3 | Adaptability: 5 | Archival: 5 | Complexity: 5**

### Ref 2: Ancestry Fan Chart
- **What is Good:** Biểu diễn tổ tiên theo hình bán nguyệt.
- **Why:** Tiết kiệm không gian ngang. Rất tốt để xem nguồn gốc từ một Person cụ thể.
- **Adaptation:** AVOID cho Phase 1 vì quá phức tạp khi implement bằng DOM/SVG.

### Ref 3: Webtrees (Open-source)
- **What is Good:** Hourglass chart (Đồ thị đồng hồ cát) - Hiển thị cả tổ tiên (trên) và con cháu (dưới) của 1 người.
- **Why:** UX lý tưởng để định vị một người ở giữa dòng chảy lịch sử.

---

## 6. People References (Index)

### Ref 1: National Portrait Gallery (UK)
- **Loại:** Museum People Index
- **What is Good:** Hybrid giữa Grid (ảnh chân dung) và List (thông tin alphabet). Filter mạnh (Theo thời kỳ, theo vai trò).
- **Why:** Tìm người rất nhanh.
- **Adaptation:** Rất hợp. Sử dụng "Archival Mount" (Padding ảnh) của V1 để làm Portrait Grid.
- **UX: 5 | Visual: 4 | Adaptability: 5 | Archival: 5 | Complexity: 3**

### Ref 2: IMDb Cast List
- **What is Good:** Thumbnail tròn/vuông nhỏ bên trái, Tên to bên trên, Vai trò nhỏ bên dưới.
- **Why:** Mật độ thông tin (Density) cao, lướt nhanh trên mobile.

### Ref 3: Wikipedia Category Page
- **What is Good:** Phân nhóm theo Chữ cái (A, B, C) rất rõ ràng.
- **Why:** UX cơ bản và không bao giờ sai đối với Index.
- **Adaptation:** KEEP alphabetical grouping.

---

## 7. Person References (Micro Record)

### Ref 1: Ancestry Profile Page
- **Nguồn:** ancestry.com
- **Loại:** Genealogy Person Page
- **What is Good:** Layout chia 2 cột. Cột trái: Life Story (Timeline các event: Sinh, Cưới, Mất, Di cư). Cột phải: Family (Cha mẹ, Vợ chồng, Con cái).
- **Why:** Phân định rõ ràng giữa SỰ KIỆN (Facts) và QUAN HỆ (Relationships). Đây là UX xuất sắc nhất cho Person Profile.
- **Adaptation:**
  - KEEP: Cấu trúc 2 cột Fact/Relationship.
  - REBUILD: Bổ sung tab/cột thứ 3 cho "Stories" và "Archives" (Backlinks) - thứ Ancestry không mạnh bằng ta.
- **UX: 5 | Visual: 3 | Adaptability: 5 | Archival: 4 | Complexity: 3**

### Ref 2: Wikipedia Biography InfoBox
- **What is Good:** Box tóm tắt (vCard) nằm sát góc phải trên cùng.
- **Why:** User nắm bắt siêu dữ liệu cốt lõi (Core Metadata) trong 3 giây.

### Ref 3: Geni.com Profile
- **What is Good:** Hệ thống Tab (About, Timeline, Media).
- **Why:** Giấu bớt độ phức tạp nếu hồ sơ quá dài.

---

## 8. Story References (Reading)

### Ref 1: Medium / Ghost (Casper)
- **Loại:** Long-form Editorial
- **What is Good:** Cột đọc căn giữa, width tối đa 680px - 720px (để khoảng 70-80 ký tự/dòng). Dropcap đầu đoạn.
- **Why:** Tối ưu hóa trải nghiệm đọc sâu (Deep reading).
- **Adaptation:** Tương thích 100% với *Visual Language V1* (font EB Garamond).

### Ref 2: Typology (WP Theme)
- **Nguồn:** ThemeForest
- **What is Good:** Text-based design. Không cần Featured Image lớn, dùng Typography size khổng lồ để tạo điểm nhấn.
- **Why:** Website gia tộc không phải lúc nào cũng có ảnh nét. UX này cứu các bài viết thiếu ảnh.
- **Adaptation:** Áp dụng thẳng triết lý "Living Chronicle" (Biên niên sử sống).
- **UX: 4 | Visual: 5 | Adaptability: 5 | Archival: 3 | Complexity: 2**

### Ref 3: The Atavist Magazine
- **What is Good:** Inline citations (chú thích nguồn) và margin notes (ghi chú bên lề).
- **Why:** Phù hợp với bài viết lịch sử cần Provenance.
- **Adaptation:** Thiết kế Marginalia (ghi chú lề phải) cho màn hình Desktop.

---

## 9. Archive References (Artifact)

### Ref 1: The Met Collection (Metropolitan Museum of Art)
- **Loại:** Museum Collection
- **What is Good:** Ảnh Artifact khổng lồ. Dưới ảnh là Metadata cực chi tiết (Date, Medium, Dimensions, Credit Line, Provenance). Dưới cùng là Related Objects.
- **Why:** Đáp ứng tính học thuật và khảo cứu.
- **Adaptation:** 
  - KEEP: Khối "Provenance" (Nguồn gốc).
  - MODIFY: Thêm phần "People in this Artifact" để tạo Graph of Knowledge.
- **UX: 5 | Visual: 5 | Adaptability: 4 | Archival: 5 | Complexity: 3**

### Ref 2: Omeka Classic
- **Loại:** Digital Archive Platform
- **What is Good:** Bảng Dublin Core Metadata (Title, Creator, Subject, Identifier).
- **Why:** Standard của ngành lưu trữ.
- **Adaptation:** Dùng UI dạng bảng (Table) đơn giản của V1 để render Metadata.

### Ref 3: DocumentCloud
- **What is Good:** Document Viewer có annotation (highlight text trong ảnh thư tay).
- **Why:** Đọc tài liệu cổ cần giải nghĩa chữ Hán/Nôm. (Future Capability).

---

## 10. Calendar References (Chronology)

### Ref 1: TimelineJS (Knight Lab)
- **Loại:** Interactive Timeline
- **What is Good:** Trục thời gian ngang (Slider), phần nội dung bên trên.
- **Why:** Trực quan hóa tiến trình lịch sử vĩ mô.

### Ref 2: Facebook Timeline (2012 era)
- **What is Good:** Trục dọc (Spine) ở giữa. Thẻ sự kiện xen kẽ Trái - Phải.
- **Why:** Tốt cho danh sách dài các sự kiện cá nhân (Life events).
- **Adaptation:** Dùng cho trang Person (Micro Record), thay vì trang Calendar tổng.

### Ref 3: History.com (This Day in History)
- **What is Good:** Danh sách nhóm theo Năm/Tháng (Group by Year/Month) dạng dọc thẳng đứng.
- **Why:** Dễ lướt, dễ code, dễ tương thích Mobile.
- **Adaptation:** Áp dụng cho trang Calendar (Macro).
- **UX: 4 | Visual: 3 | Adaptability: 5 | Archival: 4 | Complexity: 2**

---

## 11. Pattern Library
Các module UI độc lập (Components) có thể tái sử dụng:

- **Ancestry Split-View (Person Profile):** Cột Timeline trái, Cột Relationships phải.
- **Met Museum Provenance Panel:** Khối UI đóng khung chứa Metadata kỹ thuật.
- **Typology Text-Header:** Header bài viết chỉ có chữ to, mảng màu nền Seal Red, không cần ảnh.
- **Rijksmuseum Masonry Grid:** Lưới ảnh so le cho Archive.
- **FamilySearch Collapsible Node:** Card phả hệ hình chữ nhật, viền mỏng, có nút [+] [-].
- **Marginalia (Margin Notes):** Chú thích dạt ra lề phải màn hình thay vì nằm ở footnote cuối bài.
- **Entity Mention Tag:** Dạng Inline-link nhạt màu, hover hiển thị Tooltip (Mini-card) của Person.

---

## 12. Cross-Page Patterns
- **The Graph Backlink Panel:** Một UI component nằm ở cuối Person, Story, hoặc Archive. Trả lời câu hỏi: "Thực thể này xuất hiện ở đâu khác?".
- **Global Search overlay:** Khung search full-screen, chia kết quả thành 3 cột (Người - Bài viết - Tư liệu).

---

## 13. Best References
1. **Ancestry.com** (Bậc thầy về Person Profile UX).
2. **The Met Collection** (Bậc thầy về Archive Metadata UI).
3. **Typology Theme / Medium** (Bậc thầy về Reading Typography).

---

## 14. Adaptation Matrix
| Pattern | Keep | Modify | Remove/Avoid |
|---|---|---|---|
| Ancestry Person View | Phân tách Life Events và Family | UI quá hiện đại -> Đổi sang Classic Border | Bỏ các nút "Search historical records" |
| Met Archive Panel | Phân cấp Provenance rõ ràng | Background xám -> Đổi sang nền Off-white | Bỏ nút "Buy print" |
| FamilySearch Tree | Logic thẻ Node, Nút Expand | Đổi font sang EB Garamond | Tránh hiệu ứng shadow 3D |

---

## 15. License / Reuse Notes
- Các kiến trúc UX (như chia 2 cột, masonry grid) không có bản quyền, có thể tự do học hỏi (Deconstruct & Rebuild).
- Không sao chép trực tiếp mã nguồn CSS/JS của các hệ thống nói trên. Mọi pattern sẽ được Code lại từ đầu bằng CSS Variable của V1.

---

## 16. What NOT to Copy
- Không copy hiệu ứng Parallax, Animation bay bổng (làm giảm tính học thuật).
- Không copy UI "Bubble/Avatar tròn" kiểu mạng xã hội. Giữ Avatar dạng khung chữ nhật/vuông phong cách ảnh thẻ/lưu trữ (Archival Mount).
- Không copy Hamburger Menu che khuất thông tin. Sử dụng "Ledger-style Book Running Head" (Header như trang sách) của V1.

---

## 17. Recommended Reference Set
### DESIGN REFERENCE SHORTLIST
*Nếu Owner chỉ xem 10 reference để định hình UI, hãy xem:*

**UX MẠNH NHẤT:**
1. **Ancestry (Profile Page):** Học cách chia cột SỰ KIỆN (trái) và QUAN HỆ (phải).
2. **National Portrait Gallery (Index):** Học cách tạo trang People Filter.

**VISUAL/TYPOGRAPHY MẠNH NHẤT:**
3. **Typology (WordPress Theme):** Học cách làm trang Article/Story không cần ảnh vẫn đẹp.
4. **NYT Archives:** Học cách chia lưới tin tức.

**ARCHIVAL MẠNH NHẤT:**
5. **The Met Collection (Object Page):** Học cách bố trí Metadata (Medium, Provenance) và ảnh gốc lớn.
6. **Rijksstudio:** Học cách làm trang Home bằng thư viện ảnh.

**GENEALOGY MẠNH NHẤT:**
7. **FamilySearch (Landscape Tree):** Học cách làm UI Card cho Cây phả hệ.
8. **Webtrees (Hourglass Tree):** Học logic hiển thị tổ tiên và con cháu cùng lúc.

**INTERACTION MẠNH NHẤT:**
9. **Wikipedia (Inline Citations & Infobox):** Học cách liên kết siêu văn bản.
10. **TimelineJS:** Học cách tương tác vuốt thời gian (dành cho Calendar/Story).
