import Navbar from "@/app/navbar";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { EdgeStoreProvider } from "@/lib/edgestore";
import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import PostHogIdentify from "./PostHogIdentify";
import PostHogPageView from "./PostHogPageView";
import "./globals.css";
import { NextAuthProvider, PHProvider } from "./providers";

const rubik = Rubik({
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-rubik",
});

export const metadata: Metadata = {
  title: "postDA Freta 🎄 licytacja świąteczna",
  description: "Charytatywna licytacja świąteczna postDA Freta, grudzień 2023",
  metadataBase: new URL("https://postda.vercel.app/"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <NextAuthProvider>
        <PHProvider>
          <body className={`${rubik.className}`}>
            <PostHogPageView />
            <PostHogIdentify />
            <div className="relative flex min-h-screen flex-col">
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <EdgeStoreProvider>
                  <Navbar />
                  <main>{children}</main>
                  <Toaster />
                </EdgeStoreProvider>
              </ThemeProvider>
            </div>
          </body>
        </PHProvider>
      </NextAuthProvider>
    </html>
  );
}
