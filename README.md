# Catálogo de Laptops — Zonatecno

Sitio estático del catálogo interno. Los datos viven en **Supabase**; el sitio se publica en **Cloudflare Workers**.

Producción: https://zonatecnolaptops.nicolas-esley.workers.dev/

## 1. Supabase

1. Creá un proyecto en [supabase.com](https://supabase.com).
2. En **SQL Editor**, pegá y ejecutá `supabase/schema.sql`.
3. En **Project Settings → API** copiá:
   - **Project URL** → `SUPABASE_URL` (sin `/rest/v1/`)
   - **anon public** o **publishable** → `SUPABASE_ANON_KEY`

No uses la `service_role` en el sitio.

## 2. Probar en local

```bash
copy config.example.js config.js
```

Editá `config.js` con tu URL y anon key. Después abrí `index.html` con un servidor local (no hace falta Node para el sitio):

```bash
npx --yes serve .
```

`config.js` no se commitea: Cloudflare lo genera en el deploy.

## 3. Cloudflare

Build command: `node scripts/write-config.js`  
Deploy command: `npx wrangler versions upload`

El build genera `dist/index.html` + `dist/config.js`. Wrangler (`wrangler.jsonc`) publica esa carpeta como static assets del Worker `zonatecnolaptops`.

En **Settings → Variables and Secrets** (o Environment variables) agregá:
- `SUPABASE_URL` — Project URL, sin `/rest/v1/`
- `SUPABASE_ANON_KEY` — anon public / publishable key

## Notas

- La tabla `laptops` tiene RLS abierta para `anon` (catálogo interno). Si más adelante hay usuarios públicos, hay que restringir escritura.
- El CSV de importar/exportar sigue el mismo formato de antes.
- Si dos personas editan a la vez, Realtime recarga la tabla.
