# CÂY GIA PHẢ — STRATEGIC PLAN V1
**Phiên bản**: 1.0
**Ngày**: 2026-09-09
**Trạng thái**: DRAFT — Chờ Owner review và xác nhận các Open Decisions

---

## A. CURRENT STATE AUDIT

### A1. Infrastructure (Đã ổn định)
| Layer | Status | Ghi chú |
|---|---|---|
| MariaDB (NAS) | ✅ PASS | Đang chạy, DB `family_archive` đủ data |
| Node.js API | ✅ PASS | `family-api.service` systemd — auto-start |
| Cloudflare Tunnel | ✅ PASS | `family-site-api-production` HEALTHY |
| Vercel Frontend | ✅ PASS | Static deploy, auto-deploy từ GitHub main |
| Public API | ✅ PASS | https://api.giatoctrantrongthu.com — HTTP 200 |
| Public Web | ✅ PASS | https://giatoctrantrongthu.com — load data thật |

### A2. Routes & Pages hiện tại
| Route | Label | Status |
|---|---|---|
| #/ | Trang Chủ | ✅ Working |
| #/gia-pha | Cây Phả Đồ | ✅ Working |
| #/gia-pha/nhan-vat | Thành viên | ✅ Working |
| #/gia-pha/gia-dinh | Gia đình | ✅ Working |
| #/gia-pha/dong-thoi-gian | Dòng thời gian | ✅ Working |
| #/gia-pha/ky-uc | Ký ức | ✅ Working |
| #/mach | Tập San Mạch | ✅ Working |
| #/tu-lieu | Tư Liệu Gốc | ⚠️ Partial |
| #/lich | Lịch Gia Đình | ✅ Working |
| #/tim-kiem | Tìm kiếm | ✅ Working |

### A3. Những gì đang sai / thiếu
| Vấn đề | Layer | Priority |
|---|---|---|
| Không có Authentication/Authorization | Product | P0 |
| Tất cả data đều PUBLIC (kể cả data nhạy cảm) | Security/Product | P0 |
| Admin POST /api/edges ≠ Public GET genealogy.json (đọc families) | Data Integrity | P1 |
| Admin POST /api/stories ghi relational columns ≠ Public đọc payload | Data Integrity | P1 |
| Logo trên navbar là placeholder SVG generic cây cối | Brand | P1 |
| Brand System thiếu: DNA, Typography, Color, Voice | Brand | P1 |
| Không có Public/Member/Family visibility boundary | Product | P2 |
| Không có Membership request flow | Product | P2 |
| Tư Liệu Gốc chưa có backend data | Feature | P2 |

---

## B. ACTOR MODEL

> **Nguyên tắc**: 5 nhóm audience (D08) KHÔNG phải 5 role ngang hàng. Chúng là lớp ngữ cảnh trải nghiệm khác nhau.

### B1. Phân biệt khái niệm
| Khái niệm | Định nghĩa |
|---|---|
| Actor | Ai đang tương tác với hệ thống |
| Identity | Hệ thống biết Actor là ai không? |
| Membership | Actor có thuộc dòng họ không? |
| Relationship | Actor ở đâu trong phả đồ? |
| Context | Actor đang ở ngữ cảnh nào? |
| Family / Nhà | Đơn vị gia đình trong phả đồ — xác định từ genealogy data |
| Branch / Nhánh | Một nhánh từ một người con của Cụ Thu |
| Clan | Toàn bộ gia tộc |
| Role | Chức năng trong hệ thống — Biên tập viên là Role, không phải Actor type |

### B2. Actor Hierarchy (không phẳng)

```
CÔNG CHÚNG (Chưa có identity)
  ↓
NGƯỜI ĐANG YÊU CẦU XÁC NHẬN (Identity request)
  ↓
MEMBER (Identity + Membership confirmed)
  ├─ VỊ TRÍ TRONG PHẢ ĐỒ → Family / Branch / Clan access
  ├─ SELF: Quản lý thông tin cá nhân của mình
  ├─ FAMILY: "Chuyện trong nhà"
  └─ (Nếu được trao) BIÊN TẬP VIÊN (Editorial Role)
                      └─ FOUNDER / Người giữ định hướng tổng thể
```

**Lưu ý**: "Biên tập viên" = Role được trao cho Member, không phải loại người riêng biệt.

---

## C. IDENTITY / MEMBERSHIP MODEL

| State | Mô tả | Capability |
|---|---|---|
| ANONYMOUS | Chưa xác nhận | Public content only |
| UNVERIFIED | Đã tạo account, chưa xác nhận thuộc dòng họ | Rất hạn chế |
| MEMBER_PENDING | Đã claim, đang chờ xác minh | Read-only pending |
| MEMBER | Đã xác nhận là thành viên | Member content |
| MEMBER_LINKED | Member + đã map vào Person trong phả đồ | Family/Self content |

**Membership Flow (Concept)**:
```
Công chúng → Tìm hiểu → Nhận ra bản thân/người thân
→ "Tôi thuộc dòng họ này" → Yêu cầu xác nhận
→ Ban biên tập xem xét → MEMBER_LINKED
→ Unlock Family/Self content theo quan hệ thực tế
```

> ⚠️ OPEN DECISION OD-01: Cơ chế xác minh cụ thể? Ai approve?

---

## D. RELATIONSHIP MODEL

| Loại quan hệ | Ví dụ | Ảnh hưởng visibility |
|---|---|---|
| Blood | Cha-con, Ông-cháu | Core genealogy access |
| Marriage | Vợ-chồng | Shared household context |
| In-law | Con dâu, Con rể | Partial household access |
| Household | Cùng sống trong "nhà" | "Chuyện trong nhà" |
| Branch | Cùng nhánh F1 của Bà Thi | Branch-level content |
| Clan | Toàn bộ dòng họ | Clan-level content |

---

## E. FAMILY / "CHUYỆN TRONG NHÀ" MODEL

Visibility theo bán kính quan hệ, không phải PUBLIC/PRIVATE đơn giản.

**Ví dụ: Lá thư gửi Clara**
- Clara (Subject/Owner): ✅ Xem
- Cha/Mẹ của Clara: ✅ Xem (Household)
- Anh/Chị/Em ruột: ✅ Xem (Household)
- Cùng nhánh F1: ⚠️ Tùy editorial decision
- Nhánh khác: ❌ Không xem mặc định
- Công chúng: ❌ Không xem

### Content Visibility Matrix

| Content Type | Public | Member | Family | Self |
|---|---|---|---|---|
| Tên, năm sinh/mất | ✅ | ✅ | ✅ | ✅ |
| Phả đồ cơ bản | ✅ | ✅ | ✅ | ✅ |
| Địa chỉ, SĐT | ❌ | ⚠️ | ✅ | ✅ |
| Ngày sinh chi tiết (người sống) | ❌ | ⚠️ | ✅ | ✅ |
| Thư từ, Tự sự cá nhân | ❌ | ❌ | ⚠️ | ✅ |
| "Chuyện trong nhà" | ❌ | ❌ | ✅ | ✅ |
| Tư liệu gốc nhạy cảm | ❌ | ❌ | ⚠️ | ✅ |

> ⚠️ OPEN DECISION OD-02: Rule khác nhau cho người sống vs người đã mất?

---

## F. VISIBILITY / ACCESS MODEL

```
WHO (Identity + Membership state)
  ↓
RELATIONSHIP TO SUBJECT (Genealogy radius)
  ↓
RESOURCE (Content type + visibility classification)
  ↓
CONTEXT (Public browse / Family archive / Self profile)
  ↓
ACTION (Read / Write / Contribute / Publish)
  ↓
EDITORIAL POLICY (Published / Draft / Private / Household-only)
  ↓
ACCESS DECISION
```

Cần **Relationship-Based Access Control (ReBAC)**, không chỉ RBAC.

> ⚠️ OPEN DECISION OD-03: ReBAC implementation strategy?

---

## G. BRAND SYSTEM AUDIT

### G1. Canonical Brand Source: `/Users/tuantq/Projects/Personal/Brand Systems/`

**Hiện trạng**: Chỉ có thư mục Logo/. Thiếu: Brand DNA, Typography, Color, Voice, Graphic language.

### G2. Logos

| File | Format | Dimensions | Đặc điểm |
|---|---|---|---|
| logoGiaToc_ngang.svg | SVG Vector | viewBox 3421×623 | Wordmark ngang — scalable |
| logoGiaToc.jpg | JPEG Raster | 11948×3566px, 967KB | Dạng landscape, raster |

**SVG Wordmark analysis**: Màu duy nhất #231f20 (off-black). Hoàn toàn typographic — không có icon/symbol riêng.

> ⚠️ OPEN DECISION OD-04: Logo nào là PRIMARY? Dùng ở đâu (Navbar / Hero / Footer / Favicon)?
> ⚠️ OPEN DECISION OD-05: logoGiaToc.jpg có bản SVG không?

---

## H. TYPOGRAPHY / LOGO FINDINGS

Font trong logo SVG là một serif display riêng — KHÔNG phải EB Garamond. Đây có thể là Brand Font chưa được document.

> ⚠️ OPEN DECISION OD-06: Font trong logo là font gì? Có webfont license không?
> ⚠️ OPEN DECISION OD-07: Brand color palette chính thức?

---

## I. BRAND → WEB MAPPING

**Lý tưởng**:
```
Brand Systems → Brand DNA → Typography → Color → Editorial Voice
  ↓
CSS Design Tokens → Component Library → Product Experience
```

**Thực tế hiện tại**:
```
Brand Systems → 2 file Logo
Web → EB Garamond + Inter + màu kem (không có Design System document)
```

**Điểm tốt hiện tại**: Tone "Documentary Intimacy" — hairline borders, uppercase labels, typography-heavy layout phù hợp với tự sự/lưu trữ.

---

## J. DESIRED STATE

```
giatoctrantrongthu.com là:
Tiếng nói chính thức của Gia tộc Trần Trọng Thu với xã hội —
trình bày lịch sử, di sản, câu chuyện và con người.

Đồng thời là không gian nội bộ đa tầng cho các thành viên
để kết nối, đóng góp và lưu giữ ký ức theo đúng
bán kính quan hệ của từng người.
```

---

## K. GAPS

| Gap | Priority |
|---|---|
| Brand Systems thiếu: DNA, Typography, Color, Voice | P0 |
| Không có Authentication | P0 |
| Tất cả data Public (không có visibility boundary) | P0 |
| Font trong logo chưa identify | P1 |
| Admin/Public data path mismatch | P1 |
| Membership flow chưa có | P2 |
| ReBAC model chưa design | P2 |

---

## L. REQUIRED DECISIONS (OPEN DECISIONS)

| ID | Câu hỏi | Priority |
|---|---|---|
| OD-01 | Cơ chế xác minh Membership? Ai approve? | P1 |
| OD-02 | Privacy rule cho người sống vs người đã mất? | P1 |
| OD-03 | ReBAC implementation strategy? | P2 |
| OD-04 | Primary logo là logo nào? Dùng ở đâu? | P1 |
| OD-05 | logoGiaToc.jpg có bản vector không? | P1 |
| OD-06 | Font trong logo SVG là font gì? Webfont license? | P1 |
| OD-07 | Brand color palette chính thức? | P1 |
| OD-08 | Public homepage nói gì với xã hội? | P1 |
| OD-09 | Family boundary theo Household hay Branch? | P2 |
| OD-10 | Founder role khác Admin thế nào? | P2 |

---

## M. STRATEGIC ROADMAP

### PHASE 0 — Foundation Decisions (Ngay bây giờ)
- [ ] Owner review và trả lời OD-01 đến OD-10
- [ ] Bổ sung Brand Systems: DNA, Typography, Color, Voice
- [ ] Xác định Primary Logo và usage rules
- [ ] Xác định Privacy model cho người còn sống

### PHASE 1 — Brand Foundation (Sau Phase 0)
- [ ] Brand Font vào web (nếu có license)
- [ ] CSS Design Tokens từ Brand System
- [ ] Optimize logo assets
- [ ] Fix favicon từ logo thật
- [ ] Redesign Homepage hero — "tiếng nói của dòng họ"
- [ ] Document Design System cơ bản

### PHASE 2 — Public Experience (Sau Phase 1)
- [ ] Visibility filter: Public-only content ra ngoài
- [ ] Fix Admin/Public data path mismatch
- [ ] Membership Invitation flow
- [ ] Privacy: Ẩn thông tin nhạy cảm người sống

### PHASE 3 — Identity & Membership (Sau Phase 2)
- [ ] Authentication system
- [ ] Membership request + approval workflow
- [ ] Account → Person mapping
- [ ] Member-only content layer

### PHASE 4 — Family / Relationship / Visibility (Sau Phase 3)
- [ ] ReBAC model implementation
- [ ] Family archive theo bán kính quan hệ
- [ ] Self profile management
- [ ] "Nhà" boundary implementation

### PHASE 5 — Editorial (Sau Phase 4)
- [ ] Role system: Trao/thu hồi editorial capability
- [ ] Contribution → Review → Publish workflow
- [ ] Draft/Published/Private state management

### PHASE 6 — Advanced (Tương lai)
- Community features
- Mobile experience
- FamilySearch integration

---

## N. DOCUMENTS CREATED / UPDATED

| File | Action |
|---|---|
| docs/product/CAY_GIA_PHA_STRATEGIC_PLAN_V1.md | CREATED (file này) |
| index.html | UPDATED (logo navbar + brand validation strip) |
| assets/images/logoGiaToc_ngang.svg | ADDED (copy từ Brand Systems) |
| assets/images/logoGiaToc.jpg | ADDED (copy từ Brand Systems) |

---

## O. 2 LOGOS TRÊN WEB

| Logo | Vị trí | File | Render |
|---|---|---|---|
| logoGiaToc_ngang.svg | Navbar brand-logo | assets/images/logoGiaToc_ngang.svg | height:28px (navbar), height:56px (validation strip) |
| logoGiaToc.jpg | Brand Validation Strip homepage | assets/images/logoGiaToc.jpg | max-width:320px |

**Brand Validation Strip** nằm tại cuối section `#view_home` (Homepage), có label "Brand Validation — Owner Review". Strip này sẽ được xoá sau khi Brand Decision được xác nhận.

---

## P. VERIFICATION

Sau khi commit + deploy Vercel, kiểm tra tại https://giatoctrantrongthu.com:
- [ ] Navbar: Logo SVG hiển thị thay thế icon cây generic
- [ ] Homepage cuối trang: Brand Validation Strip với 2 logos
- [ ] Logo SVG scale tốt ở mọi viewport
- [ ] Logo JPG đúng tỷ lệ

---
*Tài liệu này là PLANNING document. Mọi Implementation phase phải được Owner approve trước khi thực hiện.*
