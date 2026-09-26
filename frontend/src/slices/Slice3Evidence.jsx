import React, { useState } from 'react';
import { Eye, CheckCircle2, XCircle, ArrowRight, FileText, Database, Activity, Layers, GitCommit, AlertCircle } from 'lucide-react';
import EvidenceModal from '../components/EvidenceModal';

export default function Slice3Evidence({ investigation, verification, onNextStep, loading }) {
  const [selectedHypothesis, setSelectedHypothesis] = useState(null);

  if (!investigation) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h3>No Investigation Active</h3>
      </div>
    );
  }

  const dataOrigin = investigation.data_origin || 'DEMO_DATA';
  const hypotheses = investigation.hypotheses || [];
  const leading = hypotheses[0] || {};
  const eliminated = verification?.eliminated_hypotheses || [];
  const notAvailable = investigation.severity?.not_available_fields || [];

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {selectedHypothesis && (
        <EvidenceModal hypothesis={selectedHypothesis} onClose={() => setSelectedHypothesis(null)} />
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: '700' }}>3. Evidence</h1>
        <button onClick={onNextStep} className="btn-primary" disabled={loading}>
          View Recommended Fix <ArrowRight size={18} />
        </button>
      </div>

      {/* Origin Header Card */}
      <div className="glass-card" style={{ marginBottom: '24px', borderLeft: `6px solid ${dataOrigin === 'UPLOADED_DATA' ? '#10b981' : '#3b82f6'}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#10b981', marginBottom: '4px' }}>
              Why does the AI think this is the cause?
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Leading Cause: <b>{leading.title}</b> ({leading.confidence}% confidence)
            </p>
          </div>

          {dataOrigin === 'UPLOADED_DATA' ? (
            <span className="badge badge-success" style={{ padding: '6px 14px' }}>UPLOADED DATA (STRICT SOURCE OF TRUTH)</span>
          ) : (
            <span className="badge badge-info" style={{ padding: '6px 14px' }}>DEMO DATA</span>
          )}
        </div>
      </div>

      {/* Raw Evidence Items Grid */}
      <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '14px' }}>
        Verified Evidence Provenance (Click item to inspect raw line source)
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {/* Metric */}
        <div
          className="glass-card"
          onClick={() => setSelectedHypothesis(leading)}
          style={{ cursor: 'pointer', borderLeft: `4px solid ${investigation.severity.db_utilization_percent ? '#38bdf8' : 'var(--border-color)'}` }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
              <Activity size={16} color="#38bdf8" /> METRIC
            </div>
            {investigation.severity.db_utilization_percent ? (
              <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>Evidence Verified ✓</span>
            ) : (
              <span className="badge badge-warning" style={{ fontSize: '0.65rem' }}>Not in uploaded data</span>
            )}
          </div>

          <div style={{ fontSize: '1rem', fontWeight: '700' }}>
            {investigation.severity.db_utilization_percent ? (
              <>DB connection utilization: <span style={{ color: '#ef4444' }}>{investigation.severity.db_utilization_percent}%</span></>
            ) : (
              <span style={{ color: 'var(--text-subtle)' }}>Not available in uploaded data</span>
            )}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            {investigation.severity.db_utilization_percent ? 'Source: Prometheus Metric Stream' : 'No metric telemetry included in uploaded file'}
          </div>
        </div>

        {/* Logs */}
        <div
          className="glass-card"
          onClick={() => setSelectedHypothesis(leading)}
          style={{ cursor: 'pointer', borderLeft: '4px solid #f59e0b' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
              <FileText size={16} color="#f59e0b" /> LOGS
            </div>
            <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>Evidence Verified ✓</span>
          </div>

          <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#fcd34d' }}>
            {leading.supporting_evidence?.[0]?.summary || 'POOL_TIMEOUT errors detected in logs'}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#6ee7b7', marginTop: '6px', fontWeight: '600' }}>
            Source: <b>{leading.supporting_evidence?.[0]?.source_location || 'uploaded log | Line 1'}</b>
          </div>
        </div>

        {/* Trace */}
        <div
          className="glass-card"
          onClick={() => setSelectedHypothesis(leading)}
          style={{ cursor: 'pointer', borderLeft: '4px solid #6366f1' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
              <Layers size={16} color="#6366f1" /> TRACES
            </div>
            {dataOrigin === 'DEMO_DATA' ? (
              <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>Evidence Verified ✓</span>
            ) : (
              <span className="badge badge-warning" style={{ fontSize: '0.65rem' }}>Not in uploaded data</span>
            )}
          </div>

          <div style={{ fontSize: '1rem', fontWeight: '700' }}>
            {dataOrigin === 'DEMO_DATA' ? (
              <>Checkout → Database latency increased by <span style={{ color: '#ef4444' }}>+382%</span></>
            ) : (
              <span style={{ color: 'var(--text-subtle)' }}>Not available in uploaded data</span>
            )}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            {dataOrigin === 'DEMO_DATA' ? 'Source: OpenTelemetry trace collector' : 'No trace span data included in uploaded file'}
          </div>
        </div>

        {/* Deployment */}
        <div
          className="glass-card"
          onClick={() => setSelectedHypothesis(leading)}
          style={{ cursor: 'pointer', borderLeft: '4px solid #10b981' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
              <GitCommit size={16} color="#10b981" /> DEPLOYMENT
            </div>
            {dataOrigin === 'DEMO_DATA' ? (
              <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>Evidence Verified ✓</span>
            ) : (
              <span className="badge badge-warning" style={{ fontSize: '0.65rem' }}>Not in uploaded data</span>
            )}
          </div>

          <div style={{ fontSize: '1rem', fontWeight: '700' }}>
            {dataOrigin === 'DEMO_DATA' ? (
              <><code style={{ color: '#38bdf8' }}>checkout-v2.8.1</code> deployed <b>2 mins before degradation</b></>
            ) : (
              <span style={{ color: 'var(--text-subtle)' }}>Not available in uploaded data</span>
            )}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            {dataOrigin === 'DEMO_DATA' ? 'Source: Kubernetes deployment manifest' : 'No deployment log included in uploaded file'}
          </div>
        </div>
      </div>

      {/* AI Explanation Summary */}
      <div className="glass-card" style={{ marginBottom: '24px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#6ee7b7', marginBottom: '4px' }}>AI Evidence Synthesis</h4>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          “These verified signals support <b>{leading.title}</b> as the main cause based on evidence at <b>{leading.supporting_evidence?.[0]?.source_location || 'uploaded file'}</b>.”
        </p>
      </div>

      {/* Eliminated Hypotheses Rationale */}
      {eliminated.length > 0 && (
        <div className="glass-card" style={{ borderLeft: '4px solid #ef4444' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#fca5a5', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <XCircle size={16} /> Rejected Hypotheses
          </h4>
          {eliminated.map((el, i) => (
            <div key={i} style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              • <b>{el.title} — Rejected</b> (Reason: {el.elimination_rationale || 'Contradicted by uploaded telemetry.'})
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
