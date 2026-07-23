"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { weightClassesBySport, SPORTS } from "@/lib/";
import {
  Button,
  Input,
  Dropdown,
  DateSelect,
  AddressInput,
  ErrorMessage,
  Checkbox
} from "@/app/ui";

const sections = [
  { id: "basics", label: "Basics" },
  { id: "divisions", label: "Divisions" },
  { id: "registration", label: "Registration & Fees" },
  { id: "officials", label: "Officials & Staff" }
];

const FORMATS = ["Bracket", "Round Robin", "Dual Meet"];
const STAFF_ROLES = [
  { label: "Referee", value: "referee" },
  { label: "Table Official", value: "table_official" },
  { label: "Head Official", value: "head_official" },
  { label: "Event Staff", value: "event_staff" }
];

type WeightClass = { id: string; name: string; maxLb: string; mxKg: string };
type Invite = { id: string; email: string; role: string; status: string };

export default function CreateTournament() {
  const [activeSection, setActiveSection] = useState("basics");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const router = useRouter();

  function handleCancel() {
    // if (confirm("Discard this tournament? Your changes won't be saved.")) {
    //   router.push("/dashboard");
    // }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveSection(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    sections.forEach((s) => {
      const el = sectionRefs.current[s.id];
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) =>
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth" });

  const form = useForm({
    defaultValues: {
      name: "",
      startDate: "",
      endDate: "",
      venue: "",
      format: "Bracket",
      description: "",
      sport: "",
      ageDivisions: [] as string[],
      weightClasses: [] as any,
      registrationOpens: "",
      registrationCloses: "",
      feePerAthlete: "",
      teamFee: "",
      requireWaiver: false,
      allowRefunds: false,
      invites: [] as Invite[]

      // name: "Seabreeze ",
      // startDate: "2026-07-04",
      // endDate: "2026-08-01",
      // venue:
      //   "Seabreeze High School, North Oleander Avenue, Daytona Beach, FL, USA",
      // format: "Bracket",
      // description: "",
      // sport: "muay_thai",
      // ageDivisions: [],
      // weightClasses: [
      //   {
      //     id: "0ccb17d1-d165-4933-bda6-3d406f0d6c68",
      //     name: "Mini Flyweight",
      //     maxLb: "105",
      //     maxKg: "47.6"
      //   },
      //   {
      //     id: "13ce0594-d946-4332-9853-3d8021fe88bd",
      //     name: "Light Flyweight",
      //     maxLb: "108",
      //     maxKg: "49"
      //   },
      //   {
      //     id: "489c696a-b82c-454f-ad6b-25ced5cc7bda",
      //     name: "Flyweight",
      //     maxLb: "112",
      //     maxKg: "50.8"
      //   },
      //   {
      //     id: "c901206f-d6a4-4ba4-b042-bfd73dd122dd",
      //     name: "Super Flyweight",
      //     maxLb: "115",
      //     maxKg: "52.2"
      //   },
      //   {
      //     id: "4959f805-7f91-44f7-8490-af4003d09da4",
      //     name: "Bantamweight",
      //     maxLb: "118",
      //     maxKg: "53.5"
      //   },
      //   {
      //     id: "d99c2018-ac67-45cd-9036-3992b75f3b58",
      //     name: "Super Bantamweight",
      //     maxLb: "122",
      //     maxKg: "55.3"
      //   },
      //   {
      //     id: "85508134-667f-4745-8edd-7307e65e7dc8",
      //     name: "Featherweight",
      //     maxLb: "126",
      //     maxKg: "57.2"
      //   },
      //   {
      //     id: "09366167-3782-4c6f-91c9-50f132ac1064",
      //     name: "Super Featherweight",
      //     maxLb: "130",
      //     maxKg: "59"
      //   },
      //   {
      //     id: "8bc9d650-4f07-4add-b9e8-a40701437162",
      //     name: "Lightweight",
      //     maxLb: "135",
      //     maxKg: "61.2"
      //   },
      //   {
      //     id: "a3a6c3f9-1d4c-42e0-af8c-95b83f320d3f",
      //     name: "Super Lightweight",
      //     maxLb: "140",
      //     maxKg: "63.5"
      //   },
      //   {
      //     id: "b78318a0-b345-4c60-a5f5-b83733efc544",
      //     name: "Welterweight",
      //     maxLb: "147",
      //     maxKg: "66.7"
      //   },
      //   {
      //     id: "b21c5803-6ece-446e-88d8-887ae802ef12",
      //     name: "Super Welterweight",
      //     maxLb: "154",
      //     maxKg: "69.9"
      //   },
      //   {
      //     id: "46f4d01e-cd3c-4ed7-88b9-53c5eff4026d",
      //     name: "Middleweight",
      //     maxLb: "160",
      //     maxKg: "72.6"
      //   },
      //   {
      //     id: "2b52af67-7f18-4a5a-b289-c4f92fe95702",
      //     name: "Super Middleweight",
      //     maxLb: "168",
      //     maxKg: "76.2"
      //   },
      //   {
      //     id: "80da10f2-7678-4b88-b7c5-943aa2549cf4",
      //     name: "Light Heavyweight",
      //     maxLb: "175",
      //     maxKg: "79.4"
      //   },
      //   {
      //     id: "8df682e4-70f5-4f5f-ad2f-335ea4977f5c",
      //     name: "Cruiserweight",
      //     maxLb: "200",
      //     maxKg: "90.7"
      //   },
      //   {
      //     id: "1858048e-de65-4e00-a136-9287ad76c72b",
      //     name: "Heavyweight",
      //     maxLb: "",
      //     maxKg: ""
      //   }
      // ],
      // registrationOpens: "2026-07-12",
      // registrationCloses: "2026-07-18",
      // signupFee: "45",
      // teamFee: "",
      // requireWaiver: true,
      // allowRefunds: true,
      // invites: []
    },
    onSubmit: async ({ value }) => {
      console.log(value); // TODO: POST to /tournament/ then children
    }
  });

  return (
    <div className="lg:flex min-h-dvh bg-ivory">
      {/* ================= SIDEBAR ================= */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:justify-between bg-ink text-ivory p-8 sticky top-0 h-dvh">
        <div>
          <p className="cm-eyebrow text-ivory/60">New Tournament</p>
          <nav className="mt-10 flex flex-col gap-1">
            {sections.map((s, i) => {
              const active = activeSection === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => scrollTo(s.id)}
                  className={`flex items-center gap-3 py-3 pl-4 text-left border-l-2 transition-colors cursor-pointer ${
                    active
                      ? "border-gold text-ivory"
                      : "border-transparent text-ivory/50 hover:text-ivory/80"
                  }`}
                >
                  <span
                    className={`flex size-6 items-center justify-center rounded-full border text-xs ${
                      active ? "border-gold text-gold" : "border-ivory/40"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="font-display font-extrabold uppercase text-sm tracking-[0.1em]">
                    {s.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
        <p className="cm-eyebrow text-ivory/50">By Suplay</p>
      </aside>

      {/* ================= FORM ================= */}
      <main className="flex-1">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="max-w-3xl mx-auto px-6 py-12 flex flex-col gap-16 min-h-dvh lg:pb-[80vh]"
        >
          {/* ---- 01 · BASICS ---- */}
          <section
            id="basics"
            ref={(el) => {
              sectionRefs.current.basics = el;
            }}
          >
            <SectionHead
              eyebrow="01 · Tournament Basics"
              title="Tell us about your event"
            />
            <div className="mt-8 flex flex-col gap-6">
              <form.Field
                name="name"
                validators={{
                  onSubmit: ({ value }) =>
                    !value ? "Tournament name is required." : null
                }}
              >
                {(f) => (
                  <Labeled label="Tournament Name">
                    <Input
                      placeholder="Ridgeline Fall Classic"
                      value={f.state.value}
                      onChange={f.handleChange}
                    ></Input>
                    {f.state.meta.errors.length > 0 && (
                      <ErrorMessage>
                        {f.state.meta.errors.join(", ")}
                      </ErrorMessage>
                    )}
                  </Labeled>
                )}
              </form.Field>

              <div className="grid grid-cols-2 gap-4">
                <form.Field
                  name="startDate"
                  validators={{
                    onSubmit: ({ value }) =>
                      !value ? "Start date is required." : null
                  }}
                >
                  {(f) => (
                    <Labeled label="Start Date">
                      <DateSelect
                        value={f.state.value}
                        onChange={f.handleChange}
                      ></DateSelect>
                      {f.state.meta.errors.length > 0 && (
                        <ErrorMessage>
                          {f.state.meta.errors.join(", ")}
                        </ErrorMessage>
                      )}
                    </Labeled>
                  )}
                </form.Field>
                <form.Field
                  name="endDate"
                  validators={{
                    onSubmit: ({ value }) =>
                      !value ? "End date is required." : null
                  }}
                >
                  {(f) => (
                    <Labeled label="End Date">
                      <DateSelect
                        value={f.state.value}
                        onChange={f.handleChange}
                      ></DateSelect>
                      {f.state.meta.errors.length > 0 && (
                        <ErrorMessage>
                          {f.state.meta.errors.join(", ")}
                        </ErrorMessage>
                      )}
                    </Labeled>
                  )}
                </form.Field>
              </div>

              <form.Field
                name="venue"
                validators={{
                  onSubmit: ({ value }) =>
                    !value ? "Venue is required." : null
                }}
              >
                {(f) => (
                  <Labeled label="Venue">
                    <AddressInput
                      placeholder="Ridgeline High School Fieldhouse, Denver CO"
                      value={f.state.value}
                      onChange={f.handleChange}
                    />
                    {f.state.meta.errors.length > 0 && (
                      <ErrorMessage>
                        {f.state.meta.errors.join(", ")}
                      </ErrorMessage>
                    )}
                  </Labeled>
                )}
              </form.Field>

              <form.Field
                name="sport"
                validators={{
                  onSubmit: ({ value }) =>
                    !value ? "Sport is required." : null
                }}
              >
                {(f) => {
                  const selectedSport = SPORTS.find(
                    (r) => r.value === f.state.value
                  );
                  const currentLabel = selectedSport ? selectedSport.label : "";
                  return (
                    <Labeled label="sport">
                      <Dropdown
                        placeholder="Select a sport"
                        value={currentLabel}
                        values={SPORTS}
                        onChange={(selectedSport) => {
                          // 1. Update the sport field value
                          f.handleChange(selectedSport);

                          // 2. Derive defaults immediately
                          const defaults =
                            weightClassesBySport[
                              selectedSport as keyof typeof weightClassesBySport
                            ] ?? [];

                          // 3. Set the updated weight classes directly into the form
                          form.setFieldValue(
                            "weightClasses",
                            defaults.map((wc: any, i: number) => ({
                              id: crypto.randomUUID(),
                              name: wc.class || `Class ${i + 1}`,
                              maxLb:
                                wc.maxWeightLbs === null
                                  ? ""
                                  : String(wc.maxWeightLbs),
                              maxKg:
                                wc.maxWeightKg === null
                                  ? ""
                                  : String(wc.maxWeightKg)
                            }))
                          );
                        }}
                      />
                      {f.state.meta.errors.length > 0 && (
                        <ErrorMessage>
                          {f.state.meta.errors.join(", ")}
                        </ErrorMessage>
                      )}
                    </Labeled>
                  );
                }}
              </form.Field>

              <form.Field name="format">
                {(f) => (
                  <Labeled label="Format">
                    <div className="grid grid-cols-3 gap-4">
                      {FORMATS.map((opt) => (
                        <SegBtn
                          key={opt}
                          label={opt}
                          selected={f.state.value === opt}
                          onClick={() => f.handleChange(opt)}
                        />
                      ))}
                    </div>
                  </Labeled>
                )}
              </form.Field>

              <form.Field name="description">
                {(f) => (
                  <Labeled label="(Optional) Description">
                    <textarea
                      rows={4}
                      className={`${inputClass} resize-none`}
                      placeholder="Let athletes and coaches know what to expect…"
                      value={f.state.value}
                      onChange={(e) => f.handleChange(e.target.value)}
                    />
                  </Labeled>
                )}
              </form.Field>
            </div>
          </section>

          {/* ---- 02 · DIVISIONS & WEIGHT CLASSES ---- */}
          <section
            id="divisions"
            ref={(el) => {
              sectionRefs.current.divisions = el;
            }}
          >
            <SectionHead
              eyebrow="02 · Divisions & Weight Classes"
              title="Who's competing?"
            />

            <div className="mt-8 flex flex-col gap-8">
              {/* weight class table */}
              <form.Field
                name="weightClasses"
                validators={{
                  onSubmit: ({ value }) =>
                    !value || value.length === 0
                      ? "Weight classes are required."
                      : null
                }}
              >
                {(f) => {
                  const hasWeightClasses = f.state.value.length > 0;

                  return (
                    <div>
                      <div className="border-2 border-ink">
                        {/* header row */}
                        <div className="flex items-center bg-ink text-ivory px-4 py-2">
                          <span className="cm-eyebrow text-ivory flex-1">
                            Class
                          </span>
                          <span className="cm-eyebrow text-ivory w-24">
                            Max Lb
                          </span>
                          <span className="cm-eyebrow text-ivory w-24">
                            Max Kg
                          </span>
                          <span className="w-8" />
                        </div>
                        {/* rows */}
                        {f.state.value.map((wc: any, i: number) => (
                          <div
                            key={wc.id}
                            className="flex items-center px-4 py-2 border-t border-ivory-line bg-paper"
                          >
                            <input
                              className="flex-1 bg-transparent focus:outline-none text-base"
                              value={wc.name}
                              onChange={(e) => {
                                const next = [...f.state.value];
                                next[i] = { ...wc, name: e.target.value };
                                f.handleChange(next);
                              }}
                            />

                            <input
                              className="w-24 bg-transparent focus:outline-none text-base tabular"
                              value={wc.maxLb}
                              onChange={(e) => {
                                const next = [...f.state.value];
                                next[i] = {
                                  ...wc,
                                  maxLb: e.target.value.replace(/\D/g, "")
                                };
                                f.handleChange(next);
                              }}
                            />
                            <input
                              className="w-24 bg-transparent focus:outline-none text-base tabular"
                              value={wc.maxKg}
                              onChange={(e) => {
                                const next = [...f.state.value];
                                next[i] = {
                                  ...wc,
                                  maxKg: e.target.value.replace(/\D/g, "")
                                };
                                f.handleChange(next);
                              }}
                            />
                            <button
                              type="button"
                              className="w-8 text-crimson cursor-pointer"
                              onClick={() =>
                                f.handleChange(
                                  f.state.value.filter(
                                    (x: any) => x.id !== wc.id
                                  )
                                )
                              }
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                        {/* add row */}
                        <div className="flex justify-between">
                          <button
                            type="button"
                            className="w-full flex items-center gap-2 px-4 py-3 border-t border-ivory-line cm-eyebrow hover:text-ink cursor-pointer"
                            onClick={() =>
                              f.handleChange([
                                ...f.state.value,
                                {
                                  id: crypto.randomUUID(),
                                  name: `Class ${f.state.value.length + 1}`,
                                  maxLb: "",
                                  maxKg: ""
                                }
                              ])
                            }
                          >
                            + Add Weight Class
                          </button>
                          {hasWeightClasses && (
                            <button
                              type="button"
                              className="w-full flex items-center gap-2 px-4 py-3 border-t border-ivory-line cm-eyebrow hover:text-ink cursor-pointer justify-end"
                              onClick={() => f.handleChange([])}
                            >
                              - Clear Weight Classes
                            </button>
                          )}
                        </div>
                      </div>
                      {f.state.meta.errors.length > 0 && (
                        <ErrorMessage>
                          {f.state.meta.errors.join(", ")}
                        </ErrorMessage>
                      )}
                    </div>
                  );
                }}
              </form.Field>
            </div>
          </section>

          {/* ---- 03 · REGISTRATION & FEES ---- */}
          <section
            id="registration"
            ref={(el) => {
              sectionRefs.current.registration = el;
            }}
          >
            <SectionHead
              eyebrow="03 · Registration & Fees"
              title="Set the terms"
            />

            <div className="mt-8 flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-4">
                <form.Field
                  name="registrationOpens"
                  validators={{
                    onSubmit: ({ value }) =>
                      !value ? "Registration open date is required." : null
                  }}
                >
                  {(f) => (
                    <Labeled label="Registration Opens">
                      <DateSelect
                        value={f.state.value}
                        onChange={f.handleChange}
                      ></DateSelect>
                      {f.state.meta.errors.length > 0 && (
                        <ErrorMessage>
                          {f.state.meta.errors.join(", ")}
                        </ErrorMessage>
                      )}
                    </Labeled>
                  )}
                </form.Field>
                <form.Field
                  name="registrationCloses"
                  validators={{
                    onSubmit: ({ value }) =>
                      !value ? "Registration close date is required." : null
                  }}
                >
                  {(f) => (
                    <Labeled label="Registration Closes">
                      <DateSelect
                        value={f.state.value}
                        onChange={f.handleChange}
                      ></DateSelect>
                      {f.state.meta.errors.length > 0 && (
                        <ErrorMessage>
                          {f.state.meta.errors.join(", ")}
                        </ErrorMessage>
                      )}
                    </Labeled>
                  )}
                </form.Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <form.Field name="signupFee">
                  {(f) => (
                    <Labeled label="signup fee">
                      <Input
                        placeholder="$45"
                        format={"currency"}
                        value={f.state.value}
                        onChange={f.handleChange}
                      ></Input>
                    </Labeled>
                  )}
                </form.Field>
                <form.Field name="teamFee">
                  {(f) => (
                    <Labeled label="Team Fee">
                      <Input
                        placeholder="$120"
                        value={f.state.value}
                        onChange={f.handleChange}
                      ></Input>
                    </Labeled>
                  )}
                </form.Field>
              </div>

              <form.Field name="requireWaiver">
                {(f) => (
                  <Check
                    label="Require a signed waiver before an athlete can be registered."
                    checked={f.state.value}
                    onChange={f.handleChange}
                  />
                )}
              </form.Field>
              <form.Field name="allowRefunds">
                {(f) => (
                  <Check
                    label="Allow refunds up until registration closes."
                    checked={f.state.value}
                    onChange={f.handleChange}
                  />
                )}
              </form.Field>
            </div>
          </section>

          <section
            id="officials"
            ref={(el) => {
              sectionRefs.current.officials = el;
            }}
          >
            <SectionHead
              eyebrow="04 · Officials & Staff"
              title="Build your team"
            />

            <form.Field name="invites">
              {(f) => (
                <InviteRow
                  formState={f}
                  invites={f.state.value}
                  onChange={f.handleChange}
                />
              )}
            </form.Field>

            <div className="flex flex-col gap-4 mt-12">
              <Button variant="outline" type="button" onClick={handleCancel}>
                Cancel
              </Button>

              <Button variant="ink" type="submit">
                Create Tournament
              </Button>
            </div>
          </section>
        </form>
      </main>
    </div>
  );
}

/* ------------------------- helpers ------------------------- */

const inputClass =
  "w-full bg-paper border-2 border-ink px-4 py-3.5 text-base placeholder:text-ink-mute focus:outline-none focus:border-gold";

function SectionHead({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <>
      <p className="cm-eyebrow">{eyebrow}</p>
      <h2 className="font-display font-black uppercase text-4xl leading-[0.95] mt-2">
        {title}
      </h2>
      <div className="cm-rule mt-4" />
    </>
  );
}

function Labeled({
  label,
  children
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="cm-label mb-2">{label}</p>
      {children}
    </div>
  );
}

function SegBtn({
  label,
  selected,
  onClick,
  className = ""
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border-2 border-ink py-3 font-display font-extrabold uppercase text-sm tracking-[0.08em] transition-colors cursor-pointer ${className} ${
        selected ? "bg-ink text-ivory" : "bg-ivory text-ink hover:bg-ink/5"
      }`}
    >
      {label}
    </button>
  );
}

function Check({
  label,
  checked,
  onChange
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <Checkbox label={label} checked={checked} onChange={onChange}></Checkbox>
  );
}

function InviteRow({
  formState,
  invites,
  onChange
}: {
  formState: any;
  invites: Invite[];
  onChange: (v: Invite[]) => void;
}) {
  const [email, setEmail] = useState("");

  const [roleLabel, setRoleLabel] = useState(STAFF_ROLES[0].label);
  const [role, setRole] = useState(STAFF_ROLES[0].value);

  const selectedRole = STAFF_ROLES.find(
    (r) => r.value === formState.state.value
  );

  const add = () => {
    if (!email) return;
    onChange([
      ...invites,
      { id: crypto.randomUUID(), email, role, status: "Pending" }
    ]);
    setEmail("");
  };

  return (
    <div className="mt-8">
      <div className="flex gap-3">
        <Input
          placeholder="name@example.com"
          containerClasses="flex-2"
          value={email}
          onChange={setEmail}
        ></Input>
        <Dropdown
          containerClasses="flex-1"
          value={roleLabel}
          values={STAFF_ROLES}
          onChange={(selectedRole) => {
            const role = STAFF_ROLES.find((r) => r.value === selectedRole);

            setRole(selectedRole);
            setRoleLabel(role!.label);
          }}
        ></Dropdown>

        <button
          type="button"
          onClick={add}
          className="bg-ink text-ivory font-display font-extrabold uppercase text-sm tracking-[0.1em] px-6 cursor-pointer hover:bg-ink-soft"
        >
          Invite
        </button>
      </div>

      <div className="mt-4">
        {invites.map((inv) => (
          <div
            key={inv.id}
            className="flex items-center gap-3 py-3 border-t border-ivory-line"
          >
            <div className="flex size-9 items-center justify-center rounded-full bg-ink">
              <span className="font-display font-extrabold text-xs text-ivory">
                {inv.email.slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 leading-tight">
              <p className="text-sm">{inv.email}</p>
              <p className="cm-eyebrow">{inv.role}</p>
            </div>
            <span className="cm-eyebrow bg-gold text-ink px-2 py-1">
              {inv.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
