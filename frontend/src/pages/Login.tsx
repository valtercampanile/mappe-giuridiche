import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '../hooks/useAuth';

const loginSchema = z.object({
  email: z.string().email('Email non valida'),
  password: z.string().min(1, 'Password obbligatoria'),
});

export default function Login() {
  const { login, isLoading, error, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  if (isAuthenticated) {
    return <Navigate to="/studio" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    clearError();

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      setValidationError(result.error.issues[0].message);
      return;
    }

    try {
      await login(email, password);
      navigate('/studio');
    } catch {
      // Error is handled by the store
    }
  };

  const displayError = validationError || error;

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Mappe Giuridiche</h1>
          <p className="text-text-secondary mt-2">Accedi al tuo account</p>
        </div>

        <form
          onSubmit={(e) => void handleSubmit(e)}
          className="bg-white rounded-lg shadow-sm border border-border p-8"
        >
          {displayError && (
            <div
              className="mb-4 p-3 rounded text-sm bg-red-50 text-error border border-red-200"
              role="alert"
            >
              {displayError}
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-semibold text-text-primary mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              autoComplete="email"
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-text-primary mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-primary text-white font-semibold rounded hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Accesso in corso...' : 'Accedi'}
          </button>

          <p className="mt-4 text-center text-sm text-text-secondary">
            Non hai un account?{' '}
            <Link to="/register" className="text-primary hover:underline">
              Registrati
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
