import React from 'react';
import { X, FileText, CheckCircle2, ShieldCheck, Clock, UserCheck } from 'lucide-react';

export default function ChangeTicketModal({ ticket, onClose }) {
  if (!ticket) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '850px' }}>
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="badge badge-info">{ticket.system}</span>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '800' }}>Emergency Change Ticket: {ticket.ticket_id}</h2>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Created: {ticket.created_at}</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        {/* Change Ticket Content Details */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>INCIDENT ID</div>
            <div style={{ fontSize: '1rem', fontWeight: '700', color: '#38bdf8' }}>{ticket.incident_id}</div>

            <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '10px' }}>PROPOSED ACTION</div>
            <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#6ee7b7' }}>{ticket.proposed_action}</div>

            <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '10px' }}>REASON FOR CHANGE</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{ticket.reason}</div>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>APPROVAL & RISK</div>
            <div style={{ fontSize: '0.9rem', color: '#ffffff' }}>
              Approver: <b>{ticket.approver_name}</b><br />
              Risk Level: <b style={{ color: '#fcd34d' }}>{ticket.risk_level}</b><br />
              Status: <b style={{ color: '#10b981' }}>{ticket.status}</b>
            </div>

            <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '10px' }}>SANDBOX TEST RESULT</div>
            <span className="badge badge-success">{ticket.sandbox_result}</span>
          </div>
        </div>

        {/* Before vs After Sandbox Metrics Snapshot */}
        <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '10px' }}>Sandbox Validation Metrics Attached to Ticket</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px', textTransform: 'uppercase', fontSize: '0.75rem' }}>
          <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ color: 'var(--text-subtle)' }}>ERROR RATE</div>
            <div style={{ color: '#fca5a5' }}>Before: {ticket.before_metrics?.error_rate_percent}%</div>
            <div style={{ color: '#6ee7b7', fontWeight: '700' }}>After: {ticket.after_metrics?.error_rate_percent}%</div>
          </div>
          <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ color: 'var(--text-subtle)' }}>P95 LATENCY</div>
            <div style={{ color: '#fca5a5' }}>Before: {ticket.before_metrics?.p95_latency_ms}ms</div>
            <div style={{ color: '#6ee7b7', fontWeight: '700' }}>After: {ticket.after_metrics?.p95_latency_ms}ms</div>
          </div>
          <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ color: 'var(--text-subtle)' }}>DB UTILIZATION</div>
            <div style={{ color: '#fca5a5' }}>Before: {ticket.before_metrics?.db_utilization_percent}%</div>
            <div style={{ color: '#6ee7b7', fontWeight: '700' }}>After: {ticket.after_metrics?.db_utilization_percent}%</div>
          </div>
          <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ color: 'var(--text-subtle)' }}>THROUGHPUT</div>
            <div style={{ color: '#fca5a5' }}>Before: {ticket.before_metrics?.throughput_rpm}/min</div>
            <div style={{ color: '#6ee7b7', fontWeight: '700' }}>After: {ticket.after_metrics?.throughput_rpm}/min</div>
          </div>
        </div>

        {/* Evidence Summary List */}
        <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '8px' }}>Verified Evidence Provenance Summary</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '24px' }}>
          {ticket.evidence_summary?.map((ev, i) => (
            <div key={i} className="code-block" style={{ fontSize: '0.8rem', padding: '8px' }}>
              • {ev}
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'right' }}>
          <button onClick={onClose} className="btn-secondary">Close Ticket View</button>
        </div>
      </div>
    </div>
  );
}
