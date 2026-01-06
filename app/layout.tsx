import type { Metadata } from "next";
import { Playfair_Display, Mulish } from "next/font/google";
import "./globals.css";
import Loader from './components/Loader';
// import Cursor from "@/components/Cursor";  <-- 1. SUPPRIME CETTE LIGNE

const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  variable: '--font-serif',
  weight: ['400', '700']
});

const mulish = Mulish({ 
  subsets: ["latin"], 
  variable: '--font-sans',
  weight: ['300', '400', '700']
});

export const metadata: Metadata = {
  title: "BenDev - Creative Developer",
  description: "Experience immersive web design",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* 2. J'AI ENLEVÉ 'cursor-none' ICI (Ta souris revient !) */}
      <body className={`${playfair.variable} ${mulish.variable} antialiased bg-[#EBEAE5]`}>
        
        {/* <Cursor />  <-- 3. SUPPRIME CETTE LIGNE AUSSI */}
        <Loader />
        {children}
        
      </body>
    </html>
  );
}