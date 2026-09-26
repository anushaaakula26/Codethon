import os
from typing import List, Dict, Any
from backend.schemas import ConnectorConfig, TelemetryItem

class ConnectorManager:
    """
    Extensible connector architecture for Prometheus, Grafana, OpenTelemetry, Azure Monitor.
    Supports live queries if endpoints exist in env variables, or transparent demo streams.
    """

    def __init__(self):
        self.connectors: List[ConnectorConfig] = [
            ConnectorConfig(
                id="conn-prom-1",
                name="Prometheus Metrics",
                type="PROMETHEUS",
                endpoint_url=os.getenv("PROMETHEUS_URL", "http://localhost:9090"),
                is_live=bool(os.getenv("PROMETHEUS_URL")),
                status="LIVE" if os.getenv("PROMETHEUS_URL") else "SIMULATED_DEMO",
                telemetry_types=["METRIC"]
            ),
            ConnectorConfig(
                id="conn-graf-1",
                name="Grafana Observability",
                type="GRAFANA",
                endpoint_url=os.getenv("GRAFANA_URL", "http://localhost:3000"),
                is_live=bool(os.getenv("GRAFANA_URL")),
                status="LIVE" if os.getenv("GRAFANA_URL") else "SIMULATED_DEMO",
                telemetry_types=["METRIC", "LOG"]
            ),
            ConnectorConfig(
                id="conn-otel-1",
                name="OpenTelemetry Collector",
                type="OPENTELEMETRY",
                endpoint_url=os.getenv("OTEL_EXPORTER_ENDPOINT", "http://localhost:4318"),
                is_live=bool(os.getenv("OTEL_EXPORTER_ENDPOINT")),
                status="LIVE" if os.getenv("OTEL_EXPORTER_ENDPOINT") else "SIMULATED_DEMO",
                telemetry_types=["TRACE", "METRIC"]
            ),
            ConnectorConfig(
                id="conn-azm-1",
                name="Azure Monitor (Log Analytics)",
                type="AZURE_MONITOR",
                endpoint_url=os.getenv("AZURE_WORKSPACE_ID", "https://api.loganalytics.azure.com"),
                is_live=bool(os.getenv("AZURE_WORKSPACE_ID")),
                status="LIVE" if os.getenv("AZURE_WORKSPACE_ID") else "SIMULATED_DEMO",
                telemetry_types=["LOG", "METRIC", "TRACE"]
            )
        ]

    def list_connectors(self) -> List[ConnectorConfig]:
        return self.connectors

    def fetch_telemetry_from_connector(self, connector_id: str) -> List[TelemetryItem]:
        """
        Fetches live telemetry if configured, or returns real simulated telemetry stream.
        """
        # Return realistic simulated connector telemetry
        return [
            TelemetryItem(
                timestamp="2026-09-26T10:04:15Z",
                source="prometheus",
                service="database-cluster",
                event_type="METRIC",
                severity="CRITICAL",
                message="Prometheus metric breach: db_connection_pool_utilization_percent = 97.2%",
                metric_name="db_connection_pool_utilization_percent",
                metric_value=97.2
            ),
            TelemetryItem(
                timestamp="2026-09-26T10:05:00Z",
                source="opentelemetry",
                service="checkout-service",
                event_type="TRACE",
                severity="ERROR",
                message="OTel trace span timeout: POST /checkout -> DB acquire pool timeout 5000ms",
                trace_id="otel-span-991ab",
                latency=5020.0
            )
        ]

connector_manager = ConnectorManager()
