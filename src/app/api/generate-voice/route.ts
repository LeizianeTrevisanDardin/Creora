import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  spawn,
} from "child_process";

import {
  existsSync,
  mkdirSync,
} from "fs";

import path from "path";

import crypto from "crypto";

export const runtime =
  "nodejs";

type VoicePreset =
  | "natural-female"
  | "natural-male"
  | "warm-creator";

type VoiceRequest = {
  text: string;
  voice?: VoicePreset;
};

type PythonResult = {
  success: boolean;
  output_path: string;
  sample_rate: number;
  duration: number;

  word_timings?: {
    word: string;
    start: number;
    end: number;
  }[];
};

// =================================
// VOICE MAP
// =================================

const VOICE_MAP:
  Record<
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
// GET PYTHON PATH
// =================================

function getPythonPath() {
  const projectRoot =
    process.cwd();

  const pythonPath =
    process.platform ===
    "win32"
      ? path.join(
          projectRoot,
          ".venv",
          "Scripts",
          "python.exe",
        )
      : path.join(
          projectRoot,
          ".venv",
          "bin",
          "python",
        );

  return pythonPath;
}

// =================================
// POST
// =================================

export async function POST(
  request: NextRequest,
) {
  try {
    const body =
      (await request.json()) as
        VoiceRequest;

    const text =
      body.text?.trim();

    const voicePreset =
      body.voice ??
      "natural-female";

    // =================================
    // VALIDATION
    // =================================

    if (!text) {
      return NextResponse.json(
        {
          error:
            "Text is required.",
        },
        {
          status: 400,
        },
      );
    }

    // =================================
    // PROJECT PATHS
    // =================================

    const projectRoot =
      process.cwd();

    const pythonPath =
      getPythonPath();

    const scriptPath =
      path.join(
        projectRoot,
        "scripts",
        "generate_voice.py",
      );

    // =================================
    // CHECK PYTHON
    // =================================

    if (
      !existsSync(
        pythonPath,
      )
    ) {
      return NextResponse.json(
        {
          error:
            `Python virtual environment was not found at: ${pythonPath}`,
        },
        {
          status: 500,
        },
      );
    }

    // =================================
    // CHECK SCRIPT
    // =================================

    if (
      !existsSync(
        scriptPath,
      )
    ) {
      return NextResponse.json(
        {
          error:
            `Voice generation script was not found at: ${scriptPath}`,
        },
        {
          status: 500,
        },
      );
    }

    // =================================
    // OUTPUT DIRECTORY
    // =================================

    const outputDirectory =
      path.join(
        projectRoot,
        "public",
        "generated",
        "voiceovers",
      );

    if (
      !existsSync(
        outputDirectory,
      )
    ) {
      mkdirSync(
        outputDirectory,
        {
          recursive: true,
        },
      );
    }

    // =================================
    // FILE NAME
    // =================================

    const fileName =
      `voice-${Date.now()}-${crypto
        .randomUUID()
        .slice(
          0,
          8,
        )}.wav`;

    const outputPath =
      path.join(
        outputDirectory,
        fileName,
      );

    // =================================
    // KOKORO VOICE
    // =================================

    const kokoroVoice =
      VOICE_MAP[
        voicePreset
      ] ??
      VOICE_MAP[
        "natural-female"
      ];

    // =================================
    // RUN PYTHON
    // =================================

    const result =
      await new Promise<PythonResult>(
        (
          resolve,
          reject,
        ) => {
          const python =
            spawn(
              pythonPath,
              [
                scriptPath,
              ],
              {
                cwd:
                  projectRoot,

                stdio: [
                  "pipe",
                  "pipe",
                  "pipe",
                ],

                windowsHide:
                  true,
              },
            );

          let stdout =
            "";

          let stderr =
            "";

          python.stdout.on(
            "data",
            (
              data:
                Buffer,
            ) => {
              stdout +=
                data.toString();
            },
          );

          python.stderr.on(
            "data",
            (
              data:
                Buffer,
            ) => {
              stderr +=
                data.toString();
            },
          );

          python.on(
            "error",
            (error) => {
              reject(
                error,
              );
            },
          );

          python.on(
            "close",
            (code) => {
              if (
                code !== 0
              ) {
                reject(
                  new Error(
                    stderr ||
                      `Python exited with code ${code}.`,
                  ),
                );

                return;
              }

              try {
                /*
                 * Kokoro / Python packages may print
                 * extra information before the final JSON.
                 *
                 * The final non-empty line is our result.
                 */

                const lines =
                  stdout
                    .trim()
                    .split(
                      "\n",
                    )
                    .map(
                      (
                        line,
                      ) =>
                        line.trim(),
                    )
                    .filter(
                      Boolean,
                    );

                const jsonLine =
                  lines[
                    lines.length -
                      1
                  ];

                if (
                  !jsonLine
                ) {
                  throw new Error(
                    "Python returned no result.",
                  );
                }

                const parsed =
                  JSON.parse(
                    jsonLine,
                  ) as
                    PythonResult;

                resolve(
                  parsed,
                );
              } catch (
                error
              ) {
                reject(
                  new Error(
                    `Could not read Python response.\n\n${stdout}\n\n${stderr}\n\n${String(
                      error,
                    )}`,
                  ),
                );
              }
            },
          );

          // =================================
          // SEND DATA TO PYTHON
          // =================================

          python.stdin.write(
            JSON.stringify({
              text,

              voice:
                kokoroVoice,

              output_path:
                outputPath,
            }),
          );

          python.stdin.end();
        },
      );

    // =================================
    // RESPONSE
    // =================================

    return NextResponse.json(
      {
        success: true,

        audioUrl:
          `/generated/voiceovers/${fileName}`,

        audioDuration:
          result.duration,

        wordTimings:
          result.word_timings ??
          [],
      },
    );
  } catch (error) {
    console.error(
      "Generate voice error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof
          Error
            ? error.message
            : "Could not generate voice.",
      },
      {
        status: 500,
      },
    );
  }
}