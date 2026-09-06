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

let mediaDb = {
    assets: {},        // assetId -> MediaAsset entity
    personMedia: [],   // array of PersonMedia relationship entities
    byPersonId: {}     // personId -> [PersonMedia] indexed cache
};

let calEvents = [];
let curCalDate = new Date();
let calViewMode = 'month'; // 'month' | 'agenda'
let calLayers = { birthdays: true, patrons: true, memorials: true, milestones: true };

const CAL_FEEDS = [
    { key: "birthdays", file: "calendars/CAL_01_BIRTHDAYS.ics", class: "birth", icon: "", label: "Sinh nhật", countEl: "cnt_birth" },
    { key: "patrons", file: "calendars/CAL_02_PATRON_FEASTS.ics", class: "patron", icon: "", label: "Bổn mạng", countEl: "cnt_patron" },
    { key: "memorials", file: "calendars/CAL_03_MEMORIALS.ics", class: "mem", icon: "", label: "Ngày giỗ", countEl: "cnt_mem" },
    { key: "milestones", file: "calendars/CAL_04_FAMILY_MILESTONES.ics", class: "event", icon: "", label: "Sự kiện", countEl: "cnt_event" }
];

// --- INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
    // 1. Fetch Media Management Layer (media.json & person_media.json) in parallel
    Promise.all([
        fetch("data/media.json").then(r => r.ok ? r.json() : {}).catch(() => ({})),
        fetch("data/person_media.json").then(r => r.ok ? r.json() : []).catch(() => ([]))
    ])
    .then(([mediaAssets, personMediaList]) => {
        mediaDb.assets = mediaAssets || {};
        mediaDb.personMedia = Array.isArray(personMediaList) ? personMediaList : [];
        mediaDb.byPersonId = {};
        
        // Build efficient index for N-to-N relationships
        mediaDb.personMedia.forEach(rel => {
            if (rel && rel.personId) {
                if (!mediaDb.byPersonId[rel.personId]) mediaDb.byPersonId[rel.personId] = [];
                mediaDb.byPersonId[rel.personId].push(rel);
            }
        });
    })
    .finally(() => {
        // 2. Fetch genealogy.json
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
                        renderHomePublicationLanding();
                        handleHashRoute();
                    })
                    .catch(err => {
                        console.warn("Could not load data/mach.json:", err);
                        renderHomePublicationLanding();
                        handleHashRoute();
                    });
            })
            .catch(err => {
                console.error("Error loading genealogy dataset:", err);
            });
    });
});

window.addEventListener("hashchange", handleHashRoute);

/**
 * MEDIA MANAGEMENT RESOLVER LAYER
 * Independent PersonMedia & MediaAsset querying engine.
 * Pure contract: Person ID -> Relationship -> MediaAsset -> File URL
 * Zero FSID-to-filename inference in presentation code.
 */
function getPersonMedia(personId, role = null) {
    if (!personId) return [];
    const relations = mediaDb.byPersonId[personId] || [];
    const results = [];

    relations.forEach(rel => {
        if (role && rel.role !== role) return;
        if (rel.status !== "MATCHED") return;
        const asset = mediaDb.assets[rel.assetId];
        if (asset && asset.file) {
            results.push({
                relation: rel,
                asset: asset,
                url: asset.file,
                isPrimary: !!rel.isPrimary,
                role: rel.role,
                source: asset.source,
                sourceId: asset.sourceId,
                sha256: asset.sha256,
                provenance: asset.provenance || {}
            });
        }
    });

    return results;
}

function getPersonPortrait(personId) {
    const portraits = getPersonMedia(personId, "PORTRAIT");
    if (portraits.length === 0) return null;
    // Prefer isPrimary if multiple portraits exist
    const primary = portraits.find(p => p.isPrimary) || portraits[0];
    return primary;
}

// Monochrome SVG avatar placeholders (presentation fallback only — no MediaAsset created).
// Same stroke language, currentColor; shape differs slightly by recorded sex, never by color.
const AVATAR_SVG = {
    male: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" width="100%" height="100%"><circle cx="12" cy="8" r="3.6"/><path d="M4.8 20c1.1-3.7 3.9-5.5 7.2-5.5s6.1 1.8 7.2 5.5"/></svg>',
    female: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" width="100%" height="100%"><circle cx="12" cy="8.2" r="3.4"/><path d="M7.4 6.4C6.6 8 6.4 10 6.8 12c.2 1.4.7 2.6 1.3 3.4C9.6 16.6 10.8 17 12 17s2.4-.4 3.9-1.6c.6-.8 1.1-2 1.3-3.4.4-2 .2-4-.6-5.6"/><path d="M5.2 20c1-3.4 3.6-5 6.8-5s5.8 1.6 6.8 5"/></svg>',
    neutral: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" width="100%" height="100%"><circle cx="12" cy="8" r="3.6"/><path d="M4.8 20c1.1-3.7 3.9-5.5 7.2-5.5s6.1 1.8 7.2 5.5"/></svg>'
};

function avatarSvgForSex(sex) {
    const s = (sex || "").toUpperCase();
    if (s === "M") return AVATAR_SVG.male;
    if (s === "F") return AVATAR_SVG.female;
    return AVATAR_SVG.neutral;
}

// Presentation-level avatar resolver with gender-aware UI fallback
function resolvePersonAvatar(person) {
    if (!person || !person.id) return null;
    const realPortrait = getPersonPortrait(person.id);
    if (realPortrait) {
        return {
            url: realPortrait.url,
            isPlaceholder: false,
            source: realPortrait.source || "FamilySearch",
            sourceId: realPortrait.sourceId || realPortrait.fsId || person.fsid || person.id
        };
    }

    // Gender-aware fallback based strictly on person.sex
    const sex = (person.sex || "").toUpperCase();
    if (sex === "M") {
        return {
            url: null,
            isPlaceholder: true,
            placeholderType: "male",
            icon: null,
            childIcon: null,
            label: "Nam"
        };
    } else if (sex === "F") {
        return {
            url: null,
            isPlaceholder: true,
            placeholderType: "female",
            icon: null,
            childIcon: null,
            label: "Nữ"
        };
    } else {
        return {
            url: null,
            isPlaceholder: true,
            placeholderType: "neutral",
            icon: null,
            childIcon: null,
            label: "Chưa xác định"
        };
    }
}

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

/// --- SITE IDENTITY & PAGE CONTEXT CONFIGURATION ---
const SITE_CONFIG = {
    publicationName: "GIA TỘC TRẦN TRỌNG THU",
    subtitle: "TỪ 1872 ĐẾN CHÚNG TA"
};

const ROUTE_CONTEXTS = {
    "/": {
        type: "HOME",
        territory: "home",
        title: "Trang Chủ",
        navId: "nav_home",
        secId: "view_home"
    },
    "/gia-pha": {
        type: "GENEALOGY",
        territory: "gia_pha",
        title: "Gia Phả • Cây Phả Đồ",
        navId: "nav_gia_pha",
        secId: "view_tree",
        init: () => renderTreeModule()
    },
    "/tree": {
        type: "GENEALOGY",
        territory: "gia_pha",
        title: "Gia Phả • Cây Phả Đồ",
        navId: "nav_gia_pha",
        secId: "view_tree",
        init: () => renderTreeModule()
    },
    "/gia-pha/cay": {
        type: "GENEALOGY",
        territory: "gia_pha",
        title: "Gia Phả • Cây Phả Đồ",
        navId: "nav_gia_pha",
        secId: "view_tree",
        init: () => renderTreeModule()
    },
    "/gia-pha/nhan-vat": {
        type: "GENEALOGY",
        territory: "gia_pha",
        title: "Gia Phả • Danh Bạ Thành Viên",
        navId: "nav_gia_pha",
        secId: "view_people",
        init: () => renderPeopleDirectory()
    },
    "/people": {
        type: "GENEALOGY",
        territory: "gia_pha",
        title: "Gia Phả • Danh Bạ Thành Viên",
        navId: "nav_gia_pha",
        secId: "view_people",
        init: () => renderPeopleDirectory()
    },
    "/gia-pha/gia-dinh": {
        type: "GENEALOGY",
        territory: "gia_pha",
        title: "Gia Phả • Gia Đình",
        navId: "nav_gia_pha",
        secId: "view_families",
        init: () => renderFamiliesDirectory()
    },
    "/families": {
        type: "GENEALOGY",
        territory: "gia_pha",
        title: "Gia Phả • Gia Đình",
        navId: "nav_gia_pha",
        secId: "view_families",
        init: () => renderFamiliesDirectory()
    },
    "/gia-pha/dong-thoi-gian": {
        type: "GENEALOGY",
        territory: "gia_pha",
        title: "Gia Phả • Dòng Thời Gian",
        navId: "nav_gia_pha",
        secId: "view_timeline",
        init: () => renderTimeline()
    },
    "/timeline": {
        type: "GENEALOGY",
        territory: "gia_pha",
        title: "Gia Phả • Dòng Thời Gian",
        navId: "nav_gia_pha",
        secId: "view_timeline",
        init: () => renderTimeline()
    },
    "/gia-pha/ky-uc": {
        type: "GENEALOGY",
        territory: "gia_pha",
        title: "Gia Phả • Ký Ức",
        navId: "nav_gia_pha",
        secId: "view_memories",
        init: () => renderMemories()
    },
    "/memories": {
        type: "GENEALOGY",
        territory: "gia_pha",
        title: "Gia Phả • Ký Ức",
        navId: "nav_gia_pha",
        secId: "view_memories",
        init: () => renderMemories()
    },
    "/mach": {
        type: "EDITORIAL",
        territory: "mach",
        title: "Mạch • Tập San Di Sản",
        navId: "nav_mach",
        secId: "view_mach",
        init: () => renderMachModule()
    },
    "/tu-lieu": {
        type: "ARCHIVE",
        territory: "tu_lieu",
        title: "Tư Liệu • Hồ Sơ Gốc",
        navId: "nav_tu_lieu",
        secId: "view_tu_lieu",
        init: () => renderTuLieuModule()
    },
    "/archive": {
        type: "ARCHIVE",
        territory: "tu_lieu",
        title: "Tư Liệu • Hồ Sơ Gốc",
        navId: "nav_tu_lieu",
        secId: "view_tu_lieu",
        init: () => renderTuLieuModule()
    },
    "/lich": {
        type: "TOOL",
        territory: "system",
        title: "Lịch Gia Đình Trực Tuyến",
        navId: "nav_lich",
        secId: "view_calendar",
        init: () => renderCalendarModule()
    },
    "/calendar": {
        type: "TOOL",
        territory: "system",
        title: "Lịch Gia Đình Trực Tuyến",
        navId: "nav_lich",
        secId: "view_calendar",
        init: () => renderCalendarModule()
    },
    "/tim-kiem": {
        type: "TOOL",
        territory: "system",
        title: "Tra Cứu Toàn Cục",
        navId: "nav_tim_kiem",
        secId: "view_search",
        init: () => runSearchPage()
    },
    "/search": {
        type: "TOOL",
        territory: "system",
        title: "Tra Cứu Toàn Cục",
        navId: "nav_tim_kiem",
        secId: "view_search",
        init: () => runSearchPage()
    },
    "/ve-dong-ho": {
        type: "PROJECT",
        territory: "project",
        title: "Về Dòng Họ Trần Trọng Thu",
        navId: "",
        secId: "view_ve_dong_ho"
    },
    "/ve-du-an": {
        type: "PROJECT",
        territory: "project",
        title: "Về Dự Án & Tôn Chỉ Biên Soạn",
        navId: "",
        secId: "view_ve_du_an"
    },
    "/specimen": {
        type: "PROJECT",
        territory: "project",
        title: "Typography Specimen",
        navId: "",
        secId: "view_typography_specimen"
    }
};

function bindPublicationHeaders(data) {
    const pubName = (data && data.publication) || SITE_CONFIG.publicationName;
    const subTitle = SITE_CONFIG.subtitle;

    const brandTitle = document.getElementById("globalBrandTitle");
    if (brandTitle) brandTitle.innerText = pubName;
    const brandBadge = document.getElementById("globalBrandBadge");
    if (brandBadge) brandBadge.innerText = subTitle;

    const heroTitle = document.getElementById("heroPublicationTitle");
    if (heroTitle) heroTitle.innerText = pubName;

    const footerTitle = document.getElementById("footerSiteTitle");
    if (footerTitle) footerTitle.innerText = pubName;
}

function updatePageContext(route, contextOverride = null) {
    const ctx = contextOverride || ROUTE_CONTEXTS[route] || ROUTE_CONTEXTS["/"];
    const pubName = (appData && appData.publication) || SITE_CONFIG.publicationName;
    
    if (ctx.type === "HOME") {
        document.title = `${pubName} — ${SITE_CONFIG.subtitle}`;
    } else {
        document.title = `${ctx.title} — ${pubName}`;
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
    } else if (route.startsWith("/gia-pha/nhan-vat/")) {
        const pid = route.replace("/gia-pha/nhan-vat/", "");
        openPersonProfile(pid);
    } else if (route.startsWith("/family/")) {
        const fid = route.replace("/family/", "");
        openFamilyProfile(fid);
    } else if (route.startsWith("/gia-pha/gia-dinh/")) {
        const fid = route.replace("/gia-pha/gia-dinh/", "");
        openFamilyProfile(fid);
    } else if (route.startsWith("/mach/bai-viet/")) {
        const slug = route.replace("/mach/bai-viet/", "");
        openStoryDetail(slug);
    } else if (route.startsWith("/mach/series/")) {
        const slug = route.replace("/mach/series/", "");
        openSeriesDetail(slug);
    } else if (route.startsWith("/mach/chuyen-de/")) {
        const slug = route.replace("/mach/chuyen-de/", "");
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

    const ctx = ROUTE_CONTEXTS[route] || ROUTE_CONTEXTS["/"];
    
    updatePageContext(route, ctx);

    const sec = document.getElementById(ctx.secId);
    if (sec) sec.classList.add("active");

    if (ctx.navId) {
        const nav = document.getElementById(ctx.navId);
        if (nav) nav.classList.add("active");
    }

    if (typeof ctx.init === 'function') {
        ctx.init();
    }

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
                    <div class="agenda-ev-title">${escapeHtml(ev.summary)}</div>
                    <div class="agenda-ev-meta">Loại: <strong>${ev.label}</strong> • Nhấp để xem hồ sơ gia phả & ký ức</div>
                </div>
            `;
        });

        dayGroup.innerHTML = `
            <div class="agenda-date-head">
                <span>Ngày ${d < 10 ? '0' + d : d}/${(m + 1) < 10 ? '0' + (m + 1) : (m + 1)}/${y}</span>
                <span style="font-size:13px; font-weight:600; color:var(--lunar-color);">${lunar.fullText}</span>
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
    if (elSub) elSub.innerText = `Âm lịch: ${lunar.fullText}`;
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
                <div style="font-weight:700; font-size:15px;">${escapeHtml(ev.summary)}</div>
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
                <div><strong>Dương lịch:</strong> ${ev.day < 10 ? '0' + ev.day : ev.day}/${ev.month < 10 ? '0' + ev.month : ev.month}/${yr}</div>
                <div style="color:var(--lunar-color); margin-top:3px;"><strong>Âm lịch:</strong> ${lunar.fullText}</div>
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
                Thành viên liên quan: <a onclick="closeModalDirect('eventModal'); openPersonProfile('${personMatch.id}')" style="color:var(--primary); font-weight:700; cursor:pointer; text-decoration:underline;">${personMatch.name} (Xem hồ sơ gia phả →)</a>
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
    return `https://giatoctrantrongthu.vercel.app/${file}`;
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
        banner.innerHTML = `<strong>Dành cho iPhone, iPad và máy Mac:</strong><br>Bấm nút <strong>"Thêm vào Apple Calendar"</strong> để ứng dụng Lịch trên máy tự động mở và đăng ký đồng bộ.`;
    } else if (currentCalPlatform === 'google') {
        banner.className = 'subscribe-plat-banner google-theme';
        banner.innerHTML = `<strong>Dành cho Google Calendar (Android & Máy tính):</strong><br>
        <em>(Lưu ý: Ứng dụng Google Calendar trên điện thoại không hỗ trợ thêm lịch qua URL trực tiếp. Bạn chỉ cần thêm 1 lần trên web <a href="https://calendar.google.com" target="_blank" rel="noopener" style="color:#1d4ed8; text-decoration:underline; font-weight:700;">calendar.google.com</a>, lịch sẽ tự động đồng bộ về điện thoại)</em>.<br>
        <strong>Cách làm:</strong> Bấm <strong>"Sao chép URL"</strong> > Mở Google Calendar Web > Cột trái mục <em>"Lịch khác" (+) > Chọn "Từ URL"</em> > Dán địa chỉ.`;
    } else {
        banner.className = 'subscribe-plat-banner other-theme';
        banner.innerHTML = `<strong>Microsoft Outlook & Ứng dụng khác:</strong><br>Bấm <strong>"Sao chép URL"</strong> > Trong phần mềm Lịch chọn <em>Add Calendar > Subscribe from web</em> và dán địa chỉ.`;
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
                    Thêm vào Apple Calendar
                </a>
                <button class="btn-plat-secondary" id="btn_copy_${f.key}" onclick="copyCalendarFeedUrl('${f.key}', '${escapeHtml(absUrl)}', this)">
                    Sao chép URL
                </button>
            `;
        } else if (currentCalPlatform === 'google') {
            actionsHtml = `
                <button class="btn-plat-primary google" id="btn_copy_${f.key}" onclick="copyCalendarFeedUrl('${f.key}', '${escapeHtml(absUrl)}', this)">
                    Sao chép URL lịch
                </button>
                <a class="btn-plat-secondary" href="https://calendar.google.com" target="_blank" rel="noopener">
                    Mở Google Calendar Web ↗
                </a>
            `;
        } else {
            actionsHtml = `
                <button class="btn-plat-primary" id="btn_copy_${f.key}" onclick="copyCalendarFeedUrl('${f.key}', '${escapeHtml(absUrl)}', this)">
                    Sao chép URL lịch
                </button>
            `;
        }

        return `
            <div class="subscribe-feed-card">
                <div class="subscribe-feed-header">
                    <div class="subscribe-feed-title">Lịch ${f.label}</div>
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
                btnEl.innerHTML = "Đã sao chép!";
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
            btnEl.innerHTML = "Đã sao chép!";
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
let graphPanX = 0;
let graphPanY = 0;
let graphHistory = [];

function applyGraphTransform() {
    const viewport = document.getElementById("graphCanvasViewport");
    if (viewport) {
        viewport.style.transform = `translate(${graphPanX}px, ${graphPanY}px) scale(${graphScale})`;
    }
}

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
    graphScale = Math.min(1.5, Math.max(0.5, Math.round((graphScale + delta) * 100) / 100));
    applyGraphTransform();
}

function resetGraphZoom() {
    graphScale = 1.0;
    graphPanX = 0;
    graphPanY = 0;
    applyGraphTransform();
}

// Compact Interactive Graph Node
function renderGraphNode(p, role = 'child', isFocus = false) {
    if (!p) return "";
    const gMeta = getGenerationMeta(p.id);
    const bDate = p.birth && p.birth.date ? p.birth.date : "Chưa rõ";
    const dDate = p.death && p.death.date ? p.death.date : "";
    const lifeStr = dDate ? `${bDate} – ${dDate}` : (bDate !== "Chưa rõ" ? `s. ${bDate}` : "Chưa có năm sinh");
    const avatar = resolvePersonAvatar(p);

    const fallbackSvg = avatarSvgForSex(p.sex);
    const avatarHtml = (avatar && !avatar.isPlaceholder && avatar.url)
        ? `<div class="node-avatar-box"><img src="${avatar.url}" alt="${p.name}" class="node-avatar-img" loading="lazy"/></div>`
        : `<div class="node-avatar-box"><span class="node-avatar-fallback">${fallbackSvg}</span></div>`;

    return `
        <div class="graph-node ${gMeta.borderCls} ${isFocus ? 'node-focus' : ''}" onclick="focusGraphPerson('${p.id}')">
            <div class="node-header">
                <span class="gen-badge ${gMeta.badgeCls}">${gMeta.label.split('·')[0].trim()}</span>
                ${isFocus ? '<span class="focus-indicator">● ĐANG XEM</span>' : ''}
                <span class="node-fsid">${p.fsid || p.id}</span>
            </div>
            <div class="node-body-row">
                ${avatarHtml}
                <div class="node-content-main">
                    <div class="node-name" title="${p.name}">${p.name}</div>
                    <div class="node-meta">${lifeStr}</div>
                </div>
            </div>
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

    // Reset pan on new focus
    graphPanX = 0;
    graphPanY = 0;

    // Render Lineage Breadcrumbs Path from Root Anchor
    if (pathContainer) {
        pathContainer.style.display = "flex";
        const pathIds = derivedPaths[centerId] || [centerId];
        let pathHtml = `<span style="font-weight:700; color:var(--text-muted);">Tuyến phả hệ trực hệ:</span> `;
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
                    <div class="union-hub">Phụ Mẫu</div>
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
            <div class="tier-badge-label" style="background:#eff6ff; color:#1e3a8a; border-color:#bfdbfe;">Mốc Khởi Thủy Gia Tộc (Anchor)</div>
            <div class="vertical-stem-line"></div>
        `;
    }

    // 2. Tier 2: Focus Person & Spouse Union (Trọng tâm & Hôn phối)
    let focusHtml = "";
    if (person.spouses.length > 0) {
        const spousesNodes = person.spouses.map(sid => renderGraphNode(appData.people[sid], 'spouse')).join(`<div class="union-hub" style="margin: 0 4px;">+</div>`);
        focusHtml = `
            <div class="graph-tier-row">
                <div class="graph-nodes-cluster">
                    ${renderGraphNode(person, 'focus', true)}
                    <div class="union-hub">Hôn phối</div>
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
                    ${grandCount > 0 ? `<div class="grand-badge" onclick="event.stopPropagation(); focusGraphPerson('${ch.id}')" title="Nhấn để xem nhánh con cháu">${grandCount} người con ↓</div>` : ''}
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
                <button class="graph-tool-btn" onclick="zoomGraph(0.15)" title="Phóng to" aria-label="Phóng to">+</button>
                <button class="graph-tool-btn" onclick="zoomGraph(-0.15)" title="Thu nhỏ" aria-label="Thu nhỏ">−</button>
                <button class="graph-tool-btn" onclick="resetGraphZoom()" title="Đặt lại kích thước" aria-label="Đặt lại">⟲ 100%</button>
                <button class="graph-tool-btn" onclick="graphGoHome()" title="Về mốc Cố Thu" aria-label="Về Cố Thu">⌂ Cố Thu</button>
                ${graphHistory.length > 0 ? `<button class="graph-tool-btn" onclick="graphGoBack()" title="Quay lại người trước" aria-label="Quay lại">↩ Quay lại</button>` : ''}
            </div>

            <div class="graph-canvas-viewport" id="graphCanvasViewport" style="transform: translate(${graphPanX}px, ${graphPanY}px) scale(${graphScale});">
                ${parentsHtml}
                ${focusHtml}
                ${childrenHtml}
            </div>
        </div>
    `;

    attachGraphCanvasInteractions();
}

// Touch Pan, Mouse Drag & Pinch Zoom Interaction Handler
function attachGraphCanvasInteractions() {
    const wrapper = document.getElementById("familyGraphWrapper");
    if (!wrapper) return;

    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let initialPanX = 0;
    let initialPanY = 0;
    let initialPinchDist = 0;
    let initialPinchScale = 1.0;

    // Mouse Dragging
    wrapper.addEventListener("mousedown", (e) => {
        if (e.target.closest(".graph-floating-toolbar") || e.target.closest(".graph-node") || e.target.closest(".grand-badge")) {
            return;
        }
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        initialPanX = graphPanX;
        initialPanY = graphPanY;
        wrapper.style.cursor = "grabbing";
    });

    window.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        graphPanX = initialPanX + dx;
        graphPanY = initialPanY + dy;
        applyGraphTransform();
    });

    window.addEventListener("mouseup", () => {
        if (isDragging) {
            isDragging = false;
            if (wrapper) wrapper.style.cursor = "grab";
        }
    });

    // Touch 1-Finger Pan & 2-Finger Pinch Zoom
    wrapper.addEventListener("touchstart", (e) => {
        if (e.target.closest(".graph-floating-toolbar") || e.target.closest(".graph-node") || e.target.closest(".grand-badge")) {
            return;
        }
        if (e.touches.length === 1) {
            isDragging = true;
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            initialPanX = graphPanX;
            initialPanY = graphPanY;
        } else if (e.touches.length === 2) {
            isDragging = false;
            const t1 = e.touches[0];
            const t2 = e.touches[1];
            initialPinchDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
            initialPinchScale = graphScale;
        }
    }, { passive: true });

    wrapper.addEventListener("touchmove", (e) => {
        if (e.touches.length === 1 && isDragging) {
            const dx = e.touches[0].clientX - startX;
            const dy = e.touches[0].clientY - startY;
            graphPanX = initialPanX + dx;
            graphPanY = initialPanY + dy;
            applyGraphTransform();
            e.preventDefault(); // Prevent page scroll during canvas drag
        } else if (e.touches.length === 2 && initialPinchDist > 0) {
            const t1 = e.touches[0];
            const t2 = e.touches[1];
            const currentDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
            const factor = currentDist / initialPinchDist;
            graphScale = Math.min(1.5, Math.max(0.5, Math.round(initialPinchScale * factor * 100) / 100));
            applyGraphTransform();
            e.preventDefault();
        }
    }, { passive: false });

    wrapper.addEventListener("touchend", () => {
        isDragging = false;
        initialPinchDist = 0;
    }, { passive: true });
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
    const avatar = resolvePersonAvatar(p);

    const fallbackSvg = avatarSvgForSex(p.sex);
    const avatarHtml = (avatar && !avatar.isPlaceholder && avatar.url)
        ? `<div class="card-avatar-box"><img src="${avatar.url}" alt="${p.name}" class="card-avatar-img" loading="lazy"/></div>`
        : `<div class="card-avatar-box"><span class="card-avatar-fallback">${fallbackSvg}</span></div>`;

    return `
        <div class="person-card ${gMeta.borderCls}" ${isTreeNode ? `onclick="renderFocusPedigreeTree('${p.id}')"` : `onclick="openPersonProfile('${p.id}')"`} style="${isCenter ? 'border: 2px solid var(--primary); box-shadow: var(--shadow-md);' : ''}">
            <div>
                <div class="card-header-row">
                    <span class="gen-badge ${gMeta.badgeCls}">${gMeta.label}</span>
                    <span class="card-id-badge">${p.fsid || p.id}</span>
                </div>
                <div class="card-body-layout">
                    ${avatarHtml}
                    <div class="card-content-main">
                        <div class="card-name-title">${p.name}</div>
                        <div class="card-meta-primary">${lifeStr}</div>
                        <div class="card-meta-secondary">Giới tính: <strong>${p.sex === 'M' ? 'Nam' : 'Nữ'}</strong> • Con: <strong>${p.children ? p.children.length : 0}</strong></div>
                    </div>
                </div>
            </div>
            <div class="card-footer-row">
                <a class="card-accent-link" onclick="event.stopPropagation(); renderFocusPedigreeTree('${p.id}'); switchTreeViewMode('focus');">Tiêu điểm phả đồ →</a>
                <a class="card-action-link" onclick="event.stopPropagation(); openPersonProfile('${p.id}');">Hồ sơ →</a>
            </div>
        </div>
    `;
}

// --- DIRECTORIES ---
let currentPeopleGenFilter = 'all';

function filterPeopleByGen(gen) {
    currentPeopleGenFilter = gen;
    renderPeopleDirectory(gen);
}

function renderPeopleDirectory(filterGen = currentPeopleGenFilter) {
    currentPeopleGenFilter = filterGen;
    const grid = document.getElementById("peopleGrid");
    if (!grid) return;
    grid.innerHTML = "";

    const allPeople = Object.values(appData.people);
    const countMap = { all: allPeople.length, 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 };
    allPeople.forEach(p => {
        const gMeta = getGenerationMeta(p.id);
        if (gMeta && gMeta.level !== undefined && countMap[gMeta.level] !== undefined) {
            countMap[gMeta.level]++;
        }
    });

    const cntAll = document.getElementById("cnt_ppl_all");
    const cntF0 = document.getElementById("cnt_ppl_f0");
    const cntF1 = document.getElementById("cnt_ppl_f1");
    const cntF2 = document.getElementById("cnt_ppl_f2");
    const cntF3 = document.getElementById("cnt_ppl_f3");
    const cntF4 = document.getElementById("cnt_ppl_f4");
    if (cntAll) cntAll.innerText = countMap.all;
    if (cntF0) cntF0.innerText = countMap[0];
    if (cntF1) cntF1.innerText = countMap[1];
    if (cntF2) cntF2.innerText = countMap[2];
    if (cntF3) cntF3.innerText = countMap[3];
    if (cntF4) cntF4.innerText = countMap[4];

    const pills = [
        { id: "filter_ppl_all", val: 'all' },
        { id: "filter_ppl_0", val: 0 },
        { id: "filter_ppl_1", val: 1 },
        { id: "filter_ppl_2", val: 2 },
        { id: "filter_ppl_3", val: 3 },
        { id: "filter_ppl_4", val: 4 }
    ];
    pills.forEach(p => {
        const el = document.getElementById(p.id);
        if (el) el.classList.toggle("active", filterGen === p.val);
    });

    let renderedCount = 0;
    allPeople.forEach(p => {
        const gMeta = getGenerationMeta(p.id);
        if (filterGen !== 'all' && gMeta.level !== filterGen) return;

        renderedCount++;
        grid.innerHTML += renderUnifiedPersonCard(p, false);
    });

    if (renderedCount === 0) {
        grid.innerHTML = `<div style="grid-column: 1/-1; padding: 32px; text-align: center; color: var(--text-muted); background: var(--surface); border: 1px dashed var(--border); border-radius: var(--radius-md);">Không có thành viên nào thuộc thế hệ này.</div>`;
    }
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
    let p = appData.people[pid];
    if (!p) {
        // Fallback: search by fsid if pid is an FSID like G5X4-48S
        p = Object.values(appData.people).find(person => person.fsid === pid || person._FSFTID === pid);
    }
    if (!p) return;
    const actualPid = p.id;
    const targetHash = `#/person/${actualPid}`;
    if (window.location.hash !== targetHash) {
        window.history.replaceState(null, '', targetHash);
    }
    document.querySelectorAll(".view-section").forEach(s => s.classList.remove("active"));
    document.querySelectorAll(".nav-item-btn").forEach(b => b.classList.remove("active"));
    const navGiaPha = document.getElementById("nav_gia_pha");
    if (navGiaPha) navGiaPha.classList.add("active");
    const sec = document.getElementById("view_person");
    if (sec) sec.classList.add("active");

    updatePageContext(window.location.hash, {
        type: "PERSON",
        territory: "gia_pha",
        title: `${p.name} • Hồ Sơ Nhân Vật`
    });

    const gMeta = getGenerationMeta(p.id);
    const pContainer = document.getElementById("personProfileContainer");
    const pName = document.getElementById("p_name");
    const pGender = document.getElementById("p_gender_status");
    const pFsid = document.getElementById("p_fsid");
    const pAvatar = document.getElementById("p_avatar_container");
    const pProv = document.getElementById("p_provenance_badge");
    const pFacts = document.getElementById("p_facts");
    const pRels = document.getElementById("p_relatives");

    const avatar = resolvePersonAvatar(p);
    const fallbackSvg = avatarSvgForSex(p.sex);
    if (pAvatar) {
        if (avatar && !avatar.isPlaceholder && avatar.url) {
            pAvatar.innerHTML = `<img src="${avatar.url}" alt="${p.name}" class="profile-avatar-img"/>`;
        } else {
            pAvatar.innerHTML = `<span class="profile-avatar-fallback">${fallbackSvg}</span>`;
        }
    }

    if (pProv) {
        if (avatar && !avatar.isPlaceholder && avatar.url) {
            const srcLabel = avatar.source || "FamilySearch";
            const srcId = avatar.sourceId || p.fsid || p.id;
            pProv.innerHTML = `<span class="profile-provenance-tag">Ảnh chân dung ${srcLabel} (${srcId})</span>`;
        } else {
            pProv.innerHTML = `<span style="font-size: 11.5px; color: var(--text-muted);">Chưa có ảnh chân dung lưu trữ</span>`;
        }
    }

    if (pContainer) pContainer.className = `profile-container ${gMeta.borderCls}`;
    if (pName) pName.innerText = p.name;
    if (pGender) pGender.innerHTML = `<span class="gen-badge ${gMeta.badgeCls}">${gMeta.label}</span> • ${p.sex === 'M' ? 'Nam' : (p.sex === 'F' ? 'Nữ' : 'Chưa xác định')} • Tên gốc: ${p.raw_name}`;
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
                const parAv = resolvePersonAvatar(par);
                const parSvg = avatarSvgForSex(par.sex);
                const parThumb = (parAv && !parAv.isPlaceholder && parAv.url)
                    ? `<span class="rel-thumb-box"><img src="${parAv.url}" alt="${par.name}" class="rel-thumb-img" loading="lazy"/></span>`
                    : `<span class="rel-thumb-box"><span class="rel-thumb-fallback">${parSvg}</span></span>`;
                relsHtml += `<a class="rel-link" onclick="openPersonProfile('${par.id}')">${parThumb}<span class="gen-badge ${gPar.badgeCls}" style="font-size:10px; padding:1px 6px; margin-right:4px;">${gPar.label.split('·')[0].trim()}</span> ${par.name} (${par.sex === 'M' ? 'Cha' : (par.sex === 'F' ? 'Mẹ' : 'Phụ huynh')})</a>`;
            }
        });
    }
    if (p.spouses.length > 0) {
        relsHtml += `<div style="font-weight:700; font-size:13px; color:var(--text-muted); margin-top:10px; margin-bottom:6px;">Hôn Phối:</div>`;
        p.spouses.forEach(spId => {
            const sp = appData.people[spId];
            if (sp) {
                const gSp = getGenerationMeta(sp.id);
                const spAv = resolvePersonAvatar(sp);
                const spSvg = avatarSvgForSex(sp.sex);
                const spThumb = (spAv && !spAv.isPlaceholder && spAv.url)
                    ? `<span class="rel-thumb-box"><img src="${spAv.url}" alt="${sp.name}" class="rel-thumb-img" loading="lazy"/></span>`
                    : `<span class="rel-thumb-box"><span class="rel-thumb-fallback">${spSvg}</span></span>`;
                relsHtml += `<a class="rel-link" onclick="openPersonProfile('${sp.id}')">${spThumb}<span class="gen-badge ${gSp.badgeCls}" style="font-size:10px; padding:1px 6px; margin-right:4px;">${gSp.label.split('·')[0].trim()}</span> ${sp.name}</a>`;
            }
        });
    }
    if (p.children.length > 0) {
        relsHtml += `<div style="font-weight:700; font-size:13px; color:var(--text-muted); margin-top:10px; margin-bottom:6px;">Con Cái (${p.children.length}):</div>`;
        p.children.forEach(chId => {
            const ch = appData.people[chId];
            if (ch) {
                const gCh = getGenerationMeta(ch.id);
                const chAv = resolvePersonAvatar(ch);
                const chSvg = avatarSvgForSex(ch.sex);
                const chThumb = (chAv && !chAv.isPlaceholder && chAv.url)
                    ? `<span class="rel-thumb-box"><img src="${chAv.url}" alt="${ch.name}" class="rel-thumb-img" loading="lazy"/></span>`
                    : `<span class="rel-thumb-box"><span class="rel-thumb-fallback">${chSvg}</span></span>`;
                relsHtml += `<a class="rel-link" onclick="openPersonProfile('${ch.id}')">${chThumb}<span class="gen-badge ${gCh.badgeCls}" style="font-size:10px; padding:1px 6px; margin-right:4px;">${gCh.label.split('·')[0].trim()}</span> ${ch.name}</a>`;
            }
        });
    }
    relsHtml += `<div style="margin-top:16px;"><button class="cal-nav-btn today" onclick="currentTreeFocusId='${p.id}'; switchTreeViewMode('focus'); navigateRoute('/tree');">Xem cây phả đồ lấy người này làm trọng tâm →</button></div>`;
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
    const targetHash = `#/family/${fid}`;
    if (window.location.hash !== targetHash) {
        window.history.replaceState(null, '', targetHash);
    }
    document.querySelectorAll(".view-section").forEach(s => s.classList.remove("active"));
    document.querySelectorAll(".nav-item-btn").forEach(b => b.classList.remove("active"));
    const navGiaPha = document.getElementById("nav_gia_pha");
    if (navGiaPha) navGiaPha.classList.add("active");
    const sec = document.getElementById("view_family");
    if (sec) sec.classList.add("active");

    const husb = appData.people[f.husband], wife = appData.people[f.wife];
    const famName = `${husb ? husb.name : 'Chưa rõ'} & ${wife ? wife.name : 'Chưa rõ'}`;
    updatePageContext(window.location.hash, {
        type: "FAMILY",
        territory: "gia_pha",
        title: `Nhánh ${famName} • Gia Đình`
    });

    const fMeta = getFamilyGenerationMeta(fid);
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
        const hAv = resolvePersonAvatar(husb);
        const hSvg = avatarSvgForSex(husb.sex);
        const hThumb = (hAv && !hAv.isPlaceholder && hAv.url)
            ? `<span class="rel-thumb-box"><img src="${hAv.url}" alt="${husb.name}" class="rel-thumb-img" loading="lazy"/></span>`
            : `<span class="rel-thumb-box"><span class="rel-thumb-fallback">${hSvg}</span></span>`;
        pHtml += `<a class="rel-link" onclick="openPersonProfile('${husb.id}')">${hThumb}<span class="gen-badge ${gH.badgeCls}" style="font-size:10px; padding:1px 6px; margin-right:4px;">${gH.label.split('·')[0].trim()}</span> Người chồng: ${husb.name}</a>`;
    }
    if (wife) {
        const gW = getGenerationMeta(wife.id);
        const wAv = resolvePersonAvatar(wife);
        const wSvg = avatarSvgForSex(wife.sex);
        const wThumb = (wAv && !wAv.isPlaceholder && wAv.url)
            ? `<span class="rel-thumb-box"><img src="${wAv.url}" alt="${wife.name}" class="rel-thumb-img" loading="lazy"/></span>`
            : `<span class="rel-thumb-box"><span class="rel-thumb-fallback">${wSvg}</span></span>`;
        pHtml += `<a class="rel-link" onclick="openPersonProfile('${wife.id}')">${wThumb}<span class="gen-badge ${gW.badgeCls}" style="font-size:10px; padding:1px 6px; margin-right:4px;">${gW.label.split('·')[0].trim()}</span> Người vợ: ${wife.name}</a>`;
    }
    if (fParents) fParents.innerHTML = pHtml;

    let cHtml = "";
    if (f.children.length > 0) {
        f.children.forEach(cid => {
            const c = appData.people[cid];
            if (c) {
                const gC = getGenerationMeta(c.id);
                const cAv = resolvePersonAvatar(c);
                const cSvg = avatarSvgForSex(c.sex);
                const cThumb = (cAv && !cAv.isPlaceholder && cAv.url)
                    ? `<span class="rel-thumb-box"><img src="${cAv.url}" alt="${c.name}" class="rel-thumb-img" loading="lazy"/></span>`
                    : `<span class="rel-thumb-box"><span class="rel-thumb-fallback">${cSvg}</span></span>`;
                cHtml += `<a class="rel-link" onclick="openPersonProfile('${c.id}')">${cThumb}<span class="gen-badge ${gC.badgeCls}" style="font-size:10px; padding:1px 6px; margin-right:4px;">${gC.label.split('·')[0].trim()}</span> ${c.name}</a>`;
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

function bindStats(stats) {
    if (!stats) return;
    const elPeopleCount = document.getElementById("peopleTotalCount");
    const elFamCount = document.getElementById("familiesTotalCount");
    const elQuickDescPeople = document.getElementById("quickDescPeople");

    if (elPeopleCount) elPeopleCount.innerText = stats.individuals || 0;
    if (elFamCount) elFamCount.innerText = stats.families || 0;
    if (elQuickDescPeople) elQuickDescPeople.innerText = `Tra cứu ${stats.individuals || 0} thành viên gia tộc và lý lịch chi tiết`;
}

// =======================================================
// HOME PUBLICATION LANDING (COMMUNICATION REFOUNDED)
// =======================================================

function renderHomePublicationLanding() {
    if (!appData) return;

    const people = appData.people || {};
    const stats = appData.stats || { individuals: Object.keys(people).length, families: Object.keys(appData.families || {}).length, memories: (appData.memories || []).length };
    const rootId = appData.rootAnchor || Object.keys(people)[0];
    const rootPerson = people[rootId];

    // 1. BLOCK 01: Dynamic Hero Lede & Subject Anchor
    const heroAnchorEl = document.getElementById("homeHeroAnchor");
    if (heroAnchorEl) {
        if (rootPerson) {
            const rootName = rootPerson.name || "cụ Giuse Trần Trọng Thu";
            const bYear = rootPerson.birth && rootPerson.birth.date ? rootPerson.birth.date.replace(/[^0-9]/g, '').slice(0, 4) : "1872";
            const dYear = rootPerson.death && rootPerson.death.date ? rootPerson.death.date.slice(-4) : "1969";
            const bPlace = (rootPerson.birth && rootPerson.birth.place) ? rootPerson.birth.place.split(',')[0].trim() : "Thanh Hóa";
            const genLevels = window.maxDerivedGenLevel ? (window.maxDerivedGenLevel + 1) : 5;
            
            heroAnchorEl.innerHTML = `Dòng họ bắt đầu từ cụ <strong>${escapeHtml(rootName)}</strong> (${bYear}–${dYear}) tại ${escapeHtml(bPlace)}, trải qua hơn 150 năm với ${genLevels} thế hệ tiếp nối.`;
        } else {
            heroAnchorEl.innerText = "Dòng họ bắt đầu từ cụ Giuse Trần Trọng Thu (1872–1969) tại Thanh Hóa, trải qua hơn 150 năm với 5 thế hệ tiếp nối.";
        }
    }

    // 2. BLOCK 02: Dynamic Human Memory Spotlight (Bà Sa / Cụ Thư)
    const spotlightContent = document.getElementById("homeSpotlightContent");
    if (spotlightContent) {
        const memories = appData.memories || [];
        if (memories.length > 0) {
            // Default to memory 0 (Bà Sa) as recommended in brief, easily configurable
            const mem = memories[0];
            const title = mem.title ? mem.title.replace(/^[📖🕯️]\s*/u, '') : "Ký ức tiền nhân";
            const personName = mem.personName ? ` — ${mem.personName.split('@')[0].trim()}` : '';
            const fullTitle = `${title}${personName}`;
            // Clean passage from memory story without altering facts
            const passage = mem.story ? (mem.story.length > 290 ? mem.story.slice(0, 290).trim() + '...' : mem.story) : '';
            
            spotlightContent.innerHTML = `
                <h3 class="box-title">${escapeHtml(fullTitle)}</h3>
                <p class="box-passage">${escapeHtml(passage)}</p>
                <div class="box-footer">
                    <span>Ghi chép truyền khẩu · ${memories.length} mẩu ký ức</span>
                    <a class="box-link" href="#/gia-pha/ky-uc" onclick="navigateRoute('/gia-pha/ky-uc')">Đọc toàn bộ ký ức này →</a>
                </div>
            `;
        } else {
            const spotlightSec = document.getElementById("homeHumanSpotlight");
            if (spotlightSec) spotlightSec.style.display = "none";
        }
    }

    // 3. BLOCK 03: Explore People Count
    const explorePeopleCount = document.getElementById("explorePeopleCount");
    if (explorePeopleCount) {
        const peopleCount = stats.individuals || Object.keys(people).length;
        const genCount = window.maxDerivedGenLevel ? (window.maxDerivedGenLevel + 1) : 5;
        explorePeopleCount.innerText = `Tra cứu hồ sơ ${peopleCount} thành viên qua ${genCount} thế hệ`;
    }

    // 4. BLOCK 04: Dynamic Territory Card Metas
    const genMeta = document.getElementById("homeGenealogyMeta");
    if (genMeta) {
        const peopleCount = stats.individuals || Object.keys(people).length;
        const famCount = stats.families || Object.keys(appData.families || {}).length;
        const genCount = window.maxDerivedGenLevel ? (window.maxDerivedGenLevel + 1) : 5;
        genMeta.innerText = `${peopleCount} thành viên · ${famCount} gia đình · ${genCount} thế hệ`;
    }

    const machMeta = document.getElementById("homeMachMeta");
    if (machMeta && machData) {
        const articleCount = (machData.articles || machData.stories || []).length;
        const seriesCount = Object.keys(machData.series || {}).length;
        machMeta.innerText = `${articleCount} bài viết & tự sự · ${seriesCount} tuyển tập`;
    }

    const archiveMeta = document.getElementById("homeArchiveMeta");
    if (archiveMeta) {
        // Honest empty/in-progress state - do not claim unindexed items or display "0 hiện vật"
        archiveMeta.innerText = "Đang sưu tầm & số hóa tư liệu";
    }

    // 5. BLOCK 05: Dynamic Featured Essay from MẠCH (clara-001 default)
    const featureCard = document.getElementById("homeFeatureCard");
    if (featureCard && machData && (machData.articles || machData.stories)) {
        const allArticles = machData.articles || machData.stories;
        // Priority: clara-001 (human/epistolary voice) or 06-gio-va-ky-uc-gia-dinh
        let featured = allArticles.find(a => a.slug === 'clara-001')
                    || allArticles.find(a => a.slug === '06-gio-va-ky-uc-gia-dinh') 
                    || allArticles[0];

        if (featured) {
            const seriesId = (featured.seriesIds && featured.seriesIds.length > 0) ? featured.seriesIds[0] : (featured.seriesId || featured.seriesSlug);
            const ser = (machData.series && seriesId) ? machData.series[seriesId] : null;
            const authId = (featured.authorIds && featured.authorIds.length > 0) ? featured.authorIds[0] : featured.authorId;
            const auth = (machData.authors && authId) ? machData.authors[authId] : { name: "Ban Biên Tập MẠCH" };
            const isLetter = featured.articleType === 'letter' || (ser && ser.seriesType === 'epistolary');
            const tagLabel = ser ? `${(ser.shortTitle || ser.title).toUpperCase()}${featured.seriesOrder ? ' · ' + (isLetter ? 'SỐ' : 'BÀI') + ' ' + String(featured.seriesOrder).padStart(2, '0') : ''}` : 'MẠCH · NẾP NHÀ';
            const excerpt = featured.deckLead || featured.excerpt || featured.subtitle || "Khám phá bài viết trong tập san MẠCH.";

            featureCard.setAttribute("onclick", `navigateRoute('/mach/bai-viet/${featured.slug}')`);
            featureCard.className = "comm-substance-box box-essay";
            featureCard.innerHTML = `
                <div class="essay-tag">${escapeHtml(tagLabel)}</div>
                <h3 class="box-title">${escapeHtml(featured.title)}</h3>
                <p class="box-passage">${escapeHtml(excerpt)}</p>
                <div class="box-footer">
                    <span>${escapeHtml(auth.name)} · ${featured.date || (featured.publishedAt ? featured.publishedAt.slice(0, 10) : '2026')}</span>
                    <span class="box-link">Đọc bài viết →</span>
                </div>
            `;
        }
    }

    // 6. BLOCK 06: Dynamic Substance Facts (Compact Scale Line - 223 / 68 / 5 thế hệ)
    const substanceFacts = document.getElementById("homeSubstanceFacts");
    if (substanceFacts) {
        const peopleCount = stats.individuals || Object.keys(people).length;
        const famCount = stats.families || Object.keys(appData.families || {}).length;
        const genCount = window.maxDerivedGenLevel ? (window.maxDerivedGenLevel + 1) : 5;
        const startYear = (rootPerson && rootPerson.birth && rootPerson.birth.date) ? rootPerson.birth.date.replace(/[^0-9]/g, '').slice(0, 4) : "1872";

        substanceFacts.innerHTML = `
            <div class="fact-row">
                <span class="fact-label">Quy mô ghi nhận:</span>
                <span class="fact-val"><strong>${peopleCount}</strong> thành viên</span>
                <span class="fact-sep">·</span>
                <span class="fact-val"><strong>${famCount}</strong> gia đình</span>
                <span class="fact-sep">·</span>
                <span class="fact-val"><strong>${genCount}</strong> thế hệ</span>
                <span class="fact-sep">·</span>
                <span class="fact-val">Khởi nguồn từ năm <strong>${startYear}</strong></span>
            </div>
        `;
    }
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

    // 0. Editorial masthead meta: publication facts in hero
    const heroMeta = document.getElementById("machHeroMeta");
    if (heroMeta) {
        const articleList = machData.articles || machData.stories || [];
        const seriesCount = machData.series ? Object.keys(machData.series).length : 0;
        const authorsCount = machData.authors ? Object.keys(machData.authors).length : 0;
        const issue01 = machData.series ? machData.series["issue-01"] : null;
        const issueLabel = issue01 ? `Tập san MẠCH Số 01/2026` : `Tập san gia tộc`;
        heroMeta.innerHTML = `
            <span class="mach-hero-meta-item">${articleList.length} bài viết</span>
            <span class="mach-hero-meta-item">${seriesCount} tuyển tập</span>
            <span class="mach-hero-meta-item">${authorsCount} tác giả</span>
            <span class="mach-hero-meta-item mach-hero-meta-accent">${issueLabel}</span>
        `;
    }

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
                        <span class="series-card-badge">TẬP SAN LƯU TRỮ • 12 BÀI</span>
                        <span style="font-size:12px; color:var(--text-muted);">Số 01/2026</span>
                    </div>
                    <h3 class="series-card-title" style="margin-top: 8px; font-size:1.15rem;">${issue01.title}</h3>
                    <p class="series-card-desc" style="font-size:13.5px;">${issue01.description}</p>
                    <div class="series-card-meta">
                        <span>${auth.name}</span>
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
                        <span class="series-card-badge" style="background:#fef3c7; color:#92400e; border-color:#fde68a;">CHUỖI THƯ TỪ • 7 LÁ THƯ</span>
                        <span style="font-size:12px; color:var(--text-muted);">2026</span>
                    </div>
                    <h3 class="series-card-title" style="margin-top: 8px; font-size:1.15rem;">${clara.title}</h3>
                    <p class="series-card-desc" style="font-size:13.5px;">${clara.description}</p>
                    <div class="series-card-meta">
                        <span>${auth.name}</span>
                        <span style="color:#d97706; font-weight:700;">Đọc các lá thư →</span>
                    </div>
                </div>
            `;
        }

        featHtml += `</div>`;
        featContainer.innerHTML = featHtml;
    }

    // 2. Render Stories Grid (Normalized Articles)
    const storiesGrid = document.getElementById("machStoriesGrid");
    const articleList = machData.articles || machData.stories || [];
    if (storiesGrid && articleList.length > 0) {
        storiesGrid.innerHTML = articleList.map(s => {
            const seriesId = (s.seriesIds && s.seriesIds.length > 0) ? s.seriesIds[0] : (s.seriesId || s.seriesSlug);
            const ser = (machData.series && seriesId) ? machData.series[seriesId] : null;
            const authId = (s.authorIds && s.authorIds.length > 0) ? s.authorIds[0] : s.authorId;
            const auth = (machData.authors && authId) ? machData.authors[authId] : { name: "Ban Biên Tập" };
            
            const isLetter = s.articleType === 'letter' || (ser && ser.seriesType === 'epistolary');
            const serName = ser ? (ser.shortTitle || ser.title) : 'MẠCH';
            const orderLabel = s.seriesOrder ? ` · ${isLetter ? 'SỐ' : 'BÀI'} ${String(s.seriesOrder).padStart(2, '0')}` : '';
            const sectionLabel = s.section ? `${s.section.toUpperCase()} ` : '';
            const tagLabel = `${serName.toUpperCase()}${orderLabel}`;
            const badgeStyle = isLetter ? `background:#fef3c7; color:#92400e; border-color:#fde68a;` : ``;

            return `
                <div class="story-card" onclick="navigateRoute('/mach/bai-viet/${s.slug}')">
                    <div>
                        <div class="story-card-tag" style="${badgeStyle}">${tagLabel}</div>
                        <h3 class="story-card-title">${s.title}</h3>
                        <p class="story-card-excerpt">${s.excerpt || s.deckLead || s.subtitle || ''}</p>
                    </div>
                    <div class="story-card-footer">
                        <span>${auth.name}</span>
                        <span>${s.date || (s.publishedAt ? s.publishedAt.slice(0, 10) : '2026')}</span>
                    </div>
                </div>
            `;
        }).join("");
    }

    // 3. Render Series Grid
    const seriesGrid = document.getElementById("machSeriesGrid");
    if (seriesGrid && machData.series) {
        seriesGrid.innerHTML = Object.values(machData.series).map(ser => {
            const authId = (ser.authorIds && ser.authorIds.length > 0) ? ser.authorIds[0] : ser.authorId;
            const auth = (machData.authors && authId) ? machData.authors[authId] : { name: "Ban Biên Tập" };
            const articleCount = (ser.articleIds || ser.stories || []).length;
            const isEpistolary = ser.seriesType === 'epistolary';
            const badgeText = isEpistolary ? `CHUỖI THƯ TỪ • ${articleCount} LÁ THƯ` : `TẬP SAN GIA TỘC • ${articleCount} BÀI`;
            const badgeColor = isEpistolary ? `background:#fef3c7; color:#92400e; border-color:#fde68a;` : ``;
            const borderAccent = isEpistolary ? `border-left: 5px solid #d97706;` : `border-left: 5px solid var(--lacquer-red);`;

            return `
                <div class="series-card" style="${borderAccent} cursor:pointer;" onclick="navigateRoute('/mach/series/${ser.slug || ser.id}')">
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
        const articleList = machData.articles || machData.stories || [];
        authorsGrid.innerHTML = Object.values(machData.authors).map(a => {
            const authorStoriesCount = articleList.filter(s => (s.authorIds && s.authorIds.includes(a.id)) || s.authorId === a.id).length;
            return `
                <div class="author-card" onclick="navigateRoute('/mach/tac-gia/${a.slug || a.id}')">
                    <div class="author-card-header">
                        <div class="author-avatar author-avatar-initial">${escapeHtml((a.name || 'B').trim().charAt(0))}</div>
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

// --- PUBLICATION ENGINE COMPOSITION CORE ---

function openStoryDetail(slug) {
    if (!machData) return;
    const articleList = machData.articles || machData.stories || [];
    const story = articleList.find(s => s.slug === slug || s.id === slug);
    if (!story) return;

    document.querySelectorAll(".view-section").forEach(s => s.classList.remove("active"));
    document.querySelectorAll(".nav-item-btn").forEach(b => b.classList.remove("active"));
    const storySec = document.getElementById("view_story");
    if (storySec) storySec.classList.add("active");
    const machNav = document.getElementById("nav_mach");
    if (machNav) machNav.classList.add("active");

    updatePageContext(window.location.hash, {
        type: "STORY",
        territory: "mach",
        title: `${story.title} • Mạch`
    });

    renderArticleComposition(story, machData.media || {}, machData.authors || {}, machData.series || {});
    window.scrollTo(0, 0);
}

function renderArticleComposition(article, mediaRegistry, authorsRegistry, seriesRegistry) {
    // 1. Resolve entity context
    const seriesId = (article.seriesIds && article.seriesIds.length > 0) ? article.seriesIds[0] : (article.seriesId || article.seriesSlug);
    const series = (seriesRegistry && seriesId) ? seriesRegistry[seriesId] : null;
    const authorId = (article.authorIds && article.authorIds.length > 0) ? article.authorIds[0] : article.authorId;
    const author = (authorsRegistry && authorId) ? authorsRegistry[authorId] : { name: "Ban Biên Tập", role: "", bio: "", avatarEmoji: "" };
    const isLetter = article.articleType === 'letter' || (series && series.seriesType === 'epistolary');

    // 2. Breadcrumb
    const bc = document.getElementById("storySeriesBreadcrumb");
    if (bc) {
        if (series) {
            bc.innerHTML = `<a onclick="navigateRoute('/mach/series/${series.slug || series.id}')" style="cursor:pointer; text-decoration:underline;">Series: ${series.title}</a>`;
        } else {
            bc.innerHTML = "";
        }
    }

    // 3. Header Kicker Tag & Title
    const tagOrder = document.getElementById("storyTagOrder");
    if (tagOrder) {
        const serTitle = series ? (series.shortTitle || series.title) : "MẠCH";
        const orderLabel = article.seriesOrder ? ` · ${isLetter ? 'LÁ THƯ' : 'BÀI'} ${String(article.seriesOrder).padStart(2, '0')}` : '';
        const sectionLabel = article.section ? ` · ${article.section.toUpperCase()}` : '';
        tagOrder.innerText = `${serTitle.toUpperCase()}${sectionLabel}${orderLabel}`;
    }

    const stTitle = document.getElementById("storyTitle");
    if (stTitle) stTitle.innerText = article.title;

    const authMeta = document.getElementById("storyAuthorMeta");
    if (authMeta) {
        authMeta.innerHTML = `<a onclick="navigateRoute('/mach/tac-gia/${author.slug || author.id}')" style="color:inherit; cursor:pointer; text-decoration:underline;">${author.name}</a>`;
    }

    const dateMeta = document.getElementById("storyDateMeta");
    if (dateMeta) {
        dateMeta.innerText = article.date || (article.publishedAt ? article.publishedAt.slice(0, 10) : "2026");
    }

    // 4. Mentions Bar (using relatedEntities.peopleIds)
    const mentionsBar = document.getElementById("storyMentionsBar");
    if (mentionsBar) {
        const pIds = (article.relatedEntities && article.relatedEntities.peopleIds) ? article.relatedEntities.peopleIds : (article.mentions || []).map(m => m.id);
        if (pIds && pIds.length > 0 && appData && appData.people) {
            const validPeople = pIds.map(pid => appData.people[pid]).filter(Boolean);
            if (validPeople.length > 0) {
                mentionsBar.style.display = "flex";
                mentionsBar.innerHTML = `<span style="font-weight:700; color:var(--text-muted); margin-right:6px;">Nhân vật liên quan:</span>` +
                    validPeople.map(p => `<span class="mention-chip" onclick="openPersonProfile('${p.id}')">${p.name}</span>`).join(" ");
            } else {
                mentionsBar.style.display = "none";
            }
        } else {
            mentionsBar.style.display = "none";
        }
    }

    // 5. Block-by-block Pure Rendering
    const contentBody = document.getElementById("storyContentBody");
    if (contentBody) {
        let html = "";
        
        // Render Hero Media if specified and presentation is image-led or feature
        if (article.heroMediaId && mediaRegistry && mediaRegistry[article.heroMediaId]) {
            if (article.presentationVariant === 'image-led' || article.presentationVariant === 'feature') {
                html += renderMediaBlock({
                    type: 'media',
                    mediaId: article.heroMediaId,
                    layout: 'wide'
                }, mediaRegistry);
            }
        }

        if (article.blocks && Array.isArray(article.blocks) && article.blocks.length > 0) {
            html += renderContentBlocks(article.blocks, mediaRegistry, authorsRegistry, article);
        } else {
            // Fallback for raw markdown string
            let text = article.contentMarkdown || "";
            text = text.replace(/^---[\s\S]*?---\s*/, '').trim();
            text = text.replace(/^#\s+[^\n]+\n+/, '').trim();
            html += `<p>${formatInlineMarkdown(text)}</p>`;
        }

        // Footnotes rendering
        if (article.footnotes && article.footnotes.length > 0) {
            html += `
                <div class="story-footnotes-box">
                    <div class="story-footnotes-title">Chú thích & Ghi chú tư liệu</div>
                    <ol class="story-footnotes-list">
                        ${article.footnotes.map(fn => `<li id="fn-${fn.id}">${fn.html || formatInlineMarkdown(fn.text)}</li>`).join("")}
                    </ol>
                </div>
            `;
        }

        contentBody.innerHTML = html;
    }

    // 6. Author card footer
    const authorCard = document.getElementById("storyAuthorCard");
    if (authorCard) {
        authorCard.innerHTML = `
            <div class="author-card" style="cursor:default;">
                <div class="author-card-header">
                    <div class="author-avatar author-avatar-initial">${escapeHtml((author.name || 'B').trim().charAt(0))}</div>
                    <div>
                        <div class="author-name">${author.name}</div>
                        <div class="author-role">${author.role || ''}</div>
                    </div>
                </div>
                <p class="author-bio">${author.bio || ''}</p>
            </div>
        `;
    }

    // 7. Prev / Next Navigation in Series
    const prevNext = document.getElementById("storyNavPrevNext");
    const articleIds = series ? (series.articleIds || series.stories || []) : [];
    if (prevNext && series && articleIds.length > 0) {
        const curIdx = articleIds.indexOf(article.slug);
        const prevSlug = curIdx > 0 ? articleIds[curIdx - 1] : null;
        const nextSlug = (curIdx >= 0 && curIdx < articleIds.length - 1) ? articleIds[curIdx + 1] : null;
        
        const allArticles = machData.articles || machData.stories || [];
        const prevStory = prevSlug ? allArticles.find(s => s.slug === prevSlug) : null;
        const nextStory = nextSlug ? allArticles.find(s => s.slug === nextSlug) : null;

        const term = isLetter ? 'Thư' : 'Bài';
        let navHtml = "";
        if (prevStory) {
            navHtml += `<button class="story-nav-btn" onclick="navigateRoute('/mach/bai-viet/${prevStory.slug}')">← ${term} trước: ${prevStory.shortTitle || prevStory.title}</button>`;
        } else {
            navHtml += `<div></div>`;
        }
        if (nextStory) {
            navHtml += `<button class="story-nav-btn" onclick="navigateRoute('/mach/bai-viet/${nextStory.slug}')">${term} tiếp: ${nextStory.shortTitle || nextStory.title} →</button>`;
        }
        prevNext.innerHTML = navHtml;
    }
}

function renderContentBlocks(blocks, mediaRegistry, authorsRegistry, article) {
    return blocks.map(block => {
        switch (block.type) {
            case 'lead':
                return `<p class="story-lead">${block.html || formatInlineMarkdown(block.text)}</p>`;
            case 'paragraph': {
                const dropClass = block.hasDropCap ? ' class="drop-cap-p"' : '';
                return `<p${dropClass}>${block.html || formatInlineMarkdown(block.text)}</p>`;
            }
            case 'heading': {
                const lvl = block.level || 2;
                const anchor = block.anchorId ? ` id="${block.anchorId}"` : '';
                return `<h${lvl}${anchor}>${block.html || formatInlineMarkdown(block.text)}</h${lvl}>`;
            }
            case 'media':
                return renderMediaBlock(block, mediaRegistry);
            case 'quote':
                return `
                    <blockquote class="story-quote">
                        <p>${block.html || formatInlineMarkdown(block.text)}</p>
                        ${block.author ? `<cite>— ${formatInlineMarkdown(block.author)}</cite>` : ''}
                    </blockquote>
                `;
            case 'pull_quote':
                return `
                    <div class="story-pull-quote">
                        <blockquote>“${block.html || formatInlineMarkdown(block.text)}”</blockquote>
                        ${block.author ? `<cite>${formatInlineMarkdown(block.author)}</cite>` : ''}
                    </div>
                `;
            case 'divider':
                return `<div class="story-divider story-divider-${block.style || 'section_break'}"><span>❦</span></div>`;
            case 'list': {
                const tag = block.ordered ? 'ol' : 'ul';
                const itemsList = block.itemsHtml && block.itemsHtml.length > 0 ? block.itemsHtml : (block.items || []).map(i => formatInlineMarkdown(i));
                return `<${tag} class="story-list">${itemsList.map(item => `<li>${item}</li>`).join('')}</${tag}>`;
            }
            case 'callout':
                return `
                    <div class="story-callout story-callout-${block.tone || 'heritage'}">
                        ${block.title ? `<h4>${formatInlineMarkdown(block.title)}</h4>` : ''}
                        <p>${block.html || formatInlineMarkdown(block.text)}</p>
                    </div>
                `;
            case 'signature': {
                const author = (authorsRegistry && block.authorId) ? authorsRegistry[block.authorId] : null;
                const authorName = block.authorName || (author ? author.name : '');
                return `
                    <div class="story-signature">
                        <div class="signature-name">${formatInlineMarkdown(authorName)}</div>
                        ${block.location ? `<div class="signature-meta">${block.location}${block.dateStr ? ' · ' + block.dateStr : ''}</div>` : ''}
                    </div>
                `;
            }
            default:
                return block.html ? `<p>${block.html}</p>` : (block.text ? `<p>${formatInlineMarkdown(block.text)}</p>` : '');
        }
    }).join("");
}

function renderMediaBlock(block, mediaRegistry) {
    const media = (mediaRegistry && block.mediaId) ? mediaRegistry[block.mediaId] : null;
    const src = media ? media.src : (block.src || '');
    const alt = block.customAlt || (media ? media.alt : '') || 'Ảnh tư liệu MẠCH';
    const caption = block.customCaption || (media ? media.caption : '');
    const credit = media ? media.credit : '';
    const layoutClass = block.layout ? `story-figure-${block.layout}` : 'story-figure-normal';

    if (!src) return "";

    return `
        <figure class="story-figure ${layoutClass}">
            <picture>
                <img src="${src}" alt="${alt}" loading="lazy" decoding="async">
            </picture>
            ${(caption || credit) ? `
                <figcaption>
                    ${caption ? `<span class="figure-caption-text">${formatInlineMarkdown(caption)}</span>` : ''}
                    ${credit ? `<span class="figure-credit">Ảnh: ${credit}</span>` : ''}
                </figcaption>
            ` : ''}
        </figure>
    `;
}

function formatInlineMarkdown(text) {
    if (!text) return "";
    
    // 1. If text already looks like compiled HTML (contains tags but no raw unparsed markdown symbols), return it safely
    if (/<(strong|em|a|code|del|sup|span)[\s>]/.test(text) && !/(\*\*|__|\~\~|\[\^)/.test(text)) {
        return text;
    }

    // 2. Escape dangerous HTML characters for injection security (Criterion 33)
    let safe = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

    // 3. Protect inline code `code`
    const codeSnippets = [];
    safe = safe.replace(/`([^`]+)`/g, (match, code) => {
        codeSnippets.push(`<code>${code}</code>`);
        return `___CODE_TOKEN_${codeSnippets.length - 1}___`;
    });

    // 4. Resolve Wikilinks [[target|label]] and [[target]]
    const wikilinkMap = {
        "00 — MỤC LỤC": "01-gioi-thieu",
        "01 — GIỚI THIỆU": "01-gioi-thieu",
        "02 — CÂY GIA PHẢ & MẠCH": "02-cay-gia-pha-va-mach",
        "03 — KHI SỰ GẦN GŨI KHÔNG CÒN TỰ NHIÊN": "03-khi-su-gan-gui-khong-con-tu-nhien",
        "04 — TỪ HỆ TƯ TƯỞNG ĐẾN ĐẠO LÝ ĐỜI SỐNG": "04-tu-he-tu-tuong-den-dao-ly-doi-song",
        "05 — NHỮNG KHẾ ƯỚC VÔ HÌNH CỦA DÒNG HỌ": "05-nhung-khe-uoc-vo-hinh-cua-dong-ho",
        "06 — GIỖ VÀ KÝ ỨC GIA ĐÌNH": "06-gio-va-ky-uc-gia-dinh",
        "07 — MỘ TỔ VÀ CẢM THỨC QUAY VỀ": "07-mo-to-va-cam-thuc-quay-ve",
        "08 — ĐÁM CƯỚI NHƯ MỘT DẤU CHUYỂN THẾ HỆ": "08-dam-cuoi-nhu-mot-dau-chuyen-the-he",
        "09 — VÌ SAO CON CHÁU CÒN QUAY VỀ NGÀY TẾT?": "09-vi-sao-con-chau-con-quay-ve-ngay-tet",
        "10 — GIA ĐÌNH HẠT NHÂN VÀ SỰ CHUYỂN ĐỔI CỦA ĐẠI GIA ĐÌNH": "10-gia-dinh-hat-nhan-va-su-chuyen-doi",
        "11 — NHỮNG NGƯỜI KHÔNG CÒN QUAY VỀ NỮA": "11-nhung-nguoi-khong-con-quay-ve-nua",
        "12 — GHI CHÚ & CHÚ GIẢI": "12-ghi-chu-va-chu-giai",
        "Thư gửi Clara - 001": "clara-001",
        "Thư gửi Clara - 002": "clara-002",
        "Thư gửi Clara - 003": "clara-003",
        "Thư gửi Clara - 004": "clara-004",
        "Thư gửi Clara - 005": "clara-005",
        "Thư gửi Clara - 006": "clara-006",
        "Thư gửi Clara, Rina, Tina, Tin và Tito - 007": "clara-007"
    };
    safe = safe.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (match, target, label) => {
        const cleanTarget = target.replace(/\.md$/, "").trim();
        const display = (label || target).trim();
        if (wikilinkMap[cleanTarget]) {
            return `<a href="#/mach/bai-viet/${wikilinkMap[cleanTarget]}" class="mach-internal-link">${display}</a>`;
        }
        return `<span class="mach-ref-tag">${display}</span>`;
    });

    // 5. Footnote references [^N]
    safe = safe.replace(/\[\^(\d+)\]/g, '<sup class="story-footnote-ref"><a href="#fn-$1">[$1]</a></sup>');

    // 6. Links [text](url)
    safe = safe.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

    // 7. Bold + Italic ***text*** or ___text___
    safe = safe.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>');
    safe = safe.replace(/___([^_]+)___/g, '<strong><em>$1</em></strong>');

    // 8. Bold **text** or __text__
    safe = safe.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    safe = safe.replace(/__([^_]+)__/g, '<strong>$1</strong>');

    // 9. Italic *text* or _text_ (handling word boundaries and punctuation)
    safe = safe.replace(/(^|[^\*])\*([^\*\n]+)\*([^\*]|$)/g, '$1<em>$2</em>$3');
    safe = safe.replace(/(^|[^_])_([^_]+)_([^_]|$)/g, '$1<em>$2</em>$3');

    // 10. Strikethrough ~~text~~
    safe = safe.replace(/~~([^~]+)~~/g, '<del>$1</del>');

    // 11. Restore Code snippets
    safe = safe.replace(/___CODE_TOKEN_(\d+)___/g, (match, idx) => codeSnippets[parseInt(idx, 10)]);

    return safe;
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

    updatePageContext(window.location.hash, {
        type: "SERIES",
        territory: "mach",
        title: `${ser.title} • Tuyển Tập Mạch`
    });

    const authId = (ser.authorIds && ser.authorIds.length > 0) ? ser.authorIds[0] : ser.authorId;
    const auth = (machData.authors && authId) ? machData.authors[authId] : { name: "Ban Biên Tập" };
    const isEpistolary = ser.seriesType === 'epistolary';
    const badgeText = isEpistolary ? `CHUỖI THƯ TỪ GIA TỘC` : `TẬP SAN LƯU TRỮ`;
    const headerCard = document.getElementById("seriesHeaderCard");
    const articleIds = ser.articleIds || ser.stories || [];
    if (headerCard) {
        headerCard.innerHTML = `
            <span class="series-card-badge">${badgeText}</span>
            <h1 class="story-title" style="margin-top:10px; margin-bottom:8px;">${ser.title}</h1>
            <div style="font-style:italic; font-size:16px; color:var(--imperial-gold); margin-bottom:16px;">${ser.subtitle || ''}</div>
            <p style="font-size:15px; color:var(--text-main); line-height:1.7;">${ser.description}</p>
            <div style="margin-top:18px; font-size:13.5px; color:var(--text-muted); border-top:1px solid var(--border-subtle); padding-top:12px;">
                Tác giả / Chủ biên: <strong>${auth.name}</strong> • Quy mô: <strong>${articleIds.length} ${isEpistolary ? 'lá thư' : 'bài viết'}</strong>
            </div>
        `;
    }

    const grid = document.getElementById("seriesStoriesGrid");
    if (grid) {
        const allArticles = machData.articles || machData.stories || [];
        const seriesStories = articleIds.map(stSlug => allArticles.find(s => s.slug === stSlug || s.id === stSlug)).filter(Boolean);
        grid.innerHTML = seriesStories.map(s => {
            const isLetter = s.articleType === 'letter' || isEpistolary;
            const serName = ser.shortTitle || ser.title;
            const tagLabel = `${serName.toUpperCase()} · ${isLetter ? 'SỐ' : 'BÀI'} ${String(s.seriesOrder).padStart(2, '0')}`;
            return `
                <div class="story-card" onclick="navigateRoute('/mach/bai-viet/${s.slug}')">
                    <div>
                        <div class="story-card-tag">${tagLabel}</div>
                        <h3 class="story-card-title">${s.title}</h3>
                        <p class="story-card-excerpt">${s.excerpt || s.deckLead || s.subtitle || ''}</p>
                    </div>
                    <div class="story-card-footer">
                        <span>${s.date || (s.publishedAt ? s.publishedAt.slice(0, 10) : '2026')}</span>
                        <span style="color:var(--lacquer-red); font-weight:700;">Đọc ${isLetter ? 'thư' : 'bài'} →</span>
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

    updatePageContext(window.location.hash, {
        type: "AUTHOR",
        territory: "mach",
        title: `${auth.name} • Tác Giả Mạch`
    });

    const headerCard = document.getElementById("authorHeaderCard");
    if (headerCard) {
        headerCard.innerHTML = `
            <div class="author-card-header">
                <div class="author-avatar author-avatar-initial" style="width:64px; height:64px; font-size:28px;">${escapeHtml((auth.name || 'B').trim().charAt(0))}</div>
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
        const allArticles = machData.articles || machData.stories || [];
        const authorStories = allArticles.filter(s => (s.authorIds && s.authorIds.includes(authorId)) || s.authorId === authorId);
        grid.innerHTML = authorStories.map(s => {
            const seriesId = (s.seriesIds && s.seriesIds.length > 0) ? s.seriesIds[0] : (s.seriesId || s.seriesSlug);
            const ser = (machData.series && seriesId) ? machData.series[seriesId] : { title: "Tự sự" };
            return `
                <div class="story-card" onclick="navigateRoute('/mach/bai-viet/${s.slug}')">
                    <div>
                        <div class="story-card-tag">${ser.title}</div>
                        <h3 class="story-card-title">${s.title}</h3>
                        <p class="story-card-excerpt">${s.excerpt || s.deckLead || s.subtitle || ''}</p>
                    </div>
                    <div class="story-card-footer">
                        <span>${s.date || (s.publishedAt ? s.publishedAt.slice(0, 10) : '2026')}</span>
                        <span style="color:var(--lacquer-red); font-weight:700;">Đọc bài →</span>
                    </div>
                </div>
            `;
        }).join("");
    }
    window.scrollTo(0, 0);
}

// Override Global Search to index normalized entities (People, Articles, Series, Authors, Topics)
handleGlobalSearch = function(e) {
    const q = e.target.value.toLowerCase().trim();
    const dd = document.getElementById("globalSearchDropdown");
    if (!dd) return;
    if (!q) { dd.style.display = "none"; return; }

    const results = [];
    
    // 1. People
    Object.values(appData.people).forEach(p => {
        if (p.name.toLowerCase().includes(q) || (p.fsid && p.fsid.toLowerCase().includes(q))) {
            const gMeta = getGenerationMeta(p.id);
            results.push({ type: 'PERSON', id: p.id, title: p.name, sub: `${gMeta.label} • FSID: ${p.fsid || p.id}` });
        }
    });

    // 2. Articles
    const allArticles = (machData && (machData.articles || machData.stories)) ? (machData.articles || machData.stories) : [];
    allArticles.forEach(s => {
        if (s.title.toLowerCase().includes(q) || (s.excerpt && s.excerpt.toLowerCase().includes(q)) || (s.deckLead && s.deckLead.toLowerCase().includes(q)) || (s.subtitle && s.subtitle.toLowerCase().includes(q))) {
            const isLetter = s.articleType === 'letter' || (s.seriesIds && s.seriesIds.includes("thu-gui-clara"));
            const prefix = isLetter ? "Thư gửi Clara" : "Tập san MẠCH";
            results.push({ type: 'STORY', id: s.slug, title: s.title, sub: `${prefix} • ${s.date || (s.publishedAt ? s.publishedAt.slice(0, 10) : '')}` });
        }
    });

    // 3. Series
    if (machData && machData.series) {
        Object.values(machData.series).forEach(ser => {
            if (ser.title.toLowerCase().includes(q) || ser.description.toLowerCase().includes(q)) {
                results.push({ type: 'SERIES', id: ser.slug || ser.id, title: ser.title, sub: `Chuỗi Series MẠCH` });
            }
        });
    }

    // 4. Authors
    if (machData && machData.authors) {
        Object.values(machData.authors).forEach(a => {
            if (a.name.toLowerCase().includes(q) || a.role.toLowerCase().includes(q)) {
                results.push({ type: 'AUTHOR', id: a.slug || a.id, title: a.name, sub: `Tác giả: ${a.role}` });
            }
        });
    }

    if (results.length === 0) {
        dd.innerHTML = `<div style="padding:12px; color:var(--text-muted); text-align:center;">Không tìm thấy kết quả</div>`;
    } else {
        dd.innerHTML = results.slice(0, 12).map(r => `
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
    else if (type === 'SERIES') navigateRoute(`/mach/series/${id}`);
    else if (type === 'AUTHOR') navigateRoute(`/mach/tac-gia/${id}`);
    else if (type === 'MEMORY') navigateRoute('/gia-pha/ky-uc');
};

// --- TƯ LIỆU LANDING (STRUCTURAL ENTRY / PLACEHOLDER) ---
function renderTuLieuModule() {
    const wrapper = document.querySelector(".tu-lieu-wrapper");
    if (!wrapper) return;
    const invite = document.querySelector(".tu-lieu-invite");
    if (invite) {
        const peopleCount = (appData.stats && appData.stats.individuals) || Object.keys(appData.people).length || 0;
        const storiesCount = (machData && (machData.articles || machData.stories)) ? (machData.articles || machData.stories).length : 0;
        invite.innerHTML = `Kho tư liệu đang được xây dựng. Trong khi chờ đợi, hãy khám phá <a onclick="navigateRoute('/mach')" class="inline-link">${storiesCount} bài tự sự trong Mạch</a> và <a onclick="navigateRoute('/gia-pha/nhan-vat')" class="inline-link">${peopleCount} hồ sơ nhân vật trong Gia Phả</a>.`;
    }
}

// --- TÌM KIẾM TOÀN CỤC / SEARCH RESULTS PAGE ---
function runSearchPage() {
    const inp = document.getElementById("searchPageInput");
    const q = inp ? inp.value.toLowerCase().trim() : "";
    const container = document.getElementById("searchPageResults");
    if (!container) return;
    if (!q) {
        container.innerHTML = `<div style="padding:32px; text-align:center; color:var(--text-muted);">Nhập từ khóa để bắt đầu tìm kiếm.</div>`;
        return;
    }

    const results = [];

    Object.values(appData.people || {}).forEach(p => {
        if ((p.name && p.name.toLowerCase().includes(q)) || (p.fsid && p.fsid.toLowerCase().includes(q))) {
            const gMeta = getGenerationMeta(p.id);
            results.push({ type: 'PERSON', id: p.id, icon: '', title: p.name, sub: `${gMeta.label} • FSID: ${p.fsid || p.id}`, cat: 'Nhân vật' });
        }
    });

    (appData.memories || []).forEach(m => {
        if ((m.title && m.title.toLowerCase().includes(q)) || (m.story && m.story.toLowerCase().includes(q))) {
            results.push({ type: 'MEMORY', id: m.id, icon: '', title: m.title, sub: `Ký ức gia tộc • ${m.personName || ''}`, cat: 'Ký ức' });
        }
    });

    const allArticles = (machData && (machData.articles || machData.stories)) ? (machData.articles || machData.stories) : [];
    allArticles.forEach(s => {
        if ((s.title && s.title.toLowerCase().includes(q)) || (s.excerpt && s.excerpt.toLowerCase().includes(q)) || (s.deckLead && s.deckLead.toLowerCase().includes(q)) || (s.subtitle && s.subtitle.toLowerCase().includes(q))) {
            const isLetter = s.articleType === 'letter' || (s.seriesIds && s.seriesIds.includes("thu-gui-clara"));
            const prefix = isLetter ? "Thư gửi Clara" : "Tập san MẠCH";
            results.push({ type: 'STORY', id: s.slug, icon: '', title: s.title, sub: `${prefix} • ${s.date || (s.publishedAt ? s.publishedAt.slice(0, 10) : '')}`, cat: 'Bài viết' });
        }
    });

    if (machData && machData.series) {
        Object.values(machData.series).forEach(ser => {
            if (ser.title.toLowerCase().includes(q) || (ser.description && ser.description.toLowerCase().includes(q))) {
                results.push({ type: 'SERIES', id: ser.slug || ser.id, icon: '', title: ser.title, sub: 'Chuỗi tuyển tập MẠCH', cat: 'Tuyển tập' });
            }
        });
    }

    if (machData && machData.authors) {
        Object.values(machData.authors).forEach(a => {
            if (a.name.toLowerCase().includes(q) || (a.role && a.role.toLowerCase().includes(q))) {
                results.push({ type: 'AUTHOR', id: a.slug || a.id, icon: '', title: a.name, sub: `Tác giả: ${a.role || ''}`, cat: 'Tác giả' });
            }
        });
    }

    if (results.length === 0) {
        container.innerHTML = `<div style="padding:40px; text-align:center; color:var(--text-muted);">Không tìm thấy kết quả cho "<strong>${escapeHtml(q)}</strong>".</div>`;
        return;
    }

    const byCat = {};
    results.forEach(r => { (byCat[r.cat] = byCat[r.cat] || []).push(r); });

    container.innerHTML = `<div style="font-size:13px; color:var(--text-muted); margin-bottom:16px;">Tìm thấy <strong>${results.length}</strong> kết quả cho "<strong>${escapeHtml(q)}</strong>"</div>` +
        Object.keys(byCat).map(cat => `
            <div class="search-page-group">
                <div class="section-divider-title"><span>${cat} (${byCat[cat].length})</span></div>
                <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:12px;">
                    ${byCat[cat].map(r => `
                        <div class="search-result-card" onclick="selectSearchPageResult('${r.type}', '${r.id}')">
                            ${r.icon ? `<div class="search-result-icon">${r.icon}</div>` : ''}
                            <div>
                                <div class="search-result-title">${escapeHtml(r.title)}</div>
                                <div class="search-result-sub">${escapeHtml(r.sub)}</div>
                            </div>
                        </div>
                    `).join("")}
                </div>
            </div>
        `).join("");
}

function handleSearchPageInput(e) {
    if (e.key === 'Enter') runSearchPage();
    else if (e.target.value && e.target.value.trim()) runSearchPage();
}

function selectSearchPageResult(type, id) {
    if (type === 'PERSON') openPersonProfile(id);
    else if (type === 'STORY') navigateRoute(`/mach/bai-viet/${id}`);
    else if (type === 'SERIES') navigateRoute(`/mach/series/${id}`);
    else if (type === 'AUTHOR') navigateRoute(`/mach/tac-gia/${id}`);
    else if (type === 'MEMORY') navigateRoute('/gia-pha/ky-uc');
}

// --- ARTICLE FONT SIZE CONTROL ---
let currentArticleFontLevel = 0;
const fontScaleSteps = [1.0, 1.25, 1.5, 1.75, 2.0];

function changeArticleFontSize(delta) {
    currentArticleFontLevel += delta;
    if (currentArticleFontLevel < 0) currentArticleFontLevel = 0;
    if (currentArticleFontLevel >= fontScaleSteps.length) currentArticleFontLevel = fontScaleSteps.length - 1;
    applyArticleFontSize();
}

function resetArticleFontSize() {
    currentArticleFontLevel = 0;
    applyArticleFontSize();
}

function applyArticleFontSize() {
    const scale = fontScaleSteps[currentArticleFontLevel];
    document.documentElement.style.setProperty('--text-scale', scale);
    
    // Attempt to persist in session storage
    try {
        sessionStorage.setItem('article_font_level', currentArticleFontLevel);
    } catch (e) {}
}

// Restore on load if available
window.addEventListener('DOMContentLoaded', () => {
    try {
        const saved = sessionStorage.getItem('article_font_level');
        if (saved !== null) {
            currentArticleFontLevel = parseInt(saved, 10) || 0;
            applyArticleFontSize();
        }
    } catch (e) {}
});
try {
    const saved = sessionStorage.getItem('article_font_level');
    if (saved !== null) {
        currentArticleFontLevel = parseInt(saved, 10) || 0;
        applyArticleFontSize();
    }
} catch (e) {}
