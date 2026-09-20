import {
  Captions,
  ImagePlus,
  Mic2,
  Music2,
} from "lucide-react";

export default function EditorControls() {
  return (
    <section
      className="
        grid
        min-w-0
        grid-cols-1
        gap-3
        sm:grid-cols-2
        2xl:grid-cols-4
      "
    >
      {/* =================================
          CAPTION STYLE
      ================================= */}

      <ControlCard
        icon={Captions}
        title="Caption Style"
      >
        <div
          className="
            grid
            grid-cols-2
            gap-2
            sm:grid-cols-2
            xl:grid-cols-4
            2xl:grid-cols-2
            min-[1750px]:grid-cols-4
          "
        >
          {[
            "Dynamic",
            "Minimal",
            "Karaoke",
            "Custom",
          ].map(
            (
              item,
              index,
            ) => (
              <button
                key={item}
                type="button"
                className={[
                  "min-w-0 rounded-lg border px-2 py-2.5 text-center text-[11px] font-medium leading-tight transition",

                  index === 0
                    ? "border-violet-500 bg-violet-50 text-violet-700"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50",
                ].join(" ")}
              >
                <span className="block truncate">
                  {item}
                </span>
              </button>
            ),
          )}
        </div>
      </ControlCard>

      {/* =================================
          VOICEOVER
      ================================= */}

      <ControlCard
        icon={Mic2}
        title="Voiceover"
      >
        <select
          className="
            w-full
            min-w-0
            rounded-lg
            border
            border-slate-200
            bg-white
            px-3
            py-2.5
            text-xs
            text-slate-700
            outline-none
            transition
            focus:border-violet-400
            focus:ring-4
            focus:ring-violet-100
          "
          defaultValue="Natural (Female)"
        >
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

        <button
          type="button"
          className="
            mt-2
            w-full
            rounded-lg
            border
            border-slate-200
            bg-white
            px-3
            py-2.5
            text-xs
            font-medium
            text-slate-700
            transition
            hover:bg-slate-50
          "
        >
          Change
        </button>
      </ControlCard>

      {/* =================================
          MUSIC
      ================================= */}

      <ControlCard
        icon={Music2}
        title="Music"
      >
        <select
          className="
            w-full
            min-w-0
            rounded-lg
            border
            border-slate-200
            bg-white
            px-3
            py-2.5
            text-xs
            text-slate-700
            outline-none
            transition
            focus:border-violet-400
            focus:ring-4
            focus:ring-violet-100
          "
          defaultValue="Chill Vibes"
        >
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

        <button
          type="button"
          className="
            mt-2
            w-full
            rounded-lg
            border
            border-slate-200
            bg-white
            px-3
            py-2.5
            text-xs
            font-medium
            text-slate-700
            transition
            hover:bg-slate-50
          "
        >
          Change
        </button>
      </ControlCard>

      {/* =================================
          BRANDING
      ================================= */}

      <ControlCard
        icon={ImagePlus}
        title="Branding"
      >
        <div className="flex min-h-[42px] items-center justify-between gap-3">
          <span className="min-w-0 text-xs text-slate-500">
            Add logo
          </span>

          <button
            type="button"
            aria-label="Toggle logo"
            className="
              flex
              h-6
              w-11
              shrink-0
              items-center
              rounded-full
              bg-violet-600
              p-1
            "
          >
            <span className="ml-auto h-4 w-4 rounded-full bg-white shadow-sm" />
          </button>
        </div>

        <button
          type="button"
          className="
            mt-2
            w-full
            rounded-lg
            border
            border-slate-200
            bg-white
            px-3
            py-2.5
            text-xs
            font-medium
            text-slate-700
            transition
            hover:bg-slate-50
          "
        >
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
    <div
      className="
        min-w-0
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-4
      "
    >
      <div className="mb-3 flex min-w-0 items-center gap-2">
        <Icon
          size={16}
          className="shrink-0 text-violet-600"
        />

        <p className="min-w-0 truncate text-xs font-semibold text-slate-800">
          {title}
        </p>
      </div>

      <div className="min-w-0">
        {children}
      </div>
    </div>
  );
}