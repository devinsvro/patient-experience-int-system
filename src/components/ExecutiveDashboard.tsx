import React, { useState } from 'react';
import { 
  DatasetKPIs, 
  Agent4FinalResult, 
  Agent1Result, 
  Agent2Result, 
  Agent3Result, 
  Agent5Result, 
  Agent6Result,
  AgentId
} from '../types';
import { 
  AlertTriangle, 
  ShieldAlert, 
  TrendingUp, 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  Users, 
  ArrowUpRight, 
  Sparkles, 
  FileCheck,
  Send,
  Building2,
  Calendar,
  UserCheck,
  CheckCircle2
} from 'lucide-react';

interface ExecutiveDashboardProps {
  kpis: DatasetKPIs;
  agent4Final: Agent4FinalResult | null;
  agent1: Agent1Result | null;
  agent2: Agent2Result | null;
  agent3: Agent3Result | null;
  agent5: Agent5Result | null;
  agent6: Agent6Result | null;
  onOpenAgent: (id: AgentId) => void;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  kpis,
  agent4Final,
  agent1,
  agent2,
  agent3,
  agent5,
  agent6,
  onOpenAgent,
}) => {
  // Local state for tracking reviewed human cases
  const [resolvedCases, setResolvedCases] = useState<Record<string, boolean>>({});

  const toggleCaseResolved = (itemKey: string) => {
    setResolvedCases((prev) => ({
      ...prev,
      [itemKey]: !prev[itemKey],
    }));
  };

  // Derive theme distribution from Agent 1
  const themeCounts: Record<string, number> = {};
  if (agent1?.comments) {
    agent1.comments.forEach((c) => {
      themeCounts[c.theme] = (themeCounts[c.theme] || 0) + 1;
    });
  }

  // Derive severity levels from Agent 3
  const severityCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };
  if (agent3?.complaints) {
    agent3.complaints.forEach((c) => {
      severityCounts[c.severity_level] = (severityCounts[c.severity_level] || 0) + 1;
    });
  }

  const humanReviewItems = agent4Final?.human_review || (agent3?.complaints.filter(c => c.human_review_required).map(c => ({
    item: `${c.id} (${c.primary_category})`,
    reason: c.human_review_reason || c.severity_reasoning
  })) || []);

  return (
    <div className="w-full space-y-6">

      {/* TOP MANAGEMENT ALERT BANNER (Produced by Agent 4 Final Decision) */}
      {agent4Final ? (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 text-white p-6 md:p-8 shadow-xl border border-teal-500/30">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
          
          <div className="relative z-10 space-y-4">
            
            {/* Attribution & Priority Header */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  Produced by Agent 4 (Hospital Manager Decision Support)
                </span>
                <span className="text-xs text-slate-400">· Final Executive Decision</span>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-sm ${
                  agent4Final.priority === 'High' 
                    ? 'bg-rose-600 text-white animate-pulse' 
                    : agent4Final.priority === 'Medium' 
                    ? 'bg-amber-500 text-white' 
                    : 'bg-emerald-600 text-white'
                }`}>
                  {agent4Final.priority} Priority Level
                </span>
              </div>
            </div>

            {/* Top Management Alert Headline */}
            <div>
              <h2 className="text-lg md:text-xl font-extrabold tracking-tight text-white leading-snug">
                {agent4Final.top_alert}
              </h2>
              <p className="text-xs md:text-sm text-teal-200/80 mt-1.5 font-medium">
                {agent4Final.priority_reason}
              </p>
            </div>

            {/* Answer to the Manager Question */}
            <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-300">
                Executive Decision Support Answer:
              </span>
              <p className="text-sm text-slate-100 leading-relaxed font-normal">
                {agent4Final.answer}
              </p>
            </div>

          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 text-center text-slate-500 dark:text-slate-400 space-y-2">
          <Clock className="w-8 h-8 mx-auto text-teal-500 animate-spin" />
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
            Awaiting Executive Orchestration
          </h3>
          <p className="text-xs max-w-md mx-auto">
            Click "Start Multi-Agent Analysis" in the top control bar to run the agent team and generate real-time managerial findings.
          </p>
        </div>
      )}

      {/* 4 PRIMARY EXECUTIVE KPI CARDS (Calculated by JS Engine) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Patient Satisfaction */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Patient Satisfaction</span>
            <span className="text-[10px] text-teal-600 dark:text-teal-400 font-medium">JS Metric</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono tabular-nums text-slate-900 dark:text-white">
              {kpis.avgSatisfaction}
            </span>
            <span className="text-xs text-slate-400">/ 10 Scale</span>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
            <span>Goal: 8.5+</span>
            <span className={kpis.avgSatisfaction < 7 ? 'text-rose-500 font-semibold' : 'text-emerald-500 font-semibold'}>
              {kpis.avgSatisfaction < 7 ? 'Below Benchmark' : 'Nominal'}
            </span>
          </div>
        </div>

        {/* KPI 2: Communication Rating */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Communication Rating</span>
            <span className="text-[10px] text-teal-600 dark:text-teal-400 font-medium">JS Metric</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono tabular-nums text-slate-900 dark:text-white">
              {kpis.avgCommunication}
            </span>
            <span className="text-xs text-slate-400">/ 5.0 Rating</span>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
            <span>Evaluated by Agent 6</span>
            <span className={kpis.avgCommunication < 3.5 ? 'text-amber-500 font-semibold' : 'text-emerald-500 font-semibold'}>
              {kpis.avgCommunication < 3.5 ? 'Moderate Risk' : 'High Quality'}
            </span>
          </div>
        </div>

        {/* KPI 3: Follow-Up Compliance Rate */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Follow-Up Compliance</span>
            <span className="text-[10px] text-teal-600 dark:text-teal-400 font-medium">JS Metric</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono tabular-nums text-slate-900 dark:text-white">
              {kpis.followupComplianceRate}%
            </span>
            <span className="text-xs text-slate-400">Adherence</span>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
            <span>Portal Usage: {kpis.portalUsageRate}%</span>
            <span className="text-teal-600 dark:text-teal-400 font-medium">30-Day Rate</span>
          </div>
        </div>

        {/* KPI 4: Human Review Cases */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Human Review Queue</span>
            <span className="text-[10px] text-rose-600 dark:text-rose-400 font-bold">Mandatory</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono tabular-nums text-rose-600 dark:text-rose-400">
              {humanReviewItems.length}
            </span>
            <span className="text-xs text-slate-400">Cases Flagged</span>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
            <span>Triaged by Agent 3</span>
            <span className="text-purple-600 dark:text-purple-400 font-semibold">Immediate Action</span>
          </div>
        </div>

      </div>

      {/* VISUAL CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Chart 1: Satisfaction by Service Line */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Satisfaction by Service Line
              </h4>
              <p className="text-xs text-slate-500">Benchmark comparison</p>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400">
              Agent 2 Context
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {Object.entries(kpis.satisfactionByServiceLine).map(([service, score]) => {
              const pct = Math.min(100, Math.round((score / 10) * 100));
              const isLow = score < 5;
              const isHigh = score >= 8;

              return (
                <div key={service} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-slate-700 dark:text-slate-300">{service}</span>
                    <span className="font-mono tabular-nums font-bold text-slate-900 dark:text-white">
                      {score} / 10
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isLow ? 'bg-rose-500' : isHigh ? 'bg-emerald-500' : 'bg-teal-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Comment Themes Distribution (Agent 1) */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Main Comment Themes
              </h4>
              <p className="text-xs text-slate-500">Categorized from distinct feedback</p>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              Agent 1 Feedback
            </span>
          </div>

          <div className="space-y-2.5 pt-2">
            {Object.keys(themeCounts).length > 0 ? (
              Object.entries(themeCounts).map(([theme, count]) => {
                const total = Object.values(themeCounts).reduce((a, b) => a + b, 0);
                const pct = Math.round((count / total) * 100);
                return (
                  <div key={theme} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[180px]">
                        {theme}
                      </span>
                      <span className="text-xs font-mono tabular-nums text-slate-500">
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                Awaiting Agent 1 execution...
              </div>
            )}
          </div>
        </div>

        {/* Chart 3: Complaint Severity Levels (Agent 3) */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Triage Severity Levels
              </h4>
              <p className="text-xs text-slate-500">Levels 1 (Low) to 4 (Critical)</p>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400">
              Agent 3 Triage
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            {[
              { level: 1, label: 'L1: Low', color: 'text-slate-700 dark:text-slate-300', bg: 'bg-slate-100 dark:bg-slate-800' },
              { level: 2, label: 'L2: Moderate', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10' },
              { level: 3, label: 'L3: High', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-500/10' },
              { level: 4, label: 'L4: Critical', color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-500/15' },
            ].map((sev) => (
              <div
                key={sev.level}
                className={`p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 ${sev.bg} flex flex-col justify-between`}
              >
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  {sev.label}
                </span>
                <span className={`text-2xl font-extrabold font-mono tabular-nums ${sev.color} mt-1`}>
                  {severityCounts[sev.level] || 0}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 text-[11px] text-slate-500 dark:text-slate-400">
            Levels 3 & 4 mandate human oversight and clinical routing.
          </div>
        </div>

      </div>

      {/* COMMUNICATION EVALUATOR SPOTLIGHT (Produced by Agent 6) */}
      {agent6 && (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/5 via-white dark:via-slate-900 to-indigo-500/5 border border-purple-200 dark:border-purple-900/40 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">
                Produced by Agent 6 (Healthcare Communication Quality Evaluator)
              </span>
              <span className="text-xs text-slate-500">· 6th-Grade Patient Message Redesign</span>
            </div>
            <button
              onClick={() => onOpenAgent('agent6')}
              className="text-xs text-purple-600 dark:text-purple-400 font-semibold hover:underline"
            >
              View Full Evaluation &gt;
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            
            {/* Improved Patient Message */}
            <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-900 dark:text-purple-300">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>Recommended Rewritten Patient Message</span>
              </div>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-100 leading-relaxed italic">
                "{agent6.improved_patient_message}"
              </p>
              <div className="text-[11px] text-purple-700 dark:text-purple-300 font-semibold pt-1">
                ✓ Clear · ✓ Compassionate · ✓ 6th-Grade Level · ✓ Action-Oriented
              </div>
            </div>

            {/* Communication Quality Summary */}
            <div className="space-y-2.5 text-xs">
              <div>
                <span className="font-bold text-slate-700 dark:text-slate-300">Major Bedside Strength: </span>
                <span className="text-slate-600 dark:text-slate-400">{agent6.executive_summary?.major_strengths || "Warm nurse explanations and printed materials"}</span>
              </div>
              <div>
                <span className="font-bold text-slate-700 dark:text-slate-300">Highest Risk Identified: </span>
                <span className="text-rose-600 dark:text-rose-400 font-medium">{agent6.executive_summary?.highest_risk || "Conflicting anticoagulation holds"}</span>
              </div>
              <div>
                <span className="font-bold text-slate-700 dark:text-slate-300">Most Important Improvement: </span>
                <span className="text-slate-600 dark:text-slate-400">{agent6.executive_summary?.most_important_improvement || "Bilingual discharge checklists with teach-back"}</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* HUMAN REVIEW QUEUE TABLE (Produced by Agent 3 & Agent 4) */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden space-y-0">
        
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Cases Requiring Mandatory Human Review
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400">
                {humanReviewItems.length} Cases
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              High-risk clinical escalations, Title VI language compliance concerns, and accessibility barriers.
            </p>
          </div>

          <div className="text-xs text-slate-400">
            <span>Labeled by Agent 3 & Agent 4</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Case Reference</th>
                <th className="py-3 px-4">Review Justification & Clinical Risk</th>
                <th className="py-3 px-4">Triage Route</th>
                <th className="py-3 px-4 text-right">Escalation Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {humanReviewItems.map((item, idx) => {
                const isResolved = resolvedCases[item.item];
                return (
                  <tr key={idx} className={`transition-colors ${isResolved ? 'bg-emerald-50/30 dark:bg-emerald-950/20' : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/50'}`}>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                      {item.item}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200 max-w-md">
                      {item.reason}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300">
                        {item.item.includes('Chest Pain') ? 'Physician Leadership' :
                         item.item.includes('Blood Thinner') ? 'Nursing Leadership' :
                         item.item.includes('Ramp') ? 'Accessibility Coordinator' : 'Compliance Office'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => toggleCaseResolved(item.item)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors inline-flex items-center gap-1.5 ${
                          isResolved
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300'
                        }`}
                      >
                        {isResolved ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Escalated & Logged</span>
                          </>
                        ) : (
                          <>
                            <ShieldAlert className="w-3.5 h-3.5" />
                            <span>Mark Escalated</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

      {/* RECOMMENDED MANAGEMENT ACTIONS (Agent 4 Final Decision) & QUICK WINS (Agent 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* 3 Core Actions from Agent 4 */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Executive Management Actions
                </h3>
                <span className="text-xs px-2 py-0.5 rounded font-semibold bg-teal-500/10 text-teal-700 dark:text-teal-300">
                  Agent 4 Final
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Targeted managerial solutions based on synthesized agent findings.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {agent4Final?.recommended_actions?.map((act, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 space-y-2"
              >
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <div className="space-y-1 flex-1">
                    <h5 className="text-sm font-bold text-slate-900 dark:text-white">
                      {act.action}
                    </h5>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5 text-teal-500" />
                        <span>Owner: <strong className="text-slate-700 dark:text-slate-300">{act.owner}</strong></span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-teal-500" />
                        <span>Timeframe: <strong className="text-slate-700 dark:text-slate-300">{act.timeframe}</strong></span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )) || (
              <div className="py-6 text-center text-xs text-slate-400">
                Awaiting final decision synthesis...
              </div>
            )}
          </div>
        </div>

        {/* Quick Wins & AI Opportunities (Agent 5 Analytics) */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Tactical Quick Wins
            </h3>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              Agent 5 Analytics
            </span>
          </div>

          <div className="space-y-2.5">
            {agent5?.quick_wins?.map((qw, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 text-xs">
                <span className="font-bold text-emerald-800 dark:text-emerald-300 block mb-0.5">
                  &lt; 3 Months Milestone:
                </span>
                <span className="text-slate-700 dark:text-slate-300">{qw}</span>
              </div>
            )) || (
              <p className="text-xs text-slate-400">Awaiting Agent 5 synthesis...</p>
            )}
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              6-12 Month AI Roadmap
            </span>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 list-disc list-inside">
              {agent5?.long_term_ai_opportunities?.map((opp, idx) => (
                <li key={idx}>{opp}</li>
              )) || (
                <li>Awaiting roadmap data...</li>
              )}
            </ul>
          </div>
        </div>

      </div>

    </div>
  );
};
