import type { Metadata } from "next";
import { Gabriela } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";

const font = Gabriela({
  weight: "400",
  variable: "--font-gabriela",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "CineShelf",
  description: "A shelf to store and admire your movies and their musics!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <html lang="en">
        <body
          className={`${font.variable} antialiased bg-paper text-charcoal`}
        >
          {children}

          <Toaster
            expand
            position="bottom-right"
          />
        </body>
      </html>
    </SessionProvider>
  );
}
