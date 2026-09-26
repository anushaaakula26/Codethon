from datetime import datetime
from typing import List, Dict, Any
from backend.schemas import AuditLogEntry

class AuditTrail:
    """
    Complete Audit Trail Logger:
    Records every critical event in the diagnosis and self-validation workflow with exact ISO timestamps.
    """

    def __init__(self):
        self.logs: List[AuditLogEntry] = []

    def log(self, event_type: str, agent_or_component: str, action: str, details: Dict[str, Any], status: str = "SUCCESS"):
        ts = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S.%f")[:-3]
        entry = AuditLogEntry(
            timestamp=ts,
            event_type=event_type,
            agent_or_component=agent_or_component,
            action=action,
            details=details,
            status=status
        )
        self.logs.append(entry)

    def get_logs(self, limit: int = 100) -> List[AuditLogEntry]:
        return self.logs[-limit:]

audit_trail = AuditTrail()
