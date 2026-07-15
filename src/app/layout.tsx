import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { SocketProvider } from "../context/SocketContext";
import { IncomingCallProvider } from "../components/IncomingCallProvider";
import PushNotificationsProvider from "../components/PushNotificationsProvider";
import PushOptInPrompt from "../components/PushOptInPrompt";
import { ChatWidgetLoader } from "../components/ChatWidgetLoader";
import BottomNav from "../components/navigation/BottomNav";
import SidebarWrapper from "../components/navigation/SidebarWrapper";
import ContentWrapper from "../components/navigation/ContentWrapper";
import { NavigationTracker } from "../lib/navHistory";

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
        <AuthProvider>
          <SocketProvider>
            <NavigationTracker />
            <div className="flex">
              <SidebarWrapper />
              <ContentWrapper>
                {children}
              </ContentWrapper>
            </div>
            <BottomNav />
            <IncomingCallProvider />
            <PushNotificationsProvider />
            <PushOptInPrompt />
          </SocketProvider>
        </AuthProvider>
        {/* <ChatWidgetLoader /> */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window,document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1744890816508319');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>11
          <img height="1" width="1" style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1744890816508319&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </body>
    </html>
  );
}
