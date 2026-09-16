import type { Metadata } from 'next';
import { Press_Start_2P, Inter, Fredoka } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/components/CartProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackgroundDecor from '@/components/BackgroundDecor';

const pixelFont = Press_Start_2P({ weight: '400', subsets: ['latin'], variable: '--font-pixel' });
const displayFont = Fredoka({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-display' });
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Donut Shop — Argent & Items Donut SMP',
  description:
    "Boutique communautaire pour acheter de l'argent et des items pour Donut SMP, et composer sa propre shulker.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${inter.className} ${pixelFont.variable} ${displayFont.variable}`}>
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
