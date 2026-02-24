-- =============================================================================
-- Anushtan — PostgreSQL Schema (Migration 001)
-- Compatible with PostgreSQL 14+
-- Run on: anushtan_dev  (dev)  OR  anushtan_prod  (prod)
-- Usage: psql -U <user> -d <database> -f 001_create_schema.sql
-- Idempotent: Safe to re-run — uses IF NOT EXISTS throughout.
-- =============================================================================

-- ─── Extensions ──────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";   -- gen_random_uuid()

-- ─── Shared trigger function ─────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- ─── ENUMs ───────────────────────────────────────────────────────────────────
DO $$ BEGIN
    CREATE TYPE inquiry_status AS ENUM (
        'New', 'Open', 'Follow-up', 'Converted', 'Closed'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE case_status AS ENUM (
        'Active', 'Resolved-Completed'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE inquiry_source AS ENUM (
        'Website', 'WhatsApp', 'Paper Form', 'Phone Call', 'Referral', 'Other'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM (
        'admin', 'counselor', 'viewer'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- =============================================================================
-- TABLE: inquiries
-- Source of truth for all student inquiries.
-- Replaces both "Inquiries (SOR)" and "Inquiries (Working)" Google Sheets tabs.
-- =============================================================================
CREATE TABLE IF NOT EXISTS inquiries (

    -- ── Identity ──────────────────────────────────────────────────────────────
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    inquiry_id      VARCHAR(20)     NOT NULL UNIQUE,  -- Human-readable: S-1, S-2, …

    -- Multi-tenant support (school/branch isolation)
    -- Default is 'anushtan-siddipet' so existing rows are unaffected
    tenant_id       VARCHAR(100)    NOT NULL DEFAULT 'anushtan-siddipet',

    -- ── Student Details ───────────────────────────────────────────────────────
    student_name    VARCHAR(255)    NOT NULL,
    current_class   VARCHAR(100),                     -- e.g. "Grade 5", "8th"
    current_school  VARCHAR(255),
    board           VARCHAR(50),                      -- CBSE, ICSE, State, etc.

    -- ── Parent / Guardian ─────────────────────────────────────────────────────
    parent_name     VARCHAR(255)    NOT NULL,
    phone           VARCHAR(20)     NOT NULL,          -- Primary; used for WhatsApp
    secondary_phone VARCHAR(20),
    email           VARCHAR(255),
    occupation      VARCHAR(255),

    -- ── Admission Survey (WhatsApp / Website Form answers) ───────────────────
    education_guide     TEXT,    -- "Who should guide your child's education?"
    learning_method     TEXT,    -- "How do children learn best?"
    teacher_preference  TEXT,    -- "What kind of teacher do you prefer?"
    child_importance    TEXT,    -- "What is most important for your child?"
    school_environment  TEXT,    -- "Preferred school environment?"
    day_scholar_hostel  VARCHAR(50),  -- "Day Scholar" | "Hostel" | "Either"

    -- ── Source & Routing ──────────────────────────────────────────────────────
    source          inquiry_source  NOT NULL DEFAULT 'Website',
    how_heard       VARCHAR(255),
    created_by      VARCHAR(255),    -- staff name or "WhatsApp Bot"

    -- ── Counselor Workflow ────────────────────────────────────────────────────
    status          inquiry_status  NOT NULL DEFAULT 'New',
    case_status     case_status     NOT NULL DEFAULT 'Active',
    assigned_to     VARCHAR(255),    -- counselor name (or future FK to users.email)
    follow_up_date  DATE,
    priority        VARCHAR(20),     -- 'High' | 'Medium' | 'Low'
    notes           TEXT,            -- initial notes / paper form comments

    -- ── Audit ─────────────────────────────────────────────────────────────────
    inquiry_date    TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    -- Sheets sync flag — flipped to TRUE once successfully pushed to Google Sheets
    is_synced_to_sheet  BOOLEAN     NOT NULL DEFAULT FALSE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_inquiries_phone          ON inquiries (phone);
CREATE INDEX IF NOT EXISTS idx_inquiries_status         ON inquiries (status);
CREATE INDEX IF NOT EXISTS idx_inquiries_tenant         ON inquiries (tenant_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_assigned_to    ON inquiries (assigned_to);
CREATE INDEX IF NOT EXISTS idx_inquiries_inquiry_date   ON inquiries (inquiry_date DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_source         ON inquiries (source);
CREATE INDEX IF NOT EXISTS idx_inquiries_synced         ON inquiries (is_synced_to_sheet);

-- Auto-update trigger
DROP TRIGGER IF EXISTS trg_inquiries_updated_at ON inquiries;
CREATE TRIGGER trg_inquiries_updated_at
BEFORE UPDATE ON inquiries
FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- =============================================================================
-- TABLE: counselor_activity_log
-- Immutable audit trail — one row per counselor action.
-- Replaces the appended-text history stored in Google Sheets Column Z.
-- =============================================================================
CREATE TABLE IF NOT EXISTS counselor_activity_log (

    id              BIGSERIAL       PRIMARY KEY,
    inquiry_id      VARCHAR(20)     NOT NULL REFERENCES inquiries(inquiry_id) ON DELETE CASCADE,
    counselor_name  VARCHAR(255)    NOT NULL,

    -- action is what happened: "status_change" | "note_added" | "assigned" | "follow_up_set" | "created"
    action          VARCHAR(50)     NOT NULL,
    old_value       TEXT,           -- Previous value (for status changes etc.)
    new_value       TEXT,           -- New value
    comments        TEXT,           -- Free-text counselor comments for this action

    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_inquiry    ON counselor_activity_log (inquiry_id);
CREATE INDEX IF NOT EXISTS idx_activity_counselor  ON counselor_activity_log (counselor_name);
CREATE INDEX IF NOT EXISTS idx_activity_created    ON counselor_activity_log (created_at DESC);


-- =============================================================================
-- TABLE: users
-- Admin / counselor accounts (NextAuth compatible).
-- =============================================================================
CREATE TABLE IF NOT EXISTS users (

    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(255),
    email           VARCHAR(255)    NOT NULL UNIQUE,
    password_hash   TEXT,                              -- bcrypt hash
    role            user_role       NOT NULL DEFAULT 'counselor',
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,

    -- NextAuth fields
    email_verified  TIMESTAMPTZ,
    image           TEXT,

    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- =============================================================================
-- TABLE: students
-- Enrolled students — created when inquiry status becomes 'Converted'.
-- =============================================================================
CREATE TABLE IF NOT EXISTS students (

    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    inquiry_id      VARCHAR(20)     REFERENCES inquiries(inquiry_id) ON DELETE SET NULL,

    student_name    VARCHAR(255)    NOT NULL,
    parent_name     VARCHAR(255)    NOT NULL,
    phone           VARCHAR(20)     NOT NULL,
    email           VARCHAR(255),

    -- Enrollment details
    class           VARCHAR(100),        -- Enrolled class/grade
    section         VARCHAR(10),
    admission_date  DATE,
    batch_year      INTEGER,             -- e.g. 2026
    hostel          BOOLEAN             NOT NULL DEFAULT FALSE,

    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_students_inquiry    ON students (inquiry_id);
CREATE INDEX IF NOT EXISTS idx_students_phone      ON students (phone);
CREATE INDEX IF NOT EXISTS idx_students_batch      ON students (batch_year);

DROP TRIGGER IF EXISTS trg_students_updated_at ON students;
CREATE TRIGGER trg_students_updated_at
BEFORE UPDATE ON students
FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- =============================================================================
-- TABLE: sheets_sync_log
-- Tracks which inquiry rows have been pushed to Google Sheets and their status.
-- Enables retry logic for failed syncs.
-- =============================================================================
CREATE TABLE IF NOT EXISTS sheets_sync_log (

    id              BIGSERIAL       PRIMARY KEY,
    inquiry_id      VARCHAR(20)     NOT NULL,
    operation       VARCHAR(20)     NOT NULL DEFAULT 'insert',  -- 'insert' | 'update'
    sheet_row       INTEGER,         -- Row number in Sheets (for future targeted updates)
    status          VARCHAR(20)     NOT NULL DEFAULT 'pending', -- 'pending' | 'success' | 'failed'
    error_message   TEXT,
    synced_at       TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sync_inquiry   ON sheets_sync_log (inquiry_id);
CREATE INDEX IF NOT EXISTS idx_sync_status    ON sheets_sync_log (status);
CREATE INDEX IF NOT EXISTS idx_sync_synced_at ON sheets_sync_log (synced_at DESC);


-- =============================================================================
-- Verify
-- =============================================================================
SELECT
    table_name,
    pg_size_pretty(pg_total_relation_size(quote_ident(table_name))) AS total_size
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;
