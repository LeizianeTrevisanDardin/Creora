const steps = [
  {
    number: 1,
    title: "Input",
    subtitle: "Photo & prompt",
  },
  {
    number: 2,
    title: "Script",
    subtitle: "AI generates concept",
  },
  {
    number: 3,
    title: "Scenes",
    subtitle: "Review & edit",
  },
  {
    number: 4,
    title: "Generate",
    subtitle: "Create your video",
  },
  {
    number: 5,
    title: "Export",
    subtitle: "Download & share",
  },
];

export default function StepProgress() {
  return (
    <div className="grid gap-2 md:grid-cols-5">
      {steps.map((step) => {
        const active = step.number === 1;

        return (
          <div
            key={step.number}
            className={[
              "flex min-h-[62px] items-center gap-3 rounded-xl border px-4",
              active
                ? "border-violet-200 bg-[#f3efff]"
                : "border-slate-200 bg-white",
            ].join(" ")}
          >
            <div
              className={[
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
                active
                  ? "bg-violet-600 text-white"
                  : "bg-slate-100 text-slate-500",
              ].join(" ")}
            >
              {step.number}
            </div>

            <div className="min-w-0">
              <p
                className={[
                  "text-sm font-semibold",
                  active
                    ? "text-violet-700"
                    : "text-slate-700",
                ].join(" ")}
              >
                {step.title}
              </p>

              <p className="truncate text-[11px] text-slate-400">
                {step.subtitle}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}