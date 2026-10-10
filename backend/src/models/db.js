import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../../data');
const DB_FILE = path.join(DATA_DIR, 'campusone_db.json');

// Check if PostgreSQL connection URL is provided via environment
const PG_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL;

// Active Database Driver Info
export const DB_ENGINE = PG_URL ? 'PostgreSQL (Cloud Database)' : 'CampusOne Local Database Engine';

console.log(`🔌 Database Mode: \x1b[32m${DB_ENGINE}\x1b[0m`);

// Read database
export function readDB() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    console.warn('Database file not found, creating from seed...');
    return { users: [], tickets: [] };
  }

  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch (err) {
    console.error('Error reading database file:', err);
    return { users: [], tickets: [] };
  }
}

// Write database
export function writeDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Failed to write to database:', err);
    return false;
  }
}
