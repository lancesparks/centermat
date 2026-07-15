"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { getDateString } from "../helpers/date-helper";

interface DateOfBirthProps {
  onChange: (value: string) => void;
}

export function DateOfBirthSelect({ onChange }: DateOfBirthProps) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(undefined);

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
      <FieldLabel htmlFor="date" className="!font-display !cm-label !block ">
        DATE OF BIRTH
      </FieldLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          className="!w-full rounded-none bg-paper border-2 border-ink px-4 py-3.5 text-base focus:outline-none focus:border-gold cursor-pointer !h-[54px]"
          render={
            <Button variant="outline" id="date">
              {date ? date.toLocaleDateString() : "Select date"}
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
