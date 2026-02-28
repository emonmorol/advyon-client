import { motion } from 'framer-motion';
import { Briefcase, Users, Building2, ShieldCheck } from 'lucide-react';

const roles = [
  {
    icon: Briefcase,
    title: 'Lawyers',
    description:
      'Full administrative control. Manage cases, upload evidence, and utilize advanced AI paralegal tools.',
    highlight: false,
  },
  {
    icon: Users,
    title: 'Clients',
    description:
      'Read-only transparency into case progress. Securely upload requested evidence and chat with your legal team.',
    highlight: false,
  },
  {
    icon: Building2,
    title: 'Judges',
    description:
      'Future Implementation. Specialized read-access to public legal databases and community discussions.',
    highlight: true,
  },
  {
    icon: ShieldCheck,
    title: 'Admins',
    description:
      'System oversight, content moderation in Community Hub, and verified lawyer profile approvals.',
    highlight: false,
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function RolesSection() {
  return (
    <section id="roles" className="py-28 px-8 md:px-24">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <span className="landing-section-tag mb-4 inline-block">The Ecosystem</span>
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
          Dedicated Role Solutions
        </h2>
      </motion.div>

      {/* Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {roles.map((role) => (
          <motion.div
            key={role.title}
            variants={item}
            className={`landing-glass-card p-8 group cursor-default ${
              role.highlight ? 'border-teal-accent/30 bg-primary/10' : ''
            }`}
          >
            <div className="text-teal-bright mb-4">
              <role.icon className="w-8 h-8" strokeWidth={1.5} />
            </div>
            <h4 className="text-xl font-bold mb-3 text-white">{role.title}</h4>
            <p className={`text-sm leading-relaxed ${role.highlight ? 'text-teal-bright' : 'text-gray-400'}`}>
              {role.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
