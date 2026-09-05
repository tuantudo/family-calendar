/**
 * app.js — Main Web Application Controller & Entity Graph Engine
 * Architectural Benchmark: Google Calendar UX + webtrees Entity Graph
 * ARCH_03B: Visual Language Consistency with Family Directory, Dual Mode (Explore / Focus)
 * 100% Data-Driven, Zero Hard-Code
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

let machData = {
    authors: {},
    series: {},
    topics: {},
    stories: []
};
let currentMachTab = 'all'; // 'all' | 'series' | 'authors'

// Derived Graph State
let derivedGenerations = {}; // pid -> level integer (0 = Root Anchor, 1 = F1, etc.)
let derivedPaths = {};        // pid -> [pid0, pid1, ... pidN] shortest lineage path from Anchor
let derivedFamilyGenerations = {}; // fid -> level integer (0 = F0 family, 1 = F1, etc.)
let currentFamilyGenFilter = 'all'; // 'all' | 0 | 1 | 2 | 3 | 4
let treeViewMode = 'focus'; // 'focus' (Pedigree Visual Graph) | 'explore' (Generation Bands)
let currentTreeFocusId = "";  // Currently selected person in Focus Mode

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
            deriveFamilyGraphGenerations(data.rootAnchor || Object.keys(data.people)[0]);
            
            bindPublicationHeaders(data);
            bindStats(data.stats);

            initTreeDropdown(data.rootAnchor);
            renderPeopleDirectory();
            renderFamiliesDirectory('all');
            renderTimeline();
            renderMemories();

            loadCalendarFeeds();
            fetch("data/mach.json")
                .then(r => r.json())
                .then(m => {
                    machData = m;
                    renderMachModule();
                    handleHashRoute();
                })
                .catch(err => {
                    console.warn("Could not load data/mach.json:", err);
                    handleHashRoute();
                });
        })
        .catch(err => {
            console.error("Error loading genealogy dataset:", err);
        });
});

window.addEventListener("hashchange", handleHashRoute);

// --- DYNAMIC GRAPH DERIVATION ENGINE (BFS FROM FAMILY ANCHOR) ---
function deriveFamilyGraphGenerations(rootId) {
    const people = appData.people;
    const families = appData.families;
    derivedGenerations = {};
    derivedPaths = {};
    derivedFamilyGenerations = {};

    if (!people[rootId]) return;

    // 1. Build relationship adjacency graph for individual people
    const adj = {};
    Object.keys(people).forEach(pid => {
        adj[pid] = [];
        const p = people[pid];
        (p.children || []).forEach(cid => { if (people[cid]) adj[pid].push({ id: cid, delta: 1, type: 'child' }); });
        (p.parents || []).forEach(parId => { if (people[parId]) adj[pid].push({ id: parId, delta: -1, type: 'parent' }); });
        (p.spouses || []).forEach(sid => { if (people[sid]) adj[pid].push({ id: sid, delta: 0, type: 'spouse' }); });
    });

    // BFS Queue for Person Generations
    const queue = [rootId];
    derivedGenerations[rootId] = 0;
    derivedPaths[rootId] = [rootId];
    const visited = new Set([rootId]);

    while (queue.length > 0) {
        const currId = queue.shift();
        const currLvl = derivedGenerations[currId];
        const currPath = derivedPaths[currId];

        (adj[currId] || []).forEach(edge => {
            if (!visited.has(edge.id)) {
                visited.add(edge.id);
                derivedGenerations[edge.id] = currLvl + edge.delta;
                derivedPaths[edge.id] = [...currPath, edge.id];
                queue.push(edge.id);
            }
        });
    }

    // 2. Derive Family Unit Generation strictly from Relationship Graph
    Object.keys(families).forEach(fid => {
        const fam = families[fid];
        const h = fam.husband;
        const w = fam.wife;
        const chils = fam.children || [];

        const hLvl = (h && derivedGenerations[h] !== undefined) ? derivedGenerations[h] : null;
        const wLvl = (w && derivedGenerations[w] !== undefined) ? derivedGenerations[w] : null;

        let lvl = null;
        if (h === rootId || w === rootId) {
            lvl = 0;
        } else if (hLvl !== null && wLvl !== null) {
            lvl = (hLvl >= 0 && wLvl >= 0) ? Math.min(hLvl, wLvl) : (hLvl >= 0 ? hLvl : wLvl);
        } else if (hLvl !== null) {
            lvl = hLvl;
        } else if (wLvl !== null) {
            lvl = wLvl;
        } else if (chils.length > 0) {
            const chLvls = chils.map(c => derivedGenerations[c]).filter(l => l !== undefined);
            if (chLvls.length > 0) {
                lvl = Math.min(...chLvls) - 1;
            }
        }
        derivedFamilyGenerations[fid] = lvl;
    });
}

function getGenerationMeta(pid) {
    const lvl = derivedGenerations[pid];
    if (lvl === undefined || lvl === null) return { level: 99, label: "Gia tộc", badgeCls: "gen-other", borderCls: "border-other", title: "Thành viên gia tộc" };
    if (lvl < 0) return { level: lvl, label: `Tiền nhân (F${lvl})`, badgeCls: "gen-f0", borderCls: "border-f0", title: "Bậc tiền nhân" };
    if (lvl === 0) return { level: 0, label: "F0 · Gốc Phả Hệ", badgeCls: "gen-f0", borderCls: "border-f0", title: "Cố Thu (Family Anchor)" };
    if (lvl === 1) return { level: 1, label: "F1 · Đời Con", badgeCls: "gen-f1", borderCls: "border-f1", title: "Thế hệ thứ 1 (Con)" };
    if (lvl === 2) return { level: 2, label: "F2 · Đời Cháu", badgeCls: "gen-f2", borderCls: "border-f2", title: "Thế hệ thứ 2 (Cháu)" };
    if (lvl === 3) return { level: 3, label: "F3 · Đời Chắt", badgeCls: "gen-f3", borderCls: "border-f3", title: "Thế hệ thứ 3 (Chắt)" };
    if (lvl === 4) return { level: 4, label: "F4 · Đời Chút", badgeCls: "gen-f4", borderCls: "border-f4", title: "Thế hệ thứ 4 (Chút)" };
    return { level: lvl, label: `F${lvl} · Hậu duệ`, badgeCls: "gen-f4", borderCls: "border-f4", title: `Thế hệ thứ ${lvl}` };
}

function getFamilyGenerationMeta(fid) {
    const lvl = derivedFamilyGenerations[fid];
    if (lvl === undefined || lvl === null) return { level: 99, label: "Gia tộc", badgeCls: "gen-other", borderCls: "border-other", bgCls: "bg-gen-other", title: "Nhánh chưa phân loại" };
    if (lvl < 0) return { level: lvl, label: `Tiền nhân (F${lvl})`, badgeCls: "gen-f0", borderCls: "border-f0", bgCls: "bg-gen-f0", title: "Bậc tiền nhân" };
    if (lvl === 0) return { level: 0, label: "F0 · Đời Cố Thu", badgeCls: "gen-f0", borderCls: "border-f0", bgCls: "bg-gen-f0", title: "Nhánh Cố Thu (Gốc phả hệ)" };
    if (lvl === 1) return { level: 1, label: "F1 · Đời Con", badgeCls: "gen-f1", borderCls: "border-f1", bgCls: "bg-gen-f1", title: "Nhánh thế hệ con" };
    if (lvl === 2) return { level: 2, label: "F2 · Đời Cháu", badgeCls: "gen-f2", borderCls: "border-f2", bgCls: "bg-gen-f2", title: "Nhánh thế hệ cháu" };
    if (lvl === 3) return { level: 3, label: "F3 · Đời Chắt", badgeCls: "gen-f3", borderCls: "border-f3", bgCls: "bg-gen-f3", title: "Nhánh thế hệ chắt" };
    if (lvl === 4) return { level: 4, label: "F4 · Đời Chút", badgeCls: "gen-f4", borderCls: "border-f4", bgCls: "bg-gen-f4", title: "Nhánh thế hệ chút" };
    return { level: lvl, label: `F${lvl} · Hậu duệ`, badgeCls: "gen-f4", borderCls: "border-f4", bgCls: "bg-gen-f4", title: `Nhánh thế hệ thứ ${lvl}` };
}

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

// --- ROUTING & VIEW NAVIGATION ---
function handleHashRoute() {
    let raw = window.location.hash || "#/";
    raw = raw.replace(/^#+/, '');
    if (!raw.startsWith('/')) raw = '/' + raw;
    const route = raw.split('#')[0] || "/";

    // Close any floating popup modals on route transition
    closeModalDirect('calendarSubscribeModal');
    closeModalDirect('eventModal');

    if (route.startsWith("/person/")) {
        const pid = route.replace("/person/", "");
        openPersonProfile(pid);
    } else if (route.startsWith("/family/")) {
        const fid = route.replace("/family/", "");
        openFamilyProfile(fid);
    } else if (route.startsWith("/mach/bai-viet/")) {
        const slug = route.replace("/mach/bai-viet/", "");
        openStoryDetail(slug);
    } else if (route.startsWith("/mach/series/")) {
        const slug = route.replace("/mach/series/", "");
        openSeriesDetail(slug);
    } else if (route.startsWith("/mach/tac-gia/")) {
        const aid = route.replace("/mach/tac-gia/", "");
        openAuthorDetail(aid);
    } else {
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

    if (route === "/tree" || route === "/gia-pha" || route === "/gia-pha/cay") {
        secId = "view_tree";
        navId = "nav_tree";
        renderTreeModule();
    } else if (route === "/people" || route === "/gia-pha/nguoi") {
        secId = "view_people";
        navId = "nav_people";
    } else if (route === "/families" || route === "/gia-pha/gia-dinh") {
        secId = "view_families";
        navId = "nav_families";
    } else if (route === "/calendar" || route === "/lich") {
        secId = "view_calendar";
        navId = "nav_calendar";
        renderCalendarModule();
    } else if (route === "/mach" || route === "/mach/bai-viet" || route === "/mach/series" || route === "/mach/tac-gia") {
        secId = "view_mach";
        navId = "nav_mach";
        renderMachModule();
    } else if (route === "/timeline") {
        secId = "view_timeline";
        navId = "nav_timeline";
    } else if (route === "/memories") {
        secId = "view_mach";
        navId = "nav_mach";
        renderMachModule();
    } else if (route === "/typography-specimen" || route === "/typography") {
        secId = "view_typography_specimen";
        navId = "";
    }

    const sec = document.getElementById(secId);
    if (sec) sec.classList.add("active");
    const nav = document.getElementById(navId);
    if (nav) nav.classList.add("active");
    window.scrollTo(0, 0);
}

// --- CALENDAR MODULE (GOOGLE CALENDAR UX) ---
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
                    <div class="agenda-ev-meta">Loại: <strong>${ev.label}</strong> • Nhấp để xem hồ sơ gia phả & ký ức</div>
                </div>
            `;
        });

        dayGroup.innerHTML = `
            <div class="agenda-date-head">
                <span>Ngày ${d < 10 ? '0' + d : d}/${(m + 1) < 10 ? '0' + (m + 1) : (m + 1)}/${y}</span>
                <span style="font-size:13px; font-weight:600; color:var(--lunar-color);">🌙 ${lunar.fullText}</span>
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
                <div style="font-weight:700; font-size:15px;">${ev.icon} ${escapeHtml(ev.summary)}</div>
                <div style="font-size:13px; color:var(--text-muted); margin-top:4px;">Loại: <strong>${ev.label}</strong> • Xem chi tiết hồ sơ →</div>
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
            <div style="color:var(--lunar-color); margin-top:3px;">🌙 <strong>Âm lịch:</strong> ${lunar.fullText}</div>
        `;
    }

    let personMatch = null;
    if (ev.fsid) {
        personMatch = Object.values(appData.people).find(p => p.fsid === ev.fsid);
    }
    if (personMatch && linkBox) {
        linkBox.style.display = "block";
        linkBox.innerHTML = `
            <div style="padding:10px 14px; background:var(--primary-light); border-radius:8px; border:1px solid #bfdbfe; font-size:13.5px;">
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

// --- CALENDAR SUBSCRIPTION & ADD-TO-PHONE UTILITIES (CALENDAR_02) ---
let currentCalPlatform = 'apple'; // 'apple' | 'google' | 'other'

function getAbsoluteFeedUrl(file) {
    if (typeof window !== "undefined" && window.location && window.location.origin && window.location.origin.startsWith("http")) {
        const base = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '/');
        return new URL(file, base).href;
    }
    return `https://gionghotrantrongthu.vercel.app/${file}`;
}

function getWebcalUrl(file) {
    const httpUrl = getAbsoluteFeedUrl(file);
    return httpUrl.replace(/^https?:\/\//i, 'webcal://');
}

function selectCalendarPlatform(platform) {
    currentCalPlatform = platform;
    document.querySelectorAll('.cal-plat-btn').forEach(b => b.classList.remove('active'));
    const activeBtn = document.getElementById(`tab_plat_${platform}`);
    if (activeBtn) activeBtn.classList.add('active');
    renderCalendarPlatformContent();
}

function renderCalendarPlatformContent() {
    const banner = document.getElementById('platBanner');
    const feedList = document.getElementById('calendarFeedList');
    if (!banner || !feedList) return;

    const feedMeta = {
        birthdays: { desc: "Sinh nhật dương lịch của mọi thành viên trong gia tộc họ Trần Trọng Thu" },
        patrons: { desc: "Lễ Quan thầy / Thánh bổn mạng của các thành viên Công giáo trong gia đình" },
        memorials: { desc: "Lễ giỗ phụ mẫu, ông bà, tổ tiên & các bậc tiền nhân (tính theo Âm lịch & Dương lịch)" },
        milestones: { desc: "Kỷ niệm thành lập, các sự kiện họp mặt và ngày kỷ niệm chung của dòng họ" }
    };

    if (currentCalPlatform === 'apple') {
        banner.className = 'subscribe-plat-banner apple-theme';
        banner.innerHTML = `<strong>🍎 Dành cho iPhone, iPad và máy Mac:</strong><br>Bấm nút <strong>"🍎 Thêm vào Apple Calendar"</strong> để ứng dụng Lịch trên máy tự động mở và đăng ký đồng bộ.`;
    } else if (currentCalPlatform === 'google') {
        banner.className = 'subscribe-plat-banner google-theme';
        banner.innerHTML = `<strong>🌐 Dành cho Google Calendar (Android & Máy tính):</strong><br>
        <em>(Lưu ý: Ứng dụng Google Calendar trên điện thoại không hỗ trợ thêm lịch qua URL trực tiếp. Bạn chỉ cần thêm 1 lần trên web <a href="https://calendar.google.com" target="_blank" rel="noopener" style="color:#1d4ed8; text-decoration:underline; font-weight:700;">calendar.google.com</a>, lịch sẽ tự động đồng bộ về điện thoại)</em>.<br>
        <strong>Cách làm:</strong> Bấm <strong>"📋 Sao chép URL"</strong> > Mở Google Calendar Web > Cột trái mục <em>"Lịch khác" (+) > Chọn "Từ URL"</em> > Dán địa chỉ.`;
    } else {
        banner.className = 'subscribe-plat-banner other-theme';
        banner.innerHTML = `<strong>💻 Microsoft Outlook & Ứng dụng khác:</strong><br>Bấm <strong>"📋 Sao chép URL"</strong> > Trong phần mềm Lịch chọn <em>Add Calendar > Subscribe from web</em> và dán địa chỉ.`;
    }

    feedList.innerHTML = CAL_FEEDS.map(f => {
        const absUrl = getAbsoluteFeedUrl(f.file);
        const webcalUrl = getWebcalUrl(f.file);
        const countEl = document.getElementById(f.countEl);
        const countText = countEl ? `${countEl.innerText} sự kiện` : "";
        const meta = feedMeta[f.key] || { desc: "" };

        let actionsHtml = "";
        if (currentCalPlatform === 'apple') {
            actionsHtml = `
                <a class="btn-plat-primary" href="${escapeHtml(webcalUrl)}" title="Mở Apple Calendar">
                    🍎 Thêm vào Apple Calendar
                </a>
                <button class="btn-plat-secondary" id="btn_copy_${f.key}" onclick="copyCalendarFeedUrl('${f.key}', '${escapeHtml(absUrl)}', this)">
                    📋 Sao chép URL
                </button>
            `;
        } else if (currentCalPlatform === 'google') {
            actionsHtml = `
                <button class="btn-plat-primary google" id="btn_copy_${f.key}" onclick="copyCalendarFeedUrl('${f.key}', '${escapeHtml(absUrl)}', this)">
                    📋 Sao chép URL lịch
                </button>
                <a class="btn-plat-secondary" href="https://calendar.google.com" target="_blank" rel="noopener">
                    🌐 Mở Google Calendar Web ↗
                </a>
            `;
        } else {
            actionsHtml = `
                <button class="btn-plat-primary" id="btn_copy_${f.key}" onclick="copyCalendarFeedUrl('${f.key}', '${escapeHtml(absUrl)}', this)">
                    📋 Sao chép URL lịch
                </button>
            `;
        }

        return `
            <div class="subscribe-feed-card">
                <div class="subscribe-feed-header">
                    <div class="subscribe-feed-title">${f.icon} Lịch ${f.label}</div>
                    ${countText ? `<span class="subscribe-feed-count">${escapeHtml(countText)}</span>` : ''}
                </div>
                <div class="subscribe-feed-desc">${escapeHtml(meta.desc)}</div>
                <div class="subscribe-actions-row">
                    ${actionsHtml}
                </div>
            </div>
        `;
    }).join('');
}

function openCalendarSubscribeModal() {
    // Auto-detect device
    if (typeof navigator !== "undefined" && /iPhone|iPad|Macintosh/i.test(navigator.userAgent)) {
        currentCalPlatform = 'apple';
    } else if (typeof navigator !== "undefined" && /Android/i.test(navigator.userAgent)) {
        currentCalPlatform = 'google';
    }
    selectCalendarPlatform(currentCalPlatform);
    const modal = document.getElementById("calendarSubscribeModal");
    if (modal) modal.classList.add("active");
}

function copyCalendarFeedUrl(feedKey, url, btnEl) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(() => {
            if (btnEl) {
                const originalHtml = btnEl.innerHTML;
                btnEl.classList.add("copied");
                btnEl.innerHTML = "✅ Đã sao chép!";
                setTimeout(() => {
                    btnEl.classList.remove("copied");
                    btnEl.innerHTML = originalHtml;
                }, 2000);
            }
        }).catch(err => {
            console.error("Clipboard copy error:", err);
            fallbackCopy(url, btnEl);
        });
    } else {
        fallbackCopy(url, btnEl);
    }
}

function fallbackCopy(text, btnEl) {
    const tempInput = document.createElement("textarea");
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
        document.execCommand('copy');
        if (btnEl) {
            const originalHtml = btnEl.innerHTML;
            btnEl.classList.add("copied");
            btnEl.innerHTML = "✅ Đã sao chép!";
            setTimeout(() => {
                btnEl.classList.remove("copied");
                btnEl.innerHTML = originalHtml;
            }, 2000);
        }
    } catch (e) {
        console.warn("execCommand fallback failed", e);
    }
    document.body.removeChild(tempInput);
}

// --- TREE MODULE (ARCH_03D: REAL VISUAL FAMILY GRAPH) ---
let graphScale = 1.0;
let graphHistory = [];

function initTreeDropdown(defaultRootId) {
    const select = document.getElementById("treeCenterSelect");
    if (!select) return;
    select.innerHTML = "";
    Object.values(appData.people).forEach(p => {
        const opt = document.createElement("option");
        opt.value = p.id;
        const gMeta = getGenerationMeta(p.id);
        opt.innerText = `[${gMeta.label}] ${p.name} (${p.fsid || p.id})`;
        if (p.id === defaultRootId) opt.selected = true;
        select.appendChild(opt);
    });
}

function switchTreeViewMode(mode) {
    treeViewMode = mode;
    const btnExplore = document.getElementById("btn_tree_explore");
    const btnFocus = document.getElementById("btn_tree_focus");
    const focusBar = document.getElementById("treeFocusSelectorBar");
    const pathBar = document.getElementById("treeRelationPath");

    if (btnExplore) btnExplore.classList.toggle("active", mode === 'explore');
    if (btnFocus) btnFocus.classList.toggle("active", mode === 'focus');
    if (focusBar) focusBar.style.display = mode === 'focus' ? 'flex' : 'none';
    if (pathBar) pathBar.style.display = mode === 'focus' ? 'flex' : 'none';

    renderTreeModule();
}

function renderTreeModule() {
    if (treeViewMode === 'explore') {
        renderGenerationBandsExplore();
    } else {
        renderFocusPedigreeTree(currentTreeFocusId || appData.rootAnchor || Object.keys(appData.people)[0]);
    }
}

function focusGraphPerson(pid) {
    if (!pid || !appData.people[pid]) return;
    if (currentTreeFocusId && currentTreeFocusId !== pid) {
        graphHistory.push(currentTreeFocusId);
    }
    const btnBack = document.getElementById("btn_graph_back");
    if (btnBack) {
        btnBack.style.opacity = graphHistory.length > 0 ? "1" : "0.5";
        btnBack.style.pointerEvents = graphHistory.length > 0 ? "auto" : "none";
    }
    currentTreeFocusId = pid;
    if (treeViewMode !== 'focus') {
        switchTreeViewMode('focus');
    } else {
        renderFocusPedigreeTree(pid);
    }
}

function graphGoBack() {
    if (graphHistory.length === 0) return;
    const prevId = graphHistory.pop();
    const btnBack = document.getElementById("btn_graph_back");
    if (btnBack) {
        btnBack.style.opacity = graphHistory.length > 0 ? "1" : "0.5";
        btnBack.style.pointerEvents = graphHistory.length > 0 ? "auto" : "none";
    }
    currentTreeFocusId = prevId;
    renderFocusPedigreeTree(prevId);
}

function graphGoHome() {
    focusGraphPerson(appData.rootAnchor || Object.keys(appData.people)[0]);
}

function zoomGraph(delta) {
    graphScale = Math.min(1.4, Math.max(0.65, Math.round((graphScale + delta) * 10) / 10));
    const viewport = document.getElementById("graphCanvasViewport");
    if (viewport) {
        viewport.style.transform = `scale(${graphScale})`;
    }
}

function resetGraphZoom() {
    graphScale = 1.0;
    const viewport = document.getElementById("graphCanvasViewport");
    if (viewport) {
        viewport.style.transform = "scale(1.0)";
    }
}

// Compact Interactive Graph Node
function renderGraphNode(p, role = 'child', isFocus = false) {
    if (!p) return "";
    const gMeta = getGenerationMeta(p.id);
    const bDate = p.birth && p.birth.date ? p.birth.date : "Chưa rõ";
    const dDate = p.death && p.death.date ? p.death.date : "";
    const lifeStr = dDate ? `${bDate} – ${dDate}` : (bDate !== "Chưa rõ" ? `s. ${bDate}` : "Chưa có năm sinh");

    return `
        <div class="graph-node ${gMeta.borderCls} ${isFocus ? 'node-focus' : ''}" onclick="focusGraphPerson('${p.id}')">
            <div class="node-header">
                <span class="gen-badge ${gMeta.badgeCls}">${gMeta.label.split('·')[0].trim()}</span>
                ${isFocus ? '<span class="focus-indicator">● ĐANG XEM</span>' : ''}
                <span class="node-fsid">${p.fsid || p.id}</span>
            </div>
            <div class="node-name" title="${p.name}">${p.sex === 'M' ? '👨' : '👩'} ${p.name}</div>
            <div class="node-meta">📅 ${lifeStr}</div>
            <div class="node-actions" onclick="event.stopPropagation();">
                <span style="font-size:10.5px; color:var(--text-muted);">${gMeta.label.split('·')[1] ? gMeta.label.split('·')[1].trim() : 'Thành viên'}</span>
                <a onclick="openPersonProfile('${p.id}')" title="Xem hồ sơ chi tiết">Hồ sơ ↗</a>
            </div>
        </div>
    `;
}

// 1. FOCUS MODE: Real Visual Family Graph (Parents -> Focus & Spouse Union -> Branching Children)
function renderFocusPedigreeTree(centerId) {
    currentTreeFocusId = centerId;
    const container = document.getElementById("treeGraphViewport");
    const pathContainer = document.getElementById("treeRelationPath");
    if (!container) return;
    container.innerHTML = "";

    const person = appData.people[centerId];
    if (!person) return;

    const select = document.getElementById("treeCenterSelect");
    if (select && select.value !== centerId) select.value = centerId;

    // Render Lineage Breadcrumbs Path from Root Anchor
    if (pathContainer) {
        pathContainer.style.display = "flex";
        const pathIds = derivedPaths[centerId] || [centerId];
        let pathHtml = `<span style="font-weight:700; color:var(--text-muted);"><span style="color:var(--accent);">🧭</span> Tuyến phả hệ trực hệ:</span> `;
        pathHtml += pathIds.map((pid, idx) => {
            const p = appData.people[pid];
            const isLast = idx === pathIds.length - 1;
            const gMeta = getGenerationMeta(pid);
            return `<a onclick="focusGraphPerson('${pid}')" class="path-step" style="${isLast ? 'color:var(--accent); font-weight:800;' : ''}">${p ? p.name : pid} (${gMeta.label.split('·')[0].trim()})</a>`;
        }).join(` <span class="path-arrow">→</span> `);
        pathContainer.innerHTML = pathHtml;
    }

    // 1. Tier 1: Parents (Tiền bối)
    let parentsHtml = "";
    if (person.parents.length >= 2) {
        const par1 = appData.people[person.parents[0]];
        const par2 = appData.people[person.parents[1]];
        parentsHtml = `
            <div class="graph-tier-row">
                <div class="graph-nodes-cluster">
                    ${renderGraphNode(par1, 'parent')}
                    <div class="union-hub">💑 Phụ Mẫu</div>
                    ${renderGraphNode(par2, 'parent')}
                </div>
            </div>
            <div class="vertical-stem-line"></div>
        `;
    } else if (person.parents.length === 1) {
        const par = appData.people[person.parents[0]];
        parentsHtml = `
            <div class="graph-tier-row">
                <div class="graph-nodes-cluster">
                    ${renderGraphNode(par, 'parent')}
                </div>
            </div>
            <div class="vertical-stem-line"></div>
        `;
    } else {
        parentsHtml = `
            <div class="tier-badge-label" style="background:#eff6ff; color:#1e3a8a; border-color:#bfdbfe;">🌲 Mốc Khởi Thủy Gia Tộc (Anchor)</div>
            <div class="vertical-stem-line"></div>
        `;
    }

    // 2. Tier 2: Focus Person & Spouse Union (Trọng tâm & Hôn phối)
    let focusHtml = "";
    if (person.spouses.length > 0) {
        const spousesNodes = person.spouses.map(sid => renderGraphNode(appData.people[sid], 'spouse')).join(`<div class="union-hub" style="margin: 0 4px;">💍</div>`);
        focusHtml = `
            <div class="graph-tier-row">
                <div class="graph-nodes-cluster">
                    ${renderGraphNode(person, 'focus', true)}
                    <div class="union-hub">💍 Hôn phối</div>
                    ${spousesNodes}
                </div>
            </div>
        `;
    } else {
        focusHtml = `
            <div class="graph-tier-row">
                <div class="graph-nodes-cluster">
                    ${renderGraphNode(person, 'focus', true)}
                </div>
            </div>
        `;
    }

    // 3. Tier 3: Children (Hậu duệ trực hệ)
    let childrenHtml = "";
    if (person.children.length > 0) {
        const childrenColumns = person.children.map(cid => {
            const ch = appData.people[cid];
            if (!ch) return "";
            const grandCount = ch.children ? ch.children.length : 0;
            return `
                <div class="child-column">
                    <div class="child-drop-line"></div>
                    ${renderGraphNode(ch, 'child')}
                    ${grandCount > 0 ? `<div class="grand-badge" onclick="event.stopPropagation(); focusGraphPerson('${ch.id}')" title="Nhấn để xem nhánh con cháu">👶 ${grandCount} người con ↓</div>` : ''}
                </div>
            `;
        }).join("");

        childrenHtml = `
            <div class="vertical-stem-line"></div>
            <div class="children-tree-wrapper">
                <div class="children-nodes-row">
                    ${childrenColumns}
                </div>
            </div>
        `;
    } else {
        childrenHtml = `
            <div class="vertical-stem-line"></div>
            <div style="font-size:12px; color:var(--text-muted); background:#ffffff; border:1px dashed var(--border); padding:5px 14px; border-radius:12px; margin-top:2px;">
                (Chưa ghi nhận hậu duệ trực hệ)
            </div>
        `;
    }

    // Construct the Continuous Canvas
    container.innerHTML = `
        <div class="family-graph-wrapper" id="familyGraphWrapper">
            <div class="graph-floating-toolbar">
                <button class="graph-tool-btn" onclick="zoomGraph(0.1)" title="Phóng to">+</button>
                <button class="graph-tool-btn" onclick="zoomGraph(-0.1)" title="Thu nhỏ">−</button>
                <button class="graph-tool-btn" onclick="resetGraphZoom()" title="Đặt lại kích thước">⟲ 100%</button>
                <button class="graph-tool-btn" onclick="graphGoHome()" title="Về mốc Cố Thu">⌂ Cố Thu</button>
            </div>

            <div class="graph-canvas-viewport" id="graphCanvasViewport" style="transform: scale(${graphScale});">
                ${parentsHtml}
                ${focusHtml}
                ${childrenHtml}
            </div>
        </div>
    `;
}

// 2. EXPLORE MODE: Grouped by Generation Bands (F0, F1, F2, F3, F4)
function renderGenerationBandsExplore() {
    const container = document.getElementById("treeGraphViewport");
    const pathContainer = document.getElementById("treeRelationPath");
    if (!container) return;
    container.innerHTML = "";
    if (pathContainer) pathContainer.style.display = "none";

    // Group people by generation level
    const genGroups = {};
    Object.values(appData.people).forEach(p => {
        const gMeta = getGenerationMeta(p.id);
        if (!genGroups[gMeta.level]) genGroups[gMeta.level] = { meta: gMeta, members: [] };
        genGroups[gMeta.level].members.push(p);
    });

    const sortedLevels = Object.keys(genGroups).map(Number).sort((a, b) => a - b);

    sortedLevels.forEach(lvl => {
        const group = genGroups[lvl];
        const bandEl = document.createElement("div");
        bandEl.className = "generation-band";

        let membersHtml = "";
        group.members.forEach(p => {
            membersHtml += renderUnifiedPersonCard(p);
        });

        bandEl.innerHTML = `
            <div class="band-header">
                <div class="band-title">
                    <span class="gen-badge ${group.meta.badgeCls}">${group.meta.label}</span>
                    <span>${group.meta.title}</span>
                </div>
                <div class="band-count">${group.members.length} thành viên</div>
            </div>
            <div class="directory-grid">${membersHtml}</div>
        `;
        container.appendChild(bandEl);
    });
}

// Unified Person Card Generator matching Family Directory Visual Grammar
function renderUnifiedPersonCard(p, isTreeNode = false, isCenter = false) {
    if (!p) return "";
    const gMeta = getGenerationMeta(p.id);
    const bDate = p.birth && p.birth.date ? p.birth.date : "Chưa rõ";
    const dDate = p.death && p.death.date ? p.death.date : "";
    const lifeStr = dDate ? `${bDate} – ${dDate}` : (bDate !== "Chưa rõ" ? `Sinh: ${bDate}` : "Chưa có năm sinh");

    return `
        <div class="person-card ${gMeta.borderCls}" ${isTreeNode ? `onclick="renderFocusPedigreeTree('${p.id}')"` : `onclick="openPersonProfile('${p.id}')"`} style="${isCenter ? 'border: 2px solid var(--primary); box-shadow: var(--shadow-md);' : ''}">
            <div>
                <div class="card-header-row">
                    <span class="gen-badge ${gMeta.badgeCls}">${gMeta.label}</span>
                    <span class="card-id-badge">${p.fsid || p.id}</span>
                </div>
                <div class="card-name-title">${p.name}</div>
                <div class="card-meta-primary">📅 ${lifeStr}</div>
                <div class="card-meta-secondary">Giới tính: <strong>${p.sex === 'M' ? 'Nam' : 'Nữ'}</strong> • Con cái: <strong>${p.children ? p.children.length : 0}</strong></div>
            </div>
            <div class="card-footer-row">
                <a class="card-accent-link" onclick="event.stopPropagation(); renderFocusPedigreeTree('${p.id}'); switchTreeViewMode('focus');">🌳 Tiêu điểm phả đồ</a>
                <a class="card-action-link" onclick="event.stopPropagation(); openPersonProfile('${p.id}');">Hồ sơ →</a>
            </div>
        </div>
    `;
}

// --- DIRECTORIES ---
function renderPeopleDirectory() {
    const grid = document.getElementById("peopleGrid");
    if (!grid) return;
    grid.innerHTML = "";
    Object.values(appData.people).forEach(p => {
        grid.innerHTML += renderUnifiedPersonCard(p, false);
    });
}

function filterFamiliesByGen(gen) {
    currentFamilyGenFilter = gen;
    renderFamiliesDirectory(gen);
}

function renderFamiliesDirectory(filterGen = currentFamilyGenFilter) {
    currentFamilyGenFilter = filterGen;
    const grid = document.getElementById("familiesGrid");
    if (!grid) return;
    grid.innerHTML = "";

    const allFams = Object.values(appData.families);
    const countMap = { all: allFams.length, 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 };
    allFams.forEach(f => {
        const lvl = derivedFamilyGenerations[f.id];
        if (lvl !== undefined && lvl !== null && countMap[lvl] !== undefined) {
            countMap[lvl]++;
        }
    });

    const cntAll = document.getElementById("cnt_fam_all");
    const cntF0 = document.getElementById("cnt_fam_f0");
    const cntF1 = document.getElementById("cnt_fam_f1");
    const cntF2 = document.getElementById("cnt_fam_f2");
    const cntF3 = document.getElementById("cnt_fam_f3");
    const cntF4 = document.getElementById("cnt_fam_f4");
    if (cntAll) cntAll.innerText = countMap.all;
    if (cntF0) cntF0.innerText = countMap[0];
    if (cntF1) cntF1.innerText = countMap[1];
    if (cntF2) cntF2.innerText = countMap[2];
    if (cntF3) cntF3.innerText = countMap[3];
    if (cntF4) cntF4.innerText = countMap[4];

    const pills = [
        { id: "filter_fam_all", val: 'all' },
        { id: "filter_fam_0", val: 0 },
        { id: "filter_fam_1", val: 1 },
        { id: "filter_fam_2", val: 2 },
        { id: "filter_fam_3", val: 3 },
        { id: "filter_fam_4", val: 4 }
    ];
    pills.forEach(p => {
        const el = document.getElementById(p.id);
        if (el) el.classList.toggle("active", filterGen === p.val);
    });

    let renderedCount = 0;
    allFams.forEach(f => {
        const fMeta = getFamilyGenerationMeta(f.id);
        if (filterGen !== 'all' && fMeta.level !== filterGen) return;

        renderedCount++;
        const card = document.createElement("div");
        card.className = `family-card ${fMeta.borderCls} ${fMeta.bgCls}`;
        card.onclick = () => openFamilyProfile(f.id);
        const husb = appData.people[f.husband], wife = appData.people[f.wife];
        card.innerHTML = `
            <div>
                <div class="card-header-row">
                    <span class="gen-badge ${fMeta.badgeCls}">${fMeta.label}</span>
                    <span class="card-id-badge">${f.id}</span>
                </div>
                <div class="card-name-title">Nhánh: ${husb ? husb.name : 'Chưa rõ'} & ${wife ? wife.name : 'Chưa rõ'}</div>
                <div class="card-meta-primary">Kết hôn: ${f.marriage && f.marriage.date ? f.marriage.date : 'Chưa có dữ kiện'}</div>
                <div class="card-meta-secondary">Con cái trực hệ: <strong>${f.children.length}</strong> người con</div>
            </div>
            <div class="card-footer-row">
                <span class="card-meta-secondary">${fMeta.title}</span>
                <span class="card-action-link">Xem chi tiết nhánh →</span>
            </div>
        `;
        grid.appendChild(card);
    });

    if (renderedCount === 0) {
        grid.innerHTML = `<div style="grid-column: 1/-1; padding: 32px; text-align: center; color: var(--text-muted); background: var(--surface); border: 1px dashed var(--border); border-radius: var(--radius-md);">Không có đơn vị gia đình nào thuộc thế hệ này.</div>`;
    }
}

// --- PROFILES ---
function openPersonProfile(pid) {
    const p = appData.people[pid];
    if (!p) return;
    window.location.hash = `#/person/${pid}`;
    document.querySelectorAll(".view-section").forEach(s => s.classList.remove("active"));
    const sec = document.getElementById("view_person");
    if (sec) sec.classList.add("active");

    const gMeta = getGenerationMeta(p.id);
    const pContainer = document.getElementById("personProfileContainer");
    const pName = document.getElementById("p_name");
    const pGender = document.getElementById("p_gender_status");
    const pFsid = document.getElementById("p_fsid");
    const pFacts = document.getElementById("p_facts");
    const pRels = document.getElementById("p_relatives");

    if (pContainer) pContainer.className = `profile-container ${gMeta.borderCls}`;
    if (pName) pName.innerText = p.name;
    if (pGender) pGender.innerHTML = `<span class="gen-badge ${gMeta.badgeCls}">${gMeta.label}</span> • ${p.sex === 'M' ? 'Nam' : 'Nữ'} • Tên gốc: ${p.raw_name}`;
    if (pFsid) pFsid.innerText = `FSID: ${p.fsid || p.id}`;

    let factsHtml = `<div>• <strong>Ngày sinh:</strong> ${p.birth && p.birth.date ? p.birth.date : 'Chưa có dữ kiện'} ${p.birth && p.birth.place ? `(${p.birth.place})` : ''}</div>`;
    factsHtml += `<div>• <strong>Ngày qua đời:</strong> ${p.death && p.death.date ? p.death.date : 'Chưa có dữ kiện'} ${p.death && p.death.place ? `(${p.death.place})` : ''}</div>`;
    if (p.baptism && p.baptism.date) factsHtml += `<div>• <strong>Bí tích Rửa Tội:</strong> ${p.baptism.date}</div>`;
    if (pFacts) pFacts.innerHTML = factsHtml;

    let relsHtml = "";
    if (p.parents.length > 0) {
        relsHtml += `<div style="font-weight:700; font-size:13px; color:var(--text-muted); margin-bottom:6px;">Thân Phụ / Thân Mẫu:</div>`;
        p.parents.forEach(parId => {
            const par = appData.people[parId];
            if (par) {
                const gPar = getGenerationMeta(par.id);
                relsHtml += `<a class="rel-link" onclick="openPersonProfile('${par.id}')"><span class="gen-badge ${gPar.badgeCls}" style="font-size:10px; padding:1px 6px; margin-right:4px;">${gPar.label.split('·')[0].trim()}</span> 👤 ${par.name} (${par.sex === 'M' ? 'Cha' : 'Mẹ'})</a>`;
            }
        });
    }
    if (p.spouses.length > 0) {
        relsHtml += `<div style="font-weight:700; font-size:13px; color:var(--text-muted); margin-top:10px; margin-bottom:6px;">Hôn Phối:</div>`;
        p.spouses.forEach(spId => {
            const sp = appData.people[spId];
            if (sp) {
                const gSp = getGenerationMeta(sp.id);
                relsHtml += `<a class="rel-link" onclick="openPersonProfile('${sp.id}')"><span class="gen-badge ${gSp.badgeCls}" style="font-size:10px; padding:1px 6px; margin-right:4px;">${gSp.label.split('·')[0].trim()}</span> 💍 ${sp.name}</a>`;
            }
        });
    }
    if (p.children.length > 0) {
        relsHtml += `<div style="font-weight:700; font-size:13px; color:var(--text-muted); margin-top:10px; margin-bottom:6px;">Con Cái (${p.children.length}):</div>`;
        p.children.forEach(chId => {
            const ch = appData.people[chId];
            if (ch) {
                const gCh = getGenerationMeta(ch.id);
                relsHtml += `<a class="rel-link" onclick="openPersonProfile('${ch.id}')"><span class="gen-badge ${gCh.badgeCls}" style="font-size:10px; padding:1px 6px; margin-right:4px;">${gCh.label.split('·')[0].trim()}</span> 👶 ${ch.name}</a>`;
            }
        });
    }
    relsHtml += `<div style="margin-top:16px;"><button class="cal-nav-btn today" onclick="currentTreeFocusId='${p.id}'; switchTreeViewMode('focus'); navigateRoute('/tree');">🌳 Xem cây phả đồ lấy người này làm trọng tâm →</button></div>`;
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

    const fMeta = getFamilyGenerationMeta(fid);
    const husb = appData.people[f.husband], wife = appData.people[f.wife];
    const fContainer = document.getElementById("familyProfileContainer");
    const fBadge = document.getElementById("f_gen_badge");
    const fTitle = document.getElementById("f_title");
    const fId = document.getElementById("f_id_label");
    const fMarr = document.getElementById("f_marr_meta");
    const fParents = document.getElementById("f_parents");
    const fChildren = document.getElementById("f_children");

    if (fContainer) fContainer.className = `profile-container ${fMeta.borderCls}`;
    if (fBadge) {
        fBadge.className = `gen-badge ${fMeta.badgeCls}`;
        fBadge.innerText = fMeta.label;
    }
    if (fTitle) fTitle.innerText = `Gia Đình: ${husb ? husb.name : 'Chưa rõ'} & ${wife ? wife.name : 'Chưa rõ'}`;
    if (fId) fId.innerText = `FAM ID: ${f.id}`;
    if (fMarr) fMarr.innerText = f.marriage && f.marriage.date ? `Kết hôn: ${f.marriage.date}` : "Chưa có thông tin hôn phối chính thức";

    let pHtml = "";
    if (husb) {
        const gH = getGenerationMeta(husb.id);
        pHtml += `<a class="rel-link" onclick="openPersonProfile('${husb.id}')"><span class="gen-badge ${gH.badgeCls}" style="font-size:10px; padding:1px 6px; margin-right:4px;">${gH.label.split('·')[0].trim()}</span> 👨 Người chồng: ${husb.name}</a>`;
    }
    if (wife) {
        const gW = getGenerationMeta(wife.id);
        pHtml += `<a class="rel-link" onclick="openPersonProfile('${wife.id}')"><span class="gen-badge ${gW.badgeCls}" style="font-size:10px; padding:1px 6px; margin-right:4px;">${gW.label.split('·')[0].trim()}</span> 👩 Người vợ: ${wife.name}</a>`;
    }
    if (fParents) fParents.innerHTML = pHtml;

    let cHtml = "";
    if (f.children.length > 0) {
        f.children.forEach(cid => {
            const c = appData.people[cid];
            if (c) {
                const gC = getGenerationMeta(c.id);
                cHtml += `<a class="rel-link" onclick="openPersonProfile('${c.id}')"><span class="gen-badge ${gC.badgeCls}" style="font-size:10px; padding:1px 6px; margin-right:4px;">${gC.label.split('·')[0].trim()}</span> 👶 ${c.name}</a>`;
            }
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
            <div style="font-size:15px; font-weight:700;"><a onclick="openPersonProfile('${ev.personId}')" style="color:var(--primary); cursor:pointer;">${ev.title}</a></div>
            <div style="font-size:13px; color:var(--text-muted);">Ngày ghi nhận: ${ev.date}</div>
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
            <div style="font-size:13.5px; font-weight:600; color:var(--text-muted); margin-bottom:12px;">Nhân vật liên quan: <a onclick="openPersonProfile('${mem.personId}')" style="color:var(--primary); cursor:pointer;">${mem.personName}</a></div>
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
            const gMeta = getGenerationMeta(p.id);
            results.push({ type: 'PERSON', id: p.id, title: p.name, sub: `${gMeta.label} • FSID: ${p.fsid || p.id}` });
        }
    });
    appData.memories.forEach(m => {
        if (m.title.toLowerCase().includes(q) || m.story.toLowerCase().includes(q)) {
            results.push({ type: 'MEMORY', id: m.id, title: m.title, sub: `Ký ức gia tộc • ${m.personName}` });
        }
    });

    if (results.length === 0) {
        dd.innerHTML = `<div style="padding:12px; color:var(--text-muted); text-align:center;">Không tìm thấy kết quả</div>`;
    } else {
        dd.innerHTML = results.slice(0, 10).map(r => `
            <div class="search-row" onclick="selectGlobalSearchResult('${r.type}', '${r.id}')">
                <div style="font-weight:700; color:var(--primary-dark);">${r.title}</div>
                <div style="font-size:12px; color:var(--text-muted);">${r.sub}</div>
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

// =======================================================
// MẠCH EDITORIAL & NARRATIVE MODULE CONTROLLER (MACH_01)
// =======================================================

function filterMachTab(tab) {
    currentMachTab = tab;
    document.querySelectorAll(".mach-nav-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".mach-tab-panel").forEach(p => p.classList.remove("active"));

    const btn = document.getElementById(`btn_mach_${tab}`);
    if (btn) btn.classList.add("active");

    if (tab === "all") {
        const p = document.getElementById("machTabContentAll");
        if (p) p.classList.add("active");
    } else if (tab === "series") {
        const p = document.getElementById("machTabContentSeries");
        if (p) p.classList.add("active");
    } else if (tab === "authors") {
        const p = document.getElementById("machTabContentAuthors");
        if (p) p.classList.add("active");
    }
}

function renderMachModule() {
    if (!machData || !machData.stories) return;

    // 1. Render Featured Series Spotlights (Tập san MẠCH + Thư gửi Clara)
    const featContainer = document.getElementById("machFeaturedContainer");
    if (featContainer && machData.series) {
        const issue01 = machData.series["issue-01"];
        const clara = machData.series["thu-gui-clara"];
        
        let featHtml = `<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:16px; margin-bottom:24px;">`;

        if (issue01) {
            const auth = (machData.authors && machData.authors[issue01.authorId]) ? machData.authors[issue01.authorId] : { name: "Người giữ mạch" };
            featHtml += `
                <div class="series-card" style="border-left: 5px solid var(--lacquer-red); cursor:pointer;" onclick="navigateRoute('/mach/series/${issue01.slug}')">
                    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
                        <span class="series-card-badge">📖 TẬP SAN LƯU TRỮ • 12 BÀI</span>
                        <span style="font-size:12px; color:var(--text-muted);">Số 01/2026</span>
                    </div>
                    <h3 class="series-card-title" style="margin-top: 8px; font-size:1.15rem;">${issue01.title}</h3>
                    <p class="series-card-desc" style="font-size:13.5px;">${issue01.description}</p>
                    <div class="series-card-meta">
                        <span>✍️ ${auth.name}</span>
                        <span style="color:var(--lacquer-red); font-weight:700;">Xem toàn bộ tập san →</span>
                    </div>
                </div>
            `;
        }

        if (clara) {
            const auth = (machData.authors && machData.authors[clara.authorId]) ? machData.authors[clara.authorId] : { name: "Tuấn" };
            featHtml += `
                <div class="series-card" style="border-left: 5px solid #d97706; cursor:pointer;" onclick="navigateRoute('/mach/series/${clara.slug}')">
                    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
                        <span class="series-card-badge" style="background:#fef3c7; color:#92400e; border-color:#fde68a;">✉️ CHUỖI THƯ TỪ • 7 LÁ THƯ</span>
                        <span style="font-size:12px; color:var(--text-muted);">2026</span>
                    </div>
                    <h3 class="series-card-title" style="margin-top: 8px; font-size:1.15rem;">${clara.title}</h3>
                    <p class="series-card-desc" style="font-size:13.5px;">${clara.description}</p>
                    <div class="series-card-meta">
                        <span>✍️ ${auth.name}</span>
                        <span style="color:#d97706; font-weight:700;">Đọc các lá thư →</span>
                    </div>
                </div>
            `;
        }

        featHtml += `</div>`;
        featContainer.innerHTML = featHtml;
    }

    // 2. Render Stories Grid (All 19 stories with series tags)
    const storiesGrid = document.getElementById("machStoriesGrid");
    if (storiesGrid) {
        storiesGrid.innerHTML = machData.stories.map(s => {
            const ser = (machData.series && machData.series[s.seriesSlug]) ? machData.series[s.seriesSlug] : { title: "MẠCH" };
            const auth = (machData.authors && machData.authors[s.authorId]) ? machData.authors[s.authorId] : { name: "Ban Biên Tập" };
            const isClara = s.seriesSlug === "thu-gui-clara";
            const tagLabel = isClara ? `THƯ GỬI CLARA · SỐ ${String(s.seriesOrder).padStart(2, '0')}` : `${s.section ? s.section.toUpperCase() + ' · ' : ''}BÀI ${String(s.seriesOrder).padStart(2, '0')}`;
            const badgeStyle = isClara ? `background:#fef3c7; color:#92400e; border-color:#fde68a;` : ``;

            return `
                <div class="story-card" onclick="navigateRoute('/mach/bai-viet/${s.slug}')">
                    <div>
                        <div class="story-card-tag" style="${badgeStyle}">${tagLabel}</div>
                        <h3 class="story-card-title">${s.title}</h3>
                        <p class="story-card-excerpt">${s.excerpt}</p>
                    </div>
                    <div class="story-card-footer">
                        <span>✍️ ${auth.name}</span>
                        <span>${s.date}</span>
                    </div>
                </div>
            `;
        }).join("");
    }

    // 3. Render Series Grid
    const seriesGrid = document.getElementById("machSeriesGrid");
    if (seriesGrid && machData.series) {
        seriesGrid.innerHTML = Object.values(machData.series).map(ser => {
            const auth = (machData.authors && machData.authors[ser.authorId]) ? machData.authors[ser.authorId] : { name: "Ban Biên Tập" };
            const isClara = ser.slug === "thu-gui-clara";
            const badgeText = isClara ? `✉️ CHUỖI THƯ TỪ • ${ser.stories.length} LÁ THƯ` : `📖 TẬP SAN GIA TỘC • ${ser.stories.length} BÀI`;
            const badgeColor = isClara ? `background:#fef3c7; color:#92400e; border-color:#fde68a;` : ``;
            const borderAccent = isClara ? `border-left: 5px solid #d97706;` : `border-left: 5px solid var(--lacquer-red);`;

            return `
                <div class="series-card" style="${borderAccent} cursor:pointer;" onclick="navigateRoute('/mach/series/${ser.slug}')">
                    <span class="series-card-badge" style="${badgeColor}">${badgeText}</span>
                    <h3 class="series-card-title">${ser.title}</h3>
                    <div style="font-style:italic; font-size:13.5px; color:var(--text-muted); margin-bottom:10px;">${ser.subtitle || ''}</div>
                    <p class="series-card-desc">${ser.description}</p>
                    <div class="series-card-meta">
                        <span>Tác giả / Chủ biên: <strong>${auth.name}</strong></span>
                        <span style="color:var(--lacquer-red); font-weight:700;">Xem toàn bộ →</span>
                    </div>
                </div>
            `;
        }).join("");
    }

    // 4. Render Authors Grid
    const authorsGrid = document.getElementById("machAuthorsGrid");
    if (authorsGrid && machData.authors) {
        authorsGrid.innerHTML = Object.values(machData.authors).map(a => {
            const authorStoriesCount = machData.stories.filter(s => s.authorId === a.id).length;
            return `
                <div class="author-card" onclick="navigateRoute('/mach/tac-gia/${a.id}')">
                    <div class="author-card-header">
                        <div class="author-avatar">${a.avatar || '✍️'}</div>
                        <div>
                            <div class="author-name">${a.name}</div>
                            <div class="author-role">${a.role}</div>
                        </div>
                    </div>
                    <p class="author-bio">${a.bio}</p>
                    <div style="margin-top:14px; font-size:12.5px; color:var(--lacquer-red); font-weight:700;">
                        ${authorStoriesCount} tác phẩm / bài viết →
                    </div>
                </div>
            `;
        }).join("");
    }
}

function openStoryDetail(slug) {
    if (!machData || !machData.stories) return;
    const story = machData.stories.find(s => s.slug === slug);
    if (!story) return;

    document.querySelectorAll(".view-section").forEach(s => s.classList.remove("active"));
    document.querySelectorAll(".nav-item-btn").forEach(b => b.classList.remove("active"));
    const storySec = document.getElementById("view_story");
    if (storySec) storySec.classList.add("active");
    const machNav = document.getElementById("nav_mach");
    if (machNav) machNav.classList.add("active");

    const ser = machData.series ? machData.series[story.seriesSlug] : null;
    const auth = (machData.authors && machData.authors[story.authorId]) ? machData.authors[story.authorId] : { name: "Ban Biên Tập", role: "", bio: "", avatar: "✍️" };
    const isClara = story.seriesSlug === "thu-gui-clara";

    // Set Breadcrumb
    const bc = document.getElementById("storySeriesBreadcrumb");
    if (bc) {
        if (ser) {
            bc.innerHTML = `<a onclick="navigateRoute('/mach/series/${ser.slug}')" style="cursor:pointer; text-decoration:underline;">Series: ${ser.title}</a>`;
        } else {
            bc.innerHTML = "";
        }
    }

    // Header
    const tagOrder = document.getElementById("storyTagOrder");
    if (tagOrder) {
        if (isClara) {
            tagOrder.innerText = `THƯ GỬI CLARA • LÁ THƯ SỐ ${String(story.seriesOrder).padStart(2, '0')}`;
        } else {
            tagOrder.innerText = ser ? `${ser.title} • ${story.section ? story.section.toUpperCase() + ' · ' : ''}BÀI ${String(story.seriesOrder).padStart(2, '0')}` : (story.section ? story.section.toUpperCase() : "MẠCH");
        }
    }
    const stTitle = document.getElementById("storyTitle");
    if (stTitle) stTitle.innerText = story.title;
    const authMeta = document.getElementById("storyAuthorMeta");
    if (authMeta) authMeta.innerHTML = `✍️ <a onclick="navigateRoute('/mach/tac-gia/${auth.id}')" style="color:inherit; cursor:pointer; text-decoration:underline;">${auth.name}</a>`;
    const dateMeta = document.getElementById("storyDateMeta");
    if (dateMeta) dateMeta.innerText = story.date || "2026";

    // Mentions
    const mentionsBar = document.getElementById("storyMentionsBar");
    if (mentionsBar) {
        if (story.mentions && story.mentions.length > 0) {
            mentionsBar.style.display = "flex";
            mentionsBar.innerHTML = `<span style="font-weight:700; color:var(--text-muted); margin-right:6px;">🌿 Nhân vật liên quan:</span>` +
                story.mentions.map(m => `<span class="mention-chip" onclick="openPersonProfile('${m.id}')">${m.name}</span>`).join(" ");
        } else {
            mentionsBar.style.display = "none";
        }
    }

    // Body rendering
    const contentBody = document.getElementById("storyContentBody");
    if (contentBody) {
        let text = story.contentMarkdown || "";
        // Strip YAML frontmatter
        text = text.replace(/^---[\s\S]*?---\s*/, '').trim();
        // If the top line starts with # and matches title/heading, strip it to prevent duplicate main header
        text = text.replace(/^#\s+[^\n]+\n+/, '').trim();
        
        // Format figures
        text = text.replace(/!\[(.*?)\]\((.*?)\)(?:\s*\n\s*[\*_](.*?)[\*_])?/g, (m, alt, src, cap) => {
            const caption = cap ? cap.trim().replace(/^[\*_]+|[\*_]+$/g, "") : alt;
            return `<figure><img src="${src}" alt="${alt}"><figcaption>${caption}</figcaption></figure>`;
        });

        // Convert double newline to paragraphs
        const paragraphs = text.split(/\n\s*\n/).map(p => {
            p = p.trim();
            if (!p) return "";
            if (p.startsWith("<figure")) return p;
            if (p.startsWith("# ")) return `<h2 style="text-align:center; margin-bottom:1.5em;">${p.replace("# ", "")}</h2>`;
            if (p.startsWith("## ")) return `<h2>${p.replace("## ", "")}</h2>`;
            if (p.startsWith("> ")) return `<blockquote>${p.replace(/^>\s*/gm, "")}</blockquote>`;
            // Clean inline soft line breaks while respecting markdown styling
            const cleanP = p.replace(/\n/g, " ");
            return `<p>${cleanP}</p>`;
        }).join("");

        contentBody.innerHTML = paragraphs;
    }

    // Author card footer
    const authorCard = document.getElementById("storyAuthorCard");
    if (authorCard) {
        authorCard.innerHTML = `
            <div class="author-card" style="cursor:default;">
                <div class="author-card-header">
                    <div class="author-avatar">${auth.avatar || '✍️'}</div>
                    <div>
                        <div class="author-name">${auth.name}</div>
                        <div class="author-role">${auth.role}</div>
                    </div>
                </div>
                <p class="author-bio">${auth.bio}</p>
            </div>
        `;
    }

    // Prev / Next Navigation in Series
    const prevNext = document.getElementById("storyNavPrevNext");
    if (prevNext && ser) {
        const curIdx = ser.stories.indexOf(story.slug);
        const prevSlug = curIdx > 0 ? ser.stories[curIdx - 1] : null;
        const nextSlug = curIdx < ser.stories.length - 1 ? ser.stories[curIdx + 1] : null;
        
        const prevStory = prevSlug ? machData.stories.find(s => s.slug === prevSlug) : null;
        const nextStory = nextSlug ? machData.stories.find(s => s.slug === nextSlug) : null;

        let navHtml = "";
        if (prevStory) {
            navHtml += `<button class="story-nav-btn" onclick="navigateRoute('/mach/bai-viet/${prevStory.slug}')">← ${isClara ? 'Thư trước' : 'Bài trước'}: ${prevStory.shortTitle || prevStory.title}</button>`;
        } else {
            navHtml += `<div></div>`;
        }
        if (nextStory) {
            navHtml += `<button class="story-nav-btn" onclick="navigateRoute('/mach/bai-viet/${nextStory.slug}')">${isClara ? 'Thư tiếp' : 'Bài tiếp'}: ${nextStory.shortTitle || nextStory.title} →</button>`;
        }
        prevNext.innerHTML = navHtml;
    }

    window.scrollTo(0, 0);
}

function openSeriesDetail(slug) {
    if (!machData || !machData.series) return;
    const ser = machData.series[slug];
    if (!ser) return;

    document.querySelectorAll(".view-section").forEach(s => s.classList.remove("active"));
    document.querySelectorAll(".nav-item-btn").forEach(b => b.classList.remove("active"));
    const sec = document.getElementById("view_series_detail");
    if (sec) sec.classList.add("active");
    const machNav = document.getElementById("nav_mach");
    if (machNav) machNav.classList.add("active");

    const auth = (machData.authors && machData.authors[ser.authorId]) ? machData.authors[ser.authorId] : { name: "Ban Biên Tập" };
    const isClara = ser.slug === "thu-gui-clara";
    const badgeText = isClara ? `✉️ CHUỖI THƯ TỪ GIA TỘC` : `📚 TẬP SAN LƯU TRỮ`;
    const headerCard = document.getElementById("seriesHeaderCard");
    if (headerCard) {
        headerCard.innerHTML = `
            <span class="series-card-badge">${badgeText}</span>
            <h1 class="story-title" style="margin-top:10px; margin-bottom:8px;">${ser.title}</h1>
            <div style="font-style:italic; font-size:16px; color:var(--imperial-gold); margin-bottom:16px;">${ser.subtitle || ''}</div>
            <p style="font-size:15px; color:var(--text-main); line-height:1.7;">${ser.description}</p>
            <div style="margin-top:18px; font-size:13.5px; color:var(--text-muted); border-top:1px solid var(--border-subtle); padding-top:12px;">
                Tác giả / Chủ biên: <strong>${auth.name}</strong> • Quy mô: <strong>${ser.stories.length} ${isClara ? 'lá thư' : 'bài viết'}</strong>
            </div>
        `;
    }

    const grid = document.getElementById("seriesStoriesGrid");
    if (grid) {
        const seriesStories = ser.stories.map(stSlug => machData.stories.find(s => s.slug === stSlug)).filter(Boolean);
        grid.innerHTML = seriesStories.map(s => {
            const tagLabel = isClara ? `THƯ GỬI CLARA · SỐ ${String(s.seriesOrder).padStart(2, '0')}` : `${s.section ? s.section.toUpperCase() + ' · ' : ''}BÀI ${String(s.seriesOrder).padStart(2, '0')}`;
            return `
                <div class="story-card" onclick="navigateRoute('/mach/bai-viet/${s.slug}')">
                    <div>
                        <div class="story-card-tag">${tagLabel}</div>
                        <h3 class="story-card-title">${s.title}</h3>
                        <p class="story-card-excerpt">${s.excerpt}</p>
                    </div>
                    <div class="story-card-footer">
                        <span>${s.date}</span>
                        <span style="color:var(--lacquer-red); font-weight:700;">Đọc thư / bài →</span>
                    </div>
                </div>
            `;
        }).join("");
    }
    window.scrollTo(0, 0);
}

function openAuthorDetail(authorId) {
    if (!machData || !machData.authors) return;
    const auth = machData.authors[authorId];
    if (!auth) return;

    document.querySelectorAll(".view-section").forEach(s => s.classList.remove("active"));
    document.querySelectorAll(".nav-item-btn").forEach(b => b.classList.remove("active"));
    const sec = document.getElementById("view_author_detail");
    if (sec) sec.classList.add("active");
    const machNav = document.getElementById("nav_mach");
    if (machNav) machNav.classList.add("active");

    const headerCard = document.getElementById("authorHeaderCard");
    if (headerCard) {
        headerCard.innerHTML = `
            <div class="author-card-header">
                <div class="author-avatar" style="width:64px; height:64px; font-size:36px;">${auth.avatar || '✍️'}</div>
                <div>
                    <h1 class="story-title" style="margin-bottom:4px;">${auth.name}</h1>
                    <div class="author-role" style="font-size:15px;">${auth.role}</div>
                </div>
            </div>
            <p class="author-bio" style="font-size:15px; margin-top:14px;">${auth.bio}</p>
        `;
    }

    const grid = document.getElementById("authorStoriesGrid");
    if (grid) {
        const authorStories = machData.stories.filter(s => s.authorId === authorId);
        grid.innerHTML = authorStories.map(s => {
            const ser = (machData.series && machData.series[s.seriesSlug]) ? machData.series[s.seriesSlug] : { title: "Tự sự" };
            return `
                <div class="story-card" onclick="navigateRoute('/mach/bai-viet/${s.slug}')">
                    <div>
                        <div class="story-card-tag">${ser.title}</div>
                        <h3 class="story-card-title">${s.title}</h3>
                        <p class="story-card-excerpt">${s.excerpt}</p>
                    </div>
                    <div class="story-card-footer">
                        <span>${s.date}</span>
                        <span style="color:var(--lacquer-red); font-weight:700;">Đọc bài →</span>
                    </div>
                </div>
            `;
        }).join("");
    }
    window.scrollTo(0, 0);
}

// Override Global Search to index both MẠCH series (Tập san Mạch & Thư gửi Clara)
handleGlobalSearch = function(e) {
    const q = e.target.value.toLowerCase().trim();
    const dd = document.getElementById("globalSearchDropdown");
    if (!dd) return;
    if (!q) { dd.style.display = "none"; return; }

    const results = [];
    Object.values(appData.people).forEach(p => {
        if (p.name.toLowerCase().includes(q) || (p.fsid && p.fsid.toLowerCase().includes(q))) {
            const gMeta = getGenerationMeta(p.id);
            results.push({ type: 'PERSON', id: p.id, title: p.name, sub: `${gMeta.label} • FSID: ${p.fsid || p.id}` });
        }
    });

    if (machData && machData.stories) {
        machData.stories.forEach(s => {
            if (s.title.toLowerCase().includes(q) || s.excerpt.toLowerCase().includes(q) || (s.subtitle && s.subtitle.toLowerCase().includes(q))) {
                const isClara = s.seriesSlug === "thu-gui-clara";
                const prefix = isClara ? "✉️ Thư gửi Clara" : "📖 Tập san MẠCH";
                results.push({ type: 'STORY', id: s.slug, title: s.title, sub: `${prefix} • ${s.date}` });
            }
        });
    }

    if (results.length === 0) {
        dd.innerHTML = `<div style="padding:12px; color:var(--text-muted); text-align:center;">Không tìm thấy kết quả</div>`;
    } else {
        dd.innerHTML = results.slice(0, 10).map(r => `
            <div class="search-row" onclick="selectGlobalSearchResult('${r.type}', '${r.id}')">
                <div style="font-weight:700; color:var(--primary-dark);">${r.title}</div>
                <div style="font-size:12px; color:var(--text-muted);">${r.sub}</div>
            </div>
        `).join("");
    }
    dd.style.display = "block";
};

selectGlobalSearchResult = function(type, id) {
    const dd = document.getElementById("globalSearchDropdown");
    const inp = document.getElementById("globalSearchInput");
    if (dd) dd.style.display = "none";
    if (inp) inp.value = "";
    if (type === 'PERSON') openPersonProfile(id);
    else if (type === 'STORY') navigateRoute(`/mach/bai-viet/${id}`);
    else if (type === 'MEMORY') navigateRoute('/mach');
};
