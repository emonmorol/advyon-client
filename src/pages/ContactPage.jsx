import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  ArrowUpRight,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Loader2,
  Linkedin,
  Twitter,
  Youtube,
  Sparkles,
} from 'lucide-react';
import AuroraBackground from '@/components/ui/AuroraBackground';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { contactFormSchema, defaultContactValues } from '@/features/landing/contactSchema';
import { fetchContactMeta, submitContactRequest } from '@/services/public/contactService';
import SystemBootLoader from '@/components/ui/SystemBootLoader';
import { useBootSequence } from '@/hooks/useBootSequence';

const fallbackMeta = {
  topics: [
    { key: 'ai-compliance', label: 'AI Compliance', description: 'Governance, audits, risk reviews' },
    { key: 'litigation', label: 'Strategic Litigation', description: 'High-stakes disputes & appeals' },
    { key: 'transactions', label: 'Transactions & M&A', description: 'Cross-border deals, financings' },
  ],
  urgencyLevels: [
    { key: 'critical-24h', label: 'Critical - 24h', description: 'Court or regulator deadline' },
    { key: 'high-72h', label: 'High - 72h', description: 'Strategic response within 3 days' },
    { key: 'standard-week', label: 'Standard - 7d', description: 'Typical onboarding cadence' },
  ],
  offices: [
    {
      city: 'New York',
      address: '228 Park Ave S, NY 10003',
      timezone: 'America/New_York',
      phone: '+1 (332) 239-8109',
      email: 'nyc@advyon.legal',
    },
  ],
  socials: [
    { label: 'LinkedIn', url: 'https://www.linkedin.com/company/advyon', icon: 'linkedin' },
  ],
};

const statCards = [
  { label: 'Median first response', value: '< 15 min', accent: '#5CDBD6' },
  { label: 'Global coverage', value: '24/5', accent: '#E59500' },
  { label: 'AI session assists', value: '99.2% secure', accent: '#ffffff' },
];

const socialIconMap = {
  linkedin: Linkedin,
  twitter: Twitter,
  youtube: Youtube,
};

const usePrefersReducedMotion = () => {
  const [prefers, setPrefers] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return undefined;
    }

    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = () => setPrefers(media.matches);

    handler();

    if (media.addEventListener) {
      media.addEventListener('change', handler);
      return () => media.removeEventListener('change', handler);
    }

    media.addListener(handler);
    return () => media.removeListener(handler);
  }, []);

  return prefers;
};

export default function ContactPage() {
  const { shouldBoot, completeBoot } = useBootSequence();
  const [meta, setMeta] = useState(fallbackMeta);
  const [metaLoading, setMetaLoading] = useState(true);
  const [formValues, setFormValues] = useState(defaultContactValues);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successRef, setSuccessRef] = useState('');
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    let mounted = true;
    fetchContactMeta()
      .then((response) => {
        if (!mounted) return;
        setMeta({
          topics: response?.topics?.length ? response.topics : fallbackMeta.topics,
          urgencyLevels: response?.urgencyLevels?.length ? response.urgencyLevels : fallbackMeta.urgencyLevels,
          offices: response?.offices?.length ? response.offices : fallbackMeta.offices,
          socials: response?.socials?.length ? response.socials : fallbackMeta.socials,
        });
      })
      .catch(() => {
        toast.error('Unable to load contact metadata. Using defaults.');
        setMeta(fallbackMeta);
      })
      .finally(() => mounted && setMetaLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  if (shouldBoot) {
    return <SystemBootLoader onComplete={completeBoot} />;
  }

  const topics = meta?.topics ?? fallbackMeta.topics;
  const urgencyLevels = meta?.urgencyLevels ?? fallbackMeta.urgencyLevels;

  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const normalizedPayload = (values) => ({
    ...values,
    orgName: values.orgName?.trim() || undefined,
    role: values.role?.trim() || undefined,
    phone: values.phone?.trim() || undefined,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormErrors({});
    setSuccessRef('');
    const parsed = contactFormSchema.safeParse(formValues);
    if (!parsed.success) {
      setFormErrors(parsed.error.flatten().fieldErrors);
      toast.error('Please correct highlighted fields.');
      return;
    }
    setSubmitting(true);
    try {
      const result = await submitContactRequest(normalizedPayload(parsed.data));
      setSuccessRef(result?.referenceId || '');
      toast.success('Message received. We will reach out shortly.');
      setFormValues(defaultContactValues);
    } catch (error) {
      toast.error(error?.message || 'Could not submit message');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuroraBackground disableAnimation={prefersReducedMotion} className="min-h-screen">
      <div className="relative mx-auto max-w-6xl px-6 py-16 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1] }}
          className="grid gap-10 lg:grid-cols-[1.05fr,0.95fr]"
        >
          <div className="space-y-10">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1 text-sm font-medium text-white/90 shadow-lg shadow-emerald-500/10">
                <Sparkles className="h-4 w-4 text-emerald-300" /> Advyon Legal Concierge
              </div>
              <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white drop-shadow-2xl md:text-5xl lg:text-6xl">
                Mindful humans + elite AI to solve your hardest legal ops in real time.
              </h1>
              <p className="text-lg text-white/75 md:text-xl">
                Tell us what you are building, defending, or investigating. A senior legal strategist will reply within
                minutes with the right Advyon workspace, AI models, and specialized counsel roster.
              </p>
              <div className="flex flex-wrap gap-4">
                {statCards.map((card) => (
                  <motion.div
                    key={card.label}
                    animate={
                      prefersReducedMotion
                        ? {}
                        : { y: [0, -6, 0], rotateX: [0, 6, 0], boxShadow: ['0 25px 60px rgba(0,0,0,0.2)', '0 35px 70px rgba(0,0,0,0.35)', '0 25px 60px rgba(0,0,0,0.2)'] }
                    }
                    transition={{ duration: 8, repeat: Infinity, delay: Math.random() * 2 }}
                    className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-white"
                    style={{
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                    }}
                  >
                    <p className="text-sm uppercase tracking-[0.2em] text-white/60">{card.label}</p>
                    <p className="text-2xl font-semibold" style={{ color: card.accent }}>
                      {card.value}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white shadow-2xl shadow-black/40 backdrop-blur-3xl">
              <p className="text-sm uppercase tracking-[0.25em] text-white/50">What we can unblock</p>
              <ul className="mt-4 space-y-3 text-white/80">
                <li className="flex items-start gap-3">
                  <ShieldCheck className="mt-1 h-5 w-5 text-emerald-300" />
                  <span>SaaS-ready AI compliance, policy stacks, and regulator briefings.</span>
                </li>
                <li className="flex items-start gap-3">
                  <ShieldCheck className="mt-1 h-5 w-5 text-emerald-300" />
                  <span>Realtime litigation pods with encrypted document rooms.</span>
                </li>
                <li className="flex items-start gap-3">
                  <ShieldCheck className="mt-1 h-5 w-5 text-emerald-300" />
                  <span>Strategic counsel matching for venture, fintech, and public sector missions.</span>
                </li>
              </ul>
              <div className="mt-6 flex flex-wrap gap-3 text-sm text-white/70">
                <span className="rounded-full bg-white/10 px-3 py-1">Clerk-secured intake</span>
                <span className="rounded-full bg-white/10 px-3 py-1">SLA-backed responses</span>
                <span className="rounded-full bg-white/10 px-3 py-1">Global time zones</span>
              </div>
            </div>
          </div>

          <motion.form
            onSubmit={handleSubmit}
            className="relative rounded-3xl border border-white/15 bg-gradient-to-b from-white/10 to-white/5 p-8 shadow-2xl shadow-black/40 backdrop-blur-3xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-white">Start the conversation</h2>
                <p className="text-sm text-white/60">Secure intake - No spam - Human response in minutes.</p>
              </div>
              <ArrowUpRight className="h-8 w-8 text-white/50" />
            </div>
            {successRef && (
              <div className="mb-4 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
                Ticket {successRef} received. Check your inbox for confirmation.
              </div>
            )}
            <div className="space-y-4">
              <Field
                label="Full name"
                required
                value={formValues.fullName}
                onChange={handleInputChange('fullName')}
                error={formErrors.fullName?.[0]}
              />
              <Field
                type="email"
                label="Work email"
                required
                value={formValues.email}
                onChange={handleInputChange('email')}
                error={formErrors.email?.[0]}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Organization"
                  value={formValues.orgName}
                  onChange={handleInputChange('orgName')}
                  error={formErrors.orgName?.[0]}
                />
                <Field label="Role" value={formValues.role} onChange={handleInputChange('role')} error={formErrors.role?.[0]} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Phone" value={formValues.phone} onChange={handleInputChange('phone')} error={formErrors.phone?.[0]} />
                <div>
                  <Label text="Urgency" required />
                  <select
                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-white/40"
                    value={formValues.urgencyKey}
                    onChange={handleInputChange('urgencyKey')}
                  >
                    {urgencyLevels.map((level) => (
                      <option key={level.key} value={level.key} className="text-black">
                        {level.label}
                      </option>
                    ))}
                  </select>
                  {formErrors.urgencyKey && <p className="mt-1 text-xs text-amber-200">{formErrors.urgencyKey[0]}</p>}
                </div>
              </div>
              <div>
                <Label text="Topic" required />
                <select
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-white/40"
                  value={formValues.topicKey}
                  onChange={handleInputChange('topicKey')}
                >
                  <option value="" className="text-black">
                    Choose an area of focus
                  </option>
                  {topics.map((topic) => (
                    <option key={topic.key} value={topic.key} className="text-black">
                      {topic.label}
                    </option>
                  ))}
                </select>
                {formErrors.topicKey && <p className="mt-1 text-xs text-amber-200">{formErrors.topicKey[0]}</p>}
              </div>
              <div>
                <Label text="How can we help?" required />
                <textarea
                  rows={6}
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-white/40"
                  value={formValues.message}
                  onChange={handleInputChange('message')}
                  placeholder="Share context, deadlines, stakeholders..."
                />
                {formErrors.message && <p className="mt-1 text-xs text-amber-200">{formErrors.message[0]}</p>}
              </div>
            </div>
            <Button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full rounded-2xl bg-gradient-to-r from-amber-400 via-rose-400 to-emerald-400 py-6 text-lg font-semibold text-black shadow-[0_15px_40px_rgba(0,0,0,0.45)]"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Sending securely...
                </>
              ) : (
                <>
                  Submit request <ArrowUpRight className="h-5 w-5" />
                </>
              )}
            </Button>
          </motion.form>
        </motion.div>

        <motion.div
          className="mt-16 grid gap-6 md:grid-cols-3"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          {metaLoading
            ? Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="h-40 rounded-3xl border border-white/10 bg-white/5" />
              ))
            : meta.offices.map((office) => (
                <div key={office.city} className="rounded-3xl border border-white/10 bg-white/5 p-5 text-white/85 backdrop-blur-xl">
                  <p className="text-sm uppercase tracking-[0.3em] text-white/50">{office.city}</p>
                  <p className="mt-2 text-lg font-semibold text-white">{office.address}</p>
                  <div className="mt-4 space-y-2 text-sm">
                    <p className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-emerald-300" /> {office.timezone}
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-emerald-300" /> {office.phone}
                    </p>
                    <p className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-emerald-300" /> {office.email}
                    </p>
                  </div>
                </div>
              ))}
        </motion.div>

        <motion.div
          className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 px-6 py-5 text-white/80 backdrop-blur-xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-white/50">Connect</p>
            <p className="text-lg font-medium text-white">Follow Advyon for live dispatches and product drops</p>
          </div>
          <div className="flex gap-3">
            {meta.socials.map((social) => {
              const Icon = socialIconMap[social.icon] || ArrowUpRight;
              return (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-black/20 text-white transition hover:-translate-y-1 hover:border-white/40"
                  aria-label={social.label}
                >
                  <Icon className="h-5 w-5" />
                </a>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AuroraBackground>
  );
}

const Label = ({ text, required }) => (
  <label className="mb-1 block text-sm font-medium text-white/70">
    {text} {required && <span className="text-emerald-300">*</span>}
  </label>
);

const Field = ({ label, type = 'text', required, value, onChange, error }) => (
  <div>
    <Label text={label} required={required} />
    <input
      type={type}
      value={value}
      onChange={onChange}
      className={cn(
        'w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/70',
        error && 'border-amber-300/70',
      )}
      placeholder={label}
    />
    {error && <p className="mt-1 text-xs text-amber-200">{error}</p>}
  </div>
);
