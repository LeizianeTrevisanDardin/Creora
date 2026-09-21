"use client";

import {
  Camera,
  Play,
  Sparkles,
  Upload,
} from "lucide-react";

import Image from "next/image";

import type {
  VideoProject,
} from "@/app/page";

import {
  ChangeEvent,
} from "react";

type CreatorInputPanelProps = {
  imagePreview: string | null;

  setImagePreview: (
    image: string | null,
  ) => void;

  project: VideoProject;

  setProject: React.Dispatch<
    React.SetStateAction<VideoProject>
  >;

  onGenerate: () => void;

  isGenerating: boolean;
};

export default function CreatorInputPanel({
  imagePreview,
  setImagePreview,
  project,
  setProject,
  onGenerate,
  isGenerating,
}: CreatorInputPanelProps) {
  const handleImageUpload = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader =
      new FileReader();

    reader.onload = () => {
      if (
        typeof reader.result ===
        "string"
      ) {
        setImagePreview(
          reader.result,
        );
      }
    };

    reader.readAsDataURL(
      file,
    );
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_18px_rgba(20,20,43,0.03)]">
      <div>
        <h3 className="mb-3 text-sm font-semibold">
          1. Upload your photo
        </h3>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gradient-to-br from-amber-100 via-rose-100 to-violet-100">
            {imagePreview ? (
              <Image
                src={
                  imagePreview
                }
                alt="Creator preview"
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/80 text-2xl">
                    👩🏻
                  </div>

                  <p className="mt-3 text-xs font-medium text-slate-700">
                    Creator preview
                  </p>
                </div>
              </div>
            )}
          </div>

          <label className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white transition hover:border-violet-400 hover:bg-violet-50">
            <Upload
              size={23}
              className="mb-2 text-violet-600"
            />

            <span className="text-sm font-semibold">
              Upload a photo
            </span>

            <span className="mt-1 text-xs text-slate-400">
              JPG, PNG • Max 10MB
            </span>

            <input
              type="file"
              accept="image/png,image/jpeg"
              className="hidden"
              onChange={
                handleImageUpload
              }
            />
          </label>
        </div>
      </div>

      <div className="mt-5">
        <label className="mb-2 block text-sm font-semibold">
          2. Describe your creator
        </label>

        <div className="relative">
          <textarea
            value={
              project.creatorDescription
            }
            onChange={(event) =>
              setProject(
                (current) => ({
                  ...current,

                  creatorDescription:
                    event.target.value,
                }),
              )
            }
            maxLength={500}
            className="min-h-[100px] w-full resize-none rounded-xl border border-slate-200 px-4 py-3 pb-7 text-sm leading-6 outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
          />

          <span className="absolute bottom-3 right-3 text-[11px] text-slate-400">
            {
              project
                .creatorDescription
                .length
            }
            /500
          </span>
        </div>
      </div>

      <div className="mt-5">
        <label className="mb-2 block text-sm font-semibold">
          3. What should the video be about?
        </label>

        <div className="relative">
          <textarea
            value={
              project.videoPrompt
            }
            onChange={(event) =>
              setProject(
                (current) => ({
                  ...current,

                  videoPrompt:
                    event.target.value,
                }),
              )
            }
            maxLength={500}
            className="min-h-[88px] w-full resize-none rounded-xl border border-slate-200 px-4 py-3 pb-7 text-sm leading-6 outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
          />

          <span className="absolute bottom-3 right-3 text-[11px] text-slate-400">
            {
              project
                .videoPrompt
                .length
            }
            /500
          </span>
        </div>
      </div>

      <div className="mt-5">
        <p className="mb-3 text-sm font-semibold">
          4. Platform
        </p>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <button
            type="button"
            onClick={() =>
              setProject(
                (current) => ({
                  ...current,

                  platform:
                    "tiktok",
                }),
              )
            }
            className={[
              "flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-xs font-medium transition",

              project.platform ===
              "tiktok"
                ? "border-violet-500 bg-violet-50 text-violet-700"
                : "border-slate-200 hover:bg-slate-50",
            ].join(" ")}
          >
            <span className="text-base">
              ♪
            </span>

            TikTok
          </button>

          <button
            type="button"
            onClick={() =>
              setProject(
                (current) => ({
                  ...current,

                  platform:
                    "instagram",
                }),
              )
            }
            className={[
              "flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-xs font-medium transition",

              project.platform ===
              "instagram"
                ? "border-violet-500 bg-violet-50 text-violet-700"
                : "border-slate-200 hover:bg-slate-50",
            ].join(" ")}
          >
            <Camera
              size={16}
            />

            Instagram
          </button>

          <button
            type="button"
            onClick={() =>
              setProject(
                (current) => ({
                  ...current,

                  platform:
                    "youtube",
                }),
              )
            }
            className={[
              "flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-xs font-medium transition",

              project.platform ===
              "youtube"
                ? "border-violet-500 bg-violet-50 text-violet-700"
                : "border-slate-200 hover:bg-slate-50",
            ].join(" ")}
          >
            <Play
              size={16}
            />

            YouTube
          </button>

          <button
            type="button"
            onClick={() =>
              setProject(
                (current) => ({
                  ...current,

                  platform:
                    "other",
                }),
              )
            }
            className={[
              "rounded-xl border px-3 py-3 text-xs font-medium transition",

              project.platform ===
              "other"
                ? "border-violet-500 bg-violet-50 text-violet-700"
                : "border-slate-200 hover:bg-slate-50",
            ].join(" ")}
          >
            ••• Other
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <div>
          <p className="mb-3 text-sm font-semibold">
            5. Video length
          </p>

          <div className="flex gap-2">
            {[
              10,
              15,
              30,
            ].map(
              (item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() =>
                    setProject(
                      (current) => ({
                        ...current,

                        duration:
                          item as
                            | 10
                            | 15
                            | 30,
                      }),
                    )
                  }
                  className={[
                    "rounded-xl border px-4 py-2.5 text-xs font-medium",

                    project.duration ===
                    item
                      ? "border-violet-500 bg-violet-50 text-violet-700"
                      : "border-slate-200",
                  ].join(" ")}
                >
                  {item} sec
                </button>
              ),
            )}
          </div>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold">
            6. Style
          </p>

          <div className="flex flex-wrap gap-2">
            {[
              {
                value:
                  "ugc",

                label:
                  "UGC",
              },
              {
                value:
                  "cinematic",

                label:
                  "Cinematic",
              },
              {
                value:
                  "lifestyle",

                label:
                  "Lifestyle",
              },
              {
                value:
                  "product-demo",

                label:
                  "Product Demo",
              },
            ].map(
              (item) => (
                <button
                  type="button"
                  key={
                    item.value
                  }
                  onClick={() =>
                    setProject(
                      (current) => ({
                        ...current,

                        style:
                          item.value as VideoProject["style"],
                      }),
                    )
                  }
                  className={[
                    "rounded-xl border px-3 py-2.5 text-xs font-medium",

                    project.style ===
                    item.value
                      ? "border-violet-500 bg-violet-50 text-violet-700"
                      : "border-slate-200",
                  ].join(" ")}
                >
                  {
                    item.label
                  }
                </button>
              ),
            )}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={
          onGenerate
        }
        disabled={
          isGenerating
        }
        className={[
          "mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl",
          "bg-gradient-to-r from-violet-600 to-purple-600",
          "text-sm font-semibold text-white",
          "shadow-lg shadow-violet-200 transition",

          isGenerating
            ? "cursor-not-allowed opacity-70"
            : "hover:opacity-95",
        ].join(" ")}
      >
        {isGenerating ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />

            Generating...
          </>
        ) : (
          <>
            <Sparkles
              size={17}
            />

            Generate Video

            <span>
              →
            </span>
          </>
        )}
      </button>
    </section>
  );
}