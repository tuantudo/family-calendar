import { state, saveState } from './mockData.js';

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

// Routing
window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', init);

function init() {
    updateBadge();
    router();
    
    document.getElementById('typeahead-backdrop').addEventListener('click', closeTypeahead);
    document.getElementById('btn-close-modal').addEventListener('click', closePreview);
    
    typeaheadInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const results = state.people.filter(p => p.name.toLowerCase().includes(term));
        renderTypeaheadResults(results);
    });
}

function updateBadge() {
    const newCount = state.inbox.filter(i => i.status === 'NEW').length;
    badgeInbox.textContent = newCount;
    badgeInbox.style.display = newCount > 0 ? 'inline-block' : 'none';
}

function router() {
    const hash = window.location.hash.slice(1) || '/';
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    
    const baseRoute = '/' + (hash.split('/')[1] || '');
    const activeNav = document.querySelector(`.nav-item[href="#${baseRoute}"]`) || document.querySelector('.nav-item[href="#/"]');
    if (activeNav) activeNav.classList.add('active');

    if (hash === '/') renderDashboard();
    else if (hash === '/inbox') renderInboxList();
    else if (hash.startsWith('/inbox/')) renderInboxDetail(hash.split('/')[2]);
    else if (hash === '/people') renderPeopleList();
    else if (hash.startsWith('/people/')) renderPersonEditor(hash.split('/')[2]);
    else if (hash === '/stories') renderStoriesList();
    else if (hash.startsWith('/stories/')) renderStoryEditor(hash.split('/')[2]);
    else mainView.innerHTML = `<div class="view-header"><h1>Chưa có sẵn</h1></div><div class="view-content"><p>Route chưa được implement trong V1 Prototype.</p></div>`;
}

// ---------------- DASHBOARD ----------------
function renderDashboard() {
    const draftStories = state.stories.filter(s => s.status === 'DRAFT').length;
    const newInbox = state.inbox.filter(i => i.status === 'NEW').length;

    mainView.innerHTML = `
        <div class="view-header"><h1>Dashboard</h1></div>
        <div class="view-content">
            <div class="grid">
                <a href="#/inbox" class="card">
                    <h3>Cần xử lý</h3>
                    <div class="metric">${newInbox}</div>
                    <div class="desc">Báo cáo & Đóng góp mới trong Hộp thư</div>
                </a>
                <a href="#/stories" class="card">
                    <h3>Bản nháp</h3>
                    <div class="metric">${draftStories}</div>
                    <div class="desc">Mạch đang soạn thảo chờ duyệt</div>
                </a>
                <a href="#/people" class="card">
                    <h3>Hồ sơ</h3>
                    <div class="metric">${state.people.length}</div>
                    <div class="desc">Nhân sự trong phả hệ</div>
                </a>
            </div>
        </div>
    `;
}

// ---------------- INBOX ----------------
function renderInboxList() {
    const rows = state.inbox.map(item => `
        <tr onclick="window.location.hash = '/inbox/${item.id}'">
            <td><span class="status ${item.status.toLowerCase()}">${item.status}</span></td>
            <td><strong>${item.type}</strong></td>
            <td>${item.title}</td>
            <td>${item.sender}</td>
            <td>${item.date}</td>
        </tr>
    `).join('');

    mainView.innerHTML = `
        <div class="view-header"><h1>Hộp Thư Cộng Đồng</h1></div>
        <div class="view-content">
            <table class="data-table">
                <thead><tr><th>Trạng thái</th><th>Loại</th><th>Tiêu đề</th><th>Người gửi</th><th>Ngày</th></tr></thead>
                <tbody>${rows}</tbody>
            </table>
        </div>
    `;
}

function renderInboxDetail(id) {
    const item = state.inbox.find(i => i.id === id);
    if (!item) return;

    const personContext = item.linkedPersonId ? state.people.find(p => p.id === item.linkedPersonId) : null;
    
    let contextHtml = '';
    if (personContext) {
        contextHtml = `
            <div class="edge-panel">
                <div class="edge-header">Hồ sơ liên quan</div>
                <div class="edge-content">
                    <strong>${personContext.name} (${personContext.birthYear})</strong>
                    <br><br>
                    <button class="btn" onclick="window.open('#/people/${personContext.id}', '_blank')">Mở hồ sơ kiểm tra &raquo;</button>
                </div>
            </div>
        `;
    }

    window.resolveInbox = () => {
        item.status = 'RESOLVED';
        saveState();
        updateBadge();
        window.location.hash = '/inbox';
    };

    window.convertToStory = () => {
        const newId = 's' + Date.now();
        state.stories.push({
            id: newId, title: item.title, author: item.sender, status: 'DRAFT', updatedAt: new Date().toISOString().split('T')[0], content: item.content, linkedPeople: [], images: []
        });
        item.status = 'RESOLVED';
        saveState();
        updateBadge();
        window.location.hash = '/stories/' + newId;
    };

    mainView.innerHTML = `
        <div class="view-header">
            <h1>Chi tiết Hộp thư</h1>
            <button class="btn" onclick="window.history.back()">Quay lại</button>
        </div>
        <div class="view-content">
            <div class="inbox-split">
                <div class="inbox-item">
                    <div class="inbox-meta">
                        <h2>${item.title}</h2>
                        <div class="info"><strong>Loại:</strong> ${item.type}</div>
                        <div class="info"><strong>Người gửi:</strong> ${item.sender} (${item.date})</div>
                        <div class="info"><strong>Trạng thái:</strong> <span class="status ${item.status.toLowerCase()}">${item.status}</span></div>
                    </div>
                    <div class="inbox-content">${item.content}</div>
                    
                    <div class="inbox-actions">
                        ${item.status === 'NEW' ? `<button class="btn btn-primary" onclick="resolveInbox()">Đánh dấu Đã xử lý (Resolve)</button>` : ''}
                        ${item.status === 'NEW' && item.type === 'Kỷ niệm' ? `<button class="btn" onclick="convertToStory()">Chuyển thành Bản nháp Mạch</button>` : ''}
                    </div>
                </div>
                <div class="inbox-item" style="background: transparent; border: none; padding: 0;">
                    ${contextHtml}
                </div>
            </div>
        </div>
    `;
}

// ---------------- PEOPLE ----------------
function renderPeopleList() {
    const rows = state.people.map(p => `
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

function renderPersonEditor(id) {
    let p = state.people.find(x => x.id === id);
    let isNew = false;
    if (!p) {
        isNew = true;
        p = { id: 'p' + Date.now(), name: '', birthYear: '', deathYear: '', gender: 'Nam', status: 'DRAFT', notes: '', parents: [], spouses: [], children: [] };
    }

    window.savePerson = () => {
        p.name = document.getElementById('p-name').value;
        p.birthYear = document.getElementById('p-birth').value;
        p.deathYear = document.getElementById('p-death').value;
        p.gender = document.getElementById('p-gender').value;
        p.notes = document.getElementById('p-notes').value;
        if (isNew) state.people.push(p);
        saveState();
        renderPersonEditor(p.id); // reload
    };

    window.publishPerson = () => {
        p.status = 'PUBLISHED';
        window.savePerson();
    };

    window.removeEdge = (type, targetId) => {
        p[type] = p[type].filter(x => x !== targetId);
        saveState();
        renderPersonEditor(p.id);
    };

    window.openTypeahead = (type, title) => {
        typeaheadTitle.textContent = title;
        typeaheadInput.value = '';
        currentTypeaheadCallback = (selectedId) => {
            if (!p[type].includes(selectedId)) {
                p[type].push(selectedId);
                saveState();
                renderPersonEditor(p.id);
            }
        };
        renderTypeaheadResults(state.people);
        typeaheadOverlay.classList.remove('hidden');
        typeaheadInput.focus();
    };

    const renderEdgeChips = (type) => {
        if (!p[type] || p[type].length === 0) return `<span class="empty-text">Chưa có liên kết</span>`;
        return p[type].map(targetId => {
            const target = state.people.find(x => x.id === targetId);
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
                    <div class="edge-panel">
                        <div class="edge-header">Cha Mẹ <button class="btn-add-edge" onclick="openTypeahead('parents', 'Chọn Cha/Mẹ')">+ Nối</button></div>
                        <div class="edge-content">${renderEdgeChips('parents')}</div>
                    </div>
                    <div class="edge-panel">
                        <div class="edge-header">Vợ / Chồng <button class="btn-add-edge" onclick="openTypeahead('spouses', 'Chọn Vợ/Chồng')">+ Nối</button></div>
                        <div class="edge-content">${renderEdgeChips('spouses')}</div>
                    </div>
                    <div class="edge-panel">
                        <div class="edge-header">Con cái <button class="btn-add-edge" onclick="openTypeahead('children', 'Chọn Con cái')">+ Nối</button></div>
                        <div class="edge-content">${renderEdgeChips('children')}</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ---------------- STORIES ----------------
function renderStoriesList() {
    const rows = state.stories.map(s => `
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

function renderStoryEditor(id) {
    let s = state.stories.find(x => x.id === id);
    let isNew = false;
    if (!s) {
        isNew = true;
        s = { id: 's' + Date.now(), title: '', author: 'Ban Biên Tập', status: 'DRAFT', updatedAt: new Date().toISOString().split('T')[0], content: '', linkedPeople: [], images: [] };
    }

    window.saveStory = () => {
        s.title = document.getElementById('s-title').value;
        s.author = document.getElementById('s-author').value;
        s.content = document.getElementById('s-content').value;
        s.updatedAt = new Date().toISOString().split('T')[0];
        if (isNew) state.stories.push(s);
        saveState();
        renderStoryEditor(s.id); 
    };

    window.publishStory = () => {
        s.status = 'PUBLISHED';
        window.saveStory();
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

    window.removeStoryEdge = (targetId) => {
        s.linkedPeople = s.linkedPeople.filter(x => x !== targetId);
        saveState();
        renderStoryEditor(s.id);
    };

    window.openStoryTypeahead = () => {
        typeaheadTitle.textContent = 'Gắn nhân vật vào bài viết';
        typeaheadInput.value = '';
        currentTypeaheadCallback = (selectedId) => {
            if (!s.linkedPeople.includes(selectedId)) {
                s.linkedPeople.push(selectedId);
                saveState();
                renderStoryEditor(s.id);
            }
        };
        renderTypeaheadResults(state.people);
        typeaheadOverlay.classList.remove('hidden');
        typeaheadInput.focus();
    };

    const renderEdgeChips = () => {
        if (!s.linkedPeople || s.linkedPeople.length === 0) return `<span class="empty-text">Chưa có liên kết</span>`;
        return s.linkedPeople.map(targetId => {
            const target = state.people.find(x => x.id === targetId);
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
                    <div class="edge-panel">
                        <div class="edge-header">Nhân vật trong bài <button class="btn-add-edge" onclick="openStoryTypeahead()">+ Tag</button></div>
                        <div class="edge-content">${renderEdgeChips()}</div>
                    </div>
                    <div class="edge-panel">
                        <div class="edge-header">Hình ảnh đính kèm</div>
                        <div class="edge-content">
                            <span class="empty-text">Chưa có ảnh (Kéo thả vào đây)</span>
                        </div>
                    </div>
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
