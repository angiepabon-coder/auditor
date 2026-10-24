// One-time removal of the original six sample agenda rows. Preserve a recovery copy.
export function removeDemoData(){
 try{if(localStorage.getItem('ce_demo_cleanup_v1'))return;
 const raw=localStorage.getItem('nigma_ce_daily_tasks');if(raw){const rows=JSON.parse(raw);if(Array.isArray(rows)){localStorage.setItem('ce_agenda_before_demo_cleanup',raw);localStorage.setItem('nigma_ce_daily_tasks',JSON.stringify(rows.filter(t=>!/^task-00[1-6]$/.test(t.id))));}}
 localStorage.setItem('ce_demo_cleanup_v1','done');
 }catch{/* Never block startup when browser storage is unavailable. */}
}
