"use client";

import {
  AbsoluteFill,
  Sequence,
} from "remotion";

import type {
  Scene,
} from "../../app/page";

import SceneComposition from "./SceneComposition";

type FullVideoCompositionProps = {
  imageUrl: string;
  scenes: Scene[];
  fps?: number;
};

export default function FullVideoComposition({
  imageUrl,
  scenes,
  fps = 30,
}: FullVideoCompositionProps) {
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
        };
      },
    );

  return (
    <AbsoluteFill
      style={{
        backgroundColor:
          "#111111",
      }}
    >
      {preparedScenes.map(
        ({
          scene,
          from,
          durationInFrames,
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
            <SceneComposition
              imageUrl={
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
            />
          </Sequence>
        ),
      )}
    </AbsoluteFill>
  );
}