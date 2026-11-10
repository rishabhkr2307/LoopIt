import type { Metadata } from "next";
import localFont from 'next/font/local'

import "./globals.css";

const manrope = localFont({
  src: '../../public/fonts/Manrope-VariableFont_wght.ttf',
  variable: "--font-manrope",
  display: "swap",
  weight: "200 800",
})

export const metadata: Metadata = {
  title: "LoopIt",
  description: "A peer to peer rental marketplace that enables people to borrow and lend everyday items",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${manrope.className} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
