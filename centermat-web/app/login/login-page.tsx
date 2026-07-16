"use client";

import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { login } from "../actions/api";
import LoginLayout from "../ui/LoginLayout";
import Image from "next/image";
import Link from "next/link";
import Button from "../ui/Button";
import Input from "../ui/Input";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  const router = useRouter();
  const form = useForm({
    defaultValues: {
      userName: "",
      password: ""
    },
    onSubmit: async ({ value, formApi }) => {
      const { userName, password } = value;
      login(userName, password)
        .then((data: any) => {
          localStorage.setItem("token", data.access_token);
          // router.push("/tournaments");
        })
        .catch((err) => {
          setLoginError(err.message);
        });
    }
  });

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
        onSubmit={(e) => {
          setLoginError("");
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        {/* email */}
        <div>
          <form.Field
            name="userName"
            validators={{
              onSubmit: ({ value }) => (!value ? "Username is required." : null)
            }}
          >
            {(field) => (
              <div>
                <Input
                  label="username"
                  type="text"
                  placeholder="you@example.com"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e)}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-red-500 text-sm mt-1">
                    {field.state.meta.errors.join(", ")}
                  </p>
                )}
              </div>
            )}
          </form.Field>
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
            <form.Field
              name="password"
              validators={{
                onSubmit: ({ value }) =>
                  !value ? "Password is required." : null
              }}
            >
              {(field) => (
                <div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full bg-paper border-2 border-ink px-4 py-3.5 pr-16 text-base placeholder:text-ink-mute focus:outline-none focus:border-gold"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="cm-eyebrow absolute right-4 top-1/2 -translate-y-1/2 hover:text-ink cursor-pointer"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-red-500 text-sm mt-1">
                      {field.state.meta.errors.join(", ")}
                    </p>
                  )}
                  {loginError.length > 0 && (
                    <p className="text-red-500 text-sm mt-1">{loginError}</p>
                  )}
                </div>
              )}
            </form.Field>
          </div>
        </div>

        {/* sign in */}
        <Button variant="ink" type="submit">
          Sign In
        </Button>
      </form>

      {/* footer — pushed to bottom on mobile, inline on desktop */}
      <footer className="mt-auto lg:mt-10 pt-10 lg:pt-0 text-center">
        <p className="text-base">
          New to Centermat?
          <Link
            href="/create-user"
            className="font-bold underline underline-offset-4 ml-1"
          >
            Create account
          </Link>
        </p>
        <p className="cm-eyebrow mt-6 lg:hidden">By Suplay</p>
      </footer>
    </LoginLayout>
  );
}
