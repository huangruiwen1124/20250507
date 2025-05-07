import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rotate PDF Pages Online - Free PDF Rotation Tool",
  description: "Easily rotate PDF pages online for free. No registration required. Rotate PDF documents locally in your browser with our simple tool.",
  keywords: "rotate pdf, pdf rotation, rotate pdf pages, free pdf tool, pdf editor",
  openGraph: {
    title: "Rotate PDF Pages Online - Free PDF Rotation Tool",
    description: "Easily rotate PDF pages online for free. No registration required. Rotate PDF documents locally in your browser.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="min-h-screen bg-[#f7f5ee] ">
          <header className="w-full bg-[#fff] text-white py-4 h-[70px]">
          
          </header>
          {children}
        </main>
      </body>
    </html>
  );
}
