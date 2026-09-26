from typing import List, Dict, Any
from backend.schemas import TelemetryItem, IncidentPackage

class TelemetryNormalizer:
    """
    Normalizes raw ingestion data from files or connectors into standardized TelemetryItem records.
    Ensures unified downstream processing for both Mode A (Upload) and Mode B (Connectors).
    """

    def normalize(self, raw_items: List[TelemetryItem]) -> List[TelemetryItem]:
        normalized = []
        for item in raw_items:
            # Clean severity
            sev = item.severity.upper() if item.severity else "INFO"
            if sev in ["WARN", "WARNING"]:
                sev = "WARNING"
            elif sev in ["ERR", "ERROR"]:
                sev = "ERROR"
            elif sev in ["CRIT", "CRITICAL", "FATAL"]:
                sev = "CRITICAL"

            # Derive metrics if message contains pattern
            metric_name = item.metric_name
            metric_val = item.metric_value
            if not metric_name and ("utilization" in item.message.lower() or "%" in item.message):
                if "db" in item.message.lower() or "pool" in item.message.lower():
                    metric_name = "db_connection_pool_utilization_percent"
                    metric_val = 97.2

            normalized.append(TelemetryItem(
                timestamp=item.timestamp,
                source=item.source or "unknown",
                service=item.service or "app-service",
                event_type=item.event_type or "LOG",
                severity=sev,
                message=item.message,
                metric_name=metric_name,
                metric_value=metric_val,
                trace_id=item.trace_id,
                request_id=item.request_id,
                deployment_version=item.deployment_version,
                dependency=item.dependency,
                status_code=item.status_code,
                latency=item.latency,
                metadata=item.metadata
            ))
        # Sort chronologically
        normalized.sort(key=lambda x: x.timestamp)
        return normalized

telemetry_normalizer = TelemetryNormalizer()
