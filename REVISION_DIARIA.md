# Revisión diaria de Centros de Excelencia

Este procedimiento usa el navegador autorizado de la auditora. Requiere computador encendido, aplicación disponible y sesiones válidas. No es una conexión institucional por API ni un servicio que funcione con el equipo apagado.

## Fuentes y conservación

- Aplicativo: https://auditor-centros-excelencia.onrender.com/ingreso
- Almera: https://sgi.almeraim.com/sgi/seguimiento/?nosgim&c=sgifcv
- Los enlaces por centro y las evidencias están en `.private/`. Esa carpeta nunca se publica. `sources/` permanece de solo lectura.
- No leer ni extraer contraseñas, tokens o cookies. Si falta acceso, registrar el bloqueo y solicitar intervención. No cambiar permisos ni editar registros en Almera.
- Preservar todos los registros, notas, anexos y checklists manuales de la auditora.

## Consulta

1. General y Medición: revisar fichas, frecuencia, periodo, valores y meta vigente. Para indicadores mensuales y trimestrales, el plazo acordado es el día 5 calendario del mes siguiente al cierre. Contrastar la carga original antes de concluir mora; modificación y carga no son equivalentes.
2. Riesgos: consultar 2026 y el histórico cuando esté vacío. Esperar a que termine la carga de las tablas, incluidos sus indicadores de procesamiento, antes de registrar un resultado vacío. Revisar fichas, controles, evaluación y residual.
3. Bitácora: seguir el enlace visible del icono. Si la ventana emergente no abre, usar en una pestaña la URL expuesta por ese control. Distinguir creación y edición de riesgos, cálculo residual, evaluación de controles y revisión formal de la matriz; no sustituir unas fechas por otras.
4. Evaluaciones: consultar los detalles visibles y la última autoevaluación por centro. Mínimo una al año; separar fin registrado de aprobación o cierre efectivo. La ausencia de registro visible requiere confirmación, no prueba incumplimiento.
5. Planes de mejora: verificar plan de acción, PIME o mejora anual; acciones, fechas, avances, soporte y cumplimiento. Avance de 100% no prueba cierre. Mantener pendientes de fechas no visibles y acceso restringido.

Cada observación conserva fuente, fecha de consulta, cobertura y próximo paso con checklist. No inventar compromisos ni responsables. Mantener puntos de continuación de las consultas parciales y no actualizar la fecha de todo un módulo si solo se revisó una parte.

## Guardado

Consultar primero la copia actual de Supabase. Incorporar información comprobada mediante importación o edición del aplicativo. Preservar cambios manuales; no recuperar una copia antigua sobre cambios locales sin respaldo. Ante conflicto de versiones, detener la escritura y reconciliar. Comprobar la versión y fecha devueltas después de guardar.

## Agenda y comunicación

En Tareas diarias, abrir **Datos para el asistente de agenda** y leer el JSON visible. Conservar esa copia fiel, con fecha de lectura, en el archivo `agenda-ce-compartida.json` de la carpeta del proyecto ChatGPT, un nivel por encima del repositorio. No incluir credenciales. Si no se puede leer la agenda, no cambiar su fecha ni inventar tareas.

El asistente existente integra como máximo tres prioridades con correo y calendario. Las fechas de compromiso vacías son **por acordar**, no vencimientos. No marcar tareas completadas por inferencia. Preparar correos para revisión; no enviar mensajes ni crear o modificar eventos sin instrucción humana explícita para esa acción.

Notificar novedades relevantes, fallos o accesos necesarios. Permanecer en silencio cuando no haya cambios accionables; el asistente de agenda conserva su resumen diario solicitado. No declarar una revisión completa o sincronización en vivo si no se comprobó.

## Fichas de proyecto y centros certificados

6. En Almera, usar Buscar > Proyectos y consultar los proyectos de Centros de Excelencia. Conservar el código, vigencia, responsables, inicio, fin, descripción, objetivos, anexos, seguimientos y tabla de cronogramas. Separar avance real, programado y cumplimiento exactamente como aparecen: cumplimiento de 100% con programado 0% no acredita terminación. Un cumplimiento superior a 100% no debe recortarse ni interpretarse como avance real.
7. Contrastar centros certificados con las fuentes aportadas por la auditora y el soporte institucional disponible. No inferir certificación por avance del proyecto ni vigencia actual por la sola fecha de certificación. Los nombres dudosos se mantienen separados hasta confirmar correspondencia. La condición de certificado no cierra ni excluye el seguimiento de matriz, controles, residual, diligenciamiento, metas, autoevaluación y planes de mejora.

Las nuevas fichas y certificaciones se guardan como evidencia privada, con cobertura y fecha propias; no se actualiza por ello el corte de indicadores o riesgos. Los registros adicionales del directorio no equivalen a un censo institucional depurado. Conservar también las notas y checklists del módulo Proyectos y certificación en el respaldo de Supabase.

## Actividades del cargo e intraciclos

En Tareas diarias revisar las actividades incorporadas desde las fuentes privadas de entrega de cargo y comunicaciones. Mantener por separado recepción de información, revisión interna, carga, envío y aprobación de JCI. No completar casillas por inferencia ni tomar la fecha del correo como consulta actual de la plataforma.

Los pasos de checklist que comienzan con `AAAA-MM-DD ·` conservan la fecha de entrega de ese hito. Revisar los pendientes desde 30 días antes; priorizar los últimos 7 días, el día de vencimiento y los compromisos pasados. Un hito histórico sin evidencia genera verificación de recepción, no una declaración automática de incumplimiento. Conservar las fechas finales y su origen (comunicación oficial o control interno por contrastar).

Las actividades mensuales, trimestrales, anuales o condicionadas a una visita conservan la periodicidad descrita en su ficha. Verificar el ciclo vigente y el soporte antes de abrir el siguiente; deduplicar por actividad, centro y periodo. No reabrir ni borrar el checklist anterior. Los días hábiles 4 y 5 se calculan con calendario institucional confirmado; no sustituirlos por fechas calendario ni inventar festivos. Si falta fecha, mostrar compromiso por acordar. Los pasos de preparación de mensajes, carga o cambios en plataformas son tareas de la auditora; no constituyen autorización de envío, edición de Almera, modificación de permisos ni envío a JCI por el asistente.

Incluir estas alertas y fechas en la copia fiel para el asistente existente, con un máximo de tres prioridades diarias. No crear otra automatización por cada centro ni duplicar recordatorios.
