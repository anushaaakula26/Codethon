import React from 'react';
import { X, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

export default function EvidenceModal({ hypothesis, onClose }) {
  if (!hypothesis) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-info">{hypothesis.id}</span>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Evidence Provenance: {hypothesis.title}</h2>
            </div>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Confidence: {hypothesis.confidence}% | Derived from {hypothesis.supporting_signal_count} supporting telemetry signals
            </span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        {/* Supporting Evidence List */}
        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981' }}>
          <CheckCircle2 size={18} /> Verified Supporting Telemetry Signals
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          {hypothesis.supporting_evidence && hypothesis.supporting_evidence.length > 0 ? (
            hypothesis.supporting_evidence.map((ev, idx) => (
              <div key={idx} className="code-block" style={{ borderLeft: '4px solid #10b981' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.75rem', marginBottom: '4px' }}>
                  <span>SOURCE: <b>[{ev.source_type || 'TELEMETRY'}]</b> | SERVICE: <b>{ev.service}</b></span>
                  <span>TIMESTAMP: {ev.timestamp}</span>
                </div>
                <div style={{ color: '#f8fafc', fontSize: '0.88rem' }}>
                  {ev.summary}
                </div>
              </div>
            ))
          ) : (
            <div style={{ fontSize: '0.85rem', color: 'var(--text-subtle)' }}>No specific supporting snippets linked.</div>
          )}
        </div>

        {/* Contradicting Signals */}
        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444' }}>
          <AlertCircle size={18} /> Contradictory Telemetry Signals ({hypothesis.contradictory_signal_count})
        </h3>
        {hypothesis.contradictory_signal_count === 0 ? (
          <div style={{ padding: '10px 14px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', fontSize: '0.85rem', color: '#6ee7b7' }}>
            ✓ Zero contradictory telemetry signals detected across logs, metrics, or traces for this hypothesis.
          </div>
        ) : (
          <div style={{ fontSize: '0.85rem', color: 'var(--text-subtle)' }}>
            {hypothesis.contradictory_signal_count} signals contradict this explanation.
          </div>
        )}

        <div style={{ marginTop: '24px', textAlign: 'right' }}>
          <button onClick={onClose} className="btn-secondary">
            Close Drawer
          </button>
        </div>
      </div>
    </div>
  );
}
