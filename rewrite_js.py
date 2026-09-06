import re

with open('src/js/app.js', 'r', encoding='utf-8') as f:
    js = f.read()

# I will replace the inside of openPersonProfile starting from `const pContainer` to the end of the memory block rendering.

start_marker = "const gMeta = getGenerationMeta(p.id);"
end_marker = "window.scrollTo(0, 0);\n}"

pattern = re.compile(re.escape(start_marker) + r'.*?(?=window\.scrollTo\(0, 0\);)', re.DOTALL)

new_logic = """const gMeta = getGenerationMeta(p.id);
    
    // NEW DOM ELEMENTS
    const pName = document.getElementById("p_name");
    const pBadges = document.getElementById("p_badges_container");
    const pMetaGrid = document.getElementById("p_meta_grid");
    const pAvatar = document.getElementById("p_avatar_container");
    const pProv = document.getElementById("p_provenance_badge");
    const pTimeline = document.getElementById("p_timeline");
    const pRels = document.getElementById("p_relatives");
    const pMemoryBox = document.getElementById("p_memory_box");
    const pMemoryTitle = document.getElementById("p_memory_title");
    const pMemoryText = document.getElementById("p_memory_text");

    // 1. IDENTITY & BADGES
    if (pName) pName.innerText = p.name;
    if (pBadges) {
        let genderTxt = p.sex === 'M' ? 'Nam' : (p.sex === 'F' ? 'Nữ' : 'Chưa xác định');
        pBadges.innerHTML = `
            <span class="archival-badge">${gMeta.label}</span>
            <span class="archival-badge">${genderTxt}</span>
            <span class="archival-badge">Tên gốc: ${p.raw_name || p.name}</span>
        `;
    }

    // 2. AVATAR & PROVENANCE
    const avatar = resolvePersonAvatar(p);
    const fallbackTxt = p.name.charAt(0); // Using typographic initial
    if (pAvatar) {
        if (avatar && !avatar.isPlaceholder && avatar.url) {
            pAvatar.innerHTML = `<img src="${avatar.url}" alt="${p.name}" style="width:100%; height:100%; object-fit:cover;"/>`;
        } else {
            pAvatar.innerHTML = `<span class="avatar-placeholder">${fallbackTxt}</span>`;
        }
    }

    if (pProv) {
        if (avatar && !avatar.isPlaceholder && avatar.url) {
            const srcLabel = avatar.source || "FamilySearch";
            const srcId = avatar.sourceId || p.fsid || p.id;
            pProv.innerHTML = `Ảnh chân dung<br/><strong>${srcLabel}</strong><br/>(${srcId})`;
        } else {
            pProv.innerHTML = `Không có ảnh lưu trữ`;
        }
    }

    // 3. META GRID (FSID, Birth, Death headers)
    if (pMetaGrid) {
        pMetaGrid.innerHTML = `
            <div class="meta-item">
                <span class="meta-label">Mã Lưu Trữ (FSID)</span>
                <span class="meta-value">${p.fsid || p.id}</span>
            </div>
            <div class="meta-item">
                <span class="meta-label">Năm Sinh</span>
                <span class="meta-value">${p.birth && p.birth.date ? p.birth.date : 'Chưa rõ'}</span>
            </div>
            <div class="meta-item">
                <span class="meta-label">Năm Mất</span>
                <span class="meta-value">${p.death && p.death.date ? p.death.date : 'Chưa rõ'}</span>
            </div>
        `;
    }

    // 4. TIMELINE (Main Column)
    if (pTimeline) {
        let tHtml = "";
        if (p.birth && (p.birth.date || p.birth.place)) {
            let yr = p.birth.date ? p.birth.date.split(' ').pop() : "Sinh";
            tHtml += `<li class="timeline-item"><div class="timeline-year">${yr}</div><div class="timeline-content">Sinh ra${p.birth.place ? ` tại <strong>${p.birth.place}</strong>` : ''}.</div></li>`;
        }
        if (p.baptism && p.baptism.date) {
            let yr = p.baptism.date.split(' ').pop();
            tHtml += `<li class="timeline-item"><div class="timeline-year">${yr}</div><div class="timeline-content">Lãnh nhận Bí tích Rửa Tội.</div></li>`;
        }
        if (p.death && (p.death.date || p.death.place)) {
            let yr = p.death.date ? p.death.date.split(' ').pop() : "Mất";
            tHtml += `<li class="timeline-item"><div class="timeline-year">${yr}</div><div class="timeline-content">Qua đời${p.death.place ? ` tại <strong>${p.death.place}</strong>` : ''}.</div></li>`;
        }
        if (!tHtml) tHtml = `<li class="timeline-item"><div class="timeline-content">Chưa có dữ liệu sự kiện.</div></li>`;
        pTimeline.innerHTML = tHtml;
    }

    // 5. RELATIONAL SIDEBAR
    if (pRels) {
        let rHtml = "";
        
        // Helper to generate a rel card
        const genCard = (rId, roleLabel) => {
            const rel = appData.people[rId];
            if (!rel) return "";
            const rAv = resolvePersonAvatar(rel);
            const rFallback = rel.name.charAt(0);
            const rThumb = (rAv && !rAv.isPlaceholder && rAv.url)
                ? `<img src="${rAv.url}" class="rel-avatar" style="border-radius:0;"/>`
                : `<div class="rel-avatar">${rFallback}</div>`;
            return `
                <a href="#/person/${rel.id}" onclick="openPersonProfile('${rel.id}')" class="rel-card">
                    ${rThumb}
                    <div class="rel-info">
                        <span class="rel-name">${rel.name}</span>
                        <span class="rel-meta">${roleLabel}</span>
                    </div>
                </a>
            `;
        };

        if (p.parents.length > 0) {
            rHtml += `<h3>Thân Phụ / Thân Mẫu</h3><div class="rel-list">`;
            p.parents.forEach(rId => {
                const sp = appData.people[rId];
                rHtml += genCard(rId, sp ? (sp.sex === 'M' ? 'Cha' : 'Mẹ') : 'Cha/Mẹ');
            });
            rHtml += `</div>`;
        }
        
        if (p.spouses.length > 0) {
            rHtml += `<h3>Hôn Phối</h3><div class="rel-list">`;
            p.spouses.forEach(rId => {
                const sp = appData.people[rId];
                rHtml += genCard(rId, sp ? (sp.sex === 'M' ? 'Chồng' : 'Vợ') : 'Hôn phối');
            });
            rHtml += `</div>`;
        }

        if (p.children.length > 0) {
            p.children.sort((a, b) => {
                const cA = appData.people[a];
                const cB = appData.people[b];
                const yA = (cA && cA.birth && cA.birth.date) ? parseInt(cA.birth.date.split(' ').pop()) || 9999 : 9999;
                const yB = (cB && cB.birth && cB.birth.date) ? parseInt(cB.birth.date.split(' ').pop()) || 9999 : 9999;
                return yA - yB;
            });
            rHtml += `<h3>Hậu Duệ (Con cái)</h3><div class="rel-list">`;
            p.children.forEach(rId => rHtml += genCard(rId, 'Con'));
            rHtml += `</div>`;
        }
        
        pRels.innerHTML = rHtml;
    }

    // 6. MEMORIES
    if (pMemoryBox && pMemoryTitle && pMemoryText) {
        const mem = appData.memories.find(m => m.person_id === p.id);
        if (mem) {
            pMemoryBox.style.display = "block";
            pMemoryText.innerHTML = mem.content.replace(/\\n/g, '<br/>');
        } else {
            pMemoryBox.style.display = "none";
            pMemoryText.innerHTML = "";
        }
    }

    """

js = re.sub(pattern, new_logic, js)

with open('src/js/app.js', 'w', encoding='utf-8') as f:
    f.write(js)
