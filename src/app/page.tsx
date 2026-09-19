"use client";

import {
  Download,
  LoaderCircle,
} from "lucide-react";

import {
  useState,
} from "react";

import CreatorInputPanel from "@/components/creator/CreatorInputPanel";
import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";
import StepProgress from "@/components/dashboard/StepProgress";
import EditorControls from "@/components/editor/EditorControls";
import ScriptPanel from "@/components/editor/ScriptPanel";
import VideoPreview from "@/components/editor/VideoPreview";
import FullVideoPlayer from "@/components/video/FullVideoPlayer";

export type Platform =
  | "tiktok"
  | "instagram"
  | "youtube";

export type Duration =
  | 10
  | 15
  | 30;

export type VideoStyle =
  | "ugc"
  | "cinematic"
  | "lifestyle"
  | "product-demo";

export type CameraMotion =
  | "zoom-in"
  | "zoom-out"
  | "pan-left"
  | "pan-right"
  | "static";

export type MotionSpeed =
  | "slow"
  | "medium"
  | "fast";

export type SceneMotion = {
  camera: CameraMotion;
  speed: MotionSpeed;
};

export type VideoProject = {
  creatorDescription: string;
  videoPrompt: string;
  platform: Platform;
  duration: Duration;
  style: VideoStyle;
};

export type Scene = {
  id: number;
  title: string;
  start: number;
  end: number;
  script: string;
  visualPrompt: string;
  motion?: SceneMotion;
};

export type GeneratedContent = {
  title: string;
  hook: string;
  caption: string;
  hashtags: string[];
  scenes: Scene[];
};

export default function Home() {
  const [
    imagePreview,
    setImagePreview,
  ] =
    useState<string | null>(
      null,
    );

  const [
    generatedContent,
    setGeneratedContent,
  ] =
    useState<GeneratedContent | null>(
      null,
    );

  const [
    contentVersion,
    setContentVersion,
  ] =
    useState(0);

  const [
    project,
    setProject,
  ] =
    useState<VideoProject>({
      creatorDescription:
        "Lifestyle influencer, confident, modern, loves fashion, wellness and travel. My audience is young women who want a more balanced and beautiful life.",

      videoPrompt:
        "3 morning habits that changed my life. Make it feel natural, fast-paced and TikTok friendly.",

      platform:
        "tiktok",

      duration:
        15,

      style:
        "ugc",
    });

  const [
    isGenerating,
    setIsGenerating,
  ] =
    useState(false);

  const [
    isGeneratingScene,
    setIsGeneratingScene,
  ] =
    useState(false);

  const [
    generatingSceneId,
    setGeneratingSceneId,
  ] =
    useState<number | null>(
      null,
    );

  const [
    isExporting,
    setIsExporting,
  ] =
    useState(false);

  // =================================
  // GENERATE VIDEO
  // =================================

  const handleGenerate =
    async () => {
      if (
        !project.creatorDescription.trim() ||
        !project.videoPrompt.trim()
      ) {
        alert(
          "Please describe your creator and video idea.",
        );

        return;
      }

      try {
        setIsGenerating(
          true,
        );

        const response =
          await fetch(
            "/api/generate-content",
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify(
                  project,
                ),
            },
          );

        if (!response.ok) {
          const errorData =
            await response.json();

          console.error(
            "API ERROR:",
            errorData,
          );

          throw new Error(
            errorData.error ||
              "Failed to generate content.",
          );
        }

        const data:
          GeneratedContent =
          await response.json();

        console.log(
          "OLLAMA RESULT:",
          data,
        );

        setGeneratedContent(
          data,
        );

        setContentVersion(
          (current) =>
            current + 1,
        );
      } catch (error) {
        console.error(
          "Generation error:",
          error,
        );

        if (
          error instanceof
          Error
        ) {
          alert(
            error.message,
          );
        } else {
          alert(
            "Could not generate the content.",
          );
        }
      } finally {
        setIsGenerating(
          false,
        );
      }
    };

  // =================================
  // GENERATE / REGENERATE ONE SCENE
  // =================================

  const handleGenerateScene =
    async (
      scene: Scene,
    ) => {
      try {
        setIsGeneratingScene(
          true,
        );

        setGeneratingSceneId(
          scene.id,
        );

        const response =
          await fetch(
            "/api/regenerate-scene",
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  creatorDescription:
                    project.creatorDescription,

                  videoPrompt:
                    project.videoPrompt,

                  platform:
                    project.platform,

                  style:
                    project.style,

                  scene,
                }),
            },
          );

        if (!response.ok) {
          const errorData =
            await response.json();

          console.error(
            "SCENE API ERROR:",
            errorData,
          );

          throw new Error(
            errorData.error ||
              "Failed to regenerate scene.",
          );
        }

        const regeneratedScene:
          Scene =
          await response.json();

        console.log(
          "REGENERATED SCENE:",
          regeneratedScene,
        );

        setGeneratedContent(
          (current) => {
            if (!current) {
              return current;
            }

            return {
              ...current,

              scenes:
                current.scenes.map(
                  (
                    currentScene,
                  ) =>
                    currentScene.id ===
                    regeneratedScene.id
                      ? regeneratedScene
                      : currentScene,
                ),
            };
          },
        );
      } catch (error) {
        console.error(
          "Scene generation error:",
          error,
        );

        if (
          error instanceof
          Error
        ) {
          alert(
            error.message,
          );
        } else {
          alert(
            "Could not regenerate this scene.",
          );
        }
      } finally {
        setIsGeneratingScene(
          false,
        );

        setGeneratingSceneId(
          null,
        );
      }
    };

  // =================================
  // UPDATE ONE SCENE
  // =================================

  const handleUpdateScene =
    (
      sceneId: number,
      updates:
        Partial<Scene>,
    ) => {
      setGeneratedContent(
        (current) => {
          if (!current) {
            return current;
          }

          return {
            ...current,

            scenes:
              current.scenes.map(
                (scene) =>
                  scene.id ===
                  sceneId
                    ? {
                        ...scene,
                        ...updates,
                      }
                    : scene,
              ),
          };
        },
      );
    };

  // =================================
  // UPDATE MULTIPLE SCENES
  // =================================

  const handleUpdateScenes =
    (
      updatedScenes:
        Scene[],
    ) => {
      setGeneratedContent(
        (current) => {
          if (!current) {
            return current;
          }

          return {
            ...current,

            scenes:
              updatedScenes,
          };
        },
      );
    };

  // =================================
  // ADD SCENE
  // =================================

  const handleAddScene =
    (
      scene: Scene,
    ) => {
      setGeneratedContent(
        (current) => {
          if (!current) {
            return current;
          }

          return {
            ...current,

            scenes: [
              ...current.scenes,
              scene,
            ],
          };
        },
      );
    };

  // =================================
  // EXPORT MP4
  // =================================

  const handleExportVideo =
    async () => {
      if (
        !imagePreview ||
        !generatedContent ||
        generatedContent.scenes
          .length === 0
      ) {
        alert(
          "Generate a video before exporting.",
        );

        return;
      }

      try {
        setIsExporting(
          true,
        );

        const response =
          await fetch(
            "/api/export-video",
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  imageUrl:
                    imagePreview,

                  scenes:
                    generatedContent.scenes,
                }),
            },
          );

        if (!response.ok) {
          let message =
            "Could not export video.";

          try {
            const errorData =
              await response.json();

            if (
              errorData.error
            ) {
              message =
                errorData.error;
            }
          } catch {
            // Response was not JSON
          }

          throw new Error(
            message,
          );
        }

        // =================================
        // GET MP4 BLOB
        // =================================

        const videoBlob =
          await response.blob();

        if (
          videoBlob.size ===
          0
        ) {
          throw new Error(
            "The exported video is empty.",
          );
        }

        // =================================
        // GET FILE NAME
        // =================================

        const contentDisposition =
          response.headers.get(
            "Content-Disposition",
          );

        const fileNameMatch =
          contentDisposition?.match(
            /filename="([^"]+)"/,
          );

        const fileName =
          fileNameMatch?.[1] ||
          `creora-${Date.now()}.mp4`;

        // =================================
        // DOWNLOAD VIDEO
        // =================================

        const downloadUrl =
          URL.createObjectURL(
            videoBlob,
          );

        const link =
          document.createElement(
            "a",
          );

        link.href =
          downloadUrl;

        link.download =
          fileName;

        document.body.appendChild(
          link,
        );

        link.click();

        link.remove();

        URL.revokeObjectURL(
          downloadUrl,
        );
      } catch (error) {
        console.error(
          "Export error:",
          error,
        );

        if (
          error instanceof
          Error
        ) {
          alert(
            error.message,
          );
        } else {
          alert(
            "Could not export video.",
          );
        }
      } finally {
        setIsExporting(
          false,
        );
      }
    };

  // =================================
  // TOTAL DURATION
  // =================================

  const totalVideoDuration =
    generatedContent
      ? generatedContent.scenes.reduce(
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
        )
      : 0;

  return (
    <div className="flex min-h-screen bg-[#f8f9fc]">
      <Sidebar />

      <div className="min-w-0 flex-1">
        <Header />

        <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-7">
          {/* =================================
              PAGE HEADER
          ================================= */}

          <div className="mb-6 flex flex-col justify-between gap-3 lg:flex-row lg:items-end">
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Create AI Video
              </h1>

              <p className="mt-1 text-sm text-slate-500 sm:text-base">
                Turn a photo and an idea
                into ready-to-post social
                content.
              </p>
            </div>

            <div className="hidden rotate-[-5deg] text-lg italic text-slate-700 xl:block">
              One idea. Endless content.

              <div className="ml-auto mt-1 h-[3px] w-20 rounded-full bg-violet-500" />
            </div>
          </div>

          {/* =================================
              PROGRESS
          ================================= */}

          <StepProgress />

          {/* =================================
              MAIN EDITOR
          ================================= */}

          <div className="mt-4 grid gap-4 xl:grid-cols-[1.05fr_0.82fr_1fr]">
            <CreatorInputPanel
              imagePreview={
                imagePreview
              }
              setImagePreview={
                setImagePreview
              }
              project={
                project
              }
              setProject={
                setProject
              }
              onGenerate={
                handleGenerate
              }
              isGenerating={
                isGenerating
              }
            />

            <VideoPreview
              imagePreview={
                imagePreview
              }
            />

            <ScriptPanel
              key={
                contentVersion
              }
              imagePreview={
                imagePreview
              }
              generatedContent={
                generatedContent
              }
              isGenerating={
                isGenerating
              }
              onRegenerate={
                handleGenerate
              }
              onGenerateScene={
                handleGenerateScene
              }
              isGeneratingScene={
                isGeneratingScene
              }
              generatingSceneId={
                generatingSceneId
              }
              onAddScene={
                handleAddScene
              }
              onUpdateScene={
                handleUpdateScene
              }
              onUpdateScenes={
                handleUpdateScenes
              }
            />
          </div>

          {/* =================================
              FULL VIDEO PREVIEW
          ================================= */}

          {imagePreview &&
            generatedContent &&
            generatedContent.scenes
              .length > 0 && (
              <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_18px_rgba(20,20,43,0.03)]">
                {/* HEADER */}

                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-violet-600">
                      Full Video Preview
                    </p>

                    <h2 className="mt-1 text-xl font-semibold text-slate-900">
                      {
                        generatedContent.title
                      }
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Watch all scenes
                      together in sequence.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-700">
                      {
                        generatedContent
                          .scenes.length
                      }{" "}
                      scenes
                    </span>

                    <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                      {
                        totalVideoDuration
                      }
                      s
                    </span>

                    <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium capitalize text-slate-600">
                      {
                        project.platform
                      }
                    </span>

                    {/* EXPORT BUTTON */}

                    <button
                      type="button"
                      onClick={
                        handleExportVideo
                      }
                      disabled={
                        isExporting
                      }
                      className={[
                        "ml-0 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition sm:ml-2",

                        isExporting
                          ? "cursor-not-allowed bg-violet-400"
                          : "bg-violet-600 hover:bg-violet-700 active:scale-[0.98]",
                      ].join(" ")}
                    >
                      {isExporting ? (
                        <>
                          <LoaderCircle
                            size={
                              17
                            }
                            className="animate-spin"
                          />

                          Rendering MP4...
                        </>
                      ) : (
                        <>
                          <Download
                            size={
                              17
                            }
                          />

                          Export MP4
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* =================================
                    PLAYER + TIMELINE
                ================================= */}

                <div className="mt-6 grid gap-6 lg:grid-cols-[360px_1fr]">
                  {/* PLAYER */}

                  <div className="mx-auto w-full max-w-[360px] lg:mx-0">
                    <FullVideoPlayer
                      imageUrl={
                        imagePreview
                      }
                      scenes={
                        generatedContent.scenes
                      }
                    />
                  </div>

                  {/* RIGHT SIDE */}

                  <div>
                    {/* TIMELINE */}

                    <div className="rounded-xl border border-slate-200 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Video Timeline
                      </p>

                      <div className="mt-4 space-y-3">
                        {generatedContent.scenes.map(
                          (
                            scene,
                            index,
                          ) => (
                            <div
                              key={
                                scene.id
                              }
                              className="flex gap-3 rounded-xl bg-slate-50 p-3"
                            >
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-xs font-bold text-violet-700">
                                {
                                  index +
                                  1
                                }
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-3">
                                  <p className="truncate text-sm font-semibold text-slate-800">
                                    {
                                      scene.title
                                    }
                                  </p>

                                  <span className="shrink-0 text-[10px] text-slate-400">
                                    {
                                      scene.start
                                    }
                                    s–
                                    {
                                      scene.end
                                    }
                                    s
                                  </span>
                                </div>

                                <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                                  {
                                    scene.script
                                  }
                                </p>

                                {scene.motion && (
                                  <div className="mt-2 flex flex-wrap gap-2">
                                    <span className="rounded-full bg-white px-2 py-1 text-[10px] font-medium text-violet-700">
                                      {
                                        scene
                                          .motion
                                          .camera
                                      }
                                    </span>

                                    <span className="rounded-full bg-white px-2 py-1 text-[10px] text-slate-500">
                                      {
                                        scene
                                          .motion
                                          .speed
                                      }
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>

                    {/* CAPTION */}

                    <div className="mt-4 rounded-xl bg-violet-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-violet-600">
                        Caption
                      </p>

                      <p className="mt-2 text-sm leading-6 text-slate-700">
                        {
                          generatedContent.caption
                        }
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {generatedContent.hashtags.map(
                          (
                            hashtag,
                            index,
                          ) => (
                            <span
                              key={`${hashtag}-${index}`}
                              className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-violet-700"
                            >
                              {
                                hashtag
                              }
                            </span>
                          ),
                        )}
                      </div>
                    </div>

                    {/* EXPORT INFO */}

                    <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                          <Download
                            size={
                              17
                            }
                          />
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            Ready for export
                          </p>

                          <p className="mt-1 text-xs leading-5 text-slate-500">
                            Your video will
                            be rendered as a
                            vertical 1080 ×
                            1920 MP4 using
                            the scenes and
                            edits shown in
                            this preview.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

          {/* =================================
              EDITOR CONTROLS
          ================================= */}

          <div className="mt-4 xl:ml-[calc(33.5%+8px)]">
            <EditorControls />
          </div>
        </main>
      </div>
    </div>
  );
}