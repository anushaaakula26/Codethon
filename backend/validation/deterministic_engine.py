from typing import Dict, Any, List
from backend.schemas import ExperimentResult, ValidationReport

class DeterministicValidationEngine:
    """
    DETERMINISTIC VALIDATION ENGINE:
    Calculates PASS or FAILED based strictly on code-measured SLO criteria comparisons.
    No LLM guessing or hardcoded opinions.
    """

    def validate(self, experiment: ExperimentResult, criteria: Dict[str, Any]) -> ValidationReport:
        b = experiment.baseline_metrics
        a = experiment.post_remediation_metrics

        max_err = criteria.get("max_error_rate_percent", 5.0)
        max_lat = criteria.get("max_p95_latency_ms", 500.0)
        max_db = criteria.get("max_db_utilization_percent", 80.0)
        min_tp = criteria.get("min_throughput_rpm", 500.0)

        slos_checked = []

        # SLO 1: Error Rate
        err_passed = a.error_rate_percent <= max_err
        slos_checked.append({
            "name": "HTTP Error Rate SLO",
            "metric": "error_rate_percent",
            "threshold": f"<= {max_err}%",
            "before_val": f"{b.error_rate_percent}%",
            "after_val": f"{a.error_rate_percent}%",
            "passed": err_passed
        })

        # SLO 2: Latency
        lat_passed = a.p95_latency_ms <= max_lat
        slos_checked.append({
            "name": "P95 Latency SLO",
            "metric": "p95_latency_ms",
            "threshold": f"<= {max_lat}ms",
            "before_val": f"{b.p95_latency_ms}ms",
            "after_val": f"{a.p95_latency_ms}ms",
            "passed": lat_passed
        })

        # SLO 3: DB Utilization
        db_passed = a.db_utilization_percent <= max_db
        slos_checked.append({
            "name": "DB Pool Utilization SLO",
            "metric": "db_utilization_percent",
            "threshold": f"<= {max_db}%",
            "before_val": f"{b.db_utilization_percent}%",
            "after_val": f"{a.db_utilization_percent}%",
            "passed": db_passed
        })

        # SLO 4: Throughput
        tp_passed = a.throughput_rpm >= min_tp
        slos_checked.append({
            "name": "System Throughput SLO",
            "metric": "throughput_rpm",
            "threshold": f">= {min_tp} rpm",
            "before_val": f"{b.throughput_rpm} rpm",
            "after_val": f"{a.throughput_rpm} rpm",
            "passed": tp_passed
        })

        overall_passed = all([err_passed, lat_passed, db_passed, tp_passed])

        before_vs_after = {
            "error_rate_percent": {"before": b.error_rate_percent, "after": a.error_rate_percent, "unit": "%", "improved": err_passed},
            "p95_latency_ms": {"before": b.p95_latency_ms, "after": a.p95_latency_ms, "unit": "ms", "improved": lat_passed},
            "db_utilization_percent": {"before": b.db_utilization_percent, "after": a.db_utilization_percent, "unit": "%", "improved": db_passed},
            "throughput_rpm": {"before": b.throughput_rpm, "after": a.throughput_rpm, "unit": "rpm", "improved": tp_passed}
        }

        if overall_passed:
            summary = "VALIDATION PASSED: Proposed intervention successfully satisfied all 4 SLO health contracts in sandbox workload experiment."
        else:
            failed_names = [s["name"] for s in slos_checked if not s["passed"]]
            summary = f"VALIDATION FAILED: Proposed intervention failed health contract on: {', '.join(failed_names)}. System health degraded or did not improve sufficiently."

        return ValidationReport(
            experiment_id=experiment.experiment_id,
            overall_status="PASSED" if overall_passed else "FAILED",
            slos_checked=slos_checked,
            before_vs_after=before_vs_after,
            summary=summary
        )

deterministic_validator = DeterministicValidationEngine()
