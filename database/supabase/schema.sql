-- FINX Database Schema (Supabase / PostgreSQL)

-- 1. users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role VARCHAR(50) NOT NULL CHECK (role IN ('people', 'ngo', 'corporate', 'admin')),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. ngos
CREATE TABLE ngos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    focus_area VARCHAR(100),
    registration_id VARCHAR(100) UNIQUE,
    status VARCHAR(50) DEFAULT 'Needs Review' CHECK (status IN ('Verified', 'Needs Review', 'High Risk')),
    trust_score INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. ngo_documents
CREATE TABLE ngo_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ngo_id UUID REFERENCES ngos(id) ON DELETE CASCADE,
    document_type VARCHAR(100) NOT NULL,
    document_url TEXT NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. petitions (Community Requests)
CREATE TABLE petitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_by UUID REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255) NOT NULL,
    signatures_count INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Needs Review', 'Verified', 'Assigned')),
    matched_ngo_id UUID REFERENCES ngos(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. csr_opportunities (Corporate budgets)
CREATE TABLE csr_opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    corporate_id UUID REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    total_budget NUMERIC NOT NULL,
    theme VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 6. projects (Matched NGO and CSR)
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ngo_id UUID REFERENCES ngos(id),
    csr_id UUID REFERENCES csr_opportunities(id),
    petition_id UUID REFERENCES petitions(id),
    title VARCHAR(255) NOT NULL,
    total_funding_required NUMERIC NOT NULL,
    status VARCHAR(50) DEFAULT 'Draft',
    alignment_score INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 7. applications (NGO applying for CSR)
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id),
    status VARCHAR(50) DEFAULT 'Submitted' CHECK (status IN ('Submitted', 'Under Review', 'Approved', 'Rejected')),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 8. validation_results (Admin checking NGOs)
CREATE TABLE validation_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ngo_id UUID REFERENCES ngos(id),
    admin_id UUID REFERENCES users(id),
    risk_level VARCHAR(50) CHECK (risk_level IN ('Low', 'Medium', 'High')),
    notes TEXT,
    validated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 9. escrow_contracts (Blockchain binding)
CREATE TABLE escrow_contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id),
    contract_address VARCHAR(255) UNIQUE NOT NULL,
    total_locked NUMERIC NOT NULL,
    total_released NUMERIC DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 10. milestones
CREATE TABLE milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    escrow_id UUID REFERENCES escrow_contracts(id),
    title VARCHAR(255) NOT NULL,
    amount NUMERIC NOT NULL,
    status VARCHAR(50) DEFAULT 'Locked' CHECK (status IN ('Locked', 'Reviewing', 'Released')),
    proof_url TEXT,
    estimated_date DATE
);

-- 11. fund_transactions
CREATE TABLE fund_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    escrow_id UUID REFERENCES escrow_contracts(id),
    milestone_id UUID REFERENCES milestones(id),
    amount NUMERIC NOT NULL,
    tx_hash VARCHAR(255) UNIQUE NOT NULL,
    processed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 12. impact_reports
CREATE TABLE impact_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id),
    sdg_alignment VARCHAR(100),
    metric_name VARCHAR(100) NOT NULL,
    metric_value NUMERIC NOT NULL,
    reported_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 13. notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 14. project_milestones (Verified Milestone Engine)
CREATE TABLE project_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    milestone_number INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    percentage NUMERIC(5, 2) NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'LOCKED' CHECK (status IN ('LOCKED', 'ACTIVE', 'EVIDENCE_SUBMITTED', 'VERIFYING', 'HUMAN_REVIEW', 'VERIFIED', 'FUND_RELEASED', 'COMPLETED', 'REVISION_REQUIRED', 'VERIFICATION_FAILED', 'FLAGGED', 'SUSPENDED')),
    due_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 15. milestone_evidence (Geotagged Proof & Baseline)
CREATE TABLE milestone_evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    milestone_id UUID REFERENCES project_milestones(id) ON DELETE CASCADE,
    is_baseline BOOLEAN DEFAULT FALSE,
    latitude NUMERIC(10, 8) NOT NULL,
    longitude NUMERIC(11, 8) NOT NULL,
    photo_url TEXT NOT NULL,
    image_hash VARCHAR(64) NOT NULL,
    claimed_progress NUMERIC(5, 2) DEFAULT 0,
    reported_expenditure NUMERIC(12, 2) DEFAULT 0,
    work_description TEXT,
    uploaded_by UUID REFERENCES users(id),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 16. evidence_verifications (Automated Engine Verification Runs)
CREATE TABLE evidence_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    evidence_id UUID REFERENCES milestone_evidence(id) ON DELETE CASCADE,
    distance_meters NUMERIC(10, 2),
    allowed_radius_meters NUMERIC(10, 2) DEFAULT 100,
    location_status VARCHAR(50) CHECK (location_status IN ('VERIFIED', 'FAILED')),
    duplicate_detected BOOLEAN DEFAULT FALSE,
    timestamp_status VARCHAR(50) CHECK (timestamp_status IN ('VALID', 'ANOMALOUS')),
    ai_relevance_score NUMERIC(5, 2),
    ai_progress_score NUMERIC(5, 2),
    ai_consistency_score NUMERIC(5, 2),
    ai_suspicious BOOLEAN DEFAULT FALSE,
    ai_reason TEXT,
    progress_mismatch BOOLEAN DEFAULT FALSE,
    cost_variance_percent NUMERIC(5, 2) DEFAULT 0,
    verification_score NUMERIC(5, 2) NOT NULL,
    final_status VARCHAR(50) CHECK (final_status IN ('VERIFIED', 'HUMAN_REVIEW', 'VERIFICATION_FAILED')),
    evaluated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 17. milestone_fund_releases (Ledger Transactions)
CREATE TABLE milestone_fund_releases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id VARCHAR(100) UNIQUE NOT NULL,
    project_id UUID REFERENCES projects(id),
    milestone_id UUID REFERENCES project_milestones(id),
    amount NUMERIC(12, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'RELEASED', 'BLOCKED', 'CANCELLED')),
    authorized_by UUID REFERENCES users(id),
    verification_score NUMERIC(5, 2),
    released_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 18. risk_flags
CREATE TABLE risk_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id),
    milestone_id UUID REFERENCES project_milestones(id),
    flag_type VARCHAR(100) NOT NULL CHECK (flag_type IN ('GPS_MISMATCH', 'DUPLICATE_EVIDENCE', 'TIMESTAMP_ANOMALY', 'PROGRESS_MISMATCH', 'COST_VARIANCE', 'MISSING_EVIDENCE', 'REPEATED_VERIFICATION_FAILURE', 'SUSPICIOUS_IMAGE', 'OUT_OF_PROJECT_AREA')),
    risk_level VARCHAR(50) NOT NULL CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    details TEXT NOT NULL,
    resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 19. audit_logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor VARCHAR(255) NOT NULL,
    action VARCHAR(255) NOT NULL,
    project_id UUID REFERENCES projects(id),
    milestone_id UUID REFERENCES project_milestones(id),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

