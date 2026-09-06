# INTERACTION ARCHITECTURE V1: THE DISCOVERY WEB

> "CONTENT không phải endpoint. CONTENT là điểm bắt đầu của interaction."

## 1. Core Philosophy
Mọi interaction trên website Gia Tộc Trần Trọng Thu phải tuân theo vòng lặp:
**INTENT → ACTION → RESPONSE → NEXT POSSIBILITY**

Website không phải là một cuốn sách tĩnh để đọc từ đầu đến cuối, mà là một mạng lưới thông tin đa chiều. Mỗi trang phải trả lời được 5 câu hỏi:
1. Người dùng đang muốn làm gì?
2. Website đang mời họ làm gì tiếp theo?
3. Người dùng có thể tương tác ở đâu?
4. Sau hành động đó website phản hồi thế nào?
5. Website dẫn người dùng tới khám phá tiếp theo ra sao?

## 2. Interaction Model per Page

### A. HOME (The Invitation)
- **Hỏi ngầm:** "Bạn muốn bắt đầu từ đâu?"
- **Next Possibility:** Trực tiếp dẫn người dùng rẽ vào 3 nhánh Khám phá vĩ mô (Phả Hệ), Ký ức (Mạch), hoặc Chứng tích (Tư liệu).

### B. PERSON (The Relational Hub)
- **Bản chất:** Không chỉ là một hồ sơ tĩnh.
- **Next Possibility:** Mở ra toàn bộ hệ sinh thái của một con người:
  - Dọc: Cha/Mẹ → Con cái.
  - Ngang: Vợ/chồng → Anh/chị/em.
  - Sâu: Nhảy sang Bài viết (Story) chứa ký ức về người đó.
  - Rộng: Nhảy sang Hình ảnh (Archive) có mặt người đó.
  - Vĩ mô: Trở về vị trí của người đó trên Tree.

### C. STORY (The Narrative Node)
- **Bản chất:** Không chỉ là bài viết độc lập.
- **Next Possibility:** Bối cảnh hóa lịch sử:
  - Tag nhân vật: Click vào tên trong bài viết → Mở hồ sơ Person.
  - Tag địa điểm/thời gian: Dẫn ra các sự kiện cùng thời kỳ (Calendar).
  - Tư liệu đính kèm: Click để xem bản scan thư tay gốc (Archive).
  - Chuỗi (Series): Đọc câu chuyện tiếp theo cùng chủ đề.

### D. ARCHIVE (The Evidence Canvas)
- **Bản chất:** Không chỉ là một Gallery ảnh vô tri.
- **Next Possibility:** 
  - Xem & Phóng lớn (Zoom/Pan) để soi chi tiết văn bản cổ.
  - Đọc Provenance (Nguồn gốc, ai đang giữ bản gốc).
  - Xác định khuôn mặt: Vùng khoanh/Tag tên dẫn ngược về Person Detail.

### E. TREE (The Macro Space)
- **Bản chất:** Không chỉ là sơ đồ tổ chức (org-chart).
- **Next Possibility:** Một không gian địa lý thực sự:
  - Zoom / Pan tự do để nhìn toàn cảnh 5 thế hệ.
  - Focus: Chuyển trung tâm sang một nhánh họ khác.
  - Select: Mở nhanh mini-profile mà không mất context của Tree.
  - Dive: Click sâu vào để sang Person Detail.

### F. SEARCH (The Catalyst)
- **Bản chất:** Không chỉ trả về danh sách kết quả khô khan.
- **Next Possibility:** Gợi ý hướng đi tiếp theo. Tìm tên "Thu" không chỉ ra Person, mà ra cả những Story có nhắc đến cụ Thu, những bức ảnh có cụ Thu.

## 3. Implementation Guardrails
- **No Dead Ends:** Không có trang nào không có lối đi tiếp.
- **Meaningful Feedback:** Mọi cú click phải có phản hồi thị giác ngay lập tức (Quiet Reveal, active state).
- **Context Preservation:** Khi nhảy từ Tree sang Person, hoặc từ Story sang Archive, người dùng luôn phải biết cách quay lại ngữ cảnh trước đó.
