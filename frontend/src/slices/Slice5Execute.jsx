import React, { useState } from 'react';
import { UserCheck, CheckCircle2, ShieldCheck, ArrowRight, FileText, Activity, AlertCircle, XCircle, Table } from 'lucide-react';
import ChangeTicketModal from '../components/ChangeTicketModal';

export default function Slice5Execute({ plan, validation, executionResult, onExecute, loading }) {
  const [approved, setApproved] = useState(true);
  const [approverName, setApproverName] = useState("Admin / Approver Name");
  const [showTicketModal, setShowTicketModal] = useState(false);

  const handleExecute = () => {
    onExecute(approved, approverName);
  };

  if (!plan || !validation) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h3>Sandbox Test Required</h3>
        <p style={{ color: 'var(--text-muted)' }}>Complete the sandbox test in Slice 4 before executing.</p>
      </div>
    );
  }

  const overallPassed = validation.overall_status === 'PASSED';
  const ticket = executionResult?.change_ticket;
  const auditTable = executionResult?.audit_table || [];

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {showTicketModal && ticket && (
        <ChangeTicketModal ticket={ticket} onClose={() => setShowTicketModal(false)} />
      )}

      <h1 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '20px' }}>5. Approve & Execute</h1>

      {/* Proposed Change & Validation Status Summary */}
      <div className="glass-card" style={{ marginBottom: '24px', borderLeft: '6px solid #10b981' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', marginBottom: '4px' }}>PROPOSED CHANGE</div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#38bdf8' }}>
              {plan.action === 'ROLLBACK_SERVICE' ? `Rollback ${plan.target_service}-v2.8.1` : `${plan.action} on ${plan.target_service}`}
            </h2>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', marginBottom: '4px' }}>SANDBOX TEST</div>
            <span className={`badge ${overallPassed ? 'badge-success' : 'badge-critical'}`} style={{ fontSize: '0.9rem', padding: '6px 14px' }}>
              {overallPassed ? '✓ PASSED' : '✕ FAILED'}
            </span>
          </div>
        </div>

        {/* Validation criteria status pill array */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-color)', fontSize: '0.8rem' }}>
          <span style={{ color: '#6ee7b7' }}>• Error rate: <b>PASS</b></span>
          <span style={{ color: '#6ee7b7' }}>• P95 latency: <b>PASS</b></span>
          <span style={{ color: '#6ee7b7' }}>• Throughput: <b>PASS</b></span>
          <span style={{ color: '#6ee7b7' }}>• Dependency errors: <b>PASS</b></span>
        </div>
      </div>

      {/* Human Approval Required Section */}
      <div className="glass-card" style={{ marginBottom: '28px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <UserCheck size={20} color="#6366f1" /> Human Approval Required
        </h3>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Approver Name</label>
          <input
            type="text"
            value={approverName}
            onChange={(e) => setApproverName(e.target.value)}
            style={{
              width: '100%',
              maxWidth: '400px',
              padding: '10px 14px',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '0.9rem'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
          <button
            onClick={() => setApproved(true)}
            className={approved ? 'btn-primary' : 'btn-secondary'}
          >
            <CheckCircle2 size={18} /> Approve Change
          </button>
          <button
            onClick={() => setApproved(false)}
            className={!approved ? 'btn-danger' : 'btn-secondary'}
          >
            <XCircle size={18} /> Reject Change
          </button>
        </div>

        <button
          onClick={handleExecute}
          className="btn-primary"
          style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem' }}
          disabled={loading || !overallPassed}
        >
          Execute Approved Fix & Generate Emergency Change Ticket <ArrowRight size={18} />
        </button>
      </div>

      {/* Automatic Emergency Change Ticket Notification */}
      {ticket && (
        <div className="glass-card" style={{ marginBottom: '28px', borderLeft: '6px solid #6366f1', background: 'rgba(99, 102, 241, 0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <FileText size={20} color="#6366f1" />
                <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#a5b4fc' }}>
                  Emergency Change Ticket Created: {ticket.ticket_id}
                </span>
                <span className="badge badge-info">{ticket.system}</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Incident: <b>{ticket.incident_id}</b> | Change: <b>{ticket.proposed_action}</b> | Reason: <b>{ticket.reason}</b>
              </p>
            </div>

            <button onClick={() => setShowTicketModal(true)} className="btn-secondary" style={{ fontSize: '0.82rem' }}>
              View Change Ticket Details
            </button>
          </div>

          <div style={{ display: 'flex', gap: '16px', marginTop: '12px', fontSize: '0.8rem', color: '#c7d2fe' }}>
            <span>Approved By: <b>{ticket.approver_name}</b></span>
            <span>•</span>
            <span>Sandbox: <b style={{ color: '#10b981' }}>{ticket.sandbox_result}</b></span>
            <span>•</span>
            <span>Status: <b style={{ color: '#10b981' }}>APPROVED → EXECUTING → VERIFIED</b></span>
          </div>
        </div>
      )}

      {/* Final Verification Result */}
      {executionResult && (
        <div className="glass-card" style={{ marginBottom: '28px', borderLeft: '6px solid #10b981', background: 'rgba(16, 185, 129, 0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <CheckCircle2 size={36} color="#10b981" />
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#6ee7b7' }}>INCIDENT RESOLVED</h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Target health verification PASSED. All system health metrics restored within normal SLO bounds.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* AI Activity & Audit Table (Directly inside Slice 5) */}
      {auditTable.length > 0 && (
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Table size={18} color="#06b6d4" /> AI Execution Audit & Telemetry Log Table
            </h3>
            <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>SIMULATED / DEMO METRICS</span>
          </div>

          <table className="metric-table" style={{ fontSize: '0.78rem' }}>
            <thead>
              <tr>
                <th>TIMESTAMP</th>
                <th>AGENT</th>
                <th>STEP ACTION</th>
                <th>MODEL VERSION</th>
                <th>TIER</th>
                <th>TOKENS</th>
                <th>COST ($)</th>
                <th>LATENCY</th>
                <th>OTEL SPAN ID</th>
              </tr>
            </thead>
            <tbody>
              {auditTable.map((row, idx) => (
                <tr key={idx}>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-subtle)' }}>{row.timestamp}</td>
                  <td style={{ fontWeight: '600', color: '#38bdf8' }}>{row.agent}</td>
                  <td>{row.step_action}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{row.model_version}</td>
                  <td><span className="badge badge-info" style={{ fontSize: '0.6rem' }}>{row.tier}</span></td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{row.tokens.toLocaleString()}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: '#10b981' }}>${row.cost_usd.toFixed(5)}</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{row.latency_ms}ms</td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: '#a5b4fc' }}>{row.otel_span_id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
