"use client";

import type {
  CSSProperties,
  ReactNode,
} from "react";

import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";

import type {
  BrandingPosition,
  CaptionStyle,
  MusicTrack,
  Scene,
  SceneTransition,
} from "@/app/page";

import SceneComposition from "./SceneComposition";

type FullVideoCompositionProps = {
  imageUrl: string;
  scenes: Scene[];
  fps?: number;
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

type SceneTransitionWrapperProps = {
  children: ReactNode;
  transition?: SceneTransition;
  fps: number;
  isFirstScene: boolean;
};

const MUSIC_FILES: Record<
  Exclude<
    MusicTrack,
    "none"
  >,
  string
> = {
  "chill-vibes":
    "music/chill-vibes.mp3",

  "upbeat-creator":
    "music/upbeat-creator.mp3",

  "soft-lifestyle":
    "music/soft-lifestyle.mp3",
};

// =================================
// SCENE TRANSITION
// =================================

function SceneTransitionWrapper({
  children,
  transition,
  fps,
  isFirstScene,
}: SceneTransitionWrapperProps) {
  const frame =
    useCurrentFrame();

  if (
    isFirstScene ||
    !transition ||
    transition.type ===
      "cut"
  ) {
    return (
      <AbsoluteFill>
        {children}
      </AbsoluteFill>
    );
  }

  const transitionFrames =
    Math.max(
      1,

      Math.round(
        transition.duration *
          fps,
      ),
    );

  const progress =
    interpolate(
      frame,
      [
        0,
        transitionFrames,
      ],
      [
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

  let style:
    CSSProperties = {
    width:
      "100%",

    height:
      "100%",
  };

  if (
    transition.type ===
    "fade"
  ) {
    style = {
      ...style,

      opacity:
        progress,
    };
  }

  if (
    transition.type ===
    "dissolve"
  ) {
    style = {
      ...style,

      opacity:
        progress,

      filter:
        `blur(${Math.max(
          0,
          (1 - progress) *
            8,
        )}px)`,
    };
  }

  if (
    transition.type ===
    "slide-left"
  ) {
    style = {
      ...style,

      transform:
        `translateX(${interpolate(
          progress,
          [0, 1],
          [100, 0],
        )}%)`,
    };
  }

  if (
    transition.type ===
    "slide-right"
  ) {
    style = {
      ...style,

      transform:
        `translateX(${interpolate(
          progress,
          [0, 1],
          [-100, 0],
        )}%)`,
    };
  }

  return (
    <AbsoluteFill
      style={
        style
      }
    >
      {children}
    </AbsoluteFill>
  );
}

// =================================
// BRAND LOGO POSITION
// =================================

function getLogoPositionStyle(
  position:
    BrandingPosition,
): CSSProperties {
  /*
   * We intentionally keep the logo
   * away from the very bottom because
   * social-video controls and captions
   * often occupy that area.
   */

  const sideSpacing =
    70;

  const topSpacing =
    90;

  const bottomSpacing =
    190;

  if (
    position ===
    "top-left"
  ) {
    return {
      top:
        topSpacing,

      left:
        sideSpacing,
    };
  }

  if (
    position ===
    "top-right"
  ) {
    return {
      top:
        topSpacing,

      right:
        sideSpacing,
    };
  }

  if (
    position ===
    "bottom-left"
  ) {
    return {
      bottom:
        bottomSpacing,

      left:
        sideSpacing,
    };
  }

  return {
    bottom:
      bottomSpacing,

    right:
      sideSpacing,
  };
}

// =================================
// FULL VIDEO
// =================================

export default function FullVideoComposition({
  imageUrl,
  scenes,
  fps = 30,
  captionStyle = "dynamic",
  captionSyncOffsetMs = 0,

  musicTrack = "none",
  musicVolume = 25,
  autoDucking = true,

  brandingEnabled = false,
  brandLogo = null,
  brandingPosition = "top-right",
  brandingSize = 16,
  brandingOpacity = 85,
}: FullVideoCompositionProps) {
  const frame =
    useCurrentFrame();

  // =================================
  // PREPARE SCENES
  // =================================

  const preparedScenes =
    scenes.map(
      (
        scene,
        index,
      ) => {
        const durationSeconds =
          Math.max(
            1,

            scene.end -
              scene.start,
          );

        const durationInFrames =
          Math.max(
            1,

            Math.round(
              durationSeconds *
                fps,
            ),
          );

        const previousFrames =
          scenes
            .slice(
              0,
              index,
            )
            .reduce(
              (
                total,
                previousScene,
              ) => {
                const previousDuration =
                  Math.max(
                    1,

                    previousScene.end -
                      previousScene.start,
                  );

                return (
                  total +
                  Math.max(
                    1,

                    Math.round(
                      previousDuration *
                        fps,
                    ),
                  )
                );
              },
              0,
            );

        return {
          scene,

          from:
            previousFrames,

          durationInFrames,

          index,
        };
      },
    );

  // =================================
  // ACTIVE SCENE
  // =================================

  const activePreparedScene =
    preparedScenes.find(
      ({
        from,
        durationInFrames,
      }) =>
        frame >=
          from &&
        frame <
          from +
            durationInFrames,
    );

  // =================================
  // VOICE STATUS
  // =================================

  const voiceIsActive =
    Boolean(
      activePreparedScene
        ?.scene.audioUrl,
    );

  // =================================
  // MUSIC VOLUME
  // =================================

  const baseMusicVolume =
    Math.max(
      0,
      Math.min(
        1,
        musicVolume /
          100,
      ),
    );

  const duckedMusicVolume =
    baseMusicVolume *
    0.38;

  const currentMusicVolume =
    autoDucking &&
    voiceIsActive
      ? duckedMusicVolume
      : baseMusicVolume;

  // =================================
  // BRANDING SAFETY
  // =================================

  const safeBrandingSize =
    Math.max(
      8,
      Math.min(
        35,
        brandingSize,
      ),
    );

  const safeOpacity =
    Math.max(
      0,
      Math.min(
        1,
        brandingOpacity /
          100,
      ),
    );

  return (
    <AbsoluteFill
      style={{
        backgroundColor:
          "#111111",
      }}
    >
      {/* =================================
          BACKGROUND MUSIC
      ================================= */}

      {musicTrack !==
        "none" && (
        <Audio
          src={staticFile(
            MUSIC_FILES[
              musicTrack
            ],
          )}
          loop
          volume={
            currentMusicVolume
          }
        />
      )}

      {/* =================================
          VIDEO SCENES
      ================================= */}

      {preparedScenes.map(
        ({
          scene,
          from,
          durationInFrames,
          index,
        }) => (
          <Sequence
            key={
              scene.id
            }
            from={
              from
            }
            durationInFrames={
              durationInFrames
            }
          >
            <SceneTransitionWrapper
              transition={
                scene.transition
              }
              fps={
                fps
              }
              isFirstScene={
                index === 0
              }
            >
              <SceneComposition
                imageUrl={
                  scene.imageUrl ||
                  imageUrl
                }
                title={
                  scene.title
                }
                script={
                  scene.script
                }
                motion={
                  scene.motion
                }
                captionStyle={
                  captionStyle
                }
                audioUrl={
                  scene.audioUrl
                }
                audioDuration={
                  scene.audioDuration
                }
                wordTimings={
                  scene.wordTimings
                }
                captionSyncOffsetMs={
                  captionSyncOffsetMs
                }
              />
            </SceneTransitionWrapper>
          </Sequence>
        ),
      )}

      {/* =================================
          BRAND LOGO
      ================================= */}

      {brandingEnabled &&
        brandLogo && (
          <div
            style={{
              position:
                "absolute",

              zIndex:
                999,

              width:
                `${safeBrandingSize}%`,

              minWidth:
                100,

              maxWidth:
                380,

              opacity:
                safeOpacity,

              pointerEvents:
                "none",

              display:
                "flex",

              alignItems:
                "center",

              justifyContent:
                "center",

              ...getLogoPositionStyle(
                brandingPosition,
              ),
            }}
          >
            <Img
              src={
                brandLogo
              }
              style={{
                display:
                  "block",

                width:
                  "100%",

                height:
                  "auto",

                maxHeight:
                  260,

                objectFit:
                  "contain",

                objectPosition:
                  "center",
              }}
            />
          </div>
        )}
    </AbsoluteFill>
  );
}