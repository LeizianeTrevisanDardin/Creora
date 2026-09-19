"use client";

import {
  AbsoluteFill,
  Img,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import type {
  SceneMotion,
} from "@/app/page";

type SceneCompositionProps = {
  imageUrl: string;
  title: string;
  script: string;
  motion?: SceneMotion;
};

export default function SceneComposition({
  imageUrl,
  title,
  script,
  motion,
}: SceneCompositionProps) {
  const frame = useCurrentFrame();

  const {
    durationInFrames,
  } = useVideoConfig();

  const safeDuration =
    Math.max(
      1,
      durationInFrames - 1,
    );

  const camera =
    motion?.camera ??
    "zoom-in";

  const speed =
    motion?.speed ??
    "slow";

  const speedMultiplier =
    speed === "fast"
      ? 1.35
      : speed === "medium"
        ? 1
        : 0.7;

  const zoomAmount =
    0.05 *
    speedMultiplier;

  const panAmount =
    28 *
    speedMultiplier;

  let startScale = 1.02;
  let endScale = 1.02;

  let startX = 0;
  let endX = 0;

  const startY = 0;
  const endY = 0;

  if (
    camera === "zoom-in"
  ) {
    startScale = 1;
    endScale =
      1 + zoomAmount;
  }

  if (
    camera === "zoom-out"
  ) {
    startScale =
      1 + zoomAmount;

    endScale = 1;
  }

  if (
    camera === "pan-left"
  ) {
    startScale = 1.04;
    endScale = 1.04;

    startX =
      panAmount / 2;

    endX =
      -panAmount / 2;
  }

  if (
    camera === "pan-right"
  ) {
    startScale = 1.04;
    endScale = 1.04;

    startX =
      -panAmount / 2;

    endX =
      panAmount / 2;
  }

  if (
    camera === "static"
  ) {
    startScale = 1.02;
    endScale = 1.02;

    startX = 0;
    endX = 0;
  }

  const scale =
    interpolate(
      frame,
      [
        0,
        safeDuration,
      ],
      [
        startScale,
        endScale,
      ],
      {
        extrapolateLeft:
          "clamp",

        extrapolateRight:
          "clamp",
      },
    );

  const translateX =
    interpolate(
      frame,
      [
        0,
        safeDuration,
      ],
      [
        startX,
        endX,
      ],
      {
        extrapolateLeft:
          "clamp",

        extrapolateRight:
          "clamp",
      },
    );

  const translateY =
    interpolate(
      frame,
      [
        0,
        safeDuration,
      ],
      [
        startY,
        endY,
      ],
      {
        extrapolateLeft:
          "clamp",

        extrapolateRight:
          "clamp",
      },
    );

  const textOpacity =
    interpolate(
      frame,
      [
        0,
        10,
        20,
      ],
      [
        0,
        0,
        1,
      ],
      {
        extrapolateLeft:
          "clamp",

        extrapolateRight:
          "clamp",
      },
    );

  const textY =
    interpolate(
      frame,
      [
        10,
        24,
      ],
      [
        20,
        0,
      ],
      {
        extrapolateLeft:
          "clamp",

        extrapolateRight:
          "clamp",
      },
    );

  return (
    <AbsoluteFill
      style={{
        backgroundColor:
          "#111111",

        overflow:
          "hidden",
      }}
    >
      <Img
        src={imageUrl}
        style={{
          position:
            "absolute",

          width:
            "106%",

          height:
            "106%",

          left:
            "-3%",

          top:
            "-3%",

          objectFit:
            "cover",

          transform: `
            translateX(${translateX}px)
            translateY(${translateY}px)
            scale(${scale})
          `,

          transformOrigin:
            "center center",
        }}
      />

      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.03) 0%, rgba(0,0,0,0.02) 45%, rgba(0,0,0,0.72) 100%)",
        }}
      />

      <div
        style={{
          position:
            "absolute",

          left:
            56,

          right:
            56,

          bottom:
            135,

          color:
            "white",

          opacity:
            textOpacity,

          transform: `
            translateY(${textY}px)
          `,
        }}
      >
        <div
          style={{
            fontSize:
              54,

            fontWeight:
              800,

            lineHeight:
              1.02,

            marginBottom:
              18,

            letterSpacing:
              "-1px",

            textShadow:
              "0 4px 20px rgba(0,0,0,0.30)",
          }}
        >
          {title}
        </div>

        <div
          style={{
            fontSize:
              32,

            fontWeight:
              500,

            lineHeight:
              1.25,

            textShadow:
              "0 3px 16px rgba(0,0,0,0.35)",
          }}
        >
          {script}
        </div>
      </div>
    </AbsoluteFill>
  );
}