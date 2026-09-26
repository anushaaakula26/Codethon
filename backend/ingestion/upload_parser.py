import json
import csv
import io
import re
from typing import List, Dict, Any
from backend.schemas import TelemetryItem

class UploadParser:
    """
    Parses arbitrary uploaded incident files (.log, .txt, .csv, .json, .jsonl).
    Extracts line numbers, file names, timestamps, severity, and messages accurately.
    Preserves exact line numbers (e.g. "minioms.log | Line 183") for evidence provenance.
    """

    def parse_file(self, filename: str, content: str) -> List[TelemetryItem]:
        items: List[TelemetryItem] = []
        ext = filename.split(".")[-1].lower() if "." in filename else ""

        if ext == "json":
            items = self._parse_json(filename, content)
        elif ext == "jsonl":
            items = self._parse_jsonl(filename, content)
        elif ext == "csv":
            items = self._parse_csv(filename, content)
        else:
            items = self._parse_log_text(filename, content)

        return items

    def _parse_json(self, filename: str, content: str) -> List[TelemetryItem]:
        items = []
        try:
            data = json.loads(content)
            if isinstance(data, dict):
                if "telemetry" in data and isinstance(data["telemetry"], list):
                    data = data["telemetry"]
                else:
                    data = [data]

            for idx, d in enumerate(data, start=1):
                items.append(TelemetryItem(
                    timestamp=d.get("timestamp", "2026-09-26T10:00:00Z"),
                    source=d.get("source", "uploaded_json"),
                    service=d.get("service", "app-service"),
                    event_type=d.get("event_type", "LOG"),
                    severity=d.get("severity", "INFO"),
                    message=d.get("message", json.dumps(d)),
                    metric_name=d.get("metric_name"),
                    metric_value=d.get("metric_value"),
                    trace_id=d.get("trace_id"),
                    request_id=d.get("request_id"),
                    deployment_version=d.get("deployment_version"),
                    dependency=d.get("dependency"),
                    status_code=d.get("status_code"),
                    latency=d.get("latency"),
                    filename=filename,
                    line_number=idx,
                    source_location=f"{filename} | Line {idx}",
                    metadata=d.get("metadata")
                ))
        except Exception:
            items = self._parse_log_text(filename, content)
        return items

    def _parse_jsonl(self, filename: str, content: str) -> List[TelemetryItem]:
        items = []
        lines = content.strip().split("\n")
        for idx, line in enumerate(lines, start=1):
            line_str = line.strip()
            if not line_str:
                continue
            try:
                d = json.loads(line_str)
                items.append(TelemetryItem(
                    timestamp=d.get("timestamp", "2026-09-26T10:00:00Z"),
                    source=d.get("source", "uploaded_jsonl"),
                    service=d.get("service", "app-service"),
                    event_type=d.get("event_type", "LOG"),
                    severity=d.get("severity", "INFO"),
                    message=d.get("message", line_str),
                    metric_name=d.get("metric_name"),
                    metric_value=d.get("metric_value"),
                    trace_id=d.get("trace_id"),
                    filename=filename,
                    line_number=idx,
                    source_location=f"{filename} | Line {idx}"
                ))
            except Exception:
                items.append(TelemetryItem(
                    timestamp="2026-09-26T10:00:00Z",
                    source="uploaded_text",
                    service="app-service",
                    event_type="LOG",
                    severity="INFO",
                    message=line_str,
                    filename=filename,
                    line_number=idx,
                    source_location=f"{filename} | Line {idx}"
                ))
        return items

    def _parse_csv(self, filename: str, content: str) -> List[TelemetryItem]:
        items = []
        try:
            reader = csv.DictReader(io.StringIO(content))
            for idx, row in enumerate(reader, start=2): # 1 is header
                items.append(TelemetryItem(
                    timestamp=row.get("timestamp", "2026-09-26T10:00:00Z"),
                    source=row.get("source", filename),
                    service=row.get("service", "app-service"),
                    event_type=row.get("event_type", "LOG"),
                    severity=row.get("severity", "INFO"),
                    message=row.get("message", str(row)),
                    metric_name=row.get("metric_name") if row.get("metric_name") else None,
                    metric_value=float(row["metric_value"]) if row.get("metric_value") and row["metric_value"].replace('.', '', 1).isdigit() else None,
                    filename=filename,
                    line_number=idx,
                    source_location=f"{filename} | Line {idx}"
                ))
        except Exception:
            items = self._parse_log_text(filename, content)
        return items

    def _parse_log_text(self, filename: str, content: str) -> List[TelemetryItem]:
        items = []
        lines = content.strip().split("\n")
        timestamp_regex = re.compile(r'(\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}(?:\.\d+)?Z?)')
        severity_regex = re.compile(r'\b(INFO|WARN|WARNING|ERROR|CRITICAL|FATAL)\b', re.IGNORECASE)

        for idx, line in enumerate(lines, start=1):
            line_str = line.strip()
            if not line_str:
                continue

            ts_match = timestamp_regex.search(line_str)
            ts = ts_match.group(1) if ts_match else "2026-09-26T10:00:00Z"

            sev_match = severity_regex.search(line_str)
            sev = sev_match.group(1).upper() if sev_match else "INFO"
            if sev == "WARN":
                sev = "WARNING"

            # Service identification heuristics from text
            service = "checkout-service" if "checkout" in line_str.lower() else ("database-cluster" if "db" in line_str.lower() or "pool" in line_str.lower() else "system")

            items.append(TelemetryItem(
                timestamp=ts,
                source=filename,
                service=service,
                event_type="LOG",
                severity=sev,
                message=line_str,
                filename=filename,
                line_number=idx,
                source_location=f"{filename} | Line {idx}"
            ))
        return items

upload_parser = UploadParser()
