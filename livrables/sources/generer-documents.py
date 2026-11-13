"""Sources éditables des trois livrables. Les constats proviennent du test du site déployé."""
from pathlib import Path
import html
import json

ROOT=Path(__file__).resolve().parent.parent
SRC=ROOT/'sources'
R=json.loads((ROOT/'preuves/resultats-tests.json').read_text())
URL=R['url']
E=html.escape
DATE='13 novembre 2026'
TEAM='Idvaresse · Aichath · Shanya · Christelle · Imane'
LINK=f'<a href="{URL}">{URL}</a>'
PASSED=R['summary']['passed'];TOTAL=R['summary']['total']
def get(tid):return next(t for t in R['tests'] if t['id']==tid)
def shot(name,caption='',cls='phone'):
    return f'<figure class="{cls}"><img src="../preuves/{name}.png"><figcaption>{caption}</figcaption></figure>'
def table(headers,rows,widths=None):
    return '<table><thead><tr>'+''.join('<th>'+x+'</th>' for x in headers)+'</tr></thead><tbody>'+''.join('<tr>'+''.join('<td>'+str(x)+'</td>' for x in row)+'</tr>' for row in rows)+'</tbody></table>'
def cards(items):return '<div class="cards">'+''.join(f'<div class="card"><strong>{a}</strong><span>{b}</span></div>' for a,b in items)+'</div>'
def callout(text,kind='note'):return f'<div class="{kind}">{text}</div>'
def bullet(items):return '<ul>'+''.join('<li>'+i+'</li>' for i in items)+'</ul>'
def page(title,content,kicker='FICHE TECHNIQUE ET DE RISQUES'):
    return {'title':title,'content':content,'kicker':kicker}
CSS='''
@font-face{font-family:Noto;src:url(file:///usr/share/fonts/truetype/noto/NotoSans-Regular.ttf)}
@font-face{font-family:Noto;src:url(file:///usr/share/fonts/truetype/noto/NotoSans-Bold.ttf);font-weight:700 900}
*{box-sizing:border-box}html,body{margin:0;padding:0;font-family:Noto,sans-serif;color:#30394e;background:white;-webkit-print-color-adjust:exact;print-color-adjust:exact}a{color:#285e70;text-decoration:none}p{margin:0 0 12px;line-height:1.55}h1,h2,h3{margin:0 0 12px;line-height:1.14}h1{font-size:31px;letter-spacing:-1px}h2{font-size:20px;margin-top:22px}h3{font-size:15px;margin-top:16px}ul,ol{margin:8px 0 14px;padding-left:20px}li{line-height:1.5;margin-bottom:7px}strong{font-weight:700}.page{width:210mm;height:297mm;padding:15mm 16mm 11mm;display:grid;grid-template-rows:32px 1fr 25px;gap:17px;break-after:page;position:relative;background:#fffdf8;font-size:13px}.page:last-child{break-after:auto}.running{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #dce0dd;padding-bottom:10px;font-size:10px;letter-spacing:.06em;color:#657582}.brand{font-size:15px;font-weight:800;color:#38475f}.brand:before{content:'///';color:#c9684a;margin-right:9px}.body{min-height:0}.kicker{font-size:10px;letter-spacing:.10em;font-weight:800;color:#a65b41;margin:3px 0 12px}.deck{font-size:18px;line-height:1.4;color:#5c7280}.small{font-size:11px;line-height:1.5;color:#62707d}.tiny{font-size:10px;line-height:1.4}.footer{display:flex;justify-content:space-between;align-items:end;border-top:1px solid #dce0dd;padding-top:7px;font-size:9px;color:#71808b}.cards{display:flex;gap:10px;margin:18px 0}.card{flex:1;background:#e6ece6;border-radius:14px;padding:16px 13px}.card strong{display:block;font-size:26px;line-height:1.15;color:#3b4460}.card span{display:block;font-size:11px;margin-top:7px;line-height:1.4}.note,.warning,.good{padding:14px 17px;border-radius:12px;line-height:1.5;margin:15px 0;background:#e9eeea;border-left:4px solid #648575}.warning{background:#fff0de;border-color:#c97d42}.good{background:#e4ede5}.linkbar{background:#3b4460;color:white;padding:16px;border-radius:13px;margin:18px 0;word-break:break-word}.linkbar a{color:#ffce98;font-size:13px}table{width:100%;border-collapse:collapse;margin:13px 0;font-size:11.3px;line-height:1.45}th{text-align:left;background:#3b4460;color:white;padding:10px 11px;font-size:10.5px}td{padding:10px 11px;vertical-align:top;border-bottom:1px solid #d8dfda}tr:nth-child(even) td{background:#f3f2ea}td:first-child{font-weight:700}figure{margin:0}.phone{width:180px;flex:none}.phone img{width:100%;height:380px;object-fit:cover;object-position:top;border:7px solid #3b4460;border-radius:22px;background:#3b4460}.phone.short img{height:300px}.phone.smallphone{width:150px}.phone.smallphone img{height:320px}.screenwide img{width:100%;max-height:300px;object-fit:contain;border-radius:12px;background:#eee9e1}.screenwide{margin:15px 0}.phone figcaption,.screenwide figcaption{font-size:10px;line-height:1.35;color:#647583;margin-top:7px} .cols{display:flex;gap:23px;align-items:flex-start;margin:18px 0}.cols>div{flex:1;min-width:0}.quote{font-size:22px;line-height:1.4;background:#3b4460;color:#fff5e7;padding:23px;border-radius:18px;margin:18px 0}.pipeline{display:flex;gap:8px;align-items:center;margin:15px 0}.pipeline span{flex:1;padding:15px 10px;border-radius:12px;text-align:center;background:#e9e1d4;font-size:11px;line-height:1.5}.pipeline b{color:#bd7256}.label{display:inline-block;border-radius:16px;padding:4px 9px;background:#e4ede5;color:#37624e;font-size:10px;font-weight:800}.muted{color:#667784}.two-col{display:grid;grid-template-columns:1fr 1fr;gap:16px}.two-col>div{background:#f1ede4;border-radius:14px;padding:16px}.two-col h3{margin-top:0}.divider{height:1px;background:#dce0dd;margin:18px 0}.risk td{font-size:10.5px}.status{color:#32634f;font-weight:800;white-space:nowrap}.testtable td{padding:8px 9px;font-size:10.5px}.sources{font-size:10.5px;line-height:1.55}.sources li{margin-bottom:9px}.hero-title{font-size:56px;margin:8px 0 18px}.spacer{height:10px}
@page{size:A4;margin:0}
'''
def write_doc(filename,pages,title):
    markup=[]
    for i,p in enumerate(pages,1):markup.append(f'<article class="page"><header class="running"><span class="brand">AYIDOTE</span><span>HACK4HER 2026 · {DATE.upper()}</span></header><section class="body"><div class="kicker">{p["kicker"]}</div><h1>{p["title"]}</h1>{p["content"]}</section><footer class="footer"><span>Équipe Ayidote · Epitech Bénin · Prototype pédagogique</span><span>{i:02} / {len(pages):02}</span></footer></article>')
    (SRC/(filename+'.html')).write_text('<!doctype html><html lang="fr"><meta charset="utf-8"><title>'+title+'</title><style>'+CSS+'</style><body>'+''.join(markup)+'</body></html>')

tech=[]
tech.append(page('Apprendre les bons réflexes numériques.',f'''
<p class="deck">Ayidote · fiche technique et analyse des risques</p>
<p>Un outil pédagogique pour reconnaître les pièges numériques, explorer des situations fictives et apprendre comment réagir sans rester seule.</p>
{cards([('Défi 4','Hygiène numérique'),('6','Histoires accessibles'),('Sans compte','Progression locale')])}
<div class="linkbar"><b>Prototype public et démontrable</b><br>{LINK}</div>
<h2>Le besoin auquel nous répondons</h2>
<p>Les messages trompeurs, le chantage, le contrôle des comptes ou le partage sans consentement peuvent être difficiles à reconnaître. Ayidote propose de s’entraîner avant d’être confrontée à une situation réelle.</p>
<h2>Le public et le relais envisagé</h2>
<p><b>Public principal défini dans la fiche de cadrage :</b> jeunes femmes de 15 à 30 ans. Le jeu peut aussi soutenir des séances animées en groupe, sur un seul appareil.</p>
<p><b>Structure publique utilisatrice envisagée :</b> Institut National de la Femme, avec des relais possibles dans les Centres de Promotion Sociale et les établissements scolaires ou universitaires. Il s’agit d’une <b>proposition à valider</b>, sans partenariat confirmé dans ce dossier.</p>
{callout('<b>Résultat recherché, non encore mesuré :</b> mieux repérer les signes d’un piège et connaître les gestes de protection et de soutien. Aucun gain d’apprentissage ni réduction des violences n’est revendiqué comme démontré.')}
<p class="small"><b>Équipe :</b> {TEAM}.<br>Établissement indiqué dans le cadrage : Epitech Bénin. Document établi à partir du site déployé testé le {DATE} et du dépôt de travail fourni.</p>
'''))
features=[
('Vrai ou piège ?','Discussion, vote, indices et score collectif ; parties de 5 ou 8 messages.','T04–T05 : deux parties complètes.'),
('Le grand quiz','Configuration de 2 à 4 équipes, 6 ou 10 questions ; classement et podium.','T07 : 2 équipes et 6 questions terminées.'),
('Histoires interactives','6 histoires de 5 situations ; conséquences des choix et conseils.','H1–H6 : les 30 situations parcourues.'),
('Fausse page de connexion','Chasse aux 3 indices ; faux champs sous forme de boutons.','H1–H6 : aucune saisie possible dans ces pages.'),
('Quiz individuel','5 questions avec correction et bilan.','T06 : une erreur volontaire ; résultat 4/5.'),
('Mot du jour et réflexes','Essais, révélation du mot et fiche de 6 réflexes à débloquer.','T08–T09 : fiche complète et mot révélé.'),
('Écoute et langues','Mode écoute ; choix français, fon et yoruba.','T18 : lecture audio française démarrée ; T19 : choix locaux présents.'),
('Orientation et réglages','Aide, ressources, engagements, guide d’installation et effacement.','T10, T13, T17 : pages et confirmation accessibles.')]
tech.append(page('Une fonction principale, des parcours complémentaires.',table(['Fonction disponible','Comportement observé','Vérification'],features)+f'''
<h2>La fonction minimale à montrer au jury</h2><p><b>Une partie de « Vrai ou piège ? » jouée jusqu’au bilan.</b> Elle rend visible l’utilité du prototype : lire un message, discuter, choisir, comprendre les indices puis retenir un réflexe.</p>
{callout('<b>Fonction complémentaire distincte :</b> l’alerte discrète est une simulation avec contacts et position fictifs. T11 a parcouru le carnet puis le résultat simulé. Aucun message, appel ou secours réel n’a été déclenché.')}
<p class="small">Les configurations 4 équipes / 10 questions sont visibles dans le produit ; elles n’ont pas été parcourues jusqu’au podium. La présence de la fonction ne vaut pas validation complète de toutes ses configurations.</p>
'''))
tech.append(page('Architecture, données et fonctionnement hors ligne.',f'''
<p>Le dépôt fourni utilise <b>React 19, TypeScript, Vite 8 et Tailwind CSS 4</b>. La version testée est servie en HTTPS sur GitHub Pages. Aucun backend applicatif ni appel d’analyse en ligne n’a été observé pendant les parcours enregistrés.</p>
<div class="pipeline"><span><b>GitHub Pages</b><br>Fichiers statiques</span><b>→</b><span><b>Navigateur</b><br>Jeux, règles et contenus</span><b>→</b><span><b>Stockage local</b><br>Progression / préférences</span></div>
{table(['Élément','Données ou comportement'],[
('Contenus','Scénarios, questions et conseils dans des fichiers JSON ; aucun récit personnel demandé dans les parcours testés.'),
('localStorage','Personnage, préférences, avancement, histoires terminées, réflexes, statistiques du jeu collectif et réglages fictifs de la simulation.'),
('Cache applicatif','Service worker actif sous le chemin /Hack4her2026/ ; cache identifié ayidote-v3. Ressources déjà chargées conservées pour une visite ultérieure.'),
('Audio','Fichiers audio statiques ; le mode écoute peut lancer un préchargement de nombreux fichiers. Volume de données et coût réseau non mesurés.'),
('Hébergement','Le navigateur échange des requêtes techniques avec l’hébergeur. L’absence de formulaire personnel ne signifie pas anonymat absolu ni absence de journaux d’hébergement.')])}
<h2>Ce qui a été vérifié hors ligne</h2>
<p>T14 : après une visite en ligne et activation du service worker, le réseau du profil de test a été désactivé. L’accueil a été rechargé, puis une question du quiz a été ouverte et corrigée avec succès.</p>
{callout('<b>Portée exacte :</b> le parcours de base déjà mis en cache fonctionne dans le navigateur testé. Un premier accès sans réseau, l’ensemble des audios hors ligne et l’installation réelle sur Android ou iPhone n’ont pas été validés.','warning')}
<h2>Effacement</h2><p>T17 confirme l’annulation, puis la suppression des données locales. Le cache applicatif reste présent. Le code efface tout le <i>localStorage</i> de l’origine, y compris une clé témoin de test extérieure aux clés Ayidote : une suppression limitée aux clés de l’application est recommandée.</p>
'''))
tech.append(page('Des tests exécutés sur la version publique.',f'''
<p class="deck">{PASSED} vérifications réussies sur {TOTAL} cas d’usage automatisés.</p>
{cards([('30','Situations d’histoire parcourues'),('5 + 8','Messages en jeu collectif'),('6/6','Réflexes débloqués')])}
<p><b>Environnement :</b> Chrome/Chromium {E(R['environment']['browser'])}, profil vierge, affichage principal 390 × 844 px, densité 2. Contrôles de largeur complémentaires : 320, 768 et 1440 px. Réduction des animations activée dans le profil d’automatisation.</p>
{table(['Vérification','Résultat et preuve'],[
('Parcours complets','T04–T05 : bilans des deux longueurs de « Vrai ou piège ? ». T07 : classement et podium du grand quiz.'),
('Apprentissage','H1–H6 : 6 histoires finies, chasse aux indices sans champs de saisie. T06 : correction d’une erreur volontaire et résultat 4/5.'),
('Continuité','T12 : personnage Maya, 6 histoires terminées et 6 réflexes conservés après rechargement.'),
('Hors ligne','T14 : accueil rechargé et première question du quiz corrigée après désactivation réseau.'),
('Accessibilité ponctuelle','T15 : pas de débordement horizontal sur l’onglet Jouer aux 4 largeurs. T16 : bouton atteint au clavier et indicateur de focus présent.'),
('Audio et simulation','T18 : événement de lecture audio française reçu. T11 : résultat de l’alerte clairement simulé, sans envoi réel.')])}
{callout('<b>Ce que ces résultats ne prouvent pas :</b> audit de sécurité complet, conformité WCAG, compréhension des conseils, qualité des traductions, pertinence des références juridiques, résistance aux abus ou efficacité auprès du public cible. Aucun test utilisateur réel n’a été effectué pour ce dossier.','warning')}
<p class="small">Traçabilité : <code>preuves/resultats-tests.json</code> et script <code>sources/tester-site.cjs</code>. Le dossier de démonstration détaille chaque cas. Le bilan décrit une campagne datée, pas une garantie permanente de fonctionnement.</p>
'''))
tech.append(page('Safety by Design : preuves et limites.',f'''
{table(['Pilier','Mesures constatées','Limites et suite nécessaire'],[
('Confidentialité','Sans création de compte ; scénarios fictifs ; pas de saisie de mot de passe dans la simulation ; progression locale.','Stockage non chiffré au niveau applicatif ; appareil partagé, historique et hébergement à considérer. Ne pas promettre l’anonymat absolu.'),
('Sécurité par défaut','Alerte étiquetée simulation ; aucun envoi réel ; confirmation avant effacement ; audio activé sur choix de la personne.','Compte à rebours activé par défaut, même s’il est désactivable. Vérifier son effet émotionnel et l’accès facile à une pause.'),
('Accessibilité','Langage pédagogique, boutons, mode écoute ; choix français/fon/yoruba ; adaptation de largeur et focus contrôlés.','Pas de validation avec personnes peu lectrices, lectrices d’écran ou appareils d’entrée de gamme. Traductions automatiques à faire relire.'),
('Recours et contrôle humain','Pages Aide et ressources ; conseils de soutien ; engagements et informations légales accessibles.','Aucun professionnel n’intervient dans la session du jeu. Une relecture humaine avant publication des contenus reste nécessaire.')])}
<h2>Un cadre de démonstration strict</h2>
{bullet(['Utiliser uniquement des personnages, messages et positions fictifs. Ne recueillir ni plainte, ni témoignage personnel, ni contenu intime réel.',
'Conserver les liens d’appel et d’orientation hors du scénario de test : aucun appel à un service réel n’a été passé.',
'Présenter le carnet comme une simulation pédagogique ; ne pas le présenter comme un dispositif d’urgence opérationnel.',
'Permettre de quitter une histoire ou de désactiver le compte à rebours. Ne demander à personne de raconter une expérience personnelle.'])}
<p class="small">Référentiel : Module 2, pages 5–6 et 8 ; note explicative MASS, page 2. Les observations ci-dessus portent sur l’interface et les comportements testés, complétés par l’examen du code local fourni.</p>
'''))
risks=[
('P1 · Contenus','Conseil incomplet, simplification ou promesse trop certaine.','5 histoires du dépôt portent source « ia » et relu:false ; elles restent accessibles.','Relecture experte, statut éditorial fiable, blocage des contenus non approuvés avant diffusion accompagnée.'),
('P1 · Langues','Une traduction peut modifier un conseil de protection.','Le produit indique des traductions et voix automatiques à l’essai.','Relecture par locutrices, validation orale et tests de compréhension ; conserver un avertissement explicite.'),
('P1 · Orientation','Coordonnées ou références devenues inexactes ; fausse assurance de prise en charge.','Liens et numéros visibles ; leur exactitude et disponibilité n’ont pas été contrôlées ici.','Confirmation auprès des structures, date de contrôle, responsable de mise à jour ; aucun partenariat supposé.'),
('P1 · Simulation','Confondre un exercice et une alerte effectivement envoyée.','Le résultat précise qu’aucun message n’est parti.','Maintenir le marquage, les contacts fictifs et l’absence d’intégration réelle. Tout passage réel exige un projet séparé validé.'),
('P2 · Traces locales','Progression visible sur un appareil partagé ; effacement trop large.','Persistance locale et effacement de toutes les clés de l’origine observés.','Limiter les clés effacées, expliquer les traces restantes, étudier un usage sans persistance.'),
('P2 · Accès et équité','Débit faible, audio volumineux, chronomètre ou difficulté de lecture.','Hors ligne de base testé ; audio et langues seulement vérifiés techniquement.','Mesurer le volume audio, tester de vrais appareils, proposer téléchargement explicite et rythme libre.'),
('P2 · Biais / impact','Les conseils ou le score peuvent être mal compris selon les profils.','Aucun panel ni mesure d’apprentissage dans cette campagne.','Pilote accompagné et diversifié, retours qualitatifs et tests avant/après ; adapter les contenus.')]
tech.append(page('Risques résiduels et mesures à prioriser.',table(['Priorité / risque','Effet possible','État observé','Mesure proposée'],risks)+f'''
<p class="small"><b>P1 :</b> à traiter avant une diffusion publique accompagnée à grande échelle. <b>P2 :</b> à intégrer avant extension du pilote. Priorisation qualitative proposée pour la revue d’équipe ; elle ne remplace pas une expertise technique, juridique ou psychosociale.</p>
{callout('<b>Décision de présentation :</b> prototype démontrable pour le hackathon. Le dossier ne vaut ni validation institutionnelle, ni certification de sécurité, ni autorisation de déploiement pour des situations réelles.','warning')}
'''))
storyRows=[]
for f in sorted(Path('Prototype PWA de sécurité numérique/src/content/scenarios').glob('*.json')):
 s=json.loads(f.read_text());storyRows.append((s['title'],s['profile'],'Équipe · relu:true' if s['relu'] else 'IA · relu:false'))
tech.append(page('Conditions de suite et références.',f'''
<h2>Avant un pilote accompagné</h2>
{bullet(['<b>Équipe + personne experte :</b> relire chaque histoire et conseil ; rendre le statut de validation cohérent avec la mise à disposition.',
'<b>Locutrices fon et yoruba :</b> relire les textes et écouter les voix ; vérifier la compréhension et l’acceptabilité des formulations.',
'<b>Institution pressentie :</b> confirmer le besoin, les publics, les liens d’aide, les responsabilités éditoriales et le rôle des animatrices.',
'<b>Équipe technique :</b> compléter les tests sur téléphones réels, réseau lent, installation et audios hors ligne ; revue des traces et de la mise à jour des caches.',
'<b>Équipe pilote :</b> mesurer la capacité à reconnaître les signes et expliquer un geste de protection, sans collecter de récit personnel. Aucun résultat d’impact n’est disponible à ce stade.'])}
<h2>État éditorial du dépôt fourni</h2>{table(['Histoire','Profil indiqué','Métadonnée de relecture'],storyRows)}
<p class="small">Ces métadonnées proviennent du dépôt local fourni. Les six titres et parcours ont aussi été retrouvés dans le site public. Un statut « relu:false » signale une validation non tracée comme terminée ; il ne permet pas, à lui seul, de savoir si une relecture informelle a eu lieu.</p>
<h2>Sources du dossier</h2>
<ol class="sources"><li>Site public Ayidote : {LINK}. Campagne du {DATE} ; captures et résultats conservés dans le dossier <i>preuves</i>.</li><li><i>HACK4HER_2026_Module2_Concevoir_outil_utile_et_sur.pdf</i>, p. 5–9 : règles, tests, livrables et pondérations.</li><li><i>HACK4HER_2026_Planning_activites_participantes.pdf</i>, p. 1–2 : cadrage, gel à 12 h 15 et 15 minutes par équipe, échanges compris.</li><li><i>Note_Hackathon_Universites_MASS.pdf</i>, p. 1–2 : prototype testé, structure publique utilisatrice et fiche de solution. Fiche de cadrage Ayidote et code local : contexte d’équipe et architecture.</li></ol>
'''))
write_doc('01-Fiche-technique-et-risques-Ayidote',tech,'Ayidote — fiche technique et risques')

# Dossier de démonstration et procès-verbal des essais.
demo=[]
demo.append(page('Démontrer Ayidote, en conditions maîtrisées.',f'''
<p class="deck">Accès au prototype, scénario de passage et résultats des tests.</p>
<div class="linkbar"><b>Ouvrir le prototype</b><br>{LINK}</div>
{cards([(str(PASSED)+'/'+str(TOTAL),'Cas d’usage réussis'),('6','Histoires terminées'),('HTTPS','Site déployé testé')])}
<h2>Préparer la démonstration</h2>
{bullet(['Ouvrir le lien dans un navigateur et charger le parcours avant le passage. Prévoir un téléphone et, si possible, un écran projeté.',
'Utiliser une session de démonstration sans données personnelles ; choisir Afi ou Maya et le français pour le parcours principal.',
'Désactiver le compte à rebours dans les paramètres si l’animatrice souhaite un rythme libre. Préparer la fiche de réflexes déjà débloqués dans un second onglet ou appareil si nécessaire.',
'Prévenir que les situations sont fictives. Ne pas demander d’expérience personnelle et ne pas activer les liens d’appel.'])}
{callout('<b>Répartition proposée des 15 minutes :</b> 4 min de pitch, 6 min de démonstration, 5 min d’échanges. Le planning officiel inclut démonstration et questions dans les 15 minutes ; les horaires peuvent être ajustés par l’organisation.')}
<p class="small"><b>Version observée :</b> {E(R['build']['scripts'][0].split('/')[-1])}. Dernière modification HTML indiquée par le serveur : {E(R['build']['htmlLastModified'])}. Horodatage des essais : {E(R['date'])}, fuseau Africa/Porto-Novo.</p>
''','DOSSIER DE DÉMONSTRATION'))
demo.append(page('Un parcours de démonstration en six minutes.',f'''
{table(['Temps indicatif','Action à l’écran','Ce qu’il faut expliquer'],[
('0:00–0:30','Ouvrir Ayidote, choisir le personnage et accéder à Jouer.','Pas de compte ; les personnages et situations servent à s’entraîner.'),
('0:30–3:00','Vrai ou piège ? → Préparer une partie → 5 messages. Lire brièvement, discuter, voter, montrer les indices et finir le bilan.','La même équipe apprend à repérer les signes ; le score accompagne la discussion.'),
('3:00–4:30','Ouvrir Histoires interactives → La rencontre en ligne. Faire un choix, puis examiner le lien fictif et toucher les 3 indices.','Les choix sont expliqués. La fausse page ne permet aucune saisie d’identifiants.'),
('4:30–5:15','Montrer Réflexes et, si souhaité, le résultat préparé d’une histoire.','Les réflexes se débloquent par l’expérience ; ne pas confondre un score et une compétence démontrée en situation réelle.'),
('5:15–6:00','Sur une session préchargée, montrer le rechargement hors ligne et rappeler les limites.','Le cache de base a été testé. Langues, références d’aide et contenus restent à valider avant une diffusion plus large.')])}
<div class="cols">{shot('06-vote','Vote collectif dans le site déployé.','phone smallphone')}{shot('15-fausse-page','Exercice fictif : aucune saisie possible.','phone smallphone')}<div><h3>Solution de repli</h3><p>Si le réseau manque, utiliser une session déjà chargée et mise en cache. Le dossier contient les captures réelles, mais elles accompagnent la démonstration : elles ne remplacent pas l’outil fonctionnel exigé.</p><h3>À laisser hors du passage principal</h3><p>Pas d’appel réel, pas de récit personnel ni de collecte de preuve. L’alerte discrète est seulement une simulation complémentaire.</p></div></div>
''','DOSSIER DE DÉMONSTRATION'))
shortdetails={
'T01':'HTTP 200 ; écran d’accueil et ressources chargés.',
'T02':'Parcours français et personnage Maya ; accueil affiché.',
'T03':'Compte à rebours désactivé et valeur conservée.',
'T04':'5 messages, vote et explications ; bilan attendu 50 points.',
'T05':'8 messages, vote et explications ; bilan attendu 80 points.',
'T06':'Une erreur volontaire, correction, puis résultat 4/5.',
'T07':'2 équipes, 6 questions, résultats, classement et podium.',
'T08':'6 réflexes débloqués et accès aux bons gestes.',
'T09':'3 propositions fictives, révélation et leçon du jour.',
'T10':'Pages et liens relevés ; aucun appel réel déclenché.',
'T11':'Carnet puis résultat fictif ; aucun envoi applicatif réel.',
'T12':'Maya, 6 histoires terminées et 6 réflexes après rechargement.',
'T13':'Manifeste standalone et guide ; installation réelle non testée.',
'T14':'Réseau coupé : rechargement de l’accueil et correction du quiz.',
'T15':'Onglet Jouer : pas de débordement à 320/390/768/1440 px.',
'T16':'Un bouton atteint au clavier, focus affiché ; contrôle ponctuel.',
'T17':'Annuler puis confirmer ; stockage local vide, cache conservé.',
'T18':'Mode écoute français activé ; fichier de bienvenue en lecture.',
'T19':'Choix Fon/Yoruba et avertissement de traduction automatique.'}
for t in R['tests']:
 if t['id'].startswith('H'):shortdetails[t['id']]='5 situations terminées ; faux formulaire sans saisie ; résultat atteint.'
for part,items in enumerate([R['tests'][:13],R['tests'][13:]],1):
 rows=[(t['id'],E(t['name']),'<span class="status">'+E(t['status'])+'</span>',shortdetails[t['id']]) for t in items]
 demo.append(page(f'Procès-verbal des tests · {part}/2',f'''
<p class="small">Tests réellement exécutés le {DATE} sur {LINK}. Navigateur : Chromium {E(R['environment']['browser'])}. Données fictives, contextes isolés ; aucun compte utilisateur réel modifié.</p>
<div class="testtable">{table(['Réf.','Cas vérifié','Résultat','Constat'],rows)}</div>
{callout('<b>Interprétation :</b> « Réussi » signifie que les assertions de ce cas ont été satisfaites lors du passage enregistré. Ce statut ne vaut ni validation clinique ou juridique des conseils, ni mesure d’apprentissage, ni audit exhaustif de sécurité.')}
<p class="small">Les réponses attendues ont été rapprochées des contenus du dépôt fourni pour les questions et messages affichés. Les erreurs de ciblage du script lors de sa préparation ont été corrigées avant la campagne finale ; le tableau présente la campagne finale complète.</p>
''','DOSSIER DE DÉMONSTRATION'))
demo.append(page('Preuves visuelles et périmètre de validation.',f'''
<div class="cols">{shot('08-bilan-collectif','Bilan d’une partie complète de 5 messages.','phone smallphone')}{shot('27-hors-ligne','Quiz corrigé après coupure du réseau.','phone smallphone')}{shot('30-mode-ecoute','Mode écoute français : démarrage audio technique vérifié.','phone smallphone')}</div>
<h2>Réseau et données pendant les essais</h2>
<p>Dans les requêtes enregistrées du contexte principal, seules des requêtes GET vers <b>shanya28.github.io</b> ont été observées. Aucune erreur JavaScript n’a été enregistrée dans ce contexte. Le résultat ne constitue pas une preuve d’absence absolue de collecte ni un audit de l’hébergeur.</p>
<h2>Vérifications à compléter</h2>
{bullet(['Tests avec le public cible, personnes peu lectrices et personnes utilisant des technologies d’assistance.',
'Installation sur un Android et un iPhone réels ; comportement de l’audio hors ligne, téléchargement incomplet, réseau lent et mise à jour du cache.',
'Relecture des cinq histoires non marquées relues et des traductions locales, puis validation des conseils et références d’aide par les interlocuteurs compétents.',
'Revue de sécurité, de confidentialité et du périmètre d’effacement ; validation institutionnelle avant tout usage réel.'])}
<p class="small">Fichiers de preuve : captures du site dans <i>preuves/</i>, rapport <i>resultats-tests.json</i>, script <i>tester-site.cjs</i>. Aucun téléphone réel, utilisatrice réelle, appel, SMS ou transmission de plainte n’a été utilisé pour ces tests.</p>
''','DOSSIER DE DÉMONSTRATION'))
write_doc('03-Demonstration-et-tests-Ayidote',demo,'Ayidote — démonstration et tests')

# Support de pitch, format paysage 16:9.
SLIDECSS=CSS+'''
@page{size:1280px 720px;margin:0}.slide{width:1280px;height:720px;padding:38px 56px 26px;display:grid;grid-template-rows:38px 1fr 37px;gap:19px;break-after:page;background:#fff7e8}.slide:nth-child(3n+2){background:#e6ede8}.slide:last-child{break-after:auto}.slide .running{font-size:12px}.slide .brand{font-size:20px}.slide .body{position:relative}.slide .kicker{font-size:13px;margin:0 0 15px}.slide h1{font-size:51px;line-height:1.10;letter-spacing:-1.8px;margin-bottom:20px;max-width:1050px}.slide h2{font-size:29px}.slide p{font-size:23px;line-height:1.45}.slide li{font-size:22px;line-height:1.4;margin-bottom:14px}.slide .deck{font-size:29px}.slide .small{font-size:16px;line-height:1.4}.slide .tiny{font-size:13px}.slide .footer{font-size:11px;align-items:center}.slide .cards{gap:18px}.slide .card{padding:24px 22px}.slide .card strong{font-size:44px}.slide .card span{font-size:18px}.slide .quote{font-size:29px}.slide .note,.slide .warning{font-size:18px;padding:16px 19px}.slide .phone{width:195px}.slide .phone img{height:390px}.slide .phone figcaption{font-size:13px}.slide .cols{gap:32px;align-items:center;margin:10px 0}.slide .cols>div{flex:1}.slide .two-col{gap:23px}.slide .two-col>div{padding:22px}.slide .two-col h3{font-size:25px}.slide .two-col p{font-size:21px}.slide .linkbar{margin-top:24px}.slide .linkbar a{font-size:24px}.slide table{font-size:19px}.slide td{padding:14px}.slide th{font-size:17px}.slide .hero-title{font-size:82px;max-width:800px}.slide .mini{font-size:17px}.steps{display:flex;gap:20px;margin:28px 0}.steps>div{flex:1;background:#3b4460;color:#fff4e6;padding:24px;border-radius:20px}.steps b{display:block;color:#ffc58c;font-size:39px}.steps span{font-size:24px;display:block;margin-top:12px}.pill{display:inline-block;padding:9px 15px;border-radius:22px;background:#e7cba4;font-size:16px;font-weight:700}.slide .screenwide img{height:270px}.hero-layout{display:flex;align-items:center;gap:70px}.hero-layout>div{flex:1}.hero-layout .phone{width:220px;margin-right:75px}.hero-layout .phone img{height:450px}
'''
slides=[]
def slide(title,content,kicker,oral):slides.append(dict(title=title,content=content,kicker=kicker,oral=oral))
slide('Reconnaître les pièges.<br>Entraîner ses réflexes.',f'<div class="hero-layout"><div><p class="deck">Ayidote</p><p>Des histoires et des jeux pour apprendre à se protéger, ensemble et à son rythme.</p><span class="pill">Défi 4 · Hygiène numérique</span><p class="small" style="margin-top:23px">Équipe Ayidote · Epitech Bénin<br>{TEAM}</p></div>{shot("01-accueil","Écran réel du prototype.")}</div>','HACK4HER 2026','Présenter l’équipe et l’objectif pédagogique, sans promettre une protection garantie.')
slide('Un message peut cacher une pression.',f'<div class="steps"><div><b>01</b><span>« Envoie-moi ton code. »</span></div><div><b>02</b><span>« Paie aujourd’hui. »</span></div><div><b>03</b><span>« Partage cette image. »</span></div></div><p>Le besoin : reconnaître les signes, prendre du recul et savoir vers qui se tourner.</p>{callout("Notre approche : s’entraîner sur des situations fictives, sans demander de récit personnel.")}','LE PROBLÈME','Lire les trois situations. Insister sur la pression et le consentement, sans culpabiliser la personne visée.')
slide('Pensé pour une personne.<br>Utile à tout un groupe.',f'<div class="two-col"><div><h3>Seule</h3><p>Jeunes femmes de 15 à 30 ans : histoires, choix, explications et réflexes.</p></div><div><h3>En séance animée</h3><p>Un seul téléphone ou écran : discussion, vote et apprentissage collectif.</p></div></div><h2>Un relais public à construire</h2><p>Institut National de la Femme, Centres de Promotion Sociale et établissements : des interlocuteurs envisagés pour valider et accompagner l’usage.</p><p class="small">Proposition de relais ; aucun partenariat institutionnel confirmé dans ce dossier.</p>','LE PUBLIC ET L’USAGE','Nommer le public et expliquer le rôle d’une institution utilisatrice. Présenter les relais comme une proposition.')
slide('Lire. Discuter. Voter. Comprendre.',f'<div class="cols"><div><h2>Vrai ou piège ?</h2><p>Le groupe examine un message, vote, puis découvre les indices et le réflexe à retenir.</p>{cards([("5 ou 8","Messages par partie"),("Ensemble","Une même équipe")])}<p class="small">Les deux longueurs ont été jouées jusqu’au bilan pendant les tests.</p></div>{shot("06-vote","Le vote collectif.")}{shot("07-indices","Les signes expliqués.")}</div>','LA FONCTION PRINCIPALE','Faire la transition vers la démonstration. Montrer une réponse et expliquer les signes, sans réduire l’apprentissage au score.')
slide('Vivre une histoire.<br>Comprendre ses choix.',f'<div class="cols">{shot("14-histoire","Conversation fictive.")}{shot("15-fausse-page","Chasse aux indices.")}<div><p><b>6 histoires de 5 situations</b> : rencontres, recrutement, comptes, contrôle, faux profil et harcèlement.</p><p>Chaque choix débouche sur une explication ; les réflexes se débloquent au fil du parcours.</p><p class="small">La fausse page ne permet aucune saisie de mot de passe. Cinq histoires ne sont pas encore marquées relues dans le dépôt.</p></div></div>','L’APPRENTISSAGE PAR L’EXPÉRIENCE','Montrer le passage du message à la fausse page, puis les indices. Être explicite sur les contenus encore à valider.')
slide('Une équipe, plusieurs façons de jouer.',f'<div class="cols"><div><h2>Le grand quiz</h2><p>Des réponses par équipe, une correction, un classement et un podium.</p><p>Le quiz individuel permet aussi de s’entraîner avec cinq questions expliquées.</p>{callout("Test réalisé : 2 équipes, 6 questions et podium. Les configurations jusqu’à 4 équipes et 10 questions restent à compléter dans les essais.")}</div>{shot("12-quiz-equipes-correction","Correction du grand quiz.")}{shot("13-podium-equipes","Podium réel obtenu.")}</div>','L’ANIMATION COLLECTIVE','Souligner le rôle de l’animatrice et les explications. Ne pas prétendre que toutes les configurations ont été validées.')
slide('Accéder à l’expérience,<br>même quand lire est difficile.',f'<div class="cols">{shot("30-mode-ecoute","Mode écoute français.")}<div><p><b>Mode écoute :</b> le démarrage de la voix française a été vérifié.</p><p><b>Français, fon, yoruba :</b> choix disponibles ; les traductions locales sont automatiques et à l’essai.</p><p><b>Hors ligne :</b> accueil rechargé et quiz corrigé après un premier chargement en ligne.</p><p class="small">Compréhension, prononciation, installation réelle et audios hors ligne restent à tester avec le public et sur de vrais téléphones.</p></div></div>','L’ACCESSIBILITÉ À VALIDER AVEC LES PERSONNES','Distinguer disponibilité technique et validation d’usage. Ne pas présenter les langues locales comme déjà approuvées.')
slide('Un prototype qui a été utilisé et testé.',f'{cards([(str(PASSED)+" / "+str(TOTAL),"Cas d’usage automatisés réussis"),("30","Situations parcourues"),("6 / 6","Réflexes débloqués")])}<div class="two-col"><div><h3>Fonctionnement observé</h3><p>Deux parties collectives complètes, un podium, six histoires, progression conservée et effacement confirmé.</p></div><div><h3>Portée des résultats</h3><p>Tests dans Chrome, affichages simulés et données fictives. Aucun test utilisateur réel ni audit de sécurité exhaustif.</p></div></div><p class="small">Campagne du {DATE}. Rapport détaillé et preuves dans le dossier de démonstration.</p>','LES PREUVES','Donner les résultats datés. Préciser que le test technique n’est pas une mesure d’impact ou une certification.')
slide('La sécurité se démontre<br>aussi par les limites annoncées.',f'<div class="two-col"><div><h3>Ce que le prototype fait</h3><p>Entraîner, expliquer, orienter ; utiliser des scénarios fictifs ; conserver la progression localement.</p></div><div><h3>Ce qui reste à valider</h3><p>Relecture des contenus et langues, références d’aide, usages sur appareils réels, traces et effacement.</p></div></div>{callout("L’alerte discrète est une simulation. Elle n’envoie aucun SMS, aucun appel et ne déclenche aucun secours.","warning")}<p class="small">L’existence d’une page Aide ne confirme ni un partenariat ni une disponibilité de prise en charge.</p>','SAFETY BY DESIGN','Présenter les risques comme des éléments de conception à traiter. Ne faire aucune démonstration avec des contacts ou plaintes réels.')
slide('Passer du prototype<br>à un pilote accompagné.',f'<div class="steps"><div><b>1</b><span>Valider les contenus et les langues.</span></div><div><b>2</b><span>Tester les usages et les appareils.</span></div><div><b>3</b><span>Construire le relais institutionnel.</span></div></div><p><b>À mesurer ensuite :</b> reconnaître les signes, expliquer le réflexe et retrouver une ressource pertinente.</p><p class="small">Aucun résultat d’impact n’est annoncé aujourd’hui. La prochaine étape est un pilote limité, accompagné et évalué.</p>','LA SUITE PROPOSÉE','Formuler une demande concrète : relecture experte, interlocuteur public et terrain de test accompagné.')
slide('À vous de jouer.',f'<p class="deck">Ayidote · apprendre à reconnaître les pièges, sans les vivre pour de vrai.</p><div class="linkbar"><b>Ouvrir la démonstration</b><br>{LINK}</div><div class="cols"><div><h2>Le dossier remis</h2><p>Prototype déployé<br>Fiche technique et de risques<br>Support de pitch<br>Démonstration et rapport de tests</p></div>{shot("18-fiche-reflexes","Fiche de réflexes issue d’un parcours terminé.")}</div>','DÉMONSTRATION ET QUESTIONS','Passer au prototype en fonctionnement, puis aux questions. Conserver 15 minutes au total avec les échanges.')
SLIDECSS+='\n.slide .phone{width:170px}.slide .phone img{height:340px}.hero-layout .phone{width:175px;margin-right:35px}.hero-layout .phone img{height:350px}\n'
slides[-1]['content']=f'<p class="deck">Ayidote · apprendre à reconnaître les pièges, sans les vivre pour de vrai.</p><div class="linkbar"><b>Ouvrir la démonstration</b><br>{LINK}</div><div class="two-col"><div><h3>Le prototype</h3><p>Un outil déployé et testable, à parcourir devant le jury.</p></div><div><h3>Le dossier remis</h3><p>Fiche technique et de risques<br>Support de pitch<br>Démonstration et rapport de tests</p></div></div>'
markup=[]
for i,s in enumerate(slides,1):markup.append(f'<article class="slide"><header class="running"><span class="brand">AYIDOTE</span><span>HACK4HER 2026 · TECH FOR HER SAFETY</span></header><section class="body"><div class="kicker">{s["kicker"]}</div><h1>{s["title"]}</h1>{s["content"]}</section><footer class="footer"><span>Équipe Ayidote · Prototype pédagogique · {DATE}</span><span>{i:02} / {len(slides):02}</span></footer></article>')
(SRC/'02-Support-de-pitch-Ayidote.html').write_text('<!doctype html><html lang="fr"><meta charset="utf-8"><title>Ayidote — support de pitch</title><style>'+SLIDECSS+'</style><body>'+''.join(markup)+'</body></html>')
(SRC/'Notes-orales-du-pitch.md').write_text('# Ayidote — repères oraux\n\nTemps proposé : 4 minutes de pitch, 6 minutes de démonstration, 5 minutes d’échanges.\n\n'+'\n\n'.join(f'## {i+1}. '+s['title'].replace('<br>',' ')+'\n\n'+s['oral'] for i,s in enumerate(slides)))
print('Sources HTML créées : fiche technique 7 pages, support 11 diapositives, démonstration 5 pages.')
