import type {
  BrandingPosition,
  CaptionStyle,
  GeneratedContent,
  MusicTrack,
  VideoProject,
  VoicePreset,
} from "@/app/page";

export type SavedProject = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  imagePreview: string | null;
  project: VideoProject;
  generatedContent: GeneratedContent | null;
  previewTitle: string | null;
  previewSubtitle: string | null;
  captionStyle: CaptionStyle;
  captionSyncOffsetMs: number;
  voicePreset: VoicePreset;
  musicTrack: MusicTrack;
  musicVolume: number;
  autoDucking: boolean;
  brandingEnabled: boolean;
  brandLogo: string | null;
  brandingPosition: BrandingPosition;
  brandingSize: number;
  brandingOpacity: number;
};

const PROJECTS_KEY =
  "creora_saved_projects_v1";

const OPEN_PROJECT_KEY =
  "creora_open_project_id";

const SESSION_PROJECT_KEY =
  "creora_current_project_id";

const NEW_PROJECT_KEY =
  "creora_new_project_requested";

function canUseBrowserStorage() {
  return typeof window !==
    "undefined";
}

export function getSavedProjects(): SavedProject[] {
  if (!canUseBrowserStorage()) {
    return [];
  }

  try {
    const raw =
      window.localStorage.getItem(
        PROJECTS_KEY,
      );

    if (!raw) {
      return [];
    }

    const parsed =
      JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed as SavedProject[];
  } catch (error) {
    console.error(
      "Could not read saved projects:",
      error,
    );

    return [];
  }
}

function writeSavedProjects(
  projects: SavedProject[],
) {
  if (!canUseBrowserStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(
      PROJECTS_KEY,
      JSON.stringify(projects),
    );
  } catch (error) {
    console.error(
      "Could not save projects:",
      error,
    );

    if (
      error instanceof DOMException &&
      (error.name ===
        "QuotaExceededError" ||
        error.name ===
          "NS_ERROR_DOM_QUOTA_REACHED")
    ) {
      throw new Error(
        "Browser storage is full. Large uploaded images can fill local storage quickly. Delete an old saved project or use smaller images for now.",
      );
    }

    throw new Error(
      "Could not save this project in the browser.",
    );
  }
}

export function getSavedProject(
  projectId: string,
) {
  return (
    getSavedProjects().find(
      (project) =>
        project.id ===
        projectId,
    ) ?? null
  );
}

export function saveSavedProject(
  project: SavedProject,
) {
  const projects =
    getSavedProjects();

  const existingIndex =
    projects.findIndex(
      (item) =>
        item.id === project.id,
    );

  if (existingIndex >= 0) {
    projects[existingIndex] =
      project;
  } else {
    projects.unshift(
      project,
    );
  }

  projects.sort(
    (a, b) =>
      new Date(
        b.updatedAt,
      ).getTime() -
      new Date(
        a.updatedAt,
      ).getTime(),
  );

  writeSavedProjects(
    projects,
  );

  return project;
}

export function deleteSavedProject(
  projectId: string,
) {
  const projects =
    getSavedProjects().filter(
      (project) =>
        project.id !==
        projectId,
    );

  writeSavedProjects(
    projects,
  );

  if (
    getSessionProjectId() ===
    projectId
  ) {
    clearProjectSession();
  }
}

export function duplicateSavedProject(
  projectId: string,
) {
  const source =
    getSavedProject(
      projectId,
    );

  if (!source) {
    return null;
  }

  const now =
    new Date().toISOString();

  const duplicate: SavedProject = {
    ...source,
    id:
      typeof crypto !==
        "undefined" &&
      "randomUUID" in crypto
        ? crypto.randomUUID()
        : `project-${Date.now()}`,
    name: `${source.name} Copy`,
    createdAt: now,
    updatedAt: now,
  };

  saveSavedProject(
    duplicate,
  );

  return duplicate;
}

export function setProjectToOpen(
  projectId: string,
) {
  if (!canUseBrowserStorage()) {
    return;
  }

  window.sessionStorage.removeItem(
    NEW_PROJECT_KEY,
  );

  window.sessionStorage.setItem(
    OPEN_PROJECT_KEY,
    projectId,
  );
}

export function getProjectToOpen() {
  if (!canUseBrowserStorage()) {
    return null;
  }

  const projectId =
    window.sessionStorage.getItem(
      OPEN_PROJECT_KEY,
    );

  if (!projectId) {
    return null;
  }

  window.sessionStorage.removeItem(
    OPEN_PROJECT_KEY,
  );

  return getSavedProject(
    projectId,
  );
}

export function setSessionProjectId(
  projectId: string,
) {
  if (!canUseBrowserStorage()) {
    return;
  }

  window.sessionStorage.removeItem(
    NEW_PROJECT_KEY,
  );

  window.sessionStorage.setItem(
    SESSION_PROJECT_KEY,
    projectId,
  );
}

export function getSessionProjectId() {
  if (!canUseBrowserStorage()) {
    return null;
  }

  return window.sessionStorage.getItem(
    SESSION_PROJECT_KEY,
  );
}

export function consumeNewProjectRequest() {
  if (!canUseBrowserStorage()) {
    return false;
  }

  const requested =
    window.sessionStorage.getItem(
      NEW_PROJECT_KEY,
    ) === "1";

  if (requested) {
    window.sessionStorage.removeItem(
      NEW_PROJECT_KEY,
    );
  }

  return requested;
}

export function clearProjectSession() {
  if (!canUseBrowserStorage()) {
    return;
  }

  window.sessionStorage.removeItem(
    OPEN_PROJECT_KEY,
  );

  window.sessionStorage.removeItem(
    SESSION_PROJECT_KEY,
  );

  window.sessionStorage.setItem(
    NEW_PROJECT_KEY,
    "1",
  );
}
