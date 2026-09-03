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

-- =========================================================================
-- FINX FEATURE ADDITION: AI NGO PROPOSAL VERIFICATION ENGINE SCHEMA
-- =========================================================================

-- 20. ngo_profiles
CREATE TABLE ngo_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ngo_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    registration_number VARCHAR(100) NOT NULL,
    darpan_id VARCHAR(100),
    tax_80g_certified BOOLEAN DEFAULT TRUE,
    fcra_registered BOOLEAN DEFAULT FALSE,
    trust_score NUMERIC(5, 2) DEFAULT 90.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 21. csr_proposals
CREATE TABLE csr_proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proposal_code VARCHAR(50) UNIQUE NOT NULL,
    ngo_id UUID REFERENCES ngo_profiles(id),
    ngo_name VARCHAR(255) NOT NULL,
    project_name VARCHAR(255) NOT NULL,
    project_description TEXT NOT NULL,
    csr_category VARCHAR(100) NOT NULL,
    project_location VARCHAR(255) NOT NULL,
    latitude NUMERIC(10, 8),
    longitude NUMERIC(11, 8),
    beneficiary_count INT NOT NULL,
    project_duration_months INT NOT NULL,
    requested_amount NUMERIC(14, 2) NOT NULL,
    submission_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    status VARCHAR(50) DEFAULT 'SUBMITTED' CHECK (status IN (
        'SUBMITTED', 'AI_VERIFYING', 'AWAITING_VALIDATION', 'CHANGES_REQUESTED', 'VALIDATOR_ACCEPTED', 'VALIDATOR_REJECTED', 'CORPORATE_MATCHED'
    )),
    ai_verification_score NUMERIC(5, 2),
    risk_level VARCHAR(50) CHECK (risk_level IN ('LOW RISK', 'MEDIUM RISK', 'HIGH RISK', 'CRITICAL REVIEW')),
    ai_recommendation VARCHAR(100)
);

-- 22. proposal_documents
CREATE TABLE proposal_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proposal_id UUID REFERENCES csr_proposals(id),
    document_type VARCHAR(100) NOT NULL,
    document_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    is_valid BOOLEAN DEFAULT TRUE,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 23. proposal_budgets
CREATE TABLE proposal_budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proposal_id UUID REFERENCES csr_proposals(id),
    category VARCHAR(100) NOT NULL,
    item_description TEXT NOT NULL,
    quantity NUMERIC(10, 2) NOT NULL,
    unit_price NUMERIC(12, 2) NOT NULL,
    line_total NUMERIC(14, 2) NOT NULL
);

-- 24. proposal_verification_runs
CREATE TABLE proposal_verification_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proposal_id UUID REFERENCES csr_proposals(id),
    run_version INT DEFAULT 1,
    eligibility_score NUMERIC(5, 2),
    doc_verification_score NUMERIC(5, 2),
    csr_compliance_score NUMERIC(5, 2),
    budget_consistency_score NUMERIC(5, 2),
    quantity_consistency_score NUMERIC(5, 2),
    duplicate_detection_score NUMERIC(5, 2),
    corporate_goal_match_score NUMERIC(5, 2),
    overall_score NUMERIC(5, 2),
    risk_level VARCHAR(50),
    ai_recommendation VARCHAR(100),
    executed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 25. verification_findings
CREATE TABLE verification_findings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    verification_run_id UUID REFERENCES proposal_verification_runs(id),
    module_name VARCHAR(50) NOT NULL,
    flag_type VARCHAR(100) NOT NULL,
    severity VARCHAR(50) NOT NULL CHECK (severity IN ('INFO', 'WARNING', 'CRITICAL')),
    finding_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 26. duplicate_matches
CREATE TABLE duplicate_matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proposal_id UUID REFERENCES csr_proposals(id),
    matched_proposal_code VARCHAR(50) NOT NULL,
    similarity_percentage NUMERIC(5, 2) NOT NULL,
    location_similarity_percentage NUMERIC(5, 2) NOT NULL,
    description_similarity_percentage NUMERIC(5, 2) NOT NULL
);

-- 27. validator_reviews
CREATE TABLE validator_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proposal_id UUID REFERENCES csr_proposals(id),
    validator_id VARCHAR(100) NOT NULL,
    validator_name VARCHAR(255) NOT NULL,
    decision VARCHAR(50) NOT NULL CHECK (decision IN ('ACCEPT', 'REQUEST_CHANGES', 'REJECT')),
    comments TEXT NOT NULL,
    ai_score_at_decision NUMERIC(5, 2),
    decided_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 28. corporate_csr_goals
CREATE TABLE corporate_csr_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    corporate_id VARCHAR(100) NOT NULL,
    corporate_name VARCHAR(255) NOT NULL,
    preferred_categories JSONB NOT NULL,
    preferred_locations JSONB NOT NULL,
    allocated_budget NUMERIC(14, 2) NOT NULL,
    available_budget NUMERIC(14, 2) NOT NULL
);

-- 29. csr_matches
CREATE TABLE csr_matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proposal_id UUID REFERENCES csr_proposals(id),
    corporate_id VARCHAR(100) NOT NULL,
    csr_goal_match_score NUMERIC(5, 2) NOT NULL,
    category_match_pct NUMERIC(5, 2),
    location_match_pct NUMERIC(5, 2),
    beneficiary_match_pct NUMERIC(5, 2),
    budget_fit_pct NUMERIC(5, 2),
    match_reason TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 30. proposal_audit_logs
CREATE TABLE proposal_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_id VARCHAR(100) UNIQUE NOT NULL,
    proposal_id UUID REFERENCES csr_proposals(id),
    actor_id VARCHAR(100) NOT NULL,
    actor_role VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,
    old_status VARCHAR(50),
    new_status VARCHAR(50),
    ai_score NUMERIC(5, 2),
    reason TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);


