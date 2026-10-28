# Estado de las plataformas

Actualización: 26 de octubre de 2026, Bogotá.

## GitHub

Repositorio público: https://github.com/angiepabon-coder/auditor, rama main. Código completo sin registros privados de Almera ni datos de ejemplo de AI Studio. Compilación y pruebas de indicadores y almacenamiento verificadas.

Los cambios de plataforma se documentan y se registran como commits directamente en GitHub. La copia local se sincroniza con origin/main. El push desde el equipo continúa pendiente de autorización de Git Credential Manager.

## Render

Sitio estático publicado y abierto correctamente: https://auditor-centros-excelencia.onrender.com/

- Blueprint: auditoria-centros-excelencia (exs-dbfl6uavcj2c738inv3g).
- Servicio: auditor-centros-excelencia (srv-dbfl71tg1s2s73885s2g).
- Configuración: render.yaml de main.
- Build: pnpm install --frozen-lockfile && pnpm run build.
- Directorio publicado: dist.
- Primer despliegue confirmado Live: 8b92ca9.
- Reescritura SPA y encabezados declarados en render.yaml.
- Auto-Deploy se declara como commit en el Blueprint; comprobar recepción de eventos del repositorio público antes de asumir que cada commit dispara despliegue.

## Supabase y datos privados

Proyecto: ctelyszqiulavfsowged. Migración 20261023_ce_workspace.sql aplicada. Tabla ce_workspaces con acceso por propietario autenticado; acceso anónimo revocado. Conexión protegida comprobada desde el sitio público. Falta completar una cuenta de Supabase Auth y comprobar guardado y recuperación autenticados antes de declarar la sincronización operativa.

Los respaldos privados están en .private/, excluidos de Git y de la publicación. El sitio nuevo muestra el directorio de 32 centros; el corte de Almera y los registros privados se cargan o recuperan por cuenta. No hay consulta en vivo de Almera ni envío automático de correos.

## Preparación para el trabajo diario · 26 de octubre de 2026

Cuenta privada de Supabase Auth creada y verificada en el panel administrativo. Corte privado importado en el navegador del sitio publicado. El guardado y la recuperación autenticados deben comprobarse desde la cuenta de la auditora.

Se incorporaron creación y edición de tareas con checklist obligatorio, guardado automático opcional tras el primer respaldo manual, detección de cambios pendientes, renovación de sesión y conservación de sesión por pestaña únicamente si la persona activa esa opción. Las credenciales quedan excluidas de los respaldos de auditoría. Las fechas de revisión de la auditora se separan de las fechas registradas de las autoevaluaciones.

Guía de uso: GUIA_DIARIA.md. Registrar la confirmación de guardado y la publicación de esta actualización después de verificarlas.

## Trazabilidad de revisión de matrices

La tabla de riesgos distingue el resultado y fecha de consulta, el sistema anual, la evaluación documentada de controles y la fecha visible del análisis. Estas dos últimas no sustituyen las fechas formales de creación, revisión de matriz, ejecución de controles o revisión residual. La evidencia y el checklist se consultan por registro. Los resultados institucionales permanecen en el respaldo privado; no se incorporan al código ni al despliegue estático.

Validación: TypeScript, comprobaciones de base de datos, 23 comprobaciones de indicadores y compilación de producción satisfactorias.

## Ingreso diario · 27 de octubre de 2026

Ruta permanente `/ingreso`, cubierta por la reescritura SPA existente. Abre el panel de cuenta sin guardar credenciales y presenta agenda, indicadores, riesgos y fechas de consulta por módulo. La fecha de hoy se calcula en Bogotá y no se confunde con el corte de datos. Se advierte cuando no existe consulta cargada para hoy. El respaldo autenticado debe confirmarse desde la cuenta de la auditora. La actualización diaria de Almera sigue requiriendo acceso institucional y una consulta/importación; no se declara una sincronización programada inexistente.

## Operación y visuales · 28 de octubre de 2026

Se verificó desde el aplicativo el guardado autenticado de la versión 1 y su consulta posterior en Supabase. Los respaldos continúan aislados por propietario. La importación de evidencia actualiza el corte conservando anotaciones manuales, fechas y checklists, con copia previa local y sin recargar la sesión.

El tablero y la sección Informes presentan gráficos por sede, autoevaluaciones, matrices, planes y agenda. Los gráficos se calculan a partir de datos privados cargados, muestran cifras y alcance, y permiten imprimir/guardar PDF desde el navegador y descargar CSV compatible con Excel. No contienen registros institucionales en el código público. Un registro visible no acredita cumplimiento; el fin registrado de evaluación no se presenta como cierre efectivo.

Se programó revisión diaria a las 06:00 de Bogotá y se actualizó el asistente de agenda y correos a las 06:30. Son automatizaciones locales: requieren equipo encendido, aplicación disponible y sesiones institucionales activas. El procedimiento REVISION_DIARIA.md define consultas, evidencias, conservación de datos y restricciones. No constituye una integración API de Almera ni un servicio continuo en Render. Gmail y calendario institucional conectados y comprobados en lectura; no se envían correos ni se modifican eventos automáticamente.

Las tareas de revisión pueden registrarse sin fecha de compromiso impuesta. Se muestran como «por acordar» y no se cuentan como vencidas. Las fechas de fuente y las pendientes de confirmar permanecen diferenciadas.

Validación: TypeScript, comprobaciones de base de datos con preservación de registros manuales, 23 comprobaciones de indicadores y compilación de producción satisfactorias.

## Acceso en una sola sección · 28 de octubre de 2026

El bloque de ingreso, conexión y respaldos se muestra únicamente en «Mi cuenta y datos». La ruta /ingreso abre esa sección. En Dashboard, indicadores, riesgos, planes y reportes no se repite el bloque. El panel permanece montado y oculto al navegar para conservar la sesión y el guardado automático activo; no cambia la política de conservación de credenciales.

## Recuperación de información por centro

Al iniciar sesión o abrir una sesión vigente se consulta la copia privada de Supabase. Si el espacio local no contiene trabajo, se recupera automáticamente y se actualiza la interfaz sin recargar ni perder la sesión. Si existen registros manuales, se conservan y se pide elegir la recuperación antes de reemplazarlos. El selector de indicadores muestra el nombre del centro y distingue un corte no recuperado de un centro sin fichas cargadas; no presenta el corte ausente como cumplimiento cero.
