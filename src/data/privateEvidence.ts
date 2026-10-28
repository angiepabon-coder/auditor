import type {AlmeraCenter,AlmeraIndicator,AlmeraEntry} from './privateEvidenceTypes';
export type PrivateEvidence={centers:AlmeraCenter[];indicators:AlmeraIndicator[];entries:AlmeraEntry[]};
export function readPrivateEvidence():PrivateEvidence {try{const value=JSON.parse(localStorage.getItem('nigma_ce_evidence_v1')||'null');if(value&&Array.isArray(value.centers)&&Array.isArray(value.indicators)&&Array.isArray(value.entries))return value;}catch{}return {centers:[],indicators:[],entries:[]};}
export let privateEvidence=readPrivateEvidence();
export let almeraReview=privateEvidence.centers;
export let almeraIndicators=privateEvidence.indicators;
export let almeraEntries=privateEvidence.entries;
export function refreshPrivateEvidence(){privateEvidence=readPrivateEvidence();almeraReview=privateEvidence.centers;almeraIndicators=privateEvidence.indicators;almeraEntries=privateEvidence.entries;}
