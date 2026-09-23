"use client";

import {
  ArrowRight,
  Lightbulb,
  MapPin,
  ShoppingBag,
  Sparkles,
  Sun,
  Video,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";

import {
  clearProjectSession,
} from "@/lib/projects";

import {
  CREORA_TEMPLATES,
  setTemplateToUse,
  type CreoraTemplate,
  type TemplateCategory,
  type TemplateIcon,
} from "@/lib/templates"

const categories:
  Array<
    "All" |
    TemplateCategory
  > = [
    "All",
    "Lifestyle",
    "UGC",
    "Product",
    "Education",
    "Travel",
  ];

function TemplateIconView({
  icon,
}: {
  icon: TemplateIcon;
}) {
  const props = {
    size: 30,
    strokeWidth: 1.8,
  };

  if (icon === "sun") {
    return <Sun {...props} />;
  }

  if (icon === "shopping") {
    return (
      <ShoppingBag
        {...props}
      />
    );
  }

  if (icon === "lightbulb") {
    return (
      <Lightbulb
        {...props}
      />
    );
  }

  if (icon === "map") {
    return (
      <MapPin
        {...props}
      />
    );
  }

  if (icon === "video") {
    return (
      <Video
        {...props}
      />
    );
  }

  return (
    <Sparkles
      {...props}
    />
  );
}

export default function TemplatesPage() {
  const router =
    useRouter();

  const [
    selectedCategory,
    setSelectedCategory,
  ] =
    useState<
      "All" |
      TemplateCategory
    >("All");

  const visibleTemplates =
    useMemo(
      () =>
        selectedCategory ===
        "All"
          ? CREORA_TEMPLATES
          : CREORA_TEMPLATES.filter(
              (template) =>
                template.category ===
                selectedCategory,
            ),
      [selectedCategory],
    );

  const handleUseTemplate =
    (
      template:
        CreoraTemplate,
    ) => {
      clearProjectSession();

      setTemplateToUse(
        template.id,
      );

      router.push("/");
    };

  return (
    <div className="flex min-h-screen bg-[#f8f9fc]">
      <Sidebar />

      <div className="min-w-0 flex-1">
        <Header />

        <main className="mx-auto w-full max-w-[1800px] px-3 py-5 sm:px-4 md:px-5 lg:px-6 xl:px-7">
          <div className="mb-5 sm:mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
              Templates
            </h1>

            <p className="mt-1 max-w-2xl text-sm text-slate-500 sm:text-base">
              Start faster with ready-made creator video structures.
            </p>
          </div>

          <div className="mb-5 flex flex-wrap gap-2">
            {categories.map(
              (category) => {
                const active =
                  selectedCategory ===
                  category;

                return (
                  <button
                    key={
                      category
                    }
                    type="button"
                    onClick={() =>
                      setSelectedCategory(
                        category,
                      )
                    }
                    className={[
                      "rounded-xl border px-4 py-2 text-sm font-medium transition",
                      active
                        ? "border-violet-200 bg-violet-100 text-violet-700"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                    ].join(
                      " ",
                    )}
                  >
                    {category}
                  </button>
                );
              },
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visibleTemplates.map(
              (template) => (
                <article
                  key={
                    template.id
                  }
                  className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white"
                >
                  <div
                    className="relative flex aspect-[16/9] items-center justify-center overflow-hidden p-5"
                    style={{
                      background:
                        template.gradient,
                    }}
                  >
                    <div className="absolute left-4 top-4 rounded-full bg-white/80 px-3 py-1 text-[10px] font-semibold text-slate-700 backdrop-blur">
                      {
                        template.category
                      }
                    </div>

                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/75 text-violet-700 shadow-sm backdrop-blur">
                      <TemplateIconView
                        icon={
                          template.icon
                        }
                      />
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
                      <span className="rounded-full bg-black/65 px-2.5 py-1 text-[10px] font-medium capitalize text-white backdrop-blur">
                        {
                          template.platform
                        }
                      </span>

                      <span className="rounded-full bg-black/65 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur">
                        {
                          template.duration
                        }
                        s
                      </span>

                      <span className="rounded-full bg-black/65 px-2.5 py-1 text-[10px] font-medium capitalize text-white backdrop-blur">
                        {
                          template.style.replace(
                            "-",
                            " ",
                          )
                        }
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h2 className="text-base font-semibold text-slate-900">
                      {
                        template.name
                      }
                    </h2>

                    <p className="mt-2 min-h-[44px] text-sm leading-6 text-slate-500">
                      {
                        template.description
                      }
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        handleUseTemplate(
                          template,
                        )
                      }
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
                    >
                      Use Template
                      <ArrowRight
                        size={15}
                      />
                    </button>
                  </div>
                </article>
              ),
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
