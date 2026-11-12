// Liste les phrases à enregistrer pour la voix d'un scénario dans une langue,
// avec le nom de fichier attendu, et indique celles qui sont déjà faites.
//
// Usage : pnpm audio:liste [langue] [scénario]     (défaut : fon sextorsion)
// Les enregistrements vont dans src/content/audio/<langue>/<scénario>/
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../src/content");
const [lang = "fon", id = "sextorsion"] = process.argv.slice(2);
const file = path.join(root, "scenarios", `${id}.json`);
if (!existsSync(file)) {
  const known = readdirSync(path.join(root, "scenarios")).map((f) => f.replace(".json", ""));
  console.log(`Scénario inconnu : ${id}. Disponibles : ${known.join(", ")}`);
  process.exit(1);
}
const scenario = JSON.parse(readFileSync(file, "utf8"));
const dir = path.join(root, "audio", lang, id);
const recorded = existsSync(dir) ? readdirSync(dir) : [];

console.log(`Voix en ${lang} — « ${scenario.title} »`);
console.log(`Dossier : src/content/audio/${lang}/${id}/\n`);
let total = 0;
let done = 0;
scenario.steps.forEach((step, s) => {
  console.log(step.chapter);
  step.messages.forEach(([who, text], m) => {
    if (who === "moi") return; // seule la voix de l'interlocuteur est lue
    const name = `${s + 1}-${m + 1}`;
    const has = recorded.some((f) => f.startsWith(`${name}.`));
    total++;
    if (has) done++;
    console.log(`  [${has ? "x" : " "}] ${name}.mp3  ${who} : ${text.replace(/^Image masquée · /, "")}`);
  });
});
console.log(`\n${done}/${total} enregistrements présents.`);
