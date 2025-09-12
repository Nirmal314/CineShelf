import type { Metadata } from "next";
import { Gabriela } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import ClickSpark from "@/components/click-spark";

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
          className={`${font.variable} antialiased bg-paper text-charcoal overflow-hidden`}
        >
          <ClickSpark sparkColor='#99582a' duration={350}>
            {children}
          </ClickSpark>
        </body>
      </html>
    </SessionProvider>
  );
}
