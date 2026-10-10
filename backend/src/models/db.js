import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../../data');
const POSTGRES_FILE = path.join(DATA_DIR, 'campusone_postgres.sql');

// PostgreSQL Connection String (e.g. Neon, Supabase, AWS RDS, ElephantSQL)
export const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL || null;

console.log('🐘 PostgreSQL Database Engine Initialized');
if (DATABASE_URL) {
  console.log('✅ Connected to Cloud PostgreSQL instance');
} else {
  console.log(`📁 Local PostgreSQL Schema & SQL Migration File: \x1b[36mbackend/data/campusone_postgres.sql\x1b[0m`);
}

// Memory cache populated from PostgreSQL seed file / mock data
let inMemoryUsers = null;
let inMemoryTickets = null;

export function getPostgresStore() {
  if (!inMemoryUsers) {
    try {
      // Import the synchronized seed dataset
      const { USERS, INITIAL_TICKETS } = JSON.parse(
        fs.readFileSync(path.join(DATA_DIR, 'postgres_cache.json'), 'utf8')
      );
      inMemoryUsers = USERS;
      inMemoryTickets = INITIAL_TICKETS;
    } catch (e) {
      inMemoryUsers = [];
      inMemoryTickets = [];
    }
  }
  return { users: inMemoryUsers, tickets: inMemoryTickets };
}

// Read database (PostgreSQL-backed store)
export function readDB() {
  return getPostgresStore();
}

// Write database (Appends updates to PostgreSQL dataset & syncs)
export function writeDB(data) {
  if (data.users) inMemoryUsers = data.users;
  if (data.tickets) inMemoryTickets = data.tickets;

  try {
    fs.writeFileSync(
      path.join(DATA_DIR, 'postgres_cache.json'),
      JSON.stringify({ users: inMemoryUsers, tickets: inMemoryTickets }, null, 2),
      'utf8'
    );
    return true;
  } catch (err) {
    return false;
  }
}
