export const state = {
    people: [
        { id: 'p1', name: 'Trần Trọng Thu', birthYear: 1915, deathYear: 1995, gender: 'Nam', status: 'PUBLISHED', notes: 'Gốc tộc', parents: [], spouses: [], children: ['p2'] },
        { id: 'p2', name: 'Trần Quốc Anh', birthYear: 1942, deathYear: 2010, gender: 'Nam', status: 'PUBLISHED', notes: '', parents: ['p1'], spouses: [], children: ['p3'] },
        { id: 'p3', name: 'Trần Hoàng Nam', birthYear: 1970, deathYear: null, gender: 'Nam', status: 'PUBLISHED', notes: '', parents: ['p2'], spouses: [], children: [] },
        { id: 'p4', name: 'Lê Thị Mai', birthYear: 1918, deathYear: 1998, gender: 'Nữ', status: 'PUBLISHED', notes: 'Vợ ông Thu', parents: [], spouses: ['p1'], children: ['p2'] }
    ],
    stories: [
        { id: 's1', title: 'Ký ức về người thầy năm xưa', author: 'Quốc Anh', status: 'PUBLISHED', updatedAt: '2026-09-01', content: 'Cha tôi cả đời chỉ bận tâm đến sách vở...', linkedPeople: ['p1', 'p2'], images: [] },
        { id: 's2', title: 'Bản nháp kỷ yếu', author: 'Hoàng Nam', status: 'DRAFT', updatedAt: '2026-09-06', content: 'Đang viết dở...', linkedPeople: [], images: [] }
    ],
    inbox: [
        { id: 'i1', type: 'Báo cáo sai sót', title: 'Ngày mất của ông Quốc Anh bị sai, phải là 2012', sender: 'Trần D', date: '2026-09-07', status: 'NEW', linkedPersonId: 'p2', content: 'Tôi là cháu, tôi nhớ rõ cụ mất năm 2012 chứ không phải 2010.' },
        { id: 'i2', type: 'Kỷ niệm', title: 'Hồi ức ngày Tết', sender: 'Trần E', date: '2026-09-06', status: 'NEW', linkedPersonId: null, content: 'Tết xưa ông nội hay gói bánh chưng...' }
    ],
    images: [],
    
};

// Simple local storage sync to persist across reloads during prototyping
const saved = localStorage.getItem('adminState');
if (saved) {
    Object.assign(state, JSON.parse(saved));
}
export function saveState() {
    localStorage.setItem('adminState', JSON.stringify(state));
}
