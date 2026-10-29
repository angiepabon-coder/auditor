export type ProjectSchedule={title:string;actual:number|null;planned:number|null;compliance:number|null;responsible:string;start:string;end:string;source:string};
export type CenterProject={id:string;centerId:string;name:string;site:'HIC'|'ICV';code:string;source:string;checkedOn:string;period:string;state:string;responsible:string;start:string;end:string;actual:number|null;planned:number|null;compliance:number|null;description:string;objective:string;details:string;schedules:ProjectSchedule[]};
export type CenterCertification={centerId:string;name:string;site:'HIC'|'ICV';date:string;certifier:string;checkedOn:string;source:string;validUntil:string;notes:string};
export type AdditionalCenter={id:string;name:string;institution:'HIC'|'ICV';source:string;directorySource:string};
export function projectNeedsAttention(p:CenterProject,today:string){return(p.actual!==null&&p.planned!==null&&p.actual<p.planned)||p.schedules.some(s=>!!s.end&&s.end<today&&s.actual!==null&&s.actual<100);}
export function percent(value:number|null|undefined){return value==null?'Sin dato visible':value.toLocaleString('es-CO',{maximumFractionDigits:2})+'%';}

export function validateProjectEvidence(value:{projects?:unknown;certifications?:unknown;directory?:unknown}){
 for(const field of ['projects','certifications','directory'] as const)if(value[field]!==undefined&&!Array.isArray(value[field]))throw new Error('Formato de proyectos o certificaciones no compatible.');
 for(const p of (value.projects||[]) as CenterProject[]){
  if(!p)throw new Error('La ficha de proyecto contiene datos incompatibles.');
  const metrics=[p.actual,p.planned,p.compliance];
  if(!p||typeof p.id!=='string'||typeof p.centerId!=='string'||typeof p.name!=='string'||!['HIC','ICV'].includes(p.site)||!Array.isArray(p.schedules)||metrics.some(v=>v!==null&&(typeof v!=='number'||!Number.isFinite(v)||v<0)))throw new Error('La ficha de proyecto contiene datos incompatibles.');
 }
 for(const c of (value.certifications||[]) as CenterCertification[])if(!c||typeof c.centerId!=='string'||typeof c.name!=='string'||!['HIC','ICV'].includes(c.site)||!/^\d{4}-\d{2}-\d{2}$/.test(c.date))throw new Error('La certificación contiene datos incompatibles.');
 for(const c of (value.directory||[]) as AdditionalCenter[])if(!c||typeof c.id!=='string'||typeof c.name!=='string'||!['HIC','ICV'].includes(c.institution))throw new Error('El directorio adicional contiene datos incompatibles.');
}
