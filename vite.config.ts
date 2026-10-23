import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { writeFile, rename } from 'node:fs/promises';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), {
      name: 'ce-local-agenda',
      configureServer(server) {
        server.middlewares.use('/api/ce-agenda', async (req, res) => {
          const host = req.headers.host || '';
          const origin = req.headers.origin;
          if (!/^(localhost|127\.0\.0\.1):\d+$/.test(host) || (origin && origin !== `http://${host}`)) { res.statusCode = 403; res.end(); return; }
          if (req.method !== 'POST' || !req.headers['content-type']?.startsWith('application/json')) { res.statusCode = 405; res.end(); return; }
          try {
            let body = '';
            for await (const chunk of req) { body += chunk; if (Buffer.byteLength(body) > 500000) { res.statusCode = 413; res.end(); return; } }
            const data = JSON.parse(body);
            if (!Array.isArray(data.tasks) || typeof data.summary !== 'string') { res.statusCode = 400; res.end(); return; }
            const file = path.resolve(import.meta.dirname, '../agenda-ce-compartida.json');
            await writeFile(`${file}.tmp`, JSON.stringify({ ...data, updatedAt: new Date().toISOString(), timezone: 'America/Bogota' }, null, 2), 'utf8');
            await rename(`${file}.tmp`, file);
            res.setHeader('Content-Type', 'application/json'); res.end('{"ok":true}');
          } catch { res.statusCode = 500; res.end(); }
        });
      }
    }],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
