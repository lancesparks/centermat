"use client";
import { useRouter } from "next/navigation";
import { Button } from "../../ui/Button";

export default function Dashboard() {
  const router = useRouter();

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 mt-24 lg:py-12">
      {/* ---- hero ---- */}
      <div className="flex flex-col items-center text-center">
        {/* plus emblem */}
        <div className="flex size-16 lg:size-20 items-center justify-center rounded-full border-2 border-ink">
          <span className="text-3xl leading-none text-ink">+</span>
        </div>

        <p className="cm-eyebrow mt-6">Get started</p>
        <h1 className="font-display font-black uppercase text-4xl lg:text-5xl leading-[0.95] mt-2">
          {/* short on mobile, full on desktop */}
          <span className="lg:hidden">No events yet</span>
          <span className="hidden lg:inline">
            You don&apos;t have any events yet
          </span>
        </h1>

        {/* CTAs — full-width stacked on mobile, inline on desktop */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full sm:w-auto">
          <Button
            variant="ink"
            type="button"
            onClick={() => router.push("/create-tournament")}
            classes="px-8  py-4 sm:w-auto"
          >
            + Create Tournament
          </Button>
        </div>
      </div>
      {/* ---- divider ---- */}
      <div className="cm-rule mt-12 lg:mt-14" />
    </div>
  );
}
