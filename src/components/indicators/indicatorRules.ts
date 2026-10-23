export type Indicator = {
  id: string; centerId: string; name: string; frequency: 'Mensual' | 'Trimestral' | 'Semestral' | 'Anual';
  firstMonth: string; deadlineDays: number | null; operator: '>=' | '<=' | '>' | '<' | '=' | 'Entre';
  target: number; upper?: number; unit: string; responsible: string; email: string;
  source: string; verifiedOn: string;
};
export type Measurement = { id: string; indicatorId: string; period: string; reportedOn: string; value: number; source: string; originalDateUnverified?: boolean };
export type Evaluation = { period: string; end: string; due: string; measurement?: Measurement; timing: 'Posible retraso · verificar fecha original' | 'Plazo sin verificar' | 'Diligenciamiento sin verificar' | 'En plazo' | 'Pendiente en plazo' | 'Sin diligenciar · vencido' | 'Diligenciado tarde'; goal: 'Cumple' | 'Incumple' | 'Sin resultado'; };
export function meetsTarget(value: number, indicator: Indicator): boolean {
  switch (indicator.operator) {
    case '>=': return value >= indicator.target;
    case '<=': return value <= indicator.target;
    case '>': return value > indicator.target;
    case '<': return value < indicator.target;
    case '=': return value === indicator.target;
    case 'Entre': return indicator.upper !== undefined && value >= indicator.target && value <= indicator.upper;
  }
}
export function reportingDeadline(periodEnd: string, days: number): string {
  const due = new Date(periodEnd + 'T00:00:00Z');
  due.setUTCDate(due.getUTCDate() + days);
  return due.toISOString().slice(0, 10);
}
export function evaluateIndicator(indicator: Indicator, measurements: Measurement[], today: string, verifiedMissing: string[] = []): Evaluation[] {
  const [year, month] = indicator.firstMonth.split('-').map(Number);
  if (!year || month < 1 || month > 12 || (indicator.deadlineDays !== null && (!Number.isInteger(indicator.deadlineDays) || indicator.deadlineDays < 0))) return [];
  if (indicator.frequency === 'Trimestral' && (month - 1) % 3 !== 0) return [];
  const step = { Mensual:1, Trimestral:3, Semestral:6, Anual:12 }[indicator.frequency];
  if ((month - 1) % step !== 0) return [];
  const results: Evaluation[] = [];
  for (let offset = 0; offset < 1200; offset += step) {
    const start = new Date(Date.UTC(year, month - 1 + offset, 1));
    const end = new Date(Date.UTC(year, month - 1 + offset + step, 0));
    const endISO = end.toISOString().slice(0, 10);
    // A period still in progress is not treated as missing or assessed against a partial result.
    if (endISO >= today) break;
    const dueISO = indicator.deadlineDays === null ? '' : reportingDeadline(endISO, indicator.deadlineDays);
    const period = indicator.frequency === 'Mensual' ? start.toISOString().slice(0, 7) : `${start.getUTCFullYear()}-T${Math.floor(start.getUTCMonth() / 3) + 1}`;
    const normalizedPeriod = indicator.frequency === 'Anual' ? String(start.getUTCFullYear()) : indicator.frequency === 'Semestral' ? String(start.getUTCFullYear()) + '-S' + (Math.floor(start.getUTCMonth()/6)+1) : period;
    const measurement = measurements.find(m => m.indicatorId === indicator.id && m.period === normalizedPeriod);
    results.push({ period: normalizedPeriod, end: endISO, due: dueISO, measurement,
      timing: indicator.deadlineDays === null ? 'Plazo sin verificar' : !measurement && !verifiedMissing.includes(normalizedPeriod) ? 'Diligenciamiento sin verificar' : measurement ? (measurement.reportedOn <= dueISO ? 'En plazo' : measurement.originalDateUnverified ? 'Posible retraso · verificar fecha original' : 'Diligenciado tarde') : (today > dueISO ? 'Sin diligenciar · vencido' : 'Pendiente en plazo'),
      goal: measurement ? (meetsTarget(measurement.value, indicator) ? 'Cumple' : 'Incumple') : 'Sin resultado' });
  }
  return results;
}


