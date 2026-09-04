# AI Agents for Enterprise Banking & Credit Scrutiny

A high-fidelity, interactive banking CRM suite showcasing autonomous AI agents for corporate and retail credit operations:
1. **Flow 01 — Borrower Financial Document Extraction & Normalization Agent**
2. **CASA Onboarding Scrutiny Agent (Post-Document AI Reasoning Layer)**
3. **Prompt-Driven AI Command Engine**

---

## 🏛️ Flow 01: Borrower Financial Document Extraction Agent

Automates multi-year financial spreading, chart-of-accounts normalization, tie-out validation, deterministic ratio calculation, and human-in-the-loop exception review for corporate credit appraisal.

### Key Capabilities
- **Statutory Document Intelligence**: Multi-page viewer for MCA Schedule III Audited Balance Sheets, Statements of Profit & Loss, Cash Flow Statements, and Bank Statements.
- **Bidirectional Source Citation**: Click any spread field (e.g. *Trade Payables ₹420L*) to highlight its exact 2D bounding box on the original statutory page.
- **Chart of Accounts (CoA) Normalization**: Converts absolute/crore denominations to INR Lakhs, enforces sign conventions, and maps diverse line-item labels to bank standard taxonomy.
- **Deterministic Reconciliation Engine**:
  - Balance Sheet Balancing ($\text{Assets} = \text{Liabilities}$)
  - Component Summation ($\text{CL} = \text{STB} + \text{Trade Payables} + \text{OCL}$)
  - YoY Tangible Net Worth Continuity
  - Bank Credits vs Reported Turnover Tie-Out ($\le 10\%$ tolerance)
  - GST Turnover Validation
- **Deterministic 3-Year Ratio Engine**: Computes Current Ratio, DSCR, TOL/TNW, Debt/Equity, Interest Coverage, and EBITDA Margins across FY23, FY24, and FY25.
- **Human-in-the-Loop (HITL) Exception Workbench**: 3-pane review interface. Modifying Trade Payables from ₹420L $\to$ ₹405L dynamically revalidates 4 dependent tie-outs and recalculates ratios in real time.
- **10-Year WORM Audit Trail**: Every OCR coordinate extraction, rule execution, and analyst edit is sealed with SHA-256 cryptographic verification hashes.
- **Downstream Dispatch**: Publishes RFC-compliant JSON to Flow 02 CAM Drafting Agent, Risk Rating Models, and Early Warning Signals (EWS).

---

## 🔍 CASA Onboarding Scrutiny Agent

An agentic validation and reasoning layer built on top of the bank's existing Document AI to execute high-order banking scrutiny:
- **Completeness Agent**: Validates entity-specific mandatory documents, schedules, common seals, and Beneficial Ownership (BO) declarations.
- **Cross-Document Agent**: Compares attributes across AOF, Corporate PAN, Certificate of Incorporation (COI), MOA, GST Certificates, and Board Resolutions (e.g., detecting sub-unit address discrepancies: *Unit 401-A vs Unit 402*).
- **Statutory Verification Agent**: Automated connectors to NSDL PAN, GSTN Portal, MCA21 Corporate Registry, CKYC, LEI, and RBI Defaulter Lists.
- **HITL Officer Workbench**: Provides 4 decision paths (*Accept Difference*, *Standardize to MCA*, *Override with Proof*, *Send Back to RM*).
- **Account Readiness Assessment**: Generates aggregate readiness scores (e.g., `92/100` $\to$ `98/100` post sign-off) and creates Core Banking System (Finacle CBS) accounts.

---

## ⚡ Prompt-Driven AI Command Engine

Type or speak natural language prompts directly inside the Banking CRM to command the multi-agent system:
- *"Run full scrutiny on ABC Mfg, verify against MCA21 & NSDL, and standardize address to official MCA records"*
- *"Verify NSDL PAN & GSTN filing status"*
- *"Transmit validated application to Core Banking (CBS)"*

The agent decomposes the prompt into ReAct tool calls (`crm_fetch_documents`, `external_api_verify`, `crm_update_field`, `crm_seal_worm_audit`), streams live telemetry, mutates CRM data canvas fields, and unlocks CBS account opening.

---

## 🚀 Quick Start & Local Run

### Prerequisites
- Node.js (v18+)

### Running the Application
```bash
# Start the local server
node server.js
```

Open your browser and navigate to:
- **Borrower Financial Document Extraction Agent**: [http://localhost:3000/](http://localhost:3000/)
- **CASA Scrutiny & Prompt-Driven Agent**: [http://localhost:3000/casa_scrutiny_wireframe.html](http://localhost:3000/casa_scrutiny_wireframe.html)

---

## 📂 Repository Structure

```
├── index.html                   # Flow 01 Borrower Financial Document Extraction App
├── casa_scrutiny_wireframe.html # Prompt-Driven CASA Scrutiny Wireframe
├── server.js                    # HTTP Server
├── src/
│   ├── types/                   # Domain TypeScript interfaces
│   ├── data/                    # Multi-year mock borrower & statutory datasets
│   ├── engine/                  # Deterministic Reconciliation & Ratio engines
│   └── components/              # Modular UI components
├── vendor/                      # Offline Tailwind & React runtime libraries
├── dist/                        # Pre-compiled application bundles
└── reference/                   # RFP & Business specification references
```

---

## 🔒 Security & Compliance
- **100% Offline / Self-Contained**: Zero external runtime CDN dependencies.
- **WORM Compliance**: 10-year immutable audit log with cryptographic hashes.
- **Demo Mode**: Explicitly labeled `DEMO DATA — NOT REAL CUSTOMER INFORMATION`.
