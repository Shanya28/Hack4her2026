# Consigne pour générer un scénario avec une IA

À coller dans l'IA choisie, en remplaçant les deux lignes « Profil » et « Risque ».
Enregistrer la réponse dans `src/content/scenarios/<id>.json`, lancer
`pnpm verifier:scenarios`, puis faire relire le texte par une personne de l'équipe
avant de passer `"relu"` à `true`.

---

Tu écris un scénario fictif pour une application de prévention destinée à des jeunes
femmes de 15 à 30 ans au Bénin. Le scénario est une conversation par messagerie où une
personne tente de manipuler l'utilisatrice.

Profil de l'utilisatrice : <étudiante, commerçante, chercheuse d'emploi, apprentie…>
Risque numérique à illustrer : <sextorsion, faux recrutement, compte piraté, faux gain…>

Règles obligatoires :

- Tout est fictif : aucun nom de marque, d'application, d'opérateur ou d'organisme réel,
  aucun numéro de téléphone, aucune adresse e-mail.
- Aucun contenu sexuel explicite. Une image intime est seulement évoquée (« photo privée »).
- Le ton ne culpabilise jamais l'utilisatrice, même quand elle fait un choix risqué :
  la violence n'est pas la faute de la personne qui la subit.
- Les conseils sont prudents et concrets : vérifier par un autre moyen, ne pas payer,
  garder les preuves sans se mettre en danger, bloquer, en parler à une personne de confiance.
- Français simple, phrases courtes, messages de 220 caractères au plus.

Structure : exactement 5 situations. L'une d'elles (ni la première ni la dernière) contient
un lien piégé (`attachment`) à la place des choix. Les autres ont exactement 3 choix, dont
au moins un protecteur et au moins un risqué. Chaque choix a une conséquence (`outcome`,
ce qui se passe ensuite) et un conseil (`advice`). La dernière situation est une menace
(`"danger": true`).

Réponds uniquement avec un objet JSON de cette forme :

```json
{
  "id": "identifiant-court",
  "order": 4,
  "title": "Titre court",
  "profile": "Profil",
  "summary": "Une phrase qui résume la situation.",
  "source": "ia",
  "relu": false,
  "contact": { "name": "Nom affiché", "status": "sous-titre", "portrait": "kevin" },
  "steps": [
    {
      "chapter": "1 · Titre de la situation",
      "messages": [["Nom", "Texte du message"]],
      "choices": [
        { "label": "Réponse possible", "protective": false, "outcome": "…", "advice": "…" },
        { "label": "Réponse possible", "protective": true, "outcome": "…", "advice": "…" },
        { "label": "Réponse possible", "protective": true, "outcome": "…", "advice": "…" }
      ],
      "feedback": "À retenir, en une ou deux phrases."
    },
    {
      "chapter": "2 · Le lien",
      "messages": [["Nom", "Message qui accompagne le lien"]],
      "attachment": {
        "label": "Nom du lien",
        "url": "nom.example-site.com",
        "cta": "Texte du bouton",
        "pageUrl": "nom-login.net",
        "pageTitle": "Titre de la fausse page",
        "pageText": "Texte de la fausse page",
        "clue": "L'indice qui devait alerter."
      },
      "choices": [],
      "feedback": ""
    }
  ]
}
```

Un choix protecteur peut débloquer des cartes de la fiche « Mes 6 réflexes » avec le champ
facultatif `"reflexes"`, une liste de numéros : 0 vérifier les liens (débloqué automatiquement
par la chasse aux indices du lien piégé), 1 garder ses codes secrets, 2 protéger ses mots de
passe, 3 respecter le consentement, 4 conserver les preuves, 5 demander de l'aide.
Exemple : `"reflexes": [4, 5]`.

Valeurs possibles pour `portrait` : `kevin`, `rh`, `chantal`, `afi`, `maya`. Les messages
écrits par l'utilisatrice ont pour auteur `"moi"`.

---

## Règles pour ne jamais apprendre à piéger

Elles valent pour tout contenu : histoires, « Vrai ou piège ? », futurs modes de jeu.
`pnpm verifier:scenarios` contrôle ce qui peut l'être ; le reste se vérifie à la relecture.

1. **Montrer le signe, jamais la recette.** On montre le piège tel que la victime le voit
   (« il te presse », « il demande un code »). Jamais le côté de l'arnaqueur : fabriquer une
   fausse page, encaisser l'argent, cacher son identité, choisir une cible.
2. **Des messages courts et incomplets.** Une ou deux phrases, pas de scénario réutilisable.
3. **Chaque technique vient avec sa parade.** On ne nomme pas une manipulation sans le
   réflexe qui la bloque.
4. **L'arnaqueur ne gagne jamais.** Aucun point, rang ou badge ne récompense le fait de
   tromper. Personne ne joue l'arnaqueur.
5. **Des messages fiables aussi.** « Vrai ou piège ? » garde au moins 3 messages sûrs :
   on apprend à reconnaître, pas à se méfier de tout.

Les messages de « Vrai ou piège ? » sont dans `src/content/vrai-ou-piege.json`.
