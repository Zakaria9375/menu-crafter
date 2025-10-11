import type { Metadata } from "next";
import "./globals.css";
//import { Geist, Geist_Mono } from "next/font/google";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Menu Crafter",
  description: "Create and manage your restaurant menus with ease",
  icons: {
    icon: "/favicon.ico",
  },
};

type Props = {
  children: React.ReactNode;
};

export default async function RootLayout({
  children,
}: Readonly<Props>) {
  return children;
}
