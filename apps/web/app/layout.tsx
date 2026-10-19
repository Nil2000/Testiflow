import { Geist, Geist_Mono, DM_Serif_Text, Poppins } from "next/font/google";
import "./globals.css";
import { PostHogProvider } from "./provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ThemeToaster } from "@/components/theme-toaster";
import { Analytics } from "@vercel/analytics/next";
import { siteMetadata } from "@/lib/opengraph";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dmSerif = DM_Serif_Text({
  display: "swap",
  subsets: ["latin", "latin-ext"],
  variable: "--font-dm-serif",
  weight: ["400"],
});
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
export const metadata = siteMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${dmSerif.variable} ${poppins.variable} font-sans antialiased min-h-screen relative`}
      >
        <PostHogProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <ThemeToaster />
          </ThemeProvider>
        </PostHogProvider>
        <Analytics />
      </body>
    </html>
  );
}
