"""Génère les voix françaises avec Piper (voix neuronales).

- Chaque message d'un interlocuteur devient src/content/audio/fr/<scénario>/
  m<situation>-<message>.mp3, avec une voix d'homme ou de femme.
- Tout le reste (réponses, conséquences, conseils, « à retenir », consignes)
  est lu par la narratrice, pour le mode écoute : mêmes clés que
  scripts/langue-locale.py.

Préparation (une fois) :
    pip install piper-tts
    python -m piper.download_voices fr_FR-siwis-medium fr_FR-tom-medium
Usage (ffmpeg doit être installé) :
    python scripts/generer-voix.py <dossier des voix> [scénario ...]

À relancer quand le texte d'un message change. Les voix sont sous licence
libre (jeux de données SIWIS et Tom, voir rhasspy/piper-voices).
"""

import json
import re
import subprocess
import sys
import tempfile
import wave
from pathlib import Path

from piper import PiperVoice

ROOT = Path(__file__).resolve().parent.parent / "src" / "content"
# Voix d'homme pour ces interlocuteurs, voix de femme pour tous les autres.
MALE = {"Kevin", "Sèdjro", "Kader", "Ablo", "Inconnu", "Compte anonyme"}
VOICES = {"male": "fr_FR-tom-medium", "female": "fr_FR-siwis-medium"}


def spoken(text: str) -> str:
    """Écrit le message comme il doit être prononcé."""
    text = re.sub(r"^Image masquée · ", "", text)
    text = re.sub(r"(\d)[  ](\d{3})", r"\1\2", text)  # 15 000 -> 15000
    text = re.sub(r"(\d) ?F\b", r"\1 francs", text)
    text = re.sub(r"(\d) ?h\b", r"\1 heures", text)
    return text.replace("«", "").replace("»", "").replace("…", ".").strip()


def narration() -> dict[str, str]:
    """Textes lus par la narratrice (toutes les clés sauf les messages)."""
    import importlib.util

    spec = importlib.util.spec_from_file_location("langue_locale", Path(__file__).with_name("langue-locale.py"))
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return {k: v for k, v in module.story_texts().items() if ".m" not in k}


def encode(voice, text: str, target: Path) -> None:
    with tempfile.NamedTemporaryFile(suffix=".wav") as tmp:
        with wave.open(tmp.name, "wb") as wav:
            voice.synthesize_wav(spoken(text), wav)
        subprocess.run(
            ["ffmpeg", "-loglevel", "error", "-y", "-i", tmp.name,
             "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-ac", "1", "-ar", "22050",
             "-b:a", "32k", str(target)],
            check=True,
        )


def main() -> None:
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    voices_dir = Path(sys.argv[1])
    voices = {kind: PiperVoice.load(voices_dir / f"{name}.onnx") for kind, name in VOICES.items()}
    out_root = ROOT / "audio" / "fr"
    for old in out_root.glob("*/*.mp3"):
        old.unlink()
    for file in sorted((ROOT / "scenarios").glob("*.json")):
        scenario = json.loads(file.read_text(encoding="utf-8"))
        out_dir = out_root / scenario["id"]
        out_dir.mkdir(parents=True, exist_ok=True)
        for s, step in enumerate(scenario["steps"], 1):
            for m, (who, text) in enumerate(step["messages"], 1):
                if who == "moi":
                    continue
                kind = "male" if who.split(" · ")[0] in MALE else "female"
                encode(voices[kind], text, out_dir / f"m{s}-{m}.mp3")
    for key, text in narration().items():
        folder, name = key.split(".", 1)
        (out_root / folder).mkdir(parents=True, exist_ok=True)
        encode(voices["female"], text, out_root / folder / f"{name}.mp3")
    print(len(list(out_root.glob("*/*.mp3"))), "fichiers audio français")


if __name__ == "__main__":
    main()
