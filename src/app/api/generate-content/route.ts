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
      duration,
      style,
    } = body;

    if (
      !creatorDescription ||
      !videoPrompt
    ) {
      return NextResponse.json(
        {
          error:
            "Creator description and video prompt are required.",
        },
        {
          status: 400,
        },
      );
    }

    const prompt = `
You are an expert short-form social media video director.

Create a complete short-form video plan.

Creator:
${creatorDescription}

Video idea:
${videoPrompt}

Platform:
${platform}

Target duration:
${duration} seconds

Style:
${style}

Return ONLY valid JSON.

The JSON must have exactly this structure:

{
  "title": "Project title",
  "hook": "Strong opening hook",
  "caption": "Social media caption",
  "hashtags": ["#example"],
  "scenes": [
    {
      "id": 1,
      "title": "Scene title",
      "start": 0,
      "end": 2,
      "script": "Short spoken dialogue",
      "visualPrompt": "Detailed visual description",
      "motion": {
        "camera": "zoom-in",
        "speed": "slow"
      },
      "transition": {
        "type": "cut",
        "duration": 0.3
      }
    }
  ]
}

Rules:

- Total scene timing should approximately match ${duration} seconds.
- Scenes must be chronological.
- The first scene must be the hook.
- Create enough scenes to make the video visually interesting.
- Dialogue must be short and natural.
- Avoid repetitive dialogue.
- Avoid duplicate hashtags.

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

Transition guidance:

- Scene 1 should normally use "cut".
- Cinematic videos should favor fade and dissolve.
- UGC videos should favor cut and quick fade.
- Lifestyle videos may use fade, dissolve or slide.
- Product demos should favor cut, fade and slide.
- Do not use the same transition on every scene.
- Keep transitions subtle.
- Transition duration should normally be between 0.2 and 0.6 seconds.

Camera guidance:

- Strong hooks can use zoom-in.
- Product details can use zoom-in.
- Reveals can use zoom-out.
- Pan movements work well for lifestyle and cinematic scenes.
- Luxury and cinematic scenes should generally use slower movement.
- Avoid using exactly the same camera movement on every scene.

Visual prompts should describe the actual visual scene.

If the prompt mentions a creator or person using a product, include the person in relevant visual prompts.

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
                  0.7,
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
        "OLLAMA ERROR:",
        text,
      );

      return NextResponse.json(
        {
          error:
            "Ollama failed to generate content.",
        },
        {
          status: 500,
        },
      );
    }

    const ollamaData =
      await ollamaResponse.json();

    const parsed =
      JSON.parse(
        ollamaData.response,
      );

    return NextResponse.json(
      parsed,
    );
  } catch (error) {
    console.error(
      "GENERATE CONTENT ERROR:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof
          Error
            ? error.message
            : "Failed to generate content.",
      },
      {
        status: 500,
      },
    );
  }
}