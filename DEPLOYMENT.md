# Estado de las plataformas

Actualización: 23 de octubre de 2026, Bogotá.

- GitHub de destino: https://github.com/angiepabon-coder/auditor, rama main. Repositorio público: únicamente código y configuración.
- Supabase: proyecto ctelyszqiulavfsowged. Se aplicó la migración 20261023_ce_workspace.sql; el editor confirmó éxito. Tabla ce_workspaces con acceso por propietario autenticado; acceso anónimo revocado. Falta completar la cuenta de Supabase Auth y verificar una escritura/lectura autenticada antes de declarar la sincronización operativa.
- Render: sitio estático previsto, publicando dist. Configuración en render.yaml. Pendiente completar la verificación de correo de la cuenta y crear el sitio.
- Los respaldos privados locales están en .private/, excluidos de Git y del sitio publicado.

Registrar aquí los cambios externos de configuración sin incorporar credenciales ni registros de auditoría.

## Publicación de código verificada

El proyecto completo (60 archivos) se publicó directamente mediante la sesión de GitHub, sin depender de la autorización de Git Credential Manager bloqueada por correo. Se recuperó origin/main y se verificaron compilación y pruebas de indicadores y almacenamiento. No hay datos privados de Almera en Git.

El push desde el equipo sigue pendiente de autorización; los cambios realizados mediante la interfaz de GitHub quedan registrados directamente en main. Render permanece bloqueado por la verificación del correo institucional.
