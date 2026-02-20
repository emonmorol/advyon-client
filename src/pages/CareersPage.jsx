import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Clock, DollarSign } from 'lucide-react';
import PublicPageLayout from '@/components/layout/PublicPageLayout';
import { PageHero } from '@/components/ui/PageHero';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import SystemBootLoader from '@/components/ui/SystemBootLoader';
import { useBootSequence } from '@/hooks/useBootSequence';

const positions = [
  {
    title: 'Senior Full Stack Engineer',
    dept: 'Engineering',
    loc: 'Remote / SF',
    type: 'Full-time',
    salary: '$160k - $220k',
    desc: 'Architecting the core of our AI-driven legal reasoning engine.',
  },
  {
    title: 'Legal Domain Expert (AI Trainer)',
    dept: 'AI Research',
    loc: 'Remote',
    type: 'Contract / Full-time',
    salary: '$120k - $180k',
    desc: 'Teaching our models to understand complex case law and contracts.',
  },
  {
    title: 'Product Designer',
    dept: 'Design',
    loc: 'New York, NY',
    type: 'Full-time',
    salary: '$140k - $190k',
    desc: 'Crafting intuitive interfaces for complex legal workflows.',
  },
  {
    title: 'Enterprise Sales Manager',
    dept: 'Sales',
    loc: 'Chicago, IL',
    type: 'Full-time',
    salary: '$150k + Commission',
    desc: 'Bringing Advyon to Am Law 100 firms.',
  },
];

export default function CareersPage() {
  const { shouldBoot, completeBoot } = useBootSequence();

  if (shouldBoot) {
    return <SystemBootLoader onComplete={completeBoot} />;
  }

  return (
    <PublicPageLayout title="Careers at Advyon" description="Join the team building the future of legal technology.">
      <PageHero
        title="Join the Revolution"
        subtitle="We're looking for world-class talent to help us transform the legal industry."
        badge="We are hiring"
      />

      <section className="py-20">
        <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
          <div className="grid gap-6">
            {positions.map((role) => (
              <motion.div
                key={role.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <GlassCard interactive className="group hover:border-teal-500/50">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <div className="text-sm font-bold text-teal-500 mb-1">{role.dept}</div>
                      <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-teal-200 transition-colors">
                        {role.title}
                      </h3>
                      <p className="text-emerald-100/60 mb-4 max-w-xl">{role.desc}</p>

                      <div className="flex flex-wrap gap-4 text-sm text-emerald-100/50">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" /> {role.loc}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" /> {role.type}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" /> {role.salary}
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <Button className="bg-white text-teal-950 hover:bg-emerald-100 font-bold rounded-xl px-6">
                        Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PublicPageLayout>
  );
}
