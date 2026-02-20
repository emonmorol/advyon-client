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
  ArrowRight,
  Globe
} from 'lucide-react';
import PublicPageLayout from '@/components/layout/PublicPageLayout';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/GlassCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
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
  { label: 'Median first response', value: '< 15 min', accent: 'text-teal-400' },
  { label: 'Global coverage', value: '24/5', accent: 'text-amber-400' },
  { label: 'AI session assists', value: '99.2% secure', accent: 'text-emerald-300' },
];

const socialIconMap = {
  linkedin: Linkedin,
  twitter: Twitter,
  youtube: Youtube,
};

export default function ContactPage() {
  const { shouldBoot, completeBoot } = useBootSequence();
  const [meta, setMeta] = useState(fallbackMeta);
  const [metaLoading, setMetaLoading] = useState(true);
  const [formValues, setFormValues] = useState(defaultContactValues);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successRef, setSuccessRef] = useState('');

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
    <PublicPageLayout
      title="Contact Us"
      description="Connect with Advyon's legal strategy team. Secure intake for meaningful legal operations support."
    >
      <section className="relative py-20 lg:py-24 min-h-[90vh] flex items-center mt-10">
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            
            {/* LEFT COLUMN: Info & Context */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-10"
            >
              <div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 inline-flex items-center gap-2 rounded-full bg-teal-900/30 px-4 py-1.5 text-xs font-semibold tracking-wider text-teal-300 backdrop-blur-md border border-teal-500/20 shadow-lg cursor-default uppercase"
                >
                  <Sparkles className="h-3 w-3 text-teal-200" />
                  <span>Advyon Legal Concierge</span>
                </motion.div>
                
                <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl mb-6 leading-tight drop-shadow-lg">
                  Mindful humans + <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-200 via-emerald-100 to-teal-400">
                    elite AI support.
                  </span>
                </h1>
                
                <p className="text-lg text-emerald-100/70 leading-relaxed font-light max-w-lg">
                  Tell us what you are building, defending, or investigating. A senior legal strategist will reply within
                  minutes with the right Advyon workspace, AI models, and specialized counsel roster.
                </p>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {statCards.map((card, i) => (
                  <GlassCard key={i} className="p-4 bg-teal-950/20 border-teal-500/10 hover:bg-teal-900/10 transition-colors">
                    <p className="text-xs uppercase tracking-wider text-emerald-100/50 mb-1">{card.label}</p>
                    <p className={cn("text-xl font-bold", card.accent)}>{card.value}</p>
                  </GlassCard>
                ))}
              </div>

              {/* Capabilities List */}
              <div className="p-6 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-widest text-emerald-100/40 mb-4 font-bold border-b border-white/5 pb-2">What we can unblock</p>
                <ul className="space-y-4">
                  {[
                    "SaaS-ready AI compliance, policy stacks, and regulator briefings.",
                    "Realtime litigation pods with encrypted document rooms.",
                    "Strategic counsel matching for venture, fintech, and public sector missions."
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-emerald-50/80 text-sm">
                      <ShieldCheck className="mt-0.5 h-4 w-4 text-teal-400 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Socials */}
              <div className="flex items-center gap-4 pt-4">
                <p className="text-sm font-medium text-emerald-100/60">Connect on social:</p>
                <div className="flex gap-2">
                  {meta.socials.map((social) => {
                    const Icon = socialIconMap[social.icon] || ArrowUpRight;
                    return (
                      <a
                        key={social.label}
                        href={social.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 text-teal-300 border border-teal-500/20 hover:bg-teal-500/20 hover:border-teal-500/40 transition-all"
                        aria-label={social.label}
                      >
                        <Icon className="h-4 w-4" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* RIGHT COLUMN: Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <GlassCard className="p-8 md:p-10 border-teal-500/30 shadow-2xl shadow-black/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="mb-8 flex items-start justify-between relative z-10">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Start conversation</h2>
                    <p className="text-sm text-emerald-100/60">Secure intake • Human response in minutes</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-teal-500/10 flex items-center justify-center border border-teal-500/20">
                     <Mail className="h-5 w-5 text-teal-400" />
                  </div>
                </div>

                {successRef && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100 flex items-center gap-3"
                  >
                    <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Ticket <strong>{successRef}</strong> received. Check your inbox.</span>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
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
                        <div className="relative">
                          <select
                            className="w-full appearance-none rounded-xl border border-teal-500/20 bg-black/40 px-4 py-3 text-emerald-50 focus:border-teal-400 focus:bg-black/60 focus:outline-none focus:ring-1 focus:ring-teal-400/50 transition-all font-light"
                            value={formValues.urgencyKey}
                            onChange={handleInputChange('urgencyKey')}
                          >
                            {urgencyLevels.map((level) => (
                              <option key={level.key} value={level.key} className="bg-slate-900 text-white">
                                {level.label}
                              </option>
                            ))}
                          </select>
                           <ArrowRight className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-teal-500/50 pointer-events-none rotate-90" />
                        </div>
                        {formErrors.urgencyKey && <p className="mt-1 text-xs text-amber-300">{formErrors.urgencyKey[0]}</p>}
                      </div>
                    </div>

                     <div>
                      <Label text="Topic" required />
                       <div className="relative">
                        <select
                          className="w-full appearance-none rounded-xl border border-teal-500/20 bg-black/40 px-4 py-3 text-emerald-50 focus:border-teal-400 focus:bg-black/60 focus:outline-none focus:ring-1 focus:ring-teal-400/50 transition-all font-light"
                          value={formValues.topicKey}
                          onChange={handleInputChange('topicKey')}
                        >
                          <option value="" className="bg-slate-900 text-white/50">Choose an area of focus...</option>
                          {topics.map((topic) => (
                            <option key={topic.key} value={topic.key} className="bg-slate-900 text-white">
                              {topic.label}
                            </option>
                          ))}
                        </select>
                         <ArrowRight className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-teal-500/50 pointer-events-none rotate-90" />
                      </div>
                      {formErrors.topicKey && <p className="mt-1 text-xs text-amber-300">{formErrors.topicKey[0]}</p>}
                    </div>

                    <div>
                      <Label text="How can we help?" required />
                      <textarea
                        rows={4}
                        className="w-full rounded-xl border border-teal-500/20 bg-black/40 px-4 py-3 text-emerald-50 placeholder:text-emerald-100/20 focus:border-teal-400 focus:bg-black/60 focus:outline-none focus:ring-1 focus:ring-teal-400/50 transition-all font-light resize-none"
                        value={formValues.message}
                        onChange={handleInputChange('message')}
                        placeholder="Share context, deadlines, stakeholders..."
                      />
                      {formErrors.message && <p className="mt-1 text-xs text-amber-300">{formErrors.message[0]}</p>}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full h-14 text-lg bg-teal-500 text-teal-950 hover:bg-teal-400 font-bold rounded-xl shadow-lg shadow-teal-500/20 transition-all duration-300"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Sending...
                      </>
                    ) : (
                      <>
                        Submit Request <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </form>
              </GlassCard>
            </motion.div>
          </div>

          {/* Offices Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mt-24 pt-10 border-t border-white/5"
          >
             <SectionHeader title="Global Presence" subtitle="Where to find us." className="mb-10 text-left" />
             
             <div className="grid md:grid-cols-3 gap-6">
               {metaLoading
                ? Array.from({ length: 3 }).map((_, idx) => (
                    <GlassCard key={idx} className="h-40 animate-pulse bg-white/5" />
                  ))
                : meta.offices.map((office) => (
                    <GlassCard key={office.city} className="p-6 hover:bg-white/5 transition-colors group">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                           <Globe className="h-4 w-4 text-teal-400" />
                           <span className="text-xs uppercase tracking-widest text-emerald-100/50 font-bold">{office.city}</span>
                        </div>
                        <div className="h-2 w-2 rounded-full bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.6)]" />
                      </div>
                      
                      <p className="text-lg font-medium text-white mb-6 leading-relaxed">
                        {office.address}
                      </p>
                      
                      <div className="space-y-2 text-sm text-emerald-100/60 group-hover:text-emerald-100/80 transition-colors">
                        <p className="flex items-center gap-2">
                           <span className="w-16 text-xs text-emerald-100/30 uppercase">Timezone</span>
                           {office.timezone}
                        </p>
                        <p className="flex items-center gap-2">
                           <span className="w-16 text-xs text-emerald-100/30 uppercase">Phone</span>
                           <a href={`tel:${office.phone}`} className="hover:text-teal-400 transition-colors">{office.phone}</a>
                        </p> 
                         <p className="flex items-center gap-2">
                           <span className="w-16 text-xs text-emerald-100/30 uppercase">Email</span>
                           <a href={`mailto:${office.email}`} className="hover:text-teal-400 transition-colors">{office.email}</a>
                        </p>
                      </div>
                    </GlassCard>
                  ))}
             </div>
          </motion.div>
        
        </div>
      </section>
    </PublicPageLayout>
  );
}

const Label = ({ text, required }) => (
  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-emerald-100/50">
    {text} {required && <span className="text-teal-400">*</span>}
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
        'w-full rounded-xl border border-teal-500/20 bg-black/40 px-4 py-3 text-emerald-50 placeholder:text-emerald-100/20 focus:border-teal-400 focus:bg-black/60 focus:outline-none focus:ring-1 focus:ring-teal-400/50 transition-all font-light',
        error && 'border-amber-400/50 focus:ring-amber-400/50',
      )}
      placeholder={label}
    />
    {error && <p className="mt-1 text-xs text-amber-300">{error}</p>}
  </div>
);
