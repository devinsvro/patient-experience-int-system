/**
 * HOSPITAL PATIENT EXPERIENCE INTELLIGENCE SYSTEM
 * Complete multi-agent collaborative orchestrator with 6 agents, dynamic SVG arrows,
 * step-by-step human oversight, distinct comment deduplication, and executive dashboard.
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  PatientRecord, 
  AgentId, 
  AgentStatus, 
  RunMode, 
  WorkflowStep, 
  AgentState,
  DistinctComment,
  DatasetKPIs
} from './types';
import { INITIAL_PATIENT_RECORDS, PRESET_SCENARIOS } from './data/sampleData';
import { calculateDatasetKPIs, extractDistinctComments } from './utils/analytics';
import { AGENT_PROMPTS } from './prompts/agentPrompts';
import { Header } from './components/Header';
import { WorkflowControlBar } from './components/WorkflowControlBar';
import { AgentFlowDiagram } from './components/AgentFlowDiagram';
import { AgentInspectorModal } from './components/AgentInspectorModal';
import { ExecutiveDashboard } from './components/ExecutiveDashboard';
import { DataExplorer } from './components/DataExplorer';
import { Activity, Layers, ShieldCheck, Database, CheckCircle2 } from 'lucide-react';

const INITIAL_AGENT_STATES: Record<AgentId, AgentState> = {
  agent4_plan: {
    status: 'pending',
    task: 'Restate manager goal and assign tasks to specialist agents.',
    inputPayload: null,
    result: null,
  },
  agent1: {
    status: 'pending',
    task: 'Extract themes, sentiment, and managerial actions from distinct comments.',
    inputPayload: null,
    result: null,
  },
  agent2: {
    status: 'pending',
    task: 'Analyze cross-demographic experience disparities and accessibility equity.',
    inputPayload: null,
    result: null,
  },
  agent3: {
    status: 'pending',
    task: 'Triage complaints by severity (L1-L4) and flag mandatory human review cases.',
    inputPayload: null,
    result: null,
  },
  agent6: {
    status: 'pending',
    task: 'Evaluate communication quality, health literacy, and rewrite patient message.',
    inputPayload: null,
    result: null,
  },
  agent5: {
    status: 'pending',
    task: 'Synthesize specialist findings into executive overview and hidden problems.',
    inputPayload: null,
    result: null,
  },
  agent4_final: {
    status: 'pending',
    task: 'Formulate final management decision, priority rating, and 3 action owners.',
    inputPayload: null,
    result: null,
  },
};

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('hospital_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('hospital_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('hospital_theme', 'light');
    }
  }, [darkMode]);

  // Main UI Tab
  const [activeTab, setActiveTab] = useState<'workflow' | 'dashboard' | 'data'>('workflow');

  // Dataset State
  const [records, setRecords] = useState<PatientRecord[]>(INITIAL_PATIENT_RECORDS);
  const [selectedRecordIds, setSelectedRecordIds] = useState<Set<string>>(() => {
    return new Set(INITIAL_PATIENT_RECORDS.map((r) => r.Record_ID));
  });

  // Selected records slice
  const activeRecords = useMemo(() => {
    return records.filter((r) => selectedRecordIds.has(r.Record_ID));
  }, [records, selectedRecordIds]);

  // JS KPI Calculations (no AI used for numbers)
  const kpis: DatasetKPIs = useMemo(() => {
    return calculateDatasetKPIs(activeRecords);
  }, [activeRecords]);

  // Distinct Comments Deduplication
  const distinctComments: DistinctComment[] = useMemo(() => {
    return extractDistinctComments(activeRecords);
  }, [activeRecords]);

  // Workflow State
  const [managerQuestion, setManagerQuestion] = useState(
    'What should management fix first to improve patient experience, and which cases need human review?'
  );
  const [runMode, setRunMode] = useState<RunMode>('auto');
  const [currentStep, setCurrentStep] = useState<WorkflowStep>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [waitingForApproval, setWaitingForApproval] = useState(false);
  const [activeTransfer, setActiveTransfer] = useState<string | null>(null);

  // Agent execution states
  const [agentStates, setAgentStates] = useState<Record<AgentId, AgentState>>(INITIAL_AGENT_STATES);

  // Inspector Modal State
  const [inspectedAgentId, setInspectedAgentId] = useState<AgentId | null>(null);

  // Execute a single agent via backend API
  const executeAgentCall = useCallback(async (
    agentId: AgentId,
    systemPrompt: string,
    dataPayload: any,
    customTask?: string
  ): Promise<any> => {
    setAgentStates((prev) => ({
      ...prev,
      [agentId]: {
        ...prev[agentId],
        status: 'running',
        task: customTask || prev[agentId].task,
        inputPayload: dataPayload,
        error: undefined,
      },
    }));

    try {
      const response = await fetch('/api/agent/call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId,
          systemPrompt,
          dataPayload,
        }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Agent call failed');
      }

      setAgentStates((prev) => ({
        ...prev,
        [agentId]: {
          ...prev[agentId],
          status: 'completed',
          result: data.result,
          executionTimeMs: data.executionTimeMs,
        },
      }));

      return data.result;
    } catch (err: any) {
      console.error(`Error in ${agentId}:`, err);
      setAgentStates((prev) => ({
        ...prev,
        [agentId]: {
          ...prev[agentId],
          status: 'failed',
          error: err.message || 'Execution error',
        },
      }));
      throw err;
    }
  }, []);

  // Step 1: Agent 4 Plans
  const runStep1 = useCallback(async () => {
    setCurrentStep(1);
    setIsProcessing(true);

    const step1Payload = {
      question: managerQuestion,
      kpis,
      dataColumns: [
        'Record_ID',
        'Patient_Persona',
        'Age_Group',
        'Visit_Type',
        'Service_Line',
        'Year',
        'Patient_Satisfaction',
        'Communication_Rating',
        'Followup_Compliance',
        'Portal_Usage',
        'Readmission_Risk',
        'AI_Risk_Flag',
        'Comment'
      ],
    };

    try {
      const planResult = await executeAgentCall(
        'agent4_plan',
        AGENT_PROMPTS.agent4_plan.systemPrompt,
        step1Payload
      );

      // Apply task updates suggested by Agent 4 Plan
      if (planResult?.agents) {
        setAgentStates((prev) => {
          const next = { ...prev };
          planResult.agents.forEach((ag: any) => {
            const mapId: Record<string, AgentId> = {
              'Agent 1': 'agent1',
              'Agent 2': 'agent2',
              'Agent 3': 'agent3',
              'Agent 6': 'agent6',
            };
            const targetId = mapId[ag.agent];
            if (targetId && next[targetId]) {
              next[targetId] = {
                ...next[targetId],
                task: ag.task || next[targetId].task,
                status: ag.run === false ? 'skipped' : next[targetId].status,
              };
            }
          });
          return next;
        });
      }

      if (runMode === 'step') {
        setIsProcessing(false);
        setWaitingForApproval(true);
      } else {
        // Auto run: brief dynamic pulse transfer then proceed to Step 2
        setActiveTransfer('4_to_specialists');
        setTimeout(() => {
          setActiveTransfer(null);
          runStep2();
        }, 1000);
      }
    } catch (error) {
      setIsProcessing(false);
    }
  }, [managerQuestion, kpis, executeAgentCall, runMode]);

  // Step 2: Specialists Run in Parallel (Agents 1, 2, 3, 6)
  const runStep2 = useCallback(async () => {
    setCurrentStep(2);
    setIsProcessing(true);
    setWaitingForApproval(false);

    // Prepare tailored payloads according to each agent's specifications
    const agent1Payload = {
      distinctComments: distinctComments.map((c) => ({
        id: c.id,
        text: c.text,
        count: c.count,
      })),
      totalRecords: activeRecords.length,
    };

    const agent2Payload = {
      kpis,
      patternsByPersona: kpis.satisfactionByPersona,
      patternsByServiceLine: kpis.satisfactionByServiceLine,
      patternsByVisitType: kpis.satisfactionByVisitType,
      patternsByYear: kpis.satisfactionByYear,
      readmissionRiskCounts: kpis.recordsByReadmissionRisk,
      aiRiskFlagCounts: kpis.recordsByAiRiskFlag,
    };

    const agent3Payload = {
      distinctComments: distinctComments.map((c) => ({
        id: c.id,
        text: c.text,
        count: c.count,
        aiRiskFlags: c.aiRiskFlags,
      })),
    };

    const agent6Payload = {
      distinctComments: distinctComments.map((c) => ({
        id: c.id,
        text: c.text,
        count: c.count,
        avgCommunicationRating: c.avgCommunicationRating,
      })),
    };

    const specialistsToRun: Promise<any>[] = [];

    // Agent 1
    if (agentStates.agent1.status !== 'skipped') {
      specialistsToRun.push(
        executeAgentCall('agent1', AGENT_PROMPTS.agent1.systemPrompt, agent1Payload)
      );
    }

    // Agent 2
    if (agentStates.agent2.status !== 'skipped') {
      specialistsToRun.push(
        executeAgentCall('agent2', AGENT_PROMPTS.agent2.systemPrompt, agent2Payload)
      );
    }

    // Agent 3
    if (agentStates.agent3.status !== 'skipped') {
      specialistsToRun.push(
        executeAgentCall('agent3', AGENT_PROMPTS.agent3.systemPrompt, agent3Payload)
      );
    }

    // Agent 6
    if (agentStates.agent6.status !== 'skipped') {
      specialistsToRun.push(
        executeAgentCall('agent6', AGENT_PROMPTS.agent6.systemPrompt, agent6Payload)
      );
    }

    try {
      await Promise.all(specialistsToRun);

      if (runMode === 'step') {
        setIsProcessing(false);
        setWaitingForApproval(true);
      } else {
        // Auto run: transfer to Step 3
        setActiveTransfer('specialists_to_5');
        setTimeout(() => {
          setActiveTransfer(null);
          runStep3();
        }, 1000);
      }
    } catch (err) {
      setIsProcessing(false);
    }
  }, [distinctComments, activeRecords.length, kpis, agentStates, executeAgentCall, runMode]);

  // Step 3: Agent 5 Synthesizes Executive Analytics
  const runStep3 = useCallback(async () => {
    setCurrentStep(3);
    setIsProcessing(true);
    setWaitingForApproval(false);

    // Payload includes KPIs + all specialist results
    const agent5Payload = {
      kpis,
      specialistResults: {
        agent1_feedback: agentStates.agent1.result,
        agent2_monitoring: agentStates.agent2.result,
        agent3_complaint_triage: agentStates.agent3.result,
        agent6_communication: agentStates.agent6.result,
      },
    };

    try {
      await executeAgentCall('agent5', AGENT_PROMPTS.agent5.systemPrompt, agent5Payload);

      if (runMode === 'step') {
        setIsProcessing(false);
        setWaitingForApproval(true);
      } else {
        // Auto run: transfer to Step 4
        setActiveTransfer('5_to_4');
        setTimeout(() => {
          setActiveTransfer(null);
          runStep4();
        }, 1000);
      }
    } catch (err) {
      setIsProcessing(false);
    }
  }, [kpis, agentStates, executeAgentCall, runMode]);

  // Step 4: Agent 4 Formulates Final Decision
  const runStep4 = useCallback(async () => {
    setCurrentStep(4);
    setIsProcessing(true);
    setWaitingForApproval(false);

    // Derive list of cases flagged for human review from Agent 3
    const flaggedComplaints = agentStates.agent3.result?.complaints?.filter(
      (c: any) => c.human_review_required
    ) || [];

    const humanReviewList = flaggedComplaints.map((c: any) => ({
      item: `${c.id} (${c.primary_category})`,
      reason: c.human_review_reason || c.severity_reasoning,
    }));

    const agent4FinalPayload = {
      question: managerQuestion,
      plan: agentStates.agent4_plan.result,
      analyticsResult: agentStates.agent5.result,
      kpis,
      casesFlaggedForHumanReview: humanReviewList,
    };

    try {
      await executeAgentCall(
        'agent4_final',
        AGENT_PROMPTS.agent4_final.systemPrompt,
        agent4FinalPayload
      );

      setIsProcessing(false);
      setWaitingForApproval(false);
    } catch (err) {
      setIsProcessing(false);
    }
  }, [managerQuestion, agentStates, kpis, executeAgentCall]);

  // Handler for Start Run
  const handleStartRun = () => {
    // Reset any failed states and start from Step 1
    runStep1();
  };

  // Handler for Step-by-Step Approval & Continue
  const handleApproveAndContinue = () => {
    if (currentStep === 1) {
      setActiveTransfer('4_to_specialists');
      setTimeout(() => {
        setActiveTransfer(null);
        runStep2();
      }, 600);
    } else if (currentStep === 2) {
      setActiveTransfer('specialists_to_5');
      setTimeout(() => {
        setActiveTransfer(null);
        runStep3();
      }, 600);
    } else if (currentStep === 3) {
      setActiveTransfer('5_to_4');
      setTimeout(() => {
        setActiveTransfer(null);
        runStep4();
      }, 600);
    }
  };

  // Handler for Resetting All
  const handleReset = () => {
    setIsProcessing(false);
    setWaitingForApproval(false);
    setCurrentStep(1);
    setActiveTransfer(null);
    setAgentStates(INITIAL_AGENT_STATES);
  };

  // Re-run single agent only
  const handleRerunSingleAgent = async (agentId: AgentId, editedTask?: string) => {
    let promptDef = AGENT_PROMPTS[agentId].systemPrompt;
    let payload: any = {};

    if (agentId === 'agent4_plan') {
      payload = { question: managerQuestion, kpis };
    } else if (agentId === 'agent1') {
      payload = { distinctComments, totalRecords: activeRecords.length };
    } else if (agentId === 'agent2') {
      payload = { kpis };
    } else if (agentId === 'agent3') {
      payload = { distinctComments };
    } else if (agentId === 'agent6') {
      payload = { distinctComments };
    } else if (agentId === 'agent5') {
      payload = {
        kpis,
        specialistResults: {
          agent1_feedback: agentStates.agent1.result,
          agent2_monitoring: agentStates.agent2.result,
          agent3_complaint_triage: agentStates.agent3.result,
          agent6_communication: agentStates.agent6.result,
        },
      };
    } else if (agentId === 'agent4_final') {
      payload = {
        question: managerQuestion,
        plan: agentStates.agent4_plan.result,
        analyticsResult: agentStates.agent5.result,
        kpis,
      };
    }

    try {
      await executeAgentCall(agentId, promptDef, payload, editedTask);
    } catch (err) {
      // Handled in executeAgentCall
    }
  };

  // Toggle specialist agent active/skipped
  const handleToggleAgentActive = (id: AgentId) => {
    setAgentStates((prev) => {
      const current = prev[id];
      const newStatus = current.status === 'skipped' ? 'pending' : 'skipped';
      return {
        ...prev,
        [id]: {
          ...current,
          status: newStatus,
        },
      };
    });
  };

  // Load a preset scenario
  const handleLoadScenario = (scenarioId: string) => {
    const sc = PRESET_SCENARIOS.find((s) => s.id === scenarioId);
    if (sc) {
      setRecords(sc.records);
      setSelectedRecordIds(new Set(sc.records.map((r) => r.Record_ID)));
      handleReset();
    }
  };

  // Upload custom CSV
  const handleUploadCSV = (newRecords: PatientRecord[]) => {
    setRecords(newRecords);
    setSelectedRecordIds(new Set(newRecords.map((r) => r.Record_ID)));
    handleReset();
  };

  // Record selection toggle
  const handleToggleRecord = (id: string) => {
    setSelectedRecordIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAll = () => {
    setSelectedRecordIds(new Set(records.map((r) => r.Record_ID)));
  };

  const handleDeselectAll = () => {
    setSelectedRecordIds(new Set());
  };

  const hasCompleted = agentStates.agent4_final.status === 'completed';
  const humanReviewCasesCount = agentStates.agent4_final.result?.human_review?.length || 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      
      {/* Top Header */}
      <Header
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        hasResults={hasCompleted}
        reviewCasesCount={humanReviewCasesCount}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Universal Manager Question & Workflow Control Bar */}
        <WorkflowControlBar
          managerQuestion={managerQuestion}
          onChangeQuestion={setManagerQuestion}
          runMode={runMode}
          onChangeRunMode={setRunMode}
          currentStep={currentStep}
          isProcessing={isProcessing}
          waitingForApproval={waitingForApproval}
          onStartRun={handleStartRun}
          onApproveAndContinue={handleApproveAndContinue}
          onReset={handleReset}
          hasCompleted={hasCompleted}
        />

        {/* Tab 1: Agent Workflow & Interactive Flow Diagram */}
        {activeTab === 'workflow' && (
          <div className="space-y-6">
            <AgentFlowDiagram
              agentStates={agentStates}
              currentStep={currentStep}
              runMode={runMode}
              activeTransfer={activeTransfer}
              onSelectAgent={setInspectedAgentId}
              onToggleAgentActive={handleToggleAgentActive}
            />

            {/* Quick Link to Dashboard once Completed */}
            {hasCompleted && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-indigo-500/10 border border-teal-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      All 4 Stages Complete & Synthesized!
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      View the executive management alert, charts, and recommended action owners.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition-transform active:scale-95 whitespace-nowrap"
                >
                  View Executive Dashboard &gt;
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Combined Executive Dashboard */}
        {activeTab === 'dashboard' && (
          <ExecutiveDashboard
            kpis={kpis}
            agent4Final={agentStates.agent4_final.result}
            agent1={agentStates.agent1.result}
            agent2={agentStates.agent2.result}
            agent3={agentStates.agent3.result}
            agent5={agentStates.agent5.result}
            agent6={agentStates.agent6.result}
            onOpenAgent={setInspectedAgentId}
          />
        )}

        {/* Tab 3: Patient Records Explorer & Deduplication Inspector */}
        {activeTab === 'data' && (
          <DataExplorer
            records={records}
            selectedRecordIds={selectedRecordIds}
            onToggleRecord={handleToggleRecord}
            onSelectAll={handleSelectAll}
            onDeselectAll={handleDeselectAll}
            onLoadScenario={handleLoadScenario}
            onUploadCSV={handleUploadCSV}
            distinctComments={distinctComments}
          />
        )}

      </main>

      {/* Inspector Modal for clicked agents */}
      <AgentInspectorModal
        agentId={inspectedAgentId}
        agentState={inspectedAgentId ? agentStates[inspectedAgentId] : null}
        onClose={() => setInspectedAgentId(null)}
        onRerunAgent={handleRerunSingleAgent}
        canEditTask={runMode === 'step' && (waitingForApproval || !isProcessing)}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 py-4 text-center text-xs text-slate-500">
        Hospital Patient Experience Intelligence System · Multi-Agent Healthcare Intelligence Engine
      </footer>

    </div>
  );
}
