import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://retailiq.vercel.app"),
  title: {
    default: "RetailIQ — AI-Powered Retail Intelligence Platform",
    template: "%s · RetailIQ",
  },
  description:
    "RetailIQ turns fashion product data into strategic business decisions — executive dashboards, product and customer analytics, market basket analysis and interactive AI predictions.",
  keywords: [
    "retail intelligence",
    "fashion analytics",
    "machine learning",
    "market basket analysis",
    "customer behaviour",
    "data science",
  ],
  authors: [{ name: "Xhesika Feto" }],
  openGraph: {
    title: "RetailIQ — AI-Powered Retail Intelligence Platform",
    description:
      "Turn fashion product data into strategic business decisions with dashboards, analytics and interactive AI predictions.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrument.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-paper">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
