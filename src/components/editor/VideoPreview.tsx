"use client";

import {
  Heart,
  MessageCircle,
  Pause,
  Pencil,
  Play,
  Share2,
} from "lucide-react";

import Image from "next/image";

import {
  Player,
} from "@remotion/player";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type {
  BrandingPosition,
  CaptionStyle,
  GeneratedContent,
  MusicTrack,
  VideoProject,
} from "@/app/page";

import FullVideoComposition from "@/components/video/FullVideoComposition";

type VideoPreviewProps = {
  imagePreview: string | null;

  project: VideoProject;

  generatedContent:
    GeneratedContent | null;

  captionStyle: CaptionStyle;

  captionSyncOffsetMs: number;

  musicTrack: MusicTrack;

  musicVolume: number;

  autoDucking: boolean;

  brandingEnabled: boolean;

  brandLogo: string | null;

  brandingPosition:
    BrandingPosition;

  brandingSize: number;

  brandingOpacity: number;

  previewTitle:
    string | null;

  setPreviewTitle: (
    value: string | null,
  ) => void;

  previewSubtitle:
    string | null;

  setPreviewSubtitle: (
    value: string | null,
  ) => void;
};

function formatTime(
  seconds: number,
) {
  const safeSeconds =
    Math.max(
      0,
      Math.floor(
        seconds,
      ),
    );

  const minutes =
    Math.floor(
      safeSeconds /
        60,
    );

  const remaining =
    safeSeconds %
    60;

  return `${String(
    minutes,
  ).padStart(
    2,
    "0",
  )}:${String(
    remaining,
  ).padStart(
    2,
    "0",
  )}`;
}

function getPlatformLabel(
  platform:
    VideoProject["platform"],
) {
  if (
    platform ===
    "instagram"
  ) {
    return "9:16 (Instagram)";
  }

  if (
    platform ===
    "youtube"
  ) {
    return "9:16 (YouTube)";
  }

  if (
    platform ===
    "other"
  ) {
    return "9:16 (Other)";
  }

  return "9:16 (TikTok)";
}

export default function VideoPreview({
  imagePreview,
  project,
  generatedContent,
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
  previewTitle,
  setPreviewTitle,
  previewSubtitle,
  setPreviewSubtitle,
}: VideoPreviewProps) {
  const playerRef =
    useRef<any>(
      null,
    );

  const [
    isPlaying,
    setIsPlaying,
  ] =
    useState(false);

  const [
    currentFrame,
    setCurrentFrame,
  ] =
    useState(0);

  const [
    editingTitle,
    setEditingTitle,
  ] =
    useState(false);

  const [
    editingSubtitle,
    setEditingSubtitle,
  ] =
    useState(false);

  const fps =
    30;

  // =================================
  // VIDEO DURATION
  // =================================

  const totalDuration =
    useMemo(
      () => {
        if (
          !generatedContent ||
          generatedContent.scenes
            .length ===
            0
        ) {
          return project.duration;
        }

        return generatedContent.scenes.reduce(
          (
            total,
            scene,
          ) =>
            total +
            Math.max(
              1,
              scene.end -
                scene.start,
            ),
          0,
        );
      },
      [
        generatedContent,
        project.duration,
      ],
    );

  const durationInFrames =
    Math.max(
      1,

      Math.round(
        totalDuration *
          fps,
      ),
    );

  // =================================
  // REAL VIDEO
  // =================================

  const hasRealVideo =
    Boolean(
      imagePreview &&
        generatedContent &&
        generatedContent
          .scenes.length >
          0,
    );

  // =================================
  // TITLE / SUBTITLE
  // =================================

  const fallbackTitle =
    generatedContent?.title ||
    "3 Morning Habits";

  const fallbackSubtitle =
    generatedContent?.hook ||
    "that changed my life";

  /*
   * null:
   * user never edited it
   * -> use fallback
   *
   * "":
   * user intentionally deleted it
   * -> keep empty
   */

  const displayTitle =
    previewTitle !==
    null
      ? previewTitle
      : fallbackTitle;

  const displaySubtitle =
    previewSubtitle !==
    null
      ? previewSubtitle
      : fallbackSubtitle;

  // =================================
  // PLAYER PROGRESS
  // =================================

  const currentSeconds =
    currentFrame /
    fps;

  const progress =
    Math.max(
      0,

      Math.min(
        100,

        durationInFrames >
          1
          ? (currentFrame /
              (durationInFrames -
                1)) *
              100
          : 0,
      ),
    );

  // =================================
  // WATCH PLAYER
  // =================================

  useEffect(
    () => {
      if (
        !isPlaying
      ) {
        return;
      }

      const interval =
        window.setInterval(
          () => {
            const frame =
              playerRef.current
                ?.getCurrentFrame?.();

            if (
              typeof frame !==
              "number"
            ) {
              return;
            }

            setCurrentFrame(
              frame,
            );

            if (
              frame >=
              durationInFrames -
                1
            ) {
              setIsPlaying(
                false,
              );
            }
          },
          100,
        );

      return () => {
        window.clearInterval(
          interval,
        );
      };
    },
    [
      isPlaying,
      durationInFrames,
    ],
  );

  // =================================
  // RESET PLAYER WHEN VIDEO CHANGES
  // =================================

  useEffect(
    () => {
      setCurrentFrame(
        0,
      );

      setIsPlaying(
        false,
      );
    },
    [
      generatedContent,
    ],
  );

  // =================================
  // PLAY / PAUSE
  // =================================

  const handlePlayPause =
    () => {
      if (
        !hasRealVideo
      ) {
        return;
      }

      if (
        isPlaying
      ) {
        playerRef.current
          ?.pause?.();

        setIsPlaying(
          false,
        );

        return;
      }

      const frame =
        playerRef.current
          ?.getCurrentFrame?.();

      if (
        typeof frame ===
          "number" &&
        frame >=
          durationInFrames -
            1
      ) {
        playerRef.current
          ?.seekTo?.(
            0,
          );

        setCurrentFrame(
          0,
        );
      }

      playerRef.current
        ?.play?.();

      setIsPlaying(
        true,
      );
    };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="mx-auto max-w-[330px]">
        {/* =================================
            VIDEO
        ================================= */}

        <div className="relative aspect-[9/16] overflow-hidden rounded-2xl bg-gradient-to-b from-[#c8a38c] via-[#8a6756] to-[#241d1d] shadow-sm">
          {hasRealVideo &&
          imagePreview &&
          generatedContent ? (
            <div className="absolute inset-0">
              <Player
                ref={
                  playerRef
                }
                component={
                  FullVideoComposition
                }
                inputProps={{
                  imageUrl:
                    imagePreview,

                  scenes:
                    generatedContent.scenes,

                  fps,

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
                }}
                durationInFrames={
                  durationInFrames
                }
                compositionWidth={
                  1080
                }
                compositionHeight={
                  1920
                }
                fps={
                  fps
                }
                controls={
                  false
                }
                style={{
                  width:
                    "100%",

                  height:
                    "100%",
                }}
              />
            </div>
          ) : imagePreview ? (
            <Image
              src={
                imagePreview
              }
              alt="Creator"
              fill
              unoptimized
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-white/10 text-6xl backdrop-blur-sm">
                  👩🏻
                </div>
              </div>
            </div>
          )}

          {/* =================================
              DARK GRADIENT
          ================================= */}

          {!hasRealVideo && (
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/70" />
          )}

          {/* =================================
              SOCIAL ICONS
          ================================= */}

          {!hasRealVideo && (
            <div className="absolute bottom-28 right-3 z-10 flex flex-col items-center gap-5 text-white">
              <div className="text-center">
                <Heart
                  size={25}
                />

                <span className="text-[9px]">
                  12.4K
                </span>
              </div>

              <div className="text-center">
                <MessageCircle
                  size={25}
                />

                <span className="text-[9px]">
                  342
                </span>
              </div>

              <div className="text-center">
                <Share2
                  size={25}
                />

                <span className="text-[9px]">
                  1.1K
                </span>
              </div>
            </div>
          )}

          {/* =================================
              TITLE / SUBTITLE
          ================================= */}

          {(!hasRealVideo || !isPlaying) && (
            <div className="absolute bottom-24 left-0 right-0 z-20 px-6 text-center text-white">
              {/* TITLE */}

              {editingTitle ? (
                <textarea
                  autoFocus
                  value={
                    previewTitle ??
                    displayTitle
                  }
                  maxLength={
                    60
                  }
                  rows={
                    2
                  }
                  onChange={(event) =>
                    setPreviewTitle(
                      event.target
                        .value,
                    )
                  }
                  onBlur={() =>
                    setEditingTitle(
                      false,
                    )
                  }
                  onKeyDown={(event) => {
                    if (
                      event.key ===
                        "Enter" &&
                      !event.shiftKey
                    ) {
                      event.preventDefault();

                      setEditingTitle(
                        false,
                      );
                    }
                  }}
                  className="w-full resize-none overflow-hidden border-none bg-black/25 p-1 text-center text-3xl font-black uppercase italic leading-[0.95] tracking-tight text-white outline-none"
                />
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    setEditingTitle(
                      true,
                    )
                  }
                  className="group relative mx-auto block min-h-[30px] w-full text-center"
                >
                  <span className="block text-3xl font-black uppercase italic leading-[0.95] tracking-tight">
                    {
                      displayTitle
                    }
                  </span>

                  <span className="absolute -right-1 -top-3 flex items-center gap-1 rounded-full bg-black/45 px-1.5 py-1 text-[8px] font-medium text-white/90">
                    <Pencil
                      size={
                        8
                      }
                    />

                    Edit
                  </span>
                </button>
              )}

              {/* SUBTITLE */}

              {editingSubtitle ? (
                <input
                  autoFocus
                  value={
                    previewSubtitle ??
                    displaySubtitle
                  }
                  maxLength={
                    80
                  }
                  onChange={(event) =>
                    setPreviewSubtitle(
                      event.target
                        .value,
                    )
                  }
                  onBlur={() =>
                    setEditingSubtitle(
                      false,
                    )
                  }
                  onKeyDown={(event) => {
                    if (
                      event.key ===
                      "Enter"
                    ) {
                      setEditingSubtitle(
                        false,
                      );
                    }
                  }}
                  className="mt-2 w-full border-none bg-black/25 p-1 text-center text-lg italic text-white outline-none"
                />
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    setEditingSubtitle(
                      true,
                    )
                  }
                  className="group relative mx-auto mt-2 block min-h-[24px] w-full text-center"
                >
                  <span className="text-lg italic">
                    {
                      displaySubtitle
                    }
                  </span>

                  <Pencil
                    size={
                      9
                    }
                    className="ml-1 inline opacity-70"
                  />
                </button>
              )}

              <div className="mx-auto mt-2 h-1 w-20 rotate-[-3deg] rounded-full bg-violet-400" />
            </div>
          )}

          {/* =================================
              PROGRESS
          ================================= */}

          <div className="absolute bottom-5 left-5 right-5 z-30">
            <div className="mb-2 h-[3px] overflow-hidden rounded-full bg-white/30">
              <div
                className="h-full bg-white"
                style={{
                  width:
                    `${progress}%`,
                }}
              />
            </div>

            <div className="flex items-center gap-2 text-xs text-white">
              {isPlaying ? (
                <Pause
                  size={
                    15
                  }
                  fill="white"
                />
              ) : (
                <Play
                  size={
                    15
                  }
                  fill="white"
                />
              )}

              <span>
                {
                  formatTime(
                    currentSeconds,
                  )
                }
              </span>

              <span className="opacity-50">
                /
              </span>

              <span className="opacity-60">
                {
                  formatTime(
                    totalDuration,
                  )
                }
              </span>
            </div>
          </div>
        </div>

        {/* =================================
            ORIGINAL BOTTOM BUTTONS
        ================================= */}

        <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
          <button
            type="button"
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600"
          >
            ▣ &nbsp;
            {
              getPlatformLabel(
                project.platform,
              )
            }
          </button>

          <button
            type="button"
            onClick={
              handlePlayPause
            }
            disabled={
              !hasRealVideo
            }
            className={[
              "flex items-center gap-2 rounded-xl border border-slate-200 px-5 text-sm font-medium",

              hasRealVideo
                ? ""
                : "cursor-not-allowed opacity-40",
            ].join(
              " ",
            )}
          >
            {isPlaying ? (
              <>
                <Pause
                  size={
                    15
                  }
                  fill="currentColor"
                />

                Pause
              </>
            ) : (
              <>
                <Play
                  size={
                    15
                  }
                  fill="currentColor"
                />

                Play
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}