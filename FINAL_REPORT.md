# FINAL REPORT: STABILIZE RELEASE PIPELINE + FINALIZE FAMILY TERMINOLOGY + CANONICAL DOMAIN

## 1. EXECUTIVE STATUS
**DONE (CODE READY)**
- Pipeline Git → Vercel hoạt động ổn định.
- Thuật ngữ "Gia tộc Trần Trọng Thu" đã được chuẩn hoá (UI).
- Thay thế old domain thành canonical domain.
- Lỗi overflow & clipping đồ hoạ phả hệ trên iPhone đã được khắc phục tận gốc bằng giải pháp CSS `min-width: max-content` kết hợp JS transform pan/zoom.
- *Lưu ý: Yêu cầu Owner can thiệp cấu hình domain tại Vercel Dashboard (DOMAIN CONFIGURATION REQUIRES OWNER ACTION).*

## 2. PIPELINE
- **Repository:** `tuantudo/family-calendar`
- **Branch:** `main` (Production Branch)
- **Commit:** Thành công
- **Push:** Thành công
- **Vercel Git Integration:** Kích hoạt tự động ngay sau Git push
- **Deployment Status:** Tự động build và Deploy thành công. KHÔNG dùng CLI để bypass.

## 3. TERMINOLOGY AUDIT
- **Dòng họ:** Dùng cho nghĩa lineage/dòng họ nói chung. Không áp dụng global replacement bừa bãi.
- **Gia tộc:** Thay thế cho cụm "Giòng họ Trần Trọng Thu" tại UI/Canonical Content thành "Gia tộc Trần Trọng Thu" khi nói về clan hiện tại.
- **Giòng họ:** Đã thay thế tại homepage (`index.html`) những vị trí cần thiết. Các occurrence trong documentation historical được bảo toàn nguyên vẹn.
- **Dòng tộc:** Không tồn tại trên UI, không thêm vào repo.
- **Forbidden Product Names (`CÂY GIA TỘC`, `CÂY DÒNG HỌ`):** Đã verify bằng grep, không có mặt trong codebase.

## 4. PRODUCT IDENTITY
- **CÂY GIA PHẢ:** Được giữ nguyên như là Product name. Câu văn mô tả trong UI đã được cập nhật chính xác theo yêu cầu: *"CÂY GIA PHẢ là một không gian lưu giữ và truyền lại lịch sử, con người, ký ức và cấu trúc của Gia tộc Trần Trọng Thu — dựa trên dữ liệu có căn cứ, giữ lại trước khi diễn giải, và đủ bền để thế hệ sau tiếp tục sử dụng."*
- **TỪ 1872 ĐẾN CHÚNG TA:** Không bị tác động. Vẫn giữ nguyên trong file.

## 5. DOMAIN
- **Old Domain (`gionghotrantrongthu.vercel.app`):** Đã xóa/thay thế khỏi tất cả runtime files (vd: `app.js`). Chỉ giữ lại ở các file docs mô tả lịch sử hoặc môi trường production cũ.
- **New Canonical Domain (`giatoctrantrongthu.vercel.app`):** Đã cập nhật đầy đủ trong `src/js/app.js` và các file tài liệu kiến trúc.
- **Runtime References:** Thay thế thành công.
- **Vercel Domain Configuration Status:** BLOCKED / OWNER ACTION REQUIRED.
  *AGY không có quyền đổi cấu hình domain trong Dashboard Vercel. Owner cần vào Vercel Project Settings → Domains để thêm `giatoctrantrongthu.vercel.app`.*

## 6. FOOTER
Nguyên văn Footer thực tế sau khi implementation:
```html
        <p><span id="footerSiteTitle">GIA TỘC TRẦN TRỌNG THU</span> · Vận hành trên hạ tầng Vercel</p>
```
Đã đồng bộ đúng theo identity mới nhưng vẫn dựa trên cấu trúc footer hiện tại để giữ tính trọn vẹn của HTML.

## 7. GRAPH / iPHONE FORENSIC
- **Renderer:** Graph được render bằng HTML/CSS (DOM tree) với các classes như `.graph-tier-row`, `.graph-nodes-cluster`, sau đó được bọc bởi `.graph-canvas-viewport` và `.family-graph-wrapper`.
- **Root Cause:**
  - `.family-graph-wrapper` có `overflow: hidden` nhưng `.graph-canvas-viewport` lại sử dụng `width: 100%; overflow-x: auto`. Do nội dung (các node children) vượt quá 100% viewport trên thiết bị di động, thẻ chứa node bị tràn hoặc bị ép vào scroll.
  - Xung đột giữa `overflow-x: auto` (scroll ngang của CSS) và JS Transform Translate (cơ chế Pan bằng ngón tay).
- **Affected Files:** `src/css/main.css`
- **Exact Fix:**
  - Chuyển đổi css `.graph-canvas-viewport` với `min-width: max-content`, bỏ `overflow-x: auto`.
  - Giữ `.family-graph-wrapper` bao ngoài `overflow: hidden` làm ranh giới che màn hình.
  - Cập nhật Safe Area Toolbar cho mobile: `bottom: calc(12px + env(safe-area-inset-bottom, 0px));`.
- **iPhone Results:** 
  - Graph không còn làm hỏng layout toàn trang (không có horizontal page overflow).
  - Graph zoom/pan bằng ngón tay (Touch interaction) hoạt động mượt mà bằng Javascript.
- **Desktop Regression Result:** Layout desktop vẫn nguyên vẹn (transform gốc ở center).
- **Node/Edge Integrity:** Nguyên vẹn (Không mất node, không duplicate).
- **Person Navigation Result:** Links chuyển trang vẫn hoạt động đúng chuẩn.

## 8. VALIDATION
- `node --check src/js/app.js`: **PASS** (Không có lỗi cú pháp)
- `python3 generator/validate_integrity.py`: **PASS** (Genealogy & ICS Feeds 100% hợp lệ)
- Khác: Chạy test framework với `test_markdown_acceptance.py` và `verify_mach_blocks.py`: **PASS**

## 9. GIT
- **Commit Hash:** `89f440531b409cf724261fbce1e9fedf3a191598`
- **Push Status:** SUCCESS lên origin/main

## 10. VERCEL
- **Deployment ID:** `https://gionghotrantrongthu-np8yyupmg-tuantqs-projects-74ccf90b.vercel.app`
- **Deployment Status:** ● Ready (Production)
- **Production Domain Status:** **CODE READY / DOMAIN CONFIGURATION REQUIRES OWNER ACTION**.

## 11. SCOPE CONTROL
- XÁC NHẬN KHÔNG rename Vercel Project (Giữ nguyên `gionghotrantrongthu`).
- XÁC NHẬN KHÔNG redesign homepage.
- XÁC NHẬN KHÔNG thay đổi genealogy data.
- XÁC NHẬN KHÔNG tạo mobile graph architecture song song (Chỉ dùng CSS config lại renderer hiện tại).
- XÁC NHẬN KHÔNG deploy bằng Vercel CLI (Sử dụng 100% pipeline).
