import React, { useState } from 'react';
import { AgentId, AgentStatus } from '../types';
import { AGENT_REGISTRY } from '../utils/agentMeta';
import { AGENT_PROMPTS } from '../prompts/agentPrompts';
import { 
  X, 
  Copy, 
  Check, 
  RotateCw, 
  FileText, 
  Database, 
  Code2, 
  Sparkles,
  ShieldAlert,
  Clock,
  Send,
  HelpCircle,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

interface AgentInspectorModalProps {
  agentId: AgentId | null;
  agentState: {
    status: AgentStatus;
    task: string;
    inputPayload: any;
    result: any;
    error?: string;
    executionTimeMs?: number;
  } | null;
  onClose: () => void;
  onRerunAgent: (agentId: AgentId, editedTask?: string) => void;
  canEditTask: boolean;
}

export const AgentInspectorModal: React.FC<AgentInspectorModalProps> = ({
  agentId,
  agentState,
  onClose,
  onRerunAgent,
  canEditTask,
}) => {
  if (!agentId || !agentState) return null;

  const meta = AGENT_REGISTRY[agentId];
  const promptDef = AGENT_PROMPTS[agentId];
  const [activeTab, setActiveTab] = useState<'insights' | 'input' | 'prompt' | 'json'>('insights');
  const [copied, setCopied] = useState(false);
  const [editedTask, setEditedTask] = useState(agentState.task || '');
  const [isEditingTask, setIsEditingTask] = useState(false);

  const handleCopyJson = () => {
    const jsonStr = JSON.stringify(agentState.result || {}, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRerun = () => {
    onRerunAgent(agentId, isEditingTask ? editedTask : undefined);
    setIsEditingTask(false);
  };

  const renderStructuredInsights = () => {
    const res = agentState.result;
    if (!res) {
      return (
        <div className="py-12 text-center text-slate-500 dark:text-slate-400">
          <Clock className="w-10 h-10 mx-auto text-slate-400 mb-3 animate-spin" />
          <p className="text-sm font-medium">No results generated yet.</p>
          <p className="text-xs text-slate-400 mt-1">Run the workflow or step to execute this agent.</p>
        </div>
      );
    }

    // Agent 4 Plan
    if (agentId === 'agent4_plan') {
      return (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800">
            <h5 className="text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300 mb-1">
              Restated Manager Goal
            </h5>
            <p className="text-sm text-teal-950 dark:text-teal-100 font-medium">{res.goal || "Goal not defined"}</p>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Assigned Specialist Tasks
            </h5>
            <div className="space-y-2.5">
              {(res.agents || []).map((ag: any, i: number) => (
                <div key={i} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{ag.agent}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        ag.run ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800'
                      }`}>
                        {ag.run ? 'Assigned to Run' : 'Skipped'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">{ag.task || ag.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Agent 1: Patient Feedback Insight
    if (agentId === 'agent1') {
      return (
        <div className="space-y-4">
          {res.summary && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
              <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 mb-1">
                Executive Synthesis
              </h5>
              <p className="text-sm text-emerald-950 dark:text-emerald-100">{res.summary}</p>
            </div>
          )}

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Comment Insights & Action Matrix ({res.comments?.length || 0})
            </h5>
            <div className="space-y-3">
              {(res.comments || []).map((c: any, i: number) => (
                <div key={i} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-semibold text-slate-500">{c.id}</span>
                      <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                        {c.theme}
                      </span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      c.sentiment === 'Positive' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                      c.sentiment === 'Negative' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                      'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {c.sentiment}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 italic">"{c.reasoning}"</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
                    <div>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Operational Issue: </span>
                      <span className="text-slate-600 dark:text-slate-400">{c.operational_issue}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Manager Action: </span>
                      <span className="text-slate-600 dark:text-slate-400">{c.recommended_action}</span>
                    </div>
                  </div>

                  {c.risk_or_bias_concern && c.risk_or_bias_concern !== 'None' && (
                    <div className="text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 p-2 rounded-lg flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                      <span>{c.risk_or_bias_concern}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Agent 2: Patient Experience Monitoring
    if (agentId === 'agent2') {
      return (
        <div className="space-y-4">
          {/* Risk Grid */}
          {res.risk && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Object.entries(res.risk).map(([key, val]: [string, any]) => (
                <div key={key} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-center">
                  <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    {key.replace('_', ' ')}
                  </div>
                  <div className={`text-sm font-bold mt-1 ${
                    val === 'High' ? 'text-rose-600 dark:text-rose-400' :
                    val === 'Moderate' ? 'text-amber-600 dark:text-amber-400' :
                    'text-emerald-600 dark:text-emerald-400'
                  }`}>
                    {val}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Patterns */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Identified Experience Patterns
            </h5>
            <div className="space-y-2">
              {(res.patterns || []).map((p: any, i: number) => (
                <div key={i} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-1">
                  <h6 className="text-xs font-bold text-slate-900 dark:text-white">{p.pattern}</h6>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{p.evidence}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Equity Concerns */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Healthcare Equity & Accessibility Review
            </h5>
            <div className="space-y-2">
              {(res.equity_concerns || []).map((eq: any, i: number) => (
                <div key={i} className="p-3 rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/20 space-y-1">
                  <span className="text-xs font-bold text-blue-900 dark:text-blue-300">{eq.group}</span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">{eq.concern}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">Evidence: {eq.evidence}</p>
                </div>
              ))}
            </div>
          </div>

          {res.recommendation && (
            <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300">
                Primary Managerial Recommendation:
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-200 mt-1">{res.recommendation}</p>
            </div>
          )}
        </div>
      );
    }

    // Agent 3: Complaint Triage
    if (agentId === 'agent3') {
      return (
        <div className="space-y-4">
          {res.summary && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800">
              <h5 className="text-xs font-bold uppercase tracking-wider text-rose-800 dark:text-rose-300 mb-1">
                Triage Summary
              </h5>
              <p className="text-sm text-rose-950 dark:text-rose-100">{res.summary}</p>
            </div>
          )}

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Triaged Complaints & Routing ({res.complaints?.length || 0})
            </h5>
            <div className="space-y-3">
              {(res.complaints || []).map((comp: any, i: number) => (
                <div key={i} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-semibold text-slate-500">{comp.id}</span>
                      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                        {comp.primary_category}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        comp.severity_level >= 3 
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' 
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        Level {comp.severity_level}
                      </span>
                      {comp.human_review_required && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                          Human Review
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300">{comp.severity_reasoning}</p>

                  <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Route To:</span>
                    <span className="px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 font-medium">
                      {comp.route_to}
                    </span>
                  </div>

                  {comp.human_review_reason && (
                    <div className="text-xs text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 p-2 rounded-lg">
                      <span className="font-semibold">Review Justification: </span>
                      {comp.human_review_reason}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Agent 6: Communication Evaluator
    if (agentId === 'agent6') {
      return (
        <div className="space-y-4">
          {res.improved_patient_message && (
            <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-800 dark:text-purple-300 mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Improved Patient Message (6th-Grade Level)</span>
              </div>
              <p className="text-sm font-medium text-purple-950 dark:text-purple-100 leading-relaxed italic">
                "{res.improved_patient_message}"
              </p>
            </div>
          )}

          {res.executive_summary && (
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-2 text-xs">
              <h5 className="font-bold uppercase tracking-wider text-slate-500">Communication Quality Summary</h5>
              <p><strong className="text-slate-700 dark:text-slate-300">Overall: </strong>{res.executive_summary.overall_quality}</p>
              <p><strong className="text-emerald-600">Major Strengths: </strong>{res.executive_summary.major_strengths}</p>
              <p><strong className="text-rose-600">Major Weaknesses: </strong>{res.executive_summary.major_weaknesses}</p>
              <p><strong className="text-purple-600">Highest Risk: </strong>{res.executive_summary.highest_risk}</p>
            </div>
          )}

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Evaluations
            </h5>
            <div className="space-y-3">
              {(res.evaluations || []).map((ev: any, i: number) => (
                <div key={i} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 dark:text-white">{ev.purpose} ({ev.id})</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      ev.risk === 'High' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950' : 'bg-slate-100 dark:bg-slate-800'
                    }`}>
                      {ev.risk} Risk
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-1 text-center py-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    {Object.entries(ev.scores || {}).map(([dim, score]: [string, any]) => (
                      <div key={dim} className="space-y-0.5">
                        <div className="text-[10px] uppercase text-slate-400 truncate">{dim}</div>
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{score}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Agent 5: Analytics Synthesis
    if (agentId === 'agent5') {
      return (
        <div className="space-y-4">
          {res.headline && (
            <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800">
              <h5 className="text-xs font-bold uppercase tracking-wider text-indigo-800 dark:text-indigo-300 mb-1">
                Executive Headline
              </h5>
              <p className="text-base text-indigo-950 dark:text-indigo-100 font-bold">{res.headline}</p>
            </div>
          )}

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Hidden Organizational Problems
            </h5>
            <div className="space-y-2">
              {(res.hidden_problems || []).map((hp: any, i: number) => (
                <div key={i} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60">
                  <h6 className="text-xs font-bold text-slate-900 dark:text-white">{hp.problem}</h6>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{hp.evidence}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-1.5">
              <h6 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Quick Wins (3 Mo)</h6>
              <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc list-inside">
                {(res.quick_wins || []).map((qw: string, i: number) => (
                  <li key={i}>{qw}</li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-1.5">
              <h6 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">AI Opportunities (6-12 Mo)</h6>
              <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc list-inside">
                {(res.long_term_ai_opportunities || []).map((opp: string, i: number) => (
                  <li key={i}>{opp}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      );
    }

    // Agent 4 Final Decision
    if (agentId === 'agent4_final') {
      return (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 space-y-2">
            <div className="flex items-center justify-between">
              <h5 className="text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300">
                Top Management Alert
              </h5>
              <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                res.priority === 'High' ? 'bg-rose-500 text-white' : 'bg-amber-500 text-white'
              }`}>
                {res.priority} Priority
              </span>
            </div>
            <p className="text-sm font-bold text-teal-950 dark:text-teal-100">{res.top_alert}</p>
            <p className="text-xs text-teal-800 dark:text-teal-200">{res.priority_reason}</p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-1">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500">Manager Question Answer</h5>
            <p className="text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed">{res.answer}</p>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Recommended Management Actions ({res.recommended_actions?.length || 0})
            </h5>
            <div className="space-y-2.5">
              {(res.recommended_actions || []).map((act: any, i: number) => (
                <div key={i} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-1.5">
                  <div className="text-xs font-bold text-slate-900 dark:text-white">{act.action}</div>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                    <span><strong>Owner:</strong> {act.owner}</span>
                    <span><strong>Timeframe:</strong> {act.timeframe}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-sm">
              A{meta.agentNumber}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {meta.title}
                </h3>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {meta.code}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {meta.role}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-5 pt-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium">
          <button
            onClick={() => setActiveTab('insights')}
            className={`px-3 py-2 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'insights'
                ? 'border-teal-500 text-teal-600 dark:text-teal-400 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Structured Insights</span>
          </button>

          <button
            onClick={() => setActiveTab('input')}
            className={`px-3 py-2 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'input'
                ? 'border-teal-500 text-teal-600 dark:text-teal-400 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Data Payload Sent</span>
          </button>

          <button
            onClick={() => setActiveTab('prompt')}
            className={`px-3 py-2 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'prompt'
                ? 'border-teal-500 text-teal-600 dark:text-teal-400 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Prompt & Task</span>
          </button>

          <button
            onClick={() => setActiveTab('json')}
            className={`px-3 py-2 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'json'
                ? 'border-teal-500 text-teal-600 dark:text-teal-400 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Raw JSON Output</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto max-h-[60vh] space-y-4">
          
          {activeTab === 'insights' && renderStructuredInsights()}

          {activeTab === 'input' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Data columns & parameters passed to Agent {meta.agentNumber}:</span>
              </div>
              <pre className="p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto max-h-96">
                {JSON.stringify(agentState.inputPayload || {}, null, 2)}
              </pre>
            </div>
          )}

          {activeTab === 'prompt' && (
            <div className="space-y-4 text-xs">
              <div>
                <h5 className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Assigned Task
                </h5>
                {isEditingTask ? (
                  <div className="space-y-2">
                    <textarea
                      value={editedTask}
                      onChange={(e) => setEditedTask(e.target.value)}
                      rows={3}
                      className="w-full p-2.5 rounded-lg border border-teal-500 dark:border-teal-400 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-sans text-xs focus:outline-none ring-1 ring-teal-500"
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setIsEditingTask(false)}
                        className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleRerun}
                        className="px-3 py-1 rounded bg-teal-600 text-white font-medium hover:bg-teal-700"
                      >
                        Save & Re-run
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-2">
                    <p className="text-slate-700 dark:text-slate-300 font-medium">
                      {agentState.task || 'Default system role instructions.'}
                    </p>
                    {canEditTask && (
                      <button
                        onClick={() => setIsEditingTask(true)}
                        className="text-teal-600 dark:text-teal-400 font-semibold hover:underline shrink-0"
                      >
                        Edit Task
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div>
                <h5 className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Full System Prompt & Constraints
                </h5>
                <pre className="p-4 rounded-xl bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-mono text-[11px] whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
                  {promptDef?.systemPrompt || 'No prompt loaded'}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'json' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  Schema: application/json
                </span>
                <button
                  onClick={handleCopyJson}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-slate-950 text-cyan-400 font-mono text-xs overflow-x-auto max-h-96 leading-relaxed">
                {JSON.stringify(agentState.result || {}, null, 2)}
              </pre>
            </div>
          )}

        </div>

        {/* Footer with Re-run / Close buttons */}
        <div className="flex items-center justify-between p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="text-xs text-slate-500">
            {agentState.executionTimeMs ? (
              <span>Processed in <strong className="font-mono">{(agentState.executionTimeMs / 1000).toFixed(2)}s</strong></span>
            ) : (
              <span>Ready</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRerun}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Re-run Agent Only</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-teal-600 hover:bg-teal-700 text-white transition-colors"
            >
              Done
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
