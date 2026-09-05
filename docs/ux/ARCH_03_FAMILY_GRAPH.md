# CÂY GIA PHẢ — FAMILY GRAPH & GENERATION SYSTEM ARCHITECTURE (ARCH_03)

## 1. Generation Model (Mô Hình Thế Hệ)
- **Family Anchor**: Giuse Trần Trọng Thu (`@I1@` / `G5X4-48S`) làm gốc quy chiếu thế hệ ($F_0$).
- **Nguyên tắc phân tầng**:
  - $F_{-1}$: Tiền nhân / Thân phụ, thân mẫu của Family Anchor (Cụ Trần Văn Luận & Cụ Lê Thị Đạt).
  - $F_0$: Family Anchor (Ông Cố Giuse Trần Trọng Thu) và hôn phối ($F_0$ Spouses).
  - $F_1$: Con cái trực hệ của Family Anchor (Đời con) và các dâu/rể thuộc thế hệ F1.
  - $F_2$: Cháu nội/ngoại trực hệ (Đời cháu) và dâu/rể F2.
  - $F_3$: Chắt (Đời chắt) và dâu/rể F3.
  - $F_4$: Chút (Đời chút) và dâu/rể F4.
- **Tính toán động (Dynamic Graph Derivation)**:
  - Thế hệ $F_k$ không được gán cứng vào dữ liệu thô mà được suy diễn (derived) qua thuật toán Breadth-First Search (BFS) duyệt từ Family Anchor qua các liên kết `FAMC` (con cái: $+1$), `FAMS` (hôn phối: $+0$), và `parents` (tiền nhân: $-1$).

---

## 2. Hệ Thống Màu Thế Hệ (Generation Color Coding)

Màu sắc được sử dụng như tín hiệu ngữ nghĩa (semantic signal), áp dụng cho Generation Badge, Border viền trái (`border-left: 4px solid`) và nền nhạt (`subtle background tint`):

- **$F_0$ (Family Anchor / Tiền nhân)**: `Deep Royal Navy` (`#1e3a8a`, nền `#eff6ff`) — Biểu tượng cội nguồn gia tộc.
- **$F_1$ (Đời Con)**: `Emerald Heritage` (`#047857`, nền `#ecfdf5`) — Nhánh con cái trực hệ.
- **$F_2$ (Đời Cháu)**: `Warm Amber Gold` (`#b45309`, nền `#fffbeb`) — Thế hệ trưởng thành gầy dựng ký ức gia đình.
- **$F_3$ (Đời Chắt)**: `Indigo Blossom` (`#4338ca`, nền `#eef2ff`) — Thế hệ đương thời đông đảo nhất.
- **$F_4$ (Đời Chút)**: `Rose Crimson` (`#be185d`, nền `#fdf2f8`) — Mầm non hậu duệ tương lai.

---

## 3. Focus Person & Interactive Pedigree Layout
- **Focus Person Model**: Cho phép chọn bất kỳ thành viên nào làm trung tâm phả đồ hiển thị 3 thế hệ liền kề (Tiền nhân $\rightarrow$ Bản thân & Hôn phối $\rightarrow$ Hậu duệ).
- **Quy tắc bất biến**: Khi thay đổi Focus Person, **Family Generation ($F_0, F_1, F_2...$) của mỗi người vẫn được giữ nguyên** theo mốc chuẩn của Ông Cố Thu.
- **Đường dẫn quan hệ (Relationship Breadcrumbs)**: Khi chọn một người, hiển thị đường dẫn phả hệ từ Cố Thu đến người đó (Ví dụ: `Giuse Trần Trọng Thu` $\rightarrow$ `Antôn Trần Trọng Thư` $\rightarrow$ `Trần Quốc Tuấn`).

---

## 4. Quyết Định Thư Viện & Khả Năng Tương Thích (Library Decision)
- Sử dụng **Vanilla SVG & Modern CSS Grid Layout** native, không phụ thuộc vào thư viện bên ngoài nặng nề (như React Flow hay Cytoscape bundle lớn).
- Đảm bảo tải tức thì (< 10ms), tương thích 100% với môi trường tĩnh GitHub Pages, hỗ trợ cảm ứng cuộn ngang và zoom mượt mà trên thiết bị di động (Mobile Responsive).
