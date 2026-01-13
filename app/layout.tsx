import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'JurisFix - SaaS Jurídico',
  description: 'Sistema de gestão e estudo de casos jurídicos',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-white`}>
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}