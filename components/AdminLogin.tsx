'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import DonutLogo from './DonutLogo';

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
    <form onSubmit={handleSubmit} className="card animate-pop-in space-y-4 p-7">
      <div className="text-center">
        <DonutLogo size={72} variant="choco" className="mx-auto animate-float" />
        <h1 className="mt-3 font-display text-2xl font-bold">Espace admin</h1>
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold" htmlFor="admin-password">
          Mot de passe admin
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
        <p className="animate-fade-in rounded-2xl bg-donut-coral/15 px-4 py-2 text-sm font-semibold text-donut-coral">
          {error}
        </p>
      )}

      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? 'Connexion...' : 'Connexion'}
      </button>
    </form>
  );
}
