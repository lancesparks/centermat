"use client";

import { useForm } from "@tanstack/react-form";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button, Input, LoginLayout } from "@/app/ui";
import { useResetPassword } from "@/hooks";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { mutateAsync: resetPassword, isPending } = useResetPassword();

  useEffect(() => {
    if (!token) {
      setErrorMessage(
        "No reset token found. Please request a new password reset link."
      );
    }
  }, [token]);

  const form = useForm({
    defaultValues: {
      password: "",
      confirmPassword: ""
    },
    onSubmit: async ({ value }) => {
      if (!token) {
        setErrorMessage("Missing reset token.");
        return;
      }

      setMessage("");
      setErrorMessage("");

      const { password } = value;

      try {
        const result = await resetPassword({
          token: token,
          newPassword: password
        });

        if (result.success) {
          setMessage("Password successfully updated!");
        } else {
          setErrorMessage(result.error);
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
          RESET PASSWORD
        </h1>

        {message.length > 0 && (
          <p className="font-display text-green-600 mt-1">{message}</p>
        )}
        {errorMessage.length > 0 && (
          <p className="font-display text-red-500 mt-1">{errorMessage}</p>
        )}
      </header>

      {/* heavy rule — mobile only */}
      <div className="cm-rule mt-6 lg:hidden" />

      {/* form (Only render if password wasn't successfully updated yet) */}
      {message.length === 0 ? (
        <form
          className="mt-8 flex flex-col gap-5"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            {/* Password */}
            <form.Field
              name="password"
              validators={{
                onSubmit: ({ value, fieldApi }) => {
                  if (!value) return "Password is required.";
                  const confirmVal =
                    fieldApi.form.getFieldValue("confirmPassword");
                  if (value !== confirmVal) return "Passwords do not match.";
                  return null;
                }
              }}
            >
              {(field) => (
                <div>
                  <Input
                    label="Password"
                    type="password"
                    placeholder="********"
                    value={field.state.value}
                    onChange={(val) => field.handleChange(val)}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-red-500 text-sm mt-1">
                      {field.state.meta.errors.join(", ")}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            {/* Confirm Password */}
            <form.Field
              name="confirmPassword"
              validators={{
                onSubmit: ({ value, fieldApi }) => {
                  if (!value) return "Please confirm your password.";
                  const mainPassword = fieldApi.form.getFieldValue("password");
                  if (value !== mainPassword) return "Passwords do not match.";
                  return null;
                }
              }}
            >
              {(field) => (
                <div>
                  <Input
                    label="Confirm Password"
                    type="password"
                    placeholder="********"
                    value={field.state.value}
                    onChange={(val) => field.handleChange(val)}
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

          <Button variant="ink" type="submit" disabled={isPending || !token}>
            {isPending ? "Updating..." : "Submit"}
          </Button>
        </form>
      ) : (
        <div className="mt-8">
          <Link
            href="/login"
            className="font-bold underline underline-offset-4 cursor-pointer"
          >
            Click here to sign in with your new password
          </Link>
        </div>
      )}

      {/* footer */}
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

// Wrap in Suspense to satisfy Next.js App Router requirements for useSearchParams
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
