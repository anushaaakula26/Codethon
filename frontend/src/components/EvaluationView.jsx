import React, { useEffect, useState } from 'react';
import { BarChart3, CheckCircle2, TrendingUp, DollarSign, Clock, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';

export default function EvaluationView() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/evaluation')
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load evaluation benchmark:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '60px 28px', textAlign: 'center' }}>
        <BarChart3 size={40} color="#06b6d4" style={{ animation: 'spin 1s linear infinite' }} />
        <h3 style={{ marginTop: '14px' }}>Running Benchmark Evaluation Suite...</h3>
      </div>
    );
  }

  const summary = data?.summary || {};
  const rules = summary.rules_based || {};
  const agentic = summary.multi_stage_agentic || {};

  return (
    <div style={{ padding: '28px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div className="glass-card glass-card-accent" style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <BarChart3 size={28} color="#06b6d4" />
            <h1 style={{ fontSize: '1.6rem', fontWeight: '800' }}>
              Evaluation Benchmark: Static Rules vs VeriFix Agentic Platform
            </h1>
          </div>
          <span className="badge badge-info" style={{ fontSize: '0.75rem', padding: '6px 14px' }}>
            Demo / Sample Evaluation Benchmark
          </span>
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Sample benchmark metrics across held-out incident scenarios: Root Cause Accuracy, Remediation Success Rate, Time-to-Diagnosis, and Adaptive Cost.
        </p>
      </div>

      {/* Metric Cards Comparison */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        {/* Root Cause Accuracy */}
        <div className="glass-card">
          <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', marginBottom: '8px' }}>ROOT CAUSE ACCURACY</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>RULES BASELINE</span>
              <div style={{ fontSize: '1.4rem', fontWeight: '700', color: '#fca5a5' }}>{rules.accuracy_percent}%</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>VERIFIX AGENTIC</span>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#10b981' }}>{agentic.accuracy_percent}%</div>
            </div>
          </div>
        </div>

        {/* Remediation Success Rate */}
        <div className="glass-card">
          <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', marginBottom: '8px' }}>REMEDIATION SUCCESS RATE</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>RULES BASELINE</span>
              <div style={{ fontSize: '1.4rem', fontWeight: '700', color: '#fca5a5' }}>{rules.remediation_success_percent}%</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>VERIFIX AGENTIC</span>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#10b981' }}>{agentic.remediation_success_percent}%</div>
            </div>
          </div>
        </div>

        {/* Time to Diagnosis */}
        <div className="glass-card">
          <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', marginBottom: '8px' }}>AVG TIME TO DIAGNOSIS</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>RULES BASELINE</span>
              <div style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--text-muted)' }}>{rules.avg_time_sec}s</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>VERIFIX AGENTIC</span>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#38bdf8' }}>{agentic.avg_time_sec}s</div>
            </div>
          </div>
        </div>

        {/* Cost per Diagnosis */}
        <div className="glass-card">
          <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', marginBottom: '8px' }}>AVG COST / DIAGNOSIS</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>RULES BASELINE</span>
              <div style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--text-muted)' }}>$0.000</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>VERIFIX AGENTIC</span>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#c084fc' }}>${agentic.avg_cost_usd}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scenario Benchmark Details Table */}
      <div className="glass-card">
        <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Zap size={20} color="#10b981" /> Held-Out Sample Benchmark Scenario Breakdown
        </h2>

        <table className="metric-table">
          <thead>
            <tr>
              <th>SCENARIO ID</th>
              <th>SCENARIO TITLE</th>
              <th>RULES BASELINE ROOT CAUSE</th>
              <th>VERIFIX AGENTIC ROOT CAUSE</th>
              <th>SANDBOX VALIDATION RESULT</th>
            </tr>
          </thead>
          <tbody>
            {data?.agentic_details?.map((item, idx) => {
              const baselineMatch = data.baseline_details?.[idx];
              return (
                <tr key={idx}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#38bdf8' }}>{item.scenario_id}</td>
                  <td style={{ fontWeight: '600' }}>{item.title}</td>
                  <td>
                    {baselineMatch?.correct_root_cause ? (
                      <span className="badge badge-success">✓ CORRECT</span>
                    ) : (
                      <span className="badge badge-critical">✕ INCORRECT</span>
                    )}
                  </td>
                  <td>
                    {item.correct_root_cause ? (
                      <span className="badge badge-success">✓ VERIFIED ({item.confidence_score}%)</span>
                    ) : (
                      <span className="badge badge-warning">INSUFFICIENT EVIDENCE</span>
                    )}
                  </td>
                  <td>
                    {item.remediation_success ? (
                      <span className="badge badge-success">✓ PASSED CONTRACT</span>
                    ) : (
                      <span className="badge badge-critical">✕ FAILED (AUTO-ROLLED BACK)</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
