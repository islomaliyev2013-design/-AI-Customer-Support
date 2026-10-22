import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Building2, Globe, Mail, Phone, Hash, DollarSign, Sparkles, Image, Check } from 'lucide-react';

export const SetupBusinessPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, business, updateBusinessData } = useAuth();

  const [name, setName] = useState(business?.name || '');
  const [slug, setSlug] = useState(business?.slug || '');
  const [description, setDescription] = useState(business?.description || '');
  const [category, setCategory] = useState(business?.category || 'Electronics & Tech');
  const [contactEmail, setContactEmail] = useState(business?.contact_email || user?.email || '');
  const [phone, setPhone] = useState(business?.phone || '+998 71 200 4488');
  const [website, setWebsite] = useState(business?.website || 'https://');
  const [currency, setCurrency] = useState<'USD' | 'UZS' | 'EUR'>(business?.currency || 'USD');
  const [logoUrl, setLogoUrl] = useState(
    business?.logo_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80'
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!slug || slug === name.toLowerCase().replace(/[^a-z0-9]/g, '-')) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-'));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Business name is required.');
      return;
    }
    if (!slug.trim()) {
      setError('Unique business slug is required.');
      return;
    }
    if (!contactEmail.trim()) {
      setError('Contact email is required.');
      return;
    }

    setLoading(true);
    try {
      await updateBusinessData({
        name: name.trim(),
        slug: slug.trim().toLowerCase(),
        description: description.trim(),
        category,
        contact_email: contactEmail.trim(),
        phone: phone.trim(),
        website: website.trim(),
        currency,
        logo_url: logoUrl.trim(),
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to save business settings.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090E] flex flex-col justify-center items-center p-4 md:p-8">
      {/* Glow effect */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-600/10 blur-[140px] pointer-events-none rounded-full" />

      <div className="w-full max-w-2xl bg-[#0D101A] border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              Set Up Your Business Profile
              <Sparkles className="w-4 h-4 text-purple-400" />
            </h1>
            <p className="text-xs text-slate-400">
              Configure your store credentials, unique public support URL, and currency.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Business Name"
              placeholder="e.g. ApexTech Electronics"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              leftIcon={<Building2 className="w-4 h-4" />}
              themeVariant="dashboard"
              required
            />

            <div>
              <Input
                label="Unique Support Slug"
                placeholder="apex-tech"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                leftIcon={<Hash className="w-4 h-4" />}
                themeVariant="dashboard"
                helperText={`Public Support URL: /support/${slug || 'your-slug'}`}
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1.5">
              Business Description & AI Greeting Context
            </label>
            <textarea
              rows={3}
              className="w-full rounded-xl px-3.5 py-2.5 text-sm transition-all duration-200 outline-none border bg-[#121520] border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 placeholder:text-slate-500 text-white"
              placeholder="Tell your customers and the AI assistant what your business specializes in..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl px-3.5 py-2.5 text-sm transition-all duration-200 outline-none border bg-[#121520] border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-white cursor-pointer"
              >
                <option value="Electronics & Tech">Electronics & Tech</option>
                <option value="Software & SaaS">Software & SaaS</option>
                <option value="Fashion & Apparel">Fashion & Apparel</option>
                <option value="Food & Beverages">Food & Beverages</option>
                <option value="Healthcare & Beauty">Healthcare & Beauty</option>
                <option value="Financial Services">Financial Services</option>
                <option value="Other">Other Retail / Services</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1.5 flex items-center justify-between">
                <span>Default Currency</span>
                <DollarSign className="w-3.5 h-3.5 text-purple-400" />
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as any)}
                className="w-full rounded-xl px-3.5 py-2.5 text-sm transition-all duration-200 outline-none border bg-[#121520] border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-white cursor-pointer"
              >
                <option value="USD">USD ($) - US Dollar</option>
                <option value="UZS">UZS (so'm) - O'zbekiston So'mi</option>
                <option value="EUR">EUR (€) - Euro</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Contact Support Email"
              type="email"
              placeholder="support@company.com"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              themeVariant="dashboard"
              required
            />

            <Input
              label="Phone Number"
              placeholder="+998 71 200 4488"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              leftIcon={<Phone className="w-4 h-4" />}
              themeVariant="dashboard"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Website URL"
              placeholder="https://company.com"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              leftIcon={<Globe className="w-4 h-4" />}
              themeVariant="dashboard"
            />

            <Input
              label="Logo Image URL"
              placeholder="https://images.unsplash.com/..."
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              leftIcon={<Image className="w-4 h-4" />}
              themeVariant="dashboard"
            />
          </div>

          {/* Logo preview */}
          {logoUrl && (
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3">
              <img
                src={logoUrl}
                alt="Logo preview"
                className="w-10 h-10 rounded-lg object-cover bg-black border border-white/10"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="text-xs text-slate-300">Brand Logo Preview</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/dashboard')}
            >
              Skip to Dashboard
            </Button>
            <Button
              type="submit"
              variant="neon"
              size="lg"
              isLoading={loading}
              icon={<Check className="w-4 h-4" />}
            >
              Save & Launch Business
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
