import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Creora — AI Content Studio",
  description:
    "Turn a photo and an idea into ready-to-post social content.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}