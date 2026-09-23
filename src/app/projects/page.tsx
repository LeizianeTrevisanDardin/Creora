"use client";

import {
  Copy,
  FolderOpen,
  Plus,
  Trash2,
} from "lucide-react";

import Image from "next/image";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";

import {
  clearProjectSession,
  deleteSavedProject,
  duplicateSavedProject,
  getSavedProjects,
  setProjectToOpen,
  type SavedProject,
} from "@/lib/projects";

function formatSavedDate(
  value: string,
) {
  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "";
  }

  return new Intl.DateTimeFormat(
    "en-CA",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    },
  ).format(date);
}

export default function ProjectsPage() {
  const router =
    useRouter();

  const [
    projects,
    setProjects,
  ] =
    useState<SavedProject[]>(
      [],
    );

  const [
    loaded,
    setLoaded,
  ] =
    useState(false);

  const refreshProjects =
    () => {
      setProjects(
        getSavedProjects(),
      );
    };

  useEffect(() => {
    const timeoutId =
      window.setTimeout(() => {
        setProjects(
          getSavedProjects(),
        );

        setLoaded(true);
      }, 0);

    return () => {
      window.clearTimeout(
        timeoutId,
      );
    };
  }, []);

  const handleOpen =
    (projectId: string) => {
      setProjectToOpen(
        projectId,
      );

      router.push("/");
    };

  const handleNewProject =
    () => {
      clearProjectSession();
      router.push("/");
    };

  const handleDuplicate =
    (projectId: string) => {
      duplicateSavedProject(
        projectId,
      );

      refreshProjects();
    };

  const handleDelete =
    (
      projectId: string,
      projectName: string,
    ) => {
      const confirmed =
        window.confirm(
          `Delete "${projectName}"?`,
        );

      if (!confirmed) {
        return;
      }

      deleteSavedProject(
        projectId,
      );

      refreshProjects();
    };

  return (
    <div className="flex min-h-screen bg-[#f8f9fc]">
      <Sidebar />

      <div className="min-w-0 flex-1">
        <Header />

        <main className="mx-auto w-full max-w-[1800px] px-3 py-5 sm:px-4 md:px-5 lg:px-6 xl:px-7">
          <div className="mb-5 flex flex-col gap-3 sm:mb-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                Projects
              </h1>

              <p className="mt-1 max-w-2xl text-sm text-slate-500 sm:text-base">
                Continue editing your saved Creora videos.
              </p>
            </div>

            <button
              type="button"
              onClick={
                handleNewProject
              }
              className="flex w-fit shrink-0 items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
            >
              <Plus size={16} />
              New Project
            </button>
          </div>

          {!loaded ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500">
              Loading projects...
            </div>
          ) : projects.length ===
            0 ? (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
              <div className="mx-auto flex min-h-[280px] max-w-md flex-col items-center justify-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-50 text-violet-600">
                  <FolderOpen
                    size={24}
                  />
                </div>

                <h2 className="mt-4 text-lg font-semibold text-slate-900">
                  No saved projects yet
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Create a video and use Save Project. It will appear here so you can continue later.
                </p>

                <button
                  type="button"
                  onClick={
                    handleNewProject
                  }
                  className="mt-5 flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
                >
                  <Plus size={16} />
                  Create Video
                </button>
              </div>
            </section>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {projects.map(
                (savedProject) => (
                  <article
                    key={
                      savedProject.id
                    }
                    className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        handleOpen(
                          savedProject.id,
                        )
                      }
                      className="block w-full text-left"
                    >
                      <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-violet-100 via-fuchsia-50 to-rose-100">
                        {savedProject.imagePreview ? (
                          <Image
                            src={
                              savedProject.imagePreview
                            }
                            alt={
                              savedProject.name
                            }
                            fill
                            unoptimized
                            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-violet-300">
                            <FolderOpen
                              size={34}
                            />
                          </div>
                        )}

                        <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
                          <span className="rounded-full bg-black/65 px-2.5 py-1 text-[10px] font-medium capitalize text-white backdrop-blur">
                            {
                              savedProject
                                .project
                                .platform
                            }
                          </span>

                          <span className="rounded-full bg-black/65 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur">
                            {
                              savedProject
                                .project
                                .duration
                            }
                            s
                          </span>

                          {savedProject.generatedContent && (
                            <span className="rounded-full bg-black/65 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur">
                              {
                                savedProject
                                  .generatedContent
                                  .scenes
                                  .length
                              } scenes
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-4">
                        <h2 className="truncate text-base font-semibold text-slate-900">
                          {
                            savedProject.name
                          }
                        </h2>

                        <p className="mt-1 text-xs text-slate-400">
                          Updated {" "}
                          {formatSavedDate(
                            savedProject.updatedAt,
                          )}
                        </p>

                        <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
                          {
                            savedProject
                              .project
                              .videoPrompt ||
                            "No video prompt yet."
                          }
                        </p>
                      </div>
                    </button>

                    <div className="flex items-center gap-2 border-t border-slate-100 p-3">
                      <button
                        type="button"
                        onClick={() =>
                          handleOpen(
                            savedProject.id,
                          )
                        }
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-violet-600 px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-violet-700"
                      >
                        <FolderOpen
                          size={14}
                        />
                        Open
                      </button>

                      <button
                        type="button"
                        title="Duplicate project"
                        onClick={() =>
                          handleDuplicate(
                            savedProject.id,
                          )
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50"
                      >
                        <Copy size={14} />
                      </button>

                      <button
                        type="button"
                        title="Delete project"
                        onClick={() =>
                          handleDelete(
                            savedProject.id,
                            savedProject.name,
                          )
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-100 text-rose-400 transition hover:bg-rose-50 hover:text-rose-600"
                      >
                        <Trash2
                          size={14}
                        />
                      </button>
                    </div>
                  </article>
                ),
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
