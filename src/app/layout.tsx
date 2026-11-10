import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "LoopIt",
  description: "A peer to peer rental marketplace that enables people to borrow and lend everyday items",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
