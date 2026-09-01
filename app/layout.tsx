import type { Metadata } from 'next';
import { Elms_Sans } from 'next/font/google';
import './globals.css';

const elmsSans = Elms_Sans({
  variable: '--font-elms-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Yaroslav Matvieiev / Portfolio',
  description: 'Yaroslav Matvieiev architectural portfolio',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className={`${elmsSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
