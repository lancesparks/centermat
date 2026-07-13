"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "../ui/Button";
import Input from "../ui/Input";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-dvh bg-ivory lg:flex">
      {/* ============================================================
          BRAND PANEL — hidden on mobile, left column on lg+
         ============================================================ */}
      <aside className="hidden lg:flex lg:w-[38%] lg:flex-col lg:justify-between bg-ink text-ivory p-10">
        {/* logo (ivory-on-ink version) */}
        <div className="flex items-center gap-3">
          <Image
            src="/centermat-logo-transparent.png"
            alt="Centermat"
            width={228}
            height={83}
            className="invert"
            priority
          />
        </div>

        {/* center pitch */}
        <div>
          <h2 className="font-display font-black uppercase text-6xl leading-[0.95]">
            CenterMat
          </h2>
          <div className="mt-6 h-1 w-16 bg-gold" />
          <p className="font-serif italic text-xl mt-8 max-w-sm leading-relaxed">
            Where the wrestling world comes together.
          </p>
        </div>

        {/* footer */}
        <p className="cm-eyebrow text-ivory/60">By Suplay</p>
      </aside>

      {/* ============================================================
          FORM COLUMN — full width mobile, right column on lg+
         ============================================================ */}
      <main className="flex-1 flex flex-col min-h-dvh lg:min-h-0 lg:justify-center">
        <div className="w-full max-w-md mx-auto px-6 pt-10 pb-8 flex flex-col flex-1 lg:flex-none">
          {/* logo — mobile only (panel shows it on lg) */}
          <div className="flex justify-center lg:hidden">
            <Image
              src="/centermat-logo-transparent.png"
              alt="Centermat"
              width={190}
              height={69}
              priority
            />
          </div>

          {/* heading */}
          <header className="mt-12 lg:mt-0 text-center lg:text-left">
            <p className="cm-eyebrow">Sign in</p>
            <h1 className="font-display font-black uppercase text-4xl leading-[0.95] mt-2 lg:text-3xl">
              Welcome back
              <span className="lg:hidden">
                <br />
                to the mat
              </span>
            </h1>
          </header>

          {/* heavy rule — mobile only */}
          <div className="cm-rule mt-6 lg:hidden" />

          {/* form */}
          <form
            className="mt-8 flex flex-col gap-5"
            onSubmit={(e) => e.preventDefault()}
          >
            {/* email */}
            <div>
              <Input
                label="email"
                type="email"
                placeholder="you@example.com"
                value={userName}
                onChange={setUserName}
              ></Input>
            </div>

            {/* password */}
            <div>
              <div className="flex items-baseline justify-between mb-2">
                <label htmlFor="password" className="cm-label">
                  Password
                </label>
                <a href="#" className="cm-eyebrow hover:text-ink">
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full bg-paper border-2 border-ink px-4 py-3.5 pr-16 text-base placeholder:text-ink-mute focus:outline-none focus:border-gold"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="cm-eyebrow absolute right-4 top-1/2 -translate-y-1/2 hover:text-ink"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* sign in */}
            <Button variant="ink" onClick={() => console.log("hello")}>
              Sign In
            </Button>
          </form>

          {/* footer — pushed to bottom on mobile, inline on desktop */}
          <footer className="mt-auto lg:mt-10 pt-10 lg:pt-0 text-center">
            <p className="text-base">
              New to Centermat?{" "}
              <Link
                href="/create-user"
                className="font-bold underline underline-offset-4  cursor-pointer"
              >
                Create account
              </Link>
            </p>
            <p className="cm-eyebrow mt-6 lg:hidden">By Suplay</p>
          </footer>
        </div>
      </main>
    </div>
  );
}
