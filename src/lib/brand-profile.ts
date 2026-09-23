export type BrandPlatform =
  | "tiktok"
  | "instagram"
  | "youtube"
  | "other";

export type BrandDuration =
  | 10
  | 15
  | 30;

export type BrandVideoStyle =
  | "ugc"
  | "cinematic"
  | "lifestyle"
  | "product-demo";

export type BrandProfile = {
  displayName: string;
  role: string;
  brandName: string;
  bio: string;
  avatarUrl: string | null;
  logoUrl: string | null;
  primaryColor: string;
  accentColor: string;
  defaultPlatform: BrandPlatform;
  defaultDuration: BrandDuration;
  defaultStyle: BrandVideoStyle;
};

export const BRAND_PROFILE_KEY =
  "creora_brand_profile_v1";

export const BRAND_PROFILE_UPDATED_EVENT =
  "creora:brand-profile-updated";

export const DEFAULT_BRAND_PROFILE: BrandProfile = {
  displayName: "Sarah M.",
  role: "Creator",
  brandName: "",
  bio: "",
  avatarUrl: null,
  logoUrl: null,
  primaryColor: "#7c3aed",
  accentColor: "#ec4899",
  defaultPlatform: "tiktok",
  defaultDuration: 15,
  defaultStyle: "ugc",
};

function canUseBrowserStorage() {
  return typeof window !==
    "undefined";
}

export function getBrandProfile(): BrandProfile {
  if (!canUseBrowserStorage()) {
    return {
      ...DEFAULT_BRAND_PROFILE,
    };
  }

  try {
    const raw =
      window.localStorage.getItem(
        BRAND_PROFILE_KEY,
      );

    if (!raw) {
      return {
        ...DEFAULT_BRAND_PROFILE,
      };
    }

    const parsed =
      JSON.parse(
        raw,
      ) as Partial<BrandProfile>;

    return {
      ...DEFAULT_BRAND_PROFILE,
      ...parsed,
    };
  } catch (error) {
    console.error(
      "Could not read brand profile:",
      error,
    );

    return {
      ...DEFAULT_BRAND_PROFILE,
    };
  }
}

export function saveBrandProfile(
  profile: BrandProfile,
) {
  if (!canUseBrowserStorage()) {
    return profile;
  }

  try {
    window.localStorage.setItem(
      BRAND_PROFILE_KEY,
      JSON.stringify(
        profile,
      ),
    );

    window.dispatchEvent(
      new CustomEvent(
        BRAND_PROFILE_UPDATED_EVENT,
      ),
    );

    return profile;
  } catch (error) {
    console.error(
      "Could not save brand profile:",
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
        "Browser storage is full. Try using smaller avatar or logo images.",
      );
    }

    throw new Error(
      "Could not save your Brand & Profile settings.",
    );
  }
}

export function resetBrandProfile() {
  if (!canUseBrowserStorage()) {
    return {
      ...DEFAULT_BRAND_PROFILE,
    };
  }

  window.localStorage.removeItem(
    BRAND_PROFILE_KEY,
  );

  window.dispatchEvent(
    new CustomEvent(
      BRAND_PROFILE_UPDATED_EVENT,
    ),
  );

  return {
    ...DEFAULT_BRAND_PROFILE,
  };
}
