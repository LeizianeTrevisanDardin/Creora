from kokoro import KPipeline
import soundfile as sf
import numpy as np

pipeline = KPipeline(
    lang_code="a"
)

text = """
This is Creora.

Your video is ready,
and this is your first local AI voiceover.
"""

generator = pipeline(
    text,
    voice="af_heart",
)

audio_parts = []

for _, _, audio in generator:
    audio_parts.append(audio)

if not audio_parts:
    raise RuntimeError(
        "No audio was generated."
    )

final_audio = np.concatenate(
    audio_parts
)

sf.write(
    "creora-test.wav",
    final_audio,
    24000,
)

print(
    "Voice generated: creora-test.wav"
)