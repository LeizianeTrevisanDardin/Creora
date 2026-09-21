"use client";

import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import type {
  CaptionStyle,
  SceneMotion,
  WordTiming,
} from "@/app/page";

type SceneCompositionProps = {
  imageUrl: string;
  title: string;
  script: string;
  motion?: SceneMotion;
  captionStyle?: CaptionStyle;

  audioUrl?: string;

  audioDuration?: number;

  wordTimings?: WordTiming[];

  captionSyncOffsetMs?: number;
};

function resolveAudioUrl(
  audioUrl: string,
) {
  if (
    audioUrl.startsWith(
      "http://",
    ) ||
    audioUrl.startsWith(
      "https://",
    ) ||
    audioUrl.startsWith(
      "data:",
    )
  ) {
    return audioUrl;
  }

  return staticFile(
    audioUrl.replace(
      /^\/+/,
      "",
    ),
  );
}

export default function SceneComposition({
  imageUrl,
  title,
  script,
  motion,
  captionStyle = "dynamic",
  audioUrl,
  audioDuration,
  wordTimings,
  captionSyncOffsetMs = 0,
}: SceneCompositionProps) {
  const frame =
    useCurrentFrame();

  const {
    fps,
    durationInFrames,
  } =
    useVideoConfig();

  const camera =
    motion?.camera ??
    "zoom-in";

  const speed =
    motion?.speed ??
    "slow";

  const speedMultiplier =
    speed ===
    "fast"
      ? 1.35
      : speed ===
          "medium"
        ? 1
        : 0.7;

  const zoomAmount =
    0.05 *
    speedMultiplier;

  const panAmount =
    28 *
    speedMultiplier;

  let startScale =
    1;

  let endScale =
    1;

  let startX =
    0;

  let endX =
    0;

  // =================================
  // CAMERA MOTION
  // =================================

  if (
    camera ===
    "zoom-in"
  ) {
    endScale =
      1 +
      zoomAmount;
  }

  if (
    camera ===
    "zoom-out"
  ) {
    startScale =
      1 +
      zoomAmount;
  }

  if (
    camera ===
    "pan-left"
  ) {
    startScale =
      1.04;

    endScale =
      1.04;

    startX =
      panAmount / 2;

    endX =
      -panAmount /
      2;
  }

  if (
    camera ===
    "pan-right"
  ) {
    startScale =
      1.04;

    endScale =
      1.04;

    startX =
      -panAmount /
      2;

    endX =
      panAmount / 2;
  }

  if (
    camera ===
    "static"
  ) {
    startScale =
      1.02;

    endScale =
      1.02;
  }

  const scale =
    interpolate(
      frame,
      [
        0,

        Math.max(
          1,

          durationInFrames -
            1,
        ),
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

        Math.max(
          1,

          durationInFrames -
            1,
        ),
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

  const captionDurationInFrames =
    audioDuration
      ? Math.max(
          1,

          Math.round(
            audioDuration *
              fps,
          ),
        )
      : durationInFrames;

  return (
    <AbsoluteFill
      style={{
        backgroundColor:
          "#111111",

        overflow:
          "hidden",
      }}
    >
      {/* =================================
          VOICEOVER
      ================================= */}

      {audioUrl && (
        <Audio
          src={
            resolveAudioUrl(
              audioUrl,
            )
          }
        />
      )}

      {/* =================================
          IMAGE
      ================================= */}

      <Img
        src={
          imageUrl
        }
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

          transform:
            `translateX(${translateX}px) scale(${scale})`,
        }}
      />

      {/* =================================
          GRADIENT
      ================================= */}

      <AbsoluteFill
        style={{
          background:
            captionStyle ===
            "none"
              ? "linear-gradient(to bottom, rgba(0,0,0,0.04) 60%, rgba(0,0,0,0.22) 100%)"
              : "linear-gradient(to bottom, rgba(0,0,0,0.05) 35%, rgba(0,0,0,0.72) 100%)",
        }}
      />

      {/* =================================
          CAPTION
      ================================= */}

      <AnimatedCaption
        text={
          script
        }
        styleType={
          captionStyle
        }
        frame={
          frame
        }
        fps={
          fps
        }
        durationInFrames={
          captionDurationInFrames
        }
        wordTimings={
          wordTimings
        }
        captionSyncOffsetMs={
          captionSyncOffsetMs
        }
      />

      {/* =================================
          TITLE
      ================================= */}

      <div
        style={{
          position:
            "absolute",

          top:
            90,

          left:
            70,

          right:
            70,

          fontFamily:
            "Arial, sans-serif",

          fontWeight:
            700,

          fontSize:
            34,

          color:
            "rgba(255,255,255,0.9)",
        }}
      >
        {title}
      </div>
    </AbsoluteFill>
  );
}

// =================================
// ANIMATED CAPTION
// =================================

function AnimatedCaption({
  text,
  styleType,
  frame,
  fps,
  durationInFrames,
  wordTimings,
  captionSyncOffsetMs,
}: {
  text: string;

  styleType:
    CaptionStyle;

  frame: number;

  fps: number;

  durationInFrames: number;

  wordTimings?:
    WordTiming[];

  captionSyncOffsetMs:
    number;
}) {
  // =================================
  // NO CAPTIONS
  // =================================

  if (
    styleType ===
    "none"
  ) {
    return null;
  }

  if (
    !text.trim()
  ) {
    return null;
  }

  // =================================
  // MINIMAL
  // =================================

  if (
    styleType ===
    "minimal"
  ) {
    return (
      <div
        style={{
          position:
            "absolute",

          left:
            90,

          right:
            90,

          bottom:
            190,

          textAlign:
            "center",

          color:
            "white",

          fontFamily:
            "Arial, sans-serif",

          fontWeight:
            600,

          fontSize:
            54,

          lineHeight:
            1.18,

          textShadow:
            "0 4px 22px rgba(0,0,0,0.75)",
        }}
      >
        {text}
      </div>
    );
  }

  // =================================
  // KARAOKE
  // =================================

  if (
    styleType ===
    "karaoke"
  ) {
    return (
      <KaraokeCaption
        text={
          text
        }
        frame={
          frame
        }
        fps={
          fps
        }
        durationInFrames={
          durationInFrames
        }
        wordTimings={
          wordTimings
        }
        captionSyncOffsetMs={
          captionSyncOffsetMs
        }
      />
    );
  }

  // =================================
  // DYNAMIC / CUSTOM
  // =================================

  const entrance =
    spring({
      frame,

      fps,

      config: {
        damping:
          14,

        stiffness:
          120,

        mass:
          0.8,
      },
    });

  const scale =
    interpolate(
      entrance,
      [
        0,
        1,
      ],
      [
        0.82,
        1,
      ],
    );

  const translateY =
    interpolate(
      entrance,
      [
        0,
        1,
      ],
      [
        70,
        0,
      ],
    );

  return (
    <div
      style={{
        position:
          "absolute",

        left:
          70,

        right:
          70,

        bottom:
          170,

        display:
          "flex",

        justifyContent:
          "center",

        textAlign:
          "center",

        opacity:
          entrance,

        transform:
          `translateY(${translateY}px) scale(${scale})`,
      }}
    >
      <div
        style={{
          maxWidth:
            900,

          padding:
            "22px 30px",

          borderRadius:
            28,

          background:
            styleType ===
            "custom"
              ? "rgba(124,58,237,0.88)"
              : "rgba(15,15,20,0.78)",

          color:
            "white",

          fontFamily:
            "Arial, sans-serif",

          fontWeight:
            800,

          fontSize:
            58,

          lineHeight:
            1.12,
        }}
      >
        {text}
      </div>
    </div>
  );
}

// =================================
// KARAOKE
// =================================

function KaraokeCaption({
  text,
  frame,
  fps,
  durationInFrames,
  wordTimings,
  captionSyncOffsetMs,
}: {
  text: string;

  frame: number;

  fps: number;

  durationInFrames: number;

  wordTimings?:
    WordTiming[];

  captionSyncOffsetMs:
    number;
}) {
  const currentTime =
    frame /
    fps;

  const offsetSeconds =
    captionSyncOffsetMs /
    1000;

  const captionTime =
    currentTime -
    offsetSeconds;

  // =================================
  // WORD LEVEL SYNC
  // =================================

  if (
    wordTimings &&
    wordTimings.length >
      0
  ) {
    let activeIndex =
      wordTimings.findIndex(
        (timing) =>
          captionTime >=
            timing.start &&
          captionTime <
            timing.end,
      );

    if (
      activeIndex ===
      -1
    ) {
      activeIndex =
        wordTimings.findLastIndex(
          (timing) =>
            timing.start <=
            captionTime,
        );
    }

    if (
      activeIndex <
      0
    ) {
      activeIndex =
        0;
    }

    return (
      <div
        style={{
          position:
            "absolute",

          left:
            70,

          right:
            70,

          bottom:
            170,

          textAlign:
            "center",
        }}
      >
        <div
          style={{
            display:
              "inline-block",

            maxWidth:
              920,

            padding:
              "20px 28px",

            borderRadius:
              24,

            background:
              "rgba(0,0,0,0.65)",

            fontFamily:
              "Arial, sans-serif",

            fontWeight:
              800,

            fontSize:
              54,

            lineHeight:
              1.2,
          }}
        >
          {wordTimings.map(
            (
              timing,
              index,
            ) => {
              const isActive =
                index ===
                activeIndex;

              const isPast =
                index <
                activeIndex;

              return (
                <span
                  key={`${timing.word}-${index}`}
                  style={{
                    display:
                      "inline-block",

                    marginRight:
                      14,

                    marginBottom:
                      6,

                    color:
                      isActive
                        ? "#c4b5fd"
                        : isPast
                          ? "rgba(255,255,255,0.72)"
                          : "white",

                    transform:
                      isActive
                        ? "scale(1.11)"
                        : "scale(1)",
                  }}
                >
                  {
                    timing.word
                  }
                </span>
              );
            },
          )}
        </div>
      </div>
    );
  }

  // =================================
  // FALLBACK
  // =================================

  const words =
    text
      .trim()
      .split(
        /\s+/,
      );

  const offsetFrames =
    Math.round(
      offsetSeconds *
        fps,
    );

  const adjustedFrame =
    Math.max(
      0,

      frame -
        offsetFrames,
    );

  const progress =
    Math.min(
      1,

      adjustedFrame /
        Math.max(
          1,

          durationInFrames,
        ),
    );

  const activeIndex =
    Math.min(
      words.length -
        1,

      Math.floor(
        progress *
          words.length,
      ),
    );

  return (
    <div
      style={{
        position:
          "absolute",

        left:
          70,

        right:
          70,

        bottom:
          170,

        textAlign:
          "center",
      }}
    >
      <div
        style={{
          display:
            "inline-block",

          padding:
            "20px 28px",

          borderRadius:
            24,

          background:
            "rgba(0,0,0,0.65)",

          color:
            "white",

          fontFamily:
            "Arial, sans-serif",

          fontWeight:
            800,

          fontSize:
            54,
        }}
      >
        {words.map(
          (
            word,
            index,
          ) => (
            <span
              key={`${word}-${index}`}
              style={{
                display:
                  "inline-block",

                marginRight:
                  14,

                color:
                  index ===
                  activeIndex
                    ? "#c4b5fd"
                    : "white",
              }}
            >
              {
                word
              }
            </span>
          ),
        )}
      </div>
    </div>
  );
}