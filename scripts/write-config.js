const fs = require("fs");
const path = require("path");

function loadDotEnv() {
  const envPath = path.join(__dirname, "..", ".env");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadDotEnv();

let url = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "").trim();
const key = (process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || "").trim();
url = url.replace(/\/rest\/v1\/?$/, "");

const seen = Object.keys(process.env)
  .filter((name) => /supabase/i.test(name))
  .sort()
  .join(", ") || "(ninguna)";
console.log("Variables SUPABASE visibles en el build: " + seen);

if (!url.startsWith("https://") || url.includes("TU-PROYECTO") || key.length < 20) {
  console.error("Faltan SUPABASE_URL o SUPABASE_ANON_KEY en el entorno de Cloudflare.");
  console.error("En el proyecto: Settings → Variables and Secrets (o Environment variables).");
  console.error("Usá la Project URL de Supabase sin /rest/v1/ y la anon / publishable key.");
  process.exit(1);
}

const root = path.join(__dirname, "..");
const dist = path.join(root, "dist");
const contents =
  "window.SUPABASE_URL = " + JSON.stringify(url) + ";\n" +
  "window.SUPABASE_ANON_KEY = " + JSON.stringify(key) + ";\n";

fs.mkdirSync(dist, { recursive: true });
fs.copyFileSync(path.join(root, "index.html"), path.join(dist, "index.html"));
fs.writeFileSync(path.join(dist, "config.js"), contents);
fs.writeFileSync(path.join(root, "config.js"), contents);
console.log("config.js escrito con SUPABASE_URL");
console.log("dist/ listo para deploy (index.html + config.js)");
