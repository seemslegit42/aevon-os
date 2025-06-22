
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import MainLayout from '@/components/layout/main-layout';
import { ThemeProvider } from '@/components/theme-provider';

export const metadata: Metadata = {
  title: 'ΛΞVON OS: AI-Powered Business Revolution',
  description: 'AI-first intelligent operating system designed to revolutionize business operations for SMBs.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@300..700&family=Lexend:wght@100..900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased h-screen w-screen overflow-hidden flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <MainLayout>{children}</MainLayout>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
