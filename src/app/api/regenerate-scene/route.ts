import {
  NextResponse,
} from "next/server";

export async function POST(
  request: Request,
) {
  try {
    const {
      creatorDescription,
      videoPrompt,
      platform,
      style,
      scene,
    } =
      await request.json();

    if (!scene) {
      return NextResponse.json(
        {
          error:
            "Scene is required.",
        },
        {
          status: 400,
        },
      );
    }

    const prompt = `
You are the creative director for Creora,
an AI social media content studio.

Regenerate ONLY the selected scene below.

Do not regenerate the full video.

CREATOR:
${creatorDescription}

ORIGINAL VIDEO IDEA:
${videoPrompt}

PLATFORM:
${platform}

STYLE:
${style}

CURRENT SCENE:

Title:
${scene.title}

Start:
${scene.start}

End:
${scene.end}

Current script:
${scene.script}

Current visual prompt:
${scene.visualPrompt}

Current camera motion:
${scene.motion?.camera ?? "zoom-in"}

Current motion speed:
${scene.motion?.speed ?? "slow"}

Create a better version of this scene.

Requirements:

- Keep the same scene id.
- Keep the same start time.
- Keep the same end time.
- Keep the spoken script short enough
  to fit the scene duration.
- Make the scene feel natural
  for the creator.
- Keep it suitable for ${platform}.
- Match the requested ${style} style.

Create a detailed visualPrompt.

The visualPrompt should describe:
- creator action
- environment
- camera angle
- camera movement
- lighting
- facial expression
- visual style

Choose a camera motion.

motion.camera MUST be exactly one of:
- zoom-in
- zoom-out
- pan-left
- pan-right
- static

motion.speed MUST be exactly one of:
- slow
- medium
- fast

Motion guidance:

- Cinematic and luxury scenes usually
  work best with slow movement.

- Hooks may use zoom-in.

- Product close-ups may use
  zoom-in or pan movement.

- Reveal moments may use zoom-out.

- Avoid static unless it genuinely
  fits the scene.

Return ONLY valid JSON.

Return exactly this structure:

{
  "id": ${scene.id},
  "title": "string",
  "start": ${scene.start},
  "end": ${scene.end},
  "script": "spoken words",
  "visualPrompt": "detailed visual generation prompt",
  "motion": {
    "camera": "zoom-in",
    "speed": "slow"
  }
}
`;

    const ollamaResponse =
      await fetch(
        "http://localhost:11434/api/generate",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            model:
              "qwen2.5:3b",

            prompt,

            stream:
              false,

            format:
              "json",

            options: {
              temperature:
                0.85,
            },
          }),
        },
      );

    if (
      !ollamaResponse.ok
    ) {
      const errorText =
        await ollamaResponse.text();

      console.error(
        "Ollama scene error:",
        errorText,
      );

      return NextResponse.json(
        {
          error:
            "Ollama could not regenerate the scene.",
        },
        {
          status: 500,
        },
      );
    }

    const ollamaData =
      await ollamaResponse.json();

    const regeneratedScene =
      JSON.parse(
        ollamaData.response,
      );

    return NextResponse.json(
      regeneratedScene,
    );
  } catch (error) {
    console.error(
      "Regenerate scene error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Failed to regenerate scene.",
      },
      {
        status: 500,
      },
    );
  }
}