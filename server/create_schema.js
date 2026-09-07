const mysql = require('mysql2/promise');
require('dotenv').config();

async function run() {
    const db = await mysql.createPool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 1,
        queueLimit: 0
    });
    
    await db.execute(`CREATE TABLE IF NOT EXISTS events (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(255),
        date VARCHAR(50),
        description TEXT
    )`);

    await db.execute(`CREATE TABLE IF NOT EXISTS images (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(255),
        path VARCHAR(255),
        uploadedAt VARCHAR(50)
    )`);
    
    await db.execute(`INSERT IGNORE INTO events (id, title, date, description) VALUES 
        ('e1', 'Giỗ tổ', '2026-08-15', 'Lễ giỗ tổ hàng năm')`);
    
    await db.execute(`INSERT IGNORE INTO images (id, title, path, uploadedAt) VALUES 
        ('i1', 'Ảnh gia đình', '/volume1/web/web_images/family.jpg', '2026-09-01')`);
        
    console.log("Schema updated.");
    process.exit(0);
}
run();
