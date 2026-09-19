import {
  Captions,
  ImagePlus,
  Mic2,
  Music2,
} from "lucide-react";

export default function EditorControls() {
  return (
    <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      <ControlCard
        icon={Captions}
        title="Caption Style"
      >
        <div className="grid grid-cols-4 gap-1.5">
          {[
            "Dynamic",
            "Minimal",
            "Karaoke",
            "Custom",
          ].map((item, index) => (
            <button
              key={item}
              className={[
                "rounded-lg border px-1 py-3 text-[10px]",
                index === 0
                  ? "border-violet-500 bg-violet-50 text-violet-700"
                  : "border-slate-200",
              ].join(" ")}
            >
              {item}
            </button>
          ))}
        </div>
      </ControlCard>

      <ControlCard
        icon={Mic2}
        title="Voiceover"
      >
        <select className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-xs outline-none">
          <option>
            Natural (Female)
          </option>
          <option>
            Natural (Male)
          </option>
          <option>
            Warm Creator
          </option>
        </select>

        <button className="mt-2 w-full rounded-lg border border-slate-200 py-2 text-xs font-medium">
          Change
        </button>
      </ControlCard>

      <ControlCard
        icon={Music2}
        title="Music"
      >
        <select className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-xs outline-none">
          <option>
            Chill Vibes
          </option>
          <option>
            Upbeat Creator
          </option>
          <option>
            Soft Lifestyle
          </option>
        </select>

        <button className="mt-2 w-full rounded-lg border border-slate-200 py-2 text-xs font-medium">
          Change
        </button>
      </ControlCard>

      <ControlCard
        icon={ImagePlus}
        title="Branding"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Add logo
          </span>

          <div className="h-6 w-11 rounded-full bg-violet-600 p-1">
            <div className="ml-auto h-4 w-4 rounded-full bg-white" />
          </div>
        </div>

        <button className="mt-3 w-full rounded-lg border border-slate-200 py-2 text-xs font-medium">
          Customize
        </button>
      </ControlCard>
    </section>
  );
}

function ControlCard({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center gap-2">
        <Icon
          size={16}
          className="text-violet-600"
        />

        <p className="text-xs font-semibold">
          {title}
        </p>
      </div>

      {children}
    </div>
  );
}