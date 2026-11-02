import { PatientRecord, DatasetKPIs, DistinctComment } from '../types';

export function calculateDatasetKPIs(records: PatientRecord[]): DatasetKPIs {
  const total = records.length;
  if (total === 0) {
    return {
      totalRecords: 0,
      avgSatisfaction: 0,
      avgCommunication: 0,
      followupComplianceRate: 0,
      portalUsageRate: 0,
      satisfactionByServiceLine: {},
      satisfactionByYear: {},
      satisfactionByPersona: {},
      satisfactionByVisitType: {},
      recordsByReadmissionRisk: {},
      recordsByAiRiskFlag: {},
      serviceLineCounts: {},
    };
  }

  let totalSat = 0;
  let totalComm = 0;
  let totalFollowup = 0;
  let totalPortal = 0;

  const satByService: Record<string, { sum: number; count: number }> = {};
  const satByYear: Record<string, { sum: number; count: number }> = {};
  const satByPersona: Record<string, { sum: number; count: number }> = {};
  const satByVisitType: Record<string, { sum: number; count: number }> = {};
  const readmissionCounts: Record<string, number> = {};
  const aiRiskCounts: Record<string, number> = {};
  const serviceCounts: Record<string, number> = {};

  records.forEach((rec) => {
    totalSat += Number(rec.Patient_Satisfaction) || 0;
    totalComm += Number(rec.Communication_Rating) || 0;
    totalFollowup += Number(rec.Followup_Compliance) === 1 ? 1 : 0;
    totalPortal += Number(rec.Portal_Usage) === 1 ? 1 : 0;

    // By Service Line
    const sLine = rec.Service_Line || 'Unassigned';
    if (!satByService[sLine]) satByService[sLine] = { sum: 0, count: 0 };
    satByService[sLine].sum += Number(rec.Patient_Satisfaction) || 0;
    satByService[sLine].count += 1;
    serviceCounts[sLine] = (serviceCounts[sLine] || 0) + 1;

    // By Year
    const yearStr = String(rec.Year || 2026);
    if (!satByYear[yearStr]) satByYear[yearStr] = { sum: 0, count: 0 };
    satByYear[yearStr].sum += Number(rec.Patient_Satisfaction) || 0;
    satByYear[yearStr].count += 1;

    // By Persona
    const persona = rec.Patient_Persona || 'General';
    if (!satByPersona[persona]) satByPersona[persona] = { sum: 0, count: 0 };
    satByPersona[persona].sum += Number(rec.Patient_Satisfaction) || 0;
    satByPersona[persona].count += 1;

    // By Visit Type
    const vType = rec.Visit_Type || 'Outpatient Clinic';
    if (!satByVisitType[vType]) satByVisitType[vType] = { sum: 0, count: 0 };
    satByVisitType[vType].sum += Number(rec.Patient_Satisfaction) || 0;
    satByVisitType[vType].count += 1;

    // Categorical counts
    const readm = rec.Readmission_Risk || 'Low';
    readmissionCounts[readm] = (readmissionCounts[readm] || 0) + 1;

    const riskFlag = rec.AI_Risk_Flag || 'None';
    aiRiskCounts[riskFlag] = (aiRiskCounts[riskFlag] || 0) + 1;
  });

  const avgSatisfaction = Number((totalSat / total).toFixed(2));
  const avgCommunication = Number((totalComm / total).toFixed(2));
  const followupComplianceRate = Number(((totalFollowup / total) * 100).toFixed(1));
  const portalUsageRate = Number(((totalPortal / total) * 100).toFixed(1));

  const satisfactionByServiceLine: Record<string, number> = {};
  Object.keys(satByService).forEach((k) => {
    satisfactionByServiceLine[k] = Number((satByService[k].sum / satByService[k].count).toFixed(2));
  });

  const satisfactionByYear: Record<string, number> = {};
  Object.keys(satByYear).forEach((k) => {
    satisfactionByYear[k] = Number((satByYear[k].sum / satByYear[k].count).toFixed(2));
  });

  const satisfactionByPersona: Record<string, number> = {};
  Object.keys(satByPersona).forEach((k) => {
    satisfactionByPersona[k] = Number((satByPersona[k].sum / satByPersona[k].count).toFixed(2));
  });

  const satisfactionByVisitType: Record<string, number> = {};
  Object.keys(satByVisitType).forEach((k) => {
    satisfactionByVisitType[k] = Number((satByVisitType[k].sum / satByVisitType[k].count).toFixed(2));
  });

  return {
    totalRecords: total,
    avgSatisfaction,
    avgCommunication,
    followupComplianceRate,
    portalUsageRate,
    satisfactionByServiceLine,
    satisfactionByYear,
    satisfactionByPersona,
    satisfactionByVisitType,
    recordsByReadmissionRisk: readmissionCounts,
    recordsByAiRiskFlag: aiRiskCounts,
    serviceLineCounts: serviceCounts,
  };
}

/**
 * Extracts unique comments across all records with their frequencies and risk flags.
 * Deduplication ensures each distinct comment is sent only once to AI models.
 */
export function extractDistinctComments(records: PatientRecord[]): DistinctComment[] {
  const map: Map<string, {
    count: number;
    commSum: number;
    aiFlags: Record<string, number>;
    recordIds: string[];
    index: number;
  }> = new Map();

  let counter = 1;
  records.forEach((rec) => {
    const text = (rec.Comment || '').trim();
    if (!text) return;

    if (!map.has(text)) {
      map.set(text, {
        count: 0,
        commSum: 0,
        aiFlags: {},
        recordIds: [],
        index: counter++,
      });
    }

    const item = map.get(text)!;
    item.count += 1;
    item.commSum += Number(rec.Communication_Rating) || 0;
    item.recordIds.push(rec.Record_ID);
    const flag = rec.AI_Risk_Flag || 'None';
    item.aiFlags[flag] = (item.aiFlags[flag] || 0) + 1;
  });

  const result: DistinctComment[] = [];
  map.forEach((val, text) => {
    result.push({
      id: `C-${String(val.index).padStart(3, '0')}`,
      text,
      count: val.count,
      avgCommunicationRating: Number((val.commSum / val.count).toFixed(1)),
      aiRiskFlags: val.aiFlags,
      recordIds: val.recordIds,
    });
  });

  // Sort by count descending so prominent issues are analyzed first
  return result.sort((a, b) => b.count - a.count);
}
