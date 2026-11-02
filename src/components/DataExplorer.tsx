import React, { useState, useRef } from 'react';
import { PatientRecord, DistinctComment } from '../types';
import { 
  PRESET_SCENARIOS, 
  parseCSVToRecords, 
  exportRecordsToCSV 
} from '../data/sampleData';
import { 
  Upload, 
  Download, 
  Filter, 
  Search, 
  RotateCcw, 
  CheckSquare, 
  Square, 
  FileSpreadsheet,
  AlertTriangle,
  Layers,
  ChevronDown,
  Info
} from 'lucide-react';

interface DataExplorerProps {
  records: PatientRecord[];
  selectedRecordIds: Set<string>;
  onToggleRecord: (id: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onLoadScenario: (scenarioId: string) => void;
  onUploadCSV: (newRecords: PatientRecord[]) => void;
  distinctComments: DistinctComment[];
}

export const DataExplorer: React.FC<DataExplorerProps> = ({
  records,
  selectedRecordIds,
  onToggleRecord,
  onSelectAll,
  onDeselectAll,
  onLoadScenario,
  onUploadCSV,
  distinctComments,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceLineFilter, setServiceLineFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [activeSubTab, setActiveSubTab] = useState<'records' | 'distinct'>('records');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const parsed = parseCSVToRecords(text);
        if (parsed.length > 0) {
          onUploadCSV(parsed);
        }
      }
    };
    reader.readAsText(file);
  };

  const handleDownloadCSV = () => {
    const csvStr = exportRecordsToCSV(records);
    const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `hospital_patient_dataset_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter records
  const filteredRecords = records.filter((r) => {
    const matchesSearch = 
      r.Record_ID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.Comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.Patient_Persona.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesService = serviceLineFilter === 'all' || r.Service_Line === serviceLineFilter;
    const matchesRisk = riskFilter === 'all' || r.AI_Risk_Flag === riskFilter;

    return matchesSearch && matchesService && matchesRisk;
  });

  const allSelected = records.length > 0 && selectedRecordIds.size === records.length;

  return (
    <div className="w-full space-y-5">
      
      {/* Top Controls: Scenarios, CSV Upload, CSV Download */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        
        {/* Scenario Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider shrink-0">
            Scenario Preset:
          </span>
          {PRESET_SCENARIOS.map((sc) => (
            <button
              key={sc.id}
              onClick={() => onLoadScenario(sc.id)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
            >
              {sc.name}
            </button>
          ))}
        </div>

        {/* Upload & Download Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".csv"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload CSV</span>
          </button>

          <button
            onClick={handleDownloadCSV}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>

      </div>

      {/* View Switch: All Records vs Distinct Comments */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('records')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeSubTab === 'records'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            All Patient Records ({records.length})
          </button>
          <button
            onClick={() => setActiveSubTab('distinct')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeSubTab === 'distinct'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            Distinct Deduplicated Comments ({distinctComments.length})
          </button>
        </div>

        <div className="text-xs text-slate-500 hidden sm:block">
          <span className="font-mono tabular-nums font-bold text-slate-800 dark:text-slate-200">
            {selectedRecordIds.size}
          </span> of {records.length} records selected for analysis
        </div>
      </div>

      {/* DISTINCT COMMENTS VIEW (Deduplication explanation) */}
      {activeSubTab === 'distinct' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-xs text-teal-950 dark:text-teal-100 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <strong>Deduplication Pipeline:</strong> The {records.length} hospital records share {distinctComments.length} distinct recurring patient comments. The app sends each unique comment to Agent 1, 3, and 6 only ONCE with frequency counts, then links the AI interpretations back to every individual record in JavaScript.
            </div>
          </div>

          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Comment ID</th>
                  <th className="py-3 px-4">Distinct Patient Comment Text</th>
                  <th className="py-3 px-4 text-center">Record Occurrences</th>
                  <th className="py-3 px-4 text-center">Avg Comm. Rating</th>
                  <th className="py-3 px-4">AI Risk Flags Present</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {distinctComments.map((dc) => (
                  <tr key={dc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                      {dc.id}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200 max-w-lg">
                      "{dc.text}"
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-teal-600 dark:text-teal-400">
                      {dc.count} records
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold">
                      {dc.avgCommunicationRating} / 5
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(dc.aiRiskFlags).map(([flag, cnt]) => (
                          <span
                            key={flag}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                              flag === 'None'
                                ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            }`}
                          >
                            {flag} ({cnt})
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ALL RECORDS TABLE VIEW */}
      {activeSubTab === 'records' && (
        <div className="space-y-4">
          
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search record ID, comment text, or persona..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex items-center gap-2">
              <select
                value={serviceLineFilter}
                onChange={(e) => setServiceLineFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
              >
                <option value="all">All Service Lines</option>
                <option value="Emergency">Emergency</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Oncology">Oncology</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="General Surgery">General Surgery</option>
              </select>

              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
              >
                <option value="all">All AI Risk Flags</option>
                <option value="None">None</option>
                <option value="Patient Safety Alert">Patient Safety Alert</option>
                <option value="Human Review Required">Human Review Required</option>
                <option value="Bias Review">Bias Review</option>
                <option value="Hallucination Risk">Hallucination Risk</option>
              </select>

              <button
                onClick={allSelected ? onDeselectAll : onSelectAll}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 shrink-0 transition-colors"
              >
                {allSelected ? 'Deselect All' : 'Select All'}
              </button>
            </div>

          </div>

          {/* Table */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto max-h-[550px]">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 bg-slate-100/90 dark:bg-slate-800/90 backdrop-blur-md text-slate-500 uppercase font-semibold border-b border-slate-200 dark:border-slate-800 z-10">
                  <tr>
                    <th className="py-3 px-3 w-8">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={allSelected ? onDeselectAll : onSelectAll}
                        className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                      />
                    </th>
                    <th className="py-3 px-3">Record ID</th>
                    <th className="py-3 px-3">Persona & Age</th>
                    <th className="py-3 px-3">Service Line</th>
                    <th className="py-3 px-3">Visit Type</th>
                    <th className="py-3 px-3 text-center">Satisfaction</th>
                    <th className="py-3 px-3 text-center">Comm.</th>
                    <th className="py-3 px-3 text-center">Follow-up</th>
                    <th className="py-3 px-3 text-center">Portal</th>
                    <th className="py-3 px-3">AI Risk Flag</th>
                    <th className="py-3 px-3">Patient Comment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {filteredRecords.map((r) => {
                    const isSelected = selectedRecordIds.has(r.Record_ID);
                    return (
                      <tr
                        key={r.Record_ID}
                        onClick={() => onToggleRecord(r.Record_ID)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-teal-50/20 dark:bg-teal-950/20 hover:bg-teal-50/40'
                            : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/50'
                        }`}
                      >
                        <td className="py-3 px-3" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => onToggleRecord(r.Record_ID)}
                            className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                          />
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">
                          {r.Record_ID}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className="font-medium text-slate-800 dark:text-slate-200">{r.Patient_Persona}</span>
                          <span className="text-slate-400 block text-[10px]">Age {r.Age_Group}</span>
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                          {r.Service_Line}
                        </td>
                        <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                          {r.Visit_Type}
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-bold tabular-nums">
                          <span className={r.Patient_Satisfaction < 5 ? 'text-rose-600 font-bold' : ''}>
                            {r.Patient_Satisfaction}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center font-mono tabular-nums">
                          {r.Communication_Rating}
                        </td>
                        <td className="py-3 px-3 text-center font-mono">
                          {r.Followup_Compliance === 1 ? (
                            <span className="text-emerald-600 font-bold">Yes</span>
                          ) : (
                            <span className="text-slate-400">No</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-center font-mono">
                          {r.Portal_Usage === 1 ? (
                            <span className="text-teal-600 font-bold">Active</span>
                          ) : (
                            <span className="text-slate-400">Off</span>
                          )}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                              r.AI_Risk_Flag === 'None'
                                ? 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                                : r.AI_Risk_Flag === 'Patient Safety Alert'
                                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            }`}
                          >
                            {r.AI_Risk_Flag}
                          </span>
                        </td>
                        <td className="py-3 px-3 max-w-xs truncate text-slate-600 dark:text-slate-400" title={r.Comment}>
                          {r.Comment}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
