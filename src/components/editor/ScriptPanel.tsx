"use client";

import {
  ImagePlus,
  Pencil,
  Plus,
  RefreshCw,
  Sparkles,
  Undo2,
  X,
} from "lucide-react";

import {
  ChangeEvent,
  useState,
} from "react";

import type {
  CameraMotion,
  GeneratedContent,
  MotionSpeed,
  Scene,
  TransitionType,
} from "@/app/page";

import ScenePlayer from "@/components/video/ScenePlayer";

type ScriptPanelProps = {
  generatedContent:
    | GeneratedContent
    | null;

  isGenerating: boolean;

  onRegenerate: () => void;

  imagePreview: string | null;

  onGenerateScene: (
    scene: Scene,
  ) => Promise<void>;

  isGeneratingScene: boolean;

  generatingSceneId:
    | number
    | null;

  onAddScene: (
    scene: Scene,
  ) => void;

  onUpdateScene: (
    sceneId: number,
    updates: Partial<Scene>,
  ) => void;

  onUpdateScenes: (
    scenes: Scene[],
  ) => void;
};

export default function ScriptPanel({
  generatedContent,
  isGenerating,
  onRegenerate,
  imagePreview,
  onGenerateScene,
  isGeneratingScene,
  generatingSceneId,
  onAddScene,
  onUpdateScene,
  onUpdateScenes,
}: ScriptPanelProps) {
  const [
    selectedSceneId,
    setSelectedSceneId,
  ] =
    useState<number | null>(
      null,
    );

  // =================================
  // EDIT PROMPT
  // =================================

  const [
    isEditingPrompt,
    setIsEditingPrompt,
  ] =
    useState(false);

  const [
    promptDraft,
    setPromptDraft,
  ] =
    useState("");

  // =================================
  // EDIT SCRIPT
  // =================================

  const [
    isEditingScript,
    setIsEditingScript,
  ] =
    useState(false);

  const [
    scriptDrafts,
    setScriptDrafts,
  ] =
    useState<
      Record<number, string>
    >({});

  // =================================
  // ADD SCENE
  // =================================

  const [
    isAddingScene,
    setIsAddingScene,
  ] =
    useState(false);

  const [
    newSceneTitle,
    setNewSceneTitle,
  ] =
    useState("");

  const [
    newSceneScript,
    setNewSceneScript,
  ] =
    useState("");

  const [
    newScenePrompt,
    setNewScenePrompt,
  ] =
    useState("");

  const [
    newSceneDuration,
    setNewSceneDuration,
  ] =
    useState(3);

  const [
    newSceneCamera,
    setNewSceneCamera,
  ] =
    useState<CameraMotion>(
      "zoom-in",
    );

  const [
    newSceneSpeed,
    setNewSceneSpeed,
  ] =
    useState<MotionSpeed>(
      "slow",
    );

  const [
    newSceneTransition,
    setNewSceneTransition,
  ] =
    useState<TransitionType>(
      "fade",
    );

  const [
    newTransitionDuration,
    setNewTransitionDuration,
  ] =
    useState(0.4);

  // =================================
  // SELECTED SCENE
  // =================================

  const selectedScene =
    generatedContent?.scenes.find(
      (scene) =>
        scene.id ===
        selectedSceneId,
    ) ?? null;

  // =================================
  // IMAGE UPLOAD
  // =================================

  const handleSceneImageUpload =
    (
      event:
        ChangeEvent<HTMLInputElement>,
      sceneId: number,
    ) => {
      const file =
        event.target.files?.[0];

      if (!file) {
        return;
      }

      const reader =
        new FileReader();

      reader.onload =
        () => {
          if (
            typeof reader.result ===
            "string"
          ) {
            onUpdateScene(
              sceneId,
              {
                imageUrl:
                  reader.result,
              },
            );
          }
        };

      reader.readAsDataURL(
        file,
      );

      event.target.value =
        "";
    };

  // =================================
  // EDIT PROMPT
  // =================================

  const handleOpenPromptEditor =
    () => {
      if (!selectedScene) {
        return;
      }

      setPromptDraft(
        selectedScene.visualPrompt,
      );

      setIsEditingPrompt(
        true,
      );
    };

  const handleSavePrompt =
    () => {
      if (!selectedScene) {
        return;
      }

      const cleanPrompt =
        promptDraft.trim();

      if (!cleanPrompt) {
        alert(
          "The visual prompt cannot be empty.",
        );

        return;
      }

      onUpdateScene(
        selectedScene.id,
        {
          visualPrompt:
            cleanPrompt,
        },
      );

      setIsEditingPrompt(
        false,
      );
    };

  // =================================
  // EDIT SCRIPT
  // =================================

  const handleOpenScriptEditor =
    () => {
      if (!generatedContent) {
        return;
      }

      const drafts:
        Record<
          number,
          string
        > = {};

      generatedContent.scenes.forEach(
        (scene) => {
          drafts[
            scene.id
          ] =
            scene.script;
        },
      );

      setScriptDrafts(
        drafts,
      );

      setIsEditingScript(
        true,
      );
    };

  const handleSaveScripts =
    () => {
      if (!generatedContent) {
        return;
      }

      const hasEmptyScript =
        generatedContent.scenes.some(
          (scene) => {
            const draft =
              scriptDrafts[
                scene.id
              ];

            return (
              draft !==
                undefined &&
              !draft.trim()
            );
          },
        );

      if (hasEmptyScript) {
        alert(
          "Scene scripts cannot be empty.",
        );

        return;
      }

      const updatedScenes =
        generatedContent.scenes.map(
          (scene) => ({
            ...scene,

            script:
              scriptDrafts[
                scene.id
              ]?.trim() ||
              scene.script,
          }),
        );

      onUpdateScenes(
        updatedScenes,
      );

      setIsEditingScript(
        false,
      );
    };

  // =================================
  // GENERATE SCENE
  // =================================

  const handleGenerateSelectedScene =
    async () => {
      if (!selectedScene) {
        return;
      }

      await onGenerateScene(
        selectedScene,
      );
    };

  // =================================
  // ADD SCENE
  // =================================

  const handleAddNewScene =
    () => {
      if (!generatedContent) {
        return;
      }

      const title =
        newSceneTitle.trim();

      const script =
        newSceneScript.trim();

      const visualPrompt =
        newScenePrompt.trim();

      if (
        !title ||
        !script ||
        !visualPrompt
      ) {
        alert(
          "Please complete the scene title, script and visual prompt.",
        );

        return;
      }

      const lastScene =
        generatedContent.scenes[
          generatedContent
            .scenes.length - 1
        ];

      const start =
        lastScene
          ? lastScene.end
          : 0;

      const end =
        start +
        newSceneDuration;

      const nextId =
        generatedContent
          .scenes.length > 0
          ? Math.max(
              ...generatedContent.scenes.map(
                (scene) =>
                  scene.id,
              ),
            ) + 1
          : 1;

      const newScene:
        Scene = {
        id:
          nextId,

        title,

        start,

        end,

        script,

        visualPrompt,

        motion: {
          camera:
            newSceneCamera,

          speed:
            newSceneSpeed,
        },

        transition: {
          type:
            newSceneTransition,

          duration:
            newTransitionDuration,
        },
      };

      onAddScene(
        newScene,
      );

      setSelectedSceneId(
        nextId,
      );

      setNewSceneTitle("");
      setNewSceneScript("");
      setNewScenePrompt("");

      setNewSceneDuration(
        3,
      );

      setNewSceneCamera(
        "zoom-in",
      );

      setNewSceneSpeed(
        "slow",
      );

      setNewSceneTransition(
        "fade",
      );

      setNewTransitionDuration(
        0.4,
      );

      setIsAddingScene(
        false,
      );
    };

  // =================================
  // LOADING
  // =================================

  if (isGenerating) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-50">
            <Sparkles
              size={26}
              className="text-violet-600"
            />
          </div>

          <h2 className="mt-4 text-lg font-semibold">
            Creating your content
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Building your script and
            scenes.
          </p>
        </div>
      </section>
    );
  }

  // =================================
  // EMPTY
  // =================================

  if (!generatedContent) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-50">
            <Sparkles
              size={24}
              className="text-violet-600"
            />
          </div>

          <h2 className="mt-4 text-base font-semibold">
            Your AI script will appear
            here
          </h2>

          <p className="mt-2 max-w-[280px] text-sm leading-6 text-slate-500">
            Upload an image, describe
            your video and generate
            your content.
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
        {/* =================================
            HEADER
        ================================= */}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h2 className="font-semibold text-slate-900">
              AI Script & Scenes
            </h2>

            <p className="mt-1 truncate text-xs text-slate-400">
              {
                generatedContent.title
              }
            </p>
          </div>

          <button
            type="button"
            onClick={
              onRegenerate
            }
            className="flex shrink-0 items-center justify-center gap-2 rounded-xl border border-violet-200 px-3 py-2 text-xs font-medium text-violet-700 transition hover:bg-violet-50"
          >
            <RefreshCw
              size={14}
            />

            Regenerate
          </button>
        </div>

        {/* =================================
            SCRIPT
        ================================= */}

        <div className="mt-4 rounded-xl border border-slate-200 p-4">
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-violet-600">
              Hook
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-700">
              {
                generatedContent.hook
              }
            </p>
          </div>

          <div className="space-y-4">
            {generatedContent.scenes.map(
              (
                scene,
                index,
              ) => (
                <div
                  key={
                    scene.id
                  }
                  className="border-t border-slate-100 pt-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      {index ===
                        0 && (
                        <span className="rounded-full bg-violet-100 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-violet-700">
                          Hook
                        </span>
                      )}

                      <p className="truncate text-sm font-semibold text-slate-800">
                        {
                          scene.title
                        }
                      </p>
                    </div>

                    <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-[10px] text-slate-500">
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

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {
                      scene.script
                    }
                  </p>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {scene.motion && (
                      <>
                        <span className="rounded-full bg-violet-50 px-2 py-1 text-[10px] font-medium text-violet-700">
                          {
                            scene
                              .motion
                              .camera
                          }
                        </span>

                        <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] text-slate-500">
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
                  </div>
                </div>
              ),
            )}
          </div>

          <button
            type="button"
            onClick={
              handleOpenScriptEditor
            }
            className="mt-5 flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-200"
          >
            <Pencil
              size={14}
            />

            Edit Script
          </button>
        </div>

        {/* =================================
            COMPACT SCENE PREVIEW
        ================================= */}

        <div className="mt-6">
          <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Scene Preview
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                Select a scene to edit
                its image and settings.
              </p>
            </div>

            <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-medium text-violet-700">
              {
                generatedContent.scenes
                  .length
              }{" "}
              scenes
            </span>
          </div>

          <div
            className="
              grid
              grid-cols-2
              gap-3
              sm:grid-cols-3
              md:grid-cols-4
              xl:grid-cols-5
              2xl:grid-cols-4
            "
          >
            {generatedContent.scenes.map(
              (
                scene,
                index,
              ) => {
                const sceneImage =
                  scene.imageUrl ||
                  imagePreview;

                const isSelected =
                  selectedSceneId ===
                  scene.id;

                return (
                  <div
                    key={
                      scene.id
                    }
                    className={[
                      "min-w-0 overflow-hidden rounded-xl border bg-white transition",

                      isSelected
                        ? "border-violet-500 ring-2 ring-violet-100"
                        : "border-slate-200 hover:border-violet-300",
                    ].join(
                      " ",
                    )}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedSceneId(
                          scene.id,
                        )
                      }
                      className="block w-full text-left"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                        {sceneImage ? (
                          <img
                            src={
                              sceneImage
                            }
                            alt={
                              scene.title
                            }
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-slate-300">
                            <ImagePlus
                              size={20}
                            />
                          </div>
                        )}

                        <div className="absolute left-2 top-2">
                          <span className="rounded-full bg-black/65 px-2 py-1 text-[9px] font-semibold text-white backdrop-blur">
                            {
                              index +
                              1
                            }
                          </span>
                        </div>

                        {scene.audioUrl && (
                          <div className="absolute right-2 top-2">
                            <span className="rounded-full bg-emerald-500/90 px-2 py-1 text-[8px] font-semibold text-white backdrop-blur">
                              VO
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-2.5">
                        <p className="line-clamp-1 text-[11px] font-semibold text-slate-800">
                          {
                            scene.title
                          }
                        </p>

                        <div className="mt-1 flex items-center justify-between gap-2">
                          <p className="text-[9px] text-slate-400">
                            {
                              scene.start
                            }
                            s–
                            {
                              scene.end
                            }
                            s
                          </p>

                          {scene.transition && (
                            <span className="truncate text-[8px] font-medium text-amber-600">
                              {
                                scene
                                  .transition
                                  .type
                              }
                            </span>
                          )}
                        </div>
                      </div>
                    </button>

                    <div className="border-t border-slate-100 p-2">
                      <label className="flex cursor-pointer items-center justify-center gap-1 rounded-lg border border-violet-200 bg-violet-50 px-2 py-1.5 text-[9px] font-medium text-violet-700 transition hover:bg-violet-100">
                        <ImagePlus
                          size={11}
                        />

                        {scene.imageUrl
                          ? "Replace"
                          : "Upload"}

                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(
                            event,
                          ) =>
                            handleSceneImageUpload(
                              event,
                              scene.id,
                            )
                          }
                        />
                      </label>

                      {scene.imageUrl && (
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateScene(
                              scene.id,
                              {
                                imageUrl:
                                  undefined,
                              },
                            )
                          }
                          className="mt-1 flex w-full items-center justify-center gap-1 rounded-lg px-2 py-1 text-[9px] font-medium text-slate-500 transition hover:bg-slate-50"
                        >
                          <Undo2
                            size={10}
                          />

                          Main image
                        </button>
                      )}
                    </div>
                  </div>
                );
              },
            )}

            {/* ADD SCENE */}

            <button
              type="button"
              onClick={() =>
                setIsAddingScene(
                  true,
                )
              }
              className="flex min-h-[150px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-3 text-center text-slate-500 transition hover:border-violet-400 hover:bg-violet-50 hover:text-violet-700"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white">
                <Plus
                  size={15}
                />
              </div>

              <p className="mt-2 text-[11px] font-semibold">
                Add Scene
              </p>
            </button>
          </div>
        </div>

        {/* =================================
            SELECTED SCENE
        ================================= */}

        {selectedScene && (
          <div className="mt-6 rounded-2xl border border-violet-200 bg-violet-50/40 p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-violet-600">
                  Selected Scene
                </p>

                <h3 className="mt-1 text-base font-semibold text-slate-900">
                  {
                    selectedScene.title
                  }
                </h3>
              </div>

              <span className="w-fit rounded-full bg-white px-2.5 py-1 text-[10px] text-slate-500">
                {
                  selectedScene.start
                }
                s–
                {
                  selectedScene.end
                }
                s
              </span>
            </div>

            {/* =================================
                COMPACT IMAGE
            ================================= */}

            <div className="mt-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold text-slate-600">
                  Scene Image
                </p>

                {selectedScene.imageUrl ? (
                  <span className="rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-medium text-emerald-700">
                    Custom image
                  </span>
                ) : (
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-[9px] font-medium text-slate-500">
                    Main image
                  </span>
                )}
              </div>

              <div className="mt-3 flex justify-center">
                <div className="w-full max-w-[420px] overflow-hidden rounded-xl border border-slate-200 bg-white">
                  {selectedScene.imageUrl ||
                  imagePreview ? (
                    <img
                      src={
                        selectedScene.imageUrl ||
                        imagePreview ||
                        ""
                      }
                      alt={
                        selectedScene.title
                      }
                      className="aspect-[4/3] w-full object-cover"
                    />
                  ) : (
                    <div className="flex aspect-[4/3] items-center justify-center text-slate-300">
                      <ImagePlus
                        size={28}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="mx-auto mt-3 grid max-w-[420px] gap-2 sm:grid-cols-2">
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-violet-200 bg-white px-4 py-2.5 text-xs font-medium text-violet-700 transition hover:bg-violet-50">
                  <ImagePlus
                    size={14}
                  />

                  {selectedScene.imageUrl
                    ? "Replace Image"
                    : "Upload Image"}

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(
                      event,
                    ) =>
                      handleSceneImageUpload(
                        event,
                        selectedScene.id,
                      )
                    }
                  />
                </label>

                <button
                  type="button"
                  disabled={
                    !selectedScene.imageUrl
                  }
                  onClick={() =>
                    onUpdateScene(
                      selectedScene.id,
                      {
                        imageUrl:
                          undefined,
                      },
                    )
                  }
                  className={[
                    "flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-medium transition",

                    selectedScene.imageUrl
                      ? "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      : "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300",
                  ].join(
                    " ",
                  )}
                >
                  <Undo2
                    size={13}
                  />

                  Use Main Image
                </button>
              </div>
            </div>

            {/* =================================
                VOICEOVER STATUS
            ================================= */}

            {selectedScene.audioUrl && (
              <div className="mx-auto mt-5 max-w-[620px] rounded-xl border border-emerald-100 bg-emerald-50 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold text-emerald-700">
                      Voiceover Ready
                    </p>

                    <p className="mt-1 text-[10px] text-emerald-600">
                      Audio synced to this
                      scene.
                    </p>
                  </div>

                  {selectedScene.audioDuration && (
                    <span className="rounded-full bg-white px-2 py-1 text-[10px] font-medium text-emerald-700">
                      {
                        selectedScene.audioDuration.toFixed(
                          2,
                        )
                      }
                      s
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* =================================
                TRANSITION
            ================================= */}

            <div className="mx-auto mt-5 max-w-[620px] rounded-xl border border-amber-100 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">
                Scene Transition
              </p>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-medium text-slate-600">
                    Transition
                  </label>

                  <select
                    value={
                      selectedScene
                        .transition
                        ?.type ??
                      "cut"
                    }
                    onChange={(
                      event,
                    ) =>
                      onUpdateScene(
                        selectedScene.id,
                        {
                          transition: {
                            type:
                              event
                                .target
                                .value as TransitionType,

                            duration:
                              selectedScene
                                .transition
                                ?.duration ??
                              0.4,
                          },
                        },
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs outline-none focus:border-violet-400"
                  >
                    <option value="cut">
                      Cut
                    </option>

                    <option value="fade">
                      Fade
                    </option>

                    <option value="dissolve">
                      Dissolve
                    </option>

                    <option value="slide-left">
                      Slide Left
                    </option>

                    <option value="slide-right">
                      Slide Right
                    </option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-medium text-slate-600">
                    Duration
                  </label>

                  <select
                    value={
                      selectedScene
                        .transition
                        ?.duration ??
                      0.4
                    }
                    onChange={(
                      event,
                    ) =>
                      onUpdateScene(
                        selectedScene.id,
                        {
                          transition: {
                            type:
                              selectedScene
                                .transition
                                ?.type ??
                              "fade",

                            duration:
                              Number(
                                event
                                  .target
                                  .value,
                              ),
                          },
                        },
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs outline-none focus:border-violet-400"
                  >
                    <option value="0.2">
                      0.2 sec
                    </option>

                    <option value="0.3">
                      0.3 sec
                    </option>

                    <option value="0.4">
                      0.4 sec
                    </option>

                    <option value="0.5">
                      0.5 sec
                    </option>

                    <option value="0.6">
                      0.6 sec
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {/* =================================
                VISUAL PROMPT
            ================================= */}

            <div className="mx-auto mt-5 max-w-[620px]">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Visual Prompt
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-700">
                {
                  selectedScene.visualPrompt
                }
              </p>
            </div>

            {/* =================================
                MOTION TAGS
            ================================= */}

            <div className="mx-auto mt-3 flex max-w-[620px] flex-wrap gap-2">
              {selectedScene.motion && (
                <>
                  <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-medium text-violet-700">
                    Camera:{" "}
                    {
                      selectedScene
                        .motion.camera
                    }
                  </span>

                  <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-medium text-slate-600">
                    Speed:{" "}
                    {
                      selectedScene
                        .motion.speed
                    }
                  </span>
                </>
              )}

              {selectedScene.transition && (
                <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-medium text-amber-700">
                  Transition:{" "}
                  {
                    selectedScene
                      .transition.type
                  }
                </span>
              )}
            </div>

            {/* =================================
                MOTION PREVIEW
            ================================= */}

            {(selectedScene.imageUrl ||
              imagePreview) && (
              <div className="mx-auto mt-5 max-w-[280px]">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Scene Motion Preview
                </p>

                <ScenePlayer
                  imageUrl={
                    selectedScene.imageUrl ||
                    imagePreview ||
                    ""
                  }
                  title={
                    selectedScene.title
                  }
                  script={
                    selectedScene.script
                  }
                  durationSeconds={
                    Math.max(
                      1,

                      selectedScene.end -
                        selectedScene.start,
                    )
                  }
                  motion={
                    selectedScene.motion
                  }
                />
              </div>
            )}

            {/* =================================
                ACTIONS
            ================================= */}

            <div className="mx-auto mt-4 flex max-w-[620px] flex-wrap gap-2">
              <button
                type="button"
                onClick={
                  handleGenerateSelectedScene
                }
                disabled={
                  isGeneratingScene
                }
                className="rounded-lg bg-violet-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-violet-700 disabled:opacity-60"
              >
                {generatingSceneId ===
                selectedScene.id
                  ? "Generating..."
                  : "Generate Scene"}
              </button>

              <button
                type="button"
                onClick={
                  handleOpenPromptEditor
                }
                disabled={
                  isGeneratingScene
                }
                className="flex items-center gap-2 rounded-lg border border-violet-200 bg-white px-3 py-2 text-xs font-medium text-violet-700 transition hover:bg-violet-50 disabled:opacity-50"
              >
                <Pencil
                  size={13}
                />

                Edit Prompt
              </button>
            </div>
          </div>
        )}

        {/* =================================
            SOCIAL CAPTION
        ================================= */}

        <div className="mt-5 rounded-xl bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Social Caption
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
                  className="rounded-full bg-violet-50 px-2.5 py-1 text-[11px] font-medium text-violet-700"
                >
                  {hashtag}
                </span>
              ),
            )}
          </div>
        </div>
      </section>

      {/* =================================
          EDIT SCRIPT MODAL
      ================================= */}

      {isEditingScript && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-[680px] overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-violet-600">
                  Edit Script
                </p>

                <h3 className="mt-1 text-lg font-semibold text-slate-900">
                  Edit your video script
                </h3>
              </div>

              <button
                type="button"
                onClick={() =>
                  setIsEditingScript(
                    false,
                  )
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X
                  size={18}
                />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              {generatedContent.scenes.map(
                (
                  scene,
                  index,
                ) => (
                  <div
                    key={
                      scene.id
                    }
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-800">
                        Scene{" "}
                        {
                          index +
                          1
                        }
                        :{" "}
                        {
                          scene.title
                        }
                      </p>

                      <span className="text-[10px] text-slate-400">
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

                    <textarea
                      value={
                        scriptDrafts[
                          scene.id
                        ] ?? ""
                      }
                      onChange={(
                        event,
                      ) =>
                        setScriptDrafts(
                          (
                            current,
                          ) => ({
                            ...current,

                            [scene.id]:
                              event
                                .target
                                .value,
                          }),
                        )
                      }
                      className="mt-3 min-h-[100px] w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                    />
                  </div>
                ),
              )}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() =>
                  setIsEditingScript(
                    false,
                  )
                }
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  handleSaveScripts
                }
                className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"
              >
                Save Script
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================
          EDIT PROMPT MODAL
      ================================= */}

      {isEditingPrompt &&
        selectedScene && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
            <div className="w-full max-w-[620px] rounded-2xl bg-white p-5 shadow-2xl">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-violet-600">
                    Edit Visual Prompt
                  </p>

                  <h3 className="mt-1 text-lg font-semibold text-slate-900">
                    {
                      selectedScene.title
                    }
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setIsEditingPrompt(
                      false,
                    )
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"
                >
                  <X
                    size={18}
                  />
                </button>
              </div>

              <textarea
                value={
                  promptDraft
                }
                onChange={(
                  event,
                ) =>
                  setPromptDraft(
                    event.target
                      .value,
                  )
                }
                className="mt-5 min-h-[220px] w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
              />

              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setIsEditingPrompt(
                      false,
                    )
                  }
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={
                    handleSavePrompt
                  }
                  className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"
                >
                  Save Prompt
                </button>
              </div>
            </div>
          </div>
        )}

      {/* =================================
          ADD SCENE MODAL
      ================================= */}

      {isAddingScene && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-[620px] overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-violet-600">
                  Add Scene
                </p>

                <h3 className="mt-1 text-lg font-semibold text-slate-900">
                  Create a new scene
                </h3>
              </div>

              <button
                type="button"
                onClick={() =>
                  setIsAddingScene(
                    false,
                  )
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X
                  size={18}
                />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Scene Title
                </label>

                <input
                  value={
                    newSceneTitle
                  }
                  onChange={(
                    event,
                  ) =>
                    setNewSceneTitle(
                      event.target
                        .value,
                    )
                  }
                  placeholder="Final product reveal"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Script
                </label>

                <textarea
                  value={
                    newSceneScript
                  }
                  onChange={(
                    event,
                  ) =>
                    setNewSceneScript(
                      event.target
                        .value,
                    )
                  }
                  placeholder="Write the dialogue for this scene..."
                  className="min-h-[100px] w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Visual Prompt
                </label>

                <textarea
                  value={
                    newScenePrompt
                  }
                  onChange={(
                    event,
                  ) =>
                    setNewScenePrompt(
                      event.target
                        .value,
                    )
                  }
                  placeholder="Describe how the scene should look..."
                  className="min-h-[130px] w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Duration
                </label>

                <select
                  value={
                    newSceneDuration
                  }
                  onChange={(
                    event,
                  ) =>
                    setNewSceneDuration(
                      Number(
                        event.target
                          .value,
                      ),
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                >
                  <option value="2">
                    2 sec
                  </option>

                  <option value="3">
                    3 sec
                  </option>

                  <option value="4">
                    4 sec
                  </option>

                  <option value="5">
                    5 sec
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Camera Motion
                </label>

                <select
                  value={
                    newSceneCamera
                  }
                  onChange={(
                    event,
                  ) =>
                    setNewSceneCamera(
                      event.target
                        .value as CameraMotion,
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                >
                  <option value="zoom-in">
                    Zoom In
                  </option>

                  <option value="zoom-out">
                    Zoom Out
                  </option>

                  <option value="pan-left">
                    Pan Left
                  </option>

                  <option value="pan-right">
                    Pan Right
                  </option>

                  <option value="static">
                    Static
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Motion Speed
                </label>

                <select
                  value={
                    newSceneSpeed
                  }
                  onChange={(
                    event,
                  ) =>
                    setNewSceneSpeed(
                      event.target
                        .value as MotionSpeed,
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                >
                  <option value="slow">
                    Slow
                  </option>

                  <option value="medium">
                    Medium
                  </option>

                  <option value="fast">
                    Fast
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Transition
                </label>

                <select
                  value={
                    newSceneTransition
                  }
                  onChange={(
                    event,
                  ) =>
                    setNewSceneTransition(
                      event.target
                        .value as TransitionType,
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                >
                  <option value="cut">
                    Cut
                  </option>

                  <option value="fade">
                    Fade
                  </option>

                  <option value="dissolve">
                    Dissolve
                  </option>

                  <option value="slide-left">
                    Slide Left
                  </option>

                  <option value="slide-right">
                    Slide Right
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Transition Duration
                </label>

                <select
                  value={
                    newTransitionDuration
                  }
                  onChange={(
                    event,
                  ) =>
                    setNewTransitionDuration(
                      Number(
                        event.target
                          .value,
                      ),
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                >
                  <option value="0.2">
                    0.2 sec
                  </option>

                  <option value="0.3">
                    0.3 sec
                  </option>

                  <option value="0.4">
                    0.4 sec
                  </option>

                  <option value="0.5">
                    0.5 sec
                  </option>

                  <option value="0.6">
                    0.6 sec
                  </option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() =>
                  setIsAddingScene(
                    false,
                  )
                }
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  handleAddNewScene
                }
                className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"
              >
                Add Scene
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}