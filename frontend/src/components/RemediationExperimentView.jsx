import React, { useState } from 'react';
import { Sparkles, Play, ShieldAlert, CheckCircle2, XCircle, ArrowRight, Activity, RefreshCw, Layers } from 'lucide-react';

export default function RemediationExperimentView({ plan, experiment, validation, onRunExperiment, onNextStep, loading }) {
  const [running, setRunning] = useState(false);

  const handleStartExperiment = async () => {
    setRunning(true);
    await onRunExperiment();
    setRunning(false);
  };

  if (!plan) {
    return (
      <div style={{ padding: '60px 28px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        <Sparkles size={48} color="var(--text-subtle)" style={{ marginBottom: '16px' }} />
        <h2 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '8px' }}>No Remediation Plan Formulated</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
          Complete the Investigation & Evidence step first to formulate an intervention plan.
        </p>
      </div>
    );
  }

  const overallPassed = validation?.overall_status === 'PASSED';

  return (
    <div style={{ padding: '28px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header Card */}
      <div className="glass-card glass-card-accent" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-info">PROPOSED REMEDIATION</span>
              <span className={`badge ${plan.risk_level === 'HIGH' ? 'badge-critical' : 'badge-success'}`}>
                RISK: {plan.risk_level}
              </span>
            </div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: '800' }}>
              Proposed Action: <span style={{ color: '#38bdf8' }}>{plan.action}</span> on <span style={{ color: '#10b981' }}>{plan.target_service}</span>
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              <b>Rationale:</b> {plan.reason}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleStartExperiment}
              className="btn-primary"
              disabled={loading || running}
              style={{ fontSize: '0.95rem', padding: '12px 20px', animation: !experiment ? 'pulse-glow 2s infinite' : 'none' }}
            >
              <Play size={18} /> {experiment ? 'Re-Run Experiment' : 'Execute Sandbox Experiment'}
            </button>

            {validation && (
              <button
                onClick={onNextStep}
                className="btn-secondary"
                style={{ fontSize: '0.95rem', padding: '12px 20px' }}
              >
                Proceed to Approval & Target Execution <ArrowRight size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Plan Details Split Card */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '28px' }}>
        <div className="glass-card">
          <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', marginBottom: '4px' }}>BLAST RADIUS</div>
          <div style={{ fontSize: '0.95rem', fontWeight: '600', color: '#f8fafc' }}>{plan.blast_radius}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '8px' }}>
            Preconditions: {plan.preconditions?.join(', ') || 'Service compatibility checked'}
          </div>
        </div>

        <div className="glass-card">
          <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', marginBottom: '4px' }}>EXPECTED EFFECTS</div>
          <div style={{ fontSize: '0.85rem', color: '#6ee7b7' }}>
            {plan.expected_effects?.map((ef, i) => (
              <div key={i}>✓ {ef}</div>
            ))}
          </div>
        </div>

        <div className="glass-card">
          <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', marginBottom: '4px' }}>ROLLBACK PROCEDURE</div>
          <div style={{ fontSize: '0.85rem', color: '#fcd34d' }}>
            {plan.rollback_procedure}
          </div>
        </div>
      </div>

      {/* Experiment Execution Visualizer */}
      {running && (
        <div className="glass-card" style={{ marginBottom: '28px', textAlign: 'center', padding: '40px' }}>
          <RefreshCw size={36} color="#06b6d4" style={{ animation: 'spin 1s linear infinite', marginBottom: '14px' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px' }}>RUNNING SANDBOX EXPERIMENT...</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Initializing isolated digital twin → Injecting baseline workload → Applying proposed remediation → Measuring before/after metrics against SLO health contracts
          </p>
        </div>
      )}

      {/* Validation Results & Comparative Metrics Table */}
      {validation && !running && (
        <div>
          {/* Validation Status Banner */}
          <div className="glass-card" style={{
            marginBottom: '24px',
            borderLeft: `6px solid ${overallPassed ? '#10b981' : '#ef4444'}`,
            background: overallPassed ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              {overallPassed ? (
                <CheckCircle2 size={32} color="#10b981" />
              ) : (
                <XCircle size={32} color="#ef4444" />
              )}
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: overallPassed ? '#6ee7b7' : '#fca5a5' }}>
                  {overallPassed ? 'DETERMINISTIC VALIDATION PASSED' : 'DETERMINISTIC VALIDATION FAILED — ROLLBACK TRIGGERED'}
                </h2>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  {validation.summary}
                </p>
              </div>
            </div>
          </div>

          {/* Comparative Metrics Table */}
          <div className="glass-card" style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={20} color="#10b981" /> Deterministic Before vs After Workload Metrics
            </h2>

            <table className="metric-table">
              <thead>
                <tr>
                  <th>HEALTH METRIC</th>
                  <th>BEFORE REMEDIATION</th>
                  <th>AFTER REMEDIATION</th>
                  <th>SLO TARGET</th>
                  <th>RESULT</th>
                </tr>
              </thead>
              <tbody>
                {validation.slos_checked?.map((slo, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: '600' }}>{slo.name}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: '#fca5a5' }}>{slo.before_val}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: slo.passed ? '#6ee7b7' : '#ef4444', fontWeight: '700' }}>
                      {slo.after_val}
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-subtle)' }}>{slo.threshold}</td>
                    <td>
                      {slo.passed ? (
                        <span className="badge badge-success">✓ PASSED</span>
                      ) : (
                        <span className="badge badge-critical">✕ FAILED</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Scenario 5 Self-Validation Highlight Notice (if failed) */}
          {!overallPassed && (
            <div className="glass-card" style={{ background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <ShieldAlert size={26} color="#c084fc" />
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#e9d5ff' }}>
                    Self-Validation Principle Demonstrated
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    The AI proposed an intervention that failed experimental health contracts. Because VeriFix SRE requires <b>experimental validation</b>, the bad fix was rejected in the sandbox and rolled back before any real service disruption occurred.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
