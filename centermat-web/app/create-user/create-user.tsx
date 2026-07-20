"use client";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import LoginLayout from "../ui/LoginLayout";
import Image from "next/image";
import Link from "next/link";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Dropdown from "../ui/Dropdown";
import { DateOfBirthSelect } from "../ui/DateOfBirthSelect";
import { registerUser } from "../actions/api";
import { useState } from "react";

const ROLES = [
  { label: "Organizer", value: "organizer" },
  { label: "Athlete", value: "athlete" },
  { label: "Coach", value: "coach" },
  { label: "Event Staff", value: "event_staff" },
  { label: "Fan", value: "fan" }
];

export default function CreateUserPage() {
  const router = useRouter();
  const [createError, setCreateError] = useState("");

  function handleSetPhoneNumber(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 10);
    let formatted = digits;
    if (digits.length > 6) {
      formatted = `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
    } else if (digits.length > 3) {
      formatted = `${digits.slice(0, 3)}-${digits.slice(3)}`;
    }
    return formatted;
  }

  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      email: "",
      phoneNumber: "",
      role: "",
      password: "",
      confirmPassword: ""
    },
    onSubmit: async ({ value, formApi }) => {
      const { confirmPassword, ...submissionData } = value;

      const result = await registerUser(submissionData);

      if (result.success) {
        formApi.reset();
        router.push("/login");
      } else {
        setCreateError(result.error);
      }
    }
  });

  return (
    <LoginLayout sidebarHeader="Join Centermat">
      {/* logo — mobile only */}
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
        <p className="cm-eyebrow">CREATE ACCOUNT</p>
        <h1 className="font-display font-black uppercase text-4xl leading-[0.95] mt-2 lg:text-3xl">
          GET STARTED
        </h1>
        {createError.length > 0 && (
          <p className="text-red-500 text-sm mt-1">{createError}</p>
        )}
      </header>

      {/* heavy rule — mobile only */}
      <div className="cm-rule mt-6 lg:hidden" />

      {/* form */}
      <form
        className="mt-8 flex flex-col gap-5"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        {/* First Name */}
        <form.Field
          name="firstName"
          validators={{
            onSubmit: ({ value }) => (!value ? "First name is required." : null)
          }}
        >
          {(field) => (
            <div>
              <Input
                label="First Name"
                type="text"
                placeholder="First Name"
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

        {/* Last Name */}
        <form.Field
          name="lastName"
          validators={{
            onSubmit: ({ value }) => (!value ? "Last name is required." : null)
          }}
        >
          {(field) => (
            <div>
              <Input
                label="Last Name"
                type="text"
                placeholder="Last Name"
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

        {/* Phone Number */}
        <form.Field
          name="phoneNumber"
          validators={{
            onSubmit: ({ value }) =>
              !value ? "Phone number is required." : null
          }}
        >
          {(field) => (
            <div>
              <Input
                label="Phone Number"
                type="tel"
                placeholder="Phone Number"
                value={field.state.value}
                onChange={(e) => {
                  const formatted = handleSetPhoneNumber(e);
                  field.handleChange(formatted);
                }}
              />
              {field.state.meta.errors.length > 0 && (
                <p className="text-red-500 text-sm mt-1">
                  {field.state.meta.errors.join(", ")}
                </p>
              )}
            </div>
          )}
        </form.Field>

        {/* Email */}
        <form.Field
          name="email"
          validators={{
            onSubmit: ({ value }) => (!value ? "Email is required." : null)
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

        {/* Date of Birth */}
        <form.Field
          name="dateOfBirth"
          validators={{
            onSubmit: ({ value }) =>
              !value ? "Date of birth is required." : null
          }}
        >
          {(field) => (
            <div>
              <DateOfBirthSelect onChange={(e) => field.handleChange(e)} />
              {field.state.meta.errors.length > 0 && (
                <p className="text-red-500 text-sm mt-1">
                  {field.state.meta.errors.join(", ")}
                </p>
              )}
            </div>
          )}
        </form.Field>

        {/* Role */}
        <form.Field
          name="role"
          validators={{
            onSubmit: ({ value }) => (!value ? "Role is required." : null)
          }}
        >
          {(field) => {
            // Safely find the label associated with the selected role code
            const selectedRole = ROLES.find(
              (r) => r.value === field.state.value
            );
            const currentLabel = selectedRole ? selectedRole.label : "";

            return (
              <div>
                <Dropdown
                  label="Select Role"
                  placeholder="Select a role"
                  value={currentLabel}
                  values={ROLES}
                  onChange={(val) => {
                    if (val) field.handleChange(val);
                  }}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-red-500 text-sm mt-1">
                    {field.state.meta.errors.join(", ")}
                  </p>
                )}
              </div>
            );
          }}
        </form.Field>

        {/* Password Matching Block */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Password */}
          <form.Field
            name="password"
            validators={{
              onSubmit: ({ value, fieldApi }) => {
                if (!value) return "Password is required.";
                // Accessing form-tracked confirmPassword value directly
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

        {/* Access the form-level pending state */}

        <form.Subscribe
          selector={(state) => [state.isSubmitting, state.canSubmit]}
        >
          {([isSubmitting, canSubmit]) => (
            <Button
              variant="ink"
              type="submit"
              disabled={isSubmitting || !canSubmit}
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </Button>
          )}
        </form.Subscribe>
      </form>

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
