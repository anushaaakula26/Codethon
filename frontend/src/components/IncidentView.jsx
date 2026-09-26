import React, { useState } from 'react';
import { Activity, AlertTriangle, ShieldCheck, Search, Clock, FileText, ArrowRight, Eye, CheckCircle2, HelpCircle, XCircle } from 'lucide-react';
import EvidenceModal from './EvidenceModal';

export default function IncidentView({ investigation, verification, onNextStep, loading }) {
  const [selectedHypothesis, setSelectedHypothesis] = useState(null);

  if (!investigation) {
    return (
      <div style={{ padding: '60px 28px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        <Activity size={48} color="var(--text-subtle)" style={{ marginBottom: '16px' }} />
        <h2 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '8px' }}>No Active Incident Loaded</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
          Select a pre-packaged scenario or upload an incident package on the <b>Data & Demo</b> tab to start investigation.
        </p>
      </div>
    );
  }

  const sev = investigation.severity || {};
  const hypotheses = investigation.hypotheses || [];
  const timeline = investigation.timeline || [];

  return (
    <div style={{ padding: '28px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Evidence Provenance Modal */}
      {selectedHypothesis && (
        <EvidenceModal
          hypothesis={selectedHypothesis}
          onClose={() => setSelectedHypothesis(null)}
        />
      )}

      {/* Incident Header Card */}
      <div className="glass-card" style={{ marginBottom: '24px', borderLeft: `6px solid ${sev.level === 'CRITICAL' ? '#ef4444' : '#f59e0b'}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span className={`badge ${sev.level === 'CRITICAL' ? 'badge-critical' : 'badge-warning'}`}>
                {sev.level || 'HIGH'} SEVERITY
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Incident ID: <b>{investigation.incident_id}</b>
              </span>
            </div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: '800' }}>
              {verification?.verified_root_cause || hypotheses[0]?.title || 'Active Production Incident'}
            </h1>
            <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <span>Impacted Services: <b>{investigation.affected_services?.join(', ') || 'checkout-service'}</b></span>
              <span>•</span>
              <span>Events Analyzed: <b>{timeline.length}</b></span>
            </div>
          </div>

          <button
            onClick={onNextStep}
            className="btn-primary"
            style={{ fontSize: '0.95rem', padding: '12px 24px' }}
            disabled={loading}
          >
            Proceed to Sandbox Experiment <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Insufficient Evidence Warning Banner (if applicable) */}
      {verification?.status === 'INSUFFICIENT_EVIDENCE' && (
        <div className="glass-card" style={{ marginBottom: '24px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#fcd34d' }}>
            <HelpCircle size={28} />
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>⚠ INSUFFICIENT EVIDENCE — AI Agent Will Not Guess</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                Telemetry data is incomplete to deduce root cause with high certainty. Missing required telemetry: <b>{verification.missing_telemetry_required?.join(', ')}</b>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Investigation Split View */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Left Column: Evidence-Based Severity & Ranked Hypotheses */}
        <div>
          {/* Evidence-Based Severity Card */}
          <div className="glass-card" style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={20} color="#f59e0b" /> Evidence-Based Severity Breakdown
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>HTTP ERROR RATE</div>
                <div style={{ fontSize: '1.2rem', fontWeight: '700', color: sev.error_rate_percent > 20 ? '#ef4444' : '#10b981' }}>
                  {sev.error_rate_percent || 38.7}%
                </div>
              </div>

              <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>P95 LATENCY</div>
                <div style={{ fontSize: '1.2rem', fontWeight: '700', color: sev.p95_latency_ms > 1000 ? '#ef4444' : '#10b981' }}>
                  {sev.p95_latency_ms || 4820}ms
                </div>
              </div>

              <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>DB POOL UTIL</div>
                <div style={{ fontSize: '1.2rem', fontWeight: '700', color: sev.db_utilization_percent > 80 ? '#ef4444' : '#10b981' }}>
                  {sev.db_utilization_percent || 97.2}%
                </div>
              </div>

              <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>IMPACTED SERVICES</div>
                <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#06b6d4' }}>
                  {sev.impacted_services_count || 2}
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              <b>Severity Driver Rationale:</b> {sev.reasons?.join(' • ') || 'Error rate spike and database connection saturation'}
            </div>
          </div>

          {/* Multiple Ranked Hypotheses */}
          <div className="glass-card">
            <h2 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Search size={20} color="#06b6d4" /> Multiple Competing Hypotheses
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {hypotheses.map((h, idx) => (
                <div key={h.id} style={{
                  background: idx === 0 ? 'rgba(16, 185, 129, 0.08)' : 'rgba(15, 23, 42, 0.4)',
                  border: `1px solid ${idx === 0 ? 'rgba(16, 185, 129, 0.4)' : 'var(--border-color)'}`,
                  borderRadius: '10px',
                  padding: '16px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className={`badge ${idx === 0 ? 'badge-success' : 'badge-info'}`}>
                        {idx === 0 ? 'RANK 1 (LEADING)' : `RANK ${idx + 1}`}
                      </span>
                      <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>{h.title}</h3>
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '800', color: idx === 0 ? '#10b981' : 'var(--text-muted)' }}>
                      {h.confidence}% <span style={{ fontSize: '0.7rem', fontWeight: '400' }}>confidence</span>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                    {h.description}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>
                      Signals: <span style={{ color: '#10b981' }}>+{h.supporting_signal_count} supporting</span> | <span style={{ color: '#ef4444' }}>-{h.contradictory_signal_count} contradicting</span>
                    </div>

                    <button
                      onClick={() => setSelectedHypothesis(h)}
                      className="btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                    >
                      <Eye size={14} /> View Evidence Provenance
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Hypothesis Elimination Rationale */}
            {verification?.eliminated_hypotheses?.length > 0 && (
              <div style={{ marginTop: '20px', padding: '14px', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#fca5a5', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <XCircle size={16} /> Verification Agent Elimination Rationale
                </h4>
                {verification.eliminated_hypotheses.map((el, i) => (
                  <div key={i} style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    • <b>{el.title}:</b> {el.elimination_rationale}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Incident Timeline */}
        <div className="glass-card">
          <h2 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={20} color="#6366f1" /> Chronological Incident Timeline
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '700px', overflowY: 'auto', paddingRight: '6px' }}>
            {timeline.map((ev, idx) => (
              <div key={idx} style={{
                display: 'flex',
                gap: '12px',
                padding: '12px',
                background: 'rgba(15, 23, 42, 0.5)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                alignItems: 'flex-start'
              }}>
                <div style={{ minWidth: '95px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                  {ev.timestamp ? ev.timestamp.split('T')[1]?.replace('Z', '') : '10:02:10'}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span className={`badge ${ev.severity === 'CRITICAL' || ev.severity === 'ERROR' ? 'badge-critical' : 'badge-info'}`} style={{ fontSize: '0.65rem' }}>
                      {ev.severity}
                    </span>
                    <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#38bdf8' }}>{ev.service}</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>[{ev.source}]</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>
                    {ev.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
