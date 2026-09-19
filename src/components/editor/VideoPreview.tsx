import {
  Heart,
  MessageCircle,
  Play,
  Share2,
} from "lucide-react";
import Image from "next/image";

type VideoPreviewProps = {
  imagePreview: string | null;
};

export default function VideoPreview({
  imagePreview,
}: VideoPreviewProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="mx-auto max-w-[330px]">
        <div className="relative aspect-[9/16] overflow-hidden rounded-2xl bg-gradient-to-b from-[#c8a38c] via-[#8a6756] to-[#241d1d] shadow-sm">
          {imagePreview ? (
            <Image
              src={imagePreview}
              alt="Creator"
              fill
              unoptimized
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-white/10 text-6xl backdrop-blur-sm">
                  👩🏻
                </div>
              </div>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/70" />

          <div className="absolute left-4 top-4 z-10">
            <div className="flex items-center gap-2">
              <div className="relative h-8 w-8 overflow-hidden rounded-full border-2 border-white bg-rose-100">
                {imagePreview && (
                  <Image
                    src={imagePreview}
                    alt="Creator avatar"
                    fill
                    unoptimized
                    className="object-cover"
                  />
                )}
              </div>

              <div className="text-white">
                <p className="text-[11px] font-semibold">
                  Morning Habits
                </p>

                <p className="text-[9px] opacity-80">
                  for a Better You
                </p>
              </div>
            </div>
          </div>

          <div className="absolute bottom-24 left-0 right-0 z-10 px-6 text-center text-white">
            <p className="text-3xl font-black uppercase italic leading-[0.95] tracking-tight">
              3 Morning
            </p>

            <p className="text-3xl font-black uppercase italic leading-[0.95] tracking-tight text-violet-300">
              Habits
            </p>

            <p className="mt-2 text-lg italic">
              that changed my life
            </p>

            <div className="mx-auto mt-2 h-1 w-20 rotate-[-3deg] rounded-full bg-violet-400" />
          </div>

          <div className="absolute bottom-28 right-3 z-10 flex flex-col items-center gap-5 text-white">
            <div className="text-center">
              <Heart size={25} />
              <span className="text-[9px]">
                12.4K
              </span>
            </div>

            <div className="text-center">
              <MessageCircle size={25} />
              <span className="text-[9px]">
                342
              </span>
            </div>

            <div className="text-center">
              <Share2 size={25} />
              <span className="text-[9px]">
                1.1K
              </span>
            </div>
          </div>

          <div className="absolute bottom-5 left-5 right-5 z-10">
            <div className="mb-2 h-[3px] overflow-hidden rounded-full bg-white/30">
              <div className="h-full w-[25%] bg-white" />
            </div>

            <div className="flex items-center gap-2 text-xs text-white">
              <Play
                size={15}
                fill="white"
              />

              <span>00:02</span>

              <span className="opacity-50">
                /
              </span>

              <span className="opacity-60">
                00:15
              </span>
            </div>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
          <button className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600">
            ▣ &nbsp; 9:16 (TikTok)
          </button>

          <button className="flex items-center gap-2 rounded-xl border border-slate-200 px-5 text-sm font-medium">
            <Play
              size={15}
              fill="currentColor"
            />
            Play
          </button>
        </div>
      </div>
    </section>
  );
}