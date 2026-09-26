# VeriFix SRE — Agentic AI Incident Diagnosis & Self-Validated Remediation Platform

> **Core Differentiator: Self-Validated Remediation**  
> *"The AI does not earn permission to act merely by being confident. It earns permission by producing an intervention that survives experimental validation in a safe digital twin sandbox."*

---

## 🌟 Overview

**VeriFix SRE** is a hackathon-ready agentic SRE platform built on the principle of **Self-Validated Remediation**. Organized into 7 modular vertical slices, VeriFix SRE guides users through the complete incident lifecycle from telemetry ingestion to automated emergency change control and enterprise security policies.

```text
1. Upload Data → 2. Investigate → 3. Evidence → 4. Recommended Fix → 5. Approve & Execute → 6. Change Tickets → 7. Platform Settings
```

---

## 🚀 Key Features

* **Ingestion (Mode A Upload & Mode B Connectors)**: Supports `.log`, `.txt`, `.csv`, `.json`, `.jsonl` files and connectors for Prometheus, Grafana, OpenTelemetry, and Azure Monitor.
* **Strict Uploaded Source of Truth**: Investigation & evidence provenance strictly reference exact line locations (e.g. `minioms.log | Line 183`) from uploaded custom files without inventing missing data.
* **Evidence Provenance & Verification**: Displays `Evidence Verified ✓` badges for matched lines and `Not available in uploaded data` for omitted categories.
* **Digital Twin Sandbox Experiment**: Executes synthetic workloads against proposed fixes to deterministically measure before vs after system health metrics.
* **Metrics Exporter & Recharts Visualizer**: 1-click export of before/after metrics to `.CSV` report file, plus comparative percentage and latency bar charts.
* **Human Approval Gate**: Requires approver sign-off before target execution.
* **Emergency Change Tickets Store (CHG-1024)**: Generates emergency change tickets integrated with **ServiceNow** and **Azure DevOps** change control processes.
* **AI Execution Audit Table**: Detailed audit table inside Slice 5 logging `TIMESTAMP | AGENT | STEP ACTION | MODEL VERSION | TIER | TOKENS | COST | LATENCY | OTEL SPAN ID`.
* **Platform Settings & Security Policies**: Configurable compliance profiles (Banking SOX, Healthcare HIPAA, E-Commerce SOC 2), Microsoft Presidio PII redaction, and Azure AI Content Safety Prompt Shields.

---

## 🛠️ Quickstart Runbook

### Prerequisites
* Python 3.10+
* Node.js v18+ & npm

### 1. Install Dependencies & Start Backend
```bash
# Install Python packages
pip install fastapi uvicorn pydantic python-multipart httpx

# Launch FastAPI Server
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000
```
Backend API will run at `http://localhost:8000` (Docs: `http://localhost:8000/docs`).

### 2. Install Dependencies & Start Frontend
```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```
Frontend web application will run at `http://localhost:5173`.

---

## 📂 Project Architecture

```text
CODEATHON/
├── backend/
│   ├── agents/            # Investigation, Verification, Remediation, Execution Agents
│   ├── change_management/ # ServiceNow / Azure DevOps Change Ticket Manager
│   ├── ingestion/         # Upload Parsers & Observability Connectors
│   ├── sandbox/           # Digital Twin Sandbox & Workload Generator
│   ├── validation/        # Deterministic SLO Validation Engine
│   ├── models/            # LLM Adapter & Smart Fallback Engine
│   └── main.py            # FastAPI REST API Server
├── frontend/
│   ├── src/
│   │   ├── components/    # Navbar, ChangeTicketModal, EvidenceModal
│   │   ├── slices/        # 7 Vertical Slice Journey Components (Upload, Investigate, Evidence, Fix, Execute, Tickets, Settings)
│   │   └── App.jsx        # Main Application Container
├── scenarios/             # Pre-packaged Incident Scenario Datasets
└── README.md
```
