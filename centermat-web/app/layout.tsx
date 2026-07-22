"use client";

import "./globals.css";

import localFont from "next/font/local";
import { DM_Sans } from "next/font/google";
import { APIProvider } from "@vis.gl/react-google-maps";
import QueryProvider from "../providers/QueryProvider"; // Adjust path

const bigShoulders = localFont({
  src: [
    { path: "../fonts/big-shoulders-v4-latin-700.woff2", weight: "700" },
    { path: "../fonts/big-shoulders-v4-latin-800.woff2", weight: "800" },
    { path: "../fonts/big-shoulders-v4-latin-900.woff2", weight: "900" }
  ],
  variable: "--font-big-shoulders"
});

const sans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-sans"
});

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${bigShoulders.variable} ${sans.variable}`}>
      <body>
        <QueryProvider>
          <APIProvider
            apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
          >
            {children}
          </APIProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
