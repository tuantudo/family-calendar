/**
 * app.js — Main Web Application Runtime & Controller
 * Zero-Hardcode Architecture: Binds 100% dynamically from data/genealogy.json & calendars/*.ics
 */

// --- GLOBAL APPLICATION STATE ---
let appData = {
    publication: "",
    rootAnchor: "",
    generatedAt: "",
    stats: { individuals: 0, families: 0, memories: 0 },
    people: {},
    families: {},
    timeline: [],
    memories: []
};

let calEvents = [];
let curCalDate = new Date();
let calViewMode = 'month'; // 'month' | 'agenda'
let calLayers = { birthdays: true, patrons: true, memorials: true, milestones: true };

const CAL_FEEDS = [
    { key: "birthdays", file: "calendars/CAL_01_BIRTHDAYS.ics", class: "birth", icon: "🎂", label: "Sinh nhật", countEl: "cnt_birth" },
    { key: "patrons", file: "calendars/CAL_02_PATRON_FEASTS.ics", class: "patron", icon: "✝️", label: "Bổn mạng", countEl: "cnt_patron" },
    { key: "memorials", file: "calendars/CAL_03_MEMORIALS.ics", class: "mem", icon: "🕯️", label: "Ngày giỗ", countEl: "cnt_mem" },
    { key: "milestones", file: "calendars/CAL_04_FAMILY_MILESTONES.ics", class: "event", icon: "📅", label: "Sự kiện", countEl: "cnt_event" }
];

// --- INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
    fetch("data/genealogy.json")
        .then(r => r.json())
        .then(data => {
            appData = data;
            bindPublicationHeaders(data);
            bindStats(data.stats);

            initTreeDropdown(data.rootAnchor);
            renderPeopleDirectory();
            renderFamiliesDirectory();
            renderTimeline();
            renderMemories();

            loadCalendarFeeds();
            handleHashRoute();
        })
        .catch(err => {
            console.error("Error loading genealogy dataset:", err);
        });
});

window.addEventListener("hashchange", handleHashRoute);

function bindPublicationHeaders(data) {
    if (data.publication) {
        document.title = `CÂY GIA PHẢ — ${data.publication}`;
        const heroTitle = document.getElementById("heroPublicationTitle");
        if (heroTitle) heroTitle.innerText = data.publication;
        const footerPub = document.getElementById("footerPublication");
        if (footerPub) footerPub.innerText = data.publication;
    }
}

function bindStats(stats) {
    if (!stats) return;
    const elIndis = document.getElementById("stat_indis");
    const elFams = document.getElementById("stat_fams");
    const elMems = document.getElementById("stat_memories");
    const elPeopleCount = document.getElementById("peopleTotalCount");
    const elFamCount = document.getElementById("familiesTotalCount");
    const elQuickDescPeople = document.getElementById("quickDescPeople");

    if (elIndis) elIndis.innerText = stats.individuals || 0;
    if (elFams) elFams.innerText = stats.families || 0;
    if (elMems) elMems.innerText = stats.memories || 0;
    if (elPeopleCount) elPeopleCount.innerText = stats.individuals || 0;
    if (elFamCount) elFamCount.innerText = stats.families || 0;
    if (elQuickDescPeople) elQuickDescPeople.innerText = `Tra cứu ${stats.individuals || 0} thành viên gia tộc và lý lịch chi tiết`;
}

// --- ROUTING & NAVIGATION ---
function handleHashRoute() {
    const hash = window.location.hash || "#/";
    if (hash.startsWith("#/person/")) {
        const pid = hash.replace("#/person/", "");
        openPersonProfile(pid);
    } else if (hash.startsWith("#/family/")) {
        const fid = hash.replace("#/family/", "");
        openFamilyProfile(fid);
    } else {
        const route = hash.replace("#", "") || "/";
        showSectionByRoute(route);
    }
}

function navigateRoute(route) {
    window.location.hash = "#" + route;
}

function showSectionByRoute(route) {
    document.querySelectorAll(".view-section").forEach(s => s.classList.remove("active"));
    document.querySelectorAll(".nav-item-btn").forEach(b => b.classList.remove("active"));

    let secId = "view_home";
    let navId = "nav_home";

    if (route === "/tree") {
        secId = "view_tree";
        navId = "nav_tree";
        renderFamilyTree(appData.rootAnchor || Object.keys(appData.people)[0]);
    } else if (route === "/people") {
        secId = "view_people";
        navId = "nav_people";
    } else if (route === "/families") {
        secId = "view_families";
        navId = "nav_families";
    } else if (route === "/calendar") {
        secId = "view_calendar";
        navId = "nav_calendar";
        renderCalendarModule();
    } else if (route === "/timeline") {
        secId = "view_timeline";
        navId = "nav_timeline";
    } else if (route === "/memories") {
        secId = "view_memories";
        navId = "nav_memories";
    }

    const sec = document.getElementById(secId);
    if (sec) sec.classList.add("active");
    const nav = document.getElementById(navId);
    if (nav) nav.classList.add("active");
    window.scrollTo(0, 0);
}

// --- CALENDAR MODULE ---
function loadCalendarFeeds() {
    let promises = CAL_FEEDS.map(f => {
        return fetch(f.file)
            .then(r => r.text())
            .then(txt => {
                const events = IcsParser.parseFeed(txt, f);
                const cntEl = document.getElementById(f.countEl);
                if (cntEl) cntEl.innerText = events.length;
                return events;
            })
            .catch(() => []);
    });

    Promise.all(promises).then(res => {
        calEvents = [];
        res.forEach(evs => { calEvents = calEvents.concat(evs); });
        
        const elTotalEvs = document.getElementById("stat_events");
        if (elTotalEvs) elTotalEvs.innerText = calEvents.length;

        renderCalendarModule();
    });
}

function renderCalendarModule() {
    const y = curCalDate.getFullYear();
    const m = curCalDate.getMonth();
    const elSolar = document.getElementById("calSolarLabel");
    const elLunar = document.getElementById("calLunarLabel");

    if (elSolar) elSolar.innerText = `Tháng ${m + 1} năm ${y}`;
    if (elLunar) {
        const midL = LunarCal.convertSolar2Lunar(15, m + 1, y);
        elLunar.innerText = `Tháng ${midL.month} ÂL · Năm ${midL.canChi}`;
    }

    if (calViewMode === 'month') {
        renderMonthGrid(y, m);
    } else {
        renderAgendaList(y, m);
    }
}

function renderMonthGrid(y, m) {
    const grid = document.getElementById("monthCellsContainer");
    if (!grid) return;
    grid.innerHTML = "";

    const firstDay = new Date(y, m, 1).getDay();
    const daysInM = new Date(y, m + 1, 0).getDate();
    const daysInPrev = new Date(y, m, 0).getDate();
    const today = new Date();
    const isCurM = (today.getFullYear() === y && today.getMonth() === m);

    let total = (firstDay + daysInM > 35) ? 42 : 35;
    for (let i = 0; i < total; i++) {
        let cy = y, cm = m + 1, cd = 0, isOther = false;
        if (i < firstDay) {
            isOther = true;
            cd = daysInPrev - (firstDay - i - 1);
            cm = m === 0 ? 12 : m;
            cy = m === 0 ? y - 1 : y;
        } else if (i >= firstDay + daysInM) {
            isOther = true;
            cd = i - (firstDay + daysInM) + 1;
            cm = m === 11 ? 1 : m + 2;
            cy = m === 11 ? y + 1 : y;
        } else {
            cd = i - firstDay + 1;
        }

        const isToday = isCurM && !isOther && (today.getDate() === cd);
        const lunar = LunarCal.convertSolar2Lunar(cd, cm, cy);
        const mmddStr = `${cm < 10 ? '0' + cm : cm}${cd < 10 ? '0' + cd : cd}`;
        const matchedEvs = calEvents.filter(ev => calLayers[ev.layer] && ev.mmdd === mmddStr);

        const cell = document.createElement("div");
        cell.className = `grid-day-cell ${isOther ? 'other-month' : ''} ${isToday ? 'today' : ''}`;
        cell.onclick = () => openDayDrawer(cd, cm, cy, lunar, matchedEvs);

        let lunarLabel = `${lunar.day}`;
        if (lunar.day === 1 || lunar.day === 15) lunarLabel = `${lunar.day}/${lunar.month}${lunar.isLeap ? 'N' : ''}`;

        let evChips = "";
        const maxPreview = 3;
        matchedEvs.slice(0, maxPreview).forEach(ev => {
            evChips += `<div class="event-chip-item ${ev.chipCls}" title="${escapeHtml(ev.summary)}" onclick="event.stopPropagation(); openEventDetailModal(${calEvents.indexOf(ev)}, ${cy})">${escapeHtml(ev.summary)}</div>`;
        });
        if (matchedEvs.length > maxPreview) {
            evChips += `<div class="more-badge" onclick="event.stopPropagation(); openDayDrawer(${cd}, ${cm}, ${cy}, LunarCal.convertSolar2Lunar(${cd}, ${cm}, ${cy}), calEvents.filter(e => calLayers[e.layer] && e.mmdd === '${mmddStr}'))">+${matchedEvs.length - maxPreview} sự kiện khác...</div>`;
        }

        cell.innerHTML = `
            <div class="cell-top">
                <span class="solar-badge">${cd}</span>
                <span class="lunar-badge">${lunarLabel}</span>
            </div>
            <div class="cell-events">${evChips}</div>
        `;
        grid.appendChild(cell);
    }
}

function renderAgendaList(y, m) {
    const container = document.getElementById("agendaListContainer");
    if (!container) return;
    container.innerHTML = "";

    const daysInM = new Date(y, m + 1, 0).getDate();
    let hasAny = false;

    for (let d = 1; d <= daysInM; d++) {
        const mmddStr = `${(m + 1) < 10 ? '0' + (m + 1) : (m + 1)}${d < 10 ? '0' + d : d}`;
        const matchedEvs = calEvents.filter(ev => calLayers[ev.layer] && ev.mmdd === mmddStr);
        if (matchedEvs.length === 0) continue;
        hasAny = true;

        const lunar = LunarCal.convertSolar2Lunar(d, m + 1, y);
        const dayGroup = document.createElement("div");
        dayGroup.className = "agenda-group";

        let evCardsHtml = "";
        matchedEvs.forEach(ev => {
            evCardsHtml += `
                <div class="agenda-event-card ${ev.chipCls}" onclick="openEventDetailModal(${calEvents.indexOf(ev)}, ${y})">
                    <div class="agenda-ev-title">${ev.icon} ${escapeHtml(ev.summary)}</div>
                    <div class="agenda-ev-meta">Loại: <strong>${ev.label}</strong> • Nhấp để xem lý lịch & ký ức</div>
                </div>
            `;
        });

        dayGroup.innerHTML = `
            <div class="agenda-date-head">
                <span>Ngày ${d < 10 ? '0' + d : d}/${(m + 1) < 10 ? '0' + (m + 1) : (m + 1)}/${y}</span>
                <span style="font-size:12.5px; font-weight:600; color:var(--lunar-color);">🌙 ${lunar.fullText}</span>
            </div>
            <div class="agenda-events-list">${evCardsHtml}</div>
        `;
        container.appendChild(dayGroup);
    }

    if (!hasAny) {
        container.innerHTML = `<div style="text-align:center; padding:40px; color:var(--text-muted);">Không có sự kiện gia phả nào trong tháng ${m + 1} theo bộ lọc hiện tại.</div>`;
    }
}

function switchCalendarView(mode) {
    calViewMode = mode;
    const btnMonth = document.getElementById("btn_view_month");
    const btnAgenda = document.getElementById("btn_view_agenda");
    const vMonth = document.getElementById("calendarMonthView");
    const vAgenda = document.getElementById("calendarAgendaView");

    if (btnMonth) btnMonth.classList.toggle("active", mode === 'month');
    if (btnAgenda) btnAgenda.classList.toggle("active", mode === 'agenda');
    if (vMonth) vMonth.style.display = mode === 'month' ? 'block' : 'none';
    if (vAgenda) vAgenda.style.display = mode === 'agenda' ? 'block' : 'none';
    renderCalendarModule();
}

function navigateCalendarMonth(offset) {
    curCalDate.setMonth(curCalDate.getMonth() + offset);
    renderCalendarModule();
}

function goToCalendarToday() {
    curCalDate = new Date();
    renderCalendarModule();
}

function toggleLayerChip(layerKey) {
    const chipKey = layerKey === 'birthdays' ? 'birth' : layerKey === 'patrons' ? 'patron' : layerKey === 'memorials' ? 'mem' : 'event';
    const chk = document.getElementById("chk_" + chipKey);
    if (!chk) return;
    chk.checked = !chk.checked;
    calLayers[layerKey] = chk.checked;
    const chip = document.getElementById("chip_" + chipKey);
    if (chip) chip.classList.toggle("active-" + chipKey, chk.checked);
    renderCalendarModule();
}

// --- DAY DRAWER ---
function openDayDrawer(day, month, year, lunar, events) {
    const elTitle = document.getElementById("drawerDateTitle");
    const elSub = document.getElementById("drawerLunarSub");
    const list = document.getElementById("drawerEventsList");

    if (elTitle) elTitle.innerText = `Ngày ${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
    if (elSub) elSub.innerText = `🌙 Âm lịch: ${lunar.fullText}`;
    if (!list) return;

    list.innerHTML = "";
    if (events.length === 0) {
        list.innerHTML = `<div style="text-align:center; padding:30px; color:var(--text-muted);">Không có sự kiện gia phả nào trong ngày này.</div>`;
    } else {
        events.forEach(ev => {
            const card = document.createElement("div");
            card.className = `agenda-event-card ${ev.chipCls}`;
            card.onclick = () => {
                closeDrawerDirect();
                openEventDetailModal(calEvents.indexOf(ev), year);
            };
            card.innerHTML = `
                <div style="font-weight:700; font-size:14.5px;">${ev.icon} ${escapeHtml(ev.summary)}</div>
                <div style="font-size:12.5px; color:var(--text-muted); margin-top:4px;">Loại: <strong>${ev.label}</strong> • Xem lý lịch & tư liệu →</div>
            `;
            list.appendChild(card);
        });
    }
    const drawer = document.getElementById("dayDrawer");
    if (drawer) drawer.classList.add("active");
}

function closeDrawer(e) {
    if (e.target === document.getElementById("dayDrawer")) closeDrawerDirect();
}
function closeDrawerDirect() {
    const drawer = document.getElementById("dayDrawer");
    if (drawer) drawer.classList.remove("active");
}

// --- EVENT DETAIL MODAL WITH DEEP LINKING ---
function openEventDetailModal(evIdx, yr) {
    const ev = calEvents[evIdx];
    if (!ev) return;
    const lunar = LunarCal.convertSolar2Lunar(ev.day, ev.month, yr);
    const elTitle = document.getElementById("evModalTitle");
    const elDates = document.getElementById("evModalDates");
    const elDesc = document.getElementById("evModalDesc");
    const linkBox = document.getElementById("evModalPersonLink");

    if (elTitle) elTitle.innerText = ev.summary;
    if (elDates) {
        elDates.innerHTML = `
            <div>📅 <strong>Dương lịch:</strong> ${ev.day < 10 ? '0' + ev.day : ev.day}/${ev.month < 10 ? '0' + ev.month : ev.month}/${yr}</div>
            <div style="color:var(--lunar-color); margin-top:2px;">🌙 <strong>Âm lịch:</strong> ${lunar.fullText}</div>
        `;
    }

    let personMatch = null;
    if (ev.fsid) {
        personMatch = Object.values(appData.people).find(p => p.fsid === ev.fsid);
    }
    if (personMatch && linkBox) {
        linkBox.style.display = "block";
        linkBox.innerHTML = `
            <div style="padding:8px 12px; background:var(--primary-light); border-radius:6px; border:1px solid #bfdbfe; font-size:13px;">
                👤 Thành viên liên quan: <a onclick="closeModalDirect('eventModal'); openPersonProfile('${personMatch.id}')" style="color:var(--primary); font-weight:700; cursor:pointer; text-decoration:underline;">${personMatch.name} (Xem hồ sơ gia phả →)</a>
            </div>
        `;
    } else if (linkBox) {
        linkBox.style.display = "none";
    }

    if (elDesc) elDesc.innerText = ev.description || "Không có mô tả chi tiết.";
    const modal = document.getElementById("eventModal");
    if (modal) modal.classList.add("active");
}

// --- TREE MODULE ---
function initTreeDropdown(defaultRootId) {
    const select = document.getElementById("treeCenterSelect");
    if (!select) return;
    select.innerHTML = "";
    Object.values(appData.people).forEach(p => {
        const opt = document.createElement("option");
        opt.value = p.id;
        opt.innerText = `${p.name} (${p.fsid || p.id})`;
        if (p.id === defaultRootId) opt.selected = true;
        select.appendChild(opt);
    });
}

function renderFamilyTree(centerId) {
    const container = document.getElementById("treeGraphViewport");
    if (!container) return;
    container.innerHTML = "";
    const person = appData.people[centerId];
    if (!person) return;

    let parentsHtml = person.parents.length > 0 ? person.parents.map(pid => renderTreeNodeCard(pid, 'parent')).join("") : `<div style="font-size:13px; color:var(--text-muted); padding:10px;">(Không có thông tin thân phụ/thân mẫu)</div>`;
    let centerHtml = renderTreeNodeCard(person.id, 'center');
    let spousesHtml = person.spouses.map(sid => renderTreeNodeCard(sid, 'spouse')).join("");
    let childrenHtml = person.children.length > 0 ? person.children.map(cid => renderTreeNodeCard(cid, 'child')).join("") : `<div style="font-size:13px; color:var(--text-muted); padding:10px;">(Không có thông tin con cái)</div>`;

    container.innerHTML = `
        <div style="font-size:12px; font-weight:800; color:var(--text-muted); text-transform:uppercase; margin-bottom:6px;">1. Thân Phụ & Thân Mẫu (Tiền Nhân)</div>
        <div class="tree-level">${parentsHtml}</div>
        <div style="font-size:16px; color:var(--border); margin:-10px 0 10px;">↓</div>

        <div style="font-size:12px; font-weight:800; color:var(--text-muted); text-transform:uppercase; margin-bottom:6px;">2. Thế Hệ Đương Thời (Vợ / Chồng)</div>
        <div class="tree-level">${centerHtml}${spousesHtml}</div>
        <div style="font-size:16px; color:var(--border); margin:-10px 0 10px;">↓</div>

        <div style="font-size:12px; font-weight:800; color:var(--text-muted); text-transform:uppercase; margin-bottom:6px;">3. Con Cái Trực Hệ (Hậu Duệ)</div>
        <div class="tree-level" style="flex-wrap:wrap;">${childrenHtml}</div>
    `;
}

function renderTreeNodeCard(pid, type) {
    const p = appData.people[pid];
    if (!p) return "";
    const isCenter = type === 'center';
    const bYear = p.birth && p.birth.date ? p.birth.date : "?";
    const dYear = p.death && p.death.date ? p.death.date : "";
    const lifeStr = dYear ? `${bYear} – ${dYear}` : (bYear !== "?" ? `Sinh: ${bYear}` : "");

    return `
        <div class="tree-node ${isCenter ? 'center' : ''}" onclick="openPersonProfile('${p.id}')">
            <div style="font-weight:700; font-size:14px;">${p.name}</div>
            <div style="font-size:11.5px; color:var(--text-muted); margin-top:2px;">${lifeStr}</div>
            <div style="font-size:10px; color:var(--primary); margin-top:4px; font-weight:700;">${isCenter ? '★ Trọng tâm' : 'Xem hồ sơ →'}</div>
        </div>
    `;
}

// --- DIRECTORIES ---
function renderPeopleDirectory() {
    const grid = document.getElementById("peopleGrid");
    if (!grid) return;
    grid.innerHTML = "";
    Object.values(appData.people).forEach(p => {
        const card = document.createElement("div");
        card.className = "person-card";
        card.onclick = () => openPersonProfile(p.id);
        const bDate = p.birth && p.birth.date ? p.birth.date : "Chưa rõ";
        const dDate = p.death && p.death.date ? p.death.date : "";
        card.innerHTML = `
            <div style="font-weight:700; font-size:15px; color:var(--primary-dark);">${p.name}</div>
            <div style="font-size:12px; color:var(--text-muted); margin-top:2px;">FSID: <strong>${p.fsid || p.id}</strong> • ${p.sex === 'M' ? 'Nam' : 'Nữ'}</div>
            <div style="font-size:12px; color:var(--text-muted);">Sinh: ${bDate} ${dDate ? `• Mất: ${dDate}` : ''}</div>
        `;
        grid.appendChild(card);
    });
}

function renderFamiliesDirectory() {
    const grid = document.getElementById("familiesGrid");
    if (!grid) return;
    grid.innerHTML = "";
    Object.values(appData.families).forEach(f => {
        const card = document.createElement("div");
        card.className = "family-card";
        card.onclick = () => openFamilyProfile(f.id);
        const husb = appData.people[f.husband], wife = appData.people[f.wife];
        card.innerHTML = `
            <div style="font-weight:700; font-size:15px; color:var(--primary-dark);">Nhánh: ${husb ? husb.name : 'Chưa rõ'} & ${wife ? wife.name : 'Chưa rõ'}</div>
            <div style="font-size:12px; color:var(--text-muted); margin-top:2px;">Mã FAM: <strong>${f.id}</strong> • Con cái: <strong>${f.children.length}</strong> người con</div>
        `;
        grid.appendChild(card);
    });
}

// --- PROFILES ---
function openPersonProfile(pid) {
    const p = appData.people[pid];
    if (!p) return;
    window.location.hash = `#/person/${pid}`;
    document.querySelectorAll(".view-section").forEach(s => s.classList.remove("active"));
    const sec = document.getElementById("view_person");
    if (sec) sec.classList.add("active");

    const pName = document.getElementById("p_name");
    const pGender = document.getElementById("p_gender_status");
    const pFsid = document.getElementById("p_fsid");
    const pFacts = document.getElementById("p_facts");
    const pRels = document.getElementById("p_relatives");

    if (pName) pName.innerText = p.name;
    if (pGender) pGender.innerText = `${p.sex === 'M' ? 'Nam' : 'Nữ'} • Tên gốc: ${p.raw_name}`;
    if (pFsid) pFsid.innerText = `FSID: ${p.fsid || p.id}`;

    let factsHtml = `<div>• <strong>Ngày sinh:</strong> ${p.birth && p.birth.date ? p.birth.date : 'Chưa có dữ kiện'} ${p.birth && p.birth.place ? `(${p.birth.place})` : ''}</div>`;
    factsHtml += `<div>• <strong>Ngày qua đời:</strong> ${p.death && p.death.date ? p.death.date : 'Chưa có dữ kiện'} ${p.death && p.death.place ? `(${p.death.place})` : ''}</div>`;
    if (p.baptism && p.baptism.date) factsHtml += `<div>• <strong>Bí tích Rửa Tội:</strong> ${p.baptism.date}</div>`;
    if (pFacts) pFacts.innerHTML = factsHtml;

    let relsHtml = "";
    if (p.parents.length > 0) {
        relsHtml += `<div style="font-weight:700; font-size:13px; color:var(--text-muted); margin-bottom:4px;">Thân Phụ / Thân Mẫu:</div>`;
        p.parents.forEach(parId => {
            const par = appData.people[parId];
            if (par) relsHtml += `<a class="rel-link" onclick="openPersonProfile('${par.id}')">👤 ${par.name} (${par.sex === 'M' ? 'Cha' : 'Mẹ'})</a>`;
        });
    }
    if (p.spouses.length > 0) {
        relsHtml += `<div style="font-weight:700; font-size:13px; color:var(--text-muted); margin-top:10px; margin-bottom:4px;">Hôn Phối:</div>`;
        p.spouses.forEach(spId => {
            const sp = appData.people[spId];
            if (sp) relsHtml += `<a class="rel-link" onclick="openPersonProfile('${sp.id}')">💍 ${sp.name}</a>`;
        });
    }
    if (p.children.length > 0) {
        relsHtml += `<div style="font-weight:700; font-size:13px; color:var(--text-muted); margin-top:10px; margin-bottom:4px;">Con Cái (${p.children.length}):</div>`;
        p.children.forEach(chId => {
            const ch = appData.people[chId];
            if (ch) relsHtml += `<a class="rel-link" onclick="openPersonProfile('${ch.id}')">👶 ${ch.name}</a>`;
        });
    }
    if (pRels) pRels.innerHTML = relsHtml;

    const memBox = document.getElementById("p_memory_box");
    if (p.memory && memBox) {
        memBox.style.display = "block";
        const mTitle = document.getElementById("p_memory_title");
        const mText = document.getElementById("p_memory_text");
        if (mTitle) mTitle.innerText = p.memory.title;
        if (mText) mText.innerText = p.memory.story;
    } else if (memBox) {
        memBox.style.display = "none";
    }
    window.scrollTo(0, 0);
}

function openFamilyProfile(fid) {
    const f = appData.families[fid];
    if (!f) return;
    window.location.hash = `#/family/${fid}`;
    document.querySelectorAll(".view-section").forEach(s => s.classList.remove("active"));
    const sec = document.getElementById("view_family");
    if (sec) sec.classList.add("active");

    const husb = appData.people[f.husband], wife = appData.people[f.wife];
    const fTitle = document.getElementById("f_title");
    const fId = document.getElementById("f_id_label");
    const fMarr = document.getElementById("f_marr_meta");
    const fParents = document.getElementById("f_parents");
    const fChildren = document.getElementById("f_children");

    if (fTitle) fTitle.innerText = `Gia Đình: ${husb ? husb.name : 'Chưa rõ'} & ${wife ? wife.name : 'Chưa rõ'}`;
    if (fId) fId.innerText = `FAM ID: ${f.id}`;
    if (fMarr) fMarr.innerText = f.marriage && f.marriage.date ? `Kết hôn: ${f.marriage.date}` : "Chưa có thông tin hôn phối chính thức";

    let pHtml = "";
    if (husb) pHtml += `<a class="rel-link" onclick="openPersonProfile('${husb.id}')">👨 Người chồng: ${husb.name}</a>`;
    if (wife) pHtml += `<a class="rel-link" onclick="openPersonProfile('${wife.id}')">👩 Người vợ: ${wife.name}</a>`;
    if (fParents) fParents.innerHTML = pHtml;

    let cHtml = "";
    if (f.children.length > 0) {
        f.children.forEach(cid => {
            const c = appData.people[cid];
            if (c) cHtml += `<a class="rel-link" onclick="openPersonProfile('${c.id}')">👶 ${c.name}</a>`;
        });
    } else {
        cHtml = `<div style="font-size:13px; color:var(--text-muted);">(Chưa có dữ liệu con cái)</div>`;
    }
    if (fChildren) fChildren.innerHTML = cHtml;
    window.scrollTo(0, 0);
}

function renderTimeline() {
    const list = document.getElementById("timelineEventsList");
    if (!list) return;
    list.innerHTML = "";
    appData.timeline.forEach(ev => {
        const item = document.createElement("div");
        item.className = "timeline-item";
        item.innerHTML = `
            <div class="timeline-dot"></div>
            <div style="font-size:12px; font-weight:800; color:var(--accent);">${ev.year !== 9999 ? ev.year : 'Chưa rõ năm'}</div>
            <div style="font-size:14.5px; font-weight:700;"><a onclick="openPersonProfile('${ev.personId}')" style="color:var(--primary); cursor:pointer;">${ev.title}</a></div>
            <div style="font-size:12.5px; color:var(--text-muted);">Ngày ghi nhận: ${ev.date}</div>
        `;
        list.appendChild(item);
    });
}

function renderMemories() {
    const container = document.getElementById("memoriesContainer");
    if (!container) return;
    container.innerHTML = "";
    appData.memories.forEach(mem => {
        const card = document.createElement("div");
        card.className = "memory-card";
        card.innerHTML = `
            <div class="memory-title">${mem.title}</div>
            <div style="font-size:13px; font-weight:600; color:var(--text-muted); margin-bottom:12px;">Nhân vật liên quan: <a onclick="openPersonProfile('${mem.personId}')" style="color:var(--primary); cursor:pointer;">${mem.personName}</a></div>
            <div class="memory-body">${mem.story}</div>
        `;
        container.appendChild(card);
    });
}

// --- GLOBAL SEARCH ---
function handleGlobalSearch(e) {
    const q = e.target.value.toLowerCase().trim();
    const dd = document.getElementById("globalSearchDropdown");
    if (!dd) return;
    if (!q) { dd.style.display = "none"; return; }

    const results = [];
    Object.values(appData.people).forEach(p => {
        if (p.name.toLowerCase().includes(q) || (p.fsid && p.fsid.toLowerCase().includes(q))) {
            results.push({ type: 'PERSON', id: p.id, title: p.name, sub: `Thành viên • FSID: ${p.fsid || p.id}` });
        }
    });
    appData.memories.forEach(m => {
        if (m.title.toLowerCase().includes(q) || m.story.toLowerCase().includes(q)) {
            results.push({ type: 'MEMORY', id: m.id, title: m.title, sub: `Ký ức gia tộc • ${m.personName}` });
        }
    });

    if (results.length === 0) {
        dd.innerHTML = `<div style="padding:10px; color:var(--text-muted); text-align:center;">Không tìm thấy kết quả</div>`;
    } else {
        dd.innerHTML = results.slice(0, 10).map(r => `
            <div class="search-row" onclick="selectGlobalSearchResult('${r.type}', '${r.id}')">
                <div style="font-weight:700; color:var(--primary-dark);">${r.title}</div>
                <div style="font-size:11.5px; color:var(--text-muted);">${r.sub}</div>
            </div>
        `).join("");
    }
    dd.style.display = "block";
}

function selectGlobalSearchResult(type, id) {
    const dd = document.getElementById("globalSearchDropdown");
    const inp = document.getElementById("globalSearchInput");
    if (dd) dd.style.display = "none";
    if (inp) inp.value = "";
    if (type === 'PERSON') openPersonProfile(id);
    else if (type === 'MEMORY') navigateRoute('/memories');
}

document.addEventListener("click", (e) => {
    if (!e.target.closest(".nav-search")) {
        const dd = document.getElementById("globalSearchDropdown");
        if (dd) dd.style.display = "none";
    }
});

// --- MODAL UTILITIES ---
function closeModal(event, modalId) {
    if (event.target === document.getElementById(modalId)) closeModalDirect(modalId);
}
function closeModalDirect(modalId) {
    const m = document.getElementById(modalId);
    if (m) m.classList.remove("active");
}
function escapeHtml(text) {
    if (!text) return "";
    const div = document.createElement("div");
    div.innerText = text;
    return div.innerHTML;
}
