import {
  spawn,
} from "node:child_process";

import {
  existsSync,
  mkdirSync,
} from "node:fs";

import {
  join,
} from "node:path";

import {
  NextResponse,
} from "next/server";

export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

type VoicePreset =
  | "natural-female"
  | "natural-male"
  | "warm-creator";

type RequestBody = {
  text?: string;
  voice?: VoicePreset;
};

type WordTiming = {
  word: string;
  start: number;
  end: number;
};

type PythonVoiceResult = {
  success: boolean;

  output_path: string;

  sample_rate: number;

  duration: number;

  word_timings:
    WordTiming[];
};

const VOICE_MAP: Record<
  VoicePreset,
  string
> = {
  "natural-female":
    "af_heart",

  "natural-male":
    "am_michael",

  "warm-creator":
    "af_bella",
};

// =================================
// RUN PYTHON
// =================================

function runPythonVoice({
  text,
  voice,
  outputPath,
}: {
  text: string;
  voice: string;
  outputPath: string;
}) {
  return new Promise<PythonVoiceResult>(
    (
      resolve,
      reject,
    ) => {
      const pythonPath =
        join(
          process.cwd(),
          ".venv",
          "bin",
          "python",
        );

      const scriptPath =
        join(
          process.cwd(),
          "scripts",
          "generate_voice.py",
        );

      if (
        !existsSync(
          pythonPath,
        )
      ) {
        reject(
          new Error(
            `Python virtual environment was not found at: ${pythonPath}`,
          ),
        );

        return;
      }

      if (
        !existsSync(
          scriptPath,
        )
      ) {
        reject(
          new Error(
            `Voice script was not found at: ${scriptPath}`,
          ),
        );

        return;
      }

      const childProcess =
        spawn(
          pythonPath,
          [
            scriptPath,
          ],
          {
            cwd:
              process.cwd(),
          },
        );

      let stdout =
        "";

      let stderr =
        "";

      childProcess.stdout.on(
        "data",
        (
          data: Buffer,
        ) => {
          stdout +=
            data.toString();
        },
      );

      childProcess.stderr.on(
        "data",
        (
          data: Buffer,
        ) => {
          stderr +=
            data.toString();
        },
      );

      childProcess.on(
        "error",
        (
          error: Error,
        ) => {
          reject(
            error,
          );
        },
      );

      childProcess.on(
        "close",
        (
          code:
            number | null,
        ) => {
          if (
            code !== 0
          ) {
            console.error(
              "PYTHON VOICE ERROR:",
              stderr,
            );

            reject(
              new Error(
                stderr ||
                  stdout ||
                  `Python exited with code ${code}`,
              ),
            );

            return;
          }

          try {
            const lines =
              stdout
                .trim()
                .split("\n")
                .filter(
                  Boolean,
                );

            const lastLine =
              lines[
                lines.length -
                  1
              ];

            if (!lastLine) {
              throw new Error(
                "Python did not return a result.",
              );
            }

            const result =
              JSON.parse(
                lastLine,
              ) as PythonVoiceResult;

            resolve(
              result,
            );
          } catch (error) {
            reject(
              new Error(
                error instanceof
                Error
                  ? error.message
                  : "Could not read Python voice result.",
              ),
            );
          }
        },
      );

      childProcess.stdin.write(
        JSON.stringify({
          text,
          voice,

          output_path:
            outputPath,
        }),
      );

      childProcess.stdin.end();
    },
  );
}

// =================================
// POST
// =================================

export async function POST(
  request: Request,
) {
  try {
    const body =
      (await request.json()) as RequestBody;

    const text =
      body.text?.trim();

    const voicePreset =
      body.voice ??
      "natural-female";

    if (!text) {
      return NextResponse.json(
        {
          error:
            "Text is required.",
        },
        {
          status:
            400,
        },
      );
    }

    const selectedVoice =
      VOICE_MAP[
        voicePreset
      ] ??
      VOICE_MAP[
        "natural-female"
      ];

    const publicFolder =
      join(
        process.cwd(),
        "public",
        "generated",
        "voiceovers",
      );

    if (
      !existsSync(
        publicFolder,
      )
    ) {
      mkdirSync(
        publicFolder,
        {
          recursive:
            true,
        },
      );
    }

    const fileName =
      `voice-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}.wav`;

    const outputPath =
      join(
        publicFolder,
        fileName,
      );

    const result =
      await runPythonVoice({
        text,

        voice:
          selectedVoice,

        outputPath,
      });

    return NextResponse.json({
      success:
        true,

      audioUrl:
        `/generated/voiceovers/${fileName}`,

      audioDuration:
        result.duration,

      wordTimings:
        result.word_timings,

      voice:
        voicePreset,
    });
  } catch (error) {
    console.error(
      "GENERATE VOICE ERROR:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof
          Error
            ? error.message
            : "Could not generate voiceover.",
      },
      {
        status:
          500,
      },
    );
  }
}