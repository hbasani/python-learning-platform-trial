import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Python Learning Platform",
  description: "AI-powered production-ready Python learning platform"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}

