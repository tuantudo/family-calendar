# PROJECT DECISION REGISTER

| ID | Decision | Status | Reason / Context | Impact |
|---|---|---|---|---|
| D01 | MariaDB là Database Source of Truth | APPROVED | SQLite ban đầu gặp lỗi emoji utf8, đồng thời MariaDB có sẵn trên NAS, chịu tải tốt hơn cho graph relational queries. | Mọi CRUD phải đi vào MariaDB (UTF8MB4). Không dùng LocalStorage/JSON làm DB. |
| D02 | Binary media không lưu trong MariaDB | APPROVED | Tránh phình to DB, tận dụng NAS làm storage lý tưởng. DB chỉ giữ metadata và relative path. | API phải có endpoint serve static files (`express.static`). |
| D03 | Cloudflare Tunnel thay vì mở port NAS | APPROVED | Tránh expose IP thật của mạng nội bộ/NAS ra public internet. Tăng tính bảo mật. | NAS cần cài đặt và chạy connector `cloudflared`. |
| D04 | Admin Web là Control Room (Graph Linking Core) | APPROVED | Admin không phải là dashboard thống kê (Analytics) mà là nơi Ban Biên Tập thao tác nối các Entity (Người - Sự Kiện - Mạch). | Trọng tâm thiết kế UI Admin xoay quanh Typeahead và Edge linking. |
| D05 | Không cạnh tranh tính năng GEDCOM với FamilySearch | APPROVED | Sản phẩm tập trung vào tính tự sự (Narrative) và Di sản, không nhằm tạo một bộ máy dò tìm gia phả phức tạp. | Bỏ qua các module import/export GEDCOM phức tạp. |
| D06 | Maintain "Documentary Intimacy" Visual Language | APPROVED | Tôn trọng giá trị thời gian, không làm giao diện SaaS hiện đại bóng bẩy. | Giữ nguyên font EB Garamond, hairline borders, UI phẳng. |
| D07 | Frontend không giữ Ownership dữ liệu | APPROVED | Để đạt được "Dynamic Web", mọi dữ liệu (người, mạch, media refs, calendar) phải gọi từ API. | Xóa thư mục `data/` và `calendars/` khỏi source code frontend. |
| D08 | User Audience & Visibility Model V1 | APPROVED | Website phục vụ đa lớp đối tượng (Public, Member, Family, Self, Admin). Access control định hình Product/UX, không chỉ là technical security. | Mọi module tương lai phải thiết kế UX/Data dựa trên lớp Audience. |
| D09 | People / Actor-Centered Principle | APPROVED | Website là phương tiện communication giữa người với người/tri thức, không phải điểm xuất phát của thiết kế. | Mọi tính năng, IA, UX, access phải bắt đầu từ Actor, nhu cầu và mục đích của họ. |


## D08: USER AUDIENCE & VISIBILITY MODEL V1

**Decision**: Website Gia tộc Trần Trọng Thư không chỉ phục vụ một loại người dùng mà được thiết kế ngay từ bản chất để phục vụ các lớp đối tượng (audience) khác nhau. Mỗi lớp có trải nghiệm, nội dung, và phạm vi visibility phù hợp.
**Status**: APPROVED (Owner Decision)
**Scope**: Toàn bộ kiến trúc sản phẩm, Frontend UX, Backend API, và Database Schema.

**Rationale (Ý nghĩa của từng lớp & Product Principle)**:
Nguyên tắc sản phẩm: *"Audience → Intent → Access → Content → Experience."* Không thiết kế website từ một giao diện duy nhất rồi đắp thêm permission. Access Control là một phần lõi của Product Architecture. 

User Audience Model V1 bao gồm 5 lớp:
1. **PUBLIC (Người ngoài / Chưa xác thực):** 
   - *Mục tiêu:* Khám phá, hiểu dòng họ, tiếp cận lịch sử, văn hóa, con người, di sản được chủ động công khai. 
   - *Giới hạn:* KHÔNG mặc định được xem toàn bộ dữ liệu genealogy.
2. **MEMBER (Thành viên được xác thực):** 
   - *Mục tiêu:* Khám phá sâu hơn, tiếp cận thông tin/nội bộ mở rộng, tham gia đóng góp.
3. **FAMILY (Thành viên thuộc một nhánh/gia đình):** 
   - *Mục tiêu:* Xem thông tin liên quan trực tiếp đến gia đình mình (shared memories, family archive).
   - *Giới hạn:* KHÔNG mặc định xem private data của nhánh khác.
4. **SELF (Chính cá nhân người dùng):** 
   - *Mục tiêu:* Quản lý thông tin cá nhân, xem/kiểm soát dữ liệu riêng tư, profile của bản thân.
5. **ADMIN (Ban biên tập):** 
   - *Mục tiêu:* Quản lý nội dung, duyệt contribution, publish/unpublish, duy trì tính chính xác của Knowledge Graph.

**Visibility Principle**: 
Một resource không nhất thiết có duy nhất một trạng thái PUBLIC/PRIVATE. Visibility phụ thuộc vào: `Identity`, `Membership`, `Family Relationship`, `Ownership/Self`, `Resource`, `Action`, và `Editorial Policy`. 

**Consequence (Product Implication)**:
- **Tách bạch Model**: *USER/AUDIENCE MODEL* (Public, Member, Family, Self, Admin) là cách Owner nhìn sản phẩm. *TECHNICAL AUTHORIZATION MODEL* (Identity + Membership + Relationship + Resource + Action + Visibility) là cách hệ thống thực thi. Hai lớp này liên quan nhưng không đồng nhất.
- **Quy tắc thiết kế tính năng**: Trong các phase phát triển tiếp theo của mọi module (Home, Tree, People, Story, Archive...), phải luôn trả lời được: *"Module này phục vụ audience nào?"* và *"Audience đó được nhìn thấy/làm được gì?"*
- Liên kết với Technical Audit: Quyết định này đặt nền móng lý luận cho báo cáo kiến trúc `docs/architecture/access-control-data-visibility-audit-v1.md`.


## D09: PRODUCT PRINCIPLE — PEOPLE / ACTOR CENTERED

**Decision**: giatoctrantrongthu.com LẤY CON NGƯỜI / ACTOR LÀM TRUNG TÂM. WEBSITE LÀ PHƯƠNG TIỆN COMMUNICATION, KHÔNG PHẢI ĐIỂM XUẤT PHÁT CỦA THIẾT KẾ.
**Status**: APPROVED (Owner Decision)
**Scope**: Toàn bộ tư duy sản phẩm, Information Architecture, UX/UI, Feature, Access Control, Content Visibility, Communication, Workflow và Editorial Model.

**Nội dung nguyên tắc**:
Cây Gia Phả được thiết kế lấy CON NGƯỜI làm trung tâm.

Website chỉ là phương tiện communication giữa những actor khác nhau với con người, gia đình, tri thức, ký ức và cộng đồng của dòng họ.

Vì vậy mọi quyết định về:
- information architecture
- UX/UI
- feature
- access / permission
- content visibility
- communication
- workflow
- editorial model

phải bắt đầu từ actor, nhu cầu, mục đích và mối quan hệ của actor; không được bắt đầu đơn thuần từ database schema hoặc technical capability.

**Actor Model ban đầu**:

| Actor | Vai trò trong hệ thống | Nhu cầu cốt lõi |
|---|---|---|
| Cá nhân | Một người trong / ngoài dòng họ | Tìm hiểu, xác nhận, kết nối, đóng góp |
| Một gia đình | Một đơn vị gia đình | Quản lý, kể lại, bổ sung lịch sử gia đình |
| Ban biên tập | Người bảo tồn/chăm sóc tri thức | Thu thập, kiểm chứng, biên tập, xuất bản |
| Founder | Người đặt mục tiêu và giữ định hướng | Nhìn toàn hệ thống, định nghĩa nguyên tắc, phát triển cộng đồng |
| Công chúng | Người tiếp nhận | Khám phá, đọc, hiểu về dòng họ |

**Lưu ý**:
- Actor không đồng nghĩa với account/user role.
- Một người có thể đồng thời mang nhiều actor/participation context khác nhau.
- "Founder" KHÔNG mặc định đồng nghĩa với "Admin".
- "Ban biên tập" KHÔNG mặc định đồng nghĩa với "Admin".
- Đây là PRODUCT/DOMAIN MODEL; permission model sẽ được thiết kế sau dựa trên nó.

**Nguyên tắc thiết kế (Design Flow)**:

WHO
↓
WHY / INTENT
↓
WITH WHOM / RELATIONSHIP
↓
WHAT NEEDS TO BE COMMUNICATED
↓
WHAT SHOULD THE SYSTEM ENABLE
↓
EXPERIENCE / UI
↓
TECHNOLOGY

Không đảo ngược chuỗi này chỉ vì database hoặc framework hiện tại đã có sẵn một cấu trúc nào đó.

**Design Test**:
Mọi feature mới phải trả lời được:
1. Ai sử dụng?
2. Họ muốn làm gì?
3. Họ đang giao tiếp với ai / với tri thức nào?
4. Hệ thống cần cho họ thấy / làm được gì?
5. Tại sao đây là cách giao tiếp phù hợp?

Nếu không trả lời được → chưa đủ cơ sở để build feature.
