'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';

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
    <form onSubmit={handleSubmit} className="bg-white/70 rounded-xl p-6 border border-black/5 space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="admin-password">
          Mot de passe admin
        </label>
        <input
          id="admin-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-black/10"
          autoComplete="current-password"
        />
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-40">
        {loading ? 'Connexion...' : 'Connexion'}
      </button>
    </form>
  );
}
