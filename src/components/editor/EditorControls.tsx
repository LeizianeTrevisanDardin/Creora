import {
  Captions,
  ImagePlus,
  LoaderCircle,
  Mic2,
  Music2,
  Upload,
} from "lucide-react";

import type {
  BrandingPosition,
  CaptionStyle,
  MusicTrack,
  VoicePreset,
} from "@/app/page";

type EditorControlsProps = {
  captionStyle: CaptionStyle;

  setCaptionStyle: (
    style: CaptionStyle,
  ) => void;

  captionSyncOffsetMs: number;

  setCaptionSyncOffsetMs: (
    value: number,
  ) => void;

  voicePreset: VoicePreset;

  setVoicePreset: (
    voice: VoicePreset,
  ) => void;

  onGenerateVoiceovers:
    () => Promise<void>;

  isGeneratingVoice: boolean;

  hasGeneratedContent: boolean;

  musicTrack: MusicTrack;

  setMusicTrack: (
    track: MusicTrack,
  ) => void;

  musicVolume: number;

  setMusicVolume: (
    value: number,
  ) => void;

  autoDucking: boolean;

  setAutoDucking: (
    value: boolean,
  ) => void;

  brandingEnabled: boolean;

  setBrandingEnabled: (
    value: boolean,
  ) => void;

  brandLogo: string | null;

  setBrandLogo: (
    value: string | null,
  ) => void;

  brandingPosition:
    BrandingPosition;

  setBrandingPosition: (
    value: BrandingPosition,
  ) => void;

  brandingSize: number;

  setBrandingSize: (
    value: number,
  ) => void;

  brandingOpacity: number;

  setBrandingOpacity: (
    value: number,
  ) => void;
};

export default function EditorControls({
  captionStyle,
  setCaptionStyle,
  captionSyncOffsetMs,
  setCaptionSyncOffsetMs,
  voicePreset,
  setVoicePreset,
  onGenerateVoiceovers,
  isGeneratingVoice,
  hasGeneratedContent,
  musicTrack,
  setMusicTrack,
  musicVolume,
  setMusicVolume,
  autoDucking,
  setAutoDucking,
  brandingEnabled,
  setBrandingEnabled,
  brandLogo,
  setBrandLogo,
  brandingPosition,
  setBrandingPosition,
  brandingSize,
  setBrandingSize,
  brandingOpacity,
  setBrandingOpacity,
}: EditorControlsProps) {
  const handleLogoUpload = (
    event:
      React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      !file.type.startsWith(
        "image/",
      )
    ) {
      alert(
        "Please select an image file.",
      );

      return;
    }

    const reader =
      new FileReader();

    reader.onload = () => {
      if (
        typeof reader.result ===
        "string"
      ) {
        setBrandLogo(
          reader.result,
        );

        setBrandingEnabled(
          true,
        );
      }
    };

    reader.readAsDataURL(
      file,
    );

    event.target.value =
      "";
  };

  const captionOptions: {
    label: string;
    value: CaptionStyle;
  }[] = [
    {
      label:
        "Dynamic",

      value:
        "dynamic",
    },
    {
      label:
        "Minimal",

      value:
        "minimal",
    },
    {
      label:
        "Karaoke",

      value:
        "karaoke",
    },
    {
      label:
        "Custom",

      value:
        "custom",
    },
    {
      label:
        "No Captions",

      value:
        "none",
    },
  ];

  return (
    <section className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 2xl:grid-cols-4">
      {/* =================================
          CAPTION STYLE
      ================================= */}

      <ControlCard
        icon={
          Captions
        }
        title="Caption Style"
      >
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-3 min-[1750px]:grid-cols-5">
          {captionOptions.map(
            (item) => (
              <button
                key={
                  item.value
                }
                type="button"
                onClick={() =>
                  setCaptionStyle(
                    item.value,
                  )
                }
                className={[
                  "rounded-lg border px-2 py-2.5 text-[11px] font-medium transition",

                  captionStyle ===
                  item.value
                    ? "border-violet-500 bg-violet-50 text-violet-700"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                ].join(
                  " ",
                )}
              >
                {
                  item.label
                }
              </button>
            ),
          )}
        </div>

        {/* CAPTION SYNC */}

        {captionStyle !==
          "none" && (
          <div className="mt-4 border-t border-slate-100 pt-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold text-slate-700">
                  Caption Sync
                </p>

                <p className="mt-0.5 text-[9px] text-slate-400">
                  Fine-tune voice alignment
                </p>
              </div>

              <span className="rounded-full bg-violet-50 px-2 py-1 text-[10px] font-semibold text-violet-700">
                {captionSyncOffsetMs >
                0
                  ? "+"
                  : ""}

                {
                  captionSyncOffsetMs
                }{" "}
                ms
              </span>
            </div>

            <input
              type="range"
              min={
                -300
              }
              max={
                300
              }
              step={
                10
              }
              value={
                captionSyncOffsetMs
              }
              onChange={(event) =>
                setCaptionSyncOffsetMs(
                  Number(
                    event
                      .target
                      .value,
                  ),
                )
              }
              className="mt-3 w-full accent-violet-600"
            />

            <div className="mt-1 flex items-center justify-between text-[9px] text-slate-400">
              <span>
                Earlier
              </span>

              <button
                type="button"
                onClick={() =>
                  setCaptionSyncOffsetMs(
                    0,
                  )
                }
                className="font-medium text-violet-600 transition hover:text-violet-700"
              >
                Reset
              </button>

              <span>
                Later
              </span>
            </div>
          </div>
        )}

        {/* NO CAPTIONS STATUS */}

        {captionStyle ===
          "none" && (
          <div className="mt-4 rounded-lg bg-slate-50 px-3 py-3">
            <p className="text-[10px] font-medium text-slate-500">
              Captions are hidden from the video.
            </p>
          </div>
        )}
      </ControlCard>

      {/* =================================
          VOICEOVER
      ================================= */}

      <ControlCard
        icon={
          Mic2
        }
        title="Voiceover"
      >
        <select
          value={
            voicePreset
          }
          onChange={(event) =>
            setVoicePreset(
              event.target
                .value as VoicePreset,
            )
          }
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-700 outline-none"
        >
          <option value="natural-female">
            Natural Female
          </option>

          <option value="natural-male">
            Natural Male
          </option>

          <option value="warm-creator">
            Warm Creator
          </option>
        </select>

        <button
          type="button"
          onClick={
            onGenerateVoiceovers
          }
          disabled={
            !hasGeneratedContent ||
            isGeneratingVoice
          }
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-violet-600 px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-violet-300"
        >
          {isGeneratingVoice ? (
            <>
              <LoaderCircle
                size={
                  14
                }
                className="animate-spin"
              />

              Generating Voice...
            </>
          ) : (
            <>
              <Mic2
                size={
                  14
                }
              />

              Generate Voiceover
            </>
          )}
        </button>
      </ControlCard>

      {/* =================================
          MUSIC
      ================================= */}

      <ControlCard
        icon={
          Music2
        }
        title="Music"
      >
        <select
          value={
            musicTrack
          }
          onChange={(event) =>
            setMusicTrack(
              event.target
                .value as MusicTrack,
            )
          }
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-700 outline-none"
        >
          <option value="none">
            No Music
          </option>

          <option value="chill-vibes">
            Chill Vibes
          </option>

          <option value="upbeat-creator">
            Upbeat Creator
          </option>

          <option value="soft-lifestyle">
            Soft Lifestyle
          </option>
        </select>

        <div className="mt-3 border-t border-slate-100 pt-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-700">
              Volume
            </span>

            <span className="rounded-full bg-violet-50 px-2 py-1 text-[10px] font-semibold text-violet-700">
              {
                musicVolume
              }
              %
            </span>
          </div>

          <input
            type="range"
            min={
              0
            }
            max={
              100
            }
            step={
              1
            }
            value={
              musicVolume
            }
            disabled={
              musicTrack ===
              "none"
            }
            onChange={(event) =>
              setMusicVolume(
                Number(
                  event.target
                    .value,
                ),
              )
            }
            className="mt-3 w-full accent-violet-600 disabled:opacity-40"
          />
        </div>

        <button
          type="button"
          disabled={
            musicTrack ===
            "none"
          }
          onClick={() =>
            setAutoDucking(
              !autoDucking,
            )
          }
          className="mt-3 flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2.5 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <div className="text-left">
            <p className="text-[11px] font-medium text-slate-700">
              Auto Ducking
            </p>

            <p className="mt-0.5 text-[9px] text-slate-400">
              Lower music during voiceover
            </p>
          </div>

          <Toggle
            enabled={
              autoDucking
            }
          />
        </button>
      </ControlCard>

      {/* =================================
          BRANDING
      ================================= */}

      <ControlCard
        icon={
          ImagePlus
        }
        title="Branding"
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium text-slate-700">
              Show Logo
            </p>

            <p className="mt-0.5 text-[9px] text-slate-400">
              Add a watermark to your video
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setBrandingEnabled(
                !brandingEnabled,
              )
            }
          >
            <Toggle
              enabled={
                brandingEnabled
              }
            />
          </button>
        </div>

        <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-violet-200 bg-violet-50/50 px-3 py-2.5 text-[11px] font-medium text-violet-700 transition hover:bg-violet-50">
          <Upload
            size={
              14
            }
          />

          {brandLogo
            ? "Replace Logo"
            : "Upload Logo"}

          <input
            type="file"
            accept="image/*"
            onChange={
              handleLogoUpload
            }
            className="hidden"
          />
        </label>

        {brandLogo && (
          <>
            <div className="mt-3 flex items-center gap-3 rounded-lg bg-slate-50 p-2">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white p-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    brandLogo
                  }
                  alt="Brand logo"
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold text-slate-700">
                  Logo ready
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setBrandLogo(
                      null,
                    );

                    setBrandingEnabled(
                      false,
                    );
                  }}
                  className="mt-0.5 text-[9px] font-medium text-rose-500 hover:text-rose-600"
                >
                  Remove
                </button>
              </div>
            </div>

            <div className="mt-3 border-t border-slate-100 pt-3">
              <p className="mb-2 text-[11px] font-semibold text-slate-700">
                Position
              </p>

              <select
                value={
                  brandingPosition
                }
                onChange={(event) =>
                  setBrandingPosition(
                    event.target
                      .value as BrandingPosition,
                  )
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-700 outline-none"
              >
                <option value="top-left">
                  Top Left
                </option>

                <option value="top-right">
                  Top Right
                </option>

                <option value="bottom-left">
                  Bottom Left
                </option>

                <option value="bottom-right">
                  Bottom Right
                </option>
              </select>
            </div>

            <div className="mt-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-700">
                  Size
                </span>

                <span className="text-[10px] font-medium text-violet-700">
                  {
                    brandingSize
                  }
                  %
                </span>
              </div>

              <input
                type="range"
                min={
                  8
                }
                max={
                  35
                }
                step={
                  1
                }
                value={
                  brandingSize
                }
                onChange={(event) =>
                  setBrandingSize(
                    Number(
                      event.target
                        .value,
                    ),
                  )
                }
                className="mt-2 w-full accent-violet-600"
              />
            </div>

            <div className="mt-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-700">
                  Opacity
                </span>

                <span className="text-[10px] font-medium text-violet-700">
                  {
                    brandingOpacity
                  }
                  %
                </span>
              </div>

              <input
                type="range"
                min={
                  20
                }
                max={
                  100
                }
                step={
                  5
                }
                value={
                  brandingOpacity
                }
                onChange={(event) =>
                  setBrandingOpacity(
                    Number(
                      event.target
                        .value,
                    ),
                  )
                }
                className="mt-2 w-full accent-violet-600"
              />
            </div>
          </>
        )}
      </ControlCard>
    </section>
  );
}

function Toggle({
  enabled,
}: {
  enabled: boolean;
}) {
  return (
    <span
      className={[
        "flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition",

        enabled
          ? "bg-violet-600"
          : "bg-slate-200",
      ].join(
        " ",
      )}
    >
      <span
        className={[
          "h-4 w-4 rounded-full bg-white shadow-sm transition",

          enabled
            ? "translate-x-4"
            : "translate-x-0",
        ].join(
          " ",
        )}
      />
    </span>
  );
}

function ControlCard({
  icon: Icon,
  title,
  children,
}: {
  icon:
    React.ElementType;

  title:
    string;

  children:
    React.ReactNode;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center gap-2">
        <Icon
          size={
            16
          }
          className="shrink-0 text-violet-600"
        />

        <p className="text-xs font-semibold text-slate-800">
          {title}
        </p>
      </div>

      <div className="min-w-0">
        {children}
      </div>
    </div>
  );
}