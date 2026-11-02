import React from 'react';
import { RunMode, WorkflowStep } from '../types';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ArrowRight, 
  SlidersHorizontal, 
  Sparkles, 
  ShieldAlert, 
  HelpCircle,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface WorkflowControlBarProps {
  managerQuestion: string;
  onChangeQuestion: (q: string) => void;
  runMode: RunMode;
  onChangeRunMode: (m: RunMode) => void;
  currentStep: WorkflowStep;
  isProcessing: boolean;
  waitingForApproval: boolean;
  onStartRun: () => void;
  onApproveAndContinue: () => void;
  onReset: () => void;
  hasCompleted: boolean;
}

export const WorkflowControlBar: React.FC<WorkflowControlBarProps> = ({
  managerQuestion,
  onChangeQuestion,
  runMode,
  onChangeRunMode,
  currentStep,
  isProcessing,
  waitingForApproval,
  onStartRun,
  onApproveAndContinue,
  onReset,
  hasCompleted,
}) => {
  const PRESET_QUESTIONS = [
    "What should management fix first to improve patient experience, and which cases need human review?",
    "Identify urgent patient safety and equity risks across cardiology and emergency services.",
    "Evaluate portal adoption barriers for rural seniors and non-English speaking patients.",
  ];

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
      
      {/* Question Input Section */}
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-teal-500" />
            <span>Hospital Manager's Guiding Question:</span>
          </label>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Agent 4 initiates with this question and synthesizes the final management answer
          </span>
        </div>

        <div className="relative">
          <input
            type="text"
            value={managerQuestion}
            onChange={(e) => onChangeQuestion(e.target.value)}
            disabled={isProcessing}
            placeholder="Enter clinical or managerial question for the agent team..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all font-medium"
          />
        </div>

        {/* Question Preset Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] text-slate-400 font-medium mr-1">Presets:</span>
          {PRESET_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isProcessing}
              onClick={() => onChangeQuestion(q)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors truncate max-w-xs text-left"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Mode & Action Controls Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
        
        {/* Run Mode Switch */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 shrink-0">
            Execution Mode:
          </span>
          <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => onChangeRunMode('auto')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                runMode === 'auto'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Auto Run (Continuous)
            </button>
            <button
              type="button"
              onClick={() => onChangeRunMode('step')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                runMode === 'step'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Step-by-Step Review
            </button>
          </div>
        </div>

        {/* Step Progress Pills */}
        <div className="hidden lg:flex items-center gap-2 text-xs">
          {[
            { step: 1, label: '1. Plan (A4)' },
            { step: 2, label: '2. Specialists' },
            { step: 3, label: '3. Analytics (A5)' },
            { step: 4, label: '4. Decisions (A4)' },
          ].map((item) => (
            <div
              key={item.step}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                currentStep === item.step && isProcessing
                  ? 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 ring-1 ring-cyan-500/40 animate-pulse'
                  : currentStep > item.step || hasCompleted
                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
              }`}
            >
              {currentStep > item.step || hasCompleted ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <span className="w-3.5 h-3.5 rounded-full text-[10px] font-bold flex items-center justify-center bg-slate-200 dark:bg-slate-700">
                  {item.step}
                </span>
              )}
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        {/* Execution Buttons */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          
          {waitingForApproval ? (
            <button
              type="button"
              onClick={onApproveAndContinue}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs shadow-md shadow-amber-500/20 flex items-center gap-2 transition-transform active:scale-95 animate-pulse"
            >
              <span>Approve & Continue to Step {currentStep + 1}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isProcessing}
              onClick={onStartRun}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow-md flex items-center gap-2 transition-all active:scale-95 ${
                isProcessing
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white shadow-teal-500/20'
              }`}
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{hasCompleted ? 'Re-Run All Agents' : 'Start Multi-Agent Analysis'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={onReset}
            disabled={isProcessing}
            title="Reset agent states"
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors disabled:opacity-50"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Review Notice Banner when Paused */}
      {waitingForApproval && (
        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Review Checkpoint:</strong> Step {currentStep} complete. Inspect results above. You can toggle specialists or edit tasks before clicking "Approve & Continue".
            </span>
          </div>
        </div>
      )}

    </div>
  );
};
