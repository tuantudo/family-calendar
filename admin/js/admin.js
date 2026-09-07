import * as API from './api.js';

const mainView = document.getElementById('main-view');
const badgeInbox = document.getElementById('badge-inbox');

// Modal Elements
const typeaheadOverlay = document.getElementById('typeahead-overlay');
const typeaheadInput = document.getElementById('typeahead-input');
const typeaheadResults = document.getElementById('typeahead-results');
const typeaheadTitle = document.getElementById('typeahead-title');
const previewModal = document.getElementById('preview-modal');
const previewContent = document.getElementById('preview-content');

let currentTypeaheadCallback = null;
let allPeopleCache = []; // used for typeahead

// Routing
window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', init);

async function init() {
    allPeopleCache = await API.getPeople();
    updateBadge();
    router();
    
    document.getElementById('typeahead-backdrop').addEventListener('click', closeTypeahead);
    document.getElementById('btn-close-modal').addEventListener('click', closePreview);
    
    typeaheadInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const results = allPeopleCache.filter(p => p.name.toLowerCase().includes(term));
        renderTypeaheadResults(results);
    });
}

function updateBadge() {
    badgeInbox.style.display = 'none'; // mock inbox out of DB for now
}

async function router() {
    const hash = window.location.hash.slice(1) || '/';
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    
    const baseRoute = '/' + (hash.split('/')[1] || '');
    const activeNav = document.querySelector(`.nav-item[href="#${baseRoute}"]`) || document.querySelector('.nav-item[href="#/"]');
    if (activeNav) activeNav.classList.add('active');

    if (hash === '/') renderDashboard();
    else if (hash === '/people') renderPeopleList();
    else if (hash.startsWith('/people/')) renderPersonEditor(hash.split('/')[2]);
    else if (hash === '/stories') renderStoriesList();
    else if (hash.startsWith('/stories/')) renderStoryEditor(hash.split('/')[2]);
    else if (hash === '/events' || hash === '/eventsgiat') renderEventsList();
    else if (hash.startsWith('/events/')) renderEventEditor(hash.split('/')[2]);
    else if (hash.startsWith('/eventsgiat/')) renderEventEditor(hash.split('/')[2]);
    else mainView.innerHTML = `<div class="view-header"><h1>Chưa có sẵn</h1></div><div class="view-content"><p>Tính năng chưa tích hợp DB thật.</p></div>`;
}

// ---------------- DASHBOARD ----------------
async function renderDashboard() {
    const stories = await API.getStories();
    const people = await API.getPeople();
    const draftStories = stories.filter(s => s.status === 'DRAFT').length;

    mainView.innerHTML = `
        <div class="view-header"><h1>Dashboard</h1></div>
        <div class="view-content">
            <div class="grid">
                <a href="#/stories" class="card">
                    <h3>Bản nháp</h3>
                    <div class="metric">${draftStories}</div>
                    <div class="desc">Mạch đang soạn thảo</div>
                </a>
                <a href="#/people" class="card">
                    <h3>Hồ sơ</h3>
                    <div class="metric">${people.length}</div>
                    <div class="desc">Nhân sự trong phả hệ</div>
                </a>
            </div>
        </div>
    `;
}

// ---------------- PEOPLE ----------------
async function renderPeopleList() {
    const people = await API.getPeople();
    const rows = people.map(p => `
        <tr onclick="window.location.hash = '/people/${p.id}'">
            <td>${p.name}</td>
            <td>${p.birthYear || '?'} - ${p.deathYear || (p.gender === 'Nam' ? 'Hiện tại' : 'Hiện tại')}</td>
            <td>${p.gender}</td>
            <td><span class="status ${p.status.toLowerCase()}">${p.status}</span></td>
        </tr>
    `).join('');

    mainView.innerHTML = `
        <div class="view-header">
            <h1>Nhân sự (Hồ sơ)</h1>
            <button class="btn btn-primary" onclick="window.location.hash = '/people/new'">+ Thêm Người Mới</button>
        </div>
        <div class="view-content">
            <table class="data-table">
                <thead><tr><th>Họ tên</th><th>Năm sinh - mất</th><th>Giới tính</th><th>Trạng thái</th></tr></thead>
                <tbody>${rows}</tbody>
            </table>
        </div>
    `;
}

async function renderPersonEditor(id) {
    let p;
    let isNew = false;
    if (id === 'new') {
        isNew = true;
        p = { id: 'p' + Date.now(), name: '', birthYear: '', deathYear: '', gender: 'Nam', status: 'DRAFT', notes: '' };
    } else {
        const people = await API.getPeople();
        p = people.find(x => x.id === id);
    }
    
    const edges = await API.getEdges();
    const parents = edges.filter(e => e.target_id === p.id && e.edge_type === 'PARENT').map(e => e.source_id);
    const children = edges.filter(e => e.source_id === p.id && e.edge_type === 'PARENT').map(e => e.target_id);
    const spouses = edges.filter(e => (e.source_id === p.id || e.target_id === p.id) && e.edge_type === 'SPOUSE')
                        .map(e => e.source_id === p.id ? e.target_id : e.source_id);

    window.savePerson = async () => {
        p.name = document.getElementById('p-name').value;
        p.birthYear = document.getElementById('p-birth').value;
        p.deathYear = document.getElementById('p-death').value;
        p.gender = document.getElementById('p-gender').value;
        p.notes = document.getElementById('p-notes').value;
        await API.savePerson(p);
        allPeopleCache = await API.getPeople(); // update cache
        renderPersonEditor(p.id); 
    };

    window.publishPerson = async () => {
        p.status = 'PUBLISHED';
        await window.savePerson();
    };

    window.removeEdge = async (type, targetId) => {
        if (type === 'parents') await API.removeEdge(targetId, p.id, 'PARENT');
        if (type === 'children') await API.removeEdge(p.id, targetId, 'PARENT');
        if (type === 'spouses') {
            await API.removeEdge(p.id, targetId, 'SPOUSE');
            await API.removeEdge(targetId, p.id, 'SPOUSE');
        }
        renderPersonEditor(p.id);
    };

    window.openTypeahead = (type, title) => {
        typeaheadTitle.textContent = title;
        typeaheadInput.value = '';
        currentTypeaheadCallback = async (selectedId) => {
            if (type === 'parents') await API.addEdge(selectedId, p.id, 'PARENT');
            if (type === 'children') await API.addEdge(p.id, selectedId, 'PARENT');
            if (type === 'spouses') await API.addEdge(p.id, selectedId, 'SPOUSE'); // Only 1 way needed if query checks both, but we can do it
            renderPersonEditor(p.id);
        };
        renderTypeaheadResults(allPeopleCache);
        typeaheadOverlay.classList.remove('hidden');
        typeaheadInput.focus();
    };

    const renderEdgeChips = (arr, type) => {
        if (!arr || arr.length === 0) return `<span class="empty-text">Chưa có liên kết</span>`;
        return arr.map(targetId => {
            const target = allPeopleCache.find(x => x.id === targetId);
            return `<div class="edge-chip">${target ? target.name : 'Unknown'} <span class="unlink" onclick="removeEdge('${type}', '${targetId}')">×</span></div>`;
        }).join('');
    };

    mainView.innerHTML = `
        <div class="view-header">
            <h1>${isNew ? 'Thêm Người Mới' : 'Sửa Hồ Sơ'} <span class="status ${p.status.toLowerCase()}">${p.status}</span></h1>
            <div>
                <button class="btn" onclick="savePerson()">Lưu Nháp</button>
                ${p.status !== 'PUBLISHED' ? `<button class="btn btn-primary" onclick="publishPerson()">Xuất Bản</button>` : ''}
            </div>
        </div>
        <div class="view-content">
            <div class="inbox-split">
                <!-- Left: Info -->
                <div style="flex: 1;">
                    <div class="form-group">
                        <label class="form-label">Họ và tên</label>
                        <input type="text" class="form-control" id="p-name" value="${p.name}">
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Năm sinh</label>
                            <input type="text" class="form-control" id="p-birth" value="${p.birthYear || ''}">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Năm mất</label>
                            <input type="text" class="form-control" id="p-death" value="${p.deathYear || ''}">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Giới tính</label>
                            <select class="form-control" id="p-gender">
                                <option ${p.gender === 'Nam' ? 'selected' : ''}>Nam</option>
                                <option ${p.gender === 'Nữ' ? 'selected' : ''}>Nữ</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Ghi chú / Tiểu sử ngắn</label>
                        <textarea class="form-control" id="p-notes" style="min-height: 100px;">${p.notes || ''}</textarea>
                    </div>
                </div>
                
                <!-- Right: Relational Graph Edges -->
                <div style="flex: 1;">
                    ${isNew ? '<p>Hãy lưu bản nháp trước khi thêm quan hệ gia đình.</p>' : `
                    <div class="edge-panel">
                        <div class="edge-header">Cha Mẹ <button class="btn-add-edge" onclick="openTypeahead('parents', 'Chọn Cha/Mẹ')">+ Nối</button></div>
                        <div class="edge-content">${renderEdgeChips(parents, 'parents')}</div>
                    </div>
                    <div class="edge-panel">
                        <div class="edge-header">Vợ / Chồng <button class="btn-add-edge" onclick="openTypeahead('spouses', 'Chọn Vợ/Chồng')">+ Nối</button></div>
                        <div class="edge-content">${renderEdgeChips(spouses, 'spouses')}</div>
                    </div>
                    <div class="edge-panel">
                        <div class="edge-header">Con cái <button class="btn-add-edge" onclick="openTypeahead('children', 'Chọn Con cái')">+ Nối</button></div>
                        <div class="edge-content">${renderEdgeChips(children, 'children')}</div>
                    </div>
                    `}
                </div>
            </div>
        </div>
    `;
}

// ---------------- STORIES ----------------
async function renderStoriesList() {
    const stories = await API.getStories();
    const rows = stories.map(s => `
        <tr onclick="window.location.hash = '/stories/${s.id}'">
            <td><strong>${s.title}</strong></td>
            <td>${s.author}</td>
            <td>${s.updatedAt}</td>
            <td><span class="status ${s.status.toLowerCase()}">${s.status}</span></td>
        </tr>
    `).join('');

    mainView.innerHTML = `
        <div class="view-header">
            <h1>Mạch (Bài viết)</h1>
            <button class="btn btn-primary" onclick="window.location.hash = '/stories/new'">+ Viết Bài Mới</button>
        </div>
        <div class="view-content">
            <table class="data-table">
                <thead><tr><th>Tiêu đề</th><th>Tác giả</th><th>Cập nhật</th><th>Trạng thái</th></tr></thead>
                <tbody>${rows}</tbody>
            </table>
        </div>
    `;
}

async function renderStoryEditor(id) {
    let s;
    let isNew = false;
    if (id === 'new') {
        isNew = true;
        s = { id: 's' + Date.now(), title: '', author: 'Ban Biên Tập', status: 'DRAFT', updatedAt: new Date().toISOString().split('T')[0], content: '' };
    } else {
        const stories = await API.getStories();
        s = stories.find(x => x.id === id);
    }
    
    const edges = await API.getEdges();
    const linkedPeople = edges.filter(e => e.source_id === s.id && e.edge_type === 'MENTION').map(e => e.target_id);

    window.saveStory = async () => {
        s.title = document.getElementById('s-title').value;
        s.author = document.getElementById('s-author').value;
        s.content = document.getElementById('s-content').value;
        s.updatedAt = new Date().toISOString().split('T')[0];
        await API.saveStory(s);
        renderStoryEditor(s.id); 
    };

    window.publishStory = async () => {
        s.status = 'PUBLISHED';
        await window.saveStory();
    };

    window.previewStory = () => {
        const tempTitle = document.getElementById('s-title').value;
        const tempContent = document.getElementById('s-content').value;
        const tempAuthor = document.getElementById('s-author').value;
        
        previewContent.innerHTML = `
            <div class="preview-title">${tempTitle}</div>
            <div class="preview-meta">Viết bởi ${tempAuthor} • ${s.updatedAt}</div>
            <div class="preview-text">${tempContent}</div>
        `;
        previewModal.classList.remove('hidden');
    };

    window.removeStoryEdge = async (targetId) => {
        await API.removeEdge(s.id, targetId, 'MENTION');
        renderStoryEditor(s.id);
    };

    window.openStoryTypeahead = () => {
        typeaheadTitle.textContent = 'Gắn nhân vật vào bài viết';
        typeaheadInput.value = '';
        currentTypeaheadCallback = async (selectedId) => {
            if (!linkedPeople.includes(selectedId)) {
                await API.addEdge(s.id, selectedId, 'MENTION');
                renderStoryEditor(s.id);
            }
        };
        renderTypeaheadResults(allPeopleCache);
        typeaheadOverlay.classList.remove('hidden');
        typeaheadInput.focus();
    };

    const renderEdgeChips = () => {
        if (!linkedPeople || linkedPeople.length === 0) return `<span class="empty-text">Chưa có liên kết</span>`;
        return linkedPeople.map(targetId => {
            const target = allPeopleCache.find(x => x.id === targetId);
            return `<div class="edge-chip">${target ? target.name : 'Unknown'} <span class="unlink" onclick="removeStoryEdge('${targetId}')">×</span></div>`;
        }).join('');
    };

    mainView.innerHTML = `
        <div class="view-header">
            <h1>Sửa Bài Viết <span class="status ${s.status.toLowerCase()}">${s.status}</span></h1>
            <div>
                <button class="btn" onclick="previewStory()">Preview Public Web</button>
                <button class="btn" onclick="saveStory()">Lưu Nháp</button>
                ${s.status !== 'PUBLISHED' ? `<button class="btn btn-primary" onclick="publishStory()">Xuất Bản</button>` : ''}
            </div>
        </div>
        <div class="view-content">
            <div class="inbox-split">
                <!-- Left: Content -->
                <div style="flex: 2;">
                    <input type="text" class="title-input" id="s-title" value="${s.title}" placeholder="Nhập tiêu đề mạch...">
                    <div class="form-group" style="max-width: 300px;">
                        <label class="form-label">Tác giả (Nguồn)</label>
                        <input type="text" class="form-control" id="s-author" value="${s.author}">
                    </div>
                    <div class="form-group">
                        <textarea class="form-control" id="s-content" placeholder="Nội dung câu chuyện...">${s.content}</textarea>
                    </div>
                </div>
                
                <!-- Right: Metadata & Links -->
                <div style="flex: 1;">
                    ${isNew ? '<p>Lưu nháp trước khi tag nhân vật.</p>' : `
                    <div class="edge-panel">
                        <div class="edge-header">Nhân vật trong bài <button class="btn-add-edge" onclick="openStoryTypeahead()">+ Tag</button></div>
                        <div class="edge-content">${renderEdgeChips()}</div>
                    </div>
                    `}
                </div>
            </div>
        </div>
    `;
}

// ---------------- SHARED: TYPEAHEAD & MODAL ----------------
function renderTypeaheadResults(results) {
    typeaheadResults.innerHTML = results.map(p => `
        <li onclick="selectTypeahead('${p.id}')">
            <strong>${p.name}</strong>
            <span class="desc">${p.birthYear || '?'} - ${p.deathYear || '?'}</span>
        </li>
    `).join('');
}

window.selectTypeahead = (id) => {
    if (currentTypeaheadCallback) currentTypeaheadCallback(id);
    closeTypeahead();
}

function closeTypeahead() {
    typeaheadOverlay.classList.add('hidden');
    currentTypeaheadCallback = null;
}

function closePreview() {
    previewModal.classList.add('hidden');
}
