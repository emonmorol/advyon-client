import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PublicPageLayout from '@/components/layout/PublicPageLayout';
import { PageHero } from '@/components/ui/PageHero';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { GlassCard } from '@/components/ui/GlassCard';
import { PlayCircle, FileText, Users, Settings, Search, CheckCircle } from 'lucide-react';
import { Input } from "@/components/ui/input";

import SystemBootLoader from '@/components/ui/SystemBootLoader';
import { useBootSequence } from '@/hooks/useBootSequence';

export default function HowToUsePage() {
  const { shouldBoot, completeBoot } = useBootSequence();
  const [activeStep, setActiveStep] = useState(0);

  if (shouldBoot) {
    return <SystemBootLoader onComplete={completeBoot} />;
  }

  const steps = [
      { 
          id: 0,
          title: "Setup Your Workspace",
          desc: "Create your organization, upload logo, and configure basic settings.",
          icon: Settings
      },
      { 
          id: 1,
          title: "Invite Your Team",
          desc: "Add attorneys, paralegals, and admins with granular permissions.",
          icon: Users 
      },
      { 
          id: 2,
          title: "Import Documents",
          desc: "Drag & drop your existing files. Our AI will tag and sort them automatically.",
          icon: FileText 
      },
      { 
          id: 3,
          title: "Start Automating",
          desc: "Set up your first workflow and watch the magic happen.",
          icon: PlayCircle 
      }
  ];

  return (
    <PublicPageLayout 
        title="How to Use Advyon" 
        description="Master the platform with guides, tutorials, and best practices."
    >
        <PageHero 
            title="Master the Platform"
            subtitle="Everything you need to go from beginner to power user in minutes."
            badge="Help Center"
        />

        <div className="relative max-w-xl mx-auto -mt-8 mb-20 z-20">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-500/50 h-5 w-5" />
                <Input 
                    type="text" 
                    placeholder="Search guides (e.g., &apos;Upload contract&apos;, &apos;Reset password&apos;)" 
                className="pl-12 h-14 bg-white/5 border-teal-500/20 text-white placeholder:text-emerald-100/30 rounded-xl focus-visible:ring-teal-500/50 backdrop-blur-xl"
            />
        </div>

        {/* QUICK START INTERACTIVE GUIDE */}
        <section className="py-20">
             <div className="container mx-auto px-6 lg:px-12">
                 <SectionHeader title="Quick Start Guide" subtitle="Get up and running in 4 easy steps." />
                 
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                     {/* Steps List */}
                     <div className="space-y-4">
                         {steps.map((step) => (
                             <div 
                                key={step.id} 
                                onClick={() => setActiveStep(step.id)}
                                className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 border ${
                                    activeStep === step.id 
                                    ? 'bg-teal-500/10 border-teal-500/40 translate-x-4' 
                                    : 'bg-white/5 border-transparent hover:bg-white/10'
                                }`}
                             >
                                 <div className="flex items-center gap-4">
                                     <div className={`p-3 rounded-xl ${activeStep === step.id ? 'bg-teal-500 text-teal-950' : 'bg-white/10 text-emerald-100'}`}>
                                         <step.icon className="h-6 w-6" />
                                     </div>
                                     <div>
                                         <h3 className={`text-lg font-bold mb-1 ${activeStep === step.id ? 'text-white' : 'text-emerald-100/70'}`}>
                                             {step.title}
                                         </h3>
                                         <p className="text-sm text-emerald-100/50">{step.desc}</p>
                                     </div>
                                 </div>
                             </div>
                         ))}
                     </div>
                     
                     {/* Preview Panel - Simulated Interface */}
                     <div className="relative h-[500px] w-full">
                         <AnimatePresence mode="wait">
                             <motion.div
                                key={activeStep}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.4 }}
                                className="absolute inset-0"
                             >
                                 <GlassCard className="h-full w-full flex items-center justify-center p-8 border-teal-500/30 bg-black/40">
                                     {/* This represents a screenshot/video of the interface */}
                                     <div className="text-center">
                                         <div className="w-20 h-20 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                            {(() => {
                                                const Icon = steps[activeStep].icon;
                                                return <Icon className="h-10 w-10 text-teal-300" />
                                            })()}
                                         </div>
                                         <div className="text-2xl font-bold text-white mb-4">Step {activeStep + 1}</div>
                                         <p className="text-emerald-100/60 max-w-sm mx-auto">
                                             Interactive preview for "{steps[activeStep].title}" would appear here.
                                         </p>
                                         <div className="mt-8 flex justify-center gap-2">
                                             <div className="h-2 w-16 bg-teal-500/20 rounded-full overflow-hidden">
                                                 <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: "100%" }}
                                                    className="h-full bg-teal-500"
                                                 />
                                             </div>
                                         </div>
                                     </div>
                                 </GlassCard>
                             </motion.div>
                         </AnimatePresence>
                     </div>
                 </div>
             </div>
        </section>

        {/* HELP TOPICS GRID */}
        <section className="py-20 bg-black/20">
             <div className="container mx-auto px-6 lg:px-12">
                 <SectionHeader title="Browse by Topic" />
                 
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     {["Getting Started", "Account Management", "Security & Privacy", "Billing", "API & Integrations", "Troubleshooting"].map((topic, i) => (
                         <GlassCard key={i} interactive className="hover:bg-teal-900/20 group">
                             <h4 className="font-bold text-lg text-white group-hover:text-teal-300 transition-colors mb-2">{topic}</h4>
                             <p className="text-sm text-emerald-100/50 mb-4">5 articles</p>
                             <div className="text-xs text-teal-400 font-medium flex items-center">
                                 View Articles <CheckCircle className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                             </div>
                         </GlassCard>
                     ))}
                 </div>
             </div>
        </section>

    </PublicPageLayout>
  );
}
