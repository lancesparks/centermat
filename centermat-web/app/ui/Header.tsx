"use client";

import Image from "next/image";
import { useCurrentUser } from "@/hooks";
import { useRouter } from "next/navigation";

export function Header() {
  const router = useRouter();
  const { data: user } = useCurrentUser();

  const initials =
    user?.first_name && user?.last_name
      ? `${user.first_name[0]}${user.last_name[0]}`
      : "";
  const primaryRole = user?.roles?.[0] ?? "";

  const now = new Date();
  const dateLabel = now
    .toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "2-digit"
    })
    .toUpperCase();

  return (
    <header className="bg-ivory border-b-2 border-ink">
      <div className="flex items-center justify-between h-14 px-4 lg:h-16 lg:px-6">
        <button
          type="button"
          aria-label="Menu"
          className="flex flex-col gap-1 lg:hidden cursor-pointer"
        >
          <span className="block h-0.5 w-5 bg-ink" />
          <span className="block h-0.5 w-5 bg-ink" />
          <span className="block h-0.5 w-5 bg-ink" />
        </button>

        <div className="flex-1 flex justify-center lg:flex-none lg:justify-start">
          <Image
            className="cursor-pointer"
            onClick={() => router.push("/dashboard")}
            src="/centermat-logo-transparent.png"
            alt="Centermat"
            width={160}
            height={64}
            priority
          />
        </div>

        {/* ---- right: date + divider + user (desktop only) ---- */}
        <div className="hidden lg:flex items-center gap-4">
          {/* date */}
          <p className="cm-eyebrow text-ink-mute">{dateLabel}</p>

          {/* vertical divider */}
          <span className="h-6 w-px bg-ivory-line" />

          {/* user */}
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-full bg-midnight">
              <span className="font-display font-extrabold text-xs text-ivory tracking-wide">
                {initials}
              </span>
            </div>
            <div className="leading-tight">
              <p className="font-display font-extrabold uppercase text-sm text-ink tracking-[0.08em]">
                {user?.first_name?.[0]}. {user?.last_name}
              </p>
              <p className="cm-eyebrow">{primaryRole}</p>
            </div>
          </div>
        </div>

        {/* spacer to balance the hamburger so the mobile logo stays centered */}
        <div className="w-5 lg:hidden" />
      </div>
    </header>
  );
}
