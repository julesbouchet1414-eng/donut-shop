'use client';

import Link from 'next/link';
import { useCart } from './CartProvider';

export default function Header() {
  const { lines } = useCart();
  const count = lines.reduce((sum, l) => sum + l.qty, 0);

  return (
    <header className="sticky top-0 z-40 bg-donut-choco text-donut-cream shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="font-pixel text-xs sm:text-sm flex items-center gap-2 shrink-0">
          <span>🍩</span> Donut Shop
        </Link>
        <nav className="hidden sm:flex gap-6 text-sm font-medium">
          <Link href="/argent" className="hover:text-donut-pink">Argent</Link>
          <Link href="/items" className="hover:text-donut-pink">Items</Link>
          <Link href="/shulker" className="hover:text-donut-pink">Shulker</Link>
        </nav>
        <Link
          href="/panier"
          className="relative bg-donut-pink text-donut-chocoDark font-semibold px-4 py-2 rounded-lg hover:bg-donut-pinkDark hover:text-white transition shrink-0"
        >
          🛒 Panier
          {count > 0 && (
            <span className="absolute -top-2 -right-2 bg-donut-chocoDark text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {count}
            </span>
          )}
        </Link>
      </div>
      <nav className="sm:hidden flex justify-around border-t border-white/10 py-2 text-sm">
        <Link href="/argent">Argent</Link>
        <Link href="/items">Items</Link>
        <Link href="/shulker">Shulker</Link>
      </nav>
    </header>
  );
}
