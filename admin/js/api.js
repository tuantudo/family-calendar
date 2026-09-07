const API_BASE = 'https://api.giatoctrantrongthu.com/api';

export async function getPeople() {
    return fetch(`${API_BASE}/people`).then(r => r.json());
}
export async function getPerson(id) {
    return fetch(`${API_BASE}/people/${id}`).then(r => r.json());
}
export async function savePerson(person) {
    return fetch(`${API_BASE}/people`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(person)
    }).then(r => r.json());
}

export async function getStories() {
    return fetch(`${API_BASE}/stories`).then(r => r.json());
}
export async function saveStory(story) {
    return fetch(`${API_BASE}/stories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(story)
    }).then(r => r.json());
}

export async function getEdges() {
    return fetch(`${API_BASE}/edges`).then(r => r.json());
}
export async function addEdge(source_id, target_id, edge_type) {
    return fetch(`${API_BASE}/edges`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source_id, target_id, edge_type })
    }).then(r => r.json());
}
export async function removeEdge(source_id, target_id, edge_type) {
    return fetch(`${API_BASE}/edges`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source_id, target_id, edge_type })
    }).then(r => r.json());
}

export async function getEvents() {
    return fetch(`${API_BASE}/events`).then(r => r.json());
}
export async function saveEvent(event) {
    return fetch(`${API_BASE}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
    }).then(r => r.json());
}
