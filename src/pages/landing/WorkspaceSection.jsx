import { motion } from 'framer-motion';
import { Scale, Fingerprint, Code, FolderTree } from 'lucide-react';

const features = [
  {
    icon: FolderTree,
    title: 'Case Dashboard & Detail',
    description:
      'Clean three-column layout: Case Metadata, Document Hierarchy (File Tree), and AI Insights sidebar.',
  },
  {
    icon: Fingerprint,
    title: 'Smart File Intake (OCR)',
    description:
      'Automated text extraction from scanned PDFs. Quality checks with side-by-side verification ensure data accuracy.',
  },
  {
    icon: Code,
    title: 'Document Management',
    description:
      'Version-tracked uploads with automated categorization, preview, and role-based access controls.',
  },
];

export default function WorkspaceSection() {
  return (
    <section
      id="workspace"
      className="py-28 px-8 md:px-24 bg-gradient-to-b from-transparent to-primary/20"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Visual showcase */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7 }}
          className="landing-glass-card p-10 aspect-square flex items-center justify-center relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors duration-500" />
          <div className="relative text-center">
            <Scale className="w-48 h-48 text-teal-bright opacity-10 mx-auto mb-[-60px]" strokeWidth={0.5} />
            <div className="text-teal-bright text-7xl md:text-8xl font-black opacity-20 mb-4">
              ADVYON
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-white">The Unified Hub</h3>
            <p className="text-gray-400 mt-4 max-w-sm mx-auto">
              Seamlessly integrate case management, document handling, and AI
              assistance into one dashboard.
            </p>
          </div>
        </motion.div>

        {/* Feature list */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7 }}
        >
          <span className="landing-section-tag mb-6 inline-block">Smart Workspace</span>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-10 leading-tight text-white">
            Efficiency Through <br />
            Intelligent Design.
          </h2>

          <div className="space-y-8">
            {features.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="flex gap-6"
              >
                <div className="w-14 h-14 shrink-0 rounded-2xl bg-primary/20 border border-teal-accent/30 flex items-center justify-center text-teal-bright">
                  <feat.icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2 text-white">{feat.title}</h4>
                  <p className="text-gray-400 leading-relaxed">{feat.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
