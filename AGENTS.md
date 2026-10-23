# Instrucciones de mantenimiento

Después de cada cambio concluido y validado del aplicativo, realizar commit y push a origin/main, según autorización de la usuaria. No sobrescribir historial remoto.

No incorporar datos ficticios, credenciales ni registros privados de Almera al código o a Git. Los datos privados residen en Supabase o en respaldos locales excluidos (.private/). No activar permisos públicos para esos registros.

Antes de publicar: npm test y npm run build. El despliegue es un sitio estático de Render. Los cambios externos de plataforma deben documentarse en el repositorio sin secretos y luego registrarse con commit y push.
