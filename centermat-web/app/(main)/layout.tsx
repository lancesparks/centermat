import { Header } from "@/app/ui";

export default function MainLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh flex flex-col bg-ivory">
      <Header />
      <main className="flex-1">{children}</main>
    </div>
  );
}
