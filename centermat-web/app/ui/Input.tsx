interface InputProps {
  label?: string;
  type?: React.InputHTMLAttributes<HTMLInputElement>["type"];
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}

export default function Input({
  label,
  type = "text",
  placeholder,
  value,
  onChange
}: InputProps) {
  const id = label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div>
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
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-paper border-2 border-ink px-4 py-3.5 text-base placeholder:text-ink-mute focus:outline-none focus:border-gold"
      />
    </div>
  );
}
