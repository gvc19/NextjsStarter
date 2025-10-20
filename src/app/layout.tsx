import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClientProviders } from "@/providers/ClientProviders";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Y-ALM",
  description: "Y-ALM",
  icons: {
    icon: "/globe.svg",
  },
  openGraph: {
    title: "Y-ALM",
    description: "Y-ALM",
    url: "https://y-alm.com",
    siteName: "Y-ALM",
  },
  twitter: {
    card: "summary_large_image",
    title: "Y-ALM",
    description: "Y-ALM",
    images: ["https://y-alm.com/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NuqsAdapter>
          <ClientProviders>{children}</ClientProviders>
        </NuqsAdapter>
      </body>
    </html>
  );
}
