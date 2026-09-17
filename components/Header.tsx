'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useCart } from './CartProvider';
import DonutLogo from './DonutLogo';
import PixelIcon from './PixelIcon';
import { formatEUR } from '@/lib/pricing';

const LINKS = [
  { href: '/argent', label: 'Argent', sprite: 'donut' },
  { href: '/items', label: 'Items', sprite: 'sword' },
  { href: '/shulker', label: 'Shulker', sprite: 'shulker' },
];

export default function Header() {
  const { lines, total } = useCart();
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
    <header className="sticky top-0 z-40 border-b-2 border-night-900 bg-night-800/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="group flex shrink-0 items-center gap-3">
          <span className="transition-transform duration-200 group-hover:-translate-y-1">
            <DonutLogo size={36} title="Donut Shop" />
          </span>
          <span className="font-pixel text-lg font-bold leading-tight text-white text-shadow-mc sm:text-xl">
            DONUT<span className="text-mc-pink"> SHOP</span>
          </span>
        </Link>

        <nav className="hidden gap-8 sm:flex">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="nav-link flex items-center gap-2">
              <PixelIcon name={l.sprite} size={18} />
              {l.label}
            </Link>
          ))}
        </nav>

        <Link href="/panier" className="btn-primary group shrink-0 !px-4 !py-2">
          <PixelIcon name="shulker" size={18} />
          <span className="hidden sm:inline">{count > 0 ? formatEUR(total) : 'Panier'}</span>
          <span className="sm:hidden">Panier</span>
          {count > 0 && (
            <span
              className={`absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center border-2 border-night-900 bg-mc-emerald px-1 font-pixel text-[13px] text-night-900 ${
                bump ? 'animate-badge-pop' : ''
              }`}
            >
              {count}
            </span>
          )}
        </Link>
      </div>

      {/* Hotbar mobile */}
      <nav className="flex border-t-2 border-night-900 sm:hidden">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="flex flex-1 flex-col items-center gap-1 border-r-2 border-night-900 py-2 last:border-r-0 active:bg-night-700"
          >
            <PixelIcon name={l.sprite} size={20} />
            <span className="font-display text-[11px] uppercase text-ink-300">{l.label}</span>
          </Link>
        ))}
      </nav>
    </header>
  );
}
