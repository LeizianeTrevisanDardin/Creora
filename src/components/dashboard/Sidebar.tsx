"use client";

import {
  BarChart3,
  Folder,
  Grid2X2,
  House,
  Settings,
  Sparkles,
  UserRound,
} from "lucide-react";

import Image from "next/image";
import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import {
  usePathname,
} from "next/navigation";

import {
  BRAND_PROFILE_UPDATED_EVENT,
  DEFAULT_BRAND_PROFILE,
  getBrandProfile,
  type BrandProfile,
} from "@/lib/brand-profile";

import {
  clearProjectSession,
} from "@/lib/projects";

const navigation = [
  {
    label: "Create",
    icon: House,
    href: "/",
  },
  {
    label: "Projects",
    icon: Folder,
    href: "/projects",
  },
  {
    label: "Templates",
    icon: Grid2X2,
    href: "/templates",
  },
  {
    label: "Brand & Profile",
    icon: UserRound,
    href: "/brand-profile",
  },
  {
    label: "AI Tools",
    icon: Sparkles,
    href: "/ai-tools",
  },
  {
    label: "Analytics",
    icon: BarChart3,
    href: "/analytics",
  },
];

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

export default function Sidebar() {
  const pathname =
    usePathname();

  const [
    brandProfile,
    setBrandProfile,
  ] =
    useState<BrandProfile>(
      DEFAULT_BRAND_PROFILE,
    );

  useEffect(() => {
    const refreshProfile =
      () => {
        setBrandProfile(
          getBrandProfile(),
        );
      };

    const timeoutId =
      window.setTimeout(
        refreshProfile,
        0,
      );

    window.addEventListener(
      BRAND_PROFILE_UPDATED_EVENT,
      refreshProfile,
    );

    return () => {
      window.clearTimeout(
        timeoutId,
      );

      window.removeEventListener(
        BRAND_PROFILE_UPDATED_EVENT,
        refreshProfile,
      );
    };
  }, []);

  return (
    <aside className="hidden min-h-screen w-[235px] shrink-0 border-r border-[#e7e8ef] bg-white lg:flex lg:flex-col">
      <div className="px-7 pb-7 pt-7">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 text-white">
            <Sparkles size={19} />
          </div>

          <div>
            <h1 className="text-[22px] font-bold leading-none tracking-tight">
              creora
            </h1>

            <p className="mt-1 text-xs text-slate-400">
              AI Content Studio
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-2 px-4">
        {navigation.map((item) => {
          const Icon =
            item.icon;

          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(
                  item.href,
                );

          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => {
                if (
                  item.href ===
                  "/"
                ) {
                  clearProjectSession();
                }
              }}
              className={[
                "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition",
                active
                  ? "bg-[#f0edff] font-medium text-violet-700"
                  : "text-slate-600 hover:bg-slate-50",
              ].join(" ")}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4">
        <div className="rounded-2xl border border-slate-200 bg-[#fafaff] p-4">
          <div className="mb-2 flex items-center gap-2">
            <Sparkles
              size={17}
              className="text-violet-600"
            />

            <span className="text-sm font-semibold">
              Pro Plan
            </span>
          </div>

          <p className="text-xs text-slate-500">
            250 credits left
          </p>

          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full w-[78%] rounded-full bg-violet-500" />
          </div>
        </div>

        <Link
          href="/brand-profile"
          className="mt-4 flex items-center gap-3 rounded-xl px-1 py-1 transition hover:bg-slate-50"
        >
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-rose-200 to-violet-200 text-xs font-semibold">
            {brandProfile.avatarUrl ? (
              <Image
                src={
                  brandProfile.avatarUrl
                }
                alt={
                  brandProfile.displayName ||
                  "Creator avatar"
                }
                fill
                unoptimized
                sizes="36px"
                className="object-cover"
              />
            ) : (
              <span>
                {getInitials(
                  brandProfile.displayName,
                )}
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">
              {brandProfile.displayName ||
                "Creator"}
            </p>

            <p className="truncate text-xs text-slate-400">
              {brandProfile.role ||
                "Creator"}
            </p>
          </div>

          <Settings
            size={17}
            className="text-slate-500"
          />
        </Link>
      </div>
    </aside>
  );
}
