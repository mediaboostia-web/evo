"""Transcrit la voix off et écrit le temps de chaque mot (work/words.json).

Usage : python video/scripts/transcribe.py
Le texte du script sert d'amorce : le moteur reconnaît mieux « Évo » et « Grâce ».
"""
import json
import subprocess
import sys
from pathlib import Path

import numpy as np
from faster_whisper import WhisperModel

ROOT = Path(__file__).resolve().parents[1]
voice = ROOT / "voix" / "voix-off.mp3"
script = (ROOT / "01-voix-off-elevenlabs.txt").read_text(encoding="utf-8")
out = ROOT / "work" / "words.json"
out.parent.mkdir(parents=True, exist_ok=True)

model = WhisperModel(sys.argv[1] if len(sys.argv) > 1 else "base", device="cpu", compute_type="int8")
# Décodage par ffmpeg (mono, 16 kHz) : évite de dépendre de la version de PyAV installée.
pcm = subprocess.run(
    ["ffmpeg", "-v", "error", "-i", str(voice), "-ac", "1", "-ar", "16000", "-f", "f32le", "-"],
    check=True, capture_output=True,
).stdout
audio = np.frombuffer(pcm, dtype=np.float32)

segments, _ = model.transcribe(
    audio,
    language="fr",
    word_timestamps=True,
    initial_prompt=script[:800],
    vad_filter=False,
    condition_on_previous_text=False,
)
words = [
    {"w": w.word.strip(), "s": round(w.start, 3), "e": round(w.end, 3)}
    for seg in segments
    for w in seg.words
]
out.write_text(json.dumps(words, ensure_ascii=False, indent=0), encoding="utf-8")
print(len(words), "mots ->", out)
