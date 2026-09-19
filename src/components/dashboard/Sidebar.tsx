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

const navigation = [
  {
    label: "Create",
    icon: House,
    active: true,
  },
  {
    label: "Projects",
    icon: Folder,
  },
  {
    label: "Templates",
    icon: Grid2X2,
  },
  {
    label: "Brand & Profile",
    icon: UserRound,
  },
  {
    label: "AI Tools",
    icon: Sparkles,
  },
  {
    label: "Analytics",
    icon: BarChart3,
  },
];

export default function Sidebar() {
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
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              className={[
                "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition",
                item.active
                  ? "bg-[#f0edff] font-medium text-violet-700"
                  : "text-slate-600 hover:bg-slate-50",
              ].join(" ")}
            >
              <Icon size={18} />
              {item.label}
            </button>
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

        <div className="mt-4 flex items-center gap-3 px-1">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-rose-200 to-violet-200 text-xs font-semibold">
            SM
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">
              Sarah M.
            </p>

            <p className="text-xs text-slate-400">
              Creator
            </p>
          </div>

          <Settings
            size={17}
            className="text-slate-500"
          />
        </div>
      </div>
    </aside>
  );
}