import React from 'react';
import { 
  AgentId, 
  AgentStatus, 
  WorkflowStep, 
  RunMode 
} from '../types';
import { AGENT_REGISTRY } from '../utils/agentMeta';
import { 
  Play, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  FastForward, 
  XCircle, 
  Compass, 
  MessageSquareText, 
  TrendingUp, 
  AlertOctagon, 
  Sparkles, 
  BarChart3, 
  Crown,
  ChevronRight,
  Info
} from 'lucide-react';

interface AgentFlowDiagramProps {
  agentStates: Record<AgentId, {
    status: AgentStatus;
    task: string;
    result: any;
    error?: string;
    executionTimeMs?: number;
  }>;
  currentStep: WorkflowStep;
  runMode: RunMode;
  activeTransfer: string | null; // e.g. '4_to_specialists' | 'specialists_to_5' | '5_to_4'
  onSelectAgent: (id: AgentId) => void;
  onToggleAgentActive?: (id: AgentId) => void;
}

export const AgentFlowDiagram: React.FC<AgentFlowDiagramProps> = ({
  agentStates,
  currentStep,
  activeTransfer,
  onSelectAgent,
  onToggleAgentActive,
}) => {
  const getAgentIcon = (id: AgentId) => {
    switch (id) {
      case 'agent4_plan':
        return <Compass className="w-5 h-5 text-teal-500" />;
      case 'agent1':
        return <MessageSquareText className="w-5 h-5 text-emerald-500" />;
      case 'agent2':
        return <TrendingUp className="w-5 h-5 text-blue-500" />;
      case 'agent3':
        return <AlertOctagon className="w-5 h-5 text-rose-500" />;
      case 'agent6':
        return <Sparkles className="w-5 h-5 text-purple-500" />;
      case 'agent5':
        return <BarChart3 className="w-5 h-5 text-indigo-500" />;
      case 'agent4_final':
        return <Crown className="w-5 h-5 text-teal-500" />;
    }
  };

  const getStatusBadge = (status: AgentStatus) => {
    switch (status) {
      case 'running':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping" />
            Running
          </span>
        );
      case 'waiting_review':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
            <Clock className="w-3 h-3" />
            Review Needed
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            Completed
          </span>
        );
      case 'skipped':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-500/10 text-slate-500 dark:text-slate-400 border border-slate-500/20">
            <FastForward className="w-3 h-3" />
            Skipped
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/30">
            <XCircle className="w-3 h-3" />
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
            Pending
          </span>
        );
    }
  };

  // Helper to render an agent box
  const renderAgentBox = (id: AgentId, orderLabel: string) => {
    const meta = AGENT_REGISTRY[id];
    const state = agentStates[id];
    const isRunning = state?.status === 'running';
    const isWaiting = state?.status === 'waiting_review';
    const isCompleted = state?.status === 'completed';
    const isSkipped = state?.status === 'skipped';

    return (
      <div 
        onClick={() => onSelectAgent(id)}
        className={`relative group cursor-pointer rounded-2xl transition-all duration-300 ${
          isRunning
            ? 'ring-2 ring-cyan-500 shadow-lg shadow-cyan-500/20 scale-[1.02]'
            : isWaiting
            ? 'ring-2 ring-amber-500/80 shadow-md shadow-amber-500/20'
            : isCompleted
            ? 'hover:ring-1 hover:ring-teal-500/50 hover:shadow-md'
            : 'opacity-85 hover:opacity-100'
        }`}
      >
        {/* Dynamic active task radar wave */}
        {isRunning && (
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-teal-500/20 to-indigo-500/20 animate-radar-glow -z-10 blur-sm pointer-events-none" />
        )}

        <div className={`p-4 rounded-2xl bg-white dark:bg-slate-900 border ${
          isRunning 
            ? 'border-cyan-500/60' 
            : isWaiting 
            ? 'border-amber-500/60' 
            : 'border-slate-200 dark:border-slate-800'
        } shadow-sm transition-colors`}>
          
          {/* Header Row with Order Tag and Status */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center justify-center">
                {orderLabel}
              </span>
              <span className="text-xs font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                Agent {meta.agentNumber}
              </span>
            </div>
            <div>{getStatusBadge(state?.status || 'pending')}</div>
          </div>

          {/* Title and Icon */}
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isRunning ? 'bg-cyan-50 dark:bg-cyan-950/60 ring-2 ring-cyan-500/30' : 'bg-slate-100 dark:bg-slate-800'
            }`}>
              {getAgentIcon(id)}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                {meta.shortName}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                {state?.task || meta.role}
              </p>
            </div>
          </div>

          {/* Footer stats or inspect hint */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1 font-mono">
              {state?.executionTimeMs ? `${(state.executionTimeMs / 1000).toFixed(1)}s` : 'Click to inspect'}
            </span>
            <span className="text-teal-600 dark:text-teal-400 font-medium group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
              Inspect <ChevronRight className="w-3 h-3" />
            </span>
          </div>

          {/* Optional Toggle for Specialists in Step-by-Step mode */}
          {onToggleAgentActive && ['agent1', 'agent2', 'agent3', 'agent6'].includes(id) && currentStep === 1 && (
            <div 
              onClick={(e) => {
                e.stopPropagation();
                onToggleAgentActive(id);
              }}
              className="mt-2 text-right"
            >
              <button 
                type="button"
                className={`text-[10px] font-medium px-2 py-0.5 rounded transition-colors ${
                  isSkipped 
                    ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300' 
                    : 'bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300'
                }`}
              >
                {isSkipped ? 'Enable Agent' : 'Skip in this Run'}
              </button>
            </div>
          )}

        </div>
      </div>
    );
  };

  const isStep1Active = currentStep === 1 || activeTransfer === '4_to_specialists';
  const isStep2Active = currentStep === 2 || activeTransfer === 'specialists_to_5';
  const isStep3Active = currentStep === 3 || activeTransfer === '5_to_4';
  const isStep4Active = currentStep === 4;

  return (
    <div className="relative w-full rounded-3xl bg-slate-100/70 dark:bg-slate-950/70 p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-inner overflow-hidden">
      
      {/* Background ambient grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* SVG Connecting Flow Lines with dynamic particle pulse beams */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Gradients */}
          <linearGradient id="flowGradTeal" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0D9488" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0.8" />
          </linearGradient>

          <linearGradient id="flowGradIndigo" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#059669" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.8" />
          </linearGradient>

          <linearGradient id="flowGradLoop" x1="100%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#7C3AED" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0D9488" stopOpacity="0.8" />
          </linearGradient>

          {/* Glowing Filter */}
          <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Dynamic visual indicator paths on desktop */}
        <g className="hidden md:block">
          {/* Arrow Step 1: Agent 4 Plan -> Down into specialists row */}
          <path
            d="M 50% 170 L 50% 210"
            stroke="currentColor"
            className={`${
              isStep1Active || activeTransfer === '4_to_specialists'
                ? 'text-teal-500 animate-pulse-beam'
                : 'text-slate-300 dark:text-slate-700'
            }`}
            strokeWidth="3"
            strokeDasharray={isStep1Active ? '6 4' : 'none'}
            fill="none"
          />

          {/* Horizontal split bar for specialists */}
          <path
            d="M 16% 210 L 84% 210"
            stroke="currentColor"
            className={`${
              isStep1Active || activeTransfer === '4_to_specialists'
                ? 'text-teal-500 animate-pulse-beam'
                : 'text-slate-300 dark:text-slate-700'
            }`}
            strokeWidth="2.5"
            strokeDasharray={isStep1Active ? '6 4' : 'none'}
            fill="none"
          />

          {/* Downward feeds to 4 specialists */}
          <path d="M 16% 210 L 16% 240" stroke="currentColor" className={isStep1Active ? 'text-teal-500' : 'text-slate-300 dark:text-slate-700'} strokeWidth="2.5" fill="none" />
          <path d="M 38% 210 L 38% 240" stroke="currentColor" className={isStep1Active ? 'text-teal-500' : 'text-slate-300 dark:text-slate-700'} strokeWidth="2.5" fill="none" />
          <path d="M 62% 210 L 62% 240" stroke="currentColor" className={isStep1Active ? 'text-teal-500' : 'text-slate-300 dark:text-slate-700'} strokeWidth="2.5" fill="none" />
          <path d="M 84% 210 L 84% 240" stroke="currentColor" className={isStep1Active ? 'text-teal-500' : 'text-slate-300 dark:text-slate-700'} strokeWidth="2.5" fill="none" />

          {/* Arrow Step 2: From 4 specialists down to Agent 5 Analytics */}
          <path d="M 16% 450 L 16% 475" stroke="currentColor" className={isStep2Active ? 'text-indigo-500 animate-pulse-beam' : 'text-slate-300 dark:text-slate-700'} strokeWidth="2.5" fill="none" />
          <path d="M 38% 450 L 38% 475" stroke="currentColor" className={isStep2Active ? 'text-indigo-500 animate-pulse-beam' : 'text-slate-300 dark:text-slate-700'} strokeWidth="2.5" fill="none" />
          <path d="M 62% 450 L 62% 475" stroke="currentColor" className={isStep2Active ? 'text-indigo-500 animate-pulse-beam' : 'text-slate-300 dark:text-slate-700'} strokeWidth="2.5" fill="none" />
          <path d="M 84% 450 L 84% 475" stroke="currentColor" className={isStep2Active ? 'text-indigo-500 animate-pulse-beam' : 'text-slate-300 dark:text-slate-700'} strokeWidth="2.5" fill="none" />

          {/* Specialist collection bar */}
          <path
            d="M 16% 475 L 84% 475"
            stroke="currentColor"
            className={`${
              isStep2Active || activeTransfer === 'specialists_to_5'
                ? 'text-indigo-500 animate-pulse-beam'
                : 'text-slate-300 dark:text-slate-700'
            }`}
            strokeWidth="2.5"
            strokeDasharray={isStep2Active ? '6 4' : 'none'}
            fill="none"
          />
          <path d="M 50% 475 L 50% 505" stroke="currentColor" className={isStep2Active ? 'text-indigo-500' : 'text-slate-300 dark:text-slate-700'} strokeWidth="3" fill="none" />

          {/* Loop-back Arrow Step 3: Agent 5 Analytics returning up to Agent 4 Final Decision */}
          <path
            d="M 72% 575 C 92% 575, 96% 250, 72% 95"
            stroke="url(#flowGradLoop)"
            className={`${
              isStep3Active || activeTransfer === '5_to_4'
                ? 'animate-pulse-beam'
                : 'opacity-40'
            }`}
            strokeWidth="3.5"
            strokeDasharray={isStep3Active ? '8 6' : '4 4'}
            fill="none"
            filter={isStep3Active ? 'url(#glowFilter)' : undefined}
          />
        </g>
      </svg>

      {/* Main Flow Grid Layout */}
      <div className="relative z-10 flex flex-col gap-10">

        {/* STEP 1 & STEP 4: Orchestrator Dual Role Row (Planning on left/center, Final Decision on right) */}
        <div>
          <div className="flex items-center justify-between mb-3 px-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                Stage 1 & 4 · Orchestration & Executive Decision
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:inline">
                Hospital Manager Decision Support
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <Info className="w-3.5 h-3.5" />
              <span>Agent 4 works twice: plans first, then makes final recommendation</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Box 1: Agent 4 Plan */}
            <div>
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5 px-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-500" />
                Step 1: Work Assignment & Task Planning
              </div>
              {renderAgentBox('agent4_plan', '1')}
            </div>

            {/* Box 4: Agent 4 Final Decision */}
            <div>
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5 px-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-500" />
                Step 4: Final Management Decisions & Actions
              </div>
              {renderAgentBox('agent4_final', '4')}
            </div>
          </div>
        </div>

        {/* STEP 2: Specialist Agents Row (Agents 1, 2, 3, 6) */}
        <div>
          <div className="flex items-center justify-between mb-3 px-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Stage 2 · Parallel Specialist Intelligence
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:inline">
                Concurrent execution across feedback, patterns, triage & communication
              </span>
            </div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {isStep2Active ? (
                <span className="text-cyan-600 dark:text-cyan-400 font-semibold animate-pulse">
                  ● Specialists Processing in Parallel
                </span>
              ) : (
                '4 Specialized Disciplines'
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {renderAgentBox('agent1', '2a')}
            {renderAgentBox('agent2', '2b')}
            {renderAgentBox('agent3', '2c')}
            {renderAgentBox('agent6', '2d')}
          </div>
        </div>

        {/* STEP 3: Analytics Synthesis Row (Agent 5) */}
        <div className="max-w-xl mx-auto w-full">
          <div className="flex items-center justify-between mb-3 px-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Stage 3 · Executive Analytics Synthesis
              </span>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Combines all 4 specialist outputs
            </span>
          </div>

          <div>
            {renderAgentBox('agent5', '3')}
          </div>
        </div>

      </div>

      {/* Dynamic Workflow Legend & Status Banner */}
      <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Data Flow:</span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
            1. Plan (Agent 4)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            2. Specialists (1, 2, 3, 6)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            3. Synthesize (Agent 5)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
            4. Executive Actions (Agent 4)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span>Click any agent box to inspect inputs, prompt, or raw JSON</span>
        </div>
      </div>

    </div>
  );
};
