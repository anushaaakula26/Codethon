import React, { useEffect, useState } from 'react';
import { FileText, RefreshCw, Clock, Tag, ShieldCheck } from 'lucide-react';

export default function AuditView() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = () => {
    setLoading(true);
    fetch('http://localhost:8000/api/audit')
      .then((res) => res.json())
      .then((json) => {
        setLogs(json.reverse()); // latest first
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load audit trail:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div style={{ padding: '28px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div className="glass-card glass-card-accent" style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
            <FileText size={28} color="#6366f1" />
            <h1 style={{ fontSize: '1.6rem', fontWeight: '800' }}>Immutable System Audit Trail</h1>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Complete timestamped record of ingestion, investigation, verification, sandbox experiments, human approvals, and target execution actions.
          </p>
        </div>

        <button onClick={fetchLogs} className="btn-secondary">
          <RefreshCw size={16} /> Refresh Log Stream
        </button>
      </div>

      {/* Log List */}
      <div className="glass-card">
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <RefreshCw size={30} color="#06b6d4" style={{ animation: 'spin 1s linear infinite' }} />
          </div>
        ) : logs.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-subtle)' }}>
            No audit events recorded yet. Run an investigation or experiment to generate audit history.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {logs.map((log, idx) => (
              <div key={idx} style={{
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '14px',
                display: 'flex',
                gap: '16px',
                alignItems: 'flex-start'
              }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-subtle)', minWidth: '170px' }}>
                  {log.timestamp}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span className="badge badge-info">{log.event_type}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#38bdf8' }}>{log.agent_or_component}</span>
                    <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>{log.status}</span>
                  </div>

                  <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#f8fafc', marginBottom: '4px' }}>
                    {log.action}
                  </div>

                  <div className="code-block" style={{ fontSize: '0.78rem', margin: 0, padding: '8px' }}>
                    {JSON.stringify(log.details)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
