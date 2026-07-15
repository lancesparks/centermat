import Image from "next/image";

interface LoginLayoutProps {
  sidebarHeader: string;
  sidebarQuote?: string;
  children?: React.ReactNode;
}

export default function LoginLayout({
  sidebarHeader,
  sidebarQuote,
  children
}: LoginLayoutProps) {
  return (
    <div className="min-h-dvh bg-ivory lg:flex">
      <aside className="hidden lg:flex lg:w-[38%] lg:flex-col lg:justify-between bg-ink text-ivory p-10">
        {/* logo (ivory-on-ink version) */}
        <div className="flex items-center gap-3">
          <Image
            src="/centermat-logo-transparent.png"
            alt="Centermat"
            width={228}
            height={83}
            className="invert"
            priority
          />
        </div>
        <div>
          <h2 className="font-display font-black uppercase text-6xl leading-[0.95]">
            {sidebarHeader}
          </h2>
          <div className="mt-6 h-1 w-16 bg-gold" />
          {sidebarQuote && (
            <p className="font-serif italic text-xl mt-8 max-w-sm leading-relaxed">
              {sidebarQuote}
            </p>
          )}
        </div>

        {/* header footer */}
        <p className="cm-eyebrow text-ivory/60">By Suplay</p>
      </aside>

      <main className="flex-1 flex flex-col min-h-dvh lg:min-h-0 lg:justify-center">
        <div className="w-full max-w-md mx-auto px-6 pt-10 pb-8 flex flex-col flex-1 lg:flex-none">
          {children}
        </div>
      </main>
    </div>
  );
}
