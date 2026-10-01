import type { Metadata } from 'next';
import { Elms_Sans } from 'next/font/google';
import CustomCursor from '@/components/CustomCursor';
import DisableContextMenu from '@/components/DisableContextMenu';
import Navbar from '@/components/Navbar';
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
    <html lang="pl" className={`${elmsSans.variable} no-scrollbar h-full antialiased`}>
      <body className="flex min-h-full flex-col pt-8 font-sans" suppressHydrationWarning>
        <Navbar />
        {children}
        <DisableContextMenu />
        <CustomCursor />
      </body>
    </html>
  );
}
