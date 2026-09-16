'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useCart } from './CartProvider';
import DonutLogo from './DonutLogo';

const LINKS = [
  { href: '/argent', label: 'Argent' },
  { href: '/items', label: 'Items' },
  { href: '/shulker', label: 'Shulker' },
];

export default function Header() {
  const { lines } = useCart();
  const count = lines.reduce((sum, l) => sum + l.qty, 0);
  const [bump, setBump] = useState(false);
  const prevCount = useRef(count);

  useEffect(() => {
    if (count > prevCount.current) {
      setBump(true);
      const t = setTimeout(() => setBump(false), 520);
      prevCount.current = count;
      return () => clearTimeout(t);
    }
    prevCount.current = count;
  }, [count]);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-donut-choco/90 text-donut-cream backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="group flex shrink-0 items-center gap-2.5">
          <span className="transition-transform duration-500 group-hover:rotate-[18deg] group-hover:scale-110">
            <DonutLogo size={38} title="Donut Shop" />
          </span>
          <span className="font-display text-lg font-bold tracking-wide sm:text-xl">
            Donut<span className="text-donut-glaze"> Shop</span>
          </span>
        </Link>

        <nav className="hidden gap-7 sm:flex">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="nav-link">
              {l.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/panier"
          className="relative shrink-0 rounded-full bg-gradient-to-br from-donut-glaze to-donut-pinkDark px-4 py-2 font-semibold text-white shadow-pill transition-transform duration-200 hover:-translate-y-0.5 active:scale-95"
        >
          Panier
          {count > 0 && (
            <span
              className={`absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-donut-chocoDark px-1.5 text-xs font-bold text-white ring-2 ring-donut-glaze ${
                bump ? 'animate-badge-pop' : ''
              }`}
            >
              {count}
            </span>
          )}
        </Link>
      </div>

      <nav className="flex justify-around border-t border-white/10 py-2 sm:hidden">
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} className="text-sm font-medium text-donut-cream/90">
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
