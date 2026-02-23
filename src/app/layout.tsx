import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Navbar";
import AsciiBackground from "@/components/AsciiBackground";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
});

export const metadata: Metadata = {
  title: {
    default: "Jay Sahni",
    template: "%s | Jay Sahni",
  },
  description: "Software Engineer interested in applications of AI agents.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${lora.variable} antialiased bg-background text-text-primary min-h-screen flex items-center justify-center`}
      >
        <AsciiBackground />
        <div className="relative z-10 w-full max-w-5xl mx-4 my-8 flex flex-col md:flex-row border border-border rounded-lg overflow-hidden bg-surface/95 backdrop-blur-sm shadow-2xl" style={{ minHeight: "80vh", maxHeight: "90vh" }}>
          {/* Sidebar (desktop) / Header (mobile) */}
          <div className="md:w-48 shrink-0 md:border-r border-border">
            <Sidebar />
          </div>
          {/* Content Area */}
          <main className="flex-1 overflow-y-auto p-6 md:p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
