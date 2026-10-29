import type {DailyTaskItem} from '../types';

export type TaskAlert={taskId:string;title:string;date:string;days:number;label:string;level:'danger'|'warning'|'info';stepId?:string};
const validDate=(value:string)=>/^\d{4}-\d{2}-\d{2}$/.test(value)&&!Number.isNaN(Date.parse(value))&&new Date(value+'T12:00:00Z').toISOString().slice(0,10)===value;
export function taskAlerts(tasks:DailyTaskItem[],today:string):TaskAlert[]{
 if(!validDate(today))return [];
 const days=(date:string)=>Math.round((Date.parse(date+'T12:00:00Z')-Date.parse(today+'T12:00:00Z'))/86400000);
 return tasks.flatMap(task=>{
  if(task.status==='Completada')return [];
  const result:TaskAlert[]=[];
  if(validDate(task.dueDate)){
   const remaining=days(task.dueDate);
   if(remaining<=30)result.push({taskId:task.id,title:task.title,date:task.dueDate,days:remaining,level:remaining<0?'danger':remaining<=7?'warning':'info',label:remaining<0?'Compromiso pasado · verificar gestión y soporte':remaining===0?'El compromiso vence hoy':`Compromiso en ${remaining} días`});
  }
  for(const step of task.checklist){
   const date=step.label.match(/^(\d{4}-\d{2}-\d{2})\s*·/)?.[1];
   if(step.done||!date||!validDate(date))continue;
   const remaining=days(date);
   if(remaining<=30)result.push({taskId:task.id,title:task.title,date,days:remaining,stepId:step.id,level:remaining<=7?'warning':'info',label:remaining<0?'Entrega con fecha pasada · recepción por verificar':remaining===0?'Revisar entrega de hoy':`Preparar entrega en ${remaining} días`});
  }
  return result;
 }).sort((a,b)=>a.date.localeCompare(b.date)||a.title.localeCompare(b.title));
}
