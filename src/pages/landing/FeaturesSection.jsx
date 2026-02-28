import { motion } from 'framer-motion';
import {
  BookOpen,
  MessageSquare,
  Brain,
  ArrowRight,
  ListChecks,
  FileSearch,
  Landmark,
  BotMessageSquare,
} from 'lucide-react';

const aiFeatures = [
  { icon: ListChecks, label: 'Next Steps', text: 'Prioritized tasks: "Prepare motion for [date]" based on court schedules.' },
  { icon: FileSearch, label: 'Missing Documents', text: 'Automated gap detection: "Witness statement referenced but not found."' },
  { icon: Landmark, label: 'Legal Precedents', text: 'Real-time matching of current case facts to historic court orders.' },
  { icon: BotMessageSquare, label: 'AI Chat Assistant', text: 'Responds to "Summarize this FIR" or "Find inconsistencies in evidence."' },
];

export default function FeaturesSection() {
  return (
    <section id="ai" className="py-28 px-8 md:px-24">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <span className="landing-section-tag mb-4 inline-block">Core Modules</span>
        <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">
          AI Augmented Practice.
        </h2>
      </motion.div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Legal Database */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="landing-glass-card p-10 flex flex-col justify-between group"
        >
          <div>
            <div className="w-16 h-16 bg-primary/30 rounded-2xl flex items-center justify-center mb-8 border border-teal-accent/30">
              <BookOpen className="w-8 h-8 text-teal-bright" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white">Legal Database</h3>
            <p className="text-gray-400 leading-relaxed">
              Searchable library of laws. Narrow down by jurisdiction, act title, or
              section number with auto-complete suggestions.
            </p>
          </div>
          <button className="text-teal-bright font-bold flex items-center gap-2 mt-6 group-hover:gap-4 transition-all">
            Search Library <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>

        {/* Community Hub */}
        <motion.div
          id="community"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="landing-glass-card p-10 md:col-span-2 flex items-center gap-10 group"
        >
          <div className="flex-1">
            <div className="w-16 h-16 bg-primary/30 rounded-2xl flex items-center justify-center mb-8 border border-teal-accent/30">
              <MessageSquare className="w-8 h-8 text-teal-bright" />
            </div>
            <h3 className="text-3xl font-bold mb-4 text-white">Community Hub</h3>
            <p className="text-gray-400 text-lg leading-relaxed">
              A collaborative forum where verified legal experts share insights.
              Real-time Q&A with AI-generated thread summaries for instant learning.
            </p>
          </div>
        </motion.div>

        {/* AI Suggestions Engine — full span */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="landing-glass-card p-10 md:col-span-3 group overflow-hidden"
        >
          <div className="flex flex-col md:flex-row gap-10">
            <div className="flex-1">
              <span className="landing-section-tag mb-4 inline-block">Predictive Intelligence</span>
              <h3 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight text-white">
                The AI Suggestions Engine
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {aiFeatures.map((feat) => (
                  <div key={feat.label} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <feat.icon className="w-4 h-4 text-teal-bright" />
                      <h5 className="text-teal-bright font-bold uppercase text-xs tracking-widest">
                        {feat.label}
                      </h5>
                    </div>
                    <p className="text-gray-400 text-sm">{feat.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Decorative glow */}
            <div className="hidden md:flex items-center justify-center">
              <div className="relative">
                <Brain className="w-32 h-32 text-teal-bright/10" strokeWidth={0.5} />
                <div className="absolute inset-0 rounded-full bg-teal-bright/5 blur-3xl" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
