import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "./providers/theme-provider";

const plein = localFont({
  src: "../fonts/Plein-Variable.ttf",
  variable: "--font-plein",
});

const archivo = localFont({
  src: "../fonts/Archivo-Variable.ttf",
  variable: "--font-archivo",
});

const APP_NAME = "Liftyra";
const APP_DEFAULT_TITLE = "Liftyra — Track. Lift. Transform.";
const APP_TITLE_TEMPLATE = "%s | Liftyra";
const APP_DESCRIPTION =
  "Liftyra adalah platform modern untuk tracking progres gym, assessment tubuh, BMI, laporan, dan social sharing.";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0d1014",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#0d1014" />
      </head>
      <body
        className={`${plein.variable} ${archivo.variable} bg-background text-foreground min-h-screen antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
