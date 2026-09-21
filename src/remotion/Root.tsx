import {
  Composition,
} from "remotion";

import FullVideoComposition from "../components/video/FullVideoComposition";

import type {
  CaptionStyle,
  Scene,
} from "../app/page";

type FullVideoProps = {
  imageUrl: string;
  scenes: Scene[];
  fps?: number;
  captionStyle?: CaptionStyle;
};

const defaultScenes:
  Scene[] = [
  {
    id:
      1,

    title:
      "Creora Preview",

    start:
      0,

    end:
      3,

    script:
      "Your Creora video preview.",

    visualPrompt:
      "Creator video preview.",

    motion: {
      camera:
        "zoom-in",

      speed:
        "slow",
    },

    transition: {
      type:
        "cut",

      duration:
        0.3,
    },
  },
];

export default function RemotionRoot() {
  return (
    <Composition
      id="CreoraFullVideo"
      component={
        FullVideoComposition
      }
      width={
        1080
      }
      height={
        1920
      }
      fps={
        30
      }
      durationInFrames={
        90
      }
      defaultProps={{
        imageUrl:
          "",

        scenes:
          defaultScenes,

        fps:
          30,

        captionStyle:
          "dynamic" as CaptionStyle,
      }}
      calculateMetadata={({
        props,
      }) => {
        const typedProps =
          props as FullVideoProps;

        const fps =
          typedProps.fps ??
          30;

        const scenes =
          typedProps.scenes ??
          defaultScenes;

        const totalFrames =
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
                Math.max(
                  1,

                  Math.round(
                    seconds *
                      fps,
                  ),
                )
              );
            },
            0,
          );

        return {
          durationInFrames:
            Math.max(
              1,
              totalFrames,
            ),

          fps,

          width:
            1080,

          height:
            1920,
        };
      }}
    />
  );
}