import React from 'react';
import { ShieldCheck, Cpu, Upload, Search, FileText, Sparkles, UserCheck, Settings, Layers } from 'lucide-react';

export default function Navbar({ activeSlice, setActiveSlice, costData, activeIncidentId, dataOrigin }) {
  const steps = [
    { num: 1, label: '1. Upload Data', icon: Upload },
    { num: 2, label: '2. Investigate', icon: Search },
    { num: 3, label: '3. Evidence', icon: FileText },
    { num: 4, label: '4. Recommended Fix', icon: Sparkles },
    { num: 5, label: '5. Approve & Execute', icon: UserCheck },
    { num: 6, label: '6. Change Tickets', icon: Layers },
    { num: 7, label: '7. Platform Settings', icon: Settings },
  ];

  return (
    <nav style={{
      background: 'rgba(15, 23, 42, 0.95)',
      borderBottom: '1px solid var(--border-color)',
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Brand Logo & Data Origin Badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(16, 185, 129, 0.3)'
        }}>
          <ShieldCheck size={24} color="#ffffff" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.15rem', fontWeight: '800', letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #ffffff 0%, #cbd5e1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              VeriFix SRE
            </span>
            {dataOrigin === 'UPLOADED_DATA' ? (
              <span className="badge badge-success" style={{ fontSize: '0.65rem', background: 'rgba(16, 185, 129, 0.2)', color: '#6ee7b7' }}>
                UPLOADED DATA (LIVE ANALYSIS)
              </span>
            ) : (
              <span className="badge badge-info" style={{ fontSize: '0.65rem', background: 'rgba(59, 130, 246, 0.2)', color: '#93c5fd' }}>
                DEMO DATA
              </span>
            )}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            Self-Validated Remediation
          </div>
        </div>
      </div>

      {/* 7 Modular Vertical Slices Journey Bar */}
      <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-card)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = activeSlice === step.num;
          return (
            <button
              key={step.num}
              onClick={() => setActiveSlice(step.num)}
              className={isActive ? 'btn-primary' : 'btn-secondary'}
              style={{
                padding: '7px 11px',
                fontSize: '0.8rem',
                borderRadius: '6px',
                background: isActive ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'transparent',
                border: 'none',
                color: isActive ? '#ffffff' : 'var(--text-muted)'
              }}
            >
              <Icon size={14} /> {step.label}
            </button>
          );
        })}
      </div>

      {/* Cost Pill */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          background: 'rgba(30, 41, 59, 0.8)',
          border: '1px solid var(--border-color)',
          borderRadius: '6px',
          padding: '4px 10px',
          fontSize: '0.72rem',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <Cpu size={12} color="#06b6d4" />
          <span>Cost: <b style={{ color: '#10b981' }}>${costData?.total_cost_usd || '0.0012'}</b></span>
        </div>
      </div>
    </nav>
  );
}
