"use client";

import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";

export default function Page() {
  return (
    <div className="flex min-h-screen bg-[#f8f9fc]">
      <Sidebar />

      <div className="min-w-0 flex-1">
        <Header />

        <main className="mx-auto w-full max-w-[1800px] px-3 py-5 sm:px-4 md:px-5 lg:px-6 xl:px-7">
          <div className="mb-5 sm:mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
              AI Tools
            </h1>

            <p className="mt-1 max-w-2xl text-sm text-slate-500 sm:text-base">
              Access Creora&apos AI tools for content creation.
            </p>
          </div>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <div className="flex min-h-[280px] items-center justify-center text-center">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  AI Tools
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  We will build this section next.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
