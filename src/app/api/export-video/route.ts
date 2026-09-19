import {
  bundle,
} from "@remotion/bundler";

import {
  renderMedia,
  selectComposition,
} from "@remotion/renderer";

import {
  NextResponse,
} from "next/server";

import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
} from "node:fs";

import {
  tmpdir,
} from "node:os";

import {
  join,
} from "node:path";

import type {
  Scene,
} from "@/app/page";

export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

type ExportRequest = {
  imageUrl: string;
  scenes: Scene[];
};

export async function POST(
  request: Request,
) {
  let outputLocation:
    string | null = null;

  try {
    // =================================
    // READ REQUEST
    // =================================

    const body =
      (await request.json()) as ExportRequest;

    const {
      imageUrl,
      scenes,
    } = body;

    if (!imageUrl) {
      return NextResponse.json(
        {
          error:
            "An image is required before exporting.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      !Array.isArray(
        scenes,
      ) ||
      scenes.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "At least one scene is required before exporting.",
        },
        {
          status: 400,
        },
      );
    }

    // =================================
    // INPUT PROPS
    // =================================

    const inputProps = {
      imageUrl,
      scenes,
      fps: 30,
    };

    // =================================
    // REMOTION ENTRY
    // =================================

    const entryPoint =
      join(
        process.cwd(),
        "src",
        "remotion",
        "index.ts",
      );

    // =================================
    // BUNDLE REMOTION
    // =================================

    console.log(
      "Bundling Remotion...",
    );

    const serveUrl =
      await bundle({
        entryPoint,

        onProgress:
          (progress) => {
            console.log(
              `Bundle: ${Math.round(
                progress * 100,
              )}%`,
            );
          },
      });

    // =================================
    // SELECT COMPOSITION
    // =================================

    console.log(
      "Selecting composition...",
    );

    const composition =
      await selectComposition({
        serveUrl,

        id:
          "CreoraFullVideo",

        inputProps,
      });

    // =================================
    // CREATE TEMP OUTPUT
    // =================================

    const exportFolder =
      join(
        tmpdir(),
        "creora-exports",
      );

    if (
      !existsSync(
        exportFolder,
      )
    ) {
      mkdirSync(
        exportFolder,
        {
          recursive: true,
        },
      );
    }

    const fileName =
      `creora-${Date.now()}.mp4`;

    outputLocation =
      join(
        exportFolder,
        fileName,
      );

    // =================================
    // RENDER MP4
    // =================================

    console.log(
      "Rendering MP4...",
    );

    await renderMedia({
      composition,

      serveUrl,

      codec:
        "h264",

      outputLocation,

      inputProps,

      onProgress:
        ({
          progress,
        }) => {
          console.log(
            `Render: ${Math.round(
              progress * 100,
            )}%`,
          );
        },
    });

    // =================================
    // READ VIDEO
    // =================================

    const videoBuffer =
      readFileSync(
        outputLocation,
      );

    // =================================
    // DELETE TEMP FILE
    // =================================

    rmSync(
      outputLocation,
      {
        force: true,
      },
    );

    outputLocation =
      null;

    // =================================
    // RETURN MP4
    // =================================

    return new Response(
      videoBuffer,
      {
        status: 200,

        headers: {
          "Content-Type":
            "video/mp4",

          "Content-Disposition":
            `attachment; filename="${fileName}"`,

          "Content-Length":
            String(
              videoBuffer.length,
            ),
        },
      },
    );
  } catch (error) {
    console.error(
      "EXPORT VIDEO ERROR:",
      error,
    );

    if (
      outputLocation
    ) {
      try {
        rmSync(
          outputLocation,
          {
            force: true,
          },
        );
      } catch {
        // Ignore cleanup error
      }
    }

    return NextResponse.json(
      {
        error:
          error instanceof
          Error
            ? error.message
            : "Could not export video.",
      },
      {
        status: 500,
      },
    );
  }
}