import React, { useEffect, useState } from 'react';
import { useClientPortalAccounts } from '@/hooks/useClientPortalAccounts';

interface ClientLoginProps {
  onLogin: (client: any) => void;
}

export function ClientLogin({ onLogin }: ClientLoginProps) {
  const { authenticateClient, getClientAccount } = useClientPortalAccounts();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle impersonation mode if impersonateClientId is in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const impersonateClientId = params.get('impersonateClientId');
    if (impersonateClientId) {
      const client = getClientAccount(impersonateClientId);
      if (client) {
        onLogin({ ...client, isImpersonated: true });
      } else {
        onLogin({
          id: impersonateClientId,
          name: 'Preview Client',
          email: 'preview@example.com',
          isImpersonated: true,
        });
      }
    }
  }, [onLogin, getClientAccount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const client = await authenticateClient(email, password);
      if (client) {
        onLogin(client);
      } else {
        setError('Invalid email or password.');
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary">Client Portal</h1>
          <p className="mt-2 text-gray-600">Sign in to access your account</p>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-700 bg-red-100 rounded-md">{error}</div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center text-sm text-gray-700">
              <input
                type="checkbox"
                className="w-4 h-4 mr-2 text-primary border-gray-300 rounded focus:ring-primary"
              />
              Remember me
            </label>
            <a href="#" className="text-sm font-medium text-primary hover:text-primary-dark">
              Forgot your password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 text-gray-500 bg-white">Demo credentials</span>
            </div>
          </div>
          <div className="mt-4 text-center text-sm text-gray-500">
            Email: demo@example.com<br />
            Password: password
          </div>
        </div>
      </div>
    </div>
  );
}
