"use client";

import {
  Player,
} from "@remotion/player";

import type {
  CaptionStyle,
  SceneMotion,
} from "@/app/page";

import SceneComposition from "./SceneComposition";

type ScenePlayerProps = {
  imageUrl: string;
  title: string;
  script: string;
  durationSeconds: number;
  motion?: SceneMotion;
  captionStyle?: CaptionStyle;
};

export default function ScenePlayer({
  imageUrl,
  title,
  script,
  durationSeconds,
  motion,
  captionStyle = "dynamic",
}: ScenePlayerProps) {
  const fps =
    30;

  const durationInFrames =
    Math.max(
      1,
      Math.round(
        durationSeconds *
          fps,
      ),
    );

  return (
    <Player
      component={
        SceneComposition
      }
      inputProps={{
        imageUrl,
        title,
        script,
        motion,
        captionStyle,
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