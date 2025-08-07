import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aziz's Website Builder",
  description: "Developed for Rekaz",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  );
}
