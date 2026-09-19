"use client";

import {
  Pencil,
  Plus,
  RefreshCw,
  Sparkles,
  X,
} from "lucide-react";

import {
  useState,
} from "react";

import type {
  CameraMotion,
  GeneratedContent,
  MotionSpeed,
  Scene,
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
  // OPEN PROMPT EDITOR
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

  // =================================
  // SAVE PROMPT
  // =================================

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
  // OPEN SCRIPT EDITOR
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

  // =================================
  // SAVE SCRIPTS
  // =================================

  const handleSaveScripts =
    () => {
      if (!generatedContent) {
        return;
      }

      const hasEmptyScript =
        generatedContent.scenes.some(
          (scene) => {
            const value =
              scriptDrafts[
                scene.id
              ];

            return (
              value !== undefined &&
              !value.trim()
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
  // GENERATE SELECTED SCENE
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
  // ADD NEW SCENE
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
          generatedContent.scenes.length -
            1
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
        id: nextId,
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
        <div className="flex min-h-[520px] flex-col items-center justify-center text-center">
          <div className="relative mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-50">
              <Sparkles
                size={28}
                className="text-violet-600"
              />
            </div>

            <div className="absolute inset-0 animate-ping rounded-full border border-violet-300 opacity-30" />
          </div>

          <h2 className="text-lg font-semibold">
            Creating your content
          </h2>

          <p className="mt-2 max-w-[280px] text-sm leading-6 text-slate-500">
            Creora is analyzing your
            idea and preparing your
            social video.
          </p>

          <div className="mt-7 w-full max-w-[320px] space-y-3 text-left">
            <GeneratingStep
              label="Analyzing your idea"
              delay="0ms"
            />

            <GeneratingStep
              label="Writing the hook"
              delay="250ms"
            />

            <GeneratingStep
              label="Building the scenes"
              delay="500ms"
            />

            <GeneratingStep
              label="Preparing social caption"
              delay="750ms"
            />
          </div>

          <div className="mt-7 h-1.5 w-full max-w-[320px] overflow-hidden rounded-full bg-slate-100">
            <div className="h-full w-2/3 animate-pulse rounded-full bg-violet-500" />
          </div>
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
        <div className="flex min-h-[520px] flex-col items-center justify-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-violet-50 text-2xl">
            ✨
          </div>

          <h2 className="text-base font-semibold">
            Your AI script will appear
            here
          </h2>

          <p className="mt-2 max-w-[260px] text-sm leading-6 text-slate-500">
            Add your creator details
            and video idea, then click
            Generate Video.
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        {/* HEADER */}

        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold">
              AI Script & Scenes
            </h2>

            <p className="mt-1 text-xs text-slate-400">
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
            className="flex items-center gap-2 rounded-xl border border-violet-200 px-3 py-2 text-xs font-medium text-violet-700 transition hover:bg-violet-50"
          >
            <RefreshCw
              size={14}
            />

            Regenerate
          </button>
        </div>

        {/* TABS */}

        <div className="mt-4 flex gap-1 rounded-xl bg-slate-50 p-1">
          {[
            "Script",
            `Scenes (${generatedContent.scenes.length})`,
            "Captions",
            "Music",
          ].map(
            (
              tab,
              index,
            ) => (
              <button
                type="button"
                key={tab}
                className={[
                  "flex-1 rounded-lg px-2 py-2 text-xs",

                  index === 0
                    ? "bg-white font-medium text-violet-700 shadow-sm"
                    : "text-slate-500",
                ].join(" ")}
              >
                {tab}
              </button>
            ),
          )}
        </div>

        {/* SCRIPT */}

        <div className="mt-4 rounded-xl border border-slate-200 p-4">
          <div className="mb-4">
            <p className="text-xs font-medium uppercase tracking-wide text-violet-600">
              Hook
            </p>

            <p className="mt-1 text-sm leading-6 text-slate-700">
              {
                generatedContent.hook
              }
            </p>
          </div>

          <div className="space-y-4">
            {generatedContent.scenes.map(
              (scene) => (
                <div
                  key={
                    scene.id
                  }
                  className="border-t border-slate-100 pt-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-800">
                      {
                        scene.title
                      }
                    </p>

                    <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] text-slate-500">
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

                  {scene.motion && (
                    <div className="mt-2 flex gap-2">
                      <span className="rounded-full bg-violet-50 px-2 py-1 text-[10px] font-medium text-violet-700">
                        {
                          scene.motion
                            .camera
                        }
                      </span>

                      <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] text-slate-500">
                        {
                          scene.motion
                            .speed
                        }
                      </span>
                    </div>
                  )}
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

        {/* SCENE PREVIEW */}

        <div className="mt-5">
          <h3 className="mb-3 text-sm font-semibold">
            Scene Preview
          </h3>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {generatedContent.scenes.map(
              (scene) => (
                <button
                  type="button"
                  key={
                    scene.id
                  }
                  onClick={() =>
                    setSelectedSceneId(
                      scene.id,
                    )
                  }
                  className={[
                    "w-[96px] shrink-0 rounded-xl text-left transition",

                    selectedSceneId ===
                    scene.id
                      ? "ring-2 ring-violet-500 ring-offset-2"
                      : "opacity-80 hover:opacity-100",
                  ].join(" ")}
                >
                  <div className="flex aspect-[9/12] items-end overflow-hidden rounded-xl bg-gradient-to-b from-violet-100 via-rose-100 to-slate-800 p-2">
                    <p className="line-clamp-3 text-[10px] font-medium leading-4 text-white">
                      {
                        scene.script
                      }
                    </p>
                  </div>

                  <p className="mt-2 text-[11px] font-semibold">
                    {
                      scene.title
                    }
                  </p>

                  <p className="text-[10px] text-slate-400">
                    {
                      scene.start
                    }
                    s–
                    {
                      scene.end
                    }
                    s
                  </p>
                </button>
              ),
            )}

            <button
              type="button"
              onClick={() =>
                setIsAddingScene(
                  true,
                )
              }
              className="flex aspect-[9/12] w-[96px] shrink-0 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 text-xs text-slate-500 transition hover:border-violet-400 hover:bg-violet-50 hover:text-violet-700"
            >
              <Plus
                size={20}
                className="mb-2"
              />

              Add Scene
            </button>
          </div>
        </div>

        {/* SELECTED SCENE */}

        {selectedScene && (
          <div className="mt-5 rounded-xl border border-violet-200 bg-violet-50/50 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-violet-600">
                  Visual Prompt
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {
                    selectedScene.title
                  }
                </p>
              </div>

              <span className="rounded-full bg-white px-2.5 py-1 text-[10px] text-slate-500">
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

            <p className="mt-3 text-sm leading-6 text-slate-700">
              {
                selectedScene.visualPrompt
              }
            </p>

            {selectedScene.motion && (
              <div className="mt-3 flex flex-wrap gap-2">
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
              </div>
            )}

            {imagePreview && (
              <div className="mt-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Scene Motion Preview
                </p>

                <div className="mx-auto max-w-[280px]">
                  <ScenePlayer
                    imageUrl={
                      imagePreview
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
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={
                  handleGenerateSelectedScene
                }
                disabled={
                  isGeneratingScene
                }
                className={[
                  "rounded-lg bg-violet-600 px-3 py-2 text-xs font-medium text-white",

                  isGeneratingScene
                    ? "cursor-not-allowed opacity-60"
                    : "hover:bg-violet-700",
                ].join(" ")}
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
                className="flex items-center gap-2 rounded-lg border border-violet-200 bg-white px-3 py-2 text-xs font-medium text-violet-700 hover:bg-violet-50"
              >
                <Pencil
                  size={13}
                />

                Edit Prompt
              </button>
            </div>
          </div>
        )}

        {/* SOCIAL CAPTION */}

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

      {/* EDIT SCRIPT MODAL */}

      {isEditingScript && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-[680px] overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase text-violet-600">
                  Edit Script
                </p>

                <h3 className="mt-1 text-lg font-semibold">
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
              >
                <X
                  size={18}
                />
              </button>
            </div>

            <div className="mt-5 space-y-5">
              {generatedContent.scenes.map(
                (scene) => (
                  <div
                    key={
                      scene.id
                    }
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <p className="text-sm font-semibold">
                      {
                        scene.title
                      }
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {
                        scene.start
                      }
                      s–
                      {
                        scene.end
                      }
                      s
                    </p>

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
                      className="mt-3 min-h-[100px] w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
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
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  handleSaveScripts
                }
                className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white"
              >
                Save Script
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT PROMPT MODAL */}

      {isEditingPrompt &&
        selectedScene && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
            <div className="w-full max-w-[620px] rounded-2xl bg-white p-5 shadow-2xl">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase text-violet-600">
                    Edit Visual Prompt
                  </p>

                  <h3 className="mt-1 text-lg font-semibold">
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
                    event.target.value,
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
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={
                    handleSavePrompt
                  }
                  className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white"
                >
                  Save Prompt
                </button>
              </div>
            </div>
          </div>
        )}

      {/* ADD SCENE MODAL */}

      {isAddingScene && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-[620px] overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase text-violet-600">
                  Add Scene
                </p>

                <h3 className="mt-1 text-lg font-semibold">
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
              >
                <X
                  size={18}
                />
              </button>
            </div>

            <div className="mt-5 space-y-5">
              <input
                value={
                  newSceneTitle
                }
                onChange={(
                  event,
                ) =>
                  setNewSceneTitle(
                    event.target.value,
                  )
                }
                placeholder="Scene title"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
              />

              <textarea
                value={
                  newSceneScript
                }
                onChange={(
                  event,
                ) =>
                  setNewSceneScript(
                    event.target.value,
                  )
                }
                placeholder="Scene script"
                className="min-h-[100px] w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
              />

              <textarea
                value={
                  newScenePrompt
                }
                onChange={(
                  event,
                ) =>
                  setNewScenePrompt(
                    event.target.value,
                  )
                }
                placeholder="Visual prompt"
                className="min-h-[150px] w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
              />

              <div>
                <p className="mb-2 text-sm font-semibold">
                  Duration
                </p>

                <div className="flex gap-2">
                  {[
                    2,
                    3,
                    4,
                    5,
                  ].map(
                    (
                      duration,
                    ) => (
                      <button
                        key={
                          duration
                        }
                        type="button"
                        onClick={() =>
                          setNewSceneDuration(
                            duration,
                          )
                        }
                        className={[
                          "rounded-xl border px-4 py-2 text-xs",

                          newSceneDuration ===
                          duration
                            ? "border-violet-500 bg-violet-50 text-violet-700"
                            : "border-slate-200",
                        ].join(" ")}
                      >
                        {
                          duration
                        }
                        s
                      </button>
                    ),
                  )}
                </div>
              </div>

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
                className="w-full rounded-xl border border-slate-200 px-4 py-3"
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
                className="w-full rounded-xl border border-slate-200 px-4 py-3"
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

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() =>
                  setIsAddingScene(
                    false,
                  )
                }
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  handleAddNewScene
                }
                className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white"
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

function GeneratingStep({
  label,
  delay,
}: {
  label: string;
  delay: string;
}) {
  return (
    <div
      className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
      style={{
        animationDelay:
          delay,
      }}
    >
      <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-violet-500" />

      <span className="text-sm text-slate-600">
        {label}
      </span>
    </div>
  );
}