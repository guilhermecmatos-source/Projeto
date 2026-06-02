import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-geist' });

export const metadata: Metadata = {
  title: 'Fleet AI — Plataforma de Decisão Empresarial',
  description: 'Inteligência artificial para logística, operações, estoque e vendas',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
