import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { ChatWidgetLoader } from "../components/ChatWidgetLoader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pachamama",
  description: "Pachamama Web",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-black text-white">
        <AuthProvider>{children}</AuthProvider>
        <ChatWidgetLoader />
      </body>
    </html>
  );
}
