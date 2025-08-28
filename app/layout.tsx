import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

export const metadata: Metadata = {
  title: "BlockSecure Multi-Cloud | Blockchain-Verified Log Integrity",
  description:
    "A revolutionary hackathon MVP demonstrating how blockchain technology can secure and verify logs across AWS, Azure, and GCP with tamper-proof verification using Stacks and Clarity smart contracts.",
  keywords: ["blockchain", "security", "multi-cloud", "log integrity", "stacks", "clarity", "aws", "azure", "gcp"],
  authors: [{ name: "BlockSecure Team" }],
  creator: "BlockSecure",
  publisher: "BlockSecure",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://blocksecure-multi-cloud.vercel.app"),
  openGraph: {
    title: "BlockSecure Multi-Cloud",
    description: "Blockchain-verified log integrity across multiple cloud providers",
    url: "https://blocksecure-multi-cloud.vercel.app",
    siteName: "BlockSecure Multi-Cloud",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BlockSecure Multi-Cloud Dashboard",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BlockSecure Multi-Cloud",
    description: "Blockchain-verified log integrity across AWS, Azure, and GCP",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
    generator: 'v0.app'
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
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
