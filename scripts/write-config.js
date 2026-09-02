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

const url = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "").trim();
const key = (process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || "").trim();

const seen = Object.keys(process.env)
  .filter((name) => /supabase/i.test(name))
  .sort()
  .join(", ") || "(ninguna)";
console.log("Variables SUPABASE visibles en el build: " + seen);

if (!url.startsWith("https://") || url.includes("TU-PROYECTO") || key.length < 20) {
  console.error("Faltan SUPABASE_URL o SUPABASE_ANON_KEY en el entorno de Netlify.");
  console.error("Creá las dos variables en Site configuration → Environment variables.");
  console.error("No tildes 'Contains secret values'. Usá All scopes y el mismo valor para todos los contextos.");
  process.exit(1);
}

const dest = path.join(__dirname, "..", "config.js");
const contents =
  "window.SUPABASE_URL = " + JSON.stringify(url) + ";\n" +
  "window.SUPABASE_ANON_KEY = " + JSON.stringify(key) + ";\n";

fs.writeFileSync(dest, contents);
console.log("config.js escrito con SUPABASE_URL");
