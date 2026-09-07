require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const useMariaDB = process.env.DB_CLIENT === 'mysql';
let db, runQuery, allQuery, getQuery;

async function initDB() {
    if (useMariaDB) {
        console.log("Using MariaDB connection...");
        const mysql = require('mysql2/promise');
        db = await mysql.createPool({
            host: process.env.DB_HOST || '127.0.0.1',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME || 'family_archive',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        runQuery = async (q, params) => {
            const [result] = await db.execute(q, params);
            return result;
        };
        allQuery = async (q, params) => {
            const [rows] = await db.execute(q, params);
            return rows;
        };
        getQuery = async (q, params) => {
            const [rows] = await db.execute(q, params);
            return rows[0];
        };

        // Create tables for MariaDB
        await runQuery(`CREATE TABLE IF NOT EXISTS people (
            id VARCHAR(255) PRIMARY KEY,
            name VARCHAR(255),
            birthYear VARCHAR(50),
            deathYear VARCHAR(50),
            gender VARCHAR(50),
            notes TEXT,
            status VARCHAR(50)
        )`);

        await runQuery(`CREATE TABLE IF NOT EXISTS stories (
            id VARCHAR(255) PRIMARY KEY,
            title VARCHAR(255),
            author VARCHAR(255),
            content LONGTEXT,
            status VARCHAR(50),
            updatedAt VARCHAR(50)
        )`);

        await runQuery(`CREATE TABLE IF NOT EXISTS edges (
            source_id VARCHAR(255),
            target_id VARCHAR(255),
            edge_type VARCHAR(50),
            PRIMARY KEY (source_id, target_id, edge_type)
        )`);

        // Check and seed
        const rows = await allQuery("SELECT COUNT(*) AS count FROM people");
        if (rows[0].count === 0) {
            console.log("Seeding MariaDB...");
            await runQuery(`INSERT INTO people (id, name, birthYear, deathYear, gender, notes, status) VALUES 
                ('p1', 'Trần Trọng Thu', '1915', '1995', 'Nam', 'Gốc tộc', 'PUBLISHED'),
                ('p2', 'Trần Quốc Anh', '1942', '2010', 'Nam', 'Trưởng nam', 'PUBLISHED'),
                ('p3', 'Trần Hoàng Nam', '1970', '', 'Nam', 'Cháu đích tôn', 'PUBLISHED')
            `);
            await runQuery(`INSERT INTO stories (id, title, author, content, status, updatedAt) VALUES 
                ('s1', 'Ký ức về người thầy năm xưa', 'Quốc Anh', 'Cha tôi cả đời chỉ bận tâm đến sách vở...', 'PUBLISHED', '2026-09-01')
            `);
            await runQuery(`INSERT IGNORE INTO edges (source_id, target_id, edge_type) VALUES 
                ('p2', 'p1', 'PARENT'),
                ('p3', 'p2', 'PARENT'),
                ('s1', 'p1', 'MENTION')
            `);
        }
    } else {
        console.log("Using local SQLite fallback...");
        const sqlite3 = require('sqlite3').verbose();
        const dbPath = path.join(__dirname, 'family_archive.db');
        db = new sqlite3.Database(dbPath);

        runQuery = (q, params = []) => new Promise((res, rej) => db.run(q, params, (err) => err ? rej(err) : res()));
        allQuery = (q, params = []) => new Promise((res, rej) => db.all(q, params, (err, rows) => err ? rej(err) : res(rows)));
        getQuery = (q, params = []) => new Promise((res, rej) => db.get(q, params, (err, row) => err ? rej(err) : res(row)));
        
        await runQuery(`CREATE TABLE IF NOT EXISTS people (
            id TEXT PRIMARY KEY, name TEXT, birthYear TEXT, deathYear TEXT, gender TEXT, notes TEXT, status TEXT
        )`);
        await runQuery(`CREATE TABLE IF NOT EXISTS stories (
            id TEXT PRIMARY KEY, title TEXT, author TEXT, content TEXT, status TEXT, updatedAt TEXT
        )`);
        await runQuery(`CREATE TABLE IF NOT EXISTS edges (
            source_id TEXT, target_id TEXT, edge_type TEXT, PRIMARY KEY (source_id, target_id, edge_type)
        )`);
    }
}

initDB().catch(console.error);

// ------------------- ADMIN CRUD -------------------
app.get('/api/people', async (req, res) => {
    res.json(await allQuery("SELECT * FROM people"));
});
app.post('/api/people', async (req, res) => {
    const { id, name, birthYear, deathYear, gender, notes, status } = req.body;
    const query = useMariaDB ? 
        "REPLACE INTO people (id, name, birthYear, deathYear, gender, notes, status) VALUES (?, ?, ?, ?, ?, ?, ?)" :
        "INSERT OR REPLACE INTO people VALUES (?, ?, ?, ?, ?, ?, ?)";
    await runQuery(query, [id, name, birthYear, deathYear, gender, notes, status]);
    res.json({ success: true });
});

app.get('/api/stories', async (req, res) => {
    res.json(await allQuery("SELECT * FROM stories"));
});
app.post('/api/stories', async (req, res) => {
    const { id, title, author, content, status, updatedAt } = req.body;
    const query = useMariaDB ? 
        "REPLACE INTO stories (id, title, author, content, status, updatedAt) VALUES (?, ?, ?, ?, ?, ?)" :
        "INSERT OR REPLACE INTO stories VALUES (?, ?, ?, ?, ?, ?)";
    await runQuery(query, [id, title, author, content, status, updatedAt]);
    res.json({ success: true });
});

app.get('/api/edges', async (req, res) => {
    res.json(await allQuery("SELECT * FROM edges"));
});
app.post('/api/edges', async (req, res) => {
    const { source_id, target_id, edge_type } = req.body;
    const query = useMariaDB ? 
        "INSERT IGNORE INTO edges (source_id, target_id, edge_type) VALUES (?, ?, ?)" :
        "INSERT OR IGNORE INTO edges VALUES (?, ?, ?)";
    await runQuery(query, [source_id, target_id, edge_type]);
    res.json({ success: true });
});
app.delete('/api/edges', async (req, res) => {
    const { source_id, target_id, edge_type } = req.body;
    await runQuery("DELETE FROM edges WHERE source_id = ? AND target_id = ? AND edge_type = ?", [source_id, target_id, edge_type]);
    res.json({ success: true });
});

// ------------------- PUBLIC WEB ADAPTERS -------------------
app.get('/api/genealogy.json', async (req, res) => {
    const people = await allQuery("SELECT * FROM people WHERE status = 'PUBLISHED'");
    const edges = await allQuery("SELECT * FROM edges");
    
    let publicPeople = {};
    let publicFamilies = {};
    
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
            fams: [] 
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
    const stories = await allQuery("SELECT * FROM stories WHERE status = 'PUBLISHED'");
    const edges = await allQuery("SELECT * FROM edges WHERE edge_type = 'MENTION'");
    
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
