import type { Metadata } from 'next';
import { Press_Start_2P, Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/components/CartProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const pixelFont = Press_Start_2P({ weight: '400', subsets: ['latin'], variable: '--font-pixel' });
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Donut Shop — Argent & Items Donut SMP',
  description: "Boutique communautaire pour acheter de l'argent et des items pour Donut SMP, et composer sa propre shulker.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${inter.className} ${pixelFont.variable}`}>
        <CartProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
