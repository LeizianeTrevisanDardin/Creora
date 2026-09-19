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
      duration,
      style,
    } = await request.json();

    if (
      !creatorDescription?.trim() ||
      !videoPrompt?.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "Creator description and video idea are required.",
        },
        {
          status: 400,
        },
      );
    }

    const prompt = `
You are the creative director for Creora,
an AI social media content studio.

Create a short-form social media video plan.

CREATOR:
${creatorDescription}

VIDEO IDEA:
${videoPrompt}

PLATFORM:
${platform}

VIDEO LENGTH:
${duration} seconds

STYLE:
${style}

Requirements:

- Create a strong hook in the first seconds.
- Use natural creator language.
- Make the script fit the requested duration.
- Break the video into clear scenes.
- Scene timings must fit inside the total duration.
- Every scene must include a visualPrompt.

The visualPrompt should describe:
- creator action
- environment
- camera angle
- camera movement
- lighting
- facial expression
- visual style

For every scene, also choose a motion style.

The motion.camera value MUST be exactly one of:
- zoom-in
- zoom-out
- pan-left
- pan-right
- static

The motion.speed value MUST be exactly one of:
- slow
- medium
- fast

Motion guidance:

- Use zoom-in for emotional moments,
  hooks, product details, or emphasis.

- Use zoom-out for reveals,
  endings, or wider lifestyle moments.

- Use pan-left or pan-right
  when the scene should feel cinematic.

- Use static sparingly.

- Luxury and cinematic videos should
  generally use slower movement.

- UGC videos can use medium
  or faster movement.

- Avoid using the exact same camera
  motion for every scene unless it
  genuinely makes sense.

Also:

- Create a short social media caption.
- Create 4 to 7 relevant hashtags.
- Do not repeat hashtags.
- Keep everything suitable for ${platform}.
- Do not include markdown.
- Do not include explanations outside JSON.
- Return ONLY valid JSON.

Return exactly this structure:

{
  "title": "string",
  "hook": "string",
  "caption": "string",
  "hashtags": [
    "#example",
    "#example2"
  ],
  "scenes": [
    {
      "id": 1,
      "title": "Hook",
      "start": 0,
      "end": 2,
      "script": "spoken words",
      "visualPrompt": "detailed visual generation prompt",
      "motion": {
        "camera": "zoom-in",
        "speed": "slow"
      }
    }
  ]
}

Important:

- Scene IDs must start at 1
  and increase by 1.

- Scene start and end times
  must be numbers.

- The first scene must start at 0.

- The final scene must not end
  after ${duration} seconds.

- The combined scenes should cover
  approximately the full
  ${duration}-second video.

- motion.camera must use only
  the allowed values.

- motion.speed must use only
  the allowed values.
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
                0.7,
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
        "Ollama error:",
        errorText,
      );

      return NextResponse.json(
        {
          error:
            "Ollama could not generate content.",
        },
        {
          status: 500,
        },
      );
    }

    const ollamaData =
      await ollamaResponse.json();

    const generatedContent =
      JSON.parse(
        ollamaData.response,
      );

    return NextResponse.json(
      generatedContent,
    );
  } catch (error) {
    console.error(
      "Generate content error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Failed to generate content.",
      },
      {
        status: 500,
      },
    );
  }
}