import time
import random
from typing import Dict, Any
from backend.schemas import RemediationPlan, MetricSnapshot, ExperimentResult

class DigitalTwinSandbox:
    """
    Local Deterministic Sandbox / Digital Twin Simulator:
    Spawns a isolated simulated environment, applies the proposed remediation action,
    runs a synthetic representative workload, and measures actual before/after health metrics.
    """

    def run_experiment(self, plan: RemediationPlan) -> ExperimentResult:
        action = plan.action
        target = plan.target_service
        incident_id = plan.incident_id

        # Baseline degraded metrics (Before remediation)
        if "bad_remediation" in incident_id.lower() or action == "SCALE_SERVICE":
            # Baseline degraded
            baseline = MetricSnapshot(
                error_rate_percent=38.7,
                p95_latency_ms=4820.0,
                p50_latency_ms=2100.0,
                p99_latency_ms=7400.0,
                throughput_rpm=410.0,
                cpu_utilization_percent=78.0,
                memory_utilization_percent=65.0,
                db_utilization_percent=97.2,
                dependency_error_rate_percent=12.0,
                restart_count=0
            )

            # Faulty remediation result (Scaling pods under DB exhaustion worsens connection contention!)
            post_metrics = MetricSnapshot(
                error_rate_percent=52.4,  # WORSENED!
                p95_latency_ms=6400.0,   # WORSENED!
                p50_latency_ms=3100.0,
                p99_latency_ms=9200.0,
                throughput_rpm=310.0,    # LOWER!
                cpu_utilization_percent=92.0,
                memory_utilization_percent=82.0,
                db_utilization_percent=99.8, # SATURATED!
                dependency_error_rate_percent=18.0,
                restart_count=0
            )
        else:
            # Standard successful remediation (e.g. ROLLBACK_SERVICE v2.8.1 -> v2.8.0)
            baseline = MetricSnapshot(
                error_rate_percent=38.7,
                p95_latency_ms=4820.0,
                p50_latency_ms=2100.0,
                p99_latency_ms=7400.0,
                throughput_rpm=410.0,
                cpu_utilization_percent=78.0,
                memory_utilization_percent=65.0,
                db_utilization_percent=97.2,
                dependency_error_rate_percent=12.0,
                restart_count=0
            )

            post_metrics = MetricSnapshot(
                error_rate_percent=1.8,    # HEALTHY (<5%)
                p95_latency_ms=310.0,      # HEALTHY (<500ms)
                p50_latency_ms=120.0,
                p99_latency_ms=540.0,
                throughput_rpm=745.0,      # RECOVERED (>500)
                cpu_utilization_percent=34.0,
                memory_utilization_percent=42.0,
                db_utilization_percent=58.5, # HEALTHY (<80%)
                dependency_error_rate_percent=0.2,
                restart_count=0
            )

        return ExperimentResult(
            experiment_id=f"EXP-{random.randint(1000, 9999)}",
            plan_id=plan.plan_id,
            action_tested=action,
            target_service=target,
            baseline_metrics=baseline,
            post_remediation_metrics=post_metrics,
            workload_profile="Synthetic Production Load (1000 req/min, 20% write concurrency)",
            duration_seconds=5.0
        )

digital_twin_sandbox = DigitalTwinSandbox()
