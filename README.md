# Auditoría de Centros de Excelencia

Aplicativo de auditoría para centros HIC e ICV: SIP, auditorías, riesgos, hallazgos, planes de mejora, indicadores, revisión anual y agenda con checklists.

## Desarrollo

Requiere Node.js 22.12 o posterior. Ejecutar pnpm install --frozen-lockfile, pnpm run dev. Validar con pnpm test y pnpm run build.

## Datos y Supabase

El repositorio y el sitio estático no contienen registros privados de Almera ni datos ficticios de AI Studio. El directorio HIC/ICV se conserva como catálogo. Los datos se registran manualmente o se recuperan desde una copia privada.

Proyecto Supabase: ctelyszqiulavfsowged. La migración supabase/migrations/20261023_ce_workspace.sql prepara una tabla privada por usuario autenticado. Aplicarla una sola vez después de revisar sus permisos. Iniciar sesión en el aplicativo requiere una cuenta de Supabase Auth, distinta del acceso al dashboard. La clave de cliente es pública; nunca incorporar service_role o claves secretas.

La sincronización es explícita: consultar copia, guardar o recuperar. Usa control de versión para evitar sobrescrituras simultáneas. No hay sincronización en vivo con Almera, correo o calendario. Los respaldos locales y anexos privados están excluidos de Git.

## Render

Crear Static Site desde main de este repositorio. Build: pnpm install --frozen-lockfile && pnpm run build. Publish directory: dist. Configuración declarada en render.yaml. La agenda compartida con el asistente local requiere el servidor de desarrollo; en el sitio estático se puede copiar el resumen.

## Cambios

Por solicitud de la propietaria, cada cambio concluido debe verificarse, registrarse en un commit y enviarse a origin/main. Render despliega los commits de main cuando auto deploy está activo. No guardar credenciales, anexos ni contenido de auditoría en Git.
