"""Génère la voix française des messages des histoires avec Piper (voix neuronales).

Chaque message de l'interlocuteur devient un fichier
src/content/audio/fr/<scénario>/<situation>-<message>.mp3, que l'application
joue à la place de la voix de synthèse du téléphone.

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
MALE = {"Kevin"}
VOICES = {"male": "fr_FR-tom-medium", "female": "fr_FR-siwis-medium"}


def spoken(text: str) -> str:
    """Écrit le message comme il doit être prononcé."""
    text = re.sub(r"^Image masquée · ", "", text)
    text = re.sub(r"(\d)[  ](\d{3})", r"\1\2", text)  # 15 000 -> 15000
    text = re.sub(r"(\d) ?F\b", r"\1 francs", text)
    text = re.sub(r"(\d) ?h\b", r"\1 heures", text)
    return text.replace("«", "").replace("»", "").replace("…", ".").strip()


def main() -> None:
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    voices_dir = Path(sys.argv[1])
    wanted = sys.argv[2:]
    voices = {kind: PiperVoice.load(voices_dir / f"{name}.onnx") for kind, name in VOICES.items()}

    for file in sorted((ROOT / "scenarios").glob("*.json")):
        scenario = json.loads(file.read_text(encoding="utf-8"))
        if wanted and scenario["id"] not in wanted:
            continue
        out_dir = ROOT / "audio" / "fr" / scenario["id"]
        out_dir.mkdir(parents=True, exist_ok=True)
        for old in out_dir.glob("*.mp3"):
            old.unlink()
        for s, step in enumerate(scenario["steps"], 1):
            for m, (who, text) in enumerate(step["messages"], 1):
                if who == "moi":
                    continue
                kind = "male" if who.split(" · ")[0] in MALE else "female"
                target = out_dir / f"{s}-{m}.mp3"
                with tempfile.NamedTemporaryFile(suffix=".wav") as tmp:
                    with wave.open(tmp.name, "wb") as wav:
                        voices[kind].synthesize_wav(spoken(text), wav)
                    subprocess.run(
                        ["ffmpeg", "-loglevel", "error", "-y", "-i", tmp.name,
                         "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-ac", "1", "-ar", "24000",
                         "-b:a", "48k", str(target)],
                        check=True,
                    )
                print(f"{scenario['id']}/{target.name}  [{kind}]  {spoken(text)}")


if __name__ == "__main__":
    main()
