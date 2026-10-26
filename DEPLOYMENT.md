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
