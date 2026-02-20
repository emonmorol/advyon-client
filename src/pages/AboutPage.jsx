import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ShieldCheck, Target, Code, Heart, Users, Briefcase } from 'lucide-react';
import PublicPageLayout from '@/components/layout/PublicPageLayout';
import { PageHero } from '@/components/ui/PageHero';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { GlassCard } from '@/components/ui/GlassCard';
import SystemBootLoader from '@/components/ui/SystemBootLoader';
import { useBootSequence } from '@/hooks/useBootSequence';

const teamMembers = [
  {
    name: 'Alex Rivera',
    role: 'CEO & Co-Founder',
    bio: 'Former corporate litigator turned tech innovator.',
    avatar: 'https://api.dicebear.com/9.x/pixel-art/svg?seed=Alex&backgroundColor=b6e3f4',
  },
  {
    name: 'Samuel Chen',
    role: 'CTO',
    bio: 'AI researcher with 10+ years in NLP and machine learning.',
    avatar: 'https://api.dicebear.com/9.x/pixel-art/svg?seed=Samuel&backgroundColor=c0aede',
  },
  {
    name: 'Marcus Johnson',
    role: 'Head of Product',
    bio: 'Obsessed with making complex workflows simple and intuitive.',
    avatar: 'https://api.dicebear.com/9.x/pixel-art/svg?seed=Marcus&backgroundColor=d1d4f9',
  },
  {
    name: 'Eric Rodriguez',
    role: 'Legal Counsel',
    bio: 'Ensuring our platform meets the highest compliance standards.',
    avatar: 'https://api.dicebear.com/9.x/pixel-art/svg?seed=Eric&backgroundColor=ffdfbf',
  },
  {
    name: 'David Kim',
    role: 'Lead Engineer',
    bio: 'Building distinct, scalable architecture for the future.',
    avatar: 'https://api.dicebear.com/9.x/pixel-art/svg?seed=David&backgroundColor=b6e3f4',
  },
  {
    name: 'Oliver Wright',
    role: 'Customer Success',
    bio: 'Dedicated to helping firms succeed with digital transformation.',
    avatar: 'https://api.dicebear.com/9.x/pixel-art/svg?seed=Oliver&backgroundColor=ffd5dc',
  },
];

const values = [
  { icon: ShieldCheck, title: 'Uncompromising Security', desc: 'We treat client data with the same rigor as national secrets.' },
  { icon: Target, title: 'Precision First', desc: "In law, accuracy is not optional. It's our baseline." },
  { icon: Code, title: 'Innovation', desc: 'We constantly push the boundaries of legal tech.' },
  { icon: Heart, title: 'Client Empathy', desc: 'Built by lawyers, for lawyers. We understand the pressure.' },
  { icon: Users, title: 'Collaboration', desc: 'Great legal work happens together. Our tool enables that.' },
  { icon: Briefcase, title: 'Professionalism', desc: 'A platform that reflects the dignity of the profession.' },
];

export default function AboutPage() {
  const { shouldBoot, completeBoot } = useBootSequence();

  if (shouldBoot) {
    return <SystemBootLoader onComplete={completeBoot} />;
  }

  return (
    <PublicPageLayout
      title="About Advyon"
      description="Learn about our mission to redefine legal work through AI and intelligent automation."
    >
      <PageHero
        title="Redefining Legal Work"
        subtitle="We are on a mission to empower legal professionals with the intelligence they need to thrive in a digital world."
        badge="Our Story"
      />

      <section className="py-20 relative">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold mb-6 text-white">Empowering the Future</h2>
              <div className="space-y-6 text-lg text-emerald-100/70 font-light leading-relaxed">
                <p>
                  Advyon was born from a simple frustration: legal professionals spend too much time chasing documents and not enough
                  time practicing law.
                </p>
                <p>
                  We believe that technology should be an invisible superpower. It should handle the drudgery, organize the chaos, and
                  surface the insights that win cases.
                </p>
                <p>
                  Today, we are building the operating system for the modern firm--secure, intelligent, and beautifully designed.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative h-[400px]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-transparent rounded-[3rem] border border-teal-500/20 backdrop-blur-sm" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative w-64 h-64">
                  <div className="absolute inset-0 bg-teal-500/20 rounded-full blur-3xl animate-pulse" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ShieldCheck className="w-32 h-32 text-teal-200/50" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6 lg:px-12">
          <SectionHeader title="Meet the Builders" subtitle="A diverse team of legal experts, engineers, and designers." />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <GlassCard interactive className="text-center hover:bg-white/5 transition-all duration-300 group">
                  <div className="mx-auto mb-6 relative w-24 h-24">
                    <div className="absolute inset-0 bg-teal-500/20 rounded-full blur-xl group-hover:bg-teal-500/40 transition-colors" />
                    <Avatar className="w-24 h-24 border-2 border-teal-500/30 rounded-full bg-white/5">
                      <AvatarImage src={member.avatar} alt={member.name} className="object-cover" />
                      <AvatarFallback>{member.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-teal-300 transition-colors">{member.name}</h3>
                  <div className="text-sm font-medium text-teal-500 uppercase tracking-wider mb-4">{member.role}</div>
                  <p className="text-emerald-100/60 text-sm italic">"{member.bio}"</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6 lg:px-12">
          <SectionHeader title="Our Core Values" subtitle="The principles that guide every line of code we write." />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value) => (
              <GlassCard key={value.title} className="hover:border-teal-500/40 transition-colors duration-300">
                <div className="flex items-start gap-4">
                  <div className="mt-1 p-2 rounded-lg bg-teal-500/10 text-teal-400">
                    <value.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-2">{value.title}</h4>
                    <p className="text-sm text-emerald-100/70">{value.desc}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-6 lg:px-12">
          <SectionHeader title="Our Journey" />

          <div className="relative max-w-4xl mx-auto">
            <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-px bg-teal-900 md:-translate-x-1/2" />

            {[
              { year: '2024', title: 'Inception', desc: 'Advyon founded in San Francisco.' },
              { year: '2025 Q1', title: 'Beta Launch', desc: 'First 50 law firms onboarded.' },
              { year: '2025 Q3', title: 'AI Core 2.0', desc: 'Launched proprietary legal reasoning model.' },
              { year: '2026', title: 'Global Expansion', desc: 'Opening offices in London and Singapore.' },
            ].map((item, index) => (
              <div key={item.year} className={`relative flex flex-col md:flex-row gap-8 mb-12 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                <div className="flex-1 md:text-right" />
                <div className="relative z-10 flex-shrink-0 w-10 h-10 rounded-full bg-[#001514] border-2 border-teal-500 flex items-center justify-center shadow-[0_0_15px_rgba(20,184,166,0.5)]">
                  <div className="w-3 h-3 bg-teal-400 rounded-full" />
                </div>
                <div className="flex-1 pb-8 md:pb-0">
                  <GlassCard className="p-6 relative">
                    <div className="text-sm font-bold text-teal-500 mb-1">{item.year}</div>
                    <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-emerald-100/60">{item.desc}</p>
                  </GlassCard>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicPageLayout>
  );
}
