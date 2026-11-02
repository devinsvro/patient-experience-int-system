import { PatientRecord } from '../types';

export const DISTINCT_SAMPLE_COMMENTS = [
  {
    id: "C-001",
    text: "Waited 3.5 hours past scheduled time in the Emergency waiting area with severe abdominal pain and no clinical update or water provided.",
  },
  {
    id: "C-002",
    text: "Nurse Elena explained medication dosage and potential drug interactions with warmth and gave me large-font printed instructions.",
  },
  {
    id: "C-003",
    text: "Received automated discharge summary through the patient portal solely in English despite marking Spanish as my primary spoken and written language.",
  },
  {
    id: "C-004",
    text: "Billed $1,450 for post-op consultation that pre-authorization paperwork explicitly marked as fully covered in-network.",
  },
  {
    id: "C-005",
    text: "Attending physician seemed rushed, spoke over my concerns, and dismissed my worsening shortness of breath as simple stress.",
  },
  {
    id: "C-006",
    text: "The patient portal app crashed repeatedly when attempting to view cardiac lab results before my follow-up appointment.",
  },
  {
    id: "C-007",
    text: "Wheelchair accessibility ramp at the west clinic entrance was blocked by construction debris, requiring my daughter to carry me up steps.",
  },
  {
    id: "C-008",
    text: "Physical therapy team at Orthopedics was outstanding; they set realistic milestones and kept me motivated throughout recovery.",
  },
  {
    id: "C-009",
    text: "Phlebotomist couldn't find a vein on four attempts and left severe bruising without calling a vascular specialist.",
  },
  {
    id: "C-010",
    text: "Prescription refill requested on Monday was not transmitted to the pharmacy until Friday afternoon, causing missed antibiotic doses.",
  },
  {
    id: "C-011",
    text: "Discharge nurse gave conflicting instructions about whether to take blood thinners the night before cardiac stent procedure.",
  },
  {
    id: "C-012",
    text: "Clean rooms, punctual ultrasound appointment, and friendly reception staff made the visit as stress-free as possible.",
  }
];

export const INITIAL_PATIENT_RECORDS: PatientRecord[] = [
  // C-001: ED Wait Time (10 records)
  { Record_ID: "REC-1001", Patient_Persona: "Working Parent", Age_Group: "36-50", Visit_Type: "Emergency", Service_Line: "Emergency", Year: 2026, Patient_Satisfaction: 2, Communication_Rating: 1, Followup_Compliance: 0, Portal_Usage: 0, Readmission_Risk: "High", AI_Risk_Flag: "Human Review Required", Comment: DISTINCT_SAMPLE_COMMENTS[0].text },
  { Record_ID: "REC-1002", Patient_Persona: "Tech-Savvy Millennial", Age_Group: "18-35", Visit_Type: "Emergency", Service_Line: "Emergency", Year: 2026, Patient_Satisfaction: 3, Communication_Rating: 2, Followup_Compliance: 1, Portal_Usage: 1, Readmission_Risk: "Medium", AI_Risk_Flag: "None", Comment: DISTINCT_SAMPLE_COMMENTS[0].text },
  { Record_ID: "REC-1003", Patient_Persona: "Elderly Chronic Care", Age_Group: "65+", Visit_Type: "Emergency", Service_Line: "Emergency", Year: 2026, Patient_Satisfaction: 1, Communication_Rating: 1, Followup_Compliance: 0, Portal_Usage: 0, Readmission_Risk: "High", AI_Risk_Flag: "Patient Safety Alert", Comment: DISTINCT_SAMPLE_COMMENTS[0].text },
  { Record_ID: "REC-1004", Patient_Persona: "Rural Senior", Age_Group: "65+", Visit_Type: "Emergency", Service_Line: "Emergency", Year: 2025, Patient_Satisfaction: 2, Communication_Rating: 1, Followup_Compliance: 0, Portal_Usage: 0, Readmission_Risk: "High", AI_Risk_Flag: "Human Review Required", Comment: DISTINCT_SAMPLE_COMMENTS[0].text },
  { Record_ID: "REC-1005", Patient_Persona: "Working Parent", Age_Group: "36-50", Visit_Type: "Emergency", Service_Line: "Emergency", Year: 2026, Patient_Satisfaction: 2, Communication_Rating: 2, Followup_Compliance: 1, Portal_Usage: 1, Readmission_Risk: "Medium", AI_Risk_Flag: "None", Comment: DISTINCT_SAMPLE_COMMENTS[0].text },
  { Record_ID: "REC-1006", Patient_Persona: "ESL First-Generation", Age_Group: "51-64", Visit_Type: "Emergency", Service_Line: "Emergency", Year: 2025, Patient_Satisfaction: 1, Communication_Rating: 1, Followup_Compliance: 0, Portal_Usage: 0, Readmission_Risk: "High", AI_Risk_Flag: "Bias Review", Comment: DISTINCT_SAMPLE_COMMENTS[0].text },
  { Record_ID: "REC-1007", Patient_Persona: "Post-Surgical Recovering", Age_Group: "51-64", Visit_Type: "Emergency", Service_Line: "Emergency", Year: 2026, Patient_Satisfaction: 2, Communication_Rating: 1, Followup_Compliance: 1, Portal_Usage: 1, Readmission_Risk: "High", AI_Risk_Flag: "Patient Safety Alert", Comment: DISTINCT_SAMPLE_COMMENTS[0].text },
  { Record_ID: "REC-1008", Patient_Persona: "Elderly Chronic Care", Age_Group: "65+", Visit_Type: "Emergency", Service_Line: "Emergency", Year: 2025, Patient_Satisfaction: 1, Communication_Rating: 1, Followup_Compliance: 0, Portal_Usage: 0, Readmission_Risk: "High", AI_Risk_Flag: "Human Review Required", Comment: DISTINCT_SAMPLE_COMMENTS[0].text },

  // C-002: Nurse Elena Positive (8 records)
  { Record_ID: "REC-1009", Patient_Persona: "Elderly Chronic Care", Age_Group: "65+", Visit_Type: "Inpatient", Service_Line: "Cardiology", Year: 2026, Patient_Satisfaction: 10, Communication_Rating: 5, Followup_Compliance: 1, Portal_Usage: 1, Readmission_Risk: "Low", AI_Risk_Flag: "None", Comment: DISTINCT_SAMPLE_COMMENTS[1].text },
  { Record_ID: "REC-1010", Patient_Persona: "Rural Senior", Age_Group: "65+", Visit_Type: "Inpatient", Service_Line: "Oncology", Year: 2026, Patient_Satisfaction: 9, Communication_Rating: 5, Followup_Compliance: 1, Portal_Usage: 0, Readmission_Risk: "Low", AI_Risk_Flag: "None", Comment: DISTINCT_SAMPLE_COMMENTS[1].text },
  { Record_ID: "REC-1011", Patient_Persona: "Working Parent", Age_Group: "36-50", Visit_Type: "Outpatient Clinic", Service_Line: "Pediatrics", Year: 2025, Patient_Satisfaction: 10, Communication_Rating: 5, Followup_Compliance: 1, Portal_Usage: 1, Readmission_Risk: "Low", AI_Risk_Flag: "None", Comment: DISTINCT_SAMPLE_COMMENTS[1].text },
  { Record_ID: "REC-1012", Patient_Persona: "Post-Surgical Recovering", Age_Group: "51-64", Visit_Type: "Inpatient", Service_Line: "Orthopedics", Year: 2026, Patient_Satisfaction: 9, Communication_Rating: 5, Followup_Compliance: 1, Portal_Usage: 1, Readmission_Risk: "Low", AI_Risk_Flag: "None", Comment: DISTINCT_SAMPLE_COMMENTS[1].text },
  { Record_ID: "REC-1013", Patient_Persona: "Elderly Chronic Care", Age_Group: "65+", Visit_Type: "Inpatient", Service_Line: "Cardiology", Year: 2025, Patient_Satisfaction: 10, Communication_Rating: 5, Followup_Compliance: 1, Portal_Usage: 0, Readmission_Risk: "Low", AI_Risk_Flag: "None", Comment: DISTINCT_SAMPLE_COMMENTS[1].text },

  // C-003: English-only Portal for Spanish Speaker (7 records)
  { Record_ID: "REC-1014", Patient_Persona: "ESL First-Generation", Age_Group: "51-64", Visit_Type: "Outpatient Clinic", Service_Line: "Cardiology", Year: 2026, Patient_Satisfaction: 3, Communication_Rating: 1, Followup_Compliance: 0, Portal_Usage: 0, Readmission_Risk: "Medium", AI_Risk_Flag: "Bias Review", Comment: DISTINCT_SAMPLE_COMMENTS[2].text },
  { Record_ID: "REC-1015", Patient_Persona: "ESL First-Generation", Age_Group: "65+", Visit_Type: "Inpatient", Service_Line: "General Surgery", Year: 2026, Patient_Satisfaction: 2, Communication_Rating: 1, Followup_Compliance: 0, Portal_Usage: 0, Readmission_Risk: "High", AI_Risk_Flag: "Bias Review", Comment: DISTINCT_SAMPLE_COMMENTS[2].text },
  { Record_ID: "REC-1016", Patient_Persona: "ESL First-Generation", Age_Group: "36-50", Visit_Type: "Outpatient Clinic", Service_Line: "Pediatrics", Year: 2025, Patient_Satisfaction: 3, Communication_Rating: 2, Followup_Compliance: 0, Portal_Usage: 0, Readmission_Risk: "Medium", AI_Risk_Flag: "Bias Review", Comment: DISTINCT_SAMPLE_COMMENTS[2].text },
  { Record_ID: "REC-1017", Patient_Persona: "ESL First-Generation", Age_Group: "65+", Visit_Type: "Telehealth", Service_Line: "Cardiology", Year: 2026, Patient_Satisfaction: 2, Communication_Rating: 1, Followup_Compliance: 0, Portal_Usage: 0, Readmission_Risk: "High", AI_Risk_Flag: "Human Review Required", Comment: DISTINCT_SAMPLE_COMMENTS[2].text },
  { Record_ID: "REC-1018", Patient_Persona: "ESL First-Generation", Age_Group: "18-35", Visit_Type: "Outpatient Clinic", Service_Line: "Orthopedics", Year: 2026, Patient_Satisfaction: 4, Communication_Rating: 2, Followup_Compliance: 1, Portal_Usage: 1, Readmission_Risk: "Low", AI_Risk_Flag: "Bias Review", Comment: DISTINCT_SAMPLE_COMMENTS[2].text },

  // C-004: Billing Discrepancy ($1,450 charge) (6 records)
  { Record_ID: "REC-1019", Patient_Persona: "Working Parent", Age_Group: "36-50", Visit_Type: "Outpatient Clinic", Service_Line: "Orthopedics", Year: 2026, Patient_Satisfaction: 3, Communication_Rating: 2, Followup_Compliance: 1, Portal_Usage: 1, Readmission_Risk: "Low", AI_Risk_Flag: "None", Comment: DISTINCT_SAMPLE_COMMENTS[3].text },
  { Record_ID: "REC-1020", Patient_Persona: "Tech-Savvy Millennial", Age_Group: "18-35", Visit_Type: "Surgical Follow-up", Service_Line: "General Surgery", Year: 2026, Patient_Satisfaction: 2, Communication_Rating: 2, Followup_Compliance: 1, Portal_Usage: 1, Readmission_Risk: "Low", AI_Risk_Flag: "None", Comment: DISTINCT_SAMPLE_COMMENTS[3].text },
  { Record_ID: "REC-1021", Patient_Persona: "Rural Senior", Age_Group: "65+", Visit_Type: "Outpatient Clinic", Service_Line: "Cardiology", Year: 2025, Patient_Satisfaction: 2, Communication_Rating: 2, Followup_Compliance: 0, Portal_Usage: 0, Readmission_Risk: "Medium", AI_Risk_Flag: "Human Review Required", Comment: DISTINCT_SAMPLE_COMMENTS[3].text },
  { Record_ID: "REC-1022", Patient_Persona: "Post-Surgical Recovering", Age_Group: "51-64", Visit_Type: "Surgical Follow-up", Service_Line: "Orthopedics", Year: 2026, Patient_Satisfaction: 3, Communication_Rating: 2, Followup_Compliance: 1, Portal_Usage: 1, Readmission_Risk: "Low", AI_Risk_Flag: "None", Comment: DISTINCT_SAMPLE_COMMENTS[3].text },

  // C-005: Rushed Physician Dismissed Chest Pain (5 records - CRITICAL SAFETY RISK)
  { Record_ID: "REC-1023", Patient_Persona: "Elderly Chronic Care", Age_Group: "65+", Visit_Type: "Outpatient Clinic", Service_Line: "Cardiology", Year: 2026, Patient_Satisfaction: 1, Communication_Rating: 1, Followup_Compliance: 0, Portal_Usage: 0, Readmission_Risk: "High", AI_Risk_Flag: "Patient Safety Alert", Comment: DISTINCT_SAMPLE_COMMENTS[4].text },
  { Record_ID: "REC-1024", Patient_Persona: "Working Parent", Age_Group: "36-50", Visit_Type: "Emergency", Service_Line: "Emergency", Year: 2026, Patient_Satisfaction: 2, Communication_Rating: 1, Followup_Compliance: 0, Portal_Usage: 1, Readmission_Risk: "High", AI_Risk_Flag: "Patient Safety Alert", Comment: DISTINCT_SAMPLE_COMMENTS[4].text },
  { Record_ID: "REC-1025", Patient_Persona: "Rural Senior", Age_Group: "51-64", Visit_Type: "Outpatient Clinic", Service_Line: "Cardiology", Year: 2025, Patient_Satisfaction: 1, Communication_Rating: 1, Followup_Compliance: 0, Portal_Usage: 0, Readmission_Risk: "High", AI_Risk_Flag: "Patient Safety Alert", Comment: DISTINCT_SAMPLE_COMMENTS[4].text },

  // C-006: Portal App Crash before follow-up (6 records)
  { Record_ID: "REC-1026", Patient_Persona: "Tech-Savvy Millennial", Age_Group: "18-35", Visit_Type: "Telehealth", Service_Line: "Cardiology", Year: 2026, Patient_Satisfaction: 4, Communication_Rating: 3, Followup_Compliance: 1, Portal_Usage: 1, Readmission_Risk: "Low", AI_Risk_Flag: "None", Comment: DISTINCT_SAMPLE_COMMENTS[5].text },
  { Record_ID: "REC-1027", Patient_Persona: "Elderly Chronic Care", Age_Group: "65+", Visit_Type: "Outpatient Clinic", Service_Line: "Cardiology", Year: 2026, Patient_Satisfaction: 3, Communication_Rating: 2, Followup_Compliance: 0, Portal_Usage: 1, Readmission_Risk: "Medium", AI_Risk_Flag: "None", Comment: DISTINCT_SAMPLE_COMMENTS[5].text },
  { Record_ID: "REC-1028", Patient_Persona: "Working Parent", Age_Group: "36-50", Visit_Type: "Outpatient Clinic", Service_Line: "Oncology", Year: 2026, Patient_Satisfaction: 4, Communication_Rating: 3, Followup_Compliance: 1, Portal_Usage: 1, Readmission_Risk: "Medium", AI_Risk_Flag: "None", Comment: DISTINCT_SAMPLE_COMMENTS[5].text },

  // C-007: Wheelchair Ramp Blocked (Accessibility Violation) (5 records)
  { Record_ID: "REC-1029", Patient_Persona: "Rural Senior", Age_Group: "65+", Visit_Type: "Outpatient Clinic", Service_Line: "Orthopedics", Year: 2026, Patient_Satisfaction: 1, Communication_Rating: 2, Followup_Compliance: 0, Portal_Usage: 0, Readmission_Risk: "Medium", AI_Risk_Flag: "Human Review Required", Comment: DISTINCT_SAMPLE_COMMENTS[6].text },
  { Record_ID: "REC-1030", Patient_Persona: "Post-Surgical Recovering", Age_Group: "51-64", Visit_Type: "Outpatient Clinic", Service_Line: "Orthopedics", Year: 2026, Patient_Satisfaction: 2, Communication_Rating: 2, Followup_Compliance: 1, Portal_Usage: 0, Readmission_Risk: "High", AI_Risk_Flag: "Human Review Required", Comment: DISTINCT_SAMPLE_COMMENTS[6].text },
  { Record_ID: "REC-1031", Patient_Persona: "Elderly Chronic Care", Age_Group: "65+", Visit_Type: "Outpatient Clinic", Service_Line: "Oncology", Year: 2025, Patient_Satisfaction: 1, Communication_Rating: 1, Followup_Compliance: 0, Portal_Usage: 0, Readmission_Risk: "High", AI_Risk_Flag: "Human Review Required", Comment: DISTINCT_SAMPLE_COMMENTS[6].text },

  // C-008: Physical Therapy Outstanding (6 records)
  { Record_ID: "REC-1032", Patient_Persona: "Post-Surgical Recovering", Age_Group: "51-64", Visit_Type: "Surgical Follow-up", Service_Line: "Orthopedics", Year: 2026, Patient_Satisfaction: 10, Communication_Rating: 5, Followup_Compliance: 1, Portal_Usage: 1, Readmission_Risk: "Low", AI_Risk_Flag: "None", Comment: DISTINCT_SAMPLE_COMMENTS[7].text },
  { Record_ID: "REC-1033", Patient_Persona: "Tech-Savvy Millennial", Age_Group: "18-35", Visit_Type: "Outpatient Clinic", Service_Line: "Orthopedics", Year: 2026, Patient_Satisfaction: 10, Communication_Rating: 5, Followup_Compliance: 1, Portal_Usage: 1, Readmission_Risk: "Low", AI_Risk_Flag: "None", Comment: DISTINCT_SAMPLE_COMMENTS[7].text },
  { Record_ID: "REC-1034", Patient_Persona: "Working Parent", Age_Group: "36-50", Visit_Type: "Surgical Follow-up", Service_Line: "Orthopedics", Year: 2025, Patient_Satisfaction: 9, Communication_Rating: 5, Followup_Compliance: 1, Portal_Usage: 1, Readmission_Risk: "Low", AI_Risk_Flag: "None", Comment: DISTINCT_SAMPLE_COMMENTS[7].text },

  // C-009: Phlebotomy Vein Bruising (4 records)
  { Record_ID: "REC-1035", Patient_Persona: "Elderly Chronic Care", Age_Group: "65+", Visit_Type: "Outpatient Clinic", Service_Line: "Oncology", Year: 2026, Patient_Satisfaction: 3, Communication_Rating: 2, Followup_Compliance: 1, Portal_Usage: 0, Readmission_Risk: "Medium", AI_Risk_Flag: "None", Comment: DISTINCT_SAMPLE_COMMENTS[8].text },
  { Record_ID: "REC-1036", Patient_Persona: "Working Parent", Age_Group: "36-50", Visit_Type: "Outpatient Clinic", Service_Line: "Cardiology", Year: 2026, Patient_Satisfaction: 4, Communication_Rating: 2, Followup_Compliance: 1, Portal_Usage: 1, Readmission_Risk: "Low", AI_Risk_Flag: "None", Comment: DISTINCT_SAMPLE_COMMENTS[8].text },

  // C-010: Delayed Prescription Refill (Antibiotic) (5 records)
  { Record_ID: "REC-1037", Patient_Persona: "Rural Senior", Age_Group: "65+", Visit_Type: "Outpatient Clinic", Service_Line: "Emergency", Year: 2026, Patient_Satisfaction: 2, Communication_Rating: 2, Followup_Compliance: 0, Portal_Usage: 0, Readmission_Risk: "High", AI_Risk_Flag: "Patient Safety Alert", Comment: DISTINCT_SAMPLE_COMMENTS[9].text },
  { Record_ID: "REC-1038", Patient_Persona: "Working Parent", Age_Group: "36-50", Visit_Type: "Outpatient Clinic", Service_Line: "Pediatrics", Year: 2026, Patient_Satisfaction: 3, Communication_Rating: 2, Followup_Compliance: 1, Portal_Usage: 1, Readmission_Risk: "Medium", AI_Risk_Flag: "Human Review Required", Comment: DISTINCT_SAMPLE_COMMENTS[9].text },

  // C-011: Conflicting Blood Thinner Instructions (Critical Safety Risk) (5 records)
  { Record_ID: "REC-1039", Patient_Persona: "Elderly Chronic Care", Age_Group: "65+", Visit_Type: "Inpatient", Service_Line: "Cardiology", Year: 2026, Patient_Satisfaction: 2, Communication_Rating: 1, Followup_Compliance: 0, Portal_Usage: 0, Readmission_Risk: "High", AI_Risk_Flag: "Patient Safety Alert", Comment: DISTINCT_SAMPLE_COMMENTS[10].text },
  { Record_ID: "REC-1040", Patient_Persona: "Rural Senior", Age_Group: "65+", Visit_Type: "Inpatient", Service_Line: "Cardiology", Year: 2026, Patient_Satisfaction: 1, Communication_Rating: 1, Followup_Compliance: 0, Portal_Usage: 0, Readmission_Risk: "High", AI_Risk_Flag: "Patient Safety Alert", Comment: DISTINCT_SAMPLE_COMMENTS[10].text },
  { Record_ID: "REC-1041", Patient_Persona: "ESL First-Generation", Age_Group: "51-64", Visit_Type: "Inpatient", Service_Line: "Cardiology", Year: 2025, Patient_Satisfaction: 2, Communication_Rating: 1, Followup_Compliance: 0, Portal_Usage: 0, Readmission_Risk: "High", AI_Risk_Flag: "Hallucination Risk", Comment: DISTINCT_SAMPLE_COMMENTS[10].text },

  // C-012: Clean Rooms & Friendly Ultrasound (5 records)
  { Record_ID: "REC-1042", Patient_Persona: "Working Parent", Age_Group: "36-50", Visit_Type: "Outpatient Clinic", Service_Line: "Pediatrics", Year: 2026, Patient_Satisfaction: 10, Communication_Rating: 5, Followup_Compliance: 1, Portal_Usage: 1, Readmission_Risk: "Low", AI_Risk_Flag: "None", Comment: DISTINCT_SAMPLE_COMMENTS[11].text },
  { Record_ID: "REC-1043", Patient_Persona: "Tech-Savvy Millennial", Age_Group: "18-35", Visit_Type: "Outpatient Clinic", Service_Line: "Oncology", Year: 2026, Patient_Satisfaction: 9, Communication_Rating: 5, Followup_Compliance: 1, Portal_Usage: 1, Readmission_Risk: "Low", AI_Risk_Flag: "None", Comment: DISTINCT_SAMPLE_COMMENTS[11].text },
  { Record_ID: "REC-1044", Patient_Persona: "Elderly Chronic Care", Age_Group: "65+", Visit_Type: "Outpatient Clinic", Service_Line: "General Surgery", Year: 2025, Patient_Satisfaction: 9, Communication_Rating: 4, Followup_Compliance: 1, Portal_Usage: 0, Readmission_Risk: "Low", AI_Risk_Flag: "None", Comment: DISTINCT_SAMPLE_COMMENTS[11].text },
];

export const PRESET_SCENARIOS = [
  {
    id: 'standard',
    name: 'Standard Hospital Quality Audit',
    description: '44 records covering Emergency, Cardiology, Orthopedics, Oncology with balanced risk flags.',
    records: INITIAL_PATIENT_RECORDS,
  },
  {
    id: 'portal_crisis',
    name: 'Emergency & Patient Portal Crisis',
    description: 'High volume of emergency wait complaints and portal outage incidents with low elderly portal usage.',
    records: INITIAL_PATIENT_RECORDS.filter((r) => 
      r.Service_Line === 'Emergency' || 
      r.Comment.includes('portal') || 
      r.Comment.includes('Waited') || 
      r.Age_Group === '65+'
    ),
  },
  {
    id: 'equity_access',
    name: 'Language Equity & Accessibility Focus',
    description: 'Emphasis on ESL discharge translations, ramp accessibility, and rural medication delays.',
    records: INITIAL_PATIENT_RECORDS.filter((r) => 
      r.Patient_Persona === 'ESL First-Generation' || 
      r.Patient_Persona === 'Rural Senior' || 
      r.AI_Risk_Flag !== 'None' ||
      r.Comment.includes('Spanish') || 
      r.Comment.includes('Wheelchair')
    ),
  },
];

export function parseCSVToRecords(csvText: string): PatientRecord[] {
  const lines = csvText.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length < 2) return [];

  // Parse header
  const headers = lines[0].split(',').map((h) => h.trim().replace(/^["']|["']$/g, ''));

  const records: PatientRecord[] = [];
  for (let i = 1; i < lines.length; i++) {
    // Regex to split on comma outside quotes
    const row = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || lines[i].split(',');
    const cleanRow = row.map((cell) => cell.trim().replace(/^["']|["']$/g, ''));
    if (cleanRow.length < 5) continue;

    const getCol = (name: string): string => {
      const idx = headers.findIndex((h) => h.toLowerCase() === name.toLowerCase());
      return idx >= 0 && cleanRow[idx] !== undefined ? cleanRow[idx] : '';
    };

    records.push({
      Record_ID: getCol('Record_ID') || `REC-${1000 + i}`,
      Patient_Persona: getCol('Patient_Persona') || 'General Patient',
      Age_Group: getCol('Age_Group') || '36-50',
      Visit_Type: getCol('Visit_Type') || 'Outpatient Clinic',
      Service_Line: getCol('Service_Line') || 'General',
      Year: parseInt(getCol('Year')) || 2026,
      Patient_Satisfaction: parseFloat(getCol('Patient_Satisfaction')) || 5,
      Communication_Rating: parseFloat(getCol('Communication_Rating')) || 3,
      Followup_Compliance: parseInt(getCol('Followup_Compliance')) || 0,
      Portal_Usage: parseInt(getCol('Portal_Usage')) || 0,
      Readmission_Risk: (['Low', 'Medium', 'High'].includes(getCol('Readmission_Risk'))
        ? getCol('Readmission_Risk')
        : 'Medium') as any,
      AI_Risk_Flag: (['None', 'Hallucination Risk', 'Bias Review', 'Human Review Required', 'Patient Safety Alert'].includes(getCol('AI_Risk_Flag'))
        ? getCol('AI_Risk_Flag')
        : 'None') as any,
      Comment: getCol('Comment') || 'Routine patient visit.',
    });
  }
  return records;
}

export function exportRecordsToCSV(records: PatientRecord[]): string {
  const headers = [
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
    'Comment',
  ];

  const rows = records.map((r) => [
    r.Record_ID,
    `"${r.Patient_Persona}"`,
    r.Age_Group,
    `"${r.Visit_Type}"`,
    `"${r.Service_Line}"`,
    r.Year,
    r.Patient_Satisfaction,
    r.Communication_Rating,
    r.Followup_Compliance,
    r.Portal_Usage,
    r.Readmission_Risk,
    `"${r.AI_Risk_Flag}"`,
    `"${r.Comment.replace(/"/g, '""')}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}
