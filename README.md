# FINX - CSR Accountability Platform

This repository is structured as a full-stack monorepo for the FINX platform.

## Directory Structure
- **`/frontend`**: Next.js & TailwindCSS application for the user interface.
- **`/backend`**: Express/Node.js API for external integrations.
- **`/database`**: Supabase SQL Schema and queries.
- **`/blockchain`**: Hardhat project containing the Solidity escrow protocol smart contracts.

## Getting Started

### 1. Frontend
cd frontend
npm install
npm run dev

### 2. Backend
cd backend
npm install
npm start (node index.js)

### 3. Blockchain
cd blockchain
npm install
npm run compile
npm run node (Start local hardhat network)
