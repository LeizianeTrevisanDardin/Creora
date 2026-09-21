"use client";

import {
  Player,
} from "@remotion/player";

import type {
  BrandingPosition,
  CaptionStyle,
  MusicTrack,
  Scene,
} from "@/app/page";

import FullVideoComposition from "./FullVideoComposition";

type FullVideoPlayerProps = {
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

export default function FullVideoPlayer({
  imageUrl,
  scenes,
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
}: FullVideoPlayerProps) {
  const fps =
    30;

  const durationInFrames =
    Math.max(
      1,

      scenes.reduce(
        (
          total,
          scene,
        ) => {
          const seconds =
            Math.max(
              1,
              scene.end -
                scene.start,
            );

          return (
            total +
            Math.round(
              seconds *
                fps,
            )
          );
        },
        0,
      ),
    );

  return (
    <Player
      component={
        FullVideoComposition
      }
      inputProps={{
        imageUrl,
        scenes,
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
      fps={fps}
      controls
      style={{
        width:
          "100%",

        aspectRatio:
          "9 / 16",
      }}
    />
  );
}