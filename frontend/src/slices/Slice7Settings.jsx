import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, Lock, Save, AlertCircle } from 'lucide-react';

export default function Slice7Settings() {
  const [profile, setProfile] = useState('ECOMMERCE_SOC2');
  const [presidioRedaction, setPresidioRedaction] = useState(true);
  const [promptShields, setPromptShields] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8000/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.compliance_profile) setProfile(data.compliance_profile);
        if (data.presidio_pii_redaction !== undefined) setPresidioRedaction(data.presidio_pii_redaction);
        if (data.azure_prompt_shields !== undefined) setPromptShields(data.azure_prompt_shields);
      })
      .catch((err) => console.error('Error loading settings:', err));
  }, []);

  const handleSave = () => {
    setLoading(true);
    fetch('http://localhost:8000/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        compliance_profile: profile,
        presidio_pii_redaction: presidioRedaction,
        azure_prompt_shields: promptShields
      })
    })
      .then((res) => res.json())
      .then(() => {
        setSavedSuccess(true);
        setLoading(false);
        setTimeout(() => setSavedSuccess(false), 4000);
      })
      .catch((err) => {
        console.error('Error saving settings:', err);
        setLoading(false);
      });
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '6px', color: '#ffffff' }}>
          7. Platform Settings & Security Policies
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
          Configure compliance profiles, Microsoft Presidio PII redaction, prompt shields, and SLO defaults.
        </p>
      </div>

      {/* Success Notification Alert Banner */}
      {savedSuccess && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          borderRadius: '10px',
          padding: '14px 20px',
          color: '#6ee7b7',
          fontSize: '0.9rem',
          fontWeight: '600',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <CheckCircle2 size={20} color="#10b981" /> Settings updated successfully.
        </div>
      )}

      {/* Domain / Compliance Profile Card */}
      <div className="glass-card" style={{ marginBottom: '28px', padding: '28px' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '20px', color: '#ffffff' }}>
          Domain / Compliance Profile
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Option 1: Banking */}
          <div
            onClick={() => setProfile('BANKING_SOX')}
            style={{
              border: `1px solid ${profile === 'BANKING_SOX' ? '#6366f1' : 'var(--border-color)'}`,
              borderRadius: '12px',
              padding: '18px',
              background: profile === 'BANKING_SOX' ? 'rgba(99, 102, 241, 0.08)' : 'rgba(15, 23, 42, 0.4)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '14px'
            }}
          >
            <input
              type="radio"
              name="profile"
              checked={profile === 'BANKING_SOX'}
              onChange={() => setProfile('BANKING_SOX')}
              style={{ marginTop: '3px', cursor: 'pointer' }}
            />
            <div>
              <div style={{ fontSize: '1rem', fontWeight: '700', color: '#ffffff' }}>
                Banking & Fintech (SOX Section 404 / PCI-DSS v4.0 / DORA)
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Requires 2 distinct approvers for high-risk actions, strict segregation of duties.
              </div>
            </div>
          </div>

          {/* Option 2: Healthcare */}
          <div
            onClick={() => setProfile('HEALTHCARE_HIPAA')}
            style={{
              border: `1px solid ${profile === 'HEALTHCARE_HIPAA' ? '#6366f1' : 'var(--border-color)'}`,
              borderRadius: '12px',
              padding: '18px',
              background: profile === 'HEALTHCARE_HIPAA' ? 'rgba(99, 102, 241, 0.08)' : 'rgba(15, 23, 42, 0.4)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '14px'
            }}
          >
            <input
              type="radio"
              name="profile"
              checked={profile === 'HEALTHCARE_HIPAA'}
              onChange={() => setProfile('HEALTHCARE_HIPAA')}
              style={{ marginTop: '3px', cursor: 'pointer' }}
            />
            <div>
              <div style={{ fontSize: '1rem', fontWeight: '700', color: '#ffffff' }}>
                Healthcare & Life Sciences (HIPAA / DPDP)
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Adds patient safety impact field and clinical criticality checks.
              </div>
            </div>
          </div>

          {/* Option 3: E-Commerce */}
          <div
            onClick={() => setProfile('ECOMMERCE_SOC2')}
            style={{
              border: `1px solid ${profile === 'ECOMMERCE_SOC2' ? '#6366f1' : 'var(--border-color)'}`,
              borderRadius: '12px',
              padding: '18px',
              background: profile === 'ECOMMERCE_SOC2' ? 'rgba(99, 102, 241, 0.08)' : 'rgba(15, 23, 42, 0.4)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '14px'
            }}
          >
            <input
              type="radio"
              name="profile"
              checked={profile === 'ECOMMERCE_SOC2'}
              onChange={() => setProfile('ECOMMERCE_SOC2')}
              style={{ marginTop: '3px', cursor: 'pointer' }}
            />
            <div>
              <div style={{ fontSize: '1rem', fontWeight: '700', color: '#ffffff' }}>
                E-Commerce & General Enterprise (SOC 2 / ISO 27001)
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Standard SOC 2 defaults with single approver for low-risk actions.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Safety & Privacy Redaction Card */}
      <div className="glass-card" style={{ marginBottom: '28px', padding: '28px' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '20px', color: '#ffffff' }}>
          Safety & Privacy Redaction
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Checkbox 1: Presidio PII */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.4)',
            border: '1px solid var(--border-color)',
            borderRadius: '10px',
            padding: '16px',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#ffffff' }}>
                Microsoft Presidio PII & Secret Redaction
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Redacts emails, API keys, passwords, and IP addresses before sending data to LLMs.
              </div>
            </div>
            <input
              type="checkbox"
              checked={presidioRedaction}
              onChange={(e) => setPresidioRedaction(e.target.checked)}
              style={{ width: '18px', height: '18px', cursor: 'pointer', marginTop: '4px' }}
            />
          </div>

          {/* Checkbox 2: Prompt Shields */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.4)',
            border: '1px solid var(--border-color)',
            borderRadius: '10px',
            padding: '16px',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#ffffff' }}>
                Azure AI Content Safety Prompt Shields
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Detects prompt injection attempts embedded in log files and quarantines flagged lines.
              </div>
            </div>
            <input
              type="checkbox"
              checked={promptShields}
              onChange={(e) => setPromptShields(e.target.checked)}
              style={{ width: '18px', height: '18px', cursor: 'pointer', marginTop: '4px' }}
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div>
        <button
          onClick={handleSave}
          className="btn-primary"
          style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            padding: '12px 28px',
            fontSize: '1rem'
          }}
          disabled={loading}
        >
          <Save size={18} /> Save Policy Configuration
        </button>
      </div>
    </div>
  );
}
