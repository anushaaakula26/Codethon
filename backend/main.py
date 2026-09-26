import os
import json
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.schemas import (
    TelemetryItem, IncidentPackage, InvestigationResult, VerificationResult,
    RemediationPlan, ExperimentResult, ValidationReport, ExecutionResult,
    HumanApprovalRequest, ConnectorConfig, ChangeTicket
)
from backend.ingestion.upload_parser import upload_parser
from backend.ingestion.telemetry_normalizer import telemetry_normalizer
from backend.ingestion.connectors import connector_manager
from backend.agents.investigation import investigation_agent
from backend.agents.verification import verification_agent
from backend.agents.remediation import remediation_agent
from backend.sandbox.digital_twin import digital_twin_sandbox
from backend.validation.deterministic_engine import deterministic_validator
from backend.execution.execution_engine import execution_engine
from backend.change_management.change_ticket_manager import change_ticket_manager
from backend.routing.model_router import model_router
from backend.evaluation.evaluator import evaluation_suite
from backend.audit.audit_trail import audit_trail

app = FastAPI(
    title="VeriFix SRE — Agentic Incident Diagnosis & Self-Validated Remediation Platform",
    version="2.2.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

incident_store: Dict[str, Any] = {}
platform_settings: Dict[str, Any] = {
    "compliance_profile": "ECOMMERCE_SOC2",
    "presidio_pii_redaction": True,
    "azure_prompt_shields": True,
    "last_updated": "2026-09-26 13:30:00 UTC"
}

@app.get("/api/health")
def health_check():
    return {
        "status": "HEALTHY",
        "app_name": "VeriFix SRE",
        "mode": "HACKATHON_DEMO_READY",
        "connectors_available": 4
    }

@app.get("/api/connectors")
def get_connectors():
    return connector_manager.list_connectors()

@app.get("/api/scenarios")
def list_scenarios():
    return [
        {
            "id": "bad_deployment",
            "file": "bad_deployment_scenario.json",
            "title": "Incident: Checkout Service Degradation",
            "tag": "BAD_DEPLOYMENT",
            "severity": "HIGH",
            "description": "Deployment checkout-v2.8.1 causes database connection pool saturation, spiking HTTP 500 error rate to 38.7% and P95 latency to 4.8s."
        },
        {
            "id": "db_overload",
            "file": "db_overload_scenario.json",
            "title": "Incident: Database CPU 99% Lock Contention",
            "tag": "DB_OVERLOAD",
            "severity": "CRITICAL",
            "description": "Full-table catalog search query consumes 99% DB CPU causing Gateway 504 timeouts."
        },
        {
            "id": "network_dependency",
            "file": "network_dependency_scenario.json",
            "title": "Incident: Payment Gateway Timeout & Thread Starvation",
            "tag": "NETWORK_DEPENDENCY",
            "severity": "HIGH",
            "description": "External payment gateway timeout causes thread exhaustion across payment-service workers."
        },
        {
            "id": "memory_leak",
            "file": "memory_leak_scenario.json",
            "title": "Incident: Recommendation Engine Cache Memory Leak",
            "tag": "MEMORY_LEAK",
            "severity": "HIGH",
            "description": "JVM heap steady growth causes 14.8s garbage collection pauses and OOM container restarts."
        },
        {
            "id": "bad_remediation",
            "file": "bad_remediation_scenario.json",
            "title": "Incident: Bad Remediation Sandbox Validation Failure",
            "tag": "BAD_REMEDIATION",
            "severity": "CRITICAL",
            "description": "Demonstrates self-validation detecting an ineffective fix (Scaling pods under DB exhaustion worsens health), triggering sandbox rollback and proposing correct fix."
        }
    ]

@app.post("/api/upload")
async def upload_incident(files: List[UploadFile] = File(...)):
    raw_telemetry: List[TelemetryItem] = []
    file_names = []

    for file in files:
        content = (await file.read()).decode("utf-8", errors="ignore")
        parsed = upload_parser.parse_file(file.filename, content)
        raw_telemetry.extend(parsed)
        file_names.append(file.filename)

    normalized = telemetry_normalizer.normalize(raw_telemetry)
    inc_id = f"INC-UPLOAD-{os.urandom(2).hex().upper()}"
    summary = investigation_agent.get_ingest_summary(normalized, data_origin="UPLOADED_DATA")

    incident_store[inc_id] = {
        "incident_id": inc_id,
        "data_origin": "UPLOADED_DATA",
        "title": f"Uploaded Incident Package ({', '.join(file_names)})",
        "telemetry": normalized,
        "ingest_summary": summary
    }

    audit_trail.log(
        event_type="INGESTION",
        agent_or_component="UploadParser",
        action="Upload Custom Telemetry Data",
        details={"files": file_names, "records_parsed": len(normalized), "data_origin": "UPLOADED_DATA"}
    )

    return {
        "incident_id": inc_id,
        "data_origin": "UPLOADED_DATA",
        "message": f"Successfully parsed custom telemetry package.",
        "telemetry_count": len(normalized),
        "ingest_summary": summary.dict()
    }

class LoadScenarioRequest(BaseModel):
    scenario_id: str

@app.post("/api/load-scenario")
def load_scenario(req: LoadScenarioRequest):
    fname = f"{req.scenario_id}_scenario.json"
    fpath = os.path.join("scenarios", fname)
    if not os.path.exists(fpath):
        raise HTTPException(status_code=404, detail="Scenario file not found")

    with open(fpath, "r") as f:
        data = json.load(f)

    inc_id = data["incident_id"]
    telemetry = [TelemetryItem(**t) for t in data["telemetry"]]
    normalized = telemetry_normalizer.normalize(telemetry)
    summary = investigation_agent.get_ingest_summary(normalized, data_origin="DEMO_DATA")

    incident_store[inc_id] = {
        "incident_id": inc_id,
        "data_origin": "DEMO_DATA",
        "title": data["title"],
        "description": data.get("description", ""),
        "affected_services": data.get("affected_services", []),
        "telemetry": normalized,
        "raw_scenario": data,
        "ingest_summary": summary
    }

    audit_trail.log(
        event_type="INGESTION",
        agent_or_component="ScenarioLoader",
        action=f"Loaded Pre-Packaged Demo Scenario: {data['title']}",
        details={"incident_id": inc_id, "telemetry_count": len(normalized), "data_origin": "DEMO_DATA"}
    )

    return {
        "incident_id": inc_id,
        "data_origin": "DEMO_DATA",
        "title": data["title"],
        "telemetry": [t.dict() for t in normalized],
        "affected_services": data.get("affected_services", []),
        "ingest_summary": summary.dict()
    }

class RunPipelineRequest(BaseModel):
    incident_id: str

@app.post("/api/investigate")
def run_investigation(req: RunPipelineRequest):
    if req.incident_id not in incident_store:
        raise HTTPException(status_code=404, detail="Incident ID not found in active session.")

    data = incident_store[req.incident_id]
    telemetry = data["telemetry"]
    data_origin = data.get("data_origin", "UPLOADED_DATA")

    investigation = investigation_agent.investigate(req.incident_id, telemetry, data_origin=data_origin)
    data["investigation"] = investigation

    top_conf = investigation.hypotheses[0].confidence if investigation.hypotheses else 0.0
    routing = model_router.route_request(investigation.severity, len(investigation.hypotheses), top_conf)
    data["routing"] = routing

    audit_trail.log(
        event_type="INVESTIGATION",
        agent_or_component="InvestigationAgent",
        action=f"Completed Investigation ({data_origin})",
        details={
            "data_origin": data_origin,
            "severity": investigation.severity.level,
            "hypotheses_count": len(investigation.hypotheses),
            "leading_hypothesis": investigation.hypotheses[0].title if investigation.hypotheses else "None",
            "model_used": routing.selected_model
        }
    )

    return {
        "investigation": investigation.dict(),
        "routing": routing.dict(),
        "ingest_summary": data.get("ingest_summary", investigation_agent.get_ingest_summary(telemetry, data_origin=data_origin)).dict()
    }

@app.post("/api/verify")
def run_verification(req: RunPipelineRequest):
    if req.incident_id not in incident_store:
        raise HTTPException(status_code=404, detail="Incident ID not found.")

    data = incident_store[req.incident_id]
    if "investigation" not in data:
        raise HTTPException(status_code=400, detail="Investigation must be run before verification.")

    verification = verification_agent.verify(data["investigation"], data["telemetry"])
    data["verification"] = verification

    audit_trail.log(
        event_type="VERIFICATION",
        agent_or_component="VerificationAgent",
        action="Hypothesis Verification & Elimination",
        details={
            "data_origin": data.get("data_origin", "UPLOADED_DATA"),
            "status": verification.status,
            "verified_root_cause": verification.verified_root_cause,
            "eliminated_count": len(verification.eliminated_hypotheses)
        }
    )

    return verification.dict()

@app.post("/api/remediations/plan")
def plan_remediation_route(req: RunPipelineRequest):
    if req.incident_id not in incident_store:
        raise HTTPException(status_code=404, detail="Incident ID not found.")

    data = incident_store[req.incident_id]
    if "verification" not in data:
        raise HTTPException(status_code=400, detail="Verification must be run before remediation planning.")

    plan = remediation_agent.plan_remediation(data["verification"], data.get("raw_scenario"))
    plan.data_origin = data.get("data_origin", "UPLOADED_DATA")
    data["remediation_plan"] = plan

    audit_trail.log(
        event_type="REMEDIATION_PLANNING",
        agent_or_component="RemediationAgent",
        action=f"Formulated Remediation Plan ({plan.action})",
        details={
            "data_origin": plan.data_origin,
            "action": plan.action,
            "target_service": plan.target_service,
            "risk_level": plan.risk_level,
            "blast_radius": plan.blast_radius
        }
    )

    return plan.dict()

@app.post("/api/sandbox/run-experiment")
def run_sandbox_experiment(req: RunPipelineRequest):
    if req.incident_id not in incident_store:
        raise HTTPException(status_code=404, detail="Incident ID not found.")

    data = incident_store[req.incident_id]
    if "remediation_plan" not in data:
        raise HTTPException(status_code=400, detail="Remediation plan must exist before sandbox experiment.")

    plan = data["remediation_plan"]
    experiment = digital_twin_sandbox.run_experiment(plan)
    experiment.data_origin = data.get("data_origin", "UPLOADED_DATA")
    validation = deterministic_validator.validate(experiment, plan.validation_criteria)
    validation.data_origin = data.get("data_origin", "UPLOADED_DATA")

    data["experiment"] = experiment
    data["validation"] = validation

    audit_trail.log(
        event_type="SANDBOX_EXPERIMENT",
        agent_or_component="DigitalTwinSandbox & DeterministicValidator",
        action=f"Digital Twin Experiment & SLO Validation ({validation.overall_status})",
        details={
            "data_origin": validation.data_origin,
            "action_tested": plan.action,
            "overall_status": validation.overall_status,
            "slos_passed_count": sum(1 for s in validation.slos_checked if s["passed"])
        }
    )

    return {
        "experiment": experiment.dict(),
        "validation": validation.dict()
    }

class ExecuteRequest(BaseModel):
    incident_id: str
    approved: bool
    approved_by: str = "Admin / Approver Name"

@app.post("/api/execute")
def execute_remediation_route(req: ExecuteRequest):
    if req.incident_id not in incident_store:
        raise HTTPException(status_code=404, detail="Incident ID not found.")

    data = incident_store[req.incident_id]
    plan = data.get("remediation_plan")
    validation = data.get("validation")
    experiment = data.get("experiment")

    if not plan or not validation or not experiment:
        raise HTTPException(status_code=400, detail="Experiment and validation must precede target execution.")

    result = execution_engine.execute_remediation(plan, validation, experiment, req.approved, req.approved_by)
    result.data_origin = data.get("data_origin", "UPLOADED_DATA")
    data["execution_result"] = result

    audit_trail.log(
        event_type="TARGET_EXECUTION",
        agent_or_component="ExecutionEngine & ChangeTicketManager",
        action=f"Target Remediation Execution ({result.status})",
        details={
            "data_origin": result.data_origin,
            "action": plan.action,
            "target": plan.target_service,
            "change_ticket_id": result.change_ticket_id,
            "human_approved": req.approved,
            "final_status": result.final_health_status
        }
    )

    return result.dict()

@app.get("/api/change-tickets")
def list_change_tickets():
    return [t.dict() for t in change_ticket_manager.list_tickets()]

@app.get("/api/change-tickets/{ticket_id}")
def get_change_ticket(ticket_id: str):
    ticket = change_ticket_manager.get_ticket(ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Change ticket not found.")
    return ticket.dict()

class UpdateSettingsRequest(BaseModel):
    compliance_profile: str
    presidio_pii_redaction: bool
    azure_prompt_shields: bool

@app.get("/api/settings")
def get_settings():
    return platform_settings

@app.post("/api/settings")
def update_settings(req: UpdateSettingsRequest):
    platform_settings["compliance_profile"] = req.compliance_profile
    platform_settings["presidio_pii_redaction"] = req.presidio_pii_redaction
    platform_settings["azure_prompt_shields"] = req.azure_prompt_shields
    return {"status": "SUCCESS", "message": "Settings updated successfully.", "settings": platform_settings}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
