import type {AlmeraCenter,AlmeraIndicator,AlmeraEntry} from './privateEvidenceTypes';
export type PrivateEvidence={centers:AlmeraCenter[];indicators:AlmeraIndicator[];entries:AlmeraEntry[]};
export function readPrivateEvidence():PrivateEvidence {try{const value=JSON.parse(localStorage.getItem('nigma_ce_evidence_v1')||'null');if(value&&Array.isArray(value.centers)&&Array.isArray(value.indicators)&&Array.isArray(value.entries))return value;}catch{}return {centers:[],indicators:[],entries:[]};}
export const privateEvidence=readPrivateEvidence();
export const almeraReview=privateEvidence.centers;
export const almeraIndicators=privateEvidence.indicators;
export const almeraEntries=privateEvidence.entries;
