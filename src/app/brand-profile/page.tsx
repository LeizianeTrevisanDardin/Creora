"use client";

import {
  ImagePlus,
  RotateCcw,
  Save,
  Trash2,
  Upload,
} from "lucide-react";

import Image from "next/image";

import {
  ChangeEvent,
  useEffect,
  useState,
} from "react";

import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";

import {
  DEFAULT_BRAND_PROFILE,
  getBrandProfile,
  resetBrandProfile,
  saveBrandProfile,
  type BrandDuration,
  type BrandPlatform,
  type BrandProfile,
  type BrandVideoStyle,
} from "@/lib/brand-profile";

function getInitials(
  name: string,
) {
  const parts =
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean);

  if (parts.length === 0) {
    return "CR";
  }

  if (parts.length === 1) {
    return parts[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function readImage(
  event: ChangeEvent<HTMLInputElement>,
  onReady: (
    value: string,
  ) => void,
) {
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
      "Please choose an image file.",
    );

    event.target.value =
      "";

    return;
  }

  if (
    file.size >
    2 * 1024 * 1024
  ) {
    alert(
      "Please use an image smaller than 2 MB.",
    );

    event.target.value =
      "";

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
        onReady(
          reader.result,
        );
      }
    };

  reader.readAsDataURL(
    file,
  );

  event.target.value =
    "";
}

export default function BrandProfilePage() {
  const [
    profile,
    setProfile,
  ] =
    useState<BrandProfile>(
      DEFAULT_BRAND_PROFILE,
    );

  const [
    loaded,
    setLoaded,
  ] =
    useState(false);

  const [
    savedMessage,
    setSavedMessage,
  ] =
    useState("");

  useEffect(() => {
    const timeoutId =
      window.setTimeout(
        () => {
          setProfile(
            getBrandProfile(),
          );

          setLoaded(
            true,
          );
        },
        0,
      );

    return () => {
      window.clearTimeout(
        timeoutId,
      );
    };
  }, []);

  const updateProfile =
    <K extends keyof BrandProfile>(
      key: K,
      value: BrandProfile[K],
    ) => {
      setProfile(
        (current) => ({
          ...current,
          [key]: value,
        }),
      );

      setSavedMessage(
        "",
      );
    };

  const handleSave =
    () => {
      if (
        !profile.displayName.trim()
      ) {
        alert(
          "Please add your display name.",
        );

        return;
      }

      try {
        const cleanProfile:
          BrandProfile = {
          ...profile,

          displayName:
            profile.displayName.trim(),

          role:
            profile.role.trim() ||
            "Creator",

          brandName:
            profile.brandName.trim(),

          bio:
            profile.bio.trim(),
        };

        saveBrandProfile(
          cleanProfile,
        );

        setProfile(
          cleanProfile,
        );

        setSavedMessage(
          "Profile saved",
        );
      } catch (error) {
        alert(
          error instanceof
          Error
            ? error.message
            : "Could not save your profile.",
        );
      }
    };

  const handleReset =
    () => {
      const confirmed =
        window.confirm(
          "Reset Brand & Profile to the default settings?",
        );

      if (!confirmed) {
        return;
      }

      const defaults =
        resetBrandProfile();

      setProfile(
        defaults,
      );

      setSavedMessage(
        "Profile reset",
      );
    };

  if (!loaded) {
    return (
      <div className="flex min-h-screen bg-[#f8f9fc]">
        <Sidebar />

        <div className="min-w-0 flex-1">
          <Header />

          <main className="mx-auto w-full max-w-[1800px] px-3 py-5 sm:px-4 md:px-5 lg:px-6 xl:px-7">
            <section className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500">
              Loading Brand & Profile...
            </section>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f8f9fc]">
      <Sidebar />

      <div className="min-w-0 flex-1">
        <Header />

        <main className="mx-auto w-full max-w-[1800px] px-3 py-5 sm:px-4 md:px-5 lg:px-6 xl:px-7">
          <div className="mb-5 flex flex-col gap-3 sm:mb-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                Brand & Profile
              </h1>

              <p className="mt-1 max-w-2xl text-sm text-slate-500 sm:text-base">
                Set your creator identity, brand assets and default video preferences.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {savedMessage && (
                <span className="text-xs font-medium text-emerald-600">
                  {savedMessage}
                </span>
              )}

              <button
                type="button"
                onClick={
                  handleReset
                }
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                <RotateCcw
                  size={15}
                />
                Reset
              </button>

              <button
                type="button"
                onClick={
                  handleSave
                }
                className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
              >
                <Save size={16} />
                Save Profile
              </button>
            </div>
          </div>

          <div className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
            <div className="min-w-0 space-y-4">
              <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
                <div>
                  <h2 className="font-semibold text-slate-900">
                    Creator Profile
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    This information is used across your Creora workspace.
                  </p>
                </div>

                <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center">
                  <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-rose-200 to-violet-200 text-xl font-bold text-slate-700">
                    {profile.avatarUrl ? (
                      <Image
                        src={
                          profile.avatarUrl
                        }
                        alt={
                          profile.displayName ||
                          "Creator avatar"
                        }
                        fill
                        unoptimized
                        sizes="96px"
                        className="object-cover"
                      />
                    ) : (
                      <span>
                        {getInitials(
                          profile.displayName,
                        )}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-2.5 text-sm font-medium text-violet-700 transition hover:bg-violet-100">
                      <Upload size={15} />
                      Upload Avatar

                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(
                          event,
                        ) =>
                          readImage(
                            event,
                            (
                              value,
                            ) =>
                              updateProfile(
                                "avatarUrl",
                                value,
                              ),
                          )
                        }
                      />
                    </label>

                    {profile.avatarUrl && (
                      <button
                        type="button"
                        onClick={() =>
                          updateProfile(
                            "avatarUrl",
                            null,
                          )
                        }
                        className="flex items-center gap-2 rounded-xl border border-rose-100 px-4 py-2.5 text-sm font-medium text-rose-500 transition hover:bg-rose-50"
                      >
                        <Trash2
                          size={15}
                        />
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-semibold text-slate-600">
                      Display Name
                    </label>

                    <input
                      value={
                        profile.displayName
                      }
                      onChange={(
                        event,
                      ) =>
                        updateProfile(
                          "displayName",
                          event.target
                            .value,
                        )
                      }
                      placeholder="Your name"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold text-slate-600">
                      Role
                    </label>

                    <input
                      value={
                        profile.role
                      }
                      onChange={(
                        event,
                      ) =>
                        updateProfile(
                          "role",
                          event.target
                            .value,
                        )
                      }
                      placeholder="Creator"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="mb-2 block text-xs font-semibold text-slate-600">
                    Brand Name
                  </label>

                  <input
                    value={
                      profile.brandName
                    }
                    onChange={(
                      event,
                    ) =>
                      updateProfile(
                        "brandName",
                        event.target
                          .value,
                      )
                    }
                    placeholder="Your brand or creator name"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                  />
                </div>

                <div className="mt-4">
                  <label className="mb-2 block text-xs font-semibold text-slate-600">
                    Creator Bio
                  </label>

                  <textarea
                    value={
                      profile.bio
                    }
                    onChange={(
                      event,
                    ) =>
                      updateProfile(
                        "bio",
                        event.target
                          .value,
                      )
                    }
                    placeholder="Describe your creator identity, niche, audience and content style."
                    rows={4}
                    className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                  />
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
                <div>
                  <h2 className="font-semibold text-slate-900">
                    Brand Assets
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    Save your logo and brand colors for future videos.
                  </p>
                </div>

                <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(220px,0.75fr)_minmax(0,1.25fr)]">
                  <div>
                    <div className="flex min-h-[180px] items-center justify-center overflow-hidden rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4">
                      {profile.logoUrl ? (
                        <div className="relative h-28 w-full max-w-[220px]">
                          <Image
                            src={
                              profile.logoUrl
                            }
                            alt="Brand logo"
                            fill
                            unoptimized
                            sizes="220px"
                            className="object-contain"
                          />
                        </div>
                      ) : (
                        <div className="text-center text-slate-400">
                          <ImagePlus
                            size={28}
                            className="mx-auto"
                          />

                          <p className="mt-2 text-xs">
                            No logo uploaded
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="mt-3 flex gap-2">
                      <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-3 py-2.5 text-xs font-medium text-violet-700 transition hover:bg-violet-100">
                        <Upload
                          size={14}
                        />
                        {profile.logoUrl
                          ? "Replace Logo"
                          : "Upload Logo"}

                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(
                            event,
                          ) =>
                            readImage(
                              event,
                              (
                                value,
                              ) =>
                                updateProfile(
                                  "logoUrl",
                                  value,
                                ),
                            )
                          }
                        />
                      </label>

                      {profile.logoUrl && (
                        <button
                          type="button"
                          title="Remove logo"
                          onClick={() =>
                            updateProfile(
                              "logoUrl",
                              null,
                            )
                          }
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-rose-100 text-rose-500 transition hover:bg-rose-50"
                        >
                          <Trash2
                            size={14}
                          />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid content-start gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-xs font-semibold text-slate-600">
                        Primary Color
                      </label>

                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={
                            profile.primaryColor
                          }
                          onChange={(
                            event,
                          ) =>
                            updateProfile(
                              "primaryColor",
                              event.target
                                .value,
                            )
                          }
                          className="h-[46px] w-14 cursor-pointer rounded-xl border border-slate-200 bg-white p-1"
                        />

                        <input
                          value={
                            profile.primaryColor
                          }
                          onChange={(
                            event,
                          ) =>
                            updateProfile(
                              "primaryColor",
                              event.target
                                .value,
                            )
                          }
                          className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 text-sm uppercase outline-none focus:border-violet-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-semibold text-slate-600">
                        Accent Color
                      </label>

                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={
                            profile.accentColor
                          }
                          onChange={(
                            event,
                          ) =>
                            updateProfile(
                              "accentColor",
                              event.target
                                .value,
                            )
                          }
                          className="h-[46px] w-14 cursor-pointer rounded-xl border border-slate-200 bg-white p-1"
                        />

                        <input
                          value={
                            profile.accentColor
                          }
                          onChange={(
                            event,
                          ) =>
                            updateProfile(
                              "accentColor",
                              event.target
                                .value,
                            )
                          }
                          className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 text-sm uppercase outline-none focus:border-violet-400"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
                <div>
                  <h2 className="font-semibold text-slate-900">
                    Video Defaults
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    These preferences will be available as your default creator settings.
                  </p>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-xs font-semibold text-slate-600">
                      Platform
                    </label>

                    <select
                      value={
                        profile.defaultPlatform
                      }
                      onChange={(
                        event,
                      ) =>
                        updateProfile(
                          "defaultPlatform",
                          event.target
                            .value as BrandPlatform,
                        )
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-violet-400"
                    >
                      <option value="tiktok">
                        TikTok
                      </option>
                      <option value="instagram">
                        Instagram
                      </option>
                      <option value="youtube">
                        YouTube
                      </option>
                      <option value="other">
                        Other
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold text-slate-600">
                      Length
                    </label>

                    <select
                      value={
                        profile.defaultDuration
                      }
                      onChange={(
                        event,
                      ) =>
                        updateProfile(
                          "defaultDuration",
                          Number(
                            event.target
                              .value,
                          ) as BrandDuration,
                        )
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-violet-400"
                    >
                      <option value={10}>
                        10 sec
                      </option>
                      <option value={15}>
                        15 sec
                      </option>
                      <option value={30}>
                        30 sec
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold text-slate-600">
                      Style
                    </label>

                    <select
                      value={
                        profile.defaultStyle
                      }
                      onChange={(
                        event,
                      ) =>
                        updateProfile(
                          "defaultStyle",
                          event.target
                            .value as BrandVideoStyle,
                        )
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-violet-400"
                    >
                      <option value="ugc">
                        UGC
                      </option>
                      <option value="cinematic">
                        Cinematic
                      </option>
                      <option value="lifestyle">
                        Lifestyle
                      </option>
                      <option value="product-demo">
                        Product Demo
                      </option>
                    </select>
                  </div>
                </div>
              </section>
            </div>

            <div className="min-w-0">
              <section className="sticky top-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-violet-600">
                  Profile Preview
                </p>

                <div
                  className="mt-4 overflow-hidden rounded-2xl border border-slate-200"
                  style={{
                    background:
                      `linear-gradient(135deg, ${profile.primaryColor}18, ${profile.accentColor}18)`,
                  }}
                >
                  <div className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white text-sm font-bold shadow-sm">
                        {profile.avatarUrl ? (
                          <Image
                            src={
                              profile.avatarUrl
                            }
                            alt={
                              profile.displayName ||
                              "Creator avatar"
                            }
                            fill
                            unoptimized
                            sizes="56px"
                            className="object-cover"
                          />
                        ) : (
                          <span>
                            {getInitials(
                              profile.displayName,
                            )}
                          </span>
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-900">
                          {profile.displayName ||
                            "Creator"}
                        </p>

                        <p className="truncate text-xs text-slate-500">
                          {profile.role ||
                            "Creator"}
                        </p>
                      </div>
                    </div>

                    {profile.brandName && (
                      <p className="mt-5 text-sm font-semibold text-slate-800">
                        {profile.brandName}
                      </p>
                    )}

                    {profile.bio ? (
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {profile.bio}
                      </p>
                    ) : (
                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        Your creator bio will appear here.
                      </p>
                    )}

                    {profile.logoUrl && (
                      <div className="relative mt-5 h-16 w-full max-w-[180px]">
                        <Image
                          src={
                            profile.logoUrl
                          }
                          alt="Brand logo"
                          fill
                          unoptimized
                          sizes="180px"
                          className="object-contain object-left"
                        />
                      </div>
                    )}

                    <div className="mt-5 flex gap-2">
                      <div
                        className="h-7 flex-1 rounded-lg border border-black/5"
                        style={{
                          backgroundColor:
                            profile.primaryColor,
                        }}
                      />

                      <div
                        className="h-7 flex-1 rounded-lg border border-black/5"
                        style={{
                          backgroundColor:
                            profile.accentColor,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold text-slate-700">
                    Default Video
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-medium capitalize text-violet-700">
                      {profile.defaultPlatform}
                    </span>

                    <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-medium text-slate-600">
                      {profile.defaultDuration}s
                    </span>

                    <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-medium capitalize text-slate-600">
                      {profile.defaultStyle.replace(
                        "-",
                        " ",
                      )}
                    </span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
