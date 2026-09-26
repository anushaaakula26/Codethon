from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from datetime import datetime

class TelemetryItem(BaseModel):
    timestamp: str
    source: str  # app_log, server_log, minioms, prometheus, opentelemetry, deployment_log, azure_monitor
    service: str
    event_type: str  # LOG, METRIC, TRACE, DEPLOYMENT, ALERT
    severity: str    # INFO, WARNING, ERROR, CRITICAL
    message: str
    metric_name: Optional[str] = None
    metric_value: Optional[float] = None
    trace_id: Optional[str] = None
    request_id: Optional[str] = None
    deployment_version: Optional[str] = None
    dependency: Optional[str] = None
    status_code: Optional[int] = None
    latency: Optional[float] = None
    filename: Optional[str] = None
    line_number: Optional[int] = None
    source_location: Optional[str] = None  # e.g. "minioms.log | Line 183"
    metadata: Optional[Dict[str, Any]] = None

class IngestSummary(BaseModel):
    data_origin: str = "UPLOADED_DATA"  # "UPLOADED_DATA" or "DEMO_DATA"
    logs_count: int
    metrics_count: int
    traces_count: int
    deployments_count: int
    services_count: int
    uploaded_files: List[str] = []

class IncidentPackage(BaseModel):
    incident_id: str
    title: str
    description: str
    timestamp_start: str
    affected_services: List[str]
    telemetry: List[TelemetryItem]

class Hypothesis(BaseModel):
    id: str
    title: str
    description: str
    confidence: float  # 0.0 - 100.0% derived from signal evidence
    supporting_evidence: List[Dict[str, Any]]
    contradicting_evidence: List[Dict[str, Any]]
    supporting_signal_count: int
    contradictory_signal_count: int
    status: str  # LEADING, PLAUSIBLE, UNLIKELY, REJECTED, VERIFIED
    evidence_verified: bool = True

class SeverityBreakdown(BaseModel):
    level: str  # CRITICAL, HIGH, MEDIUM, LOW
    score: float
    summary_text: str
    reasons: List[str]
    impacted_services_count: int
    error_rate_percent: Optional[float] = None
    p95_latency_ms: Optional[float] = None
    db_utilization_percent: Optional[float] = None
    not_available_fields: List[str] = []

class TimelineEvent(BaseModel):
    timestamp: str
    service: str
    source: str
    event_type: str
    description: str
    severity: str
    source_location: Optional[str] = None  # e.g. "minioms.log | Line 183"

class InvestigationResult(BaseModel):
    incident_id: str
    data_origin: str = "UPLOADED_DATA"
    timeline: List[TimelineEvent]
    severity: SeverityBreakdown
    hypotheses: List[Hypothesis]
    affected_services: List[str]
    anomalies_detected: List[Dict[str, Any]]
    status: str  # COMPLETED, INSUFFICIENT_EVIDENCE

class VerificationResult(BaseModel):
    incident_id: str
    data_origin: str = "UPLOADED_DATA"
    leading_hypothesis_id: str
    status: str  # VERIFIED, PARTIALLY_VERIFIED, INSUFFICIENT_EVIDENCE, REJECTED
    confidence_score: float
    verified_root_cause: str
    rationale: str
    eliminated_hypotheses: List[Dict[str, Any]]
    missing_telemetry_required: List[str]
    temporal_correlation_score: float
    cross_metric_correlation_score: float

class RemediationPlan(BaseModel):
    plan_id: str
    incident_id: str
    data_origin: str = "UPLOADED_DATA"
    action: str  # ROLLBACK_SERVICE, RESTART_SERVICE, RESTORE_CONFIG, SCALE_SERVICE, DISABLE_FEATURE, RESTART_DEPENDENCY, CLEAR_QUEUE
    target_service: str
    reason: str
    expected_effects: List[str]
    risk_level: str  # LOW, MEDIUM, HIGH
    blast_radius: str
    preconditions: List[str]
    compatibility_checked: bool
    rollback_procedure: str
    validation_criteria: Dict[str, Any]
    parameter_overrides: Optional[Dict[str, Any]] = None

class MetricSnapshot(BaseModel):
    error_rate_percent: Optional[float] = None
    p95_latency_ms: Optional[float] = None
    p50_latency_ms: Optional[float] = None
    p99_latency_ms: Optional[float] = None
    throughput_rpm: Optional[float] = None
    cpu_utilization_percent: Optional[float] = None
    memory_utilization_percent: Optional[float] = None
    db_utilization_percent: Optional[float] = None
    dependency_error_rate_percent: Optional[float] = None
    restart_count: int = 0

class ExperimentResult(BaseModel):
    experiment_id: str
    plan_id: str
    data_origin: str = "UPLOADED_DATA"
    action_tested: str
    target_service: str
    baseline_metrics: MetricSnapshot
    post_remediation_metrics: MetricSnapshot
    workload_profile: str
    duration_seconds: float

class ValidationReport(BaseModel):
    experiment_id: str
    data_origin: str = "UPLOADED_DATA"
    overall_status: str  # PASSED, FAILED
    slos_checked: List[Dict[str, Any]]
    before_vs_after: Dict[str, Dict[str, Any]]
    summary: str

class ChangeTicket(BaseModel):
    ticket_id: str  # CHG-1024
    system: str     # ServiceNow / Azure DevOps
    incident_id: str
    data_origin: str = "UPLOADED_DATA"
    proposed_action: str
    reason: str
    root_cause_hypothesis: str
    evidence_summary: List[str]
    sandbox_result: str # PASSED / FAILED
    before_metrics: Dict[str, Any]
    after_metrics: Dict[str, Any]
    risk_level: str
    rollback_plan: str
    approver_name: str
    approval_time: str
    status: str     # CREATED, APPROVED, EXECUTING, VERIFIED, ROLLED_BACK
    created_at: str

class HumanApprovalRequest(BaseModel):
    plan_id: str
    approved: bool
    approved_by: str
    comment: Optional[str] = None

class AuditTableRow(BaseModel):
    timestamp: str
    agent: str
    step_action: str
    model_version: str
    tier: str
    tokens: int
    cost_usd: float
    latency_ms: float
    otel_span_id: str
    is_simulated: bool = True

class ExecutionResult(BaseModel):
    execution_id: str
    plan_id: str
    data_origin: str = "UPLOADED_DATA"
    change_ticket_id: str
    action: str
    target_service: str
    status: str  # EXECUTED_SUCCESS, EXECUTED_FAILED, ROLLED_BACK
    execution_timeline: List[Dict[str, Any]]
    final_health_status: str
    post_execution_metrics: MetricSnapshot
    change_ticket: Optional[ChangeTicket] = None
    audit_table: List[AuditTableRow] = []

class RoutingDecision(BaseModel):
    risk_level: str
    uncertainty_level: str
    selected_model: str
    model_provider: str
    reasoning: str
    estimated_cost_usd: float
    latency_ms: float
    model_calls: int = 4

class ConnectorConfig(BaseModel):
    id: str
    name: str  # Prometheus, Grafana, OpenTelemetry, Azure Monitor
    type: str
    endpoint_url: Optional[str] = None
    is_live: bool = False
    status: str = "CONNECTED_SIMULATED"
    telemetry_types: List[str]

class AuditLogEntry(BaseModel):
    timestamp: str
    event_type: str
    agent_or_component: str
    action: str
    details: Dict[str, Any]
    status: str

class BenchmarkResult(BaseModel):
    scenario_id: str
    title: str
    approach: str  # RULES_BASED, MULTI_STAGE_AGENTIC
    correct_root_cause: bool
    time_to_diagnosis_sec: float
    remediation_success: bool
    false_positive: bool
    cost_usd: float
    confidence_score: float
    is_sample_demo: bool = True
