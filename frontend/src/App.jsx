import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Slice1Upload from './slices/Slice1Upload';
import Slice2Investigate from './slices/Slice2Investigate';
import Slice3Evidence from './slices/Slice3Evidence';
import Slice4Remediation from './slices/Slice4Remediation';
import Slice5Execute from './slices/Slice5Execute';
import EvaluationView from './components/EvaluationView';
import AuditView from './components/AuditView';

const API_BASE = 'http://localhost:8000';

export default function App() {
  const [activeTab, setActiveTab] = useState('upload');
  const [loading, setLoading] = useState(false);
  const [connectors, setConnectors] = useState([]);
  const [ingestSummary, setIngestSummary] = useState(null);
  const [dataOrigin, setDataOrigin] = useState('DEMO_DATA');

  // Pipeline state
  const [incidentId, setIncidentId] = useState(null);
  const [investigation, setInvestigation] = useState(null);
  const [verification, setVerification] = useState(null);
  const [plan, setPlan] = useState(null);
  const [experiment, setExperiment] = useState(null);
  const [validation, setValidation] = useState(null);
  const [executionResult, setExecutionResult] = useState(null);
  const [routing, setRouting] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/connectors`)
      .then((res) => res.json())
      .then((data) => setConnectors(data))
      .catch((err) => console.error('Error fetching connectors:', err));
  }, []);

  const handleSelectScenario = async (scenarioId) => {
    setLoading(true);
    try {
      // Step 1: Load Scenario (DEMO_DATA)
      const loadRes = await fetch(`${API_BASE}/api/load-scenario`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario_id: scenarioId })
      });
      const loadData = await loadRes.json();
      setIncidentId(loadData.incident_id);
      setIngestSummary(loadData.ingest_summary);
      setDataOrigin('DEMO_DATA');

      // Step 2: Run Investigation
      const invRes = await fetch(`${API_BASE}/api/investigate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ incident_id: loadData.incident_id })
      });
      const invData = await invRes.json();
      setInvestigation(invData.investigation);
      setRouting(invData.routing);

      // Step 3: Run Verification
      const verRes = await fetch(`${API_BASE}/api/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ incident_id: loadData.incident_id })
      });
      const verData = await verRes.json();
      setVerification(verData);

      // Step 4: Plan Remediation
      const planRes = await fetch(`${API_BASE}/api/remediations/plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ incident_id: loadData.incident_id })
      });
      const planData = await planRes.json();
      setPlan(planData);

      setExperiment(null);
      setValidation(null);
      setExecutionResult(null);

      // Advance to Slice 2 Investigate
      setActiveTab('investigate');
    } catch (err) {
      console.error('Error loading scenario:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (files) => {
    setLoading(true);
    try {
      const formData = new FormData();
      files.forEach((f) => formData.append('files', f));

      const res = await fetch(`${API_BASE}/api/upload`, {
        method: 'POST',
        body: formData
      });
      const uploadData = await res.json();
      const incId = uploadData.incident_id;
      setIncidentId(incId);
      setIngestSummary(uploadData.ingest_summary);
      setDataOrigin('UPLOADED_DATA');

      // Run Investigation & Verification on UPLOADED_DATA
      const invRes = await fetch(`${API_BASE}/api/investigate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ incident_id: incId })
      });
      const invData = await invRes.json();
      setInvestigation(invData.investigation);
      setRouting(invData.routing);

      const verRes = await fetch(`${API_BASE}/api/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ incident_id: incId })
      });
      const verData = await verRes.json();
      setVerification(verData);

      const planRes = await fetch(`${API_BASE}/api/remediations/plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ incident_id: incId })
      });
      const planData = await planRes.json();
      setPlan(planData);

      setExperiment(null);
      setValidation(null);
      setExecutionResult(null);

      setActiveTab('investigate');
    } catch (err) {
      console.error('Error uploading file:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunSandboxExperiment = async () => {
    if (!incidentId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/sandbox/run-experiment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ incident_id: incidentId })
      });
      const data = await res.json();
      setExperiment(data.experiment);
      setValidation(data.validation);
    } catch (err) {
      console.error('Error running sandbox experiment:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteTarget = async (approved, approvedBy) => {
    if (!incidentId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          incident_id: incidentId,
          approved: approved,
          approved_by: approvedBy
        })
      });
      const data = await res.json();
      setExecutionResult(data);
    } catch (err) {
      console.error('Error executing remediation:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-dark)' }}>
      {/* Navbar with 5 Vertical Slice Stepper Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        costData={{ total_cost_usd: routing?.estimated_cost_usd || 0.0012 }}
        activeIncidentId={incidentId}
        dataOrigin={dataOrigin}
      />

      {/* Main Journey Container */}
      <main style={{ padding: '24px', paddingBottom: '60px' }}>
        {activeTab === 'upload' && (
          <Slice1Upload
            onSelectScenario={handleSelectScenario}
            onFileUpload={handleFileUpload}
            connectors={connectors}
            loading={loading}
            ingestSummary={ingestSummary}
          />
        )}

        {activeTab === 'investigate' && (
          <Slice2Investigate
            investigation={investigation}
            verification={verification}
            onNextStep={() => setActiveTab('evidence')}
            loading={loading}
          />
        )}

        {activeTab === 'evidence' && (
          <Slice3Evidence
            investigation={investigation}
            verification={verification}
            onNextStep={() => setActiveTab('remediation')}
            loading={loading}
          />
        )}

        {activeTab === 'remediation' && (
          <Slice4Remediation
            plan={plan}
            experiment={experiment}
            validation={validation}
            onRunExperiment={handleRunSandboxExperiment}
            onNextStep={() => setActiveTab('execute')}
            loading={loading}
          />
        )}

        {activeTab === 'execute' && (
          <Slice5Execute
            plan={plan}
            validation={validation}
            executionResult={executionResult}
            onExecute={handleExecuteTarget}
            loading={loading}
          />
        )}

        {activeTab === 'evaluation' && (
          <EvaluationView />
        )}

        {activeTab === 'audit' && (
          <AuditView />
        )}
      </main>
    </div>
  );
}
