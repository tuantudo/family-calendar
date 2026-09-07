const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, 'family_archive.db');
const db = new sqlite3.Database(dbPath);

// Initialize DB schema
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS people (
        id TEXT PRIMARY KEY,
        name TEXT,
        birthYear TEXT,
        deathYear TEXT,
        gender TEXT,
        notes TEXT,
        status TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS stories (
        id TEXT PRIMARY KEY,
        title TEXT,
        author TEXT,
        content TEXT,
        status TEXT,
        updatedAt TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS edges (
        source_id TEXT,
        target_id TEXT,
        edge_type TEXT,
        PRIMARY KEY (source_id, target_id, edge_type)
    )`);
});

// Helper for promise-based queries
const all = (q, params = []) => new Promise((res, rej) => db.all(q, params, (err, rows) => err ? rej(err) : res(rows)));
const get = (q, params = []) => new Promise((res, rej) => db.get(q, params, (err, row) => err ? rej(err) : res(row)));
const run = (q, params = []) => new Promise((res, rej) => db.run(q, params, (err) => err ? rej(err) : res()));

// ------------------- ADMIN CRUD -------------------
app.get('/api/people', async (req, res) => {
    res.json(await all("SELECT * FROM people"));
});
app.post('/api/people', async (req, res) => {
    const { id, name, birthYear, deathYear, gender, notes, status } = req.body;
    await run("INSERT OR REPLACE INTO people VALUES (?, ?, ?, ?, ?, ?, ?)", [id, name, birthYear, deathYear, gender, notes, status]);
    res.json({ success: true });
});
app.get('/api/stories', async (req, res) => {
    res.json(await all("SELECT * FROM stories"));
});
app.post('/api/stories', async (req, res) => {
    const { id, title, author, content, status, updatedAt } = req.body;
    await run("INSERT OR REPLACE INTO stories VALUES (?, ?, ?, ?, ?, ?)", [id, title, author, content, status, updatedAt]);
    res.json({ success: true });
});
app.get('/api/edges', async (req, res) => {
    res.json(await all("SELECT * FROM edges"));
});
app.post('/api/edges', async (req, res) => {
    const { source_id, target_id, edge_type } = req.body;
    await run("INSERT OR IGNORE INTO edges VALUES (?, ?, ?)", [source_id, target_id, edge_type]);
    res.json({ success: true });
});
app.delete('/api/edges', async (req, res) => {
    const { source_id, target_id, edge_type } = req.body;
    await run("DELETE FROM edges WHERE source_id = ? AND target_id = ? AND edge_type = ?", [source_id, target_id, edge_type]);
    res.json({ success: true });
});

// ------------------- PUBLIC WEB ADAPTERS -------------------
app.get('/api/genealogy.json', async (req, res) => {
    const people = await all("SELECT * FROM people WHERE status = 'PUBLISHED'");
    const edges = await all("SELECT * FROM edges");
    
    let publicPeople = {};
    let publicFamilies = {};
    
    // Group families. A family is created for each SPOUSE edge or PARENT grouping.
    // For simplicity in vertical slice, we map edges to a pseudo-family format.
    let familyCounter = 1;
    people.forEach(p => {
        const spouses = edges.filter(e => (e.source_id === p.id || e.target_id === p.id) && e.edge_type === 'SPOUSE').map(e => e.source_id === p.id ? e.target_id : e.source_id);
        const children = edges.filter(e => e.source_id === p.id && e.edge_type === 'PARENT').map(e => e.target_id);
        const parents = edges.filter(e => e.target_id === p.id && e.edge_type === 'PARENT').map(e => e.source_id);
        
        publicPeople[p.id] = {
            id: p.id,
            name: p.name,
            sex: p.gender === 'Nam' ? 'M' : 'F',
            birth: { date: p.birthYear },
            death: { date: p.deathYear },
            parents: parents,
            fams: [] // we'll populate if they have kids/spouse
        };
        
        if (spouses.length > 0 || children.length > 0) {
            let famId = '@F' + p.id + '@';
            publicFamilies[famId] = {
                id: famId,
                husb: p.gender === 'Nam' ? p.id : (spouses.length > 0 ? spouses[0] : null),
                wife: p.gender === 'Nữ' ? p.id : (spouses.length > 0 ? spouses[0] : null),
                children: children
            };
            publicPeople[p.id].fams.push(famId);
        }
    });

    res.json({
        rootAnchor: people.length > 0 ? people[0].id : '',
        people: publicPeople,
        families: publicFamilies,
        stats: { individuals: people.length, families: Object.keys(publicFamilies).length, memories: 0 }
    });
});

app.get('/api/mach.json', async (req, res) => {
    const stories = await all("SELECT * FROM stories WHERE status = 'PUBLISHED'");
    const edges = await all("SELECT * FROM edges WHERE edge_type = 'MENTION'");
    
    let publicStories = stories.map(s => {
        let linked = edges.filter(e => e.source_id === s.id).map(e => e.target_id);
        return {
            id: s.id,
            slug: s.id,
            title: s.title,
            authorId: "tuan", 
            publishedAt: s.updatedAt,
            excerpt: s.content.substring(0, 100) + '...',
            content: `<p>${s.content.replace(/\n/g, '<br>')}</p>`,
            linkedPeople: linked
        };
    });

    res.json({
        authors: { "tuan": { id: "tuan", name: "Tác giả Gia đình" } },
        stories: publicStories
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API Server running on port ${port}`));
