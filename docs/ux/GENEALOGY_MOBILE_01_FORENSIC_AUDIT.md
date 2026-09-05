# BÁO CÁO AUDIT VÀ TỐI ƯU UX MOBILE GIA PHẢ (GENEALOGY_MOBILE_01)

**Dự án**: Cây Gia Phả Trần Trọng Thu  
**Mã nhiệm vụ**: `GENEALOGY_MOBILE_01 — FORENSIC AUDIT & RESPONSIVE UX`  
**Ngày thực hiện**: 05/09/2026  
**Môi trường**: Production Web (`https://gionghotrantrongthu.vercel.app`) & Local Staging  

---

## 1. TỔNG QUAN (EXECUTIVE SUMMARY)

Khu vực **Gia Phả (Genealogy)** đóng vai trò cốt lõi trong hệ sinh thái tra cứu dòng họ Trần Trọng Thu, bao gồm:
- **Cây Phả Hệ Tương Tác (`#view_tree`)**: Focus Mode (cây phả hệ tiêu điểm phân tầng phụ mẫu - hôn phối - hậu duệ) và Explore Mode (toàn cảnh thế hệ F0–F4).
- **Danh Sách Thành Viên (`#view_people`)**: Thư mục thành viên 223 người với huy hiệu thế hệ.
- **Danh Sách Gia Đình (`#view_families`)**: 68 đơn vị gia đình / nhánh gia phả.
- **Hồ Sơ Thành Viên (`#view_person`) & Hồ Sơ Nhánh Gia Đình (`#view_family`)**: Chi tiết tiểu sử, thân phụ mẫu, hôn phối, con cái, ký ức.

Sau đợt audit thực nghiệm trên thiết bị di động, nhóm kỹ thuật đã phát hiện và khắc phục triệt để các vấn đề tương tác cảm ứng, cấu trúc đồ thị bị gãy tầng, thiếu bộ lọc phân tầng thế hệ và khả năng điều hướng ngược.

---

## 2. PHÂN LOẠI VẤN ĐỀ VÀ KẾT QUẢ KHẮC PHỤC (FORENSIC AUDIT FINDINGS)

| Mã | Mức độ | Khu vực | Hiện trạng ban đầu | Giải pháp khắc phục | Trạng thái |
|:---|:---|:---|:---|:---|:---:|
| **P0-1** | **P0** | Family Graph (`#view_tree`) | Thuộc tính `flex-wrap: wrap` trên `.graph-nodes-cluster` làm các nút Phụ Mẫu và Hôn Phối bị bẻ gãy xuống dòng trên mobile, phá hỏng cấu trúc phân tầng đồ thị phả hệ phẳng. | Chuyển thành `flex-wrap: nowrap; min-width: max-content;` kết hợp canvas panning mượt mà. | ✅ FIXED |
| **P0-2** | **P0** | Family Graph (`#view_tree`) | Thiếu cơ chế Touch Pan (kéo rê 1 ngón) và Pinch-to-Zoom (zoom 2 ngón) trên màn hình cảm ứng, khiến người dùng mobile không thể xem toàn bộ nhánh con cái rộng. | Tích hợp hệ thống 2D Touch Pan (`graphPanX`, `graphPanY`) & Multi-touch Pinch Zoom (`graphScale`), hỗ trợ cả chuột trên desktop. | ✅ FIXED |
| **P1-1** | **P1** | Graph Toolbar (`#view_tree`) | Thanh công cụ nổi `.graph-floating-toolbar` nằm ở góc trên bên phải đè lên card cha mẹ, nút bấm nhỏ ($<30\text{px}$) khó bấm trúng trên ngón tay mobile. | Chuyển xuống góc dưới bên phải trên mobile ($\le 768\text{px}$), tăng kích thước nút lên $\ge 38\text{px}$, bổ sung nút `↩ Quay lại`. | ✅ FIXED |
| **P1-2** | **P1** | Family Filter (`#view_families`) | Thanh lọc thế hệ bị xuống dòng 3 hàng gây chiếm dụng diện tích chiều cao mobile. | Thiết kế thanh trượt ngang `overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none;` mượt mà. | ✅ FIXED |
| **P1-3** | **P1** | People Directory (`#view_people`) | Chưa có thanh lọc thế hệ F0, F1, F2, F3, F4, buộc người dùng phải cuộn qua 223 thẻ thành viên. | Bổ sung `#peopleFilterBar` trượt ngang với số đếm động từng thế hệ và hàm `filterPeopleByGen(gen)`. | ✅ FIXED |
| **P1-4** | **P1** | Profiles (`#view_person`, `#view_family`) | Không có thanh điều hướng quay lại (`.profile-header-nav`), liên kết thân tộc `.rel-link` có vùng chạm nhỏ. | Bổ sung thanh điều hướng quay lại nhanh ("← Quay lại Cây Phả Hệ", "👥 Danh sách") và biến `.rel-link` thành các tactile card ($\ge 42\text{px}$). | ✅ FIXED |
| **P2-1** | **P2** | Breadcrumbs (`#treeRelationPath`) | Tuyến phả hệ trực hệ dài bị tràn ngang màn hình. | Bật chế độ trượt ngang `overflow-x: auto; white-space: nowrap;` không vỡ khung. | ✅ FIXED |

---

## 3. MA TRẬN KIỂM THỬ THIẾT BỊ & VIEWPORT (TEST MATRIX)

| Viewport | Thiết bị đại diện | Định hướng | Kết quả tương tác Tree | Kết quả Thư mục | Kết quả Profile |
|:---|:---|:---:|:---:|:---:|:---:|
| **375 x 812** | iPhone SE / iPhone 13 mini | Dọc | Pan mượt, pinch zoom nhạy, toolbar dưới | Filter trượt 1 dòng, card 1 cột | Nút back to, link thân tộc dễ bấm |
| **390 x 844** | iPhone 12 / 13 / 14 / 15 | Dọc | Nodes thẳng hàng, không gãy hàng phụ mẫu | Lọc F0-F4 tức thì, số lượng chính xác | Layout gọn gàng, rõ ràng |
| **430 x 932** | iPhone 14/15/16 Pro Max | Dọc | Tỷ lệ card hài hòa, gesture mượt | Trượt mượt, font sắc nét | Trải nghiệm xuất sắc |
| **844 x 390** | Smartphone Landscape | Ngang | Không gian canvas rộng, pan 2 chiều mượt | 2 cột card tự nhiên | Profile phân cột cân đối |
| **1024 x 768** | iPad / Tablet | Cả hai | Toolbar góc trên, card cân đối | Grid 2–3 cột | Grid 2 cột sắc nét |
| **1440 x 900** | Desktop / Laptop | Ngang | Drag chuột mượt, nút zoom rõ ràng | Grid 3–4 cột | Profile trải rộng hoàn chỉnh |

---

## 4. CAM KẾT TOÀN VẸN HỆ THỐNG (SYSTEM INTEGRITY & NON-REGRESSION)

- **GEDCOM Data**: Giữ nguyên vẹn 100% tệp `data/family.ged`, `data/gedcom.json`.
- **Lịch & ICS Engine**: Giữ nguyên vẹn tính năng đồng bộ Apple Calendar / Google Calendar và âm dương lịch.
- **MẠCH Publication Engine**: Giữ nguyên vẹn toàn bộ kiến trúc Normalized Block Model, Wikilinks, Footnotes, Typography và tối ưu mobile đã thực hiện ở nhiệm vụ trước.

---

## 5. KẾT LUẬN

Khu vực Gia Phả hiện đã đạt tiêu chuẩn trải nghiệm di động cao cấp, trực quan và thao tác mượt mà trên mọi kích thước màn hình.
