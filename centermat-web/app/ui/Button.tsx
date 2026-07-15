const buttonClasses = {
  ink: "bg-ink text-ivory hover:bg-ink-soft active:bg-ink",
  gold: "bg-gold text-black hover:bg-gold-deep border-2 border-ink active:bg-gold",
  crimson:
    "bg-crimson text-ivory hover:brightness-105 active:brightness-100 border-2 border-ink",
  outline:
    "bg-ivory text-ink hover:brightness-105 active:brightness-100 border-2 border-ink"
};
interface ButtonProps {
  variant: keyof typeof buttonClasses;
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
  onClick?: () => void;
  children?: React.ReactNode;
}

export default function Button({
  variant,
  type,
  onClick,
  children
}: ButtonProps) {
  return (
    <>
      <button
        type={type}
        onClick={onClick}
        className={`w-full ${buttonClasses[variant]} font-display font-extrabold uppercase tracking-[0.12em] text-sm py-4 mt-2  transition-colors cursor-pointer `}
      >
        {children}
      </button>
    </>
  );
}
