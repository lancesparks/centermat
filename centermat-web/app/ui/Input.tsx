import { formatCurrency } from "@/helpers";

interface InputProps {
  label?: string;
  type?: React.InputHTMLAttributes<HTMLInputElement>["type"];
  placeholder?: string;
  format?: string;
  classes?: string;
  containerClasses?: string;
  value: string;
  onChange: (value: string) => void;
}

export function Input({
  label,
  type = "text",
  placeholder,
  format,
  classes,
  containerClasses,
  value,
  onChange
}: InputProps) {
  const id = label?.toLowerCase().replace(/\s+/g, "-");
  const inputClasses = `w-full bg-paper border-2 border-ink px-4 py-3.5 text-base placeholder:text-ink-mute focus:outline-none focus:border-gold ${classes}`;
  return (
    <div className={containerClasses}>
      {label && (
        <label htmlFor={id} className="cm-label block mb-2">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          let value = e.target.value;
          if (format === "currency") {
            value = parseFloat(value).toLocaleString("en-US", {
              style: "currency",
              currency: "USD"
            });
          }
          onChange(value);
        }}
        className={inputClasses}
      />
    </div>
  );
}
