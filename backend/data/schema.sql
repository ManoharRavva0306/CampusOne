-- =========================================================================
-- CampusOne CMRS (Campus Maintenance & Resolution System) Database Schema
-- Compatible with PostgreSQL 13+, Neon, Supabase, AWS RDS, & ElephantSQL
-- =========================================================================

-- Enable UUID extension if supported
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -------------------------------------------------------------------------
-- 1. USERS TABLE
-- -------------------------------------------------------------------------
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS ticket_votes CASCADE;
DROP TABLE IF EXISTS tickets CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    role VARCHAR(32) NOT NULL CHECK (role IN ('student', 'faculty_advisor', 'domain_admin', 'central_admin')),
    roll_no VARCHAR(32) UNIQUE NOT NULL,
    email VARCHAR(128) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    department VARCHAR(64) NOT NULL,
    class_section VARCHAR(64),
    hostel VARCHAR(64),
    room VARCHAR(16),
    designation VARCHAR(128),
    domain VARCHAR(64),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexing for fast authentication lookup
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_roll_no ON users(roll_no);
CREATE INDEX idx_users_role ON users(role);

-- -------------------------------------------------------------------------
-- 2. TICKETS TABLE
-- -------------------------------------------------------------------------
CREATE TABLE tickets (
    id VARCHAR(32) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    scope VARCHAR(32) NOT NULL CHECK (scope IN ('class', 'room', 'department', 'hostel_generic', 'campus')),
    class_section VARCHAR(64),
    department VARCHAR(64) NOT NULL,
    hostel VARCHAR(64),
    room VARCHAR(16),
    location VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL,
    domain VARCHAR(64) NOT NULL,
    raised_by_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(32) NOT NULL DEFAULT 'reported' 
        CHECK (status IN ('reported', 'acknowledged', 'in_progress', 'awaiting_verification', 'resolved')),
    priority_score INTEGER DEFAULT 50 CHECK (priority_score BETWEEN 0 AND 100),
    advisor_notified BOOLEAN DEFAULT FALSE,
    advisor_endorsed BOOLEAN DEFAULT FALSE,
    assigned_to VARCHAR(128) DEFAULT 'Pending Assignment',
    eta VARCHAR(128) DEFAULT 'Awaiting triage',
    admin_note TEXT DEFAULT '',
    image_url TEXT
);

CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_scope ON tickets(scope);
CREATE INDEX idx_tickets_domain ON tickets(domain);
CREATE INDEX idx_tickets_raised_by ON tickets(raised_by_id);

-- -------------------------------------------------------------------------
-- 3. TICKET VOTES TABLE (Upvotes / Downvotes by Students)
-- -------------------------------------------------------------------------
CREATE TABLE ticket_votes (
    ticket_id VARCHAR(32) NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vote_type VARCHAR(8) NOT NULL CHECK (vote_type IN ('up', 'down')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (ticket_id, user_id)
);

-- -------------------------------------------------------------------------
-- 4. TICKET COMMENTS TABLE
-- -------------------------------------------------------------------------
CREATE TABLE comments (
    id VARCHAR(64) PRIMARY KEY,
    ticket_id VARCHAR(32) NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    is_official BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_comments_ticket_id ON comments(ticket_id);

-- =========================================================================
-- INITIAL SEED DATA (Pre-Seeded Institutional Accounts)
-- =========================================================================

-- Insert Users
INSERT INTO users (id, name, role, roll_no, email, password_hash, department, class_section, hostel, room, avatar_url) VALUES
('user_dean', 'Dr. K. Subramanian', 'central_admin', 'DIR.AMRITA.01', 'admin@cb.amrita.edu', 'amrita123', 'Central Administration', NULL, NULL, NULL, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'),
('user_kishore', 'Kishore V.', 'domain_admin', 'ADM.EST.104', 'admin.infra@cb.amrita.edu', 'amrita123', 'Estate Maintenance', NULL, NULL, NULL, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'),
('user_ramesh', 'Dr. Ramesh Kumar', 'faculty_advisor', 'FAC.CSE.8821', 'advisor.cseb@cb.amrita.edu', 'amrita123', 'CSE', 'CSE-B 3rd Year', NULL, NULL, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'),
('user_arjun', 'Arjun K.', 'student', 'CB.EN.U4CSE23045', 'student1@cb.amrita.edu', 'amrita123', 'CSE', 'CSE-B 3rd Year', 'Vashistha Bhavan', '304', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'),
('user_sneha', 'Sneha Reddy', 'student', 'CB.EN.U4CSE23078', 'student2@cb.amrita.edu', 'amrita123', 'CSE', 'CSE-B 3rd Year', 'Gargi Bhavan', '210', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'),
('user_rohit', 'Rohit Nair', 'student', 'CB.EN.U4ME23012', 'student3@cb.amrita.edu', 'amrita123', 'MECH', 'MECH-A 3rd Year', 'Agastya Bhavan', '105', 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150');

-- Insert Initial Tickets
INSERT INTO tickets (id, title, description, scope, class_section, department, location, category, domain, raised_by_id, status, priority_score, assigned_to, eta, admin_note, image_url) VALUES
('TICK-101', 'Ceiling Projector HDMI Flickering & Purple Tint in Room 302', 'During Operating Systems lecture, the main EPSON projector kept resetting and flickering with severe magenta color distortion.', 'class', 'CSE-B 3rd Year', 'CSE', 'Academic Block 1 - Room 302 (CSE-B Classroom)', 'it_av', 'electrical_av', 'user_arjun', 'in_progress', 88, 'Kishore V. (AV Lead)', 'Today, 4:30 PM (Before Evening Lab)', 'Technician Vignesh dispatched with 15m optical HDMI cable.', 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800'),
('TICK-102', 'Ceiling Fan Regulator Stuck at Speed 1 — Humming Noise', 'The ceiling fan in Room 304 cannot be turned to higher speeds. Regulator knob spins loose.', 'room', NULL, 'CSE', 'Vashistha Bhavan, 3rd Floor, Room 304', 'electrical', 'electrical_av', 'user_arjun', 'awaiting_verification', 72, 'Electrical Maintenance Shift-B', 'Completed Today 2:10 PM', 'Replaced fan step-regulator module. Marked as fixed.', 'https://images.unsplash.com/photo-1590725140246-20acbe44865e?w=800'),
('TICK-103', '⚠️ High-Voltage Exposed Wire Hanging Near Pathway Puddle', 'Behind RadhaKrishna CIR Hall leading to Academic Block 2, a severed conduit is resting in water puddle after noon rain.', 'campus', NULL, 'MECH', 'Walkway between RadhaKrishna Hall and Academic Block 2', 'safety', 'electrical_av', 'user_rohit', 'in_progress', 99, 'Campus High-Voltage Emergency Squad', 'Immediate / Within 30 Mins', 'Emergency barricading placed. Power breaker 4 isolated.', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800');

-- Insert Initial Votes
INSERT INTO ticket_votes (ticket_id, user_id, vote_type) VALUES
('TICK-101', 'user_arjun', 'up'),
('TICK-101', 'user_sneha', 'up'),
('TICK-102', 'user_arjun', 'up'),
('TICK-103', 'user_rohit', 'up'),
('TICK-103', 'user_arjun', 'up'),
('TICK-103', 'user_sneha', 'up');

-- Insert Initial Comments
INSERT INTO comments (id, ticket_id, user_id, text, is_official) VALUES
('c1', 'TICK-101', 'user_sneha', 'True! Happened yesterday too. The HDMI wall panel socket is loose.', FALSE),
('c2', 'TICK-101', 'user_ramesh', 'Class Advisor Notice: Verified during 3rd hour. Escalated with High Priority to Estate AV unit.', TRUE);
