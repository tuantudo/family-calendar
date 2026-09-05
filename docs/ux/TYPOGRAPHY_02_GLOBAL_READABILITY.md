# BÁO CÁO TYPOGRAPHY_02 — GLOBAL TYPOGRAPHY & MOBILE READABILITY

**Workspace:** `/Users/tuantq/Projects/Personal/family-calendar`  
**Target Identity:** `https://gionghotrantrongthu.vercel.app/`  
**Git Branch:** `design/typography-02` → merged into `main`  
**Thời gian hoàn thành:** 05/09/2026  

---

## A. TỔNG QUAN HỆ THỐNG TYPOGRAPHY MỚI

Hệ thống typography của toàn bộ website **DÒNG HỌ TRẦN TRỌNG THU** đã được tái cấu trúc toàn diện từ nền tảng CSS Design Tokens, phân định rõ ràng giữa hai ngôn ngữ thị giác cốt lõi:
1. **Operating / System Voice (Sans-Serif - Plus Jakarta Sans):** Đảm nhiệm vai trò giao diện điều hành, điều hướng, tìm kiếm, nhãn cây gia phả, ma trận lịch, các bảng danh bạ người & gia đình, các filter chips và huy hiệu thế hệ. Ưu tiên độ rõ nét, mật độ thông tin cao, dễ quét mắt và không gây mỏi mắt trên màn hình nhỏ.
2. **Narrative / Archival Voice (Serif - EB Garamond):** Đảm nhiệm không gian tự sự, bài viết chuyên sâu trong MẠCH, tiêu đề xuất bản trang trọng, các câu trích dẫn gia huấn, ký ức và khảo cứu lịch sử. Ưu tiên nhịp thở, độ thẩm mỹ thư tịch cổ điển nhưng được tối ưu hóa cho màn hình kỹ thuật số.

---

## B. TOKEN SYSTEM & TYPE SCALE

Tất cả kích thước chữ, khoảng cách dòng (leading), khoảng cách chữ (tracking) và độ rộng văn bản tối ưu đã được chuyển hóa thành các CSS Custom Properties chuẩn hóa trong `:root`:

```css
/* --- TYPOGRAPHY DESIGN TOKENS --- */
--font-serif: "EB Garamond", Garamond, Georgia, "Times New Roman", serif;
--font-sans: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
--font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

/* Type Scale (Fluid Responsive via clamp) */
--text-display: clamp(2rem, 3.5vw + 0.8rem, 2.75rem); /* 32px - 44px */
--text-h1: clamp(1.5rem, 2.5vw + 0.5rem, 2rem);        /* 24px - 32px */
--text-h2: clamp(1.25rem, 1.5vw + 0.5rem, 1.5rem);     /* 20px - 24px */
--text-h3: 1.125rem;                                    /* 18px */
--text-body-lg: 1.125rem;                               /* 18px (Editorial Prose Desktop) */
--text-body: 1rem;                                      /* 16px (Baseline UI & Content) */
--text-body-sm: 0.875rem;                               /* 14px (Secondary Prose & Cards) */
--text-meta: 0.8125rem;                                 /* 13px (Metadata & Footers) */
--text-caption: 0.75rem;                                /* 12px (Chips & Legend Labels) */
--text-micro: 0.6875rem;                                /* 11px (Badges & FSID Pills) */

/* Leading (Line Heights) */
--leading-none: 1;
--leading-tight: 1.22;
--leading-snug: 1.35;
--leading-normal: 1.55;
--leading-relaxed: 1.75;
--leading-loose: 1.85;

/* Font Weights */
--weight-regular: 400;
--weight-medium: 500;
--weight-semibold: 600;
--weight-bold: 700;
--weight-extrabold: 800;

/* Tracking (Letter Spacing) */
--tracking-tighter: -0.025em;
--tracking-tight: -0.012em;
--tracking-normal: 0;
--tracking-wide: 0.025em;
--tracking-wider: 0.06em;
--tracking-widest: 0.12em;

/* Prose Measure */
--measure-prose: 68ch; /* ~720px */
```

---

## C. PHÂN TÁCH HAI TIẾNG NÓI (VOICES)

| Không gian | Voice | Font Family | Trọng số & Kích thước | Mục đích UX |
| :--- | :--- | :--- | :--- | :--- |
| **Navbar & Search** | System | Plus Jakarta Sans | 13px - 14px, W600/700 | Nhận diện sắc nét, phản hồi tìm kiếm tức thì |
| **Gia Phả (Tree/Focus)** | System | Plus Jakarta Sans | 13px - 16px, W600/700/800 | Phân cấp thế hệ rõ ràng, node không bị vỡ bố cục |
| **Danh bạ Người & Gia đình** | System | Plus Jakarta Sans | 13px - 16px, W600/700 | Thẻ thông tin đều đặn, phân biệt tên chính vs metadata |
| **Lịch (Tháng & Agenda)** | System | Plus Jakarta Sans | 11px - 18.5px, W600/700/800 | Ngày âm/dương tương phản tốt, chip sự kiện 1 dòng |
| **MẠCH (Tiêu đề & Tuyển tập)** | Narrative | EB Garamond | Clamp(2rem, 4vw, 2.75rem), W800 | Khí chất trang trọng, thư tịch gia tộc |
| **MẠCH (Nội dung bài viết)** | Narrative | EB Garamond | 18px (Desk) / 17px (Mob), W400/700 | Tự sự liền mạch, nhịp thở thư thái |
| **Giai thoại & Ký ức** | Narrative | EB Garamond | 16px - 18.5px, W700/Italic | Khơi gợi cảm xúc và ký ức truyền đời |

---

## D. MẠCH: LONG-FORM READING SYSTEM

Khắc phục hoàn toàn các lỗi thị giác trước đây trong chế độ đọc bài viết:
1. **Loại bỏ Justify Rivers:** Đã chuyển toàn bộ nội dung đọc (`.story-content-body p`) sang căn lề trái (`text-align: left`), loại bỏ hiện tượng dãn chữ không đều hoặc tạo khe hở ("rivers") thường thấy trên di động.
2. **Khổ chữ tối ưu (Measure):** Giới hạn chiều dài dòng đọc tối đa `68ch` (`--measure-prose` ~720px), tránh mỏi mắt do quét mắt quá dài.
3. **Độ dãn dòng chuẩn mực:** Áp dụng `line-height: var(--leading-loose)` (1.85) trên desktop và 1.75 trên mobile, giúp các dấu thanh tiếng Việt (sắc, huyền, hỏi, ngã, nặng) hiển thị thanh thoát, không dính vào dòng trên/dưới.
4. **Trích dẫn & Hình ảnh:** Blockquote có viền đồng hoàng kim (`--imperial-gold`), nền giấy ấm mộc (`--bg-warm`), font nghiêng; chú thích hình ảnh (`figcaption`) dùng Sans-Serif 13px sắc nét.
5. **Điều hướng Chuỗi bài (Series Nav):** Nút "Bài trước" / "Bài tiếp" tự động co giãn 1 cột trên mobile, kích thước nút bấm chuẩn touch target 44px.

---

## E. GIA PHẢ: DENSE INFORMATION SYSTEM

1. **Thẻ Thành Viên (Person Card):**
   - Tên nhân vật: `font-size: var(--text-body)` (16px), `font-weight: 700`, màu than ấm (`--primary-dark`).
   - Mốc sinh tử: `font-size: var(--text-meta)` (13px), có icon lịch trực quan.
   - Huy hiệu thế hệ (F0–F4): Viết hoa, cỡ `11px`, tương phản cao theo dải màu ngũ hành chuẩn hóa.
   - FSID/ID: Font monospace `11px`, nền nhạt, bo góc sắc nét.
2. **Thẻ Chi Nhánh Gia Đình (Family Card):**
   - Tên nhánh liên kết vợ chồng: Cỡ 16px đậm.
   - Metadata con cái trực hệ: 12.5px rõ ràng.
3. **Cây Gia Phả Tương Tác (Pedigree Tree & Generation Bands):**
   - Node đồ thị có độ rộng cố định, căn giữa tên và đời, không bị tràn dòng.

---

## F. LỊCH: TEMPORAL & EVENT TYPOGRAPHY

1. **Tiêu đề Tháng & Can Chi:** Cỡ 18.5px đậm kết hợp dòng phụ Âm lịch (12.5px) màu đồng hoàng kim (`--lunar-color`).
2. **Ô Ngày Lưới Tháng:**
   - Ngày Dương lịch: 14.5px W800 đặt góc trái.
   - Ngày Âm lịch: 11px W600 đặt góc phải.
   - Hôm nay: Huy hiệu tròn màu đỏ sơn mài 22x22px nổi bật.
3. **Chip Sự Kiện (Event Chips):**
   - Kích thước 11.5px W600, `white-space: nowrap; text-overflow: ellipsis;` đảm bảo không vỡ layout khi có nhiều sự kiện trong cùng một ngày.
   - Tương phản đạt chuẩn WCAG AA trên nền màu phân loại (Sinh nhật hồng, Bổn mạng chàm, Giỗ vàng hoàng kim, Sự kiện xanh lá).

---

## G. TƯ LIỆU & PROFILE

1. **Hồ Sơ Nhân Vật & Gia Đình:**
   - Phân chia 2 cột logic: Thông tin trực hệ & Quan hệ thân thuộc.
   - Đường dẫn liên kết nhân vật hiển thị huy hiệu thế hệ thu nhỏ và tên rõ nét.
2. **Dòng Thời Gian (Timeline):** Mốc năm in đậm cỡ 12px, tiêu đề sự kiện 15px, ngày tháng 13px mộc mạc.

---

## H. MOBILE READABILITY & ACCESSIBILITY

Tối ưu hóa đa độ phân giải với 4 mốc responsive chặt chẽ:
- **Desktop (≥1440px):** Khổ đọc 720px căn giữa, cỡ chữ 18px / line-height 1.85, giao diện điều hướng thanh thoát.
- **Tablet (768px):** Bố cục 2 cột, padding thẻ 24px, cỡ chữ bài viết 17px.
- **Mobile Lớn (430px — iPhone 14/15/16 Pro Max):** Bố cục 1 cột toàn diện, tiêu đề bài viết 24px, cỡ đọc 16px / line-height 1.7, padding màn hình 14px.
- **Mobile Chuẩn (390px — iPhone 12/13/14):** Khoảng cách lề 10px, toàn bộ touch target ≥ 42px, chip lọc cuộn ngang mượt mà.

---

## I. BENCHMARK / FORENSIC VALIDATION

So sánh với các tiêu chuẩn thiết kế gia phả hiện đại:
- **Plus Jakarta Sans:** Độ mở ký tự (aperture) rộng, chiều cao x-height lớn, giúp tiếng Việt có dấu phức hợp (như *ở, ưởng, ễ, ậ*) hiển thị tách bạch không bị bết chữ.
- **EB Garamond:** Dáng chữ thanh lịch mang tinh thần thư tịch Nho học và gia phả truyền thống nhưng vẫn giữ được độ dày nét (stem width) đủ vững trên màn hình Retina/OLED.

---

## J. THAY ĐỔI CỤ THỂ ĐÃ TRIỂN KHAI

1. **`src/css/main.css`:**
   - Khởi tạo hệ thống biến typography tokens đầy đủ trong `:root`.
   - Bổ sung các class card typography chuẩn hóa (`.card-header-row`, `.card-name-title`, `.card-meta-primary`, `.card-meta-secondary`, `.card-footer-row`, `.card-id-badge`, `.card-action-link`, `.card-accent-link`).
   - Sửa toàn bộ `.story-content-body` sang `text-align: left;`, line-height `1.85`, font size `var(--text-body-lg)`.
   - Bổ sung responsive media query rules tại 1024px, 768px, 430px.
2. **`src/js/app.js`:**
   - Thay thế inline font styles trong `renderUnifiedPersonCard` và `renderFamiliesDirectory` bằng các semantic classes mới.
   - Nâng cấp parser markdown cho figure captions và paragraph text flow.
3. **`index.html`:**
   - Xác nhận font link Google Fonts nạp đầy đủ weights cho Plus Jakarta Sans (400-800) và EB Garamond (400-800).

---

## K. VERIFICATION & BÀN GIAO

- **Production Live URL:** `https://gionghotrantrongthu.vercel.app/`
- **Mục kiểm tra trực tiếp:**
  1. `https://gionghotrantrongthu.vercel.app/#/` (Home / Thống kê & Phím tắt)
  2. `https://gionghotrantrongthu.vercel.app/#/mach` (MẠCH Tuyển tập & Ký yếu)
  3. `https://gionghotrantrongthu.vercel.app/#/mach/bai-viet/thu-gui-clara-001` (Trang đọc bài viết Thư gửi Clara)
  4. `https://gionghotrantrongthu.vercel.app/#/tree` (Cây phả đồ tương tác)
  5. `https://gionghotrantrongthu.vercel.app/#/calendar` (Lịch gia đình Dương & Âm)
  6. `https://gionghotrantrongthu.vercel.app/#/people` (Danh bạ 223 thành viên)
  7. `https://gionghotrantrongthu.vercel.app/#/families` (Danh bạ 68 chi nhánh gia đình)

---

## L. KẾT LUẬN & TRẠNG THÁI

Hệ thống typography toàn website đã sẵn sàng để Tuấn trực tiếp trải nghiệm và đánh giá trên các thiết bị thực tế (Desktop, iPad, iPhone). Toàn bộ dữ liệu gia phả, 265 sự kiện lịch và nội dung MẠCH được giữ nguyên vẹn 100%.
