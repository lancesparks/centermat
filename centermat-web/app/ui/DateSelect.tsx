"use client";

import * as React from "react";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { getDateString } from "../../helpers/date-helper";

interface DateSelectProps {
  label?: string;
  value?: string; // 👈 1. Accept optional value string from TanStack form
  onChange: (value: string) => void;
}

export function DateSelect({ label, value, onChange }: DateSelectProps) {
  const [open, setOpen] = React.useState(false);

  // Helper to safely parse string back to Date instance for Calendar
  const parseValueToDate = (val?: string): Date | undefined => {
    if (!val) return undefined;
    const parsed = new Date(val);
    return isNaN(parsed.getTime()) ? undefined : parsed;
  };

  const [date, setDate] = React.useState<Date | undefined>(() =>
    parseValueToDate(value)
  );

  useEffect(() => {
    setDate(parseValueToDate(value));
  }, [value]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) {
      return;
    }

    setDate(selectedDate);
    setOpen(false);

    onChange(getDateString(selectedDate));
  };

  return (
    <Field>
      {label && (
        <FieldLabel htmlFor="date" className="!font-display !cm-label !block ">
          {label}{" "}
          {/* 👈 3. Updated hardcoded "DATE OF BIRTH" to use the `label` prop */}
        </FieldLabel>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          className="!w-full rounded-none bg-paper border-2 border-ink px-4 py-3.5 text-base focus:outline-none focus:border-gold cursor-pointer !h-[54px]"
          render={
            <Button variant="outline" id="date">
              {date ? date.toLocaleDateString() : "MM/DD/YYYY"}
            </Button>
          }
        />
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            defaultMonth={date}
            captionLayout="dropdown"
            onSelect={handleDateSelect}
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
}
