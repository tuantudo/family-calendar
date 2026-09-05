# KIẾN TRÚC TRIỂN KHAI VERCEL (VERCEL DEPLOYMENT ARCHITECTURE)
*Hệ Thống Tri Thức CÂY GIA PHẢ — Vercel Delivery Platform*

---

## 1. NGUYÊN TẮC CỐT LÕI (CORE PRINCIPLES)

```text
OFFICIAL LOCAL WORKSPACE
/Users/tuantq/Projects/Personal/family-calendar
        ↓ (git push)
GITHUB REPOSITORY (tuantudo/family-calendar) [SOURCE OF TRUTH]
        ↓                                           ↓
GITHUB ACTIONS                                VERCEL PLATFORM
(Integrity & Invariant Gates)                 (Primary Public Web Delivery)
        ↓                                           ↓
GITHUB PAGES (Fallback Mirror)                https://family-calendar-ebon-tau.vercel.app
```

* **Local Workspace**: `/Users/tuantq/Projects/Personal/family-calendar` là môi trường phát triển chính thức duy nhất.
* **GitHub Repository (`tuantudo/family-calendar`)**: Là **Canonical Remote & Source of Truth** duy nhất của toàn bộ dự án. Vercel tuyệt đối không thay thế vai trò lưu trữ phả hệ của GitHub.
* **GitHub Actions**: Chịu trách nhiệm kiểm soát chất lượng (Data Integrity & Invariant Gate: 223 cá nhân, 68 gia đình, 4 ICS feeds).
* **Vercel Platform**: Đóng vai trò là **Primary Web Application Delivery Platform**, cung cấp hạ tầng CDN toàn cầu, chứng chỉ SSL tự động, preview deployments theo branch, và zero-config static hosting.
* **GitHub Pages**: Được duy trì song song làm **Fallback / Legacy Deployment** dự phòng.

---

## 2. THIẾT LẬP VERCEL PROJECT & DEPLOYMENT

### 2.1. Thông Tin Project Vercel
* **Project Name**: `family-calendar`
* **Project ID**: `prj_jwHYW33ioSD0SfOhKhY0lU9dEoV3`
* **Organization / Team**: `tuantqs-projects-74ccf90b` (`team_4F5pke8is2RERpfcYLlJuufy`)
* **Framework Preset**: Static (HTML/CSS/Vanilla JS)
* **Build Command**: Không yêu cầu (`None`)
* **Output Directory**: `.` (Root)

### 2.2. Cấu Hình `vercel.json`
Tệp cấu hình `vercel.json` định nghĩa chuẩn URL và chính sách bảo mật HTTP headers:
```json
{
  "version": 2,
  "cleanUrls": true,
  "trailingSlash": false,
  "headers": [
    {
      "source": "/data/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=0, must-revalidate" },
        { "key": "Access-Control-Allow-Origin", "value": "*" }
      ]
    },
    {
      "source": "/calendars/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=0, must-revalidate" },
        { "key": "Access-Control-Allow-Origin", "value": "*" }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" }
      ]
    }
  ]
}
```

---

## 3. WORKFLOW PHÁT TRIỂN & PHÁT HÀNH (DEVELOPMENT & RELEASE LIFECYCLE)

### 3.1. Nhánh Tính Năng (Feature Branch) $\rightarrow$ Preview Deployment
1. Lập trình viên / Agent tạo branch mới: `git checkout -b architecture/arch-xx`.
2. Chỉnh sửa và kiểm tra tại local workspace.
3. Kích hoạt Preview Deployment qua Vercel:
   ```bash
   vercel --yes
   ```
4. Vercel cấp URL xem trước độc lập (ví dụ: `https://family-calendar-lawsvvj6o-tuantqs-projects-74ccf90b.vercel.app`).
5. Tiến hành Visual QA trên Desktop và Mobile.

### 3.2. Nhánh Chính (`main`) $\rightarrow$ Production Deployment
1. Chạy Validation Gate kiểm tra toàn vẹn:
   ```bash
   python3 generator/validate_integrity.py
   ```
2. Merge branch vào `main` và push lên GitHub:
   ```bash
   git checkout main && git merge architecture/arch-xx && git push origin main
   ```
3. Deploy Production lên Vercel:
   ```bash
   vercel --prod --yes
   ```
4. Web App chính thức được cập nhật ngay lập tức tại:
   `https://family-calendar-ebon-tau.vercel.app`

---

## 4. RANH GIỚI BẢO MẬT & DỮ LIỆU CÔNG KHAI (DATA EXPOSURE BOUNDARY)

| Thành phần | Phạm vi Expose | Mục đích & Ghi chú |
| :--- | :--- | :--- |
| `GIADINHONGTHU.ged` | **PRIVATE ONLY (Local & Git ignored)** | File GEDCOM gốc chứa dữ liệu thô, không bao giờ được public lên CDN. |
| `data/genealogy.json` | **PUBLIC WEB** | Dữ liệu gia phả trích lục có cấu trúc phục vụ rendering Web App. |
| `calendars/CAL_*.ics` | **PUBLIC FEEDS** | 4 Feeds lịch iCalendar công khai để người dùng subscribe. |
| `src/` & `index.html` | **PUBLIC ASSETS** | Mã nguồn frontend HTML, CSS, JavaScript thuần. |
| `generator/` | **DEVELOPMENT TOOL** | Bộ scripts Python nội bộ tạo dữ liệu và validate integrity. |

---

## 5. CHIẾN LƯỢC TÊN MIỀN & KHẢ NĂNG ROLLBACK

### 5.1. Domain Strategy
* **Hiện tại**: Sử dụng subdomain mặc định do Vercel cung cấp:
  `https://family-calendar-ebon-tau.vercel.app`
* **Tương lai**: Dễ dàng gán Custom Domain riêng mà không cần thay đổi cấu trúc URL hay logic routing của ứng dụng.

### 5.2. Rollback Strategy
* Mọi deployment trên Vercel đều là bất biến (immutable).
* Trong trường hợp xảy ra sự cố trên Production, chỉ cần chọn deployment trước đó trong danh sách Vercel Dashboard hoặc chạy `vercel rollback` để khôi phục phiên bản ổn định ngay lập tức trong vòng 1 giây.
