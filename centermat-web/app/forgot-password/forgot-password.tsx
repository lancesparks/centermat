"use client";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { forgotPassword } from "../actions/api";
import LoginLayout from "../ui/LoginLayout";
import Image from "next/image";
import Link from "next/link";
import Button from "../ui/Button";
import Input from "../ui/Input";

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm({
    defaultValues: {
      email: ""
    },
    onSubmit: async ({ value }) => {
      setMessage("");
      setErrorMessage("");

      const { email } = value;
      try {
        const result = await forgotPassword(email);

        if (result.success) {
          setMessage(
            result.message || "We've sent a password reset link to your email!"
          );
        } else {
          setErrorMessage(
            result.error || "We couldn't find an account with that email."
          );
        }
      } catch (e) {
        setErrorMessage(
          "Something went wrong. Please check your internet connection and try again."
        );
      }
    }
  });

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
        {message.length > 0 && (
          <p className="font-display mt-4 text-green-600">{message}</p>
        )}
        {errorMessage.length > 0 && (
          <p className="font-display text-red-500 mt-4">{errorMessage}</p>
        )}
      </header>

      {/* heavy rule — mobile only */}
      <div className="cm-rule mt-6 lg:hidden" />

      {/* form (Only show if we haven't successfully sent the email yet) */}
      {message.length === 0 ? (
        <form
          className="mt-8 flex flex-col gap-5"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div>
            <form.Field
              name="email"
              validators={{
                onSubmit: ({ value }) => {
                  if (!value) return "Email is required.";
                  // Simple regex check to help the user catch typos before submitting
                  if (!/\S+@\S+\.\S+/.test(value))
                    return "Please enter a valid email address.";
                  return null;
                }
              }}
            >
              {(field) => (
                <div>
                  <Input
                    label="Email"
                    type="email"
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

          {/* Use form.Subscribe to access the isSubmitting state dynamically */}
          <form.Subscribe selector={(state) => [state.isSubmitting]}>
            {([isSubmitting]) => (
              <Button variant="ink" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Submit"}
              </Button>
            )}
          </form.Subscribe>
        </form>
      ) : (
        // Clean success state
        <div className="mt-8 text-center lg:text-left">
          <p className="text-gray-600">
            Please check your spam or junk folder if you don't receive it in the
            next few minutes.
          </p>
        </div>
      )}

      {/* footer — pushed to bottom on mobile, inline on desktop */}
      <footer className="mt-auto lg:mt-10 pt-10 lg:pt-0 text-center">
        {message.length === 0 ? (
          <p className="text-base items-center justify-center">
            Have an account?
            <Link
              href="/login"
              className="font-bold underline underline-offset-4 cursor-pointer ml-1"
            >
              Sign In
            </Link>
          </p>
        ) : (
          <p className="text-base">
            <Link
              href="/login"
              className="font-bold underline underline-offset-4 cursor-pointer ml-1"
            >
              Return
            </Link>
          </p>
        )}
        <p className="cm-eyebrow mt-6 lg:hidden">By Suplay</p>
      </footer>
    </LoginLayout>
  );
}
