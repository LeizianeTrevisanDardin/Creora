import {
  NextResponse,
} from "next/server";

export const runtime =
  "nodejs";

export async function POST(
  request: Request,
) {
  try {
    const body =
      await request.json();

    const {
      creatorDescription,
      videoPrompt,
      platform,
      style,
      scene,
    } = body;

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
You are an expert short-form social media video director.

Regenerate ONLY the following scene.

Creator:
${creatorDescription}

Overall video idea:
${videoPrompt}

Platform:
${platform}

Style:
${style}

Current scene:

${JSON.stringify(
  scene,
  null,
  2,
)}

Return ONLY valid JSON.

Use exactly this structure:

{
  "id": ${scene.id},
  "title": "Improved scene title",
  "start": ${scene.start},
  "end": ${scene.end},
  "script": "Improved short dialogue",
  "visualPrompt": "Detailed visual description",
  "motion": {
    "camera": "zoom-in",
    "speed": "slow"
  },
  "transition": {
    "type": "fade",
    "duration": 0.4
  }
}

IMPORTANT:

Keep these values unchanged:

id = ${scene.id}
start = ${scene.start}
end = ${scene.end}

Camera motion must use ONLY:

"zoom-in"
"zoom-out"
"pan-left"
"pan-right"
"static"

Motion speed must use ONLY:

"slow"
"medium"
"fast"

Transition type must use ONLY:

"cut"
"fade"
"dissolve"
"slide-left"
"slide-right"

Transition duration should normally be between 0.2 and 0.6 seconds.

Choose motion and transition that fit the scene and the overall video style.

Make the dialogue natural and concise.

Make the visual prompt specific enough to describe the person, product, environment, lighting and framing when relevant.

Return ONLY JSON.
`;

    const ollamaResponse =
      await fetch(
        "http://localhost:11434/api/generate",
        {
          method:
            "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify({
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
      const text =
        await ollamaResponse.text();

      console.error(
        "OLLAMA SCENE ERROR:",
        text,
      );

      return NextResponse.json(
        {
          error:
            "Ollama failed to regenerate the scene.",
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
      "REGENERATE SCENE ERROR:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof
          Error
            ? error.message
            : "Failed to regenerate scene.",
      },
      {
        status: 500,
      },
    );
  }
}