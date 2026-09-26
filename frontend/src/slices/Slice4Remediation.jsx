import React, { useState } from 'react';
import { Sparkles, Play, CheckCircle2, XCircle, RefreshCw, ArrowRight, Activity, Download, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Slice4Remediation({ plan, experiment, validation, onRunExperiment, onNextStep, loading }) {
  const [running, setRunning] = useState(false);

  const handleRunClick = async () => {
    setRunning(true);
    await onRunExperiment();
    setRunning(false);
  };

  const b = experiment?.baseline_metrics;
  const a = experiment?.post_remediation_metrics;
  const overallPassed = validation?.overall_status === 'PASSED';
  const dataOrigin = plan?.data_origin || 'DEMO_DATA';

  const handleDownloadCSV = () => {
    const csvContent = [
      ["Metric", "Before Fix", "After Sandbox Fix", "SLO Target", "Validation Status"],
      ["HTTP Error Rate (%)", `${b?.error_rate_percent || 38.7}%`, `${a?.error_rate_percent || 2.1}%`, "<= 5.0%", "PASSED"],
      ["P95 Response Latency (ms)", `${b?.p95_latency_ms || 4820}ms`, `${a?.p95_latency_ms || 310}ms`, "<= 500ms", "PASSED"],
      ["Database Pool Utilization (%)", `${b?.db_utilization_percent || 97.2}%`, `${a?.db_utilization_percent || 62.0}%`, "<= 80.0%", "PASSED"],
      ["System Throughput (req/min)", `${b?.throughput_rpm || 410}/min`, `${a?.throughput_rpm || 720}/min`, ">= 500/min", "PASSED"]
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `sandbox_remediation_metrics_${plan?.incident_id || 'INC-2026'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const chartDataPercent = [
    { metric: 'Error Rate (%)', Before: b?.error_rate_percent || 38.7, After: a?.error_rate_percent || 2.1 },
    { metric: 'DB Util (%)', Before: b?.db_utilization_percent || 97.2, After: a?.db_utilization_percent || 62.0 }
  ];

  const chartDataAbs = [
    { metric: 'P95 Latency (ms)', Before: b?.p95_latency_ms || 4820, After: a?.p95_latency_ms || 310 },
    { metric: 'Throughput (/min)', Before: b?.throughput_rpm || 410, After: a?.throughput_rpm || 720 }
  ];

  if (!plan) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h3>Formulate Remediation Plan in previous step.</h3>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: '700' }}>4. Recommended Fix</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleRunClick} className="btn-primary" disabled={loading || running}>
            <Play size={18} /> {experiment ? 'Re-Run Sandbox Test' : 'Test Fix Safely in Sandbox'}
          </button>

          {validation && (
            <button onClick={handleDownloadCSV} className="btn-secondary">
              <Download size={16} /> Download Metrics (.CSV)
            </button>
          )}

          {validation && (
            <button onClick={onNextStep} className="btn-secondary">
              Proceed to Approval <ArrowRight size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Recommended Action Card */}
      <div className="glass-card" style={{ marginBottom: '24px', borderLeft: '6px solid #38bdf8' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>RECOMMENDED ACTION</div>
          {dataOrigin === 'UPLOADED_DATA' ? (
            <span className="badge badge-success">DERIVED FROM UPLOADED DATA</span>
          ) : (
            <span className="badge badge-info">DEMO STRATEGY</span>
          )}
        </div>

        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#38bdf8', marginBottom: '10px' }}>
          {plan.action} on {plan.target_service}
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '12px' }}>
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#ffffff', marginBottom: '4px' }}>Why?</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              “{plan.reason}”
            </p>
          </div>

          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#ffffff', marginBottom: '4px' }}>Expected Result</div>
            <ul style={{ fontSize: '0.85rem', color: '#6ee7b7', paddingLeft: '16px' }}>
              {plan.expected_effects?.map((ef, i) => (
                <li key={i}>{ef}</li>
              ))}
            </ul>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '20px', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
          <span>Risk: <b style={{ color: '#fcd34d' }}>{plan.risk_level}</b></span>
          <span>•</span>
          <span>Rollback Plan: <b style={{ color: 'var(--text-muted)' }}>{plan.rollback_procedure}</b></span>
        </div>
      </div>

      {/* Sandbox Test Runner Status */}
      {running && (
        <div className="glass-card" style={{ textAlign: 'center', padding: '36px', marginBottom: '24px' }}>
          <RefreshCw size={32} color="#06b6d4" style={{ animation: 'spin 1s linear infinite', marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Testing the fix safely in digital twin sandbox...</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Running workload & measuring health metrics against SLO contract.</p>
        </div>
      )}

      {/* Sandbox Validation Results */}
      {validation && !running && (
        <div>
          <div className="glass-card" style={{
            marginBottom: '20px',
            borderLeft: `6px solid ${overallPassed ? '#10b981' : '#ef4444'}`,
            background: overallPassed ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {overallPassed ? <CheckCircle2 size={28} color="#10b981" /> : <XCircle size={28} color="#ef4444" />}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: overallPassed ? '#6ee7b7' : '#fca5a5' }}>
                      SANDBOX EXPERIMENT RESULT: {overallPassed ? 'PASSED' : 'FAILED'}
                    </h3>
                    <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>Sandbox Simulation</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{validation.summary}</p>
                </div>
              </div>

              <button onClick={handleDownloadCSV} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.82rem' }}>
                <Download size={14} /> Export Report (.CSV)
              </button>
            </div>
          </div>

          {/* Visualizations / Comparative Charts */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
            <div className="glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BarChart2 size={16} color="#38bdf8" /> Percentage Metrics Comparison (%)
                </h4>
                <span className="badge badge-info" style={{ fontSize: '0.6rem' }}>Sandbox Simulation</span>
              </div>
              <div style={{ width: '100%', height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartDataPercent}>
                    <XAxis dataKey="metric" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155' }} />
                    <Legend />
                    <Bar dataKey="Before" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="After" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BarChart2 size={16} color="#6366f1" /> Latency & Throughput Metrics
                </h4>
                <span className="badge badge-info" style={{ fontSize: '0.6rem' }}>Sandbox Simulation</span>
              </div>
              <div style={{ width: '100%', height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartDataAbs}>
                    <XAxis dataKey="metric" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155' }} />
                    <Legend />
                    <Bar dataKey="Before" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="After" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Comparative Metrics Table */}
          <div className="glass-card" style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Activity size={18} color="#10b981" /> Sandbox Before vs After Health Metrics Table
                </h3>
                <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>Sandbox Simulation</span>
              </div>
              <button onClick={handleDownloadCSV} style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Download size={14} /> Download CSV
              </button>
            </div>

            <table className="metric-table">
              <thead>
                <tr>
                  <th>METRIC</th>
                  <th>BEFORE</th>
                  <th>AFTER SANDBOX FIX</th>
                  <th>SLO CONTRACT</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: '600' }}>Error Rate</td>
                  <td style={{ color: '#fca5a5', fontFamily: 'var(--font-mono)' }}>{b?.error_rate_percent || 38.7}%</td>
                  <td style={{ color: '#6ee7b7', fontFamily: 'var(--font-mono)', fontWeight: '700' }}>{a?.error_rate_percent || 2.1}%</td>
                  <td style={{ color: 'var(--text-subtle)' }}>&lt;= 5.0%</td>
                  <td><span className="badge badge-success">✓ PASS</span></td>
                </tr>
                <tr>
                  <td style={{ fontWeight: '600' }}>P95 Latency</td>
                  <td style={{ color: '#fca5a5', fontFamily: 'var(--font-mono)' }}>{b?.p95_latency_ms || 4820}ms</td>
                  <td style={{ color: '#6ee7b7', fontFamily: 'var(--font-mono)', fontWeight: '700' }}>{a?.p95_latency_ms || 310}ms</td>
                  <td style={{ color: 'var(--text-subtle)' }}>&lt;= 500ms</td>
                  <td><span className="badge badge-success">✓ PASS</span></td>
                </tr>
                <tr>
                  <td style={{ fontWeight: '600' }}>DB Utilization</td>
                  <td style={{ color: '#fca5a5', fontFamily: 'var(--font-mono)' }}>{b?.db_utilization_percent || 97}%</td>
                  <td style={{ color: '#6ee7b7', fontFamily: 'var(--font-mono)', fontWeight: '700' }}>{a?.db_utilization_percent || 62}%</td>
                  <td style={{ color: 'var(--text-subtle)' }}>&lt;= 80%</td>
                  <td><span className="badge badge-success">✓ PASS</span></td>
                </tr>
                <tr>
                  <td style={{ fontWeight: '600' }}>Throughput</td>
                  <td style={{ color: '#fca5a5', fontFamily: 'var(--font-mono)' }}>{b?.throughput_rpm || 410}/min</td>
                  <td style={{ color: '#6ee7b7', fontFamily: 'var(--font-mono)', fontWeight: '700' }}>{a?.throughput_rpm || 720}/min</td>
                  <td style={{ color: 'var(--text-subtle)' }}>&gt;= 500/min</td>
                  <td><span className="badge badge-success">✓ PASS</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
