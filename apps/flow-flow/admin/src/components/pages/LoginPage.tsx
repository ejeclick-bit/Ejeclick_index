import { useState, type FormEvent } from 'react';
import { useAuth } from '../../lib/auth';

export function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
    } catch {
      setError('Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-foreground">
            <span className="text-brand-gold">✦</span> Flow Flow
          </h1>
          <p className="mt-1 text-sm text-muted/80">Panel de Administración</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-subtle bg-brand-card p-6">
          {error && (
            <div className="rounded-lg bg-red-900/20 px-4 py-2.5 text-sm text-red-400" role="alert">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-foreground/80">Usuario</label>
            <input
              id="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full rounded-lg border border-subtle bg-background px-4 py-2.5 text-sm text-foreground placeholder-neutral-500 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold"
              placeholder="admin"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground/80">Contraseña</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-subtle bg-background px-4 py-2.5 text-sm text-foreground placeholder-neutral-500 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold"
              placeholder="••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-brand-gold px-4 py-2.5 text-sm font-medium text-brand-dark transition-colors hover:bg-brand-gold-light disabled:opacity-50"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}
