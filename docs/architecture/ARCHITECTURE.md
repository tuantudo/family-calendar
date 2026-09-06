# DÒNG HỌ TRẦN TRỌNG THU — KIẾN TRÚC NỀN TẢNG (FOUNDATIONAL ARCHITECTURE)
## Hệ Thống Tri Thức, Ký Ức & Di Sản Dòng Họ (`family-calendar`)
### STATUS: FOUNDATIONAL ARCHITECTURE DOCUMENT — WORKING BASELINE (v1.0)
*Tài liệu Kiến trúc Nền tảng — Chuyển dịch từ Research sang Architecture*  
*Ngày cập nhật: 05/09/2026*  
*Workspace: `/Users/tuantq/Projects/Personal/family-calendar`*  

---

> [!IMPORTANT]
> **BẢN CHẤT & ĐỊNH VỊ TÀI LIỆU:**
> - Tài liệu này đóng vai trò là **Foundation Document (Tài liệu Nền tảng)** chính thức, làm chuẩn quy chiếu xuyên suốt chuỗi tiến trình:  
>   $$\text{Research} \longrightarrow \text{Principles} \longrightarrow \text{Architecture} \longrightarrow \text{Ontology} \longrightarrow \text{Sitemap} \longrightarrow \text{Publication Model} \longrightarrow \text{Design}$$
> - **Phạm vi:** Định hình kiến trúc tổng thể, bản thể luận và cấu trúc xuất bản.
> - **Ranh giới:** Đây là tài liệu kiến trúc nền tảng, **không triển khai code hay UI**, không biến các giả thuyết làm việc (*working hypotheses*) thành quyết định đã hoàn tất.

---

## I. BỐI CẢNH DỰ ÁN & TINH THẦN CỐT LÕI (CORE SPIRIT & CONTEXT)

### 1. Xuất phát điểm thực tế
- **Không mô phỏng một gia tộc quyền lực hay một "great family institution":** Dự án không được xây dựng theo tâm thế tán dương một dòng tộc vĩ đại hay tạo dựng một tượng đài danh gia vọng tộc.
- **Khởi đầu từ con số không:** Dòng họ Trần Trọng Thu bắt đầu từ những thực tại giản dị và rời rạc: một số con người còn đang sống, các mối quan hệ thân tộc, một vài ký ức truyền khẩu, những bức ảnh cũ, giấy tờ hộ tịch / rửa tội còn sót lại và những mảnh lịch sử có nguy cơ biến mất theo thời gian.
- **Động lực khởi đầu:** Bắt nguồn từ nỗ lực của một cá nhân trong gia đình mong muốn gìn giữ những gì còn có thể nhớ được trước khi thế hệ đi trước qua đi.

### 2. Bài toán kiến trúc trung tâm
> **“Xây dựng hạ tầng để một dòng họ có thể bắt đầu nhớ chính mình một cách có hệ thống.”**

### 3. Lửa khởi đầu là Agency — Không phải bằng chứng lịch sử
- Động lực của người khởi tạo (*Initial Fire*) là **Agency (sự chủ động, trách nhiệm cá nhân)**. Nó không phải là bằng chứng về lịch sử hay vị thế của dòng họ.
- **Mục tiêu tối hậu của Kiến trúc:** Chuyển hóa Agency của người khởi tạo thành một **Cấu trúc Thể chế Số độc lập và bền vững**, có thể tiếp tục vận hành, tiếp nhận đóng góp và truyền thừa qua các thế hệ mà không phụ thuộc vĩnh viễn vào cá nhân người bắt đầu.

---

## II. NGUYÊN TẮC NỀN TẢNG: GIỮ LẠI TRƯỚC KHI DIỄN GIẢI

### 1. Nguyên tắc tối thượng
> **“GIỮ LẠI TRƯỚC KHI DIỄN GIẢI.”**  
> *Trước khi kể cho người khác dòng họ mình là gì, hãy ghi nhận trung thực và đầy đủ những gì thực sự còn lại.*

Hệ thống tuyệt đối không lấp đầy các khoảng trống lịch sử bằng những câu chuyện hư cấu, thêm thắt cho đẹp hơn, hay tự nâng tầm quy mô dòng họ.

### 2. Kỷ luật phân tầng 7 mức độ xác tín (7 Epistemic Certainty Levels)
Mọi thực thể, câu chuyện, ghi chép và tư liệu trong hệ thống đều phải được định vị theo 7 tầng xác tín rõ ràng:

```
┌────────────────────────────────────────────────────────────────────────┐
│ 1. ĐIỀU ĐÃ ĐƯỢC XÁC NHẬN (Confirmed Fact)                              │
│    • Có chứng từ gốc: giấy khai sinh, sổ rửa tội, văn khế, bia mộ.    │
├────────────────────────────────────────────────────────────────────────┤
│ 2. ĐIỀU ĐƯỢC KỂ LẠI (Retold Tradition / Oral History)                  │
│    • Ký ức truyền khẩu qua nhiều đời, chưa có văn bản đối chiếu.       │
├────────────────────────────────────────────────────────────────────────┤
│ 3. ĐIỀU LÀ KÝ ỨC CÁ NHÂN (Personal Memory)                             │
│    • Hồi ức riêng của một cá nhân, mang góc nhìn chủ quan.             │
├────────────────────────────────────────────────────────────────────────┤
│ 4. ĐIỀU LÀ DIỄN GIẢI (Interpretation / Essay)                          │
│    • Bút ký, suy tưởng, luận bàn văn hóa (chủ yếu trong MẠCH).         │
├────────────────────────────────────────────────────────────────────────┤
│ 5. ĐIỀU CHƯA XÁC MINH (Unverified Record)                              │
│    • Dữ kiện ghi nhận bước đầu, đang trong quá trình tra cứu.          │
├────────────────────────────────────────────────────────────────────────┤
│ 6. ĐIỀU CÒN TRANH LUẬN (Disputed / Conflicting Account)                │
│    • Tồn tại các lời kể hoặc tài liệu mâu thuẫn nhau (giữ nguyên cả hai)│
├────────────────────────────────────────────────────────────────────────┤
│ 7. ĐIỀU CHƯA BIẾT (Unknown / Blank Record)                             │
│    • Khoảng trống dữ liệu được chấp nhận và để ngỏ trung thực.         │
└────────────────────────────────────────────────────────────────────────┘
```

---

## III. TAM TẦNG KIẾN TRÚC HỆ THỐNG (THREE-TIER SYSTEM ARCHITECTURE)

Hệ thống được tổ chức thành 3 tầng chức năng độc lập nhưng liên kết chặt chẽ:

```
┌────────────────────────────────────────────────────────────────────────┐
│                      1. PUBLICATION LAYER                              │
│         (GIA PHẢ  ───  MẠCH  ───  TƯ LIỆU  ───  VỀ DÒNG HỌ)            │
│         • Cách con người tiếp cận, đọc, khám phá và thấu cảm di sản    │
├────────────────────────────────────────────────────────────────────────┤
│                      2. KNOWLEDGE LAYER                                │
│         (Entities ─── Relations ─── Records ─── Provenance)            │
│         • Mạng lưới đối tượng tri thức, dữ kiện và nguồn gốc dữ liệu   │
├────────────────────────────────────────────────────────────────────────┤
│                      3. STEWARDSHIP LAYER                              │
│         (Methodology ─── Privacy ─── Access ─── Continuity)            │
│         • Quy chế quản trị, tính chân thực, bảo mật và kế thừa lâu dài │
└────────────────────────────────────────────────────────────────────────┘
```

---

## IV. TẦNG 1: PUBLICATION LAYER (KIẾN TRÚC XUẤT BẢN)

> [!NOTE]
> **Publication không phải là Database.**  
> Database / Ontology là cấu trúc dữ liệu phía dưới; Publication là phương thức con người tương tác, đọc, khám phá và hiểu hệ thống ký ức của dòng họ.

Kiến trúc Xuất bản gồm **3 trục nội dung cốt lõi** không tách rời:

```
                                 PUBLICATION
                                      │
            ┌─────────────────────────┼─────────────────────────┐
            ▼                         ▼                         ▼
         GIA PHẢ                    MẠCH                     TƯ LIỆU
  (Structured Heritage)     (Expressed Memory)         (Archival Records)
   Dòng họ là ai & Có gì    Kể lại, Suy ngẫm & Luận     Những vật chứng còn lại
```

### 1. Trục 1: GIA PHẢ (Structured Heritage)
- **Bản chất:** Ghi nhận dòng họ là ai và những gì có thể xác định được về dòng họ.
- **Phạm vi bao phủ:**
  - Con người (*Person*), Gia đình (*Family*), Thế hệ (*Generation*), Chi / Nhánh (*Branch*).
  - Quan hệ thân tộc (*Relationships*), Địa danh (*Places*), Sự kiện đời người (*Events*).
  - Dòng thời gian (*Timeline*) và các dấu vết có thể lần theo.
- **Định vị:** GIA PHẢ không chỉ là một sơ đồ cây phả hệ (*Genealogy Tree*). Mỗi `Person` là một thực thể trung tâm được bao quanh bởi:
  $$\text{Person} \longleftrightarrow \{\text{Quan hệ, Gia đình, Cuộc đời, Ký ức, Tư liệu, Nguồn gốc, Mức độ xác tín}\}$$

### 2. Trục 2: MẠCH (Expressed Memory & Editorial Voice)
- **Bản chất:** Lớp tự sự, văn phong và tiếng nói chiêm nghiệm (*Editorial / Expression / Voice*). Nơi các thế hệ trong dòng họ kể, nhớ, suy nghĩ và diễn giải về nếp nhà và thời đại.
- **Phạm vi bao phủ:**
  - Câu chuyện (*Stories*), Ký ức (*Memories*), Suy tưởng (*Reflections*).
  - Thư từ trao gửi thế hệ sau (*Letters / Epistolary* — tiêu biểu là chuỗi *Thư gửi Clara*).
  - Tuyển tập (*Series*) và Tác giả chấp bút (*Authors*).
- **Ranh giới:** MẠCH không phải phần mềm gia phả và cũng không phải blog cá nhân. Mỗi bài MẠCH có thể liên kết chặt chẽ tới Người, Gia đình, Nơi chốn, Sự kiện trong Gia Phả và Tư Liệu. MẠCH được phép có tiếng nói và diễn giải, nhưng **phải phân biệt rạch ròi giữa diễn giải và dữ kiện lịch sử**.

### 3. Trục 3: TƯ LIỆU (Archival Records & Evidence)
- **Bản chất:** Lớp văn khố và chứng từ lịch sử (*Archive / Records*).
- **Phạm vi bao phủ:**
  - Hình ảnh di sản, ảnh chụp thực địa, chân dung tiền nhân.
  - Văn bản, giấy tờ hộ tịch, trích lục Hán Nôm, sổ rửa tội Bùi Chu, thư tay.
  - Bản ghi âm (*Audio*), video, các bộ sưu tập và hiện vật chứng tích đời sống.
- **Ranh giới quan trọng:** **Không coi Tư liệu chỉ là tệp đính kèm (attachment) của bài viết hay của Person.** Một tư liệu (bức ảnh cũ, tờ giấy hoen ố) dù chưa xác định đầy đủ người trong ảnh, thời gian hay địa điểm vẫn có giá trị độc lập để bảo tồn và chờ các thế hệ sau đối chiếu.

---

## V. TẦNG 2: KNOWLEDGE LAYER (BẢN THỂ LUẬN TRI THỨC)

Bên dưới tầng Xuất bản là một mạng lưới tri thức gồm các thực thể liên kết ngữ nghĩa:

```
┌────────────────────────────────────────────────────────────────────────┐
│ A. ENTITY (Đối tượng tồn tại trong thực tại)                           │
│    Person, Family, Branch, Generation, Place, Event, Document, Artifact│
├────────────────────────────────────────────────────────────────────────┤
│ B. KNOWLEDGE (Tri thức & Dữ kiện ghi nhận về đối tượng)                │
│    Genealogy, Biography, History, Rule, Teaching, Memory, Source,      │
│    Provenance, Certainty Level                                         │
├────────────────────────────────────────────────────────────────────────┤
│ C. EXPRESSION (Phương thức diễn đạt & kể lại tri thức)                 │
│    Article, Story, Essay, Letter, Series, Editorial, Exhibition        │
├────────────────────────────────────────────────────────────────────────┤
│ D. CAPABILITY (Năng lực chức năng phục vụ khám phá & sử dụng)          │
│    Search, Calendar & ICS Feeds, Relationship Finder, Timeline, Map    │
└────────────────────────────────────────────────────────────────────────┘
```

> [!WARNING]
> **KỶ LUẬT KIẾN TRÚC:**
> - **Không biến mọi thứ thành Section hoặc Brand:** Các công cụ như *Tìm kiếm (Search)*, *Lịch (Calendar)*, *Bộ tính quan hệ (Relationship Finder)*, *Bản đồ (Map)* được định vị là **Capabilities / Functions / Infrastructure** phục vụ việc khai thác Gia Phả, Mạch và Tư Liệu; tuyệt đối không nâng cấp thành các sub-brand độc lập ngang hàng.

---

## VI. TẦNG 3: STEWARDSHIP LAYER (QUẢN TRỊ, BẢO TỒN & KẾ THỪA)

Hệ thống được thiết kế để tồn tại dài hạn qua nhiều đời, không phải một dự án xuất bản cá nhân ngắn hạn:

1. **Phương pháp & Kỷ luật ghi chép (*Methodology*):** Quy chuẩn hóa cách thu thập, đối chiếu dữ liệu và gắn nhãn độ xác thực.
2. **Nguồn gốc chứng cứ (*Provenance*):** Mọi dữ kiện quan trọng đều có dẫn chiếu nguồn (ai cung cấp, từ tài liệu nào, lưu trữ ở đâu).
3. **Quyền riêng tư & Phân quyền (*Privacy & Access Control*):**
   - *Public Heritage:* Thông tin di sản chung, lịch sử, văn hóa mở cho gia tộc và cộng đồng.
   - *Family Internal:* Thông tin nhạy cảm của các thế hệ đương đại được bảo mật.
4. **Cơ chế đóng góp & Hiệu đính (*Contribution & Revision*):** Mọi thành viên có thể gửi thêm tư liệu, đính chính sai sót mà không làm hỏng dữ liệu gốc.
5. **Kế thừa hệ thống (*Generational Continuity*):** Xây dựng tài liệu hướng dẫn kỹ thuật và quản trị dữ liệu để thế hệ F2, F3, F4 có thể tiếp quản và duy trì.

---

## VII. CHU TRÌNH VÒNG ĐỜI DI SẢN (HERITAGE LIFECYCLE)

```
       GIỮ LẠI  ─────────►  KẾT NỐI  ─────────►  DIỄN GIẢI  ─────────►  TRUYỀN LẠI
   (Preservation)         (Connection)         (Interpretation)      (Transmission)
          │                     │                     │                     │
   Thu thập những gì     Liên kết người,       Suy ngẫm, viết        Trao gửi điểm tựa
   còn sót lại trung     nhà, địa danh,        bút ký, nhận diện     tinh thần & nếp nhà
   thực, không hư cấu    tư liệu & ký ức       nếp nhà trong MẠCH    cho thế hệ mai sau
```
*(Đây là nguyên tắc vận hành cốt lõi, không phải slogan quảng bá).*

---

## VIII. KIẾN TRÚC SITEMAP ĐỀ XUẤT (PROPOSED PUBLIC SITEMAP)

```text
SITEMAP — DÒNG HỌ TRẦN TRỌNG THU
│
├── 0.0 TRANG CHỦ (Home)
│   ├── Giới thiệu về Dòng họ & Lý do tồn tại của ấn phẩm
│   ├── Điểm tựa 3 trục: Gia Phả, Mạch, Tư Liệu
│   ├── Tổng kết những gì đang được ghi nhận
│   └── Phương pháp ghi chép & Khả năng tiếp tục của thế hệ sau
│
├── 1.0 GIA PHẢ (Structured Lineage & Heritage)
│   ├── 1.1 Tổng quan (Phả ký & Khởi nguyên)
│   ├── 1.2 Phả đồ (Family Graph — Trực hệ Focus & Toàn cảnh Bands)
│   ├── 1.3 Thế hệ (Phân tầng F0–F4)
│   ├── 1.4 Người (Danh bạ thành viên & Hồ sơ nhân vật chi tiết)
│   ├── 1.5 Gia đình (Danh bạ các đơn vị gia đình hạt nhân)
│   ├── 1.6 Chi / Nhánh (Phân nhánh dòng tộc)
│   ├── 1.7 Địa danh (Quê hương Thọ Vực, Bình Châu, Bình Triệu, Sài Gòn...)
│   └── 1.8 Dòng thời gian (Biên niên sử sự kiện phả hệ)
│
├── 2.0 MẠCH (Editorial Voice & Family Narratives)
│   ├── 2.1 Tất cả bài viết
│   ├── 2.2 Chuyện (Giai thoại, mẩu chuyện đời thường)
│   ├── 2.3 Ký ức (Hồi ức tiền nhân, các thế hệ đi trước)
│   ├── 2.4 Suy tưởng (Tiểu luận, góc nhìn về nếp nhà & thời đại)
│   ├── 2.5 Thư (Thư từ trao gửi thế hệ sau — Featured: "Thư gửi Clara")
│   ├── 2.6 Tuyển tập (Series chuyên đề)
│   └── 2.7 Tác giả (Những người chấp bút & nhân chứng đóng góp)
│
├── 3.0 TƯ LIỆU (Archival Records & Evidence Vault)
│   ├── 3.1 Tất cả tư liệu
│   ├── 3.2 Hình ảnh (Ảnh cổ, ảnh sinh hoạt, ảnh di sản)
│   ├── 3.3 Văn bản (Trích lục gia bạ, bản Hán Nôm)
│   ├── 3.4 Giấy tờ (Hộ tịch, sổ rửa tội, thư tay, chứng từ)
│   ├── 3.5 Âm thanh (Audio thu âm lời kể tiền nhân)
│   ├── 3.6 Video (Thước phim tư liệu gia đình)
│   └── 3.7 Bộ sưu tập (Tư liệu theo chủ đề / giai đoạn)
│
├── 4.0 VỀ DÒNG HỌ (Heritage Overview)
│   ├── 4.1 Lịch sử dòng họ
│   ├── 4.2 Nguồn gốc & Tiền nhân
│   ├── 4.3 Những nơi chốn đã đi qua
│   └── 4.4 Những điều còn lại
│
├── 5.0 VỀ DỰ ÁN (Project & Stewardship)
│   ├── 5.1 Vì sao có Cây Gia Phả
│   ├── 5.2 Phương pháp khảo cứu & ghi chép
│   ├── 5.3 Nguồn gốc & Thang mức độ xác tín
│   ├── 5.4 Đóng góp tư liệu & Hiệu đính
│   └── 5.5 Liên hệ & Ban điều phối di sản
│
└── [CAPABILITY] GLOBAL SEARCH (Khả năng tra cứu toàn diện đa miền)
    └── Tích hợp trên thanh công cụ, tra cứu Người, Mạch, Tư liệu, Địa danh.
```

---

## IX. ĐỊNH VỊ BIÊN TẬP TRANG CHỦ (HOMEPAGE EDITORIAL FRAMING)

Trang chủ (*Home*) không phải là một bảng điều khiển dữ liệu phả hệ khô khan (*genealogy dashboard*), cũng không phải lời tuyên ngôn về một dòng tộc hiển hách. Trang chủ phải là một không gian chào đón ấm áp, trang trọng và minh bạch:

> [!NOTE]
> **WORKING EDITORIAL FRAMING (CHƯA PHẢI SLOGAN CUỐI):**
> 
> *“GIA TỘC TRẦN TRỌNG THU là một nơi để những gì còn nhớ được ở lại, được kết nối và có thể được truyền lại.”*

---

### BRAND IDENTITY DECISION (CANONICAL)

`TỪ 1872 ĐẾN CHÚNG TA` là brand narrative / identity line của GIA TỘC TRẦN TRỌNG THU.

Đây là một đơn vị nhận diện hoàn chỉnh, không phải slogan quảng cáo.

`1872` là điểm neo lịch sử của dòng họ, gắn với cụ Giuse Trần Trọng Thu.

`ĐẾN CHÚNG TA` nối trực tiếp quá khứ với thế hệ hiện tại.

Motto này đồng thời là cơ sở ý tưởng cho hướng phát triển visual identity/emblem của dòng họ trong tương lai.

`CÂY GIA PHẢ` là một territory/sản phẩm trong hệ thống, KHÔNG phải brand tagline hay descriptor của `GIA TỘC TRẦN TRỌNG THU`.

Canonical rendering:
```
GIA TỘC TRẦN TRỌNG THU
TỪ 1872 ĐẾN CHÚNG TA
```

Không được tự ý:
- thêm dấu ba chấm
- thêm từ "LƯỢT"
- rút gọn chỉ còn mốc năm
- dùng lại biến thể khác đã bị thay thế
- đổi hậu tố thành mốc thời gian hiện tại
- đổi thành `CÂY GIA PHẢ`
- hoặc sửa câu chữ

nếu chưa có quyết định mới của Owner.

---

**BẢN THẢO LỜI MỞ ĐẦU ẤN PHẨM (WORKING INTRODUCTION):**
> 
> *Giòng họ Trần Trọng Thu không bắt đầu từ một kho tàng lớn.*
> 
> *Nó bắt đầu từ những cái tên, những mối quan hệ, những câu chuyện được nhớ lại, những bức ảnh cũ, những giấy tờ còn sót và những điều có nguy cơ biến mất nếu hôm nay không được ghi lại.*
> 
> *Đây là một publication về một dòng họ, nhưng trước hết là một nỗ lực để dòng họ có thể nhớ chính mình một cách có hệ thống.*
> 
> *Gia phả ghi nhận những con người, gia đình, thế hệ, mối quan hệ, nơi chốn và những dấu vết có thể lần theo.*  
> *Mạch là nơi những ký ức, câu chuyện, suy tưởng và tiếng nói được kể lại.*  
> *Tư liệu lưu giữ những thứ còn lại: hình ảnh, giấy tờ, thư từ, âm thanh, video và những vật chứng của đời sống.*
> 
> *Hệ thống phân biệt rạch ròi giữa điều đã được ghi nhận, điều được kể lại, điều chưa được xác minh và điều chưa biết. Không lấp đầy khoảng trống bằng những câu chuyện được dựng lên cho đẹp hơn.*
> 
> *Giữ lại trước khi diễn giải.*
> 
> *Publication này không phải một công trình đã hoàn tất. Nó là một nơi đang được xây dựng, để người đến sau có thể tiếp tục.*
> 
> *CÂY GIA PHẢ vì thế không bắt đầu từ một dòng họ vĩ đại. Nó bắt đầu từ một mong muốn đơn giản:*  
> **“Đừng để những gì còn có thể nhớ được biến mất.”**

---

## X. DANH SÁCH CÁC VẤN ĐỀ MỞ (OPEN QUESTIONS CHO PHASE KẾ TIẾP)

Tài liệu này xác định các vấn đề học thuật và kiến trúc cần nghiên cứu sâu ở các giai đoạn tiếp theo:

1. **Open Question 01 (Stewardship Governance):** Cơ chế phê duyệt và gắn nhãn xác tín khi một thành viên bất kỳ trong dòng họ gửi thêm tư liệu hoặc câu chuyện mới?
2. **Open Question 02 (Evidence Tagging Schema):** Schema chuẩn để thể hiện 7 mức độ xác tín trực tiếp trên UI của Person Profile và Document Viewer?
3. **Open Question 03 (Privacy Boundary Granularity):** Định nghĩa cụ thể phạm vi dữ liệu cá nhân của thế hệ F3, F4 (người còn sống) cần được bảo vệ ở chế độ hiển thị công khai?
4. **Open Question 04 (Calendar as Temporal Projection):** Phương thức tích hợp tối ưu Lịch Gia đình (Âm/Dương, Bổn mạng, Ngày giỗ) như một View Projection nằm trong trục Gia Phả / Sự kiện mà vẫn giữ trọn vẹn 4 feed RFC 5545 iCalendar hiện có?

---

## XI. NGUYÊN TẮC THIẾT KẾ HỆ THỐNG: ICONOGRAPHY & COLOR SYSTEM (CANONICAL)

### 1. ICONOGRAPHY PRINCIPLE
> “Iconography trong CÂY GIA PHẢ / GIA TỘC TRẦN TRỌNG THU là hệ thống ký hiệu chức năng, đơn sắc, tiết chế và nhất quán. Icon không dùng như lớp trang trí hoặc như hệ mã màu cho các publication territories.”

- **Ký hiệu chức năng (Functional Symbols):** Chỉ sử dụng icon khi có giá trị hỗ trợ thao tác hoặc định vị ngữ cảnh (Search, Calendar, Expand/Collapse, External link, Close, State).
- **Đơn sắc & Kế thừa (Monochrome & Inheritance):** Icon phải đơn sắc, thừa hưởng màu từ `currentColor` / text color, không mang màu sắc cầu vồng hay gradient.
- **Không dùng Emoji làm Icon hệ thống:** Loại bỏ hoàn toàn emoji màu mè khỏi các thành phần điều hướng, thẻ xuất bản và tiêu đề trang.

### 2. COLOR PRINCIPLE
> “Color không được dùng như cơ chế mặc định để phân biệt Gia Phả / Mạch / Tư Liệu. Màu chỉ được sử dụng khi có vai trò semantic, interaction, state hoặc brand identity rõ ràng.”

- Màu sắc phục vụ 5 mục tiêu: (1) Hierarchy, (2) Interaction, (3) State, (4) Accessibility, (5) Brand Identity.
- Không gán màu sắc tùy tiện cho icon để "trang trí card".
- Brand Accents (`--lacquer-red: #881337`, `--imperial-gold: #B45309`) được sử dụng có tiết chế, không biến thành bảng màu đồ họa cho icon.

### 3. TERRITORY PRINCIPLE
> “Gia Phả, Mạch và Tư Liệu là publication territories, không phải ba visual themes độc lập.”

- Ba vùng xuất bản phân biệt bằng: Typography, Heading, Copy, Layout, Content và Navigation Context — **không phân biệt bằng 3 hệ màu hoặc 3 icon hoạt hình riêng**.

### 4. BRAND PRINCIPLE
> “Iconography phải hỗ trợ, không cạnh tranh với Family Name và Family Brand Narrative:
> GIA TỘC TRẦN TRỌNG THU
> TỪ 1872 ĐẾN CHÚNG TA.”

- Trật tự thị giác tối thượng:
  1. Family Name (`GIA TỘC TRẦN TRỌNG THU`)
  2. Family Motto / Narrative (`TỪ 1872 ĐẾN CHÚNG TA`)
  3. Typography
  4. Photography / Archival Material
  5. Content
  6. Functional Iconography

---

## XII. NGUYÊN TẮC KỶ LUẬT THỰC THI

- **KHÔNG** triển khai mã nguồn, không sửa UI, không can thiệp production ngoài phạm vi đã được phê duyệt.
- Mọi thay đổi về thẩm mỹ và ký hiệu phải tuân thủ nghiêm ngặt các nguyên tắc Canonical ở trên.
- Mọi điều chỉnh tiếp theo phải bắt đầu từ tài liệu nền tảng này trước khi cập nhật các đặc tả chi tiết (Data Contract, Sitemap IA, UI Specs).
