import React, { useState } from 'react';
import { Upload, Play, Radio, CheckCircle2, FileText, Database, Server, Cpu, ArrowRight } from 'lucide-react';

export default function Slice1Upload({ onSelectScenario, onFileUpload, connectors, loading, ingestSummary }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);

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

  const dataOrigin = ingestSummary?.data_origin || 'DEMO_DATA';

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Launch Interactive Demo Callout Banner */}
      <div className="glass-card glass-card-accent" style={{ textAlign: 'center', padding: '32px', marginBottom: '28px' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '10px' }}>
          Agentic Incident Diagnosis & Self-Validated Remediation
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '750px', margin: '0 auto 20px auto' }}>
          Experience the autonomous SRE workflow: <b>Observe → Investigate → Rank → Evidence → Suggest → Test → Approve → Execute → Verify → Audit</b>.
        </p>

        <button
          onClick={() => onSelectScenario('bad_deployment')}
          className="btn-primary"
          style={{ fontSize: '1.05rem', padding: '14px 32px', animation: 'pulse-glow 2s infinite' }}
          disabled={loading}
        >
          <Play size={20} /> Launch Interactive Demo (Scenario 1)
        </button>

        {/* Demo Scenario Snapshot */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>DEMO DATA</span>
          <span>Incident: <b>Checkout Service Degradation</b></span>
          <span>•</span>
          <span>Error Rate: <b style={{ color: '#ef4444' }}>38.7%</b></span>
          <span>•</span>
          <span>P95 Latency: <b style={{ color: '#ef4444' }}>4.8s</b></span>
          <span>•</span>
          <span>DB Util: <b style={{ color: '#ef4444' }}>97%</b></span>
          <span>•</span>
          <span>Deployment: <b style={{ color: '#38bdf8' }}>checkout-v2.8.1</b></span>
        </div>
      </div>

      <h1 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '16px' }}>1. Upload Incident Data</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '28px' }}>
        {/* Upload File Card */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Upload size={20} color="#06b6d4" /> Upload Custom Incident File
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Upload real telemetry (.log, .txt, .csv, .json, .jsonl). The system will strictly analyze your file as the sole source of truth.
          </p>

          <div
            style={{
              border: `2px dashed ${dragOver ? '#10b981' : 'var(--border-highlight)'}`,
              borderRadius: '10px',
              padding: '24px',
              textAlign: 'center',
              background: dragOver ? 'rgba(16, 185, 129, 0.05)' : 'rgba(15, 23, 42, 0.4)',
              cursor: 'pointer',
              marginBottom: '14px'
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
            <Upload size={32} color="var(--text-muted)" style={{ marginBottom: '8px' }} />
            <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>Drop file here or click to select</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', marginTop: '4px' }}>
              .log, .txt, .csv, .json, .jsonl
            </div>
            <input type="file" onChange={handleFileChange} style={{ marginTop: '10px' }} />
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

        {/* Connect Data Source Card */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Radio size={20} color="#6366f1" /> Connect Data Source
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Connect observability endpoints or demo streams.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {connectors.map((c) => (
              <div key={c.id} style={{
                background: 'rgba(15, 23, 42, 0.5)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>{c.name}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>{c.type}</div>
                </div>
                <span className="badge badge-success" style={{ fontSize: '0.62rem' }}>
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ingestion Summary Box with Data Origin Badge */}
      {ingestSummary && (
        <div className="glass-card" style={{ borderLeft: `4px solid ${dataOrigin === 'UPLOADED_DATA' ? '#10b981' : '#3b82f6'}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', color: '#6ee7b7' }}>
              <CheckCircle2 size={18} /> Incident Data Loaded
            </h3>
            {dataOrigin === 'UPLOADED_DATA' ? (
              <span className="badge badge-success">UPLOADED DATA</span>
            ) : (
              <span className="badge badge-info">DEMO DATA</span>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', textAlign: 'center' }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>LOGS</div>
              <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#38bdf8' }}>{ingestSummary.logs_count.toLocaleString()}</div>
            </div>
            <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>METRICS</div>
              <div style={{ fontSize: '1.3rem', fontWeight: '800', color: ingestSummary.metrics_count > 0 ? '#38bdf8' : 'var(--text-subtle)' }}>
                {ingestSummary.metrics_count > 0 ? ingestSummary.metrics_count : 'Not in data'}
              </div>
            </div>
            <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>TRACES</div>
              <div style={{ fontSize: '1.3rem', fontWeight: '800', color: ingestSummary.traces_count > 0 ? '#38bdf8' : 'var(--text-subtle)' }}>
                {ingestSummary.traces_count > 0 ? ingestSummary.traces_count.toLocaleString() : 'Not in data'}
              </div>
            </div>
            <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>DEPLOYMENTS</div>
              <div style={{ fontSize: '1.3rem', fontWeight: '800', color: ingestSummary.deployments_count > 0 ? '#38bdf8' : 'var(--text-subtle)' }}>
                {ingestSummary.deployments_count > 0 ? ingestSummary.deployments_count : 'Not in data'}
              </div>
            </div>
            <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>SERVICES</div>
              <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#38bdf8' }}>{ingestSummary.services_count}</div>
            </div>
          </div>

          {ingestSummary.uploaded_files?.length > 0 && (
            <div style={{ marginTop: '12px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Source Files: <b>{ingestSummary.uploaded_files.join(', ')}</b>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
