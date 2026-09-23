"use client";

import {
  ArrowDown,
  ArrowUp,
  Download,
  LoaderCircle,
  Save,
  Trash2,
} from "lucide-react";

import {
  useEffect,
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

import {
  getSavedProject,
  getProjectToOpen,
  getSessionProjectId,
  saveSavedProject,
  setSessionProjectId,
} from "@/lib/projects";

// =================================
// TYPES
// =================================

export type Platform =
  | "tiktok"
  | "instagram"
  | "youtube"
  | "other";

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

export type TransitionType =
  | "cut"
  | "fade"
  | "dissolve"
  | "slide-left"
  | "slide-right";

export type CaptionStyle =
  | "dynamic"
  | "minimal"
  | "karaoke"
  | "custom"
  | "none";

export type VoicePreset =
  | "natural-female"
  | "natural-male"
  | "warm-creator";

export type MusicTrack =
  | "none"
  | "chill-vibes"
  | "upbeat-creator"
  | "soft-lifestyle";

export type BrandingPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

export type SceneMotion = {
  camera: CameraMotion;
  speed: MotionSpeed;
};

export type SceneTransition = {
  type: TransitionType;
  duration: number;
};

export type WordTiming = {
  word: string;
  start: number;
  end: number;
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

  transition?: SceneTransition;

  imageUrl?: string;

  audioUrl?: string;

  audioDuration?: number;

  wordTimings?: WordTiming[];
};

export type GeneratedContent = {
  title: string;
  hook: string;
  caption: string;
  hashtags: string[];
  scenes: Scene[];
};

// =================================
// TIMELINE
// =================================

const VOICE_PADDING =
  0.25;

function roundTime(
  value: number,
) {
  return (
    Math.round(
      value * 100,
    ) / 100
  );
}

function rebuildTimeline(
  scenes: Scene[],
) {
  let currentTime =
    0;

  return scenes.map(
    (scene) => {
      const originalDuration =
        Math.max(
          1,
          scene.end -
            scene.start,
        );

      const sceneDuration =
        scene.audioDuration
          ? Math.max(
              1,
              scene.audioDuration +
                VOICE_PADDING,
            )
          : originalDuration;

      const start =
        roundTime(
          currentTime,
        );

      const end =
        roundTime(
          start +
            sceneDuration,
        );

      currentTime =
        end;

      return {
        ...scene,
        start,
        end,
      };
    },
  );
}

// =================================
// PAGE
// =================================

export default function Home() {
  // =================================
  // IMAGE
  // =================================

  const [
    imagePreview,
    setImagePreview,
  ] =
    useState<string | null>(
      null,
    );

  // =================================
  // GENERATED CONTENT
  // =================================

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

  // =================================
  // PREVIEW TITLE / SUBTITLE
  // =================================

  const [
    previewTitle,
    setPreviewTitle,
  ] =
    useState<string | null>(
      null,
    );

  const [
    previewSubtitle,
    setPreviewSubtitle,
  ] =
    useState<string | null>(
      null,
    );

  // =================================
  // CAPTIONS
  // =================================

  const [
    captionStyle,
    setCaptionStyle,
  ] =
    useState<CaptionStyle>(
      "dynamic",
    );

  const [
    captionSyncOffsetMs,
    setCaptionSyncOffsetMs,
  ] =
    useState(0);

  // =================================
  // VOICEOVER
  // =================================

  const [
    voicePreset,
    setVoicePreset,
  ] =
    useState<VoicePreset>(
      "natural-female",
    );

  const [
    isGeneratingVoice,
    setIsGeneratingVoice,
  ] =
    useState(false);

  // =================================
  // MUSIC
  // =================================

  const [
    musicTrack,
    setMusicTrack,
  ] =
    useState<MusicTrack>(
      "none",
    );

  const [
    musicVolume,
    setMusicVolume,
  ] =
    useState(25);

  const [
    autoDucking,
    setAutoDucking,
  ] =
    useState(true);

  // =================================
  // BRANDING
  // =================================

  const [
    brandingEnabled,
    setBrandingEnabled,
  ] =
    useState(false);

  const [
    brandLogo,
    setBrandLogo,
  ] =
    useState<string | null>(
      null,
    );

  const [
    brandingPosition,
    setBrandingPosition,
  ] =
    useState<BrandingPosition>(
      "top-right",
    );

  const [
    brandingSize,
    setBrandingSize,
  ] =
    useState(16);

  const [
    brandingOpacity,
    setBrandingOpacity,
  ] =
    useState(85);

  // =================================
  // PROJECT
  // =================================

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

  // =================================
  // LOADING STATES
  // =================================

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
  // SAVED PROJECT
  // =================================

  const [
    currentProjectId,
    setCurrentProjectId,
  ] =
    useState<string | null>(
      null,
    );

  const [
    isSavingProject,
    setIsSavingProject,
  ] =
    useState(false);

  // =================================
  // LOAD SAVED PROJECT
  // =================================

  useEffect(() => {
    const timeoutId =
      window.setTimeout(() => {
        const projectToOpen =
          getProjectToOpen();

        const sessionProjectId =
          getSessionProjectId();

        const savedProject =
          projectToOpen ??
          (sessionProjectId
            ? getSavedProject(
                sessionProjectId,
              )
            : null);

        if (!savedProject) {
          return;
        }

        setCurrentProjectId(
          savedProject.id,
        );

        setSessionProjectId(
          savedProject.id,
        );

        setImagePreview(
          savedProject.imagePreview,
        );

        setProject(
          savedProject.project,
        );

        setGeneratedContent(
          savedProject.generatedContent,
        );

        setPreviewTitle(
          savedProject.previewTitle,
        );

        setPreviewSubtitle(
          savedProject.previewSubtitle,
        );

        setCaptionStyle(
          savedProject.captionStyle,
        );

        setCaptionSyncOffsetMs(
          savedProject.captionSyncOffsetMs,
        );

        setVoicePreset(
          savedProject.voicePreset,
        );

        setMusicTrack(
          savedProject.musicTrack,
        );

        setMusicVolume(
          savedProject.musicVolume,
        );

        setAutoDucking(
          savedProject.autoDucking,
        );

        setBrandingEnabled(
          savedProject.brandingEnabled,
        );

        setBrandLogo(
          savedProject.brandLogo,
        );

        setBrandingPosition(
          savedProject.brandingPosition,
        );

        setBrandingSize(
          savedProject.brandingSize,
        );

        setBrandingOpacity(
          savedProject.brandingOpacity,
        );

        setContentVersion(
          (current) =>
            current + 1,
        );
      }, 0);

    return () => {
      window.clearTimeout(
        timeoutId,
      );
    };
  }, []);

  // =================================
  // GENERATE VOICE FOR ONE SCENE
  // =================================

  const generateVoiceForScene =
    async (
      scene: Scene,
    ): Promise<Scene> => {
      const response =
        await fetch(
          "/api/generate-voice",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                text:
                  scene.script,

                voice:
                  voicePreset,
              }),
          },
        );

      if (!response.ok) {
        const errorData =
          await response.json();

        throw new Error(
          errorData.error ||
            `Could not generate voice for ${scene.title}.`,
        );
      }

      const data =
        await response.json();

      return {
        ...scene,

        audioUrl:
          data.audioUrl,

        audioDuration:
          Number(
            data.audioDuration,
          ),

        wordTimings:
          Array.isArray(
            data.wordTimings,
          )
            ? data.wordTimings
            : [],
      };
    };

  // =================================
  // GENERATE CONTENT
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

          throw new Error(
            errorData.error ||
              "Failed to generate content.",
          );
        }

        const data:
          GeneratedContent =
          await response.json();

        setGeneratedContent(
          data,
        );

        // New generation =
        // use new AI title/hook.
        setPreviewTitle(
          null,
        );

        setPreviewSubtitle(
          null,
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

        alert(
          error instanceof
          Error
            ? error.message
            : "Could not generate the content.",
        );
      } finally {
        setIsGenerating(
          false,
        );
      }
    };

  // =================================
  // REGENERATE ONE SCENE
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

          throw new Error(
            errorData.error ||
              "Failed to regenerate scene.",
          );
        }

        const regeneratedScene:
          Scene =
          await response.json();

        let updatedScene:
          Scene = {
          ...regeneratedScene,

          imageUrl:
            scene.imageUrl,
        };

        if (
          scene.audioUrl
        ) {
          updatedScene =
            await generateVoiceForScene(
              updatedScene,
            );
        }

        setGeneratedContent(
          (current) => {
            if (!current) {
              return current;
            }

            const newScenes =
              current.scenes.map(
                (
                  currentScene,
                ) =>
                  currentScene.id ===
                  scene.id
                    ? updatedScene
                    : currentScene,
              );

            return {
              ...current,

              scenes:
                rebuildTimeline(
                  newScenes,
                ),
            };
          },
        );
      } catch (error) {
        console.error(
          "Scene generation error:",
          error,
        );

        alert(
          error instanceof
          Error
            ? error.message
            : "Could not regenerate this scene.",
        );
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
  // GENERATE ALL VOICEOVERS
  // =================================

  const handleGenerateVoiceovers =
    async () => {
      if (
        !generatedContent ||
        generatedContent.scenes
          .length ===
          0
      ) {
        alert(
          "Generate your video script first.",
        );

        return;
      }

      try {
        setIsGeneratingVoice(
          true,
        );

        const updatedScenes:
          Scene[] = [];

        for (
          const scene
          of generatedContent.scenes
        ) {
          if (
            !scene.script.trim()
          ) {
            updatedScenes.push(
              scene,
            );

            continue;
          }

          const sceneWithVoice =
            await generateVoiceForScene(
              scene,
            );

          updatedScenes.push(
            sceneWithVoice,
          );
        }

        setGeneratedContent(
          (current) => {
            if (!current) {
              return current;
            }

            return {
              ...current,

              scenes:
                rebuildTimeline(
                  updatedScenes,
                ),
            };
          },
        );
      } catch (error) {
        console.error(
          "Voice generation error:",
          error,
        );

        alert(
          error instanceof
          Error
            ? error.message
            : "Could not generate voiceovers.",
        );
      } finally {
        setIsGeneratingVoice(
          false,
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

          const updatedScenes =
            current.scenes.map(
              (scene) =>
                scene.id ===
                sceneId
                  ? {
                      ...scene,
                      ...updates,
                    }
                  : scene,
            );

          return {
            ...current,

            scenes:
              rebuildTimeline(
                updatedScenes,
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
      if (!generatedContent) {
        return;
      }

      const oldScenes =
        generatedContent.scenes;

      const preparedScenes =
        updatedScenes.map(
          (scene) => {
            const previous =
              oldScenes.find(
                (item) =>
                  item.id ===
                  scene.id,
              );

            if (!previous) {
              return scene;
            }

            const scriptChanged =
              previous.script.trim() !==
              scene.script.trim();

            if (
              scriptChanged &&
              previous.audioUrl
            ) {
              return {
                ...scene,

                audioUrl:
                  undefined,

                audioDuration:
                  undefined,

                wordTimings:
                  undefined,
              };
            }

            return {
              ...scene,

              audioUrl:
                previous.audioUrl,

              audioDuration:
                previous.audioDuration,

              wordTimings:
                previous.wordTimings,
            };
          },
        );

      setGeneratedContent(
        (current) => {
          if (!current) {
            return current;
          }

          return {
            ...current,

            scenes:
              rebuildTimeline(
                preparedScenes,
              ),
          };
        },
      );

      // =================================
      // REGENERATE VOICE WHEN SCRIPT CHANGES
      // =================================

      const scenesToRegenerate =
        updatedScenes.filter(
          (scene) => {
            const previous =
              oldScenes.find(
                (item) =>
                  item.id ===
                  scene.id,
              );

            if (!previous) {
              return false;
            }

            return (
              Boolean(
                previous.audioUrl,
              ) &&
              previous.script.trim() !==
                scene.script.trim()
            );
          },
        );

      if (
        scenesToRegenerate.length ===
        0
      ) {
        return;
      }

      void (async () => {
        try {
          setIsGeneratingVoice(
            true,
          );

          const regeneratedVoices =
            new Map<
              number,
              Scene
            >();

          for (
            const scene
            of scenesToRegenerate
          ) {
            const withVoice =
              await generateVoiceForScene(
                scene,
              );

            regeneratedVoices.set(
              scene.id,
              withVoice,
            );
          }

          setGeneratedContent(
            (current) => {
              if (!current) {
                return current;
              }

              const mergedScenes =
                current.scenes.map(
                  (scene) => {
                    const regenerated =
                      regeneratedVoices.get(
                        scene.id,
                      );

                    if (
                      !regenerated
                    ) {
                      return scene;
                    }

                    return {
                      ...scene,

                      audioUrl:
                        regenerated.audioUrl,

                      audioDuration:
                        regenerated.audioDuration,

                      wordTimings:
                        regenerated.wordTimings,
                    };
                  },
                );

              return {
                ...current,

                scenes:
                  rebuildTimeline(
                    mergedScenes,
                  ),
              };
            },
          );
        } catch (error) {
          console.error(
            "Automatic voice regeneration error:",
            error,
          );

          alert(
            error instanceof
            Error
              ? error.message
              : "Could not update the voiceover.",
          );
        } finally {
          setIsGeneratingVoice(
            false,
          );
        }
      })();
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

            scenes:
              rebuildTimeline([
                ...current.scenes,
                scene,
              ]),
          };
        },
      );
    };

  // =================================
  // REORDER SCENE
  // =================================

  const handleMoveScene =
    (
      sceneId: number,

      direction:
        "up" | "down",
    ) => {
      setGeneratedContent(
        (current) => {
          if (!current) {
            return current;
          }

          const currentIndex =
            current.scenes.findIndex(
              (scene) =>
                scene.id ===
                sceneId,
            );

          if (
            currentIndex ===
            -1
          ) {
            return current;
          }

          const targetIndex =
            direction ===
            "up"
              ? currentIndex -
                1
              : currentIndex +
                1;

          if (
            targetIndex <
              0 ||
            targetIndex >=
              current.scenes
                .length
          ) {
            return current;
          }

          const reorderedScenes =
            [
              ...current.scenes,
            ];

          const [
            movedScene,
          ] =
            reorderedScenes.splice(
              currentIndex,
              1,
            );

          reorderedScenes.splice(
            targetIndex,
            0,
            movedScene,
          );

          return {
            ...current,

            scenes:
              rebuildTimeline(
                reorderedScenes,
              ),
          };
        },
      );

      /*
       * ScriptPanel currently has internal
       * selection state. Remounting keeps it
       * synchronized with the new order.
       */
      setContentVersion(
        (current) =>
          current + 1,
      );
    };

  // =================================
  // DELETE SCENE
  // =================================

  const handleDeleteScene =
    (
      sceneId: number,
    ) => {
      if (!generatedContent) {
        return;
      }

      if (
        generatedContent.scenes
          .length <=
        1
      ) {
        alert(
          "Your video needs at least one scene.",
        );

        return;
      }

      const sceneToDelete =
        generatedContent.scenes.find(
          (scene) =>
            scene.id ===
            sceneId,
        );

      if (!sceneToDelete) {
        return;
      }

      const confirmed =
        window.confirm(
          `Delete "${sceneToDelete.title}"?`,
        );

      if (!confirmed) {
        return;
      }

      setGeneratedContent(
        (current) => {
          if (!current) {
            return current;
          }

          const remainingScenes =
            current.scenes.filter(
              (scene) =>
                scene.id !==
                sceneId,
            );

          return {
            ...current,

            scenes:
              rebuildTimeline(
                remainingScenes,
              ),
          };
        },
      );

      setContentVersion(
        (current) =>
          current + 1,
      );
    };

  // =================================
  // SAVE PROJECT
  // =================================

  const handleSaveProject =
    () => {
      try {
        setIsSavingProject(
          true,
        );

        const existingProject =
          currentProjectId
            ? getSavedProject(
                currentProjectId,
              )
            : null;

        const now =
          new Date().toISOString();

        const projectName =
          (previewTitle ?? "").trim() ||
          generatedContent?.title.trim() ||
          project.videoPrompt
            .trim()
            .slice(0, 60) ||
          "Untitled Project";

        const projectId =
          existingProject?.id ??
          (typeof crypto !==
            "undefined" &&
          "randomUUID" in crypto
            ? crypto.randomUUID()
            : `project-${Date.now()}`);

        saveSavedProject({
          id: projectId,
          name: projectName,
          createdAt:
            existingProject?.createdAt ??
            now,
          updatedAt: now,
          imagePreview,
          project,
          generatedContent,
          previewTitle,
          previewSubtitle,
          captionStyle,
          captionSyncOffsetMs,
          voicePreset,
          musicTrack,
          musicVolume,
          autoDucking,
          brandingEnabled,
          brandLogo,
          brandingPosition,
          brandingSize,
          brandingOpacity,
        });

        setCurrentProjectId(
          projectId,
        );

        setSessionProjectId(
          projectId,
        );

        alert(
          existingProject
            ? "Project updated."
            : "Project saved.",
        );
      } catch (error) {
        console.error(
          "Save project error:",
          error,
        );

        alert(
          error instanceof Error
            ? error.message
            : "Could not save the project.",
        );
      } finally {
        setIsSavingProject(
          false,
        );
      }
    };

  // =================================
  // EXPORT VIDEO
  // =================================

  const handleExportVideo =
    async () => {
      if (
        !imagePreview ||
        !generatedContent ||
        generatedContent.scenes
          .length ===
          0
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
                }),
            },
          );

        if (!response.ok) {
          let message =
            "Could not export video.";

          try {
            const errorData =
              await response.json();

            message =
              errorData.error ||
              message;
          } catch {
            //
          }

          throw new Error(
            message,
          );
        }

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

        alert(
          error instanceof
          Error
            ? error.message
            : "Could not export video.",
        );
      } finally {
        setIsExporting(
          false,
        );
      }
    };

  // =================================
  // VIDEO INFO
  // =================================

  const totalVideoDuration =
    generatedContent
      ? roundTime(
          generatedContent.scenes.reduce(
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
          ),
        )
      : 0;

  const hasVoiceover =
    Boolean(
      generatedContent?.scenes.some(
        (scene) =>
          Boolean(
            scene.audioUrl,
          ),
      ),
    );

  // =================================
  // RENDER
  // =================================

  return (
    <div className="flex min-h-screen bg-[#f8f9fc]">
      <Sidebar />

      <div className="min-w-0 flex-1">
        <Header />

        <main className="mx-auto w-full max-w-[1800px] px-3 py-5 sm:px-4 md:px-5 lg:px-6 xl:px-7">
          {/* =================================
              HEADER
          ================================= */}

          <div className="mb-5 flex flex-col gap-3 sm:mb-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                Create AI Video
              </h1>

              <p className="mt-1 max-w-2xl text-sm text-slate-500 sm:text-base">
                Turn a photo and an idea into ready-to-post social content.
              </p>
            </div>

            <button
              type="button"
              onClick={
                handleSaveProject
              }
              disabled={
                isSavingProject
              }
              className="flex w-fit shrink-0 items-center gap-2 rounded-xl border border-violet-200 bg-white px-4 py-2.5 text-sm font-semibold text-violet-700 transition hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSavingProject ? (
                <LoaderCircle
                  size={16}
                  className="animate-spin"
                />
              ) : (
                <Save
                  size={16}
                />
              )}

              {currentProjectId
                ? "Save Changes"
                : "Save Project"}
            </button>
          </div>

          {/* =================================
              STEPS
          ================================= */}

          <div className="overflow-x-auto pb-1">
            <div className="min-w-[760px] lg:min-w-0">
              <StepProgress />
            </div>
          </div>

          {/* =================================
              MAIN EDITOR

              IMPORTANT:
              KEEP THIS SMALL UI.
              DO NOT CHANGE.
          ================================= */}

          <div className="mt-4 grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-[minmax(320px,1.05fr)_minmax(300px,0.82fr)_minmax(420px,1fr)]">
            {/* CREATOR */}

            <div className="min-w-0">
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
            </div>

            {/* VIDEO PREVIEW */}

            <div className="min-w-0">
              <VideoPreview
                imagePreview={
                  imagePreview
                }
                project={
                  project
                }
                generatedContent={
                  generatedContent
                }
                captionStyle={
                  captionStyle
                }
                captionSyncOffsetMs={
                  captionSyncOffsetMs
                }
                musicTrack={
                  musicTrack
                }
                musicVolume={
                  musicVolume
                }
                autoDucking={
                  autoDucking
                }
                brandingEnabled={
                  brandingEnabled
                }
                brandLogo={
                  brandLogo
                }
                brandingPosition={
                  brandingPosition
                }
                brandingSize={
                  brandingSize
                }
                brandingOpacity={
                  brandingOpacity
                }
                previewTitle={
                  previewTitle
                }
                setPreviewTitle={
                  setPreviewTitle
                }
                previewSubtitle={
                  previewSubtitle
                }
                setPreviewSubtitle={
                  setPreviewSubtitle
                }
              />
            </div>

            {/* SCRIPT */}

            <div className="min-w-0 sm:col-span-2 2xl:col-span-3">
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
          </div>

          {/* =================================
              FULL VIDEO
          ================================= */}

          {imagePreview &&
            generatedContent &&
            generatedContent.scenes
              .length >
              0 && (
              <section className="mt-5 min-w-0 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 lg:mt-6">
                {/* HEADER */}

                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-violet-600">
                      Full Video Preview
                    </p>

                    <h2 className="mt-1 truncate text-lg font-semibold text-slate-900 sm:text-xl">
                      {
                        generatedContent.title
                      }
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Watch all scenes together in sequence.
                    </p>

                    {hasVoiceover && (
                      <p className="mt-2 text-xs font-medium text-emerald-600">
                        Voiceover timing enabled
                      </p>
                    )}
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

                    {captionStyle ===
                      "none" && (
                      <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-500">
                        No Captions
                      </span>
                    )}

                    {musicTrack !==
                      "none" && (
                      <span className="rounded-full bg-fuchsia-50 px-3 py-1.5 text-xs font-medium text-fuchsia-700">
                        Music
                      </span>
                    )}

                    {brandingEnabled &&
                      brandLogo && (
                        <span className="rounded-full bg-cyan-50 px-3 py-1.5 text-xs font-medium text-cyan-700">
                          Branding
                        </span>
                      )}

                    <button
                      type="button"
                      onClick={
                        handleExportVideo
                      }
                      disabled={
                        isExporting
                      }
                      className={[
                        "flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition",

                        isExporting
                          ? "cursor-not-allowed bg-violet-400"
                          : "bg-violet-600 hover:bg-violet-700",
                      ].join(
                        " ",
                      )}
                    >
                      {isExporting ? (
                        <>
                          <LoaderCircle
                            size={17}
                            className="animate-spin"
                          />

                          Rendering MP4...
                        </>
                      ) : (
                        <>
                          <Download
                            size={17}
                          />

                          Export MP4
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* BODY */}

                <div className="mt-5 grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-[minmax(280px,360px)_minmax(0,1fr)]">
                  {/* PLAYER */}

                  <div className="mx-auto w-full max-w-[360px] xl:mx-0">
                    <FullVideoPlayer
                      imageUrl={
                        imagePreview
                      }
                      scenes={
                        generatedContent.scenes
                      }
                      captionStyle={
                        captionStyle
                      }
                      captionSyncOffsetMs={
                        captionSyncOffsetMs
                      }
                      musicTrack={
                        musicTrack
                      }
                      musicVolume={
                        musicVolume
                      }
                      autoDucking={
                        autoDucking
                      }
                      brandingEnabled={
                        brandingEnabled
                      }
                      brandLogo={
                        brandLogo
                      }
                      brandingPosition={
                        brandingPosition
                      }
                      brandingSize={
                        brandingSize
                      }
                      brandingOpacity={
                        brandingOpacity
                      }
                    />
                  </div>

                  {/* TIMELINE */}

                  <div className="min-w-0">
                    <div className="rounded-xl border border-slate-200 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Video Timeline
                          </p>

                          <p className="mt-1 text-[10px] text-slate-400">
                            Reorder or remove scenes
                          </p>
                        </div>
                      </div>

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
                              className="group flex gap-3 rounded-xl bg-slate-50 p-3 transition hover:bg-slate-100/80"
                            >
                              {/* NUMBER */}

                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-xs font-bold text-violet-700">
                                {
                                  index +
                                  1
                                }
                              </div>

                              {/* CONTENT */}

                              <div className="min-w-0 flex-1">
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                  <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold text-slate-800">
                                      {
                                        scene.title
                                      }
                                    </p>

                                    <span className="mt-1 block text-[10px] text-slate-400">
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

                                  {/* =================================
                                      REORDER + DELETE
                                  ================================= */}

                                  <div className="flex shrink-0 items-center gap-1">
                                    {/* MOVE UP */}

                                    <button
                                      type="button"
                                      title="Move scene up"
                                      disabled={
                                        index ===
                                        0
                                      }
                                      onClick={() =>
                                        handleMoveScene(
                                          scene.id,
                                          "up",
                                        )
                                      }
                                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-30"
                                    >
                                      <ArrowUp
                                        size={
                                          13
                                        }
                                      />
                                    </button>

                                    {/* MOVE DOWN */}

                                    <button
                                      type="button"
                                      title="Move scene down"
                                      disabled={
                                        index ===
                                        generatedContent
                                          .scenes
                                          .length -
                                          1
                                      }
                                      onClick={() =>
                                        handleMoveScene(
                                          scene.id,
                                          "down",
                                        )
                                      }
                                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-30"
                                    >
                                      <ArrowDown
                                        size={
                                          13
                                        }
                                      />
                                    </button>

                                    {/* DELETE */}

                                    <button
                                      type="button"
                                      title="Delete scene"
                                      onClick={() =>
                                        handleDeleteScene(
                                          scene.id,
                                        )
                                      }
                                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-rose-100 bg-white text-rose-400 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                                    >
                                      <Trash2
                                        size={
                                          13
                                        }
                                      />
                                    </button>
                                  </div>
                                </div>

                                {/* SCRIPT */}

                                <p className="mt-1 text-xs leading-5 text-slate-500">
                                  {
                                    scene.script
                                  }
                                </p>

                                {/* BADGES */}

                                <div className="mt-2 flex flex-wrap gap-2">
                                  {scene.motion && (
                                    <>
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
                                    </>
                                  )}

                                  {scene.transition && (
                                    <span className="rounded-full bg-amber-50 px-2 py-1 text-[10px] font-medium text-amber-700">
                                      {
                                        scene
                                          .transition
                                          .type
                                      }
                                    </span>
                                  )}

                                  {scene.audioUrl && (
                                    <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-medium text-emerald-700">
                                      Voice
                                    </span>
                                  )}

                                  {scene.wordTimings &&
                                    scene
                                      .wordTimings
                                      .length >
                                      0 && (
                                      <span className="rounded-full bg-cyan-50 px-2 py-1 text-[10px] font-medium text-cyan-700">
                                        Word Sync
                                      </span>
                                    )}
                                </div>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>

                    {/* =================================
                        SOCIAL CAPTION
                    ================================= */}

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
                  </div>
                </div>
              </section>
            )}

          {/* =================================
              EDITOR CONTROLS
          ================================= */}

          <div className="mt-4 min-w-0">
            <EditorControls
              captionStyle={
                captionStyle
              }
              setCaptionStyle={
                setCaptionStyle
              }
              captionSyncOffsetMs={
                captionSyncOffsetMs
              }
              setCaptionSyncOffsetMs={
                setCaptionSyncOffsetMs
              }
              voicePreset={
                voicePreset
              }
              setVoicePreset={
                setVoicePreset
              }
              onGenerateVoiceovers={
                handleGenerateVoiceovers
              }
              isGeneratingVoice={
                isGeneratingVoice
              }
              hasGeneratedContent={
                Boolean(
                  generatedContent?.scenes
                    .length,
                )
              }
              musicTrack={
                musicTrack
              }
              setMusicTrack={
                setMusicTrack
              }
              musicVolume={
                musicVolume
              }
              setMusicVolume={
                setMusicVolume
              }
              autoDucking={
                autoDucking
              }
              setAutoDucking={
                setAutoDucking
              }
              brandingEnabled={
                brandingEnabled
              }
              setBrandingEnabled={
                setBrandingEnabled
              }
              brandLogo={
                brandLogo
              }
              setBrandLogo={
                setBrandLogo
              }
              brandingPosition={
                brandingPosition
              }
              setBrandingPosition={
                setBrandingPosition
              }
              brandingSize={
                brandingSize
              }
              setBrandingSize={
                setBrandingSize
              }
              brandingOpacity={
                brandingOpacity
              }
              setBrandingOpacity={
                setBrandingOpacity
              }
            />
          </div>
        </main>
      </div>
    </div>
  );
}