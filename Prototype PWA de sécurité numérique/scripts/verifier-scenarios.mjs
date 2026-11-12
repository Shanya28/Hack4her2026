// Vérifie chaque scénario de src/content/scenarios avant de l'intégrer.
// Utile surtout pour les scénarios générés par IA : la structure et les règles
// du hackathon sont contrôlées ici, la justesse des conseils reste à relire
// par une personne (champ "relu").
//
// Usage : pnpm verifier:scenarios
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../src/content/scenarios");
const PORTRAITS = ["afi", "maya", "kevin", "rh", "chantal"];
const MAX_MESSAGE = 220;

// Aucune marque réelle ne doit être imitée ou citée.
const BRANDS =
  /(?<![a-zà-ÿ])(whatsapp|facebook|instagram|tiktok|snapchat|telegram|messenger|gmail|google|yahoo|mtn|moov|celtiis|orange money|wave|momo)(?![a-zà-ÿ])/i;
// Aucune coordonnée réelle : numéros, e-mails, liens cliquables.
const CONTACT_DATA = /(\+?\d[\d .-]{7,}\d|[\w.-]+@[\w-]+\.[a-z]{2,}|https?:\/\/)/i;
// Le ton ne culpabilise jamais.
const BLAME = /(c'est ta faute|c’est ta faute|tu aurais d[uû]|tu n'aurais pas d[uû]|bien fait pour toi|tu l'as cherché)/i;
// Aucun contenu explicite.
const EXPLICIT = /(?<![a-zà-ÿ])(nue|nues|nu|seins|sexe|sexuel|sexuelle)(?![a-zà-ÿ])/i;

const isText = (v) => typeof v === "string" && v.trim().length > 0;
let errors = 0;
const toReview = [];
const ids = new Set();
const orders = new Set();

for (const file of readdirSync(dir).filter((f) => f.endsWith(".json")).sort()) {
  const problems = [];
  const fail = (message) => problems.push(message);
  let scenario;
  try {
    scenario = JSON.parse(readFileSync(path.join(dir, file), "utf8"));
  } catch (e) {
    console.log(`✗ ${file}\n    JSON invalide : ${e.message}`);
    errors++;
    continue;
  }

  for (const key of ["id", "title", "profile", "summary"])
    if (!isText(scenario[key])) fail(`champ « ${key} » manquant`);
  if (!Number.isFinite(scenario.order)) fail("champ « order » manquant (nombre)");
  if (ids.has(scenario.id)) fail(`id « ${scenario.id} » déjà utilisé`);
  if (orders.has(scenario.order)) fail(`order ${scenario.order} déjà utilisé`);
  ids.add(scenario.id);
  orders.add(scenario.order);
  if (!["équipe", "ia"].includes(scenario.source)) fail("« source » doit valoir « équipe » ou « ia »");
  if (typeof scenario.relu !== "boolean") fail("« relu » doit valoir true ou false");
  const contact = scenario.contact ?? {};
  if (!isText(contact.name) || !isText(contact.status)) fail("« contact » incomplet (name, status)");
  if (!PORTRAITS.includes(contact.portrait)) fail(`portrait inconnu : ${contact.portrait}`);

  // Mot du jour (facultatif) : le thème de l'histoire, à deviner pour l'ouvrir.
  if (scenario.mot !== undefined) {
    const mot = scenario.mot;
    if (!isText(mot.mot) || /\s/.test(mot.mot.trim())) fail("mot du jour : « mot » doit être un seul mot");
    if (!isText(mot.lecon)) fail("mot du jour : « lecon » manquante");
    if (!Array.isArray(mot.indices) || mot.indices.length !== 3 || !mot.indices.every(isText))
      fail("mot du jour : 3 indices attendus");
    for (const key of ["chaud", "tiede"])
      if (!Array.isArray(mot[key]) || mot[key].length < 5 || !mot[key].every(isText))
        fail(`mot du jour : au moins 5 mots dans « ${key} »`);
  }

  const steps = Array.isArray(scenario.steps) ? scenario.steps : [];
  if (steps.length < 3 || steps.length > 7) fail(`il faut 3 à 7 situations (trouvé : ${steps.length})`);
  const withLink = steps.filter((s) => s.attachment);
  if (withLink.length > 1) fail("une seule situation peut contenir un lien piégé");
  if (steps[0]?.attachment || steps.at(-1)?.attachment)
    fail("le lien piégé ne peut être ni la première ni la dernière situation");

  steps.forEach((step, i) => {
    const where = `situation ${i + 1}`;
    if (!isText(step.chapter)) fail(`${where} : titre manquant`);
    const messages = Array.isArray(step.messages) ? step.messages : [];
    if (messages.length < 1 || messages.length > 4) fail(`${where} : 1 à 4 messages attendus`);
    for (const message of messages) {
      if (!Array.isArray(message) || !isText(message[0]) || !isText(message[1]))
        fail(`${where} : message mal formé`);
      else if (message[1].length > MAX_MESSAGE)
        fail(`${where} : message trop long (${message[1].length} caractères)`);
    }
    if (step.header?.portrait && !PORTRAITS.includes(step.header.portrait))
      fail(`${where} : portrait inconnu : ${step.header.portrait}`);

    if (step.attachment) {
      for (const key of ["label", "url", "cta", "pageUrl", "pageTitle", "pageText", "clue"])
        if (!isText(step.attachment[key])) fail(`${where} : lien piégé sans « ${key} »`);
      if (!/example/.test(step.attachment.url ?? ""))
        fail(`${where} : l'adresse du lien doit être fictive (contenir « example »)`);
      return;
    }

    const choices = Array.isArray(step.choices) ? step.choices : [];
    if (choices.length !== 3) fail(`${where} : 3 choix attendus (trouvé : ${choices.length})`);
    for (const choice of choices) {
      for (const key of ["label", "outcome", "advice"])
        if (!isText(choice[key])) fail(`${where} : choix sans « ${key} »`);
      if (typeof choice.protective !== "boolean") fail(`${where} : « protective » doit valoir true ou false`);
      // Facultatif : les cartes de la fiche « Mes 6 réflexes » (0 à 5) que ce choix débloque.
      if (choice.reflexes !== undefined) {
        const valid =
          Array.isArray(choice.reflexes) &&
          choice.reflexes.every((n) => Number.isInteger(n) && n >= 0 && n <= 5);
        if (!valid) fail(`${where} : « reflexes » doit être une liste de nombres de 0 à 5`);
        else if (choice.protective !== true)
          fail(`${where} : seul un choix protecteur peut débloquer un réflexe`);
      }
    }
    if (!choices.some((c) => c.protective === true)) fail(`${where} : aucun choix protecteur`);
    if (!choices.some((c) => c.protective === false)) fail(`${where} : aucun choix risqué`);
    if (!isText(step.feedback)) fail(`${where} : « feedback » (à retenir) manquant`);
  });

  // Règles de protection, sur tous les textes du scénario.
  const texts = [];
  const collect = (value) => {
    if (typeof value === "string") texts.push(value);
    else if (value && typeof value === "object") Object.values(value).forEach(collect);
  };
  collect({ ...scenario, id: "" });
  for (const text of texts) {
    const short = text.length > 60 ? `${text.slice(0, 60)}…` : text;
    if (BRANDS.test(text)) fail(`marque réelle citée : « ${short} »`);
    if (BLAME.test(text)) fail(`ton culpabilisant : « ${short} »`);
    if (EXPLICIT.test(text)) fail(`contenu explicite : « ${short} »`);
  }
  // Les adresses fictives des liens piégés sont autorisées, le reste non.
  const allowed = steps.flatMap((s) => (s.attachment ? [s.attachment.url, s.attachment.pageUrl] : []));
  for (const text of texts.filter((t) => !allowed.includes(t))) {
    if (CONTACT_DATA.test(text))
      fail(`coordonnée ou lien réel possible : « ${text.slice(0, 60)} »`);
  }

  if (problems.length) {
    errors += problems.length;
    console.log(`✗ ${file}`);
    for (const problem of problems) console.log(`    ${problem}`);
  } else {
    console.log(`✓ ${file} — ${steps.length} situations, source : ${scenario.source}`);
    if (scenario.relu === false) toReview.push(file);
  }
}

// « Vrai ou piège ? » : mêmes règles de protection, plus une règle propre au jeu.
// On montre le signe vu par la victime, jamais la recette de l'arnaqueur.
const RECIPE =
  /(comment (créer|fabriquer|faire) (un|une) (faux|fausse)|pour (piéger|arnaquer|tromper) quelqu|masquer (ton|son) (numéro|identité)|encaisser l'argent)/i;
{
  const file = "vrai-ou-piege.json";
  const problems = [];
  const fail = (message) => problems.push(message);
  let cards = [];
  try {
    cards = JSON.parse(readFileSync(path.join(dir, "..", file), "utf8"));
  } catch (e) {
    fail(`JSON invalide : ${e.message}`);
  }
  const seen = new Set();
  cards.forEach((card, i) => {
    const where = `message ${i + 1}`;
    for (const key of ["id", "category", "sender", "status", "text", "reflex"])
      if (!isText(card[key])) fail(`${where} : champ « ${key} » manquant`);
    if (seen.has(card.id)) fail(`${where} : id « ${card.id} » déjà utilisé`);
    seen.add(card.id);
    if (typeof card.trap !== "boolean") fail(`${where} : « trap » doit valoir true ou false`);
    if ((card.text ?? "").length > MAX_MESSAGE) fail(`${where} : message trop long`);
    const clues = Array.isArray(card.clues) ? card.clues : [];
    if (clues.length < 3 || clues.length > 4 || !clues.every(isText))
      fail(`${where} : 3 ou 4 signes attendus`);
    if (card.link !== undefined && !/example/.test(card.link))
      fail(`${where} : l'adresse du lien doit être fictive (contenir « example »)`);
    for (const text of [card.sender, card.status, card.text, card.reflex, ...clues]) {
      if (typeof text !== "string") continue;
      const short = text.length > 60 ? `${text.slice(0, 60)}…` : text;
      if (BRANDS.test(text)) fail(`${where} : marque réelle citée : « ${short} »`);
      if (BLAME.test(text)) fail(`${where} : ton culpabilisant : « ${short} »`);
      if (EXPLICIT.test(text)) fail(`${where} : contenu explicite : « ${short} »`);
      if (CONTACT_DATA.test(text)) fail(`${where} : coordonnée ou lien réel possible : « ${short} »`);
      if (RECIPE.test(text)) fail(`${where} : explique comment piéger au lieu de montrer le signe : « ${short} »`);
    }
  });
  const traps = cards.filter((c) => c.trap === true).length;
  if (cards.length - traps < 3) fail("il faut au moins 3 messages fiables, sinon « piège » gagne toujours");
  if (traps < 5) fail("il faut au moins 5 pièges");
  if (problems.length) {
    errors += problems.length;
    console.log(`✗ ${file}`);
    for (const problem of problems) console.log(`    ${problem}`);
  } else console.log(`✓ ${file} — ${cards.length} messages, dont ${traps} pièges`);
}

if (toReview.length)
  console.log(`\nÀ relire par l'équipe (puis passer "relu" à true) : ${toReview.join(", ")}`);
if (errors) {
  console.log(`\n${errors} problème(s) à corriger.`);
  process.exit(1);
}
console.log("\nTous les scénarios respectent la structure et les règles.");
