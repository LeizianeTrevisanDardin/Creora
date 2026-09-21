import {
  bundle,
} from "@remotion/bundler";

import {
  renderMedia,
  selectComposition,
} from "@remotion/renderer";

import {
  readFile,
  unlink,
} from "fs/promises";

import {
  join,
} from "path";

import {
  NextResponse,
} from "next/server";

import type {
  BrandingPosition,
  CaptionStyle,
  MusicTrack,
  Scene,
} from "@/app/page";

export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

type ExportRequest = {
  imageUrl: string;
  scenes: Scene[];

  captionStyle?: CaptionStyle;
  captionSyncOffsetMs?: number;

  musicTrack?: MusicTrack;
  musicVolume?: number;
  autoDucking?: boolean;

  brandingEnabled?: boolean;
  brandLogo?: string | null;
  brandingPosition?: BrandingPosition;
  brandingSize?: number;
  brandingOpacity?: number;
};

export async function POST(
  request: Request,
) {
  let outputLocation:
    string | null =
    null;

  try {
    const body =
      (await request.json()) as ExportRequest;

    const {
      imageUrl,
      scenes,

      captionStyle =
        "dynamic",

      captionSyncOffsetMs =
        0,

      musicTrack =
        "none",

      musicVolume =
        25,

      autoDucking =
        true,

      brandingEnabled =
        false,

      brandLogo =
        null,

      brandingPosition =
        "top-right",

      brandingSize =
        16,

      brandingOpacity =
        85,
    } = body;

    if (!imageUrl) {
      return NextResponse.json(
        {
          error:
            "Image is required.",
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
      scenes.length ===
        0
    ) {
      return NextResponse.json(
        {
          error:
            "At least one scene is required.",
        },
        {
          status: 400,
        },
      );
    }

    const inputProps = {
      imageUrl,
      scenes,
      fps: 30,

      captionStyle,
      captionSyncOffsetMs,

      musicTrack,
      musicVolume,
      autoDucking,

      brandingEnabled,
      brandLogo,
      brandingPosition,
      brandingSize,
      brandingOpacity,
    };

    const entryPoint =
      join(
        process.cwd(),
        "src",
        "remotion",
        "index.ts",
      );

    const serveUrl =
      await bundle({
        entryPoint,
      });

    const composition =
      await selectComposition({
        serveUrl,

        id:
          "CreoraFullVideo",

        inputProps,
      });

    const fileName =
      `creora-${Date.now()}.mp4`;

    outputLocation =
      join(
        "/tmp",
        fileName,
      );

    await renderMedia({
      composition,

      serveUrl,

      codec:
        "h264",

      outputLocation,

      inputProps,
    });

    const videoBuffer =
      await readFile(
        outputLocation,
      );

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

          "Cache-Control":
            "no-store",
        },
      },
    );
  } catch (error) {
    console.error(
      "Video export error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not export video.",
      },
      {
        status: 500,
      },
    );
  } finally {
    if (
      outputLocation
    ) {
      try {
        await unlink(
          outputLocation,
        );
      } catch {
        //
      }
    }
  }
}