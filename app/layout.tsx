import type { Metadata } from 'next';
import { Pixelify_Sans, Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/components/CartProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackgroundDecor from '@/components/BackgroundDecor';

// Police pixel qui, contrairement à Press Start 2P, contient les accents
// français (É, Ç, à) : sans ça chaque accent bascule sur une police de secours.
const pixelFont = Pixelify_Sans({ weight: ['400', '600', '700'], subsets: ['latin'], variable: '--font-pixel' });
const inter = Inter({ subsets: ['latin'], variable: '--font-display' });

export const metadata: Metadata = {
  title: 'Donut Shop — Argent & Items Donut SMP',
  description:
    "Boutique communautaire pour acheter de l'argent et des items pour Donut SMP, et composer sa propre shulker.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${inter.className} ${pixelFont.variable} ${inter.variable}`}>
        <CartProvider>
          <BackgroundDecor />
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
