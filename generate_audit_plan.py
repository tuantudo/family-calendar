import os
import re
from datetime import datetime

doc_files = []
for root, dirs, files in os.walk('.'):
    if '.git' in root or 'node_modules' in root or 'content' in root:
        continue
    for f in files:
        if f.endswith('.md'):
            doc_files.append(os.path.join(root, f))

inventory = []

# Rules for classification
for f in doc_files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
        lines = content.split('\n')
        title = lines[0].replace('#', '').strip() if lines and lines[0].startswith('#') else 'No Title'
        if title == 'No Title' and len(lines) > 1 and lines[1].startswith('#'):
            title = lines[1].replace('#', '').strip()
        
        doc_type = 'Other'
        content_lower = content.lower()
        if 'ontology' in f.lower() or 'quy tắc' in content_lower[:100]:
            doc_type = 'Constitution / Source of Truth'
        elif 'report' in f.lower() or 'báo cáo' in content_lower[:300]:
            doc_type = 'Report'
        elif 'spec' in f.lower() or 'đặc tả' in content_lower[:300] or 'contract' in f.lower():
            doc_type = 'Specification'
        elif 'audit' in f.lower() or 'forensic' in f.lower():
            doc_type = 'Audit'
        elif 'architecture' in f.lower() or 'arch_' in f.lower() or 'kiến trúc' in content_lower[:300] or 'sitemap' in f.lower():
            doc_type = 'Architecture'
        elif 'research' in f.lower() or 'benchmark' in f.lower() or 'khảo sát' in content_lower[:300]:
            doc_type = 'Research'
        elif f == './README.md':
            doc_type = 'Constitution / Source of Truth'
        elif 'implementation' in f.lower():
            doc_type = 'Implementation'
        
        # Check if it's mixed
        type_scores = 0
        if 'báo cáo' in content_lower[:500]: type_scores += 1
        if 'kiến trúc' in content_lower[:500]: type_scores += 1
        if 'đặc tả' in content_lower[:500]: type_scores += 1
        if type_scores >= 2:
            doc_type = 'Mixed'

        status = 'Active'
        if 'Cũ' in title or 'Superseded' in content or 'v1' in title.lower():
            status = 'Superseded'
            
        inventory.append({
            'path': f.replace('./', ''),
            'title': title,
            'type': doc_type,
            'status': status,
            'content': content
        })

inventory.sort(key=lambda x: x['path'])

# Output string buffer
out = []
out.append("# DOCUMENTATION FORENSIC AUDIT\n")

out.append("## 1. Inventory")
for item in inventory:
    out.append(f"- **{item['path']}**: {item['title']} - Type: {item['type']} - Status: {item['status']}")
out.append("\n")

out.append("## 2. Classification")
types = {}
for item in inventory:
    types.setdefault(item['type'], []).append(item['path'])
for t, paths in types.items():
    out.append(f"**{t}**:")
    for p in paths:
        out.append(f"- {p}")
out.append("\n")

out.append("## 3. Authority Map")
out.append("- **Architecture Authority**: `docs/architecture/ARCHITECTURE.md`, `docs/architecture/ROUTE_01_ROUTE_ENTITY_MODEL.md`")
out.append("- **Terminology/Ontology Authority**: `docs/ontology/ONTOLOGY_AND_RULES.md`")
out.append("- **Publication Engine Authority**: `docs/ux/MACH_FOUNDATION_01_PUBLICATION_ENGINE_SPEC.md` và `docs/ux/MACH_FOUNDATION_02_CONTENT_MEDIA_ENGINE.md`")
out.append("- **Historical/Reports**: Toàn bộ các file `*_REPORT.md`, `*_AUDIT.md` trong `docs/ux/`.")
out.append("- **Superseded Authority**: Các file như `SITEMAP_REORGANIZATION_01.md`, `SITEMAP_vNEXT_PROPOSED_02.md` đang bị lấn át bởi `ROUTE_01_ROUTE_ENTITY_MODEL.md`.")
out.append("\n")

out.append("## 4. Conflicts")
out.append("- **Entity Conflict (Website Name)**: Hầu hết các tài liệu (kể cả `ONTOLOGY_AND_RULES.md` và `README.md`) dùng `CÂY GIA PHẢ` làm danh xưng chính của toàn bộ website. Trong khi đó, định nghĩa mới nhất (Source of truth hiện hành) quy định Website Entity là `GIA TỘC TRẦN TRỌNG THU`, còn `CÂY GIA PHẢ` chỉ là một Feature.")
out.append("- **Domain Conflict**: Rất nhiều tài liệu trong `docs/ux/` (như `MACH_VISUAL_REFERENCE_AUDIT.md`, `TYPOGRAPHY_02_GLOBAL_READABILITY.md`) trỏ về `gionghotrantrongthu.vercel.app`. Domain canonical mới là `giatoctrantrongthu.vercel.app` chỉ mới được cập nhật cục bộ ở `FINAL_REPORT.md`, `VERCEL_DEPLOYMENT.md` và `ROUTE_01_ROUTE_ENTITY_MODEL.md`.")
out.append("- **MẠCH Terminology Conflict**: Các file `PUBLICATION_ARCHITECTURE_01.md`, `MACH_FOUNDATION_01_PUBLICATION_ENGINE_SPEC.md` vẫn gọi MẠCH là \"ấn phẩm\" hoặc \"tạp chí\" nhiều lần. Trong khi Ontology mới cấm gọi là \"ấn phẩm\" (thay bằng chuyên mục, bài viết).")
out.append("\n")

out.append("## 5. Duplicate Documents")
out.append("- `docs/architecture/SITEMAP_01_INFORMATION_ARCHITECTURE.md`, `SITEMAP_REORGANIZATION_01.md`, `SITEMAP_vNEXT_PROPOSED_02.md`, và `ROUTE_01_ROUTE_ENTITY_MODEL.md` cùng nói về Architecture và Routing. Gây nhiễu và lặp lặp.")
out.append("- `README.md` ở root và `docs/README.md` đang giẫm chân lên nhau về định hướng đọc tài liệu.")
out.append("- Các báo cáo về MACH UI/UX có dấu hiệu lặp: `MACH_01_IMPLEMENTATION_REPORT.md`, `MACH_02_PUBLICATION_SOURCE.md`, `MACH_ENGINE_01_PUBLICATION_ENGINE_REPORT.md`.")
out.append("\n")

out.append("## 6. Stale Documents")
out.append("- **`docs/publication/PUBLICATION_MODEL_01.md`**: Có thể đã bị supersede bởi họ `MACH_FOUNDATION_*`.")
out.append("- **Các báo cáo Audit**: Đa phần là historical, mô tả hiện trạng của system tại thời điểm cũ, hiện tại system đã update, các report này thành stale nếu coi như spec.")
out.append("\n")

out.append("## 7. Terminology Problems")
out.append("Dựa trên rà soát:")
out.append("1. **CÂY GIA PHẢ**: Đang bị dùng sai ngữ cảnh (dùng như tên Website/Hệ thống thay vì Feature) ở `README.md`, `ONTOLOGY_AND_RULES.md`, `ARCHITECTURE.md`.")
out.append("2. **gionghotrantrongthu.vercel.app**: Tồn tại >30 lần trong các file `docs/ux/*`. Dù đây là lịch sử, nhưng gây rối nếu đọc lại.")
out.append("3. **Ấn phẩm**: Còn sót trong các spec cũ của MẠCH (`MACH_FOUNDATION_01`, `MACH_FOUNDATION_02`, `PUBLICATION_ARCHITECTURE_01`).")
out.append("\n")

out.append("## 8. Naming Problems")
out.append("- Tên file quá dài và dư thừa prefix/suffix: `MACH_FOUNDATION_01_PUBLICATION_ENGINE_SPEC.md` vs `MACH_ENGINE_01_PUBLICATION_ENGINE_REPORT.md`.")
out.append("- Thiếu tính hệ thống ở root `docs`: Có `ARCH_02_UX_BENCHMARK.md` nằm ở `docs/ux` nhưng `ARCHITECTURE.md` nằm ở `docs/architecture`.")
out.append("- Chữ hoa/chữ thường không đồng nhất: `SITEMAP_vNEXT_PROPOSED_02.md` vs `SITEMAP_REORGANIZATION_01.md`.")
out.append("\n")

out.append("## 9. Recommended Normalization")
out.append("| File | Current role | Problem | Evidence | Recommended action | Priority |")
out.append("|---|---|---|---|---|---|")
out.append("| `README.md` | Root entry | Dùng sai Entity `CÂY GIA PHẢ` | Title và content ghi `CÂY GIA PHẢ — FAMILY CALENDAR...` | UPDATE CONTENT | P0 |")
out.append("| `docs/ontology/ONTOLOGY_AND_RULES.md` | Source of Truth | Dùng sai Entity `CÂY GIA PHẢ` | Ghi `CÂY GIA PHẢ — BẢN THỂ LUẬN` | UPDATE CONTENT | P0 |")
out.append("| `docs/architecture/ARCHITECTURE.md` | Arch Spec | Dùng sai Entity | Ghi `DÒNG HỌ TRẦN TRỌNG THU — KIẾN TRÚC...` | UPDATE CONTENT | P0 |")
out.append("| `docs/architecture/SITEMAP_01...`, `SITEMAP_vNEXT...`, `SITEMAP_REORGANIZATION...` | Historical sitemaps | Duplicates / Superseded | Chồng chéo với `ROUTE_01...` | ARCHIVE / MARK SUPERSEDED | P1 |")
out.append("| `docs/ux/MACH_FOUNDATION_*.md` | Spec | Dùng từ `ấn phẩm` | `Ấn phẩm MẠCH`, `Tạp chí MẠCH` | UPDATE CONTENT | P1 |")
out.append("| `docs/ux/*_REPORT.md`, `*_AUDIT.md` | Historical Reports | Chứa domain cũ `gionghotrantrongthu` | Nằm rải rác | MARK SUPERSEDED / ARCHIVE | P2 |")
out.append("| `docs/README.md` | Docs index | Trùng lặp chức năng | `README.md` gốc có thể gánh | MERGE | P2 |")
out.append("\n")

out.append("## 10. Proposed Documentation Structure")
out.append("Cấu trúc thư mục documentation tối thiểu, gọn gàng, tránh rác:")
out.append("```text")
out.append("docs/")
out.append("├── README.md (Mục lục, chỉ dẫn nơi đọc tài liệu)")
out.append("├── 01_CONSTITUTION/ (Source of Truth, Ontology, Naming, Rules)")
out.append("│   └── ONTOLOGY_AND_RULES.md")
out.append("├── 02_ARCHITECTURE/ (Spec kĩ thuật cốt lõi, Data Contract, Route Model)")
out.append("│   ├── ARCHITECTURE.md")
out.append("│   ├── DATA_CONTRACT.md")
out.append("│   ├── ROUTE_ENTITY_MODEL.md (Merge từ các Sitemap)")
out.append("│   └── VERCEL_DEPLOYMENT.md")
out.append("├── 03_FEATURES/ (Đặc tả chi tiết từng tính năng)")
out.append("│   ├── MACH_PUBLICATION_ENGINE.md (Merge từ MACH_FOUNDATION 01 & 02)")
out.append("│   ├── FAMILY_GRAPH.md")
out.append("│   └── CALENDAR.md")
out.append("└── 99_ARCHIVE/ (Toàn bộ các Report, Audit, Research, Benchmark lịch sử)")
out.append("    ├── audits/")
out.append("    ├── reports/")
out.append("    └── research/")
out.append("```")
out.append("- **Source of Truth**: Nằm ở `01_CONSTITUTION` (cập nhật đầu tiên).")
out.append("- **Architecture**: Nằm ở `02_ARCHITECTURE`.")
out.append("- **ADR/Implementation Docs/Spec**: Nằm ở `03_FEATURES`.")
out.append("- **Audit/Report/Historical**: Nhốt hết vào `99_ARCHIVE` để khỏi gây nhiễu search và context.")
out.append("\n")

out.append("## 11. Priority Queue")
out.append("- **P0**: Cập nhật `README.md`, `ONTOLOGY_AND_RULES.md` và `ARCHITECTURE.md` để phản ánh đúng Website Entity (GIA TỘC TRẦN TRỌNG THU) và Feature (CÂY GIA PHẢ). Xóa/thay thế các danh xưng cũ.")
out.append("- **P1**: Gom toàn bộ Sitemap cũ (`SITEMAP_01...`, `SITEMAP_vNEXT...`, `SITEMAP_REORGANIZATION...`) và đánh dấu Superseded hoặc cất vào Archive. Chỉ giữ lại `ROUTE_01_ROUTE_ENTITY_MODEL.md` làm Source of Truth cho navigation.")
out.append("- **P1**: Rà soát `MACH_FOUNDATION_01` & `02`, thay đổi \"ấn phẩm\" thành \"chuyên mục / bài viết\".")
out.append("- **P2**: Chuyển toàn bộ các file `_REPORT`, `_AUDIT`, `_RESEARCH` lịch sử vào thư mục `archive/` (trên Git) hoặc thêm header `> [!WARNING] STATUS: HISTORICAL` để ngăn LLM/người đọc lầm tưởng là spec hiện tại.")
out.append("- **P3**: Quy hoạch lại toàn bộ thư mục `docs/` thành các nhóm `01_CONSTITUTION`, `02_ARCHITECTURE`, `03_FEATURES`, `99_ARCHIVE` như đề xuất.")

with open('DOCUMENTATION_AUDIT.md', 'w', encoding='utf-8') as f:
    f.write('\n'.join(out))

print("DOCUMENTATION_AUDIT.md generated.")
