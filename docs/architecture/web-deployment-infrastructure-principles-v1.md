# Web Deployment & Infrastructure Principles V1

## 1. Purpose
Tài liệu này đóng vai trò là system knowledge/reference cốt lõi về cách một web application di chuyển từ môi trường local development lên production.

Mục đích chính của tài liệu là phân định rõ ràng giữa:
- **Nguyên lý (Principles):** Các khái niệm, kiến trúc và quy tắc bảo mật có tính tái sử dụng cho mọi web project sau này.
- **Implementation cụ thể (Implementation):** Cách các nguyên lý đó được áp dụng vào từng project cụ thể (ví dụ: dùng Vercel hay Netlify, dùng Cloudflare Tunnel hay AWS API Gateway).

---

## 2. General Web Stack Mental Model
Một hệ thống web hoàn chỉnh hoạt động theo mental model tổng quát sau:

`Browser -> Domain -> DNS -> CDN / Edge / Reverse Proxy -> Frontend Hosting -> API -> Application Server -> Database -> Media / File Storage`

**Vai trò của các lớp:**
Việc phân chia thành các lớp giúp cô lập rủi ro, dễ dàng scale và troubleshooting.
- **Nhấn mạnh các ranh giới:**
  - Domain không phải DNS.
  - DNS không phải hosting.
  - Frontend không phải backend.
  - API không phải database.
  - Tunnel không phải DNS.
  - Database không phải media storage.
  - Một lớp có thể thay đổi implementation nhưng vai trò trong kiến trúc vẫn giữ nguyên.

---

## 3. Domain & DNS Principles
**Các khái niệm cốt lõi:**
- **Registrar**
- **Nameserver**
- **DNS Zone**
- **A**
- **AAAA**
- **CNAME**
- **CAA**
- **DNS-only**
- **Proxied**
- **DNS propagation**

**Nguyên tắc thao tác:**
- Quan hệ định tuyến: `Domain -> Nameserver -> DNS Zone -> DNS Records -> Destination`.
- Không xóa DNS record một cách mù quáng. Trước khi sửa/xóa phải xác định chính xác hostname, record type, target và mục đích.
- Một hostname có thể đang được sử dụng bởi một layer khác.
- `DNS ACTIVE` không đồng nghĩa với việc application ONLINE.
- DNS cấu hình đúng chỉ chứng minh hostname được phân giải đúng về đích, không chứng minh application phía sau đang hoạt động.

*(Lesson thực tế: Trong project hiện tại, việc tạo CNAME thủ công trước khi tạo Published Application Route gây conflict vì Cloudflare route muốn tự quản lý DNS record tương ứng. Tuy nhiên, không biến lesson này thành quy tắc tuyệt đối rằng mọi Cloudflare DNS record đều phải được tạo tự động; ghi đúng ngữ cảnh).*

---

## 4. Frontend Hosting Principles
- **Vai trò:** Phục vụ application UI.
- Custom domain cần được map vào frontend hosting.
- **Nguyên tắc:** DNS configuration phải dựa trên giá trị cấu hình thực tế của provider cho từng project, không hardcode assumption từ project khác.
- Frontend deployment và backend deployment là hai concern hoàn toàn khác nhau.

**Current Implementation Reference:**
- Frontend được deploy trên Vercel.
- Custom domain của project là `giatoctrantrongthu.com`.
- Không coi các DNS value hiện tại của Vercel là universal rule cho project khác.

---

## 5. Backend / API Boundary
**Nguyên tắc:** Browser / Frontend KHÔNG kết nối trực tiếp tới database.

**Luồng dữ liệu đúng:**
`Frontend -> HTTPS API -> Application Server -> Database`

**Giải thích:**
- API chính là ranh giới giữa public application và private data layer.
- API xử lý request.
- Application layer kiểm soát logic.
- Database không public trực tiếp.
- Frontend chỉ biết API endpoint, không biết database credential.

---

## 6. NAS / Private Server Principles
**Vai trò của NAS trong kiến trúc hiện tại:**
- NAS là private origin/server.
- Application server chạy trên NAS.
- MariaDB chạy private trên NAS.
- Media/file có thể nằm trên filesystem của NAS.
- NAS không cần trở thành public web server trực tiếp.

**Nguyên tắc Security Boundary:**
- **PUBLIC:** Frontend, Public HTTPS API.
- **PRIVATE:** MariaDB, NAS management / DSM, SSH, Internal application ports, Filesystem, Credentials/secrets.
- Không expose trực tiếp các internal services ra Internet nếu không có lý do kiến trúc rõ ràng.

---

## 7. Cloudflare Tunnel Mental Model
**Mental Model:**
`Internet -> Cloudflare Edge -> Published Application Route -> Cloudflare Tunnel -> cloudflared connector -> localhost/private service -> Application Server -> Database`

**Phân biệt 3 thứ khác nhau:**
1. DNS
2. Tunnel connector
3. Published Application Route / ingress

**Lưu ý trạng thái:**
- `Tunnel Healthy` ≠ `Public API Working`
- `DNS Correct` ≠ `Public API Working`
- `Local API Working` ≠ `Public API Working`
- Public request chỉ thành công khi toàn bộ chain hoạt động.

**Nguyên tắc Security:**
Cloudflare Tunnel cho phép public traffic đi vào private origin thông qua outbound connector mà không cần mở inbound port trực tiếp trên router.

---

## 8. DNS + Tunnel Relationship
Sự phối hợp giữa các thành phần:
- **DNS** trả lời câu hỏi: *"Hostname này đi đâu?"*
- **Tunnel** trả lời câu hỏi: *"Traffic đã tới Cloudflare thì đi vào origin service nào?"*
- **Published Application Route** trả lời câu hỏi: *"Hostname/path nào được map tới local service nào?"*

Do đó:
`DNS + Tunnel + Published Application Route + Origin Service` mới tạo thành complete public path. Không đồng nhất các layer này với nhau.

---

## 9. Secrets & Credential Principles
**Quy tắc:**
- Secret chỉ tồn tại trong secret manager / runtime environment cần thiết.
- Không commit secret vào Git.
- Không paste secret vào chat.
- Không in secret vào logs.
- Không đưa secret vào report.
- Không đưa token/password vào documentation.
- Agent chỉ sử dụng credential khi môi trường đã được cấp quyền phù hợp.
- Nếu agent không có credential/quyền cần thiết, phải dừng và báo Owner thay vì tự tạo credential mới hoặc bypass security boundary.

*(Current project sử dụng Bitwarden cho secret management).*

---

## 10. Deployment Layers
Việc phân chia layer giúp troubleshooting hiệu quả. Lỗi xảy ra ở đâu, xử lý ở đó.
### Layer 1 — Domain
Identity của application trên Internet.
### Layer 2 — DNS
Hostname resolution/routing metadata.
### Layer 3 — Edge / CDN / Reverse Proxy
Cloudflare / Vercel hoặc provider tương ứng.
### Layer 4 — Frontend
Static/client application.
### Layer 5 — API
Public application interface.
### Layer 6 — Application Server
Runtime xử lý business/application logic.
### Layer 7 — Database
Persistent structured data.
### Layer 8 — Media / Filesystem
Binary assets, images, documents, archive files.
### Layer 9 — Backup
Recovery mechanism độc lập với production storage.

Giải thích rằng lỗi production cần được định vị theo layer trước khi sửa.

---

## 11. End-to-End Testing Principles
E2E test phải kiểm tra toàn bộ chain, không chỉ local application.

**Recommended Chain:**
1. Domain resolves.
2. HTTPS certificate works.
3. Frontend loads.
4. Public API responds.
5. API reaches application server.
6. Application reaches database.
7. Database returns expected real data.
8. Frontend successfully consumes public API.
9. Internal services remain private.
10. Git state is clean / deployment commit is known.

**Phân biệt:**
- **Local test:** `localhost -> API -> DB`
- **Production E2E:** `Browser -> Domain -> Edge -> Route -> Tunnel -> Origin -> API -> DB`
- Production chỉ được coi là ONLINE khi chain production hoạt động.

---

## 12. Troubleshooting Order
Khi production không hoạt động, kiểm tra theo thứ tự:
1. Domain
2. DNS
3. HTTPS / Edge
4. Tunnel connector
5. Published Application Route / ingress
6. Origin service
7. API
8. Database
9. Frontend -> API
10. Security / network exposure

Không nhảy thẳng vào database hoặc code nếu lỗi nằm ở DNS/Tunnel.

**Các lesson cần ghi rõ:**
- Domain ACTIVE ≠ Application ONLINE.
- DNS PASS ≠ API PASS.
- Tunnel PASS ≠ API PASS.
- Local API PASS ≠ Public API PASS.
- Frontend PASS ≠ Frontend -> API PASS.
- E2E test là test của toàn bộ chain.
- Phải xác định ERROR LAYER trước khi thay đổi hệ thống.

---

# 13. Current Project Implementation Reference
Đây là một case study/reference, KHÔNG phải universal architecture rule.

- **Frontend:** Vercel
- **Public domain:** `giatoctrantrongthu.com`
- **Public API:** `api.giatoctrantrongthu.com`
- **Backend origin:** NAS
- **API local origin:** `127.0.0.1:3000`
- **Database:** MariaDB trên NAS
- **Media:** NAS filesystem
- **Edge/tunnel:** Cloudflare
- **Tunnel connector:** cloudflared native ARM64
- **Router:** không mở inbound port cho application/API
- **API -> MariaDB**
- **Frontend -> HTTPS public API**

---

# 14. Lessons Learned From Gia tộc Trần Trọng Thu

### Lesson 1
Tạo domain/DNS đúng chưa đủ để application ONLINE.
### Lesson 2
Cloudflare Tunnel connector Connected/Healthy chưa có nghĩa public hostname đã route được tới origin.
### Lesson 3
DNS record và Published Application Route là hai layer khác nhau.
### Lesson 4
Không nên tạo DNS record thủ công nếu workflow/provider đang yêu cầu Published Application Route tự quản lý record tương ứng.
### Lesson 5
Khi gặp: `A DNS record with this name already exists`, phải kiểm tra DNS record hiện hữu trước khi tiếp tục.
### Lesson 6
Local API có dữ liệu thật nhưng public API 503 vẫn có thể hoàn toàn là vấn đề ở edge/tunnel/route, không phải database.
### Lesson 7
E2E test là bước bắt buộc để xác nhận vertical slice ONLINE.
### Lesson 8
Infrastructure debugging nên đi từ ngoài vào trong: `Internet -> DNS -> Edge -> Tunnel -> Origin -> API -> DB`, không đi ngược lại một cách ngẫu nhiên.

---

# 15. Reusable Deployment Checklist

## Domain
- [ ] Domain registered
- [ ] Correct nameserver
- [ ] Correct DNS provider
- [ ] Domain active

## DNS
- [ ] Apex record
- [ ] WWW record nếu cần
- [ ] API hostname
- [ ] CAA nếu cần
- [ ] No conflicting records
- [ ] Proxy/DNS-only state understood

## Frontend
- [ ] Frontend deployed
- [ ] Production domain attached
- [ ] HTTPS working
- [ ] Production URL confirmed

## Backend
- [ ] API deployed
- [ ] API local health check
- [ ] Database connection
- [ ] Public API hostname

## Tunnel / Ingress
- [ ] Tunnel created
- [ ] Connector connected
- [ ] Published Application Route configured
- [ ] Hostname/path correct
- [ ] Origin service correct

## Database
- [ ] Database private
- [ ] Schema migrated
- [ ] Seed/real data verified
- [ ] Credentials managed securely

## Media
- [ ] Media storage defined
- [ ] Public/private boundary defined
- [ ] Backup strategy defined

## Security
- [ ] No inbound router exposure unless explicitly required
- [ ] DSM private
- [ ] SSH private
- [ ] MariaDB private
- [ ] Secrets not in Git
- [ ] Secrets not in logs
- [ ] Secrets not in documentation

## E2E
- [ ] Domain resolves
- [ ] HTTPS works
- [ ] Frontend loads
- [ ] Public API works
- [ ] API reaches DB
- [ ] Frontend reaches API
- [ ] Real data verified
- [ ] Network exposure verified

## Release
- [ ] Git clean
- [ ] Commit identified
- [ ] Production URL recorded
- [ ] Backup status known

---

# 16. Owner's Mental Model

Là Owner, không cần nhớ command, chỉ cần hiểu:
1. Các layer của hệ thống.
2. Data flow đi qua những đâu.
3. Layer nào public/private.
4. Khi lỗi xảy ra thì lỗi thuộc layer nào.
5. Agent đang có quyền gì.
6. Việc nào agent có thể tự xử lý.
7. Việc nào bắt buộc Owner action.
8. Khi nào production được coi là ONLINE.
9. Khi nào cần rollback thay vì tiếp tục sửa.
10. Infrastructure knowledge phải được tích lũy thành reusable system knowledge thay vì học lại từ đầu cho từng project.

**Mental model ngắn gọn:**
`DOMAIN -> DNS -> EDGE -> FRONTEND/API -> TUNNEL -> ORIGIN -> DATABASE/MEDIA`

**Khi debug:**
`OUTSIDE -> INSIDE`

---

## 17. Document Boundary
Tài liệu này KHÔNG phải:
- Cloudflare tutorial
- Vercel tutorial
- NAS administration manual
- MariaDB manual
- Project-specific deployment script
- Secrets inventory

Đây là **system-level knowledge reference** về deployment architecture và infrastructure principles.
