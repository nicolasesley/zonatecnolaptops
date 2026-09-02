# Catálogo de Laptops — Zonatecno

Sitio estático del catálogo interno. Los datos viven en **Supabase**; el sitio se publica en **Netlify**.

## 1. Supabase

1. Creá un proyecto en [supabase.com](https://supabase.com).
2. En **SQL Editor**, pegá y ejecutá `supabase/schema.sql`.
3. En **Project Settings → API** copiá:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** → `SUPABASE_ANON_KEY`

No uses la `service_role` en el sitio.

## 2. Probar en local

```bash
copy config.example.js config.js
```

Editá `config.js` con tu URL y anon key. Después abrí `index.html` con un servidor local (no hace falta Node para el sitio):

```bash
npx --yes serve .
```

O generá `config.js` desde un `.env`:

```bash
copy .env.example .env
node scripts/write-config.js
```

## 3. Netlify

1. Subí este repo a GitHub.
2. En Netlify: **Add new site → Import an existing project**.
3. Build command: `node scripts/write-config.js` (ya está en `netlify.toml`).
4. Publish directory: `.`
5. En **Site configuration → Environment variables** agregá:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
6. Deploy.

En cada build, Netlify escribe `config.js` con esas variables. El archivo no se commitea.

## Notas

- La tabla `laptops` tiene RLS abierta para `anon` (catálogo interno). Si más adelante hay usuarios públicos, hay que restringir escritura.
- El CSV de importar/exportar sigue el mismo formato de antes.
- Si dos personas editan a la vez, Realtime recarga la tabla.
