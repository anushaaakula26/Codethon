import React, { useEffect, useState } from 'react';
import { FileText, CheckCircle2, ShieldCheck, Clock, RefreshCw, Eye, Tag } from 'lucide-react';
import ChangeTicketModal from '../components/ChangeTicketModal';

export default function Slice6Tickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const fetchTickets = () => {
    setLoading(true);
    fetch('http://localhost:8000/api/change-tickets')
      .then((res) => res.json())
      .then((data) => {
        setTickets(data.reverse()); // latest first
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching tickets:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {selectedTicket && (
        <ChangeTicketModal ticket={selectedTicket} onClose={() => setSelectedTicket(null)} />
      )}

      {/* Header */}
      <div className="glass-card glass-card-accent" style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <FileText size={26} color="#6366f1" />
            <h1 style={{ fontSize: '1.6rem', fontWeight: '800' }}>6. Emergency Change Tickets Store</h1>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Automated emergency change ticket repository integrated with <b>ServiceNow</b> and <b>Azure DevOps</b> emergency change control processes.
          </p>
        </div>

        <button onClick={fetchTickets} className="btn-secondary">
          <RefreshCw size={16} /> Refresh Store
        </button>
      </div>

      {/* Tickets List / Table */}
      <div className="glass-card">
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <RefreshCw size={32} color="#06b6d4" style={{ animation: 'spin 1s linear infinite' }} />
          </div>
        ) : tickets.length === 0 ? (
          <div style={{ padding: '50px', textAlign: 'center', color: 'var(--text-subtle)' }}>
            <FileText size={40} style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>No Change Tickets Created Yet</h3>
            <p style={{ fontSize: '0.85rem' }}>Execute an approved remediation in Slice 5 to automatically generate emergency change tickets.</p>
          </div>
        ) : (
          <table className="metric-table">
            <thead>
              <tr>
                <th>TICKET ID</th>
                <th>SYSTEM</th>
                <th>INCIDENT ID</th>
                <th>PROPOSED ACTION</th>
                <th>SANDBOX TEST</th>
                <th>APPROVER</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket, idx) => (
                <tr key={idx}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#6366f1' }}>{ticket.ticket_id}</td>
                  <td><span className="badge badge-info">{ticket.system}</span></td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#38bdf8' }}>{ticket.incident_id}</td>
                  <td style={{ fontWeight: '600' }}>{ticket.proposed_action}</td>
                  <td>
                    <span className={`badge ${ticket.sandbox_result === 'PASSED' ? 'badge-success' : 'badge-critical'}`}>
                      {ticket.sandbox_result}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>{ticket.approver_name}</td>
                  <td><span className="badge badge-success">{ticket.status}</span></td>
                  <td>
                    <button
                      onClick={() => setSelectedTicket(ticket)}
                      className="btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                    >
                      <Eye size={12} /> Inspect Ticket
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
