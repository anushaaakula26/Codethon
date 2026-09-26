import React, { useState } from 'react';
import { Upload, Play, Database, Server, Radio, Cpu, ArrowRight, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function DashboardView({ onSelectScenario, onFileUpload, connectors, loading, onRunFullDemo }) {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = () => {
    if (selectedFile) {
      onFileUpload([selectedFile]);
    }
  };

  return (
    <div style={{ padding: '28px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Hero Header */}
      <div className="glass-card glass-card-accent" style={{ marginBottom: '28px', textAlign: 'center', padding: '36px' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '12px' }}>
          Agentic AI Incident Diagnosis & Self-Validated Remediation Platform
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', maxWidth: '850px', margin: '0 auto 24px auto' }}>
          Stop trusting AI predictions blindly. VeriFix SRE <b>experimentally tests proposed mitigations in a safe sandbox</b> against deterministic SLO contracts before permitting target execution.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
          <button
            onClick={() => onRunFullDemo('bad_deployment')}
            className="btn-primary"
            style={{ fontSize: '1rem', padding: '14px 28px', animation: 'pulse-glow 2s infinite' }}
            disabled={loading}
          >
            <Play size={20} /> Launch Interactive Demo Incident (Scenario 1)
          </button>
        </div>
      </div>

      {/* Main Grid: Upload + Connectors */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '28px' }}>
        {/* Upload Card */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Upload size={22} color="#06b6d4" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Ingestion Mode A: Upload Incident Package</h2>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Upload raw telemetry files (.log, .json, .csv, .oms). System extracts timelines, anomalies, and normalizes schema automatically.
          </p>

          <div
            style={{
              border: `2px dashed ${dragOver ? '#10b981' : 'var(--border-highlight)'}`,
              borderRadius: '12px',
              padding: '30px',
              textAlign: 'center',
              background: dragOver ? 'rgba(16, 185, 129, 0.05)' : 'rgba(15, 23, 42, 0.4)',
              cursor: 'pointer',
              marginBottom: '16px'
            }}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                onFileUpload(Array.from(e.dataTransfer.files));
              }
            }}
          >
            <Upload size={36} color="var(--text-muted)" style={{ marginBottom: '10px' }} />
            <div style={{ fontSize: '0.95rem', fontWeight: '600' }}>
              Drag & drop incident package files here
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', marginTop: '4px' }}>
              Supports .log, .json, .csv, .xml, MiniOMS log format
            </div>
            <input type="file" onChange={handleFileChange} style={{ marginTop: '12px' }} />
          </div>

          <button
            onClick={handleUploadSubmit}
            className="btn-secondary"
            style={{ width: '100%', justifyContent: 'center' }}
            disabled={!selectedFile || loading}
          >
            Analyze Uploaded Telemetry
          </button>
        </div>

        {/* Observability Connectors */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Radio size={22} color="#6366f1" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Ingestion Mode B: Observability Connectors</h2>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Query live telemetry streams or demo endpoints across enterprise observability tools.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {connectors.map((c) => (
              <div key={c.id} style={{
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>{c.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>{c.type}</div>
                </div>
                <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>
                  {c.status}
                </span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '20px', padding: '12px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '8px', fontSize: '0.8rem', color: '#93c5fd' }}>
            💡 Demo Mode active: Connectors stream pre-validated incident workloads without requiring cloud API tokens.
          </div>
        </div>
      </div>

      {/* Demo Incident Scenarios Section */}
      <h2 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Play size={22} color="#10b981" /> Pre-Packaged Demo Incident Scenarios
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Scenario 1 */}
        <div className="glass-card" style={{ borderLeft: '4px solid #ef4444' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
            <span className="badge badge-critical">CRITICAL</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>BAD_DEPLOYMENT</span>
          </div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '8px' }}>
            Scenario 1: Checkout Service v2.8.1 DB Pool Exhaustion
          </h3>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Release v2.8.1 introduces connection leaks in CheckoutSessionHandler, causing 97% pool saturation & HTTP 500 error spike to 38.7%.
          </p>
          <button
            onClick={() => onSelectScenario('bad_deployment')}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem' }}
            disabled={loading}
          >
            Investigate Scenario 1 <ArrowRight size={16} />
          </button>
        </div>

        {/* Scenario 2 */}
        <div className="glass-card" style={{ borderLeft: '4px solid #ef4444' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
            <span className="badge badge-critical">CRITICAL</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>DB_OVERLOAD</span>
          </div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '8px' }}>
            Scenario 2: Database CPU 99% Unindexed Search Lock
          </h3>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Unindexed catalog search queries consume 99% DB CPU causing Gateway 504 timeouts across product catalog endpoints.
          </p>
          <button
            onClick={() => onSelectScenario('db_overload')}
            className="btn-secondary"
            style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem' }}
            disabled={loading}
          >
            Investigate Scenario 2 <ArrowRight size={16} />
          </button>
        </div>

        {/* Scenario 3 */}
        <div className="glass-card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
            <span className="badge badge-warning">HIGH</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>NETWORK_DEPENDENCY</span>
          </div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '8px' }}>
            Scenario 3: Payment Gateway Timeout & Worker Thread Starvation
          </h3>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
            External gateway socket timeouts block 50 worker threads in payment-service causing HTTP 503 cascading failures.
          </p>
          <button
            onClick={() => onSelectScenario('network_dependency')}
            className="btn-secondary"
            style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem' }}
            disabled={loading}
          >
            Investigate Scenario 3 <ArrowRight size={16} />
          </button>
        </div>

        {/* Scenario 4 */}
        <div className="glass-card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
            <span className="badge badge-warning">HIGH</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>MEMORY_LEAK</span>
          </div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '8px' }}>
            Scenario 4: Recommendation Engine Heap Memory Leak
          </h3>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Unbounded UserVectorCache growth in JVM heap triggers 14.8s GC pauses and OOM container restarts.
          </p>
          <button
            onClick={() => onSelectScenario('memory_leak')}
            className="btn-secondary"
            style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem' }}
            disabled={loading}
          >
            Investigate Scenario 4 <ArrowRight size={16} />
          </button>
        </div>

        {/* Scenario 5 - Bad Remediation */}
        <div className="glass-card" style={{ borderLeft: '4px solid #8b5cf6', background: 'rgba(139, 92, 246, 0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
            <span className="badge badge-info" style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#c084fc' }}>
              SELF-VALIDATION HIGHLIGHT
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>BAD_REMEDIATION</span>
          </div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '8px', color: '#e9d5ff' }}>
            Scenario 5: Bad Remediation Sandbox Validation & Auto-Rollback
          </h3>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Tests how self-validation detects a bad AI proposal (Scaling pods under DB exhaustion worsens health), triggers sandbox rollback, and forces AI to propose correct fix.
          </p>
          <button
            onClick={() => onSelectScenario('bad_remediation')}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem', background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)' }}
            disabled={loading}
          >
            Test Bad Fix Validation <ShieldAlert size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
