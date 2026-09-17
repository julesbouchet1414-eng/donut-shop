'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import PixelIcon from './PixelIcon';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Erreur de connexion.');
        setLoading(false);
        return;
      }
      router.refresh();
    } catch {
      setError('Impossible de contacter le serveur.');
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="panel panel-raised animate-pop-in space-y-5 p-7">
      <div className="text-center">
        <span className="slot mx-auto !h-16 !w-16 !cursor-default">
          <PixelIcon name="netheriteBlock" size={44} className="animate-bob" />
        </span>
        <h1 className="mc-title-purple mt-4 text-2xl">ESPACE ADMIN</h1>
      </div>

      <div>
        <label className="mb-1.5 block font-display text-xs font-semibold uppercase text-ink-300" htmlFor="admin-password">
          Mot de passe
        </label>
        <input
          id="admin-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="field"
          autoComplete="current-password"
        />
      </div>

      {error && (
        <p className="animate-fade-in border-2 border-mc-redstone/50 bg-mc-redstone/15 px-4 py-2 text-sm font-semibold text-mc-redstone">
          {error}
        </p>
      )}

      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? 'Connexion...' : 'Connexion'}
      </button>
    </form>
  );
}
