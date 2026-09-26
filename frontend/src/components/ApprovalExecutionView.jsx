import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, ArrowRight, UserCheck, Activity, RotateCcw } from 'lucide-react';

export default function ApprovalExecutionView({ plan, validation, executionResult, onExecute, loading }) {
  const [approved, setApproved] = useState(true);
  const [approvedBy, setApprovedBy] = useState("SRE On-Call Lead (lucky@company.com)");

  const handleExecuteClick = () => {
    onExecute(approved, approvedBy);
  };

  if (!plan || !validation) {
    return (
      <div style={{ padding: '60px 28px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        <ShieldCheck size={48} color="var(--text-subtle)" style={{ marginBottom: '16px' }} />
        <h2 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '8px' }}>Sandbox Validation Required</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
          Execute and pass the Sandbox Experiment before requesting human approval for target execution.
        </p>
      </div>
    );
  }

  const validationPassed = validation.overall_status === 'PASSED';

  return (
    <div style={{ padding: '28px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div className="glass-card glass-card-accent" style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <UserCheck size={28} color="#10b981" />
          <h1 style={{ fontSize: '1.6rem', fontWeight: '800' }}>Human Approval & Target Execution Engine</h1>
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Autonomous execution is strictly gated behind human sign-off and validated sandbox contracts.
        </p>
      </div>

      {/* Main Grid: Approval Gate + Execution Result */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Left: Approval Request Form */}
        <div className="glass-card">
          <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={20} color="#06b6d4" /> Human Sign-Off Gate
          </h2>

          <div style={{ padding: '16px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-color)', borderRadius: '10px', marginBottom: '20px' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', marginBottom: '4px' }}>PROPOSED ACTION</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#38bdf8' }}>
              {plan.action} on {plan.target_service}
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
              <span className="badge badge-info">BLAST RADIUS: {plan.blast_radius}</span>
              <span className={`badge ${plan.risk_level === 'HIGH' ? 'badge-critical' : 'badge-success'}`}>
                RISK: {plan.risk_level}
              </span>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              Approver Identity
            </label>
            <input
              type="text"
              value={approvedBy}
              onChange={(e) => setApprovedBy(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '0.9rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px', display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setApproved(true)}
              className={approved ? 'btn-primary' : 'btn-secondary'}
              style={{ flex: 1, justifyContent: 'center' }}
            >
              <CheckCircle2 size={18} /> Approve Execution
            </button>
            <button
              onClick={() => setApproved(false)}
              className={!approved ? 'btn-danger' : 'btn-secondary'}
              style={{ flex: 1, justifyContent: 'center' }}
            >
              Reject Action
            </button>
          </div>

          <button
            onClick={handleExecuteClick}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem' }}
            disabled={loading || !validationPassed}
          >
            Execute Approved Action in Target Environment <ArrowRight size={18} />
          </button>

          {!validationPassed && (
            <div style={{ fontSize: '0.78rem', color: '#ef4444', textAlign: 'center', marginTop: '8px' }}>
              ⚠ Execution blocked: Proposed action failed sandbox validation.
            </div>
          )}
        </div>

        {/* Right: Deterministic Execution Engine Status */}
        <div className="glass-card">
          <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={20} color="#10b981" /> Target Execution & Final Health Check
          </h2>

          {executionResult ? (
            <div>
              <div style={{
                padding: '16px',
                background: executionResult.status === 'EXECUTED_SUCCESS' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                border: `1px solid ${executionResult.status === 'EXECUTED_SUCCESS' ? '#10b981' : '#ef4444'}`,
                borderRadius: '10px',
                marginBottom: '20px'
              }}>
                <div style={{ fontSize: '1.1rem', fontWeight: '700', color: executionResult.status === 'EXECUTED_SUCCESS' ? '#6ee7b7' : '#fca5a5' }}>
                  {executionResult.final_health_status}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', marginTop: '4px' }}>
                  Execution ID: <b>{executionResult.execution_id}</b>
                </div>
              </div>

              {/* Execution Timeline */}
              <h3 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '10px' }}>Execution Sequence Timeline:</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                {executionResult.execution_timeline?.map((item, idx) => (
                  <div key={idx} className="code-block" style={{ fontSize: '0.8rem' }}>
                    <span style={{ color: '#94a3b8' }}>[{item.time}]</span> <span style={{ color: '#10b981', fontWeight: '600' }}>{item.step}:</span> {item.message}
                  </div>
                ))}
              </div>

              {/* Post Execution Metric Badge */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>FINAL ERROR RATE</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#10b981' }}>
                    {executionResult.post_execution_metrics?.error_rate_percent}%
                  </div>
                </div>
                <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>FINAL P95 LATENCY</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#10b981' }}>
                    {executionResult.post_execution_metrics?.p95_latency_ms}ms
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-subtle)' }}>
              Awaiting human approval submission to initiate target execution.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
