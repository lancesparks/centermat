"use client";

import { useState } from "react";
import LoginLayout from "../ui/LoginLayout";
import Image from "next/image";
import Link from "next/link";
import Button from "../ui/Button";
import Input from "../ui/Input";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  return (
    <LoginLayout
      sidebarHeader="CENTERMAT"
      sidebarQuote="Where the wrestling world comes together."
    >
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
            <Link href="/forgot-password" className="cm-eyebrow hover:text-ink">
              Forgot?
            </Link>
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
              className="cm-eyebrow absolute right-4 top-1/2 -translate-y-1/2 hover:text-ink cursor-pointer"
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
          New to Centermat?
          <Link
            href="/create-user"
            className="font-bold underline underline-offset-4 cursor-pointe ml-1"
          >
            Create account
          </Link>
        </p>
        <p className="cm-eyebrow mt-6 lg:hidden">By Suplay</p>
      </footer>
    </LoginLayout>
  );
}
