"""Prépare une langue locale : textes traduits et voix de synthèse.

Pour chaque texte des histoires (messages, réponses, conséquences, conseils,
« à retenir ») et pour quelques consignes, le script :
  1. traduit le français avec Google Traduction ;
  2. fait lire la traduction par un modèle de voix libre MMS (Meta) ;
  3. écrit src/content/langues/<langue>.json et src/content/audio/<langue>/.

La traduction et la voix sont automatiques : elles doivent être relues et
écoutées par une personne qui parle la langue avant tout usage réel.
Les modèles MMS sont sous licence CC BY-NC 4.0 (usage non commercial).

Préparation (une fois) :
    pip install torch transformers scipy
Usage (ffmpeg doit être installé) :
    python scripts/langue-locale.py fon facebook/mms-tts-fon
    python scripts/langue-locale.py yo  facebook/mms-tts-yor
Le second argument peut aussi être le dossier d'un modèle déjà téléchargé.
Option : --cache <fichier.json> réutilise des traductions déjà faites.
"""

import argparse
import json
import re
import subprocess
import tempfile
import time
import unicodedata
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "src" / "content"

# Consignes dites à voix haute, pour jouer sans avoir à lire.
UI = {
    "ui.choisis": "Écoute les réponses, puis touche celle que tu choisis.",
    "ui.r1": "Première réponse.",
    "ui.r2": "Deuxième réponse.",
    "ui.r3": "Troisième réponse.",
    "ui.retenir": "À retenir.",
    "ui.lien": "Un lien vient d'arriver. Tu peux l'ouvrir, ou vérifier le message.",
    "ui.bienvenue": "Bienvenue. Écoute l'histoire. Pour répondre, touche le grand numéro de ta réponse.",
    "ui.continuer": "Pour continuer, touche le grand bouton en bas de l'écran.",
    "ui.piege": "Attention, cette page te demande ton mot de passe. C'est un piège : ne tape jamais ton mot de passe sur une page reçue par un lien.",
}


def story_texts() -> dict[str, str]:
    """Tous les textes à traduire, par clé (voir src/App.tsx)."""
    items = dict(UI)
    for file in sorted((ROOT / "scenarios").glob("*.json")):
        scenario = json.loads(file.read_text(encoding="utf-8"))
        sid = scenario["id"]
        for s, step in enumerate(scenario["steps"], 1):
            for m, (who, text) in enumerate(step["messages"], 1):
                if who != "moi":
                    items[f"{sid}.m{s}-{m}"] = re.sub(r"^Image masquée · ", "", text)
            if step.get("attachment"):
                items[f"{sid}.cta{s}"] = step["attachment"]["cta"]
            for c, choice in enumerate(step.get("choices", []), 1):
                items[f"{sid}.c{s}-{c}"] = choice["label"]
                items[f"{sid}.o{s}-{c}"] = choice["outcome"]
                items[f"{sid}.a{s}-{c}"] = choice["advice"]
            if step.get("feedback"):
                items[f"{sid}.f{s}"] = step["feedback"]
    return items


def translate(text: str, lang: str) -> str:
    query = urllib.parse.urlencode({"client": "gtx", "sl": "fr", "tl": lang, "dt": "t", "q": text})
    for attempt in range(3):
        try:
            url = "https://translate.googleapis.com/translate_a/single?" + query
            with urllib.request.urlopen(url, timeout=20) as response:
                data = json.loads(response.read().decode("utf-8"))
            return "".join(part[0] for part in data[0] if part and part[0]).strip()
        except Exception:
            time.sleep(2 + attempt * 3)
    raise RuntimeError(f"traduction impossible : {text[:60]}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("langue", help="code de la langue (fon, yo…)")
    parser.add_argument("modele", help="modèle MMS : nom (facebook/mms-tts-fon) ou dossier")
    parser.add_argument("--cache", help="fichier JSON de traductions déjà faites (français → langue)")
    args = parser.parse_args()

    import scipy.io.wavfile
    import torch
    from transformers import AutoTokenizer, VitsModel

    items = story_texts()
    cache_path = Path(args.cache) if args.cache else None
    cache = json.loads(cache_path.read_text(encoding="utf-8")) if cache_path and cache_path.exists() else {}
    texts = {}
    for key, french in items.items():
        if not cache.get(french):
            cache[french] = translate(french, args.langue)
            if cache_path:
                cache_path.write_text(json.dumps(cache, ensure_ascii=False, indent=1), encoding="utf-8")
            time.sleep(0.4)
        texts[key] = cache[french]

    out = ROOT / "langues" / f"{args.langue}.json"
    out.parent.mkdir(exist_ok=True)
    out.write_text(
        json.dumps(
            {
                "avertissement": "Traduction automatique (Google Traduction) et voix de synthèse "
                "(modèle MMS, CC BY-NC 4.0). Ni le texte ni la prononciation n'ont été relus "
                "par une personne qui parle cette langue.",
                "textes": texts,
            },
            ensure_ascii=False,
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )
    print(f"{len(texts)} textes → {out.relative_to(ROOT.parent.parent)}")

    tokenizer = AutoTokenizer.from_pretrained(args.modele)
    model = VitsModel.from_pretrained(args.modele)
    torch.manual_seed(7)
    audio_root = ROOT / "audio" / args.langue
    for old in audio_root.glob("*/*.mp3"):
        old.unlink()
    for key, text in texts.items():
        folder, name = key.split(".", 1)
        target = audio_root / folder / f"{name}.mp3"
        target.parent.mkdir(parents=True, exist_ok=True)
        spoken = unicodedata.normalize("NFC", text.lower())
        inputs = tokenizer(spoken, return_tensors="pt")
        if inputs["input_ids"].shape[1] == 0:
            print(f"  ignoré (aucun caractère lisible) : {key}")
            continue
        with torch.no_grad():
            wave = model(**inputs).waveform[0].numpy()
        with tempfile.NamedTemporaryFile(suffix=".wav") as tmp:
            scipy.io.wavfile.write(tmp.name, model.config.sampling_rate, wave)
            subprocess.run(
                ["ffmpeg", "-loglevel", "error", "-y", "-i", tmp.name,
                 "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-ac", "1", "-ar", "16000",
                 "-b:a", "32k", str(target)],
                check=True,
            )
    count = len(list(audio_root.glob("*/*.mp3")))
    print(f"{count} fichiers audio → {audio_root.relative_to(ROOT.parent.parent)}")


if __name__ == "__main__":
    main()
