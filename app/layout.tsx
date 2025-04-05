import type { Metadata } from "next";
import { dark } from "@clerk/themes";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Streamovision",
  description: "A clone of a streaming service",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang='en'>
        <body className={`${inter.className} antialiased`}>
          <ThemeProvider
            attribute='class'
            forcedTheme='dark'
            storageKey='streamovision-theme'
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
