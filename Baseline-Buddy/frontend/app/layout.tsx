import type React from "react"
import type { Metadata, Viewport } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" }
  ],
}

export const metadata: Metadata = {
  title: "Baseline Buddy - Web Feature Compatibility Checker",
  description: "Professional tool for checking web feature compatibility across browsers with AI-powered explanations",
  generator: "v0.app",
  manifest: "/manifest.json",
  metadataBase: new URL("https://baseline-buddy.vercel.app"),
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Baseline Buddy"
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png"
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://baseline-buddy.vercel.app",
    siteName: "Baseline Buddy",
    title: "Baseline Buddy - Web Feature Compatibility Checker",
    description: "Check if your web features are Baseline Safe with AI-powered insights",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Baseline Buddy"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Baseline Buddy - Web Feature Compatibility Checker",
    description: "Check if your web features are Baseline Safe with AI-powered insights",
    images: ["/logo.png"]
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
