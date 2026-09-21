import json
import os
import re
import sys

import numpy as np
import soundfile as sf
from kokoro import KPipeline


SAMPLE_RATE = 24000


def is_visible_word(text):
    return bool(
        re.search(
            r"[A-Za-z0-9À-ÿ]",
            text,
        )
    )


def main():
    raw_input = sys.stdin.read()

    if not raw_input:
        raise RuntimeError(
            "No input received."
        )

    data = json.loads(
        raw_input
    )

    text = (
        data.get(
            "text",
            ""
        )
        .strip()
    )

    voice = data.get(
        "voice",
        "af_heart",
    )

    output_path = data.get(
        "output_path"
    )

    if not text:
        raise RuntimeError(
            "Text is required."
        )

    if not output_path:
        raise RuntimeError(
            "Output path is required."
        )

    output_directory = os.path.dirname(
        output_path
    )

    if output_directory:
        os.makedirs(
            output_directory,
            exist_ok=True,
        )

    lang_code = (
        "a"
        if voice.startswith(
            (
                "af_",
                "am_",
            )
        )
        else "b"
    )

    pipeline = KPipeline(
        lang_code=lang_code
    )

    results = pipeline(
        text,
        voice=voice,
    )

    audio_parts = []

    word_timings = []

    current_audio_time = 0.0

    for result in results:
        audio = result.audio

        if audio is None:
            continue

        audio_array = np.asarray(
            audio
        )

        # =================================
        # REAL KOKORO TOKEN TIMESTAMPS
        # =================================

        tokens = (
            result.tokens
            if result.tokens
            else []
        )

        for token in tokens:
            token_text = (
                getattr(
                    token,
                    "text",
                    "",
                )
                or ""
            ).strip()

            start_ts = getattr(
                token,
                "start_ts",
                None,
            )

            end_ts = getattr(
                token,
                "end_ts",
                None,
            )

            if (
                not token_text
                or start_ts is None
                or end_ts is None
                or not is_visible_word(
                    token_text
                )
            ):
                continue

            word_timings.append(
                {
                    "word":
                        token_text,

                    "start":
                        round(
                            current_audio_time
                            + float(
                                start_ts
                            ),
                            4,
                        ),

                    "end":
                        round(
                            current_audio_time
                            + float(
                                end_ts
                            ),
                            4,
                        ),
                }
            )

        audio_parts.append(
            audio_array
        )

        chunk_duration = (
            len(audio_array)
            / SAMPLE_RATE
        )

        current_audio_time += (
            chunk_duration
        )

    if not audio_parts:
        raise RuntimeError(
            "No audio was generated."
        )

    final_audio = np.concatenate(
        audio_parts
    )

    sf.write(
        output_path,
        final_audio,
        SAMPLE_RATE,
    )

    duration_seconds = (
        len(final_audio)
        / SAMPLE_RATE
    )

    response = {
        "success":
            True,

        "output_path":
            output_path,

        "sample_rate":
            SAMPLE_RATE,

        "duration":
            round(
                duration_seconds,
                4,
            ),

        "word_timings":
            word_timings,
    }

    print(
        json.dumps(
            response
        )
    )


if __name__ == "__main__":
    main()