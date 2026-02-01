'use client';

import { useState } from 'react';

export default function SiteLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/site-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        // Redirect to home page on success
        window.location.href = '/';
      } else {
        setError('Incorrect password');
        setLoading(false);
      }
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0908] flex items-center justify-center p-4">
      <div className="bg-[#0a0908] p-10 rounded-lg w-full max-w-md border border-[#D4A845]/30 shadow-2xl">
        {/* Decorative top accent */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#D4A845]" />
          <span className="text-[#D4A845] text-xs tracking-[0.3em] uppercase">
            Private Event
          </span>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#D4A845]" />
        </div>

        <h1 className="font-serif text-4xl text-[#E6D2B5] text-center mb-2">
          Yonatan & Saron
        </h1>
        <p className="text-center text-[#E6D2B5]/60 text-sm tracking-wide mb-10">
          Enter the password to view this invitation
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {error && (
            <div className="bg-red-900/20 text-red-400 p-3 rounded text-sm text-center border border-red-900/30">
              {error}
            </div>
          )}

          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 bg-[#1a1815] border border-[#D4A845]/30 rounded outline-none focus:border-[#D4A845] transition-colors text-[#E6D2B5] text-center tracking-widest placeholder:text-[#E6D2B5]/30"
              placeholder="Enter Password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#D4A845] text-[#0a0908] font-serif text-lg tracking-widest uppercase hover:bg-[#E6D2B5] transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed rounded"
          >
            {loading ? 'Verifying...' : 'Enter'}
          </button>
        </form>

        {/* Decorative bottom accent */}
        <div className="mt-10 flex justify-center">
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#D4A845]/50 to-transparent" />
        </div>
      </div>
    </div>
  );
}
