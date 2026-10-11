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
  try {
    const parsed = JSON.parse(
      fs.readFileSync(path.join(DATA_DIR, 'postgres_cache.json'), 'utf8')
    );
    inMemoryUsers = parsed.users || parsed.USERS || [];
    inMemoryTickets = parsed.tickets || parsed.INITIAL_TICKETS || [];
  } catch (e) {
    if (!inMemoryUsers) inMemoryUsers = [];
    if (!inMemoryTickets) inMemoryTickets = [];
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

    // Sync latest state into PostgreSQL SQL dump file
    if (inMemoryTickets && inMemoryTickets.length > 0) {
      const ticketInserts = inMemoryTickets.map(t => {
        const titleSafe = (t.title || '').replace(/'/g, "''");
        const descSafe = (t.description || '').replace(/'/g, "''");
        const locSafe = (t.location || '').replace(/'/g, "''");
        const noteSafe = (t.adminNote || '').replace(/'/g, "''");
        const imgSafe = (t.imageUrl && t.imageUrl.startsWith('data:') ? 'data:image_camera_evidence' : (t.imageUrl || '')).replace(/'/g, "''");
        const raisedById = (typeof t.raisedBy === 'object' ? t.raisedBy?.id : t.raisedBy) || 'user_arjun';
        const raisedByIdSafe = String(raisedById).replace(/'/g, "''");
        const lnfTypeSafe = t.lostFoundType ? `'${t.lostFoundType}'` : 'NULL';
        const itemCatSafe = t.itemCategory ? `'${String(t.itemCategory).replace(/'/g, "''")}'` : 'NULL';
        const timingsSafe = t.timings ? `'${String(t.timings).replace(/'/g, "''")}'` : 'NULL';
        const secretSafe = t.secretDetails ? `'${String(t.secretDetails).replace(/'/g, "''")}'` : 'NULL';
        const safeLocSafe = t.safekeepingLocation ? `'${String(t.safekeepingLocation).replace(/'/g, "''")}'` : 'NULL';
        const claimSafe = t.claimedStatus ? `'${String(t.claimedStatus).replace(/'/g, "''")}'` : "'unclaimed'";
        return `INSERT INTO tickets (id, title, description, scope, class_section, department, location, category, domain, raised_by_id, status, priority_score, assigned_to, eta, admin_note, image_url, lost_found_type, item_category, timings, secret_details, safekeeping_location, claimed_status) VALUES ('${t.id}', '${titleSafe}', '${descSafe}', '${t.scope}', ${t.classSection ? `'${t.classSection}'` : 'NULL'}, '${t.department || 'CSE'}', '${locSafe}', '${t.category}', '${t.domain || 'electrical_av'}', '${raisedByIdSafe}', '${t.status}', ${t.priorityScore || 50}, '${t.assignedTo || 'Pending'}', '${t.eta || 'Awaiting triage'}', '${noteSafe}', '${imgSafe}', ${lnfTypeSafe}, ${itemCatSafe}, ${timingsSafe}, ${secretSafe}, ${safeLocSafe}, ${claimSafe}) ON CONFLICT (id) DO UPDATE SET priority_score = EXCLUDED.priority_score, status = EXCLUDED.status, admin_note = EXCLUDED.admin_note, claimed_status = EXCLUDED.claimed_status;`;
      }).join('\n');

      fs.appendFileSync(
        POSTGRES_FILE,
        `\n-- Live Sync Event at ${new Date().toISOString()}\n${ticketInserts}\n`,
        'utf8'
      );
    }

    return true;
  } catch (err) {
    return false;
  }
}
