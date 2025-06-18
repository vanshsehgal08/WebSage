import React, { useState } from 'react';
import { supabase } from '../config';
import { Mail, Lock } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';

const Auth: React.FC<{ onAuth: () => void }> = ({ onAuth }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let result;
    if (isSignUp) {
      result = await supabase.auth.signUp({
        email,
        password,
      });
    } else {
      result = await supabase.auth.signInWithPassword({
        email,
        password,
      });
    }

    setLoading(false);
    if (result.error) setError(result.error.message);
    else onAuth();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#181928] via-[#23243a] to-[#1a1b2e] relative overflow-hidden">
      {/* Animated Gradient Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full blur-3xl animate-float z-0" style={{animationDelay: '0s'}}></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-full blur-3xl animate-float z-0" style={{animationDelay: '2s'}}></div>
      <form onSubmit={handleAuth} className="relative z-10 w-full max-w-md p-10 glassmorphism rounded-3xl shadow-2xl border border-white/10 backdrop-blur-xl">
        <h2 className="text-3xl font-extrabold text-center mb-8 gradient-text drop-shadow">{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
        {/* Google Sign In Button */}
        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 py-3 mb-7 rounded-xl bg-white/90 hover:bg-white transition-all duration-200 shadow group border border-gray-200"
          onClick={async () => {
            await supabase.auth.signInWithOAuth({ provider: 'google' });
          }}
        >
          <FcGoogle className="w-6 h-6" />
          <span className="text-gray-800 font-semibold text-base group-hover:text-purple-600 transition">Sign in with Google</span>
        </button>
        {/* Divider */}
        <div className="flex items-center my-5">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-400/30 to-transparent" />
          <span className="mx-4 text-gray-400 text-xs font-medium">or</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-gray-400/30 to-transparent" />
        </div>
        {/* Email/Password Fields */}
        <div className="mb-5 relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition shadow-inner"
            required
            autoFocus
          />
        </div>
        <div className="mb-6 relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 transition shadow-inner"
            required
          />
        </div>
        {error && <div className="text-red-400 mb-4 text-center text-sm font-medium">{error}</div>}
        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
          disabled={loading}
        >
          {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
        </button>
        <div className="mt-6 text-center">
          <button
            type="button"
            className="text-purple-400 hover:underline text-sm font-medium"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            <span className="underline">{isSignUp ? 'Sign In' : 'Sign Up'}</span>
          </button>
        </div>
      </form>
      {/* Custom styles for glassmorphism and animation */}
      <style>{`
        .glassmorphism {
          background: rgba(255, 255, 255, 0.08);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.18);
        }
        .gradient-text {
          background: linear-gradient(90deg, #a78bfa, #f472b6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Auth; 