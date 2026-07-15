"use client";

import { useState } from "react";
import LoginLayout from "../ui/LoginLayout";
import Image from "next/image";
import Link from "next/link";
import Button from "../ui/Button";
import Input from "../ui/Input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  return (
    <LoginLayout sidebarHeader="Centermat">
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
        <h1 className="font-display font-black uppercase text-4xl leading-[0.95] mt-2 lg:text-3xl">
          FIND YOUR ACCOUNT
        </h1>
      </header>

      {/* heavy rule — mobile only */}
      <div className="cm-rule mt-6 lg:hidden" />

      {/* form */}
      <form
        className="mt-8 flex flex-col gap-5"
        onSubmit={(e) => e.preventDefault()}
      >
        <div>
          <Input
            label="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={setEmail}
          ></Input>
        </div>

        <Button variant="ink" onClick={() => console.log("hello")}>
          Submit
        </Button>
      </form>

      {/* footer — pushed to bottom on mobile, inline on desktop */}
      <footer className="mt-auto lg:mt-10 pt-10 lg:pt-0 text-center">
        <p className="text-base">
          Have an account?
          <Link
            href="/login"
            className="font-bold underline underline-offset-4 cursor-pointer ml-1"
          >
            Sign In
          </Link>
        </p>
        <p className="cm-eyebrow mt-6 lg:hidden">By Suplay</p>
      </footer>
    </LoginLayout>
  );
}
