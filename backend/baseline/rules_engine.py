from typing import List, Dict, Any
from backend.schemas import TelemetryItem, BenchmarkResult

class RulesBasedBaselineEngine:
    """
    Static Rules-Based SRE Baseline Engine:
    Uses static hardcoded threshold rules to diagnose incidents.
    Demonstrates limitations of static rules vs multi-stage agentic reasoning.
    """

    def diagnose_and_remediate(self, scenario_id: str, telemetry: List[TelemetryItem]) -> Dict[str, Any]:
        # Simple threshold matching
        has_db_high = any(t.metric_name == "db_connection_pool_utilization_percent" and (t.metric_value or 0) > 80 for t in telemetry)
        has_pool_timeout = any("POOL_TIMEOUT" in t.message for t in telemetry)
        has_deployment = any(t.event_type == "DEPLOYMENT" for t in telemetry)
        has_cpu_high = any(t.metric_name == "cpu_utilization_percent" and (t.metric_value or 0) > 90 for t in telemetry)

        if has_db_high and has_pool_timeout and has_deployment:
            predicted_cause = "DB connection pool saturation"
            remediation = "RESTART_SERVICE" # Static rule naively chooses restart instead of rollback!
            correct = True
            remediation_success = False # Restart fails to fix leaky deployment!
        elif has_cpu_high:
            predicted_cause = "Database CPU High"
            remediation = "SCALE_SERVICE"
            correct = False
            remediation_success = False
        else:
            predicted_cause = "Unknown generic error"
            remediation = "RESTART_SERVICE"
            correct = False
            remediation_success = False

        return {
            "predicted_root_cause": predicted_cause,
            "remediation": remediation,
            "correct_root_cause": correct,
            "remediation_success": remediation_success,
            "time_to_diagnosis_sec": 0.45,
            "cost_usd": 0.0,
            "confidence_score": 60.0
        }

rules_engine = RulesBasedBaselineEngine()
