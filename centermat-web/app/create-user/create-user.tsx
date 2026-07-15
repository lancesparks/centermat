"use client";

import { useState } from "react";
import LoginLayout from "../ui/LoginLayout";
import Image from "next/image";
import Link from "next/link";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Dropdown from "../ui/Dropdown";
import { DateOfBirthSelect } from "../ui/DateOfBirthSelect";

export default function CreateUserPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [roleLabel, setRoleLabel] = useState("");

  const roles = [
    { label: "Organizer", value: "organizer" },
    { label: "Athlete", value: "athlete" },
    { label: "Coach", value: "coach" },
    { label: "Event Staff", value: "event_staff" },
    { label: "Fan", value: "fan" }
  ];

  function handleSetPhoneNumber(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 10); // strip non-digits, cap at 10

    let formatted = digits;
    if (digits.length > 6) {
      formatted = `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
    } else if (digits.length > 3) {
      formatted = `${digits.slice(0, 3)}-${digits.slice(3)}`;
    }
    setPhoneNumber(formatted);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // if (password !== confirmPassword) {
    //   console.log("passwords don't match");
    //   return;
    // }
    console.log({
      firstName,
      lastName,
      email,
      dateOfBirth,
      role,
      phoneNumber,
      password
    });
    // next step: POST to FastAPI /auth/register
  }

  function handleSetRole(e: string | null) {
    console.log(e);
    if (!e) {
      return;
    }

    const roleLabel = roles.filter((role) => role.value === e)[0].label;
    setRole(e);
    setRoleLabel(roleLabel);
  }

  return (
    <LoginLayout sidebarHeader="Join Centermat">
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
        <p className="cm-eyebrow">CREATE ACCOUNT</p>
        <h1 className="font-display font-black uppercase text-4xl leading-[0.95] mt-2 lg:text-3xl">
          GET STARTED
        </h1>
      </header>
      {/* heavy rule — mobile only */}
      <div className="cm-rule mt-6 lg:hidden" />
      {/* form */}
      <form className="mt-8 flex flex-col gap-5" onSubmit={handleSubmit}>
        {/* email */}
        <div>
          <Input
            label="First Name"
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={setFirstName}
          ></Input>
        </div>
        <div>
          <Input
            label="Last Name"
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={setLastName}
          ></Input>
        </div>
        <div>
          <Input
            label="phone number"
            type="tel"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={handleSetPhoneNumber}
          ></Input>
        </div>
        <div>
          <Input
            label="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={setEmail}
          ></Input>
        </div>
        <div>
          <DateOfBirthSelect onChange={setDateOfBirth}></DateOfBirthSelect>
        </div>

        <div>
          <Dropdown
            label="Select Role"
            placeholder="Select a role"
            value={roleLabel} // Keeps dropdown UI in-sync
            values={roles}
            onChange={handleSetRole}
          />
        </div>

        {/* password */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="password"
            type="password"
            placeholder="********"
            value={password}
            onChange={setPassword}
          ></Input>
          <Input
            label="confirm password"
            type="password"
            placeholder="********"
            value={confirmPassword}
            onChange={setConfirmPassword}
          ></Input>
        </div>

        {/* sign in */}
        <Button variant="ink" type="submit">
          Create Account
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
