import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { SubscriptionListener } from "@/components/subscription-listener";

export const metadata: Metadata = {
  title: "SaaS Starter",
  description: "A modern SaaS starter kit built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${GeistSans.variable} ${GeistMono.variable} min-h-screen bg-background font-sans antialiased`}>
        <Navbar />
        <SubscriptionListener />
        {children}
      </body>
    </html>
  );
}
