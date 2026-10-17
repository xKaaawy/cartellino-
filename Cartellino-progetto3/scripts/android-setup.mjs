// Prepara il progetto Android generato da Capacitor: icone, splash, colore, versione.
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const res = path.join(root, "android/app/src/main/res");
const src = path.join(root, "resources");

if (!fs.existsSync(res)) {
  console.error("Cartella android non trovata: esegui prima `npx cap add android`.");
  process.exit(1);
}

// 1. Icone dell'app (mipmap) e icona piccola delle notifiche (drawable)
for (const dir of fs.readdirSync(src)) {
  const from = path.join(src, dir);
  if (!fs.statSync(from).isDirectory()) continue;
  const to = path.join(res, dir);
  fs.mkdirSync(to, { recursive: true });
  // evita risorse duplicate con estensione diversa (es. .webp del modello)
  for (const f of fs.readdirSync(to)) {
    if (/^ic_launcher.*\.webp$/.test(f)) fs.rmSync(path.join(to, f));
  }
  for (const f of fs.readdirSync(from)) fs.copyFileSync(path.join(from, f), path.join(to, f));
}

// 2. Colore di sfondo dell'icona adattiva
const values = path.join(res, "values");
fs.mkdirSync(values, { recursive: true });
fs.writeFileSync(
  path.join(values, "ic_launcher_background.xml"),
  '<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">#3B44C4</color>\n</resources>\n'
);

// 3. Schermata di avvio: sostituisce ogni splash.png del modello
const splash = path.join(src, "splash.png");
const walk = (d) => {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (f === "splash.png") fs.copyFileSync(splash, p);
  }
};
walk(res);

// 4. Ritorno dal login di Spotify: l'indirizzo cartellino-ore://spotify-callback riapre l'app
const manifest = path.join(root, "android/app/src/main/AndroidManifest.xml");
let mf = fs.readFileSync(manifest, "utf8");
if (!mf.includes("cartellino-ore")) {
  const filter = `
            <intent-filter>
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data android:scheme="cartellino-ore" android:host="spotify-callback" />
            </intent-filter>
        </activity>`;
  mf = mf.replace("</activity>", filter.trimStart());
  fs.writeFileSync(manifest, mf);
}

// 5. Numero di versione crescente (serve per installare gli aggiornamenti)
const run = parseInt(process.env.GITHUB_RUN_NUMBER || "1", 10);
const gradle = path.join(root, "android/app/build.gradle");
let g = fs.readFileSync(gradle, "utf8");
g = g.replace(/versionCode\s+\d+/, `versionCode ${run}`).replace(/versionName\s+"[^"]*"/, `versionName "1.${run}"`);
fs.writeFileSync(gradle, g);

console.log(`Android pronto: versione 1.${run}`);
