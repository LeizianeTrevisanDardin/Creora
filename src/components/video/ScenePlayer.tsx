"use client";

import {
  Player,
} from "@remotion/player";

import type {
  SceneMotion,
} from "@/app/page";

import SceneComposition from "./SceneComposition";

type ScenePlayerProps = {
  imageUrl: string;

  title: string;

  script: string;

  durationSeconds: number;

  motion?: SceneMotion;
};

export default function ScenePlayer({
  imageUrl,
  title,
  script,
  durationSeconds,
  motion,
}: ScenePlayerProps) {
  const fps = 30;

  const safeDuration =
    Math.max(
      1,
      durationSeconds,
    );

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-black">
      <Player
        component={
          SceneComposition
        }
        inputProps={{
          imageUrl,
          title,
          script,
          motion,
        }}
        durationInFrames={
          Math.round(
            safeDuration * fps,
          )
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
          width:
            "100%",

          aspectRatio:
            "9 / 16",
        }}
      />
    </div>
  );
}