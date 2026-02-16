
-- Create Inquiries Table for Anushtan
-- Compatible with PostgreSQL 16

CREATE TABLE IF NOT EXISTS inquiries (
    id SERIAL PRIMARY KEY,                    -- Internal Auto-incrementing ID
    inquiry_id VARCHAR(50) UNIQUE,            -- External ID (e.g., S-123 from Google Sheets)
    
    -- Student Details
    student_name VARCHAR(255) NOT NULL,
    child_age INTEGER,                        -- Requested field
    current_class VARCHAR(100),               -- e.g., Grade 5
    current_school VARCHAR(255),
    board VARCHAR(50),                        -- e.g., CBSE
    
    -- Parent/Guardian Details
    parent_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50) NOT NULL,               -- Primary contact for WhatsApp
    secondary_contact VARCHAR(50),
    occupation VARCHAR(255),
    
    -- Inquiry Meta
    status VARCHAR(50) DEFAULT 'New',         -- New, Contacted, Enrolled, Closed
    notes TEXT,
    source VARCHAR(100) DEFAULT 'Website',
    how_heard VARCHAR(255),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on phone for fast lookups (essential for WhatsApp integration)
CREATE INDEX idx_inquiries_phone ON inquiries(phone);

-- Create index on inquiry_id for syncing
CREATE INDEX idx_inquiries_external_id ON inquiries(inquiry_id);

-- Trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_inquiries_updated_at ON inquiries;
CREATE TRIGGER update_inquiries_updated_at
    BEFORE UPDATE ON inquiries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
