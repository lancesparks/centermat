import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface DropdownProps {
  label?: string;
  placeholder?: string;
  containerClasses?: string;
  value: string;
  values: { label: string; value: string }[]; // was string | null
  onChange: (value: string) => void; // was string | null
}

export function Dropdown({
  label,
  placeholder = "Select an option",
  containerClasses,
  value,
  values,
  onChange
}: DropdownProps) {
  const id = label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={containerClasses}>
      {label && (
        <label htmlFor={id} className="cm-label block mb-2">
          {label}
        </label>
      )}
      {/* 3. Bind value and onValueChange to the Select component */}
      <Select value={value} onValueChange={(v) => onChange(v ?? "")}>
        <SelectTrigger
          id={id}
          className="w-full rounded-none bg-paper border-2 border-ink px-4 py-3.5 text-base focus:outline-none focus:border-gold cursor-pointer !h-[54px]"
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {label && <SelectLabel>{label}</SelectLabel>}
            {values.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
