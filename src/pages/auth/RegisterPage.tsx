import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../contexts/AuthContext';
import { User, Mail, Lock, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError('Full name is required.');
      return;
    }
    if (!email.trim()) {
      setError('Email address is required.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    setLoading(true);
    const result = await signUp(fullName.trim(), email.trim(), password);
    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else if (result.requireVerification) {
      setSuccessNotice('Registration successful! Please check your email to verify your account.');
    } else {
      // Redirect to business setup
      navigate('/setup-business');
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join the AI-powered SaaS customer support revolution"
    >
      {successNotice ? (
        <div className="text-center py-6 space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center ring-1 ring-emerald-500/30">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-white">Check Your Inbox</h3>
          <p className="text-sm text-slate-300 leading-relaxed">{successNotice}</p>
          <Button
            variant="neon"
            className="w-full mt-4"
            onClick={() => navigate('/login')}
          >
            Go to Sign In
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-rose-300 text-xs animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <Input
            label="Full Name"
            name="fullName"
            placeholder="Sarah Jenkins"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            leftIcon={<User className="w-4 h-4" />}
            themeVariant="glass"
            required
          />

          <Input
            label="Work Email"
            type="email"
            name="email"
            placeholder="sarah@company.com"
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
            placeholder="Minimum 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock className="w-4 h-4" />}
            themeVariant="glass"
            required
          />

          <Input
            label="Confirm Password"
            isPassword
            name="confirmPassword"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            leftIcon={<Lock className="w-4 h-4" />}
            themeVariant="glass"
            required
          />

          <Button
            type="submit"
            variant="neon"
            size="lg"
            className="w-full mt-3"
            isLoading={loading}
            icon={<UserPlus className="w-4 h-4" />}
          >
            Create SaaS Account
          </Button>

          <p className="text-center text-xs text-slate-400 pt-3">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-purple-400 hover:text-purple-300 font-semibold hover:underline"
            >
              Sign In
            </Link>
          </p>
        </form>
      )}
    </AuthLayout>
  );
};
