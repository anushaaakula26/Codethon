import React from 'react';
import { Search, AlertTriangle, Clock, HelpCircle, ArrowRight } from 'lucide-react';

export default function Slice2Investigate({ investigation, verification, onNextStep, loading }) {
  if (!investigation) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h3>No Incident Data Loaded</h3>
        <p style={{ color: 'var(--text-muted)' }}>Load a scenario or upload data in Slice 1 to start investigation.</p>
      </div>
    );
  }

  const sev = investigation.severity || {};
  const hypotheses = investigation.hypotheses || [];
  const timeline = investigation.timeline || [];

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: '700' }}>2. Investigate the Incident</h1>
        <button onClick={onNextStep} className="btn-primary" disabled={loading}>
          View Evidence <ArrowRight size={18} />
        </button>
      </div>

      {/* Incident Summary Card */}
      <div className="glass-card" style={{ marginBottom: '24px', borderLeft: `6px solid ${sev.level === 'CRITICAL' ? '#ef4444' : '#f59e0b'}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className={`badge ${sev.level === 'CRITICAL' ? 'badge-critical' : 'badge-warning'}`}>
              Severity: {sev.level || 'HIGH'}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Incident ID: <b>{investigation.incident_id}</b></span>
          </div>
        </div>

        <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#ffffff', marginBottom: '6px' }}>
          What is happening?
        </h2>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
          “{sev.summary_text || 'Checkout requests are failing and response time has increased.'}”
        </p>
      </div>

      {/* Insufficient Evidence Banner (if applicable) */}
      {verification?.status === 'INSUFFICIENT_EVIDENCE' && (
        <div className="glass-card" style={{ marginBottom: '24px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#fcd34d' }}>
            <HelpCircle size={28} />
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '700' }}>Not enough evidence yet</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Required missing telemetry: <b>{verification.missing_telemetry_required?.join(', ') || 'Distributed traces between Checkout and Database'}</b>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Split Grid: Timeline + Possible Causes */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Timeline */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={20} color="#6366f1" /> Incident Timeline
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {timeline.slice(0, 6).map((ev, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '12px', padding: '10px', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-subtle)', minWidth: '55px' }}>
                  {ev.timestamp ? ev.timestamp.split('T')[1]?.substring(0, 5) : '10:02'}
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>
                  {ev.description}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Ranked Hypotheses */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Search size={20} color="#06b6d4" /> Possible Causes (Ranked)
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {hypotheses.map((h, idx) => (
              <div key={h.id} style={{
                background: idx === 0 ? 'rgba(16, 185, 129, 0.08)' : 'rgba(15, 23, 42, 0.4)',
                border: `1px solid ${idx === 0 ? 'rgba(16, 185, 129, 0.4)' : 'var(--border-color)'}`,
                borderRadius: '8px',
                padding: '14px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <div style={{ fontSize: '0.95rem', fontWeight: '700', color: idx === 0 ? '#6ee7b7' : '#f8fafc' }}>
                    {idx + 1}. {h.title}
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '800', color: idx === 0 ? '#10b981' : 'var(--text-muted)' }}>
                    {h.confidence}%
                  </div>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Signals: +{h.supporting_signal_count} supporting | -{h.contradictory_signal_count} contradicting
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
