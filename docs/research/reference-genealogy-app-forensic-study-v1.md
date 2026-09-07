# FORENSIC STUDY: REFERENCE GENEALOGY APPLICATION V1

**Date:** 2026-09-07
**Target:** `https://gia-ph-vi-t-977519161602.asia-southeast1.run.app/`
**Purpose:** Nghiên cứu kiến trúc, product logic, và data model của một ứng dụng gia phả mẫu được host trên Google Cloud Run để rút kinh nghiệm cho dự án Gia Tộc Trần Trọng Thu.

---

## 1. Executive Summary
Ứng dụng tham chiếu là một Single Page Application (SPA) xây dựng bằng React (Vite, TailwindCSS) và được triển khai dưới dạng static container trên Google Cloud Run. 
Đây là một sản phẩm mang tính chất "Vibe-coding Prototype" (được sinh ra phần lớn từ prompt qua Google AI Studio), không có backend/database thực sự. Toàn bộ dữ liệu được khởi tạo từ hardcoded JSON và lưu trữ trạng thái qua trình duyệt (`localStorage`).
Kiến trúc này phù hợp để demo nhanh UI/UX nhưng không thể sử dụng làm Production cho một dòng họ thực tế vì không có Data Persistence tập trung, khả năng collaboration (nhiều người cùng biên tập) là số 0, và Data Model quá cứng nhắc.

---

## 2. What Was Actually Observed
- **Giao diện (FACT):** Ứng dụng cung cấp các luồng hiển thị: Cây gia phả (Tổng phả), Danh sách kỷ niệm dòng họ (Yearbook Stories), Lịch giỗ (Scheduled Memorials), và form thêm nhân vật.
- **Tính năng (FACT):** Cung cấp các nút tương tác giả lập thông báo (ví dụ: `🟢 [Zalo OA] Đã gửi thông báo khẩn cấp...`), upload/export dữ liệu qua FileReader (để bù đắp việc thiếu backend).
- **Client-Side Storage (FACT):** Ứng dụng lưu trạng thái tại `localStorage` với các key: `gia_pha_clan_config`, `gia_pha_members`, `gia_pha_posts`, `gia_pha_events`, `gia_pha_user`.
- **Nguồn gốc (INFERENCE):** Thẻ `<title>My Google AI Studio App</title>` bị bỏ quên trong HTML tĩnh là bằng chứng tuyệt đối cho thấy ứng dụng được tạo ra bởi AI prompting trực tiếp.

---

## 3. Product / IA Analysis
- **User Journey:** Người dùng truy cập trực tiếp vào giao diện chính, có thể xem ngay "Tổng phả: X người". 
- **Chức năng Admin:** Không tách biệt không gian Public và Admin. Các thao tác "Thêm người" (`onAddRelative`) hiển thị ngay trên UI public.
- **Hierarchy:** Phẳng. Các module (Gia phả, Bài viết, Lịch) được xếp ngang hàng trên giao diện React state.

---

## 4. Genealogy Logic
- **Đa thê / Đa phu (INFERENCE):** Hệ thống chỉ lưu một `spouseId` duy nhất. Không thể xử lý một người có nhiều vợ/chồng.
- **Con cái (INFERENCE):** Con cái chỉ lưu một `parentId` (đại diện cho huyết thống chính). Không có concept "Gia đình/Union". Nếu một người có con với nhiều vợ/chồng khác nhau, hệ thống này sẽ gặp trục trặc khi vẽ cây hoặc gom nhóm gia đình.
- **Sự kiện (OBSERVED):** Lịch giỗ chạp được tự động tính toán dựa trên `deathDate` của Person, không có một module Rules Engine chuyên sâu để xử lý lịch Âm/Dương phức tạp.

---

## 5. Inferred Data Model

| Concept | Observed | Likely model | Confidence |
|---|---|---|---|
| Person | `id, firstName, lastName, gender, birthDate, deathDate, parentId, spouseId, avatarUrl` | Object phẳng (Flat Record) | High |
| Union/Family | Không tồn tại | Implicit (Dựa vào parentId và spouseId) | High |
| Relationship| Hạn chế | Chỉ có Parent (1) và Spouse (1) | High |
| Event | Có (qua localStorage) | Array of Events | High |
| Place | `birthPlace`, `currentAddress` | Chuỗi văn bản (String) | High |
| Source | Không tồn tại | Không có | High |
| Media | `avatarUrl` | Chuỗi văn bản trỏ tới link | High |

---

## 6. UX Flow Analysis
- **Intent -> Action:** Muốn xem kỷ niệm -> Bấm "Kỷ niệm dòng họ" -> Đọc các bài viết được lưu trong `gia_pha_posts`.
- **Thiếu context:** Việc không có backend khiến UX bị giới hạn trong phạm vi dữ liệu demo.

---

## 7. Architecture / Deployment Observations
- **Frontend:** React, Vite, TailwindCSS, Lucide-react (FACT).
- **Backend/API:** Không có API. Toàn bộ logic chạy trên client (FACT).
- **Persistence:** Trình duyệt người dùng (Local Storage) (FACT).
- **Hosting:** Google Cloud Run (FACT - Từ URL `.run.app`). Sử dụng Cloud Run để host một static bundle (chỉ có nginx/apache trả file tĩnh) là một kiến trúc tốn kém và sai mục đích so với dùng Vercel/Netlify.

---

## 8. AI-Assisted Engineering Observations
Dấu ấn của AI (Google AI Studio) thể hiện rất rõ qua:
- **Tích cực:** Sinh code rất nhanh, UI trông hoàn chỉnh, Tailwind class được áp dụng đẹp mắt, có cả dummy data tiếng Việt rất sinh động (Nguyễn Văn Thành, Lê Thị Mai).
- **Thiếu sót kỷ luật Kỹ thuật (Engineering Discipline):** 
  - AI đã ghép Data Model, Business Logic, và UI Rendering vào chung một file khổng lồ (Monolithic Component).
  - Không có thiết kế Database (dùng localStorage).
  - Data model rất nông (`parentId`, `spouseId` dạng chuỗi 1-1) vì AI thường chọn path of least resistance (cách dễ nhất để ra được kết quả) thay vì thiết kế hệ thống tương thích với các edge-cases của phả hệ học.

---

## 9. Comparison With Our Project

| Area | Reference app | Gia tộc Trần Trọng Thu | Nhận xét |
|---|---|---|---|
| Person model | Cứng nhắc (Flat object) | Normalized (MariaDB) | Model của ta chuẩn xác và mở rộng được. |
| Relationship | Implicit (parentId, spouseId) | Explicit Graph Edges | Của ta là Graph, giải quyết được đa thê, con nuôi. |
| Union/Family | Không tồn tại | Table `families` / Nodes | Của họ mất thông tin về tổ hợp gia đình. |
| Events | Array trong LocalStorage | `calendar_events` trong DB | Của ta hỗ trợ publish/draft, lịch ICS thực tế. |
| Media | Chuỗi String `avatarUrl` | Bảng `media`, file lưu NAS | Quản lý media của ta bảo mật và scale hơn. |
| Admin | Trộn lẫn Public | Control Room độc lập | Ta tách biệt quyền xuất bản và không gian đọc. |
| Data Integrity| Số 0 (Mất khi xoá Cache) | Cao (MariaDB + Backup) | Architecture của họ chỉ là Prototype. |
| Deployment | Cloud Run (Phí phạm cho static) | Vercel (Free Edge) + NAS | Topology của ta tối ưu chi phí và bảo mật dữ liệu. |

### BORROW
- Ý tưởng giả lập thông báo: Có thể thêm Notification UI để báo cho Ban Biên Tập khi có Event quan trọng (nhưng ta sẽ làm qua API thật).

### DIFFERENTIATE
- Tiếp tục duy trì tách biệt Admin Control Room và Public Web.
- Giữ vững Entity Relational Graph trong MariaDB thay vì JSON phẳng.

### AVOID
- Trộn lẫn State, Data, và View vào frontend.
- Cố gắng làm tính năng mạng xã hội (tương tác trực tiếp) khi chưa có hệ thống Auth vững chắc.

### INVESTIGATE
- Cách họ tính ngày giỗ tự động (nếu có logic Âm lịch xịn trong mã nguồn, có thể tái sử dụng algorithm, mặc dù dự án của ta hiện dùng ICS import chuẩn).

---

## 10. Domain Model V1.1 Cross-check
1. **Reference app có entity nào ta thiếu không?** Không. Của họ là tập con (subset) rất nhỏ so với ta.
2. **Ta có entity nào họ không cần?** `Archive Artifact`, `Source`, `Provenance`. Vì họ làm ứng dụng theo hướng "Mạng xã hội gia đình mini" (Vibe-coding) chứ không phải Lưu trữ Di sản Nghiêm túc (Forensic Genealogy).
3. **Có relationship nào họ xử lý tốt hơn?** Không.
4. **Vấn đề cần xem xét?** Không có.
5. **Đủ evidence để đổi Domain Model?** KHÔNG. Kiến trúc và Model hiện tại của Gia Tộc Trần Trọng Thu hoàn toàn vượt trội.

---

## 11. Open Questions
- Không rõ tác giả có ý định gắn Firebase/Supabase vào sau này không, nhưng bản build hiện tại hoàn toàn offline-first (Local Storage).

---
**END OF REPORT**
