import type { Metadata } from "next";
import { Gabriela } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import Header from "@/components/header";

const font = Gabriela({
  weight: "400",
  variable: "--font-gabriela",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "CineShelf",
  description: "A sheld to store and admire your movies and their musics!",
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
          className={`${font.variable} antialiased`}
        >
          <Header />
          {children}
        </body>
      </html>
    </SessionProvider>
  );
}
