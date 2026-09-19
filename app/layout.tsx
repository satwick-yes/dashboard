import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Gustosa Food | WhatsApp Orders Dashboard (Meta Business Suite)",
  description:
    "Real-time WhatsApp Cloud API Orders Dashboard for Gustosa Food. Live kitchen pipeline, automated customer notifications, and revenue analytics.",
  keywords: [
    "WhatsApp Business API",
    "Next.js App Router",
    "Restaurant Orders Dashboard",
    "Meta Cloud API",
    "Gustosa Food",
  ],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#090d16" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.variable} font-sans antialiased min-h-[100dvh]`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex h-screen bg-gray-50 text-gray-900 font-sans antialiased overflow-hidden selection:bg-indigo-100 selection:text-indigo-900">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
              <Header />
              <main className="flex-1 overflow-y-auto p-6 lg:p-8 relative">
                {children}
              </main>
            </div>
          </div>
          <Toaster
            position="bottom-right"
            toastOptions={{
              className: "border-border/80 bg-background/95 backdrop-blur-xl text-foreground",
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
