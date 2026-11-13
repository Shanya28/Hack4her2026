# Ayidote — dossier de remise HACK4HER 2026

Les trois PDF s’appuient sur la version publique effectivement utilisée le 13 novembre 2026 :

https://shanya28.github.io/Hack4her2026/

1. **01-Fiche-technique-et-risques-Ayidote.pdf** — 7 pages : besoin, public, institution envisagée, fonctionnalités disponibles, architecture, données, tests, Safety by Design, risques et conditions avant un pilote.
2. **02-Support-de-pitch-Ayidote.pdf** — 11 diapositives au format 16:9, avec captures du site et lien de démonstration.
3. **03-Demonstration-et-tests-Ayidote.pdf** — 5 pages : préparation, scénario de démonstration, procès-verbal des 25 cas et limites de validation.

La démonstration exigée reste l’application fonctionnelle : le troisième PDF fournit le lien, le parcours et les preuves, il ne remplace pas l’utilisation du prototype devant le jury.

## Résultats et limites

La campagne finale comprend 25 cas réussis : six histoires de cinq situations, deux longueurs du jeu collectif, grand quiz à deux équipes sur six questions, quiz individuel, progression, effacement, rechargement hors ligne, mode écoute français et contrôles ponctuels d’affichage/clavier.

Ces essais sont automatisés dans Chrome avec des profils isolés et des données fictives. Ils ne constituent ni un audit de sécurité complet, ni une validation WCAG, ni des tests avec le public cible ou sur des téléphones réels, ni une mesure d’impact.

La fiche signale notamment cinq histoires non marquées relues dans le dépôt, les traductions locales expérimentales, les références d’aide à confirmer et les limites de persistance/effacement. L’Institut National de la Femme est présenté comme relais envisagé, sans partenariat confirmé.

## Sources et preuves

- `preuves/resultats-tests.json` : campagne finale, assertions, captures, traces des requêtes et environnement.
- `preuves/inspection-initiale.json` : premier chargement et service worker.
- `preuves/*.png` : captures du site public, pas du serveur local.
- `preuves/verification-mise-en-page.json` : contrôle des pages et diapositives avant export PDF.
- `sources/generer-documents.py` et les HTML générés : sources éditables des documents.
- `sources/Notes-orales-du-pitch.md` : repères pour la présentation.
- `sources/tester-site.cjs` : reproduction des tests ; dépend du Playwright installé dans l’environnement de travail.
- `sources/diagnostic-initial/` : captures de mise au point du script, distinctes de la campagne finale.

Les exigences sont tirées du Module 2 (p. 5–9), du planning (p. 1–2) et de la note explicative MASS (p. 1–2). Les noms d’équipe, l’établissement et le public principal viennent de la fiche de cadrage fournie dans le dépôt.

## Régénération

Adapter le chemin de Playwright et Chrome dans les scripts si nécessaire.

```sh
node livrables/sources/tester-site.cjs
python3 livrables/sources/generer-documents.py
node livrables/sources/exporter-pdf.cjs
```

La génération des PDF utilise les captures existantes. Le test en ligne requiert une connexion. Aucune modification n’a été apportée au site déployé dans le cadre de cette tâche.
