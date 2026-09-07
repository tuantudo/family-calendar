require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/assets/images', express.static(path.join(__dirname, 'assets/images')));

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



app.get('/api/events', async (req, res) => {
    try {
        res.json(await allQuery("SELECT * FROM calendar_events ORDER BY dtstart DESC"));
    } catch(e) {
        res.status(500).json({error: e.message});
    }
});
app.post('/api/events', async (req, res) => {
    try {
        const { uid, summary, dtstart, dtend, description, location, calendar_type, event_type, status } = req.body;
        const query = useMariaDB ? 
            "REPLACE INTO calendar_events (uid, summary, dtstart, dtend, description, location, calendar_type, event_type, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)" :
            "INSERT OR REPLACE INTO calendar_events (uid, summary, dtstart, dtend, description, location, calendar_type, event_type, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        await runQuery(query, [uid, summary, dtstart, dtend, description, location, calendar_type || 'CAL_04_FAMILY_MILESTONES', event_type || 'milestone', status || 'PUBLISHED']);
        res.json({ success: true });
    } catch(e) {
        res.status(500).json({error: e.message});
    }
});

// ------------------- PUBLIC WEB ADAPTERS -------------------
app.get('/api/genealogy.json', async (req, res) => {
    try {
        const peopleRows = await allQuery("SELECT * FROM people WHERE status = 'PUBLISHED'");
        const familyRows = await allQuery("SELECT * FROM families");
        const memoryRows = await allQuery("SELECT * FROM memories");
        const timelineRows = await allQuery("SELECT * FROM timeline");

        let publicPeople = {};
        for (let r of peopleRows) {
            let p = r.payload ? (typeof r.payload === 'string' ? JSON.parse(r.payload) : r.payload) : {};
            p.id = r.id;
            p.name = r.name;
            publicPeople[r.id] = p;
        }

        let publicFamilies = {};
        for (let r of familyRows) {
            let f = r.payload ? (typeof r.payload === 'string' ? JSON.parse(r.payload) : r.payload) : {};
            f.id = r.id;
            publicFamilies[r.id] = f;
        }

        let publicMemories = memoryRows.map(r => {
            let m = r.payload ? (typeof r.payload === 'string' ? JSON.parse(r.payload) : r.payload) : {};
            if (m.file && !m.file.startsWith('http')) m.file = 'https://api.giatoctrantrongthu.com/' + m.file;
            if (m.path && !m.path.startsWith('http')) m.path = 'https://api.giatoctrantrongthu.com/' + m.path;
            m.id = r.id;
            return m;
        });

        let publicTimeline = timelineRows.map(r => ({
            id: r.id,
            date: r.date,
            title: r.title,
            description: r.description,
            icon: r.icon
        }));

        res.json({
            rootAnchor: peopleRows.length > 0 ? (publicPeople['@I1@'] ? '@I1@' : peopleRows[0].id) : '',
            people: publicPeople,
            families: publicFamilies,
            memories: publicMemories,
            timeline: publicTimeline,
            stats: { individuals: peopleRows.length, families: familyRows.length, memories: memoryRows.length }
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/mach.json', async (req, res) => {
    try {
        const storyRows = await allQuery("SELECT * FROM stories WHERE status = 'PUBLISHED'");
        const authorRows = await allQuery("SELECT * FROM authors");
        const seriesRows = await allQuery("SELECT * FROM series");

        let publicAuthors = {};
        for (let r of authorRows) {
            let a = r.payload ? (typeof r.payload === 'string' ? JSON.parse(r.payload) : r.payload) : {};
            a.id = r.id;
            publicAuthors[r.id] = a;
        }

        let publicSeries = {};
        for (let r of seriesRows) {
            let s = r.payload ? (typeof r.payload === 'string' ? JSON.parse(r.payload) : r.payload) : {};
            if (s.coverImage && !s.coverImage.startsWith('http')) s.coverImage = 'https://api.giatoctrantrongthu.com/' + s.coverImage;
            if (s.src && !s.src.startsWith('http')) s.src = 'https://api.giatoctrantrongthu.com/' + s.src;
            if (s.thumb && !s.thumb.startsWith('http')) s.thumb = 'https://api.giatoctrantrongthu.com/' + s.thumb;
            if (s.medium && !s.medium.startsWith('http')) s.medium = 'https://api.giatoctrantrongthu.com/' + s.medium;
            if (s.large && !s.large.startsWith('http')) s.large = 'https://api.giatoctrantrongthu.com/' + s.large;
            if (s.content) s.content = s.content.replace(/assets\/images\//g, 'https://api.giatoctrantrongthu.com/assets/images/');
            s.id = r.id;
            publicSeries[r.id] = s;
        }

        let publicStories = storyRows.map(r => {
            let s = r.payload ? (typeof r.payload === 'string' ? JSON.parse(r.payload) : r.payload) : {};
            if (s.coverImage && !s.coverImage.startsWith('http')) s.coverImage = 'https://api.giatoctrantrongthu.com/' + s.coverImage;
            if (s.src && !s.src.startsWith('http')) s.src = 'https://api.giatoctrantrongthu.com/' + s.src;
            if (s.thumb && !s.thumb.startsWith('http')) s.thumb = 'https://api.giatoctrantrongthu.com/' + s.thumb;
            if (s.medium && !s.medium.startsWith('http')) s.medium = 'https://api.giatoctrantrongthu.com/' + s.medium;
            if (s.large && !s.large.startsWith('http')) s.large = 'https://api.giatoctrantrongthu.com/' + s.large;
            if (s.content) s.content = s.content.replace(/assets\/images\//g, 'https://api.giatoctrantrongthu.com/assets/images/');
            s.id = r.id;
            s.slug = r.id;
            if (s.linkedPeople && typeof s.linkedPeople === 'string') s.linkedPeople = JSON.parse(s.linkedPeople);
            return s;
        });

        res.json({
            authors: publicAuthors,
            series: publicSeries,
            stories: publicStories
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/media.json', async (req, res) => {
    try {
        const mediaRows = await allQuery("SELECT * FROM media");
        let publicMedia = {};
        for (let r of mediaRows) {
            let m = r.payload ? (typeof r.payload === 'string' ? JSON.parse(r.payload) : r.payload) : {};
            if (m.file && !m.file.startsWith('http')) m.file = 'https://api.giatoctrantrongthu.com/' + m.file;
            if (m.path && !m.path.startsWith('http')) m.path = 'https://api.giatoctrantrongthu.com/' + m.path;
            m.id = r.id;
            publicMedia[r.id] = m;
        }
        res.json(publicMedia);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/person_media.json', async (req, res) => {
    try {
        const pmRows = await allQuery("SELECT * FROM person_media");
        let publicPM = pmRows.map(r => ({
            relationId: r.relation_id,
            personId: r.person_id,
            assetId: r.asset_id,
            role: r.role,
            isPrimary: r.is_primary === 1,
            status: "MATCHED"
        }));
        res.json(publicPM);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/calendars/:filename', async (req, res) => {
    try {
        const { filename } = req.params;
        const calType = filename.replace('.ics', '');
        const evRows = await allQuery("SELECT * FROM calendar_events WHERE calendar_type = ? AND status = 'PUBLISHED'", [calType]);
        if (evRows.length === 0) return res.status(404).send('Not found');
        
        let ics = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Gia Toc//Calendar//VI\n';
        for (let r of evRows) {
            ics += 'BEGIN:VEVENT\n';
            ics += 'UID:' + r.uid + '\n';
            ics += 'SUMMARY:' + r.summary + '\n';
            ics += 'DTSTART:' + r.dtstart + '\n';
            if (r.description) ics += 'DESCRIPTION:' + r.description.replace(/\n/g, '\\n') + '\n';
            ics += 'END:VEVENT\n';
        }
        ics += 'END:VCALENDAR';
        res.set('Content-Type', 'text/calendar');
        res.send(ics);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

const port = process.env.PORT || 3000;
app.listen(port, '127.0.0.1', () => console.log(`API Server running on port ${port}`));
