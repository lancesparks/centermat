interface ErrorMessageProps {
  children: React.ReactNode;
}

export function ErrorMessage({ children }: ErrorMessageProps) {
  return <p className="text-red-500 text-sm mt-1">{children}</p>;
}
