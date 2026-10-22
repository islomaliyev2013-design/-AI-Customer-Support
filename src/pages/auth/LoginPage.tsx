import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('alex.mercer@apextech.io');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    setLoading(true);
    const result = await signIn(email.trim(), password, rememberMe);
    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      navigate(from, { replace: true });
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Enter your credentials to access your SaaS dashboard"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-rose-300 text-xs animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <Input
          label="Email Address"
          type="email"
          name="email"
          placeholder="name@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<Mail className="w-4 h-4" />}
          themeVariant="glass"
          required
        />

        <Input
          label="Password"
          isPassword
          name="password"
          placeholder="••••••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          leftIcon={<Lock className="w-4 h-4" />}
          themeVariant="glass"
          required
        />

        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-purple-500/40 bg-black/40 text-purple-600 focus:ring-purple-500/40 focus:ring-offset-0 cursor-pointer accent-purple-600"
            />
            <span>Remember me</span>
          </label>

          <Link
            to="/forgot-password"
            className="text-purple-400 hover:text-purple-300 transition-colors font-medium hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="neon"
          size="lg"
          className="w-full mt-4"
          isLoading={loading}
          icon={<LogIn className="w-4 h-4" />}
        >
          Sign In to Dashboard
        </Button>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <span className="relative px-3 bg-[#0B0D15]/90 text-[11px] uppercase tracking-wider text-slate-400">
            or continue with
          </span>
        </div>

        {/* Google sign-in */}
        <button
          type="button"
          onClick={() => {
            setEmail('demo.google@apextech.io');
            setPassword('google-oauth-demo');
          }}
          className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/30 text-white text-sm font-medium transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.54 0 2.93.54 4.03 1.43l3.03-3.03C17.21 1.71 14.77 1 12 1 7.48 1 3.65 3.58 1.77 7.34l3.69 2.86C6.35 7.15 8.94 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.7 2.87c2.16-1.99 3.72-4.93 3.72-8.69z"
            />
            <path
              fill="#FBBC05"
              d="M5.46 14.8c-.24-.71-.38-1.47-.38-2.26s.14-1.55.38-2.26L1.77 7.34C.64 9.6.01 12 .01 12.54s.64 2.94 1.77 5.2l3.69-2.94z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.24 0 5.95-1.08 7.93-2.91l-3.7-2.87c-1.07.72-2.45 1.16-4.23 1.16-3.06 0-5.65-2.15-6.54-5.2L1.77 16c1.88 3.76 5.71 6.34 10.23 6.34z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <p className="text-center text-xs text-slate-400 pt-2">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-purple-400 hover:text-purple-300 font-semibold hover:underline"
          >
            Create an Account
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};
