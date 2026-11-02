export interface PatientRecord {
  Record_ID: string;
  Patient_Persona: string;
  Age_Group: string;
  Visit_Type: string;
  Service_Line: string;
  Year: number;
  Patient_Satisfaction: number; // 1-10
  Communication_Rating: number; // 1-5
  Followup_Compliance: number; // 0 or 1
  Portal_Usage: number; // 0 or 1
  Readmission_Risk: 'Low' | 'Medium' | 'High';
  AI_Risk_Flag: 'None' | 'Hallucination Risk' | 'Bias Review' | 'Human Review Required' | 'Patient Safety Alert';
  Comment: string;
}

export type AgentId = 
  | 'agent4_plan' 
  | 'agent1' 
  | 'agent2' 
  | 'agent3' 
  | 'agent6' 
  | 'agent5' 
  | 'agent4_final';

export type AgentStatus = 'pending' | 'running' | 'waiting_review' | 'completed' | 'skipped' | 'failed';

export interface AgentMeta {
  id: AgentId;
  agentNumber: number;
  orderNumber: number;
  code: string;
  title: string;
  shortName: string;
  role: string;
  color: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
  glowColor: string;
}

export interface DistinctComment {
  id: string;
  text: string;
  count: number;
  avgCommunicationRating: number;
  aiRiskFlags: Record<string, number>;
  recordIds: string[];
}

export interface DatasetKPIs {
  totalRecords: number;
  avgSatisfaction: number;
  avgCommunication: number;
  followupComplianceRate: number; // percentage 0-100
  portalUsageRate: number; // percentage 0-100
  satisfactionByServiceLine: Record<string, number>;
  satisfactionByYear: Record<string, number>;
  satisfactionByPersona: Record<string, number>;
  satisfactionByVisitType: Record<string, number>;
  recordsByReadmissionRisk: Record<string, number>;
  recordsByAiRiskFlag: Record<string, number>;
  serviceLineCounts: Record<string, number>;
}

// Agent 1 Types
export interface CommentInsight {
  id: string;
  theme: string;
  sentiment: 'Positive' | 'Negative' | 'Neutral' | 'Mixed';
  reasoning: string;
  operational_issue: string;
  risk_or_bias_concern: string;
  recommended_action: string;
}

export interface Agent1Result {
  comments: CommentInsight[];
  summary: string;
}

// Agent 2 Types
export interface PatternItem {
  pattern: string;
  evidence: string;
}

export interface EquityConcern {
  group: string;
  concern: string;
  evidence: string;
}

export interface Agent2Result {
  patterns: PatternItem[];
  operational_issues: string[];
  equity_concerns: EquityConcern[];
  risk: {
    patient_safety: string;
    reputational: string;
    compliance: string;
    equity: string;
  };
  recommendation: string;
  additional_information_needed: string;
}

// Agent 3 Types
export interface ComplaintRisk {
  risk: string;
  why: string;
}

export interface ComplaintTriageItem {
  id: string;
  primary_category: string;
  secondary_categories: string[];
  severity_level: 1 | 2 | 3 | 4;
  severity_reasoning: string;
  risks: ComplaintRisk[];
  route_to: string;
  human_review_required: boolean;
  human_review_reason: string;
}

export interface Agent3Result {
  complaints: ComplaintTriageItem[];
  summary: string;
}

// Agent 6 Types
export interface CommQualityScores {
  clarity: string | number;
  completeness: string | number;
  empathy: string | number;
  patient_centeredness: string | number;
  actionability: string | number;
}

export interface CommEvaluationItem {
  id: string;
  purpose: string;
  purpose_rationale: string;
  scores: CommQualityScores;
  health_literacy_concern: 'None' | 'Low' | 'Moderate' | 'High';
  risk: 'Low' | 'Moderate' | 'High';
  risk_reason: string;
  improvements: string[];
}

export interface Agent6Result {
  evaluations: CommEvaluationItem[];
  improved_patient_message: string;
  executive_summary: {
    overall_quality: string;
    major_strengths: string;
    major_weaknesses: string;
    highest_risk: string;
    most_important_improvement: string;
  };
}

// Agent 5 Types
export interface HiddenProblem {
  problem: string;
  evidence: string;
}

export interface Agent5Result {
  headline: string;
  satisfaction_insights: string[];
  top_themes: string[];
  hidden_problems: HiddenProblem[];
  ai_risk_monitoring: {
    hallucination_trap: string[];
    bias_related: string[];
    human_review: string[];
  };
  top_priorities: string[];
  quick_wins: string[];
  long_term_ai_opportunities: string[];
  additional_information_needed: string;
}

// Agent 4 Plan Types
export interface AgentPlanAssignment {
  agent: string;
  run: boolean;
  task: string;
  reason: string;
}

export interface Agent4PlanResult {
  goal: string;
  agents: AgentPlanAssignment[];
}

// Agent 4 Final Decision Types
export interface RecommendedAction {
  action: string;
  owner: string;
  timeframe: string;
}

export interface HumanReviewCase {
  item: string;
  reason: string;
}

export interface Agent4FinalResult {
  top_alert: string;
  answer: string;
  priority: 'Low' | 'Medium' | 'High';
  priority_reason: string;
  recommended_actions: RecommendedAction[];
  human_review: HumanReviewCase[];
}

export interface AgentState {
  status: AgentStatus;
  task: string;
  inputPayload: any;
  result: any | null;
  error?: string;
  executionTimeMs?: number;
}

export type RunMode = 'auto' | 'step';

export type WorkflowStep = 1 | 2 | 3 | 4;
