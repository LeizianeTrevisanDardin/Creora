"use client";

import {
  Player,
} from "@remotion/player";

import type {
  Scene,
} from "@/app/page";

import FullVideoComposition from "./FullVideoComposition";

type FullVideoPlayerProps = {
  imageUrl: string;
  scenes: Scene[];
};

export default function FullVideoPlayer({
  imageUrl,
  scenes,
}: FullVideoPlayerProps) {
  const fps = 30;

  const totalDurationInFrames =
    scenes.reduce(
      (
        total,
        scene,
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

        return (
          total +
          durationInFrames
        );
      },
      0,
    );

  if (
    scenes.length === 0
  ) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
        No scenes available.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-black shadow-sm">
      <Player
        component={
          FullVideoComposition
        }
        inputProps={{
          imageUrl,
          scenes,
          fps,
        }}
        durationInFrames={
          totalDurationInFrames
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
        controls
        style={{
          width: "100%",
          aspectRatio:
            "9 / 16",
        }}
      />
    </div>
  );
}