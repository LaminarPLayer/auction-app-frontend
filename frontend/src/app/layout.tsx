import Navbar from "@/app/navbar";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { HomepageVisitedProvider } from "@/lib/contexts/homepage-visited-context";
import { WelcomeModalProvider } from "@/lib/contexts/welcome-modal-context";
import { EdgeStoreProvider } from "@/lib/edgestore";
import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "./providers";

const rubik = Rubik({
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-rubik",
});

export const metadata: Metadata = {
  title: "postDA Freta 🎄 licytacja świąteczna",
  description: "Charytatywna licytacja świąteczna postDA Freta, grudzień 2024",
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
        <WelcomeModalProvider>
          <HomepageVisitedProvider>
            <body className={`${rubik.className}`}>
              <div className="relative flex min-h-screen flex-col items-center">
                <ThemeProvider
                  attribute="class"
                  defaultTheme="system"
                  enableSystem
                  disableTransitionOnChange
                >
                  <EdgeStoreProvider>
                    <Navbar />
                    <main className="w-full">{children}</main>
                    <Toaster />
                  </EdgeStoreProvider>
                </ThemeProvider>
              </div>
            </body>
          </HomepageVisitedProvider>
        </WelcomeModalProvider>
      </NextAuthProvider>
    </html>
  );
}
