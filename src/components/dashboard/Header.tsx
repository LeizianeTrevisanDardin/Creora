import {
  Bell,
  CircleHelp,
  Crown,
  Search,
} from "lucide-react";

export default function Header() {
  return (
    <header className="flex h-[66px] items-center justify-between border-b border-[#e7e8ef] bg-white px-5 lg:px-7">
      <div className="relative w-full max-w-xl">
        <Search
          size={17}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          placeholder="Search projects, videos, templates..."
          className="h-10 w-full rounded-xl border border-slate-200 bg-[#fafbfe] pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
        />
      </div>

      <div className="ml-4 flex items-center gap-4">
        <button className="hidden text-slate-500 sm:block">
          <CircleHelp size={20} />
        </button>

        <button className="relative hidden text-slate-500 sm:block">
          <Bell size={20} />

          <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:opacity-90">
          <Crown size={16} />
          Upgrade
        </button>
      </div>
    </header>
  );
}