require('dotenv').config();
const mysql = require('mysql2/promise');

async function run() {
    const db = await mysql.createPool({
        host: process.env.DB_HOST || '127.0.0.1',
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || 'family_archive'
    });

    const stmts = [
        // Extend calendar_events with admin fields
        `ALTER TABLE calendar_events ADD COLUMN status VARCHAR(20) DEFAULT 'PUBLISHED'`,
        `ALTER TABLE calendar_events ADD COLUMN event_type VARCHAR(50) DEFAULT 'milestone'`,
        `ALTER TABLE calendar_events ADD COLUMN location TEXT`,
        `ALTER TABLE calendar_events ADD COLUMN dtend VARCHAR(50)`,
        `ALTER TABLE calendar_events ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`,
        `ALTER TABLE calendar_events ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`,
        // Convert uid to allow longer values
        `ALTER TABLE calendar_events MODIFY COLUMN uid VARCHAR(512)`,
        // Update existing records to have PUBLISHED status
        `UPDATE calendar_events SET status = 'PUBLISHED' WHERE status IS NULL`,
        `UPDATE calendar_events SET event_type = calendar_type WHERE event_type IS NULL OR event_type = 'milestone'`
    ];

    for (let stmt of stmts) {
        try {
            await db.execute(stmt);
            console.log('OK:', stmt.substring(0, 60));
        } catch(e) {
            if (e.code === 'ER_DUP_FIELDNAME') {
                console.log('SKIP (already exists):', stmt.substring(0, 60));
            } else {
                console.log('ERR:', e.message, '|', stmt.substring(0, 60));
            }
        }
    }
    console.log('Schema migration complete');
    process.exit(0);
}
run().catch(console.error);
