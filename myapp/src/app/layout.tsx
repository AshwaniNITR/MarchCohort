import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";
import { ClerkProvider, SignedIn, SignedOut, SignIn, SignInButton, UserButton } from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BookingJini- AI-Powered Social Media Post Generator for Small Hotels",
  description: " AI-Powered Social Media Post Generator for Small Hotels",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
 
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} >
      
          <div className="flex items-center justify-center min-h-screen bg-gray-100">

          </div>
    
              {children}
   
      </body>
    </html>

  );
}
